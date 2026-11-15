# Tag spec

**Captures:** `docs/research/captures/tag/`: `notion--tag-removable--{rest,dismiss-hover}--light`
(Claude in Chrome, owner's "tasks" Status editor, hover only), `area--tag-removable--{rest,dismiss-hover}--light`;
Notion's palette from `badge/notion--tag-*`, `badge/notion--select-*`, `badge-group/notion--multi-select-many`.
**Peers:** Badge (12px strong caption for metadata), Chip (a 24+ control that toggles or filters; `kind="input"`
is a removable value in a form), Tag picker (holds Tags), Custom select

## Owner decisions

- 2026-10-08 (component review): Tag approved. "go with your recs for open questions": open
  questions 1 (deeper light inks) and 2 (calmer dark green and yellow) accepted as recommended, 3
  (cap-centring) kept. Owner note on Tag picker, "the backplate for hover around the colored tags is
  a bit hard to read": that was the ×'s hover plate (the × at its own ink over a 12% plate of that
  ink), which the deeper inks address (Settled questions 3-5).
- 2026-10-08: "is the corner radius correct? seems quite sharp" → yes. The corner is the radius
  setting's rule for a 20px element: 20 × 8/32 (`--area-radius-factor` 0.25) = 5, rounded down to
  the even 4 (`round(down, …, 2px)`); Notion's tag is 4 (captured), as are Chakra's, Fluent's and
  Atlassian's 20px tags (audit table below). Read in the browser 2026-10-08: 20 tall, `border-radius`
  4px. It reads sharper than Button's 8 because it is less than half as tall.
- 2026-10-06 (second round): "the colors look too washed, and the design is quite pixelated. can you
  make the background color lighter? so the foreground can be more vibrant?"
- 2026-10-06: "custom select tags are not looking correct, should the size of these be more like chips or
  badges? can you create an actual tag component first and fix the x dismiss backplate. do the claude in
  chrome review for this."

## Job and boundaries

