# Kbd spec

**Status:** Complete · owner approved batch 11, 2026-09-28 (6px corner everywhere, filled with no stroke, plain text in menus, ⎋ glyph for Escape; Escape written "Esc" since audit S12b, 2026-09-30)
**Captures:** `docs/research/captures/kbd/` (Area tiles, `notion--shortcut-hint`, `chatgpt--shortcut-chip`, `figma--shortcut-panel-*`), `menu/notion--item-shortcut`, `menu/figma--item`, `tooltip/*--shortcut*`
**Peers:** Tooltip (adapted on-color shortcut), Button (trailing shortcut), Menu and Nav (quiet trailing shortcut), Code (inline technical label), Badge (small chrome)

## Owner decisions

No Kbd section existed in [prior decisions](PRIOR_DECISIONS.md). "Neutral by default, accent
by override" (2026-09-26) does not apply: Kbd has no selected or current state.

- 2026-09-26 (second pass): decide every open item with the most calculated option
  consistent with the system. For Kbd: a filled keycap with no edge, radius 4, muted ink at
  500, concentric inside Buttons; the small keycap keeps 11px text (audit decision 3); the
  chord is announced through visually hidden text (decision 14).
- 2026-09-28: "double check the kbd button is correct, it looks too sharp, also thought kbd
  had a stroke around it?" Corner raised to 6 and no longer concentric in Buttons (see the
  feedback log); the stroke is shown as a proposal in the gallery review and awaits the owner.
- 2026-09-28 (after the review): "the kbd doesnt have to keep the same corner radius at every
  size, but i think 2 is way too sharp, consistent 6 works tho." The 6px corner stands; a
  size-dependent corner is allowed later, but never down to 2.
- 2026-09-28: "maybe just keep 6px for everything then as a rule, to make things easier. how
  does kbd look in menu, and other components? show as many examples to show it in context?"
  Rule: 6px (`radius-control-sm`) at every size and in every host; no per-host corner rules.

## Job and boundaries

Kbd shows one keyboard chord (one flat keycap holding its keys); KbdGroup shows a sequence
of chords. It is display-only: the shortcut is wired and announced on the action with
`aria-keyshortcuts`. Inline source is Code; status is Badge (DESIGN_SYSTEM.md, Icons and
technical labels).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | md 20 (default), sm 16 | Standalone hints and Buttons; dense trailing metadata | Notion keycap 18.29 (`notion--shortcut-hint`); ChatGPT tooltip chip 18; Figma 11px shortcut text |
| variant | default, quiet, on-color (`on-emphasis` is a deprecated React alias, audit A-15) | Keycap; menu chrome; on a coloured action; in an inverse Tooltip | Notion filled keycap (default); Notion and Figma menu shortcuts as plain text (quiet); ChatGPT tooltip chip (translucent) |
| composition | chord, sequence (KbdGroup) | Modifier chords; "⌘K then P" | Gallery `chord`, `sequence` |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Shortcut hint keycap: 26 × 18, radius 4, 7% warm fill, no border, 11px 500 muted | app.notion.com, owner's workspace, light, read-only, 2026-09-26 | evidence only | `notion--shortcut-hint--rest--light` |
| notion | target product | Menu item shortcut as plain 12px text, rgb(161, 158, 153); tooltip shortcut as a second text line | page menu (2026-09-26); Tooltip pass | evidence only | `menu/notion--item-shortcut--rest--light`, `tooltip/notion--shortcut-stacked--rest--light` |
| figma | target product | Main-menu item shortcut as plain 11/16 text at 70% white (dark menu) | figma.com editor, 2026-09-26 | evidence only | `menu/figma--item--rest--light` |
| chatgpt | target product | Tooltip shortcut chip: 18px, radius 8, white 25%, no edge (its classes force `!border-0 !shadow-none`) | Toggle sidebar tooltip, owner's session, 2026-09-28; Tooltip pass, 2026-09-25 | evidence only | `chatgpt--shortcut-chip--rest--light`, `tooltip/chatgpt--shortcut--rest--light` |
| figma | target product | Keyboard shortcuts panel (Help > Keyboard shortcuts): one outlined box per key, 32 × 31, 1px stroke at 70% white, radius 2, 3px apart, 14/24 400 | figma.com editor, owner's session, 2026-09-28 | evidence only | `figma--shortcut-panel-key--rest--dark`, `figma--shortcut-panel-binding--rest--dark` |
| uui | design system (source) | Kbd in the nav account card | `untitleduico/react@4702dc0`, `components/application/app-navigation/base-components/nav-account-card.tsx:149` ([reference](../research/untitled-ui-reference.md)) | MIT | none |
| primer | design system | KeybindingHint: one frame per chord | referenced in `kbd.css:6-7` and the docs page practices | MIT | none |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `kbd/area--*` (7) |

