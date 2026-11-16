// Modal surfaces (ref-behaviour.md 2.16, 2.17, 2.18; interaction.md I3, I14, I15; plan C5.1, C5.3, C5.4).
// Fixture: fixtures/modal.jsx. The page is taller than the window, with a classic 15 px scrollbar.
import assert from "node:assert/strict";
import { behaviour, must } from "../suite.mjs";

const FAMILIES = {
  dialog: { trigger: "#open-dialog", first: { role: "textbox", name: "Name" } },
  drawer: { trigger: "#open-drawer", first: { role: "textbox", name: "Name" } },
  confirm: { trigger: "#open-confirm", first: { role: "button", name: "Cancel" } }, // the least destructive action
  palette: { trigger: "#open-palette", first: { role: "combobox", name: "Commands" } },
};
const modalOpen = page => page.eval(() => !!document.querySelector("dialog:modal"));
// A point on the backdrop: inside the window, outside the visible surface.
const backdropPoint = page => page.eval(() => {
  const d = document.querySelector("dialog:modal");
  const box = [...d.querySelectorAll(":scope > *")].map(e => e.getBoundingClientRect()).find(r => r.width > 0) ?? d.getBoundingClientRect();
  const surface = box.width >= innerWidth - 1 ? d.getBoundingClientRect() : box;
  const cands = [[12, innerHeight - 12], [innerWidth - 30, innerHeight - 12], [12, 12]];
  const out = cands.find(([x, y]) => x < surface.left || x > surface.right || y < surface.top || y > surface.bottom);
  // A drawer's <dialog> fills the window: its surface is the panel inside.
  const panel = d.querySelector(".area-drawer, .area-dialog, .area-command-palette")?.getBoundingClientRect();
  const free = cands.find(([x, y]) => !panel || x < panel.left || x > panel.right || y < panel.top || y > panel.bottom);
  const [x, y] = free ?? out; return { x, y };
});
async function openBy(page, fam, how = "click") {
  if (how === "click") await page.click(FAMILIES[fam].trigger);
  else { await page.eval(s => document.querySelector(s).focus(), FAMILIES[fam].trigger); await page.press("Enter"); }
  await page.settle();
  must(await modalOpen(page), `${fam} opened`);
}

behaviour("modal", ({ it }) => {
  for (const [fam, { first }] of Object.entries(FAMILIES)) {
    it(`${fam}: a keyboard open puts focus on ${first.role} "${first.name}", never the close button (I15)`, async page => {
      await openBy(page, fam, "keys");
      await page.step("initial focus", async () => assert.deepEqual(await page.focusedNode(), first));
    });

    it(`${fam}: Tab stays inside the modal; the page behind is never reached`, async page => {
      await openBy(page, fam);
      await page.step("Tab ten times", async () => {
        for (let i = 0; i < 10; i++) {
          await page.press("Tab");
          const where = await page.eval(() => { const a = document.activeElement; return !a || a === document.body ? "chrome" : a.closest("dialog:modal") ? "inside" : a.id || a.localName; });
          assert.ok(where === "chrome" || where === "inside", `Tab ${i + 1} reached ${where} behind the modal`);
        }
      });
    });

    it(`${fam}: Escape closes it and focus returns to the trigger`, async page => {
      await openBy(page, fam, "keys");
      await page.step("Escape", async () => {
        await page.press("Escape"); await page.settle();
        assert.equal(await modalOpen(page), false);
        assert.equal(await page.eval(s => document.activeElement === document.querySelector(s), FAMILIES[fam].trigger), true, JSON.stringify(await page.active()));
      });
    });

    // Confirm dialog is a forced choice: its backdrop does nothing (owner, plan C5.4).
    const closes = fam !== "confirm";
    it(`${fam}: a press on the backdrop ${closes ? "closes it" : "leaves it open (C5.4)"}`, async page => {
      await openBy(page, fam);
      const p = await backdropPoint(page);
      await page.step(`press the backdrop at ${p.x},${p.y}`, async () => {
        await page.click(p); await page.settle();
        assert.equal(await modalOpen(page), !closes);
      });
    });

    it(`${fam}: a press that starts inside and is released on the backdrop doesn't close it (I14)`, async page => {
      await openBy(page, fam);
      const inside = await page.eval(() => { const el = document.querySelector("dialog:modal input, dialog:modal button:not([aria-label])"); const b = el.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
      const p = await backdropPoint(page);
      await page.step("press inside, drag out, release on the backdrop", async () => {
        await page.move(inside.x, inside.y); await page.down(); await page.move(p.x, p.y, { steps: 8 }); await page.up(); await page.frames(); await page.settle();
        assert.equal(await modalOpen(page), true);
      });
    });

    it(`${fam}: the page behind doesn't scroll while it is open`, async page => {
      await openBy(page, fam);
      const p = await backdropPoint(page);
      await page.step("wheel over the backdrop", async () => {
        await page.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: p.x, y: p.y, deltaX: 0, deltaY: 400 });
        await page.frames(4);
        assert.equal(await page.eval(() => scrollY), 0);
      });
    });

    it(`${fam}: opening it doesn't shift the page by the scrollbar's width (I14)`, async page => {
      // What the person sees: the page's content keeps its place and width when the bar goes away.
      const content = () => page.eval(() => { const b = document.querySelector("#root > *").getBoundingClientRect(); return { x: b.x, width: b.width }; });
      must(await page.eval(() => document.documentElement.clientWidth < innerWidth), "the page shows a classic scrollbar");
      const before = await content();
      await openBy(page, fam);
      await page.step("the content with the modal open", async () => {
        const locked = await page.eval(() => getComputedStyle(document.documentElement).overflowY === "hidden" || getComputedStyle(document.body).overflowY === "hidden");
        assert.ok(locked, "the page isn't locked at all");
        assert.deepEqual(await content(), before, "the content moved or changed width");
      });
    });
  }

  for (const fam of ["dialog", "drawer"]) {
    it( `${fam}: a toast raised while it is open is on top and its action can be pressed (I3)`, async page => {
      await openBy(page, fam);
      await page.click(`#${fam}-toast`); await page.settle();
      must(await page.eval(() => !!document.querySelector("#undo")), "the toast rendered");
      await page.step("press Undo", async () => {
        const r = await page.rect("#undo");
        assert.equal((await page.hit(r.cx, r.cy, "#undo")).inside, true, "something covers Undo");
        await page.click({ x: r.cx, y: r.cy });
        assert.deepEqual(await page.eval(() => window.__log), ["undo"]);
      });
    });
  }

  it("confirm: Cancel and Delete both close it; Delete runs onConfirm", async page => {
    await openBy(page, "confirm", "keys");
    await page.step("Enter on the focused Cancel", async () => { await page.press("Enter"); await page.settle(); assert.equal(await modalOpen(page), false); assert.deepEqual(await page.eval(() => window.__log), ["confirm:cancel"]); });
    await openBy(page, "confirm", "keys");
    await page.step("Tab to Delete, Enter", async () => { await page.press("Tab"); await page.press("Enter"); await page.settle(); assert.equal(await modalOpen(page), false); assert.ok((await page.eval(() => window.__log)).includes("confirm:delete")); });
  });
});
