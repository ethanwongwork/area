/**
 * The semantic layer: the only colour vocabulary a component is allowed to use.
 *
 * Every entry points at a role and a *pair* of levels -- one for light, one for dark -- and
 * never at a literal. `bg-component-hover` is "level 90 of whichever scale is currently the
 * neutral in light, level 31 in dark", so repointing the colour axis moves the entire
 * interface without touching one component rule, and switching theme reads the same single
 * ramp from the other end.
 *
 * That pairing is the whole inversion. There is one set of colours per scale; a theme is a
 * choice of which levels to read, written down in `curves.ts` as `INVERSION` and reused
 * here so the light and dark columns cannot drift apart.
 *
 * Two rules keep this layer honest:
 *
 *   Levels are never chosen freely. Every entry below resolves through an `INVERSION` slot
 *   or through the scale's own computed solid; nothing picks a number inline. Reaching for
 *   an arbitrary level is how a design system ends up with forty near-identical greys.
 *
 *   Nothing here is a raw colour. The one exception is `fg-on-*`, which resolves to the
 *   black or white each scale measured against its own solid fill.
 */
import { type Level, type Slot, INVERSION } from "../color/curves.ts";
import type { Theme } from "../color/scale.ts";

/** The roles the semantic layer addresses. The colour axis repoints `accent`. */
export const ROLES = [
  "neutral",
  "accent",
  "danger",
  "warning",
  "caution",
  "success",
  "info",
  "discovery",
] as const;
export type Role = (typeof ROLES)[number];

export type Alias =
  | { kind: "slot"; role: Role; slot: Slot }
  | { kind: "alphaSlot"; role: Role; slot: Slot }
  /** The scale's own solid fill -- the level is computed per hue, not chosen here. */
  | { kind: "solid"; role: Role }
  | { kind: "solidHover"; role: Role }
  | { kind: "contrast"; role: Role }
  | { kind: "literal"; value: string };

const at = (role: Role, slot: Slot): Alias => ({ kind: "slot", role, slot });
const alphaAt = (role: Role, slot: Slot): Alias => ({ kind: "alphaSlot", role, slot });
const solid = (role: Role): Alias => ({ kind: "solid", role });
const solidHover = (role: Role): Alias => ({ kind: "solidHover", role });
const contrast = (role: Role): Alias => ({ kind: "contrast", role });

/** The tonal block every role repeats, so `danger` and `accent` are structurally identical. */
function tonalBlock(role: Role, prefix: string): Record<string, Alias> {
  return {
    [`${prefix}-surface`]: at(role, "component"),
    [`${prefix}-surface-hover`]: at(role, "componentHover"),
    [`${prefix}-surface-active`]: at(role, "componentActive"),
    [`${prefix}-border-subtle`]: at(role, "componentActive"),
    [`${prefix}-border`]: at(role, "tonalBorder"),
    [`${prefix}-border-strong`]: at(role, "tonalBorderStrong"),
    [`${prefix}-solid`]: solid(role),
    [`${prefix}-solid-hover`]: solidHover(role),
    [`fg-${prefix}`]: at(role, "textTonal"),
    [`fg-${prefix}-strong`]: at(role, "textTonalStrong"),
    [`fg-on-${prefix}`]: contrast(role),
  };
}

