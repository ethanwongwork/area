# Switch approval packet — 2026-09-18

**Status: superseded by owner correction 2026-09-18.** This file preserves the first
approval and explains why the initial build became too broad. The corrected decision is
in [construction/01-selection.md](../construction/01-selection.md) and the final contract
is in [component-audits/switch.md](../../component-audits/switch.md). Owner initially approved building
and verification of this packet, including the construction completion proposals.
This packet combines prompts A and B; approval authorizes C plus fixes for implementation
mismatches in D. It does not approve unrelated work, publishing or a commit/push.

## Approved decision

Approve the construction entry's base table plus the completion proposals below,
all 23 family Build list rows, the manifest and native-input behavior contract.
[Measured evidence and CSS differences](../construction/01-selection.md#switch-status-revised-and-owner-corrected-2026-09-18)
remain the research record. All additional geometry below is an **Area design proposal**,
not a newly discovered benchmark measurement.

- Base track sizes xs/sm/md/lg/xl: 24×12, 28×16, **40×20**, 40×20, 48×24.
  These remain fixed in both densities. Compact changes label type as recorded.
- Pill/circular identity by default; explicit rounded track with concentric thumb.
- Inset space-2; label gap space-8; above-label gap space-4.
- Retain all five public tiers. md/lg duplicate geometry is intentional compatibility.
- Use the brief's eight standard tones plus custom, so the matrix is 2 variants × 9 tones.
  Pill remains the matrix default; rounded gets separate cases.
- Preserve a native checkbox input with role=switch, input ref, name/value, required,
  checked/defaultChecked, onChange and reset behavior in every mode. Loading does not
  require a button implementation.

## Geometry completion proposals

All names have prefix --area-. These close the previous entry's build-blocking n/p
decisions; upstream n/p measurements remain honestly unknown.

| Case | Proposed construction | Reason / evidence relationship |
| --- | --- | --- |
| Thumb media at every tier | For icon or in-thumb spinner, effective track height = max(base height, space-20), effective width = max(base width, space-40). Media box space-12; xl space-16. Effective thumb = height−2×space-2 | Preserves readable icon box with inset. Material supplies a distinct with-icon handle; exact Area promotion is a proposal. xs/sm media examples must disclose promotion |
| Outline off thumb | Plain off thumb diameter/height = solid thumb−space-2, centered in same endpoint box; checked returns to solid thumb. With thumb media, keep full thumb to avoid clipping | Area state-size proposal informed by Material's varying handle; not a claim Fluent uses this exact delta |
| Rounded thumb | Width = (effective track width−2×space-2)/2; height as above; radius = max(space-0, capped outer radius−actual inset). For smaller outline thumb, increase inset symmetrically and recompute concentric radius | Primer supports half-width knob; Radix supports concentric radii. Prevent same-radius nested rectangles |
| Track icons | Each half owns a centered space-12 icon. Use media minimum geometry above; on/off positions mirror in RTL | Primer and Atlassian establish half-track state icons; exact Area box is proposed |
| Track text | Each half gets a reserved slot equal to max(on-label width, off-label width, thumb width)+2×space-4. Track width = max(base/media width, 2×slot width+2×space-2); height at least space-20. Type control-xs-text/leading at current density | Content-driven width handles localization; replaces unverified “add 12px”. Same width in both states, no clipping or state jump |
| State text outside track | Reserve the widest on/off text with both strings in one grid cell; inactive string visually hidden and aria-hidden. Use tier type and space-8 gap | Primer's hidden status string establishes width reservation; no guessed fixed text width |
| Active stretch | Thumb widens by space-2 towards its travel direction, bounded by available track content width. Recompute checked offset to retain far-edge inset; cancel under reduced motion if translation is suppressed | Area proposal; not the family skeleton's literal 3px |
| Label/caption | Existing tier label type and first-line cap alignment. Caption control-sm-text/leading with space-2 gap; wrap beneath label. Required mark follows Field styling | Preserve existing Area contract |
| Settings row | Full width, min block-size control-lg plus vertical padding space-8 per side; label-start, track at inline-end; height grows with content | Area composition choice, not an asserted Notion measurement |
| Card | Existing Card surface/radius; content padding space-16, title-row gap space-8; track aligned with first title line | Compose existing component contract; entire noninteractive content labels the input |
| List | Existing Panel containing four settings rows, existing decorative separators; group named with role=group and aria-labelledby | Composite's children are its content |
| Hit area | At least space-24 each axis; coarse calc(space-40 + space-4), separate from paint; prevent hit overlays from covering adjacent controls | Area accessibility choice; Primer evidence includes coarse 44 target |
| Loading beside track | Spinner space-12; reserve its slot to avoid shifts; label-side gap space-8 | Primer has an adjacent spinner; Area size is proposed |
| Motion/focus | duration-fast for paint/active width, duration-slow and ease-out for thumb travel; existing motion axis. Focus-width/offset/color around track | Existing tokens; no new timing literals in CSS |

No new geometry tokens required. Track text width is intrinsic layout, not a missing
pixel token. Custom paint exposes --area-switch-on and --area-switch-on-fg, falling
back to accent-solid and fg-on-accent; custom contrast is checked for demos and documented
as the consumer's paired-color obligation. New semantic aliases, if emitted, belong in
packages/tokens/src/emit/base.ts with no @property registration for derived values.

## Existing Area baseline

Switch is generated by choice() in packages/react/src/components/forms.tsx. It already
has a native input, label/description, five tiers, checked/defaultChecked, native props
and input ref. Manifest has size only, data-disabled and control element. CSS in
choice.css paints the input and pseudo-element thumb; no slots for thumb media.
Docs expose SwitchDefault and SwitchSizes; the latter combines on/off cases.
The dedicated audited gallery section and full variants/behavior coverage are absent.
The native/ARIA bridges and description associations must be checked, not presumed
complete merely because native props are accepted.

## Build checklist (all family rows)

Source codes are the family file's attribution, not claims newly verified in this plan.
Geometry evidence is in the construction table. NOT/FIG/HIG product claims remain
unverified for API specifics; implement the owner-requested capability as an Area
contract and do not attribute invented APIs to those products.

- [x] 01 **extend — solid** (OAI SHA GEI HIG MUI): SwitchDefault; SwitchVariantSolidOff/On.
- [x] 02 **new — outline** (FLU M3): SwitchVariantOutlineOff/On.
- [x] 03 **exists — pill default** (family: all; measured support OAI SHA M3 CAR): SwitchShapePill.
- [x] 04 **new — rounded** (PRI): SwitchShapeRounded.
- [x] 05 **extend — tones accent/neutral/success/danger/custom** (SHA GEI HIG MUI; brief adds info/warning/caution/discovery): SwitchMatrix{Solid|Outline}{Tone}; one cell per tile.
- [x] 06 **extend — size family** (OAI SHA PRI FLU GEI CAR ATL MUI HIG): SwitchSizeXs/Sm/Md/Lg/Xl. Preserve xs/xl as existing Area tiers.
- [x] 07 **new — thumb icon** (M3 CAR MUI-Joy): SwitchThumbIconOff/On; SwitchThumbIconSize{Tier}. CAR's measured glyph is recorded separately, not claimed as the same anatomy.
- [x] 08 **new — track icons** (PRI ATL): SwitchTrackIconsOff/On.
- [x] 09 **new — track text** (MUI-Joy): SwitchTrackTextOff/On; SwitchTrackTextLocalized.
- [x] 10 **new — state text start/end** (PRI CAR): SwitchStateTextStart/End.
- [x] 11 **extend — label end/start/above** (OAI FLU): SwitchLabelEnd/Start/Above.
- [x] 12 **extend — description and multiline label** (NOT HIG SHA): SwitchDescription.
- [x] 13 **exists/verify — hidden label with accessible name** (all): SwitchHiddenLabel.
- [x] 14 **extend — required mark** (FLU OAI): SwitchRequired.
- [x] 15 **exists — inline** (all): SwitchInline.
- [x] 16 **new — block settings row** (NOT FIG HIG SHA): SwitchSettingsRow.
- [x] 17 **new composition — switch list** (NOT HIG): SwitchList (one named group containing four rows).
- [x] 18 **new composition — switch card** (SHA): SwitchCard (one labeled choice card).
- [x] 19 **extend — rest/hover/active/focus/checked/disabled/disabled-checked/read-only/invalid** (OAI SHA FLU M3 HIG CAR): SwitchStateRest/Hover/Active/Focus/Checked/Disabled/DisabledChecked/ReadOnly/Invalid, one tile each.
- [x] 20 **new — disabled-focusable** (FLU): SwitchDisabledFocusable (one switch with an explanatory Tooltip).
- [x] 21 **new — loading both placements** (PRI): SwitchLoadingBeside/Thumb; SwitchLoadingAnnouncement.
- [x] 22 **new — optimistic update/rollback** (PRI pattern): SwitchOptimisticSuccess/Rollback.
- [x] 23 **new — drag thumb** (HIG M3): SwitchDrag; SwitchDragRtl; SwitchDragCancel.

No row is excluded. “Exists” still requires verification and an independent tile.

## Aliases and neighboring contracts

Toggle (Geist/Carbon/Atlassian) and ToggleSwitch (Primer) are searchable names for Switch.
Block maps to fullWidth; before/after map to label-start/label-end; status-label
position maps to stateTextPosition. These are aliases of treatments, not duplicate
components. Pill is existing behavior made explicit. The native required prop already
exists; its visible mark is the extension.

Checkbox stays separate for deferred commit, ToggleButton for pressed actions,
Segmented for mutually exclusive views. They are boundary references, not permission
to expand neighboring families in this Switch batch. SwitchList reuses Panel/group
markup; SwitchCard reuses the existing Card surface, with a Switch modifier for layout.

## Implemented manifest

```ts
export const switchControl = {
  block: "area-switch",
  description: "Toggles a setting that takes effect immediately.",
  aliases: {
    Toggle: "Switch", ToggleSwitch: "Switch",
    block: "full-width", before: "label-start", after: "label-end",
    statusLabelPosition: "stateTextPosition",
  },
  variants: {
    variant: ["solid", "outline"],
    tone: ["neutral", "accent", "info", "success", "warning", "caution", "danger", "discovery", "custom"],
    size: ["xs", "sm", "md", "lg", "xl"],
    shape: ["pill", "rounded"],
    labelPosition: ["label-end", "label-start", "label-above"],
    stateTextPosition: ["state-start", "state-end"],
    loadingPosition: ["loading-beside", "loading-thumb"],
  },
  booleans: ["full-width", "card", "thumb-icon", "track-icons", "track-text"],
  states: ["checked", "disabled", "disabled-focusable", "read-only", "invalid", "loading", "dragging", "hover", "active", "focus-visible"],
  stateAttributes: { checked: "checked", invalid: "aria-invalid" },
  elements: ["control", "track", "thumb", "thumb-icon", "track-icon", "track-text", "state-text", "text", "label", "description", "required", "spinner", "announcement"],
  elementModifiers: { "track-icon": ["on", "off"], "track-text": ["on", "off"], "state-text": ["on", "off"] },
  defaults: {
    variant: "solid", tone: "accent", size: "md", shape: "pill",
    labelPosition: "label-end", stateTextPosition: "state-end", loadingPosition: "loading-beside",
  },
} as const satisfies ComponentManifest;
```

State attributes apply to the state-bearing element; wrappers mirror disabled/read-only/
loading/dragging with data attributes for CSS, while native disabled, aria-disabled,
aria-readonly and aria-busy remain on the input. The checked adapter must correctly handle
the input property/pseudo-class after interaction, not only the initial HTML attribute.
Hover/active/focus demo data states do not replace real pointer and keyboard checks.
No extra manifest blocks are needed for list/Card/Tooltip compositions.

## React and behavior contract

Move Switch into its own module, retaining public exports and existing input ref/native
props. Preserve area-switch__control on the input; paint moves to sibling track/thumb.
Keep existing ChoiceLabel classes alongside new Switch text slots for compatibility.

New orthogonal props mirror the manifest. Add thumbIcon, checkedIcon/uncheckedIcon,
checkedText/uncheckedText, stateText, required display, loading, loadingPosition,
disabledFocusable, readOnly, invalid, draggable and onCheckedChange(next).
Slot content is decorative and must not create nested tab stops inside the label.

onCheckedChange may return a promise. Uncontrolled Switch applies the optimistic value,
marks busy, blocks additional changes, rolls back on rejection and exposes an error
callback/message. Controlled Switch never silently takes ownership: the parent owns
checked and rollback, illustrated with a separate controlled example. Ignore stale
settlements after reset/unmount/newer requests. Preserve onChange native semantics.
Loading announcement after 2000ms is an Area behavior proposal from the family checklist,
not a CSS geometry token; cancel the timer on completion/reset/unmount.

Read-only/disabled-focusable/loading suppress click, label, Space and drag activation;
read-only remains focusable and checked values remain form-submittable unless truly
disabled. No Enter handler on a checkbox. Focus indicator paints around the track.
Drag uses pointer capture, logical direction and midpoint commit, cancels on pointercancel,
preserves vertical touch scrolling, suppresses duplicate click, and leaves keyboard
toggling usable. No drag styling can overwrite approved geometry.

## Gallery inventory and ordering

Start default, persistent treatments, size tiers; then all matrix cells, shapes, slots,
labels, compositions, states and behaviors listed above. Off/on are separate tiles.
Add independent stress/context cases: SwitchStressGerman, SwitchStressRtl,
SwitchStressNarrow (240px framing), SwitchStressZoom (200% container),
SwitchFieldError, SwitchThemeLight/Dark, SwitchContrastMore, SwitchMotionReduced,
SwitchFormReset, SwitchControlled, and SwitchDefaultWithoutSizeClass.
Composition exceptions are SwitchList's child switches, SwitchCard's label content,
SwitchDisabledFocusable's tooltip, and SwitchFieldError's field/error relationship.
No size/variant matrix shares a gallery tile. Docs page may use labeled comparisons.

## Build and verification plan

After approval, implement the entire list in CSS, manifest, React, hydration, demos,
page metadata/practices and docs/component-audits/switch.md; update tracker when done.
Update stale 32×20/global-pill-only Switch descriptions in DESIGN_SYSTEM.md, AGENTS.md
and repo-map during implementation, scoped to this approved contract.

Verify sizes × both densities × sharp/pill radius for both shapes, base and media cases,
outline off/on and text width. Record track, thumb, inset, travel, label gap/type,
icon slot, declared/capped radius, border, target, focus ring and alignment.
Compare every measured value with the approved case; fix CSS bugs automatically.
Check all tones/variants light/dark and increased contrast, native forced-colors where
available, reduced motion, keyboard, naming/descriptions, required validation, form
submission/reset, controlled mode, promise success/reject and stale results, drag/RTL/
cancel, long labels and narrow/zoom layouts. Report unavailable AT/platform tests.

Required gates: npm run build, npm run lint:manifest, npm test, npm run typecheck,
npm run build:docs, contrast report for state paint, behavior tests and git diff --check.
Final output: checklist with demo name per row, actual measured table beside decision,
all gate results and limits. No commit/push unless separately requested.

## Approval record

- Construction research: complete.
- Construction base and content completion decisions: approved 2026-09-18.
- Complete build plan: approved 2026-09-18.
- Implementation and rendered verification: complete; see [audit report](../../component-audits/switch.md).