A coloured label for a value someone chose or typed: a select or multi-select option, a topic, a
status. **Not Badge:** Badge is a caption for metadata (12/16 strong, a pill by the Pills setting);
a tag is the value itself, set in body text. **Not Chip:** a chip is a control (24–32 tall, its own
hover and selection); a tag is a label that may carry one control, its ×. In size a tag is
Badge-height (20) with body-size text (14 regular); that pairing is why it is its own component.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| color | neutral (default), gray, brown, orange, yellow, green, blue, purple, pink, red (`tone` a deprecated alias) | Notion's default, gray, brown, orange, yellow, green, blue, purple, pink, red; Board column's set | Notion select / multi-select / status tags |
| size | md 20 (default), lg 24 (Badge's names; were sm and md) | Notion's 20; 24 beside 32px controls (Tag picker lg) | Notion |
| content | leading icon (12) | A glyph before the label | — |
| behavior | removable (`onDismiss`) | Notion's × in a multi-select field | `notion--tag-removable--*` |
| state | disabled | Field disabled | — |

Every Notion tag colour is mapped.

## Measurements

**Current (2026-11-13, one mark).** Tag is on the one mark recipe (inset.css, "One mark"). Heights are the mark ladder, the small text line plus 0 / 4 / 8: 14 / 18 / 22 at type 12 and 13, 16 / 20 / 24 at 14, 18 / 22 / 26 at 15, 20 / 24 / 28 at 16, the same at Compact, Default and Comfortable (Compact's md was 14 and its lg 18 until 2026-11-13). The text side is (H − 6) / 2 from the outer edge, edge counted once: 4 / 6 / 8 at type 13. The cap sits on the marks' whole-pixel baseline, edge + round((H − 2 · edge + 1cap) / 2). The tables below are the source evidence they were set from. Text text-xs on md (11/14 at type 13, like Badge, at every density: plan B5.2, owner 2026-11-11), the UI text on lg (13). Side 6 at md and 8 at lg (were 5 and 6). Corner: the chip role, radius-small, at most H / 2: 6 at the default Corner 10 (was 4, the corner of its height), square at Corner 0. Icon side (H − icon) / 2, icon to label 4; the remove box H − 4, 2 in.

| slot · property | notion · rest | notion · × hover | area · rest | area · × hover |
|---|---|---|---|---|
| **shell** size | 85.56 × 20 | same | 80.98 × 20 (Geist vs Notion's system font) | same |
| **shell** padding | 0 0 0 6 | same | 0 2 0 6 | same |
| **shell** radius | 4 | 4 | 4 | 4 |
| **shell** font | 14/16.8 400 | — | 14/20 400 | — |
| **shell** colour / fill | rgb(38,74,114) on rgba(0,118,217,.204) | same | same | same |
| **×** box | 20 × 20, 1.99 from the end | same | 16 × 16, 2 in from the end and top | same |
| **×** glyph · ink inset from end | 16 (20 viewBox) · 7.3 | same | 12 · 6.25 | same |
| **×** colour | muted (fill rgb(142,139,134)) | 80% opacity | the tag's ink | 12% plate, ink fixed |
| **×** plate | none | none | none | concentric r2 |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| height | 20 (`mark-label-md`) | Notion | — |
| corner | the radius setting for 20 (4 at default) | Notion 4 | — |
| text | the mark text, `control-xs-text` (11 at type 13) regular, the tone's ink, at every density; the plate's height is its line | Badge and Count on the same plate (owner, 2026-11-11, plan B5.2) | Notion 14 regular: Tag reads as a mark beside Badge and Count |
| fill and ink | Each colour reads its hue's roles, `hue-<hue>-bg` under `hue-<hue>-text` (components audit D5), which are its tone's soft tint under its tone's words, the pair a soft Badge paints: `<tone>-surface` and `fg-<tone>` (gray: `gray-surface`, `fg-gray`), so Tone tint and Tone contrast reach Tag and a Tag matches its Badge, Callout and Board column in both modes. Neutral keeps its translucent default. At the defaults, light: caution #905e00 on #fcf7e5, danger #c8023a on #ffe8e9, info #015cd2 on #e4efff; dark: caution #fbc13b on #302806 | Owner, 2026-11-03: Tag and Board onto the tone tokens | Until 2026-11-03: light literals, one tint at OKLCH L 0.955 / C 0.035 under inks at L ≤ 0.49; dark, the vivid ink on a 16% wash of itself with a label lift. The shared tint is lighter at the default (C 0.025 at rest); Tone tint 130–160 carries more. Contrast is the tones' gate (contrast/tone-floor.test.ts) |
| start side | 6 | Notion | — |
| × | 16 box 2 in from the end and top, 12 glyph drawn at its 12 line (`Glyph size={12}`, as Badge's), ink 7.5 ≈ Notion's 7.4, in the tag's ink (as Badge's dismiss) | Notion (geometry); peer Badge (colour) | Notion's × is muted grey; beside the vivid inks a grey × read as a separate object (owner, 2026-10-06). Was the 16 drawing shrunk to 12, a 0.84px line (0.67 in the gallery's 0.8 view) that looked pixelated; now ~1px |
| × hover | a 12% plate in the ×'s ink, radius 2 (concentric: 4 − 2) | System rule: foreground fixed on hover | Notion dims the × to 80% instead; Badge's round plate met the tag's corner on a different curve (the owner's "dismiss backplate") |
| target | invisible 24 (44 coarse) | WCAG 2.5.8, as Badge | — |

## Behavior and accessibility

A `span`; the × is a `button` named "Remove <label>" (or `removeLabel`). Disabled hides the × and dims
the tag. Forced colours: a 1px CanvasText edge.

## Visual pass

2026-10-06, Claude in Chrome: Notion's Status editor zoomed beside Area's Tag picker (built-in browser).
Before: Area's tints and inks were the tone tokens' strongest steps, visibly more saturated (green
#b5fac0 against Notion's #d7e6dd), and the × sat in a round 12% plate in the tag's ink. After: Notion's
palette, the muted ×, the concentric plate; the comparison table matches on fill, ink, height, corner,
start side and × position. Dark not compared with Notion (not captured).

Second round, 2026-10-06 (owner: washed colours, pixelated): built-in browser, all tones and the
wrapping Tag picker at 2.5× in light and dark. Before: Notion's translucent tints under dark muted
inks (e.g. blue #cbe0f6 under #264a72); after: pale even tints under the tone inks (blue #e2f1ff under
#0160d9). Dark: vivid inks on 16% tints; green and yellow read louder than the rest because their
vivid tokens carry about twice the chroma (0.17-0.22 against 0.09-0.11), a token-ladder matter left
open. The gallery draws every specimen at 0.8 (owner, 2026-10-04), which softens 14px text and thin
lines; only the × line was below the system's curve and is fixed.

### Claude in Chrome audit, 2026-10-07

Sources (all light unless noted; Chrome at devicePixelRatio 1.8, Area tab 2; nothing changed in any product):

| Source | What | Evidence |
|---|---|---|
| app.notion.com, owner's "tasks" db | Status tag as a page property, in the open Status editor (Escape, value unchanged), and as a board group header | `notion--tag-page-property--rest--light` + baseline probe |
| github.com/facebook/react/issues | IssueLabel chips (Status / Type / Component labels) | probe, no file |
| primer.style storybook `components-token-features--default-issue-label-token`, `globals=colorScheme:dark` | Primer IssueLabelToken, dark | probe |
| atlassian.design/components/tag/examples | Atlassian Tag (removable) and Lozenges | probe |
| chakra-ui.com/docs/components/tag | Chakra Tag md, subtle/surface palettes | probe |
| storybooks.fluentui.dev `components-tagpicker--size` | Fluent TagPicker tags (InteractionTag) | probe (see `tag-picker.md`) |
| mantine.dev/core/tags-input | Mantine Pill in TagsInput | probe |
| ant.design/components/select | Select `mode="tags"` item | computed style only (hidden tab drew 0×0) |
| localhost:4377 `/tag.html`, `/review.html` | Area Tag, light and dark | probe |

Not checked: Figma (no tag-like control in reach without opening a file), ChatGPT (no tags), Linear, Material 3, Notion dark (owner's Notion is light).

The baseline probe is a zero-size inline-block inserted before the text node for one read (the browser's own
baseline); cap and x heights from canvas `measureText`. It disagrees with `area-capture.js` for system fonts:
the script places the baseline at range top + canvas `fontBoundingBoxAscent`, which Chrome rounds to 14 for
SF at 14px while layout uses ~13.3, so the script draws Notion's text 0.67 lower than it is. Geist agrees in
both. That is where the 2026-10-06 note "Notion sits 0.7 lower at 5.8 / 4.33" came from; it is withdrawn.

| Tag | height | type | radius | start pad | cap top | baseline from bottom | cap centre vs box centre (+ low) | x-height centre |
|---|---|---|---|---|---|---|---|---|
| **Area** | 20 | 14/20 400 Geist | 4 | 6 | 5.06 | 5.00 | +0.03 | +1.29 low |
| Notion page property | 20 | 14/20 400 SF | 4 | 6 | 5.14 | 5.00 | +0.07 | +1.32 low |
| Notion editor field | 20 | 14/20 400 | 4 | 6 | 5.14 | 5.00 | +0.07 | +1.32 low |
| Notion board group | 20 | 14/20 **500** | 4 | 6 | 5.14 | 5.00 | +0.07 | +1.29 low |
| GitHub IssueLabel | 20 | 12/18 600 Mona Sans | pill | 8 | 5.88 | 5.67 | +0.1 | +1.13 low |
| Atlassian Tag | 20 | 12/16 400 | 4 (+1 tone edge) | 3 + 1 | 5.27 | 6.00 | −0.37 | — |
| Chakra Tag md | 20 | 12/16 400 | 4 | 6 | 5.92 | 5.50 | +0.2 | — |
| Fluent TagPicker md | 20 | 12/16 400 | 4 | — | 5.6 | 6.0 | −0.2 | — |
| Mantine Pill sm | 22 | 12/22 400 | pill | 9.6 | 7.04 | 6.50 | +0.27 | — |
| Ant Select item | 24 (22 + 1 clear edge) | 14/22 400 | 4 | 8 | not measured | | | |

| × | box | inset end / top | plate radius | glyph · ink | colour |
|---|---|---|---|---|---|
| **Area** | 16 | 2 / 2 | 2 (hover, 12%) | 12 · ~7.5 | tag ink |
| Atlassian Tag | 16 | 2 / 2 | 2 | 12 | tag ink rgb(41,42,46) |
| Notion | 20 | 0 / 0 | none | 16 · 9.4 | muted rgb(142,139,134) |
| Fluent | 19 × 12 (pad 0 5 0 2) | — | — | 12 · 7.2 | tag ink |
| Chakra | 12–14 | — | — | — | tag ink (blue rgb(23,61,166)) |
| Mantine | 24 × 22 | — | 50% | 8 ink | text |
| Ant | — | — | — | 10 | rgba(0,0,0,.45) |

Colour (OKLCH L / C, contrast of ink on tint; light over white):

| | tint L / C | ink L / C | contrast |
|---|---|---|---|
| **Area** light, 9 tones | 0.947–0.956 / 0.025–0.036 (gray 0.007) | 0.48–0.54 / 0.07–0.24 | 4.78 (danger) – 5.86; gray 7.34 |
| Notion blue, green, yellow, purple | 0.905–0.917 / 0.020–0.060 | 0.40–0.45 / 0.06–0.08 | 5.98–7.17 |
| Chakra red, green, blue, teal (100 / 800) | 0.932–0.962 / 0.031–0.050 | 0.41–0.46 / 0.07–0.17 | 6.19–7.63 |
| Atlassian lozenges | 0.908–0.924 / 0.047–0.083 | 0.33–0.38 / 0.09–0.10 | 8.16–9.37 |
| **Area** dark on rgb(29,29,29) | 0.32–0.36 / 0.02–0.05 | 0.78–0.83 / 0.09–0.22 | 6.03–6.79; gray 8.47 |
| Primer IssueLabelToken dark | label colour at 18%, 30% edge | the label colour, lightened | — |

Findings:

1. **Text centring matches every reference.** Notion (three contexts), GitHub, Chakra, Fluent and Mantine all
   cap-centre within ±0.3; Atlassian sits 0.37 high. None centres the x-height, so lowercase labels read
   about 1.2–1.3 low in all of them, Notion included. Area's cap-to-baseline rule stands; no glyph nudge.
2. **Geometry and × confirmed.** 20 / radius 4 / 6 start is Notion, Chakra and Fluent's tag; Atlassian's ×
   is Area's exactly (16 box, 2 from the end and top, radius 2, 12 glyph, tag ink). Notion and Ant are the
   only ones with a grey ×.
3. **Area's light inks are the most colourful and the least contrasty of the set** (C up to 0.24 against
   ≤ 0.17; contrast 4.78–5.9 against ≥ 5.98). That is the owner's 2026-10-06 direction and passes AA, but
   danger (4.78), warning (4.88) and pink (4.90) sit close to the 4.5 floor. Open question 1.
4. **The tints are not one chroma.** `oklch(0.955 0.035 h)` is outside sRGB for blue, orange, red, purple
   and pink; their hexes are the clipped colour (C 0.025–0.030) while green and yellow reach 0.035–0.036. The
   difference is small at L 0.95 and reads even on screen; recorded rather than changed.
5. **Dark: green and yellow are louder** (ink C 0.216 and 0.165 against 0.09–0.11; tint C 0.053 and 0.046
   against ~0.02). Primer's dark labels use the same model (colour at 18% under the colour as ink), so the
   model is sound; the imbalance is the vivid token ladder. Open question 2.

Changed: nothing in CSS or React; the evidence supports the current build. The capture tool's baseline error
is reported to the lead (shared file).

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. A Tag is static; only its remove × moves.

| Interaction | Before | After |
|---|---|---|
| × hover plate (`currentColor` 12%) | in and out: `--area-transition` (bg, border, colour, shadow), fast 100, ease-out | in: instant (`:hover` 0s, under `hover: hover`); out: `background-color` only, fast, ease-out |
| × press | eased | instant (`:active` 0s) |
| × focus ring (outline) | instant | unchanged |
| × ink | in the transition list | out of it: the × keeps the tag's ink, so nothing but the plate moves |
| A tag entering or leaving | none | none in Tag itself; Tag picker fades a newly chosen tag in (`tag-picker.md`) |

Crispness, checked on `/tag.html` (DPR 2): tags rest on whole-pixel y and heights (20 / 24); the ×
draws the native 12 cut at 12 × 12 (no scaled 16 drawing). Tag x positions follow the text before
them and can be fractional; that is layout, pixel-snapped at paint, not a transform. The ×'s 24px
target is an invisible `::after` centred with `translate: -50%`; it paints nothing, so it cannot blur.

## Verification

Build, parity, typecheck pass; captures pass the checksum. Unverified: dark against Notion, screen reader.
2026-10-07: dark compared with Primer's dark IssueLabelToken only (model, not values).

## Review note, 2026-10-16 (round 30)

- **What changed:** in dark, coloured tags' labels lighten as the dark page gets lighter, so they stay readable on
  their tinted plate. Nothing changes at the default dark or in light.
- **Why:** the plate is the colour at 16% over whatever is behind, so it lightened with the ground and the label
  didn't: brown fell to 3.98:1 at dark ground 24 + layers 8. Look at **Lightest dark**.

## Interaction polish, 2026-10-16

Remove presses at 20% of its ink (hover 12%). Not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-10-06 · owner: tags look wrong, chip or badge size?, make a Tag, fix the × backplate, Chrome review →
  Tag built from Notion's tag (captures above); Tag picker uses it; palette and × corrected after the review.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → motion pass: the ×'s plate appears at once and fades out on fast ease-out, plate only. "Motion and interaction, 2026-10-07".
- 2026-10-16 · owner: "go with your recs, fix them in that order" (after the Layers sweep, docs/research/layers-2026-10-16/sweep/README.md) → a tinted tone's dark label mixes toward white by the Layers model's lift (tokens color/layers.ts TINT_LIFT), through a private `--_lift`: on a card, a menu or the page `layer-dark-tint-lift` (0 until the raised layer passes L 0.30, then 4× the excess, 0.24 at ground 24 + layers 8); in a field (Tag picker) `layer-dark-tint-lift-fill`, solved on the raised hover fill (0.73 at 24 + 8). The plate is the ink at 16% over whatever is behind, so it lightened with the ground while the label stayed fixed: brown fell to 3.98:1 on a card and caution to 4.14:1 in a soft Tag picker at 24 + 8. Now 4.5:1 or more on the page, the raised layer, a field and a hovered row (layers.test.ts guards every tone); one lift for every ground had left tags nearly white on cards. Defaults unchanged.

- 2026-11-03 · owner: "Yes, move them" (Tag and Board onto the tone tokens, so Tone tint and Tone contrast reach them) → every tone's fill and ink are its soft Badge's (`<tone>-surface`, `fg-<tone>`); the measured literals, the dark 16% wash and its label lift are gone; neutral unchanged.

## Settled questions

1. **Brown** (owner: "add brown as a new family"): `palette.json` gained a 15th family, `brown`, generated
   from orange (same lightness at every rung, hue +2, chroma × 0.35; additions only, no existing rung
   changed). It sits in a `MUTED_SCALES` list: emitted in both themes and a full tonal role, but not an
   accent candidate, so the accent hues' cross-family chroma balance tests still hold. Rung 150 #ece0d7
   and the strong ink sit beside Notion's brown tint #ecded4 and ink #584437.
2. **Dark weight** (owner: option 1; second round 16% under the vivid ink): the tone's ink at 20% over whatever is behind. Measured on the
   Review page: tag text contrast 11.3–14.7 in dark, 6.0–12.8 in light (AA 4.5 throughout).
3. **Light ink contrast** (owner 2026-10-08, accepted the recommendation; the lead applied it). The
   light inks were L ~0.52 and danger, warning and pink sat at 4.78–4.90 on their tints, and the ×
   over its 12% hover plate fell below 4.5 for the lightest inks (estimated, not measured). Every light ink is now at OKLCH L ≤ 0.49, still more
   colourful than Notion's: 5.62 (danger) to 6.20 (discovery) on the tint, gray 7.34, and 4.54
   (danger) to 5.13 (discovery) under the plate, gray 6.13, neutral 10.25 (browser computed colours,
   plate = `color-mix(in srgb, currentColor 12%, transparent)` over the tint; 2026-10-08). Every
   tone clears 4.5 under the plate, so no further change.
4. **Dark green and yellow** (owner 2026-10-08, accepted the recommendation's fallback inside Tag).
   Their vivid tokens carry about twice the others' chroma; Tag now draws them at C ≈ 0.11 (success
   #85ce94, caution #e2b968) for both ink and tint. Done in Tag, not in the token ladder, because
   `fg-success-vivid` and `fg-caution-vivid` also paint Badge and Alert; the ladder stays an open
   system question for the token phase. Dark contrast 6.47 / 6.49 on the tint, 5.02 / 5.03 under the
   plate.
5. **Lowercase reads low** (owner 2026-10-08: recommendation kept). Cap-centring stays: every
   reference does the same, Notion included.

- 2026-10-06 · owner: add gray, brown and pink to the palette if they fit → pink (the palette's pink
  family) and gray (the warm cast) added as semantic tones with light and dark pairs in the tokens
  (`pink-*`, `gray-*`, `fg-pink*`, `fg-gray*`), checked by the contrast tests (plus a new check: every
  tone's strong ink on its active tint). Brown left open (no family). Notion's gray vs Area's neutral:
  Notion's gray is warm (hue ~70) and a step firmer (#e6e5e3 tint, #494846 ink); Area's neutral is chroma 0.
- 2026-10-06 · owner: option 1 and brown as a new family → dark tint = tone ink at 20%; `brown` family
  added (palette.json, presets `MUTED_SCALES`), brown semantic tone and Tag tone. Token and contrast
  tests 24,251 pass (new checks: pink, gray, brown roles in every theme; each tone's strong ink on its
  active tint).
- 2026-10-06 · owner: colours washed, pixelated, lighter background so the foreground is more vibrant →
  light tints at one OKLCH lightness and chroma under the tones' `fg-*` inks; dark vivid inks on 16%
  tints; the × drawn at its 12px line.
- 2026-10-06 · owner: should the × take the tag's colour? is the text low? → × in the tag's ink.
  Text measured cap-centred (cap top 5.06, baseline 5.0 from the bottom; Notion's sits 0.7 lower at
  5.8 / 4.33). Lowercase labels look low because their x-height middle is 1.3 below the plate's
  centre; left on the system's cap-to-baseline rule pending the owner's call.
- 2026-10-07 · lead: Claude in Chrome audit (Notion, GitHub, Primer dark, Atlassian, Chakra, Fluent, Mantine,
  Ant) → geometry, × and cap-centring confirmed; Notion is cap-centred too (5.14 / 5.0; the 5.8 / 4.33 above
  was the capture script's system-font baseline error, withdrawn); light ink contrast, dark green/yellow
  chroma and lowercase centring left as open questions with recommendations. No code change.
- 2026-10-08 · owner component review: Tag approved; recs taken → light inks at OKLCH L ≤ 0.49 and
  dark green/yellow calmed inside Tag (lead, tag.css); × on its hover plate verified ≥ 4.5 for every
  tone in light (4.54–10.25) and dark (4.78–7.64), so no further fix; corner radius confirmed 4
  (20 × 0.25 = 5 → even 4; Notion 4). tag.css header comment updated to the new contrast range.

## Spacing audit (2026-10-17)

10px icons at Compact (owner: "go with 10px icons, draw the cuts"): the icon and remove glyph boxes are at most the plate less 4 (`--_icon`): 12 at 20 and 24, 10 in Compact's 14, with their 10px cuts (`--_glyph-cut10`; docs/specs/icons.md "10px cuts"); the icon side follows the box ((14 − 10) / 2 = 2). Supersedes the open note below.

Text side and optical centre (owner, 2026-10-17: "the padding on the left side of the text looks way too big and the type doesnt look as centered vertically as the Public text"): the side is the room above the cap plus 1, at most 6 (`min(6, round((h − 1cap) / 2 + 1))`): 6 at 20 and 24, 4 at Compact's 14 (matching the ×'s 4.2 on the other side), 5 at 18. The label's cap centres in the plate on Badge's whole-pixel baseline, `edge + round((h − 2 · edge + 1cap) / 2)` from the top, so a Tag, a Badge and a Count of one height and text draw their words on one pixel row (owner, 2026-11-07; DESIGN_SYSTEM.md, "Marks on one line"). From 2026-10-17 to 2026-11-07 it centred a quarter of the cap–x-height gap above cap centre (`(1cap − 1ex) / 4`, the marks' optical lift, which Citation keeps for lowercase site names), and sat 0.58 high at type 13 beside the badges that dropped the lift on 2026-11-01. Open: the 12px icon fills Compact's 14 tag (1 each side), as in Badge; a smaller glyph needs a 10px cut.

Text size: the UI size while the tag is at least its line tall (Notion's 14 in 20; md 13 in 18 at Compact), the small size when it is shorter (`sign(ui-leading − height)`): Compact 13's 14 tag sets 11, as Badge, Count, Kbd and Citation do at that height; it held 13, 0.93 of its height (owner, 2026-10-17: "the type here looks way too big for this backplate").

Icon side and gap: an icon centres in the tag's end square, `(h − icon) / 2` (4 at 20, 6 at 24), and stands the xs icon gap (4) from the label, as Badge's at the same height; it was 6 in and 2 from the label (the text side's Notion literal). The label joins inset.css's cap-trimmed text slots (at type 13 its cap sat 1px low), and the remove control's track centres, so a 12 glyph in Compact 13's 10 box overflows evenly (it hung 1 low). The 12-in-10 size is still open. Measured in `docs/research/spacing-2026-10-17/` (Before / After: https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2).

### 2026-11-07 · One dismiss API and part (system gaps C4)

- **What changed:** the × takes `onDismiss` / `dismissLabel` and its part is `area-tag__dismiss`; `onRemove` / `removeLabel` stay as deprecated aliases for one release.
- **Why:** one dismiss API and one part name across the families that close or remove (Governance § 4; owner picked Build on the system gaps review, 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-07 · Label colours (system gaps C5)

- **What changed:** `color` replaces `tone`, with Board column's ten hues (neutral, gray, brown, orange, yellow, green, blue, purple, pink, red); the classes are `area-tag--<hue>`. `tone` still works for one release (info blue, success green, warning orange, caution yellow, danger red, discovery purple). Paint is unchanged: each hue reads the same tokens it did.
- **Why:** one colour vocabulary for labels and one ink for status icons (GOVERNANCE.md § 4; owner picked Build on the
  system gaps review, 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-07 · Size names (system gaps C8)

- **What changed:** the sizes are `md` (20, the default) and `lg` (24), Badge's and Count's names for those heights; they were `sm` and `md`. No alias: the old `md` is the new `lg`, so a mapped `md` would be ambiguous; every use in the repository moved.
- **Why:** one name, one size across the marks and one meaning for an aspect name (GOVERNANCE.md § 4; owner picked
  Build on the system gaps review, 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-07 · Every hue's roles (components audit D5)

Each `color` reads the hue role table (`--area-hue-<hue>-<role>`, packages/tokens/src/semantic/hues.ts; DESIGN_SYSTEM.md, "Every hue has the same roles"): `--_bg: var(--area-hue-<hue>-bg)`, `--_fg: var(--area-hue-<hue>-text)`. The roles alias the
same tone tokens, and the neutral literal (rgba(42,28,0,.07), dark white 10%) moved into `hue-neutral-bg`, so every value
is unchanged (no contrast floor forced a change). The table gives Tag an icon, outline, accent and translucent role per
hue for later variants; none is drawn yet.

## Review note, 2026-11-07 (marks on one line: vertical)

- **What changed:** the label's cap centres in the plate on Badge's whole-pixel baseline (tag.css), and a leading icon
  moves by the same rounding, as Badge's. The optical lift is gone from Tag (inset.css keeps it for Citation). Size,
  side, text, corner and paint are unchanged.
- **Why:** the owner asked "the vertical alignment the same/consistent?" across the marks. Measured on 195 rendered
  marks at type 12–16 × density 28 / 32 / 36: Tag sat 0.45–0.73 high everywhere (0.58 at type 13), Badge within ±0.45.
  "Yes, fix both": Tag is now within −0.33 to +0.45, and wherever a Tag and a Badge share a height and a text size
  their words land on the same pixel row. A Tag in 13px text beside an 11px badge of the same height centres a
  larger cap, so its baseline sits a pixel lower; both are centred.

## Review note, 2026-11-11 (type rules, plan A9)

- **What changed:** the label takes the mark text, `control-xs-text` (11 at type 13), at every density, as Badge and Count on the same plate (owner, 2026-11-11, plan B5.2: "Tag md 11/14 like Badge at every density"; plan A9.9). It was the UI size (13) while the plate held the UI line and 11 at Compact, so density changed its text.
- **Why:** the system evaluation's type rules (docs/research/system-evaluation-2026-11-11, section 5, A9), owner-approved
  2026-11-11; the rules are in DESIGN_SYSTEM.md ("Ink and weight", "Size and shape", "Text pairs") and the type skill.

### 2026-11-11 · Ink, dark and colour (system plan, Phase 1)

- **What changed:** The Tags stroke group's default is 4 (10%, plan A10.3), was 3 (7.5%).
- **Why:** docs/research/system-evaluation-2026-11-11 (README §5); the owner took every recommendation on 2026-11-11.
- **Verdict:** awaiting the owner.

## One mark, 2026-11-13

Plan B5.1 (and B5.2, B5.3 where they apply; docs/research/system-evaluation-2026-11-11): the family moved onto the shared mark recipe in inset.css and its own copy of the side, baseline, corner and text was removed. Values above, under Measurements.

## Selection paint (plan B7.4), 2026-11-14

- The default plate reads `hue-neutral-bg` (the same values, no longer a literal).
