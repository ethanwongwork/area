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
import { type Level, type Position, type Slot, INVERSION, LEVELS } from "../color/curves.ts";
import { apcaMagnitude, wcagContrastHex } from "../color/contrast.ts";
import { type Theme, luminousDarkVivid } from "../color/scale.ts";
import { tonalStroke } from "./stroke.ts";
import { ACCENT_STRENGTHS, withStrength } from "../color/generate.ts";
import { DEFAULT_TONE_FLOOR, toneFloorId } from "../color/layers.ts";

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
  /* Tag tones (owner 2026-10-06): Notion's pink and gray, from existing palette families. */
  "pink",
  "gray",
  "brown",
] as const;
export type Role = (typeof ROLES)[number];

export type Alias =
  | { kind: "slot"; role: Role; slot: Slot }
  | { kind: "alphaSlot"; role: Role; slot: Slot }
  /** The scale's own solid fill -- the level is computed per hue, not chosen here. */
  | { kind: "solid"; role: Role }
  | { kind: "solidHover"; role: Role }
  | { kind: "tonalSurface"; role: Role; state: "rest" | "hover" | "active" }
  | { kind: "tonalForeground"; role: Role }
  /** A measured tint of the family's readable ink, without changing its palette. */
  | { kind: "stroke"; role: Role }
  | { kind: "strokeHover"; role: Role }
  /** The family's most saturated readable rung -- computed per scale, not chosen here. */
  | { kind: "vivid"; role: Role }
  /** The family's most vivid rung that still marks a state at 3:1 (focus, selected). */
  | { kind: "indicator"; role: Role }
  | { kind: "contrast"; role: Role }
  /** A fixed value, or one per theme where the two were measured apart (the scrim). */
  | { kind: "literal"; value: string | Record<Theme, string>; role?: Role };

const at = (role: Role, slot: Slot): Alias => ({ kind: "slot", role, slot });
const alphaAt = (role: Role, slot: Slot): Alias => ({ kind: "alphaSlot", role, slot });
const solid = (role: Role): Alias => ({ kind: "solid", role });
const solidHover = (role: Role): Alias => ({ kind: "solidHover", role });
const tonalSurface = (role: Role, state: "rest" | "hover" | "active"): Alias => ({ kind: "tonalSurface", role, state });
const TONAL_STATES = ["rest", "hover", "active"] as const;
const tonalForeground = (role: Role): Alias => ({ kind: "tonalForeground", role });
const stroke = (role: Role): Alias => ({ kind: "stroke", role });
const strokeHover = (role: Role): Alias => ({ kind: "strokeHover", role });
const vivid = (role: Role): Alias => ({ kind: "vivid", role });
const indicator = (role: Role): Alias => ({ kind: "indicator", role });
const contrast = (role: Role): Alias => ({ kind: "contrast", role });
const literal = (value: string | Record<Theme, string>, role?: Role): Alias => ({ kind: "literal", value, role });

/** The tonal block every role repeats, so `danger` and `accent` are structurally identical. */
function tonalBlock(role: Role, prefix: string): Record<string, Alias> {
  return {
    [`${prefix}-surface`]: tonalSurface(role, "rest"),
    [`${prefix}-surface-hover`]: tonalSurface(role, "hover"),
    [`${prefix}-surface-active`]: tonalSurface(role, "active"),
    [`${prefix}-border-subtle`]: tonalSurface(role, "active"),
    /*
     * Measured tints of existing readable ink. Choosing raw rungs by luminance alone
     * left green and teal neon beside equally visible but much quieter blue outlines.
     */
    [`${prefix}-border`]: stroke(role),
    [`${prefix}-border-strong`]: strokeHover(role),
    [`${prefix}-solid`]: solid(role),
    [`${prefix}-solid-hover`]: solidHover(role),
    [`fg-${prefix}`]: tonalForeground(role),
    /**
     * The loudest this tone gets as text. Syntax highlighting and inline emphasis use it;
     * body copy does not, because a paragraph set in it reads as a link.
     */
    [`fg-${prefix}-vivid`]: vivid(role),
    [`fg-${prefix}-strong`]: at(role, "textTonalStrong"),
    [`fg-on-${prefix}`]: contrast(role),
  };
}

/**
 * A tint and its inks, without the outline, solid fill or vivid rung: a tag tone on a neutral
 * cast (gray is `warm`). A near-neutral scale has no tinted stroke that clears the outline floor,
 * and a tag needs none.
 */
