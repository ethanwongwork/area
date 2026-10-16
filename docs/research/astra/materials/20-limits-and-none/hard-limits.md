# Hard limits and enforcement

These are the complete material-facing invariants extracted from the brief, CONTRAST, current implementation/tests and binding D1–D16. They do not claim an exhaustive accessibility certification of Area. “Today” means the pinned source, not a fresh full test run. Each record distinguishes a real check from a rule awaiting a material-specific test.

## H01 — Normal text contrast, including its real ground

Labels, placeholders, code and normal text retain at least 4.5:1 on composed paint in every applicable state. Hover is not a large-text exemption. Keep existing assertion-specific thresholds and no rounding allowance.

**Enforcement today:** Token gate measures declared opaque pairs across shipped theme/neutral/accent combinations; it explicitly rejects alpha tokens. Syntax and solid-hover pairings are enumerated.

**Missing test / limit of enforcement:** Production material compositor gate: alpha + every gradient interior + allowed scene colors/spatial positions, nested paint and actual text pixels/grounds. Token-only success cannot certify glass.

**Evidence:** [docs/CONTRAST.md:7–17](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L7-L17); [packages/tokens/src/contrast/assertions.ts:69–79](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/assertions.ts#L69-L79); [packages/tokens/src/contrast/assertions.ts:102–127](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/assertions.ts#L102-L127); [packages/tokens/src/contrast/contrast.test.ts:21–63](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/contrast.test.ts#L21-L63).

## H02 — Retain supplementary dark APCA floors

Preserve the existing per-pair dark APCA floor in addition to WCAG: body-copy pairs use Lc 75 and content/placeholder/syntax pairs Lc 60 where those constants are assigned. APCA is supplementary Area policy, not WCAG certification.

**Enforcement today:** Dark-only APCA assertions are executed for each declared token pair; constants and assignments are explicit.

**Missing test / limit of enforcement:** Apply those same pair-specific floors to resolved material grounds. Do not claim every glyph or line needs the text APCA floor.

**Evidence:** [docs/CONTRAST.md:9–11](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L9-L11); [packages/tokens/src/contrast/contrast.test.ts:66–89](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/contrast.test.ts#L66-L89); [packages/tokens/src/color/contrast.ts:68–94](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/color/contrast.ts#L68-L94); [packages/tokens/src/contrast/assertions.ts:74–78](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/assertions.ts#L74-L78).

## H03 — Required edges remain independent of decorative strokes

Required control/state boundaries must remain discernible; strong/increased-contrast endpoints retain 3:1. Turning off a material rim or Surface border must not remove required stroke-width paint. Decorative 1.1/1.2/1.3 design floors are not substitutes.

**Enforcement today:** Token strong-state assertions and compiled-CSS cohesion checks protect roles and required-line ownership. Standard soft presentation has acknowledged shortfalls: this is not evidence that every current boundary passes 3:1.

**Missing test / limit of enforcement:** Rendered required-edge checks against both adjacent grounds for each material/state; D7 failing glass edges must use opaque fallback. Do not waive existing soft failures or call identity conformance.

**Evidence:** [docs/CONTRAST.md:13–32](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L13-L32); [packages/tokens/src/contrast/assertions.ts:152–176](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/assertions.ts#L152-L176); [packages/tokens/src/contrast/assertions.ts:206–228](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/assertions.ts#L206-L228); [packages/react/tests/cohesion.test.mjs:101–132](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/cohesion.test.mjs#L101-L132); [docs/research/astra/materials/REVIEW.md:136–140](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L136-L140).

## H04 — Focus survives decoration and simultaneous states

Keep a visible keyboard focus replacement, independent of cast depth; preserve field edge/halo policy, invalid context and selection simultaneously. Test the painted opaque edge, not the source color of a translucent halo. List focus can be a row plate, with forced-colors ring fallback.

**Enforcement today:** Focus token pair assertions exist; CSS restores Menu focus in forced colors. Cohesion checks the normal row highlight plate, not its rendered contrast.

**Missing test / limit of enforcement:** Real keyboard traversal with focused+selected, focused+invalid, clipping, top-layer and glass/glow backgrounds; pixel/contrast tests for the actual outline and both sides. Static CSS assertions do not prove visibility.

**Evidence:** [docs/CONTRAST.md:48–57](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L48-L57); [packages/tokens/src/contrast/assertions.ts:170–176](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/assertions.ts#L170-L176); [packages/styles/src/forced-colors.css:10–14](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/styles/src/forced-colors.css#L10-L14); [packages/react/tests/cohesion.test.mjs:25–44](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/cohesion.test.mjs#L25-L44).

## H05 — Foreground stays fixed on hover

Material hover may alter backing, highlight, edge or depth, but must not change foreground ink or fade the content as a workaround. A genuinely revealed control is distinct from dimming an existing label.

**Enforcement today:** The compiled-CSS lexical check rejects hover/highlight color/opacity changes except documented inheritance/system-color/reveal cases.

**Missing test / limit of enforcement:** Computed color, fill, stroke, opacity and ancestor filter checks through actual hover, including aliases and Material gate selectors. A lexical color check does not catch parent filters or variable rewrites.

**Evidence:** [docs/CONTRAST.md:39–42](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L39-L42); [packages/react/tests/cohesion.test.mjs:11–23](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/cohesion.test.mjs#L11-L23).

## H06 — Semantic meaning and required state paint are retained

Action/selection and tone continue to own semantic backing/ink. Selected, checked, invalid, progress and literal color data remain truthful; meaningful marks have positioned geometry and non-color/native/ARIA cues. Required plate/mark paint is not scaled by decorative strength.

**Enforcement today:** Action-versus-selection CSS tests, row selection precedence and markup assertions for checked/disabled/loading exist.

**Missing test / limit of enforcement:** All materials × role/state integration tests including quantitative fill extents, simultaneous states, contrast and screen-reader output. Material-specific masking must not erase a mark.

**Evidence:** [docs/CONTRAST.md:61–68](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L61-L68); [packages/react/tests/tone.test.mjs:41–48](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/tone.test.mjs#L41-L48); [packages/react/tests/cohesion.test.mjs:25–44](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/cohesion.test.mjs#L25-L44); [packages/react/tests/audit-rules.test.mjs:30–48](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/audit-rules.test.mjs#L30-L48).

## H07 — Behavior, naming and targets survive optical layers

Keep native props, accessible names, focus order, keyboard/pointer operation, hit targets and overlay relationships. Decorative overlays must not intercept events, obscure required content, alter scroll or break portal positioning.

**Enforcement today:** Existing component tests cover representative ARIA markup and overlay positioning. Theme defines a complete React attribute boundary, including portals.

**Missing test / limit of enforcement:** Material-on versus baseline real-event and accessibility-tree comparisons, RTL/touch/zoom, screen-reader and native forced-colors execution. SSR tests are partial enforcement.

**Evidence:** [AGENTS.md:40–49](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/AGENTS.md#L40-L49); [packages/react/tests/overlay.test.mjs:11–43](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/overlay.test.mjs#L11-L43); [packages/react/tests/overlay.test.mjs:46–63](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/overlay.test.mjs#L46-L63); [packages/react/src/components/Theme.tsx:19–32](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/src/components/Theme.tsx#L19-L32); [docs/DEVELOPMENT.md:142–147](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/DEVELOPMENT.md#L142-L147).

## H08 — Disabled, read-only and loading remain distinct

Do not double-apply disabled opacity or fade an already disabled group again. Preserve fields that use disabled color rather than group opacity; loading keeps its existing focus/Stop semantics.

**Enforcement today:** Cohesion protects disabled field paint; audit tests protect native-disabled versus loading and read-only field paint.

**Missing test / limit of enforcement:** Composed alpha checks on disabled parent+child+material, and state interaction tests for every role. Disabled exemptions do not authorize invisible required context.

**Evidence:** [packages/react/tests/cohesion.test.mjs:70–80](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/cohesion.test.mjs#L70-L80); [packages/react/tests/audit-rules.test.mjs:37–59](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/audit-rules.test.mjs#L37-L59); [packages/react/tests/audit-rules.test.mjs:121–125](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/audit-rules.test.mjs#L121-L125); [packages/tokens/src/contrast/assertions.ts:190–192](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/assertions.ts#L190-L192).

## H09 — Contrast preferences and local scopes keep working

Honor increased contrast, explicit local standard reset and root OS preference rules. Re-derive colors at each axis/preference boundary; nested Material must not bake parent contrast or theme into a child.

**Enforcement today:** Emitter tests assert contrast preference selectors and re-emission, plus non-registration of derived edge/fill/token colors.

**Missing test / limit of enforcement:** Actual nested Material × contrast × light/dark tests including portals, mode flips and raw DOM scopes. Extend rather than replace current emitter tests.

**Evidence:** [docs/CONTRAST.md:33–38](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L33-L38); [packages/tokens/src/emit/colors.test.ts:39–55](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/emit/colors.test.ts#L39-L55); [packages/tokens/src/emit/css.ts:166–184](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/emit/css.ts#L166-L184).

## H10 — Unknown backdrops require composition and a safe fallback

D7: floating shells assume any backdrop; required edges that fail use an opaque fallback. Test all allowed backdrop colors/positions and gradient interiors, not only black/white endpoints. A bounded gray ramp is not the whole RGB/image domain.

**Enforcement today:** Binding owner rule; current production token gate explicitly cannot composite alpha. Task 18 is a research prototype on old seeds, not a shipping material test.

**Missing test / limit of enforcement:** Production worst-case sampler matched to interpolation/color space, image/spatial adversaries and fallback validation on real receivers. For unbounded or unproved scenes, resolve to the opaque safety path rather than infer a pass from samples.

**Evidence:** [docs/research/astra/materials/REVIEW.md:136–140](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L136-L140); [packages/tokens/src/contrast/contrast.test.ts:21–29](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/contrast.test.ts#L21-L29); [docs/CONTRAST.md:73–79](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L73-L79).

## H11 — Transparency reduction is both app-level and OS-driven

D7 requires an app-level setting beside the OS query. Reduction disables material acquisition/transmission and supplies an opaque readable ground while retaining semantic state and focus. An unavailable query is not evidence the user permits transparency.

**Enforcement today:** Owner rule only for the new material layer. The source search below finds no production prefers-reduced-transparency hook or Material setting.

**Missing test / limit of enforcement:** Preference resolution, app override plus OS reduction, unsupported-query engines, nested scopes, portals, and no-alpha/no-backdrop-filter assertions under reduction. API naming and precedence details belong to the later design/safety tasks.

**Evidence:** [docs/research/astra/materials/REVIEW.md:136–140](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L136-L140); [docs/CONTRAST.md:76–79](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L76-L79).

## H12 — Forced colors supplies opaque functional paint

D7: explicitly opaque Canvas and backdrop-filter:none, including the prefixed path where used; remove material gradient/grain/filter overlays and preserve system focus, marks, selection and invalid indication. A broad forced-color-adjust:none is not a fallback.

**Enforcement today:** Current forced-colors stylesheet supplies system edges, outlines, native Select arrow, marks and selected rows. It does not supply a general material opacity/backdrop-filter reset.

**Missing test / limit of enforcement:** Native Windows forced-colors plus browser preference tests of every new optical layer: inspect alpha, pseudo-elements, filters and functional markers. Do not rely on automatic forced colors to remove background alpha or backdrop filtering.

**Evidence:** [docs/research/astra/materials/REVIEW.md:136–140](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L136-L140); [packages/styles/src/forced-colors.css:1–14](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/styles/src/forced-colors.css#L1-L14); [packages/styles/src/forced-colors.css:23–45](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/styles/src/forced-colors.css#L23-L45); [packages/styles/src/forced-colors.css:50–78](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/styles/src/forced-colors.css#L50-L78); [packages/styles/src/forced-colors.css:92–106](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/styles/src/forced-colors.css#L92-L106); [docs/CONTRAST.md:65–68](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L65-L68).

## H13 — Motion preferences retain meaning without unnecessary motion

OS reduced motion must override local motion scopes and stop decorative loops; loading/progress still communicates its state. Never delay focus for an animation. None also preserves current normal-motion behavior.

**Enforcement today:** Emitter re-emits motion-none for root and motion scopes under the media query; MOTION documents stopped loops and immediate keyboard focus.

**Missing test / limit of enforcement:** New material light/gloss/refraction/grain animation preference tests, interrupted transitions and settled geometry. Existing duration generation is not a test of every new animation.

**Evidence:** [packages/tokens/src/emit/css.ts:186–193](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/emit/css.ts#L186-L193); [docs/MOTION.md:61–64](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/MOTION.md#L61-L64); [docs/MOTION.md:85–97](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/MOTION.md#L85-L97); [docs/CONTRAST.md:68–68](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L68-L68).

## H14 — No automatic decoration of glyphs or small text

D13 prohibits automatic inherited glyph/small-text effects. Display text and button labels may explicitly opt in; duotone remains a separate later pilot. Opt-in does not relax contrast, geometry or foreground ownership.

**Enforcement today:** Owner rule, with current plain Field label/semantic ink CSS as baseline. No production opt-in Material gate is present.

**Missing test / limit of enforcement:** Automatic-host effect leakage tests, 12–16px legibility review and opt-in scope tests. A whole-parent filter also decorates descendants and must be detected.

**Evidence:** [docs/research/astra/materials/REVIEW.md:147–148](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L147-L148); [packages/styles/src/components/field.css:20–28](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/styles/src/components/field.css#L20-L28); [packages/styles/src/base.css:5–14](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/styles/src/base.css#L5-L14).

## H15 — Geometry, typography and ink belong to their existing axes

D16: a material changes optical surface paint, not dimensions, layout, radius, stroke geometry, glyph drawings, type metrics or semantic foreground values. Separate geometry/type/ink settings may be bundled with material, but the bundle is not the Material axis. Required focus geometry survives.

**Enforcement today:** Owner rule; component contract/geometry CSS and manifest parity enforce baseline structures, not equivalence under an absent new axis.

**Missing test / limit of enforcement:** Material-on/off computed rects, box model, font metrics, wrapping, SVG geometry, content ink, targets and overflow comparisons. Additional optical extents may change; use them without changing layout or hiding content.

**Evidence:** [docs/research/astra/materials/REVIEW.md:153–154](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L153-L154); [AGENTS.md:40–54](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/AGENTS.md#L40-L54); [docs/DEVELOPMENT.md:10–16](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/DEVELOPMENT.md#L10-L16); [packages/styles/src/components/surface.css:93–110](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/styles/src/components/surface.css#L93-L110).

## H16 — Disjoint token ownership, local derivation and canonical colors

Keep axis namespaces disjoint and palette values verbatim. Derive interactions in base and re-emit at boundaries; never register derived/paired semantic colors. D2 requires Material beside Surface and inherited recipe gates, with pixel-identical Surface decomposition first.

**Enforcement today:** Registry tests catch duplicate ownership/namespace errors; color tests protect polarity, paired registrations and selected derived outputs. D2 migration itself has not shipped.

**Missing test / limit of enforcement:** New Material namespace/gate/reset tests and emitter-wide single-writer checks, full derived-color registration coverage and None identity tests through the Surface migration.

**Evidence:** [AGENTS.md:48–54](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/AGENTS.md#L48-L54); [packages/tokens/src/axes/registry.test.ts:42–75](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/axes/registry.test.ts#L42-L75); [packages/tokens/src/emit/colors.test.ts:15–33](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/emit/colors.test.ts#L15-L33); [packages/tokens/src/emit/colors.test.ts:39–46](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/emit/colors.test.ts#L39-L46); [docs/research/astra/materials/REVIEW.md:124–127](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L124-L127).

## H17 — Decorative colors derive from the theme

D5: derive decorative colors from accent, neutral and tones rather than hardcoded preset hex palettes; do not recolor semantic data or change foreground ink.

**Enforcement today:** Owner rule; current Action/Selection tests enforce representative semantic consumers, not every future gradient stop.

**Missing test / limit of enforcement:** Recipe-schema/source validation forbidding literal decorative palettes plus accent/neutral/tonal switching tests across all material outputs.

**Evidence:** [docs/research/astra/materials/REVIEW.md:133–133](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L133-L133); [packages/react/tests/tone.test.mjs:41–48](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/tone.test.mjs#L41-L48).

## H18 — Near-black page stays within an explicitly bounded distance

D10 permits page tint/texture only within a fixed distance of neutral 975 / #020202. This is a constraint requiring calibration, not permission for an arbitrary dark material background.

**Enforcement today:** Owner rule; base body consumes bg-page. No agreed distance metric or numeric bound is present in the review.

**Missing test / limit of enforcement:** Owner/calibration definition of the bound, then resolved-page pixel/color checks at control extremes and texture peaks. Do not invent a Delta-E or alpha threshold in this task.

**Evidence:** [docs/research/astra/materials/REVIEW.md:144–144](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L144-L144); [packages/styles/src/base.css:5–14](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/styles/src/base.css#L5-L14).

## H19 — Inner rims obey the radius floor

D11 applies the radius floor to inner rims at every setting except Sharp. D16 keeps the actual receiver shape from its geometry axis; Material may not square an inner rim by blindly clamping radius minus inset at zero.

**Enforcement today:** Owner rule; current Card radius and media radius explicitly use radius-floor.

**Missing test / limit of enforcement:** Every generated material rim × radius/density/size, including Sharp and pill, needs geometry tests; current Card CSS alone is not a global optical-rim proof.

**Evidence:** [docs/research/astra/materials/REVIEW.md:145–145](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L145-L145); [packages/styles/src/components/surface.css:79–85](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/styles/src/components/surface.css#L79-L85).

## H20 — Cutout rings and fixed-color fades use real gaps

D12 requires masks for cutout rings and fixed-color fades when adapting them to materials. A page-colored imitation cannot reveal the real host. Preserve separately necessary occlusion, focus and status marks. None must retain baseline pixels while this migration is introduced.

**Enforcement today:** Owner rule only for the general material-aware gap conversion; current required-stroke checks guard related lines, not actual alpha transmission.

**Missing test / limit of enforcement:** Arbitrary host/backdrop and nested None/material mask tests, including Card/Code fades and Avatar/Indicator/Presence gaps; verify both pixel identity on original plain grounds and truthful transmission on material hosts.

**Evidence:** [docs/research/astra/materials/REVIEW.md:146–146](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L146-L146); [packages/react/tests/cohesion.test.mjs:101–132](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/react/tests/cohesion.test.mjs#L101-L132).

## H21 — Unsupported optics never remove the usable fallback

D8 defines frost plus rim now and SVG refraction only as a later Chromium enhancement. Unsupported filter paths must still satisfy hard limits and D7 opaque fallback when contrast cannot be established.

**Enforcement today:** Binding review; production Material/refraction path not found in the surveyed package sources.

**Missing test / limit of enforcement:** Feature/path fallback tests in target engines, plus app-level reduction and forced colors. A generic backdrop-filter supports test is not proof of SVG URL displacement.

**Evidence:** [docs/research/astra/materials/REVIEW.md:136–142](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L136-L142).

## H22 — Validation is additive and claims match evidence

Do not lower floors, add a waiver to hide a failure, discard inconvenient scenes or weaken existing checks. D14 measured performance rules need an owner-named 60Hz minimum device, not invented universal blur/lobe bans. Passing identity/builds never means owner approval.

**Enforcement today:** Contrast report exits nonzero on unwaived failures; exceptions list is empty. Negative contrast test proves a bad foreground fails. Review binds performance and approval remains owner-set.

**Missing test / limit of enforcement:** Material adversarial negative controls, image/AT/cross-engine coverage and the named-device benchmark. No justified universal performance cap is available yet.

**Evidence:** [docs/CONTRAST.md:40–44](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/docs/CONTRAST.md#L40-L44); [packages/tokens/src/contrast/exceptions.ts:21–22](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/exceptions.ts#L21-L22); [packages/tokens/src/contrast/contrast.test.ts:94–127](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/contrast.test.ts#L94-L127); [packages/tokens/src/contrast/report.ts:90–92](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/packages/tokens/src/contrast/report.ts#L90-L92); [docs/research/astra/materials/REVIEW.md:149–150](https://github.com/ethanwongwork/area/blob/dbd57a9067e3d927b2bfb7a061db074eeaf48db9/docs/research/astra/materials/REVIEW.md#L149-L150); [AGENTS.md:61–63](https://github.com/ethanwongwork/area/blob/d455567e5b264a768f42dc853476f1622ed6dd9f/AGENTS.md#L61-L63).
