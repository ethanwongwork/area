import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { VideoPlayer } from "../dist/modules/index.js";

test("the remaining time is spoken as text, not as an aria-label on a span with no role", () => {
  const html = renderToString(h(VideoPlayer, { src: "v.mp4", label: "Demo", autoPlay: true, muted: true, layout: "floating" }));
  assert.doesNotMatch(html, /class="area-video-player__clock" aria-label=/);
  assert.match(html, /<span class="area-sr-only">[^<]*remaining<\/span>/);
});

// docs/specs/video-player.md, round 56: the default bar is YouTube's: the track across the width first, then a row of glass
// pills (play; volume; the time; the rest in one pill at the end), and no fade.
test("the default bar puts the track over a row of glass pills, with no scrim", () => {
  const html = renderToString(h(VideoPlayer, { src: "v.mp4", label: "Demo", autoPlay: true, muted: true }));
  assert.match(html, /area-video-player--bar/);
  assert.doesNotMatch(html, /area-video-player__scrim/);
  const controls = html.slice(html.indexOf('class="area-video-player__controls"'));
  assert.ok(controls.indexOf('aria-label="Seek"') < controls.indexOf('area-video-player__transport'), "the track comes before the row");
  assert.equal((controls.match(/area-video-player__surface/g) || []).length, 4, "play, volume, the time and the end group each sit on glass");
  assert.match(controls, /area-video-player__group--end area-video-player__surface/);
});
