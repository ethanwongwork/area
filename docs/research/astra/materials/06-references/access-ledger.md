# Public design resources and access limits

All entries checked **2026-10-08**. This is a bounded source/access log, not a claim that a value does not exist anywhere. No account was signed in, no file was duplicated, and no product setting was changed. No screenshot-derived numbers are included.

## Apple and Microsoft

| Resource / URL | What was readable | Value coverage and role |
| --- | --- | --- |
| [Apple Design Resources](https://developer.apple.com/design/resources/) | Public official directory, including UI kits and Icon Composer. Its live iOS/macOS links currently name 27; those are not backdated into evidence about the 2025 launch. | Resource discovery, not numeric optical evidence. Native controls/floating surfaces; icon tooling is not a control-material spec. |
| [Apple Materials HIG](https://developer.apple.com/design/human-interface-guidelines/materials) and [custom-view API guide](https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views) | HIG text through public indexed content; API guide’s public Markdown version at the same URL with `.md`. | R06 retains exact variant, shape, tint and sample spacing inputs. Blur, refraction, rim and cast constants not found. Raised control / floating surface. |
| [Apple MeshGradient](https://developer.apple.com/documentation/swiftui/meshgradient) | Public Markdown at the same URL with `.md`, including row-major points/colors. | R16 has exact mesh coordinates and symbolic native colors. Page/container paint. Not a CSS mesh or resolved RGB palette. |
| [Fluent 2 material guide](https://fluent2.microsoft.design/material) | Public descriptions and usage of solid, Acrylic, Mica and smoke. | Role guidance only; not a universal numeric brush recipe. R04 and R05 add pinned WinUI source values. |
| [Microsoft Acrylic](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic) | Public design guidance. | Paired with WinUI brush source, R04 has tint/luminosity/blur/noise values for a specific native path. Floating surface. |
| [Microsoft Mica](https://learn.microsoft.com/en-us/windows/apps/design/style/mica) | Public foundation, content-layer and fallback guidance. | R05 has exact fallback/overlay resources. Complete active optics not found in this guide, the pinned MicaBackdrop adapter, or the WindowsAppSDK tree inspected at `b0d4f7ab1ecc928eb7501ef51cf91bc0c4d04373`. Page/container. |
| [Fluent 2 design resources](https://fluent2.microsoft.design/get-started/design) | Official kit directory and variable/library organization. The Web-kit link resolves to the Figma file below. | Establishes resource provenance. Does not make Web-kit paints equivalent to Windows Acrylic/Mica. |

## Figma Community candidates

**No candidate below is counted as a verified exact layer-style source.** The public descriptions/previews are useful references, but readable numeric property panels were not obtained in this session. The precise recipes in the catalogue come from the stated CSS/native sources, not these thumbnails.

| Public file | Access observation | Candidate role / board relevance | Missing evidence |
| --- | --- | --- | --- |
| [KB — Liquid Glass](https://www.figma.com/community/file/1514166133209311735/liquid-glass) | Public page loaded in the local browser without sign-in; author describes a background-blur method and links to ruri.design/glass. Preview opened as an image; embedded preview exposed zoom controls, not numeric styles. | Raised control / container; ingredient analogue for board 12 and 15. | Fill/effect/gradient/blur values and layer IDs not verified. The linked generator was not used as a substitute for reading the file. |
| [Apple — visionOS 26](https://www.figma.com/community/file/1540071341298017505/visionos-26) | Followed from Apple’s official directory. Public browser page identifies Apple and says the kit contains components, text/color styles and materials; description dated December 12, 2025. Embedded preview did not expose numeric style panels. | Floating surface / raised control; platform reference for board 12. | Exact effect stacks, style IDs and native-fidelity relationship not verified. Apple’s design-resource license is linked on the page; no licensed asset is copied here. |
| [Microsoft — Fluent 2 Web](https://www.figma.com/community/file/836828295772957889/microsoft-fluent-2-web) | Followed the official Fluent directory. Public description says components use code-aligned variables. Open in Figma presented a join/authentication dialog. Stopped there. | Container / raised control / field; possible design-token reference. No specific board composition established. | Numeric material styles not inspected; no claim this Web kit contains Windows Acrylic/Mica internals. |
| [iOS 26 Liquid Glass Effect candidate](https://www.figma.com/community/file/1514186232748375562/ios-26-liquid-glass-effect) | Public search lead; web-reader request was denied by robots.txt. Not inspected in the browser. | Candidate only for board 12/15. | Author, recipe, values, file revision and layer styles not verified; excluded from numeric coverage. |

The web reader also failed on several official Figma links; direct browser reading recovered the public metadata above. This is narrower than saying “Figma is unavailable” or “all files require sign-in.” Only the Fluent Open in Figma route was actually checked to the authentication boundary. A future authorized file inspection should record the node/style ID, published file version, theme/variant, fill order, alpha, gradient coordinates/stops, stroke alignment/weight, shadow offset/blur/spread, effect target and clip. A preview image alone does not establish those values.

## CodePens, annotations and excluded inferences

The accepted CodePens have visible authored CSS/SCSS, cited by URL, checked date and selector in [references.json](references.json). They do not expose a Git commit SHA; their authoring date is not inferred from crawler age. They may change after this snapshot. Their values are transcribed as facts about a recipe; full source bundles are not redistributed.

The letterpress candidate [kccnma/gyDue](https://codepen.io/kccnma/pen/gyDue) contains an apparent `2555` channel typo. It was not silently “corrected” into evidence; R18 uses a different inspectable source. R15 explicitly reports the invalid `background-image:#ffe699` declaration and does not treat it as a working fill. R17 records the established alternate recipes rather than copying the page’s current browser-support assertion. R07 is a web approximation whose SVG displacement behavior was not runtime-tested.

[Board items 5 and 6](https://github.com/ethanwongwork/area/blob/a5c56e600f5124b8c618950747fd17bfeab60665/docs/research/astra/materials/README.md#L82-L92) are annotated-shot evidence transcribed by the owner, not independently located public shots. No public original was identified in the inspected button/glass/gloss sources. Their gradient angle, geometry and missing parameters stay unspecified. The two recipes are preserved separately from public analogues in R19/R20.

No standalone exact-value match was found for the complete mechanical dial, car console, terminal icon, dark segmented control/toggles, purple phone sheet, refracting Aa toggle, or green jelly/tray compositions. Searches and inspected sources covered public CodePen Aqua/glass/neon/letterpress/mesh/progress examples, Flat UI, MDC Web, WinUI, clay.css, Neumorphism.io, 98.css, 7.css and liquid-glass-react. “Not found” is limited to that collection, not an assertion about the whole web.
