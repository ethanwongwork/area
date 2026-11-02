# How type sites show typefaces (2026-11-01)

Owner: "can you research google fonts, and some of the other top type foundries that i mentioned before to see and show how
typefaces are shown, maybe put the type ramp stuff in a container?" Foundries from the typefaces review (2026-10-31):
Klim, Pangram Pangram, Dinamo, CoType, Displaay, Fontshare, Schick Toikka.

Read with WebFetch (structure, order, copy) and in the browser (Google Fonts and Klim, which render with script).
Pangram Pangram refused every fetch (429) and Fontshare returned only its title; they are not covered.

## What each shows

- **Google Fonts** (fonts.google.com/specimen/Inter, seen): tabs Specimen, About, License, Glyphs & languages. The name
  large, the designer under it; a big grey sample paragraph; then **Styles**: one row per style, hairline-ruled, no
  frame, the style's name and weight ("Thin 100") at 14/20 regular, muted, 20 over a **one-line sample at 48px that is
  clipped at the edge** (`white-space: pre`), not wrapped. A preview field, a size menu and a size slider over the list
  apply to every row. Its metadata guide fixes the sample lengths: a 4-glyph masthead ("AaBb"), a 40–60 character phrase
  for styles, 60–90 for the tester, longer text as the size drops in a waterfall
  (googlefonts.github.io/gf-guide/metadata.html).
- **Klim** (klim.co.nz/fonts/soehne, seen): the family name in its own face, huge, as the hero; "16 styles" as a label in
  a left column, then **every style's name set in that style with its weight as a superscript** ("Buch 400"), one run;
  details as label / value pairs (release, classification, formats), OpenType features as name + tag ("Tabular numerals
  tnum"), variable axes as a small table (Axis, Tag, Range, Default), glyphs, in use.
- **Dinamo** (abcdinamo.com/typefaces/diatype): Families (a numbered list with style counts), Try, Features (each a
  heading, a real-word sample and its CSS), Info, Glyphs, In use. Upright and italic paired in one row.
- **Displaay** (displaay.net/typeface): the index is **ruled rows**, each one large character, the name, a price and a
  badge; specimens list counts ("3 Families, 18 Weights, 36 Styles") and stylistic sets grouped by letter.
- **CoType** (cotypefoundry.com): index cards with a preview, the name and a style count ("80 styles"); details as label
  / value pairs; the character set as alphabet lines.
- **Schick Toikka** (schick-toikka.com): **one editable tester row per style**; Styles and About tabs.

## Shared by most

1. A list of type is **ruled rows**, one per style or size: a small label, then a sample on one line, clipped.
2. The label names the style and its weight number ("Regular 400"); sizes are labelled the same way in a waterfall.
3. A family's entry carries its **style count**; details are **label / value pairs**.
4. Samples are real phrases, never lorem ipsum; longer at smaller sizes.

## Applied in Area (this branch)

- **Type ramp, framed:** one frame (the feed table's: its fill, edge and corner) with hairline rules between rows; each
  row the role's name and size in a label column (the tables' 27%), its sample on one line at the role's size, clipped at
  the frame (Google Fonts' styles list, in Area's frame). Under 560 the label sits over the sample. Used by Typography's
  role page and Labs › Feed (`.studio-type-rows`).
- **Type styles:** the same rows for a face's weights ("Regular 400"), in Labs › Feed.
- Not changed: the typeface cards keep "Aa" (the owner's pick, 2026-10-24); the shared pattern would be the family name
  set in itself with its style count under the card, for the owner to choose.

## Pangram Pangram, Altera Sans (measured 2026-11-01 at 1440)

https://pangrampangram.com/products/altera-sans (unreachable at first, read on the second try).

- **Sampler**: cards #ededed, corner 20, padded 26. One header row 38 tall: the face as an accent pill and a style select
  ("Extrabold") on the start; Size, Leading and Spacing as pills on the end (#fafafa, label 12.4 at 530, a 96 rail, the value),
  12 apart. A row of OpenType toggles under it on the full-width cards (left out of Area's: owner, "ignore the line that says
  flat term, case, etc"). The sample: 145 at 600 with 0.9 leading, wrapping, then a second card at 94.5.
- **Half cards**: two 617 cards side by side, each a face pill, a style select and Size alone: a bold paragraph at 26.5
  (1.1 leading) and a regular one at 12.6 (1.4).
- **Styles**: a dark specimen card (AaBbCc 01234567 {(!@#$?&)}) beside the styles as rounded rows, the name in its weight and
  the weight number at the end in the accent.
- **Variable tester**: a dark card, the name in the middle, a play button and a Weight pill at the foot.
- **Glyphs**: a grid of glyph tiles beside a Glyph View drawing the chosen glyph with its metric lines (ascender, cap height,
  x-height, baseline, descender). Later in Area: the glyph set as the icon set's gallery (owner).
- **Features**: one card per feature, its name as a pill on top, the sample large, toggling off and on.
- **Family cards**: square 403, padded 26, corner 20; the family's name (17.7 at 600) over "8 styles + Variable Cut" (14, muted)
  top-left; a 140 "Aa" at the foot.

What Area took (src/type-kit.tsx): the tester split into display and body; one header row per card with the bars at the end;
the inline slider (label, rail, value) in place of the label-inside bar, whose 16 side inset clears its grip at zero and read
as an indent here; the facts in a header inside the card, the sample at the foot.

## Cursor's type sizes (read 2026-11-02 from the installed app bundle)

`/Applications/Cursor.app/Contents/Resources/app/out/vs/workbench/workbench.glass.main.{js,css}` (bundle dated 2026-10-27).
Owner: "the components and controls might be 13 but it looks like the body copy for the chat experience is slightly larger?"

- **The scale** (`:root`): `--cursor-font-size-xs` 11 / `--cursor-line-height-xs` 14, `sm` 12 / 16, `base` 13 / 18, `lg` 14 / 22.
  The IDE's chrome, lists, menus and controls are on `base` (13/18); 12 is the most common declared size (secondary text).
- **Chat** (`.composer-bar, .composer-messages-container`): `--conversation-text-font-size: var(--cursor-font-size-lg, 14px)`,
  `--conversation-tool-font-size` the same 14, `--conversation-line-height: var(--cursor-line-height-lg, 22px)`; the tray
  (the composer's own controls) stays `base` 13. Blocks 16 apart, a list 8 before and 18 after, its items 8 apart, a heading
  4 above its block; tool cards padded 10 × 8, 6 between. Markdown's inline icons are the conversation size (14).
- **Rich text** (plans, documents; `--rte-*`): a 14 base (`--rte-font-size-base: var(--cursor-font-size-lg)`) on a 20 line
  (also 1.6 in one surface), paragraphs 10 apart; h1 26/30, h2 17/24, h3 14; code 13.

So Cursor draws two kinds of type at once: chrome and controls at 13/18, and anything you read as text (a reply, a
document) one step up at 14/22. Area's ramp at type 13 has Copy 15/22, 13/18 and 11/14, so reading copy at Cursor's
step would be a 14 Area doesn't have yet, or Copy 15 on the same 22 line.
