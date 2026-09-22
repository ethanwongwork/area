# Area colour: dark-end chroma audit and proposal

2026-09-18. Measured from `packages/tokens/src/color/palette.json` and `curves.ts` at repo
commit `7cb043d`, and from OpenAI's `apps-sdk-ui` `variables-primitive.css` at `0f00143`.
All values OKLCH; gamut boundary found by bisection in linear sRGB and Display P3.
`proposal.json` holds every proposed rung (L, C, H, hex) beside the current one.

## 1. What is actually happening

**The dark rungs are already at the sRGB boundary.** From rung 500 to 950, shipped chroma
divided by the maximum sRGB chroma at that rung's own lightness and hue is 1.00 for red,
orange, yellow, lime, green, teal, cyan, blue and pink. Only indigo (0.73 to 0.88 at 550 to
650) and purple (0.78 to 0.91 at 500 to 600) had room, which is why `DARK_CHROMA_LIFT`
visibly changed only those two.

So a larger multiplier cannot work. A 1.24 lift on red and green at 700 to 850 is a no-op:
`scale.ts` caps the result at `maxChromaAt(L, hue)`, and those rungs are already there.
The dark rungs "lose chroma progressively" because the gamut narrows as lightness falls,
not because the palette is holding back.

**Three things set how much chroma a dark rung can have: its lightness, its hue, and the
gamut.** That is where OpenAI differs.

| Rung | Area mean L | OpenAI mean L | Difference |
| --- | --- | --- | --- |
| 500 | 0.625 | 0.617 | -0.008 |
| 600 | 0.518 | 0.535 | +0.017 |
| 700 | 0.410 | 0.453 | +0.044 |
| 800 | 0.305 | 0.376 | +0.070 |
| 900 | 0.210 | 0.299 | +0.090 |

OpenAI's dark rungs are simply lighter, and below the cusp available chroma scales almost
linearly with lightness: +0.04 L buys +9% at 700, +13% at 800, +19% at 900, for every hue.

**OpenAI evens the dark end by holding the strong hues back.** At their 800, green, yellow
and blue sit at the boundary (1.00) while red is at 0.84, purple 0.67 and pink 0.61. Result:
their seven families span 1.3x from least to most chromatic at every dark rung. Area spans
3.2x (teal 0.056 to indigo 0.177 at 800), and the existing lift widened it, because it
only raised the two families that were already the most chromatic. Part of OpenAI's
evenness is also that they ship no teal, cyan or lime, the three hues with the least dark
gamut. On their seven families Area is 2.4x at 800.

**Green is a hue problem.** `HUE_ROTATION.green = 14` moves green from 150 to 164, and the
sRGB boundary at 164 is 23% lower than at 150 at every rung from 400 to 800. OpenAI's
current green is hue 148 to 150 from rung 400 to 900 (`#00a240` at 500), not the 164 the
comment in `curves.ts` was fitted to. Area's unrotated green is already OpenAI's hue. The
green in the Codex diff badge is their green-500; their red there is red-400 (`#fa423e`).
Area's green-500 is C 0.137; theirs is 0.180. Area's red-500 (C 0.234) is already more
chromatic than theirs (0.213).

## 2. Proposal

Four changes, all expressed through `curves.ts`, none editing a hex. Applied to the eleven
chromatic families only; `neutral`, `cool` and `warm` are untouched, so page and surface
grounds do not move.

**A. `DARK_LIGHTNESS_LIFT` (new).** Added to L, per rung, tapering to nothing at both ends
so 550 and below and the 975 endpoint keep their exported values. This goes about
two-thirds of the way to OpenAI's ladder.

| 600 | 650 | 700 | 750 | 800 | 850 | 900 | 925 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| +0.010 | +0.020 | +0.035 | +0.045 | +0.055 | +0.060 | +0.055 | +0.045 | +0.030 |

**B. Replace the multiplier with "take the boundary".** From 600 down, chroma is
`maxChromaAt(L', hue)`, still capped by the family's peak. This is what the 1.16 lift
already resolves to for nine families; stating it directly removes a constant that implies
a lever that does not exist.

**C. `DARK_CHROMA_CAP` (new), for evenness.** Chroma may not exceed `k * L'`:

| 650 | 700 | 750 | 800 to 950 |
| --- | --- | --- | --- |
| 0.52 | 0.46 | 0.42 | 0.40 |

Only indigo and purple are touched by it (indigo 800: 0.177 to 0.138; purple 0.159 to
0.139). Everything else is below the cap and keeps its full boundary chroma. This is
OpenAI's mechanism in one line.

**D. `HUE_ROTATION.green`: 14 to 0.** Green-500 goes `#01a777` to `#02aa4e`; chroma at 800
goes 0.066 to 0.101. Green to lime returns to 22 degrees and green to teal to 33. If the
emerald cast matters more than the chroma, +4 keeps most of the gain (8% lost rather
than 23%).

### Result

