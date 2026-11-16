# Weight scaling addendum: why the remaining glyphs fail, and what production fonts do instead

This addendum follows "Variable serif weight consistency.md" (in the `variable-serif-typeface-eval-090428` worktree). It does not repeat that report's results: the kink condition, monotone control polygons, handle tension of 100% or less, the geometric stem ladder, avar, and the Bold part ratios for letters. It deals with the failures `audit_axis.py` still reports after build 0.80. On the Bold side these are inflections (x, Whook, asterisk, daggerdbl, section, quotes), crossings (Estroke, astroke, cstroke, Tdiagonalstroke, ampersand, at, trademark, registered, Ghook) and parts that thin. On the Light side they are Astroke, dagger, won and hooked letters, plus small glyphs that thin too fast (asterisk, six and nine superior and inferior, trademark, daggers).

The short answer: **interpolation does not fail on these glyphs because the rules are tuned wrong. It fails because they are built as merged single contours.** Every shipped variable serif I measured except one builds the same glyphs from overlapping strokes. Signs and small figures also follow their own weight law, which is gentler than the stem's.

Evidence labels: **(verified)** means read from the cited source. **(local measurement)** means measured on 2026-11-14 with fontTools on font binaries or sources on this machine or downloaded from GitHub. **(derivation)** means maths worked out here and checked numerically. **(inference)** means a judgment.

## 1. Conditions that guarantee a clean instance, as tests

