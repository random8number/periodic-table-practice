const test = require('node:test');
const assert = require('node:assert/strict');
const Scoring = require('../multiplayer-scoring.js');

test('online streak points use the agreed cap', () => {
  assert.deepEqual(
    [1, 2, 3, 4, 5, 6, 7, 20].map(Scoring.pointsForStreak),
    [10, 10, 11, 12, 13, 14, 14, 14]
  );
});

test('incorrect deduction has a zero floor', () => {
  assert.equal(Scoring.scoreAfterIncorrect(20), 18);
  assert.equal(Scoring.scoreAfterIncorrect(2), 0);
  assert.equal(Scoring.scoreAfterIncorrect(1), 0);
  assert.equal(Scoring.scoreAfterIncorrect(0), 0);
});

test('invalid streaks and scores normalize safely', () => {
  assert.equal(Scoring.pointsForStreak(0), 10);
  assert.equal(Scoring.pointsForStreak('bad'), 10);
  assert.equal(Scoring.scoreAfterIncorrect('bad'), 0);
});
