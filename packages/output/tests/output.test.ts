/**
 * The Output's contract (docs/research/system-output-2026-11-08), against the real library:
 *
 *   - the brief's proof point: two very different systems from one library into two folders; a library update writes
 *     both again cleanly and keeps local edits
 *   - the same choices give the same bytes
 *   - left-out components and options emit nothing, and narrow the React types
 *   - the merge: clean merges, conflicts with both versions, removals, the AGENTS.md block, a missing base copy
 *   - the checks and the MCP server answer from the written project alone
 *
 * Needs the tokens and icons builds (npm run build). Run: npm test -w @area/output
 */
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { before, describe, it } from "node:test";
import { parse, print } from "../src/css.ts";
import { canonical, readDefinition, type SystemDefinition } from "../src/definition.ts";
import { generate } from "../src/generate.ts";
import { loadLibrary, withChanges, type Library } from "../src/library.ts";
import { matches, merge3 } from "../src/merge.ts";
import { answer } from "../src/mcp.ts";
import { captureArgs, pictureBlocker } from "../src/picture.ts";
import { readProject } from "../src/project.ts";
import { addedLines, validate } from "../src/check.ts";
import { apply, folder, plan, summary, writeDefinition, type Prefer } from "../src/write.ts";

const ROOT = resolve(import.meta.dirname, "..", "..", "..");
let lib: Library;
before(async () => { lib = await loadLibrary(ROOT); });

/** Two systems as far apart as the settings go. */
const NORTHWIND = () => readDefinition({
  system: { id: "northwind", name: "Northwind" }, release: { version: "1.0", kind: "first" },
  themes: [{ id: "default", name: "Default" }],
});
const LUMEN = () => readDefinition({
  system: { id: "lumen", name: "Lumen" }, release: { version: "2.1", kind: "adds", note: "A night theme." },
  themes: [
    { id: "day", name: "Day", settings: { radius: "0", density: "28", type: "12", accent: "150", neutral: "warm", contrast: "4", pills: "button chip", elevation: "6", motion: "0" }, material: { bundle: "glass", overrides: { frost: "3" } }, accent: { on: true, primary: "#00b65c" }, colours: { light: "#f6f1e8" } },
    { id: "night", name: "Night", settings: { radius: "pill", density: "36", type: "15", accent: "300", neutral: "cool" }, material: { bundle: "jelly" } },
  ],
  inventory: { components: ["button", "badge", "dialog", "input", "segmented", "tabs", "card"], exclude: { button: { tone: ["discovery", "caution", "neutral"], variant: ["ghost", "outline"], flags: ["on-color"] }, badge: { tone: ["discovery"] } } },
});

function project(): string { return mkdtempSync(join(tmpdir(), "area-output-")); }
function write(dir: string, def: SystemDefinition, library: Library, prefer?: Prefer) {
  const dest = folder(dir);
  writeDefinition(dest, def);
  const p = plan(dest, def, library, generate(def, library));
  apply(dest, p, prefer);
  return { steps: p.steps, counts: summary(p.steps) };
}
const read = (dir: string, path: string) => readFileSync(join(dir, path), "utf8");
const edit = (dir: string, path: string, change: (text: string) => string) => writeFileSync(join(dir, path), change(read(dir, path)));

describe("css walker", () => {
  it("prints every Area sheet back byte for byte", () => {
    for (const [name, css] of [["axes", lib.tokens.axes], ["defaults", lib.tokens.defaults], ...lib.styles.base, ...lib.styles.components] as Array<[string, string]>) assert.equal(print(parse(css)), css, name);
  });
});

