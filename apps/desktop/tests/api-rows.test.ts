// A family's API tab is generated (system evaluation 2026-11-11, F5; GOVERNANCE § 7): the manifest gives each visual
// prop's values and default, the React props and their JSDoc give the rest (scripts/api-rows.mjs). pages.mjs keeps only
// what neither source holds, so a hand row may never restate a generated prop: that is how the tab drifted (Alert and
// Toast with five tones of seven, Button with "8 tones", Badge without plain, Dialog without size).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ORDER, apiRows, familiesOfParts, familyRows, groupOf, loadManifests, loadPages, manifestOfExport, partsOfPages, reactProps, restated, unreadDefaults } from "../scripts/api-rows.mjs";

const react = reactProps();
const manifests = await loadManifests();
const pages = (await loadPages()).filter((page: { docsOnly?: boolean }) => !page.docsOnly);
const parts = partsOfPages(pages, react);
const familyOf = familiesOfParts(parts, react, pages, manifests);
const all: Record<string, string[][]> = await apiRows();
const rowsOf = (slug: string) => new Map(all[slug]!.map(row => [row[0], row]));

test("no hand row restates a generated prop", () => {
  const repeated = pages.flatMap((page: { slug: string }) =>
    familyRows(page, react, manifests, parts.get(page.slug), familyOf).restated.map((row: string[]) => `${page.slug}: ${row[0]}`));
  assert.deepEqual(repeated, []);
});

test("every axis a family's React props take is in its rows, with each value and the default", () => {
  const missing: string[] = [];
  for (const page of pages) {
    const { rows } = familyRows(page, react, manifests, parts.get(page.slug), familyOf);
    const byName = new Map(rows.map((row: string[]) => [row[0], row]));
    parts.get(page.slug).forEach((name: string, index: number) => {
      const manifest = manifestOfExport(page, name, index, manifests);
      for (const prop of react[name]?.props ?? []) {
        const axis = manifest?.variants[prop.name];
        if (!axis) continue;
        const row = byName.get(index === 0 ? prop.name : `${name}: ${prop.name}`) as string[] | undefined;
        const taken = prop.literals ? axis.filter((value: string) => prop.literals.includes(value)) : axis;
        if (!row) missing.push(`${page.slug}: ${name}.${prop.name} has no row`);
        else for (const value of taken) if (!row[1].includes(JSON.stringify(value))) missing.push(`${page.slug}: ${name}.${prop.name} lacks ${value}`);
        const fallback = manifest.defaults[prop.name];
        if (row && fallback && prop.default === undefined && row[2] !== JSON.stringify(fallback)) missing.push(`${page.slug}: ${name}.${prop.name} default ${row[2]}, manifest ${fallback}`);
      }
    });
  }
  assert.deepEqual(missing, []);
});

test("the rows the audit found wrong now read from the sources", () => {
  const rows = rowsOf;
  for (const slug of ["alert", "toast"]) assert.equal(rows(slug).get("tone")![1].split(" | ").length, 7, `${slug} tones`);
  assert.equal(rows("button").get("tone")![1].split(" | ").length, 7);
  assert.match(rows("badge").get("variant")![1], /"plain"/);
  assert.match(rows("dialog").get("size")![1], /"xl"/);
  assert.ok(rows("toast").get("actions"), "Toast's slot is actions");
  assert.match(rows("toast").get("action")![3], /^Deprecated/);
});

test("a hand row that names only generated props counts as restated", () => {
  const generated = new Set(["tone", "Toaster: duration"]);
  assert.ok(restated(["tone", "x", "—"], generated, ["Toast", "Toaster"]));
  assert.ok(restated(["Toaster duration", "x", "—"], generated, ["Toast", "Toaster"]));
  assert.ok(!restated(["tone / label", "x", "—"], generated, ["Toast", "Toaster"]));
});

