# Handoff — 2026-09-14

**Branch** `main` · **Last implementation commit** `8530721`
`chore: migrate project guidance to Codex and archive legacy tooling`
**State** Verification green; migration complete. This handoff is committed in the
following checkpoint commit. Confirm the current push state with `git status -sb`.

## Where things stand

Area remains the same eight-axis token/CSS/React system and 38-page static docs site.
The repository is now oriented around [AGENTS.md](../AGENTS.md), with detailed design
rules and architecture under `docs/`. GitHub origin is the canonical repository.

## What happened this session

- Condensed the previously duplicated agent instructions into an orientation guide.
  Preserved detailed rationale in `docs/DESIGN_SYSTEM.md`, correcting stale claims.
- Migrated the journal here, retained the Codex checkpoint skill, and removed redundant
  Claude launch/instruction files and an inert Cursor hook for nonexistent ds-builder paths.
- Archived the old playground, its Figma scripts, Cursor rules and Composer prompt under
  `archive/playground/`, preserving all seven files byte-for-byte.
- Removed the unreferenced handwritten Button demo script; real component demos cover it.
- Fixed the icon generator's machine-specific paths; output remained byte-identical.
  Updated Node compatibility metadata without changing dependencies.
- Corrected docs introduction radius defaults and explained that contrast tests run
  separately from the build. No component CSS, tokens or public API were changed.
- Preserved the prior external contrast-policy proposal in `docs/plans/proposed/`,
  clearly labeled historical and unapproved. Do not automatically execute its next steps.

## In flight

No unfinished implementation. The preview uses the existing server at
http://localhost:4321; the dev server builds once and does not watch files.
Full migration evidence and validation are in [docs/MIGRATION.md](../docs/MIGRATION.md).

## Next

1. Continue from the user's next requested product change; no redesign is queued.
2. If package publishing/root imports are needed, decide the intended token package API:
   its root export currently points to nonexistent `src/index.ts` (pre-existing).
3. Revisit the contrast-policy proposal only with an explicit scope decision and fresh
   measurements. No ninth axis was implemented.

## Traps

- Actual Button tone props are `primary` and `brand`; older prose called these neutral
  and accent. Do not rename the API based on a historical document.
- `npm run build` does not run tests. Run `npm test` separately for the contrast gate.
- Four contrast waivers remain; they are recorded exceptions, not migration failures.
- Node 20 is insufficient. See package.json engines; this session used Node 26.7.0.
- Docs CSS layering, nested custom-property substitution, icon generation and template
  literal backticks remain critical: read `docs/DESIGN_SYSTEM.md` before editing.
- Legacy archive instructions are historical and must not govern active Area code.
- `.Codex/` and `.agents/` may need filesystem approval for writes in Codex's sandbox.

## Verify

```sh
npm test                                      # 8,678 tests, 6 files
npm run build                                 # axis integrity; 36-component parity
npm run lint:manifest                         # 36 components
npm run build:docs                            # 38 pages, 64 demos; 36/36 used; audit clean
node packages/tokens/src/contrast/report.ts    # 0 failing, 172 passing, 4 waived; 66 themes
npm run typecheck                             # all three packages pass
npm run dev                                   # http://localhost:4321
```

Additional checks this session: 3,545 local site references resolved; all seven archived
files matched Git bytes; icon regeneration from /tmp produced no diffs. Browser verified
Button and Iconography pages, inspector visibility, theme switching and compact density.
No baseline test/build/typecheck/lint failure was found. Known limitations are recorded
in [docs/MAINTENANCE.md](../docs/MAINTENANCE.md).
