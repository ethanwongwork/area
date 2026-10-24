# Theme setting visuals (2026-10-23)

Audit of every picture that stands for a setting's value, and the file figures beside them. Review page with the
captures side by side: https://claude.ai/artifact/JvT2iJZHfe6A9nEekqT4xP

## What exists

| System | Where | Source | Since |
|---|---|---|---|
| Option marks | Inspector menus and triggers, 12–14 in the 16 icon slot | `apps/desktop/src/option-marks.tsx`, `styles/option-marks.css` | 10-18, extended 10-22 |
| Choice visuals | Setup choice cards: one mini UI for 15 settings, swatches, a mark on a white plate | `choice-visuals.tsx`, `styles/setup.css` (`cv-*`) | 10-21 (choice-illustrations round 3) |
| Abstract | Theme → Browse tiles, real components | `abstract.tsx` | 10-19 |
| Setup stage | Bento / Desktop / Mobile, state drawings, Layer map | `pages/theme-views.tsx`, `layer-map.tsx` | 10-21 |
| Review scenes, round 12 | Review page only (artifact 6kssdvruB52Bv5TRejdCU8, v13), never ported | `round-12-source/` here | 10-21 |
| File figures | Folder, File page, File image: the outline look | `packages/react` | 10-18 (rounds 55–57) |

The review page's database holds one pick (round 1, Hover fill "window"). Rounds 3–12 have no verdicts, so the app
shows round 3. `round-12-source/` is copied from that session's temporary scratchpad; its imports were absolute paths
into the old worktree and are now repo-relative, unbuilt and untested here.

## Findings

- **Menus (47 in the Inspector).** 11 read clearly (Neutral, Tint hue, Text tint, Accent, Light ground, Density,
  Radius, Selected stroke, Focus ring, Motion, Easing). 16 have a mark whose options look alike, because the mark
  paints the true token at 12 px (Light tint, Light layers, Light card tone, Contrast, Width, Strength, Hover stroke,
  Rest shadow, Floating / Resting / Hover / Field shadow, the three fills, Selected tint). 20 have no mark (Pills,
  Shadow size, Softness, Light, Colour, all 15 Material); Pills and Shadow size draw no slot, so their text starts left
  of the others'. In dark, Width, Strength and Rest shadow nearly vanish.
- **One setting, three metaphors.** Radius: rounded rect (menu), corner arc (card), field and button (Browse).
  Motion: pie / sliding dot / switch. Easing: curve / sliding dot / switch. Density: pill height / mini UI / rows.
  Strength: frame / three hairlines / card. Selected tint draws three identical squares in the menu.
- **Setup cards.** The mini UI is one drawing for 15 settings; a one-step change (ground 99 vs 98, Cool vs Warm) can't
  be seen at card size. Mark cards put a 32 px square on a large plate. Every Motion and Easing card animates at once.
  Setup labels add "(Default)"; the menus don't.

## Proposal (open for the owner)

One metaphor per setting, drawn at three sizes:

1. **Glyph (16, menus).** Area's icon grid and stroke weight, exaggerated so every step shows (order, not the true
   value); real swatches for colour; every setting has marks or a menu has none. Reverses option-marks' token-true rule.
2. **Figure (Setup cards).** The Folder / File page outline look, one figure per setting isolating the region it
   moves, painted by the option's tokens; semi-abstract text bars; static.
3. **Scene (stage, Browse).** Real components at true values; round 12's screens go here.

Captures were taken from a clean headless Edge at 2× against `npm run build` on port 4410. The Setup stage and two
Browse tiles drew too small there, but render correctly in the app's browser pane.

## Round 2: the proposals drawn (same day)

The review page now shows, drawn with Area's built CSS and real markup (Custom select listbox, Inspector field rows,
Radio card previews) at true size, light and dark:

- **Grid menu.** Custom select's listbox at the field's width (268 of the Inspector's 296), choices as figure cards,
  3 per row, a List / Grid switch in its header; a list variant ends in "Show previews". Accent and Tint hue as swatch
  grids. Proposed: grid by default for visual settings with ≤ 12 options, list for long ramps, one view preference.
  It is a layout option on Custom select (the ListBox grid File grid and Asset grid use), for component intake first.
- **Exaggerated glyphs** for the 16 menus whose options look alike, beside today's captures; **marks for the 20
  settings without one** (Pills, shadow details, Material looks and levers). 0 / None / Off is a ghost frame, Auto /
  System dashed; lifts are hard offset blocks in ink.
- **Setup cards:** Folder-style figures (control fill, edge, quiet ink, true token values) beside round 12's
  semi-abstract and real screens at the card's real size (117 × 103). Round 12's Layers labels predate 0/2/4/6/8.

`lab/build.mjs` generates the lab page (glyphs in `GLYPH`, figures in `FIG`); it reads `lab/labels.json` (the
Inspector's option labels, captured 2026-10-23) and links `packages/styles/dist/area.css`, so `npm run build` first.

## Round 3: icon to illustration (same day)

The owner prefers today's token-true marks for most menus and asked to see each axis type's evolution from icon to
abstract illustration. The review page's ladder section draws ten axis types (Shape, Size, Line, Lift, Fill, Ring,
Layers, Colour, Motion, Material), one setting each at three values, at six rungs: today's 16 px icon, the one-idea
icon, today's mark large (40, true tokens), the Folder-style figure, an annotated close-up (after Practical UI's
"outer radius = inner radius + padding" and a radius-circle panel), and real components. Picks save per type to the
page's database (collection `ladder`: `{menu, card, note, at}`). Source: `ladder/build.mjs`. The Radius figure in the
app is now the corner close-up (a list's corner around its row's, `radius-list` / `radius-list-row`, at 2×).

Until the picks are in, the app keeps the branch's one-idea glyphs; the owner's direction is to return most menus to
today's marks.

## Round 4: one language from icon to screen (same day)

The owner asked for Mark and Figure to sit closer and for every earlier exploration to come together. The page now
opens with a lineage strip (option marks 10-18, Folder figures 10-18, Browse close-ups 10-19, choice-illustrations
rounds 1–3 and 4–12 on 10-21, grid figures and annotated close-ups 10-23) saying what each keeps, then the refined
ladder: Icon · today, Icon · one idea, Object (the icon's shape grown into Folder's look), Scene (the same object, same
size, its context quieter), Close-up (the object magnified at its measure), Screen (round 12's semi-abstract screen at
the value) and Real. One language for every rung: `ladder-refined/il.css` (one 4:3 plate on the page ground with
Folder's edge, Folder's fill and quiet ink, cap-height text bars, the setting's property always the real token, blue
only for measures). Picks: collection `ladder`, `{menu: icon-today|icon-ink, card: object|scene|closeup|screen|real,
note}`. The app is unchanged by this round except the Radius figure.
