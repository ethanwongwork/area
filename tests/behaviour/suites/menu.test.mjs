// Menu behaviour (ref-behaviour.md 2.9; interaction.md I1, I2, I5). Fixture: fixtures/menu.jsx.
import assert from "node:assert/strict";
import { behaviour, must } from "../suite.mjs";

const TYPEAHEAD_RESET = 1000; // Overlays.tsx TYPEAHEAD_RESET: one window for every list today (C2.1 keeps one)

const isOpen = (page, sel) => page.eval(s => !!document.querySelector(s)?.matches(":popover-open"), sel);
const activeName = async page => (await page.active())?.name;
// Rows of one menu (a submenu's rows are its own) that are painted as highlighted: any background but the rest's.
const highlighted = (page, sel) => page.eval(s => {
  const menu = document.querySelector(s);
  return [...menu.querySelectorAll("[role^='menuitem']")].filter(r => r.closest("[role='menu']") === menu)
    .filter(r => getComputedStyle(r).backgroundColor !== "rgba(0, 0, 0, 0)").map(r => r.textContent.trim());
}, sel);
const row = (menu, name) => `${menu} [data-row="${name}"]`;
// Tag each row with its text so a selector can name it.
const tagRows = page => page.eval(() => { for (const r of document.querySelectorAll("[role^='menuitem']")) r.dataset.row = r.textContent.trim(); });
async function openFile(page, key) {
  await page.press("Tab"); await page.press("Tab"); // Before, then File
  assert.equal((await page.active()).id, "trigger");
  await page.press(key);
  await page.settle(); await tagRows(page);
}