describe("merge", () => {
  it("matches lines as the longest common subsequence", () => {
    const lcs = (a: string[], b: string[]) => { const d = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0)); for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) d[i]![j] = a[i] === b[j] ? d[i + 1]![j + 1]! + 1 : Math.max(d[i + 1]![j]!, d[i]![j + 1]!); return d[0]![0]!; };
    let seed = 7;
    const rand = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let t = 0; t < 2000; t++) {
      const r = () => Array.from({ length: Math.floor(rand() * 14) }, () => "abcd"[Math.floor(rand() * 4)]!);
      const a = r(), b = r(), m = matches(a, b);
      assert.equal(m.length, lcs(a, b));
      for (const [k, [i, j]] of m.entries()) { assert.equal(a[i], b[j]); if (k) assert.ok(i > m[k - 1]![0] && j > m[k - 1]![1]); }
    }
  });
  it("takes each side's change, and marks a clash with both", () => {
    const base = "a\nb\nc\nd\ne\n";
    assert.deepEqual(merge3(base, "a\nB\nc\nd\ne\n", "a\nb\nc\nD\ne\n"), { text: "a\nB\nc\nD\ne\n", conflicts: 0 });
    const clash = merge3(base, "a\nB\nc\nd\ne\n", "a\nX\nc\nd\ne\n", { yours: "yours", theirs: "Lumen 2.2" });
    assert.equal(clash.conflicts, 1);
    assert.equal(clash.text, "a\n<<<<<<< yours\nB\n=======\nX\n>>>>>>> Lumen 2.2\nc\nd\ne\n");
  });
});

