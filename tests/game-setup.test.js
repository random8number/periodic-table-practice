const test = require('node:test');
const assert = require('node:assert/strict');
const GameSetup = require('../game-setup.js');

test('v21.7 exposes one place-elements game type', () => {
  assert.deepEqual(GameSetup.GAME_TYPES, [
    { id: 'place-elements', label: 'Place Elements on Table' }
  ]);
});

test('single-player defaults to all118 and preserves selected difficulty', () => {
  assert.deepEqual(GameSetup.defaultSingleSetup('advanced'), {
    playMode: 'single',
    gameType: 'place-elements',
    elementSetId: 'all118',
    requiredCount: 118,
    elementLimit: 118,
    difficulty: 'advanced'
  });
});

test('normaliseSetup resolves category count and max target from PeriodicElementSets', () => {
  assert.deepEqual(GameSetup.normaliseSetup({
    playMode: 'local',
    gameType: 'place-elements',
    elementSetId: 'noble-gases',
    difficulty: 'beginner'
  }), {
    playMode: 'local',
    gameType: 'place-elements',
    elementSetId: 'noble-gases',
    requiredCount: 7,
    elementLimit: 118,
    difficulty: 'beginner'
  });
});

test('setupFromRoom maps unchanged v21.6 room settings to common setup', () => {
  assert.deepEqual(GameSetup.setupFromRoom({
    version: '21.6-category-games',
    settings: {
      difficulty: 'intermediate',
      elementSetId: 'halogens',
      requiredCount: 6,
      elementLimit: 117
    }
  }), {
    playMode: 'online',
    gameType: 'place-elements',
    elementSetId: 'halogens',
    requiredCount: 6,
    elementLimit: 117,
    difficulty: 'intermediate'
  });
});

test('unknown game type and element set are rejected', () => {
  assert.throws(() => GameSetup.normaliseSetup({ gameType: 'timed' }), /Unknown game type/);
  assert.throws(() => GameSetup.normaliseSetup({ elementSetId: 'made-up-set' }), /Unknown element set/);
});
