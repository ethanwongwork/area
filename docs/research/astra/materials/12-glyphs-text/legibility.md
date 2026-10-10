# Small-size policy, board coverage and validation

**These are proposed acceptance rules, not a readability study.** Sources are in [the ledger](sources.md). Browser observation proves an effect renders; it cannot establish recognition speed, error rate or accessibility for people with low vision.

## What 12–16px means in Area

The pilot's actual curve gives approximate physical stroke widths of **0.988px at 12**, **1.059px at 14**, **1.125px at 16**: `1.125 × (s/16)^0.45` for this range, derived from A2. The historical spec table rounds 12px to 1.0px. A one-CSS-pixel relief offset is therefore about **101%, 94%, 89%** of these stroke widths. This is arithmetic demonstrating why “just 1px” is not negligible; it is not a perceptual threshold. At 2× each CSS pixel spans two device pixels; that does not recover negative space already covered by decoration.

Package `Glyph` has no 14px size prop; the lab's 14px row uses the pilot's numeric-size function. It does not recommend styling a package 16px glyph to 14px. Area requires rendering at the intended size, not shrinking a finished icon/text layer with a transform. Calendar's dot radius also follows the emitted size function. Preserve both, not only stroke width. [A1–A5]

| Size/context | Proposed default | Main failure to inspect | Exception boundary |
| --- | --- | --- | --- |
| 12px functional glyph or text | Plain semantic ink; no material shadow/filter/gradient | Counters close, mark and container merge, letterpress duplicates punctuation, glow masks thin diagonals | No global material opt-in; a dense icon that is unclear plain needs its icon-design review, not a glow or weight hack |
| 14px text and pilot comparison glyph | Plain ink; package glyph uses its real slot API | Shadow echoes compete with text stems and line spacing; a gradient removes contrast in part of a word | Sparse display inscription only after contextual and 1× review; no assumption that 14 is safe because 12 fails |
| 16px functional glyph/text | Plain ink remains default | Complex calendar/dates, off slashes and enclosed symbols lose separation; colored secondary parts look disabled | Trace static decoration may be evaluated for explicit display contexts; size alone confers no approval |
| Larger display icon/type | More room for a filled face or relief | Bevel closes font counters; effects clip, bloom competes with adjacent text | Follow actual renderer sizing and validate independently; do not extrapolate a 16px result to every larger size |

Plain ink protects recognition; this recommendation is based on Area's recorded raster/gap failures (A4), native-size constraints (A5), contrast contract (A6), and the mechanisms that add edge pixels (S1–S4). There is no measured universal minimum readable glow radius or maximum shadow strength here.

## Contrast and semantics

1. **Core:** retain the existing text floor of 4.5:1 for ordinary 12–16px labels, including placeholders/code. A 16px bold label is not automatically WCAG large text. Meaningful graphical parts that identify a control/state or convey information need 3:1 against adjacent colors under 1.4.11, subject to that criterion's exceptions; decorative redundant artwork is different. Do not use Area's quiet standard borders as proof that a faint functional icon is acceptable. [A6; S6]
2. **Composite:** calculate colors after alpha compositing with the actual ground. For a translucent/glass ground use every permitted underlying extreme and actual image/content samples; a fixed foreground cannot be guaranteed on an arbitrary light-and-dark moving backdrop without constraining it. Use an opaque reading island or tested tint envelope when the range fails. Gradient checks cover interpolated positions, not just stops. Check with decoration both on and off. Task 08 provides the broader method. [A6; R3]
3. **Conservative extra gate:** require the undecorated core to pass as well as the finished paint. A halo may legitimately contribute contrast in some WCAG techniques; this proposal simply avoids relying on a soft, clipped or preference-dependent effect for essential information. For duotone, evaluate each part necessary to understand the symbol against its adjacent body, not merely both colors against the page. [S6]
4. **Small-size review:** evaluate core geometry at native pixels separately from the numeric contrast test. Do not treat anti-aliased fringe pixels as the text's nominal source color or assert that a token test measures character recognition. Filled masks/counters must remain visible on both light and dark surfaces. [A3, A4, A6]
5. **Meaning:** preserve accessible names on controls. Package Glyph is aria-hidden; applying a material never makes it the button's accessible name. Keep one real text node; decorative clones, if needed, are aria-hidden and noninteractive. Duotone/glow is not the only indication of selected, checked, disabled, invalid or focused. Hover does not alter the ink. [A1, A6]

## Fallbacks per content role

