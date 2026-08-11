# Build prompt — `Composer` component

Build the `Composer` component end-to-end in this design system. You are the build agent — read this whole document before touching any file, then execute every section.

---

## 0. Before you write a single line

**Read these in order.** Each one is required context; skipping any of them produces drift.

1. **`.cursor/rules/design-system-spec.mdc`** — the system spec, end-to-end. Pay special attention to:
   - Part 1 (Philosophy, Standing Orders, **Standing Rule #12 — math-first / no magic numbers**, **§1.4 Parameterizability contract**)
   - Part 2 (token architecture — spacing ramp §2.1, **radius ramp §2.1.1**, **nested radius §2.1.2 with the inverse rule `outer = inner_radius + inset`**, control scale §2.3, **CSS variable naming §2.5**)
   - Part 3 (semantic tokens §3.1, hover by surface §3.2, **stroke logic §3.5 — pick the job before the token**)
   - Part 4 (mandatory state order §4.1, **two-layer focus halo §4.2**, motion tokens §4.3, **foreground stable on hover §4.3.1**, disabled families §4.5, **stroke profile invariant §4.5.1**, elevation §4.6, z-layers §4.7)
   - Part 5 (type ramp §5.1.1, icon sizing §5.2, **§5.3 icon reference + §5.3.1 Phosphor Regular invariant**)
   - **Part 6.1 optical padding (Case A hard-edged vs Case B text), §6.1.2 per-edge override with `:has()`, §6.1.3 universal icon-wrapper pattern, §6.5 layout-gap rule**
   - Part 7 (anatomy §7.1, demo layout §7.1.1, naming §7.2, **placeholder copy §7.3** — important, your demos MUST follow this)
   - **§9.27 InputGroup — the chrome-shed reference**: this is the canonical `!important`-driven chrome-shed pattern Composer reuses. Read §9.27 fully, including §9.27.1 (join-vs-separate). Composer is a different role (layout primitive with built-in send, not a joined-field) but uses the same chrome-shed mechanic.
   - Part 10 (registration checklist)
   - Part 14 (a11y baseline)

2. **Working templates in `index.html`** (read these BEFORE coding):
   - **`function inputGroupEl(opts)` at line ~4562** + **`.ds-input-group` CSS at line ~808** — chrome-shed reference. Composer's CSS reuses the same shape of `!important` overrides on every state selector of every inner control (textarea, Button, Select).
   - **`function cardEl(opts)` at line ~5684** + **`function renderCard()` at line ~5749** + **`.ds-card` CSS at line ~1256** — the closest "layout primitive with multiple regions" template. Composer borrows Card's region-stacking pattern (textarea region on top, button-row region on the bottom for `double` layout) and Card's "outer = inner-radius + padding" radius derivation.
   - **`function toastEl(opts)` at ~5457** + **`function renderToast()` at ~5524** — reference for "compact contained surface with inline action cluster + dropdown + primary button at the right." Composer's trailing cluster math (close button at XS, primary at XS, optional Select between) mirrors Toast's `inlineActions` + close pattern.

3. **Phosphor icon constants** are around lines 1630–1660 in `index.html`. You'll need at minimum `ICON_PLUS` (or `ICON_CIRCLE` per Standing Rule #8 for the universal neutral placeholder) for the leading slot demos, `ICON_GEAR`/`ICON_IMAGE` for trailing demos, and an arrow-up glyph for the send button (use `ICON_CHEVUP` — the caret-up; the system already ships it. If a more send-shaped glyph is needed in the future, add a new `ICON_ARROW_UP` constant per §5.3, but `ICON_CHEVUP` is the right Phosphor-Regular default today).

**Do not start writing CSS or JS until you have read §9.27 and looked at `inputGroupEl` and `cardEl` in the file.** The single biggest source of drift in this codebase is "I built it from memory instead of looking at the template."

---

## 1. Component identity

| Property | Value |
|---|---|
| **Name** | `Composer` (PascalCase per §7.2). What Claude actually calls the chat-input surface. |
| **Role** | AI-chat-style message composer — a contained surface holding a multi-line `textarea` (or single-line `input` in the compact variant) + a leading-actions cluster + a trailing-actions cluster + an optional model-picker `Select` + a canonical send `Button`. **Layout primitive**, like `Card` / `Dialog` / `Toast`. Owns chrome + a built-in send affordance + cluster slots. |
| **Distinct from** | `Input` / `Textarea` (bare form fields; Composer wraps a textarea inside its own chrome and adds slots). `InputGroup` (a joined-field chrome primitive; Composer is a multi-region message-composer, not a joined-field row). `Card` (a generic surface primitive; Composer ships built-in chat affordances). |
| **Cross-system equivalents** | Claude Composer, ChatGPT Composer, Cursor agent composer, Vercel AI SDK `PromptInput`, OpenAI Playground prompt-input, shadcn-community `ChatInput`. The 2-row form factor is universal across these — there is no debate about anatomy; this build is about getting the system's tokens and patterns right on a familiar shape. |
| **CSS prefix** | `--cmp-` (per §2.5 "Component → Short → Example" naming). BEM root: `.ds-composer`. |
| **Single canonical size** | Yes. Like `Dialog` / `Toast` / `Banner` / `Card`, Composer is **not** a height-tiered control. Its inner controls are tier-aligned (textarea is `body/m`, buttons are `XS`, optional dropdown is `Select S`), but the Composer surface itself ships at one size. No `--xs` / `--l` modifiers — if a future need for a denser or roomier Composer surfaces, that's a separate component (e.g., `ComposerMini`), not a size variant. |

---

## 2. API contract

```js
composerEl({
  layout: "single" | "double",      // default: "double"
  placeholder: "Plan, Build, / for commands, @ for context",
  value: "",                         // textarea value (uncontrolled — consumer wires real state)

  leading: [ ButtonProps, ... ],     // 0–3 controls in the leading cluster (left side)
                                     // Each item is { variant, fill, icon, ariaLabel, ... } passed to btnB() or similar.
                                     // Typical: a plus/attach button, a context-add button.

  trailing: [ ButtonProps, ... ],    // 0–3 controls in the trailing cluster (right side, BEFORE dropdown + primary)
                                     // Typical: voice / dictation toggle, settings shortcut.

  dropdown: { value, items, ... } | null,
                                     // Optional Select slot, sits immediately left of `primary`.
                                     // When present, renders as a real Select S with chrome shed to ghost-neutral
                                     // (transparent bg + transparent border at rest; hover gets action/hover overlay).
                                     // Use case: model picker ("Sonnet 4.6 ▾").

  primary: { icon, ariaLabel, fill, ... },
                                     // Canonical send button. Defaults to Button XS solid-brand icon-only with
                                     // ICON_CHEVUP and aria-label="Send". Always rightmost in the trailing area.

  disabled: false,                   // whole composer disabled
  focused: false,                    // demo-only force focus state (renders with .is-focused class)
  error: false,                      // demo-only force error state (renders with .is-error class)
})
```

**Slot semantics (per design decision)**: `leading` and `trailing` are **clusters** — each accepts up to 3 controls. `dropdown` and `primary` are named slots inside the trailing area, rendered after the `trailing` cluster array, in fixed order `[...trailing, dropdown?, primary]`. The naming distinguishes "things the host product can put here freely" (cluster arrays) from "system-canonical slots" (dropdown + primary) so a consumer can't accidentally remove or reorder the send button.

**Why `dropdown` is a `Select`, not a `Dropdown`**: it picks a value (the model). Per §9.3 vs §9.7, value-pickers use `Select`; action menus use `Dropdown`. Claude's "Sonnet 4.6 ▾" is a value-picker — picking a different option changes the persisted setting, it doesn't fire an action.

**What `composerEl` returns**: an HTML string (matching every other `*El` helper in the codebase). The consumer wires the actual textarea state, send handler, etc.; the helper produces the chrome.

---

## 3. Token decisions (every value traces to a ramp or formula per §1.4)

These are **locked**. Do not deviate without writing a §1.4.5-style sanctioned-exception entry in the spec.

| Property | Token / formula | Justification (rule citation) |
|---|---|---|
| **Outer radius** | `var(--radius-l, 20px)` | §2.1.2 inverse rule: `outer = inner_radius + inset = radius-xs (8) + space-m (12) = 20`. Inner corner-adjacent elements are Button XS (`radius-xs` 8). Composer joins Card and Dialog in the `radius-l` (20) tier as a peer "primary container surface," differentiated by role (Card = inline content, Dialog = modal, Composer = chat input). |
| **Outer padding** | `var(--space-m, 12px)` | Matches Card (`--cd-pad`) and Dialog (`--dlg-px`) — the "primary container surface" padding tier. §6.1.1 says compact-but-comfortable contained surfaces sit at 12/16; 12 here matches Card's "decisive and proportional" stance and produces the clean `8 + 12 = 20` outer-radius derivation. |
| **Inner row gap** (textarea ↔ button row, `double` layout) | `var(--space-s, 8px)` | 3:2 padding:gap ratio matching Dialog's 12/8 hierarchy step (§9.6). Padding owns outer chrome; gap owns internal section rhythm. Equal padding:gap would flatten the hierarchy. |
| **Cluster gap** (button ↔ button inside one cluster) | `var(--space-2xs, 4px)` | "Tight cluster" tier from §6.5 — toolbar of icon-only buttons. The four buttons inside a `trailing` cluster + the dropdown + the primary are all peers in one functional group. |
| **Cross-cluster spacing** (leading cluster ↔ trailing area in the bottom row of `double` layout) | `justify-content: space-between` on the bottom-row flex container — no gap token | The two clusters anchor opposite edges of the composer's content area. Same pattern as Card's `--footer--split` (§9.13). |
| **Stroke job** | Job A — affordance (§3.5). 1px `var(--color-border-default)` at rest. | Composer is interactive (the textarea is the primary affordance); the outer border IS the affordance. Escalates to `var(--color-border-hover)` on hover (when not focused/error/disabled) and `var(--color-border-focus)` + 2-layer halo on `:focus-within` per §4.2. |
| **Background** | `var(--color-surface-default)` | Standard "this is an editable surface" fill. Future cream / branded variants are theme overrides of `--color-surface-default`, NOT a built-in `tone` axis on Composer — per §3.5 customizability tier. |
| **Textarea inside** | `body/m` (14/20 mono) per §2.3 + §5.1.1. **Chrome-shed** via §9.27 pattern: `border-color: transparent`, `background: transparent`, `border-radius: 0`, `box-shadow: none`, every state selector overridden with `!important`. | Composer's outer chrome is authoritative; the textarea must not paint its own. This is exactly the InputGroup pattern (§9.27 CSS block at index.html ~line 808). |
| **Inner buttons** | Real `Button XS` (24-tall, `radius-xs` 8) | Matches Toast's `inlineActions` and Dialog's close — the system-wide "compact inline action" tier. §9.8 (Toast) and §9.6 (Dialog) both standardized on XS for the same role. |
| **Optional model dropdown** | Real `Select S` (28-tall, `radius-xs` 8) with chrome shed to ghost-neutral via descendant selectors. | Slightly taller than the XS buttons so the dropdown reads as a labeled value-picker peer to the primary CTA, not as a third icon-only button. Visually echoes Claude's "Sonnet 4.6 ▾" pattern; semantically a value-picker per §9.3. |
| **Primary send button** | Real `Button XS solid-brand icon-only` by default. Glyph: `ICON_CHEVUP`. `aria-label="Send"`. | The system-wide "rightmost button in a footer row is `solid-brand`" convention used by Dialog footer / Toast footer / Banner action row / Card footer. |
| **Disabled fill** | `var(--color-surface-sunken)` per §4.5 fillable-interior pattern | Composer has a fillable interior (the textarea region); disabled state IS the fill change. Plus `var(--color-border-disabled)` border, 0.6 opacity on inner controls, `pointer-events: none`. |
| **Transition** | `border-color .15s ease, box-shadow .15s ease, background .15s ease` | Standard §4.3 default-state transition. Honor `prefers-reduced-motion: reduce` via global override (do NOT add `!important`). |
| **Z-layer** | None — Composer lives in document flow at `--z-base` (0). It does NOT float. | If a consumer wants to anchor it as an overlay (e.g., a Drawer-pinned input), that's the consumer's wrapper. |

**Derived value check (§1.4.4):** every numeric value above is either a base ramp token (Pattern 1) or a `calc()` composing base tokens (Pattern 2). No magic numbers anywhere. If you find yourself wanting one, stop — either reach into the existing ramps (more likely than you'd think) or document a §1.4.5 exception with rationale.

---

## 4. Two layout variants (the only non-derived axis)

Composer ships exactly **two layouts**. No third hybrid; if a consumer needs something different, they compose `Card` or build a custom shell.

### 4.1 `layout: "double"` (default)

The canonical Claude / ChatGPT 2-row form. Multi-line textarea on top, button row on the bottom.

```
┌─ Composer ───────────────────────────────────────────────────────────┐
│ (pad space-m / 12px on all sides)                                    │
│                                                                      │
│ [textarea — chrome-shed, body/m 14/20 mono, multi-line]              │
│                                                                      │
│ (--cmp-gap space-s / 8px between rows)                               │
│                                                                      │
│ ┌───────────────────────────────┬──────────────────────────────────┐ │
│ │ leading cluster               │ trailing + dropdown + primary    │ │
│ │ [btn] [btn] [btn]             │ [btn] [btn] [Select S] [primary] │ │
│ │ ← justify-content: flex-start │ → justify-content: flex-end      │ │
│ │ ← gap space-2xs / 4px         │ ← gap space-2xs / 4px            │ │
│ └───────────────────────────────┴──────────────────────────────────┘ │
│   ↑ bottom row: justify-content: space-between                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Textarea sizing in `double`:**
- `min-height`: enough room for ~2 lines = `calc(2 * 20px) = 40px` content height. Implementation: `min-height: var(--space-3xl, 40px)` — `space-3xl` is on the spacing ramp at 40 and reads correctly as "minimum input height tier."
- `max-height`: ~6 lines = `calc(6 * 20px) = 120px`. Implementation: `max-height: var(--space-7xl, 120px)` IF that ramp step exists, otherwise add it. Actually safer: use `max-height: 120px` with a sanctioned `§1.4.5` exception ("multi-line textarea grow ceiling, derived from `6 × line-height(20) = 120`"). Document it in your spec entry.
- `overflow-y: auto` once content exceeds max-height.
- **Auto-grow**: rely on modern CSS `field-sizing: content` on the textarea (Chrome / Safari 18.2+). Falls back gracefully — older browsers see a fixed 2-line textarea, still functional. Do NOT add JavaScript to auto-grow.
- `resize: none` — the user resizes by typing, not by dragging.

### 4.2 `layout: "single"`

The canonical ChatGPT-mini / inline composer form. Single-row, fixed-height surface.

```
┌─ Composer ──────────────────────────────────────────────────────────────────────┐
│ pad space-m │ [leading cluster] gap-s │ input/textarea (single-line, body/m mono) │ gap-s [trailing] [Select S] [primary] │ pad space-m │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Container height derivation:** outer padding `space-m` (12) × 2 + inner content `control-xs` (24, the primary button's height) = **48** = `control-xl`. Pattern-2 calc per §1.4.4. No new token needed.

**Inner input in `single`:**
- Render an `<input type="text">` (NOT a textarea — single-line semantics).
- `body/m` (14/20) mono, chrome-shed (same `!important` block as the double layout, just applied to `input` instead of `textarea`).
- `flex: 1 1 0; min-width: 0` so the input absorbs the row's slack while the clusters hug their content.
- Inter-element gap in the row: `var(--space-s, 8px)` between leading cluster ↔ input ↔ trailing cluster (text-to-controls spacing — the "form-row gap" §6.5 tier). Within each cluster (and between trailing buttons + dropdown + primary), keep `space-2xs` (4) — the tight-cluster tier.

**Why `space-s` (8) between input and clusters but `space-2xs` (4) within a cluster:** the input is a content surface (textbox); the clusters are toolbar-style affordances. Crossing from "text I'm editing" to "buttons that act on it" needs more breathing room than between two adjacent buttons. Same logic Toast / Banner use between body text and the actions cluster (§9.8).

---

## 5. State matrix (mandatory order per §4.1)

All states are owned by the **outer** `.ds-composer` surface. Inner controls (textarea, Button, Select) have their own state CSS shed via the §9.27 `!important` overrides — they must not paint borders, backgrounds, or halos.

| State | Selector | Treatment |
|---|---|---|
| Default | `.ds-composer` | `border: 1px solid var(--color-border-default)` + `background: var(--color-surface-default)` |
| Hover | `.ds-composer:hover:not(:focus-within):not(.is-focused):not(.is-error):not(.is-disabled)` | `border-color: var(--color-border-hover)` |
| Focus-within | `.ds-composer:focus-within, .ds-composer.is-focused` | `border-color: var(--color-border-focus)` + `box-shadow: 0 0 0 2px color-mix(in oklch, var(--color-border-focus) 30%, transparent)` per §4.2 |
| Error | `.ds-composer.is-error` | `border-color: var(--color-feedback-danger-border)` + `background: var(--color-feedback-danger-bg)`. On `:focus-within`, halo swaps to `var(--color-border-danger)` at 30% opacity (same pattern as Input). |
| Disabled | `.ds-composer.is-disabled` | `background: var(--color-surface-sunken)` + `border-color: var(--color-border-disabled)`. Inner controls get 0.6 opacity and `pointer-events: none`. Cursor: `not-allowed`. |

**Stroke profile invariant (§4.5.1):** Composer's stroke is decided at rest (1px Job A affordance) and never changes profile through state — only color shifts. Hover doesn't add a second border; focus-within doesn't add a second border; the halo lives in `box-shadow`. This is non-negotiable.

**Foreground stability (§4.3.1):** placeholder, value, button glyphs, dropdown chevron — none of these change color on `.ds-composer:hover`. Only `border-color` and (in error/disabled) `background` change.

---

## 6. CSS spec

Insert the Composer CSS block **after `.ds-card`** (around line ~1256 in `index.html`) and before whichever component comes next. The placement rule: CSS blocks in `index.html` follow the order components are demoed; Composer is a layout primitive next to Card.

```css
/* ── Composer — layout primitive for AI-chat-style message input ──
   Anatomy: contained surface holding a chrome-shed textarea/input + leading cluster +
   trailing cluster + optional model-picker Select + canonical send Button. Single
   canonical size (like Card / Dialog / Toast / Banner). Two layouts: "double" (default,
   2-row Claude form) and "single" (1-row ChatGPT-mini form).

   Token derivations (§1.4.4 Pattern 1 + Pattern 2 only — no magic numbers):
   - Outer radius radius-l (20) = inner Button XS radius-xs (8) + outer pad space-m (12)
     per §2.1.2 inverse rule (outer = inner_radius + inset).
   - "single" container height: pad space-m (12) × 2 + Button XS (24) = 48 = control-xl.
*/
.ds-composer{
  --cmp-rd:var(--radius-l,20px);
  --cmp-pad:var(--space-m,12px);
  --cmp-gap:var(--space-s,8px);
  --cmp-cluster-gap:var(--space-2xs,4px);
  --cmp-row-gap:var(--space-s,8px);
  --cmp-bg:var(--color-surface-default);
  --cmp-br:var(--color-border-default);
  --cmp-fs:var(--body-m-fs,14px);
  --cmp-lh:var(--body-m-lh,20px);
  box-sizing:border-box;
  position:relative;
  width:100%;
  display:flex;
  flex-direction:column;
  gap:var(--cmp-gap);
  padding:var(--cmp-pad);
  background:var(--cmp-bg);
  border:1px solid var(--cmp-br);
  border-radius:var(--cmp-rd);
  transition:border-color .15s ease, box-shadow .15s ease, background .15s ease;
}

/* ── Layouts ── */
.ds-composer--single{
  flex-direction:row;
  align-items:center;
  gap:var(--cmp-row-gap);
}
.ds-composer--double .ds-composer__row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:var(--cmp-cluster-gap);
}

/* ── Field region (textarea in "double", input in "single") ── */
.ds-composer__field{
  flex:1 1 auto;
  min-width:0;
  display:flex;
  align-items:stretch;
}
.ds-composer__textarea,
.ds-composer__input{
  flex:1 1 0;
  min-width:0;
  font-family:var(--font, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size:var(--cmp-fs);
  line-height:var(--cmp-lh);
  color:var(--color-text-primary);
  background:transparent;
  border:0;
  outline:0;
  padding:0;
  margin:0;
  resize:none;
  /* Auto-grow on supported browsers (Chrome / Safari 18.2+); older browsers see the
     min-height floor and the user gets a scroll within max-height. */
  field-sizing:content;
}
.ds-composer__textarea::placeholder,
.ds-composer__input::placeholder{ color:var(--color-text-placeholder); }
.ds-composer--double .ds-composer__textarea{
  min-height:calc(2 * var(--cmp-lh));   /* 2 lines × 20 = 40 */
  max-height:calc(6 * var(--cmp-lh));   /* 6 lines × 20 = 120 — derived, no magic number */
  overflow-y:auto;
}
.ds-composer--single .ds-composer__input{
  height:var(--control-xs, 24px);       /* single-line, height = Button XS so the row reads as one band */
}

/* ── Clusters ── */
.ds-composer__cluster{
  display:flex;
  align-items:center;
  gap:var(--cmp-cluster-gap);
  flex:0 0 auto;
}
.ds-composer__cluster--leading{ justify-content:flex-start; }
.ds-composer__cluster--trailing{ justify-content:flex-end; }

/* ── Outer state matrix (§4.1 mandatory order) ── */
.ds-composer:hover:not(:focus-within):not(.is-focused):not(.is-error):not(.is-disabled){
  border-color:var(--color-border-hover);
}
.ds-composer:focus-within,
.ds-composer.is-focused{
  border-color:var(--color-border-focus);
  box-shadow:0 0 0 2px color-mix(in oklch, var(--color-border-focus) 30%, transparent);
}
.ds-composer.is-error{
  border-color:var(--color-feedback-danger-border);
  background:var(--color-feedback-danger-bg);
}
.ds-composer.is-error:focus-within,
.ds-composer.is-error.is-focused{
  border-color:var(--color-border-danger);
  box-shadow:0 0 0 2px color-mix(in oklch, var(--color-border-danger) 30%, transparent);
}
.ds-composer.is-disabled{
  background:var(--color-surface-sunken);
  border-color:var(--color-border-disabled);
  cursor:not-allowed;
}
.ds-composer.is-disabled .ds-composer__textarea,
.ds-composer.is-disabled .ds-composer__input,
.ds-composer.is-disabled .ds-btn,
.ds-composer.is-disabled .ds-select{
  opacity:.6;
  pointer-events:none;
}

/* ── Chrome-shed for inner Button — §9.27 InputGroup pattern, applied across every state ──
   Composer's outer chrome is authoritative; inner controls must not paint their own
   borders / backgrounds / focus halos. !important is the right tool here per §9.27
   ("expresses 'parent authoritatively governs this child's chrome'"), not a hack.
*/
.ds-composer .ds-btn,
.ds-composer .ds-btn:hover,
.ds-composer .ds-btn:focus-visible,
.ds-composer .ds-btn.is-focused,
.ds-composer .ds-btn:active{
  box-shadow:none !important;       /* the only thing we shed from Button — Button's own bg/border/halo carry
                                       its identity (solid-brand primary, soft-neutral chip, ghost-neutral icon),
                                       only the focus halo needs to go since the Composer's halo replaces it */
}

/* ── Chrome-shed for inner Select (model dropdown) — full chrome strip to ghost-neutral ──
   The Select reads as a labeled value-picker peer to the primary button. The trigger
   becomes a transparent, label+chevron-only affordance with action/hover overlay on
   hover. Panel chrome (the dropdown panel) is NOT shed — it's an anchored overlay that
   lives outside the Composer surface per §9.3.
*/
.ds-composer .ds-select,
.ds-composer .ds-select:hover,
.ds-composer .ds-select:focus-visible,
.ds-composer .ds-select.is-focused,
.ds-composer .ds-select.is-open{
  background:transparent !important;
  border-color:transparent !important;
  box-shadow:none !important;
}
.ds-composer .ds-select:hover:not(.is-disabled){
  background:var(--color-action-hover) !important;
}

/* ── Per-edge optical inset (§6.1.2) ──
   Composer doesn't need :has() overrides on its own outer padding (the inner clusters
   own the inset to the corners), but the field region needs to vertically align with
   the cluster row in "single" layout. Already handled by align-items:center + matching
   heights (input 24 = Button XS 24); no override needed.
*/
```

**Audit your CSS against §1.4.4 before moving on.** Every `Npx` literal in the CSS above is either inside a `var(--token, fallback)` Pattern-1 fallback (sanctioned) or inside a `calc()` composing base tokens (Pattern 2). The two literal-but-semantic Pattern-3 values are `border-width: 1` (the universal 1px stroke) and `flex: 1 1 0`. There are no Pattern-4 magic numbers. If you add any during the build, document them in §1.4.5 in the spec or rework them to be derived.

---

## 7. Render-function spec

Insert `composerEl()` after `cardEl()` (around line ~5747 in `index.html`) and `renderComposer()` after `renderCard()`.

### 7.1 `composerEl(opts)` — helper signature

```js
function composerEl(opts) {
  opts = opts || {};
  var layout = opts.layout === "single" ? "single" : "double";
  var cls = "ds-composer ds-composer--" + layout;
  if (opts.disabled) cls += " is-disabled";
  if (opts.focused) cls += " is-focused";
  if (opts.error) cls += " is-error";

  var leadingHtml = ""; // build from opts.leading (array of ButtonProps); each renders via btnB(...)
  var trailingBtns = ""; // build from opts.trailing
  var dropdownHtml = opts.dropdown ? selectEl({ size: "s", chromeShed: false, ...opts.dropdown }) : "";
  // The Select renders with size "s" and its own chrome; the .ds-composer .ds-select
  // descendant CSS rules shed the trigger chrome. The panel chrome (anchored overlay)
  // stays intact.
  var primaryHtml = btnB(
    (opts.primary && opts.primary.fill) || "solid-brand",
    "xs",
    (opts.primary && opts.primary.icon) || ICON_CHEVUP,
    null,                                          // icon-only
    { ariaLabel: (opts.primary && opts.primary.ariaLabel) || "Send", iconOnly: true }
  );

  // Compose the trailing area in fixed order: trailing cluster → dropdown → primary
  var trailingArea =
    '<div class="ds-composer__cluster ds-composer__cluster--trailing">'
      + trailingBtns
      + dropdownHtml
      + primaryHtml
    + '</div>';

  var leadingArea =
    '<div class="ds-composer__cluster ds-composer__cluster--leading">' + leadingHtml + '</div>';

  var fieldHtml;
  if (layout === "single") {
    fieldHtml = '<input type="text" class="ds-composer__input" placeholder="'
      + escAttr(opts.placeholder || "")
      + '" value="' + escAttr(opts.value || "") + '" aria-label="Message"'
      + (opts.disabled ? " disabled" : "")
      + '>';
    // Single-row: leading | field | trailing
    return '<div class="' + cls + '">'
      + leadingArea
      + '<div class="ds-composer__field">' + fieldHtml + '</div>'
      + trailingArea
      + '</div>';
  }

  // Double-row: field on top, [leading-cluster | trailing-area] below
  fieldHtml = '<textarea class="ds-composer__textarea" placeholder="'
    + escAttr(opts.placeholder || "")
    + '" aria-label="Message"'
    + (opts.disabled ? " disabled" : "")
    + '>' + esc(opts.value || "") + '</textarea>';
  return '<div class="' + cls + '">'
    + '<div class="ds-composer__field">' + fieldHtml + '</div>'
    + '<div class="ds-composer__row">'
      + leadingArea
      + trailingArea
    + '</div>'
    + '</div>';
}
```

**Helper details:**
- Resolve the actual `btnB(...)` signature and the actual `selectEl(...)` signature against what's already in `index.html`. The skeleton above is illustrative; match the codebase exactly. In particular:
  - `btnB` is used by Toast/Card footer demos — read those call sites at lines ~5780 (Card actionRow) and the Toast inline-actions block to see how an icon-only XS Button is built.
  - `selectEl` exposes `size`, `value`, `items`, etc. — its signature is at `function selectEl(opts)`; find it via `grep -n "^function selectEl" index.html`.
- The `chromeShed: false` argument in the `selectEl({ chromeShed: false, ... })` call is illustrative — if `selectEl` doesn't have that knob today, just don't pass it (the Composer's descendant CSS does the shedding without any API change on the Select side). This is exactly the §9.27 pattern: the parent owns the chrome via descendant selectors with `!important`; the child needs no new API.
- The `iconOnly: true` flag on the primary button — check whether `btnB` accepts a structured options object or a separate icon-only variant; mirror Toast's close button construction.

### 7.2 `renderComposer()` — documentation function

Follow the §7.1 / Part 7 anatomy: `<h2 class="h-group">` + 1-sentence description (per §7.4) → Default → States → Layouts → Variants. Use `compFrame(html, code)` for previews. Use `variantBlock(id, title, preview, code)` for variant blocks (same shape Card / Dialog / Toast use).

**Required variants** (each in its own `<h4 class="h-item">` block):

1. **Default** — `layout: "double"`, leading cluster with 2 `ICON_CIRCLE` `Button XS ghost-neutral` placeholders (per §7.3 universal placeholder rule), no trailing cluster, a `Select S` dropdown showing `"Model"`, and the default primary send button. `placeholder="Plan, Build, / for commands, @ for context"` — this is the only realistic-copy placeholder in the demos, sanctioned because the placeholder text IS what the Composer is demoing (per §7.3 "realistic copy is the subject" exception).
2. **Single row** — `layout: "single"`, otherwise identical to Default.
3. **States** — render Default + Hover + Focused + Error + Disabled as 5 stacked variants in one preview. Wrap them in the canonical inline-styled `flex column with gap: var(--space-2xl, 32px)` + a sensible width (560px is a reasonable Composer demo width — wider than the 220 field-state stack because a Composer's bottom row needs room) per §7.1.1.
4. **With dropdown** — Default + an active dropdown showing `"Sonnet 4.6"` selected. Demonstrates the model-picker pattern.
5. **No dropdown** — Default without the dropdown slot. Shows the trailing cluster collapsing gracefully.
6. **No leading** — Default with an empty leading cluster. Demonstrates that the bottom row's `justify-content: space-between` still works (trailing area pushes to the right edge with the leading cluster empty).

**Placeholder copy for buttons (§7.3):** every leading / trailing button slot in demos uses `ICON_CIRCLE` (universal placeholder). The primary button uses `ICON_CHEVUP` because the primary IS the send affordance, and the glyph carries the action — same logic as Toast's close button using `ICON_XMARK` over `ICON_CIRCLE`. The dropdown's items use generic `"Option 1"` / `"Option 2"` / `"Option 3"` per §7.3, EXCEPT for the "With dropdown" variant where the demo's subject is explicitly the model picker — there, use `"Sonnet 4.6"`, `"Opus 4.6"`, `"Haiku 4"` (sanctioned realistic copy: the realistic model names are the demo's subject).

**Description copy (§7.4):** 1 sentence, complete subject+verb, no em dashes / semicolons. Example: "Composer is a layout primitive for AI-chat-style message input with leading and trailing action clusters and a built-in send button."

---

## 8. Registration checklist (Part 10)

Each step has a specific line range in `index.html`. Audit your changes against these locations.

1. **CSS** — Insert after `.ds-card` block (around line ~1256). Block ends at the `}` closing `.ds-card.is-disabled` or the last `.ds-card--*` selector — search for the next un-related CSS block and insert before it. Keep the comment header explaining token derivations.
2. **JS element helper** — Insert `composerEl(opts)` after `function cardEl(opts)` at ~5684 (so right after Card's helper, before `renderCard()`).
3. **JS render function** — Insert `renderComposer()` after `renderCard()` at ~5749. End of `renderCard` is around line 7700ish — find the closing `}` and insert after it.
4. **Page assembly** — Add `+ renderComposer()` to `function mount()` at ~line 7702. Find the chain of `+ render*()` calls and insert Composer **after `renderCard()`** to match the NAV order.
5. **NAV array** — Insert a new top-level NAV node for Composer between `Card` (line ~2465) and `Drop Zone` (line ~2475). Use the same shape as the existing entries — `{id:"comp-composer", label:"Composer", href:"#comp-composer", open:false, children:[ ... ]}` with children for each variant section (e.g., `comp-composer-states`, `comp-composer-single`, `comp-composer-dropdown`, etc.). Match the labels to your `<h4 class="h-item" id="...">` IDs exactly.
6. **sectionIds array** — Add every new section ID you create (the parent `comp-composer` plus each child variant ID). Find the `sectionIds` array via `grep -n "var sectionIds" index.html` and follow the existing pattern.

### Confirm via grep before committing

```
grep -n "comp-composer" index.html        # should appear in: NAV array (multiple), sectionIds, every <h4 id> and <h2 id> you added
grep -n "renderComposer" index.html       # should appear: function definition + mount() call
grep -n "composerEl" index.html           # should appear: function definition + every demo call site
grep -n "ds-composer" index.html          # should appear: CSS block + every demo HTML
```

If any of those greps come back empty when they shouldn't, you've missed a registration step.

---

## 9. Quality checklist

Run through every box. Boxes marked **(Composer-specific)** are added on top of the universal Part 10 checklist.

### 9.1 Universal (Part 10)

- [ ] All CSS uses semantic tokens (no raw hex, no `--t1`/`--t2`/`--ctn-*`).
- [ ] All spacing on the global ramp.
- [ ] All radius values on the radius ramp.
- [ ] Any rounded-inside-rounded pair satisfies §2.1.2 (`inner = outer − inset`).
- [ ] All `font-size`/`line-height` pairs reference the type ramp tiers.
- [ ] All `box-shadow` recipes for elevation use `--shadow-{1,2,3,4}` tokens (Composer has none today).
- [ ] All `z-index` values use `--z-*` tokens (Composer is at `--z-base`).
- [ ] Hover excludes `:focus-within` and `.is-focused`.
- [ ] Hover uses real tokens (no `brightness()`).
- [ ] Focus uses two-layer translucent halo.
- [ ] All states: default, hover, focus, disabled (+ error).
- [ ] Transitions use `.15s ease` or named motion tokens; never `transition: all`.
- [ ] Placeholder copy follows convention (§7.3).
- [ ] Icons use verified Phosphor names from §5.3 (Regular weight, `ICON_*` constants only).
- [ ] Optical padding via `:has()` where applicable (Composer doesn't need it — its inner clusters own the inset).
- [ ] Registered in NAV and sectionIds.
- [ ] Field wrapper compatible (Composer is itself a contained surface; a `ds-field` wrapper around it for a `Label / Caption` is a valid composition).
- [ ] A11y baseline applied (textarea `aria-label`, icon-only buttons `aria-label`, dropdown `aria-haspopup="listbox"`).

### 9.2 Composer-specific

- [ ] **Chrome-shed selectors cover every state of every inner control.** Each of these selector chains must include the `!important` shed: `.ds-composer .ds-btn`, `.ds-composer .ds-btn:hover`, `.ds-composer .ds-btn:focus-visible`, `.ds-composer .ds-btn.is-focused`, `.ds-composer .ds-btn:active`. Same for `.ds-select` (rest / hover / focus-visible / is-focused / is-open). Missing one selector → user sees the inner halo bleed through on that state.
- [ ] **`:focus-within` halo is present and replaces inner focus halos.** When the textarea is focused, the user must see the Composer's brand halo, NOT the textarea's own halo. If you see two halos stacked, the inner shed is incomplete.
- [ ] **Concentric-corner math annotated in the CSS comment.** The block-leading comment in `.ds-composer` MUST show `radius-l (20) = radius-xs (8) + space-m (12)` so the next person reading the code can verify the derivation without opening the spec.
- [ ] **`double` layout: textarea min-height = 2 lines, max-height = 6 lines, both derived from `--cmp-lh`.** Not raw `40px` / `120px` literals (those are Pattern-4 magic numbers per §1.4.4).
- [ ] **`single` layout: container height = `space-m × 2 + control-xs = 48 = control-xl`.** No raw `48px` literal.
- [ ] **Slot order in trailing area is fixed: `[...trailing, dropdown?, primary]`.** Verify in `composerEl` source. Consumers must not be able to reorder.
- [ ] **Disabled state uses `--color-surface-sunken`** per §4.5 fillable-interior rule, not opacity or `--color-surface-subtle`.
- [ ] **Error state on `:focus-within` swaps halo color to danger** — verify by adding both `.is-error` and `.is-focused` in the demo and seeing the red halo.
- [ ] **`field-sizing: content` is used** (not JS auto-grow). Document the graceful fallback in the spec entry.
- [ ] **`prefers-reduced-motion`** — Composer adds no animation that bypasses the global override. No `!important` on any transition.
- [ ] **Cross-system identity holds**: side-by-side, your Composer's anatomy reads as Claude/ChatGPT/Cursor at a glance. If a teammate looking at the demo doesn't recognize it as an AI-chat-style input, something is off — usually the field looks too short (relax min-height) or the primary button isn't decisively at the right edge.

---

## 10. Spec text to add to `.cursor/rules/design-system-spec.mdc`

The spec file is the source of truth. After the build is functional, add three things:

### 10.1 New `§9.NN Composer` section

Insert between `§9.27 InputGroup` and the start of Part 10 — Composer is the next layout primitive after InputGroup. Pick the next available section number (likely **§9.28**). Use the same structure as other §9.x sections (anatomy, sizes, states, slots, a11y, keyboard, variants, industry alignment table).

Skeleton:

```markdown
### 9.28 Composer — AI-chat-style message input layout primitive

Composer is the layout primitive for AI-chat message input — a contained surface holding a chrome-shed textarea (or single-line input), a leading-actions cluster, a trailing-actions cluster, an optional model-picker `Select`, and a canonical send `Button`. **Layout primitive**, not a sized control — single canonical size like `Card` / `Dialog` / `Toast` / `Banner`.

**Cross-system equivalents**:

| System | Component | Layout primitive? |
|---|---|---|
| Claude | Composer | Yes |
| ChatGPT | Composer | Yes |
| Cursor (Agent panel) | Composer | Yes |
| Vercel AI SDK | `PromptInput` | Yes |
| shadcn community | `ChatInput` | Yes |

**Distinct from**:
- `Input` / `Textarea` — bare form fields. Composer wraps a textarea inside its own chrome and adds cluster slots.
- `InputGroup` (§9.27) — joined-field chrome primitive. Composer's chrome-shed mechanic is the same `!important` pattern, but Composer is a multi-region message-composer, not a horizontally-joined field row.
- `Card` (§9.13) — generic surface primitive. Composer ships built-in send affordance + leading/trailing button slots + an optional dropdown slot in fixed order.

**Token decisions (every value derived per §1.4):**
- Outer radius `radius-l` (20) = `radius-xs` (8 — inner Button XS) + `space-m` (12 — outer pad) per §2.1.2 inverse rule. Composer joins Card and Dialog at `radius-l` as a peer "primary container surface."
- Outer padding `space-m` (12), matching Card / Dialog.
- Inner row gap `space-s` (8) — 3:2 padding:gap ratio matching Dialog (§9.6).
- Cluster gap `space-2xs` (4) — tight-cluster tier per §6.5.
- `double` layout textarea: `min-height: 2 × --cmp-lh = 40`, `max-height: 6 × --cmp-lh = 120`, both derived from line-height.
- `single` layout container height: `--space-m × 2 + --control-xs = 48 = --control-xl` (Pattern-2 calc, no new token).
- Stroke job: A — affordance (§3.5). 1px `border/default` rest → `border/hover` → `border/focus` + 2-layer halo on `:focus-within`.

**Chrome-shed pattern (§9.27 mechanic):** inner `Button` and `Select` controls shed their own backgrounds / borders / halos via descendant selectors with `!important` so the Composer's outer chrome is authoritative. The shed must cover every state selector — hover, focus-visible, is-focused, is-open, is-error — of every inner control. Incomplete shed → halos leak through on the missed state.

**Auto-grow:** uses `field-sizing: content` on the textarea (Chrome / Safari 18.2+). Older browsers see the fixed 2-line floor and scroll within `max-height`. No JavaScript auto-grow.

**Two layouts (the only non-derived axis):**
- `double` (default) — 2-row Claude/ChatGPT form. Textarea on top, button row below with leading cluster anchored left and trailing area anchored right.
- `single` — 1-row ChatGPT-mini form. `[leading-cluster · input · trailing-cluster · Select · primary]`.

**State matrix (§4.1):** default / hover (excluded when focused/error/disabled) / `:focus-within` / error / disabled — owned by the outer `.ds-composer` surface. Disabled uses `surface/sunken` per §4.5 fillable-interior rule.

**Industry alignment:** Composer's anatomy matches every modern AI-chat input — Claude, ChatGPT, Cursor agent, Vercel AI SDK PromptInput. The 2-row form factor is universal; this component standardizes the design-system tokens for it.

**a11y wiring:**
- Textarea / input: `aria-label="Message"` (or consumer override). Required.
- Primary send button: `aria-label="Send"` per §14.3 (icon-only).
- Each leading/trailing cluster button: `aria-label` describing its action (§14.3).
- Dropdown: `aria-haspopup="listbox"` + `aria-expanded` per §14.2 (inherited from `Select`).
- Composer container has no ARIA role of its own (it's a layout chrome, not a semantic landmark).

**Keyboard contract:**
- Enter submits (consumer-wired); Shift+Enter inserts newline in `double` layout.
- Tab: leading cluster → textarea/input → trailing cluster → dropdown → primary.
- Esc inside the dropdown closes the dropdown panel without losing Composer focus (inherited from `Select`).

**What is NOT shipped (and why):**
- No size ramp — Composer is a layout primitive like Dialog/Toast/Banner/Card. If a future need for a denser composer surfaces, that's `ComposerMini` (separate component), not a size variant.
- No surface-tone variant (cream, branded, etc.) — those are theme overrides of `--color-surface-default` per §3.5 customizability tier, not a built-in `tone` axis on Composer.
- No auto-grow JavaScript — `field-sizing: content` + `max-height` carries it.
- No slash-command popover or @mention picker — those are anchored-overlay patterns layered on top by the consumer (future `Combobox`-anchored patterns), not part of the layout primitive's contract.
```

### 10.2 New row in Part 11 Completed Components table

Add after the `InputGroup` row, before `Color Picker`. Use the same prose-density as adjacent rows (the spec is verbose by design — each row's "key variants" cell carries the rationale).

```markdown
| Composer | `cmp` | Single canonical size (no height tiers; layout primitive like Card / Dialog / Toast / Banner) | default, hover, focus-within, error, disabled | AI-chat-style message input layout primitive — contained surface holding a chrome-shed textarea/input + leading-actions cluster + trailing-actions cluster + optional model-picker `Select` + canonical send `Button`. **Two layouts**: `double` (default, 2-row Claude form — textarea on top, button row below) and `single` (1-row ChatGPT-mini form — leading · input · trailing · dropdown · primary). **Token derivations**: outer `radius-l` (20) DERIVED from `radius-xs` (8 — inner Button XS) + `space-m` (12 — outer pad) per §2.1.2 inverse rule; outer padding `space-m` (12) matching Card / Dialog; inner row gap `space-s` (8) for 3:2 padding-to-gap hierarchy step; cluster gap `space-2xs` (4) for tight-cluster tier per §6.5; `double` textarea `min-height: 2 × --cmp-lh = 40` and `max-height: 6 × --cmp-lh = 120` both derived from line-height; `single` container height = `--space-m × 2 + --control-xs = 48 = --control-xl` (Pattern-2 calc). **Chrome-shed**: inner Button + Select strip their backgrounds / borders / halos via descendant selectors with `!important` across every state — `:hover`, `:focus-visible`, `.is-focused`, `.is-open`, `:active` — so the Composer's outer chrome is authoritative; same mechanic as `InputGroup` (§9.27). **Auto-grow**: `field-sizing: content` on the textarea (Chrome / Safari 18.2+); older browsers see the 2-line floor and scroll within `max-height`. No JavaScript auto-grow. **Stroke job**: A — affordance (§3.5). Rest 1px `border/default` → hover `border/hover` → `:focus-within` `border/focus` + 2-layer halo per §4.2 → error `feedback/danger/border` + `feedback/danger/bg` → disabled `surface/sunken` + `border/disabled` per §4.5 fillable-interior rule. **Slot order in trailing area is fixed**: `[...trailing, dropdown?, primary]` — consumers can't reorder. Primary defaults to `Button XS solid-brand icon-only` with `ICON_CHEVUP` and `aria-label="Send"`. **Industry alignment**: matches Claude / ChatGPT / Cursor agent / Vercel AI SDK `PromptInput` / shadcn-community `ChatInput` — the 2-row form factor is universal across modern AI-chat inputs; this component standardizes the design-system tokens for it. **Cross-system distinction**: distinct from `Input`/`Textarea` (bare form fields), `InputGroup` (joined-field row, §9.27), and `Card` (generic surface primitive, §9.13) — Composer is the only system primitive with built-in send + cluster slots + dropdown slot in a fixed layout. **A11y**: `aria-label="Message"` on textarea, `aria-label="Send"` on primary, cluster button `aria-label`s per §14.3, `aria-haspopup="listbox"` inherited from Select; keyboard contract Enter to submit, Shift+Enter for newline in `double`, Tab cycles leading → textarea → trailing → dropdown → primary. **Variants**: default (`double` with leading + dropdown + primary), single row, states (default / hover / focused / error / disabled), with dropdown, no dropdown, no leading. |
```

### 10.3 Part 12 update

If Composer is mentioned anywhere in Part 12 as a future component (it isn't currently), move it out. Otherwise add a brief note in Part 12's Tier 1 list that Composer was completed and link to §9.28 — keep it parallel to how Tabs/Avatar/Card moved from Part 12 to Part 11.

---

## 11. What is intentionally NOT in scope

Do not build any of these. They're documented here so future iterations don't reopen the design questions.

- **Size ramp.** Composer is a layout primitive (single canonical size), not a sized control. A future "ComposerMini" or "ComposerLarge" is a separate component, not a `--xs` / `--l` modifier on Composer.
- **Cream / Claude-tinted surface variant.** The cream is a theme override of `--color-surface-default`, not a built-in `tone` axis on Composer. Per §3.5 customizability tier, consumers wanting Claude-cream just retoken `--color-surface-default` globally; Composer reflows automatically.
- **JavaScript auto-grow.** `field-sizing: content` is the modern CSS answer; the fallback is graceful (scroll within fixed max-height on older browsers).
- **Slash-command popover.** `/ for commands` is just placeholder text. The actual popover is an anchored-overlay pattern (future `Combobox`-anchored or `Popover`-anchored implementation), layered on top by the consumer, not part of the Composer layout primitive.
- **`@` mention picker.** Same as slash commands — anchored-overlay pattern, layered by consumer.
- **Multi-modal attachment chip rendering.** Image/file thumbnails above the textarea (Claude shows these) are a future Tier-2 addition. The Composer's current `leading` cluster handles the "attach" button; rendering the resulting attachment chips inside the Composer surface is a separate slot decision.
- **Send-on-Enter handler wiring.** Composer ships the chrome and the slots; the consumer wires real state (textarea `onInput`, primary `onClick`, `Enter`-vs-`Shift+Enter` handling). Per system convention, helpers produce HTML; consumers handle behavior.

---

## 12. Order of operations

Follow this sequence. Each step gates the next.

1. Read `.cursor/rules/design-system-spec.mdc` (Parts 1, 2, 3, 4, 5, 6, 7, 9.27, 10, 14).
2. Read `inputGroupEl` (line ~4562), `.ds-input-group` CSS (~808), `cardEl` (~5684), `renderCard` (~5749), `.ds-card` CSS (~1256), and one toast call site (~5780 for `actionRow`).
3. Write the `.ds-composer` CSS block (Section 6 above). Insert at the correct location in `index.html`. Annotate the radius derivation in the leading comment.
4. Write `composerEl(opts)` (Section 7.1 above). Insert after `cardEl`.
5. Write `renderComposer()` (Section 7.2 above) with all 6 required variants. Insert after `renderCard`.
6. Register in `mount()`, NAV array, sectionIds (Section 8 above).
7. Run every grep command in Section 8. Confirm none come back empty.
8. Open the playground in a browser. Click into the textarea — verify the brand halo appears on the Composer surface and NOT on the textarea. Hover the primary button — verify no second halo stacks. Add `.is-error` to the Composer in DevTools — verify the red border + red bg + red halo on focus. Add `.is-disabled` — verify sunken bg + dimmed inner controls.
9. Open `.cursor/rules/design-system-spec.mdc` and add the spec text from Section 10. Pick the next available section number for §9.28.
10. Re-run through the Section 9 quality checklist line by line. Fix anything that fails.
11. Update this prompt's TODO status in your session.

If you find a value you want to set that isn't on a ramp, **stop and re-derive**. Standing Rule #12 is non-negotiable.
