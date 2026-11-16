/**
 * The token data the foundation tabs show, from @area/tokens' build (tokens.json): the type roles
 * at each type size, the colour scales and the spacing and radius ramps. Values on the Canvas are
 * the live CSS custom properties; these are the names and the numbers behind them.
 */
import TOKENS from "@area/tokens/tokens.json";

type Preset = { id: string; label: string; description: string; tokens: Record<string, string> };
type Axis = { id: string; label: string; description: string; attribute: string; defaultPreset: string; presets: Preset[] };
const axis = (id: string) => (TOKENS.axes as unknown as Axis[]).find(entry => entry.id === id)!;

/* "var(--area-size-14)" -> 14 */
const px = (value: string | undefined) => Number((value ?? "").replace(/var\(--area-(size|leading)-|\)/g, "")) || 0;

/** The type axis's sizes (axes/type-size.ts), 12 to 16, and its default, 14. */
export const TYPE_SIZES = axis("type").presets.map(preset => preset.id);
export const DEFAULT_TYPE = axis("type").defaultPreset;

export interface TypeRole {
  id: string;
  group: "display" | "title" | "text";
  step: string;
  name: string;
  /** size / leading in px, and tracking, at each type size ("12" … "16"). */
  metrics: Record<string, { size: number; leading: number; tracking: string }>;
}

/* Named as Vercel's Geist names its ramp (owner, 2026-10-11): what a role is for and its size at
   the default type size, "Heading 72", "Copy 14". Display and title roles are headings; text is copy. */
const roleName = (group: TypeRole["group"], size: number) => `${group === "text" ? "Copy" : "Heading"} ${size}`;

/** Every type role, largest first. */
export const TYPE_ROLES: TypeRole[] = (() => {
  const type = axis("type");
  const preset = (id: string) => type.presets.find(entry => entry.id === id)!.tokens;
  const roles: TypeRole[] = [];
  for (const name of Object.keys(preset(DEFAULT_TYPE))) {
    const match = name.match(/^--area-(text|title|display)-(\w+)-size$/);
    if (!match) continue;
    const [, group, step] = match as unknown as [string, TypeRole["group"], string];
    const metrics = (id: string) => ({
      size: px(preset(id)[`--area-${group}-${step}-size`]),
      leading: px(preset(id)[`--area-${group}-${step}-leading`]),
      tracking: preset(id)[`--area-${group}-${step}-tracking`] ?? "0em",
    });
    roles.push({ id: `${group}-${step}`, group, step, name: roleName(group, metrics(DEFAULT_TYPE).size), metrics: Object.fromEntries(TYPE_SIZES.map(id => [id, metrics(id)])) });
  }
  // Largest first; at one size a display role before a title before text (Title XS and Text MD are both 16 / 24).
  const rank = { display: 0, title: 1, text: 2 };
  return roles.sort((a, b) => b.metrics[DEFAULT_TYPE]!.size - a.metrics[DEFAULT_TYPE]!.size || rank[a.group] - rank[b.group]);
})();

export interface ScaleStep { level: number; hex: string; oklch: string; contrast: { fg: string; ratio: number; grade: string } }
export interface Scale { id: string; description: string; steps: ScaleStep[] }

/** The colour scales, neutrals first, as @area/tokens orders them. */
export const SCALES: Scale[] = Object.entries(TOKENS.scales as unknown as Record<string, { steps: ScaleStep[] }>).map(([id, scale]) => ({
  id,
  description: (TOKENS.scaleDescriptions as Record<string, string>)[id] ?? "",
  steps: scale.steps,
}));

export const AXES = TOKENS.axes as unknown as Axis[];
