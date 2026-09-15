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

/** E03 resolves readable syntax by measurement; no active exceptions. */
export const EXCEPTIONS: ContrastException[] = [];

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
