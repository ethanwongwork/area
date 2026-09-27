# Untitled UI reference values

Untitled UI is Area's first design-system reference ([Design references](../DESIGN_REFERENCES.md)).
This page records what its React source renders for the components the
[cohesion audit](cohesion-audit.md) re-checked, so specs can cite one pinned reading instead of
re-deriving Tailwind classes.

**Source:** [untitleduico/react](https://github.com/untitleduico/react) at
`4702dc0ea8d140c3491a85670c7b4fab47b722da` (MIT), read 2026-09-26 from
`.cache/sources/uui@4702dc0…/` (ignored). Paths below are relative to that checkout;
`T` is `styles/theme.css`. Values are resolved from the classes, not measured in a browser:
they are source evidence, and a rendered capture of the docs site outranks them when the
two disagree.

**How the tokens resolve.** The theme does not override Tailwind v4's spacing (4px unit),
radii (`rounded` 4, `-md` 6, `-lg` 8, `-xl` 12, `-2xl` 16) or its `neutral` and `red`
palettes (neutral-50 #fafafa, 100 #f5f5f5, 200 #e5e5e5, 300 #d4d4d4, 400 #a1a1a1,
500 #737373, 600 #525252, 700 #404040, 900 #171717). Type: xs 12/18, sm 14/20, md 16/24,
lg 18/28 (T:8-35). Shadows: `xs` 0 1px 2px .05 (T:54); `sm` 0 1px 3px .1, 0 1px 2px −1px .1
(T:55); `lg` 0 12px 16px −4px .08, 0 4px 6px −2px .03, 0 2px 2px −1px .04 (T:57); `xl`
0 20px 24px −4px .08, 0 8px 8px −4px .03, 0 3px 3px −1.5px .04 (T:58). Borders are
`ring-1 ring-inset` box-shadows in `border-primary` (neutral-300, T:301) or
`secondary_alt` (black 10%, T:303). Focus is a 2px `brand-500` outline (T:370).
Disabled is `opacity-50` throughout.

## Actions and choices

| Component | Geometry | Paint and states | Source |
|---|---|---|---|
| Button | xs 32, sm 36, md 40, lg 44, xl 48 (padding + 20/24 leading); radius 8; 14/20 600 (lg+ 16/24); 20px icons (16 at xs); gap 4 (6 at lg+); default size sm | Secondary: white, neutral-700 text, 1px neutral-300 ring + inset skeuomorphic line. Hover: neutral-50 fill **and** a darker label. Disabled 50%. No pressed state. Loading: 20px spinner, 2px stroke, ~25% arc | `components/base/buttons/button.tsx:13-127, 176-248` |
| ButtonGroup | sm 36, md 40, lg 44; items overlap 1px; outer radius 8 | Selected = hover paint (neutral-50); disabled dims text only | `components/base/button-group/button-group.tsx:16-99` |
| Toggle (Switch) | sm 36×20 with 2px padding and a 16px thumb; md 44×24, 20px thumb; slim variants 32×16 and 40×20 | Off: neutral-100 track with a 0.5px neutral-200 ring. On: brand-600, hover brand-700 (on only). Thumb white, `shadow-sm`. Disabled 50% | `components/base/toggle/toggle.tsx:22-90` |
| Checkbox | sm 16 box, radius 4, 12px check; md 20, radius 6, 14px check; label gap 8 / 12 | Rest white with a neutral-300 ring; checked brand-600 fill and ring, white glyph. Disabled 50% (unchecked turns neutral-100). No hover, no invalid | `components/base/checkbox/checkbox.tsx:20-108` |
| Radio | sm 16 with a 6px dot; md 20 with 8px; group gap 16 | As Checkbox | `components/base/radio-buttons/radio-buttons.tsx:30-118` |
| Slider | 24px hit area; 8px neutral-200 rail; 24px white thumb with a 2px brand ring and `shadow-md` | No hover or disabled styles | `components/base/slider/slider.tsx:35-58` |
| Progress | 8px bar, radius 6, neutral-200 track, brand fill; labels 14/20 500, 12px gap beside / 8px below | — | `components/base/progress-indicators/progress-indicators.tsx:47-92` |
| Loading indicator | 32 / 48 / 56 / 64px; stroke 4 on a 32 viewBox; neutral-100 track; ~28% brand arc; 1s linear spin | — | `components/application/loading-indicator/loading-indicator.tsx:9-111` |
| Tags (Chip) | sm 24 (8/3 padding, 12/18 500), md 24 (14/20), lg 28; radius 6; close 14 / 16 / 20 | White, neutral-300 ring; close hover neutral-50. Selection changes only the embedded checkbox | `components/base/tags/tags.tsx:62-172`, `tag-checkbox.tsx:17-24` |

## Fields

| Component | Geometry | Paint and states | Source |
|---|---|---|---|
| Input | sm 36 (12/8 padding, 14/20, 16px icon at 12), md 40 (16/24, 20px icon), lg 44 (14/10); icon 8px before text; default md | White, `shadow-xs`, neutral-300 ring, radius 8. No hover. Focus 2px brand ring. Invalid red-300 ring (red-500 focused). Disabled 50%. Placeholder neutral-500 | `components/base/input/input.tsx:49-219` |
| Label and hint | Label 14/20 500 neutral-700; hint 14/20 neutral-600 (12/18 at sm); 6px between label, control and hint | Required mark brand-600, red when invalid | `label.tsx:28-54`, `hint-text.tsx:22-30` |
| Textarea | sm padding 12, 14/20; md 14/12, 16/24 | As Input | `components/base/textarea/textarea.tsx:33-44` |
| Select trigger | sm 36, md 40, lg 44; padding 12 left / 10 right; gap 8; 16px chevron in fg-quaternary | Value 500 neutral-900, placeholder neutral-500. No hover and **no invalid paint** (only the hint turns red). Disabled 50% | `components/base/select/select.tsx:42-98`, `select-shared.tsx:41-48` |
| Select popover | 4px offset, trigger width, radius 8, 4px vertical padding, `shadow-lg`, 1px black-10% ring; max height 224 / 256 / 320 | Options: row inset 4–6px, radius 6, 36px inner row at sm; hover, focus and selected all neutral-50; brand check at the end | `popover.tsx:15-30`, `select-item.tsx:16-128` |

## Menus, navigation and data

| Component | Geometry | Paint and states | Source |
|---|---|---|---|
| Dropdown menu | 248 wide; radius 8; 4px vertical padding; rows inset 6px, radius 6, padding 10/8, 36px inner, 38px pitch; 16px icons 8px before text | White, `shadow-lg`, black-10% ring. Rows 14/20 600 neutral-700; hover neutral-50. Shortcut is plain 12/18 500 neutral-500 text, not a keycap. Separator 1px neutral-200 with 4px margins, full bleed. No destructive variant | `components/base/dropdown/dropdown.tsx:85-190` |
| Nav rows | 36px (padding 8), radius 6, 38px pitch; 20px icons | Hover neutral-50; current neutral-50 too (neutral-100 on hover). Label 14/20 600; section headers 12px bold uppercase | `components/application/app-navigation/base-components/nav-item.tsx:11-119`, `nav-list.tsx:20-58` |
| Tabs | Underline tabs 32 (sm) / 36 (md); button tabs 36 / 44; radius 6; gap 12 between underline tabs | Rest neutral-500; selected brand-700 with a 2px square-ended brand-600 bar over a 1px neutral-200 baseline; hover uses the selected paint. Focus 2px inset | `components/application/tabs/tabs.tsx:21-208` |
| Table | Header 44 (md) / 36 (sm); body rows 72 / 56; cells 24px sides; card radius 12 with `shadow-xs` and a neutral-200 ring | Header neutral-50, 12/18 600 neutral-500. Body 14/20 neutral-600. Row hover and selection both neutral-50. Dividers 1px neutral-200 drawn with `::after` | `components/application/table/table.tsx:55-277` |
| Avatar | xs 24, sm 32, md 40, lg 48, xl 56, 2xl 64; initials 12 / 14 / 16 / 18 / 20 / 24 at 600 | neutral-100 fill, neutral-500 initials, 0.5px black-16% hairline | `components/base/avatar/avatar.tsx:72-153` |

## Surfaces

| Component | Geometry | Paint | Source |
|---|---|---|---|
| Modal | Radius 12 (16 from sm); width set by the consumer; close button 28 / 36 / 40 / 44 with radius 8 | White, `shadow-xl`; backdrop neutral-950 at 70% with a 6px blur. Close button hovers to neutral-50 **and** a darker icon | `components/application/modals/modal.tsx:15-38`, `close-button.tsx:7-41` |
| Tooltip | Radius 8, padding 12 × 8, max 320 | neutral-950, `shadow-lg`, 12/18 600 white | `components/base/tooltip/tooltip.tsx:71-91` |
| Kbd | Radius 4, padding 4 × 1, 12/18 500 body font | neutral-600 on white with a neutral-200 ring | `components/application/app-navigation/base-components/nav-account-card.tsx:149` |
| Divider | 1px neutral-200 | — | `section-divider.tsx:9` |
| Inline code | Radius 6, padding 2 × 6, 14/20 700 | neutral-50 with a neutral-200 ring | `styles/typography.css:235-243` |

Not present in Untitled UI: alert, toast, card, skeleton, code block, segmented control
(button tabs with a bordered track are the nearest), popover (only menus and select
popovers).

## Where Area follows it, and where it does not

Area adopts Untitled UI's structure where the target products do not disagree: 16 / 20px
choice boxes, one rail for Slider and Progress, a soft deep lift on floating surfaces
(`shadow-lg`/`xl`), 6px between a label, its field and its hint. Area deliberately differs
where its own rules or the products decide: neutral rather than brand selection (owner,
2026-09-26), a fixed foreground on hover (Untitled darkens labels and icons), a hover plate
that differs from selection (Untitled uses one neutral-50 for both), 500 rather than 600
weight, and field paint rather than 50% opacity for disabled text fields.
