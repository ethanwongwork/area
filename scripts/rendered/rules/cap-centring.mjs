// Cap centring (plan B2.2, B5.1; findings VA1, VA2, VN8, VS2): the capital-height box of a single-line label is
// centred in its control or row box within 0.1 px.
//
// The cap box comes from the loaded face (measure-page.js): the text's first line box is the font's content area, so
// its baseline is the line's top plus the face's ascent and its cap top is the baseline less the face's cap height
// (canvas measureText on the text's own computed font: fontBoundingBoxAscent, and the ink ascent of "H"). The offset is
// the cap box's centre less the box's centre (border box), in CSS px: negative is high. A box is checked when all of
// its text sits on one line; a text inside a nested box of this table is judged against that box instead.
// Light only: the offsets are layout, the same in dark.

export const TOLERANCE = 0.1;
// A box taller than the largest control (lg, 38 at type 13 / density 32, plus room) holds more than one line of
// controls or a tall part, so its single text is not centred by design (a Panel row with a colour well, a list row with
// a picture).
export const MAX_BOX = 40;

// The control and row boxes. `match` is a class token or a role; `against` measures the label against a part of the
// box instead of the box (Switch: its track); `only` limits the texts to a part's (Switch: its label).
export const BOXES = [
  { name: "Button", match: { cls: "area-button" } },
  { name: "Chip", match: { cls: "area-chip" } },
  { name: "Segmented item", match: { cls: "area-segmented__item" } },
  { name: "Tab", match: { cls: "area-tabs__tab" }, finding: "VN8" },
  { name: "Menu row", match: { cls: "area-menu__item" }, finding: "VN8" },
  { name: "Nav row", match: { cls: "area-nav__item" }, finding: "VN8" },
  { name: "List box row", match: { cls: "area-list-box__item" }, finding: "VN8" },
  { name: "Tree view row", match: { role: "treeitem" }, finding: "VN8" },
  { name: "Pagination page", match: { cls: "area-pagination__page" }, finding: "VN8" },
  { name: "Panel row", match: { cls: "area-panel__row" }, finding: "VN8" },
  { name: "Property list row", match: { cls: "area-property-list__item" }, finding: "VN8" },
  { name: "Accordion trigger", match: { cls: "area-accordion-item__trigger" } },
  { name: "Asset row", match: { cls: "area-asset-row" } },
  { name: "Token row", match: { cls: "area-token-row" } },
  { name: "Tooltip", match: { cls: "area-tooltip" }, finding: "VN8" },
  { name: "Custom select", match: { cls: "area-custom-select__trigger" }, finding: "VA1" },
  { name: "Date picker", match: { cls: "area-date-picker__trigger" }, finding: "VA1" },
  { name: "Input (affix, segments, text)", match: { cls: "area-input" }, finding: "VA1" },
  { name: "Input group", match: { cls: "area-input-group" }, finding: "VA1" },
  { name: "Number field", match: { cls: "area-number-field" }, finding: "VA1" },
  { name: "OTP slot", match: { cls: "area-otp-field__slot" }, finding: "VA1" },
  { name: "Selection bar", match: { cls: "area-selection-bar" }, finding: "VA1" },
  { name: "Switch label on its track", match: { cls: "area-switch" }, against: "area-switch__track", only: "area-switch__label", finding: "VA2" },
  { name: "Badge", match: { cls: "area-badge" }, item: "B5.1", finding: "VS2" },
  { name: "Count", match: { cls: "area-count" }, item: "B5.1", finding: "VS2" },
  { name: "Tag", match: { cls: "area-tag" }, item: "B5.1", finding: "VS2" },
  { name: "Kbd", match: { cls: "area-kbd" }, item: "B5.1", finding: "VS2" },
  { name: "Citation", match: { cls: "area-citation" }, item: "B5.1", finding: "VS2" },
];

const has = (node, cls) => node.cls.split(/\s+/).includes(cls);
const matches = (node, m) => (m.cls ? has(node, m.cls) : true) && (m.role ? node.attrs?.role === m.role : true);

