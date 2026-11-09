# Button spec

**Captures:** `docs/research/captures/button/` (Area pass-0 build in `before/`)
**Peers:** ButtonGroup and Toolbar (host Button), Composer actions, InputAction, Chip
(pill shape, selectable), Segmented (mode choice), Kbd (shortcut inside a label), Tree view
(6px glyph gap)

## Owner decisions

- 2026-09-25: Button is the next component, after Tree view.
- Type ramp (applied system-wide, `docs/specs/typography.md`): weight 400 everywhere except
  labels on fills (500). Button still set 500 on every variant; this pass applies it.
- 2026-09-25 (after pass 1): sizes: "do whatever you think would be best"; a compact density
  of the whole system is planned for dense products (Cursor and other IDEs, Figma, Notion).
  Decision: no new Button sizes. Compact density already maps sm/md/lg to 24/28/32 (Figma
  24, Notion 28) with a 6px md gap; default keeps 28/32/40.
- 2026-09-25: keep the soft border for now. Capture the hover colour.
- 2026-09-26: small-size label: "do whatever you think best that fits the system; not
  attached to previous values". Decision: default density sm (28) sets 14/20, like md and lg
  (Notion's 28px buttons are 14px); the tiers differ by height. 12/16 stays on xs (24) and in
  compact density. Captions that borrowed the sm control token (field descriptions and
  errors, choice and switch descriptions, panel headings, colour-picker heading) now use the
  caption role (text-xs, 12/16), so they do not change.
- 2026-09-26: "do what you can for soft's hover while keeping the stroke"; show the trailing
  icon; asked whether ButtonGroup or a split button is next.
- 2026-10-08 (via the Confirm dialog review, endorsing its recommendation): one label weight on
  every variant, **500**. A soft Cancel at 400 beside a solid action at 500 read as two type
  styles in one footer; ChatGPT, Notion and Figma set 500 on their solid buttons and Notion on
  outline. This supersedes the 2026-09-25 "400 on soft, outline and ghost" decision for Button.
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Job and boundaries

Button triggers an action, or toggles one (`selected`). It is not navigation to a place
(a link, Nav item, Breadcrumb), not a mode choice among siblings (Segmented), and not a
selectable filter (Chip). ButtonGroup and Toolbar arrange Buttons; they add no Button paint.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| variant | solid (default) | Strongest action | Notion Share popover "Invite" (blue); ChatGPT logged-out "Log in" (near-black); ChatGPT composer send/voice (round); Untitled primary |
| variant | soft | Tinted fill, secondary action | ChatGPT Settings "Manage", "Archive all" (5% black); "Delete all" (10% red); Figma "New Design file" pills (245 fill) |
| variant | outline | Bordered, secondary action | Notion "Copy link" (hairline); ChatGPT logged-out "Sign up", suggestions (1px 20% black); Untitled secondary |
| variant | ghost | Quiet action in toolbars and headers | ChatGPT header Share, message actions, composer tools; Notion topbar Share, Favorite; Figma file browser icons; Untitled tertiary |
| tone | neutral, info, success, warning, caution, danger, discovery | Semantic paint | ChatGPT danger soft ("Delete all"); others from Area's tone axis. Notion's accent solid ("Invite") is the Action role in an accent theme: `accent` was removed as a tone 2026-09-29 (owner, D1) |
| size | sm 28, md 32 (default), lg 40 | Control scale | Notion 28 (topbar), 32 (dialog); ChatGPT 32 (message actions), 36; Figma 24, 32; Untitled 32–48 |
| composition | leading icon | Icon before the label | ChatGPT Share; Notion Share, Advanced; Untitled icon leading |
| composition | trailing icon | Icon after the label, usually a disclosure chevron | ChatGPT model picker |
| composition | icon only | Square | All three products |
| composition | shortcut (Kbd in label) | Command hint | Area addition (Tooltip/Kbd peers) |
| shape | pill | Fully round | ChatGPT Settings pills, composer; Figma "New …" pills |
| layout | full width, align start/end | Placement | Area layout helpers |
| state | hover, active, focus-visible, disabled, loading, selected | Runtime | Hover captured in ChatGPT and Notion; focus in ChatGPT and Untitled |

Not built: a 24px and a 36px size. The planned compact density covers dense products
(compact sm/md/lg = 24/28/32); ChatGPT's 36 falls between md and lg in default density.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| uui | design system (rendered) | Primary sm/md, secondary sm/md (+hover, focus), tertiary md, icon leading | untitledui.com/react/components/buttons, 2026-09-25 | MIT (source) | `uui--*` (9) |
| chatgpt | target product, logged in | Header Share (icon + label), More, composer tools, model picker, send/voice, message actions, Settings soft pills (neutral, danger) | chatgpt.com, owner's session (Chrome), 2026-09-25 | evidence only | `chatgpt--*` (19) |
| chatgpt-loggedout | target product, logged out | Log in (solid), Sign up and suggestions (outline), composer icons | chatgpt.com in the built-in browser, 2026-09-25 | evidence only | `chatgpt-loggedout--*` (13) |
| notion | target product | Topbar Share (ghost text), Favorite, sidebar New page; Share popover Invite (solid accent), Copy link (outline), Advanced (icon + label) | app.notion.com, owner's session (Chrome), 2026-09-25 | evidence only | `notion--*` (12) |
| figma | target product | File browser icon buttons (24, 32), "New Design file" pill, tabs | figma.com/files, owner's session (Chrome), 2026-09-25 | evidence only | `figma--*` (5, rest only) |
| area | this system | Pass-0 build: sizes, variants, danger, leading icon, icon only | localhost gallery | — | `before/area--*` (9) |

Capture conditions: light theme only. Notion and Figma ran at 90% browser zoom (device pixel
ratio 1.8); computed lengths do not depend on zoom, but Notion's 0.56px outline border is a
hairline at that zoom. Figma hover did not register (the extension could not screenshot the
page to anchor the pointer), so Figma is rest only. Nothing was clicked except Notion's
Share (opens a popover; no invite sent) and ChatGPT navigation.

Logged-out ChatGPT uses 44px controls with 600 labels; the logged-in client uses 32–36px
with 400 labels. The logged-in values decide.

## Anatomy

```
chatgpt  button 36, border 1 transparent, padding 0 12, radius 8 (square) or 9999 (pill)
  icon   svg 16 (with label) or 20 (icon only), 8px in on a 36 square, 6px on a 32
  text   14/18 400, gap 4 after the icon
notion   div[role=button] 28 or 32, no border, padding 0 8 (ghost) or 0 12 (solid, outline)
  icon   svg 12–20; 8px from the start on 28 and 32
  text   14/16.8, 400 ghost, 500 on solid and outline; gap 6 after the icon
figma    button 24, radius 5, 11px type; tabs 24 with 8px sides, 450/550
uui      button 36/40, box-shadow ring + inset bottom shade, padding 8/10 12/14, 600
area     button.area-button   owns height, 1px border (transparent unless outline/soft), radius, fill
  icon   span.area-button__icon 16 (md)
  label  span.area-button__label  cap-trimmed text box, ellipsis
```

Inset equations (outer inset = border + shell padding + slot inset; `inset.css`):

| Slot (md 32) | Area | Captured | Products |
|---|---|---|---|
| text, both sides | 1 + (32 − cap 9.94) / 2 − 1 = 11.03 | 11.02 | Notion 12, ChatGPT 13 at 36 (1 + 12) |
| leading icon | 1 + (32 − 16) / 2 − 1 = 8 | 8 | Notion 8 (20px icon on 32), ChatGPT 13 (16px icon on 36) |
| icon to label | gap | 8 → **6** | Notion 6, ChatGPT 4, Untitled 4 + 2 |

The shared equal-inset rule (text inset equals the space above and below the cap) stays:
it lands within 1px of Notion's 12 and matches Notion's icon inset exactly.

## Measurements

Generated with `node scripts/capture-compare.mjs` from `docs/research/captures/button/`,
filtered to the shell, text and icon rows (full tables: run the command on the same files).

### Text buttons, 32–44px
| slot · property | area · size-md · rest · light | notion · solid-accent · rest · light | notion · outline · rest · light | chatgpt · soft-secondary · rest · light | chatgpt-loggedout · solid · rest · light | chatgpt-loggedout · outline · rest · light | uui · secondary-md · rest · light |
|---|---|---|---|---|---|---|---|
| **shell** size | 65.76 × 32 | 59.99 × 32 | 108.96 × 32 | 77.48 × 36 | 64.02 × 44 | 128.79 × 44 | 101.41 × 40 |
| **shell** padding | 0 10.03 0 10.03 | 0 12 0 12 | 0 12 0 12 | 0 12 0 12 | 0 12 0 12 | 0 12 0 12 | 10 14 10 14 |
| **shell** border | 1 solid rgba(0, 0, 0, 0) | 0 | 0.56 solid rgba(28, 19, 1, 0.11) | 1 solid rgba(0, 0, 0, 0) | 0 | 1 solid rgba(0, 0, 0, 0.2) | 0 |
| **shell** radius | 8px | 6px | 6px | 9999px | 999px | 999px | 8px |
| **shell** gap (row / column) | 8px / 8px |  | 8px / 8px | 4px / 4px | 6px / 6px | 6px / 6px | 4px / 4px |
| **shell** font | 14px/20px 500 Geist | 14px/16.8px 500 ui-sans-serif | 14px/16.8px 500 ui-sans-serif | 14px/18px 400 -apple-system-body | 14px/20px 600 -apple-system-body | 14px/20px 600 -apple-system-body | 14px/20px 600 Inter |
| **shell** color | rgb(250, 250, 250) | rgb(243, 249, 253) | rgb(44, 44, 43) | rgb(13, 13, 13) | rgb(255, 255, 255) | oklch(0.159066 0 none) | lab(27.036 0 0) |
| **shell** background | rgb(40, 40, 40) | rgb(39, 131, 222) |  | oklab(0.159065 0.00000723451 0.00000317395 / 0.05) | oklch(0.159066 0 none) | rgb(255, 255, 255) | rgb(255, 255, 255) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px |  |  |  |  |  | lab(84.92 0 -0.0000119209) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.18) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px -2px 0px 0px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px |
| **shell** text cap top / baseline from shell |  | cap +11.73 · baseline −10.4 · start +12 · end −12 | cap +11.73 · baseline −10.4 · start +35.46 · end −12.55 | cap +13.64 · baseline −12.5 · start +13 · end −13 | cap +17.64 · baseline −16.5 · start +12 · end −12 | cap +17.64 · baseline −16.5 · start +13 · end −13 |  |
| **text** size | 43.71 × 16.94 | 59.99 × 32 | 108.96 × 32 | 77.48 × 36 | 64.02 × 44 | 128.79 × 44 | 73.41 × 20 |
| **text** edge from shell (t r b l) | 7.53 11.03 7.53 11.02 |  |  |  |  |  | 10 14 10 14 |
| **text** padding | 3.5 0 3.5 0 | 0 12 0 12 | 0 12 0 12 | 0 12 0 12 | 0 12 0 12 | 0 12 0 12 | 0 2 0 2 |
| **text** border | 0 | 0 | 0.56 solid rgba(28, 19, 1, 0.11) | 1 solid rgba(0, 0, 0, 0) | 0 | 1 solid rgba(0, 0, 0, 0.2) | 0 |
| **text** radius | 0px | 6px | 6px | 9999px | 999px | 999px | 0px |
| **text** gap (row / column) |  |  | 8px / 8px | 4px / 4px | 6px / 6px | 6px / 6px |  |
| **text** font | 14px/20px 500 Geist | 14px/16.8px 500 ui-sans-serif | 14px/16.8px 500 ui-sans-serif | 14px/18px 400 -apple-system-body | 14px/20px 600 -apple-system-body | 14px/20px 600 -apple-system-body | 14px/20px 600 Inter |
| **text** color | rgb(250, 250, 250) | rgb(243, 249, 253) | rgb(44, 44, 43) | rgb(13, 13, 13) | rgb(255, 255, 255) | oklch(0.159066 0 none) | lab(27.036 0 0) |
| **text** background |  | rgb(39, 131, 222) |  | oklab(0.159065 0.00000723451 0.00000317395 / 0.05) | oklch(0.159066 0 none) | rgb(255, 255, 255) |  |
| **text** text cap top / baseline from shell | cap +11.03 · baseline −11.03 · start +11.02 · end −11.03 | cap +11.73 · baseline −10.4 · start +12 · end −12 | cap +11.73 · baseline −10.4 · start +35.46 · end −12.55 | cap +13.64 · baseline −12.5 · start +13 · end −13 | cap +17.64 · baseline −16.5 · start +12 · end −12 | cap +17.64 · baseline −16.5 · start +13 · end −13 | cap +15.31 · baseline −14.5 · start +16 · end −16 |

