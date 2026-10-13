# Component Stage: research and decisions (2026-10-12)

How the app shows one component in isolation, and how that view relates to the gallery grid.
Built in `apps/desktop/src/stage.tsx`, `src/pages/components.tsx` and `src/content/playgrounds.tsx`.

## Owner decisions

- The gallery grid stays the way through the whole system ("crucial for seeing the entire design
  system at a glance"). The Stage is the isolated view. The two must read as one experience.
- States as their own control was left open ("unsure"). Built: flag states (loading, disabled,
  selected) are Properties switches; pointer states stay live on the Stage. A frozen
  hover / press / focus strip is not built (see Open).
- "Code should be an actual section if necessary", with Primer's demo-and-code container as the model.
- "Go with your recommendations" for the rest.

## What was surveyed

Opened in a browser: React Bits (Swipe Row), MUI, StackBlitz, Mantine, Storybook (Primer's) and
shadcn/ui. Read from docs and source: Radix Themes and Primitives, Base UI, Ark, Chakra v3,
HeroUI, Geist, Primer, Atlassian, Polaris, Fluent 2, Apple HIG, Material 3, Magic UI, Aceternity,
coss, Animata, 21st.dev, Figma (component properties, Dev Mode playground), Framer property
controls, Ladle, Histoire, CodeSandbox and Sandpack, CodePen, JSFiddle, v0, Bolt, Lovable,
Chromatic, Zeroheight, Polypane, Responsively and Tailwind Plus. CodeSandbox's own page was behind a
bot check, so its docs were used.

## Findings that set the design

1. **Split what is rendered from how it is viewed.** Storybook's args against its globals; Figma and
   Framer put a selection's properties in the right panel. In Area: the Inspector holds Properties;
   the Canvas bar holds view tools (replay, zoom, previous / next); density, radius and pills stay
   the Canvas settings, and theme stays in the Titlebar.
2. **Preview first, then code, then reference.** Every system that keeps the component in front
   puts install, imports and link rows below it, or leaves them out.
3. **One row per axis, not one section per value.** Radix, Geist and Atlassian show a whole axis
   side by side; shadcn's section per variant is longer and repeats itself. Area already groups
   tiles (Default, Variants, Tones, Sizes, Layout, Content, States, Behavior, Variant × tone).
4. **Code is attached and collapsed** (Primer, Base UI, Geist, MUI), and generated from the current
   settings with only non-default props (Mantine's configurator, React Bits' usage snippet).
5. **Controls come from the component's own declaration** (Storybook argTypes, Figma variant
   properties). Area's `manifest.ts` already lists axes, booleans, states, parts and defaults.
6. **Resizable preview with a width readout** (React Bits, Tailwind Plus, v0): drag the edge,
   arrow keys step, double-click resets.
7. **Anti-patterns:** install or library pickers above the preview; permanent code / preview
   splits (StackBlitz, Sandpack); browser chrome round a single component; code expanded under
   every example; a bottom panel competing with the canvas for height; global settings mixed into
   component props.

## What was built

- **Two levels.** All (the grid, or a list of families) and a family's Stage. The family-only grid
  is now the Stage's lower half: the same tiles, labels and order, under their group headings.
- **Opening keeps your place.** Double-click a tile, press ⌘↓ or use the Inspector's Open: the
  Stage opens on that tile (`#components/<family>/<tile>`). A family's name opens its first tile.
- **Coming back restores the spot.** Escape (unless a field or an open overlay has it), ⌘↑, ⌘[ or
  All returns to the grid with the tile last on the Stage selected, centred, and focus on the
  family's name.
- **Stage.** The tile made large: the tile's edge, corner, surface and head; the specimen at real
  size (or 2×); the code attached under a decorative rule with Copy, collapsing past 8 lines; the
  right edge resizes it (288 to the full width, readout in the head).
- **Code.** The configured instance's generated code (import plus JSX, non-default props), or the
  demo's own source, from main's build-time extractor (`scripts/snippets.mjs`,
  `virtual:demo-snippets`), with its first-line indent fixed.
- **Properties** (Button, Badge and Accordion so far). Generated from the manifest: two or three choices as
  Segmented, longer lists as Select, flags as Switches, the label as a field, Reset once changed. An
  edit that lands on a tile's configuration moves the Stage to that tile; otherwise the head reads
  "Custom". Composition tiles (icons, shortcuts, alignment context) show their demo as written.
- **Reference under the tiles.** Props (as before), Anatomy (root and parts with their classes)
  and States (each runtime state and its attribute), both from the manifest.

## Open

- Playgrounds for more families: each needs a `PLAYGROUNDS` entry naming its axes, switches and
  label (`src/content/playgrounds.tsx`).
- 92 generated demos have no literal source (Badge's and Indicator's gallery maps), so a composition
  tile from them shows no code.
- A React / HTML switch on the code, "Open source" in an editor (needs an Electron bridge), a stage
  background choice, and a measure overlay were recommended but not built.
- Frozen hover / press / focus tiles need a documented `data-*` hook per component; Button paints
  hover with `:hover` only.
- Single-tile groups each take a row, which makes the lower half long for families with many
  one-tile groups.
