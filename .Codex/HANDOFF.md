# Handoff — 2026-09-23

## Current checkpoint

- Branch `main`; GitHub `origin` is canonical. Do not commit or push without current
  authorization. The working tree contains this session's Tooltip, NumberField and
  InputGroup work.
- Tooltip's 8px diamond rounds only the exposed corner for each side. It is reopened
  as In review.
- NumberField is built at normal `md` density with expression entry, range and step,
  keyboard increments, optional steppers/scrubbing/units, locale formatting, mixed
  values and Field validation. Steppers now use Fluent 12px chevrons and a narrower
  column. It is In review.
- The component gallery adds text, search, date, phone, password and unitless number
  specimens. InputGroup has balanced visual slots for matching letters/icons, soft
  paired independent fields, affixes, unit/country selectors and search actions. It is
  In review. The X/Y screenshot shows two independent soft fields, not one shared shell.
- NumberField stepper hover paints the full rail. Toast action/dismiss variants now
  measure the same 38px height as a plain Toast at normal density. Toast is In review.
- ButtonGroup is built with independent icon commands and a text toggle; it is In review.
- TreeView and Composer are built at normal density and shown in the component gallery,
  both In review. TreeView has navigation and checkbox modes, controlled/initial state,
  keyboard traversal and a current marker. Composer has inline/stacked layouts, native
  multiline entry, working send controls and optional action slots.
- InputGroup now uses one outer focus treatment and 32px square visual slots with
  control-sized letters. Browser checked focus, tree navigation/selection, composer
  submission and multiline growth. Docs build and typecheck pass; recheck after changes.

## Next roadmap

Continue the inspector foundation with Toolbar, AlignmentPicker,
composable color controls, then Position/Auto layout/Appearance/Fill/Stroke/Effects
inspector recipes. Add overlay placement and focus behavior before advanced pickers.
Keep inspector recipes at the normal system density for now; the user deferred dense
versions of all components to a later pass.
The broader proposed catalogue is in `docs/COMPONENTS.md`.

## Next session

Read this section and `docs/COMPONENTS.md`, then continue Toolbar. Review the new and
refined components with the owner; only owner-confirm completion in
`apps/docs/src/component-status.mjs`.


Branch main; substantial uncommitted changes. Do not commit/push without authorization.
GitHub origin is canonical. Preview: http://localhost:4321/gallery.html.

## Tooltip, gallery panel and expansion research, 2026-09-23

Tooltip's default gallery specimen omits the pointer; a separate withIndicator example
uses the existing arrow boolean with a 1px rounded tip. Side and shortcut examples keep
that default. Tooltip is reopened as In review. The gallery customizer now uses the
normal rounded Panel with shadow-2 and a proper md icon Button; the collapsed container
preserves the button's square size and allows its focus outline to paint outside.
Browser verified default/indicator, Enter expand/collapse, 32px default and 28px compact
buttons, 16px icons, 12px panel radius and subtle shadow. Restored default UI scale.
Docs/package build, dogfood audit, typecheck and 14 contract tests pass.

Expanded docs/COMPONENTS.md with official-source research and review of all six supplied
references. First proposed additions: NumberField (steppers/scrubbing/units), InputGroup,
Toolbar/ButtonGroup, AlignmentPicker, composable color controls and inspector recipes.
Most md controls should inherit compact UI density; this is Area guidance, not a claim
about Figma's internal APIs. Broader catalogue gaps and overlay behavior prerequisites
are recorded as proposals, not shipped components. No new input families built yet.

## Stroke, fill and toast pass, 2026-09-23

Audited neutral strokes against their existing contrast floors across light/dark and
neutral/warm/cool palettes. Each shared border rung is already the lightest one that
passes its role's floor; required control strokes also need their current rung to clear
3:1 on the darkest/lightest neutral fills. Kept the neutral fill progression because
the resting light fill is already #f7f7f7 against white, with the next rung at #fafafa.
Popover, Menu and searchable Menu now use the same decorative edge as Card, Dialog and
Toast; the popover arrow matches its shell. The multiline Toast demo is 240px wide and
measures exactly two 20px lines. Toast icons align with the first line in every layout;
8px vertical/10px horizontal padding gives the 16px icon equal 11px optical insets.
Browser checked light and dark popovers and light toasts. Docs build, typecheck,
19,491 token tests, 12 gallery primitive tests and 370 contrast assertions pass.

