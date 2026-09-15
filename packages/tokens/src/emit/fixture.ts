/**
 * A self-contained page that exercises the axis mechanism.
 *
 * CSS is inlined rather than linked so the fixture can be opened from anywhere -- a file
 * URL, a data URL, a headless browser -- without a server. It is the artefact the
 * axis-mechanism check runs against: for every axis, flip every preset and read the
 * computed values back, including on a nested subtree that carries its own density.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { AXES } from "../axes/registry.ts";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "dist");

export function emitFixture(): string {
  const css = ["css/properties.css", "css/tokens.css", "css/axes.css"]
    .map((f) => readFileSync(join(dist, f), "utf8"))
    .join("\n");

  const axisData = JSON.stringify(
    AXES.map((a) => ({ id: a.id, attribute: `data-area-${a.id}`, presets: a.presets.map((p) => p.id) })),
  );

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Area axis fixture</title>
<style>@layer area.reset, area.tokens, area.axes, area.base, area.components, area.utilities, area.overrides;</style>
<style>
${css}
</style>
<style>
@layer area.base {
  body {
    background: var(--area-bg-page);
    color: var(--area-fg-default);
    font: var(--area-text-md-size)/var(--area-text-md-leading) var(--area-font-sans);
    margin: 0; padding: 32px; display: flex; flex-direction: column; gap: 16px; align-items: flex-start;
  }
  .probe {
    height: var(--area-control-md);
    border-radius: var(--area-radius-control);
    border: var(--area-border-width) solid var(--area-border);
    background: var(--area-bg-component);
    color: var(--area-fg-default);
    padding: 0 var(--area-gutter-md);
    display: inline-flex; align-items: center; gap: var(--area-gap-md);
    box-shadow: var(--area-shadow-2);
    transition: var(--area-transition);
  }
  .solid {
    background: var(--area-brand-solid);
    color: var(--area-fg-on-brand);
    border-color: transparent;
  }
  .panel {
    border-radius: var(--area-radius-container);
    background: var(--area-bg-surface);
    border: var(--area-border-width) solid var(--area-border-subtle);
    box-shadow: var(--area-shadow-3);
    padding: var(--area-space-12);
  }
}
</style>
</head>
<body>
  <div class="probe" id="probe">Probe</div>
  <div class="probe solid" id="solid">Solid</div>
  <div class="panel" id="panel"><div class="probe" id="inPanel">Nested in panel</div></div>
  <aside data-area-density="compact"><div class="probe" id="nested">Subtree: compact</div></aside>
<script>
window.AREA_AXES = ${axisData};

/** Read the values an axis is expected to move, for a given element. */
window.areaProbe = function (el) {
  const cs = getComputedStyle(el || document.getElementById("probe"));
  const v = (n) => cs.getPropertyValue(n).trim();
  const color = (n) => {
    const swatch = document.createElement("span");
    swatch.style.color = "var(" + n + ")";
    (el || document.getElementById("probe")).append(swatch);
    const value = getComputedStyle(swatch).color;
    swatch.remove();
    return value;
  };
  return {
    loaded: v("--area-loaded"),
    controlMd: v("--area-control-md"),
    radiusControl: v("--area-radius-control"),
    radiusContainer: v("--area-radius-container"),
    gutterMd: v("--area-gutter-md"),
    textMdSize: v("--area-text-md-size"),
    fontSans: v("--area-font-sans").slice(0, 24),
    bgPage: color("--area-bg-page"),
    fgDefault: color("--area-fg-default"),
    accentSolid: color("--area-brand-solid"),
    borderFocus: color("--area-focus-color"),
    borderWidth: v("--area-border-width"),
    shadow2: v("--area-shadow-2").slice(0, 20),
    durationBase: v("--area-duration-base"),
    height: cs.height,
    borderRadius: cs.borderRadius,
    paddingLeft: cs.paddingLeft,
    fontSize: cs.fontSize,
  };
};

/** Flip every preset of every axis and record what changed. */
window.areaSweep = function () {
  const root = document.documentElement;
  const results = {};
  for (const axis of window.AREA_AXES) {
    results[axis.id] = {};
    for (const preset of axis.presets) {
      root.setAttribute(axis.attribute, preset);
      results[axis.id][preset] = window.areaProbe();
    }
    root.removeAttribute(axis.attribute);
  }
  return results;
};
</script>
</body>
</html>
`;
}
