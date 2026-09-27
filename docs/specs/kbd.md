# Kbd spec

**Status:** Complete in `component-status.mjs` (accepted before the cohesion audit) · paint changed in the second pass, 2026-09-26; the change awaits the owner's look
**Captures:** `docs/research/captures/kbd/` (Area tiles, `notion--shortcut-hint`), `menu/notion--item-shortcut`, `menu/figma--item`, `tooltip/*--shortcut*`
**Peers:** Tooltip (on-emphasis shortcut), Button (trailing shortcut), Menu and Nav (quiet trailing shortcut), Code (inline technical label), Badge (small chrome)

## Owner decisions

No Kbd section existed in [prior decisions](PRIOR_DECISIONS.md). "Neutral by default, accent
by override" (2026-09-26) does not apply: Kbd has no selected or current state.

- 2026-09-26 (second pass): decide every open item with the most calculated option
  consistent with the system. For Kbd: a filled keycap with no edge, radius 4, muted ink at
  500, concentric inside Buttons; the small keycap keeps 11px text (audit decision 3); the
  chord is announced through visually hidden text (decision 14).

## Job and boundaries

Kbd shows one keyboard chord (one flat keycap holding its keys); KbdGroup shows a sequence
of chords. It is display-only: the shortcut is wired and announced on the action with
`aria-keyshortcuts`. Inline source is Code; status is Badge (DESIGN_SYSTEM.md, Icons and
technical labels).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | normal 20 (default), small 16 | Standalone hints and Buttons; dense trailing metadata | Notion keycap 18.29 (`notion--shortcut-hint`); ChatGPT tooltip chip 18; Figma 11px shortcut text |
| appearance | default, quiet, on-color, on-emphasis | Keycap; menu chrome; on a coloured action; in an inverse Tooltip | Notion filled keycap (default); Notion and Figma menu shortcuts as plain text (quiet); ChatGPT tooltip chip (translucent) |
| composition | chord, sequence (KbdGroup) | Modifier chords; "⌘K then P" | Gallery `chord`, `sequence` |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Shortcut hint keycap: 26 × 18, radius 4, 7% warm fill, no border, 11px 500 muted | app.notion.com, owner's workspace, light, read-only, 2026-09-26 | evidence only | `notion--shortcut-hint--rest--light` |
| notion | target product | Menu item shortcut as plain 12px text, rgb(161, 158, 153); tooltip shortcut as a second text line | page menu (2026-09-26); Tooltip pass | evidence only | `menu/notion--item-shortcut--rest--light`, `tooltip/notion--shortcut-stacked--rest--light` |
| figma | target product | Main-menu item shortcut as plain 11/16 text at 70% white (dark menu) | figma.com editor, 2026-09-26 | evidence only | `menu/figma--item--rest--light` |
| chatgpt | target product | Tooltip shortcut chip: 18px, radius 8, white 25% | Tooltip pass, 2026-09-25 | evidence only | `tooltip/chatgpt--shortcut--rest--light` |
| uui | design system (source) | Kbd in the nav account card | `untitleduico/react@4702dc0`, `components/application/app-navigation/base-components/nav-account-card.tsx:149` ([reference](../research/untitled-ui-reference.md)) | MIT | none |
| primer | design system | KeybindingHint: one frame per chord | referenced in `kbd.css:6-7` and the docs page practices | MIT | none |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `kbd/area--*` (7) |

Figma shows no keycap in the captured surfaces: its shortcuts are plain text.

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
(`kbd.css:12`); small 10 + 2 × 2 + 2 = 16 (`kbd.css:62`). The border is transparent but kept,
so the box stays a whole number (`kbd.css:25-27`).

## Measurements

`node scripts/capture-compare.mjs --slots shell kbd/*.json` (trimmed):

| slot · property | default | small | quiet | chord | on-color (in accent solid Button) | on-emphasis (in Tooltip) | notion · shortcut-hint |
|---|---|---|---|---|---|---|---|
| **shell** size | 31.15 × 20 | 25.52 × 16 | 31.15 × 20 | 44.68 × 20 | 31.15 × 20 | 31.08 × 20 | 25.72 × 18.29 |
| **shell** padding | 4 | 2 | 4 | 4 | 4 | 4 | 2 4 |
| **shell** border | 1 solid transparent | same | same | same | same | same | 0 |
| **shell** radius | 4px | 4px | 4px | 4px | 2px | 6px | 4px |
| **shell** font | 12px/10px 500 system-ui | 11px/10px 500 | 12px/10px 500 | 12px/10px 500 | 12px/10px 500 | 12px/10px 500 | 11px/14.3px 500 ui-sans-serif |
| **shell** color | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(102, 102, 102) | rgb(255, 255, 255) | rgb(250, 250, 250) | rgb(142, 139, 134) |
| **shell** background | rgb(238, 238, 238) | rgb(238, 238, 238) |  | rgb(238, 238, 238) | white 14% | rgb(250) 14% | rgba(42, 28, 0, 0.07) |

