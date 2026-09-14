# Handoff — 2026-09-14

**Branch** `area` · **Last commit** `dbdbce4` `feat(color): Area owns hue; red rotates 4 degrees toward pink`
**State** Green. 8,673 tests, 172 contrast assertions + 4 documented waivers across 66 themes, axis integrity ok, manifest parity ok (32 components), dogfood audit clean, 35 docs pages / 56 demos.

## Where things stand

Area is a design system tuned along eight axes, built from scratch in this branch to replace
the old `index.html` playground (preserved at `c35ac15`). The colour system is the Stadium
palette vendored at `packages/tokens/src/color/palette.json` — 14 families × 23 rungs — with
Area owning only hue on top of it. Read `CLAUDE.md` before touching `packages/`; it holds the
invariants and each one records the failure that produced it.

The last several sessions have been visual refinement against OpenAI/ChatGPT and Vercel
references: tone vocabulary, radius, strokes, token badges, docs chrome.

## What happened this session

- **Tones renamed** to `primary` (neutral, and now the *default* tone) and `brand` (the hue,
  opt-in). `secondary` was rejected deliberately — it would have named the hue, which is the
  louder of the two. Axis is `data-area-brand`, tokens `--area-brand-*`.
- **Token badges unified.** One badge at `0.875em` — a ratio, not a step, because it must sit
  in 14px table chrome *and* 16px prose. Inline code is the same badge without a swatch.
  Shipped as a React `Token` with its own docs page.
- **Tonal strokes are computed per family** (`quietestStroke` in `scale.ts`). A shared rung
  gave indigo 3.68:1 and green 1.80:1 — one token, twice the weight. Now all eleven land
  between 1.30 and 1.45.
- **Radius capped against its box** via `--area-radius-cap` (0.4; 0.5 at pill), after presets
  10/12/pill all painted the same pill on a compact xs control.
- **Hue rotation layer added.** `HUE_ROTATION` in `curves.ts`; red is −4° toward pink. Costs
  at most 0.0003 chroma and the gate passed unchanged.
- **Docs chrome** now derives its spacing from the density axis (`--docs-pad`, `--docs-gutter`),
  wordmark is "aerea" in mono lowercase, page is white, code blocks have no toolbar.

## In flight

Nothing uncommitted except this checkpoint system itself. But one substantial piece of work is
**planned and not started**:

`~/.claude/plans/i-want-to-create-sequential-thompson.md` holds a researched plan for a
**contrast-policy axis** (`wcag` / `hybrid` / `apca`) plus the remaining hue rotations. The
research is done and the numbers are in the plan. The headline finding: rung 500 is *already*
at each family's chroma peak, so the vibrancy ceiling is the contrast gate, not the palette.
OpenAI's vivid warm buttons measure 3.0–3.8:1 with white text — they would fail Area's WCAG
gate while passing APCA at Lc 62–70.

The user last asked for red to be pinker, which is done. The plan's other rotations
(`orange: -11`, `yellow: +4`, `blue: -4`) are one line each in `HUE_ROTATION` now that the
layer exists. Green and purple need nothing — they are within 2° of the reference.

## Next

1. Ask whether to proceed with the contrast-policy axis from the plan, or just apply the
   remaining hue rotations.
2. If the axis: it is scoped to **three tones only** — warning, caution, success. The others
   measure 0–1% apart under either policy, and brand's solid is owned by the brand axis so a
   contrast axis must not also write it. `shippedThemes()` must vary the new axis **one at a
   time**, not as a cross-product, or the theme count triples.

## Traps

- **`packages/tokens/src/color/palette.json` is vendored.** Stadium owns lightness and chroma;
  Area owns hue only, through `HUE_ROTATION`. Do not edit a hex.
- **Manifest parity catches renames that greps miss.** The tone rename left `--accent`
  modifiers in `badge` and `nav` against already-renamed declarations. Trust the check.
- **The contrast gate has caught four real errors in my own colour walks**, every time by
  checking WCAG without APCA, or measuring against the wrong ground. When adding a walk, gate
  it on both standards and measure against the surface the thing actually renders on.
- **`--area-border-focus` is brand-derived**, so every focus ring in the library moves if brand
  changes.
- **`input.css:61` hard-codes the focus-ring recipe** rather than deriving it, so the
  invalid-input ring will not track a change to the ring formula.
- **Docs CSS must never target `.area-*`** — `DOCS_CSS` lives in `area.base`, which loses to
  `area.components`. The fix is always a documented variant.
- **`DOCS_CSS` is a JS template literal.** A backtick in a CSS comment there ends the string.

## Verify

```bash
npm test                                        # 8,673 passing
npm run build                                   # "axis integrity ok", "manifest parity ok  (32 components)"
npm run build:docs                              # 35 pages, 56 demos, no raw values, no inline literals
node packages/tokens/src/contrast/report.ts     # 0 failing, 172 passing, 4 waived
npm run typecheck                               # silent
npm run dev -w @area/docs                       # http://localhost:4321
```
