/**
 * The Canvas's exact colours (owner, 2026-10-27; plan https://claude.ai/artifact/K4rswTACDiMB31nd4nzWz2): the light page
 * and the dark page, each one exact colour or none (the page settings decide), painting the specimens through
 * `@area/tokens/colours` as Brand colours do (src/brand.ts): a `[data-area-colours]` rule in the document's head and the
 * attribute on the scopes that carry the Inspector's settings. Saved as colours, never as the numbers they solve to, and
 * validated on the way back in.
 *
 * A Canvas saved before picks converts once (`convertPresets`): each mode's page and tint presets become the pick that
 * paints them, where one does. Where none does (Cool's or Warm's own cast, a tint following the accent, a tint the page
 * itself can't show), the presets stay as they are, so nothing on screen moves. The presets a pick replaces stay saved
 * too; the pick wins over them, and moving one of them in the Inspector drops the pick (`PAGE_AXES`).
 */
import { useInsertionEffect, useMemo } from "react";
import TOKENS from "@area/tokens/tokens.json";
import { colourCss, formatOklch, isColour, parseColour, presetPick, solvePage } from "@area/tokens/colours";
import type { CanvasAxes } from "./studio.tsx";

export type Mode = "light" | "dark";
export interface ColoursState { light: string | null; dark: string | null }
export const COLOURS_DEFAULT: ColoursState = { light: null, dark: null };

/** The settings a mode's page pick stands in for: writing one of them hands that mode back to the settings. */
export const PAGE_AXES: Readonly<Record<Mode, readonly string[]>> = {
  light: ["ground-light", "tint-light", "tint-hue", "neutral"],
  dark: ["ground-dark", "tint-dark", "tint-hue-dark", "neutral"],
};

/** A pick as it is saved: the colour the page paints, as `oklch(L C h)` (held inside what can show). */
export const normalise = (mode: Mode, colour: string) => formatOklch(solvePage(mode, parseColour(colour)).painted);

/** The Neutral setting's own cast, per mode: its Auto tint hue and strength. */
const neutralToken = (neutral: string, name: string) => Number((TOKENS.axes as unknown as Array<{ id: string; presets: Array<{ id: string; tokens?: Record<string, string> }> }>)
  .find(axis => axis.id === "neutral")?.presets.find(preset => preset.id === neutral)?.tokens?.[`--area-${name}`] ?? 0);
const neutralHue = (neutral: string, mode: Mode) => neutralToken(neutral, `neutral-hue-${mode}`);
export const neutralCast = (neutral: string, mode: Mode) => ({ hue: neutralHue(neutral, mode), chroma: neutralToken(neutral, `neutral-chroma-${mode}`) });

/** The pick a mode's page and tint presets paint, or null where no pick reproduces them (they stay as settings). */
export function presetColour(canvas: CanvasAxes, mode: Mode): string | null {
  const hue = mode === "dark" && canvas["tint-hue-dark"] !== "same" ? canvas["tint-hue-dark"] : canvas["tint-hue"];
  const strength = canvas[`tint-${mode}`], ground = Number(canvas[`ground-${mode}`]);
  if (!Number.isFinite(ground) || hue === "accent") return null;
  // Auto strength is the Neutral setting's own: none for Neutral, Cool's and Warm's ramps for theirs, which stay settings.
  if (strength === "auto") return canvas.neutral === "neutral" ? formatOklch(presetPick(mode, ground, null)!) : null;
  const pick = presetPick(mode, ground, { hue: hue === "auto" ? neutralHue(canvas.neutral, mode) : Number(hue), position: Number(strength) });
  return pick ? formatOklch(pick) : null;
}

/** Each mode's presets as picks, once, for a Canvas saved before picks. A page the defaults paint stays without one. */
export function convertPresets(canvas: CanvasAxes, defaults: CanvasAxes): ColoursState {
  const out: ColoursState = { ...COLOURS_DEFAULT };
  for (const mode of ["light", "dark"] as const) {
    const own = presetColour(canvas, mode);
    if (own && own !== presetColour(defaults, mode)) out[mode] = own;
  }
  return out;
}

/** Saved picks, each kept only while it is still a colour; with none saved, the Canvas's presets converted once. */
export function restoreColours(saved: unknown, canvas: CanvasAxes, defaults: CanvasAxes): ColoursState {
  if (saved === null || typeof saved !== "object") return convertPresets(canvas, defaults);
  const s = saved as Record<string, unknown>;
  const pick = (mode: Mode) => typeof s[mode] === "string" && isColour(s[mode] as string) ? normalise(mode, s[mode] as string) : null;
  return { light: pick("light"), dark: pick("dark") };
}

/** The picks shown: a hover preview of one of a mode's page settings shows the settings, as choosing it would. */
export function shownColours(colours: ColoursState, preview: Readonly<Record<string, unknown>>): ColoursState {
  const previewing = (mode: Mode) => PAGE_AXES[mode].some(axis => axis in preview);
  return { light: previewing("light") ? null : colours.light, dark: previewing("dark") ? null : colours.dark };
}

export const hasColours = (colours: ColoursState) => colours.light !== null || colours.dark !== null;
/** Whether a pick leans toward a hue at all (a grey page's text has no tint to take). */
export const pickTinted = (colour: string | null) => colour !== null && parseColour(colour).c > 0;
const pageOf = (colours: ColoursState) => ({ ...(colours.light ? { light: colours.light } : {}), ...(colours.dark ? { dark: colours.dark } : {}) });

/** The picks' rule, `[data-area-colours]` in the axes layer, after the axes' own so it wins where a scope carries both. */
export const coloursSheet = (colours: ColoursState) => colourCss({ page: pageOf(colours) });

/** The picks as the theme's code shows them: the rule's declarations alone, on `[data-area-colours]`. */
export function coloursCode(colours: ColoursState): string {
  const body = coloursSheet(colours).split("\n").filter(line => /^\s+--area-/.test(line)).map(line => `  ${line.trim()}`).join("\n");
  return `<style>\n  [data-area-colours] {\n${body.replace(/^/gm, "  ")}\n  }\n</style>`;
}

/** Keeps the picks' rule in the document's head while there are any, and takes it out when there are none. */
export function useColoursSheet(colours: ColoursState) {
  const css = useMemo(() => hasColours(colours) ? coloursSheet(colours) : null, [colours.light, colours.dark]);
  useInsertionEffect(() => {
    if (!css) return;
    const style = document.createElement("style");
    style.dataset.areaColoursSheet = "";
    style.textContent = css;
    document.head.append(style);
    return () => style.remove();
  }, [css]);
}
