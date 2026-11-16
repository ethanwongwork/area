# Attachment spec

**Captures:** none live (the owner declined test uploads to ChatGPT; BASELINE.md). Evidence: `docs/research/inspector-chat-2026-10-18/composer-additions.md`, section B; `docs/research/components-audit-2026-11-07/chat-apps.md` (kinds, V10).
**Peers:** Composer (its context row and corner), Chip `input` (files mentioned as context), Spinner (`value`), Code block's frame edge, File upload item (`onRetry`, the upload's announcement), Badge (`size="sm"`), Video player (the on-media glass)

## Job and boundaries

Something attached to a message before it is sent, in the Composer's context row: an image, a file, a quote (pasted
or quoted text) or a video, with a remove control on its corner and its upload's progress or failure. A file the
message only refers to (an @ mention) stays a Chip `input` pill with a document icon (Cursor inserts them as mentions,
Claude Code as 24px pills); Attachment is what is sent with the message. How a sent message shows what it carried (the
reference wraps the tiles to the end above the bubble) is a Message question, not built yet.

## Variants

| Axis | Value | Justification | Where |
|---|---|---|---|
| kind | image (default), file, quote, video | what is sent: the reference's `MessageAttachments` = Image, Video, File, Quote | the Claude app (`shared-3-IQTrO7Gx.js`, chat-apps.md); Codex's file card |
| status | complete (default), uploading, error; `ready` a deprecated alias of complete | the upload's life, in the shared status words (Governance § 4; File upload item's three) | Codex (progress overlay, failure toasts); the Claude app (pending, ready, failed); Cursor and Claude Code show none |

## Sources

Cursor `PromptInputImageAnnotation.js`, `PromptInputAttachmentGrid.js`, `OverlayBadge.js`; Claude Code
`.thumbnailAttachment`, `.removeButton`; Codex composer attachments (`app-initial-*.js`). Citations in the evidence file.
The kinds: the Claude app 4.16336.0, `ion-dist.asar` › `assets/v1/shared-3-IQTrO7Gx.js` (`MessageAttachments{Image,
Video, File, Quote}`; props `name, description, removeLabel, retryLabel, failedLabel, badge, badgeTooltip, state`, state
`pending | failed`; a 120 square tile `size-[7.5rem]`; File: the name `line-clamp` 4 / 3 / 2, the badge its extension
upper-cased by default; Quote: a `w-[3px] rounded-full bg-border` rule `gap-xs` (8) beside a `blockquote`, cut to 240
characters, `line-clamp` 6 / 5 / 4; Video: a `PlayFilled` round button over the poster; failed: a bottom strip, the
words in the danger ink and Retry; pending: a skeleton over the tile).

## Decisions

