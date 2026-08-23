const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');

test('v21.7 removes Play mode dropdown and exposes New Game / Join Game', () => {
  assert.doesNotMatch(html, /id="playModeSelect"/);
  assert.match(html, /id="newGameButton"/);
  assert.match(html, /id="joinGameButton"/);
});

test('v21.7 loads setup and layout helpers before app.js', () => {
  assert.match(html, /game-setup\.js\?v=21\.7-new-game/);
  assert.match(html, /layout-metrics\.js\?v=21\.7-new-game/);
  assert.ok(html.indexOf('element-sets.js') < html.indexOf('game-setup.js'));
  assert.ok(html.indexOf('game-setup.js') < html.indexOf('app.js'));
});

test('New Game dialog has common settings and mode-specific player containers', () => {
  for (const id of [
    'newGameDialog', 'newGameGameTypeSelect', 'newGameElementSetSelect',
    'newGameDifficultySelect', 'newGameSingleFields', 'newGameLocalFields',
    'newGameOnlineFields', 'confirmNewGameButton'
  ]) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /name="newGamePlayMode"[^>]*value="single"/);
  assert.match(html, /name="newGamePlayMode"[^>]*value="local"/);
  assert.match(html, /name="newGamePlayMode"[^>]*value="online"/);
});

test('New Game dialog renders sections in play mode, settings, then player order', () => {
  const start = html.indexOf('id="newGameDialog"');
  const end = html.indexOf('</dialog>', start);
  const newGameMarkup = html.slice(start, end);
  const orderedMarkers = [
    'aria-label="Play mode"',
    'id="newGameGameTypeSelect"',
    'id="newGameElementSetSelect"',
    'id="newGameDifficultySelect"',
    'id="newGameSingleFields"',
    'id="newGameLocalFields"',
    'id="newGameOnlineFields"'
  ];
  const positions = orderedMarkers.map(marker => newGameMarkup.indexOf(marker));
  assert.ok(positions.every(position => position >= 0));
  for (let index = 1; index < positions.length; index++) {
    assert.ok(positions[index - 1] < positions[index]);
  }
});

test('Join Game contains no editable host game settings', () => {
  const start = html.indexOf('id="joinGameDialog"');
  const end = html.indexOf('</dialog>', start);
  const joinMarkup = html.slice(start, end);
  assert.match(joinMarkup, /id="joinPlayerNameInput"/);
  assert.match(joinMarkup, /id="joinRoomCodeInput"/);
  assert.match(joinMarkup, /id="joinGamePreview"/);
  assert.doesNotMatch(joinMarkup, /id="newGameDifficultySelect"/);
  assert.doesNotMatch(joinMarkup, /id="newGameElementSetSelect"/);
  assert.doesNotMatch(joinMarkup, /id="newGameGameTypeSelect"/);
});

test('game launch actions are independent from hideable answer actions', () => {
  assert.match(html, /class="game-launch-actions"/);
  assert.match(css, /\.game-launch-actions/);
});

const js = fs.readFileSync('app.js', 'utf8');

