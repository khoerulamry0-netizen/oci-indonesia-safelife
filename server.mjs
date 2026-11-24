import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const rootPrefix = root.endsWith(sep) ? root : root + sep;
const port = Number(process.env.PORT || 10000);
const upstream = 'https://oci-indonesia.verdantspark1.chatgpt.site/api/online';
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

async function proxyOnline(res) {
  try {
    const response = await fetch(upstream, { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`Upstream returned ${response.status}`);
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
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  if (url.pathname === '/healthz') return send(res, 200, 'ok');
  if (url.pathname === '/api/online') return proxyOnline(res);
  return serveStatic(res, url.pathname);
}).listen(port, '0.0.0.0', () => {
  console.log(`OCI Safelife listening on ${port}`);
});
