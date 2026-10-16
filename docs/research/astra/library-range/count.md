# Count — library range

Current-main supplement: snapshot of commit `7dae828e7af1daf9d26b663d34335121156606f7` (2026-09-29). [Method and scope](README-1.md).

## Job

Quantify the contents of a labeled owner: a navigation row, tab or group heading. Count is distinct from Badge labels and attached Indicator notifications.

## Variant axes

`variant`: plain (default), soft. `tone`: neutral (default), accent. `size`: sm, md (default). [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L336).

## Structural alternatives

Inline number beside the owner label, with an optional visually hidden label. Overflow uses `max+`; zero can be hidden. See the [accepted spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/count.md#L3).

## Interaction patterns

Count inherits meaning from its owner; it does not add a separate interactive control. An unread accent is a tone choice, not automatic coupling to the owner state.

## Area today

Built and owner approved. The [completion registry](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/apps/docs/src/component-status.mjs#L10) includes Count; the [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/count.md#L3) records owner acceptance on 2026-09-28.

## Proposed range

Retain the built axes and formatting. No new outside-system prevalence count is asserted by this supplement. The accepted spec links the existing cross-system Count/Banner survey and records the evidence behind plain/soft, size, tone and formatting choices.

## Sources

- [Current manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L336).
- [Accepted Count spec and upstream evidence](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/count.md#L3).
- [Owner completion registry](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/apps/docs/src/component-status.mjs#L10).