// A discriminated union is read branch by branch (Calendar's selectionMode printed only "single", its first branch).
test("a union of props shows every branch's values, and says when a branch-only prop applies", () => {
  const calendar = rowsOf("calendar");
  assert.equal(calendar.get("selectionMode")![1], '"single" | "range" | "multiple"');
  assert.equal(calendar.get("selectionMode")![2], '"single"');
  for (const part of ["string | null", "CalendarRange", "readonly string[]"]) assert.ok(calendar.get("value")![1].includes(part), `value takes ${part}`);
  assert.equal(calendar.get("onValueChange")![1].split(") => void").length - 1, 3, "one callback type a branch");
  // A prop that only some branches have names the discriminant's values it comes with (no family has one today: a
  // fixture props type shows it).
  const root = mkdtempSync(join(tmpdir(), "api-rows-"));
  mkdirSync(join(root, "packages/react/src/components"), { recursive: true });
  writeFileSync(join(root, "packages/react/tsconfig.json"), JSON.stringify({ compilerOptions: { strict: true, jsx: "preserve" }, include: ["src"] }));
  writeFileSync(join(root, "packages/react/src/components/Pick.tsx"), [
    "type Mode =",
    "  | {",
    "    /** One or a range. */",
    '    mode?: "one";',
    "    value?: string;",
    "  }",
    "  | {",
    '    mode: "range";',
    "    value?: [string, string];",
    "    /** The end's name. */",
    "    endLabel?: string;",
    "  };",
    "export type PickProps = Mode & {",
    "  /** Its name. */",
    "  label?: string;",
    "};",
    'export function Pick({ label = "Pick", ...props }: PickProps) { const mode = props.mode ?? "one"; return mode + label; }',
  ].join("\n"));
  try {
    const pick = new Map(reactProps(root).Pick!.props.map((prop: { name: string }) => [prop.name, prop])) as Map<string, { literals?: string[]; doc: string; default?: string; type: string }>;
    assert.deepEqual(pick.get("mode")!.literals, ["one", "range"]);
    assert.equal(pick.get("mode")!.default, '"one"', "const mode = props.mode ?? …");
    assert.equal(pick.get("value")!.type, "string | [string, string]");
    assert.equal(pick.get("endLabel")!.doc, "The end's name. Only with `mode` `range`.");
    assert.equal(pick.get("label")!.default, '"Pick"');
  } finally { rmSync(root, { recursive: true, force: true }); }
  // An alias ruled out in one branch (`options?: undefined`) keeps the type it takes in the other.
  assert.equal(rowsOf("approval").get("options")![1], "ApprovalOption[]");
});

// Defaults written in the function body (Calendar's showOutsideDays printed false when it is true).
test("a default is read from @default, then the destructuring, then `props.x ?? value` and `const y = x ?? value`", () => {
  const props = (name: string) => new Map(react[name]!.props.map((prop: { name: string }) => [prop.name, prop]));
  assert.equal((props("Calendar").get("showOutsideDays") as { default: string }).default, "true", "@default");
  assert.equal((props("Calendar").get("layout") as { default: string }).default, '"month"', "destructured in the body");
  assert.equal((props("Alert").get("layout") as { default: string }).default, '"single-line"', "const resolved = layout ?? …");
  assert.equal(rowsOf("slider").get("glide")![2], "true");
});