test('New Game uses one normalized common setup before dispatch', () => {
  assert.match(js, /function readNewGameSetup\(/);
  assert.match(js, /PeriodicGameSetup\.normaliseSetup/);
  assert.match(js, /async function startGameFromSetup\(/);
});

test('cancelling setup closes dialogs without ending current game', () => {
  assert.match(js, /cancelNewGameButton/);
  assert.match(js, /cancelJoinGameButton/);
  assert.doesNotMatch(js, /cancelNewGameButton[\s\S]{0,180}endLocalMultiplayer/);
  assert.doesNotMatch(js, /cancelNewGameButton[\s\S]{0,180}leaveOnlineRoom/);
  assert.doesNotMatch(js, /cancelJoinGameButton[\s\S]{0,180}endLocalMultiplayer/);
  assert.doesNotMatch(js, /cancelJoinGameButton[\s\S]{0,180}leaveOnlineRoom/);
  assert.doesNotMatch(js, /joinGameDialog"\)\.addEventListener\("cancel"[\s\S]{0,180}endLocalMultiplayer/);
  assert.doesNotMatch(js, /joinGameDialog"\)\.addEventListener\("cancel"[\s\S]{0,180}leaveOnlineRoom/);
});

test('confirmed Join Game cleans up an active game before joining', () => {
  assert.match(js, /async function joinGameFromDialog\(\)[\s\S]{0,500}if \(isOnlineRoomActive\(\)\) await leaveOnlineRoom\(true\);[\s\S]{0,500}if \(localGame\) endLocalMultiplayer\(false\);[\s\S]{0,500}await joinOnlineRoom\(\)/);
  assert.match(js, /confirmJoinGameButton"\)\.addEventListener\("click", joinGameFromDialog\)/);
});

test('New Game and Join Game confirmations share one pending guard through cleanup and dispatch', () => {
  assert.match(js, /let gameSetupOperationPending = false;/);

  const guardStart = js.indexOf('function setGameSetupOperationPending(');
  const guardEnd = js.indexOf('\nfunction getCurrentGameSetup', guardStart);
  const guard = js.slice(guardStart, guardEnd);
  assert.match(guard, /confirmNewGameButton/);
  assert.match(guard, /confirmJoinGameButton/);
  assert.match(guard, /\.disabled = pending/);

  for (const name of ['startGameFromSetup', 'joinGameFromDialog']) {
    const start = js.indexOf(`async function ${name}()`);
    const end = js.indexOf('\nfunction ', start + 1);
    const handler = js.slice(start, end);
    assert.match(handler, /if \(gameSetupOperationPending\) return;/);
    assert.match(handler, /setGameSetupOperationPending\(true\);/);
    assert.match(handler, /finally \{\s*setGameSetupOperationPending\(false\);\s*\}/);
  }

  const firebaseStatusStart = js.indexOf('function updateFirebaseLoadStatus()');
  const firebaseStatusEnd = js.indexOf('\nfunction setOnlineRoomControls', firebaseStatusStart);
  assert.match(js.slice(firebaseStatusStart, firebaseStatusEnd), /gameSetupOperationPending/);
});

test('only a user Single Player difficulty change updates the preserved Single setup', () => {
  assert.match(html, /id="modeSelect" onchange="setModeFromUser\(this\.value\)"/);

  const userHandlerStart = js.indexOf('function setModeFromUser(mode)');
  const userHandlerEnd = js.indexOf('\nfunction setMode(', userHandlerStart);
  const userHandler = js.slice(userHandlerStart, userHandlerEnd);
  assert.match(userHandler, /if \(playMode === "single"\) \{\s*singleGame\.difficulty = mode;\s*\}/);
  assert.match(userHandler, /singleGame\.difficulty = mode;[\s\S]*setMode\(mode\);/);

  const localStart = js.indexOf('function startLocalMultiplayer(setup)');
  const localEnd = js.indexOf('\nfunction ', localStart + 1);
  const localHandler = js.slice(localStart, localEnd);
  assert.match(localHandler, /setMode\(setup\.difficulty\);/);
  assert.doesNotMatch(localHandler, /setModeFromUser/);

  const onlineSnapshotStart = js.indexOf('function applyOnlineRoomSnapshot(roomData)');
  const onlineSnapshotEnd = js.indexOf('\nfunction ', onlineSnapshotStart + 1);
  const onlineSnapshotHandler = js.slice(onlineSnapshotStart, onlineSnapshotEnd);
  assert.match(onlineSnapshotHandler, /setMode\(difficulty\);/);
  assert.doesNotMatch(onlineSnapshotHandler, /setModeFromUser/);
});

test('Local and Online starters consume normalized setup instead of deleted setup selects', () => {
  assert.match(js, /function startLocalMultiplayer\(setup\)/);
  assert.match(js, /async function createOnlineRoom\(setup\)/);
  assert.doesNotMatch(js, /localDifficultySelect/);
  assert.doesNotMatch(js, /localElementSetSelect/);
  assert.doesNotMatch(js, /onlineDifficultySelect/);
  assert.doesNotMatch(js, /onlineElementSetSelect/);
});

test('Join Game previews immutable host settings before joining', () => {
  assert.match(js, /async function previewJoinRoom\(code\)/);
  assert.match(js, /PeriodicGameSetup\.setupFromRoom/);
  assert.match(js, /joinPreviewSettings/);
});

test('online host still writes v21.6 category-game schema', () => {
  assert.match(js, /version:\s*["']21\.6-category-games["']/);
  assert.match(js, /elementSetId:\s*meta\.id/);
  assert.match(js, /requiredCount:\s*meta\.count/);
  assert.match(js, /elementLimit:\s*meta\.maxTarget/);
});

test('Firebase control gating does not depend on the optional status element', () => {
  assert.doesNotMatch(html, /id="firebaseLoadStatus"/);
  const start = js.indexOf('function updateFirebaseLoadStatus()');
  const end = js.indexOf('\nfunction setOnlineRoomControls', start);
  const updater = js.slice(start, end);
  const statusReturn = updater.indexOf('if (!el) return;');

  assert.ok(statusReturn >= 0);
  assert.ok(updater.indexOf('const createButton') < statusReturn);
  assert.ok(updater.indexOf('const joinButton') < statusReturn);
});

test('workspace uses explicit 90-percent element-tile metric', () => {
  assert.match(js, /PeriodicLayoutMetrics\.calculateWorkspaceMetrics/);
  assert.match(js, /--element-tile-size/);
  assert.match(css, /var\(--element-tile-size/);
});

test('wide app can fill viewport and narrow layout stacks the pool', () => {
  assert.match(css, /\.app\s*\{[\s\S]*width:\s*100%/);
  assert.match(css, /@media\s*\(max-width:\s*980px\)[\s\S]*\.main[\s\S]*grid-template-columns:\s*1fr/);
});
