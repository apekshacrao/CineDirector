import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fullScreenplaySchema,
  storyStructureSchema,
  characterItemSchema,
  sceneItemSchema,
  shotDetailSchema,
  imagePromptSchema,
  videoPromptSchema,
  audioDesignSchema,
  productionSummarySchema
} from '../src/schemas/screenplay.schema.js';

test('Screenplay Schema definitions are complete and valid', () => {
  // Test full screenplay schema root properties
  assert.ok(fullScreenplaySchema.properties.project);
  assert.ok(fullScreenplaySchema.properties.storyStructure);
  assert.ok(fullScreenplaySchema.properties.characters);
  assert.ok(fullScreenplaySchema.properties.scenes);
  assert.ok(fullScreenplaySchema.properties.shotLists);
  assert.ok(fullScreenplaySchema.properties.imagePrompts);
  assert.ok(fullScreenplaySchema.properties.videoPrompts);
  assert.ok(fullScreenplaySchema.properties.audioDesign);
  assert.ok(fullScreenplaySchema.properties.productionSummary);

  // Check required fields
  const expectedRequired = [
    'project',
    'storyStructure',
    'characters',
    'scenes',
    'shotLists',
    'imagePrompts',
    'videoPrompts',
    'audioDesign',
    'productionSummary'
  ];
  for (const field of expectedRequired) {
    assert.ok(
      fullScreenplaySchema.required.includes(field),
      `fullScreenplaySchema missing required field: ${field}`
    );
  }

  // Check Story Structure
  assert.ok(storyStructureSchema.properties.actOne);
  assert.ok(storyStructureSchema.properties.actTwo);
  assert.ok(storyStructureSchema.properties.actThree);

  // Check Character Schema
  assert.ok(characterItemSchema.properties.id);
  assert.ok(characterItemSchema.properties.name);
  assert.ok(characterItemSchema.properties.costumeNotes);

  // Check Scene Schema
  assert.ok(sceneItemSchema.properties.heading);
  assert.ok(sceneItemSchema.properties.dialogue);

  // Check Shot Detail Schema
  assert.ok(shotDetailSchema.properties.lens);
  assert.ok(shotDetailSchema.properties.cameraMovement);

  // Check Prompts
  assert.ok(imagePromptSchema.properties.prompt);
  assert.ok(videoPromptSchema.properties.cameraMotion);

  // Check Audio & Production Summary
  assert.ok(audioDesignSchema.properties.ambience);
  assert.ok(productionSummarySchema.properties.colorPalette);
});
