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

/**
 * Roles a density sets outside the control ladder: list rows, floating-surface insets, and
 * the flag the radius derivation reads (emit/base.ts). Compact pass (owner, 2026-10-01): compact
 * is a proportional step-down, checked against VS Code's workbench (vscode.dev captures in
 * docs/research/captures/compact/): rows 22-24, hover inset 8-9, corners one step smaller.
 */
interface DensityRoles {
  /** A list row's height (Menu, Nav, Tree view, Command palette, pickers). */
  row: number;
  /** A row's glyph edge: the leading icon's distance from the row's start. */
  rowInset: number;
  /** A row's icon-to-label gap. */
  gapRow: number;
  /** Floating-surface insets: Popover (sm), Dialog (md). */
  insetSurfaceSm: number;
  insetSurfaceMd: number;
  /** Layout steps around controls (compact pass, round 5): a stacked label-to-control gap
   *  (Field), and the gap between clustered items and the inset of a bar (Toolbar, horizontal
   *  Field). Layout spacing never reads the icon gaps (audit S14), so these are their own roles. */
  stack: number;
  cluster: number;
  /** Pill marks: Badge, Count, Kbd and the Indicator count. */
  mark: { sm: number; md: number; lg: number };
  /** 1 when corners take the dense radius ladder (emit/base.ts). */
  dense: 0 | 1;
}

export const DEFAULT_ROLES: DensityRoles = { row: 32, rowInset: 8, gapRow: 12, insetSurfaceSm: 12, insetSurfaceMd: 16, stack: 6, cluster: 8, mark: { sm: 16, md: 20, lg: 24 }, dense: 0 };
/*
 * Compact rows are 24 (owner 2026-10-01; VS Code menus 24, Figma 24): 16/24 type leading plus
 * 4 above and below, as a default row is 20 plus 6. The glyph edge (8 -> 6) and the icon gap
 * (12 -> 8) step down with it, so labels sit on a 30 column. Surface insets step down one rung
 * each (VS Code's hover insets its text 9, its quick pick 7). Marks step down one rung, md 20 -> 16
 * and lg 24 -> 20; sm stays 16, the floor of a 12/16 label (VS Code's key labels 18 at 11px and
 * count badges 19 at 10px are smaller type than the ramp allows).
 */
export const COMPACT_ROLES: DensityRoles = { row: 24, rowInset: 6, gapRow: 8, insetSurfaceSm: 8, insetSurfaceMd: 12, stack: 4, cluster: 6, mark: { sm: 16, md: 16, lg: 20 }, dense: 1 };

export function densityTokens(tiers: Record<Tier, TierSpec>, roles: DensityRoles) {
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
  // The icon-to-label gap of a list row (audit S11a, owner 2026-09-30): with an 8 row inset and
  // a 16 icon it puts every icon row's label on one 36 column, where ChatGPT's and Notion's
  // menus and sidebars start theirs. Compact steps it down with the row (30 column).
  out["gap-row"] = `${roles.gapRow}px`;
  out["ui-row"] = `${roles.row}px`;
  out["ui-row-inset"] = `${roles.rowInset}px`;
  out["ui-dense"] = String(roles.dense);
  out["ui-stack"] = `${roles.stack}px`;
  out["ui-cluster"] = `${roles.cluster}px`;
  // Marks and surface insets (audit S21a, owner 2026-09-30: option C). The 16 / 20 / 24 ladder
  // of pill marks (Badge, Count, Kbd, the Indicator count) and the insets of floating surfaces
  // (Popover, Dialog) are roles so compact density can reach them.
  out["mark-sm"] = `${roles.mark.sm}px`;
  out["mark-md"] = `${roles.mark.md}px`;
  out["mark-lg"] = `${roles.mark.lg}px`;
  out["inset-surface-sm"] = `${roles.insetSurfaceSm}px`;
  out["inset-surface-md"] = `${roles.insetSurfaceMd}px`;
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
 * The icon-to-label gap is 6 at sm, md and lg (audit S14, owner 2026-09-30: Notion 6 at 28
 * and 32, Untitled lg 6, Tree view 6; was 4 / 8 / 8, while Button wrote a literal 6). xs and
 * compact sm keep 4. Layout spacing never reads these tokens.
 */
export const DEFAULT_TIERS: Record<Tier, TierSpec> = {
  xs: { height: 24, gutter: 8, icon: 12, gap: 4, size: 12, leading: 16 },
  // Small controls keep the UI size, 14/20: Notion's 28px buttons set 14px, and the tiers
  // differ by height, not by shrinking the label. 12px belongs to xs and to compact density
  // (docs/specs/button.md, owner 2026-09-26; supersedes the 2026-09-25 caption pairing).
  sm: { height: 28, gutter: 8, icon: 16, gap: 6, size: 14, leading: 20 },
  md: { height: 32, gutter: 12, icon: 16, gap: 6, size: 14, leading: 20 },
  lg: { height: 40, gutter: 12, icon: 16, gap: 6, size: 14, leading: 20 },
  xl: { height: 48, gutter: 16, icon: 24, gap: 8, size: 16, leading: 24 },
};

/**
 * Compact: the dense ladder, a proportional step-down (owner, 2026-10-01).
 *
 * Every tier is one rung shorter, and chrome type steps down to the ramp's 12/16 at xs, sm and
 * md (owner: 12/16, on the 4px ramp; replaces 13/18 and 11/14, which were off it). Checked
 * against VS Code's workbench: 26px buttons and inputs with 8px sides and 12/16 labels, 22px
 * icon buttons around a 16px icon, 13px list text (docs/research/compact-pass-2026-10-01.md).
 * Icons keep their native 16 from sm up, as VS Code's 22px buttons do; the icon gap is 4.
 * Content type remains on the independent typography axis.
 */
export const COMPACT_TIERS: Record<Tier, TierSpec> = {
  xs: { height: 20, gutter: 6, icon: 12, gap: 4, size: 12, leading: 16 },
  sm: { height: 24, gutter: 8, icon: 16, gap: 4, size: 12, leading: 16 },
  md: { height: 28, gutter: 8, icon: 16, gap: 4, size: 12, leading: 16 },
  lg: { height: 32, gutter: 12, icon: 16, gap: 6, size: 14, leading: 20 },
  xl: { height: 36, gutter: 14, icon: 16, gap: 8, size: 14, leading: 20 },
};

export const DENSITY_AXIS: AxisDefinition = {
  id: "density",
  label: "Density",
  description: "How tall controls are, and how much room they leave inside themselves. Interface type steps down with the box; content type stays independent.",
  defaultPreset: "default",
  namespaces: ["--area-control-", "--area-gutter-", "--area-icon-", "--area-gap-", "--area-ui-", "--area-mark-", "--area-inset-surface-"],
  presets: [
    {
      id: "compact",
      label: "Compact",
      description: "28px controls, 24px rows and 12/16 UI type. A proportional step-down for dense tools.",
      tokens: tokens(densityTokens(COMPACT_TIERS, COMPACT_ROLES)),
    },
    {
      id: "default",
      label: "Default",
      description: "32px controls. Calibrated to Primer, OpenAI and Vercel.",
      tokens: tokens(densityTokens(DEFAULT_TIERS, DEFAULT_ROLES)),
    },
  ],
};
