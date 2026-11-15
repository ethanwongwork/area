// Motion behaviour (docs/MOTION.md; plan A5.1–A5.3, A5.6, 2026-11-11). Fixture: fixtures/motion.jsx. Reads the CSS
// transitions the browser actually starts (Element.getAnimations) and the computed values on the first frame, at the
// shipped defaults: Speed 210 (fast 140, base 210), Easing Subtle, Feedback Subtle.
import assert from "node:assert/strict";
import { behaviour, must } from "../suite.mjs";

const FAST = 140, BASE = 210;
const OUT = "cubic-bezier(0.22, 1, 0.36, 1)", EXIT = "cubic-bezier(0.4, 0, 1, 1)";
const probe = (page, sel) => page.eval(s => window.__probe(s), sel);
// The transitions that started on the element since the last clear, as the browser ran them.
const ran = async (page, sel, property) => (await page.eval((s, p) => window.__ran(s, p), sel, property)).at(-1);
const clear = page => page.eval(() => { window.__runs = []; });
const isOpen = (page, sel) => page.eval(s => !!document.querySelector(s)?.matches(":popover-open, [open]"), sel);
const reduced = page => page.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
const unreduced = page => page.send("Emulation.setEmulatedMedia", { features: [] });

// Opens a surface with a key: focus the trigger, then press.
async function keyOpen(page, trigger, key = "Enter") {
  await page.eval(s => document.querySelector(s).focus(), trigger);
  await page.press(key);
}

behaviour("motion", ({ it }) => {
  it("a pointer-opened menu grows from the overlay scale on fast, ease-out, and leaves on fast, ease-exit", async page => {
    await page.step("click File", () => page.click("#menu-trigger"));
    await page.step("the enter runs on fast", async () => {
      const scale = await ran(page, "#menu", "scale");
      assert.equal(scale?.duration, FAST, JSON.stringify(scale));
      assert.equal(scale?.easing, OUT);
      assert.equal((await ran(page, "#menu", "opacity"))?.duration, FAST);
    });
    await page.settle();
    await page.step("Escape closes on fast, ease-exit", async () => {
      await clear(page);
      await page.press("Escape"); await page.frames();
      const fade = await ran(page, "#menu", "opacity"), scale = await ran(page, "#menu", "scale");
      assert.equal(fade?.duration, FAST, JSON.stringify(fade));
      assert.equal(fade?.easing, EXIT);
      assert.equal(scale?.easing, EXIT);
    });
  });

  it("a menu opened with a key is at its final size on the first frame and only fades", async page => {
    await keyOpen(page, "#menu-trigger", "Enter");
    await page.step("first frame: scale 1, no scale transition, a fast fade", async () => {
      must(await isOpen(page, "#menu"), "the menu opened");
      const p = await probe(page, "#menu");
      assert.ok(p.scale === "none" || p.scale === "1", `scale ${p.scale}`);
      assert.equal(await ran(page, "#menu", "scale"), undefined);
      assert.equal((await ran(page, "#menu", "opacity"))?.duration, FAST);
      assert.equal(await page.eval(() => document.querySelector("#menu").dataset.openedBy), "keyboard");
    });
  });

  it("the Command palette opened by its shortcut appears at its size; by a click it scales on fast", async page => {
    await page.step("⌘K", () => page.press("k", { modifiers: ["Meta"] }));
    await page.step("first frame: no scale", async () => {
      must(await isOpen(page, ".area-command-palette__modal"), "the palette opened");
      const p = await probe(page, ".area-command-palette__modal");
      assert.equal(await ran(page, ".area-command-palette__modal", "scale"), undefined);
      assert.ok(p.scale === "none" || p.scale === "1", `scale ${p.scale}`);
      assert.equal((await ran(page, ".area-command-palette__modal", "opacity"))?.duration, FAST);
    });
    await page.press("Escape"); await page.settle();
    await page.step("a click opens it with the anchored scale", async () => {
      await clear(page);
      await page.click("#palette-trigger");
      assert.equal((await ran(page, ".area-command-palette__modal", "scale"))?.duration, FAST);
    });
  });

  it("a dialog enters on base and leaves on fast, ease-exit", async page => {
    await page.click("#dialog-trigger");
    assert.equal((await ran(page, ".area-dialog__modal", "scale"))?.duration, BASE);
    await page.settle(); await clear(page);
    await page.press("Escape"); await page.frames();
    const exit = await ran(page, ".area-dialog__modal", "opacity");
    assert.equal(exit?.duration, FAST, JSON.stringify(exit));
    assert.equal(exit?.easing, EXIT);
  });

  it("a highlight moving through a menu lands and leaves at once", async page => {
    await page.click("#menu-trigger"); await page.settle();
    await page.step("hover New file: painted at once, no transition", async () => {
      await page.hover("#row-new");
      const p = await probe(page, "#row-new");
      assert.notEqual(p.background, "rgba(0, 0, 0, 0)");
      assert.deepEqual(p.transitions, []);
    });
    await page.step("move to Open: New file is clear at once", async () => {
      await page.hover("#row-open");
      const p = await probe(page, "#row-new");
      assert.equal(p.background, "rgba(0, 0, 0, 0)");
      assert.deepEqual(p.transitions, []);
    });
  });

  it("a press gives on the plate; the label keeps its size (solid and ghost)", async page => {
    for (const id of ["#press-solid", "#press-ghost"]) {
      await page.step(`press ${id}`, async () => {
        await page.hover(id); await page.settle();
        const label = `${id} .area-button__label`;
        const before = await page.rect(label);
        await page.down();
        const frames = await page.eval((b, l) => new Promise(r => { const out = []; const t0 = performance.now(); const f = () => { out.push({ button: document.querySelector(b).getBoundingClientRect().width, label: document.querySelector(l).getBoundingClientRect().width }); performance.now() - t0 < 200 ? requestAnimationFrame(f) : r(out); }; f(); }), id, label);
        await page.up(); await page.settle();
        const button = Math.min(...frames.map(f => f.button)), widths = frames.map(f => f.label);
        assert.ok(button < (await page.rect(id)).width - 1, `the plate did not give: ${button}`);
        assert.ok(Math.max(...widths) - Math.min(...widths) < 0.1, `the label resized: ${Math.min(...widths)}–${Math.max(...widths)} (rest ${before.width})`);
      });
    }
  });

  it("reduced motion: nothing moves, the fades stay", async page => {
    await reduced(page);
    try {
      await clear(page);
      await page.click("#menu-trigger");
      assert.equal(await ran(page, "#menu", "scale"), undefined);
      assert.equal((await ran(page, "#menu", "opacity"))?.duration, 100);
      await page.press("Escape"); await page.settle(); await clear(page);
      await page.click("#dialog-trigger");
      assert.equal(await ran(page, ".area-dialog__modal", "scale"), undefined);
      assert.equal((await ran(page, ".area-dialog__modal", "opacity"))?.duration, 160);
      await page.press("Escape"); await page.settle();
      await page.hover("#press-solid"); await page.down();
      assert.equal(await page.style("#press-solid", "scale"), "1");
      await page.up();
    } finally { await unreduced(page); }
  });
});
