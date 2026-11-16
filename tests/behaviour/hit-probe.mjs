// Page-side probe for the hit-target suite: every interactive element inside `scope`, and whether a circle of `size`
// CSS px around its centre belongs to it (the 24 px circle of WCAG 2.5.8), read with document.elementFromPoint at
// the centre and eight points on the circle, so ::before / ::after targets count, rounded corners are fair, and a
// neighbour drawn over it doesn't count. A text field's own shell counts as the field. Runs in the page.
// `axes` limits the circle to one axis where a part's other axis meets a neighbour by design ("block": the points
// above and below; "inline": either side; "both", the default: the whole circle). `only`, a selector, limits the probe
// to the parts it matches.
export function probeTargets(scope, size, axes = "both", only = null) {
  const root = document.querySelector(scope);
  const SELECTOR = "button, a[href], input:not([type=hidden]), select, textarea, [role=option], [role=tab], [role=radio], [role=checkbox], [role=switch], [role=slider], [role=menuitem], [role=treeitem], [tabindex='0']:not([role=tabpanel])";
  const radius = size / 2 - 1, d = radius * Math.SQRT1_2; // 1 px inside the circle, so a sub-pixel seam with an abutting neighbour is no miss
  const TEXT = "input:not([type=checkbox], [type=radio], [type=range], [type=button], [type=submit]), textarea";
  const seen = new Set();
  const out = [];
  for (let el of root.querySelectorAll(SELECTOR)) {
    if (el.matches(":disabled") || !el.checkVisibility() || (only && !el.matches(only))) continue;
    // A visually hidden native control is pressed through its label.
    const r0 = el.getBoundingClientRect();
    if ((r0.width < 2 || r0.height < 2 || getComputedStyle(el).opacity === "0") && el.labels?.[0]) el = el.labels[0];
    const field = el.matches(TEXT) ? el.parentElement?.closest("[class^='area-'][class*='input'], [class^='area-'][class*='field'], [class^='area-textarea']") : null;
    if (seen.has(el)) continue; seen.add(el);
    el.scrollIntoView({ block: "center", inline: "center" });
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
    const owns = node => !!node && (node === el || el.contains(node) || (field && field.contains(node)) || [...(el.labels ?? [])].some(l => l === node || l.contains(node)) || node.control === el);
    const misses = [];
    const points = { both: [[0, 0], [-radius, 0], [radius, 0], [0, -radius], [0, radius], [-d, -d], [d, -d], [-d, d], [d, d]],
      block: [[0, 0], [0, -radius], [0, radius]], inline: [[0, 0], [-radius, 0], [radius, 0]] }[axes];
    for (const [dx, dy] of points) {
      const hit = document.elementFromPoint(cx + dx, cy + dy);
      if (!owns(hit)) misses.push(`${dx > 0 ? "+" : dx < 0 ? "−" : "0"}${dy > 0 ? "+" : dy < 0 ? "−" : "0"}→${hit ? hit.localName + (hit.className && typeof hit.className === "string" ? "." + hit.className.split(" ")[0] : "") : "none"}`);
    }
    const name = el.getAttribute("aria-label") || el.textContent.trim().slice(0, 20) || el.localName;
    out.push({ name: `${el.localName}${el.getAttribute("role") ? "[" + el.getAttribute("role") + "]" : ""} "${name}"`, box: `${Math.round(r.width * 10) / 10}×${Math.round(r.height * 10) / 10}`, misses });
  }
  return out;
}
