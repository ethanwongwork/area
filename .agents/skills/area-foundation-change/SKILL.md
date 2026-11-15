---
name: area-foundation-change
description: Adds or changes an Area setting (an axis such as radius, density, elevation, stroke or motion, or one of its values), a semantic token or role, a derivation in emit/base.ts, or a system-wide rule (shared state paint, strokes, corners, insets) and carries it through every component, the Inspector, Foundations (the Theme tab until 2026-10-28) and the docs. Use when a change affects more than one component family at once, when the user asks for a new customization option or a different default, or when a fix belongs in the tokens rather than in one component.
---

# Area foundation change

A foundation change is a change every family inherits. Done well, one edit moves the whole
library coherently. Done badly, it collides with another setting, freezes a value in some
scope, or looks right in the three components you checked and wrong in the eighty you
didn't. Read `docs/ARCHITECTURE.md` (Tokens) and `docs/THEMING.md` first.

## Decide the shape

- **Is it a setting at all?** It is one if it should change every component the same way
  and a product would want to choose it. A difference that applies to one family is a
  variant (`area-component-intake`).
- **One number or name, one effect** (owner, 2026-10-18).
  - Name it after what it measures: Radius is the medium Button's corner, Elevation the
    Menu's shadow in percent, Motion a dialog's open in ms, Density the medium Button's
    height.
  - Never bundle several settings into a named look. Never cut existing options to simplify;
    make each option's effect visible instead.
- **The default reproduces today.** Adding a setting must not move a pixel at its default.
  Check this before anything else.
- **Every value must look right everywhere.** If some combination cannot look right, cap or
  derive it (as surface corners cap at 1.5× the inset). Never offer a value that fails
  contrast.

## Where it goes

| Change | Edit |
|---|---|
| A new value on an axis | The axis file in `packages/tokens/src/axes/`; its presets must set the same keys as the others |
| A new axis | A new axis file, added to `AXES` in `axes/registry.ts`, owning a namespace no other axis claims (an exact name ends in `:`) |
| A value that depends on two settings | One `calc()` / `color-mix()` in `derivedTokens()` in `emit/base.ts`, never one axis reading another's tokens |
| A colour | `color/curves.ts` tables or `INVERSION`; Layers grounds and fills in `color/layers.ts`; semantic pairs in `semantic/aliases.ts`. Never edit `palette.json` |
| A required contrast pairing | `contrast/assertions.ts`. Never add an exception or lower a floor |
| A shadow or edge role | `axes/depth.ts` (`roleShadow`): keep eight slots at every step, transparent where unused, never `none` |
| A rule painted in CSS | The shared file (`layers.css`, `inset.css`, `material.css`, `forced-colors.css`) or each family's base rule, then extend `packages/react/tests/cohesion.test.mjs` so the rule stays enforced |

Then carry it through:

1. **The Inspector.** Add an entry in `apps/desktop/src/gallery/controls.ts`.
   - Two or three options are a Segmented; more are a Select.
   - Label the default "N (Default)" and named ends "0 (Flat)".
   - If saved values change meaning, migrate them in `restoreCanvas` (`studio.tsx`).
2. **Foundations** (Area › Foundations, the Theme tab's Browse until 2026-10-28). Add a drawing in `apps/desktop/src/abstract.tsx`: one real component
   with real text, showing only what the setting changes, at one scale for every value.
3. **React.** `Theme` picks up registry axes automatically. Anything outside the registry
   (like Pills or Material) needs its own attribute handling.
4. **Docs, in the same change.**
   - A row in `docs/THEMING.md`.
   - The rule in `docs/DESIGN_SYSTEM.md`, replacing what it supersedes.
   - `docs/CONTRAST.md` or `docs/MOTION.md` if the change touches them.
   - Each affected spec's current-state sections, if one family's documented value changes.
   - **A change of a ramp or a default sweeps the comments and docs that quote px** (system evaluation F6,
     2026-11-11): grep the CSS, token and React comments, DESIGN_SYSTEM, THEMING and the specs for the old numbers
     and rewrite each as the formula, or the value at the shipped default (type 13, density 32, Corner 10) naming
     the setting when it quotes another. `check:docs` flags a token quoted beside the wrong default number, but not a
     rendered sum or a component's own `--_*` value; those need the sweep.

## Rules that break silently

- **Re-emit derivations.** A custom property resolves where it is declared. `css.ts`
  restates each derivation in `derivedTokens()` on every element that carries a setting
  feeding one of its inputs (`emit/rederive.ts`); keep a new derivation inside that set.
  A token a stylesheet or a React inline style sets outside the axes goes in `OVERRIDABLE`
  (rederive.ts), or derivations reading it go stale below the override;
  `rederive.test.ts` fails until it is listed.
- **Never `@property`-register a derived token or a light/dark pair.** Registration
  resolves it early and freezes inheritance. Register leaf numbers only.
- **Keep namespaces disjoint.** The build's axis integrity check fails on a collision or a
  token outside the axis's namespace. Fix the design, never the check.
- **Colours stay pairs until used.** A computed custom property can hold `light-dark(…)`,
  so measure painted colours, not variables.
- **Any undefined `var(--area-*)` fails the styles build.**

## Verify across the whole library

1. `npm run build`, which runs axis integrity, manifest parity and token refs.
2. `npm test` and `node packages/tokens/src/contrast/report.ts`.
3. `node --test packages/react/tests/*.test.mjs`, the cohesion rules included.
4. **Sweep the gallery** at the default, each extreme of the new setting, and its
   combinations with the settings it interacts with (dark, contrast More, type 12 and 16,
   radius 0 and pill, Elevation 0).
   - Look at every family, not a sample.
   - In a hidden pane, read values with `transition: none`, or use headless Edge (`docs/DEVELOPMENT.md`).
   - Collisions between settings are the usual failure: a component that paints its own
     shadow over a role, or a fixed literal where a derivation was expected.
5. **Show the owner.** Use a review page with every family Before and After at the
   settings that changed. Then relaunch Electron from this worktree and leave the setting
   at its default.
