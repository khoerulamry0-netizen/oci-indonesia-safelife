import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const rootPrefix = root.endsWith(sep) ? root : root + sep;
const port = Number(process.env.PORT || 10000);
const upstream = 'https://oci-indonesia.verdantspark1.chatgpt.site/api/online';
const fetchTimeoutMs = Number(process.env.FETCH_TIMEOUT_MS || 15000);

function fetchWithTimeout(url, opts = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), fetchTimeoutMs);
  return fetch(url, { ...opts, signal: controller.signal })
    .finally(() => clearTimeout(timeoutId));
}
const spreadsheetId = '1RpLHOzhQd58zO2NvIoubybaHiXNavWGczVOa5fzS-m0';
const clusteringOfflineGid = '211915398';
const monthlySalesGid = '953675285';
const activeSkuOfflineGid = '963622879';  // Tab "active sku offline"
const onlineSpreadsheetId = '1Sc4y1_fIfWSIYarB_dasBIP4TO0EjBlnzZ09ted62UU';
const onlineSummaryGid = '1008501005';
const masterCostGid = '686994777';
const onlineParetoGid = '1197311588';
const onlineSkuCategorySheetName = 'SKU CATEGORY';
const offlineParetoGid = '616754166';
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function send(res, status, body, type = 'text/plain; charset=utf-8', headers = {}) {
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self'; img-src 'self' data:;",
  };
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    ...securityHeaders,
    ...headers,
  });
  res.end(res.req?.method === 'HEAD' ? undefined : body);
}

// In-memory cache for Google Sheets-backed payloads.
// - Fresh for CACHE_TTL_MS: served without contacting Google.
// - Concurrent requests share one in-flight fetch.
// - If a refresh fails, the last good payload is served (up to CACHE_MAX_STALE_MS).
const cacheTtlMs = Number(process.env.CACHE_TTL_MS || 5 * 60 * 1000);
const cacheMaxStaleMs = Number(process.env.CACHE_MAX_STALE_MS || 24 * 60 * 60 * 1000);
const forceRefreshCooldownMs = 15 * 1000;
const dataCache = new Map();

async function cachedPayload(key, loader, forceRefresh = false) {
  const entry = dataCache.get(key) ?? {};
  dataCache.set(key, entry);
  const now = Date.now();
  const canForce = forceRefresh && (!entry.fetchedAt || now - entry.fetchedAt >= forceRefreshCooldownMs);
  if (!canForce && entry.body && now - entry.fetchedAt < cacheTtlMs) {
    return { body: entry.body, fetchedAt: entry.fetchedAt, status: 'HIT' };
  }
  if (!entry.pending) {
    entry.pending = (async () => {
      try {
        const body = JSON.stringify(await loader());
        entry.body = body;
        entry.fetchedAt = Date.now();
        return { body, fetchedAt: entry.fetchedAt, status: 'MISS' };
      } finally {
        entry.pending = null;
      }
    })();
  }
  try {
    return await entry.pending;
  } catch (error) {
    if (entry.body && Date.now() - entry.fetchedAt < cacheMaxStaleMs) {
      console.error(key + ' refresh failed, serving stale cache:', error.message);
      return { body: entry.body, fetchedAt: entry.fetchedAt, status: 'STALE' };
    }
    throw error;
  }
}

async function sendCached(res, key, loader, errorMessage, forceRefresh = false) {
  try {
    const { body, fetchedAt, status } = await cachedPayload(key, loader, forceRefresh);
    const extraHeaders = {
      'X-Cache': status,
      'X-Data-Fetched-At': new Date(fetchedAt).toISOString(),
    };
    if (status === 'STALE') {
      extraHeaders['X-Stale-Data'] = 'true';
      extraHeaders['Warning'] = '199 - "Stale data served due to upstream sync failure"';
    }
    send(res, 200, body, 'application/json; charset=utf-8', extraHeaders);
  } catch (error) {
    console.error(key + ' data sync failed:', error.message);
    send(res, 502, JSON.stringify({ error: errorMessage }), 'application/json; charset=utf-8');
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }
  return rows;
}

