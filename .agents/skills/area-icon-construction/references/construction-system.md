# The construction system at 16px

The rules every Area icon is drawn to, enforced where measurable by `packages/icons/scripts/generate.mjs`. Moved verbatim from SKILL.md (2026-10-19).

## Contents

- Weight
- Pixel grid
- Keylines
- Negative space
- Shared parts
- Acute corners
- Sharp-by-design exception
- Families
- Filled variants
- Proportions from references
- Arrows
- Soft transitions
- Lines and angles
- Centring
- Sizes
- In components
- Cohesion


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
- **Gaps** between separate shapes come from a scale. No gap is narrower than the line (owner, 2026-11-01: at 16 the
  0.875–1.125 *detail* step of the 2026-09-28 detail round read as clumped lines, and Lucide and Tabler keep 1.33);
  the one exception is the ⌀1.5 dot under a !, i or ? stem (0.94, owner, 2026-10-03). Tight runs to 1.75:
  - *tight*, 1.125–1.625px: satellites such as the bell's clapper, the dot of an i or !,
    and a gear's hub, and overlap cuts (a gap equal to the line, 1.125px);
  - *standard*, 1.75–2px (3px between centre-lines): parallel strokes, bars, a pupil or
    check inside its surround;
  - *open*, 2.5px or more: space that no longer reads as a gap.
  Anything else is a near miss. Change it until it is one of the three, or join the shapes.
  Cursor's rule is the floor: cuts of 2.5 grid units or less blur into one shape.
