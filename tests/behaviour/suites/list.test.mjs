// List selection (ref-behaviour.md 2.7, 2.8, 2.10; interaction.md I5, I7, I13). Fixture: fixtures/list.jsx.
// List box is a roving-focus list (each option takes focus); Custom select and Combobox keep focus on their field and
// move aria-activedescendant. Both models are asserted as built.
import assert from "node:assert/strict";
import { behaviour, must } from "../suite.mjs";

const TYPEAHEAD_RESET = 1000; // Overlays.tsx: Menu, List box and Tree view
const activeName = async page => (await page.active())?.name;
const selected = (page, list) => page.eval(s => [...document.querySelectorAll(`${s} [role=option][aria-selected=true]`)].map(o => o.textContent.trim()), list);
// The option a field's aria-activedescendant names, and whether the field still has focus.
const descendant = (page, field) => page.eval(s => {
  const f = document.querySelector(s); const id = f.getAttribute("aria-activedescendant"); const o = id ? document.getElementById(id) : null;
  return { focused: document.activeElement === f, option: o ? o.textContent.trim() : null };
}, field);
// Whether an element's box lies inside its nearest scrolling ancestor's visible box.
const inView = (page, js) => page.eval(code => {
  const el = (0, eval)(code); if (!el) return { ok: false, why: "no element" };
  let box = el.parentElement; while (box && !(box.scrollHeight > box.clientHeight && /auto|scroll/.test(getComputedStyle(box).overflowY))) box = box.parentElement;
  if (!box) return { ok: false, why: "no scroller" };
  const a = el.getBoundingClientRect(), b = box.getBoundingClientRect();
  return { ok: a.top >= b.top - 0.5 && a.bottom <= b.bottom + 0.5, scrolled: box.scrollTop, why: `${a.top}-${a.bottom} in ${b.top}-${b.bottom}` };
}, js);
const focusEl = (page, sel) => page.eval(s => document.querySelector(s).focus(), sel);