function normalized(value) {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function skuKey(value) {
  return String(value ?? '').trim().toUpperCase();
}

function findHeader(rows, required) {
  return rows.findIndex(row => required.every(name => row.some(value => normalized(value) === normalized(name))));
}

function columnIndex(row, name) {
  return row.findIndex(value => normalized(value) === normalized(name));
}

function parseNumber(value) {
  const text = String(value ?? '').trim();
  if (!text || text === '-' || text === '—') return 0;
  const normalizedText = text.replace(/\s/g, '');
  const hasComma = normalizedText.includes(',');
  const hasDot = normalizedText.includes('.');
  if (hasComma && hasDot) {
    // Whichever separator appears last is the decimal separator.
    return normalizedText.lastIndexOf(',') > normalizedText.lastIndexOf('.')
      ? Number(normalizedText.replace(/\./g, '').replace(',', '.'))
      : Number(normalizedText.replace(/,/g, ''));
  }
  if (hasComma) {
    if (/^-?\d{1,3}(,\d{3})+$/.test(normalizedText)) {
      return Number(normalizedText.replace(/,/g, ''));
    }
    return Number(normalizedText.replace(',', '.'));
  }
  if (hasDot && /^-?\d{1,3}(\.\d{3}){2,}$/.test(normalizedText)) {
    return Number(normalizedText.replace(/\./g, ''));
  }
  return Number(normalizedText);
}

function parseIndonesianNumber(value) {
  const text = String(value ?? '').trim();
  if (!text || text === '-' || text === '—') return 0;
  const normalizedText = text.replace(/\s/g, '');
  const hasComma = normalizedText.includes(',');
  const hasDot = normalizedText.includes('.');
  if (hasComma && hasDot) {
    return normalizedText.lastIndexOf(',') > normalizedText.lastIndexOf('.')
      ? Number(normalizedText.replace(/\./g, '').replace(',', '.'))
      : Number(normalizedText.replace(/,/g, ''));
  }
  if (hasComma) {
    if (/^-?\d{1,3}(,\d{3})+$/.test(normalizedText)) {
      return Number(normalizedText.replace(/,/g, ''));
    }
    return Number(normalizedText.replace(',', '.'));
  }
  if (hasDot && /^-?\d{1,3}(\.\d{3})+$/.test(normalizedText)) {
    return Number(normalizedText.replace(/\./g, ''));
  }
  return Number(normalizedText);
}

function parsePercent(value) {
  const text = String(value ?? '').trim().replace(/%/g, '');
  if (!text || text === '-' || text === '—') return null;
  const parsed = parseNumber(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseExpiry(value) {
  const text = String(value ?? '').trim();
  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const year = Number(match[3]);
  const month = Number(match[2]);
  const day = Number(match[1]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const salesMonthCount = 6;

function hasSalesValue(value) {
  const text = String(value ?? '').trim();
  if (!text || text === '-' || text === '—') return false;
  const parsed = parseIndonesianNumber(text);
  return Number.isFinite(parsed) && parsed !== 0;
}

// Pick the latest completed months (current month excluded because it is still running)
// that actually contain sales data. Months whose column is missing or empty for every SKU
// (not yet filled in the sheet) are skipped instead of being counted as zero sales.
function latestFilledCompletedMonths(header, dataRows, now = new Date()) {
  const currentMonth = Number(new Intl.DateTimeFormat('en-US', { month: 'numeric', timeZone: 'Asia/Jakarta' }).format(now)) - 1;
  const selected = [];
  for (let offset = 1; offset < 12 && selected.length < salesMonthCount; offset += 1) {
    const month = monthNames[(currentMonth - offset + 12) % 12];
    const index = columnIndex(header, month);
    if (index < 0) continue;
    if (!dataRows.some(row => hasSalesValue(row[index]))) continue;
    selected.unshift({ month, index });
  }
  return selected;
}

async function fetchCsv(gid, sourceSpreadsheetId = spreadsheetId) {
  const exportUrl = 'https://docs.google.com/spreadsheets/d/' + sourceSpreadsheetId + '/export?format=csv&gid=';
  const response = await fetchWithTimeout(exportUrl + gid + '&cachebust=' + Date.now(), { cache: 'no-store' });
  if (!response.ok) throw new Error('Google Sheets returned ' + response.status);
  const text = await response.text();
  if (!text.trim() || /<html[\s>]/i.test(text)) throw new Error('Google Sheets did not return CSV data');
  return parseCsv(text);
}

async function fetchSheetCsv(sheetName, sourceSpreadsheetId = onlineSpreadsheetId) {
  const url = 'https://docs.google.com/spreadsheets/d/' + sourceSpreadsheetId
    + '/gviz/tq?tqx=out:csv&sheet=' + encodeURIComponent(sheetName) + '&cachebust=' + Date.now();
  const response = await fetchWithTimeout(url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Google Sheets returned ' + response.status);
  const text = await response.text();
  if (!text.trim() || /<html[\s>]/i.test(text)) throw new Error('Google Sheets did not return CSV data');
  return parseCsv(text);
}

function parseRupiah(value) {
  const text = String(value ?? '').trim();
  if (!text || text === '-' || text === '—') return null;
  const digits = text.replace(/[^\d-]/g, '');
  if (!digits || digits === '-') return null;
  const number = Number(digits);
  return Number.isFinite(number) ? number : null;
}

function buildMasterCostMap(rows) {
  const headerIndex = findHeader(rows, ['SKU', 'Product Cost (Rp)']);
  if (headerIndex < 0) throw new Error('Master Cost headers not found');
  const header = rows[headerIndex];
  const skuIndex = columnIndex(header, 'SKU');
  const costIndex = columnIndex(header, 'Product Cost (Rp)');
  const costs = new Map();
  for (const row of rows.slice(headerIndex + 1)) {
    const sku = skuKey(row[skuIndex]);
    if (!sku || costs.has(sku)) continue;
    const cost = parseRupiah(row[costIndex]);
    if (cost !== null) costs.set(sku, cost);
  }
  if (!costs.size) throw new Error('Master Cost returned no usable rows');
  return costs;
}

function buildSkuCategoryMap(rows) {
  const headerIndex = findHeader(rows, ['SKU ID', 'Category']);
  if (headerIndex < 0) throw new Error('SKU CATEGORY headers not found');
  const header = rows[headerIndex];
  const skuIndex = columnIndex(header, 'SKU ID');
  const categoryIndex = columnIndex(header, 'Category');
  const categories = new Map();
  for (const row of rows.slice(headerIndex + 1)) {
    const sku = normalized(row[skuIndex]).toUpperCase();
    const category = String(row[categoryIndex] ?? '').trim();
    if (!sku || !category || categories.has(sku)) continue;
    categories.set(sku, category);
  }
  if (!categories.size) throw new Error('SKU CATEGORY returned no usable rows');
  return categories;
}

function buildOnlineAverageMap(rows) {
  const headerIndex = findHeader(rows, ['SKU', 'Avg / minggu (pcs)']);
  if (headerIndex < 0) throw new Error('SWC Online headers not found');
  const header = rows[headerIndex];
  const skuIndex = columnIndex(header, 'SKU');
  const weeklyIndex = columnIndex(header, 'Avg / minggu (pcs)');
  const averages = new Map();
  for (const row of rows.slice(headerIndex + 1)) {
    const sku = skuKey(row[skuIndex]);
    if (!sku || averages.has(sku)) continue;
    const weekly = parseNumber(row[weeklyIndex]);
    if (Number.isFinite(weekly) && weekly >= 0) averages.set(sku, weekly);
  }
  return averages;
}

function buildParetoMap(rows) {
  const headerIndex = findHeader(rows, ['SKU', 'Pareto Status']);
  if (headerIndex < 0) throw new Error('PARETO STATUS headers not found');
  const header = rows[headerIndex];
  const skuIndex = columnIndex(header, 'SKU');
  const statusIndex = columnIndex(header, 'Pareto Status');
  const contributionIndex = columnIndex(header, 'Kontribusi Sales (%)');
  const rankIndex = columnIndex(header, 'Rank');
  const pareto = new Map();
  for (const row of rows.slice(headerIndex + 1)) {
    const sku = skuKey(row[skuIndex]);
    if (!sku || pareto.has(sku)) continue;
    pareto.set(sku, {
      status: String(row[statusIndex] ?? '').trim() || null,
      contribution: contributionIndex >= 0 ? parsePercent(row[contributionIndex]) : null,
      rank: rankIndex >= 0 ? parseNumber(row[rankIndex]) : null,
    });
  }
  if (!pareto.size) throw new Error('PARETO STATUS returned no usable rows');
  return pareto;
}

function buildActiveSkuMap(rows) {
  let headerIndex = findHeader(rows, ['SKU', 'Active Status']);
  let statusColumnName = 'Active Status';

  if (headerIndex < 0) {
    headerIndex = findHeader(rows, ['SKU', 'Note']);
    statusColumnName = 'Note';
  }

  if (headerIndex < 0) throw new Error('Active SKU Offline headers not found');
  const header = rows[headerIndex];
  const skuIndex = columnIndex(header, 'SKU');
  const statusIndex = columnIndex(header, statusColumnName);
  const activeMap = new Map();
  for (const row of rows.slice(headerIndex + 1)) {
    const sku = String(row[skuIndex] ?? '').trim().toUpperCase();
    if (!sku || activeMap.has(sku)) continue;
    const status = String(row[statusIndex] ?? '').trim().toLowerCase();
    activeMap.set(sku, status === 'active' || status === 'ya' || status === '1' || status === 'true');
  }
  if (!activeMap.size) throw new Error('Active SKU Offline returned no usable rows');
  return activeMap;
}

function buildOfflineRecords(clusteringRows, salesRows, activeSkuRows) {
  const clusterHeaderIndex = findHeader(clusteringRows, ['SKU ID', 'Nama Barang', 'Kedaluwarsa']);
  if (clusterHeaderIndex < 0) throw new Error('Clustering Offline headers not found');
  const clusterHeader = clusteringRows[clusterHeaderIndex];
  const clusterSku = columnIndex(clusterHeader, 'SKU ID');
  const clusterName = columnIndex(clusterHeader, 'Nama Barang');
  const clusterExpiry = columnIndex(clusterHeader, 'Kedaluwarsa');
  const clusterAvailable = columnIndex(clusterHeader, 'Tersedia untuk Picking');
  const clusterStatus = columnIndex(clusterHeader, 'Status');
  if ([clusterSku, clusterName, clusterExpiry, clusterAvailable].some(index => index < 0)) {
    throw new Error('Clustering Offline required columns not found');
  }

  const salesHeaderIndex = findHeader(salesRows, ['SKU', 'PRODUCT DESCRIPTION']);
  if (salesHeaderIndex < 0) throw new Error('Monthly sales headers not found');
  const salesHeader = salesRows[salesHeaderIndex];
  const salesSku = columnIndex(salesHeader, 'SKU');
  const salesName = columnIndex(salesHeader, 'PRODUCT DESCRIPTION');
  const salesMonthlyAvg = columnIndex(salesHeader, 'Monthly AVG');
  const salesOosFilter = columnIndex(salesHeader, 'OOS FILTER');
  const salesSwcNote = columnIndex(salesHeader, 'SWC NOTE');
  const salesDataRows = salesRows.slice(salesHeaderIndex + 1).filter(row => String(row[salesSku] ?? '').trim());
  const monthColumns = latestFilledCompletedMonths(salesHeader, salesDataRows);
  const months = monthColumns.map(({ month }) => month);
  if (monthColumns.length < salesMonthCount) {
    console.warn('offline sales: only ' + monthColumns.length + ' filled completed month(s) found: ' + (months.join(', ') || 'none'));
  }
  const salesBySku = new Map();
  for (const row of salesDataRows) {
    const rawSku = String(row[salesSku] ?? '').trim();
    const sku = skuKey(rawSku);
    if (!sku || salesBySku.has(sku)) continue;
    let averageMonthlySales = null;
    if (salesMonthlyAvg >= 0) {
      const avgText = String(row[salesMonthlyAvg] ?? '').trim();
      if (avgText && avgText !== '-' && avgText !== '—') {
        const parsedAvg = parseIndonesianNumber(avgText);
        if (Number.isFinite(parsedAvg) && parsedAvg >= 0) averageMonthlySales = parsedAvg;
      }
    }
    salesBySku.set(sku, {
      sku: rawSku,
      name: String(row[salesName] ?? '').trim(),
      monthlySales: monthColumns.map(({ index }) => parseIndonesianNumber(row[index])),
      averageMonthlySales,
      oosFilter: salesOosFilter >= 0 ? String(row[salesOosFilter] ?? '').trim() || null : null,
      swcNote: salesSwcNote >= 0 ? String(row[salesSwcNote] ?? '').trim() || null : null,
    });
  }

  const activeSkuMap = buildActiveSkuMap(activeSkuRows);

  const grouped = new Map();
  for (const row of clusteringRows.slice(clusterHeaderIndex + 1)) {
    const sku = String(row[clusterSku] ?? '').trim();
    const key = skuKey(sku);
    if (!key) continue;
    if (normalized(row[clusterStatus]) === 'damage') continue;
    const qty = parseIndonesianNumber(row[clusterAvailable]);
    if (!Number.isFinite(qty) || qty <= 0) continue;
    const salesInfo = salesBySku.get(key);
    const group = grouped.get(key) ?? {
      sku,
      name: String(row[clusterName] ?? '').trim(),
      channel: 'Offline',
      stock: 0,
      expiries: new Map(),
      undatedStock: 0,
      monthlySales: salesInfo?.monthlySales ?? null,
      averageMonthlySales: salesInfo?.averageMonthlySales ?? null,
      oosFilter: normalized(salesInfo?.oosFilter) === 'oos' ? 'OOS' : 'STOCK AVAILABLE',
      swcNote: salesInfo?.swcNote ?? null,
    };
    if (!group.name) group.name = String(row[clusterName] ?? '').trim();
    group.stock += qty;
    const expiry = parseExpiry(row[clusterExpiry]);
    if (expiry) group.expiries.set(expiry, (group.expiries.get(expiry) ?? 0) + qty);
    else group.undatedStock += qty;
    grouped.set(key, group);
  }
  if (!grouped.size) throw new Error('Clustering Offline returned no usable stock rows');
  const stockedRecords = [...grouped.values()].map(group => {
    const key = skuKey(group.sku);
    return {
      sku: group.sku,
      name: group.name || salesBySku.get(key)?.name || group.sku,
      channel: group.channel,
      stock: group.stock,
      monthlySales: group.monthlySales ?? months.map(() => null),
      averageMonthlySales: group.averageMonthlySales,
      oosFilter: group.oosFilter,
      swcNote: group.swcNote,
      undatedStock: group.undatedStock,
      expiries: [...group.expiries].map(([date, qty]) => ({ date, qty })),
      isActive: activeSkuMap.get(key) ?? false,
    };
  });
  const oosRecords = [];
  for (const [key, salesInfo] of salesBySku) {
    if (grouped.has(key)) continue;
    oosRecords.push({
      sku: salesInfo.sku,
      name: salesInfo.name || salesInfo.sku,
      channel: 'Offline',
      stock: 0,
      monthlySales: salesInfo.monthlySales ?? months.map(() => null),
      averageMonthlySales: salesInfo.averageMonthlySales,
      oosFilter: 'OOS',
      swcNote: salesInfo.swcNote,
      undatedStock: 0,
      expiries: [],
      isActive: activeSkuMap.get(key) ?? false,
    });
  }
  return {
    salesMonths: months,
    records: [...stockedRecords, ...oosRecords],
  };
}

function offlineData(res, forceRefresh = false) {
  return sendCached(res, 'offline', loadOfflineData, 'Offline Google Sheets synchronization failed', forceRefresh);
}

function proxyOnline(res, forceRefresh = false) {
  return sendCached(res, 'online', loadOnlineData, 'Online data unavailable', forceRefresh);
}

async function loadOfflineData() {
  const [clusteringRows, salesRows, costRows, paretoRows, activeSkuRows] = await Promise.all([
    fetchCsv(clusteringOfflineGid),
    fetchCsv(monthlySalesGid),
    fetchCsv(masterCostGid, onlineSpreadsheetId),
    fetchCsv(offlineParetoGid),
    fetchCsv(activeSkuOfflineGid),
  ]);
  const payload = buildOfflineRecords(clusteringRows, salesRows, activeSkuRows);
  const costs = buildMasterCostMap(costRows);
  const pareto = buildParetoMap(paretoRows);
  payload.records = payload.records.map(row => {
    const key = skuKey(row.sku);
    return {
      ...row,
      productCost: costs.get(key) ?? null,
      paretoStatus: pareto.get(key)?.status ?? null,
      paretoContribution: pareto.get(key)?.contribution ?? null,
      paretoRank: pareto.get(key)?.rank ?? null,
    };
  });
  return payload;
}

async function loadOnlineData() {
  const [response, costRows, summaryRows, paretoRows, categoryRows] = await Promise.all([
    fetchWithTimeout(upstream, { headers: { accept: 'application/json' } }),
    fetchCsv(masterCostGid, onlineSpreadsheetId),
    fetchCsv(onlineSummaryGid, onlineSpreadsheetId),
    fetchCsv(onlineParetoGid, onlineSpreadsheetId),
    fetchSheetCsv(onlineSkuCategorySheetName, onlineSpreadsheetId),
  ]);
  if (!response.ok) throw new Error('Upstream returned ' + response.status);
  const rows = JSON.parse(await response.text());
  if (!Array.isArray(rows)) throw new Error('Online data returned invalid JSON');
  const costs = buildMasterCostMap(costRows);
  const averages = buildOnlineAverageMap(summaryRows);
  const pareto = buildParetoMap(paretoRows);
  const skuCategories = buildSkuCategoryMap(categoryRows);
  const enriched = rows.map(row => {
    const key = skuKey(row.sku);
    const weekly = averages.has(key) ? averages.get(key) : null;
    return {
      ...row,
      productCost: costs.get(key) ?? null,
      skuCategory: skuCategories.get(normalized(row.sku).toUpperCase()) ?? null,
      averageWeeklySales: weekly,
      averageDailySales: weekly !== null ? weekly / 7 : null,
      averageMonthlySales: weekly !== null ? weekly * 52 / 12 : null,
      paretoStatus: pareto.get(key)?.status ?? null,
      paretoContribution: pareto.get(key)?.contribution ?? null,
      paretoRank: pareto.get(key)?.rank ?? null,
    };
  });
  return enriched;
}

async function serveStatic(res, pathname) {
  const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
  const file = normalize(join(root, relative));
  if (!file.startsWith(rootPrefix) && file !== join(root, 'index.html')) return send(res, 403, 'Forbidden');
  try {
    const body = await readFile(file);
    send(res, 200, body, contentTypes[extname(file)] || 'application/octet-stream');
  } catch {
    if (!extname(relative)) {
      const body = await readFile(join(root, 'index.html'));
      return send(res, 200, body, contentTypes['.html']);
    }
    send(res, 404, 'Not found');
  }
}

createServer((req, res) => {
  const url = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  if (url.pathname === '/healthz') return send(res, 200, 'ok');
  const forceRefresh = url.searchParams.get('refresh') === '1';
  if (url.pathname === '/api/offline') return offlineData(res, forceRefresh);
  if (url.pathname === '/api/online') return proxyOnline(res, forceRefresh);
  return serveStatic(res, url.pathname);
}).listen(port, '0.0.0.0', () => {
  console.log('OCI Safelife listening on ' + port);
});
