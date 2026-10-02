# Icon set audit (2026-10-01)

The owner asked for an audit of the whole set against Fluent, Lucide, Phosphor, Hugeicons, SF
Symbols and Cursor's published rules, then a cleanup: inconsistencies, visual quality and
coherence, with no conceptual changes.

## Method

1. **Coverage** (`coverage.md`, `area-map.json`): every Area name (513, with derived rotations)
   mapped to its counterpart in each library by meaning, each name verified in that library's
   files. Gaps are concepts at least three libraries have and Area lacks.
2. **Visual review**: one comparison sheet per batch (Area outline and filled, Fluent regular and
   filled, Lucide, Phosphor regular and fill, Hugeicons, SF Symbols regular and fill), reviewed in
   five ranges against the construction skill, plus a programmatic pass over shared parts across
   families (rings, radii, marks, arrowheads, dots, slash). Sheets with SF Symbols are local only
   (Apple's licence): `node apps/docs/scripts/icon-refs.mjs sheet out.png batch-N --sf`, which
   renders the symbols from the installed app with `sf-render.swift`.
3. **Optical audit**: `gen-pilot-icons.mjs --check --audit` (apparent size and density against the
   set median).

## Findings

The shared parts hold up: ring r 6 everywhere, reset's arc family, the r 5 lens, the shared slash,
4px corner marks, container radii, multiples' back copies, figure cuts and the type family's T
sizes all match their rules.

The largest pattern is **filled variants that read as negatives**: a ring or frame flooded with
its line drawing knocked out white (token, target, person-circle, picture-in-picture, film's grid,
compass's needle, home's door, pin), solids turned white (record, stop-circle, the Agent's
lenses), and closed shapes split by a knockout (prohibited). The skill's filled rules now say
"more ink, never a negative" and narrow "a closed shape holding a mark" to true marks.

Smaller patterns: some `-off` icons dropped their base's filled cuts (brain-off, flask-off);
corner-mark knockouts inset for a recorded near-miss stop short of the silhouette when filled;
a few newer icons put axis edges on whole pixels; a handful drifted from their family (kanban's
container, git-commit's node, document-remove's corner, square-slash's direction, stack-frame's
head); and construction lines in the spec were appended rather than replaced, so older lines go
stale.

## Applied

50 icons, recorded in `docs/specs/icons.md` ("Audit, 2026-10-01"), all back in review (twelve
had been approved: #4 token, #5 pin, #6 home, #7 menu, #8 cart, #9 key, #11 compass, #12 pointer and
server, #13 film and volume-off, #14 save). Sheets: `1-before-after-a.png` and `2-before-after-b.png`
(outline and filled, before and after, by batch). Lint passes for all 513; typecheck passes.

- **Filled, 25 icons:** token, pin, home, cart, key, compass, film, document-add, document-check,
  calendar-check, prohibited, stop-circle, record, unpin, thermometer, qr-code,
  picture-in-picture, bank, award, person-circle, flask-off, target, disc, file-lock, brain-off,
  cube-wireframe (plus bot-guard). Only key's outline changed (a ⌀2 hole in the bow, as Fluent's).
- **Outline, 24 icons:** menu, server, pointer, volume-off, save, skip-forward, bar-chart,
  activity, document-remove, kanban, leaf, mountain, wand, git-commit, translate, square-slash,
  mail-dot, git-pull-request-draft and -closed, network, app-window, call-incoming and -outgoing,
  stack-frame.
- **Records:** the skill's filled rules lead with "more ink, never a negative" and narrow "a
  closed shape holding a mark" to true marks; stale skill and spec values corrected (list bullets,
  text-size, paw, git nodes and heads).

## For the owner (by batch)

Details and conventions the audit raised but did not change:

- **#1 calendar, chat:** empty; most libraries give a dot grid or text lines.
- **#4 flow-wrap:** identical to grid (#7); its own drawing, or a recorded alias?
- **#5 pencil:** a ferrule band, as all four libraries draw. **#6 send:** a centre fold line
  (every library has one; at 16px send reads close to play).
- **#8 people:** filled, the back figure stays a line (the stack convention); fill both?
- **#11 building:** the 2 × 2 windows over the arched door read as a face; three rows of windows?
- **#23 indent/outdent:** move both chevrons together to centre them. **eraser:** about 1:2 like
  the references (it reads slim).
- **#28 hand, #48 agent, #55 crosshair, #35 camera-off:** filled treatments (fill the hand; fill
  the agent's halves as Fluent; the reticle; keep camera-off's lens).
- **#31 coins:** a rim on the front coin. **#33 boolean family:** a larger overlap (3 × 3 is a
  speck at 16px). **#35 picture-in-picture:** a larger window.
- **#61 guard:** reads largest in the cast (+14%, the flat top spans 1.5–14.5).
- **Set-wide:** three-line stacks centred on 8 sit on whole pixels (text-align, indent, the list
  family, waveform, chip's pins): accept as menu's precedent, or move to x.5?
- **Housekeeping:** padding-axis and padding-side are not in any batch (padding-axis equals
  padding-sides); minus and subtract are identical drawings; pin is a map pin while unpin is a
  slashed pushpin.
- **Coverage:** 40 priority gaps in `coverage.md` (corner-down-right, duplicate, file-text,
  clipboard-check, headset, toggle, accessibility, star-half, cart-add, book-open…), to queue or
  not.
- **Rejected round still to redo:** blocks, bandage (+48% dense), person-chat, binoculars (+44%),
  waypoints, toy-brick.
