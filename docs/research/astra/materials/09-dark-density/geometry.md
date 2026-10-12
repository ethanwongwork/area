# Radius and size geometry

**Observed inputs; calculated outputs.** Every control case uses Area’s formula with pill flags off, uniform corners and a box at least as wide as its height. Numbers are CSS pixels. The rim insets of 1 and 2 below are analytical examples, not adopted material widths. They also illustrate where an inner corner must become square.

Inputs: [radius steps](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/radius.ts#L26-L66), [default heights](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/density.ts#L135-L144), [compact heights](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/density.ts#L156-L162), [radius derivation](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/emit/base.ts#L249-L272).

## Controls at every setting

| Setting | Density | sm: height / radius | md: height / radius | lg: height / radius | md inner rim at inset 1 / 2 |
| --- | --- | --- | --- | --- | --- |
| Sharp (0) | default | 28 / 0 | 32 / 0 | 40 / 0 | 0 / 0 |
| Sharp (0) | compact | 24 / 0 | 28 / 0 | 32 / 0 | 0 / 0 |
| 2 | default | 28 / 2 | 32 / 2 | 40 / 2 | 1 / 0 |
| 2 | compact | 24 / 2 | 28 / 2 | 32 / 2 | 1 / 0 |
| 4 | default | 28 / 2 | 32 / 4 | 40 / 4 | 3 / 2 |
| 4 | compact | 24 / 2 | 28 / 2 | 32 / 4 | 1 / 0 |
| 6 | default | 28 / 4 | 32 / 6 | 40 / 6 | 5 / 4 |
| 6 | compact | 24 / 4 | 28 / 4 | 32 / 6 | 3 / 2 |
| 8 | default | 28 / 6 | 32 / 8 | 40 / 10 | 7 / 6 |
| 8 | compact | 24 / 6 | 28 / 6 | 32 / 8 | 5 / 4 |
| 10 | default | 28 / 8 | 32 / 10 | 40 / 12 | 9 / 8 |
| 10 | compact | 24 / 6 | 28 / 8 | 32 / 10 | 7 / 6 |
| 12 | default | 28 / 10 | 32 / 12 | 40 / 14 | 11 / 10 |
| 12 | compact | 24 / 8 | 28 / 10 | 32 / 12 | 9 / 8 |
| 14 | default | 28 / 12 | 32 / 14 | 40 / 16 | 13 / 12 |
| 14 | compact | 24 / 10 | 28 / 12 | 32 / 14 | 11 / 10 |
| pill | default | 28 / 14 | 32 / 16 | 40 / 20 | 15 / 14 |
| pill | compact | 24 / 12 | 28 / 14 | 32 / 16 | 13 / 12 |

## Surfaces and lists at every setting

Surface corners do not follow control height. Floating lists use their separate row-plus-padding formula; their maximum differs with density. Values below are token results before CSS overlap normalization for the actual box.

| Setting | Density | Container | General row | Floating list row | Floating list shell |
| --- | --- | --- | --- | --- | --- |
| 0 | default | 0 | 0 | 0 | 0 |
| 0 | compact | 0 | 0 | 0 | 0 |
| 2 | default | 2 | 2 | 2 | 2 |
| 2 | compact | 2 | 2 | 2 | 2 |
| 4 | default | 4 | 4 | 4 | 4 |
| 4 | compact | 4 | 2 | 4 | 4 |
| 6 | default | 8 | 6 | 4 | 8 |
| 6 | compact | 8 | 4 | 4 | 8 |
| 8 | default | 12 | 8 | 8 | 12 |
| 8 | compact | 12 | 6 | 8 | 12 |
| 10 | default | 16 | 10 | 10 | 14 |
| 10 | compact | 16 | 6 | 10 | 14 |
| 12 | default | 20 | 12 | 12 | 16 |
| 12 | compact | 20 | 8 | 10 | 14 |
| 14 | default | 24 | 14 | 14 | 18 |
| 14 | compact | 24 | 10 | 10 | 14 |
| pill | default | 24 | 16 | 16 | 20 |
| pill | compact | 24 | 12 | 12 | 16 |

## Concentric rims and exceptions

<!-- task19-superseded 09-dark-density/geometry.md ## Concentric -->
> **Superseded policy — D11 (owner, 2026-10-11):** Inner rims keep the radius floor at every setting except Sharp. Historical max(0, outer-inset) examples and tabulated square inner rims are retained but superseded. The original passage/findings below remain for historical comparison. [Binding decisions](../REVIEW.md#owner-decisions-2026-10-11).
<!-- /task19-superseded -->

See [geometry contract](rules.md#concentric-geometry) for used-radius normalization, inset equations, pill overrides, nested-child floors, Sharp joins and connected regions. These tables apply to every style; a material must never select a different radius setting to preserve its appearance. [Per-style matrix](styles.md) states what gets simplified when its layers no longer fit.

Regenerate with `python3 docs/research/astra/materials/09-dark-density/build.py`. This reads the immutable source commit through Git, not production files in the research checkout.
