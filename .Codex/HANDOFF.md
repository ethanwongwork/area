# Handoff — 2026-09-22

Branch main; substantial uncommitted changes. Do not commit/push without authorization.
GitHub origin is canonical. Preview: http://localhost:4321/gallery.html.

## Latest work

Menu control composition rows now use control-md (32px default, previously 48px),
with the existing 2px gaps; removed the checkbox's forced 16px wrapper. Nav action
rows share a single backplate around sibling link/buttons. Overview demonstrates
Save and Follow toggles with accent icon state and no individual plates. Browser
checked both toggles and menu spacing; build, typecheck and 14 contracts passed.

Visual consistency pass: reviewed all 21 pending families in light/default, sampled
compact/dark and 390px layouts. Centered Segmented gallery specimens, standardized
success Toast width, and right-aligned striped Table numbers. Fixed collapsed gallery
Customize rail occupying 280px: use Panel's public width hook and place collapsed
chrome rules in the utilities layer. Restored light/default and desktop viewport;
no browser console errors. Approval status unchanged.

Newest pass: Skeleton cards have two text lines; type samples fill the trailing half.
Table tiles are 2×2; compact, striped and column-divider examples are separate.
Headers center vertically. bg-stripe maps neutral 25 light / 800 dark and joins text
contrast assertions. Tabs use 2×1 tiles, rounded label-width underlines and optional
track. Toasts use 8px vertical padding and first-line icon alignment, with a separate
multiline example. Tooltip arrows are 8px with all four directions shown.
Popover examples omit pointers and share 240px width, 12px insets/group gaps,
full title line boxes, 14/18px descriptions and evenly inset close buttons.

Skeleton's 300×300 card has a 96px media region above the circle and an 80px button.
Segmented exposes
iconOnly with accessible hidden labels, square inner buttons and a hydrated example.
Select's enhanced native picker uses block-end anchor positioning, 4px gap and no flip
fallback; unsupported browsers still own native placement. Popover uses Tooltip's
UI type/shadow with the shared geometry described above.
Fixed the overflowing field and media, with concentric media corners. It remains a
themed surface (white in light mode). Dialog uses one 16px border-inclusive inset, 16px
section gaps, 8px title-description gap, 16/24px title and UI body type; form input fills
its column. Browser checked all changed specimens, picker placement, icon-only arrow
selection and modal Escape. Build/audit, typecheck, 8 component and 14 contract tests pass.

Fixed the broken Panel: a stray closing brace in surface.css caused the browser to
discard the following panel layer. Styles build now parses bundled CSS with esbuild and
fails on warnings. Panel remains 280px, with compact header, separate small heading rows,
8px section gaps and medium control-height Field rows independent of inset size.
Frame inspector and other panel examples fit 2×2 gallery tiles.

Nav defaults to 200px vertical width; horizontal nav and backplates hug their items.
Gallery centers both orientations. Added icon/count/status examples and independent
NavItem actions outside anchors; live save toggle and expandable project rows.
Collapsed chevrons rotate with aria-expanded.

Refined the four remaining families; all are In review, not owner-approved:
- Table: small/medium/large insets, striped and selected states, correct numeric alignment;
  native sorting/selection composition plus empty/loading examples.
- Tabs: medium default UI type/control height, three sizes, horizontal/vertical,
  automatic/manual activation, disabled and icon/count examples; hydrated demos.
- Textarea: horizontal insets exceed vertical at every tier, borders counted once;
  labeled character-count example alongside existing validation/resize states.
- Toast: UI type, title/content/action slots, explicit dismissal and live content;
  four tones and working Undo. A surface, not a queue/timer system.

API docs/manifests/helpers and gallery sources align. Research references are in
docs/COMPONENTS.md (WAI tabs, Carbon table, Spectrum toast, Atlassian textarea).
Consumer fixture corrected: CodeBlock title is supported; invalid layout remains rejected.
Gallery SSR now uses renderToString (including text-node boundaries) for hydrated
examples. This fixes the text hydration errors found during final browser verification.

## Preserved earlier work

Skeleton card is 300×300 with circle, varied text lines at consistent gaps and a wider
button placeholder. Type-height skeletons have left labels and fixed right-aligned widths.
Popover has Header/Title/Description/Body/Footer/Media and side/arrow APIs, 1×1 examples;
rich image/action compositions moved out of Tooltip. Tooltip retains its diamond
pointer; Popover uses the curved SVG described above.

Number input still uses native Input type=number. Dedicated Area steppers, split
color/opacity input and nine-point alignment control remain in the component backlog.

Ten owner-approved families remain Badge, Button, Checkbox, Field, Input, Slider, Card,
Avatar, Alert and Chip. Other existing families await review. Palette unchanged.

## Verification

Passed: docs/package build and audit, typecheck, 8 focused React tests, 14 contract tests,
isolated consumer checks, 18,402 token tests and 350 contrast assertions across 66 themes.
Browser visually checked repaired Panel and centered Nav in light/default and
dark/compact; restored light/default afterward. Verified nav disclosure/save toggle,
table sorting/select-all, automatic and manual vertical tabs, textarea count and toast
Undo/dismissal. DOM geometry evaluation timed out; do not claim measured dimensions.
Cross-engine, screen-reader and narrow-viewport behavior remain unverified.

Stop the dev watcher before full builds/typecheck to avoid declaration rebuild races.
