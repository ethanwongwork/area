# Figure spec

**Status:** built, in review · 2026-10-17
**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Card, Infobox, Avatar

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.

## Job and boundaries

Shows an image or other media with its caption, the caption wrapped to the media's width; optionally framed, optionally floated beside text. Not a gallery or lightbox.

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
| layout | a column as wide as its media; the caption adds no width (`contain: inline-size`) | Wikipedia (a table) | the same result without table layout, so the frame and its shadow wrap the caption too |
| caption | small text (14 / 20), muted, 8 under the media | Wikipedia 0.884em | muted: the media leads (plain) |
| framed | Card's paint: surface, `border-card`, container corner, resting shadow; media 4 in at the concentric corner; caption in the body ink, 6 / 4 / 2 | Wikipedia's thumbnail | Area's card paint for a framed surface |
| align | `end` / `start`: floated, 24 from the text, 16 above what follows | Wikipedia 1.4em / 1.3em | Area's spacing |

## Verification

- Gallery tiles at fit, light (headless Edge, 2x).
- Hover and pressed sweep with text contrast at light 100 + 4, light 90 + 8, dark 8 + 4 and dark 24 + 8: no text under 4.5:1.
- React: `packages/react/tests/articles.test.mjs`. Styles build: manifest parity, token references.
- Not checked: a screen reader; forced colours; Notion side by side.

## Review note, 2026-10-17

- **What it is:** An image (or other media) with its caption under it, plain or in a frame, optionally floated beside text.
- **Based on:** Wikipedia's thumbnail, in Card's paint; the plain one is the image with a quiet caption.
