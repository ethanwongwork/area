# Icon cohesion pass, 2026-10-31

The owner, looking at Area's glyphs in the App Map's key at 20px: "the icon set really doesnt look that
cohesive, not sure if there are inconsistencies with stroke weight or the shapes … i think there are some
optical balance issues and inconsistencies with negative space". This folder holds the research, the
measurements, the rules that follow from them and round 1 of redraws.

## What was measured

`tools/measure.mjs` draws every icon of a set at 64px (4× a 16px slot, its own stroke scaled with it) in
headless Edge and reads the alpha channel: apparent size (√ of the ink's convex-hull area), mass (ink
area), density (mass / hull), solid ink (ink thicker than 1.6 × the set's line: dots, blocks), the largest
solid island, counters, and the ink centroid. The same measure runs on Area's shipped 16px build and on six
open-source sets fetched into the ignored cache (`refs.mjs fetch`, plus tabler, heroicons, iconoir).

| Set | Icons | Size median | Size spread (IQR / median) | Size p5–p95 | Density median | Density spread | Mass CV | Icons with solid ink | With a solid island > 3px² |
|---|---|---|---|---|---|---|---|---|---|
| **Area** | 808 | 11.26 | 12.2% | 8.64–12.14 | 0.420 | 22.4% | 27.6% | **35.3%** | **30.3%** |
| Lucide | 2292 | 12.85 | 13.5% | 9.34–13.64 | 0.447 | 19.7% | 25.5% | 17.0% | 18.2% |
| Phosphor (regular) | 1512 | 11.40 | 9.9% | 8.49–12.27 | 0.391 | 21.7% | 26.7% | 16.0% | 5.4% |
| Tabler | 5203 | 11.78 | 14.5% | 7.77–13.26 | 0.476 | 21.2% | 28.0% | 23.7% | 24.8% |
| Heroicons (outline) | 324 | 11.64 | 13.0% | 7.58–12.63 | 0.378 | 22.5% | 32.0% | 29.3% | 4.9% |
| Iconoir | 1383 | 12.23 | 15.1% | 8.75–13.63 | 0.361 | 22.7% | 30.4% | 21.6% | 16.3% |
| Fluent (16 regular) | 1717 | 11.80 | 12.2% | 8.87–13.28 | 0.414 | 29.7% | 32.0% | 43.7% | 35.8% |

Stroke weight was already uniform (every outline in `dist/svg/16` is 1.125). Concept by concept
(`tools/compare.py`, 662 Area icons with at least two counterparts in `docs/research/icon-audit/area-map.json`):

| Measure | Area's spread | Lucide's / Phosphor's for the same concepts | Area against the consensus |
|---|---|---|---|
| Size | sd 0.119 | 0.135 / 0.122 | slope 0.87, r 0.90 |
| Density | sd 0.194 | 0.169 / 0.188 | slope 0.94, r 0.83 |
| Mass | sd 0.266 | 0.260 / 0.266 | slope 0.92, r 0.88 |

**Findings.**

1. **Size and weight are not the set-wide problem.** Area's spread of apparent size, density and mass is
   the same as Lucide's and Phosphor's, and Area follows the libraries' consensus closely (r 0.83–0.90): an
   icon the libraries draw large, Area draws large.
2. **Solids are.** About a third of Area's icons carry solid ink (35%, against 16–17% in Lucide and
   Phosphor), and 30% have a solid island bigger than a ⌀2 dot (Phosphor 5%). In a row of line icons, each
   dot and block is a dark spot the eye catches: newspaper's picture, tag's eyelet, image's sun,
   app-window's three dots, globe built as a filled outline (Fluent's path). Area's sources hold 33 ⌀2 dots,
   62 ⌀1.5 dots, 27 solid blocks and 11 other solids (list below). Only Fluent, which Area started from, has
   more.
3. **The outliers are individual drawings.** Measured against the consensus for the same concept, 328 of
   775 icons have a flag (`audit-consensus.md`), many of them concept mismatches in the map. The clear ones
   fall in a few classes, below.
