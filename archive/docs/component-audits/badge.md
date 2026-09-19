# Badge audit — 2026-09-18

## Decision summary

Implemented the owner's approved checklist from [Labels and identity](../audit-pack/03-labels-identity.md#badge), bound to the live repository by [the repo map](../audit-pack/09-area-repo-map.md). Badge owns short status/metadata and native links. BadgeAnchor owns decorative attachment; BadgeGroup owns wrapping and overflow disclosure. All 18 Build list rows are implemented or represented by an explicit composition/alias; none is rejected or silently deferred.

The public default is soft / neutral / md at 24px. Badge uses its own 20/24/32px metadata scale and is always pill-shaped, independent of the global radius preset. Five fill variants and ten tones produce a **50-cell matrix**. Dot is orthogonal, with a second **20-cell soft/outline × tone matrix**. The gallery renders each matrix cell and each ordinary specimen in its own tile.

The first implementation of this audit used the shared control-height ramp and allowed the radius axis to change Badge shape. That decision was corrected after visual review; see [Badge audit correction](badge-correction-2026-09-18.md).

## Current Area contract

Baseline: Badge lived in `display.css` and `primitives.tsx`, with solid/outline, five tones, dot/label elements, and no explicit default variant. Its implicit default was soft. React forwarded span attributes and ref; `dot` added a decorative leading dot. Height was `control-xs`; there were three docs examples. Outline used a generic border. Old practices prohibited pill and all interactions; those practices have been replaced.

Final: `badge.css` and `Badge.tsx` hold the family. The manifest is authoritative for variants, flags, defaults and companion blocks. Existing tone/variant/dot calls remain valid; `badgeVariants()` now emits explicit default classes. Source aliases are metadata displayed in the generated API reference, not accepted duplicate CSS variants.

## User jobs and non-goals

