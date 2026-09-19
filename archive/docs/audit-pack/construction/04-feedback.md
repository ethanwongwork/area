# Construction: feedback

Read from source 2026-09-18. Status: **seed** unless stated.

## Tooltip (complete for OpenAI, shadcn, Fluent, Material, MUI, Atlassian, Radix)

| System | Pad | Type | Radius | Max width | Offset and arrow |
| --- | --- | --- | --- | --- | --- |
| OpenAI `oai/Tooltip` | 8 x 12 (larger: 12 x 16, 14 x 18) | 14 | 8 | 300 | see file |
| shadcn `sha/tooltip` | 6 x 12 | 12/16 | 8 | n/a | see file |
| Fluent `flu/Tooltip` | 4 11 6 11 plus 1px border (5 12 7 12) | see file | 4 | 240 | see file |
| Material 3 `m3/plain-tooltip` | n/p | 12/16 | 4 | n/p | n/p |
| MUI `mui/Tooltip` | 4 x 8; touch 8 x 16 | 11 w500; touch 14 | theme radius | 300 | 14 from anchor (24 on touch); arrow 1em x 0.71em |
| Atlassian `atl/tooltip` | 4 block (inline: see file) | 12/16 | 3 | 240; truncated variant 420 | see file |
| Radix `rdx/tooltip` | 4 x 8 | see file | 4 | see file | see file |

**Consensus.** 12/16 type, block pad 4 to 6, inline pad 8 to 12, a small fixed radius of 4
to 8 that does not follow the control radius, max width 240 to 300. **Area decision.**
Type `text-xs` 12/16; pad `space-4` x `space-8` (`space-6` x `space-12` for the rich form
with a title); radius `radius-small`; max width a named token at 15rem (240); offset
`space-8` from the anchor.

## Alert, banner, inline message (seed: OpenAI, shadcn, Radix)

| System | Pad | Gap | Type | Icon | Radius |
| --- | --- | --- | --- | --- | --- |
| OpenAI `oai/Alert`, `_variables` | 16 | 12 | 14/20 | see file | 12 |
| shadcn `sha/alert` | 16 x 12 | 12 column, 2 row | 14/20 | 16, nudged 2 down to the first line | 10 |
| Radix `rdx/callout` | 12; 16; (size 3 in file) | 8; 12 | see file | see file | 6; 8 |

Still to read: `pri/Banner`, `pri/Flash`, `pri/InlineMessage`, `flu/MessageBar*`,
`car/notification`, `mui/Alert`, `atl/section-message`, `atl/banner`, `atl/inline-message`.
**Provisional Area decision.** Pad `space-12` x `space-16`, icon-to-text gap `space-12`,
title-to-body gap `space-2`, 14/20, icon = `icon-md` aligned to the first text line,
`radius-container`.

## Progress, Spinner, Skeleton (seed)

- Progress bar: shadcn 8 high, full radius; Radix 4 / 6 (size 3 in file), so the thin
  default is 4 to 8. Still to read: `pri/ProgressBar`, `flu/ProgressBar`,
  `m3/linear-progress-indicator`, `car/progress-bar`, `mui/LinearProgress`,
  `atl/progress-bar`.
- Spinner: read `oai/LoadingIndicator`, `pri/Spinner`, `flu/Spinner`, `car/loading`,
  `mui/CircularProgress`, `atl/spinner`, `rdx/spinner`, `m3/circular-progress-indicator`.
- Skeleton: shadcn radius 8. Read `pri/Skeleton*`, `flu/Skeleton*`, `mui/Skeleton`,
  `atl/skeleton`, `rdx/skeleton`, `car/skeleton-styles`.

## Toast, Empty state

Not measured yet. shadcn's toast is the third-party Sonner, so its geometry is not in the
registry file; use `flu/Toast*`, `mui/Snackbar*`, `m3/snackbar`, `atl/flag`,
`car/notification`.