behaviour("list", ({ it, gap }) => {
  /* --- List box: roving focus ------------------------------------------------------------------------------------ */
  it("List box: one Tab stop, entered on the selected option, left by the next Tab", async page => {
    await page.step("Tab into the list", async () => {
      await page.press("Tab"); await page.press("Tab");
      assert.deepEqual(await page.focusedNode(), { role: "option", name: "Blue" });
      assert.deepEqual(await page.eval(() => [...document.querySelectorAll("#lb [role=option]")].filter(o => o.tabIndex === 0).map(o => o.textContent)), ["Blue"]);
    });
    await page.step("Tab leaves the list", async () => { await page.press("Tab"); assert.equal((await page.active()).name, "Amber"); assert.ok(await page.eval(() => document.activeElement.closest("#lb-follow") !== null)); });
  });

  it("List box: arrows move focus, skipping the disabled option, and Home / End jump", async page => {
    await page.press("Tab"); await page.press("Tab");
    await page.step("ArrowDown", async () => { await page.press("ArrowDown"); assert.equal(await activeName(page), "Brown"); });
    await page.step("ArrowDown skips disabled Cyan", async () => { await page.press("ArrowDown"); assert.equal(await activeName(page), "Coral"); });
    await page.step("End", async () => { await page.press("End"); assert.equal(await activeName(page), "Violet"); });
    await page.step("Home", async () => { await page.press("Home"); assert.equal(await activeName(page), "Amber"); });
    await page.step("the moved focus is the one Tab stop", async () => assert.deepEqual(await page.eval(() => [...document.querySelectorAll("#lb [role=option]")].filter(o => o.tabIndex === 0).map(o => o.textContent)), ["Amber"]));
  });

  it("List box: selection doesn't follow focus by default; Space and Enter select", async page => {
    await page.press("Tab"); await page.press("Tab");
    await page.press("ArrowDown");
    await page.step("focus moved, selection stayed", async () => assert.deepEqual(await selected(page, "#lb"), ["Blue"]));
    await page.step("Space selects", async () => { await page.press(" "); assert.deepEqual(await selected(page, "#lb"), ["Brown"]); });
    await page.step("Enter selects", async () => { await page.press("ArrowDown"); await page.press("Enter"); assert.deepEqual(await selected(page, "#lb"), ["Coral"]); });
  });

  it("List box with selectionFollowsFocus: arrows select", async page => {
    await focusEl(page, "#lb-follow [aria-selected=true]");
    await page.step("ArrowDown selects Black", async () => { await page.press("ArrowDown"); assert.deepEqual(await selected(page, "#lb-follow"), ["Black"]); });
  });

  it(`List box: typeahead builds a run within ${TYPEAHEAD_RESET} ms and resets after it`, async page => {
    await page.press("Tab"); await page.press("Tab");
    await page.step("c finds Cyan's neighbour Coral (Cyan is disabled)", async () => { await page.press("c"); assert.equal(await activeName(page), "Coral"); });
    await page.step("g 900 ms later: run \"cg\" finds nothing, focus stays", async () => { await page.clock.tick(TYPEAHEAD_RESET - 100); await page.press("g"); assert.equal(await activeName(page), "Coral"); });
    await page.step(`g ${TYPEAHEAD_RESET + 1} ms later starts a new run`, async () => { await page.clock.tick(TYPEAHEAD_RESET + 1); await page.press("g"); assert.equal(await activeName(page), "Green"); });
  });

  gap("C2.1", "List box: a repeated letter cycles through the options that start with it", async page => {
    await page.press("Tab"); await page.press("Tab");
    await page.press("Home");
    await page.step("b, b, b cycles Black, Blue, Brown", async () => {
      const seen = [];
      for (let i = 0; i < 3; i++) { await page.press("b"); seen.push(await activeName(page)); }
      assert.deepEqual(seen, ["Black", "Blue", "Brown"]);
    });
  });

  it("List box: the focused option is kept in view inside a scrolling list, without scrolling the page", async page => {
    await focusEl(page, "#lb-long [role=option]");
    const y = await page.eval(() => scrollY);
    await page.step("End", async () => {
      await page.press("End"); await page.frames();
      assert.equal(await activeName(page), "Item 40");
      const v = await inView(page, "document.activeElement"); assert.ok(v.ok, v.why);
      assert.equal(await page.eval(() => scrollY), y);
    });
  });

  /* --- Custom select: active descendant on the trigger --------------------------------------------------------------- */
  for (const key of ["Enter", " ", "ArrowDown"]) {
    it(`Custom select: ${JSON.stringify(key)} opens on the chosen option, focus stays on the trigger`, async page => {
      await focusEl(page, "#cs");
      await page.step(`press ${key}`, async () => {
        await page.press(key); await page.settle();
        assert.equal(await page.eval(() => document.querySelector("#cs").getAttribute("aria-expanded")), "true");
        assert.deepEqual(await descendant(page, "#cs"), { focused: true, option: "Blue" });
        assert.deepEqual(await page.focusedNode(), { role: "combobox", name: "Shade" });
      });
    });
  }

  it("Custom select: arrows move the active option; Enter chooses and closes; Escape closes without a change", async page => {
    await focusEl(page, "#cs");
    await page.press("ArrowDown"); await page.settle();
    await page.step("ArrowDown", async () => { await page.press("ArrowDown"); assert.equal((await descendant(page, "#cs")).option, "Brown"); });
    await page.step("Enter chooses Brown", async () => {
      await page.press("Enter"); await page.settle();
      assert.equal(await page.eval(() => document.querySelector("#cs").getAttribute("aria-expanded")), "false");
      assert.match(await page.eval(() => document.querySelector("#cs").textContent), /Brown/);
      assert.deepEqual(await page.eval(() => window.__log), ["cs:brown"]);
    });
    await page.step("Escape after moving leaves Brown", async () => {
      await page.press("ArrowDown"); await page.settle(); await page.press("ArrowDown"); await page.press("Escape"); await page.settle();
      assert.equal(await page.eval(() => document.querySelector("#cs").getAttribute("aria-expanded")), "false");
      assert.match(await page.eval(() => document.querySelector("#cs").textContent), /Brown/);
      assert.equal((await page.active()).id, "cs");
    });
  });

  it("Custom select: a repeated letter cycles through the options that start with it", async page => {
    await focusEl(page, "#cs");
    await page.press("ArrowDown"); await page.settle(); await page.press("Home");
    await page.step("b, b, b", async () => {
      const seen = [];
      for (let i = 0; i < 3; i++) { await page.press("b"); seen.push((await descendant(page, "#cs")).option); }
      assert.deepEqual(seen, ["Black", "Blue", "Brown"]);
    });
  });

  it(`Custom select: one typeahead window with Menu and List box (${TYPEAHEAD_RESET} ms), so a run continues at ${TYPEAHEAD_RESET - 100} ms`, async page => {
    await focusEl(page, "#cs");
    await page.press("ArrowDown"); await page.settle(); await page.press("Home");
    await page.step("b, then r 900 ms later, is the run \"br\"", async () => {
      await page.press("b"); await page.clock.tick(TYPEAHEAD_RESET - 100); await page.press("r");
      assert.equal((await descendant(page, "#cs")).option, "Brown");
    });
  });

  it("Custom select: the active option is scrolled into view inside the list, not the page", async page => {
    await focusEl(page, "#cs-long");
    await page.press("ArrowDown"); await page.settle();
    const y = await page.eval(() => scrollY);
    await page.step("End", async () => {
      await page.press("End"); await page.frames();
      assert.equal((await descendant(page, "#cs-long")).option, "Item 40");
      const v = await inView(page, `document.getElementById(document.querySelector("#cs-long").getAttribute("aria-activedescendant"))`); assert.ok(v.ok, v.why);
      assert.equal(await page.eval(() => scrollY), y);
    });
  });

  /* --- Combobox: active descendant on the input ------------------------------------------------------------------------ */
  it("Combobox: typing filters and opens; arrows move the active option while focus stays in the field; Enter commits", async page => {
    await page.click("#cb");
    await page.step("type bl", async () => {
      await page.type("bl"); await page.settle();
      assert.equal(await page.eval(() => document.querySelector("#cb").getAttribute("aria-expanded")), "true");
      assert.deepEqual(await page.eval(() => [...document.querySelectorAll("[role=listbox]:popover-open [role=option]")].map(o => o.textContent.trim())), ["Black", "Blue"]);
    });
    await page.step("ArrowDown", async () => { await page.press("ArrowDown"); assert.deepEqual(await descendant(page, "#cb"), { focused: true, option: "Blue" }); });
    await page.step("Enter commits Blue", async () => {
      await page.press("Enter"); await page.settle();
      assert.equal(await page.eval(() => document.querySelector("#cb").value), "Blue");
      assert.equal(await page.eval(() => document.querySelector("#cb").getAttribute("aria-expanded")), "false");
      assert.deepEqual(await page.eval(() => window.__log), ["cb:blue"]);
    });
  });

  it("Combobox: Escape closes the list, a second Escape clears the field", async page => {
    await page.click("#cb"); await page.type("re"); await page.settle();
    await page.step("Escape closes", async () => { await page.press("Escape"); await page.settle(); assert.equal(await page.eval(() => document.querySelector("#cb").getAttribute("aria-expanded")), "false"); assert.equal(await page.eval(() => document.querySelector("#cb").value), "re"); });
    await page.step("Escape clears", async () => { await page.press("Escape"); assert.equal(await page.eval(() => document.querySelector("#cb").value), ""); });
  });

  it("Combobox: the active option is scrolled into view inside the list, not the page", async page => {
    await page.click("#cb-long");
    const y = await page.eval(() => scrollY);
    await page.step("ArrowDown to the last option", async () => {
      await page.press("ArrowDown"); await page.settle();
      for (let i = 0; i < 39; i++) await page.press("ArrowDown");
      await page.frames();
      assert.equal((await descendant(page, "#cb-long")).option, "Item 40");
      const v = await inView(page, `document.getElementById(document.querySelector("#cb-long").getAttribute("aria-activedescendant"))`); assert.ok(v.ok, v.why);
      assert.equal(await page.eval(() => scrollY), y);
    });
  });

  it("Combobox: Enter that confirms an input-method composition commits nothing (C4 guard, built here)", async page => {
    await page.click("#cb");
    await page.compose("にほん"); await page.settle();
    must((await descendant(page, "#cb")).option === "にほんご", "the composing text highlights an option");
    await page.step("Enter while composing (keyCode 229)", async () => {
      await page.press("Enter", { keyCode: 229 }); await page.commitComposition("にほん"); await page.settle();
      assert.deepEqual(await page.eval(() => window.__log), []);
      assert.equal(await page.eval(() => document.querySelector("#cb").value), "にほん");
    });
  });

  it("Command palette: Enter that confirms an input-method composition doesn't run the highlighted command (I7)", async page => {
    await page.click("#open-palette"); await page.settle();
    must(await page.eval(() => document.activeElement?.localName === "input"), "the palette's field has focus");
    await page.compose("にほん"); await page.settle();
    await page.step("Enter while composing (keyCode 229)", async () => {
      await page.press("Enter", { keyCode: 229 }); await page.commitComposition("にほん"); await page.settle();
      assert.deepEqual(await page.eval(() => window.__log), []);
    });
  });

  it("Command palette: Ctrl+N and Ctrl+P move the highlight, as Down and Up (C2.3)", async page => {
    // Off Apple platforms the browser keeps Ctrl+N (new window) and Ctrl+P (print) for itself: the page never sees them.
    if (process.platform !== "darwin") return;
    await page.click("#open-palette"); await page.settle();
    const highlighted = () => page.eval(() => document.querySelector("dialog:modal [role=option][aria-selected=true], dialog:modal [data-highlighted]")?.textContent.trim());
    must((await highlighted()) === "Export", "the first row is highlighted");
    await page.step("Ctrl+N", async () => { await page.press("n", { modifiers: ["Control"] }); assert.equal(await highlighted(), "にほんご"); });
    await page.step("Ctrl+P", async () => { await page.press("p", { modifiers: ["Control"] }); assert.equal(await highlighted(), "Export"); });
  });

  it("Tag picker: tags are one Tab stop with the field; ← reaches them and Backspace removes one (C2.3)", async page => {
    await focusEl(page, "#tp");
    await page.step("Tab from the field leaves the picker", async () => { await page.press("Tab"); assert.equal((await page.active()).name, "After tags"); });
    await focusEl(page, "#tp");
    await page.step("← from the empty field focuses the last tag's remove button", async () => { await page.press("ArrowLeft"); assert.match((await page.active()).name, /Remove .*Green/i); });
    await page.step("← moves to the previous tag", async () => { await page.press("ArrowLeft"); assert.match((await page.active()).name, /Remove .*Blue/i); });
    await page.step("Backspace removes it and focus goes to its neighbour", async () => {
      await page.press("Backspace"); await page.frames(2); await page.settle();
      assert.deepEqual(await page.eval(() => [...document.querySelectorAll(".area-tag-picker__field > .area-tag")].map(t => t.textContent.trim()).filter(Boolean)), ["Red", "Green"]);
      assert.match((await page.active()).name, /Remove .*Red/i);
    });
  });
});
