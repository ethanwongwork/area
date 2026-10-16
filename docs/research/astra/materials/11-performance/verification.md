# Verification record

Checked 2026-10-09. This record describes what was observed, not a cross-browser conformance certificate.

## Fixture rendering and execution

The native Microsoft Edge application and native Safari application opened separate temporary tabs at the loopback fixture URL. Edge is the installed Chromium browser; Google Chrome was not present at the standard `/Applications/Google Chrome.app` location. Safari was available and launched normally. No browser/OS preference, product theme or signed-in product data was changed.

In both applications, visual inspection of the page’s explicit Preview states showed:

- 64 blurred panes over patterned/text-bearing rows, with sharp overlay labels and blurred underlying content inside each pane;
- displaced owned SVG grid/circle artwork, rather than a claim to refract arbitrary HTML;
- live noise texture on row bodies, with readable text on its separate foreground layer;
- colored gradient rings with an open center, rather than a filled masking fallback.

After timing, the static inspector also confirmed the reused SVG-image and generated raster grain recipes visibly render in Safari.

These were rendering checks only. No numbers were measured from the images. Screenshots were inspected transiently through the native UI tool and not committed, because browser chrome can contain unrelated personal context. The fixed CSS geometry and stress values are authored in the fixture source, and the timing values come from the saved aggregates.

During measured windows, no screenshot loop or DevTools recording was running. The harness itself updates a short status line at case boundaries and saves aggregates between trials. Other applications and browser tabs remained open. This is a real local desktop measurement with recorded limitations, not an isolated lab benchmark.

## Checks

The final analyzer verifies every expected case/repetition pair, complete runs, fixture SHA-256 hashes, valid calibration, sample duration/count, generated tables and file sizes. Excluded focus/visibility/resize/abort trials remain in each evidence file, while the summary reports usable counts and paired-baseline counts separately. All source links to Area remain pinned to the stated main commit; inherited research links pin the research input.

The results page is a read-only viewer over `summary.json`; it does not change production settings or re-run timing. Its filters are checked after recording, so exercising the viewer cannot contaminate measured cases. No production tests/builds were run because no production code changed.

## Explicit gaps

This run does not provide native scrolling traces, GPU rendering/presentation timing, an INP result, energy or memory accounting, cold-mount cost, minimum-device coverage, mobile/Firefox testing, or accessibility certification. Cached SVG-image and raster-grain inputs use different pixels; they compare the provided recipes, not a rigorously identical-texture implementation. Static image decode success is not separately logged by the harness. Timing conclusions must remain scoped to the actual recipes and machine.

Reduced-motion is recorded as off by the run environments. OS reduced-transparency, forced colors, assistive technology and other preference behavior belong to the existing accessibility research; no performance result weakens their required fallback. Any production adoption needs those checks as well as performance measurement on the actual family/context composition.
