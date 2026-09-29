# Library range catalogue — run 2

Snapshot of commit: `7dae828e7af1daf9d26b663d34335121156606f7`. Branch: `astra/library-range-2`.

Area manifest refreshed from current main on 2026-09-29. [Checkbox current-main companion](checkbox.md) supplements the 27 surveyed families; its external comparison remains in run 1. External evidence retains its original checked date.

## Exact family list

1. [Menu](menu.md)
2. [Message](message.md)
3. [ModelPicker](model-picker.md)
4. [Nav](nav.md)
5. [NumberField](number-field.md)
6. [Panel](panel.md)
7. [Popover](popover.md)
8. [Progress](progress.md)
9. [PromptSuggestions](prompt-suggestions.md)
10. [PropertyList](property-list.md)
11. [Radio](radio.md)
12. [ScrollToLatest](scroll-to-latest.md)
13. [Segmented](segmented.md)
14. [Select](select.md)
15. [Separator](separator.md)
16. [Skeleton](skeleton.md)
17. [Slider](slider.md)
18. [Spinner](spinner.md)
19. [SplitButton](split-button.md)
20. [Switch](switch.md)
21. [Table](table.md)
22. [Tabs](tabs.md)
23. [Textarea](textarea.md)
24. [Toast](toast.md)
25. [Toolbar](toolbar.md)
26. [Tooltip](tooltip.md)
27. [TreeView](tree-view.md)

Scope is built families, including those awaiting owner approval. The inventory prose is stale for the conversation families: use the starting manifest and completion registry to reconcile it, not the backlog wording. Compound RadioGroup, PopoverAnchor and TableWrapper stay under their parent. Token is a Code compatibility alias (A–L); Presence belongs to Indicator (A–L), per the inventory. No independent M–Z family is assigned to either alias.

