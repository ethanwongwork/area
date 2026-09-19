# Area repo map: binding the pack to the real system

Read from `github.com/ethanwongwork/area`, `main` at `7cb043d` (2026-09-18 09:39 PT,
"docs: checkpoint component audit expansion"; feature commit `00c2490` before it).
Evidence level for everything here: read from source. Token values are from a local
`npm run build -w @area/tokens` at that commit, default axes.

If this file and a family file disagree on naming or tokens, this file wins. If this file
and the repo disagree, the repo wins; update this file.

---

## 1. Where things live

| Thing | Path |
| --- | --- |
| Component CSS | `packages/styles/src/components/*.css`, all inside `@layer area.components` |
| Variant contract | `packages/styles/src/manifest.ts` (`ComponentManifest`: `block`, `variants`, `booleans`, `states`, `stateAttributes`, `elements`, `elementModifiers`, `defaults`), registered in `MANIFESTS` |
| Parity gate | `npm run lint:manifest`: a declared value with no selector fails, and a selector with no declaration fails |
| Shared optical insets | `packages/styles/src/inset.css` |
| Forced colours | `packages/styles/src/forced-colors.css` |
| React wrappers | `packages/react/src/components/` (`Button.tsx`, `Field.tsx`, `Input.tsx`, `Nav.tsx`, `forms.tsx`, `primitives.tsx`), variant helpers in `variants.ts` |
| Demos (real components, server-rendered) | `apps/docs/src/demos/` (`gallery.tsx`, `button.tsx`, `form.tsx`, `display.tsx`, `nav.tsx`) |
| Page metadata and practices | `apps/docs/src/pages.mjs`, `apps/docs/src/practices.mjs` |
| Audit reports | `docs/component-audits/<slug>.md` (exists today: atlas-review, button, checkbox, code, field, input, kbd, nav, radio, select, textarea, token) |
| Rules | `AGENTS.md`, `docs/DESIGN_SYSTEM.md`, `docs/COMPONENT_AUDIT.md`, `docs/COMPONENT_CAPABILITY_ATLAS.md`, `.agents/skills/component-audit/SKILL.md` |

Current CSS file per block:

| File | Blocks |
| --- | --- |
| `button.css` | button |
| `switch.css` | switch: native input, pill track/thumb, label/description, loading and states |
| `choice.css` | checkbox, checkbox-group, radio, radio-group, choice-label |
| `chip.css` | chip, chip-group |
| `segmented.css` | segmented |
| `slider.css` | slider |
| `display.css` | badge, avatar, separator, skeleton, spinner, progress |
| `surface.css` | alert, card, dialog, popover, menu, tooltip, toast |
| `navigation.css` | select, tabs, table, table-wrapper |
| `nav.css`, `panel.css`, `code.css`, `kbd.css`, `token.css`, `field.css`, `input.css`, `textarea.css` | as named |

`display.css`, `surface.css` and `navigation.css` are grab-bags. When a block in them
grows past a screen, move it to its own file in the same commit as the expansion (the
repo already did this for nav, panel, kbd, segmented, slider, chip).

---

## 2. Naming, as the repo does it

```
.area-badge                     block
.area-badge__dot                element        -> manifest.elements
.area-badge--soft               variant value  -> manifest.variants.variant
.area-badge--success            variant value  -> manifest.variants.tone
.area-button--icon-only         boolean        -> manifest.booleans
.area-menu__item--danger        element mod    -> manifest.elementModifiers.item
.area-button[data-loading]      runtime state  -> manifest.states
.area-textarea[aria-invalid]    native/ARIA    -> manifest.stateAttributes
```

- All values of all axes share one flat `--{value}` namespace per block. Two axes on one
  block may not share a value name. Button solves `align` with `align-start` /
  `align-end`; do the same (`label-start`, `actions-bottom`, `overlap-circular`).
- A block with a default usually still declares the default's selector (`--solid`,
  `--md`), because parity requires a selector for every declared value. Put defaults in
  `defaults`.
- Private properties are `--_name`, set by tier / tone / variant blocks and consumed only
  by the base rule. Public component tokens, when justified, are
  `--area-<component>-<role>` and live in the token package, as `--area-input-*` does.
- Logical properties only (`inline-size`, `block-size`, `padding-inline`,
  `margin-block-start`, `border-start-start-radius`).
- Full width is the boolean `--full-width` everywhere. This pack's "layout: block" means
  that.
- Pill is the boolean `--pill`. Global roundness is the `data-area-radius` axis, so do
  not add a `rounded` / `square` modifier unless the family truly needs a per-instance
  override (Avatar has `--square`).
