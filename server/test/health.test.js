import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('GET /api/health should return 200 and health status', async () => {
  // Start server on an ephemeral port for testing
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.status, 'healthy');
    assert.strictEqual(typeof data.geminiConfigured, 'boolean');
    assert.strictEqual(typeof data.model, 'string');
    assert.strictEqual(typeof data.timestamp, 'string');
  } finally {
    server.close();
  }
});

test('GET /api/nonexistent-route should return 404', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/nonexistent-route`);
    assert.strictEqual(res.status, 404);

    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.error.code, 'ROUTE_NOT_FOUND');
  } finally {
    server.close();
  }
});
