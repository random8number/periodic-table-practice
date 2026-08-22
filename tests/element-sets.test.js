const test = require('node:test');
const assert = require('node:assert/strict');
const Sets = require('../element-sets.js');

function symbols(id) {
  return Sets.resolveElementSet(id).map(el => el[1]);
}

test('Hydrogen remains a reactive non-metal', () => {
  assert.equal(Sets.getCategory(1, 'H', 1, 1), 'Reactive non-metals');
});

test('La and Ac are in their f-block categories', () => {
  assert.equal(Sets.getCategory(57, 'La', 1, 8), 'Lanthanides');
  assert.equal(Sets.getCategory(89, 'Ac', 1, 9), 'Actinides');
  assert.ok(!symbols('alkali').includes('La'));
  assert.ok(!symbols('alkali').includes('Ac'));
});

test('corrected category counts are stable', () => {
  assert.equal(symbols('alkali').length, 6);
  assert.equal(symbols('lanthanides').length, 15);
  assert.equal(symbols('actinides').length, 15);
  assert.equal(symbols('noble-gases').length, 7);
});

test('legacy numeric sets are unchanged', () => {
  assert.deepEqual(symbols('first20').map(s => s), Sets.elements.slice(0, 20).map(el => el[1]));
  assert.deepEqual(symbols('first36').map(s => s), Sets.elements.slice(0, 36).map(el => el[1]));
  assert.equal(symbols('all118').length, 118);
  assert.equal(symbols('first36').at(-1), 'Kr');
});

test('categories partition all 118 elements exactly once', () => {
  const categoryIds = Sets.ELEMENT_SET_OPTIONS.filter(x => x.kind === 'category').map(x => x.id);
  const all = categoryIds.flatMap(symbols);
  assert.equal(all.length, 118);
  assert.equal(new Set(all).size, 118);
});

test('unknown element set is rejected', () => {
  assert.throws(() => Sets.getElementSetMeta('made-up-set'), /Unknown element set/);
});
