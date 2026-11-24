import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const rootPrefix = root.endsWith(sep) ? root : root + sep;
const port = Number(process.env.PORT || 10000);
const upstream = 'https://oci-indonesia.verdantspark1.chatgpt.site/api/online';
const spreadsheetId = '1RpLHOzhQd58zO2NvIoubybaHiXNavWGczVOa5fzS-m0';
const clusteringOfflineGid = '211915398';
const monthlySalesGid = '953675285';
const onlineSpreadsheetId = '1Sc4y1_fIfWSIYarB_dasBIP4TO0EjBlnzZ09ted62UU';
const onlineSummaryGid = '1008501005';
const masterCostGid = '686994777';
const onlineParetoGid = '1197311588';
const offlineParetoGid = '616754166';
const spreadsheetExport = 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/export?format=csv&gid=';
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
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
  if (normalizedText.includes(',') && normalizedText.includes('.')) {
    return Number(normalizedText.replace(/\./g, '').replace(',', '.'));
  }
  if (normalizedText.includes(',')) return Number(normalizedText.replace(',', '.'));
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

function sixMonthsEndingThisMonth() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = Number(new Intl.DateTimeFormat('en-US', { month: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date())) - 1;
  return Array.from({length: 6}, (_, index) => monthNames[(currentMonth - 5 + index + 12) % 12]);
}

async function fetchCsv(gid, sourceSpreadsheetId = spreadsheetId) {
  const exportUrl = 'https://docs.google.com/spreadsheets/d/' + sourceSpreadsheetId + '/export?format=csv&gid=';
  const response = await fetch(exportUrl + gid + '&cachebust=' + Date.now(), { cache: 'no-store' });
  if (!response.ok) throw new Error('Google Sheets returned ' + response.status);
  const text = await response.text();
  if (!text.trim() || /<html[\s>]/i.test(text)) throw new Error('Google Sheets did not return CSV data');
  return parseCsv(text);
}

function parseRupiah(value) {
  const text = String(value ?? '').trim();
  if (!text || text === '-' || text === '—') return 0;
  const digits = text.replace(/[^\d-]/g, '');
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
    const sku = String(row[skuIndex] ?? '').trim();
    if (!sku || costs.has(sku)) continue;
    const cost = parseRupiah(row[costIndex]);
    if (cost !== null) costs.set(sku, cost);
  }
  if (!costs.size) throw new Error('Master Cost returned no usable rows');
  return costs;
}

