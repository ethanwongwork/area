# Checkbox — current-main companion

Snapshot of commit `7dae828e7af1daf9d26b663d34335121156606f7`. [Run 2](README-2.md). Outside-system comparison remains in the run-1 catalogue; this supplement refreshes only the Area contract.

## Job

Toggles a single independent option.

## Variant axes

variant = card; layout = row, tile; size = md, lg; tone = neutral, accent. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L224-L231).

## Structural alternatives

Standard native checkbox or card with leading visual, text/caption and control. Card layout is row or tile.

## Interaction patterns

Native checked/indeterminate, disabled and invalid states. Layout is forwarded only when variant=card. Group orientation is independent.

## Area today

Defaults: size=md and tone=neutral. No sm size remains. Elements: control and visual. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L224-L231); [React layout guard](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/react/src/components/forms.tsx#L143).

## Proposed range

Retain the built card anatomy and expose row/tile only when card is selected. No new outside prevalence count is asserted here.

## Sources

- [Current manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L224-L231).
- [Checkbox spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/checkbox.md#L1).
- [React implementation](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/react/src/components/forms.tsx#L143).
