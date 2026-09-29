# Handoff — 2026-09-27

Each session starts from `main` in its own worktree (`claude/*` branch) and merges through a
pull request; icons and components run as separate sessions.
System-wide files (icon generator, base styles, handoff) change in one session at a time. The dev server is `npm run dev` (4321 by default; port 3000 in the latest
session). Open `/gallery-icons.html` for icons. No owner completion changed; Indicator stays In review.

## Owner direction

- **Icon sessions open with the owner's decisions** (owner, 2026-09-28): before drawing, list
  the decisions pending for the next icon batches, with options and a recommendation (the
  "To settle with the owner" section of `docs/research/icon-inventory.md` and open questions
  below). Work starts once they are made.

- Visual-first: get every component and variant exactly right from measured evidence
  (ChatGPT, Notion, Figma, Cursor, Untitled UI, Fluent), then systematize tokens.
- Lighter UI: regular-weight titles, few sizes/weights/colors, one variable per distinction.
- Area draws its own stroked icons at 1.125px (`--area-weight-icon`).
- A compact density of the whole system is planned for dense products (Cursor and other
  IDEs, Figma, Notion). Dense sizes (24/28px) go to compact density, not new component sizes.
- The documentation site is hidden. Work happens in the gallery pages until the owner
  asks to populate the docs.

## Process (read before component work)

- `docs/COMPONENT_ADAPTATION.md` (process), skills `area-component-build` and
  `area-visual-language` (`.agents/skills`, linked from `.claude/skills`).
