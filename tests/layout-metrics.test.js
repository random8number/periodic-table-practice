const test = require('node:test');
const assert = require('node:assert/strict');
const Layout = require('../layout-metrics.js');

test('desktop element tile is 95 percent of table cell', () => {
  const metrics = Layout.calculateWorkspaceMetrics({
    viewportWidth: 1440,
    panelWidth: 1000,
    usableHeight: 650
  });
  assert.equal(metrics.stacked, false);
  assert.ok(metrics.cellSize > 0);
  assert.equal(metrics.elementTileSize, metrics.cellSize * 0.95);
});

test('narrow viewport switches to stacked mode without changing 95 percent ratio', () => {
  const metrics = Layout.calculateWorkspaceMetrics({
    viewportWidth: 760,
    panelWidth: 760,
    usableHeight: 800
  });
  assert.equal(metrics.stacked, true);
  assert.equal(metrics.elementTileSize, metrics.cellSize * 0.95);
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

test('95 percent ratio is exact across representative wide and stacked sizes', () => {
  for (const input of [
    { viewportWidth: 760, panelWidth: 760, usableHeight: 800 },
    { viewportWidth: 1440, panelWidth: 980, usableHeight: 650 },
    { viewportWidth: 1920, panelWidth: 1320, usableHeight: 820 }
  ]) {
    const metrics = Layout.calculateWorkspaceMetrics(input);
    assert.equal(metrics.elementTileSize, metrics.cellSize * 0.95);
  }
});

test('calculated side-by-side panel stacks above 980px when cells would be under 40px', () => {
  const metrics = Layout.calculateWorkspaceMetrics({
    viewportWidth: 1100,
    workspaceWidth: 1000,
    sidebarWidth: 310,
    panelWidth: 643,
    usableHeight: 600
  });

  assert.equal(metrics.sideBySidePanelWidth, 643);
  assert.ok(metrics.sideBySideCellByWidth < 40);
  assert.equal(metrics.stacked, true);
  assert.ok(metrics.cellSize >= 40);
});

test('sufficiently wide workspace remains side-by-side with a 40px minimum cell', () => {
  const metrics = Layout.calculateWorkspaceMetrics({
    viewportWidth: 1600,
    workspaceWidth: 1500,
    sidebarWidth: 310,
    panelWidth: 1143,
    usableHeight: 650
  });

  assert.equal(metrics.stacked, false);
  assert.ok(metrics.sideBySideCellByWidth >= 40);
  assert.ok(metrics.cellSize >= 40);
});

test('wide but short workspace remains side-by-side with a 40px minimum cell', () => {
  const metrics = Layout.calculateWorkspaceMetrics({
    viewportWidth: 1600,
    workspaceWidth: 1500,
    sidebarWidth: 310,
    panelWidth: 1143,
    usableHeight: 260
  });

  assert.equal(metrics.stacked, false);
  assert.ok(metrics.sideBySideCellByWidth >= 40);
  assert.ok(metrics.cellSize >= 40);
});

test('side-by-side sizing uses its hypothetical panel width after stacked reflow', () => {
  const metrics = Layout.calculateWorkspaceMetrics({
    viewportWidth: 1600,
    workspaceWidth: 1500,
    sidebarWidth: 310,
    panelWidth: 1500,
    usableHeight: 650
  });
  const tableWidth = (18 * metrics.cellSize) + (17 * metrics.cellGap);

  assert.equal(metrics.stacked, false);
  assert.ok(tableWidth <= metrics.sideBySidePanelWidth);
});

test('desktop table metrics fit supplied width and height after quantization', () => {
  for (const input of [
    { viewportWidth: 1440, panelWidth: 900, usableHeight: 560 },
    { viewportWidth: 1440, panelWidth: 1000, usableHeight: 560 },
    { viewportWidth: 1920, panelWidth: 1320, usableHeight: 820 }
  ]) {
    const metrics = Layout.calculateWorkspaceMetrics(input);
    const tableWidth = (18 * metrics.cellSize) + (17 * metrics.cellGap);
    const tableHeight = (9 * metrics.cellSize) + metrics.lowerGap + (8 * metrics.cellGap);

    assert.ok(tableWidth <= input.panelWidth, `width ${tableWidth} exceeds ${input.panelWidth}`);
    assert.ok(tableHeight <= input.usableHeight, `height ${tableHeight} exceeds ${input.usableHeight}`);
  }
});
