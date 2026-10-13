/**
 * The app's own scale: type 13, Compact (owner, 2026-10-12: compact at 12 read small beside
 * Cursor, whose chrome is 13px). On <html> (index.html), and on app chrome drawn inside the Canvas (section
 * titles, tile heads, the Canvas bar's controls), which the Canvas's own settings must not move.
 */
export const APP_SCALE = { "data-area-type": "13", "data-area-density": "compact" } as const;
