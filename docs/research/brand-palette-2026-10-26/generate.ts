/**
 * Brand palette prototype (2026-10-26, owner: "can an entire color palette be created/generated based on the input/choice
 * of 1 specific color … the specific accent color(s) they choose and what additional colors they want to use (even for
 * semantic purposes) should feel part of their brand"; "keep the current palette for area's default").
 *
 * Research only: nothing here ships. It registers brand families in memory beside the palette (palette.json is read, never
 * written), points the roles at them, and runs Area's own solver (color/scale.ts) and contrast assertions on the result,
 * so every colour on the review page is one the system would really make, measured as it would be.
 *
 *   node --experimental-strip-types docs/research/brand-palette-2026-10-26/generate.ts > out.json
 *
 * The model:
 *   family     an exact brand colour on Area's ladder: the generated family at its hue (color/generate.ts), the nearest
 *              rung moved onto the brand colour, the lightness offset tapering to nothing at the ladder's ends, and every
 *              rung's share of the chroma sRGB allows scaled by the brand's own share against the palette's at that rung
 *              (Material's Fidelity: the seed exact; Area: the palette's ladder and solvers)
 *   status     harmonised: each status hue turned toward the brand hue by half the difference, at most 15° (Material's
 *              Blend.harmonize), at the brand's chroma character, never under 45% of the palette's so a status reads
 *   support    a categorical set: hues stepped round the wheel from the brand, at its character, each a light and a deep
 *              tone carrying its readable label (tags, avatars, charts, events, folders)
 *   surfaces   a brand page tint and a deep brand ground, from the brand family's ends
 */
import PALETTE from "../../../packages/tokens/src/color/palette.json" with { type: "json" };
import { generatedFamily } from "../../../packages/tokens/src/color/generate.ts";
import { CHROMATIC_SCALES, ALL_SCALES, ROLE_SCALES } from "../../../packages/tokens/src/color/presets.ts";
import { LEVELS } from "../../../packages/tokens/src/color/curves.ts";
import { SRGB, clampRgb, deltaEOk, labToLch, oklchToRgb, parseHex, rgbToOklab, toHex } from "../../../packages/tokens/src/color/oklab.ts";
import { maxChromaAt } from "../../../packages/tokens/src/color/gamut.ts";
import { apcaMagnitude, wcagContrastHex } from "../../../packages/tokens/src/color/contrast.ts";
import { buildScale, type ScaleSpec } from "../../../packages/tokens/src/color/scale.ts";
import { resolveTheme } from "../../../packages/tokens/src/semantic/resolve.ts";
import { ASSERTIONS } from "../../../packages/tokens/src/contrast/assertions.ts";

type Rung = { hex: string; oklch: { L: number; C: number; H: number } };
type Family = Record<string, Rung>;
const FAMILIES = (PALETTE as unknown as { families: Record<string, Family> }).families;

const lch = (hex: string) => labToLch(rgbToOklab(parseHex(hex), SRGB));
const room = (L: number, h: number) => maxChromaAt(L, h, SRGB);
const shareOf = (rung: Rung) => Math.min(1, rung.oklch.C / Math.max(1e-6, room(rung.oklch.L, rung.oklch.H)));
const round = (n: number) => Math.round(n * 1e4) / 1e4;
const make = (L: number, C: number, h: number): Rung => {
  const hex = toHex(clampRgb(oklchToRgb({ L, C, h }, SRGB)));
  return { hex, oklch: { L: round(L), C: round(C), H: round(h) } };
};

/** How vivid a colour is for its hue and lightness, against the palette's family at that hue and rung: 1 is the palette. */
function character(hex: string): number {
  const c = lch(hex), base = generatedFamily(c.h);
  const level = LEVELS.reduce((a, l) => Math.abs(base[String(l)]!.oklch.L - c.L) < Math.abs(base[String(a)]!.oklch.L - c.L) ? l : a, LEVELS[0]!);
  const own = Math.min(1, c.C / Math.max(1e-6, room(c.L, c.h)));
  return own / Math.max(1e-6, shareOf(base[String(level)]!));
}

/** An exact colour on Area's ladder: its hue's generated family, the nearest rung moved onto it, chroma at its character. */
function brandFamily(hex: string): { family: Family; anchor: number } {
  const c = lch(hex), base = generatedFamily(c.h);
  const anchor = LEVELS.reduce((a, l) => Math.abs(base[String(l)]!.oklch.L - c.L) < Math.abs(base[String(a)]!.oklch.L - c.L) ? l : a, LEVELS[0]!);
  const ai = LEVELS.indexOf(anchor), dL = c.L - base[String(anchor)]!.oklch.L;
  const k = character(hex);
  const family: Family = {};
  LEVELS.forEach((level, i) => {
    const w = i <= ai ? i / Math.max(1, ai) : (LEVELS.length - 1 - i) / Math.max(1, LEVELS.length - 1 - ai);
    const rung = base[String(level)]!;
    const L = rung.oklch.L + dL * w;
    family[String(level)] = level === anchor ? { hex: hex.toLowerCase(), oklch: { L: round(c.L), C: round(c.C), H: round(c.h) } }
      : make(L, Math.min(1, shareOf(rung) * k) * room(L, c.h), c.h);
  });
  return { family, anchor };
}

