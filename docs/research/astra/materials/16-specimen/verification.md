# Verification, 2026-10-10

## Repository checks

- `npm run build` in the pinned Area main checkout: passed tokens, styles and React. The served CSS SHA-256 is recorded in README, preset data and browser evidence. No package source was edited. The primary checkout advanced during the task. A final build at `eaa9222ebf98f7c260f9e0dd448940523003d4d3` incorporated the newly added family CSS, then the all-context browser audit and previews were refreshed. The represented component, token and capture sources are unchanged from the previous research baseline.
- `npm test`: **9 files / 24,251 tests passed**. Existing suite unchanged.
- `node packages/tokens/src/contrast/report.ts`: **464 passing assertions / 0 failures across 66 themes**. Existing report unchanged. This establishes the baseline token gate, not new composed-material contrast.
- `node .../16-specimen/build.mjs --area-root /Users/ethanwong/Desktop/area --check`: exact static HTML and preset subset match their generator.
- `node .../16-specimen/check.mjs`: source records equal task 13; 288 tiles/eight contexts; 480 measured receivers; four original capture checksums; each file under 1 MB.
- `node --check .../16-specimen/specimen.js`: passed syntax check. `git diff --check`: required before commit.

## Browser procedure and observations

Tested in the Codex in-app Chromium browser. Exact user agent, DPR, date/time and capture viewport are inside each `verification.json` capture. No installed Chrome/Safari/Firefox version is inferred from the operating system.

1. Loaded the page against the compiled CSS, observed the default light/image comparison, then executed “Run specimen checks.” All eight contexts were revealed for measurement. **288 tiles, 480 receivers, no duplicate IDs, no width/height/foreground changes when plain fallback was toggled, no transmitting receiver left under fallback, and no document-width overflow.** Captured Glass Card and Tactile solid Button in both modes using the actual served `area-capture.js`. Captures are verbatim objects with verified checksums, not values estimated from screenshots.
2. Opened “Adjust material,” selected Tactile/all roles, and moved depth from its preset to 3. The solid Button's opposing inset offsets changed while the Paper/Glass Button paint and computed foregrounds stayed fixed. Set raised-control depth to 0: its relief became `none`. Reset all scopes: source values returned. This verifies global patch → role patch precedence and reset.
3. Selected Glass/all roles, moved blur to 12 and transparency to .4. The Card used `blur(12px)` and body alpha .6 while its reading island remained opaque. Reset/reload returned the source defaults. These are deliberate test interventions, **not recommended settings**.
4. Selected dark/compact/image: the md solid Button used 28px height versus 32px in default. These are actual compiled Area density settings, not CSS-transform scaling. Inspected Card/Menu comparison; saved `dark-compact.jpg`. Selected the plain scene and inspected Popover/Dialog. Returned to the image scene for the light screenshot.
5. Pressed ArrowRight on the selected Tactile Segmented item: Board became unchecked, List became checked and focused, with its sole tab stop at 0. Unchecked Switch: its native checkbox reported false. Pressed ArrowDown on the first Menu item: focus moved to Duplicate; the disabled Archive item remained excluded. All actions were local fixture interactions.
6. Observed the natural narrow viewport at **759 × 788**: one comparison column and no document-width overflow. Explicitly tested the wide **1280 × 900** branch: three material columns, readable sticky material labels, no document-width overflow in the saved audit. The temporary viewport override was reset after testing.
7. Read captured browser warnings/errors: none were reported. The page performs no external asset/account requests; the illustration is local. Saved screenshots are visual proof of the inspected layout, not measurement inputs.

The geometry check compares material-on with the lab's plain fallback, retaining fixture layout and content positioning in both states. It is not a before/after pixel diff of unmodified Area. Counts and capture checksums can be reproduced; interactive observations are documented manual browser checks. The report does not claim full WCAG contrast, cross-browser preference coverage, assistive-technology behavior or performance limits. See [limitations.md](limitations.md).