### Icon and label
| slot · property | area · leading-icon · rest · light | notion · icon-label-ghost · rest · light | notion · text-ghost · rest · light | chatgpt · icon-label-ghost · rest · light | uui · secondary-icon-sm · rest · light |
|---|---|---|---|---|---|
| **shell** size | 86.73 × 32 | 106.05 × 32 | 71.3 × 27.99 | 83.26 × 36 | 120.37 × 36 |
| **shell** padding | 0 10.03 0 7 | 0 8 0 8 | 0 8 0 8 | 0 12 0 12 | 8 12 8 12 |
| **shell** border | 1 solid rgba(0, 0, 0, 0) | 0 | 0 | 1 solid rgba(0, 0, 0, 0) | 0 |
| **shell** radius | 8px | 6px | 6px | 8px | 8px |
| **shell** gap (row / column) | 8px / 8px |  | 6px / 6px | 4px / 4px | 4px / 4px |
| **shell** font | 14px/20px 500 Geist | 14px/16.8px 400 ui-sans-serif | 14px/16.8px 400 ui-sans-serif | 14px/18px 400 -apple-system-body | 14px/20px 600 Inter |
| **shell** color | rgb(250, 250, 250) | rgb(44, 44, 43) | rgb(44, 44, 43) | rgb(13, 13, 13) | lab(27.036 0 0) |
| **shell** background | rgb(40, 40, 40) |  |  |  | rgb(255, 255, 255) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px |  |  |  | lab(84.92 0 -0.0000119209) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.18) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px -2px 0px 0px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px |
| **shell** text cap top / baseline from shell |  |  | cap +9.73 · baseline −8.39 · start +26.05 · end −7.99 | cap +13.64 · baseline −12.5 · start +33 · end −13 |  |
| **icon** size | 16 × 16 | 20 × 20 | 12.06 × 20 | 16 × 16 | 20 × 20 |
| **icon** edge from shell (t r b l) | 8 62.73 8 8 | 6 78.06 6 7.99 | 3.99 51.25 4 7.99 | 10 54.26 10 13 | 8 88.37 8 12 |
| **icon** padding | 0 | 0 | 0 | 0 | 0 |
| **icon** border | 0 | 0 | 0 | 0 | 0 |
| **icon** radius | 0px | 0px | 0px | 0px | 0px |
| **icon** color |  | rgb(142, 139, 134) | rgb(56, 56, 54) | rgb(13, 13, 13) | lab(66.128 -0.0000298023 0.0000119209) |
| **text** size | 43.71 × 16.94 | 64.06 × 16.8 | 71.3 × 27.99 | 83.26 × 36 | 72.37 × 20 |
| **text** edge from shell (t r b l) | 7.53 11.02 7.53 32 | 7.6 8 7.6 33.99 |  |  | 8 12 8 36 |
| **text** padding | 3.5 0 3.5 0 | 0 | 0 8 0 8 | 0 12 0 12 | 0 2 0 2 |
| **text** border | 0 | 0 | 0 | 1 solid rgba(0, 0, 0, 0) | 0 |
| **text** radius | 0px | 0px | 6px | 8px | 0px |
| **text** gap (row / column) |  | 4px / 4px | 6px / 6px | 4px / 4px |  |
| **text** font | 14px/20px 500 Geist | 14px/16.8px 400 ui-sans-serif | 14px/16.8px 400 ui-sans-serif | 14px/18px 400 -apple-system-body | 14px/20px 600 Inter |
| **text** color | rgb(250, 250, 250) | rgb(44, 44, 43) | rgb(44, 44, 43) | rgb(13, 13, 13) | lab(27.036 0 0) |
| **text** text cap top / baseline from shell | cap +11.03 · baseline −11.03 · start +32 · end −11.02 | cap +11.73 · baseline −10.4 · start +33.99 · end −7.99 | cap +9.73 · baseline −8.39 · start +26.05 · end −7.99 | cap +13.64 · baseline −12.5 · start +33 · end −13 | cap +13.31 · baseline −12.5 · start +38 · end −14 |

