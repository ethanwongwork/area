#!/usr/bin/env node
/** Dependency-free, declaration-level inventory. Run from any directory with Node 22.18+. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const START_COMMIT = '7dae828e7af1daf9d26b663d34335121156606f7';
const output = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(output, '../../..');
const manifestFile = 'packages/styles/src/manifest.ts';
const cssRoot = 'packages/styles/src';
const tokenFile = 'packages/tokens/dist/tokens.json';
const categories = ['color', 'type', 'space', 'size', 'radius', 'stroke', 'elevation', 'motion', 'opacity', 'z-index', 'other'];
const sort = xs => [...new Set(xs)].sort();
const tidy = s => s.replace(/\s+/g, ' ').trim();
const sha = s => createHash('sha256').update(s).digest('hex');
const lineAt = (s, i) => s.slice(0, i).split('\n').length;
const sourceURL = (file, line) => `https://github.com/ethanwongwork/area/blob/${START_COMMIT}/${file}#L${line}`;
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

/** Balanced splitting: commas in functions, attributes and strings are not delimiters. */
export function split(s, delimiter = ',') {
  const result = []; let depth = 0, quote = '', start = 0;
  for (let i = 0; i <= s.length; i++) {
    const c = s[i];
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; continue; }
    if (c === '"' || c === "'") { quote = c; continue; }
    if (c === '(' || c === '[') depth++;
    if (c === ')' || c === ']') depth--;
    if (i === s.length || (c === delimiter && depth === 0)) { result.push(s.slice(start, i).trim()); start = i + 1; }
  }
  return result;
}
function closeParen(s, start) {
  let depth = 1, quote = '';
  for (let i = start + 1; i < s.length; i++) {
    const c = s[i];
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; continue; }
    if (c === '"' || c === "'") quote = c;
    else if (c === '(') depth++;
    else if (c === ')' && --depth === 0) return i;
  }
  throw new Error(`Unclosed function: ${s.slice(start)}`);
}

/** CSS structural scanner. Comments are retained with offsets; strings/URLs are opaque. */
export function parseCSS(source, file = 'fixture.css') {
  const comments = [];
  let clean = '', quote = '';
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (quote) {
      clean += c;
      if (c === '\\') clean += source[++i] ?? '';
      else if (c === quote) quote = '';
    } else if (c === '"' || c === "'") { quote = c; clean += c; }
    else if (c === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i + 2);
      if (end < 0) throw new Error(`${file}: unterminated comment`);
      comments.push({ start: i, end: end + 2, text: source.slice(i, end + 2), line: lineAt(source, i), spec: /^\s*(?:\*\s*)?spec\b/i.test(source.slice(i + 2, end)) });
      clean += source.slice(i, end + 2).replace(/[^\n]/g, ' '); i = end + 1;
    } else clean += c;
  }
  const declarations = [], rules = [], ignoredStatements = [];
  const stack = []; let start = 0, parens = 0, brackets = 0; quote = '';
  function declaration(end) {
    const raw = clean.slice(start, end), m = raw.match(/^\s*([\w-]+)\s*:/);
    if (!raw.trim()) return;
    if (!m) {
      if (raw.trim().startsWith('@')) { ignoredStatements.push(tidy(raw)); return; }
      throw new Error(`${file}:${lineAt(source, start)}: unparsed statement ${raw.trim()}`);
    }
    const offset = start + raw.indexOf(m[1]);
    const valueStart = start + m[0].length;
    declarations.push({ file, line: lineAt(source, offset), column: offset - source.lastIndexOf('\n', offset - 1), offset, end,
      valueStart, property: m[1], value: tidy(clean.slice(valueStart, end)), rawValue: source.slice(valueStart, end).trim(),
      selector: stack.filter(x => !x.at).map(x => x.header).join(' '),
      atRules: stack.filter(x => x.at).map(x => x.header), ruleIds: stack.map(x => x.id), specComments: [] });
  }
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; continue; }
    if (c === '"' || c === "'") { quote = c; continue; }
    if (c === '(') parens++; else if (c === ')') parens--;
    if (c === '[') brackets++; else if (c === ']') brackets--;
    if (parens || brackets) continue;
    if (c === '{') {
      const raw = clean.slice(start, i), header = tidy(raw);
      const rule = { id: rules.length, header, at: header.startsWith('@'), start: start + raw.search(/\S/), end: null };
      rules.push(rule); stack.push(rule); start = i + 1;
    } else if (c === ';') { declaration(i); start = i + 1; }
    else if (c === '}') {
      declaration(i); if (!stack.length) throw new Error(`${file}: unmatched }`);
      stack.pop().end = i; start = i + 1;
    }
  }
  if (stack.length || parens || brackets || quote) throw new Error(`${file}: unbalanced syntax`);
  declaration(clean.length);
  // Inline -> containing declaration; same-line suffix -> preceding declaration;
  // otherwise adjacent prefix -> next declaration/rule. Rule markers cover its descendants.
  for (const comment of comments.filter(c => c.spec)) {
    let targets = declarations.filter(d => d.offset <= comment.start && d.end >= comment.end);
    let association = 'inside-declaration';
    if (!targets.length) {
      const prev = declarations.filter(d => d.end < comment.start).at(-1);
      if (prev && lineAt(source, prev.end) === comment.line && /^[;\s]*$/.test(clean.slice(prev.end, comment.start))) {
        targets = [prev]; association = 'trailing-declaration';
      }
    }
    if (!targets.length) {
      const next = [...declarations.map(d => ({ start: d.offset, d })), ...rules.map(r => ({ start: r.start, r }))]
        .filter(x => x.start >= comment.end).sort((a, b) => a.start - b.start)[0];
      if (next && /^\s*$/.test(clean.slice(comment.end, next.start))) {
        targets = next.d ? [next.d] : declarations.filter(d => d.ruleIds.includes(next.r.id));
        association = next.d ? 'leading-declaration' : 'leading-rule';
      }
    }
    comment.attachedDeclarations = targets.length;
    for (const d of targets) d.specComments.push({ line: comment.line, text: tidy(comment.text), association });
  }
  return { declarations, comments, rules, ignoredStatements };
}

