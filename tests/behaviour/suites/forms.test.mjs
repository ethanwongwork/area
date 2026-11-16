// Form contract (DESIGN_SYSTEM.md form contract; interaction.md I6; plan C3). Fixture: fixtures/forms.jsx.
// Every family that takes a `name` is checked inside a real <form>: what FormData carries, whether `required` stops a
// submit made by pressing the submit button, whether a Reset button puts back the default (both FormData and what the
// control shows and announces), and that a disabled control submits nothing.
import assert from "node:assert/strict";
import { behaviour, must } from "../suite.mjs";

// What each family submits at its default value (the value, never the label).
const DEFAULTS = {
  "input": [["input", "Draft"]], "textarea": [["textarea", "Notes"]], "password-field": [["password-field", "secret1"]],
  "search-field": [["search-field", "query"]], "number-field": [["number-field", "4"]], "color-field": [["color-field", "#3366FF"]],
  "otp-field": [["otp-field", "1234"]], "select": [["select", "b"]], "checkbox": [["checkbox", "on"]], "switch": [["switch", "on"]],
  "radio-group": [["radio-group", "two"]], "slider": [["slider", "30"]], "slider-range": [["slider-range", "20"], ["slider-range", "80"]],
  "segmented": [["segmented", "week"]], "toggle-group": [["toggle-group", "bold"]], "color-swatch-picker": [["color-swatch-picker", "#3e63dd"]],
  "alignment-picker": [["alignment-picker", "center"]], "custom-select": [["custom-select", "blue"]], "combobox": [["combobox", "blue"]],
  "tag-picker": [["tag-picker", "design"]], "date-picker": [["date-picker", "2026-11-11"]],
  "date-range-picker": [["date-range-picker-start", "2026-11-02"], ["date-range-picker-end", "2026-11-06"]],
  "time-field": [["time-field", "09:30"]], "box-field": [["box-field", "8 8 8 8"]], "calendar": [["calendar", "2026-11-11"]],
};
// Known gaps, each tied to its plan item. A family listed here is asserted the same way and expected to fail.
const NO_SUBMIT = { "toggle-group": "C3" };                   // no name reaches the form (I6)
const NO_RESET = { "otp-field": "C3", "search-field": "C3", "time-field": "C3", "date-range-picker": "C3", "slider-range": "C3", "box-field": "C3", "toggle-group": "C3" };
const SUBMITS_DISABLED = { "time-field": "C3", "calendar": "C3" }; // found in the browser, not in I6
// Families where an empty, required control must block the submit. Always-valued families (slider, slider range,
// segmented, alignment picker, color field) and ones without `required` (box field, calendar) are left out.
const REQUIRED = ["input", "textarea", "password-field", "search-field", "number-field", "otp-field", "select", "checkbox", "switch",
  "radio-group", "color-swatch-picker", "custom-select", "combobox", "tag-picker", "date-picker", "date-range-picker", "time-field", "toggle-group"];
const NOT_REQUIRED = { "radio-group": "C3", "custom-select": "C3", "date-picker": "C3", "date-range-picker": "C3", "time-field": "C3", "toggle-group": "C3" };
// With its value and `required`, a family must submit.
const FILLED_BLOCKED = { "tag-picker": "C3" };

const scope = slug => `[data-family="${slug}"]`;
const formData = (page, form = "#f") => page.eval(f => [...new FormData(document.querySelector(f))], form);
const own = (entries, slug) => entries.filter(([k]) => k === slug || k === slug + "-start" || k === slug + "-end");
// What a family shows and announces: field values, checked states, ARIA state and its rendered text. A closed
// popover's content isn't shown, so it is left out (hidden inputs are kept: they are what the form sends).
const shown = (page, slug) => page.eval(s => {
  const root = document.querySelector(s);
  const seen = e => e.type === "hidden" || e.checkVisibility(); // display: none (a closed popover) is not shown
  const parts = [...root.querySelectorAll("input, textarea, select")].filter(seen).map(e => `${e.type}:${e.type === "checkbox" || e.type === "radio" ? e.checked : e.value}`);
  for (const e of [...root.querySelectorAll("[aria-checked], [aria-pressed], [aria-selected='true'], [aria-valuenow], [aria-valuetext]")].filter(seen))
    parts.push(["aria-checked", "aria-pressed", "aria-selected", "aria-valuenow", "aria-valuetext"].map(a => e.getAttribute(a)).join("/"));
  parts.push(root.innerText.replace(/\s+/g, " ").trim());
  return parts.join(" | ");
}, scope(slug));
// The centre of the element under `slug` whose own text is `text` (or of a selector), for a real click.
const at = (page, slug, { text, selector }) => page.eval((s, text, selector) => {
  const root = document.querySelector(s);
  let el = selector ? root.querySelector(selector) : [...root.querySelectorAll("*")].reverse().find(e => e.textContent.trim() === text && e.getClientRects().length);
  if (!el) return null;
  if (el.getBoundingClientRect().width < 4) el = el.closest("label") ?? el.parentElement;
  el.scrollIntoView({ block: "center" });
  const b = el.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}, scope(slug), text ?? null, selector ?? null);
