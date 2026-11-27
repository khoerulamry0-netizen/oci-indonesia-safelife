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
    refresh_data: 'Muat ulang data',
    insight_channel_split: 'Porsi modal risiko · Online vs Offline',
    insight_category_top: 'Top kategori penyumbang modal risiko',
    insight_offline_status: 'Modal risiko · Active vs Inactive SKU',
    insight_expiry_dist: 'Distribusi modal risiko per rentang ED',
    insight_other: 'Lainnya',
    bucket_le_90: '≤ 90 hari',
    bucket_91_180: '91–180 hari',
    bucket_gt_180: '> 180 hari',
    active_sku_sub: 'SKU aktif terpantau',
    quick_all: 'Semua',
    quick_at_risk: 'Berisiko',
    quick_ed_90: 'ED ≤ 90h',
    quick_ed_180: 'ED ≤ 180h',
    quick_active: 'Active',
    quick_inactive: 'Inactive',
    quick_pareto: 'Pareto',
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
    all_channels: 'Semua channel',
    all_sources: 'Google Sheets · Online + Offline',
    loading_all: 'Memuat data Online & Offline dari Google Sheets…',
    all_error: 'Sinkronisasi data Online & Offline gagal.',
    total_stock_value: 'Total nilai stok',
    cost_times_stock: 'product cost × stok tersedia',
    risk_ratio: 'Persentase risiko',
    risk_over_stock: 'nilai risiko ÷ total nilai stok',
    at_risk_value: 'Modal risiko expired',
    cost_times_risk: 'product cost × qty risiko',
    urgent_expiry: 'Risiko ED ≤30 hari',
    urgent_expiry_detail: 'pcs · estimasi FEFO',
    incomplete_sales: 'Data sales belum lengkap',
    inventory_title: 'Daftar stok',
    inventory_description: 'Online memakai 13 minggu shipment terakhir yang sudah tutup. Offline membaca tab CLUSTERING OFFLINE, Monthly AVG, OOS FILTER & SWC NOTE dari tab Stock cover offline, status Pareto dari tab PARETO OFFLINE, serta Status Barang & Provisi dari tab Active SKU offline. Cost kedua channel dipetakan dari tab Master Cost.',
    search_label: 'Cari SKU atau nama produk',
    search_placeholder: 'Cari SKU atau nama produk…',
    online: 'Online',
    offline_monthly: 'Offline',
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
    sku_status_filter: 'Status SKU Offline',
    active_sku_only: 'Active & New',
    inactive_sku_only: 'Inactive (Deleted / Discontinue)',
    status_active_exact: 'Active',
    status_new_sku: 'New SKU',
    status_discontinue: 'Discontinue',
    status_deleted: 'Deleted',
    inactive_tag: 'Inactive',
    new_tag: 'New',
    deleted_tag: 'Deleted',
    discontinue_tag: 'Discontinue',
    provision_filter: 'Status Provisi',
    all_provisions: 'Semua status provisi',
    provision_all_hit: 'Semua Kena Provisi',
    provision_value_label: 'Nilai provisi',
    first_arrival_label: 'Tanggal pertama datang',
    oos_filter: 'OOS Filter',
    oos_available_only: 'Stok tersedia (default)',
    oos_only: 'OOS (Stok habis)',
    oos_all: 'Semua (Tersedia + OOS)',
    oos_status: 'Stok habis (OOS)',
    oos_tag: 'OOS',
    swc_note_filter: 'SWC Note',
    all_swc_notes: 'Semua SWC Note',
    stale_suffix: ' · Data lama (sinkronisasi gagal)',
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
    method_description: 'FEFO mengasumsikan stok dengan tanggal expired paling dekat keluar dulu. Online memakai rata-rata shipment 13 minggu. Offline memakai kolom Monthly AVG dari tab Stock cover offline di Google Sheets yang dikonversi ke mingguan dengan mengalikan 12 lalu membagi 52. Angka 0 dan tanda "-" dihitung sebagai tidak ada penjualan. SKU Offline aktif yang memiliki kurang dari 3 bulan tutup berpenjualan (dan ED > 180 hari) ditandai sebagai data sales belum lengkap agar masa ramp-up SKU baru tidak memicu risiko semu. Jika sinkronisasi atau data sales gagal, estimasi ditahan dan tidak diganti data contoh.',
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
    share_view: 'Salin link',
    link_copied: 'Link tersalin',
    copy_sku_summary: 'Salin ringkasan',
    summary_copied: 'Ringkasan tersalin',
    close_drawer: 'Tutup',
    showing_of: 'Menampilkan {shown} dari {total} SKU',
    load_more: 'Muat +{count} lagi',
    show_all: 'Tampilkan semua',
    unit_cost: 'Product cost (HPP)',
    pareto_rank_label: 'Peringkat Pareto',
    pareto_contrib_label: 'Kontribusi sales',
    closed_months_label: 'Bulan tutup berpenjualan',
    sales_and_cover: 'Kecepatan sales & stock cover',
    batch_breakdown_title: 'Rincian batch & estimasi FEFO',
    est_sold_qty: 'Est. terjual',
    batch_risk_value: 'Modal risiko',
    click_to_filter: 'Klik untuk memfilter',
    view_details: 'Detail',
    clear_search: 'Hapus pencarian',
  },
  en: {
    brand_title: 'Marketing Control',
    method_short: 'Methodology',
    method_eyebrow: 'FEFO Methodology',
    data_sources_title: 'Data sources',
    batch_method_title: 'Per-batch estimation',
    fefo_rules_title: 'FEFO calculation rules',
    close_dialog: 'Got it',
    refresh_data: 'Refresh data',
    insight_channel_split: 'Risk value share · Online vs Offline',
    insight_category_top: 'Top risk value by SKU category',
    insight_offline_status: 'Risk value · Active vs Inactive SKU',
    insight_expiry_dist: 'Risk value by expiry horizon',
    insight_other: 'Other',
    bucket_le_90: '≤ 90 days',
    bucket_91_180: '91–180 days',
    bucket_gt_180: '> 180 days',
    active_sku_sub: 'Active monitored SKUs',
    quick_all: 'All',
    quick_at_risk: 'At risk',
    quick_ed_90: 'ED ≤ 90d',
    quick_ed_180: 'ED ≤ 180d',
    quick_active: 'Active',
    quick_inactive: 'Inactive',
    quick_pareto: 'Pareto',
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
    all_channels: 'All channels',
    all_sources: 'Google Sheets · Online + Offline',
    loading_all: 'Loading Online & Offline data from Google Sheets…',
    all_error: 'Online & Offline data synchronization failed.',
    total_stock_value: 'Total stock value',
    cost_times_stock: 'product cost × available stock',
    risk_ratio: 'Risk percentage',
    risk_over_stock: 'risk value ÷ total stock value',
    at_risk_value: 'Expiry risk value',
    cost_times_risk: 'product cost × risk qty',
    urgent_expiry: 'Expiry risk ≤30 days',
    urgent_expiry_detail: 'pcs · FEFO estimate',
    incomplete_sales: 'Incomplete sales data',
    inventory_title: 'Inventory list',
    inventory_description: 'Online uses the latest 13 closed shipment weeks. Offline reads CLUSTERING OFFLINE, Monthly AVG, OOS FILTER & SWC NOTE from the Stock cover offline tab, Pareto status from the PARETO OFFLINE tab, and Item & Provision status from the Active SKU offline tab. Cost for both channels is mapped from the Master Cost tab.',
    search_label: 'Search SKU or product name',
    search_placeholder: 'Search SKU or product name…',
    online: 'Online',
    offline_monthly: 'Offline',
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
    sku_status_filter: 'Offline SKU status',
    active_sku_only: 'Active & New',
    inactive_sku_only: 'Inactive (Deleted / Discontinue)',
    status_active_exact: 'Active',
    status_new_sku: 'New SKU',
    status_discontinue: 'Discontinue',
    status_deleted: 'Deleted',
    inactive_tag: 'Inactive',
    new_tag: 'New',
    deleted_tag: 'Deleted',
    discontinue_tag: 'Discontinue',
    provision_filter: 'Provision Status',
    all_provisions: 'All provision statuses',
    provision_all_hit: 'All Subject to Provision',
    provision_value_label: 'Provision value',
    first_arrival_label: 'First arrival date',
    oos_filter: 'OOS Filter',
    oos_available_only: 'Stock available (default)',
    oos_only: 'OOS (Out of stock)',
    oos_all: 'All (Available + OOS)',
    oos_status: 'Out of stock (OOS)',
    oos_tag: 'OOS',
    swc_note_filter: 'SWC Note',
    all_swc_notes: 'All SWC notes',
    stale_suffix: ' · Stale data (sync failed)',
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
    method_description: 'FEFO assumes stock with the nearest expiry date is sold first. Online uses the average of the latest 13 shipment weeks. Offline uses the Monthly AVG column from the Stock cover offline tab in Google Sheets, converted to a weekly rate by multiplying by 12 and dividing by 52. Zeros and "-" are treated as no sales. Active Offline SKUs with fewer than 3 closed months of sales (and expiry > 180 days) are marked as incomplete sales data so new SKU ramp-up periods do not trigger false expiry risk. If synchronization or sales data fails, the estimate is withheld and no sample data is shown.',
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
    share_view: 'Copy link',
    link_copied: 'Link copied',
    copy_sku_summary: 'Copy summary',
    summary_copied: 'Summary copied',
    close_drawer: 'Close',
    showing_of: 'Showing {shown} of {total} SKUs',
    load_more: 'Load +{count} more',
    show_all: 'Show all',
    unit_cost: 'Unit cost (COGS)',
    pareto_rank_label: 'Pareto rank',
    pareto_contrib_label: 'Sales share',
    closed_months_label: 'Closed sales months',
    sales_and_cover: 'Sales velocity & stock cover',
    batch_breakdown_title: 'Batch & FEFO breakdown',
    est_sold_qty: 'Est. sold',
    batch_risk_value: 'Risk value',
    click_to_filter: 'Click to filter',
    view_details: 'Details',
    clear_search: 'Clear search',
  },
};