| Rung | Mean chroma | Highest : lowest, 11 families | Same 7 families as OpenAI | OpenAI |
| --- | --- | --- | --- | --- |
| 700 | 0.133 to 0.138 | 3.1x to 2.4x | 2.3x to 2.0x | 1.3x |
| 800 | 0.100 to 0.109 (+9%) | 3.2x to 2.2x | 2.4x to 1.8x | 1.3x |
| 900 | 0.069 to 0.080 (+16%) | 3.2x to 2.2x | 2.5x to 1.9x | 1.3x |

Per family at 800: red 0.117 to 0.139, orange 0.083 to 0.097, yellow 0.066 to 0.077, lime
0.082 to 0.096, green 0.066 to 0.101, teal 0.056 to 0.066, cyan 0.059 to 0.070, blue 0.110
to 0.131, pink 0.121 to 0.141, indigo 0.177 to 0.138, purple 0.159 to 0.139. Every family
gains 15 to 50% except the two that were out of line, which come down to meet red, blue
and pink.

### Contrast, checked

- Light theme tonal text (650) on white: lowest is teal 6.07 to 5.53; all stay above 4.5.
  Strong tonal text (750): lowest teal 10.06 to 8.26.
- Dark theme tonal text (150) on fills 800 / 750 / 700: lowest is yellow on 700 at 6.10 to
  5.26; all stay above 4.5.
- Green's walls after removing the rotation: 500 on white 3.09 to 3.06 (the 3:1 glyph wall
  holds with less margin), 600 4.96 to 4.75.
- Not run: `npm test`, `contrast/report.ts`, the APCA dark floors, the stroke-balance
  tests, and the scale tests that pin L. Several of those assert that L never moves and
  will need their bounds restated, which is the point of the change.

## 3. The invariant this breaks, and the alternative that does not

`DESIGN_SYSTEM.md` says the palette's lightness anchors are never touched. Change A touches
them, for chromatic rungs 600 to 950, by an explicit bounded table, in the same spirit as
`CHROMA_TRIM`. The 500 wall and everything lighter is untouched, and neutrals are untouched.

If that invariant should stand, the same visual result is available in the semantic layer:
re-point the dark theme's **tonal** slots one rung lighter than the neutral ones
(`component` 800 to 750, `componentHover` 750 to 700, `componentActive` 700 to 650, tonal
borders likewise), as `tonalBorder` already does for strokes. That buys about +18% chroma
on dark tinted surfaces with no palette change, but does nothing for evenness and nothing
for light-theme dark text. Changes C and D are independent of this choice and worth doing
either way.

## 4. Other suggestions

- **Ship a P3 layer.** Under `@media (color-gamut: p3)` emit `oklch()` with chroma taken to
  the P3 boundary. Dark-rung headroom over sRGB: green +37%, teal +35%, cyan +32%, blue
  +26%, lime +17%, yellow +15%, orange +14%, red and pink +13%, indigo +1%, purple +4%.
  That is the largest gain available, it lands exactly on the families that are weakest,
  it needs no lightness change, and it improves evenness on its own. Every Mac and iPhone
  you would view this on is P3.
- **Even the 975 endpoint.** Red, yellow and green sit at 0.47, 0.40 and 0.52 of their
  boundary at 975 while the other eight are at 1.00. Either bring those three up or the
  eight down; near-black tints currently differ in how coloured they look.
- **Smooth indigo's mid rungs.** Indigo dips at 600 (C 0.218 between 0.228 and 0.233) and
  holds peak chroma down to 700 while every other family peaks at 450 to 500 and falls.
  B and C fix this as a side effect.
- **Orange could drift toward 45 below rung 700** for about +12% dark chroma (OpenAI's
  orange is hue 42). Not applied: it takes red to orange from 34 degrees toward 27 in the
  dark rungs. Worth a look only if dark orange reads as brown.
- **Do not rotate blue.** +6 degrees would add 77% dark chroma because it lands on the
  sRGB blue primary, but blue to indigo is already only 17 degrees.
- **Light end:** no change needed. `CHROMA_TRIM` already evens it, and rungs 25 to 550 are
  identical in the proposal (green excepted, because of D).

## 5. Prompt for Codex (Astra Low)

```
Read docs/DESIGN_SYSTEM.md "Colour" and the proposal in <path>/COLOR-PROPOSAL.md with
<path>/proposal.json. Do not edit palette.json.

1. Verify the audit first: for every chromatic family and rung 500 to 950, print shipped
   C divided by maxChromaAt(L, hue, SRGB). Confirm or correct the claim that nine families
   are at 1.00. Stop and show me.
2. Then implement changes A to D in curves.ts and scale.ts as bounded, documented tables
   alongside CHROMA_TRIM: DARK_LIGHTNESS_LIFT, the boundary rule replacing the 1.16
   multiplier, DARK_CHROMA_CAP, and HUE_ROTATION.green = 0. Chromatic families only.
3. Run npm test and node packages/tokens/src/contrast/report.ts. For every failure, say
   whether the assertion encodes the old invariant (restate its bound and explain) or is a
   real regression (fix the table, not the test).
4. Diff my proposal.json against what the build emits; differences above 0.003 in L or C
   mean one of us has a bug, so report them rather than picking one.
5. Add a palette page view that shows current and proposed side by side in both themes.
No component CSS changes.
```
