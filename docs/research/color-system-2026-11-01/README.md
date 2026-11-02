# Area's colour system: audit, research and proposals (2026-11-01)

Started from the data-visualisation work (`docs/research/data-views-2026-11-01/`, branch
`claude/table-data-viz-templates-3538ee`), where colour went round four times in one day: lighter pastels, then vibrant
riso-print colours "not completely dark or washed out", then Cursor's soft dashboard colours, then "maybe too muted, bring
back some pastel" with OpenAI's luminous gradients as the reference. Backgrounds stay white. This study asks why Area kept
having no answer, what other systems do, and what Area could change. **Research and a proposal only: no package, token or
`palette.json` change.**

Review page (current vs proposed in light and dark, with sliders and picks):
https://claude.ai/artifact/XNh7uSYHV7YmCqoATNM7s9 (picks in the `verdicts` collection: `p1`…`p7`, `p0`, and `tuning`).

## Owner decisions

- **2026-11-01: OpenAI's colours, not Cursor's.** "i dont like cursors colors, i like openais colors form the references i
  sent." The series proposal (2) is rebuilt on the hues sampled from those images; the Soft and Dusty tiers (3), which
  existed to reproduce Cursor's tones, are set aside for data colours.
- **2026-11-01: proposals picked.** On the review page: Build for 2, 4, 5, 6 and 7; Agree for 0 (palette.json stays) and 3
  (set aside). For 1, soft Surface, preview choice cards and Plan's steps stay flat at Layers 0 ("go with your rec"):
  they are soft regions on the recessed layer, as the 2026-10-29 Surface answer decided.

## Files

| File | What it does |
|---|---|
| `measure-ladder.ts` | Every family and rung as `scale.ts` builds it: OKLCH, the most chroma sRGB holds there ("room"), share of it, ΔE_OK to the next rung, hue drift from 500, WCAG on white and black, APCA on white. `--json` for data. |
| `measure-gaps.ts` | The data-vis gaps: reference colours (OpenAI, Cursor, round 11) against their nearest Area rung; step evenness; lightness spread at a rung; heat ramps mixed toward white. |
| `measure-layers.ts` | Every Layers token at a Layers position, light and dark, flagging roles equal to the page or to each other. |
| `sample-references.mjs` | Samples the owner's reference images at 16 × 9 and clusters by hue (OKLCH). |
| `prototype.ts` | The proposed model, computed beside the ladder: `colourAt(h, L, share)`, Soft and Dusty tiers, series pairs, walked heat ramps, in-between steps. `--json` feeds the page. |
| `validate-series.mjs` | Runs the dataviz skill's validator on current and proposed series and picks the proposed order. |
| `build-review.mjs`, `review.src.html` → `review.html` | Builds the review page. |

Run any of them with `node docs/research/color-system-2026-11-01/<file>` (Node 26 strips types; no build needed).

## Summary

