# Indicator spec

**Status:** accepted · 2026-09-28 (owner, batch 5)
**Captures:** `docs/research/captures/indicator/`
**Peers:** Badge (dot, count-like numerals, tone paint), Avatar (presence attachment),
Tabs and Nav (attached counts), Button (attached dot/count)

## Owner decisions

- 2026-09-24: Untitled UI is the preferred first source and visual reference.
- 2026-09-24: Presence is part of the Indicator family: `Indicator status="available" size="sm"`.
  `Presence` stays a compatibility export and internal renderer; no separate Presence
  docs or gallery family.
- 2026-09-24: Filled available/away/DND glyphs looked too heavy; use Fluent Regular cuts.
- 2026-09-24: Four corner placements only. One variant per gallery tile.
- 2026-09-24: Keep Indicator separate from Badge, but base its design and structure on
  Badge and make the two visibly related. (Fluent documents presence and counts as
  Badge variants: PresenceBadge, CounterBadge.)

## Job and boundaries

Indicator marks the status of another element: an unread or activity dot, a short
numeric count, or a person's availability. It is usually attached to a corner of its
owner (avatar, button, tab) and is decorative there; the owner's accessible name carries
the meaning. Badge labels content with text; Chip is an interactive choice.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| kind | activity dot | Unread/new marker with no number | Figma notifications button; Untitled Badge dot (peer) |
| kind | count | Short number on an owner | Fluent CounterBadge; Untitled avatar count; Notion board group counts (plain-text variant, not adopted) |
| status | available, away, busy, do-not-disturb, blocked, offline, out-of-office, unknown | Availability on identity | Fluent PresenceBadge (canonical eight); Untitled online/offline |
| size (status) | xs 10, sm 12, md 16, lg 20 | Native Fluent cuts | Fluent sizes (tiny 6 and extra-large 28 scale another cut, so excluded) |
| tone | danger (default), accent, neutral, info, success, warning | Semantic paint | Figma danger dot, Untitled error count, Fluent brand count; gallery Tone / warning |
| anchor | four corners; rectangular or circular owner | Attachment | Untitled avatar corner; Figma icon button |

