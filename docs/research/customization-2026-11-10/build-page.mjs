// Builds the review page: real Area components (render.tsx, server-rendered), the built stylesheet trimmed to the
// setting values the page uses, the proposed material CSS on top, and the findings in content.mjs.
//   npm run build && node docs/research/customization-2026-11-10/inventory.mjs && node docs/research/customization-2026-11-10/measure.mjs
//   node docs/research/customization-2026-11-10/build-page.mjs <out.html>
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { NEEDS, RELATIONS, CANDIDATES, GROUPS, EFFECTS, TABLE, PROPOSALS, SCHEMA } from "./content.mjs";
import { BOARD, PIN_IDS, LEVELS, STYLES, EXTRAS, RECIPE_PROPOSALS } from "./recipes.mjs";
import { POC, POC_PROPOSALS } from "./poc.mjs";
import { PAINT, WRAP, NEW, EXTRA, ONE, GALLERY } from "./poc-paint.mjs";

const here = dirname(fileURLToPath(import.meta.url)), repo = join(here, "../../..");
const outFile = process.argv[2] ?? join(here, "page.html");
const tmp = mkdtempSync(join(tmpdir(), "area-study-"));
execFileSync(join(repo, "node_modules/.bin/esbuild"), [join(here, "render.tsx"), "--bundle", "--platform=node", "--format=esm", "--jsx=automatic", `--outfile=${join(tmp, "render.mjs")}`, "--log-level=warning",
  "--banner:js=import{createRequire}from'module';const require=createRequire(import.meta.url);"], { cwd: repo });
const F = JSON.parse(execFileSync("node", [join(tmp, "render.mjs")], { cwd: repo, maxBuffer: 1 << 26 }).toString());
F.dialog = F.dialog.replace(/^<dialog[^>]*>/, "").replace(/<\/dialog>$/, "");
let uid = 0; const frag = name => { if (!(name in F)) throw new Error("no fragment " + name); return F[name].replaceAll("_R_", `_R${++uid}_`); };
const inventory = JSON.parse(readFileSync(join(here, "inventory.json"), "utf8"));
const ladders = JSON.parse(readFileSync(join(here, "ladders.json"), "utf8"));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const code = s => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");

/* ---- The stylesheet, trimmed: every component rule kept; axis presets only for the values the page sets. ---- */
const KEEP = {
  accent: ["red", "orange", "yellow", "lime", "green", "teal", "cyan", "blue", "indigo", "purple", "pink", ...Array.from({ length: 24 }, (_, i) => String(i * 15))],
  "tint-hue": ["auto", "accent"], "tint-hue-dark": ["same", "auto", "accent"], "tint-light": ["auto", "0"], "tint-dark": ["auto", "0"], "ink-tint": ["50"], "label-tint": ["0"],
  "card-tone-light": ["auto"], "card-tone-dark": ["auto"], "layers-light": ["0", "20", "40", "60", "80", "100"], "layers-dark": ["0", "20", "40", "60", "80", "100"],
  "fill-hover": ["50"], "fill-selected": ["25"], "fill-pressed": ["100"], "ground-dark": ["8", "16"], "solid-light": ["auto", "250"], "solid-dark": ["auto"],
};
let css = readFileSync(join(repo, "packages/styles/dist/area.css"), "utf8");
const before = css.length;
css = css.replace(/\[data-area-([a-z-]+)="([^"]+)"\]\s*\{[^{}]*\}/g, (rule, axis, value) => axis.startsWith("material") ? "" : KEEP[axis] && !KEEP[axis].includes(value) ? "" : rule);
css = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@font-face\s*\{[^}]*\}/g, "").replace(/\n\s*\n+/g, "\n");
console.log(`stylesheet ${(before / 1024) | 0}k -> ${(css.length / 1024) | 0}k`);