- Capture: `apps/docs/public/area-capture.js` (checksummed, with a fingerprint check);
  `npm run capture:compare`. The Edge extension truncates results at about 900 characters
  (read in chunks), background tabs stall async scripts, and products are read-only (ask
  before switching a product's theme).
- Specs: `docs/specs/` (indicator, icons, typography, PRIOR_DECISIONS); baseline
  `docs/research/BASELINE.md`; captures in `docs/research/captures/`.

## Current state

- **Gallery:** eight pages with a nav: components, typeRamp, iconography, color, scale,
  radius, surface, motion. `index.html` and `gallery.html` redirect to the components page.
- **Type ramp (applied):**
  - text 12/16, 14/20, 16/24; titles 20/28, 24/32, 32/40; titles fixed in compact;
  - small controls 12/16;
  - weight 400 everywhere except labels on fills (500).
- **Icons (branch `icons-system`, PR 3):** 256 icons in twenty-three batches; rules in the
  `area-icon-construction` skill, record in `docs/specs/icons.md`.
  - Sources: `apps/docs/assets/area-icons-pilot/` (`npm run icons:pilot`, `npm run lint:icons`,
    `--report`, `--audit`). The lint checks the grid, the diagonal lattice, keylines, the
    gap and counter scale, acute corners, filled gaps, and live area.
  - Review: `gallery-icons.html`, grouped by `batches.json` with owner status and a
    whole-set grid per batch; open questions go in `explore/`.
  - Batch 1 (core) is approved except items back in review; batches 2–13 are in review.
  - Components drawing Area glyphs: Badge dismiss, NumberField steppers, TreeView chevron
    and check, Composer send (`glyphs.ts`, `Glyph.tsx`, with sizes on the size curve).
    Fluent remains elsewhere and in demos.
  - Remote review: render a sheet with headless Edge (see the batch 5 note in the spec).
- **Indicator (pilot component):**
  - 6px dot; 16px count with 10/14 text, weight 500;
  - 1px surface cutout;
  - counts centre on the corner (`compact` is opt-in); dots centre on the icon corner;
  - tabs reserve space after the label; circular owners sit 2px outward.

- **2026-09-26 (branch `claude/component-variants-audit-fc1ee4`, uncommitted):**
  - gap audit of 13 design-system catalogues: `docs/research/component-gap-audit.md`,
    summarized in `docs/COMPONENTS.md` (Gap audit section);
  - ColorPicker Figma pass (`docs/specs/color-picker.md`, 11 Figma captures): ten-row width,
    16px pill tracks, ringed thumbs, eyedropper, Hex/RGB/CSS/HSL/HSB value row, header slot;
  - Calendar, new (`docs/specs/calendar.md`, 7 Notion captures): single/range/multiple,
    two months, bounds, APG grid keyboard; gallery tiles use the new `1x2` span;
  - later passes: Calendar neutral tone, 12/16 days, circle/tile days, markers, week strip,
    Schedule composition; ColorPicker views (spectrum/grid/sliders), OKLCH, contrast band,
    preview, save; `scripts/gen-color-grid.mjs` generates the palette grid;
  - captures from pages that block the script: paste it, then hand results over the
    clipboard (`pbpaste` needs `LANG=en_US.UTF-8`) or a local `postMessage` relay
    (COMPONENT_ADAPTATION.md, "Browser tools");
  - neutral-by-default sweep: Checkbox, Radio, Chip and AlignmentPicker gained a `tone`
    axis (neutral default);
  - **cohesion audit** (`docs/research/cohesion-audit.md`): every family accepted before the
    evidence process re-checked; 37 new specs; shared state paint (row plates, disabled,
    fixed ink, neutral markers, one floating lift, one label weight) written into
    DESIGN_SYSTEM.md and the skills; 20 families reopened for review; `check-token-refs.mjs`
    in the styles build and `packages/react/tests/cohesion.test.mjs` guard the rules; Untitled
    UI values pinned in `docs/research/untitled-ui-reference.md`; 23 ChatGPT baseline captures;
  - **second and third passes (2026-09-26/27):** 77 Notion and Figma captures and 424 Area
    recaptures; every audited spec carries them. Every open question is settled in the audit
    ("Second pass" and "Third pass" sections): dark neutral alphas solved against the page
    rung, `border-divider` role, Kbd filled and concentric inside Buttons, Switch travel,
    Segmented muted ink, Card container radius and divider edge, Select `soft`, Button group
    full-height seam, Panel all-soft rows, and more;
  - **gallery:** Pass reviews removed at the owner's request (`cohesion.tsx` deleted). Tiles
    are grouped per family (Default, Variants, Tones, Sizes, Layout, Content, States, Behavior,
    Variant × tone; `specimenGroup` in `apps/docs/scripts/specimen-names.mjs`). Every
    non-default manifest value has a tile; extra tiles live in
    `apps/docs/src/demos/gallery-variants.tsx`.

  - **Card (2026-09-27, In review):** layouts vertical, horizontal (40 / 60, media start or
    end by order, stacks below 480px via a container query), compact, immersive; `CardMedia
    bleed`; size (12/16/24 corners, 6/8/12 insets); linked cards (`CardLink` stretched over the
    card, edge-step hover, card focus ring, `CardOverlay reveal`); CardHeader, CardOverlay,
    well, CardList; eight templates in a Templates gallery group. Appearances were removed at
    the owner's request (a later system-wide pass); their evidence stays in
    `docs/research/captures/card/`. Spec: `docs/specs/card.md`. Paint pass: neutral 25
    media, edge #ee, faint two-layer shadow; type audit added tracking, `CardValue`,
    `CardCarousel`, a well that stacks its contents, and space reserved beside bottom overlays.

  - **Overlay behavior (2026-09-27, In review):** `trigger` on Popover, Menu and Tooltip
    (native popover top layer, `popovertarget` on button triggers, JS `computePosition` with
    flip and shift, menu button keyboard, tooltip delays and hover bridge, 150ms motion).
    Spec `docs/specs/overlay.md`; tests `packages/react/tests/overlay.test.mjs`; gallery
    `behavior-*` tiles. Tooltip is still marked Complete; its behavior is new and unreviewed.

## Count and Banner (2026-09-28, branch `claude/component-banner-count-81af92`, in review)

- **Count** (new, `count.css`, `Count.tsx`, manifest `count`, spec `count.md`): plain (default,
  Notion) / soft (Primer, 6% black translucent plate), neutral / accent, sm 16 / md 20, 12/16
  tabular, `max+` via `count-format.ts` shared with Indicator, hidden `label`. Nav and Tabs demos
  use it.
- **Banner** = Alert `layout="banner"` + `flush` (spec `alert.md`, Banner): OpenAI 12 / 16 inset,
  44 tall, corner 6, flex row, link at the end on the inset. Alert moved Complete → In review; new
  batch "Counts and banners".
- Captures: `captures/count/`, `captures/alert/*banner*` (OpenAI business and Daybreak, Primer). Route
  for public pages in the built-in browser: paste the script, put captures in `window.name`, then
  navigate to a 127.0.0.1 relay page that POSTs them (popups open in the same tab there).
- Chrome side by side done (Notion board counts, OpenAI Daybreak); open: Count text 14 (Notion) vs 12;
  dark theme; no target product showed a banner. `npm run test:consumer` fails on an old
  `Panel size="xs"` in its fixture (unrelated).

## Batch 4 approved, batch 5 Chrome pass (2026-09-28)

- Owner approved batch 4 (Count, Alert with banner). Count stays a pill.
- Batch 5 (Avatar, Indicator, Badge): Claude in Chrome side by side done and recorded in
  `pass-status.mjs` (Figma avatars, bell and AI label; Notion person and workspace avatars, help
  dot, tags). No change to the three families; awaiting owner approval.
- Avatar in Chip: the initials overflowed (Chip used `control-sm-text`, 14 since small controls
  moved to 14/20); now `control-xs-text` like Badge, and the slot is `aria-hidden`. Chip moved
  Complete → In review. Avatar and Chip demos use Irene Yamaguchi (group: Irene + teams).

## Batch 5 approved, batch 6 Chrome pass (2026-09-28)

- Owner approved batch 5 (Avatar, Indicator, Badge).
- Batch 6 (Loading): transient states caught with a MutationObserver installed alongside the
  capture script; ChatGPT and Notion clear `window.name` (COOP), so their captures leave through
  the clipboard (injected button, real click, `LC_ALL=en_US.UTF-8 pbpaste`). Skeleton now takes
  ChatGPT's 10% / 16% grey and 3s linear shimmer (Figma agrees); Spinner unchanged (owner's 1s
  over ChatGPT's 2s). Progress: no product bar found again; not validated.
- Owner feedback: Spinner redrawn as SVG masks with round caps, stroke 1/8 of size (lg 3); a
  2.5px md option waits in `GalleryReviewSpinner`. Skeleton: rectangle 4px corner, `animated`,
  `lines`, wrap mode (children + `loading`), list tile; `skeleton.test.mjs`.
- Skeleton rethink (owner chose option A from `research/skeleton-rethink-survey.md`): shapes block
  (default) / text / circle; `rounded` and `rectangle` removed; wrap paints the child (utilities
  layer); compositions omit control placeholders.

## Gallery tiles and batches 6-7 (2026-09-28)

- The tall single-column tile (1x2) is gone (`GALLERY_SPANS`): Calendar tiles are 2x2 (two
  months 2x3), Count nav 2x1, every Skeleton tile 2x1. The Pass review's 2x copy now has the
  tile's content width (it collapsed full-width specimens). A DOM audit found no clipped tiles.
- Port 3000 serves a different worktree (`icons-branch-strategy-a94020`); this branch is on 4331.
  The dev server reads `pass-status.mjs`, `component-status.mjs` and the capture folders once at
  start: restart it after changing them, or the Pass review shows stale phases.
- Batch 6: Progress validated against Figma's AI-credits meter (open: Figma's tracks #f5 / #e6
  are lighter than Area's shared rail #dd). Batch 7: Popover validated against Notion's Share
  popover; Calendar against Notion's search Date filter (month label now 500). Batch 6 approved.
  Chrome tip: Notion's menus open reliably with synthetic pointer events dispatched to the
  element (`pointerdown`/`mousedown`/`pointerup`/`mouseup`/`click`); zoomed tabs misplace clicks.

## Owner feedback round (2026-09-27, branch `claude/component-gallery-status-4b51ac`, uncommitted)

- Message action plates align to the text / bubble edge; Card carousel 18.3 under the header;
  Command palette footer hints are working buttons (↑ ↓ Open Close).
- Panel: sizes sm / md only, rows fill the width, `actionColumn` (Figma recipe), width 240.
  Rule: a divider is never darker than its container (Panel, Code block → `border-decorative`).
- Toolbar: pressed = Button selected fill; track painted as Segmented (stroke, no shadow plate).
- Alert fills mixed 50% to surface, brighter icon rungs (Toast icons too); text ink kept (4.5:1).
- Avatar count centred on the circle edge; Calendar 36 / 32 cells, 12/16 numbers, `fixedWeeks` off.
- Nav from ChatGPT / Notion captures (`captures/nav/`): items default ink, labels 12/16 muted, 12
  between groups. Open: Menu's label still 14/20.
- Spinner 1s, track = arc ink 25%, reduced motion slows; Skeleton text keeps its line box, 4
  corners. Survey: `docs/research/skeleton-spinner-code-slider-survey.md`.
- Eight Complete families moved to In review (status file). Headless screenshots:
  `scratchpad/shot.mjs` pattern (Edge + CDP). Relay for Chrome captures: postMessage page on 3199.
- Claude in Chrome round 2: 37 captures (Figma split tools, sliders, design-panel rows, library
  swatches, divider; ChatGPT code block, textarea, stacked field, mode radio cards, colour field;
  Notion link preview). Not found in the owner's pages: inline code, a badge group; skeleton and
  spinner only appear while loading.
- **Approval batches** (`APPROVAL_BATCHES`, 21 batches of 2-3): phases audit → visual pass →
  Chrome side by side → owner approval; gallery leads with the current batch, officially complete
  at the bottom. Batch 1 (Toolbar, Split button, Segmented) is Ready for approval.
- Round 3: one size per gallery tile (7 families split; rule in AGENTS.md); Split button menus
  placed by `useAnchoredPosition` (were CSS anchor, misplaced); toolbar separator lighter
  (`border-decorative`). Batch 2 side by side done: Nav, Menu (labels now 12/16, back to review)
  ready; Tree view officially complete (approved earlier, unchanged). Batches 1-2 await approval.
- Round 4: Nav titles from ChatGPT (14/20 500 muted; Menu keeps 12/16), Nav recipe tile
  "sidebar in context"; batch 3 side by side (Alert vs Notion callout, Toast vs Notion toast).
  Ready for approval: Toolbar, Split button, Segmented, Nav, Menu, Alert, Toast.
- Toolbar: track group removed (Segmented in the toolbar, joins its roving); Figma tools are
  icon-only ghost SplitButtons (no drawn divider, 1px gap). `toolbar-context.ts` makes composite
  controls roving items inside a Toolbar.

## Merge and audit round (2026-09-27, branch `claude/component-variants-audit-fc1ee4`)

- Committed this branch's work and merged `origin/main` (22 commits: inspector and Figma
  properties panel, product components, Dialog/Popover/Menu/Toast/Button passes). Main's passes
  won their conflicts; Card, overlay behavior (`trigger` on Popover/Menu/Tooltip) and the fixes
  stayed on top. Not pushed.
