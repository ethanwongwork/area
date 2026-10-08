// Area structure capture. One measurement routine for Area specimens and reference pages.
// Classic script: load it in the gallery, or paste/inject its full text into any page.
// Read-only: it never changes the inspected page's styles, DOM or application state.
//   const el = await areaCapture.pick();                    // click an element; Escape cancels
//   const cap = areaCapture.capture(el, { source: 'notion', variant: 'count', theme: 'light',
//     state: 'rest', slots: { shell: el, text: 'span' } });  // slot selectors resolve inside el
//   JSON.stringify(cap)   // save verbatim; the checksum field verifies the copy
//   areaCapture.markdown(cap)
// Off localhost, text, ids, labels and data-* values are redacted unless { redact: false }.
(function areaCaptureInstall() {
  const VERSION = 1;
  const round = v => Math.round(v * 100) / 100;
  const px = v => Number.parseFloat(v) || 0;
  const sides = (s, f) => ['Top', 'Right', 'Bottom', 'Left'].map(side => round(px(s.getPropertyValue(f(side)))));
  // FNV-1a over UTF-16 code units. scripts/capture-compare.mjs recomputes it, so a capture
  // copied out of a browser tool into a file is rejected if a single character changed.
  const fnv = text => { let h = 0x811c9dc5; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
  const quad = a => a.every(v => v === a[0]) ? String(a[0]) : a.join(' ');
  const hidden = s => s.display === 'none' || s.visibility === 'hidden';
  // Redaction keeps structure and styles but drops content that could identify a person.
  let redact = false;
  const name = el => el.localName + (el.id && !redact ? '#' + el.id : '') + [...el.classList].slice(0, 6).map(c => '.' + c).join('');
  const PRIVATE_ATTR = /^(aria-label|aria-labelledby|aria-describedby|aria-description|aria-valuetext|title|alt|data-)/;

  // Values worth recording when they differ from the listed default. Order is the report order.
  const PROPS = [
    ['display'], ['position', 'static'], ['box-sizing'], ['flex-direction', 'row'], ['flex-wrap', 'nowrap'],
    ['align-items', 'normal'], ['justify-content', 'normal'], ['row-gap', 'normal'], ['column-gap', 'normal'],
    ['grid-template-columns', 'none'], ['grid-template-rows', 'none'], ['flex', '0 1 auto'], ['align-self', 'auto'],
    ['top', 'auto'], ['right', 'auto'], ['bottom', 'auto'], ['left', 'auto'],
    ['transform', 'none'], ['z-index', 'auto'], ['overflow', 'visible'],
    ['vertical-align', 'baseline'], ['min-width', 'auto'], ['min-height', 'auto'], ['max-width', 'none'],
    ['border-top-left-radius', '0px'], ['border-top-right-radius', '0px'], ['border-bottom-right-radius', '0px'],
    ['border-bottom-left-radius', '0px'], ['background-color', 'rgba(0, 0, 0, 0)'], ['background-image', 'none'],
    ['background-clip', 'border-box'], ['color'], ['opacity', '1'], ['box-shadow', 'none'], ['outline-style', 'none'],
    ['outline-width'], ['outline-offset', '0px'], ['outline-color'], ['fill'], ['stroke', 'none'], ['stroke-width', '1px'],
    ['font-family'], ['font-size'], ['font-weight'], ['line-height'], ['letter-spacing', 'normal'],
    ['text-transform', 'none'], ['font-feature-settings', 'normal'], ['font-variant-numeric', 'normal'],
    ['text-align', 'start'], ['white-space', 'normal'], ['text-overflow', 'clip'], ['-webkit-font-smoothing', 'auto'],
    ['cursor', 'auto'], ['transition-duration', '0s'], ['animation-name', 'none'], ['mix-blend-mode', 'normal'],
    ['backdrop-filter', 'none'], ['filter', 'none'], ['clip-path', 'none'],
  ];
  const INHERITED = new Set(['color', 'fill', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
    'text-transform', 'font-feature-settings', 'font-variant-numeric', 'text-align', 'white-space', 'cursor',
    '-webkit-font-smoothing', 'stroke', 'stroke-width']);

  // Paint layers that draw nothing, such as the transparent rings utility frameworks stack.
  const EMPTY_SHADOW = /(^|,\s*)rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(?=,|$)/g;
  function styleOf(el, s, parent, all) {
    const out = {};
    const positioned = s.position !== 'static' && s.position !== 'relative';
    for (const [prop, initial] of PROPS) {
      let value = s.getPropertyValue(prop).trim();
      if (!value) continue;
      if (all) { out[prop] = value; continue; }
      if (prop === 'box-shadow' && value !== 'none') value = value.replace(EMPTY_SHADOW, '').replace(/^,\s*/, '') || 'none';
      if (prop === 'background-clip' && /^border-box(, border-box)*$/.test(value)) continue;
      if (['top', 'right', 'bottom', 'left'].includes(prop) && !positioned && (s.position === 'static' || value === '0px')) continue;
      if (['min-width', 'min-height'].includes(prop) && value === '0px') continue;
      if (['fill', 'stroke', 'stroke-width'].includes(prop) && !(el instanceof SVGElement)) continue;
      if (initial !== undefined && value === initial) continue;
      if (INHERITED.has(prop) && parent && parent.getPropertyValue(prop).trim() === value) continue;
      if (prop.startsWith('outline-') && prop !== 'outline-style' && s.outlineStyle === 'none') continue;
      out[prop] = value;
    }
    return out;
  }

  // Font metrics from the used font: cap and x-height tops relative to the text baseline.
  const canvas = document.createElement('canvas').getContext('2d');
  function metrics(s) {
    canvas.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    const m = canvas.measureText('H'), x = canvas.measureText('x');
    return { ascent: m.fontBoundingBoxAscent, descent: m.fontBoundingBoxDescent, cap: m.actualBoundingBoxAscent, x: x.actualBoundingBoxAscent };
  }

  // Direct text of an element: each rendered line with baseline, cap top and horizontal extent.
  function textOf(el, s, origin) {
    const nodes = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
    if (!nodes.length) return undefined;
    const f = metrics(s), lines = [];
    for (const node of nodes) {
      const range = document.createRange(); range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        if (!r.width) continue;
        // Canvas rounds the font box (SF 14px reports ascent 14 for about 13.3), so place the baseline
        // by the ascent's share of the rendered content box instead (tag audit, 2026-10-07).
        const share = f.ascent + f.descent ? r.height / (f.ascent + f.descent) : 1;
        const baseline = r.top + f.ascent * share;
        lines.push({ left: round(r.left - origin.left), right: round(r.right - origin.left),
          baseline: round(baseline - origin.top), capTop: round(baseline - f.cap - origin.top),
          xTop: round(baseline - f.x - origin.top), descent: round(baseline + f.descent * share - origin.top) });
      }
    }
    const content = nodes.map(n => n.textContent.trim()).join(' ');
    return { content: redact ? `[${content.length} chars]` : content.slice(0, 80), capHeight: round(f.cap),
      xHeight: round(f.x), lines };
  }

  // SVG viewport, drawn geometry and ink bounds converted to CSS pixels.
  function svgOf(el, rect, origin) {
    if (!(el instanceof SVGSVGElement)) return undefined;
    const vb = el.viewBox.baseVal, out = { viewBox: el.getAttribute('viewBox'), width: el.getAttribute('width'),
      height: el.getAttribute('height'), shapes: el.querySelectorAll('path,circle,rect,ellipse,line,polyline,polygon,use').length };
    try {
      const b = el.getBBox(), sx = vb && vb.width ? rect.width / vb.width : 1, sy = vb && vb.height ? rect.height / vb.height : 1;
      const ox = vb ? vb.x : 0, oy = vb ? vb.y : 0;
      out.ink = [round(rect.left - origin.left + (b.x - ox) * sx), round(rect.top - origin.top + (b.y - oy) * sy), round(b.width * sx), round(b.height * sy)];
    } catch { /* detached or non-rendered SVG */ }
    return out;
  }

  function pseudoOf(el) {
    const out = {};
    for (const p of ['::before', '::after']) {
      const s = getComputedStyle(el, p);
      if (['none', 'normal'].includes(s.content)) continue;
      out[p] = { content: s.content, size: `${s.width} × ${s.height}`, position: s.position,
        inset: [s.top, s.right, s.bottom, s.left].join(' '), radius: s.borderRadius, background: s.backgroundColor,
        border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`, shadow: s.boxShadow, transform: s.transform, opacity: s.opacity };
    }
    return Object.keys(out).length ? out : undefined;
  }

  function attrsOf(el) {
    const out = {};
    for (const a of el.attributes) if (/^(role|aria-|data-|disabled|type|tabindex|title|alt$)/.test(a.name)) out[a.name] = redact && PRIVATE_ATTR.test(a.name) ? '[redacted]' : a.value.slice(0, 80);
    return Object.keys(out).length ? out : undefined;
  }

  // Declared values from readable stylesheets: exposes the page's own tokens and utility names.
  // Cross-origin sheets without CORS cannot be read; the result records how many were skipped.
  function rulesOf(el) {
    const found = [], skipped = { sheets: 0 };
    const visit = (list, context) => {
      for (const rule of list) {
        if (rule.cssRules && !(rule instanceof CSSStyleRule)) {
          if (rule.media && !matchMedia(rule.media.mediaText).matches) continue;
          visit(rule.cssRules, rule.conditionText || rule.name || context);
        } else if (rule instanceof CSSStyleRule) {
          let hit = false;
          try { hit = el.matches(rule.selectorText); } catch { /* unsupported selector */ }
          if (hit && found.length < 40) found.push({ selector: rule.selectorText.slice(0, 160), context, declarations: rule.style.cssText.slice(0, 600) });
          if (rule.cssRules?.length) visit(rule.cssRules, context);
        }
      }
    };
    for (const sheet of document.styleSheets) {
      try { visit(sheet.cssRules, undefined); } catch { skipped.sheets++; }
    }
    return { rules: found, skippedSheets: skipped.sheets };
  }

  function resolve(root, target) {
    if (!target) return null;
    if (target instanceof Element) return target;
    return root.matches(target) ? root : root.querySelector(target);
  }

  function capture(root, options = {}) {
    if (!(root instanceof Element)) throw new TypeError('areaCapture.capture needs an Element');
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || location.protocol === 'file:';
    const { depth = 8, all = false, rules = false, maxNodes = 200 } = options;
    redact = options.redact ?? !local;
    const origin = root.getBoundingClientRect();
    const nodes = [], index = new Map();
    const visit = (el, level, parentStyle, parentRect, parentIndex) => {
      if (nodes.length >= maxNodes || level > depth) return;
      const s = getComputedStyle(el);
      if (hidden(s)) return;
      const r = el.getBoundingClientRect();
      const border = sides(s, side => `border-${side.toLowerCase()}-width`);
      const node = {
        i: nodes.length, parent: parentIndex, depth: level, el: name(el),
        box: [round(r.left - origin.left), round(r.top - origin.top), round(r.width), round(r.height)],
        // Distance from the parent's outer border edge: the full optical inset of this layer.
        edge: parentRect ? [round(r.top - parentRect.top), round(parentRect.right - r.right), round(parentRect.bottom - r.bottom), round(r.left - parentRect.left)] : undefined,
        padding: quad(sides(s, side => `padding-${side.toLowerCase()}`)),
        border: quad(border), borderStyle: border.some(Boolean) ? s.borderTopStyle : undefined,
        borderColor: border.some(Boolean) ? s.borderTopColor : undefined,
        margin: quad(sides(s, side => `margin-${side.toLowerCase()}`)),
        style: styleOf(el, s, parentStyle, all),
        text: textOf(el, s, origin), svg: svgOf(el, r, origin), pseudo: pseudoOf(el), attrs: attrsOf(el),
        rules: rules ? rulesOf(el) : undefined,
      };
      for (const key of Object.keys(node)) if (node[key] === undefined || node[key] === '0' && ['padding', 'border', 'margin'].includes(key)) delete node[key];
      nodes.push(node); index.set(el, node.i);
      for (const child of el.children) visit(child, level + 1, s, r, node.i);
    };
    // The root records inherited values too, so every capture is self-contained.
    visit(root, 0, null, null, undefined);
    const slots = {};
    for (const [slot, target] of Object.entries(options.slots || {})) {
      const el = resolve(root, target);
      slots[slot] = el && index.has(el) ? index.get(el) : null;
    }
    const scheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const result = {
      tool: 'area-capture', version: VERSION, fingerprint: fingerprint(),
      meta: { source: options.source ?? location.hostname, variant: options.variant ?? null, state: options.state ?? 'rest',
        theme: options.theme ?? scheme, note: options.note ?? null, redacted: redact,
        url: redact ? location.origin : location.origin + location.pathname, title: redact ? null : document.title,
        captured: new Date().toISOString(), viewport: [innerWidth, innerHeight], devicePixelRatio: devicePixelRatio,
        // Browser zoom is not exposed to pages; outer/inner width approximates it in a normal window.
        zoom: innerWidth && outerWidth ? round(outerWidth / innerWidth) : null, visualScale: visualViewport?.scale ?? null, userAgent: navigator.userAgent },
      slots, nodes,
    };
    result.checksum = fnv(JSON.stringify(result));
    return result;
  }

  function markdown(cap) {
    const slotOf = new Map(Object.entries(cap.slots).filter(([, i]) => i !== null).map(([k, i]) => [i, k]));
    const head = `**${cap.meta.source}** · ${cap.meta.variant ?? 'default'} · ${cap.meta.state} · ${cap.meta.theme} · ${cap.meta.url}`;
    const rows = cap.nodes.map(n => {
      const s = n.style, t = n.text?.lines?.[0];
      const radius = [s['border-top-left-radius'], s['border-top-right-radius'], s['border-bottom-right-radius'], s['border-bottom-left-radius']].filter(Boolean);
      return ['  '.repeat(n.depth) + (slotOf.has(n.i) ? `**${slotOf.get(n.i)}** ` : '') + '`' + n.el.slice(0, 60) + '`',
        `${n.box[2]}×${n.box[3]}`, n.edge ? n.edge.join(' ') : '', n.padding ?? '0', n.border ? `${n.border} ${n.borderColor}` : '',
        radius.length ? [...new Set(radius)].join(' ') : '', [s['row-gap'], s['column-gap']].filter(Boolean).join(' / '),
        s['font-size'] ? `${s['font-size']}/${s['line-height'] ?? ''} ${s['font-weight'] ?? ''}` : '',
        [s['background-color'] && 'bg ' + s['background-color'], s.color && 'fg ' + s.color].filter(Boolean).join(', '),
        s['box-shadow'] ?? '', t ? `cap ${t.capTop}–base ${t.baseline}` : n.svg ? `vb ${n.svg.viewBox}${n.svg.ink ? ' ink ' + n.svg.ink.join(',') : ''}` : ''].join(' | ');
    });
    return [head, '', '| layer | size | edge t r b l | padding | border | radius | gap | type | paint | shadow | text/svg |',
      '|---|---|---|---|---|---|---|---|---|---|---|', ...rows.map(r => `| ${r} |`)].join('\n');
  }

  // Interactive picker for pages without selectors: outlines the hovered element; click selects.
  // Shift+Up/Down move the highlight to the parent/first child before clicking or pressing Enter.
  function pick() {
    return new Promise((done, fail) => {
      const box = document.createElement('div');
      Object.assign(box.style, { position: 'fixed', pointerEvents: 'none', zIndex: 2147483647, outline: '2px solid #f0f', outlineOffset: '0', background: 'rgba(255,0,255,.08)' });
      document.documentElement.append(box);
      let current = null;
      const show = el => { current = el; const r = el.getBoundingClientRect(); Object.assign(box.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' }); box.title = name(el); };
      const stop = event => { event.preventDefault(); event.stopImmediatePropagation(); };
      const finish = el => { removeEventListener('pointermove', move, true); removeEventListener('click', click, true); removeEventListener('pointerdown', stop, true); removeEventListener('keydown', key, true); box.remove(); el ? done(el) : fail(new Error('Pick cancelled')); };
      const move = event => { if (event.target instanceof Element && event.target !== box) show(event.target); };
      const click = event => { stop(event); finish(current || event.target); };
      const key = event => {
        if (event.key === 'Escape') { stop(event); finish(null); }
        else if (event.key === 'Enter' && current) { stop(event); finish(current); }
        else if (event.shiftKey && event.key === 'ArrowUp' && current?.parentElement) { stop(event); show(current.parentElement); }
        else if (event.shiftKey && event.key === 'ArrowDown' && current?.firstElementChild) { stop(event); show(current.firstElementChild); }
      };
      addEventListener('pointermove', move, true); addEventListener('pointerdown', stop, true); addEventListener('click', click, true); addEventListener('keydown', key, true);
    });
  }

  // Hash of this installer's source text: a pasted copy must match `node scripts/capture-compare.mjs --fingerprint`.
  function fingerprint() { return fnv(areaCaptureInstall.toString()); }

  globalThis.areaCapture = { version: VERSION, fingerprint, capture, markdown, pick, rules: rulesOf, metrics: el => metrics(getComputedStyle(el)) };
})();
