import { filterPortfolio, portfolio } from './inventory.mjs';

const translations = {
  id: {
    title: 'OCI Marketing Control Tower',
    subtitle: 'Pantau stok, risiko expired, dan peluang promosi berbasis data.',
    summary: 'Ringkasan hasil',
    sku_per_channel: 'SKU per channel',
    at_risk_stock: 'Stok berisiko expired',
    pcs_fefo: 'pcs · estimasi FEFO',
    at_risk_value: 'Modal stok berisiko expired',
    cost_times_risk: 'product cost × qty risiko',
    incomplete_sales: 'Data sales belum lengkap',
    inventory_title: 'Daftar stok',
    inventory_description: 'Online memakai 13 minggu shipment terakhir yang sudah tutup. Offline membaca tab CLUSTERING OFFLINE, rata-rata penjualan 6 bulan terakhir, dan PARETO OFFLINE. Cost kedua channel dipetakan dari tab Master Cost.',
    search_label: 'Cari SKU atau nama produk',
    search_placeholder: 'Cari SKU atau nama produk',
    online: 'Online',
    offline_monthly: 'Offline · bulanan',
    risk_status: 'Status risiko',
    all_status: 'Semua status',
    at_risk: 'Berisiko expired',
    no_risk_estimate: 'Tidak ada estimasi risiko',
    no_expiry_date: 'Tidak ada ED',
    export_excel: 'Export Excel',
    priority_title: 'Top 10 Prioritas Promo',
    priority_description: 'Produk dengan risiko expired dan nilai modal terbesar untuk ditindaklanjuti marketing.',
    expiry_urgency: 'Urgensi ED',
    all_expiry: 'Semua ED',
    within_30_days: '≤ 30 hari',
    within_60_days: '≤ 60 hari',
    within_90_days: '≤ 90 hari',
    sort_by: 'Urutkan',
    sort_value: 'Modal risiko terbesar',
    sort_days: 'ED terdekat',
    sort_qty: 'Qty risiko terbesar',
    pareto: 'Pareto',
    pareto_80: 'Pareto 80%',
    non_pareto: 'Non Pareto',
    no_sales: 'Tidak ada penjualan',
    product_sku: 'Produk / SKU',
    nearest_expiry: 'ED terdekat',
    risk_qty: 'Qty risiko',
    risk_value: 'Modal risiko',
    monthly_sales: 'Sales / bulan',
    recommended_action: 'Rekomendasi aksi',
    product_sku_id: 'Produk / SKU ID',
    channel: 'Channel',
    available_stock: 'Stok<br>tersedia',
    risk_value_idr: 'Nilai risiko expired<br>(Rp)',
    average_monthly_sales: 'Rata-rata sales<br>per bulan',
    expiry_date_qty: 'Expired date / qty',
    expired_risk_pcs: 'Risiko expired<br>(pcs)',
    risk_status_header: 'Status risiko',
    method_title: 'Cara estimasi risiko expired',
    method_description: 'FEFO mengasumsikan stok dengan tanggal expired paling dekat keluar dulu. Online memakai rata-rata shipment 13 minggu. Offline memakai rata-rata penjualan 6 bulan dari Google Sheets yang dikonversi ke mingguan dengan mengalikan 12 lalu membagi 52. Angka 0 dan tanda "-" dihitung sebagai tidak ada penjualan. Jika sinkronisasi atau data sales gagal, estimasi ditahan dan tidak diganti data contoh.',
    online_source: 'Google Sheets · Online + Master Cost',
    offline_source: 'Google Sheets · Offline + Pareto Offline',
    without_expiry: 'Tanpa ED',
    unmapped: 'Belum dipetakan',
    today: 'hari ini',
    days_left: 'hari lagi',
    no_priority: 'Belum ada produk prioritas pada filter ini.',
    result_count: '{count} hasil',
    no_match: 'Tidak ada produk yang cocok dengan filter dan pencarian.',
    loading_offline: 'Memuat data Offline dari Google Sheets…',
    offline_error: 'Sinkronisasi data Offline gagal. Tidak ada data contoh yang ditampilkan.',
    loading_online: 'Memuat stok Online dari Google Sheets…',
    online_error: 'Data Online belum bisa dimuat. Muat ulang halaman untuk mencoba lagi.',
    promo_now: 'Promo segera',
    promo_now_detail: 'Clearance / flash sale',
    high_priority: 'Prioritas tinggi',
    high_priority_detail: 'Bundle / push campaign',
    promo_priority: 'Prioritas promo',
    promo_priority_detail: 'Masukkan campaign',
    scheduled_campaign: 'Campaign terjadwal',
    scheduled_campaign_detail: 'Masukkan kalender promo',
    no_sales_status: 'Tidak ada penjualan',
    no_expiry_status: 'Tidak ada ED',
  },
  en: {
    title: 'OCI Marketing Control Tower',
    subtitle: 'Monitor inventory, expiry risk, and data-driven promotion opportunities.',
    summary: 'Results summary',
    sku_per_channel: 'SKUs per channel',
    at_risk_stock: 'Stock at expiry risk',
    pcs_fefo: 'pcs · FEFO estimate',
    at_risk_value: 'Value of stock at expiry risk',
    cost_times_risk: 'product cost × risk qty',
    incomplete_sales: 'Incomplete sales data',
    inventory_title: 'Inventory list',
    inventory_description: 'Online uses the latest 13 closed shipment weeks. Offline reads CLUSTERING OFFLINE, the latest 6-month average sales, and PARETO OFFLINE. Cost for both channels is mapped from the Master Cost tab.',
    search_label: 'Search SKU or product name',
    search_placeholder: 'Search SKU or product name',
    online: 'Online',
    offline_monthly: 'Offline · monthly',
    risk_status: 'Risk status',
    all_status: 'All statuses',
    at_risk: 'At expiry risk',
    no_risk_estimate: 'No estimated risk',
    no_expiry_date: 'No expiry date',
    export_excel: 'Export Excel',
    priority_title: 'Top 10 Promotion Priorities',
    priority_description: 'Products with the highest expiry risk and inventory value for marketing follow-up.',
    expiry_urgency: 'Expiry urgency',
    all_expiry: 'All expiry dates',
    within_30_days: '≤ 30 days',
    within_60_days: '≤ 60 days',
    within_90_days: '≤ 90 days',
    sort_by: 'Sort by',
    sort_value: 'Highest risk value',
    sort_days: 'Nearest expiry',
    sort_qty: 'Highest risk quantity',
    pareto: 'Pareto',
    pareto_80: 'Pareto 80%',
    non_pareto: 'Non-Pareto',
    no_sales: 'No sales',
    product_sku: 'Product / SKU',
    nearest_expiry: 'Nearest expiry',
    risk_qty: 'Risk qty',
    risk_value: 'Risk value',
    monthly_sales: 'Sales / month',
    recommended_action: 'Recommended action',
    product_sku_id: 'Product / SKU ID',
    channel: 'Channel',
    available_stock: 'Available<br>stock',
    risk_value_idr: 'Expiry risk value<br>(IDR)',
    average_monthly_sales: 'Average sales<br>per month',
    expiry_date_qty: 'Expiry date / qty',
    expired_risk_pcs: 'Expiry risk<br>(pcs)',
    risk_status_header: 'Risk status',
    method_title: 'How expiry risk is estimated',
    method_description: 'FEFO assumes stock with the nearest expiry date is sold first. Online uses the average of the latest 13 shipment weeks. Offline uses the latest 6 months of Google Sheets sales, converted to a weekly rate by multiplying by 12 and dividing by 52. Zeros and "-" are treated as no sales. If synchronization or sales data fails, the estimate is withheld and no sample data is shown.',
    online_source: 'Google Sheets · Online + Master Cost',
    offline_source: 'Google Sheets · Offline + Pareto Offline',
    without_expiry: 'No expiry date',
    unmapped: 'Not mapped',
    today: 'today',
    days_left: 'days left',
    no_priority: 'No priority products match these filters.',
    result_count: '{count} results',
    no_match: 'No products match the current filters and search.',
    loading_offline: 'Loading Offline data from Google Sheets…',
    offline_error: 'Offline data synchronization failed. No sample data is shown.',
    loading_online: 'Loading Online inventory from Google Sheets…',
    online_error: 'Online data is unavailable. Reload the page to try again.',
    promo_now: 'Promote now',
    promo_now_detail: 'Clearance / flash sale',
    high_priority: 'High priority',
    high_priority_detail: 'Bundle / push campaign',
    promo_priority: 'Promotion priority',
    promo_priority_detail: 'Add to campaign',
    scheduled_campaign: 'Scheduled campaign',
    scheduled_campaign_detail: 'Add to promotion calendar',
    no_sales_status: 'No sales',
    no_expiry_status: 'No expiry date',
  },
};