1. **Area's ladder is one path along the edge of sRGB.** Nearly every chromatic rung from 100 to 950 uses 95–100% of the
   chroma sRGB can show at its lightness and hue (the exceptions: the trimmed light ends of yellow, lime, green and teal at
   81–90%, and purple's capped dark end at 73–77%). So the ladder has exactly one colour per lightness per hue, the most saturated
   one. Pastel (≤ 200) and vivid (≥ 350) are the same colours at different lightness, and nothing in Area is "less
   saturated at the same lightness" except brown (orange at about 35%) and the accent under Accent strength.
2. **That is why each data-vis round failed in a different way.** Luminous pastels (OpenAI) sit on Area's light rungs for
   blue, indigo, purple, pink and red (ΔE 0.3–4.3 × 100) but fall between rungs or hues elsewhere. Dusty tones (Cursor) have
   no home at all (ΔE 3.9–10.3 to the nearest rung). The 500s read dark because the label wall pins blue, indigo, purple,
   pink and red at L 0.57–0.59. Mixing toward white greys out the hues whose brightest colour is light.
3. **Area already has the right tool and only uses it for one colour.** Accent strength's mix (OKLab toward the grey of
   the colour's own luminance, `generate.ts` `withStrength`) holds hue and contrast. At 35% it lands every sampled Cursor and
   round 11 colour within ΔE 0.7–3.3 of a rung. (Set aside: the owner prefers OpenAI's colours.)
3b. **OpenAI's luminous colours are Area's own ladder at one lightness.** Fitted over nine samples, the best single
   setting is the gamut's edge (share 1.0) at L 0.79 with chroma capped at 0.13: sky, lilac and peach come out within
   ΔE 0.3–0.9 of the samples, mean 3.3. Area misses them today only because most hues have no rung at L 0.79.
4. **At Layers 0 (the default) seven background roles equal the page.** `bg-subtle` is one of them, and ten components
   paint it as a fill (Table's header among them), so those fills vanish in both modes. `bg-stripe` is 1.03:1. (Fixed
   for eight of them with a `bg-well` ground, 2026-11-01; see proposal 1.)
5. **Contrast is well guarded for what exists** (27,922 token tests pass) **but nothing gates data colours.** Meter's
   series needs labels in light (yellow 450 at 2.31:1 and pink 300 at 2.73:1 on white; orange and teal 500 sit at
   3.00–3.01), and its first four collapse for colour-blind readers when any
   two can touch (all-pairs ΔE 5.6 light, 1.6 dark).
6. **Proposals, ranked** (detail at the end): (1) a fill role that never vanishes; (2) series colours from OpenAI's
   palette: luminous colours at L 0.79 with a same-hue 3:1 edge on white; (4) ramps that walk the hue; (5) a continuous
   placement function for in-between steps; (6) data-colour gates in the tests; (7) P3 luminous colours. Set aside: (3)
   Soft and Dusty tiers (owner). Not proposed: re-spacing `palette.json`.

## 1. How the ladder is built (measured)

`palette.json` (exported 2026-09-13) is a table: 15 families × 23 rungs (25, 50, 75, 100, 150 … 900, 925, 950, 975), hex
and OKLCH. `scale.ts` reads it and applies bounded refinements (`curves.ts`): a light-end chroma trim for lime (0.72), green
(0.78) and yellow (0.88), tapering from 200 to 400; a dark-end lightness lift (600–950, up to +0.06 at 850) and a chroma cap
(`DARK_CHROMA_CAP`, a fraction of L) that matters only for indigo and purple. Everything else is solved by measurement: the
solid (walk from peak chroma until the label clears 4.6:1 and APCA 61), the tonal ink/surface pair, vivid text, quiet
strokes and alpha twins. Custom hues interpolate the two neighbouring families' ladders by hue (`generate.ts`).

`measure-ladder.ts` output, condensed (light build; the dark build paints the same hexes, it picks other rungs):

| Family | Peak rung (C) | L at 200 / 300 / 400 / 500 | Share 100–950 | Hue drift (non-grey rungs) |
|---|---|---|---|---|
| red | 450 (0.235) | 0.832 / 0.700 / 0.655 / 0.592 | 0.94–1.00 | ≤ 2.4° |
| orange | 400 (0.184) | 0.874 / 0.780 / 0.734 / 0.684 | 0.96–1.00 | +5° at 75–250 |
| yellow | 400 (0.165) | 0.878 / 0.844 / 0.805 / 0.672 | 0.86–1.00 | −20° at 925–950 |
| teal | 300 (0.157) | 0.920 / 0.885 / 0.803 / 0.654 | 0.81–1.00 | ≤ 0.4° |
| blue | 450 (0.221) | 0.817 / 0.684 / 0.621 / 0.569 | 0.95–1.00 | ≤ 0.6° |
| purple | 600 (0.236) | 0.826 / 0.694 / 0.640 / 0.585 | 0.73–1.00 | ≤ 1.5° |
| brown | 400 (0.064) | 0.875 / 0.781 / 0.734 / 0.684 | 0.29–0.36 to 550, rising to 1 at 925 | ≤ 6° (−13° at 950) |

- **Chroma** peaks where the family's hue reaches the gamut cusp: around 300 for the light-cusp hues (teal 300, lime and
  green 350–400, yellow and orange 400) and 450–600 for the dark-cusp hues (blue, red 450, purple 600). Below the peak the
  boundary itself sets the chroma, so the light rungs are as vivid as sRGB allows.
- **Hue is constant** to within a degree or two through the body of every ramp (OKLCH, held in IPT when the palette was
  made). The exceptions are orange's light end (+5°) and the near-black rungs of yellow and brown, where chroma is too low to
  matter.
- **Gamut:** no rung is clipped. `gamut.ts` implements CSS Color 4 §14.2.1 (binary search with local MINDE, JND 0.02),
  which the colour-science research confirms is still one of the three algorithms the 2026 draft allows.
- **Steps are uneven** (ΔE_OK × 100 between neighbours, 100 to 900, `measure-gaps.ts` §2). Blue, indigo, purple, pink and
  red move 6–8 per step from 150 to 300, then 2.4–5.0 from 300 to 500: the colour jumps from pastel to vivid in three steps
  and then plateaus for four. Teal, yellow, lime, green and cyan do the opposite: 2–4.5 from 200 to 350, then 6–8 from 400 to
  500. Max ÷ min within a family is 2.4–4.1. This is the "jump from pastel to vivid" the data-vis work found, and it is a
  property of the gamut, not of the export: on the gamut edge, lightness and chroma move together.
- **One rung, many lightnesses.** At 300 the eleven families span L 0.684 (blue) to 0.885 (teal); at 400, 0.621 (blue)
  to 0.805 (yellow). A series taken at one rung varies in weight; picking by lightness is the fix (proposal 2).
- **Why 500 reads dark:** 500 is the label wall. Blue, indigo, purple, pink and red clear white text there at L
  0.57–0.59; orange, yellow, green, lime, teal and cyan sit at L 0.65–0.68 and carry 3:1 only. OpenAI's luminous colours
  sample at L 0.71–0.84.

## 2. The data-vis gaps, measured

`measure-gaps.ts`, `sample-references.mjs`. The OpenAI colours were sampled from the owner's six reference images (blurred
photographs, so approximate). OpenAI publishes no hex values for its gradients; the brand page returned 403 to the research
agent, and the one documented history (Justin Jay Wang, "Methods for random gradients", 2024) describes the technique
(random SVG radial gradients, later DALL·E textures) without colours.

