# Badge spec

**Status:** complete · 2026-10-12 (approved, review round 9)
uppercase removal built and validated)
**Captures:** `docs/research/captures/badge/`
**Peers:** Indicator (dot, count numerals, tone paint), Chip (pill shape, interactive
choice), Button (label weight, icon slot), Kbd and Code (small inline chrome), Table and
Nav (host compositions)

## Owner decisions

Dated, oldest first. Moved from [prior decisions](PRIOR_DECISIONS.md) on 2026-09-25. A
later record supersedes an earlier one where they conflict. Dimensions recorded before
this spec were not captured with the script; the Measurements section re-verifies them.

- 2026-09-24 (control refinement, sizes superseded below): the screenshot regressions
  were traced to implementation, not screen scaling. Default was set to 20px with 12px
  icons and equal 4px outer icon insets; small/large 16/24px. Closed native popovers
  stay hidden, overlay content must not shrink inside a badge row, and tabs reserve
  space for anchored badges.
- 2026-09-24 (Untitled UI follow-up): follow Untitled UI's badge structure, superseding
  the 16/20/24px scale. Its source uses 20/24/28px text badges (sm/md/lg), 12px icons,
  16px images and content-dependent horizontal gutters. Area follows that scale: pill
  text gutters 8/10/12px; icon-side 6/8/10px; icon gaps 2/4/4px; dot/media gaps 4/6/6px.
  Border width is subtracted once in `inset.css`. This is an explicit badge exception to
  the usual equal optical inset formula, with no per-glyph adjustment. Medium is 24px;
  choose small for the 20px badge. Added `variant="color"` (tinted fill and border),
  `variant="modern"` (neutral surface, subtle shadow, colored addon), avatar/flag slots
  and a native dismiss button with a required `dismissLabel`. Links cannot contain
  dismiss buttons. Media is decorative; its meaning belongs in the visible label.
  Untitled's color recipe (utility-50 fill, -200 ring, -700 text, -500 addon) maps to
  Area's semantic counterparts so contrast and theme behavior are retained. No palette
  colors or contrast thresholds changed.
- 2026-09-24 (Badge / Indicator / BadgeGroup separation): badges are **pill-only**;
  ghost, plain, custom and `shape="rounded"` are removed. Indicator and IndicatorAnchor
  own compact counts, presence and attachments. BadgeGroup is a separate layout family:
  omit `visibleCount` to wrap all, set a number to cap, or `auto` to fit; inline wraps,
  overlay keeps one line, both use the same native overflow popover.
- 2026-09-24: badge icons use native Fluent 16px artwork in 16px boxes (the 16-to-12
  downscale read too small). Dot badges follow Untitled's small Dot: an 8px slot
  containing a 6px painted circle, with 4/6/6px slot-to-text gaps.
- 2026-09-24 (icon inset follow-up): leading/trailing 16px slots use equal outer insets
  of 2/4/6px at sm/md/lg; text and dot gutters stay unchanged. Dismiss uses a 12px cut
  inside its 16px action box. The single Link example is a neutral-soft native anchor
  with a link icon. Navigation does not assign a tone.
- 2026-09-25: the dismiss glyph is Area-drawn (`packages/react/src/components/glyphs.ts`),
  per the icon pass.
- 2026-09-25: the owner likes where Badge is; this pass audits it against evidence and
  proposes changes rather than rebuilding.
- 2026-09-25: accepted the recommendations: size scale 16 / 20 / 24 with md 20 as the
  default (supersedes the 20 / 24 / 28 Untitled scale), neutral badges in secondary ink,
  a 2px dismiss gap, uppercase removed, truncation kept as a behaviour. Each design pass
  is shown before/after, at 1× and at scale, in a container above the variant tiles.
- 2026-09-27: md labels read too large on cards (14/500 text equalled the card description
  and outweighed it). Owner chose md text **12/16** at 20px, keeping weight 500; lg keeps
  14/20. Supersedes the 14/20 md row in Decisions. Measured after: every md badge in the
  gallery is 20px with 12/16 500 text; the label still shares the sentence baseline (0.00px),
  but a 12px cap centred in 20px hangs 0.7px below a 14/20 line, so a sentence line is 20.7
  and table rows with badges grow by the same 0.7px. Open: whether to absorb it.

## Job and boundaries

Badge labels content with a short status or metadata word ("Paid", "Beta", "Draft"),
optionally with a dot, icon, avatar or flag, and optionally links to details or offers a
dismiss action. It stands alone in content: a table cell, a list row, a heading, a nav
item's trailing slot.

Not Badge: a count or dot attached to another element (Indicator), a selectable or
removable filter choice that is the control itself (Chip), a keyboard key (Kbd), inline
code (Code). BadgeGroup lays badges out; it adds no badge paint.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| treatment | soft | Tinted fill, no border: the product default for tags and status | ChatGPT billing "Paid"; Notion select, status and board tags; Untitled pill-color |
| treatment | outline | Border only, for quiet metadata beside dense text | Figma "AI" label; ChatGPT sidebar "NEW" |
| treatment | solid | Strong fill for a state that must read at a glance | Figma plan and role badges ("Free", "Guest") on its dark menu |
| treatment | color | Tinted fill plus tinted border | Untitled badge-color (Area keeps it pill-shaped) |
| treatment | modern | Neutral surface, subtle shadow, colored addon | Untitled badge-modern |
| tone | neutral, info, success, warning, caution, danger, discovery, inverse | Semantic paint | Notion's tag palette (purple, blue, yellow, green, brown, red); Untitled's twelve colors |
| size | sm 16, md 20 (default), lg 24 | Owner (2026-09-25) | Kbd 16/20; Indicator count 16; Notion 20; ChatGPT 16 and 22; Figma 16 and 18; Untitled 22/24/28 |
| composition | dot, dot only | Status with a colored dot; a dot with no label | Notion status property (every status tag); Untitled with-dot; gallery "Dot only" |
| composition | leading/trailing icon, icon-only | Glyph plus label | Untitled with-icon; none of the target products showed one |
| composition | avatar, flag | Person or locale | Untitled with-avatar/flag; none of the target products showed one |
| composition | dismiss | Removable label | Untitled with-close; none of the target products showed one on a badge |
| composition | link | Badge that navigates | Figma "AI" label is inside a link |
| behaviour | truncate | Long labels | Notion status truncates with an ellipsis |

Excluded variants and why: uppercase (removed 2026-09-25; see Decisions). Rounded
(4–6px) shape: Notion select tags, ChatGPT "Paid" and
Figma labels use 4–5px corners, but the owner fixed badges as pill-only on 2026-09-24;
Notion's status tags (the dot composition) are pills. Recorded as evidence, not adopted.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (rendered + source) | Pill color sm/md/lg, color, modern, dot, icon leading/trailing/only, close, avatar | Rendered: untitledui.com/react/components/badges (2026-09-25). Source: [untitleduico/react](https://github.com/untitleduico/react) @ `8b7409c078f81ab89dfc5943ec185ec369932804`, `components/base/badges/badges.tsx` | MIT | `uui--*` (11) |
| chatgpt | target product | Billing transaction status "Paid"; sidebar "NEW" pill (from the Indicator pass) | chatgpt.com/settings/billing, logged in (Edge), 2026-09-25 | evidence only | `chatgpt--status-paid--rest--light`, `../indicator/chatgpt--badge-new--rest--light` |
| notion | target product | Board group tags (4 tones), select tags in a table (2 tones), status tags with dot (2 tones) | app.notion.com, owner's "tasks" board and "returns" table, logged in (Edge), 2026-09-25 | evidence only | `notion--*` (8) |
| figma | target product | "AI" label beside the file-browser prompt; "Free" plan badge in the team menu | figma.com/files, logged in (Edge), 2026-09-25 | evidence only | `figma--label-ai--rest--light`, `figma--plan-free-menu--rest--dark` |
| area | this system | Current build, 19 specimens | localhost gallery, `components` branch at `c672f38` | — | `area--*` (19) |

