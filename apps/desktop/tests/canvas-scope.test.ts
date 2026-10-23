// The Canvas scope (src/studio.tsx, canvasAttributes): every Inspector setting must reach the components as its
// `data-area-<axis>` attribute, or the control changes nothing on the Components tab. Easing was missed from
// 2026-10-19 to 2026-10-21: the Inspector showed it, only the Theme tab's own previews moved.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const controls = readFileSync(new URL("../src/gallery/controls.ts", import.meta.url), "utf8");
const studio = readFileSync(new URL("../src/studio.tsx", import.meta.url), "utf8");

test("canvasAttributes writes every Inspector axis but Theme", () => {
  const union = controls.match(/axis: ("theme"[^;]*?)\| DepthLever;/)?.[1];
  assert.ok(union, "GalleryControl's axis union not found");
  const axes = [...union.matchAll(/"([a-z-]+)"/g)].map(match => match[1]).filter(axis => axis !== "theme");
  const body = studio.slice(studio.indexOf("export function canvasAttributes"), studio.indexOf("\n}\n", studio.indexOf("export function canvasAttributes")));
  assert.match(body, /DEPTH_LEVER_AXES\.map\(axis => \[`data-area-\$\{axis\}`, shown\[axis\]\]\)/);
  for (const axis of axes) assert.match(body, new RegExp(`"data-area-${axis}": shown(\\.${axis.replace(/-/g, "")}|\\["${axis}"\\]|\\.${axis} )`), `${axis} is not on the Canvas scope`);
});