// A prop the code falls back for with a constant (`a ?? "md"`) and no default any form gives wants `@default`. These
// three fall back for one use, not as a default: Avatar's alt is "" only beside a visible name, Code block's code is
// empty only without `html`, Edit summary's added is 0 only beside a deleted count.
test("every default the code falls back to is readable, but three fallbacks that are not defaults", () => {
  assert.deepEqual(unreadDefaults(react).map((row: string) => row.replace(/ \(.*$/, "")), ["Avatar.alt", "CodeBlock.code", "EditSummary.added"]);
});

// A part's listing repeated another component's props (ComposerMic and ComposerAttach each listed 13 of Button's).
test("a part that extends another Area component's props lists only its own, and one line for the rest", () => {
  const composer = rowsOf("composer");
  for (const part of ["ComposerMic", "ComposerAttach"]) {
    assert.ok(!composer.has(`${part}: loading`) && !composer.has(`${part}: pill`), `${part} lists no Button prop`);
    const every = composer.get(`${part}: ...ButtonProps`)!;
    assert.match(every[3], /^And every \[Button\]\(button\.md\) prop, but `variant`/);
    assert.ok(composer.has(`${part}: label`), `${part} keeps its own`);
  }
  // A borrowed prop stays a row where the part draws it from its own manifest axis.
  for (const [slug, rows] of Object.entries(all)) for (const [name] of rows) {
    const lent = /^(?:(\w+): )?\.\.\.(\w+)Props$/.exec(name);
    if (lent) assert.ok(familyOf.has(lent[2]!), `${slug}: ${name} names a part of a family`);
  }
});

// No reference product, library or other design system is named on the API tab, and no owner history reaches it: the
// tab says what Area does in its own words (WRITING.md, Voice). Words that are also ordinary values (a color view's
// "spectrum", a progress ring's arc, the `macos` window controls) are matched as names only, with their capitals.
const NAMES_ANY_CASE = /\b(notion|figma|chatgpt|openai|radix|fluent|shadcn|claude|atlassian|geist|vercel|tailwind|are\.na|github|gitlab|slack|stripe|ariakit|react[- ]aria|headless ?ui|chakra|mantine|bootstrap|sonner|cmdk|vaul|downshift|react-day-picker|day-picker|airtable|asana|jira|dropbox|raycast|superhuman|gmail|youtube|discord|figjam|miro|shopify|salesforce|codex)\b/i;
const NAMES_CAPITALISED = /\b(Cursor|Spectrum|Primer|Linear|Material|Carbon|Polaris|Apple|Base UI|MUI|Ant Design|Arc|Sketch|Framer|Loom|Windows|Chrome|Safari|Google|Microsoft|Adobe|IBM|Lightning|Gestalt|Evergreen)\b/;
test("no reference name or owner history reaches the API tab", () => {
  const found: string[] = [];
  for (const [slug, rows] of Object.entries(all)) for (const row of rows) {
    const text = row.join(" :: ");
    if (NAMES_ANY_CASE.test(text) || NAMES_CAPITALISED.test(text) || /\(owner,? 20\d\d-|owner 20\d\d-/.test(text)) found.push(`${slug}: ${row[0]} :: ${text.slice(0, 120)}`);
  }
  assert.deepEqual(found, []);
});

// A part's rows run visual, content and slots, behaviour, callbacks, deprecated last, whatever order its interface
// declares them in (F5's ordering check, made the generator's rule).
test("every part's rows run visual, content, behaviour, callbacks, deprecated", () => {
  const wrong: string[] = [];
  for (const page of pages) parts.get(page.slug).forEach((name: string, index: number) => {
    const entry = react[name];
    if (!entry) return;
    const manifest = manifestOfExport(page, name, index, manifests);
    const prefix = index === 0 ? "" : `${name}: `;
    const byRow = new Map(entry.props.map((prop: { name: string }) => [`${prefix}${prop.name}`, prop]));
    let last = 0;
    for (const [row] of all[page.slug]!) {
      const prop = byRow.get(row);
      if (!prop || (index === 0 && /^[A-Z]\w*: /.test(row))) continue;
      const group = ORDER.indexOf(groupOf(prop, manifest));
      if (group < last) wrong.push(`${page.slug}: ${row} (${groupOf(prop, manifest)}) after a ${ORDER[last]}`);
      last = Math.max(last, group);
    }
  });
  assert.deepEqual(wrong, []);
  const slider = [...rowsOf("slider").keys()];
  assert.deepEqual(slider.slice(0, 4), ["size", "variant", "labelPosition", "orientation"]);
  assert.ok(slider.indexOf("disabled") < slider.indexOf("onValueChange"), "behaviour before callbacks");
});
