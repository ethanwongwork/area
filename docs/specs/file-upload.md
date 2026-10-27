# File upload spec

**Captures:** `docs/research/captures/file-upload/`
**Peers:** Input (the field edge and its invalid paint), Link (the action), Progress (the bar), Button ghost sm (remove, retry), Tag picker (a field that takes several values), Card (a framed surface)

## Owner decisions

- 2026-10-09: "move on to the next component" after Scroll area: FileUpload, the last item in the list the owner chose from.
- 2026-10-09: no test attachment in ChatGPT (it would upload a file to the owner's account even unsent); build from
  Untitled UI and Area's own parts, and record ChatGPT's card as not captured.
- 2026-10-09: the open questions go with the recommendations: the zone keeps the field's edge, rows keep `document`
  until the icon review settles it, and a Composer attachment chip waits for a measured ChatGPT card.

## Job and boundaries

File upload takes files by click or drag and drop (`FileUpload`), and shows each file's upload (`FileUploadList`,
`FileUploadItem`): name, size, progress, then complete or an error with retry, and remove. It does not upload: the
consumer sends the files and reports progress. Not a Composer attachment chip (a compact chip inside the field; a later
Composer composition), not an image gallery, not a document list.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| zone state | dragging, invalid, disabled | Files over the zone; a rejected file; unavailable | Untitled UI (disabled, max size); Input's invalid |
| item status | uploading, complete, error | The three stages of an upload | Untitled UI progress-bar rows (uploading, complete), its error rows |
| item content | size, progress (or unknown length), error message | | Untitled UI |
| behavior | accept, maxSize, multiple, name | The input's own filters, checked again on drop (a drop bypasses `accept`) | Untitled UI "Accept image only", "Max size limit" |