let locale = localStorage.getItem('oci-locale') === 'en' ? 'en' : 'id';
let number;
let rupiah;
let date;

function t(key) {
  return translations[locale][key] ?? translations.id[key] ?? key;
}

function resetFormatters() {
  number = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'id-ID');
  rupiah = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'id-ID', {
    style: 'currency', currency: 'IDR', currencyDisplay: 'code', maximumFractionDigits: 0,
  });
  date = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'id-ID', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  });
}

resetFormatters();

let records = [];
let offlineRecords = [];
let onlineRecords = [];
let offlineState = 'loading';
let onlineState = 'loading';
const search = document.getElementById('search');
const filterButtons = [...document.querySelectorAll('#filters button')];
const tableRows = document.getElementById('rows');
const priorityRows = document.getElementById('priority-rows');
const urgencyFilter = document.getElementById('urgency-filter');
const prioritySort = document.getElementById('priority-sort');
const paretoFilter = document.getElementById('pareto-filter');
const exportExcelButton = document.getElementById('export-excel');
const languageButtons = {
  id: document.getElementById('language-id'),
  en: document.getElementById('language-en'),
};
let channel = 'Online';

function cell(row, value, className = '') {
  const td = row.insertCell();
  td.textContent = value;
  td.className = className;
  return td;
}

