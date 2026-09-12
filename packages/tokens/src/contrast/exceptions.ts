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

export const EXCEPTIONS: ContrastException[] = [];

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
