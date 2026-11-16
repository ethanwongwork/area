// Gallery demos show their state (system evaluation F3.3, 2026-11-11). A tile that says its text "wraps onto a second
// line" has to wrap at the default type: five tiles rendered one line (Figure's long caption, Board's long title, Section
// heading's lede, Message's stack; Editable text's long title, which truncates by design, now says so) and Alert's
// multiline broke on every word. The test has no
// DOM, so it reads each gallery demo's source: the width that holds the text (the demo's own, or the component's measure
// below) and the text's length at a lower bound of the default type's average advance.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
// @ts-expect-error — plain ES module without types.
import { GALLERY_SPECIMENS } from "../src/content/specimens.mjs";

const folder = new URL("../src/content/demos/", import.meta.url);
const files = readdirSync(folder).filter(name => name.endsWith(".tsx")).map(name => ({ name, source: readFileSync(new URL(name, folder), "utf8") }));
const tiles = new Set((Object.values(GALLERY_SPECIMENS) as Array<Array<{ demo: string }>>).flat().map(example => example.demo));
/* The average advance of the default UI type (13/18, Inter) is about 5.5 px a character ("Caption that wraps onto a second
   line", 37 characters, measured 207 wide); 5 is the lower bound, so text this test passes wraps with room to spare. */
const ADVANCE = 5;
/* Components that set the measure their text wraps in themselves (their CSS), when the demo gives no narrower width. */
const MEASURES: Record<string, number> = {
  BoardCard: 276, // board.css: a column's 276
  HoverCard: 320, // surface.css: Popover's 320 (--area-popover-inline-size)
  Attachment: 160, // attachment.css: a quote is 2.5 × the 64 tile
  FileTile: 144, // file-tile.css: the md figure and 24 either side
  Message: 432, // message.css: a bubble's cap, 48 short of a 480 column
};
/* A width written in a demo: px, or the spacing ladder (`calc(var(--area-space-96) * 2 + var(--area-space-48))`). */
const px = (value: string) => {
  const number = Number(value);
  if (Number.isFinite(number)) return number;
  const calc = value.match(/^calc\(var\(--area-space-(\d+)\) \* ([\d.]+)(?: \+ var\(--area-space-(\d+)\))?\)$/);
  return calc ? Number(calc[1]) * Number(calc[2]) + Number(calc[3] ?? 0) : undefined;
};
const widths = (text: string) => [...text.matchAll(/(?:inlineSize|maxInlineSize|width):\s*"?([^",}]+)"?|width=\{(\d+)\}/g)]
  .map(match => px((match[1] ?? match[2]!).trim())).filter((value): value is number => value !== undefined && value > 0);

/* Comments say what a demo shows; only its code and copy are read. */
const code = (source: string) => source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const wrapDemos = files.flatMap(({ name, source }) => code(source).split(/\n(?=export const )/).flatMap(block => {
  const demo = block.match(/^export const (\w+)/)?.[1];
  if (!demo || !tiles.has(demo) || !/wraps onto/.test(block)) return [];
  // The demo's own widths, and those of the file's constants it uses (const frame = { inlineSize: 240 }).
  const constants = [...source.matchAll(/^const (\w+)(?::[^=]+)? = ([^\n]+)/gm)].filter(([, id]) => new RegExp(`\\b${id}\\b`).test(block));
  const measures = [...widths(block), ...constants.flatMap(([, , value]) => widths(value!)),
    ...Object.entries(MEASURES).filter(([component]) => new RegExp(`<${component}\\b`).test(block)).map(([, width]) => width)];
  const copy = [...block.matchAll(/"([^"]*wraps onto[^"]*)"|>([^<>{}]*wraps onto[^<>{}]*)</g)].map(match => (match[1] ?? match[2]!).split("\\n").at(-1)!.trim());
  return [{ file: name, demo, measure: measures.length ? Math.min(...measures) : undefined, copy }];
}));

test("the gallery's wrap demos are found", () => {
  const names = wrapDemos.map(entry => entry.demo);
  for (const demo of ["GalleryFigureLongCaption", "GalleryBoard", "GallerySectionHeadingLede", "GalleryMessageGroup", "GalleryAlertMultiline"]) {
    assert.ok(names.includes(demo), `${demo} is a wrap demo`);
  }
});

test("a tile whose text wraps onto a second line wraps at the default type", () => {
  for (const { file, demo, measure, copy } of wrapDemos) {
    assert.ok(measure, `${file} ${demo}: states the width its text wraps in (a width of its own, or a component in MEASURES)`);
    for (const text of copy) {
      assert.ok(text.length * ADVANCE > measure!, `${file} ${demo}: "${text}" (${text.length} characters, at least ${text.length * ADVANCE} px) wraps in ${measure} px`);
    }
  }
});
