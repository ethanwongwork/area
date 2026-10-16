# Materials: brief

Shared brief for the materials research series. Each task in the series writes its own
subfolder here (`materials/<nn>-<slug>/README.md`) and adds its line to `../INDEX.md`; this
file stays the brief. Read it in full before any materials task.

## Goal (owner, 2026-10-07)

Area should support whole visual styles (materiality, transparency, acrylic, neumorphism,
liquid glass, skeuomorphism, glow, gradient fills and strokes, inner and drop shadows, and
combinations of them) as a **material layer**. Every component takes on the same material in
a way that fits that component. A gradient that suits a solid Button is not pasted onto a
Table row. Each material is a package of decisions per role, and every value in it stays
adjustable afterwards: shadow lightness and spread, glow strength, gradient colours and
stops, stroke on or off, stroke and fill transparency, blur.

The research questions:

1. What is each style made of, layer by layer?
2. How should each component absorb it, so that a cohesive theme reads as one material across
   all families?
3. Which controls should be exposed, and how do they map onto Area's tokens and axes?
4. Where does it break: contrast, dark mode, density, performance, browser support?

The owner believes no open-source, customizable design system offers this layer today. That
claim is a hypothesis to test (task 02), not a premise.

## Owner decisions

Tasks 01–18 are reviewed in [REVIEW.md](REVIEW.md). The owner's decisions D1–D16 at its end are
binding from task 19 on. Where an earlier report disagrees with a decision, the decision wins. In
particular, D1 replaces every earlier rule that treated Area's current restraint (no control
shadows, no label effects, Trace-only containers) as a ceiling for all materials.

## Constraints

- Research only. No component, token or axis changes; proposals go in the reports.
- Fit the existing architecture or say exactly where it would have to change:
  - Axes in `packages/tokens/src/axes/` (theme, neutral, accent, action, selection, ui,
    radius, surface, motion, plus the pills set), documented in `docs/THEMING.md`.
  - The **Surface axis** (`surface.ts`) already owns `border-width`, `shadow-1`…`4`,
    `shadow-card` and `shadow-float` with Flat / Outlined / Raised / Elevated. Any materials
    proposal must say whether it extends, replaces or sits beside this axis.
  - Axes own disjoint token namespaces. Cross-axis values are derived in
    `packages/tokens/src/emit/base.ts` and re-emitted at scope boundaries. Derived or
    paired colours are never registered with `@property`.
  - Emphasis roles (`action`, `selection`) decide neutral versus accent. Semantic tones
    (info, success, warning, caution, danger, discovery) keep their meaning.
  - Contrast rules in `docs/CONTRAST.md` and the contrast tests must not be weakened.
  - Foreground stays fixed on hover. Light/dark and density are system settings, not
    material choices.
  - The owner wants dark mode as close to #000 as possible (the dark page is neutral 975).
- Component inventory: `packages/styles/src/manifest.ts`; evidence and decisions:
  `docs/specs/<slug>.md`; elevation and edges: `docs/DESIGN_SYSTEM.md` ("Elevation",
  "Shared state paint").

## Vocabulary (seed; task 01 refines it)

- **Material:** what a surface is made of (paper, plastic, glass, acrylic, metal, rubber,
  jelly). It sets fill, translucency, blur, grain and how it takes light.
- **Finish:** matte, satin, gloss. It sets highlight sharpness and specular strength.
- **Lighting:** one light source per theme (angle, height). Drop shadow, inner shadow,
  highlight, rim light and glow all follow from it.
- **Depth:** recessed, flush, raised or floating. A part's position relative to its parent.
- **Edge:** the stroke model: none, solid, gradient (lit edge), top-only highlight, double
  rim, bevel.
- **Role:** a kind of part that a material paints (page, container, floating surface,
  raised control, recessed field or track, thumb or knob, indicator, divider, glyph, text).
  Materials paint roles, not components.

## Reference board (owner-supplied, 2026-10-07)

The images are not in the repository. These are descriptions only. Values are given only
where the image itself prints them.

1. **Window controls (light).** A pill tray with a vertical metallic gradient (light, a darker
   middle band, light) and a light rim. Saturated red, yellow and green circles, each with a
   lighter rim and an engraved darker glyph (×, −, diagonal arrows). A soft glow in each
   button's colour bleeds onto the white window below.
2. **Glass app window over a sky.** A frosted translucent window with text tabs. Flow-diagram
   nodes are near-opaque white cards with thin strokes. A tinted "Global" header tab sits
   behind one card.
3. **"Add to My Calendar" pill (light).** An off-white pill with a double rim (outer light
   edge, inner shadowed edge) and debossed (letterpress) grey text. A frosted glass calendar
   icon has a yellow-to-blue gradient header.
4. **Split button on a dark page.** A saturated blue pill with a lighter top edge, a vertical
   divider, a large blue outer glow and a translucent white disc behind the + glyph. Beside
   it are dark pills with a faint stroke.
5. **Annotated light button ("Reject"), values printed:**
   - Fill: #E3E3E3 at 80%.
   - Stroke: linear gradient, #FDFDFD at 100% (0%) to #F1F1F1 at 0% (100%).
   - Drop shadows: #000 10% (x 0, y 2, blur 4, spread 0) and #000 16% (x 0, y 0, blur 0,
     spread 1). The second is a 1px hairline ring.
