const dayMs = 86_400_000;

export function jakartaDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'Asia/Jakarta',
  }).formatToParts(now);
  const { year, month, day } = Object.fromEntries(parts.map(({type, value}) => [type, value]));
  return Date.UTC(Number(year), Number(month) - 1, Number(day));
}

const examples = [
  { sku: 'ON-101', name: 'Sunscreen Daily Shield SPF 50', channel: 'Online', batches: [[14, 300], [45, 250]], sales: [95, 100, 103, 110, 94, 101, 99, 97, 106, 98, 105, 100, 92] },
  { sku: 'ON-102', name: 'Hydrating Gel Cleanser', channel: 'Online', batches: [[38, 325]], sales: [33, 35, 36, null, 40, null, 39, 35, 41, null, null, null, null] },
  { sku: 'ON-103', name: 'Calming Sheet Mask', channel: 'Online', batches: [[63, 420]], sales: [48, 53, 56, 61, 58, 54, 52, 51, 57, 63, 55, 62, 48] },
  { sku: 'ON-104', name: 'Lip Balm Unscented', channel: 'Online', batches: [[null, 76]], sales: [4, 0, 5, 6, 5, 7, 5, 5, 6, 4, 5, 4, 6] },
  { sku: 'OF-201', name: 'Brightening Body Lotion', channel: 'Offline', batches: [[21, 210], [66, 410]], monthlySales: [145, 168, 155, 172, 160, 180] },
  { sku: 'OF-202', name: 'Barrier Repair Cream', channel: 'Offline', batches: [[48, 108], [84, 96]], monthlySales: [246, 239, 252, 241, 258, 249] },
  { sku: 'OF-203', name: 'Micellar Water 100 ml', channel: 'Offline', batches: [[25, 120]], monthlySales: [0, 0, 0, 0, 0, 0] },
  { sku: 'OF-204', name: 'Gentle Facial Toner', channel: 'Offline', batches: [[55, 160]], monthlySales: [88, 94, null, 98, 91, 102] },
];

function salesMetrics(product) {
  if (product.channel === 'Offline') {
    const recent = product.monthlySales.slice(-6);
    if (recent.length !== 6 || !recent.every(value => Number.isFinite(value) && value >= 0)) return null;
    const averageMonthly = recent.reduce((sum, value) => sum + value, 0) / recent.length;
    return { weekly: averageMonthly * 12 / 52, monthly: averageMonthly };
  }
  const recent = product.sales.slice(-13);
  if (recent.length !== 13 || !recent.every(value => Number.isFinite(value) && value >= 0)) return null;
  const averageWeekly = recent.reduce((sum, value) => sum + value, 0) / recent.length;
  return { weekly: averageWeekly, monthly: averageWeekly * 52 / 12 };
}

export function summarize(product, today) {
  const quantitiesByDay = new Map();
  let undatedStock = 0;
  let stock = 0;
  for (const [days, qty] of product.batches) {
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

export function portfolio(today = jakartaDay()) {
  return examples.map(product => summarize(product, today))
    .sort((a, b) => (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity));
}

export function filterPortfolio(products, channel, search) {
  const query = search.trim().toLowerCase();
  return products.filter(product =>
    (channel === 'all' || product.channel === channel) &&
    (product.sku.toLowerCase().includes(query) || product.name.toLowerCase().includes(query)));
}
