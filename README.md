# Area

A customizable component library built on shared design tokens. The goal is broad
component coverage, useful variants, and consistent visual and interaction quality.

The stack stays small: **tokens → framework-free CSS → React → live documentation**.
Components share theme, color, type size, density, radius, surface and motion settings instead
of carrying separate light/dark implementations.

## Run locally

Use Node 22.18+, 24.x, or 26+ (see `package.json`) and npm workspaces.

```sh
npm ci
npm run build   # the packages the app imports
npm run dev     # the desktop app (Electron), reloading on change
```

`npm run preview` serves the same app to a browser at http://localhost:4400.

The app (`apps/desktop`) is Area's gallery: every component, icon, type style and colour. Its
regions are the **Titlebar** (Language, Components, Typography, Icons and Color tabs, search,
layout toggles, light / dark), the **Sidebar** (the tab's list), the **Canvas** (the selection at
full size) and the **Inspector** (canvas settings and facts about the selection). It runs at type
13 and Compact density and is built from Area's own components; the Canvas carries its own type
size, density, radius and pills from the Inspector.

**The app is the source of truth** (owner, 2026-10-12). Area consumes itself: the app is built only
from Area, and it is the one place components, icons, type, colour and their states are shown and
judged. The documentation site (`apps/docs`, `npm run dev:docs`) is archived and is not a source of
truth. Component content and status, specimens and every demo now live in the app
(`apps/desktop/src/content`); the icon pipeline still sits in the site's folder until it moves to
`packages/icons`. Edit sources where they are and judge the result in the app. Reviews of icons and components are published as artifacts.

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
- `apps/desktop/`: the app (Electron): Titlebar, Sidebar, Canvas, Inspector.
- `apps/docs/`: archived site, not a source of truth; its icon sources and generator move to
  `packages/icons` next, then the site is deleted.
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

The gallery's [completion registry](apps/desktop/src/content/component-status.mjs) is authoritative.
New and refined families stay In review until the owner accepts them.

Session notes live in [the handoff](.Codex/HANDOFF.md); history lives in the journal
and Git. Earlier audits and research were removed from the tree after commit `2f90f2d`
and remain in Git history.
