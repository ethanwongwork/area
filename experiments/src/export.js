// How a piece tells the exporter (scripts/export-set.mjs) to draw it.
//
//   exportable({ loop, fps, render, caption })
//
// loop     seconds in one seamless loop: the piece at `loop` is the piece at 0. 0 for a still.
// fps      the frame rate its motion is made for (8 for stop motion, 30 or 60 for smooth).
// render   (t, size) → a canvas `size` px square showing the piece at `t` seconds, the same
//          frame every time it is asked for (no randomness, no clock).
// caption  optional; the panel's caption is used when the piece shares one.
//
// The page's own view comes from its URL, so the exporter opens `?thumb&<a view's params>`
// and then asks for frames. Each piece lists its views in public/views/<slug>/views.json.
export function exportable(spec) {
  window.__export = { fps: 30, loop: 0, ...spec, ready: true };
}