Target products searched without an equivalent:
- **ChatGPT:** home, model picker, Plugins (all sections), Skills, Explore menu, account
  menu, Settings (General, Personalization, Account, Usage, Security, Storage, Pets,
  Notifications, Voice). Only Billing had a badge. The Codex route served the marketing
  page; the Chat/Work switch was not used because it may be a stored preference.
- **Figma:** file browser (recents, More menu, team menu). The editor was not opened.
- Nobody's badge showed a dismiss button, avatar, flag or icon in the states available.

Capture conditions: light theme only (switching product themes needs the owner). Notion
ran at 90% browser zoom (device pixel ratio 1.8); the other products at 100%. Computed
CSS lengths do not depend on zoom. The `zoom` field in product captures is unreliable in
the extension (outer/inner width of a docked window); dpr is the reliable indicator.

Second pass, 2026-09-26 (same "tasks" board and "returns" table, light): `notion--status-dot`
here, and `../chip/notion--board-tag` and `../chip/notion--select-tag`, re-measure the three
Notion forms with identical values: all 20px tall; board tag radius 4, padding 0 6, 14px 500;
select tag radius 4, padding 0 6, 14px 400; status tag radius 10 (pill), padding 0 9 0 7,
14px 400, an 8px dot with 5px to the label; tints 0.14–0.28 alpha. Nothing in Decisions changes.

## Anatomy

```
uui (badges.tsx L80–L109, L125–L136, L157–L170, L198–L243, L340–L351)
shell      span  owns: height via py-0.5/py-1 + line height, padding, gap, radius, fill,
                 1px inset ring (box-shadow, no border), text
  indicator svg 8×8 (Dot size sm)   owns: dot box
  icon     svg 12×12, stroke 3 in a 24 viewBox (1.5px)
  action   button 16×16, p-0.5, 12px x glyph
  media    img 16×16 round
```

```
chatgpt "Paid"
shell      span.inline-flex  owns: 22 = 4 + 14 line + 4, 8px sides, 4px radius, fill, text
```

```
notion select / board tag
shell      div inline-flex 20px, 6px sides, 4px radius, alpha fill, text colour
  text     div flex, line-height 20px, ellipsis   owns: truncation
    span   text
notion status
shell      div 20px, 7px start / 9px end, pill (10px radius)
  text     div flex, ellipsis
    div    flex wrapper 13px wide
      indicator div 8×8 round, margin-end 5px   owns: dot paint (a stronger tone rung)
    span   text
```

```
figma "AI" label
shell      div content-box, 1px border #e6e6e6, 4px padding, 16px line → 18px, 5px radius,
           no fill, ink 50% black
figma "Free" (dark menu)
shell      strong content-box, 4px padding, 16px line, 5px radius, fill #444
  text     span ellipsis
```

Area (`packages/styles/src/components/badge.css`, `inset.css` L65–L78):

```
shell      span/a.area-badge   owns: height (block-size), 1px border (transparent unless
                               outline/color/modern), pill radius, fill, gutters
  indicator span.area-badge__dot       8×8 slot; ::before paints the 6px disc
  media     span.area-badge__avatar|flag  16×16 round
  icon      span.area-badge__leading-icon  16×16 viewport
  text      span.area-badge__label     cap-height text box (inset.css trims to the cap)
  icon-end  span.area-badge__trailing-icon 16×16
  action    button.area-badge__dismiss 16×16 visible box, 12px glyph; ::after 24×24 hit target (44 coarse)
```

Inset equations (outer inset = border + shell padding + slot inset), pass-1 md (24px,
now lg). Pass-2 values are in Decisions and checked by `scripts/validate-badge.mjs`:

| Slot | Area | Captured edge from shell | Untitled md |
|---|---|---|---|
| text, both sides | 1 + 9 + 0 = 10 | 10 | 0 + 10 = 10 (ring is a box-shadow) |
| dot start | 1 + 7 + 0 = 8; text 8 + 8 + 6 = 22 | dot 8, text 22 | dot 8, text 22 |
| leading icon start | 1 + 3 = 4; text 4 + 16 + 4 = 24 | icon 4, text 24 | icon 8, text 8 + 12 + 4 = 24 |
| dismiss end | 1 + 3 = 4; text 4 + 16 + 4 = 24 | action 4, text 24 | action 4, text 4 + 16 + **2** = 22 |
| avatar start | 1 + 3 = 4; text 4 + 16 + 6 = 26 | media 4, text 26 | media 4, text 26 |

The text box is the cap-height box, so vertical centring is exact: md cap top 7.03 and
baseline 7.03 from the bottom in 24px. Untitled's line box puts the cap 0.81px low
(cap top 7.31, baseline 6.5).

## Measurements

Pass-1 audit (Area columns are the pass-1 build, now in `before/`). Generated with
`node scripts/capture-compare.mjs` from `docs/research/captures/badge/`. Pasted as generated.

### Shell and text by size, all sources

