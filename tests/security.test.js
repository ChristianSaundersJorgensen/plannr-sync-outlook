// Guards against the add-in drifting into riskier settings.
// These read the files as text; they are tripwires, not a full parser.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const PAGES = 'https://christiansaundersjorgensen.github.io/plannr-sync-outlook/';

const manifest = read('manifest.xml');
const taskpane = read('taskpane.html');

test('manifest asks only for read access to the open email', () => {
  const perms = [...manifest.matchAll(/<Permissions>\s*([^<]+?)\s*<\/Permissions>/g)].map((m) => m[1]);
  assert.deepEqual(perms, ['ReadItem'], 'widening permissions (e.g. ReadWriteMailbox) needs a deliberate decision');
});

test('every manifest URL is https on this Pages site and points at a real file', () => {
  const urls = [...manifest.matchAll(/DefaultValue="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  assert.ok(urls.length > 0);
  for (const u of urls) {
    assert.ok(u.startsWith(PAGES), `unexpected URL in manifest: ${u}`);
    const file = u.slice(PAGES.length) || 'index.html';
    assert.ok(fs.existsSync(path.join(root, file)), `manifest points at a missing file: ${file}`);
  }
});

test('task pane loads scripts only from Microsoft and this site', () => {
  const srcs = [...taskpane.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
  for (const s of srcs) {
    const ok = s === 'https://appsforoffice.microsoft.com/lib/1/hosted/office.js' || !/^[a-z]+:|^\/\//i.test(s);
    assert.ok(ok, `script from an unexpected source: ${s}`);
  }
});

test('no HTML is built from email data', () => {
  for (const f of ['taskpane.html', 'chase.js']) {
    const src = read(f);
    for (const bad of ['innerHTML', 'outerHTML', 'insertAdjacentHTML', 'document.write', 'eval(', 'new Function']) {
      assert.ok(!src.includes(bad), `${f} uses ${bad}; use textContent instead`);
    }
  }
});

test('the only non-Microsoft address the add-in talks to is the local app', () => {
  const { APP } = require('../chase.js');
  assert.equal(APP, 'http://127.0.0.1:8773');
  const hosts = [...taskpane.matchAll(/https?:\/\/([^/'"\s]+)/g)].map((m) => m[1]);
  for (const h of hosts) assert.ok(h === 'appsforoffice.microsoft.com', `unexpected host in task pane: ${h}`);
});

test('no secrets committed', () => {
  const files = fs.readdirSync(root, { recursive: true })
    .filter((f) => !f.startsWith('.git') && /\.(html|js|xml|md|json)$/.test(f));
  const patterns = [/api[_-]?key\s*[:=]/i, /secret\s*[:=]/i, /password\s*[:=]/i, /BEGIN [A-Z ]*PRIVATE KEY/, /eyJ[A-Za-z0-9_-]{20,}\./];
  for (const f of files) {
    const src = read(f);
    for (const p of patterns) assert.ok(!p.test(src), `${f} matches ${p}`);
  }
});
