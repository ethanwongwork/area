/** Normalises a count to a nonnegative whole number (non-finite values read as 0). */
export function normalizeCount(count: number): number {
  return Math.max(0, Math.floor(Number.isFinite(count) ? count : 0));
}

/**
 * The text Indicator and Count show for a number: the whole number, or `max+` above the cap
 * (99+ by default, as Fluent's CounterBadge and Spectrum's NotificationBadge).
 */
export function formatCount(count: number, max = 99): string {
  const number = normalizeCount(count);
  const limit = Number.isFinite(max) ? normalizeCount(max) : 99;
  return number > limit ? `${limit}+` : String(number);
}