describe("generation", () => {
  it("gives the same bytes for the same choices, whatever order they were written in", () => {
    const def = LUMEN();
    const shuffled = readDefinition(JSON.parse(canonical(def).replace(/\{\s*"format"/, '{"zz":1,"format"')));
    const a = generate(def, lib).files, b = generate(shuffled, lib).files;
    assert.deepEqual(Object.keys(a), Object.keys(b));
    for (const path of Object.keys(a)) assert.equal(a[path], b[path], path);
    for (const [path, text] of Object.entries(a)) assert.ok(!text.includes("\r"), path);
  });

  it("writes only what a system holds", () => {
    const { files, held } = generate(LUMEN(), lib);
    // Chosen, plus what Dialog's and Tabs' sources need.
    for (const slug of ["button", "badge", "dialog", "input", "segmented", "tabs", "card"]) assert.ok(held.slugs.has(slug), slug);
    assert.ok(held.needed.size > 0, "needed components are followed");
    assert.ok(!held.slugs.has("calendar"));
    assert.ok(!("design-system/css/components/calendar.css" in files));
    assert.ok(!("design-system/react/components/Calendar.tsx" in files));
    assert.ok(!Object.keys(files).some(path => path.endsWith("/Theme.tsx")), "Theme switches Area's settings, which a written system has fixed");
    // Left-out options: no CSS, no type.
    const button = files["design-system/css/components/button.css"]!;
    assert.ok(!button.includes(".area-button--discovery") && !button.includes(".area-button--caution"));
    assert.ok(button.includes(".area-button--danger"));
    const manifest = files["design-system/react/manifest.ts"]!;
    const buttonManifest = /export const button = \{[\s\S]*?\} as const/.exec(manifest)![0];
    assert.ok(!buttonManifest.includes('"discovery"') && !buttonManifest.includes('"on-color"'));
    // An option the system can't do without stays, and says why.
    const kept = held.kept.map(k => `${k.slug} ${k.option}`);
    assert.ok(kept.includes("button tone=neutral"), "the default stays");
    assert.ok(!files["design-system/components.json"]!.includes('"slug": "calendar"'));
  });

  it("writes a theme sheet of the choices alone, and scopes the second theme", () => {
    const { files } = generate(LUMEN(), lib);
    const theme = files["design-system/css/theme.css"]!;
    assert.ok(!/\[data-area-radius=/.test(theme), "no setting's rules are left keyed to attributes");
    assert.ok(theme.includes('[data-area-system-theme="night"]'));
    assert.ok(theme.length < lib.tokens.axes.length / 1.5);
  });

  it("writes React that names only the held files", () => {
    const { files } = generate(LUMEN(), lib);
    const index = files["design-system/react/index.ts"]!;
    for (const m of index.matchAll(/from "\.\/components\/([^"]+)"/g)) assert.ok(`design-system/react/components/${m[1]}.tsx` in files || `design-system/react/components/${m[1]}.ts` in files, m[1]);
    for (const [path, text] of Object.entries(files)) if (path.startsWith("design-system/react/")) {
      assert.ok(!/from ["']@area\//.test(text), `${path} imports Area's packages`);
      for (const m of text.matchAll(/from ["']\.\/([A-Za-z-]+)["']/g)) assert.ok(Object.keys(files).some(f => f.startsWith(`${path.slice(0, path.lastIndexOf("/") + 1)}${m[1]}.`)), `${path} imports ${m[1]}`);
    }
  });
});

describe("the brief's proof point", () => {
  it("writes two very different systems, then a library update into both, keeping local edits", () => {
    const north = project(), lumen = project();
    try {
      assert.equal(write(north, NORTHWIND(), lib).counts.added! > 100, true);
      write(lumen, LUMEN(), lib);
      // The two are different systems.
      assert.notEqual(read(north, "design-system/css/theme.css"), read(lumen, "design-system/css/theme.css"));
      assert.ok(existsSync(join(north, "design-system/css/components/calendar.css")) && !existsSync(join(lumen, "design-system/css/components/calendar.css")));

      // Local edits: a component's CSS, a React component, the theme and the prose.
      for (const dir of [north, lumen]) {
        edit(dir, "design-system/css/components/button.css", t => t.replace(/(\.area-button \{)/, "$1\n    /* ours: product tweak */"));
        edit(dir, "design-system/react/components/Button.tsx", t => `// Ours: a note at the top.\n${t}`);
        edit(dir, "DESIGN.md", t => `${t}\n## Our notes\n\nShip on Tuesdays.\n`);
        writeFileSync(join(dir, "AGENTS.md"), `# Our project\n\nRun the tests.\n\n${read(dir, "AGENTS.md").replace(/^# Our project[\s\S]*?\n\n/, "")}`);
      }

      // A library update: a component rule, a component source, a token default and a new comment in a base sheet.
      const updated = withChanges(lib, draft => {
        draft.styles.components = draft.styles.components.map(([file, css]) => [file, file === "button.css" ? `${css}\n/* Library update: a new rule. */\n@layer area.components {\n  .area-button--lg { min-inline-size: 5rem; }\n}\n` : css]);
        draft.react.components["Button.tsx"] = draft.react.components["Button.tsx"]!.replace(/\n$/, "\n// Library update: Button.\n");
        draft.tokens.defaults = draft.tokens.defaults.replace("--area-keyboard-gap:", "--area-library-update: 1;\n    --area-keyboard-gap:");
        draft.styles.base = draft.styles.base.map(([file, css]) => [file, file === "reset.css" ? `/* Library update: reset. */\n${css}` : css]);
      });
      assert.notEqual(updated.version, lib.version);
      for (const dir of [north, lumen]) {
        const def = readDefinition(JSON.parse(read(dir, ".area/system.json")));
        const { counts, steps } = write(dir, def, updated);
        assert.equal(counts.conflict ?? 0, 0, `${dir}: ${JSON.stringify(steps.filter(s => s.action === "conflict").map(s => s.path))}`);
        assert.equal(counts.exists ?? 0, 0);
        assert.ok((counts.merged ?? 0) >= 2, "button.css and Button.tsx merge");
        const button = read(dir, "design-system/css/components/button.css");
        assert.ok(button.includes("/* ours: product tweak */") && button.includes("min-inline-size: 5rem"));
        const tsx = read(dir, "design-system/react/components/Button.tsx");
        assert.ok(tsx.startsWith("// Ours: a note at the top.") && tsx.includes("// Library update: Button."));
        assert.ok(read(dir, "design-system/css/tokens.css").includes("--area-library-update: 1;"));
        assert.ok(read(dir, "design-system/css/reset.css").startsWith("/* Library update: reset. */"));
        assert.ok(read(dir, "DESIGN.md").includes("Ship on Tuesdays."));
        const agents = read(dir, "AGENTS.md");
        assert.ok(agents.startsWith("# Our project\n\nRun the tests.") && agents.includes("<!-- area:begin"));
        // Written again from the same inputs: nothing to do.
        const again = write(dir, def, updated);
        assert.deepEqual(Object.keys(again.counts).sort(), ["kept-edits", "unchanged"].filter(k => k in again.counts).sort());
        assert.equal(again.counts.updated ?? 0, 0);
      }
    } finally { rmSync(north, { recursive: true, force: true }); rmSync(lumen, { recursive: true, force: true }); }
  });
});

describe("writing", () => {
  it("marks a clash, and settles it either way", () => {
    const dir = project();
    try {
      write(dir, NORTHWIND(), lib);
      const line = read(dir, "design-system/css/components/badge.css").split("\n").find(l => /^\s+--/.test(l))!;
      edit(dir, "design-system/css/components/badge.css", t => t.replace(line, `${line} /* ours */`));
      const updated = withChanges(lib, draft => {
        draft.styles.components = draft.styles.components.map(([file, css]) => [file, file === "badge.css" ? css.replace(line, `${line} /* library */`) : css]);
      });
      const dest = folder(dir);
      const def = NORTHWIND();
      const p = plan(dest, def, updated, generate(def, updated));
      const clash = p.steps.find(s => s.path.endsWith("badge.css"))!;
      assert.equal(clash.action, "conflict");
      assert.ok(clash.text!.includes("<<<<<<< yours") && clash.text!.includes(">>>>>>> Northwind 1.0"));
      apply(dest, p, "markers", { "design-system/css/components/badge.css": "yours" });
      assert.ok(read(dir, "design-system/css/components/badge.css").includes("/* ours */"));
      // Kept yours: the next write sees only your edit against Area's latest, and keeps it.
      const next = plan(dest, def, updated, generate(def, updated));
      assert.equal(next.steps.find(s => s.path.endsWith("badge.css"))!.action, "kept-edits");
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it("removes what a system no longer holds, unless it was edited", () => {
    const dir = project();
    try {
      write(dir, NORTHWIND(), lib);
      edit(dir, "design-system/css/components/calendar.css", t => `/* ours */\n${t}`);
      const smaller = readDefinition({ ...JSON.parse(canonical(NORTHWIND())), inventory: { components: ["button", "badge"] } });
      const { steps } = write(dir, smaller, lib);
      assert.equal(steps.find(s => s.path.endsWith("components/calendar.css"))!.action, "left");
      assert.equal(steps.find(s => s.path.endsWith("components/timeline.css"))!.action, "removed");
      assert.ok(existsSync(join(dir, "design-system/css/components/calendar.css")));
      assert.ok(!existsSync(join(dir, "design-system/css/components/timeline.css")));
      assert.ok(!existsSync(join(dir, ".area/base/design-system/css/components/timeline.css")));
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it("leaves a removed file out, and stands in the lock's hash for a missing base copy", () => {
    const dir = project();
    try {
      write(dir, NORTHWIND(), lib);
      rmSync(join(dir, "design-system/css/forced-colors.css"));
      rmSync(join(dir, ".area/base"), { recursive: true });
      const updated = withChanges(lib, draft => { draft.tokens.defaults += "\n/* update */\n"; });
      const { steps } = write(dir, NORTHWIND(), updated);
      assert.equal(steps.find(s => s.path.endsWith("forced-colors.css"))!.action, "skipped");
      assert.equal(steps.find(s => s.path.endsWith("css/tokens.css"))!.action, "updated");
      assert.ok(!existsSync(join(dir, "design-system/css/forced-colors.css")));
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it("never overwrites a file of the project's own at a path Area writes", () => {
    const dir = project();
    try {
      writeFileSync(join(dir, "DESIGN.md"), "# Ours\n");
      const { steps } = write(dir, NORTHWIND(), lib, "yours");
      assert.equal(steps.find(s => s.path === "DESIGN.md")!.action, "exists");
      assert.equal(read(dir, "DESIGN.md"), "# Ours\n");
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});

describe("the agent contract", () => {
  it("checks a change and answers over MCP from the written project alone", () => {
    const dir = project();
    try {
      write(dir, LUMEN(), lib);
      const proj = readProject(folder(dir));
      const diff = `+++ b/src/App.tsx\n@@ -1,0 +1,4 @@\n+<Button tone="discovery">Go</Button>\n+<div style={{ color: "#ff0000", padding: "13px" }} />\n+<span className="area-calendar" />\n+const x = "var(--area-not-a-token)";\n`;
      const rules = validate(addedLines(diff), proj).map(f => f.rule).sort();
      assert.deepEqual(rules, ["left-out-option", "literal-color", "literal-length", "not-in-system", "unknown-token"]);
      assert.deepEqual(validate(addedLines(`+++ b/src/ok.tsx\n@@ -1,0 +1,1 @@\n+<Button tone="danger">Delete</Button>\n`), proj), []);

      const ask = (method: string, params: Record<string, unknown> = {}, id = 1) => answer({ jsonrpc: "2.0", id, method, params }, () => proj, "0.0.0") as { result: Record<string, any>; error?: unknown };
      assert.equal(ask("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "t", version: "1" } }).result.protocolVersion, "2025-06-18");
      assert.equal(answer({ jsonrpc: "2.0", method: "notifications/initialized" }, () => proj, "0"), null);
      const tools = ask("tools/list").result.tools.map((t: { name: string }) => t.name);
      assert.deepEqual(tools, ["system.search_components", "system.get_component", "system.resolve_token", "system.validate_diff", "system.get_rules", "preview.screenshot"]);
      const found = ask("tools/call", { name: "system.search_components", arguments: { query: "dialog" } }).result.structuredContent;
      assert.equal(found.components[0].name, "Dialog");
      const button = ask("tools/call", { name: "system.get_component", arguments: { name: "Button" } }).result.structuredContent;
      assert.ok(button.without.includes("discovery") && !button.variants.tone.includes("discovery"));
      const token = ask("tools/call", { name: "system.resolve_token", arguments: { query: "bg-page" } }).result.structuredContent;
      assert.ok(token.declarations.length > 0);
      const checked = ask("tools/call", { name: "system.validate_diff", arguments: { diff } }).result.structuredContent;
      assert.equal(checked.ok, false);
      // The stateless protocol: a version in _meta, server/discover, resultType on every result.
      const modern = answer({ jsonrpc: "2.0", id: 2, method: "server/discover", params: { _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {} } } }, () => proj, "0") as { result: Record<string, unknown> };
      assert.equal(modern.result.resultType, "complete");
      assert.ok(ask("nope").error);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it("pictures a component under the theme's settings, and says why when it can't", async () => {
    const dir = project();
    try {
      write(dir, LUMEN(), lib);
      const proj = readProject(folder(dir));
      assert.ok(proj.themes.length > 0 && typeof proj.themes[0]!.settings === "object");
      const call = (args: Record<string, unknown>, context = {}) => Promise.resolve(answer({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "preview.screenshot", arguments: args } }, () => proj, "0", context)) as Promise<{ result: Record<string, any> }>;
      // What the app's capture is started with: the component's page, its specimen alone, the mode and the settings.
      const args = captureArgs("/area/apps/desktop", "/tmp/p.png", { slug: "button", mode: "dark", settings: { radius: "0", theme: "light" } });
      assert.deepEqual(args, ["/area/apps/desktop", "--capture=/tmp/p.png", "--hash=#system/area/components/button", "--clip=.studio-stage__content > *", "--pad=16", "--theme=dark", `--store={"canvas":{"radius":"0"}}`]);
      assert.equal(captureArgs("/a", "/p", { slug: "button", mode: "light", settings: {} }).some(arg => arg.startsWith("--store")), false);
      // Asked wrongly, or with nowhere to draw: an error in words, never a thrown one.
      const unknown = await call({ component: "No such thing" }, { library: ROOT });
      assert.ok(unknown.result.isError && /No component/.test(unknown.result.content[0].text));
      const nowhere = await call({ component: "Button" });
      assert.ok(nowhere.result.isError && /Area checkout/.test(nowhere.result.content[0].text));
      const bare = await call({ component: "Button" }, { library: dir });
      assert.ok(bare.result.isError && /isn't built/.test(bare.result.content[0].text));
      // Drawn for real where this checkout has the app built and a screen to draw on (not on CI).
      if (pictureBlocker(ROOT) || process.env.CI) return;
      const drawn = await call({ component: "Button", mode: "dark" }, { library: ROOT });
      assert.equal(drawn.result.isError, undefined, JSON.stringify(drawn.result.content?.[0]?.text));
      const [image, words] = drawn.result.content;
      assert.equal(image.type, "image");
      assert.equal(image.mimeType, "image/png");
      assert.equal(Buffer.from(image.data, "base64").subarray(1, 4).toString(), "PNG");
      assert.equal(JSON.parse(words.text).mode, "dark");
      assert.equal(drawn.result.structuredContent.component, "Button");
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
