# Interaction and detail pass, 2026-10-26

Owner, after the Slider rebuild (PR #166): "i like the motion improvements and detail/spacing cleanup that was done for
the slider component, it looks and feels like a real, legitimate, professionally design component. can you do the
same high level and detailed pass specifically on the interaction and visual appearance of each component".

## Method

Every family's Overview section, opened, in headless Edge at the shipped defaults (type 13, density 32, Subtle
motion and Feedback), measured rather than read off screenshots:

- **`audit.mjs`**: for every interactive part of every tile (one sample per distinct part per family, 118
  families), forces rest, hover, press (hover + active) and focus-visible through CDP and reads, on the part, its
  pseudo-elements, 14 descendants and 3 ancestors, the end value of every painted property (transitions suspended
  for the read) and the transition each one runs on. `analyze.mjs` compares them with MOTION.md's recipes: a hover
  that snaps out, a hover that lands at once or on another clock than `hover-in`, a press off `press-in`, a ring that
  fades, `transition: all`, a focusable part with no ring, a pressable part with no pressed step, ink that changes on
  hover.
- **`geometry.mjs`**: every tile with its stage at scale 1: a resting fractional `translate` or a `scale` other
  than 1, `will-change` left on, an icon not at a native size (10, 12, 16, 20, 24), clipped text, crossing controls,
  an icon off its label's line centre.
- **Static reads** of what neither can force: overlays' enter and exit (`@starting-style`, one shared rule in
  surface.css), disclosure bodies, hover reveals (every one fades out on `fast`), small marks.

```sh
node docs/research/interaction-pass-2026-10-26/audit.mjs http://127.0.0.1:4410 out.json button,tabs
node docs/research/interaction-pass-2026-10-26/analyze.mjs out.json            # or a kind: snap-out,enter-instant
node docs/research/interaction-pass-2026-10-26/geometry.mjs http://127.0.0.1:4410 geo.json
```

(Serve a desktop build: `npm run build -w @area/desktop`, the `desktop-dist` launch config. A full audit run is about
an hour on four workers; the scripts take a list of slugs.)

## What the measurement found

The library was already close: no resting transforms, no `will-change`, no icon off its label's centre, no
`transition: all`, no ring that fades, every overlay on the shared enter and exit, every hover reveal fading out.
What it found, and what changed:

| Finding | Families | Change |
|---|---|---|
| The selected tab's bar faded out on the old tab and appeared on the new one; Segmented's plate slides | Tabs, Code block (language tabs) | One bar on the list slides and resizes to the chosen tab on `base` ease-in-out (`useTabIndicator`, `data-indicator`) |
| Disclosure bodies snapped open and shut; Accordion and Code block ease theirs | Step (and Step group, Reasoning), Plan, Queue, Edit summary | Accordion's height recipe for all of them (accordion.css); Edit summary keeps a closed diff in the tree, `hidden`, so its close eases and `aria-controls` names it |
| A field's hover edge landed at once in five fields and eased in on `hover-in` in six (Custom select, Date picker, Tag picker, OTP, Composer, File upload) | Input, Textarea, Number field, Select, Input group | Hover on `hover-in`; focus, tones and disabled still land at once |
| A list's check popped in (`visibility`); Menu's check is a small mark | List box, Combobox, Custom select, Tag picker | Menu's small mark (opacity and scale from 0.6 on `fast`) |
| The Slider's knob is picked up under a press; the Color picker's knobs, the same part, were not | Color picker (area, hue, alpha, channel bars) | The same lift, `1 + (1 − feedback-scale) × 4`, 1.12 at Subtle, pointer only |
| Glyphs drawn between native cuts at type 13: the compact step is in halves (`ui-dense` 0.5), so `x − 4 × ui-dense` gave 22, 18 and 14 | Empty state (22 and 18), Toggletip (14) | The step rounds up to a whole one: 20 and 16, 12. Cohesion test: a glyph or icon size that reads `ui-dense` rounds it |
| A region in the tab order with no ring | Code block (the scrolling code, the language tab panel), Tabs (the panel) | The ring around the block (Diff's and Board card's rule); the panel's ring around its content, clear of the tab's bar |

## Kept on purpose

Flags the measurement raised that are the system's own decisions, not defects:

- Inline links show no hover change: always underlined in their own ink (owner, link.md, 2026-10-09).
- Row actions in Nav, Queue and Edit summary change ink, not plate, on hover (the row already shows the pointer;
  cohesion test).
- Asset card's interactive card has the default cursor and drops its lift on press (Figma's asset browser).
- A selected toggle Button (and Box field's linked toggle) has no hover change.
- Field triggers (Custom select, Date picker) have no pressed step, as native fields.
- Tree view and Panel sections expand at once (Figma's layers and panels, Finder's outline).
- File page's glyph is a scaled figure with a non-scaling stroke (round 56).
- Edit summary's Undo and Keep cover the row's end on their own plate while it is hovered (Cursor's review).

## Not covered

- Visual detail by eye family by family: the geometry checks cover what can be measured; spacing and proportion
  judgements stay with the visual pass (`area-visual-language`) and the owner's review.
- Segmented, Slider, Switch and Field: another session (`project-status-electron`) has them open; this pass left them alone.
- Touch, forced colours on Windows and assistive technology, as DEVELOPMENT.md's release boundary.
