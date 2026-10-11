import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import {
  scenesArraySchema,
  shotListsArraySchema,
  promptsPackageSchema,
  audioDesignArraySchema
} from '../src/schemas/screenplay.schema.js';

test('Sub-schemas have valid structures and required fields', () => {
  // scenesArraySchema
  assert.ok(scenesArraySchema.properties.scenes);
  assert.ok(scenesArraySchema.required.includes('scenes'));

  // shotListsArraySchema
  assert.ok(shotListsArraySchema.properties.shotLists);
  assert.ok(shotListsArraySchema.required.includes('shotLists'));

  // promptsPackageSchema
  assert.ok(promptsPackageSchema.properties.imagePrompts);
  assert.ok(promptsPackageSchema.properties.videoPrompts);
  assert.ok(promptsPackageSchema.required.includes('imagePrompts'));
  assert.ok(promptsPackageSchema.required.includes('videoPrompts'));

  // audioDesignArraySchema
  assert.ok(audioDesignArraySchema.properties.audioDesign);
  assert.ok(audioDesignArraySchema.required.includes('audioDesign'));
});

test('POST /api/generate-scenes rejects invalid existingScenes type', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/generate-scenes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ existingScenes: 'not-an-array' })
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.error.code, 'INVALID_SCENES_INPUT');
  } finally {
    server.close();
  }
});

test('POST /api/generate-audio-design rejects empty scenes', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/generate-audio-design`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenes: [] })
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.error.code, 'MISSING_SCENES');
  } finally {
    server.close();
  }
});

test('POST /api/generate-screenplay returns 503 GEMINI_KEY_MISSING when API key is not configured', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/generate-screenplay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idea: 'A valid movie premise that exceeds the minimum required ten characters.'
      })
    });

    // In environment without GEMINI_API_KEY configured, it should return 503
    assert.strictEqual(res.status, 503);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.error.code, 'GEMINI_KEY_MISSING');
    assert.ok(data.error.message.includes('GEMINI_API_KEY'));
  } finally {
    server.close();
  }
});