### Icon only
| slot · property | area · icon-only · rest · light | figma · icon-ghost-24 · rest · light | notion · icon-ghost · rest · light | chatgpt · icon-ghost-32 · rest · light | chatgpt · icon-ghost-square · rest · light |
|---|---|---|---|---|---|
| **shell** size | 32 × 32 | 23.99 × 23.99 | 27.99 × 27.99 | 32 × 32 | 36 × 36 |
| **shell** padding | 0 | 0 | 0 | 0 | 0 |
| **shell** border | 1 solid rgba(0, 0, 0, 0) | 0 | 0 | 1 solid rgba(0, 0, 0, 0) | 1 solid rgba(0, 0, 0, 0) |
| **shell** radius | 8px | 5px | 6px | 8px | 8px |
| **shell** gap (row / column) | 8px / 8px |  | 0px / 0px | 4px / 4px | 4px / 4px |
| **shell** background | rgb(40, 40, 40) |  |  |  |  |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px |  |  |  |  |
| **shell** outline |  | 0.555556px solid rgba(0, 0, 0, 0) offset -0.555556px |  |  |  |
| **icon** size | 16 × 16 | 23.99 × 23.99 | 20 × 20 | 20 × 20 | 20 × 20 |
| **icon** edge from shell (t r b l) | 8 8 8 8 | 0 0 0 0 | 3.99 4 4 3.99 | 6 6 6 6 | 8 8 8 8 |
| **icon** padding | 0 | 0 | 0 | 0 | 0 |
| **icon** border | 0 | 0 | 0 | 0 | 0 |
| **icon** radius | 0px | 0px | 0px | 0px | 0px |
| **icon** color |  | rgb(0, 0, 0) | rgb(142, 139, 134) | rgb(143, 143, 143) | rgb(13, 13, 13) |

