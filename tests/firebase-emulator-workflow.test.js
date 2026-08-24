const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const workflowPath = '.github/workflows/firebase-rtdb-emulator.yml';

function readWorkflow() {
  assert.equal(
    fs.existsSync(workflowPath),
    true,
    `${workflowPath} must exist`
  );
  return fs.readFileSync(workflowPath, 'utf8');
}

function topLevelBlock(source, key) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex(line => line === `${key}:`);
  assert.notEqual(start, -1, `missing top-level ${key} block`);

  let end = start + 1;
  while (end < lines.length && (!lines[end].trim() || /^\s/.test(lines[end]))) end++;
  return lines.slice(start + 1, end).join('\n');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('Firebase emulator gate is manually dispatched only', () => {
  const workflow = readWorkflow();
  const triggers = topLevelBlock(workflow, 'on');

  assert.match(triggers, /^  workflow_dispatch:\s*$/m);
  assert.doesNotMatch(
    triggers,
    /^\s+(push|pull_request|pull_request_target|schedule|workflow_run|repository_dispatch):/m
  );
});

test('workflow uses the approved hosted Node, Java, and pinned ephemeral tools', () => {
  const workflow = readWorkflow();
  const compact = workflow.replace(/\s+/g, ' ');

  assert.match(workflow, /runs-on:\s*ubuntu-latest/);
  assert.match(workflow, /uses:\s*actions\/setup-node@v4[\s\S]*node-version:\s*['"]24['"]/);
  assert.match(workflow, /uses:\s*actions\/setup-java@v4[\s\S]*distribution:\s*temurin[\s\S]*java-version:\s*['"]21['"]/);
  assert.match(
    compact,
    /npm install --no-save --package-lock=false firebase@12\.17\.1 @firebase\/rules-unit-testing@5\.0\.1 firebase-tools@15\.28\.1/
  );
  assert.doesNotMatch(workflow, /npm (ci|install)(?! --no-save)/);
});

test('workflow runs only the RTDB emulator test with a demo project', () => {
  const workflow = readWorkflow();
  const compact = workflow.replace(/\s+/g, ' ');

  assert.match(
    compact,
    /npx --no-install firebase emulators:exec --only database --project demo-periodic-table "node --test tests\/firebase-room-create-emulator\.test\.mjs"/
  );
  assert.doesNotMatch(compact, /--only (?!database(?:\s|$))/);

  const configMatch = workflow.match(
    /cat > firebase\.json <<'JSON'\s*([\s\S]*?)\s*^\s*JSON\s*$/m
  );
  assert.ok(configMatch, 'workflow must create an ephemeral firebase.json');
  assert.deepEqual(JSON.parse(configMatch[1]), {
    database: { rules: 'database.rules.v21.6.json' },
    emulators: {
      database: { port: 9000 },
      ui: { enabled: false }
    }
  });
});

test('workflow cannot authenticate to or deploy production Firebase', () => {
  const workflow = readWorkflow();
  const firebaseConfig = fs.readFileSync('firebase-config.js', 'utf8');
  const productionProjectId = firebaseConfig.match(/projectId:\s*["']([^"']+)["']/)?.[1];

  assert.match(workflow, /^permissions:\s*\n\s+contents:\s*read\s*$/m);
  assert.doesNotMatch(workflow, /\$\{\{\s*secrets\./);
  assert.doesNotMatch(
    workflow,
    /FIREBASE_TOKEN|GOOGLE_APPLICATION_CREDENTIALS|service.?account|firebase\s+(login|deploy|use)|projects:list/i
  );
  assert.ok(productionProjectId, 'firebase-config.js must expose a projectId for this guard');
  assert.doesNotMatch(workflow, new RegExp(escapeRegExp(productionProjectId)));
});
