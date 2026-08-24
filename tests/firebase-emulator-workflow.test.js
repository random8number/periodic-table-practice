const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');

const workflowPath = '.github/workflows/firebase-rtdb-emulator.yml';
const approvedWorkflowSha256 = 'd60c16bd91664b22151dc6075a1550bdf3c4f8692bafa6e9a86230b41b219be5';

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

function namedStepBlock(source, name) {
  const marker = `      - name: ${name}`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `missing workflow step: ${name}`);
  const next = source.indexOf('\n      - name:', start + marker.length);
  return source.slice(start, next === -1 ? source.length : next);
}

function foldedRunCommand(stepBlock) {
  const marker = 'run: >-';
  const start = stepBlock.indexOf(marker);
  assert.notEqual(start, -1, 'expected a folded run command');
  return stepBlock.slice(start + marker.length).replace(/\s+/g, ' ').trim();
}

function literalRunScript(stepBlock) {
  const marker = 'run: |';
  const start = stepBlock.indexOf(marker);
  assert.notEqual(start, -1, 'expected a literal run script');
  return stepBlock.slice(start + marker.length)
    .split(/\r?\n/)
    .map(line => line.replace(/^ {10}/, ''))
    .join('\n')
    .trim();
}

function assertManualOnlyTrigger(workflow) {
  const triggers = topLevelBlock(workflow, 'on');
  const events = [...triggers.matchAll(/^  ([A-Za-z0-9_-]+):/gm)]
    .map(match => match[1]);

  assert.deepEqual(events, ['workflow_dispatch']);
}

function assertApprovedToolInstall(workflow) {
  const installCommand = foldedRunCommand(
    namedStepBlock(workflow, 'Install emulator test dependencies')
  );
  const packageInstalls = workflow.match(/\bnpm (?:ci|install)\b/g) || [];

  assert.equal(
    installCommand,
    'npm install --no-save --package-lock=false firebase@12.17.1 ' +
      '@firebase/rules-unit-testing@5.0.1 firebase-tools@15.28.1'
  );
  assert.equal(packageInstalls.length, 1);
}