// Helper: ambil elemen DOM dengan error deskriptif jika tidak ditemukan
function getEl(id) {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`Elemen DOM '#${id}' tidak ditemukan di index.html. Periksa apakah elemen tersebut tersedia dan id-nya cocok.`);
  }
  return el;
}

// Helper: ambil elemen dengan querySelector, null-safe
function getQs(selector) {
  return document.querySelector(selector);
}

// Helper: ambil semua elemen dengan querySelectorAll, selalu mengembalikan array
function getQsAll(selector) {
  return [...document.querySelectorAll(selector)];
}

let locale = localStorage.getItem('oci-locale') === 'en' ? 'en' : 'id';
let number;
let salesNumber;
let percentNumber;
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
  percentNumber = new Intl.NumberFormat(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
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
let staleData = false;
const syncTimes = { offline: null, online: null };
const staleChannels = { offline: false, online: false };

function recordSyncTime(key, response) {
  const header = response.headers.get('X-Data-Fetched-At');
  const fetchedAt = header ? new Date(header) : new Date();
  syncTimes[key] = Number.isNaN(fetchedAt.getTime()) ? new Date() : fetchedAt;
  const known = Object.values(syncTimes).filter(Boolean);
  lastSyncAt = known.length ? new Date(Math.min(...known.map(time => time.getTime()))) : null;
  staleChannels[key] = response.headers.get('X-Stale-Data') === 'true';
  staleData = staleChannels.offline || staleChannels.online;
}

const search = getEl('search');
const searchClear = getEl('search-clear');
const filterButtons = getQsAll('#filters button');
const quickButtons = getQsAll('#quick-filters button');
const tableRows = getEl('rows');
const tableWrap = getQs('.table-wrap');
const tableScroll = getQs('.table-scroll');
const stickyTableHead = getEl('sticky-table-head');
const inventoryControls = getQs('.inventory-controls');
const riskFilter = getEl('risk-filter');
const urgencyFilter = getEl('urgency-filter');
const expiryRangeFilter = getEl('expiry-range-filter');
const stockCoverFilter = getEl('stock-cover-filter');
const skuCategoryPicker = getEl('sku-category-picker');
const skuCategoryFilter = getEl('sku-category-filter');
const skuStatusPicker = getEl('sku-status-picker');
const skuStatusFilter = getEl('sku-status-filter');
const oosFilterPicker = getEl('oos-filter-picker');
const oosFilter = getEl('oos-filter');
const swcNotePicker = getEl('swc-note-picker');
const swcNoteFilter = getEl('swc-note-filter');
const provisionFilterPicker = getEl('provision-filter-picker');
const provisionFilter = getEl('provision-filter');
const riskValueFilter = getEl('risk-value-filter');
const salesVelocityFilter = getEl('sales-velocity-filter');
const prioritySort = getEl('priority-sort');
const mobilePrioritySort = getEl('mobile-priority-sort');
const paretoFilter = getEl('pareto-filter');
const exportExcelButton = getEl('export-excel');
const mobileExportExcelButton = getEl('mobile-export-excel');
const shareViewButton = getEl('share-view');
const resetFiltersButton = getEl('reset-filters');
const syncStatus = getEl('sync-status');
const refreshButton = getEl('refresh-data');
const statsSection = getQs('.stats');
const riskRatioBar = getEl('risk-ratio-bar');
const insightsStrip = getEl('insights-strip');
const insightPrimary = getEl('insight-primary');
const insightExpiry = getEl('insight-expiry');
const activeChips = getEl('active-chips');
const filterBackdrop = getEl('filter-backdrop');
const filterCloseButton = getEl('filter-close');
const filterApplyButton = getEl('filter-apply');
const listPagination = getEl('list-pagination');
const paginationInfo = getEl('pagination-info');
const loadMoreBtn = getEl('load-more-btn');
const showAllBtn = getEl('show-all-btn');
const skuDrawer = getEl('sku-drawer');
const skuDrawerBackdrop = getEl('sku-drawer-backdrop');
const drawerEyebrow = getEl('drawer-eyebrow');
const drawerTitle = getEl('drawer-title');
const drawerBody = getEl('drawer-body');
const drawerClose = getEl('drawer-close');
const drawerDone = getEl('drawer-done');
const drawerCopy = getEl('drawer-copy');
const methodDialog = getEl('method-dialog');
const methodOpenButtons = [
  getEl('method-open'),
  getEl('method-open-footer'),
];
const methodCloseButtons = [
  getEl('method-close'),
  getEl('method-done'),
];

const languageButtons = {
  id: getEl('language-id'),
  en: getEl('language-en'),
};

const statCards = {
  risk: getEl('stat-card-risk'),
  value: getEl('stat-card-value'),
  stockValue: getEl('stat-card-stock-value'),
  riskRatio: getEl('stat-card-risk-ratio'),
};

const filterDescriptors = [
  { select: riskFilter, labelKey: 'risk_status' },
  { select: urgencyFilter, labelKey: 'expiry_urgency' },
  { select: expiryRangeFilter, labelKey: 'expiry_range' },
  { select: stockCoverFilter, labelKey: 'stock_cover_filter' },
  { select: skuCategoryFilter, labelKey: 'sku_category_filter' },
  { select: skuStatusFilter, labelKey: 'sku_status_filter' },
  { select: oosFilter, labelKey: 'oos_filter' },
  { select: swcNoteFilter, labelKey: 'swc_note_filter' },
  { select: provisionFilter, labelKey: 'provision_filter' },
  { select: riskValueFilter, labelKey: 'risk_value_filter' },
  { select: salesVelocityFilter, labelKey: 'sales_velocity' },
  { select: paretoFilter, labelKey: 'pareto' },
];

let channel = 'Online';
let sortKey = 'value';
let sortDir = 'desc';
let onlineReportsExpired = false;
const mobileInventory = window.matchMedia('(max-width: 670px)');
function defaultPageSize() {
  return mobileInventory.matches ? 30 : 60;
}
let renderLimit = defaultPageSize();
function resetPagination() {
  renderLimit = defaultPageSize();
}
let activeDrawerRecord = null;
let drawerOpener = null;
let pendingCategory = '';
let pendingSwcNote = '';
let pendingProvision = '';

const urlParamBindings = [
  ['q', search],
  ['risk', riskFilter],
  ['urg', urgencyFilter],
  ['ed', expiryRangeFilter],
  ['cover', stockCoverFilter],
  ['cat', skuCategoryFilter],
  ['sku', skuStatusFilter],
  ['oos', oosFilter],
  ['swc', swcNoteFilter],
  ['prov', provisionFilter],
  ['val', riskValueFilter],
  ['vel', salesVelocityFilter],
  ['pareto', paretoFilter],
];

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  const ch = params.get('ch');
  if (ch === 'all' || ch === 'Online' || ch === 'Offline') {
    channel = ch;
    for (const btn of filterButtons) {
      btn.setAttribute('aria-pressed', String(btn.dataset.channel === channel));
    }
  }
  const sortParam = params.get('sort');
  if (sortParam && Object.hasOwn(defaultSortDir, sortParam)) {
    sortKey = sortParam;
    const dirParam = params.get('dir');
    sortDir = dirParam === 'asc' || dirParam === 'desc' ? dirParam : (defaultSortDir[sortKey] ?? 'desc');
  }
  for (const [key, control] of urlParamBindings) {
    const val = params.get(key);
    if (!val) continue;
    if (key === 'cat') pendingCategory = val;
    else if (key === 'swc') pendingSwcNote = val;
    else if (key === 'prov') pendingProvision = val;
    else if (control === search || [...control.options].some(opt => opt.value === val)) {
      control.value = val;
    }
  }
  updateSkuCategoryVisibility();
}