function buildOnlineAverageMap(rows) {
  const headerIndex = findHeader(rows, ['SKU', 'Avg / minggu (pcs)']);
  if (headerIndex < 0) throw new Error('SWC Online headers not found');
  const header = rows[headerIndex];
  const skuIndex = columnIndex(header, 'SKU');
  const weeklyIndex = columnIndex(header, 'Avg / minggu (pcs)');
  const averages = new Map();
  for (const row of rows.slice(headerIndex + 1)) {
    const sku = String(row[skuIndex] ?? '').trim();
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
    const sku = String(row[skuIndex] ?? '').trim().toUpperCase();
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

function buildOfflineRecords(clusteringRows, salesRows) {
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
  const months = sixMonthsEndingThisMonth();
  const monthColumns = months.map(month => ({ month, index: columnIndex(salesHeader, month) }));
  if (monthColumns.some(({ index }) => index < 0)) throw new Error('Monthly sales month columns not found');
  const salesBySku = new Map();
  for (const row of salesRows.slice(salesHeaderIndex + 1)) {
    const sku = String(row[salesSku] ?? '').trim();
    if (!sku || salesBySku.has(sku)) continue;
    salesBySku.set(sku, {
      name: String(row[salesName] ?? '').trim(),
      monthlySales: monthColumns.map(({ index }) => parseNumber(row[index])),
    });
  }

  const grouped = new Map();
  for (const row of clusteringRows.slice(clusterHeaderIndex + 1)) {
    const sku = String(row[clusterSku] ?? '').trim();
    if (!sku) continue;
    if (normalized(row[clusterStatus]) === 'damage') continue;
    const qty = parseNumber(row[clusterAvailable]);
    if (!Number.isFinite(qty) || qty <= 0) continue;
    const group = grouped.get(sku) ?? {
      sku,
      name: String(row[clusterName] ?? '').trim(),
      channel: 'Offline',
      stock: 0,
      expiries: new Map(),
      undatedStock: 0,
      monthlySales: salesBySku.get(sku)?.monthlySales ?? [null, null, null, null, null, null],
    };
    if (!group.name) group.name = String(row[clusterName] ?? '').trim();
    group.stock += qty;
    const expiry = parseExpiry(row[clusterExpiry]);
    if (expiry) group.expiries.set(expiry, (group.expiries.get(expiry) ?? 0) + qty);
    else group.undatedStock += qty;
    grouped.set(sku, group);
  }
  if (!grouped.size) throw new Error('Clustering Offline returned no usable stock rows');
  return {
    salesMonths: months,
    records: [...grouped.values()].map(group => ({
      sku: group.sku,
      name: group.name || salesBySku.get(group.sku)?.name || group.sku,
      channel: group.channel,
      stock: group.stock,
      monthlySales: group.monthlySales,
      undatedStock: group.undatedStock,
      expiries: [...group.expiries].map(([date, qty]) => ({ date, qty })),
    })),
  };
}

async function offlineData(res) {
  try {
    const [clusteringRows, salesRows, costRows, paretoRows] = await Promise.all([
      fetchCsv(clusteringOfflineGid),
      fetchCsv(monthlySalesGid),
      fetchCsv(masterCostGid, onlineSpreadsheetId),
      fetchCsv(offlineParetoGid),
    ]);
    const payload = buildOfflineRecords(clusteringRows, salesRows);
    const costs = buildMasterCostMap(costRows);
    const pareto = buildParetoMap(paretoRows);
    payload.records = payload.records.map(row => ({
      ...row,
      productCost: costs.get(row.sku) ?? null,
      paretoStatus: pareto.get(String(row.sku ?? '').trim().toUpperCase())?.status ?? null,
      paretoContribution: pareto.get(String(row.sku ?? '').trim().toUpperCase())?.contribution ?? null,
      paretoRank: pareto.get(String(row.sku ?? '').trim().toUpperCase())?.rank ?? null,
    }));
    send(res, 200, JSON.stringify(payload), 'application/json; charset=utf-8');
  } catch (error) {
    console.error('offline data sync failed:', error.message);
    send(res, 502, JSON.stringify({ error: 'Offline Google Sheets synchronization failed' }), 'application/json; charset=utf-8');
  }
}

async function proxyOnline(res) {
  try {
    const [response, costRows, summaryRows, paretoRows] = await Promise.all([
      fetch(upstream, { headers: { accept: 'application/json' } }),
      fetchCsv(masterCostGid, onlineSpreadsheetId),
      fetchCsv(onlineSummaryGid, onlineSpreadsheetId),
      fetchCsv(onlineParetoGid, onlineSpreadsheetId),
    ]);
    if (!response.ok) throw new Error('Upstream returned ' + response.status);
    const rows = JSON.parse(await response.text());
    if (!Array.isArray(rows)) throw new Error('Online data returned invalid JSON');
    const costs = buildMasterCostMap(costRows);
    const averages = buildOnlineAverageMap(summaryRows);
    const pareto = buildParetoMap(paretoRows);
    const enriched = rows.map(row => ({
      ...row,
      productCost: costs.get(String(row.sku ?? '').trim()) ?? null,
      averageWeeklySales: averages.has(String(row.sku ?? '').trim())
        ? averages.get(String(row.sku ?? '').trim()) : null,
      averageDailySales: averages.has(String(row.sku ?? '').trim())
        ? averages.get(String(row.sku ?? '').trim()) / 7 : null,
      averageMonthlySales: averages.has(String(row.sku ?? '').trim())
        ? averages.get(String(row.sku ?? '').trim()) * 52 / 12 : null,
      paretoStatus: pareto.get(String(row.sku ?? '').trim().toUpperCase())?.status ?? null,
      paretoContribution: pareto.get(String(row.sku ?? '').trim().toUpperCase())?.contribution ?? null,
      paretoRank: pareto.get(String(row.sku ?? '').trim().toUpperCase())?.rank ?? null,
    }));
    send(res, 200, JSON.stringify(enriched), 'application/json; charset=utf-8');
  } catch (error) {
    console.error('online data proxy failed:', error.message);
    send(res, 502, JSON.stringify({ error: 'Online data unavailable' }), 'application/json; charset=utf-8');
  }
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
  if (url.pathname === '/api/offline') return offlineData(res);
  if (url.pathname === '/api/online') return proxyOnline(res);
  return serveStatic(res, url.pathname);
}).listen(port, '0.0.0.0', () => {
  console.log('OCI Safelife listening on ' + port);
});
