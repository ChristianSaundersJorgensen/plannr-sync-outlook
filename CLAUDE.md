# Plannr Sync for Outlook

Outlook add-in, served live from `main` by GitHub Pages: a push to `main` is a
release to every Outlook that has it installed. Work on a branch.

- Logic lives in `chase.js`; `taskpane.html` only wires it to Office.js.
- Run `node --test` after changes. A hook does this automatically after edits.
- Use the `security-reviewer` agent before pushing changes to `manifest.xml`,
  `taskpane.html` or `chase.js`.
- Don't widen `<Permissions>` beyond `ReadItem`, add scripts from new places,
  or send the email address anywhere except the local app.
- A change to `manifest.xml` needs `<Version>` bumped.
