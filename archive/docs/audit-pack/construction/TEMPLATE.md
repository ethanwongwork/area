## <Component>  (status: seed | complete)

| System (evidence file) | Sizes: height | Pad-inline | Pad-block | Gap | Type | Icon | Radius | Border | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OpenAI `oai/<File>` | | | | | | | | | |
| Primer `pri/<File>` | | | | | | | | | |
| shadcn `sha/<file>` | | | | | | | | | |
| Fluent `flu/<File>` | | | | | | | | | |
| Material 3 `m3/<file>` | | | | | | | | | |
| Carbon `car/<file>` | | | | | | | | | |
| MUI `mui/<File>` | | | | | | | | | |
| Atlassian `atl/<pkg>` | | | | | | | | | |
| Radix `rdx/<file>` | | | | | | | | | |
| Geist, Notion, Figma, HIG | n/p unless a published spec page is cited | | | | | | | | |

Rules for filling this in:
- Every cell is a number you can point to in an evidence file, a computed height in
  italics with its sum shown once, `n/p` (the system does not publish it), `n/a` (the
  system has no such part), or `see file` (exists, not yet read). Never a remembered value.
- Bold the system's default size.
- Add columns the component needs (track, thumb, indicator, min / max width, offset).

**Size class.** One of: control ramp (Button, Input, Select, Segmented, Chip, Menu row,
Tab row), glyph ramp (Checkbox, Radio, Switch track), label ramp (Badge, Tag, Kbd,
Counter), identity ramp (Avatar), fixed construction (Tooltip, Separator, Progress), or
container (Dialog, Popover, Card, Alert). State which, and cite the rows that prove it.

**Shape.** One of: follows `data-area-radius`; identity shape (always pill, always circle);
small fixed radius; concentric with a parent. Cite the rows.

**Consensus.** Three to six sentences: default size, size range, pad-to-height
relationship, gap, type, shape. Name the outliers and why they are outliers.

**Area decision.** A table of Area sizes with token names for height, pad, gap, type,
icon, radius. Where the owner has already decided something, record it and note where it
sits against the consensus.