const riskFilter = document.getElementById('risk-filter');

function statusOf(record) {
  if (record.incomplete) return [t('incomplete_sales'), 'missing'];
  if (record.daysLeft === null) return [t('no_expiry_status'), 'no-date'];
  return record.risk > 0 ? [t('at_risk'), 'at-risk'] : [t('no_risk_estimate'), 'clear'];
}

function pricedRiskValue(record) {
  return Number.isFinite(record.risk) && Number.isFinite(record.productCost)
    ? record.risk * record.productCost : null;
}

function marketingAction(record) {
  if (record.daysLeft !== null && record.daysLeft <= 30) return [t('promo_now'), 'priority-urgent', t('promo_now_detail')];
  if (record.daysLeft !== null && record.daysLeft <= 60) return [t('high_priority'), 'priority-high', t('high_priority_detail')];
  if (record.daysLeft !== null && record.daysLeft <= 90) return [t('promo_priority'), 'priority-medium', t('promo_priority_detail')];
  return [t('scheduled_campaign'), 'priority-medium', t('scheduled_campaign_detail')];
}

function channelLabel(value) {
  return value === 'Offline' ? t('offline_monthly') : t('online');
}

function paretoLabel(value) {
  if (value === 'Pareto 80%') return t('pareto_80');
  if (value === 'Non Pareto') return t('non_pareto');
  if (value === 'Tidak ada penjualan') return t('no_sales_status');
  return value || t('unmapped');
}

function applyLanguage() {
  document.documentElement.lang = locale;
  for (const element of document.querySelectorAll('[data-i18n]')) {
    const value = t(element.dataset.i18n);
    if (element.tagName === 'OPTION' || element.tagName === 'BUTTON' || element.tagName === 'SUMMARY') {
      element.textContent = value;
    } else {
      element.innerHTML = value;
    }
  }
  for (const element of document.querySelectorAll('[data-i18n-aria]')) {
    element.setAttribute('aria-label', t(element.dataset.i18nAria));
  }
  search.placeholder = t('search_placeholder');
  document.querySelector('.filters').setAttribute('aria-label', t('channel'));
  document.querySelector('.priority-table-wrap').setAttribute('aria-label', t('priority_title'));
  document.querySelector('.table-wrap').setAttribute('aria-label', t('inventory_title'));
  languageButtons.id.setAttribute('aria-pressed', String(locale === 'id'));
  languageButtons.en.setAttribute('aria-pressed', String(locale === 'en'));
}

function visibleRecords() {
  return filterPortfolio(records, channel, search.value)
    .filter(record => !riskFilter.value || statusOf(record)[1] === riskFilter.value);
}

