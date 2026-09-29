# React server-render coverage

Baseline HEAD: `18b86465d542f620d532fee351c4f28d50c8ac3a` (`git rev-parse HEAD` before test changes).
Branch: `astra/react-tests`. Inventory recorded before writing tests.

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

The following 31 families will get new files. Some have incidental assertions in
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

Pending implementation and verification.
