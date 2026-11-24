import { filterPortfolio, portfolio } from './inventory.mjs';

let records = portfolio().filter(item => item.channel === 'Offline');
let onlineState = 'loading';
const number = new Intl.NumberFormat('id-ID');
const date = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
});
const search = document.getElementById('search');
const filterButtons = [...document.querySelectorAll('#filters button')];
const tableRows = document.getElementById('rows');
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

function appendExpiry(list, label, qty, days) {
  const entry = document.createElement('li');
  const dateLabel = document.createElement('strong');
  dateLabel.textContent = label;
  const detail = document.createElement('span');
  detail.textContent = days === null
    ? number.format(qty) + ' pcs'
    : number.format(qty) + ' pcs · ' + (days === 0 ? 'hari ini' : number.format(days) + ' hari lagi');
  entry.append(dateLabel, detail);
  list.append(entry);
}

function expiryCell(row, record) {
  const td = cell(row, '—');
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
  document.getElementById('source-label').textContent = channel === 'Online' ? 'Google Sheets · Online' : 'Data contoh · Offline';
  const visible = filterPortfolio(records, channel, search.value)
    .filter(record => !riskFilter.value || statusOf(record)[1] === riskFilter.value);
  const knownRisk = visible.filter(record => record.risk !== null);
  document.getElementById('sku-count').textContent = number.format(visible.length);
  document.getElementById('risk-count').textContent = knownRisk.length
    ? number.format(knownRisk.reduce((total, record) => total + record.risk, 0)) : '—';
  document.getElementById('missing-count').textContent = number.format(visible.filter(record => record.incomplete).length);
  document.getElementById('result-count').textContent = number.format(visible.length) + ' hasil';
  tableRows.replaceChildren();

  if (!visible.length) {
    let label = 'Tidak ada produk yang cocok dengan filter dan pencarian.';
    if (channel === 'Online' && onlineState === 'loading') label = 'Memuat stok Online dari Google Sheets…';
    if (channel === 'Online' && onlineState === 'error') label = 'Data Online belum bisa dimuat. Muat ulang halaman untuk mencoba lagi.';
    const message = cell(tableRows.insertRow(), label, 'empty');
    message.colSpan = 6;
  }

  for (const record of visible) {
    const row = tableRows.insertRow();
    const product = cell(row, '', 'product');
    const title = document.createElement('strong');
    title.textContent = record.name;
    const sku = document.createElement('small');
    sku.textContent = record.sku;
    product.append(title, sku);
    cell(row, record.channel);
    cell(row, number.format(record.stock), 'numeric');
    expiryCell(row, record);
    cell(row, record.risk === null ? '—' : number.format(record.risk), record.risk > 0 ? 'numeric risk-value' : 'numeric');
    const [label, statusClass] = statusOf(record);
    const badge = document.createElement('span');
    badge.className = 'status ' + statusClass;
    badge.textContent = label;
    cell(row, '').append(badge);
  }
}

for (const button of filterButtons) {
  button.addEventListener('click', () => {
    channel = button.dataset.channel;
    for (const item of filterButtons) item.setAttribute('aria-pressed', String(item === button));
    draw();
  });
}
riskFilter.addEventListener('change', draw);
search.addEventListener('input', draw);
draw();

async function refreshOnline() {
  try {
    const response = await fetch('/api/online', {cache:'no-store'});
    if (!response.ok) throw new Error('Feed unavailable');
    const rows = await response.json();
    const online = rows.map(row => ({
      ...row, channel:'Online', expiries:row.expiries.map(e => ({...e, date:new Date(e.date + 'T00:00:00Z')}))
    }));
    records = [...records.filter(item => item.channel === 'Offline'), ...online];
    onlineState = 'ready';
  } catch {
    records = records.filter(item => item.channel === 'Offline');
    onlineState = 'error';
  }
  draw();
}
refreshOnline();
setInterval(refreshOnline, 300000);
