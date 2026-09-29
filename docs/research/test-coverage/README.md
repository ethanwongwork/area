# React server-render coverage

Inventory snapshot of commit: `18b86465d542f620d532fee351c4f28d50c8ac3a` (`git rev-parse HEAD` before test changes).
Branch: `astra/react-tests`. Inventory recorded before writing tests.

Review verification uses current main `7dae828e7af1daf9d26b663d34335121156606f7`. Checkbox/Radio layout cases render with `variant="card"`, as required by their React layout guards. All four original bug skips remain unchanged.

## Inventory and counting

Compared `packages/react/src/index.ts`, exports in `components/primitives.tsx` and
`components/forms.tsx`, all 69 entries of `packages/styles/src/manifest.ts:689`,
`docs/COMPONENTS.md:29`, and the 28 existing `packages/react/tests/*.test.mjs` files.
There are 57 component families after grouping CheckboxGroup, RadioGroup, ChipGroup,
ChoiceLabel, Presence, IndicatorAnchor, BadgeGroup, AvatarGroup, PopoverAnchor,
TableWrapper, Token, and KbdGroup with their parent families. ChoiceLabel is shared
Checkbox/Radio markup; PopoverAnchor and TableWrapper are structural CSS blocks,
not standalone exported React components. Token is Code compatibility; Presence is
covered under Indicator. Theme is infrastructure, outside the component manifest.
MessageActions and other compound exports belong to their parent family.
Proposed/unimplemented items in COMPONENTS.md are outside this inventory.

26 families already have dedicated coverage in 24 files: Alert, AlignmentPicker,
Avatar (+ AvatarGroup), Badge (+ BadgeGroup), Breadcrumb, ButtonGroup, Calendar,
Chip (+ ChipGroup/ChipLink), ColorField, ColorPicker, ColorSwatchPicker, Count,
Dialog, Indicator (+ IndicatorAnchor/Presence), Input and Field (`input-field`),
InputGroup, NumberField, Segmented and Tabs (`segmented-tabs`), Skeleton, Slider,
Spinner, SplitButton, Switch, Toolbar. The other four files are cross-family
`cohesion`, `gallery-primitives`, `overlay`, and `tone` checks.

## Families without a dedicated test file at baseline

The following 31 families were identified for new files before implementation. Some have incidental assertions in
`dialog`, `gallery-primitives`, `overlay`, or `tone`; those existing files stay intact.

- Button — `button.test.mjs`
- ColorSwatch — `color-swatch.test.mjs`
- TreeView — `tree-view.test.mjs`
- Composer — `composer.test.mjs`
- Textarea — `textarea.test.mjs`
- Select — `select.test.mjs`
- Checkbox (+ CheckboxGroup/ChoiceLabel) — `checkbox.test.mjs`
- Radio (+ RadioGroup/ChoiceLabel) — `radio.test.mjs`
- Separator — `separator.test.mjs`
- Progress — `progress.test.mjs`
- Panel (+ sections, rows, stacks) — `panel.test.mjs`
- PropertyList — `property-list.test.mjs`
- BoxField — `box-field.test.mjs`
- Combobox — `combobox.test.mjs`
- CommandPalette — `command-palette.test.mjs`
- ContextMenu — `context-menu.test.mjs`
- HoverCard — `hover-card.test.mjs`
- PromptSuggestions — `prompt-suggestions.test.mjs`
- Message (+ MessageActions) — `message.test.mjs`
- ScrollToLatest — `scroll-to-latest.test.mjs`
- ModelPicker — `model-picker.test.mjs`
- Card — `card.test.mjs`
- Popover — `popover.test.mjs`
- Menu — `menu.test.mjs`
- Tooltip — `tooltip.test.mjs`
- Toast — `toast.test.mjs`
- Table — `table.test.mjs`
- Code (+ Token) — `code.test.mjs`
- CodeBlock — `code-block.test.mjs`
- Nav — `nav.test.mjs`
- Kbd (+ KbdGroup) — `kbd.test.mjs`

## Scope

