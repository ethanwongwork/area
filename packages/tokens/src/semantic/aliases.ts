/**
 * The semantic layer: the only colour vocabulary a component is allowed to use.
 *
 * Every entry points at a role and a step, never at a literal. `bg-component-hover` is
 * "step 4 of whichever scale is currently the neutral" -- so repointing the colour axis
 * at a different hue moves the entire interface without touching one component rule.
 *
 * Two rules keep this layer honest:
 *
 *   Steps are never chosen freely. A background comes from the 3-5 band, a border from
 *   6-8, a fill from 9-10, text from 11-12. Reaching outside a step's band is how a
 *   design system ends up with forty near-identical greys.
 *
 *   Nothing here is a raw colour. The one exception is `fg-on-*`, which resolves to the
 *   black or white each scale declared and measured for its own solid fill.
 */
import type { Twelve } from "../color/curves.ts";

/** The roles the semantic layer addresses. The colour axis repoints `accent`. */
export const ROLES = ["neutral", "accent", "danger", "warning", "success", "info"] as const;
export type Role = (typeof ROLES)[number];

export type Alias =
  | { kind: "step"; role: Role; step: number }
  | { kind: "alpha"; role: Role; step: number }
  | { kind: "contrast"; role: Role }
  | { kind: "literal"; value: string };

const step = (role: Role, n: number): Alias => ({ kind: "step", role, step: n });
const alpha = (role: Role, n: number): Alias => ({ kind: "alpha", role, step: n });
const contrast = (role: Role): Alias => ({ kind: "contrast", role });

/** The tonal block every role repeats, so `danger` and `accent` are structurally identical. */
function tonalBlock(role: Role, prefix: string): Record<string, Alias> {
  return {
    [`${prefix}-surface`]: step(role, 3),
    [`${prefix}-surface-hover`]: step(role, 4),
    [`${prefix}-surface-active`]: step(role, 5),
    [`${prefix}-border-subtle`]: step(role, 6),
    [`${prefix}-border`]: step(role, 7),
    [`${prefix}-border-strong`]: step(role, 8),
    [`${prefix}-solid`]: step(role, 9),
    [`${prefix}-solid-hover`]: step(role, 10),
    [`fg-${prefix}`]: step(role, 11),
    [`fg-${prefix}-strong`]: step(role, 12),
    [`fg-on-${prefix}`]: contrast(role),
  };
}

export const SEMANTIC_ALIASES: Record<string, Alias> = {
  // --- Surfaces -----------------------------------------------------------------
  /** The page itself. Everything else sits on this. */
  "bg-page": step("neutral", 1),
  /** A panel raised off the page: card, dialog, popover, menu. */
  "bg-surface": step("neutral", 1),
  /** A quieter region within a surface: table header, inset well, code block. */
  "bg-subtle": step("neutral", 2),
  /** A control's own resting fill, and its hover and active states. */
  "bg-component": step("neutral", 3),
  "bg-component-hover": step("neutral", 4),
  "bg-component-active": step("neutral", 5),
  /** A filled neutral surface that carries inverted text -- tooltips, toasts. */
  "bg-inverse": step("neutral", 12),
  "fg-on-inverse": step("neutral", 1),
  /** Translucent tints, for hover on an unknown background. */
  "bg-hover": alpha("neutral", 4),
  "bg-active": alpha("neutral", 5),
  /** The scrim behind a modal. */
  "bg-overlay": alpha("neutral", 11),

  // --- Foreground ---------------------------------------------------------------
  /** Body copy and anything that must be read comfortably. */
  "fg-default": step("neutral", 12),
  /** Supporting copy: captions, helper text, secondary labels. */
  "fg-muted": step("neutral", 11),
  /** Chrome that categorises rather than informs: field icons, affixes. */
  "fg-subtle": step("neutral", 10),
  /** Placeholder text. Deliberately below body contrast; it is not content. */
  "fg-placeholder": step("neutral", 9),
  /** Disabled foreground. */
  "fg-disabled": step("neutral", 8),

  // --- Borders ------------------------------------------------------------------
  /** Ambient definition: card edges, separators, table rules. Never escalates. */
  "border-subtle": step("neutral", 6),
  /** An interactive control at rest. */
  border: step("neutral", 7),
  /** That control on hover. */
  "border-hover": step("neutral", 8),
  /**
   * The focus ring -- the one stroke WCAG 1.4.11 unambiguously requires at 3:1, so it is
   * held to the full threshold (see `contrast/assertions.ts`).
   *
   * Drawn from the text step, not the solid step. The solid step is tuned to contrast with
   * its own label, which says nothing about contrast with the page: a lime or amber solid
   * is very light, and a ring made from it measures 1.2:1 on white -- effectively invisible.
   * The text step is tuned against the page by definition and flips polarity with the theme
   * automatically, so one rule stays conformant for every accent in both themes.
   */
  "border-focus": step("accent", 11),

  // --- Tonal blocks -------------------------------------------------------------
  ...tonalBlock("accent", "accent"),
  ...tonalBlock("danger", "danger"),
  ...tonalBlock("warning", "warning"),
  ...tonalBlock("success", "success"),
  ...tonalBlock("info", "info"),
};

export type SemanticTokenName = keyof typeof SEMANTIC_ALIASES;

/** Which step bands each kind of role may draw from. Enforced by `aliases.test.ts`. */
export const STEP_BANDS = {
  background: [1, 2, 3, 4, 5],
  border: [6, 7, 8],
  solid: [9, 10],
  text: [11, 12],
} as const;

export type ScaleLookup = Record<Role, { steps: Twelve<{ hex: string }>; alphas: Twelve<{ hex8: string }>; contrast: { hex: string } }>;

/** Resolve every alias against a set of scales, yielding a flat token -> colour map. */
export function resolveAliases(scales: ScaleLookup): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, aliasValue] of Object.entries(SEMANTIC_ALIASES)) {
    out[name] = resolveAlias(aliasValue, scales);
  }
  return out;
}

export function resolveAlias(aliasValue: Alias, scales: ScaleLookup): string {
  switch (aliasValue.kind) {
    case "step":
      return scales[aliasValue.role].steps[aliasValue.step - 1]!.hex;
    case "alpha":
      return scales[aliasValue.role].alphas[aliasValue.step - 1]!.hex8;
    case "contrast":
      return scales[aliasValue.role].contrast.hex;
    case "literal":
      return aliasValue.value;
  }
}
