// ============================================================
// REASSIGN TEXT STYLES — One-off script
// Paste into: Plugins › Development › Open Console
// Walks all text nodes and assigns the closest text style
// based on font size, weight, and family.
// Run AFTER figma-sync.js has created the text styles.
// ============================================================

(async () => {

const styles = await figma.getLocalTextStylesAsync();
if (!styles.length) { console.error("No text styles found. Run figma-sync.js first."); return; }

const fontsNeeded = new Set();
for (const s of styles) fontsNeeded.add(JSON.stringify(s.fontName));
for (const f of fontsNeeded) {
  try { await figma.loadFontAsync(JSON.parse(f)); } catch(e) {}
}

const styleIndex = styles.map(s => ({
  id: s.id,
  name: s.name,
  fontSize: s.fontSize,
  lineHeight: s.lineHeight.unit === "PIXELS" ? s.lineHeight.value : s.fontSize * 1.4,
  weight: s.fontName.style === "Bold" ? 700 : s.fontName.style === "Medium" ? 500 : 400,
  family: s.fontName.family
}));

function closestStyle(fontSize, weight, family) {
  let best = null, bestScore = Infinity;
  const isDM = family.includes("Mono") ? "DM Mono" : "DM Sans";
  for (const s of styleIndex) {
    const familyMatch = s.family === isDM ? 0 : 100;
    const sizeDiff = Math.abs(s.fontSize - fontSize);
    const weightDiff = Math.abs(s.weight - weight) / 100;
    const score = familyMatch + sizeDiff * 10 + weightDiff;
    if (score < bestScore) { bestScore = score; best = s; }
  }
  return best;
}

function getWeight(styleName) {
  if (/bold/i.test(styleName) || /black/i.test(styleName)) return 700;
  if (/semi\s?bold/i.test(styleName)) return 600;
  if (/medium/i.test(styleName)) return 500;
  if (/light/i.test(styleName)) return 300;
  return 400;
}

function walkNodes(node) {
  const texts = [];
  if (node.type === "TEXT") texts.push(node);
  if ("children" in node) {
    for (const child of node.children) texts.push(...walkNodes(child));
  }
  return texts;
}

const allTexts = walkNodes(figma.currentPage);
let assigned = 0, skipped = 0, errors = 0;

for (const node of allTexts) {
  try {
    if (node.textStyleId && typeof node.textStyleId === "string" && node.textStyleId !== "") {
      skipped++;
      continue;
    }

    const len = node.characters.length;
    if (len === 0) { skipped++; continue; }

    const fs = node.getRangeFontSize(0, len);
    const fn = node.getRangeFontName(0, len);

    if (fs === figma.mixed || fn === figma.mixed) {
      skipped++;
      continue;
    }

    await figma.loadFontAsync(fn);

    const weight = getWeight(fn.style);
    const match = closestStyle(fs, weight, fn.family);

    if (match) {
      node.textStyleId = match.id;
      assigned++;
    } else {
      skipped++;
    }
  } catch(e) {
    errors++;
  }
}

console.log(`Done — ${assigned} text nodes assigned, ${skipped} skipped, ${errors} errors`);
figma.notify(`✓ Reassigned ${assigned} text nodes to updated styles`);

})();