## Tabs, Nav and Dialog refinement, 2026-09-22

Tabs underline now spans the selected control including its icon or count; vertical tabs
retain the leading marker. The gallery splits Tabs icons/counts/disabled and Nav
groups/icons/counts/actions/expansion into distinct specimens, and simplifies the
horizontal Nav. Also separated mixed Menu, Table, Alert, Toast and Segmented specimens.
Dialog now has an optional close control (default on), title/description associations,
24px inset and section gaps, 18/26 title, scrollable body and an undivided footer.
Native modal close and focus return were browser checked. Gallery screenshots covered
Tabs, vertical/horizontal Nav and Dialog; the scrollable example has a 288px surface,
129px body viewport and 244px scroll content. Docs build/audit (46 pages, 583 demos),
typecheck, 61 React tests, 14 contracts, 19,491 token tests and diff check pass. The
browser viewport override is unavailable, so 390px was not rechecked in this pass.

## Code block redesign, 2026-09-22

Rebuilt CodeBlock on the [Geist Code Block](https://vercel.com/geist/code-block) anatomy,
with Area tokens rather than Geist's measurements. Every block now renders a header row
(filename, language, actions), a 32px line-number gutter, and one grid row per line, so
the variants compose instead of each needing its own markup:

- `title` / `language` add the header; without a title the copy control floats over the
  first line, which keeps a long first line clear of it.
- `languages` turns the label into a Select; `languageTabs` renders a tablist over the
  same code, with arrow keys and the code body as the panel. `value` / `onLanguageChange`
  are optional (uncontrolled defaults to the first language).
- `highlightLines` takes numbers or `"3, 5-7"`; `marks` takes added/removed per line and
  paints a glyph in the gutter as well as a tint.
- `linkLines` makes each number an anchor to its own row. The target paints from `:target`
  with no script and the reference travels in the URL.
- `lineNumbers={false}` is the hidden-number variant; `collapsible` / `defaultCollapsed`
  restore the show/hide control inside the component (it was docs-chrome-only before).
- Copy is built in and on by default: it copies the code without the gutter, swaps glyphs,
  and announces through a polite live region. `copyable={false}` opts out.

Syntax palette is four measured vivid rungs: red keywords (danger), purple tags
(discovery), blue attributes (info), accent strings. Punctuation and comments stay
muted. Strings follow the accent axis, so a pink accent produces pink strings -- pink has
no contrast-gated role of its own, and a palette literal would ship unreadable in dark
mode. `SYNTAX_ROLES` in `packages/tokens/src/contrast/assertions.ts` moved from
`success` to `info` to match. The remaining weakness is measured, not assumed: dark mode
puts blue and indigo 0.024 apart in OKLab (JND 0.02) and purple 0.035 from indigo, so the
two near pairs are the tokens that carry their own delimiters (`"…"`, `<…>`), while the
two bare identifiers that would genuinely be confusable, tag and attribute, are 0.059
apart. `code.css` records the numbers.

Docs chrome follows the same anatomy: the docs highlighter now highlights per line and
emits `area-syntax-comment` for a line that starts with `//`, and `codeBlock()` in
`layout.mjs` emits numbered rows. The delegated copy handler reads the text cells rather
than `pre.textContent`, so pasted code never carries line numbers, and it now swaps to the
check glyph and announces -- the previous handler looked for an `.area-button__label` the
icon-only toolbar button never had, so its "Copied" feedback threw instead.
`TOOLBAR.check` was added to `gen-icons.mjs` and the icons regenerated (catalog unchanged).

New plumbing: `apps/docs/src/code-block-client.tsx` hydrates `[data-code-block-demo]` on
the gallery and the code-block page, because copy, the language picker and show/hide are
behaviour. Ten gallery specimens (default, no filename, highlighted, diff, referenced,
switcher, tabs, hidden numbers, wrapped, collapsed) plus eleven page examples share the
same demos, which pass pre-highlighted `html` so the palette is visible in the previews.

Checks: docs build + audit (46 pages, 565 demos), typecheck, 61 React tests, 14 contracts,
19,491 token tests, consumer check, preview tests, `lint:manifest`, `git diff --check`.
Browser-verified light and dark, default and compact, desktop and 390px: copy announces and
swaps, the Select and tablist both swap the code, ArrowRight moves tab selection, the
collapsed block measures exactly eight lines (184px), a line link paints its target, and
no console errors on the code-block, gallery, button, lab or contrast pages. The 390px
overflow seen on the gallery page comes from another section, not this one: with only the
code-block section open the document measures exactly the viewport width.

## Completion and placeholder copy, 2026-09-22

Every family that ships is now owner-confirmed complete: `component-status.mjs` lists
all 31 component pages, `REVIEW_COMPONENTS` is empty, and README, Components and the
Introduction page say the same. The gallery index reads 31 Complete, 0 In review, 0
Unrefined; refining a family is what reopens it.

All demo and gallery copy now uses one placeholder vocabulary, documented under
"Example copy" in `docs/DESIGN_SYSTEM.md`: the component's own name (`Button`, `Badge`,
`Chip`, `Code`), `Title`, `Label`, `Description`, `Body text`, `Action`/`Secondary`/
`Cancel`/`Delete`/`Undo`, `Item one`, `Option one`, `Value`, `1`, `Placeholder`,
`Error|Success|Warning message`. Size specimens name the tier, treatment/tone matrices
name the value, and icon-paired labels keep their meaning (`Top`/`Middle`/`Bottom` with
alignment icons, `Add item` for a plus icon-only button). Inline controls that show every
option (Segmented, Tabs, chip rows) use the short ordinal `One`/`Two`/`Three` so the
track does not truncate. Invented people, products and projects are gone; only the RTL,
long-text and zoom verification fixtures keep their stress copy.

