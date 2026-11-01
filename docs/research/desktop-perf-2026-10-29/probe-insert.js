// The cost of a page's elements arriving: the Canvas body's content taken out and put back, then a layout forced.
// Then the same with groups of CSS rules removed, to find which rules make arriving elements slow.
(() => {
  const body = document.querySelector(".studio-canvas__body");
  const content = body.firstElementChild;
  const time = fn => { const t = performance.now(); fn(); return Math.round(performance.now() - t); };
  const reinsert = () => { const parent = content.parentNode; parent.removeChild(content); void document.body.offsetHeight; return time(() => { parent.appendChild(content); void document.body.offsetHeight; }); };
  const runs = n => { const list = []; for (let i = 0; i < n; i++) list.push(reinsert()); return list.sort((a, b) => a - b)[Math.floor(n / 2)]; };
  const result = { label: document.querySelector(".studio-canvas")?.getAttribute("aria-label"), all: runs(3) };
  // Rules by kind, removed (and put back) one group at a time.
  const collect = test => {
    const found = [];
    const walk = (list, owner) => { for (let i = list.length - 1; i >= 0; i--) { const rule = list[i]; if (rule.cssRules && !(rule instanceof CSSStyleRule)) walk(rule.cssRules, rule); if (rule instanceof CSSStyleRule && test(rule.selectorText)) found.push({ owner, index: i, text: rule.cssText }); } };
    for (const sheet of document.styleSheets) { try { walk(sheet.cssRules, sheet); } catch {} }
    return found;
  };
  const without = (name, test) => {
    const found = collect(test);
    for (const f of found) f.owner.deleteRule(f.index);
    const t = runs(3);
    for (const f of [...found].reverse()) f.owner.insertRule(f.text, f.index);
    result[name] = [t, found.length];
  };
  without("no :has()", s => s.includes(":has("));
  without("no :not()", s => s.includes(":not("));
  without("no :is()/:where()", s => s.includes(":is(") || s.includes(":where("));
  without("no [data-area-*]", s => /\[data-area-/.test(s));
  without("no attribute selectors", s => s.includes("["));
  // Per sheet.
  result.sheets = [...document.styleSheets].map(sheet => {
    const was = sheet.disabled;
    sheet.disabled = true;
    const t = runs(1);
    sheet.disabled = was;
    let count = 0; try { count = sheet.cssRules.length; } catch {}
    return [(sheet.href || "inline").split("/").slice(-2).join("/"), count, t];
  });
  return result;
})()
