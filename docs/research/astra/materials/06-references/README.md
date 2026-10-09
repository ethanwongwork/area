**Question:** Which public references publish exact material-layer values for every style in the taxonomy, which roles do they demonstrate, and which owner-board items do they cover?

**Answer:** The catalogue maps all 25 styles to 18 public reference entries plus the two owner-supplied annotations.
It records specified layer values, source URLs, checked dates, roles and limits; repository evidence is pinned to commit lines.
Coverage is strongest for CSS primitives, soft relief, Acrylic, glass approximations and historical gloss/bevel recipes.
Complete native Mica and Apple Liquid Glass optical recipes were not found; their published values/API inputs are marked partial.
Figma Community resources are listed, but no inspected file yielded verified numeric layer styles in the public preview.
All 17 board items are cross-referenced. Items 5 and 6 preserve the printed values; the others have partial ingredient analogues, not complete matches.

**Snapshot:** Checked **2026-10-08**. Area `origin/main`: [`6f896789a5200bcbd34fe87de458e60ca82141d6`](https://github.com/ethanwongwork/area/tree/6f896789a5200bcbd34fe87de458e60ca82141d6). Brief and series inputs: research commit [`a5c56e600f5124b8c618950747fd17bfeab60665`](https://github.com/ethanwongwork/area/tree/a5c56e600f5124b8c618950747fd17bfeab60665/docs/research/astra/materials). Public-source revisions: [source-lock.json](source-lock.json); exact ranges, URLs and access dates: [references.json](references.json). Unreviewed research; no component approvals or production changes.

## Evidence

- [Catalogue](catalogue.md): a 25-style coverage index, then 20 reference records with layer stacks and explicit scope.
- [Board coverage](board-coverage.md): every owner-board description, the applicable references, and the remaining gaps.
- [Access ledger](access-ledger.md): Apple/Microsoft design resources, Figma Community candidates, and sources excluded from exact-value coverage.
- [Structured references](references.json): the same curated data, including per-layer citations and board mappings.
- [Source integrity](source-integrity.json): text digests and line counts for the immutable files actually cited.

Read a reference as **this source’s recipe under the stated conditions**, not a definition of a style. For example, clay.css has an almost transparent default fill; its name does not authorize replacing that source value with a pastel. A neon shadow lobe is emission; a zero-blur spread ring is an edge; neither automatically belongs to elevation. These distinctions use [task 01’s layer model](../01-taxonomy/layer-model.md). Roles use [task 04’s vocabulary](../04-role-map/role-map.md); assigning an external specimen to an Area role is research interpretation, not a statement made by its author.

No image dimensions, colors, shadow lengths or opacities were estimated. Public CSS/Sass/TSX/XAML and native API examples supplied the values. Source arithmetic is explicitly identified: alias resolution, shadow-map expansion, neumorphic RGB channel rounding, and the selected web-refraction parameters. Browser rendering, accessibility, contrast, perceived depth and vendor fidelity were **not measured** in this task.

## How to interpret the stacks

The record uses `body.paints`, `body.transmission`, `filters`, `edges`, `reflection`, `shading.inset`, `shading.cast`, `emission`, `texture`, `content`, `backdrop`, `adaptation` and `fallbacks` from task 01. Combined channel labels identify a value serving multiple optical purposes; they do not define new schema fields. Geometry and dependencies are stated alongside the paint.

Every row is a selected recipe or a clearly marked partial recipe. **Unlisted** means not established by that extract. It does not mean zero. Explicitly absent declarations are identified narrowly, such as no additional backdrop filter in R03’s child rule. External stylesheets, inherited ink and native rendering internals are not silently filled in.

Retain source units and formats. CSS shadows below use CSS lengths; native WinUI blur is a native effect parameter; SwiftUI examples retain their numeric API inputs; board shadow lengths remain the printed annotation units. XAML eight-digit hex is `#AARRGGBB`, CSS eight-digit hex is `#RRGGBBAA`. Em/rem values are not converted using an assumed root font. A source’s symbolic SwiftUI `.orange` is not an invented sRGB hex.

Layer order means the source’s actual paint/blend relationships. Multi-background CSS is listed front to back; a mask recipe is a separate alternative to an opaque white center. Native Acrylic has a backdrop/fallback → blur → luminosity/tint → noise graph, not a CSS background list. R15’s overlapping radial gradients are called a mesh *approximation*; R16 supplies actual native mesh geometry.

## Proposals

Use the pinned repository references as repeatable primitive fixtures for later research, and dated CodePens as supplementary specimens. Keep the two board annotations as owner evidence until their originals can be identified. Do not promote a Figma preview or a visually similar screenshot to exact-value evidence.

For Area, these numbers remain reference inputs, not adopted tokens. The existing [Surface axis owns decorative border width and cast shadows](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/tokens/src/axes/surface.ts#L21-L40). If a later implementation adapts a recipe, retain that ownership and apply the [role absorption and nesting constraints](../05-absorption/policy.md). This task proposes no axis, color registration, geometry, state or component change.

## Verification and repeatability

Run from the repository root:

```sh
python3 docs/research/astra/materials/06-references/build.py --check
```

The script resolves the repository root relative to itself. It validates all taxonomy IDs, role names, per-layer source IDs, the board inventory, pinned source ranges and anchor text, exact regeneration, and the per-file 1 MB ceiling. On a fresh checkout it downloads only cited public files at the locked SHAs into the ignored `.source-cache/`; network access is required then. It reads research-branch evidence with `git show`. A digest identifies the decoded UTF-8 source text with normalized line endings, not a browser screenshot or a compiled result.

Edit [catalogue.py](catalogue.py), then run `build.py` without `--check` to regenerate. [read-sources.py](read-sources.py) provides `tree` and `file` inspection at locked commits. Its `init` command resolves fresh HEADs and is for a **new dated audit**, not reproduction of this snapshot. Live pages and CodePens are date-pinned, not immutable: re-open their named CSS selectors/API examples manually before changing an extract. Figma access checks in the ledger are observations and are not replayed by the script.

Validation on this snapshot passed for 20 records, all 25 styles, all 17 board entries, and 60 pinned ranges in 20 immutable files. The generated JSON files are below 1 MB. No source clones, source caches, downloaded assets or raw browser output are committed. No demo was created because this task collects external evidence; task 03 already provides technique demonstrations. No production build or browser rendering test is claimed.

## Open questions

- **Native optics:** complete Mica active-renderer and Apple Liquid Glass optical constants remain not found in the inspected official resources. Their fallback/API values cannot answer that gap.
- **Figma styles:** the public resources exist, but numeric layer inspection remains unverified. The Fluent kit’s Open in Figma route presented authentication; no sign-in or duplication was performed.
- **Board provenance:** no original public URLs or attached board images were available. Even items 5 and 6 leave geometry and some gradient parameters unspecified.
- **Full compositions:** exact dark knob/rocker/toggle/terminal-icon and jelly-tray compositions remain not found in this bounded collection. The board ledger identifies which ingredients can already be studied without inventing the missing values.
- **Portability:** external recipes may remove focus outlines, change hover ink, use large display text or depend on specific renderers. This collection is evidence, not approval to transfer those behaviors into Area.
