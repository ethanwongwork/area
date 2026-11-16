// Shared-part tables, recorded as snapshots today so any drift fails, and tightened by the plan items that write the
// rules: header bars (B4.1, VN7, G6), marks (B5.1, VS2), corners (A2, B1, VC3). Light; the lengths are the same in dark.

// The header bars: a bar across the top of a surface that holds its title, search or controls. (The Nav sidebar demo's
// header is an unclassed div and is not collected.)
export const BARS = [
  "area-panel__bar", "area-menu__header", "area-command-palette__search", "area-color-picker__header", "area-dialog__header",
  "area-drawer__header", "area-popover__header", "area-code-block__header", "area-board-column__header", "area-calendar__header",
  "area-edit-summary__head", "area-queue__head", "area-plan__head", "area-approval__head", "area-composer-group__header",
  "area-file-upload-item__header", "area-attachment__head",
];
export const MARKS = ["area-badge", "area-count", "area-tag", "area-kbd"];

const tokens = node => node.cls.split(/\s+/).filter(Boolean);
const sorted = set => [...set].sort((a, b) => (typeof a === "number" ? a - b : String(a).localeCompare(String(b))));
const descends = (tile, i, ancestor) => { for (let k = i; k >= 0; k = tile.nodes[k].parent) if (k === ancestor) return true; return false; };
const corner = radius => radius.every(r => r === radius[0]) ? radius[0] : radius.join(" ");

export const rules = [
  {
    id: "header-bars", item: "B4.1", finding: "VN7, G6", kind: "snapshot", expectedToday: "snapshot",
    title: "Each family's header bar heights (B4.1's two-bar rule is not built yet: the set is a snapshot)",
    run(families) {
      const values = {};
      const all = new Set();
      for (const family of families) for (const tile of (family.light ?? family.dark).tiles) for (const node of tile.nodes ?? []) {
        const bar = tokens(node).find(cls => BARS.includes(cls));
        if (!bar || node.r.h <= 0) continue;
        const key = `${family.slug} · ${bar}`;
        (values[key] ??= new Set()).add(node.r.h);
        all.add(node.r.h);
      }
      for (const key of Object.keys(values)) values[key] = sorted(values[key]);
      return { values, summary: `${Object.keys(values).length} bars, heights ${sorted(all).join(" / ")}` };
    },
  },
  {
    id: "marks", item: "B5.1", finding: "VS2, VS13, VS18, VS25", kind: "snapshot", expectedToday: "snapshot",
    title: "Badge, Count, Tag and Kbd per size, wherever they appear: heights, text size / line, corners (B5.1 will tighten to 14 / 18 / 22)",
    run(families) {
      const values = {};
      for (const family of families) for (const tile of (family.light ?? family.dark).tiles) (tile.nodes ?? []).forEach((node, i) => {
        const list = tokens(node);
        const mark = MARKS.find(cls => list.includes(cls));
        if (!mark || node.r.h <= 0) return;
        const size = list.find(cls => cls.startsWith(`${mark}--`) && /--(xs|sm|md|lg|xl)$/.test(cls))?.split("--")[1] ?? node.attrs?.["data-size"] ?? "default";
        const entry = values[`${mark.slice(5)} ${size}`] ??= { height: new Set(), text: new Set(), corner: new Set() };
        entry.height.add(node.r.h);
        entry.corner.add(corner(node.radius));
        for (const text of tile.texts ?? []) if (descends(tile, text.node, i)) entry.text.add(`${parseFloat(text.font.size)}/${parseFloat(text.font.lh) || text.font.lh}`);
      });
      for (const entry of Object.values(values)) for (const k of Object.keys(entry)) entry[k] = sorted(entry[k]);
      const heights = new Set(Object.values(values).flatMap(entry => entry.height));
      return { values, summary: `${Object.keys(values).length} mark sizes, heights ${sorted(heights).join(" / ")}` };
    },
  },
  {
    id: "corners", item: "A2, B1", finding: "VC3, VS1, VN9", kind: "snapshot", expectedToday: "snapshot",
    title: "Every family's corner per painted part (its own parts, and parts of no family of their own)",
    run(families) {
      const slugs = new Set(families.map(family => family.slug));
      const values = {};
      for (const family of families) for (const tile of (family.light ?? family.dark).tiles) for (const node of tile.nodes ?? []) {
        if (!node.paints && node.shadow === "none") continue;
        const part = tokens(node).find(cls => /^area-[a-z0-9-]+(__[a-z0-9-]+)?$/.test(cls));
        if (!part) continue;
        const block = part.slice(5).split("__")[0];
        // A part of another family is that family's to report.
        if (block !== family.slug && slugs.has(block)) continue;
        (values[`${family.slug} · ${part}`] ??= new Set()).add(corner(node.radius));
      }
      for (const key of Object.keys(values)) values[key] = sorted(values[key]);
      const distinct = new Set(Object.values(values).flat());
      return { values, summary: `${Object.keys(values).length} parts, ${distinct.size} distinct corners` };
    },
  },
];
