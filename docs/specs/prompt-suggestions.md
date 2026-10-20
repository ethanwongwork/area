# Prompt suggestions spec

**Captures:** `docs/research/captures/prompt-suggestions/`
**Peers:** Composer (the field above), Menu rows (the wash), Button (dismiss)

## Owner decisions

- 2026-09-26: "do each of them subsequently" — ChatGPT conversation group.
- 2026-09-26: owner: "choose whatever you think makes the most sense for each variation so that
  it fits with the overall design system and full component list." Decision: **list is the
  default** (ChatGPT, the primary product for conversation; built from the composer's width,
  height and corner, Menu's 2-apart rows and Button's dismiss; long prompts truncate on one
  line). **Chips stay as `layout="chips"`** for narrow or inline places (a side panel, an
  empty state) where full-width rows are too heavy; they are plain outline Buttons, so they
  add no new shape.

## Job and boundaries

Starter prompts under an empty composer: choose one to fill (or send) it, dismiss one you
don't want. Not Chip (filters), not Menu (actions from a trigger).

## Sources

| Id | Type | What | Link | Captures |
|---|---|---|---|---|
| chatgpt | target product | Home screen suggestions under the composer | chatgpt.com, 2026-09-26; hover 2026-09-28; nothing chosen | `chatgpt--prompt-suggestions--rest--light`, `chatgpt--suggestion-row--hover--light` |

## Measurements (ChatGPT)