/* ---- The proposed material, as CSS over the real components. Nine effects (--fx-*, 0 to 1); the six levers set them. ---- */
const TILE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 -1.5 1.05'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.38'/%3E%3C/svg%3E")`;
const a = (rgb, expr, l, d) => `light-dark(rgb(${rgb} / calc(${expr} * ${l})), rgb(${rgb} / calc(${expr} * ${d})))`;
const W = "255 255 255", K = "0 0 0", none = "0 0 0 0 #0000";
const mx = `
.mx{--mx-room:1;--fx-ring:0;--fx-grad:0;--fx-sheen:0;--fx-alpha:0;--fx-blur:0;--fx-inner:0;--fx-edge:0;--fx-contact:0;--fx-glow:0;--fx-grain:0;--mx-lit:0;--mx-floor:.7}
.mx[data-area-theme="dark"]{--mx-floor:.62}
/* the page: grain, full */
.mx.stage,.mx .stage{background-image:linear-gradient(color-mix(in srgb,var(--area-bg-page) calc((1 - var(--fx-grain)) * 100%),transparent) 0 0),${TILE}}
/* primary: solid buttons. Curve full, sheen echo, edge full, contact full, glow echo and only on a color */
.mx .area-button--solid{--mx-img:linear-gradient(to bottom,rgb(${W} / calc(var(--fx-sheen) * var(--mx-room) * .5 * .22)),rgb(${W} / calc(var(--fx-sheen) * var(--mx-room) * .5 * .05)) 44%,transparent 48%),linear-gradient(to bottom,${a(W, "var(--fx-grad) * var(--mx-room)", .1, 0)},transparent 55%,${a(K, "var(--fx-grad)", .26, .16)});
  background-image:var(--mx-img);
  box-shadow:0 0 0 1px color-mix(in srgb,color-mix(in oklab,var(--_bg),black 38%) calc(var(--fx-ring) * 100%),transparent),inset 0 1px 0 ${a(W, "var(--fx-edge)", .3, .0)},inset 0 -1px 0 ${a(K, "var(--fx-edge)", .34, .22)},inset 0 0 0 1px rgb(${W} / calc(var(--fx-edge) * .07)),
    0 1px 1.5px rgb(${K} / calc(var(--fx-contact) * .24)),0 2px 4px -1px rgb(${K} / calc(var(--fx-contact) * .2)),
    0 0 calc(var(--fx-glow) * var(--mx-lit) * 9px) calc(var(--fx-glow) * var(--mx-lit) * .5px) color-mix(in oklab,var(--_bg) calc(var(--fx-glow) * var(--mx-lit) * 34%),transparent)}
.mx .area-button--solid:not(.area-button--neutral),.mx[data-area-action="accent"] .area-button--solid,.mx [data-area-action="accent"] .area-button--solid{--mx-lit:1;--mx-room:0}
.mx .area-button--solid:active{background-image:none;box-shadow:inset 0 1px 2px rgb(${K} / calc((var(--fx-edge) + var(--fx-grad)) * .2))}
/* secondary: outline and soft at half. Ghost takes nothing. */
.mx .area-button:is(.area-button--outline,.area-button--soft){--mx-img:linear-gradient(to bottom,${a(W, "var(--fx-grad) * .5", 0, .07)},transparent 55%,${a(K, "var(--fx-grad) * .5", .09, .2)});background-image:var(--mx-img);
  box-shadow:0 0 0 1px ${a(K, "var(--fx-ring)", .08, .5)},inset 0 1px 0 ${a(W, "var(--fx-edge) * .5", .9, .1)},inset 0 -1px 0 ${a(K, "var(--fx-edge) * .5", .1, .3)},0 1px 1.5px rgb(${K} / calc(var(--fx-contact) * .5 * .2)),0 2px 4px -1px rgb(${K} / calc(var(--fx-contact) * .5 * .16)),var(--_shadow,${none})}
.mx .area-button:is(.area-button--outline,.area-button--soft):hover{background-image:var(--mx-img),var(--_wash-hover)}
/* fields: a well. Inner full, a light line under the foot at half. */
.mx :is(.area-input,.area-select,.area-textarea):not(:focus-within,:focus-visible){box-shadow:inset 0 1px 2px ${a(K, "var(--fx-inner)", .13, .6)},inset 0 1px 0 ${a(K, "var(--fx-inner)", .05, .3)},0 1px 0 ${a(W, "var(--fx-edge) * .5", .9, .07)},var(--_field-lift,${none})}
/* tracks, rails, unticked boxes, the segmented trough: wells, full */
.mx :is(.area-switch__track,.area-segmented,.area-progress,.area-checkbox__control:not(:checked,:indeterminate),.area-radio__control:not(:checked)){box-shadow:inset 0 1px 2px ${a(K, "var(--fx-inner)", .16, .65)},inset 0 0 0 .5px ${a(K, "var(--fx-inner)", .06, .3)}}
.mx .area-slider:not(.area-slider--bar) .area-slider__rail{box-shadow:inset 0 1px 1.5px ${a(K, "var(--fx-inner)", .2, .65)}}
/* thumbs and the selected segment: curve at half, edge full, contact full */
.mx :is(.area-switch__thumb,.area-segmented__item[data-selected]){background-image:linear-gradient(to bottom,transparent 40%,${a(K, "var(--fx-grad) * .5", .1, .22)});
  box-shadow:inset 0 1px 0 ${a(W, "var(--fx-edge)", 1, .16)},inset 0 -1px 0 ${a(K, "var(--fx-edge)", .1, .3)},0 1px 1.5px rgb(${K} / calc(var(--fx-contact) * .22)),0 2px 3px -1px rgb(${K} / calc(var(--fx-contact) * .16)),var(--area-shadow-control)}
.mx .area-slider:not(.area-slider--bar) .area-slider__thumb{background-image:linear-gradient(to bottom,transparent 40%,${a(K, "var(--fx-grad) * .5", .1, .22)});
  box-shadow:inset 0 1px 0 ${a(W, "var(--fx-edge)", 1, .16)},inset 0 -1px 0 ${a(K, "var(--fx-edge)", .1, .3)},0 1px 1.5px rgb(${K} / calc(var(--fx-contact) * .22)),var(--area-shadow-control)}
/* ticked boxes: curve and edge at half */
.mx :is(.area-checkbox__control:checked,.area-radio__control:checked){background-image:linear-gradient(to bottom,transparent 45%,rgb(${K} / calc(var(--fx-grad) * .5 * .22)));box-shadow:inset 0 1px 0 rgb(${W} / calc(var(--fx-edge) * .5 * .3)),inset 0 -1px 0 rgb(${K} / calc(var(--fx-edge) * .5 * .3))}
/* an on switch and a progress fill glow at half, only where Selection is a color */
.mx[data-area-selection="accent"] .area-switch__control:checked ~ .area-switch__track{box-shadow:inset 0 1px 2px ${a(K, "var(--fx-inner)", .16, .4)},0 0 calc(var(--fx-glow) * 8px) color-mix(in oklab,var(--_on) calc(var(--fx-glow) * 34%),transparent)}
/* solid badges: curve and edge at half */
.mx .area-badge--solid{background-image:linear-gradient(to bottom,transparent 45%,rgb(${K} / calc(var(--fx-grad) * .5 * .2)));box-shadow:inset 0 1px 0 rgb(${W} / calc(var(--fx-edge) * .5 * .3)),inset 0 -1px 0 rgb(${K} / calc(var(--fx-edge) * .5 * .26))}
/* cards: a top light line and grain, both at half; no glass */
.mx .area-card{--_m-layers:inset 0 1px 0 ${a(W, "var(--fx-edge) * .5", .9, .12)};background-image:linear-gradient(color-mix(in srgb,var(--area-bg-surface) calc((1 - var(--fx-grain) * .5) * 100%),transparent) 0 0),${TILE}}
/* overlays: glass (transparency and blur, full), a lit rim (full), grain at half */
.mx :is(.area-menu,.area-popover,.area-toast,.area-dialog){--mx-a:calc(1 - var(--fx-alpha) * (1 - var(--mx-floor)));
  background-color:transparent;background-image:linear-gradient(color-mix(in srgb,var(--area-bg-surface) calc(var(--mx-a) * (1 - var(--fx-grain) * .35) * 100%),transparent) 0 0),linear-gradient(rgb(128 128 128 / calc(var(--fx-grain) * .0)) 0 0);
  -webkit-backdrop-filter:blur(calc(var(--fx-blur) * 22px)) saturate(calc(1 + var(--fx-blur) * .6));backdrop-filter:blur(calc(var(--fx-blur) * 22px)) saturate(calc(1 + var(--fx-blur) * .6));
  --_m-layers:inset 0 1px 0 ${a(W, "var(--fx-edge)", .95, .16)},inset 0 0 0 1px ${a(W, "var(--fx-edge)", .5, .06)}}
/* under glass, muted and tone text step up to their strong ink, so the part can go further see-through */
.mx :is(.area-menu,.area-popover,.area-toast,.area-dialog) :is(.area-menu__label-text,.area-kbd__key,.area-toast__description,.area-dialog__description){color:color-mix(in oklab,var(--area-fg-default) calc(var(--fx-alpha) * 100%),var(--area-fg-muted))}
.mx .area-menu .area-menu__item--danger .area-menu__text{color:color-mix(in oklab,var(--area-fg-danger-strong) calc(var(--fx-alpha) * 100%),currentColor)}
/* bars content scrolls under: glass full, one edge line at half. Side panels: nothing. */
.mx [data-mx="bar"]{background-color:color-mix(in srgb,var(--area-bg-page) calc((1 - var(--fx-alpha) * (1 - var(--mx-floor))) * 100%),transparent);-webkit-backdrop-filter:blur(calc(var(--fx-blur) * 22px)) saturate(calc(1 + var(--fx-blur) * .6));backdrop-filter:blur(calc(var(--fx-blur) * 22px)) saturate(calc(1 + var(--fx-blur) * .6));box-shadow:0 1px 0 ${a(W, "var(--fx-edge) * .5", 0, .1)},inset 0 -1px 0 ${a(K, "var(--fx-edge) * .5", .08, 0)}}
/* the current nav row sits in, at half */
.mx .area-nav__item[aria-current]:not([aria-current="false"]){box-shadow:inset 0 1px 1px ${a(K, "var(--fx-inner) * .5", .09, .5)}}
/* Fill and stroke reworked from the reference specs (r12). The first version is kept under .v0 for comparison.
   Fill: the part's own color, a touch darker at the top and lighter at the foot (201E25 to 323137, F4F4F4 to FFFFFF).
   Stroke: a 1px gradient, lighter than the fill at the top and equal to it at the foot. Ring: 1px outside, own color, darker.
   A colored fill does not lighten at the foot (the label rule), so it only deepens at the top. */
.mx:not(.v0) .area-button--solid{--mx-ringmix:55%;--mx-top:color-mix(in oklab,var(--_bg),black calc(var(--fx-grad) * 5%));--mx-foot:color-mix(in oklab,var(--_bg),white calc(var(--fx-grad) * var(--mx-room) * 11%));--mx-lip:color-mix(in oklab,var(--mx-top),white calc(var(--fx-edge) * 22%));
  border-color:transparent;background-image:linear-gradient(to bottom,rgb(${W} / calc(var(--fx-sheen) * var(--mx-room) * .5 * .2)),transparent 48%),linear-gradient(var(--mx-top),var(--mx-foot)),linear-gradient(var(--mx-lip),var(--mx-foot));background-origin:border-box;background-clip:padding-box,padding-box,border-box;
  box-shadow:0 0 0 1px color-mix(in srgb,color-mix(in oklab,var(--_bg),black var(--mx-ringmix)) calc(max(var(--fx-ring),var(--fx-edge)) * 100%),transparent),0 2px 4px rgb(${K} / calc(var(--fx-contact) * .14)),
    0 0 calc(var(--fx-glow) * var(--mx-lit) * 9px) calc(var(--fx-glow) * var(--mx-lit) * .5px) color-mix(in oklab,var(--_bg) calc(var(--fx-glow) * var(--mx-lit) * 34%),transparent)}
.mx[data-area-theme="dark"]:not(.v0) .area-button--solid.area-button--neutral{--mx-ringmix:16%}
.mx:not(.v0) .area-button--solid:not(.area-button--neutral),.mx[data-area-action="accent"]:not(.v0) .area-button--solid{--mx-ringmix:22%}
.mx:not(.v0) .area-button--solid:active{background-image:linear-gradient(var(--mx-foot),var(--mx-top));box-shadow:0 0 0 1px color-mix(in oklab,var(--_bg),black var(--mx-ringmix))}
.mx:not(.v0) .area-button:is(.area-button--outline,.area-button--soft){--mx-img:linear-gradient(color-mix(in oklab,var(--_bg),black calc(var(--fx-grad) * 3%)),color-mix(in oklab,var(--_bg),white calc(var(--fx-grad) * 5%)));background-image:var(--mx-img);
  box-shadow:inset 0 1px 0 ${a(W, "var(--fx-edge) * .5", .9, .14)},0 2px 4px -1px rgb(${K} / calc(var(--fx-contact) * .5 * .16)),var(--_shadow,${none})}
/* B: the same, with the soft inner glow three of the references have (r11) */
.mx.vB .area-button--solid{box-shadow:inset 0 5px 5px -4px color-mix(in srgb,color-mix(in oklab,var(--_bg),white 40%) calc(var(--fx-edge) * 100%),transparent),inset 0 -4px 4px -3px color-mix(in srgb,color-mix(in oklab,var(--_bg),white 26%) calc(var(--fx-edge) * 100%),transparent),0 0 0 1px color-mix(in srgb,color-mix(in oklab,var(--_bg),black var(--mx-ringmix)) calc(max(var(--fx-ring),var(--fx-edge)) * 100%),transparent),0 2px 4px rgb(${K} / calc(var(--fx-contact) * .14))}
.mx[data-area-theme="dark"].vB .area-button--solid.area-button--neutral{box-shadow:inset 0 -5px 5px -4px rgb(${K} / calc(var(--fx-edge) * .16)),0 0 0 1px color-mix(in srgb,color-mix(in oklab,var(--_bg),black var(--mx-ringmix)) calc(var(--fx-edge) * 100%),transparent),0 2px 4px rgb(${K} / calc(var(--fx-contact) * .14))}
/* part 4 prototypes: dark labels free the sheen (r6); a declared backdrop lets panels and cards take glass (r1) */
.mx[data-mx-darklabel] .area-button--solid{--mx-room:2}
.mx.stage[data-backdrop="color"]{background-image:radial-gradient(60% 80% at 12% 18%,#ff9a5a 0,transparent 60%),radial-gradient(60% 70% at 88% 12%,#6aa8ff 0,transparent 60%),radial-gradient(70% 80% at 60% 105%,#c58bff 0,transparent 60%),linear-gradient(#ffe9d6,#d8e6ff)}
.mx.stage[data-backdrop="scene"]{background-image:radial-gradient(38% 46% at 72% 28%,#e8c27a 0,transparent 62%),radial-gradient(60% 60% at 18% 82%,#2f5d50 0,transparent 65%),linear-gradient(#3a3f47,#15171a)}
.mx[data-backdrop] :is(.area-card,[data-mx="panel"]){background-color:color-mix(in srgb,var(--area-bg-surface) calc((1 - var(--fx-alpha) * (1 - var(--mx-floor))) * 100%),transparent);background-image:none;-webkit-backdrop-filter:blur(calc(var(--fx-blur) * 22px)) saturate(calc(1 + var(--fx-blur) * .6));backdrop-filter:blur(calc(var(--fx-blur) * 22px)) saturate(calc(1 + var(--fx-blur) * .6))}
.mx[data-backdrop] .area-card{--_m-layers:inset 0 1px 0 ${a(W, "var(--fx-edge)", .95, .16)},inset 0 0 0 1px ${a(W, "var(--fx-edge)", .5, .06)}}
.mx[data-backdrop] [data-mx="panel"]{box-shadow:inset 0 1px 0 ${a(W, "var(--fx-edge)", .95, .16)},inset 0 0 0 1px ${a(W, "var(--fx-edge)", .5, .06)}}
/* Edge light two pixels wide at Stroke width 2 (r4), and Edge contrast at full ink (r5), with a bitmap face (l1) */
.rx-bevel,.rx-ink{--area-font-sans:"VT323",ui-monospace,Menlo,monospace;font-size:16px}
.rx-bevel .area-button:not(.area-button--ghost){background-image:none;box-shadow:inset 1px 1px 0 rgb(255 255 255 / .95),inset -1px -1px 0 rgb(0 0 0 / .55),inset 2px 2px 0 rgb(255 255 255 / .5),inset -2px -2px 0 rgb(0 0 0 / .25)}
.rx-bevel :is(.area-input,.area-select,.area-segmented,.area-switch__track){box-shadow:inset 1px 1px 0 rgb(0 0 0 / .55),inset -1px -1px 0 rgb(255 255 255 / .95),inset 2px 2px 0 rgb(0 0 0 / .25)}
.rx-bevel :is(.area-card,.area-menu){--_m-layers:inset 1px 1px 0 rgb(255 255 255 / .95),inset -1px -1px 0 rgb(0 0 0 / .5)}
.rx-ink :is(.area-button--outline,.area-input,.area-select,.area-segmented,.area-switch__track){box-shadow:0 0 0 1px var(--area-fg-default)}
.rx-ink :is(.area-card,.area-menu){--_m-layers:0 0 0 1px var(--area-fg-default),3px 3px 0 var(--area-fg-default)}
@media (prefers-reduced-transparency:reduce){.mx{--fx-alpha:0!important;--fx-blur:0!important}}
`;

/* ---- Page pieces ---- */
const stage = (theme, inner, { cls = "", style = "", attrs = "" } = {}) => `<div class="stage mx ${cls}" data-area-theme="${theme}" ${attrs} style="${style}">${inner}</div>`;
const fx = o => Object.entries(o).map(([k, v]) => `--fx-${k}:${v}`).join(";");

// Part 2 close-ups: each effect alone at off, 35, 70 and 100, light and dark, on the families it lands on.
const overTable = () => `<div class="over"><div class="over__back">${frag("table")}</div><div class="over__front">${frag("menu")}</div></div>`;
const CLOSE = {
  grad: { on: () => frag("buttons-primary") + frag("buttons-secondary") + frag("badges"), note: "Lands on solid buttons (full), outline and soft buttons, thumbs, ticked boxes and solid badges (half). On the white button of the dark page there is nothing to lighten, so only the foot darkens." },
  sheen: { on: () => frag("buttons-primary"), note: "Solid buttons only, at half, and it stops above the label's cap line. On the dark page's white button it does not show at all: white on white. That is why Sheen is not its own lever." },
  alpha: { on: overTable, note: "Shown here without blur, on purpose: the table's text shows through the menu's rows. This is why transparency never ships alone.", extra: {} },
  blur: { on: overTable, note: "Transparency at full with blur rising. At full blur the rows read again. One lever, Glass, moves both.", extra: { alpha: 1 } },
  inner: { on: () => frag("fields") + frag("toggles"), note: "Fields, tracks, rails, unticked boxes and the segmented trough. In dark the shade is stronger, since a near-black well needs more to read." },
  edge: { on: () => frag("buttons-primary") + frag("buttons-secondary") + `<div class="w220">${frag("card")}</div>`, note: "A top light and a darker foot on buttons and thumbs; one light line on cards and a lit rim on overlays. In dark this is the depth cue that shadows cannot be." },
  contact: { on: () => frag("buttons-primary") + frag("buttons-secondary") + frag("toggles"), note: "Under buttons, thumbs and the selected segment. In dark it has nothing to darken on the page, which is one more reason to fold it into Field shadow rather than keep a lever." },
  glow: { on: () => frag("buttons-primary") + `<div class="row">${frag("toggles").match(/<label class="area-switch[\s\S]*?<\/label>/)[0]}</div>`, note: "Shown with Buttons and Selection set to Accent, since a neutral part casts none. Strongest on the dark page; in light it is a faint colored contact shadow.", attrs: `data-area-action="accent" data-area-selection="accent"` },
  grain: { on: () => `<div class="w220">${frag("card")}</div>` + frag("prose"), note: "The page at full and cards at half. At 1x it is barely there below 70, and it never sits under controls." },
};
const closeups = EFFECTS.map(([id, label]) => {
  const c = CLOSE[id], cells = [];
  for (const theme of ["light", "dark"]) for (const s of [0, .35, .7, 1])
    cells.push(`<figure class="tile">${stage(theme, c.on(), { style: fx({ ...(c.extra ?? {}), [id]: s }), attrs: c.attrs ?? "" })}<figcaption>${theme === "light" ? "Light" : "Dark"} · ${s === 0 ? "off" : Math.round(s * 100)}</figcaption></figure>`);
  return `<section class="fxrow" id="fx-${id}"><h4>${label}</h4><p class="lede">${c.note}</p><div class="tiles">${cells.join("")}</div></section>`;
}).join("");