Excluded: Untitled UI's "progress fill" rows (a filled row as the progress; one bar style is enough), its file-type
illustrations (Area draws one `document` glyph; a type icon is the `icon` prop), a dashed edge (Mantine, Ant; Untitled,
the primary system, is solid), an image preview grid.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (rendered) | File upload with progress bar rows | untitledui.com/react/components/file-uploaders, 2026-10-09 | MIT | computed readout (below); the save from the public page was blocked by the pane |
| chatgpt | target product | Attachment card | searched the 10 most recent chats (owner's Chrome, read-only): none has an attachment | evidence only | not captured (owner declined a test upload) |
| notion, figma | target products | — | no upload surface without creating data (Notion's file block, Figma's import) | — | not searched further |
| area | this system | Every gallery tile at 1:1 | localhost gallery | — | `area--*` (8) |

**Untitled UI readout** (2026-10-09, computed styles): zone 512 × 126, padding 16 / 24, corner 12, a 1px inset ring
(`ring-secondary`), white, content centred in a column 12 apart; a 40 icon tile (corner 8) with a 20 glyph; "Click to
upload" 14/20 600 in the brand purple rgb(105, 65, 198), "or drag and drop" 14/20 400 tertiary; hint 12/18. Row 512 × 98,
padding 16, corner 12, the same ring, 12 gap; a 40 file-type illustration; name 14/20 500 in the stronger ink; size and
status 14/20 400 tertiary split by a 1 × 12 rule 8 apart; remove 28 (6 padding, corner 6, a 16 glyph, quaternary ink);
bar 8 tall, corner 6, track lab 90.95 (≈ #e5e5e5), fill brand; percentage 14/20 500, 12 after the bar.

## Anatomy

```
area  div.area-file-upload (the zone: edge, corner, column, 12 gap)
        span.__icon (40 tile, 20 upload glyph) · div.__text > p.__prompt (button.area-link.__action + text) · p.__hint
        input[type=file].__input (display none; opened by the zone and the button)
      ul.area-file-upload-list (12 gap)
        li.area-file-upload-item--{uploading,complete,error} (edge, corner, 16 padding, 12 gap)
          span.__icon (40 tile, 20 document glyph)
          div.__body > div.__header > div.__text (p.__name, p.__meta: size · rule · span.__status[role=status]) + div.__actions (Buttons)
                       div.__progress (Progress lg + span.__percent)
```

Insets: zone 1 border + 16 / 24 padding (Untitled 16 / 24 inside its 1px ring); row 1 + 16 (Untitled 16 inside its ring);
the actions sit on the name's line: (20 − 28) / 2 = −4 from the text top.

## Measurements

Generated with `node scripts/capture-compare.mjs docs/research/captures/file-upload/area--default--rest--light.json` (zone)
and `…/area--content-uploading--rest--light.json` (row).

| slot · property | area · default · rest · light |
|---|---|
| **shell** size | 384 × 126 |
| **shell** padding | 16 24 16 24 |
| **shell** border | 1 solid color(srgb 0.886275 0.886275 0.886275) |
| **shell** radius | 12px |
| **shell** gap (row / column) | 12px / 12px |
| **shell** font | 14px/20px 400 Geist |
| **shell** color | rgb(102, 102, 102) |
| **shell** background | rgb(255, 255, 255) |
| **icon** size | 40 × 40 |
| **icon** edge from shell (t r b l) | 17 172 69 172 |
| **icon** padding | 0 |
| **icon** border | 1 solid color(srgb 0.886275 0.886275 0.886275) |
| **icon** radius | 10px |
| **icon** background | rgb(255, 255, 255) |
| **action** size | 99.02 × 20 |
| **action** edge from shell (t r b l) | 69 197.31 37 87.67 |
| **action** padding | 0 |
| **action** border | 0 |
| **action** radius | 2px |
| **action** font | 14px/20px 500 Geist |
| **action** color | color(srgb 0.156863 0.156863 0.156863) |
| **hint** size | 208.65 × 16 |
| **hint** edge from shell (t r b l) | 93 87.68 17 87.67 |
| **hint** padding | 0 |
| **hint** border | 0 |
| **hint** radius | 0px |
| **hint** font | 12px/16px 400 Geist |
| **hint** color | rgb(102, 102, 102) |

| slot · property | area · content-uploading · rest · light |
|---|---|
| **shell** size | 384 × 98 |
| **shell** padding | 16 |
| **shell** border | 1 solid color(srgb 0.886275 0.886275 0.886275) |
| **shell** radius | 12px |
| **shell** gap (row / column) | 12px / 12px |
| **shell** font | 14px/20px 400 Geist |
| **shell** color | rgb(40, 40, 40) |
| **shell** background | rgb(255, 255, 255) |
| **icon** size | 40 × 40 |
| **icon** edge from shell (t r b l) | 17 327 41 17 |
| **icon** padding | 0 |
| **icon** border | 1 solid color(srgb 0.886275 0.886275 0.886275) |
| **icon** radius | 10px |
| **icon** background | rgb(255, 255, 255) |
| **name** size | 266 × 20 |
| **name** edge from shell (t r b l) | 17 49 61 69 |
| **name** padding | 0 |
| **name** border | 0 |
| **name** radius | 0px |
| **name** font | 14px/20px 500 Geist |
| **name** color | rgb(40, 40, 40) |
| **meta** size | 266 × 20 |
| **meta** edge from shell (t r b l) | 37 49 41 69 |
| **meta** padding | 0 |
| **meta** border | 0 |
| **meta** radius | 0px |
| **meta** gap (row / column) | 8px / 8px |
| **meta** font | 14px/20px 400 Geist |
| **meta** color | rgb(102, 102, 102) |
| **remove** size | 28 × 28 |
| **remove** edge from shell (t r b l) | 13 17 57 339 |
| **remove** padding | 0 |
| **remove** border | 1 solid rgba(0, 0, 0, 0) |
| **remove** radius | 6px |
| **remove** gap (row / column) | 6px / 6px |
| **remove** font | 14px/20px 500 Geist |
| **remove** color | oklab(0.451918 0.0000205655 0.0000090301) |
| **progress** size | 248.31 × 8 |
| **progress** edge from shell (t r b l) | 67 66.69 23 69 |
| **progress** padding | 0 |
| **progress** border | 0 |
| **progress** radius | 9999px |
| **progress** background | color(srgb 0.886275 0.886275 0.886275) |
| **percent** size | 37.69 × 20 |
| **percent** edge from shell (t r b l) | 61 17 17 329.31 |
| **percent** padding | 0 |
| **percent** border | 0 |
| **percent** radius | 0px |
| **percent** font | 14px/20px 500 Geist |
| **percent** color | rgb(40, 40, 40) |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| zone · padding / gap / corner | 16 / 24, 12, `radius-surface` (12) | Untitled UI 16 / 24, 12, 12 | — |
| zone · edge | 1px `input-edge`, `input-edge-hover` on hover | Untitled's 1px ring; peer Input (a field that takes a value) | The field's edge rather than Untitled's lighter ring, so a zone beside a field matches it |
| zone · dragging | `selection-edge` and the row plate `bg-component-hover` | Shared state paint (selection role; row plate) | Untitled's dropping style not read |
| zone · invalid | `input-invalid-color` edge | Peer Input | — |
| zone · icon tile | 40 (`control-lg`), corner `radius-control-lg`, field edge, 20 glyph muted | Untitled 40 tile, 20 glyph | Corner 10 (a 40 control's) rather than 8 |
| action | Link (inline, `action` ink) at weight 500, on a button | Peer Link; Untitled's emphasised link | Untitled's brand purple at 600; Area's Action role, its strong weight |
| hint | 12/16 muted (Area's caption) | Untitled 12/18 | Area's caption leading |
| row · padding / gap / corner / edge | 16, 12, 12, the zone's edge | Untitled UI | — |
| row · name | 14/20 500 default ink, one line | Untitled | — |
| row · meta | 14/20 muted, a 1 × 12 `border-subtle` rule 8 apart, tabular numbers | Untitled | — |
| row · bar | Progress `lg` (8), the selection fill, percentage 12 after, 14/20 500 | Untitled 8 bar, 12 gap; peer Progress | Fill is Area's selection role (neutral by default), not Untitled's brand |
| row · actions | ghost Buttons sm (28): dismiss (cancel or remove), reset (retry) | Untitled 28 remove; peer Button | Untitled's trash glyph; Area's dismiss reads as cancel and remove |
| row · complete / error | status in `fg-success` with a check / in `fg-danger`; the error row takes the invalid edge | Untitled's complete and error rows; peer Input | — |

## States

| State | Changes | Evidence |
|---|---|---|
| zone hover | edge `input-edge-hover` | CSS (pointer not captured) |
| zone dragging (`data-dragging`) | selection edge, row plate | `area--state-dragging--rest--light`; gallery: a simulated drop set it and cleared it on drop |
| zone invalid / disabled | invalid edge / 50%, not-allowed | `area--state-invalid`, `area--state-disabled` |
| row uploading / complete / error | bar and percentage / check and Complete / message, retry, invalid edge | `area--content-*` |
| action focus | 2px focus ring at offset 2 (Link's) | gallery, real Tab |

## Behavior and accessibility

The zone's button ("Click to upload", described by the hint) is the keyboard and assistive-tech handle; a click anywhere
else in the zone opens the same picker, and a drop on it takes the files. The file input is hidden (`display: none`,
`aria-hidden`), named by `name` for forms. A drop is checked against `accept`, `maxSize` and `multiple` like the picker;
rejections come back through `onReject` with the reason. Each row's status is a polite live region (Uploading…, Complete,
the error), the bar is a named `progressbar`, and the buttons are named for their file ("Cancel upload of …", "Remove …",
"Retry …"). Disabled stops the picker and drops.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match |
|---|---|---|---|---|
| Input | field edge, invalid edge | `input-edge`, `input-invalid-color` | the same | match (harness, side by side) |
| Link | the action | inline, underline at 40% | the same, Action ink, 500 | match |
| Progress | bar | lg 8, selection fill | the same | match |
| Button | row actions | ghost sm 28 | the same | match |

## Visual pass

Harness at 1:1 (server-rendered states with `dist/area.css`), light and dark, beside an Input and a ghost Button: the zone
and rows share the field's edge; the dragging plate reads in both themes; the error row's edge and message are the field's
invalid red. Fixed during the pass: the prompt's text was two text nodes, which server rendering split with a comment.

## Verification

- 8 Area captures; checksums verified. Untitled UI as a readout.
- Build (parity, token refs), typecheck, React tests (5 new in `file-upload.test.mjs`), contracts, consumer, `npm test`,
  `lint:icons` (`upload`, `document`, `reset` added to the package glyphs), `build:docs`, `git diff --check`.
- In the gallery: a simulated drop of a 2.4 KB PDF and an 11 MB video added an uploading row that completed and an error
  row ("Over 10 MB"); the drag state set on dragenter and cleared on drop; clicking the zone and the button each opened the
  picker once (input `click` stubbed, no dialog opened); the disabled zone opened nothing; the action takes the focus ring.
- Unverified: a real file dialog and a real drag from the desktop, a screen reader, touch, ChatGPT's attachment card.

## Open questions

Resolved 2026-10-09 (owner: "go with your recommendations"):
1. The zone keeps the field's edge, so a zone in a form matches its fields.
2. Rows keep the `document` glyph until the icon review settles it.
3. A Composer attachment chip is later work, measured once a ChatGPT test attachment is allowed.

## Review note, 2026-10-09

- **What changed:** The remove and retry buttons now sit 8px from the row's top and 8px from its side, evenly. Before, they sat 12px from the top and 16px from the side. Everything inside the zone and the rows now starts 16px from the outside (it was 17, because the 1px border was counted on top of the padding). The size line sits 2px under the file name, as in Untitled UI.
- **Why:** You said the inset around the buttons looked unequal and asked for every gap to be accurate; Untitled UI pulls its button 8 up and 8 in, and counts its edge once.

## Review note, 2026-10-17 (round 33)

- **What changed:** Only the underline on the upload link: it now sits close under the words, about 1px below the letters,
  instead of 0.25em down. Tails of g, y and p cross it and the line breaks around them. Nothing else changed.
- **Why:** It follows Link, which you asked to underline "very natural and close to the text" (link.md, "Close
  underline").

## Lines (current, 2026-10-25)

The item's separator between size and status paints `border-decorative` (#f3). Was `border-subtle`, darker than every other separator. This supersedes any older line value below (owner 2026-10-25: "Build everything as proposed on the dividers page, removing the footer line but keeping the line under the Command palette's search" (comparison https://claude.ai/artifact/3Fc3sXEgfKJmHEf2arA9hE; docs/research/dividers-2026-10-25)).

## Feedback log

- 2026-10-25 · owner 2026-10-25: "Build everything as proposed on the dividers page, removing the footer line but keeping the line under the Command palette's search" (comparison https://claude.ai/artifact/3Fc3sXEgfKJmHEf2arA9hE; docs/research/dividers-2026-10-25) → The item's separator between size and status paints `border-decorative` (#f3). Was `border-subtle`, darker than every other separator.

- 2026-10-09 · owner: "move on to the next component" → File upload built from Untitled UI and Area's parts; owner declined a
  ChatGPT test upload → 8 captures, gallery tiles, in review.
- 2026-10-09 · owner: "go with your recommendations" → open questions resolved as recommended; no code change.
- 2026-10-09 · owner, review round 2 (rethink): "padding around buttons inset doesnt look equal, make sure gaps,
  padding, margins, are all accurate" → actions 8 from the top and side (Untitled -mt-2 -mr-2,
  was 12 / 16); zone and row padding net of the border (16 / 24 from outside, was 17 / 25); size line 2 under the name
  (Untitled mt-0.5) → file-upload.css.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the zone, row and icon tile edges are at `stroke-width`, the field's (were `border-width`, so under Elevated the zone was a borderless white box) (file-upload.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-14 · owner: "do the integrations" (the icon session's component integrations) → the demos pass a file-type
  icon from `@area/icons` through `icon` (file-pdf, file-image, file-video, file-audio, file-spreadsheet, file-zip,
  file-code by extension or MIME type; anything else keeps the `document` glyph). The slot's 20 box and the size curve
  are unchanged (measured line 0.924 at type 13, the same as the zone's upload glyph). No component change.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

## Review note, 2026-10-26

- **What changed:**
  - The line between size and status is the lightest grey, #f3 (it was darker than every other separator).
  - The file item's Remove and Retry buttons take a corner of 4: the item's 12 corner less the 8 they sit in from its
    edge, so their curve runs parallel to the item's (they kept the small button's own 6).
- **Why:** you asked for dividers only where they are needed and intended, and for the ones that stay to be very
  light (approved on the dividers page). In round 72 you asked whether the padding and corner pair is correct. The
  item's pair (12 corner, 16 padding) is Untitled UI's and stands; the file icon sits 16 in, past the 12 curve, so it
  keeps the 40 control's corner, as content does. The buttons sit 8 in, inside the curve, so their corners must be
  concentric (Edit summary's rule).
