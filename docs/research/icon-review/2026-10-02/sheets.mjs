// Explainer sheets for the 2026-10-02 decisions, rendered from the sources with headless Edge.
// From the repository root: node docs/research/icon-review/2026-10-02/sheets.mjs multiples|aligned|stacks|closed|dots|overlap|parts out.png, or grid out.png name…
// Area sources render as outlines at the true 16px line (1.125); "1×" cells rasterise at 16 device
// pixels and enlarge them unsmoothed, so whole-pixel blur shows. References are for looking only.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs"; import { execFileSync } from "node:child_process"; import { createRequire } from "node:module";
const [mode, out, ...rest] = process.argv.slice(2);
const require = createRequire(import.meta.url);
const SRC = "apps/docs/assets/area-icons-pilot/";
const FLUENT = require.resolve("@fluentui/svg-icons/package.json").replace(/package\.json$/, "icons/");
const REFS = "apps/docs/.cache/refs/";
// The outline: filled-only roles (fill, gap, stroke, halo) are not drawn.
const area = n => readFileSync(SRC + n + ".svg", "utf8").replace(/<(path|circle|rect)[^>]*data-filled="(fill|gap|stroke|halo)"[^>]*\/>\n?/g, "");
const ref = (lib, n) => {
  const p = { fluent: FLUENT + n + "_16_regular.svg", lucide: REFS + "lucide-static/package/icons/" + n + ".svg", phosphor: REFS + "phosphor-icons-core/package/assets/regular/" + n + ".svg" }[lib];
  return p && existsSync(p) ? readFileSync(p, "utf8") : "";
};
const sized = (svg, px, weight = 1.125) => svg.replace(/<svg([^>]*)>/, (m, a) => `<svg${a.replace(/\swidth="[^"]*"|\sheight="[^"]*"|\sclass="[^"]*"/g, "")} width="${px}" height="${px}">`)
  .replace(/stroke-width="1\.25"/g, `stroke-width="${weight}"`);
const icon = (svg, sizes = [16, 48]) => `<span class="ic">${sizes.map(s => sized(svg, s)).join("")}</span>`;
let rid = 0;
const raster = (svg, scale = 6) => { const id = "r" + rid++; return `<canvas id="${id}" width="16" height="16" style="width:${16 * scale}px;height:${16 * scale}px" data-svg="${encodeURIComponent(sized(svg, 16))}"></canvas>`; };
const cell = (title, body, note = "") => `<div class="cell"><div class="t">${title}</div>${body}${note ? `<div class="n">${note}</div>` : ""}</div>`;
const row = (label, cells, sub = "") => `<div class="row"><div class="lab">${label}${sub ? `<div class="sub">${sub}</div>` : ""}</div>${cells.join("")}</div>`;
const swap = (svg, pairs) => pairs.reduce((s, [a, b]) => s.split(a).join(b), svg);
const wrap = (svgBody, attrs = "") => `<svg data-set="x" ${attrs} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">${svgBody}</svg>`;
const St = 'fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"';
let html = "", width = 1500;