function syncUrlState() {
  const params = new URLSearchParams();
  if (channel !== 'Online') params.set('ch', channel);
  for (const [key, control] of urlParamBindings) {
    const val = key === 'q' ? control.value.trim() : (!control.disabled ? control.value : '');
    if (val) params.set(key, val);
    else if (key === 'cat' && pendingCategory && channel !== 'Offline') params.set(key, pendingCategory);
    else if (key === 'swc' && pendingSwcNote && channel === 'Offline') params.set(key, pendingSwcNote);
    else if (key === 'prov' && pendingProvision && channel === 'Offline') params.set(key, pendingProvision);
  }
  if (sortKey !== 'value' || sortDir !== 'desc') {
    params.set('sort', sortKey);
    params.set('dir', sortDir);
  }
  const qs = params.toString();
  const nextUrl = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
  if (nextUrl !== window.location.pathname + window.location.search + window.location.hash) {
    history.replaceState(null, '', nextUrl);
  }
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch { /* fallback below */ }
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.append(ta);
  ta.select();
  const ok = document.execCommand('copy');
  ta.remove();
  return ok;
}

function setChannel(nextChannel) {
  channel = nextChannel;
  if (channel === 'Offline') {
    skuCategoryFilter.value = '';
    pendingCategory = '';
  } else {
    skuStatusFilter.value = '';
    oosFilter.value = '';
    swcNoteFilter.value = '';
    provisionFilter.value = '';
    pendingSwcNote = '';
    pendingProvision = '';
  }
  for (const item of filterButtons) item.setAttribute('aria-pressed', String(item.dataset.channel === channel));
  resetPagination();
  updateSkuCategoryVisibility();
  draw();
}
const stockCards = getEl('stock-cards');
const filterToggle = getEl('filter-toggle');
const advancedFilters = getEl('advanced-filters');
const activeFilterCount = getEl('active-filter-count');
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
  if (record.channel === 'Offline' && record.oosFilter === 'OOS' && record.stock === 0) return [t('oos_status'), 'oos'];
  if (record.daysLeft === null && record.expiredStock > 0) return [t('expired_stock'), 'expired'];
  if (record.incomplete) return [t('incomplete_sales'), 'missing'];
  if (record.daysLeft === null) return [t('no_expiry_status'), 'no-date'];
  return record.risk > 0 ? [t('at_risk'), 'at-risk'] : [t('no_risk_estimate'), 'clear'];
}

function pricedRiskValue(record) {
  return Number.isFinite(record.risk) && Number.isFinite(record.productCost)
    ? record.risk * record.productCost : null;
}

function pricedStockValue(record) {
  return Number.isFinite(record.stock) && Number.isFinite(record.productCost)
    ? record.stock * record.productCost : null;
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
  return Number.isFinite(value) && value >= 0 ? stockCoverFormat(value * 12 / 364) : '—';
}

function channelLabel(value) {
  if (value === 'all') return t('all_channels');
  return value === 'Offline' ? t('offline_monthly') : t('online');
}

function paretoLabel(value) {
  if (value === 'Pareto 80%') return t('pareto_80');
  if (value === 'Non Pareto') return t('non_pareto');
  if (value === 'Tidak ada penjualan') return t('no_sales_status');
  return value || t('unmapped');
}

function updateSyncStatus() {
  syncStatus.classList.remove('is-ready', 'is-error', 'is-stale');
  if (offlineState === 'loading' || onlineState === 'loading') {
    syncStatus.textContent = t('syncing_data');
    return;
  }
  if (offlineState === 'error' || onlineState === 'error') {
    syncStatus.textContent = t('sync_issue');
    syncStatus.classList.add('is-error');
    return;
  }
  if (staleData) {
    syncStatus.textContent = t('synced_at').replace('{time}', syncDate.format(lastSyncAt ?? new Date())) + t('stale_suffix');
    syncStatus.classList.add('is-stale');
    return;
  }
  syncStatus.textContent = t('synced_at').replace('{time}', syncDate.format(lastSyncAt ?? new Date()));
  syncStatus.classList.add('is-ready');
}

function applyLanguage() {
  document.documentElement.lang = locale;
  for (const element of getQsAll('[data-i18n]')) {
    const value = t(element.dataset.i18n);
    if (element.tagName === 'OPTION' || element.tagName === 'BUTTON' || element.tagName === 'SUMMARY') {
      element.textContent = value;
    } else {
      element.innerHTML = value;
    }
  }
  for (const element of getQsAll('[data-i18n-aria]')) {
    element.setAttribute('aria-label', t(element.dataset.i18nAria));
  }
  search.placeholder = t('search_placeholder');
  getQs('.channel-tabs').setAttribute('aria-label', t('channel'));
  getQs('.table-wrap').setAttribute('aria-label', t('inventory_title'));
  languageButtons.id.setAttribute('aria-pressed', String(locale === 'id'));
  languageButtons.en.setAttribute('aria-pressed', String(locale === 'en'));
  updateSkuCategoryOptions();
  updateSwcNoteOptions();
  updateProvisionFilterOptions();
  updateSkuCategoryVisibility();
  updateSyncStatus();
  applySortIndicators();
  if (activeDrawerRecord && !skuDrawer.hidden) openSkuDrawer(activeDrawerRecord, drawerOpener);
}

function updateSkuCategoryOptions() {
  const selected = pendingCategory || skuCategoryFilter.value;
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
  if (categories.includes(selected)) {
    skuCategoryFilter.value = selected;
    pendingCategory = '';
  } else {
    skuCategoryFilter.value = '';
  }
}

function updateSwcNoteOptions() {
  const selected = pendingSwcNote || swcNoteFilter.value;
  const notes = [...new Set(offlineRecords
    .map(record => String(record.swcNote ?? '').trim())
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, locale === 'en' ? 'en' : 'id', { numeric: true }));
  swcNoteFilter.replaceChildren();
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = t('all_swc_notes');
  swcNoteFilter.append(allOption);
  for (const note of notes) {
    const option = document.createElement('option');
    option.value = note;
    option.textContent = note;
    swcNoteFilter.append(option);
  }
  if (notes.includes(selected)) {
    swcNoteFilter.value = selected;
    pendingSwcNote = '';
  } else {
    swcNoteFilter.value = '';
  }
}

function updateProvisionFilterOptions() {
  const selected = pendingProvision || provisionFilter.value;
  const statuses = [...new Set(offlineRecords
    .map(record => String(record.provisionStatus ?? '').trim())
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, locale === 'en' ? 'en' : 'id'));
  provisionFilter.replaceChildren();
  const addOpt = (val, label) => {
    const option = document.createElement('option');
    option.value = val;
    option.textContent = label;
    provisionFilter.append(option);
  };
  addOpt('', t('all_provisions'));
  if (statuses.some(s => s.toLowerCase().includes('kena provisi'))) {
    addOpt('__KENA_PROVISI__', t('provision_all_hit'));
  }
  for (const status of statuses) addOpt(status, status);
  if (selected && (selected === '__KENA_PROVISI__' || statuses.includes(selected))) {
    provisionFilter.value = selected;
    pendingProvision = '';
  } else {
    provisionFilter.value = '';
  }
}

function updateSkuCategoryVisibility() {
  const showCategory = channel !== 'Offline';
  skuCategoryPicker.hidden = !showCategory;
  skuCategoryFilter.disabled = !showCategory;

  const isOffline = channel === 'Offline';
  skuStatusPicker.hidden = !isOffline;
  skuStatusFilter.disabled = !isOffline;
  oosFilterPicker.hidden = !isOffline;
  oosFilter.disabled = !isOffline;
  swcNotePicker.hidden = !isOffline;
  swcNoteFilter.disabled = !isOffline;
  provisionFilterPicker.hidden = !isOffline;
  provisionFilter.disabled = !isOffline;
  for (const btn of quickButtons) {
    const mode = btn.dataset.quick;
    if (mode === 'active' || mode === 'inactive') btn.hidden = !isOffline;
    if (mode === 'ed90' || mode === 'ed180') btn.hidden = isOffline;
  }
}

