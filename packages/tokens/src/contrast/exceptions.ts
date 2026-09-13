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
 * A deliberate, instructed trade -- but a much smaller one than it was. 500 is the rung the
 * palette calibrates against white, and the code block now *is* white, so red, purple, blue
 * and the default indigo all clear AA there on their own and need no waiver at all. What
 * remains is the glyph wall: green measures 3.06, because its 500 is pinned to 3:1 by
 * construction. That is a real accessibility cost and is written down here as one.
 *
 * Dark themes are not waived. There, 500 measures APCA Lc 28-31 against a floor of 60, and
 * `chooseVivid` keeps walking for a readable rung.
 */
const SYNTAX_500: ContrastException[] = (
  [
    [
      "accent",
      "the default indigo measures 4.72 on white and passes; the axis can point accent at a glyph-wall hue such as orange or green, where 500 is pinned to 3:1, so the waiver covers a consumer's choice rather than the default",
    ],
    [
      "success",
      "green measures 3.06 against 4.5. Its 500 is a glyph-wall rung, pinned by the palette to 3:1 rather than to AA, so this one is a real accessibility cost and not a rounding",
    ],
  ] as const
).flatMap(([role, measured]) =>
  (["wcag", "apca"] as const).map((standard) => ({
    fg: `fg-${role}-vivid`,
    bg: "bg-code",
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