| slot · property | area · size-sm · rest · light | area · size-md · rest · light | area · size-lg · rest · light | uui · pill-sm · rest · light | uui · pill-md · rest · light | uui · pill-lg · rest · light | chatgpt · status-paid · rest · light | notion · tag-purple · rest · light | notion · select-brown · rest · light | figma · label-ai · rest · light | figma · plan-free-menu · rest · dark | chatgpt · badge-new · rest · light |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **shell** size | 34.46 × 20 | 40.83 × 24 | 40.17 × 28 | 47.09 × 22 | 56.27 × 24 | 60.27 × 28 | 43.8 × 22 | 44.17 × 20 | 39.69 × 20 | 20.34 × 18 | 31.43 × 16 | 31.56 × 16 |
| **shell** padding | 0 7 0 7 | 0 9 0 9 | 0 11 0 11 | 2 8 2 8 | 2 10 2 10 | 4 12 4 12 | 4 8 4 8 | 0 6 0 6 | 0 6 0 6 | 0 4 0 4 | 0 4 0 4 | 1 5 1 5 |
| **shell** border | 1 solid rgba(0, 0, 0, 0) | 1 solid rgba(0, 0, 0, 0) | 1 solid rgba(0, 0, 0, 0) | 0 | 0 | 0 | 0 | 0 | 0 | 1 solid rgb(230, 230, 230) | 0 | 1 solid rgba(0, 0, 0, 0.15) |
| **shell** radius | 9999px | 9999px | 9999px | 9999px | 9999px | 9999px | 4px | 4px | 4px | 5px | 5px | 1.67772e+07px |
| **shell** display / direction | flex | flex | flex | flex | flex | flex | inline-flex | inline-flex | flex | flex | inline-flex | block |
| **shell** align / justify | center · center | center · center | center · center | center | center | center | center | center | center | center · center | center |  |
| **shell** gap (row / column) | 2px / 2px | 4px / 4px | 4px / 4px |  |  |  |  |  |  | 4px / 4px |  |  |
| **shell** position / inset |  |  |  |  |  |  |  |  |  |  | relative auto auto auto auto |  |
| **shell** font | 12px/16px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Geist | 12px/18px 500 Inter | 14px/20px 500 Inter | 14px/20px 500 Inter | 14px/14px 400 -apple-system-body | 14px/16.8px 500 ui-sans-serif | 14px/16.8px 400 ui-sans-serif | 11px/16px 400 Inter | 11px/16px 450 Inter | 8px/12px 600 -apple-system-body |
| **shell** color | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(40, 40, 40) | lab(27.036 0 0) | lab(27.036 0 0) | lab(27.036 0 0) | rgb(93, 93, 93) | rgb(85, 59, 105) | rgb(88, 68, 55) | rgba(0, 0, 0, 0.5) | rgb(255, 255, 255) | rgb(143, 143, 143) |
| **shell** background | rgb(247, 247, 247) | rgb(247, 247, 247) | rgb(247, 247, 247) | lab(98.26 0 0) | lab(98.26 0 0) | lab(98.26 0 0) | rgb(243, 243, 243) | rgba(92, 0, 163, 0.14) | rgba(127, 51, 0, 0.157) |  | rgb(68, 68, 68) |  |
| **shell** shadow |  |  |  | lab(90.952 0 -0.0000119209) 0px 0px 0px 1px inset | lab(90.952 0 -0.0000119209) 0px 0px 0px 1px inset | lab(90.952 0 -0.0000119209) 0px 0px 0px 1px inset |  |  |  |  |  |  |
| **shell** text cap top / baseline from shell |  |  |  | cap +6.77 · baseline −6.5 · start +8 · end −8 | cap +7.31 · baseline −6.5 · start +10 · end −10 | cap +9.31 · baseline −8.5 · start +12 · end −12 | cap +6.64 · baseline −5.5 · start +8 · end −8 |  |  | cap +5.5 · baseline −4.5 · start +5 · end −5 |  | cap +5.86 · baseline −4.5 · start +6 · end −6 |
| **shell** text cap / x height |  |  |  | 8.73 / 6.55 | 10.19 / 7.64 | 10.19 / 7.64 | 9.86 / 7.37 |  |  | 8 / 6 |  | 5.64 / 4.27 |
| **text** size | 18.46 × 14.52 | 20.83 × 16.94 | 16.17 × 16.94 | — | — | — | — | 32.17 × 20 | — | — | 23.43 × 16 | 31.56 × 16 |
| **text** edge from parent (t r b l) | 2.73 8 2.74 8 | 3.53 10 3.53 10 | 5.53 12 5.53 12 | — | — | — | — | 0 6 0 6 | — | — | 0 4 0 4 |  |
| **text** edge from shell (t r b l) | 2.73 8 2.75 8 | 3.53 10 3.53 10 | 5.53 12 5.53 12 | — | — | — | — | 0 6 0 6 | — | — | 0 4 0 4 |  |
| **text** padding | 3 0 3 0 | 3.5 0 3.5 0 | 3.5 0 3.5 0 | — | — | — | — | 0 | — | — | 0 | 1 5 1 5 |
| **text** border | 0 | 0 | 0 | — | — | — | — | 0 | — | — | 0 | 1 solid rgba(0, 0, 0, 0.15) |
| **text** radius | 0px | 0px | 0px | — | — | — | — | 0px | — | — | 0px | 1.67772e+07px |
| **text** display / direction | block | block | block | — | — | — | — | flex | — | — | block | block |
| **text** align / justify |  |  |  | — | — | — | — | center | — | — |  |  |
| **text** font | 12px/16px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Geist | — | — | — | — | 14px/20px 500 ui-sans-serif | — | — | 11px/16px 450 Inter | 8px/12px 600 -apple-system-body |
| **text** color | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(40, 40, 40) | — | — | — | — | rgb(85, 59, 105) | — | — | rgb(255, 255, 255) | rgb(143, 143, 143) |
| **text** text cap top / baseline from shell | cap +5.74 · baseline −5.74 · start +8 · end −8 | cap +7.03 · baseline −7.03 · start +10 · end −10 | cap +9.03 · baseline −9.03 · start +12 · end −12 | — | — | — | — |  | — | — | cap +4.5 · baseline −3.5 · start +4 · end −4 | cap +5.86 · baseline −4.5 · start +6 · end −6 |
| **text** text cap / x height | 8.52 / 6.38 | 9.94 / 7.45 | 9.94 / 7.45 | — | — | — | — |  | — | — | 8 / 6 | 5.64 / 4.27 |

Sources:
- area · size-sm · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.740Z, dpr 2, zoom 1.48) — area--size-sm--rest--light.json
- area · size-md · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.759Z, dpr 2, zoom 1.48) — area--size-md--rest--light.json
- area · size-lg · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.764Z, dpr 2, zoom 1.48) — area--size-lg--rest--light.json
- uui · pill-sm · rest · light: https://www.untitledui.com/react/components/badges (captured 2026-09-25T20:31:43.074Z, dpr 2, zoom 1.48) — uui--pill-sm--rest--light.json
- uui · pill-md · rest · light: https://www.untitledui.com/react/components/badges (captured 2026-09-25T20:31:43.076Z, dpr 2, zoom 1.48) — uui--pill-md--rest--light.json
- uui · pill-lg · rest · light: https://www.untitledui.com/react/components/badges (captured 2026-09-25T20:31:43.077Z, dpr 2, zoom 1.48) — uui--pill-lg--rest--light.json
- chatgpt · status-paid · rest · light: https://chatgpt.com (captured 2026-09-25T20:37:08.775Z, dpr 2, zoom 0.26) — chatgpt--status-paid--rest--light.json
- notion · tag-purple · rest · light: https://app.notion.com (captured 2026-09-25T20:40:41.487Z, dpr 1.7999999523162842, zoom 0.51) — notion--tag-purple--rest--light.json
- notion · select-brown · rest · light: https://app.notion.com (captured 2026-09-25T20:42:34.072Z, dpr 1.7999999523162842, zoom 0.51) — notion--select-brown--rest--light.json
- figma · label-ai · rest · light: https://www.figma.com (captured 2026-09-25T20:45:18.404Z, dpr 2, zoom 0.57) — figma--label-ai--rest--light.json
- figma · plan-free-menu · rest · dark: https://www.figma.com (captured 2026-09-25T20:46:14.352Z, dpr 2, zoom 0.31) — figma--plan-free-menu--rest--dark.json
- chatgpt · badge-new · rest · light: https://chatgpt.com (captured 2026-09-25T05:38:29.081Z, dpr 2, zoom 1.01) — ../indicator/chatgpt--badge-new--rest--light.json

### Dot

