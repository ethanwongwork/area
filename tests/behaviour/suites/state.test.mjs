// State paint behaviour (plan B7.1–B7.3, B7.11, 2026-11-14; DESIGN_SYSTEM.md, "Shared state paint"). Fixture:
// fixtures/state.jsx. Hover-revealed parts are hidden only where there is hover: the pointer shows them, keyboard focus
// shows them, and a touch screen (hover: none) shows them at rest (touch emulation), where elementFromPoint reaches them. The paint sweep
// forces :hover and :active (CSS.forcePseudoState) on plates on four grounds across the state settings, under reduced
// motion so no transition is mid-way, and asserts every press reads apart from hover and from selected.
import assert from "node:assert/strict";
import { behaviour, must } from "../suite.mjs";

const REVEALS = [
  // [host to hover, the part that is revealed, a control inside it for the keyboard]
  ["#card", "#card .area-card__overlay--reveal", "#card-action"],
  ["#message", "#message .area-message__actions", "#message-action"],
  ["#attachment", "#attachment .area-attachment__dismiss", "#attachment .area-attachment__dismiss"],
  ["#suggestions .area-prompt-suggestions__row", "#suggestions .area-prompt-suggestions__dismiss", "#suggestions .area-prompt-suggestions__dismiss button"],
  ["#tree [role='treeitem']", "#tree-action", "#tree-action"],
];
const opacity = (page, sel) => page.eval(s => +getComputedStyle(document.querySelector(s)).opacity, sel);
const media = (page, features) => page.send("Emulation.setEmulatedMedia", { features });
const still = [{ name: "prefers-reduced-motion", value: "reduce" }];

// WCAG relative luminance and contrast ratio of two composited sRGB colours.
const lum = ({ r, g, b }) => [r, g, b].map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4).reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

async function forced(page, selector, states) {
  const { root } = await page.send("DOM.getDocument", { depth: 0 });
  const { nodeId } = await page.send("DOM.querySelector", { nodeId: root.nodeId, selector });
  must(nodeId, `${selector} is on the page`);
  await page.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: states });
  await page.frames(1);
  const paint = await page.eval(s => window.__paint(s), selector);
  paint.ink = await page.eval(s => window.__ink(s), selector);
  await page.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] });
  return paint;
}

const GROUNDS = ["page", "surface", "float", "recessed"];
// The plates and the two states each must read apart: [element, state A, state B].
const PAIRS = [
  ["ghost", ["hover"], ["hover", "active"]],
  ["ghost", [], ["hover"]],
  ["ghost-on", ["hover"], ["hover", "active"]],
  ["soft-on", ["hover"], ["hover", "active"]],
  ["danger-on", ["hover"], ["hover", "active"]],
  ["solid-on", ["hover"], ["hover", "active"]],
  ["row", ["hover"], ["hover", "active"]],
  ["row-on", ["hover"], ["hover", "active"]],
];
const FILLS = [{}, { "fill-hover": 25, "fill-selected": 0, "fill-pressed": 25 }, { "fill-hover": 100, "fill-selected": 100, "fill-pressed": 100 }];
// The floor a press keeps from the state under it. Measured 2026-11-14 (docs/research/system-evaluation-2026-11-11/
// phase2/interact.md): the closest step anywhere is 1.009:1, a press at Pressed fill 25 (its faintest) on the recessed
// ground at light Layer contrast 100, where the muted ink's 4.6:1 bound (layers.css, "Pressed") leaves the press a
// quarter of a small room; at every other setting the closest is 1.044:1 (dark, a solid toggle). The faintest Pressed
// step is held to 1.008, every other to 1.02.
const FLOOR = 1.02, FLOOR_FAINTEST = 1.008;

behaviour("state", ({ it }) => {
  it("a revealed part is hidden at rest and shown under the pointer", async page => {
    for (const [host, part] of REVEALS) {
      await page.step(`${part} at rest`, async () => { await page.move(1, 1); await page.settle(); assert.equal(await opacity(page, part), 0, `${part} shows at rest`); });
      await page.step(`hover ${host}`, async () => { await page.hover(host); await page.settle(); assert.equal(await opacity(page, part), 1, `${part} stays hidden under the pointer`); });
    }
  });

  it("keyboard focus inside the host shows the revealed part at once", async page => {
    for (const [, part, control] of REVEALS) {
      await page.step(`focus ${control}`, async () => {
        await page.move(1, 1);
        await page.eval(s => document.querySelector(s).focus(), control);
        await page.frames(2);
        must(await page.eval(s => document.activeElement === document.querySelector(s), control), `${control} took focus`);
        assert.equal(await opacity(page, part), 1, `${part} stays hidden while focus is inside`);
      });
    }
  });

  it("a touch screen shows every revealed part at rest, reachable without hover", async page => {
    // Touch emulation is what makes the page's primary pointer coarse and unable to hover ((hover: none)).
    await page.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await page.reload("");
    try {
      must(await page.eval(() => matchMedia("(hover: none)").matches), "the page reads (hover: none)");
      for (const [, part, control] of REVEALS) {
        await page.step(`${part} on touch`, async () => {
          assert.equal(await opacity(page, part), 1, `${part} is hidden on a touch screen`);
          const r = await page.rect(control);
          const hit = await page.eval((s, x, y) => { const el = document.elementFromPoint(x, y); return !!el && (el === document.querySelector(s) || document.querySelector(s).contains(el)); }, control, r.cx, r.cy);
          assert.ok(hit, `${control} cannot be reached at its centre`);
        });
      }
    } finally { await page.send("Emulation.setTouchEmulationEnabled", { enabled: false }); }
  });

  for (const theme of ["light", "dark"]) for (const selection of ["neutral", "accent"]) {
    it(`a press reads apart from hover and from selected on every ground (${theme}, Selection ${selection})`, async page => {
      await page.send("CSS.enable");
      let closest = { step: Infinity };
      // Hover lift moves only a card's shadow, never a plate: swept at one combination, Fill and Layers at the rest.
      const COMBOS = [...[0, 100].flatMap(layers => FILLS.map(fills => ({ layers, lift: 3, fills }))), { layers: 100, lift: 0, fills: {} }, { layers: 100, lift: 8, fills: {} }];
      for (const { layers, lift, fills } of COMBOS) {
        const query = "?" + new URLSearchParams({ theme, selection, [`layers-${theme}`]: layers, "shadow-hover": lift, ...fills }).toString();
        await page.reload(query);
        await media(page, still);
        await page.send("CSS.enable");
        for (const ground of GROUNDS) for (const [name, a, b] of PAIRS) {
          const selector = `#${ground}-${name}`;
          const before = await forced(page, selector, a), after = await forced(page, selector, b);
          const step = ratio(before, after);
          // The words keep 4.5:1 on the pressed plate (CONTRAST.md: a state never changes a label's class).
          assert.ok(ratio(after, after.ink) >= 4.5, `${selector}'s words are ${ratio(after, after.ink).toFixed(2)}:1 pressed at ${query}`);
          if (step < closest.step) closest = { step, selector, a: a.join("+") || "rest", b: b.join("+"), query };
          const floor = fills["fill-pressed"] === 25 ? FLOOR_FAINTEST : FLOOR;
          assert.ok(step >= floor, `${selector} ${a.join("+") || "rest"} → ${b.join("+")} is ${step.toFixed(3)}:1 at ${query}`);
        }
      }
      console.log(`closest step (${theme}, ${selection}): ${closest.step.toFixed(3)}:1, ${closest.selector} ${closest.a} → ${closest.b} at ${closest.query}`);
    }, { timeout: 120000 });
  }
});
