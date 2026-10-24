---
name: area-ui-review
description: Reviews a composed Area screen or layout (the desktop app's regions, an example scene, a template, a page built with Area) for spacing, alignment, region structure and copy, by measuring it with a layout audit script and comparing it with the measured product references. Use after composing or changing a screen with area-ui-compose, when asked whether a layout, page or screen looks right, or when the owner says spacing, gaps, margins, panels, headers or a feed feel off.
---

# Review a composed screen

`area-visual-language` judges one component. This skill judges how components are put together: regions, spacing,
alignment, titles and copy. The rules are `area-ui-compose`'s; this is how to check them with measurements, not
impressions.

## 1. Look at it at true scale

- Open the screen in the app (or its preview), at 100%, with any preview's CSS `zoom` set to 1. Previews that are
  scaled to fit measure scaled.
- The built-in browser pane stops painting while hidden, but layout still measures. If screenshots time out, measure
  anyway, or use headless Edge over CDP (memory: headless gallery capture).
- Light and dark. Then the extremes the layout depends on: type 12 and 16, density Compact and Comfortable, a narrow
  window (`resize_window` to 1024 and 768) and a wide one.

## 2. Measure

Load `scripts/layout-audit.js` in the page and audit the region:

```js
const r = areaLayout.audit(document.querySelector('<region selector>'), { depth: 8 });
areaLayout.markdown(r);   // insets and gaps per container, then the issues
```

Loading it: the browser JavaScript tool can run its full text where the page allows `eval`. The app's CSP
(`script-src 'self'`) does not, so serve it from the page's own origin: copy it into the served folder (for the static
build, `apps/desktop/dist/`, which is git-ignored) and add a `<script src="/layout-audit.js">` from the tool.

It reads what is drawn: text from its first cap to its last baseline, painted things (a fill, an edge, a shadow, an
image, an icon's square box) by their edge, unpainted wrappers by what they hold. It reports:

| Check | Rule (area-ui-compose › spacing.md) |
|---|---|
| inset ≥ gap | a painted container holds its content at least as far from its edge as its children are apart; media and nested surfaces (painted children) are left out, as they sit at the smaller media inset by design |
| cap inset = side inset | text in a surface starts as far from the side as its cap sits from the top |
| grows outward | two unframed neighbouring groups sit further apart than either group's own items |
| on the ramp | box-to-box gaps land on the spacing ramp (text gaps land off it by design) |

Spread space (space-between, auto margins, a growing child) is marked ˢ and not checked. Every issue is a lead, not a
verdict: confirm it in the spec or the owner's decisions before changing anything. Values are CSS px at the page's
zoom; record the viewport and device pixel ratio the result prints.

## 3. Check the structure

| Area | Check |
|---|---|
| Regions | Each region has one job; nothing duplicates the nav's title over the content; each panel's toggle is on its side |
| Boundaries | One model per window (ruled, toned, layered, panels, floating; `area-ui-compose` › treatments.md); one edge per boundary: a rule or a ground step or a layer's edge, never two; bars in the content carry no resting rule |
| Nav | It sits where its model puts it; its plates are the ones for the ground under it (hover it and measure the plate against that ground); the current mark follows the row's shape |
| Bars | Every bar in the window has the same height; controls sit as far from the side as from the top |
| Panels | Default, floor and ceiling set; the content keeps its minimum beside them; the side panel collapses first |
| Scrolling | One scroller per region; bars, docks and panel headers stay outside it; nothing scrolls the window |
| Content | The measure holds on a wide window; grids keep their minimum card width; shelves peek |
| Media | One ratio per set; images cover their frame; the frame, not the image, carries the corner |
| Copy | Tiers from size and ink; sentence case; counts only on collections; one-sentence subtitles; placeholder vocabulary in demos |
| Settings | Nothing breaks at type 12 / 16, Compact / Comfortable, Radius 0 / pill, Elevation 0, light / dark |

## 4. Compare with the reference

Put the screen beside the product that owns its context (`area-ui-compose` › When the references disagree) at the same
true scale, and compare region sizes, ring spacings and title tiers against the values in
`docs/research/ui-patterns-2026-10-22/`. A difference needs a reason: Area's density, a setting, or an owner decision.

## 5. Route each fix

- **The component is wrong** (its inset, its gap, a part it lacks) → fix the component through its spec
  (`area-component-build`, `area-visual-language`). Never patch it from app CSS (PRODUCT_UI.md rule 13).
- **The composition is wrong** (a gap role, a region size, a missing container) → fix the screen's layout code, using
  the role from `spacing.md`.
- **A rule is missing or wrong** → propose it to the owner, then write it into `area-ui-compose` and, for the app,
  `docs/PRODUCT_UI.md`. A defect in one screen means auditing the others for the same thing (fix the rule, not the
  instance).

Report what was measured (selector, viewport, settings), what each issue was, and what changed, plainly. Unmeasured
states and settings are named as unverified.