/** Every checked box in a tile: [{ box, node index, offsets: [{ text, offset }] }]. */
export function capOffsets(tile) {
  const nodes = tile.nodes ?? [];
  const kids = nodes.map(() => []);
  nodes.forEach((n, i) => { if (n.parent >= 0) kids[n.parent].push(i); });
  // The innermost table box holding each node.
  const owner = new Array(nodes.length).fill(-1);
  const boxOf = new Array(nodes.length).fill(null);
  nodes.forEach((n, i) => {
    const entry = BOXES.find(b => matches(n, b.match));
    if (entry) boxOf[i] = entry;
    owner[i] = entry ? i : n.parent >= 0 ? owner[n.parent] : -1;
  });
  // A box drawn at another scale (a Design card's design, a scaled preview) has rects that are not its font's lengths.
  const scaled = i => { for (let k = i; k >= 0; k = nodes[k].parent) { const n = nodes[k]; if (n.transform || n.scale || n.zoom) return true; } return false; };
  // Visually hidden text: an sr-only part, or one clipped to a 1px box of its own (Count's label), whose text box still
  // reports its unclipped line.
  const clipped = i => { const r = nodes[i]?.r; return !!r && (r.w <= 1 || r.h <= 1); };
  const hidden = t => t.box.w <= 1 || t.box.h <= 1 || within(t.node, "area-sr-only") || clipped(t.node);
  const within = (i, cls) => { for (let k = i; k >= 0; k = nodes[k].parent) { if (has(nodes[k], cls)) return true; } return false; };
  const out = [];
  nodes.forEach((n, i) => {
    const entry = boxOf[i];
    if (!entry || n.r.h <= 0 || n.r.h > MAX_BOX || Number(n.opacity) === 0 || scaled(i)) return;
    const texts = (tile.texts ?? []).filter(t => owner[t.node] === i && Number(t.opacity) !== 0 && !hidden(t) && (!entry.only || within(t.node, entry.only)));
    if (!texts.length) return;
    // One line: every text a single line box, all on one line.
    if (texts.some(t => new Set(t.lines.map(l => Math.round(l.y))).size > 1)) return;
    const mids = texts.map(t => (t.cap.top + t.cap.baseline) / 2);
    if (Math.max(...mids) - Math.min(...mids) > 3) return;
    let target = n.r;
    if (entry.against) {
      const part = kids[i].length ? nodes.findIndex((m, j) => j > i && has(m, entry.against) && (() => { for (let k = j; k >= 0; k = nodes[k].parent) if (k === i) return true; return false; })()) : -1;
      if (part < 0) return;
      target = nodes[part].r;
    }
    const centre = target.y + target.h / 2;
    out.push({ box: entry, node: i, h: target.h, offsets: texts.map(t => ({ text: t.text, offset: Math.round(((t.cap.top + t.cap.baseline) / 2 - centre) * 100) / 100 })) });
  });
  return out;
}

export const rules = [
  {
    id: "cap-centring", item: "B2.2", finding: "VA1, VA2, VN8, VS2", kind: "assert", expectedToday: "fail",
    title: `The cap box of a single-line label is centred in its control or row box within ${TOLERANCE} px`,
    attribute: v => ({ item: v.item, finding: v.finding }),
    run(families) {
      const violations = [];
      let checked = 0;
      const seen = new Map();
      for (const family of families) {
        const data = family.light ?? family.dark;
        // One violation per family and box kind: its tiles, and the offsets they show.
        const per = new Map();
        for (const tile of data.tiles) for (const found of capOffsets(tile)) {
          for (const { offset } of found.offsets) {
            checked++;
            const bucket = per.get(found.box.name) ?? { box: found.box, offsets: new Set(), bad: new Set(), tiles: new Set() };
            per.set(found.box.name, bucket);
            bucket.offsets.add(offset);
            if (Math.abs(offset) > TOLERANCE) { bucket.bad.add(offset); bucket.tiles.add(tile.id.slice(family.slug.length + 1)); }
          }
        }
        for (const [name, bucket] of per) {
          const all = [...bucket.offsets].sort((a, b) => a - b);
          seen.set(`${family.slug} · ${name}`, all);
          if (!bucket.bad.size) continue;
          const bad = [...bucket.bad].sort((a, b) => a - b);
          violations.push({ family: family.slug, part: name, value: bad, item: bucket.box.item ?? "B2.2", finding: bucket.box.finding ?? "VA1",
            detail: `offsets ${bad.join(", ")} in ${bucket.tiles.size} tile${bucket.tiles.size === 1 ? "" : "s"} (${[...bucket.tiles].slice(0, 3).join(", ")}${bucket.tiles.size > 3 ? " …" : ""})` });
        }
      }
      const exact = [...seen].filter(([, all]) => all.every(o => Math.abs(o) <= TOLERANCE)).length;
      return { checked, violations, summary: `${seen.size} family boxes, ${exact} exact`, table: Object.fromEntries(seen) };
    },
  },
];
