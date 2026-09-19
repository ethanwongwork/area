# Construction: labels and identity

Every number below was read from source on 2026-09-18 and is reproducible from the
`evidence/` folder (file named in each row). Heights in italics are computed from
line-height + block padding + border; everything else is declared. "n/p" means the system
publishes no geometry for it; nothing here is recalled.

## Badge

| System (evidence file) | Sizes: height | Pad-inline | Gap | Type | Icon | Radius |
| --- | --- | --- | --- | --- | --- | --- |
| OpenAI `oai/Badge` | sm 20, **md 22**, lg 24 | 5 / 6 / 8 | 4 | 12 / 14 / 14, w600 | 12 / 16 / 16 | 4 / 4 / 6; `pill` prop gives full |
| Primer Label `pri/Label` | **small 20**, large 24 | 6 / 8 | n/a | 12, w500, lh 1 | n/a | full, always; 1px border |
| Primer StateLabel `pri/StateLabel` | small *24*, **medium *32*** | 8 / 12 | see file | 12 / 14, w600, lh 16 | see file | full, always |
| shadcn `sha/badge` | one size, *22* (16 lh + 2+2 + 1px border) | 8 | 4 | 12/16, w500 | 12 | full |
| Fluent Badge `flu/Badge` | tiny 6, xs 10, small 16, **medium 20**, large 24, xl 32 | 4 / 6 / 6 / 8 (XXS or XS or SNudge + 2 text padding) | icon margin | 12/16 w600; 10/14 at small | 12 | circular (full) default; `rounded` 4 (2 at small); `square` 0 |
| Material 3 `m3/badge` | small 6 (dot), large 16 | n/p | n/a | 11/16 w500 | n/a | full |
| Carbon Tag `car/tag` | sm 18, **md 24**, lg 32 | 8 (12 at lg); start pad 4 with a custom icon (8 at lg) | n/p | 12/16 | 16 | 16px (pill at 18 and 24, near-pill at 32); min 32 wide, max 208 |
| MUI Badge `mui/Badge` | 20 (dot 8) | 6 | n/a | 12, w500, lh 1 | n/a | 10 (pill) |
| Atlassian Lozenge `atl/lozenge` | **20**, spacious min 32 | 4 / 12 | 4 / 6 | 12/16 w400; 14/20 w500 | n/p | 4 / 6. Legacy: 3, 11px uppercase w653 |
| Atlassian Badge `atl/badge` | min-content, min-width 24 | 4 | n/a | n/p | n/a | 2 |
| Radix `rdx/badge` | 1 *20*, 2 *24*, 3 *28* | 6 / 8 / 10 | 6 / 6 / 8 | 12/16, 12/16, 14/20, w500 | n/a | theme radius, or full when theme is full |
| Geist | sm, md, lg (API only) | n/p | n/p | n/p | n/p | pill in published examples |
| Notion, Figma, HIG | n/p | | | | | |

**Consensus.**
- A badge is never on the control ramp. Default height is 20 to 22 in seven of nine
  measured systems (OpenAI 22, Primer 20, shadcn 22, Fluent 20, MUI 20, Atlassian 20,
  Radix 20); Carbon and Radix size 2 sit at 24. The largest published size is 32
  (Fluent xl, Carbon lg, Primer StateLabel medium, Atlassian spacious) and only for
  deliberately prominent labels.
- Shape is an identity, not a theme choice: full radius in Primer, shadcn, Fluent
  (default), Material, Carbon, MUI and Geist. The exceptions use a small fixed radius
  (OpenAI 4, Atlassian 4, Fluent `rounded` 4), never the control radius. No system lets
  a badge take a control's corner at a control's height, which is exactly the failure
  seen in the first Area attempt.
- Pad-inline tracks height: 20 high is 5 to 6 (8 in shadcn), 24 high is 8, 32 high is
  10 to 12. Gap is 4 (6 in Radix). Type is 12 at the default size everywhere; 14 appears
  only at 24 and above. Weight is 500 to 600. Leading icon is 12 at 20 high and 16 from
  22 up.

