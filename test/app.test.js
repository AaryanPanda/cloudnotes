const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const { createServer } = require('../app');

function get(server, path) {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    http.get({ host: '127.0.0.1', port, path }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

test('health endpoint returns 200 ok', async () => {
  const server = createServer().listen(0);
  await new Promise((r) => server.once('listening', r));
  const res = await get(server, '/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body, 'ok');
  server.close();
});

test('root serves the CloudNotes page', async () => {
  const server = createServer().listen(0);
  await new Promise((r) => server.once('listening', r));
  const res = await get(server, '/');
  assert.strictEqual(res.status, 200);
  assert.match(res.body, /CloudNotes/);
  server.close();
});
