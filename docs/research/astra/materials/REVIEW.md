# Materials series: Claude review

Reviewed 2026-10-11 by Claude (Opus 5.5) at research tip `992458c`, against Area `origin/main`
`9e613c1`. Covers tasks 01–18. Five reviewers checked the series in parallel against Area's source
and the cited external sources. Claude also opened the task 16 specimen in a browser.

The owner answered all 16 decisions on 2026-10-11 (each the recommended option). They are listed
under "Owner decisions" below and bind every later materials task.

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
| 16 specimen | Low as a decision tool | Presets indistinguishable; caption bug ("Gloss softness undefined"); (the review first flagged the example person; David Tee is correct per AGENTS.md since 2026-10-04) |
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
Glass container; 16 caption bug.

## Owner decisions (2026-10-11)

Binding for tasks 19 onward. Cite them as D1–D16.

- **D1 Expression ceiling:** Area's current calm look is the None material's default, not a
  limit. Hard limits always apply: contrast floors, visible focus, fixed hover ink, semantic
  meaning, forced-colors and reduced-transparency fallbacks. Within them, materials may add
  control shadows, label text effects and stronger container treatment.
- **D2 Architecture:** a new Material axis beside Surface. Recipe structure switches with 0/1
  gate tokens (as action/selection do), so nested scopes stay correct. Surface shadows split
  into adjustable parts, starting with a pixel-identical refactor; the literal Tooltip and
  Toolbar shadows move under Surface.
  *Note 2026-10-15:* `main` added an Elevation axis on 2026-10-14 that owns every shadow by
  role (control, resting, tooltip, float, modal), and Surface became the frame width only. The
  split asked for here is largely done; the Material axis sits beside Surface and Elevation.
- **D3 Adjustability:** presets first, then typed continuous controls on Theme. Bounds are
  calibrated to cover the reference board and contrast-tested at the extremes. Caps become
  numeric per-role strength multipliers.
- **D4 First presets:** None (identity, default), Glass, Tactile, Soft. Paper is rebuilt as a
  real opaque material later; Aero, Glow and Prism become finishes later.
- **D5 Decorative colour:** derived from accent, neutral and tones; no literal hexes.
- **D6 Rows:** a new row-plate role (Menu, Nav, Tree, Table, Select, Command palette, Calendar
  days).
- **D7 Glass safety:**
  - Floating shells assume any backdrop.
  - Failing edges use the opaque fallback.
  - An app-level transparency setting sits beside `prefers-reduced-transparency`.
  - Explicit forced-colors rules: opaque Canvas and `backdrop-filter: none`.
- **D8 Refraction:** frosted blur plus rim now; SVG refraction later as a Chromium-only
  enhancement.
- **D9 Glass controls:** Figma's Glass parameter names; light angle 0 = top, clockwise.
- **D10 Dark page:** tint or texture only within a fixed distance of #020202 (neutral 975).
- **D11 Inner rims:** the radius floor applies at every setting except Sharp.
- **D12 Cutouts and fades:** real transparent gaps with masks.
- **D13 Glyphs and text:** no automatic effects on glyphs or small text; opt-in for display text
  and button labels. Duotone: a small pilot later.
- **D14 Performance:** rules rewritten to match the data; a 60Hz minimum device named by the
  owner; re-measure including Firefox.
- **D15 Positioning:** internally "the broadest multi-material layer with separable controls";
  no public claim until it ships.
- **D16 Separation:** a material never changes geometry, type or ink. A preset that sets several
  axes is a bundle.

## Reports 19–21: Claude review (2026-10-17)

Reviewed against `main` at `530ef22` plus this session's uncommitted Layers split, by three reviewers in parallel. No
report was edited; this section is the reading guide.