export const SEMANTIC_ALIASES: Record<string, Alias> = {
  // --- Surfaces -----------------------------------------------------------------
  /** The page itself. Everything else sits on this. */
  "bg-page": at("neutral", "page"),
  /** A panel raised off the page: card, dialog, popover, menu. */
  "bg-surface": at("neutral", "surface"),
  /** A quieter region within a surface: table header, inset well, code block. */
  "bg-subtle": at("neutral", "subtle"),
  /** A control's own resting fill, and its hover and active states. */
  "bg-component": at("neutral", "component"),
  "bg-component-hover": at("neutral", "componentHover"),
  "bg-component-active": at("neutral", "componentActive"),
  /** A filled neutral surface that carries inverted text -- tooltips, toasts. */
  "bg-inverse": at("neutral", "inverseFill"),
  "fg-on-inverse": at("neutral", "inverseText"),
  /**
   * The two neutral button fills. Primary is the near-black call to action, secondary one
   * step of emphasis down. Both flip with the theme: a dark page turns the primary button
   * near-white, because "furthest from the page" is what makes it read as primary, not
   * "black". Named here so the contrast gate can assert on them -- they are not part of a
   * tonal block, so nothing else would have covered them.
   */
  "bg-primary-solid": at("neutral", "inverseFill"),
  "bg-primary-solid-hover": at("neutral", "inverseFillHover"),
  "bg-secondary-solid": at("neutral", "secondaryFill"),
  "bg-secondary-solid-hover": at("neutral", "secondaryFillHover"),
  "fg-on-neutral-solid": at("neutral", "inverseText"),
  /** Translucent tints, for hover on an unknown background. */
  "bg-hover": alphaAt("neutral", "componentHover"),
  "bg-active": alphaAt("neutral", "componentActive"),
  /** The scrim behind a modal. */
  "bg-overlay": alphaAt("neutral", "scrim"),

  // --- Foreground ---------------------------------------------------------------
  /** Body copy and anything that must be read comfortably. */
  "fg-default": at("neutral", "textDefault"),
  /** Supporting copy: captions, helper text, secondary labels. */
  "fg-muted": at("neutral", "textMuted"),
  /** Chrome that categorises rather than informs: field icons, affixes. */
  "fg-subtle": at("neutral", "textSubtle"),
  /**
   * Placeholder text.
   *
   * Held to 3:1 against every surface an input can sit on, which lands it at a level most
   * systems would call too dark for a placeholder. That instinct is the wrong one: a hint
   * nobody can read is not subtle, it is missing, and WCAG makes no exemption for
   * placeholders. Primer reaches the same conclusion and ships its placeholder at full AA.
   */
  "fg-placeholder": at("neutral", "textPlaceholder"),
  /** Disabled foreground. */
  "fg-disabled": at("neutral", "textDisabled"),

  // --- Borders ------------------------------------------------------------------
  /** Ambient definition: card edges, separators, table rules. Never escalates. */
  "border-subtle": at("neutral", "borderSubtle"),
  /** An interactive control at rest. */
  border: at("neutral", "border"),
  /** That control on hover. */
  "border-hover": at("neutral", "borderStrong"),
  /**
   * The focus ring -- the one stroke WCAG 1.4.11 unambiguously requires at 3:1, so it is
   * held to the full threshold (see `contrast/assertions.ts`).
   *
   * Drawn from the accent's text level, not its solid. The solid is tuned to contrast with
   * its own label, which says nothing about contrast with the page: a lime or amber solid
   * is very light, and a ring made from it measures 1.2:1 on white -- effectively invisible.
   * A text level is tuned against the page by definition and flips with the theme
   * automatically, so one rule stays conformant for every accent in both themes.
   */
  "border-focus": at("accent", "textTonal"),

  // --- Tonal blocks -------------------------------------------------------------
  ...tonalBlock("accent", "accent"),
  ...tonalBlock("danger", "danger"),
  ...tonalBlock("warning", "warning"),
  ...tonalBlock("caution", "caution"),
  ...tonalBlock("success", "success"),
  ...tonalBlock("info", "info"),
  ...tonalBlock("discovery", "discovery"),
};

export type SemanticTokenName = keyof typeof SEMANTIC_ALIASES;

/**
 * Which slots each kind of token may draw from. Enforced by `aliases.test.ts`.
 *
 * Under the ordinal scale this was a band of step numbers. It is now a set of named slots,
 * which is the same guard stated in terms of intent rather than arithmetic: a background
 * token may not quietly start reading a border level.
 */
export const SLOT_BANDS = {
  background: ["page", "surface", "subtle", "component", "componentHover", "componentActive"],
  border: ["borderSubtle", "border", "borderStrong", "tonalBorder", "tonalBorderStrong"],
  text: [
    "textDisabled",
    "textPlaceholder",
    "textSubtle",
    "textMuted",
    "textTonal",
    "textTonalStrong",
    "textDefault",
  ],
  inverse: [
    "inverseFill",
    "inverseFillHover",
    "inverseText",
    "secondaryFill",
    "secondaryFillHover",
    "scrim",
  ],
} as const;

export interface ScaleView {
  /** Level -> colour, for every level of the ramp. */
  byLevel: Record<number, string>;
  alphaByLevel: Record<number, string>;
  solid: { level: Level; hover: { light: Level; dark: Level } };
  contrast: { hex: string };
}

export type ScaleLookup = Record<Role, ScaleView>;

/** Resolve every alias against a set of scales for one theme, yielding token -> colour. */
export function resolveAliases(scales: ScaleLookup, theme: Theme): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, aliasValue] of Object.entries(SEMANTIC_ALIASES)) {
    out[name] = resolveAlias(aliasValue, scales, theme);
  }
  return out;
}

export function resolveAlias(aliasValue: Alias, scales: ScaleLookup, theme: Theme): string {
  switch (aliasValue.kind) {
    case "slot":
      return scales[aliasValue.role].byLevel[INVERSION[aliasValue.slot][theme]]!;
    case "alphaSlot":
      return scales[aliasValue.role].alphaByLevel[INVERSION[aliasValue.slot][theme]]!;
    case "solid":
      return scales[aliasValue.role].byLevel[scales[aliasValue.role].solid.level]!;
    case "solidHover":
      return scales[aliasValue.role].byLevel[scales[aliasValue.role].solid.hover[theme]]!;
    case "contrast":
      return scales[aliasValue.role].contrast.hex;
    case "literal":
      return aliasValue.value;
  }
}

/** The level an alias resolves to in a theme, for documentation and for the gate's messages. */
export function aliasLevel(aliasValue: Alias, scales: ScaleLookup, theme: Theme): Level | null {
  switch (aliasValue.kind) {
    case "slot":
    case "alphaSlot":
      return INVERSION[aliasValue.slot][theme];
    case "solid":
      return scales[aliasValue.role].solid.level;
    case "solidHover":
      return scales[aliasValue.role].solid.hover[theme];
    default:
      return null;
  }
}