const colorNames = new Set(('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen transparent').split(' '));
const systemColors = new Set('accentcolor accentcolortext activetext buttonborder buttonface buttontext canvas canvastext field fieldtext graytext highlight highlighttext linktext mark marktext selecteditem selecteditemtext visitedtext currentcolor'.split(' '));
const colorFunctions = new Set('rgb rgba hsl hsla hwb lab lch oklab oklch color device-cmyk'.split(' '));
const easingWords = new Set('ease ease-in ease-out ease-in-out linear step-start step-end'.split(' '));
const lengthUnits = /^(?:px|em|rem|ex|rex|cap|rcap|ch|rch|ic|ric|lh|rlh|vw|vh|vi|vb|vmin|vmax|svw|svh|svi|svb|svmin|svmax|lvw|lvh|lvi|lvb|lvmin|lvmax|dvw|dvh|dvi|dvb|dvmin|dvmax|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|Q|in|pt|pc)$/i;
export function literals(value, property = '', offset = 0, context = []) {
  const out = []; let i = 0;
  const add = (raw, kind, start, extra = {}) => out.push({ value: raw, kind, offset: offset + start, context, ...extra });
  while (i < value.length) {
    const tail = value.slice(i), c = value[i];
    if (c === '"' || c === "'") { const q = c; i++; while (i < value.length && value[i] !== q) { if (value[i] === '\\') i++; i++; } i++; continue; }
    const hex = tail.match(/^#[\da-f]{3,8}\b/i);
    if (hex) { add(hex[0], 'color', i); i += hex[0].length; continue; }
    const num = tail.match(/^[+-]?(?:\d*\.\d+|\d+\.?\d*)(?:e[+-]?\d+)?([a-zA-Z%]*)/);
    if (num) {
      const unit = num[1].toLowerCase();
      add(num[0], unit === '%' ? 'percentage' : /^(ms|s)$/.test(unit) ? 'duration' : lengthUnits.test(unit) ? 'length' : unit ? 'dimension' : 'number', i, { unit });
      i += num[0].length; continue;
    }
    const ident = tail.match(/^(?:--|[-_a-zA-Z])[-_a-zA-Z\d]*/);
    if (ident) {
      const word = ident[0], lower = word.toLowerCase(), begin = i; i += word.length;
      if (value[i] === '(') {
        const end = closeParen(value, i), body = value.slice(i + 1, end), full = value.slice(begin, end + 1);
        if (colorFunctions.has(lower) && !/var\(/.test(body)) add(full, 'color', begin);
        else if (['cubic-bezier', 'steps', 'linear'].includes(lower)) add(full, 'easing', begin);
        else if (!['url', 'local', 'format'].includes(lower)) {
          if (lower === 'var' || lower === 'env') {
            const parts = split(body); if (parts.length > 1) {
              const comma = body.indexOf(','); out.push(...literals(body.slice(comma + 1), property, offset + i + 2 + comma, [...context, `${lower}-fallback`]));
            }
          } else out.push(...literals(body, property, offset + i + 1, [...context, lower]));
        }
        i = end + 1;
      } else if (colorNames.has(lower)) add(word, 'color', begin);
      else if (systemColors.has(lower)) add(word, 'context-color', begin);
      else if (easingWords.has(lower) && /animation|transition|ease|easing/.test(property)) add(word, 'easing', begin);
      continue;
    }
    i++;
  }
  return out;
}

function directCategory(p) {
  if (/^(?:font|line-height|letter-spacing|word-spacing|text-size-adjust|size-adjust|ascent-override|descent-override|line-gap-override)/.test(p)) return 'type';
  if (/radius/.test(p)) return 'radius';
  if (/shadow/.test(p)) return 'elevation';
  if (/opacity/.test(p)) return 'opacity';
  if (/z-index/.test(p)) return 'z-index';
  if (/animation|transition|duration|easing/.test(p)) return 'motion';
  if (/padding|margin|gap|inset|^top$|^right$|^bottom$|^left$|^background-position/.test(p)) return 'space';
  if (p === 'background-size') return 'size';
  if (/color|background|^fill$|^stroke$/.test(p)) return 'color';
  if (/border|outline|stroke-width/.test(p)) return 'stroke';
  if (/size|width|height|aspect-ratio|flex-basis|grid-template/.test(p)) return 'size';
  return 'other';
}
function classify(d, consumers) {
  let category = directCategory(d.property), reason = 'CSS property';
  if (d.property.startsWith('--')) {
    const p = d.property.replace(/^--_?/, '');
    const hints = [
      ['elevation', /shadow|lift/], ['radius', /radius|shape|round/], ['z-index', /(?:^|-)z(?:-|$)/],
      ['opacity', /opacity|alpha/], ['motion', /duration|ease|timing|transition|animation/],
      ['type', /(?:^|-)(?:text|font|leading|weight|tracking)(?:-|$)/],
      ['space', /gap|gutter|padding|margin|inset|offset/],
      ['stroke', /border-width|stroke-width|hairline-width|ring-width/],
      ['color', /(?:^|-)(?:bg|fg|color|fill|edge|border|line|hairline|wash|solid|surface)(?:-|$)/],
      ['size', /height|width|size|icon|thumb|track|dot|visual|control|swatch|bar|(?:^|-)(?:cell|day|step|item|media|columns|chevron)(?:-|$)/],
    ];
    category = hints.find(([, re]) => re.test(p))?.[0] ?? 'other'; reason = 'private property name';
    const native = sort(consumers.filter(x => !x.startsWith('--')));
    const used = sort(native.map(directCategory).filter(x => x !== 'other'));
    // Literal colors win over ambiguous private names such as --_text / --_weight.
    if (d.atoms.length && d.atoms.every(x => ['color', 'context-color'].includes(x.kind))) category = 'color';
    else if (used.length === 1 && (category === 'other' || used[0] === 'color')) { category = used[0]; reason = 'transitive native consumer'; }
  }
  if (category === 'other' && d.atoms.length && d.atoms.every(x => x.kind === 'duration' || x.kind === 'easing')) category = 'motion';
  let subtype = category;
  if (category === 'type') subtype = /tracking|spacing/.test(d.property) ? 'tracking' : /leading|line-height/.test(d.property) ? 'line-height' : /weight/.test(d.property) ? 'weight' : /family/.test(d.property) ? 'family' : 'size-or-font';
  if (category === 'space') subtype = /gap|rhythm/.test(d.property) ? 'gap' : /margin/.test(d.property) ? 'margin' : /padding|gutter/.test(d.property) ? 'padding' : 'inset-or-offset';
  if (category === 'size') subtype = /icon/.test(d.property) ? 'icon-box' : /height|block-size/.test(d.property) ? 'height' : /width|inline-size/.test(d.property) ? 'width' : 'dimension';
  return { category, subtype, categoryBasis: reason };
}

/** Selector features include negation/relational scope so :not(:disabled) is not a positive state. */
export function selectorContexts(selector, manifests) {
  return split(selector).filter(Boolean).map(branch => {
    const features = [], classes = [];
    function walk(s, offset = 0, functions = []) {
      for (let i = 0; i < s.length;) {
        const rest = s.slice(i), pseudo = rest.match(/^(:{1,2})([\w-]+)/);
        if (pseudo) {
          const name = pseudo[2]; const n = i + pseudo[0].length;
          if (s[n] === '(') { const end = closeParen(s, n); walk(s.slice(n + 1, end), offset + n + 1, [...functions, name]); i = end + 1; continue; }
          if (/^(hover|active|focus|focus-visible|focus-within|disabled|enabled|checked|indeterminate|read-only|required|optional|valid|invalid|placeholder-shown|open|user-invalid|visited|link|any-link)$/.test(name))
            features.push({ kind: 'state', name, syntax: pseudo[0], offset: offset + i, negated: functions.filter(f => f === 'not').length % 2 === 1, functions });
          i = n; continue;
        }
        const cls = rest.match(/^\.([\w-]+)/);
        if (cls) { classes.push({ name: cls[1], offset: offset + i, functions, negated: functions.filter(f => f === 'not').length % 2 === 1 }); i += cls[0].length; continue; }
        const attr = rest.match(/^\[([^\]]+)\]/);
        if (attr) {
          const name = attr[1].match(/^[\w-]+/)?.[0] ?? attr[1];
          if (/^(data-|aria-|disabled|checked|readonly|required|open|hidden)/.test(name)) features.push({ kind: name.startsWith('data-area-') ? 'system-axis' : 'state', name, syntax: attr[0], offset: offset + i, negated: functions.filter(f => f === 'not').length % 2 === 1, functions });
          i += attr[0].length; continue;
        }
        i++;
      }
    }
    walk(branch);
    const entries = [];
    for (const [key, m] of Object.entries(manifests)) {
      const own = classes.filter(c => c.name === m.block || c.name.startsWith(`${m.block}--`) || c.name.startsWith(`${m.block}__`));
      if (!own.length) continue;
      entries.push({ key, slug: m.block.slice(5), block: m.block, file: manifestFile, line: m.sourceLine, classes: own.map(c => c.name) });
      for (const c of own) {
        for (const [axis, values] of Object.entries(m.variants)) for (const value of values) if (c.name === `${m.block}--${value}`)
          features.push({ kind: ['size', 'tone'].includes(axis) ? axis : 'variant', axis, value, manifestKey: key, syntax: `.${c.name}`, negated: c.negated, functions: c.functions });
        for (const value of m.booleans ?? []) if (c.name === `${m.block}--${value}`)
          features.push({ kind: 'variant', axis: 'boolean', value, manifestKey: key, syntax: `.${c.name}`, negated: c.negated, functions: c.functions });
        for (const [element, values] of Object.entries(m.elementModifiers ?? {})) for (const value of values) if (c.name === `${m.block}__${element}--${value}`)
          features.push({ kind: 'variant', axis: 'element-modifier', element, value, manifestKey: key, syntax: `.${c.name}`, negated: c.negated, functions: c.functions });
      }
    }
    for (const feature of features.filter(f => f.kind === 'state')) {
      // Prefer the state-bearing compound, excluding classes in a completed :not/:has.
      const owner = classes.filter(c => c.offset < feature.offset && c.functions.every((f, i) => feature.functions[i] === f))
        .filter(c => {
          let between = branch.slice(c.offset + c.name.length + 1, feature.offset);
          // Remove complete function/attribute segments before looking for combinators.
          for (let i = 0; i < between.length; i++) if (between[i] === '(') {
            try { const end = closeParen(between, i); between = between.slice(0, i) + between.slice(end + 1); i--; } catch { break; }
          }
          return !/[>+~]|\s/.test(between.replace(/\[[^\]]*\]/g, ''));
        }).at(-1);
      feature.ownerClass = owner?.name ?? null;
      feature.manifestMatches = entries.flatMap(e => {
        if (!owner || !(owner.name === e.block || owner.name.startsWith(e.block + '--') || owner.name.startsWith(e.block + '__'))) return [];
        const m = manifests[e.key];
        return (m.states ?? []).filter(state => [state, `data-${state}`, `aria-${state}`, m.stateAttributes?.[state]].includes(feature.name)).map(state => ({ key: e.key, state, file: manifestFile, line: m.sourceLine }));
      });
    }
    return { selector: branch, manifestEntries: entries, features };
  });
}

