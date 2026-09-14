# Handoff — 2026-09-14

**Branch** `main` · **Previous checkpoint** `15f8c99` (Codex migration).
**State** Naming and divider changes verified and saved with this handoff. Push is pending:
automatic approval review rejected `git push origin main` without explicit authorization.
No remote update was made. Read `git log -3 --oneline` and `git status -sb` for current commits.

## Where things stand

Area remains the eight-axis token/CSS/React design system with a 38-page static docs site.
[AGENTS.md](../AGENTS.md) is the concise entrypoint; detailed rules are under `docs/`.
The migration was committed as `8530721`, followed by checkpoint `15f8c99`.
The user's subsequent request made Area the sole current name and lightened decorative strokes.

## What happened this session

- Migrated useful agent knowledge into repository docs and retained the Codex checkpoint
  skill. Archived the old playground and Figma tooling; removed redundant instructions,
  disconnected preview hooks, and a redundant handwritten Button demo script.
- Made icon generation independent of the checkout path; corrected Node engine metadata
  and stale documentation about radius defaults, tone names and verification commands.
- Renamed current custom icon assets to `area-icons` / `area-icons-filled`, their catalog
  source to `area`, sprite IDs to `area-*`, and palette identifying metadata to Area.
  Current docs and comments use Area. Palette colors and icon geometry are unchanged.
- Moved historical journal, handoff and research into `archive/history/` and `archive/plans/`.
  Fluent's literal glyph names are upstream vocabulary, not project aliases.
- Added `--area-border-decorative`: neutral 50 (#f7f7f7) in light, neutral 800 (#282828)
  in dark. Panels, cards, code containers, tables, nav/menu dividers and docs framing
  use it. Control outlines, selected states, swatches and focus indicators retain their
  existing contrast tokens. No existing contrast threshold was lowered.

## In flight

No unfinished implementation. Explicit approval is needed before pushing the local commits
to GitHub origin/main; do not retry or bypass the rejected push without authorization.
The preview at http://localhost:4321 uses the existing static docs server.

## Next

1. Obtain explicit push authorization if the user wants the commits on GitHub.
2. Continue with the user's next requested change. No redesign is queued.
3. If publishing/root imports are needed, decide the token package's intended public API:
   its root export points to missing `src/index.ts` (pre-existing, documented).
4. The [contrast-policy proposal](../archive/plans/contrast-policy.md) is unapproved
   historical research. Do not automatically implement it or apply its old measurements.

## Traps

- `npm run build` does not run contrast tests. Run `npm test` separately.
- The dev server does not watch files; rebuild with `npm run build:docs` and refresh.
- Actual Button tone props are `primary` and `brand` for neutral/accent intent.
- Never apply decorative borders to controls that rely on a stroke to identify them.
- Preserve color values in `palette.json` and icon geometry; generate icon outputs.
- Historical archive instructions do not govern active Area code.
- `.Codex/` and `.agents/` writes may need sandbox approval.
- Four contrast waivers remain. See the maintenance guide for inherited limitations.

## Verify

```sh
npm test                                      # 8,876 passing tests, 6 files
npm run build                                 # axis integrity; 36-component parity
npm run lint:manifest                         # 36 components
npm run build:docs                            # 38 pages, 64 demos; 36/36 used; audit clean
node packages/tokens/src/contrast/report.ts    # 0 failing, 176 passing, 4 waived; 66 themes
npm run typecheck                             # all three packages pass
npm run dev                                   # http://localhost:4321
```

All checks above passed. 3,545 local site references, including SVG symbol targets, resolve.
Markdown file links resolve. Palette colors and both sprites' geometry match the pre-rename
versions. Browser checks cover the light border color, theme/density interaction, and Area
icon filtering (29 of 1,739) with Filled sprite references. No baseline test/build failures.

See [migration report](../docs/MIGRATION.md), [maintenance](../docs/MAINTENANCE.md), and
[journal](JOURNAL.md) for details and decisions.
