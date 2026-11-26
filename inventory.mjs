const dayMs = 86_400_000;

export function jakartaDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'Asia/Jakarta',
  }).formatToParts(now);
  const { year, month, day } = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return Date.UTC(Number(year), Number(month) - 1, Number(day));
}

function dateFromSheetValue(value) {
  if (value instanceof Date) return value;
  const text = String(value ?? '').trim();
  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) return new Date(Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])));
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function batchesFromRecord(product, today) {
  if (Array.isArray(product.batches)) return product.batches;
  const batches = [];
  for (const expiry of product.expiries ?? []) {
    const date = dateFromSheetValue(expiry.date);
    const qty = Number(expiry.qty);
    if (!date || !Number.isFinite(qty) || qty <= 0) continue;
    batches.push([Math.round((date.getTime() - today) / dayMs), qty]);
  }
  const undatedStock = Number(product.undatedStock ?? 0);
  if (Number.isFinite(undatedStock) && undatedStock > 0) batches.push([null, undatedStock]);
  return batches;
}

function salesMetrics(product) {
  const recent = product.channel === 'Offline'
    ? (product.monthlySales ?? []).slice(-6)
    : (product.sales ?? []).slice(-13);
  if (product.channel === 'Offline') {
    if (product.incomplete) return null;
    if (Number.isFinite(product.averageMonthlySales) && product.averageMonthlySales >= 0) {
      const averageMonthly = product.averageMonthlySales;
      const weekly = averageMonthly * 12 / 52;
      return { daily: weekly / 7, weekly, monthly: averageMonthly };
    }
    // Fallback: compute from completed filled months if Monthly AVG is unavailable.
    if (!recent.length || !recent.every(value => Number.isFinite(value) && value >= 0)) return null;
    const averageMonthly = recent.reduce((sum, value) => sum + value, 0) / recent.length;
    const weekly = averageMonthly * 12 / 52;
    return { daily: weekly / 7, weekly, monthly: averageMonthly };
  }
  if (recent.length !== 13 || !recent.every(value => Number.isFinite(value) && value >= 0)) return null;
  const averageWeekly = recent.reduce((sum, value) => sum + value, 0) / recent.length;
  return { daily: averageWeekly / 7, weekly: averageWeekly, monthly: averageWeekly * 52 / 12 };
}

export function estimateExpiryRisk(expiries, dailySales) {
  const sorted = [...expiries].sort((a, b) => a.days - b.days);
  const canEstimate = Number.isFinite(dailySales) && dailySales >= 0;
  let sold = 0;
  return sorted.map(expiry => {
    if (expiry.days < 0 || !canEstimate) return { ...expiry, riskQty: null };
    const capacity = Math.floor(dailySales * expiry.days + 1e-9);
    const soldFromBatch = Math.min(expiry.qty, Math.max(0, capacity - sold));
    sold += soldFromBatch;
    return { ...expiry, riskQty: expiry.qty - soldFromBatch };
  });
}

export function riskWithin(expiries, days) {
  const estimated = expiries.filter(expiry => expiry.riskQty !== null);
  if (!estimated.length) return null;
  return estimated.reduce((total, expiry) => total + (expiry.days <= days ? expiry.riskQty : 0), 0);
}

export function summarize(product, today = jakartaDay()) {
  const quantitiesByDay = new Map();
  let undatedStock = 0;
  let stock = 0;
  for (const [days, qty] of batchesFromRecord(product, today)) {
    if (!Number.isFinite(qty) || qty <= 0 || (days !== null && !Number.isFinite(days))) continue;
    if (days === null || days >= 0) stock += qty;
    if (days === null) undatedStock += qty;
    else quantitiesByDay.set(days, (quantitiesByDay.get(days) ?? 0) + qty);
  }
  const sales = salesMetrics(product);
  const expiries = estimateExpiryRisk([...quantitiesByDay].map(([days, qty]) => ({
    days, qty, date: new Date(today + days * dayMs),
  })), sales?.daily);
  const daysLeft = expiries.find(expiry => expiry.days >= 0)?.days ?? null;
  const expiredStock = expiries.reduce((total, expiry) => total + (expiry.days < 0 ? expiry.qty : 0), 0);
  return {
    ...product, stock, daysLeft, incomplete: Boolean(product.incomplete) || sales === null, risk: riskWithin(expiries, Infinity), undatedStock, expiredStock,
    averageMonthlySales: sales?.monthly ?? null,
    averageWeeklySales: sales?.weekly ?? null,
    averageDailySales: sales?.daily ?? null,
    stockCoverDays: sales?.daily > 0 ? stock / sales.daily : null,
    expiries,
  };
}

export function portfolio(records = [], today = jakartaDay()) {
  return records.map(product => summarize(product, today))
    .sort((a, b) => (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity));
}

export function filterPortfolio(products, channel, search) {
  const query = search.trim().toLowerCase();
  return products.filter(product =>
    (channel === 'all' || product.channel === channel) &&
    (product.sku.toLowerCase().includes(query) || product.name.toLowerCase().includes(query)));
}
