# 08 Evidence ledger

> **v2 status, 2026-09-18.** Geometry is no longer covered by this ledger. Every size,
> padding, gap, type and radius value now lives in `evidence/` (machine-extracted, pins in
> `evidence/PINS.md`) and is interpreted in `construction/`. Sections B and C below
> (recalled documentation and product observation) remain valid only as leads for
> **variants and behaviour**; no number in them may be used. Systems with extracted
> geometry: OpenAI, Primer, shadcn/ui, Fluent 2, Material 3 tokens, Carbon, MUI,
> Atlassian (npm, compiled), Radix Themes. Systems without: Geist, Notion, Figma, Apple HIG.
> Known extractor limits: Atlassian values are token fallbacks from compiled CSS and lose
> which size prop selects them; MUI theme-driven values (breakpoints, shape radius,
> typography variants) appear as references, not numbers; Carbon `layout.size` and
> `layout.density` calls are annotated with the default scale, not per-component
> overrides; Fluent values set through CSS variables in a sibling file need `--full`.

Access date for everything below: **2026-09-18**.

`COMPONENT_AUDIT.md` requires each audit to record URL, access date, and one of four
evidence levels. This pack was assembled in one session, so its evidence is uneven. Be
honest about that in the per-family reports: copy a row's level from here, and upgrade it
only after re-checking the source.

## A. Read from source today (level: published system specification)

| Code | System | What was read | Location | Commit (date) |
| --- | --- | --- | --- | --- |
| OAI | OpenAI Apps SDK UI | Component prop types for Alert, Avatar, AvatarGroup, Badge, CodeBlock, EmptyMessage, Indicator, Menu, Popover, SegmentedControl, Select, SelectControl, ShimmerText, Slider, Switch, TagInput, Tooltip, CopyTooltip; `variables-components.css` geometry tokens; SegmentedControl and Switch CSS | `github.com/openai/apps-sdk-ui`, `src/components/*`, `src/styles/variables-components.css` | `0f00143` (2026-05-05) |
| PRI | Primer React | Every `*.docs.json` for the components named in this pack (props, unions, defaults, subcomponents); ToggleSwitch, SegmentedControl, Label, UnderlineNav CSS for geometry | `github.com/primer/react`, `packages/react/src/*` | `e4e6eba` (2026-09-18) |
| SHA | shadcn/ui | Full registry list at HEAD and the `cva` variants, sizes, exported parts, and Tailwind geometry for switch, slider, tabs, toggle, toggle-group, badge, avatar, alert, sonner, tooltip, progress, spinner, skeleton, card, dialog, alert-dialog, popover, hover-card, separator, table, kbd, item, empty, button-group, input-group, field, sheet, drawer, dropdown-menu, marker, attachment, bubble, message | `github.com/shadcn-ui/ui`, `apps/v4/registry/new-york-v4/ui/*` | `a87a63b` (2026-09-17) |
| FLU | Fluent UI React v9 | `*.types.ts` prop unions for switch, slider, tabs, menu, badge (Badge, CounterBadge, PresenceBadge), avatar (+ group, popover), message-bar, toast, tooltip, progress, spinner, skeleton, card, dialog, popover, divider, table (+ DataGrid), tags, drawer, breadcrumb, accordion, persona, rating, tree, nav, toolbar, infolabel, teaching-popover, tag-picker, list, search, spinbutton, combobox, link, carousel, swatch-picker, field | `github.com/microsoft/fluentui`, `packages/react-components/react-*/library/src/components/*/*.types.ts` | `babf260` (2026-09-16) |
| GEI | Vercel Geist | Component catalogue (sidebar list) and the **Switch** page in full (variants: default, disabled, sizes small / default / large, full width, tooltip, icon; best-practice notes) | `https://vercel.com/geist`, `https://vercel.com/geist/switch` | live page |

Notes on these sources:

- Fluent pixel values in this pack (track sizes, tab heights, tag heights) were **not** in
  the types files; they are recalled from the Fluent 2 design specs. Treat Fluent
  *prop unions* as verified and Fluent *pixel geometry* as recalled.
- Multi-line Fluent unions that the extraction missed and that are therefore recalled:
  Avatar `shape`, MessageBar `intent` and `layout`, Toast `position` / `intent` / timing
  options, Tag `appearance` / `shape` / `size`, Drawer `position` / `size`, Dialog
  `modalType` values, Popover `size`. Avatar's 14-value `size` union was verified.
- shadcn pixel values are converted from Tailwind classes at the default 4px scale.
- OpenAI's package is the Apps SDK design system, which is the closest thing to a
  published ChatGPT component spec. ChatGPT product behaviour itself (code block header,
  streaming, composer) is **direct product observation**, recalled, not re-observed today.

## B. Recalled from published documentation, not re-read today (level to record: "published system specification, recalled; re-verify before citing")

