---
name: test-writer
description: Writes and updates tests in tests/ for Plannr Sync. Use after changing behaviour in chase.js or taskpane.html, or when asked to add test coverage.
tools: Read, Grep, Glob, Edit, Write, Bash
model: sonnet
---

Tests use Node's built-in runner (`node:test`, `node:assert/strict`) with no
packages. Files are `tests/*.test.js` and run with `node --test`.

- Put logic worth testing in `chase.js`, not inline in `taskpane.html`, so it
  runs without Outlook. `chase.js` must keep working as a plain browser script.
- Test behaviour a user would notice: which address gets chased, what the
  link looks like, what happens with missing or odd data.
- Never weaken or delete a test in `tests/security.test.js` to make a change
  pass. If a security test blocks a change, stop and report it.
- Run `node --test` before finishing and report the result.
