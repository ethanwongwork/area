# Area — working guide

Build a broad, customizable component library whose every component and variant looks
exactly right: measured from real components, refined to ChatGPT, Notion and Figma's
visual character, and consistent across the system. Working components and accurate
specs matter more than speed.

## Start

**New sessions work on the app itself: the gallery in `apps/desktop`** (Electron; later an
IDE / VS Code fork). Its regions are the **Titlebar** (tabs: Language, Components, Typography,
Icons, Color; search; layout toggles; light / dark), the **Sidebar** (left list), the **Canvas**
(centre) and the **Inspector** (right). Build it from Area components at the compact UI scale.
The documentation site (`apps/docs`) is archived: don't extend it; it stays only as the source
of demos, specimens, page content and the icon pipeline that the app imports. Reviews of icons
and components happen on artifacts, not in the docs site.

Read `README.md` and, when resuming, `.Codex/HANDOFF.md`. For component work, read
`docs/COMPONENT_ADAPTATION.md` (the process) and use the `area-component-build` and
`area-visual-language` skills (`.agents/skills/`, linked from `.claude/skills/`). Each
component's evidence and decisions are in `docs/specs/<slug>.md`; shared cross-product
values are in `docs/research/BASELINE.md`. Read only the relevant section of
`docs/DESIGN_SYSTEM.md`; use `docs/THEMING.md` for scope changes, `docs/CONTRAST.md` for
color, focus or state painting, and `docs/MOTION.md` for transitions, animation and crispness. `docs/COMPONENTS.md` is the inventory and backlog.

## Work

- Follow the user's requested component or task. Don't start components the owner hasn't
  asked for.
- Every visible value traces to a capture or a pinned source line recorded in the spec.
  Measure with `apps/docs/public/area-capture.js`; don't recall numbers or read lengths off
  screenshots. Target products are read-only: never trigger actions that change the
  owner's data, and ask before changing product settings such as theme.
- **Visual-first phase:** component CSS may use literal measured values in private
  `--_*` properties marked `/* spec */`. Reuse a token only when it equals the spec value.
  Colors use a matching semantic role, or `light-dark(…) /* spec */` when none matches.
  Token systematization is a later phase.
- Keep size, tone, emphasis, state, layout and composition separate. Light/dark mode and
  density belong to system-wide settings. Variants set local CSS properties; base rules
  consume them. Foreground stays fixed on hover. Runtime state uses native/ARIA attributes
  and documented `data-*` state hooks.
- Keep CSS, `packages/styles/src/manifest.ts`, React, demos, docs and the spec aligned.
  Native props, refs, keyboard behavior, focus and accessible names are part of the
  component.
- Axes own disjoint token namespaces. Derive interactions in `emit/base.ts` and re-emit
  them at scope boundaries. Never register derived or paired semantic colors with
  `@property`. Preserve `palette.json`. Do not weaken contrast tests.
- Follow `packages/styles/src/inset.css`: square icon boxes, one font reference, insets
  written as border + shell padding + slot inset with borders counted once, and
  first-line alignment for multiline text. Never nudge individual glyphs. Radius follows
  the component's documented shape role. Use native Fluent icon cuts at their size.
- Demos and snippets share their real source. One variant per gallery tile, and one size per
  tile (`size-sm`, `size-md`, `size-lg`; never several sizes in one container). Example people are
  always David Tee (a list of several people uses teams for the others). Use
  `table()`/`tokenSection()` in docs. Docs CSS cannot override `.area-*`; do not put
  backticks inside `DOCS_CSS`/`DOCS_SCRIPT`.
- Regenerate icons with `apps/docs/scripts/gen-icons.mjs`; preserve vendored geometry.
- Completion is owner-confirmed in `apps/docs/src/component-status.mjs`. Passing builds and
  complete specs do not confer it.

## Finish

Run checks proportionate to the change; see `docs/DEVELOPMENT.md`. Inspect visible
changes in the browser. Report failures and unverified behavior honestly. Preserve
unrelated edits. Do not commit generated build output, caches, dependencies or captures
that contain personal content.

Keep the handoff short and current after substantial work. Use the checkpoint skill only
when requested. Commit or push only when authorized. GitHub `origin` is canonical.
