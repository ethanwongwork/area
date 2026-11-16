// Disabled, read-only and inactive (plan B7.8, B7.9, B7.10, B7.12). Fixture: fixtures/states.jsx.
// Read-only: a control is reached by Tab, says it is read-only in the accessibility tree, keeps its value and can't be
// changed by keys or the pointer. Disabled: Tab skips it. Paint: on every ground, theme, Layer contrast, Edge contrast
// and Fields stroke extreme, a read-only value keeps the text target and its fill differs from the editable one, disabled
// words stay visible, a toned disabled Button is painted neutral, an inactive row's reason keeps 4.5:1 and is never
// stronger than its label, a disabled setting's description keeps 4.5:1, and a checked read-only card keeps its edge.
import assert from "node:assert/strict";
import { behaviour, must } from "../suite.mjs";

const FAMILIES = ["input", "textarea", "number-field", "otp-field", "tag-picker", "custom-select", "date-picker", "time-field",
  "switch", "checkbox", "checkbox-card", "radio-group"];
const scope = slug => `[data-family="${slug}"]`;

// What a family shows and announces, and what it submits.
const shown = (page, slug) => page.eval(s => {
  const root = document.querySelector(s);
  const parts = [...root.querySelectorAll("input, textarea, select")].map(e => `${e.name}:${e.type}:${e.type === "checkbox" || e.type === "radio" ? e.checked : e.value}`);
  for (const e of root.querySelectorAll("[aria-checked], [aria-valuenow], [aria-valuetext]")) parts.push(["aria-checked", "aria-valuenow", "aria-valuetext"].map(a => e.getAttribute(a)).join("/"));
  parts.push(root.innerText.replace(/\s+/g, " ").trim());
  parts.push(JSON.stringify([...new FormData(document.querySelector("#f"))].filter(([k]) => k === root.dataset.family)));
  return parts.join(" | ");
}, scope(slug));
const inside = (page, slug) => page.eval(s => document.querySelector(s).contains(document.activeElement), scope(slug));
// Whether the focused node, or a group it sits in, is read-only to assistive technology: the accessibility tree's
// readonly property, which Chromium computes for text boxes only, or else the aria-readonly / native readonly it maps
// from (spin buttons, comboboxes, switches, checkboxes and radios carry the attribute; their tree drops it).
async function announcesReadOnly(page) {
  const attribute = await page.eval(() => { for (let e = document.activeElement; e && !e.dataset?.family; e = e.parentElement) if (e.getAttribute("aria-readonly") === "true" || e.readOnly === true) return true; return false; });
  const { result } = await page.send("Runtime.evaluate", { expression: "document.activeElement" });
  const { node } = await page.send("DOM.describeNode", { objectId: result.objectId });
  const { nodes } = await page.send("Accessibility.getPartialAXTree", { backendNodeId: node.backendNodeId, fetchRelatives: true });
  await page.send("Runtime.releaseObject", { objectId: result.objectId });
  const focused = nodes.find(n => n.backendDOMNodeId === node.backendNodeId) ?? nodes[0];
  const ancestors = []; for (let n = focused; n; n = nodes.find(m => m.nodeId === n.parentId)) ancestors.push(n);
  return attribute || ancestors.slice(0, 4).some(n => n.properties?.some(p => p.name === "readonly" && p.value.value === true));
}

