import { estimateExpiryRisk, filterPortfolio, jakartaDay, portfolio, riskWithin } from './inventory.mjs';

const translations = {
  id: {
    brand_title: 'Marketing Control',
    method_short: 'Metodologi',
    method_eyebrow: 'Metodologi FEFO',
    data_sources_title: 'Sumber data',
    batch_method_title: 'Estimasi per batch',
    fefo_rules_title: 'Aturan perhitungan FEFO',
    close_dialog: 'Mengerti',
    active_sku_sub: 'SKU aktif terpantau',
    quick_all: 'Semua',
    quick_ed_90: 'ED ≤ 90 hari',
    quick_ed_180: 'ED ≤ 180 hari',
    advanced_filters_title: 'Filter & Urutkan',
    apply_filters: 'Selesai',
    clear_all_filters: 'Hapus semua',
    summary_channel: 'Ringkasan channel',
    summary_filtered: 'Ringkasan hasil filter',
    expired_stock: 'Stok sudah expired',
    expired_source_unknown: 'Tidak tersedia dari sumber Online',
    expired_qty: 'sudah expired',
    batch_risk: 'berisiko',
    batch_risk_unknown: 'Estimasi belum tersedia',
    batch_method: 'Estimasi per tanggal memakai laju penjualan rata-rata. Stok yang sudah melewati ED dipisahkan dari stok tersedia dan estimasi risiko.',
    filter_button: 'Filter',
    average_sales: 'Rata-rata sales',
    day_unit: 'Hari',
    week_unit: 'Minggu',
    month_unit: 'Bulan',
    nearest_expiry_short: 'ED terdekat',
    risk_qty_short: 'Qty berisiko',
    risk_value_short: 'Nilai risiko',
    stock_details: 'Detail stok & batch',
    title: 'O.TWO.O COSMETIC INDONESIA MARKETING CONTROL',
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
    urgent_expiry_detail: 'pcs · estimasi FEFO',
    incomplete_sales: 'Data sales belum lengkap',
    inventory_title: 'Daftar stok',
    inventory_description: 'Online memakai 13 minggu shipment terakhir yang sudah tutup. Offline membaca tab CLUSTERING OFFLINE, rata-rata penjualan 6 bulan terakhir, dan PARETO OFFLINE. Cost kedua channel dipetakan dari tab Master Cost.',
    search_label: 'Cari SKU atau nama produk',
    search_placeholder: 'Cari SKU atau nama produk…',
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
    expiry_urgency: 'Risiko ED',
    all_expiry_risk: 'Semua risiko ED',
    risk_within_30_days: 'Risiko ≤ 30 hari',
    risk_within_60_days: 'Risiko ≤ 60 hari',
    risk_within_90_days: 'Risiko ≤ 90 hari',
    risk_within_180_days: 'Risiko ≤ 180 hari',
    all_expiry: 'Semua ED',
    within_30_days: '≤ 30 hari',
    within_60_days: '≤ 60 hari',
    within_90_days: '≤ 90 hari',
    expiry_range: 'Rentang ED',
    expiry_0_30: '≤ 30 hari',
    expiry_0_90: '≤ 90 hari',
    expiry_0_180: '≤ 180 hari',
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
    risk_value_idr: 'Nilai risiko<br>(Rp)',
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
    method_description: 'FEFO mengasumsikan stok dengan tanggal expired paling dekat keluar dulu. Online memakai rata-rata shipment 13 minggu. Offline memakai rata-rata penjualan maksimal 6 bulan terakhir yang sudah selesai dan sudah terisi di Google Sheets (bulan berjalan dan bulan yang masih kosong tidak dihitung) yang dikonversi ke mingguan dengan mengalikan 12 lalu membagi 52. Angka 0 dan tanda "-" dihitung sebagai tidak ada penjualan. Jika sinkronisasi atau data sales gagal, estimasi ditahan dan tidak diganti data contoh.',
    online_source: 'Google Sheets · Online + Master Cost',
    offline_source: 'Google Sheets · Offline + Pareto Offline',
    without_expiry: 'Tanpa ED',
    unmapped: 'Belum dipetakan',
    today: 'hari ini',
    days_left: 'hari lagi',
    no_priority: 'Belum ada produk prioritas pada filter ini.',
    result_count: '{count} SKU',
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
    brand_title: 'Marketing Control',
    method_short: 'Methodology',
    method_eyebrow: 'FEFO Methodology',
    data_sources_title: 'Data sources',
    batch_method_title: 'Per-batch estimation',
    fefo_rules_title: 'FEFO calculation rules',
    close_dialog: 'Got it',
    active_sku_sub: 'Active monitored SKUs',
    quick_all: 'All',
    quick_ed_90: 'Expiry ≤ 90d',
    quick_ed_180: 'Expiry ≤ 180d',
    advanced_filters_title: 'Filters & Sort',
    apply_filters: 'Done',
    clear_all_filters: 'Clear all',
    summary_channel: 'Channel summary',
    summary_filtered: 'Filtered results summary',
    expired_stock: 'Already expired stock',
    expired_source_unknown: 'Unavailable from Online source',
    expired_qty: 'already expired',
    batch_risk: 'at risk',
    batch_risk_unknown: 'Estimate unavailable',
    batch_method: 'Each expiry date is estimated using the average sales rate. Stock past its expiry date is reported separately from available stock and expiry risk.',
    filter_button: 'Filters',
    average_sales: 'Average sales',
    day_unit: 'Day',
    week_unit: 'Week',
    month_unit: 'Month',
    nearest_expiry_short: 'Nearest expiry',
    risk_qty_short: 'At-risk qty',
    risk_value_short: 'Risk value',
    stock_details: 'Stock & batch details',
    title: 'O.TWO.O COSMETIC INDONESIA MARKETING CONTROL',
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
    urgent_expiry_detail: 'pcs · FEFO estimate',
    incomplete_sales: 'Incomplete sales data',
    inventory_title: 'Inventory list',
    inventory_description: 'Online uses the latest 13 closed shipment weeks. Offline reads CLUSTERING OFFLINE, the latest 6-month average sales, and PARETO OFFLINE. Cost for both channels is mapped from the Master Cost tab.',
    search_label: 'Search SKU or product name',
    search_placeholder: 'Search SKU or product name…',
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
    expiry_urgency: 'Expiry risk window',
    all_expiry_risk: 'All risk windows',
    risk_within_30_days: 'Risk ≤ 30 days',
    risk_within_60_days: 'Risk ≤ 60 days',
    risk_within_90_days: 'Risk ≤ 90 days',
    risk_within_180_days: 'Risk ≤ 180 days',
    all_expiry: 'All expiry dates',
    within_30_days: '≤ 30 days',
    within_60_days: '≤ 60 days',
    within_90_days: '≤ 90 days',
    expiry_range: 'Expiry range',
    expiry_0_30: '≤ 30 days',
    expiry_0_90: '≤ 90 days',
    expiry_0_180: '≤ 180 days',
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
    risk_value_idr: 'Risk value<br>(IDR)',
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
    method_description: 'FEFO assumes stock with the nearest expiry date is sold first. Online uses the average of the latest 13 shipment weeks. Offline uses up to the latest 6 completed months that are already filled in Google Sheets (the current month and months not yet filled are excluded), converted to a weekly rate by multiplying by 12 and dividing by 52. Zeros and "-" are treated as no sales. If synchronization or sales data fails, the estimate is withheld and no sample data is shown.',
    online_source: 'Google Sheets · Online + Master Cost',
    offline_source: 'Google Sheets · Offline + Pareto Offline',
    without_expiry: 'No expiry date',
    unmapped: 'Not mapped',
    today: 'today',
    days_left: 'days left',
    no_priority: 'No priority products match these filters.',
    result_count: '{count} SKUs',
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
  const tag = locale === 'en' ? 'en-US' : 'id-ID';
  number = new Intl.NumberFormat(tag);
  salesNumber = new Intl.NumberFormat(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  rupiah = new Intl.NumberFormat(tag, { maximumFractionDigits: 0 });
  date = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'id-ID', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  });
  syncDate = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'id-ID', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

resetFormatters();

function formatRupiah(value) {
  if (!Number.isFinite(value)) return '—';
  const prefix = locale === 'en' ? 'IDR ' : 'Rp ';
  return prefix + rupiah.format(value);
}

let records = [];
let offlineRecords = [];
let onlineRecords = [];
let offlineState = 'loading';
let onlineState = 'loading';
let lastSyncAt = null;
const syncTimes = { offline: null, online: null };

function recordSyncTime(key, response) {
  const header = response.headers.get('X-Data-Fetched-At');
  const fetchedAt = header ? new Date(header) : new Date();
  syncTimes[key] = Number.isNaN(fetchedAt.getTime()) ? new Date() : fetchedAt;
  const known = Object.values(syncTimes).filter(Boolean);
  lastSyncAt = known.length ? new Date(Math.min(...known.map(time => time.getTime()))) : null;
}

const search = document.getElementById('search');
const filterButtons = [...document.querySelectorAll('#filters button')];
const quickButtons = [...document.querySelectorAll('#quick-filters button')];
const tableRows = document.getElementById('rows');
const tableWrap = document.querySelector('.table-wrap');
const tableScroll = document.querySelector('.table-scroll');
const stickyTableHead = document.getElementById('sticky-table-head');
const inventoryControls = document.querySelector('.inventory-controls');
const riskFilter = document.getElementById('risk-filter');
const urgencyFilter = document.getElementById('urgency-filter');
const expiryRangeFilter = document.getElementById('expiry-range-filter');
const stockCoverFilter = document.getElementById('stock-cover-filter');
const skuCategoryPicker = document.getElementById('sku-category-picker');
const skuCategoryFilter = document.getElementById('sku-category-filter');
const riskValueFilter = document.getElementById('risk-value-filter');
const salesVelocityFilter = document.getElementById('sales-velocity-filter');
const prioritySort = document.getElementById('priority-sort');
const mobilePrioritySort = document.getElementById('mobile-priority-sort');
const paretoFilter = document.getElementById('pareto-filter');
const exportExcelButton = document.getElementById('export-excel');
const mobileExportExcelButton = document.getElementById('mobile-export-excel');
const resetFiltersButton = document.getElementById('reset-filters');
const syncStatus = document.getElementById('sync-status');
const activeChips = document.getElementById('active-chips');
const filterBackdrop = document.getElementById('filter-backdrop');
const filterCloseButton = document.getElementById('filter-close');
const filterApplyButton = document.getElementById('filter-apply');
const methodDialog = document.getElementById('method-dialog');
const methodOpenButtons = [
  document.getElementById('method-open'),
  document.getElementById('method-open-footer'),
].filter(Boolean);
const methodCloseButtons = [
  document.getElementById('method-close'),
  document.getElementById('method-done'),
].filter(Boolean);

const languageButtons = {
  id: document.getElementById('language-id'),
  en: document.getElementById('language-en'),
};

const statCards = {
  risk: document.getElementById('stat-card-risk'),
  value: document.getElementById('stat-card-value'),
  urgent: document.getElementById('stat-card-urgent'),
  expired: document.getElementById('stat-card-expired'),
};

const filterDescriptors = [
  { select: riskFilter, labelKey: 'risk_status' },
  { select: urgencyFilter, labelKey: 'expiry_urgency' },
  { select: expiryRangeFilter, labelKey: 'expiry_range' },
  { select: stockCoverFilter, labelKey: 'stock_cover_filter' },
  { select: skuCategoryFilter, labelKey: 'sku_category_filter' },
  { select: riskValueFilter, labelKey: 'risk_value_filter' },
  { select: salesVelocityFilter, labelKey: 'sales_velocity' },
  { select: paretoFilter, labelKey: 'pareto' },
];

let channel = 'Online';
let onlineReportsExpired = false;
const mobileInventory = window.matchMedia('(max-width: 670px)');
const stockCards = document.getElementById('stock-cards');
const filterToggle = document.getElementById('filter-toggle');
const advancedFilters = document.getElementById('advanced-filters');
const activeFilterCount = document.getElementById('active-filter-count');
let syncStickyHeader = () => {};
let refreshStickyHeaderClone = () => {};

function setFiltersExpanded(expanded) {
  filterToggle.setAttribute('aria-expanded', String(expanded));
  advancedFilters.hidden = !expanded;
  filterBackdrop.hidden = !(expanded && mobileInventory.matches);
  document.body.style.overflow = expanded && mobileInventory.matches ? 'hidden' : '';
  syncStickyHeader();
}

function setupStickyTableHeader() {
  const sourceTable = tableScroll?.querySelector('table');
  const sourceHead = sourceTable?.querySelector('thead');
  if (!tableWrap || !tableScroll || !sourceTable || !sourceHead || !stickyTableHead) return;

  const stickyTable = sourceTable.cloneNode(false);
  const columns = document.createElement('colgroup');
  for (let index = 0; index < 12; index++) columns.append(document.createElement('col'));
  stickyTable.append(columns);
  let clonedHead = sourceHead.cloneNode(true);
  stickyTable.append(clonedHead);
  stickyTableHead.replaceChildren(stickyTable);

  refreshStickyHeaderClone = () => {
    const nextHead = sourceHead.cloneNode(true);
    clonedHead.replaceWith(nextHead);
    clonedHead = nextHead;
  };

  const sync = () => {
    const controlsRect = inventoryControls?.getBoundingClientRect();
    if (inventoryControls) {
      inventoryControls.classList.toggle('is-stuck', (controlsRect?.top ?? 1) <= 0.5);
    }
    tableScroll.classList.toggle('is-scrolled-x', tableScroll.scrollLeft > 2);

    if (mobileInventory.matches) {
      stickyTableHead.classList.remove('is-visible');
      return;
    }
    const controlsHeight = controlsRect?.height ?? 0;
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
    if (!isInTable) return;

    const [top, units] = sourceHead.rows;
    const headers = [...top.cells].filter(cell => cell.colSpan === 1);
    headers.splice(3, 0, ...units.cells);
    headers.forEach((cell, index) => {
      if (columns.children[index]) {
        columns.children[index].style.width = cell.getBoundingClientRect().width + 'px';
      }
    });
  };

  tableScroll.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('scroll', sync, { passive: true, capture: true });
  window.addEventListener('resize', sync);
  const resizeObserver = new ResizeObserver(sync);
  if (inventoryControls) resizeObserver.observe(inventoryControls);
  resizeObserver.observe(sourceTable);
  syncStickyHeader = sync;
  sync();
}

function cell(row, value, className = '') {
  const td = row.insertCell();
  td.textContent = value;
  if (className) td.className = className;
  return td;
}

function statusOf(record) {
  if (record.daysLeft === null && record.expiredStock > 0) return [t('expired_stock'), 'expired'];
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
  const prefix = locale === 'en' ? 'IDR ' : 'Rp ';
  if (Math.abs(value) >= 1_000_000_000) {
    return prefix + compact.format(value / 1_000_000_000) + (locale === 'en' ? 'B' : ' miliar');
  }
  if (Math.abs(value) >= 1_000_000) {
    return prefix + compact.format(value / 1_000_000) + (locale === 'en' ? 'M' : ' juta');
  }
  return formatRupiah(value);
}

function rangeBand(value) {
  if (!Number.isFinite(value)) return 'unknown';
  if (value <= 30) return '0-30';
  if (value <= 90) return '31-90';
  if (value <= 180) return '91-180';
  return '180-plus';
}

function matchesExpiryRange(daysLeft, selectedRange) {
  if (!selectedRange) return true;
  if (selectedRange === 'no-date') return daysLeft === null;
  if (daysLeft === null) return false;
  if (selectedRange === '0-90') return daysLeft <= 90;
  if (selectedRange === '0-180') return daysLeft <= 180;
  return rangeBand(daysLeft) === selectedRange;
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
  if (!Number.isFinite(value)) return '—';
  if (value === 0) return '0';
  return salesNumber.format(value);
}

function stockCoverFormat(value) {
  if (!Number.isFinite(value) || value < 0) return '—';
  if (value === 0) return '0';
  return salesNumber.format(value);
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
  document.querySelector('.channel-tabs').setAttribute('aria-label', t('channel'));
  document.querySelector('.table-wrap').setAttribute('aria-label', t('inventory_title'));
  languageButtons.id.setAttribute('aria-pressed', String(locale === 'id'));
  languageButtons.en.setAttribute('aria-pressed', String(locale === 'en'));
  updateSkuCategoryOptions();
  updateSkuCategoryVisibility();
  updateSyncStatus();
  refreshStickyHeaderClone();
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
    .filter(record => !riskFilter.value || (riskFilter.value === 'expired'
      ? record.expiredStock > 0 : statusOf(record)[1] === riskFilter.value))
    .filter(record => !urgencyFilter.value || riskWithin(record.expiries, Number(urgencyFilter.value)) > 0)
    .filter(record => matchesExpiryRange(record.daysLeft, expiryRangeFilter.value))
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
  const labels = record.expiries.map(expiry =>
    date.format(expiry.date) + ' · ' + number.format(expiry.qty) + ' pcs · ' + expiryRiskLabel(expiry));
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
  const columns = [
    t('product_sku'), 'SKU', t('channel'),
    t('available_stock').replace('<br>', ' '),
    t('risk_value_idr').replace('<br>', ' '),
    t('average_monthly_sales').replace('<br>', ' '),
    t('average_daily_sales').replace('<br>', ' '),
    t('average_weekly_sales').replace('<br>', ' '),
    t('stock_cover').replace('<br>', ' '),
    t('stock_cover_weeks').replace('<br>', ' '),
    t('stock_cover_months').replace('<br>', ' '),
    t('expiry_date_qty'),
    t('expired_risk_pcs').replace('<br>', ' '),
    t('risk_status_header'),
    t('pareto'),
  ];
  const rows = visible.map(record => {
    const riskValue = pricedRiskValue(record);
    const [riskLabel] = statusOf(record);
    return [
      record.name,
      record.sku,
      channelLabel(record.channel),
      number.format(record.stock),
      Number.isFinite(riskValue) ? formatRupiah(riskValue) : '—',
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
  const workbook = '<!doctype html><html><head><meta charset="utf-8"><title>O.TWO.O COSMETIC INDONESIA MARKETING CONTROL</title></head><body>'
    + '<h2>O.TWO.O COSMETIC INDONESIA MARKETING CONTROL</h2><p>' + escapeHtml(t('channel')) + ': ' + escapeHtml(channelLabel(channel)) + ' · ' + escapeHtml(locale === 'en' ? 'Exported from the active view' : 'Diekspor dari tampilan aktif') + '</p>'
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

function expiryRiskLabel(expiry) {
  if (expiry.days < 0) return t('expired_qty');
  if (expiry.riskQty === null) return t('batch_risk_unknown');
  return number.format(expiry.riskQty) + ' pcs ' + t('batch_risk');
}

function expiryRiskTone(expiry) {
  if (expiry.days < 0) return 'is-risk';
  if (expiry.riskQty === null) return 'is-neutral';
  return expiry.riskQty > 0 ? 'is-risk' : 'is-safe';
}

function appendExpiry(list, label, qty, days, riskLabel, riskTone = 'is-neutral') {
  const entry = document.createElement('li');
  const dateLabel = document.createElement('strong');
  dateLabel.textContent = label;
  const detail = document.createElement('span');
  detail.className = 'batch-detail';
  detail.textContent = days === null
    ? number.format(qty) + ' pcs'
    : number.format(qty) + ' pcs · ' + (days === 0 ? t('today') : number.format(days) + ' ' + t('days_left'));
  entry.append(dateLabel, detail);
  if (riskLabel) {
    const risk = document.createElement('span');
    risk.className = 'batch-risk ' + riskTone;
    risk.textContent = riskLabel;
    entry.append(risk);
  }
  list.append(entry);
}

function expiryCell(row, record) {
  const td = cell(row, '—');
  if (!record.expiries.length && !record.undatedStock) return;
  const list = document.createElement('ul');
  list.className = 'expiry-list';
  for (const expiry of record.expiries) {
    appendExpiry(
      list,
      date.format(expiry.date),
      expiry.qty,
      expiry.days < 0 ? null : expiry.days,
      expiryRiskLabel(expiry),
      expiryRiskTone(expiry),
    );
  }
  if (record.undatedStock) appendExpiry(list, t('without_expiry'), record.undatedStock, null);
  td.replaceChildren(list);
}

function buildProductMeta(record) {
  const meta = document.createElement('div');
  meta.className = 'product-meta';
  const sku = document.createElement('span');
  sku.className = 'sku-code';
  sku.textContent = record.sku;
  meta.append(sku);
  if (record.paretoStatus === 'Pareto 80%') {
    const tag = document.createElement('span');
    tag.className = 'meta-tag meta-tag-pareto';
    tag.textContent = t('pareto_80');
    meta.append(tag);
  }
  if (channel === 'Online' && record.skuCategory) {
    const tag = document.createElement('span');
    tag.className = 'meta-tag meta-tag-category';
    tag.textContent = record.skuCategory;
    meta.append(tag);
  }
  return meta;
}

function appendCardField(list, key, value, valueClass = '') {
  const field = document.createElement('div');
  const label = document.createElement('dt');
  const detail = document.createElement('dd');
  label.textContent = t(key).replaceAll('<br>', ' ');
  if (valueClass) detail.className = valueClass;
  detail.append(value);
  field.append(label, detail);
  list.append(field);
}

function appendStockCard(row, record) {
  const card = document.createElement('li');
  card.className = 'stock-card';
  const [product, stock, value, day, week, month, coverDays, coverWeeks, coverMonths, batches, qty, status] = row.cells;

  const top = document.createElement('div');
  top.className = 'stock-card-top';
  const title = document.createElement('h3');
  title.className = 'stock-card-title';
  title.append(...product.childNodes);
  top.append(title, ...status.childNodes);

  const overview = document.createElement('dl');
  overview.className = 'stock-card-metrics';
  const firstExpiry = record.expiries.find(expiry => expiry.days >= 0);
  const riskValue = pricedRiskValue(record);
  appendCardField(overview, 'risk_value_short', value.textContent, riskValue > 0 ? 'is-value-risk' : '');
  appendCardField(overview, 'risk_qty_short', qty.textContent === '—' ? '—' : qty.textContent + ' pcs', record.risk > 0 ? 'is-qty-risk' : '');
  appendCardField(overview, 'nearest_expiry_short', firstExpiry ? date.format(firstExpiry.date) : '—');
  appendCardField(overview, 'available_stock', stock.textContent + ' pcs');

  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = t('stock_details');
  const breakdown = document.createElement('dl');
  breakdown.className = 'stock-card-breakdown';
  for (const [key, cellEl] of [
    ['average_daily_sales', day], ['average_weekly_sales', week], ['average_monthly_sales', month],
    ['stock_cover', coverDays], ['stock_cover_weeks', coverWeeks], ['stock_cover_months', coverMonths],
    ['expiry_date_qty', batches],
  ]) appendCardField(breakdown, key, cellEl.firstElementChild ?? cellEl.textContent);

  details.append(summary, breakdown);
  card.append(top, overview, details);
  stockCards.append(card);
}

function setCardTone(card, available, numericValue) {
  if (!card) return;
  card.classList.remove('is-alert', 'is-zero', 'is-muted');
  if (!available || !Number.isFinite(numericValue)) {
    card.classList.add('is-muted');
  } else if (numericValue > 0) {
    card.classList.add('is-alert');
  } else {
    card.classList.add('is-zero');
  }
}

function syncQuickFilterPills() {
  const activeQuick = (() => {
    const anyExtra = Boolean(urgencyFilter.value || stockCoverFilter.value || skuCategoryFilter.value
      || riskValueFilter.value || salesVelocityFilter.value);
    if (anyExtra) return null;
    if (!riskFilter.value && !expiryRangeFilter.value && !paretoFilter.value) return 'all';
    if (riskFilter.value === 'at-risk' && !expiryRangeFilter.value && !paretoFilter.value) return 'at-risk';
    if (!riskFilter.value && expiryRangeFilter.value === '0-90' && !paretoFilter.value) return 'ed90';
    if (!riskFilter.value && expiryRangeFilter.value === '0-180' && !paretoFilter.value) return 'ed180';
    if (!riskFilter.value && !expiryRangeFilter.value && paretoFilter.value === 'Pareto 80%') return 'pareto';
    return null;
  })();
  for (const btn of quickButtons) {
    btn.setAttribute('aria-pressed', String(btn.dataset.quick === activeQuick));
  }
}

function renderActiveChips() {
  const active = filterDescriptors.filter(({ select }) => !select.disabled && Boolean(select.value));
  activeChips.replaceChildren();
  activeChips.hidden = active.length === 0;

  filterToggle.classList.toggle('has-active', active.length > 0);
  activeFilterCount.hidden = active.length === 0;
  activeFilterCount.textContent = number.format(active.length);

  if (!active.length) return;
  for (const { select, labelKey } of active) {
    const selectedOption = select.options[select.selectedIndex];
    const chip = document.createElement('span');
    chip.className = 'filter-chip';
    chip.textContent = t(labelKey) + ': ' + (selectedOption?.textContent ?? select.value);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', t(labelKey));
    remove.addEventListener('click', () => {
      select.value = '';
      draw();
    });
    chip.append(remove);
    activeChips.append(chip);
  }
  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'chip-clear-all';
  clearBtn.textContent = t('clear_all_filters');
  clearBtn.addEventListener('click', resetFilterSelections);
  activeChips.append(clearBtn);
}

function resetFilterSelections() {
  search.value = '';
  for (const { select } of filterDescriptors) select.value = '';
  prioritySort.value = 'value';
  if (mobilePrioritySort) mobilePrioritySort.value = 'value';
  draw();
}

function draw() {
  document.getElementById('source-label').textContent = channel === 'Online'
    ? t('online_source')
    : t('offline_source');

  const visible = visibleRecords();
  const knownRisk = visible.filter(record => record.risk !== null);
  const pricedRisk = visible.filter(record => pricedRiskValue(record) !== null);
  const totalRiskQty = knownRisk.reduce((total, record) => total + record.risk, 0);
  const totalRiskValue = pricedRisk.reduce((total, record) => total + pricedRiskValue(record), 0);
  const urgentQty = knownRisk.reduce((total, record) => total + riskWithin(record.expiries, 30), 0);
  const expiredQty = visible.reduce((total, record) => total + (record.expiredStock ?? 0), 0);
  const expiredAvailable = channel === 'Offline' ? offlineState === 'ready' : onlineReportsExpired;

  document.getElementById('sku-count').textContent = number.format(visible.length);
  document.getElementById('risk-count').textContent = knownRisk.length ? number.format(totalRiskQty) : '—';
  document.getElementById('risk-value-count').textContent = pricedRisk.length ? compactRiskValue(totalRiskValue) : '—';
  document.getElementById('urgent-count').textContent = knownRisk.length ? number.format(urgentQty) : '—';
  document.getElementById('expired-count').textContent = expiredAvailable ? number.format(expiredQty) : '—';
  document.getElementById('expired-detail').textContent = channel === 'Online' && !expiredAvailable
    ? t('expired_source_unknown') : 'pcs';

  setCardTone(statCards.risk, knownRisk.length > 0, totalRiskQty);
  setCardTone(statCards.value, pricedRisk.length > 0, totalRiskValue);
  setCardTone(statCards.urgent, knownRisk.length > 0, urgentQty);
  setCardTone(statCards.expired, expiredAvailable, expiredQty);

  document.getElementById('result-count').textContent = t('result_count').replace('{count}', number.format(visible.length));
  syncQuickFilterPills();
  renderActiveChips();

  const dataFiltered = filterDescriptors.some(({ select }) => !select.disabled && Boolean(select.value));
  document.getElementById('summary-context').textContent =
    t(dataFiltered || search.value.trim() ? 'summary_filtered' : 'summary_channel') + ' · ' + channelLabel(channel);

  tableRows.replaceChildren();
  stockCards.replaceChildren();

  if (!visible.length) {
    let label = t('no_match');
    if (channel === 'Offline' && offlineState === 'loading') label = t('loading_offline');
    if (channel === 'Offline' && offlineState === 'error') label = t('offline_error');
    if (channel === 'Online' && onlineState === 'loading') label = t('loading_online');
    if (channel === 'Online' && onlineState === 'error') label = t('online_error');
    if (mobileInventory.matches) {
      const message = document.createElement('li');
      message.className = 'empty';
      message.textContent = label;
      stockCards.append(message);
    } else {
      const message = cell(tableRows.insertRow(), label, 'empty');
      message.colSpan = 12;
    }
  }

  for (const record of visible) {
    const row = mobileInventory.matches ? document.createElement('tr') : tableRows.insertRow();
    const riskValue = pricedRiskValue(record);

    const product = cell(row, '', 'product');
    const title = document.createElement('strong');
    title.textContent = record.name;
    product.append(title, buildProductMeta(record));

    cell(row, number.format(record.stock), 'numeric col-stock-cell');
    cell(
      row,
      Number.isFinite(riskValue) ? formatRupiah(riskValue) : '—',
      'numeric col-risk-val-cell' + (riskValue > 0 ? ' has-risk' : ''),
    );

    cell(row, salesFormat(record.averageDailySales), 'numeric sales-cell group-start');
    cell(row, salesFormat(record.averageWeeklySales), 'numeric sales-cell');
    cell(row, salesFormat(record.averageMonthlySales), 'numeric sales-cell');

    cell(row, stockCoverFormat(record.stockCoverDays), 'numeric cover-cell group-start');
    cell(row, stockCoverWeeksFormat(record.stockCoverDays), 'numeric cover-cell');
    cell(row, stockCoverMonthsFormat(record.stockCoverDays), 'numeric cover-cell group-end');

    expiryCell(row, record);
    cell(
      row,
      record.risk === null ? '—' : number.format(record.risk),
      record.risk > 0 ? 'numeric risk-qty-alert' : 'numeric',
    );

    const [label, statusClass] = statusOf(record);
    const badge = document.createElement('span');
    badge.className = 'status ' + statusClass;
    badge.textContent = label;
    cell(row, '').append(badge);

    if (mobileInventory.matches) appendStockCard(row, record);
  }
  syncStickyHeader();
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

for (const button of quickButtons) {
  button.addEventListener('click', () => {
    const mode = button.dataset.quick;
    for (const { select } of filterDescriptors) select.value = '';
    if (mode === 'at-risk') riskFilter.value = 'at-risk';
    if (mode === 'ed90') expiryRangeFilter.value = '0-90';
    if (mode === 'ed180') expiryRangeFilter.value = '0-180';
    if (mode === 'pareto') paretoFilter.value = 'Pareto 80%';
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

filterToggle.addEventListener('click', () => {
  setFiltersExpanded(filterToggle.getAttribute('aria-expanded') !== 'true');
});

filterCloseButton?.addEventListener('click', () => setFiltersExpanded(false));
filterApplyButton?.addEventListener('click', () => setFiltersExpanded(false));
filterBackdrop?.addEventListener('click', () => setFiltersExpanded(false));

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || filterToggle.getAttribute('aria-expanded') !== 'true') return;
  event.preventDefault();
  setFiltersExpanded(false);
  filterToggle.focus();
});

for (const button of methodOpenButtons) {
  button.addEventListener('click', () => {
    if (typeof methodDialog?.showModal === 'function') methodDialog.showModal();
  });
}

for (const button of methodCloseButtons) {
  button.addEventListener('click', () => methodDialog?.close());
}

methodDialog?.addEventListener('click', event => {
  if (event.target === methodDialog) methodDialog.close();
});

for (const { select } of filterDescriptors) {
  select.addEventListener('change', draw);
}

prioritySort.addEventListener('change', () => {
  if (mobilePrioritySort) mobilePrioritySort.value = prioritySort.value;
  draw();
});

mobilePrioritySort?.addEventListener('change', () => {
  prioritySort.value = mobilePrioritySort.value;
  draw();
});

mobileInventory.addEventListener('change', () => {
  if (!mobileInventory.matches) {
    filterBackdrop.hidden = true;
    document.body.style.overflow = '';
  }
  draw();
});

search.addEventListener('input', draw);
exportExcelButton.addEventListener('click', exportExcelFile);
mobileExportExcelButton?.addEventListener('click', () => {
  exportExcelFile();
  setFiltersExpanded(false);
});
resetFiltersButton.addEventListener('click', resetFilterSelections);

setupStickyTableHeader();
applyLanguage();
draw();

async function refreshOffline() {
  try {
    const response = await fetch('/api/offline', { cache: 'no-store' });
    if (!response.ok) throw new Error('Offline sheet unavailable');
    const payload = await response.json();
    if (!Array.isArray(payload.records)) throw new Error('Offline sheet returned invalid data');
    offlineRecords = portfolio(payload.records).filter(item => item.channel === 'Offline');
    recordSyncTime('offline', response);
    offlineState = 'ready';
  } catch (error) {
    console.error(error);
    offlineRecords = [];
    offlineState = 'error';
  }
  updateSyncStatus();
  mergeRecords();
}

async function refreshOnline() {
  try {
    const response = await fetch('/api/online', { cache: 'no-store' });
    if (!response.ok) throw new Error('Feed unavailable');
    const rows = await response.json();
    const today = jakartaDay();
    onlineRecords = rows.map(row => {
      const expiries = estimateExpiryRisk(row.expiries.map(expiry => {
        const parsedDate = new Date(expiry.date + 'T00:00:00Z');
        return { ...expiry, date: parsedDate, days: Math.round((parsedDate.getTime() - today) / 86_400_000) };
      }), row.incomplete ? null : row.averageDailySales);
      const daysLeft = expiries.find(expiry => expiry.days >= 0)?.days ?? null;
      const expiredStock = expiries.reduce((total, expiry) => total + (expiry.days < 0 ? expiry.qty : 0), 0);
      const stock = Number(row.stock) - expiredStock;
      return {
        ...row, channel: 'Online', daysLeft, expiries, expiredStock, stock,
        incomplete: row.incomplete || (daysLeft !== null && row.averageDailySales == null),
        risk: riskWithin(expiries, Infinity),
        productCost: row.productCost == null ? null : Number(row.productCost),
        stockCoverDays: row.averageDailySales > 0 ? stock / row.averageDailySales : null,
      };
    });
    onlineReportsExpired = onlineRecords.some(record => record.expiredStock > 0);
    updateSkuCategoryOptions();
    recordSyncTime('online', response);
    onlineState = 'ready';
  } catch (error) {
    console.error(error);
    onlineRecords = [];
    onlineReportsExpired = false;
    onlineState = 'error';
  }
  updateSyncStatus();
  mergeRecords();
}

refreshOffline();
refreshOnline();
setInterval(refreshOffline, 300000);
setInterval(refreshOnline, 300000);