| slot · property | area · dot-success · rest · light | uui · dot-md · rest · light | notion · status-dot-yellow · rest · light |
|---|---|---|---|
| **shell** size | 85.73 × 24 | 68.27 × 24 | 114.01 × 20 |
| **shell** padding | 0 9 0 7 | 2 10 2 8 | 0 9 0 7 |
| **shell** border | 1 solid rgba(0, 0, 0, 0) | 0 | 0 |
| **shell** radius | 9999px | 9999px | 10px |
| **shell** display / direction | flex | flex | flex |
| **shell** align / justify | center · center | center | center |
| **shell** gap (row / column) | 6px / 6px | 6px / 6px |  |
| **shell** font | 14px/20px 500 Geist | 14px/20px 500 Inter | 14px/16.8px 400 ui-sans-serif |
| **shell** color | rgb(0, 119, 52) | lab(27.036 0 0) | rgb(101, 81, 33) |
| **shell** background | rgb(237, 245, 237) | lab(98.26 0 0) | rgba(209, 156, 0, 0.282) |
| **shell** shadow |  | lab(90.952 0 -0.0000119209) 0px 0px 0px 1px inset |  |
| **shell** text cap top / baseline from shell |  | cap +7.31 · baseline −6.5 · start +22 · end −10 |  |
| **shell** text cap / x height |  | 10.19 / 7.64 |  |
| **text** size | 53.73 × 16.94 | — | — |
| **text** edge from parent (t r b l) | 3.53 10 3.53 22 | — | — |
| **text** edge from shell (t r b l) | 3.53 10 3.53 22 | — | — |
| **text** padding | 3.5 0 3.5 0 | — | — |
| **text** border | 0 | — | — |
| **text** radius | 0px | — | — |
| **text** display / direction | block | — | — |
| **text** font | 14px/20px 500 Geist | — | — |
| **text** color | rgb(0, 119, 52) | — | — |
| **text** text cap top / baseline from shell | cap +7.03 · baseline −7.03 · start +22 · end −10 | — | — |
| **text** text cap / x height | 9.94 / 7.45 | — | — |
| **indicator** size | 8 × 8 | 8 × 8 | 7.99 × 7.99 |
| **indicator** edge from parent (t r b l) | 8 69.73 8 8 | 8 52.27 8 8 | 0 5 0 0 |
| **indicator** edge from shell (t r b l) | 8 69.73 8 8 | 8 52.27 8 8 | 6 99.02 6.01 7 |
| **indicator** padding | 0 | 0 | 0 |
| **indicator** border | 0 | 0 | 0 |
| **indicator** radius | 0px | 0px | 99px |
| **indicator** display / direction | grid | block | flex |
| **indicator** align / justify | center |  |  |
| **indicator** color |  | lab(48.496 0 0) |  |
| **indicator** background |  |  | rgb(216, 163, 47) |
| **indicator** svg viewBox · rendered |  | 0 0 8 8 · 8 × 8 |  |
| **indicator** svg ink from shell (t r b l) |  | 9.5 53.77 9.5 9.5 |  |
| **indicator** fill |  | none |  |
| **indicator** pseudo | ::before 6px × 6px rgb(0, 133, 60) r=9999px |  |  |

Sources:
- area · dot-success · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.788Z, dpr 2, zoom 1.48) — area--dot-success--rest--light.json
- uui · dot-md · rest · light: https://www.untitledui.com/react/components/badges (captured 2026-09-25T20:31:43.080Z, dpr 2, zoom 1.48) — uui--dot-md--rest--light.json
- notion · status-dot-yellow · rest · light: https://app.notion.com (captured 2026-09-25T20:42:34.076Z, dpr 1.7999999523162842, zoom 0.51) — notion--status-dot-yellow--rest--light.json

### Icons

| slot · property | area · leading-icon · rest · light | uui · icon-leading-md · rest · light | area · trailing-icon · rest · light | uui · icon-trailing-md · rest · light | area · icon-only · rest · light | uui · icon-only-sm · rest · light |
|---|---|---|---|---|---|---|
| **shell** size | 76.13 × 24 | 70.27 × 24 | 76.13 × 24 | 70.27 × 24 | 24 × 24 | 22 × 22 |
| **shell** padding | 0 9 0 3 | 2 10 2 8 | 0 3 0 9 | 2 8 2 10 | 0 | 5 |
| **shell** border | 1 solid rgba(0, 0, 0, 0) | 0 | 1 solid rgba(0, 0, 0, 0) | 0 | 1 solid rgba(0, 0, 0, 0) | 0 |
| **shell** radius | 9999px | 9999px | 9999px | 9999px | 9999px | 9999px |
| **shell** display / direction | inline-flex | flex | inline-flex | flex | inline-flex | flex |
| **shell** align / justify | center · center | center | center · center | center | center · center | center |
| **shell** gap (row / column) | 4px / 4px | 4px / 4px | 4px / 4px | 4px / 4px | 4px / 4px |  |
| **shell** font | 14px/20px 500 Geist | 14px/20px 500 Inter | 14px/20px 500 Geist | 14px/20px 500 Inter |  |  |
| **shell** color | rgb(40, 40, 40) | lab(27.036 0 0) | rgb(40, 40, 40) | lab(27.036 0 0) |  |  |
| **shell** background | rgb(247, 247, 247) | lab(98.26 0 0) | rgb(247, 247, 247) | lab(98.26 0 0) | rgb(247, 247, 247) | lab(98.26 0 0) |
| **shell** shadow |  | lab(90.952 0 -0.0000119209) 0px 0px 0px 1px inset |  | lab(90.952 0 -0.0000119209) 0px 0px 0px 1px inset |  | lab(90.952 0 -0.0000119209) 0px 0px 0px 1px inset |
| **shell** text cap top / baseline from shell |  | cap +7.31 · baseline −6.5 · start +24 · end −10 |  | cap +7.31 · baseline −6.5 · start +10 · end −24 |  |  |
| **shell** text cap / x height |  | 10.19 / 7.64 |  | 10.19 / 7.64 |  |  |
| **text** size | 42.13 × 16.94 | — | 42.13 × 16.94 | — | — | — |
| **text** edge from parent (t r b l) | 3.53 10 3.53 24 | — | 3.53 24 3.53 10 | — | — | — |
| **text** edge from shell (t r b l) | 3.53 10 3.53 24 | — | 3.53 24 3.53 10 | — | — | — |
| **text** padding | 3.5 0 3.5 0 | — | 3.5 0 3.5 0 | — | — | — |
| **text** border | 0 | — | 0 | — | — | — |
| **text** radius | 0px | — | 0px | — | — | — |
| **text** display / direction | block | — | block | — | — | — |
| **text** font | 14px/20px 500 Geist | — | 14px/20px 500 Geist | — | — | — |
| **text** color | rgb(40, 40, 40) | — | rgb(40, 40, 40) | — | — | — |
| **text** text cap top / baseline from shell | cap +7.03 · baseline −7.03 · start +24 · end −10 | — | cap +7.03 · baseline −7.03 · start +10 · end −24 | — | — | — |
| **text** text cap / x height | 9.94 / 7.45 | — | 9.94 / 7.45 | — | — | — |
| **icon** size | 16 × 16 | 12 × 12 | — | 12 × 12 | 16 × 16 | 12 × 12 |
| **icon** edge from parent (t r b l) | 4 56.13 4 4 | 6 50.27 6 8 | — | 6 8 6 50.27 | 4 4 4 4 | 5 5 5 5 |
| **icon** edge from shell (t r b l) | 4 56.13 4 4 | 6 50.27 6 8 | — | 6 8 6 50.27 | 4 4 4 4 | 5 5 5 5 |
| **icon** padding | 0 | 0 | — | 0 | 0 | 0 |
| **icon** border | 0 | 0 | — | 0 | 0 | 0 |
| **icon** radius | 0px | 0px | — | 0px | 0px | 0px |
| **icon** display / direction | flex | block | — | block | flex | block |
| **icon** align / justify | center · center |  | — |  | center · center |  |
| **icon** color |  | lab(48.496 0 0) | — | lab(48.496 0 0) |  | lab(48.496 0 0) |
| **icon** svg viewBox · rendered |  | 0 0 24 24 · 12 × 12 | — | 0 0 24 24 · 12 × 12 |  | 0 0 24 24 · 12 × 12 |
| **icon** svg ink from shell (t r b l) |  | 8.5 52.77 8.5 10.5 | — | 8.5 10.5 8.5 52.77 |  | 7.5 7.5 7.5 7.5 |
| **icon** fill |  | none | — | none |  | none |
| **icon-end** size | — | — | 16 × 16 | — | — | — |
| **icon-end** edge from parent (t r b l) | — | — | 4 4 4 56.13 | — | — | — |
| **icon-end** edge from shell (t r b l) | — | — | 4 4 4 56.13 | — | — | — |
| **icon-end** padding | — | — | 0 | — | — | — |
| **icon-end** border | — | — | 0 | — | — | — |
| **icon-end** radius | — | — | 0px | — | — | — |
| **icon-end** display / direction | — | — | flex | — | — | — |
| **icon-end** align / justify | — | — | center · center | — | — | — |

