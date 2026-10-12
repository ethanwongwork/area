# Asset row: survey beyond Figma

**Date:** 2026-10-12 · **For:** `docs/specs/asset-row.md` · **Asked:** "look up other asset rows, not just figma"

Pattern: one row for one exportable asset or file: preview, name, detail line, trailing action. Figma Dev Mode
(already captured): 56 row, flush 56 × 56 `rgb(245, 245, 245)` preview at radius 2 at the panel's edge, text 16 after
it at 11/16, two lines.

**Evidence key.** *src* = read from source at the pinned commit or package version (path:lines). *doc* = official
documentation text. *est* = estimated from an official screenshot; not measured, not for use as a spec value.
Tailwind units are resolved at 1 unit = 4px; `text-sm` 14/20, `text-xs` 12/16.

## 1. Design-tool inspectors

### Penpot (open source) · `github.com/penpot/penpot` @ `5eb33add7ee7c15c4cbeab67b0917773ccbdcb63`

**Inspect tab, Export** (`frontend/src/app/main/ui/inspect/exports.scss`): not an asset list. It is a settings form:
a 9-column grid per export (`.element-group`, 58-73: `column-gap` 4, scale / suffix / format selects, a 28 × 32
remove button) and one full-width 32-high "Export" button (110-116). No preview, no per-asset row. *src*

**Assets sidebar, components in list view** (`frontend/src/app/main/ui/workspace/sidebar/assets/components.scss`): the
closest open-source match to an asset row. *src*

```
row        .component-item-list (69-89)  grid auto | 1fr | auto, row track 40, align centre,
           column-gap 8 (--sp-s), padding 2 (--sp-xxs), radius 8, bg --color-background-tertiary
           → row 44 high; preview inset 2 from the row edge
  hover    bg --color-background-quaternary
  selected outline 1px solid --color-accent-primary (no fill change)
preview    .component-item-list-thumbnail (118-125)  40 × 40, padding 2, radius 6, bg --color-canvas
           .component-item-thumbnail (110-116)  img 100% × 100%, object-fit: contain, no border
name       .component-item-list-name (92-99)  one line, foreground-primary; no meta line
```

Colours (`frontend/src/app/main/ui/ds/colors.scss`): light tertiary `$gray-50` #f3f4f6, quaternary `$gray-100`
#eef0f2 (89-90, 53-54); `--color-canvas` `$grayish-red` #bfbfbf (99, 60). Dark tertiary #212426, quaternary
#2e3434 (134-135). Sizes `ds/_sizes.scss` 19 (`$sz-40`), radii `ds/_borders.scss` 11-12, spacing `ds/spacing.scss`
19-21. Grid view (17-41): square tiles, padding 8, radius 8, canvas fill, name shown on hover only, selected = 2px
accent border.

Distinctive: the preview sits **inside** a padded, filled row (a well within a pill), **contain** with a 2px inner
margin, one line only; no actions in the row (actions are in the context menu).

### Zeplin · `support.zeplin.io/en/articles/1338605-downloading-assets` (help centre screenshots, 2024-2025)

Anatomy *doc*: select a layer and its assets appear in the right panel; "Download all assets" with a format dropdown
beside it; an Assets settings menu (Bitmap scales 1x/2x/3x, Naming, Optimize assets). Developer role needed.

Anatomy *est* (screenshots `…Downloading+assets+-+ss4.jpg`, 1632 × 852; `…Type+39.png`, 2282 × 1130):

