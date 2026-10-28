# Textarea spec

**Captures:** `docs/research/captures/textarea/`
**Peers:** Input, Select, NumberField (field chrome), Field (label, count, validation),
Composer (conversation entry)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Textarea keeps native
  resizing and validation with horizontally larger insets at every size.

  Reference: [Atlassian Textarea](https://atlassian.design/components/textarea/usage).
- 2026-09-26, second pass ("decide all open items"): soft fields are flat (fill, no
  shadow), as Figma's inspector fields are. Applies to Textarea's soft variant.

## Job and boundaries

Textarea accepts multiple lines of text in a native `<textarea>` that carries its own chrome
(there is no wrapper, unlike Input). Rows own the block size; without `rows` it reserves four
lines. Label, character count and messages belong to Field; chat entry with actions is
Composer.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | Same pair as Input | UUI and Notion search outline; Notion menu and Figma fields fill-only |
| size | sm, md (default); lg removed 2026-10-01 (audit B-24 A: it differed from md by 4px of inset; `manifest.ts:330`) | Changes type and inline inset, not a control height | UUI sm/md |
| resize | vertical (default), horizontal, both, none | Native resize policy | Native |
| state | read-only, disabled, invalid, success, warning | Native and validation states | UUI (invalid, disabled) |
| boolean | fullWidth | Layout | — |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (source) | Textarea | [Untitled UI reference](../research/untitled-ui-reference.md):46, pinned `4702dc0` | MIT | — |
| notion | target product | Single-line fields only (chrome and focus reference) | app.notion.com Share popover and page menu, read-only | evidence only | `input/notion--field--focus--light`, `input/notion--menu-search--focus--light` |
| figma | target product | Single-line fields only (soft fill reference) | figma.com file browser and editor inspector | evidence only | `input/figma--search-field--rest--light`, `number-field/figma--number-field--rest--light` |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `textarea/area--*` |

No multiline field is among the second pass's 39 Notion and 38 Figma captures (searched every
`notion--*` and `figma--*` file: fields, menus, popovers, board, table and inspector rows).
The single-line fields above set the shared chrome: Notion 32px, radius 6–8, 14/20 400; Figma
fill rgb(245) with no border or shadow. ChatGPT's multiline entry is the Composer
([composer.md](composer.md)).

## Anatomy

```
area   textarea.area-textarea  owns: size (rows / min-block), border, radius, fill, padding, focus; resting
       shadow is the Field shadow role (`--_field-lift`, 0 by default), none on soft (textarea.css:44-48, 69)
```

Insets (`textarea.css:17-25, 33-34`; owner 2026-09-28): inline = (tier height − 1cap) / 2,
the equal-inset rule a same-size Input uses (inset.css), so the text starts where the Input's
does: sm 9, md 11; the CSS padding subtracts the 1px border. Block = max(2, inline − 4),
rounded to whole pixels, minus the border. (Before 2026-09-28: inline = gutter − border, md 11,
sm 7, lg as md.) Default height without rows: 4 × leading + 2 × block gutter + 2 × border
(`textarea.css:61-63`). Minimum: 2 × tier height (`textarea.css:32`).

## Measurements

