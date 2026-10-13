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
 * Keywords are matched last and only outside a tag, so `import` in prose stays prose and an
 * attribute named `for` is not recoloured as a statement.
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

function highlightTokens(line) {
  return escapeHtml(line)
    .replace(/(&lt;\/?)([A-Za-z][\w.]*)/g, '$1<span class="area-syntax-tag">$2</span>')
    .replace(
      /([a-zA-Z-]+)(=)(&quot;[^&]*?&quot;)/g,
      '<span class="area-syntax-attr">$1</span>$2<span class="area-syntax-string">$3</span>',
    )
    .replace(/(&quot;[^&]*?&quot;)/g, (m, q) => (m.includes("area-syntax") ? m : `<span class="area-syntax-string">${q}</span>`))
    .replace(
      /\b(import|from|export|const|let|return|default|new|await|async)\b/g,
      '<span class="area-syntax-keyword">$1</span>',
    )
    .replace(/(\{)([^{}]*)(\})/g, '<span class="area-syntax-punct">$1</span>$2<span class="area-syntax-punct">$3</span>');
}
