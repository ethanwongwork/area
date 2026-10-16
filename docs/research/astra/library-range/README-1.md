# Library range — run 1

Research date: 2026-09-28. Snapshot of commit: `c585f8c5f38705a7efa79bf05148a8c6989b142a`. Branch: `astra/library-range-1`.

Count and Alert were refreshed against current main `7dae828e7af1daf9d26b663d34335121156606f7` on 2026-09-29. Count is an Area-only supplement; the 480 outside-system checks remain the original 30-family snapshot. Other families remain pinned to the snapshot above.

## Exact scope

- [alert](alert.md)
- [alignment-picker](alignment-picker.md)
- [avatar](avatar.md)
- [badge](badge.md)
- [badge-group](badge-group.md)
- [box-field](box-field.md)
- [breadcrumb](breadcrumb.md)
- [button](button.md)
- [button-group](button-group.md)
- [calendar](calendar.md)
- [card](card.md)
- [checkbox](checkbox.md)
- [chip](chip.md)
- [code](code.md)
- [code-block](code-block.md)
- [color-field](color-field.md)
- [color-picker](color-picker.md)
- [color-swatch](color-swatch.md)
- [color-swatch-picker](color-swatch-picker.md)
- [combobox](combobox.md)
- [command-palette](command-palette.md)
- [composer](composer.md)
- [context-menu](context-menu.md)
- [count](count.md)
- [dialog](dialog.md)
- [field](field.md)
- [hover-card](hover-card.md)
- [indicator](indicator.md)
- [input](input.md)
- [input-group](input-group.md)
- [kbd](kbd.md)

31 built families, including owner-accepted and in-review families. Compound parts stay with their parent, except BadgeGroup, which has its own spec and registry family. No standalone Link family exists at this commit.