Sources at the starting commit:
- [Inventory](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/COMPONENTS.md#L14-L43).
- [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L1-L749).
- [Built registry](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/apps/docs/src/component-status.mjs#L6-L30).

## Deliverables

The [machine-readable index](index-2.json) contains 27 families, 1,361 distinct family options and 112 proposed range entries, including a baseline-inventory recommendation for each family. There are 2,719 source observations behind those options and 300 distinct external option-source URLs. These are catalogue counts, not an estimate of the whole ecosystem; they are reproducible from [the authored observations](catalogue-2.py) and [source audit](source-audit-2.json).

Every family has the seven requested sections and a disposition for all 16 requested systems. Each option records its source, dated check, supporting systems, and qualified Area status. Family pages are the reading view; the index is the comparison view. No component implementation, completion status or shared guide is changed.

## Biggest gaps worth owner selection

The following are recommendations drawn from the linked records, not implementation commitments. Counts are distinct systems with a documented component, official example or recipe for that exact option; guidance and adjacent primitives are excluded here.

- **Menu: nested submenus.** Nine systems document them. Area’s spec explicitly excludes the submenu keyboard contract. This is a behavior and focus-management addition, not just another chevron. [Menu](menu.md).
- **Tabs: treatment and overflow range.** Three systems document an overflow menu and Carbon documents scroll buttons. Mantine documents pills; Chakra documents enclosed tabs; Untitled UI documents several button treatments. Area has underline tabs, both orientations and automatic/manual activation, but no overflow or add/close contract. [Tabs](tabs.md).
- **Radio: retain choice cards.** Five systems document this anatomy. Area now has Radio and Checkbox card treatments, with row/tile layout gated on card. Retain the built anatomy. [Radio](radio.md).
- **Progress: circular and segmented tracks.** Six systems document circular progress and three document segmented tracks. Area’s progress contract is linear. Keep determinate circular progress separate from Spinner’s indefinite busy indication. [Progress](progress.md), [Spinner](spinner.md).
- **Toast: lifecycle ownership.** Seven systems document queue behavior. Area supplies the surface and announcements; lifetime, placement and stacking remain consumer-owned. A manager should be an explicit additional contract. [Toast](toast.md).
- **Field anatomy: underlined/borderless treatment, label placement, rich Select rows, and Textarea growth.** These are structural choices under the brief. Area’s native Select and textarea should remain valid choices alongside any new custom-listbox or autosize contract. [NumberField](number-field.md), [Select](select.md), [Textarea](textarea.md).
- **Navigation and command surfaces: collapsed rail, responsive disclosure and automatic toolbar overflow.** Area’s composition slots are useful, but its Toolbar overflow is a manual details disclosure; it does not automatically redistribute commands. [Nav](nav.md), [Toolbar](toolbar.md).
- **Conversation families: more anatomy, with fewer direct counterparts.** Message has direct bubble examples in Untitled UI, shadcn/ui and Ant Design X; ModelPicker comparisons establish menu primitives rather than dedicated model-selector components. New sender grouping, reactions, prompt descriptions and history anchoring need owner-selected scope. [Message](message.md), [ModelPicker](model-picker.md), [PromptSuggestions](prompt-suggestions.md), [ScrollToLatest](scroll-to-latest.md).
- **Keep the advanced engines explicit.** Grid navigation/virtualization, arbitrary range thumbs, hierarchical drag, and general split panes are larger behavior contracts. Do not count them as already present because Table, Slider, TreeView or Panel exists. The catalogue records the alternatives and recommends boundaries for coordination with the backlog run. [Table](table.md), [Slider](slider.md), [TreeView](tree-view.md), [Panel](panel.md).

## How to interpret the catalogue

**Layers.** Layer 2 means the inventory of variants, sizes, tones and states to offer; layer 3 means anatomy/layout alternatives. The supplied brief explicitly puts tab treatments and field treatments in layer 3. The authored recommendations apply that boundary even when an external API calls an anatomical choice `variant`. Interaction contracts are recorded separately and attached to the inventory or structure they enable. Baseline recommendations retain current inventory subject to the documented contract questions; they do not grant owner completion.

The brief was absent from the starting main commit. Scope was read, without edits, from the user-specified fallback `.claude/worktrees/astra-6-usage-tasks-17a367/docs/BRIEF.md`, lines 109–123 (customization layers) and 21–25 (Library), checked 2026-09-28. This scope reference is not claimed to be part of the pinned Area baseline.

**Counting.** Each option uses native source axis/value spellings. `small`, `sm` and `1` are not silently merged; size names do not assert matching geometry. “Direct systems” includes documented shipped components and official composition examples/recipes; each observation says which it is. A proposed bundle’s count is the union of systems that support at least one listed alternative, not a claim they all ship the entire bundle. Individual option counts and systems remain available in the index.

Experimental implementations, adjacent components/primitives, platform guidance, and similarly named components with a different job have separate counts. A system counts once per option: React Aria and Spectrum 2 count together, Chakra and Ark count together, and Ant Design X remains under Ant Design. A direct match takes precedence over a supporting match from the same system. Supporting and guidance lists are not additive market-share totals.

**Area status.** `yes` means documented in the baseline manifest/spec; `composition` means a documented combination, not a dedicated engine; `partial` is explained in the family’s Area today section. `equivalent tier` or `equivalent concept` is an analytical correspondence without identical geometry/styling. `system-level` means a foundation choice rather than proof of that exact component option. `not found` means no documented contract found in the pinned manifest/spec, not that custom code could never implement it.

**Research scope.** All 16 systems were checked using their public catalogues and relevant pages. The catalogue enumerates verified categorical options, meaningful anatomy and interaction contracts from those pages. It does not enumerate arbitrary CSS lengths/colors, text strings, every event callback, arbitrary render-function possibilities or undocumented inherited capabilities. Inaccessible or unconfirmed details are not counted. Each family lists searched names and all systems, including scoped “not found” results; this is a dated evidence catalogue, not a proof of exhaustive API absence.

**Source/version boundaries.** Public documentation was checked on 2026-09-28. Area links are pinned to the starting commit; Fluent Button/SplitButton/SpinButton/Table and AndroidX expressive examples use pinned source. Current Polaris web components are used rather than mixing in deprecated React APIs. Apple HIG HTML is a JavaScript shell, so its official documentation JSON supplies readable guidance. Material 3 uses official Compose docs plus pinned AndroidX source where needed. The [source audit](source-audit-2.json) records attempts, redirects, failures and readable alternatives. HTTP success confirms retrieval, not semantic support by itself. Public doc URLs can change and should be rechecked before implementation.

No logged-in products or owner browser were used. No values were measured from screenshots. Full scraped page bodies, dependencies, build output and temporary research caches are excluded from the deliverable.

## Owner questions

1. **SplitButton ghost:** should the manifest’s `ghost` option survive, or should the spec’s explicit exclusion prevail? Both remain visible in [SplitButton](split-button.md).
2. **Select ownership:** offer a native and a custom Select, or keep rich/searchable/multiple modes under separately named families? [Select](select.md).
3. **Behavior engines:** which of Toast lifecycle, nested Menu, Table/DataGrid, hierarchical TreeView drag and transcript scrolling should become first-party contracts? These affect more than appearance. [Toast](toast.md), [Menu](menu.md), [Table](table.md), [TreeView](tree-view.md), [ScrollToLatest](scroll-to-latest.md).
4. **First range release:** prioritize the widely documented anatomy gaps above, or conversation-specific alternatives with fewer direct counterparts? [Proposals and counts](index-2.json).
5. **Platform experiments:** should expressive SplitButton shapes and floating toolbars enter an experimental collection rather than the baseline library? [SplitButton](split-button.md), [Toolbar](toolbar.md).

## Reproduce and validate

From this worktree, with the baseline manifest/specs intact:

```sh
python3 docs/research/library-range/catalogue-2.py
python3 docs/research/library-range/validate-2.py
git diff --check
```

The generator uses Python’s standard library and the installed Node runtime; it adds no dependencies. The validator checks family scope, section order, all 16 survey entries, evidence links/check dates, baseline file/line references, deduplicated counts, proposal membership and local links. These checks validate catalogue integrity; source interpretation remains research judgment.

Setup validation: `npm ci` and `npm run build` passed in the isolated worktree. Final catalogue validation and whitespace checks are recorded in [verification-2.json](verification-2.json).

## DONE checklist

- [x] Exact built M–Z family scope recorded against the starting commit.
- [x] All 27 families have a file in the required section order.
- [x] All 16 requested systems have a sourced observation or scoped “not found” result for every family.
- [x] Every option has at least one external or pinned Area source link.
- [x] Per-option Area status and per-proposal system counts recorded.
- [x] No screenshot measurements; public documentation/source only.
- [x] Work restricted to `docs/research/library-range/`; no shared implementation edits.
