# Handoff — 2026-09-18

**Branch** `main` · **Last implementation commit** `00c2490 feat: expand component audits and visual gallery`
**State** Green — implementation is committed and fully verified; only this handoff/journal checkpoint remains to commit and push.

## Where things stand

Area is an eight-axis design system with framework-free CSS, thin React components, and a
static documentation site. The component-audit workflow now starts from the repository-wide
capability atlas and requires broad system/product evidence, aliases, candidate dispositions,
gallery coverage, and visual QA. Field, Input, Textarea, Select, Checkbox, Radio, Button,
Kbd, Code, Token, and Nav have complete audit records.

## What happened this session

- Added the component capability atlas and reframed the component-audit skill around
  breadth-first capability discovery before consistency refinement.
- Rebuilt the full-screen gallery around one labeled specimen per equal-size tile, full-width
  responsive sections, audited families only, and separate size/state/variant specimens.
- Expanded Checkbox with groups, descriptions, leading visuals, card composition, invalid,
  success, disabled-selected, and disabled-indeterminate coverage; aligned multiline labels,
  strengthened group hierarchy, and retained native interaction semantics.
- Added native RadioGroup with fieldset/legend, controlled and uncontrolled values,
  vertical/horizontal layout, descriptions, errors, disabled propagation, and complete audit.
- Consolidated documentation inline references on the real Code component and removed its
  table/prose drop shadow; the dogfood audit rejects the retired docs-only inline style.
- Completed the Kbd audit: normal/small, default/quiet/on-color, one chord per Kbd, real
  KbdGroup sequences, Button/Menu context treatments, and explicit extension backlog.
- Fixed Button shortcut geometry structurally. A 32px Button uses a 20px small Kbd and leaves
  6px from keycap edge to Button edge on top, right, and bottom. Neutral solid uses a
  contrasting translucent plate; colored solids use the inverse plate; neither has a nested
  outline or shadow.

## In flight

Nothing. The implementation commit is complete and the verification suite is green.

## Next

1. Continue the atlas-first queue with Switch, then Slider.
2. Audit Menu before expanding shortcut sequences into command/menu behavior.
3. Treat Kbd platform-aware `Mod`, full-text format, localization, and user remapping as
   extensions or product command-layer work, not visual variants.
4. Keep choice cards as a composition contract unless a later audit proves a reusable
   standalone family.

## Traps

- Build React before docs typecheck because docs resolve generated React declarations.
- Gallery tiles contain exactly one named specimen; size, state, tone, and variant examples
  remain separate instead of being combined into a matrix inside one tile.
- Supporting copy uses at least small UI text. `text-xs` is reserved for compact chrome such
  as Badge, Kbd, and Tooltip, not explanatory captions or validation.
- Kbd is display-only. Register behavior separately and put `aria-keyshortcuts` on the
  associated action. Use `size="small"` inside controls.
- The deprecated Kbd `quiet` boolean remains compatible, but new code uses
  `appearance="quiet"`. One Kbd is one simultaneous chord; KbdGroup is a sequence.
- Preserve the shared optical-inset formula; do not fix nested controls with glyph nudges or
  arbitrary right padding.
- Do not commit `dist/`, caches, or `node_modules/`.

## Verify

- `npm run lint:manifest`: passed; manifest parity covers **38 components**.
- `npm run typecheck`: passed across tokens, styles, React, and docs.
- `npm run build:docs`: passed; **46 pages / 270 demos**, dogfood **38/38**.
- `npm run audit`: passed with no raw docs values or unapproved inline literal styles.
- `npm run test:consumer`: passed packaging, NodeNext, SSR, browser bundle, and tree-shaking.
- `node --test apps/docs/scripts/axis-preferences.test.mjs`: **5/5 passed**.
- `npm test`: **18,104 tests / 9 files passed**.
- `node packages/tokens/src/contrast/report.ts`: **344 passing / 0 failing** across **66 themes**.
- `git diff --check`: passed.
- Live Chromium at 100% CSS zoom verified the Kbd gallery and exact Button/Kbd geometry.