Every point moves as P(t) = (1 − t)·A + t·B between two adjacent masters. Area Serif has three masters with the Regular as default, so **each condition must hold separately for (Light, Regular), (Regular, mid-550) and (mid-550, Bold)**. Each pair is its own straight-line interpolation (verified: an OpenType region scalar is a piecewise-linear tent, [otvaroverview](https://learn.microsoft.com/en-us/typography/opentype/spec/otvaroverview)). For control points P0 to P3 of one cubic, write dᵢ = Pᵢ₊₁ − Pᵢ and a × b = aₓb_y − a_yb_x.

### 1.1 No new inflection: an exact biquadratic test (derivation)

The cubic's curvature sign at parameter u is the sign of B′(u) × B″(u). Expanding gives a quadratic times a positive constant:

**Q(u) = (1 − u)²·c₁ + u(1 − u)·c₃ + u²·c₂, where c₁ = d₀ × d₁, c₂ = d₁ × d₂, c₃ = d₀ × d₂.**

I checked this numerically against the direct cross product. The number of sign changes of Q on (0, 1) is the number of inflections. Under interpolation each dᵢ is linear in t, so each cₖ(t) is quadratic in t, with Bernstein coefficients cₖᴬᴬ, ½(cₖᴬᴮ + cₖᴮᴬ) and cₖᴮᴮ. Here cₖᴬᴮ crosses master A's first vector with master B's second; for example c₁ᴬᴮ = d₀ᴬ × d₁ᴮ. So **Q(u, t) is a biquadratic, and its 3×3 tensor Bernstein coefficients can be computed directly from the two masters.**

- *Sufficient test, no sampling needed:* if all nine coefficients have the same sign, no instance of the segment has an inflection.
- *Exact test:* subdivide in t (de Casteljau) where the signs are mixed, and solve Q(u) = 0 at the subdivision points.
- *For segments meant to inflect* (s spine, the a's tail, the hook of Ghook): require exactly one sign change of Q in u for every t. The test is that c₁(t) and c₂(t) keep opposite signs for all t, a pair of quadratics checked by their Bernstein coefficients.

This replaces checking 13 stops. It also names the cause: **a mixed coefficient flips sign when a handle in one master points across the chord that a handle in the other master defines.** The x failure is this case: the top-left serif's curve cannot be one-way, because the diagonal's edge is steeper than the chord in the Bold. No change to handle lengths fixes a mixed-sign c₁ᴬᴮ. The fix is to move the node or add one (a topology change), or to change how the glyph is built (section 5).

### 1.2 No kink at smooth nodes (verified in the earlier report)

The condition is d_in × d_out = t(1 − t)(a_A·b_B − a_B·b_A)(u_A × u_B). A smooth node stays smooth if its tangent direction is the same in both masters, or if its handle ratio is. The new part here is the cross-pair rule: **with a sparse mid-master, a node whose tangent angle is equal at Regular and Bold but different at 550 kinks on both sides.** The mid-master must keep each smooth node's tangent direction as well.

### 1.3 A stroke never thins mid-axis if its edges keep their normal (derivation)

Take a stroke between edge points p and q, measured along a unit normal n that is the same in both masters. Its thickness w(t) = n·(p(t) − q(t)) is linear in t. So **it lies between the master values and cannot dip below the Regular's if the Bold's is larger.** If the edge angle changes, w(t) = (p − q) × v / |v|, with v(t) the edge direction. That is a quadratic over the square root of a quadratic, and it can dip. Euclidean distance between two linearly moving points is a convex function of t, so it too can fall below both endpoints mid-axis. Test: per stroke, assert that the Regular and Bold edge directions differ by at most 0.5°, or evaluate w(t) at its stationary point.

**Tapered ends are a separate case.** At a wedge accent's point the thickness goes to zero by design. A "thinnest cut" there measures where the cut falls, not weight. The audit should exclude cuts within one stroke width of an end cap. Otherwise the 24 wedge-accent "thin" failures will never close.

### 1.4 Counters cannot collapse or turn inside out (derivation)

A contour's signed area is quadratic in t:

**A(t) = (1 − t)²·A_A + 2t(1 − t)·M + t²·A_B, where M = ¼·Σᵢ (Pᵢᴬ × Pᵢ₊₁ᴮ + Pᵢᴮ × Pᵢ₊₁ᴬ)**

This is computed over the flattened polygon at matching parameters. If A_A, M and A_B have the same sign, the counter's area never reaches zero. This is a one-line check per hole contour, run on each master pair.

### 1.5 No self-crossing: exact continuous-time check (derivation; the method is standard continuous collision detection in graphics)

Take two edges ab and cd of the flattened outlines. The edges can only start crossing at an instant when a vertex lies on the other edge. orient(a, b, c)(t) = (b − a) × (c − a) is a product of linear terms, so it is **a quadratic in t**. The exact test solves the four point-on-edge quadratics (a, b against cd; c, d against ab), keeps roots in [0, 1], and checks at each root that the point falls within the segment. Pruning by bounding box is safe: a linearly moving point stays inside the box of its two master positions.

This finds crossings between the 25-unit stops and reports the weight at which each starts. **Split the result in two.** A crossing *within one contour* is always an error. A crossing *between two ink contours of the same winding* is an overlap, not an error. It is acceptable while the union of the glyph keeps the Regular's topology: the same number of outer contours and holes after `pathops.simplify`. The current audit counts both kinds together, so a deliberate overlap would be flagged as a fault.

### 1.6 Why merged junctions drift: the corner is not linear (derivation)

When a bar is welded into a diagonal (Astroke, Estroke, cstroke, won, the slashed signs), the welded corner is the intersection X of two edge lines. If both lines move linearly, X(t) is a rational function of t, not a linear one. Linear interpolation of the two master corners misses it by roughly t(1 − t)·Δ/sin φ, where φ is the angle between the lines.

In a numerical check, a level bar edge rose 30 units while the diagonal moved 40 units and turned 2°. The corner at t = ½ was off by **1.9 units at φ = 20°, 9.6 units at 8° and 43 units at 3°**. That is the mechanism behind 0.76's points "thrown thousands of units away" and behind today's slivers and crossings. Rule-tuning cannot remove it: the welded corner is simply the wrong representation for an interpolated font. Test: for each welded corner, compute the true intersection of the instance's two edge lines at t = ½ and compare it with the interpolated vertex. **If the difference is more than 0.5 units, rebuild the glyph as overlapping contours.**

## 2. What production variable serifs do (local measurement unless cited)

I scanned the compiled fonts' gvar tables for wght peaks other than ±1 and their GSUB FeatureVariations. I read the Glyphs sources and designspaces on GitHub for masters, brace (intermediate) layers and bracket (alternate) layers. Overlap use is measured as the number of glyphs whose contour count changes under `pathops.simplify`.

| Font (source) | wght masters (design values) | Intermediate wght layers | Structure swaps (rvrn) | Overlaps kept |
|---|---|---|---|---|
| Source Serif 4 ([designspace](https://github.com/adobe-fonts/source-serif/blob/main/Roman/SourceSerif4Variable-Roman.designspace)) | 3 × 3 opsz: 0, 394, 1000 | none | none | yes: x 7 contours, asterisk 5, trademark 9, yen 7 |
| Literata ([Literata.glyphs](https://github.com/googlefonts/literata)) | 200, 400, 900 × opsz 6/10/144 | none | dollar, cent, colonsign, dong, guarani, hryvnia, naira, peso, won, cedi, dcroat, hbar, thorn.sc at wght ≥ 600 | **no**: 1 of 1,704 glyphs |
| Newsreader ([designspace](https://github.com/productiontype/Newsreader)) | 100, 400, 900 × opsz 6/16/72 | none | dollar, colonmonetary, naira, won, peso, guarani when opsz 6 to 15 and wght > 400 | yes |
| Crimson Pro ([CrimsonPro.glyphs](https://github.com/Fonthausen/CrimsonPro)) | **4: 0, 211, 509 (SemiBold), 1000** | a full SemiBold master (gvar peak 0.378 on 821 glyphs) | cent, colonsign, dollar, guarani ≥ 700; naira, won ≥ 501 | yes: 169 of 829 |
| Lora ([Lora.glyphs](https://github.com/cyrealtype/Lora-Cyrillic)) | 400, 700 | none | Dje-cy ≥ 600 | yes: 132 of 875 |
| STIX Two Text ([designspace](https://github.com/stipub/stixfonts)) | 92, 149 (stems) | none | none | yes: x 3, dagger 3, daggerdbl 5 |
| Merriweather ([Merriweather.glyphs](https://github.com/SorkinType/Merriweather)) | **169 and 350 only (Light, Black)**; Regular is an instance | none | none | n/a (statics checked) |
| EB Garamond ([EBGaramond.glyphs](https://github.com/octaviopardo/EBGaramond12)) | Regular, Bold | none | none | not checked |
| Noto Serif ([glyphspackage](https://github.com/notofonts/latin-greek-cyrillic)) | 28, 94, 194 × 2 widths | none found by code search | none found | not checked |
| Playfair 2 ([glyphspackage](https://github.com/clauseggers/Playfair)) | 360, 900 × opsz × wdth | none on wght; brace layers on its serif corner components (on opsz, by my reading) | many: cent, dollar, Euro, sterling, yen, g, h, k, m, n, v, w, x, y, f-ligatures, cedilla at small opsz or narrow heavy | yes: asterisk 6, dagger 3, x 3 |
| Fraunces ([designspace](https://github.com/undercasetype/Fraunces)) | 100, 900 × opsz × SOFT | none | h, m, n, s, ampersand (WONK and small opsz, not weight) | yes |
| Serrif (licensed, measured only) | wght 100 to 900, avar 0.4 → 0.439 | none | none | yes: dagger 4, won 6, x 3 |

Five findings follow.

1. **Glyph-level intermediate layers are not how production serifs solve weight problems.** Not one of the twelve fonts has a wght brace layer on an individual glyph. The one font with an intermediate wght position, Crimson Pro, has a full SemiBold master. Glyphs' own tutorials do offer brace layers for e, s and a, whose horizontals thin too early ([Intermediate layers](https://glyphsapp.com/learn/intermediate-layers); [the brace trick](https://glyphsapp.com/learn/additional-masters-for-individual-glyphs-the-brace-trick)) (verified). They also say a real master is better when "almost all glyphs" need one (verified).
2. **Structure changes go through rvrn, and the glyphs are almost always currency signs** whose bar runs through a bowl (dollar, cent, won, naira, colon sign, guarani, peso), plus the barred lowercase (hbar, dcroat, thorn.sc, Dje). Switch points sit around SemiBold to Bold: design 600 in Literata, 700 and 501 in Crimson Pro, 600 in Lora. Glyphs gives the dollar example: the Bold uses short stumps because there is no room for a full stroke ([Alternating glyph shapes](https://glyphsapp.com/learn/alternating-glyph-shapes)). It also advises putting the feature variations in `rlig` rather than `rvrn`, because some apps fail on substituted glyphs under rvrn ([Switching shapes](https://glyphsapp.com/learn/switching-shapes)) (verified). In fontTools, a designspace `<rules processing="last">` compiles to `rclt` instead of `rvrn` (verified in installed `varLib/__init__.py`).
3. **Strokes through letters, x, asterisks, daggers and trademark are built as overlapping contours.** The two diagonals of x are separate contours in STIX, Playfair and Serrif (the second split into two halves), and seven pieces in Source Serif 4. Each asterisk arm is its own contour in Source Serif 4 and Playfair. Dagger stem and bars are separate in STIX, Playfair and Serrif. Lslash, Hbar, Tbar and dcroat carry overlapping bars in Crimson Pro, Lora, Playfair and Serrif. Glyphs' developer on keeping overlaps in crossbars: "You should keep them. Otherwise the interpolation will not work well" ([Glyphs forum](https://forum.glyphsapp.com/t/should-i-remove-overlaps-for-var-fonts/16231)) (verified). Literata is the exception, and it pays with 23 rvrn swaps. **(inference)**
4. **Overlap rendering:** the reported artifacts come from overlaps along a smooth *outer* edge, where anti-aliasing doubles up. Overlaps whose seams cross through ink are reported as fine ([Glyphs forum](https://forum.glyphsapp.com/t/overlap-issues-in-variable-font/10136); [googlefonts-discuss](https://groups.google.com/g/googlefonts-discuss/c/GFeqmTWKez8)) (practitioner reports, not spec). fontTools sets `OVERLAP_SIMPLE` when instancing statics, for Apple rasterizers ([instancer](https://github.com/fonttools/fonttools/blob/main/Lib/fontTools/varLib/instancer/__init__.py)) (verified). None of the four VFs I checked sets the flag in the VF itself.
5. **Merriweather interpolates its Regular from Light and Black**, and Crimson Pro adds a SemiBold. Two-plus masters are not a fixed number. Masters go where the shapes stop interpolating.

## 3. Optical balance across weight: what changes slower than the stem

The earlier report gives the Bold ratios for letters. The new measurements here cover the glyphs that fail. For each part, the **weight exponent k** is defined by part(w)/part(400) = (stem(w)/stem(400))^k, where stem is the lowercase n stem. k = 1 means the part follows the stem; k = 0 means it holds. Light is wght 300 for the variable fonts, or the Light static (local measurement, scanline cuts at 1000 UPM).

| Part | Light-side k, median (range) | Bold-side k, median (range) | Fonts |
|---|---|---|---|
| figure one, full size | 1.02 (0.88 to 1.08) | 0.98 (0.93 to 1.03) | 5 / 7 |
| **superior one stem** | **0.79** (0.77 to 1.01) | **0.86** (0.72 to 1.09) | 5 / 7 |
| **o hairline** | **0.44** (0.12 to 0.62) | **0.52** (0.13 to 1.22, Lora high) | 5 / 7 |
| dagger stem | 0.71 (0.26 to 0.86) | 0.90 (0.45 to 1.59) | 5 / 7 |
| **asterisk arm** | **0.71** (0.18 to 0.87) | **0.63** (0.36 to 0.91) | 5 / 7 |
| trademark T stem | 0.60 (0.32 to 0.89) | 0.70 (0 to 1.11) | 5 / 7 |

The fonts are Crimson Pro, Literata, Serrif, Georgia Pro and Merriweather, with STIX Two and Lora added on the Bold side.

Derived from the same data:

- **Superiors carry a heavier relative stem, and the gap widens toward Bold.** Superior/full-size stem ratio, Light → Regular → Bold: Crimson Pro 0.99 → 0.95 → 0.88; Literata 0.86 → 0.85 → 0.79; Georgia Pro 0.94 → 0.88 → 0.76; Merriweather 0.88 → 0.81 → 0.78; Serrif 0.71 → 0.69 → 0.66. Microsoft's standard: "It is always necessary to adjust the weight of the scaled numeral". It suggests 63% horizontal and 60% vertical scale, and says small fraction figures' weight "should be adjusted so they do not appear too light" ([Microsoft, Figures](https://learn.microsoft.com/en-us/typography/develop/character-design-standards/figures)) (verified).
- **Ahrens' compensated-scaling formula** gives this law directly (verified, [Ahrens, MM method](https://remix-tools.com/pdf/Tim_Ahrens_MM_method.pdf)). To scale a glyph by s with stroke scaled by s^a, interpolate the masters with q = (s^(a−1) − b)/(1 − b) before scaling. Here q is the Regular's weight and b = bold stem / regular stem. Separate qₓ and q_y handle anisotropic scaling. A superior at weight w is therefore "the full-size figure at a heavier effective weight w′, scaled by s". On Area's geometric stem ladder that means **stem(w′) = stem(w)·s^(a−1)**. With s = 0.6 and a ≈ 0.6, a superior at any weight takes the full-size figure from a stem 1.23 times heavier, which gives a superior/full ratio of 0.74 (derivation). At the Light end that pushes w′ toward Regular. At the Bold end it pushes past 700, which is extrapolation. That explains why the Bold gap opens: designers stop compensating fully there.
- **The hairline thins much less than the stem toward Light.** Contrast falls toward Light. Hairline/stem goes Light → Regular → Bold as follows: Crimson Pro 0.65 → 0.59 → 0.47; Literata 0.70 → 0.63 → 0.55; Georgia Pro 0.61 → 0.41 → 0.25; Merriweather 0.64 → 0.54 → 0.45. De Groot's 1:1 in the Light and 3:1 in the Bold is the extreme form ([LucasFonts](https://lucasfonts.com/learn/interpolation-theory)) (verified earlier).
- **Floor:** in every measured Light, no stroke of a sign or small glyph is under **0.85 times the o's hairline at the same weight**. The minimum found is Literata's dagger at 0.87; Crimson Pro's dagger is at 0.96 (local measurement). That is a measured convention, not a law.
- **These are conventions.** The ranges are wide. Georgia holds signs and hairlines almost constant, while Literata lets the trademark grow faster than the stem. The medians are defensible defaults; no source states them as rules.

## 4. Alternatives to plain master interpolation, judged on soundness

| Technique | Sound for a weight axis? | Why |
|---|---|---|
| Overlapping stroke contours (every production VF above) | **Yes, best for crossings** | No welded corners, so section 1.6 does not arise. Each stroke obeys 1.1 to 1.4 alone, and the renderer does the union. |
| Feature-variation swap (rvrn / rclt / rlig) | Yes, for structure changes | Both alternates need compatible masters on their own side of the switch. The swap is instant, so place it where the two shapes look alike ([Switching shapes](https://glyphsapp.com/learn/switching-shapes)). |
| Full intermediate master (Crimson Pro) or sparse per-glyph master | Yes; corrects only the residual | It cannot fix sign-mixed inflection coefficients unless the node structure changes. It is a curvature and contrast tool. |
| Smart components / variable components ([Glyphs](https://glyphsapp.com/learn/smart-components); [VARC](https://github.com/harfbuzz/boring-expansion-spec/blob/main/VARC.md)) | Yes in source; VARC needs renderer support | The same linear maths per part, which is what Area's part constructions already are. Playfair 2's serif corner components are the closest published example. |
| Compensated scaling (RMX Scaler) | Yes, for small figures and small caps | Needs two masters with a real weight difference (verified, Glyphs forum threads cited in the earlier report). |
| Skeleton + nib (Metafont, LTTR/INK, Metapolator, Prototypo) | Sound only if the outline is re-fitted to a fixed node structure | Offsetting re-subdivides per weight (earlier report). LTTR/INK is maintained ([Glyphs news](https://glyphsapp.com/news/lttr-ink-1-0-released)). Metapolator is unreleased and inactive ([GitHub](https://github.com/metapolator/metapolator)). Prototypo closed in 2020 ([Mathey](https://mathey.notion.site/Prototypo-22a55139f0324a7eb82a67bbceaa3a58)). |
| HOI / avar2 hidden axes | Not yet | It works mathematically, but renderer support is uneven (earlier report). |
| Extrapolation (Light below 300) | No beyond about 10 to 20 units of stem | Earlier report; thin parts need the floor above. |

## 5. Apply to Area Serif

The rules are ranked by how many failures each should remove. Each is one implementable line. Where a rule sets a number, the number comes from sections 1 to 3.

1. **Build stroke-crossed glyphs as overlapping contours in every master.** Glyphs: Astroke, Estroke, astroke, cstroke, Tdiagonalstroke, won, colon sign (uni20A1), rupee, the slashed signs, x, asterisk, dagger, daggerdbl, trademark, servicemark, registered, ⌘ (uni2318). Each stroke is one closed contour produced by the existing stroke construction, so no welded corner remains. Set `public.truetype.overlap`, and remove overlaps only in static exports. Keep seams inside ink, never along an outer smooth edge. *Check:* section 1.5 split, plus union topology equal to the Regular's.
2. **Replace the 13-stop turn count with the biquadratic inflection test (1.1)** on every cubic and every master pair, and report the master pair and the coefficient that flips. A curve that fails at any t is a construction fault. Shortening handles cannot fix it; move the node or rebuild.
3. **Make x and k-type diagonal junctions overlaps too.** x has two diagonals, the second split at the crossing, with serifs on the diagonals' ends, as in STIX, Playfair and Serrif. This removes the serif-chord conflict behind x's Bold inflection.
4. **rvrn (or rclt) swap for the bar-through-bowl currency glyphs at Bold:** dollar, cent, won, naira, colon sign, guarani, peso, and Area's own dollar.ss03. The switch sits at design stem about 108 to 118 (user about 600 to 650), where references switch. The Bold alternate uses stumps. Build every composite from the alternate as well. This is the industry answer, not rule-tuning.
5. **Exclude end caps from "thin":** no thinnest cut within one stroke width of a tapered or pointed end. This should clear most of the 24 wedge-accent failures without changing a shape.
6. **Hold edge normals fixed per stroke across masters** (|Δangle| ≤ 0.5°, rule 1.3). Thickness is then linear and cannot dip below the Regular's. Where a slanted stroke must change angle, evaluate w(t) at its stationary point.
7. **Small figures (superiors, inferiors, numerators, denominators, ordinals) get their own weight law:** stem ratio = (stem(w)/78)^0.85 toward Bold and ^0.8 toward Light. Their *hairlines* use the hairline exponent (0.45 to 0.5), not the stem's. Better still, build them by Ahrens' formula from the full-size figures on the stem ladder, with s ≈ 0.6 and a ≈ 0.6. Targets: superior/full stem about 0.88 at 300, 0.85 at 400, 0.78 at 700. This should cure six and nine superior and inferior on the Light side.
8. **Signs (asterisk, dagger, trademark, section, quotes) use k ≈ 0.65:** part(w) = part(400)·(stem(w)/78)^0.65 on both sides. This replaces the Light-side 1.72·f thinning, which makes them thin about as fast as a stem (k ≈ 0.77).
9. **A floor at every weight: no stroke under 0.85 × the o's hairline at that weight** (about 30 units at 300 if the Light hairline is 35). Assert it per stop. It replaces the tip-proportional floor for glyphs that have no serif tip.
10. **Run the counter-area check (1.4):** A_A, M and A_B with the same sign for every hole contour in every master pair. Apply it to e, a, g, &, @, registered and the small figures.
11. **Use the exact crossing check (1.5)** within each contour, reporting the first t of contact. It replaces the 13-stop crossing count, and it catches Ghook and Nhookleft-type hooks whose curl touches the stem between stops.
12. **The sparse 550 master must keep each smooth node's tangent direction** (1.2 across pairs), and each check runs on (Regular, 550) and (550, Bold), not on (Regular, Bold).
13. **Intermediate masters only for curvature and contrast residue** (g's neck, x's thick stroke before rule 3). Never use one for a glyph whose inflection coefficients mix signs: that needs rule 2's node move, an overlap rebuild or a swap.
14. **For the fallbacks with no real Bold or Light** (Astroke, dagger, uni20A1, uni2318, the diagonal arrows, commaturnedabovecomb), the industry answer is rule 1: compose from engine-built strokes. A glyph that still cannot be built gets an rvrn alternate. No reference ships a glyph frozen at Regular.

**Which answer applies to which class.** Overlap rebuild: strokes through letters, x and diagonal crossings, asterisk, daggers, trademark and servicemark, registered, ⌘. rvrn swap: bar-through-bowl currency and barred lowercase if the bar must break. Intermediate master: dense letters (e, a, g, s) and residual curvature only. New weight law instead of more tuning: superiors, inferiors, fractions, ordinals, signs.

## 6. What I could not verify

- I did not read the cu2qu source to confirm that same-angle smooth nodes stay kink-free after quadratic conversion (still the earlier report's inference).
- Current CoreText, DirectWrite and FreeType handling of interior overlaps in VFs comes only from practitioner reports, not tests.
- Playfair 2's brace layers: I read them as opsz positions from the coordinate values, without confirming the axis order in its fontinfo.
- Noto Serif's and EB Garamond's compiled VFs were not scanned; only their sources were.
- The exponents in section 3 come from 5 to 7 fonts, measured by single scanline cuts. The dagger and trademark cuts may hit a taper in some designs (STIX's Regular dagger, 23.7, looks like such a hit).
- I found no source that states a numeric hairline floor or a sign weight law. Both are measured conventions.
- The Ahrens formula is verified. Applying it to Area's three-master, geometric-ladder axis is derivation.
- I did not inspect bold.py's per-glyph handling beyond `vector`, `LIGHT_THIN` and `axis_map`, so how each failure maps to a rule is inferred from the audit output and the 0.79/0.80 notes.