Tests use node:test, React renderToString, and the built public module entry point.
Each test cites its source/spec/manifest evidence. Variant tests enumerate every
manifest axis value and verify the serialized hook on the intended element.
Native props and state assertions apply only where the component API supports them;
passive spans/divs do not acquire fictional disabled or form-value contracts.
SSR verifies markup, naming references and initial state, not computed accessible
names, keyboard interaction, focus, layout, hydration, effects or browser-only state.

## Results

31 new files contain **188 tests: 184 pass, 4 skip, 0 fail**. Counts below are
node:test cases (each enumerated axis/value is a separate case); a compound-family
case can check multiple parts or supported usage forms. Every skip first failed
unskipped against the baseline build. No production changes were made.

New coverage per family, with total / passing / skipped counts:

- BoxField: **5 / 5 / 0** — `box-field.test.mjs`.
- Button: **19 / 19 / 0** — `button.test.mjs`.
- Card: **9 / 9 / 0** — `card.test.mjs`.
- Checkbox, including CheckboxGroup and ChoiceLabel: **13 / 13 / 0** — `checkbox.test.mjs`.
- CodeBlock: **4 / 4 / 0** — `code-block.test.mjs`.
- Code, including Token: **6 / 6 / 0** — `code.test.mjs`.
- ColorSwatch: **4 / 4 / 0** — `color-swatch.test.mjs`.
- Combobox: **8 / 8 / 0** — `combobox.test.mjs` (includes inherited Input axes).
- CommandPalette: **3 / 3 / 0** — `command-palette.test.mjs`.
- Composer: **5 / 4 / 1** — `composer.test.mjs`.
- ContextMenu: **2 / 2 / 0** — `context-menu.test.mjs`.
- HoverCard: **5 / 5 / 0** — `hover-card.test.mjs` (includes borrowed Popover sides).
- Kbd, including KbdGroup: **7 / 7 / 0** — `kbd.test.mjs`.
- Menu: **4 / 3 / 1** — `menu.test.mjs`.
- Message, including MessageActions: **4 / 4 / 0** — `message.test.mjs`.
- ModelPicker: **2 / 2 / 0** — `model-picker.test.mjs`.
- Nav: **4 / 4 / 0** — `nav.test.mjs`.
- Panel: **5 / 5 / 0** — `panel.test.mjs`.
- Popover: **7 / 6 / 1** — `popover.test.mjs`.
- Progress: **7 / 7 / 0** — `progress.test.mjs`.
- PromptSuggestions: **4 / 4 / 0** — `prompt-suggestions.test.mjs`.
- PropertyList: **2 / 2 / 0** — `property-list.test.mjs`.
- Radio, including RadioGroup and ChoiceLabel: **12 / 12 / 0** — `radio.test.mjs`.
- ScrollToLatest: **2 / 2 / 0** — `scroll-to-latest.test.mjs`.
- Select: **7 / 7 / 0** — `select.test.mjs`.
- Separator: **5 / 5 / 0** — `separator.test.mjs`.
- Table: **4 / 4 / 0** — `table.test.mjs`.
- Textarea: **11 / 11 / 0** — `textarea.test.mjs`.
- Toast: **7 / 7 / 0** — `toast.test.mjs`.
- Tooltip: **7 / 6 / 1** — `tooltip.test.mjs`.
- TreeView: **4 / 4 / 0** — `tree-view.test.mjs`.

The 26 already-covered families in the baseline inventory retain their existing
files unchanged; this PR adds zero cases to those families. Total repository test
files are now 59: 55 dedicated files cover the 57 families (two paired files), plus
the four cross-family files. This is file coverage, not a claim that every legacy
family's variants or browser behavior are exhaustively tested.

## Skips and evidence

Historical suspected-cause line references below refer to the inventory snapshot above. The unchanged skipped assertions remain regression specifications.
The skipped assertions retain the expected contract, not the observed faulty output.

- **Composer — 1 skip**, `packages/react/tests/composer.test.mjs:48`.
  `ComposerProps.inputProps` accepts native textarea `id` and `className`
  (`packages/react/src/components/Composer.tsx:26`), but the textarea spreads
  `inputProps` before replacing both at `Composer.tsx:84`. Passing `id="draft"`
  and `className="custom-input"` produces a generated id and only
  `area-composer__input`; the associated label also uses the generated id
  (`Composer.tsx:83`). Expected: retain the custom id, point the label to it,
  and merge the custom class with the component class.
