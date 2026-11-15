// Focus rings (plan A6.1, A6.3; docs/CONTRAST.md, Focus). Fixture: fixtures/focus.jsx. Each control is focused by
// the keyboard (Tab, so :focus-visible holds), then its ring's computed colour and geometry are read with what it
// touches on each side: the ground behind the control, its edge or its fill. A ring must be drawn and clear 3:1 against
// both sides, at every Focus ring option, light and dark, at Selection Neutral (the shipped default, where the ring is a
// solid Button's own colour) and Accent, and at Contrast More, where every ring is 3px and off by the gap.
import assert from "node:assert/strict";
import { behaviour, must } from "../suite.mjs";

const RINGS = ["hug", "gap", "halo", "inset", "bold"];
const THEMES = ["light", "dark"];
// What carries each control's ring: the focused element itself, its field shell, or a part's ::before.
const CONTROLS = {
  "solid Button": { focus: "#solid" },
  "soft Button": { focus: "#soft" },
  "outline Button": { focus: "#outline" },
  "ghost Button": { focus: "#ghost" },
  "danger solid Button": { focus: "#danger" },
  "Input": { focus: "input#input, #input input", ring: ".area-input" },
  "Checkbox": { focus: "#checkbox, #checkbox input" },
  "checked Checkbox": { focus: "#checked, #checked input" },
  "Tab": { focus: "#tabs [role=tab][aria-selected=true], #tabs [role=tab]:first-child", pseudo: "::before" },
};

// Runs in the page: the ring and both of its sides as opaque colours, and their contrasts.
function measure(focusSel, ringSel, pseudo) {
  const canvas = document.createElement("canvas"); canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const rgba = css => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = "#000"; ctx.fillStyle = css; ctx.fillRect(0, 0, 1, 1); const d = ctx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const over = (top, under) => { const a = top[3]; return [0, 1, 2].map(i => top[i] * a + under[i] * (1 - a)).concat(1); };
  const ground = el => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) { const c = rgba(getComputedStyle(n).backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] === 1) break; } }
    return layers.reduceRight((acc, c) => over(c, acc), [255, 255, 255, 1]);
  };
  const lum = c => { const f = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100; };
  const focused = document.activeElement;
  const el = ringSel ? focused.closest(ringSel) : focused;
  const cs = getComputedStyle(el, pseudo || null);
  const own = getComputedStyle(el);
  const bg = ground(el.parentElement);
  const fill = over(rgba(own.backgroundColor), bg);
  const borderW = parseFloat(own.borderTopWidth) || 0;
  const border = borderW ? over(rgba(own.borderTopColor), fill) : fill;
  let ring, width, offset, kind;
  if (pseudo) { kind = "pseudo border"; ring = rgba(cs.borderTopColor); width = parseFloat(cs.borderTopWidth); offset = 1; } // a part ring off the label
  else if (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) { kind = "outline"; ring = rgba(cs.outlineColor); width = parseFloat(cs.outlineWidth); offset = parseFloat(cs.outlineOffset); }
  else { kind = "edge"; ring = rgba(own.borderTopColor); width = borderW; offset = -borderW; } // Halo: the field's edge takes the ring
  ring = over(ring, bg);
  // The ring spans [offset, offset + width] from the border edge, outward positive.
  const at = d => d >= 0 ? bg : (-d <= borderW && kind !== "edge" ? border : fill);
  const outerSide = offset + width >= 0 ? bg : at(offset + width);
  const innerSide = offset > 0 ? bg : at(offset - 0.5);
  return { kind, width, offset, ring: ring.slice(0, 3), outer: ratio(ring, outerSide), inner: ratio(ring, innerSide), id: focused.id || focused.localName };
}

async function focusBy(page, selector) {
  for (let i = 0; i < 30; i++) {
    await page.press("Tab");
    if (await page.eval(s => document.activeElement?.matches(s) ?? false, selector)) { await page.frames(); return; }
  }
  throw new Error(`Tab never reached ${selector}`);
}

