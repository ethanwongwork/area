# Adapting an open-source component

Use this workflow for new Area components and material component refinements. Start
with working source, not a screenshot approximation. Keep the record short; the working
component and examples are the deliverables. Update this document as evidence improves it.

## Two passes, one component

Read [Design references](DESIGN_REFERENCES.md) to choose a primary structural source.
Use the repository’s `area-visual-language` skill for the visual pass. The existing
DESIGN_SYSTEM.md, inset.css and CONTRAST.md remain the actual token/geometry constraints.
Reuse Area’s existing implementation when it already has sound structure; a small fix
only needs research when a concrete uncertainty remains.

Untitled UI is the default first reference. Gallery specimens show one variant per tile;
compare separate tiles rather than placing a variant matrix inside a specimen.

**Structure pass:** map shell → content region → text/icon/action slots. Record which
layer owns height, padding, gap, alignment and hit area. Preserve proven source geometry.
**Visual pass:** apply Area type, semantic fill/ink/stroke, radius roles, icon cuts and
state hierarchy. Check the result beside accepted Area peers at the same UI density.
Resolve a geometry problem in the structure pass rather than hiding it with paint.

## Slot ownership

A shell owns its outer dimensions, border and shape. A content region owns shared text
layout. A square icon slot owns the icon viewport; an action slot can own a larger hit
area and its own inset. A text wrapper owns truncation and multiline alignment. Use a
wrapper when it has one of these independent jobs, not merely to add a corrective offset.

Area examples: InputAction (`area-input__action` → action-button → action-icon),
Input’s affix/control/icon slots, and InputGroupText’s visual slot. These are concrete
examples of the nested-span pattern the owner described; the exact earlier component
was not identified. Prefer independent slots when their geometry genuinely differs.

Write the inset equation before adding values: outer inset = border + shell padding +
slot inset. Count the border once. A parent gap separates siblings; it does not replace
an edge inset. Avoid double-padding a slot already inset by its parent. Respect inset.css,
square native icon viewports and first-line alignment; never move individual glyphs.

## Repeatable workflow

1. **Choose a structural match.** Search official repositories for the requested component
   and variants. Read implementation, CSS, types, tests and accessibility behavior. A
   product screenshot can guide appearance but does not establish CSS dimensions.
2. **Pin and attribute.** Resolve a commit SHA, record source paths and license, retain the
   required notices with redistributed code. Verify icons separately. Do not copy code
   whose license is unavailable or incompatible. Fetch public source directly; do not
   scrape rendered marketing HTML as a substitute for implementation.
3. **Capture the contract.** Note actual source dimensions, DOM structure, layout, state
   mappings, keyboard behavior, accessible names and defaults. Distinguish source facts
   from Area choices. Identify which variants solve real use cases.
4. **Translate narrowly.** Preserve geometry and behavior first. Replace framework-specific
   styling with Area CSS and tokens. Map typography, paint, radius roles and spacing;
   reuse existing Area primitives. Keep axes independent. Any dimensional change gets a
   concrete reason. Preserve native icon paths and size-specific cuts; no glyph nudges.
5. **Integrate together.** Update CSS, manifest, React/types/refs, source-shared examples,
   public docs and exports. Test the boundaries that could fail: state transitions,
   accessible names, overflow, count formatting, disabled/hidden behavior, RTL.
6. **Inspect and iterate.** Build/typecheck; run relevant tests and browser measurements.
   Inspect light/dark, representative sizes and narrow layouts. Confirm behavior as well
   as appearance. Record failures and unverified environments. Stay In review until the
   owner accepts; passing tests alone are not visual approval.
7. **Learn from feedback.** Add a dated, concrete lesson to the component record: observed
   problem → change → evidence. Correct earlier assumptions explicitly. Promote a lesson
   into this workflow only when it applies beyond that component.

### Copyable record

- Component and date:
- Source repository / commit / paths / license:
- Preserved structure and behavior:
- Slot ownership (shell / content / icon / text / action):
- Area substitutions and reasons:
- Visual reference and evidence type (source / measured DOM / screenshot / design goal):
- Excluded variants and reasons:
- Checks / measured result / remaining limits:
- Feedback iteration (observation → change → verification):

## Indicator — initial adaptation, 2026-09-24

