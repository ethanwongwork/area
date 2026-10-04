// How each system fills: Area outline + filled beside Fluent, Phosphor, Material Symbols (rounded)
// and SF Symbols, regular and filled, grouped by the filled problem each row shows.
// From the repository root, after `node apps/docs/scripts/icon-refs.mjs fetch` and
// `npm pack @material-symbols/svg-400` unpacked into apps/docs/.cache/refs/material-symbols:
//   node docs/research/icon-review/2026-10-04/filled-refs.mjs out.png [--sf] [--big] [group…]
// --sf renders SF Symbols from the installed app into the cache (Apple's licence: viewing only;
// never commit a sheet made with --sf).
import { build } from "esbuild"; import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process"; import { createRequire } from "node:module"; import { dirname, join } from "node:path";
const args = process.argv.slice(2), SF = args.includes("--sf"), BIG = args.includes("--big"), [out, ...pick] = args.filter(a => a !== "--sf" && a !== "--big");
const Z = BIG ? 120 : 56;
// concept: [area, fluent, phosphor, material, sf]
const GROUPS = {
  "A mark on a container's corner": [
    ["clipboard-check", "clipboard_checkmark", "clipboard-text", "assignment_turned_in", "checklist"],
    ["document-check", "document_checkmark", "file-text", "task", "doc.badge.ellipsis"],
    ["folder-add", "folder_add", "folder-plus", "create_new_folder", "folder.badge.plus"],
    ["calendar-check", "calendar_checkmark", "calendar-check", "event_available", "calendar.badge.checkmark"],
    ["cloud-check", "cloud_checkmark", "cloud-check", "cloud_done", "checkmark.icloud"],
    ["file-lock", "document_lock", "file-lock", "lock", "lock.doc"],
  ],
  "Layers: a part in front of another": [
    ["clipboard", "clipboard", "clipboard", "content_paste", "clipboard"],
    ["folder-open", "folder_open", "folder-open", "folder_open", "folder"],
    ["document", "document", "file", "draft", "doc"],
    ["calendar", "calendar", "calendar-blank", "calendar_today", "calendar"],
    ["briefcase", "briefcase", "briefcase", "work", "briefcase"],
    ["printer", "print", "printer", "print", "printer"],
  ],
  "Details inside a solid": [
    ["mail", "mail", "envelope", "mail", "envelope"],
    ["database", "database", "database", "database", "cylinder"],
    ["chat", "chat", "chat-text", "chat", "text.bubble"],
    ["clipboard-list", "clipboard_task_list_ltr", "clipboard-text", "assignment", "list.clipboard"],
    ["lock", "lock_closed", "lock", "lock", "lock"],
    ["home", "home", "house", "home", "house"],
  ],
  "Lines beside a solid": [
    ["bug", "bug", "bug", "bug_report", "ladybug"],
    ["pushpin", "pin", "push-pin", "keep", "pin"],
    ["volume", "speaker_2", "speaker-high", "volume_up", "speaker.wave.2"],
    ["mic", "mic", "microphone", "mic", "mic"],
    ["bell", "alert", "bell", "notifications", "bell"],
    ["send", "send", "paper-plane-tilt", "send", "paperplane"],
  ],
  "A frame around a subject": [
    ["image", "image", "image", "image", "photo"],
    ["person-circle", "person_circle", "user-circle", "account_circle", "person.crop.circle"],
    ["desktop", "desktop", "desktop", "desktop_windows", "desktopcomputer"],
    ["camera", "camera", "camera", "photo_camera", "camera"],
    ["eye", "eye", "eye", "visibility", "eye"],
    ["trash", "delete", "trash", "delete", "trash"],
  ],
};
const cache = process.cwd() + "/apps/docs/.cache", REFS = cache + "/refs";
const groups = Object.entries(GROUPS).filter(([g], i) => !pick.length || pick.includes(String(i)));
const read = p => existsSync(p) ? readFileSync(p, "utf8").replace(/<!--[\s\S]*?-->/g, "").replace(/<\?xml[^>]*>/, "") : "";
const FLUENT = join(dirname(createRequire(import.meta.url).resolve("@fluentui/svg-icons/package.json")), "icons");
const fluent = (s, cut) => { for (const z of [16, 20, 24]) { const v = read(join(FLUENT, `${s}_${z}_${cut}.svg`)); if (v) return v.replace("<svg ", '<svg fill="currentColor" '); } return ""; };
const ph = (n, cut) => read(join(REFS, "phosphor-icons-core/package/assets", cut, n + (cut === "regular" ? "" : "-fill") + ".svg"));
const mat = (n, fill) => read(join(REFS, "material-symbols/package/rounded", n + (fill ? "-fill" : "") + ".svg")).replace("<svg ", '<svg fill="currentColor" ');
const SFDIR = REFS + "/sf";
if (SF) { mkdirSync(SFDIR, { recursive: true }); const want = [...new Set(groups.flatMap(([, r]) => r.map(x => x[4])))].filter(n => !existsSync(`${SFDIR}/${n}.png`));
  if (want.length) execFileSync("swift", ["apps/docs/scripts/sf-render.swift", SFDIR, "40", ...want], { stdio: "ignore" }); }