| Code | System | Canonical URL to re-verify | Used for |
| --- | --- | --- | --- |
| GEI | Geist, all pages other than Switch | `https://vercel.com/geist/<slug>.md` (Markdown for agents; the H2 list is the variant list). Slugs: avatar, badge, banner, breadcrumbs, choicebox, clearable-input, code-block, collapse, combobox, command-menu, context-card, context-menu, description, drawer, empty-state, entity, error, feedback, gauge, input, keyboard-input, loading-dots, material, menu, modal, multi-select, note, pagination, pill, progress, project-banner, radio, relative-time-card, scroller, select, sheet, show-more, skeleton, slider, snippet, spinner, split-button, status-dot, table, tabs, textarea, theme-switcher, toast, toggle, tooltip | Toggle, Tabs, Badge, Note, Toast, Tooltip, Progress, Gauge, Spinner, Loading dots, Skeleton, Status dot, Keyboard input, Avatar, Table, Code block, Snippet, Modal, Menu, Empty state, Error, Entity, Description, Choicebox, Collapse, Material |
| M3 | Material Design 3 | `https://m3.material.io/components` | Switch, Slider, Chips, Tabs, Segmented buttons, Badges, Menus, Dialogs, Sheets, Cards, Lists, Progress, Snackbar, Tooltips, Dividers |
| CAR | IBM Carbon | `https://carbondesignsystem.com/components/overview/components/` and `github.com/carbon-design-system/carbon` | Toggle, Slider, Content switcher, Tag, Tabs, Notification family, Tooltip family, Progress bar, Progress indicator, Loading, Skeleton, Tile, Modal, Popover, Accordion, DataTable, CodeSnippet, Contained / Structured list, Pagination, Tree view |
| ATL | Atlassian Design System | `https://atlassian.design/components` | Toggle, Tag, Lozenge, Badge, Avatar, Banner, Section message, Inline message, Flag, Tooltip, Progress tracker, Modal dialog, Popup, Spotlight, Dynamic table, Code block, Empty state, Inline edit, Select |
| MUI | MUI Material UI and Joy UI | `https://mui.com/material-ui/all-components/` and `github.com/mui/material-ui` | Switch, Slider, Rating, ToggleButton, Chip, Tabs, Badge, Avatar, Alert, Snackbar, Tooltip, Progress, Skeleton, Card, Dialog, Popover, Divider, Accordion, Table, Pagination, Stepper, Timeline (lab), Autocomplete |
| HIG | Apple Human Interface Guidelines | `https://developer.apple.com/design/human-interface-guidelines/components` | Toggles, Sliders, Segmented controls, Menus, Alerts, Sheets, Popovers, Lists, Progress indicators, Disclosure controls |

## C. Direct product observation, recalled (level: direct product observation; re-observe and screenshot before citing)

| Code | Product | Used for |
| --- | --- | --- |
| NOT | Notion web app | Settings-row switches, select-property pills and the 10-colour palette, callout blocks, toasts, tooltips with shortcuts, menus with search header and switch items, breadcrumbs with collapse, database view tabs with "N more" and "+", sidebar tree with hover actions and chevron-replaces-icon, database table (type icons, calculate row, frozen column, hover affordances), page properties list, side peek / centre peek, code block language picker, quick find |
| FIG | Figma UI3 | Property-panel segmented icon controls, slider + numeric field pairs and scrub inputs, dark menus with check column and shortcuts, plain panel tabs, layers tree with hover eye / lock, variable pills and binding states, multiplayer avatar rings, draggable floating panels, Dev Mode code panel, bottom-centre dark toasts |
| - | ChatGPT, Cursor | Code block header with language + copy + apply / run, collapsed long code, streaming state, diff blocks, shimmer "Thinking" text |

Neither Notion nor Figma publishes a component specification. Per the research policy,
anything from section C must be logged as observation and must not be described as that
product's API.

## D. Inference (level: inference)

- **Stat / KPI**: not a named component in any of the seven required benchmarks or the five
  catalogues. Spec in file 06 is inferred from dashboard conventions and from Chakra UI,
  Ant Design, and Tremor, which are outside Area's evidence set.
- "Suggested Area" geometry lines in every family file are my proportional suggestions for
  a compact system. They are starting points for the rendered-geometry step, not findings.
- Web-platform recommendations (`popover`, anchor positioning, `<details name>`,
  `interpolate-size`, `field-sizing`, scroll-driven animations, customisable `<select>`)
  are from platform knowledge. Check current browser support and keep the stated fallbacks.

## E. Things I could not do

- The Area repository (`ethanwongwork/area`, commit `7cb043d`, 2026-09-18) was read after
  the family files were written. Naming, manifest schema, token vocabulary and the current
  variants of all 45 manifest blocks are recorded in `09-area-repo-map.md`, and markup in
  files 01 to 06 was converted to Area's modifier-class convention. The CSS skeletons were
  not rebuilt or run inside the repo, and their px values still need mapping per file 09.
- I did not render or measure anything. The audit framework's geometry, contrast,
  forced-colors, zoom, and assistive-technology steps are all still to do per family.
- Storybooks were not crawled page by page. For Primer, shadcn, Fluent, and OpenAI the
  source files above are stronger evidence than Storybook (they are what Storybook
  renders). For Carbon, MUI, Atlassian, Material, HIG, and most of Geist, a confirmation
  pass is still owed; section B lists where.

## F. Fast re-verification recipe for Codex

```bash
# one-time, shallow and sparse so it stays small
git clone --depth 1 https://github.com/openai/apps-sdk-ui.git
git clone --depth 1 --filter=blob:none --sparse https://github.com/shadcn-ui/ui.git shadcn \
  && git -C shadcn sparse-checkout set apps/v4/registry/new-york-v4/ui
git clone --depth 1 --filter=blob:none --sparse https://github.com/primer/react.git primer \
  && git -C primer sparse-checkout set packages/react/src
git clone --depth 1 --filter=blob:none --sparse https://github.com/microsoft/fluentui.git fluent \
  && git -C fluent sparse-checkout set --no-cone '/packages/react-components/*/library/src/components/*/*.types.ts'

# Primer: every prop of one component
jq '.props[], (.subcomponents[]? | {sub: .name, props})' primer/packages/react/src/ToggleSwitch/ToggleSwitch.docs.json

# Geist: variant list of one component = its H2 headings
curl -sL -H 'Accept: text/markdown' https://vercel.com/geist/note | grep '^## '
```

Record the commit hash and date in the family report's evidence ledger each time.