const defaultSortDir = {
  name: 'asc',
  days: 'asc',
  stock: 'desc',
  value: 'desc',
  sales: 'desc',
  cover: 'desc',
  qty: 'desc',
};

function sortMetricValue(record, key) {
  if (key === 'name') return String(record.name ?? '').trim();
  if (key === 'stock') return Number.isFinite(record.stock) ? record.stock : null;
  if (key === 'value') return pricedRiskValue(record);
  if (key === 'sales') return Number.isFinite(record.averageMonthlySales) ? record.averageMonthlySales : null;
  if (key === 'cover') return Number.isFinite(record.stockCoverDays) ? record.stockCoverDays : null;
  if (key === 'days') return Number.isFinite(record.daysLeft) ? record.daysLeft : null;
  if (key === 'qty') return Number.isFinite(record.risk) ? record.risk : null;
  return null;
}

function applySortIndicators() {
  const sourceHead = tableScroll?.querySelector('thead');
  if (!sourceHead) return;
  for (const th of sourceHead.querySelectorAll('th[data-sort]')) {
    const active = th.dataset.sort === sortKey;
    if (active) {
      th.setAttribute('data-sort-dir', sortDir);
      th.setAttribute('aria-sort', sortDir === 'asc' ? 'ascending' : 'descending');
    } else {
      th.removeAttribute('data-sort-dir');
      th.removeAttribute('aria-sort');
    }
  }
  const syncSelect = ['value', 'days', 'qty'].includes(sortKey) ? sortKey : '';
  if (syncSelect) {
    prioritySort.value = syncSelect;
    if (mobilePrioritySort) mobilePrioritySort.value = syncSelect;
  }
  refreshStickyHeaderClone();
}

function matchesOosScope(record) {
  if (record.channel !== 'Offline') return true;
  if (channel !== 'Offline') return record.oosFilter !== 'OOS';
  if (oosFilter.value === 'OOS') return record.oosFilter === 'OOS';
  if (oosFilter.value === 'ALL') return true;
  return record.oosFilter !== 'OOS';
}

