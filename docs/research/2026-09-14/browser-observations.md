# Browser observations — 2026-09-14

In-app Chromium, local built Area CSS; targeted inspection, not a full accessibility audit.

## Shared stroke trial

Default light root resolves decorative/faint/subtle to `#f3f3f3`, `#eeeeee`, `#e2e2e2`.
Select computed border is `rgb(226, 226, 226)`; segmented track uses an inset 1px ring at `rgb(238, 238, 238)`.
Dark root resolves these slots to `#282828`, `#333333`, `#333333`.
Dark switch worked and was restored to light. Screenshot inspected for the light introduction and inspector.

## Scope reproduction

After `npm run build:docs`, copy `docs/research/2026-09-14/scope.html` to
`apps/docs/dist/audit-scope.html`, run the docs server, and inspect that route.
The fixture is static CSS probe markup, separate from the component documentation/demo registry.
Rebuilding docs removes the temporary route.

Computed observations:

- `#nested-neutral`: page `#ffffff`, foreground `#2b2722`, native color scheme `dark`.
- `#explicit-neutral`: page `#16120d`, foreground `#f1eeeb`, native color scheme `dark`.
- `#nested-brand`: brand surface `#f1fbf5`, foreground `#007249`, hover `#007249`.
- `#explicit-brand`: brand surface `#003d24`, foreground `#82f7c4`, hover `#009764`.
- Both green solid tokens happened to be `#008356`; testing only solid would miss the scope error.
- `#light-reset`: page `#121212`, foreground `#eeeeee`, native color scheme `dark`.
- `#motion-none .area-spinner`: animation name `area-spin`, duration `0.7s`.
- Elevated outline button: border width `0px`, white background, shadow `rgba(0,0,0,0.1) 0px 1px 3px 0px`. It has elevation, so it does not simply disappear; the axis wording needs a component-specific contract.

## Tabs

On `/tabs.html`, press ArrowRight while Account has focus. Focus stays on `tab-account`;
Account remains selected and Password remains unselected. Source contains no arrow handler.
The page's best-practice text nevertheless claims arrow navigation.

## Focus diagnostic

The default light `border-focus` is `#3c2ebe`. The ring recipe uses 45% of that color plus transparent.
Compositing over white yields approximately `2.37598:1`; this is a token/composite calculation,
not a screenshot-pixel measurement. The existing assertion tests the opaque token.
Input also changes its border on focus; Button and Segmented use the shadow with `outline:none`.

## Not verified

Screen readers, Windows forced colors, every browser engine, mobile/touch behavior, complete
hover/focus/selected matrix, 400% zoom, text-spacing overrides and all 50,688 axis combinations.
These remain explicit roadmap acceptance checks.
