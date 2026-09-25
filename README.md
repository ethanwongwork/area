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

Open the [gallery](http://localhost:4321/gallery-components.html): components, type ramp,
iconography, color, UI scale, radius, surface and motion, each on its own page. The
documentation site is hidden for now; its entry points redirect to the gallery. The dev server rebuilds
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

- [Building a component](docs/COMPONENT_ADAPTATION.md): measured evidence, spec sheets, slot ownership, visual pass and review.
- [Design references](docs/DESIGN_REFERENCES.md): target products, design systems and where to measure each.
- [Component specs](docs/specs/README.md) and the [reference baseline](docs/research/BASELINE.md): per-component evidence and shared cross-product values.
- [Components](docs/COMPONENTS.md): scope, completion status, backlog and variant conventions.
- [Design system](docs/DESIGN_SYSTEM.md): tokens, naming, geometry and component conventions.
- [Theming](docs/THEMING.md): customization, inheritance and React scopes.
- [Contrast](docs/CONTRAST.md): color, focus and accessibility constraints.
- [Development](docs/DEVELOPMENT.md): architecture, commands, testing and generated files.

The gallery's [completion registry](apps/docs/src/component-status.mjs) is authoritative.
New and refined families stay In review until the owner accepts them.

Session notes live in [the handoff](.Codex/HANDOFF.md); history lives in the journal
and Git. Earlier audits and research were removed from the tree after commit `2f90f2d`
and remain in Git history.
