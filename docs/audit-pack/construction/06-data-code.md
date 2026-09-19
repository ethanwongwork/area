# Construction: data and code

Read from source 2026-09-18. Status: **seed**.

## Table (seed: shadcn, Radix)

| System | Header row | Cell pad | Row min-height | Type |
| --- | --- | --- | --- | --- |
| shadcn `sha/table` | 40 | 8 (0 at the end of a checkbox cell; checkbox nudged 2 down) | *36* (20 lh + 8 + 8) | 14/20; caption margin-top 16 |
| Radix `rdx/table` | same as cells | 8; 12 (size 3 in file) | 36; 44 | 14 |

Still to read: `pri/Table`, `pri/DataTable`, `flu/Table*`, `m3/data-table`,
`car/data-table` (five row sizes), `mui/TableCell`, `atl/dynamic-table`. **Provisional.**
Row heights map to the control ramp (28 compact, 36 default, 44 comfortable); cell pad
`space-8` x `space-12`; header 12/16 strong or 14/20.

## Code block, Snippet, List, Description list, Stat, Timeline

Not measured yet. Files: `oai/CodeBlock`, `car/code-snippet`, `atl/code`, `rdx/code`,
`rdx/data-list`, `car/contained-list`, `car/structured-list`, `pri/Timeline`,
`mui/List*`, `m3/list`.
