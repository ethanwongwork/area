# Materials series: Claude review

Reviewed 2026-10-11 by Claude (Opus 5.5) at research tip `992458c`, against Area `origin/main`
`9e613c1`. Covers tasks 01–18. Five reviewers checked the series in parallel against Area's source
and the cited external sources. Claude also opened the task 16 specimen in a browser.

The owner's answers to the decisions below are recorded on the decisions page; Claude copies
them here once they are given.

## Verdict

The research is careful and mostly correct. It covers what each style is made of, prior art, CSS
support, role mapping, accessibility maths and export formats, and the reviewers found no invented
facts. Every headline number in 18 and 11 reproduced. 18 of 20 sampled external claims were
confirmed, the other 2 could not be checked, and all 12 checked browser-support claims are current.

The series does have one systemic problem. It treated Area's current restraint as a ceiling for
every material:

- in-flow controls have no shadow;
- UI labels take no effects;
- containers take at most a trace of a material.

It then stacked provisional budgets on top. As a result:

- The specimen (16) renders Paper, Glass and Tactile almost identically in light and dark. With
  every slider at its maximum, Tactile shows only a faint rim.
- The slider ranges (relief at most 4px, glow softness at most 8px) cannot reach the reference
  board. Items 3, 5, 6 and 16 (shadowed and debossed buttons, the jelly button) are ruled out by
  policy.
- The None/Trace/Quiet/Full caps are labels with no numbers, so there is nothing to adjust.

The owner's brief asks for the opposite: whole visual styles, with every value adjustable. The
fix is to separate **hard limits** (contrast floors, focus visibility, fixed hover ink, semantic
meaning, forced-colors and reduced-transparency fallbacks) from **defaults** (Area's current
calm look). Hard limits always apply. Defaults belong to the None material and can be overridden
by others.

## Trust by report

| Report | Trust | Main issue |
| --- | --- | --- |
| 01 taxonomy | Medium-high | Acrylic "exclusion blend" contradicts the WinUI source pinned in 06 (it uses a luminosity blend, then tint) |
| 02 prior art | Medium | Verdict right; misses Figma's native Glass effect, Open Props shadow/noise tokens, AuraGlass and the liquid-glass libraries; doesn't weigh how small and new OpenGlass is (single author, created 2026-07) |
| 03 CSS cookbook | High | SVG refraction in backdrop-filter works in Chromium (not "unverified"); Safari and Firefox don't support it |
| 04 role map | Medium-high | Stale: 23 newer contracts are missing; Table rows and Menu/Nav rows given different roles for the same plate; Kbd and Card depth notes wrong |
| 05 absorption | Medium | Caps are labels without numbers; missing guards (below); forbids board items 3, 5 and 6 |
| 06 references | Medium-high | Values exact; CodePen entries can't be re-checked |
| 07 controls | Medium | Selector-switched recipes break nested scopes; Option A is a Surface migration, not a small extension |
| 08 accessibility | Medium-high | Misses that forced colors keeps background alpha and backdrop-filter, so glass stays translucent |
| 09 dark/density | High (facts) | Radius matrix mostly filler; rims skip the radius floor, against "only Sharp is square" |
| 10 states | Medium | Misses that list focus is the row plate itself; disabled opacity not named |
| 11 performance | Medium | Data sound; "no blur on rows" and "static parameters" not supported by it (measured cliffs: 64 blurred panes, animated stacks of 5+ shadows, animated live grain in Safari) |
| 12 glyphs/text | High | Duotone part names collide with knocked-out parts in filled icons |
| 13 presets | Low-medium | About 2.5 of 10 sampled seeds trace to sources; Paper fades existing borders to 14%; no None identity; Prism colours invented and ignore accent; Glass container breaks the container cap |
| 14 tooling | High (facts) | DTCG 2025.10 and Figma API claims confirmed |
| 15 consistency | Medium-high | Accurate, but every winner defers to 11's unmeasured caps; missed the 13 errors above |
| 16 specimen | Low as a decision tool | Presets indistinguishable; caption bug ("Gloss softness undefined"); example person not Irene Yamaguchi |
| 17 OpenGlass | High | All three headline defects reproduce in source |
| 18 contrast harness | High (maths) | Passes for opaque presets add nothing about material paint; the exterior 1:1 result holds by construction |

