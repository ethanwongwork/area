> Historical snapshot from before the Codex migration. Its paths and next steps are not
> current instructions. See [the current handoff](../../.Codex/HANDOFF.md) and the
> [preserved proposal](../plans/proposed/contrast-policy.md).

# Handoff — 2026-09-14

**Branch** `main` · **Last commit** `8281d09` `docs: rewrite the README, and record what this session changed and why`
**State** Green, tree clean, pushed. 8,678 tests · axis integrity ok · manifest parity ok (36 components) · 172 contrast assertions + 4 documented waivers across 66 themes · 38 docs pages / 64 demos · components used 36/36 · dogfood audit clean · typecheck silent.

## Where things stand

Area is a design system tuned along eight axes. The colour system is the Stadium palette
vendored at `packages/tokens/src/color/palette.json` — 14 families × 23 rungs — with Area
owning hue (`HUE_ROTATION`) and, as of this session, one narrow chroma adjustment at the
light end (`CHROMA_TRIM`). Read `CLAUDE.md` before touching `packages/`; every invariant
there records the failure that produced it.

This session was the largest so far: it moved the repo to a new home, fixed a size-contract
bug that had been papered over at call sites, added four components, rebuilt the docs shell
around collapsible rails instead of a header, and imported Stadium's icon set.

**The repo moved.** `origin` is now `github.com/ethanwongwork/area` (private), default branch
`main`, all 37 prior commits plus this session's four. The old public
`visual-language-playground` repo is back to its single original commit — its `area` branch
was deleted. Work on `main` now; the `area` branch is gone locally and remotely.

## What happened this session

- **Red's hue rotation was reverted** at the user's request; `--area-red-500` is byte-identical
  to the export again. The `HUE_ROTATION` layer was kept — it is what the queued rotations need.
- **Green rotates +14 toward emerald.** Rung 500 lands at hue 160.9, `#00ab72`. This retired the
  documented claim that rotation is "close to free": it costs 0.043 of chroma and 0.009 of L
  here, verified by comparing against the unrotated family (which matches the export exactly).
  Green's waived code-block contrast moved 3.06 → 2.80 and `exceptions.ts` records the new number.
- **`CHROMA_TRIM` added** — lime 0.72, green 0.78, yellow 0.88, tapering from rung 200 to 400.
  At rung 150 the families ran 0.051–0.138 around a mean of 0.079; the spread now closes to
  0.054. Five tests bound it, verified to fail without it.
- **A size tier is now the outer height everywhere.** Segmented named its *item*, so every tier
  rendered one tier tall. Six components measured at 24/28/32/40/48 with zero mismatches.
- **Panel, Slider, Chip, `Field --inline`** added; `area-menu--row` added then removed when its
  only user went away. Manifest is 32 → 36 components.
- **The docs lost their header.** Wordmark moved into the nav's own bar; both rails are
  `area-panel --md --flush` and collapse to corner toggles, state persisted.
- **Stadium's 29 marks vendored** and an icon browser built over 1,739 icons from two sprites.
- **README rewritten** — it had drifted to documenting `data-area-accent`, four density presets
  and the old named radius ladder, none of which exist.

## In flight

Nothing — the tree is clean and pushed.

Not started, and still the most substantial open piece:
`~/.claude/plans/i-want-to-create-sequential-thompson.md` holds a researched plan for a
**contrast-policy axis** (`wcag` / `hybrid` / `apca`). The research is done and the numbers are
in the plan. Headline: rung 500 is already at each family's chroma peak, so the vibrancy ceiling
is the contrast gate, not the palette.

## Next

1. The remaining hue rotations from the plan (`orange: -11`, `yellow: +4`, `blue: -4`) are one
   line each now the layer exists — but measure each one's chroma cost rather than assuming it
   is free, which is the lesson green taught.
2. Ask whether to proceed with the contrast-policy axis. If yes, it is scoped to **three tones
   only** — warning, caution, success — and `shippedThemes()` must vary the new axis **one at a
   time**, not as a cross-product, or the theme count triples.
3. Offer a PR. Nothing has been opened; the user has not asked.

## Traps

- **`DOCS_CSS` and `DOCS_SCRIPT` are template literals.** A backtick inside one — including in a
  comment quoting a class name — ends the string, and Node reports a syntax error on whatever
  word follows. This cost four debugging rounds before `check-dogfood.mjs` grew a text-level
  guard that runs *before* importing the file, because a file with this fault cannot be imported.
- **Docs CSS loses to the component layer even when the selector names no `.area-` class.**
  `.docs-sidebar` is an `area-panel` and a corner toggle is an `area-button`; both set `display`
  in `area.components`, so a `display` rule in `area.base` is dead. The audit cannot catch this
  case. Use `@layer area.utilities`.
- **`display: none` removes a grid child entirely** rather than leaving an empty track, so
  auto-placement shifts. Name each shell child's `grid-column` explicitly.
- **`~` is a *following*-sibling combinator.** The corner toggles had to move after the shell.
- **Auto margins centre within the padding box**, so one-sided padding decentres visibly. The
  nav-closed clearance is symmetric for this reason.
- **A rotation's cost depends entirely on where the family sits in the gamut.** Measure against
  `palette.json`; do not assume the red figure generalises.
- **The contrast gate's waiver prose carries measured numbers.** Change a colour and those
  numbers go stale — which is documentation lying, and the invariant forbids it.
- **`packages/tokens/src/color/palette.json` is vendored.** Do not edit a hex.
- **`input.css:61` hard-codes the focus-ring recipe** rather than deriving it, so the
  invalid-input ring will not track a change to the ring formula.
- **iCloud duplicates.** Five `* 2.ts` files appeared in `packages/tokens/src/axes/` mid-session,
  byte-identical to their originals; deleted. The repo lives on Desktop, so expect more.

## Verify

```bash
npm test                                        # 8,678 passing
npm run build                                   # "axis integrity ok", "manifest parity ok  (36 components)"
npm run build:docs                              # 38 pages, 64 demos, 36/36 components used, no raw values
node packages/tokens/src/contrast/report.ts     # 0 failing, 172 passing, 4 waived across 66 themes
npm run typecheck                               # silent
npm run dev -w @area/docs                       # http://localhost:4321
```