behaviour("menu", ({ it, gap }) => {
  it("a click on the trigger opens the menu with focus on the surface", async page => {
    await page.step("click File", () => page.click("#trigger"));
    await page.step("menu is open and focused", async () => {
      assert.ok(await isOpen(page, "#file-menu"));
      const a = await page.active();
      assert.equal(a.role, "menu"); assert.equal(a.name, "File");
      assert.equal(await page.eval(() => document.querySelector("#trigger").getAttribute("aria-expanded")), "true");
    });
  });

  for (const [key, first] of [["Enter", "New file"], [" ", "New file"], ["ArrowDown", "New file"], ["ArrowUp", "Delete"]]) {
    it(`${JSON.stringify(key)} on the trigger opens the menu on ${first}`, async page => {
      await page.step(`open with ${key}`, () => openFile(page, key));
      await page.step("focus on the row", async () => {
        assert.ok(await isOpen(page, "#file-menu"));
        assert.deepEqual(await page.focusedNode(), { role: "menuitem", name: first });
      });
    });
  }

  it("arrows wrap at both ends and skip the disabled row", async page => {
    await openFile(page, "ArrowUp");
    await page.step("ArrowDown from the last row wraps to the first", async () => { await page.press("ArrowDown"); assert.equal(await activeName(page), "New file"); });
    await page.step("ArrowUp from the first row wraps to the last", async () => { await page.press("ArrowUp"); assert.equal(await activeName(page), "Delete"); });
    await page.step("ArrowUp from Delete skips the disabled Archive", async () => { await page.press("ArrowUp"); assert.equal(await activeName(page), "Export"); });
  });

  it("Home and End jump to the first and last rows", async page => {
    await openFile(page, "ArrowDown");
    await page.press("ArrowDown"); await page.press("ArrowDown");
    await page.step("End", async () => { await page.press("End"); assert.equal(await activeName(page), "Delete"); });
    await page.step("Home", async () => { await page.press("Home"); assert.equal(await activeName(page), "New file"); });
  });

  it(`typeahead: letters typed within ${TYPEAHEAD_RESET} ms build one run`, async page => {
    await openFile(page, "ArrowDown");
    await page.step("r finds Rename", async () => { await page.press("r"); assert.equal(await activeName(page), "Rename"); });
    await page.step(`e ${TYPEAHEAD_RESET - 100} ms later continues the run "re"`, async () => {
      await page.clock.tick(TYPEAHEAD_RESET - 100); await page.press("e"); assert.equal(await activeName(page), "Rename");
    });
  });

  it(`typeahead: the run resets after ${TYPEAHEAD_RESET} ms`, async page => {
    await openFile(page, "ArrowDown");
    await page.press("r");
    await page.step(`e ${TYPEAHEAD_RESET + 1} ms later starts a new run`, async () => {
      await page.clock.tick(TYPEAHEAD_RESET + 1); await page.press("e"); assert.equal(await activeName(page), "Export");
    });
  });

  gap("C2.1", "typeahead: a repeated letter cycles through the rows that start with it", async page => {
    await openFile(page, "ArrowDown");
    await page.press("Home");
    await page.step("n from New file goes to New folder", async () => { await page.press("n"); assert.equal(await activeName(page), "New folder"); });
    await page.step("n again cycles to New file", async () => { await page.press("n"); assert.equal(await activeName(page), "New file"); });
  });

  it("Escape closes the menu and returns focus to the trigger", async page => {
    await openFile(page, "Enter");
    await page.step("Escape", async () => {
      await page.press("Escape"); await page.settle();
      assert.equal(await isOpen(page, "#file-menu"), false);
      assert.equal((await page.active()).id, "trigger");
    });
  });

  it("Tab closes the menu and moves focus on past the trigger", async page => {
    await openFile(page, "Enter");
    await page.step("Tab", async () => {
      await page.press("Tab"); await page.settle();
      assert.equal(await isOpen(page, "#file-menu"), false);
      assert.equal((await page.active()).id, "after");
    });
  });

  it("choosing a row runs it, closes the menu and returns focus to the trigger", async page => {
    await openFile(page, "ArrowDown");
    await page.step("Enter on New file", async () => {
      await page.press("Enter"); await page.settle();
      assert.deepEqual(await page.eval(() => window.__log), ["New file"]);
      assert.equal(await isOpen(page, "#file-menu"), false);
      assert.equal((await page.active()).id, "trigger");
    });
  });

  it("the pointer moves focus to the row under it, and the keys continue from there", async page => {
    await page.click("#trigger"); await page.settle(); await tagRows(page);
    await page.step("hover Open", async () => { await page.hover(row("#file-menu", "Open")); assert.equal(await activeName(page), "Open"); });
    await page.step("ArrowDown continues from Open", async () => { await page.press("ArrowDown"); assert.equal(await activeName(page), "Share"); });
  });

  gap("C1.1", "one highlighted row when the pointer rests on a row and the keys move (I2)", async page => {
    await page.click("#trigger"); await page.settle(); await tagRows(page);
    await page.hover(row("#file-menu", "Open")); await page.settle();
    await page.press("ArrowDown"); await page.press("ArrowDown"); await page.settle();
    await page.step("only the focused row is painted", async () => assert.deepEqual(await highlighted(page, "#file-menu"), ["Rename"]));
  });

  gap("C1.1", "Split button's menu: one highlighted row when the pointer and the keys mix (I2)", async page => {
    await page.click("#split [aria-haspopup='menu']"); await page.settle(); await tagRows(page);
    const menu = await page.eval(() => "#" + CSS.escape(document.querySelector("#split [aria-haspopup='menu']").getAttribute("aria-controls")));
    await page.hover(row(menu, "Save as")); await page.settle();
    await page.press("ArrowDown"); await page.settle();
    await page.step("one row painted, and it is the focused one", async () => {
      const paint = await highlighted(page, menu);
      assert.equal(paint.length, 1, `painted: ${paint.join(", ")}`);
      assert.equal(paint[0], await activeName(page));
    });
  });

  gap("C1.1", "every menu treats Tab the same way: Menu, Split button and Context menu (I2)", async page => {
    const outcomes = {};
    await openFile(page, "Enter");
    await page.press("Tab"); await page.settle();
    outcomes.menu = { open: await isOpen(page, "#file-menu"), moved: (await page.active()).id !== "trigger" };
    await page.reload();
    await page.eval(() => document.querySelector("#split [aria-haspopup='menu']").focus());
    await page.press("ArrowDown"); await page.settle();
    await page.press("Tab"); await page.settle();
    outcomes.split = { open: await page.eval(() => !!document.querySelector("#split [role='menu']:popover-open, [role='menu']:popover-open")), moved: !(await page.eval(() => document.activeElement.matches("#split [aria-haspopup='menu']"))) };
    await page.reload();
    await page.eval(() => document.querySelector("#context-area").focus());
    await page.press("F10", { modifiers: ["Shift"] }); await page.settle();
    must(await page.eval(() => !!document.querySelector("[role='menu']:popover-open")), "Shift+F10 opens the context menu");
    await page.press("Tab"); await page.settle();
    outcomes.context = { open: await page.eval(() => !!document.querySelector("[role='menu']:popover-open")), moved: (await page.active()).id !== "context-area" };
    await page.step("all three close and agree on where focus goes", async () => {
      for (const [k, o] of Object.entries(outcomes)) assert.equal(o.open, false, `${k} stays open on Tab`);
      assert.deepEqual(new Set(Object.values(outcomes).map(o => o.moved)).size, 1, JSON.stringify(outcomes));
    });
  });

  it("ArrowRight opens a submenu on its first row; ArrowLeft closes it back to its row", async page => {
    await openFile(page, "ArrowDown");
    await page.press("ArrowDown"); await page.press("ArrowDown"); await page.press("ArrowDown");
    assert.equal(await activeName(page), "Share");
    await page.step("ArrowRight", async () => {
      await page.press("ArrowRight"); await page.settle();
      assert.ok(await isOpen(page, "#share-menu"));
      assert.equal(await activeName(page), "Copy link");
    });
    await page.step("ArrowDown stays in the submenu", async () => { await page.press("ArrowDown"); assert.equal(await activeName(page), "Email"); });
    await page.step("ArrowLeft", async () => {
      await page.press("ArrowLeft"); await page.settle();
      assert.equal(await isOpen(page, "#share-menu"), false);
      assert.ok(await isOpen(page, "#file-menu"));
      assert.equal(await activeName(page), "Share");
    });
  });

  it("Escape in a submenu closes only the submenu", async page => {
    await openFile(page, "ArrowDown");
    for (let i = 0; i < 3; i++) await page.press("ArrowDown");
    await page.press("Enter"); await page.settle();
    await page.step("Escape", async () => {
      await page.press("Escape"); await page.settle();
      assert.equal(await isOpen(page, "#share-menu"), false);
      assert.ok(await isOpen(page, "#file-menu"));
      assert.equal(await activeName(page), "Share");
    });
  });

  it("resting the pointer on a submenu row opens its submenu", async page => {
    await page.click("#trigger"); await page.settle(); await tagRows(page);
    await page.step("hover Share and rest", async () => {
      await page.hover(row("#file-menu", "Share")); await page.clock.tick(300); await page.settle();
      assert.ok(await isOpen(page, "#share-menu"));
    });
  });

  gap("C1.1", "brushing past a submenu row without resting doesn't open its submenu (I1)", async page => {
    await page.click("#trigger"); await page.settle(); await tagRows(page);
    await page.eval(() => { window.__toggles = []; document.querySelector("#share-menu").addEventListener("toggle", e => window.__toggles.push(e.newState)); });
    const open = await page.rect(row("#file-menu", "Open")), rename = await page.rect(row("#file-menu", "Rename"));
    await page.move(open.cx, open.cy);
    await page.step("sweep from Open across Share to Rename with no rest", async () => {
      await page.move(rename.cx, rename.cy, { steps: 8 }); await page.settle();
      assert.deepEqual(await page.eval(() => window.__toggles), []);
    });
  });

  gap("C1.1", "a diagonal move from a submenu row to its submenu keeps the submenu open (I1)", async page => {
    await page.click("#trigger"); await page.settle(); await tagRows(page);
    const share = await page.hover(row("#file-menu", "Share"));
    await page.clock.tick(300); await page.settle();
    must(await isOpen(page, "#share-menu"), "the submenu opens on a rest");
    const invite = await page.rect(row("#share-menu", "Invite"));
    const parent = await page.rect("#file-menu");
    await page.step("the path crosses the rows below Share inside the parent menu", async () => {
      // Where the straight line leaves the parent menu: below Share, over Rename or Export.
      const t = (parent.x + parent.width - share.cx) / (invite.cx - share.cx);
      const yAtEdge = share.cy + (invite.cy - share.cy) * t;
      must(yAtEdge > share.y + share.height, "the diagonal leaves Share's row before it leaves the menu");
    });
    await page.step("move diagonally to Invite", async () => {
      await page.move(invite.cx, invite.cy, { steps: 12 }); await page.clock.tick(100); await page.settle();
      assert.ok(await isOpen(page, "#share-menu"), "the submenu closed on the way");
      assert.equal(await activeName(page), "Invite");
    });
  });

  it("a press outside closes the menu", async page => {
    await page.click("#trigger"); await page.settle();
    await page.step("press the empty page", async () => {
      await page.click({ x: 900, y: 600 }); await page.settle();
      assert.equal(await isOpen(page, "#file-menu"), false);
    });
  });

  it("as built: the press that dismisses a menu also presses the control under it (C1.3 decides)", async page => {
    await page.click("#trigger"); await page.settle();
    await page.click("#outside"); await page.settle();
    await page.step("menu closed and Outside ran", async () => {
      assert.equal(await isOpen(page, "#file-menu"), false);
      assert.deepEqual(await page.eval(() => window.__log), ["outside"]);
    });
  });
});