| Set | Colours (sampled) | L | C | Share of room | Nearest Area rung, ΔE × 100 |
|---|---|---|---|---|---|
| OpenAI | sky #6bc4fd, aqua #79dbf6, periwinkle #9bb0f7, lilac #d0a1f5, pink #ff9ed3, peach #fe9da3 | 0.77–0.84 | 0.08–0.13 | 0.80–1.00 | 0.3–4.3 (cyan, indigo, purple, pink 200–300) |
| OpenAI | mint #6acbad, yellow-green #d6c607, olive #bfc022 | 0.77–0.81 | 0.10–0.17 | 0.68–0.99 | 5.5–7.4 (no rung at that L in that hue) |
| Cursor | bands #b2d4dc #aec1d3 #99adc6, lines #7e9cbe #7390b5 | 0.65–0.85 | 0.03–0.07 | 0.30–0.35 | 5.1–8.7 |
| Round 11 | slate, mist, lavender, sand, rose, sage, teal, plum | 0.60–0.80 | 0.06–0.09 | 0.29–0.67 | 3.9–10.3 |

- **Luminous pastels** are near-full-share colours at L ≈ 0.8. Area has them where the hue's ladder passes through
  L 0.8 at a rung (blue 200–250, purple 250, pink 200); for the light-cusp hues the ladder passes L 0.8 between 350 and 450
  in two steps of ΔE 6–8, and at the in-between hues (sky 239°, yellow-green 104–110°) only a generated hue has them.
- **Dusty tones** are a third of the room. Through Accent strength's mix at 35% (65% for round 11's teal) the nearest rung
  lands within ΔE 0.7–3.3 of every one (`prototype.ts`, table "Dusty tier vs Cursor").
- **Heat ramps mixed toward white** keep the room's share only where the gamut narrows toward white as the mix moves
  (blue, indigo, purple: 0.95–1.0). Where the hue's brightest colour is light (yellow, lime, green, teal, cyan) the 50%
  mix keeps 0.39–0.51 of the room and the 75% mix 0.18–0.54: the grey middle. The ladder rung at the same lightness keeps
  0.92–1.0. The research agent measured the same from the other side: OKHSL at constant saturation doubles green's tint
  chroma against a white mix.

### OpenAI's colours, one by one