- Density is never a component modifier. It is the `data-area-ui="default|compact"` axis
  on any ancestor. Likewise `data-area-theme`, `data-area-neutral`, `data-area-accent`,
  `data-area-contrast`, `data-area-motion`, `data-area-radius`, `data-area-surface`
  (`flat | outlined | elevated`). Before adding a Card or Panel "elevated / outlined"
  variant, check whether the surface axis already expresses it; add a component variant
  only for a per-instance difference the axis cannot give.
- Motion: use `--area-transition`, `--area-duration-*`, `--area-ease-*`. The motion axis
  handles reduced and expressive motion; do not write your own `prefers-reduced-motion`
  block unless the axis cannot reach it.

---

## 3. Token vocabulary (default axes)

**Control tiers** (these heights apply only to components whose construction entry says "control ramp"; Badge, Tag, Kbd, Avatar, Switch, Tooltip and the containers do not use them as their height):

| Tier | `--area-control-*` | `gutter` | `icon` | `gap` | `*-text` | `*-leading` | `--area-radius-control-*` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| xs | 24 | 8 | 12 | 4 | 12 | 16 | 4 |
| sm | 28 | 8 | 16 | 4 | 13 | 18 | 6 |
| md | 32 | 12 | 16 | 8 | 14 | 20 | 8 |
| lg | 40 | 12 | 16 | 8 | 14 | 20 | 10 |
| xl | 48 | 16 | 24 | 8 | 16 | 24 | 12 |

Compact (`data-area-ui="compact"`) moves md to 28 and type one stop down; never
hard-code against it. Glyph controls use the icon ramp {12, 16, 16, 16, 24}; Switch
height uses {12, 16, 20, 20, 24} with a 2px thumb inset.

**Space:** `--area-space-` 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.
**Type:** roles `--area-text-{xs..xl}-{size,leading,tracking}` (12/16, 14/20, 16/24,
18/26, 20/30), `--area-title-{xs..xl}-*` (16, 20, 24, 32, 40), `--area-display-{sm,lg}-*`,
chrome `--area-ui-size` / `--area-ui-leading`, raw `--area-size-N`, `--area-leading-N`.
Weights: `--area-weight-regular` (400) and `--area-weight-strong` (500) only. Fonts:
`--area-font-sans`, `--area-font-mono`, `--area-font-keyboard`.
**Radius:** `--area-radius-control[-tier]`, `--area-radius-container` (12),
`--area-radius-nested` (container minus 6), `--area-radius-row` (8),
`--area-radius-small` (6), `--area-radius-full`, caps `--area-radius-cap` /
`--area-radius-button-cap` (0.4 of height).
**Elevation:** `--area-shadow-1..4` (hairline-soft, tinted by `--area-shadow-color`;
`none` under the flat surface). **Z:** `--area-z-` base, raised, sticky, overlay,
dropdown, modal, popover, toast, tooltip.
**Focus:** `--area-focus-width`, `--area-focus-offset`, `--area-focus-color`; fields use
`--area-field-focus-*` halo tokens.
**Motion:** `--area-duration-` instant 0, fast 100, base 150, slow 250; `--area-ease-`
linear, out, in, in-out, spring; `--area-transition`.

**Colour, neutral surface and ink:** `--area-bg-page`, `-surface`, `-subtle`, `-code`,
`-component[-hover|-active]`, `-hover`, `-active` (alpha overlays), `-inverse`,
`-overlay`; `--area-fg-default`, `-muted`, `-placeholder`, `-disabled`, `-on-inverse`,
`-on-neutral`.
**Strokes (soft to strong):** `--area-border-decorative`, `-faint`, `-subtle`,
`--area-border`, `--area-border-hover`, `--area-stroke-control[-hover]`,
`--area-stroke-selected`. Contrast-aware edges: `--area-edge-control[-hover]`,
`--area-edge-selected`, `--area-edge-accent`, fills `--area-fill-toggle[-hover]`.
Read "Stroke hierarchy" in `DESIGN_SYSTEM.md` before picking one.
**Per tone** T in accent, info, success, warning, caution, danger, discovery:
`--area-T-solid[-hover]`, `--area-T-surface[-hover|-active]`,
`--area-T-border-subtle`, `--area-T-border`, `--area-T-border-strong`, `--area-fg-T`,
`--area-fg-T-vivid`, `--area-fg-T-strong`, `--area-fg-on-T`. Neutral has
`--area-neutral-solid[-hover]` and uses the neutral surface / ink tokens for the rest.

### Pack px to Area token

