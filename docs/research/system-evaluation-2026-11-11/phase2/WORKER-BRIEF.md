# Common brief: Area system plan, build workers (read first)

Repo (a git worktree; work only here): /Users/ethanwong/Desktop/area/.claude/worktrees/design-system-audit-6f0eac
Read AGENTS.md first and follow it (scope, measure don't recall, keep every surface of a component aligned, checks by
change in docs/DEVELOPMENT.md, words per docs/WRITING.md). The plan you are building from:
docs/research/system-evaluation-2026-11-11/README.md (section 5 holds every item; search for your item id) and
plan.json (same, as data). The owner approved every recommendation on 2026-11-11. Evidence for an item is in the
reports beside the README, cited by finding id.

## Hard rules
- Several workers edit this one working tree at the same time. Touch ONLY the files your brief gives you. If you need
  a change in a file outside your list, do not make it: describe it in your final message for the conductor.
- NO git commits, branches, stash, checkout or reset. No pushes. Leave your changes in the working tree.
- Do not spawn subagents.
- Builds collide. Wrap every `npm run build…`, `npm ci` / `npm install` and any command that writes dist/ in the lock:
  L="/private/tmp/claude-501/-Users-ethanwong-Desktop-area--claude-worktrees-design-system-audit-6f0eac/76af9d58-c4d9-4456-ae0b-81f2ada27495/scratchpad/build.lock"; until mkdir "$L" 2>/dev/null; do sleep 5; done; <command>; rmdir "$L"
  (always rmdir, also on failure; if the lock is older than 15 minutes it is stale: remove it). Typecheck and node
  --test runs need no lock.
- Never launch the Area Electron app except with --capture (hidden, own session). Never kill a process you did not
  start: another session's Area window is open. Headless Microsoft Edge only with
  `--guest --disable-features=msImplicitSignin --user-data-dir=<fresh dir in the scratchpad>`. Free ports only (not
  4400, 4410, 4473). Stop every process you start. Any capture script you write has a hard time limit per shot and
  logs a line per shot.
- Scratch files go under the scratchpad folder above (your own subfolder), never in the repo. The scratchpad can be
  wiped when the session restarts: nothing you need to keep lives only there.
- Never name reference products or other design systems in code comments, docs rules, specs' current-state text or
  app copy; describe rules in Area's own terms (dated docs/research files may name them).
- Never weaken a test to make it pass. Report failures plainly.
- Do not edit apps/desktop/src/content/component-status.mjs: list in your final message every family whose look
  changed (slug and one plain reason), and the conductor records them as In review.
- Fix the rule, not the instance: where your item states a rule, add the test or lint that keeps it true.
- This repo sits in a folder synced by iCloud, which creates duplicate files named "X 2.ext" when many processes write
  at once. Before each build and before you finish, run:
  git ls-files --others --exclude-standard | grep -E " [0-9]+(\.[a-z.]+)?$"  and MOVE (never delete) any hit you did
  not mean to create into <scratchpad>/dup-copies/. Report how many you moved.
- Two checks guard rendered output and behaviour; read docs/DEVELOPMENT.md "Rendered checks" and
  tests/behaviour/README.md. When your change fixes a known failure or deliberately moves a snapshot value, update
  scripts/rendered/known-failures.json (`-- --reuse --prune-known`) or the snapshot in the same change, and say which
  values moved and why. An unexplained snapshot change is a defect. `gap("<item>")` marks in tests/behaviour are
  unmarked by the change that closes the gap.
- The manifest vocabulary lint (packages/styles/scripts/vocabulary.mjs) and the one-file-per-family test apply to
  anything you add. Prop JSDoc is app copy (the API tab shows it): plain, no history, no reference names.
- The API tab and Specs tab are generated; never hand-write a row.
- Owner decisions are final for this plan: the first option of every decision in plan.json is the pick.
- Several workers edit the same component CSS files at once, each on different properties. Make small exact edits;
  never rewrite a file from an earlier read; re-read the lines around an edit just before making it.

## Final message
What you changed (files), what you verified and how (commands and results), what failed or is unverified, any change
you need in files you did not own, and anything the owner must look at. Under 350 words.

## Phase 2 (shared parts, plan section B), 2026-11-13
- The owner took every recommendation on the Phase 1 page (2026-11-13): Phase 1 stands as built. Phase 1 is in the
  tree: read the values it set from the tokens and docs (gap-row, gap-section, inset-page, radius-step, bg-float,
  bg-plate, duration-quick, the shared hit target in inset.css), never from the plan's "today" text, which predates it.
- **Area is a customizable system with many independent axes, and every shared part you write must hold on all of
  them.** The owner's words: "a complex, customizable system with lots of different axes, focused on creating visually
  beautiful, yet technically sound UI." That means:
  - A shared recipe is written in tokens and derivations, never in literals tuned at the defaults. Read
    docs/THEMING.md and the registry (apps/desktop/src/gallery/controls.ts, packages/tokens/src/axes/) for the full
    list of settings before you write a rule: type 12–16, density (Compact / Default / Comfortable), Corner, light and
    dark, Layer contrast (light and dark separately), stroke width and the per-ground edges, elevation and the shadow
    controls, material, the selection settings (stroke, tint, indicator), the focus ring settings, fill steps, tone
    contrast and tone tint, the accent, motion speed, Regular weight, and any others the registry lists.
  - Keep axes disjoint: size, tone, emphasis, state, layout and composition stay independent; settings are never
    variants; variants set private properties and base rules consume them. A shared part exposes private `--_*`
    properties its families set; it never branches on a family's name.
  - Geometry is derived (border + shell padding + slot inset, borders counted once; whole pixels at every type and
    density; concentric corners from the container's corner and inset). If a value cannot be whole at some setting,
    say which and how it rounds.
  - Colour comes from semantic roles re-emitted at scope boundaries, so a part reads right on every ground (page,
    surface, float, plate, toned, solid) at Layer contrast 0 and at its maximum, in light and dark. Contrast floors
    are rules, not choices.
  - Verify across the axes, not only at the defaults. At the least: type 12, 13 and 16; each density; Corner 0, 10 and
    the maximum; light and dark; Layer contrast 0 and high; stroke 0 and its maximum where the part draws an edge.
    scripts/rendered and the cohesion tests can sweep settings: use them, extend them, and add the cohesion rule that
    pins your recipe so a later family cannot drift from it.
  - Beauty and soundness together: when the derived value and the optically right value differ at some setting,
    fix the derivation (or state an optical correction as a named, documented term in it), never a per-family nudge.
  - Do not add a setting, size, role or variant to make a recipe work unless your brief says so; propose it instead.
- A shared part lands in the shared layer (packages/styles/src/inset.css, a shared stylesheet, emit/base.ts or a
  shared React part, as docs/ARCHITECTURE.md directs), and each family in your list then consumes it; the family's own
  duplicate of the recipe is removed in the same change, and the spec's current-state text is edited in place.
- Checks you run yourself before finishing: typecheck, `npm test` (tokens), the styles cohesion and manifest lints,
  the React tests, and the rendered check for your families (under the lock). The conductor runs the full set after
  each wave.
- Keep a short running report in the repo at docs/research/system-evaluation-2026-11-11/phase2/<your key>.md (what is
  done, the values each recipe computes to, what is left), so a cut-off session can be resumed and the review page
  can be written from it.