Each sample, its nearest Area rung today, and the proposed luminous colour at the sample's hue (`colourAt(h, 0.79, 1, cap
0.13)`), ΔE × 100 (`prototype.ts`). The pale and deep samples (sky pale, aqua, periwinkle, orange, violet) sit at other
lightnesses, so one lightness misses them; the series uses the hues that fit (sky, lilac, peach, pink, mint, periwinkle,
peach orange, yellow-green).

| Sample | Hex | L | C | h | Share | Nearest rung | ΔE | Proposed | ΔE |
|---|---|---|---|---|---|---|---|---|---|
| sky | #6bc4fd | 0.787 | 0.118 | 239 | 0.97 | cyan-300 #4ad2ff | 4 | #6ac5ff | 0.3 |
| sky pale | #96d6f5 | 0.844 | 0.078 | 230 | 0.8 | cyan-200 #8ddfff | 2.4 | #4ecafd | 7.4 |
| aqua | #79dbf6 | 0.841 | 0.1 | 218 | 0.82 | cyan-200 #8ddfff | 2.5 | #37cef2 | 6 |
| mint | #6acbad | 0.774 | 0.103 | 171 | 0.68 | teal-400 #00dcc7 | 5.5 | #4dd5b0 | 3.1 |
| periwinkle | #8e9bef | 0.713 | 0.123 | 276 | 0.82 | indigo-250 #98a9fe | 4.2 | #a8b5ff | 7.9 |
| periwinkle pale | #9bb0f7 | 0.768 | 0.105 | 271 | 0.89 | indigo-250 #98a9fe | 2.4 | #a1b7ff | 2.2 |
| lilac | #d0a1f5 | 0.782 | 0.126 | 309 | 0.85 | purple-250 #b89fff | 4 | #d3a3f9 | 0.8 |
| lilac pale | #d4abf8 | 0.805 | 0.114 | 308 | 0.89 | purple-200 #cabaff | 3.7 | #d2a3fa | 2.1 |
| pink | #ff9ed3 | 0.813 | 0.131 | 346 | 1 | pink-200 #ffabc7 | 4 | #f797cb | 2.3 |
| rose pink | #ffabc5 | 0.83 | 0.103 | 359 | 1 | pink-200 #ffabc7 | 0.3 | #fe96b8 | 4.7 |
| peach | #fe9da3 | 0.796 | 0.116 | 16 | 0.98 | red-250 #ff8c93 | 3.8 | #ff99a0 | 0.9 |
| peach orange | #ef9365 | 0.749 | 0.127 | 47 | 0.78 | orange-300 #fe9c51 | 4.3 | #fe9f70 | 4 |
| orange | #fb7c07 | 0.72 | 0.184 | 52 | 0.99 | orange-450 #f77b03 | 0.8 | #fca169 | 8.8 |
| yellow-green | #d6c607 | 0.814 | 0.171 | 104 | 0.99 | yellow-350 #f9ba1d | 6.1 | #c9be52 | 4.8 |
| violet | #997ffe | 0.679 | 0.182 | 290 | 0.99 | purple-300 #a781fe | 2.3 | #b9aeff | 13 |

## 3. Semantic roles and the Layers model

`measure-layers.ts 0` (default: ground light 100, dark 8, Layers 0 both modes, Neutral cast):

| Role | Light | Dark | Collapses onto |
|---|---|---|---|
| `bg-page`, `bg-surface`, `bg-subtle`, `bg-card`, `bg-tile`, `bg-frame`, `bg-frame-raised`, `bg-code` | #ffffff | #020202 | the page (by design for surfaces at Flat; not for fills) |
| `bg-stripe` | #fbfbfb (1.03:1, ΔE 1.2) | #040404 (ΔE 2.2) | nearly the page: below one JND (2.0) in light |
| `bg-component` (+ every ground's copy) | #f9f9f9 (1.05:1) | #161616 (1.15:1) | one value for all seven grounds at Flat |
| `border-card` = `border-float` | #eeeeee | — | — |
| `border-card` = `-faint` = `-divider` = `-subtle` = `fill-track` = `-hover` | — | #333333 | five edge roles and both rails are one colour in dark |
| `fg-placeholder` = `fg-muted` | #666666 | #c5c5c5 | intended (CONTRAST.md) |

The Flat default (owner, 2026-10-26: "frames alone set layers apart") is deliberate for surfaces. The defect is that
`bg-subtle` carries two meanings: the recessed layer (which may be flat) and "a quiet neutral fill" (which must show).
Components reading it as a fill, all invisible at the default:

`navigation.css:309` Table header · `surface.css:1821` Surface soft · `box-model.css:26` Box model's margin well (its spec
cites Figma's rgb(245) well) · `attachment.css:22` · `plan.css:203` · `edit-summary.css:200` diff fold · `file-tile.css:71`
· `asset-row.css:34` (spec: "a neutral fill") · `choice.css:259` Radio card preview · `preview-frame.css:38` subtle frame.
Inline code (`code.css:112`) and striped Table rows read `bg-stripe`, 1.03:1. GitHub's table header uses `bgColor-muted`
#f6f8fa (1.07:1), a fill that exists in every theme (`docs/research/data-views-2026-11-01/github-primer.md`).

## 4. Accessibility

- **WCAG 2.2 is the hard gate; APCA a second gate in dark** (`contrast.ts`, `apca-w3` pinned). Still right: the WCAG 3
  draft of 10 Sep 2026 says the contrast algorithm "is yet to be determined"; APCA left the draft in July 2023.
- **Text on colour.** Solid labels clear 4.6:1 and APCA 61 at every Accent strength; tonal inks 4.5:1 on every ground and
  under `TONAL_Y`; vivid text 4.6:1 on the code ground (+ APCA 61 in dark). Gated over ~4 million combinations
  (`contrast/accents.test.ts`) and 500 sampled brands.
- **Dark steps.** One chromatic ladder serves both modes (light and dark builds paint identical hexes); dark picks lighter
  rungs (vivid 200–400, tonal ink 150–350) and since 2026-10-28 derives its soft surfaces at chroma 0.05–0.07 rather than
  painting rungs. The near-black overstatement is real: the proposed dark series measures 7.0–8.1:1 under WCAG but APCA Lc
  46–52 on #020202, ample for marks (Lc 15 is APCA's non-text floor) but a warning against WCAG-only dark text checks.
- **Non-text (SC 1.4.11).** 3:1 applies to "parts of graphics required to understand the content"; a graphic is exempt
  when the same information is in visible labels, values or a table (W3C Understanding 1.4.11). No sRGB colour lighter
  than about L 0.65–0.70 reaches 3:1 on white (lightest at 3:1, max chroma: h30 0.692, h60 0.681, h150 0.650, h260 0.673,
  h340 0.704), and ColorBrewer's Pastel1 and Set2 pass 0 of 17. So true pastels can be fills only, with a 3:1 edge or
  line in the same hue (Primer's emphasis + muted pairing) or with direct labels.
- **Data colours are not gated.** Validator results (`validate-series.mjs`, the dataviz skill's checks: OKLCH band, chroma
  ≥ 0.10, Machado 2009 CVD ΔE between neighbours, normal-vision floor 15, 3:1 on the page):

| Set | Mode | Neighbour CVD ΔE | Normal ΔE | First four, all pairs CVD | ≥ 3:1 on page |
|---|---|---|---|---|---|
| Meter today (blue 500, orange 500, teal 500, yellow 450, pink 300, green 600, purple 550, red 450) | light | 13.9 | 22.7 | 5.6 | 2 of 8 under (relief), 2 at 3.00–3.01 |
| Meter today | dark | 11.7 | 18.1 | 1.6 | pass |
| Round 10 (ladder peaks) | light / dark | 10.5 | 26.7 | 6.4 | pass (dark lightness band fails) |
| Round 11 (Cursor-like literals) | light | 6.1 (floor) | 12.7 (fails) | 2.0 | 4 of 8 under |
| Proposed marks: emphasis on white | light | 10.3 | 24.7 | 5.5 | pass (3.26–3.30:1) |
| Proposed marks: luminous on #020202 | dark | 8.7 | 17.5 | 1.4 | pass (10.1–11.3:1); above the skill's dark lightness band by request |
| Proposed luminous fills on white | light | 8.7 | 17.5 | 1.4 | relief (1.8–2.1:1): identity is the emphasis edge |

Matched lightness costs all-pairs CVD separation (it is what lightness differences buy): at one lightness, four hues can't
all stay apart for colour-blind readers when any two touch (first four, all pairs: ΔE 5.5 light, 1.4 dark). Stacked and
side-by-side charts only put neighbours together; scatter-like charts take three series, labels or facets.

(The first pass of this study used Area-flavoured hues, blue, orange, aqua, coral, lilac, lime, pink, violet, at fill L 0.82;
it was replaced on the owner's direction. It also passed every hard gate: neighbour CVD 12.6 / 13.5, normal 25.7 / 24.4.)

## 5. How others make colour

Measured with colorjs.io 0.7.1 from pinned sources (repo @ commit, file:line); details and every table in `sources.md`.

| System | How the ramp is made | Equal lightness at a step? | Chroma peak | Muted / pastel | From one colour |
|---|---|---|---|---|---|
| **Radix Colors** (radix-ui/colors @ `dbdb8547`, `src/light.ts` blue L961) | 12 hand-made steps per hue and mode, with alpha and P3 twins; step roles 1–2 bg, 3–5 component, 6–8 border, 9–10 solid, 11–12 text (website @ `402e7496`, `understanding-the-scale.mdx` L20–310) | Yes except step 9 of yellows/oranges | Step 9–10 | Borders 6–8 sit at 75–85% of the room; teal's light steps at 34–54% | Generator (`generate-radix-colors.tsx` L191–357): mixes the two nearest shipped scales, takes the input's hue and chroma, re-eases lightness toward the background; step 9 = the input |
| **Tailwind v4** (tailwindcss @ `e4543af9`, `theme.css` blue L130–140) | OKLCH literals 50–950, no formula; one ramp for both modes | No (500 spans L 58.5 indigo to 79.5 yellow) | 600 reds/blues, 500 greens, 400 yellows/teals | No; new near-grey families (mauve, olive, mist, taupe) | — |
| **Material 3** (material-color-utilities @ `bd811e4c`) | HCT: tone = CIE L*, chroma held, hue held (`tonal_palette.ts` L61–71); roles pick tones per mode and contrast level, then solve the real ratio (`contrast_curve.ts` L27–62) | Yes, by construction | Wherever the gamut allows | **Yes**: TonalSpot primary chroma 36 (44–72% of the room), secondary 16, neutral 6/8 (`dynamic_scheme.ts` L638–799) | Seed → five palettes; variants decide how much survives (Vibrant 200, Fidelity = source) |
| **IBM Carbon** (carbon @ `6351ab56`, `colors.tokens.json`) | 10 grades, every hue at the same CIE L* per grade (±2) | Yes | Blue 60, orange 50, teal/yellow 30 | No | — |
| **Adobe Leonardo** (leonardo @ `eb6481da`, `contrast-colors/lib/color.js` L16, `utils.js` L468–515) | Interpolates white → key colours → black (any space incl. OKLCH, CAM02), binary-searches each target ratio against a background | n/a (ratios, not steps) | n/a | `saturation` scales the keys' OKLCH chroma | Key colours + ratios + background |
| **GitHub Primer** (primer/primitives @ `ec3eee6a`) | 10 steps per hue made in Prism with HSLuv (`adr-008-color-format.md` L83–85); display scales invert in dark | Roughly | Steps 3–4 | Data-vis "muted" is a light step (`data-vis.json5` L10–164): emphasis for lines/bars/borders, muted for areas | — |
| **Apple HIG** (developer.apple.com, values updated 9 Jun 2025) | One system colour per hue, with dark and increased-contrast variants (e.g. blue #0088FF / #0091FF / #1E6EF4 / #5CB8FF) | No (L 0.56–0.87) | — | — | Recommends Display P3 for "visual data and status indicators" |
| **Linear** (linear.app/now/how-we-redesigned-the-linear-ui, 2024) | Three inputs (base, accent, contrast) generate every theme in LCH, "instead of having to define 98 specific variables for each theme, we defined three" | Yes (the reason for LCH) | — | — | Yes; formulas unpublished |

Lessons that apply to Area:

- **Two families of systems.** Carbon and Material put every hue at one lightness per step, so a step number predicts
  contrast (40 grades or tones apart ≥ 3:1, 50 apart ≈ 4.5:1, measured). Radix, Tailwind and Area put each hue where it
  looks right and guarantee roles instead. Area chose the second deliberately (`curves.ts` header: anchored to the label
  wall) and solves every role by measurement, which is stronger than either rule. The cost shows only where a rung is used
  as a lightness, as data colours do, so the fix is to pick data colours **by lightness** (proposal 2), not to change the
  ladder.
- **Saturation is a second axis in Material and partly in Radix; Area has it only for the accent.** Material's scheme
  variants are chroma tiers over one hue; Radix's borders are dustier than its solids. Proposal 3 would give Area the same
  axis with the mix it already gates (set aside for data colours: the owner prefers OpenAI's luminous colours).
- **OKHSL's saturation is "share of the room"** (Ottosson, "Okhsl", 2021: s = 1 is the sRGB maximum at that L and h). Holding
  a share, not a chroma, is what keeps light-cusp hues bright at high lightness. It is not perceived chroma, so at s = 1
  mint and yellow-green out-shine sky at L 0.79; the prototype caps luminous chroma at 0.13 (OpenAI's luminous colours
  measure 0.08–0.13, and the cap is the fitted best).
- **Data colours come in pairs.** Primer pairs emphasis (lines, bars, borders) with muted (areas); Carbon's sequential
  scales flip their dark anchor by mode; Observable Plot defaults to turbo because "blues" make low values vanish on white
  (`docs/features/scales.md` L825, plot @ `535723d5`).
- **Ramps.** Matplotlib's rule (lightness monotonic, measured in CAM02-UCS), Aisch's Bezier + lightness correction
  (vis4.net, 2013) and Datawrapper's advice (multi-hue sequential, a bright diverging middle; Muth, 2021) all avoid a
  straight mix to white for the same reason Area's teal greys.
- **Wide gamut.** Tailwind v4 is a P3 palette (blue 400–500 at 98% of P3's maximum) and Radix ships P3 twins. P3 holds
  26–40% more chroma than sRGB for green, pink and orange at L 0.8, under 10% for blue: the luminous pastels gain most.
- **Contrast-targeted generation** (Leonardo) is what Area's solvers already do per role; Area does not need it for the
  ladder.

## 6. Proposals, ranked

Each lands later through the `area-foundation-change` skill (tokens, every consuming family, Inspector, docs, contrast
tests together). Picks on the review page.

### 1. Fills that never vanish: built 2026-11-01 (owner: "Yes, fix fills")

Built as a **well**, a new ground in the Layers model rather than a swap to `bg-component`: soft fields, ghost buttons and
plates inside a fill step from the fill they sit on, and a fill painted `bg-component` would have hidden a soft field's
own `bg-component` inside it.

- `bg-well` (`color/layers.ts`): the recessed tone, never closer to the page than the page's own control fill. Light
  `min(recessed, page − control step)`, dark `max(recessed, the page's rest fill)`: #f9f9f9 / #161616 at Layers 0; in light
  the recessed tone from Layers 50 up, so nothing changes there. Its fills (`bg-component-well`, `-hover`, `-active`) and
  Selection surfaces step from it, its edges shift by it, and inks are solved on it too (unchanged at the defaults).
- Painted with it: Table's header (declared a `well` ground, so a sort button's hover steps from it) and striped rows,
  Box model's margin, Asset row's and File tile's image wells, Preview frame `subtle`, Attachment, a diff's fold, and inline
  code with Token (`token-bg`, which read the 1.03:1 `bg-stripe`).
