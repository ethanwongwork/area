/**
 * Every label hue's full set of roles (components audit D5, 2026-11-07; evidence: notion.md, "every colour has the same
 * role set"). Tag `color`, Board columns, Link's hued inks and a chart coloured by a label read these, never a tone or a
 * palette step of their own, so a hue means the same thing in every family and in both modes.
 *
 *   --area-hue-<hue>-text                words in the hue (4.5:1 on the page, the surfaces and its own tints)
 *   --area-hue-<hue>-icon                a glyph or a dot that stands alone (3:1 on the page, the surfaces and its tint)
 *   --area-hue-<hue>-border              an outline in the hue (the tone's stroke; gray and neutral the control edge)
 *   --area-hue-<hue>-bg, -bg-hover, -bg-active    the soft tint and its interactive steps (a Tag, a count)
 *   --area-hue-<hue>-accent              the strong fill, which carries `on-accent` words (a solid tag, a filled bar)
 *   --area-hue-<hue>-on-accent           words on the accent fill (4.5:1)
 *   --area-hue-<hue>-bg-translucent      the tint at half, see-through: a ground that sits on any ground (a Board column)
 *   --area-hue-<hue>-border-translucent  the hue's words at 10%: a ring on a tinted ground (Board cards' at the defaults)
 *
 * The roles are aliases of the tone tokens where one exists (blue is `info`, so it moves with Tone tint, Tone contrast
 * and Status colours), and palette steps chosen by the contrast rules where none does: the icon is the first rung from
 * 500 that clears 3.5:1 on white (the status marks' rule, emit/base.ts), and gray's accent is warm 500, the rung white
 * words clear 4.5:1 on. emit/base.ts writes the CSS; semantic/resolve.ts resolves the same table for the contrast gate.
 */
import { ALL_SCALES } from "../color/presets.ts";
import { buildScale } from "../color/scale.ts";
import { wcagContrastHex } from "../color/contrast.ts";

/** Tag `color`'s and Board's hues, in their menu order. `neutral` is the un-hued default. */
export const LABEL_HUES = ["neutral", "gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"] as const;
export type LabelHue = (typeof LABEL_HUES)[number];

/** The tone each hue is painted from (Tag, owner 2026-11-03: Tag and Board on the tone tokens). */
export const HUE_TONE: Record<Exclude<LabelHue, "neutral">, string> = {
  gray: "gray", brown: "brown", orange: "warning", yellow: "caution", green: "success",
  blue: "info", purple: "discovery", pink: "pink", red: "danger",
};

/** The palette family behind each tone (color/presets.ts ROLE_SCALES), where a role reads a step directly. */
export const TONE_FAMILY: Record<string, string> = {
  danger: "red", warning: "orange", caution: "yellow", success: "green", info: "blue", discovery: "purple",
  pink: "pink", gray: "warm", brown: "brown",
};

export const HUE_ROLES = [
  "text", "icon", "border", "bg", "bg-hover", "bg-active", "accent", "on-accent", "bg-translucent", "border-translucent",
] as const;
export type HueRole = (typeof HUE_ROLES)[number];

/** The rung a tone's mark (`fg-<tone>-mark`) reads in light: the first from 500 that clears 3.5:1 on white. */
const rungs = new Map<string, number>();
export function markRung(family: string): number {
  const known = rungs.get(family);
  if (known !== undefined) return known;
  const spec = ALL_SCALES.find(scale => scale.id === family);
  if (!spec) throw new Error(`Unknown family "${family}"`);
  const rung = buildScale(spec, "light").steps.filter(step => step.level >= 500).find(step => wcagContrastHex(step.hex, "#ffffff") >= 3.5);
  if (!rung) throw new Error(`No ${family} rung clears 3.5:1 on white`);
  rungs.set(family, rung.level);
  return rung.level;
}

/** Gray has no solid of its own (a near-neutral scale's solid is near-black): its accent is warm at this rung. */
export const GRAY_ACCENT_RUNG = 500;

/** The neutral hue's translucent paints, as written: Tag's measured default and Board's 3% wash of the default ink. */
export const NEUTRAL_HUE = {
  /** Tag's default (Notion's un-coloured select, rgba(42,28,0,.07); dark white 10%). */
  bg: { light: [42, 28, 0, 0.07], dark: [255, 255, 255, 0.1] },
  /** bg with the hover and selected washes laid over it, as bg-mark-hover is (light 7% + 5% of 93%, dark 10% + 14% of 90%). */
  "bg-hover": { light: [42, 28, 0, 0.1165], dark: [255, 255, 255, 0.226] },
  "bg-active": { light: [42, 28, 0, 0.1351], dark: [255, 255, 255, 0.271] },
} as const;
/** Board's neutral column ground: the default ink at 3%. */
export const NEUTRAL_GROUND_SHARE = 0.03;
/** The translucent ring's share of the hue's words: Board's card ring at the default Cards stroke (4 × 2.5%). */
export const RING_SHARE = 0.1;

const rgba = ([r, g, b, a]: readonly number[]) => `rgb(${r} ${g} ${b} / ${a})`;
const pair = (paint: { light: readonly number[]; dark: readonly number[] }) => `light-dark(${rgba(paint.light)}, ${rgba(paint.dark)})`;