const table = `<div class="scroll"><table class="grid"><thead><tr><th>Family group</th>${EFFECTS.map(e => `<th>${e[1]}</th>`).join("")}</tr></thead><tbody>${GROUPS.map(([id, name, parts]) => {
  const cells = TABLE[id]; if (cells.length !== EFFECTS.length || cells.some(c => !c[0] || !c[1])) throw new Error("table row incomplete: " + id);
  return `<tr><th scope="row">${name}<small>${parts}</small></th>${cells.map(([deg, why]) => `<td class="deg deg--${deg}"><b>${deg[0].toUpperCase() + deg.slice(1)}</b><span>${why}</span></td>`).join("")}</tr>`;
}).join("")}</tbody></table></div>`;

// Part 1 inventory table
const distinct = (id, theme) => { const l = ladders.find(x => x.setting === id && x.theme === theme); return l ? `${l.at2.length} of ${id.startsWith("layers") || id.startsWith("fill") ? (id === "fill-selected" || id.startsWith("layers") ? 101 : 76) : inventory.rows.find(r => r.id === id).presets}` : ""; };
const NOT_SCALE = new Set(["theme", "neutral", "accent", "action", "selection", "status-colours", "focus-ring", "selected-tint", "danger-hover", "easing", "feedback", "shadow-color", "series-lightness"]);
const invRows = inventory.rows.map(r => {
  const reach = r.id === "theme" ? `all ${inventory.families}` : r.reach <= 7 ? r.reachList.join(", ") : `${r.reach} of ${inventory.families}`;
  const L = distinct(r.id, "light"), D = distinct(r.id, "dark");
  const group = r.id.startsWith("stroke-") && r.id !== "stroke-hover";
  const vis = L || D ? `<span class="${/^[01] /.test(L) ? "weak" : ""}">${L || "–"}</span> / <span class="${/^[01] /.test(D) ? "weak" : ""}">${D || "–"}</span>` : group ? "as Edge contrast" : NOT_SCALE.has(r.id) ? "each option differs" : "not a tone scale";
  return `<tr><td><b>${esc(r.label)}</b><small>${esc(r.heading)} · <code>${r.id}</code></small></td><td>${esc(r.description.replace(/\s*\(.*?\)/g, "").split(/(?<=\.)\s/)[0])}</td><td class="num">${r.presets}</td><td>${reach}</td><td>${vis}</td><td>${esc(NEEDS[r.id] ?? "")}</td></tr>`;
}).join("");
for (const r of inventory.rows) if (!NEEDS[r.id]) throw new Error("no needs for " + r.id);

const relations = RELATIONS.map(g => `<div class="rel"><h4>${g.kind}</h4><p class="lede">${g.note}</p>${g.rows.map(([a1, b, c, why]) => `<div class="chain"><span class="pill">${a1}</span>${b ? `<i>${g.kind === "Multiply" ? "×" : g.kind === "Gate" ? "gates" : "≈"}</i><span class="pill">${b}</span>` : ""}${c ? `<i>→</i><span class="pill pill--out">${c}</span>` : ""}${why ? `<em>${why}</em>` : ""}</div>`).join("")}</div>`).join("");

const prop = p => `<article class="prop" id="p-${p.id}" data-id="${p.id}" data-rec="${p.rec}"><header><span class="pid">${p.id}</span><h4>${esc(p.title ?? p.name)}</h4><span class="state"></span></header>
${p.changed ? `<p class="changed">Changed after the reference board. ${esc(p.changed)}</p>` : ""}<p>${code(p.what ?? "")}</p><p class="why">${code(p.why)}</p><div class="opts">${p.options.map(([v, l]) => `<button type="button" class="opt" data-v="${v}">${esc(l)}${v === p.rec ? "<em>Recommended</em>" : ""}</button>`).join("")}</div>
<input class="note" id="note-${p.id}" type="text" placeholder="Note (optional)" aria-label="Note for ${p.id}"></article>`;
const props = part => PROPOSALS.filter(p => p.part === part).map(prop).join("");
const cands = CANDIDATES.map(c => prop({ ...c, title: `${c.name}: ${c.verdict.toLowerCase()}`, what: "" })).join("");
const ALL = [...PROPOSALS, ...CANDIDATES, ...RECIPE_PROPOSALS, ...POC_PROPOSALS, { id: "r12", rec: "specs", options: [["specs"]] }];
/* ---- Part 5: proof of concept ---- */
const pocCss = `.pocstage .area-button{transition:none;cursor:default;border-radius:12px}
.pocstage .area-button.one{border-color:transparent;background-origin:border-box;background-repeat:no-repeat;background-clip:border-box}
` + Object.entries(ONE).map(([id, css]) => `.pocstage .area-button.one-${id}{${css};border-color:transparent;background-origin:border-box;background-repeat:no-repeat;background-clip:border-box}`).join("\n");
const layersOf = id => (NEW.find(n => n.id === id) ?? POC.find(p => p.id === id));
const pocTiles = `<div class="pocgrid">` + GALLERY.map(([id, name, page, src, from]) => { const L = layersOf(from);
  return `<figure class="poccard" id="one-${id}"><div class="pocstage" style="background:${page}"><div class="poc1">${frag("one-" + id)}</div><div class="poc3">${frag("one-" + id)}</div></div>
  <figcaption><b>${name}</b><span>${typeof src === "number" ? `pin <a href="https://www.pinterest.com/pin/${PIN_IDS[src - 1]}/">${src}</a>` : src}</span>
  <details><summary>Layers and paint</summary><div class="scroll"><table class="grid"><thead><tr><th>Layer in the reference</th><th>Value</th><th>Read from</th><th>In Area's terms</th></tr></thead><tbody>${L.layers.filter(l => l[0] !== "Size").map(l => `<tr><th scope="row">${l[0]}</th><td>${l[1]}</td><td>${l[2]}</td><td>${l[3]}</td></tr>`).join("")}</tbody></table></div><pre class="schema">${esc(ONE[id].replace(/;/g, ";\n"))}</pre></details></figcaption></figure>`; }).join("") + `</div>`;
/* ---- Part 4: the reference board as recipes ---- */
const lumHex = h => { const f = v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; const n = parseInt(h, 16); return .2126 * f(n >> 16) + .7152 * f(n >> 8 & 255) + .0722 * f(n & 255); };
const cr = (x, y) => { const p = lumHex(x), q = lumHex(y); return ((Math.max(p, q) + .05) / (Math.min(p, q) + .05)).toFixed(1); };
const REF = { c29a: cr("FFFFFF", "7F5EFF"), c29b: cr("FFFFFF", "997FFF") };
const fill = t => t.replace(/\{(\w+)\}/g, (_, k) => REF[k]);
const pinLinks = ns => ns.map(n => `<a href="https://www.pinterest.com/pin/${PIN_IDS[n - 1]}/">${n}</a>`).join(" ");
if (STYLES.flatMap(s => s.pins).sort((x, y) => x - y).join() !== PIN_IDS.map((_, i) => i + 1).join()) throw new Error("every pin must sit in exactly one style");
const dataAttrs = o => Object.entries(o).filter(([k]) => k !== "areaTheme").map(([k, v]) => `data-${k.replace(/[A-Z]/g, c => "-" + c.toLowerCase())}="${v}"`).join(" ");
const styleSections = STYLES.map(s => {
  const { room, ...fxs } = s.fx;
  const stages = Object.entries(s.attrs).map(([theme, at]) => `<figure class="tile">${stage(theme, frag("kit"), { cls: s.cls ?? "", style: fx(fxs), attrs: `${dataAttrs(at)} ${s.backdrop ? `data-backdrop="${s.backdrop}"` : ""} ${room ? "data-mx-darklabel" : ""}` })}<figcaption>Area's components with this recipe, ${theme}</figcaption></figure>`).join("");
  return `<section class="style" id="style-${s.id}"><header><h4>${s.name}</h4><span class="lvl lvl--${s.level}">${LEVELS[s.level]}</span><span>${s.pins.length} pins</span></header><p class="lede">${fill(s.see)}</p>
  <div class="style__body"><div class="style__stages">${stages}</div><div class="style__recipe"><div class="scroll"><table class="grid"><tbody>${s.settings.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("")}</tbody></table></div>
  <p><b>Parts.</b> ${s.parts}</p><p><b>Audit.</b> ${fill(s.audit)}</p><p><b>Floors.</b> ${fill(s.contrast)}</p><p><b>Pins.</b> ${pinLinks(s.pins)}</p></div></div></section>`;
}).join("");
const LEVER_NAMES = { curve: "Curve", edge: "Edge light", well: "Well depth", glass: "Glass", glow: "Glow", grain: "Grain" };
const unlockRows = Object.entries(LEVER_NAMES).map(([id, name]) => { const us = STYLES.filter(s => s.uses.includes(id)); return `<tr><th scope="row">${name}</th><td class="num ${us.length ? "" : "weak"}">${us.length} of ${STYLES.length}</td><td class="num">${us.reduce((n, s) => n + s.pins.length, 0)}</td><td>${us.map(s => s.name).join(", ") || "None: proposed out (r3)"}</td></tr>`; }).join("") +
  Object.entries(EXTRAS).map(([id, [name, kind]]) => { const us = STYLES.filter(s => s.extra.includes(id)); return `<tr><th scope="row">${name}<small>${kind}</small></th><td class="num">${us.length} of ${STYLES.length}</td><td class="num">${us.reduce((n, s) => n + s.pins.length, 0)}</td><td>${us.map(s => s.name).join(", ")}</td></tr>`; }).join("");
const levelRows = STYLES.map(s => `<tr><th scope="row"><a href="#style-${s.id}" style="color:inherit">${s.name}</a></th><td class="num">${s.pins.length}</td><td>${LEVELS[s.level]}</td><td>${s.uses.map(u => LEVER_NAMES[u]).join(", ") || "None"}</td><td>${s.extra.map(e => EXTRAS[e][0]).join("; ") || "Nothing"}</td></tr>`).join("");
if (new Set(ALL.map(p => p.id)).size !== ALL.length || ALL.some(p => !p.options.some(o => o[0] === p.rec))) throw new Error("proposal ids or recs");

const VARIANTS = [["v0", "First version", "A white sheen and a dark shade laid over the fill, with a hard dark line along the foot. On the dark page's white button the sheen has nothing to lighten, so only the gray foot shows: the dirty lower edge you pointed at."], ["vA", "From the specs", "The fill is the part's own color, slightly darker at the top and lighter at the foot. The stroke is a 1px gradient, lighter at the top and equal to the fill at the foot. A 1px ring sits outside in the fill's darker color. No line along the foot."], ["vB", "From the specs, with a soft inner glow", "The same, plus the line fading over a few pixels that three of the references have (r11). On a white fill the glow becomes a faint shade at the foot."]];
const explore = VARIANTS.map(([cls, name, note]) => `<section class="fxrow"><h4>${name}</h4><p class="lede">${note}</p><div class="tiles">${[["light", ""], ["dark", ""], ["light", `data-area-action="accent"`], ["dark", `data-area-action="accent"`]].map(([theme, at]) =>
  `<figure class="tile">${stage(theme, `<div class="x2">${frag("buttons-primary")}${frag("buttons-secondary")}</div>`, { cls, style: fx({ grad: 1, edge: 1, contact: .6 }), attrs: at })}<figcaption>${theme === "light" ? "Light" : "Dark"} · ${at ? "accent" : "neutral"} · twice size</figcaption></figure>`).join("")}</div></section>`).join("");