4. **Two readings, not measurements, that the strips show.** compass's needle runs NW–SE, the slash's and
   the "no entry" sign's diagonal, so at 16px it reads as ⊘. The case letters (Aa, AB, ab) are drawn at a
   6.5 cap, so they read 11–22% small beside text's 11px T and beside every library's Aa.
5. **Corner radii are consistent.** 72 of 84 large stroked frames are r 2, and 9 are r 1.5 (the mid
   containers, by the rule). The libraries round less (Lucide, Tabler and Material use the equivalent of 1.33
   at 16), so Area reads softer by the owner's choice, not by accident. No change.

## Published construction rules

Quoted from each set's own guide; NP = not published. The research subagent's full report, with quotes, is
in this folder's history (2026-10-31); the numbers are converted to a 16px canvas linearly.

| Set (source) | Padding | Circle : square | Stroke | Radius | Minimum gap | Dots and fills |
|---|---|---|---|---|---|---|
| Lucide (lucide.dev/contribute/icons/design-principles, /specification) | ≥ 0.67 | "match the visual weight of circle and square", judged blurred | 1.33 | 1.33 for elements ≥ 5.3, 0.67 below; "don't round corners where more than two lines meet" | 1.33 ("distinct elements must have at least 2 pixels of visual separation") | "Fills are officially not supported"; "details that are not necessary for recognition should be omitted" |
| Tabler (docs.tabler.io/icons/design-guide) | ≥ 0.67 | 1.0 (figure) | 1.33 | 1.33 | 1.33 | a dot is a zero-length line: a round cap, 1.33 |
| Material (m3.material.io/styles/icons/designing-icons) | 1.33 (live 13.3) | 20 : 18 = 1.11 | 1.33 | 1.33, interior corners square | NP | NP |
| Phosphor (Helena Zhang, uxdesign.cc and minoraxis.medium.com; Phosphor for Android rules) | 2 | 28 : 25 = 1.12; "keyshapes are roughly based on area calculations" | 1.0 at 16 | NP | "leave enough space… thinner strokes, and more of them, will make the icon busier" | "Use as few details as possible" |
| Fluent (fluent2.microsoft.design/iconography; maintainer notes, issue 44) | 1.33 | NP | 1.0 at 16 | NP | NP | "Glyphs contain only the details that are necessary" |
| SF Symbols (HIG; WWDC20 10207, WWDC21 10250) | optical margins | "adjust its dimensions" by visual weight | match the adjacent text | NP | NP | "An outlined symbol has no solid areas"; "include text… only when it's essential"; consistent "level of detail, optical weight, alignment" |
| Heroicons, Iconoir, Radix | NP beyond canvas and stroke (24/1.5, 24/1.5, 15) | | | | | |

Two points every set that publishes rules agrees on, and Area's set does not yet follow: **an outline icon
has no solid areas** beyond a dot drawn as a stroke's cap (Lucide, Tabler, SF Symbols), and **details that
recognition doesn't need are left out** (Lucide, Phosphor, Fluent, SF Symbols). Area's circle : square
ratio (r 6 ring 13.1 against the 12.1 square, 1.08; measured class medians 1.043 : 1.009) sits just under
Material's and Phosphor's 1.11–1.12, and keeps it.

## Rules Area adopts (proposed; owner to confirm on the review page)

Written into `.claude/skills/area-icon-construction/references/construction-system.md`, "Cohesion".

1. **Cohesion is measured against the consensus.** Run `tools/measure.mjs` and `tools/compare.py` on a
   new or changed icon. More than 7% off the consensus in size, 20% in density or 25% in mass is redrawn
   toward its peers or recorded with the reason.
2. **Solids are marks, not details.** A solid in an outline icon is allowed only where the solid is the
   icon's identity or one of the dot roles the rules already name (more, bullets, the i and ! dots, wi-fi's
   source, a centre point, a notification dot, a mark's own fill). Content inside a container (a picture,
   window controls, an eyelet, a sun) is drawn as a line or left out. Round 2 applies this to the list below.