if (mode === "multiples") {
  const X = n => existsSync(SRC + "explore/" + n + ".svg") ? readFileSync(SRC + "explore/" + n + ".svg", "utf8") : "";
  html += `<h1>Multiples: how the back layer is drawn</h1>
  <p class="lead">Area draws stacks two ways today. <b>Halo</b> (files, folders, gallery; Fluent's): the back copy is drawn larger, its corners concentric round the front, so it reads as a second outline hugging the object. <b>Duplicate</b> (copy, chat-multiple; Lucide's, Phosphor's, SF Symbols'): the back copy is the same shape at the same radius, offset, and only its uncovered edges show. The prototypes redraw files, folders, gallery and copy as duplicates in three directions (cut round the front by the overlap cut); small lint near misses are left until a model is chosen.</p>`;
  const H = ["Today", "Duplicate, back lower right", "Duplicate, back upper left", "Duplicate, back upper right", "Fluent", "Lucide", "Phosphor"];
  html += row("", H.map(h => `<div class="cell hd">${h}</div>`));
  const rows = [
    ["files", "halo", { fluent: "document_multiple", lucide: "files", phosphor: "files" }],
    ["folders", "halo", { fluent: "folder_multiple", lucide: "folders", phosphor: "folders" }],
    ["gallery", "halo", { fluent: "image_multiple", lucide: "images", phosphor: "images" }],
    ["copy", "duplicate, back upper left", { fluent: "copy", lucide: "copy", phosphor: "copy" }],
    ["chat-multiple", "duplicate, back upper right", { fluent: "chat_multiple", lucide: "messages-square", phosphor: "chats" }],
  ];
  for (const [n, model, r] of rows) {
    const proto = ["lower-right", "upper-left", "upper-right"].map(d => X(`multiples-${n}-${d}`));
    html += row(n, [cell("", icon(area(n)), model),
      ...proto.map(p => cell("", p ? icon(p) : `<span class="dash">same as today</span>`)),
      ...["fluent", "lucide", "phosphor"].map(l => cell("", ref(l, r[l]) ? icon(ref(l, r[l]), [16, 40]) : ""))]);
  }
  html += `<p class="lead"><b>Recommendation:</b> one model for every multiple: the duplicate (same shape, same radius), back copy to the lower right. It keeps the direction you chose from Fluent (2026-09-29) and drops only the halo, which is the "extra stroke around it": a concentric outline reads as a border, not as a second object. Lower right shows the back copy's bottom and right edges, away from the fold, the tab and the picture, which all sit at the top; upper left and upper right put a stub of the back fold or tab beside the front's. copy and chat-multiple would turn to match.</p>`;
  width = 1500;
}

