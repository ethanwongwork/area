/**
 * UI scale is Area's one curated geometry choice. It keeps the type ramp, controls, icons,
 * padding and gaps in one package so a product cannot accidentally combine large copy with
 * compact targets, or the reverse.
 */
import { type AxisDefinition, tokens } from "./schema.ts";
import { COMPACT_ROLES, COMPACT_TIERS, DEFAULT_ROLES, DEFAULT_TIERS, densityTokens } from "./density.ts";
import { GEIST_TOKENS, typographyRamps } from "./typography.ts";

export const UI_SCALE_AXIS: AxisDefinition = {
  id: "ui",
  label: "UI scale",
  description: "A curated package of interface type, controls, icons, padding, and gaps.",
  defaultPreset: "default",
  namespaces: [
    "--area-font-",
    "--area-text-",
    "--area-title-",
    "--area-display-",
    "--area-weight-",
    "--area-control-",
    "--area-gutter-",
    "--area-icon-",
    "--area-gap-",
    "--area-ui-",
    "--area-mark-",
    "--area-inset-surface-",
  ],
  presets: [
    {
      id: "compact",
      label: "Compact",
      description: "14px reading text, 12px UI text, 28px medium controls and 24px rows for dense tools.",
      tokens: tokens({ ...GEIST_TOKENS, ...typographyRamps(-1), ...densityTokens(COMPACT_TIERS, COMPACT_ROLES) }),
    },
    {
      id: "default",
      label: "Default",
      description: "16px reading text, 14px UI text, and 32px medium controls for everyday products.",
      tokens: tokens({ ...GEIST_TOKENS, ...typographyRamps(0), ...densityTokens(DEFAULT_TIERS, DEFAULT_ROLES) }),
    },
  ],
};
