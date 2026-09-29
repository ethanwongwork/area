---
name: area-icon-construction
description: Draw, redraw, review or plan Area's own stroked icons so the whole set has one optical system. Use whenever an icon in apps/docs/assets/area-icons-pilot (or a later Area icon family) is added or changed, when checking whether Area has an icon for a concept, when working through a reference set (Cursor, Lucide, Fluent) for gaps, when an icon reads larger, smaller, heavier, blurrier or denser than its neighbours, or when replacing a Fluent icon with an Area drawing.
---

# Area icon construction

Area icons are stroked centre-line drawings on a 16px grid. The goal is a set in which
every icon reads as the same size, weight and density, like Cursor's set, while staying
crisp at 1× and 2×. The rules live in `docs/specs/icons.md` ("Construction system"); the
lint in `apps/docs/scripts/gen-pilot-icons.mjs` enforces the measurable ones. The owner's
eye overrides any rule; when it does, record the exception in the spec.

Sources: Cursor's published construction (minoradventures.co, "The making of Cursor's
icons"), the owner's keyline diagram, and Fluent (MIT) as a size reference. Fluent is a
baseline, not an optical standard: its icons are not consistent with each other, so match
its sizes and conventions where they help, and let Area's rules win where they disagree. Cursor's paths
are proprietary. Use its rules and numbers only, and never trace its icons.

## Quick path

A new icon or batch, start to finish. Each step's detail is further down.

**Keep drawing; decisions on request (owner, 2026-09-28).** Don't wait on open system
questions: take the recommended option, record it as delegated here (Owner preferences) and in
`docs/research/icon-inventory.md` ("To settle"), and say so in the reply so the owner can
overturn it. When the owner asks for decisions, send a simple decision sheet that shows each
option rendered (explore candidates or `icon-sheet.mjs`), not a text list.

0. **Set up** a fresh worktree with `npm ci`. Serve the gallery with `PORT=<free port> npm run
   dev` (other worktrees may hold 3000 and 4321). In zsh a `$VAR` holding several icon names
   stays one word: pass names directly, comma-separated, or as a batch id.
1. **Find first.** `npm run icons:find -- <concept …>` searches names (with turns), demo
   labels, Fluent cuts, construction lines, batch notes and the build queue
   (`docs/research/icon-inventory.md`). Use what exists; if a family base exists, make a
   variant with the family's modifier (Families); if nothing does, check the queue's
   references and uses.
2. **Reference, never trace.** Fluent's cuts are local: `node apps/docs/scripts/icon-batch.mjs
   --fluent <stem>` finds the 16px pair (or the smallest that exists). Lucide's names and tags
   (search terms, ISC) can be fetched into the scratchpad from
   `https://unpkg.com/lucide-static@latest/tags.json` (follow the redirect). Cursor: rules and
   numbers only. Render a reference beside Area with `icon-sheet.mjs sheet out.png <path.svg> <name>`.
3. **Plan** the keyline, family and shared parts, the modifier, the filled roles and, for a
   dense idea, which simplification (Fitting a dense idea at 16px).
4. **Draw** in `apps/docs/assets/area-icons-pilot/<name>.svg` with the geometry toolkit
   (`npm run icons:geometry` prints it): fillets, cuts round marks and overlaps, lobes,
   transforms and a gap check. Solve values; don't nudge by eye.
5. **Lint loop:** `node apps/docs/scripts/gen-pilot-icons.mjs --only <name,name>` answers in
   under a second; every near miss names the distance to the nearest step (Lint messages).
6. **Look:** `icon-sheet.mjs sheet|strip out.png <names>` from the sources; after `npm run
   icons:pilot`, `filled`, `filled-large` or `compare out.png batch-NN` (Area outline and
   filled beside Fluent's regular and filled).
7. **Record:** write a batch file (id, title, date, note, and per icon its name, label, Fluent
   stem and construction line, plus an optional `extra` paragraph for what was dropped and
   why) and run `npm run icons:batch -- batch.json`. It updates batches.json (new icons in
   review), the spec's batch section, the demo label and Fluent plate, regenerates, and lints
   the batch.
8. **Gate:** `npm run icons:pilot` (the full lint, about a minute) and `npm run typecheck`;
   check the batch's cards on `gallery-icons.html`; send the owner a `compare` or `filled`
   sheet.
9. **Hand off:** update the icon line in `.Codex/HANDOFF.md`. Only the owner marks approvals.

## Owner preferences

The owner's decisions so far, so a new batch starts from them rather than from a guess. The
round-by-round record is in `docs/specs/icons.md`; add each new decision here too.

- **References:** Fluent first for everyday objects (the heart is Fluent's: round lobes, a
  45° V cleft, straight 45° sides). Figma for inspector and editing marks. Lucide where it
  is cleaner (moon, code). Cursor for the system. ChatGPT for roundness. When the owner
  names a reference, follow its construction closely.
- **Size:** icons should read the same size as their neighbours, judged beside rings. A
  keyline is a size to reach. The owner prefers an icon's natural proportion (folder about
  1.2 : 1) scaled up to its keyline over a smaller icon.
- **Shapes the owner chose:** a sharp classic bolt (flash); a closed eye with lashes (hide);
  a T with end ticks and a foot (text); three stacked isometric layers; one centred
  four-point sparkle, no satellites; a fuller five-point star (0.5 inner ratio, r 0.75
  tips); rotate as reset's own arc mirrored round a small square; a book with one page each
  side and both edges arched (an M).
- **Families:** a figure reuses person's head and dome body (people's back figure is cut by
  the overlap cut, 2.25 between centre-lines). Any shape passing behind another uses that
  cut.