Sources: [inventory](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L27-L45), [expansion inventory](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L60-L138), [manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749), [built registry](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/apps/docs/src/component-status.mjs#L6-L30). Where inventory prose is stale, executable manifest plus spec and registry establishes built status.

## Read the catalogue

Each family has the requested sections: Job, Variant axes, Structural alternatives, Interaction patterns, Area today, Proposed range, Sources. Read **Proposed range** for decisions; use the preceding sections to compare the native vocabularies and behaviors.

[index-1.json](index-1.json) is the machine-readable companion. `families[slug].options[option]` contains the layer, systems with links, computed system count, Area status and evidence, recommendation and rationale. `system_catalogue` preserves the native axes/values, additional API enum inventories, anatomy, interactions and all sixteen search records. `area.manifest` is an exact data extraction from the unchanged starting manifest, including compound parts.

This run records **31 families**, **480 family/system checks**, **291 positive or adjacent/guidance records**, **1043 source-part API enum records**, and **214 normalized proposed options**. These are catalogue counts computed from the [index](index-1.json), not counts of independent components or a quality ranking.

## Biggest gaps

The strongest opportunities are structural and behavioral. These are research recommendations for the owner to choose, not approved implementation tasks.

- **Combobox collection behavior:** [Multiple values with tokens](combobox.md#proposed-range) (9 systems; Area not-found); [Async results and loading](combobox.md#proposed-range) (6 systems; Area not-found). This is the largest repeated gap: input text, selection, result loading and token focus need separate contracts.

- **Dialog contracts and responsive presentation:** [Standard versus explicit alert decision](dialog.md#proposed-range) (7 systems; Area partial); [Size/fullscreen presets](dialog.md#proposed-range) (5 systems; Area not-found); [Independent Escape/outside dismissal](dialog.md#proposed-range) (4 systems; Area not-found). A presentation surface without a trigger is not evidence that non-modal behavior exists.

- **Useful navigation overflow:** [Working overflow disclosure](breadcrumb.md#proposed-range) (6 systems; Area partial); [Responsive collapse](breadcrumb.md#proposed-range) (2 systems; Area not-found). The current breadcrumb ellipsis is decorative. This should be a functioning disclosure before offering more breadcrumb paint.

- **Calendar navigation and shortcuts:** [Month/year navigation controls](calendar.md#proposed-range) (6 systems; Area not-found); [Week-number column](calendar.md#proposed-range) (5 systems; Area not-found); [Preset date shortcuts](calendar.md#proposed-range) (4 systems; Area partial). Single/range/multiple selection already exists; navigation and supporting anatomy are the next range gains.

- **Selection at collection level:** [Selectable card collection](card.md#proposed-range) (3 systems; Area not-found); [Keyboard collection navigation](chip.md#proposed-range) (2 systems; Area not-found). An individual selected border or button does not supply a collection focus model.

- **Alternate control layouts:** [Horizontal and vertical orientation](button-group.md#proposed-range) (3 systems; Area partial); [Responsive label layout](field.md#proposed-range) (1 systems; Area not-found); [Block-start/block-end addons](input-group.md#proposed-range) (1 systems; Area not-found). These expand layout without adding another tone or size.

- **Color editor composition:** [Format or per-channel editing](color-field.md#proposed-range) (5 systems; Area partial); [Inline and popover presentations](color-picker.md#proposed-range) (4 systems; Area partial). Reuse the richer ColorPicker and overlay primitives; do not duplicate parsing in unrelated slots.

- **Composer lifecycle:** [Generating state with stop action](composer.md#proposed-range) (1 systems; Area partial); [Attachments with preview/removal](composer.md#proposed-range) (1 systems; Area partial). Action slots are present. Attachment and generation behavior would still be new implementation work. The strongest inspected implementation is Adobe AI Components, not broad consensus.

## Range already present

Area already has substantial [Button](button.md#area-today), [Badge](badge.md#area-today), [Card](card.md#area-today), [Calendar](calendar.md#area-today), [CodeBlock](code-block.md#area-today), [ColorPicker](color-picker.md#area-today) and [Indicator](indicator.md#area-today) range. The scan found no directly equivalent nine-position [AlignmentPicker](alignment-picker.md#sources) or linked four-value [BoxField](box-field.md#sources) family in the examined catalogues; that is a bounded search result, not a uniqueness claim.

Several superficially similar names need separate jobs: Untitled UI BadgeGroup is an announcement treatment; Ant Design Badge is an attached indicator while Tag covers metadata; Material dropdown menus do not establish a context-trigger contract; single-input adornments are not necessarily a joined InputGroup. See [BadgeGroup](badge-group.md#sources), [Badge](badge.md#sources), [ContextMenu](context-menu.md#sources) and [InputGroup](input-group.md#sources) for the source comparisons.

## Method and counting

- Sources are public documentation and public source code, checked **2026-09-28**. No owner's browser, logged-in product, screenshots or measurements were used. No paid implementation was accessed; Untitled UI public labels/FAQs establish only the options and behaviors they explicitly describe.
- The sixteen required systems are checked for every family. Adobe React Aria and Spectrum 2 count once; Chakra and Ark count once. Apple HIG is platform guidance and never counts as a shipped web component.
- Counts are **verified lower bounds**, not market-share or quality scores. Count one system for a documented implementation, headless primitive or documented composition supporting the normalized option. A count does not imply identical naming, styling, keyboard behavior or parity across every SDK. Exclude internal-only, adjacent jobs and platform guidance. Area itself is excluded from peer counts; Area-only options link to the starting spec.
- Primer's public internal DatePicker and CommandPalette pages explicitly prohibit external availability, so they are recorded but excluded. Fluent Calendar uses pinned v9 compatibility packages. Material uses pinned Android implementation docs where its design site is script-only. Polaris means current App Home web components, not its retired React library.
- `yes` means an equivalent is documented in the starting Area spec/manifest/API; `partial` means only part of the anatomy or contract exists; `not-found` means no equivalent was established in those cited files; `owner-decision` preserves an explicit exclusion or scope choice; `not-applicable` indicates another job/family. A source-native enum is not automatically an Area enum with the same name.
- Native summaries enumerate named finite design/state axes and structural examples in the checked sources. Open-ended CSS colors, arbitrary child content, every possible native HTML prop and application-defined callback behavior are not finite library variants. API inventories retain component/part scope. Unexpanded aliases, contradictory docs, failed URLs and unreadable catalogues are called out rather than filled from memory.
- The normalized options are the decision index; native source names are retained separately so that `soft`, `subtle`, `filled` and `surface` are not silently treated as interchangeable API values. Documentation was reviewed, not behavior-tested against installed third-party packages.
- Area comparisons pin the starting commit. Concurrent component/icon edits elsewhere are intentionally outside this snapshot. No family status, implementation, owner decision or main-branch file was changed.

## Open questions for the owner

1. Prioritize broad functional gaps (Combobox, Dialog, Breadcrumb, Calendar) or additional appearance choices first? Their source counts are above; adopting every peer option is not the recommendation.
2. Reopen any explicit exclusions: extra local Button sizes, non-pill Badges, alternate Breadcrumb separators/treatments, centered Indicator positions, or solid Alert emphasis? Their specs currently choose otherwise.
3. Keep gradients as a separate editor family or expand ColorPicker? Both Untitled UI and Ant Design have documented gradient editing, while Area's current scope is solid color. See [ColorPicker](color-picker.md#proposed-range).
4. Should attached uploads, prompt tokens, voice and generation/stop behavior be first-party Composer responsibilities or optional recipes? See [Composer](composer.md#proposed-range).
5. Which advanced collection behaviors should be reusable infrastructure: multi-value tokens, async options, virtualization and selectable cards? Keep these decisions separate from visual variants.

## Brief provenance

`docs/BRIEF.md` was not present at the starting commit. As instructed, the brief was read read-only from `.claude/worktrees/astra-6-usage-tasks-17a367/docs/BRIEF.md`: Library at lines 23–26 and customization layers at lines 109–123. This fallback was not copied or edited and no commit provenance is asserted for it. The catalogue's layer framing follows the user's task; all Area implementation claims use pinned starting-commit files.

## DONE and verification

- [x] Exact built A–L family list recorded before research.
- [x] A file exists for each of the 30 listed families, with the required section order.
- [x] All sixteen systems have a source/search record for every family.
- [x] Every native alternative and proposed option has source links; Area comparisons have pinned file/line evidence.
- [x] Proposed layer 2/3 range includes distinct-system counts and Area coverage.
- [x] No screenshot measurements, logged-in products or personal captures.
- [x] Only `docs/research/astra/library-range/` is changed; no shared source, guides, handoff or status files.
- [x] Required isolated `npm ci` and `npm run build` passed before research; no dependencies were added.

Run `python3 docs/research/astra/library-range/validate-1.py` to reproduce the catalogue integrity check. It checks scope, required sections/systems, citation presence, pinned Area file/line references and support counts; it does not prove third-party runtime behavior. Final integrity and whitespace checks are recorded in the draft PR. This is documentation-only work; no application UI was changed and no preview server was started. The research does not confer owner approval on any component.