| Slot | Area | Basis | Differs because |
|---|---|---|---|
| size | 64 × 64 | Cursor 64 (Claude Code 48 tall, Codex 122) | the IDE panel is the context; 122 is half the Inspector |
| corner | the Composer's button corner (its corner less its inset) | Codex: composer radius − inset | concentric with the shell |
| edge | the card edge at stroke-width, an inset outline over the picture (as Color swatch's ring) | Cursor stroke 72%, Claude Code input border, Codex inset ring | an outline snaps to device pixels where an inset box-shadow does not (MOTION.md, Crispness 3) |
| remove | a 20 square inside the top-end corner, 4 in, its corner the tile's less that inset (concentric); Video player's glass (the surface at 72% under blur(16px) saturate(150%), a white 12% hairline at border-width), the light ink; hover adds white 12%, press 20%; a control-sm target; on hover / focus, always on touch | Codex 20; Cursor and Claude Code 16; Video player's on-media controls | rounds 51 and 52: one treatment, inset, a button's shape (was a 16 disc in the inverse paint, 4 past the corner, with a 1px ring) |
| uploading | the surface at 60% over the picture, a Spinner ring at the progress | Codex: media background 50% + blur, 24 spinner, percentage | no blur (a material question) |
| error | the fields' invalid edge (`input-invalid-color`, as Input and File upload) and a danger mark under the veil; the reason as the tooltip and the mark's name; with `onRetry`, a ghost neutral sm icon Button with the reset glyph beside the mark, named "Retry {name}" (File upload item's retry), 4 apart | Codex toasts the failure; the reference's failed strip with Retry | a strip of words does not fit a 64 tile, so every kind keeps one treatment: the mark and Retry over the veil |
| kinds' size | image and video 64 square; file and quote 64 tall and 160 wide (2.5 × the tile) | Cursor's 64 tile; Codex's 160 file card | the reference's 120 square tile is twice the composer row Area measured; one row height keeps images and files on a line |
| file | 8 in (the reference's gap-xs); the icon (`icon`, an `@area/icons` file icon; a document glyph by default) at 16 on the name's first line, 6 before it, in the muted ink; the name text-sm (12/16) in the default ink, up to 3 lines (2 above a badge); the badge a Badge `size="sm"`, its extension upper-cased by default (`null` for none), at the bottom start; the whole name as the tooltip; the words keep 16 clear of the remove control | the reference's File tile (name over badge, extension badge); FileUploadItem's icon slot | lines: 48 of text room at 16 (the reference clamps 4 on 120) |
| quote | 8 in; a 3 rule in the dividers' edge, 8 before the words; the words text-sm in the muted ink, cut to 240 characters with an ellipsis, up to 3 lines (2 above a badge); the whole text as the tooltip | the reference's Quote tile | the rule takes the Dividers stroke group (`edge-dividers`), Area's rule ink |
| video | the poster (`src`) under a 20 round play mark at the middle (play-filled at 12; the remove control's 20, so it clears the length under it), hidden with the length while it uploads or failed and its length (`badge`) in the bottom-end corner, 4 in, a 16 tall label 4 across on the tile's corner less the inset, text-sm with tabular figures; both on Video player's glass, which the remove control wears too; no poster shows the ground | the reference's Video tile (play over the poster); Video player's glass | it does not play in the composer, so the mark is not a button |
| upload result | said through the shared announcer when the upload ends: "{name}: Complete" or "{name}: {error}" ("Upload failed" by default), politely | File upload item's announcement; DESIGN_SYSTEM.md "Announcements" | — |

## Behavior and accessibility

A group named by the file (a file's visible name is `aria-hidden`, so it is said once); the remove button is named by
`dismissLabel` ("Remove {name}" by default) and shows when `onDismiss` is passed (`onRemove` stays as a deprecated
alias for one release; `onDismiss` wins); uploading sets aria-busy and the ring says "Uploading {name}, N%"; a failure
is an image named by its reason, and Retry (from `onRetry`) is named "Retry {name}"; the upload's end is said through
the shared announcer. The Chat view takes images from paste and drop.

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

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.
- 2026-11-01 · owner ("Yes, fix fills", colour system study, docs/research/color-system-2026-11-01): the tile's ground painted `bg-subtle`, which equals the page at Layer contrast 0 (the default) → `bg-well` (#f9f9f9 / #161616 at Layers 0), so an image with transparency sits on a visible ground.

### 2026-11-07 · One dismiss API and part (system gaps C4)

- **What changed:** the remove control's part is `area-attachment__dismiss` (was `__remove`).
- **Why:** one dismiss API and one part name across the families that close or remove (Governance § 4; owner picked Build on the system gaps review, 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-07 · Kinds, Retry and complete (components audit V10)

- **What changed:** an attachment can be a file (its icon, name and type), a quote (pasted text beside a rule) or a
  video (its poster, a play mark and its length) beside the image; a failed tile offers Retry when `onRetry` is passed;
  the upload's end is said to screen readers; `ready` is now `complete` (the old word still works). The image tile is
  unchanged. Reopened from Complete.
- **Why:** Attachment showed images only, while the reference app attaches files, quotes and videos with a Retry
  (chat-apps.md); the shared status words say `complete` (Governance § 4). The owner took every recommendation of the
  components audit (2026-11-07).
- **Not measured here:** the reference's 120 tile is not used (see Decisions, kinds' size); the reference's pending
  skeleton is Area's `uploading` ring, the family word Governance lists for that activity.
- **Verdict:** awaiting the owner.

### 2026-11-11 · Ink, dark and colour (system plan, Phase 1)

- **What changed:** The failure mark reads `fg-danger-mark` (plan A3.4, finding T10): a tone glyph takes the mark ink, a step brighter in light than the words' ink.
- **Why:** docs/research/system-evaluation-2026-11-11 (README §5); the owner took every recommendation on 2026-11-11.
- **Verdict:** awaiting the owner.

## Corner and the frame recipe (plan B1.1 hand-over), 2026-11-14

Attachment keeps its own corner: in a Composer, the Composer's action corner (every button's there, owner round 52:
"follow the corner radius of buttons"); standing alone, the medium control's. The frame recipe's *nested* role floors at
the row corner rather than the control corner, so it differs from a button's beside it in the Composer at some types;
the attachment stands with the buttons it sits beside, so it stays on theirs.

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- The quote's rule-to-text gap is `ui-cluster` (6 / 8 / 10). Values at type 13 Compact / Default / Comfortable; unchanged at the default. Listed, not moved: the head's icon-to-name gap 6 (the row role, `ui-cluster`, is 8 at the default).
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.

## State paint (plan B7.11), 2026-11-14

- The remove hides only inside `@media (hover: hover)`; the `(hover: none)` rule is gone.