```
list      768 wide (the composer's width), 24 below the composer, rows stacked with no gap, muted ink rgb(143)
row       768 × 52, radius 8, transparent at rest, padding 0 44 0 8, 16/26 text
icon      36 × 24 slot at 8 holding a 20 icon or logo; text from 52 (8 + 36 + 8)
dismiss   36 × 36, radius 8, icon 20, ending 4 in from the row
```

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| width | the composer's: `--area-composer-inline-size` (default 480 = 96 × 5), the one hook for both (prompt-suggestions.css:13) | ChatGPT: the composer's width | — |
| offset | 24 below the composer; compact **16** (set by the host layout; the demos write `24 − 8 × ui-dense`) | ChatGPT 24 | Compact held 24 until 2026-10-02, so the first label sat 34 below the composer, as far as at default |
| row | 48 tall (16/24 text, 12 above and below); compact **40** (14/20, 10 above and below), the compact composer's height, radius 16 (the composer's corner), 2 apart | ChatGPT 52 on 26 leading, radius 8, no gap | radius pass: the rows are the composer's height and column, so a washed row echoes its corner; 2 apart is Menu's rule so neighbouring hover plates never touch |
| ink | muted, fixed on hover and focus | ChatGPT 143 muted; foreground fixed on hover (AGENTS.md) | ChatGPT lifts the ink to default (#0d) on hover (`chatgpt--suggestion-row--hover`); Area's rule keeps the foreground fixed, the wash carries the state |
| hover | Menu's row plate, `bg-component-hover` | Menu; ChatGPT washes the row 5% black (captured 2026-09-28) | — |
| icon | 16 icon centred in a 32 square 8 in: centre 24 from the edge, under the composer's leading action | ChatGPT's icons align under its "+" | Area icons are 16 |
| text | 8 after the icon slot | ChatGPT 8 | — |
| dismiss | ghost small icon Button (28, radius 6, Area glyph) 8 in, shown on hover and focus (always on touch); the row end reserves 28 + 8 | Audit S9 / G-18 (owner 2026-09-30): the close recipe for rectangular shapes. ChatGPT 36 | Was a 32 md Button |

## Visual pass

2026-09-28 (batch 19), live in Claude in Chrome on the home screen (nothing chosen): rows re-measured
as 2026-09-26 (768 × 52, corner 8, 0 44 0 8, no gap, 24 below the composer, 16/26 muted #8f).
Hover, first captured: the row washes 5% black, the ink lifts to #0d, and a 36 dismiss (corner 8)
shows 4 from the end. Area (layout A in the gallery): 48 rows, corner 16, 2 apart, 16/24 muted, the
Menu plate on hover with the ink fixed (AGENTS.md), a 32 dismiss 8 in. No change; the ink lift is
the one ChatGPT behaviour Area deliberately does not follow.

## Behavior and accessibility

A list (`ul`, named "Suggestions") of buttons named by their prompt; each dismiss is its own
button named "Dismiss “prompt”". Nothing happens on hover alone. `onDismiss` applies to the list
layout only; chips have no dismiss (ChatGPT's chips are not dismissible).

## Verification

- Headless Edge (`scratchpad/measure-sugg.mjs`): list 24 below the composer, rows 480 × 48,
  icon centre 24 = the composer's "+" centre 24; hover washes the row (5%), lifts the text
  and shows the dismiss (the text lift was removed 2026-09-27; see below).
- React test: list and buttons, dismiss optional.
- Unverified: dark theme. ChatGPT's hover state was captured 2026-09-28.

## Radius and spacing pass (2026-09-26) — two designs for the owner

Owner: "can you do a corner radius and gaps/spacing pass on the prompt suggestions … if
anything you could generate 2 different visual designs that both fit the design system so i
can pick?" Both are built as `layout`:

- **A · list** (default): rows 48 tall, radius 16 (the composer's corner: send Button 8 +
  inset 8), 2 apart; icons centred under the composer's "+" (24), dismiss under its send
  button (24 from the end); 24 below the composer (ChatGPT).
- **B · chips**: outline neutral Buttons (32, radius 8, icon + label) that wrap 8 apart in
  both directions, starting on the composer's edge, 24 below it; no dismiss.

Measured: A rows 48, gap 2, radius 16; B 24 below, 32 tall, 8 apart, starting at 0.
- 2026-09-27 · merge check (cohesion test) → hover no longer lifts the ink; the plate is Menu's row plate.
- 2026-09-30 · audit S9 / G-18 (owner) → the dismiss is a ghost small Button (28; was md 32) and the end padding follows; pressed rows take `bg-component-active` (prompt-suggestions.css).
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → width reads the public hook `--area-composer-inline-size` (default 480), shared with Composer (prompt-suggestions.css:13); `onDismiss` documented as list layout only, chips have no dismiss (no behaviour change).
- 2026-10-01 · audit G-23 (owner pick A) → demos use the placeholder vocabulary (Body text, Item one, Option one, Placeholder, Label) and `authorName` "Assistant", per DESIGN_SYSTEM's Example copy; no component change.
- 2026-10-02 · compact family pass → compact rows 44 → 40, so a row is the compact composer's height again (its own rule); Cursor's follow-up composer 42, dense list rows 28–36 → prompt-suggestions.css `min-block-size`; docs/research/compact-evidence-2026-10-02/cursor-desktop.md.
- 2026-10-02 · owner question (preview page: "is the gap between the composer and the items below it supposed to be this large") → the 24 offset is ChatGPT's at default, but the demos held it in compact; now 24, compact 16 → gallery.tsx `GalleryPromptSuggestions`, `GalleryPromptSuggestionsChips`.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → row plate and dismiss appear instantly with hover, press and focus and fade out over duration-fast (was a 100ms fade in).

## Motion and interaction, 2026-10-07

| Interaction | Before | After |
|---|---|---|
| row hover plate | `--area-transition` (`fast` `ease-out`) both ways | **instant** in, `fast` out |
| press | `fast` | **instant** in, `fast` out |
| focus-visible plate | `fast` | **instant** in (ring and plate arrive together), `fast` out |
| dismiss reveal on hover / focus-within | opacity `fast` both ways (the plate led the dismiss by 100ms) | **instant** in, with the plate; opacity `fast` `ease-out` out |
| chips | Button's | Button's new rule |

Crispness: rows are whole-pixel (480 × 48 at default); no transform, and the dismiss is positioned
by layout (`inset-block: 0` with flex centring).

Verified on `/prompt-suggestions.html` (computed styles): focusing a row shows the dismiss at once
(`transition-duration: 0s`, no animation), blurring fades it over 100ms; the hover and press rules
were confirmed in the served CSSOM (a pointer hover cannot be driven in a background tab).

## Interaction polish, 2026-10-16

The press never showed: the row's hover rule outranked `item:active`. It is now read through the row and paints `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover). Not selectable. See [interaction polish](../research/interaction-polish-2026-10-16.md).