6. **Annotated dark button ("Button Label"), values printed:**
   - Text: #FFF 100%, with a text shadow of #000 40% (x 0, y 4, blur 4, spread 0).
   - Fill: linear gradient #FFF 0% to #FFF 15%, over #1D1F23 100%.
   - Stroke: #FFF 15%, 1.5px, top only.
   - Drop shadows: #000 20% (x 0, y 4, blur 7, spread 0) and #000 100% (x 0, y 0, blur 0,
     spread 1.5).
7. **Dial on black.** A continuous-curvature (squircle) panel corner. A glossy dark sphere knob
   with a radial highlight and a thin rim, inside a circular progress ring with a round cap.
8. **Car console cluster.** A matte textured black housing. Raised rounded keys with a soft
   top highlight, a green LED pill (glowing indicator), a curved rocker switch, light grey
   line icons.
9. **Terminal app icon.** A dark squircle with a subtle gradient and rim highlight, and a
   recessed inner well holding an engraved prompt glyph.
10. **Dark segmented control.** A recessed track (inner shadow) and a raised glossy thumb with
    a highlight gradient. The active icon is bright; the inactive icon is a dim outline.
11. **Dark settings toggles.** Recessed tracks with inner shadows and raised thumbs. On: orange
    thumb, brown-tinted track, and the label turns orange. Dividers are engraved (a dark line
    with a light line under it). The surface has fine noise grain.
12. **Glass toolbar and menu (visionOS / iOS 26 style).** Circular glass buttons, the active one
    solid white. A frosted menu over a photo, tinted by the content beneath, with a rim
    highlight, separators and trailing icons.
13. **Frosted cards over a blurred photo.** Heavy blur, low-opacity white fill, no stroke, large
    radius, thin white line charts.
14. **Dark phone sheet with a purple glow.** A radial gradient fill (deep navy centre, purple
    edge glow), glass pill buttons and one solid light circular button.
15. **"Aa" toggle on blue.** A liquid-glass thumb that refracts the background, an iridescent
    yellow-to-blue gradient on the track, rim highlights and a grainy background.
16. **Green jelly button in a light tray.** A glossy light-green vertical gradient fill, a
    lighter inner rim at the bottom, a darker green stroke. The outer tray has a double rim
    (bevel) and a drop shadow; the icon is darker green.
17. **Home-screen widgets.** A Y2K / Frutiger Aero glossy blue tile with a specular gloss band
    at the top, and a glass disc icon, beside flat light grey tiles.

## Series

| # | Folder | Question |
| --- | --- | --- |
| 01 | `01-taxonomy` | What is each style made of? A shared layer model and vocabulary |
| 02 | `02-prior-art` | Who already offers materials or styles, and with which controls? |
| 03 | `03-css-cookbook` | How is each layer built in CSS, and where does support run out? |
| 04 | `04-role-map` | Which material role does each part of every Area family play? |
| 05 | `05-absorption` | How does each style paint each role? |
| 06 | `06-references` | References that publish their exact values |
| 07 | `07-controls` | Which controls are exposed, and how do they map to tokens and axes? |
| 08 | `08-accessibility` | Contrast, transparency, forced colours and motion under materials |
| 09 | `09-dark-density` | Dark (near-black), compact density, sizes and radius |
| 10 | `10-states` | How hover, press, focus, selected and disabled read under each material |
| 11 | `11-performance` | Measured cost of blur, layered shadows, filters and grain |
| 12 | `12-glyphs-text` | Engraved, embossed and glowing icons and type |
| 13 | `13-presets` | Named presets and which styles combine |
| 14 | `14-tooling` | Builder, export formats and Figma |

Run 01–04 first; 05 onwards build on them.

Second round, after the review (follow D1–D16):

| # | Folder | Question |
| --- | --- | --- |
| 19 | `19-corrections` | Fix the review's errors and refresh 04/05 against current main |
| 20 | `20-limits-and-none` | Which rules are hard limits, and what exactly is the None material? |
| 21 | `21-axis-design` | The Material axis in tokens: namespaces, gates, Surface split, Theme controls |
| 22 | `22-calibration` | Numeric None/Glass/Tactile/Soft values and control ranges that reach the board |
| 23 | `23-specimen-v2` | A specimen where the four presets are clearly different and the board is reproduced |
| 24 | `24-glass-safety` | Fallbacks, transparency setting, forced colors and the contrast gate for real presets |
| 25 | `25-masks` | Masked gaps for cutout rings and fades, identical on plain grounds |
| 26 | `26-performance-v2` | Rules restated from the data and a re-measure plan on a 60Hz minimum device |

Run 19 first, then 20 and 21, then 22 and 23. Tasks 24–26 can run once 21 is in.

### Status (2026-10-15)

- Astra finished 19, 20 and 21 (unreviewed). Tasks 22–26 were not started; Astra is no longer
  available, so they pass to Claude sessions with the same questions.
- `main` changed under the series on 2026-10-14:
  - Shadows now belong to a separate **Elevation** axis: one number, 0–8, with roles control,
    resting, tooltip, float and modal (`packages/tokens/src/axes/elevation.ts`). Tooltip is a
    role there.
  - **Surface** is only the frame width (`1` or `0`, Borderless with a soft edge).
  - Density and type are numbers too.
- So D2's "Surface shadows split into adjustable parts" is largely done another way. The
  Material axis now sits beside Surface *and* Elevation. Report 21's Surface-split section, and
  any report that says Surface owns shadows, should be read against `elevation.ts`.
- The app moved: new UI work happens in `apps/desktop` (Titlebar, Sidebar, Canvas, Inspector);
  `apps/docs` is archived. A Material setting would appear in the Inspector beside the other
  axes.