const lever = (id, hint) => `<div class="lever" data-lever="${id}">${frag("lever-" + id)}<small>${hint}</small></div>`;
const playground = `<div class="play">
  <div class="play__controls">
    <div class="play__seg" data-seg="theme">${frag("seg-theme")}</div><div class="play__seg" data-seg="compare">${frag("seg-compare")}</div>
    <div class="play__seg" data-seg="action">${frag("seg-action")}</div><div class="play__seg" data-seg="layers">${frag("seg-layers")}</div>
  </div>
  <div class="play__body">
    <div class="play__levers" data-area-theme="light" id="levers">
      ${lever("curve", "Buttons, thumbs, ticked boxes, solid badges")}${lever("edge", "Buttons, thumbs, cards, overlays, bars")}${lever("well", "Fields, tracks, unticked boxes")}
      ${lever("glass", "Menus, popovers, dialogs, the top bar. Scroll the screen to see content pass under the bar.")}${lever("glow", "Colored buttons and on switches. Set Buttons to Accent.")}${lever("grain", "The page, and cards at half")}
      <div class="lever lever--fold" data-lever="contact">${frag("lever-contact")}<small>Shown for judging m4. Proposed to fold into Field shadow, not to be a lever.</small></div>
    </div>
    ${stage("light", frag("screen"), { cls: "play__stage", attrs: `id="play"` })}
  </div></div>`;

const kinds = [
  ["compare", "q-ab", "Compare", "Two directions that differ in several settings at once. Pictures are simple premade UI, never screenshots; the stage shows the real screen under the pointer."],
  ["choose", "q-pick", "Choose", "One of two to five named values of one setting. The recommended one is marked, never pre-picked. \"Something else\" takes a typed value."],
  ["several", "q-multi", "Several", "Any number of independent switches. Continue applies them together."],
  ["amount", "q-slider", "Amount", "A slider with marks at the levels a person can tell apart, previewing as it moves. Says where it cannot show."],
  ["value", "q-typed", "Value", "A typed color, size or name, when the person already knows the answer."],
  ["confirm", "q-keep", "Confirm", "Sent after the agent decides something itself, or at the end of a sequence: keep, undo or adjust."],
].map(([id, f, name, note]) => `<figure class="kind" data-kind="${id}"><div class="stage" data-area-theme="light">${frag(f)}</div><div class="stage" data-area-theme="dark">${frag(f)}</div><figcaption><b>${name}</b> ${note}</figcaption></figure>`).join("");

const runTemplates = ["1", "2", "3a", "3b", "4", "5", "6", "7", "8", "9", "10"].map(n => `<template id="run-${n}">${F["run-" + n]}</template>`).join("") +
  `<template id="t-user">${F["msg-user"]}</template><template id="t-asst">${F["msg-asst"]}</template><template id="t-undo">${F["btn-undo"]}</template>`;

const ladderRows = ladders.filter(l => !l.setting.startsWith("card-tone")).map(l => `<tr><td>${l.setting}</td><td>${l.theme}</td><td class="num">${l.offered}</td><td class="num">${l.at1.length}</td><td class="num ${l.at2.length <= 1 ? "weak" : ""}">${l.at2.length}</td><td class="num ${l.span < 2 ? "weak" : ""}">${l.span}</td><td>${l.at2.join(" ")}</td></tr>`).join("");

