# Owner preferences for Area icons

Read before drawing a batch, and add every new owner decision here. Moved verbatim from SKILL.md (2026-10-19).


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
- **Aligned gap:** owner-requested even rows (`data-gap="aligned"`); use it only where the owner asks (calendar,
  building). qr-code no longer needs it (2026-10-14).
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
  2026-09-28; redrawn by the optical audit, owner-approved 2026-10-14): finders 4 × 4 at r 1 on half pixels, 1 × 1
  centres, four 2 × 2 data modules (r 0.5) on whole pixels, 1.94 from the finders.
- **Optical audit and 1× (owner, 2026-10-14):** run `generate.mjs --check --audit`; an icon far outside the median
  (qr-code was +15% size, +36% density; diamond −15%) is redrawn toward its peers. Long axis strokes sit on half
  pixels and solids' edges on whole pixels, even when that puts the icon 0.5 off centre (Fluent's 16px add sits on
  7.5); `docs/research/icon-review/2026-10-14/tools/frames.py report` lists offenders. diamond's half-diagonal is 7
  (r 1.5 corners), gamepad's body 9 tall from 3.5.
- **1× frames (owner-approved 2026-10-14, 263 icons in four rounds):** move the drawing, never redraw it, where that is
  enough (`frames.py`); a slash icon slides along its slash (dx = dy) and may take the circle keyline; a single part
  slides only along edges it touches, keeping contacts, line ends and shared edges; **a part centred on its container
  never moves off centre, and a line centred in a half-pixel frame stays symmetric and soft** (owner: "leave"). Half-unit
  redraws are fine where no owner construction depends on the proportion (desktop's screen is 12 × 9). Run
  `frames.py report` on every new drawing.
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
