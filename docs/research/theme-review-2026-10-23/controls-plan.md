# Settings as sliders and toggles (plan, 2026-10-24)

Owner, sharing a panel with Light/Dark and Off/On toggles and full-width fill bars ("Bounce 100", "Stagger 45ms",
"Corner 28px"): wants that simplicity for Area's settings, values that read without knowing the step numbers, colour on a
continuous scale, and every corner from 0 to pill; "be critical".

## What is viable

- **Finer scales cost almost nothing.** 40 of the 44 settings write one number (`layers-light`, `stroke-strength`,
  `shadow-resting-step` …) and every colour or size is derived from it in CSS, so a 0–100 grid is 101 one-line rules
  per setting. The cost is proof: the contrast gates must sample each continuum (ends, defaults and a grid).
- **Colour.** Hue: the 72 5° hues already behave as a continuum (a step is about one just-noticeable difference); 1°
  would add about 4× to `axes.css` (each hue writes ~190 solved colours) for no visible gain. Chroma (Accent strength)
  and every grey setting (page lightness, tint, layer contrast, card shade) are CSS math and can be continuous. The
  accent's lightness is the Solid step: continuous once a step's label flips between black and white (the WCAG band
  where neither reaches 4.6:1 is L 0.563–0.565; APCA in dark is wider and needs checking). What is not viable is
  editing each of the ~60 derived colours: you set three inputs and the system solves the rest, which is what keeps
  every combination readable.
- **Corners.** Radius writes a button corner and a surface corner; every whole px 0–16 works (16 is already round on a
  medium Button), with Pill as the last stop (every control round at every height). Cheap, small payoff between
  neighbours (7 vs 8px), worth it because the bar makes it free.
- **Not everything is a bar.** Unordered choices (focus ring, easing, density, shadow colour) stay segmented; text size
  stays whole px (half px blurs).

## Controls and names

Values show a real unit where one exists (px, ms, °), else 0–100%; no step numbers. Bars: drag, arrows (Shift ×10),
click the value to type, double-click to reset, a tick at the default.

| Heading | Setting (today) | Control | Range shown |
|---|---|---|---|
| Page | Mode | Toggle | Light · Dark |
| | Page lightness (Ground) | Bar | Light 90–100% (100 = White); dark 0–24% (0 = Black) |
| | Grey tint (Tint strength) | Bar | 0–100% of the hue's room |
| | Tint colour (Neutral, Tint hue) | Segmented + bar | Neutral · Accent · Custom → 0–360° (Cool, Warm marked) |
| | Text tint | Bar | 0–100% |
| | Layer contrast (Layers) | Bar | 0–100% (0 = Flat) |
| | Card shade (Card tone) | Segmented + bar | Auto · Custom → −100…+100% |
| Accent | Hue (Accent) | Bar | 0–360°, family names at their hue (“Blue · 220°”) |
| | Saturation (Accent strength) | Bar | 30–100% |
| | Button lightness (Solid) | Toggle + bar | Auto · Custom → the readable range |
| | Label tint | Bar | 0–100% |
| Where it paints | Buttons (Action) | Toggle | Neutral · Accent |
| | Selection | Toggle | Neutral · Accent |
| | Status colours | Toggle | Fixed · Match |
| | Contrast | Toggle + bar | System · Custom → 0–100% |
| Size | Text size (Type) | Segmented | 12 · 13 · 14 · 15 · 16 px |
| | Density | Segmented | Compact · Default · Comfortable |
| Shape | Corner (Radius) | Bar | 0–16px, then Pill |
| | Pills | Chips | as today |
| Stroke | Width | Bar | 0–2px |
| | Edge contrast (Stroke strength) | Bar | 0–100% |
| Shadow | Floating, Resting, Fields, Edge (Rest shadow) | Bars | 0–100% |
| | Reach (Size), Softness, Light | Bars | 0–100% |
| | Colour | Segmented | Black · Warm · Cool |
| States | Hover: fill, edge, lift | Bars | 0–100% |
| | Selected: fill · edge width · tint | Bar · segmented · segmented | 0–100% · 1 · 2 · 3px · None · Accent · Grey |
| | Pressed fill | Bar | 0–100% |
| | Focus ring | Segmented | Hug · Gap · Halo · Inset · Bold |
| | Danger hover | Toggle | Red · Grey |
| Effects | Speed (Motion) | Bar | 0–300ms (0 = Off) |
| | Easing | Segmented | Standard · Snappy · Gentle · Spring |

