/**
 * Contrast exceptions.
 *
 * Every entry needs a reason, and the count is printed on every run. A silent allowlist is
 * how a design system's accessibility claims quietly stop being true.
 */
export interface ContrastException {
  fg: string;
  bg: string;
  /** Restrict the waiver to specific themes or accents; omit to waive everywhere. */
  theme?: "light" | "dark";
  accent?: string;
  neutral?: string;
  /** Which standard is waived. */
  standard: "wcag" | "apca";
  reason: string;
  /** ISO date after which the exception should be revisited. */
  expires?: string;
}

/**
 * Syntax highlighting is pinned to the palette's 500 rung in light themes.
 *
 * A deliberate, instructed trade: 500 is the rung the palette calibrates against white, and
 * a code block's body sits on neutral-25 rather than white, which costs a little contrast.
 * Three of the four land within 0.08 of the bar. Green does not -- it is on the glyph wall,
 * where 500 is pinned to 3:1 by construction, and it measures 2.93. That one is a real
 * accessibility cost and is written down here as one rather than rounded off in prose.
 *
 * Dark themes are not waived. There, 500 measures APCA Lc 28-31 against a floor of 60, and
 * `chooseVivid` keeps walking for a readable rung.
 */
const SYNTAX_500: ContrastException[] = (
  [
    ["danger", "red lands at 4.35-4.42 against 4.5, depending on the neutral cast"],
    ["discovery", "purple lands at 4.42-4.48 against 4.5"],
    [
      "accent",
      "the default indigo lands at 4.4 against 4.5; the axis can point accent at a glyph-wall hue such as orange, where 500 measures 2.83, so the worst case here is a consumer's choice rather than a default",
    ],
    [
      "success",
      "green lands at 2.89-2.93 against 4.5. Its 500 is a glyph-wall rung, pinned by the palette to 3:1 rather than to AA, so this one is a real accessibility cost and not a rounding",
    ],
  ] as const
).flatMap(([role, measured]) =>
  (["wcag", "apca"] as const).map((standard) => ({
    fg: `fg-${role}-vivid`,
    bg: "bg-code-body",
    theme: "light" as const,
    standard,
    reason: `Syntax highlighting is pinned to level 500 by instruction -- ${measured}.`,
    expires: "2027-01-01",
  })),
);

export const EXCEPTIONS: ContrastException[] = [...SYNTAX_500];

export function isWaived(
  exception: { fg: string; bg: string; standard: "wcag" | "apca" },
  context: { theme: string; accent: string; neutral: string },
): ContrastException | undefined {
  return EXCEPTIONS.find(
    (e) =>
      e.fg === exception.fg &&
      e.bg === exception.bg &&
      e.standard === exception.standard &&
      (e.theme === undefined || e.theme === context.theme) &&
      (e.accent === undefined || e.accent === context.accent) &&
      (e.neutral === undefined || e.neutral === context.neutral),
  );
}
