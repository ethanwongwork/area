// The app's chrome on the current page, as drawn: each element's box and type, so two builds can be compared.
(() => {
  const chrome = ".gallery-tile__head, .gallery-tile__caption, .studio-section-heading, .studio-canvas__actions, .studio-stage__head, .studio-type-row__head, .studio-overview__group-label, .studio-overview__more, .studio-lede, .studio-canvas__crumbs, .setup-stage__lead, .area-code-block, .studio-section, .area-tabs";
  const els = [...document.querySelectorAll(chrome)];
  const round = n => Math.round(n * 10) / 10;
  const rows = els.map(el => {
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    return [el.className.toString().split(" ")[0], round(r.x), round(r.y), round(r.width), round(r.height), cs.fontSize, cs.lineHeight, cs.paddingTop, cs.paddingLeft, cs.getPropertyValue("--area-ui-row").trim()].join("|");
  });
  return { label: document.querySelector(".studio-canvas")?.getAttribute("aria-label"), count: rows.length, rows };
})()
