# Handoff — 2026-10-01

Each session starts from `main` in its own worktree (`claude/*` branch) and merges through a
pull request; icons and components run as separate sessions.
System-wide files (icon generator, base styles, handoff) change in one session at a time. The dev server is `npm run dev` (4321 by default; port 3000 in the latest
session). Open `/gallery-icons.html` for icons. No owner completion changed; Indicator stays In review.

## Compact pass: tokens, rows and floating surfaces (2026-10-01, branch `claude/family-compact-pass-150bc8`, uncommitted)

- Owner: compact is a proportional step-down of the whole set (`data-area-ui="compact"`), UI type
  12/16, rows 24, corners one step down; checked against vscode.dev until Cursor is measured.
  Note with tables: `docs/research/compact-pass-2026-10-01.md`; captures in
  `docs/research/captures/compact/` (14 vscode.dev, 3 Figma, Area compact after).
- Tokens: `COMPACT_TIERS` md 28/8/16/4 at 12/16, sm icon 16, xs 12/16; new density roles
  `ui-row` (32/24), `ui-row-inset` (8/6), `ui-dense` (0/1); `gap-row` 12/8; `inset-surface-sm/md`
  12/16 and 8/12. Text scales along the UI ramp (compact 12/16, 12/16, 14/20).
- Radius: the radius axis publishes `radius-base-*` and `radius-dense-*` (a compact tier reads the
  curve's value for its painted height); `emit/base.ts` derives `radius-control*`,
  `radius-container`, `radius-small`, `radius-row` from them and `ui-dense`. Leaves registered,
  derived tokens not.
- Rows read `ui-row` / `ui-row-inset` (inset.css, Menu, Nav, Tree view, Combobox, Command palette,
  Select picker); Popover gap and Dialog corner read `inset-surface-md`, Toast `inset-surface-sm`.
  Default density renders exactly as before (verified live).
- Comparison page: https://claude.ai/artifact/ULwhW84UswgMc9NY1dBLci (republish from the
  scratchpad builder with `packages/styles/dist/area.css`).
- Round 3 (smallest-first, owner): compact marks 16/16/20; Badge, Count and Kbd inner values are
  functions of their height (default identical, compact md drawn as default sm); inline Code
  floored at 12; Toast block inset derived so the last control is concentric (compact 32 tall).
- Round 4 (owner: equal insets): trailing plates end as far from the end as from the top, trailing
  ink ends on the glyph edge; fixed Nav plain counts, Tree view and Nav row actions (concentric),
  mark-height literals in inset.css, Alert's phantom grid gap (default action 14 -> 6) and insets,
  the banner Badge, the compact sm field action. A sweep script in the session checks all tiles.
- Round 5 (controls): inputs and controls already scale via the control ladder; new layout roles
  `ui-stack` (Field label gap 6/4) and `ui-cluster` (Toolbar inset and gaps, horizontal Field 8/6);
  choice rows keep the 24px WCAG target. Start and end equal-inset sweeps: zero mismatches.
- Round 6 (containers): Card inset/step, Panel sides (surface insets) and gaps, Property list and
  Table cell padding step down one rung; component values written `default − diff × ui-dense`.
- Round 7 (conversation and tools): Message, Composer, Code block, Command palette search row step
  down; bubble corner = Composer corner. Calendar compact 32/28 (Notion), default 36/32 kept.
- Round 8 (sweep): fixed 8 / 16 / 12 / 20 gaps across the gallery read `ui-cluster`,
  `inset-surface-md` or step one rung; Code block header action 4 / 4. Default verified against
  HEAD (11,584 elements; 120 intended differences in 14 tiles).
- Open: dialog inset (12 proportional vs VS Code 24); tooltip sides 10;
  other families still use literal spacing (Card, Panel, Alert, fields) and need their round;
  Menu and Nav are Officially complete and changed at compact only.

## Audit phase 6 (2026-09-30, branch `claude/component-work-continuation-aef804`, uncommitted)