if (mode === "aligned") {
  const cal = area("calendar");
  const dots = [[5.5, 8.75], [8, 8.75], [10.5, 8.75], [5.5, 11.25], [8, 11.25]];
  const frame = `<rect x="2.5" y="3.5" width="11" height="10" rx="2" ${St}/><path d="M2.5 6.5H13.5" ${St}/><path d="M5.5 2V4M10.5 2V4" ${St}/>`;
  const dotsSvg = ds => ds.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.75" fill="currentColor"/>`).join("");
  const stagger = wrap(frame + dotsSvg([[5, 8.75], [8, 8.75], [11, 8.75], [6.5, 11.25], [9.5, 11.25]]));
  const oneRow = wrap(frame.replace('y="3.5"', 'y="3.5"') + dotsSvg([[5.5, 10], [8, 10], [10.5, 10]]));
  const plain = wrap(frame);
  // the big annotated drawing: 16 units at 24px each
  const k = 24, ink = 1.125;
  const ann = `<svg width="${16 * k}" height="${16 * k}" viewBox="0 0 16 16" style="background:repeating-linear-gradient(0deg,#0000 0 ${k - 1}px,#eee ${k - 1}px ${k}px),repeating-linear-gradient(90deg,#0000 0 ${k - 1}px,#eee ${k - 1}px ${k}px)">
    <g style="color:#1a1a1a">${frame.replace(/stroke-width="1.25"/g, `stroke-width="${ink}"`)}${dotsSvg(dots)}</g>
    <g stroke-width="0.08" fill="none">
      <path d="M6.25 8.75H7.25" stroke="#0a7a3d"/><path d="M5.5 9.5V10.5" stroke="#0a7a3d"/>
      <path d="M6.03 9.28L7.47 10.72" stroke="#c4321a"/>
    </g>
    <g font-size="0.55" font-family="system-ui" font-weight="600">
      <text x="6.1" y="8.1" fill="#0a7a3d">1.0</text><text x="3.4" y="10.25" fill="#0a7a3d">1.0</text>
      <text x="7.2" y="10.35" fill="#c4321a">2.04</text>
    </g></svg>`;
  // the gap scale with the marks
  const scale = (() => {
    const W = 900, x = v => 40 + (v - 0.5) * (W - 80) / 2.5;
    const band = (a, b, c, t) => `<rect x="${x(a)}" y="30" width="${x(b) - x(a)}" height="26" fill="${c}"/><text x="${(x(a) + x(b)) / 2}" y="48" text-anchor="middle">${t}</text>`;
    const mark = (v, t, c, y) => `<path d="M${x(v)} 24V62" stroke="${c}" stroke-width="2"/><text x="${x(v)}" y="${y}" text-anchor="middle" fill="${c}" font-weight="600">${t}</text>`;
    return `<svg width="${W}" height="110" font-family="system-ui" font-size="12">
      ${band(0.875, 1.125, "#e8f1fb", "detail")}${band(1.125, 1.75, "#d6e8fa", "tight")}${band(1.75, 2, "#bfdcf7", "standard")}${band(2, 2.5, "#fbe3df", "near miss")}${band(2.5, 3, "#eef6ee", "open")}
      ${mark(1.0, "calendar rows and columns 1.0", "#0a7a3d", 16)}${mark(2.04, "calendar diagonals 2.04", "#c4321a", 80)}${mark(2.14, "qr-code 2.14 (aligned, owner-approved)", "#7a4dbf", 100)}
      ${[0.5, 1, 1.5, 2, 2.5, 3].map(v => `<text x="${x(v)}" y="72" text-anchor="middle" fill="#888">${v}</text>`).join("")}</svg>`;
  })();
  html += `<h1>#2 · calendar's "aligned" exception, explained</h1>
  <p class="lead">Every gap between two separate shapes must be on Area's gap scale. Gaps between 2 and 2.5px are "near misses": too wide to read as a deliberate pair, too narrow to read as open space. An even grid of ⌀1.5 dots 2.5 apart (the only spacing on the half-pixel grid that fits two rows) leaves 1.0 between neighbours, which is fine, but 2.04 between <i>diagonal</i> neighbours, which the lint calls a near miss. <code>data-gap="aligned"</code> accepts near misses in a deliberately even grid; until now only qr-code (your request) uses it.</p>
  <div class="pair"><div>${ann}<div class="n">Calendar at 24× on the 16px grid: green gaps pass, the red diagonal is the near miss.</div></div><div>${scale}</div></div>`;
  html += row("", ["A · aligned grid (now)", "B · staggered rows", "C · one row", "D · no grid (before)"].map(h => `<div class="cell hd">${h}</div>`));
  html += row("calendar", [cell("", icon(cal, [16, 32, 64]) + raster(cal), "Fluent's even 3 + 2; needs the exception"),
    cell("", icon(stagger, [16, 32, 64]) + raster(stagger), "every gap on the scale (1.42 diagonals); reads as a pattern, not dates"),
    cell("", icon(oneRow, [16, 32, 64]) + raster(oneRow), "passes; reads less like a month"),
    cell("", icon(plain, [16, 32, 64]) + raster(plain), "passes; the audit found it empty")]);
  html += `<p class="lead"><b>Recommendation: A.</b> The exception changes nothing you see: the diagonal gap is a by-product of an even grid, and an even grid is what a calendar is. B and C pass the rule but read less like a calendar. The 1× rasters (enlarged) show the ⌀1.5 dots soften in every option, so the exception costs nothing at 1× either.</p>`;
  width = 1500;
}