function walkFiles(dir) {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en')).flatMap(e => e.isDirectory() ? walkFiles(`${dir}/${e.name}`) : e.name.endsWith('.css') ? [`${dir}/${e.name}`] : []);
}

// Unit-aware arithmetic: never assume a root font size or viewport. Relative lengths retain units.
function quantity(text) {
  const m = text.trim().match(/^([+-]?(?:\d*\.\d+|\d+\.?\d*)(?:e[+-]?\d+)?)([%a-z]*)$/i);
  if (!m) return null;
  let n = Number(m[1]), unit = m[2].toLowerCase();
  const units = { s: [1000, 'ms'], in: [96, 'px'], cm: [96 / 2.54, 'px'], mm: [96 / 25.4, 'px'], q: [96 / 101.6, 'px'], pt: [96 / 72, 'px'], pc: [16, 'px'], turn: [360, 'deg'], grad: [.9, 'deg'], rad: [180 / Math.PI, 'deg'] };
  if (units[unit]) { n *= units[unit][0]; unit = units[unit][1]; }
  return { n, unit };
}
const fmt = n => String(Number(n.toFixed(10)));
const qstr = q => `${fmt(q.n)}${q.unit}`;
function arithmetic(s) {
  const tokens = s.match(/(?:\d*\.\d+|\d+\.?\d*)(?:e[+-]?\d+)?[%a-z]*|[()+*/-]/gi) ?? [];
  if (tokens.join('') !== s.replace(/\s+/g, '')) return null;
  let pos = 0;
  function term() {
    if (tokens[pos] === '+' || tokens[pos] === '-') { const sign = tokens[pos++] === '-' ? -1 : 1; const q = term(); return q && { ...q, n: q.n * sign }; }
    if (tokens[pos] === '(') { pos++; const q = expr(); if (tokens[pos++] !== ')') return null; return q; }
    return quantity(tokens[pos++] ?? '');
  }
  function product() {
    let a = term();
    while (['*', '/'].includes(tokens[pos])) {
      const op = tokens[pos++], b = term(); if (!a || !b) return null;
      if (op === '*') { if (a.unit && b.unit) return null; a = { n: a.n * b.n, unit: a.unit || b.unit }; }
      else { if (!b.n || (b.unit && a.unit !== b.unit)) return null; a = { n: a.n / b.n, unit: b.unit ? '' : a.unit }; }
    }
    return a;
  }
  function expr() {
    let a = product();
    while (['+', '-'].includes(tokens[pos])) {
      const op = tokens[pos++], b = product(); if (!a || !b || a.unit !== b.unit) return null;
      a = { n: a.n + (op === '+' ? b.n : -b.n), unit: a.unit };
    }
    return a;
  }
  const result = expr(); return pos === tokens.length ? result : null;
}
function math(name, body) {
  if (name === 'calc') { const q = arithmetic(body); return q ? qstr(q) : null; }
  let parts = split(body), strategy = 'nearest';
  if (name === 'round' && /^(nearest|up|down|to-zero)$/.test(parts[0])) strategy = parts.shift();
  const qs = parts.map(arithmetic); if (qs.some(x => !x) || !qs.every(x => x.unit === qs[0].unit)) return null;
  let n;
  if (name === 'min') n = Math.min(...qs.map(q => q.n));
  else if (name === 'max') n = Math.max(...qs.map(q => q.n));
  else if (name === 'clamp' && qs.length === 3) n = Math.max(qs[0].n, Math.min(qs[1].n, qs[2].n));
  else if (name === 'round' && qs.length === 2 && qs[1].n) n = ({ nearest: Math.round, up: Math.ceil, down: Math.floor, 'to-zero': Math.trunc })[strategy](qs[0].n / qs[1].n) * qs[1].n;
  else return null;
  return qstr({ n, unit: qs[0].unit });
}
const namedRGB = { black: [0, 0, 0, 1], white: [255, 255, 255, 1], transparent: [0, 0, 0, 0], red: [255, 0, 0, 1], green: [0, 128, 0, 1], blue: [0, 0, 255, 1], yellow: [255, 255, 0, 1], cyan: [0, 255, 255, 1], magenta: [255, 0, 255, 1] };
function rgba(value) {
  const s = value.trim().toLowerCase(); if (namedRGB[s]) return namedRGB[s];
  const hex = s.match(/^#([a-f\d]{3,8})$/i);
  if (hex && [3, 4, 6, 8].includes(hex[1].length)) {
    let h = hex[1]; if (h.length <= 4) h = [...h].map(c => c + c).join('');
    if (h.length === 6) h += 'ff'; return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).concat(parseInt(h.slice(6), 16) / 255);
  }
  const m = s.match(/^rgba?\((.*)\)$/);
  if (m) {
    const p = m[1].replace(/[,/]/g, ' ').trim().split(/\s+/); if (p.length < 3 || p.length > 4 || p.some(x => !quantity(x))) return null;
    return p.slice(0, 3).map(x => x.endsWith('%') ? parseFloat(x) * 2.55 : Number(x)).concat(p[3] ? (p[3].endsWith('%') ? parseFloat(p[3]) / 100 : Number(p[3])) : 1);
  }
  return null;
}
const colorKey = c => `rgba(${c.map(fmt).join(',')})`;
function mixColor(body) {
  const parts = split(body); if (parts.length !== 3 || !/^in (srgb|oklab)$/.test(parts[0])) return null;
  const terms = parts.slice(1).map(s => { const m = s.match(/\s+([\d.]+)%$/); return { c: rgba(m ? s.slice(0, m.index) : s), w: m ? Number(m[1]) / 100 : null }; });
  if (terms.some(x => !x.c)) return null;
  const [a, b] = terms; if (a.w === null) a.w = b.w === null ? .5 : 1 - b.w; if (b.w === null) b.w = 1 - a.w;
  const total = a.w + b.w; if (!total) return null;
  a.w /= total; b.w /= total;
  const alpha = a.c[3] * a.w + b.c[3] * b.w;
  if (!alpha) return 'rgb(0 0 0 / 0)';
  // In any interpolation space, mixing one color with transparent retains its channels.
  // Nontrivial oklab mixtures remain explicitly unresolved rather than approximated.
  if (parts[0] === 'in oklab' && a.c[3] && b.c[3] && a.w && b.w) return null;
  const rgb = [0, 1, 2].map(i => (a.c[i] * a.c[3] * a.w + b.c[i] * b.c[3] * b.w) / alpha);
  return `rgb(${rgb.map(fmt).join(' ')} / ${fmt(alpha * Math.min(1, total))})`;
}

