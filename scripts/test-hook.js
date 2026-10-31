// Claude Code PostToolUse hook: runs the tests after Claude edits a file.
// On failure it exits 2, which hands the test output back to Claude so it
// fixes what it broke before moving on.
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.join(__dirname, '..');
const run = spawnSync(process.execPath, ['--test', '--test-reporter=dot'], { cwd: root, encoding: 'utf8' });

if (run.status !== 0) {
  process.stderr.write('Tests failed after this edit. Fix them before continuing.\n');
  process.stderr.write((run.stdout || '') + (run.stderr || ''));
  process.exit(2);
}
