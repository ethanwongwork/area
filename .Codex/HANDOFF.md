# Handoff — 2026-09-21

Branch: main. GitHub origin is canonical.

## Saved work

Owner approved Card, Avatar, Alert and Chip on 2026-09-21. Registry, README and
component guide reflect ten approved families, including the previous six.

Card examples: default, vertical, horizontal, immersive, small, list and carousel.
Standard examples are 300×300; horizontal/carousel 600×300; small 300×100.
These are preferred widths/minimum heights, not clipping constraints. Narrow containers
shrink cards and stack horizontal columns. Radius 32px, media inset 8px with 24px
nested corners, text/actions inset 16px. Titles 20px, copy 16px across densities.
Buttons use default md sizing and share full-width rows. Small has top-aligned text.
Carousel uses native focusable horizontal scrolling and snap points, without autoplay.

Also preserved: prior session color-proposal/token refinements, shared BadgeAnchor
geometry, Avatar active/tone/fallback examples, neutral-default Alerts, Chip refinements,
Slider range/vertical fixes, rounded Spinner caps, real demo hydration and local images.
Raw palette.json is unchanged. Color proposal moved from archive/docs to docs.

## Verification

Passed: package/docs build and audit, typecheck, 18,402 token tests, contrast report
(350 assertions across 66 themes), 14 contract tests, consumer checks, 41 focused
React tests for Alert/Avatar/Badge/Chip/Input-Field/Slider/Spinner and diff whitespace.
Browser: all seven Card examples measured at desktop in compact/light and default/dark;
20px titles/16px copy, full-height horizontal media, intended dimensions when space
permits, no card overflow at 390px, and carousel ArrowRight scrolling confirmed.
Cross-engine and assistive-technology checks remain unverified; see DEVELOPMENT.md.

## Next

No outstanding owner request. Continue with the next requested unrefined component.
Spinner has started but is not owner-approved. Gallery preview runs on port 4321.
Stop the watcher before package build/typecheck to avoid declaration rebuild races.
