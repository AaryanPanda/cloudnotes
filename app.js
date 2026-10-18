const http = require('http');
const net = require('net');

const DB_HOST = process.env.DB_HOST || 'cloudnotes-db';
const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);

function dbReachable() {
  return new Promise((resolve) => {
    const sock = net.connect({ host: DB_HOST, port: DB_PORT });
    const done = (ok) => { sock.destroy(); resolve(ok); };
    sock.setTimeout(2000);
    sock.on('connect', () => done(true));
    sock.on('timeout', () => done(false));
    sock.on('error',   () => done(false));
  });
}

const handler = async (req, res) => {
  if (req.url === '/health') { res.writeHead(200); return res.end('ok'); }
  if (req.url === '/ready') {
    const ok = await dbReachable();
    res.writeHead(ok ? 200 : 503);
    return res.end(ok ? 'ready' : 'db unreachable');
  }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<html><head><title>CloudNotes</title></head><body><h1>CloudNotes</h1><p>Your notes, anywhere.</p></body></html>');
};

function createServer() { return http.createServer(handler); }

module.exports = { handler, createServer, dbReachable };