- Not changed: a soft Surface, a preview choice card and Plan's steps stay on the recessed layer, flat at Layers 0, by the
  owner's 2026-10-29 answer on Surface ("keep Flat flat"), confirmed 2026-11-01.
- Rule: DESIGN_SYSTEM.md, Layers ("A fill paints the well, a region paints the recessed layer"); THEMING.md
  `data-area-ground="well"`; specs and feedback logs of the eight families.
- Checks: `npm test` 29,110 passed (the well joins every Layers sweep), contrast report 0 failing across 66 themes,
  `cohesion.test.mjs` 39 (the well joins the painted-ground, pressed-fill, setting-scope and edge tests), the eight
  families' tests 36, typecheck, docs (118 families), build. Seen in the app at Layers 0, light and dark (Table, Box
  model, Code).

### 2. Series colours from OpenAI's palette: built 2026-11-01 (owner: Build)

Built in `color/series.ts` and the **Series lightness** setting (`axes/series.ts`, 66 to 80, 79 by default; Emphasis in
the Inspector): `--area-series-<n>` (mark), `-fill`, `-ink`, `-ramp-1…7`, both modes, solved at build time. Meter's
stacked parts read the marks, and Foundations › Colors ends with a Series section (fill, ink, mark, ramp). As built, differing from the table below: the dark area fill deepens where the line would
not clear 3:1 over it (L 0.40 at most), and the light ink is solved on the sRGB and the P3 fill. Series 1 is sky, as
proposed (the open question on accent blue kept the recommendation). No Chart family or heat cells exist yet; they are
the data-views session's to build on these tokens.


