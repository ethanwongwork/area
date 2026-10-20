# Toggletip spec

**Captures:** `docs/research/captures/toggletip/`
**Peers:** Tooltip (the note's surface, timing and offset), Field (the label it sits beside), Button ghost (the hover and pressed plates), Input (the chevron's quiet ink), Link (a link inside the note), Hover card (a hover preview of a link, not a control)

## Owner decisions

- 2026-10-09: "work on the next component" after File upload: Toggletip, the next item on the gap audit's
  recommended order (`docs/research/component-gap-audit.md` §5, item 12; Hover card, its pair, was built 2026-09-26).
- 2026-10-18: "Keep the Toggletip note as a Tooltip: no Material." Neither the button nor the note takes a Material
  (see Settings collisions fixed, below).

## Job and boundaries

A small info or help button beside a label, with a sentence or two about it: what a setting does, why a value is
what it is. The note previews on hover and keyboard focus, as a Tooltip, and a press pins it open, so touch reaches
it and a link inside it can be followed. Not Tooltip (the name of a control, never interactive), not Popover (a
task: fields, choices), not Hover card (a preview of what a link points to), not Field's description (text that
must always show: Fluent's rule, "don't include information that people must know in order to complete the field").

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | md (default), sm | md beside 14/20 labels; sm beside 12/16 captions | Notion and ChatGPT settings rows (14/20); Fluent `size` small / medium / large follows its label; Carbon's 12 label |
| icon | info (default), help | Spectrum's `variant`: info explains, help guides. Only the mark changes, so it is a prop, not a manifest variant | ChatGPT `circle-info`; Notion `questionMarkCircle`; Fluent, Carbon info; Untitled UI `HelpCircle`; Spectrum both |
| side / align | Tooltip's (top, centre) | The note is a Tooltip surface | Notion above and centred; ChatGPT below; Fluent top-start; Carbon bottom; Spectrum bottom-start |
| content | text, text + Link | Fluent's InfoLabel and Spectrum's footer link; Carbon's actions | Fluent "Learn more", Spectrum "Learn more about segments" |