Sources:
- area · leading-icon · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.772Z, dpr 2, zoom 1.48) — area--leading-icon--rest--light.json
- uui · icon-leading-md · rest · light: https://www.untitledui.com/react/components/badges (captured 2026-09-25T20:31:43.080Z, dpr 2, zoom 1.48) — uui--icon-leading-md--rest--light.json
- area · trailing-icon · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.779Z, dpr 2, zoom 1.48) — area--trailing-icon--rest--light.json
- uui · icon-trailing-md · rest · light: https://www.untitledui.com/react/components/badges (captured 2026-09-25T20:31:43.081Z, dpr 2, zoom 1.48) — uui--icon-trailing-md--rest--light.json
- area · icon-only · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.785Z, dpr 2, zoom 1.48) — area--icon-only--rest--light.json
- uui · icon-only-sm · rest · light: https://www.untitledui.com/react/components/badges (captured 2026-09-25T20:31:43.081Z, dpr 2, zoom 1.48) — uui--icon-only-sm--rest--light.json

### Dismiss and avatar

| slot · property | area · dismissible · rest · light | uui · close-md · rest · light | area · avatar · rest · light | uui · avatar-md · rest · light |
|---|---|---|---|---|
| **shell** size | 79.5 × 24 | 68.27 × 24 | 118.39 × 24 | 72.27 × 24 |
| **shell** padding | 0 3 0 9 | 2 4 2 10 | 0 9 0 3 | 2 10 2 4 |
| **shell** border | 1 solid rgb(232, 219, 246) | 0 | 1 solid rgb(243, 243, 243) | 0 |
| **shell** radius | 9999px | 9999px | 9999px | 9999px |
| **shell** display / direction | inline-flex | flex | inline-flex | flex |
| **shell** align / justify | center · center | center | center · center | center |
| **shell** gap (row / column) | 4px / 4px | 2px / 2px | 6px / 6px | 6px / 6px |
| **shell** font | 14px/20px 500 Geist | 14px/20px 500 Inter | 14px/20px 500 Geist | 14px/20px 500 Inter |
| **shell** color | rgb(106, 20, 199) | lab(27.036 0 0) | rgb(40, 40, 40) | lab(27.036 0 0) |
| **shell** background | rgb(234, 229, 255) | lab(98.26 0 0) | rgb(255, 255, 255) | lab(98.26 0 0) |
| **shell** shadow |  | lab(90.952 0 -0.0000119209) 0px 0px 0px 1px inset | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px | lab(90.952 0 -0.0000119209) 0px 0px 0px 1px inset |
| **shell** text cap top / baseline from shell |  | cap +7.31 · baseline −6.5 · start +10 · end −22 |  | cap +7.31 · baseline −6.5 · start +26 · end −10 |
| **shell** text cap / x height |  | 10.19 / 7.64 |  | 10.19 / 7.64 |
| **text** size | 45.5 × 16.94 | — | 82.39 × 16.94 | — |
| **text** edge from parent (t r b l) | 3.53 24 3.53 10 | — | 3.53 10 3.53 26 | — |
| **text** edge from shell (t r b l) | 3.53 24 3.53 10 | — | 3.53 10 3.53 26 | — |
| **text** padding | 3.5 0 3.5 0 | — | 3.5 0 3.5 0 | — |
| **text** border | 0 | — | 0 | — |
| **text** radius | 0px | — | 0px | — |
| **text** display / direction | block | — | block | — |
| **text** font | 14px/20px 500 Geist | — | 14px/20px 500 Geist | — |
| **text** color | rgb(106, 20, 199) | — | rgb(40, 40, 40) | — |
| **text** text cap top / baseline from shell | cap +7.03 · baseline −7.03 · start +10 · end −24 | — | cap +7.03 · baseline −7.03 · start +26 · end −10 | — |
| **text** text cap / x height | 9.94 / 7.45 | — | 9.94 / 7.45 | — |
| **action** size | 16 × 16 | 16 × 16 | — | — |
| **action** edge from parent (t r b l) | 4 4 4 59.5 | 4 4 4 48.27 | — | — |
| **action** edge from shell (t r b l) | 4 4 4 59.5 | 4 4 4 48.27 | — | — |
| **action** padding | 0 | 2 | — | — |
| **action** border | 0 | 0 | — | — |
| **action** radius | 9999px | 9999px | — | — |
| **action** display / direction | flex | flex | — | — |
| **action** align / justify | center · center | center · center | — | — |
| **media** size | — | — | 16 × 16 | 16 × 16 |
| **media** edge from parent (t r b l) | — | — | 4 98.39 4 4 | 4 52.27 4 4 |
| **media** edge from shell (t r b l) | — | — | 4 98.39 4 4 | 4 52.27 4 4 |
| **media** padding | — | — | 0 | 0 |
| **media** border | — | — | 0 | 0 |
| **media** radius | — | — | 9999px | 9999px |
| **media** display / direction | — | — | flex | block |
| **media** font | — | — | 14px/20px 500 Geist |  |
| **media** color | — | — | rgb(40, 40, 40) |  |

Sources:
- area · dismissible · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.816Z, dpr 2, zoom 1.48) — area--dismissible--rest--light.json
- uui · close-md · rest · light: https://www.untitledui.com/react/components/badges (captured 2026-09-25T20:31:43.082Z, dpr 2, zoom 1.48) — uui--close-md--rest--light.json
- area · avatar · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.822Z, dpr 2, zoom 1.48) — area--avatar--rest--light.json
- uui · avatar-md · rest · light: https://www.untitledui.com/react/components/badges (captured 2026-09-25T20:31:43.083Z, dpr 2, zoom 1.48) — uui--avatar-md--rest--light.json

### Treatments

| slot · property | area · soft-neutral · rest · light | area · outline-neutral · rest · light | area · solid-neutral · rest · light | area · color-success · rest · light | area · modern-success · rest · light | uui · color-md · rest · light | uui · modern-md · rest · light |
|---|---|---|---|---|---|---|---|
| **shell** size | 66.38 × 24 | 66.38 × 24 | 66.38 × 24 | 73.73 × 24 | 73.73 × 24 | 52.27 × 24 | 52.27 × 24 |
| **shell** padding | 0 9 0 9 | 0 9 0 9 | 0 9 0 9 | 0 9 0 9 | 0 9 0 9 | 2 8 2 8 | 2 8 2 8 |
| **shell** border | 1 solid rgba(0, 0, 0, 0) | 1 solid color(srgb 0.886275 0.886275 0.886275) | 1 solid rgba(0, 0, 0, 0) | 1 solid rgb(208, 230, 218) | 1 solid rgb(243, 243, 243) | 0 | 0 |
| **shell** radius | 9999px | 9999px | 9999px | 9999px | 9999px | 6px | 6px |
| **shell** display / direction | flex | flex | flex | flex | flex | flex | flex |
| **shell** align / justify | center · center | center · center | center · center | center · center | center · center | center | center |
| **shell** gap (row / column) | 4px / 4px | 4px / 4px | 4px / 4px | 4px / 4px | 4px / 4px |  |  |
| **shell** font | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Inter | 14px/20px 500 Inter |
| **shell** color | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(250, 250, 250) | rgb(0, 119, 52) | rgb(40, 40, 40) | lab(27.036 0 0) | lab(27.036 0 0) |
| **shell** background | rgb(247, 247, 247) |  | rgb(40, 40, 40) | rgb(237, 245, 237) | rgb(255, 255, 255) | lab(98.26 0 0) | rgb(255, 255, 255) |
| **shell** shadow |  |  |  |  | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px | lab(90.952 0 -0.0000119209) 0px 0px 0px 1px inset | lab(84.92 0 -0.0000119209) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px |
| **shell** text cap top / baseline from shell |  |  |  |  |  | cap +7.31 · baseline −6.5 · start +8 · end −8 | cap +7.31 · baseline −6.5 · start +8 · end −8 |
| **shell** text cap / x height |  |  |  |  |  | 10.19 / 7.64 | 10.19 / 7.64 |
| **text** size | 46.38 × 16.94 | 46.38 × 16.94 | 46.38 × 16.94 | 53.73 × 16.94 | 53.73 × 16.94 | — | — |
| **text** edge from parent (t r b l) | 3.53 10 3.53 10 | 3.53 10 3.53 10 | 3.53 10 3.53 10 | 3.53 10 3.53 10 | 3.53 10 3.53 10 | — | — |
| **text** edge from shell (t r b l) | 3.53 10 3.53 10 | 3.53 10 3.53 10 | 3.53 10 3.53 10 | 3.53 10 3.53 10 | 3.53 10 3.53 10 | — | — |
| **text** padding | 3.5 0 3.5 0 | 3.5 0 3.5 0 | 3.5 0 3.5 0 | 3.5 0 3.5 0 | 3.5 0 3.5 0 | — | — |
| **text** border | 0 | 0 | 0 | 0 | 0 | — | — |
| **text** radius | 0px | 0px | 0px | 0px | 0px | — | — |
| **text** display / direction | block | block | block | block | block | — | — |
| **text** font | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Geist | 14px/20px 500 Geist | — | — |
| **text** color | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(250, 250, 250) | rgb(0, 119, 52) | rgb(40, 40, 40) | — | — |
| **text** text cap top / baseline from shell | cap +7.03 · baseline −7.03 · start +10 · end −10 | cap +7.03 · baseline −7.03 · start +10 · end −10 | cap +7.03 · baseline −7.03 · start +10 · end −10 | cap +7.03 · baseline −7.03 · start +10 · end −10 | cap +7.03 · baseline −7.03 · start +10 · end −10 | — | — |
| **text** text cap / x height | 9.94 / 7.45 | 9.94 / 7.45 | 9.94 / 7.45 | 9.94 / 7.45 | 9.94 / 7.45 | — | — |