export function resolveValue(value, tokenMap, seen = new Set()) {
  let result = '', unresolved = [];
  for (let i = 0; i < value.length;) {
    const m = value.slice(i).match(/^([a-z-]+)\(/i);
    if (!m) { result += value[i++]; continue; }
    const name = m[1].toLowerCase(), open = i + m[0].length - 1, end = closeParen(value, open), body = value.slice(open + 1, end);
    let replacement;
    if (name === 'var') {
      const [key, ...fallback] = split(body);
      if (seen.has(key)) unresolved.push(`cyclic ${key}`);
      else if (Object.hasOwn(tokenMap, key)) {
        const resolved = resolveValue(tokenMap[key], tokenMap, new Set([...seen, key])); replacement = resolved.value; unresolved.push(...resolved.unresolved);
      } else if (fallback.length) {
        const resolved = resolveValue(fallback.join(','), tokenMap, seen); replacement = resolved.value; unresolved.push(...resolved.unresolved);
      } else unresolved.push(`unbound ${key}`);
    } else if (name === 'light-dark') {
      const light = resolveValue(split(body)[0], tokenMap, seen); replacement = light.value; unresolved.push(...light.unresolved);
    } else if (name === 'url' || name === 'local' || name === 'format') replacement = value.slice(i, end + 1);
    else {
      const resolved = resolveValue(body, tokenMap, seen); unresolved.push(...resolved.unresolved);
      if (['calc', 'min', 'max', 'clamp', 'round'].includes(name)) {
        replacement = math(name, resolved.value); if (replacement === null) unresolved.push(`context-dependent ${name}(${resolved.value})`);
      } else if (name === 'color-mix') {
        replacement = mixColor(resolved.value); if (replacement === null) unresolved.push(`unsupported color-mix(${resolved.value})`);
      }
      replacement ??= `${name}(${resolved.value})`;
    }
    result += replacement ?? value.slice(i, end + 1); i = end + 1;
  }
  return { value: tidy(result), unresolved: sort(unresolved) };
}
export function canonical(value) {
  const c = rgba(value); if (c) return colorKey(c);
  const q = quantity(value); if (q) return qstr(q);
  // Normalize embedded colors and numeric spelling without equating incompatible units.
  let out = value;
  for (const atom of literals(value).reverse()) {
    const col = rgba(atom.value), num = quantity(atom.value);
    const replacement = col ? colorKey(col) : num ? qstr(num) : atom.value.toLowerCase();
    out = out.slice(0, atom.offset) + replacement + out.slice(atom.offset + atom.value.length);
  }
  return tidy(out).replace(/\s*([(),/])\s*/g, '$1');
}
function matchKey(value, category, kind) {
  const q = quantity(value);
  // CSS allows unitless zero in a length slot, but zero opacity is not zero duration.
  if (q && q.n === 0 && (kind === 'length' || ['space', 'size', 'radius', 'stroke', 'elevation'].includes(category)) && (!q.unit || lengthUnits.test(q.unit))) return '0-length';
  return canonical(value);
}

function environments(data) {
  return Object.fromEntries(['defaultLight', 'compactLight'].map(name => {
    const axes = Object.fromEntries(data.axes.map(a => [a.id, name === 'compactLight' && a.id === 'ui' ? 'compact' : a.defaultPreset]));
    if (axes.theme !== 'light') throw new Error('Expected a default light theme');
    const map = { ...data.base }; const origins = Object.fromEntries(Object.keys(map).map(k => [k, `/base/${k}`]));
    for (const axis of data.axes) {
      const preset = axis.presets.find(p => p.id === axes[axis.id]); if (!preset) throw new Error(`Missing preset ${axis.id}`);
      for (const [key, value] of Object.entries(preset.tokens)) { map[key] = value; origins[key] = `/axes/${data.axes.indexOf(axis)}/presets/${axis.presets.indexOf(preset)}/tokens/${key}`; }
    }
    for (const [key, value] of Object.entries(data.derived)) { map[key] = value; origins[key] = `/derived/${key}`; }
    const resolved = Object.fromEntries(Object.entries(map).map(([key, value]) => [key, resolveValue(value, map, new Set([key]))]));
    return [name, { axes, map, origins, resolved }];
  }));
}
function tokenMatches(value, category, kind, env) {
  const resolved = resolveValue(value, env.map);
  if (resolved.unresolved.length) return { status: 'unresolved', resolvedValue: resolved.value, tokens: [], reasons: resolved.unresolved };
  if (literals(resolved.value).some(x => x.kind === 'context-color')) return { status: 'context-dependent', resolvedValue: resolved.value, tokens: [] };
  const target = matchKey(resolved.value, category, kind);
  const tokens = Object.entries(env.resolved).filter(([, r]) => !r.unresolved.length && matchKey(r.value, category, kind) === target).map(([key]) => key).sort();
  return { status: tokens.length ? 'matched' : 'not-found', resolvedValue: resolved.value, tokens };
}

function counts(rows, key) {
  return Object.fromEntries(sort(rows.map(r => r[key])).map(k => [k, rows.filter(r => r[key] === k).length]));
}
function groupRows(rows, keyFn) {
  const groups = new Map();
  for (const row of rows) { const key = keyFn(row); if (key === null) continue; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(row); }
  return [...groups.entries()];
}
function clustersFor(rows) {
  const valueGroups = groupRows(rows, r => `${r.category}\0${canonical(r.value)}`).map(([key, members]) => ({
    category: members[0].category, value: key.split('\0')[1], spellings: sort(members.map(r => r.value)),
    rowCount: members.length, components: sort(members.flatMap(r => r.components)), properties: sort(members.map(r => r.property)), rowIds: members.map(r => r.id),
  })).sort((a, b) => b.components.length - a.components.length || b.rowCount - a.rowCount || a.category.localeCompare(b.category) || a.value.localeCompare(b.value));
  valueGroups.forEach((g, i) => { g.id = `value-${String(i + 1).padStart(4, '0')}`; });
  const atomGroups = new Map();
  for (const r of rows) for (const a of r.literals) {
    const key = `${a.kind}\0${canonical(a.value)}`;
    if (!atomGroups.has(key)) atomGroups.set(key, { kind: a.kind, value: canonical(a.value), occurrences: [] });
    atomGroups.get(key).occurrences.push({ rowId: r.id, offset: a.offset });
  }
  const byId = new Map(rows.map(r => [r.id, r]));
  const literalGroups = [...atomGroups.values()].map(g => ({ ...g, occurrenceCount: g.occurrences.length, rowCount: new Set(g.occurrences.map(x => x.rowId)).size, components: sort(g.occurrences.flatMap(x => byId.get(x.rowId).components)), categories: sort(g.occurrences.map(x => byId.get(x.rowId).category)) })).sort((a, b) => b.occurrenceCount - a.occurrenceCount || a.kind.localeCompare(b.kind) || a.value.localeCompare(b.value));
  // Compare a single scalar used in the same role/context. Never mix state or size tiers.
  const scalarValue = r => r.tokenMatches.defaultLight.status === 'unresolved' ? null : r.tokenMatches.defaultLight.resolvedValue;
  const candidates = groupRows(rows, r => {
    if (!['space', 'size', 'radius', 'stroke', 'type'].includes(r.category) || !/^[-+]?\d*\.?\d+(px|em|rem)?$/.test(scalarValue(r) ?? '') || r.componentSlug === 'shared' || !r.manifestEntries.length) return null;
    if ((quantity(scalarValue(r))?.n ?? 0) <= 0) return null;
    if (r.atRules.some(x => /keyframes|media|supports|container|starting-style/.test(x))) return null;
    if (r.selectorContexts.length !== 1 || r.selectorContexts[0].features.some(f => f.negated || f.functions?.includes('has'))) return null;
    const fs = r.selectorContexts.flatMap(c => c.features);
    const context = sort(fs.map(f => `${f.kind}:${f.axis ?? f.name}=${f.value ?? f.syntax}`)).join('|') || 'base';
    const role = r.property.startsWith('--') ? r.property.replace(/^--_/, '').replace(new RegExp(`^(?:${r.components.flatMap(c => [c, c.split('-')[0]]).join('|')})-`), '') : r.property;
    const element = r.selector.match(/__([\w-]+)/)?.[1] ?? 'root';
    return `${r.category}\0${role}\0${element}\0${context}\0${quantity(scalarValue(r)).unit}`;
  }).map(([key, members]) => {
    const values = sort(members.map(scalarValue)), components = sort(members.flatMap(r => r.components));
    if (values.length < 2 || components.length < 2) return null;
    const qs = values.map(quantity); if (!qs.every(q => q && q.unit === qs[0].unit)) return null;
    const nonzero = qs.filter(q => q.n > 0).map(q => q.n); if (nonzero.length < 2) return null;
    const spread = Math.max(...nonzero) - Math.min(...nonzero);
    const near = qs[0].unit === 'px' ? spread <= 2 : spread / Math.max(...nonzero) <= .25;
    return { category: key.split('\0')[0], role: key.split('\0')[1], element: key.split('\0')[2], selectorContext: key.split('\0')[3], values, components,
      valueBasis: 'resolved default light scalar (spec-marked token references included)', authoredValues: sort(members.map(r => r.value)), confidence: near ? 'near-value-review' : 'role-range-review', rationale: 'Same property role, element and explicit selector context across components; intent may differ. Owner review required.', rowIds: members.map(r => r.id) };
  }).filter(Boolean).sort((a, b) => a.confidence.localeCompare(b.confidence) || b.components.length - a.components.length || a.role.localeCompare(b.role));
  candidates.forEach((g, i) => { g.id = `review-${String(i + 1).padStart(3, '0')}`; });
  const parameterRules = [
    ['paint.palette-and-role-colors', 'color', () => true], ['type.font-size', 'type', r => !/leading|line-height|weight|tracking|spacing|family/.test(r.property)],
    ['type.line-height', 'type', r => /leading|line-height/.test(r.property)], ['type.font-weight', 'type', r => /weight/.test(r.property)], ['type.letter-spacing', 'type', r => /tracking|spacing/.test(r.property)],
    ['space.content-gap', 'space', r => /gap|rhythm/.test(r.property)], ['space.padding-and-gutters', 'space', r => /padding|gutter/.test(r.property)], ['space.margin-and-inset', 'space', r => !/gap|rhythm|padding|gutter/.test(r.property)],
    ['size.icon-box', 'size', r => /icon/.test(r.property) || /__(?:icon|chevron)/.test(r.selector)], ['size.control-and-content-dimensions', 'size', r => !/icon/.test(r.property) && !/__(?:icon|chevron)/.test(r.selector)],
    ['shape.radius-by-role', 'radius', () => true], ['stroke.width', 'stroke', () => true],
    ['motion.duration-and-easing', 'motion', () => true], ['opacity.state-opacity', 'opacity', () => true], ['layers.z-index', 'z-index', () => true],
  ];
  const foundationParameters = parameterRules.map(([name, category, predicate]) => {
    const members = rows.filter(r => r.category === category && predicate(r) && /^(?:-?\d*\.?\d+(?:px|rem|em|ms|s)?|#[0-9a-f]{3,8})$/i.test(r.value.trim()) && !/^0(?:px|rem|em|ms|s)?$/.test(r.value.trim()));
    return { name, category, status: 'proposal', currentValues: sort(members.map(r => r.value)).slice(0, 8), components: sort(members.flatMap(r => r.components)), rowIds: members.map(r => r.id),
      note: 'Inventory-derived proposal; preserve component roles, size tiers and state intent before exposing a global option.' };
  }).filter(g => g.rowIds.length);
  return { valueGroups, literalGroups, inconsistencyCandidates: candidates, foundationParameters };
}

function markdown(lit, clusters) {
  const rows = lit.rows, rowMap = new Map(rows.map(r => [r.id, r]));
  const esc = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const code = s => '`' + esc(s).replace(/`/g, '') + '`';
  const evidence = ids => ids.slice(0, 3).map(id => { const r = rowMap.get(id); return `[${r.file.replace('packages/styles/src/', '')}:${r.line}](${sourceURL(r.file, r.line)})`; }).join(', ');
  const table = (headers, data) => [headers.join(' | '), headers.map(() => '---').join(' | '), ...data.map(row => row.map(esc).join(' | '))].map(s => `| ${s} |`).join('\n');
  const top = clusters.valueGroups.filter(g => g.components.length >= 2).slice(0, 30);
  const near = clusters.inconsistencyCandidates.filter(g => g.confidence === 'near-value-review');
  return `# Component visual literals and Foundation options\n\nGenerated by [extract.mjs](./extract.mjs). Snapshot of commit: \`${START_COMMIT}\`. All CSS and manifest citations below refer to that revision. Generated token evidence is identified by file, JSON pointer, build-source citations and SHA-256 in [literals.json](./literals.json). No source CSS changes.\n\n## Reproduce\n\nFrom this worktree with existing dependencies, after \`npm run build\`:\n\n\`node docs/research/option-schema/extract.mjs\`\n\n\`node --test docs/research/option-schema/extract.test.mjs\`\n\n\`node docs/research/option-schema/extract.mjs --check\`\n\nThe last command recomputes all three outputs in memory and fails if any byte differs. Generated JSON has no timestamps or machine paths; the brief reference is repository-relative. The pinned source guard rejects CSS, manifest or token-source drift from the starting commit; a new baseline requires explicitly updating START_COMMIT.\n\n## Scope and counting\n\n${lit.summary.cssFiles} of ${lit.summary.cssFiles} CSS files covered; ${lit.summary.declarations} declarations parsed; **${rows.length} declaration rows** retained, containing **${lit.summary.literalOccurrences} literal occurrences**. ${lit.summary.specRows} rows have associated spec comments, including ${lit.summary.specOnlyRows} without a literal atom. ${lit.summary.unattachedSpecComments} spec comments are unattached (listed in JSON). ${lit.summary.tokenMatchedDefault} rows have a whole-value token match in default light; ${lit.summary.tokenMatchedCompact} in compact light; ${lit.summary.tokenMatchedBoth} in both.\n\nOne row represents one physical declaration, including shared rules. Each row keeps source text, selector branches, enclosing at-rules, comment associations, literal atoms, manifest entries and token results. Component counts include every Area component referenced in a selector, including ancestors and relational tests; shared rows therefore count in several components. They are not additive. Keyframes link to components through animation declarations in the same file, with those references retained as evidence. Remaining rows without an Area selector use a file-based shared slug (or the component file stem if ownership cannot be found). Manifest families with no retained declarations are listed with zero rows.\n\nAll numeric literals are retained, including percentages, zeroes, flex factors, animation iteration counts, transform coefficients and fallback values. URLs, quoted strings, identifiers (including digits in token names), selectors and at-rule parameters are not declaration literals. Named and system colors and easing keywords are retained. A comment beginning with \`spec\` inside a declaration or on its trailing line marks that declaration; an adjacent preceding comment marks the next declaration or rule and its descendants. These broad comment associations are labeled, not presented as exact value measurements.\n\nCategories follow native properties, private names, then transitive native consumers within the file. Mixed recipes receive one primary category; atoms retain their own kinds. These are proposals for review. System colors and \`currentColor\` are contextual, not fixed paint. Pure keyword declarations without a spec marker, color or easing value are outside this inventory.\n\n### Counts by category\n\n${table(['Category', 'Rows'], categories.map(c => [c, lit.summary.byCategory[c] ?? 0]))}\n\n### Counts by component\n\n${table(['Component or shared source', 'Rows'], Object.entries(lit.summary.byComponent))}\n\n### File coverage\n\n${table(['CSS file', 'Parsed declarations', 'Retained rows'], lit.coverage.map(f => [`[${f.file.slice(cssRoot.length + 1)}](${sourceURL(f.file, 1)})`, f.declarations, f.rows]))}\n\n## Manifest gaps\n\n${table(['Unmatched Area class', 'Rows', 'Evidence'], sort(rows.flatMap(r => r.unmatchedAreaClasses)).map(name => { const members = rows.filter(r => r.unmatchedAreaClasses.includes(name)); return [code(name), members.length, evidence(members.map(r => r.id))]; }))}\n\nThese classes were not found among the blocks/elements/modifiers in manifest.ts. File-based attribution is retained without inventing a manifest entry. Unmatched state syntax is also preserved in each selector context.\n\n## Token comparison\n\nBoth environments use the defaults declared in generated \`config.js\`: ${Object.entries(lit.environments.defaultLight.axes).map(([k, v]) => `${k}=${v}`).join(', ')}. Compact changes only \`ui=compact\`. The maps are assembled as base → each selected axis → derived, matching [the emitter](${sourceURL('packages/tokens/src/emit/css.ts', 98)}); JSON structure comes from [emit/json.ts](${sourceURL('packages/tokens/src/emit/json.ts', 110)}).\n\nAliases and fallbacks resolve recursively. The resolver selects the light arm of \`light-dark()\`, evaluates dimensionally compatible calc/min/max/clamp/round, normalizes absolute CSS length/time units and RGB/hex colors, and handles generated sRGB color mixes plus oklab mixes with transparent. Relative units retain their units: no assumed root font size, viewport or element geometry. Equality is numeric to ten decimal places, not perceptual proximity. Zero lengths can equal unitless zero only in length categories; scalar zero remains distinct from time or opacity.\n\nEach row has whole-declaration matches plus matches for each atom. An atom inside the dark arm is still compared as an isolated value against the requested light token maps; it does not describe the active light paint. Matching names are equality candidates across all token namespaces, not recommendations to replace a value with a semantically unrelated token. A match to one constituent does not make a shadow, border or calc recipe fully tokenized. Private component vars are intentionally unbound; such whole values report \`unresolved\` while their literal atoms are still checked.\n\n${Object.entries(lit.environments).map(([name, env]) => `- ${name}: ${env.tokenCount} tokens; ${env.unresolvedTokens.length} unresolved generated tokens.`).join('\n')}\n\nUnsupported/context-dependent expressions are preserved with reasons. “not-found” means no equal value found in the resolved token map, not proof that no equivalent browser-computed value exists. All generated tokens and their provenance are listed in JSON. No browser cascade, pseudo-state activation or inherited private-variable evaluation is claimed. Output is an inventory of authored declarations, including declarations later overridden by the cascade.\n\n## Top 30 identical declaration-value groups across components\n\nRanked by distinct components, then declaration rows. Groups retain category and canonical value; literal-atom groups are separately available in [clusters.json](./clusters.json). Common zeroes and percentages remain visible because they are part of the requested inventory.\n\n${table(['Group', 'Category / value', 'Rows', 'Components', 'Evidence'], top.map(g => [g.id, `${g.category}: ${code(g.value)}`, g.rowCount, g.components.join(', '), evidence(g.rowIds)]))}\n\n## First-draft Foundation parameters\n\nThis short proposal groups scalar controls inferred from the declarations; it is not an approved scale. Each row shows at most eight example values. Zero, percentages and whole recipes are excluded; the full inventory remains in the JSON value groups. \`rowIds\` in clusters.json are the complete source evidence for each proposal. The brief was not found at \`docs/BRIEF.md\` on the starting commit; product intent was read read-only from \`.claude/worktrees/astra-6-usage-tasks-17a367/docs/BRIEF.md\` on 2026-09-28, “Customization model” and “Build sequence”, step 1. It is context, not numeric evidence.\n\n${table(['Proposed parameter', 'Example scalar values', 'Evidence'], clusters.foundationParameters.map(p => [p.name, p.currentValues.map(code).join('; '), evidence(p.rowIds)]))}\n\n## Inconsistencies for owner review\n\n${clusters.inconsistencyCandidates.length} candidates: ${near.length} near-value reviews and ${clusters.inconsistencyCandidates.length - near.length} wider role-range reviews. These are hypotheses, not confirmed bugs. Values are resolved in default light, including spec-marked token references. The heuristic requires the same category, property role, sub-element and explicit selector context in multiple components. It excludes media/supports/container/keyframe/starting-style contexts, negations, relational \`:has()\` tests and selector lists. Shared non-component sources and nonpositive scalars are excluded. Positive scalar values in the same unit within 2px (or 25% for non-px values) get the near-value label. These cutoffs are analysis choices, not design-system facts. Missing modifiers mean “base rule”, not an inferred default size.\n\n${table(['Candidate', 'Role / context', 'Values', 'Components', 'Evidence'], clusters.inconsistencyCandidates.map(g => [g.id + ' (' + g.confidence + ')', `${g.category}/${g.role}; ${g.element}; ${g.selectorContext}`, g.values.join(', '), g.components.join(', '), evidence(g.rowIds)]))}\n\nOwner questions:\n\n- Which shared roles should become Foundation parameters, and which should stay component-local? Equal numeric values alone do not answer this.\n- For near-value candidates above, are differences intentional optical adjustments or candidates for a shared scale?\n- Should compact UI adapt measured literals that currently bypass its tokens? Compare each row’s default and compact matches before deciding.\n- Should fixed color coordinates in color-picker controls, keyframe coefficients, font metrics and layout constants be excluded from the eventual builder controls? They remain in this complete inventory.\n\n## Validation and handoff\n\n- [x] Every CSS file covered, including zero-row files, imports, reset, fonts and forced colors. Coverage and content hashes are in literals.json.\n- [x] Identical second run: \`--check\` recomputes and compares exact bytes for literals.json, clusters.json and this README.\n- [x] README counts, groups and parameter lists are generated from the same JSON objects; tests independently recount them.\n- Baseline \`npm ci\` and \`npm run build\` passed. The build reports manifest parity and token-reference checks passing.\n- No runtime component or visual changes; browser inspection is not applicable to these source-analysis outputs.\n- The scanner fails on unparsed statements and unbalanced syntax. It is a dependency-free scanner for this source tree, not a complete browser CSS parser. Cross-file consumers, unknown named-color conversions and contextual expressions can leave conservative unmatched results.\n`;
}

export async function extract({ check = false } = {}) {
  const files = walkFiles(cssRoot), manifestText = read(manifestFile);
  const baselineFiles = execFileSync('git', ['ls-tree', '-r', '--name-only', START_COMMIT, cssRoot], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(f => f.endsWith('.css')).sort();
  if (JSON.stringify([...files].sort()) !== JSON.stringify(baselineFiles)) throw new Error('CSS file set differs from pinned source');
  // Avoid publishing starting-commit citations for changed inputs.
  const pinned = [...files, manifestFile, ...execFileSync('git', ['ls-tree', '-r', '--name-only', START_COMMIT, 'packages/tokens/src'], { cwd: root, encoding: 'utf8' }).trim().split('\n')];
  for (const file of pinned) if (read(file) !== execFileSync('git', ['show', `${START_COMMIT}:${file}`], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })) throw new Error(`Input differs from pinned source: ${file}`);
  const imported = await import(pathToFileURL(path.join(root, manifestFile)).href);
  const manifests = Object.fromEntries(Object.entries(imported.MANIFESTS).map(([key, m]) => {
    const at = manifestText.indexOf(`block: "${m.block}"`); if (at < 0) throw new Error(`Manifest source not found: ${key}`);
    return [key, { ...m, sourceLine: lineAt(manifestText, at) }];
  }));
  const envs = environments(JSON.parse(read(tokenFile)));
  const rows = [], coverage = [], unattachedSpecComments = [];
  for (const file of files) {
    const text = read(file), parsed = parseCSS(text, file), before = rows.length;
    const consumers = new Map();
    for (const d of parsed.declarations) for (const m of d.value.matchAll(/var\(\s*(--[\w-]+)/g)) {
      if (!consumers.has(m[1])) consumers.set(m[1], new Set()); consumers.get(m[1]).add(d.property);
    }
    function trace(prop, seen = new Set()) {
      if (seen.has(prop)) return []; seen.add(prop);
      return sort([...(consumers.get(prop) ?? [])].flatMap(p => [p, ...(p.startsWith('--') ? trace(p, seen) : [])]));
    }
    for (const d of parsed.declarations) {
      d.atoms = literals(d.value, d.property); if (!d.atoms.length && !d.specComments.length) continue;
      const contexts = selectorContexts(d.selector, manifests);
      let matched = contexts.flatMap(c => c.manifestEntries);
      const keyframeName = d.atRules.map(x => x.match(/@(?:-webkit-)?keyframes\s+([\w-]+)/)?.[1]).find(Boolean);
      const animationReferences = keyframeName ? parsed.declarations.filter(ref => /^animation(?:-name)?$/.test(ref.property) && ref.value.split(/[^\w-]+/).includes(keyframeName)) : [];
      if (!matched.length && keyframeName) matched = animationReferences.flatMap(ref => selectorContexts(ref.selector, manifests).flatMap(c => c.manifestEntries));
      const components = sort(matched.map(m => m.slug));
      const isKeyframe = Boolean(keyframeName);
      if (!components.length) components.push(file.includes('/components/') ? path.basename(file, '.css') : `shared:${path.basename(file, '.css')}`);
      const consumption = d.property.startsWith('--') ? trace(d.property) : [];
      const category = classify(d, consumption);
      const id = `${file}:${d.line}:${d.column}`;
      rows.push({ id, file, line: d.line, column: d.column, selector: d.selector || null, atRules: d.atRules,
        property: d.property, value: d.value, rawValue: d.rawValue, componentSlug: components.length === 1 ? components[0] : 'shared', components,
        componentBasis: isKeyframe && matched.length ? 'animation references in same CSS file' : matched.length ? 'Area classes mentioned by selector' : file.includes('/components/') ? 'component file stem (no manifest match)' : 'shared file',
        animationReferences: animationReferences.map(ref => ({ file, line: ref.line, selector: ref.selector, property: ref.property, value: ref.value })),
        ...category, consumerProperties: consumption, spec: d.specComments.length > 0, specComments: d.specComments,
        selectorContexts: contexts, hasVariantSizeToneState: contexts.some(c => c.features.some(f => ['variant', 'size', 'tone', 'state'].includes(f.kind))),
        manifestEntries: [...new Map(matched.map(m => [m.key, { key: m.key, file: m.file, line: m.line, block: m.block }])).values()],
        manifestStatus: matched.length ? (isKeyframe ? 'matched via animation reference' : 'matched') : 'not found: no matching manifest block; searched manifest.ts blocks',
        unmatchedAreaClasses: sort([...d.selector.matchAll(/\.(area-[\w-]+)/g)].map(m => m[1]).filter(name => !Object.values(manifests).some(m => name === m.block || name.startsWith(m.block + '--') || name.startsWith(m.block + '__')))),
        tokenMatches: Object.fromEntries(Object.entries(envs).map(([name, env]) => [name, tokenMatches(d.value, category.category, null, env)])),
        literals: d.atoms.map(a => ({ ...a, tokenMatches: Object.fromEntries(Object.entries(envs).map(([name, env]) => [name, tokenMatches(a.value, category.category, a.kind, env)])) })),
      });
    }
    coverage.push({ file, sha256: sha(text), declarations: parsed.declarations.length, rows: rows.length - before, rules: parsed.rules.length,
      specComments: parsed.comments.filter(c => c.spec).length, ignoredAtStatements: parsed.ignoredStatements });
    unattachedSpecComments.push(...parsed.comments.filter(c => c.spec && !c.attachedDeclarations).map(c => ({ file, line: c.line, text: tidy(c.text) })));
  }
  const byComponent = Object.fromEntries(sort([...Object.values(manifests).map(m => m.block.slice(5)), ...rows.flatMap(r => r.components)]).map(c => [c, rows.filter(r => r.components.includes(c)).length]));
  const lit = { schemaVersion: 1, sourceCommit: START_COMMIT,
    inputs: { manifest: { file: manifestFile, sha256: sha(manifestText) }, tokens: { file: tokenFile, sha256: sha(read(tokenFile)), buildSources: ['packages/tokens/src/emit/json.ts:110', 'packages/tokens/src/emit/css.ts:98', 'packages/tokens/src/emit/base.ts:1', 'packages/tokens/src/axes/registry.ts:1'] } },
    summary: { cssFiles: files.length, declarations: coverage.reduce((n, f) => n + f.declarations, 0), rows: rows.length, literalOccurrences: rows.reduce((n, r) => n + r.literals.length, 0), specRows: rows.filter(r => r.spec).length,
      specOnlyRows: rows.filter(r => r.spec && !r.literals.length).length, unattachedSpecComments: unattachedSpecComments.length,
      tokenMatchedDefault: rows.filter(r => r.tokenMatches.defaultLight.tokens.length).length, tokenMatchedCompact: rows.filter(r => r.tokenMatches.compactLight.tokens.length).length,
      tokenMatchedBoth: rows.filter(r => r.tokenMatches.defaultLight.tokens.length && r.tokenMatches.compactLight.tokens.length).length, byCategory: counts(rows, 'category'), byComponent },
    environments: Object.fromEntries(Object.entries(envs).map(([name, env]) => [name, { axes: env.axes, tokenCount: Object.keys(env.map).length,
      unresolvedTokens: Object.entries(env.resolved).filter(([, v]) => v.unresolved.length).map(([name, value]) => ({ name, ...value })),
      tokens: Object.fromEntries(Object.entries(env.resolved).map(([name, value]) => [name, { authoredValue: env.map[name], ...value, jsonPointer: env.origins[name] }])) }])),
    manifests: Object.fromEntries(Object.entries(manifests).map(([key, m]) => [key, { ...m, file: manifestFile }])), coverage, unattachedSpecComments, rows };
  const clusters = { schemaVersion: 1, sourceCommit: START_COMMIT, ...clustersFor(rows) };
  const outputs = { 'literals.json': JSON.stringify(lit, null, 2) + '\n', 'clusters.json': JSON.stringify(clusters, null, 2) + '\n', 'README.md': markdown(lit, clusters) };
  for (const [file, contents] of Object.entries(outputs)) {
    const dest = path.join(output, file);
    if (check) { if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') !== contents) throw new Error(`Output differs: ${file}`); }
    else fs.writeFileSync(dest, contents);
  }
  console.log(`${check ? 'Verified byte-identical outputs' : 'Generated outputs'}: ${files.length} CSS files, ${rows.length} rows, ${lit.summary.literalOccurrences} literal occurrences.`);
  return { lit, clusters };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await extract({ check: process.argv.includes('--check') });