**Area decision** (matches the owner's correction of 2026-09-18, with the compact-density
gap closed on 2026-09-18):

The height, pad-inline and radius columns apply at both densities. Each density column is
`gap; type; icon`. Compact deliberately steps through the existing Area density tokens;
the values in parentheses are their current resolved values, recorded here as the missing
decision rather than inferred after the fact.

| Area size | Height | Pad-inline | Default density: gap; type; icon | Compact density: gap; type; icon | Radius |
| --- | --- | --- | --- | --- | --- |
| `sm` | `space-20` (20) | `space-6` | `gap-xs`; `control-xs-text` / `control-xs-leading` (12/16); `icon-xs` (12) | `gap-xs` (4); `control-xs-text` / `control-xs-leading` (11/14); `icon-xs` (12) | `radius-full` |
| `md` (default) | `space-24` (24) | `space-8` | `gap-xs`; `control-sm-text` / `control-sm-leading` (13/18; 12/16 is the cross-system norm); `icon-sm` (16) | `gap-xs` (4); `control-sm-text` / `control-sm-leading` (12/16); `icon-sm` (12) | `radius-full` |
| `lg` | `space-32` (32) | `space-12` | `gap-md` (8; 6 is the cross-system norm); `control-md-text` / `control-md-leading` (14/20); `icon-md` (16) | `gap-md` (6); `control-md-text` / `control-md-leading` (13/18); `icon-md` (16) | `radius-full` |

Compact type is supported by Fluent's 10/14 small-badge type, Material's 11/16 badge
type, and the 12/16 rows in Primer Label, shadcn and Radix; Area's 11/14, 12/16 and
13/18 density-token sequence interpolates within that measured range. Compact `icon-sm`
resolves to 12, matching shadcn's 12px icon at 22px and Fluent's 12px icon at its 20px
medium default. Compact `gap-md` resolves to 6, matching Atlassian's 6px spacious gap
and Radix's 6px first two gaps. These are density choices; benchmark systems do not name
an equivalent compact-density axis.

**Classification against the pre-fix rendered gallery.** The rendered values are
from the Chromium gallery measurement recorded in
`docs/component-audits/badge.md`. A decision gap means the old table did not specify the
compact case; the new compact column above closes that gap without changing component
code.

| Finding | Pre-fix rendered value | Decision value before this update | Evidence supporting the decision | Classification / resolution |
| --- | --- | --- | --- | --- |
| `BADGE-V2-01` inline padding | default 4.740 / 6.385 / 10.030; compact 5.095 / 6.740 / 10.385 | `space-6` / `space-8` / `space-12` (6 / 8 / 12) at sm / md / lg | Primer Label 6 / 8 at 20 / 24; OpenAI 5 / 6 / 8 at 20 / 22 / 24; Carbon 12 at 32; Radix 6 / 8 / 10 at 20 / 24 / 28 | **(a) CSS bug, fixed 2026-09-18.** Both densities now render 6 / 8 / 12. |
| `BADGE-V2-02` label line-height | default 12 / 13 / 14; compact 11 / 12 / 13 | default 16 / 18 / 20; compact was unspecified | shadcn 12/16; Fluent 12/16; Carbon 12/16; Radix 12/16 and 14/20. Primer Label and MUI are the line-height-1 outliers. | **(a) CSS bug, fixed 2026-09-18.** Labels now render 16 / 18 / 20 at default and 14 / 16 / 18 at compact. |
| `BADGE-V2-03` compact typography | 11/14, 12/16, 13/18 | n/a: compact type was not specified; default was 12/16, 13/18, 14/20 | Fluent small 10/14; Material 11/16; Primer Label, shadcn and Radix 12/16; Radix 14/20 | **(b) Decision gap.** The new compact type rows match the rendered Area density-token sequence. |
| `BADGE-V2-04` compact medium icon | 12 (`icon-sm` in compact) | n/a: compact icon was not specified; default md was 16 | shadcn 12 at 22; Fluent medium 12 at 20. OpenAI and Carbon use 16 at 24 and are the roomier-size outliers for this compact choice. | **(b) Decision gap.** The new compact md row specifies `icon-sm` (12). |
| `BADGE-V2-05` compact large gap | 6 (`gap-md` in compact) | n/a: compact gap was not specified; default lg was 8 | Atlassian spacious 6; Radix gaps 6 / 6 / 8; OpenAI and shadcn use 4 at smaller sizes | **(b) Decision gap.** The new compact lg row specifies `gap-md` (6). |

