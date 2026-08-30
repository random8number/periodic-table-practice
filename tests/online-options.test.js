const test = require('node:test');
const assert = require('node:assert/strict');
const Options = require('../online-options.js');

test('host permissions accept only explicit booleans', () => {
  assert.deepEqual(Options.normaliseHostPermissions({
    allowAlphabetical: true,
    allowCategoryGrouping: 'yes',
    allowCategoryColours: false
  }), {
    allowAlphabetical: true,
    allowCategoryGrouping: false,
    allowCategoryColours: false
  });
});

test('default host permissions allow each optional learning aid', () => {
  assert.deepEqual(Options.DEFAULT_HOST_PERMISSIONS, {
    allowAlphabetical: true,
    allowCategoryGrouping: true,
    allowCategoryColours: true
  });
});

test('private preferences fall back when the host disables an aid', () => {
  assert.deepEqual(Options.normalisePlayerPreferences(
    { sortMode: 'category', categoryColours: true },
    { allowAlphabetical: true, allowCategoryGrouping: false, allowCategoryColours: false }
  ), { sortMode: 'random', categoryColours: false });
});

test('allowed sort modes always include random and never include atomic', () => {
  assert.deepEqual(Options.allowedSortModes({
    allowAlphabetical: true,
    allowCategoryGrouping: true,
    allowCategoryColours: true
  }), ['random', 'alpha', 'category']);
});

test('alphabetical mode sorts by full element name', () => {
  const elements = [[18, 'Ar', 'Argon'], [13, 'Al', 'Aluminium'], [5, 'B', 'Boron']];
  const sorted = Options.sortElementsForOnline(elements, 'alpha', () => '', [], () => 0.5);
  assert.deepEqual(sorted.map(element => element[2]), ['Aluminium', 'Argon', 'Boron']);
});

test('category order is stable and alphabetical inside each category', () => {
  const elements = [[11,'Na','Sodium'], [1,'H','Hydrogen'], [3,'Li','Lithium'], [2,'He','Helium']];
  const categories = { Li:'Alkali metals', H:'Reactive non-metals', Na:'Alkali metals', He:'Noble gases' };
  const sorted = Options.sortElementsForOnline(
    elements, 'category', (_n, symbol) => categories[symbol],
    ['Alkali metals', 'Reactive non-metals', 'Noble gases'], () => 0.5
  );
  assert.deepEqual(sorted.map(element => element[1]), ['Li', 'Na', 'H', 'He']);
});

test('random mode can use a stable caller-provided random source', () => {
  const elements = [[1,'H','Hydrogen'], [2,'He','Helium'], [3,'Li','Lithium']];
  const sorted = Options.sortElementsForOnline(elements, 'random', () => '', [], () => 0.75);
  assert.deepEqual(sorted.map(element => element[1]), ['H', 'He', 'Li']);
});
