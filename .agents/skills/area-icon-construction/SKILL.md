---
name: area-icon-construction
description: Draw, redraw, review or plan Area's own stroked icons so the whole set has one optical system. Use whenever an icon in packages/icons/sources (or a later Area icon family) is added or changed, when checking whether Area has an icon for a concept, when working through a reference set (Cursor, Lucide, Fluent) for gaps, when an icon reads larger, smaller, heavier, blurrier or denser than its neighbours, or when replacing a Fluent icon with an Area drawing.
---

# Area icon construction

Area icons are stroked centre-line drawings on a 16px grid. The goal is a set in which
every icon reads as the same size, weight and density, like Cursor's set, while staying
crisp at 1× and 2×. The rules live in `docs/specs/icons.md` ("Construction system"); the
lint in `packages/icons/scripts/generate.mjs` enforces the measurable ones. The owner's
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
option rendered (explore candidates or `sheet.mjs`), not a text list.

0. **Set up** a fresh worktree with `npm ci`. Sheet scripts drive headless Edge; if they hang, stop stray
   `Microsoft Edge … --headless` processes (orphans hold the profile; `2026-10-07/edge.mjs` stops Edge as
   soon as its output is written). Serve the gallery with `PORT=<free port> npm run
   dev` (other worktrees may hold 3000 and 4321). In zsh a `$VAR` holding several icon names
   stays one word: pass names directly, comma-separated, or as a batch id.
1. **Find first.** `npm run icons:find -- <concept …>` searches names (with turns), demo
   labels, Fluent cuts, construction lines, batch notes and the build queue
   (`docs/research/icon-inventory.md`). Use what exists; if a family base exists, make a
   variant with the family's modifier (Families); if nothing does, check the queue's
   references and uses.
2. **Reference, never trace.** Fluent's cuts are local: `node packages/icons/scripts/batch.mjs
   --fluent <stem>` finds the 16px pair (or the smallest that exists). Lucide's names and tags
   (search terms, ISC) can be fetched into the scratchpad from
   `https://unpkg.com/lucide-static@latest/tags.json` (follow the redirect). Cursor: rules and
   numbers only. Render a reference beside Area with `sheet.mjs sheet out.png <path.svg> <name>`.
   For a concept across libraries (owner, 2026-10-01), `node packages/icons/scripts/refs.mjs fetch`
   puts Lucide, Phosphor (six weights, a designed fill) and Hugeicons (free, stroke) in
   `packages/icons/.cache/refs`; add the concept to `docs/research/icon-references.json` and run
   `refs.mjs sheet out.png <group>` (Area outline and filled beside Fluent, Lucide, Phosphor and
   Hugeicons). Look for the telling detail and the filled treatment, never the path.
3. **Plan** the keyline, family and shared parts, the modifier, the filled roles and, for a
   dense idea, which simplification (Fitting a dense idea at 16px).
4. **Draw** in `packages/icons/sources/<name>.svg` with the geometry toolkit
   (`npm run icons:geometry` prints it): fillets, cuts round marks and overlaps, lobes,
   transforms and a gap check. Solve values; don't nudge by eye.
5. **Lint loop:** `node packages/icons/scripts/generate.mjs --only <name,name>` answers in
   under a second; every near miss names the distance to the nearest step (Lint messages).
6. **Look:** `node docs/research/icon-review/2026-10-07/look.mjs out.png name,… [ref.svg …]
   [--before] [--slivers]` renders straight from the sources, outline and filled at 16 / 24 / 32 /
   48 and 96 over the grid, with reference rows (Fluent, Lucide, Phosphor files) and the sliver check;
   it writes nothing shared, so parallel sessions can use it. After `npm run icons:pilot`,
   `sheet.mjs filled`, `filled-large` or `compare out.png batch-NN` still work.
7. **Record:** write a batch file (id, title, date, note, and per icon its name, label, Fluent
   stem and construction line, plus an optional `extra` paragraph for what was dropped and
   why) and run `npm run icons:batch -- batch.json`. It updates batches.json (new icons in
   review), the spec's batch section, the demo label and Fluent plate, regenerates, and lints
   the batch.