- After the merge: Alert takes Toast's inset (40 tall, controls 6 from the corner); Chip's
  remove is a concentric circle 4 inside the pill; Slider hover keeps the rail; the large and
  interactive Table tiles lost a doubled wrapper; CommandPalette and Combobox no longer scroll
  the page on mount (the gallery jumped ~35,000px on load). Pass reviews for Card, Table, Chip,
  Alert and Slider are in `apps/docs/src/demos/reviews.tsx` (remove once the owner has seen them).

## Next

1. Owner: review the 20 In-review families in the grouped gallery and confirm completion in
   `apps/docs/src/component-status.mjs`. Slider, Separator and Panel (Complete) changed after the
   owner accepted them.
2. Owner: two candidates the evidence raised but that were not started: a borderless (ghost)
   Select trigger (Notion, Figma), and Card as a link with hover actions (Notion, Figma).
3. Product dark themes need the owner's go-ahead; then recapture the changed families dark.
4. Owner: review Calendar and the ColorPicker pass; decide whether ColorField adopts the
   picker's surface-gap divider.
5. Next gap after overlay behavior (audit order): custom Select listbox, then Combobox.
6. Owner: confirm the size model (scale 12–20px, recommended) and the 12px glyphs in
   Badge and NumberField (`docs/specs/icons.md`, fifth pass).