Figma's menus and tooltips show shortcuts as plain text; its only keycaps are in the keyboard
shortcuts reference panel, where each key is an outlined box. ChatGPT's settings Keyboard page
shows shortcuts as plain text that becomes a pill button on hover (an editor, not a keycap).

## Anatomy

```
notion   div 25.72 × 18.29, radius 4, rgba(42,28,0,.07), no border, padding 2 4; 11px/14.3 500 rgb(142,139,134)
chatgpt  kbd 47.48×18, radius 8, white 25%, inherits 14/18 600 sans
uui      radius 4, padding 4 × 1, 12/18 500 body font, neutral-600 on white, neutral-200 ring
area     span.area-kbd  owns: height, min width, padding, 1px transparent border, radius, fill, font
  label  span.area-sr-only  the spoken chord ("Command plus K")
  key    kbd.area-kbd__key (aria-hidden)  one per key, 0.25ch apart
```

Height is built, not set from a tier: 10px line box + 2 × 4 padding + 2 × 1 border = 20
(`kbd.css:12`); small 10 + 2 × 2 + 2 = 16 (`kbd.css:65`). The border is transparent but kept,
so the box stays a whole number (`kbd.css:30`). A quiet Kbd has no box: no padding, no min
width, height from its 16px line (`kbd.css:89-102`).

## Measurements

`node scripts/capture-compare.mjs --slots shell kbd/*.json` (trimmed):

| slot · property | default | small | quiet | chord | on-color (in accent solid Button) | on-emphasis (in Tooltip) | notion · shortcut-hint |
|---|---|---|---|---|---|---|---|
| **shell** size | 31.15 × 20 | 25.52 × 16 | 31.15 × 20 | 44.68 × 20 | 31.15 × 20 | 31.08 × 20 | 25.72 × 18.29 |
| **shell** padding | 4 | 2 | 4 | 4 | 4 | 4 | 2 4 |
| **shell** border | 1 solid transparent | same | same | same | same | same | 0 |
| **shell** radius | 6px | 6px | 6px | 6px | 6px | 6px | 4px |
| **shell** font | 12px/10px 500 system-ui | 11px/10px 500 | 12px/10px 500 | 12px/10px 500 | 12px/10px 500 | 12px/10px 500 | 11px/14.3px 500 ui-sans-serif |
| **shell** color | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(255, 255, 255) | rgb(250, 250, 250) | rgb(142, 139, 134) |
| **shell** background | rgb(238, 238, 238) | rgb(238, 238, 238) |  | rgb(238, 238, 238) | white 14% | rgb(250) 14% | rgba(42, 28, 0, 0.07) |