### Sizes
| slot · property | area · size-sm · rest · light | area · size-lg · rest · light | figma · tab · rest · light | uui · primary-sm · rest · light | uui · primary-md · rest · light |
|---|---|---|---|---|---|
| **shell** size | 56.94 × 28 | 73.76 × 40 | 79.15 × 23.99 | 96.37 × 36 | 101.41 × 40 |
| **shell** padding | 0 8.74 0 8.74 | 0 14.03 0 14.03 | 0 8 0 8 | 8 12 8 12 | 10 14 10 14 |
| **shell** border | 1 solid rgba(0, 0, 0, 0) | 1 solid rgba(0, 0, 0, 0) | 0 | 0 | 0 |
| **shell** radius | 6px | 10px | 5px | 8px | 8px |
| **shell** gap (row / column) | 4px / 4px | 8px / 8px |  | 4px / 4px | 4px / 4px |
| **shell** font | 12px/16px 500 Geist | 14px/20px 500 Geist | 11px/16px 450 Inter | 14px/20px 600 Inter | 14px/20px 600 Inter |
| **shell** color | rgb(250, 250, 250) | rgb(250, 250, 250) | rgba(0, 0, 0, 0.5) | rgb(255, 255, 255) | rgb(255, 255, 255) |
| **shell** background | rgb(40, 40, 40) | rgb(40, 40, 40) | rgb(255, 255, 255) | rgb(127, 86, 217) | rgb(127, 86, 217) |
| **shell** shadow | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px | rgba(0, 0, 0, 0.06) 0px 0.5px 1px -0.5px |  | rgba(0, 0, 0, 0) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.18) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px -2px 0px 0px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px | rgba(0, 0, 0, 0) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.18) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px -2px 0px 0px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px |
| **text** size | 37.47 × 14.52 | 43.71 × 16.94 | 63.16 × 16 | 72.37 × 20 | 73.41 × 20 |
| **text** edge from shell (t r b l) | 6.73 9.74 6.75 9.73 | 11.53 15.03 11.53 15.02 | 3.99 8 4 7.99 | 8 12 8 12 | 10 14 10 14 |
| **text** padding | 3 0 3 0 | 3.5 0 3.5 0 | 0 | 0 2 0 2 | 0 2 0 2 |
| **text** border | 0 | 0 | 0 | 0 | 0 |
| **text** radius | 0px | 0px | 0px | 0px | 0px |
| **text** font | 12px/16px 500 Geist | 14px/20px 500 Geist | 11px/16px 550 Inter | 14px/20px 600 Inter | 14px/20px 600 Inter |
| **text** color | rgb(250, 250, 250) | rgb(250, 250, 250) | rgba(0, 0, 0, 0.5) | rgb(255, 255, 255) | rgb(255, 255, 255) |
| **text** text cap top / baseline from shell | cap +9.74 · baseline −9.74 · start +9.73 · end −9.74 | cap +15.03 · baseline −15.03 · start +15.02 · end −15.03 | cap +8.1 · baseline −7.89 · start +7.99 · end −8 | cap +13.31 · baseline −12.5 · start +14 · end −14 | cap +15.31 · baseline −14.5 · start +16 · end −16 |

### Hover
| slot · property | chatgpt · soft-secondary · hover · light | chatgpt · icon-label-ghost · hover · light | notion · text-ghost · hover · light | notion · solid-accent · hover · light | notion · outline · hover · light | uui · secondary-md · hover · light |
|---|---|---|---|---|---|---|
| **shell** border | 1 solid rgba(0, 0, 0, 0) | 1 solid rgba(0, 0, 0, 0) | 0 | 0 | 0.56 solid rgba(28, 19, 1, 0.11) | 0 |
| **shell** color | rgb(13, 13, 13) | rgb(13, 13, 13) | rgb(44, 44, 43) | rgb(243, 249, 253) | rgb(44, 44, 43) | lab(15.204 0 -0.00000596046) |
| **shell** background | oklab(0.159065 0.00000723451 0.00000317395 / 0.1) | rgba(0, 0, 0, 0.05) | color(srgb 0.129412 0.105882 0.0901961 / 0.0509804) | color(srgb 0.122395 0.463619 0.801134) | color(srgb 0.129412 0.105882 0.0901961 / 0.0509804) | lab(98.26 0 0) |
| **shell** shadow |  |  |  |  |  | lab(84.92 0 -0.0000119209) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.18) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px -2px 0px 0px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px |