if (mode === "stacks") {
  const shiftY = (svg, dy) => svg.replace(/<svg([^>]*)>/, `<svg$1><g transform="translate(0 ${dy})">`).replace("</svg>", "</g></svg>");
  const shiftX = (svg, dx) => svg.replace(/<svg([^>]*)>/, `<svg$1><g transform="translate(${dx} 0)">`).replace("</svg>", "</g></svg>");
  html += `<h1>Three-line stacks on whole pixels</h1>
  <p class="lead">A stack with an odd number of lines centred on 8 puts its middle line on a whole pixel (8), and with even spacing every line lands on a whole pixel. At 1× a 1.125px line on a whole pixel smears over two half-grey rows; on x.5 it fills one row. The only way to put them on x.5 is to move the stack 0.5 off centre (or space the lines unevenly). list (four lines) is already on x.5; menu took the whole-pixel precedent. Enlarged 1× rasters below.</p>`;
  html += row("", ["Today, centred (whole pixels)", "Moved 0.5 (on x.5, 0.5 off centre)", "Reference: list (x.5)"].map(h => `<div class="cell hd">${h}</div>`));
  const L = area("list");
  for (const [n, f] of [["text-align-left", s => shiftY(s, 0.5)], ["indent", s => shiftY(s, 0.5)], ["outdent", s => shiftY(s, 0.5)], ["waveform", s => shiftX(s, 0.5)]]) {
    const a = area(n);
    html += row(n, [cell("", icon(a, [16, 32]) + raster(a)), cell("", icon(f(a), [16, 32]) + raster(f(a))), cell("", icon(L, [16]) + raster(L))]);
  }
  html += `<p class="lead"><b>Recommendation:</b> move them to x.5. The 1× difference is larger than the audit assumed: centred lines render as two grey rows, moved ones as one black row. The cost is a stack sitting 0.5 off centre, invisible at 16px beside text and recorded as an optical exception, like the bell\'s 0.25 lift. On 2× screens both render crisp. (chip is left out: its body is already on x.5 and only its pins sit on whole pixels; moving the pins alone would make them uneven.)</p>`;
  width = 1240;
}

if (mode === "closed") {
  const X = n => readFileSync(SRC + "explore/closed-" + n + ".svg", "utf8").replace(/<(path|circle|rect)[^>]*data-filled="(fill|gap|stroke|halo)"[^>]*\/>\n?/g, "");
  html += `<h1>Cursor's technical look: close the shape</h1>
  <p class="lead">Cursor: where an icon could be open (to show overlap, or as a style), close the shape; keep it technical and simple, which also reads better at small sizes. Area today mixes three ways of showing one thing behind another: a <b>gap cut</b> (people, coins, cloud-sun, shapes; the overlap-cut rule), a <b>join</b> (files, folders, copy, chats, gallery since the Phosphor pick), and <b>open strokes</b> (alarm's bells, strikethrough's broken S). The right column closes each one the Cursor way: an object in front hides the one behind with a join; geometric shapes are both drawn whole and cross.</p>`;
  html += row("", ["Today", "Closed (prototype)", "Already closed: files today"].map(h => `<div class="cell hd">${h}</div>`));
  const F = area("files");
  for (const [n, today] of [["people", "gap cut"], ["coins", "gap cut"], ["cloud-sun", "gap cut"], ["shapes", "gap cut"], ["alarm", "open bells"], ["strikethrough", "broken S"]])
    html += row(n, [cell("", icon(area(n), [16, 48]), today), cell("", icon(X(n), [16, 48]), n === "shapes" ? "both whole, crossing" : n === "alarm" ? "closed bells" : n === "strikethrough" ? "one S" : "join, no gap"), cell("", n === "people" ? icon(F, [16, 48]) : "")]);
  html += `<p class="lead"><b>Recommendation:</b> adopt it. One rule for overlap instead of three: an object in front hides what is behind with a join (the multiples already do); shapes that are geometry (shapes, booleans, atom) cross whole; gaps stay only where something is cut on purpose: the slash on off icons, a mark or badge on a host (calendar-add's +, bell-dot's dot), an arrow through a shape (cloud-upload).</p>`;
  width = 1240;
}