const ring = async (page, { focus, ring: on = null, pseudo = null }) => {
  await focusBy(page, focus);
  return page.eval(`(${measure})(${JSON.stringify(focus)}, ${JSON.stringify(on)}, ${JSON.stringify(pseudo)})`);
};
const check = (name, m) => {
  assert.ok(m.width >= 1, `${name}: no ring (${m.kind} ${m.width}px)`);
  assert.ok(m.outer >= 3 && m.inner >= 3, `${name}: the ring (${m.kind}, ${m.width}px at ${m.offset}) touches ${m.outer}:1 outside and ${m.inner}:1 inside; it needs 3:1 on both sides`);
};

behaviour("focus", ({ it }) => {
  const scopes = [
    ...RINGS.flatMap(r => THEMES.map(t => ({ label: `${r}, ${t}`, query: `?ring=${r}&theme=${t}` }))),
    ...THEMES.map(t => ({ label: `hug, ${t}, Selection Accent`, query: `?ring=hug&theme=${t}&selection=accent` })),
    ...THEMES.map(t => ({ label: `inset, ${t}, Selection Accent`, query: `?ring=inset&theme=${t}&selection=accent` })),
  ];
  for (const { label, query } of scopes) {
    for (const [name, spec] of Object.entries(CONTROLS)) {
      it(`${label}: the ${name}'s ring is drawn and clears 3:1 on both sides`, async page => {
        const m = await ring(page, spec);
        await page.step("ring", () => check(name, m));
      }, { query });
    }
  }

  // A solid fill never takes the ring flush on its edge (A6.1): off it by the gap, or inside it in the fill's own ink.
  for (const t of THEMES) {
    it(`hug, ${t}: a solid Button's ring stands off its fill by the gap`, async page => {
      const m = await ring(page, CONTROLS["solid Button"]);
      await page.step("offset", () => assert.equal(m.offset, 2, `the ring sits at ${m.offset}`));
    }, { query: `?ring=hug&theme=${t}` });
  }

  // Contrast More (A6.3): the Bold preset's 3px, off by the gap, at every Focus ring option.
  for (const r of RINGS) for (const t of THEMES) {
    it(`${r}, ${t}, Contrast More: rings are 3px and off by the gap`, async page => {
      for (const name of ["solid Button", "soft Button", "ghost Button", "Checkbox"]) {
        const m = await ring(page, CONTROLS[name]);
        await page.step(name, () => { assert.equal(m.width, 3, `${name} ring ${m.width}px`); assert.equal(m.offset, 2, `${name} ring at ${m.offset}`); check(name, m); });
      }
    }, { query: `?ring=${r}&theme=${t}&contrast=more` });
  }

  // A Menu row's keyboard indicator is its plate alone, never a ring and a plate (DESIGN_SYSTEM.md, the focus table).
  for (const r of RINGS) {
    it(`${r}: a Menu row shows focus by its plate alone`, async page => {
      await focusBy(page, "#trigger");
      await page.press("Enter");
      await page.waitFor(() => !!document.querySelector(".area-menu__item:is(:focus, [data-highlighted])"));
      await page.frames();
      const m = await page.eval(() => {
        const row = document.querySelector(".area-menu__item:is(:focus, [data-highlighted])");
        const cs = getComputedStyle(row), next = getComputedStyle(row.nextElementSibling ?? row);
        return { outline: cs.outlineStyle === "none" ? 0 : parseFloat(cs.outlineWidth), plate: cs.backgroundColor, rest: next.backgroundColor };
      });
      await page.step("plate", () => {
        must(m.plate !== undefined, "a highlighted row");
        assert.equal(m.outline, 0, `the row draws a ${m.outline}px ring over its plate`);
        assert.notEqual(m.plate, m.rest, "the focused row's plate is the resting row's");
      });
    }, { query: `?ring=${r}` });
  }
});