### Hover, Area before and after against the products

| slot · property | area · ghost · hover · light | area · ghost · hover-before · light | area · outline · hover · light | area · outline · hover-before · light | area · soft · hover · light | area · solid · hover · light | chatgpt · icon-label-ghost · hover · light | notion · text-ghost · hover · light | chatgpt · soft-secondary · hover · light | chatgpt-loggedout · outline · hover · light | notion · solid-accent · hover · light |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **shell** border | 1 solid rgba(0, 0, 0, 0) | 1 solid rgba(0, 0, 0, 0) | 1 solid color(srgb 0.831373 0.831373 0.831373) | 1 solid color(srgb 0.831373 0.831373 0.831373) | 1 solid rgb(238, 238, 238) | 1 solid rgba(0, 0, 0, 0) | 1 solid rgba(0, 0, 0, 0) | 0 | 1 solid rgba(0, 0, 0, 0) | 1 solid rgba(0, 0, 0, 0.2) | 0 |
| **shell** background | rgba(20, 20, 20, 0.05) | rgb(247, 247, 247) | rgb(243, 243, 243) | rgb(247, 247, 247) | rgb(243, 243, 243) | rgb(29, 29, 29) | rgba(0, 0, 0, 0.05) | color(srgb 0.129412 0.105882 0.0901961 / 0.0509804) | oklab(0.159065 0.00000723451 0.00000317395 / 0.1) | oklch(0.964154 0 none) | color(srgb 0.122395 0.463619 0.801134) |

### Focus-visible
| slot · property | chatgpt · soft-secondary · focus-visible · light | chatgpt-loggedout · solid · focus-visible · light | uui · secondary-md · focus-visible · light |
|---|---|---|---|
| **shell** shadow | rgb(255, 255, 255) 0px 0px 0px 0px, rgb(58, 131, 247) 0px 0px 0px 2px |  | lab(84.92 0 -0.0000119209) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.18) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.05) 0px -2px 0px 0px inset, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px |
| **shell** outline |  | 2px solid oklch(0.626176 0.205304 254.998) offset 2px | 2px solid rgb(158, 119, 237) offset 2px |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| label · weight | **500** on every variant (`button.css:29-31`, the base `--_weight`; solid no longer sets its own) | Owner 2026-10-08 (Confirm dialog review); ChatGPT solid 500, Notion solid and outline 500, Figma Share 450 at 11px | Was 500 everywhere, then 400 on soft, outline and ghost (2026-09-25 type ramp) until the owner chose one weight. ChatGPT soft and ghost and Notion ghost are 400 |
| icon → label gap | **6** at sm, md and lg, the density tokens `--area-gap-sm/md/lg` (button.css:26, :436, :446, :456; density.ts:80-82); compact sm 4 | Notion 6 (28 and 32); peer Tree view 6 | Was 8, then a literal 6 at md and lg with sm at 4 (audit S14 moved sm to 6 and put the value in the tokens). ChatGPT 4 and Untitled 4 + 2 bracket it |
| shadow | **none** on solid, soft and outline | ChatGPT and Notion: no shadow on any button | Was `shadow-1` (0 0.5px 1px −0.5px). Untitled's ring-and-shade is its own look |
| height | sm 28, md 32, lg 40 (unchanged) | Notion 28/32; all three show 32 | lg 40 matches Untitled; no product shows 40 (ChatGPT 36). Open question |
| radius | 6 / 8 / 10 (unchanged, `radius-control-*`) | ChatGPT 8 at 32–36 | Notion 6, Figma 5; follows the radius preset |
| text inset | equal inset (11 at md) | `inset.css` shared rule | Notion 12, ChatGPT 12 + border; within 1px |
| ghost hover (neutral) | **`bg-component-hover`** #f3; pressed **`bg-component-active`** (button.css:377-380) | ChatGPT 5% black, Notion 5% warm black, Figma 5%: about #f2 on white; the row plate Menu, Nav, Tree view and Table share | Was `bg-component` (247 opaque, about 3%), then the translucent `bg-hover` / `bg-active`. Row hosts (Tree view, Nav) switch nested ghosts back to `bg-hover` (audit S11c) |
| ghost hover (tones) | tone `surface-hover`; pressed `surface-active` | Consistency with neutral (one rung stronger) | Was `surface` / `surface-hover` |
| outline hover | `surface-hover` (neutral 243); pressed `surface-active` (238) | ChatGPT logged-out outline 241; ghost washes 242 | Was 247 |
| soft hover (neutral) | fill 247 + **`bg-hover` wash** (≈235); border **`bg-hover`, translucent** (≈224); pressed wash **`bg-active`** (≈231) | ChatGPT soft 242 → 230; owner: keep the stroke | Was 247 → 243 with border 238. A translucent border tints whatever the wash painted, so the stroke stays one step darker in every state and theme without a new fill rung. Tone softs keep their one-rung step (a grey wash would muddy tinted fills) |
| trailing icon | end inset 8 at md (equal inset), gap 6 | `inset.css` shared rule; ChatGPT picker gap 6 | ChatGPT's picker chevron sits 14 from the end at 36 (text side 12). One product only; the shared rule stays |
| solid hover | unchanged: 40 → 29 | Notion's blue darkens about 10% | — |
| soft border | kept (hairline one rung up) | Owner (2026-09-25) | ChatGPT's soft pill has none |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | ghost: 5% wash (neutral) or tone surface-hover; outline: surface-hover; soft: one rung; solid: solid-hover | ChatGPT ghost 0 → 5%, soft 5% → 10%, danger 10% → 20%; Notion ghost 0 → 5%, solid blue darkens; Untitled secondary fill to lab 98. Area: `area--*--hover`, before in `before/*hover-before*` |
| focus-visible | 2px ring | ChatGPT 2px blue ring (box-shadow), logged-out 2px outline, offset 2; Untitled 2px outline, offset 2 |
| selected | the selected plate holds under hover and press: no hover or press wash (audit A-13); soft selected's edge is its fill, not the lighter hover hairline; solid selected is `solid-hover` (button.css:400-418) | not captured |
| menu open | a menu trigger (`aria-haspopup="menu"`, `aria-expanded="true"`) keeps the pressed plate while its menu is open, as Model picker did alone; a selected toggle keeps its own fill (button.css:145-150, audit G-12) | ChatGPT model picker |
| disabled | unchanged | not captured |
| loading | Spinner replaces the leading icon and fills the tier's icon box (`--_icon`: 12/16/20); full opacity, `cursor: progress`; `loading` + `disabled` is plainly disabled | Visuals not captured. Behaviour: audit S18 (owner pick 2026-09-30) |
| inactive (`inactive`, `inactiveText`) | drawn as disabled: fill and edge mixed to `opacity-disabled` toward transparent, the parts at `opacity-disabled`, no hover, press or give, `cursor: not-allowed`; the button itself keeps full opacity so its focus ring does; `aria-disabled`, the press dropped; the reason a Tooltip that describes it. `disabled` wins | Primer `inactive` (`src/Button/types.ts:46-50`), Claude's `disabledReason` tooltip (chat-apps.md); components audit V2 |