## Decisions for the owner

Ordered by how much later work depends on them. Recommendations are Claude's.

1. **Expression ceiling.** Recommended: Area's current restraint is the None material's default,
   not a limit. Materials may add control shadows, label text effects and stronger container
   treatment, within the hard limits.
2. **Architecture.** Recommended: a Material axis beside Surface. Recipe structure is expressed
   as 0/1 gate tokens (as action/selection do), so nested scopes stay correct. Surface shadows
   are split into adjustable parts, starting with a pixel-identical refactor. The literal Tooltip
   and Toolbar shadows move under Surface.
3. **How adjustable.** Recommended: presets first, then typed continuous controls on Theme, with
   bounds calibrated to cover the reference board and contrast-tested at the extremes. Caps
   become numeric per-role strength multipliers.
4. **First presets.** Recommended: None (identity, default) plus Glass, Tactile and Soft. Paper is
   rebuilt as a real opaque material. Aero, Glow and Prism become finishes later.
5. **Decorative colour.** Recommended: derived from accent, neutral and tones, never literal hexes.
6. **List rows.** Recommended: a new row-plate role (Menu, Nav, Tree, Table, Select, Command
   palette, Calendar days), since the plate carries hover and keyboard focus.
7. **Glass safety.** Recommended:
   - Floating shells assume any backdrop.
   - The three light-mode edge failures use the opaque fallback for now.
   - An app-level transparency setting beside the OS query (Safari and Firefox don't ship
     `prefers-reduced-transparency`).
   - Explicit forced-colors rules: opaque Canvas and `backdrop-filter: none`.
8. **Refraction.** Recommended: frosted blur plus rim as the baseline; SVG refraction later as a
   Chromium-only enhancement.
9. **Glass controls and light angle.** Recommended: Figma's Glass parameter names; angle 0 = top,
   clockwise (Figma, OpenGlass, CSS).
10. **Dark page.** Recommended: tint or texture only within a fixed distance of the near-black page
    (975, #020202).
11. **Inner rims.** Recommended: the radius floor applies at every setting except Sharp.
12. **Cutout rings and fixed-colour fades** (Avatar, Indicator, Presence, Card immersive and Code
    block fades). Recommended: real transparent gaps via mask.
13. **Glyphs and small text.** Recommended: no automatic decoration on glyphs or small text;
    opt-in for display and button labels. Duotone: a small pilot later.
14. **Performance rules.** Recommended: rewrite them to match the data. Then name a 60Hz minimum
    device and re-measure on it, including Firefox.
15. **Positioning.** Recommended: internally, "the broadest multi-material layer with separable
    controls"; no public claim until it ships.
16. **Material and other axes.** Recommended: a material never changes geometry, type or ink.
    Bundles that set several axes are presets.

## Corrections for Astra

Errors to fix before further work builds on them: 01 Acrylic blend; 02 missing prior art and
OpenGlass scale; 03 refraction support; 04 the 23 missing contracts, row and hover-plate roles,
Kbd note, Card depth and nonpaint count; 05 Drawer is modal by default, Surface does not own
every shadow, and the missing guards (cutout rings, fixed-colour fades, translucent washes, list
focus via plate, solid emphasis fills, disabled group opacity); 08 forced-colors alpha and
backdrop-filter, and sRGB gradient interpolation must be stated; 09 re-emission cite; 11 claims
restated to match the data; 12 duotone vs knockouts; 13 Paper stroke, no None, Prism colours,
Glass container; 16 caption bug and example person.