function tagToneBlock(role: Role, prefix: string): Record<string, Alias> {
  return {
    [`${prefix}-surface`]: tonalSurface(role, "rest"),
    [`${prefix}-surface-hover`]: tonalSurface(role, "hover"),
    [`${prefix}-surface-active`]: tonalSurface(role, "active"),
    [`fg-${prefix}`]: tonalForeground(role),
    [`fg-${prefix}-strong`]: at(role, "textTonalStrong"),
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
  /** Alternate table rows, quieter than headers and control fills. */
  "bg-stripe": at("neutral", "stripe"),
  /** A code block. Vivid text is measured against its own ground. */
  "bg-code": at("neutral", "code"),
  /** A control's own resting fill, and its hover and active states. */
  "bg-component": at("neutral", "component"),
  "bg-component-hover": at("neutral", "componentHover"),
  "bg-component-active": at("neutral", "componentActive"),
  /** A filled neutral surface that carries inverted text -- tooltips, toasts. */
  "bg-inverse": at("neutral", "inverseFill"),
  "fg-on-inverse": at("neutral", "inverseText"),
  /**
   * The neutral button fill. It flips with the theme: a dark page turns it near-white,
   * because "furthest from the page" is what reads as the strongest call to action, not
   * "black". Named here so the contrast gate can assert on it -- it is not part of a tonal
   * block, so nothing else would have covered it.
   */
  "neutral-solid": at("neutral", "inverseFill"),
  "neutral-solid-hover": at("neutral", "inverseFillHover"),
  "fg-on-neutral": at("neutral", "inverseText"),
  /** Translucent tints, for hover on an unknown background. */
  /**
   * The scrim behind a modal: black at 65% in both themes. A scrim darkens whatever is behind
   * it; solved as a tint of the page rung it came out nearly transparent in dark mode.
   */
  "bg-overlay": literal("#000000a6", "neutral"),
  /**
   * The modal backdrop (Dialog, Command palette; audit S21b): black at 13.3% in light, the
   * measured scrim (dialog.md), and 50% in dark, ChatGPT's dark `simple-scrim` (#00000080,
   * read from its tokens 2026-10-01, audit S21c); was 65%.
   */
  "scrim": literal({ light: "#00000022", dark: "#00000080" }, "neutral"),

  // --- Foreground ---------------------------------------------------------------
  /** Body copy and anything that must be read comfortably. */
  "fg-default": at("neutral", "textDefault"),
  /** Supporting copy: captions, helper text, secondary labels. */
  "fg-muted": at("neutral", "textMuted"),
  /**
   * Placeholder text.
   *
   * Held to 4.5:1 against every surface an input can sit on, which lands it at a level most
   * systems would call too dark for a placeholder. That instinct is the wrong one: a hint
   * nobody can read is not subtle, it is missing, and WCAG makes no exemption for
   * placeholders. Primer reaches the same conclusion and ships its placeholder at full AA.
   */
  "fg-placeholder": at("neutral", "textPlaceholder"),
  /** Disabled foreground. */
  "fg-disabled": at("neutral", "textDisabled"),

  // --- Borders ------------------------------------------------------------------
  /** Quiet control definition and swatch edges. Never escalates. */
  "border-subtle": at("neutral", "borderSubtle"),
  /** Decorative dividers and container edges; never an interactive affordance. */
  "border-decorative": at("neutral", "borderDecorative"),
  /** For a container whose fill already separates it from its ground. See `borderFaint`. */
  "border-faint": at("neutral", "borderFaint"),
  "border-float": at("neutral", "borderFloat"),
  /**
   * A rule between pieces of content: separators, menu and table dividers, panel sections.
   * Darker than the decorative container seam, because a divider has no fill or shadow to help
   * it: ChatGPT (10% black, #e6), Figma (#e6) and Untitled (#e5) draw theirs near #e5; Notion's
   * menu rules are lighter (7%, #f0). The 150 rung (#e2) is the nearest to #e5; 100 (#ee) is
   * twice as far. The container seam stays decorative; its surface and lift carry the edge.
   * A Card's edge is the exception: it stands alone on the page, so it takes this role too.
   */
  "border-divider": at("neutral", "borderFaint"),
  /** An interactive control at rest. */
  border: at("neutral", "border"),
  /** That control on hover. */
  "border-hover": at("neutral", "borderStrong"),
  /**
   * The focus ring -- the one stroke WCAG 1.4.11 unambiguously requires at 3:1, so it is
   * held to the full threshold (see `contrast/assertions.ts`).
   *
   * Drawn from the accent's indicator rung (scale.ts chooseIndicator), not its solid: the solid is tuned to contrast
   * with its own label, and a lime or amber solid measures 1.2:1 on white. The indicator is the most vivid rung that
   * clears 3:1 and APCA 45 on every ground, per family and theme, so one rule stays conformant for every accent while
   * reading vivid (owner, 2026-10-21: ChatGPT's vibrant blue). It was the text level (textTonal), which read as navy.
   * `accent-indicator` names that rung. The selected stroke is a Selection role (emit/base.ts): this rung at Selection
   * Accent, the neutral solid at Neutral, so a selected edge and the mark inside it are always one colour family (owner,
   * 2026-10-22, option B; docs/research/selection-colour-2026-10-22). Focus follows Selection the same way (owner,
   * 2026-10-22: "make the focus ring follow Selection, so Selection Neutral is an entirely neutral look").
   */
  "stroke-control": at("neutral", "strokeControl"),
  "stroke-control-hover": at("neutral", "strokeControlHover"),
  "accent-indicator": indicator("accent"),

  // --- Tonal blocks -------------------------------------------------------------
  ...tonalBlock("accent", "accent"),
  ...tonalBlock("danger", "danger"),
  ...tonalBlock("warning", "warning"),
  ...tonalBlock("caution", "caution"),
  ...tonalBlock("success", "success"),
  ...tonalBlock("info", "info"),
  ...tonalBlock("discovery", "discovery"),
  ...tonalBlock("pink", "pink"),
  ...tagToneBlock("gray", "gray"),
  ...tonalBlock("brown", "brown"),
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
  background: [
    "page",
    "surface",
    "subtle",
    "code",
    "component",
    "componentHover",
    "componentActive",
  ],
  border: [
    "borderFaint",
    "borderSubtle",
    "border",
    "borderStrong",
    "tonalBorder",
    "tonalBorderStrong",
  ],
  text: [
    "textDisabled",
    "textPlaceholder",
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
  /** Level -> colour, for every level of the ramp, plus "white". */
  byLevel: Record<Position, string>;
  alphaByLevel: Record<number, string>;
  solid: { level: { light: Level; dark: Level }; hover: { light: Level; dark: Level } };
  stroke: { rest: { light: Level; dark: Level }; hover: { light: Level; dark: Level } };
  vivid: { light: Level; dark: Level };
  tonal: {
    foreground: { light: Level; dark: Level };
    surface: { light: Level; dark: Level };
    surfaceHover: { light: Level; dark: Level };
    surfaceActive: { light: Level; dark: Level };
    paint: { light: readonly [string, string, string]; dark: readonly [string, string, string] };
    /** Each Tone contrast floor's ink, keyed by `toneFloorId` (scale.ts `solveInk`). */
    ink: { light: Readonly<Record<string, string>>; dark: Readonly<Record<string, string>> };
    /** The paint and inks at another Tone tint (scale.ts TonalChoice). */
    tint: (theme: Theme, tint: number) => readonly [string, string, string];
    inkAt: (theme: Theme, tint: number, floor: string) => string;
  };
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
    case "alphaSlot": {
      const position = INVERSION[aliasValue.slot][theme];
      // White has no translucent twin: solving an alpha for white over a white page is
      // either fully transparent or undefined depending on which way you round it. A slot
      // that resolves to white is therefore a background slot only.
      if (position === "white") {
        throw new Error(
          `"${aliasValue.slot}" resolves to white in ${theme}, which has no alpha form. ` +
            `Point the alias at a rung, or use the opaque slot.`,
        );
      }
      return scales[aliasValue.role].alphaByLevel[position]!;
    }
    case "solid":
      return scales[aliasValue.role].byLevel[scales[aliasValue.role].solid.level[theme]]!;
    case "solidHover":
      return scales[aliasValue.role].byLevel[scales[aliasValue.role].solid.hover[theme]]!;
    case "tonalSurface":
      return scales[aliasValue.role].tonal.paint[theme][TONAL_STATES.indexOf(aliasValue.state)]!;
    case "tonalForeground":
      // The default floor's ink, solved between steps (scale.ts solveInk); Tone contrast picks another in CSS.
      return scales[aliasValue.role].tonal.ink[theme][toneFloorId(DEFAULT_TONE_FLOOR)]!;
    case "stroke":
      return tonalStroke(scales[aliasValue.role].byLevel[INVERSION.textTonal[theme]]!, theme, false);
    case "strokeHover":
      return tonalStroke(scales[aliasValue.role].byLevel[INVERSION.textTonal[theme]]!, theme, true);
    case "vivid": {
      // The status and label tones' dark vivid inks take their hue's most colourful readable point (scale.ts
      // luminousDarkVivid, plan A10.2); the accent's stays its rung (the accent gate solves the accent's paint).
      const rung = scales[aliasValue.role].byLevel[scales[aliasValue.role].vivid[theme]]!;
      return theme === "dark" && aliasValue.role !== "accent" ? luminousDarkVivid(rung) : rung;
    }
    case "indicator":
      return scales[aliasValue.role].byLevel[indicatorLevel(aliasValue.role, scales, theme)]!;
    case "contrast":
      return scales[aliasValue.role].contrast.hex;
    case "literal":
      return typeof aliasValue.value === "string" ? aliasValue.value : aliasValue.value[theme];
  }
}

/**
 * The indicator rung: the most vivid rung of a family that still marks a state wherever a focus ring or a selected edge
 * can sit (owner, 2026-10-21: "i like the thick 2px selected state stroke FROM CHATGPT. i particularly like the vibrant
 * blue that it uses"; ChatGPT's ring is #3a83f7). It walks from the 500 rung, the family's vivid middle, toward the ink
 * (darker in light, lighter in dark) to the first rung that clears 3:1 (WCAG 1.4.11) on the page, the surfaces and a
 * control's fills, APCA 45 on those (contrast/assertions.ts STROKE.focus), and 3:1 on every family's tint, since a ring
 * sits on a tinted plate too. Blue lands on 550 in light (#0160d9; 500 is 2.66:1 on discovery's pressed tint) and 250 in
 * dark. It was the text level, textTonal (#004cb0), which read as navy. Resolved here, where every family is known.
 */
function indicatorLevel(role: Role, scales: ScaleLookup, theme: Theme): Level {
  const view = scales[role], neutral = scales.neutral;
  const grounds = [INVERSION.page, INVERSION.surface, INVERSION.subtle, INVERSION.component, INVERSION.componentHover, INVERSION.componentActive]
    .map(slot => neutral.byLevel[slot[theme]]!);
  // Measured on the tints' rungs: in dark they are lighter than what paints (scale.ts chooseTonalPair), so a ring that
  // clears on them clears on the paint, and the reviewed ring holds (2026-10-28).
  const tints = Object.values(scales).flatMap(s => [s.tonal.surface, s.tonal.surfaceHover, s.tonal.surfaceActive].map(level => s.byLevel[level[theme]]!));
  const start = LEVELS.indexOf(500 as Level), direction = theme === "light" ? 1 : -1;
  // The accent's own tints quiet with it at every Accent strength (color/generate.ts); the grounds and other tones' tints stay.
  const own = new Set([view.tonal.surface, view.tonal.surfaceHover, view.tonal.surfaceActive].map(level => view.byLevel[level[theme]]!));
  for (let i = start; i >= 0 && i < LEVELS.length; i += direction) {
    const hex = view.byLevel[LEVELS[i]!];
    if (!hex) continue;
    if (ACCENT_STRENGTHS.every(strength => {
      const ring = withStrength(hex, strength);
      return grounds.every(g => wcagContrastHex(ring, g) >= 3 && apcaMagnitude(ring, g) >= 45) &&
        tints.every(g => wcagContrastHex(ring, own.has(g) ? withStrength(g, strength) : g) >= 3);
    })) return LEVELS[i]!;
  }
  return INVERSION.textTonal[theme] as Level;
}

/** The level an alias resolves to in a theme, for documentation and for the gate's messages. */
export function aliasLevel(aliasValue: Alias, scales: ScaleLookup, theme: Theme): Position | null {
  switch (aliasValue.kind) {
    case "slot":
    case "alphaSlot":
      return INVERSION[aliasValue.slot][theme];
    case "solid":
      return scales[aliasValue.role].solid.level[theme];
    case "solidHover":
      return scales[aliasValue.role].solid.hover[theme];
    case "tonalSurface": {
      // A derived dark surface (scale.ts chooseTonalPair) is not a numbered palette rung.
      const view = scales[aliasValue.role], key = aliasValue.state === "rest" ? "surface" : aliasValue.state === "hover" ? "surfaceHover" : "surfaceActive";
      const level = view.tonal[key][theme];
      return view.byLevel[level] === view.tonal.paint[theme][TONAL_STATES.indexOf(aliasValue.state)] ? level : null;
    }
    case "tonalForeground": {
      // A solved ink sits between steps; it is a numbered rung only where it landed on one.
      const view = scales[aliasValue.role], level = view.tonal.foreground[theme];
      return view.byLevel[level] === view.tonal.ink[theme][toneFloorId(DEFAULT_TONE_FLOOR)] ? level : null;
    }
    case "stroke":
    case "strokeHover":
      // A semantic tint is not a numbered palette rung.
      return null;
    case "vivid":
      return scales[aliasValue.role].vivid[theme];
    case "indicator":
      return indicatorLevel(aliasValue.role, scales, theme);
    default:
      return null;
  }
}