/** One hue's roles as CSS: tone aliases, palette steps and mixes, all re-derived wherever their inputs change. */
export function hueRoleCss(prefix: string): Record<string, string> {
  const v = (name: string) => `var(${prefix}${name})`;
  const out: Record<string, string> = {};
  for (const hue of LABEL_HUES) {
    const name = (role: HueRole) => `${prefix}hue-${hue}-${role}`;
    if (hue === "neutral") {
      out[name("text")] = v("fg-default");
      out[name("icon")] = v("fg-muted");
      out[name("border")] = v("border");
      out[name("bg")] = pair(NEUTRAL_HUE.bg);
      out[name("bg-hover")] = pair(NEUTRAL_HUE["bg-hover"]);
      out[name("bg-active")] = pair(NEUTRAL_HUE["bg-active"]);
      out[name("accent")] = v("neutral-solid");
      out[name("on-accent")] = v("fg-on-neutral");
      out[name("bg-translucent")] = `color-mix(in oklab, ${v("fg-default")} ${NEUTRAL_GROUND_SHARE * 100}%, transparent)`;
    } else {
      const tone = HUE_TONE[hue];
      out[name("text")] = v(`fg-${tone}`);
      out[name("icon")] = v(`fg-${tone}-mark`);
      // A near-neutral scale has no tinted stroke that clears the outline floor (aliases.ts, tagToneBlock): gray's
      // outline is the control edge.
      out[name("border")] = hue === "gray" ? v("border") : v(`${tone}-border`);
      out[name("bg")] = v(`${tone}-surface`);
      out[name("bg-hover")] = v(`${tone}-surface-hover`);
      out[name("bg-active")] = v(`${tone}-surface-active`);
      out[name("accent")] = hue === "gray" ? v(`warm-${GRAY_ACCENT_RUNG}`) : v(`${tone}-solid`);
      out[name("on-accent")] = hue === "gray" ? v("white") : v(`fg-on-${tone}`);
      out[name("bg-translucent")] = `color-mix(in oklab, ${v(`hue-${hue}-bg`)} 50%, transparent)`;
    }
    out[name("border-translucent")] = `color-mix(in oklab, ${v(`hue-${hue}-text`)} ${RING_SHARE * 100}%, transparent)`;
  }
  return out;
}

/** The tones with no status mark of their own until 2026-11-07, given one by the same rule (emit/base.ts). */
export const LABEL_MARK_TONES = ["pink", "brown", "gray"] as const;

const blend = (fg: readonly number[], alpha: number, ground: string): string => {
  const g = [1, 3, 5].map(i => parseInt(ground.slice(i, i + 2), 16));
  const hex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${fg.slice(0, 3).map((c, i) => hex(c * alpha + g[i]! * (1 - alpha))).join("")}`;
};
const hexRgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

/**
 * The same table resolved to hex for one theme, for the contrast gate (contrast/assertions.ts). Translucent roles are
 * measured as they paint over the page; the ring over the surface it sits on.
 */
export function resolveHueRoles(tokens: Record<string, string>, stepHex: (family: string, level: number) => string, theme: "light" | "dark"): Record<string, string> {
  const out: Record<string, string> = {};
  const page = tokens["bg-page"]!, surface = tokens["bg-surface"]!;
  for (const hue of LABEL_HUES) {
    const name = (role: HueRole) => `hue-${hue}-${role}`;
    if (hue === "neutral") {
      out[name("text")] = tokens["fg-default"]!;
      out[name("icon")] = tokens["fg-muted"]!;
      out[name("border")] = tokens["border"]!;
      for (const role of ["bg", "bg-hover", "bg-active"] as const) { const paint = NEUTRAL_HUE[role][theme]; out[name(role)] = blend(paint, paint[3]!, page); }
      out[name("accent")] = tokens["neutral-solid"]!;
      out[name("on-accent")] = tokens["fg-on-neutral"]!;
      out[name("bg-translucent")] = blend(hexRgb(tokens["fg-default"]!), NEUTRAL_GROUND_SHARE, page);
    } else {
      const tone = HUE_TONE[hue], family = TONE_FAMILY[tone]!;
      out[name("text")] = tokens[`fg-${tone}`]!;
      out[name("icon")] = theme === "light" ? stepHex(family, markRung(family)) : tokens[`fg-${tone}`]!;
      out[name("border")] = hue === "gray" ? tokens["border"]! : tokens[`${tone}-border`]!;
      out[name("bg")] = tokens[`${tone}-surface`]!;
      out[name("bg-hover")] = tokens[`${tone}-surface-hover`]!;
      out[name("bg-active")] = tokens[`${tone}-surface-active`]!;
      out[name("accent")] = hue === "gray" ? stepHex("warm", GRAY_ACCENT_RUNG) : tokens[`${tone}-solid`]!;
      out[name("on-accent")] = hue === "gray" ? "#ffffff" : tokens[`fg-on-${tone}`]!;
      out[name("bg-translucent")] = blend(hexRgb(out[name("bg")]!), 0.5, page);
    }
    out[name("border-translucent")] = blend(hexRgb(out[name("text")]!), RING_SHARE, surface);
  }
  return out;
}