Shared `--area-series-1…8` roles on the eight hues sampled from the owner's OpenAI references, in the validator's order:
sky 239, pink 346, yellow-green 104, lilac 309, peach orange 47, mint 171, periwinkle 276, peach 16. Each has:

- **luminous**: the ladder's edge at L 0.79, chroma ≤ 0.13 (`colourAt(h, 0.79, 1, 0.13)`). On white it fills bars, areas and
  heat cells (1.8–2.1:1, so always with its edge or direct labels); on #020202 it is the mark itself (10.1–11.3:1).
- **emphasis** (light): the lightest point on the hue at full share that clears 3.1:1 on the page and on `bg-component`
  (L 0.63–0.68). Lines, dots, keys and the luminous fill's 1.5 edge, as Primer pairs emphasis with muted.
- **ink**: the hue's deep point for a number inside a luminous fill (≥ 4.6:1).
- **dark area**: L 0.40 at 70% of the room, chroma ≤ 0.09, under a luminous line.

| Series | h | luminous (fill light, mark dark) | on white | on #020202 | emphasis light | on white | ink in fill | dark area fill |
|---|---|---|---|---|---|---|---|---|
| sky | 239 | #6bc5ff | 1.9 | 10.92 | #0096d9 (L 0.64) | 3.3 | #004f76 4.65 | #244c66 |
| peach orange | 47 | #fe9f6f | 2.02 | 10.28 | #ea6600 (L 0.66) | 3.28 | #793100 4.62 | #693920 |
| lilac | 309 | #d3a3fa | 2.02 | 10.26 | #c062ff (L 0.68) | 3.26 | #7100a5 4.63 | #56396c |
| yellow-green | 104 | #c8be52 | 1.92 | 10.81 | #9c9000 (L 0.64) | 3.28 | #524b00 4.63 | #4d4921 |
| pink | 346 | #f697cc | 2.06 | 10.09 | #ff32ba (L 0.68) | 3.27 | #880060 4.61 | #693152 |
| periwinkle | 276 | #a8b5ff | 1.96 | 10.59 | #7682ff (L 0.66) | 3.28 | #3f00e3 4.62 | #3b4277 |
| mint | 171 | #4ed5af | 1.83 | 11.32 | #00a180 (L 0.63) | 3.28 | #005844 4.62 | #255144 |
| peach | 16 | #ff99a0 | 2.04 | 10.19 | #ff4967 (L 0.67) | 3.28 | #91002c 4.6 | #703137 |

