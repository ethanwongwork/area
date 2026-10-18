# Infobox spec

**Status:** built, in review · 2026-10-17
**Captures:** computed-style readouts below (Wikipedia, en.wikipedia.org/wiki/Lisa_Su)
**Peers:** Card, Description list, Figure

## Owner decisions

- 2026-10-17: "build whatever you recommend in the order you recommend", after the Wikipedia survey (docs/COMPONENTS.md,
  "From Wikipedia"). Order: Reference list, Table of contents, Figure, Infobox, Inline list, Abbreviation, Hatnote, Navbox.

## Job and boundaries

Summarises a subject beside an article: a title, an image with its caption, and labelled facts, in titled sections. Not a property editor (Property list) and not a form.

## Sources

| Id | Type | What | Where |
|---|---|---|---|
| wikipedia | product (evidence) | Infobox on an article | en.wikipedia.org/wiki/Lisa_Su (Vector 2022 on Wikimedia's Codex), built-in browser, 2026-10-17, computed styles read in the page |
| codex | design system | Wikimedia Codex, the system Vector 2022 is built on | doc.wikimedia.org/codex (not read in detail) |

Target products searched: ChatGPT and Figma have no equivalent; Notion's equivalents (table of contents block, image
caption) were not measured this round.

## Measurements

Wikipedia, computed:

| Part | Value |
|---|---|
| box | 22em (309.76 at 14.08), 0.88 of the body (14.08 / 21.12), float right, margin 7 0 7 14; #f8f9fa with a 1px #a2a9b1 hairline |
| title | 1.25em bold, centred |
| image | centred, caption centred under it |
| section | a centred bold band on a tint (#b0c4de here) |
| rows | label bold, about 40% (120.8 of 296), value; both top-aligned |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs |
|---|---|---|---|
| box | 22em; Card's paint (surface, `border-card`, container corner, resting shadow); 12 in, parts 8 apart | Wikipedia 22em | Card's paint |
| type | small text (14 / 20) | Wikipedia 0.88 | type scale |
| title | body size, strong, centred | Wikipedia 1.25em bold | Area's heading weight |
| section band | the control fill, small corner, strong, centred | Wikipedia's tinted band | neutral paint |
| rows | label 2fr : value 3fr (40%), 12 apart, top-aligned; label in Description list's muted term ink, regular | Wikipedia's 40% | Description list's role for labelled values (Wikipedia bolds labels) |
| align | as Figure | Wikipedia floats right | — |

## Verification

- Gallery tiles at fit, light (headless Edge, 2x).
- Hover and pressed sweep with text contrast at light 100 + 4, light 90 + 8, dark 8 + 4 and dark 24 + 8: no text under 4.5:1.
- React: `packages/react/tests/articles.test.mjs`. Styles build: manifest parity, token references.
- Not checked: a screen reader; forced colours; Notion side by side.

## Review note, 2026-10-17

- **What it is:** A side card that sums up a subject: title, image, and labelled facts in sections.
- **Based on:** Wikipedia's infobox in Card's paint, with Description list's quiet labels.

## Spacing audit (2026-10-17)

Inset: 12 to the content with the border counted once, `calc(12 − border-width)`, as Popover's (11 + 1); it was 13. Measured in `docs/research/spacing-2026-10-17/` (Before / After: https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2).
