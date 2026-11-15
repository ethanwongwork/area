/**
 * The contrast contract.
 *
 * Supported token pairings declared as data and checked by npm test. Modelled on Primer, which runs roughly 250 such assertions in CI and is the only
 * mainstream system that treats contrast as a machine-checked contract rather than a
 * review-time opinion.
 *
 * Each assertion carries WCAG and supplementary APCA thresholds because they disagree in ways that
 * matter. See `../color/contrast.ts` for why both are enforced.
 */
import { APCA, WCAG } from "../color/contrast.ts";
import { LABEL_HUES } from "../semantic/hues.ts";

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

const TONES = ["accent", "danger", "warning", "caution", "success", "info", "discovery", "pink", "brown"] as const;
/** Tag-only tones: a tint and its inks, no outline or solid (aliases.ts, tagToneBlock). */
const TAG_TONES = ["gray"] as const;

/**
 * The four tones a code block paints with: keywords, tags, attributes and strings.
 *
 * Named here rather than inferred, because `code.css` is where they are chosen and this is
 * where they are checked, and the two have to agree. Adding a fifth syntax colour without
 * adding it here would ship an unmeasured foreground.
 */
const SYNTAX_ROLES: readonly string[] = ["danger", "discovery", "info", "accent"];

/** Supplementary stroke floors are aesthetic policy, not WCAG conformance thresholds.
 * Text-identified buttons may use quiet outlines. Editable fields, unchecked glyphs,
 * persistent selection and keyboard focus use separate required indicators at 3:1.
 * See docs/CONTRAST.md and WCAG 2.2 SC 1.4.11; hover itself need not contrast with rest.
 */
const STROKE = {
  /**
   * Ambient control definition and swatch edges. Decorative container rules have a
   * separate, fainter token; neither tier is a state indicator.
   *
   * APCA is not asserted here. It models text legibility and clamps very low values to
   * zero, which makes it the wrong instrument for a hairline rule that is doing its job
   * perfectly well at 1.4:1.
   */
  ambient: { wcag: 1.3, apca: 0 },
  /**
   * A container edge that supplements a fill difference rather than replacing one -- a
   * white code block on a grey page. Held lower than `ambient` because the stroke is not
   * the only thing separating the two surfaces, and 1.2 is where Tailwind, shadcn and
   * Vercel all put exactly this edge.
   */
  faint: { wcag: 1.2, apca: 0 },
  /** Resting definition on an interactive control. Must be visible; not a state indicator. */
  resting: { wcag: 1.5, apca: 10 },
  /** Supplementary hover definition; an aesthetic floor above rest. */
  hover: { wcag: 1.9, apca: 15 },
  /** Focus. A conformance requirement, held to the full non-text threshold. */
  focus: { wcag: WCAG.NON_TEXT, apca: APCA.LARGE },
} as const;

/** Surfaces that body text is allowed to land on. */
const TEXT_SURFACES = ["bg-page", "bg-surface", "bg-subtle", "bg-well", "bg-component", "bg-stripe", "bg-float", "bg-component-float"];

function textAssertions(): ContrastAssertion[] {
  const out: ContrastAssertion[] = [];
  for (const bg of TEXT_SURFACES) {
    out.push({ fg: "fg-default", bg, wcag: WCAG.TEXT, apca: APCA.BODY, note: "body copy" });
    out.push({ fg: "fg-muted", bg, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: "secondary copy" });
    // A small placeholder is ordinary text: no exemption from the 4.5:1 requirement.
    out.push({ fg: "fg-placeholder", bg, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: "placeholder" });
    // The subtle ink is text too (plan A3.2): meta keeps 4.5:1 wherever it sits.
    out.push({ fg: "fg-subtle", bg, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: "meta (shortcut, timestamp, empty value)" });
  }
  // Meta and placeholders under the pointer: a hovered row or field, on the page and in a floating list.
  for (const bg of ["bg-component-hover", "bg-component-float-hover"]) {
    out.push({ fg: "fg-subtle", bg, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: "meta on a hovered row" });
    out.push({ fg: "fg-placeholder", bg, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: "placeholder in a hovered field" });
  }
  return out;
}