async function clickIn(page, slug, what) { const p = await at(page, slug, what); must(p, `${slug}: ${JSON.stringify(what)} is on the page`); await page.click(p); }

// A real change to each family's value, by pointer and keys.
const CHANGE = {
  "input": async p => { await clickIn(p, "input", { selector: "input" }); await p.press("End"); await p.type("x"); },
  "textarea": async p => { await clickIn(p, "textarea", { selector: "textarea" }); await p.press("End"); await p.type("x"); },
  "password-field": async p => { await clickIn(p, "password-field", { selector: "input" }); await p.press("End"); await p.type("x"); },
  "search-field": async p => { await clickIn(p, "search-field", { selector: "input" }); await p.press("End"); await p.type("x"); },
  "number-field": async p => { await clickIn(p, "number-field", { selector: "input" }); await p.press("ArrowUp"); await p.press("Tab"); },
  "color-field": async p => { await clickIn(p, "color-field", { selector: "input" }); await p.press("End"); await p.press("Backspace"); await p.type("0"); await p.press("Tab"); },
  "otp-field": async p => { await clickIn(p, "otp-field", { selector: "input" }); await p.press("End"); await p.press("Backspace"); },
  "select": async p => { await p.eval(s => document.querySelector(s + " select").focus(), scope("select")); await p.type("g"); },
  "checkbox": async p => clickIn(p, "checkbox", { text: "Checkbox" }),
  "switch": async p => clickIn(p, "switch", { text: "Switch" }),
  "radio-group": async p => clickIn(p, "radio-group", { text: "Three" }),
  "slider": async p => { await p.eval(s => document.querySelector(s + " input").focus(), scope("slider")); await p.press("ArrowRight"); },
  "slider-range": async p => { await p.eval(s => document.querySelector(s + " input[type=range]").focus(), scope("slider-range")); await p.press("ArrowRight"); },
  "segmented": async p => clickIn(p, "segmented", { text: "Month" }),
  "toggle-group": async p => clickIn(p, "toggle-group", { text: "Italic" }),
  "color-swatch-picker": async p => { await p.eval(s => document.querySelector(s + " input[value='#e5484d']").focus(), scope("color-swatch-picker")); await p.press(" "); },
  "alignment-picker": async p => { await p.eval(s => document.querySelector(s + " input[value='top-left']").focus(), scope("alignment-picker")); await p.press(" "); },
  "custom-select": async p => { await p.eval(s => document.querySelector(s + " button").focus(), scope("custom-select")); await p.press("ArrowDown"); await p.settle(); await p.press("ArrowDown"); await p.press("Enter"); },
  "combobox": async p => { await clickIn(p, "combobox", { selector: "input:not([type=hidden])" }); for (let i = 0; i < 4; i++) await p.press("Backspace"); await p.type("gr"); await p.press("ArrowDown"); await p.press("Enter"); },
  "tag-picker": async p => { await clickIn(p, "tag-picker", { selector: "input:not([type=hidden])" }); await p.type("co"); await p.settle(); await p.press("ArrowDown"); await p.press("Enter"); await p.press("Escape"); },
  "date-picker": async p => { await clickIn(p, "date-picker", { selector: "button" }); await p.settle(); await clickIn(p, "date-picker", { selector: "button[data-date='2026-11-12']" }); await p.settle(); },
  "date-range-picker": async p => { await clickIn(p, "date-range-picker", { selector: "button" }); await p.settle(); for (const d of ["2026-11-16", "2026-11-18"]) await clickIn(p, "date-range-picker", { selector: `button[data-date='${d}']` }); await p.settle(); },
  "time-field": async p => { await p.eval(s => document.querySelector(s + " [role=spinbutton]").focus(), scope("time-field")); await p.press("ArrowUp"); },
  "box-field": async p => { await p.eval(s => document.querySelector(s + " input").focus(), scope("box-field")); await p.press("ArrowUp"); await p.press("Tab"); },
  "calendar": async p => clickIn(p, "calendar", { selector: "button[data-date='2026-11-12']" }),
};

