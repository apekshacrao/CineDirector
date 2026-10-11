import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createRateLimiter } from '../src/middleware/rateLimiter.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

test('createRateLimiter should throttle requests after limit is reached', async () => {
  const app = express();
  const limiter = createRateLimiter({
    windowMs: 5000,
    maxRequests: 3,
    message: 'Test rate limit exceeded'
  });

  app.use(limiter);
  app.get('/test-limit', (req, res) => res.json({ ok: true }));

  const server = app.listen(0);
  const { port } = server.address();

  try {
    // 3 allowed calls
    for (let i = 0; i < 3; i++) {
      const res = await fetch(`http://127.0.0.1:${port}/test-limit`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers.get('X-RateLimit-Limit'), '3');
    }

    // 4th call should be throttled (429)
    const throttledRes = await fetch(`http://127.0.0.1:${port}/test-limit`);
    assert.strictEqual(throttledRes.status, 429);
    const data = await throttledRes.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.error.code, 'RATE_LIMIT_EXCEEDED');
    assert.strictEqual(data.error.message, 'Test rate limit exceeded');
  } finally {
    server.close();
  }
});

test('errorHandler middleware maps Gemini error types safely without leaking secrets', async () => {
  const app = express();

  // Test route triggering invalid API key error
  app.get('/test-invalid-key', (req, res, next) => {
    const err = new Error('API_KEY_INVALID: Key secret_abc123 failed authentication');
    next(err);
  });

  // Test route triggering quota exhausted error
  app.get('/test-quota-exhausted', (req, res, next) => {
    const err = new Error('RESOURCE_EXHAUSTED: Quota exceeded for model gemini-2.5-flash');
    next(err);
  });

  // Test route triggering safety filter error
  app.get('/test-safety', (req, res, next) => {
    const err = new Error('SAFETY: Content was blocked by safety policy');
    next(err);
  });

  app.use(errorHandler);

  const server = app.listen(0);
  const { port } = server.address();

  try {
    // Invalid Key -> 401
    const resKey = await fetch(`http://127.0.0.1:${port}/test-invalid-key`);
    assert.strictEqual(resKey.status, 401);
    const keyData = await resKey.json();
    assert.strictEqual(keyData.error.code, 'INVALID_API_KEY');
    assert.strictEqual(keyData.error.message.includes('secret_abc123'), false, 'Must not leak secret key in error message');

    // Quota Exhausted -> 429
    const resQuota = await fetch(`http://127.0.0.1:${port}/test-quota-exhausted`);
    assert.strictEqual(resQuota.status, 429);
    const quotaData = await resQuota.json();
    assert.strictEqual(quotaData.error.code, 'GEMINI_QUOTA_EXCEEDED');

    // Safety Filter -> 400
    const resSafety = await fetch(`http://127.0.0.1:${port}/test-safety`);
    assert.strictEqual(resSafety.status, 400);
    const safetyData = await resSafety.json();
    assert.strictEqual(safetyData.error.code, 'SAFETY_FILTER_TRIGGERED');
  } finally {
    server.close();
  }
});