function tonalAssertions(): ContrastAssertion[] {
  const out: ContrastAssertion[] = [];
  // A tag paints its strongest ink on its active tint (Tag, docs/specs/tag.md), in every tone.
  for (const tone of [...TONES.filter(tone => tone !== "accent"), ...TAG_TONES]) {
    out.push({ fg: `fg-${tone}-strong`, bg: `${tone}-surface-active`, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: `${tone} tag label` });
  }
  for (const tone of TAG_TONES) {
    for (const bg of ["bg-page", "bg-surface", "bg-subtle", `${tone}-surface`, `${tone}-surface-hover`, `${tone}-surface-active`]) {
      out.push({ fg: `fg-${tone}`, bg, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: `${tone} text` });
      out.push({ fg: `fg-${tone}-strong`, bg, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: `${tone} strong text (a tag label)` });
    }
  }
  for (const tone of TONES) {
    // Tonal text on the page, on a quiet surface, and on its own tint. `bg-subtle` is in
    // this list because syntax highlighting puts tonal foregrounds on a code block, which
    // is the one place tonal text lands on a surface that is not its own.
    for (const bg of ["bg-page", "bg-surface", "bg-subtle", `${tone}-surface`]) {
      out.push({ fg: `fg-${tone}`, bg, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: `${tone} text` });
    }
    // The vivid rung is asserted for the four tones a code block actually paints with, on
    // the ground it paints them on. Asserting the other three would be asserting pairings
    // nothing renders. Readable vivid colors are measured against the code ground.
    if (SYNTAX_ROLES.includes(tone)) {
      out.push({
        fg: `fg-${tone}-vivid`,
        bg: "bg-code",
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
      wcag: WCAG.TEXT,
      apca: APCA.CONTENT,
      note: `${tone} solid button label, hover`,
    });
    // Tonal borders are held to the ambient tier, not the resting one.
    //
    // Same reading the neutral outline button already gets: an outline control is identified
    // by its label and its shape, and the stroke is definition rather than the affordance.
    // Holding a tinted stroke to the resting tier forced it down to rung 400, where an indigo
    // measured 3.68:1 on white against a green's 1.80 -- one token, twice the weight, and the
    // loud end two and a half times heavier than the neutral outline beside it.
    out.push({
      fg: `${tone}-border`,
      bg: "bg-surface",
      ...STROKE.ambient,
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
    // Deliberately faint visual grouping, retained at neutral 75 in light themes.
    // This is a design floor, not a control-contrast threshold. Existing control,
    // focus, text and ambient thresholds remain unchanged.
    { fg: "border-decorative", bg: "bg-page", wcag: 1.1, apca: 0, note: "decorative divider on page" },
    { fg: "border-decorative", bg: "bg-surface", wcag: 1.1, apca: 0, note: "decorative container edge" },
    { fg: "border-float", bg: "bg-surface", wcag: 1.1, apca: 0, note: "floating frame over another surface" },
    { fg: "border", bg: "bg-page", ...STROKE.resting, note: "control border on page" },
    { fg: "border", bg: "bg-surface", ...STROKE.resting, note: "control border on surface" },
    { fg: "border-subtle", bg: "bg-surface", ...STROKE.ambient, note: "quiet control outline" },
    { fg: "border-subtle", bg: "bg-page", ...STROKE.ambient, note: "quiet outline on page" },
    { fg: "border-faint", bg: "bg-page", ...STROKE.faint, note: "token badge edge on page" },
    { fg: "border-faint", bg: "bg-surface", ...STROKE.faint, note: "token badge edge on a panel" },
    // The segmented track has an inset fill as well as an outline; check the actual pair.
    { fg: "border-faint", bg: "bg-subtle", wcag: 1.1, apca: 0, note: "segmented track outline" },
    { fg: "border-hover", bg: "bg-surface", ...STROKE.hover, note: "control border, hover" },

    // The focus ring is checked against every surface it can land on. Checking only the
    // page is the classic miss: a ring that clears the page can vanish against a filled
    // control or an inset well. The ring is a Selection role (2026-10-22), so both of its endpoints are checked.
    ...(["accent-indicator", "neutral-solid"] as const).flatMap(fg => [
      { fg, bg: "bg-page", ...STROKE.focus, note: "focus ring on page" },
      { fg, bg: "bg-surface", ...STROKE.focus, note: "focus ring on surface" },
      { fg, bg: "bg-component", ...STROKE.focus, note: "focus ring on control" },
      { fg, bg: "bg-subtle", ...STROKE.focus, note: "focus ring on inset" },
    ]),

    // The neutral button fills. Neutral solid is the strongest call to action a neutral palette
    // can make, so its label has to clear body-text contrast, not merely large-text.
    {
      fg: "fg-on-neutral",
      bg: "neutral-solid",
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
  ...["bg-page", "bg-surface", "bg-component-hover"].map(bg => ({
    fg: "bg-inverse", bg, wcag: WCAG.TEXT, apca: APCA.CONTENT,
    note: "inverse Badge transparent label and hover",
  })),
  ...tonalAssertions(),
  ...chromeAssertions(),
  ...stateAssertions(),
  ...hueAssertions(),
];

/**
 * Every label hue's roles (semantic/hues.ts; components audit D5, 2026-11-07), held to one rule per role so Tag, Board,
 * Link and a chart coloured by a label can take any hue: its words on the page, the surfaces and each of its own tints
 * (and the half tint a Board column lays over the page); its icon as a non-text mark; its accent under its own words;
 * its outline at the ambient tier the tone strokes hold.
 */
function hueAssertions(): ContrastAssertion[] {
  const out: ContrastAssertion[] = [];
  for (const hue of LABEL_HUES) {
    const role = (name: string) => `hue-${hue}-${name}`;
    for (const bg of ["bg-page", "bg-surface", "bg-subtle", role("bg"), role("bg-hover"), role("bg-active")]) {
      out.push({ fg: role("text"), bg, wcag: WCAG.TEXT, apca: APCA.CONTENT, note: `${hue} words` });
    }
    for (const bg of ["bg-page", "bg-surface", role("bg")]) {
      out.push({ fg: role("icon"), bg, wcag: WCAG.NON_TEXT, apca: 0, note: `${hue} icon or dot` });
    }
    out.push({ fg: role("on-accent"), bg: role("accent"), wcag: WCAG.TEXT, apca: APCA.CONTENT, note: `words on the ${hue} accent` });
    out.push({ fg: role("border"), bg: "bg-surface", ...STROKE.ambient, note: `${hue} outline` });
  }
  return out;
}

/** Strong indicator endpoints. V01 soft presentation is audited separately in the browser. */
function stateAssertions(): ContrastAssertion[] {
  const out: ContrastAssertion[] = [];
  const surfaces = [...TEXT_SURFACES, "bg-component-hover", "bg-component-active"];
  for (const bg of surfaces) {
    // The selected edge is a Selection role (emit/base.ts, 2026-10-22): its two endpoints, the accent's indicator rung
    // and the neutral solid, each hold 3:1, so every mix the setting produces does too.
    for (const fg of ["stroke-control", "stroke-control-hover", "accent-indicator", "neutral-solid", "fg-danger"]) {
      out.push({fg,bg,wcag:WCAG.NON_TEXT,apca:0,note:"required boundary, state or opaque focus"});
    }
    out.push({fg:"fg-default",bg,wcag:WCAG.TEXT,apca:APCA.CONTENT,note:"UI label in interactive state"});
    for (const tone of ["danger", "success", "warning"]) {
      out.push({fg:`fg-${tone}-vivid`,bg,wcag:WCAG.NON_TEXT,apca:0,note:`vivid ${tone} input edge`});
    }
  }
  for (const bg of ["accent-solid", "accent-solid-hover"]) out.push({fg:"fg-on-accent",bg,wcag:WCAG.NON_TEXT,apca:0,note:"checked mark or switch thumb"});
  out.push({fg:"bg-surface",bg:"stroke-control",wcag:WCAG.NON_TEXT,apca:0,note:"increased-contrast unchecked switch thumb"});
  out.push({fg:"fg-on-neutral",bg:"neutral-solid-hover",wcag:WCAG.TEXT,apca:APCA.CONTENT,note:"neutral button hover label"});
  for (const tone of TONES) for (const state of ["", "-hover", "-active"]) {
    const bg = `${tone}-surface${state}`;
    // The focus ring is a Selection role (2026-10-22): both endpoints hold on every tinted surface.
    for (const fg of ["accent-indicator", "neutral-solid"]) out.push({fg,bg,wcag:WCAG.NON_TEXT,apca:0,note:"opaque focus on a tinted surface"});
    if(state) out.push({fg:`fg-${tone}`,bg,wcag:WCAG.TEXT,apca:APCA.CONTENT,note:"tonal UI label in interactive state"});
  }
  for (const state of ["", "-hover", "-active"]) out.push({fg:"accent-indicator",bg:`accent-surface${state}`,wcag:WCAG.NON_TEXT,apca:0,note:"increased-contrast selected chip border on its tint"});
  return out;
}
