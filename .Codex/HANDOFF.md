# Handoff — 2026-09-17

**Branch** `main` · **Last implementation commit** `7bfff36 feat: refine audited components and chroma`
**State** Green — implementation is committed and fully verified; this handoff/journal checkpoint awaits commit and push.

## Where things stand

Area is an eight-axis design system with framework-free CSS, thin React components, and a
static documentation site. The current refinement batch is complete: radius packages are
coherent, Button/Checkbox/Code/Nav have audit records, Code is the shared inline-reference
component, and dark-end color chroma has a gamut-bounded lift.

## What happened this session

- Radius names are now semantic: `sharp`, `subtle`, `soft`, `standard`, `round`, `rotund`,
  and `pill`. Button has only small, medium, and large packages; same-height text and icon
  buttons share their radius.
- Button, Checkbox, Code, and Nav have complete audit records. The temporary documentation
  ordering puts audited components first and marks them with a colored completion marker.
- Nav row text and icons now align to shared optical references, while text-only rows use the
  intentionally offset text column requested for section-header alignment. Horizontal Nav
  surfaces are lighter and selected items rely on their backplate rather than bold type.
- Code subsumes the static Token documentation treatment. It supports prose, tables,
  token swatches, subtle and on-color surfaces; legacy Token remains only as a compatibility
  wrapper and one gallery dogfood specimen. Removing experimental `text-box` trimming fixed
  Code's visually low baseline in Chromium.
- Dark chroma is lifted only where sRGB gamut headroom exists, without changing palette
  lightness/hue or semantic solid selection. Low-chroma tonal strokes have a deliberate
  chroma floor so component foreground/stroke colors improve broadly rather than only purple.

## In flight

Nothing functional. Commit and push this handoff/journal update; the tree should then be clean.

## Next

1. Audit Radio, Switch, and Slider against the component-audit framework.
2. Keep Nav's collapsed/drawer shell, Combobox, and MultiSelect as separate contracts.
3. Consider a dedicated TokenInput/Tag audit before adding behavior to legacy Token.

## Traps

- Build React before docs typecheck because docs resolve generated React declarations.
- Use `ui: "compact" | "default"`; `density` and `type` remain retired public inputs.
- The dark 750–950 rungs are commonly already 94–100% of sRGB cusp. Preserve the
  gamut-bounded lift rather than forcing clipping or moving their lightness/hue.
- Do not reinstate experimental `text-box` trimming on inline Code without cross-browser
  baseline verification.
- Legacy Token is compatibility-only. New docs prose/tables should use Code; behavior such
  as remove/selection belongs to a future TokenInput/Tag contract.
- Do not commit `dist/`, caches, or `node_modules/`.

## Verify

- `npm test`: **18,104 tests / 9 files passed**.
- `npm run build`: passed; manifest parity covers **36 components**.
- `npm run lint:manifest -w @area/styles`: passed.
- `npm run build:docs`: passed; **46 pages / 153 demos**, dogfood **36/36**.
- `node packages/tokens/src/contrast/report.ts`: **344 passing / 0 failing** across **66 themes**.
- `npm run typecheck`, `npm run test:contracts` (**14/14**), `npm run test:consumer`, and
  `git diff --check` all passed.
