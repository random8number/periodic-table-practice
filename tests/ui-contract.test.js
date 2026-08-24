const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');

test('v21.7 release markers cover local assets and retain the Firebase version', () => {
  assert.match(html, /<title>Periodic Table Practice v21\.7-new-game<\/title>/);
  assert.match(html, /class="dev-version">v21\.7 New Game<\/span>/);
  for (const asset of [
    'styles.css',
    'element-sets.js',
    'game-setup.js',
    'layout-metrics.js',
    'app.js'
  ]) {
    assert.match(html, new RegExp(`${asset.replace('.', '\\.')}` + '\\?v=21\\.7-new-game'));
  }
  assert.match(html, /firebase-config\.js\?v=21\.6-category-games/);
});

test('v21.7 loads element set core before app', () => {
  assert.match(html, /element-sets\.js\?v=21\.7-new-game/);
  assert.match(html, /app\.js\?v=21\.7-new-game/);
  assert.ok(html.indexOf('element-sets.js') < html.indexOf('app.js'));
});

test('New Game and rematch element-set selectors use shared population logic', () => {
  assert.match(js, /function populateElementSetSelects\(/);
  assert.match(js, /newGameElementSetSelect/);
  assert.match(js, /onlineRematchElementSetSelect/);
});

test('multiplayer has an inactive slot guard', () => {
  assert.match(js, /function isElementPlayable\(/);
  assert.match(js, /multiplayer-inactive/);
});

test('online category schema has legacy fallback helpers', () => {
  assert.match(js, /function getOnlineElementSetId\(/);
  assert.match(js, /function getOnlineRequiredCount\(/);
  assert.match(js, /21\.6-category-games/);
});

test('online completion uses required count', () => {
  assert.match(js, /getOnlineRequiredCount\(\)/);
});
