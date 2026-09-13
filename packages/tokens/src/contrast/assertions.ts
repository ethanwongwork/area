/**
 * The contrast contract.
 *
 * Every pairing a component is allowed to render, declared as data and checked on every
 * build. Modelled on Primer, which runs roughly 250 such assertions in CI and is the only
 * mainstream system that treats contrast as a machine-checked contract rather than a
 * review-time opinion.
 *
 * Each assertion carries two thresholds because the two standards disagree in ways that
 * matter. See `../color/contrast.ts` for why both are enforced.
 */
import { APCA, WCAG } from "../color/contrast.ts";

export interface ContrastAssertion {
  /** Semantic token providing the foreground. */
  fg: string;
  /** Semantic token providing the background. */
  bg: string;
  /** Minimum WCAG 2.2 ratio. Enforced in both themes, always. */
  wcag: number;
  /** Minimum absolute APCA Lc. Enforced in dark themes; reported as a warning in light. */
  apca: number;
  /** Why this pairing exists, for the failure message. */
  note: string;
}

const TONES = ["accent", "danger", "warning", "caution", "success", "info", "discovery"] as const;

/**
 * The four tones a code block paints with: tags, strings, attributes and keywords.
 *
 * Named here rather than inferred, because `code.css` is where they are chosen and this is
 * where they are checked, and the two have to agree. Adding a fifth syntax colour without
 * adding it here would ship an unmeasured foreground.
 */
const SYNTAX_ROLES: readonly string[] = ["danger", "success", "accent", "discovery"];

/**
 * Resting strokes: a deliberate, documented departure from a flat 3:1 reading of
 * WCAG 1.4.11, and the one place in this file where Area asserts less than the headline
 * number. It is stated here rather than buried in an allowlist.
 *
 * A 1px stroke that clears 3:1 against white sits near L 0.62 -- a mid grey. No shipping
 * system does this, because it does not look like a modern interface: Radix's UI border
 * measures 1.53:1, Tailwind's 1.24:1, Vercel's Geist 1.20:1, shadcn's 1.23:1. Area's is
 * 1.57:1, the strongest of that group.
 *
 * The reading that justifies it: 1.4.11 governs visual information *required to identify*
 * a component and its state. Area's controls are identified by fill, label, and position;
 * the resting stroke is ambient definition, not the sole affordance. What the criterion
 * does unambiguously cover is the focus indicator, and Area holds that to the full 3:1 --
 * which is why `border-focus` resolves to the solid step rather than the border band.
 *
 * So the contract is: resting strokes must be reliably *discernible*, and every stroke
 * that carries state meaning must be *conformant*.
 */
const STROKE = {
  /**
   * Ambient definition: separators, card edges, table rules. The weakest stroke in the
   * system by design, and never a state indicator.
   *
   * APCA is not asserted here. It models text legibility and clamps very low values to
   * zero, which makes it the wrong instrument for a hairline rule that is doing its job
   * perfectly well at 1.4:1.
   */
  ambient: { wcag: 1.3, apca: 0 },
  /** Resting definition on an interactive control. Must be visible; not a state indicator. */
  resting: { wcag: 1.5, apca: 10 },
  /** Hover. Carries state, so it is held higher than rest. */
  hover: { wcag: 1.9, apca: 15 },
  /** Focus. A conformance requirement, held to the full non-text threshold. */
  focus: { wcag: WCAG.NON_TEXT, apca: APCA.LARGE },
} as const;

/** Surfaces that body text is allowed to land on. */
const TEXT_SURFACES = ["bg-page", "bg-surface", "bg-subtle", "bg-component"];

function textAssertions(): ContrastAssertion[] {
  const out: ContrastAssertion[] = [];
  for (const bg of TEXT_SURFACES) {
    out.push({ fg: "fg-default", bg, wcag: WCAG.TEXT, apca: APCA.BODY, note: "body copy" });
    out.push({ fg: "fg-muted", bg, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: "secondary copy" });
    // Placeholders are not content, and APCA's own conformance table names Lc 30 as the
    // level for exactly this case. WCAG's non-text 3:1 still applies.
    out.push({ fg: "fg-placeholder", bg, wcag: 3, apca: APCA.PLACEHOLDER, note: "placeholder" });
  }
  return out;
}

