# Area expansion pack: Codex build brief

Version 3, 2026-09-18. Read `00-START-HERE.md` and `WORKFLOW.md` for the process;
this file is the rule book. Construction and a proposed build plan can be reviewed in
one approval packet. No component implementation starts before that approval.

Benchmark numbers come from evidence; deliberate Area choices are explicitly proposed
in construction decisions and their linked completion tables, then owner-approved.
An upstream n/p value does not authorize guessing a benchmark fact, and need not prevent
an explicitly labeled Area design decision. Family prose and skeletons remain illustrative.

The pack has three layers and they have different authority:

1. `evidence/` is machine-extracted from pinned source with tokens resolved to px. It is
   the only source of numbers.
2. `construction/` turns evidence into a measured table, a consensus and an **Area
   decision** per component. It is the only source of sizes, padding, gaps, type, radius
   and shape. Entries are marked complete or seed; a seed or missing entry must be
   finished and approved before any code.
3. The family files `01` to `06` are candidate inventories: variants, anatomy,
   behaviour, ARIA, demos, pitfalls. Normalize and decide every row before building.
   They carry no authority on geometry.

Version 1 told you not to re-research and mixed recalled numbers into the family files.
That is withdrawn. If a number is not in `evidence/`, it is not a fact.

| File | Families |
| --- | --- |
| `01-selection-controls.md` | Switch, Slider, Segmented, Toggle button / Toggle group, Chip, Rating |
| `02-navigation.md` | Tabs, Menu (dropdown, context, menubar), Breadcrumbs, Pagination, Stepper, Tree, Command menu |
| `03-labels-identity.md` | Badge, Counter badge, Status dot, Tag, Kbd, Avatar, Avatar group, Persona / Entity |
| `04-feedback.md` | Alert, Banner, Inline message, Toast, Tooltip, Progress (bar, circle, segmented), Spinner, Loading dots, Shimmer text, Skeleton, Empty state, Error state |
| `05-overlays-surfaces.md` | Dialog, Alert dialog, Drawer / Sheet, Popover, Hover card, Teaching popover, Card, Panel, Separator, Accordion |
| `06-data-code.md` | Table, Data table features, Code block, Snippet, List / Item, Description list, Stat, Timeline |
| `07-completed-family-gap-check.md` | Field, Input, Textarea, Select, Radio, Token, Code, Nav: variants to confirm exist |
| `09-area-repo-map.md` | Read second. Area's real naming, token vocabulary, px to token table, and what each manifest block has today versus what this pack adds |
| `construction/*.md` | Measured geometry, consensus and Area decisions, one file per family, plus `TEMPLATE.md` |
| `evidence/` | Extracted source per system (`INDEX.md`, `PINS.md`); regenerate with `tools/audit-evidence/` |
| `08-evidence-ledger.md` | What was read, at which commit, and what is recalled and needs re-verification |

---

## 1. Capability inventory and Area-fit gate

Breadth belongs in research, not automatically in the public API. Record every documented
candidate, normalize names that describe the same job, then decide it against benchmark
overlap and Area's existing tokens, components, and semantic model.

- **Core:** at least three independent reusable systems, a platform/accessibility
  requirement, or an established Area job. Build it.
- **Extended:** at least two reusable systems plus a concrete Area use case that does not
  duplicate another component or add an unrelated axis. Build after owner approval.
- **Composition:** useful in context, assembled from existing Area components. Document
  and demonstrate only when it teaches real use.
- **Separate:** a different semantic or behavior contract. Record it in that component's
  queue rather than overloading this one.
- **Alias:** the same pattern under another name. Record Area's canonical name once.
- **Log only:** credible evidence with insufficient overlap or Area fit. Preserve it in
  the audit so later work can revisit it without shipping it now.
- **Reject:** conflicts with accessibility or the component's stated job.

A product screenshot can establish a use case, but not a reusable API. A feature unique to
one system is logged rather than built by default. A tone matrix is appropriate only when
tone changes the component's meaning; global theme and stress cases belong in the gallery
customizer or verification fixture when they do not teach a distinct public option.

What does not change: one family per batch, CSS + manifest + React + docs parity, token
ownership rules, geometry measurement at every size and both densities, and the
separation of variant / tone / size / state / layout / composition / behaviour.

---

## 2. Naming and tokens: bound to the Area repo

