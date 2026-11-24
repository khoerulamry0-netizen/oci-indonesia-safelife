import { filterPortfolio, portfolio } from './inventory.mjs';

const translations = {
  id: {
    title: 'OCI Marketing Control Tower',
    subtitle: 'Pantau stok, risiko expired, dan peluang promosi berbasis data.',
    dashboard: 'Dashboard',
    inventory: 'Stok & inventori',
    primary_navigation: 'Navigasi utama',
    summary: 'Ringkasan hasil',
    sku_per_channel: 'SKU per channel',
    at_risk_stock: 'Stok berisiko expired',
    pcs_fefo: 'pcs · estimasi FEFO',
    at_risk_value: 'Modal risiko expired',
    cost_times_risk: 'product cost × qty risiko',
    urgent_expiry: 'Risiko ED ≤30 hari',
    urgent_expiry_detail: 'SKU berisiko',
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
    expiry_range: 'Rentang ED',
    expiry_0_30: '≤ 30 hari',
    expiry_31_90: '31–90 hari',
    expiry_91_180: '91–180 hari',
    expiry_180_plus: '> 180 hari',
    stock_cover_filter: 'Stock cover',
    all_stock_cover: 'Semua cover',
    sku_category_filter: 'Kategori SKU',
    all_sku_categories: 'Semua kategori',
    cover_0_30: '≤ 30 hari',
    cover_31_90: '31–90 hari',
    cover_91_180: '91–180 hari',
    cover_180_plus: '> 180 hari',
    cover_unknown: 'Tidak ada cover',
    risk_value_filter: 'Nilai risiko',
    all_risk_value: 'Semua nilai',
    risk_under_1m: '< IDR 1 juta',
    risk_1m_10m: 'IDR 1–10 juta',
    risk_over_10m: '> IDR 10 juta',
    risk_no_value: 'Tidak ada nilai',
    sales_velocity: 'Kecepatan sales',
    all_sales_velocity: 'Semua kecepatan',
    sales_high: 'Tinggi',
    sales_medium: 'Sedang',
    sales_low: 'Rendah',
    sales_no_sales: 'Tidak ada penjualan',
    reset_filters: 'Reset filter',
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
    pareto_summary_title: 'Pareto nilai risiko',
    pareto_summary_description: 'Bagian hijau menunjukkan porsi nilai risiko yang berasal dari SKU prioritas Pareto.',
    pareto_value_label: '{count} SKU · {percent}% nilai risiko',
    product_sku_id: 'Produk / SKU ID',
    channel: 'Channel',
    available_stock: 'Stok<br>tersedia',
    risk_value_idr: 'Nilai risiko expired<br>(Rp)',
    average_monthly_sales: 'Rata-rata sales<br>per bulan',
    average_weekly_sales: 'Rata-rata sales<br>per minggu',
    average_daily_sales: 'Rata-rata sales<br>per hari',
    stock_cover: 'Stock cover<br>(hari)',
    stock_cover_weeks: 'Stock cover<br>(minggu)',
    stock_cover_months: 'Stock cover<br>(bulan)',
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
    syncing_data: 'Sinkronisasi data…',
    synced_at: 'Tersinkronisasi {time}',
    sync_issue: 'Sinkronisasi perlu diperiksa',
  },
  en: {
    title: 'OCI Marketing Control Tower',
    subtitle: 'Monitor inventory, expiry risk, and data-driven promotion opportunities.',
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    primary_navigation: 'Primary navigation',
    summary: 'Results summary',
    sku_per_channel: 'SKUs per channel',
    at_risk_stock: 'Stock at expiry risk',
    pcs_fefo: 'pcs · FEFO estimate',
    at_risk_value: 'Expiry risk value',
    cost_times_risk: 'product cost × risk qty',
    urgent_expiry: 'Expiry risk ≤30 days',
    urgent_expiry_detail: 'SKUs at risk',
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
    expiry_range: 'Expiry range',
    expiry_0_30: '≤ 30 days',
    expiry_31_90: '31–90 days',
    expiry_91_180: '91–180 days',
    expiry_180_plus: '> 180 days',
    stock_cover_filter: 'Stock cover',
    all_stock_cover: 'All cover periods',
    sku_category_filter: 'SKU category',
    all_sku_categories: 'All categories',
    cover_0_30: '≤ 30 days',
    cover_31_90: '31–90 days',
    cover_91_180: '91–180 days',
    cover_180_plus: '> 180 days',
    cover_unknown: 'No cover data',
    risk_value_filter: 'Risk value',
    all_risk_value: 'All values',
    risk_under_1m: '< IDR 1 million',
    risk_1m_10m: 'IDR 1–10 million',
    risk_over_10m: '> IDR 10 million',
    risk_no_value: 'No value',
    sales_velocity: 'Sales velocity',
    all_sales_velocity: 'All velocities',
    sales_high: 'High',
    sales_medium: 'Medium',
    sales_low: 'Low',
    sales_no_sales: 'No sales',
    reset_filters: 'Reset filters',
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
    pareto_summary_title: 'Risk value Pareto',
    pareto_summary_description: 'The green section shows the share of risk value contributed by Pareto priority SKUs.',
    pareto_value_label: '{count} SKUs · {percent}% of risk value',
    product_sku_id: 'Product / SKU ID',
    channel: 'Channel',
    available_stock: 'Available<br>stock',
    risk_value_idr: 'Expiry risk value<br>(IDR)',
    average_monthly_sales: 'Average sales<br>per month',
    average_weekly_sales: 'Average sales<br>per week',
    average_daily_sales: 'Average sales<br>per day',
    stock_cover: 'Stock cover<br>(days)',
    stock_cover_weeks: 'Stock cover<br>(weeks)',
    stock_cover_months: 'Stock cover<br>(months)',
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
    syncing_data: 'Syncing data…',
    synced_at: 'Synced {time}',
    sync_issue: 'Sync needs attention',
  },
};