if (mode === "dots") {
  html += `<h1>Dots by role</h1><p class="lead">Cursor sizes every dot by its role (five sizes at 24px). At Area's 16px they fall into the three sizes Area already uses: ⌀1.5 details, ⌀2 marks, ⌀3 badges. Four icons sit in the wrong role today.</p>`;
  const set = (n, from, to) => area(n).split(from).join(to);
  html += row("detail ⌀1.5", ["info", "warning", "help", "keyboard", "building", "chat-more", "app-window", "atom"].map(n => cell("", icon(area(n), [16, 40]), n)), "inside a drawing, punctuation, grouped in a container");
  html += row("mark ⌀2", ["more-horizontal", "grip-vertical", "wifi", "cart"].map(n => cell("", icon(area(n), [16, 40]), n)), "the icon's subject");
  html += row("badge ⌀3", ["bell-dot", "mail-dot", "chat-dot", "compass-dot"].map(n => cell("", icon(area(n), [16, 40]), n)), "a notification on a host");
  html += row("", ["list-bullet", "crosshair", "square-dot", "circle-dot-dashed"].map(h => `<div class="cell hd">${h}: today → ⌀2</div>`));
  const P2 = [["list-bullet", s => s.replace(/cx="2.75" cy="(\d+)" r="0.75"/g, 'cx="3" cy="$1" r="1"')], ["crosshair", s => s.replace('r="0.75"', 'r="1"')], ["square-dot", s => s.replace('r="1.5"', 'r="1"')], ["circle-dot-dashed", s => s.replace('r="1.5"', 'r="1"')]];
  html += row("mark, proposed", P2.map(([n, f]) => cell("", icon(area(n), [16, 40]) + `<span style="margin:0 10px;color:#999">→</span>` + icon(f(area(n)), [16, 40]), n === "list-bullet" ? "bullets are list marks (owner chose ⌀1.5 on 09-28)" : "a centre point is a mark, not a detail or a badge")));
  width = 1500;
}

if (mode === "overlap") {
  const X = n => readFileSync(SRC + "explore/closed-" + n + ".svg", "utf8").replace(/<(path|circle|rect)[^>]*data-filled="(fill|gap|stroke|halo)"[^>]*\/>\n?/g, "");
  const pair = (a, b, note) => cell("", icon(a, [16, 40]) + `<span style="margin:0 8px;color:#999">→</span>` + icon(b, [16, 40]), note);
  html += `<h1>The overlap rule, refined from Cursor's set</h1>
  <p class="lead">Cursor's whole set shows the line between the two cases: <b>a gap separates layers</b> (copy's and folders' back copy is an open L that stops short of the front; a badge or a corner mark cuts its host open), while <b>openings that only decorate are closed</b> (alarm's bells, the database's bands, strikethrough's S, and the slash, which crosses the shape flat with no gap: "no shadow effects"). Area's overlap cut is right for stacks and badges; three things are off.</p>`;
  html += row("1 · stacks", ["files", "folders", "copy", "gallery"].map(n => pair(area(n), X("stack-" + n), "join (Phosphor) → open L, gap (Cursor)")), "back copy stops a gap short");
  html += row("2 · slash", ["bell-off", "mic-off", "wifi-off", "video-off", "brain-off", "link-off"].map(n => pair(area(n), X("slash-" + n), "")), "crosses flat; the shape stays whole");
  html += row("3 · decoration", [pair(area("alarm"), X("alarm"), "open bells → closed"), pair(area("strikethrough"), X("strikethrough"), "broken S → one stroke"), pair(area("shapes"), X("shapes"), "gap → both whole, crossing")], "close it");
  html += row("keep", ["people", "coins", "cloud-sun", "calendar-add", "bell-dot", "image-plus"].map(n => cell("", icon(area(n), [16, 40]), n)), "a gap that separates layers or marks a badge");
  html += `<p class="lead"><b>Rule:</b> a gap is information, never style. Keep the overlap cut where it separates two layers (a stack's back copy, a figure or coin behind another, the sun behind a cloud) or a badge or mark from its host. Everything else is closed and continuous: shapes on one plane cross whole, a slash crosses flat on top, and no stroke is broken for style. Filled variants still part a slash from its solid with a gap, since a slash on a solid would vanish.</p>`;
  width = 1500;
}

