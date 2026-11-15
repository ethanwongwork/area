# Input spec

**Captures:** `docs/research/captures/input/`
**Peers:** Textarea, Select, NumberField, InputGroup (field chrome), Field (label and
validation), Tooltip (InputAction hint), Button ghost (action plate)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Input and Field have
  also received a confirmation pass. Input's error entry points now agree on native
  `aria-invalid`, InputAction preserves external descriptions alongside its tooltip, and
  focused tests cover the Field label, description, validation, required and disabled
  relationships. Their existing variants remain intact and are expanded in the gallery.
  Both are owner-confirmed complete.
- Neutral by default, accent by override (2026-09-26): markers, rings and action labels are
  neutral ink unless the consumer asks for accent. The file picker's button label follows it.
- 2026-09-26, second pass ("decide all open items"): soft fields are flat (fill, no shadow),
  as Figma's are; the InputAction hint describes the button only when a separate label names
  it; control height stays 32px md (density is the UI-scale axis).

## Job and boundaries

Input accepts one line of text in a shell that owns the border, fill, focus and validation
paint; the native `<input>` inside is bare. Slots: a leading icon or loader, a prefix, the
control, a suffix, and one trailing icon, loader or InputAction. Multiline text is Textarea;
numbers with stepping or scrubbing are NumberField; several independently named values in
one shell are InputGroup; label, description and message are Field.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | outline (default), soft | Bordered field; fill-only field on an existing surface | UUI and Notion search (outline); ChatGPT, Notion menu and Figma search fields are fill-only |
| size | sm, md (default), lg | Control tiers | UUI sm/md/lg; Notion 28 (menu) and 32 (popover) |
| composition | leading/trailing icon, prefix/suffix, trailing action | Purpose icon, units, one clear/reveal action | ChatGPT, Notion and Figma search (leading icon) |
| state | read-only, disabled, invalid, success, warning, loading | Native and validation states | UUI (invalid, disabled) |
| boolean | fullWidth, monospace | Layout; code-like values | — |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (source) | Input, label, hint | [Untitled UI reference](../research/untitled-ui-reference.md):44-45, pinned `4702dc0` | MIT | — |
| chatgpt | target product | Sidebar search field | chatgpt.com, owner's session, read-only | evidence only | `baseline/chatgpt--search-field--rest--light` |
| notion | target product | Share popover field (focused); page menu search (focused); a search trigger with a shortcut hint (location not recorded in the capture) | app.notion.com, read-only, 2026-09-26 | evidence only | `input/notion--field--focus--light`, `input/notion--menu-search--focus--light`, `baseline/notion--search-field--rest--light` |
| figma | target product | File-browser search field; inspector hex field | figma.com file browser; editor (ColorPicker pass) | evidence only | `input/figma--search-field--rest--light`, `color-picker/figma--fill-row--rest--light` |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `input/area--*` |

Product anatomy (node numbers from the captures):
- ChatGPT search: 36 tall, pill, fill 5% black, no border, 14/18; 16px icon 12px in, gap 8.
- Notion menu search (nodes 0–4): 28 tall, radius 6, fill rgba(66,35,3,.03), no border;
  16px icon 6px in (equal inset, (28 − 16) / 2), 6px gap, 14/20.
- Notion Share field (nodes 0–3): 32 tall, radius 6, no fill or border, text 8px in.
- Notion search trigger: 32 tall, radius 8, 0.56px rgba(28,19,1,.11) edge, no fill, text
  8.55px in, resting text rgb(161,158,153), a 11px keycap at the end.
- Figma search (nodes 0–6): 32 tall, radius 8, fill rgb(245), no border; 24px icon box 4px
  in with a 12px glyph at 10 (equal inset), text at 34, 11/16.
- Focus, both Notion fields: `rgb(35,131,226) 0 0 0 1px inset, 0 0 0 1px`, a 2px blue ring.

## Anatomy

