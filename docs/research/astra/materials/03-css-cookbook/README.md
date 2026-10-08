# Materials 03 — CSS cookbook

**Question:** How can every layer in the task 01 model be rendered with CSS/SVG, where does Chrome/Safari/Firefox support end, and how could the recipes consume Area tokens safely?

**Answer:** Most body, shadow, glow, highlight, grain and text layers have portable CSS/SVG building blocks. Rounded gradient edges need an opaque double background or a separately masked ring; border-image does not follow border-radius. Backdrop blur is broadly available, but arbitrary-page SVG refraction is not established by SVG-element support. Treat corner-shape as an enhancement: the pinned data records Chrome 139 and Safari/Firefox preview support. Keep readable ink, required edges and Surface elevation independent, derive unregistered colours again at scope boundaries, and retain opaque/solid fallbacks. Three standalone demos make these distinctions inspectable.

**Snapshot:** checked **2026-10-08**; Area `origin/main` **`4c1854202a8e109479d5b83ef24a8325231da056`**. Research base **`7d14fbf1eee8e7c1639d8ebf5d57869be847feb4`** includes tasks 01 and 02. Read the [materials brief](../README.md) and [task 01 layer model](../01-taxonomy/layer-model.md). Browser data is pinned to MDN BCD **`ef3eb098c3fea5291e31dc40ed9f8e47de2978bd`** and Can I use **`e7ddc557408a5caa830e3e2949a302361f5b37c6`**. Status: **unreviewed**; research only.

## Evidence and deliverables

- [Cookbook](cookbook.md): twelve technique groups, all twelve matrix fields plus backdrop/adaptation, and a crosswalk to all 25 taxonomy entries. Each technique supplies support references, pitfalls, fallback and Area-token approach.
- [Compatibility](compatibility.md): Chrome, Safari and Firefox floors with dated MDN/Can I use links, pinned BCD source lines, prefix/partial/preview caveats and recipe-level combinations.
- [Area integration](area-integration.md): current namespace, scope, semantic, corner and contrast contracts pinned to the Area main snapshot; recommendations clearly separated from implemented behavior.
- [Verification](verification.md): actual local-browser observations, reproduction steps and explicit unverified checks.
- [Layer lab](index.html), [glass and edges](glass.html), [nested scopes](scopes.html): self-contained local demos sharing [CSS](lab.css), [JS](lab.js) and an authored [SVG noise tile](grain.svg). No dependencies, remote assets, personal content or product mutation.
- [MDN extract](compat-data.json), [Can I use extract](caniuse-data.json), [reproduction script](refresh-compat.py), [integrity checker](verify.py).

Every demo number is an **authored illustrative value**, not a measured preset. The dark relief examples intentionally exaggerate the mechanism and are not an exception to Area's dark-card policy. The SVG scene uses owned artwork; it neither copies a signed-in product nor reproduces native Apple Liquid Glass. Public source claims are linked and dated in the evidence documents; synthesis and suggested recipes are identified as proposals.

## Run locally

From the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory docs/research/astra/materials/03-css-cookbook
```

Open [the layer lab](http://127.0.0.1:8765/index.html), then follow its page links. Change mode, radius and paint angle; on the glass page change blur, body opacity and SVG displacement. Settings apply only to the current page. The support badge reports parser acceptance, not rendering correctness. The Simplify effects control demonstrates selected fallback recipes; it is not an OS preference detector or an emulation of every old browser.

```sh
python3 docs/research/astra/materials/03-css-cookbook/verify.py
python3 docs/research/astra/materials/03-css-cookbook/refresh-compat.py
```

The first command checks saved evidence, links, scope and size without network access. The second reproduces extracts from the **pinned** upstream commits and needs public network access; it does not update to latest automatically. Neither writes outside this topic. No production build is necessary for these static research pages. Each committed file is below 1 MB.

## Proposals

1. Keep Surface as the single owner of decorative width and cast elevation; add any eventual optical inputs beside it. This follows the task 01 recommendation and prevents Flat from being silently overridden.
2. Prefer opaque double backgrounds for opaque rounded strokes and a masked decorative ring for translucent ones. Keep required identification/focus edges independent of either.
3. Ship native rounded geometry and opaque paint as baseline recipes. Treat squircle corners and refraction as explicit enhancements with separate support/visual checks.
4. Re-emit derived colour expressions at all relevant Area scope boundaries and never register derived or paired colours with `@property`. The standalone nested-scope page illustrates why.

## Open questions

- Which role recipes and optical controls are accepted for Area? Tasks 04, 05 and 07 must answer this before production adoption.
- What exact adverse-backdrop limits, forced-colour behavior and small-text readability pass the existing contrast contract? Task 08 remains necessary; the demo is not a contrast certification.
- How should dark relief avoid white halos, and how should compact density bound effects? Tasks 09 and 12 remain necessary.
- What is the measured cost of stacked blur, masked rings, SVG filters and texture at real component counts? No performance budget was measured here; task 11 owns that work.
- Will arbitrary-page URL-filter refraction and stable Safari/Firefox corner-shape meet the required browser floor? Not established in this snapshot; keep the documented fallback.