// The paint grid, measured in the page: every colour converted through a canvas, the fills under an element composited
// from its ancestors, an opacity group applied over what is under it. WCAG ratios.
const MEASURE = () => {
  const cv = document.createElement("canvas"); cv.width = cv.height = 1; const cx = cv.getContext("2d", { willReadFrequently: true });
  const rgba = c => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = "rgba(0, 0, 0, 0)"; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const over = (top, under) => [0, 1, 2].map(i => top[i] * top[3] + under[i] * (1 - top[3])).concat(1);
  const lum = c => { const f = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const paint = (el, prop = "color") => {
    const chain = []; for (let e = el; e; e = e.parentElement) chain.unshift(e);
    let bg = [255, 255, 255, 1], under = null, alpha = 1;
    for (const e of chain) {
      const s = getComputedStyle(e);
      if (parseFloat(s.opacity) < 1) { under ??= bg; alpha *= parseFloat(s.opacity); }
      const c = rgba(s.backgroundColor); if (c[3] > 0) bg = over(c, bg);
    }
    let fg = over(rgba(getComputedStyle(el)[prop]), bg);
    if (under) { const mix = p => [0, 1, 2].map(i => p[i] * alpha + under[i] * (1 - alpha)).concat(1); fg = mix(fg); bg = mix(bg); }
    return { fg, bg };
  };
  const out = {};
  for (const section of document.querySelectorAll("[data-ground]")) {
    const g = section.dataset.ground, cell = name => section.querySelector(`[data-cell="${name}"]`);
    const ground = paint(section).bg;
    const field = (name) => { const shell = cell(name).querySelector(".area-input"); const value = shell.querySelector("input"); const p = paint(value); return { text: ratio(p.fg, p.bg), fill: paint(shell).bg }; };
    const r = out[g] = { buttons: {} };
    for (const v of ["outline", "soft"]) {
      const edit = field(`field-${v}-edit`), ro = field(`field-${v}-read-only`), off = field(`field-${v}-disabled`);
      r[`${v}ReadOnlyText`] = ro.text; r[`${v}ReadOnlyCue`] = ratio(ro.fill, edit.fill); r[`${v}DisabledText`] = off.text;
      r[`${v}DisabledFill`] = ratio(off.fill, ground);
    }
    const ghost = n => paint(cell(n).querySelector(".area-custom-select__trigger")).bg;
    r.ghostReadOnlyCue = ratio(ghost("picker-ghost-read-only"), ghost("picker-ghost-edit"));
    for (const b of section.querySelectorAll('[data-cell^="button-"]')) {
      const btn = b.querySelector(".area-button"), p = paint(btn), s = getComputedStyle(btn), c = rgba(s.backgroundColor);
      const spread = c[3] > 0 ? Math.max(...c.slice(0, 3)) - Math.min(...c.slice(0, 3)) : 0;
      const ink = rgba(s.color), inkSpread = Math.max(...ink.slice(0, 3)) - Math.min(...ink.slice(0, 3));
      r.buttons[b.dataset.cell.slice(7)] = { text: ratio(p.fg, p.bg), opacity: parseFloat(s.opacity), spread, inkSpread };
    }
    const row = cell("menu-inactive").querySelector(".area-menu__item");
    const title = paint(row.querySelector(".area-menu__text")), note = paint(row.querySelector(".area-menu__description"));
    r.inactiveTitle = ratio(title.fg, title.bg); r.inactiveNote = ratio(note.fg, note.bg);
    const desc = paint(cell("setting-disabled").querySelector(".area-setting-row__description"));
    const label = paint(cell("setting-disabled").querySelector(".area-setting-row__label"));
    r.settingDescription = ratio(desc.fg, desc.bg); r.settingLabel = ratio(label.fg, label.bg);
    const card = cell("checkbox-card-read-only").querySelector(".area-checkbox");
    const probe = document.createElement("span"); probe.style.color = "var(--area-stroke-selected)"; card.append(probe);
    r.cardEdgeKept = rgba(getComputedStyle(card).borderTopColor).join() === rgba(getComputedStyle(probe).color).join(); probe.remove();
  }
  return out;
};

// The settings each paint page sweeps: themes, Layer contrast and Edge contrast at their extremes, Fields stroke at 0
// and its maximum, Corner, and the tone settings and accents (for B7.9's toned Buttons).
const COMBOS = [
  ...["light", "dark"].flatMap(theme => [
    { theme, "layers-light": "0", "layers-dark": "0", stroke: "0", "stroke-fields": "0", radius: "0" },
    { theme, "layers-light": "100", "layers-dark": "100", stroke: "8", "stroke-fields": "8", radius: "pill" },
    { theme },
    { theme, "tone-contrast": "2.5", "tone-tint": "0", accent: "yellow", action: "accent" },
    { theme, "tone-contrast": "4.5", "tone-tint": "160", accent: "red", action: "accent" },
    { theme, accent: "green", action: "accent", contrast: "more" },
  ]),
];
const DECLARED = ["page", "raised", "recessed", "float", "card", "well"];
const qs = combo => "?mode=paint&" + new URLSearchParams(combo).toString();
const lowest = {};
const note = (key, value, where) => { if (!(key in lowest) || value < lowest[key].value) lowest[key] = { value: +value.toFixed(2), where }; };

behaviour("states", ({ it }) => {
  for (const slug of FAMILIES) {
    it(`${slug}: read-only is reached by Tab and says it is read-only`, async page => {
      await page.eval(id => document.getElementById(id).focus(), `before-${slug}`);
      await page.press("Tab");
      await page.step("focus is in the control", async () => assert.equal(await inside(page, slug), true, JSON.stringify(await page.active())));
      await page.step("the accessibility tree says read-only", async () => assert.equal(await announcesReadOnly(page), true));
    }, { query: "?mode=read-only", fresh: false });

    it(`${slug}: read-only keeps its value: keys and the pointer change nothing`, async page => {
      const before = await shown(page, slug);
      await page.eval(id => document.getElementById(id).focus(), `before-${slug}`);
      await page.press("Tab");
      must(await inside(page, slug), `${slug} took focus`);
      for (const key of ["x", "ArrowUp", "ArrowDown", "ArrowRight", " ", "Enter", "Backspace", "Delete", "Escape"]) await page.press(key);
      await page.settle();
      const box = await page.eval(s => { const el = document.querySelector(s).firstElementChild; el.scrollIntoView({ block: "center" }); const b = el.getBoundingClientRect(); return { x: b.x + Math.min(b.width / 2, 40), y: b.y + b.height / 2 }; }, scope(slug));
      await page.click(box); await page.settle(); await page.press("Escape"); await page.settle();
      await page.step("what it shows, announces and submits is unchanged", async () => assert.equal(await shown(page, slug), before));
    }, { query: "?mode=read-only" });

    it(`${slug}: disabled is skipped by Tab`, async page => {
      await page.eval(id => document.getElementById(id).focus(), `before-${slug}`);
      await page.press("Tab");
      await page.step("Tab lands after it", async () => assert.equal((await page.active())?.id, `after-${slug}`));
    }, { query: "?mode=disabled", fresh: false });
  }

  for (const combo of COMBOS) {
    const name = Object.entries(combo).map(([k, v]) => `${k} ${v}`).join(", ");
    it(`paint on every ground: ${name}`, async page => {
      await page.settle();
      const grounds = await page.eval(MEASURE);
      for (const [ground, r] of Object.entries(grounds)) {
        const where = `${ground}, ${name}`;
        for (const v of ["outline", "soft"]) {
          assert.ok(r[`${v}ReadOnlyText`] >= 4.5, `${v} read-only value ${r[`${v}ReadOnlyText`].toFixed(2)}:1 at ${where}`);
          assert.ok(r[`${v}ReadOnlyCue`] > 1.02, `${v} read-only fill is the editable fill (${r[`${v}ReadOnlyCue`].toFixed(3)}) at ${where}`);
          assert.ok(r[`${v}DisabledText`] >= 1.5, `${v} disabled value ${r[`${v}DisabledText`].toFixed(2)}:1, not visible, at ${where}`);
          note(`${v} read-only value`, r[`${v}ReadOnlyText`], where); note(`${v} read-only cue`, r[`${v}ReadOnlyCue`], where);
          note(`${v} disabled value`, r[`${v}DisabledText`], where); note(`${v} disabled fill on its ground`, r[`${v}DisabledFill`], where);
        }
        // Plate, toned and solid grounds declare no control fills (layers.css), so a ghost's fill there is the page's.
        if (DECLARED.includes(ground)) {
          assert.ok(r.ghostReadOnlyCue > 1.02, `ghost read-only trigger shows no fill at ${where}`);
          note("ghost read-only cue", r.ghostReadOnlyCue, where);
        }
        for (const [key, b] of Object.entries(r.buttons)) {
          const [tone, variant] = key.split("-");
          // On a solid ground a Button takes onColor (its parent's ink); the plain variants aren't drawn for it.
          if (ground !== "solid") assert.ok(b.text >= 1.3, `disabled ${key} label ${b.text.toFixed(2)}:1 at ${where}`);
          if (ground !== "solid") note(`disabled Button label (${tone === "neutral" ? "neutral, dimmed" : "toned, repainted"})`, b.text, `${key}, ${where}`);
          if (tone !== "neutral") {
            assert.equal(b.opacity, 1, `toned ${key} dims instead of repainting at ${where}`);
            assert.ok(b.spread <= 12 && b.inkSpread <= 12, `toned ${key} keeps its hue disabled (fill spread ${b.spread}, ink ${b.inkSpread}) at ${where}`);
          } else if (!(variant === "solid" && combo.action === "accent")) assert.equal(b.opacity, 0.5, `neutral ${key} doesn't dim at ${where}`);
        }
        assert.ok(r.inactiveNote >= 4.5, `inactive row's reason ${r.inactiveNote.toFixed(2)}:1 at ${where}`);
        assert.ok(r.inactiveNote <= r.inactiveTitle + 0.01, `inactive row's reason (${r.inactiveNote.toFixed(2)}) is stronger than its label (${r.inactiveTitle.toFixed(2)}) at ${where}`);
        if (ground !== "solid") assert.ok(r.settingDescription >= 4.5, `disabled setting's description ${r.settingDescription.toFixed(2)}:1 at ${where}`);
        assert.equal(r.cardEdgeKept, true, `a checked read-only card lost its selected edge at ${where}`);
        note("inactive reason", r.inactiveNote, where); if (ground !== "solid") note("disabled setting description", r.settingDescription, where);
      }
    }, { query: qs(combo) });
  }

  it("lowest contrasts measured", () => { console.log(JSON.stringify(lowest, null, 1)); });
});
