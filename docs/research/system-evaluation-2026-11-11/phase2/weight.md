# Phase 2 · weight (plan A9.6, Regular weight setting)

Owner, 2026-11-13: "Build the setting as a trial: a Regular weight setting, 400 by default, to compare 430 to 450 on screens."

## Done
- Axis `regular-weight` (packages/tokens/src/axes/regular-weight.ts, test beside it): 400 to 470 in steps of 10,
  default 400, writes only `--area-weight-regular` (`var(--area-wght-400)` at 400, exactly what the type axis wrote;
  `var(--area-wght-450)` at 450; the number elsewhere). One value for both modes.
- Type axis no longer writes `weight-regular`; its namespaces narrowed to `weight-strong`, `weight-heading`, `weight-icon`.
- Registry: AXES, SETTING_GROUPS Size = type, regular-weight, density; registry test list.
- base.css: body `font-weight: var(--area-weight-regular)`; `:where([data-area-regular-weight]:not(:root))` restates it
  (font-weight inherits as a number).
- Inspector bar (controls.ts), INSPECTOR_AXES (canvas-settings.tsx), canvasAttributes (studio.tsx), Foundations drawing
  (abstract.tsx), setting preview tiles, choice glyph, Typography page shows the setting's value.
- packages/output agents.ts names the setting; docs/THEMING.md row; token usage text (emit/usage.ts).
- Lint: packages/react/tests/regular-weight.test.mjs (no 400 / normal / wght-400 in component CSS, React, app sources or
  app CSS outside @font-face; body and scope read the role).

## Values
- Range 400..470 step 10. Geist (UI face) and Geist Mono are variable, wght 100..900, so every step draws as itself.
- Static faces: CSS font matching draws a 500 file for 401..499 when one exists; a static face must declare its regular
  file as `font-weight: 400 470` (proposal for apps/desktop/scripts/typefaces.mjs; not built).

- layers.css: `[data-area-regular-weight]` added to the seven ground `@scope` setting lists (cohesion: a setting scope
  inside a ground keeps the ground's fills).

## Verified (2026-11-13, rendered captures of 32 text-heavy families, 400 against 450, type 12, 13 and 16, light and dark)
- Misses: 0. Every regular text run computed 450; strong stayed 500 (834 to 894 runs), heading 600 (12), two 700s.
- Line counts: no change. Control and row heights: no change. Single-line advance at 450: median +1.0%, max +2.1%.
- One knock-on: Card tiles whose width follows their text grow their aspect-ratio media, so the card is 0.6 to 1.1 px
  taller (tile 1 px) at 450. Not a control or row height.
- 400 reproduces today by construction: the default token is the same `var(--area-wght-400)`, body's 400 equals the UA
  normal, the scope restates 400 under a 400 parent. Full check:rendered at defaults left to the conductor's wave run.

## Left
- Static-face declaration in the typeface generator (proposal above); dark weight compensation (not built).
