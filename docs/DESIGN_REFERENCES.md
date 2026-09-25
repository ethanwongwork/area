# Design references

Untitled UI is the owner’s preferred first reference for both anatomy and visual quality.
Start there; use another source when it has a better-matched behavior or a missing component.
Use one primary code reference per component, then a second only for a concrete gap.
This is a shortlist, not a requirement to survey every system. Check the actual file’s
license and pin its revision before copying. A public demo does not grant a code license.

## Structural sources

Already used in Area’s research or adaptations:

- **[Untitled UI](https://github.com/untitleduico/react):** badge anatomy, form controls,
  color-picker composition. Public React components are MIT; verify whether a particular
  example is free source or a separately licensed Pro asset.
- **[Microsoft Fluent UI](https://github.com/microsoft/fluentui):** presence states,
  component anatomy and native size-specific [System Icons](https://github.com/microsoft/fluentui-system-icons).
- **[Mantine](https://github.com/mantinedev/mantine):** indicator positioning/counts and
  useful state variants. Indicator is a pinned code adaptation in Area.
- **[shadcn/ui](https://github.com/shadcn-ui/ui):** composable React source for controls,
  grouped actions, dialogs and form layouts. Inspect the selected registry’s dependencies
  and behavior; the screenshot alone does not identify the implementation.
- **[Primer](https://github.com/primer/react):** action bars, toolbars, menus and compact
  product controls. Good reference when content and action hierarchy share one row.
- **[Vercel Geist](https://vercel.com/geist/introduction):** restrained visual hierarchy,
  code surfaces and component examples. Treat public docs as reference; verify source
  ownership/license before copying. Community “Geist UI” is not automatically Vercel source.
- **[Adobe Spectrum / React Aria](https://github.com/adobe/react-spectrum):** keyboard,
  focus, selection and color-control behavior; Spectrum toast was previously consulted.
- **[Carbon](https://github.com/carbon-design-system/carbon):** data-table patterns;
  **[Atlassian](https://atlassian.design/components/textarea/usage)** for earlier textarea
  guidance. These are targeted supplementary references.

Add to the candidate set:

- **[Google Material](https://github.com/material-components/material-web):** state,
  interaction and component anatomy. Material Web is in maintenance mode per its README
  (checked 2026-09-24). Material Design and the independent MUI project are distinct.
  Do not import Material’s entire type, shape or density language into Area.
- **[OpenAI Apps SDK UI](https://github.com/openai/apps-sdk-ui):** public components and
  styling intended for ChatGPT apps. This is a concrete code source; it is not proof of
  the private ChatGPT client’s full implementation. Check its license at the chosen revision.
- **[Base UI](https://github.com/mui/base-ui)** and
  **[Radix Primitives](https://github.com/radix-ui/primitives):** behavior references when
  the chosen visual source does not supply robust keyboard/focus semantics.

## Product visual direction

The owner’s target products are **ChatGPT, Notion, Cursor and Figma**, with Framer useful
for inspector composition. These guide Area’s intended character: quiet neutral surfaces,
clear action hierarchy, compact but readable controls, deliberate alignment and sparse
semantic color. These are Area design goals, not claims about those products’ internal tokens.

- ChatGPT: conversational content and composer/action hierarchy; use Apps SDK UI source
  where it covers the component.
- Notion: content-first hierarchy, quiet inline actions and low visual noise.
- Cursor: dense tool interfaces, navigation/editor relationships and unobtrusive controls.
- Figma: precision inspector inputs, split fields, alignment controls and clear value units.
- Framer: typed property controls and inspector composition. Existing research remains in
  COMPONENTS.md; public API docs do not establish private editor geometry.

User-supplied Figma color-field/alignment screenshots and browser box-model screenshots
are evidence for requested composition. Record screenshot scale/zoom as unknown unless
measured. Do not turn screenshot pixels into authoritative CSS values. Do not describe
Notion, Cursor or Figma’s complete product UI as open source without verified source.

## Where the rules live

- COMPONENT_ADAPTATION.md: canonical code → structure → visual → verification workflow.
- DESIGN_SYSTEM.md + inset.css: Area’s geometry/token contract.
- .agents/skills/area-visual-language/SKILL.md: visual decision-making for this repository.
- CONTRAST.md: paint and accessibility constraints.
- COMPONENTS.md: backlog and current decisions; completion registry remains authoritative.

Keep per-component evidence with the component adaptation record. New feedback updates
that record first; promote a rule only if it helps other components too.
