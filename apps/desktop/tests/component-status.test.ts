// The status registry (src/content/component-status.mjs; system evaluation F4, 2026-11-11): no family is silently
// Unrefined, and why a family is In review is data the family's page shows, not only a comment.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { COMPONENT_PAGES } from "../src/content/pages.mjs";
import { componentStatus, COMPLETE_COMPONENTS, INTENTIONALLY_UNREFINED, REVIEW_COMPONENTS, REVIEW_REASONS } from "../src/content/component-status.mjs";

const slugs = (COMPONENT_PAGES as Array<{ slug: string }>).map(page => page.slug);

test("every page resolves to Complete, In review or Deprecated unless it is listed as intentionally Unrefined", () => {
  const unrefined = slugs.filter(slug => componentStatus(slug) === "unrefined" && !INTENTIONALLY_UNREFINED.has(slug));
  assert.deepEqual(unrefined, [], "add each to REVIEW_COMPONENTS (with a reason) or to INTENTIONALLY_UNREFINED (with why)");
});

test("each intentionally Unrefined page exists, is still Unrefined and says why", () => {
  for (const [slug, why] of INTENTIONALLY_UNREFINED) {
    assert.ok(slugs.includes(slug), `${slug} has no page`);
    assert.equal(componentStatus(slug), "unrefined", `${slug} has a stage now: take it off the list`);
    assert.ok(typeof why === "string" && why.trim().length > 0, `${slug} needs a reason`);
  }
});

test("every In review family has a dated reason with a source", () => {
  for (const slug of slugs.filter(slug => componentStatus(slug) === "review")) {
    const entry = REVIEW_REASONS.get(slug);
    assert.ok(entry, `${slug} is In review with no entry in REVIEW_REASONS`);
    assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/, `${slug}: date is YYYY-MM-DD`);
    assert.ok(!Number.isNaN(Date.parse(entry.date)), `${slug}: date is a real day`);
    assert.ok(entry.reason.trim().length > 0, `${slug}: reason is empty`);
    // WRITING.md: sentence case, no full stop.
    assert.match(entry.reason, /^[A-Z]/, `${slug}: reason starts with a capital`);
    assert.doesNotMatch(entry.reason, /\.\s*$/, `${slug}: reason ends without a full stop`);
    assert.match(entry.source, /^docs\//, `${slug}: source is a docs/ path`);
    assert.ok(existsSync(new URL(`../../../${entry.source}`, import.meta.url)), `${slug}: ${entry.source} does not exist`);
  }
});

test("a reason belongs to a family that is In review", () => {
  for (const slug of REVIEW_REASONS.keys()) {
    assert.ok(REVIEW_COMPONENTS.has(slug), `${slug} has a reason but is not in REVIEW_COMPONENTS`);
    assert.equal(componentStatus(slug), "review", `${slug} has a reason but resolves to ${componentStatus(slug)}`);
  }
});

test("no family is both Complete and In review", () => {
  assert.deepEqual([...REVIEW_COMPONENTS].filter(slug => COMPLETE_COMPONENTS.has(slug)), []);
});