Excluded: Fluent's large (a 16/22 semibold label is a heading; a heading row takes md), Spectrum's heading and
footer slots and Carbon's buttons in the note (a note that needs a title or actions is a Popover), Notion's media
preview (an image in the note: Hover card's job), an InfoLabel wrapper (see Open questions).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Settings › Usage, "Reset your usage limits now" with a 12 info button ("How buying a reset works"); hover and focus show its tooltip; a press does not pin it | chatgpt.com (owner's Chrome, read-only), 2026-10-09 | evidence only | `chatgpt--usage-info--{rest,hover}--light`, `chatgpt--usage-info-tooltip--open--light` |
| notion | target product | Settings › Notifications, "?" after three row labels; hover shows a dark tooltip with a preview image | app.notion.com (owner's Chrome, read-only), 2026-10-09 | evidence only | `notion--settings-help--hover--light`, `notion--settings-help-preview--open--light` |
| figma | target product | File browser: only the Help widget (32, bottom right); the editor was not opened | figma.com/files (owner's Chrome), 2026-10-09 | evidence only | none |
| fluent | design system (rendered + docs) | InfoLabel / InfoButton: sm, md, lg; hover, open | storybooks.fluentui.dev `components-infolabel--docs`, 2026-10-09 | MIT | `fluent--info-label-{sm,md,lg}--rest`, `fluent--info-label-md--{hover,open}`, `fluent--info-surface-md--open` |
| spectrum2 | design system (rendered) | ContextualHelp, help, XS; hover, open | react-spectrum.adobe.com/ContextualHelp, 2026-10-09 | Apache-2.0 | `spectrum2--help-xs--{rest,hover,open}`, `spectrum2--help-surface--open` |
| carbon | design system (rendered) | Toggletip default; open | react.carbondesignsystem.com `components-toggletip--default`, 2026-10-09 | Apache-2.0 | `carbon--toggletip--{rest,open}`, `carbon--toggletip-surface--open` |
| uui | design system (source) | Input `tooltip`: a `HelpCircle` 16 (`size-4`, stroke 2.25) in `text-fg-quaternary`, hover `fg-quaternary_hover`, in a Tooltip (delay 300, offset 6) | untitleduico/react@8b7409c, `components/base/input/input.tsx:141-154`, `components/base/tooltip/tooltip.tsx:40-46` | MIT | source only |
| area | this system | Every gallery tile at 1:1, hover, pinned, the live note, dark, compact | localhost gallery | — | `area--*` (14) |

All product captures are redacted (text, ids and labels removed).

**Behavior read in the references.** ChatGPT and Notion: hover (and focus) only; ChatGPT's press leaves it closed.
Fluent: click, Enter or Space opens a popover with `role="note"` and moves focus into it; "InfoButtons can not be
opened on focus". Spectrum: press opens a dialog popover (heading, content, footer link). Carbon: press toggles
(`aria-expanded`); focus stays on the button. Untitled UI: hover and focus, 300 delay.

## Anatomy

```
chatgpt  span.flex.gap-1 (label row, 14/20 500)  >  span.truncate (label) · button 12 × 12 (no padding)  >  svg 12 (ink 9.96)
notion   div (label row, gap 6, 14/20 500)  >  label · span 16 > svg.questionMarkCircle 16 (ink 12.25), not a button
fluent   span.fui-InfoLabel  >  label (14/20) · button 24 (padding 4, radius 4, overhangs the 20 line by 2.5 / 3)  >  svg 16
spectrum button 20 (radius 6, quiet ActionButton)  >  svg 14
carbon   div  >  span label (12/16) · gap 8 · button 16 (no padding)  >  svg 16

area     button.area-toggletip(--md|--sm)  (the box: one text line, square; plate, radius, focus ring; ::after 24 target)
           svg[data-area-glyph=info|help]   (16 / 12, centred: 2 in on each side)
         span.area-tooltip.area-toggletip__surface[popover=manual]  (the note: Tooltip's surface, display block)
```

Insets: the box is the line (20 = 14/20's leading), so the button adds no height to a label row and needs no
negative margin (Fluent's 24 overhangs). Icon 16 inside 20: 2 on each side; the ring's ink 1.44 inside the glyph box,
so ink sits 3.4 in from the box. Label end to ink: 4 gap + 2 + 1.4 = 7.4 (ChatGPT 4 + 1 = 5, Notion 6 + 1.9 = 7.9,
Fluent 0 + 4 + 1 = 5, Carbon 8 + 1 = 9). Note: Tooltip's 4 / 10 inset, 4 from the box (ink to note 4 + 2 + 1.4 = 7.4;
ChatGPT 6 + 1 = 7, Notion 6 + 1.9 = 7.9).

## Measurements

Trigger (generated with `node scripts/capture-compare.mjs` on `area--default--rest--light` and the five references'
rest captures; rows filtered):

| slot · property | area · default · rest · light | chatgpt · usage-info · rest · light | notion · settings-help · hover · light | fluent · info-label-md · rest · light | spectrum2 · help-xs · rest · light | carbon · toggletip · rest · light |
|---|---|---|---|---|---|---|
| **shell** size | 150.74 × 20 | 490 × 20 | 325.75 × 20 | 108.93 × 18.5 | 20 × 20 | 940 × 16 |
| **shell** padding | 0 | 0 | 0 | 0 | 1 0 1 0 | 0 |
| **shell** radius | 0px | 0px | 0px | 0px | 6px | 0px |
| **shell** gap (row / column) | 4px / 4px | 4px / 4px | 6px / 6px |  | 4.71428px |  |
| **shell** font | 14px/20px 400 Geist | 14px/20px 500 -apple-system-body | 14px/20px 500 ui-sans-serif | 14px/20px 400 "Segoe UI" |  | 16px/16px 400 "IBM Plex Sans" |
| **shell** color | rgb(40, 40, 40) | rgb(13, 13, 13) | rgb(44, 44, 43) | rgb(36, 36, 36) |  | rgb(22, 22, 22) |
| **action** size | 20 × 20 | 12 × 12 | — | 24 × 24 | — | 16 × 16 |
| **action** edge from shell (t r b l) | 0 0 0 130.74 | 4 290.02 4 187.98 | — | -2.5 0 -3 84.93 | — | 0 832.36 0 91.64 |
| **action** padding | 0 | 0 | — | 4 | — | 0 |
| **action** radius | 4px | 0px | — | 4px | — | 0px |
| **action** gap (row / column) |  | 4px / 4px | — |  | — |  |
| **icon** size | 16 × 16 | 12 × 12 | 16 × 16 | not found | 14 × 14 | 16 × 16 |
| **icon** edge from shell (t r b l) | 2 2 2 132.74 | 4 290.02 4 187.98 | 2 0 2 309.75 | not found | 3 3 3 3 | 0 832.36 0 91.64 |
| **icon** padding | 0 | 0 | 0 | not found | 0 | 0 |
| **icon** radius | 0px | 0px | 0px | not found | 0px | 0px |
| **icon** gap (row / column) |  |  |  | not found |  |  |
| **icon** font |  |  |  | not found |  |  |
| **icon** color | rgb(131, 131, 131) | rgb(143, 143, 143) | rgb(173, 169, 163) | not found | rgb(41, 41, 41) | rgb(0, 0, 0) |
| **icon** svg viewBox · rendered | 0 0 16 16 · 16 × 16 | 0 0 12 12 · 12 × 12 | 0 0 16 16 · 16 × 16 | not found | 0 0 20 20 · 14 × 14 | 0 0 16 16 · 16 × 16 |
| **icon** svg ink from shell (t r b l) | 4 4 4 134.74 | 5.02 291.04 5.02 189 | 3.87 1.88 3.88 311.62 | not found | 3.88 3.87 3.87 3.88 | 1 833.36 1 92.64 |

Fluent's icon slot resolved to its hidden filled cut; from the markdown readout of the same capture, its regular cut
is 16 inside the 24 button (4 in), ink 14. Spectrum's capture is the button alone (20, its 14 mark 3 in).

Note (`area--note--open--light`, the live pinned note, and the references' open surfaces):

| slot · property | area · note · open · light | chatgpt · usage-info-tooltip · open · light | notion · settings-help-preview · open · light | fluent · info-surface-md · open · light | spectrum2 · help-surface · open · light | carbon · toggletip-surface · open · light |
|---|---|---|---|---|---|---|
| **shell** size | 288 × 48 | 320 × 48 | 327 × 128.99 | 290 × 58 | 268 × 178 | 288 × 159.97 |
| **shell** padding | 4 10 4 10 | 5 12 5 12 | 5 8 5 8 | 12 | 0 | 0 |
| **shell** border | 0 | 1 solid oklab(0.999994 0.0000455678 0.0000200868 / 0.05) | 0 | 1 solid rgba(0, 0, 0, 0) | 0 | 0 |
| **shell** radius | 10px | 16px | 6px | 4px | 10px | 2px |
| **shell** font | 14px/20px 400 Geist | 14px/18px 600 -apple-system-body |  | 12px/16px 400 "Segoe UI" | 16px/normal 400 Times | 16px/16px 400 "IBM Plex Sans" |
| **shell** color | rgb(250, 250, 250) | rgb(255, 255, 255) |  | rgb(36, 36, 36) | rgb(0, 0, 0) | rgb(255, 255, 255) |
| **shell** background | rgb(40, 40, 40) | rgb(13, 13, 13) | rgb(44, 44, 43) | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(57, 57, 57) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 4px 12px -2px, rgba(0, 0, 0, 0) 0px 0px 0px 1px inset | rgba(15, 23, 42, 0.2) 0px 8px 18px 0px | rgba(0, 0, 0, 0.08) 0px 4px 12px -2px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset |  | rgba(0, 0, 0, 0.08) 0px 4px 12px 0px, rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.12) 0px 0px 2px 0px |  |

Area at compact (`area--default--compact--light`): label 12/16, box 16, mark 12 (radius 4). At sm: box 16, mark 12.
Dark (`area--default--rest--dark`): mark rgb(147, 147, 147) (`stroke-control` dark); note rgb(40, 40, 40) with
Tooltip's 5% white inset edge.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| trigger · element | a `<button>` (`type="button"`), named "More information" or "Help" (`label`, or `aria-label`) | Fluent, Spectrum, Carbon, ChatGPT are buttons; WCAG 4.1.2 | Notion's mark is not focusable, so keyboard users never reach its note |
| trigger · box | the text line: `--area-ui-leading` (20; compact 16); sm `--area-text-xs-leading` (16) | ChatGPT's 12 and Notion's 16 boxes sit inside a 20 line; Fluent 24 overhangs it | A box larger than the line moves the label row (Fluent needs −2.5 / −3 margins). Square, as inset.css asks |
| trigger · mark | 16 (sm and compact 12); Area's `info` / `help` glyphs | Notion 16, Fluent md 16, Carbon 16, Untitled UI 16 | ChatGPT 12 beside 14/20 is sm's pairing; Spectrum 14 |
| trigger · mark weight | `--area-weight-icon` at 16 (1.125); at compact the md mark keeps the 12px line of the size curve | Geist 14 stem 1.2 (COMPONENT_ADAPTATION, Weight); base.css size curve | — |
| trigger · ink | `--area-input-chevron` (stroke-control: #838383 light, #939393 dark), fixed on hover | ChatGPT #8f8f8f, Notion rgb(173, 169, 163), Untitled quaternary: quieter than the label | Fluent rgb(66), Spectrum rgb(41), Carbon black: darker. The field chevron's role (Select, Combobox), 3.8:1 on white |
| trigger · hover | `bg-component-hover` plate (#f3f3f3), ink fixed | Area: foreground fixed on hover; the neutral ghost Button's plate; Spectrum plates (rgb 225) | ChatGPT, Fluent and Untitled darken the ink instead |
| trigger · pressed, pinned | `bg-component-active` (#eeeeee) while `aria-expanded="true"` | An open menu trigger keeps the pressed plate (button.css); Spectrum's open plate | — |
| trigger · radius | the control corner for the box: 4 at 20 and 16 (radius setting) | Tag's formula; Fluent 4 on 24 | Spectrum 6 on 20 |
| trigger · target | 24 square (44 on coarse pointers), invisible, centred | WCAG 2.5.8; Tag's remove; Fluent's sm warning | — |
| trigger · focus | the focus ring, offset 0 | Tag's remove (a small control inside text) | Button's offset 2 would cross the label |
| label gap | 4 (the consumer's row, as Field's label gap); in running text, one space | ChatGPT 4; Field label `gap: space-4` | Notion 6, Carbon 8, Fluent 0 with 4 padding |
| note · surface | Tooltip's (inverse #282828, 10 corner, 4 / 10 inset, 14/20, 288 max, its lift), a block that wraps; untrimmed (two lines 48) | ChatGPT and Notion show these notes on their tooltips; Carbon's is dark | Fluent and Spectrum use a light popover (12 and 24 insets), which reads as a task surface |
| note · element | a `<span popover="manual">` after the button | Phrasing content, so the pair can sit in a `<p>` or label row (Hover card's #418 lesson) | — |
| note · placement | Tooltip's: top, centred, 4 from the box, flips and shifts (`useAnchoredPosition`) | Tooltip spec; overlay spec | Products 6 from a box that is their mark's ink box; from ink Area is 7.4, theirs 7 and 7.9 |
| open · hover | after 500 (Tooltip's delay), closes on leave unless the pointer moves onto the note (bridge) | ChatGPT and Notion open on hover; Tooltip's timing | Untitled 300 |
| open · focus | keyboard focus (`:focus-visible`) shows it at once; blur closes it | ChatGPT; Tooltip's rule | Fluent opens only on press |
| open · press | a press (click, Enter, Space, tap) pins it: `aria-expanded="true"`; it stays until a second press, Escape, a press outside, or focus leaving both | Fluent, Spectrum, Carbon: the toggletip contract; touch has no hover | ChatGPT's press does nothing, so its note is unreachable on touch |
| semantics | the note describes the button (`aria-describedby`); `aria-controls` points at it; no `role="tooltip"` | Tooltip's description; Carbon's `aria-expanded` | The note may hold a link, which a `tooltip` role must not |
| focus | stays on the button; Tab from the pinned button moves into the note's link (DOM order); Escape from the link returns focus to the button | Carbon; WCAG 2.4.3 | Fluent moves focus into the note on open |

## States

| State | Changes | Evidence |
|---|---|---|
| rest | mark in `stroke-control` ink, no plate | `area--default--rest--light` |
| hover | `bg-component-hover` plate; ink unchanged; the note after 500 | `area--default--hover--light` |
| focus-visible | focus ring; the note at once | keyboard check (Verification) |
| pinned (`aria-expanded="true"`) | `bg-component-active` plate; the note stays | `area--default--open--light`, `area--note--open--light` |
| disabled | native `disabled` (the button takes no events) | test |

## Behavior and accessibility

Native button: Enter and Space press it. The name is the button's own (`label`); the note is its description, so
a screen reader reads "More information, button, collapsed, Members can find this page in search…" on focus. A
pinned note keeps `aria-expanded="true"`. Escape closes it in Tooltip's capture-phase handler and is consumed, so a
Dialog or Popover underneath stays open. Hover content stays while the pointer is over it (WCAG 1.4.13). Touch never
previews (`hovers()`), a tap pins. Reduced motion: Tooltip's tokens. Forced colors: the mark is `currentColor`; the
plate and ring follow the forced-colors stylesheet's button rules (not checked in a forced-colors browser).

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Tooltip | annotation surface, delay, offset | inverse, 10, 4 / 10, 500, 4 | the same; a block that wraps | match |
| Button ghost (neutral) | hover and pressed plates | `bg-component-hover` / `-active` | the same | match (was `bg-hover`, translucent, before the visual pass) |
| Select, Combobox chevrons | quiet affordance ink | `--area-input-chevron` | the same | match |
| Tag remove | small control inside text: corner formula, 24 target, ring offset 0 | yes | yes | match |
| Field label | row gap | 4 | 4 in the demos | match |

## Visual pass

2026-10-09, gallery at 1:1 (1600 viewport, the tile zoom held at 1) beside the captures above, light, dark and
compact. The mark reads a step quieter than the label, as ChatGPT's and Notion's do, and the 1.125 line sits with the
label's 1.2 stem. The plate is the size of the line and only shows on hover or while pinned. The two-line note reads
as Tooltip's: 48 tall for two lines, ChatGPT's two-line note 48. In a wrapped label the button takes the last line's
box, so it stays on the line. Change: the hover and pinned plates moved from `bg-hover` / `bg-active` (translucent
washes) to the neutral ghost Button's `bg-component-hover` / `-active`, the row plates every quiet control uses. Not
compared side by side in Claude in Chrome with the live products (captures only), so no pass-status entry.

## Verification

- `npm run build:docs` (manifest parity, token references, docs audit), `npm run typecheck`: pass.
- `node --test packages/react/tests/toggletip.test.mjs`: 4 pass (names, description, glyph paint, props, variants).
- Browser (built-in pane, real pointer and keys): hover opens after 500 and closes on leave; a press pins it
  (`aria-expanded` true, plate #eeeeee) and it survives the pointer leaving; a press outside closes it; a second
  press closes it; Escape closes it with focus on the button; Tab focus shows it at once, Enter pins, Tab moves into
  the link and keeps it open, Escape from the link returns focus to the button, Tab past the link closes it. Live
  note: 288 × 48, 4 above the box, centred within 0.4.
- A bug found and fixed on the way: closing returned focus to the button from the page, which read as keyboard focus
  and reopened the preview; focus now returns only from inside the note.
- Unverified: touch (a real tap), screen readers, forced colors, RTL, the pinned note in dark (captured at rest only).

## Open questions

1. **Field label slot.** A Toggletip inside Field's `<label>` would put "More information" into the input's name.
   Fluent ships InfoLabel (label and button as siblings). Recommendation: add a `labelAction` (or `info`) slot to
   Field that renders after the `<label>`, in a later change (Field is Complete, so it would reopen it).
2. **Mark: info or help by default?** Three references lead with info (ChatGPT, Fluent, Carbon), three with help
   (Notion, Untitled UI, Spectrum's default). Recommendation: info, the component's job is explaining.
3. **Ink.** `stroke-control` (#838383) is between ChatGPT's #8f8f8f and the muted text (#666). Notion is lighter
   (#ada9a3). Recommendation: keep the chevron's role, so every quiet affordance in a form shares one ink.

## Interaction polish, 2026-10-16

The trigger presses at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover); open keeps `bg-component-active`. Not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log
- 2026-10-12 · spacing step extrapolated past Default → the icon size and stroke take only the compact step (`clamp(0, ui-dense, 1)`, `toggletip.css`). `docs/research/ui-size-scale-2026-10-12.md`.

## Settings collisions fixed (2026-10-18)

Elevation and Stroke audit (docs/research/elevation-stroke-2026-10-18): material.css listed `.area-toggletip` among
its overlays, but that class is the info button, a ghost mark; the note is `.area-tooltip.area-toggletip__surface`. Under
any Material the button took a see-through glass plate, the overlay ring and frost. The button is out of every Material
list, so it keeps its own transparent box, hover plate and no shadow under every bundle; with no Material nothing
changed. Checked in the app (light and dark, None, Glass and Glow).

Owner decision (2026-10-18): "Keep the Toggletip note as a Tooltip: no Material." The note is a Tooltip, inverse, and
takes no Material under any bundle, as Tooltip.
