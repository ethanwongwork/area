# Astra research index

Newest first. Status is `unreviewed` until Claude reviews the topic; then `reviewed`, with
where the findings went. Archive since 2026-10-15 (see [README.md](README.md)).

Topics dated before 2026-10-07 began on separate `astra/*` and `codex/*` branches and were
moved here on 2026-10-07. Their snapshot commits are older than current `main`; their
validators compare against code that has since changed, so failures there are drift, not
broken research.

| Date | Topic | Question | Status |
| --- | --- | --- | --- |
| 2026-10-12 | [materials/21-axis-design](materials/21-axis-design/README.md) | How should Material gates, scoped controls, Surface shadow parts and portal propagation work, and which mechanisms preserve paint identity? | unreviewed |
| 2026-10-12 | [materials/20-limits-and-none](materials/20-limits-and-none/README.md) | Which material hard limits have enforcement, which restraint belongs to None, and how can None prove pixel identity across the current app gallery? | unreviewed |
| 2026-10-12 | [materials/19-corrections](materials/19-corrections/README.md) | Correct the reviewed materials series, refresh 101 contracts and 13 roles, and mark policies superseded by D1–D16. | unreviewed |
| 2026-10-11 | [materials/18-contrast-harness](materials/18-contrast-harness/README.md) | Which preset text and required-edge paints fail after composition across a continuous backdrop range, including gradient interiors and opaque fallbacks? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-10 | [materials/17-openglass](materials/17-openglass/README.md) | How do GlassLook controls reach all forty OpenGlass components, where do nesting, fallbacks and contrast break, and what does Area add? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-10 | [materials/16-specimen](materials/16-specimen/README.md) | How do Paper, Glass and Tactile render on compiled Area across mode, density and backdrop, with live controls and explicit recipe limits? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-10 | [materials/15-consistency](materials/15-consistency/README.md) | Do all fourteen materials reports agree on names, counts, controls, role budgets and fallbacks, and which source should win each conflict? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-10 | [materials/14-tooling](materials/14-tooling/README.md) | How could the gallery build and share materials, and what survives or is missing in DTCG, Tokens Studio, Figma, Tailwind and CSS exports? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-09 | [materials/13-presets](materials/13-presets/README.md) | Which eight light/dark presets cover every role, how do their controls derive from references, and which of the 25 styles combine or conflict? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-09 | [materials/12-glyphs-text](materials/12-glyphs-text/README.md) | Which glyph and text materials preserve Area's stroked geometry, need semantic parts or filled variants, and remain suitable for review at 12–16px? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-09 | [materials/11-performance](materials/11-performance/README.md) | What do local Chromium and Safari measurements show for blur, layered shadows, refraction, grain and gradient strokes, and what budgets fit each role? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-09 | [materials/10-states](materials/10-states/README.md) | How do all 25 styles express seven interaction states with fixed hover ink, independent required cues, motion and reduced-motion fallbacks? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-09 | [materials/09-dark-density](materials/09-dark-density/README.md) | How do all 25 styles translate to near-black, compact and sm/md/lg, with concentric rims at every radius setting? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-08 | [materials/08-accessibility](materials/08-accessibility/README.md) | How do all 25 styles retain contrast and focus across hostile backdrops and preferences, with per-role fallbacks and additive tests? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-08 | [materials/07-controls](materials/07-controls/README.md) | Which global and per-role controls fit the layer model, and should Material sit beside Surface or extend it? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-08 | [materials/06-references](materials/06-references/README.md) | Which public sources publish exact material-layer values for all 25 styles, and how do they cover the 17 board items? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-08 | [materials/05-absorption](materials/05-absorption/README.md) | How do all 25 styles paint 12 roles, with absorption caps, family context guards and nesting rules? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-08 | [materials/04-role-map](materials/04-role-map/README.md) | Which material role and relative depth belong to every visual part of all 78 Area contracts, including shared compositions? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-08 | [materials/03-css-cookbook](materials/03-css-cookbook/README.md) | How can every material layer be rendered in CSS/SVG, with browser fallbacks and safe Area-token derivation? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-08 | [materials/02-prior-art](materials/02-prior-art/README.md) | Which systems expose shared materials and optical controls, and does open-source prior art already exist? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-07 | [materials/01-taxonomy](materials/01-taxonomy/README.md) | What are the requested styles made of, and which shared layer model should later materials tasks use? | reviewed 2026-10-11 ([review](materials/REVIEW.md)) |
| 2026-10-07 | [unverified-inventory](unverified-inventory/README.md) | What do all 68 Unverified paragraphs require, where can they be checked, and what are the exact steps? | unreviewed |
| 2026-10-07 | [date-picker-survey](date-picker-survey/README.md) | How do ten libraries compose date fields and pickers, with pinned geometry, keyboard, ARIA and Calendar reuse? | unreviewed |
| 2026-10-07 | [drift recheck](drift/2026-10-07.md) | Which of D01–D40 are fixed, open or changed, and what new drift exists in changed families and corners? | unreviewed |
| 2026-10-07 | [materials](materials/README.md) | Brief for the materials series (owner goal, constraints, reference board); reports follow in its subfolders. [Claude review and decisions](materials/REVIEW.md) | brief |
| 2026-10-07 | [phase-status](phase-status/README.md) | Where do all 65 families stand in the four approval phases, and what remains unverified? | unreviewed |
| 2026-10-02 | [drift](drift/2026-10-02.md) | Where do each family's spec, CSS, manifest, React props and demo disagree? (40 mismatches in 64 families) | unreviewed |
| 2026-10-02 | [checks](checks/2026-10-02.md) | Do all ten repository checks pass twice from a clean checkout? | unreviewed |
| 2026-09-29 | [contracts](contracts/README.md) | Framework-neutral contract for every manifest family (69 families, 101 axes, 277 values) | unreviewed |
| 2026-09-29 | [variant-independence](variant-independence/README.md) | Which variant values depend on other values or parts? | unreviewed |
| 2026-09-29 | [option-schema](option-schema/README.md) | Which literal visual values do components use, and which could become Foundation options? | unreviewed |
| 2026-09-28 | [library-range](library-range/README-1.md) | What range of variants do outside libraries ship for each family? Runs [1](library-range/README-1.md), [2](library-range/README-2.md), [3](library-range/README-3.md) | unreviewed |
| 2026-09-28 | [patterns](patterns/README.md) | Catalogue of 52 screen patterns across 18 categories, mapped to Area parts | unreviewed |
| 2026-09-28 | [landscape](landscape/README.md) | How 34 design-system tools compare | unreviewed |
| 2026-09-28 | [import-survey](import-survey/README.md) | How 19 design systems structure tokens and components, for an importer | unreviewed |
