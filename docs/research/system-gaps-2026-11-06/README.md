# System gaps, 2026-11-06

Owner, after the title balance pass: "anything else need to be updated? any components that need to be cleaned up or
unified? what are the real gaps/areas of improvement for areas design system overall, compared to top design systems and
components. this includes design language, documentation, skills, motion, etc."

Four read-only sweeps: Area's components (source, regex counts), Area's foundations and process (docs, skills, motion,
tokens, tests, release), ten published design systems (official docs and token sources), and the installed apps'
bundles (CSS and JS read inside the .app; nothing launched, no user data read). The review page with the proposals and
the owner's picks: Area System Gaps artifact (picks in its `verdicts` collection).

## Built from the picks (2026-11-07)

The owner picked Build on L1–L3 and C1–C9 on the review page, then said "Take all recs" for the rest (picks in the
artifact's `verdicts`; Later items stay later; C10, M1, V1, V2 are still theirs to decide).

| Pick | Built | Where |
|---|---|---|
| L1 | Panel md's bar title 13/18 500 (was text-lg 15/22) | panel.css, panel.md |
| L2 | Checked, no change: Accordion's title and content share one size (md over reading text, sm over UI) | accordion.md, usage |
| L3 | `ui-gap-step`: the density curve in whole steps for the 2px gap ladder (ui-stack, ui-cluster, gap-sm/md/xl), so gaps are 2·4·6·8·10; insets keep halves. Type 13 Default: 8 / 6 (was 7 / 5); Compact unchanged | emit/base.ts, THEMING.md, cohesion test |
| C1 | Status words pending · current · complete · error; Plan `done`, Step `done`/`failed`, Stepper `upcoming`/`invalid`, Queue `failed` are deprecated aliases | GOVERNANCE.md "Status words", four specs |
| C2 | Not built: one frame recipe for Card, Surface, Asset card, Design card (L, its own session) | — |
| C3 | Deprecated stage (`DEPRECATED_COMPONENTS` with a replacement); Preview frame and Token out of the gallery, search, Home and batches; an old link opens the replacement | component-status.mjs, components.tsx, GOVERNANCE.md |
| C4 | `onDismiss` / `dismissLabel` on Tag and File upload item; every close part is `__dismiss` (Chip, Tag, Attachment, Dialog, Drawer); `icon` again on Input and Search field | specs, DESIGN_SYSTEM.md |
| C5 | Tag `color` with Board column's ten hues (`tone` deprecated); `fg-<tone>-mark` read by Alert and Toast. Badge keeps its per-ground marks | tag.css, base.ts, GOVERNANCE.md |
| C6 | 18 hand-written density formulas read `gap-row`, `ui-cluster`, `ui-stack`, `inset-surface-sm/md`; 4 corners read `radius-control-*`; a cohesion test forbids copies | 13 component files |
| C7 | `--area-overlay-scale` (0.97 in five places); Dialog and Command palette share one motion rule; Dialog and Drawer one title group | surface.css, command-palette.css, drawer.css |
| C8 | Tag sizes md 20 / lg 24 (Badge's names; were sm / md); Checkbox and Radio's md / lg listed. Not done: Design card's `wide` (16:9) vs Asset card's (2:1): `screen` collides with Design card's screen layout class, so they meet when Asset card retires | GOVERNANCE.md |
| C9 | Not built: waits for C2 | — |
| M2 | The reduced-motion contract: nothing moves, fades stay (`fade-*`: 100 / 160ms), loops stop; 34 opacity transitions read `fade-*`; top-layer holds read the fade | emit/css.ts, MOTION.md, cohesion test |
| M3 | Motion roles (hover, state change, enter, exit, move) in MOTION.md; "transform and opacity only" corrected; a test that an exit is never slower than its enter. Composite role tokens not added (no consumer yet) | MOTION.md |
| D1, D2 | Not built (L and M, their own session) | — |
| D3 | `docs/WRITING.md`; read by area-ui-compose, area-ui-review, area-component-docs and AGENTS.md | — |
| Q1–Q3 | Not built (DOM, screenshot and accessibility runs, their own session) | — |
| Q4 | `test:desktop` in CI (its stale Tile test fixed); `test:contracts` no longer runs the archived docs test | ci.yml, package.json, DEVELOPMENT.md |
| T4 | `@area/tokens/color` export (`./colours` deprecated). The Colors settings' attributes stay British until a foundation pass migrates saved themes | tokens package.json, GOVERNANCE.md |
| T5 | The show/hide booleans listed as deviations with reasons | GOVERNANCE.md |
| S1 | `area-a11y-audit` skill | .claude/skills |
| S3 | Handoff Current state trimmed | .Codex/HANDOFF.md |

## Fixed during the sweep (no decision needed)

- The type skill's rhythm table, PRODUCT_UI rule 5 and its Empty state passage still said a title joins its copy; the
  Drawer, Confirm dialog and Empty state specs' current tables still listed a 16/24 title.
- COMPONENTS.md and ARCHITECTURE.md said 116 families (119 plus the icon pilot page).
- area-interaction-pass listed History and Inspiration (now Versions and References) and missed Foundations and Projects.
- THEMING.md listed `ease-in` as unused (the lift leaves on it); MOTION.md's loop list missed Step's 2s shimmer.

## Area's components (counts from source)

| Finding | Evidence |
|---|---|
| Status words drift: "finished" is done / complete; "failed" is failed / error / invalid | Plan, Stepper, Step, Queue, Attachment, File upload item, Edit summary, Turn notice |
| Card geometry restated: corner, density ladder, edge, lift and selected ring | surface.css 34–150 vs 1779–1827; asset-card.css 65, 281, 569, 626; design-card.css 25–117; selected-ring recipe ×7 in 4 files |
| Deprecated families still live | Preview frame: Complete in component-status.mjs:118, 7 tiles, a page; Token: token.css, no app use; no Deprecated status |
| Dismiss API split | Tag `onRemove`/`removeLabel` (Chip deprecates the same names); File upload item `onRemove`; parts `__close` (Dialog, Drawer) vs `__dismiss` (Alert, Toast) |
| Two colour vocabularies on one set of tokens | Tag `tone=info/success/…`, Board column `color=blue/green/…`, Link and Citation `ink`; status icon inks hard-coded in Alert, Toast (duplicated) and Badge |
| Derivations re-inlined | corner-from-height ×41 in 29 files; `x − y·ui-dense` ×72, 32 equal to existing tokens (`ui-cluster`, `gap-row`, `inset-surface-md`) |
| Modal parts copied | Command palette's enter/exit = Dialog's; Drawer's header = Dialog's; overlay scale 0.97 literal in 4 places |
| Size names | Tag `sm` = Badge `md` in height; Asset card `wide` 2:1, Design card `wide` 16:9 |
| "Draws its own frame" spelled 5 ways | `variant=surface/plain`, `variant=card/soft`, `container=framed/…`, boolean `framed`, `variant=surface/soft/plain` |
| Overlay hooks uneven | width hooks on Popover, Toast, Menu; none on Dialog, Confirm dialog (420), Command palette (600), Drawer (384) |
| Already unified | every list row renders `.area-menu__item` on `--area-ui-row`; no orphan CSS |

Text pairs left: Panel md's bar title and Accordion md's title are `text-lg` (15/22), the reading step.

## Area's foundations and process

| Area | Has | Gap |
|---|---|---|
| Documentation | 127 specs; 119 usage entries (check-docs 0 errors) | the entry schema holds only instead, practices, parts, states, keyboard, aria: no content, responsive, RTL or code; 72 entries list no states (Dialog, Popover, Toast, Drawer have no open or closing state); Section heading and Titlebar have no spec of their own |
| Skills | 12 with clear lanes | no accessibility, motion, content or release skill; copy rules split across three skills |
| Motion | one number (210), thirds, Easing and Feedback axes, central reduced motion, no literals (tested) | the reduced-motion question is open (MOTION.md 145); MOTION.md says transform and opacity only while recipes animate size; no runtime check |
| Tokens | ~27 axes, derivations in emit/base.ts, forced colours in 33 files | axes.css 1.6 MB, area.css 3.2 MB (489 KB gz), no per-component CSS; no DTCG or design-tool export; public API mixes `colours` and `color` |
| Accessibility | contrast gate with colour-vision simulation, focus tokens, forced colours, logical properties | no axe, no screen-reader pass, no `prefers-contrast`, no target-size rule; RTL and forced colours never checked in a browser |
| Testing | 125 React suites (renderToString), cohesion and contract tests in CI | no DOM: open, close, Escape, arrows, roving focus and focus traps are untested; no screenshot baseline; `test:desktop` not in CI; `test:contracts` runs an archived docs test |
| Release | `@area/icons` 0.1.0 with changelog and licence | react, styles, tokens at 0.0.0, no licence, changelog or release flow; English labels hard-coded (~41 `*Label` props) |
| Content | placeholder vocabulary, app copy rules | no consumer guidance on verbs, errors, destructive confirms, empty states, truncation |
| Governance | — | `showCloseButton`, `showZero`, `showOutsideDays`, `hideLabel` break the no `show*`/`hide*` rule and are not listed as deviations |

## Published design systems

| | Motion tokens | Component page | Lifecycle | Other |
|---|---|---|---|---|
| Material 3 | durations short1–extraLong4 (50–1000); standard (0.2,0,0,1), emphasized decelerate (0.05,0.7,0.1,1), accelerate (0.3,0,0.8,0.15); springs, standard and expressive | overview, specs, guidelines, accessibility | — | — |
| Fluent 2 | 50–500 ms named; decelerate / accelerate / easy-ease families | types, behaviour, layout, accessibility, content | — | Copilot UI guidance |
| Carbon | productive vs expressive, each with standard / entrance / exit curves; 70–700 ms with uses | guidelines, specs, code, accessibility | Stable + last updated | Carbon for AI (AI label, explainability) |
| Primer | DTCG tokens; composite transitions hover, stateChange, enter (300 easeOut), exit (200 easeIn) | props, related, per-platform status | alpha → stable | MCP server, token lint |
| Atlassian | early-access composites (`motion.popup.enter`); exits faster than entrances; reduced motion = instant | — | — | Rovo AI patterns |
| Polaris (legacy tokens) | 0–500 in 50s; keyframe tokens | — | — | — |
| Spectrum 2 | ease-in / out / in-out; duration scale | live playground, props from source | Beta / Coming soon | — |
| Apple HIG | none numeric; brief, optional, cancellable, never the only signal | — | — | — |
| Geist, Radix, shadcn | none | — | — | Geist serves every page as Markdown |

The page template the strongest docs share: header (status, updated, package), playground, when to use and when not,
anatomy, specs per size and density, states, behaviour (overflow, responsive, motion), content guidance, do and don't,
accessibility (roles, keyboard, focus, announcements, RTL), code with props from types, related, changelog.

What mature systems have that young ones lack: lifecycle per component with dates; composite motion tokens by intent;
enter/exit pairs with the exit faster; a written reduced-motion contract; a DTCG token source; token lint and codemods;
props tables from source and a playground; content guidance per component; a patterns layer; an AI layer; data-vis
foundations; i18n, RTL and voice guidance.

## Installed apps (bundles)

| | Durations | Curves | Overlays | Press |
|---|---|---|---|---|
| Cursor | 100 ×66, 150 ×28, 200 ×20; tokens 50/100/150/200/300 | out-quint (.16,1,.3,1), out-cubic, in-out-strong | modal scale .97 → 1, 200 enter / 150 exit | — |
| ChatGPT (Electron) | 150 default | enter (.19,1,.22,1), exit (.8,0,.4,1); `linear()` spring | menu scale .95, 150 enter / 100 exit; popover 350 / 200; modal 600 / 300 | menu row plate presses to .98 |
| Claude | 60 / 120 / 200 / 300 / 450 | ease-out (.165,.84,.44,1), snap (.32,.72,0,1); `linear()` button spring | tooltip scale .98 120; dialog .98 200 (`@starting-style`) | button .975 in 60, spring release 450 |
| Figma shell | 100 / 200 / 400 | (.645,.045,.355,1) | tab enter 24px rise | — |

Area: the menu opens in 210 (`duration-base`), leaves in 140 (`fast`); the scale is 0.97; Button press uses the Feedback
give. Area's menu is slower than every product's (150–200).

Type: Claude's compact ramp 11/17, 12/15, 13/19, prose 14/20, title 20/25 with a density and a 1–5 step that rescale
it together (Area's type × density); Cursor 11/14, 12/16, 13/18, 14/22; variable weights between the stops (Claude 435
control, 520/580 headers; ChatGPT 430 tooltips, 510, 590). Corners: menu item = menu corner − gutter (ChatGPT), card =
control + 4 (Claude). Menus: a 0.5px ring with lift, 90% surface and 16px blur (ChatGPT). Focus: Claude draws a glow
(1px accent + 6px at 60%), ChatGPT a 2px ring at 2px offset.