function visibleRecords() {
  const visible = filterPortfolio(records, channel, search.value)
    .filter(matchesOosScope)
    .filter(record => !riskFilter.value || (riskFilter.value === 'expired'
      ? record.expiredStock > 0 : statusOf(record)[1] === riskFilter.value))
    .filter(record => !urgencyFilter.value || riskWithin(record.expiries, Number(urgencyFilter.value)) > 0)
    .filter(record => matchesExpiryRange(record.daysLeft, expiryRangeFilter.value))
    .filter(record => !stockCoverFilter.value || rangeBand(record.stockCoverDays) === stockCoverFilter.value)
    .filter(record => channel === 'Offline' || !skuCategoryFilter.value || record.skuCategory === skuCategoryFilter.value)
    .filter(record => {
      if (channel !== 'Offline' || !skuStatusFilter.value) return true;
      if (skuStatusFilter.value === 'active') return record.isActive === true;
      if (skuStatusFilter.value === 'inactive') return record.isActive === false;
      return record.itemStatus === skuStatusFilter.value;
    })
    .filter(record => channel !== 'Offline' || !swcNoteFilter.value || record.swcNote === swcNoteFilter.value)
    .filter(record => {
      if (channel !== 'Offline' || !provisionFilter.value) return true;
      if (provisionFilter.value === '__KENA_PROVISI__') {
        return String(record.provisionStatus ?? '').toLowerCase().includes('kena provisi');
      }
      return record.provisionStatus === provisionFilter.value;
    })
    .filter(record => !riskValueFilter.value || riskValueBand(record) === riskValueFilter.value)
    .filter(record => !salesVelocityFilter.value || salesVelocityBand(record) === salesVelocityFilter.value)
    .filter(record => !paretoFilter.value || record.paretoStatus === paretoFilter.value);
  return visible.sort((a, b) => {
    const av = sortMetricValue(a, sortKey);
    const bv = sortMetricValue(b, sortKey);
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    let cmp;
    if (sortKey === 'name') {
      cmp = av.localeCompare(bv, locale === 'en' ? 'en' : 'id');
    } else {
      cmp = av - bv;
    }
    return sortDir === 'asc' ? cmp : -cmp;
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
    t('sku_category_filter'), t('sku_status_filter'), t('provision_filter'), t('provision_value_label'),
    t('oos_filter'), t('swc_note_filter'),
    t('available_stock').replace('<br>', ' '),
    t('total_stock_value'),
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
    const stockValue = pricedStockValue(record);
    const [riskLabel] = statusOf(record);
    const skuStatus = record.channel === 'Offline'
      ? (record.itemStatus || (record.isActive ? t('active_sku_only') : t('inactive_sku_only')))
      : '—';
    return [
      record.name,
      record.sku,
      channelLabel(record.channel),
      record.skuCategory || '—',
      skuStatus,
      record.channel === 'Offline' ? (record.provisionStatus || '—') : '—',
      record.channel === 'Offline' && Number.isFinite(record.provisionValue) ? formatRupiah(record.provisionValue) : '—',
      record.channel === 'Offline' ? (record.oosFilter || '—') : '—',
      record.channel === 'Offline' ? (record.swcNote || '—') : '—',
      number.format(record.stock),
      Number.isFinite(stockValue) ? formatRupiah(stockValue) : '—',
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
  if (channel === 'all') {
    const chTag = document.createElement('span');
    chTag.className = 'meta-tag ' + (record.channel === 'Offline' ? 'meta-tag-channel-offline' : 'meta-tag-channel-online');
    chTag.textContent = record.channel;
    meta.append(chTag);
  }
  if (record.paretoStatus === 'Pareto 80%') {
    const tag = document.createElement('span');
    tag.className = 'meta-tag meta-tag-pareto';
    tag.textContent = t('pareto_80');
    meta.append(tag);
  }
  if (channel !== 'Offline' && record.skuCategory) {
    const tag = document.createElement('span');
    tag.className = 'meta-tag meta-tag-category';
    tag.textContent = record.skuCategory;
    meta.append(tag);
  }
  if (record.channel === 'Offline') {
    if (record.itemStatus === 'NEW') {
      const tag = document.createElement('span');
      tag.className = 'meta-tag meta-tag-new';
      tag.textContent = t('new_tag');
      meta.append(tag);
    } else if (record.itemStatus === 'DISCONTINUE') {
      const tag = document.createElement('span');
      tag.className = 'meta-tag meta-tag-inactive';
      tag.textContent = t('discontinue_tag');
      meta.append(tag);
    } else if (record.itemStatus === 'DELETED') {
      const tag = document.createElement('span');
      tag.className = 'meta-tag meta-tag-inactive';
      tag.textContent = t('deleted_tag');
      meta.append(tag);
    } else if (record.isActive === false) {
      const tag = document.createElement('span');
      tag.className = 'meta-tag meta-tag-inactive';
      tag.textContent = t('inactive_tag');
      meta.append(tag);
    }
  }
  if (record.channel === 'Offline' && record.oosFilter === 'OOS') {
    const tag = document.createElement('span');
    tag.className = 'meta-tag meta-tag-oos';
    tag.textContent = t('oos_tag');
    meta.append(tag);
  }
  if (record.channel === 'Offline' && record.swcNote) {
    const tag = document.createElement('span');
    tag.className = 'meta-tag meta-tag-swc';
    tag.textContent = record.swcNote;
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
  const titleHeading = product.querySelector('strong');
  const metaRow = product.querySelector('.product-meta');
  if (titleHeading) title.append(titleHeading);
  top.append(title, ...status.childNodes);
  if (metaRow) metaRow.classList.add('stock-card-meta');

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
  card.append(top);
  if (metaRow) card.append(metaRow);
  card.append(overview, details);
  card.addEventListener('click', event => {
    if (event.target.closest('details, summary, a, button')) return;
    openSkuDrawer(record, card);
  });
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

function updateQuickFilterCounts() {
  const base = filterPortfolio(records, channel, search.value).filter(matchesOosScope);
  const counts = {
    all: base.length,
    'at-risk': base.filter(record => statusOf(record)[1] === 'at-risk').length,
    ed90: base.filter(record => matchesExpiryRange(record.daysLeft, '0-90')).length,
    ed180: base.filter(record => matchesExpiryRange(record.daysLeft, '0-180')).length,
    active: base.filter(record => record.channel === 'Offline' && record.isActive === true).length,
    inactive: base.filter(record => record.channel === 'Offline' && record.isActive === false).length,
    pareto: base.filter(record => record.paretoStatus === 'Pareto 80%').length,
  };
  for (const badge of getQsAll('[data-pill-count]')) {
    const key = badge.dataset.pillCount;
    badge.textContent = base.length ? number.format(counts[key] ?? 0) : '';
  }
  syncQuickFilterFade();
}

const quickFiltersEl = getEl('quick-filters');
const quickFiltersWrap = getQs('.quick-filters-wrap');

function syncQuickFilterFade() {
  if (!quickFiltersEl || !quickFiltersWrap) return;
  const atEnd = quickFiltersEl.scrollLeft + quickFiltersEl.clientWidth >= quickFiltersEl.scrollWidth - 4;
  quickFiltersWrap.classList.toggle('is-at-end', atEnd);
}

quickFiltersEl?.addEventListener('scroll', syncQuickFilterFade, { passive: true });
window.addEventListener('resize', syncQuickFilterFade);

function syncQuickFilterPills() {
  const activeQuick = (() => {
    const anyExtra = Boolean(urgencyFilter.value || stockCoverFilter.value || skuCategoryFilter.value
      || oosFilter.value || swcNoteFilter.value || provisionFilter.value || riskValueFilter.value || salesVelocityFilter.value);
    if (anyExtra) return null;
    if (!riskFilter.value && !expiryRangeFilter.value && !paretoFilter.value && !skuStatusFilter.value) return 'all';
    if (riskFilter.value === 'at-risk' && !expiryRangeFilter.value && !paretoFilter.value && !skuStatusFilter.value) return 'at-risk';
    if (!riskFilter.value && expiryRangeFilter.value === '0-90' && !paretoFilter.value && !skuStatusFilter.value) return 'ed90';
    if (!riskFilter.value && expiryRangeFilter.value === '0-180' && !paretoFilter.value && !skuStatusFilter.value) return 'ed180';
    if (!riskFilter.value && !expiryRangeFilter.value && paretoFilter.value === 'Pareto 80%' && !skuStatusFilter.value) return 'pareto';
    if (!riskFilter.value && !expiryRangeFilter.value && !paretoFilter.value && skuStatusFilter.value === 'active') return 'active';
    if (!riskFilter.value && !expiryRangeFilter.value && !paretoFilter.value && skuStatusFilter.value === 'inactive') return 'inactive';
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
      if (select === skuCategoryFilter) pendingCategory = '';
      if (select === swcNoteFilter) pendingSwcNote = '';
      if (select === provisionFilter) pendingProvision = '';
      resetPagination();
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
  pendingCategory = '';
  pendingSwcNote = '';
  pendingProvision = '';
  for (const { select } of filterDescriptors) select.value = '';
  sortKey = 'value';
  sortDir = 'desc';
  prioritySort.value = 'value';
  if (mobilePrioritySort) mobilePrioritySort.value = 'value';
  resetPagination();
  applySortIndicators();
  draw();
}

function renderInsightCard(container, title, totalValue, items) {
  container.replaceChildren();
  const head = document.createElement('div');
  head.className = 'insight-head';
  const heading = document.createElement('h3');
  heading.className = 'insight-title';
  heading.textContent = title;
  const total = document.createElement('span');
  total.className = 'insight-total';
  total.textContent = compactRiskValue(totalValue);
  head.append(heading, total);

  const bar = document.createElement('div');
  bar.className = 'insight-bar';
  const legend = document.createElement('ul');
  legend.className = 'insight-legend';

  for (const item of items) {
    if (!(item.value > 0)) continue;
    const pct = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
    const seg = document.createElement('span');
    seg.className = 'insight-seg' + (item.onClick ? ' is-interactive' : '') + (item.isActive ? ' is-active' : '');
    seg.style.width = pct.toFixed(2) + '%';
    seg.style.backgroundColor = item.color;
    seg.title = item.label + ': ' + compactRiskValue(item.value) + ' (' + percentNumber.format(pct) + '%)'
      + (item.onClick ? ' · ' + t('click_to_filter') : '');
    if (item.onClick) {
      seg.setAttribute('role', 'button');
      seg.tabIndex = 0;
      seg.addEventListener('click', item.onClick);
      seg.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.onClick(); }
      });
    }
    bar.append(seg);

    const li = document.createElement('li');
    const dot = document.createElement('span');
    dot.className = 'insight-dot';
    dot.style.backgroundColor = item.color;
    const nameEl = document.createElement('span');
    nameEl.textContent = item.label;
    const valEl = document.createElement('strong');
    valEl.textContent = compactRiskValue(item.value) + ' (' + percentNumber.format(pct) + '%)';

    if (item.onClick) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'insight-legend-btn' + (item.isActive ? ' is-active' : '');
      btn.setAttribute('aria-pressed', String(Boolean(item.isActive)));
      btn.title = t('click_to_filter');
      btn.append(dot, nameEl, valEl);
      btn.addEventListener('click', item.onClick);
      li.append(btn);
    } else {
      li.append(dot, nameEl, valEl);
    }
    legend.append(li);
  }
  container.append(head, bar, legend);
}

function toggleSelectFilter(select, targetValue) {
  select.value = select.value === targetValue ? '' : targetValue;
  resetPagination();
  draw();
}

function renderInsights(visible, totalRiskValue) {
  if (!visible.length || !(totalRiskValue > 0)) {
    insightsStrip.hidden = true;
    return;
  }
  insightsStrip.hidden = false;

  if (channel === 'all') {
    let onlineVal = 0;
    let offlineVal = 0;
    for (const r of visible) {
      const rv = pricedRiskValue(r);
      if (!Number.isFinite(rv) || rv <= 0) continue;
      if (r.channel === 'Offline') offlineVal += rv;
      else onlineVal += rv;
    }
    renderInsightCard(insightPrimary, t('insight_channel_split'), onlineVal + offlineVal, [
      { label: t('online'), value: onlineVal, color: '#882653', onClick: () => setChannel('Online') },
      { label: 'Offline', value: offlineVal, color: '#0284c7', onClick: () => setChannel('Offline') },
    ]);
  } else if (channel === 'Offline') {
    let activeVal = 0;
    let inactiveVal = 0;
    for (const r of visible) {
      const rv = pricedRiskValue(r);
      if (!Number.isFinite(rv) || rv <= 0) continue;
      if (r.isActive) activeVal += rv;
      else inactiveVal += rv;
    }
    renderInsightCard(insightPrimary, t('insight_offline_status'), activeVal + inactiveVal, [
      {
        label: t('active_sku_only'), value: activeVal, color: '#882653',
        isActive: skuStatusFilter.value === 'active',
        onClick: () => toggleSelectFilter(skuStatusFilter, 'active'),
      },
      {
        label: t('inactive_sku_only'), value: inactiveVal, color: '#d97706',
        isActive: skuStatusFilter.value === 'inactive',
        onClick: () => toggleSelectFilter(skuStatusFilter, 'inactive'),
      },
    ]);
  } else {
    const byCat = new Map();
    for (const r of visible) {
      const rv = pricedRiskValue(r);
      if (!Number.isFinite(rv) || rv <= 0) continue;
      const cat = String(r.skuCategory || '').trim() || t('unmapped');
      byCat.set(cat, (byCat.get(cat) ?? 0) + rv);
    }
    const sorted = [...byCat.entries()].sort((a, b) => b[1] - a[1]);
    const palette = ['#882653', '#0284c7', '#d97706', '#64748b'];
    const top = sorted.slice(0, 3).map(([label, value], i) => ({
      label,
      value,
      color: palette[i],
      isActive: label !== t('unmapped') && skuCategoryFilter.value === label,
      onClick: label !== t('unmapped') && [...skuCategoryFilter.options].some(o => o.value === label)
        ? () => toggleSelectFilter(skuCategoryFilter, label)
        : null,
    }));
    const otherSum = sorted.slice(3).reduce((acc, [, v]) => acc + v, 0);
    if (otherSum > 0) top.push({ label: t('insight_other'), value: otherSum, color: palette[3] });
    renderInsightCard(insightPrimary, t('insight_category_top'), totalRiskValue, top);
  }

  let le90 = 0;
  let b91_180 = 0;
  let gt180 = 0;
  for (const r of visible) {
    if (!Number.isFinite(r.productCost) || !(r.risk > 0)) continue;
    let accounted = false;
    for (const exp of r.expiries ?? []) {
      if (exp.days >= 0 && Number.isFinite(exp.riskQty) && exp.riskQty > 0) {
        const val = exp.riskQty * r.productCost;
        if (exp.days <= 90) le90 += val;
        else if (exp.days <= 180) b91_180 += val;
        else gt180 += val;
        accounted = true;
      }
    }
    if (!accounted && Number.isFinite(r.daysLeft)) {
      const val = r.risk * r.productCost;
      if (r.daysLeft <= 90) le90 += val;
      else if (r.daysLeft <= 180) b91_180 += val;
      else gt180 += val;
    }
  }
  const expTotal = le90 + b91_180 + gt180;
  renderInsightCard(insightExpiry, t('insight_expiry_dist'), expTotal, [
    {
      label: t('bucket_le_90'), value: le90, color: '#dc2626',
      isActive: expiryRangeFilter.value === '0-90',
      onClick: () => toggleSelectFilter(expiryRangeFilter, '0-90'),
    },
    {
      label: t('bucket_91_180'), value: b91_180, color: '#f59e0b',
      isActive: expiryRangeFilter.value === '91-180',
      onClick: () => toggleSelectFilter(expiryRangeFilter, '91-180'),
    },
    {
      label: t('bucket_gt_180'), value: gt180, color: '#882653',
      isActive: expiryRangeFilter.value === '180-plus',
      onClick: () => toggleSelectFilter(expiryRangeFilter, '180-plus'),
    },
  ]);
}

function isChannelLoading() {
  if (channel === 'Online') return onlineState === 'loading';
  if (channel === 'Offline') return offlineState === 'loading';
  return (onlineState === 'loading' || offlineState === 'loading') && !records.length;
}

function renderSkeletons() {
  if (mobileInventory.matches) {
    for (let i = 0; i < 4; i++) {
      const card = document.createElement('li');
      card.className = 'stock-card skeleton-card';
      card.setAttribute('aria-hidden', 'true');
      card.innerHTML = '<span class="skeleton-line w-70"></span><span class="skeleton-line w-40"></span><span class="skeleton-line w-90"></span>';
      stockCards.append(card);
    }
    return;
  }
  const colWidths = ['w-85', 'w-45', 'w-65', 'w-35', 'w-35', 'w-40', 'w-35', 'w-35', 'w-35', 'w-80', 'w-45', 'w-70'];
  for (let i = 0; i < 6; i++) {
    const tr = tableRows.insertRow();
    tr.className = 'skeleton-row';
    tr.setAttribute('aria-hidden', 'true');
    for (const widthClass of colWidths) {
      const td = tr.insertCell();
      const bar = document.createElement('span');
      bar.className = 'skeleton-line ' + widthClass;
      td.append(bar);
    }
  }
}

function promoRecommendation(record) {
  if (!(record.risk > 0)) return null;
  if (record.daysLeft === null || record.daysLeft <= 30) return { title: t('promo_now'), detail: t('promo_now_detail'), tone: 'urgent' };
  if (record.daysLeft <= 90) return { title: t('high_priority'), detail: t('high_priority_detail'), tone: 'high' };
  if (record.daysLeft <= 180) return { title: t('promo_priority'), detail: t('promo_priority_detail'), tone: 'medium' };
  return { title: t('scheduled_campaign'), detail: t('scheduled_campaign_detail'), tone: 'low' };
}

function buildSkuSummaryText(record) {
  const [statusLabel] = statusOf(record);
  const stockVal = pricedStockValue(record);
  const riskVal = pricedRiskValue(record);
  const firstExp = record.expiries?.find(e => e.days >= 0);
  const lines = [
    record.name,
    `SKU: ${record.sku} | Channel: ${channelLabel(record.channel)}`,
    `Stok: ${number.format(record.stock)} pcs` + (Number.isFinite(stockVal) ? ` (${formatRupiah(stockVal)})` : ''),
    `Sales/bln: ${salesFormat(record.averageMonthlySales)} pcs | Cover: ${stockCoverMonthsFormat(record.stockCoverDays)} bln`,
    `Risiko expired: ${record.risk === null ? '—' : number.format(record.risk) + ' pcs'}` + (Number.isFinite(riskVal) ? ` (${formatRupiah(riskVal)})` : ''),
    `ED terdekat: ${firstExp ? date.format(firstExp.date) + ' (' + number.format(firstExp.days) + ' hari lagi)' : '—'}`,
    `Status: ${statusLabel}`,
  ];
  if (record.channel === 'Offline') {
    if (record.itemStatus) lines.push(`Status Barang: ${record.itemStatus}`);
    if (record.provisionStatus) {
      const provRp = Number.isFinite(record.provisionValue) && record.provisionValue > 0
        ? ` (${formatRupiah(record.provisionValue)})`
        : '';
      lines.push(`Provisi: ${record.provisionStatus}${provRp}`);
    }
  }
  return lines.join('\n');
}

function addDrawerKpi(grid, label, value, toneClass = '') {
  const card = document.createElement('div');
  card.className = 'drawer-kpi';
  const dt = document.createElement('span');
  dt.className = 'drawer-kpi-label';
  dt.textContent = label;
  const dd = document.createElement('strong');
  dd.className = 'drawer-kpi-value' + (toneClass ? ' ' + toneClass : '');
  dd.textContent = value;
  card.append(dt, dd);
  grid.append(card);
}

function openSkuDrawer(record, triggerEl = null) {
  activeDrawerRecord = record;
  drawerOpener = triggerEl || document.activeElement;
  const [statusLabel, statusClass] = statusOf(record);

  drawerEyebrow.replaceChildren();
  const chTag = document.createElement('span');
  chTag.className = 'meta-tag ' + (record.channel === 'Offline' ? 'meta-tag-channel-offline' : 'meta-tag-channel-online');
  chTag.textContent = channelLabel(record.channel);
  const skuTag = document.createElement('span');
  skuTag.className = 'sku-code';
  skuTag.textContent = record.sku;
  const statusPill = document.createElement('span');
  statusPill.className = 'status ' + statusClass;
  statusPill.textContent = statusLabel;
  drawerEyebrow.append(chTag, skuTag, statusPill);
  drawerTitle.textContent = record.name;

  drawerBody.replaceChildren();

  const metaTags = buildProductMeta(record);
  if (record.paretoRank || Number.isFinite(record.paretoContribution)) {
    const paretoInfo = document.createElement('span');
    paretoInfo.className = 'meta-tag meta-tag-pareto';
    const parts = [];
    if (record.paretoRank) parts.push('#' + number.format(record.paretoRank));
    if (Number.isFinite(record.paretoContribution)) parts.push(percentNumber.format(record.paretoContribution) + '%');
    paretoInfo.textContent = 'Pareto ' + parts.join(' · ');
    metaTags.append(paretoInfo);
  }
  drawerBody.append(metaTags);

  const promo = promoRecommendation(record);
  if (promo) {
    const banner = document.createElement('div');
    banner.className = 'drawer-action-banner is-' + promo.tone;
    const titleEl = document.createElement('strong');
    titleEl.textContent = t('recommended_action') + ': ' + promo.title;
    const descEl = document.createElement('span');
    descEl.textContent = promo.detail;
    banner.append(titleEl, descEl);
    drawerBody.append(banner);
  }

  const kpiGrid = document.createElement('div');
  kpiGrid.className = 'drawer-kpi-grid';
  const stockVal = pricedStockValue(record);
  const riskVal = pricedRiskValue(record);
  addDrawerKpi(kpiGrid, t('unit_cost'), Number.isFinite(record.productCost) ? formatRupiah(record.productCost) : '—');
  addDrawerKpi(kpiGrid, t('total_stock_value'), Number.isFinite(stockVal) ? formatRupiah(stockVal) : '—');
  addDrawerKpi(kpiGrid, t('at_risk_value'), Number.isFinite(riskVal) ? formatRupiah(riskVal) : '—', riskVal > 0 ? 'is-risk' : '');
  addDrawerKpi(
    kpiGrid,
    t('available_stock').replace('<br>', ' '),
    number.format(record.stock) + ' pcs' + (record.risk !== null ? ' · ' + number.format(record.risk) + ' ' + t('batch_risk') : ''),
    record.risk > 0 ? 'is-qty-risk' : '',
  );
  if (record.channel === 'Offline' && (record.provisionStatus || Number.isFinite(record.provisionValue))) {
    addDrawerKpi(kpiGrid, t('provision_filter'), record.provisionStatus || '—');
    addDrawerKpi(
      kpiGrid,
      t('provision_value_label'),
      Number.isFinite(record.provisionValue) ? formatRupiah(record.provisionValue) : '—',
      record.provisionValue > 0 ? 'is-risk' : '',
    );
  }
  drawerBody.append(kpiGrid);

  const metricsSection = document.createElement('div');
  metricsSection.className = 'drawer-section';
  const metricsHeading = document.createElement('h3');
  metricsHeading.textContent = t('sales_and_cover');
  const miniTable = document.createElement('table');
  miniTable.className = 'drawer-mini-table';
  miniTable.innerHTML = '<thead><tr><th></th><th>' + escapeHtml(t('day_unit')) + '</th><th>' + escapeHtml(t('week_unit')) + '</th><th>' + escapeHtml(t('month_unit')) + '</th></tr></thead>';
  const tb = document.createElement('tbody');
  const rSales = tb.insertRow();
  rSales.insertCell().textContent = t('average_sales');
  rSales.insertCell().textContent = salesFormat(record.averageDailySales);
  rSales.insertCell().textContent = salesFormat(record.averageWeeklySales);
  rSales.insertCell().textContent = salesFormat(record.averageMonthlySales);
  const rCover = tb.insertRow();
  rCover.insertCell().textContent = t('stock_cover_filter');
  rCover.insertCell().textContent = stockCoverFormat(record.stockCoverDays);
  rCover.insertCell().textContent = stockCoverWeeksFormat(record.stockCoverDays);
  rCover.insertCell().textContent = stockCoverMonthsFormat(record.stockCoverDays);
  miniTable.append(tb);
  metricsSection.append(metricsHeading, miniTable);
  if (record.channel === 'Offline' && (Number.isFinite(record.completedSalesMonths) || record.firstArrivalDate)) {
    const parts = [];
    if (Number.isFinite(record.completedSalesMonths)) {
      parts.push(t('closed_months_label') + ': ' + number.format(record.completedSalesMonths));
    }
    if (record.firstArrivalDate) {
      parts.push(t('first_arrival_label') + ': ' + record.firstArrivalDate);
    }
    const note = document.createElement('p');
    note.className = 'drawer-footnote';
    note.textContent = parts.join(' · ');
    metricsSection.append(note);
  }
  drawerBody.append(metricsSection);

  const batchSection = document.createElement('div');
  batchSection.className = 'drawer-section';
  const batchHeading = document.createElement('h3');
  batchHeading.textContent = t('batch_breakdown_title');
  batchSection.append(batchHeading);

  if (!record.expiries?.length && !record.undatedStock) {
    const emptyBatch = document.createElement('p');
    emptyBatch.className = 'drawer-footnote';
    emptyBatch.textContent = statusLabel;
    batchSection.append(emptyBatch);
  } else {
    const list = document.createElement('ul');
    list.className = 'drawer-batch-list';
    for (const exp of record.expiries ?? []) {
      const li = document.createElement('li');
      li.className = 'drawer-batch-item';
      const top = document.createElement('div');
      top.className = 'drawer-batch-top';
      const dateStrong = document.createElement('strong');
      dateStrong.textContent = date.format(exp.date) + ' · ' + number.format(exp.qty) + ' pcs';
      const tone = expiryRiskTone(exp);
      const badge = document.createElement('span');
      badge.className = 'batch-risk ' + tone;
      badge.textContent = expiryRiskLabel(exp);
      top.append(dateStrong, badge);
      li.append(top);

      if (exp.days >= 0 && exp.riskQty !== null) {
        const soldQty = Math.max(0, exp.qty - exp.riskQty);
        const riskPct = exp.qty > 0 ? (exp.riskQty / exp.qty) * 100 : 0;
        const sub = document.createElement('div');
        sub.className = 'drawer-batch-sub';
        const batchRiskRp = Number.isFinite(record.productCost) && exp.riskQty > 0
          ? ' · ' + t('batch_risk_value') + ': ' + formatRupiah(exp.riskQty * record.productCost)
          : '';
        sub.textContent = number.format(exp.days) + ' ' + t('days_left')
          + ' · ' + t('est_sold_qty') + ': ' + number.format(soldQty) + ' pcs' + batchRiskRp;
        const barWrap = document.createElement('div');
        barWrap.className = 'drawer-batch-bar';
        const fill = document.createElement('span');
        fill.className = 'drawer-batch-bar-fill ' + (exp.riskQty > 0 ? 'is-risk' : 'is-safe');
        fill.style.width = Math.max(exp.riskQty > 0 ? 4 : 100, exp.riskQty > 0 ? riskPct : 100).toFixed(1) + '%';
        barWrap.append(fill);
        li.append(sub, barWrap);
      }
      list.append(li);
    }
    if (record.undatedStock > 0) {
      const li = document.createElement('li');
      li.className = 'drawer-batch-item';
      li.innerHTML = '<div class="drawer-batch-top"><strong>' + escapeHtml(t('without_expiry')) + ' · ' + escapeHtml(number.format(record.undatedStock)) + ' pcs</strong></div>';
      list.append(li);
    }
    batchSection.append(list);
  }
  drawerBody.append(batchSection);

  skuDrawerBackdrop.hidden = false;
  skuDrawer.hidden = false;
  document.body.style.overflow = 'hidden';
  drawerClose.focus();
}

function closeSkuDrawer() {
  if (skuDrawer.hidden) return;
  skuDrawer.hidden = true;
  skuDrawerBackdrop.hidden = true;
  if (!(filterToggle.getAttribute('aria-expanded') === 'true' && mobileInventory.matches)) {
    document.body.style.overflow = '';
  }
  activeDrawerRecord = null;
  if (drawerOpener && typeof drawerOpener.focus === 'function') {
    drawerOpener.focus();
  }
  drawerOpener = null;
}

function draw() {
  getEl('source-label').textContent = channel === 'all'
    ? t('all_sources')
    : (channel === 'Online' ? t('online_source') : t('offline_source'));

  const loading = isChannelLoading();
  statsSection?.classList.toggle('is-loading', loading);

  const visible = visibleRecords();
  const knownRisk = visible.filter(record => record.risk !== null);
  const pricedRisk = visible.filter(record => pricedRiskValue(record) !== null);
  const pricedStock = visible.filter(record => pricedStockValue(record) !== null);
  const totalRiskQty = knownRisk.reduce((total, record) => total + record.risk, 0);
  const totalRiskValue = pricedRisk.reduce((total, record) => total + pricedRiskValue(record), 0);
  const totalStockValue = pricedStock.reduce((total, record) => total + pricedStockValue(record), 0);
  const riskRatioPct = totalStockValue > 0 && pricedRisk.length > 0
    ? (totalRiskValue / totalStockValue) * 100
    : null;

  getEl('sku-count').textContent = number.format(visible.length);
  getEl('risk-count').textContent = knownRisk.length ? number.format(totalRiskQty) : '—';
  getEl('risk-value-count').textContent = pricedRisk.length ? compactRiskValue(totalRiskValue) : '—';
  getEl('stock-value-count').textContent = pricedStock.length ? compactRiskValue(totalStockValue) : '—';
  getEl('risk-ratio-count').textContent = riskRatioPct !== null
    ? percentNumber.format(riskRatioPct) + '%'
    : '—';

  setCardTone(statCards.risk, knownRisk.length > 0, totalRiskQty);
  setCardTone(statCards.value, pricedRisk.length > 0, totalRiskValue);
  setCardTone(statCards.riskRatio, riskRatioPct !== null, riskRatioPct);
  const atRiskOnlyActive = riskFilter.value === 'at-risk';
  statCards.risk?.classList.toggle('is-active-filter', atRiskOnlyActive);
  statCards.value?.classList.toggle('is-active-filter', atRiskOnlyActive);
  statCards.risk?.setAttribute('aria-pressed', String(atRiskOnlyActive));
  statCards.value?.setAttribute('aria-pressed', String(atRiskOnlyActive));
  riskRatioBar.style.width = riskRatioPct !== null
    ? Math.min(100, Math.max(0, riskRatioPct)).toFixed(1) + '%'
    : '0%';
  renderInsights(visible, totalRiskValue);

  getEl('result-count').textContent = t('result_count').replace('{count}', number.format(visible.length));
  if (searchClear) searchClear.hidden = search.value.length === 0;
  updateQuickFilterCounts();
  syncQuickFilterPills();
  renderActiveChips();
  syncUrlState();

  const dataFiltered = filterDescriptors.some(({ select }) => !select.disabled && Boolean(select.value));
  getEl('summary-context').textContent =
    t(dataFiltered || search.value.trim() ? 'summary_filtered' : 'summary_channel') + ' · ' + channelLabel(channel);

  tableRows.replaceChildren();
  stockCards.replaceChildren();

  if (!visible.length) {
    if (loading) {
      renderSkeletons();
    } else {
      let label = t('no_match');
      if (channel === 'all' && offlineState === 'error' && onlineState === 'error') label = t('all_error');
      if (channel === 'Offline' && offlineState === 'error') label = t('offline_error');
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
  }

  const pageItems = visible.slice(0, renderLimit);
  for (const record of pageItems) {
    const row = mobileInventory.matches ? document.createElement('tr') : tableRows.insertRow();
    if (!mobileInventory.matches) {
      row.className = 'is-clickable';
      row.tabIndex = 0;
      row.addEventListener('click', () => openSkuDrawer(record, row));
      row.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openSkuDrawer(record, row);
        }
      });
    }
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

  const remaining = visible.length - pageItems.length;
  if (listPagination) {
    listPagination.hidden = remaining <= 0;
    if (remaining > 0) {
      paginationInfo.textContent = t('showing_of')
        .replace('{shown}', number.format(pageItems.length))
        .replace('{total}', number.format(visible.length));
      loadMoreBtn.textContent = t('load_more')
        .replace('{count}', number.format(Math.min(defaultPageSize(), remaining)));
    }
  }
  syncStickyHeader();
}

function mergeRecords() {
  records = [...offlineRecords, ...onlineRecords];
  draw();
}

for (const button of filterButtons) {
  button.addEventListener('click', () => setChannel(button.dataset.channel));
}

for (const card of [statCards.risk, statCards.value]) {
  card?.addEventListener('click', () => toggleSelectFilter(riskFilter, 'at-risk'));
  card?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleSelectFilter(riskFilter, 'at-risk');
    }
  });
}