8. **Gate:** `npm run icons:pilot` (the full lint, about two minutes) and `npm run typecheck`;
   `node docs/research/icon-review/2026-10-07/geometry-audit.mjs <names>` (the lint's blind spots:
   near-tangent kinks, gaps between subpaths of one path, 45° segments off the lattice in `free`
   icons); the sliver check at 16 and 48; the 1× pixel view
   (`docs/research/icon-review/2026-10-10/quality/tools/px.mjs out.png name=path.svg …`: the 2× sheets hide a
   whole-pixel stroke's grey double row) and the doubled-stroke scan (`quality/tools/dups.mjs
   packages/icons/sources <names>`); check the batch's cards on `gallery-icons.html`; send the
   owner a sheet (Area alone at 16–48, or beside the libraries).
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
- **Shapes the owner chose:** Lucide's rounded zap bolt (flash, owner 2026-10-03; replaced the sharp classic bolt); a closed eye with lashes (hide);
  a T with end ticks and a foot (text); three stacked isometric layers; one centred
  four-point sparkle, no satellites; a fuller five-point star (0.5 inner ratio, r 0.75
  tips); rotate as Fluent's arrow_rotate_clockwise (an arc with reset's corner head round a ⌀2 dot; owner 2026-10-03); a book with one page each
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
  line (T keeps its serifs; bold's outline is a stroked B and its filled variant the solid B; owner to confirm, 2026-10-03).
- **Clouds (owner, 2026-09-28):** every cloud icon uses the one cloud shape (moved, never
  redrawn); rain and bolts touch or cross its foot rather than floating below it.
- **Aligned gap:** qr-code keeps its rows even, so its dots meet the squares' rounded corners
  2.14 apart (`data-gap="aligned"`, owner-requested); use it only where the owner asks.
- **Close gap:** battery's terminal sits 2 from the body (`data-gap="close"`, owner-approved),
  one step under tight; use it only where the owner asks for it.
- **Solid exceptions:** quote's marks and bold's B are solid shapes, because the thing they show is
  solid (a bold letter reads bold only when heavy). Letters otherwise fill by weight, never
  as a solid with knockouts.
- **Sharp by nature:** flag's swallowtail points are sharp (`data-acute`); activity's peaks too (owner: sharper).
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
  4px spacing; no prohibited ring or small bug as corner marks. The agent icon is bot-agent
  (owner, 2026-10-05: Fluent's agents hexagon is Microsoft's, not a shared convention), never a
  cursor or pointer (it read as Cursor's brand). search-off's slash is the shared slash mirrored (14, 2 → 2, 14; owner, 2026-09-29),
  since the normal one runs along the handle; the cut is the mirror of the one-sided cut. Follow Fluent closely for objects the owner compares with it (contact card,
  news, money, captions, chat sparkle's corner sparkle). The booleans are two 8 × 8 squares
  overlapping 5 × 5, every result solid, exclude included (owner, 2026-10-02: the hatching had no
  room at 5 × 5).
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
  medium 6 × 6 T (ticks 1, foot 3) in line-height and letter-spacing, and text-size's pair (8 × 10 with ticks 1.5 and foot 4; 4 × 5.5 with ticks 1 and foot 2). superscript and subscript are an X with list-numbered's 2 (owner, 2026-10-08), not a T.
- **Rain** lines are different lengths (owner). qr-code is square like a real code (owner,
  2026-09-28): finders 5 × 5 at r 1 (not the container radius), square 2 × 2 modules (r 0.25)
  for the finders' centres and the four data modules, 3 apart.
- **Simplify before dropping (owner, 2026-09-28):** an idea too dense for 16px is simplified
  (Fitting a dense idea at 16px) before it is dropped; drop it only with the owner, and give
  an alternative (file-zip: archive, or a labelled file type).
- **Solids in the outline style** are exceptions, each recorded: quote's marks and bold's B,
  stop-circle's square and record's disc, the boolean operations' result, contrast's half,
  shadow's band, folder-zip's teeth, id-card's person, stroke-weight's bars, newspaper's picture block. (paw's
  toes are r 1.25 rings, solid only when filled.) The solid is
  what the icon shows; ordinary details stay lines.
- **Owner, 2026-10-02:** multiples follow Phosphor's layering (Shared parts); library is
  Phosphor's books (an upright book and one leaning, bands 3 from each end); the rejected round
  follows the owner's picks: waypoints Fluent's route (two r 2 rings joined by an S), binoculars
  Lucide's, person-chat and bandage Hugeicons' (a person in a bubble; a wide band with four
  dots). Three-line stacks centred on 8 move to x.5 and sit 0.5 high (text-align, indent,
  outdent; waveform 0.5 right): crisp at 1× outweighs centring. calendar keeps its even grid
  (`data-gap="aligned"`). The hand fills its palm. Duplicate drawings are aliases
  (`data-alias-of`, linted identical): subtract of minus, padding-axis of padding-sides,
  flow-wrap of grid. The map pin is `location`; `pushpin` and `unpin` are the pushpin.
- **Owner review, 2026-10-03** (spec "Owner review round, 2026-10-03"): arrows by class: standalone
  5 head on a 12 shaft (the diagonal is the straight arrow turned 45°), an icon's main arrow 3 head
  on ≥ 7.5, contained or paired 2.5 on ≥ 6, short frame or corner 2 on the longest shaft that fits.
  Faces use Fluent's emoji spacing (eyes 6.25, 7 and 9.75, 7). One door in home, store and building;
  filled keeps the base line under it. One clip in every clipboard, one slim pencil with an eraser
  band (Phosphor's) in pencil, pencil-off, compose, signature, file-pen. The search handle starts
  clear of the lens. A filled corner check leaves no strip under its vertex (the vertex 1 in from the
  edge, the long arm on the edge). Many objects were redrawn on the owner's library picks; their
  construction lines are in the spec.
- **Delegated, 2026-10-02 (owner to confirm):** base icons carry their object's content where
  every library does and variants drop it (Fluent): calendar's 3 + 2 date grid, chat's two text
  lines; send has a centre fold and pencil a ferrule band. A reticle (crosshair) fills by weight;
  people fill both figures, the back one overlap-cut. Record: `docs/specs/icons.md`, "Audit
  follow-up, 2026-10-02".
- **Quality pass, 2026-10-03 (delegated, owner to confirm):** framed figures agree: the frame stays
  a line and the figure fills (person-circle, shield-user, person-square, person-chat). A frame
  whose drawing would invert keeps its lines (piano). A hole crossed by the slash is cut only on
  the slash's far side, so no sliver of space lies against it (location-off). Record:
  `docs/specs/icons.md`, "Quality pass, 2026-10-03".
- **Owner, later 2026-10-02:** the zip is Fluent's, followed closely (folder-zip: four solid 1 × 2
  teeth alternating about a column and touching at their corners, a hollow tab joined to the last
  tooth and hanging below an intact folder). toy-brick keeps its drawing; blocks is four separate blocks of
  one size, the fourth offset (Lucide). image's sun is the ⌀2 mark dot top right (owner pick, 2026-10-02; images and file-image too) and its mountain is
  Fluent's pyramid (peak on the diagonal), so image-off's slash covers its right slope; image-plus's + sits on the lower-right corner. A basket is Lucide's (legs that don't meet); a peaked
  handle on a tall body reads as a cupcake. A shape whose parts must sit on x.5 may sit 0.5 off
  centre on both axes (chip, delegated).
- **Person family and faces (owner, 2026-10-06):** person-* marks sit at the lower right (about 12.5, 12.25)
  on the standalone person moved left, all but the key in one shared round bite (`2026-10-07/scripts/family.mjs`; the 10-06 script writes the old body);
  this replaces "beside: at head height". Faces centre their features in the shape (smile: eyes 6, 6 / 10, 6
  over the mouth's corners). The cart's wheels sit on its bottom bar.
- **Filled cuts are the line's weight (owner, 2026-10-06):** every filled cut, halo and gap is one line
  weight at every size; a gap that offsets a front part is `data-halo` on that part (dots included), so
  it stays flush. An arrow through a frame (import, share, open, trays, doors) fills by weight; only a
  body that is the object (cloud, page, square) fills. fingerprint: concentric arcs 2.5 apart round an S core (a reverse arc tangent to the core's top). A
  smaller copy of an icon inside another is that icon's drawing scaled (person-key carries key, diagonal,
  lower right, the figure cut round it); simplify only where it can't fit and record it
  (`2026-10-06/embedded.mjs` lists every composite). The ? sits 2.25 above its dot, as the ! does.
- **Quality pass, 2026-10-07** (spec "Quality and consistency pass, 2026-10-07"): clapperboard is
  Fluent's movies_and_tv exactly (owner): a taller body, the board hinged on its top-left corner at 1 : 3
  with line-weight stripes; filled, only the body fills. The 16 open round-2 "replace" verdicts are applied
  on the named library: key (Phosphor; person-key carries it), handshake, camera, pushpin, palette, shapes,
  gamepad, chess-rook (Lucide), bank, building, lightbulb, lasso, translate (Fluent; translate is a "a" and
  "あ"), piano, hammer, trash (Phosphor); bot-generator a full wizard's cone with a bent tip; the person's
  head-to-body gap is 2 (the framed figures'). Other open owner notes applied: car wider with the wheels in
  line with its sides, vault centred (Fluent's 13 × 9), gallery's card larger, vr-goggles' lens line higher,
  quote's tail tangent, newspaper even, party-popper's confetti apart, calculator's display larger, piggy
  rounder, the handset's inner curve smooth, call arrows balanced, frown's mouth back up. Delegated (owner
  to confirm): palette's wells ⌀2 (the paint is the icon's mark), building's window grid
  `data-gap="aligned"`, shapes' 2.5 / 3 gaps.
- **Geometry rules learned, 2026-10-07:** solve arcs exactly (an arc whose radius is under half its chord is
  enlarged by SVG and kinks at both ends: the heart); draw separate parts as separate paths (the lint
  measures gaps only between elements: captions' C's sat 0.5 apart); `data-angles="free"` drops the
  lattice check for the whole icon, so check its 45° segments with `geometry-audit.mjs`; a hub or hole is
  `stroke="none" fill="currentColor"`, never a stroked gap (it leaves a dot); the convex point where two
  offset curves of an overlap cut meet is rounded r 0.75; a knockout that starts on a seam between two
  solids is read as an edge exit (start it 0.5 off the seam); parts 1.0 apart touch only at 16 (join them
  or part them by a step); a solid with no stroke is crisp on whole-pixel edges; a container's − centres
  where the family's + sits; content in a clipboard centres under the clip; heavy bases sit high, not low.
- **Quality pass, 2026-10-10** (spec "Quality and consistency pass, 2026-10-10"): look at 1× as well as 2×; a
  long stroke on a whole pixel moves 0.5 to x.5 even off centre (wifi, git-commit, blur, caps-lock; the stack rule
  generalised). Each stroke is drawn once per style: never an outline-only `line` copy of a stroke that both styles
  or a knockout already draw. Every convex point of fill where two offset curves of a bite meet gets the r 0.75
  fillet, in every member of the family (mail marks, file and folder composites). Drop `data-angles="free"` once a
  drawing no longer needs it. Run geometry-audit on every redraw before the owner sees it. A corner mark on a face
  with hands sits where the hands are not (clock-check's check top right); its halo or bite clears every knockout by
  a line weight. Small person marks share the family bite, large ones (key, lens, pen) take their own cut. The B:
  semicircular bowls, the lower 0.5 wider, the bar at the cap's middle when that is on the grid, otherwise one step
  above (spell-check). The numeral 2 is list-numbered's (superscript and subscript copy it); its base starts left of the bowl so the foot holds when filled (owner, 2026-10-11).
- **Owner, 2026-10-11:** blur is the ring halved by a centre line with 45° hatching on the right half (owner's reference, a hatched droplet; the ring matches Fluent). Text lines inside a page start and end 3 from its edges, left-aligned, so the filled page keeps an even margin (form).
- **Owner, 2026-10-11 (round 10):** negative space never ends rounded at an edge: a knockout ending on the silhouette runs out square along its tangent, curves included (the generator does it; `AUDIT_ENDS=1` lists near misses). Type: one construction per glyph (every 0 the 3 × 4 stadium, every 1 the 45° flag without a foot, every 2 the family 2, heading bowls r 1.5, H crossbars on 7.5); a pair or word reuses the single letters exactly (Aa is case-upper's A and case-lower's a) with standard gaps. Objects inside a shield are knocked out of the filled shield; only figures keep the frame a line.
- **Owner, 2026-10-11 (round 11):** the 1 is Lucide's (a flat flag, the stem, a foot centred under the stem; flag 1.5 and foot 3 at 4 tall) wherever a 1 appears; the 2 is Lucide-like (a round bowl, a neck curving from the bowl's right side to the base's left corner, a base about 10% wider than the bowl reaching further right). Glyph strokes whose proportions matter (1, 2, Z) carry `data-ends="keep"` so the filled weight thickens them evenly instead of pulling their free ends back. Structural lines in a filled body run edge to edge (umbrella's ribs from the apex, the globe's meridians through both poles, as Fluent's globe).
- **Off icons keep the base's parts (owner, 2026-10-12):** where the owner wants a base icon's small parts kept in its
  `-off` variant, the outline draws them all with the slash crossing flat (`data-gap="slash"` exempts parts beside the
  slash from the gap scale; keyboard-off), and the filled variant keeps only the parts clear of the slash and its gap.
- **Frames never fill the keyline (optical size pass, 2026-10-12; delegated, owner to confirm):** a closed rectangular
  frame carries far more mass than a free silhouette of the same width, so it uses its keyline's shared frame: square
  2.5–13.5 (square-plus, hull area 140), horizontal 13 × 9 or 12 × 10 (folder's area, 134), vertical the page or the phone.
  Free silhouettes (cloud, tree, trophy) may reach 13 × 13. Check a new frame's hull area with `--audit` against those
  references (spec "Optical size pass, 2026-10-12").
- **Filled audit, 2026-10-06** (spec "Filled consistency audit and the size curve's hold"): a part is
  one colour (knockout inside, ink joined when attached; the halo for a part crossing the edge in front
  was overturned 2026-10-08, see "Filled is simple" below); the curve holds at the 24px master. Owner notes applied: desktop-check's check centred,
  qr-code's data modules r 0.5, the plane's cockpit window, the fingerprint's ridges on concentric
  tracks, the globe's lens meridian, the graduation cap's 1 : 2 board and x.5 tassel, bandage filled as
  Phosphor's (front band solid, back band a line).
- **Audit, 2026-10-05** (spec "Consistency audit, 2026-10-05"): bot hats fill their main mass,
  and a band bounded by two outline lines stays open when filled (owner, bot-guard: the cap's top
  and the visor fill, the middle band stays open; bot-automator follows; bot-designer's crown and
  visor fill as one mass with no notch). Owner-confirmed: every small clock face uses clock's hands
  (a vertical hand and a 45° hand down-right, never an L to 3 o'clock); a slash that would run along
  a shape's edge is mirrored, as search-off (call-off); a mark that doesn't fit the family's size in
  a small front uses the next size down (copy-check's 1 / 2 check, document-dismiss's 3 × 3 ×).
  Dots follow the size curve with the line (the ! dot read 2.4× the stem at 48px). A mark on a
  round face's edge is, filled, a badge with the mark cut out (smile-plus, Fluent's emoji_add).
  maximize and minimize are expand's and collapse's arrows. Spelled letters (spell-check) keep
  geometric widths and a standard gap between letters; a B's lower bowl is larger than its upper.

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
  - × standalone 10px (dismiss); beside or inside a shape 3.5px (volume-off, backspace), a
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
- dots, two sizes by role (the lint allows only these):
  - ⌀2 for a dot that is the icon or one of its marks: more, wi-fi's source,
    gap's dot, cart's wheels, list-bullet's bullets and a centre point in a frame (crosshair,
    square-dot, circle-dot-dashed) (Cursor's dot roles; owner, 2026-10-02); on whole-pixel centres so they fill 2 × 2 pixels at 1×;
  - ⌀1.5 (1.33× the line) for a dot with a stem (the i of info, the ! of warning, the ?)
    and for a detail set inside a shape: keys (calculator, keyboard), lights (server, car),
    windows (building), eyes (smile), an eyelet (tag), opacity's grid, dots grouped inside a
    container (chat-more, app-window, square-list). Place them on the
    gap scale from their frame and each other (quarter centres are fine for filled dots).
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
that must read at 12px on 1× screens gets its own 12px cut.

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

## Process

The quick path, in detail.

1. **Plan.** Name the keyline, the family and shared parts it reuses, and the Fluent
   equivalent; search first (`npm run icons:find`).
2. **Draw** in `packages/icons/sources/<name>.svg`, using absolute commands and the
   attributes of the existing sources (`data-set`, `data-keyline`, stroke 1.25, round caps
   and joins, `fill="none"`; a solid is `fill="currentColor"` with no stroke). Generate
   parametric shapes, such as the gear, with a script and solve for grid-aligned values;
   don't nudge by eye. Use only path, circle and rect: the lint rejects anything it cannot
   measure (an ellipse was once skipped silently).
3. **Lint** with `generate.mjs --only <names>` while drawing, and the full
   `--report` (or `npm run icons:pilot`) before recording. It checks the 0.5px grid (filled
   edges too), the diagonal lattice, the keyline, gaps, counters (filled solids count as
   ink), the live area (centre-lines within 1.5–14.5), angles and attributes, dot sizes, the
   shared slash on `-off` icons, and knockouts that leave their solid, and prints each icon's
   ink box and centre.
4. **Review** each icon on `gallery-icons.html`. It is grouped by batch, from
   `packages/icons/sources/batches.json`, which also records the owner's status
   for each icon (approved, revising, review), shown in the component gallery's status
   colours (Complete, In review, Unrefined). New icons go in as `review`, and an icon you
   change goes back to `review` (`batch.mjs --review name`); everything the owner has
   looked at is approved (owner, 2026-09-26). The page opens with **In review** (a card per
   open icon, newest batch first), then **All icons** (every icon, outline and filled at 16px,
   one group per batch, newest first; a dot marks an icon in review; a cell links to its
   card), then the approved cards, one closed section per batch. A card shows the icon at
   every size on the size curve, 3× plates (Area, Fluent, Area over Fluent, filled) and the
   icon in a Button, icon Button, Badge and the current Nav item (filled). Directional
   families are one drawing with `data-rotations` (quarter turns, `flipx` / `flipy` mirrors
   or `transpose`); never redraw a variant. Only the owner marks an icon approved. For a quick
   look, or to send the owner a batch, render with `sheet.mjs`: `sheet` (16, 32 and
   96px), `strip` (16 and 32px with a blurred copy, the squint test), `filled` /
   `filled-large` (outline beside filled) or `compare` (beside Fluent's cuts). Then compare
   the set on `gallery-iconography.html`:
   - *Side by side*: Fluent and Area at 16px and at 4× on the pixel grid with the
     keyline, and Area drawn over Fluent;
   - *Optical balance*: the whole set in one line at 16 and 32px. Look for the icon
     that jumps out as larger, smaller, darker or denser;
   - *Filled*: outline, derived filled variant and Fluent's filled cut;
   - *Pixel check*: 1× and 2× rasters, beside Fluent's.
5. **Audit parts drift** (Cursor's overview tables) with `generate.mjs --check --parts`
   (members that left their base's drawing; triage, not a gate) and look at
   `node docs/research/icon-review/2026-10-02/sheets.mjs parts out.png` (each base in red under its members).
6. **Audit optical size** with `node packages/icons/scripts/generate.mjs --check --audit`
   (the full set: medians need every icon). It rasterises each icon and reports:
   - apparent size (√ of the ink's convex-hull area) and density (ink per hull area),
     each against the set's median;
   - read results within a class: line glyphs (add, check, chevron, arrows, more) have thin
     hulls by nature; full rings run about 15% large by design (circles are drawn larger);
     diagonal shapes (a bolt, a diamond) read small by hull even when they fill their keyline;
   - a solid shape more than about 8% under the median, or a density above about +25%,
     is a candidate to enlarge or lighten. Confirm by eye in the whole-set grid.
7. **Judge** density as well as size. Count parallel strokes and corners. If an icon reads
   heavier than its neighbours, remove a line or corner, or pull it inside its keyline,
   before thinning any stroke.
8. **Explore** when there is more than one good answer. Put the candidates in
   `packages/icons/sources/explore/`, with `data-group` and `data-label` on each.
   They are linted without failing the build, and the gallery's Exploration section shows
   each one at 16px and 4× with its gaps, counters and rule findings. Delete them once the
   owner chooses.
9. **Record** with `npm run icons:batch -- batch.json`: the construction line for each icon,
   and any exception or dropped idea (`extra`), lands in the batch's section of
   `docs/specs/icons.md`. A decision that applies beyond one icon also goes in Owner
   preferences above.

## Fitting a dense idea at 16px

When an idea won't fit (its gaps and counters fail however it is arranged), simplify it in
this order before dropping it. Each worked in batch 43 (owner: "can they be simplified so
they fit?"); name the simplification in the icon's construction line.

1. **Use the whole keyline.** id-card's card is 13 × 10, the horizontal keyline's most.
2. **Make a small detail solid** (Fluent's trick). A solid needs no counter: id-card's head
   and shoulders, shadow's band. Record it as a solid exception.
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

The lint does not see three things; `docs/research/icon-review/2026-10-07/geometry-audit.mjs [names]`
lists them (2026-10-07): a join that bends by 2–25° (a near-tangent kink; deliberate corners such as the
book's spine or a shield's top show too), a gap between subpaths of one path that is off the scale, and a
45° segment off the lattice in an icon marked `data-angles="free"` or `"radial"` (recorded exceptions:
the fold's fixed diagonal, the pen axis, octagon, rocket, eyedropper, wrench).

## Geometry toolkit

`packages/icons/scripts/geometry.mjs` (`npm run icons:geometry` prints the usage). Every
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