Source: [Mantine Indicator](https://mantine.dev/core/indicator/), MIT, Vitaly Rtishchev.
Pinned commit: `717124296bd80131b36eefbb73f32c5ec5c7871d`.
[Implementation](https://github.com/mantinedev/mantine/blob/717124296bd80131b36eefbb73f32c5ec5c7871d/packages/@mantine/core/src/components/Indicator/Indicator.tsx),
[CSS](https://github.com/mantinedev/mantine/blob/717124296bd80131b36eefbb73f32c5ec5c7871d/packages/@mantine/core/src/components/Indicator/Indicator.module.css),
[position helper](https://github.com/mantinedev/mantine/blob/717124296bd80131b36eefbb73f32c5ec5c7871d/packages/@mantine/core/src/components/Indicator/get-position-variables/get-position-variables.ts).

- Translated its absolute-position / half-size-translation model to logical CSS: nine
  positions, offset, hidden attachment. Kept a separate IndicatorAnchor for Area composition.
- Preserved 10px activity dots, centered nowrap labels, optional cutout, max count and
  show-zero rules, and the source's processing pulse (1s at Area default motion) (opacity .6→0, scale 0→2.8).
- Area uses 16px count height and 5px text gutters: readable Area extra-small type, distinct
  from the source's default 10px indicator box. The border is a 2px surface halo so it
  does not consume the small label's box. Compact/circular attachment offsets remain
  Area options. Surface halo, typography, full radius and six tones consume Area tokens.
- Added full uncapped accessible count, finite/nonnegative count normalization and reduced
  motion handling. Attached indicators are decorative; the owning control names the state.
- No arbitrary color/radius/z-index API: semantic tones and CSS tokens own those concerns.
  No freeform label: short numeric counts and activity dots keep the role distinct from Badge.

## Presence — initial adaptation, 2026-09-24

Source: Microsoft Fluent UI PresenceBadge, MIT.
Pinned commit: `d27922755bebae866d9ffe86b7da44c27ec801ee`.
[Status selection and semantics](https://github.com/microsoft/fluentui/blob/d27922755bebae866d9ffe86b7da44c27ec801ee/packages/react-components/react-badge/library/src/components/PresenceBadge/usePresenceBadge.tsx),
[styles](https://github.com/microsoft/fluentui/blob/d27922755bebae866d9ffe86b7da44c27ec801ee/packages/react-components/react-badge/library/src/components/PresenceBadge/usePresenceBadgeStyles.styles.ts),
[icon mappings](https://github.com/microsoft/fluentui/blob/d27922755bebae866d9ffe86b7da44c27ec801ee/packages/react-components/react-badge/library/src/components/PresenceBadge/presenceIcons.ts).

- Translated the actual eight-status mapping and out-of-office alternatives. Preserved
  role=image semantics with overridable accessible labels, circular box, centered icon
  and source 1px background clip / -1px icon margin for antialiasing. That paired geometry
  is not an optical nudge: it prevents backing color leaking beyond the SVG silhouette.
- Native Fluent 10/12/16/20px cuts become Area xs/sm/md/lg. No scaled 6px tiny or 28px
  extra-large options: upstream maps those to differently sized cuts. Geometry is generated
  verbatim from the lockfile-pinned @fluentui/svg-icons package using gen-icons.mjs.
- Replaced Fluent paint with Area success/warning/danger/neutral/discovery solid and paired
  foreground tokens. Filled glyph holes show their paired foreground; out-of-office
  variants use the surface backing. Radius stays full because these encode circular states.
- Exported Presence separately. The old Indicator status prop delegates to Presence for
  compatibility and is deprecated; examples now use Presence directly.

## Lessons to carry forward

- **2026-09-24 browser correction:** the global SVG max-width reset shrank Presence
  glyphs by 2px inside Fluent’s padded backing. Removed that max-width constraint on
  the owned SVG slot; keep the background clip and verify intrinsic/rendered sizes.

- **Native icon cuts matter:** a 16px slot does not justify scaling a 20px SVG. Preserve
  each supplied cut and verify both viewBox and rendered dimensions.
- **Do not merge distinct roles:** counts/activity belong to Indicator; availability has
  shape-specific status semantics and belongs to Presence; text tags remain Badge.
- **Source is a starting contract:** preserve behavior, but document additions such as
  reduced motion and logical RTL positioning. Do not silently copy source limitations.
- **Keep provenance distributable:** required MIT notices live in the React and styles
  package file lists as well as the repository root.

## Verification for this adaptation

- Build/docs audit and typecheck passed; 85 React tests passed, including count boundaries,
  zero hiding, status semantics, native cuts and out-of-office mappings.
- 19,491 token tests, 370 contrast assertions across 66 themes, and consumer packaging
  checks passed. These do not establish contrast on arbitrary consumer backgrounds.
- Browser: measured Presence box and SVG at 10/12/16/20px, dots at 10px, count height at
  16px with 5px gutters. Inspected nine placements, light/dark and Presence at 390px;
  zero toggle worked and motion=none produced a 0s animation. Restored light/subtle.
- Cross-engine, native screen-reader and forced-colors execution remain unverified.
  Both components remain In review. Existing unrelated gallery-wide narrow overflow
  remains outside this adaptation.


## Gallery structure mode

Click **Inspect structure** in the gallery. Hover a specimen and click to pin it; select
its DOM elements in the layer list to inspect nested divs, spans, icons and actions.
The overlay shows margin, border, padding and content; the panel reports dimensions,
row/column gap, alignment, radius, paint, type, shadow and SVG viewBox from computed CSS.
**Pick another component** resumes picking; Down on that button selects the first visible
specimen for keyboard inspection. Escape exits. Inspection captures specimen clicks;
exit before testing their normal interaction.

The tool does not modify component layout. Values are resolved CSS pixels, not token
provenance or optical ink bounds. Axis-aligned boxes approximate transformed elements;
negative margins and pseudo-elements are reported rather than fully visualized. Use
browser DevTools for source-rule provenance, flex/grid tracks and accessibility trees.


## Owner follow-up — September 24 evening (supersedes initial adaptation)

- Untitled UI is the preferred starting source and visual reference.
- Presence is now part of the Indicator family: `Indicator status="available" size="sm"`.
  `Presence` remains a compatibility export/internal renderer; its separate gallery and
  docs family were removed. Dot/count continue to use their own structural rendering.
- Filled available/away/DND icons looked too heavy. Switched to unmodified native Fluent
  Regular cuts with surface backing. Busy remains Fluent’s solid dot (no Regular cut).
- Four corner placements suffice; removed middle/center placements and the nine-position
  matrix. Each status, size, out-of-office state and count gets a separate gallery tile.
- Rectangular compact inset is now a stable Area 4px token, instead of a percentage that
  changes with label width. Circle attachment center sits on the 45-degree rim:
  `(1 - 1/sqrt(2))/2 = 14.64466%` inset on each axis. Compact no longer cancels it.
- Native browser inspection: @Browser can inspect DOM/applied styles; annotation Adjust
  supports style feedback. Full CDP Developer mode is optional and permission-gated.
  The gallery inspector remains a convenient local measurement UI, not a requirement.
