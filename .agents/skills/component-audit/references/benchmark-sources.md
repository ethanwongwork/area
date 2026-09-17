# Benchmark sources

Use current primary sources for each audit. These links are starting points, not a frozen
substitute for research. Record the exact page used and access date in the component
report.

## Published component systems

### Primer

- Component catalog: <https://primer.style/product/components/>
- Select: <https://primer.style/product/components/select/>
- SelectPanel: <https://primer.style/product/components/select-panel/>
- Autocomplete: <https://primer.style/product/components/autocomplete/>

Primer is Level A evidence for the documented component contract. Use its source or
Storybook for details not stated in the usage page.

### shadcn/ui

- Component catalog: <https://ui.shadcn.com/docs/components>
- Input: <https://ui.shadcn.com/docs/components/input>
- Select: <https://ui.shadcn.com/docs/components/select>
- Combobox: <https://ui.shadcn.com/docs/components/combobox>

shadcn/ui publishes composable source patterns rather than one installed runtime. Record
the documented pattern and the current source; do not treat a third-party registry item
as a core component without labeling it.

### Fluent 2

- Component catalog: <https://fluent2.microsoft.design/components/web/react/core/>
- Field: <https://fluent2.microsoft.design/components/web/react/core/field/usage>
- Select: <https://fluent2.microsoft.design/components/web/react/core/select/usage>
- Dropdown: <https://fluent2.microsoft.design/components/web/react/core/dropdown/usage>
- Combobox: <https://fluent2.microsoft.design/components/web/react/core/combobox/usage>

Fluent explicitly distinguishes native Select, custom Dropdown, and editable/filterable
Combobox. Use the corresponding Storybook/API link when exact props or dimensions matter.

### Vercel Geist

- Component catalog: <https://vercel.com/geist/introduction>
- Select: <https://vercel.com/geist/select>
- Multi Select: <https://vercel.com/geist/multi-select>

Geist is Level A evidence for its published components. Its guidance often states when a
neighboring component is preferable; capture that boundary, not just visual options.

## Product and authoring benchmarks

### OpenAI

- Help center: <https://help.openai.com/>
- Visual settings example: <https://help.openai.com/en/articles/11958281>

No public OpenAI component-system contract is assumed. Official product help is Level B.
Direct inspection of an official OpenAI product is Level C and must include platform,
version when visible, viewport, state, and date. A screenshot alone does not establish a
reusable API or exact token.

### Notion

- Help center: <https://www.notion.com/help>
- Keyboard shortcuts and command-menu behavior:
  <https://www.notion.com/help/keyboard-shortcuts>
- Database properties, including Select and Multi-select:
  <https://www.notion.com/help/database-properties>

Notion product help is Level B; direct UI measurements are Level C. Do not describe
Notion's internal component variants or tokens unless an official source publishes them.

### Figma

- Component properties:
  <https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties>
- Variants:
  <https://help.figma.com/hc/en-us/articles/360056440594-Create-and-use-variants>
- Component-management guidance:
  <https://help.figma.com/hc/en-us/articles/39747637290263-Components-collection-Tips-for-component-management>

Figma's help center is Level A/B evidence for authoring reusable components and exposing
properties. Figma's own product UI is a Level C visual/interaction benchmark. A Figma
Community library is secondary evidence unless it is explicitly published and maintained
by the organization being evaluated.

## Source rules

- Browse afresh for each component; component docs and products change.
- Prefer official usage guidance, API/source, accessibility notes, and Storybook in that
  order for the claim each source can actually support.
- Use WAI-ARIA Authoring Practices and platform specifications for behavior semantics;
  the seven product/design benchmarks do not override platform accessibility requirements.
- Quote sparingly. Paraphrase and link the exact page.
- If authentication or rollout prevents inspection, record the limitation instead of
  substituting a lookalike implementation.
- Use measured numbers only when the source publishes them or the audit records the
  measurement method. Label measurements as observed.
