(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PeriodicMultiplayerScoring = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const STREAK_POINTS = Object.freeze([10, 10, 11, 12, 13, 14]);
  const INCORRECT_PENALTY = 2;

  function pointsForStreak(streak) {
    const value = Math.max(1, Math.floor(Number(streak) || 1));
    return STREAK_POINTS[Math.min(STREAK_POINTS.length - 1, value - 1)];
  }

  function scoreAfterIncorrect(score) {
    return Math.max(0, (Number(score) || 0) - INCORRECT_PENALTY);
  }

  return { STREAK_POINTS, INCORRECT_PENALTY, pointsForStreak, scoreAfterIncorrect };
});
