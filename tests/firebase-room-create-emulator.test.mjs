import fs from 'node:fs';
import test from 'node:test';
import { initializeTestEnvironment, assertSucceeds } from '@firebase/rules-unit-testing';
import { ref, set } from 'firebase/database';

const rules = fs.readFileSync('database.rules.v21.6.json', 'utf8');
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
    version: '21.6-category-games',
    status: 'waiting',
    createdAt: now,
    lastActivityAt: now,
    expiresAt: now + (24 * 60 * 60 * 1000),
    host: { uid: 'host-uid', name: 'Player 1' },
    settings: {
      difficulty: 'beginner',
      elementSetId: 'noble-gases',
      requiredCount: 7,
      elementLimit: 118
    },
    game: {
      status: 'waiting',
      currentTurn: 'host',
      elementLimit: 118,
      elementOrder: ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og'],
      moveNumber: 0,
      completedLog: '|',
      completedCount: 0,
      players: {
        host: blankStats(),
        guest: blankStats()
      },
      elementSetId: 'noble-gases',
      requiredCount: 7
    }
  };
}

test('v21.6 host can create a noble-gases room with trusted elementSets data', async () => {
  const db = testEnv.authenticatedContext('host-uid').database();
  await assertSucceeds(set(ref(db, 'rooms/TEST01'), nobleGasRoom(Date.now())));
});
