(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PeriodicOnlineOptions = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const DEFAULT_HOST_PERMISSIONS = Object.freeze({
    allowAlphabetical: true,
    allowCategoryGrouping: true,
    allowCategoryColours: true
  });

  function normaliseHostPermissions(input = {}) {
    return {
      allowAlphabetical: input.allowAlphabetical === true,
      allowCategoryGrouping: input.allowCategoryGrouping === true,
      allowCategoryColours: input.allowCategoryColours === true
    };
  }

  function allowedSortModes(permissions) {
    const value = normaliseHostPermissions(permissions);
    return ['random']
      .concat(value.allowAlphabetical ? ['alpha'] : [])
      .concat(value.allowCategoryGrouping ? ['category'] : []);
  }

  function normalisePlayerPreferences(input = {}, permissions = {}) {
    const value = normaliseHostPermissions(permissions);
    const allowed = allowedSortModes(value);
    return {
      sortMode: allowed.includes(input.sortMode) ? input.sortMode : 'random',
      categoryColours: value.allowCategoryColours && input.categoryColours === true
    };
  }

  function sortElementsForOnline(elements, mode, getCategory, categoryOrder, random = Math.random) {
    const sorted = [...elements];
    if (mode === 'alpha') return sorted.sort((a, b) => a[2].localeCompare(b[2]));
    if (mode === 'random') return sorted.sort(() => random() - 0.5);
    if (mode !== 'category') return sorted;

    const rank = new Map(categoryOrder.map((category, index) => [category, index]));
    return sorted.sort((a, b) => {
      const categoryA = getCategory(a[0], a[1], a[3], a[4]);
      const categoryB = getCategory(b[0], b[1], b[3], b[4]);
      return (rank.get(categoryA) ?? 999) - (rank.get(categoryB) ?? 999)
        || a[2].localeCompare(b[2]);
    });
  }

  return {
    DEFAULT_HOST_PERMISSIONS,
    normaliseHostPermissions,
    allowedSortModes,
    normalisePlayerPreferences,
    sortElementsForOnline
  };
});
