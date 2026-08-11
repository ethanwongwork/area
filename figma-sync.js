// ============================================================
// DESIGN SYSTEM → FIGMA  (single-paste, run-once)
// Paste into: Plugins › Development › Open Console
// Creates/updates all variables, text styles, and effect styles.
// Idempotent — safe to re-run at any time.
// ============================================================

(async () => {

// ── Helpers ──────────────────────────────────────────────────

async function findCollection(name) {
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  return cols.find(c => c.name === name);
}

async function getOrCreateCollection(name, firstModeName) {
  let col = await findCollection(name);
  if (!col) {
    col = figma.variables.createVariableCollection(name);
    col.renameMode(col.modes[0].modeId, firstModeName || "Value");
  }
  return col;
}

async function indexVars(collectionId, type) {
  const map = {};
  for (const v of await figma.variables.getLocalVariablesAsync(type)) {
    if (v.variableCollectionId === collectionId) map[v.name] = v;
  }
  return map;
}

function upsertVar(map, name, collection, type, modeId, value) {
  let v = map[name];
  const isNew = !v;
  if (!v) v = figma.variables.createVariable(name, collection, type);
  v.setValueForMode(modeId, value);
  return isNew;
}

// ── OKLCH → sRGB (0-1) ──────────────────────────────────────

function oklchToRgb01(L, C, H) {
  const hRad = (H * Math.PI) / 180;
  const a_ = C * Math.cos(hRad), b_ = C * Math.sin(hRad);
  const l_ = L + .3963377774 * a_ + .2158037573 * b_;
  const m_ = L - .1055613458 * a_ - .0638541728 * b_;
  const s_ = L - .0894841775 * a_ - 1.291485548 * b_;
  const l3 = l_ ** 3, m3 = m_ ** 3, s3 = s_ ** 3;
  const cl = v => Math.max(0, Math.min(1, v));
  const rL = cl(+4.0767416621 * l3 - 3.3077115913 * m3 + .2309699292 * s3);
  const gL = cl(-1.2684380046 * l3 + 2.6097574011 * m3 - .3413193965 * s3);
  const bL = cl(-.0041960863 * l3 - .7034186147 * m3 + 1.707614701 * s3);
  const gm = c => c <= .0031308 ? 12.92 * c : 1.055 * (c ** (1 / 2.4)) - .055;
  return { r: gm(rL), g: gm(gL), b: gm(bL) };
}

// ── Palette Data ─────────────────────────────────────────────

const STOPS = [50,100,150,200,250,300,350,400,450,500,550,600,650,700,800,900,950,1000,1100,1200];
const ALPHA_STOPS = [2,4,6,8,10,12,16,20,24,32,40,48,56,64,72,80,90,100];
const L_BY_STOP = {50:.98,100:.95,150:.925,200:.895,250:.87,300:.85,350:.835,400:.82,450:.735,500:.65,550:.61,600:.56,650:.52,700:.48,800:.4,900:.33,950:.295,1000:.26,1100:.19,1200:.135};
const C_FRAC = {50:.05,100:.08,150:.12,200:.18,250:.32,300:.42,350:.52,400:.62,450:.78,500:1,550:.95,600:.85,650:.77,700:.68,800:.52,900:.38,950:.30,1000:.22,1100:.12,1200:.06};

const CHROMATIC = {
  red:{h:25.4,L:.657,C:.2296},orange:{h:48,L:.71,C:.1896},dune:{h:78,L:.71,C:.1451},
  yellow:{h:95,L:.71,C:.143},lime:{h:125,L:.71,C:.175},green:{h:145,L:.71,C:.2189},
  teal:{h:170,L:.71,C:.155},cyan:{h:208,L:.71,C:.1197},sky:{h:230,L:.71,C:.1387},
  blue:{h:262.2,L:.62,C:.2051},indigo:{h:280,L:.58,C:.2313},purple:{h:300,L:.58,C:.269},
  pink:{h:340,L:.67,C:.2854}
};
const NEUTRALS = {neutral:{h:0,C:0},warm:{h:17,C:.01},cool:{h:248,C:.01}};

// ══════════════════════════════════════════════════════════════
// STEP 1 — Global Color Palette Variables
// ══════════════════════════════════════════════════════════════

const globalCol = await getOrCreateCollection("Primitives / Color", "Value");
const globalMode = globalCol.modes[0].modeId;
const gMap = await indexVars(globalCol.id, "COLOR");
let s1c = 0, s1u = 0;

for (const [nk, cfg] of Object.entries(NEUTRALS)) {
  for (const stop of STOPS) {
    const rgb = oklchToRgb01(L_BY_STOP[stop], cfg.C, cfg.h);
    (upsertVar(gMap, `${nk}/${stop}`, globalCol, "COLOR", globalMode, { ...rgb, a: 1 }) ? s1c++ : s1u++);
  }
}
for (const [ck, ref] of Object.entries(CHROMATIC)) {
  for (const stop of STOPS) {
    let L = L_BY_STOP[stop];
    if (stop === 500) L = ref.L;
    else if (stop === 550) L = ref.L - .04;
    else if (stop === 600) L = ref.L - .09;
    else if (stop === 650) L = ref.L - .135;
    const rgb = oklchToRgb01(L, ref.C * C_FRAC[stop], ref.h);
    (upsertVar(gMap, `${ck}/${stop}`, globalCol, "COLOR", globalMode, { ...rgb, a: 1 }) ? s1c++ : s1u++);
  }
}
for (const a of ALPHA_STOPS) {
  (upsertVar(gMap, `alpha/white/${a}`, globalCol, "COLOR", globalMode, { r:1,g:1,b:1,a:a/100 }) ? s1c++ : s1u++);
  (upsertVar(gMap, `alpha/black/${a}`, globalCol, "COLOR", globalMode, { r:0,g:0,b:0,a:a/100 }) ? s1c++ : s1u++);
}

console.log(`[1/5] Global Colors — ${s1c} created, ${s1u} updated`);

// ══════════════════════════════════════════════════════════════
// STEP 2 — Semantic Color Variables (Light + Dark aliases)
// ══════════════════════════════════════════════════════════════

// Mirrors COLOR_SEM_LIGHT / COLOR_SEM_DARK in index.html. Keep in sync with the spec (§3 Color System):
//   - warning palette = `dune` (amber, h=78°), per §3.4 (was `orange`)
//   - chromatic text stops follow §3.3.1 (saturated stop that passes WCAG AA on white + role/50 tint)
//   - `feedback/{role}/text` and `feedback/{role}/icon` deleted for danger/warning/info — consumers route through `text/{role}`
//   - `feedback/success/icon` and `feedback/success/icon-hover` retained (Switch on-state track surface, §3.3.2)
//   - `focus/ring` / `focus/ring-danger` removed (duplicates of `border/focus` / `border/danger`, §3.1 anti-duplicate)
//   - `accent/*` removed (no consumers in the documented system)
const LIGHT = {
  "surface/page":"neutral/50","surface/default":"alpha/white/100","surface/raised":"alpha/white/100","surface/sunken":"alpha/black/2","surface/subtle":"neutral/100","surface/overlay":"alpha/white/100","surface/inverse":"neutral/1200","surface/brand":"blue/500","surface/brand-subtle":"blue/50",
  "text/primary":"neutral/1200","text/secondary":"neutral/800","text/tertiary":"neutral/600","text/placeholder":"neutral/500","text/disabled":"neutral/400","text/inverse":"alpha/white/100","text/on-brand":"alpha/white/100","text/link":"blue/700","text/link-hover":"blue/900","text/brand":"blue/600","text/danger":"red/600","text/warning":"dune/700","text/success":"green/700","text/info":"blue/600",
  "border/default":"neutral/200","border/subtle":"neutral/150","border/hover":"neutral/300","border/strong":"neutral/500","border/disabled":"neutral/200","border/focus":"blue/500","border/brand":"blue/500","border/danger":"red/500","border/success":"green/500","border/warning":"dune/500",
  "action/solid/neutral/bg":"neutral/1200","action/solid/neutral/border":"neutral/800","action/solid/neutral/text":"alpha/white/100","action/solid/neutral/hover-bg":"neutral/1100","action/solid/neutral/hover-border":"neutral/700",
  "action/solid/brand/bg":"blue/500","action/solid/brand/border":"blue/450","action/solid/brand/text":"alpha/white/100","action/solid/brand/hover-bg":"blue/600","action/solid/brand/hover-border":"blue/500",
  "action/soft/neutral/bg":"neutral/50","action/soft/neutral/border":"neutral/100","action/soft/neutral/text":"neutral/800","action/soft/neutral/hover-bg":"neutral/100","action/soft/neutral/hover-border":"neutral/150",
  "action/soft/brand/bg":"blue/50","action/soft/brand/border":"blue/100","action/soft/brand/text":"blue/600","action/soft/brand/hover-bg":"blue/100","action/soft/brand/hover-border":"blue/150",
  "action/soft/danger/bg":"red/50","action/soft/danger/border":"red/100","action/soft/danger/text":"red/600","action/soft/danger/hover-bg":"red/100","action/soft/danger/hover-border":"red/150",
  "action/soft/success/bg":"green/50","action/soft/success/border":"green/100","action/soft/success/text":"green/700","action/soft/success/hover-bg":"green/100","action/soft/success/hover-border":"green/150",
  "action/outline/neutral/bg":"TRANSPARENT","action/outline/neutral/border":"neutral/200","action/outline/neutral/text":"neutral/800",
  "action/outline/brand/bg":"TRANSPARENT","action/outline/brand/border":"blue/300","action/outline/brand/text":"blue/600",
  "action/ghost/neutral/bg":"TRANSPARENT","action/ghost/neutral/border":"TRANSPARENT","action/ghost/neutral/text":"neutral/800",
  "action/ghost/brand/bg":"TRANSPARENT","action/ghost/brand/border":"TRANSPARENT","action/ghost/brand/text":"blue/600",
  "action/hover":"alpha/black/4",
  "feedback/danger/bg":"red/50","feedback/danger/border":"red/200","feedback/danger/border-hover":"red/350",
  "feedback/warning/bg":"dune/50","feedback/warning/border":"dune/200",
  "feedback/success/bg":"green/50","feedback/success/border":"green/200","feedback/success/border-hover":"green/350","feedback/success/icon":"green/500","feedback/success/icon-hover":"green/600",
  "feedback/info/bg":"blue/50","feedback/info/border":"blue/200",
  "overlay/scrim":"alpha/black/40","overlay/scrim-heavy":"alpha/black/64","overlay/surface":"alpha/white/80",
  "selection/bg":"blue/100","selection/bg-strong":"blue/200","selection/text":"blue/900","selection/border":"blue/300","selection/indicator":"blue/500"
};

const DARK = {
  "surface/page":"neutral/1200","surface/default":"neutral/1100","surface/raised":"neutral/1000","surface/sunken":"alpha/white/4","surface/subtle":"neutral/1100","surface/overlay":"neutral/1000","surface/inverse":"neutral/50","surface/brand":"blue/400","surface/brand-subtle":"blue/1100",
  "text/primary":"neutral/50","text/secondary":"neutral/300","text/tertiary":"neutral/500","text/placeholder":"neutral/600","text/disabled":"neutral/700","text/inverse":"neutral/1200","text/on-brand":"alpha/white/100","text/link":"blue/300","text/link-hover":"blue/200","text/brand":"blue/300","text/danger":"red/300","text/warning":"dune/300","text/success":"green/300","text/info":"blue/300",
  "border/default":"neutral/900","border/subtle":"neutral/1000","border/hover":"neutral/800","border/strong":"neutral/600","border/disabled":"neutral/900","border/focus":"blue/400","border/brand":"blue/400","border/danger":"red/500","border/success":"green/500","border/warning":"dune/500",
  "action/solid/neutral/bg":"neutral/50","action/solid/neutral/border":"neutral/300","action/solid/neutral/text":"neutral/1200","action/solid/neutral/hover-bg":"neutral/100","action/solid/neutral/hover-border":"neutral/350",
  "action/solid/brand/bg":"blue/400","action/solid/brand/border":"blue/100","action/solid/brand/text":"alpha/white/100","action/solid/brand/hover-bg":"blue/500","action/solid/brand/hover-border":"blue/450",
  "action/soft/neutral/bg":"neutral/1100","action/soft/neutral/border":"neutral/1000","action/soft/neutral/text":"neutral/200","action/soft/neutral/hover-bg":"neutral/1000","action/soft/neutral/hover-border":"neutral/950",
  "action/soft/brand/bg":"blue/1100","action/soft/brand/border":"blue/1000","action/soft/brand/text":"blue/300","action/soft/brand/hover-bg":"blue/1000","action/soft/brand/hover-border":"blue/950",
  "action/soft/danger/bg":"red/1100","action/soft/danger/border":"red/1000","action/soft/danger/text":"red/300","action/soft/danger/hover-bg":"red/1000","action/soft/danger/hover-border":"red/950",
  "action/soft/success/bg":"green/1100","action/soft/success/border":"green/1000","action/soft/success/text":"green/300","action/soft/success/hover-bg":"green/1000","action/soft/success/hover-border":"green/950",
  "action/outline/neutral/bg":"TRANSPARENT","action/outline/neutral/border":"neutral/700","action/outline/neutral/text":"neutral/200",
  "action/outline/brand/bg":"TRANSPARENT","action/outline/brand/border":"blue/700","action/outline/brand/text":"blue/300",
  "action/ghost/neutral/bg":"TRANSPARENT","action/ghost/neutral/border":"TRANSPARENT","action/ghost/neutral/text":"neutral/200",
  "action/ghost/brand/bg":"TRANSPARENT","action/ghost/brand/border":"TRANSPARENT","action/ghost/brand/text":"blue/300",
  "action/hover":"alpha/white/8",
  "feedback/danger/bg":"red/1100","feedback/danger/border":"red/800","feedback/danger/border-hover":"red/650",
  "feedback/warning/bg":"dune/1100","feedback/warning/border":"dune/800",
  "feedback/success/bg":"green/1100","feedback/success/border":"green/800","feedback/success/border-hover":"green/650","feedback/success/icon":"green/400","feedback/success/icon-hover":"green/500",
  "feedback/info/bg":"blue/1100","feedback/info/border":"blue/800",
  "overlay/scrim":"alpha/black/56","overlay/scrim-heavy":"alpha/black/80","overlay/surface":"alpha/black/80",
  "selection/bg":"blue/1000","selection/bg-strong":"blue/900","selection/text":"blue/100","selection/border":"blue/700","selection/indicator":"blue/400"
};

// Re-index globals after creation
const freshGlobals = {};
for (const v of await figma.variables.getLocalVariablesAsync("COLOR")) {
  if (v.variableCollectionId === globalCol.id) freshGlobals[v.name] = v;
}

const semCol = await getOrCreateCollection("Semantic / Color", "Light");
let modes = semCol.modes;
let lightId = modes.find(m => m.name === "Light")?.modeId;
let darkId = modes.find(m => m.name === "Dark")?.modeId;
if (!lightId) { semCol.renameMode(modes[0].modeId, "Light"); lightId = modes[0].modeId; }
if (!darkId) darkId = semCol.addMode("Dark");

const sMap = await indexVars(semCol.id, "COLOR");
const TRANSPARENT = { r: 0, g: 0, b: 0, a: 0 };
let s2c = 0, s2u = 0;

function resolve(ref) {
  if (ref === "TRANSPARENT") return TRANSPARENT;
  const g = freshGlobals[ref];
  if (g) return figma.variables.createVariableAlias(g);
  console.warn("Missing global: " + ref);
  return TRANSPARENT;
}

const allSemTokens = new Set([...Object.keys(LIGHT), ...Object.keys(DARK)]);
for (const name of allSemTokens) {
  let v = sMap[name];
  const isNew = !v;
  if (!v) v = figma.variables.createVariable(name, semCol, "COLOR");
  if (LIGHT[name]) v.setValueForMode(lightId, resolve(LIGHT[name]));
  if (DARK[name]) v.setValueForMode(darkId, resolve(DARK[name]));
  isNew ? s2c++ : s2u++;
}

console.log(`[2/5] Semantic Colors — ${s2c} created, ${s2u} updated (${allSemTokens.size} tokens × 2 modes)`);

// ══════════════════════════════════════════════════════════════
// STEP 3 — Number Tokens
// ══════════════════════════════════════════════════════════════

// Mirrors the design system's numeric ramps. Keep in sync with the spec:
//   - Spacing ramp §2.1 (0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128).
//     Note: 0/20/40/80 are on the ramp but currently unnamed in the system; only the named token stops are emitted here.
//   - Radius ramp §2.1.1 (2xs=4, xs=8, 2s=10, s=12, 2m=14, m=16, l=20, xl=24, full=9999).
//   - Control scale §2.3 — 5-tier ramp XS=24, S=28, M=32, L=40, XL=48 (dense-default at M=32).
//   - Component scale §2.3 — every tier carries height/font/line-height/padding-x/icon/gap, derived from the same row.
//   - Badge §2.4 — sub-control scale (S=20, M=24), independent of the control ramp.
//   - Tooltip §9.5 — single size, 12/16 type, asymmetric 8/12 padding (py/px).
//   - Dialog §9.6 — single 440px width (no S/M/L variants).
const nums = {
  "space/3xs":2,"space/2xs":4,"space/xs":6,"space/s":8,"space/m":12,"space/l":16,"space/xl":24,"space/2xl":32,"space/3xl":48,"space/4xl":64,"space/5xl":96,"space/6xl":128,
  "control/xs":24,"control/s":28,"control/m":32,"control/l":40,"control/xl":48,
  "icon/xs":12,"icon/s":16,"icon/m":20,"icon/l":24,
  "radius/none":0,"radius/2xs":4,"radius/xs":8,"radius/2s":10,"radius/s":12,"radius/2m":14,"radius/m":16,"radius/l":20,"radius/xl":24,"radius/full":9999,
  "stroke/hairline":.5,"stroke/thin":1,"stroke/thick":1.5,"stroke/focus":2,
  "opacity/disabled":.5,"opacity/hover":.04,"opacity/pressed":.92,
  "duration/fast":100,"duration/base":150,"duration/medium":250,"duration/slow":400,
  "component/xs/height":24,"component/xs/font-size":12,"component/xs/line-height":16,"component/xs/padding-x":6,"component/xs/icon":12,"component/xs/gap":4,
  "component/s/height":28,"component/s/font-size":12,"component/s/line-height":16,"component/s/padding-x":6,"component/s/icon":12,"component/s/gap":4,
  "component/m/height":32,"component/m/font-size":12,"component/m/line-height":16,"component/m/padding-x":8,"component/m/icon":16,"component/m/gap":4,
  "component/l/height":40,"component/l/font-size":14,"component/l/line-height":20,"component/l/padding-x":12,"component/l/icon":20,"component/l/gap":6,
  "component/xl/height":48,"component/xl/font-size":16,"component/xl/line-height":24,"component/xl/padding-x":16,"component/xl/icon":24,"component/xl/gap":8,
  "badge/s/height":20,"badge/s/font-size":12,"badge/s/line-height":16,"badge/s/padding-x":6,"badge/s/icon":12,"badge/s/gap":4,
  "badge/m/height":24,"badge/m/font-size":12,"badge/m/line-height":16,"badge/m/padding-x":8,"badge/m/icon":12,"badge/m/gap":4,
  "tooltip/font-size":12,"tooltip/line-height":16,"tooltip/padding-y":8,"tooltip/padding-x":12,"tooltip/max-width":240,"tooltip/offset":4,"tooltip/radius":12,
  "dialog/width":440,"dialog/radius":20,"dialog/padding":16,"dialog/gap":16,
  "toast/min-height":40,"toast/min-width":280,"toast/max-width":360,"toast/padding-y":8,"toast/padding-x":12,"toast/gap":6,"toast/radius":16,
  "z/base":0,"z/content":10,"z/sidebar":20,"z/topbar":30,"z/anchored":40,"z/tooltip":50,"z/modal":60,"z/modal-tooltip":70,"z/toast":80,"z/critical":90
};

const numCol = await getOrCreateCollection("Primitives / Numbers", "Value");
const numMode = numCol.modes[0].modeId;
const nMap = await indexVars(numCol.id, "FLOAT");
let s3c = 0, s3u = 0;

for (const [name, value] of Object.entries(nums)) {
  (upsertVar(nMap, name, numCol, "FLOAT", numMode, value) ? s3c++ : s3u++);
}

console.log(`[3/5] Number Tokens — ${s3c} created, ${s3u} updated (${Object.keys(nums).length} total)`);

// ══════════════════════════════════════════════════════════════
// STEP 4 — Text Styles (delete-and-recreate for correct order)
// ══════════════════════════════════════════════════════════════

// Type ramp — mirrors §5.1.1 exactly (10 named tiers, no off-ramp pairs):
//   Display tier (DM Sans, weight 600 per spec — figma maps to "Medium" since DM Sans only ships 400/500/700):
//     display/2xl 32/40, display/xl 24/32, display/l 20/28, display/m 16/24
//   Label tier (DM Mono Medium / 500):
//     label/l 16/24, label/m 14/20, label/s 12/16
//   Body tier (DM Mono Regular / 400):
//     body/l 16/24, body/m 14/20, body/s 12/16
// Letter-spacing follows the prior figma calibration for the display tier; body/label tiers ship at 0.
const TYPE_RAMP = [
  ["Display", "2xl", "DM Sans", "Medium", 32, 40, -150],
  ["Display", "xl",  "DM Sans", "Medium", 24, 32, -50],
  ["Display", "l",   "DM Sans", "Medium", 20, 28, 0],
  ["Display", "m",   "DM Sans", "Medium", 16, 24, 0],
  ["Label",   "l",   "DM Mono", "Medium", 16, 24, 0],
  ["Label",   "m",   "DM Mono", "Medium", 14, 20, 0],
  ["Label",   "s",   "DM Mono", "Medium", 12, 16, 0],
  ["Body",    "l",   "DM Mono", "Regular", 16, 24, 0],
  ["Body",    "m",   "DM Mono", "Regular", 14, 20, 0],
  ["Body",    "s",   "DM Mono", "Regular", 12, 16, 0]
];

const fontsNeeded = new Set();
for (const [, , family, style] of TYPE_RAMP) fontsNeeded.add(JSON.stringify({ family, style }));
for (const f of fontsNeeded) {
  try { await figma.loadFontAsync(JSON.parse(f)); } catch(e) { console.warn("Font load failed:", f); }
}

// Delete ALL existing text styles so we can recreate in exact order
const existingTextStyles = await figma.getLocalTextStylesAsync();
for (const s of existingTextStyles) s.remove();
const s4d = existingTextStyles.length;

let s4c = 0;
for (const [cat, label, family, weight, fs, lh, tr] of TYPE_RAMP) {
  const style = figma.createTextStyle();
  style.name = `${cat}/${label}`;
  style.fontName = { family, style: weight };
  style.fontSize = fs;
  style.lineHeight = { value: lh, unit: "PIXELS" };
  style.letterSpacing = tr !== 0 ? { value: tr / 1000, unit: "PERCENT" } : { value: 0, unit: "PIXELS" };
  style.textDecoration = "NONE";
  style.textCase = "ORIGINAL";
  s4c++;
}

console.log(`[4/5] Text Styles — ${s4d} deleted, ${s4c} created (in correct order)`);

// ══════════════════════════════════════════════════════════════
// STEP 5 — Effect Styles
// ══════════════════════════════════════════════════════════════

const esMap = {};
for (const s of await figma.getLocalEffectStylesAsync()) esMap[s.name] = s;
let s5c = 0, s5u = 0;

function applyEffect(name, effects) {
  let s = esMap[name];
  if (!s) { s = figma.createEffectStyle(); s.name = name; s5c++; } else s5u++;
  s.effects = effects;
}

const B5 = { r:.38,g:.51,b:.96,a:1 }, B5_30 = { r:.38,g:.51,b:.96,a:.3 };
const R5 = { r:.85,g:.25,b:.25,a:1 }, R5_30 = { r:.85,g:.25,b:.25,a:.3 };
const G5 = { r:.25,g:.72,b:.45,a:1 }, G5_30 = { r:.25,g:.72,b:.45,a:.3 };

function ring(solid, halo) {
  return [
    { type:"DROP_SHADOW", color:solid, offset:{x:0,y:0}, radius:0, spread:1, visible:true, blendMode:"NORMAL" },
    { type:"DROP_SHADOW", color:halo,  offset:{x:0,y:0}, radius:0, spread:3, visible:true, blendMode:"NORMAL" }
  ];
}
function haloOnly(c) {
  return [{ type:"DROP_SHADOW", color:c, offset:{x:0,y:0}, radius:0, spread:2, visible:true, blendMode:"NORMAL" }];
}
function ds(color, y, blur, spread) {
  return { type:"DROP_SHADOW", color, offset:{x:0,y}, radius:blur, spread:spread||0, visible:true, blendMode:"NORMAL" };
}

// Focus rings — the two-layer translucent halo (§4.2). Halo-only variant for components without their own border.
applyEffect("Focus / Ring",          ring(B5, B5_30));
applyEffect("Focus / Ring Danger",   ring(R5, R5_30));
applyEffect("Focus / Ring Success",  ring(G5, G5_30));
applyEffect("Focus / Halo Only",     haloOnly(B5_30));
applyEffect("Focus / Halo Danger",   haloOnly(R5_30));
applyEffect("Focus / Halo Success",  haloOnly(G5_30));

// Elevation — the 5 sanctioned shadow recipes from §4.6.
// Note: Standing Rule #11 forbids decorative button-sheen highlights, so the previous "Button Highlight" inner-shadow has been removed.
applyEffect("Elevation / Shadow 1",     [ds({r:0,g:0,b:0,a:.06}, 1, 2)]);                                           // micro-lift (segmented control pressed)
applyEffect("Elevation / Shadow 2",     [ds({r:0,g:0,b:0,a:.12}, 2, 8)]);                                           // tooltip
applyEffect("Elevation / Shadow 3",     [ds({r:0,g:0,b:0,a:.08}, 4, 16), ds({r:0,g:0,b:0,a:.04}, 1, 4)]);            // anchored overlay (Select panel, Dropdown)
applyEffect("Elevation / Shadow 4",     [ds({r:0,g:0,b:0,a:.06}, 2, 4),  ds({r:0,g:0,b:0,a:.12}, 8, 16)]);            // modal (Dialog, future Drawer)
applyEffect("Elevation / Switch Thumb", [ds({r:0,g:0,b:0,a:.18}, 1, 2)]);                                           // Switch thumb (special-case, §9.2)

console.log(`[5/5] Effect Styles — ${s5c} created, ${s5u} updated`);

// ── Done ─────────────────────────────────────────────────────
figma.notify(`✓ Sync complete — ${s1c+s2c+s3c} vars created, ${s1u+s2u+s3u} vars updated, ${s4c+s5c} styles created`);

})();