## Behavior and accessibility

Native `button`, `type="button"` by default, `aria-pressed` for `selected`, icon-only
requires `aria-label`. `loading` (audit S18, 2026-09-30) does not set native `disabled`: it
sets `aria-disabled="true"`, `aria-busy` and `data-loading`, and drops clicks with
`preventDefault` (a submit Button doesn't submit). The Button stays focusable and in the Tab
order, so focus isn't lost on submit. A nested Kbd's spoken chord is hidden inside the Button,
which carries `aria-keyshortcuts` instead, so the name isn't "Button Command plus Enter"
(audit A-16, `kbd.css:150-153`).

## Peers and consistency

| Peer | Shared role | Peer value | Button | Match / reason |
|---|---|---|---|---|
| Tree view | glyph → label gap | 6 | 6 (sm, md, lg) | Match |
| Type ramp | label weight | 400; 500 on fills | 500 on every variant | Differs by owner decision (2026-10-08): a Button label is one weight whatever its fill |
| Kbd | nested shortcut | `currentColor` 14% plate, inherited ink, own 6 corner (`kbd.css:131-135`) | every variant and state | Match (audit S12c): the plate follows the Button's ink, so it survives hover, press and selected fills |
| Tree view, Nav | ghost Button on a row | hover `bg-hover`, press `bg-active` (`tree-view.css:74`, `nav.css:243`) | neutral ghost default `bg-component-hover` (`button.css:385-388`) | Row hosts override (audit S11c), so the plate shows on a hovered or current row |

## Visual pass

Pass review (`GalleryReviewButton`): weight, gap and shadow, before and after at 1× and 3×.
At 400 the soft, outline and ghost labels sit closer to ChatGPT's settings pills and Notion's
topbar; solid keeps its 500 weight against the dark fill. Without the shadow, solid and
outline read flat, as in both products.

Soft hover now lands near ChatGPT's step (≈235 against 230) with the stroke kept; checked at
3× in the pass review. Gallery tiles: "Leading icon" and a new "Trailing icon" (ghost with a
chevron, as ChatGPT's model picker).

## Verification

- 58 reference captures (ChatGPT 19 logged in + 13 logged out, Notion 12, Figma 5,
  Untitled 9), 9 Area before and 9 after; all checksums verified by `capture-compare`.
  Captures were checked for personal content (redacted off localhost; no names or titles).
- Area after (`area--*`): soft, outline and ghost labels 400, solid 500; leading-icon label at
  30 (was 32) with the icon still at 8; no shadow on any variant; text insets unchanged.
- Pass review checked on screen at 1× and 3×.
- `typecheck`, `build:docs` (docs audit), `test:contracts` (14), `test:preview` (4), React
  tests (87), `npm test` (19,491 token and contrast): all pass.
- Hover (pass 1b): Area solid, soft, outline and ghost captured after the change; outline
  and ghost before-states recreated through the private properties (`before/*hover-before*`).
- Unverified: dark theme (products not switched), Figma hover, disabled/loading/selected against references, compact density
  (the gap follows density since audit S14; compact sm is 4).

## Motion and interaction

Contract: `docs/MOTION.md`. Button is the system's reference interaction. Since 2026-10-24 its arrivals follow the
Feedback setting (`axes/feedback.ts`; default Subtle): hover and press ease in over `hover-in` / `press-in` (0.65 of
`duration-fast`, about 90ms at Speed 210) and fade out over `fast`, on the Easing setting's `ease-out` (Subtle,
`(0.22, 1, 0.36, 1)`, by default); a pointer press gives a little (`button.css`, "Motion"). Feedback Off is the
2026-10-07 behaviour (every arrival 0s, no give).

| Interaction | 2026-10-07 | Now (Feedback Subtle) |
|---|---|---|
| hover in | **instant** (`:hover` 0s) | `hover-in` (≈91ms) `ease-out`, under `@media (hover: hover)` |
| hover out | `fast` `ease-out` | unchanged (`--area-transition`) |
| press (`:active`) | **instant** in; release `fast` | `press-in` (≈91ms) in, release `fast` |
| press give | none | `scale` to `--_give`: sm and icon-only 0.96, md 0.97, lg 0.975, full width 0.985 (`feedback-scale-*`), released over `fast`; never for a key press (`:focus-visible`), a menu trigger (`aria-haspopup`), disabled or loading |
| selected on / off (`data-selected`) | **instant** on, `fast` off | `press-in` on, `fast` off |
| menu open (`aria-expanded="true"`) | **instant** on, `fast` off | `press-in` on, `fast` off |
| focus-visible | outline, not transitioned | unchanged: instant both ways |
| disabled | opacity, not transitioned | unchanged |
| loading | Spinner swaps in for the leading icon at once; the hover plate fades out (`fast`) | unchanged |
| reduced motion | tokens | durations 0 and the give at 1 (`emit/css.ts`) |

Crispness: no resting transform, `will-change` or `box-shadow` edge (the border is a real
`border`, the ring an `outline`). Heights are whole pixels at every tier; widths follow the label
and are fractional, which layout snaps. Reduced motion: every Button duration is a token, so the
system rule (`emit/css.ts`, `:root, [data-area-motion]`) takes all of them to 0.

Verified 2026-10-07 on `/button.html` (Chrome, DPR 2, computed styles, background tab):
`transition-duration` 0.1s at rest and 0s with `data-selected` and `aria-expanded="true"`;
toggling `data-selected` on a ghost Button creates no transition on the way in and
`background-color` + `color` transitions of 100ms `cubic-bezier(0.16, 1, 0.3, 1)` on the way out;
`data-area-motion="0"` gives 0s. The `:hover` and `:active` rules were confirmed in the served
CSSOM; a real pointer hover could not be driven in a background tab.

Open questions:
1. ~~Soft Buttons render 14/400 and solid 14/500.~~ Resolved 2026-10-08: 500 on every variant.
2. Loading adds the spinner where a Button had no icon, so the Button grows by icon + gap (65.7 →
   84.7 on "Button" at md) and its neighbours move. Recommendation: keep the width by laying the
   spinner over a hidden label (Primer, Radix) for text-only Buttons. Needs owner approval; it is
   a layout change, not motion.

## Interaction polish, 2026-10-16

Solid presses one step past hover in the same direction (`--_solid-active`: neutral #1d → about #15 in light, #fa → #fff in dark; tones and accent 10% toward black; ChatGPT #0d → #30 → #41). Neutral ghost and outline press at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover); neutral soft's press wash is `bg-pressed` (10%). Selected toggles are unchanged. See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-09-28 · batch 11 Chrome side by side: Figma's Share (32 tall, corner 5, 0 12, 11/16 450,
  solid #0d99ff) beside Area md (32, corner 8, 11 inset, 14/20 500), Notion solid and outline
  (32, corner 6, 12) and ChatGPT pills → no change: height matches, the 11 inset is the shared
  equal-inset rule (within 1px), Figma's 11px label belongs to compact density →
  `figma--share-solid--rest--light`. Kbd inside Buttons now keeps its own 6px corner (kbd.md).

- 2026-09-25 · owner chose Button as the next component → evidence pass: 58 reference
  captures, 9 Area pass-0 captures; weight, gap and shadow changed.
- 2026-09-25 · owner: sizes are my call, a compact density is planned; keep the soft border;
  capture the hover colour → no new sizes (compact covers 24/28/32). Hover captured: Area
  ghost 247 vs products' 5% wash (242–243), outline 247 vs 241. Neutral ghost now uses
  `bg-hover`/`bg-active`; ghost tones and outline move one rung up; soft unchanged.
- 2026-09-26 · owner: stronger soft hover, keep the stroke; show trailing icon → neutral soft
  hovers with the bg-hover wash over its fill and a translucent border (`area--soft--hover`,
  before in `before/area--soft--hover-before`); Trailing icon tile added and captured
  (`area--trailing-icon--rest`) against ChatGPT's picker.

- 2026-09-28 · owner (batch 20, after ChatGPT's quiet controls showed muted ink: model-picker
  label #8f, scroll-to-bottom glyph #5d): "i just want consistency overall, is it possible to
  lighten all ghost and outline buttons slightly, since i prefer lighter colors anyway" → neutral
  ghost and outline ink is `color-mix(in oklab, fg-default, fg-muted 75%)`: #565656 on white
  (7.34:1, was #282828), #cfcfcf on the dark surface (10.8:1). Icons follow (`currentColor`).
  A selected toggle (`data-selected`) keeps body ink; solid and the accent / status tones are
  unchanged. Every ghost and outline use across the system (Toolbar, Dialog close, Message
  actions, Model picker, Scroll to latest, chips) takes it at once.
- 2026-09-30 · audit S11c, S12c (owner) → a Kbd inside any Button is a `currentColor` 14% plate with inherited ink (was neutral-solid only, with a `bg-inverse` 16% plate on coloured solids; `kbd.css:131-135`); ghost Buttons in Tree view and Nav row actions hover `bg-hover` and press `bg-active` (`tree-view.css:74`, `nav.css:243`).
- 2026-09-30 · audit S14 (owner) → the icon-to-label gap reads the density tokens (button.css:26, :436, :446, :456), 6 at sm, md and lg (density.ts:80-82; sm was 4). Button group and Toolbar no longer override a child's `--_gap`, so hosted Buttons keep 6.
- 2026-10-01 · audit A-13 (owner pick A) → a selected toggle takes no press wash, and a soft selected Button's edge is its fill (was the lighter #f3 hairline over #ee) → button.css:409-414.
- 2026-10-01 · audit A-15, A-16 → Kbd's on-emphasis merged into on-color; the chord's sr-only text is hidden inside a Button (see kbd.md) → kbd.css:108-116, :150-153.
- 2026-10-01 · audit G-12 (owner pick A) → a menu-button trigger keeps the pressed plate while expanded (SplitButton, Menu triggers) → button.css:145-150.
- 2026-10-01 · audit A-23, H-26 → in a group, a disabled button's seam is drawn by its enabled neighbour at full strength, and a fully disabled ButtonGroup or SplitButton dims once as a whole (see button-group.md, split-button.md).
- 2026-10-01 · owner (audit H-13): the manifest `align` values are `start | end` (classes `area-button--start` / `--end`; were `align-start` / `align-end`). React `align` is unchanged.
- 2026-10-01 · compact pass → a trailing Kbd's end inset reads the mark role (was a literal 20), so at compact the Kbd sits 6 from the top and the end (was 6 / 4). docs/research/compact-pass-2026-10-01.md.
- 2026-10-04 · pill shapes and list rows (owner) → `--area-pill-button` (data-area-pills="button") makes every Button a pill; `pill` is now three-way: unset follows the list, true forces a pill, false (`--rounded`) the radius corner (`button.css`, `Button.tsx`). `docs/research/radius-audit-2026-10-03.md`, "Pill shapes and list rows".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → hover, press, selected and menu-open land instantly and fade out over duration-fast (button.css, "Motion"); no press scale; focus ring unchanged (instant).
- 2026-10-24 · owner: "alot of the components dont have any visible motion/interaction animation ... implement the subtle package as the default" (bencho.dev as the reference) → arrivals on the Feedback setting (Subtle: ≈91ms hover and press in), a pointer press gives 0.96–0.985 by size, never for keys or menu triggers; Easing defaults to Subtle (docs/research/motion-subtle-2026-10-24/systems.md).
- 2026-10-08 · owner (Confirm dialog review: "go with your recs"; one weight for both footer
  buttons) → Button's label weight is 500 on every variant (`button.css:29-31`; the solid rule's
  own 500 removed). Knock-on, all through Button with no host override: Button group, Split
  button and Toolbar text items, Prompt suggestions (outline), Model picker trigger (ghost),
  Confirm dialog and Dialog footers, Card footers now set 500 labels. Icon-only Buttons, Chip,
  Segmented (already 500) and Calendar days (not Buttons) are unchanged. No geometry change
  besides label width: Geist 14 at 500 is 2.6-2.8% wider ("Button" 42.50 → 43.71, "Keep editing"
  79.24 → 81.33). Browser 2026-10-08 (gallery, light): solid, soft, outline and ghost all compute
  500; 169 visible text Buttons across Button group, Split button, Toolbar, Prompt suggestions and
  Model picker are all 500 with no label overflow and unchanged heights.
- 2026-10-12 · owner, 2026-10-12: "go with your recommendations" (consistency pass) → neutral outline and ghost ink reads `fg-quiet` (O5: one role for a literal written in several families; same paint). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-18 · owner: "go with your recommendations … finalize the material, surface, stroke, elevation axis theming" → Edge and Depth (axes/depth.ts; docs/research/elevation-stroke-2026-10-18): outline and soft Buttons rest on `--_shadow: var(--area-shadow-field)`, Field shadow, 0 by default (a transparent role, so nothing changes until it is raised; Primer's button lip and shadcn's shadow-xs when it is). Under a Material it rides in `--_m-own` beside the material's layers (material.css).

## Review note, 2026-10-19 (round 53, from Kbd)

- **What changed:** a trailing keycap (Save ⌘S) now sits 8 from the label instead of a space (4); Button lifts it out
  of the label so its gap spaces it.
- **Why:** Kbd's new rule for the gap between a key and its words (Tooltip's and ChatGPT's 8).

## Review note, 2026-10-24 (onColor)

- **What changed:** `onColor` (class `area-button--on-color`): a button on a painted colour takes the ink its parent
  sets, with no fill or edge at rest and plates of that ink at 12% (hover) and 20% (held), overriding the variant's and
  tone's paint. The app's colour cards use it for Copy.
- **Why:** the owner: "copy added to color?". A ghost button's neutral ink and plates are made for the page, not for a
  colour; Badge already had `onColor` for the same case.

## Review note, 2026-10-28 (dark soft tones)

- **What changed:** soft buttons in a tone in dark (danger, info, success, warning, caution, discovery) are quieter: each tone's soft surface is the neutral control fill of the same state in the
  tone's hue at chroma 0.05 / 0.06 / 0.07 (danger rest #3d1d1f, was #820022). Inks and light are unchanged; the ink
  reads better (Delete's label 7.34:1 → 10.38:1).
- **Why:** ChatGPT, Notion and Figma paint dark soft tones at chroma 0.04–0.07; Area's palette rungs carried up to 0.15
  and read almost solid. A token change (DESIGN_SYSTEM.md, Colour: dark soft tones;
  docs/research/dark-soft-tones-2026-10-28).
- **Verdict:** approved by the owner on the dark soft tones review page, 2026-10-28 (option A, every family approved).

### 2026-11-07 · The event in onSelectedChange (components audit O3)

- **What changed:** `onSelectedChange(selected, event)` passes the press, as Chip's.
- **Why:** Button.tsx:39. From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.

### 2026-11-07 · Inactive (components audit V2)

- **What changed:** `inactive` and `inactiveText`. An inactive Button looks disabled but keeps focus, its place in the
  Tab order (and in a Toolbar's arrow order) and the pointer; `aria-disabled="true"` and `data-inactive`, the click
  dropped as loading drops it. `inactiveText` renders an Area Tooltip on hover and focus that describes the button
  (`aria-describedby`); it takes the place of a naming Tooltip, so an icon-only inactive button keeps its name in
  `aria-label`. Painted without an opacity on the element (an opacity would fade the focus ring with it): the fill and
  edge are mixed toward transparent by `opacity-disabled` and the parts take it, the same picture as disabled.
- **Why:** docs/research/components-audit-2026-11-07/primer.md ("`inactive` is not `disabled`", the degraded-experiences order), chat-apps.md ("Disabled with
  a reason"). The choosing rule is WRITING.md, "Disabled or inactive". The owner took every recommendation ("Take all
  recs", 2026-11-07).
- **Verdict:** awaiting the owner.