Evidence note for the owner: the cross-system default is 20 to 22, so Area `md` at 24 is
at the top of the default band. If badges read heavy beside 28 and 32 controls, make `sm`
the default; do not shrink `md`. Badge ignores `data-area-radius`. Anchored counters use
`sm`.

## Counter badge and anchored badge

| System | Height | Min-width | Pad-inline | Type | Dot | Anchor offset |
| --- | --- | --- | --- | --- | --- | --- |
| Primer CounterLabel `pri/CounterLabel` | *18* (12 lh 1 + 2+2 + border) | n/p | 6 | 12 w600 | hidden when empty | inline, not anchored |
| Fluent CounterBadge `flu/CounterBadge` | Badge sizes (16 / 20 / 24) | = height | as Badge | as Badge | 6 | n/a |
| Material 3 `m3/badge` | 16 | 16 | n/p | 11/16 | 6 | n/p in tokens |
| MUI Badge `mui/Badge` | 20 | 20 | 6 | 12 w500 | 8 | translate 50% out of the corner; circular overlap insets 14% |
| Carbon badge-indicator `car/badge-indicator` | max 16, min 8 | 8 | 4 | n/p | 8 | 8 from top and end (4 with count) |
| shadcn avatar-badge `sha/avatar` | 8 / 10 / 12 for avatar sm / default / lg | | | | same | bottom-end, 2px ring |

**Consensus.** Counter height 16 to 20, min-width equal to height so a single digit is a
circle, pad-inline 4 to 6, 11 to 12 type, full radius. Dot is 6 to 8. A 2px surface ring
separates it from the owner. **Area decision:** counter = Badge `sm` (20) with
`min-inline-size` = height; add an `xs` 16 only for dense nav and tab counts; dot
`space-8` (`space-6` inside `sm` labels); ring `space-2` on the visible dot.

## Tag (classification, removable)

| System | Sizes: height | Pad-inline | Gap | Type | Radius | Remove button |
| --- | --- | --- | --- | --- | --- | --- |
| Carbon Tag `car/tag` | 18 / **24** / 32 | 8 | n/p | 12/16 | 16 (pill) | circle, = tag height; icon 16 |
| Fluent Tag `flu/Tag` | xs 20, small 24, **medium 32** | 5 / 5 / 7 | n/p | see file | `rounded` 4 default, `circular` full | in-tag dismiss slot |
| Material chips `m3/input-chip`, `m3/assist-chip` | 32 | n/p in tokens | n/p | see file | 8 | icon 18; avatar 24 |
| MUI Chip `mui/Chip` | small 24, **medium 32** | label 8 / 12 | n/a | 13 | pill (height / 2) | avatar 24 (18 small); icon sizes 22, 18, 16 (see file for which slot) |
| Atlassian Tag `atl/tag` | *18* (16 line + 1px border), 4 margin around | 4; 3 when removable | 2 | 12/16 | 4; avatar tag full | min-width 40 when removable |
| Primer Token `pri/Token` | see evidence file | | | | | remove button margin 4 to 6 |

**Consensus.** Tag is one tier above Badge: default 24 (Carbon, Fluent small, MUI small)
with a 32 option that is comfortable for touch and for an avatar. Radius splits: pill
(Carbon, MUI) versus small fixed 4 to 8 (Fluent, Material, Atlassian). **Area decision:**
`sm` 20, `md` 24 (default), `lg` 32; pad `space-6 / space-8 / space-12`; remove button is
a square of the tag's inner height with a 12 (16 at `lg`) glyph and sits `space-2` from the
end. Radius: Tag already exists in Area as Chip and Token neighbours, so follow their
current radius (`radius-small`) and offer `--pill`; do not inherit Badge's forced pill,
because a tag is interactive and a badge is not.

