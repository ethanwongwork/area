import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { VideoPlayer } from "../dist/modules/index.js";

test("the remaining time is spoken as text, not as an aria-label on a span with no role", () => {
  const html = renderToString(h(VideoPlayer, { src: "v.mp4", label: "Demo", autoPlay: true, muted: true }));
  assert.doesNotMatch(html, /class="area-video-player__clock" aria-label=/);
  assert.match(html, /<span class="area-sr-only">[^<]*remaining<\/span>/);
});