let locale = localStorage.getItem('oci-locale') === 'en' ? 'en' : 'id';
let number;
let salesNumber;
let rupiah;
let date;
let syncDate;

function t(key) {
  return translations[locale][key] ?? translations.id[key] ?? key;
}

function resetFormatters() {
  number = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'id-ID');
  salesNumber = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'id-ID', { maximumFractionDigits: 1 });
  rupiah = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'id-ID', {
    style: 'currency', currency: 'IDR', currencyDisplay: 'code', maximumFractionDigits: 0,
  });
  date = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'id-ID', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  });
  syncDate = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'id-ID', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

resetFormatters();

let records = [];
let offlineRecords = [];
let onlineRecords = [];
let offlineState = 'loading';
let onlineState = 'loading';
let lastSyncAt = null;
const search = document.getElementById('search');
const filterButtons = [...document.querySelectorAll('#filters button')];
const tableRows = document.getElementById('rows');
const tableWrap = document.querySelector('.table-wrap');
const tableScroll = document.querySelector('.table-scroll');
const stickyTableHead = document.getElementById('sticky-table-head');
const urgencyFilter = document.getElementById('urgency-filter');
const expiryRangeFilter = document.getElementById('expiry-range-filter');
const stockCoverFilter = document.getElementById('stock-cover-filter');
const skuCategoryPicker = document.getElementById('sku-category-picker');
const skuCategoryFilter = document.getElementById('sku-category-filter');
const riskValueFilter = document.getElementById('risk-value-filter');
const salesVelocityFilter = document.getElementById('sales-velocity-filter');
const prioritySort = document.getElementById('priority-sort');
const paretoFilter = document.getElementById('pareto-filter');
const exportExcelButton = document.getElementById('export-excel');
const resetFiltersButton = document.getElementById('reset-filters');
const syncStatus = document.getElementById('sync-status');
const languageButtons = {
  id: document.getElementById('language-id'),
  en: document.getElementById('language-en'),
};
let channel = 'Online';

