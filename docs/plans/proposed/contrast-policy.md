# Status: historical proposal, not approved for implementation

Imported on 2026-09-14 from the plan referenced by the previous handoff.
This is a research snapshot, not current instructions. Area still has eight axes.
Green now rotates +14; red is unrotated; component light surfaces remain at rung 50.
Re-measure all figures and confirm the desired accessibility policy before implementing.
References to CLAUDE.md below describe the original proposal; current rules are in
[DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md).

---

# Tonal vibrancy: a contrast-policy axis, Area-owned hue, and warmer surfaces

## Context

The tonal colours read flat next to ChatGPT's. The instinct was that rung 500 needs more
chroma — but measured, **500 is already at or near each family's chroma peak** (red 100%,
blue 100%, indigo 100%, purple 99%, pink 99%). There is no headroom to take.

The gap is somewhere else entirely, and the audit found three separate causes:

1. **Tonal foregrounds sit at rung 650**, not 500. Badge text, and the label on every soft /
   outline / ghost button. Moving toward 500 is worth **+34% chroma**.
2. **Tonal surfaces sit at rung 50** — chroma 0.006–0.016, effectively colourless. ChatGPT's
   chips are visibly tinted.
3. **Solid fills are already maximal for a 4.5:1 label.** brand, info, danger, discovery and
   caution have literally 0% headroom. The reason ChatGPT's yellow/orange/green buttons look
   vivid is not their palette — it is that **they measure 3.0–3.8:1 with white text and would
   fail Area's WCAG gate**, while passing APCA at Lc 62–70.

That last point is the whole story, so the fix is to make the trade a *choice* rather than a
verdict: a new contrast axis. Plus Area takes ownership of hue, which Stadium's export does
not tune the way the reference does.

## What the measurements say

**Solid fills, today vs an APCA-governed label:**

| tone | today | APCA-led | chroma |
|---|---|---|---|
| warning | `#fe9c51` rung 300, **black** | `#ea7401` rung 500, white | **+18%** |
| caution | `#fbb902` rung 350, **black** | `#bf8c02` rung 500, white | −19%, but a true gold |
| success | `#01823a` rung 600, white | `#01aa4e` rung 500, white | **+22%** |
| danger / info / brand / discovery | rung 500 | rung 450–500 | **0–1% — no change** |

Only three tones move. Everything else is already at its ceiling.

**A single consistent foreground rung** (the stated preference), on a rung-75 surface:

| rung | WCAG pass | APCA pass | % of peak chroma (min–max) |
|---|---|---|---|
| 500 | 0/7 | 4/7 | 74–100% |
| 550 | 4/7 | 4/7 | 67–94% |
| 600 | 4/7 | **7/7** | 62–87% |
| 650 (today) | **7/7** | 7/7 | 55–91% |

So under WCAG, **650 is the only consistent rung that works** — no change is available. Under
APCA, 600 works for all seven. (For reference: rung 400 is the objectively most-uniformly-
chromatic rung at 86% of peak worst-case, but it is far too light to be text.)

## Decision 1 — a contrast axis

New `CONTRAST_AXIS`, three presets, scoped to the only tokens that actually differ:

| preset | warm solids | tonal foregrounds |
|---|---|---|
| `wcag` | light fill, black label (today) | 650 |
| `hybrid` **(default)** | APCA-led, white label | 650 — still WCAG-safe |
| `apca` | APCA-led, white label | 600 |

**It owns 12 tokens and no more:** `--area-{warning,caution,success}-solid`, `-solid-hover`,
`--area-fg-on-{tone}`, `--area-fg-{tone}`. The theme axis stops emitting those.

Scoping it to three tones is what keeps axis disjointness intact. danger, info, discovery and
brand measure 0–1% different under either policy, so there is nothing to switch — and brand's
solid is owned by the brand axis, which a contrast axis must not also write.

Theme dependence (`solid-hover` differs per theme) is carried by the preset's existing
`darkTokens` field, as the neutral and brand axes already do.

## Decision 2 — Area owns hue, Stadium owns L and C