This pack was first written without repo access. It has since been checked against
`ethanwongwork/area` at commit `7cb043d` (2026-09-18). `09-area-repo-map.md` is the
binding layer: real token vocabulary, px to token table, and the per-component delta
between today's manifest and this pack. Read it before any family file. Rules:

1. **Design-time variants are BEM modifier classes, not attributes.** `area-badge--soft`,
   `area-badge--success`, `area-button--icon-only`. One flat `--{value}` namespace per
   block, exactly as `manifest.ts` declares it (`variants`, `booleans`, `elements`,
   `elementModifiers`). Markup in this pack already follows this.
2. **Runtime state is a `data-*` attribute or the native / ARIA attribute**
   (`data-selected`, `data-loading`, `:disabled`, `aria-invalid`). Declare it under
   `states` / `stateAttributes`.
3. **Follow `packages/styles/src/components/button.css`.** Tier block sets `--_height`,
   `--_gutter`, `--_icon`, `--_gap`, `--_text`, `--_leading`, `--_radius` from tier tokens
   and nothing else. Tone blocks repoint the nine tone slots (`--_solid`, `--_solid-hover`,
   `--_surface`, `--_surface-hover`, `--_surface-active`, `--_line`, `--_line-hover`,
   `--_tone-fg`, `--_on-solid`). Variant blocks resolve slots into the skin (`--_bg`,
   `--_bg-hover`, `--_bg-active`, `--_fg`, `--_border`, `--_border-hover`, `--_shadow`).
   Only the base rule consumes them. Foreground never changes on hover.
4. **Every pixel value in this pack is a reference measurement, never CSS to paste.**
   A literal length in component CSS is a bug in Area (hairline `1px` and mask geometry
   excepted) and `check-dogfood.mjs` fails on it in docs. Use the px to token table in
   file 09. If nothing fits, derive with `calc()` from ramp values or change the ramp in
   `packages/tokens/src/axes/`; do not register derived tokens with `@property`.
5. **Size ramp and shape are decided per component, from measured evidence.** The v1
   rule here ("a size tier is the control's outer height") was wrong for anything that
   is not a control and produced a 32px, control-cornered Badge. The construction file
   for the family names the component's **size class** and **shape rule** and gives the
   Area sizes with tokens. Only Button, Input, Select, Textarea, Segmented, Chip, Menu
   rows and Tab rows are on the control ramp (xs 24, sm 28, md 32, lg 40, xl 48).
   Checkbox, Radio and the Switch track are on the glyph ramp. Badge, Tag, Counter and
   Kbd are on a label ramp (16 to 24, 32 only as a deliberate large). Avatar has its own
   identity ramp. Tooltip, Separator and Progress are fixed constructions. Dialog,
   Popover, Card and Alert are containers sized by padding and named widths. If a
   component has no construction entry, you do not know its sizes yet: run the
   construction step in `00-START-HERE.md` and wait for approval.
6. **Same commit:** CSS in `packages/styles/src/components/`, manifest entry, React
   wrapper in `packages/react/src/components/`, real demos in `apps/docs/src/demos/`
   (gallery plus page), page metadata in `apps/docs/src/pages.mjs`, audit report in
   `docs/component-audits/<slug>.md`. Docs CSS must never target an `.area-*` class; if
   a demo needs a layout, it becomes a documented modifier on the component.
7. **Gates:** `npm run build`, `npm run lint:manifest`, `npm test`, `npm run typecheck`,
   `npm run build:docs`. Tone work must pass the contrast suite; never weaken a threshold.

---

## 3. The seven axes, with canonical Area values

Keep these as separate props / attributes. Never fold two into one `variant` string.

| Axis | Canonical values (superset; a family uses the subset its file lists) | Alias map |
| --- | --- | --- |
| `variant` (persistent surface treatment) | `solid`, `soft`, `outline`, `ghost`, `plain` | solid = filled / primary / default(shadcn) / emphasis. soft = tint / subtle / secondary(shadcn) / muted. outline = bordered. ghost = transparent / invisible / subtle(Fluent button). plain = link / text |
| `tone` (semantic colour) | `neutral`, `accent`, `info`, `success`, `warning`, `caution`, `danger`, `discovery` (the eight Button tones; order as in `manifest.ts`) | info = informative / blue. danger = critical / error / destructive / important. warning (orange) = attention / severe. caution (yellow) = the milder warning most systems fold into `warning`; where a source has one warning tone, build both Area tones. discovery = done / purple / violet / upsell / sponsors |
| `size` | named tiers whose pixel values come from the component's construction entry, never from a global ramp | see `construction/` |
| `density` | `default`, `compact` | existing Area switch |
| `shape` | decided per component by the construction entry: follows `data-area-radius`, identity shape (always pill or always circle), small fixed radius, or concentric with a parent. A `--pill` or `--square` modifier exists only where the entry says so | pill = circular(Fluent) / full. square = sharp |
| `state` | hover, active, focus-visible, selected / checked / pressed, indeterminate, disabled, disabled-focusable, read-only, invalid, loading | runtime only, never a class the consumer sets by hand except `data-loading`, `data-invalid` |
| `layout` | `inline`, `block` (full width), `orientation=horizontal|vertical`, `align=start|center|end`, `labelPosition=start|end|above|below` | block = fullWidth / fluid / stretch |