```
area   div.area-input  (shell: height, border, radius, fill, no resting shadow, focus; padding by inset.css)
  icon      span.area-input__icon     16px square slot, fg-muted
  affix     span.area-input__affix    fg-muted, cap-trimmed
  control   input.area-input__control bare; inherits type
  action    span.area-input__action > button.area-input__action-button (field − 8: 20 / 24 / 32, radius field − 4)
            > span.area-input__action-icon (16px); hint div.area-tooltip.area-input__action-tooltip
            (AnchoredTooltip: popover="manual", top layer, bottom side, end-aligned, 4 from the action)
```

Inset equation (`inset.css:17-18`): outer inset = border 1 + padding = (H − reference) / 2.
Text reference is 1cap (9.94px at 14px): md (32 − 9.94) / 2 − 1 = 10.03; sm 8.74; lg 14.03.
Icon reference 16: (32 − 16) / 2 − 1 = 7. Action reference H − 8 (20 / 24 / 32): (H − (H − 8)) / 2 − 1 = 3 at every tier
(`inset.css:146`).

## Measurements

`node scripts/capture-compare.mjs --slots shell` (trimmed; Area widths are the tile's):

| slot · property | area · default | area · soft | area · size-sm | notion · search-field | notion · menu-search · focus | notion · field · focus | figma · search-field |
|---|---|---|---|---|---|---|---|
| **shell** size | 256 × 32 | 256 × 32 | 256 × 28 | 246.01 × 32 | 232.02 × 27.99 | 356.02 × 32 | 224 × 32 |
| **shell** padding | 0 10.03 0 10.03 | 0 10.03 0 10.03 | 0 8.74 0 8.74 | 0 6 0 8 | 3 6 3 6 | 2 4 2 4 | 0 |
| **shell** border | 1 solid color(srgb 0.886275 …) | 1 solid rgba(0, 0, 0, 0) | 1 solid color(srgb 0.886275 …) | 0.56 solid rgba(28, 19, 1, 0.11) | 0 | 0 | 0 |
| **shell** radius | 8px | 8px | 8px | 8px | 6px | 6px | 8px |
| **shell** gap | 8px | 8px | 4px | — | — (6 measured) | 0px | — (6 measured) |
| **shell** background | rgb(255, 255, 255) | rgb(247, 247, 247) | rgb(255, 255, 255) | — | rgba(66, 35, 3, 0.03) | — | rgb(245, 245, 245) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px | — | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px | — | rgb(35, 131, 226) 0 0 0 1px inset, … 0 0 0 1px | same | — |

`area--soft` has no shadow (was `shadow-1` before the second pass). The shell gaps predate audit S14: the gap is now 6 at sm, md and lg. The size-sm radius was 8
at capture; since audit S4 it is 6. `area--action` node 7 (the
hint): 28 tall, padding 4 10, radius 10, fill rgb(40), ink rgb(250), opacity 0 at rest.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell · height | `control-md` 32 (sm 28, lg 40) | Notion 32 (popover, search) and 28 (menu); Figma search 32 | ChatGPT 36, UUI md 40. Density is the UI-scale axis (second pass, item 18) |
| shell · radius | per tier as Button: sm `radius-control-sm` 6, md `radius-control-md` 8, lg `radius-control-lg` 10, each capped at 0.4 × height (`input.css:39`, `:234-236`) | Notion search 8, Figma search 8, UUI 8; Notion's 28px menu field 6 | ChatGPT pill. Was 8 at every size before audit S4 |
| shell · border | 1px `input-edge` = `border-faint` #e2e2e2 | Notion search edge (11% warm ≈ #e3); UUI 1px ring | Fill-only products map to soft |
| shell · fill | outline `bg-surface` #fff; soft `bg-component` #f7f7f7 | Figma rgb(245), Notion 3% warm, ChatGPT 5% black for soft | — |
| shell · shadow | none at rest, outline and soft (`input.css:45, 54`); focus halo only | Outline pass (number-field.md): controls at rest carry no shadow; no product field draws one (Notion, Figma, ChatGPT) | Untitled's `shadow-xs`; the third pass had kept `shadow-1`, since removed |
| text · inset | 10.03 md (inset contract) | `inset.css:17-18` | Notion 8–8.55, Figma 8, ChatGPT 12, UUI 14: Area centres the cap height |
| text · type | 14/20 400 at every size (sm was 12/16 until small controls moved to 14/20; `density.ts`) | Notion 14/20 400; ChatGPT 14/18 400 | Figma 11/16; UUI md 16/24 |
| icon | 16px square, `fg-muted` #646464, equal inset (8 from the edge at md) | Notion 6 in a 28 row and Figma 10 in a 32 row are both (H − glyph) / 2 | ChatGPT 12 in |
| gap | **6** at sm, md and lg (`gap-sm/md/lg`, `input.css:18`, `:234-236`); also the file button's end margin (`input.css:138`); compact sm 4 | Notion 6 at 28, Figma 6 at 32 | ChatGPT 8 at 36. Was 8 (sm 4) until audit S14 |
| action · box | field height − 8: 20 / 24 / 32 (`input.css:19`), corner field radius − 4, concentric (md 24 box, 4 ring, radius 4, measured); hover `bg-component-hover`, pressed `bg-component-active`; on soft fields the translucent `bg-hover` / `bg-active` (`input.css:206-211`); disabled: `fg-disabled` ink, no hover, not-allowed cursor (audit B-8) | Audit B-7 B + C (owner); row-plate rule; NumberField steppers | Was a fixed 24 with `radius-small` 6; the opaque #f3 all but vanished on the #f7 soft fill |
| action · hint | a real Tooltip on the shared engine (`AnchoredTooltip`: `popover="manual"`, 500ms delay, bottom side, end-aligned, 4 from the action); describes the button only when `aria-label` names it (`describes`) | Peer: [Tooltip](tooltip.md); second pass item 17; audit S16 (owner 2026-09-30) | Was a second tooltip style, then a CSS-revealed absolute span (`input.css`, removed); was announced twice |
| file button | the field's action plate at rest: `--_action` tall (the field less a 4px ring), the action's concentric corner, `bg-component` (the soft wash on a soft field), hover and press one and two steps up; label `fg-default` 500 at a Button's inset for that height; the field's start inset measures it (inset.css) | Native pickers, shadcn and Untitled UI set the action apart; B-33: 500 on a fill | Was a bare 400 label in the field's ink (visual pass 2026-10-26); before that `fg-accent` |
| placeholder | `fg-placeholder` #646464 | UUI neutral-500; contrast | Notion's resting search text rgb(161,158,153) is 2.6:1 on white; kept (third pass): the contrast floor wins |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | border → `input-edge-hover` = `border-subtle` #d4d4d4; ink fixed | `input.css:62-64` |
| focus-within | Focus ring Hug (default): a `focus-width` (2) outline in `focus-color` (#0160d9 light, #79aeff dark) at `focus-offset` (0), the edge unchanged. Halo: the edge recolours to `field-focus-color` + 2px `field-focus-halo-color` halo (the same at 14%), outline 0 unless increased contrast (`field-focus-*` switches, emit/base.ts) | `input.css:66-71`; ChatGPT textarea focus: 1px `rgb(58,131,247)` edge (`chatgpt--textarea--focus`); Notion a 2px blue ring. Audit S1 (owner 2026-09-30): the focus role colours the edge |
| read-only | the variant's rest paint (no soft fill), no hover edge, default cursor (`input.css:66, :111`) | Audit B-9 B (owner); `area--readonly` predates it |
| disabled | the field shell's recipe (input.css, "Disabled and read-only"): fill #f7, `border-faint` (a soft field stays edgeless), ink, placeholder, affixes, icons and the action `fg-disabled`; no opacity. Read-only: the fill one step deeper (outline on the soft fill, soft on its hover step), the value's ink and edge kept, no hover edge | plan B7.8, B7.10 |
| invalid / success / warning | border and halo in the tone colour, kept on focus | `input.css:73-95`; `area--invalid`, `--success`, `--warning` |
| loading | Spinner in the icon slot; `aria-busy`; still editable | `area--loading`, `area--loading-leading` |
| action hover / focus-visible | plate `bg-component-hover` (soft field: `bg-hover`); 2px focus ring; hint opens after Tooltip's delay (hover, or keyboard focus) | `input.css:197`; [overlay.md](overlay.md) tooltip timing |

## Behavior and accessibility

Native `<input>`; ref and props forwarded to it, `className` and `style` to the shell (`Input.tsx:87-164`).
`invalid`, `validationStatus="error"` and `aria-invalid` agree. InputAction is a
`type="button"` named by `aria-label` or its tooltip text; the tooltip describes it only when
it is not already the name, plus any external `aria-describedby`. Logical properties make RTL
follow `dir`.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Textarea, Select, NumberField, InputGroup | field chrome | `input-edge`, per-tier `radius-control-sm/md/lg`, no shadow (outline or soft) | same | match (Select since 2026-09-29, audit B-2) |
| Button | radius per tier | 6 / 8 / 10 | 6 / 8 / 10 | match (audit S4) |
| Textarea, Select, NumberField, InputGroup | disabled | field paint, no opacity | same | match |
| InputGroup | validation on focus | success / warning tone held through focus (input-group.css:43-45) | tone kept | match (InputGroup's third pass) |
| Tooltip | hint surface | 28px, radius 10, 4/10 | same element class | match |
| Menu, Button ghost | hover plate | `bg-component-hover` | action plate | match |

## Visual pass

The gallery shows Input's tiles in named groups, one variant per tile. The action plate and hint appear only under the pointer; the file button label is
a pseudo-element and is not in `area--file`.

2026-10-26 (desktop app, the Stage at 100%, 2x, light and dark; the owner's request after the Slider pass): every
tile read at true scale. The file field read as one string ("Choose File No file chosen": a bare 400 label in the
field's own ink) → the button is the field's action plate at rest (Decisions, file button). The affix tiles looked
as if `+1` and `USD` sat lower than the value: measured, same 13px and baselines within 0.1px, so no change. The
rest unchanged.

2026-09-28 (batch 12, Claude in Chrome): beside Notion's sidebar search field (32, corner 8,
0.56px 11% warm edge, ⌘K keycap 6.9 from the top and 6.6 from the end), Notion's Share invite
field (32, corner 6, 2px accent focus ring, 8 text inset) and Figma's search (32, corner 8,
#f5 fill, no edge). Area outline and soft match on height, corner and paint; the 11 text inset
is the shared equal-inset rule. The Kbd templates found that a keycap in `suffix` sat off
centre; Input now reserves its box (8 / 8 / 8, `inset.css`). All `area--*` retaken with no
resting shadow. Unverified: hover and focus in the products (Chrome was a background window),
dark theme.

## Settled questions

All four kept in the third pass ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)):

1. *Focus ring.* Notion focuses both fields with a 2px `rgb(35,131,226)` ring
   (`notion--field--focus`, `notion--menu-search--focus` node 0); Area keeps the neutral
   field-focus edge plus a 2px `shadow-color` halo. Owner rule: neutral by default.
   *Superseded 2026-09-30 (audit S1):* the edge takes the focus colour and the halo is that
   colour at 14%, since focus is a system role, not an accent choice, and the neutral edge
   equalled hover (and rest, in dark).
2. *Outline shadow.* No product field has a shadow (Notion search, Figma search and selects,
   ChatGPT search); Area's outline fields keep `shadow-1`. Untitled's outline inputs carry
   `shadow-xs`; soft is the flat treatment. *Superseded by the outline pass: outline fields
   have no shadow (input.css:45, 54).*
3. *Small gap.* Notion's 28px menu search and Figma's search leave 6px between icon and text;
   Area's sm gap stays 4 (`gap-sm`), shared by every small control.
   *Superseded 2026-09-30 (audit S14):* the gap is 6 at sm, md and lg, as Notion and Figma.
4. *Placeholder ink.* Notion's resting search text is rgb(161,158,153)
   (`baseline/notion--search-field` node 0), 2.6:1 on white; Area's #666 holds the contrast
   floor.

## Verification

Compared the Area captures (`input/area--*`) with ChatGPT's search field, the three Notion
fields and Figma's search and hex fields. Build and test results are in the
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
| Action button plate (InputAction, password reveal) | no transition: instant in and out | hover and press in at once, out on `fast` / `ease-out` (`background-color` only); glyph ink fixed |
| Password reveal glyph swap | instant | unchanged (a swap, not a fade) |
| Action focus ring (outline) | instant | unchanged |

Crispness: no resting transform, no `will-change`; every shell, icon slot and action box measured on
whole pixels at DPR 2 (`input.html`, 21 fields). Open: 12px icon slots (sm) still draw 16px glyphs at
0.75 (system B5, icons, not this file).

Open questions: (1) a field left by Tab while the pointer rests on it snaps its edge to the hover
grey while the halo fades (the hover rule is 0s for paint); recommendation: keep, the halo carries
the exit. (2) A tone cleared while the field is not focused fades on `fast`; a tone cleared while
typing is instant. CSS cannot tell the direction; recommendation: keep.

## Interaction polish, 2026-10-16

Action buttons press at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover) (soft fields: `bg-pressed`). Not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-09-28 · batch 12 Chrome side by side → Input `suffix` centres a Kbd (found by the Kbd
  templates); spec's resting shadow corrected to none → `notion--search-field-kbd--rest--light`,
  `notion--invite-field--focus--light`, `area--*` retaken.
- 2026-09-28 · owner: "the calendar icon doesnt look aligned like the other trailing icon inputs
  … use the real one" → the native date input (its picker glyph sat at the 11 text inset) is
  replaced in the gallery by a composition: read-only Input showing the date, the calendar glyph
  as a trailing icon (8 from the end, like every trailing icon), opening Calendar in a Popover
  anchored to the whole field (new Popover `anchor` prop), focus on the chosen day, Enter,
  Space or ArrowDown open it → `area--date--rest--light` retaken.
- 2026-09-28 · owner: "the date picker extends too big. other than that its approved" → the
  Popover took its 320 reading width around a 252 grid (44 empty on the right); a Popover holding
  only a Calendar now hugs it (276, 12 all round; `surface.css`). Batch 12 approved.

- 2026-09-26 · cohesion audit → InputAction hint renders the Tooltip surface; file button
  label neutral → `area--action` node 7 (28px, radius 10, 4/10 inset).
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → soft Input is flat
  (no shadow); the hint is not announced twice; four open
  questions recorded → `input/notion--field--focus`, `notion--menu-search--focus`,
  `figma--search-field`, `baseline/notion--search-field`, `input/area--soft`.
- 2026-09-27 · third pass → open questions settled, values kept (neutral focus, outline
  `shadow-1`, sm gap 4, placeholder #666) → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-30 · audit S4 (owner) → radius follows the tier as Button: sm 6, md 8, lg 10 (`--_radius` per size, `input.css:39`, `:234-236`); was 8 at every size.
- 2026-09-30 · audit S14 (owner) → the icon-to-label gap is 6 at sm, md and lg (was 4 / 8 / 8), from the density tokens (`input.css:18`, `:234-236`; density.ts:80-82); settles third-pass question 3 toward Notion and Figma.
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → `style` lands on the shell with `className` (Input.tsx:125; was the inner input), so width and margin overrides size the whole field.
- 2026-10-01 · audit B-7 (owner pick B+C) → the action is field height − 8 (20 / 24 / 32) with corner field radius − 4, concentric (md: 24 box, 4 ring, radius 4, measured); on soft fields it hovers and presses with translucent `bg-hover` / `bg-active` → input.css:17-19, :200-211.
- 2026-10-01 · audit B-9 (owner pick B) → read-only keeps its variant's rest paint (was the soft fill), no hover edge, default cursor; a soft field never gains an edge when disabled → input.css:66, :108-112.
- 2026-10-01 · audit B-10 → icons and the action take `fg-disabled` with the field → input.css:139-141.
- 2026-10-01 · compact pass → the inline action button is `min(icon + 8, height − 4)`: compact sm (24 with a 16 icon) made it 24, filling the field (0 from the top, 1 from the end); it is now 20, 2 clear on every side. Default unchanged. docs/research/compact-pass-2026-10-01.md.
- 2026-10-03 · radius audit → the action button is concentric with the field, floored at the smallest control's corner (20 r2 → r4 compact, 24 r4 → r5 default; `input.css:213`). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · all even (owner) → the action button floors at `radius-floor` 4 (`input.css:213`).
- 2026-10-04 · pill shapes and list rows (owner) → `--area-pill-field` (data-area-pills="field") makes the field a pill, its action button concentric (`input.css`). `docs/research/radius-audit-2026-10-03.md`, "Pill shapes and list rows".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → motion pass: hover and focus edge and the focus halo appear at once and fade out on `fast`; tones land at once; the action plate gains the same in-at-once, out-on-fast fade (`input.css`). See "Motion and interaction, 2026-10-07".
- 2026-10-12 · radius at the extremes (owner) → a field's sides clear half its corner: a 24px pill field holds its icon 6 in, not 4; fields at the default radius never move (`inset.css`, shared with Select, Number field, Custom select and Date picker triggers). Heights follow type size and density (`control-*`, emit/base.ts). `docs/research/ui-size-scale-2026-10-12.md`.
- 2026-10-15 · owner: "merge it, then continue working" → boundary sweep under increased contrast (CONTRAST.md: required boundaries target 3:1): the soft variant's resting edge is `input-edge-soft`, none at standard contrast and the strong control edge at more; its fill alone read 1.07:1 (now 3.79:1 light, 5.49:1 dark).
- 2026-10-18 · owner: "go with your recommendations … finalize the material, surface, stroke, elevation axis theming" → Edge and Depth (axes/depth.ts; docs/research/elevation-stroke-2026-10-18): the outline variant rests on `--_field-lift: var(--area-shadow-field)` and lists it before the focus halo, so the two crossfade; the soft variant's lift is transparent (flat, as Figma's). Field shadow is 0 by default, a transparent role: nothing changes until it is raised (Inspector → Edge and depth → Field shadow; owner, the same day: no named looks, nine individual controls). Under a Material the lift is listed beside the well (material.css).
- 2026-10-21 · owner's picks on the state page (https://claude.ai/artifact/3uKMHRhpWnPqNA6pK4WfD9) and "capture some of these options as options for the design system customization … keep my current selections as the default" → focus at the Hug default is ChatGPT's `ring-2 ring-offset-0` on the field (was the recoloured edge and halo, kept as Focus ring Halo); every field family reads the same switches (Input, Textarea, Date picker, Custom select, Select, OTP, Number field, Tag picker, Input group). input.css and peers.
- 2026-11-14 · plan B7.8, B7.10 → disabled and read-only are the field shell's disabled and read-only recipe (input.css): disabled is the disabled fill, the faint edge (none on soft) and fg-disabled on the value and every part; read-only takes one cue, the fill one step deeper (outline on the soft fill, soft on its hover step), with the value's ink, edge and focus kept and no hover edge. The audit B-9 call (read-only at rest paint) is superseded: B7.10 asks for a visible read-only. Why: docs/research/system-evaluation-2026-11-11 (README §5, phase2/disabled.md); the owner took every recommendation on 2026-11-11.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

## Review note, 2026-10-23 (press room)

- **What changed:** the muted ink is #646464 at the defaults, was #666666 (2/255 darker).
- **Why:** text is now solved on the deepest ground's selected fill pressed one readable step further, so a press shows
  on a sidebar too (it equalled the selected plate there). THEMING.md, Interaction states; `color/layers.ts` `PRESS_ROOM`.

## Review note, 2026-10-26 (interaction pass)

- **What changed:** The hover edge eases in on Feedback's hover clock (about 91ms) instead of landing at once; focus and validation still land at once.
- **Why:** Five fields landed it at once and six eased it in, side by side in the Inspector. You asked for the Slider's motion and detail pass on every component; measured across all 118 families ([the pass](../research/interaction-pass-2026-10-26/README.md)).

## Review note, 2026-10-26 (visual pass)

- **What changed:** In a file field, "Choose File" is now a small soft button inside the field, 4 from its edge, with
  the field's concentric corner; it was plain text in the same ink as "No file chosen".
- **Why:** The two read as one sentence with nothing marking the action. Native pickers, shadcn and Untitled UI all
  set the button apart; Area's own rule puts a 500 label on a fill.

### 2026-11-07 · One dismiss API and part (system gaps C4)

- **What changed:** the leading glyph is `icon` again, as every other family's; `leadingIcon` stays as a deprecated alias (`icon` wins).
- **Why:** one dismiss API and one part name across the families that close or remove (Governance § 4; owner picked Build on the system gaps review, 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-07 · onValueChange (components audit O3)

- **What changed:** `onValueChange(value, event)` runs after native `onChange` (and not when it calls `preventDefault`), as Checkbox's `onCheckedChange`; Password field inherits it.
- **Why:** Input.tsx:10-44 had native `onChange` only, while Search field on the same Input had `onValueChange`. From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.

## Review note, 2026-11-11 (focus and targets, plan A6, A11.2)

- **What changed:** The action owns the shared hit target, 24, 44 tall under a coarse pointer (A11.2).
- **Why:** the system evaluation's focus, forced colours and hit target items (docs/research/system-evaluation-2026-11-11, section 5), owner-approved 2026-11-11; the rules are in DESIGN_SYSTEM.md ("The focus ring", "Targets") and CONTRAST.md (Focus).

### 2026-11-11 · Ink, dark and colour (system plan, Phase 1)

- **What changed:** The placeholder is the subtle ink (`fg-placeholder` = `fg-subtle`, plan A3.2), a hair lighter than muted in light (#696969); in dark it is muted's #b9b9b9 (was #c5c5c5), where the APCA floor leaves no room under it. Dark state edges and messages use luminous vivid inks (plan A10.2): danger #fe999e (chroma 0.12, was #feb0b3 at 0.09), warning #fe9f53.
- **Why:** docs/research/system-evaluation-2026-11-11 (README §5); the owner took every recommendation on 2026-11-11.
- **Verdict:** awaiting the owner.

### 2026-11-14 · One field shell (system plan, Phase 2, B3)

- The shell (edge, corner, fill, lift, tiers, soft, hover edge, focus, status) moved into the one field shell at the top of input.css, which every field family reads; Input's own copy is gone. Soft hover edge = the control edge (unchanged for Input). No visible change.
- Why: docs/research/system-evaluation-2026-11-11 (B3.1, B3.2, B3.3, B2.2 in fields; README §5); the owner took every recommendation on 2026-11-11 and the 24 targets on 2026-11-13. B3.2: field text stays on Button's inset (Keep 10, the pick), so nothing moved.
- Verdict: awaiting the owner.

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- A pill is one value: while the Pills set rounds it, its corner is `radius-full` itself, `max(corner, flag × full)`, never the corner plus full (it computed the corner plus 9999px). Draws the same; the corners snapshot records 9999px.
- Every field shell reads it (`--_field-shape`): Number field, Input group, Select, Textarea, Custom select, Date picker, Tag picker, OTP slot; a field's list rows the same, inside their cap.
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.
