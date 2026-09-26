# Building a component

Every visible value in an Area component comes from a measurement of a real component,
and is then refined so the result looks like it belongs in ChatGPT, Notion and Figma and
beside every other Area component. That covers size, type, icon, layer structure, radius,
padding, gap, margin, stroke, weight, fill and elevation. This guide is the process for
new components and refinements. The owner's current direction overrides it.

**Current phase: visual first.** Get the exact appearance of each component and variant
right, then systematize. Spec values go into CSS as literal values with a `/* spec */`
marker (see [Build](#5-build)). Mapping them to shared tokens is a later, separate phase.

## What a finished component has

1. **A spec sheet:** `docs/specs/<slug>.md`, from [the template](specs/TEMPLATE.md). It holds
   the job, variants, sources, anatomy, measurement tables, decisions with reasons, states,
   peers, visual-pass notes, verification and the owner feedback log.
2. **Capture files:** `docs/research/captures/<slug>/*.json`. Raw measurements from every
   reference and from Area itself, produced by one script so they compare directly.
3. **The implementation:** CSS, `manifest.ts`, React, source-shared demos, one variant per
   gallery tile, and the docs page, all agreeing.
4. **Owner acceptance,** recorded in `apps/docs/src/component-status.mjs`. Until then the
   component is In review, however complete the evidence looks.

## Evidence

Use every kind of evidence that is available for the component. Each answers a different
question, and the most accurate result comes from combining them.

| Evidence | Establishes | How to get it |
|---|---|---|
| **Target product, live DOM**: ChatGPT, Notion, Figma | The rendered result Area wants to match: dimensions, layer structure, type, paint, elevation and states, in context | Claude in Chrome, with the owner's logged-in sessions. Read-only. [Capture protocol](#capture-protocol) |
| **Design system, rendered**: docs sites, Storybooks | What the source code renders, measured the same way as the products | Built-in browser for public pages. Same capture script |
| **Design system, source**: pinned commit | Why it renders that way: DOM, slots, variant API, state mapping, token derivation, keyboard and ARIA behavior | GitHub at a pinned SHA. Clone into the ignored `.cache/sources/<system>@<sha>/` when reading many files |
| **Design kit**: Figma files | Designer intent: variant matrix, auto-layout padding and gap, named styles | Figma in Chrome, Inspect panel, when the owner has access |
| **Official guidance**: usage, anatomy and spec pages | Naming, anatomy, when to use a variant, accessibility requirements | Public docs |
| **Screenshots** | Side-by-side visual comparison only | `zoom` screenshots at a known browser zoom |

Rules:

- **Measure, don't recall.** Every number in a spec cites a capture file or a source line.
  Write no approximate values. If something can't be measured, write "not found" and
  say where you looked.
- **Computed styles are measurements; screenshots are not.** Screenshot pixels depend on
  zoom and device scale, so use them to judge appearance, never to derive a CSS length.
- **A product's DOM is evidence, not a code source.** Record its values. Don't copy its
  CSS, JS, icons or other assets into Area. Adapt code only from sources whose license
  allows it, pinned, with the required notices kept (`THIRD_PARTY_NOTICES.md` and the
  package file lists).
- **A kit can diverge from code.** When a Figma kit and its code disagree, record both
  and say which one the rendered product matches.
- **Untitled UI is the first design-system reference** for structure and visual quality.
  [Design references](DESIGN_REFERENCES.md) lists the other sources and what each is
  good for. Search every target product for an equivalent before deciding it has none.

## Phase 0: the reference baseline

[Baseline](research/BASELINE.md) records how ChatGPT, Notion and Figma build the basic
elements that recur across components: control heights, text roles, icon sizes, radius
steps, stroke and divider paint, fills by state, focus, and elevation. Every spec checks
its values against it. That shared baseline is what keeps components consistent with
each other. Extend it when a component measures a new element, and update it when
products change. Each baseline value cites its captures, like a spec.

## 1. Define the job and variants

- State the component's job and what it is not (for example, Indicator marks status on
  another element; Badge labels content). Name its related Area components: these are
  the peers checked in the visual pass.
- Inventory variants in every reference: each design system's variants, with links, and
  where each target product uses the component. Keep a variant when a target product
  uses it or a source shows a real use case. Write one justification line for each.
- Name variant axes as in [Components](COMPONENTS.md#useful-variants). Record owner
  decisions at the top of the spec; they override sources.

## 2. Capture evidence

For each variant and state, capture every reference that has it. At minimum:

- the primary design system rendered, plus its source at a pinned commit;
- every target product that has an equivalent (or a note of where you looked);
- any other system that is the canonical implementation of the pattern (for example,
  Fluent for presence status).

### Capture protocol

1. **Set up.** 100% browser zoom, window at least 1280px wide, the product's default
   density. Captures record device pixel ratio, zoom and viewport automatically.
2. **Load the script.** In the gallery it is already loaded (`/area-capture.js`). On any
   other page, run the full text of `apps/docs/public/area-capture.js` with the browser
   JavaScript tool; it defines `areaCapture`.
3. **Find the element.** Use a selector, or `await areaCapture.pick()` and click it.
   Shift+Up/Down moves the highlight to the parent/child, Enter selects, Escape cancels.
   Pick the component's outermost box, not the whole row it sits in.
4. **Map slots.** Name the layers with Area's slot vocabulary: `shell`, `content`, `text`,
   `icon`, `action`, `media`, `indicator`, `anchor`, `track`, `thumb`, and so on. The
   `shell` slot is required; the other slot measurements are reported relative to it.
5. **Capture.** `areaCapture.capture(el, { source, variant, state, theme, slots, rules: true })`.
   `rules: true` records declared CSS where the stylesheet is readable, which exposes
   the page's own variables and utility classes.
6. **Save.** Return `JSON.stringify(cap)`: return the string, because browser tools
   re-serialize returned objects with sorted keys. Save it verbatim as
   `docs/research/captures/<slug>/<source>--<variant>--<state>--<theme>.json`. Each capture
   carries a checksum, and the comparison script rejects any file that changed in copying.
7. **Compare.** `node scripts/capture-compare.mjs docs/research/captures/<slug>/*.json`
   prints one table per slot and property with one column per capture. Paste it into
   the spec rather than retyping values.

**States.** Capture rest, then every state the component has: hover (move the real
pointer over it, then capture while it is still hovered), focus-visible (reach it with
Tab), pressed, selected, checked, expanded, disabled, invalid. Never trigger an action
that changes the owner's data in a product: send, delete, share, invite, create,
publish or purchase. Use UI that is already on screen.

**When a product doesn't show the pattern.** Record where you looked. Don't create data to
make it appear (an unread item, a shared page). Ask the owner whether a safe fixture
exists, and use the design-system evidence meanwhile.

**Browser tools.** The Claude in Chrome (Edge) extension truncates long results at about
900 characters, so keep the capture in a page variable and read it back in 800-character
chunks. A page that blocks external scripts needs the script pasted in; check
`areaCapture.fingerprint()` against `node scripts/capture-compare.mjs --fingerprint`. A
background window may not scroll; hide unrelated gallery sections locally instead.

**Themes.** Capture light and dark. Switching a product's theme changes an account
setting, so ask the owner to switch it, or get explicit permission first.

**Privacy.** On any page other than localhost, `redact` is on by default. It removes
text content, ids, labels and data values, and keeps only the URL origin. Pass
`redact: false` only for public docs pages. Before committing a capture, read it and
check that it holds no personal content.

### Read the structure

For each reference, write the layer tree mapped to Area slots. Record which layer owns:

- outer height and width,
- padding and each gap,
- alignment and hit area,
- radius and border,
- paint and elevation.

Note where a source uses absolute positioning, negative margins, transforms or magic
offsets. Adopt a real structural reason; don't adopt a hack. A slot that needs its own
geometry (an icon viewport, a larger hit area, a truncating text wrapper) gets its own
element. A wrapper whose only job is a corrective offset does not.

## 3. Decide spec values

Build the decision table: one row per slot property. Columns hold the references'
values, the chosen Area value, its basis, and a reason when it differs from the basis.
Choose in this order:

1. **Owner decision.**
2. **Target-product agreement.** When two or more of ChatGPT, Notion and Figma agree,
   adopt their value.
3. **The primary product for this context,** as assigned in the baseline: Figma for
   inspector and editing controls, ChatGPT for conversation and composer, Notion for
   content, navigation and lists.
4. **The primary design system** fills anatomy, variants and states the products don't
   show. The rendered result wins over the Figma kit when they disagree.
5. **Consistency.** The same role in a peer component, or in the baseline, keeps the same
   value unless the spec gives a reason.

No value is invented, and every Area cell has a basis.

**Icons.** Use the Fluent cut whose native size matches the measured icon slot. Record
the reference's icon size, stroke weight and ink box for the visual pass. Never scale a
cut to another size or nudge a glyph.

**Translate relative to the owning slot.** When the reference's slot differs in size from
Area's (Figma's 24px icon against Area's 16px), record the position relative to that slot
(the icon corner), not the outer shell. A shell-relative number copied across slot sizes
lands in the wrong place.

**Weight.** Record text stem, icon stroke and any cutout or ring thickness together.
Rasterise the text at 100× to measure its stem (Geist 14px: 1.2px at 400, 1.5px at 500).
Strokes and cutouts should sit within that range; heavier marks read as a different system.

## 4. Slot ownership and insets

A shell owns its outer dimensions, border and shape. A content region owns shared text
layout. A square icon slot owns the icon viewport. An action slot owns its hit area and
its own inset. A text wrapper owns truncation and multiline alignment. Area examples:
InputAction (`area-input__action` → action button → action icon), Input's
affix/control/icon slots, and InputGroupText's visual slot.

Write the inset equation before adding values:

    outer inset = border + shell padding + slot inset

Count the border once. A parent gap separates siblings; it does not replace an edge
inset. Don't double-pad a slot its parent already insets. The capture's
`edge from shell` values show each layer's full inset directly: compare them with the
equation. Follow `packages/styles/src/inset.css`: square native icon viewports,
cap-height text references, first-line alignment for multiline text, and no per-glyph
nudges.

## 5. Build

- **Literal spec values, marked.** Put each measured dimension, type value or shadow in
  a component-private property set by the base rule or the variant, with a trailing
  `/* spec */` comment:

      .area-indicator--count { --_height: 16px; /* spec */ }

  Reuse an existing token only when its resolved value is exactly the spec value.
- **Colors.** Use an existing semantic role when it matches the measured color in the
  side-by-side comparison. When none does, use a literal `light-dark(<light>, <dark>)`
  with a `/* spec */` marker and record the measured values in the spec. Never edit
  `palette.json`. Never weaken contrast tests. Forced colors must keep working.
- **Structure.** Variants set local properties and the base rule consumes them.
  Foreground stays fixed on hover. Runtime state uses native/ARIA attributes and
  documented `data-*` hooks. Keep size, tone, emphasis, state, layout and composition
  independent.
- **Integrate together.** Update CSS, `manifest.ts`, React (native props, refs, keyboard
  behavior, accessible names), source-shared demos, gallery tiles (one variant per tile),
  docs and exports.

## 6. Verify the structure

- Capture every Area variant with the same script: the gallery loads it, so call
  `areaCapture.capture` on the specimen with `source: 'area'`.
- Run the comparison with the Area captures included. Every difference from the chosen
  basis is either fixed or explained in the decision table.
- Run the checks in [Development](DEVELOPMENT.md) that match the change.

## 7. Visual pass

Follow the `area-visual-language` skill (`.agents/skills/area-visual-language/SKILL.md`).
It requires:

- side-by-side screenshots against each target reference at the same zoom, in light and
  dark;
- a lineup against the peer components named in the spec;
- a check against the baseline.

A problem found here goes into the spec's decision table first, then the code, then a
re-capture. Fix geometry in the structure; don't hide it with paint.

## 8. Owner review and feedback

Show the pass in the gallery first. Export `GalleryReview<Name>` from the component's
demo file; the gallery renders it in a Pass review container above that family's variant
tiles. Give each change its own row with its basis, before and after, at 1× and at 3×
(`ReviewPair` in `apps/docs/src/demos/review.tsx`).
Rebuild "before" on the current component through its private properties so both columns
run the same code, and replace the demo at the next pass. Then give the owner:

- the gallery link for each variant,
- the spec's comparison table with the Area column,
- the side-by-side observations,
- open questions, and anything unverified.

Record feedback in the spec's feedback log (observation → change → evidence) before
changing code. When a lesson applies beyond one component, add it to this guide or the
skill, and remove any instruction it replaces. Status stays In review until the owner
accepts the component in `component-status.mjs`.