function setupStickyTableHeader() {
  const sourceTable = tableScroll?.querySelector('table');
  const sourceHead = sourceTable?.querySelector('thead');
  if (!tableWrap || !tableScroll || !sourceTable || !sourceHead || !stickyTableHead) return;

  const stickyTable = sourceTable.cloneNode(false);
  stickyTable.append(sourceHead.cloneNode(true));
  stickyTableHead.replaceChildren(stickyTable);

  const sync = () => {
    const controls = document.querySelector('.inventory-controls');
    const controlsHeight = controls?.getBoundingClientRect().height ?? 0;
    const wrapRect = tableWrap.getBoundingClientRect();
    const sourceHeadRect = sourceHead.getBoundingClientRect();
    const sourceTableWidth = Math.max(sourceTable.getBoundingClientRect().width, sourceTable.scrollWidth);
    const pageScrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const tableTop = wrapRect.top + pageScrollTop;
    const tableBottom = tableTop + tableWrap.offsetHeight;
    const isInTable = pageScrollTop >= tableTop - controlsHeight
      && pageScrollTop < tableBottom - controlsHeight - sourceHeadRect.height;

    stickyTableHead.style.top = controlsHeight + 'px';
    stickyTableHead.style.left = wrapRect.left + 'px';
    stickyTableHead.style.width = wrapRect.width + 'px';
    stickyTableHead.style.height = sourceHeadRect.height + 'px';
    stickyTable.style.width = sourceTableWidth + 'px';
    stickyTable.style.minWidth = sourceTableWidth + 'px';
    stickyTable.style.transform = 'translateX(-' + tableScroll.scrollLeft + 'px)';
    stickyTableHead.classList.toggle('is-visible', isInTable);

    const sourceCells = sourceHead.querySelectorAll('th');
    const stickyCells = stickyTable.querySelectorAll('th');
    sourceCells.forEach((cell, index) => {
      if (stickyCells[index]) stickyCells[index].style.width = cell.getBoundingClientRect().width + 'px';
    });
  };

  tableScroll.addEventListener('scroll', sync, {passive: true});
  window.addEventListener('scroll', sync, {passive: true});
  document.addEventListener('scroll', sync, {passive: true, capture: true});
  window.addEventListener('resize', sync);
  sync();
}

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

function compactRiskValue(value) {
  if (!Number.isFinite(value)) return '—';
  const compact = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const prefix = locale === 'en' ? 'IDR ' : 'Rp';
  if (Math.abs(value) >= 1_000_000_000) {
    return prefix + compact.format(value / 1_000_000_000) + ' ' + (locale === 'en' ? 'billion' : 'miliar');
  }
  if (Math.abs(value) >= 1_000_000) {
    return prefix + compact.format(value / 1_000_000) + ' ' + (locale === 'en' ? 'million' : 'juta');
  }
  return rupiah.format(value);
}

function rangeBand(value) {
  if (!Number.isFinite(value)) return 'unknown';
  if (value <= 30) return '0-30';
  if (value <= 90) return '31-90';
  if (value <= 180) return '91-180';
  return '180-plus';
}

function expiryRangeBand(value) {
  return value === null ? 'no-date' : rangeBand(value);
}

function riskValueBand(record) {
  const value = pricedRiskValue(record);
  if (!Number.isFinite(value) || value <= 0) return 'no-value';
  if (value < 1_000_000) return 'under-1m';
  if (value <= 10_000_000) return '1m-10m';
  return 'over-10m';
}

function salesVelocityBand(record) {
  const value = record.averageMonthlySales;
  if (!Number.isFinite(value)) return 'missing';
  if (value <= 0) return 'no-sales';
  if (value < 100) return 'low';
  if (value <= 1_000) return 'medium';
  return 'high';
}

function salesFormat(value) {
  return Number.isFinite(value) ? salesNumber.format(value) : '—';
}

function stockCoverFormat(value) {
  return Number.isFinite(value) && value >= 0 ? salesNumber.format(value) : '—';
}

function stockCoverWeeksFormat(value) {
  return Number.isFinite(value) && value >= 0 ? stockCoverFormat(value / 7) : '—';
}