- **Menu — 1 skip**, `packages/react/tests/menu.test.mjs:52`.
  Menu accepts native div attributes (`packages/react/src/components/primitives.tsx:1051`).
  With a trigger, the surface spreads `rest` then `extra` (`primitives.tsx:1075`);
  `packages/react/src/components/Overlays.tsx:179` supplies a generated id that
  replaces `id="actions-menu"`. Expected: preserve the caller id and use it in
  the trigger's `aria-controls`.
- **Popover — 1 skip**, `packages/react/tests/popover.test.mjs:45`.
  Native div attributes are accepted at `packages/react/src/components/primitives.tsx:1018`,
  then overwritten by `extra` at `primitives.tsx:1034`.
  `packages/react/src/components/Overlays.tsx:99` supplies the generated id.
  Expected: preserve `id="caller-surface"` and use it in `aria-controls`.
- **Tooltip — 1 skip**, `packages/react/tests/tooltip.test.mjs:42`.
  Native div attributes are accepted at `packages/react/src/components/primitives.tsx:988`,
  then overwritten by `extra` at `primitives.tsx:1012`.
  `packages/react/src/components/Overlays.tsx:234` supplies the generated id.
  Expected: preserve `id="caller-surface"` and use it in the trigger's
  `aria-describedby`.

The three overlay cases keep their internal generated associations intact today;
the disagreement is the lost caller id. Hosted/inline id passthrough, generated
relationships, className, ARIA attributes and expanded state remain active tests.

## Verification

- Review run: `npm run build:docs` passed using existing dependencies (Node 26.7.0); no dependencies installed.
- Each new file passed separately with `node --test packages/react/tests/<slug>.test.mjs`
  (TAP reporter used to collect exact counts).
- All 31 new files passed together: **188 total, 184 pass, 4 skip**.
- The full React suite initially lacked `apps/docs/dist/gallery-components.html`,
  required by two existing gallery tests. After `npm run build:docs` passed
  (including the docs audit), the full suite passed: **342 total, 338 pass, 4 skip**.
- An inventory check maps all 69 manifests to 57 families and verifies each family's
  dedicated file exists: **zero missing**.
- `git diff --check` passed. Only the 31 new tests and this README are in the change.

Reproduce after the documented build steps:

```sh
# A single new family:
node --test packages/react/tests/button.test.mjs

# All new files, excluding pre-existing tests:
node --test $(git diff --name-only --diff-filter=A origin/main -- 'packages/react/tests/*.test.mjs')

# Full React suite (requires npm run build:docs):
node --test packages/react/tests/*.test.mjs
```

SSR boundaries: ContextMenu rows mount only after a browser event
(`ContextMenu.tsx:97`); ScrollToLatest becomes visible in an effect
(`ScrollToLatest.tsx:19-28`); Checkbox sets the native indeterminate DOM property
in its ref (`forms.tsx:129-137`). Tests verify their initial serialized contracts
without claiming to exercise those transitions. Native popover/modal visibility,
keyboard navigation, focus, copying, resizing, reordering and accessibility-tree
name computation require browser tests and are not skips or simulated here.

## DONE

- [x] Inventory committed before adding tests, with baseline HEAD recorded.
- [x] Every implemented family maps to a dedicated test file.
- [x] Every new test cites source, manifest or spec evidence.
- [x] Each new manifest axis value renders its documented hook.
- [x] Supported native props, roles/naming markup, initial states and compound parts covered.
- [x] Each new file and all new files together pass, excluding documented skips.
- [x] Counts and all four skips recorded with suspected cause lines.
- [x] Only permitted new files changed; production and existing test files untouched.

## Open questions for the owner

1. Should triggered Menu/Popover/Tooltip preserve the caller's surface id and use it
   for their trigger relationships, or should the API explicitly disallow custom ids
   when a trigger is supplied?
2. Should Composer honor `inputProps.id` and merge `inputProps.className`, or explicitly
   exclude those properties from its public type?

These questions do not block the test-only draft. No fixes or owner completion
status changes are included.