7. Icons: batch 4 (alignment) per `docs/specs/icons.md`; replace the remaining Fluent
   families and move Area's marks to 1.125px at the same time.
8. Compact density: 20–24px avatars, 24/28px rows (see the audit's Kept table).
## Tree view passes 2–3 (2026-09-25, in review)

Chevron plate 20px; row `actions` slot (`data-pinned`); chevron, icon and label on shared
columns (6px gaps, 22px indent); current-row marker removed; variant pass (Variants table,
Disabled row tile, full API). Open: Figma layers capture, layer-type glyphs and a lock icon,
screen-reader check of row actions. Spec: `docs/specs/tree-view.md`.

## Button pass 1 (2026-09-25, in review; reopened from Complete)

Labels 400 (solid 500), 6px icon gap at md/lg, no shadow; neutral ghost hovers with the
`bg-hover` wash, outline and tone ghosts one rung stronger; neutral soft keeps its stroke and
hovers with the wash plus a translucent border (≈235 / 224); Trailing icon tile added. 58 reference captures in
`docs/research/captures/button/`; spec `docs/specs/button.md`.

## SplitButton (new) and ButtonGroup pass (2026-09-26, in review)

Survey of 15 systems: standalone in Fluent, Material 3, Carbon, Atlassian; composition in
Primer, shadcn, Polaris, Mantine, Chakra; never a Button variant. SplitButton is standalone:
two Buttons, trigger width = height − 4 (Notion 24 at 28), full-height divider (solid: label
ink 24%; soft/outline: control line), Menu in a native popover anchored 4px under the end
edge; arrow keys, Escape and focus return verified. ButtonGroup divider is now full height
in `edge-control`. Specs: `split-button.md`, `button-group.md`. Unverified: dark, screen
reader, RTL divider. ButtonGroup has nine variant tiles.

Small controls (default density sm, 28px) now use 14/20 (owner delegated); captions that
borrowed the sm token use the caption role (text-xs), so they did not change.

## Menu pass (2026-09-26, in review; reopened from Complete)

Label column 36 (gap 12 via `inset.css`), hover/keyboard focus share the `bg-hover` wash,
danger keeps red text with a neutral hover, shortcuts in the UI font, Notion's two-layer lift,
and Menu now handles arrows/Home/End/typeahead (SplitButton reuses it). Divider 4 / 1 / 4
(Notion). `MenuItem checked` makes a checkable row (trailing check, or `indicator="switch"`
drawn display-only via `.area-switch__track[data-checked]`). Spec `menu.md`.
Open: submenu keys, a general menu trigger (overlay work).

## Popover pass (2026-09-26, in review; reopened from Complete)

Menu's lift, 320 preferred width, 16 section gaps; new `trigger` prop anchors a native
popover (4px, `side`, flips), moves focus in on open and back to the trigger on close.
Pass 2: description lives in the header (6 under the title), close on the title line with its
icon on the 12 inset, title cap 12 from the top; ladder 12 / 16 / 8 / 6. Spec `popover.md`.
Pass 3: close box 6/6 in the corner (half the inset, concentric radius), title centred on it
(cap 15), title strong (500). Open: same-size titles (Alert, Toast, Card) still regular.
Open: dark theme, arrow when the popover shifts, Dialog's title gap (8) vs Popover's (15). Capture route that works: the built-in browser
returns results in full; Claude in Chrome blocks encoded output, so logged-in captures were
saved as one JSON download per product (owner-approved) and split with a scratch script.

## Next

1. Owner review on `gallery-icons.html` (In review lists what's open): batches 32–42 (the full-set roadmap, part 2 in `docs/specs/icons.md`: demo gaps, Figma tools 2 with the boolean operations as solid results, code and git, media, documents/money/awards, people, nature, type, keys; open: the booleans and contrast are solid exceptions in the outline style, filled tree reads as a club); batch 31 (weather, shapes and money: cloud rain and cloud lightning on cloud-download's open cloud, wind, star off, QR code on grid's squares, rectangle, ellipse, coins); batch 30 (nature and tools); the list family (bullet, numbered, checklist share rows 5, 8, 11); filled lines beside solids keep the icon weight; mark placement is set by the shape; batches 27–29 (AI and chat, Figma tools, commerce; open: unpin's cut); batch 26 (checkbox, checklist, bookmark remove, filter add, top panel, pushpin, palette); batches 24–25 (lists and sorting; view and tools; clear filters and the 1's sharp flag approved; the 2 and percent (Geist's 54° slash) revised; mark placement is set by the shape; filled lines beside solids keep the icon weight); batch 23 (call,
   reply/forward, sync, eraser, text align, indent/outdent, columns/rows, container remove);
   the negative-space round (graduation cap, bell, bell off, clipboard, car, watch: gaps on
   the outline's lines); batch 22; keyboard and repeat; batches 18–21.
   Rules: skill (Shared parts, Families, Filled variants: negative space on the outline's
   lines, only where fill is on both sides) and the spec's last sections; the lint checks
   dot sizes, the shared slash on `-off` icons and knockouts that never enter a solid.
   Batch 43 redrew thirteen dropped icons with one simplification each (skill: Fitting a dense
   idea at 16px). Process tools (2026-09-28): `icons:find` (does it exist?), `icons:geometry`
   (fillet, cut, behind, lobes, transform, gap), `gen-pilot-icons.mjs --only a,b` (a second,
   not a minute; near misses name the distance to fix), `icons:sheet compare out.png batch-NN`
   (beside Fluent), `icons:batch batch.json` (records a batch everywhere). The build queue from
   the owner's Cursor references is `docs/research/icon-inventory.md`.
   The drawing roadmap is done; what remains is the swap below. New rules this round: every
   cloud is the one shape (weather clouds moved up, rain hangs from the foot, the bolt crosses it
   with a filled-only `halo`); qr-code's `data-gap="aligned"`. Batch sheets:
   `icon-sheet.mjs filled out.png <icons…>`.
   The lint doesn't measure gaps within one path (paperclip's were solved by hand).
   `npm run typecheck` fails while the dev server rebuilds `packages/react/dist` (TS7016 on
   `@area/react`); rerun once the rebuild settles. Review filled variants with
   `node apps/docs/scripts/icon-sheet.mjs filled out.png`.
