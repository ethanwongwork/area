// Specimen rules: every tile's specimen is drawn inside its card, and something is drawn (plan F3.2, F1).

const NOT_DRAWN = new Set(["style", "script", "template", "link", "meta"]);

export const rules = [
  {
    id: "extent", item: "F3.2", finding: "VC8, VN26, VA4, VA5", kind: "assert", expectedToday: "fail",
    title: "No painted box of a specimen lies outside its gallery card (the box the card's frame and view clip it to), by more than 0.5 px",
    attribute: () => ({ item: "F3.2", finding: "VC8" }),
    run(families) {
      const violations = [];
      let checked = 0;
      for (const family of families) for (const tile of (family.light ?? family.dark).tiles) {
        if (tile.missing) continue;
        checked++;
        if (!tile.cutCount) continue;
        const c = tile.clip;
        const over = Math.max(...tile.cut.map(b => Math.max(c.x - b.x, c.y - b.y, b.x + b.w - (c.x + c.w), b.y + b.h - (c.y + c.h))));
        violations.push({ family: family.slug, tile: tile.id.slice(family.slug.length + 1), value: Math.round(over * 10) / 10, detail: `${tile.cutCount} painted boxes outside the card, up to ${over.toFixed(1)} px` });
      }
      return { checked, violations };
    },
  },
  {
    id: "visible-at-rest", item: "F3.3", finding: "VA5, VA6", kind: "assert", expectedToday: "fail",
    title: "No specimen at opacity 0, hidden or of zero size at rest: neither a stage root nor a component root (the outermost element with an Area class); a closed overlay (a tooltip, a dialog) is not a specimen",
    attribute: v => ({ item: "F3.3", finding: v.detail?.includes("slider") ? "VA5" : "VA6" }),
    run(families) {
      const violations = [];
      let checked = 0;
      for (const family of families) for (const theme of ["light", "dark"]) {
        const data = family[theme];
        if (!data) continue;
        for (const tile of data.tiles) {
          const tileId = tile.id.slice(family.slug.length + 1);
          if (tile.missing) { violations.push({ family: family.slug, tile: tileId, theme, detail: "no stage" }); continue; }
          const nodes = tile.nodes ?? [];
          const roots = nodes.map((n, i) => [n, i]).filter(([n]) => n.depth === 0 && !NOT_DRAWN.has(n.tag));
          if (!roots.length) { violations.push({ family: family.slug, tile: tileId, theme, detail: "an empty stage" }); continue; }
          const component = cls => /^area-[a-z0-9-]+$/.test(cls.split(/\s+/)[0] ?? "");
          const closed = n => n.tag === "dialog" || /(^|\s)area-(tooltip|hover-card)(\s|$)/.test(n.cls) || n.attrs?.popover !== undefined;
          const underComponent = i => { for (let k = nodes[i].parent; k >= 0; k = nodes[k].parent) if (component(nodes[k].cls)) return true; return false; };
          const underClosed = i => { for (let k = i; k >= 0; k = nodes[k].parent) if (closed(nodes[k])) return true; return false; };
          const judged = new Map();
          for (const [n, i] of roots) judged.set(i, "stage root");
          nodes.forEach((n, i) => { if (component(n.cls) && !underComponent(i)) judged.set(i, "component root"); });
          for (const [i, what] of judged) {
            const n = nodes[i];
            if (underClosed(i)) continue;
            checked++;
            let problem;
            if (Number(n.opacity) === 0) problem = "opacity 0";
            else if (n.visibility === "hidden") problem = "visibility hidden";
            else if (n.display === "contents") {
              if (!nodes.some((m, j) => m.parent === i && m.r.w > 0 && m.r.h > 0 && Number(m.opacity) > 0)) problem = "contents with nothing drawn";
            } else if (n.r.w <= 0 || n.r.h <= 0) problem = `zero size (${n.r.w} × ${n.r.h})`;
            if (problem) violations.push({ family: family.slug, tile: tileId, theme, part: `${what} ${n.tag}.${n.cls.split(/\s+/)[0] || "-"}`, detail: `${n.tag}.${n.cls.split(/\s+/).slice(0, 2).join(".")}: ${problem}` });
          }
        }
      }
      return { checked, violations };
    },
  },
];