Rule for tone x variant: every family that accepts both must render the full matrix
(for example Badge = 5 variants x 10 tones = 50 cells). In the gallery every cell is its
own standard tile, exactly as Button and Checkbox do it: one independent case per tile.
A tile holds several instances only when the children are the component's content
(BadgeGroup, AvatarGroup, a Menu's items). The component's docs page may show the matrix
as a grid. Missing cells are the most common gap in past output.

---

## 4. Quality bar (why previous output looked wrong, and the fix)

These are the recurring defects. Check each before calling a family done.

**Geometry**

- Inner radius = outer radius minus the inset between them, floored at 2px. A thumb inside
  a track, a segment inside a segmented control, a tag inside an input, a card inside a
  panel. Never the same radius on both.
- Icon box is a fixed square per control size (reference: 14px icon in 24-28px controls,
  16px in 32-40px, 20px in 44px+). Icons never scale with `em` inside controls.
- Icon-to-text gap is smaller than the control's inline padding (reference: gap 4-6px
  against padding 8-12px). Leading-icon side gets 1-2px less inline padding than the text
  side so the control looks optically centred. OpenAI ships this as `opticallyAlign`.
- Text in a control is vertically centred with `line-height` equal to an even pixel value
  and the control height set by `height` or `min-height`, not by vertical padding.
- Borders are drawn inside the box (`box-shadow: inset` or `border` with `box-sizing`), so
  outline and solid variants are the same outer size to the pixel.
- Hit target is at least 24x24 CSS px (WCAG 2.2 AA 2.5.8) even when the painted control is
  smaller: extend with a pseudo-element, not with padding that changes layout. On coarse
  pointers Primer raises to 44px min-height; do the same behind
  `@media (pointer: coarse)`.
- Nothing shifts on state change. Selected tabs do not get heavier font weight unless the
  width is reserved (Fluent: `reserveSelectedTabSpace`; implement with a hidden bold
  duplicate via `::after { content: attr(data-label); font-weight: <selected>; visibility:
  hidden; height: 0 }`). Borders that appear on focus are pre-reserved as transparent.

**Surface and colour**

- Use only the existing Area stroke, shadow, and surface tokens. Do not introduce new
  shadow recipes. Overlays (menu, popover, tooltip, toast, dialog) each take one step of
  the existing shadow ramp, ordered tooltip < menu = popover < toast < dialog.
- Soft variant background and its hover step must both clear 3:1 against the page for the
  control boundary or carry a stroke; text must clear 4.5:1 on every tone in both themes.
- Disabled is not `opacity: .5` on the whole control when the control sits on a tinted
  surface. Use disabled tokens for fill, stroke, and text separately. Keep a
  `disabled-focusable` path (Fluent `disabledFocusable`, Primer `inactiveText`) where
  `aria-disabled="true"` replaces the `disabled` attribute so a tooltip can explain why.
- Forced-colors: every state that relies on fill (checked, selected, progress value) needs
  a `@media (forced-colors: active)` rule mapping to `Highlight`, `ButtonText`, `GrayText`.

**Motion**

- 120-200ms for state, 200-250ms for position (thumb slide, indicator slide), ease-out.
  All motion sits behind `@media (prefers-reduced-motion: no-preference)`. Skeleton and
  spinner keep a reduced, non-translating fallback (opacity pulse) rather than stopping.

**Demos**

- Real content. "Notifications", "Deploy to production", "3 of 12 files", real names and
  dates. Never "Label", "Option 1", "Lorem ipsum" except in the long-content stress test.
