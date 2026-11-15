// Gallery rules: what the Overview's own tiles must get right so a good component never looks unfinished (plan F3.1,
// F3.2, F3.3; README §1 "Nothing rendered is tested"). Light theme; the gallery is the same in dark.

// Words that really begin with "a" and appear in tile names. Anything else matching \ba[a-z]{3,} is a lost space
// ("In adialog" from inADialog). Add a word here only when it is one.
const A_WORDS = new Set(["about", "above", "absolute", "accent", "accept", "account", "action", "actions", "active", "activity",
  "adaptive", "added", "adding", "address", "adjust", "after", "again", "agent", "ahead", "alert", "alerts", "align", "aligned",
  "alignment", "alignments", "all", "along", "alpha", "also", "alternate", "always", "amount", "anchor", "anchored", "angle",
  "animated", "answer", "answered", "anywhere", "append", "approval", "approve", "approved", "arrow", "arrows", "article", "ascending",
  "aside", "aspect", "asset", "assets", "assistant", "async", "attach", "attached", "attachment", "attachments", "author", "auto",
  "autofocus", "automatic", "available", "avatar", "avatars", "away", "affix", "affixes", "area", "arranged", "arrangement", "alone", "aloud", "already", "alt", "amber", "and", "any", "apply", "applied", "april", "aqua"]);

// Tiles whose name says "wrap" in another sense: Skeleton's wrap mode wraps a component, it does not wrap lines.
const OTHER_WRAP = new Set(["skeleton/wrap"]);

const lostSpace = label => [...label.matchAll(/\ba([a-z]{3,})/g)].map(m => m[0]).filter(word => !A_WORDS.has(word));
const unbalanced = label => (label.match(/\(/g) ?? []).length !== (label.match(/\)/g) ?? []).length;
const lineCount = text => new Set(text.lines.map(line => Math.round(line.y))).size;

export const rules = [
  {
    id: "tile-names", item: "F3.1", finding: "VN25, VS5", kind: "assert", expectedToday: "fail",
    title: "Tile names keep the space after “a” (no \\ba[a-z]{3,} that is not a word) and balance their parentheses",
    attribute: () => ({ item: "F3.1", finding: "VS5" }),
    run(families) {
      const violations = [];
      let checked = 0;
      for (const family of families) for (const tile of (family.light ?? family.dark).tiles) {
        checked++;
        const lost = lostSpace(tile.label);
        if (lost.length) violations.push({ family: family.slug, tile: tile.id.slice(family.slug.length + 1), part: "space", value: tile.label, detail: `“${tile.label}”: ${lost.join(", ")}` });
        if (unbalanced(tile.label)) violations.push({ family: family.slug, tile: tile.id.slice(family.slug.length + 1), part: "parentheses", value: tile.label, detail: `“${tile.label}”: unbalanced parentheses` });
      }
      return { checked, violations };
    },
  },
  {
    id: "wrap-tiles", item: "F3.3", finding: "VC9", kind: "assert", expectedToday: "fail",
    title: "A tile whose name says it wraps shows two or more rows of line boxes; a rendered sentence that says it wraps has two or more lines",
    attribute: () => ({ item: "F3.3", finding: "VC9" }),
    run(families) {
      const violations = [];
      let checked = 0;
      for (const family of families) for (const tile of (family.light ?? family.dark).tiles) {
        const tileId = tile.id.slice(family.slug.length + 1);
        const texts = tile.texts ?? [];
        if (/\bwrap/i.test(tile.label) && !OTHER_WRAP.has(`${family.slug}/${tileId}`)) {
          checked++;
          // The tile's line boxes: every text's lines, by their row.
          // A specimen with no text (Skeleton's bars) is read by the rows of its painted leaves.
          const nodes = tile.nodes ?? [];
          const parents = new Set(nodes.map(n => n.parent));
          const rows = new Set(texts.length ? texts.flatMap(text => text.lines.map(line => Math.round(line.y)))
            : nodes.filter((n, i) => n.paints && !parents.has(i) && n.r.w > 0 && n.r.h > 0).map(n => Math.round(n.r.y)));
          if (rows.size < 2) violations.push({ family: family.slug, tile: tileId, part: "name", value: rows.size, detail: `“${tile.label}”: ${rows.size} line box row` });
        }
        // A sentence that says it wraps ("Title that wraps onto a second line"), not a control named Wrap.
        for (const text of texts) if (/\bwraps\b/i.test(text.text)) {
          checked++;
          const lines = lineCount(text);
          if (lines < 2) violations.push({ family: family.slug, tile: tileId, part: "text", value: lines, detail: `“${text.text.slice(0, 50)}” on ${lines} line (${text.box.w} wide)` });
        }
      }
      return { checked, violations };
    },
  },
];
