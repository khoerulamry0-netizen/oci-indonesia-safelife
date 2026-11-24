import { filterPortfolio, portfolio } from './inventory.mjs';

let records = [];
let offlineRecords = [];
let onlineRecords = [];
let offlineState = 'loading';
let onlineState = 'loading';
const number = new Intl.NumberFormat('id-ID');
const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
});
const date = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
});
const search = document.getElementById('search');
const filterButtons = [...document.querySelectorAll('#filters button')];
const tableRows = document.getElementById('rows');
const priorityRows = document.getElementById('priority-rows');
const urgencyFilter = document.getElementById('urgency-filter');
const prioritySort = document.getElementById('priority-sort');
let channel = 'Online';

function cell(row, value, className = '') {
  const td = row.insertCell();
  td.textContent = value;
  td.className = className;
  return td;
}

const riskFilter = document.getElementById('risk-filter');

function statusOf(record) {
  if (record.incomplete) return ['Data sales belum lengkap', 'missing'];
  if (record.daysLeft === null) return ['Tidak ada ED', 'no-date'];
  return record.risk > 0 ? ['Berisiko expired', 'at-risk'] : ['Tidak ada estimasi risiko', 'clear'];
}

function pricedRiskValue(record) {
  return Number.isFinite(record.risk) && Number.isFinite(record.productCost)
    ? record.risk * record.productCost : null;
}

function marketingAction(record) {
  if (record.daysLeft !== null && record.daysLeft <= 30) return ['Promo segera', 'priority-urgent', 'Clearance / flash sale'];
  if (record.daysLeft !== null && record.daysLeft <= 60) return ['Prioritas tinggi', 'priority-high', 'Bundle / push campaign'];
  if (record.daysLeft !== null && record.daysLeft <= 90) return ['Prioritas promo', 'priority-medium', 'Masukkan campaign'];
  return ['Campaign terjadwal', 'priority-medium', 'Masukkan kalender promo'];
}

function drawPriorities(visible) {
  const maxDays = urgencyFilter.value ? Number(urgencyFilter.value) : null;
  const candidates = visible
    .filter(record => record.risk > 0 && pricedRiskValue(record) !== null)
    .filter(record => maxDays === null || (record.daysLeft !== null && record.daysLeft <= maxDays))
    .sort((a, b) => {
      if (prioritySort.value === 'days') return (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity);
      if (prioritySort.value === 'qty') return b.risk - a.risk;
      return pricedRiskValue(b) - pricedRiskValue(a);
    })
    .slice(0, 10);
  priorityRows.replaceChildren();
  if (!candidates.length) {
    const message = cell(priorityRows.insertRow(), 'Belum ada produk prioritas pada filter ini.', 'empty');
    message.colSpan = 6;
    return;
  }
  for (const record of candidates) {
    const row = priorityRows.insertRow();
    const product = cell(row, '', 'product');
    const title = document.createElement('strong');
    title.textContent = record.name;
    const sku = document.createElement('small');
    sku.textContent = record.sku;
    product.append(title, sku);
    const expiry = record.expiries[0];
    cell(row, expiry ? date.format(expiry.date) + ' \u00b7 ' + number.format(record.daysLeft) + ' hari' : '\u2014');
    cell(row, number.format(record.risk), 'numeric risk-value');
    cell(row, rupiah.format(pricedRiskValue(record)), 'numeric risk-value');
    cell(row, Number.isFinite(record.averageMonthlySales) ? number.format(Math.round(record.averageMonthlySales)) : '—', 'numeric');
    const [label, statusClass, action] = marketingAction(record);
    const actionCell = cell(row, '');
    const badge = document.createElement('span');
    badge.className = 'priority-status ' + statusClass;
    badge.textContent = label;
    const detail = document.createElement('small');
    detail.textContent = action;
    actionCell.append(badge, detail);
  }
}

function appendExpiry(list, label, qty, days) {
  const entry = document.createElement('li');
  const dateLabel = document.createElement('strong');
  dateLabel.textContent = label;
  const detail = document.createElement('span');
  detail.textContent = days === null
    ? number.format(qty) + ' pcs'
    : number.format(qty) + ' pcs \u00b7 ' + (days === 0 ? 'hari ini' : number.format(days) + ' hari lagi');
  entry.append(dateLabel, detail);
  list.append(entry);
}

function expiryCell(row, record) {
  const td = cell(row, '\u2014');
  if (!record.expiries.length && !record.undatedStock) return;
  const list = document.createElement('ul');
  list.className = 'expiry-list';
  for (const expiry of record.expiries) {
    appendExpiry(list, date.format(expiry.date), expiry.qty, expiry.days);
  }
  if (record.undatedStock) appendExpiry(list, 'Tanpa ED', record.undatedStock, null);
  td.replaceChildren(list);
}

