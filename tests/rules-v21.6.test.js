const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const rules = JSON.parse(fs.readFileSync('database.rules.v21.6.json', 'utf8'));
const text = JSON.stringify(rules);

test('trusted elementSets is client immutable', () => {
  assert.equal(rules.rules.elementSets['.read'], false);
  assert.equal(rules.rules.elementSets['.write'], false);
});

test('rules accept both v21.5 and v21.6 room versions', () => {
  const expr = rules.rules.rooms['$room'].version['.validate'];
  assert.match(expr, /21\.5-first36/);
  assert.match(expr, /21\.6-category-games/);
});

test('v21.6 rules validate trusted set id, count and max target', () => {
  assert.match(text, /elementSets/);
  assert.match(text, /elementSetId/);
  assert.match(text, /requiredCount/);
  assert.match(text, /maxTarget/);
});

test('move validation requires trusted membership', () => {
  assert.match(text, /members/);
  assert.match(text, /lastMove\/symbol/);
});
