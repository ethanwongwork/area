---
name: visual-experiment
description: Writes the brief for, drafts and finishes a piece in the owner's visual experiments gallery (experiments/, separate from Area's design system), such as type compositions, glyph patterns, posters, vector, colour, 3D and interactive pieces. Sets what every piece contains (format, margins, typeface, copy, inks, views, motion, viewer panel, caption, exports) and what a first draft must show. Use whenever the owner asks for a new experiment, a variation of one, a poster or type study, or shares references to make a piece from.
argument-hint: "[idea or reference]"
---

# Visual experiments

The gallery is a personal portfolio of one-off pieces, each a single page with its own
motion, shown full screen beside a panel and exported for Instagram. It has its own rules:
Area's AGENTS.md component rules don't apply. The code lives in `experiments/` (own
`package.json`, Vite, outside the npm workspaces); read its `README.md` for commands and
`INSPIRATION.md` for the owner's board.

**Experiment 1, Glyph Flow** (`e/glyph-flow`) is the reference piece. Every default below
comes from what the owner asked for while making it (session of 2026-11-08/09), unless
another source is given. When a later instruction from the owner contradicts this file,
follow the owner and update this file.

## 1. Write the brief first

**Own designs, not recreations.** References give a layout, a texture or a rule to build
from; the piece itself is the owner's own design ("i dont want to recreate the exact
references", 2026-11-08). When the owner does ask to recreate a reference, as with the
Question Time poster on 2026-11-09, it is a study: it stays an artifact or a `draft: true`
entry and never goes in the gallery (owner, 2026-11-10).

Before drawing anything, fill in this brief and show it to the owner with the first draft.
Every field has a default, so a missing answer never blocks the draft: take the default
and say which ones you took.

```
Number        next free number in experiments.json (1, 2, 3 … never 001)
Slug          e/<slug>, short, lowercase, hyphenated
Name          a plain description, 1 to 3 lines, sentence case, no invented title
              (“Hiragana, katakana and Latin glyphs, set as one block of type”)
Kind          Type · Vector · Color · 3D · Interaction · Poster
Format        1:1 square
Margins       tight: see section 2
Idea          one sentence: the system that makes the image (what decides where things go)
References    the owner's images, and what is taken from each (a layout, a texture, a rule)
Typeface      family, weight(s), foundry, designer, licence (section 3)
Copy          source, author, year, licence, link (section 4)
Ground, inks  white #FFFFFF; inks chosen for this piece (section 5)
Locked        everything that is decided
Open          the 2 to 4 choices still being decided, which become panel controls
Views         the set made to post together (section 6)
Motion        none in the first draft; later stop motion (section 7)
Tools         fontkit / opentype.js, Canvas 2D, SVG, three.js, GSAP … only what it needs
```

## 2. Format and margins

- **Square, 1:1**, unless the owner names another ratio. Later pieces used 4:5 and 3:4 only
  because the owner asked. The ratio goes in the registry (`"ratio": "1/1"`) and the
  colophon (`Format: Square, 1:1`).
- **Tight margins.** For a type-led piece the margin on every side is **one word space at
  the piece's type size** (Glyph Flow: `m = space`). For anything else (vector, colour, 3D)
  use **1% of the side**, about 11 px at 1080 (owner, 2026-11-10). Never more than 2% unless
  the owner asks for air.
- **Equal on all four sides.** Ease the leading or scale so the last line lands on the bottom
  margin, as Glyph Flow does. Don't leave a ragged gap at the bottom.
- **Gutters and gaps are no bigger than the margin.** Between sections of type, the gap is a
  single word space, so sections read as changes of texture and not as boxes with gaps.
- The piece fills the frame. Nothing floats in the middle with a wide border.
- **Bleed is a composition, not a margin failure.** Type may run off the frame when the
  owner asks for it (experiment 5, 2026-11-10: "ribbons of text that exit the frame"). Then
  the square cuts the strands on purpose, on at least two sides, and the margin rule doesn't
  apply. Say so in the brief (`Margins: bleed`). Keep at least one view inside the margins.
- Draw at a logical 1080 and **export at 2160 px** (Instagram shows 1080).

## 3. Typeface

- A **distinctive face from a reputable foundry**. The owner has named ABC Dinamo, Pangram
  Pangram, Displaay and Frostype, and keeps trials in `~/Downloads` and `~/Library/Fonts`.
  Copy the ones a piece uses into `experiments/fonts/trial/` (git-ignored). Open-source faces
  (Fontsource) are fallbacks and build defaults, not the first choice.
