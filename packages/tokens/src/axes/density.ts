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
  /** Label size, as a stop on the primitive size ramp. */
  size: number;
  /** Label leading, as a stop on the primitive leading ramp. */
  leading: number;
}

function ladder(tiers: Record<Tier, TierSpec>) {
  const out: Record<string, string | number> = {};
  for (const [name, tier] of Object.entries(tiers)) {
    out[`control-${name}`] = `${tier.height}px`;
    out[`gutter-${name}`] = `${tier.gutter}px`;
    out[`icon-${name}`] = `${tier.icon}px`;
    out[`gap-${name}`] = `${tier.gap}px`;
    // Straight to the primitive ramp, not through a composite. The chrome scale needs a
    // 13px step that the content ramp deliberately does not carry, and the primitives are
    // exactly what a case like this is for.
    out[`control-${name}-text`] = `var(--area-size-${tier.size})`;
    out[`control-${name}-leading`] = `var(--area-leading-${tier.leading})`;
  }

  // The chrome type size for this density: the medium tier's, exposed once so anything
  // that is UI rather than prose -- a table, a menu, a caption in a toolbar -- can follow
  // the density without reaching into a specific control tier.
  const medium = tiers.md;
  out["ui-size"] = `var(--area-size-${medium.size})`;
  out["ui-leading"] = `var(--area-leading-${medium.leading})`;

  return out;
}

/**
 * Default: the comfortable ladder, calibrated to Primer, OpenAI and Vercel.
 *
 * 32px at medium is unanimous across all three -- Primer's `--control-medium-size`,
 * OpenAI's `--control-size-md`, and Vercel's small button all land there. The 24/28/32/40/48
 * ladder is Primer's exact scale.
 *
 * Icon sizes are 12, 16 or 24 and nothing else. VS Code's own design-token linter is
 * blunt about this -- it permits exactly {16, 12} for its icons and comments that "a
 * codicon at 13/14/15px is always a mistake for 12 or 16" -- and Octicons' guidelines say
 * the same with 24 added for the large tier. An earlier version of this ladder used 14
 * and 20; both are off every published ramp.
 *
 * Gap follows the tier rather than holding constant: Primer ties 4px to its xsmall and
 * small controls and 8px to medium and large, and 6px sits on VS Code's spacing ramp as
 * the step between.
 */
const DEFAULT_TIERS: Record<Tier, TierSpec> = {
  xs: { height: 24, gutter: 8, icon: 12, gap: 4, size: 12, leading: 16 },
  sm: { height: 28, gutter: 10, icon: 16, gap: 4, size: 13, leading: 18 },
  md: { height: 32, gutter: 12, icon: 16, gap: 6, size: 14, leading: 20 },
  lg: { height: 40, gutter: 16, icon: 16, gap: 8, size: 14, leading: 20 },
  xl: { height: 48, gutter: 20, icon: 24, gap: 8, size: 16, leading: 24 },
};

/**
 * Compact: the dense ladder, calibrated to Notion.
 *
 * Notion's measured in-app ladder is 24 for an icon-only button, 28 for a menu row or a
 * standard button, and 32 for a filled call to action -- so 28 is the medium here.
 *
 * Chrome steps down with the box: medium is 13/18 rather than 14/20. Content type
 * remains on the independent typography axis, so a compact interface keeps readable prose.
 */
const COMPACT_TIERS: Record<Tier, TierSpec> = {
  xs: { height: 20, gutter: 6, icon: 12, gap: 4, size: 11, leading: 14 },
  sm: { height: 24, gutter: 8, icon: 12, gap: 4, size: 12, leading: 16 },
  md: { height: 28, gutter: 10, icon: 16, gap: 6, size: 13, leading: 18 },
  lg: { height: 32, gutter: 12, icon: 16, gap: 6, size: 14, leading: 20 },
  xl: { height: 36, gutter: 14, icon: 16, gap: 8, size: 14, leading: 20 },
};

export const DENSITY_AXIS: AxisDefinition = {
  id: "density",
  label: "Density",
  description: "How tall controls are, and how much room they leave inside themselves. Interface type steps down with the box; content type stays independent.",
  defaultPreset: "default",
  namespaces: ["--area-control-", "--area-gutter-", "--area-icon-", "--area-gap-", "--area-ui-"],
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