3. **Long, thin objects lie on the rising diagonal** when that brings them to their keyline (link, pencil,
   key): a horizontal link is 13.1 × 7.1 and reads 19% light; on the diagonal it fills 12.8 × 12.8.
4. **An inner diagonal in a ring rises** (bottom-left to top-right). The falling diagonal belongs to the
   slash; a needle or bar on it reads as ⊘.
5. **Letters use their keyline.** A pair of letters spans the horizontal keyline (cap 7.5, x-height 4.5),
   so the case family reads at the size of text's T and of every library's Aa.
6. **A composition of separate shapes is a class of its own** (shapes, system, grid, component): separate
   parts on the gap scale cap each part at about 4.5 in the 12px box, so the icon reads lighter than a
   single silhouette. Its parts are made as large as the gaps allow, the triangle largest (it covers half
   its box).

## Round 1 (this session; review page)

| Icon | Change | Measured |
|---|---|---|
| system (new) | three options: A, shapes' triad rebalanced (the triangle 7.5 wide, the most a triad allows); B, Phosphor's arrangement (a tall triangle, circle over square); C, the four basic shapes, the diamond naming components | lint, slivers, 1× frames clean |
| bookmarks (new, for Collection) | bookmark's own drawing with a back copy, the multiples rule (offset 3 up and right, the back an open L) | ties Collection to References |
| compass, compass-dot | the needle on the rising diagonal, straight-sided with r 0.5 tips (was Fluent's leafy NW–SE needle, read as ⊘) | |
| link, link-off | on the rising diagonal: two r 2.83 hooks on centres 5,11 and 11,5, the bar 6,10–10,6, every 45° segment on the lattice; link-off keeps the shared slash | 12.8 square, from 13.1 × 7.1 |
| case-sensitive, case-upper, case-lower | cap 4–11.5 (7.5, from 6.5), x-height 4.5, bowls r 2.25; the pair reuses the single letters | about +15% |

Not changed in round 1, with the evidence: frame, history, git-branch, tag, layers, folder, home, flask,
settings, image, sticky-note and video sit within the consensus. `newspaper` is owner-chosen (Fluent's
news) and is heavy because of its solid picture: rule 2 decides it, so it waits for the owner's answer;
Updates may instead take `megaphone` or `scroll` (review page).

## Round 2 and on (after the owner rules)

- **Solids (rule 2).** Blocks: boolean-*, bot-agent, bot-designer, bot-guard, briefcase, contrast,
  desktop-play, file-video, file-zip, folder-zip, gauge, globe, globe-off, id-card, newspaper, paint-bucket,
  play-circle, qr-code, scan-qr, shadow, star-half, stop-circle, stroke-weight, text-color, usb (several are
  owner-recorded solids: each is asked, not changed). Inner ⌀1.5 details: app-window, tag, tags, tag-plus,
  bank, building, calculator, calendar, keyboard, server, smile and the faces, bots' eyes, swatch-book
  (62 in all). ⌀2 dots: image, images, image-plus, image-off, file-image, palette, thermometer (33).
- **Small or faint against the consensus:** corner and its turns (−36%), function, grip, line, eye-off,
  wand, call-end, voicemail, git-commit.
- **Large or heavy:** the type family's T glyphs (text, text-size, heading, spell-check, text-color,
  +20–31%), standalone arrows (+16%, owner-approved 2026-10-03: asked, not changed), person and people
  (+31–39% mass), kanban, list-plus, list-minus, list-x, diff, gif, markdown.

## Tools

- `tools/measure.mjs <set> out.json`: the optical measures for a whole set.
- `tools/compare.py <dir> [names] [--md]`: Area against the consensus, concept by concept.
- `tools/strip.mjs out.png "Title" names --refs --labels`: a group in one line per set at 16 / 20 / 24, as
  a key or nav shows them; `BEFORE_DIR` adds the shipped build above, `AREA_DIR` reads the sources.