- **Typefaces per piece are free**: use as many families as the idea needs (owner,
  2026-11-10; Grid Glyphs uses seven). Credit each one in the colophon.
- When the type is the material, **use the whole glyph set** (accents, kana, Greek, Cyrillic,
  figures, signs), not only A–Z.
- **Scripts follow the idea.** Mixing hiragana and katakana with Latin was Glyph Flow's idea,
  not a rule for the series. Use Japanese, or any other script, only when the piece needs it
  (owner, 2026-11-10).
- **Upright glyphs, normal to tight kerning and leading, no ink overlapping messily.**
  Patterns come from order and repetition, not from collisions.
- **One type size** across a composition unless the idea is about size. Change the texture
  through which glyphs are set, not through their size.
- Bending, skewing or tapering type means **warping the outlines** (every point of the
  glyph moved through the path), never rotating whole letters along a path. See the
  Question Time type study, 2026-11-09.
- **Licence.** Record it in the colophon. Trial and “free for personal use” licences
  (Pangram's) don't allow websites, apps or social posts: before posting, tell the owner a
  commercial licence is needed. Never put a trial font file in an artifact or a build.
  Artifacts carry sampled outlines or grids only; `FONTS_LICENSED=1` is the switch for builds.

## 4. Copy

- **Real copy, never invented.** Use obscure or niche literature in the public domain
  (Project Gutenberg), or a generic but real source such as Wikipedia. Quote it verbatim,
  keep its spelling, and credit it in the colophon. Glyph Flow uses Moxon's *Mechanick
  Exercises* (1683, Gutenberg 72217); Word Web uses Stein's *Tender Buttons* (1914).
- When the script the piece needs has no fitting source (kana-only copy in a face with no
  kanji), short original copy is acceptable. Say so in the colophon.
- Words in the panel and the caption say **copy**, not text.

## 5. Ground and inks

- **White #FFFFFF** by default, with **black #000000** as the one alternative ground. The
  owner asked for black at first and settled on white.
- **Start in black and white.** A first draft is black on white and white on black only, so
  the layout is judged on its own. When colour is part of the idea from the start, use simple,
  basic, high-chroma colours (pure-feeling red, blue, yellow, green, pink) flat on the ground,
  never a tuned palette yet. Refined inks come after the layout is chosen (owner, 2026-11-10).
- **Inks are chosen per piece**, from its idea and references (owner, 2026-11-10). There is
  no shared house palette. What carries over is the quality: **vivid but light, flat** inks
  that read on the ground. Glyph Flow's riso set is one example:
  `#ff48b0 #0078bf #00a95c #ff6c2f #765ba7 #f15060`.
- In the first draft, offer two or three ink sets drawn from the references, not the
  riso set by habit.
- **One ink per section**, so colour follows the composition. Gradients only when the idea
  is a gradient.
- If the ink set is still open, it becomes a control showing a swatch per set.

## 6. Views: a set made to post together

A finished piece is a set, not one image. **It has as many views as the idea needs**
(owner, 2026-11-10): no fixed count, and the overview grid shows them all. Keep this order,
which is also the carousel order. Glyph Flow has nine:

1. **Hero**: the default, the whole sheet.
2. **Details** at 2.5× and 6×: close enough to read the copy and see the seams.
3. **Variations, one change each**: type size (fine, large), script or character set,
   ground. Each changes only what its label names.
4. **All views**: an overview grid of the set.

Every view has a one-line note for the panel. Pick white or black per view on purpose and
say why. Include one view that mixes everything the piece can draw (the full glyph set).

## 7. Motion (after the layout is approved)

- **Layout first.** No motion until the owner approves a layout.
- Then draft several motions in parallel, each a different idea: how colour moves between
  sections, how glyphs change, how the pattern travels.
- The house feel is **tactile stop motion**: about 8 fps, frames held, with a slight boil.
  When the owner asks for smooth motion instead (experiment 5, 2026-11-10: "smooth and slow,
  lots of easing"), run at the screen's frame rate. Use long moves eased in and out (quintic),
  staggered so neighbours overlap, then holds so each move lands. Draw on the GPU when Canvas 2D
  can't hold 60 fps.
- **Most of the piece stays visible at every moment.** Parts can dim and return, never
  empty out completely.
- When one motion is chosen, it becomes the only motion. Its strength becomes one plain
  control (Glyph Flow: Turbulence, None to High). Don't offer a menu of motions.
- Space pauses. Respect reduced motion.
- **Video is an 8 second loop**: 64 frames at 8 fps, recorded at 1080 (owner, 2026-11-10).
  Make the last frame lead back into the first so it loops cleanly.

## 8. The viewer, panel and caption

The piece opts into the shared viewer (`shell(slug, { viewer: true })`): gallery thumbnail →
full screen piece and a right-hand panel. The panel has:

- **Name** (the description, 2 to 3 lines), **number** on the last line, then the **date**
  (“November 9, 2026”), all left aligned.
- **Description**: a short, plain, technical paragraph on how the image is made. No hype.
- **Controls**: only the few open choices (view, a motion strength, ground, ink set), plus
  play or pause. Everything else is locked and lives behind **G** (lil-gui).
- **Colophon**: Typeface (with foundry and licence), Copy (source and credit), Made with,
  Format.
- **Share**: export png (2160), export the set, export video (1080), and copy the caption.

The gallery UI itself: one serif face, regular weight, one size, two foreground colours,
sentence case (no all caps), 8 px for every gap, margin and padding, links and buttons
vibrant blue. The gallery's only header is the filter by kind, with no site name, index or
info links. Thumbnails sit six across, about 220 px wide.

**Caption** (for Instagram, copied from the panel):

```
<What it is, in one plain line that reads like a title.>

<Two or three sentences: the system, and what the set varies.>

Type: <Family> by @<foundry handle>
Copy: <Author, Title (year)>
Made with: <tools>
```

Leave out the number, the date and the ink names. Credit the foundry.

## 9. What a first draft must show

The owner reviews variations best as an **artifact** (a page with every option side by
side), not a localhost link. A first draft is:

- [ ] The brief above, with the defaults you took marked.
- [ ] **Layout only**, square, at the tight margins, in the real typeface with the real copy.
      No lorem ipsum and no fallback font standing in for the chosen one.
- [ ] **Several layout variations** along named axes (composition, characters, copy,
      colour), each labelled with what changed. Aim for 6 to 12.
- [ ] Each one drawn from the system, not hand placed, with a seed so any one can be
      reproduced.
- [ ] Checked by measurement, not by eye: margins equal on all four sides, no glyph ink
      overlapping another, gaps no bigger than the margin, nothing outside the frame.
- [ ] Looked at in full and at thumbnail size (the gallery grid shows it at about 220 px).
- [ ] One line per variation on what the owner should decide, and your pick.

Don't build the viewer panel, motion, exports or caption in the first draft. They come once a
layout is chosen.

## 10. Finish

1. Add the registry entry to `experiments.json` (`slug`, `number`, `title`, `kind`, `year`,
   `ratio`, `at`, `hint`, `tools`, `description`, `colophon`, `date`).
2. Build the views, the locked design and the open controls; wire the panel.
3. `npm run thumbs <slug>` for the gallery still. **The thumbnail is the hero at rest**: the
   default view, first frame, the same image as the hero export (owner, 2026-11-10). Set
   `at` to 0, and make `?thumb` draw the hero at frame 0.
4. List the views in `public/views/<slug>/views.json` and make the piece exportable
   (`exportable({ loop, fps, render(t, size) })`, `src/export.js`; README, "Views and
   exports"). Every view's choices must be readable from the URL; `render` must draw the same
   frame every time; every moving view must close its loop exactly (the exporter's
   end-to-start gap is 0). Then run `node scripts/export-set.mjs <slug>`, open the PNGs and
   look at frames across the loop and across the seam (owner, 2026-11-17: every piece's
   views sit below it in the viewer and ship as one zip for posting).
5. Tell the owner which licences block posting.

## Decided with the owner, 2026-11-10

These weren't settled while making Glyph Flow. The owner answered them the next day, and the
sections above already apply them:

| Question | Answer |
|---|---|
| Margin for pieces that aren't built from type | 1% of the side (section 2) |
| Does every piece mix Japanese and Latin? | Only when the idea needs it (section 3) |
| How many typeface families per piece? | As many as the idea needs (section 3) |
| One shared ink set, or chosen per piece? | Chosen per piece (section 5) |
| How many views in a set? | As many as the idea needs (section 6) |
| Video loop length | 8 seconds: 64 frames at 8 fps (section 7) |
| Gallery thumbnail | The hero at rest, frame 0 (section 10) |
| Do recreations of a reference go in the gallery? | No. Keep them as studies (artifacts or `draft: true`). Gallery pieces are the owner's own designs, made from references, not copies of them (section 1) |