## Kbd

| System | Height | Min-width | Pad-inline | Type | Radius | Gap in a combo |
| --- | --- | --- | --- | --- | --- | --- |
| shadcn `sha/kbd` | 20 | 20 | 4 | 12/16 w500, sans | 6 | 4 |
| Radix `rdx/kbd` | em-based: line-height 1.7em of 0.75em type | 1.75em | 0.5em | 0.75em | 0.35em | n/p |
| Primer KeybindingHint `pri/KeybindingHint` | inherits; see file | | | | | |

Area's Kbd was audited on 2026-09-18 (`small | normal`). The measured reference is 20 high,
square minimum, 4 pad, 12 type, 6 radius; keep Area's existing tiers if they land on it.

## Avatar

| System | Size scale (px) | Default | Shape | Initials type | Notes |
| --- | --- | --- | --- | --- | --- |
| OpenAI `oai/Avatar` | any number | 28 | full | 0.5 x size; "+N" 0.45 / 0.37 / 0.30 x size for 1 / 2 / 3 digits | icon fallback 0.7 x size |
| Primer `pri/Avatar` | any number | 20 | circle; `square` = clamp(4, size - 24, 6) | n/a | |
| shadcn `sha/avatar` | sm 24, **default 32**, lg 40 | 32 | full | 14/20 | status badge 8 / 10 / 12 |
| Fluent `flu/Avatar` | 16, 20, 24, 28, **32**, 36, 40, 48, 56, 64, 72, 96, 120, 128 | 32 | circular; square radius 2 / 4 / 6 / 8 by size band | 10, 12, 16, 20, 24 by size band (bands in the file) | ring and active states |
| MUI `mui/Avatar` | one, 40 | 40 | 50%; `rounded` theme radius; `square` 0 | 20 | |
| Atlassian `atl/avatar` | xsmall 16 (a second map gives 20), small 24, **medium 32**, large 40, xlarge 96, xxlarge 128 | 32 | circle; square radius 2, 2, 3, 3, 6, 12 | n/p | |
| Radix `rdx/avatar` | 24, 32, **40**, 48, 64, (80), 96 ... | 40 | theme radius | one letter 14 / 16 / 18 / 20 / 24 / 28; two letters one step down | |

**Consensus.** Default 32 (shadcn, Fluent, Atlassian; OpenAI 28, MUI and Radix 40). The
shared scale is 16, 20, 24, 32, 40, 48, 64, 96 and it does not match a control ramp above
48. Circle is universal; square is an opt-in with a radius that grows with size (about
size / 8, clamped 2 to 12). Initials are half the diameter. **Area decision:** `xs` 20,
`sm` 24, `md` 32 (default), `lg` 40, `xl` 48, plus named `2xl` 64 and `3xl` 96; 16 only as
an inline `2xs`. Initials `calc(size * 0.5)` snapped to a type token; `--square` radius
`radius-small` up to 32, `radius-control-lg` to 48, `radius-container` above.

## Avatar group

| System | Overlap | Separation | Overflow chip |
| --- | --- | --- | --- |
| OpenAI `oai/Avatar` vars | -8 | 3px cut-out in surface colour | same size; text scales by digit count |
| MUI `mui/AvatarGroup` | -8 | 2px solid background border | same size |
| shadcn `sha/avatar` | see file | 2px ring | 32 (24 / 40); 14/20; icon 16 (20 at lg) |
| Primer `pri/AvatarStack` | see file | 1px box-shadow ring; mask = 100% + 2px | n/a |

**Consensus.** Overlap is a quarter of a 32 avatar (-8), separation is a 2 to 3px ring in
the surface colour. **Area decision:** overlap `calc(size * -0.25)`, ring `space-2`,
overflow chip identical in size and shape to its siblings.
