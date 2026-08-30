const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function loadRules() {
  return JSON.parse(fs.readFileSync('database.rules.v21.8.json', 'utf8'));
}

test('v21.8 rules accept the learning-options room version', () => {
  const rules = loadRules();
  assert.match(rules.rules.rooms.$room.version['.validate'], /21\.8-learning-options/);
});

test('v21.8 settings require three boolean learning-aid permissions', () => {
  const settings = loadRules().rules.rooms.$room.settings;
  assert.match(settings['.validate'], /learningAids/);
  assert.ok(settings.learningAids);
  assert.match(settings.learningAids['.validate'], /allowAlphabetical/);
  assert.match(settings.learningAids['.validate'], /allowCategoryGrouping/);
  assert.match(settings.learningAids['.validate'], /allowCategoryColours/);
  for (const key of ['allowAlphabetical', 'allowCategoryGrouping', 'allowCategoryColours']) {
    assert.match(settings.learningAids[key]['.validate'], /isBoolean/);
  }
  assert.equal(settings.learningAids.$other['.validate'], false);
});

test('learning-aid permissions are immutable during rematches', () => {
  const validation = loadRules().rules.rooms.$room.settings.learningAids['.validate'];
  assert.match(validation, /!data\.exists\(\)/);
  assert.match(validation, /newData\.child\('allowAlphabetical'\)\.val\(\) === data\.child\('allowAlphabetical'\)\.val\(\)/);
  assert.match(validation, /newData\.child\('allowCategoryGrouping'\)\.val\(\) === data\.child\('allowCategoryGrouping'\)\.val\(\)/);
  assert.match(validation, /newData\.child\('allowCategoryColours'\)\.val\(\) === data\.child\('allowCategoryColours'\)\.val\(\)/);
});

test('v21.8 game validation enforces capped streak points and a two-point penalty', () => {
  const rules = loadRules().rules.rooms.$room;
  const gameValidation = rules.game['.validate'];
  assert.match(gameValidation, /21\.8-learning-options/);
  for (const points of [10, 11, 12, 13, 14]) {
    assert.match(gameValidation, new RegExp(`lastMove/points'\\)\\.val\\(\\) === ${points}`));
  }
  assert.match(gameValidation, /lastMove\/points'\)\.val\(\) === -2/);
  assert.match(gameValidation, /players\/host\/score'\)\.val\(\) === data\.child\('players\/host\/score'\)\.val\(\) - 2/);
  assert.match(gameValidation, /players\/guest\/score'\)\.val\(\) === data\.child\('players\/guest\/score'\)\.val\(\) - 2/);
  assert.match(rules.game.lastMove.points['.validate'], /newData\.val\(\) === -2/);
});
