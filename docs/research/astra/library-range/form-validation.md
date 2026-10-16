# Form validation / Error summary

## Job

Coordinate field validation, submission errors and recovery.

Observed family coverage: **9 / 15 implementation systems** (9 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Reuse Field errors; add a form contract and linked ErrorSummary rather than a new visual input.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **disabled**: `false` — 3 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/field/root/FieldRoot.tsx#L243), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L73), [Chakra/Ark](https://www.chakra-ui.com/docs/components/field)); `true` — 3 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/field/root/FieldRoot.tsx#L243), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L73), [Chakra/Ark](https://www.chakra-ui.com/docs/components/field)).
- **focused**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/field/root/FieldRoot.tsx#L263)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/field/root/FieldRoot.tsx#L263)).
- **invalid**: `false` — 2 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/field/root/FieldRoot.tsx#L312), [Chakra/Ark](https://www.chakra-ui.com/docs/components/fieldset)); `true` — 2 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/field/root/FieldRoot.tsx#L312), [Chakra/Ark](https://www.chakra-ui.com/docs/components/fieldset)).
- **isDisabled**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Form.tsx#L29)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Form.tsx#L29)).
- **isEmphasized**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Form.tsx#L31)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Form.tsx#L31)).
- **readOnly**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/field)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/field)).
- **size**: `S` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Form.tsx#L27)); `M` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Form.tsx#L27)); `L` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Form.tsx#L27)); `XL` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/Form.tsx#L27)); `small` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L87)); `medium` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L87)); `large` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L87)); `sm` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/fieldset)); `md` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/fieldset)); `lg` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/fieldset)).
- **variant**: `FormValidationStatus` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/FormControl/_FormControlValidation.tsx#L8)); `outlined` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L92)); `borderless` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L92)); `filled` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L92)); `underlined` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L92)).

</details>

## Structural alternatives

