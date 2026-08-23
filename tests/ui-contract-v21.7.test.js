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