| Condition | Glyph fallback | Text fallback |
| --- | --- | --- |
| Increased contrast | Required parts to strong semantic ink; suppress optional relief/glow, replace gradient/duotone with readable monochrome when needed | Opaque semantic text; no shadow, clipped gradient, grain or transparency |
| Forced colors | Remove optional CSS/SVG filter; visible ink to context-appropriate system/currentColor; preserve fill:none and mask white/black, retain required state shape | Remove shadows/gradient background and restore real color; leave forced-color adjustment to the UA except narrowly justified existing contracts |
| Reduced transparency | Opaque reading ground and core; remove glass/lensing from the glyph | Opaque ground/core; no transparent fill dependent on a backdrop |
| Reduced motion | Static endpoint, no glowing pulse or light-angle sweep; required progress keeps a nonmoving meaning cue | Static readable ink; no animated gradient/shadow/gloss |
| Print / unsupported paint server | Flat ink, explicit URL-paint fallback, no optional filter | Flat real text, no transparent fill; readable when images/background printing are off |
| Dense lists, compact controls, code and editable values | None absorption; retain exact slot and required state paint | None absorption; preserve selection, caret, spelling/validation marks and line metrics |

Fallbacks are proposals layered on A6/R3/R4. S7 documents forced-color behavior, but a macOS light/dark preview is not Windows high-contrast execution. Do not assume filters automatically disappear. Preserve masks: their black/white values perform geometry, not user-facing decoration.

## Owner board cross-reference

Only the brief's descriptions are available; no board images were attached to this task. No values are inferred from them. [R1]

- **1** engraved window-control marks: shallow line engraving fits the unchanged-stroke path; the colored halo belongs to the circular button, not necessarily the ×/− glyph.
- **3** debossed label and frosted calendar: letterpress fits real text; a broad frosted calendar face and colored header need explicit body/header regions. The CSS outline gradient demonstrates capability, not this image's reconstruction.
- **6** printed text recipe: `#FFF` at 100% with `#000` at 40%, offset `(0,4)`, blur `4`, nominal spread `0`. Translate to `text-shadow: 0 4px 4px rgb(0 0 0 / .4)`; CSS text-shadow has no spread argument. This is the brief's transcription, not a verified file or small-text recommendation.
- **8** console line icons and LED: keep line icons crisp; emission is primarily the indicator's role. **9** terminal engraved prompt can be a sparse inscription, not permission to apply relief to terminal/code text.
- **10** active bright glyph: preserve selected semantics/contrast; do not dim inactive required glyphs indiscriminately. **11** colored label: semantic on-state cannot become a generic material hover color.
- **15** “Aa” over glass: a refraction demonstration on the host does not authorize refracting the text. **16** dark green glyph on jelly: opaque flat glyph over a glossy body is compatible with None absorption. **17** glass disc icon needs a filled body, unlike a thin functional line glyph.

## Exact checks before accepting a preset

1. Serve this folder (`python3 serve.py`) and open the lab. Compare Plain with each treatment at 12/14/16 in both themes, with the same font/weight and side-by-side geometry. Use the Plain fallback button to verify decoration removal. Lab text is the system font, deliberately **not a claim about Geist**; repeat on Area's actual loaded Geist and system stacks before acceptance.
2. In Area's icon review gallery, use the current emitted outline and filled versions of check, dismiss, search, calendar, info, off-state and dense icons. Render native 12/16 package slots; a 14px pilot test is separate. Check at 100% browser zoom on real 1× and 2× displays, then zoom for magnification/reflow. An enlarged screenshot is a diagnostic, not a substitute for normal-size recognition.
3. Inspect shortest gaps, dots, slashes, counters and joins; compare baseline versus decorated on light, near-black, hover, selected and invalid grounds. Reject missing parts, shape inversion, doubled text, clipped bloom or moved layout. Check crowded rows at compact density; glowing neighbors must not join into one cue.
4. Run the existing contrast tests unchanged; add actual gradient/interpolated paint and alpha/backdrop combinations. Confirm undecorated-core and final-paint checks separately. Record worst-case colors and positions; if the backdrop is unconstrained, record failure rather than selecting a flattering screenshot.
5. Keyboard through actual controls; verify names with a screen reader, text selection/copy, focus independent of glow, and selected/invalid simultaneously. Toggle increased contrast, reduced transparency and reduced motion. Execute real Windows forced colors in Chromium/Firefox, and Safari/Firefox rendering separately. The lab's Plain button only exercises an authored reset, not OS preferences.
6. Check effect clipping in scroll areas, masks, overflow-hidden containers and overlapping surfaces; test nested opposite themes and repeated instances for gradient-ID collisions. Try print with background images disabled. Measure scrolling/interaction in the actual dense family if any filter exception remains, using task 11's method without treating its unrelated synthetic results as this effect's budget.
7. Ask representative users, including low-vision users, to identify icons and read short labels in realistic tasks. Record errors and completion time relative to plain ink; owner visual preference and automated contrast alone are insufficient. No such user study was run here.
