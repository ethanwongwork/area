/**
 * Escaping and minimal JSX highlighting for code shown in demos (Code block's syntax classes).
 * Moved from the docs site's layout (2026-10-12): the app is the source of truth; the archived
 * site's build re-exports these from here.
 */
export const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/**
 * Minimal JSX highlighting, at build time. Emits Area's own syntax classes.
 *
 * Tokens are taken in one pass (highlightTokens), so a string's quotes and a tag's name are
 * never wrapped twice.
 *
 * Comments are recognised by line rather than by scan, because the only honest way to tell
 * a `//` comment from a `//` inside a URL is that it starts the line. A line that starts as
 * a comment is emitted whole: running the pass first would let a quoted string inside a
 * comment swallow the span that wraps it.
 */
export function highlight(code) {
  return code.split("\n").map(highlightLine).join("\n");
}

function highlightLine(line) {
  if (/^\s*\/\//.test(line)) return `<span class="area-syntax-comment">${escapeHtml(line)}</span>`;
  return highlightTokens(line);
}

/**
 * One pass over a line, each token taken once: a double-quoted string, a tag's name, an attribute's name (straight
 * before its `=`), a keyword, a brace. Everything between is escaped as it is. (A pass per kind over escaped text
 * wrapped strings twice and took a string's closing quote for the next one's opening; direct editing, 2026-11-08.)
 * Single quotes are left alone: in JSX's words they are apostrophes.
 */
const TOKEN = /("(?:[^"\\]|\\.)*")|(<\/?)([A-Za-z][\w.]*)|([A-Za-z_$][\w$-]*)(?==[^=])|\b(import|from|export|function|const|let|return|default|new|await|async)\b|([{}])/g;
const span = (kind, text) => `<span class="area-syntax-${kind}">${escapeHtml(text)}</span>`;

function highlightTokens(line) {
  let out = "", last = 0;
  for (const match of line.matchAll(TOKEN)) {
    const [all, string, open, tag, attr, keyword, brace] = match;
    out += escapeHtml(line.slice(last, match.index));
    if (string) out += span("string", string);
    else if (tag) out += escapeHtml(open) + span("tag", tag);
    else if (attr) out += span("attr", attr);
    else if (keyword) out += span("keyword", keyword);
    else out += span("punct", brace);
    last = match.index + all.length;
  }
  return out + escapeHtml(line.slice(last));
}