A documented per-family hue rotation applied where `palette.json` loads, in
`packages/tokens/src/color/scale.ts`. Stadium keeps its wall-anchored lightness and chroma;
Area tunes only hue. **This rewrites a CLAUDE.md invariant** ("do not fix a hex here") — the
replacement should say Area owns hue and the export owns everything else.

**Do not copy the reference's offsets verbatim.** Measured, they would move red +10° and
orange −11°, compressing red→orange from 35° to **14°** — far under the ~30° that keeps danger
and warning from reading as one signal, which is a failure mode `color/presets.ts` already
documents. Rotate them *apart* instead:

| family | rotation | effect | why |
|---|---|---|---|
| red | **−6°** | toward crimson / rose | reference says +10°; inverted to preserve separation |
| orange | −11° | toward terracotta — reads as "peach" | matches reference |
| yellow | +4° | golder | matches reference |
| blue | −4° | more azure | matches reference |
| green, purple | **0°** | — | already within 2° of the reference; the perceived blue-ness is not in the hue |
| lime, teal, cyan, indigo, pink | 0° | — | no reference, and rotating them disturbs spacing |

Red→orange lands at 30°, equal to today's orange→yellow gap. Every other adjacent pair stays
within 1–2° of where it is.

**Rotation at constant L and C still moves WCAG relative luminance**, so the gate will shift.
Re-run it and fix fallout by moving rungs, never by lowering a threshold.

## Decision 3 — surface tint

`INVERSION.component` light 50 → **75** (`packages/tokens/src/color/curves.ts`), roughly
1.5–2× the tint. This is what `{tone}-surface` resolves to, so it moves every badge fill, soft
button, alert ground and nav current-item at once.

Icon-only vivid fills: **not in scope** (decided).

## Files

- `packages/tokens/src/color/scale.ts` — hue rotation at load; `HUE_ROTATION` table
- `packages/tokens/src/color/curves.ts` — `INVERSION.component` → 75
- `packages/tokens/src/axes/contrast.ts` — **new**, the three presets
- `packages/tokens/src/axes/registry.ts`, `emit/css.ts` — register the axis
- `packages/tokens/src/axes/color.ts` — theme axis gives up the 12 contrast-owned tokens
- `packages/tokens/src/contrast/assertions.ts` — assertions become policy-aware
- `packages/tokens/src/semantic/resolve.ts` — selection gains `contrast`; `shippedThemes()`
  must vary it **one axis at a time**, not as a cross-product, or the theme count triples
- `apps/docs/scripts/build.mjs` — contrast picker in the axis panel; Color page section
- `CLAUDE.md` — rewrite the vendored-palette invariant; document the contrast axis

Reuse what exists: `chooseSolid` / `chooseVivid` in `scale.ts` already walk a ladder against a
bar — parameterise the bar rather than writing a second walk. `AxisPreset.darkTokens` already
carries per-theme values. `contrast/exceptions.ts` already records waivers with measured
numbers, and the `wcag` preset needs none.

## Verification

```
npm test -w @area/tokens            # gate must pass for every contrast preset
node packages/tokens/src/contrast/report.ts   # 0 failing; waivers listed separately
npm run build                       # axis integrity — proves the 12 tokens are disjoint
npm run lint:manifest -w @area/styles
npm run build:docs                  # dogfood audit
```

Then in the browser at `http://localhost:4321`:

- Flip the contrast axis across all three presets on the Button and Badge pages. `wcag` must
  show black labels on light warm fills; `hybrid` and `apca` white labels on mid fills.
- Confirm hue separation by eye on the Button "Tones" example — danger and warning must still
  read as two different signals.
- Check the Color page ramps in both themes, and that badge chips read as tinted rather than
  grey.

Two specific regressions to watch, both from the audit:

- `--area-border-focus` is brand-derived, so **every focus ring in the library** moves if brand
  changes. Brand is indigo and rotates 0°, so it should not — verify it does not.
- `input.css:61` hard-codes the focus-ring recipe rather than deriving it, so the invalid-input
  ring will not track any change automatically.