The quiet column predates audit S12a (not recaptured): quiet now renders 12/16 400 in the UI
font with no padding. Notion's 7% warm fill composites on white to about rgb(240, 239, 237). Placement: in the
Button the keycap sits 6px from the top, bottom and end (32 − 20 = 12; end padding 5 + 1
border) with its own 6px corner (was a concentric 2); in the Tooltip 4px with a 6px corner.
Radius row retaken 2026-09-28 (`area--*` recaptures). ChatGPT's chip: 47.48 × 18, radius 8,
padding 0 6, 14/18 600, white 25%; Figma's panel key: 32 × 31, 1px rgba(255,255,255,.7), radius 2.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| md height | 20 | Inset rule: centred in a 28px Tooltip (4) and a 32px Button (6) | Notion 18.29, ChatGPT 18; kept at `control-xs`, the smallest control rung (third pass) |
| sm height | 16 | Dense trailing metadata (docs practices) | — |
| font | filled keycaps: `--area-font-keyboard` (system-ui), 12px (`--area-text-xs-size`); quiet: the UI font (`--area-font-sans`, Geist) at 12/16 (`kbd.css:98-100`) | System face carries native modifier glyphs; a quiet Kbd renders like a string shortcut (audit S12a) | Notion 11px |
| sm font | 11px on a filled keycap (`--area-size-11`, `kbd.css:67`); a quiet sm Kbd is 12/16 like any quiet one | Second pass, decision 3: Notion's and Figma's shortcut text is 11px, and keycaps are the tiny-chrome role the type policy names | Below the ramp's 12px floor by design |
| weight | **500** on a filled keycap (`kbd.css:39`); **400** when quiet (`kbd.css:101`) | Notion 500; weight policy (a label on a fill); a quiet key has no fill | Was 400. Quiet was 500 until audit S12a |
| fill / edge | **`bg-component-active` #eeeeee, no visible edge** (`kbd.css:30-32`, `79-83`) | Notion 7% warm fill, no border (about rgb 240) | Was `bg-component-hover` #f3 with a 1px `border-subtle` #d4 ring |
| ink | **`fg-muted` rgb(102)** (`kbd.css:33, 82`) | Notion muted rgb(142, 139, 134) | Was `fg-default` |
| radius | **`radius-control-sm` 6** at every size and in every host (`kbd.css`, `--_radius`; owner rule) | Owner 2026-09-28 (4 read too sharp); ChatGPT 8 on 18 | Notion 4, Untitled 4, Figma's panel 2 |
| radius in a Button | **the keycap's own 6** | Owner 2026-09-28; Notion keeps its 4 inside an 8px field (not concentric) | The concentric corner came to 2 at every Button size |
| radius in a Tooltip | own 6 (the concentric Tooltip rule removed) | Owner rule | — |
| in an Input suffix | nested box: end inset = block inset (8 in a 32 field with the small keycap; `inset.css`) | Notion's search field ⌘K; same rule as Button | — |
| quiet | renders like a string shortcut: transparent, no padding or min width, UI font 12/16 400, `fg-muted` (`kbd.css:89-102`); automatic in Menu items; a danger menu row's Kbd takes the row ink (`kbd.css:104`) | Notion menu shortcut plain 12px muted; Figma menu shortcut plain 11px at 70% | Owner audit S12a. Was the keyboard face at 500, 12 or 11 when small |
| on-color | `currentColor` 14% plate, no edge, inherited ink; a Kbd in a Tooltip, any Button or a menu row adapts on its own (`kbd.css:108-116`, :130-135; audit A-15: on-emphasis merged, it had the same CSS) | ChatGPT translucent white 25% chip | Lighter plate |
| in any Button | `currentColor` 14% plate, no edge, inherited ink (`.area-button .area-kbd`, `kbd.css:131-135`) | Survives hover, press and selected fills | Owner audit S12c. Replaced the neutral-solid-only `currentColor` rule and the coloured-solid `bg-inverse` 16% rule; a #ee keycap vanished on a pressed or selected ghost Button |
| Escape | written **"Esc"**, spoken "Escape" (the key-name map before `Kbd` in `primitives.tsx`) | ChatGPT and Notion write it out | Owner audit S12b. Was the ⎋ glyph |

## States

None: Kbd is not interactive.

## Behavior and accessibility

`span.area-kbd` holds the spoken chord ("Command plus K") as `area-sr-only` text and each key
as a `kbd` with `aria-hidden` (`Kbd` in `primitives.tsx`). It replaced an `aria-label` on the
span, which ARIA does not reliably announce on an element with no role (audit decision 14).
Key names map to native glyphs. Consumers expose the binding with `aria-keyshortcuts` on the
action. Inside an interactive host (`button`, `a`, `menuitem*`, `option`, `tab`) the spoken
chord is hidden (`display: none`), so it doesn't join the host's name ("Save Command plus S")
and the shortcut isn't announced twice; standalone, in text or a table, it is still read
(`kbd.css:150-153`, audit A-16). Screen-reader output has not been checked.

## Peers and consistency

| Peer | Shared role | Area value in peer | Kbd | Match / reason |
|---|---|---|---|---|
| Tooltip | nested chip | radius tooltip − 4, end inset 4 | 20px, radius 6 there | match (inset rule) |
| Button | trailing nested box | end reserve 20; small 16 (`inset.css:118-123`); `currentColor` 14% plate in every variant | 20 / 16, radius 6 | corner not concentric (owner, 2026-09-28) |
| Menu / Nav | trailing shortcut | quiet variant: UI font 12/16 400 muted, as a string shortcut | quiet | match; Notion and Figma menus agree (audit S12a) |
| Badge | small chrome | 16 / 20 / 24, 12px min text | 16 / 20; small 11px | small text differs by decision 3 |
| Code | technical label | radius 6, mono | radius 6, keyboard font | match (corner since 2026-09-28) |
| Row plates (Menu, Nav, Table) | selected fill | `bg-component-active` | same fill | shared role, used here as a quiet ground |

## Visual pass

The gallery shows the tiles in named groups (Default, Variants, Sizes, Content). Beside
Notion's shortcut hint, Area's keycap is the same construction (filled, borderless, muted 500; radius 6 since
2026-09-28, Notion 4), 1.7px taller and a step darker in ink. `variant="on-color"` in an accent
solid Button now keeps its own `currentColor` plate (`area--on-color`, white 14%); it was
overridden by the solid-button rule before the audit's spec fixes. Not inspected by this
spec's author: dark theme.

## Settled questions

