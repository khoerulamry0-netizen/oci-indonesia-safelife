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
  if (!text || text === '-' || text === 'â€”') return 0;
  const normalizedText = text.replace(/\s/g, '');
  if (normalizedText.includes(',') && normalizedText.includes('.')) {
    return Number(normalizedText.replace(/\./g, '').replace(',', '.'));
  }
  if (normalizedText.includes(',')) return Number(normalizedText.replace(',', '.'));
  return Number(normalizedText);
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

async function fetchCsv(gid) {
  const response = await fetch(spreadsheetExport + gid + '&cachebust=' + Date.now(), { cache: 'no-store' });
  if (!response.ok) throw new Error('Google Sheets returned ' + response.status);
  const text = await response.text();
  if (!text.trim() || /<html[\s>]/i.test(text)) throw new Error('Google Sheets did not return CSV data');
  return parseCsv(text);
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
    const [clusteringRows, salesRows] = await Promise.all([
      fetchCsv(clusteringOfflineGid),
      fetchCsv(monthlySalesGid),
    ]);
    send(res, 200, JSON.stringify(buildOfflineRecords(clusteringRows, salesRows)), 'application/json; charset=utf-8');
  } catch (error) {
    console.error('offline data sync failed:', error.message);
    send(res, 502, JSON.stringify({ error: 'Offline Google Sheets synchronization failed' }), 'application/json; charset=utf-8');
  }
}

async function proxyOnline(res) {
  try {
    const response = await fetch(upstream, { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error('Upstream returned ' + response.status);
    send(res, 200, await response.text(), 'application/json; charset=utf-8');
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