| Report | Trust | Main issue |
| --- | --- | --- |
| 19 corrections | Medium: high as a fix ledger at `9036ed9`, low as a picture of today | Every correction in "Corrections for Astra" is fixed in the data. The 13-presets README Answer and 10-states README:32 still carry superseded policy without a callout. It changed the 16 specimen's example person away from David Tee, which AGENTS.md requires (still to fix). All Area pins predate Elevation, Surface-as-frame and Layers; 12 newer manifest exports are missing from the inventory |
| 20 limits and None | Medium-high on principles, low on currency | The hard limits are real and correctly cited (4.5:1 text, dark APCA floors, required edges, focus, semantic state, disabled vs read-only, reduced motion). Nine of its "hard limits" are owner decisions (D5, D8, D10–D13, D16, architecture, process), which D1 keeps adjustable. D7's safety paths (backdrop-filter fallbacks, `prefers-reduced-transparency`, an app transparency setting, forced-colours Canvas) don't exist yet. The None baseline (`d455567`) is stale |
| 21 axis design | Medium | Material namespaces and one-hot gates are sound and pass today's registry check. The Surface split (a third of the report) is obsolete: Elevation owns every shadow, and the proposed Surface gives 12 registry conflicts. Its outer-shadow controls duplicate Elevation. Area's overlays use the native top layer, not portals, so the portal bridge is only for consumers. No answer to translucent fills over the Layers ink solve |

**Findings that change the plan:**
- **A material adds no outer lift to cards, menus or dialogs.** Elevation owns those shadows. The one outer cast a material keeps is the contact shadow under raised controls, which Elevation leaves flat by design (DESIGN_SYSTEM's shadowless in-flow controls). Board items 5 and 6 print exactly such a shadow.
- **Decorative strokes are lobes in the shadow list**, beside Surface's `shadow-edge`. They never change `border-width`, the frame or required edges.
- **The None proof must be re-pinned** to today's axes, covering Elevation 0–8, Surface 0/1 and the Layers extremes. `layers.test.ts` "the defaults are Area as it was" is the model.
- **D10 needs restating under Layers**: the dark page is now a setting (0 to 24), so "within a fixed distance of #020202" should read "of the chosen dark ground".
- **H05 has a known exception**: Nav and Board row actions change ink on hover (`nav.css:300-302`, `board.css:219-221`), tested in cohesion but recorded in no rule doc.
- **Open for the owner:** engraved glyphs (board items 1 and 9) need a ruling beyond D13, which covers only display text and button labels.

## Layers × Material (2026-10-17)

Layers (2026-10-16) now computes the page, card, sidebar and control-fill tones, their edges and the inks, solved
for contrast against those tones. A material must fit beside it.

**Recommendation, used by tasks 22 and 23:** the material paints over Layers and never replaces a Layers tone.
- **Glass** takes the surface's own Layers tone and lowers its alpha (`color-mix(in srgb, var(--area-bg-surface) a, transparent)` at the receiver), over a backdrop blur.
- **Tactile and Soft** light and shade the Layers tone with lobes and a sheen image.
- The material's colours derive from accent, neutral and tones (D5), never from literal greys.
- **A bundle may set Layers.** Soft needs a same-tone gray ground to model relief, so Soft sets light ground 95, dark ground 24 and contrast 0 (D16: a preset that sets several axes is a bundle).

**Glass and the ink solve.** Inks are solved for opaque grounds. Over the worst backdrop (black or white), body text
keeps 4.5:1 only if the glass is at least 56% opaque in light and 62% in dark. Muted text needs 90% and 73%, and
placeholder in a field 93% and 75% (computed from the Layers tokens at the defaults; `22-calibration`). Three ways to
hold contrast, for the owner:
1. **A floor (recommended for now):** opacity never drops below the floor for the text it carries. Body text gives a
   usable glass; muted text makes light glass nearly opaque. The specimen shows both floors.
2. **Glass inks:** muted text darkens (light) or lightens (dark) on glass, as Layers already does per ground. This
   gives a 56% floor everywhere but changes ink, which D16 forbids for a material; it would belong to Layers.
3. **A bounded backdrop:** where the app owns what is behind (its own page or wallpaper), the floor is computed for
   that backdrop's lightness range instead of black and white. D7 says floating shells assume any backdrop, so this
   would apply to in-flow glass only.
