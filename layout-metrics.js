(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PeriodicLayoutMetrics = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const STACK_BREAKPOINT = 980;
  const clamp = (min, value, max) => Math.max(min, Math.min(max, value));

  function calculateWorkspaceMetrics({ viewportWidth, panelWidth, usableHeight }) {
    const stacked = Number(viewportWidth) <= STACK_BREAKPOINT;
    const width = Math.max(320, Number(panelWidth) || 320);
    const height = Math.max(260, Number(usableHeight) || 260);
    const gap = clamp(1, width / 210, 6);
    const lowerGap = clamp(6, height * 0.03, 22);
    const cellByWidth = (width - (17 * gap)) / 18;
    const cellByHeight = (height - lowerGap - (8 * gap)) / 9;
    const desktopCell = Math.round(
      clamp(14, Math.min(cellByWidth, cellByHeight), 64) * 4
    ) / 4;
    const cellSize = stacked ? 48 : desktopCell;

    return {
      stacked,
      cellSize,
      cellGap: stacked ? 3 : gap,
      lowerGap: stacked ? 20 : lowerGap,
      lowerLabelWidth: stacked ? 86 : clamp(38, cellSize * 1.7, 110),
      elementTileSize: cellSize * 0.9,
      uiScale: clamp(0.78, cellSize / 52, 1.18)
    };
  }

  return { STACK_BREAKPOINT, calculateWorkspaceMetrics };
});