Sources:
- area · soft-neutral · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.795Z, dpr 2, zoom 1.48) — area--soft-neutral--rest--light.json
- area · outline-neutral · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.807Z, dpr 2, zoom 1.48) — area--outline-neutral--rest--light.json
- area · solid-neutral · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.804Z, dpr 2, zoom 1.48) — area--solid-neutral--rest--light.json
- area · color-success · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.809Z, dpr 2, zoom 1.48) — area--color-success--rest--light.json
- area · modern-success · rest · light: http://localhost:4400/gallery-components.html (captured 2026-09-25T20:28:24.812Z, dpr 2, zoom 1.48) — area--modern-success--rest--light.json
- uui · color-md · rest · light: https://www.untitledui.com/react/components/badges (captured 2026-09-25T20:31:43.078Z, dpr 2, zoom 1.48) — uui--color-md--rest--light.json
- uui · modern-md · rest · light: https://www.untitledui.com/react/components/badges (captured 2026-09-25T20:31:43.079Z, dpr 2, zoom 1.48) — uui--modern-md--rest--light.json

## Decisions

Pass 2 (2026-09-25) values. The Measurements tables above are the pass-1 audit; the
current build is re-captured in `area--*` (80 files, one per gallery tile) and checked
by `node scripts/validate-badge.mjs`. Pass-1 Area captures are in `before/`.

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| shell · height sm/md/lg | **16 / 20 / 24** | Owner (2026-09-25: "do what you recommend") | Replaces 20 / 24 / 28. 16 and 20 are Area's existing inline-chrome heights (Kbd small/normal 16/20, Indicator count 16); the products' badges are 16–22 (ChatGPT 16 and 22, Notion 20, Figma 16 and 18). 28 equalled the small button and read as a control |
| shell · default size | **md 20** | Owner | A 20px badge fills the 20px line of 14/20 text exactly, so it sits in a sentence, a table cell or a 32px nav row (6px above and below) without moving the line |
| shell · radius | pill | Owner (pill-only) | Products use 4–5px for select tags and labels; Notion status (the dot composition) is a pill |
| shell · text gutter sm/md/lg | 6 / 8 / 10 (border counted once) | md: ChatGPT "Paid" 8px at 14px text; sm: ChatGPT "NEW" 6, Figma 5; lg: previous md (Untitled md) | — |
| shell · border (soft) | 1px transparent | Target products: Notion, ChatGPT "Paid" have no border on a filled badge | Untitled rings every badge (inset box-shadow); not adopted for soft |
| shell · border (outline, neutral) | `edge-control` rgb(226) | Figma "AI" border rgb(230) | Within 4 levels; kept |
| text · size / line | **12/16 sm and md; 14/20 lg** | Owner (2026-09-27), after viewing md labels on Card; Untitled sm (12px in a 20–22px pill); Figma 11px in 16–18 | Notion (14 in 20) and ChatGPT (14 in 22) set badge text at body size; beside a 14px description that made the label as large as the text it annotates and heavier. lg keeps 14/20 so the size steps stay distinct |
| text · weight | 500 | Type ramp (badge labels are one of the 500 roles); Untitled 500; Notion board tags 500 | Notion table cells, ChatGPT "Paid" and Figma "AI" use 400; recorded, not adopted |
| text · ink, neutral tone | **`fg-muted`** rgb(102) light, rgb(197) dark | Target-product agreement: ChatGPT "Paid" rgb(93), Figma "AI" 50% black | Applies to neutral soft, outline, color and dot badges; solid keeps its on-solid ink and modern keeps `fg-default`. Contrast ≈ 5.04:1 on the soft plate over white (arithmetic; 5.36:1 on the former #f7) and 5.74:1 (outline) light, 8.54:1 and 9.77:1 dark |
| shell · fill, neutral soft | **Count's translucent plate `light-dark(rgb(0 0 0 / 0.06), rgb(255 255 255 / 0.1))`** ≈ rgb(240) on white; hover 0.107 / 0.226, active 0.123 / 0.279 (badge.css:17, 58-60) | Audit S6a (owner 2026-09-30); Count soft (count.css:68); between Untitled lab 98.3 and ChatGPT rgb(243) | Was `bg-component` rgb(247): on a hovered #f3 row it read as a lighter hole. Hover and press lay the bg-hover / bg-active wash over the 6% plate |
| text · vertical position | cap centred (cap-height box) | `inset.css` rule | Better centred than Untitled's line box |
| dot · slot / disc / start / gap | 8 / 6 / 4·6·8 / 4·4·6 | Owner (6px disc); start equals the slot's vertical inset | Notion paints an 8px dot with a 5px gap |
| icon · slot / inset | 12 at sm; 16 at md, lg; inset (height − slot) / 2 = 2 / 2 / 4 | Owner (16px Fluent at md and above); sm uses native 12px cuts | Callers pass 12px artwork at sm; no current composition uses sm with an icon |
| icon · gap | 2 / 4 / 4 | Untitled (sm gap-0.5, md gap-1) | — |
| media, dismiss · box | 12 at sm; 16 at md, lg | Untitled 16 (md); sm follows the icon slot | — |
| media · start / gap | 2 / 2 / 4; gap 4 / 4 / 6 | Equal inset, as for icons | Pass 1 used 3px at the 20px size |
| dismiss · gap to text | **2 at every size** | Untitled `gap-0.5` (badges.tsx L346–L351) | The dismiss box holds 2px of air around its 12px glyph, so the visible gap is 4px. A dismissible badge uses the 2px gap for every pair of items |
| uppercase | **removed** | Owner (2026-09-25) | Only ChatGPT's 8px "NEW" pill is uppercase; at 12–14px it reads louder than its neighbours. Callers can pass uppercase text |
| truncate | kept, as a behaviour; gallery tile renamed "Behavior / truncation" | Notion truncates status tags with an ellipsis | A long label is a verification case, not a variant (Components guide) |
| tone paint | semantic surface/fg roles | Owner (Area semantic counterparts) | Notion's tones are alpha tints (0.14–0.28) with a desaturated dark ink; recorded for the colour phase |

### Baseline of composed badges (fixed 2026-09-25)

A badge is `inline-flex`, so inside text it takes its baseline from its first item. For
a text-only badge that is the label, which sits exactly on the surrounding baseline. When
a dot, icon, avatar or flag came first, the browser synthesised the baseline from that
slot's bottom edge: in the gallery table the dot badge sat 2px low (row 39px), and in a
14/20 sentence the composed badges opened the line to 25px.

Fix (`badge.css`, inside `@supports (text-box: trim-both cap alphabetic)`): the label is
the badge's only baseline participant (`align-self: baseline`), so it carries the
baseline whatever comes first. A sole baseline participant is placed at the top of the
content box, so the label is padded to the full content height,
`(height − 2 × border − 1cap) / 2` per side (4.03px at md), which puts the cap exactly
where centring put it. Measured after: label bottom minus text bottom is 0.00px for plain,
dot, leading icon, avatar, flag, dismissible, lg and truncated badges in a 14/20 sentence
(−0.5px for sm, whose 12px label shares the line's baseline to the rounding); the line
stays 20px; table cell text and badge label end at the same 27.5px. The validator checks
that every label fills the content box (1px top and bottom insets).

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| rest | as above | all captures |
| hover (link only) | fill → `_bg-hover`; border → `_border-hover`; ink unchanged | No product badge is interactive; Figma's "AI" label is inside a link but has no hover paint of its own. Not captured |
| focus-visible (link, dismiss) | focus ring, offset | Area convention; not captured |
| truncate | ellipsis on the label, full text in `title` | Notion status truncates the same way |

## Behavior and accessibility

Native `span`, or a native `a` when `as="a"`. Icon-only and dot-only badges require an
accessible name and render `role="img"`. Dismiss is a native button with a required
`dismissLabel`; links cannot contain it. The link hit area is at least 24px (44px on
coarse pointers) through `::after`; so is the dismiss button's, centred on its visible box,
which stays the badge's media square (`badge.css:195-197`, audit C-5). Forced colors: Canvas/CanvasText with a CanvasText
border. RTL uses logical properties throughout. Not verified in this pass: screen
readers, forced colors execution, cross-engine rendering.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Kbd | inline chrome height | small 16, normal 20 | sm 16, md 20 | match |
| Indicator | count height | 16 | sm 16 | match; counts attach to owners, badges stand alone |
| Indicator | dot disc | 6px | 6px | match |
| Indicator | label weight | 500 | 500 | match |
| Nav, Tabs | row | 32 | md 20, 6px above and below | centred (captured) |
| Button | label weight | 500 | 500 | match |
| Button | icon viewport | 16 | 16 at md, lg | match |
| Chip | shape | pill | pill | match; Chip is the interactive choice |
| Chip remove | pill close (audit S9) | concentric circle, Area `dismiss` glyph, `currentColor` 12% plate; `onDismiss` + `dismissLabel` | circle (`_badge-radius` full), Area `dismiss` glyph 12, hover `currentColor` 12% (`badge.css:191-194`, audit S9); `onDismiss` + `dismissLabel` | match |
| Count soft, Chip input | neutral soft plate | `light-dark(rgb(0 0 0 / 0.06), rgb(255 255 255 / 0.1))` (count.css:68, chip.css:80) | same | match (audit S6a) |

Baseline checks: small chrome labels are 16–22px in the products (ChatGPT 16 and 22,
Notion 20, Figma 16 and 18). Area's 16 / 20 / 24 spans that range; the default sits in it.

## Visual pass

Pass reviews were removed at the owner's request; Badge is inspected in the grouped
gallery, one variant per tile (the "Dot only" tile was added in the third pass). The
2026-09-25 findings below came from the before/after review of that pass.

- Neutral soft and outline badges on `fg-muted` read as metadata beside body text, the
  way ChatGPT's "Paid" and Figma's "AI" do; toned badges are unchanged, so tone now
  carries more of the emphasis. Icons follow the label ink (`currentColor`).
- With a 2px gap the dismiss glyph reads as part of the label.
- At 20px the default badge sits inside a line of 14/20 text without opening the line;
  24px pushed the line apart.
- 2026-09-28, Claude in Chrome (batch 5), zoomed: the default Badge beside Figma's "AI" label
  (outline, small) and Notion's select tags (tinted, radius 3-4, 14px). Figma's label is
  Badge `outline`; Notion's tags are Badge `soft` with a tone, set larger and squarer than
  Area's 12/16 pill (the owner's 2026-09-27 md size). No change.
- 2026-09-28, second pass (Figma file browser: "Free" plan badge 16 tall, 11/16 500, radius 4, 6
  sides, pale blue tint; "AI" 18 tall, 1px #e6 outline, 11/16 400, 50% ink; `figma--plan-badge`,
  `figma--ai-badge`): the avatar badge's two initials ("IY", 12px) filled its 16px disc edge to edge
  and read as loose text. A 16px avatar holds one initial (Figma's 16px team avatar does the same),
  so the demo shows "I"; an image is the usual content (Untitled's avatar badge). Pill kept.
- Not yet compared: dark theme in the products.

## Verification

- Reference captures: 22 (plus the ChatGPT "NEW" pill from the Indicator pass).
- Area captures: 80, one per gallery tile, after pass 2. `node scripts/validate-badge.mjs`
  checks height per size, square icon/dot-only forms, cap centring, text start and end
  per composition, slot sizes and vertical insets, dot position, and neutral ink:
  80 checked, 0 failing. Run against the 19 pass-1 captures it reports all 19 failing,
  which confirms it tests the new values.
- Checks: `npm run build`, `build:docs` (docs audit), `lint:manifest`, `test:badge` (9),
  `test:contracts` (14), `typecheck`, `npm test` (token math and contrast),
  `test:preview`, `test:consumer`, `git diff --check`: all pass.
- Unverified: dark theme in every product (needs the owner's go-ahead to switch), Figma
  editor badges, hover/focus captures (no product badge is interactive), sm with icons
  (no composition uses it), browsers without `text-box` (they keep the previous centring
  and its baseline behaviour).

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Research: `docs/research/motion-2026-10-07/crispness-and-current-state.md`.


| Interaction | Before | After |
|---|---|---|
| Link / overflow-button hover | `--area-transition` both ways (100ms in) | **instant in** (`transition-duration: 0s` on `:hover`), `fast` ease-out out |
| Dismiss plate hover | no transition: snapped in and out | instant in, `background-color` `fast` `--area-ease-out` out |
| Focus ring | outline, never transitioned | unchanged |

No press colour exists, so there is no press rule; foreground stays fixed. Crispness: the dismiss
and link hit targets centre with `translate: -50% -50%` on invisible boxes only (24 and 44, even),
so nothing painted moves. Verified on `/badge.html` with a real pointer hover: dismiss
`transition-duration` 0s and the 12% plate at full strength at once; at rest the transition is
`background-color 0.1s`.

## Review note, 2026-10-11

- **What changed:** badges with an icon have more room between the icon and the badge's rounded end; avatars and
  flags are unchanged.
- **Why:** you said the icons sat too close to the side. Untitled UI sets a badge's icon 2 inside its text side
  (6 against 8); Area now does the same at every size.

## Review note, 2026-10-11 (round 9)

- **What changed:** badge icons are smaller (12 at every size), and the icon now sits centred in the badge's rounded end, so
  badges with an icon are narrower than in round 8.
- **Why:** you said there was too much spacing at the sides and asked for smaller icons. Untitled UI uses 12 icons in all
  its badge sizes.

## Review note, 2026-10-12 (consistency pass)

- **What changed:** the modern badge's outline is one step firmer (#e2, was the faint #f3; dark #333, was #282828), and a linked one steps to #d4 on hover.
- **Why:** a modern badge is a white raised plate, like the Segmented thumb and a selected soft Toggle group item, which draw #e2 with the same small shadow; on white the #f3 edge all but disappeared. Untitled UI's modern badge, its reference, draws #d5.

## Feedback log

- 2026-10-11 · owner: "the icons seem too close to the horizontal side of the container. the avatar, flag look okay
  its just the icons" → the icon side of a badge is now the text side less 2 (inset.css: icon box = text box + 4):
  sm 3 / md 5 / lg 7 padding (outer 4 / 6 / 8 with the border) where it was 1 / 1 / 3; text sides unchanged (5 / 7 / 9);
  icons keep their native 16 (12 at sm). Basis: Untitled UI md, icon side 6 and text side 8 (`uui--icon-leading-md`).
  Measured in the gallery at 1:1: md icon 6 from the end, label 8. Back to In review.

- 2026-09-25 · owner: "I like where Badge is; open to suggestions from the new process" →
  audit only; three proposals → captures listed in Sources.
- 2026-09-25 · owner: open to 20px as the default and to a more consistent scale; asked
  whether truncation and uppercase are needed; wants each pass shown before/after, above
  the variants and at scale → 16 / 20 / 24 scale with md 20 default, neutral ink, 2px
  dismiss gap, uppercase removed, truncation kept as a behaviour, Pass review container
  → 80 Area captures, validator 0 failing.
- 2026-09-25 · owner: "make the updates to badge" → baseline fix for composed badges and
  a Pass review row showing it in a sentence → 80 captures re-taken, validator (now also
  checking the label fills the content box) 0 failing.
- 2026-09-25 · owner accepted Badge → Complete in `component-status.mjs`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence added,
  no change: the re-captured board, select and status tags match the 2026-09-25 values →
  `badge/notion--status-dot`, `chip/notion--board-tag`, `chip/notion--select-tag`.
- 2026-09-27 · third pass → "Dot only" tile added; Pass review note replaced by the grouped
  gallery → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-28 · batch 5 Claude in Chrome side by side (Figma "AI" label, Notion tags) → no change.
- 2026-09-28 · owner: approved (batch 5).
- 2026-09-28 · second pass → avatar badge demo shows one initial in its 16px disc (owner approved
  the recommendation) → `figma--plan-badge`, `figma--ai-badge`, `area--avatar` re-captured.
- 2026-09-30 · audit S6a (owner) → neutral soft plate is Count's translucent 6% black / 10% white (was `bg-component` #f7, a lighter hole on a hovered #f3 row); hover 0.107 / 0.226, active 0.123 / 0.279 → badge.css:17, 58-60.
- 2026-09-30 · audit S9 (owner) → pills close with a concentric circle and the Area glyph, and every dismiss uses `onDismiss` + `dismissLabel`; Badge already did, no code change. Its hover plate is the badge's `--_bg-hover`, not Chip's 12% ink (`badge.css:193`).
- 2026-09-30 · audit S9 (owner) → the dismiss hovers to 12% of its ink, the pill close recipe (was the badge's own hover plate) (badge.css:194).
- 2026-09-30 · audit S17 (API vocabulary, slice 2, H-13) → tone `inverted` renamed `inverse`, Avatar's word (`.area-badge--inverse`, badge.css:151; manifest.ts:319); React accepts `tone="inverted"` as a deprecated alias (`Badge.tsx:10`, :33). The Variants row also drops `accent`, removed earlier with the emphasis roles.
- 2026-10-01 · audit C-5 → the dismiss keeps its visible media-square box but gains an invisible 24px hit target (44 on coarse pointers) through `::after` → badge.css:193-197.
- 2026-10-01 · compact pass (owner: smallest components first) → the mark ladder steps down at compact (sm 16, md 16, lg 20) and every inner value (gutter, icon gutter, icon, media, gaps) is a function of the height that restates the 16 / 20 / 24 rows exactly, so compact md is drawn as default sm. Default identical (168 instances snapshotted); docs/research/compact-pass-2026-10-01.md.
- 2026-10-02 · compact pass round 9 → BadgeGroup and its overflow popover gaps 6 × 8 → 4 × 6 at compact. docs/research/compact-pass-2026-10-01.md (round 9).
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → a pill by default; `pill={false}` (`--rounded`) takes the radius setting's corner for its height (4 at the default, square at Sharp) (`badge.css`, `Badge.tsx`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-04 · pill shapes and list rows (owner) → the pill is the `badge` entry of data-area-pills (default on); `pill` is three-way: unset follows the list, true `--pill`, false `--rounded` (`badge.css`). `docs/research/radius-audit-2026-10-03.md`, "Pill shapes and list rows".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → hover arrives at once and fades out on fast (links, overflow button); the dismiss plate gains the fade-out (it snapped) → badge.css. See "Motion and interaction, 2026-10-07".
- 2026-10-11 · owner, review round 8 (rethink): "maybe too much spacing on the sides of the badges, can the icons be smaller?" → icon slot 12 at sm / md / lg (`icon-xs`; Untitled UI: 12 at every size), avatars, flags and dismiss keep 12 / 16 / 16; the round-8 "+4" icon side reverted, so the icon centres in the pill end: md icon 4 from the end (round 8: 6), label side 8, a 58-wide "Open" (measured). The 16 pilot drawings are scaled to 12 (no native 12 cuts yet; icon session gap).
- 2026-10-12 · owner, review round 9: approved → Complete in `component-status.mjs`.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → modern's edge is the raised plate's `edge-selected` (was `border-decorative`), hover `edge-control-hover` (was `edge-control`) (badge.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · owner, 2026-10-12: "go with your recommendations" (consistency pass) → the dismiss's focus ring sits at 0, a control nested in its host (O1; was `focus-offset`, outside the badge); the soft plate reads `bg-mark` / `bg-mark-hover` (O5, same paint) (badge.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · owner, review round 21 → approved on the review page, round 21 (components21) → Complete in `component-status.mjs`. (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · type size and density split (owner) → text-label marks follow the small-text line: `mark-label-sm` is its leading (14 at type 12 … 20 at 16), md and lg add the density's room (`emit/base.ts`); small text is base − 2, floor 10 (owner, 2026-10-12). `docs/research/ui-size-scale-2026-10-12.md`.
- 2026-10-15 · PRODUCT_UI.md open gap ("An on-colour Badge: colour cards draw their contrast badge in app CSS"), owner: "merge it, then continue working" → `onColor` (`area-badge--on-color`): Code's on-colour chip (docs/specs/code.md, 2026-10-15), the ground's own ink, a plate of 8% of the ink's opposite and a 20% line of the ink; overrides variant and tone. Basis: the badge's text contrast over the 345 colour steps with their own ink. The Color tab's badge (a 12% wash of the ink, app CSS) left 34 steps under 4.5:1, worst Warm 500 at 3.68:1 (bare 4.64); the opposite plate keeps every step at 5.25:1 or more (worst Orange 600). The line marks the chip on the lightest steps, where the plate barely shows. The Color tab's cards use `<Badge size="sm" onColor>`: same 14 tall and 11/14 text; visible changes: Badge's pill corner (the pills setting) for the 4 corner, the plate's direction and the line. Gallery: Ground / on colour, Ground / on a light colour.
