# Link spec

**Captures:** `docs/research/captures/link/`
**Peers:** Alert link, Card action, Chip `link`, Code block line numbers (Area's existing underlines), Breadcrumb link (a hover plate, not an underline), Button (an action, not a destination), HoverCard (previews a link)

## Owner decisions

- 2026-10-08: "move on to the next component" after Pagination. Link was the next item in the list the
  owner chose from (Pagination, Link, ScrollArea, FileUpload) and the other navigation gap 8 of 13
  catalogues ship.
- 2026-10-08: the open questions go with the recommendations: Area's existing underlines move to Link's
  40% line (follow-up commit, reopening the families it changes), `inherit` stays the default ink, and the
  ChatGPT and Notion basis stands without a Figma search.

## Job and boundaries

A link goes somewhere: another page, a place on this page, or another site. Inline links sit in running
text; standalone links ("Learn more", "View all") stand on their own. It is text, not a control: it takes
the size and ink of the text it sits in and adds an underline. Not a Button (does something here), not a
Breadcrumb link (a trail with a hover plate), not a Chip `link` (a labelled pill), not a Nav row.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | `inline` (default) | Always underlined in running text | ChatGPT composer note, Notion page text, Primer `inline` |
| variant | `standalone` | Underline on hover and focus only, outside a sentence | Primer default Link; Untitled UI link buttons (underline fades in on hover) |
| ink | `inherit` (default) | The surrounding text's ink, at its size | ChatGPT (muted note), Notion (body ink) |
| ink | `muted` | Secondary links (metadata, footers) | Primer `muted` |
| ink | `action` | The Action role: neutral unless a theme makes actions the accent | Primer and GitHub's accent links, reached through Area's role rather than an accent tone (DESIGN_SYSTEM.md, "Emphasis roles") |
| ink | `blue` | The link blue of product UI (`fg-info`); owner, review round 2 (2026-10-09) | ChatGPT settings links rgb(44, 103, 197), Figma's file browser rgb(0, 123, 229) |
| ink | `purple`, `pink`, `green`, `red`, `orange`, `brown` | The readable text ink of each hue, the one Tag and Badge use; owner, 2026-10-17 ("Hued inks") | Wikipedia's visited #6a60b0 and missing-page #bf3c2c links |
| composition | `external` | New tab, the external mark, announced | Primer's link-external icon convention; GitHub docs |

Excluded: an accent `tone` (Area never offers one; `action` follows the theme, and a hue names a colour, not a
status), visited styling (no target
product shows one), a disabled link (a destination that can't be reached is text, not a link), a size axis
(a link takes the text's size; Breadcrumb keeps none either), Notion's 70% text opacity (below).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | "Terms", "Privacy Policy" in the composer note | chatgpt.com, logged out (built-in browser), 2026-10-08 | evidence only | `chatgpt--disclaimer-inline--rest--light` |
| notion | target product | An inline link in a text block | app.notion.com, a page in the owner's workspace (Chrome, read-only), 2026-10-08 | evidence only | `notion--inline--rest--light` (redacted) |
| primer | design system (rendered + rules) | Link default, inline, muted | primer.style/product/components/link, 2026-10-08 | MIT | rule readout (below) |
| uui | design system (source classes) | Link-style buttons | the Pagination capture's Previous button classes (`pagination/uui--page-default--rest--light`) | MIT | — |
| area | this system | Every gallery tile; hover on a harness of the same CSS | localhost | — | `area--*` (8) |

**Readouts** (the capture script records no text-decoration, so these were read from computed styles and
the products' own rules):
- ChatGPT: `text-decoration: underline; text-underline-offset: 0.125rem` (2px), thickness `auto`, colour the
  text's (inherited, oklch 0.478 in the note); no hover rule.
- Notion: the link's span sets `text-decoration: underline; text-decoration-thickness: 0.05em` (0.8 at 16);
  `text-decoration-color: rgba(55, 53, 47, 0.4)`; `text-underline-offset: 10%`; `opacity: 0.7`. Ink rgb(44, 44, 43)
  inherited. Hover not captured: the pointer would not register on the link from the extension.
- Primer: `color: fgColor-accent; text-underline-offset: 0.05rem; text-decoration: none`, underline on hover;
  `[data-inline]` underlined at rest; `[data-muted]` `fgColor-muted`, accent on hover.
- Untitled UI link button: `*:data-text:underline *:data-text:decoration-transparent
  hover:*:data-text:decoration-fg-quaternary *:data-text:underline-offset-3`, and the ink also darkens on hover.

Target products searched without an equivalent: **Figma** not searched (Open).

## Anatomy

```
chatgpt  span (12/16, muted)  > a  underline in the text's ink, offset 2
notion   a.notion-link-token  > span  underline 0.05em at 40% warm grey, offset 10%, the span at 70% opacity
area     a.area-link (inline)  underline: 1 stroke, offset 0.08em, currentColor (rest, hover and focus)
           span.area-link__icon (external)  12 square, `open` glyph, 4 after the text, centred on 1cap
```

Insets: none; a link has no box. The external mark's position is `vertical-align: (1cap − 12) / 2`, which
centres its square on the cap height (measured 268.02 against the cap's middle at 268.03, 4.00 after the text).

## Measurements

Generated with `node scripts/capture-compare.mjs docs/research/captures/link/{area--default,area--content-caption,chatgpt--disclaimer-inline,notion--inline}--rest--light.json`
(the link and Notion's text span; type, ink and opacity rows).

| slot · property | area · default · rest · light | area · content-caption · rest · light | chatgpt · disclaimer-inline · rest · light | notion · inline · rest · light |
|---|---|---|---|---|
| **link** size | 89.02 × 20.5 | 43.13 × 15.5 | 34.2 × 14 | — |
| **link** font | 16px/24px 400 Geist | 12px/16px 400 Geist | 12px/16px 400 -apple-system-body | — |
| **link** color | rgb(40, 40, 40) | rgb(102, 102, 102) | oklch(0.478359 0 none) | — |
| **link** text cap top / baseline from shell | cap +5.76 · baseline −30.88 · start +69.94 · end −75.71 | cap +3.11 · baseline −4.37 · start +189.09 · end −2.41 | cap +2.74 · baseline −18.8 · start +254.3 · end −106.44 | — |
| **link** text cap / x height | 11.36 / 8.48 | 8.52 / 6.36 | 8.46 / 6.32 | — |
| **text** size | — | — | — | 170.8 × 19 |
| **text** font | — | — | — | 16px/24px 400 ui-sans-serif |
| **text** color | — | — | — | rgb(44, 44, 43) |
| **text** opacity | — | — | — | 0.7 |
| **text** text cap top / baseline from shell | — | — | — | cap +4.56 · baseline −3.17 · start +0 · end −0 |
| **text** text cap / x height | — | — | — | 11.27 / 8.42 |

Area's underline (computed): 1px, offset 2px, `oklab(0.277 0 0 / 0.4)` on rgb(40) text (default) and
`oklab(0.510 0 0 / 0.4)` on the muted caption; hover rgb(40, 40, 40) (`area--default--hover--light`, ink fixed).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| link · type | inherited | ChatGPT, Notion | — |
| link · ink | inherited (`inherit`), or `fg-muted`, `fg-action`, `fg-info` (`blue`), or a hue's text ink (`fg-discovery`, `fg-pink`, `fg-success`, `fg-danger`, `fg-warning`, `fg-brown`) | ChatGPT and Notion inherit; Primer muted; Emphasis roles; owner 2026-10-09 (blue) and 2026-10-17 (hues) | — |
| link · underline (inline) | always | ChatGPT, Notion agree | — |
| underline · colour | `currentColor` (the link's own ink) | ChatGPT; owner, review round 2 (2026-10-09) | Notion 40% (Area's value until round 2) |
| underline · thickness | 1 stroke (`stroke-width`) | Area's other underlines; ChatGPT auto ≈ 1px | Notion 0.05em (0.8 at 16) |
| underline · offset | **0.08em** (about 1 at 12–16) | Owner's reference (GitHub link, 2026-10-17): 1 CSS px under the baseline; one clear pixel row at 1x, 12–16 ("Close underline") | ChatGPT 0.125rem, Notion 10%, Primer 0.05rem. Was 2 until 2026-10-16, then 0.25em until 2026-10-17 |
| text opacity | none | Area keeps ink fixed and its contrast measurable | Notion sets the link text at 70% |
| hover / focus | inline: unchanged (the line is already full ink, as ChatGPT's); standalone: the line lands at once, fades on fast; ink fixed | Shared rule (hover changes only plate, edge or underline); Untitled darkens the underline | Untitled and Primer muted also change the ink |
| standalone | no underline at rest; full underline on hover and focus | Primer default; Untitled link buttons | — |
| focus ring | 2px `focus-color` at `focus-offset` (2), `radius-min` corners | Alert link, Button | — |
| external mark | `open` glyph (Area's approved external icon, Fluent's shape) at 12, 4 after the text, cap-centred, mirrored in RTL | xs icon gap (DESIGN_SYSTEM.md, 4 at xs); inset.css cap reference | — |

## States

| State | Changes | Evidence |
|---|---|---|
| hover | inline unchanged; standalone underline from transparent to `currentColor`; ink fixed | `area--default--hover--light`; harness readout rgb(40) / rgb(40) |
| focus-visible | underline full, 2px focus ring offset 2 | harness with Tab |
| standalone rest | underline transparent | `area--variant-standalone--rest--light` |

## Behavior and accessibility

A native `<a>` with every anchor prop and a ref. `external` sets `target="_blank"` and
`rel="noopener noreferrer"` unless given, adds an `area-sr-only` " (opens in a new tab)" (`newTabLabel`) and
the hidden mark. `linkVariants({ variant, ink })` gives the classes for a router's own anchor. Forced colors:
the browser's LinkText applies; nothing is painted that would hide it.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Alert link, Card action, Chip `link` and `link-icon`, Code block line numbers and toggle, Description list "Show more", Abbreviation | underline | currentColor, 1 stroke, offset 0.08em | the same line | Match ("Close underline, 2026-10-17") |
| Breadcrumb link | link hover | hover plate | underline | Breadcrumb is a trail of controls; a link in text has no plate |
| Button | — | an action | a destination | — |

## Visual pass

Harness (server-rendered specimens with `dist/area.css`, 1:1, light and dark) beside an Alert with a link and a
Breadcrumb: the 40% line reads as a link without weighing on the text, in both themes; the caption link takes the
caption's 12px and muted ink with nothing set; the external mark sits on the cap height; a wrapped link underlines
every line. Fixed during the pass: focus drew the underline over the 100ms fade (alpha 0.81 when read); focus now
lands at once, as hover does.

## Underline clears descenders, 2026-10-16

Owner: "can you clean up and fix the underline on the link component, it doesnt look clean".

Rendered in headless Edge at 1x and 2x, 12 to 16px, on "usage guide, typography":
- **At 2 (the old offset):** at 13 the tails of g, y and p ended on the row above the line and fused with it. At 14 they
  crossed it, and skip-ink cut the line into pieces around each one. ChatGPT's 0.125rem is set for its 16px prose,
  where the descender is deeper relative to the offset and the cuts read as intended.
- **Compared:** 3, 0.2em, 0.25em; and 3 at 50% and 35% ink, and Notion's 2 at 40%.
- **Chosen: 0.25em.** At 1x the line is one solid pixel row with one clear row between it and the lowest descender at
  12, 13, 14, 15 and 16 (pixel rows read from the captures). The gap scales with the type, so a link in a caption and
  one in body text look alike.
- **Ink:** the line stays the link's own ink (owner, round 2). Softer lines (35 to 50%) also read clean, but they
  would undo that decision.

Peers that draw Link's line take the same offset: Chip `link` and `link-icon`, Card action, Alert link, Code block line
numbers and toggle, and Description list's "Show more".

## Hued inks, 2026-10-17

Owner: "i also want the option to have the link be colored blue or standard text, or potentially another color like
even gray, or purple, etc." and "i dont want the underline to just show up on hover". Inline links were already always
underlined, and the underline stays in the link's ink at 0.25em. New inks: `purple`, `pink`, `green`, `red`,
`orange`, `brown`. Each is the readable text ink of its hue, the one Tag and Badge use (`fg-discovery`, `fg-pink`,
`fg-success`, `fg-danger`, `fg-warning`, `fg-brown`), so it holds 4.5:1 and follows the Layers ground. Gray stays
`muted`; standard text is `inherit`. Wikipedia, measured: links #36c with no underline until hover, visited #6a60b0,
missing pages #bf3c2c. A hue names a colour, not a status. Contrast sweep at light 100 + 4, light 90 + 8, dark 8 + 4
and dark 24 + 8: no text under 4.5:1.

## Peers aligned, 2026-10-08

Owner: "go with your recommendations" (open question 1). The underlines that show at rest now draw Link's
line: 40% of the ink, full ink on hover and focus, one stroke 2 below, the ink fixed.

| Family | Element | Before | After |
|---|---|---|---|
| Alert | `.area-alert__link a` (inline and banner) | full ink | Link's line; the banner's duplicate rule removed (same specificity, later in source, it held the rest line under the pointer) |
| Card | `.area-card__action` | full ink, thickness auto | Link's line, 1 stroke |
| Chip | `.area-chip--link .area-chip__label` | full ink | Link's line; full when the chip is hovered or focused |
| Chip `link-icon`, Code block line numbers and toggle | underline on hover only | full ink | unchanged: already Link's standalone behaviour |

Measured in the gallery: Alert and Chip links rest at `oklab(0.277 0 0 / 0.4)` on rgb(40) text; the banner link
under the real pointer reads rgb(40, 40, 40) for both ink and line. No gallery tile shows Card's action. Alert,
Card and Chip are back in review (`REVIEW_COMPONENTS`, Review batch "Link's underline in peers").

## Verification

- 8 Area captures, 1 ChatGPT, 1 Notion; checksums verified. Primer and Untitled UI from rules and source classes.
- `npm run build` (parity, token refs), typecheck, React tests (including 4 new in `link.test.mjs`), contracts,
  consumer, `npm test`, `lint:icons` (the new `open` package glyph), `build:docs`, `git diff --check`.
- Unverified: Notion's hover, dark captures of the products, forced colors, a screen reader reading the new-tab note.

## Open questions

Resolved 2026-10-08 (owner: "go with your recommendations"):
1. Existing underlines move to Link's line: see "Peers aligned, 2026-10-08" below.
2. `inherit` stays the default ink; `action` is opt-in.
3. No Figma search; the ChatGPT and Notion basis stands.

## Review note, 2026-10-09

- **What changed:** The underline is now the link's own colour at rest (it was 40% of it), so a link in a sentence reads as a link at a glance. A new blue ink (`ink="blue"`) gives the link blue that ChatGPT and Figma use for links in their interface; in a sentence it stays underlined, and a standalone one underlines on hover. The default still takes the surrounding text's colour, as ChatGPT and Notion do in running text.
- **Why:** You asked whether links should be more obviously links, whether there should be a blue version, and whether the underline should match the text. ChatGPT draws its underline in the text colour; ChatGPT's settings links are rgb(44, 103, 197) and Figma's rgb(0, 123, 229).

## Review note, 2026-10-17 (round 33)

- **What changed:** The underline now sits close under the word, about 1px below the letters, as on GitHub and
  Wikipedia (it was 0.25em, about 3.5px at 14). Tails of g, y and p cross the line and the line breaks around them.
  The same line is used by Abbreviation, Chip links, Card actions, Alert links, Code block line numbers and Description
  list's "Show more". Links also have new inks: purple, pink, green, red, orange and brown, beside text, gray and blue.
- **Why:** You asked for an underline that is "very natural and close to the text", with a GitHub link as the
  reference. Measured from it: a 1px line, 1px under the baseline. 0.08em gives that at 12–16 (rendered at 1x and 2x).
  The inks came from your Wikipedia request for links in blue, text, gray or another colour.

## Feedback log

- 2026-10-08 · owner: "move on to the next component" → Link built from ChatGPT and Notion links, Primer and
  Untitled UI; `open` added to the package glyphs → 10 captures, gallery tiles, in review.
- 2026-10-08 · owner: "go with your recommendations" → open questions resolved as recommended; peers aligned
  in a follow-up commit.
- 2026-10-09 · owner, review round 2 (rethink): "should the link be more obviously a link? should there be a blue
  text and underline version? should the underline be the same color as the foreground?" → measured: ChatGPT settings links
  rgb(44, 103, 197) and Figma's file browser rgb(0, 123, 229), neither underlined; ChatGPT's prose underline in the text
  colour; Notion's in-page line a light border. Underline now the link's own ink at rest; new `ink="blue"`
  (`fg-info`); default stays inherit → link.css, manifest, Link.tsx, tile `ink-blue`; Alert, Card and Chip follow.
- 2026-10-17 · owner: "i want the underline for the link style to be very natural and close to the text in this
  style" (a GitHub link) → offset 0.25em → 0.08em on Link and its peers ("Close underline").

## Close underline, 2026-10-17

Owner, with a screenshot of a GitHub profile link: "i want the underline for the link style to be very natural and
close to the text in this style".
- **The reference, measured** (pixel rows of the 2x screenshot, about 14px text): the line is 1 CSS px thick and
  starts 1 CSS px under the glyphs' baseline; g's tail crosses it and skip-ink parts the line around it.
- **Rendered** Geist at 12, 13, 14 and 16, 1x and 2x, in headless Edge, at 0.25em, 0.15em, 0.12em, 0.1em, 0.08em,
  0.06em, `auto` and `from-font`. Gaps from the baseline to the line, in device pixels:

| Offset | 1x (12 / 13 / 14 / 16) | 2x (12 / 13 / 14 / 16) |
|---|---|---|
| 0.25em (previous) | 3 / 3 / 4 / 4 | 6 / 7 / 7 / 8 |
| 0.1em | 1 / 1 / 1 / 2 | 2 / 3 / 3 / 3 |
| **0.08em** | **1 / 1 / 1 / 1** | **2 / 2 / 2 / 3** |
| auto, from-font | 1 / 1 / 1 / 1 | 1 / 1 / 1 / 1 |

- **Chosen: 0.08em.** It matches the reference at the app's 13 and at 14 (2 device px at 2x), one clear row at 1x
  everywhere. `auto` (Geist's own position) leaves half a pixel at 2x and reads as touching the letters.
- **Trade-off:** descenders cross the line again; skip-ink parts it, as on GitHub and Wikipedia. This reverses the
  2026-10-16 choice to keep the line clear of them.

Peers that draw Link's line take the same offset: Abbreviation, Chip `link` and `link-icon`, Card action, Alert link,
Code block line numbers and toggle, Description list's "Show more", and the app's section links.