Notion's 7% warm fill composites on white to about rgb(240, 239, 237). Placement: in the
Button the keycap sits 6px from the top, bottom and end (32 − 20 = 12; end padding 5 + 1
border) with a 2px corner (8 − 6); in the Tooltip 4px with a 6px corner.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| normal height | 20 | Inset rule: centred in a 28px Tooltip (4) and a 32px Button (6) | Notion 18.29, ChatGPT 18; kept at `control-xs`, the smallest control rung (third pass) |
| small height | 16 | Dense trailing metadata (docs practices) | — |
| font | `--area-font-keyboard` (system-ui), 12px (`--area-text-xs-size`) | System face carries native modifier glyphs | Notion 11px |
| small font | 11px (`--area-size-11`, `kbd.css:64`) | Second pass, decision 3: Notion's and Figma's shortcut text is 11px, and keycaps are the tiny-chrome role the type policy names | Below the ramp's 12px floor by design |
| weight | **500** (`kbd.css:35-36`) | Notion 500; weight policy (a label on a fill) | Was 400 |
| fill / edge | **`bg-component-active` #eeeeee, no visible edge** (`kbd.css:25-29`, `76-80`) | Notion 7% warm fill, no border (about rgb 240) | Was `bg-component-hover` #f3 with a 1px `border-subtle` #d4 ring |
| ink | **`fg-muted` rgb(102)** (`kbd.css:30, 79`) | Notion muted rgb(142, 139, 134) | Was `fg-default` |
| radius | **min(`radius-control-xs` 4, height × 0.4)** (`kbd.css:28`) | Notion 4; Untitled 4 | Was `radius-small` 6. ChatGPT 8 |
| radius in a Button | button shape − (button height − keycap height) / 2: 2px at md (`kbd.css:130-134`) | Second pass: concentric inside Buttons | — |
| quiet | transparent, `fg-muted` (`kbd.css:82-89`); automatic in Menu items | Notion menu shortcut plain 12px muted; Figma menu shortcut plain 11px at 70% | — |
| on-color / on-emphasis | `currentColor` 14% plate, no edge, inherited ink (`kbd.css:91-97`) | ChatGPT translucent white 25% chip | Lighter plate |
| in solid Buttons | tonal solid: `bg-inverse` 16%, unless `on-color` is asked for; neutral solid: `currentColor` 14% (`kbd.css:113-128`) | Contrast on the fill | — |

## States

None: Kbd is not interactive.

## Behavior and accessibility

`span.area-kbd` holds the spoken chord ("Command plus K") as `area-sr-only` text and each key
as a `kbd` with `aria-hidden` (`primitives.tsx:1399-1421`). It replaced an `aria-label` on the
span, which ARIA does not reliably announce on an element with no role (audit decision 14).
Key names map to native glyphs. Consumers expose the binding with `aria-keyshortcuts` on the
action. Screen-reader output has not been checked.

## Peers and consistency

| Peer | Shared role | Area value in peer | Kbd | Match / reason |
|---|---|---|---|---|
| Tooltip | nested chip | radius tooltip − 4, end inset 4 | 20px, radius 6 there | match (inset rule) |
| Button | trailing nested box, concentric corner | end reserve 20; small 16 (`inset.css:109-114`) | 20 / 16, radius 2 at md | match (second pass) |
| Menu / Nav | trailing shortcut | quiet appearance | quiet | match; Notion and Figma menus agree |
| Badge | small chrome | 16 / 20 / 24, 12px min text | 16 / 20; small 11px | small text differs by decision 3 |
| Code | technical label | radius 6, mono | radius 4, keyboard font | differs: a keycap is Notion's 4, Code keeps Untitled's inline code radius |
| Row plates (Menu, Nav, Table) | selected fill | `bg-component-active` | same fill | shared role, used here as a quiet ground |

## Visual pass

The gallery shows the tiles in named groups (Default, Variants, Sizes, Content). Beside
Notion's shortcut hint, Area's keycap is the same construction (filled, borderless, radius
4, muted 500), 1.7px taller and a step darker in ink. `appearance="on-color"` in an accent
solid Button now keeps its own `currentColor` plate (`area--on-color`, white 14%); it was
overridden by the solid-button rule before the audit's spec fixes. Not inspected by this
spec's author: dark theme.

## Settled questions

1. **Keycap height: kept at 20.** Notion's keycap is 18.29 high (2px block padding around an
   11px line; `notion--shortcut-hint`) and ChatGPT's 18; Area's normal keycap is
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
- 2026-09-27 · third pass → open question settled, value kept: keycap height 20
  (`control-xs`); Menu's text shortcuts now use Kbd's keyboard face → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