1. **Keycap height: kept at 20.** Notion's keycap is 18.29 high (2px block padding around an
   11px line; `notion--shortcut-hint`) and ChatGPT's 18; Area's md keycap is
   `control-xs`, the smallest control rung, which also centres it inside Tooltip and Button
   ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).

## Verification

Compared all seven `kbd/area--*` captures with `notion--shortcut-hint`,
`menu/notion--item-shortcut`, `menu/figma--item`, `tooltip/chatgpt--shortcut--rest--light` and
`tooltip/notion--shortcut-stacked--rest--light`. Build and test results are in
[the audit](../research/cohesion-audit.md#verification). Unverified: dark theme, screen readers.

## Feedback log

- 2026-09-26 · cohesion audit → no change; small size's 11px text recorded as open → 7 Area
  captures.
- 2026-09-26 · cohesion audit, spec defects → small Kbd reserves a 16px end box in Buttons (was
  20); `on-color` respected in tonal solid Buttons → `inset.css:112-114`, `kbd.css:116`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → filled keycap
  (`bg-component-active`, no edge), radius 6 → 4, ink `fg-default` → `fg-muted`, weight 400 →
  500, concentric radius in Buttons, spoken chord as hidden text; 11px small text kept;
  keycap height recorded as open → `kbd/notion--shortcut-hint`, `menu/notion--item-shortcut`,
  `menu/figma--item`, `kbd/area--*`.
- 2026-09-28 · owner: "looks too sharp, also thought kbd had a stroke around it?" → corner 4 → 6
  (`--_radius`), the concentric rule inside Buttons removed (it gave 2), Tooltip takes
  max(own, concentric); stroke not applied, shown as a proposal row (surface fill with the
  outline Button's `edge-control`) in `GalleryReviewKbd` → `kbd/chatgpt--shortcut-chip`,
  `kbd/figma--shortcut-panel-*`, `kbd/area--{default,small,in-button,on-color,on-emphasis}` retaken.
- 2026-09-28 · owner on the review: 2 far too sharp, a consistent 6 works; the corner need not be
  the same at every size → no code change (6 kept); stroke still open.
- 2026-09-28 · owner: 6px for everything as a rule; show Kbd in context → `--_radius` is the
  token itself; the Tooltip's concentric rule removed; twelve Templates tiles (menu, command
  palette, search field, nav, outline / ghost / soft / small / large Button, dialog footer,
  running text, shortcut table). The search field found an Input gap: a keycap in `suffix` sat
  9 from the top and 11 from the end; Input now reserves the keycap's box (8 / 8 / 8).
- 2026-09-28 · owner: "batch 11 is approved" → Kbd Complete as shown: no stroke, menus keep
  plain-text shortcuts, Escape keeps ⎋ (the open questions settle on the current state).
- 2026-09-27 · third pass → open question settled, value kept: keycap height 20
  (`control-xs`); Menu's text shortcuts now use Kbd's keyboard face → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-30 · audit S12 (owner) → quiet renders like a string shortcut (UI font 12/16 400, muted, no padding or min width; row ink on a danger menu row; `kbd.css:89-104`); filled keycaps keep the keyboard face at 500; Escape is written "Esc", spoken "Escape" (`primitives.tsx:1782`); inside any Button the keycap is a `currentColor` 14% plate with inherited ink (`kbd.css:131-135`).
- 2026-09-30 · audit S17 (API vocabulary, slice 2, H-13) → manifest axes renamed: `size` is `sm | md` (was `small | normal`; `.area-kbd--sm` / `.area-kbd--md`, kbd.css:55, :63), `appearance` is `variant` (values and modifiers unchanged; manifest.ts:663-672). React keeps `size="small" | "normal"` and `appearance` as deprecated aliases (`primitives.tsx:1878`); `quiet` stays deprecated. Sizes unchanged, sm 16 and md 20 verified live.
- 2026-10-01 · audit A-15 (owner pick A) → `on-emphasis` merged into `on-color` (one rule, one name; manifest variants default, quiet, on-color; React keeps `"on-emphasis"` as a deprecated alias); a Kbd in a Tooltip adapts on its own, as in a solid Button or menu row → kbd.css:108-116, manifest.ts:686-693, primitives.tsx:2100-2104.
- 2026-10-01 · audit A-16 (owner pick A) → the sr-only chord is hidden inside interactive hosts, which carry `aria-keyshortcuts` instead → kbd.css:150-153.
- 2026-10-01 · compact pass → the keycap height is the mark role (20 md, 16 sm; compact md 16) and the padding is `(height − 10) / 2 − border` (4 / 2). Compact md: 16 tall, padding 2, corner 4; the shortcut tooltip is 24 in compact. VS Code key labels are 18 at 11px. docs/research/compact-pass-2026-10-01.md.