## Watch-outs

- Twenty-odd identical grey bars scan poorly: keep headings, collapse them, and keep toggles visibly different.
- A bar invites fiddling between values that look alike; the default tick and double-click reset keep it calm.
- The bar with its label inside is a new Slider option (`labelPosition="inside"` on the bar variant), built in Area so
  the Inspector and products get the same control.

## Order of work

1. The control: Slider bar with the label and value inside (intake, spec, CSS, React, demos, docs).
2. The Inspector and Setup: bars and toggles, names and units, Page → Accent → Where it paints, a States heading,
   dimmed rows that have no effect, dark following light.
3. The scales: 0–100 grids, Tint by the hue's room, every corner px, continuous Saturation, Card shade; ids renamed
   with aliases; saved settings migrated.
4. The colour rules approved on the Axis review page (Solid label flip, Selected tint follows Selection, accent selected
   step, Contrast reaches text, dark washes re-spaced, press room, keycaps, hued text on fills, grey edges, press under a
   black label, Tint casts neutral roles, Softness, dark ground floor), each with its gate.

## Round 2: a control per setting (2026-10-24)

Owner, after marking the first page: "i dont mean that every single axis has to use a slider ... make your best judgement
on what would be the best control for this axis ... some of the axises i cant tell what im even updating." The rule
(`apps/desktop/src/inspector-rows.tsx`): a bar where there is a range worth dragging (six or more ordered steps), a
Segmented for two to five short names, a dropdown for a longer or wordier list and for colours (each option drawing what it
sets), Auto/System + Custom where a setting has an Auto beside its range. A row that changes nothing under the others is
dimmed with the reason; every card on the review page says what it sets.

| Setting | Control | Why |
|---|---|---|
| Mode, Buttons, Selection, Danger hover | Segmented | Two names |
| Status colours | Segmented: Vivid · Muted | Was Fixed · Match ("idk what this means"); dimmed at Saturation 100%, where it does nothing |
| Type, Density, Selected edge, Shadow colour, Selected tint, Focus ring | Segmented | Three to five short names |
| Easing | Dropdown | Four words truncated in a Segmented |
| Pills | Multi-select dropdown | A set |
| Greys (Neutral, Tint hue, Light and Dark tint) | One row: Temperature bar Cool 100% … Neutral … Warm 100%; Tint colour dropdown (None, Accent, Red … Pink by name, Custom hue by name); Amount bar | "slider that controls the coolness and warmth"; "grey tint ... adds more color?"; degrees → names. Dark follows light |
| Accent | Dropdown of the eleven as swatches, Custom → a hue bar by name ("Blue · 255°") | "maybe this should just be a dropdown or an actual color picker" |
| Button shade (Solid) | Auto · Custom, then a bar with the button's own colour beside its name, Lightest … Deepest | "not sure what this does"; dimmed while Buttons and Selection are Neutral |
| Card shade | Auto · Custom, then a bar in half steps (17) | "more granularity" |
| Contrast | System · Custom, then a bar in quarter levels (33) | "more granularity" |
| Lightness, Layer contrast, Text tint, Saturation, Label tint, Corner, Stroke width, Edge contrast, every shadow, every fill, Hover edge, Speed | Bar | Ordered ranges the first round confirmed |

Done the same day: Slider `origin` (any variant) fills between a neutral value and the thumb; Temperature uses origin 0. Was: the
Temperature bar filled from its left end. The review page (https://claude.ai/artifact/XbbMMBCfHriS8vZV9ARiaV) keeps round 1 in `controls` and round
2 in `round2`.
