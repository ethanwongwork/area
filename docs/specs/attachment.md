# Attachment spec

**Captures:** none live (the owner declined test uploads to ChatGPT; BASELINE.md). Evidence: `docs/research/inspector-chat-2026-10-18/composer-additions.md`, section B.
**Peers:** Composer (its context row and corner), Chip `input` (non-image files), Spinner (`value`), Code block's frame edge

## Job and boundaries

An image attached to a message before it is sent, in the Composer's context row: its thumbnail, a remove control on
its corner, and its upload's progress or failure. Files that are not images are Chip `input` pills with a document
icon (Cursor inserts them as mentions, Claude Code as 24px pills); a large file card (Codex's 160 × 122) is not built.
How a sent message shows its images is a Message question, not this one.

## Variants

| Axis | Value | Justification | Where |
|---|---|---|---|
| status | ready, uploading, error | the upload's life | Codex (progress overlay, failure toasts); Cursor and Claude Code show none |

## Sources

Cursor `PromptInputImageAnnotation.js`, `PromptInputAttachmentGrid.js`, `OverlayBadge.js`; Claude Code
`.thumbnailAttachment`, `.removeButton`; Codex composer attachments (`app-initial-*.js`). Citations in the evidence file.

## Decisions

| Slot | Area | Basis | Differs because |
|---|---|---|---|
| size | 64 × 64 | Cursor 64 (Claude Code 48 tall, Codex 122) | the IDE panel is the context; 122 is half the Inspector |
| corner | the Composer's button corner (its corner less its inset) | Codex: composer radius − inset | concentric with the shell |
| edge | the card edge at stroke-width, an inset outline over the picture (as Color swatch's ring) | Cursor stroke 72%, Claude Code input border, Codex inset ring | an outline snaps to device pixels where an inset box-shadow does not (MOTION.md, Crispness 3) |
| remove | a 20 square inside the top-end corner, 4 in, its corner the tile's less that inset (concentric); Video player's glass (the surface at 72% under blur(16px) saturate(150%), a white 12% hairline at border-width), the light ink; hover adds white 12%, press 20%; a control-sm target; on hover / focus, always on touch | Codex 20; Cursor and Claude Code 16; Video player's on-media controls | rounds 51 and 52: one treatment, inset, a button's shape (was a 16 disc in the inverse paint, 4 past the corner, with a 1px ring) |
| uploading | the surface at 60% over the picture, a Spinner ring at the progress | Codex: media background 50% + blur, 24 spinner, percentage | no blur (a material question) |
| error | the fields' invalid edge (`input-invalid-color`, as Input and File upload) and a danger mark; the reason as the tooltip and the mark's name | Codex toasts the failure | the tile itself says it failed; one invalid edge across Area |

## Behavior and accessibility

A group named by the file; the remove button is named by `dismissLabel` ("Remove {name}" by default) and shows when
`onDismiss` is passed (`onRemove` stays as a deprecated alias for one release; `onDismiss` wins); uploading sets aria-busy and the ring says "Uploading
{name}, N%"; a failure is an image named by its reason. The Chat view takes images from paste and drop.

## Feedback log

- 2026-10-19 · built (chat additions, after round 49).
- 2026-10-19 · owner, round 50 (rethink): "fix the close button hover, is that the appropriate treatment or should the x be inset ontot the container" → round 51 coherence pass (below).
- 2026-10-19 · owner, round 51 (needs changes): "should the button not be round, and actually follow the corner radius of buttons? i prefer just 1 treatment, either inset or on the corner. go with your rec" → round 52 (below).
- 2026-10-19 · audit: Decisions rewritten to the code (the 20 square in glass, 4 inside the corner); the edge is an inset
  outline at stroke-width (was an inset box-shadow); the error edge is `input-invalid-color` (was fg-danger);
  `onRemove` → `onDismiss` + `dismissLabel` (deprecated alias kept); the veil and glass literals moved into
  `/* spec */` properties; the demo's file names use the placeholder copy.

## Review note, 2026-10-19

- **What changed:** new: an image attached in the composer, with a remove button on its corner, a ring while it uploads
  and a red edge if it fails.
- **Why:** Cursor, Claude Code and Codex all show pasted images in the composer before sending; sizes follow Cursor's,
  the corner follows the composer's.

## Round 51 coherence pass (2026-10-19)

Owner: "fix the close button hover, is that the appropriate treatment or should the x be inset onto the container".
Inset: the control now sits inside the top-end corner (4 in), so it never hangs over a wrapping or scrolling row. It is
a control over media, so it takes Video player's on-media paint (round 46/47, approved): Area's dark surface at 72%
under blur, a white 12% hairline, the light ink; hover adds a white 12% tint and press 20%, as the player's buttons do
(it had no hover or press before). A 20 disc (Codex 20) in a 24 target; focus ring on the disc.

## Review note, 2026-10-19 (round 51)

- **What changed:** the remove button now sits inside the image's corner, in the same dark glass as the video player's
  controls, and it lightens when you point at or press it.
- **Why:** you asked; inside the corner it never hangs off the edge, and Area already has one look for buttons over
  pictures.

## Round 52 (2026-10-19)

One treatment, inset (owner: "i prefer just 1 treatment … go with your rec"): inside the corner it never hangs over a
row that wraps or scrolls, and it is where Area's other controls over media sit (Video player). The disc is now a
button's shape: 20 square (Area's smallest control at the default type, fixed as the 64 tile is), its corner the tile's less the 4 inset, so the two corners are
concentric; at the default that is 4, Button's own corner at 20 (owner: "follow the corner radius of buttons").

## Review note, 2026-10-19 (round 52)

- **What changed:** the remove button is a small rounded square instead of a circle, its corner matched to the image's
  corner; it stays inside the image.
- **Why:** you asked for a button's corner and one placement; inside the corner is Area's place for controls over
  pictures.

## Review note, 2026-10-19 (round 55, design-system audit)

- **What changed:** The thumbnail's edge is a crisp inset outline instead of a shadow, and a failed upload's edge uses the fields' invalid red. Remove is now `onDismiss` with a `dismissLabel` (the old `onRemove` still works).
- **Why:** MOTION.md asks for outlines, which snap to whole pixels; every other failed field uses `input-invalid-color`; GOVERNANCE names close actions `onDismiss`.
