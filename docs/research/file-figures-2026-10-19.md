# File figures, 2026-10-19

Owner, on File tile: "consistent, simple, no need for text and icons, preferably just icons. or if images need their
own custom visual, to add to folders, so that theres a whole family"

**Cause.** The demos (`apps/desktop/src/content/demos/file-explorer.tsx`) give File page two different inputs: the PDF
tile passes `FilePdfIcon`, itself a page with "PDF" letters, and no `label`; the DOCX tile passes `DocumentIcon`, also a
page, plus `label="DOCX"`. Each draws a page inside a page, and only one prints text. Nothing says the glyph must be a
content mark rather than a `file-*` page icon.

## Survey

| Product | Shape | Mark | Ext. text | Colour per type | Images |
|---|---|---|---|---|---|
| macOS Finder 27.2 (live `NSWorkspace` render, this session) | one page for every type | grey glyph (picture, A-lines, camera, waveform, zipper); PDF: the default app's icon | yes, every type | no | thumbnail (`showIconPreview = 1`); Pictures / Music folders carry an embossed symbol (`PicturesFolderIcon.icns`) |
| Google Drive type icons | one rounded square | white knockout glyph; PDF's glyph *is* the letters | no separate text | yes | thumbnails, type icon by the name ([help](https://support.google.com/drive/answer/2375177); icons `drive-thirdparty.googleusercontent.com/128/type/<mime>`) |
| Fluent `react-file-type-icons` (MIT) | page for documents (one shared path); a 38 × 38 **frame** (of 48, corner 1.5) for photo, video, audio | lines + one coloured mark | no | yes | `photo` = frame with mountain + sun ([FileTypeIconMap.ts](https://github.com/microsoft/fluentui/blob/master/packages/react-file-type-icons/src/FileTypeIconMap.ts); CDN `assets/item-types/48/*.svg`) |
| Atlassian `@atlaskit/icon-file-type` 7.0.0 (Apache-2.0) | one rounded square (r 3/24) | white glyph; `pdf-document` uses letterforms | no | yes | `image` glyph ([package](https://atlaskit.atlassian.com/packages/media/icon-file-type)) |
| ChatGPT Library (`captures/card/chatgpt--library-*`) | none: glyph on the tile | one 40 glyph (PDF: a mark over P-D-F paths, red) | no separate text | yes | the image fills the tile (`object-cover`), no glyph |
| Figma file browser (`captures/card/figma--file-card*`) | 16:9 thumbnail | 16 product icon beside the title | no | product colours | thumbnail |
| Notion gallery | card | emoji or page glyph | no | no | page cover / first image ([help](https://www.notion.com/help/galleries)) |
| Dropbox web | per-type icons | — | unverified | unverified | thumbnails for image, video, PDF ([2017 redesign](https://9to5mac.com/2017/04/04/dropbox-rolling-out-all-new-user-interface-on-the-web/)) |
| Box web | stock type image | — | unverified | unverified | thumbnails (images, video, documents) ([Box](https://support.box.com/hc/en-us/articles/360052805913)) |

Also: Apple Files (iOS) follows Finder (previews via `QLThumbnailProvider`); OneDrive uses Fluent's set; Primer Octicons
put an inner mark in a 16 / 24 page (`file-code`, `file-media`, `file-zip`), no text, no large figure; Linear: no public
source found (unverified).

**Read-across.** Only Finder pairs glyph and text, for every type. Everyone else uses one mark per type; where letters
are needed (PDF), they are the glyph. Colour per type is common, but not in Finder or Area's outline look. Every product
shows an image as itself; Fluent alone gives media its own frame shape, the "family" the owner describes.

## Recommendation

1. **One page, one glyph, no text.** File page draws only a content mark, never a `file-*` page icon (no page in a
   page). Same glyph box for every type: 32% of the box in even pixels (16 at 48, 20 at 64, 30 at 96; Finder's glyph
   ≈ 34%), lines at the page's edge weight (already), the quiet ink, no colour per type. Without the label the glyph
   centres on the page's centre (50% of the box: the page runs 6–94%, the fold ends at 29%, so a 32% glyph clears it
   by 5%); drop the 6% nudge.
2. **Type → glyph** (existing icons in `packages/icons/sources`):

   | Type | Glyph |
   |---|---|
   | document, PDF, text, Markdown | `text-align-left` (all text documents; the name carries the extension) |
   | spreadsheet / CSV | `table` |
   | slides | `presentation` |
   | image (no preview) | `image` |
   | video | `play` |
   | audio | `waveform` (Finder's mark) |
   | code / JSON | `code` / `braces` |
   | archive | `archive` (a zipper, as Finder and Drive draw, is an icon candidate) |
   | unknown | none: the blank page (Fluent `genericfile`, Atlassian `generic`) |

   The 16 / 20 `file-*` icons stay for rows (File upload, Attachment); one extension map should feed both.
3. **`label`: deprecate.** Keep it working (File page is owner-Complete, round 48) with `@deprecated`, a Documentation
   "don't", no demo use, as with `name`. Not for unknown types either: the tile's name says `.xyz`.
4. **Images and video get their own figure: a frame**, the family's third member beside Folder and File page (Fluent's
   split). Same box, variants, edge, shadow and corner family: a 4:3 frame 88 × 66 at 96
   (Folder's figure width; 58 × 44 at 64, 44 × 32 at 48), corner equal to the page's on screen (8 at 96), the image
   filling it cropped (ChatGPT's `object-cover`, an even grid; Finder's contained preview is the alternative),
   inner radius concentric. With no image, the `image` or `play` glyph at the same 32%. File page's `preview` moves to
   it. Intake decides: a File page `shape` value or its own family.
5. **Optional:** Folder takes a `symbol` slot (Finder's Pictures folder), the same glyph at 32% in the quiet ink.

## Touched

File page (React, CSS, manifest, spec, Documentation; reopens it), File tile (demos, spec, image rule), Folder (only for
`symbol`), File upload and Attachment (extension map), `specimens.mjs`, `pages.mjs`, `documentation/content.mjs`,
`tests/file-tile.test.mjs`, and the Brand tab's image tiles (would adopt the frame).