- Follow the documentation rule already in `COMPONENT_AUDIT.md`: preview 1 is the
  standalone default, followed by shipped sizes, states, layouts and useful compositions.
  Each ordinary gallery tile contains one case. Add a variant/tone matrix only when both
  axes survive the Area-fit gate and tone changes the component's semantic job. Keep long
  strings, RTL, zoom, narrow layout, theme, density, radius, contrast and motion in the
  shared customizer or verification fixture unless one teaches a distinct public option.
- Each preview has a one-line caption stating the job, not the prop. "Settings row that
  saves immediately" rather than "labelPosition=start".

---

## 5. How each family section is laid out

1. **Jobs and aliases**: what it is for, names in other systems.
2. **Anatomy**: ASCII diagram with every part named. Part names become `__part` classes
   and React slots.
3. **Candidate list**: the normalized research table. Columns: axis, canonical value,
   aliases, sources, Area fit, and decision. Build Core and approved Extended rows.
4. **Reference geometry**: measured or source-read values from other systems.
5. **Reference markup** and, where layout is non-obvious, a CSS skeleton.
6. **Behaviour**: keyboard, ARIA, focus, form participation.
7. **Separate**: neighbours that must be their own component. Build them; do not merge.
8. **Demo list**: the previews to render, in order.
9. **Pitfalls**: mistakes seen in generated output for this family.

Source codes used in tables: **OAI** OpenAI Apps SDK UI, **NOT** Notion (product
observation), **PRI** Primer React, **SHA** shadcn/ui, **FLU** Fluent 2 (React v9),
**FIG** Figma UI3 (product observation), **GEI** Vercel Geist, **M3** Material 3,
**CAR** IBM Carbon, **ATL** Atlassian, **HIG** Apple HIG, **MUI** MUI / Joy.
See `08-evidence-ledger.md` for which were read from source today and which are recalled.

---

## 6. Definition of done per family

- [ ] Every candidate row has a decision and its evidence systems are named.
- [ ] Every shipped Core/Extended row exists in CSS, manifest, React, and docs.
- [ ] Public gallery previews render one case per tile; size comparisons and real
      multi-item compositions are the only exceptions.
- [ ] Stress, theme, density, radius, contrast, and motion coverage exists in the shared
      customizer or verification fixture without duplicating gallery tiles.
- [ ] Geometry table filled at every size x both densities x radius min and max.
- [ ] Keyboard table in the family file passes by hand. Native element used where one
      exists (`<input type="checkbox" role="switch">`, `<input type="range">`,
      `<progress>`, `<dialog>`, `<details>`, `<table>`, `popover` attribute).
- [ ] Light, dark, forced-colors, reduced-motion, RTL, 200% zoom checked in the browser,
      not from source.
- [ ] Separate components listed in the family file are either built or queued with a
      row added to the audit sequence table.
- [ ] Report written to `docs/component-audits/<slug>.md` in the existing ten-part format,
      citing `08-evidence-ledger.md` rows and re-verifying any marked "recalled".

## 7. Doing your own lookups

Geometry: never from memory and never from a rendered docs page you cannot measure. Use
the evidence tool, which reads pinned source and resolves tokens to px:

```
python3 docs/audit-pack/tools/audit-evidence/lookup.py <component>          # numbers only
python3 docs/audit-pack/tools/audit-evidence/lookup.py <component> --full   # whole files
python3 docs/audit-pack/tools/audit-evidence/lookup.py --find <name>        # search file names
```

`evidence/INDEX.md` lists the files per component and `evidence/PINS.md` the commits. To
refresh sources: `./fetch.sh --latest && python3 extract.py && python3 lookup.py --reindex`
in `tools/audit-evidence/`, then re-check any construction entry whose files changed.

Variants and props (not geometry):

- Geist: every page serves Markdown at `https://vercel.com/geist/<slug>.md`. It publishes
  API and examples, not pixel values; record geometry as `n/p`.
- Primer: `packages/react/src/<Component>/<Component>.docs.json` in the cached `pri` source.
- Fluent 2: `.../react-<name>/library/src/components/<Name>/<Name>.types.ts` in `flu`.
- shadcn/ui: the `cva` block in `apps/v4/registry/new-york-v4/ui/<name>.tsx` in `sha`.
- OpenAI: `src/components/<Name>/` in `oai`.
- Carbon, MUI, Radix, Material: the cached `car`, `mui`, `rdx`, `m3` sources.
- Notion, Figma, Apple HIG: direct observation only; never write a number for them unless
  you measured it in a browser and say so.
