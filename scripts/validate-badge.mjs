// Checks every Area Badge capture in docs/research/captures/badge/ against docs/specs/badge.md.
// Usage: node scripts/validate-badge.mjs   (exit 1 on any failure)
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const dir = new URL('../docs/research/captures/badge/', import.meta.url).pathname;
const SPEC = { // height, text gutter, dot start, icon, icon gap, media, media gap
  sm: { h: 16, gutter: 6, dot: 4, icon: 12, gap: 2, media: 12, mediaGap: 4 },
  md: { h: 20, gutter: 8, dot: 6, icon: 16, gap: 4, media: 16, mediaGap: 4 },
  lg: { h: 24, gutter: 10, dot: 8, icon: 16, gap: 4, media: 16, mediaGap: 6 },
};
const MUTED = 'rgb(102, 102, 102)';
const near = (a, b, tol = 0.5) => Math.abs(a - b) <= tol;
let failures = 0, checked = 0;
for (const file of readdirSync(dir).filter(f => f.startsWith('area--')).sort()) {
  const cap = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  const node = slot => cap.slots[slot] == null ? null : cap.nodes[cap.slots[slot]];
  const shell = node('shell'), text = node('text');
  const cls = shell.el;
  const size = (cls.match(/area-badge--(sm|md|lg)\b/) || [, 'md'])[1];
  const s = SPEC[size], [,, w, h] = shell.box;
  const errors = [];
  const expect = (label, actual, wanted, tol) => { if (!near(actual, wanted, tol)) errors.push(`${label} ${actual} ≠ ${wanted}`); };
  expect('height', h, s.h, 0.01);
  if (/icon-only|dot-only/.test(cls)) expect('width (square)', w, s.h, 0.01);
  if (text) {
    const line = text.text?.lines?.[0] ?? cap.nodes.find(n => n.parent === text.i && n.text)?.text?.lines?.[0];
    if (line) { const top = line.capTop, bottom = h - line.baseline; if (!near(top, bottom, 0.6)) errors.push(`cap not centred: top ${top}, bottom ${bottom}`); }
    const [, right, , left] = text.edge;
    const first = cap.nodes.filter(n => n.parent === 0)[0], last = cap.nodes.filter(n => n.parent === 0).at(-1);
    const startWanted = node('indicator') ? s.dot + 8 + s.mediaGap
      : node('media') ? (s.h - s.media) / 2 + s.media + s.mediaGap
      : node('icon') ? (s.h - s.icon) / 2 + s.icon + s.gap : s.gutter;
    const endWanted = node('action') ? (s.h - s.media) / 2 + s.media + 2
      : node('icon-end') ? (s.h - s.icon) / 2 + s.icon + s.gap : s.gutter;
    if (!/truncate/.test(cls)) { expect('text start', left, startWanted); expect('text end', right, endWanted); }
    // The label fills the content box (inside the 1px border) so it can carry the badge's
    // baseline from the top of the content box without moving the cap.
    expect('label top inset', text.edge[0], 1, 0.05); expect('label bottom inset', text.edge[2], 1, 0.05);
    const tone = (cls.match(/area-badge--(neutral|accent|info|success|warning|caution|danger|discovery|inverted)\b/) || [])[1];
    const variant = (cls.match(/area-badge--(soft|solid|outline|color|modern)\b/) || [])[1];
    const ink = text.style?.color ?? shell.style.color;
    if (tone === 'neutral' && ['soft', 'outline', 'color'].includes(variant) && ink !== MUTED) errors.push(`neutral ink ${ink} ≠ ${MUTED}`);
  }
  for (const slot of ['icon', 'icon-end', 'media', 'action']) {
    const n = node(slot); if (!n) continue;
    const size = slot === 'icon' || slot === 'icon-end' ? s.icon : s.media;
    expect(`${slot} size`, n.box[2], size, 0.01);
    expect(`${slot} vertical inset`, n.edge[0], (s.h - size) / 2);
  }
  const dot = node('indicator'); if (dot) { expect('dot slot', dot.box[2], 8, 0.01); if (!/dot-only/.test(cls)) expect('dot start', dot.edge[3], s.dot); }
  checked++;
  if (errors.length) { failures++; console.log(`✗ ${cap.meta.variant} (${size}): ${errors.join('; ')}`); }
}
console.log(`${checked} captures checked, ${failures} failing`);
process.exit(failures ? 1 : 0);
