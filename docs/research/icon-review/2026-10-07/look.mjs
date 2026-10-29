// One look at a few icons, safe to run from parallel sessions: emits only the named icons from their
// sources (gen-pilot-icons --only --emit) into a private cache folder, so nothing shared is written.
// Each row: outline and filled at 16 / 24 / 32 / 48 through the real size curve, then both at 96px over
// the 16px grid. --before adds the session's starting drawing above each icon (BEFORE_TSX, default
// packages/icons/.cache/before.tsx); --slivers runs the sliver and island check on the emitted
// icons at 16 and 48. Any argument ending in .svg (a Fluent cut in node_modules/@fluentui/svg-icons/icons,
// a reference in packages/icons/.cache/refs, a candidate in your scratchpad) is drawn as a reference row at
// the same sizes, below the icons, for looking only.
//   node docs/research/icon-review/2026-10-07/look.mjs out.png name,name… [ref.svg …] [--before] [--slivers]
import { build } from "esbuild"; import { writeFileSync, mkdtempSync, existsSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process"; import { edgeShot } from "./edge.mjs"; import { resolve } from "node:path";
const args = process.argv.slice(2), flags = new Set(args.filter(a => a.startsWith("--")));
const [out, ...rest] = args.filter(a => !a.startsWith("--"));
const items = rest.flatMap(a => a.split(",")).filter(Boolean);
const refs = items.filter(a => a.endsWith(".svg")).map(f => resolve(f)), names = items.filter(a => !a.endsWith(".svg"));
for (const f of refs) if (!existsSync(f)) { console.log("missing reference " + f); process.exit(1); }
if (!out || !items.length) { console.log("usage: look.mjs out.png name,name… [--before] [--slivers]"); process.exit(1); }
const root = process.cwd(), cache = mkdtempSync(root + "/packages/icons/.cache/look-");
const BEFORE = process.env.BEFORE_TSX || root + "/packages/icons/.cache/before.tsx";
try {
  if (!names.length) writeFileSync(cache + "/p.tsx", "export const PILOT_ICONS = [];");
  else { const lint = (() => { try { return execFileSync("node", ["packages/icons/scripts/generate.mjs", "--only", names.join(","), "--emit", cache + "/p.tsx"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); }
    catch (e) { return (e.stdout || "") + (e.stderr || ""); } })();
  console.log(lint.trim()); }
  if (!existsSync(cache + "/p.tsx")) { console.log("lint failed: no render (fix the source and run again)"); process.exit(1); }
  const before = flags.has("--before") && existsSync(BEFORE);
  writeFileSync(cache + "/lk.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server";
import { PILOT_ICONS as A } from "${cache}/p.tsx";${before ? ` import { PILOT_ICONS as B } from "${BEFORE}";` : " const B = [];"}
const sizes = [16, 24, 32, 48];
const set = C => h("span", { className: "c" }, ...sizes.map(s => h(C, { size: s })));
const img = (f, s) => h("img", { src: "file://" + f, width: s, height: s });
const refRow = f => h("div", { className: "r ref" }, h("span", { className: "l" }, f.split("/").pop().replace(".svg", "")), h("span", { className: "c" }, ...sizes.map(s => img(f, s))), h("span", { className: "c" }), h("span", { className: "g" }, img(f, 96)), h("span", { className: "g0" }));
const row = (label, p, cls) => h("div", { className: "r " + cls }, h("span", { className: "l" }, label), set(p.Icon), set(p.Filled), h("span", { className: "g" }, h(p.Icon, { size: 96 })), h("span", { className: "g" }, h(p.Filled, { size: 96 })));
export const html = (names, refs) => renderToStaticMarkup(h("div", null,
  h("div", { className: "r hd" }, h("span", { className: "l" }), h("span", { className: "c" }, "Outline 16 / 24 / 32 / 48"), h("span", { className: "c" }, "Filled 16 / 24 / 32 / 48"), h("span", { className: "g0" }, "Outline 96"), h("span", { className: "g0" }, "Filled 96")),
  ...names.flatMap(n => { const a = A.find(p => p.name === n), b = B.find(p => p.name === n);
    if (!a) return [h("div", { className: "r" }, "no icon " + n)];
    return [b ? row(n + " · before", b, "before") : null, row(b ? n + " · after" : n, a, "after")].filter(Boolean); }), ...refs.map(refRow)));`);
  await build({ entryPoints: [cache + "/lk.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/lk.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
  const { html } = await import(cache + "/lk.out.mjs");
  const grid = "background-color:#fff;background-image:linear-gradient(#eee 1px,transparent 1px),linear-gradient(90deg,#eee 1px,transparent 1px);background-size:6px 6px;";
  writeFileSync(cache + "/lk.html", `<!doctype html><style>body{font:13px system-ui;margin:12px;color:#111;background:#fff;--area-weight-icon:1.125px;--_icon-overlap:4.5px}.r{display:flex;align-items:center;gap:10px;border-bottom:1px solid #eee;padding:6px 0}.r.before{color:#777;border-bottom:1px dashed #ddd}.r.before svg{color:#555}.r.ref{color:#36c}img{display:block}.hd{color:#777;font-weight:600;font-size:12px}.l{width:170px}.c{width:200px;display:flex;align-items:center;gap:12px}.g,.g0{width:96px;margin-left:8px}.g{${grid}}svg{display:block}</style>${html(names, refs)}`);
  const rows = names.length * (before ? 2 : 1) + refs.length;
  await edgeShot(["--user-data-dir=" + cache + "/prof", "--no-first-run", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=900,${50 + 110 * rows}`], out, "file://" + cache + "/lk.html");
  console.log(out);
  if (flags.has("--slivers") && names.length) for (const size of ["", "48"]) {
    const res = execFileSync("node", ["docs/research/icon-review/2026-10-02/slivers.mjs", names.join(",")], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], env: { ...process.env, LOOK_CACHE: cache, PILOT_TSX: cache + "/p.tsx", ...(size ? { SLIVER_SIZE: size } : {}) }, timeout: 600000 });
    console.log(`slivers${size ? " at " + size : " at 16"}: ${res.trim()}`);
  }
} finally { rmSync(cache, { recursive: true, force: true }); }