function tonalAssertions(): ContrastAssertion[] {
  const out: ContrastAssertion[] = [];
  for (const tone of TONES) {
    // Tonal text on the page, on a quiet surface, and on its own tint. `bg-subtle` is in
    // this list because syntax highlighting puts tonal foregrounds on a code block, which
    // is the one place tonal text lands on a surface that is not its own.
    for (const bg of ["bg-page", "bg-surface", "bg-subtle", `${tone}-surface`]) {
      out.push({ fg: `fg-${tone}`, bg, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: `${tone} text` });
    }
    // The vivid rung is asserted for the four tones a code block actually paints with, on
    // the ground it paints them on. Asserting the other three would be asserting pairings
    // nothing renders -- and, since vivid is pinned to 500 in light, would have meant three
    // more waivers for colours that never appear.
    if (SYNTAX_ROLES.includes(tone)) {
      out.push({
        fg: `fg-${tone}-vivid`,
        bg: "bg-code-body",
        wcag: WCAG.TEXT,
        apca: APCA.CONTENT,
        note: `${tone} vivid text on a code block`,
      });
    }
    // The solid fill and its hover must both carry the foreground the scale declared.
    out.push({
      fg: `fg-on-${tone}`,
      bg: `${tone}-solid`,
      wcag: WCAG.TEXT,
      apca: APCA.CONTENT,
      note: `${tone} solid button label`,
    });
    out.push({
      fg: `fg-on-${tone}`,
      bg: `${tone}-solid-hover`,
      wcag: WCAG.LARGE_TEXT,
      apca: APCA.LARGE,
      note: `${tone} solid button label, hover`,
    });
    // Tonal borders are resting definition on a tinted surface.
    out.push({
      fg: `${tone}-border`,
      bg: "bg-surface",
      ...STROKE.resting,
      note: `${tone} control border`,
    });
    out.push({
      fg: `${tone}-border-strong`,
      bg: "bg-surface",
      ...STROKE.hover,
      note: `${tone} control border, hover`,
    });
  }
  return out;
}

function chromeAssertions(): ContrastAssertion[] {
  return [
    { fg: "border", bg: "bg-page", ...STROKE.resting, note: "control border on page" },
    { fg: "border", bg: "bg-surface", ...STROKE.resting, note: "control border on surface" },
    { fg: "border-subtle", bg: "bg-surface", ...STROKE.ambient, note: "separator and card edge" },
    { fg: "border-subtle", bg: "bg-page", ...STROKE.ambient, note: "separator on page" },
    { fg: "border-hover", bg: "bg-surface", ...STROKE.hover, note: "control border, hover" },

    // The focus ring is checked against every surface it can land on. Checking only the
    // page is the classic miss: a ring that clears the page can vanish against a filled
    // control or an inset well.
    { fg: "border-focus", bg: "bg-page", ...STROKE.focus, note: "focus ring on page" },
    { fg: "border-focus", bg: "bg-surface", ...STROKE.focus, note: "focus ring on surface" },
    { fg: "border-focus", bg: "bg-component", ...STROKE.focus, note: "focus ring on control" },
    { fg: "border-focus", bg: "bg-subtle", ...STROKE.focus, note: "focus ring on inset" },

    // The neutral button fills. Primary is the strongest call to action a neutral palette
    // can make, so its label has to clear body-text contrast, not merely large-text.
    {
      fg: "fg-on-neutral-solid",
      bg: "bg-neutral-solid",
      wcag: WCAG.TEXT,
      apca: APCA.CONTENT,
      note: "neutral button label",
    },
    // Inverted surfaces: tooltips and toasts.
    { fg: "fg-on-inverse", bg: "bg-inverse", wcag: WCAG.TEXT, apca: APCA.BODY, note: "tooltip and toast text" },

    // Disabled content is exempt from 1.4.11, but must not disappear entirely.
    { fg: "fg-disabled", bg: "bg-surface", wcag: 1.9, apca: 20, note: "disabled label" },
  ];
}

export const ASSERTIONS: ContrastAssertion[] = [
  ...textAssertions(),
  ...tonalAssertions(),
  ...chromeAssertions(),
];