`node scripts/capture-compare.mjs --slots shell` (Area, trimmed; widths are the tile's). The
readonly and error tiles match default except fill #f7 and border rgb(207, 3, 60); since audit B-9
read-only keeps the default fill.

| slot · property | area · default | area · size-sm | area · size-lg | area · soft | area · disabled |
|---|---|---|---|---|---|
| **shell** size | 256 × 98 | 256 × 56 | 256 × 80 | 256 × 98 | 256 × 98 |
| **shell** padding | 7 11 7 11 | 3 7 3 7 | 7 11 7 11 | 7 11 7 11 | 7 11 7 11 |
| **shell** border | 1 solid color(srgb 0.886275 …) | 1 solid color(srgb 0.886275 …) | 1 solid color(srgb 0.886275 …) | 1 solid rgba(0, 0, 0, 0) | 1 solid rgb(226, 226, 226) |
| **shell** radius | 8px | 8px | 8px | 8px | 8px |
| **shell** background | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(247, 247, 247) | rgb(247, 247, 247) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px | same | same | — | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px |

`area--soft` has no shadow (it had `shadow-1` before the second pass). The radius was 8 at every
size at capture; since audit S4 it is 6 sm, 8 md, 10 lg.

The size tiles set `rows={3}` (`apps/desktop/src/content/demos/gallery.tsx:957-959`): sm is 3 × 16 + 6 +
2 = 56; lg reaches its 2 × `control-lg` floor (80).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| inline inset | **Input's equal inset at each size: 9 sm, 11 md** ((height − 1cap) / 2, border counted once; `textarea.css:23, 34`) | Owner 2026-09-28 ("do whatever makes the most sense"): text starts where a same-size Input's does, and each size is distinct | Was 8 sm / 12 md / 12 lg (lg matched md); ChatGPT 10–12, UUI md 14 |
| block inset | inline − 4, rounded to a whole pixel, at least 2: 5 sm, 7 md (`textarea.css:25, 33`) | Owner (leading supplies vertical room); whole-pixel box | Was 4 sm / 8 md / 8 lg |
| type | 14/20 400 at every size (sm was 12/16 until small controls moved to 14/20) | Notion fields 14/20 400; peer Input | UUI md 16/24; Figma 11/16 |
| radius, border, fill, shadow | as Input: per-tier radius 6 sm, 8 md (`textarea.css:38`, `:147-148`), `textarea-edge` (= `input-edge`, #e2e2e2), `bg-surface`; resting shadow `--area-shadow-field`, 0 by default (Inspector → Edge and depth → Field shadow; 2026-10-18); soft #f7, flat, edge `textarea-edge-soft` (none, the strong edge under increased contrast; 2026-10-15) (`textarea.css:66-74`) | Peer: [Input](input.md); second pass: soft fields are flat (Figma) | Products draw no field shadow; kept with Input ([input.md](input.md#settled-questions) 2) |
| default rows | four lines when `rows` is omitted | Existing Area default (`textarea.css:61-63`) | — |
| resize | vertical | Native; conservative default | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | border → `textarea-edge-hover` (#d4d4d4; soft: `textarea-edge`); ink fixed | `textarea.css:86-91` |
| focus | border `field-focus-color` (focus colour) + `field-focus-halo-color` halo after the field lift, and the field focus outline at 0 offset | `textarea.css:93-100`; audit S1, as [input.md](input.md) |
| read-only | the variant's rest paint (no soft fill), no hover edge, default cursor (`textarea.css:87, :131`) | Audit B-9 B (owner), as Input; `area--readonly` predates it |
| disabled | field paint: `textarea-bg-disabled` #f7, `border-faint` (a soft field stays edgeless, `textarea.css:143`), `fg-disabled` ink, resize none; no opacity (`textarea.css:133-143`) | `area--disabled`; audit "Disabled" rule (confirmed, no change) |
| invalid / success / warning | border and halo in the validation colour (`textarea.css:105-128`) | `area--error` rgb(207, 3, 60); `area--success`, `area--warning` |

## Behavior and accessibility

Native `<textarea>`, ref forwarded (`forms.tsx:65-108`). `invalid`, `validationStatus="error"` and
`aria-invalid` agree (any one sets `aria-invalid` and `data-invalid`); `success` / `warning` set
`data-success` / `data-warning`; Field supplies the label, description and error relationships. Read-only
values stay focusable and are submitted; disabled values are not.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Input, Select, NumberField | field chrome | `input-edge`, radius 6 / 8 / 10 per tier, Field shadow role (0 by default; soft flat) | same at sm and md (`textarea-*` aliases of `input-*`; no lg) | match |
| Input, Select, NumberField | disabled | field paint, no opacity | same | match |
| Input | inline inset | cap-centred (11 at md) | the same equal-inset rule: (height − 1cap) / 2 | match since 2026-09-28 (was 11 = gutter − border, 1px off) |
| Field | description / count | 12/16 `fg-muted` | beneath | match |

## Visual pass

The gallery shows Textarea's tiles in named groups, one variant per tile.
2026-09-28 (batch 12): beside ChatGPT's settings multiline fields (`chatgpt--textarea--focus`,
`chatgpt--textarea-short`): 8 block and 10–12 inline insets, corners 6–8, a 1px edge at 15%
black, no shadow. Area md is 8 block / 12 inline, corner 8, `input-edge`, no shadow: a match at
rest. Focused, ChatGPT's field takes a blue rgb(58, 131, 247) border (`chatgpt--textarea--focus`);
Area uses its field focus role (audit B-1).
Found: sm, md and lg now share 14/20 text (small controls moved to 14/20) and md and lg share
the 12 inline inset, so lg differs from md only by its two-row minimum (80 against 76 at three
rows); an lg Input's text starts at 15. Owner: "do whatever makes the most sense" → resolved by the inset change above (sm 70, md 74, lg
82 at three rows). Unverified: dark theme.

## Verification

Compared the Area captures (`textarea/area--*`) with the Notion and Figma single-line
fields named in Sources. Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Motion and interaction, 2026-10-07

Per `docs/MOTION.md` (hover, focus, selected: in at once, out on `fast`; focus never fades in). The
shell lists its transitioned properties explicitly (`background-color, border-color, color,
box-shadow`) with two private clocks, `--_t-paint` for fill, edge and ink and `--_t-halo` for the
focus halo, so a state can make paint instant while the halo still lets go softly.

| Interaction | Before | After |
|---|---|---|
| Hover edge | `--area-transition`: border-color `fast` ease-out in and out | in at once (`--_t-paint: 0s` on `:hover`), out on `fast` / `ease-out` |
| Focus edge | border-color `fast` ease-out in and out | in at once, out on `fast` / `ease-out` |
| Focus halo (box-shadow) | faded in over `fast` (lagged the keyboard) | in at once (`--_t-halo: 0s`), out on `fast` / `ease-out`, also when the field is left while hovered |
| Increased-contrast outline | never transitioned | unchanged: instant both ways |
| Validation tone (invalid, success, warning) and disabled | edge faded in over `fast` | lands at once; clearing it while focused is instant (focus is 0s), clearing it at rest fades on `fast` |

Crispness: shell, insets (already `round()`ed) and boxes measured on whole pixels on `textarea.html`.

## Feedback log

- 2026-09-28 · owner approved batch 12 → Complete.

- 2026-09-28 · batch 12 side by side with ChatGPT → match; open: lg is barely distinct from md
  → `area--*` retaken.
- 2026-09-28 · owner: "do whatever makes the most sense for textarea" → inline inset follows
  Input's equal inset per size (9 / 11 / 15), block = inline − 4 rounded → `area--*` retaken.

- 2026-09-26 · cohesion audit → no change (disabled field paint confirmed) → `area--disabled`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → soft Textarea is
  flat (no shadow); no product multiline field found → `textarea/area--soft`,
  `input/notion--field--focus`, `input/figma--search-field`.
- 2026-09-27 · third pass → no change; Input's open questions settled with values kept
  (outline shadow, neutral focus) → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-30 · audit S4 (owner) → radius follows the tier as Button: sm 6, md 8, lg 10 (`--_radius` per size, `textarea.css:36`, `:131-133`); was 8 at every size.
- 2026-10-01 · audit B-9 (owner pick B) → read-only keeps its variant's rest paint (was the soft fill), no hover edge, default cursor; a soft field never gains an edge when disabled → textarea.css:76-80, :115-128.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → motion pass: hover and focus edge and the focus halo appear at once and fade out on `fast`; tones land at once (`textarea.css`). See "Motion and interaction, 2026-10-07".
- 2026-10-15 · owner: "merge it, then continue working" → boundary sweep under increased contrast (CONTRAST.md: required boundaries target 3:1): the soft variant's resting edge is `textarea-edge-soft` (= `input-edge-soft`), as Input's.
- 2026-10-18 · owner: "go with your recommendations … finalize the material, surface, stroke, elevation axis theming" → Edge and Depth (axes/depth.ts; docs/research/elevation-stroke-2026-10-18): the outline variant rests on `--_field-lift: var(--area-shadow-field)` and lists it before the focus halo, so the two crossfade; the soft variant's lift is transparent (flat, as Figma's). Field shadow is 0 by default, a transparent role: nothing changes until it is raised (Inspector → Edge and depth → Field shadow; owner, the same day: no named looks, nine individual controls). Under a Material the lift is listed beside the well (material.css).

## Review note, 2026-10-26 (interaction pass)

- **What changed:** The hover edge eases in on Feedback's hover clock, as Input's.
- **Why:** One hover clock for every field. You asked for the Slider's motion and detail pass on every component; measured across all 118 families ([the pass](../research/interaction-pass-2026-10-26/README.md)).