Two stale tests left over from the naming pass were corrected: chip tests used the old
`variant` prop instead of `kind`, and the slider test asserted the removed `track`
variant and `area-slider--label-top`. Panel gallery tiles were renamed Default/Sections/
Footer, and the Badge custom-tone tile "Custom tone".

Checks: docs build + dogfood audit (46 pages, 559 demos), typecheck, 56 React tests,
14 contracts, 19,491 token tests, consumer check, preview tests, `lint:manifest` and
`git diff --check` all pass. Browser-checked the gallery index, avatar/badge/table/panel/
segmented/input/kbd/dialog sections and every component page for clipped text; only the
intentional truncation and verification fixtures clip. Light desktop only; narrow
widths, dark mode and the lab fixtures were not re-inspected for this copy pass.

## Variant naming pass

Reviewed all 41 manifest entries (60 axes, 174 named values, 35 flags) against React,
CSS and docs. Chip interaction categories use `kind`; Card layouts use `horizontal`
and `compact`; Switch `labelPosition` uses `start`/`end`; Slider top labels use the
`labelPosition` axis. Removed Slider's no-op `variant="track"`. Table `interactive`
and CodeBlock `flush`/`wrap` are independent booleans; the latter can combine.
These are API/class renames in the unpublished local packages. Existing Button/Badge
`variant` remains visual treatment; specialized Kbd/Panel size names remain deliberate.
Docs build/audit, typecheck, 14 contracts, 12 focused component tests, consumer check
and diff check passed. Browser confirmed renamed specimen classes and computed layouts.
Owner completion status unchanged. The earlier Tabs/Switch tier-gap edits remain
uncommitted alongside this pass.

## Latest work

Tabs: Fluent-inspired transparent hover indicators, flush horizontal content alignment,
leading-edge vertical indicator; retained close rounded label-width underline. Vertical
gallery replaces manual activation with automatic. Shared inset exemption fixes alignment.
Docs build/audit, typecheck, 3 component tests, 14 contracts, 19,491 token tests and 370
contrast assertions passed. Browser checked light desktop alignment and horizontal/vertical
keyboard selection. Dark/narrow and screen-reader checks not repeated.

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