- `audit-consensus.md`: every flagged icon before this pass; `area-measures-before.json`: Area's measures
  before this pass.

## Round 1 applied (2026-11-01)

Owner picks on the review page: system A (system is an alias of shapes, which takes the drawing), bookmarks for
Collection, newspaper's picture as text lines, and compass, link (with its 12px and 10px cuts) and the case family
approved. Batch 76; spec "Batch 76: Cohesion pass, round 1". The rules and the solids question were left unanswered.

## Round 2 (2026-11-01; review page)

Every solid and every flagged outlier, sorted against the record:

- **Content solids, redrawn:** app-window (two tab lines in its bar, Lucide's, instead of three ⌀1.5 dots) and
  briefcase (one plain band, Lucide's and Phosphor's, instead of Fluent's split band and clasp).
- **Kept, the icon's own mass or an owner pick:** quote, bold, stop-circle, record, the booleans, contrast, shadow,
  folder-zip, id-card, stroke-weight, qr-code, the play shapes in containers, gauge's needle, text-color's bar, the
  bots' visors, image's sun, paint-bucket's drop, usb's pins (line-weight squares), globe (owner: copy Fluent exactly;
  against the libraries' consensus it is −1% density, not an outlier).
- **Small or light, recorded:** voicemail (the widest its keyline allows), call-end (enlarged at the owner's request),
  wand (the open gap is deliberate), eye-off (the owner's closed eye), corner and corners (Figma's inspector marks);
  function, grip and git-commit match Lucide.
- **Large or heavy:** concept mismatches in the map. T and H match Lucide; pairs (Aa) are smaller in every set.
  gif and markdown are dense lettered labels: a later candidate.
- **Stroke pile-ups** (snowflake, gem, arrowheads, the flat slash crossing): measured blobs match Lucide's.
- **Asked:** inner detail dots at the line's weight (⌀1.125, Lucide's and Tabler's dot) instead of ⌀1.5, in the 62
  icons that have them; the i, !, ? and ⌀2 mark dots unchanged.

## Round 3 (2026-11-01; Icon Boards flags, review page)

Icon Boards (`tools/boards.py`, artifact 4debUbHgJLDBGmzXcUde6Q): the owner flagged container, move, plane, snowflake and
switch-camera, kept the line at 1.125 (Geist's stem is 0.085 em Regular, 0.107 em Medium: 1.10px for regular labels at
type 13), and noted the isometric and angled views beside a flat car and truck.

- Candidates: move with an open centre (Phosphor's); snowflake with shorter V's set in from the tips; switch-camera on
  camera's own body with a turning arrow for its lens; plane top-down nose up, or a side view (`plane-side`, a
  candidate source); container flat (three ribs) against keeping the isometric one.
- **Corner radius** (`tools/radii.py`, and the main-frame pass in this round): frames of one size use different
  radii. 144 large frames are r 2, 31 are r 1.5 (the folder family, bookmark, home, inbox, laptop, wallet, rectangle,
  ruler, hard-drive, newspaper, toolbox, building) and 5 are r 1 (kanban, truck, book-add, repository, scroll); mid
  frames split between 1.5 (archive, copy) and 2 (battery, cards). The rule names objects rather than sizes. Proposed:
  r 2 for frames ≥ 9 × 7, 1.5 for 5–8, 1 below, about 40 icons.
- **Bots:** ten (bot and nine role hats); only bot-agent is used in the app (AgentIcon, the Plan rail demo). Their
  heads are r 2.5, rounder than any other frame. Asked per bot: keep, revise or remove.

Round 3 applied 2026-11-01 as picked (spec "Cohesion pass, round 3"): radius by size in about 50 icons, plane top-down,
switch-camera on the camera, snowflake's V's given room, bot and bot-agent redrawn and the eight role bots removed (802
icons). move and container kept. Icon Boards republished from the new build.