if (mode === "parts") {
  // Parts overview (Cursor's lookup tables): every family whose members are named <base>-<modifier>,
  // each member at 48px with the base drawn under it in red, so a part that drifted from its base shows.
  const names = readdirSync(SRC).filter(f => f.endsWith(".svg")).map(f => f.slice(0, -4));
  const fams = names.map(b => [b, names.filter(n => n.startsWith(b + "-") && !names.some(m => m !== b && n.startsWith(m + "-") && m.startsWith(b + "-")))]).filter(([, m]) => m.length);
  const big = (svg, color, op) => sized(svg, 48).replace(/currentColor/g, color).replace("<svg", `<svg style="position:absolute;inset:0;opacity:${op}"`);
  html += `<h1>Parts overview</h1><p class="lead">Each family's base (red, under) beside every member (black, over), at 48px with the true 16px line. Where red shows outside black, the member moved or reshaped its base's part; a modifier cut (a corner mark, a slash) shows as red only round the modifier.</p>`;
  for (const [b, ms] of fams) html += `<div class="fam"><div class="lab">${b}</div>${[b, ...ms].map(m => `<div class="ov"><span class="stack">${big(area(b), "#e5484d", 0.55)}${big(area(m), "#111", 1)}</span><div class="n">${m}</div></div>`).join("")}</div>`;
  width = 1500;
}

if (mode === "grid") {
  var BIG = rest[0] === "--big"; if (BIG) rest.shift();
  // a plain look at Area sources: grid out.png name…
  html += `<div style="display:flex;flex-wrap:wrap;gap:22px">${rest.map(n => `<div style="text-align:center;width:${BIG ? 260 : 120}px">${icon(area(n), BIG ? [16, 200] : [16, 64])}<div class="n">${n}</div></div>`).join("")}</div>`;
  width = 1500;
}

const page = `<!doctype html><meta charset="utf-8"><style>
body{font:14px/1.45 system-ui;margin:28px;color:#1a1a1a;width:${width - 56}px}
h1{font-size:24px;margin:0 0 6px}.lead{color:#444;max-width:1180px}
.row{display:flex;align-items:center;border-bottom:1px solid #eee;padding:10px 0;gap:10px}
.lab{width:130px;font-weight:600}.sub{font-weight:400;color:#888}
.cell{flex:1;min-width:0}.cell.hd{color:#777;font-weight:600;font-size:12px}
.ic{display:inline-flex;gap:14px;align-items:center;vertical-align:middle}.ic svg{display:block}
canvas{image-rendering:pixelated;vertical-align:middle;margin-left:14px;outline:1px solid #eee}
.n{color:#777;font-size:12px;margin-top:4px}.dash{color:#bbb}.pair{display:flex;gap:36px;align-items:center;margin:16px 0}
code{background:#f3f3f3;padding:1px 4px;border-radius:4px}
.fam{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start;border-bottom:1px solid #eee;padding:10px 0}.ov{width:78px;text-align:center}.stack{position:relative;display:inline-block;width:48px;height:48px}
</style>${html}<script>
for (const c of document.querySelectorAll("canvas")) { const img = new Image(); img.onload = () => { const x = c.getContext("2d"); x.drawImage(img, 0, 0, 16, 16); }; img.src = "data:image/svg+xml;charset=utf-8," + c.dataset.svg; }
</script>`;
const file = process.cwd() + "/apps/docs/.cache/sheet-" + mode + ".html";
writeFileSync(file, page);
const height = mode === "overlap" ? 1100 : mode === "parts" ? 7000 : mode === "dots" ? 900 : mode === "closed" ? 1150 : mode === "grid" ? 120 + Math.ceil(rest.length / 10) * 130 : 300 + (html.match(/class="row"/g) || []).length * 120 + (mode === "aligned" ? 420 : 0);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", "--virtual-time-budget=3000", `--window-size=${width},${height}`, "--screenshot=" + out, "file://" + file], { stdio: "ignore" });
console.log(out);