| Pack says | Use |
| --- | --- |
| control / row height 24, 28, 32, 40, 48 (control-ramp components only) | `--area-control-xs..xl` via `--_height` |
| label heights 16, 20, 24 (Badge, Tag, Counter, Kbd) | `--area-space-16`, `--area-space-20`, `--area-space-24` via `--_height`, or a dedicated component scale in the token package as Badge now has |
| heights between tiers (22, 26, 36, 44) | nearest tier; do not add tiers |
| icon 12 / 16 / 24 | `--area-icon-*` for the tier; 20 is not on the ramp, use the tier icon |
| padding or gap 2, 4, 6, 8, 10, 12, 16, 20, 24, 32 | `--area-space-N`; inside a control prefer `--_gutter` / `--_gap` |
| 3, 5, 14, 18 px spacing | not on the ramp: nearest `--area-space-*`, or `calc()` from two ramp values |
| container padding 16 / 24 | `--area-space-16` / `--area-space-24` |
| radius 4 to 12 on a control | `--area-radius-control-<tier>` with the height cap |
| radius on cards, dialogs, popovers, menus | `--area-radius-container`; children `--area-radius-nested`; menu / list rows `--area-radius-row` |
| pill / circle | `--area-radius-full` |
| 1px hairline | `--area-border-width` (`--area-stroke-width` for drawn marks) |
| focus ring 2px offset 2px | `--area-focus-width` / `--area-focus-offset` / `--area-focus-color` |
| shadow "step 1..4", menu / popover shadow, dialog shadow | `--area-shadow-1..4`. Today in the repo: card and controls 1, tooltip and panel 2, menu and toast 3, dialog 4. Keep that ladder; new popover, hover card and drawer follow menu (3) and dialog (4) |
| 100 to 150 ms hover, 200 to 250 ms enter | `--area-duration-fast` / `-base` / `-slow` with `--area-ease-out` |
| widths such as dialog 320 to 640, tooltip max 240, toast 360, drawer 320 to 480 | no token today. Add named component tokens in the token package (pattern: `--area-input-inline-size: 16rem`), one per named width, not raw numbers |
| scrim | `--area-bg-overlay` |
| text 11 / 12 / 13 / 14 / 16 | a type role, or the tier's `--_text`; never a raw size |
| font weight 500 / 600 | `--area-weight-strong` (there is no 600) |
| "muted text", "danger text", "success icon" | `--area-fg-muted`, `--area-fg-danger`, `--area-fg-success-vivid` (vivid for icons and validation, plain for body text on tone surfaces, strong for titles) |

---

## 4. Canonical axis values in Area today

- `variant`: Button has `solid | soft | outline | ghost`. `plain` (link-like) does not
  exist yet; where a family file lists it, add it to that block and to Button in the
  same batch so the word means one thing.
- `tone`: eight, in manifest order: `neutral, accent, info, success, warning, caution,
  danger, discovery`. Badge has five today, Alert and Toast four. Every tone-bearing
  block should reach all eight; the tokens already exist for all of them.
- `size`: `xs | sm | md | lg | xl`. Exceptions in the repo: Button and Textarea and
  Spinner expose `sm | md | lg`; Panel `xs..lg`; Kbd `small | normal`. When this pack
  lists a numeric size (Avatar 16 to 96, Spinner 12 to 48), map onto the five tiers
  first and add named extras only where the tier ramp cannot reach (Avatar `2xl`, `3xl`).
- `appearance` is used by Kbd (`default | quiet | on-color`) and `ground` by Code /
  Token (`on-color | subtle`). Reuse those words for the same ideas; do not introduce a
  third synonym.

---

## 5. Manifest today versus this pack

"Today" is the manifest at `7cb043d`. "Add" is the headline; the family file has the
full build list. Blocks marked **new** have no manifest entry yet.

