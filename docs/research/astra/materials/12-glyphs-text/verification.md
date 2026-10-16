# Verification — 2026-10-09

## Executed

- Fetched origin; read the research guide/brief on research commit `35c0986eeccffbcd756ec552661fb804cf03bf7b`. Read current Area sources through `git show 831f819e5b55b5ca0033fd628eeb9f95ccb92df7:<path>` so the older research checkout's production files could not substitute for the intended snapshot.
- Extracted Search and Calendar **outline** geometry from the pinned generated renderer with `build-fixtures.py`. It changes JSX attributes to SVG/CSS syntax, expresses the same weight/dot curve through a local variable, and adds explicit research-only `data-ink`/`data-part` labels. It does not redraw coordinates or run the production icon generator. The filled capability analysis is source inspection, not a filled-demo rendering claim.
- Opened `http://127.0.0.1:8767/` in the Codex in-app browser. Page-reported user agent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36`; **DPR 2**. The user agent is a browser report, not independently verified installed OS/version. Screenshots were inspected at the existing 1280 × 720 viewport; no viewport override or device emulation.
- Visually inspected all eight rows across the light and near-black views. The colored alpha halos, text shadows and gradient ink render; the stronger text glow visibly surrounds the original letterforms. Shallow relief on the thin icons reads as edge doubling rather than a broad beveled face. This is an agent visual observation of the authored examples, not a measured recognition/legibility outcome.
- Read DOM/computed paint: **8 rows, 48 glyph instances**, 53 IDs all unique. Actual SVG boxes were 12, 14 and 16 CSS px. Drawing-unit stroke widths were approximately 1.31786, 1.21073 and 1.125px respectively; after the viewBox scale these match the physical widths described in `legibility.md`. Gradient strokes resolved to the instance-local URL with an opaque fallback color.
- Activated **Plain fallback** in the dark view. `aria-pressed` became true; every glyph's computed filter became `none`, every word's text-shadow became `none`, gradient strokes/fills became the original currentColor, open fills stayed `none`, and dates remained filled marks. This exercises the authored reset, not OS forced colors.
- JavaScript syntax check passed. Fixture regeneration is deterministic. Repository/source links and line ranges, local Markdown targets, Python syntax, scope and per-file size were checked before commit. No production tests were altered or run: this task changes research and its standalone fixture only.

No images of the owner's applications or personal content were saved. The comparison screenshots were inspected through the tool, not used to estimate CSS values. No raw browser logs are committed.

## Not executed

- Actual Geist-font comparisons, real 1× display review, Safari/Firefox execution of this lab, native Windows forced colors, OS accessibility preference execution, print inspection and assistive-technology testing.
- True inset/lighting SVG filters, broad filled-material faces, external-image integration, dynamic backdrops, nested themes and performance measurements of these exact effects.
- Color-conformance certification of the experimental literals, user recognition testing or owner approval. Plain and material examples are study stimuli, not shipping presets. Task 11 performance numbers do not measure this lab.

The check procedure in [legibility.md](legibility.md#exact-checks-before-accepting-a-preset) makes these acceptance gaps explicit. No floor or approval status is weakened to accommodate them.

## Re-run

From any directory, run the scripts by their path. They resolve their location and repository root themselves:

```sh
python3 /path/to/area/docs/research/astra/materials/12-glyphs-text/build-fixtures.py
python3 /path/to/area/docs/research/astra/materials/12-glyphs-text/serve.py
```

Open `http://127.0.0.1:8767/`. Compare the labeled sizes, switch Theme, then toggle Plain fallback. The page prints its actual user agent and DPR. All fixture/CSS/JS files are local; no font download, sign-in, product setting change or production build is required. If port 8767 is occupied, change the research server's port and record it. Stop the server after inspection.
