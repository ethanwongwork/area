/**
 * UI scale, kept as a shorthand. It was Area's one geometry choice (Compact, Default) until the
 * owner split it into type size and density (2026-10-12, axes/type-size.ts, axes/density.ts).
 * `data-area-ui` and `ui` in a theme selection still work and mean the pair below; an explicit
 * `data-area-type` or `data-area-density` on the same element wins (emit/css.ts emits the
 * shorthand first).
 */
export const UI_SHORTHAND = {
  compact: { type: "12", density: "compact" },
  default: { type: "14", density: "default" },
} as const;
export type UiShorthand = keyof typeof UI_SHORTHAND;