Excluded: Untitled's gloss gradients and reflection SVG on the status dot (a skeuomorphic
treatment none of the target products use); Fluent tiny/extra-large presence (scaled cuts).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system: rendered + source | Avatar `status` online indicator, count, verified tick | [untitleduico/react](https://github.com/untitleduico/react) @ `8b7409c078f81ab89dfc5943ec185ec369932804`: `components/base/avatar/avatar.tsx`, `base-components/avatar-online-indicator.tsx`, `avatar-count.tsx`, `verified-tick.tsx`; rendered at untitledui.com/react/components/avatars | MIT | `uui--avatar-*` (7) |
| fluent | design system: rendered | PresenceBadge sizes, CounterBadge sizes | storybooks.fluentui.dev/react, stories `components-badge-presencebadge--sizes`, `components-badge-counter-badge--sizes` (captured 2026-09-25). Source not yet pinned for this spec | MIT | `fluent--presence-*` (6), `fluent--counter-*` (2) |
| mantine | design system | Indicator (earlier source of Area's implementation) | See Prior implementation record | MIT | not captured under this workflow yet |
| chatgpt | target product | No indicator found; sidebar "NEW" pill captured as the Badge-peer reference | chatgpt.com, logged in (Edge), 2026-09-25 | evidence only | `chatgpt--badge-new--rest--light` |
| notion | target product | No indicator present in the owner's single-user workspace; board group tag and count captured as peers | app.notion.com, logged in (Edge), 2026-09-25 | evidence only | `notion--board-group-tag…`, `notion--board-group-count…` |
| figma | target product | Unread dot on the notifications bell | figma.com file browser, logged in (Edge), 2026-09-25 | evidence only | `figma--bell-unread-dot--rest--light` |
| area | this system | Built result, re-captured after the change | localhost gallery | — | `area--*` (3) |

Where each product was searched:
- **ChatGPT:** sidebar (new chat, library, projects, scheduled, plugins, sites, more,
  recents), header, composer, account row. A DOM scan for filled circular elements
  under 24px found only the two 24px account avatars. No presence, unread dot or count.
- **Notion:** sidebar, inbox button, header, a board database. A DOM scan found no
  small circular filled elements. The inbox count appears only with unread items;
  creating one would change the owner's data, so it was not triggered. Presence
  avatars appear only when other people view a page, which this workspace does not have.
- **Figma:** file-browser sidebar and header. The notifications button showed its
  unread dot. Multiplayer avatars in the editor were not captured (no collaborators).
- **Dark theme:** not captured in any product. Switching a product's theme changes the
  owner's account setting, so it needs the owner's go-ahead.

### Source facts (Untitled UI, pinned commit)

- `avatar-online-indicator.tsx` L5–14: dot sizes xs 6, sm 8, md 10, lg 12, xl 14, 2xl 16px
  (`size-1.5` … `size-4`) for avatars of 24/32/40/48/56/64px (`avatar.tsx` L71–78).
- L25: `absolute right-0 bottom-0`, `rounded-full`, `ring-[1.5px] ring-bg-primary`; online
  `bg-fg-success-secondary`, offline `bg-utility-neutral-300`. L31–48: three radial-gradient
  gloss layers and a reflection SVG (a skeuomorphic treatment; judge in the visual pass).
- `avatar-count.tsx` L11–12: count is `absolute right-0 bottom-0 p-px` around a `size-3.5`
  (14px) circle, `text-[10px] leading-[13px] font-bold`, `bg-fg-error-primary`, white text.
- `verified-tick.tsx` L5–14: tick sizes 10/12/14/16/18/20/24/32px.
- `avatar.tsx` L117–131: only one corner decoration renders: status, else verified, else
  count, else a custom badge.

## Anatomy

```
uui avatar status
shell      div.relative.rounded-full (24–64px)       owns: size, circle shape
  content  div.size-full.overflow-hidden             owns: fill, 0.5px inner outline
  indicator span.absolute.right-0.bottom-0           owns: dot size, 1.5px surface ring (box-shadow)

fluent PresenceBadge
shell      div.fui-PresenceBadge (6–28px), padding 1px, background-clip content-box
  icon     span.__icon, margin −1px                  owns: glyph viewport
    svg    viewBox 10/12/16/20, scaled for 6 (10 cut) and 28 (20 cut)

fluent CounterBadge
shell+text div.fui-CounterBadge, min-width = height, padding-inline 4/6px, text centered
```

```
figma notifications button
shell      button (32×32, radius 5)                  owns: hit area, shape
  icon     svg 24×24 at 4px inset                    owns: glyph viewport
    indicator circle r2.5 at (16.5, 7.5)             drawn inside the icon; 9px from shell top and end
    bell   path, ink 12×14                            gap around the dot is part of the glyph

area (after this change)
anchor     span.area-indicator-anchor                owns: placement
  owner    button / avatar / tab                     owns: its own geometry, untouched
  indicator span.__indicator (absolute)              owns: position, 1.5px surface ring on child
    dot | count | presence                          owns: size, paint, text
```

Placement finding: Untitled's dot sits flush in the avatar's bounding-box corner (edge from
shell `t 30 r 0 b 0 l 30` at 40px). Area currently centers the indicator on the 45° rim
(14.64466% inset). At 40px the two differ: Untitled's dot centre is at 35px, the rim at
45° is at 34.14px. Decide with the target-product captures.

## Measurements

Untitled UI avatar status (indicator slot; shell = avatar):

| slot · property | uui · avatar-online-xs · rest · light | uui · avatar-online-sm · rest · light | uui · avatar-online-md · rest · light | uui · avatar-online-lg · rest · light | uui · avatar-online-xl · rest · light | uui · avatar-online-2xl · rest · light | uui · avatar-offline-md · rest · light |
|---|---|---|---|---|---|---|---|
| **indicator** size | 6 × 6 | 8 × 8 | 10 × 10 | 12 × 12 | 14 × 14 | 16 × 16 | 10 × 10 |
| **indicator** edge from parent (t r b l) | 18 0 0 18 | 24 0 0 24 | 30 0 0 30 | 36 0 0 36 | 42 0 0 42 | 48 0 0 48 | 30 0 0 30 |
| **indicator** edge from shell (t r b l) | 18 0 0 18 | 24 0 0 24 | 30 0 0 30 | 36 0 0 36 | 42 0 0 42 | 48 0 0 48 | 30 0 0 30 |
| **indicator** padding | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **indicator** border | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **indicator** radius | 9999px | 9999px | 9999px | 9999px | 9999px | 9999px | 9999px |
| **indicator** display / direction | flex | flex | flex | flex | flex | flex | flex |
| **indicator** align / justify | center | center | center | center | center | center | center |
| **indicator** position / inset | absolute 18px 0px 0px 18px | absolute 24px 0px 0px 24px | absolute 30px 0px 0px 30px | absolute 36px 0px 0px 36px | absolute 42px 0px 0px 42px | absolute 48px 0px 0px 48px | absolute 30px 0px 0px 30px |
| **indicator** background | lab(70.5521 -66.5147 45.8073) radial-gradient(43.75% 43.75% at 50% 28.75%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(50% 50%, rgba(255, 255, 255, 0) 74.66%, rgba(255, 255, 255, 0.18) 100%), radial-gradient(75% 75% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.08) 99%, rgba(255, 255, 255, 0) 100%) | lab(70.5521 -66.5147 45.8073) radial-gradient(43.75% 43.75% at 50% 28.75%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(50% 50%, rgba(255, 255, 255, 0) 74.66%, rgba(255, 255, 255, 0.18) 100%), radial-gradient(75% 75% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.08) 99%, rgba(255, 255, 255, 0) 100%) | lab(70.5521 -66.5147 45.8073) radial-gradient(43.75% 43.75% at 50% 28.75%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(50% 50%, rgba(255, 255, 255, 0) 74.66%, rgba(255, 255, 255, 0.18) 100%), radial-gradient(75% 75% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.08) 99%, rgba(255, 255, 255, 0) 100%) | lab(70.5521 -66.5147 45.8073) radial-gradient(43.75% 43.75% at 50% 28.75%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(50% 50%, rgba(255, 255, 255, 0) 74.66%, rgba(255, 255, 255, 0.18) 100%), radial-gradient(75% 75% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.08) 99%, rgba(255, 255, 255, 0) 100%) | lab(70.5521 -66.5147 45.8073) radial-gradient(43.75% 43.75% at 50% 28.75%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(50% 50%, rgba(255, 255, 255, 0) 74.66%, rgba(255, 255, 255, 0.18) 100%), radial-gradient(75% 75% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.08) 99%, rgba(255, 255, 255, 0) 100%) | lab(70.5521 -66.5147 45.8073) radial-gradient(43.75% 43.75% at 50% 28.75%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(50% 50%, rgba(255, 255, 255, 0) 74.66%, rgba(255, 255, 255, 0.18) 100%), radial-gradient(75% 75% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.08) 99%, rgba(255, 255, 255, 0) 100%) | lab(84.92 0 -0.0000119209) radial-gradient(43.75% 43.75% at 50% 28.75%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(50% 50%, rgba(255, 255, 255, 0) 74.66%, rgba(255, 255, 255, 0.18) 100%), radial-gradient(75% 75% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.08) 99%, rgba(255, 255, 255, 0) 100%) |
| **indicator** shadow | rgb(255, 255, 255) 0px 0px 0px 1.5px | rgb(255, 255, 255) 0px 0px 0px 1.5px | rgb(255, 255, 255) 0px 0px 0px 1.5px | rgb(255, 255, 255) 0px 0px 0px 1.5px | rgb(255, 255, 255) 0px 0px 0px 1.5px | rgb(255, 255, 255) 0px 0px 0px 1.5px | rgb(255, 255, 255) 0px 0px 0px 1.5px |

Sources:
- uui · avatar-online-xs · rest · light: https://www.untitledui.com/react/components/avatars (captured 2026-09-25T05:08:26.578Z, dpr 2, zoom null) — docs/research/captures/indicator/uui--avatar-online-xs--rest--light.json
- uui · avatar-online-sm · rest · light: https://www.untitledui.com/react/components/avatars (captured 2026-09-25T05:08:26.578Z, dpr 2, zoom null) — docs/research/captures/indicator/uui--avatar-online-sm--rest--light.json
- uui · avatar-online-md · rest · light: https://www.untitledui.com/react/components/avatars (captured 2026-09-25T05:08:26.579Z, dpr 2, zoom null) — docs/research/captures/indicator/uui--avatar-online-md--rest--light.json
- uui · avatar-online-lg · rest · light: https://www.untitledui.com/react/components/avatars (captured 2026-09-25T05:08:26.579Z, dpr 2, zoom null) — docs/research/captures/indicator/uui--avatar-online-lg--rest--light.json
- uui · avatar-online-xl · rest · light: https://www.untitledui.com/react/components/avatars (captured 2026-09-25T05:08:26.579Z, dpr 2, zoom null) — docs/research/captures/indicator/uui--avatar-online-xl--rest--light.json
- uui · avatar-online-2xl · rest · light: https://www.untitledui.com/react/components/avatars (captured 2026-09-25T05:08:26.581Z, dpr 2, zoom null) — docs/research/captures/indicator/uui--avatar-online-2xl--rest--light.json
- uui · avatar-offline-md · rest · light: https://www.untitledui.com/react/components/avatars (captured 2026-09-25T05:08:26.581Z, dpr 2, zoom null) — docs/research/captures/indicator/uui--avatar-offline-md--rest--light.json

Fluent PresenceBadge (available):

| slot · property | fluent · presence-available-tiny · rest · light | fluent · presence-available-extra-small · rest · light | fluent · presence-available-small · rest · light | fluent · presence-available-medium · rest · light | fluent · presence-available-large · rest · light | fluent · presence-available-extra-large · rest · light |
|---|---|---|---|---|---|---|
| **shell** size | 6 × 6 | 10 × 10 | 12 × 12 | 16 × 16 | 20 × 20 | 28 × 28 |
| **shell** padding | 1 | 1 | 1 | 1 | 1 | 1 |
| **shell** border | 0 | 0 | 0 | 0 | 0 | 0 |
| **shell** radius | 10000px | 10000px | 10000px | 10000px | 10000px | 10000px |
| **shell** display / direction | flex | flex | flex | flex | flex | flex |
| **shell** align / justify | center · center | center · center | center · center | center · center | center · center | center · center |
| **shell** background | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) | rgb(255, 255, 255) |
| **icon** size | 6 × 6 | 10 × 10 | 12 × 12 | 16 × 16 | 20 × 20 | 28 × 28 |
| **icon** edge from parent (t r b l) | 0 0 0 0 | 0 0 0 0 | 0 0 0 0 | 0 0 0 0 | 0 0 0 0 | 0 0 0 0 |
| **icon** edge from shell (t r b l) | 0 0 0 0 | 0 0 0 0 | 0 0 0 0 | 0 0 0 0 | 0 0 0 0 | 0 0 0 0 |
| **icon** padding | 0 | 0 | 0 | 0 | 0 | 0 |
| **icon** border | 0 | 0 | 0 | 0 | 0 | 0 |
| **icon** radius | 0px | 0px | 0px | 0px | 0px | 0px |
| **icon** display / direction | block | block | block | block | block | block |
| **icon** color | rgb(19, 161, 14) | rgb(19, 161, 14) | rgb(19, 161, 14) | rgb(19, 161, 14) | rgb(19, 161, 14) | rgb(19, 161, 14) |
| **icon** svg viewBox · rendered | 0 0 10 10 · 6 × 6 | 0 0 10 10 · 10 × 10 | 0 0 12 12 · 12 × 12 | 0 0 16 16 · 16 × 16 | 0 0 20 20 · 20 × 20 | 0 0 20 20 · 28 × 28 |
| **icon** svg ink from shell (t r b l) | 0 0 0 0 | 0 0 0 0 | 0 0 0 0 | 0 0 0 0 | 0 0 0 0 | 0 0 0 0 |
| **icon** fill | rgb(19, 161, 14) | rgb(19, 161, 14) | rgb(19, 161, 14) | rgb(19, 161, 14) | rgb(19, 161, 14) | rgb(19, 161, 14) |

Sources:
- fluent · presence-available-tiny · rest · light: https://storybooks.fluentui.dev/react/iframe.html (captured 2026-09-25T05:11:42.031Z, dpr 2, zoom null) — docs/research/captures/indicator/fluent--presence-available-tiny--rest--light.json
- fluent · presence-available-extra-small · rest · light: https://storybooks.fluentui.dev/react/iframe.html (captured 2026-09-25T05:11:42.032Z, dpr 2, zoom null) — docs/research/captures/indicator/fluent--presence-available-extra-small--rest--light.json
- fluent · presence-available-small · rest · light: https://storybooks.fluentui.dev/react/iframe.html (captured 2026-09-25T05:11:42.032Z, dpr 2, zoom null) — docs/research/captures/indicator/fluent--presence-available-small--rest--light.json
- fluent · presence-available-medium · rest · light: https://storybooks.fluentui.dev/react/iframe.html (captured 2026-09-25T05:11:42.033Z, dpr 2, zoom null) — docs/research/captures/indicator/fluent--presence-available-medium--rest--light.json
- fluent · presence-available-large · rest · light: https://storybooks.fluentui.dev/react/iframe.html (captured 2026-09-25T05:11:42.033Z, dpr 2, zoom null) — docs/research/captures/indicator/fluent--presence-available-large--rest--light.json
- fluent · presence-available-extra-large · rest · light: https://storybooks.fluentui.dev/react/iframe.html (captured 2026-09-25T05:11:42.033Z, dpr 2, zoom null) — docs/research/captures/indicator/fluent--presence-available-extra-large--rest--light.json

Fluent CounterBadge (count "5"; Segoe UI is not installed on the capture machine, so text
metrics reflect the fallback font; box geometry is unaffected):

| slot · property | fluent · counter-small · rest · light | fluent · counter-medium · rest · light |
|---|---|---|
| **shell** size | 16 × 16 | 20 × 20 |
| **shell** padding | 0 4 0 4 | 0 6 0 6 |
| **shell** border | 0 | 0 |
| **shell** radius | 10000px | 10000px |
| **shell** display / direction | flex | flex |
| **shell** align / justify | center · center | center · center |
| **shell** position / inset | relative auto auto auto auto | relative auto auto auto auto |
| **shell** font | 10px/14px 600 "Segoe UI" | 12px/16px 600 "Segoe UI" |
| **shell** color | rgb(255, 255, 255) | rgb(255, 255, 255) |
| **shell** background | rgb(15, 108, 189) | rgb(15, 108, 189) |
| **shell** text cap top / baseline from shell | cap +5 · baseline −4 · start +5.22 · end −5.23 | cap +6.6 · baseline −5 · start +6.66 · end −6.67 |
| **shell** text cap / x height | 7 / 5 | 8.4 / 6 |
| **shell** pseudo | ::after 14px × 14px rgba(0, 0, 0, 0) r=10000px | ::after 18px × 18px rgba(0, 0, 0, 0) r=10000px |
| **text** size | 16 × 16 | 20 × 20 |
| **text** padding | 0 4 0 4 | 0 6 0 6 |
| **text** border | 0 | 0 |
| **text** radius | 10000px | 10000px |
| **text** display / direction | flex | flex |
| **text** align / justify | center · center | center · center |
| **text** position / inset | relative auto auto auto auto | relative auto auto auto auto |
| **text** font | 10px/14px 600 "Segoe UI" | 12px/16px 600 "Segoe UI" |
| **text** color | rgb(255, 255, 255) | rgb(255, 255, 255) |
| **text** background | rgb(15, 108, 189) | rgb(15, 108, 189) |
| **text** text cap top / baseline from shell | cap +5 · baseline −4 · start +5.22 · end −5.23 | cap +6.6 · baseline −5 · start +6.66 · end −6.67 |
| **text** text cap / x height | 7 / 5 | 8.4 / 6 |
| **text** pseudo | ::after 14px × 14px rgba(0, 0, 0, 0) r=10000px | ::after 18px × 18px rgba(0, 0, 0, 0) r=10000px |

Sources:
- fluent · counter-small · rest · light: https://storybooks.fluentui.dev/react/iframe.html (captured 2026-09-25T05:13:54.023Z, dpr 2, zoom null) — docs/research/captures/indicator/fluent--counter-small--rest--light.json
- fluent · counter-medium · rest · light: https://storybooks.fluentui.dev/react/iframe.html (captured 2026-09-25T05:13:54.024Z, dpr 2, zoom null) — docs/research/captures/indicator/fluent--counter-medium--rest--light.json

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| dot · size | 6px | Owner (relate to Badge): Badge dot disc is 6px; Untitled Badge Dot 6px | Figma measures 5px, Notion's status-tag dot 8px. Kept (third pass): 6px matches Badge's dot, and the products split either side; an odd 5px box also has no pixel centre at 1× |
| dot · paint | danger role (`rgb(232, 9, 69)` light) | Figma danger (`#dc3412`), Untitled error | Hue differs from Figma's orange red; Area keeps its palette and semantic role |
| count · height / min-width | 16px | Fluent small 16px | Untitled avatar count is 14px; 16px matches ChatGPT's 16px chrome pill and keeps two-digit counts round |
| count · text | 10px / 14px, weight 500, tabular numerals | Fluent small 10/14, Untitled 10/13 (both 10px) | Weight 500 instead of 600/700: Area text weights are 400/500 and Badge uses 500 |
| count · padding-inline | 4px | Fluent small | — |
| attached cutout (ring) | 1px surface | Owner 2026-09-25: match the 1px icon stroke | Untitled uses 1.5px; read as heavier than the rest of the system |
| circular owner · placement | 2px outside the bounding-box corner | Owner 2026-09-25 (Untitled flush corner, moved 2px from centre) | — |
| rectangular owner · dot placement | centred on the 16px icon viewport's top-end corner (dot edges 5px from the button edges) | Owner 2026-09-25 (Figma's 9px read too inset) | Figma's value is relative to a 24px icon; Area's icon is 16px, so the position is taken relative to the icon slot |
| rectangular owner · count placement | centred on the corner, no inset (`compact` now opt-in) | Owner 2026-09-25; Mantine default (offset 0) | Previous 4px inset read too inset |
| tab owner · count placement | after the tab: anchor reserves 16px + 2px, count top-aligned | Owner 2026-09-25 (count covered the label) | Area tabs align text to their end edge, so any corner placement overlaps the label |
| status glyphs | Fluent Regular cuts 10/12/16/20 with 1px backing clip | Fluent + owner decision (Regular) | — |
| processing pulse | unchanged | Prior implementation (Mantine) | No product evidence |