function stockCoverMonthsFormat(value) {
  return Number.isFinite(value) && value >= 0 ? stockCoverFormat(value / 30) : '—';
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

function updateSyncStatus() {
  syncStatus.classList.remove('is-ready', 'is-error');
  if (offlineState === 'loading' || onlineState === 'loading') {
    syncStatus.textContent = t('syncing_data');
    return;
  }
  if (offlineState === 'error' || onlineState === 'error') {
    syncStatus.textContent = t('sync_issue');
    syncStatus.classList.add('is-error');
    return;
  }
  syncStatus.textContent = t('synced_at').replace('{time}', syncDate.format(lastSyncAt ?? new Date()));
  syncStatus.classList.add('is-ready');
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
  document.querySelector('.table-wrap').setAttribute('aria-label', t('inventory_title'));
  languageButtons.id.setAttribute('aria-pressed', String(locale === 'id'));
  languageButtons.en.setAttribute('aria-pressed', String(locale === 'en'));
  updateSkuCategoryOptions();
  updateSkuCategoryVisibility();
  updateSyncStatus();
}

function updateSkuCategoryOptions() {
  const selected = skuCategoryFilter.value;
  const categories = [...new Set(onlineRecords
    .map(record => String(record.skuCategory ?? '').trim())
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, locale === 'en' ? 'en' : 'id'));
  skuCategoryFilter.replaceChildren();
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = t('all_sku_categories');
  skuCategoryFilter.append(allOption);
  for (const category of categories) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    skuCategoryFilter.append(option);
  }
  skuCategoryFilter.value = categories.includes(selected) ? selected : '';
}

function updateSkuCategoryVisibility() {
  const isOnline = channel === 'Online';
  skuCategoryPicker.hidden = !isOnline;
  skuCategoryFilter.disabled = !isOnline;
}

