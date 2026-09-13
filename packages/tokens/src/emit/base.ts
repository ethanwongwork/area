/**
 * Tokens that belong to no axis: the spacing ramp, z-layers, and the cross-axis
 * derivations.
 *
 * Spacing primitives are deliberately fixed. Compact density means components reach for
 * smaller steps, not that 12px quietly becomes 10px -- a scale that moves under you is a
 * scale you cannot reason about.
 *
 * They are also named by their pixel value. `--area-space-12` needs no lookup table; a
 * t-shirt ladder of 3xs/2xs/xs/2s/s/2m/m does, and invites exactly the kind of renumbering
 * that silently shifts every consumer.
 */
import { PREFIX } from "../axes/schema.ts";

/** 4px base with 2px, 6px and 10px half-steps for tight control interiors. */
export const SPACE_RAMP = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96] as const;

/**
 * Type primitives.
 *
 * The same two-tier shape colour uses: a fixed ramp of raw stops, and a semantic layer
 * that points at them. A composite such as `--area-text-md-size` resolves to
 * `var(--area-size-16)` rather than to a literal, so the typography axis picks different
 * stops rather than multiplying arbitrary numbers -- which is what keeps every derived
 * size on the ramp instead of landing on 12.25px.
 */
export const SIZE_RAMP = [
  10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64, 72, 96, 128,
] as const;

export const LEADING_RAMP = [
  12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96, 112, 136,
] as const;

/**
 * Weight stops, named by their OpenType `wght` value. The half-steps exist because Geist
 * is variable: 450 and 550 are reachable in it and not in a platform font.
 */
export const WGHT_RAMP = [100, 200, 300, 400, 450, 500, 550, 600, 700, 800, 900] as const;

/** Every radius the system can express. Components use the semantic radius tokens instead. */
export const RADIUS_RAMP = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 32] as const;

export const Z_LAYERS = {
  base: 0,
  raised: 10,
  sticky: 20,
  overlay: 30,
  dropdown: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const;

export function baseTokens(): Record<string, string> {
  const out: Record<string, string> = {};

  // Pure black and white. Named because they are real answers, not placeholders: every
  // `fg-on-*` token resolves to one of these two after the scale measures which is
  // readable on its own solid fill.
  out[`${PREFIX}white`] = "#ffffff";
  out[`${PREFIX}black`] = "#000000";

  for (const step of SPACE_RAMP) out[`${PREFIX}space-${step}`] = `${step}px`;
  for (const step of SIZE_RAMP) out[`${PREFIX}size-${step}`] = `${step}px`;
  for (const step of LEADING_RAMP) out[`${PREFIX}leading-${step}`] = `${step}px`;
  for (const step of WGHT_RAMP) out[`${PREFIX}wght-${step}`] = String(step);
  for (const step of RADIUS_RAMP) out[`${PREFIX}radius-${step}`] = `${step}px`;
  out[`${PREFIX}radius-full`] = "9999px";

  for (const [name, value] of Object.entries(Z_LAYERS)) out[`${PREFIX}z-${name}`] = String(value);

  // Read by AreaProvider in development to detect a missing stylesheet, which otherwise
  // presents as "the components render but look unstyled" with no error anywhere.
  out[`${PREFIX}loaded`] = "1";

  return out;
}

/**
 * Cross-axis derivations.
 *
 * These are the only places two axes meet, and they are expressed as live calc() rather
 * than baked pixels for two reasons: baking would require a block per density-times-radius
 * combination, and custom properties inherit -- so a live calc() is what lets
 * `<aside data-area-density="compact">` correctly re-derive its own corner radius.
 */
export function derivedTokens(): Record<string, string> {
  return {
    // A control nested inside a container keeps concentric corners: the inner radius is the
    // outer radius less the inset. This is the forward form of the concentric rule; the
    // inset varies per component, so components apply it themselves against this token.
    [`${PREFIX}radius-nested`]:
      `round(nearest, max(0px, calc(var(${PREFIX}radius-container) - var(${PREFIX}space-6))), 1px)`,

    // The focus ring, assembled once so every component's focus looks identical.
    [`${PREFIX}ring`]:
      `0 0 0 var(${PREFIX}ring-width) color-mix(in oklab, var(${PREFIX}border-focus) 45%, transparent)`,

    // Standard transition for interactive chrome. Only properties that actually change.
    [`${PREFIX}transition`]:
      `background-color var(${PREFIX}duration-fast) var(${PREFIX}ease-out), border-color var(${PREFIX}duration-fast) var(${PREFIX}ease-out), color var(${PREFIX}duration-fast) var(${PREFIX}ease-out), box-shadow var(${PREFIX}duration-fast) var(${PREFIX}ease-out)`,
  };
}

/**
 * The handful of properties worth registering with `@property`: the ones that are
 * interpolated, plus those where a missing unit should be a parse error rather than a
 * silently broken calc().
 *
 * Deliberately a short list, and it contains only *leaf* tokens. Derived tokens must never
 * be registered: a registered `<length>` computes at its declaration site, so
 * `--area-radius-control` would freeze at the value it had on `:root` and stop responding
 * to a nested `data-area-density`. That silently breaks subtree scoping -- the height
 * changes, the corner radius does not -- and it is invisible in source. Verified in a real
 * browser by the axis fixture check.
 *
 * Registration is also document-global and unconditional, so a consumer registering the
 * same name with a different syntax silently wins; and a registered property falls back to
 * its initial value rather than to `unset`, turning an obviously-broken chain into a
 * plausible-looking wrong number. Both are reasons to register sparingly.
 */
export const REGISTERED_PROPERTIES = [
  { name: `${PREFIX}radius-container`, syntax: "<length>", initial: "12px" },
  { name: `${PREFIX}radius-small`, syntax: "<length>", initial: "4px" },
  { name: `${PREFIX}ring-width`, syntax: "<length>", initial: "2px" },
  { name: `${PREFIX}ring-offset`, syntax: "<length>", initial: "2px" },
  { name: `${PREFIX}border-width`, syntax: "<length>", initial: "1px" },
  { name: `${PREFIX}control-md`, syntax: "<length>", initial: "32px" },
  { name: `${PREFIX}duration-fast`, syntax: "<time>", initial: "100ms" },
  { name: `${PREFIX}duration-base`, syntax: "<time>", initial: "150ms" },
] as const;
