# The filled story (2026-10-04)

The owner, after the review round: the clipboard's clip is smaller filled than outlined; maybe only
the main part should fill (clipboard, file); folder-open could fill only its front; when should a
cut-out end round and when sawn off? Cursor's rule, which the owner likes: "Outline icons are built
from strokes. Filled icons are built from solid shapes with the interior details knocked out, cut
directly from the fill."

| Sheet | Shows |
|---|---|
| `1a-systems-marks-layers.png` | Corner marks and layered objects: Area beside Fluent, Phosphor and Material Symbols (rounded), regular and filled |
| `1b-systems-details-lines-frames.png` | Details inside a solid, lines beside a solid, frames round a subject |
| `2-options.png` | Area prototypes: each option's outline and filled, at 64px and 16 / 24 / 32 |

SF Symbols was compared too (rendered from the installed app, viewing only, not committed): it
agrees with Material on every row below except that its corner marks are badges (Fluent's way).

## What the systems do

1. **One mass fills: the object's body.** Every system fills the main body and leaves secondary
   parts as the outline draws them. Phosphor, Material and SF leave a page's dog-ear **open**
   (white with its edge drawn), Phosphor and Material fill only the **front** of an open folder
   (the back stays a line), Material keeps a clipboard's clip as a line. Fluent is the outlier: it
   fills every closed part and separates them with gaps, which is what Area copied.
2. **Details inside the body are knocked out at the line weight** (mail's flap, text lines, a lock's
   keyhole, the calendar's dates). Free ends inside the solid are round.
3. **A line that leaves the solid is cut, not capped.** Where a knocked-out line reaches the edge
   (database's bands, the bug's centre line, send's fold, the calendar header seam), it runs flush
   through the silhouette, so its end is sawn off: the edge of the solid cuts it. No system ends a
   knockout with a round cap at or just inside an edge.
4. **Thin parts stay lines** (the pin's needle, the bug's legs, the speaker's waves, the mic's stand,
   handles and pegs), at the outline's weight.
5. **Marks on a container: nobody cuts a corner mark out of the edge.** Two answers only:
   - **inside** (Phosphor, Material): the mark sits inside the body in both styles and is knocked out
     when filled; or
   - **badge** (Fluent, SF): the mark sits in its own disc on the corner, the body cut back round it.
   Area's mark-replaces-the-corner, with its arms knocked out through the edge, is unique to Area and
   is what produced the sawn notches and strips the owner keeps finding.

## Proposed rules for Area

- **R1 Fill the body, nothing else.** The mass that names the object fills. Parts that are not the
  body keep the outline's drawing, the same size and weight: a dog-ear stays open, an open folder's
  back stays a line, a clip keeps its outline (option B) or fills at its own outline size (option
  A), pegs, handles, stands and needles stay lines.
- **R2 Details are knocked out of the body** at the outline weight (knockouts follow the size curve).
- **R3 Ends.** A positive stroke always ends round. A knocked-out stroke ends round when its end is
  inside the solid, and **sawn flush when it reaches the edge** (it becomes a cut through the
  silhouette, never stopping a hair short). A gap between two parts is space, so its ends are sawn.
- **R4 Marks go inside** the container in both styles (Phosphor, Material, Cursor's "interior
  details knocked out"), so the filled mark is an ordinary knockout with round ends and no notch,
  and the mark is the same size and place in both styles. This reverses the 2026-09-27 corner
  placement for containers with room inside (clipboard, document, folder, calendar, cloud, mail,
  chat already inside); a figure keeps its mark beside it (person-add).
- **R5 Lines beside a solid stay lines** (unchanged).

## Options shown (sheet 2)

- clipboard: A clip solid at its outline size, parted from the board; B clip stays a ring, the board
  cut back round it (recommended: B, "only the main part fills").
- document: the dog-ear stays open (recommended), as Phosphor, Material and SF.
- folder-open: the front fills, the back stays a line (recommended), as Phosphor and Material.
- corner marks: now (knocked through the edge); corner mark kept as a line with the body cut back
  round it (reads as a sticker, leaves corner wedges); inside, knocked out (recommended).

Prototype sources: `prototype/proto-*.svg` (rendered by copying them into
`apps/docs/assets/area-icons-pilot`, then `options.mjs`; they are not in the set).
