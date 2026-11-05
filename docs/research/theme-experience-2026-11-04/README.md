# Theme experience: every question, in chat and in the feed (2026-11-04)

Owner: "create a theme experience artifact to show every possible question shown in sequence in the feed or in chat?
… maybe it should be in the feed and be dedicated? or maybe it should be smaller in the chat? and the canvas feed page
section should show visuals."

Artifact: Theme Setup Flow (link in the handoff). `entry.tsx` draws Setup's 41 questions
(`apps/desktop/src/pages/setup-questions.ts`, 11 chapters) with Area's real components; `build.mjs <tree> <out.html>`
bundles it with that tree's packages, Workspace screen and CSS. First built against the `feed-chat-kits-refinement-a31e9c`
worktree; rebuilt on main after PR #203 (e18c91d1) with the question frames at true size (PRODUCT_UI rule 26).

Drawn as the kits draw a visual question (owner: "the theme experience questions are not styled at all like the feed and
chat kit latest"): question-kit.tsx's frame (Asset card overlay; Before, Light / Dark, Zoom, Full screen) at true size on
the part each question changes, Approval's plain rows with "Default" a muted word, the run's pager and close, bars,
swatches and chips with Use default / Continue; the kits' page bar, the app's look on the page root (build's
`[snapshot.json]`, a kit capture). Question-kit's frame and helpers are copied into entry.tsx without the Studio: keep them
in step with it.

- **Chat**: the kit's chat at Panel 268 / Split 456 / Column 768; a chapter opened in a line, each question a frame over
  the Approval, the answer a reply bubble (press it to ask again). All open, or one by one.
- **Feed**: the kit's feed at Least 424 / Typical 904 / Most 1440, a section per chapter; from 880 the frame sits beside
  its question (the kit's beside rule).
- **Paths**: Essentials (13), As answered (only what the answers so far make relevant), All (41).
- Answers carry forward: every later frame is drawn in the answers so far. The accent's questions draw buttons and
  selection in the accent and open on the primary button.

Not built into the app; nothing in `apps/` changed. Hover previews and motion stages were not checked by hand (the
browser pane was hidden; screenshots taken in a hidden Electron window).
