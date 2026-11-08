# Area — working guide

Build a broad, customizable component library whose every component and variant looks
exactly right: measured from real components, refined to ChatGPT, Notion and Figma's
visual character, and consistent across the system under every setting. Working
components and accurate specs matter more than speed.

## Start

- **The app is the source of truth** (owner, 2026-10-12). `apps/desktop` (Electron) is
  built only from Area and judged only in the app. Its regions are:
  - **Three regions, each with its own header** (owner, 2026-10-30; no Titlebar across the window): the
    Sidebar's holds the window controls' room, its toggle, search (⌘K, every place) and back and forward;
    the Canvas's the open tabs (Home first and fixed, then References or one per project, system or lab; a
    tab never changes what it holds), References and light / dark; the Inspector's its views and toggle.
    The profile and Settings (⌘,) sit at the Sidebar's foot.
  - **Sidebar** (the tab's own nav: in Home's tab Home, References, Projects and Systems (owner,
    2026-10-31: References is Discover, Following and Saved with its collections); in a system's
    tab Foundations (Themes, Tokens, Colors, Typography, Spacing, Shape, Elevation, Motion, Icons), Components (every
    family by name, under its kind) and
    Patterns and Versions (owner, 2026-10-30; grouped 2026-10-31; Versions was History); in a project's tab its Overview, Pages and layers, Explorations and Versions; a page's
    own list sits under the nav, never in place of it),
    **Canvas** and **Inspector** (Theme, Design, Code, Chat). Places and old links:
    `apps/desktop/src/places.ts`; systems (called brands until 2026-10-29), their themes and
    published versions (the Inspector's settings are the open system's working copy):
    `apps/desktop/src/systems.ts`; projects: `apps/desktop/src/projects.ts`.
  - The app's own UI is drawn in its chosen system's published theme (owner, 2026-10-30; Settings ›
    Appearance, `apps/desktop/src/app-look.ts`); the Inspector's settings reach only the specimens. Its
    layout was measured at type 13, Compact. Its UI follows `docs/PRODUCT_UI.md`.
  - `apps/docs` is archived: don't extend it or check work there.
- **One session at a time.** Before starting, check `origin/main` and open pull requests,
  so you don't build what another session has. When resuming, read `.Codex/HANDOFF.md`
  (Current state first).
- **Read for the task, not everything:**
  - Why things look as they do: `docs/PRINCIPLES.md`.
  - Adding anything (component, variant, prop, setting): `docs/GOVERNANCE.md` first.
  - Where code goes and which files a component touches: `docs/ARCHITECTURE.md`.
  - The rules: the relevant section of `docs/DESIGN_SYSTEM.md`, then `docs/THEMING.md`
    (settings), `docs/CONTRAST.md` (colour, focus, state paint) or `docs/MOTION.md`
    (transitions, crispness).
  - Words (labels, buttons, errors, empty states, status words): `docs/WRITING.md`.
  - Commands and checks: `docs/DEVELOPMENT.md`.
  - A component's evidence and decisions: `docs/specs/<slug>.md`; shared cross-product
    values: `docs/research/BASELINE.md`.

## Skills

| Skill | Use for |
|---|---|
| `area-component-intake` | Deciding whether a request is a new component, a variant, a setting, a composition or nothing, before building |
| `area-component-build` | Building or refining a component from measured evidence |
| `area-visual-language` | The visual pass: side by side with references and peers |
| `area-component-docs` | A family's Documentation entry (usage, do and don't, parts, keys, ARIA) |
| `area-foundation-change` | Changing a setting, token or system-wide rule across every family |
| `area-icon-construction` | Drawing or reviewing Area's icons |
| `area-illustration` | Area figures in the screens' style: real components with words as light bars; screens, vignettes, a gallery of every family, settings on screens |
| `area-ui-compose` | Composing screens and layouts from Area: shell, panels, spacing, feeds, grids, shelves, media, copy, screen recipes |
| `area-type-usage` | Choosing and checking each text's type style, ink, weight, line and spacing in a component, composition or kit; the type census |
| `area-ui-review` | Measuring and checking a composed screen's spacing, regions and copy (`scripts/layout-audit.js`) |
| `area-interaction-pass` | Testing the app in motion and its interaction patterns: responsive Canvas, bars, tooltips, breadcrumbs, tiles, menus, tabs (`scripts/cdp.mjs` drives Electron) |
| `area-a11y-audit` | Accessibility on a family or a screen: names and roles, keyboard, focus, target size, forced colours, reduced motion, zoom, RTL |
| `checkpoint` | A requested checkpoint or handoff |

## Work

- **Scope.** Follow the owner's requested component or task. Don't start components the
  owner hasn't asked for; propose them as candidates (`docs/COMPONENTS.md`).
- **Measure, don't recall.** Every visible value traces to a capture or a pinned source
  line recorded in the spec. Measure with `apps/docs/public/area-capture.js`; never read
  lengths off screenshots.
- **Target products are read-only.** Never trigger actions that change the owner's data.
  Ask before changing product settings such as theme.
- **Visual-first phase.**
  - Literal measured values live in private `--_*` properties marked `/* spec */`.
  - Reuse a token only when it equals the spec value.
  - A colour uses a matching semantic role, or `light-dark(…) /* spec */` when none
    matches.
- **Keep axes separate.**
  - Size, tone, emphasis, state, layout and composition each stay independent.
  - Light/dark, type, density and the depth controls are system settings, never variants.
  - Variants set local properties; base rules consume them.
  - Foreground stays fixed on hover.
  - Runtime state uses native or ARIA attributes and documented `data-*` hooks.
- **Keep every surface of a component aligned.** Update CSS, `manifest.ts`, React, demos,
  the Documentation entry and the spec together. Native props, refs, keyboard behaviour,
  focus and accessible names are part of the component. A spec's current-state sections
  are edited in place, and history is appended.
- **Tokens.** Axes own disjoint namespaces. Derive interactions in `emit/base.ts` and
  re-emit them at scope boundaries. Never register derived or paired semantic colours with
  `@property`. Preserve `palette.json`. Never weaken contrast tests.
- **Geometry** follows `packages/styles/src/inset.css`:
  - square icon boxes and one font reference;
  - insets written as border + shell padding + slot inset, with borders counted once;
  - first-line alignment for multiline text;
  - never nudge an individual glyph;
  - radius follows the component's documented shape role.
  - Icons are Area's `Glyph` at their native size.
- **Demos.**
  - Demos and snippets share their real source.
  - One variant per gallery tile, and one size per tile (`size-sm`, `size-md`,
    `size-lg`).
  - Example people are always David Tee; a list of several people uses teams for the
    others. Other copy uses the placeholder vocabulary (`docs/DESIGN_SYSTEM.md`, Example
    copy).
- **Feedback on app UI changes the real component**, never app-only CSS. Explain why the
  design is as it is and what a change affects before making it.
- **Completion is owner-confirmed** in `apps/desktop/src/content/component-status.mjs`.
  Passing builds and complete specs do not confer it.

## Finish

- **Check.** Run checks proportionate to the change (`docs/DEVELOPMENT.md`, "Checks by
  change").
- **Look.** Inspect visible changes in the app, light and dark. When done, quit every Area
  Electron and relaunch one from the finished worktree.
- **Report honestly.** Report failures and unverified behaviour plainly. Preserve unrelated
  edits.
- **Don't commit** build output, caches, dependencies, or captures that contain personal
  content.
- **Hand off.** After substantial work, keep the handoff's Current state short and true. Use
  the checkpoint skill only when requested.
- **Commit or push only when authorized.** GitHub `origin` is canonical.
