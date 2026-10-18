# Settings pickers: visual options and hover preview (2026-10-18)

Owner: "i dont want to simplify the options, i want to simplify the process of selecting the options … i need to see
more visibly what each change means"; then "build the visual options and the hover preview in the Inspector first,
measured against references".

Measured with `apps/docs/public/area-capture.js` (fingerprint `f7bee0dd`, checked against
`scripts/capture-compare.mjs --fingerprint`) in the built-in browser, 1024 × 768 viewport, light. Only the values below
are kept; the full captures were trimmed in the browser and are not stored.

## shadcn/ui Create (ui.shadcn.com/create, Base UI)

The current shadcn builder: a column of settings (Style, Base Color, Theme, Chart Color, Heading, Font, Icon Library,
Radius, Menu, Menu Accent) beside a live preview.

| Part | Value | Capture |
|---|---|---|
| Setting row | 168 × 52, padding 8 10, radius 10, 1px ring (10% ink; 50% while focused) | `setting-row base-color` checksum `ba6d90a1` |
| Row label | 12 / 16 muted, above the value | same |
| Row value | 14 / 20, weight 500 | same |
| Row visual | 16 × 16 at the end, 10 from the edge, centred: a dot in the colour (Base Color, Theme), "Aa" set 16 in the face (Heading, Font, `heading` `f9ff6ca4`, `font` `5aedfc5b`), an icon for the rest (Style `78005ae2`, Radius's corner, Icon Library's own icon) | rows |
| Option list | names only (Neutral, Stone, Zinc …; Default, None, Small, Medium, Large), 32 rows, radius 10, padding 6 32 6 8, check at the end | radius menu |
| Hover preview | **yes**: with Base Color's list open, hovering Mauve repainted the preview (`--muted-foreground` → `oklch(0.542 0.034 322.5)`); Escape restored the committed value (`oklch(0.556 0 0)`) | measured |

So shadcn draws the *chosen* value's meaning on the row and lets the canvas show each option's meaning on hover.

## tweakcn (tweakcn.com/editor/theme)

Theme presets in a searchable list. Each option draws the theme as four 12 × 12 circles (radius 6, 1px `#e5e5e5`
ring), 2 apart, then the name 14 medium, 8 after the dots; rows 36 tall, padding 8, radius 6 (`theme preset option`).
Hover preview: **no** (`--primary` unchanged while Amber Minimal was highlighted).

## Not measured

ChatGPT's Accent color menu (a dot per option) needs a signed-in session; the pane is signed out, so it was not opened.
Notion's page font tiles and Figma's font picker (which previews on hover) need sign-in too.

## What Area takes

- **Every option draws what it sets**, in the option's icon slot (Custom select `icon`), and the chosen option's drawing
  shows in the trigger, as shadcn's row visual. Colours are Area's Color swatch painted by the real token under the
  option's own scope (`data-area-accent="teal"` → `--area-accent-solid`), so a swatch is what the Canvas will paint.
  Shapes and numbers are drawn marks (corner, height, shadow, frame, duration) built from the same tokens or the
  setting's own number.
- **Hover and arrow keys preview** the highlighted option on the Canvas (shadcn), and leaving the list, Escape or Tab
  without a choice restores the committed value. Custom select gains `onHighlightChange` for this (Base UI's
  `onItemHighlighted`).
- Option labels stay as they are ("8 (Default)"); the drawings add meaning, the numbers keep precision.
