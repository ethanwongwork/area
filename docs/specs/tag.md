# Tag spec

**Status:** in review · 2026-10-06 (built; Review page batch "New components, batch 1")
**Captures:** `docs/research/captures/tag/`: `notion--tag-removable--{rest,dismiss-hover}--light`
(Claude in Chrome, owner's "tasks" Status editor, hover only), `area--tag-removable--{rest,dismiss-hover}--light`;
Notion's palette from `badge/notion--tag-*`, `badge/notion--select-*`, `badge-group/notion--multi-select-many`.
**Peers:** Badge (12px strong caption for metadata), Chip (a 24+ control that toggles or filters; `kind="input"`
is a removable value in a form), Tag picker (holds Tags), Custom select

## Owner decisions

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
| tone | neutral (default), gray, brown, info, success, warning, caution, danger, discovery, pink | Notion's default, gray, brown, blue, green, orange, yellow, red, purple, pink | Notion select / multi-select / status tags |
| size | sm 20 (default), md 24 | Notion's 20; 24 beside 32px controls (Tag picker lg) | Notion |
| content | leading icon (12) | A glyph before the label | — |
| behavior | removable (`onRemove`) | Notion's × in a multi-select field | `notion--tag-removable--*` |
| state | disabled | Field disabled | — |

Every Notion tag colour is mapped.

## Measurements

| slot · property | notion · rest | notion · × hover | area · rest | area · × hover |
|---|---|---|---|---|
| **shell** size | 85.56 × 20 | same | 80.98 × 20 (Geist vs Notion's system font) | same |
| **shell** padding | 0 0 0 6 | same | 0 2 0 6 | same |
| **shell** radius | 4 | 4 | 4 | 4 |
| **shell** font | 14/16.8 400 | — | 14/20 400 | — |
| **shell** colour / fill | rgb(38,74,114) on rgba(0,118,217,.204) | same | same | same |
| **×** box | 20 × 20, 1.99 from the end | same | 16 × 16, 2 in from the end and top | same |
| **×** glyph · ink inset from end | 16 (20 viewBox) · 7.3 | same | 12 · 6.25 | same |
| **×** colour | muted (fill rgb(142,139,134)) | 80% opacity | `fg-muted` | 12% plate, ink fixed |
| **×** plate | none | none | none | concentric r2 |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| height | 20 (`mark-label-md`) | Notion | — |
| corner | the radius setting for 20 (4 at default) | Notion 4 | — |
| text | 14/20 regular, the tone's ink | Notion 14 regular | Line box 20 fills the tag |
| fill and ink | Light: Notion's measured palette. Dark: the tone's ink (`fg-*`) at 20% over what is behind, text `fg-*-strong` | Notion (light); owner option 1 (dark), the same translucent recipe | First pass used the tones' `surface-active` in both, saturated in light (side by side) and a loud block in dark (blue #003b8c) |
| start side | 6 | Notion | — |
| × | 16 box 2 in from the end and top, 12 glyph (ink 7.5 ≈ Notion's 7.4), `fg-muted` | Notion | — |
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

## Verification

Build, parity, typecheck pass; captures pass the checksum. Unverified: dark against Notion, screen reader.

## Feedback log

- 2026-10-06 · owner: tags look wrong, chip or badge size?, make a Tag, fix the × backplate, Chrome review →
  Tag built from Notion's tag (captures above); Tag picker uses it; palette and × corrected after the review.

## Settled questions

1. **Brown** (owner: "add brown as a new family"): `palette.json` gained a 15th family, `brown`, generated
   from orange (same lightness at every rung, hue +2, chroma × 0.35; additions only, no existing rung
   changed). It sits in a `MUTED_SCALES` list: emitted in both themes and a full tonal role, but not an
   accent candidate, so the accent hues' cross-family chroma balance tests still hold. Rung 150 #ece0d7
   and the strong ink sit beside Notion's brown tint #ecded4 and ink #584437.
2. **Dark weight** (owner: option 1): the tone's ink at 20% over whatever is behind. Measured on the
   Review page: tag text contrast 11.3–14.7 in dark, 6.0–12.8 in light (AA 4.5 throughout).

- 2026-10-06 · owner: add gray, brown and pink to the palette if they fit → pink (the palette's pink
  family) and gray (the warm cast) added as semantic tones with light and dark pairs in the tokens
  (`pink-*`, `gray-*`, `fg-pink*`, `fg-gray*`), checked by the contrast tests (plus a new check: every
  tone's strong ink on its active tint). Brown left open (no family). Notion's gray vs Area's neutral:
  Notion's gray is warm (hue ~70) and a step firmer (#e6e5e3 tint, #494846 ink); Area's neutral is chroma 0.
- 2026-10-06 · owner: option 1 and brown as a new family → dark tint = tone ink at 20%; `brown` family
  added (palette.json, presets `MUTED_SCALES`), brown semantic tone and Tag tone. Token and contrast
  tests 24,251 pass (new checks: pink, gray, brown roles in every theme; each tone's strong ink on its
  active tint).
