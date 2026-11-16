// A tile's name in words (src/content/specimen-names.mjs; system evaluation F3.1, 2026-11-11): the camelCase split kept
// no space after a one-letter word ("In adialog", "Anchored to atrigger") and an opening bracket was dropped ("List
// default)"). Every label the registry gives a tile is checked here, so a new specimen cannot bring either back.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
// @ts-expect-error — plain ES modules without types.
import { COMPONENT_PAGES } from "../src/content/pages.mjs";
// @ts-expect-error — as above.
import { componentSpecimens } from "../src/content/specimens.mjs";
// @ts-expect-error — as above.
import { specimenGroup, specimenLabel, specimenName, specimenValue, specimenWords } from "../src/content/specimen-names.mjs";

interface Example { id: string; title: string; demo: string; group?: string }
interface Family { slug: string; docsOnly?: boolean; examples: Example[] }
const SIZE = new Set(["xs", "sm", "md", "lg", "xl"]);

/* Every tile as the Components page labels it (pages/components.tsx, tilesOf). */
const tiles = (COMPONENT_PAGES as Family[]).filter(family => !family.docsOnly).flatMap(family => {
  const specimens = componentSpecimens(family, () => true) as Example[];
  const hasDefault = specimens.some(example => specimenName(example, family.slug) === "default");
  return specimens.map((example, index) => {
    const name: string = specimenName(example, family.slug);
    const group: string = !hasDefault && index === 0 ? "Default" : (example.group ?? specimenGroup(name, family.slug));
    const label: string = group === "Default" && !hasDefault ? name : specimenLabel(name, group);
    return { family: family.slug, example, name, group, label, value: specimenValue(example, name, group, hasDefault) as string };
  });
});

test("a name splits before every word, a one-letter word too", () => {
  assert.equal(specimenWords("inADialog"), "In a dialog");
  assert.equal(specimenWords("anchoredToATrigger"), "Anchored to a trigger");
  assert.equal(specimenWords("withAHeadingAndADisabledRow"), "With a heading and a disabled row");
  assert.equal(specimenWords("outline-success"), "Outline, success");
  assert.equal(specimenWords("sm"), "Small");
  assert.equal(specimenWords("24Hour"), "24 hour");
});

test("a title that is already words shows as written", () => {
  const find = (family: string, title: string) => tiles.find(tile => tile.family === family && tile.example.title === title);
  assert.equal(find("prompt-suggestions", "List (default)")?.value, "List (default)");
  assert.equal(find("popover", "Anchored to a trigger")?.value, "Anchored to a trigger");
  assert.equal(find("toolbar", "Variant / surface (tools)")?.value, "Surface (tools)");
  assert.equal(find("shortcut-list", "Behavior / in a dialog")?.value, "In a dialog");
  assert.equal(find("dialog", "Size / sm")?.value, "Small");
});

test("every tile's words keep their spaces and their brackets", () => {
  assert.ok(tiles.length > 1000, `the registry was read (${tiles.length} tiles)`);
  for (const tile of tiles) {
    const where = `${tile.family} "${tile.example.title}" → "${tile.value}"`;
    const opens = tile.value.split("").filter(char => "([{".includes(char)).length;
    const closes = tile.value.split("").filter(char => ")]}".includes(char)).length;
    assert.equal(opens, closes, `${where}: brackets balanced`);
    if (tile.value === (tile.example.title.split("/").at(-1) ?? "").trim().replace(/^./, first => first.toUpperCase())) continue;
    // Words read back to the label's parts exactly: a lost space ("in adialog" for inADialog) does not.
    const parts = tile.label.split("-");
    const words = tile.value.split(", ");
    assert.equal(words.length, parts.length, `${where}: one phrase per part`);
    parts.forEach((part, index) => {
      if (SIZE.has(part)) return;
      const back = words[index]!.replace(/^./, first => first.toLowerCase()).replace(/ (\w)/g, (_, next: string) => next.toUpperCase());
      assert.equal(back, part, `${where}: no space lost`);
    });
  }
});

test("the Components page labels its tiles with specimenValue", () => {
  const page = readFileSync(new URL("../src/pages/components.tsx", import.meta.url), "utf8");
  assert.ok(/specimenValue\(example, name, group, hasDefault\)/.test(page), "tilesOf reads a tile's words from specimenValue");
});
