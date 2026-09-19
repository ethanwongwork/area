# Area

A customizable component library built on shared design tokens. The goal is broad
component coverage, useful variants, and consistent visual and interaction quality.

The stack stays small: **tokens → framework-free CSS → React → live documentation**.
Components share theme, color, UI scale, radius, surface and motion settings instead
of carrying separate light/dark implementations.

## Run locally

Use Node 22.18+, 24.x, or 26+ (see `package.json`) and npm workspaces.

```sh
npm ci
npm run dev
```

Open the [component gallery](http://localhost:4321/gallery.html). The dev server rebuilds
changed sources and keeps the last successful preview if a build fails.

## Use the library

Build the workspace with `npm run build`, then import components and CSS separately:

```tsx
import { Button, Theme } from "@area/react";
import "@area/styles/area.css";

export function Example() {
  return (
    <Theme value={{ theme: "dark", accent: "teal", ui: "compact" }}>
      <Button variant="soft" tone="accent">Save changes</Button>
    </Theme>
  );
}
```

Plain HTML uses the same stylesheet and `data-area-*` attributes. Stable semantic CSS
custom properties provide customization beyond the presets. The packages are local,
unpublished ESM workspaces; publishing them is separate work.

## Where to work

- `packages/tokens/`: palette, scales, semantic roles, theme resolution and token tests.
- `packages/styles/`: component CSS and the shared variant manifest.
- `packages/react/`: components, native behavior, composition and typed helpers.
- `apps/docs/`: component pages, real demos, gallery and browser verification fixtures.
- `tests/` and `scripts/`: consumer checks, retained fixtures and package build helpers.

## Essential documentation

- [Components](docs/COMPONENTS.md): scope, completion status, backlog and the short build workflow.
- [Design system](docs/DESIGN_SYSTEM.md): tokens, naming, geometry and component conventions.
- [Theming](docs/THEMING.md): customization, inheritance and React scopes.
- [Contrast](docs/CONTRAST.md): color, focus and accessibility constraints.
- [Development](docs/DEVELOPMENT.md): architecture, commands, testing and generated files.

Only **Badge, Button and Checkbox** are currently owner-confirmed complete. The gallery's
[completion registry](apps/docs/src/component-status.mjs) is authoritative; everything
else is unrefined even where an older report called it complete.

[Archived research](archive/README.md) remains available when a specific question needs
it. It is not required reading or an implementation plan. Session notes live in
[the handoff](.Codex/HANDOFF.md); history lives in the journal and Git.