const sf = n => SF && existsSync(`${SFDIR}/${n}.png`) ? `<img src="file://${SFDIR}/${n}.png">` : "";
const sff = n => SF && existsSync(`${SFDIR}/${n}.fill.png`) ? `<img src="file://${SFDIR}/${n}.fill.png">` : "";
writeFileSync(cache + "/fr.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "../src/pilot-icons.tsx";
export const area = n => { const p = PILOT_ICONS.find(x => x.name === n); return p ? [renderToStaticMarkup(h(p.Icon, { weight: 1.125 })), renderToStaticMarkup(h(p.Filled, { weight: 1.125 }))] : ["", ""]; };`);
await build({ entryPoints: [cache + "/fr.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/fr.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { area } = await import(cache + "/fr.mjs?" + Date.now());
let uid = 0; const fix = s => { const n = ++uid; return s.replace(/area-icon-[A-Za-z0-9_-]+/g, m => m + "-" + n); };
const cols = ["Area", "Fluent", "Phosphor", "Material", ...(SF ? ["SF Symbols"] : [])];
const cell = (o, f) => `<div class="c"><span>${o}</span><span>${f}</span></div>`;
const html = groups.map(([g, rows]) => `<h2>${g}</h2><div class="hd"><b></b>${cols.map(c => `<div class="c">${c}</div>`).join("")}</div>` + rows.map(([a, fl, p, m, s]) => {
  const [ao, af] = area(a);
  return `<div class="r"><b>${a}</b>${cell(fix(ao), fix(af))}${cell(fluent(fl, "regular"), fluent(fl, "filled"))}${cell(ph(p, "regular"), ph(p, "fill"))}${cell(mat(m), mat(m, true))}${SF ? cell(sf(s), sff(s)) : ""}</div>`; }).join("")).join("");
writeFileSync(cache + "/fr.html", `<!doctype html><style>body{margin:14px;font:13px system-ui;color:#111;background:#fff}h2{font-size:15px;margin:14px 0 4px}.hd,.r{display:flex;align-items:center;gap:10px}.hd{color:#777;font-size:12px}.r{border-bottom:1px solid #eee;padding:5px 0}b{width:110px;font-weight:600;font-size:12px}.c{width:${2 * Z + 30}px;display:flex;gap:12px}.c span{width:${Z + 8}px;height:${Z + 8}px;display:grid;place-items:center}.c svg,.c img{width:${Z}px;height:${Z}px;display:block}</style>${html}`);
rmSync(out, { force: true });
const H = groups.reduce((h, [, r]) => h + 50 + r.length * (Z + 19), 30);
try { execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", `--user-data-dir=${cache}/edge-fr`, `--window-size=${140 + cols.length * (2 * Z + 40)},${H}`, "--screenshot=" + out, `file://${cache}/fr.html`], { stdio: "ignore", timeout: 10000, killSignal: "SIGKILL" }); } catch (e) { if (!existsSync(out)) throw e; }
console.log(out);
