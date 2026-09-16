/* Browser geometry regression: compare rendered edges, not CSS declarations. */
async function checkInsets() {
  await document.fonts.ready;
  const checks = [];
  const add = (el, kind, side, horizontal, top, bottom) => checks.push({
    component: el.className, profile: el.closest('section')?.querySelector('h2')?.textContent,
    kind, side, horizontal, top, bottom,
    error: Math.max(Math.abs(horizontal - top), Math.abs(top - bottom)),
  });
  const selectors = '.area-button,.area-input,.area-chip,.area-segmented__item,.area-nav__item,.area-menu__item,.area-badge,.area-token,.area-kbd,.area-tabs__tab,.area-panel__bar';
  for (const el of document.querySelectorAll(selectors)) {
    const rect = el.getBoundingClientRect();
    const rtl = getComputedStyle(el).direction === 'rtl';
    for (const [side, child] of [['start', el.firstElementChild], ['end', el.lastElementChild]]) {
      if (!child) continue;
      const shape = /__(icon|swatch|dot)$/.test(child.className) || child.matches('.area-button,.area-nav__trailing:has(> .area-badge),.area-menu__shortcut:has(> .area-kbd)');
      const text = /__(label|text|key|title)$/.test(child.className);
      if (!shape && !text) continue;
      // Flexible rows intentionally reserve extra interior space after their text.
      if (text && !el.matches('.area-button,.area-chip,.area-segmented__item,.area-badge,.area-token,.area-kbd,.area-tabs__tab,.area-panel__bar')) continue;
      const c = child.getBoundingClientRect(), style = getComputedStyle(child);
      const horizontal = (side === 'start' ? !rtl : rtl) ? c.left - rect.left : rect.right - c.right;
      add(el, shape ? 'shape' : 'text', side, horizontal,
        c.top - rect.top + (text ? parseFloat(style.paddingTop) : 0),
        rect.bottom - c.bottom + (text ? parseFloat(style.paddingBottom) : 0));
    }
  }
  // Background chevrons have no DOM rectangle: compare their resolved viewport
  // inset with the independently measured vertical clearance of the select box.
  for (const el of document.querySelectorAll('.area-select')) {
    const s = getComputedStyle(el), h = el.getBoundingClientRect().height;
    const size = parseFloat(s.backgroundSize), desired = (h - size) / 2;
    const pos = s.backgroundPositionX;
    const offset = parseFloat(pos.match(/([\d.]+)px/)?.[1]);
    add(el, 'native-chevron', 'end', offset + parseFloat(s.borderInlineEndWidth), desired, desired);
  }
  // Multiline content aligns to its first cap line, never the whole paragraph.
  for (const el of document.querySelectorAll('.area-alert,.area-toast,.area-checkbox,.area-radio,.area-switch')) {
    const icon = el.querySelector('.area-alert__icon,.area-toast__icon,input');
    const first = el.querySelector('.area-alert__title,.area-alert__description,.area-toast > div,.area-choice-label__title');
    if (!icon || !first) continue;
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;block-size:1cap;inline-size:0';
    first.append(probe);
    const cap = probe.getBoundingClientRect().height;
    probe.remove();
    const i = icon.getBoundingClientRect(), t = first.getBoundingClientRect(), r = el.getBoundingClientRect();
    const textCenter = t.top + cap / 2;
    const iconCenter = i.top + i.height / 2;
    add(el, 'first-line', 'center', textCenter, iconCenter, iconCenter);
    if (el.matches('.area-alert,.area-toast')) {
      const rtl = getComputedStyle(el).direction === 'rtl';
      const inline = rtl ? r.right - i.right : i.left - r.left;
      const top = i.top - r.top;
      add(el, 'multiline-inset', 'start', inline, top, top);
    }
  }
  // Equal named tiers must carry the same icon box, text size and internal gap.
  for (const row of document.querySelectorAll('.specimen-row')) {
    const reference = row.querySelector('.area-button:has(> .area-button__icon)');
    if (!reference) continue;
    const icon = reference.querySelector('.area-button__icon').getBoundingClientRect().height;
    const refStyle = getComputedStyle(reference);
    for (const select of row.querySelectorAll('.area-select')) {
      const style = getComputedStyle(select);
      const backgroundInset = parseFloat(style.backgroundPositionX.match(/([\d.]+)px/)?.[1]);
      const gap = parseFloat(style.paddingInlineEnd) - backgroundInset - parseFloat(style.backgroundSize);
      add(select, 'tier-gap', 'gap', gap, parseFloat(refStyle.gap), parseFloat(refStyle.gap));
      add(select, 'tier-type', 'size', parseFloat(style.fontSize), parseFloat(refStyle.fontSize), parseFloat(refStyle.fontSize));
    }
    for (const slot of row.querySelectorAll('.area-chip__swatch,.area-segmented__icon,.area-input__icon')) {
      const control = slot.parentElement, style = getComputedStyle(control);
      add(control, 'tier-icon', 'size', slot.getBoundingClientRect().height, icon, icon);
      add(control, 'tier-type', 'size', parseFloat(style.fontSize), parseFloat(refStyle.fontSize), parseFloat(refStyle.fontSize));
      add(control, 'tier-gap', 'gap', parseFloat(style.gap), parseFloat(refStyle.gap), parseFloat(refStyle.gap));
    }
  }
  const failures = checks.filter(c => !Number.isFinite(c.error) || c.error > 0.15);
  const result = { total: checks.length, failures, maxError: Math.max(...checks.map(c => c.error)),
    textBoxSupported: CSS.supports('text-box', 'trim-both cap alphabetic'),
    profiles: document.querySelectorAll('section').length,
    overflow: document.documentElement.scrollWidth > innerWidth,
    counts: Object.fromEntries(['shape','text','native-chevron','first-line','multiline-inset','tier-icon','tier-type','tier-gap'].map(kind => [kind, checks.filter(c=>c.kind===kind).length])) };
  window.insetResults = result;
  document.querySelector('#inset-result').textContent = JSON.stringify(result, null, 2);
}
document.querySelector('#run-insets').addEventListener('click', checkInsets);
