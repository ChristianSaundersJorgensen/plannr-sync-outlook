// Which address gets chased, and how the link is built.
const test = require('node:test');
const assert = require('node:assert/strict');
const { APP, pickChaseAddress, buildChaseUrl } = require('../chase.js');

const ME = 'me@firm.co.uk';

test('chases the sender of a received email', () => {
  assert.equal(pickChaseAddress('client@example.com', ME, [ME]), 'client@example.com');
});

test('chases the first recipient of an email you sent', () => {
  assert.equal(pickChaseAddress(ME, ME, ['client@example.com', 'other@example.com']), 'client@example.com');
});

test('matches your own address regardless of case and spaces', () => {
  assert.equal(pickChaseAddress(' Me@Firm.co.uk ', ME, ['client@example.com']), 'client@example.com');
});

test('skips yourself when you are also a recipient', () => {
  assert.equal(pickChaseAddress(ME, ME, [ME, 'client@example.com']), 'client@example.com');
});

test('never chases your own address', () => {
  assert.equal(pickChaseAddress(ME, ME, []), '');
  assert.equal(pickChaseAddress(ME, ME, [ME]), '');
});

test('handles missing sender and recipients', () => {
  assert.equal(pickChaseAddress('', ME, undefined), '');
  assert.equal(pickChaseAddress(undefined, '', null), '');
  assert.equal(pickChaseAddress(null, ME, [null, '', 'client@example.com']), 'client@example.com');
});

test('link points only at the local app', () => {
  const url = new URL(buildChaseUrl('client@example.com'));
  assert.equal(url.origin, new URL(APP).origin);
  assert.equal(url.hostname, '127.0.0.1');
  assert.equal(url.pathname, '/chase');
});

test('a hostile address cannot add parameters or change the target', () => {
  const nasty = 'a@b.com&delete=1#x/../../evil?y=<script>';
  const url = new URL(buildChaseUrl(nasty));
  assert.equal(url.hostname, '127.0.0.1');
  assert.equal(url.pathname, '/chase');
  assert.deepEqual([...url.searchParams.keys()], ['email']);
  assert.equal(url.searchParams.get('email'), nasty);
  assert.equal(url.hash, '');
});
