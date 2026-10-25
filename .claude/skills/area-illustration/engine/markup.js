/*
 * Area figures: the markup step, shared by the skill's build (figures/index.jsx) and the app's Setup stage
 * (apps/desktop/src/setup-screen.tsx), so both draw words the same way. Rendered markup goes in; out comes the same
 * markup with every visible word wrapped in span.tx (abstract.css draws it Real, Bars or Shapes) and images blanked.
 */

/* Wrap every visible word so the abstraction can turn it into a bar or remove it: a word is one span.tx, the spaces
   between stay text, and a number is split into its digits (span.tx--d) and separators (span.tx--p), so a time or a
   count reads as numerals (abstract.css). Entities (&amp;) count as one character. */
const NUMBER = /^(?:\d|[:.,/%+×–-])+$/;
const word = (w) => /^[:.,/%+×–—-]+$/.test(w) ? `<span class="tx tx--p">${w}</span>` : !/\d/.test(w) || !NUMBER.test(w) ? `<span class="tx">${w}</span>`
  : w.split("").map((c) => `<span class="tx tx--${/\d/.test(c) ? "d" : "p"}">${c}</span>`).join("");
export function wrapText(html) {
  const skip = /^(option|textarea|style|script|title)$/i;
  let depth = 0;
  return html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith("<")) {
      const m = part.match(/^<(\/?)([a-zA-Z0-9-]+)/);
      if (m && skip.test(m[2])) depth += m[1] ? -1 : part.endsWith("/>") ? 0 : 1;
      return part;
    }
    return depth === 0 && /\S/.test(part) ? part.split(/(\s+)/).map((w) => (/^\s*$/.test(w) ? w : word(w))).join("") : part;
  }).join("");
}

/* Images: the demos' photos and video live in the app (images/…), so a figure draws each as a blank media block
   (abstract.css), and drops the preload links React adds for them. */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const dropSource = (h) => h.replace(/(<(?:img|video)\b[^>]*?)\s(?:src|srcSet|srcset)="[^"]*"/g, "$1");
export const blankImages = (h) => dropSource(dropSource(h)).replace(/<link\b[^>]*\brel="preload"[^>]*>/g, "").replace(/<img\b/g, `<img src="${BLANK}"`).replace(/\sposter="[^"]*"/g, "");

/** Rendered markup as a figure: words wrapped, images blank. */
export const figureMarkup = (html) => blankImages(wrapText(html));
