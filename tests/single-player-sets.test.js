const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const GameSetup = require('../game-setup.js');
const Sets = require('../element-sets.js');

const js = fs.readFileSync('app.js', 'utf8');

test('shared setup gives single-player Noble gases a seven-element target', () => {
  const setup = GameSetup.normaliseSetup({
    playMode: 'single', elementSetId: 'noble-gases', difficulty: 'beginner'
  });
  assert.equal(setup.requiredCount, 7);
  assert.deepEqual(Sets.resolveElementSet(setup.elementSetId).map(e => e[1]),
    ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og']);
});

test('single-player has a dedicated starter and active set participates in playability', () => {
  assert.match(js, /function startSinglePlayer\(setup\)/);
  assert.match(js, /return singleGame\.elementSetId/);
  assert.match(js, /function getActiveRequiredCount\(/);
});

test('single-player answer tools filter to playable slots', () => {
  assert.match(js, /function checkAnswers\([\s\S]*isElementPlayable\(slot\.dataset\.answer\)/);
  assert.match(js, /function showAnswers\([\s\S]*isElementPlayable\(slot\.dataset\.answer\)/);
  assert.match(js, /function hint\([\s\S]*isElementPlayable\(slot\.dataset\.answer\)/);
});

test('single-player drop rejects an out-of-set target', () => {
  assert.match(js, /function dropOnSlot\([\s\S]*!isElementPlayable\(this\.dataset\.answer\)/);
});
