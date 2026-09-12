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

/** One tier of the control ladder. */
interface Tier {
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

function ladder(tiers: Record<"xs" | "sm" | "md" | "lg" | "xl", Tier>) {
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
 * The shipped ladder. Icon stays at 16 through the middle of the range because 16px is
 * the near-universal inline icon size -- Primer, shadcn, and Octicons' own guidelines all
 * specify it, and scaling it with the control makes small controls look cluttered.
 */
const DEFAULT_TIERS: Record<"xs" | "sm" | "md" | "lg" | "xl", Tier> = {
  xs: { height: 24, gutter: 8, icon: 14, gap: 4, text: "xs" },
  sm: { height: 28, gutter: 10, icon: 16, gap: 6, text: "sm" },
  md: { height: 32, gutter: 12, icon: 16, gap: 6, text: "md" },
  lg: { height: 40, gutter: 16, icon: 20, gap: 6, text: "md" },
  xl: { height: 48, gutter: 20, icon: 24, gap: 8, text: "lg" },
};

const COMPACT_TIERS: Record<"xs" | "sm" | "md" | "lg" | "xl", Tier> = {
  xs: { height: 20, gutter: 6, icon: 12, gap: 4, text: "2xs" },
  sm: { height: 24, gutter: 8, icon: 14, gap: 4, text: "xs" },
  md: { height: 28, gutter: 10, icon: 16, gap: 6, text: "sm" },
  lg: { height: 32, gutter: 12, icon: 16, gap: 6, text: "md" },
  xl: { height: 40, gutter: 16, icon: 20, gap: 6, text: "md" },
};

const COMFORTABLE_TIERS: Record<"xs" | "sm" | "md" | "lg" | "xl", Tier> = {
  xs: { height: 28, gutter: 10, icon: 16, gap: 6, text: "sm" },
  sm: { height: 32, gutter: 12, icon: 16, gap: 6, text: "md" },
  md: { height: 36, gutter: 14, icon: 16, gap: 8, text: "md" },
  lg: { height: 44, gutter: 18, icon: 20, gap: 8, text: "lg" },
  xl: { height: 52, gutter: 22, icon: 24, gap: 8, text: "lg" },
};

const SPACIOUS_TIERS: Record<"xs" | "sm" | "md" | "lg" | "xl", Tier> = {
  xs: { height: 32, gutter: 12, icon: 16, gap: 6, text: "md" },
  sm: { height: 36, gutter: 14, icon: 16, gap: 8, text: "md" },
  md: { height: 40, gutter: 16, icon: 20, gap: 8, text: "md" },
  lg: { height: 48, gutter: 20, icon: 24, gap: 8, text: "lg" },
  xl: { height: 56, gutter: 24, icon: 24, gap: 10, text: "xl" },
};

export const DENSITY_AXIS: AxisDefinition = {
  id: "density",
  label: "Density",
  description: "How tall controls are, and how much room they leave inside themselves.",
  defaultPreset: "default",
  namespaces: ["--area-control-", "--area-gutter-", "--area-icon-", "--area-gap-"],
  presets: [
    {
      id: "compact",
      label: "Compact",
      description: "28px controls. For dense tools and data-heavy surfaces.",
      tokens: tokens(ladder(COMPACT_TIERS)),
    },
    {
      id: "default",
      label: "Default",
      description: "32px controls. Matches Primer, OpenAI, and Notion.",
      tokens: tokens(ladder(DEFAULT_TIERS)),
    },
    {
      id: "comfortable",
      label: "Comfortable",
      description: "36px controls. Matches shadcn/ui.",
      tokens: tokens(ladder(COMFORTABLE_TIERS)),
    },
    {
      id: "spacious",
      label: "Spacious",
      description: "40px controls. Matches Vercel's dashboard.",
      tokens: tokens(ladder(SPACIOUS_TIERS)),
    },
  ],
};
