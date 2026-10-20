# Figure spec

**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Card, Infobox, Avatar

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.

## Job and boundaries

Shows an image or other media in its own shape, with an optional caption under it wrapped to the media's width. One form: no frame, no float, no alignment or ratio options (rounds 34–38). Not a gallery, lightbox or video player.

## Sources

| Id | Type | What | Where |
|---|---|---|---|
| wikipedia | product (evidence) | Figure on an article | en.wikipedia.org/wiki/Lisa_Su (Vector 2022 on Wikimedia's Codex), built-in browser, 2026-10-17, computed styles read in the page |
| codex | design system | Wikimedia Codex, the system Vector 2022 is built on | doc.wikimedia.org/codex (not read in detail) |

Target products searched: ChatGPT and Figma have no equivalent; Notion's equivalents (table of contents block, image
caption) were not measured this round.

## Measurements

Wikipedia, computed:

| Part | Value |
|---|---|
| thumbnail | `figure` as a table, float right, margin 8 0 20.8 22.4 (0.5em 0 1.3em 1.4em) |
| frame | #f8f9fa with a 1px #c8ccd1 hairline; the image 3 in with its own hairline |
| caption | 0.884em (14.14 / 19.8), padding 0 6 6, base ink, start-aligned, wraps to the image's width |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| layout | a column as wide as its media (`fit-content`, max 100%); the caption adds no width (`contain: inline-size`) | Wikipedia (a table) | the same result without table layout |
| media | any element in its own shape; an `img`, `video`, `svg`, `picture` or `canvas` takes the container corner (`radius-container`, 12 at the default Radius) | owner, 2026-10-18 ("round the corners of images") | was the small corner (6) through round 38 |
| caption | optional; UI text (`text-sm`), regular, `fg-muted`, 8 under the media, start-aligned, wraps to the media's width | Notion's caption (UI text, secondary ink); Carbon 8; round 35 | muted: the media leads |

## Verification

- Gallery tiles at fit, light (headless Edge, 2x).
- Hover and pressed sweep with text contrast at light 100 + 4, light 90 + 8, dark 8 + 4 and dark 24 + 8: no text under 4.5:1.
- React: `packages/react/tests/articles.test.mjs`. Styles build: manifest parity, token references.
- Not checked: a screen reader; forced colours; Notion side by side.

## Review note, 2026-10-17

- **What it is:** An image (or other media) with its caption under it, plain or in a frame, optionally floated beside text.
- **Based on:** Wikipedia's thumbnail, in Card's paint; the plain one is the image with a quiet caption.

## Rethink, 2026-10-17 (round 34)

Owner, round 33: "rethink": "can you look at other design systems/products examples for figure besides wikipedia, want
to keep it simple and consistent and cohesive with the system." Survey: `docs/research/articles-rethink-2026-10-17/figure-infobox.md`.
- Dropped `frame` (`plain` / `framed`, Card paint) and `align` `none | start | end` (floats).
- `align`: `start` (default, Notion, Tailwind, Carbon) or `center` (DocC, Ghost, Mintlify), the caption with it.
- `bordered`: Carbon's image hairline, `border-divider`, drawn inside the media's corner.
- Caption unchanged: small text, `fg-muted`, 8 under, wraps to the media's width.

## Review note, 2026-10-17 (round 34)

- **What changed:** Figure is now just the media and a small muted caption under it, start-aligned. The Wikipedia
  thumbnail frame and the floats beside text are gone. New: `bordered`, a 1px hairline on the media so a screenshot
  keeps its edge, and `align="center"`.
- **Why:** You asked to look past Wikipedia and keep it simple and cohesive. 6 of 7 sources draw no frame (Notion,
  Tailwind Typography, Carbon, Apple DocC, Ghost, MUI); captions sit one step under body, muted, 8 below.

## Round 35, 2026-10-17

Owner, round 34: "what is content bordered, also why is the text centered?" → both removed; Figure has one form.

| Part | Type | Ink | Space | Basis |
|---|---|---|---|---|
| media | — | — | Area's media corner (`radius-small`) | Card media |
| caption | UI text (`text-sm`), regular | `fg-muted` | 8 under the media, start-aligned, wraps to the media's width | Notion's caption is its UI text (14, as its controls) in its secondary ink; Carbon 8 |

## Review note, 2026-10-17 (round 35)

- **What changed:** Figure is now one thing: the image and a muted caption under it, starting at the left. The
  "bordered" option (a thin edge for screenshots) and the centred one are gone.
- **Why:** You asked what bordered was and why the text was centred. Neither earned its place: Notion's image captions
  start at the left and have no edge.

## Round 36, 2026-10-17

Owner, round 35: "are there other variants that need to be created? can you make the caption way more generic." Survey:
`docs/research/articles-rethink-2026-10-17/round-36-variants.md`. Added only what at least two sources ship: an optional caption (7 sources, already so), video as the media
(6), and `ratio` (`square` 1:1, `video` 16:9, cover-cropped: shadcn AspectRatio, Carbon video, Notion's crop). Not
added: wide and full-bleed widths (editorial page grids only), a caption above or over the media (one source), a
separate credit line (credit sits in the caption everywhere), a gallery row (later, if asked). Demo copy is generic.

## Review note, 2026-10-17 (round 36)

- **What changed:** The examples now use plain placeholder captions. New: an example without a caption, and a `ratio`
  option that crops the media to a square or 16:9, shown with a video.
- **Why:** You asked whether other variants are needed and for generic copy. Those are the options most other systems
  ship (shadcn, Carbon, Notion); wide or full-bleed images belong to editorial page layouts, not a component.

## Round 37, 2026-10-17

Owner, round 36: "should there be a real video component with its own design player controls?" → yes, as its own
family: a player is a control (play, scrub, time, volume, fullscreen), not a figure. Figure keeps any media; its
`ratio="video"` tile now shows an image cropped to 16:9, since the browser's native player controls are not Area's.
Proposed next (owner to start): a Video player built from YouTube's, Vimeo's, Loom's and Notion's players.

## Review note, 2026-10-17 (round 37)

- **What changed:** The 16:9 example is an image cropped to a video's frame, not the browser's own player.
- **Why:** You asked whether video should have its own player with designed controls. Yes, as a separate component;
  the browser's controls didn't look like Area. Say if you want it built next.

## Round 38, 2026-10-17

Owner, round 37: "maybe change the name to just different ratio, not specific to video. in that case is it really
necessary to have? eventually i want this to be an actual video right?" → `ratio` removed: the media keeps its own shape,
and a cropped image is the app's to make. A video will be Area's own player inside a Figure, when the owner starts it.

## Review note, 2026-10-17 (round 38)

- **What changed:** The ratio option is gone; Figure is the media in its own shape and an optional caption.
- **Why:** You asked whether it was needed. Without video it only cropped images, which the image itself can do; a real
  video player will come as its own component and sit inside a Figure.

## Feedback log

- 2026-10-18 · owner: "can you round the corners of images to something by default" → by size: a standalone image takes the container corner (12 at the default Radius; was the small corner, 6), a thumbnail keeps 6 → `figure.css`. Same rule in Asset card and the Brand viewer (asset-card.md).
