// Runs in the page: in every list-like container (menu, nav, list box, tree view, command palette, table of contents,
// description list, select list), the x where each row's label text starts, relative to the container, grouped by
// whether the row leads with a visual. A ragged column is more than one start among rows of one kind, or rows without a
// visual starting off both the icon column and the label column.
(() => {
  for (const s of document.querySelectorAll(".gallery-tile__stage, .gallery-tile__view")) s.style.zoom = "1";
  const firstText = el => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (n.textContent.trim() && n.parentElement.getBoundingClientRect().width) return n; };
  const lists = document.querySelectorAll(".studio-canvas__body :is(.area-menu, .area-nav, .area-list-box, .area-tree-view, .area-command-palette, .area-table-of-contents, .area-description-list)");
  const rowSel = ".area-menu__item, .area-nav__item, .area-list-box__item, .area-tree-view__row, .area-tree-view__item, .area-table-of-contents__item, .area-description-list__item";
  const out = [];
  for (const list of lists) {
    const lr = list.getBoundingClientRect(); if (!lr.width) continue;
    const rows = [...list.querySelectorAll(rowSel)].filter(r => r.getBoundingClientRect().height && r.closest(".area-menu, .area-nav, .area-list-box, .area-tree-view, .area-command-palette, .area-table-of-contents, .area-description-list") === list);
    if (rows.length < 2) continue;
    const data = rows.map(r => {
      const vis = r.querySelector(":scope > svg, :scope > [class*='__icon'], :scope > [class*='__check']:first-child, :scope > [class*='__avatar'], :scope > [class*='__visual'], :scope > [class*='__swatch']");
      const tn = firstText(r); if (!tn) return null;
      const range = document.createRange(); range.selectNodeContents(tn);
      const x = range.getClientRects()[0]?.left - lr.left;
      const depth = r.getAttribute("aria-level") ?? (r.closest("[class*='__group--nested'], [role='group'] [role='group']") ? "n" : "0");
      return { visual: Boolean(vis && vis.getBoundingClientRect().left < range.getClientRects()[0].left), x: Math.round(x * 10) / 10, depth };
    }).filter(Boolean);
    const tile = list.closest(".gallery-tile")?.querySelector(".gallery-tile__label, .gallery-tile__title")?.textContent.trim();
    const groups = {};
    for (const d of data) (groups[`${d.visual ? "icon" : "text"}@${d.depth}`] ??= new Set()).add(d.x);
    out.push({ tile, list: [...list.classList].slice(0, 2).join("."), columns: Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, [...v]])) });
  }
  return { findings: out };
})()
