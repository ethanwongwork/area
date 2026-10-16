# Evidence ledger

Checked 2026-10-08. Implementation links pin Area `6f896789a5200bcbd34fe87de458e60ca82141d6` (A). Research links pin `33e8ee40fc3aa86295920b77baef4771e1f86064` (R). Source observations below are distinct from this topic's proposed architecture. Older statements quoted within previous reports do not override the current implementation.

## E01 Research inputs

- [Brief goal and constraints, R L7–48](https://github.com/ethanwongwork/area/blob/33e8ee40fc3aa86295920b77baef4771e1f86064/docs/research/astra/materials/README.md#L7-L48): adjustable material layer, role-dependent application, Surface ownership, orthogonal namespaces, fixed hover foreground and independent light/dark/density.
- [Task 01 vocabulary, R L5–46](https://github.com/ethanwongwork/area/blob/33e8ee40fc3aa86295920b77baef4771e1f86064/docs/research/astra/materials/01-taxonomy/layer-model.md#L5-L46): primitive/recipe/finish/language/preset distinction; body, filters, edges, reflection, inset/cast, emission, texture, content, spatial and illumination fields.
- [Task 01 refinements, R L70–98](https://github.com/ethanwongwork/area/blob/33e8ee40fc3aa86295920b77baef4771e1f86064/docs/research/astra/materials/01-taxonomy/layer-model.md#L70-L98): light is not a gradient angle; relief is not stacking; optional external lobes cannot bypass Flat.
- [Task 04 map interpretation, R L20–50](https://github.com/ethanwongwork/area/blob/33e8ee40fc3aa86295920b77baef4771e1f86064/docs/research/astra/materials/04-role-map/README.md#L20-L50): twelve roles, separate depth and composition bindings. [Complete machine map](https://github.com/ethanwongwork/area/blob/33e8ee40fc3aa86295920b77baef4771e1f86064/docs/research/astra/materials/04-role-map/role-map.json).
- [Task 05 amounts and role caps, R L5–49](https://github.com/ethanwongwork/area/blob/33e8ee40fc3aa86295920b77baef4771e1f86064/docs/research/astra/materials/05-absorption/policy.md#L5-L49), [nesting and composition, R L53–90](https://github.com/ethanwongwork/area/blob/33e8ee40fc3aa86295920b77baef4771e1f86064/docs/research/astra/materials/05-absorption/policy.md#L53-L90): ordinal caps, semantic precedence, one shell acquisition, separate actual overlays, immediate-parent relief, channel coalescing.

## E02 Registry contract

[Axis schema, A L17–49](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/schema.ts#L17-L49) is a flat string token map per preset. [Current AXES, A L14–31](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/registry.ts#L14-L31) contains nine entries: theme, neutral, accent, action, selection, ui, radius, surface, motion. This code is authoritative; the “ten axes” heading in [THEMING, A L8–34](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/THEMING.md#L8-L34) and “eight” comments are stale counts.

[Integrity checks, A L73–121](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/registry.ts#L73-L121) enforce identical keys per preset, single token writers and nonoverlapping claimed namespaces. A trailing colon in a namespace claim means an exact property, not a prefix. [Emitted-map validation, A L124–150](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/registry.ts#L124-L150) also checks transformed maps. It does not define a numerical material-control schema.

## E03 Derivation and registrations

[Design rule, A L20–27](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/DESIGN_SYSTEM.md#L20-L27): disjoint axes; interactions in `emit/base.ts`; re-emit at relevant boundaries; no derived/paired `@property`.

[Base derived roles, A L108–150](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/emit/base.ts#L108-L150) combine contrast and action/selection switches with semantic endpoints. [Field aliases, A L154–179](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/emit/base.ts#L154-L179) separate body, ink, edges and state halos. [Radius, A L243–272](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/emit/base.ts#L243-L272) derives geometry from UI size/radius; materials must not become another radius owner.

[Registration policy/list, A L276–304](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/emit/base.ts#L276-L304) registers a small leaf-only set. [Color pairing, A L3–13](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/emit/colors.ts#L3-L13) retains light/dark alternatives until consumption; it is not a general converter for entire gradient or shadow-list strings.

## E04 Surface and shadow ink

[Surface contract and all presets, A L1–85](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/surface.ts#L1-L85): Surface owns decorative `border-width`, `shadow-1`…`4`, `shadow-card`, `shadow-float`; Flat emits `none` for all six shadows. Presets emit whole CSS shadow lists rather than blur/spread/offset leaves. [Card/float constants, A L15–18](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/surface.ts#L15-L18) preserve a dark Card halo of zero and distinct float lobes. The stale earlier Card comment is superseded by the code.

[Shadow ink, A L53–62 and L88–96](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/color.ts#L53-L96) is Theme-owned, claimed in [A L102–136](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/color.ts#L102-L136). Neither Material nor Surface should start writing `--area-shadow-color`.

## E05 Elevation, semantic paint and hard constraints

[Elevation, A L156–165](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/DESIGN_SYSTEM.md#L156-L165): in-flow controls/fields have no shadow, thumbs use shadow-1, Panel shadow-2, floating shells share float; Tooltip and floating Toolbar are special recipes. [Button CSS, A L319–325](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button.css#L319-L325) explicitly retains no variant shadow.

[Emphasis ownership, A L1–16](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/emphasis.ts#L1-L16); [semantic tones, A L66–68](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/THEMING.md#L66-L68). [Contrast and required edges, A L7–40](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L7-L40); [focus/state/forced colors, A L42–64](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/CONTRAST.md#L42-L64). Material controls cannot tune required indicators away or change hover ink. [Dark hierarchy, A L272–278](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/DESIGN_SYSTEM.md#L272-L278) keeps the near-black page and dark Card halo off.

## E06 CSS scope emission

[Root defaults, A L85–106](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/emit/css.ts#L85-L106) combine primitives, axis defaults and derivations. [Axis emission and re-derivation, A L135–174](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/emit/css.ts#L135-L174) currently re-emits at registry axis attributes plus contrast. Arbitrary inline scalar overrides alone are not a listed boundary. [Motion preference, A L177–182](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/emit/css.ts#L177-L182) respects reduced motion on root and motion scopes.

## E07 React and configuration

[Theme, A L8–34](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Theme.tsx#L8-L34) exposes `value?: Partial<AxisSelection>` and `pills`; context carries only AxisSelection. [Configuration emitter, A L13–25 and L37–55](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/emit/config.ts#L13-L55) merges validated preset IDs and generates complete attributes/types. Numeric controls, recipe objects and role maps are **not found in these APIs**.

[Theme scope contract, A L104–124](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/THEMING.md#L104-L124) requires a Theme wrapper at a portal destination; context is not CSS ancestry, and raw DOM settings are not read into React context. [Config tests, A L8–27](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/emit/config.test.ts#L8-L27) test defaults, inheritance, validation and immutability. [Token/type generation, A L13–42](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/emit/dts.ts#L13-L42) collects preset/base/derived tokens and preset unions.

## E08 Parts, local tone and shared shells

[Manifest schema, A L13–33](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L13-L33) declares variants/states/elements; material roles, masks, optical groups and absorption guards are **not found in this interface**. Task 04's research assignments are not executable manifest metadata. [Button tone slots, A L288–310](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button.css#L288-L310) show local semantic selection, so deriving every glow from root accent would lose meaning.

[InputGroup, A L57–92](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L57-L92) suppresses child chrome. [DatePicker, A L119–140](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/DatePicker.tsx#L119-L140) composes Input, Popover and plain Calendar. These motivate a role/part binding layer and one shell owner, not a root-only material class.

## Evidence limits

No numerical optical-control ranges, optical role compiler or approved material Theme API were found in the bounded files above. Absence here is not a whole-repository proof. Task 01/05 propose policies, not tested visual defaults. This report does not re-survey CSS support, native material shader constants, performance or assistive technology. New API math and behavior below are design choices to evaluate.
