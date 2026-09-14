/**
 * Contrast exceptions.
 *
 * Every entry needs a reason, and the count is printed on every run. A silent allowlist is
 * how a design system's accessibility claims quietly stop being true.
 */
export interface ContrastException {
  fg: string;
  bg: string;
  /** Restrict the waiver to specific themes or brands; omit to waive everywhere. */
  theme?: "light" | "dark";
  brand?: string;
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
 * A deliberate, instructed trade. 500 is the rung the palette calibrates against *white*,
 * and a code block sits one rung back from the page so that it reads as a block -- so the
 * label-wall hues land just under the bar there, by margins too small to see and large
 * enough to fail. Green is the exception to that: at 3.06 it is not a rounding, because its
 * 500 is a glyph-wall rung pinned by the palette to 3:1 rather than to AA.
 *
 * Dark themes are not waived. There, 500 measures APCA Lc 28-31 against a floor of 60, and
 * `chooseVivid` keeps walking for a readable rung.
 */
const SYNTAX_500: ContrastException[] = (
  [
    ["danger", "red measures 4.35-4.42 against 4.5, depending on the neutral cast"],
    ["discovery", "purple measures 4.42-4.48 against 4.5"],
    [
      "brand",
      "the default indigo measures 4.45 against 4.5; the axis can also point brand at a glyph-wall hue such as orange or green, where 500 is pinned to 3:1, and the worst case here is that consumer choice rather than the default",
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
  context: { theme: string; brand: string; neutral: string },
): ContrastException | undefined {
  return EXCEPTIONS.find(
    (e) =>
      e.fg === exception.fg &&
      e.bg === exception.bg &&
      e.standard === exception.standard &&
      (e.theme === undefined || e.theme === context.theme) &&
      (e.brand === undefined || e.brand === context.brand) &&
      (e.neutral === undefined || e.neutral === context.neutral),
  );
}