- Short object status, lifecycle, plan tier, number, or metadata; optional native link to details.
- Optional leading/trailing visual, named icon-only or dot-only status, bounded text.
- Attachment to an icon/button, avatar, or tab; the owner carries the accessible status/count.
- Wrapped groups or a measured single line with +N disclosure.
- [Atlas boundary](../COMPONENT_CAPABILITY_ATLAS.md#boundaries-that-must-remain-explicit): Tag is classification, Chip is selection/removal, Token is a technical reference. CounterBadge formatting (`max`, `showZero`, compact counts) and standalone StatusDot presence presets remain separate families. This Badge batch implements plain numeric content, not those neighbors' independent Build lists.

## Evidence ledger

Access/review date: 2026-09-18. As instructed by the build brief, previously read source is reused rather than re-researched. The [pack ledger](../audit-pack/08-evidence-ledger.md) records exact commits and evidence limitations.

| System | Source / level | Evidence used |
| --- | --- | --- |
| OpenAI | [Apps SDK UI Badge source](https://github.com/openai/apps-sdk-ui/tree/0f00143/src/components/Badge), A, pack source read | Soft/solid/outline, semantic tones, sizes, pill, small tracking, optional icons. Published SDK system, not an inferred ChatGPT API. |
| Primer | [React source](https://github.com/primer/react/tree/e4e6eba/packages/react/src), A, pack source read; [LabelGroup](https://primer.style/product/components/label-group/), A, reverified | Label, StateLabel, counts and grouping; fixed and automatic visible count confirmed in current docs. |
| shadcn/ui | [Badge source](https://github.com/shadcn-ui/ui/blob/a87a63b/apps/v4/registry/new-york-v4/ui/badge.tsx), A, pack source read | Emphasis, ghost/link, icons and anchor semantics. |
| Fluent | [Badge usage](https://fluent2.microsoft.design/components/web/react/core/badge/usage), A, reverified; source at `babf260` in pack | Badge prop unions retained from source; current usage confirms short descriptive text, placement, icon-only accessible names and optional truncation. Recalled pixel sizes are not treated as newly measured facts. |
| Geist | [Badge](https://vercel.com/geist/badge), A, reverified | Subtle fills, inverted, Trial/Turborepo, three sizes, icons, link Pill; static status boundary. |
| Notion | Pack ledger C, recalled | Current product observation unavailable in this audit; not promoted to a published API. Dot treatment is an approved Area requirement with additional pack evidence. |
| Figma | Pack ledger C, recalled | Current product observation unavailable; no API or pixel claim inferred. |
| Carbon | [Tag usage](https://carbondesignsystem.com/components/tag/usage/), A, reverified | Classification is the neighboring Tag contract, not a reason to make Badge selectable/removable. |
| Atlassian | [Forge Lozenge](https://developer.atlassian.com/platform/forge/ui-kit/components/lozenge/), A, reverified | Default bounded width of 200px; Area translates this to an overridable token-derived limit. ADS page body unavailable in text retrieval. |
| MUI | [Badge](https://mui.com/material-ui/react-badge/), A, reverified | Decorative attachment, owner accessible naming, dots and counters. Pack anchoring capabilities implemented by BadgeAnchor. |
| Material 3 | [Badges](https://m3.material.io/components/badges/overview), unavailable body | Retrieval returned a JavaScript shell. No recalled dimensions asserted as current measurement. |
| Apple | [Notifications](https://developer.apple.com/design/human-interface-guidelines/notifications), unavailable body | Retrieval returned a JavaScript shell. No platform-specific Badge API inferred. |

## Benchmark comparison

| System | Boundary / treatments | Geometry and content | Interaction |
| --- | --- | --- | --- |
| Area | Status/metadata; five variants, ten tones, orthogonal dot | sm/md/lg at 20/24/32px; invariant pill shape, both icon sides, number, truncation | Static span, native link, companion anchor/group |
| OpenAI | Published SDK Badge; soft/solid/outline | Source reference 20/22/24, pill, icons, tracking | Display contract; source measurements mapped to Area tiers |
| Primer | Label / StateLabel / LabelGroup | Outline label, larger lifecycle recipe, numeric/auto grouping | Overflow disclosure is a separate group responsibility |
| shadcn | Badge, including ghost and link | Small type, inline icons, configurable composition | Native/as-child link pattern |
| Fluent | Badge distinct from CounterBadge/PresenceBadge | Icon position and shape/size unions; short text, optional custom truncation | Display by default; icon-only accessible name |
| Geist | Badge and link Pill | Subtle/solid palette, inverted, brand specials, three sizes | Static badge or link; stateful actions separate |
| Notion | Unavailable current observation | Recalled categorical pills are not API evidence | No behavior inferred |
| Figma | Unavailable current observation | No Badge dimensions inferred | No behavior inferred |

No benchmark adds disabled, selected, loading, invalid, or dismissal states to static Badge. These remain outside its contract; link hover/focus and anchor visibility are the relevant states.

## Construction evidence, consensus, and Area decision (v2)

Retrospective documentation update, 2026-09-18. Badge is already built and
owner-corrected; this records the existing construction decision without reopening it
or changing component code. Numeric benchmark authority is
[extracted evidence](../audit-pack/evidence/INDEX.md). The following table, consensus,
and decision are reproduced from [the Badge construction entry](../audit-pack/construction/03-labels-identity.md#badge).
All dimensions are CSS px unless a token or another unit is specified. Italic heights
are computed; `n/p` means unpublished, and `see file` cells remain unresolved in the
source construction record rather than being filled from memory.

**Size class: label ramp. Shape rule: identity shape, always pill.** Area deliberately
keeps its owner-corrected medium default and full radius independent of the radius axis.

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

**Area decision** (matches the owner's correction of 2026-09-18):

| Area size | Height | Pad-inline | Gap | Type | Icon | Radius |
| --- | --- | --- | --- | --- | --- | --- |
| `sm` | 20 | `space-6` | `space-4` | 12/16 | 12 | `radius-full` |
| `md` (default) | 24 | `space-8` | `space-4` | 13/18 (12/16 is the cross-system norm) | 16 | `radius-full` |
| `lg` | 32 | `space-12` | `space-8` (6 is the norm) | 14/20 | 16 | `radius-full` |

Evidence note for the owner: the cross-system default is 20 to 22, so Area `md` at 24 is
at the top of the default band. If badges read heavy beside 28 and 32 controls, make `sm`
the default; do not shrink `md`. Badge ignores `data-area-radius`. Anchored counters use
`sm`.

Construction-record caveat: the consensus above is preserved as supplied. Its claim
that 14px type appears only at heights 24px and above conflicts with its own OpenAI
row (md 22px, type 14px). Its decision note calls 24px the top of a 20–22px default band;
24px is actually above that band. These are documentation inconsistencies, not reasons
to silently revise the owner-corrected Area decision. The original decision specified no
separate compact-density values. The construction record now closes that gap with an
explicit compact column and classifies the five findings below.

## Post-build measured geometry (v2)

Measured afresh on 2026-09-18 from
`http://localhost:4321/gallery.html#gallery-section-badge` in the in-app Chromium browser,
using `getBoundingClientRect()` for outer height and
`getComputedStyle()` for padding, gap, font size, root/label line-height, radius, and
resolved icon token on `#gallery-badge-size-sm`, `-md`, and `-lg`. Each size was read at
both UI densities after the two approved CSS fixes. The medium specimen was also checked
under the sharp radius preset and remained full-radius; the gallery was then restored to
default density and rotund radius.

| Density / tier | Radius presets tested | Height | Pad-inline per side | Gap | Font / root leading / label leading | Icon token | Computed radius |
| --- | --- | ---: | ---: | ---: | --- | ---: | ---: |
| default sm | rotund | 20 | 6 | 4 | 12 / 16 / 16 | 12 | 9999 |
| default md | rotund, sharp | 24 | 8 | 4 | 13 / 18 / 18 | 16 | 9999 |
| default lg | rotund | 32 | 12 | 8 | 14 / 20 / 20 | 16 | 9999 |
| compact sm | rotund | 20 | 6 | 4 | 11 / 14 / 14 | 12 | 9999 |
| compact md | rotund | 24 | 8 | 4 | 12 / 16 / 16 | 12 | 9999 |
| compact lg | rotund | 32 | 12 | 6 | 13 / 18 / 18 | 16 | 9999 |

Padding is computed CSS padding, excluding the measured 1px border on each side. Size specimens contain text only, so the icon column
is explicitly the resolved icon token, not a measured SVG in those specimens. The
existing medium Leading Icon tile's actual SVG box measured 16×16 at default density
and 12×12 at compact density. Radius 9999px is the computed full-radius value; the
painted corner is capped to half the height (10/12/16px). Heights, default size, and
identity shape agree with the decision. Label and badge vertical centers differed by no
more than 0.004px across all six density/tier combinations. Gallery preferences were
restored afterward.

### Finding resolution

The evidence rows, old decision values, and full rationale are recorded beside the
[revised Area decision](../audit-pack/construction/03-labels-identity.md#badge).

- **BADGE-V2-01 — inline padding: (a) CSS bug, fixed.** Both densities now render the
  decision's 6/8/12px tier values.
- **BADGE-V2-02 — label line-height: (a) CSS bug, fixed.** Labels now render the root
  leading: 16/18/20px at default density and 14/16/18px at compact density.
- **BADGE-V2-03 — compact typography: (b) decision gap, now documented.** The compact
  decision is 11/14, 12/16, 13/18 and matches the rendered root typography.
- **BADGE-V2-04 — compact medium icon: (b) decision gap, now documented.** The compact
  decision uses `icon-sm`, which resolves to the rendered 12px.
- **BADGE-V2-05 — compact large gap: (b) decision gap, now documented.** The compact
  decision uses `gap-md`, which resolves to the rendered 6px.

The three decision-gap cases were left unchanged. The previous geometry table incorrectly
reported compact medium icon as 16px and compact large gap as 8px; the fresh table above
supersedes those claims.

The live radius axis remains `sharp | subtle | soft | standard | round | rotund | pill`, but Badge deliberately does not consume those curves. Its radius is always `radius-full`, which keeps static metadata visually distinct from controls. The compatibility `pill` boolean remains accepted and is now a no-op shape alias.

Truncation defaults to `space-40 × 5` and also respects the available width. Dot diameter is space-6 (space-8 at lg), within the tier's outer box. Ring width is space-2. Rectangular badge centres sit directly on the owner's corner, giving a 20px counter an even 10px overlap. Circular anchors move the centre exactly 14% inward, which puts the visible dot and its surface ring on an avatar's edge. RTL mirrors logical placement. Badge labels use the tier's approved leading inside the flex-centred box. Content is one line; longer explanations belong outside the Badge.

## Accessibility and interaction

- Span is not focusable or live-announced. Text carries meaning independently of tone. Icon-only/dot-only require `aria-label`, `aria-labelledby`, or explicit decorative `aria-hidden`; unnamed forms fail fast. Named static pictograms use `role="img"`.
- Native anchors forward href/target/rel/events and the anchor ref. Enter activates, Tab traverses; hover preserves foreground. Plain is a link treatment, not an interactive static Badge: only a native anchor underlines on hover. Focus-visible uses the system 2px outline/offset. Compact links retain at least a 24px target; coarse-pointer target uses `space-40 + space-4`.
- BadgeAnchor overlay is inert and aria-hidden, including when visible. The caller owns accessible status in the child control's name. Visibility uses token-driven transform/opacity; motion=none measured 0s.
- BadgeGroup uses native auto-popover, a Button trigger, and the existing Popover skin. Enter/Space opens; focus enters the named group; Escape/light dismissal closes and native focus restoration returns to +N. Content stays in the same DOM theme scope and appears in the top layer. Popup max dimensions prevent viewport escape; excess content scrolls. No menu role or arrow-key selection is implied.
- Auto-fit measures actual item widths and reserves the full-count trigger width. ResizeObserver and font readiness remeasure; no hidden duplicate item IDs are created. Auto-fit requires hydration; omitted visibleCount simply wraps all items. Inline permits wrapping; overlay keeps one row. Both support numeric overflow disclosure.
- Truncation keeps complete DOM text and derives title for string/number content. Rich content requires an explicit title. Critical explanations should be visible nearby; native title is supplemental.
- Browser checks: keyboard disclosure/focus restoration, 24px medium default, compact density, invariant pill shape across all radius presets, light/dark, increased contrast, system-font override and density-driven UI type, RTL, 200% CSS zoom specimen, 240px container and narrow viewport behavior. Auto overflow remeasures when available width changes.
- Forced-colors CSS uses Canvas/CanvasText, LinkText and Highlight, with an opaque surface ring. Native Windows forced-colors and screen-reader speech were not executed on this macOS host; no cross-engine/AT certification is claimed.

## Candidate decisions and checklist

Core means the initial default/variant/size contract. Extended rows are implemented and shown lower on the page. Alias/composition avoids duplicate APIs without dropping a capability.

- [x] **Core — soft default:** `BadgeDefault`, `BadgeVariants`.
- [x] **Core — solid:** `BadgeVariants`, `BadgeToneMatrix`.
- [x] **Core — outline tone stroke:** `BadgeVariants`, `BadgeToneMatrix`.
- [x] **Core — ghost:** `BadgeVariants`, `BadgeToneMatrix`.
- [x] **Core — plain/link:** `BadgeVariants`, `BadgeLink`.
- [x] **Extended — dot:** `BadgeDotSoft`, `BadgeDotOutline`, `BadgeDotMatrix`.
- [x] **Extended — semantic/inverted tones:** `BadgeTones`, `BadgeToneMatrix` (includes Area caution).
- [x] **Extended — custom/brand tone:** `BadgeCustomBrand`, `BadgeToneMatrix`.
- [x] **Core — sm/md/lg and dot-only:** `BadgeSizes`, `BadgeDotOnly`.
- [x] **Alias/composition — rounded/pill/square terminology:** rounded and circular resolve to the invariant pill shape; square is rejected because it would erase the visual distinction from a Button.
- [x] **Extended — text, leading/trailing/icon-only/number:** `BadgeDefault`, `BadgeLeadingIcon`, `BadgeTrailingIcon`, `BadgeIconOnly`, `BadgeIconCircle`, `BadgeNumber`.
- [x] **Composition — lifecycle state labels:** `BadgeStateLabels` (Open, Merged, Closed, Draft, Queued).
- [x] **Extended — bounded ellipsis:** `BadgeTruncation`, `BadgeStress`.
- [x] **Extended — small tracking/strong/uppercase:** `BadgeUppercase`, `BadgeSizes`.
- [x] **Extended — span/native anchor:** `BadgeDefault`, `BadgeLink`, `BadgeLinkSoft`.
- [x] **Companion — anchored:** `BadgeAnchorButton`, `BadgeAnchorAvatar`, `BadgeAnchorTab`, `BadgeAnchorPlacements`, `BadgeAnchorVisibility`.
- [x] **Companion — group:** `BadgeGroupWrap`, `BadgeGroupInline`, `BadgeGroupOverlay`, `BadgeGroupAuto`.
- [x] **Extended — static/link hover/focus:** `BadgeLink`, `BadgeLinkSoft`, `BadgeAuditControls` (tested through native interaction).

The remaining requested demo-list contexts are `BadgeTableStatus`, `BadgeNavNew`, `BadgeCardHeading` (a complete card specimen), and `BadgeBothThemes`. `BadgeStress` adds long German, RTL and 200% zoom; `BadgeAuditControls` exposes theme/density/radius/font/motion/contrast/direction. The gallery shows separate matrix cells, sizes, states and anchor placements. The 2026-09-18 owner review removed duplicate theme, table-row and stress tiles. Theme/stress/audit fixtures remain in a collapsed verification section on the Badge page; table status remains a composition example, not a Badge variant. A BadgeGroup tile contains one composite group specimen because multiple children are intrinsic to that component.

## Final contract

- `badge`: variant soft/solid/outline/ghost/plain; tone neutral/accent/info/success/warning/caution/danger/discovery/inverted/custom; size sm/md/lg; booleans pill/dot/dot-only/icon-only/truncate/uppercase; elements dot/leading-icon/label/trailing-icon. Defaults soft/neutral/md; shape is always pill. React adds `as`, `icon`, `trailingIcon`, and native props/ref overloads.
- `badgeAnchor`: placement top-end/top-start/bottom-end/bottom-start; overlap-rectangular/overlap-circular; state invisible; element badge. React exposes `overlap="rectangular|circular"`, `badge`, `offset`, `invisible`.
- `badgeGroup`: overflow inline/overlay; elements item/overflow-trigger/overflow-content. React adds visibleCount (omitted/auto/nonnegative finite number) and overflowLabel.
- Alias metadata: tint/subtle/secondary→soft; filled/bold→solid; bordered→outline; link→plain; circular/rounded→default pill shape; StateLabel→solid + icon; Lozenge→Badge; Pill→Badge link. Ghost/plain remain distinct; inverted remains distinct from neutral solid. Classification-specific Label/Tag is not globally aliased to Badge.

## Token decisions

All lengths come from shared density/spacing/radius/stroke/focus tokens or their calculations. Reference 5px padding and 18/22px heights are not copied. No unexplained component pixel literals were added. Geometry/layout zeros and percentage positioning are structural.

New unregistered base derivations, re-emitted at axis boundaries:

- `badge-bg → bg-component`, `badge-fg → fg-default`: product brand-paint seam. The custom tone repoints tone slots; variants remain orthogonal. Consumers supplying a gradient/color must supply and validate a readable foreground, including transparent variants.
- `badge-max-width → space-40 × 5`: stable truncation measure, overridable per product/context.
- `badge-tracking-wide → 0.04em`: explicit optional small-chrome tracking role. Weight remains shared `weight-strong` (500), not imported 600.
- Anchor offset is an optional local custom property with a space-0 fallback, not a global axis token.

Soft/solid/outline/ghost/plain reuse tested semantic foreground/fill pairs. Inverted transparent labels add explicit bg-inverse-on-page/surface/hover assertions. Custom defaults use existing tested neutral text/surface endpoints. The Pro demo uses discovery-solid→discovery-solid-hover with fg-on-discovery; both endpoints are covered by existing assertions. Arbitrary consumer gradients cannot be certified by a finite built-in suite. No palette values, thresholds or waivers changed.

Rendered matrix checks covered 200 cells (50 × two themes × two contrast preferences), all ≥4.5:1; minimum measured 4.609:1. Static Badge edges supplement readable text; they do not act as the only control/status indicator. This follows the repository's [contrast policy](../CONTRAST.md), not the brief's blanket soft-boundary assertion.

## Implementation

CSS extracted from display.css; React extracted from primitives.tsx. Added companion manifests/helpers/exports, alias metadata, tokens, contrast assertions, SSR/coverage tests, docs API/practices, the atlas companion names, and the radius-source correction. Docs snippets still come from the real demo file; extraction now preserves block-bodied hook demos. Only Badge demos hydrate, using renderToString and matching identifier prefixes. Other docs remain static.

Migration: existing Badge imports and props work. `dot` neutralizes the soft/outline label while retaining the colored indicator. Default neutral text follows fg-default. The public size union is now sm/md/lg; former xs/xl audit-only values are removed. `pill` remains compatible, while all Badge instances use the same full radius. Explicit default classes are emitted. No new Badge shape axis, state-label enum, counter formatting, or duplicated variant aliases.

## Verification

V2 docs-only update: fresh gallery measurements above and `git diff --check`; no
component changes or new build/test claims. The following checks are historical results
from the implementation audit, not a claim that the open v2 geometry bugs pass.

- `npm run build`: passed (also included in build:docs).
- `npm run lint:manifest`: passed, 40 components.
- `npm test`: passed, 18,401 tests / 9 files.
- `npm run typecheck`: passed across all workspaces, including Badge browser entry.
- `npm run build:docs`: passed; dogfood 40/40, no unapproved raw styles.
- `npm run test:badge`: 6 tests passed: full contract, native semantics, accessible naming, inert anchor, group relationships, page/gallery coverage and 50-cell matrix.
- `node packages/tokens/src/contrast/report.ts`: 350 passing / 0 failing, 66 themes.
- `npm run test:consumer`: passed when run against the completed build (imports, strict NodeNext, SSR, browser bundle, tree-shaking).
- `git diff --check`: passed.
- Browser verification: default light and compact dark; sharp and pill radius extremes; 390×844 and desktop viewports; anchor button/avatar/tab, card heading and one-item gallery tiles inspected. The 20/24/32px heights and invariant full radius were measured at both densities. Rectangular count centres align with the owner corner; the avatar dot centre is 14% inward and its 2px ring crosses the edge. The right gallery rail changes theme, neutral, accent, UI scale, radius, surface, contrast and motion. No horizontal overflow or console warnings/errors were present.

## Remaining limits

Native Windows forced colors, screen-reader speech and other browser engines remain release validation, consistent with the wider repository. Brand overrides require consumer contrast checks. Font fallback may change intrinsic widths; automatic overflow remeasures after fonts load. The native overflow popover is viewport-bounded and centered, not a collision-positioning library. Source-only CSS consumers implement their own automatic fitting if they do not use React; native numeric popover markup works without hydration.


### Gallery clarification — 2026-09-18

`BadgeGroup overflow="inline"` allows wrapping; `overflow="overlay"` prevents wrapping.
Both disclose hidden children through the same native popover. `visibleCount="auto"`
measures the available width and is independent of overflow layout. The +N trigger is
a small ghost Button and follows Button radius; it is not a static pill Badge. No shape
or public API changes were made during this clarification.
