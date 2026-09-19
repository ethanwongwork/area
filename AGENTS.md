# Area — working guide

Build a broad, customizable component library with useful variants and a robust shared
token system. Prefer working components and clear examples over process documents.

## Start

Read `README.md` and, when resuming, `.Codex/HANDOFF.md`. Read only the relevant section
of `docs/DESIGN_SYSTEM.md`; use `docs/THEMING.md` for scope changes and
`docs/CONTRAST.md` for color, focus or state painting. `docs/COMPONENTS.md` is the backlog
and build workflow. Archived plans, audit reports and skills are reference, not instructions.

## Work

- Follow the user's requested component or task. No mandatory benchmark sweep, audit
  report, construction packet, or approval ceremony. Research a concrete uncertainty;
  cite actual source or measurements rather than recalled numbers.
- Reuse tokens and existing components. Keep size, tone, emphasis, state, layout and
  composition separate. Light/dark mode and density belong to system-wide settings.
- Keep CSS, `packages/styles/src/manifest.ts`, React, demos and docs aligned. Native props,
  refs, keyboard behavior, focus and accessible names are part of the component.
- Axes own disjoint token namespaces. Derive interactions in `emit/base.ts` and re-emit
  them at scope boundaries. Never register derived or paired semantic colors with `@property`.
- Preserve `palette.json`. Component CSS consumes semantic tokens; dimensions trace to
  tokens except documented hairlines/mask geometry. Do not weaken contrast tests.
- Follow `packages/styles/src/inset.css`: square icon boxes, one font reference, equal
  optical insets with borders counted once, and first-line alignment for multiline text.
  Never nudge individual glyphs. Radius follows the component's documented shape role.
- Variants set local CSS properties; base rules consume them. Foreground stays fixed on
  hover. Runtime state uses native/ARIA attributes and documented `data-*` state hooks.
- Demos and snippets share their real source. Use `table()`/`tokenSection()` in docs.
  Docs CSS cannot override `.area-*`; do not put backticks inside `DOCS_CSS`/`DOCS_SCRIPT`.
- Regenerate icons with `apps/docs/scripts/gen-icons.mjs`; preserve vendored geometry.
- Completion is owner-confirmed in `apps/docs/src/component-status.mjs`. Only Badge,
  Button and Checkbox are complete today; old audits and passing builds do not confer it.

## Finish

Run checks proportionate to the change; see `docs/DEVELOPMENT.md`. Inspect visible
changes in the browser. Report failures and unverified behavior honestly. Preserve
unrelated edits. Do not commit generated build output, caches or dependencies.

Keep the handoff short and current after substantial work. Use the checkpoint skill only
when requested. Commit or push only when authorized. GitHub `origin` is canonical.