## States

Indicator has no interactive states of its own; it is decorative inside an owner. Hover
and focus belong to the owner (the button keeps its own hover fill; the dot does not
change). Visibility toggles scale 0 → 1 with the existing transition; reduced motion
removes it.

## Behavior and accessibility

Unchanged: standalone indicators use `role="img"` with a name (count uses the uncapped
number); attached indicators are `aria-hidden` and `inert`, so the owner's accessible name
must carry the state (the new tile's button is named "Notifications, new activity").
Forced colors map the indicator to Highlight with a Canvas outline. Logical placement
follows RTL.

## Peers and consistency

| Peer | Shared role | Peer value | Indicator | Match |
|---|---|---|---|---|
| Badge dot | status dot | 6px disc | 6px dot | match |
| Badge | weight | 500 | 500 | match |
| Badge sm | height | 16px (Badge scale 16 / 20 / 24 since 2026-09-25) | count 16px | match |
| Avatar md | owner | 32px circle | presence sm 12px flush in corner | Untitled uses an 8px dot at 32px; Area's status is a 12px glyph, kept legible |
| Button md icon-only | owner | 32px, 16px icon at 8px inset | dot 9px from top/end | matches Figma's measured inset at the same owner size |

## Visual pass

2026-09-28, Claude in Chrome (batch 5), zoomed: Area's bell and activity tiles beside Figma's
file-browser bell (red dot on the glyph's upper right) and Notion's sidebar help button, which
carries a blue activity dot on its top-end corner. Notion's dot, read live: 8 including a
0.56px cutout in the sidebar colour, rgb(39, 131, 222), radius 50%; Area's is a 6 dot plus a
1px surface cutout, 8 in all, the same footprint. Placement matches both products. No change.

Earlier pass:

Compared in Edge at the same zoom, light theme:
- Area bell tile vs Figma bell: same placement over the glyph's upper right; Area's dot
  is 1px larger and a pinker red; Figma's knockout and Area's ring read the same.
- Count tiles: text optically centred (cap top 4.4px, baseline 4.5px from the bottom).
- Dark theme (Area): the ring follows the dark surface (`rgb(29, 29, 29)`); dot, count
  and presence stay distinct.
- Peers: dot size now matches Badge's dot.

Measured against references:

| slot · property | figma · bell-unread-dot · rest · light | area · anchor-icon-button · rest · light |
|---|---|---|
| **icon** size | 24 × 24 | 16 × 16 |
| **icon** edge from parent (t r b l) | 4 4 4 4 | 0 0 0 0 |
| **icon** edge from shell (t r b l) | 4 4 4 4 | 8 8 8 8 |
| **icon** padding | 0 | 0 |
| **icon** border | 0 | 0 |
| **icon** radius | 0px | 0px |
| **icon** display / direction | block | block |
| **icon** color | rgb(0, 0, 0) | rgb(40, 40, 40) |
| **icon** svg viewBox · rendered | 0 0 24 24 · 24 × 24 | 0 0 16 16 · 16 × 16 |
| **icon** svg ink from shell (t r b l) | 9 9 9 10 | 10 10.5 10 10.5 |
| **icon** fill | none | rgb(40, 40, 40) |
| **indicator** size | 5 × 5 | 6 × 6 |
| **indicator** edge from parent (t r b l) | 5 5 14 14 | 0 0 0 0 |
| **indicator** edge from shell (t r b l) | 9 9 18 18 | 9 9 17 17 |
| **indicator** padding | 0 | 0 |
| **indicator** border | 0 | 0 |
| **indicator** radius | 0px | 9999px |
| **indicator** display / direction | inline | flex |
| **indicator** align / justify |  | center · center |
| **indicator** position / inset |  | relative auto auto auto auto |
| **indicator** background |  | rgb(232, 9, 69) |
| **indicator** shadow |  | rgb(255, 255, 255) 0px 0px 0px 1.5px |

Sources:
- figma · bell-unread-dot · rest · light: https://www.figma.com (captured 2026-09-25T05:40:55.448Z, dpr 2, zoom 0.13) — docs/research/captures/indicator/figma--bell-unread-dot--rest--light.json
- area · anchor-icon-button · rest · light: http://localhost:4321/gallery.html (captured 2026-09-25T05:56:49.645Z, dpr 2, zoom 1.3) — docs/research/captures/indicator/area--anchor-icon-button--rest--light.json

| slot · property | uui · avatar-online-sm · rest · light | area · anchor-avatar · rest · light |
|---|---|---|
| **indicator** size | 8 × 8 | 12 × 12 |
| **indicator** edge from parent (t r b l) | 24 0 0 24 | 0 0 0 0 |
| **indicator** edge from shell (t r b l) | 24 0 0 24 | 20 0 0 20 |
| **indicator** padding | 0 | 1 |
| **indicator** border | 0 | 0 |
| **indicator** radius | 9999px | 9999px |
| **indicator** display / direction | flex | flex |
| **indicator** align / justify | center | center · center |
| **indicator** position / inset | absolute 24px 0px 0px 24px |  |
| **indicator** background | lab(70.5521 -66.5147 45.8073) radial-gradient(43.75% 43.75% at 50% 28.75%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(50% 50%, rgba(255, 255, 255, 0) 74.66%, rgba(255, 255, 255, 0.18) 100%), radial-gradient(75% 75% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.08) 99%, rgba(255, 255, 255, 0) 100%) | rgb(255, 255, 255) |
| **indicator** shadow | rgb(255, 255, 255) 0px 0px 0px 1.5px | rgb(255, 255, 255) 0px 0px 0px 1.5px |

Sources:
- uui · avatar-online-sm · rest · light: https://www.untitledui.com/react/components/avatars (captured 2026-09-25T05:08:26.578Z, dpr 2, zoom null) — docs/research/captures/indicator/uui--avatar-online-sm--rest--light.json
- area · anchor-avatar · rest · light: http://localhost:4321/gallery.html (captured 2026-09-25T05:56:49.647Z, dpr 2, zoom 1.3) — docs/research/captures/indicator/area--anchor-avatar--rest--light.json

| slot · property | fluent · counter-small · rest · light | notion · board-group-count · rest · light | area · count-3 · rest · light |
|---|---|---|---|
| **shell** size | 16 × 16 | 29.63 × 20 | 16 × 16 |
| **shell** padding | 0 4 0 4 | 0 6 0 6 | 0 4 0 4 |
| **shell** border | 0 | 0 | 0 |
| **shell** radius | 10000px | 4px | 9999px |
| **shell** display / direction | flex | flex | flex |
| **shell** align / justify | center · center | center | center · center |
| **shell** position / inset | relative auto auto auto auto |  | relative auto auto auto auto |
| **shell** font | 10px/14px 600 "Segoe UI" | 14px/16.8px 400 ui-sans-serif | 10px/14px 500 Geist |
| **shell** color | rgb(255, 255, 255) | rgb(181, 119, 214) | rgb(255, 255, 255) |
| **shell** background | rgb(15, 108, 189) |  | rgb(232, 9, 69) |
| **shell** text cap top / baseline from shell | cap +5 · baseline −4 · start +5.22 · end −5.23 | cap +5.73 · baseline −4.4 · start +6 · end −6 | cap +4.4 · baseline −4.5 · start +4.94 · end −4.94 |
| **shell** text cap / x height | 7 / 5 | 9.86 / 7.37 | 7.1 / 5.32 |
| **shell** pseudo | ::after 14px × 14px rgba(0, 0, 0, 0) r=10000px |  |  |

Sources:
- fluent · counter-small · rest · light: https://storybooks.fluentui.dev/react/iframe.html (captured 2026-09-25T05:13:54.023Z, dpr 2, zoom null) — docs/research/captures/indicator/fluent--counter-small--rest--light.json
- notion · board-group-count · rest · light: https://app.notion.com (captured 2026-09-25T05:51:37.204Z, dpr 1.7999999523162842, zoom 0.9) — docs/research/captures/indicator/notion--board-group-count--rest--light.json
- area · count-3 · rest · light: http://localhost:4321/gallery.html (captured 2026-09-25T05:56:49.647Z, dpr 2, zoom 1.3) — docs/research/captures/indicator/area--count-3--rest--light.json

## Verification

- 22 captures verified by checksum (script fingerprint `091bb143`).
- Gallery measurements after the change: dot 6×6; icon-button dot edges 9/9 from top/end;
  avatar presence edges 0/0 from bottom/end; count 16×16, 10px/14px, 500, 4px sides;
  ring 1.5px.
- 87 React tests, typecheck, docs audit, 14 contract tests and manifest parity pass.
- Unverified: product dark themes; Notion's inbox count and presence (not present);
  Figma multiplayer avatars; counts on rectangular owners in any product; cross-engine,
  screen-reader and forced-colors execution.

## Feedback log

- 2026-09-25 · Buttons and tabs too inset; tab count over the label; avatar 2px further
  from centre → rectangular counts centre on the corner (`compact` default false), dots
  centre on the icon corner, tabs reserve space after the label, circular inset −2px →
  gallery measured: button count centred on corner, icon dot edges 5/5, tab count 2px
  after text, avatar status −2/−2 (captures `area--anchor-*`).
- 2026-09-25 · The 1.5px ring and status glyphs read thicker than text and icons → ring back
  to 1px. Measured the glyphs (see Stroke findings); the glyph fix needs an owner choice.
- 2026-09-25 · Asked what activity dots are for: an unread or new-activity marker with no
  number (Figma's notifications bell). The in-context tile is `anchor-iconButton`.

- 2026-09-25 · Owner chose 1.125px and Area-drawn status glyphs → Presence ring is a
  border and the mark a non-scaling stroke at `--area-weight-icon` → gallery: every status
  and size shows the same line weight as the pilot icons (Edge, 2×).
- 2026-09-25 · owner accepted Indicator → Complete in `component-status.mjs`.
- 2026-09-26 · cohesion audit → the processing pulse stops under `data-area-motion="none"`
  as it already did for reduced motion (indicator.css:53) → [cohesion-audit.md](../research/cohesion-audit.md);
  status back to in review.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence added,
  no change. Still no Notion or Figma indicator beyond the Figma bell dot; the gallery
  groups the tiles (Variants for presence, States for
  out-of-office, Content for counts). Open question: Notion's status-tag dot is 8px
  (`badge/notion--status-dot--rest--light`, in a 20px tag) and Figma's unread dot 5px
  (`figma--bell-unread-dot--rest--light`); Area's 6px dot stays equal to Badge's, so any
  change belongs to Badge first → `badge/notion--status-dot--rest--light`.
- 2026-09-27 · third pass → open question settled, value kept: the dot stays 6px, equal to
  Badge's (Notion 8, Figma 5 sit either side); Tone / warning tile added → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).

## Stroke findings (2026-09-25)

Measured by rasterising at 100× in the gallery:
- Geist text stems (the "l" and "I" stems): 12px/400 1.0, 13px/400 1.1, 14px/400 1.2,
  14px/500 1.5, 16px/400 1.35, 16px/500 1.7px.
- Area UI icons (Fluent 16 Regular): 1px strokes.
- Fluent presence and out-of-office glyphs grow with their cut: 10px ≈ 1px ring,
  12px ≈ 1.5px, 16px ≈ 2px, 20px ≈ 2px. Inner marks at 16px measure 2.0–2.8px.
  The status and out-of-office gallery tiles use the 16px cut, so they are about twice
  the UI icon stroke and heavier than 14px/500 text. These are Fluent's own glyphs,
  generated verbatim, not custom shapes.
- Cursor's published rule (minoradventures.co, "The making of Cursor's icons"): 16px icons
  with a 1.25px stroke beside 16px text, 24px icons with 1.5px; 1px read thin, 1.5px read
  heavy; round caps; at least 3px between overlapping shapes.

Options for status glyphs (owner decision):
1. Keep Fluent's glyphs; use them no larger than 12px (1–1.5px strokes) and reserve the
   16/20px cuts for large avatars.
2. Area-drawn status glyphs with one stroke matched to the paired text (for example
   1.25px at 16px, 1px at 12px), keeping Fluent's shapes and semantics. This departs from
   the rule against redrawing vendored icons, so it needs the owner's approval.

## Prior implementation record

Moved verbatim from the earlier adaptation guide (2026-09-24). Its values predate the
capture workflow and will be re-verified. The owner follow-up at the end supersedes the
initial records where they conflict.

### Indicator — initial adaptation, 2026-09-24

Source: [Mantine Indicator](https://mantine.dev/core/indicator/), MIT, Vitaly Rtishchev.
Pinned commit: `717124296bd80131b36eefbb73f32c5ec5c7871d`.
[Implementation](https://github.com/mantinedev/mantine/blob/717124296bd80131b36eefbb73f32c5ec5c7871d/packages/@mantine/core/src/components/Indicator/Indicator.tsx),
[CSS](https://github.com/mantinedev/mantine/blob/717124296bd80131b36eefbb73f32c5ec5c7871d/packages/@mantine/core/src/components/Indicator/Indicator.module.css),
[position helper](https://github.com/mantinedev/mantine/blob/717124296bd80131b36eefbb73f32c5ec5c7871d/packages/@mantine/core/src/components/Indicator/get-position-variables/get-position-variables.ts).

- Translated its absolute-position / half-size-translation model to logical CSS: nine
  positions, offset, hidden attachment. Kept a separate IndicatorAnchor for Area composition.
- Preserved 10px activity dots, centered nowrap labels, optional cutout, max count and
  show-zero rules, and the source's processing pulse (1s at Area default motion) (opacity .6→0, scale 0→2.8).
- Area uses 16px count height and 5px text gutters: readable Area extra-small type, distinct
  from the source's default 10px indicator box. The border is a 2px surface halo so it
  does not consume the small label's box. Compact/circular attachment offsets remain
  Area options. Surface halo, typography, full radius and six tones consume Area tokens.
- Added full uncapped accessible count, finite/nonnegative count normalization and reduced
  motion handling. Attached indicators are decorative; the owning control names the state.
- No arbitrary color/radius/z-index API: semantic tones and CSS tokens own those concerns.
  No freeform label: short numeric counts and activity dots keep the role distinct from Badge.

### Presence — initial adaptation, 2026-09-24

Source: Microsoft Fluent UI PresenceBadge, MIT.
Pinned commit: `d27922755bebae866d9ffe86b7da44c27ec801ee`.
[Status selection and semantics](https://github.com/microsoft/fluentui/blob/d27922755bebae866d9ffe86b7da44c27ec801ee/packages/react-components/react-badge/library/src/components/PresenceBadge/usePresenceBadge.tsx),
[styles](https://github.com/microsoft/fluentui/blob/d27922755bebae866d9ffe86b7da44c27ec801ee/packages/react-components/react-badge/library/src/components/PresenceBadge/usePresenceBadgeStyles.styles.ts),
[icon mappings](https://github.com/microsoft/fluentui/blob/d27922755bebae866d9ffe86b7da44c27ec801ee/packages/react-components/react-badge/library/src/components/PresenceBadge/presenceIcons.ts).

- Translated the actual eight-status mapping and out-of-office alternatives. Preserved
  role=image semantics with overridable accessible labels, circular box, centered icon
  and source 1px background clip / -1px icon margin for antialiasing. That paired geometry
  is not an optical nudge: it prevents backing color leaking beyond the SVG silhouette.
- Native Fluent 10/12/16/20px cuts become Area xs/sm/md/lg. No scaled 6px tiny or 28px
  extra-large options: upstream maps those to differently sized cuts. Geometry is generated
  verbatim from the lockfile-pinned @fluentui/svg-icons package using gen-icons.mjs.
- Replaced Fluent paint with Area success/warning/danger/neutral/discovery solid and paired
  foreground tokens. Filled glyph holes show their paired foreground; out-of-office
  variants use the surface backing. Radius stays full because these encode circular states.
- Exported Presence separately. The old Indicator status prop delegates to Presence for
  compatibility and is deprecated; examples now use Presence directly.

### Lessons to carry forward

- **2026-09-24 browser correction:** the global SVG max-width reset shrank Presence
  glyphs by 2px inside Fluent’s padded backing. Removed that max-width constraint on
  the owned SVG slot; keep the background clip and verify intrinsic/rendered sizes.

- **Native icon cuts matter:** a 16px slot does not justify scaling a 20px SVG. Preserve
  each supplied cut and verify both viewBox and rendered dimensions.
- **Do not merge distinct roles:** counts/activity belong to Indicator; availability has
  shape-specific status semantics and belongs to Presence; text tags remain Badge.
- **Source is a starting contract:** preserve behavior, but document additions such as
  reduced motion and logical RTL positioning. Do not silently copy source limitations.
- **Keep provenance distributable:** required MIT notices live in the React and styles
  package file lists as well as the repository root.

### Verification for this adaptation

- Build/docs audit and typecheck passed; 85 React tests passed, including count boundaries,
  zero hiding, status semantics, native cuts and out-of-office mappings.
- 19,491 token tests, 370 contrast assertions across 66 themes, and consumer packaging
  checks passed. These do not establish contrast on arbitrary consumer backgrounds.
- Browser: measured Presence box and SVG at 10/12/16/20px, dots at 10px, count height at
  16px with 5px gutters. Inspected nine placements, light/dark and Presence at 390px;
  zero toggle worked and motion=none produced a 0s animation. Restored light/subtle.
- Cross-engine, native screen-reader and forced-colors execution remain unverified.
  Both components remain In review. Existing unrelated gallery-wide narrow overflow
  remains outside this adaptation.

### Owner follow-up — September 24 evening (supersedes initial adaptation)

- Untitled UI is the preferred starting source and visual reference.
- Presence is now part of the Indicator family: `Indicator status="available" size="sm"`.
  `Presence` remains a compatibility export/internal renderer; its separate gallery and
  docs family were removed. Dot/count continue to use their own structural rendering.
- Filled available/away/DND icons looked too heavy. Switched to unmodified native Fluent
  Regular cuts with surface backing. Busy remains Fluent’s solid dot (no Regular cut).
- Four corner placements suffice; removed middle/center placements and the nine-position
  matrix. Each status, size, out-of-office state and count gets a separate gallery tile.
- Rectangular compact inset is now a stable Area 4px token, instead of a percentage that
  changes with label width. Circle attachment center sits on the 45-degree rim:
  `(1 - 1/sqrt(2))/2 = 14.64466%` inset on each axis. Compact no longer cancels it.
- Native browser inspection: @Browser can inspect DOM/applied styles; annotation Adjust
  supports style feedback. Full CDP Developer mode is optional and permission-gated.
  The gallery inspector remains a convenient local measurement UI, not a requirement.
- 2026-09-27 · owner (Avatar): count too far in on a circle → `overlap="circular"` counts centre
  on the circle's edge at 45°: inset = r(1 − 1/√2) − 8 (50% of the owner box in the calc);
  dots keep the 2px outward rule → headless Edge screenshot at 4×.
- 2026-09-28 · batch 5 Claude in Chrome side by side (Figma bell, Notion help-button dot) → no change.
- 2026-09-28 · owner: approved (batch 5).
- 2026-09-28 · second pass → Notion's help dot saved as `notion--help-dot--rest--light` (8px, no
  ring, its corner on the 20px icon box's corner). Both products keep the dot inside the icon box;
  Area keeps centring it on the corner (owner, 2026-09-25; owner took the recommendation to keep it).
