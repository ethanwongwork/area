# Governance

How the library grows without becoming bloated, inconsistent or misaligned. Read it before
adding a component, a variant, a prop or a setting. The `area-component-intake` skill
applies it.

Area wants breadth. Each addition must still:

- earn its place;
- reuse what exists;
- speak the shared vocabulary;
- stay as easy to remove as it was to add.

Adding is cheap when agents do the building, but every addition costs review, states,
keyboard behaviour, documentation and every future system-wide pass.

## 1. Decide what kind of change it is

Work down this ladder and stop at the first rung that meets the need. Write the answer,
and why each rung above it failed, in the proposal.

| # | Answer | When | Area example |
|---|---|---|---|
| 1 | **Nothing new** | An existing component already does the job. Point to it and its usage. | Icon-only Button covers "icon button"; there is no second implementation |
| 2 | **A setting** | The difference applies to every component at once (colour, size, shape, stroke, depth, motion). | Density, Radius, Elevation are settings; no component has a `compact` variant |
| 3 | **A composition** | Existing components arranged together solve it, with no new API. Ship it as a gallery tile or template. | Inspector rows are Panel + PanelRow + NumberField |
| 4 | **Content or a slot** | The component needs to hold something new (icon, count, action, description). Add a slot or children, not a `show*` flag. | Nav `trailing`, Card parts |
| 5 | **A value on an existing axis** | A new treatment, tone, size or layout that the axis already names. | Alert `layout="banner"`, not a Banner component |
| 6 | **A new axis or boolean** | An independent dimension that combines with every other axis. | Count `pill` |
| 7 | **A new component** | A distinct job with its own anatomy, behaviour or semantics (gates below). | Count is not a Badge; Toggletip is not a Tooltip |
| — | **App-only** | Only the app needs it, and it is layout rather than a component. Use app classes, never an `.area-*` override. If a component falls short, fix the component or record a gap in [Product UI](PRODUCT_UI.md#open-component-gaps). | The Canvas grid |

When the evidence is thin, the answer is **gather more evidence**, not "build it anyway".
Record the candidate in [Components](COMPONENTS.md#candidates) with what is missing. The
Action tile waits for captures in two more products.

## 2. Gates for a new component

A new component needs all five, written in its spec's Job and boundaries:

1. **Useful.** Name its real uses: where ChatGPT, Notion, Figma or Cursor use it, or at
   least two design systems that ship it for the same job.
2. **Unique.** Name the nearest existing component and why it cannot do the job. Count
   independent jobs and behaviours, not silhouettes. Badge labels and Chip is chosen;
   Select is native and Combobox filters; Table displays and DataGrid edits.
3. **Composable.** It is built from the shared tokens, roles and parts. It reuses peers'
   slots (Button for actions, Menu for lists, Popover for floating, Input's shell for
   fields) instead of redrawing them.
4. **Consistent.** It paints shared roles the shared way and lines up with its peers
   ([Principles](PRINCIPLES.md#3-one-role-one-paint)).
5. **Worth maintaining.** Its states, keyboard contract, documentation and tests are in
   scope from the start. Partial behaviour is written down, never implied.

And one precondition: **the owner asked for it.** Agents do not start components the owner
has not requested; they propose them as candidates.

## 3. Gates for a variant, prop or setting option

- **A real use.** A target product or a source shows it, and one line justifies it in the
  spec's Variants table. Catalogue names alone are not a reason.
- **On the right axis.** It belongs to exactly one axis (below), and every combination with
  the other axes is valid. An illegal combination means the axis should split, or the value
  belongs on another axis.
- **Not a setting in disguise.** If it would apply to every component, it is a setting.
  Light/dark, density, type size and contrast are never variants.
- **Visible and removable.** It gets one gallery tile. Removing it later must not break any
  other variant.
- **Settings are numbers or names with one effect each** ([Principles](PRINCIPLES.md#7-settings-not-looks)).
  Never package several settings into a named look. Never cut an existing option to
  simplify; make its effect visible instead.

## 4. One vocabulary

The same concept has the same name everywhere. Before naming anything, check the manifest
for the word.

**Axes** (`packages/styles/src/manifest.ts`; React props use the same names):

| Axis | Means | Values in use |
|---|---|---|
| `variant` | Visual treatment (emphasis) | `solid`, `soft`, `outline`, `ghost`, `plain`, `surface` |
| `tone` | Semantic meaning | `neutral`, `info`, `success`, `warning`, `caution`, `danger`, `discovery`, `inverse` |
| `size` | Scale tier | `sm`, `md`, `lg` (default `md`) |
| `orientation` | Direction | `horizontal`, `vertical` |
| `layout` | Arrangement of the parts | per component |
| `kind` | Interaction role | per component |
| `side` | Which edge it attaches to | `top`, `right`, `bottom`, `left` (logical `start` / `end` for drawers) |
| `status` | A process outcome shown by an item | per component (`uploading`, `complete`, `error`) |

**Booleans** are adjectives for the non-default state (`fullWidth`, `iconOnly`, `flush`,
`pill`). CSS modifiers are kebab-case, React props camelCase.

**Behaviour API:**

- a value is `value` / `defaultValue` / `onValueChange(value, event)`;
- on/off is `checked` or `selected`;
- an overlay is `open` / `defaultOpen` / `onOpenChange`;
- a close is `onDismiss` / `dismissLabel`;
- pending is `loading`;
- a collection is `items`;
- glyph slots are `icon` / `trailingIcon`.

Full rules are in [Design system › CSS, manifest and React](DESIGN_SYSTEM.md#css-manifest-and-react).

**Label colours are not tones.** Hues without meaning (Tag's `pink`, `gray`, `brown`; Folder's palette) are a
documented exception. New ones should use a `color` axis, never extend `tone`.

**Known deviations** (2026-10-19 inventory; fix only when the family is next reopened, with
the owner's agreement):

- `ink` on Link and Citation;
- `color` on Board column;
- `type` on Scroll area;
- camelCase axis names `labelPosition` and `selectionMode`;
- non-treatment `variant` values: Citation `pill | footnote`, Link `inline | standalone`, Titlebar, Kbd `default`;
- `kind` used for form (Indicator `count | dot`);
- `size` without a default (Folder, File page, File tile);
- `size` defaulting to `sm` (Tag, Drawer).

Do not copy a deviation into a new component.

## 5. Keep it lean

- **No aliases for catalogue names.** "Banner", "Sheet" and "SpinButton" are research
  inputs, not exports. An alias exists only to keep a renamed API working.
- **No `show*` / `hide*` booleans.** Optional parts are slots or children.
- **No single-layer style props** (padding, radius, colour on one part). Expose a
  component token or a slot instead.
- **Tokens.**
  - A component-private value (`--_*`) becomes a component token only when consumers need
    to theme it.
  - It becomes a semantic role only when about three components share the job.
  - No alias exists just to hide an unexplained literal.
- **Sizes.**
  - `sm` needs a real compact composition; `lg` a prominent or touch use.
  - Never `xs` or `xl` just because the token ramp has them.
  - Product-wide compactness is the Density setting.
- **Delete what nothing uses.** Parked tokens are listed in [Theming](THEMING.md#parked-tokens);
  deprecated APIs below.

## 6. Lifecycle

A status is a checklist, not a feeling. The registry,
`apps/desktop/src/content/component-status.mjs`, is the only record of status. Specs and
docs never restate it.

| Status | Means | Entry checklist |
|---|---|---|
| **Candidate** | Proposed, not built | Listed in [Components › Candidates](COMPONENTS.md#candidates) with its intake answer and missing evidence |
| **In review** | Built, waiting for the owner | Spec with job, variants, sources, anatomy, decisions, states, behaviour. CSS, manifest, React, demos with one tile per variant, Documentation entry. Checks pass. Shown on a review page |
| **Complete** | Owner accepted | The owner said so; the slug is in `COMPLETE_COMPONENTS` with the round or batch |
| **Reopened** | A refinement touched a Complete family | Moves back to In review until the owner accepts the change. A pass that only confirms keeps Complete |
| **Deprecated** | Replaced, still exported | A named replacement, `@deprecated` JSDoc pointing to it, and an entry below. It stays exported so existing markup renders |
| **Removed** | Gone | Owner approval, and no use left in the app, demos or tests |

**Deprecated now:**

- Token, replaced by `<Code swatch>`;
- MenuSearch, replaced by a Combobox or a Command palette;
- the `--area-ease-spring` easing, with no replacement.

Renamed props keep a deprecated alias for one release, for example `options` → `items`,
`onRemove` / `onClose` → `onDismiss`, and a `label` that named a group → `aria-label`.
`grep -rn "@deprecated" packages` lists every alias.

## 7. Where each fact lives

One source per fact; everything else links to it. Restating a fact in a second place is how
docs drift.

| Fact | Source of truth |
|---|---|
| Status (complete, in review) | `apps/desktop/src/content/component-status.mjs` |
| Variants, elements, states, defaults | `packages/styles/src/manifest.ts` |
| Props and their descriptions | React source and its JSDoc |
| Exact values | Component CSS and `packages/tokens/src` |
| A component's evidence, decisions and history | `docs/specs/<slug>.md` |
| A component's usage (when to use, do and don't, parts, keys, ARIA) | `apps/desktop/src/content/documentation.mjs` (rendered on the family's Documentation tab) |
| Tiles and their order | `apps/desktop/src/content/specimens.mjs` |
| System-wide rules | `docs/DESIGN_SYSTEM.md`, `THEMING.md`, `CONTRAST.md`, `MOTION.md` |
| Why the system looks this way | `docs/PRINCIPLES.md` |
| How the app's own UI behaves | `docs/PRODUCT_UI.md` |

**Specs keep their current state current.** Variants, Anatomy, Decisions, States and
Behavior describe the component as it is now. Edit them in place in the same change as the
code. Owner decisions, the Feedback log and Review notes are history: append to them,
newest last. A reader should never have to replay the log to learn what the component does.

**A lesson that applies beyond one component** goes into the system doc or skill it
belongs to, replacing what it supersedes, in the same change.

## 8. Review and sessions

- **One session at a time.** Before starting, check `origin/main` and open pull requests,
  so two sessions never build the same thing. Each session works in its own worktree and
  merges through a pull request when the owner authorizes it.
- **Review rounds.**
  - Changes reach the owner as a review artifact: each family with a plain
    "What changed / Why", and changed variants shown Before / After side by side.
  - The owner's verdicts on the page are the record, whatever a chat summary says.
  - Unapplied verdicts are open work.
- **Judge in the app.** Relaunch Electron from the worktree you changed, then look in light
  and dark at the app's scale and at the extremes of the settings the change touches.
