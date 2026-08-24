(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PeriodicLayoutMetrics = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const STACK_BREAKPOINT = 980;
  const MIN_SIDE_BY_SIDE_CELL_SIZE = 40;
  const DEFAULT_SIDEBAR_WIDTH = 310;
  const SPLITTER_WIDTH = 8;
  const TABLE_PANEL_MARGIN = 7;
  const TABLE_PANEL_HORIZONTAL_CHROME = 32;
  const clamp = (min, value, max) => Math.max(min, Math.min(max, value));

  function calculateWorkspaceMetrics({
    viewportWidth,
    workspaceWidth,
    sidebarWidth,
    panelWidth,
    usableHeight
  }) {
    const width = Math.max(320, Number(panelWidth) || 320);
    const height = Math.max(260, Number(usableHeight) || 260);
    const sidebar = Math.max(0, Number(sidebarWidth) || DEFAULT_SIDEBAR_WIDTH);
    const workspace = Math.max(
      0,
      Number(workspaceWidth) ||
        width + sidebar + SPLITTER_WIDTH + TABLE_PANEL_MARGIN + TABLE_PANEL_HORIZONTAL_CHROME
    );
    const sideBySidePanelWidth = Math.max(
      320,
      workspace - sidebar - SPLITTER_WIDTH - TABLE_PANEL_MARGIN - TABLE_PANEL_HORIZONTAL_CHROME
    );
    const sideBySideGap = clamp(1, sideBySidePanelWidth / 210, 6);
    const sideBySideCellByWidth = (sideBySidePanelWidth - (17 * sideBySideGap)) / 18;
    const stacked =
      Number(viewportWidth) <= STACK_BREAKPOINT ||
      sideBySideCellByWidth < MIN_SIDE_BY_SIDE_CELL_SIZE;
    const layoutWidth = stacked ? width : sideBySidePanelWidth;
    const gap = clamp(1, layoutWidth / 210, 6);
    const lowerGap = clamp(6, height * 0.03, 22);
    const cellByWidth = (layoutWidth - (17 * gap)) / 18;
    const cellByHeight = (height - lowerGap - (8 * gap)) / 9;
    const desktopCell = Math.floor(
      clamp(MIN_SIDE_BY_SIDE_CELL_SIZE, Math.min(cellByWidth, cellByHeight), 64) * 4
    ) / 4;
    const cellSize = stacked ? 48 : desktopCell;

    return {
      stacked,
      cellSize,
      cellGap: stacked ? 3 : gap,
      lowerGap: stacked ? 20 : lowerGap,
      lowerLabelWidth: stacked ? 86 : clamp(38, cellSize * 1.7, 110),
      elementTileSize: cellSize * 0.95,
      sideBySidePanelWidth,
      sideBySideCellByWidth,
      uiScale: clamp(0.78, cellSize / 52, 1.18)
    };
  }

  return { STACK_BREAKPOINT, MIN_SIDE_BY_SIDE_CELL_SIZE, calculateWorkspaceMetrics };
});