function assertProductionIsolation(workflow) {
  const firebaseConfig = fs.readFileSync('firebase-config.js', 'utf8');
  const productionProjectId = firebaseConfig.match(/projectId:\s*["']([^"']+)["']/)?.[1];
  const permissionBlocks = [...workflow.matchAll(/^([ \t]*)permissions:\s*$/gm)];
  const jobNames = [...topLevelBlock(workflow, 'jobs').matchAll(/^  ([A-Za-z0-9_-]+):\s*$/gm)]
    .map(match => match[1]);
  const stepEntries = [...workflow.matchAll(/^      - /gm)];
  const stepNames = [...workflow.matchAll(/^      - name:\s*(.+)$/gm)]
    .map(match => match[1]);
  const actions = [...workflow.matchAll(/^        uses:\s*(\S+)\s*$/gm)]
    .map(match => match[1]);

  assert.equal(permissionBlocks.length, 1);
  assert.equal(permissionBlocks[0][1], '');
  assert.equal(topLevelBlock(workflow, 'permissions').trim(), 'contents: read');
  assert.deepEqual(jobNames, ['firebase-rtdb-emulator']);
  assert.equal(stepEntries.length, 7);
  assert.deepEqual(stepNames, [
    'Check out v21.7 branch',
    'Set up Node.js LTS',
    'Set up Java for the RTDB emulator',
    'Install emulator test dependencies',
    'Report tool versions',
    'Configure the local RTDB emulator',
    'Run Firebase RTDB emulator regression'
  ]);
  assert.deepEqual(actions, [
    'actions/checkout@v4',
    'actions/setup-node@v4',
    'actions/setup-java@v4'
  ]);
  assert.equal(
    literalRunScript(namedStepBlock(workflow, 'Report tool versions')),
    [
      'node --version',
      'npm --version',
      'java -version',
      'npx --no-install firebase --version',
      'npm ls --depth=0 firebase @firebase/rules-unit-testing firebase-tools'
    ].join('\n')
  );
  assert.equal(
    literalRunScript(namedStepBlock(workflow, 'Configure the local RTDB emulator')),
    [
      "cat > firebase.json <<'JSON'",
      '{',
      '  "database": { "rules": "database.rules.v21.6.json" },',
      '  "emulators": {',
      '    "database": { "port": 9000 },',
      '    "ui": { "enabled": false }',
      '  }',
      '}',
      'JSON'
    ].join('\n')
  );
  assert.equal(
    foldedRunCommand(namedStepBlock(workflow, 'Run Firebase RTDB emulator regression')),
    'npx --no-install firebase emulators:exec --only database ' +
      '--project demo-periodic-table ' +
      '"node --test tests/firebase-room-create-emulator.test.mjs"'
  );
  assert.doesNotMatch(workflow, /\$\{\{\s*secrets\./);
  assert.doesNotMatch(
    workflow,
    /FIREBASE_TOKEN|GOOGLE_APPLICATION_CREDENTIALS|service.?account|firebase\s+(login|deploy|use)|projects:list/i
  );
  assert.ok(productionProjectId, 'firebase-config.js must expose a projectId for this guard');
  assert.doesNotMatch(workflow, new RegExp(escapeRegExp(productionProjectId)));
}

function assertWorkflowPolicy(workflow) {
  const normalizedWorkflow = workflow.replace(/\r\n/g, '\n').trimEnd() + '\n';
  const workflowSha256 = crypto.createHash('sha256')
    .update(normalizedWorkflow)
    .digest('hex');

  assert.equal(
    workflowSha256,
    approvedWorkflowSha256,
    'workflow structure changed outside the approved manual emulator gate'
  );
  assertManualOnlyTrigger(workflow);
  assertApprovedToolInstall(workflow);
  assertProductionIsolation(workflow);
}

test('Firebase emulator gate is manually dispatched only', () => {
  assertManualOnlyTrigger(readWorkflow());
});

test('manual-only trigger contract rejects an unlisted automatic event', () => {
  const unsafeWorkflow = readWorkflow().replace(
    '  workflow_dispatch:',
    '  workflow_dispatch:\n  release:'
  );
  assert.throws(() => assertManualOnlyTrigger(unsafeWorkflow));
});

test('workflow uses the approved hosted Node, Java, and pinned ephemeral tools', () => {
  const workflow = readWorkflow();

  assert.match(workflow, /runs-on:\s*ubuntu-latest/);
  assert.match(workflow, /uses:\s*actions\/setup-node@v4[\s\S]*node-version:\s*['"]24['"]/);
  assert.match(workflow, /uses:\s*actions\/setup-java@v4[\s\S]*distribution:\s*temurin[\s\S]*java-version:\s*['"]21['"]/);
  assertApprovedToolInstall(workflow);
  assert.equal(fs.existsSync('package.json'), false);
  assert.equal(fs.existsSync('package-lock.json'), false);
  assert.equal(fs.existsSync('npm-shrinkwrap.json'), false);
});

test('dependency contract rejects an extra direct package', () => {
  const unsafeWorkflow = readWorkflow().replace(
    'firebase-tools@15.28.1',
    'firebase-tools@15.28.1 left-pad@1.3.0'
  );
  assert.throws(() => assertApprovedToolInstall(unsafeWorkflow));
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
  assertProductionIsolation(readWorkflow());
});

test('production-isolation contract rejects OIDC write permission', () => {
  const unsafeWorkflow = readWorkflow().replace(
    '  contents: read',
    '  contents: read\n  id-token: write'
  );
  assert.throws(() => assertProductionIsolation(unsafeWorkflow));
});

test('production-isolation contract rejects an authentication action', () => {
  const unsafeWorkflow = readWorkflow().replace(
    '      - name: Check out v21.7 branch',
    '      - name: Authenticate to Google Cloud\n' +
      '        uses: google-github-actions/auth@v2\n\n' +
      '      - name: Check out v21.7 branch'
  );
  assert.throws(() => assertProductionIsolation(unsafeWorkflow));
});

test('production-isolation contract rejects an extra Firebase command', () => {
  const unsafeWorkflow = readWorkflow().replace(
    '          npx --no-install firebase --version',
    '          npx --no-install firebase --version\n' +
      '          npx --no-install firebase database:set / --project another-project {}'
  );
  assert.throws(() => assertProductionIsolation(unsafeWorkflow));
});

test('complete workflow policy rejects YAML and shell execution bypasses', () => {
  const workflow = readWorkflow();
  const unsafeWorkflows = [
    workflow.replace(
      '  workflow_dispatch:',
      '  workflow_dispatch:\n  "release":'
    ),
    workflow.replace(
      '      - name: Install emulator test dependencies',
      '      - name: Install emulator test dependencies\n' +
        '        shell: bash -c "npm i --no-save left-pad@1.3.0; bash {0}"'
    ),
    workflow.replace(
      'jobs:\n  firebase-rtdb-emulator:',
      'jobs:\n  "remote-job":\n' +
        '    uses: another-owner/another-repo/.github/workflows/deploy.yml@main\n' +
        '  firebase-rtdb-emulator:'
    )
  ];

  for (const unsafeWorkflow of unsafeWorkflows) {
    assert.throws(() => assertWorkflowPolicy(unsafeWorkflow));
  }
});
