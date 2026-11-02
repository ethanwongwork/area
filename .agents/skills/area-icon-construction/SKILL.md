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
questions: take the recommended option, record it as delegated in references/owner-preferences.md and in
`docs/research/icon-inventory.md` ("To settle"), and say so in the reply so the owner can
overturn it. When the owner asks for decisions, send a simple decision sheet that shows each
option rendered (explore candidates or `sheet.mjs`), not a text list.

0. **Set up** a fresh worktree with `npm ci`. Sheet scripts drive headless Edge; if they hang, stop stray
   `Microsoft Edge … --headless` processes (orphans hold the profile; `2026-10-07/edge.mjs` stops Edge as
   soon as its output is written). Look at icons in the app's Icons tab (`npm run dev`;
   check who holds port 4400 first, `docs/DEVELOPMENT.md`). After regenerating, run
   `npm run build -w @area/icons`: icons are not watched. In zsh a `$VAR` holding several icon names
   stays one word: pass names directly, comma-separated, or as a batch id.
1. **Find first.** `npm run icons:find -- <concept …>` searches names (with turns), demo
   labels, Fluent cuts, construction lines, batch notes and the build queue
   (`docs/research/icon-inventory.md`). Use what exists; if a family base exists, make a
   variant with the family's modifier (Families, in references/construction-system.md); if nothing does, check the queue's
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
   packages/icons/sources <names>`); check the batch in the app's Icons tab; run the cohesion
   check (`docs/research/icon-cohesion-2026-10-31/tools/compare.py`, Cohesion in the construction rules) and look
   at the batch in a strip with its neighbours (`tools/strip.mjs`); send the owner a sheet (Area alone at
   16–48, or beside the libraries).
9. **Hand off:** update the icon line in `.Codex/HANDOFF.md`. Only the owner marks approvals.

## Owner preferences

Every decision the owner has made about icons (references, size, chosen shapes, filled
treatments, families, what to ask and what to decide alone) is in
[references/owner-preferences.md](references/owner-preferences.md). **Read it before
drawing any batch**, and add each new decision there, replacing what it supersedes.

## The system at 16px

The construction rules are in [references/construction-system.md](references/construction-system.md),
with a contents list at the top. They cover:

- weight and the pixel grid;
- keylines and the live area;
- gaps, counters and the diagonal lattice;
- filled treatments and families.

Read the sections your batch touches before drawing, and the whole file once per session.
The lint enforces the measurable rules; the file explains the rest.

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
4. **Review** each icon in the app's Icons tab (the archived `gallery-icons.html` page is described below for its card layout). Icons are grouped by batch, from
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