Every hard gate of the dataviz validator passes for the marks in both modes (neighbour CVD ΔE 10.3 / 8.7, normal vision
24.7 / 17.5). The data-vis branch's "series roles" proposal is the consumer; this is how they would be computed. Meter,
Chart and Table's heat cells read them. Sky replaces Area's accent blue as series 1; the accent stays Area's blue
everywhere else.

- Changes: a token group in `emit/`, `colourAt` in `color/generate.ts`, Meter's eight switch to the roles (a visible
  change to Meter), docs, a gallery tile. The page's sliders (lightness, share, cap) save the owner's tuning.
- Risk: peach and pink sit near danger's red, yellow-green near caution: the series never mean status (dataviz rule), and
  status keeps Area's status colours. The emphasis colours sit near 3:1, so a card darker than `bg-component` needs the
  gate in proposal 6.

### 3. Set aside: Soft and Dusty tiers for every family (owner, 2026-11-01)

Expose Accent strength's mix for category, tag and series colours: Vivid (100), Soft (65), Dusty (35), as tier tokens
(`<family>-<rung>-soft`, `-dusty`) or as a "Colour strength" setting beside Accent strength. It is the mix that already
gates the accent at 30–100% (`generate.ts` `withStrength`, `contrast/accents.test.ts`): luminance held at both ends and
within 0.09:1 between, hue held exactly. Brown becomes orange's Dusty tier in all but name.