function visibleRecords() {
  const visible = filterPortfolio(records, channel, search.value)
    .filter(record => !riskFilter.value || statusOf(record)[1] === riskFilter.value)
    .filter(record => !urgencyFilter.value || (record.daysLeft !== null && record.daysLeft <= Number(urgencyFilter.value)))
    .filter(record => !expiryRangeFilter.value || expiryRangeBand(record.daysLeft) === expiryRangeFilter.value)
    .filter(record => !stockCoverFilter.value || rangeBand(record.stockCoverDays) === stockCoverFilter.value)
    .filter(record => channel !== 'Online' || !skuCategoryFilter.value || record.skuCategory === skuCategoryFilter.value)
    .filter(record => !riskValueFilter.value || riskValueBand(record) === riskValueFilter.value)
    .filter(record => !salesVelocityFilter.value || salesVelocityBand(record) === salesVelocityFilter.value)
    .filter(record => !paretoFilter.value || record.paretoStatus === paretoFilter.value);
  return visible.sort((a, b) => {
    if (prioritySort.value === 'days') return (a.daysLeft ?? Infinity) - (b.daysLeft ?? Infinity);
    if (prioritySort.value === 'qty') return (b.risk ?? -Infinity) - (a.risk ?? -Infinity);
    return (pricedRiskValue(b) ?? -Infinity) - (pricedRiskValue(a) ?? -Infinity);
  });
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
  const columns = [t('product_sku'), 'SKU', t('channel'), t('available_stock').replace('<br>', ' '), t('risk_value_idr').replace('<br>', ' '), t('average_monthly_sales').replace('<br>', ' '), t('average_daily_sales').replace('<br>', ' '), t('average_weekly_sales').replace('<br>', ' '), t('stock_cover').replace('<br>', ' '), t('stock_cover_weeks').replace('<br>', ' '), t('stock_cover_months').replace('<br>', ' '), t('expiry_date_qty'), t('expired_risk_pcs').replace('<br>', ' '), t('risk_status_header'), t('pareto')];
  const rows = visible.map(record => {
    const riskValue = pricedRiskValue(record);
    const [riskLabel] = statusOf(record);
    return [
      record.name,
      record.sku,
      channelLabel(record.channel),
      number.format(record.stock),
      Number.isFinite(riskValue) ? rupiah.format(riskValue) : '—',
      salesFormat(record.averageMonthlySales),
      salesFormat(record.averageDailySales),
      salesFormat(record.averageWeeklySales),
      stockCoverFormat(record.stockCoverDays),
      stockCoverWeeksFormat(record.stockCoverDays),
      stockCoverMonthsFormat(record.stockCoverDays),
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
  const urgent = visible.filter(record => record.risk > 0 && record.daysLeft !== null && record.daysLeft <= 30);
  document.getElementById('sku-count').textContent = number.format(visible.length);
  document.getElementById('risk-count').textContent = knownRisk.length
    ? number.format(knownRisk.reduce((total, record) => total + record.risk, 0)) : '\u2014';
  document.getElementById('risk-value-count').textContent = pricedRisk.length ? compactRiskValue(totalRiskValue) : '\u2014';
  document.getElementById('urgent-count').textContent = number.format(urgent.length);
  document.getElementById('result-count').textContent = t('result_count').replace('{count}', number.format(visible.length));
  tableRows.replaceChildren();

  if (!visible.length) {
    let label = t('no_match');
    if (channel === 'Offline' && offlineState === 'loading') label = t('loading_offline');
    if (channel === 'Offline' && offlineState === 'error') label = t('offline_error');
    if (channel === 'Online' && onlineState === 'loading') label = t('loading_online');
    if (channel === 'Online' && onlineState === 'error') label = t('online_error');
    const message = cell(tableRows.insertRow(), label, 'empty');
    message.colSpan = 13;
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
    cell(row, salesFormat(record.averageMonthlySales), 'numeric');
    cell(row, salesFormat(record.averageDailySales), 'numeric');
    cell(row, salesFormat(record.averageWeeklySales), 'numeric');
    cell(row, stockCoverFormat(record.stockCoverDays), 'numeric');
    cell(row, stockCoverWeeksFormat(record.stockCoverDays), 'numeric');
    cell(row, stockCoverMonthsFormat(record.stockCoverDays), 'numeric');
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
    if (channel !== 'Online') skuCategoryFilter.value = '';
    for (const item of filterButtons) item.setAttribute('aria-pressed', String(item === button));
    updateSkuCategoryVisibility();
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
expiryRangeFilter.addEventListener('change', draw);
stockCoverFilter.addEventListener('change', draw);
skuCategoryFilter.addEventListener('change', draw);
riskValueFilter.addEventListener('change', draw);
salesVelocityFilter.addEventListener('change', draw);
prioritySort.addEventListener('change', draw);
paretoFilter.addEventListener('change', draw);
search.addEventListener('input', draw);
exportExcelButton.addEventListener('click', exportExcelFile);
resetFiltersButton.addEventListener('click', () => {
  search.value = '';
  riskFilter.value = '';
  urgencyFilter.value = '';
  expiryRangeFilter.value = '';
  stockCoverFilter.value = '';
  skuCategoryFilter.value = '';
  riskValueFilter.value = '';
  salesVelocityFilter.value = '';
  prioritySort.value = 'value';
  paretoFilter.value = '';
  channel = 'Online';
  for (const button of filterButtons) button.setAttribute('aria-pressed', String(button.dataset.channel === channel));
  updateSkuCategoryVisibility();
  draw();
});
applyLanguage();
setupStickyTableHeader();
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
  if (offlineState === 'ready') lastSyncAt = new Date();
  updateSyncStatus();
  mergeRecords();
}

async function refreshOnline() {
  try {
    const response = await fetch('/api/online', {cache:'no-store'});
    if (!response.ok) throw new Error('Feed unavailable');
    const rows = await response.json();
    onlineRecords = rows.map(row => ({
      ...row, channel:'Online', productCost: row.productCost == null ? null : Number(row.productCost),
      stockCoverDays: Number(row.averageDailySales) > 0 ? Number(row.stock) / Number(row.averageDailySales) : null,
      expiries:row.expiries.map(e => ({...e, date:new Date(e.date + 'T00:00:00Z')}))
    }));
    updateSkuCategoryOptions();
    onlineState = 'ready';
  } catch (error) {
    console.error(error);
    onlineRecords = [];
    onlineState = 'error';
  }
  if (onlineState === 'ready') lastSyncAt = new Date();
  updateSyncStatus();
  mergeRecords();
}

refreshOffline();
refreshOnline();
setInterval(refreshOffline, 300000);
setInterval(refreshOnline, 300000);