- **Layer assets:** one preview of the layer on a **checkerboard**, then "Name" and "Size: 24pt × 24pt" lines, then
  **one row per format**: a blue tinted format badge (`PNG`, `PDF`, `SVG`), a primary line ("3 optimized bitmap
  images", "1 vector image") and a muted secondary line ("~47% smaller"), and a download icon at the right edge,
  **always visible**.
- **Screen assets:** "All assets" format rows as above, then "Individual assets": an inset grey tile with the glyph
  centred (est ~28px, assuming a 2× capture), name ("Icons") and a muted size line ("24pt × 24pt"); rows roughly
  44 apart (est). The tile is inset in the row, not flush.

Distinctive: transparency checkerboard (single large preview only), format as a badge, meta = size or optimisation
note, download per format rather than per row.

### Sketch web inspector · `sketch.com/docs/developer-handoff/export/` *doc*

Select a layer in Inspect, press "Export as" to preview the export and pick resolution, prefix/suffix and format; add
several export options; "Export" downloads (a ZIP for several). Document-level "Export Assets" builds a ZIP. The docs
show no list of assets with thumbnails; no screenshot of the panel is published there. Nothing measured.

### Not covered (no primary evidence found in this pass)

Framer, Adobe XD share-for-development, Avocode, Anima, Locofy, Plasmic: no public, documented asset-list row to
cite. Not estimated.

## 2. Design systems

### Material 3 lists · `github.com/material-components/material-web` @ `47adb655bd7a88c4d62e8faac2873084eed555dc` *src*

`tokens/versions/v0_192/_md-comp-list.scss`:

| Token | Value | Lines |
|---|---|---|
| leading image | **56 × 56**, shape `corner-none` (0) | 148-151 |
| leading video | 100 wide; small 56 high, large 69 high; `corner-none` | 114-115, 153-155, 194-195 |
| leading avatar / icon | 40 (full round) / 24 | 142-147 |
| one / two / three-line height | 56 / 72 / 88 (min-heights) | 156-157, 250-251, 220-221 |
| leading / trailing space | 16 / 16 | 152, 225 |
| label text | body-large 16/24, 400 | 92-113; `_md-sys-typescale.scss` 38-41 |
| supporting text | body-medium 14/20, 400, on-surface-variant | 198-219; typescale 55-58 |
| trailing supporting text | label-small | 228-249 |

`tokens/_md-comp-list-item.scss` 139-140: top / bottom space **12**. `list/internal/listitem/_list-item.scss` 37:
gap **16** between leading element, text and trailing; 116-120 min-height + paddings. `docs/components/list.md`
160-170, 334-335: the image goes in `slot="start"` at 56px.

So a 56 image is **inset** 16 from the start and 12 above and below: an image row is ≥ 80 high, not 56. The
m3.material.io specs page renders client-side and could not be read; values above are from the implementation.

### shadcn/ui · `github.com/shadcn-ui/ui` @ `993eb2c3151997ce08a49635c10fd8c8ef3713c7` *src*

Radii (`apps/v4/app/globals.css` 50-53, 100): `--radius` 10; sm 6, md 8, lg 10, xl 14.

**Attachment** (`apps/v4/registry/new-york-v4/ui/attachment.tsx`), the newest and closest file row:

```
root   8-16   flex, rounded-xl (14), 1px border, bg-card; hover bg-muted/50 when it holds a link/button
              default: gap 8, padding 8 with media (10 × 8 text-only), text-sm
              sm: gap 10, padding 6, text-xs · xs: gap 6, padding 4, radius 10, text-xs
              states: idle = dashed border; error = destructive border/tint
media  48-55  square, 40 wide (sm 32, xs 28), rounded-lg (10; xs 8), bg-muted, icon 16;
              image variant: object-cover, 60% opacity until state done
name   103    truncate, font-medium (500)
meta   119    mt 2, text-xs (12/16), muted, truncate
action 147-154 ghost button, size icon-xs, always visible
```

Default geometry: 1 + 8 + 40 + 8 + 1 = **58** outer, **56** inside the border.

**Item** (`item.tsx`): size default gap 16 padding 16, sm gap 10 padding 12×16 (42-44); `ItemMedia` image variant
**40**, rounded-sm (6), object-cover; icon variant 32, rounded-sm, border, bg-muted, 16 icon (80-82); title 14 500
(124); description 14 muted, 2-line clamp (137).

### Untitled UI React · `github.com/untitleduico/react` @ `1d410cb8facde8d50869e7bbb5f3d048e2267466` *src*

`components/application/file-upload/file-upload-base.tsx`, `FileListItemProgressBar` (260-311):

```
row    267   flex, gap 12, padding 16, rounded-xl, bg-primary, 1px inset ring-secondary (failed: 2px error ring)
media  272   40 × 40 FileTypeIcon (a file-type glyph, not a content preview)
name   278   text-sm 500, text-secondary, truncate
meta   280-293  mt 2, text-sm muted: size · divider (1 × 12) · status icon 16 + "Complete" / "Uploading..." / "Failed"
action 298   ButtonUtility xs, tertiary, delete, always visible, -8 top/right to sit in the corner
```

Row height with one line of meta: 16 + 42 + 16 = 74 (text block 20 + 2 + 20 taller than the 40 icon).

### Fluent (Teams attachment, v0 → v9 migration) · `github.com/microsoft/fluentui` @ `13aa67efb57d2e7a9842f72cc43f0288625c205e` *src*

`packages/react-components/react-migration-v0-v9/library/src/components/Attachment/`:

```
root   Attachment.styles.ts 23-37   inline-flex centre, max-width 424, min-height 32,
       padding 7 3 7 11 + 1px border (= 8 4 8 12), radius 4, bg colorNeutralBackground6,
       small shadow; 41-46 hover bg colorNeutralBackground4Hover (actionable only)
icon   AttachmentIcon.styles.ts 7-9    32 × 32, margin-right 12
name   AttachmentHeader.styles.ts 8-10 fontSizeBase300 (14), semibold (600), line-height 1.4286 (20)
meta   AttachmentDescription.styles.ts 8-10 fontSizeBase200 (12), regular, line-height 1
action AttachmentAction.styles.ts 7-9  32 high, min 32 wide; always visible
```

Height: 8 + 32 + 8 + border = **48**. Fluent 2 (v9 core) has no attachment or file-row component.

### Shopify Polaris · `github.com/Shopify/polaris` @ `3f7954ae42fabf26d63cee68c23ceebfd7ef0972` *src*

`polaris-react/src/components/Thumbnail/Thumbnail.module.css`: sizes extra-small **24**, small **40**, medium **60**,
large **80** (3-6); background `--p-color-bg-surface` (white) (11); radius `border-radius-200` = 8, extra-small 150 = 6
(15, 31-34); a 1px hairline as `::after` `box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08) inset` (17-29;
`polaris-tokens/src/themes/base/shadow.ts` 118-119); the image is centred at max-width/max-height 100% (68-76): a
**contain** fit, letterboxed on white; `transparent` modifier drops the fill (64-66).

`ResourceItem`: min-height 44 (`ResourceItem.module.css` 3); padding 12 all round, grid `auto 1fr`, gap 12
(`ResourceItem.tsx` 290-302); media slot "usually an Avatar or Thumbnail" (45-46, 203-213). Hover bg
`bg-surface-secondary-hover` (`.module.css` 16-17). Shortcut actions are **hidden until hover or focus** (clip, 19-27,
93-104), shown absolutely at top 16 / right 20 as a segmented slim group (`ResourceItem.tsx` 275-285);
`persistActions` keeps them visible as tertiary buttons (239-249).

### Carbon · `github.com/carbon-design-system/carbon` @ `1709742020a4de25264060216ee8b7349581d9f1` *src*

`packages/styles/scss/components/file-uploader/_file-uploader.scss`: `.cds--file__selected-file` (147-156) grid
`1fr auto`, bg `$layer`, max-width 320, min-height 48 (`$spacing-09`); md 40, sm 32 (247-254); name
`body-compact-01` (14/18) with 16 start padding (176-187). **No preview or meta line**; the trailing slot is a status
icon or remove button. A file list, not an asset list.

### Atlassian media card · `@atlaskit/media-card` 82.1.28 (npm) *src*

A card, not a row: `dist/es2019/utils/cardDimensions.js` 1-12: image card 156 × 125, horizontal 435 × 125, square
300 × 300. Actions bar: absolute top-right, padding 8, gap 8, `opacity: 0` unless `isFixed`
(`card/ui/actionsBar/styles.js` 5-8, `actionsBarWrapper-compiled.js` 14), revealed on hover.

### GitHub Primer

No file, attachment or asset row component; not included.

## 3. ChatGPT / Notion file chips

Neither documents its attachment chip. ChatGPT's attachment card stays uncaptured: the owner declined a test upload
(2026-10-09, `docs/specs/file-upload.md` 10-13, 40); Notion's file block needs a page with a file. Nothing measured.

## 4. Synthesis

| Reference | Preview | Placement | Fill / edge | Radius | Fit | Gap | Name / meta | Action | Row |
|---|---|---|---|---|---|---|---|---|---|
| Figma Dev Mode | 56 | **flush**, panel edge | #f5 | 2 | glyph centred | 16 | 11/16, two lines | on hover (not captured) | 56 |
| Penpot list | 40 (+2 inner pad) | inset 2 | #bfbfbf canvas | 6 | contain | 8 | one line | none in row | 44 |
| shadcn Attachment | 40 | inset 8 | muted | 10 | cover | 8 | 14 500 / 12 muted | always | 56 inner |
| shadcn Item image | 40 | inset 12-16 | none | 6 | cover | 10-16 | 14 500 / 14 muted | — | — |
| Untitled file item | 40 file icon | inset 16 | — | — | — | 12 | 14 500 / 14 muted | always | 74 |
| Fluent attachment | 32 icon | inset 8 / 12 | neutral bg6 + border | 4 (row) | — | 12 | 14 600 / 12 | always | 48 |
| Polaris Thumbnail | 24 / 40 / 60 / 80 | inset 12 | white + 8% hairline | 8 (6 at 24) | contain | 12 | — | hover/focus | ≥ 44 |
| Material 3 image | 56 | inset 16 / 12 | none | 0 | (img) | 16 | 16/24 / 14/20 | — | ≥ 80 |
| Zeplin (est) | ~28 tile; big preview on checkerboard | inset | grey / checkerboard | small | centred | — | name / size, format badge | always, per format | ~44 |

Agreement:

- **Size:** 40 is the common preview (Penpot, shadcn ×2, Untitled, Polaris small); 32 for icon-only (Fluent, shadcn
  icon). 56 appears only in Material (inset, in an 80 row) and Figma (flush).
- **Placement:** every reference except Figma insets the preview inside the row's padding (2-16).
- **Fill:** a neutral fill for icon/vector previews (Penpot, shadcn, Zeplin tiles); Polaris uses white plus a 1px 8%
  hairline so white images keep an edge. A checkerboard appears only in Zeplin's single large preview.
- **Radius:** 6-10, the system's small/medium control radius; never 2, and 0 only in Material.
- **Fit:** contain for design assets (Penpot, Polaris); cover for photos (shadcn, Material).
- **Gap:** 8-16; 12 is the most common (Untitled, Fluent, Polaris), 8 in the two compact ones (Penpot, shadcn
  Attachment).
- **Type:** name medium/semibold (500-600) where specified; meta one step smaller or muted (12, or 14 muted). Meta is
  size, format or status.
- **Action:** always visible in file/attachment rows (shadcn, Untitled, Fluent, Zeplin); hover-revealed in list or
  card patterns (Polaris, Atlassian, Figma), always also on focus.
- **States:** hover = background wash (Penpot, Polaris, Fluent, shadcn); selected = 1px accent outline (Penpot).

Where Figma is the outlier: flush placement at the panel edge, 56 preview in a 56 row (zero inset), radius 2, 11px
type. Its 56 matches only Material's image size, which Material insets.

## 5. Recommendation for Area's asset row

| Property | Recommend | Basis |
|---|---|---|
| row height | 56 | Figma (target product); equals shadcn Attachment's inner height |
| preview | **40** square, inset **8** above, below and at the start | shadcn Attachment geometry (8 + 40 + 8 = 56); 40 = Penpot, shadcn, Untitled, Polaris small. Replaces the current 48 (no reference uses 48) |
| preview fill | `bg-subtle` (Box model's ground), no border | Penpot canvas, shadcn muted, Zeplin tile; Polaris's hairline only if white-on-white images matter |
| preview radius | `radius-small` (6) | Penpot 6, shadcn Item 6; refs span 6-10 |
| preview content | image `object-fit: contain` with a small inner margin (Penpot 2; Area 4 at 40 → a 32 image box); icon/vector at 16-24 centred | Penpot, Polaris contain; Figma centres a 16 mark |
| checkerboard | not by default; an optional `transparent` treatment if transparency must show | Zeplin only, and only on its large preview |
| gap to text | **12** | Untitled, Fluent, Polaris; between Penpot/shadcn 8 and Figma/Material 16 |
| name / meta | 12/16 default / 12/16 muted (keep Area's inspector scale); name weight 500 is the reference majority, subject to Area's weight policy | Figma panel type is 11/16; shadcn 500, Untitled 500, Fluent 600 |
| meta content | format · dimensions (e.g. "SVG · 24 × 24") | Zeplin "24pt × 24pt", Untitled size, Figma's two lines |
| action | trailing ghost icon button, visible at rest; a hover-reveal option must also reveal on focus | file-row refs keep it visible; Polaris/Atlassian reveal on hover and focus |
| hover / selected | only when the row is interactive: background wash; selected = 1px accent outline | Penpot, Polaris |

All values in sections 1-2 marked *src* are read from the cited files; none was captured in a browser with
`area-capture.js`. Zeplin values are screenshot estimates and are not spec evidence.