behaviour("forms", ({ it, gap }) => {
  for (const slug of Object.keys(DEFAULTS)) {
    const test = NO_SUBMIT[slug] ? (n, f, o) => gap(NO_SUBMIT[slug], n, f, o) : it;
    test(`${slug}: submits its name and value`, async page => {
      await page.step("FormData", async () => assert.deepEqual(own(await formData(page), slug), DEFAULTS[slug]));
    }, { query: "?mode=values", fresh: false });
  }

  for (const slug of Object.keys(DEFAULTS)) {
    const test = NO_RESET[slug] ? (n, f, o) => gap(NO_RESET[slug], n, f, o) : it;
    test(`${slug}: the form's Reset puts back the default value and what it shows`, async page => {
      const data0 = own(await formData(page), slug), shown0 = await shown(page, slug);
      await page.step("change the value with real input", async () => {
        await CHANGE[slug](page); await page.settle();
        const changed = JSON.stringify(own(await formData(page), slug)) !== JSON.stringify(data0) || (await shown(page, slug)) !== shown0;
        must(changed, `${slug} changed (data ${JSON.stringify(own(await formData(page), slug))}, shown ${await shown(page, slug)})`);
      });
      await page.step("press Reset", async () => {
        await page.eval(() => document.querySelector("#reset").scrollIntoView({ block: "center" }));
        await page.click("#reset"); await page.settle();
        assert.deepEqual(own(await formData(page), slug), data0, "submitted value after reset");
        assert.equal(await shown(page, slug), shown0, "what the control shows after reset");
      });
    }, { query: "?mode=values" });
  }

  for (const slug of REQUIRED) {
    const test = NOT_REQUIRED[slug] ? (n, f, o) => gap(NOT_REQUIRED[slug], n, f, o) : it;
    test(`${slug}: required and empty, pressing the submit button doesn't submit`, async page => {
      await page.step("press Send", async () => {
        await page.eval(s => document.querySelector(s).scrollIntoView({ block: "center" }), `#submit-${slug}`);
        await page.click(`#submit-${slug}`);
        assert.equal(await page.eval(id => window.__submits[id] ?? 0, `req-${slug}`), 0, "the form submitted");
        assert.equal(await page.eval(id => document.getElementById(id).checkValidity(), `req-${slug}`), false, "the form reports itself valid");
      });
    }, { query: "?mode=required", fresh: false });
  }

  for (const slug of REQUIRED) {
    const test = FILLED_BLOCKED[slug] ? (n, f, o) => gap(FILLED_BLOCKED[slug], n, f, o) : it;
    test(`${slug}: required and holding a value, pressing the submit button submits`, async page => {
      await page.step("press Send", async () => {
        await page.eval(s => document.querySelector(s).scrollIntoView({ block: "center" }), `#submit-${slug}`);
        await page.click(`#submit-${slug}`);
        assert.equal(await page.eval(id => window.__submits[id] ?? 0, `req-${slug}`), 1);
      });
    }, { query: "?mode=filled", fresh: false });
  }

  // I6 says Combobox has no `required`: in the browser it reaches the visible field, and leaving the field drops text
  // that chose nothing, so the required field is empty again and blocks the submit.
  it("combobox: required, with text typed but no option chosen, doesn't submit an empty value", async page => {
    await clickIn(page, "combobox", { selector: "input:not([type=hidden])" });
    await page.type("zz"); await page.press("Escape"); await page.settle();
    await page.step("press Send", async () => {
      await page.eval(() => document.querySelector("#submit-combobox").scrollIntoView({ block: "center" }));
      await page.click("#submit-combobox");
      const sent = await page.eval(() => window.__submits["req-combobox"] ?? 0);
      assert.equal(sent, 0, `submitted combobox=${JSON.stringify(await page.eval(() => new FormData(document.getElementById("req-combobox")).get("combobox")))}`);
    });
  }, { query: "?mode=required" });

  it("disabled controls submit nothing", async page => {
    const names = new Set((await formData(page)).map(([k]) => k.replace(/-(start|end)$/, "")));
    await page.step("FormData has no name but the known gaps", async () => {
      assert.deepEqual([...names].filter(n => !SUBMITS_DISABLED[n]), []);
    });
  }, { query: "?mode=disabled", fresh: false });

  for (const [slug, item] of Object.entries(SUBMITS_DISABLED)) {
    gap(item, `${slug}: disabled, submits nothing`, async page => {
      await page.step("FormData", async () => assert.deepEqual(own(await formData(page), slug), []));
    }, { query: "?mode=disabled", fresh: false });
  }
});
