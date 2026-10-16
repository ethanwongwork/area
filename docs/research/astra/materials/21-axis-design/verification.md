# Executed verification and remaining boundary

Source: Area **4ea50618cf19e8737b607c9f983f64dd310d921d**. Run date 2026-10-12. Engine **Chromium 155.0.4283.45** via installed Edge, headless macOS, viewport 1200×1100, DPR 1. Full environment, input hashes and computed results are in [browser-results.json](browser-results.json). The script serves only this folder and closes its own browser/server.

## Results

- **8 nested cases:** None → Tactile → Glass → explicit None, each in light and dark. Expected gate vectors, host filter none, optical-layer opacity and computed paint matched the same scope with its ancestor preset attributes removed.
- **8 successful gate-off comparisons:** alpha-gated shadow, every-stop-alpha gradient, isolated filter paint with opacity zero, and isolated backdrop-filter paint with opacity zero; each in light/dark. Each off state has **0 changed pixels** versus literal removal. Every on state differs, so these are not blank fixtures.
- **8 deliberate failing cases:** zeroing only inset blur, gradient angle, brightness, or blur on the content element. They remain distinguishable from literal off. In particular `blur(0px)` changes **50 light / 57 dark pixels** in this fixture; that is a local rendering observation, not a universal pixel count or root-cause diagnosis.
- **64 Surface comparisons:** every 32 original/split recipe pair in both modes has **0 changed pixels**, and computed box-shadow strings agree. Token-valued spread in Tooltip/Toolbar stays a length, not a color.
- The pinned registry accepts the proposed Material plus Surface namespace additions and rejects an intentionally broad shadow namespace. The data resolver checks control inheritance, preset resets, serialized remount and invalid values. It is not React runtime or a real portal.

Inspected the rendered full demo screenshot for nested scope labels, reset appearance and comparison controls. Raw screenshots are ignored under `.capture/`; no personal content or product captures are included.

## Interpretation

This is a bounded mechanism proof on authored diagnostic boxes. Colors/dimensions in demo.css are fixture inputs, not adopted Area recipes; the prototype imports no production CSS and does not claim to render calibrated Glass/Tactile/Soft. The separate Surface fixture uses the actual pinned shadow strings and a diagnostic canonical ground/edge.

A zero-alpha computed shadow or gradient can remain in the property list without drawing. Likewise, an opacity-zero filtered pseudo can retain filter/compositor state. Do not turn pixel absence into a performance claim. For real None, leave the content's filter/stacking/geometry alone and prove any added optical wrapper is inert. Reduced-transparency and forced-colors must explicitly remove acquisition and supply the approved opaque fallback; this prototype does not implement those production policies.

Not executed: full gallery, production package build/test suite, React portal integration, native Windows forced colors, assistive technology, Safari, Firefox, full role/preset contrast or performance budgets. These remain implementation acceptance work. Current tests were not weakened or changed.
