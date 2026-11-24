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
    if (recent.length !== 6 || !recent.every(value => Number.isFinite(value) && value >= 0)) return null;
    const averageMonthly = recent.reduce((sum, value) => sum + value, 0) / recent.length;
    return { weekly: averageMonthly * 12 / 52, monthly: averageMonthly };
  }
  if (recent.length !== 13 || !recent.every(value => Number.isFinite(value) && value >= 0)) return null;
  const averageWeekly = recent.reduce((sum, value) => sum + value, 0) / recent.length;
  return { weekly: averageWeekly, monthly: averageWeekly * 52 / 12 };
}

export function summarize(product, today = jakartaDay()) {
  const quantitiesByDay = new Map();
  let undatedStock = 0;
  let stock = 0;
  for (const [days, qty] of batchesFromRecord(product, today)) {
    if (qty <= 0 || (days !== null && (!Number.isFinite(days) || days < 0))) continue;
    stock += qty;
    if (days === null) undatedStock += qty;
    else quantitiesByDay.set(days, (quantitiesByDay.get(days) ?? 0) + qty);
  }
  const dated = [...quantitiesByDay].sort((a, b) => a[0] - b[0]);
  const daysLeft = dated[0]?.[0] ?? null;
  const sales = salesMetrics(product);
  const incomplete = sales === null;
  let risk = null;
  if (!incomplete && daysLeft !== null) {
    let cumulative = 0;
    let biggestShortfall = 0;
    for (const [days, qty] of dated) {
      cumulative += qty;
      biggestShortfall = Math.max(biggestShortfall, cumulative - sales.weekly * days / 7);
    }
    risk = Math.ceil(biggestShortfall);
  }
  return {
    ...product, stock, daysLeft, incomplete, risk, undatedStock,
    averageMonthlySales: sales?.monthly ?? null,
    expiries: dated.map(([days, qty]) => ({ days, qty, date: new Date(today + days * dayMs) })),
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
