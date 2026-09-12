/**
 * Density: control heights, their internal gutters, icon sizes, and gaps.
 *
 * The default tier is 32px. That is the most common default across every system measured:
 * GitHub Primer's `--control-medium-size`, OpenAI's `--control-size-md`, and Notion's own
 * in-app control height all land on 32, with shadcn at 36 and Vercel at 40 either side.
 * The five-tier ladder 24/28/32/40/48 is Primer's exact scale.
 *
 * Presets shift which rung is "medium"; they do not rescale the spacing primitives.
 * Compact means components pick smaller steps, not that 12px quietly becomes 10px.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

export type Tier = "xs" | "sm" | "md" | "lg" | "xl";

/** One tier of the control ladder. */
interface TierSpec {
  height: number;
  /** Horizontal padding inside the control. */
  gutter: number;
  /** Inline icon size. */
  icon: number;
  /** Gap between icon and label. */
  gap: number;
  /** Which typography step the control's label uses. */
  text: string;
}

function ladder(tiers: Record<Tier, TierSpec>) {
  const out: Record<string, string | number> = {};
  for (const [name, tier] of Object.entries(tiers)) {
    out[`control-${name}`] = `${tier.height}px`;
    out[`gutter-${name}`] = `${tier.gutter}px`;
    out[`icon-${name}`] = `${tier.icon}px`;
    out[`gap-${name}`] = `${tier.gap}px`;
    out[`control-${name}-text`] = `var(--area-text-${tier.text}-size)`;
    out[`control-${name}-leading`] = `var(--area-text-${tier.text}-leading)`;
  }
  return out;
}

/**
 * Default: the comfortable ladder, calibrated to Primer, OpenAI and Vercel.
 *
 * 32px at medium is unanimous across all three -- Primer's `--control-medium-size`,
 * OpenAI's `--control-size-md`, and Vercel's small button all land there. The 24/28/32/40/48
 * ladder is Primer's exact scale.
 *
 * Icon holds at 16px through the middle of the range rather than scaling with the box,
 * because 16px is the near-universal inline icon size and growing it with the control
 * makes a small control look cluttered.
 */
const DEFAULT_TIERS: Record<Tier, TierSpec> = {
  xs: { height: 24, gutter: 8, icon: 14, gap: 4, text: "xs" },
  sm: { height: 28, gutter: 10, icon: 16, gap: 6, text: "sm" },
  md: { height: 32, gutter: 12, icon: 16, gap: 6, text: "sm" },
  lg: { height: 40, gutter: 16, icon: 20, gap: 6, text: "sm" },
  xl: { height: 48, gutter: 20, icon: 24, gap: 8, text: "md" },
};

/**
 * Compact: the dense ladder, calibrated to Notion.
 *
 * Notion's measured in-app ladder is 24 for an icon-only button, 28 for a menu row or a
 * standard button, and 32 for a filled call to action -- so 28 is the medium here.
 *
 * The type size does not move with it. Notion renders 14px text inside those 28px rows,
 * and that is the point of a dense preset: the box gets tighter while the text stays
 * readable. A preset that shrank the text too would just be the same interface further
 * away. Only the two smallest tiers drop to 12px, because 14/20 text cannot fit a 20px
 * box at all.
 */
const COMPACT_TIERS: Record<Tier, TierSpec> = {
  xs: { height: 20, gutter: 6, icon: 12, gap: 4, text: "xs" },
  sm: { height: 24, gutter: 8, icon: 14, gap: 4, text: "xs" },
  md: { height: 28, gutter: 10, icon: 16, gap: 6, text: "sm" },
  lg: { height: 32, gutter: 12, icon: 16, gap: 6, text: "sm" },
  xl: { height: 36, gutter: 14, icon: 20, gap: 8, text: "sm" },
};

export const DENSITY_AXIS: AxisDefinition = {
  id: "density",
  label: "Density",
  description: "How tall controls are, and how much room they leave inside themselves. The type size holds; only the box moves.",
  defaultPreset: "default",
  namespaces: ["--area-control-", "--area-gutter-", "--area-icon-", "--area-gap-"],
  presets: [
    {
      id: "compact",
      label: "Compact",
      description: "28px controls. Calibrated to Notion. For dense, tool-shaped interfaces.",
      tokens: tokens(ladder(COMPACT_TIERS)),
    },
    {
      id: "default",
      label: "Default",
      description: "32px controls. Calibrated to Primer, OpenAI and Vercel.",
      tokens: tokens(ladder(DEFAULT_TIERS)),
    },
  ],
};
