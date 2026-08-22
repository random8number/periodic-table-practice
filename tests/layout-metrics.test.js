const test = require('node:test');
const assert = require('node:assert/strict');
const Layout = require('../layout-metrics.js');

test('desktop element tile is 90 percent of table cell', () => {
  const metrics = Layout.calculateWorkspaceMetrics({
    viewportWidth: 1440,
    panelWidth: 1000,
    usableHeight: 650
  });
  assert.equal(metrics.stacked, false);
  assert.ok(metrics.cellSize > 0);
  assert.equal(metrics.elementTileSize, metrics.cellSize * 0.9);
});

test('narrow viewport switches to stacked mode without changing 90 percent ratio', () => {
  const metrics = Layout.calculateWorkspaceMetrics({
    viewportWidth: 760,
    panelWidth: 760,
    usableHeight: 800
  });
  assert.equal(metrics.stacked, true);
  assert.equal(metrics.elementTileSize, metrics.cellSize * 0.9);
});

test('desktop cells remain bounded and UI scale remains readable', () => {
  const metrics = Layout.calculateWorkspaceMetrics({
    viewportWidth: 1800,
    panelWidth: 1250,
    usableHeight: 760
  });
  assert.ok(metrics.cellSize >= 14 && metrics.cellSize <= 64);
  assert.ok(metrics.uiScale >= 0.78 && metrics.uiScale <= 1.18);
});