const html = `<title>Customization Study</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Inter:wght@500&family=VT323&display=swap">
<style>${css}</style>
<style>
/* Layout: one reading column of findings, with wide live stages breaking out of it; a sticky bar holds the picks. */
:root{--pg-bg:#fbfbfa;--pg-fg:#1b1b1a;--pg-muted:#66655f;--pg-line:#e4e3de;--pg-card:#ffffff;--pg-soft:#f1f0ec;--pg-rec:#1f5fd1;--pg-rec-soft:#e6eefc;--pg-ok:#12733c;--pg-weak:#b3261e;--pg-full:#1b1b1a;--pg-echo:#8b8a84;
  --pg-sans:"Geist",ui-sans-serif,-apple-system,"Segoe UI",sans-serif;--pg-mono:"Geist Mono",ui-monospace,Menlo,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--pg-bg:#0b0b0b;--pg-fg:#ededeb;--pg-muted:#9d9c96;--pg-line:#2a2a28;--pg-card:#141413;--pg-soft:#1c1c1a;--pg-rec:#8ab4ff;--pg-rec-soft:#14233f;--pg-ok:#58c98a;--pg-weak:#ff8a80;--pg-full:#ededeb;--pg-echo:#7d7c76;color-scheme:dark}}
:root[data-theme="dark"]{--pg-bg:#0b0b0b;--pg-fg:#ededeb;--pg-muted:#9d9c96;--pg-line:#2a2a28;--pg-card:#141413;--pg-soft:#1c1c1a;--pg-rec:#8ab4ff;--pg-rec-soft:#14233f;--pg-ok:#58c98a;--pg-weak:#ff8a80;--pg-full:#ededeb;--pg-echo:#7d7c76;color-scheme:dark}
body{background:var(--pg-bg);color:var(--pg-fg);font:14px/1.55 var(--pg-sans);padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:0 96px}
.pgwrap{max-width:1180px;margin:0 auto;display:flex;flex-direction:column;gap:20px}
.pgwrap>h1{font:600 30px/1.15 var(--pg-sans);letter-spacing:-.02em;margin:40px 0 0;text-wrap:balance}
.pgwrap>h2{font:600 22px/1.2 var(--pg-sans);letter-spacing:-.01em;margin:56px 0 0;padding-top:20px;border-top:1px solid var(--pg-line);text-wrap:balance}
.pgwrap>h3{font:600 16px/1.3 var(--pg-sans);margin:24px 0 0}
h4{font:600 14px/1.3 var(--pg-sans);margin:0}
.pgwrap>p,.pgwrap>ul{max-width:70ch;margin:0}.pgwrap>ul{padding-left:18px;display:flex;flex-direction:column;gap:6px}
.lede{color:var(--pg-muted);margin:0;max-width:78ch}
code{font:12.5px var(--pg-mono);background:var(--pg-soft);padding:1px 4px;border-radius:4px}
.bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:30;background:var(--pg-bg);border-bottom:1px solid var(--pg-line);margin:0 -16px;padding:10px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:40;background:var(--pg-bg)}
.bar a{color:var(--pg-muted);text-decoration:none;font-weight:500}.bar a:hover{color:var(--pg-fg)}.bar .grow{flex:1}
.bar #count{color:var(--pg-muted);font-variant-numeric:tabular-nums}
.btn{font:500 13px var(--pg-sans);border:1px solid var(--pg-line);background:var(--pg-card);color:var(--pg-fg);border-radius:8px;padding:6px 12px;cursor:pointer}
.btn--go{background:var(--pg-fg);color:var(--pg-bg);border-color:var(--pg-fg)}.btn:focus-visible,.opt:focus-visible,.note:focus-visible{outline:2px solid var(--pg-rec);outline-offset:2px}
#dbnote{color:var(--pg-weak);font-size:12.5px}
.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.fact{border-left:2px solid var(--pg-line);padding:2px 0 2px 12px}.fact b{display:block;font:600 22px/1.2 var(--pg-sans);font-variant-numeric:tabular-nums}.fact span{color:var(--pg-muted)}
.props{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:12px}
.prop{background:var(--pg-card);border:1px solid var(--pg-line);border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:8px;min-width:0}
.prop header{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}.prop p{margin:0}.prop p:empty{display:none}.prop .why{color:var(--pg-muted)}
.pid{font:500 12px var(--pg-mono);color:var(--pg-muted);border:1px solid var(--pg-line);border-radius:5px;padding:0 5px}
.state{margin-left:auto;font-size:12px;color:var(--pg-muted)}.prop[data-picked] .state{color:var(--pg-ok);font-weight:500}
.opts{display:flex;gap:6px;flex-wrap:wrap}
.opt{font:500 13px var(--pg-sans);border:1px solid var(--pg-line);background:transparent;color:var(--pg-fg);border-radius:8px;padding:6px 10px;cursor:pointer;display:inline-flex;gap:8px;align-items:center}
.opt em{font-style:normal;font-weight:400;font-size:12px;color:var(--pg-rec)}
.opt[data-shown]{border-color:var(--pg-rec);background:var(--pg-rec-soft)}
.prop[data-picked] .opt[data-shown]{border-color:var(--pg-fg);background:var(--pg-fg);color:var(--pg-bg)}.prop[data-picked] .opt[data-shown] em{color:inherit;opacity:.7}
.note{font:13px var(--pg-sans);border:0;border-bottom:1px solid var(--pg-line);background:transparent;color:var(--pg-fg);padding:4px 0}
.scroll{overflow-x:auto;border:1px solid var(--pg-line);border-radius:12px;background:var(--pg-card)}
table.grid{border-collapse:collapse;width:100%;font-size:12.5px;line-height:1.4}
table.grid th,table.grid td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--pg-line)}
table.grid thead th{position:sticky;top:0;background:var(--pg-soft);font-weight:600;white-space:nowrap}
table.grid small{display:block;color:var(--pg-muted);font-weight:400}table.grid .num{font-variant-numeric:tabular-nums;text-align:right}
table.grid tbody tr:last-child>*{border-bottom:0}.weak{color:var(--pg-weak);font-weight:600}
.inv td:nth-child(1){min-width:170px}.inv td:nth-child(2){min-width:260px}.inv td:nth-child(6){min-width:200px}.inv{max-height:560px;overflow:auto}
.deg{min-width:132px}.deg b{display:inline-block;font-size:11px;letter-spacing:.04em;text-transform:uppercase;border-radius:4px;padding:0 5px;margin-bottom:3px}
.deg span{display:block;color:var(--pg-muted)}
.deg--full b{background:var(--pg-full);color:var(--pg-bg)}.deg--echo b{box-shadow:inset 0 0 0 1px var(--pg-echo);color:var(--pg-fg)}.deg--none b{color:var(--pg-echo);padding-left:0}
table.grid tbody th{min-width:150px;font-weight:600}
.rels{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,520px),1fr));gap:12px}
.rel{background:var(--pg-card);border:1px solid var(--pg-line);border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:8px;min-width:0}
.chain{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding-top:8px;border-top:1px solid var(--pg-line)}
.chain i{font-style:normal;color:var(--pg-muted);font-size:12px}.chain em{flex-basis:100%;font-style:normal;color:var(--pg-muted);font-size:12.5px}
.pill{border:1px solid var(--pg-line);border-radius:999px;padding:1px 9px;font-size:12.5px;font-weight:500;background:var(--pg-soft)}.pill--out{background:transparent;border-style:dashed}
pre.schema{font:12px/1.5 var(--pg-mono);background:var(--pg-card);border:1px solid var(--pg-line);border-radius:12px;padding:14px 16px;overflow-x:auto;margin:0}
/* Area stages: real components on Area's own page color */
.stage{background-color:var(--area-bg-page);color:var(--area-fg-default);font-family:var(--area-font-sans);font-size:13px;line-height:18px;border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:10px;min-width:0;position:relative;border:1px solid var(--pg-line)}
.stage .row{display:flex;gap:8px;align-items:center}.stage .row.wrap{flex-wrap:wrap}.stage .row.end{justify-content:flex-end}.stage .col{display:flex;flex-direction:column;gap:10px;align-items:stretch}
.stage .w220{width:220px;max-width:100%}.stage .prose{display:flex;flex-direction:column;gap:6px;max-width:52ch}.stage .prose h3{font:600 15px/20px var(--area-font-sans);margin:0}.stage .prose p{margin:0}
.stage .area-menu{width:220px}.stage .area-popover{position:static}
.over{position:relative;min-height:190px}.over__back{opacity:1}.over__front{position:absolute;left:36px;top:26px}
.x2{zoom:2;display:flex;flex-direction:column;gap:6px}
.fxrow{display:flex;flex-direction:column;gap:8px;padding-top:16px;border-top:1px solid var(--pg-line)}
.tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.tile,.kind{margin:0;display:flex;flex-direction:column;gap:4px;min-width:0}.tile figcaption{font-size:12px;color:var(--pg-muted)}
.tile .stage{overflow:hidden;flex:1}
@media (max-width:900px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}
.play{display:flex;flex-direction:column;gap:10px}
.play__controls{display:flex;gap:10px;flex-wrap:wrap}.play__seg{color-scheme:inherit}
.play__body{display:grid;grid-template-columns:260px minmax(0,1fr);gap:12px;align-items:start}
.play__levers{display:flex;flex-direction:column;gap:10px;background-color:var(--area-bg-page);color:var(--area-fg-default);font-family:var(--area-font-sans);font-size:13px;border:1px solid var(--pg-line);border-radius:10px;padding:12px}
.lever{display:flex;flex-direction:column;gap:3px}.lever small{color:var(--area-fg-muted,var(--pg-muted));font-size:11.5px;line-height:15px}.lever--fold{border-top:1px dashed var(--pg-line);padding-top:10px}
.play__stage{padding:0;overflow:hidden}
@media (max-width:820px){.play__body{grid-template-columns:1fr}}
.scr{display:grid;grid-template-columns:176px minmax(0,1fr);height:600px}
.scr__side{padding:10px 8px;display:flex;flex-direction:column;gap:8px;background:var(--area-bg-subtle);border-right:var(--area-stroke-width,1px) solid var(--area-border-default,transparent)}
.scr__brand{font-weight:600;padding:4px 8px}
.scr__main{position:relative;overflow:auto;min-width:0}
.scr__bar{position:sticky;top:0;z-index:3;display:flex;gap:8px;align-items:center;padding:8px 14px;background:var(--area-bg-page)}.scr__bar .grow{flex:1}.scr__bar .area-input{width:170px}
.scr__body{padding:6px 14px 40px;display:flex;flex-direction:column;gap:14px}
.scr__cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:12px}
.scr__menu{position:absolute;top:150px;right:22px;z-index:2}
@media (max-width:640px){.scr{grid-template-columns:1fr}.scr__side{display:none}.scr__bar .area-input{display:none}}
.kinds{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,520px),1fr));gap:16px}
.kind{display:grid;grid-template-columns:1fr 1fr;gap:8px}.kind figcaption{grid-column:1/-1;color:var(--pg-muted)}.kind figcaption b{color:var(--pg-fg)}
@media (max-width:560px){.kind{grid-template-columns:1fr}}
.stage .area-approval{width:100%}
/* pictograms: simple premade UI, drawn with four boxes */
.pg{display:grid;grid-template-columns:22% 1fr;grid-template-rows:16% 1fr 22%;gap:5%;width:100%;aspect-ratio:16/10;padding:7%;box-sizing:border-box;background:var(--area-bg-subtle);border-radius:6px}
.pg i{display:block;border-radius:3px;background:var(--area-bg-surface)}
.pg i:nth-child(1){grid-row:1/-1}.pg i:nth-child(2){grid-column:2}.pg i:nth-child(3){grid-column:2}.pg i:nth-child(4){grid-column:2;justify-self:end;width:34%;background:var(--area-fg-default)}
.pg--quiet{background:var(--area-bg-surface)}.pg--quiet i:not(:nth-child(4)){box-shadow:inset 0 0 0 1px var(--area-border-strong,rgb(128 128 128 / .5))}
.pg--layered i:not(:nth-child(4)){box-shadow:0 1px 3px rgb(0 0 0 / .18)}
.pg--c4 i{border-radius:2px}.pg--c10 i{border-radius:5px}.pg--c14 i{border-radius:8px}.pg--cpill i{border-radius:8px}.pg--cpill i:nth-child(4),.pg--cpill i:nth-child(2){border-radius:99px}
.pg--lit i:nth-child(4){background-image:linear-gradient(to bottom,rgb(255 255 255 / .28),transparent 50%,rgb(0 0 0 / .3));box-shadow:0 1px 2px rgb(0 0 0 / .3)}.pg--lit i:nth-child(2){box-shadow:inset 0 1px 2px rgb(0 0 0 / .25)}
.sw{display:block;width:16px;height:16px;border-radius:50%}
/* the run */
.run{display:grid;grid-template-columns:minmax(300px,400px) minmax(0,1fr);gap:12px;align-items:start}
@media (max-width:900px){.run{grid-template-columns:1fr}}
.run__chat{padding:12px;gap:10px;max-height:640px;overflow:auto}
.run__chat .line{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.run__chat .line--user{justify-content:flex-end;cursor:pointer}
.run__chat .decided{color:var(--area-fg-muted,inherit);font-size:12.5px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.run__meta{display:flex;justify-content:space-between;align-items:center;color:var(--area-fg-muted,inherit);font-size:12px}
.run__stage{padding:0;overflow:hidden;position:sticky;top:64px}
.kit{display:grid;grid-template-columns:150px minmax(0,1fr);min-height:330px}
.kit__side{padding:8px;background-color:var(--area-bg-subtle)}
.kit__main{padding:10px 12px;display:flex;flex-direction:column;gap:10px;min-width:0}
.kit__bar{display:flex;gap:8px;align-items:center;padding:6px 8px;border-radius:10px}.kit__bar .grow{flex:1}
.kit__cols{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:start}
@media (max-width:640px){.kit{grid-template-columns:1fr}.kit__side{display:none}.kit__cols{grid-template-columns:1fr}}
.style{display:flex;flex-direction:column;gap:10px;padding-top:18px;border-top:1px solid var(--pg-line)}
.style header{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}.style header span{color:var(--pg-muted);font-size:12.5px}
.lvl{border-radius:999px;padding:1px 9px;font-weight:500;border:1px solid var(--pg-line)}.style header .lvl--today{color:var(--pg-ok);border-color:currentColor}.style header .lvl--partial{color:var(--pg-weak);border-color:currentColor}.style header .lvl--material,.style header .lvl--rule{color:var(--pg-rec);border-color:currentColor}
.style__body{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(260px,1fr);gap:14px;align-items:start}
@media (max-width:900px){.style__body{grid-template-columns:1fr}}
.style__stages{display:flex;flex-direction:column;gap:8px;min-width:0}.style__stages .stage{padding:0;overflow:hidden}
.style__recipe{display:flex;flex-direction:column;gap:8px;min-width:0}.style__recipe p{margin:0;color:var(--pg-muted)}.style__recipe p b{color:var(--pg-fg)}
.style__recipe a{color:var(--pg-rec)}
.changed{margin:0;font-size:12.5px;color:var(--pg-rec);border-left:2px solid var(--pg-rec);padding-left:8px}
.pocrow{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:14px;align-items:start;padding-top:18px;border-top:1px solid var(--pg-line)}
@media (max-width:900px){.pocrow{grid-template-columns:1fr}}
.pocstage{border:1px solid var(--pg-line);border-radius:10px;display:flex;flex-direction:column;align-items:center;gap:28px;padding:28px 16px 40px;overflow:hidden;font-family:var(--area-font-sans)}
.poc3{zoom:3}
.pocgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr));gap:14px}
.poccard{margin:0;display:flex;flex-direction:column;gap:8px;min-width:0}.poccard .pocstage{padding:22px 12px 34px;gap:26px;min-height:190px;justify-content:center}
.poccard figcaption{display:flex;flex-direction:column;gap:4px;min-width:0}.poccard figcaption span{color:var(--pg-muted);font-size:12.5px}.poccard a{color:var(--pg-rec)}.poccard details{margin-top:4px}.poccard summary{cursor:pointer;color:var(--pg-muted)}
.pocinfo{display:flex;flex-direction:column;gap:8px;min-width:0}.pocinfo header{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}.pocinfo header span{color:var(--pg-muted);font-size:12.5px}.pocinfo a{color:var(--pg-rec)}
${pocCss}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:12px}
.cols>div{border-left:2px solid var(--pg-line);padding-left:12px}.cols p{margin:4px 0 0;color:var(--pg-muted)}
${mx}
</style>

<div class="pgwrap">
<div class="bar"><a href="#axes">1 Settings</a><a href="#material">2 Material</a><a href="#chat">3 Chat</a><a href="#recipes">4 Recipes</a><a href="#proof">5 Proof</a><span class="grow"></span><span id="dbnote" hidden>Picks are not saving in this view.</span><span id="count"></span><button class="btn btn--go" id="approve" type="button">Approve every recommendation</button></div>

<h1>How Area is customized: the settings as a system, material that lands somewhere, and setup as a chat</h1>
<p class="lede">A study, 2026-11-10. Nothing in the app or the packages has changed. Every proposal has an id and a recommendation, drawn as chosen in blue; a pick turns it solid and saves. Components on this page are Area's own, rendered from the built packages; the material and the question protocol are prototypes laid over them.</p>
<div class="facts">
  <div class="fact"><b>61 + 2</b><span>settings: 61 registry axes plus Contrast and Pills, about ${Math.round(inventory.rows.reduce((n, r) => n + r.presets, 0) / 100) * 100} preset values</span></div>
  <div class="fact"><b>2 to 5</b><span>levels a person can tell apart on most tone and shadow scales that offer 9 to 101</span></div>
  <div class="fact"><b>14 → 5</b><span>material levers, each with a fixed place to land; no bundles (six before the reference board)</span></div>
  <div class="fact"><b>41 → 10</b><span>setup questions, asked in the chat with one card</span></div>
</div>

<h2 id="axes">1 · The settings as a system</h2>
<p>Each of the 61 registry settings, traced from its emitted properties through the derived tokens into the 108 component stylesheets. "Read by" counts the component files that read the setting or anything derived from it. "Clear levels" is how many of its values differ at a glance (CIEDE2000 of 2 or more from the last kept level), measured on today's build in light and in dark; red means one or none.</p>
<div class="scroll inv"><table class="grid"><thead><tr><th>Setting</th><th>What it changes</th><th>Values</th><th>Read by</th><th>Clear levels, light / dark</th><th>Needs, to show at all</th></tr></thead><tbody>${invRows}</tbody></table></div>

<h3>What the inventory says</h3>
<ul>
  <li><b>The scales are finer than the eye.</b> Layer contrast in light offers 101 positions and shows 2 clear levels; Hover fill in light offers 76 and shows 1; Floating shadow in light offers 9 and shows 2. Dark is the reverse for lines: Edge contrast shows 4 clear levels in light and 14 in dark, so one pick looks much heavier in dark.</li>
  <li><b>Four shadow settings do nothing in dark.</b> Edge shadow, Shadow reach, Softness and Shadow color measure a span of 0 on the near-black page. Floating shadow still reads in dark, through its light rim alone.</li>
  <li><b>About a third of the settings are gated.</b> Five accent settings show only once Buttons or Selection is Accent. Fourteen stroke settings need both Stroke width and Edge contrast above 0. Easing and Feedback need Speed above 0.</li>
  <li><b>Reach is very uneven.</b> Sixteen settings reach more than 90 of 108 component files; twelve reach five or fewer.</li>
</ul>
<details><summary>Measured ladders (the numbers behind "clear levels")</summary><div class="scroll" style="margin-top:8px"><table class="grid"><thead><tr><th>Setting</th><th>Mode</th><th>Sampled</th><th>Visible side by side</th><th>Clear at a glance</th><th>Whole range</th><th>Clear levels at</th></tr></thead><tbody>${ladderRows}</tbody></table></div><p class="lede" style="margin-top:8px">Specimens rendered from the built stylesheet in a headless browser at 1x and sampled per pixel; the 101-position scales were sampled every 5. Card shade is not in the table: this specimen does not paint a card, so it was not measured.</p></details>

<h3>How settings combine</h3>
<div class="rels">${relations}</div>

<h3>Proposals for the settings</h3>
<div class="props">${props(1)}</div>

<h3>Levers Area does not have yet</h3>
<p>Each judged against the rule that a rule or a composition comes before a new setting. Three are worth adding, four fold into something that exists, three stay out.</p>
<div class="props">${cands}</div>

<h2 id="material">2 · Material that looks good and says where it lands</h2>
<h3>Why today's bundles read as weak</h3>
<p>Looked at in the app's Materials lab, built from this branch, every bundle in light and dark.</p>
<div class="cols">
  <div><b>They paint on black and white.</b><p>Buttons are neutral by default: near black in light, white in dark. A white sheen on a white button and a dark shade on a black one have nothing to change, so in dark all six bundles look like None.</p></div>
  <div><b>Fourteen levers, one pixel.</b><p>Ring, lit edge, double rim, inner pair and catch-light all draw in the outer 1 to 3px of a 28 to 32px control. Stacked, they read as "a button with a darker outline" whichever bundle is on.</p></div>
  <div><b>Glass with nothing behind it.</b><p>Layer contrast is 0 by default, so a card is the page's color. A see-through card over the same color is the same picture; blur has nothing to blur. Glass and None cards match.</p></div>
  <div><b>Gloss crosses the label.</b><p>The banded sheen covers the top half of the button at about 40 percent white. Computed from the bundle's values, a white label over that band on the neutral fill is about 4.2:1, under the 4.5:1 floor.</p></div>
  <div><b>Light from a color the part does not have.</b><p>Glow puts accent-blue light under black buttons and a black switch. The color appears nowhere else on them, so it reads as a rendering fault.</p></div>
  <div><b>Half strength is no strength.</b><p>Secondary buttons, badges and wells take the levers at half. Half of a 1px, 20 percent line on a white outline button is not visible, so "echo" families look untouched.</p></div>
</div>

<h3>The proposed model: six levers, five after the reference board</h3>
<p>Each lever is one amount, 0 to 100, and each lands on different parts, so each is visible alone. Full and echo are fixed by family; echo is half.</p>
<div class="scroll"><table class="grid"><thead><tr><th>Lever</th><th>What it draws</th><th>Range and where it stops</th><th>Shows when</th></tr></thead><tbody>
<tr><th>Curve</th><td>A tone gradient on solid fills, with a soft sheen at half strength above the label's cap line</td><td>0 to 100. Lightens the top by at most 10 percent and darkens the foot by at most 26; under a dark label it only darkens. <span id="lim-curve"></span></td><td>Always; strongest on colored fills</td></tr>
<tr><th>Edge light</th><td>A top light line and a darker foot on raised parts; a lit rim on overlays; one line on cards</td><td>0 to 100. Always 1px. It adds to a boundary, never replaces the stroke.</td><td>Always. In dark it is the main depth cue.</td></tr>
<tr><th>Well depth</th><td>A top inner shade on fields, tracks, rails and unticked boxes</td><td>0 to 100. Blur at most 2px, so placeholder text keeps its ground. Off while a field has focus.</td><td>Always</td></tr>
<tr><th>Glass</th><td>See-through overlays and scrolled-under bars, with blur rising with it</td><td>0 to 100. Fill opacity stops at the floor for the weakest text the part holds. <span id="lim-glass"></span></td><td>Only over content: menus, popovers, dialogs, toasts, sticky bars</td></tr>
<tr><th>Glow</th><td>Light in the part's own color around colored actions and on-states</td><td>0 to 100. At most 9px and 34 percent, so the control's edge still reads against the page.</td><td>Buttons or Selection set to Accent, or a status button</td></tr>
<tr><th>Grain<small>Proposed out, r3</small></th><td>Fine noise on the page (full) and on cards and glass (half). One pin of 53 shows faint noise; no style depends on it.</td><td>0 to 100. Never under a control, a table or a text block's own ground.</td><td>Always; easier to see on a tinted or layered page</td></tr>
</tbody></table></div>

<h3>Try it: one screen, every lever</h3>
<p class="lede">Real Area components. Start state is every lever at 50 except Glow and Grain. Compare switches the material off without moving the sliders. The menu floats over the cards and the bar is sticky, so Glass has something behind it: scroll the screen.</p>
${playground}

<h3>Component by effect</h3>
<p>Every family group against every effect: none, echo (half) or full, and why. Tables, charts and content take nothing at all; that is the point of them being content.</p>
${table}

<h3>Gradient fills and strokes, reworked from the references</h3>
<p>The first version of Curve and Edge light painted white and black over the fill and drew a dark line along the foot. That looked wrong, most of all on the dark page's white buttons. The annotated specs on the board do it differently, so the prototype now follows them: everything below this section and the playground above use "From the specs". All three are shown at Curve 100 and Edge light 100, at twice size.</p>
${explore}
<div class="props">${prop({ id: "r12", part: 2, title: "Fill and stroke follow the specs", what: "Curve tints the part's own fill (a touch darker at the top, lighter at the foot); Edge light is a gradient stroke that is light at the top and disappears into the fill at the foot, with the outer ring. The dark line along the foot goes.", why: "It is what the four annotated specs draw, it works on a white fill where an overlay cannot, and it never puts a gray edge on a white button. It also settles r10's direction for the default: lighter toward the foot.", options: [["specs", "From the specs"], ["glow", "From the specs, with the soft inner glow"], ["first", "Keep the first version"]], rec: "specs" })}</div>

<h3>Each effect alone, at three strengths</h3>
<p class="lede">Off, 35, 70 and 100, in light then dark, on the families it lands on. Nine effects are shown so each can be judged; Curve moves the first two together and Glass the next two.</p>
${closeups}

<h3>Where each lever must stop</h3>
<div id="limits" class="scroll"><table class="grid"><thead><tr><th>Check</th><th>Light</th><th>Dark</th><th>Rule</th></tr></thead><tbody id="limits-body"><tr><td colspan="4">Measuring in your browser…</td></tr></tbody></table></div>
<p class="lede">Measured live on this page's components: label and text contrast (floor 4.5:1) at each lever's maximum, against the worst backdrop for glass (a white or a black field behind it).</p>

<h3>Proposals for material</h3>
<div class="props">${props(2)}</div>

<h2 id="chat">3 · Customization as a simple chat</h2>
<h3>What exists</h3>
<div class="cols">
  <div><b>Setup</b><p>41 questions (13 marked essential) in its own page: each a question card with its own controls for sliders, toggles, colors and pills. Answers show in a separate list derived from settings; a Reset per question; no undo of a single answer.</p></div>
  <div><b>Chat: options</b><p>The agent's <code>show_options</code> draws 2 to 4 named options on screens and applies the pick with Undo. The pick and Undo live in the card, so they are gone on reload.</p></div>
  <div><b>Chat: questions</b><p>The plain question card takes words only, single or multi-select, and returns the label. No picture, no amount, no typed value, nothing applied.</p></div>
  <div><b>Lab kit</b><p>14 templates show every kind (grid of pictures, A or B, bars, fields, swatches, chips) but none is wired to the agent, and Setup does not use them.</p></div>
</div>

<h3>One card, six kinds</h3>
<p class="lede">Built from Area's Approval, Slider, Segmented and Input, in light and dark. They respond: pick, tick, drag, type.</p>
<div class="kinds">${kinds}</div>

<h3>When to ask, how an answer lives</h3>
<div class="cols">
  <div><b>Ask</b><p>Only when the result is visible, earlier answers and measured defaults do not settle it, and it is taste. One question at a time. Two to five answers; the recommended one marked, never pre-picked.</p></div>
  <div><b>Decide</b><p>Everything else. Apply it, say what and why in one line, with Undo. Gated settings are never asked while their gate is closed.</p></div>
  <div><b>Apply</b><p>Pointing previews on the stage. Picking writes the working theme. Nothing is published until the person publishes.</p></div>
  <div><b>Keep</b><p>The answer becomes the person's reply in the transcript. Tapping a reply asks that question again from there; later answers that depended on it are asked again, the rest stay.</p></div>
</div>

<h3>A new theme in ten questions</h3>
<p class="lede">Working: answer in the chat and the screen follows. Each answer changes what is asked next (Quiet asks about lines, Layered about layers; no accent skips where it shows; the size recommendation follows what you are making). Tap a reply to change it.</p>
<div class="run">
  <div class="stage run__chat" data-area-theme="light" id="run-chat"></div>
  ${stage("light", frag("screen"), { cls: "run__stage", attrs: `id="run-stage"` })}
</div>
${runTemplates}

<h3>The card as one tool</h3>
<pre class="schema">${esc(SCHEMA)}</pre>
<p>Setup's script is a list of these inputs with a rule for which comes next. The agent sends the same input mid-task when it needs one decision. The result goes back to the agent and into the transcript as the reply.</p>

<h3>What it replaces</h3>
<div class="scroll"><table class="grid"><thead><tr><th>Today</th><th>Becomes</th></tr></thead><tbody>
<tr><td><code>show_options</code> and the design uses of the plain question card</td><td><code>ask_design</code> (Compare and Choose with <code>set</code>)</td></tr>
<tr><td>Setup page and its question file (41 questions, own controls)</td><td>A script of about ten <code>ask_design</code> inputs run in the chat; the rest by chapter on request</td></tr>
<tr><td>Lab question kit, 14 templates</td><td>The six renderers of the one card</td></tr>
<tr><td>Option marks, choice figures, choice visuals (three per-option drawings)</td><td>One pictogram module</td></tr>
<tr><td>Bento preview and per-axis close-ups (two real-component close-ups)</td><td>The screen stage with a focus area</td></tr>
<tr><td>Setup's slider, the Materials lab's slider</td><td>The Inspector's setting row</td></tr>
</tbody></table></div>

<h3>Proposals for the chat</h3>
<div class="props">${props(3)}</div>

<h2 id="recipes">4 · The reference board as recipes</h2>
<p>All ${PIN_IDS.length} pins on <a href="${BOARD}" style="color:var(--pg-rec)">the board</a>, read as ${STYLES.length} styles. Each style has the settings and material levers that would draw it, Area's real components rendered with that recipe, and an audit of how far it gets. Pins are linked by number in board order, not copied onto this page. Sizes were read from the four annotated spec pins (22, 23, 25, 29), which give exact fills, strokes and shadows; the rest were read for structure, not measured.</p>
<div class="scroll"><table class="grid"><thead><tr><th>Style</th><th>Pins</th><th>How far Area gets</th><th>Material levers it uses</th><th>What else it needs</th></tr></thead><tbody>${levelRows}</tbody></table></div>
<h3>What each lever unlocks</h3>
<p class="lede">Styles and pins that need each lever, then each missing piece. A lever that unlocks nothing goes; a gap that blocks many pins ranks first.</p>
<div class="scroll"><table class="grid"><thead><tr><th>Lever or missing piece</th><th>Styles</th><th>Pins</th><th>Which</th></tr></thead><tbody>${unlockRows}</tbody></table></div>
<h3>The nine styles</h3>
<p class="lede">The backdrops behind the two glass styles are drawn here with plain gradients. The beveled and one-bit renders prototype r4, r5 and a bitmap face on top of the real components; they are the least faithful, and say so.</p>
${styleSections}
<h3>Proposals from the board</h3>
<div class="props">${RECIPE_PROPOSALS.map(prop).join("")}</div>

<h2 id="proof">5 · Proof of concept: the references as paint on Area's own button</h2>
<p>Eighteen visual styles from your references, all on one button: Area's Button with the globe icon and a label, at a 12px corner. Nothing else differs between them. Only paint changes: label color, fill, stroke color, shadows. Where a reference was a different kind of control (a toolbar tile, a segmented thumb, a round send button), its paint is carried onto this same button.</p>
<p class="lede">Fourth pass. The line cut off across the top and foot of strokes was a real bug: the fill's gradient was repeating into the button's 1px border, so the top border showed the foot's color and the foot showed the top's. Every paint now starts at the border edge, and each button was checked at eight times size for any band. Colors are back at the sampled values at full strength (the deep blue and the green were dulled before), the deep blue sits on a darker page, and the thick frame is now a 1px see-through stroke. Each is shown at true size and at three times.</p>
<div class="pocgrid" style="margin-bottom:6px"><figure class="poccard"><div class="pocstage" style="background:#ffffff"><div class="poc1">${frag("poc-plain")}</div><div class="poc3">${frag("poc-plain")}</div></div><figcaption><b>Area's button, unpainted</b><span>the one component every style is painted on</span></figcaption></figure></div>
${pocTiles}
<h3>What they say about the levers</h3>
<div class="cols">
  <div><b>Every one has an outer ring.</b><p>All nine draw a 1 to 2px ring outside the part, in its own darker color or the page's. That is r2, now on firmer ground.</p></div>
  <div><b>Most gradients run toward the foot.</b><p>Six of nine are lighter at the foot than the top, the opposite of the first Curve. Proposal r10 gives Curve a sign.</p></div>
  <div><b>Strokes are gradients, and sometimes two.</b><p>A stroke that is light at the top and matches the fill at the foot is Edge light as proposed. Cancel's white stroke inside a gray ring is the same at Stroke width 2 (r4).</p></div>
  <div><b>Inner glow needs softness.</b><p>Create, Search and Details have a line that fades over 2 to 6px. A crisp 1px Edge light cannot draw it; r11 lets it follow Shadow softness.</p></div>
  <div><b>Not reachable by levers.</b><p>The label shadow on Edit (r8, left out), the multi-stop gloss on the gel button and the Today pill (Curve with sheen comes close, not exact), radial fills lit from within (the two pale blue buttons), and the second outer plate on Details.</p></div>
  <div><b>Two break the text floor as drawn.</b><p>Edit's white label is 4.3:1 to 3.1:1 and Search's is about 2.9:1. They are kept exact here; Area's versions would not be.</p></div>
</div>
<h3>Proposals from the proof</h3>
<div class="props">${POC_PROPOSALS.map(prop).join("")}</div>
</div>

<script>
const RECS=${JSON.stringify(Object.fromEntries(ALL.map(p => [p.id, p.rec])))};
/* ---- picks: verdicts/<id> { pick, note, at } ---- */
let verdicts={},db=null;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function paint(){let n=0;for(const el of $$(".prop")){const id=el.dataset.id,v=verdicts[id],shown=v?.pick??el.dataset.rec;
  if(v?.pick){el.dataset.picked="";n++}else delete el.dataset.picked;
  for(const o of $$(".opt",el)){if(o.dataset.v===shown)o.dataset.shown="";else delete o.dataset.shown;o.setAttribute("aria-pressed",String(!!v?.pick&&o.dataset.v===v.pick))}
  $(".state",el).textContent=v?.pick?(v.pick===el.dataset.rec?"Picked":"Picked, differs from recommendation"):"Recommended, not picked";
  const note=$(".note",el);if(document.activeElement!==note&&v?.note!==undefined)note.value=v.note}
  $("#count").textContent=n+" of "+$$(".prop").length+" picked"}
function save(id,patch){verdicts[id]={...(verdicts[id]||{}),...patch,at:new Date().toISOString()};paint();db?.doc("verdicts/"+id).set(verdicts[id]).catch(()=>{$("#dbnote").hidden=false})}
document.addEventListener("click",e=>{const o=e.target.closest(".opt");if(o)save(o.closest(".prop").dataset.id,{pick:o.dataset.v})});
document.addEventListener("change",e=>{if(e.target.classList.contains("note"))save(e.target.closest(".prop").dataset.id,{note:e.target.value})});
$("#approve").addEventListener("click",()=>{for(const id in RECS)if(!verdicts[id]?.pick)save(id,{pick:RECS[id]})});
paint();
(async()=>{try{db=await window.claude?.use?.("db")}catch{}if(!db){$("#dbnote").hidden=false;return}
  db.collection("verdicts").onSnapshot(s=>{const next={};for(const d of s.docs)next[d.id]=d.data();verdicts=next;paint()},()=>{$("#dbnote").hidden=false})})();

/* ---- generic behavior for the server-rendered components ---- */
function setSlider(input){const l=input.closest(".area-slider"),min=+input.min||0,max=+input.max||100,r=(input.value-min)/(max-min);l.style.setProperty("--_pct",r*100+"%");l.style.setProperty("--_slider-ratio",r);const v=$(".area-slider__value",l);if(v)v.textContent=input.value}
document.addEventListener("input",e=>{if(e.target.classList?.contains("area-slider__control")){setSlider(e.target);e.target.dispatchEvent(new CustomEvent("slide",{bubbles:true,detail:+e.target.value}))}
  if(e.target.classList?.contains("area-composer__input")){const b=e.target.closest(".area-composer").querySelector(".area-composer__submit");if(b)b.disabled=!e.target.value.trim()}});
document.addEventListener("click",e=>{const s=e.target.closest(".area-segmented__item");if(!s)return;for(const b of $$(".area-segmented__item",s.parentElement)){const on=b===s;b.setAttribute("aria-checked",String(on));b.tabIndex=on?0:-1;if(on)b.dataset.selected="";else delete b.dataset.selected}
  s.dispatchEvent(new CustomEvent("segment",{bubbles:true,detail:[...s.parentElement.children].indexOf(s)}))});
// the kinds: pick, tick
for(const k of $$(".kind"))k.addEventListener("click",e=>{const o=e.target.closest(".area-approval__option:not(.area-approval__instead)");if(!o)return;const multi=k.dataset.kind==="several";
  for(const b of $$(".area-approval__option",o.closest(".area-approval__options"))){if(b===o){if(multi&&b.hasAttribute("data-selected")){b.removeAttribute("data-selected");b.removeAttribute("aria-current")}else{b.dataset.selected="";b.setAttribute("aria-current","true")}}else if(!multi){b.removeAttribute("data-selected");b.removeAttribute("aria-current")}}});

/* ---- playground ---- */
const MAP={curve:["grad","sheen"],edge:["edge"],well:["inner"],glass:["alpha","blur"],glow:["glow"],grain:["grain"],contact:["contact"]};
const play=$("#play"),lv={};let off=false;
function applyPlay(){for(const k in MAP)for(const f of MAP[k])play.style.setProperty("--fx-"+f,off?0:(lv[k]??0)/100)}
for(const el of $$(".lever")){const i=$("input",el);lv[el.dataset.lever]=+i.value;el.addEventListener("slide",e=>{lv[el.dataset.lever]=e.detail;applyPlay()})}
applyPlay();
const SEG={theme:i=>{const t=i?"dark":"light";play.dataset.areaTheme=t;$("#levers").dataset.areaTheme=t},compare:i=>{off=!!i;applyPlay()},
  action:i=>{play.dataset.areaAction=i?"accent":"neutral";play.dataset.areaSelection=i?"accent":"neutral"},layers:i=>{const v=i?"60":"0";play.dataset.areaLayersLight=v;play.dataset.areaLayersDark=v}};
for(const el of $$(".play__seg"))el.addEventListener("segment",e=>SEG[el.dataset.seg](e.detail));

/* ---- limits, measured on this page ---- */
function rgba(c){const x=document.createElement("canvas");x.width=x.height=1;const g=x.getContext("2d",{willReadFrequently:true});g.clearRect(0,0,1,1);g.fillStyle=c;g.fillRect(0,0,1,1);const d=g.getImageData(0,0,1,1).data;return[d[0],d[1],d[2],d[3]/255]}
const lum=c=>{const f=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2])};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const over=(top,al,bot)=>[0,1,2].map(i=>top[i]*al+bot[i]*(1-al));
function probe(theme,accent,alpha){const d=document.createElement("div");d.className="stage mx";d.dataset.areaTheme=theme;d.style.setProperty("--fx-alpha",alpha||0);if(accent)d.dataset.areaAction="accent";d.style.position="absolute";d.style.left="-9999px";d.style.width="400px";
  d.innerHTML=$("#play .scr__bar").innerHTML+$("#play .scr__menu").innerHTML;document.body.append(d);
  const btn=d.querySelector(".area-button--solid"),cs=getComputedStyle(btn),fill=rgba(cs.backgroundColor),ink=rgba(cs.color);
  const light=lum(ink)>lum(fill);                        // a light label: the top lightens by .10 in light mode
  const room=accent?0:1, top=theme==="light"?over([255,255,255],.10*room,fill):fill, sheen=over([255,255,255],.11*room,top), foot=over([0,0,0],theme==="light"?.26:.16,fill);
  const curve=Math.min(ratio(ink,light?sheen:foot),ratio(ink,fill));
  const menu=d.querySelector(".area-menu"),sp=document.createElement("i");sp.style.backgroundColor="var(--area-bg-surface)";d.append(sp);const surf=rgba(getComputedStyle(sp).backgroundColor);
  const inks=[...menu.querySelectorAll("*")].filter(n=>!n.closest(".area-sr-only")&&[...n.childNodes].some(t=>t.nodeType===3&&t.textContent.trim())).map(n=>rgba(getComputedStyle(n).color)).filter(c=>c[3]>.9);
  const worst=al=>Math.min(...inks.map(c=>Math.min(ratio(c,over(surf,al,[0,0,0])),ratio(c,over(surf,al,[255,255,255])))));
  let floor=1;for(let al=1;al>=.3;al-=.01){if(worst(al)<4.5)break;floor=al}
  const strong=inks.reduce((m,c)=>ratio(c,surf)>ratio(m,surf)?c:m,inks[0]);let floorStrong=1;for(let al=1;al>=.3;al-=.01){if(Math.min(ratio(strong,over(surf,al,[0,0,0])),ratio(strong,over(surf,al,[255,255,255])))<4.5)break;floorStrong=al}
  const proto=+getComputedStyle(d).getPropertyValue("--mx-floor");const res={rest:ratio(ink,fill),curve,floor,floorStrong,proto,atProto:worst(proto),solidWorst:worst(1)};d.remove();return res}
try{const L=probe("light"),D=probe("dark"),LA=probe("light",true),DA=probe("dark",true),LS=probe("light",false,1),DS=probe("dark",false,1),f=n=>n.toFixed(1)+":1",p=n=>Math.round(n*100)+"%",ok=n=>n>=4.5?"":' class="weak"';
  $("#limits-body").innerHTML=
  "<tr><td>Solid neutral button label, Curve 100</td><td"+ok(L.curve)+">"+f(L.curve)+" (flat "+f(L.rest)+")</td><td"+ok(D.curve)+">"+f(D.curve)+" (flat "+f(D.rest)+")</td><td>Passes at the maximum, so Curve runs its whole range on neutral fills.</td></tr>"+
  "<tr><td>Solid accent button label, Curve 100</td><td"+ok(LA.curve)+">"+f(LA.curve)+" (flat "+f(LA.rest)+")</td><td"+ok(DA.curve)+">"+f(DA.curve)+" (flat "+f(DA.rest)+")</td><td>"+(Math.min(LA.curve,DA.curve)>=4.5?"Passes because a colored fill takes no lightening and no sheen, only the darker foot. With the neutral button's 10 percent top light and sheen, this label measures 3.4:1.":"Below the floor even with no lightening: Curve must stay off this fill.")+"</td></tr>"+
  "<tr><td>Menu, weakest text it holds, solid</td><td"+ok(L.solidWorst)+">"+f(L.solidWorst)+"</td><td"+ok(D.solidWorst)+">"+f(D.solidWorst)+"</td><td>The starting point before any glass.</td></tr>"+
  "<tr><td>Glass floor for the menu's weakest text</td><td>"+p(L.floor)+" opaque</td><td>"+p(D.floor)+" opaque</td><td>Over a pure white or black backdrop. Glass 100 must stop here for parts holding secondary text.</td></tr>"+
  "<tr><td>The same, with muted and tone text stepped up to their strong ink (m11)</td><td>"+p(LS.floor)+" opaque</td><td>"+p(DS.floor)+" opaque</td><td>What this page's prototype does: the step-up rises with Glass.</td></tr>"+
  "<tr><td>Glass floor for primary text only</td><td>"+p(L.floorStrong)+" opaque</td><td>"+p(D.floorStrong)+" opaque</td><td>A part holding only primary text (a toast title, a bar's title) may go this far.</td></tr>"+
  "<tr><td>This page's prototype at Glass 100</td><td"+ok(LS.atProto)+">"+f(LS.atProto)+" at "+p(LS.proto)+"</td><td"+ok(DS.atProto)+">"+f(DS.atProto)+" at "+p(DS.proto)+"</td><td>Blur does not change the worst case; it removes detail, not luminance.</td></tr>";
  $("#lim-curve").textContent="Measured label contrast at 100: "+f(L.curve)+" light, "+f(D.curve)+" dark on neutral; "+f(LA.curve)+" and "+f(DA.curve)+" on the blue accent.";
  $("#lim-glass").textContent="Measured floor: "+p(L.floor)+" opaque in light and "+p(D.floor)+" in dark for a menu as it is; "+p(LS.floor)+" and "+p(DS.floor)+" once its muted and tone text step up (m11).";
}catch(err){$("#limits-body").innerHTML='<tr><td colspan="4">Could not measure in this browser.</td></tr>'}

/* ---- the ten-question run ---- */
const chat=$("#run-chat"),rs=$("#run-stage");
const tpl=id=>document.getElementById(id).content.cloneNode(true);
const START={areaTheme:"light",areaAccent:"blue",areaAction:"neutral",areaSelection:"neutral",areaRadius:"10",areaDensity:"32",areaLayersLight:"0",areaLayersDark:"0",areaStroke:"4",areaElevation:"8"};
let st,steps;
const setAttrs=o=>{for(const k in o){if(k==="fx"){for(const f of ["grad","sheen","edge","inner","contact"])rs.style.setProperty("--fx-"+f,o.fx?({grad:.6,sheen:.6,edge:.7,inner:.6,contact:.5})[f]:0)}else rs.dataset[k]=o[k]}};
const hexHue=h=>{const m=/^#?([0-9a-f]{6})$/i.exec(h.trim());if(!m)return null;const n=parseInt(m[1],16),r=(n>>16)/255,g=(n>>8&255)/255,b=(n&255)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;if(!d)return null;
  let hh=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;hh=(hh*60+360)%360;return String(Math.round(hh/15)*15%360)};
const NAMES={blue:"blue",green:"green",purple:"purple",violet:"purple",orange:"orange",red:"red",pink:"pink",teal:"teal",yellow:"yellow",cyan:"cyan",indigo:"indigo",lime:"lime"};
const Q={
 "1":{next:()=>"2",set:v=>({}),after:a=>{st.kind=a.value;st.recDensity=({workspace:"28",dashboard:"32",site:"36",phone:"36"})[a.value]||"32"}},
 "2":{next:()=>st.sep==="quiet"?"3a":"3b",set:v=>v==="quiet"?{areaLayersLight:"0",areaLayersDark:"0",areaStroke:"4",areaElevation:"3"}:{areaLayersLight:"60",areaLayersDark:"60",areaStroke:"2",areaElevation:"6"},after:a=>{st.sep=a.value}},
 "3a":{next:()=>"4",slide:v=>({areaStroke:String(v)}),word:v=>"Lines "+v},
 "3b":{next:()=>"4",slide:v=>({areaLayersLight:String(v),areaLayersDark:String(v)}),word:v=>"Layers "+v},
 "4":{next:()=>st.accent==="none"?"6":"5",set:v=>v==="none"?{areaAction:"neutral",areaSelection:"neutral"}:{areaAccent:v},after:a=>{st.accent=a.value;if(a.value==="none")decided("No accent, so nothing to place: buttons and selection stay neutral.")},
   other:t=>{const n=NAMES[t.trim().toLowerCase()]||hexHue(t);return n?{value:n,label:t.trim()}:null}},
 "5":{next:()=>"6",multi:vs=>({areaAction:vs.includes("action")?"accent":"neutral",areaSelection:vs.includes("selection")?"accent":"neutral"}),after:a=>{if(a.values.includes("action"))decided("The label on the accent takes whichever ink measures 4.5:1 or more on this color.")}},
 "6":{next:()=>"7",set:v=>({areaRadius:v}),other:t=>{const n=Math.round(+t/2)*2;return n>=0&&n<=14?{value:String(n),label:"Corner "+n}:null}},
 "7":{next:()=>st.sep==="layered"?"8":"9",set:v=>({areaDensity:v}),before:card=>{for(const o of $$(".area-approval__option",card)){const d=$(".area-approval__option-description",o);if(d)d.remove()}
     const rec=$$(".area-approval__option",card).find(o=>o.dataset.value===st.recDensity);if(rec){const s=document.createElement("span");s.className="area-approval__option-description";s.textContent="Recommended for "+({workspace:"a tool people work in all day",dashboard:"a dashboard",site:"a content site",phone:"a phone app"})[st.kind||"workspace"];
       let lines=$(".area-approval__lines",rec);if(!lines){lines=document.createElement("span");lines.className="area-approval__lines";const l=$(".area-approval__label",rec);l.replaceWith(lines);lines.append(l)}lines.append(s)}},
   after:()=>{decided("Type size stays 13: it fits every room setting."); if(st.sep!=="layered")decided("Menus lift a little (3). A quiet page needs less; ask me to change it.")}},
 "8":{next:()=>"9",slide:v=>({areaElevation:String(v)}),word:v=>"Lift "+v},
 "9":{next:()=>"10",set:v=>({fx:v==="lit"}),after:()=>{setAttrs({areaTheme:"dark"});chat.dataset.areaTheme="dark";decided("Switched the screen to dark to check it.")}},
 "10":{next:()=>null,set:()=>({})},
};
const VALUES={"1":["workspace","dashboard","site","phone"],"2":["quiet","layered"],"4":["blue","green","purple","orange","none"],"5":["action","selection"],"6":["4","10","14","pill"],"7":["28","32","36"],"9":["flat","lit"],"10":["save","adjust"]};
function say(text){const m=tpl("t-asst"),el=m.firstElementChild;(el.querySelector(".area-message__bubble")||el).textContent=text;const line=document.createElement("div");line.className="line";line.append(m);chat.append(line)}
function decided(text){const d=document.createElement("div");d.className="decided";d.textContent="Decided for you: "+text;chat.append(d)}
function reply(text,index){const m=tpl("t-user"),el=m.firstElementChild;(el.querySelector(".area-message__bubble")||el).textContent=text;const line=document.createElement("div");line.className="line line--user";line.title="Change this answer";line.append(m);line.addEventListener("click",()=>rewind(index));chat.append(line)}
function snapshot(){return{data:{...rs.dataset},style:rs.getAttribute("style")||"",st:{...st},chatTheme:chat.dataset.areaTheme}}
function restore(s){for(const k of Object.keys(rs.dataset))delete rs.dataset[k];Object.assign(rs.dataset,s.data);rs.setAttribute("style",s.style);st={...s.st};chat.dataset.areaTheme=s.chatTheme}
function rewind(i){const s=steps[i];restore(s.snap);while(chat.children.length>s.count)chat.lastChild.remove();steps.length=i;ask(s.id)}
function ask(id){const q=Q[id],snap=snapshot(),count=chat.children.length,index=steps.length;steps.push({id,snap,count});
  const meta=document.createElement("div");meta.className="run__meta";meta.innerHTML="<span>Question "+(index+1)+" of about 10</span>";chat.append(meta);
  const holder=document.createElement("div");holder.append(tpl("run-"+id));chat.append(holder);const card=holder.firstElementChild;
  const opts=$$(".area-approval__option:not(.area-approval__instead)",card);opts.forEach((o,i)=>o.dataset.value=(VALUES[id]||[])[i]);q.before?.(card);
  const done=(label,ans)=>{meta.remove();holder.remove();reply(label,index);q.after?.(ans);const n=q.next();chat.scrollTop=chat.scrollHeight;if(n)ask(n);else finish()};
  const base=snapshot();
  if(q.set){for(const o of opts){o.addEventListener("mouseenter",()=>setAttrs(q.set(o.dataset.value)));o.addEventListener("focus",()=>setAttrs(q.set(o.dataset.value)));
      o.addEventListener("click",()=>{restore(base);setAttrs(q.set(o.dataset.value));done($(".area-approval__label",o).textContent,{value:o.dataset.value})})}
    $(".area-approval__options",card)?.addEventListener("mouseleave",()=>restore(base))}
  if(q.multi){for(const o of opts)o.addEventListener("click",()=>{o.toggleAttribute("data-selected");setAttrs(q.multi(opts.filter(x=>x.hasAttribute("data-selected")).map(x=>x.dataset.value)))});
    $(".area-approval__footer .area-button",card).addEventListener("click",()=>{const vs=opts.filter(x=>x.hasAttribute("data-selected"));setAttrs(q.multi(vs.map(x=>x.dataset.value)));done(vs.length?vs.map(x=>$(".area-approval__label",x).textContent).join(", "):"Nowhere",{values:vs.map(x=>x.dataset.value)})})}
  if(q.slide){const input=$(".area-slider__control",card);setAttrs(q.slide(+input.value));card.addEventListener("slide",e=>setAttrs(q.slide(e.detail)));
    const [def,go]=$$(".area-approval__footer .area-button",card);go.addEventListener("click",()=>done(q.word(input.value),{value:input.value}));def.addEventListener("click",()=>{restore(base);setAttrs(q.slide(+input.defaultValue));done(q.word(input.defaultValue)+" (default)",{value:input.defaultValue})})}
  const field=$(".area-approval__field",card);if(field&&q.other)field.addEventListener("keydown",e=>{if(e.key!=="Enter")return;const r=q.other(field.value);if(!r){field.setAttribute("aria-invalid","true");return}restore(base);setAttrs(q.set(r.value));done(r.label,{value:r.value})});
  const skip=$(".area-approval__skip",card);if(skip)skip.addEventListener("click",e=>{e.preventDefault();restore(base);meta.remove();holder.remove();decided("Skipped, so I kept the default.");const n=q.next();if(n)ask(n);else finish()});
  if(id==="10"){const name=$(".area-input input, input.area-input",card);opts[0].addEventListener("click",()=>{st.name=name?.value||"Theme"},{capture:true})}
  chat.scrollTop=chat.scrollHeight}
function finish(){say((st.name?"Saved as "+st.name+". ":"Left open to adjust. ")+"Ten answers, the rest decided for you and listed above. Tap any reply to change it, or ask in your own words.");
  const b=document.createElement("div");b.className="line";b.innerHTML=${JSON.stringify(F["btn-restart"])};b.firstElementChild.addEventListener("click",start);chat.append(b);
  const c=document.createElement("div");c.innerHTML=${JSON.stringify(F["composer"])};chat.append(c);chat.scrollTop=chat.scrollHeight}
function start(){chat.innerHTML="";chat.dataset.areaTheme="light";for(const k of Object.keys(rs.dataset))delete rs.dataset[k];rs.removeAttribute("style");Object.assign(rs.dataset,START);st={};steps=[];
  say("Let's set up a theme. About ten questions; I decide the rest and tell you what I chose.");ask("1")}
start();
</script>`;
writeFileSync(outFile, html);
// a copy with the publish skeleton's doctype and charset, for checking the file locally
writeFileSync(outFile.replace(/\.html$/, ".local.html"), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">${html}</body></html>`);
console.log(`wrote ${outFile} (${(html.length / 1024) | 0}k), ${ALL.length} proposals, table ${GROUPS.length} x ${EFFECTS.length}`);