- **Counters.** Enclosed pockets use the same scale, with a floor of 1.5 (owner, 2026-11-01). A satellite pocket,
  such as a clapper cup or a document's fold, may be tight (1.5–1.75). Every other pocket is standard (1.75px or more;
  1.875 for a 3px bar or an r 1.5 ring). Anything
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
- corner radius, on the centre-line, set by the frame's size, never by the object (owner, 2026-11-01:
  folders at r 1.5 sat beside keyboards and cameras of the same 12 × 10 at r 2), and on the less round scale the owner
  chose the same day (about Lucide's 1.33 at 16):
  - 1.5px for a frame 9 or more long and 7 or more high: document page, folder, bookmark, mail, calendar, camera,
    laptop, wallet, panel, the scan corners;
  - 1px for a frame 5 to 8 (copy's sheets, the booleans' squares, lock and gift bodies, folders' back copy), and for
    bars 3px tall and small parts (the trash handle, a phone in devices, building's annex);
  - a curve that belongs to a glyph, a figure or an organic shape is not a corner and keeps its drawing (command's
    loops, braces, quote, the person's shoulders, bug, gauge, the database cylinder), and an object whose roundness is
    its shape keeps it (mouse, gamepad, the handset, toggle). `docs/research/icon-cohesion-2026-10-31/tools/reradius.py`
    changes a radius without moving the shape; `tools/radii.py` audits it;
- overlap cut: where one shape passes behind another (shapes' circle), the hidden part
  stops so the gap equals the line (2.25px between centre-lines, 1.125px of space).
  Owner, round 4: 3px read too far. **A gap is information, never style** (owner, 2026-10-02,
  from Cursor's set): the overlap cut separates layers (a stack's back copy, a figure or coin behind
  another, the sun behind a cloud) and a mark or badge from its host. Shapes on one plane cross
  whole (shapes, atom, the booleans' outlines), the slash crosses flat in the outline, and no
  stroke is opened for style (alarm's closed bells, strikethrough's one S, closed caps and cuffs).
  The crossings that keep the cut: people's back figure, shapes,
  shuffle's rails, a slash, a mark or arrow over a container (calendar-add, cloud-upload).
  Cut round the real geometry (a curve, not its chord: shuffle's 2.7 chord cut left 1.47).
  Two relations that are not crossings:
  - an attached part joins the shape it belongs to: clipboard's clip, calendar's pegs,
    lock's shackle, briefcase's handle, car's mirrors (their inks overlap, a join);
  - multiples and stacks (files, folders, copy, chat-multiple, gallery; owner, 2026-10-02,
    replacing Fluent's concentric halo) follow Phosphor's layering: the back copy is the same
    shape at the same radius, offset 3 along the diagonal (up and right; chats' second bubble
    down and right, mirrored; gallery's back copy down and left), and only its uncovered edges
    are drawn, stopping one overlap cut short of the front, an open L as Cursor's copy and folders
    (`icon-geometry behind <back> <front> 2.3`); the hidden part is never drawn. Offset 3 keeps parallel diagonals (a fold, a tab step)
    open at 3.12; 2.5 left them 2.41. Filled: the front fills, the back stays a line. Source:
    `docs/research/icon-review/2026-10-02/multiples-phosphor.py`. A stack of flat cards shows the
    cards behind as two shorter lines above (cards, Phosphor's cards-three);
- marks (owner, 2026-09-26: every +, −, × and arrowhead is one of a few intentional sizes):
  - +, − standalone 11px (add, minus); beside or inside a shape 4px (person-add, zoom-in);
  - × standalone 9px (dismiss; 0.82 of the +, as Phosphor; 10 read 20% larger than add, 2026-10-16); beside or inside a shape 3.5px (volume-off, backspace), a
    diagonal reading larger than a 4px +; in a status ring 5px (error, the ring's glyph);
  - ✓ standalone 3.5 / 7 (check); inside a ring or shape 2 / 4 (status-available,
    shield-check); beside or on a shape 1.5 / 3, a 4.5 × 3 check, the 4px plus's partner
    (person-check, calendar-check, document-check). It sits where the plus would, moved
    0.5 in or down where the lattice or a gap needs it (the lint's gap scale decides);
  - arrowheads 5px on standalone arrows, 3px on an icon's main arrow (download, open, undo,
    log-in, return, trending-up), 2.5px on paired or contained arrows (sort, repeat, flow,
    history, cloud-upload, cloud-download). Rotate uses reset's 3px head (Fluent's rotate, 2026-10-03),
    move 2px (four heads on a 12px cross: 2.5 left their barbs 0.3px apart, 2 keeps a
    standard gap) and shuffle 2px (two heads stacked on one side, the same reason);
  - placement (audit 2026-09-26, owner 2026-09-27): the same rule for +, −, × and ✓, set by
    the kind of shape, never by the mark:
    - *inside, centred*: a closed shape whose open interior holds the mark with at least a
      tight gap (2.5 between centre-lines) on every side: a ring (add-circle, error), a lens
      (zoom-in), a shield (shield-check), a bookmark (bookmark-add), a chat bubble
      (chat-add). The silhouette stays whole; filled, the mark is a knockout;
    - *inside a container* (owner, 2026-10-04, replacing the 2026-09-27 corner placement): a
      container (document, folder, calendar, clipboard, cloud, mail, image) holds its mark inside
      its body, below its fold, flap or header, centred in the free interior with at least a
      detail gap all round, in both styles (Phosphor, Material, Cursor). Filled, the body fills
      and the mark is a plain knockout with round ends: no corner notch, no sawn arm. Use the
      1.5 / 3 check or the 3px + where the 2 / 4 check or 4px + does not fit. Corner arrows on
      files (file-download, file-export) move inside the same way;
    - *beside*: a figure (person-add, at head height to its right) or an open line shape
      (filter-dismiss on the funnel's lower right, volume-off);
    Cutting a shape whose outline is its identity (a bookmark's notched tail) is never
    right: move the mark inside or beside instead;
- an arrow meeting a frame (tray, box, door) stops a gap short of it: tight, 2.5 between
  centre-lines, where it points into a tray or out of a box (download, upload, share,
  open); log-in and log-out stop standard (3) from the door's back, the nearest the lattice
  allows;
- **mark pass rules (owner, 2026-10-02; spec "Mark pass"):** the ! and the i have a ⌀1.5 dot 2.25 below
  the stem's end (ink gap 0.94; owner 2026-10-03: the old 2.75 read loose), stems 0.5 longer; the ? dot 2.25
  below a longer hook; ring,
  shield and square containers take the ring's marks; corner arrows sit in the plus's 4 × 4 box 1 in
  from the edge they point at, 2px heads, so no barb leaves a triangle of fill against the edge;
  frame-contained chevrons and git heads are 2. Before calling a filled variant done, run
  `slivers.mjs` (it flags islands of fill too) and look at `sizes.mjs` at 32 and 48;
- slash ("off" icons): one slash for every icon, identical in length, angle and ends:
  `M2 2L14 14` (45°, top left to bottom right, 12√2 long), round caps, in front. **In the
  outline the slash crosses flat** (owner, 2026-10-02, Cursor's "no shadow effects"): the base
  icon is drawn whole as outline-only `line`s and the slash lies on top, with no gap. Where the
  slash leaves a sliver against the shape, `data-counter="sliver"` records it (mic-off, camera-off,
  flask-off, unpin). Keep the base icon exactly (wifi-off is wifi; a wider one takes the circle
  keyline: video-off). **The filled variant still parts the slash from the solid**, since a slash
  on a solid would vanish: a solid shape is a whole `fill` parted by one `gap` above the bold
  slash, lines that stay lines when filled (legs, stands) are cut one-sided with
  `geometry.mjs slash` (2.5), and a line glyph's filled lines are `stroke` pieces cut 2.5.
  `docs/research/icon-review/2026-10-02/flat-slash.py` rebuilds the outlines from the bases. Two
  off states keep their own recorded form, declared `data-off="own"`: eye-off is a closed eye
  (owner) and volume-off a speaker with a 3.5px × (Fluent's mute). The lint fails any other
  `-off` icon
  without the shared slash;
- dots, three sizes by role (the lint allows only these):
  - ⌀2 for a dot that is the icon or one of its marks: more, wi-fi's source,
    gap's dot, cart's wheels, list-bullet's bullets and a centre point in a frame (crosshair,
    square-dot, circle-dot-dashed) (Cursor's dot roles; owner, 2026-10-02); on whole-pixel centres so they fill 2 × 2 pixels at 1×;
  - ⌀1.5 (1.33× the line) for a dot with a stem (the i of info, the ! of warning, the ?);
  - ⌀1.125, the line's own weight (r 0.5625), for a detail set inside a shape: keys (calculator,
    keyboard), lights (server), windows (building), eyes (smile, the bots), an eyelet (tag), opacity's
    grid, dots grouped inside a container (chat-more, square-list). Lucide's and Tabler's dots are the
    line's weight; ⌀1.5 details were a third heavier and read as dark spots in a row (owner, 2026-11-01,
    cohesion pass). A detail dot keeps a ⌀1.5 dot's place: the lint measures its gaps from the ⌀1.5
    placement, so place it on the gap scale as a ⌀1.5 dot (quarter centres are fine for filled dots).
  Every dot's radius follows the size curve with the line (`r` set from `sw`, owner 2026-10-05),
  so the ratio to the stem holds at 24–48px.
  Geist's own dots are rounded squares at 1.05× (i) and 1.3× (!) its stem. A circle needs
  a little more width than a square to look the same size, and 1.56× read too big.
  `data-dot="free"` records an owner-approved exception: quote's solid marks, rocket's ⌀2.5
  window. It also takes the dot off the size curve, so a standard ⌀2 or ⌀1.5 dot never carries it
  (square-dot and circle-dot-dashed kept a stale one and grew heavy above 16; 2026-10-07). quote's drop
  is a stroked ring with a solid core, so it stays tangent to its tail at every weight;
- hub or pupil: r 1.5;
- satellites: the bell's clapper is a U cup 4 wide and 2.5 deep, joined to the base. The !
  and the i share the ⌀1.5 dot and the tight gap to their stem;
- layering: fold and flap lines are `cut`s in the filled variant, so the layer reads in
  both states;
- fold: a page's fold is a 4.5 L with an r 1.5 inner corner, and a 45° diagonal whose inner edge
  runs exactly through the pocket's corners on the page's inner top and right edges, as Fluent's
  (owner, 2026-10-04): the diagonal is fixed at x − y = 6.795 (`M8 2L8.795 2L12.5 5.705L12.5 6.5`,
  r 0.5) and the L moves with the weight (`data-shift="0.7071 -0.7071"`, ends short of the edges so
  its caps stay inside them: `M8 2.4V5A1.5 1.5 0 0 0 9.5 6.5H12.1`), so the pocket is a closed
  triangle at every size; both carry `data-part="fold"` so the lint measures them as one. Pocket
  2.12. The L is three paths (vertical, curve, horizontal) so each end stays on its edge as it moves
  (owner, 2026-10-05). sticky-note's peel is the same on a square 5 L;
- marks on a folded page (lock, lens, gear) sit bottom-left, overhanging the left edge, away from the
  fold (Fluent; owner, 2026-10-05); the page's outline ends and its filled silhouette is drawn along
  the overlap cut round the mark, so both styles end the page on one curve;
- writing tool (owner, 2026-10-05): one pencil and one pen, the same body: 2.83 wide (sides on x + y =
  axis ± 2), a sharp 60° tip with r 0.5 shoulders; the pencil ends square with Lucide's band 2.12
  below the end, the pen ends round (r 1.414) with a clip. pencil-off keeps the pencil whole; a pen inside another icon
  (compose, file-pen) is the pen, slimmer (2.12 wide) and without its clip; signature's slim pen
  keeps the clip at its scale (owner, 2026-10-05);
- figure: person is the standalone figure (head r 3 at 8, 5, 2 from the body between centre-lines, a dome body
  10 × 3.5 from 10; owner 2026-10-03: bigger head, smaller gap; 2026-10-07: smaller still, the framed figures' 2). Beside a mark or in a group the figure is the small cut (head r 2.5); in a frame
  (circle, square, shield) the head is r 2, identical in person-add, person-remove and people's front figure (people
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
separately. **Filled is more ink, never a negative** (owner, 2026-10-01; research in
`docs/research/icon-review/2026-10-01/`): fill the mass that names the icon; lines stay lines and
solids stay solid; white appears only for small marks on a newly filled mass and for real openings
(a key's bow, a door, a hub). A frame whose features would invert keeps its lines and the subject
or the accessory fills instead (video_person, incognito; the bots' hats). Judge filled at 16 and
32px: large renders thin the line by the size curve. Filled is about emphasis and layers, not flooding the shape:
- **The filled story (owner, 2026-10-04; `docs/research/icon-review/2026-10-04/`, from Fluent,
  Phosphor, Material Symbols and SF Symbols; Cursor: "filled icons are built from solid shapes with
  the interior details knocked out, cut directly from the fill"):**
  - *Fill the body, nothing else.* The one mass that names the object fills. Every other part keeps
    the outline's drawing at the same size and weight: a page's dog-ear stays open (white, its
    fold line and diagonal drawn), an open folder's back stays a line and only the front fills, a
    clipboard's clip stays a ring meeting the filled board, no gap round it (owner, 2026-10-04), pegs, handles, stands,
    needles and straps stay lines. Never shrink or merge a part so it reads smaller filled than
    outlined.
  - *Details are knocked out of the body* at the outline weight (the size curve).
  - *Ends:* an ink stroke always ends round. A knocked-out stroke ends round when its end is inside
    the solid and is sawn flush when it reaches the edge: it runs through the silhouette as a cut,
    never stopping a hair short. A gap between parts is space, so its ends are sawn.
  - *Marks inside containers* are plain knockouts (placement, above). Lines beside a solid stay
    lines.
  - *Filled is simple: negative cutouts, not halos* (owner, 2026-10-08, overturning the 2026-10-06
    delegated halo rule; reference sheet: mic, database, smile, sparkle, pin, speaker, kanban, send, bug).
    The body is solid; a mark over it is a plain knockout at line weight; attached parts outside it
    (stems, needles, legs, waves) stay lines; no cut outline round a part. An overlapping element
    (an arrow, bolt or sync over a cloud, a bolt on a cylinder, a sparkle on a bubble) either sits wholly on
    the body as an `inset` cutout with even fill round it (≥ 1 weight each side: the clouds, database-zap)
    or stays ink with a negative-space outline (`halo`: chat-sparkle) — owner, 2026-10-09, after the
    notebook-style split was tried on the clouds. notebook's rings (attached, crossing the cover) keep the
    split: knockout over the cover, ink beyond. Attached parts that only meet the edge (calendar's pegs, stems, legs) stay ink. notebook's
    whole cover is solid with the band as a cut (kanban's dividers).
    Separate badges beside a body (person badges, dots, server-cog's gear, chat-sparkle's corner mark)
    keep their bite. `docs/research/icon-review/2026-10-06/escapes.mjs` lists knockouts that leave their solid.
  - *Secondary parts stay lines* (owner, 2026-10-04): the body fills; a header, tab, lid or rim, the
    page or fold behind, a page on top and an attachment (clip, pegs) keep the outline's drawing with
    their inside open, and nothing is cut round them (calendar, folder, archive, gift, shopping-bag,
    app-window, receipt, wallet, newspaper, folder-open, clipboard, clipboard-paste; map fills its
    side panels). Equal parts (book pages, panes, a card's stripe) keep their cuts; badges keep
    their gap. Source: the outline unmarked, the body a `fill` stopping at the part's line.
  - *Arrows are one family:* the same arrow turned is the same arrow (file-download is
    file-export turned 90°); a visible shaft is at least about 2.5 × its head.
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
    the bell's body and its clapper (Fluent does the same). A gap with `stroke="none"` and
    `fill="currentColor"` is cut out whole (a hub, the visible part of a hole a slash crosses).
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
    A knockout end that reaches the solid's edge runs out square (the generator extends it 1px
    with a butt end, owner 2026-10-02); only free ends inside the solid are round. A line that
    runs edge to edge across a solid (a slat, a divider) is a `cut`.
  - **No slivers** (owner, 2026-10-02): where two cut-outs, or a cut-out and a line drawn over the
    fill, come within about 1.1 of each other, the fill between them is a sliver; align them so the
    space meets (a gap flush against the slash, a lens gap meeting a fold) or move the parts apart.
    Check with `docs/research/icon-review/2026-10-02/slivers.mjs` (`SLIVER_PNG=out.png` marks hits).
  - **A closed shape holding a mark fills and knocks the mark out** (add-circle, error,
    clock, zoom-in and zoom-out's lens, as Fluent's zoom). This is for true marks (+ − × ✓,
    play, dots) only: a ring or frame whose content is itself a line drawing (target, a
    reticle, a wireframe, a figure) fills by weight, or keeps the frame a line and fills the
    subject, never floods the frame and inverts the drawing (audit, 2026-10-01). An open line
    glyph (search, arrows, chevrons) fills by weight.
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
  overlaps. Review every filled variant with `sheet.mjs filled` (`filled-large` adds
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
- flash is Lucide's zap on Area's grid: 45° outer edges, tips filleted r 1, notches r 0.5 (owner,
  2026-10-03); small bolts (battery-charging, cloud-lightning) are single-line bolts at the same slope;
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
12). **The curve holds at 24** (2026-10-06, delegated): above 24 an icon is the 24px drawing scaled
whole (1.8px at 32, 2.7 at 48; Fluent's masters are 2 and 2.5), because the drawing's gaps stay
fixed in its units and kept growing against a thinning line (`SIZE_CURVE_MAX` in the generator). Pass `size` to a pilot icon, or `size` to `Glyph` (base.css holds the factors), and
the line follows the curve. At 12px the tight gap falls to about 0.9px, so a dense icon
that must read at 12px on 1× screens gets its own 12px cut. Cuts live in `packages/icons/sources/12/` (12 viewBox,
stroke-width 1; spec "12px cuts"): Fluent's 12px grid (square frames 8 of ink, lines on half pixels, gaps ≥ 1px),
and a line that would sit on the centre (6) moves to 5.5 so it stays one pixel (crisp over centred). Draw one only
where a component or demo shows the icon at 12 and the cut beats the 16px drawing at 1× on
`docs/research/icon-review/2026-10-13/cuts12.mjs`'s sheet; a turn or alias uses its base's cut.

In the filled variant (owner, 2026-10-03: "the negative space looks way thicker than the
monoline strokes"), lines drawn as negative space (knockouts, cuts) follow the curve, so they
match the outline's line at every size. Silhouettes and lines drawn over or beside solids follow
the curve too (owner, 2026-10-04), so both styles share one weight at every size; gaps follow it as
well (2026-10-06). A part in front of a solid is parted from it by one line weight at every size: a
`halo` round a line, or `data-halo` on a solid in front (a clock, gear or lock on a page, a notification
dot, a front coin or figure). Draw a part-in-front separation as `data-halo`, never as a `gap` offset
from the front, which leaves a hair of the back solid on the front's edge once the line thins. A hole inside a line is cut to the line's centre-line (a wheel, a sheet, a clip),
so it stays flush as the line thins. The shared slash's
gap moves with the line (`slashGap`: the slash shifted one weight). A gap that must stay flush
with a cut is drawn to the cut's centre-line (file-cog, file-pen), so a thinner cut opens no
hairline. Line glyphs (no solid) keep the curve when filled. Review sheets show icons by themselves at 16 / 24 / 32 / 48
through the real `size` prop (`docs/research/icon-review/2026-10-02/sizes.mjs`) or beside all
five libraries (`refs.mjs`), never at one large size beside Fluent alone.

**In components.** A component that draws its own glyph uses `Glyph` from
`packages/react/src/components/Glyph.tsx`. Add the icon (or one element of it) to
`PACKAGE_GLYPHS` in the generator, never a hand-copied path, and pass the slot's `size`.
base.css sets the line from `--area-weight-icon` and the size curve.

**Cohesion (2026-10-31; owner-adopted 2026-11-01; research and numbers in `docs/research/icon-cohesion-2026-10-31/`).**
Measured against Lucide, Phosphor, Tabler, Heroicons, Iconoir and Fluent, Area's spread of size, density and
mass is the libraries' own, and Area follows their consensus concept by concept (r 0.83–0.90). What set it
apart was solid ink (35% of icons, against 16–17% in Lucide and Phosphor) and single drawings. So:
- *Measure against the consensus.* Run that folder's `tools/measure.mjs area` on the build and
  `tools/compare.py <dir> <names>`: an icon more than 7% off its concept's consensus in size, 20% in density
  or 25% in mass is redrawn toward its peers or recorded with the reason. Look at it in a strip
  (`tools/strip.mjs`, a group in one line at 16 / 20 / 24, as a nav or key shows it), not alone.
- *Solids are marks, not details.* Every set that publishes rules keeps outline icons free of solid areas
  (Lucide: "fills are officially not supported"; SF Symbols: "an outlined symbol has no solid areas"). A
  solid stays only where it is the icon's identity or a named dot role (more, bullets, the i, ! and ? dots,
  wi-fi's source, a centre point, the notification dot, a mark's fill, the recorded solid exceptions).
  Content inside a container (a picture, window controls, an eyelet, a sun) is a line or is left out.
- *Long, thin objects lie on the rising diagonal* when that brings them to their keyline (link: 13.1 × 7.1
  flat, 12.8 × 12.8 on the diagonal).
- *An inner diagonal in a ring rises.* The falling diagonal is the slash's; a needle on it reads as ⊘
  (compass).
- *Letters use their keyline.* A pair spans the horizontal keyline at cap 7.5 and x-height 4.5 (Aa, AB, ab),
  so it reads at the size of text's T and every library's Aa.
- *A composition of separate shapes is a class* (shapes, system, grid, component): parts on the gap scale
  cap at about 4.5 in the 12px box, so it reads lighter than one silhouette. Make each part as large as the
  gaps allow, the triangle largest (it covers half its box).
- *Flat views, depth only where depth is the idea* (owner, 2026-11-01). Objects are drawn front or side on (car,
  truck, the plane top-down nose up); cube, package, cube-wireframe, layers and database keep their depth, and
  container stays isometric by the owner's pick.
