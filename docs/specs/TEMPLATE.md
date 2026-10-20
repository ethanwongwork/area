# <Component> spec

<!-- Copy to docs/specs/<slug>.md. Process: docs/COMPONENT_ADAPTATION.md.
     Every number cites a capture file or a source line. Unknown → "not found (searched …)".
     The sections down to "Behavior and accessibility" describe the component as it is now:
     edit them in place whenever it changes. Review notes and the Feedback log are history:
     append, newest last. Keep the section names; the app reads them. -->

**Captures:** `docs/research/captures/<slug>/`
**Peers:** <related Area components checked in the visual pass>

## Owner decisions

Dated, newest last. These override sources and earlier decisions. Mark a decision that a
later one replaces as superseded.

- <date>: <decision>

## Job and boundaries

What the component does, and what belongs to a neighbouring component instead. The first
paragraph is shown as the family's Job in the app. Record the intake answer
(docs/GOVERNANCE.md): why this is a component and not a variant, a composition or a
setting.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|

Excluded variants and why:

## Anatomy

The Area layer tree, and which layer owns height, padding, gap, alignment, hit area, radius,
border, paint and elevation.

```
shell      <element>  owns: …
  icon     <element>  owns: …
  text     <element>  owns: …
```

Inset equations (outer inset = border + shell padding + slot inset), per slot and size:

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|

Basis order: owner → target-product agreement → primary product for this context →
primary design system → peer/baseline consistency.

## States

| State | Slot · property changes | Evidence |
|---|---|---|

## Behavior and accessibility

Native element, roles and names, keyboard, focus, what is announced, reduced motion,
forced colors, RTL. Say plainly what is not implemented.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (rendered + source) | | | | |
| chatgpt | target product | | | n/a (evidence only) | |
| notion | target product | | | n/a (evidence only) | |
| figma | target product | | | n/a (evidence only) | |

Target products searched without an equivalent: <product: where you looked>.

Each reference's layer tree mapped to Area slots, with offsets, negative margins and
transforms flagged (structural or not):

```
<source>
shell      <element>  owns: …
```

## Measurements

Generated with `node scripts/capture-compare.mjs docs/research/captures/<slug>/<files>`.
One table per variant (or per size when variants share geometry). Paste the output as is.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|

Baseline checks:

## Visual pass

Side-by-side observations (reference vs Area, same zoom, light and dark), peer lineup,
and what changed as a result.

## Verification

Checks run and their results, Area captures compared, and what remains unverified.

## Review note, <date>

- **What changed:** <one plain sentence>
- **Why:** <one plain sentence>

## Feedback log

- <date> · observation → change → evidence