- Changes: emit the tiers (or one setting), Inspector, the gate's sweep over the new tokens.
- Risk: low. Dusty colours cannot carry categorical identity alone (validator ΔE 2.3 between neighbours): they are for
  one-hue bands (Cursor's area chart is one cyan-to-blue family), backgrounds and tags, which the docs must say.

### 4. Ramps walk the hue: built 2026-11-01 (owner: Build)

Built as `--area-series-<n>-ramp-1…7`: light from L 0.95 to 0.58 (a step past the mark, so each step is ≥ 0.06 apart, the
validator's ordinal gap), dark from L 0.27 to the luminous colour, at full share. No ink tokens for cells: a label sits
beside a heat cell, or uses `fg-default` on steps 1–3 in light.


Sequential ramps (heat, calendar) step lightness from the ground to the end colour at the end's share of the room
(`colourAt(h, L, share)`), never mix toward white or the card; dark walks up from the ground. Diverging ramps are two such
arms meeting at the neutral ground (Moreland's light middle). Keeps teal at 1.0 of the room where the white mix keeps 0.22.

- Changes: a ramp function and its tokens (`--area-series-<n>-1…7`), used by proposal 2's heat cells.
- Risk: low; ink inside cells follows the cell's lightness (the page shows the switch point).

### 5. Steps between rungs: built 2026-11-01 (owner: Build)

Built as `color/place.ts` (`colourAt`, `colourAtP3`, `firstClearing`), with `place.test.ts` proving every chromatic rung
comes back within one 8-bit step at its own L, h and share. The Inspector affordance is Series lightness: the first
colours placed between rungs. Accent and page colours keep their own engines (generate.ts, colours.ts).


Make `colourAt(h, L, share)` the one placement function, with the palette's rungs as named points on it. Data and custom
colours can then sit between rungs where the ladder jumps (blue 150–300, teal 350–500, yellow 400–500; page section 2).
`palette.json` is unchanged; the eleven families stay exactly where they are because at their own L and share 1 the
function returns them (within the build's existing refinements).

- Changes: generator, an Inspector affordance for a position between rungs (positions already exist for colour settings).
- Risk: more positions to gate; keep in-between positions out of semantic roles.

### 6. Gate data colours in the tests: built 2026-11-01 (owner: Build)

Built as `contrast/series.test.ts` (181 checks): every Series lightness, both modes, marks on every shipped ground (not
only page and card), sRGB and P3. Not at every Accent strength: series do not follow Saturation, so the sweep would test
one colour set eight times.


A `contrast/series.test.ts` beside the others: neighbour CVD ΔE ≥ 8 (Machado 2009), normal-vision ΔE ≥ 15, emphasis ≥ 3:1
on page, card and `bg-component` in both modes and at every Accent strength, fills ≥ 4.6:1 for their ink. Same thresholds
as the dataviz skill's validator, so the page and the gate agree.

### 7. Wide-gamut luminous colours on P3 screens: built 2026-11-01 (owner: Build)

Built under `@media (color-gamut: p3)` (emit/css.ts, `seriesP3Rules`): the luminous colour (light fill, dark mark, dark
ramp's end) at Display P3's room with the cap widened by the same ratio, written `color(display-p3 …)`; gated on its own
luminance. Marks in light, inks, deep fills and the rest of the ramps stay sRGB.


Under `@media (color-gamut: p3)` the luminous fills take the chroma Display P3 holds at L 0.8 (+26–40% for green, pink,
orange; +9% for blue): the brightness of OpenAI's imagery on the Macs Area runs on. sRGB stays the gated base. Needs a P3
contrast pass and two paints per fill; later.

### Not proposed: re-spacing `palette.json`

Evening the ladder's steps (ΔE max ÷ min 2.4–4.1 today) would move every solved role (solids, inks, indicators, strokes)
and every component reviewed on them, and AGENTS.md preserves the palette. Proposal 5 gives the in-between colours without
moving a rung.

## 7. Open questions for the owner

- Proposal 2: is L 0.79 / cap 0.13 the right glow? The sliders on the page change lightness, share, cap and the dark area
  fill live and save with the picks.
- Proposal 2: should series 1 be OpenAI's sky or Area's accent blue?