| Block | Today | Add (see file) |
| --- | --- | --- |
| switch | sm/md/lg glyph tiers; always-pill accent track; label end/start; description; full-width; native checked/disabled/read-only/loading states | Owner-corrected 2026-09-18; removed benchmark-only variants and recorded them as Log only in component-audits/switch.md |
| slider | size xs..xl; disabled; elements control, value | range and multi-thumb, from-origin, marks and labels, value bubble, paired input, min / max labels, vertical, tones (01) |
| segmented | size xs..xl; full-width; selected, disabled; item, icon, label | variants soft / outline / ghost / solid-selected / line; pill; icon-only, count, dot; vertical; multiple selection; sliding thumb (01) |
| chip, chip-group | size xs..xl; pill, swatch-only; selected, disabled | kinds action / filter / input (removable) / menu / link; variants and tones; avatar and image media; count; invalid; group overflow "+N" and scroll (01) |
| toggle-button, toggle-group, rating | **new** | 01. Note Button already has `selected`; toggle-button may be Button plus `aria-pressed` and a group block, decide in the audit |
| tabs | no variants; selected, disabled; list, tab, panel, label | variants line / soft / segmented / solid / contained / boxed / plain; sizes; vertical; full-width, centered, flush; overflow scroll / menu; icon, count, dot, close button, add tab (02) |
| menu | layout inline; selection marker; item--danger; item, icon, text, label, separator, shortcut | checkbox / radio / switch items, submenu, group headings (subtle, filled), description inline / block, leading avatar / swatch, trailing value, inset, header search, footer, empty and loading, context menu, menubar, item size lg (02) |
| breadcrumbs, pagination, stepper, tree, command | **new** | 02 |
| badge | rebuilt 2026-09-18 (owner-corrected): soft / solid / outline / ghost / plain; ten tones; sm 20, md 24, lg 32; always pill; BadgeAnchor and BadgeGroup companions | done; it is the worked example for the construction step |
| counter-badge, status-dot, tag, persona | **new** | 03. Check Tag against Chip and the deprecated Token alias before adding a block |
| kbd, kbd-group | size small / normal; appearance default / quiet / on-color; key | audited 2026-09-18; only gap-check the 03 list (sequence separators, platform glyph map, in-menu and in-tooltip use) |
| avatar | size xs..xl; shape square; image | initials and icon fallback, deterministic colour, status badge, ring / active states, interactive (button, link), larger sizes, image load fallback; **avatar-group new**: stack with cut-out, spread, "+N", max (03) |
| alert | four tones; icon, content, title, description | variants soft / outline / solid; all tones plus neutral; sizes; actions inline / bottom, dismiss, link; banner (full-bleed) and inline-message forms; live-region roles (04) |
| toast | four tones; icon | title + description, action, dismiss, loading and promise forms, progress timer, stacking and expand, six positions, swipe, region landmark (04) |
| tooltip | none | placements and arrow, rich (title + body), with shortcut (Kbd `on-color`), inverse and surface appearances, delay groups, max width; toggletip separate (04) |
| progress | indeterminate; bar | sizes, tones, label and value text, segmented, stacked, buffer; **circle, gauge, meter new** (04) |
| spinner | size sm / md / lg | xs and xl, tones / on-color, label positions, overlay use; **loading-dots, shimmer-text new** (04) |
| skeleton | shape text / circle | rect and control-height shapes, multi-line text with short last line, animation pulse / wave / none, composed presets (row, card, table) (04) |
| empty-state, error-state | **new** | 04 |
| dialog | header, title, description, body, footer | widths, scroll inside vs page, sticky header / footer with scroll shadows, full-screen and sheet on narrow, footer layouts, close button, non-modal; **alert-dialog new** (05) |
| popover | none | arrow, placements, sizes / padding, header and close, inverse; **hover-card, teaching-popover, drawer new** (05) |
| card | no variants; title, description, footer, media, action, media-cluster, media-tile, media-caption, steps, step | header with leading visual and action slot, sizes / padding, interactive (link, button) and selectable (checkbox, radio) cards, horizontal orientation, media bleed; check elevated / outlined against the surface axis first (05) |
| panel | size xs..lg; flush, bare-bar; bar, title, body, section, heading, stack, footer | collapsible sections, resizable, header actions, tabs in bar (05) |
| separator | orientation horizontal / vertical | with label (start / center / end), inset, emphasis steps (decorative / faint / subtle tokens), spacing options, dashed (05) |
| accordion | **new** | 05 |
| table, table-wrapper | variant interactive; cell--numeric, cell--fit | sizes / density, striped, bordered / contained, sticky header and first column, sortable headers, row selection, expandable rows, row actions, empty / loading / error bodies, footer with pagination, column alignment, truncation (06) |
| code-block | layout flush / wrap; collapsed; actions, body, pre, toggle | filename header and language label, tabs, line numbers, highlighted / added / removed lines, copy state, max-height scroll; **snippet new** (06) |
| list / item, description-list, stat, timeline | **new** | 06 |
| button, checkbox(+group), radio(+group), field, input, textarea, select, code, token, nav | audited | `07-completed-family-gap-check.md` only |

---

## 6. Demo and docs rules that change how you use the family files

- A family file's "Demos" list becomes exported components in `apps/docs/src/demos/`
  (`Gallery<Block><Case>` naming, as `GalleryButtonAccentSoft`, `GalleryCheckboxCard`).
  Snippets are the demo's own source; never hand-write one.
- Preview order per `COMPONENT_AUDIT.md`: default, persistent treatments, size family
  stacked with `--area-space-24`, then states, then the full variant x tone matrix the
  brief requires (Button already does all 32 cells this way).
- No inline style with a literal beyond a demo's framing width; no docs CSS against
  `.area-*`. If a demo needs a wrapper layout the system lacks, that is a finding: add
  the modifier to the component.
- Add each new block to `MANIFESTS`, to the React barrel in `packages/react/src/index.ts`,
  and to the gallery import list, in the same commit.
