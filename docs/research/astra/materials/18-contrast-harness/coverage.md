# Coverage and binding policy

This is a **role-level prototype**, not a rendered inventory of all component contracts/parts. The binding policy below is authored for this task. The source token pairs and floors are copied without edits from [the pinned assertion generator](https://github.com/ethanwongwork/area/blob/6a4307756ce06ddd008c0bc9d866f297fda9e8fd/packages/tokens/src/contrast/assertions.ts#L70-L230). Exact outputs, including exclusions, are in [bindings.json](bindings.json). Each fixture has the source assertion index, semantic foreground/background, role, kind, threshold, APCA floor, note and immutable source-line URL.

The exporter resolves **neutral / blue**, the [default selection](https://github.com/ethanwongwork/area/blob/6a4307756ce06ddd008c0bc9d866f297fda9e8fd/packages/tokens/src/semantic/resolve.ts#L93-L107), in light and dark. It does not run the entire theme cross-product. The semantic body bindings below follow the [surface definitions](https://github.com/ethanwongwork/area/blob/6a4307756ce06ddd008c0bc9d866f297fda9e8fd/packages/tokens/src/semantic/aliases.ts#L114-L141); strong cue sources follow [indicator/focus definitions](https://github.com/ethanwongwork/area/blob/6a4307756ce06ddd008c0bc9d866f297fda9e8fd/packages/tokens/src/semantic/aliases.ts#L198-L208). A host binding says where to apply a recipe in the synthetic scene; it does not assert that every real component uses this token or needs this edge.

## All twelve material roles

| Role | Concrete ground/target mapping | Host probes per preset/mode | Interpretation |
| --- | --- | ---: | --- |
| page | `bg-page` | 24 | Opaque default page; no Material transmission. |
| container | `bg-surface`, `bg-subtle`, `bg-code`, `bg-stripe` | 62 | Sparse shell eligible; dense/striped/code grounds kept opaque and flat. |
| floating-surface | `bg-surface`, `bg-inverse` | 25 | Eligible sparse shell; inverse Tooltip/Toast fixture kept opaque. |
| raised-control | `bg-page` ghost-host ground, component fills/states, neutral/tonal solids and tints | 149 | No new resting ghost body; other ground uses its own semantic ink pairing. |
| recessed-field-track | `bg-subtle`, component fills/states, `stroke-control` unchecked track | 55 | Opaque fields/functional track; no invented independent blur. |
| thumb-knob | `bg-surface` | 24 | Opaque surface-backed thumb/segmented handle binding. Mark-on-track evidence is additionally included in the glyph roll-up. Not every physical thumb is this color. |
| indicator-fill | declared tonal solids/tints | 94 | Functional semantic core is preserved; Material cannot recolor its data/state. |
| divider | no required text or indicator in this role | N/A | Structural decorative line, not credited as required identification. Existing aesthetic assertions remain in the exclusion ledger and original gate. |
| edge | union of all 171 required-edge host probes | alias | Required cues bypass the standalone decorative edge recipe. No second Material rim is added. |
| glyph | union of 5 existing non-text mark/track probes | alias | `fg-on-accent` on its checked fill and `bg-surface` on unchecked track. These information-bearing marks keep their independent 3:1 floor. Ordinary textual icon paint is not reclassified as one of these five cases. |
| text | union of all 257 text host probes | alias | Body, muted, placeholder, tonal, Tag, inverse, solid-action, code and state text; 4.5:1 everywhere in this source set. No extra material applied to ink. |
| scrim | no required text/indicator directly on the occlusion | N/A | Functional scrim alpha is unchanged. Modal content is checked through its floating owner; scrim itself is not a label plate. |

The first seven rows sum to **433** distinct host-pair probes. Aliases do not inflate that count. The eight actual IDs are Paper, Glass, Acrylic, Soft, Tactile, Aero, Glow and Prism; both modes yield **6,928 probes per scenario**. The 192 role/mode/preset records include N/A outcomes rather than treating no measurement as a pass. [Task-13 names/roles and recipes](https://github.com/ethanwongwork/area/blob/cf058e2b09670682a5e33a177b930af48bcdb511/docs/research/astra/materials/13-presets/model.py#L5-L31); [aliases, family guards and reading islands](https://github.com/ethanwongwork/area/blob/cf058e2b09670682a5e33a177b930af48bcdb511/docs/research/astra/materials/13-presets/contract.md#L64-L70).

## Floors and all exclusions

The pinned `ASSERTIONS` export contains **243** records: **213** use the text or required-nontext floors and are included without modifying their token pairs; **30** have aesthetic or disabled floors and are explicitly excluded from this required-contrast suite. Every source record belongs to exactly one set. The 30 exclusions, their original floors and reason appear in `bindings.json.excludedAssertions`; they are **not waived in Area’s original gate**. No 1.1–1.9 decorative floor is substituted for 3:1.

Text-identified Buttons do not acquire a required 3:1 outline through this mapping. The edge probes mean: **if this source is the required identifying cue on this host, does that cue pass?** An actual Card with no required boundary does not become a WCAG failure merely because a deliberately required-edge fixture named `container` fails. Conversely, a component using a soft edge as its only cue cannot claim the strong endpoint’s result. [Area classification and preference boundary](https://github.com/ethanwongwork/area/blob/6a4307756ce06ddd008c0bc9d866f297fda9e8fd/docs/CONTRAST.md#L8-L38); [aesthetic versus text floors](https://github.com/ethanwongwork/area/blob/6a4307756ce06ddd008c0bc9d866f297fda9e8fd/packages/tokens/src/contrast/assertions.ts#L37-L79).

The existing dark **APCA** floor accompanies every binding in `apcaFloor`. This run measures WCAG ratio only. An APCA pass, disabled/aesthetic pass, component approval, and production gate pass are **not** inferred from it.

## Adjacency, fallback and states

Text compares against its local composed footprint. Required edges compare both against the inside strip and the outside opaque `bg-page`; the smaller ratio is retained with its adjacency label. Checked glyphs/track marks compare against their exact declared fill. Separate `outsideScene` records remove the outside page and expose the required edge directly to `[0,1]³`.

All colors are resolved after selecting mode/neutral/accent in the pinned resolver. States already declared in the source assertion data are included. The prototype does not multiply foreground alpha, change ink on hover or darken a tone to manufacture a pass. Focus and danger-edge fixtures omit body reflection. Full selected+invalid+focused component stacks and native state geometry remain unverified; this suite does not invent missing pairings.

The proposed comparison masks and the distinction between requested, guarded and F0 are in [method.md](method.md). If an actual host cannot provide those masks or declared neighboring grounds, it is outside this numerical fixture, even when its row says PASS. F0 is tested separately; failed requested/guarded rows remain in [failures.json](failures.json).

## Data lookup

1. Choose `results-<preset>-<mode>.json` and `scenarios.requested`, `.guarded` or `.f0` (or `.outsideScene`).
2. Its key is a fixture ID; use `bindings.json.fixtures` for role, tokens, floor and source pin.
3. Its value is a measurement ID; use `measurements.json` for ratio, backdrop, composed ground, gradient position and status.
4. `inputs.json.themes[mode]` gives the exact ink/body token colors; the record’s `transmission` and `gradient` identify the retained variable paint. `summary.json` aggregates without double-counting alias rows in the run totals.

The human matrix/CSV contains the worst threshold-normalized witness per role/target. This lookup supplies every remaining pairing, not just the worst row. Source JSON values are locked to task 13’s SHA-256 and imported unchanged; no global control object leaks into a complete role recipe.
