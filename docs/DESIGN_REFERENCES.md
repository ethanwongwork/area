# Design references

Where to measure, and what each source is good for. The process is in
[Building a component](COMPONENT_ADAPTATION.md); the shared cross-product values are in
[the baseline](research/BASELINE.md).

## Target products

ChatGPT, Notion and Figma set Area's visual character: quiet neutral surfaces, clear
action hierarchy, compact but readable controls, deliberate alignment and sparse
semantic color. Their interfaces are web DOM, so their rendered values can be measured
directly with the capture script. Use Claude in Chrome with the owner's logged-in
sessions, read-only. Record values; never copy their code or assets.

| Product | Where to measure | Strongest for | Limits |
|---|---|---|---|
| **ChatGPT**: chatgpt.com | Composer, sidebar, conversation actions, menus, model picker, settings dialogs | Conversation and composer hierarchy, menus, dialogs | Class names are utility or minified; states need real hover/focus |
| **Notion**: notion.so | Sidebar, page blocks, database views, menus, comments, people and presence | Content-first hierarchy, navigation, lists, inline actions | Heavy inline styles; captures show computed values, not token names |
| **Figma**: figma.com | File browser, editor toolbar, layers and properties panels, menus, comments, multiplayer avatars | Inspector fields, split and unit inputs, alignment, toolbars, precise dense controls | The canvas is WebGL and cannot be captured; panels and chrome are DOM |

**Cursor** is a secondary target for density and icon/type balance. Its editor is a
desktop app, so measure its web surfaces (cursor.com, docs, dashboard) and its published
icon rules: 16px icons with a 1.25px stroke beside 16px text, 24px icons with 1.5px, round
caps, and at least 3px between overlapping shapes
([The making of Cursor's icons](https://www.minoradventures.co/blog/the-making-of-cursors-icons)).

Framer is a useful secondary reference for typed property controls and inspector
composition. [OpenAI Apps SDK UI](https://github.com/openai/apps-sdk-ui) is public code
for ChatGPT apps. It is evidence of that library, not of the whole ChatGPT client:
compare it against live ChatGPT captures before relying on it.

## Design systems

Untitled UI is the first reference for structure and visual quality. Use another system
when it has a better-matched behavior, a variant the products show, or a component
Untitled lacks. For each system, measure the rendered docs page and read the source at a
pinned commit. Check the license of the exact file before adapting any code.

| System | Rendered | Source | Kit | Good for |
|---|---|---|---|---|
| **Untitled UI** | [untitledui.com/react/components](https://www.untitledui.com/react/components) | [untitleduico/react](https://github.com/untitleduico/react) (MIT; some examples are paid Pro assets, so check) | Untitled UI Figma kit | Anatomy, sizing ramps, badge/avatar/form/button structure, visual polish |
| **Fluent 2** | [react.fluentui.dev](https://react.fluentui.dev) Storybook, [fluent2.microsoft.design](https://fluent2.microsoft.design) | [microsoft/fluentui](https://github.com/microsoft/fluentui) (MIT) | Fluent 2 web kit | Presence and counter badges, size-specific [system icons](https://github.com/microsoft/fluentui-system-icons), dense product controls |
| **Mantine** | [mantine.dev](https://mantine.dev) | [mantinedev/mantine](https://github.com/mantinedev/mantine) (MIT) | — | Indicator positioning and counts, broad variant coverage |
| **shadcn/ui** | [ui.shadcn.com](https://ui.shadcn.com) | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) (MIT) | — | Composable controls, grouped actions, dialogs, forms, input groups |
| **Primer** | [primer.style](https://primer.style/product/components/) | [primer/react](https://github.com/primer/react) (MIT) | Primer Figma | Action bars, toolbars, menus, tree view, compact product controls |
| **React Spectrum / React Aria** | [react-spectrum.adobe.com](https://react-spectrum.adobe.com) | [adobe/react-spectrum](https://github.com/adobe/react-spectrum) (Apache-2.0) | — | Keyboard, focus, selection, color controls, date and number fields |
| **Carbon** | [carbondesignsystem.com](https://carbondesignsystem.com) | [carbon-design-system/carbon](https://github.com/carbon-design-system/carbon) (Apache-2.0) | Carbon kit | Data tables, structured forms |
| **Material** | [material-web.dev](https://material-web.dev), [m3.material.io](https://m3.material.io) | [material-components/material-web](https://github.com/material-components/material-web) (Apache-2.0; maintenance mode per its README, checked 2026-09-24) | Material 3 kit | State layers, interaction and anatomy. Don't import Material's type, shape or density language |
| **Vercel Geist** | [vercel.com/geist](https://vercel.com/geist/introduction) | Verify ownership and license before copying; community "Geist UI" is a different project | — | Restrained hierarchy, code surfaces |
| **Base UI / Radix** | [base-ui.com](https://base-ui.com), [radix-ui.com](https://www.radix-ui.com) | [mui/base-ui](https://github.com/mui/base-ui), [radix-ui/primitives](https://github.com/radix-ui/primitives) (MIT) | — | Overlay, focus and keyboard behavior when the visual source lacks it |

Licenses listed here are the repository licenses; confirm the file you adapt at the
pinned commit. A public demo or docs page does not grant a code license.

## Choosing a source for a component

1. Look for the component in all three target products and write down where it
   appears, or where you looked without finding it.
2. Measure Untitled UI's version when it exists. When the pattern has a canonical
   implementation elsewhere (for example Fluent for presence status, or Mantine for
   indicator placement), measure that too.
3. Add another system only for a concrete gap: a missing variant, state or behavior.
4. Record each source in the spec's source table with its commit, license and capture
   files.