- **Linked error summary** — 1 observed implementation systems. [GOV.UK](https://design-system.service.gov.uk/components/error-summary/).
- **Field-level and form-level errors** — 3 observed implementation systems. [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/Form.mdx#L111), [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/form/Form.tsx#L208), [GOV.UK](https://design-system.service.gov.uk/components/error-message/).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **React Server Actions** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/forms.mdx#L364).
- **React Router actions** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/forms.mdx#L398).
- **Submit with a Server Function** — 1 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/form/page.mdx#L33).
- **Using with Zod** — 1 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/form/page.mdx#L64).
- **With validation message and caption text** — 1 system(s): [Primer](https://primer.style/product/components/form-control/).
- **Vertical spacing** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/form/usage/).
- **Validation with rules object** — 1 system(s): [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/apps/mantine.dev/src/pages/form/validation.mdx#L7).
- **Async validation with debounce** — 1 system(s): [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/apps/mantine.dev/src/pages/form/validation.mdx#L201).
- **Focus the first invalid field** — 1 system(s): [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/apps/mantine.dev/src/pages/form/validation.mdx#L210).
- **FeedbackIcons** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L177).
- **Error Icon** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/field).
- **Horizontal** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/field).
- **Disabled** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/fieldset).
- **Input with Select** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/fieldset.mdx#L47).
- **Invalid** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/fieldset).
- **Legend** — 1 system(s): [GOV.UK](https://design-system.service.gov.uk/components/error-message/).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **Align**: `start` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/form/src/types.tsx#lines-9)); `end` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/form/src/types.tsx#lines-9)).
- **orientation**: `vertical` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/field)); `horizontal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/field)).
- **wrapperCol**: `object` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L162)).

</details>

## Interaction patterns

React Aria distinguishes native and ARIA validation. GOV.UK's error summary links to erroneous controls; preserve values after unsuccessful submission.

Evidence: [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/Form.mdx#L1-L189), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/forms.mdx#L1-L300), [GOV.UK](https://design-system.service.gov.uk/components/error-summary/).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **FormMode**: `controlled` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/form/src/types.ts#L5)); `uncontrolled` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/form/src/types.ts#L5)).
- **FormValidationMode**: `onSubmit` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/form/Form.tsx#L181)); `onBlur` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/form/Form.tsx#L181)); `onChange` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/form/Form.tsx#L181)).
- **GetInputPropsType**: `input` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/form/src/types.ts#L4)); `checkbox` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/form/src/types.ts#L4)); `radio` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/form/src/types.ts#L4)).
- **clearOnDestroy**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L98)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L98)).
- **colon**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L134)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L134)).
- **dirty**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/field/root/FieldRoot.tsx#L317)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/field/root/FieldRoot.tsx#L317)).
- **hidden**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L141)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L141)).
- **layout**: `horizontal` — 2 systems ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/FormControl/FormControl.tsx#L42), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L163)); `vertical` — 2 systems ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/FormControl/FormControl.tsx#L42), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L163)); `inline` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L82)).
- **noStyle**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L150)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L150)).
- **preserve**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L571)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L571)).
- **required**: `false` — 2 systems ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L558), [Chakra/Ark](https://www.chakra-ui.com/docs/components/field)); `true` — 2 systems ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L558), [Chakra/Ark](https://www.chakra-ui.com/docs/components/field)).
- **requiredIndicator**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/FormControl/FormControlLabel.tsx#L12)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/FormControl/FormControlLabel.tsx#L12)).
- **touched**: `false` — 2 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/field/root/FieldRoot.tsx#L322), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L536)); `true` — 2 systems ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/field/root/FieldRoot.tsx#L322), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L536)).
- **validateStatus**: `string` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L159)).
- **validating**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L537)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L537)).
- **validationBehavior**: `aria` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Form.tsx#L38)); `native` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Form.tsx#L38)).
- **validationMode**: `FormValidationMode | undefined` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/form/Form.tsx#L202)); `Form.ValidationMode | undefined` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/field/root/FieldRoot.tsx#L301)).
- **visuallyHidden**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/FormControl/FormControlLabel.tsx#L10)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/FormControl/FormControlLabel.tsx#L10)).

</details>

## Reuses in Area

[Field](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L133), [Input](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L143), [Alert](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L524), [Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Reuse Field errors; add a form contract and linked ErrorSummary rather than a new visual input.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 2 — Validation timing and strategy**: 2 observed systems. [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/react-aria-components/src/Form.tsx#L38), [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/field/root/FieldRoot.tsx#L301).
- **Layer 3 — Linked error summary**: 1 observed systems. [GOV.UK](https://design-system.service.gov.uk/components/error-summary/).
- **Layer 3 — Field-level and form-level errors**: 3 observed systems. [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/Form.mdx#L111), [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/form/Form.tsx#L208), [GOV.UK](https://design-system.service.gov.uk/components/error-message/).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Form validation / Error summary`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: [form — component](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/form/page.mdx#L1-L91); [field — component](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/field/page.mdx#L1-L77).
- **React Aria / Spectrum 2**: [Form — component](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/Form.mdx#L1-L189); [forms — component](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/forms.mdx#L1-L300).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: [form-control — component](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/FormControl/FormControl.tsx#L1-L246).
- **Carbon**: [Form — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Form/Form.tsx#L1-L35).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [@Form — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/form/src/types.ts#L1-L300).
- **Ant Design**: [form — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/form/index.en-US.md#L1-L300).
- **Chakra/Ark**: [field — component](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/field.mdx#L1-L76); [fieldset — component](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/fieldset.mdx#L1-L56).
- **Atlassian**: [form — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/form/README.md#lines-1:14).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components). Related lookup(s) also unresolved: form.
- **GOV.UK**: [error-summary — component](https://design-system.service.gov.uk/components/error-summary/); [error-message — component](https://design-system.service.gov.uk/components/error-message/).
- **Apple HIG**: [text-fields — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/text-fields).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