function draw() {
  document.getElementById('source-label').textContent = channel === 'Online'
    ? 'Google Sheets \u00b7 Online + Master Cost'
    : 'Google Sheets \u00b7 CLUSTERING OFFLINE + Master Cost';
  const visible = filterPortfolio(records, channel, search.value)
    .filter(record => !riskFilter.value || statusOf(record)[1] === riskFilter.value);
  const knownRisk = visible.filter(record => record.risk !== null);
  const pricedRisk = visible.filter(record => pricedRiskValue(record) !== null);
  const totalRiskValue = pricedRisk.reduce((total, record) => total + pricedRiskValue(record), 0);
  document.getElementById('sku-count').textContent = number.format(visible.length);
  document.getElementById('risk-count').textContent = knownRisk.length
    ? number.format(knownRisk.reduce((total, record) => total + record.risk, 0)) : '\u2014';
  document.getElementById('risk-value-count').textContent = pricedRisk.length ? rupiah.format(totalRiskValue) : '\u2014';
  document.getElementById('missing-count').textContent = number.format(visible.filter(record => record.incomplete).length);
  document.getElementById('result-count').textContent = number.format(visible.length) + ' hasil';
  drawPriorities(visible);
  tableRows.replaceChildren();

  if (!visible.length) {
    let label = 'Tidak ada produk yang cocok dengan filter dan pencarian.';
    if (channel === 'Offline' && offlineState === 'loading') label = 'Memuat data Offline dari Google Sheets\u2026';
    if (channel === 'Offline' && offlineState === 'error') label = 'Sinkronisasi data Offline gagal. Tidak ada data contoh yang ditampilkan.';
    if (channel === 'Online' && onlineState === 'loading') label = 'Memuat stok Online dari Google Sheets\u2026';
    if (channel === 'Online' && onlineState === 'error') label = 'Data Online belum bisa dimuat. Muat ulang halaman untuk mencoba lagi.';
    const message = cell(tableRows.insertRow(), label, 'empty');
    message.colSpan = 8;
  }

  for (const record of visible) {
    const row = tableRows.insertRow();
    const riskValue = pricedRiskValue(record);
    const product = cell(row, '', 'product');
    const title = document.createElement('strong');
    title.textContent = record.name;
    const sku = document.createElement('small');
    sku.textContent = record.sku;
    product.append(title, sku);
    cell(row, record.channel);
    cell(row, number.format(record.stock), 'numeric');
    cell(row, Number.isFinite(riskValue)
      ? rupiah.format(riskValue) : '\u2014', 'numeric');
    cell(row, Number.isFinite(record.averageMonthlySales)
      ? number.format(Math.round(record.averageMonthlySales)) : '\u2014', 'numeric');
    expiryCell(row, record);
    cell(row, record.risk === null ? '\u2014' : number.format(record.risk), record.risk > 0 ? 'numeric risk-value' : 'numeric');
    const [label, statusClass] = statusOf(record);
    const badge = document.createElement('span');
    badge.className = 'status ' + statusClass;
    badge.textContent = label;
    cell(row, '').append(badge);
  }
}

function mergeRecords() {
  records = [...offlineRecords, ...onlineRecords];
  draw();
}

for (const button of filterButtons) {
  button.addEventListener('click', () => {
    channel = button.dataset.channel;
    for (const item of filterButtons) item.setAttribute('aria-pressed', String(item === button));
    draw();
  });
}
riskFilter.addEventListener('change', draw);
urgencyFilter.addEventListener('change', draw);
prioritySort.addEventListener('change', draw);
search.addEventListener('input', draw);
draw();

async function refreshOffline() {
  try {
    const response = await fetch('/api/offline', {cache:'no-store'});
    if (!response.ok) throw new Error('Offline sheet unavailable');
    const payload = await response.json();
    if (!Array.isArray(payload.records)) throw new Error('Offline sheet returned invalid data');
    offlineRecords = portfolio(payload.records).filter(item => item.channel === 'Offline');
    offlineState = 'ready';
  } catch (error) {
    console.error(error);
    offlineRecords = [];
    offlineState = 'error';
  }
  mergeRecords();
}

async function refreshOnline() {
  try {
    const response = await fetch('/api/online', {cache:'no-store'});
    if (!response.ok) throw new Error('Feed unavailable');
    const rows = await response.json();
    onlineRecords = rows.map(row => ({
      ...row, channel:'Online', productCost: row.productCost == null ? null : Number(row.productCost),
      expiries:row.expiries.map(e => ({...e, date:new Date(e.date + 'T00:00:00Z')}))
    }));
    onlineState = 'ready';
  } catch (error) {
    console.error(error);
    onlineRecords = [];
    onlineState = 'error';
  }
  mergeRecords();
}

refreshOffline();
refreshOnline();
setInterval(refreshOffline, 300000);
setInterval(refreshOnline, 300000);