/** A palette family's hue turned toward the brand by half the difference, at most 15°, at the brand's character. */
function harmonised(id: string, brandHex: string): Family {
  const from = FAMILIES[id]!["500"]!.oklch.H, to = lch(brandHex).h;
  const diff = ((to - from + 540) % 360) - 180;
  const hue = (from + Math.sign(diff) * Math.min(Math.abs(diff) * 0.5, 15) + 360) % 360;
  const k = Math.max(0.45, Math.min(1, character(brandHex)));
  const base = generatedFamily(hue);
  return Object.fromEntries(LEVELS.map(level => {
    const rung = base[String(level)]!;
    return [String(level), make(rung.oklch.L, Math.min(1, shareOf(rung) * k) * room(rung.oklch.L, hue), hue)];
  }));
}

const readable = (bg: string) => {
  const passes = (fg: string) => wcagContrastHex(fg, bg) >= 4.6 && apcaMagnitude(fg, bg) >= 61;
  return passes("#000000") ? "#000000" : passes("#ffffff") ? "#ffffff" : wcagContrastHex("#000000", bg) >= wcagContrastHex("#ffffff", bg) ? "#000000" : "#ffffff";
};

/** The label that reads on a colour as a button's (4.6:1 and Lc 61, Area's solid contract), or null where neither does. */
function exactLabel(hex: string): "#000000" | "#ffffff" | null {
  const passes = (fg: string) => wcagContrastHex(fg, hex) >= 4.6 && apcaMagnitude(fg, hex) >= 61;
  return passes("#ffffff") ? "#ffffff" : passes("#000000") ? "#000000" : null;
}

/** A categorical set from the brand: `count` hues stepped from it, each a light and a deep tone with its label. */
function supporting(brandHex: string, count: number) {
  const c = lch(brandHex), k = Math.max(0.45, Math.min(1, character(brandHex)));
  return Array.from({ length: count }, (_, i) => {
    const hue = (c.h + (360 / count) * i) % 360, base = generatedFamily(hue);
    const at = (level: number) => { const r = base[String(level)]!; return make(r.oklch.L, Math.min(1, shareOf(r) * k) * room(r.oklch.L, hue), hue).hex; };
    const light = at(200), deep = at(700);
    return { hue: Math.round(hue), light, onLight: readable(light), deep, onDeep: readable(deep) };
  });
}

let serial = 0;
/** Puts a family in the palette under a fresh id, as a chromatic scale whose solid carries the label that reads on it. */
function register(family: Family, prefer?: "light" | "dark"): string {
  const id = `brand-${++serial}`;
  FAMILIES[id] = family;
  const solidForeground = prefer ?? (readable(family["500"]!.hex) === "#000000" ? "dark" : "light");
  const spec: ScaleSpec = { id, kind: "chromatic", ...(solidForeground === "dark" ? { solidForeground } : {}) };
  (CHROMATIC_SCALES as ScaleSpec[]).push(spec);
  (ALL_SCALES as ScaleSpec[]).push(spec);
  return id;
}

const STATUS = { danger: "red", warning: "orange", caution: "yellow", success: "green", info: "blue", discovery: "purple" } as const;
const DEFAULT_ROLES = { ...ROLE_SCALES };
const ROLE_KEYS = /^(accent|danger|warning|caution|success|info|discovery|fg-accent|fg-danger|fg-warning|fg-caution|fg-success|fg-info|fg-discovery|fg-on-(accent|danger|warning|caution|success|info|discovery))/;

/** Resolves both modes with these roles, runs the contrast assertions, and keeps the role tokens to paint the app with. */
function theme(accent: string, statuses: Partial<Record<keyof typeof STATUS, string>>, solid: number | "auto" = "auto") {
  Object.assign(ROLE_SCALES, DEFAULT_ROLES, statuses);
  const out: Record<string, unknown> = {};
  for (const mode of ["light", "dark"] as const) {
    const t = resolveTheme({ theme: mode, neutral: "neutral", accent, solid: { light: solid as never, dark: solid as never } }).tokens;
    const failures = ASSERTIONS.filter(a => {
      const fg = t[a.fg], bg = t[a.bg];
      if (!fg || !bg) return false;
      return wcagContrastHex(fg, bg) < a.wcag || (mode === "dark" && apcaMagnitude(fg, bg) < a.apca);
    }).map(a => `${a.fg} on ${a.bg}`);
    out[mode] = { failures, checked: ASSERTIONS.length, tokens: Object.fromEntries(Object.entries(t).filter(([k]) => ROLE_KEYS.test(k))) };
  }
  Object.assign(ROLE_SCALES, DEFAULT_ROLES);
  return out;
}

