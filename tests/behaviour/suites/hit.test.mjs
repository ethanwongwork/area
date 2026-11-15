// Hit targets (WCAG 2.5.8; geometry.md G3; plan A11.2: any interactive box under 24 carries a 24 target, 44 under a
// coarse pointer). Fixture: fixtures/hit.jsx, every family at its smallest size at Compact. Each interactive element
// must own a 24 px circle around its centre, probed with elementFromPoint (hit-probe.mjs). The coarse tests emulate a
// touch device (Emulation.setTouchEmulationEnabled, which sets pointer: coarse and hover: none).
import assert from "node:assert/strict";
import { behaviour, must } from "../suite.mjs";
import { probeTargets } from "../hit-probe.mjs";

const SIZE = 24, COARSE = 44;
// Families whose smallest targets still miss (none since Phase 2: Number field's steppers sit 24 centre to centre
// and Split button's trigger is at least 24 wide).
const GAPS = {};
const FAMILIES = ["button", "input", "number-field", "chip", "nav", "split-button", "segmented", "toggle-group", "breadcrumb",
  "color-swatch-picker", "step", "tag", "badge", "toggletip", "checkbox", "switch", "radio", "tabs", "pagination", "slider",
  "tree-view", "calendar", "toast"];
// Under a coarse pointer a part's target grows to 44 on every axis that no neighbour target meets (A11.2): both for a
// part on its own, block for a part with a neighbour beside it (a field's action, joined items, a chip's label and
// remove, breadcrumb parts), inline for a part stacked with others (checkbox and radio rows). Families not listed meet
// a neighbour on both axes in their composition (rows, grids, steppers beside a field's action) or keep their 24
// controls at every pointer (Button, Tabs, Tree view, Calendar, Pagination, Toast); a 44 target there needs the touch
// size or more space, not an invisible box. A second entry limits the check to the family's small parts (a field's
// action, not the field).
const COARSE_AXES = {
  "tag": ["both"], "badge": ["both"], "toggletip": ["both"], "switch": ["both"], "slider": ["both"],
  "input": ["block", ".area-input__action-button"], "number-field": ["block", ".area-number-field__step"],
  "chip": ["block"], "split-button": ["block", ".area-split-button__trigger"], "segmented": ["block"],
  "toggle-group": ["block", ".area-button"], "breadcrumb": ["block"], "checkbox": ["inline"], "radio": ["inline"],
};

behaviour("hit", ({ it, gap }) => {
  for (const fam of FAMILIES) {
    const test = GAPS[fam] ? (n, f, o) => gap(GAPS[fam], n, f, o) : it;
    test(`${fam}: every interactive element owns a ${SIZE} px target`, async page => {
      const found = await page.eval(`(${probeTargets})('[data-family="${fam}"]', ${SIZE})`);
      await page.step("probe", async () => {
        must(found.length > 0, `${fam} rendered an interactive element`);
        const misses = found.filter(t => t.misses.length).map(t => `${t.name} ${t.box}: ${t.misses.join(" ")}`);
        assert.deepEqual(misses, [], `targets under ${SIZE}:\n  ${misses.join("\n  ")}`);
      });
    }, { fresh: false });
  }
});

// No target takes a neighbour's (plan A11.2; owner, 2026-11-13): along a joined pair (Split button's action and trigger,
// Number field's two steppers) the first's last pixel and the second's first pixel past it (a shared border counted once), and the middle of any gap, belongs
// to the part on that side, so each owns its own 24 with no overlap, the icon-only and the joined forms alike.
behaviour("hit", ({ it }) => {
  for (const [fam, pair] of [["split-button", ".area-split-button > button"], ["number-field", ".area-number-field__steppers > button"]]) {
    it(`${fam}: no target overlaps its neighbour`, async page => {
      const found = await page.eval(`(() => {
        const out = [];
        for (const group of document.querySelectorAll('[data-family="${fam}"] ${pair.split(" > ")[0]}')) {
          const parts = [...group.querySelectorAll(':scope > ${pair.split(" > ")[1]}')].filter(b => b.checkVisibility());
          for (let i = 0; i + 1 < parts.length; i++) {
            const [a, b] = parts.slice(i, i + 2);
            a.scrollIntoView({ block: "center" });
            const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), y = ra.y + ra.height / 2;
            const seam = (Math.min(ra.right, rb.left) + Math.max(ra.right, rb.left)) / 2;
            const left = document.elementFromPoint(ra.right - 1, y), right = document.elementFromPoint(Math.max(ra.right, rb.left) + 1, y);
            const owns = (el, n) => !!n && (n === el || el.contains(n));
            if (!owns(a, left)) out.push(a.getAttribute("aria-label") + " loses its end to " + (left?.className || left?.localName));
            if (!owns(b, right)) out.push(b.getAttribute("aria-label") + " loses its start to " + (right?.className || right?.localName));
            if (rb.left - ra.right >= 2) { const mid = document.elementFromPoint(seam, y); if (!owns(a, mid) && !owns(b, mid)) out.push("the gap between them belongs to neither: " + (mid?.className || mid?.localName)); }
          }
        }
        return out;
      })()`);
      await page.step("probe", async () => assert.deepEqual(found, [], found.join("\n")));
    }, { fresh: false });
  }
});

behaviour("hit", ({ it }) => {
  let touch = false;
  for (const [fam, [axes, only = null]] of Object.entries(COARSE_AXES)) {
    it(`${fam}: under a coarse pointer every interactive element owns ${COARSE} px (${axes})`, async page => {
      if (!touch) {
        await page.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
        await page.reload();
        touch = true;
      }
      must(await page.eval(() => matchMedia("(pointer: coarse)").matches), "the page reads a coarse pointer");
      const found = await page.eval(`(${probeTargets})('[data-family="${fam}"]', ${COARSE}, ${JSON.stringify(axes)}, ${JSON.stringify(only)})`);
      await page.step("probe", async () => {
        must(found.length > 0, `${fam} rendered an interactive element`);
        const misses = found.filter(t => t.misses.length).map(t => `${t.name} ${t.box}: ${t.misses.join(" ")}`);
        assert.deepEqual(misses, [], `coarse targets under ${COARSE} (${axes}):\n  ${misses.join("\n  ")}`);
      });
    }, { fresh: false });
  }
});
