# Plannr Sync for Outlook

A personal Outlook add-in (new Outlook / Outlook on the web). On a read email,
**Chase in Plannr** opens a small pane showing the sender's address, with a link to
`http://127.0.0.1:8773/chase?email=<sender>`: the owner's Plannr Sync PC app, which
finds that client in Plannr and opens "Chase documents". Nothing changes in Plannr
until the edit is reviewed and pushed in the app.

The add-in reads only the sender's address (or, for an email you sent, the first
recipient's). It holds no data and calls nothing but Microsoft's Office.js.

Hosted on GitHub Pages, because Outlook only loads add-ins over https:
https://christiansaundersjorgensen.github.io/plannr-sync-outlook/

## Install (once)

New Outlook → Apps (or Get add-ins) → My add-ins → Custom add-ins →
Add a custom add-in → Add from URL →
`https://christiansaundersjorgensen.github.io/plannr-sync-outlook/manifest.xml`

## Changing it

Edit, commit and push; Pages republishes in a minute. A change to `manifest.xml`
(buttons, icons, URLs) also needs `<Version>` bumped and the add-in removed and
added again in Outlook. If Plannr Sync's port ever changes, change `APP` in
`chase.js`.

## Tests

`node --test tests/` (Node 22 or later, no packages needed). The tests check
which address gets chased, that the link is built safely, and that the
manifest and pages haven't drifted into riskier settings (wider mailbox
permissions, scripts from new places, non-https URLs).
