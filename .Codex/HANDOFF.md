# Handoff — 2026-09-22

## Latest gallery refinement

Separator has four 1×1 examples: horizontal fullwidth/inset, vertical fullwidth in
a toolbar, and vertical inset matching text cap height. Skeleton has individual
text/circle/rectangle/rounded shapes, inherited font-height examples and a card
composition, all 1×1. Spinner title now uses system 500 weight; Radio legend uses 400.
CodeBlock adds a file header, working Copy and wrapped examples. Dialog has basic,
field and working native-modal examples; both families use uniform 2×2 tiles.
Refined families awaiting approval now show yellow In review, separate from completion.
Build/audit, typecheck, 3 primitive tests, 14 contract tests and 350 contrast assertions
passed. Browser checked divider geometry, Copy, modal centering, Escape and focus
restoration. Cross-browser and assistive technology checks remain unverified.

Progress now defaults neutral and its indeterminate segment moves at a smooth 1.8s rate;
each size has an individual gallery tile. Skeleton type/card compositions are 2×2; type
uses Display 56px, Title 24px, and Body 16px values, while the card uses actual Card slots.
Select option group headers reserve one normal row. Tooltip default is 12/16px without an
arrow and has a medium Kbd specimen. Radio's default control is 16px with 14/20px text.
Segmented gained controlled/uncontrolled selection and roving arrow/Home/End keyboard behavior;
its gallery now has default, icon, full-width and size specimens. Segmented remains in review.

Branch: main. GitHub origin is canonical.

## Saved work

Owner approved Card, Avatar, Alert and Chip on 2026-09-21. Registry, README and
component guide reflect ten approved families, including the previous six.

Card examples: vertical (the default), wide, immersive, small and carousel.
Standard examples are 300×300; wide/carousel 600×300; small 300×100.
These are preferred widths/minimum heights, not clipping constraints. Narrow containers
shrink cards and stack wide columns. Radius 24px, with inset media and content.
Titles use 16/24px type, copy uses 14/20px, and their gap is 4px. The vertical card has
one left-aligned action. Small has top-aligned text.
Carousel uses native focusable horizontal scrolling and snap points, without autoplay.

Also preserved: prior session color-proposal/token refinements, shared BadgeAnchor
geometry, Avatar active/tone/fallback examples, neutral-default Alerts, Chip refinements,
Slider range/vertical fixes, rounded Spinner caps, real demo hydration and local images.
Raw palette.json is unchanged. Color proposal moved from archive/docs to docs.

## Verification

Passed: package/docs build and audit, typecheck, 18,402 token tests, contrast report
(350 assertions across 66 themes), 14 contract tests, consumer checks, 41 focused
React tests for Alert/Avatar/Badge/Chip/Input-Field/Slider/Spinner and diff whitespace.
Browser: the five current Card examples were measured in the default gallery view;
24px shells, 16/24px titles, 14/20px copy, 4px content gaps, the vertical card's single
left-aligned action, 2×2 small tile and full-height wide media were confirmed. Code's
24px on-color container and table composition were also visually inspected. Kbd uses a
20px normal tier (10px line, 4px equal insets) and a 16px compact tier (10px line,
2px equal insets); on-color Button and on-emphasis Tooltip treatments were visually
checked. Tooltip now measures 28px high (14/20px type, 4px vertical and 8px horizontal
insets), with a 20px Kbd fitting its content box. Tooltip now exposes side, rounded-arrow
and rich interactive composition APIs; the arrow was browser-measured as centred on each
side. The rich image and action gallery examples use compact-popover dialog semantics.
Cross-engine and assistive-technology checks remain unverified; see DEVELOPMENT.md.

## Next

Code refinement has started with contextual inline sizing, table and on-color examples.
Kbd now has normal/compact size roles plus on-color and on-emphasis treatments; Tooltip's
gallery includes visible open-state trigger examples, side/arrow, image and action
compositions. Composed Kbds now use the 20px normal tier by default—including buttons,
menus and tables. The 16px tier remains only in explicit small-size comparison specimens.
New Tooltip and Menu work belongs in the component gallery; defer component-page
documentation until requested. Menu now has semantic `MenuLabel`, `MenuSeparator` and
`MenuSearch` helpers, plus 2×2 gallery specimens for grouped actions, selection, search,
nested submenu and disabled/destructive state. The persistent marker treatment moved from
Menu to Nav, where two grouped specimens each show three rows per section. Floating menus use 2px row gaps,
`shadow-2`, 8px separator breathing room, normal 20px shortcuts and an on-color red
shortcut plate on the destructive row. Browser inspection confirmed each tile is 2×2,
the gap is 2px, normal shortcut height is 20px, the separator remains 1px with 8px block
margins, and the destructive Kbd inherits the danger foreground. These remain unrefined
pending owner review. The search-menu input is soft with a search icon; the nested submenu's
surface aligns to the top of the final expandable row. Separator now exposes horizontal
full-width/default and 16px inset treatments plus full-height and icon-aligned inset vertical
treatments. Its gallery examples are left aligned, contextual and uniformly 1×1.
Skeleton has text, circle and rectangle/card gallery compositions, all in 1×1 tiles. Progress now has
4/6/8px sizes, accent/neutral tones, determinate/indeterminate states and a visible
label/value composition, also in uniform 1×1 tiles. Switch refinement now uses a 36×20px
neutral medium default, a same-height 44px long track with a 24×16px pill thumb, accent and
custom-color tones, and generic example copy. The borderless three-row list fills the tile
content width with 16px row gaps and a heading. Separator examples use 14px text, three-row
lists, default 32px icon buttons and header compositions; `spacing="normal"` reserves 8px
around the 1px rule. Skeleton shows only text/circle/media. Spinner sizes are 12/16/24px
(the previous icon tokens all resolved to 16px), rotation is 2s linear, and gallery contexts
include Button, Badge, Input and loading content. The final Menu example embeds functioning
Switch/Segmented/Checkbox controls in a grouped surface. Build/audit, typecheck and Switch
tests pass; browser measurements confirmed geometry and segmented selection. These families
remain unrefined pending owner approval.
Gallery preview runs on port 4321.
Latest refinement: Radio circles now measure 16/20/24px; medium labels remain 14/20px,
and cap-aligned labels no longer combine with a second control offset. Menu controls are
centered, use 48px rows, and share the heading's leading edge; painted controls are centered.
Select now styles the native customizable `::picker(select)` with Menu surface/row tokens;
unsupported browsers retain the native dropdown. Browser click selection was verified.
Separator header compositions were replaced by a simple vertical text example; toolbar
variants are separately named and the full-height line reaches both inner border edges.
Stop the watcher before package build/typecheck to avoid declaration rebuild races.