- **S18** pending is not disabled: a loading Button is `aria-disabled` + `aria-busy` +
  `data-loading`, keeps focus and full opacity, swallows its click; the spinner fills the
  tier's icon box. Composer `loading` (`busy` deprecated) keeps the textarea editable and turns
  send into **Stop** (`onStop`, `stopLabel`; Area `stop` glyph, filled). ChatGPT's Stop glyph
  size is not captured (needs a streaming reply in the owner's account).
- **S16** one floating engine: Hover card (8, start-aligned), Combobox list (4, flips),
  BadgeGroup overflow (8) and the InputAction hint (a real Tooltip) use `useAnchoredPosition`;
  `.area-popover-anchor` and its manifest entry are gone. Toolbar overflow is a ghost More
  Button (Area `more-horizontal` glyph) opening a Menu (`clearToolbar` in toolbar-context.ts,
  shared with SplitButton). Select's native picker follows Combobox's list (flip, ≥224, ≤324,
  plate-only focus). Found and fixed: triggered Tooltips had the browser's 3px popover border
  (34 tall, not 28).
- Glyph generator: `rect` sources and filled dots (`{ fill }` entries) are supported; `Glyph`
  takes `filled`. New package glyphs `stop`, `more-horizontal`.
- **S17** API vocabulary (rule written in DESIGN_SYSTEM "CSS, manifest and React"): value
  callbacks pass the event; Checkbox `onCheckedChange`; Segmented `onValueChange` + form props;
  Button uncontrolled toggle; `aria-label` replaces name-only `label` in 15 components; Dialog
  and Hover card controllable; Tooltip `closeDelay`; MenuItem `icon`; Kbd `sm`/`md` + `variant`;
  Code/Token `ground`; Badge `inverse`; Button align `start`/`end`; IndicatorAnchor
  `rectangular`/`circular`; every default axis value has a class; AlignmentPicker `soft`;
  ColorPicker `plain`; NumberField `invalid`; `style` on field shells; bare Field validation
  is neutral; Message defaults to assistant; `--area-composer-inline-size`. Deprecated aliases
  kept. Specs updated by a subagent pass.
- Open for the owner (S17): H-14 (collections as `items`? Input `leadingIcon` vs `icon`), the
  Nav fill-selection value name, Card `layout="compact"` vs compact density, Presence `xs`.
- Checks: build, typecheck, 175 React tests, contracts 14, preview 4, consumer, 19,491 token
  tests, parity, icons, docs audit. Verified live: Composer Stop, loading Button focus, Toolbar
  overflow, Hover card, Combobox flip, InputAction tooltip, BadgeGroup overflow, renamed classes.
- Phase 7 done in the same branch:
  - **S19** Alert and Toast share neutral, info, success, warning, danger (Badge order); Alert's
    neutral icon is muted ink; Indicator's danger default is the written exception (DESIGN_SYSTEM).
  - **S20** the Indicator count is Count sm's 12/16 500. On a 32px avatar "24" is 23 wide; "99+"
    is 29 wide and covers the top of the initials (open for the owner).
  - **S21a** density roles `mark-sm/md/lg` (Badge, Count, Kbd, Indicator) and
    `inset-surface-sm/md` (Popover, Dialog); compact values equal default until measured.
  - **S21b** `opacity-disabled` (16 sites) and `scrim` (3 backdrops); every `:hover` rule is in
    `@media (hover: hover)` (transformer split `:is(:hover, …)` so focus and `data-hover` stay;
    a test fails on an ungated hover); Tree view actions show on focus-within and on touch.
    Unused tokens are parked, listed in THEMING.md; `z-*` stays for apps.
  - **S21c** dark pass done (owner go-ahead; products switched back to their system themes):
    19 captures, `docs/research/dark-pass-2026-09-30.md`. Floating surfaces read `edge-float`
    (#333 in dark), dark `shadow-color` is 20% (was 8%), the tooltip stays dark in dark
    (#282828 + 5% white inset), Card has no halo in dark; scrim, fills and row hover unchanged.
    Captures must be exported right after each batch: a page navigation drops `window.__caps`.
- Owner calls (2026-09-30, "go with your recs"): `options` for value choices and `items` for
  collections (ModelPicker `options`, Tabs and PromptSuggestions `items`); Input `icon` (was
  `leadingIcon`); Nav selection `plate`; Card `layout="list"` (was `compact`); Presence keeps
  `xs` as a written exception; "99+" stays on small avatars. Old names are deprecated aliases.
- Next: compact calibration of the mark and inset roles (a compact capture pass); a toast and
  Figma dialog in dark if one can be opened read-only; the audit's remaining clear fixes and
  docs drift rows.

## Audit moved into the repo (2026-09-29, branch `claude/cool-kirch-9facec`)

- The audit lives in `docs/research/audit-2026-09-29.json` (source of truth: 239 findings with
  route, status and resolving PR; 21 rules / 32 choices and 59 family calls with options,
  recommendation and `pick`; owner decisions D1–D4; docs drift; checks). The original eight
  reports are in `docs/research/audit-2026-09-29/reports/` (evidence with file:line refs).
- `npm run audit:page` regenerates `docs/research/audit-2026-09-29.md` (committed; `--check`
  verifies it) and the decisions page in `.cache/audit-2026-09-29/` (`index.html` + `area.css`
  from `packages/styles/dist`, so run `npm run build` first). Page templates (specimen markup,
  CSS, script) are in `docs/research/audit-2026-09-29/page/`.
- Page: https://claude.ai/artifact/HPeEX5JVpgzugs4uJMQV7i (new link; the old "Area Audit
  Decisions" artifact is frozen). Republish with `files: { "area.css": ".cache/audit-2026-09-29/area.css" }`
  and the page URL as `url` — the page alone is ~250 KB.
- Owner picks (2026-09-30): the recommended option on all 91 choices (32 rule choices, 59 family
  calls), recorded as `pick` in the JSON (D5); every rule is `decided`. Page republished.
- Phase 1 done (2026-09-30):
  - **S1** field focus: `field-focus-color` = `focus-color`, new `field-focus-halo-color` (focus at
    14%) on Input, Textarea, Select, NumberField, InputGroup; Composer keeps the quiet neutral edge
    via `composer-focus-color`. Verified live: light #004cb0, dark #c1d9fd, both with the halo.
  - **S2** weight 500: docs rewritten to match the code (DESIGN_SYSTEM, typography, alert, panel,
    calendar). No CSS changed.
  - **S3** corners: radius axis token `radius-concentric` (0 at Sharp, 1 otherwise) scales the
    distance in Card (all sizes and well), Composer, Message, Prompt suggestions, Toolbar,
    Segmented track and the ColorSwatch shape. Verified live: Standard unchanged (card 24/28,
    composer 16, toolbar 16, segmented 10), Sharp 0 everywhere. DESIGN_SYSTEM radius rule rewritten
    (S3b). F-1 stays partly open: a small card still derives from the md control radius.
- Phase 2 done (2026-09-30):
  - **S5** off greys: Slider rail and range rail, Progress rail → `edge-control` #e2 (as Switch);
    Slider thumb edge → `edge-control-hover` #d4 (as Checkbox/Radio). Spinner track unchanged, so
    E-22 is partly open.
  - **S6a** Badge soft neutral and Chip input → Count's 6% translucent plate (hover 10.7%, press
    12.3%; dark 10/22.6/27.9% white). **S6b** Message actions drop their fg-muted override.
  - **S7a** Composer and Code block edge → Card edge (neutral 100 / dark 750); Composer hover →
    `input-edge-hover`. **S7b** documented (Card #ee with halo, Table frame #e2).
  - Verified live in the gallery (computed values). DESIGN_SYSTEM "Shared state paint" and the
    edges paragraph rewritten; specs updated by a subagent pass.
- Phase 3 done (2026-09-30):
  - **S4** per-tier radius (6/8/10) on Input, Textarea, NumberField, Select (`--_radius` per size)
    and InputGroup (`--_group-radius`); Segmented track takes the tier radius, items concentric
    inside (md 8 around 6; was 10 around 8); Calendar days control-md 8 (F-12).
  - **S8** joined-control seams keep #e2: written exception in DESIGN_SYSTEM (docs only).
  - **S9** Alert close is a ghost sm Button with the Area glyph (tinted: tone ink, 12% ink plate);
    Chip remove uses the Area glyph; `onDismiss`/`dismissLabel` on Chip and Dialog (old
    `onRemove`/`removeIcon`/`removeLabel` and `onClose` are deprecated aliases). Demos and
    pages.mjs moved to the new names. Tests: `packages/react/tests/audit-rules.test.mjs`.
  - Also F-6 (ColorPicker inner rules → border-decorative) and G-18 (prompt-suggestion dismiss sm,
    pressed plate).
- Phase 4 done (2026-09-30):
  - **S10** Surface axis roles `shadow-card` and `shadow-float` (none at Flat); nine floating
    literals and Card's halo read them; Table frame on `stroke-width` (keeps its edge at Elevated);
    cohesion test now asserts the role. Tooltip and the Toolbar floating bar keep own recipes.
  - **S11a** density token `gap-row` (12) puts every icon row's label at 36: Menu, Palette,
    Combobox, Select options, and Nav via `inset.css` (row gaps live there, not in nav.css).
    **S11b** Nav/Tree inset focus ring; Breadcrumb ring on its plate. **S11c** nested row controls
    hover with `bg-hover`.
  - **S12** quiet Kbd = string shortcut (Geist 12/16 400 muted, danger row ink); "Esc"; keycap in
    any Button `currentColor` 14%.
  - Verified live (computed values); gallery "before" review demo still pins the old 8 menu gap.
- Phase 4 follow-up: a quiet Kbd in a menu takes the text end inset (inset.css reserves the
  keycap box only for `--on-color`) and has no border: ends 11 from the row like a string.
- Phase 5 done (2026-09-30):
  - **S13** menus check-only (MenuItem `radio` → menuitemradio; ModelPicker uses it); value
    pickers plate + check (Combobox sets `data-selected`); gallery Selected tile and Composer mode
    menu moved off raw data-selected.
  - **S14** density gap sm/md/lg → 6 (default); Button reads tokens; Button group and Toolbar stop
    overriding child gaps; layout uses of the gap tokens pinned to space-8/space-4 (Card header,
    footer, overlay pad, horizontal Field, Alert/Toast row, Slider range, Breadcrumb items, Alert
    actions, Kbd chords). Unused `--_group-gap` / `--_toolbar-gap` declarations remain.
  - **S15a** Segmented thumb `light-dark(bg-surface, bg-component-active)` (dark #3f on #28).
    **S15b** neutral soft Split button = soft Button group recipe.
- Phase 6 done: see the next section.

## Audit medium fixes, batch 1 (2026-09-29, branch `claude/component-audit-progress-60ca4b`, uncommitted)

- Owner decisions from the audit (emphasis roles; fix all of section 1) are recorded on the
  "Area Audit Decisions" artifact with their status; before/after page: "Area Audit Progress"
  (https://claude.ai/artifact/DUUr5tgGFccjFaKNnhStzj). No system rule (S1–S21) or family call is
  decided yet.
- Fixed (no taste call): B-2 Select rests without shadow-1; F-11 circle calendar days hover to
  bg-component-active; D-5 disabled tree rows dim to 50%; B-8 InputAction pressed/disabled paint;
  E-7 a triggered Dialog takes aria-label on the native dialog; E-8 (partly) PopoverTitle labels its
  Popover (no PopoverClose, title still a fixed h2); C-9 RadioGroup and F-13 Calendar reset with
  their form; B-12 Combobox submits the option value through a hidden input and resets; B-13 IME
  Enter guard in Combobox and NumberField; C-10 Slider aria-valuetext from its readout; A-12
  icon-only Button keeps children as its name. Tests in `packages/react/tests/audit-medium.test.mjs`;
  specs (select, calendar, tree-view, input) and DESIGN_SYSTEM updated. Form resets verified live.
- `node --test packages/react/tests` fails on Node 26 (directory argument); use
  `node --test packages/react/tests/*.test.mjs` (166 pass after `build:docs`).
- Next (owner, 2026-09-29): restructure the audit workflow before more fixes:
  1. Move the audit into `docs/research/audit-2026-09-29.md` (or .json + md): every finding ID,
     severity, status (done PR 28 / done batch 1 / partly / open), the 21 system rules and 59 family
     calls with options and recommendation, and owner picks. Data source today: the "Area Audit
     Decisions" artifact's FIXES / DRIFT / SMALL arrays and S-cards.
  2. Generate the decisions page from that file with a script; publish Area's stylesheet as a
     separate file (`files`), not inlined (the inlined 590 KB made each republish cost ~350k tokens).
  3. Then one phase per session: owner picks → implement ~10 fixes or ~3 rules → docs → page update.
     Broad reading (spec drift sweeps) goes to subagents.
- Default accent is now blue (owner, 2026-09-29; was indigo): `ROLE_SCALES.accent` and
  `DEFAULT_SELECTION.accent`. Focus follows the accent (`tokens/src/semantic/aliases.ts:181`), so
  rings are blue (#004cb0 light, #c1d9fd dark). Blue now equals `info`; accepted. Whether focus
  becomes its own `focus: neutral | accent` role is still open (S1 field focus reads it either way).

## Audit, emphasis roles and fix-first (2026-09-29, branch `claude/component-audit-visual-guide-ac7bc4`, uncommitted)

- Whole-library audit (8 parallel audits, 239 findings) published as the "Area Audit Decisions"
  artifact (https://claude.ai/artifact/6mjomgM6ZogMfoHX6BvFXR): 21 system decisions, 59 family
  decisions, 99 fixes, docs drift. Reports were kept in the session scratchpad only.
- **Emphasis roles (owner):** accent is no longer a component variant. New axes `action` and
  `selection` (neutral | accent, default neutral; `tokens/src/axes/emphasis.ts`) switch role
  tokens derived in `emit/base.ts` (`action-solid`, `fg-on-action`, `selection-solid`,
  `fg-selection`, `selection-surface`, `-band`, `-edge`…). Action = solid neutral Buttons (and
  Split button, send); Selection = checked/on/filled/current marks. Row plates, Segmented thumb,
  soft/outline/ghost Buttons stay neutral. `tone="accent"` removed everywhere; single-value tone
  axes dropped (Checkbox, Radio, Chip, AlignmentPicker, Calendar, Slider, Progress, Spinner,
  Count, Nav). Gallery "Tone / accent" tiles became "Selection / accent" and "Action / accent"
  (scoped `data-area-*`). DESIGN_SYSTEM "Emphasis roles" and THEMING updated; per-family specs
  still mention accent tones (drift).
- **Fix-first applied:** Button group hover edge and solid children (A-1/A-2), Tree selected row
  under hover (D-4), dark code rules (G-3: dark code ground 850, inline Code faint edge),
  reduced-motion Progress (E-9), Pill caps on uncapped shapes and Card (H-1; Sharp is still
  decision S3), required edges on `stroke-width` (H-3, F-5), RadioGroup generated name (C-8),
  Calendar unavailable days focusable via aria-disabled (F-9), tooltip/hover-card Escape no
  longer closes the parent surface (E-4), Model picker on Menu's trigger path (G-11). Consumer
  fixture updated; `test:consumer` passes again. Families keep their Complete status.

## Owner direction

- **Icon sessions open with the owner's decisions** (owner, 2026-09-28): before drawing, list
  the decisions pending for the next icon batches, with options and a recommendation (the
  "To settle with the owner" section of `docs/research/icon-inventory.md` and open questions
  below). Work starts once they are made.

- Visual-first: get every component and variant exactly right from measured evidence
  (ChatGPT, Notion, Figma, Cursor, Untitled UI, Fluent), then systematize tokens.
- Lighter UI: regular-weight titles, few sizes/weights/colors, one variable per distinction.
- Area draws its own stroked icons at 1.125px (`--area-weight-icon`).
- A compact density of the whole system is planned for dense products (Cursor and other
  IDEs, Figma, Notion). Dense sizes (24/28px) go to compact density, not new component sizes.
- The documentation site is hidden. Work happens in the gallery pages until the owner
  asks to populate the docs.

## Process (read before component work)

- `docs/COMPONENT_ADAPTATION.md` (process), skills `area-component-build` and
  `area-visual-language` (`.agents/skills`, linked from `.claude/skills`).
- Capture: `apps/docs/public/area-capture.js` (checksummed, with a fingerprint check);
  `npm run capture:compare`. The Edge extension truncates results at about 900 characters
  (read in chunks), background tabs stall async scripts, and products are read-only (ask
  before switching a product's theme).
- Specs: `docs/specs/` (indicator, icons, typography, PRIOR_DECISIONS); baseline
  `docs/research/BASELINE.md`; captures in `docs/research/captures/`.

## Current state

- **Gallery:** eight pages with a nav: components, typeRamp, iconography, color, scale,
  radius, surface, motion. `index.html` and `gallery.html` redirect to the components page.
- **Type ramp (applied):**
  - text 12/16, 14/20, 16/24; titles 20/28, 24/32, 32/40; titles fixed in compact;
  - small controls 12/16;
  - weight 400 everywhere except labels on fills (500).
- **Icons (branch `icons-system`, PR 3):** 256 icons in twenty-three batches; rules in the
  `area-icon-construction` skill, record in `docs/specs/icons.md`.
  - Sources: `apps/docs/assets/area-icons-pilot/` (`npm run icons:pilot`, `npm run lint:icons`,
    `--report`, `--audit`). The lint checks the grid, the diagonal lattice, keylines, the
    gap and counter scale, acute corners, filled gaps, and live area.
  - Review: `gallery-icons.html`, grouped by `batches.json` with owner status and a
    whole-set grid per batch; open questions go in `explore/`.
  - Batch 1 (core) is approved except items back in review; batches 2–13 are in review.
  - Components drawing Area glyphs: Badge dismiss, NumberField steppers, TreeView chevron
    and check, Composer send (`glyphs.ts`, `Glyph.tsx`, with sizes on the size curve).
    Fluent remains elsewhere and in demos.
  - Remote review: render a sheet with headless Edge (see the batch 5 note in the spec).
- **Indicator (pilot component):**
  - 6px dot; 16px count with 10/14 text, weight 500;
  - 1px surface cutout;
  - counts centre on the corner (`compact` is opt-in); dots centre on the icon corner;
  - tabs reserve space after the label; circular owners sit 2px outward.

- **2026-09-26 (branch `claude/component-variants-audit-fc1ee4`, uncommitted):**
  - gap audit of 13 design-system catalogues: `docs/research/component-gap-audit.md`,
    summarized in `docs/COMPONENTS.md` (Gap audit section);
  - ColorPicker Figma pass (`docs/specs/color-picker.md`, 11 Figma captures): ten-row width,
    16px pill tracks, ringed thumbs, eyedropper, Hex/RGB/CSS/HSL/HSB value row, header slot;
  - Calendar, new (`docs/specs/calendar.md`, 7 Notion captures): single/range/multiple,
    two months, bounds, APG grid keyboard; gallery tiles use the new `1x2` span;
  - later passes: Calendar neutral tone, 12/16 days, circle/tile days, markers, week strip,
    Schedule composition; ColorPicker views (spectrum/grid/sliders), OKLCH, contrast band,
    preview, save; `scripts/gen-color-grid.mjs` generates the palette grid;
  - captures from pages that block the script: paste it, then hand results over the
    clipboard (`pbpaste` needs `LANG=en_US.UTF-8`) or a local `postMessage` relay
    (COMPONENT_ADAPTATION.md, "Browser tools");
  - neutral-by-default sweep: Checkbox, Radio, Chip and AlignmentPicker gained a `tone`
    axis (neutral default);
  - **cohesion audit** (`docs/research/cohesion-audit.md`): every family accepted before the
    evidence process re-checked; 37 new specs; shared state paint (row plates, disabled,
    fixed ink, neutral markers, one floating lift, one label weight) written into
    DESIGN_SYSTEM.md and the skills; 20 families reopened for review; `check-token-refs.mjs`
    in the styles build and `packages/react/tests/cohesion.test.mjs` guard the rules; Untitled
    UI values pinned in `docs/research/untitled-ui-reference.md`; 23 ChatGPT baseline captures;
  - **second and third passes (2026-09-26/27):** 77 Notion and Figma captures and 424 Area
    recaptures; every audited spec carries them. Every open question is settled in the audit
    ("Second pass" and "Third pass" sections): dark neutral alphas solved against the page
    rung, `border-divider` role, Kbd filled and concentric inside Buttons, Switch travel,
    Segmented muted ink, Card container radius and divider edge, Select `soft`, Button group
    full-height seam, Panel all-soft rows, and more;
  - **gallery:** Pass reviews removed at the owner's request (`cohesion.tsx` deleted). Tiles
    are grouped per family (Default, Variants, Tones, Sizes, Layout, Content, States, Behavior,
    Variant × tone; `specimenGroup` in `apps/docs/scripts/specimen-names.mjs`). Every
    non-default manifest value has a tile; extra tiles live in
    `apps/docs/src/demos/gallery-variants.tsx`.

  - **Card (2026-09-27, In review):** layouts vertical, horizontal (40 / 60, media start or
    end by order, stacks below 480px via a container query), compact, immersive; `CardMedia
    bleed`; size (12/16/24 corners, 6/8/12 insets); linked cards (`CardLink` stretched over the
    card, edge-step hover, card focus ring, `CardOverlay reveal`); CardHeader, CardOverlay,
    well, CardList; eight templates in a Templates gallery group. Appearances were removed at
    the owner's request (a later system-wide pass); their evidence stays in
    `docs/research/captures/card/`. Spec: `docs/specs/card.md`. Paint pass: neutral 25
    media, edge #ee, faint two-layer shadow; type audit added tracking, `CardValue`,
    `CardCarousel`, a well that stacks its contents, and space reserved beside bottom overlays.

  - **Overlay behavior (2026-09-27, In review):** `trigger` on Popover, Menu and Tooltip
    (native popover top layer, `popovertarget` on button triggers, JS `computePosition` with
    flip and shift, menu button keyboard, tooltip delays and hover bridge, 150ms motion).
    Spec `docs/specs/overlay.md`; tests `packages/react/tests/overlay.test.mjs`; gallery
    `behavior-*` tiles. Tooltip is still marked Complete; its behavior is new and unreviewed.

## Batch 11 Chrome pass and Kbd corner (2026-09-28, branch `claude/kbd-button-refinement-21fa0c`)

- Owner: Kbd "looks too sharp", "thought kbd had a stroke?". Corner 4 → 6 (`--_radius`), no longer
  concentric in Buttons (was 2 at every size); Tooltip takes max(own, concentric). Kbd moved back to
  In review. The stroke is not applied: `GalleryReviewKbd` shows it as a proposal (surface fill +
  `edge-control`). Evidence: Notion and ChatGPT inline hints have no edge (ChatGPT forces
  `!border-0`); Figma's keyboard-shortcuts panel outlines each key (1px 70%, corner 2); Untitled rings.
- Batch 11 side by side recorded in `pass-status.mjs` (Button vs Figma Share, Notion, ChatGPT;
  Button group vs Figma's Present pair; Kbd). Button and Button group unchanged, now officially
  complete; Kbd awaits the owner's decision on the stroke and approval of the corner.
- Owner follow-up: 6px keycap corner everywhere as a rule (token `radius-control-sm`); Kbd
  Templates tiles show it in twelve hosts; Input suffix now centres a keycap (inset.css).
  Open: menus and the command palette show shortcuts unboxed (quiet, as Notion and Figma);
  Escape renders as the ⎋ glyph where ChatGPT and Notion write "Esc".
- Batch 11 approved (Kbd complete as shown). Batch 12 (Text entry) side by side recorded: Notion's
  search and invite fields, Figma search, ChatGPT multiline fields; no paint change; specs' stale
  resting shadow corrected; 51 Area tiles retaken. Input back to In review (Kbd suffix fix).
  Open: Textarea lg is barely distinct from md (same 14/20 and 12 inset).
- Batch 12 approved (date picker: a Popover holding only a Calendar hugs it). Textarea inline
  inset follows Input's per size; gallery date field = Input + Calendar in a Popover (`anchor`).
- Batch 13 (Select, Combobox, Field): no changes; visual passes written; side by side with
  ChatGPT's settings dropdown (rest, hover, open menu) and settings row, saved after the owner
  brought the Claude tab group's window forward (a hidden tab never reaches idle).
- Batch 14 (Checkbox, Radio, Switch) side by side recorded; no code change. ChatGPT switches (off /
  on, rest / hover) saved. Open for the owner: Switch off fill #d4 is darker than ChatGPT (≈#e6) and
  Notion (≈#db); Checkbox / Radio sm equals md except the label gap since small text became 14/20.
  Specs' stale control shadows corrected. Combobox (batch 13) still awaits approval.
- Owner: Switch off track lightened (#e2, hover #d4, local to Switch; fill-toggle unchanged for
  Slider); Checkbox / Radio sm removed. Batch 14 back to ready. Batch 15 side by side recorded, no
  change (Slider sm kept: row height differs).
- Checkbox / Radio card rebuilt from owner references + shadcn Choice Card: control at the end,
  chosen card outlined 2px in the checked colour, `layout` row / tile (tile grid 144 min), Radio
  gained card, leadingVisual and caption. Both remain In review.
- Batch 14 approved. Batch 16: Table compared with Notion's table view (returns), Card's 09-27
  Chrome pass recorded; no change. Card awaits approval. Dev server hang: `apps/docs/dist` held
  an iCloud duplicate ("… 2.html") whose read blocked readSnapshot; it cleared after ~80s.
- Card (owner): one text/button column 4 inside the media inset; corner = default Button radius +
  column distance (sm 18, md 20, lg 24); footer on the column; transport footers centred;
  immersive text on two insets. Card stays In review.
- Batch 17: visual passes written for Dialog and Hover card from the gallery + captures on file;
  live Chrome check blocked (tab hidden again). Open: Dialog's corner under Card's new rule
  (16 by the close vs 24 by the footer buttons).
- Clipboard hand-off failed once (clipboard held other content); the postMessage relay page
  (scratchpad relay.mjs on 3197, window.open + postMessage) works from Notion.
- Chrome was a background window (`visibilityState` hidden): rest captures and clipboard worked,
  hover states were not retaken. Local captures leave through a relay on 127.0.0.1 (CORS `*`).

## Batch 17 live check (2026-09-28, branch `claude/components-work-continuation-3d0d7d`)

- Started from main at PR 24 (`7b5ec4c`). Dialog and Tooltip compared live with ChatGPT in Claude in
  Chrome and recorded in `pass-status.mjs`; new capture `dialog/chatgpt--close-button--hover--light`.
  ChatGPT's tooltip re-measured identical to the 09-25 file. No CSS change.
- Dialog corner decided: stays 16 (set by the close, 8 + 8). ChatGPT's corner is concentric with
  neither its close (12 + 8) nor its pill footer button; Card's rule stays Card's. Owner deferred
  the call ("do whatever you think is best").
- Hover card: still no live side-by-side. The Chrome window went hidden again after the relay popup
  opened (the relay opens a window; close it, then ask the owner to bring Chrome forward).
- Relay for captures: scratchpad `relay.mjs` on 3201. `.claude/launch.json` has `autoPort` (3000
  is held by another session's server).
- Owner round: Dialog body bleeds by the focus ring (a full-width field's halo was clipped);
  chosen Checkbox / Radio card = 1px edge in the checked colour (no 2px ring); batch 13 approved
  (Combobox Complete); Card title + description join (baseline to cap 15 → 11.6) and the last line
  ends at its descent (md 12 → 16 below the baseline). Card stays In review.
- Badge group Chrome pass: the owner's Notion has no multi-select, so a public page
  (thomasfrank.notion.site) was measured: gap 6 between lines / 8 between tags (was 4 / 4, Primer).
  Badge group back to In review. Captures from a hidden window leave through the relay by
  `window.name` + navigating the tab to the relay (popups need a visible window).
- Batches 15 and 16 approved (Chip, Badge group, Card Complete). Batch 17 type checked against the
  captures; Hover card description stays 14 (owner, over Notion's 12). Palette footer plates now 8 on every side.
- Hover card live (Notion sub-page preview) and batch 18 live (Notion context menu and search,
  ChatGPT search palette, first capture) recorded; no CSS change. Batches 17 and 18 ready for
  approval. Open: both products draw the palette larger than their menus (corner 16–20, rows
  36–48); Area keeps the list model (12 / 32).
- Chrome must stay uncovered (macOS reports a covered window as hidden). ChatGPT clears
  `window.name` on navigation, so use the popup relay there (needs a visible window).
- Palette footer: plates 8 on every side; the Move label 6 from the ↓ plate (was 2).
- Batch 19 live on ChatGPT: composer and suggestions unchanged; new captures of a suggestion's
  hover (5% wash + ink lift, which Area does not follow) and the user message's hover actions.
  No CSS change; ready for approval.
- Batches 17-19 approved (Hover card, Context menu, Command palette, Message, Prompt suggestions
  Complete). Batch 20 live on ChatGPT: picker and scroll button unchanged since 09-26; new capture
  of the scroll button's hover (no paint change). No CSS change; ready for approval. Open: both
  ChatGPT controls use muted ink (trigger 16 #8f, glyph #5d) where Area's Buttons use default ink.
- Owner: all neutral ghost / outline Buttons a step lighter for consistency: ink = fg-default
  mixed 75% toward fg-muted (#56 light, 7.3:1; #cf dark, 10.8:1); selected toggles keep body ink.
  This settles batch 20's ink question.
- Card (owner): step 8, so text and controls sit 16 from the edge on every md card (14 / 20 at
  sm / lg), corners 22 / 24 / 28; carousel items on the title's column with 14/20 item titles;
  ghost header controls centre on the title's cap; a card in a well is a compact 44 row. Card
  back to In review.
- Batches 16 (Card again) and 20 approved. Batch 21 live on Notion: view tabs and topbar path
  unchanged; new hover captures (view tab, path item: 5% warm wash, ink fixed, as Area). No
  change; Tabs and Breadcrumb were already Complete.
- Batch 22 live: ChatGPT inline code (first capture) and code block, Notion menu rules. No change;
  Code block ready for approval (the last family in review). Open: ChatGPT's code block uses a 24
  corner and 12/20 code where Area keeps 12 and 14/20 (owner decisions).
- The dev server restarted on port 3000 (same worktree) after the app stopped 51597.
- Code block pass (owner: lighter ground, more vibrant colours): `INVERSION.code.light` = white, so
  the vivid syntax rungs moved 550 → 500 on their own (all ≥ 4.6:1); inline Code and `token-bg`
  keep #fafafa via `bg-stripe`.
- Batch 22 approved: every family in the approval batches is Complete.
- Next: the owner's call (docs site, dark themes, compact density, or new components).

## Avatar photo, initials, Calendar cleanup (2026-09-28, branch `claude/component-variants-gallery-f433f2`, uncommitted)

- This branch fast-forwarded to main at PR 15; a parallel batch 4 pass was dropped and only its
  new pieces re-applied. Owner approved them: Avatar initials 12 / 14 / 16 by size (Notion 14 on
  32); Irene's photo `apps/docs/public/images/irene-yamaguchi.jpg` (owner-supplied, replaces
  `chip-avatar.png`); the avatar badge shows one initial in its 16px disc; dot placement kept.
- Calendar (batch 7, owner): Schedule time list on the grid's rhythm (md rows 4 apart, 13 from each
  side, the calendar's height, shared lift; `align="start"` was pulling the plate onto the rule);
  week strip 12 all round; the two-month tile is a new full-width `4x2` gallery span.
- Batch 7 approved (Calendar). Batch 8 (Panel, Number field, Box field): Claude in Chrome side by
  side with Figma's Design panel; Panel section rules now sit midway (16 below the last field, the
  next title's cap 16 below the rule, via `(row - 1cap) / 2`); Number field and Box field unchanged.
  Panel is Ready for approval; the other two were already approved and are now officially complete.
- Batch 9 (owner feedback): Color field opacity sized to content with "%" anchored at the end (plain
  NumberFields keep "%" after the number); Select single-line with ellipsis, in-group text runs to the
  chevron box; InputGroup visual + Select joins like visual + Input; Property list tiles at 280 (240
  cannot hold hex + opacity at 14px). Gallery-wide check: no clipped input or select text.
- Color swatch (batch 9, approved): solid neutral-50 edge drawn as the swatch's background, layers
  1px inside concentric (radius - edge), corner 20% of the side, Area's own pixel checker (2 x 2 SVG
  mask, 5 cells, meets the edges). Swatch-picker cells concentric with it.
- Batch 10 (Color swatch picker, Color picker, Alignment picker): Claude in Chrome vs Figma's picker
  and Alignment grid; picker opacity sized like Color field, channel fields hug their digits, alpha
  checker 3 rows; a stale 2026-09-24 slider block that overrode the picker's 16px tracks removed.
  Questions: Figma's split translucent chits; Alignment grid sized to the layout (88 x 56).
- Panel (batch 8, approved 2026-09-28): insets 12 sm / 16 md; headings and the bar are rows whose button has one
  field gap above and below (8 / 12, Figma 8 / 8); actions one field gap after the fields; panel text and
  gaps step by tier (sm labels 12/16, gaps 8; md 14/20, 12), shared with BoxField and PropertyList via
  --_panel-*; md size tile shown at 280 (default width stays 240).
- The dev server rebuilds only when a source file's content changes (touch is ignored) and copies `public/` then; restart it after changing an image.

## Count and Banner (2026-09-28, branch `claude/component-banner-count-81af92`, in review)

- **Count** (new, `count.css`, `Count.tsx`, manifest `count`, spec `count.md`): plain (default,
  Notion) / soft (Primer, 6% black translucent plate), neutral / accent, sm 16 / md 20, 12/16
  tabular, `max+` via `count-format.ts` shared with Indicator, hidden `label`. Nav and Tabs demos
  use it.
- **Banner** = Alert `layout="banner"` + `flush` (spec `alert.md`, Banner): OpenAI 12 / 16 inset,
  44 tall, corner 6, flex row, link at the end on the inset. Alert moved Complete → In review; new
  batch "Counts and banners".
- Captures: `captures/count/`, `captures/alert/*banner*` (OpenAI business and Daybreak, Primer). Route
  for public pages in the built-in browser: paste the script, put captures in `window.name`, then
  navigate to a 127.0.0.1 relay page that POSTs them (popups open in the same tab there).
- Chrome side by side done (Notion board counts, OpenAI Daybreak); open: Count text 14 (Notion) vs 12;
  dark theme; no target product showed a banner. `npm run test:consumer` fails on an old
  `Panel size="xs"` in its fixture (unrelated).

## Batch 4 approved, batch 5 Chrome pass (2026-09-28)

- Owner approved batch 4 (Count, Alert with banner). Count stays a pill.
- Batch 5 (Avatar, Indicator, Badge): Claude in Chrome side by side done and recorded in
  `pass-status.mjs` (Figma avatars, bell and AI label; Notion person and workspace avatars, help
  dot, tags). No change to the three families; awaiting owner approval.
- Avatar in Chip: the initials overflowed (Chip used `control-sm-text`, 14 since small controls
  moved to 14/20); now `control-xs-text` like Badge, and the slot is `aria-hidden`. Chip moved
  Complete → In review. Avatar and Chip demos use Irene Yamaguchi (group: Irene + teams).

## Batch 5 approved, batch 6 Chrome pass (2026-09-28)

- Owner approved batch 5 (Avatar, Indicator, Badge).
- Batch 6 (Loading): transient states caught with a MutationObserver installed alongside the
  capture script; ChatGPT and Notion clear `window.name` (COOP), so their captures leave through
  the clipboard (injected button, real click, `LC_ALL=en_US.UTF-8 pbpaste`). Skeleton now takes
  ChatGPT's 10% / 16% grey and 3s linear shimmer (Figma agrees); Spinner unchanged (owner's 1s
  over ChatGPT's 2s). Progress: no product bar found again; not validated.
- Owner feedback: Spinner redrawn as SVG masks with round caps, stroke 1/8 of size (lg 3); a
  2.5px md option waits in `GalleryReviewSpinner`. Skeleton: rectangle 4px corner, `animated`,
  `lines`, wrap mode (children + `loading`), list tile; `skeleton.test.mjs`.
- Skeleton rethink (owner chose option A from `research/skeleton-rethink-survey.md`): shapes block
  (default) / text / circle; `rounded` and `rectangle` removed; wrap paints the child (utilities
  layer); compositions omit control placeholders.

## Gallery tiles and batches 6-7 (2026-09-28)

- The tall single-column tile (1x2) is gone (`GALLERY_SPANS`): Calendar tiles are 2x2 (two
  months 2x3), Count nav 2x1, every Skeleton tile 2x1. The Pass review's 2x copy now has the
  tile's content width (it collapsed full-width specimens). A DOM audit found no clipped tiles.
- Port 3000 serves a different worktree (`icons-branch-strategy-a94020`); this branch is on 4331.
  The dev server reads `pass-status.mjs`, `component-status.mjs` and the capture folders once at
  start: restart it after changing them, or the Pass review shows stale phases.
- Batch 6: Progress validated against Figma's AI-credits meter (open: Figma's tracks #f5 / #e6
  are lighter than Area's shared rail #dd). Batch 7: Popover validated against Notion's Share
  popover; Calendar against Notion's search Date filter (month label now 500). Batch 6 approved.
  Chrome tip: Notion's menus open reliably with synthetic pointer events dispatched to the
  element (`pointerdown`/`mousedown`/`pointerup`/`mouseup`/`click`); zoomed tabs misplace clicks.

## Owner feedback round (2026-09-27, branch `claude/component-gallery-status-4b51ac`, uncommitted)

- Message action plates align to the text / bubble edge; Card carousel 18.3 under the header;
  Command palette footer hints are working buttons (↑ ↓ Open Close).
- Panel: sizes sm / md only, rows fill the width, `actionColumn` (Figma recipe), width 240.
  Rule: a divider is never darker than its container (Panel, Code block → `border-decorative`).
- Toolbar: pressed = Button selected fill; track painted as Segmented (stroke, no shadow plate).
- Alert fills mixed 50% to surface, brighter icon rungs (Toast icons too); text ink kept (4.5:1).
- Avatar count centred on the circle edge; Calendar 36 / 32 cells, 12/16 numbers, `fixedWeeks` off.
- Nav from ChatGPT / Notion captures (`captures/nav/`): items default ink, labels 12/16 muted, 12
  between groups. Open: Menu's label still 14/20.
- Spinner 1s, track = arc ink 25%, reduced motion slows; Skeleton text keeps its line box, 4
  corners. Survey: `docs/research/skeleton-spinner-code-slider-survey.md`.
- Eight Complete families moved to In review (status file). Headless screenshots:
  `scratchpad/shot.mjs` pattern (Edge + CDP). Relay for Chrome captures: postMessage page on 3199.
- Claude in Chrome round 2: 37 captures (Figma split tools, sliders, design-panel rows, library
  swatches, divider; ChatGPT code block, textarea, stacked field, mode radio cards, colour field;
  Notion link preview). Not found in the owner's pages: inline code, a badge group; skeleton and
  spinner only appear while loading.
- **Approval batches** (`APPROVAL_BATCHES`, 21 batches of 2-3): phases audit → visual pass →
  Chrome side by side → owner approval; gallery leads with the current batch, officially complete
  at the bottom. Batch 1 (Toolbar, Split button, Segmented) is Ready for approval.
- Round 3: one size per gallery tile (7 families split; rule in AGENTS.md); Split button menus
  placed by `useAnchoredPosition` (were CSS anchor, misplaced); toolbar separator lighter
  (`border-decorative`). Batch 2 side by side done: Nav, Menu (labels now 12/16, back to review)
  ready; Tree view officially complete (approved earlier, unchanged). Batches 1-2 await approval.
- Round 4: Nav titles from ChatGPT (14/20 500 muted; Menu keeps 12/16), Nav recipe tile
  "sidebar in context"; batch 3 side by side (Alert vs Notion callout, Toast vs Notion toast).
  Ready for approval: Toolbar, Split button, Segmented, Nav, Menu, Alert, Toast.
- Toolbar: track group removed (Segmented in the toolbar, joins its roving); Figma tools are
  icon-only ghost SplitButtons (no drawn divider, 1px gap). `toolbar-context.ts` makes composite
  controls roving items inside a Toolbar.

## Merge and audit round (2026-09-27, branch `claude/component-variants-audit-fc1ee4`)

- Committed this branch's work and merged `origin/main` (22 commits: inspector and Figma
  properties panel, product components, Dialog/Popover/Menu/Toast/Button passes). Main's passes
  won their conflicts; Card, overlay behavior (`trigger` on Popover/Menu/Tooltip) and the fixes
  stayed on top. Not pushed.
- After the merge: Alert takes Toast's inset (40 tall, controls 6 from the corner); Chip's
  remove is a concentric circle 4 inside the pill; Slider hover keeps the rail; the large and
  interactive Table tiles lost a doubled wrapper; CommandPalette and Combobox no longer scroll
  the page on mount (the gallery jumped ~35,000px on load). Pass reviews for Card, Table, Chip,
  Alert and Slider are in `apps/docs/src/demos/reviews.tsx` (remove once the owner has seen them).

## Next

1. Owner: review the 20 In-review families in the grouped gallery and confirm completion in
   `apps/docs/src/component-status.mjs`. Slider, Separator and Panel (Complete) changed after the
   owner accepted them.
2. Owner: two candidates the evidence raised but that were not started: a borderless (ghost)
   Select trigger (Notion, Figma), and Card as a link with hover actions (Notion, Figma).
3. Product dark themes need the owner's go-ahead; then recapture the changed families dark.
4. Owner: review Calendar and the ColorPicker pass; decide whether ColorField adopts the
   picker's surface-gap divider.
5. Next gap after overlay behavior (audit order): custom Select listbox, then Combobox.
6. Owner: confirm the size model (scale 12–20px, recommended) and the 12px glyphs in
   Badge and NumberField (`docs/specs/icons.md`, fifth pass).
7. Icons: batch 4 (alignment) per `docs/specs/icons.md`; replace the remaining Fluent
   families and move Area's marks to 1.125px at the same time.
8. Compact density: 20–24px avatars, 24/28px rows (see the audit's Kept table).
## Tree view passes 2–3 (2026-09-25, in review)

Chevron plate 20px; row `actions` slot (`data-pinned`); chevron, icon and label on shared
columns (6px gaps, 22px indent); current-row marker removed; variant pass (Variants table,
Disabled row tile, full API). Open: Figma layers capture, layer-type glyphs and a lock icon,
screen-reader check of row actions. Spec: `docs/specs/tree-view.md`.

## Button pass 1 (2026-09-25, in review; reopened from Complete)

Labels 400 (solid 500), 6px icon gap at md/lg, no shadow; neutral ghost hovers with the
`bg-hover` wash, outline and tone ghosts one rung stronger; neutral soft keeps its stroke and
hovers with the wash plus a translucent border (≈235 / 224); Trailing icon tile added. 58 reference captures in
`docs/research/captures/button/`; spec `docs/specs/button.md`.

## SplitButton (new) and ButtonGroup pass (2026-09-26, in review)

Survey of 15 systems: standalone in Fluent, Material 3, Carbon, Atlassian; composition in
Primer, shadcn, Polaris, Mantine, Chakra; never a Button variant. SplitButton is standalone:
two Buttons, trigger width = height − 4 (Notion 24 at 28), full-height divider (solid: label
ink 24%; soft/outline: control line), Menu in a native popover anchored 4px under the end
edge; arrow keys, Escape and focus return verified. ButtonGroup divider is now full height
in `edge-control`. Specs: `split-button.md`, `button-group.md`. Unverified: dark, screen
reader, RTL divider. ButtonGroup has nine variant tiles.

Small controls (default density sm, 28px) now use 14/20 (owner delegated); captions that
borrowed the sm token use the caption role (text-xs), so they did not change.

## Menu pass (2026-09-26, in review; reopened from Complete)

Label column 36 (gap 12 via `inset.css`), hover/keyboard focus share the `bg-hover` wash,
danger keeps red text with a neutral hover, shortcuts in the UI font, Notion's two-layer lift,
and Menu now handles arrows/Home/End/typeahead (SplitButton reuses it). Divider 4 / 1 / 4
(Notion). `MenuItem checked` makes a checkable row (trailing check, or `indicator="switch"`
drawn display-only via `.area-switch__track[data-checked]`). Spec `menu.md`.
Open: submenu keys, a general menu trigger (overlay work).

## Popover pass (2026-09-26, in review; reopened from Complete)

Menu's lift, 320 preferred width, 16 section gaps; new `trigger` prop anchors a native
popover (4px, `side`, flips), moves focus in on open and back to the trigger on close.
Pass 2: description lives in the header (6 under the title), close on the title line with its
icon on the 12 inset, title cap 12 from the top; ladder 12 / 16 / 8 / 6. Spec `popover.md`.
Pass 3: close box 6/6 in the corner (half the inset, concentric radius), title centred on it
(cap 15), title strong (500). Open: same-size titles (Alert, Toast, Card) still regular.
Open: dark theme, arrow when the popover shifts, Dialog's title gap (8) vs Popover's (15). Capture route that works: the built-in browser
returns results in full; Claude in Chrome blocks encoded output, so logged-in captures were
saved as one JSON download per product (owner-approved) and split with a scratch script.

## Next

0. **Next icon session opens with the review sheets (owner, 2026-09-29):** send the six sheets in
   `docs/research/icon-review/2026-09-29/` (re-render first if sources changed; commands and the open
   decisions are in its README): the redrawn batch 44–60 icons, the bot agent cast (Agent, Builder,
   Researcher, Scholar, Guard A/B, Lead, Designer, Generator, Automator), six sunglasses, six goggles.
1. **Icons, 2026-09-29 (branch `claude/icon-refinements-stroke-7751a3`):** the owner's
   notes on batches 44–60 are drawn: 22 icons (spec "Owner round, batches 44–60"), all in review.
   Second pass the same day (stacks, bug-off legs, brain folds, VR, step-over). Open: the agent mark
   (Exploration sheet: bot in sunglasses with a fedora or a headset, infinity, the current hexagon),
   whether gallery's stack faces lower right like folders and files, and the rejected
   icons the owner has not commented on again (blocks, bandage, person-chat, binoculars,
   waypoints, toy-brick).
   Earlier (2026-09-28): the owner rejected the last refinement round (vault, blocks, clapperboard filled, check-check, bandage, case-upper and case-sensitive A, folders, bug-off, person-chat, binoculars, brain, waypoints, toy-brick, dumbbell, debug step-over, VR goggles, chef hat, chess rook): redo them, and show the owner candidates before settling. The 18 undrawn concepts have a decision sheet (spec "Refinement round" and the owner's pending answer; recommendations: draw plug-off, binary, cost tiers, chat-dashed, folder-dashed, goal, radar, broom, satellite; use existing for chat-question, file-diff, deck-chair, head-thinking; drop braces-dot, compass-check, bug-play, brain-thinking, file-pdf).
   Owner review on `gallery-icons.html` (In review lists what's open): the detail round (2026-09-28: lint floors relaxed, bank, banknote, crown, tree, paw, plane, git, rain, QR and the type family redrawn, overlap cuts evened; spec "Owner round: detail"); then build-queue batches 44–51 and 53–56 (the owner confirmed the system choices; the owner round after them redrew the agent family as Fluent's agents shape, chat-sparkle, search-off, square-list, dollar, id-card, newspaper, plane (side view), translate, text-size, banknote, bank, award, captions, variable, qr-code and boolean-exclude: spec "Owner round: decisions, agents, Fluent likeness"); then batches 57–60 (queue remainder, AI and people, leisure, debugger); still undrawn (need a new idea or the owner): chat-question, file-diff, plug-off, braces-dot, compass-check, bug-play, binary, cost tiers, chat-dashed, folder-dashed, goal, radar, broom, brain-thinking, deck-chair, satellite, head-thinking, file-pdf; batches 32–42 (the full-set roadmap, part 2 in `docs/specs/icons.md`: demo gaps, Figma tools 2 with the boolean operations as solid results, code and git, media, documents/money/awards, people, nature, type, keys; open: the booleans and contrast are solid exceptions in the outline style, filled tree reads as a club); batch 31 (weather, shapes and money: cloud rain and cloud lightning on cloud-download's open cloud, wind, star off, QR code on grid's squares, rectangle, ellipse, coins); batch 30 (nature and tools); the list family (bullet, numbered, checklist share rows 5, 8, 11); filled lines beside solids keep the icon weight; mark placement is set by the shape; batches 27–29 (AI and chat, Figma tools, commerce; open: unpin's cut); batch 26 (checkbox, checklist, bookmark remove, filter add, top panel, pushpin, palette); batches 24–25 (lists and sorting; view and tools; clear filters and the 1's sharp flag approved; the 2 and percent (Geist's 54° slash) revised; mark placement is set by the shape; filled lines beside solids keep the icon weight); batch 23 (call,
   reply/forward, sync, eraser, text align, indent/outdent, columns/rows, container remove);
   the negative-space round (graduation cap, bell, bell off, clipboard, car, watch: gaps on
   the outline's lines); batch 22; keyboard and repeat; batches 18–21.
   Rules: skill (Shared parts, Families, Filled variants: negative space on the outline's
   lines, only where fill is on both sides) and the spec's last sections; the lint checks
   dot sizes, the shared slash on `-off` icons and knockouts that never enter a solid.
   Batch 43 redrew thirteen dropped icons with one simplification each (skill: Fitting a dense
   idea at 16px). Process tools (2026-09-28): `icons:find` (does it exist?), `icons:geometry`
   (fillet, cut, behind, lobes, transform, gap), `gen-pilot-icons.mjs --only a,b` (a second,
   not a minute; near misses name the distance to fix), `icons:sheet compare out.png batch-NN`
   (beside Fluent), `icons:batch batch.json` (records a batch everywhere). The build queue from
   the owner's Cursor references is `docs/research/icon-inventory.md`.
   The drawing roadmap is done; what remains is the swap below. New rules this round: every
   cloud is the one shape (weather clouds moved up, rain hangs from the foot, the bolt crosses it
   with a filled-only `halo`); qr-code's `data-gap="aligned"`. Batch sheets:
   `icon-sheet.mjs filled out.png <icons…>`.
   The lint doesn't measure gaps within one path (paperclip's were solved by hand).
   `npm run typecheck` fails while the dev server rebuilds `packages/react/dist` (TS7016 on
   `@area/react`); rerun once the rebuild settles. Review filled variants with
   `node apps/docs/scripts/icon-sheet.mjs filled out.png`.
2. Icons: auto-position needs a new concept. Then swap the demo-level Fluent imports for
   Area icons, one family at a time with the owner's approval, and retire the Fluent map.
3. Components happen on branch `components`, in its own worktree session.
4. A stroke and type baseline across Cursor, ChatGPT, Notion and Figma (needs the owner's
   go-ahead for product dark themes).

## Verification (2026-09-27)

These pass:
- 19,491 token tests (contrast gate unchanged);
- 114 React tests, including `tone.test.mjs` and the new `cohesion.test.mjs`;
- typecheck, docs build and audit, manifest parity, token-reference check;
- 14 contracts, 4 preview tests, consumer check, capture checksums, `git diff --check`.

Unverified: cross-engine, screen reader, forced colors (execution), product dark themes, and
the third-pass changes in dark mode.

The docs build can fail with "Could not resolve @area/styles/manifest" while `npm run dev`
is rebuilding the styles package; rerun it.

About 284MB of ignored leftovers under `archive/` (old source caches and logs) remain on
disk; delete them manually if wanted.

## Dialog pass (2026-09-26, in review)

Close is a 32px ghost Button 8/8 in the corner (shadcn, Primer 8/8; ChatGPT 12/12), icon on
the 16 inset, title centred on it; title baseline to description cap 15 (Popover's rule);
Menu/Popover lift; scrim 13% black (ChatGPT) without blur; `trigger` opens a native modal
(verified: focus, Escape, scrim click, focus return). Spec `dialog.md`. Open: dialog title
type (references 14–16 at 500–600 vs Area 20/28 regular), dark scrim, AlertDialog.
Chrome capture route: downloads need "allow multiple downloads" per site (chatgpt.com now allowed).

## Type and radius pass (2026-09-26)

Every surface title strong: 14/20 compact (Popover, Panel, Alert, Toast), 16/24 standalone
(Card, Dialog; Dialog was 20/28). Descriptions 14/20 muted (Popover was 14/18). Role table in
typography.md. Dialog corner 16 = close radius + offset (concentric); radius audit in
dialog.md (Alert, Code block, Input, ColorSwatchPicker flagged, not changed).

## Toast pass (2026-09-26, in review)

Popover's numbers: 12 inset, icon 12/12, 40 tall with or without controls, last control 6/6
(concentric with the 12 corner), shared lift (Notion uses the same), strong title, muted
description (`area-toast__description`, manifest element added). Spec `toast.md`. Open: an
inverse (dark) toast like Notion's.

## NumberField pass (2026-09-26, in review)

Figma model: `scrub` takes the field's letter or icon (grip only for `true`), whole square is
the target; unit sits after the number (`field-sizing: content`), hidden beside Mixed/empty;
inspector demo is soft with X/Y/W/H handles. Spec `number-field.md`. Screenshot route for the
owner: `scratchpad/shot.mjs` (headless Edge + CDP, element PNG) then SendUserFile.

## NumberField pass 2 + Inspector (2026-09-26, in review)

Steppers are minus/plus nested 24px squares (press-and-hold repeat, out of tab order); no
resting shadow on Input, NumberField, InputGroup, Textarea, Checkbox, Radio (as Button).
New: PanelRow (two columns + trailing square), PanelSection `actions`, ButtonGroup
`fullWidth`, NumberField `grouping`; Figma Design panel recipe (`GalleryPanelFigma`). Specs
`number-field.md`, `inspector.md`. Panel is marked complete but gained these pieces; the owner
should re-review it.

## PropertyList (2026-09-26, in review)

New component (`PropertyList`, `PropertyListItem`, `property-list.css`, manifest `propertyList`,
docs page `property-list`): value + consumer buttons per row; handle in the panel inset (new
`grip` glyph); pointer drag with drop line, keyboard ArrowUp/Down/Home/End with focus kept and
a live announcement. Figma recipe's Fill section uses it. Verified with real events in
headless Edge (`scratchpad/plist.mjs`). Open: 8px small-panel inset is tight for the handle.

## Collapsible sections (2026-09-26, in review)

`PanelSection` `collapsible` / `open` / `defaultOpen` / `onOpenChange` / `summary`: h3 > button
disclosure, chevron in the inset on hover, summary while collapsed, heading-only sections
centred. Figma recipe sections collapse; Selection colors and Export added. Tests in
`dialog.test.mjs`; interaction verified in headless Edge. Dev server was stopped by the app
once; restart with preview_start "dev".

## BoxField (2026-09-26, in review)

New component (`BoxField`, `box-field.css`, manifest `boxField`, docs page `box-field`, spec
`box-field.md`): padding (horizontal/vertical, split per side) and corner radius (one field,
split per corner) on the PanelRow grid with a pressed toggle in the trailing square. Five new
package glyphs (corner, corners, padding-side, padding-axis, sides; rotation for directions).
Figma recipe: padding in Layout; Independent corners opens a Popover with the four corners.
NumberField Escape now only claims the key during an edit. Figma's split layouts are
unmeasured (owner asked whether panels may be opened).

## Variant audit (2026-09-26)

Report-only audits of every in-review family plus Panel ran; findings are in the session
report (missing size/state tiles, no specs for the color family, alignment picker, toolbar
and input group, disabled dimming, Menu selected state). Nothing from them is fixed yet.

## Approvals, Composer radius, resizable Panel (2026-09-26)

Owner: every built component without requested changes is approved — all former In review
families moved to COMPLETE (specs marked accepted). Composer: option B — the send action is an
Area Button (8 radius) and the shell corner is concentric (button radius + 8 = 16; `submitPill`
makes both pill); resting shadow removed. Panel `resizable` ("start" | "end", width /
defaultWidth / onWidthChange / minWidth 240 / maxWidth 500): window-splitter separator with
Figma's 8px handle (6 out, 2 in), cursor-only hover, directional cursor at limits, 4px focus
pill; captures in `captures/resizable/`; spec `resizable-panel.md`. Panel is back In review.
Variant-audit findings (ButtonGroup selected/hover bugs, InputGroup icon boxes, missing tiles,
unspecced color family/toolbar/input group) are not fixed yet.

## Panel audit (2026-09-26, in review)

Bar action on the action column (Figma 208), lg rows and a bar that follows the tier, PanelRow
tiles at matching control sizes plus xs/md/lg/flush/bare-bar tiles, named panels are regions,
`PanelSection headingLevel`, docs API/examples, Property list rows 28. Details in
`inspector.md` "Audit". COMPONENTS.md gained a product-specific inventory (ChatGPT, Notion,
Figma); Combobox is the recommended next foundation.

## Product-specific inventory, in order (2026-09-26, owner: "do each of them subsequently")

Gallery now sorts by RECENT_COMPONENTS first (newest leads). Built and in review, each with a
spec, captures where a target product had one, React test and real-event test script:
Combobox (Figma font size / font picker), CommandPalette (Notion search, 600 wide, 77 from
top), ContextMenu (Notion page menu at the pointer), HoverCard (700/300 ms, GitHub timing).
Package glyph `search` added (pilot circle redrawn as arcs). Next in COMPONENTS.md order:
ChatGPT conversation pieces (Message, MessageActions, ThinkingDisclosure, SourceChip,
AttachmentCard, PromptSuggestions, ModelPicker, ScrollToLatest, VoiceInput), then Notion,
Figma and shared groups. Chrome note: the ChatGPT tab sometimes hangs; screenshot scale can
differ between frames, so click by accessible name, not coordinates.

## List pass, suggestions choice, ChatGPT pieces (2026-09-26)

- One list model for Menu, Combobox, Command palette, Context menu (4 inset, 32 rows 2 apart,
  radius 8, corner 12, Menu label rows, icon gap 12); the palette's search icon, rows, labels
  and footer hints share one column. Footer items are keyboard hints, not controls.
- Prompt suggestions: owner delegated the choice; list is the default (radius 16 = composer,
  rows 2 apart), `layout="chips"` for narrow places.
- Built from ChatGPT captures (Chrome in front): Message + MessageActions, ScrollToLatest,
  ModelPicker (Menu gained `MenuItem.description`, two-line rows 48). Captures in
  `captures/{message,scroll-to-latest,model-picker,prompt-suggestions}`.
- Remaining ChatGPT pieces: ThinkingDisclosure, SourceChip, AttachmentCard, VoiceInput — need a
  chat that shows them and Chrome in front (hidden tabs stall timers; ChatGPT does not render
  turns while hidden). The user bubble's blue is the owner's accent setting, not ChatGPT's default.

## Badge md text (2026-09-27)

Owner: md badges read too large on Card; md text is now 12/16 (was 14/20) at 20px, weight
500; lg keeps 14/20. Gallery audit: all 120 md badges render 20px and no demo passes a stale
size or inline size override. Open: the 12px label hangs 0.7px below a 14/20 line (spec).

## Audit of post-audit families (2026-09-27)

Owner: "work on any components that have not been audited yet." The twelve families that
reached main after the cohesion audit were checked against its rules and fixed: see
`docs/research/cohesion-audit.md`, "Fourth pass". Biggest find: a later literal shadow drew the
shared lift's second layer at full strength on Menu, Popover, Dialog, Toast and the palette; the
cohesion test now checks the painted `box-shadow`. Seven owner questions are listed there.
Complete families touched: Box field, Button, Property list, Composer, Split button, and the
lift on Menu/Popover/Dialog/Toast. Status in `component-status.mjs` unchanged.

## Toolbar redesign and Pass reviews (2026-09-27)

- Toolbar redesigned from Figma's toolbelt (7 Claude in Chrome captures) and the owner's three
  reference shots: 8 inset, Figma's bar shadow, 8 spacing, command-height separators, a raised
  plate for pressed toggles (dark: `bg-component-active`), `ToolbarGroup variant="track"`
  (Figma's mode switch), selects hug their options. Tiles Tools, Content / text formatting,
  Behavior / overflow. Back In review. Spec `toolbar.md`.
- Every family now opens with a Pass review: audit, visual pass and Claude in Chrome evidence
  read from the repo, the default tile at 2x (inert copy). Validated needs an entry in
  `apps/docs/src/pass-status.mjs`; only Toolbar has one. Process doc and both skills updated.
- Chrome notes: the gallery uses smooth scrolling, so scroll with `behavior: "instant"`; the
  gallery tab can freeze the extension, so move captures out with the 127.0.0.1 relay.
- Open: Segmented's selected shadow vs the toolbar plate; a 24px-icon "tools" size (Figma).
- Hydration (#418) fixed: GalleryPanelFlush / BareBar were exported by both gallery.tsx and
  gallery-variants.tsx (server rendered one, client hydrated the other; registry.tsx now throws
  on a duplicate demo name), and HoverCard demos sat in a <p> the HTML parser split. A fresh
  gallery load logs no #418; the two remaining 404s are the Avatar fallback demo's missing image.

## Card consistency pass (2026-09-27, in review)

One geometry rule: text inset = inset + (control − cap) / 2 with the first line trimmed to the
cap and the last to the baseline, so a title is as far from the top as from the side (18.3 at
md); header and footer controls sit on the inset, concentric. One type ramp (title 16/24, body
14/20, value 32/40) at every size; size is corner and inset only. Media inset everywhere but
bleed (immersive too), 16:9 by default. Templates: video, music, weather, stat, plan, feature,
all md (news and tool removed); tiles size-md, horizontal-stacked, horizontal-bleed removed.
Carousel rebuilt (reaches the inset, 3.25 items, header paging; demo `GalleryCardCarousel`,
hydrated; only Gallery/Badge/Switch/Slider demo names render with hydration markers, see
`render.mjs`). Spec `card.md`. Unverified: smooth paging (browser windows were in the
background), Firefox and Safari.