/** The examples: brand colours read off the owner's references (2026-10-26). */
const BRANDS = [
  { name: "Area default", primary: null, secondary: null, note: "The palette as it ships: blue accent, fixed status colours." },
  { name: "Studio blue", primary: "#667fff", secondary: "#b2a99d", note: "Blue #667FFF and Brown #B2A99D (the brand sheet with Sand, Grey and the pastel strip)." },
  { name: "Go green", primary: "#00b65c", secondary: "#a785fe", note: "GO Green #00B65C with Lavender #A785FE (the brand main colour cards)." },
  { name: "Ipê", primary: "#e5e12d", secondary: "#587989", note: "Amarelo Ipê #E5E12D with Azul Neblina #587989 and Grafite #242A2D (the Brazilian brand sheet)." },
  { name: "Nezumi", primary: "#4d80e6", secondary: "#47585c", note: "Nezuogusa #4D80E6 with Sabi Nezu #47585C (Japanese colours for UI)." },
];

const ladder = (family: Family) => LEVELS.map(level => ({ level, hex: family[String(level)]!.hex }));

const result = BRANDS.map(brand => {
  if (!brand.primary) {
    const statusDefault = Object.fromEntries(Object.entries(STATUS).map(([role, id]) => [role, ladder(FAMILIES[id]!)]));
    return { ...brand, accent: ladder(FAMILIES.blue!), statuses: statusDefault, supporting: [], theme: theme("blue", {}) };
  }
  const primary = brandFamily(brand.primary), secondary = brandFamily(brand.secondary!);
  const accentId = register(primary.family);
  const harmonisedIds = Object.fromEntries(Object.entries(STATUS).map(([role, id]) => [role, register(harmonised(id, brand.primary!), role === "warning" || role === "caution" ? "dark" : "light")]));
  const accentScale = buildScale(CHROMATIC_SCALES.find(s => s.id === accentId)!, "light");
  // The button nearest the brand: the Shade step that looks most like the brand colour (OKLab distance) among those that
  // land on themselves, under whichever label reads (Shade flips the label, 2026-10-25), not the most vivid shade.
  const looks = (level: number) => deltaEOk(rgbToOklab(parseHex(accentScale.steps.find(x => x.level === level)!.hex), SRGB), rgbToOklab(parseHex(brand.primary), SRGB));
  const landing = Object.entries(accentScale.solidSteps).filter(([step, v]) => v.level === Number(step));
  const [nearStep, near] = landing.sort((a, b) => looks(a[1].level) - looks(b[1].level))[0]!;
  const nearest = { step: Number(nearStep), hex: accentScale.steps.find(x => x.level === near.level)!.hex, label: near.fg };
  const c = lch(brand.primary);
  return {
    ...brand,
    character: round(character(brand.primary)),
    hue: Math.round(c.h),
    anchor: primary.anchor,
    accent: ladder(primary.family),
    secondaryLadder: ladder(secondary.family),
    secondaryAnchor: secondary.anchor,
    solid: { level: accentScale.solid.level.light, hex: accentScale.steps.find(x => x.level === accentScale.solid.level.light)!.hex, label: accentScale.contrast.hex, isBrand: accentScale.solid.level.light === primary.anchor },
    // The brand colour itself as the button: the label that reads on it at full strength, if either does.
    exact: { hex: brand.primary, label: exactLabel(brand.primary) },
    exactSecondary: { hex: brand.secondary, label: exactLabel(brand.secondary!) },
    statuses: Object.fromEntries(Object.entries(harmonisedIds).map(([role, id]) => [role, ladder(FAMILIES[id]!)])),
    statusDefault: Object.fromEntries(Object.entries(STATUS).map(([role, id]) => [role, ladder(FAMILIES[id]!)])),
    supporting: supporting(brand.primary, 8),
    surfaces: { page: primary.family["25"]!.hex, tint: primary.family["50"]!.hex, ground: primary.family["900"]!.hex, groundDeep: primary.family["950"]!.hex, onGround: readable(primary.family["900"]!.hex) },
    nearest,
    theme: theme(accentId, harmonisedIds, nearest.step),
    themeFixedStatus: theme(accentId, {}, nearest.step),
    themeVivid: theme(accentId, harmonisedIds),
  };
});

console.log(JSON.stringify(result, null, 1));