function expiryText(record) {
  const labels = record.expiries.map(expiry => date.format(expiry.date) + ' · ' + number.format(expiry.qty) + ' pcs');
  if (record.undatedStock) labels.push(t('without_expiry') + ' · ' + number.format(record.undatedStock) + ' pcs');
  return labels.join(' | ') || '—';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function exportExcelFile() {
  const visible = visibleRecords();
  const columns = [t('product_sku'), 'SKU', t('channel'), t('available_stock').replace('<br>', ' '), t('risk_value_idr').replace('<br>', ' '), t('average_monthly_sales').replace('<br>', ' '), t('expiry_date_qty'), t('expired_risk_pcs').replace('<br>', ' '), t('risk_status_header'), t('pareto')];
  const rows = visible.map(record => {
    const riskValue = pricedRiskValue(record);
    const [riskLabel] = statusOf(record);
    return [
      record.name,
      record.sku,
      channelLabel(record.channel),
      number.format(record.stock),
      Number.isFinite(riskValue) ? rupiah.format(riskValue) : '—',
      Number.isFinite(record.averageMonthlySales) ? number.format(Math.round(record.averageMonthlySales)) : '—',
      expiryText(record),
      record.risk === null ? '—' : number.format(record.risk),
      riskLabel,
      paretoLabel(record.paretoStatus),
    ];
  });
  const headerRow = '<tr>' + columns.map(value => '<th>' + escapeHtml(value) + '</th>').join('') + '</tr>';
  const bodyRows = rows.map(row => '<tr>' + row.map(value => '<td>' + escapeHtml(value) + '</td>').join('') + '</tr>').join('');
  const workbook = '<!doctype html><html><head><meta charset="utf-8"><title>OCI Marketing Control Tower</title></head><body>'
    + '<h2>OCI Marketing Control Tower</h2><p>' + escapeHtml(t('channel')) + ': ' + escapeHtml(channelLabel(channel)) + ' · ' + escapeHtml(locale === 'en' ? 'Exported from the active view' : 'Diekspor dari tampilan aktif') + '</p>'
    + '<table border="1"><thead>' + headerRow + '</thead><tbody>' + bodyRows + '</tbody></table></body></html>';
  const blob = new Blob(['\ufeff', workbook], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'oci-marketing-control-tower-' + locale + '-' + channel.toLowerCase() + '-' + new Date().toISOString().slice(0, 10) + '.xls';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function drawPriorities(visible) {
  const maxDays = urgencyFilter.value ? Number(urgencyFilter.value) : null;
  const candidates = visible
    .filter(record => record.risk > 0 && pricedRiskValue(record) !== null)
    .filter(record => maxDays === null || (record.daysLeft !== null && record.daysLeft <= maxDays))
    .filter(record => !paretoFilter.value || record.paretoStatus === paretoFilter.value)
    .sort((a, b) => {
      if (prioritySort.value === 'days') return (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity);
      if (prioritySort.value === 'qty') return b.risk - a.risk;
      return pricedRiskValue(b) - pricedRiskValue(a);
    })
    .slice(0, 10);
  priorityRows.replaceChildren();
  if (!candidates.length) {
    const message = cell(priorityRows.insertRow(), t('no_priority'), 'empty');
    message.colSpan = 7;
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
    const paretoCell = cell(row, '');
    const paretoBadge = document.createElement('span');
    const paretoClass = record.paretoStatus === 'Pareto 80%'
      ? 'priority-pareto'
      : record.paretoStatus === 'Tidak ada penjualan' ? 'priority-no-sales' : 'priority-non-pareto';
    paretoBadge.className = 'priority-status ' + paretoClass;
    paretoBadge.textContent = paretoLabel(record.paretoStatus);
    paretoCell.append(paretoBadge);
    const expiry = record.expiries[0];
    cell(row, expiry ? date.format(expiry.date) + ' \u00b7 ' + number.format(record.daysLeft) + ' ' + t('days_left') : '\u2014');
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
    : number.format(qty) + ' pcs \u00b7 ' + (days === 0 ? t('today') : number.format(days) + ' ' + t('days_left'));
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
  if (record.undatedStock) appendExpiry(list, t('without_expiry'), record.undatedStock, null);
  td.replaceChildren(list);
}

function draw() {
  document.getElementById('source-label').textContent = channel === 'Online'
    ? t('online_source')
    : t('offline_source');
  const visible = visibleRecords();
  const knownRisk = visible.filter(record => record.risk !== null);
  const pricedRisk = visible.filter(record => pricedRiskValue(record) !== null);
  const totalRiskValue = pricedRisk.reduce((total, record) => total + pricedRiskValue(record), 0);
  document.getElementById('sku-count').textContent = number.format(visible.length);
  document.getElementById('risk-count').textContent = knownRisk.length
    ? number.format(knownRisk.reduce((total, record) => total + record.risk, 0)) : '\u2014';
  document.getElementById('risk-value-count').textContent = pricedRisk.length ? rupiah.format(totalRiskValue) : '\u2014';
  document.getElementById('missing-count').textContent = number.format(visible.filter(record => record.incomplete).length);
  document.getElementById('result-count').textContent = t('result_count').replace('{count}', number.format(visible.length));
  drawPriorities(visible);
  tableRows.replaceChildren();

  if (!visible.length) {
    let label = t('no_match');
    if (channel === 'Offline' && offlineState === 'loading') label = t('loading_offline');
    if (channel === 'Offline' && offlineState === 'error') label = t('offline_error');
    if (channel === 'Online' && onlineState === 'loading') label = t('loading_online');
    if (channel === 'Online' && onlineState === 'error') label = t('online_error');
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
    cell(row, channelLabel(record.channel));
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

for (const [nextLocale, button] of Object.entries(languageButtons)) {
  button.addEventListener('click', () => {
    locale = nextLocale;
    localStorage.setItem('oci-locale', locale);
    resetFormatters();
    applyLanguage();
    draw();
  });
}
riskFilter.addEventListener('change', draw);
urgencyFilter.addEventListener('change', draw);
prioritySort.addEventListener('change', draw);
paretoFilter.addEventListener('change', draw);
search.addEventListener('input', draw);
exportExcelButton.addEventListener('click', exportExcelFile);
applyLanguage();
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
