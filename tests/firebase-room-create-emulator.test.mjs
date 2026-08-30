import fs from 'node:fs';
import test from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { get, ref, set, update } from 'firebase/database';

const rules = fs.readFileSync('database.rules.v21.8.json', 'utf8');
const elementSets = JSON.parse(fs.readFileSync('elementSets.seed.json', 'utf8'));
const answers = JSON.parse(fs.readFileSync('answers.seed.json', 'utf8'));
let testEnv;

test.before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-periodic-table',
    database: { rules }
  });
  await testEnv.withSecurityRulesDisabled(async context => {
    const db = context.database();
    await set(ref(db, 'elementSets'), elementSets);
    await set(ref(db, 'answers'), answers);
  });
});

test.after(async () => {
  if (testEnv) await testEnv.cleanup();
});

function blankStats() {
  return { score: 0, streak: 0, bestStreak: 0, correct: 0, attempts: 0 };
}

function nobleGasRoom(now) {
  return {
    version: '21.8-learning-options',
    status: 'waiting',
    createdAt: now,
    lastActivityAt: now,
    expiresAt: now + (24 * 60 * 60 * 1000),
    host: { uid: 'host-uid', name: 'Player 1' },
    settings: {
      difficulty: 'beginner',
      elementSetId: 'noble-gases',
      requiredCount: 7,
      elementLimit: 118,
      learningAids: {
        allowAlphabetical: true,
        allowCategoryGrouping: true,
        allowCategoryColours: false
      }
    },
    game: {
      status: 'waiting',
      currentTurn: 'host',
      elementLimit: 118,
      elementOrder: ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og'],
      moveNumber: 0,
      completedLog: '|',
      completedCount: 0,
      players: { host: blankStats(), guest: blankStats() },
      elementSetId: 'noble-gases',
      requiredCount: 7
    }
  };
}

function playingRoom(now, hostScore = 0) {
  const room = nobleGasRoom(now);
  room.status = 'playing';
  room.guest = { uid: 'guest-uid', name: 'Player 2' };
  room.game.status = 'playing';
  room.game.players.host.score = hostScore;
  return room;
}

async function seedRoom(code, room) {
  await testEnv.withSecurityRulesDisabled(async context => {
    await set(ref(context.database(), `rooms/${code}`), room);
  });
}

test('v21.8 host can create a room with trusted learning-aid permissions', async () => {
  const db = testEnv.authenticatedContext('host-uid').database();
  await assertSucceeds(set(ref(db, 'rooms/TEST01'), nobleGasRoom(Date.now())));
});

test('v21.8 rejects a non-boolean learning-aid permission', async () => {
  const db = testEnv.authenticatedContext('host-uid').database();
  const room = nobleGasRoom(Date.now());
  room.settings.learningAids.allowCategoryGrouping = 'yes';
  await assertFails(set(ref(db, 'rooms/TEST02'), room));
});

test('guest cannot change host learning-aid permissions', async () => {
  const room = playingRoom(Date.now());
  room.status = 'finished';
  room.game.status = 'finished';
  await seedRoom('TEST03', room);

  const db = testEnv.authenticatedContext('guest-uid').database();
  await assertFails(update(ref(db, 'rooms/TEST03/settings/learningAids'), {
    allowCategoryColours: true
  }));
});

test('v21.8 accepts the complete capped streak schedule', async () => {
  await seedRoom('TEST04', playingRoom(Date.now()));
  const db = testEnv.authenticatedContext('host-uid').database();
  const gameRef = ref(db, 'rooms/TEST04/game');
  const moves = [
    ['He', 2, 10], ['Ne', 10, 10], ['Ar', 18, 11], ['Kr', 36, 12],
    ['Xe', 54, 13], ['Rn', 86, 14], ['Og', 118, 14]
  ];

  for (let index = 0; index < moves.length; index += 1) {
    const [symbol, targetNumber, points] = moves[index];
    const game = (await get(gameRef)).val();
    const next = structuredClone(game);
    const stats = next.players.host;
    stats.attempts += 1;
    stats.correct += 1;
    stats.streak += 1;
    stats.bestStreak = stats.streak;
    stats.score += points;
    next.moveNumber += 1;
    next.completedLog += `${symbol}|`;
    next.completedCount += 1;
    next.lastMove = {
      number: next.moveNumber, by: 'host', symbol, targetNumber,
      correct: true, points, streakAfter: stats.streak, at: Date.now()
    };
    if (index === moves.length - 1) {
      next.status = 'finished';
      next.winner = 'host';
      next.finishedAt = Date.now();
    }
    await assertSucceeds(set(gameRef, next));
  }
});

test('v21.8 incorrect move deducts two with a zero floor and passes turn', async () => {
  await seedRoom('TEST05', playingRoom(Date.now(), 1));
  const db = testEnv.authenticatedContext('host-uid').database();
  const gameRef = ref(db, 'rooms/TEST05/game');
  const game = (await get(gameRef)).val();
  const next = structuredClone(game);
  next.currentTurn = 'guest';
  next.moveNumber = 1;
  next.players.host.score = 0;
  next.players.host.attempts = 1;
  next.lastMove = {
    number: 1, by: 'host', symbol: 'He', targetNumber: 10,
    correct: false, points: -2, streakAfter: 0, at: Date.now()
  };
  await assertSucceeds(set(gameRef, next));
});

test('v21.8 rejects an incorrect move without the two-point deduction', async () => {
  await seedRoom('TEST06', playingRoom(Date.now(), 5));
  const db = testEnv.authenticatedContext('host-uid').database();
  const gameRef = ref(db, 'rooms/TEST06/game');
  const game = (await get(gameRef)).val();
  const next = structuredClone(game);
  next.currentTurn = 'guest';
  next.moveNumber = 1;
  next.players.host.attempts = 1;
  next.lastMove = {
    number: 1, by: 'host', symbol: 'He', targetNumber: 10,
    correct: false, points: -2, streakAfter: 0, at: Date.now()
  };
  await assertFails(set(gameRef, next));
});
