# Area

A design system whose core is a broad, customizable component library: every component and
variant measured from real products (ChatGPT, Notion, Figma), refined into one consistent
visual language, and correct under every combination of settings.

The stack stays small: **tokens → framework-free CSS → React → the app**. Components share
theme, colour, type size, density, radius, stroke, depth and motion settings instead of
carrying their own light, dark or compact versions.

## Run locally

Use Node 22.18+, 24.x or 26+ and npm workspaces.

```sh
npm ci
npm run build   # the packages the app imports
npm run dev     # the desktop app (Electron), reloading on change
```

`npm run preview` also serves the app to a browser at http://localhost:4400.

## The app is the source of truth

`apps/desktop` is the app: every component, icon, type style and colour, and the one place
they are judged (owner, 2026-10-12). It is built only from Area's own components, at type 13
and Compact density. Its regions:

- **Titlebar:** the tabs Language, Components, Typography, Icons, Color, Testing, Brand and
  Materials; search; panel toggles; light / dark.
- **Sidebar:** the tab's list.
- **Canvas:** the selection, at the settings chosen in the Inspector.
- **Inspector:** Theme (the Canvas settings), Design (the selection), Code (how to use it)
  and Chat.

Each component family's page shows Overview, Documentation, API, Code and Spec. The
documentation site (`apps/docs`) is archived and is not a source of truth.

## Use the library

Build the workspace with `npm run build`, then import components and CSS separately:

```tsx
import { Button, Theme } from "@area/react";
import "@area/styles/area.css";

export function Example() {
  return (
    <Theme value={{ theme: "dark", accent: "teal", density: "28" }}>
      <Button variant="soft">Save changes</Button>
    </Theme>
  );
}
```

Plain HTML uses the same stylesheet with the `area-*` classes and `data-area-*` settings.
The packages are local, unpublished ESM workspaces.

## Where things are

| Path | Holds |
|---|---|
| `packages/tokens` | Palette, settings (axes), semantic roles, derivations, the contrast gate |
| `packages/styles` | Component CSS and the manifest (variants, parts, states) |
| `packages/react` | Components, behaviour and typed variant helpers |
| `packages/icons` | Area's icons: drawings, generator, tools, the `@area/icons` package |
| `apps/desktop` | The app; `src/content` holds families, demos, tiles, documentation and status |
| `docs/` | The guides below; `docs/specs` one spec per family; `docs/research` evidence |
| `apps/docs` | Archived site, still the renderer for review pages and the capture script |

## Documentation

Start with the first three; the rest are references.

| Doc | Read it for |
|---|---|
| [Brief](docs/BRIEF.md) | The product scope (2026-11-23): Area as a layer beside every tool; the Sep 27 brief is in `docs/archive/` |
| [Principles](docs/PRINCIPLES.md) | What Area is, the principles every component reflects, the design language |
| [Governance](docs/GOVERNANCE.md) | How the library grows: new component vs variant vs setting, vocabulary, lifecycle, where each fact lives |
| [Architecture](docs/ARCHITECTURE.md) | How it is built in code, and the files a new component touches |
| [Building a component](docs/COMPONENT_ADAPTATION.md) | The evidence process: captures, spec, build, visual pass, review |
| [Design system](docs/DESIGN_SYSTEM.md) | The rules: tokens, colour, state paint, elevation, strokes, size and shape, insets, API |
| [Theming](docs/THEMING.md) | Every setting, its values and scopes |
| [Contrast](docs/CONTRAST.md) · [Motion](docs/MOTION.md) | Colour, focus and accessibility constraints; durations, recipes, crispness |
| [Product UI](docs/PRODUCT_UI.md) | Rules for building a product with Area, as the app does |
| [Components](docs/COMPONENTS.md) | The library by group, look-alike boundaries, candidates |
| [Design references](docs/DESIGN_REFERENCES.md) · [Baseline](docs/research/BASELINE.md) | Where to measure; shared cross-product values |
| [Specs](docs/specs/README.md) | One per family: evidence, decisions, feedback |
| [Development](docs/DEVELOPMENT.md) | Commands, checks, CI, verifying in the app |

Agents start from [AGENTS.md](AGENTS.md) and the skills in `.agents/skills/`. Completion is
owner-confirmed in [`component-status.mjs`](apps/desktop/src/content/component-status.mjs).
Session notes are in [the handoff](.Codex/HANDOFF.md); history is in Git.
