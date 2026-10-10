# Future implementation acceptance plan

**Proposed checks, not results of this research.** Current artifact checks are described in the README. Do not mark the builder or any target supported until the relevant integration checks below pass. Keep existing contrast, token and component contracts unchanged.

## Builder and source document

| Scenario | Expected result |
| --- | --- |
| Edit global depth then lower a role to Trace | Draft retains the request; effective role exposes the reduced channel graph and reason. No multiplication of every effect by one intensity scalar. |
| Clear a role override versus set it to zero | Clear inherits; zero remains an explicit off value through save/reopen. |
| Switch presets after editing a named gradient | Complete reset removes previous optional layers. Preserve-compatible operation retains only validated fields; stop lists replace atomically. |
| Change only a control at a nested scope | Derived paint re-emits there. No inherited root-resolved color freezes the child theme/tone. |
| Open a popup in each comparison stage | Popup stays in its own stage context and optical owner; no duplicate IDs, cross-stage Theme leakage or double acquisition. |
| Before pinned, After edited, then resize | Baseline remains unchanged; both fixture models keep matched content/state. A narrow toggle retains scroll/selection position. |
| Small/dense family and unsupported filter | Suppressed effects are visible in diagnostics. Real opaque fallback retains semantic body, required edges, readable ink and focus. |
| Keyboard controls, numeric edits and real focus testing | Same valid parameter domain as pointer controls; no loss of chrome focus; simulated state clearly distinguished from native behavior. |
| Import/export/reimport a draft | Semantic source descriptors, layer IDs, roles, mode-specific values and zero-versus-inherit survive. Hash is stable under the selected serialization rule. |
| Unknown schema, malformed units, duplicate keys, cycles or injected CSS | Input rejected before applying a preview; no executable payload or unrequested external fetch. Existing valid draft survives. |
| Saved draft against changed profile/compiler/policy | Version mismatch shown; explicit deterministic migration or refusal. No silent application to a newer recipe with different meaning. |

Build source-document fixtures for every control group, both modes, all roles and the off profile. Include combined selected+invalid+focus, joined controls, literal color data and nested glass. Validate generated CSS source ownership: one writer for public derived outputs, no new cast on forbidden roles, no derived or paired `@property`, fixed hover ink and masks clear of content.

## Export adapters

| Target | Must demonstrate | Required failure/partial case |
| --- | --- | --- |
| DTCG 2025.10 | Parse typed colors/dimensions; preserve negative offsets, zero blur, inset flags, ordered shadow lobes, gradient alpha/normalized positions, solid border fields and aliases. Resolve mode bundles deterministically. | Missing gradient geometry reported. Reject invented material types and CSS expressions in color values. Detect unresolved/cyclic aliases; never flatten list aliases opportunistically. |
| Tokens Studio | Record plugin/transform versions and dialect. Import/export a disposable token set with layered shadow, linear ramp, border and variables referenced by styles; compare values and bindings. | Unsupported type/gradient/mode produces a loss record, not a skipped token presented as success. Check source versus destination y-axis signs with an asymmetric shadow; don't infer from ambiguous prose. |
| Figma variables/styles | Bind supported color/scalar fields, switch modes, retain style links and stable logical IDs through a separate ID map. Compare light/dark style topology. | Unbound glass/noise/texture inputs, gradient angle/position, unavailable modes and unsupported spread/clip combinations reported. No whole-shadow or whole-material variable fabricated. |
| Figma optical mapping | Compare matched geometry, backdrop, zoom/scale and mode. Distinguish exact data transfer from approximate appearance. | Native glass/blur/noise mismatch is never marked pixel-equivalent based on similarly named fields. If flattening, label loss of editability and exclude functional content. |
| Tailwind | Compile a recorded version with the Area CSS bundle; discover static integration classes, verify layer ordering, scoped aliases and portal context. | A shadow utility cannot erase required focus/state composition. A dynamic missing class or unsupported major fails the adapter check. |
| Plain CSS | Render real bound parts under both modes, scopes, sizes, density/radii and state/preference fallbacks. Include asset IDs and feature fallbacks. | A missing mask, backdrop owner, asset or unsupported effect selects declared fallback or blocks required output. No root-only variable export claimed as a complete material. |

Measure numerical equality only for representable data. Visual comparisons must report browser/Figma versions, fixture/backdrop and limits; they cannot establish full functional accessibility. Run existing Area contrast tests unchanged, then the composed cases from task 08. A token parser passing does not prove contrast, keyboard interaction, layering or performance.

Every adapter report includes source hash, compiler/policy version, target version/profile, selected contexts and per-source-path result: represented, converted, snapshot, approximate, sidecar-required, unsupported or metadata. If an opaque fallback was chosen, preserve the original request in canonical JSON and identify the effective output separately. Do not convert an export success into component approval.