2. Icons: auto-position needs a new concept. Then swap the demo-level Fluent imports for
   Area icons, one family at a time with the owner's approval, and retire the Fluent map.
3. Components happen on branch `components`, in its own worktree session.
4. A stroke and type baseline across Cursor, ChatGPT, Notion and Figma (needs the owner's
   go-ahead for product dark themes).

## Verification (2026-09-27)

These pass:
- 19,491 token tests (contrast gate unchanged);
- 114 React tests, including `tone.test.mjs` and the new `cohesion.test.mjs`;
- typecheck, docs build and audit, manifest parity, token-reference check;
- 14 contracts, 4 preview tests, consumer check, capture checksums, `git diff --check`.

Unverified: cross-engine, screen reader, forced colors (execution), product dark themes, and
the third-pass changes in dark mode.

The docs build can fail with "Could not resolve @area/styles/manifest" while `npm run dev`
is rebuilding the styles package; rerun it.

About 284MB of ignored leftovers under `archive/` (old source caches and logs) remain on
disk; delete them manually if wanted.

## Dialog pass (2026-09-26, in review)

Close is a 32px ghost Button 8/8 in the corner (shadcn, Primer 8/8; ChatGPT 12/12), icon on
the 16 inset, title centred on it; title baseline to description cap 15 (Popover's rule);
Menu/Popover lift; scrim 13% black (ChatGPT) without blur; `trigger` opens a native modal
(verified: focus, Escape, scrim click, focus return). Spec `dialog.md`. Open: dialog title
type (references 14–16 at 500–600 vs Area 20/28 regular), dark scrim, AlertDialog.
Chrome capture route: downloads need "allow multiple downloads" per site (chatgpt.com now allowed).

## Type and radius pass (2026-09-26)

Every surface title strong: 14/20 compact (Popover, Panel, Alert, Toast), 16/24 standalone
(Card, Dialog; Dialog was 20/28). Descriptions 14/20 muted (Popover was 14/18). Role table in
typography.md. Dialog corner 16 = close radius + offset (concentric); radius audit in
dialog.md (Alert, Code block, Input, ColorSwatchPicker flagged, not changed).

## Toast pass (2026-09-26, in review)

Popover's numbers: 12 inset, icon 12/12, 40 tall with or without controls, last control 6/6
(concentric with the 12 corner), shared lift (Notion uses the same), strong title, muted
description (`area-toast__description`, manifest element added). Spec `toast.md`. Open: an
inverse (dark) toast like Notion's.

## NumberField pass (2026-09-26, in review)

Figma model: `scrub` takes the field's letter or icon (grip only for `true`), whole square is
the target; unit sits after the number (`field-sizing: content`), hidden beside Mixed/empty;
inspector demo is soft with X/Y/W/H handles. Spec `number-field.md`. Screenshot route for the
owner: `scratchpad/shot.mjs` (headless Edge + CDP, element PNG) then SendUserFile.

## NumberField pass 2 + Inspector (2026-09-26, in review)

Steppers are minus/plus nested 24px squares (press-and-hold repeat, out of tab order); no
resting shadow on Input, NumberField, InputGroup, Textarea, Checkbox, Radio (as Button).
New: PanelRow (two columns + trailing square), PanelSection `actions`, ButtonGroup
`fullWidth`, NumberField `grouping`; Figma Design panel recipe (`GalleryPanelFigma`). Specs
`number-field.md`, `inspector.md`. Panel is marked complete but gained these pieces; the owner
should re-review it.

## PropertyList (2026-09-26, in review)

New component (`PropertyList`, `PropertyListItem`, `property-list.css`, manifest `propertyList`,
docs page `property-list`): value + consumer buttons per row; handle in the panel inset (new
`grip` glyph); pointer drag with drop line, keyboard ArrowUp/Down/Home/End with focus kept and
a live announcement. Figma recipe's Fill section uses it. Verified with real events in
headless Edge (`scratchpad/plist.mjs`). Open: 8px small-panel inset is tight for the handle.

## Collapsible sections (2026-09-26, in review)

`PanelSection` `collapsible` / `open` / `defaultOpen` / `onOpenChange` / `summary`: h3 > button
disclosure, chevron in the inset on hover, summary while collapsed, heading-only sections
centred. Figma recipe sections collapse; Selection colors and Export added. Tests in
`dialog.test.mjs`; interaction verified in headless Edge. Dev server was stopped by the app
once; restart with preview_start "dev".

## BoxField (2026-09-26, in review)

New component (`BoxField`, `box-field.css`, manifest `boxField`, docs page `box-field`, spec
`box-field.md`): padding (horizontal/vertical, split per side) and corner radius (one field,
split per corner) on the PanelRow grid with a pressed toggle in the trailing square. Five new
package glyphs (corner, corners, padding-side, padding-axis, sides; rotation for directions).
Figma recipe: padding in Layout; Independent corners opens a Popover with the four corners.
NumberField Escape now only claims the key during an edit. Figma's split layouts are
unmeasured (owner asked whether panels may be opened).

## Variant audit (2026-09-26)

Report-only audits of every in-review family plus Panel ran; findings are in the session
report (missing size/state tiles, no specs for the color family, alignment picker, toolbar
and input group, disabled dimming, Menu selected state). Nothing from them is fixed yet.

## Approvals, Composer radius, resizable Panel (2026-09-26)

Owner: every built component without requested changes is approved — all former In review
families moved to COMPLETE (specs marked accepted). Composer: option B — the send action is an
Area Button (8 radius) and the shell corner is concentric (button radius + 8 = 16; `submitPill`
makes both pill); resting shadow removed. Panel `resizable` ("start" | "end", width /
defaultWidth / onWidthChange / minWidth 240 / maxWidth 500): window-splitter separator with
Figma's 8px handle (6 out, 2 in), cursor-only hover, directional cursor at limits, 4px focus
pill; captures in `captures/resizable/`; spec `resizable-panel.md`. Panel is back In review.
Variant-audit findings (ButtonGroup selected/hover bugs, InputGroup icon boxes, missing tiles,
unspecced color family/toolbar/input group) are not fixed yet.

## Panel audit (2026-09-26, in review)

Bar action on the action column (Figma 208), lg rows and a bar that follows the tier, PanelRow
tiles at matching control sizes plus xs/md/lg/flush/bare-bar tiles, named panels are regions,
`PanelSection headingLevel`, docs API/examples, Property list rows 28. Details in
`inspector.md` "Audit". COMPONENTS.md gained a product-specific inventory (ChatGPT, Notion,
Figma); Combobox is the recommended next foundation.

## Product-specific inventory, in order (2026-09-26, owner: "do each of them subsequently")

Gallery now sorts by RECENT_COMPONENTS first (newest leads). Built and in review, each with a
spec, captures where a target product had one, React test and real-event test script:
Combobox (Figma font size / font picker), CommandPalette (Notion search, 600 wide, 77 from
top), ContextMenu (Notion page menu at the pointer), HoverCard (700/300 ms, GitHub timing).
Package glyph `search` added (pilot circle redrawn as arcs). Next in COMPONENTS.md order:
ChatGPT conversation pieces (Message, MessageActions, ThinkingDisclosure, SourceChip,
AttachmentCard, PromptSuggestions, ModelPicker, ScrollToLatest, VoiceInput), then Notion,
Figma and shared groups. Chrome note: the ChatGPT tab sometimes hangs; screenshot scale can
differ between frames, so click by accessible name, not coordinates.

## List pass, suggestions choice, ChatGPT pieces (2026-09-26)

- One list model for Menu, Combobox, Command palette, Context menu (4 inset, 32 rows 2 apart,
  radius 8, corner 12, Menu label rows, icon gap 12); the palette's search icon, rows, labels
  and footer hints share one column. Footer items are keyboard hints, not controls.
- Prompt suggestions: owner delegated the choice; list is the default (radius 16 = composer,
  rows 2 apart), `layout="chips"` for narrow places.
- Built from ChatGPT captures (Chrome in front): Message + MessageActions, ScrollToLatest,
  ModelPicker (Menu gained `MenuItem.description`, two-line rows 48). Captures in
  `captures/{message,scroll-to-latest,model-picker,prompt-suggestions}`.
- Remaining ChatGPT pieces: ThinkingDisclosure, SourceChip, AttachmentCard, VoiceInput — need a
  chat that shows them and Chrome in front (hidden tabs stall timers; ChatGPT does not render
  turns while hidden). The user bubble's blue is the owner's accent setting, not ChatGPT's default.

## Badge md text (2026-09-27)

Owner: md badges read too large on Card; md text is now 12/16 (was 14/20) at 20px, weight
500; lg keeps 14/20. Gallery audit: all 120 md badges render 20px and no demo passes a stale
size or inline size override. Open: the 12px label hangs 0.7px below a 14/20 line (spec).

## Audit of post-audit families (2026-09-27)

Owner: "work on any components that have not been audited yet." The twelve families that
reached main after the cohesion audit were checked against its rules and fixed: see
`docs/research/cohesion-audit.md`, "Fourth pass". Biggest find: a later literal shadow drew the
shared lift's second layer at full strength on Menu, Popover, Dialog, Toast and the palette; the
cohesion test now checks the painted `box-shadow`. Seven owner questions are listed there.
Complete families touched: Box field, Button, Property list, Composer, Split button, and the
lift on Menu/Popover/Dialog/Toast. Status in `component-status.mjs` unchanged.

## Toolbar redesign and Pass reviews (2026-09-27)

- Toolbar redesigned from Figma's toolbelt (7 Claude in Chrome captures) and the owner's three
  reference shots: 8 inset, Figma's bar shadow, 8 spacing, command-height separators, a raised
  plate for pressed toggles (dark: `bg-component-active`), `ToolbarGroup variant="track"`
  (Figma's mode switch), selects hug their options. Tiles Tools, Content / text formatting,
  Behavior / overflow. Back In review. Spec `toolbar.md`.
- Every family now opens with a Pass review: audit, visual pass and Claude in Chrome evidence
  read from the repo, the default tile at 2x (inert copy). Validated needs an entry in
  `apps/docs/src/pass-status.mjs`; only Toolbar has one. Process doc and both skills updated.
- Chrome notes: the gallery uses smooth scrolling, so scroll with `behavior: "instant"`; the
  gallery tab can freeze the extension, so move captures out with the 127.0.0.1 relay.
- Open: Segmented's selected shadow vs the toolbar plate; a 24px-icon "tools" size (Figma).
- Hydration (#418) fixed: GalleryPanelFlush / BareBar were exported by both gallery.tsx and
  gallery-variants.tsx (server rendered one, client hydrated the other; registry.tsx now throws
  on a duplicate demo name), and HoverCard demos sat in a <p> the HTML parser split. A fresh
  gallery load logs no #418; the two remaining 404s are the Avatar fallback demo's missing image.

## Card consistency pass (2026-09-27, in review)

One geometry rule: text inset = inset + (control − cap) / 2 with the first line trimmed to the
cap and the last to the baseline, so a title is as far from the top as from the side (18.3 at
md); header and footer controls sit on the inset, concentric. One type ramp (title 16/24, body
14/20, value 32/40) at every size; size is corner and inset only. Media inset everywhere but
bleed (immersive too), 16:9 by default. Templates: video, music, weather, stat, plan, feature,
all md (news and tool removed); tiles size-md, horizontal-stacked, horizontal-bleed removed.
Carousel rebuilt (reaches the inset, 3.25 items, header paging; demo `GalleryCardCarousel`,
hydrated; only Gallery/Badge/Switch/Slider demo names render with hydration markers, see
`render.mjs`). Spec `card.md`. Unverified: smooth paging (browser windows were in the
background), Firefox and Safari.