for (const button of quickButtons) {
  button.addEventListener('click', () => {
    const mode = button.dataset.quick;
    pendingCategory = '';
    pendingSwcNote = '';
    pendingProvision = '';
    for (const { select } of filterDescriptors) select.value = '';
    if (mode === 'at-risk') riskFilter.value = 'at-risk';
    if (mode === 'ed90') expiryRangeFilter.value = '0-90';
    if (mode === 'ed180') expiryRangeFilter.value = '0-180';
    if (mode === 'pareto') paretoFilter.value = 'Pareto 80%';
    if (mode === 'active') skuStatusFilter.value = 'active';
    if (mode === 'inactive') skuStatusFilter.value = 'inactive';
    resetPagination();
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
drawerClose?.addEventListener('click', closeSkuDrawer);
drawerDone?.addEventListener('click', closeSkuDrawer);
skuDrawerBackdrop?.addEventListener('click', closeSkuDrawer);

drawerCopy?.addEventListener('click', async () => {
  if (!activeDrawerRecord) return;
  const ok = await copyText(buildSkuSummaryText(activeDrawerRecord));
  if (!ok) return;
  const labelSpan = drawerCopy.querySelector('span');
  if (labelSpan) labelSpan.textContent = t('summary_copied');
  setTimeout(() => {
    if (labelSpan) labelSpan.textContent = t('copy_sku_summary');
  }, 1800);
});

shareViewButton?.addEventListener('click', async () => {
  const ok = await copyText(window.location.href);
  if (!ok) return;
  const labelSpan = shareViewButton.querySelector('span');
  if (labelSpan) labelSpan.textContent = t('link_copied');
  shareViewButton.classList.add('is-copied');
  setTimeout(() => {
    if (labelSpan) labelSpan.textContent = t('share_view');
    shareViewButton.classList.remove('is-copied');
  }, 2000);
});

loadMoreBtn?.addEventListener('click', () => {
  renderLimit += defaultPageSize();
  draw();
});

showAllBtn?.addEventListener('click', () => {
  renderLimit = Infinity;
  draw();
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (skuDrawer && !skuDrawer.hidden) {
    event.preventDefault();
    closeSkuDrawer();
    return;
  }
  if (filterToggle.getAttribute('aria-expanded') === 'true') {
    event.preventDefault();
    setFiltersExpanded(false);
    filterToggle.focus();
  }
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
  select.addEventListener('change', () => {
    if (select === skuCategoryFilter) pendingCategory = '';
    if (select === swcNoteFilter) pendingSwcNote = '';
    if (select === provisionFilter) pendingProvision = '';
    resetPagination();
    draw();
  });
}

prioritySort.addEventListener('change', () => {
  sortKey = prioritySort.value;
  sortDir = defaultSortDir[sortKey] ?? 'desc';
  if (mobilePrioritySort) mobilePrioritySort.value = prioritySort.value;
  resetPagination();
  applySortIndicators();
  draw();
});

mobilePrioritySort?.addEventListener('change', () => {
  sortKey = mobilePrioritySort.value;
  sortDir = defaultSortDir[sortKey] ?? 'desc';
  prioritySort.value = mobilePrioritySort.value;
  resetPagination();
  applySortIndicators();
  draw();
});

tableWrap?.addEventListener('click', event => {
  const th = event.target.closest('th[data-sort]');
  if (!th) return;
  const key = th.dataset.sort;
  if (sortKey === key) {
    sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey = key;
    sortDir = defaultSortDir[key] ?? 'desc';
  }
  resetPagination();
  applySortIndicators();
  draw();
});

refreshButton?.addEventListener('click', async () => {
  if (refreshButton.disabled) return;
  refreshButton.disabled = true;
  refreshButton.classList.add('is-spinning');
  offlineState = 'loading';
  onlineState = 'loading';
  updateSyncStatus();
  draw();
  try {
    await Promise.all([refreshOffline(true), refreshOnline(true)]);
  } finally {
    refreshButton.classList.remove('is-spinning');
    refreshButton.disabled = false;
  }
});

mobileInventory.addEventListener('change', () => {
  if (!mobileInventory.matches) {
    filterBackdrop.hidden = true;
    if (skuDrawer.hidden) document.body.style.overflow = '';
  }
  resetPagination();
  draw();
});

search.addEventListener('input', () => {
  resetPagination();
  draw();
});
search.addEventListener('search', () => {
  resetPagination();
  draw();
});
searchClear?.addEventListener('click', () => {
  search.value = '';
  resetPagination();
  draw();
  search.focus();
});
exportExcelButton.addEventListener('click', exportExcelFile);
mobileExportExcelButton?.addEventListener('click', () => {
  exportExcelFile();
  setFiltersExpanded(false);
});
resetFiltersButton.addEventListener('click', resetFilterSelections);

readUrlState();
setupStickyTableHeader();
applyLanguage();
draw();

async function refreshOffline(forceRefresh = false) {
  try {
    const response = await fetch('/api/offline' + (forceRefresh ? '?refresh=1' : ''), { cache: 'no-store' });
    if (!response.ok) throw new Error('Offline sheet unavailable');
    const payload = await response.json();
    if (!Array.isArray(payload.records)) throw new Error('Offline sheet returned invalid data');
    offlineRecords = portfolio(payload.records);
    updateSwcNoteOptions();
    updateProvisionFilterOptions();
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

async function refreshOnline(forceRefresh = false) {
  try {
    const response = await fetch('/api/online' + (forceRefresh ? '?refresh=1' : ''), { cache: 'no-store' });
    if (!response.ok) throw new Error('Feed unavailable');
    const rows = await response.json();
    const today = jakartaDay();
    onlineRecords = rows.map(row => {
      const effectiveDailySales = row.incomplete ? null : row.averageDailySales;
      const expiries = estimateExpiryRisk(row.expiries.map(expiry => {
        const parsedDate = new Date(expiry.date + 'T00:00:00Z');
        return { ...expiry, date: parsedDate, days: Math.round((parsedDate.getTime() - today) / 86_400_000) };
      }), effectiveDailySales);
      const daysLeft = expiries.find(expiry => expiry.days >= 0)?.days ?? null;
      const expiredStock = expiries.reduce((total, expiry) => total + (expiry.days < 0 ? expiry.qty : 0), 0);
      const stock = Math.max(0, Number(row.stock) - expiredStock);
      return {
        ...row, channel: 'Online', daysLeft, expiries, expiredStock, stock,
        incomplete: row.incomplete || (daysLeft !== null && row.averageDailySales == null),
        risk: riskWithin(expiries, Infinity),
        productCost: row.productCost == null ? null : Number(row.productCost),
        stockCoverDays: effectiveDailySales > 0 ? stock / effectiveDailySales : null,
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
