// Suite helper over node:test: one headless Edge per suite file, a fresh page (reload) per test, and expected failures
// tied to a plan item (docs/research/system-evaluation-2026-11-11/README.md, section 5).
//
//   behaviour("menu", ({ it, gap }) => {
//     it("Escape closes and returns focus", async page => { … });
//     gap("C1.1", "a diagonal move keeps the submenu open", async page => { … });
//   });
//
// `it` must pass. `gap(item, …)` asserts the reference behaviour that plan item will build: it passes while an
// assertion inside fails (the known gap), and FAILS once every assertion holds, saying the gap looks fixed, so the mark
// is removed in the same change that fixes it. A gap whose body breaks for another reason (a missing element, a
// timeout, a harness error) fails too: only an AssertionError counts as the gap.
import { test, before, after } from "node:test";
import { AssertionError } from "node:assert";
import { open } from "./harness.mjs";

const isAssertion = e => e instanceof AssertionError || e?.name === "AssertionError" || (e?.cause && isAssertion(e.cause));

/** A precondition inside a gap: when it fails the test fails (a plain Error), it is never read as the gap. */
export function must(condition, message) { if (!condition) throw new Error(`Precondition failed: ${message}`); }

export function behaviour(fixture, define, { query = "" } = {}) {
  let page;
  // A launch that hangs fails the suite in two minutes rather than holding the run.
  before(async () => { page = await open(fixture, { query }); }, { timeout: 120000 });
  after(async () => { await page?.close(); });
  // `fresh: false` reuses the page when it already shows that query: for tests that only read, or that touch only
  // their own part of the fixture (a form of their own), so a suite of many small checks stays fast.
  let current = null, dirty = true;
  const run = async (fn, q = query, fresh = true) => {
    if (fresh || dirty || current !== q) { await page.reload(q); current = q; }
    dirty = fresh; // a fresh test may leave state behind; the next reusing test reloads
    page.steps = [];
    await fn(page);
  };
  const it = (name, fn, { query: q, fresh = true } = {}) => test(name, { timeout: 30000 }, () => run(fn, q, fresh));
  const gap = (item, name, fn, { query: q, fresh = true } = {}) => test(`[expected failure ${item}] ${name}`, { timeout: 30000 }, async t => {
    try { await run(fn, q, fresh); }
    catch (error) {
      if (!isAssertion(error)) throw error;
      t.diagnostic(`gap ${item} still open: ${String(error.message).split("\n").slice(0, 2).join(" ")}`);
      return;
    }
    throw new Error(`Plan item ${item} looks fixed: "${name}" now holds. Change gap("${item}", …) to it(…) in this suite.`);
  });
  define({ it, gap, page: () => page });
}
