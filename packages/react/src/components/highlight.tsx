// The typed text, marked where it occurs in a result (components audit V4, 2026-11-07; Cursor's quick input
// `--vscode-list-highlightForeground`, docs/research/components-audit-2026-11-07/cursor.md). One helper for every list
// that filters as you type: Command palette's rows, Combobox's options and Custom select's filtered options.
import type { ReactNode } from "react";

/**
 * `text` with each case-insensitive occurrence of `query` (trimmed) wrapped in a `mark` (`.area-menu__match`), drawn in
 * the strong weight: weight, not colour, so the mark holds on every row plate and in forced colours. Returns `text`
 * unchanged when the query is empty or not in it (a fuzzy `filter` that matched other words).
 */
export function highlightMatch(text: string, query: string): ReactNode {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle || !text) return text;
  const haystack = text.toLocaleLowerCase();
  // Case folding can change a string's length (İ → i̇); mark only where the folded text lines up with the original.
  if (haystack.length !== text.length) return text;
  const parts: ReactNode[] = [];
  let from = 0;
  for (let at = haystack.indexOf(needle); at >= 0; at = haystack.indexOf(needle, at + needle.length)) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(<mark key={at} className="area-menu__match">{text.slice(at, at + needle.length)}</mark>);
    from = at + needle.length;
  }
  if (!parts.length) return text;
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}
