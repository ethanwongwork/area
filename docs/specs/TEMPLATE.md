# <Component> spec

<!-- Copy to docs/specs/<slug>.md. Process: docs/COMPONENT_ADAPTATION.md.
     Every number cites a capture file or a source line. Unknown → "not found (searched …)". -->

**Status:** research | decided | built | in review | accepted · <date>
**Captures:** `docs/research/captures/<slug>/`
**Peers:** <related Area components checked in the visual pass>

## Owner decisions

Dated, newest last. These override sources and earlier decisions.

- <date>: <decision>

## Job and boundaries

What the component does, and what belongs to a neighboring component instead.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|

Excluded variants and why:

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (rendered + source) | | | | |
| chatgpt | target product | | | n/a (evidence only) | |
| notion | target product | | | n/a (evidence only) | |
| figma | target product | | | n/a (evidence only) | |

Target products searched without an equivalent: <product: where you looked>.

## Anatomy

For each source, the layer tree mapped to Area slots, and which layer owns height,
padding, gap, alignment, hit area, radius, border, paint and elevation. Flag offsets,
negative margins and transforms, and whether each is structural.

```
<source>
shell      <element>  owns: …
  icon     <element>  owns: …
  text     <element>  owns: …
```

Area:

```
```

Inset equations (outer inset = border + shell padding + slot inset), per slot and size:

## Measurements

Generated with `node scripts/capture-compare.mjs docs/research/captures/<slug>/<files>`.
One table per variant (or per size when variants share geometry). Paste the output as is.

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
forced colors, RTL.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|

Baseline checks:

## Visual pass

Side-by-side observations (reference vs Area, same zoom, light and dark), peer lineup,
and what changed as a result.

## Verification

Checks run and their results, Area captures compared, and what remains unverified.

## Feedback log

- <date> · observation → change → evidence