- **Asymmetry:** natural forms read better uneven (cloud E: a tall lobe left of centre).
- **Detail (round 2026-09-26):** a fingerprint follows Fluent's: a tall core loop, ridges
  wrapping it and broken like a print's, their lower ends curving in like a finger's pad
  (straight legs read as arches), more than a few plain arcs but not dense. Puzzle knobs
  stick out like Fluent's (an r 1.5 dome on a short neck, 2 tall and 3 wide), not a flat
  half-dome. The gauge is B: a semicircle on short feet parted round a tapered needle
  (owner's reference). A laptop is a screen on a keyboard deck (Lucide), not a screen over
  a line. A chip has three pins a side.
- **Car:** the mirrors sit on the windshield's bottom line and merge into the body when
  filled; the window stays open (Fluent's car).
- **Filled objects follow Fluent's filled cuts:** a graduation cap's board and skirt are both
  solid with a V of space between them; details are negative space.
- **Variants relate to their base:** folder-open is folder's own outline (left side, tab,
  top, corners, right side) with the front swung down, its edge running to the bottom.
- **Pairs match:** cloud-download follows cloud-upload's construction (the arrow crosses
  the cloud's foot) rather than a cleaner stand-alone drawing.
- **Devices share parts:** tablet and speaker reuse phone's body or home bar, tv reuses
  desktop's screen, hard-drive reuses laptop's 1 : 2 slant.
- **Cohesion (owner, 2026-09-26):** patterns are audited across the whole set (slash,
  arrows, rings, folds, figures, overlap space, filled space, grouped functions); a new
  icon follows the family it belongs to (Families) before any reference.
- **Type glyphs are one family:** T, I, U, S, H share a cap height of 2.5–13.5 and the icon
  line (T keeps its serifs; bold is the solid B).
- **Clouds (owner, 2026-09-28):** every cloud icon uses the one cloud shape (moved, never
  redrawn); rain and bolts touch or cross its foot rather than floating below it.
- **Aligned gap:** qr-code keeps its rows even, so its dots meet the squares' rounded corners
  2.14 apart (`data-gap="aligned"`, owner-requested); use it only where the owner asks.
- **Close gap:** battery's terminal sits 2 from the body (`data-gap="close"`, owner-approved),
  one step under tight; use it only where the owner asks for it.
- **Solid exceptions:** quote's marks and bold's B are solid shapes, because the thing they show is
  solid (a bold letter reads bold only when heavy). Letters otherwise fill by weight, never
  as a solid with knockouts.
- **Sharp by nature:** flash and flag's swallowtail points are sharp (`data-acute`).
- **Proportions:** follow the object's real silhouette; a box that is too square and round
  at the bottom read as a plant pot (archive is landscape, like Fluent's).
- **Arrows:** reset's corner head is the model for every curved arrow. Heads are balanced
  about the arriving stroke.
- **Dislikes:** tiny satellites next to a main shape (sparkle's plus); icons that read as
  a different object (a shield-like heart, a lens-like globe); shapes that look small
  beside a ring; rounded points on objects that are sharp by nature.
- **Review:** show candidates on the Exploration sheet only for open questions, and remove
  them once the owner chooses. Send a rendered sheet with each batch.
- **System choices (owner-confirmed 2026-09-28):** the notification dot is ⌀3 on the host's
  top-right, the host cut round it by the overlap cut (on a ring at 45°); square containers
  are stop's square with the ring's marks unchanged; small shapes inside containers (the
  play, dots) are solid exceptions like stop-circle's square; chevrons-right keeps Fluent's
  4px spacing; no prohibited ring or small bug as corner marks. The agent mark is Fluent's
  agents shape (a hexagon split by a slash), never a cursor or pointer (it read as Cursor's
  brand). search-off is a full rising slash through the lens (an inside slash read as
  zoom-out). Follow Fluent closely for objects the owner compares with it (contact card,
  news, money, captions, exclude's hatching, chat sparkle's corner sparkle).
- **Detail first (owner, 2026-09-28):** more detail is better than the strict minimum. The
  lint's floors are lower: a *detail* gap of 0.875–1.125 (2 between centre-lines), tight
  running on to 1.75, counters from 1.0, straight corners down to 45°, and 0.875 in the
  filled variant. Use outlined rings rather than dots where a ring reads better (paw's
  toes, r 1.25; git's nodes, r 1.5), and give objects their characteristic details (the
  plane's silhouette, crown's balls and band, the banknote's dots and stack, the bank's
  plinth, the tree's branch, the pull request's arrowhead). Detail must still read with
  the family. The overlap cut is not relaxed: every crossing leaves exactly 1.125.
- **Type family (owner, 2026-09-28):** every type icon uses text's T built one way: bar,
  end ticks, stem and a foot about 0.45 of the bar. Sizes: text 11 (ticks 2, foot 5), the
  medium 6 × 6 T (ticks 1, foot 3) in line-height, letter-spacing, superscript and
  subscript, and text-size's pair (7 with ticks 1.5 and foot 3; 4 with ticks 1 and foot 2).
- **Rain** lines are different lengths (owner). qr-code is square like a real code (owner,
  2026-09-28): finders 5 × 5 at r 1 (not the container radius), square 2 × 2 modules (r 0.25)
  for the finders' centres and the four data modules, 3 apart.
- **Simplify before dropping (owner, 2026-09-28):** an idea too dense for 16px is simplified
  (Fitting a dense idea at 16px) before it is dropped; drop it only with the owner, and give
  an alternative (file-zip: archive, or a labelled file type).
- **Solids in the outline style** are exceptions, each recorded: quote's marks and bold's B,
  stop-circle's square and record's disc, the boolean operations' result, contrast's half,
  shadow's band, id-card's person, stroke-weight's bars, paw's toes (⌀2 marks). The solid is
  what the icon shows; ordinary details stay lines.

## The system at 16px

**Weight.** `--area-weight-icon`, 1.125px for Geist. Sources are authored at 1.25px and
judged at 1.125px. Ink = centre-line + 0.5625px on each side.

**Pixel grid.** Every horizontal or vertical stroke, rect edge and circle extreme sits on
the 0.5px grid. The whole-pixel grid lands on device-pixel edges at 2×. At 1×, a line on a
pixel centre (x.5) fills one row. On a whole pixel it smears across two half-grey rows,
so prefer x.5 unless the shape must centre on 8. Never use quarter coordinates on
axis-aligned edges; they blur at both densities. A 45° line runs through pixel corners or
pixel centres: x − y (falling) or x + y (rising) is a whole number. Measured on the
standalone check, that lifts the solid-pixel share at 2× from 0.66 to 0.82.

**Keylines.** Each icon declares `data-keyline` and its ink box must fit that shape (Cursor):

| Keyline | Ink box | Centre-line box at 1.125 | Examples |
|---|---|---|---|
| square | 13 × 13 | 12 × 12 (2–14) | add, align, bell |
| circle | ⌀14 | ring r 6 (ink 13.1) | info, status, search, settings, close |
| horizontal | 14 × 11 | 13 × 10 | eye, check, chevron, more |
| vertical | 11 × 14 | 10 × 13 | file, phone, pencil |

Circles are drawn larger than squares so they read the same size. The x.5 edge rule puts
square icons at 12.1 ink, so rings are r 6 (13.1 ink, about 8% larger, Cursor's 14 : 13) and
horizontal shapes run 13.1 wide (folder, mail, list, panel). A keyline is a size to reach,
not only a limit: `--report` flags an icon whose long side is more than 1.5 under it.
Rings at r 6.5 (14.1) read 16% larger than squares; the owner saw it beside folder. Dense shapes (gear,
lens with handle) sit about one pixel inside their keyline. Sparse shapes, made only of
open lines (cross, close, check), reach to within about a pixel of it.

**Negative space.** Negative space is designed like ink. Measure it in ink at 1.125px;
the lint prints every gap and counter with `--report`.
- **Gaps** between separate shapes come from a scale (a *detail* step, 0.875–1.125, sits under
  tight since the owner's detail round; tight now runs to 1.75):
  - *tight*, 1.125–1.625px: satellites such as the bell's clapper, the dot of an i or !,
    and a gear's hub, and overlap cuts (a gap equal to the line, 1.125px);
  - *standard*, 1.75–2px (3px between centre-lines): parallel strokes, bars, a pupil or
    check inside its surround;
  - *open*, 2.5px or more: space that no longer reads as a gap.
  Anything else is a near miss. Change it until it is one of the three, or join the shapes.
  Cursor's rule is the floor: cuts of 2.5 grid units or less blur into one shape.
- **Counters.** Enclosed pockets use the same scale. A satellite pocket, such as a
  clapper cup or a document's fold, may be tight (a 1.25–1.625px disc fits). Every other
  pocket is standard (1.75px or more; 1.875 for a 3px bar or an r 1.5 ring). Anything
  smaller reads as a blot at 16px: the r 1.5 clapper cup was 0.43, and Fluent's 3px
  dog-ear is 0.66 at this weight. Grow the pocket until it reaches a step, or remove it.
  A U shape (straight sides and a round bottom) holds a larger counter than a half-circle
  of the same width.
- **Wedges** where two lines meet at an angle are allowed. A layering line (a fold, a
  flap) must leave its pocket on the scale: the document's fold is 4px (tight 1.35), and
  the folder's flap closes the tab, leaving a standard 1.93px pocket. It doesn't run across
  the whole folder.
- **Balance.** Compare each icon's negative space with its neighbours in the balance strip.
  An icon with one large counter and one tiny one reads unbalanced even when both pass.
  Grow the small one, or merge it into the large one.

**Shared parts.** A part that appears in several icons is drawn once and reused exactly:
- ring: r 6 at 8,8 (info, help, clock, token, status-available, any circled glyph);
- check: 45° arms in a 1:2 ratio. Standalone it is 3.5 / 7 (M3 8 L6.5 11.5 L13.5 4.5).
  Inside a ring it is 2 / 4 (M5 8 L7 10 L11 6);
- corner radius, on the centre-line. The set should feel soft: no container corner is
  square, and the radius grows with the shape, so values differ but the softness is even.
  Rounder than Fluent's minimum, well short of ChatGPT's:
  - 2px for large containers and frames: document page, open's box, panel;
  - 1.5px for mid containers: folder, copy sheets, trash body, shapes, the book's outer
    page corners, square-dashed;
  - 1px for bars 3px tall (alignment) and small parts (the trash handle);
- overlap cut: where one shape passes behind another (shapes' circle), the hidden part
  stops so the gap equals the line (2.25px between centre-lines, 1.125px of space).
  Owner, round 4: 3px read too far. Every crossing uses it: people's back figure, shapes,
  shuffle's rails, a slash, a mark or arrow over a container (calendar-add, cloud-upload).
  Cut round the real geometry (a curve, not its chord: shuffle's 2.7 chord cut left 1.47).
  Two relations that are not crossings:
  - an attached part joins the shape it belongs to: clipboard's clip, calendar's pegs,
    lock's shackle, briefcase's handle, car's mirrors (their inks overlap, a join);
  - a stack shows only the back copy's L round the front's top left, ending a standard gap
    from it (copy, Fluent's and Lucide's): the hidden part is never drawn;
- marks (owner, 2026-09-26: every +, −, × and arrowhead is one of a few intentional sizes):
  - +, − standalone 11px (add, minus); beside or inside a shape 4px (person-add, zoom-in);
  - × standalone 10px (dismiss); beside or inside a shape 3.5px (volume-off, backspace), a
    diagonal reading larger than a 4px +; in a status ring 5px (error, the ring's glyph);
  - ✓ standalone 3.5 / 7 (check); inside a ring or shape 2 / 4 (status-available,
    shield-check); beside or on a shape 1.5 / 3, a 4.5 × 3 check, the 4px plus's partner
    (person-check, calendar-check, document-check). It sits where the plus would, moved
    0.5 in or down where the lattice or a gap needs it (the lint's gap scale decides);
  - arrowheads 5px on standalone arrows, 3px on an icon's main arrow (download, open, undo,
    log-in, return, trending-up), 2.5px on paired or contained arrows (sort, repeat, flow,
    history, cloud-upload, cloud-download). Rotate keeps 2.25px (2.5 reaches its square),
    move 2px (four heads on a 12px cross: 2.5 left their barbs 0.3px apart, 2 keeps a
    standard gap) and shuffle 2px (two heads stacked on one side, the same reason);
  - placement (audit 2026-09-26, owner 2026-09-27): the same rule for +, −, × and ✓, set by
    the kind of shape, never by the mark:
    - *inside, centred*: a closed shape whose open interior holds the mark with at least a
      tight gap (2.5 between centre-lines) on every side: a ring (add-circle, error), a lens
      (zoom-in), a shield (shield-check), a bookmark (bookmark-add), a chat bubble
      (chat-add). The silhouette stays whole; filled, the mark is a knockout;
    - *on the lower-right corner*: a container whose interior is taken by a band, fold or
      tab, leaving no room (calendar under its header, folder under its flap, document
      beside its fold): the mark replaces the corner, its right and bottom arms on the
      container's outer edges, and the container is cut open round it. Filled, its arms end
      on the outer edge, so the cut-out reaches the silhouette exactly;
    - *beside*: a figure (person-add, at head height to its right) or an open line shape
      (filter-dismiss on the funnel's lower right, volume-off);
    Cutting a shape whose outline is its identity (a bookmark's notched tail) is never
    right: move the mark inside or beside instead;
- an arrow meeting a frame (tray, box, door) stops a gap short of it: tight, 2.5 between
  centre-lines, where it points into a tray or out of a box (download, upload, share,
  open); log-in and log-out stop standard (3) from the door's back, the nearest the lattice
  allows;
- slash ("off" icons): one slash for every icon, identical in length, angle and ends:
  `M2 2L14 14` (45°, top left to bottom right, 12√2 long), round caps, in front. Cut the
  shape with `icon-geometry.mjs slash` one-sided (Fluent's and Lucide's pattern): the shape
  runs up to the slash from below left and stops an overlap cut short above right (2.25
  between centre-lines; 2.5 for lines that stay lines when filled). Cutting both sides
  removed twice as much and broke wi-fi and link apart. A shape too narrow for the slash to
  run into (mic's capsule, where the slash runs down its length) stops short on both sides.
  Keep the base icon exactly (wifi-off is wifi; a wider one takes the circle keyline).
  Outline pieces are `line`s; a solid shape is a whole `fill` parted by one `gap` above the
  bold slash; a line glyph's filled lines are `stroke` pieces cut 2.5. Two off states keep
  their own recorded form, declared `data-off="own"`: eye-off is a closed eye (owner) and
  volume-off a speaker with a 3.5px × (Fluent's mute). The lint fails any other `-off` icon
  without the shared slash;
- dots, two sizes by role (the lint allows only these):
  - ⌀2 for a dot that is the icon or one of its marks: more, list bullets, wi-fi's source,
    gap's dot, cart's wheels; on whole-pixel centres so they fill 2 × 2 pixels at 1×;
  - ⌀1.5 (1.33× the line) for a dot with a stem (the i of info, the ! of warning, the ?)
    and for a detail set inside a shape: keys (calculator, keyboard), lights (server, car),
    windows (building), eyes (smile), an eyelet (tag), opacity's grid. Place them on the
    gap scale from their frame and each other (quarter centres are fine for filled dots).
  Geist's own dots are rounded squares at 1.05× (i) and 1.3× (!) its stem. A circle needs
  a little more width than a square to look the same size, and 1.56× read too big.
  `data-dot="free"` records an owner-approved exception: quote's solid marks, rocket's ⌀2.5
  window;
- hub or pupil: r 1.5;
- satellites: the bell's clapper is a U cup 4 wide and 2.5 deep, joined to the base. The !
  and the i share the ⌀1.5 dot and the tight gap to their stem;
- layering: fold and flap lines are `cut`s in the filled variant, so the layer reads in
  both states;
- fold: a page's folded corner is 4.5px with an r 1.5 inner corner (document,
  document-add, sticky-note), a tight 1.53 pocket;
- figure: person is the standalone figure (head r 2.5, a dome body 10 wide, r 3.5
  shoulders). Beside a mark or in a group the figure is the small cut (head r 2, body 7
  wide, r 3), identical in person-add, person-remove and people's front figure (people
  sits 1 lower to fill the circle keyline); a second figure behind is overlap-cut;
- bars: 8 × 3 and 5 × 3, r 1, 3px between centre-lines (align family).

**Acute corners.** A straight join sharper than 60° pinches the negative space inside it
into a thin, sharp wedge (flash's 16° points, the A's apex, layers' side corners). The lint
fails any straight-to-straight join under 60°. Open the angle, or round the corner with an
arc, r 1 or more, as a fillet between the two lines. Prefer shapes whose points stay wide:
flash now has a flat top like Fluent's, with every corner filleted, and the droplet's tip
is an r 1.5 arc.

**Sharp-by-design exception.** A few objects are sharp by nature (a lightning bolt). The
owner may approve `data-acute="sharp"` on such an icon; record it in the spec. The stroke
fills the point solid, so no thin pocket shows. The counter rule still applies.

**Families.** Related icons share one pattern, as Figma's alignment icons do:
- the same parts at the same height, radius and spacing, and the same optical size. Every
  alignment icon uses 3px-tall bars with r 1 at 3px spacing and an 11px guide. Bar length
  follows the icon's space: beside a guide line the bars are 8 and 5 long; centred on the
  guide they are 11 and 7 long, so that align-center fills the keyline like align-left.
  With the 8 and 5 bars it read small;
- the same reading order: the primary (longer) element comes first, at the top for
  horizontal bars and on the left for vertical bars;
- the same derivation: one drawing, and the others as quarter turns, mirrors or a
  `transpose` (a mirror across the diagonal, which turns a horizontal family vertical and
  keeps its order). Never redraw a variant by hand;
- a guide line behind bars runs as stubs between them (align-center), so it reads as a
  layer, not a line through the counters;
- grouped functions reuse their base drawing exactly and change it only by a shared
  modifier: add and remove marks, the slash, arrows in or out, a mirror. Before drawing
  one, find its family and copy the base path, never an approximation:
  - calendar, folder, document → -add (mark on the corner);
  - person → person-add, person-remove, people;
  - cloud → cloud-upload, cloud-download (the cloud cut open where the arrow crosses it);
  - bell, mic, video, wi-fi, link → -off (the slash); eye → eye-off; volume → volume-off;
  - search → zoom-in, zoom-out (the r 5 lens); lock → unlock;
  - download, upload, share (a tray and a 3px arrow); log-in, log-out (a door);
  - play, pause, stop, skip; undo, redo, reset, refresh, history, rotate (reset's corner
    head); repeat, shuffle (rails at 4.5 and 11.5; repeat is Fluent's loop, r 3.5 ends); thumbs-up → thumbs-down.

**Filled variants.** Every icon has one, derived from the outline, never drawn
separately. Filled is about emphasis and layers, not flooding the shape:
- **Enclosed shapes fill.** Mark each shape with `data-filled`:
  - `solid` fills it and keeps the outline's outer edge;
  - `knockout` cuts an inner detail out at the icon weight, with round caps (the i, the
    check, the pupil ring, a document's text lines);
  - `hole` cuts an interior out (the gear hub, the i dot).
- **Layers separate.** Where the outline shows two parts or layers, the filled variant
  shows negative space between them, even where the outline strokes join:
  - `cut`: a layer line (a fold or a flap). The outline draws it as a stroke; the filled
    variant turns it into a gap at the icon weight with square ends and sharp corners,
    extended past the silhouette so it runs cleanly through. It must start and end with
    straight segments. Never let a cut end inside the fill, where its rounded cap shows
    as a notch;
  - `gap`: a separation that exists only in the filled variant, such as the line between
    the bell's body and its clapper (Fluent does the same).
  - `line`: a layer line drawn only in the outline, whose place a `gap` takes when filled.
    Use it for a curved layer line a cut can't extend straight out of (database's band).
    An unmarked stroke is drawn on top of the fill and would close its own gap;
  - `fill`: a solid drawn only in the filled variant (a slashed icon's whole shape).
  - `halo`: a filled-only copy of a line that starts inside a solid and runs out past its
    edge (cloud-lightning's bolt, Fluent's thunderstorm): the solid is cut back one icon weight
    round it and the line stays ink. Marks and arrows stay knockouts (owner, 2026-09-27);
  - a layer line that starts on another layer line (layout's sidebar under its header)
    is a `line` plus a `gap` extended at its free end only: a `cut` extends 2px at both
    ends and would run on into the other layer;
- **Where negative space goes** (researched against Fluent's filled set, with Phosphor
  and Material where Fluent has no cut; owner, 2026-09-27). Compare every filled variant
  with Fluent's filled cut before calling it done (`.cache/cmp.mjs` renders Area outline,
  Area filled, Fluent regular and Fluent filled side by side):
  - **Faces of equal standing** (a box's faces, a folder's flap, a calendar's header, a
    book's spine, a mail's flap, a laptop's hinge): a `cut` centred on the outline's line,
    run out through the silhouette (Fluent's box, folder, calendar, mail).
  - **A part in front of another** (a clip on a board, a cap's board over its skirt, a
    bell's body over its clapper, a watch's face over its straps): the front part keeps its
    whole outline edge; one icon weight of `gap` is cut from the part behind, right
    outside the front part's edge and following its shape (Fluent's clipboard, graduation
    cap, bell). A gap centred on the line, or run on through the front part, shaves it.
  - **Details inside a solid** (marks, keys, hands, text lines, a keyhole) are knockouts; a
    mark on a container's corner notches it.
  - **A closed shape holding a mark fills and knocks the mark out** (add-circle, error,
    clock, zoom-in and zoom-out's lens, as Fluent's zoom). An open line glyph (search,
    arrows, chevrons) fills by weight.
  - **Glass stays open** in a vehicle: the car's cabin stays a line (Fluent's car).
  A gap along a layer line stops where that line stops (package's tape at the V).
- **Every detail over a solid is negative space** (owner, 2026-09-27): marks, arrows, keys,
  tape, text lines. A mark or arrow that crosses the silhouette's edge is a knockout too:
  it runs out through the edge as a notch and the part beyond the edge is not drawn
  (cloud-upload's stem, cloud-download's head). A line drawn black over the fill with a
  halo round it (tried as a `front` role) read as an outlined sticker, unlike every other
  filled detail, and was removed. The lint fails a knockout that never enters a solid.
  A mark beside a solid (person-add's plus) is not over it and stays a line.
- **Only closed parts that are the object fill.** A band, handle or stand that joins solid
  parts stays a line (headphones' band); if one closed path would fill the space between
  parts, split it. A shape in front of another (printer's sheet) needs a `gap` where it
  overlaps. Review every filled variant with `icon-sheet.mjs filled` (`filled-large` adds
  a 64px row for cut-outs). An open solid fills with a straight chord between its ends:
  close the path unless that chord lies where an edge should be (printer's runs behind its
  sheet, a strap's along the body's edge); wallet's crossed its flap and left a wedge.
- **Line glyphs fill by weight.** An icon with no solid shape (add, check, arrows, link,
  reset…) gets its filled variant by drawing every stroke at 4/3 of the icon weight
  (1.5px, Fluent's filled line), with dots grown by the same amount. Only line glyphs
  thicken: in an icon with a solid, the lines beside it (align-left's edge line, trash's
  lid, paint bucket's handle) keep the icon weight, so their lengths and gaps match the
  outline. Fluent does the same (owner, 2026-09-27; measured: paint bucket's hanger,
  align left's guide and delete's lid are 1px in both regular and filled, text align
  left's lines go 1 → 1.5).
- **A heavier line does not get longer.** A 1.5px round cap reaches 0.19px further than a
  1.125px one, which lengthens the line and closes gaps (open's arrowhead gap closed this
  way). Free ends, which touch nothing else, retract by that amount along their end
  segment, so visible lengths and gaps match the outline. The generator does this; the
  lint measures filled gaps on the retracted geometry.
- **Gaps must survive the heavier line.** The lint rechecks every gap at 1.5px; it must stay
  at least 1px (Cursor's 2.5px between centre-lines). Prefer standard gaps in line
  glyphs.

**Proportions from references.** Where Fluent and ChatGPT agree on a shape, follow them:
- panels are Fluent's frame (11 × 9 on the centre-line, r 2) with a divider line; the side
  pane fills only in the filled variant, never as a pill in the outline;
- a book's page tops hump up and meet at the spine (an M, not a V), with the bottom edges
  following them, and rounded outer corners;
- options has two sliders with large knobs;
- a document's fold is 4.5px (Shared parts, fold);
- text is a T with end ticks and a foot (Fluent's text_t, Lucide's type), not a letter A;
- layers are three isometric layers facing up (Fluent's three, Area's orientation);
- flash is a sharp classic bolt: a flat top, one notch and shoulder each side, and a sharp
  tip. Rounding its points made it read blobby and fat;
- layered shapes are the same width: when a filleted corner pulls a shape's side in, trim
  or place the layers below so their ends line up with it.

Check ChatGPT's icon set for proportion and roundness, but keep Area's grid and weight.
For inspector and editing icons (flip, rotate, flow, corners, padding, hide), follow
Figma's editor icons: small, compact shapes; triangles that point at the axis for flip; a
rotated square with a short arc for rotate; small boxes with a short arrow for flow;
corner arms well short of the box; a closed eye for hide.

**Arrows.** One arrowhead system, so arrows read as arrows at 12px:
- standalone arrows: a 90° head with 5px legs on a 12px stem (M8 14 V2 M3 7 L8 2 L13 7),
  Fluent's proportion; other directions are rotations;
- arrows inside another icon (reset, open, expand, out-of-office): a 90° head with 3px
  legs, identical in every icon;
- a secondary arrow that annotates other shapes (flow's direction arrow, rotate's arc) uses
  a smaller head, 2.5px (flow) or 2.25px (rotate), so it doesn't outweigh the shapes it
  describes (owner: flow's 3px head was too big);
- a head is balanced about the stroke that arrives at it: its two barbs are equal and
  sit symmetrically either side of the arriving direction. On a curve, put the head where
  the arc's tangent bisects the barbs, or use Fluent's corner head (reset: the arc ends at
  the corner of an L with equal barbs, up and right). Never let one barb crowd the curve
  it came from;
- heads sit on the diagonal lattice. Never shrink a head to fit; move or resize the body.

**Soft transitions.** Where an object's outline changes direction as part of its form (a
bell's flare, a cup's lip, a base meeting a side), draw a curve, and give the end a small
radius (0.5px on the centre-line), not a 45° step or a hard corner. The bell's flare runs
from 3px above the base as an S-curve and meets the base with an r 0.5 corner. A short
diagonal step read as sharp and understated. Geometric corners (rects, arrowheads,
chevrons) keep their rules.

**Lines and angles.** Lines run at 0°, 45° and 90°. A radial exception such as the gear
must be declared with `data-angles="radial"` (gear) or `"free"` (triangle). Round caps and joins. Corners are rounded
after the geometry is set. Prefer closed shapes to open ones. Keep an object's natural
proportions. Diagonals run from bottom-left to top-right; slashes run the other way.

**Centring.** The ink box is centred on 8,8. The exceptions are optical and recorded:
shapes with a heavy base (bell, the i of info) sit about 0.25px high, a triangle is
lifted until its ink box is centred (its mass sits low), and pointed shapes
(chevron, check) may sit up to 0.25px off centre to stay on the diagonal lattice.

**Sizes.** One 16px drawing serves every slot, but the line does not scale with it. It
follows the size curve, line ∝ size^0.45, which is Cursor's step from 1.25px at 16 to 1.5px
at 24:

| Size | 12 | 16 | 20 | 24 | 32 |
|---|---|---|---|---|---|
| Line | 1.0 | 1.125 | 1.24 | 1.35 | 1.54 |

Uniform scaling made large icons too thick (2.25px at 32) and small ones too light (0.84 at
12). Pass `size` to a pilot icon, or `size` to `Glyph` (base.css holds the factors), and
the line follows the curve. At 12px the tight gap falls to about 0.9px, so a dense icon
that must read at 12px on 1× screens gets its own 12px cut.

**In components.** A component that draws its own glyph uses `Glyph` from
`packages/react/src/components/Glyph.tsx`. Add the icon (or one element of it) to
`PACKAGE_GLYPHS` in the generator, never a hand-copied path, and pass the slot's `size`.
base.css sets the line from `--area-weight-icon` and the size curve.

## Process

The quick path, in detail.

1. **Plan.** Name the keyline, the family and shared parts it reuses, and the Fluent
   equivalent; search first (`npm run icons:find`).
2. **Draw** in `apps/docs/assets/area-icons-pilot/<name>.svg`, using absolute commands and the
   attributes of the existing sources (`data-set`, `data-keyline`, stroke 1.25, round caps
   and joins, `fill="none"`; a solid is `fill="currentColor"` with no stroke). Generate
   parametric shapes, such as the gear, with a script and solve for grid-aligned values;
   don't nudge by eye. Use only path, circle and rect: the lint rejects anything it cannot
   measure (an ellipse was once skipped silently).
3. **Lint** with `gen-pilot-icons.mjs --only <names>` while drawing, and the full
   `--report` (or `npm run icons:pilot`) before recording. It checks the 0.5px grid (filled
   edges too), the diagonal lattice, the keyline, gaps, counters (filled solids count as
   ink), the live area (centre-lines within 1.5–14.5), angles and attributes, dot sizes, the
   shared slash on `-off` icons, and knockouts that leave their solid, and prints each icon's
   ink box and centre.
4. **Review** each icon on `gallery-icons.html`. It is grouped by batch, from
   `apps/docs/assets/area-icons-pilot/batches.json`, which also records the owner's status
   for each icon (approved, revising, review), shown in the component gallery's status
   colours (Complete, In review, Unrefined). New icons go in as `review`, and an icon you
   change goes back to `review` (`icon-batch.mjs --review name`); everything the owner has
   looked at is approved (owner, 2026-09-26). The page opens with **In review** (a card per
   open icon, newest batch first), then **All icons** (every icon, outline and filled at 16px,
   one group per batch, newest first; a dot marks an icon in review; a cell links to its
   card), then the approved cards, one closed section per batch. A card shows the icon at
   every size on the size curve, 3× plates (Area, Fluent, Area over Fluent, filled) and the
   icon in a Button, icon Button, Badge and the current Nav item (filled). Directional
   families are one drawing with `data-rotations` (quarter turns, `flipx` / `flipy` mirrors
   or `transpose`); never redraw a variant. Only the owner marks an icon approved. For a quick
   look, or to send the owner a batch, render with `icon-sheet.mjs`: `sheet` (16, 32 and
   96px), `strip` (16 and 32px with a blurred copy, the squint test), `filled` /
   `filled-large` (outline beside filled) or `compare` (beside Fluent's cuts). Then compare
   the set on `gallery-iconography.html`:
   - *Side by side*: Fluent and Area at 16px and at 4× on the pixel grid with the
     keyline, and Area drawn over Fluent;
   - *Optical balance*: the whole set in one line at 16 and 32px. Look for the icon
     that jumps out as larger, smaller, darker or denser;
   - *Filled*: outline, derived filled variant and Fluent's filled cut;
   - *Pixel check*: 1× and 2× rasters, beside Fluent's.
5. **Audit optical size** with `node apps/docs/scripts/gen-pilot-icons.mjs --check --audit`
   (the full set: medians need every icon). It rasterises each icon and reports:
   - apparent size (√ of the ink's convex-hull area) and density (ink per hull area),
     each against the set's median;
   - read results within a class: line glyphs (add, check, chevron, arrows, more) have thin
     hulls by nature; full rings run about 15% large by design (circles are drawn larger);
     diagonal shapes (a bolt, a diamond) read small by hull even when they fill their keyline;
   - a solid shape more than about 8% under the median, or a density above about +25%,
     is a candidate to enlarge or lighten. Confirm by eye in the whole-set grid.
6. **Judge** density as well as size. Count parallel strokes and corners. If an icon reads
   heavier than its neighbours, remove a line or corner, or pull it inside its keyline,
   before thinning any stroke.
7. **Explore** when there is more than one good answer. Put the candidates in
   `apps/docs/assets/area-icons-pilot/explore/`, with `data-group` and `data-label` on each.
   They are linted without failing the build, and the gallery's Exploration section shows
   each one at 16px and 4× with its gaps, counters and rule findings. Delete them once the
   owner chooses.
8. **Record** with `npm run icons:batch -- batch.json`: the construction line for each icon,
   and any exception or dropped idea (`extra`), lands in the batch's section of
   `docs/specs/icons.md`. A decision that applies beyond one icon also goes in Owner
   preferences above.

## Fitting a dense idea at 16px

When an idea won't fit (its gaps and counters fail however it is arranged), simplify it in
this order before dropping it. Each worked in batch 43 (owner: "can they be simplified so
they fit?"); name the simplification in the icon's construction line.

1. **Use the whole keyline.** id-card's card is 13 × 10, the horizontal keyline's most.
2. **Make a small detail solid** (Fluent's trick). A solid needs no counter: id-card's head
   and shoulders, paw's toes, shadow's band. Record it as a solid exception.
3. **Move the secondary part onto the edge or corner** and cut the container open round it
   (the overlap cut). If it runs past the silhouette, fill it with a `halo`: file-code's
   chevrons, cloud-lightning's bolt; the container marks (document-add) sit on the corner the
   same way.
4. **Borrow the family's own content** instead of new detail: image's mountain and sun on a
   page (file-image), text's T between guides (line-height, letter-spacing).
5. **Draw it as a line glyph from shared roots:** one path whose strokes meet at points
   leaves only wedges, no counters (plane).
6. **Drop the ornament that forces the conflict:** git-pull-request has no arrowhead
   (Lucide's current icon); newspaper keeps the curled page and loses the picture.
7. **Bring the owner another metaphor** when nothing fits: file-zip → archive, or a labelled
   file type.

## Lint messages and their fixes

| Message | Usual fix |
|---|---|
| … is off the 0.5px grid | Move the axis edge to x.5 (whole only when the shape centres on 8). Filled paths' edges count too. |
| … is off the diagonal pixel lattice | Pick endpoints with x + y (rising) or x − y (falling) whole. Whole shifts keep the lattice; half shifts break it. |
| … is not at 0°, 45° or 90° | Use the three angles, or declare `data-angles="free"` when the concept sets the angle (a bolt, a wing, a Σ). |
| corner … is …°; below 60° | Round it with `icon-geometry fillet` (an arc, r ≥ 1, or 0.75 on small points), or open the angle. `data-acute="sharp"` only for objects sharp by nature, with the owner. |
| shapes p and q leave a …px gap; move them … | Apply the distance it names. Tight/standard near misses are usually 0.05–0.15: a 0.25 shift of one part, or a radius. Diagonal near misses at rounded corners need the corner radius changed, not the position. |
| shapes p and q close to …px in the filled variant | Filled lines are 1.5px: move the parts the named distance apart, or turn a free end away. |
| an enclosed counter is …px across; make it … | Grow or shrink the pocket by the named amount (a radius, a line's position), make the detail solid, or remove the pocket. |
| ink … exceeds the … keyline | Pull the shape in, or declare the keyline that fits it (square 13, circle 14 for round or sparse frames, horizontal 14 × 11, vertical 11 × 14). |
| centreline … leaves the 1.5–14.5 drawing area | Pull it in; arc extremes count. |
| unsupported command / relative command | Absolute M, L, H, V, C, S, Q, A and Z only. |
| stroked shapes must have fill=none | A solid is `fill="currentColor"` with no stroke, its axis edges on the grid. |
| an off icon draws the shared slash | `M2 2L14 14`, the shape cut one-sided (`icon-geometry slash`). |
| a knockout lies outside every solid | The detail isn't over a solid: draw it as a plain line, or as a line with a `halo`. |
| a dot is r 1 or r 0.75 | ⌀2 for marks, ⌀1.5 for details inside a shape; `data-dot="free"` for a recorded solid. |

## Geometry toolkit

`apps/docs/scripts/icon-geometry.mjs` (`npm run icons:geometry` prints the usage). Every
command prints absolute paths ready for a source.

- `fillet "x,y …" "r,…"` / `open-fillet`: a polygon or polyline with arc corners (0 keeps a
  corner sharp). Fillets never trip the acute rule.
- `mirror "<d>"`: the other half of a symmetric drawing, across x = 8.
- `slash "<d>" "2,2 14,14"`: the off icons' one-sided cut round the shared slash (`--both`
  cuts both sides).
- `cut "<d>" "x,y x,y … | …" [clear]`: a shape cut open round lines in front of it (marks,
  arrows, rain, a bolt), 2.25 by default (use 2.3 when a result lands at 1.12).
- `behind "<back d>" "<front d>" [clear]`: the overlap cut round a closed shape in front
  (coins, people, cloud-sun's sun).
- `lobes <foot> "cx,cy,r …"`: a lobed outline on a flat foot, left to right (`lobes 12.5
  "4.5,10,2.5 7.5,7,3.5 11,9.5,3"` is cloud.svg; the tree's crown is the same construction).
- `transform "<d>" <scale> [ax,ay] [dx,dy]`: a family part at another size or place (the
  sparkle in wand, the cloud in cloud-sun). Scaled radii are fine; check that axis edges and
  circle extremes still land on the 0.5 grid.
- `gap "<d1>" "<d2>"`: the ink gap between two strokes at 1.125 and its step, without a lint run.

## Review checklist

- Did you search first (`icons:find`), and is the icon in its family with the family's modifier?
- Is it recorded (`icons:batch`): review status, construction line, label and Fluent plate?
- Does the icon belong to a family (Families, grouped functions)? Is its base copied
  exactly and changed only by the shared modifier?
- Does every crossing use the overlap cut, every attached part join, and every mark sit
  where the placement rule puts it?
- Is every dot ⌀2 or ⌀1.5 by its role?
- In the filled variant, is every detail over a solid negative space, and is every open
  solid's chord where an edge should be?
- Is every icon the same apparent size in the balance strip, at 16 and 32px?
- Is every gap tight, standard or open, and is every counter tight (satellite pockets) or
  standard?
- Is the negative space balanced, with no tiny pocket beside a large one?
- Does the filled variant keep the outline's silhouette, with knockouts on the gap scale,
  layers separated, and no gap closed by a heavier line?
- Do related icons share parts, spacing, reading order and derivation?
- Is every arrowhead balanced about the stroke that arrives at it, and the shared size?
- Is any corner under 60°, or any pocket thin and sharp? Is every container on the shared
  radius?
- Are the same parts (ring, check, dot, hub, radius) identical wherever they recur?
- Are axis-aligned edges on the 0.5px grid, and on x.5 where the shape allows? Are
  diagonals on the lattice?
- Is the density even? Watch gears, lists and nested shapes.
- Is the ink box centred, or is the offset a recorded optical exception?
