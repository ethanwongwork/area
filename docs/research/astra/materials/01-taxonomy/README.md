**Question:** What are the requested interface styles made of, and what common layer vocabulary should Area’s later materials research use?

**Answer:** The catalogue defines all requested styles and effects in 25 entries, with canonical references and a 12-ingredient matrix.
Separate paint primitives, material recipes and whole visual languages; they are not interchangeable presets.
Use one role-based model covering backdrop acquisition/lensing, body, shading, texture, edge/reflection, emission and content, with lighting, depth and adaptation recorded separately.
Mica is opaque; Acrylic is translucent; Apple’s 2025 Liquid Glass adds dynamic optical and behavioral rules that a blur recipe cannot capture.
For Area, retain Surface’s ownership of elevation and decorative border width, and propose optical inputs beside it with derived interactions.
The model is unreviewed research; the report identifies unknown recipes rather than inventing values.

**Snapshot:** checked **2026-10-07** (America/Los_Angeles). Area `origin/main`: [`4c1854202a8e109479d5b83ef24a8325231da056`](https://github.com/ethanwongwork/area/tree/4c1854202a8e109479d5b83ef24a8325231da056). Started after fetching `origin`, from research tip `832057ba7d302bd1a245c31ee5402f2dec1fe647`. Evidence: [22 public sources with access dates](sources.md), pinned Area lines in the [layer model](layer-model.md), and explicitly identified owner-brief descriptions. No new product captures, source measurements or implementation changes. Research-branch links refer only to the brief’s provenance, because that document is not on `origin/main`.

## Evidence and deliverables

- [Sourced catalogue](catalogue.md): definitions, term classes and canonical references. “Canonical” means an authoritative platform example, the naming author’s worked example, a technical specification’s example or a documented historical reference; it does not claim an official standard for informal trends.
- [Ingredient matrix](ingredient-matrix.md): every entry has fill, translucency, blur, stroke model, highlight, inner shadow, drop shadow, glow, grain, text treatment, depth and light direction. Three views keep the same matrix readable.
- [Shared layer model](layer-model.md): vocabulary, field meanings, composition graph, brief decompositions, Area ownership options and the handoff contract for the rest of the series.
- [Structured taxonomy](taxonomy.json): definitions, ingredients and evidence identifiers used to produce the catalogue and matrix. The classification and decomposition are marked as synthesis; numeric recipes are deliberately outside task 01.

The requested gradient-fill family is expanded into **linear, radial, conic and mesh** entries; bevel/emboss is one entry that distinguishes the two concepts. Every other requested term has its own entry. Coverage is checked by [render.py](render.py), including all 12 fields and references for each entry.

## Findings that affect the later tasks

**Vendor names are narrower than trend names.** Microsoft specifies a backdrop/blur/blend/tint/noise composition for [Acrylic](https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic), while [Mica](https://learn.microsoft.com/en-us/windows/apps/design/style/mica) is an opaque foundation informed by wallpaper. Calling both “glass with blur” loses a material distinction (checked 2026-10-07).

**Some style requirements are behavioral.** Apple’s [2025 Liquid Glass session](https://developer.apple.com/videos/play/wwdc2025/219/) combines changing optical layers and motion, and distinguishes Regular from Clear. A later web approximation should disclose what it does not reproduce (checked 2026-10-07).

**Historical languages cannot be reduced to one background.** [Aqua’s original announcement](https://www.apple.com/newsroom/2000/01/05Apple-Unveils-Mac-OS-X/) covers an interface and its interaction; [CARI’s Frutiger Aero definition](https://cari.institute/aesthetics/frutiger-aero) includes typography and imagery. The proposed layer model describes their paint ingredients without pretending that those ingredients alone reproduce the language (checked 2026-10-07).

**Render operations need an intent label.** The [box-shadow specification](https://www.w3.org/TR/css-backgrounds-3/#box-shadow) and the brief’s [annotated buttons](https://github.com/ethanwongwork/area/blob/832057ba7d302bd1a245c31ee5402f2dec1fe647/docs/research/astra/materials/README.md#L82-L92) motivate separating rings from cast shadows. The same distinction helps classify inset highlights, letterpress and glow without making CSS property names the design vocabulary (public source checked 2026-10-07; the decomposition is an inference).

**Role and context remain essential.** Area already gives raised thumbs and floating surfaces different elevation responsibilities. A decorative style cannot erase that distinction: see [DESIGN_SYSTEM lines 156–165](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/DESIGN_SYSTEM.md#L156-L165). The model therefore puts recipes on parts/roles, not entire component DOM trees.

## Proposals

1. **Adopt the proposed layer-model vocabulary for subsequent research.** Alternative: keep using the style names as mutually exclusive categories. Recommendation: use the model, because a single component may combine transparent paint, a gradient edge, an inset highlight and a glowing indicator without fitting one category.
2. **Keep material optics beside Surface and derive their interaction.** Alternatives are extending Surface into a broad material axis or replacing it. Recommendation: preserve Surface’s existing namespace ownership and evaluate new optical inputs in task 07. Conflicting combinations, such as externally shaded clay under Surface Flat, need a stated fallback or a reviewed contract change. The [layer model](layer-model.md#area-ownership-boundary) records the boundary precisely.
3. **Keep optical content treatment subordinate to Area semantics.** Whole visual-language bundles should not implicitly change type, geometry, density, light/dark or foreground behavior. Area requires unchanged hover foregrounds and unchanged contrast floors: [CONTRAST lines 36–64](https://github.com/ethanwongwork/area/blob/4c1854202a8e109479d5b83ef24a8325231da056/docs/CONTRAST.md#L36-L64). Any later native-material imitation must account for that constraint explicitly.

These are options and recommendations for review, not accepted tokens or owner approvals. The materials brief remains unchanged as requested by its own series instructions; this new entry and the research index record task 01.

## Open questions and bounded gaps

- **Not found: a complete, public numerical layer recipe for native Liquid Glass.** Search boundary: Apple’s WWDC25 “Meet Liquid Glass” transcript examined for this research. The matrix does not infer internal shadow, noise or shader values. Reproduction fidelity remains a task 03/06 question.
- **Not found: required grain, inner-shadow or highlight constants for Mica in its public material guide.** That guide defines the opaque wallpaper/theme behavior; absence of a documented channel is not proof that the internal renderer lacks it.
- **Not found: an exact original Aqua button stack in the 2000 announcement.** It supports the historical definition and canonical controls, not an invented gradient or shadow recipe. Later source/capture research must establish exact rendering values.
- **Not found: an official universal recipe for glassmorphism, neumorphism, claymorphism or Frutiger Aero.** Search boundary: the cited naming-author tutorials, CARI’s category and Microsoft’s archived Aero guide. Their examples support characteristic ingredients; optional cells are compositional possibilities, not requirements.
- **Not found: the owner’s board images in the repository brief.** Its descriptions and printed-value transcriptions are usable provenance, but are not captures made by this research. The model exercises only those descriptions and identifies inference.
- Which native-material behaviors should Area imitate versus simplify, especially adaptive ink? Which materials should be incompatible with Flat? Those choices require the owner’s later review.
- Browser support, measured cost, dark/density adjustments and accessibility outcomes remain tasks 03 and 08–11. No tests of those behaviors were performed here. The prior-art hypothesis is reserved for task 02.

## Reproduce and verify

From any directory, run the script by its path. It locates the repository relative to itself, reads only this topic’s JSON and checks all requested IDs, ingredients and evidence references. It does not access signed-in products or fetch the web.

```sh
python3 docs/research/astra/materials/01-taxonomy/render.py
python3 docs/research/astra/materials/01-taxonomy/render.py --check
```

Use an absolute script path when outside the repository. The first command regenerates `catalogue.md`, `ingredient-matrix.md` and `sources.md`; the second verifies that they match. The README and layer-model proposal are authored prose and are not regenerated. To refresh the research, re-read the public sources, record the new check date, and update the Area snapshot only after reviewing its current pinned lines.

Validation for this report: 25 entries × 12 ingredient fields, 22 source records and deterministic Markdown generation. Local Markdown targets and pinned repository line ranges were checked; every file is below 1 MB. Documentation-only changes do not require component builds or browser visual tests.
