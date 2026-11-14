// From experiment 5's study pages: the layout engine every draft shared.
const G = {};
// Stacked lines, bent. The copy is set flat first (one long line, or a justified block of n
// lines), then every point of every glyph outline is carried through a map into the square:
//   whorl   the complex exponential, which turns a straight line into a logarithmic spiral and
//           keeps every letter's proportions (conformal); each turn sits one line space
//           outside the last, so the stack never collides.
//   ribbon  a band of n lines laid along a centreline; band thickness sets the type size at
//           each point, so letters swell and taper, and round over the inside of every bend.
// The result is fitted to the square with a margin of one word space at the size of the type
// that touches the edge.
(function (G) {
  const S = 1080, SZ = 100; // output side; type size used for the flat layout

  function lerp2(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function cubics(cmds) {
    const contours = []; let cur = null, start = null, last = null;
    for (const c of cmds) {
      if (c.type === 'M') { cur = []; contours.push(cur); start = last = [c.x, c.y]; }
      else if (c.type === 'L') { const p = [c.x, c.y]; cur.push([last, lerp2(last, p, 1 / 3), lerp2(last, p, 2 / 3), p]); last = p; }
      else if (c.type === 'Q') { const q = [c.x1, c.y1], p = [c.x, c.y]; cur.push([last, lerp2(last, q, 2 / 3), lerp2(p, q, 2 / 3), p]); last = p; }
      else if (c.type === 'C') { const p = [c.x, c.y]; cur.push([last, [c.x1, c.y1], [c.x2, c.y2], p]); last = p; }
      else if (c.type === 'Z') { if (last && (last[0] !== start[0] || last[1] !== start[1])) cur.push([last, lerp2(last, start, 1 / 3), lerp2(last, start, 2 / 3), start]); last = start; }
    }
    return contours.filter((c) => c.length);
  }
  function split(c, n) {
    const out = []; let rest = c;
    for (let i = n; i > 1; i--) {
      const t = 1 / i, [a, b, cc, d] = rest;
      const ab = lerp2(a, b, t), bc = lerp2(b, cc, t), cd = lerp2(cc, d, t), abc = lerp2(ab, bc, t), bcd = lerp2(bc, cd, t), m = lerp2(abc, bcd, t);
      out.push([a, ab, abc, m]); rest = [m, bcd, cd, d];
    }
    out.push(rest); return out;
  }

  // ── Flat layout ──────────────────────────────────────────────────────────────────────────
  function metrics(font, copy) {
    const upm = font.unitsPerEm, k = SZ / upm, g = (ch) => font.charToGlyph(ch);
    let yMax = 0, yMin = 0;
    for (const ch of new Set(copy.replace(/\s/g, ''))) { const bb = g(ch).getBoundingBox(); yMax = Math.max(yMax, bb.y2); yMin = Math.min(yMin, bb.y1); }
    return { k, asc: yMax * k, desc: -yMin * k, clear: (yMax - yMin) * k, space: (g(' ').advanceWidth || upm * 0.25) * k, cap: g('H').getBoundingBox().y2 * k };
  }
  function measurer(font, M) {
    const cache = new Map();
    return (w) => {
      if (cache.has(w)) return cache.get(w);
      const gs = [...w].map((ch) => font.charToGlyph(ch)); let x = 0;
      gs.forEach((gl, i) => { x += gl.advanceWidth * M.k; if (i < gs.length - 1) x += font.getKerningValue(gl, gs[i + 1]) * M.k; });
      const b0 = gs[0].getBoundingBox(), bN = gs[gs.length - 1].getBoundingBox();
      const r = { w, gs, adv: x, lsb: b0.x1 * M.k, rsb: (gs[gs.length - 1].advanceWidth - bN.x2) * M.k };
      cache.set(w, r); return r;
    };
  }
  // Ink width of a line; `track` is extra space between letters inside words (type px at SZ).
  function lineInk(line, space, track = 0) { let t = 0; line.forEach((w, i) => { t += w.adv + (w.gs.length - 1) * track + (i ? space : 0); }); return t - line[0].lsb - line[line.length - 1].rsb; }
  const inkOf = (line, f, k) => Math.max(...line.flatMap((w) => w.gs.map((gl) => f(gl.getBoundingBox())))) * k;

  // One glyph's outline at (xx, base), widened by sx and leaned by `lean` (tan of the angle).
  function outline(gl, xx, base, sx, lean, piece) {
    const cmds = gl.getPath(0, base, SZ).commands.map((c) => {
      const o = { ...c };
      for (const [kx, ky] of [['x', 'y'], ['x1', 'y1'], ['x2', 'y2']]) if (c[kx] !== undefined) o[kx] = xx + c[kx] * sx + (base - c[ky]) * lean;
      return o;
    });
    return cubics(cmds).map((ct) => ct.flatMap((cb) => {
      const est = Math.hypot(cb[1][0] - cb[0][0], cb[1][1] - cb[0][1]) + Math.hypot(cb[2][0] - cb[1][0], cb[2][1] - cb[1][1]) + Math.hypot(cb[3][0] - cb[2][0], cb[3][1] - cb[2][1]);
      return split(cb, Math.max(1, Math.ceil(est / piece)));
    }));
  }

  // Breaks n lines of `width` from the words, justified: word gaps take up to half a space
  // more, then letters widen up to 30%, and only the rest becomes letter spacing.
  function breakLines(measure, words, n, width, space) {
    const lines = []; let wi = 0;
    for (let li = 0; li < n; li++) {
      const line = [];
      for (;;) {
        const w = measure(words[wi % words.length]);
        if (line.length && lineInk([...line, w], space) > width) break;
        line.push(w); wi++;
      }
      lines.push(line);
    }
    return { lines, words: wi };
  }
  function setLine(font, M, line, width, base, lean, out, justify = true, track0 = 0, pieceEm = 0.06) {
    const space = M.space, gaps = line.length - 1, ink = lineInk(line, space, track0);
    let gap = space, sx = 1, track = track0;
    if (justify) {
      const extra = width - ink, pairs = line.reduce((n, w) => n + w.gs.length - 1, 0);
      const toWords = gaps ? Math.min(extra, gaps * space * 0.5) : 0;
      gap = space + (gaps ? toWords / gaps : 0);
      const body = ink - gaps * space;
      sx = Math.min(1.3, 1 + (extra - toWords) / body);
      track = track0 + (pairs ? (extra - toWords - (sx - 1) * body) / pairs : 0);
    }
    let x = -line[0].lsb * sx;
    const piece = SZ * pieceEm; // outline pieces this long (em) follow the curve
    for (const w of line) {
      let xx = x;
      w.gs.forEach((gl, i) => {
        const contours = outline(gl, xx, base, sx, lean, piece);
        const adv = gl.advanceWidth * M.k * sx;
        if (contours.length) out.push({ contours, cx: xx + adv / 2, base });
        xx += adv; if (i < w.gs.length - 1) xx += font.getKerningValue(gl, w.gs[i + 1]) * M.k * sx + track;
      });
      x += w.adv * sx + (w.gs.length - 1) * track + gap;
    }
    return x - gap;
  }

  // ── Paths for ribbons, in unit coordinates (y down) ─────────────────────────────────────
  function table(pts) {
    const len = [0];
    for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const L = len[len.length - 1];
    const tan = pts.map((_, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / d, (b[1] - a[1]) / d]; });
    function at(s) {
      s = Math.min(L, Math.max(0, s));
      let lo = 0, hi = len.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (len[m] < s) lo = m; else hi = m; }
      const f = (s - len[lo]) / (len[hi] - len[lo] || 1);
      const tx = tan[lo][0] + (tan[hi][0] - tan[lo][0]) * f, ty = tan[lo][1] + (tan[hi][1] - tan[lo][1]) * f, tl = Math.hypot(tx, ty) || 1;
      return [pts[lo][0] + (pts[hi][0] - pts[lo][0]) * f, pts[lo][1] + (pts[hi][1] - pts[lo][1]) * f, tx / tl, ty / tl];
    }
    // signed curvature at each sample, for the fold check
    const kappa = pts.map((_, i) => {
      if (i === 0 || i === pts.length - 1) return 0;
      const a = tan[i - 1], b = tan[i + 1], ds = len[i + 1] - len[i - 1] || 1;
      return (a[0] * b[1] - a[1] * b[0]) / ds;
    });
    return { at, L, len, kappa };
  }
  const PATHS = {
    catmull({ pts }) {
      const P = [pts[0], ...pts, pts[pts.length - 1]], out = [];
      for (let i = 1; i < P.length - 2; i++) {
        const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
        for (let k = 0; k < 200; k++) {
          const t = k / 200, t2 = t * t, t3 = t2 * t;
          out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
        }
      }
      out.push(pts[pts.length - 1]); return out;
    },
    // Arc of a circle, clockwise on screen from angle a0 to a1 (degrees, 0 = right, 90 = down).
    arc({ c, r, a0, a1 }) {
      const out = [];
      for (let i = 0; i <= 4000; i++) { const a = (a0 + (a1 - a0) * i / 4000) * Math.PI / 180; out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); }
      return out;
    },
    // Logarithmic spiral r = r0·g^(turns), clockwise on screen, from turn t0 to t1.
    // `lead` adds a straight run before the start, along the starting direction.
    logspiral({ c, r0, g, t0, t1, a0 = 0, lead = 0 }) {
      const out = [];
      for (let i = 0; i <= 6000; i++) { const t = t0 + (t1 - t0) * i / 6000, a = a0 * Math.PI / 180 + t * 2 * Math.PI, r = r0 * Math.pow(g, t); out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); }
      if (lead) {
        const [p, q] = out, d = Math.hypot(q[0] - p[0], q[1] - p[1]), tx = (q[0] - p[0]) / d, ty = (q[1] - p[1]) / d;
        for (let i = 1; i <= 600; i++) out.unshift([p[0] - tx * lead * i / 600, p[1] - ty * lead * i / 600]);
      }
      return out;
    },
    // Cornu (Euler) spiral: curvature grows linearly along the line, so both ends curl.
    cornu({ s0, s1, rot = 0 }) {
      const out = []; let x = 0, y = 0; const N = 6000, ds = (s1 - s0) / N, cr = Math.cos(rot * Math.PI / 180), sr = Math.sin(rot * Math.PI / 180);
      for (let i = 0; i <= N; i++) {
        const s = s0 + i * ds, th = s * s / 2;
        out.push([x * cr - y * sr, x * sr + y * cr]);
        x += Math.cos(th) * ds; y += Math.sin(th) * ds;
      }
      return out;
    },
    // Joins straight runs and half circles: a band that folds back and forth.
    meander({ cols, top, bottom, x0, dx }) {
      const out = [], r = dx / 2;
      for (let c = 0; c < cols; c++) {
        const x = x0 + c * dx, down = c % 2 === 0;
        const ya = down ? top + (c ? r : 0) : bottom - r, yb = down ? bottom - (c < cols - 1 ? r : 0) : top + r;
        for (let i = 0; i <= 600; i++) out.push([x, ya + (yb - ya) * i / 600]);
        if (c < cols - 1) {
          const cy = down ? bottom - r : top + r, cx = x + r;
          for (let i = 1; i < 600; i++) { const a = down ? Math.PI - Math.PI * i / 600 : Math.PI + Math.PI * i / 600; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
        }
      }
      return out;
    },
  };
  // A profile along the line: keys [[u, value], …], eased between keys.
  function profile(keys) {
    if (typeof keys === 'number') return () => keys;
    if (typeof keys === 'function') return keys;
    return (u) => {
      if (u <= keys[0][0]) return keys[0][1];
      for (let i = 1; i < keys.length; i++) if (u <= keys[i][0]) {
        const [u0, v0] = keys[i - 1], [u1, v1] = keys[i], t = (u - u0) / (u1 - u0), e = t * t * (3 - 2 * t);
        return v0 + (v1 - v0) * e;
      }
      return keys[keys.length - 1][1];
    };
  }

  // ── Compositions ─────────────────────────────────────────────────────────────────────────
  function words(copy) { return copy.split(/\s+/).filter(Boolean); }

  function whorl(font, copy, c, M) {
    const measure = measurer(font, M), W = words(copy), lean = Math.tan((c.lean || 0) * Math.PI / 180);
    const lead = M.clear * (c.leading || 1), P = (c.n || 1) * lead;
    const t = Math.log(c.G) / (2 * Math.PI), beta = 2 * Math.PI * t / (P * (1 + t * t)), alpha = t * beta, amod = Math.hypot(alpha, beta);
    // Where the line must end so the first letter, at the centre, comes out c.inner px tall.
    const F = (S / 2) / Math.exp(beta * M.asc);
    const xEnd = Math.log(M.cap * amod * F / c.inner) / alpha;
    // Lay one line (or n lines of the same length) word by word to that length.
    const glyphs = []; let wi = 0, x1 = 0;
    for (let li = 0; li < (c.n || 1); li++) {
      const line = []; let ink = 0;
      while (true) { const w = measure(W[wi % W.length]); const next = lineInk([...line, w], M.space); if (line.length && next > xEnd) break; line.push(w); wi++; ink = next; }
      x1 = Math.max(x1, ink);
      setLine(font, M, line, xEnd, li * lead, lean, glyphs, (c.n || 1) > 1);
    }
    const map = (x, y) => { const lr = alpha * (x - x1) - beta * y, an = beta * (x - x1) + alpha * y; const r = Math.exp(lr); return [r * Math.cos(an), r * Math.sin(an)]; };
    return { glyphs, map, rotate: true, words: wi, lines: c.n || 1, note: { alpha, beta, turns: x1 * beta / (2 * Math.PI) } };
  }

  // One strand: n lines stacked into a band along a centreline. Each line has its own size
  // (sizes[i], a share of the band), its own span of the line (spans[i] = [u0, u1]) and its
  // own alignment ('start', 'end', 'centre'); lines are justified only when c.justify is set.
  // Band thickness sets the type size at each point, so letters swell and taper and round
  // over the inside of every bend. Words are taken from W starting at wi.
  function strand(font, M, measure, W, wi0, c) {
    const lean = Math.tan((c.lean || 0) * Math.PI / 180);
    const T = table(PATHS[c.path.type](c.path)), shear = profile(c.shear || 0), aspect = c.aspect || 1;
    // thick: a number, keys along the line, a function of u, or { rel } = that share of the
    // distance from the path's centre, so the type grows as a spiral opens.
    const h = c.thick && c.thick.rel ? (u) => { const p = T.at(u * T.L); return c.thick.rel * Math.min(c.thick.max || Infinity, Math.hypot(p[0] - c.path.c[0], p[1] - c.path.c[1])); } : profile(c.thick);
    const tr = (c.track || 0) * SZ; // letter spacing, in em
    const n = c.n || 1, sz = c.sizes || Array(n).fill(1), sp = c.spans || [], al = c.align || [], ld = c.leading || 1;
    const span = (i) => sp[i] || [0, 1];
    // x along the type ↔ arc length: letters keep their proportions at the band's centre.
    const N = 4000, X = new Float64Array(N + 1);
    for (let i = 1; i <= N; i++) { const u = (i - 0.5) / N; X[i] = X[i - 1] + (T.L / N) / (h(u) * aspect); }
    const Xu = (u) => { const f = Math.min(N, Math.max(0, u * N)), i = Math.min(N - 1, Math.floor(f)); return X[i] + (X[i + 1] - X[i]) * (f - i); };
    // Baselines: each line sits one font extent (at its own size) below the last.
    let H = 0, lines, base, wi, fit;
    const bases = (top) => { const b = [top]; for (let i = 1; i < n; i++) b.push(b[i - 1] + (M.desc * sz[i - 1] + M.asc * sz[i]) * ld); return b; };
    base = bases(M.asc * sz[0]); H = base[n - 1] + M.desc * sz[n - 1];
    for (let it = 0; it < 3; it++) {
      lines = []; fit = []; wi = wi0;
      for (let i = 0; i < n; i++) {
        const [u0, u1] = span(i), width = (Xu(u1) - Xu(u0)) * H / sz[i], line = [];
        for (;;) { const w = measure(W[wi % W.length]); if (line.length && lineInk([...line, w], M.space, tr) > width) break; line.push(w); wi++; }
        // One word longer than the span: that line is set smaller, so it never runs past the band.
        lines.push(line); fit.push(Math.min(1, width / lineInk(line, M.space, tr)));
      }
      base = bases(inkOf(lines[0], (b) => b.y2, M.k) * sz[0]);
      H = base[n - 1] + inkOf(lines[n - 1], (b) => -b.y1, M.k) * sz[n - 1];
    }
    const glyphs = [];
    lines.forEach((line, i) => {
      const [u0, u1] = span(i), s = sz[i] * fit[i], width = (Xu(u1) - Xu(u0)) * H / s, tmp = [];
      const len = setLine(font, M, line, width, 0, lean, tmp, !!c.justify, tr, c.piece || 0.06), a = al[i] || 'start';
      const off = Xu(u0) * H + (a === 'end' ? width - len : a === 'centre' ? (width - len) / 2 : 0) * s;
      for (const g of tmp) glyphs.push({ contours: g.contours.map((ct) => ct.map((cb) => cb.map((p) => [off + p[0] * s, base[i] + p[1] * s]))), cx: off + g.cx * s, base: base[i], size: s });
    });
    const sOf = (x) => {
      const v = x / H; if (v <= 0) return v / X[1] * (T.L / N);
      let lo = 0, hi = N; if (v >= X[N]) return T.L + (v - X[N]) * h(1) * aspect;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (X[m] < v) lo = m; else hi = m; }
      return (lo + (v - X[lo]) / (X[hi] - X[lo])) * T.L / N;
    };
    const map = (x, y) => {
      const s = sOf(x), u = Math.min(1, Math.max(0, s / T.L)), [px, py, tx, ty] = T.at(s), hh = h(u);
      const d = (0.5 - y / H) * hh, a = (s - Math.min(T.L, Math.max(0, s))) + d * shear(u);
      return [px + tx * a + ty * d, py + ty * a - tx * d];
    };
    for (const g of glyphs) g.map = map;
    // Fold check: half the band must stay inside the radius of every bend.
    let fold = 0; T.kappa.forEach((k, i) => { fold = Math.max(fold, Math.abs(k) * h(T.len[i] / T.L) / 2); });
    // The band, sampled, for the clearance check between strands.
    const band = []; for (let i = 0; i <= 400; i++) { const u = i / 400, p = T.at(u * T.L); band.push([p[0], p[1], h(u)]); }
    return { glyphs, words: wi - wi0, fold, band, line: Math.min(...sz) / sz.reduce((a, b) => a + b, 0), H, Wt: X[N] * H, L: T.L };
  }

  function ribbon(font, copy, c, M) {
    const R = strand(font, M, measurer(font, M), words(copy), 0, { justify: true, ...c });
    return { glyphs: R.glyphs, words: R.words, lines: c.n, note: { fold: R.fold }, bands: [R] };
  }

  // Several strands in one square, the copy running on from one to the next.
  // Relax: where two strands come closer than `gap` (unit coordinates), both bands thin there,
  // smoothly, until every gap is at least `gap`. Returns each strand with its thinned thickness.
  function relax(strands, gap) {
    const K = 400, F = strands.map((st) => {
      const T = table(PATHS[st.path.type](st.path)), h0 = st.thick && st.thick.rel ? (u) => { const p = T.at(u * T.L); return st.thick.rel * Math.min(st.thick.max || Infinity, Math.hypot(p[0] - st.path.c[0], p[1] - st.path.c[1])); } : profile(st.thick);
      const pts = []; for (let i = 0; i <= K; i++) { const p = T.at(i / K * T.L); pts.push([p[0], p[1], h0(i / K)]); }
      return { T, h0, pts, m: new Float64Array(K + 1).fill(1) };
    });
    // Candidate sample pairs: close enough to ever touch.
    const pairs = [];
    const box = F.map((f) => { let b = [Infinity, Infinity, -Infinity, -Infinity, 0]; for (const p of f.pts) b = [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1]), Math.max(b[4], p[2])]; return b; });
    for (let a = 0; a < F.length; a++) for (let b = a + 1; b < F.length; b++) {
      const A = box[a], B = box[b], pad = A[4] / 2 + B[4] / 2 + gap;
      if (A[0] > B[2] + pad || B[0] > A[2] + pad || A[1] > B[3] + pad || B[1] > A[3] + pad || (strands[a].rigid && strands[b].rigid)) continue;
      for (let i = 0; i <= K; i += 2) for (let j = 0; j <= K; j += 2) {
      const P = F[a].pts[i], Q = F[b].pts[j], d = Math.hypot(P[0] - Q[0], P[1] - Q[1]);
      if (d < P[2] / 2 + Q[2] / 2 + gap) pairs.push([a, i, b, j, d]);
    } }
    for (let it = 0; it < 400; it++) {
      const hit = F.map(() => new Float64Array(K + 1)); let any = false;
      for (const [a, i, b, j, d] of pairs) {
        const ha = F[a].pts[i][2] * F[a].m[i], hb = F[b].pts[j][2] * F[b].m[j], e = ha / 2 + hb / 2 + gap - d;
        if (e > 0) {
          any = true; const ra = strands[a].rigid, rb = strands[b].rigid, w = (ra ? 0 : ha) + (rb ? 0 : hb) || 1;
          hit[a][i] = Math.max(hit[a][i], e / w); hit[b][j] = Math.max(hit[b][j], e / w);
        }
      }
      if (!any) break;
      F.forEach((f, k) => {
        if (strands[k].rigid) return; // rings keep their thickness; the free lines give way
        const sig = Math.max(4, 0.06 / f.T.L * K); // about 0.06 units along the line
        const H = hit[k];
        for (let i = 0; i <= K; i++) if (H[i] > 0 && !(H[i - 1] > H[i]) && !(H[i + 1] >= H[i])) { // each run's peak only
          const amt = Math.min(0.12, H[i] + 0.01);
          for (let j = Math.max(0, Math.floor(i - 3 * sig)); j <= Math.min(K, Math.ceil(i + 3 * sig)); j++) f.m[j] = Math.max(0.2, f.m[j] * (1 - amt * Math.exp(-0.5 * ((j - i) / sig) ** 2)));
        }
      });
    }
    return strands.map((st, k) => { const f = F[k]; return { ...st, thick: (u) => { const x = Math.min(K, Math.max(0, u * K)), i = Math.min(K - 1, Math.floor(x)); return f.h0(u) * (f.m[i] + (f.m[i + 1] - f.m[i]) * (x - i)); } }; });
  }

  function field(font, copy, c, M) {
    const measure = measurer(font, M), W = words(copy), glyphs = [], bands = []; let wi = 0, lines = 0, fold = 0;
    for (const st of (c.gap ? relax(c.strands, c.gap) : c.strands)) {
      const R = strand(font, M, measure, W, wi, { lean: c.lean, track: c.track, piece: c.piece, ...st });
      const k = bands.length; for (const g of R.glyphs) g.strand = k;
      glyphs.push(...R.glyphs); bands.push(R); wi += R.words; lines += st.n || 1; fold = Math.max(fold, R.fold);
    }
    return { glyphs, words: wi, lines, note: { fold, strands: c.strands.length }, bands };
  }

  // A smooth warp of the whole plane: a few long sine waves in x and in y. Kept gentle enough
  // (its stretch stays well under 1) that it can never fold, so nested rings bend into organic
  // shapes but never cross, whatever angle each ring is turned to first.
  function makeWarp({ amp = 0.03, freq = 1.3, seed = 1, waves = 3 } = {}) {
    let t = seed >>> 0; const rnd = () => { t += 0x6D2B79F5; let x = Math.imul(t ^ t >>> 15, 1 | t); x ^= x + Math.imul(x ^ x >>> 7, 61 | x); return ((x ^ x >>> 14) >>> 0) / 4294967296; };
    const make = () => Array.from({ length: waves }, () => { const d = rnd() * Math.PI * 2, k = 2 * Math.PI * freq * (0.7 + rnd() * 0.6); return [Math.cos(d) * k, Math.sin(d) * k, rnd() * Math.PI * 2, amp * (0.6 + rnd() * 0.4) / Math.sqrt(waves)]; });
    const WX = make(), WY = make();
    const f = (x, y) => { let dx = 0, dy = 0; for (const [a, b, p, m] of WX) dx += m * Math.sin(a * x + b * y + p); for (const [a, b, p, m] of WY) dy += m * Math.sin(a * x + b * y + p); return [x + dx, y + dy]; };
    // Largest stretch over the frame, for the record (must stay below 1).
    let g = 0; for (let i = -2; i <= 12; i++) for (let j = -2; j <= 12; j++) { const x = i / 10, y = j / 10, e = 1e-4, p = f(x, y), qx = f(x + e, y), qy = f(x, y + e); g = Math.max(g, Math.hypot(qx[0] - p[0] - e, qx[1] - p[1]) / e, Math.hypot(qy[0] - p[0], qy[1] - p[1] - e) / e); }
    f.stretch = g; f.waves = { x: WX, y: WY }; return f;
  }

  // ── Build: lay out, map, fit to the square ──────────────────────────────────────────────
  function build(font, copy, c) {
    const M = metrics(font, copy);
    const R = ({ whorl, ribbon, field })[c.type || 'ribbon'](font, copy, c, M);
    // Map every control point. Keep, per glyph, its local scale (output units per type px).
    // c.warp: the whole plane bent after the layout. c.keepUnit keeps each glyph unwarped in unit
    // coordinates with its strand, so a page can turn strands and warp again on every frame.
    const warp = c.warp ? makeWarp(c.warp) : null, units = c.keepUnit ? [] : null;
    // c.keepFlat: each glyph as laid flat, before any map, with its strand, so a page can map
    // it again on every frame (a shader, say) with a different thickness along the line.
    const flat = c.keepFlat ? R.glyphs.map((g) => ({ strand: g.strand || 0, contours: g.contours.map((ct) => { const a = new Float32Array(2 + ct.length * 6); a[0] = ct[0][0][0]; a[1] = ct[0][0][1]; ct.forEach((cb, i) => { for (let j = 1; j < 4; j++) { a[2 + i * 6 + (j - 1) * 2] = cb[j][0]; a[3 + i * 6 + (j - 1) * 2] = cb[j][1]; } }); return a; }) })) : null;
    const mapped = R.glyphs.map((g) => {
      const map0 = g.map || R.map, map = warp ? (x, y) => { const p = map0(x, y); return warp(p[0], p[1]); } : map0;
      if (units) units.push({ strand: g.strand || 0, contours: g.contours.map((ct) => { const a = new Float32Array(2 + ct.length * 6), p = map0(ct[0][0][0], ct[0][0][1]); a[0] = p[0]; a[1] = p[1]; ct.forEach((cb, i) => { for (let j = 1; j < 4; j++) { const q = map0(cb[j][0], cb[j][1]); a[2 + i * 6 + (j - 1) * 2] = q[0]; a[3 + i * 6 + (j - 1) * 2] = q[1]; } }); return a; }) });
      const k = g.size || 1, p0 = map(g.cx, g.base - M.cap * k / 2), p1 = map(g.cx, g.base - M.cap * k / 2 - 1);
      // scale: output units per type px at this glyph's own size
      return { scale: Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) * k, contours: g.contours.map((ct) => ct.map((cb) => cb.map((p) => map(p[0], p[1])))) };
    });
    // Whorls may turn freely: choose the turn that makes the ink most square.
    let rot = c.rotate || 0;
    if ((R.rotate || c.spin) && c.rotate === undefined) {
      const pts = []; mapped.forEach((g) => g.contours.forEach((ct) => ct.forEach((cb) => pts.push(cb[3]))));
      const sample = pts.filter((_, i) => i % 3 === 0); let best = Infinity;
      const [d0, d1] = c.spin === 'upright' ? [-90, 90] : [0, 360]; // keep ribbons reading upright
      for (let d = d0; d < d1; d += 0.5) {
        const a = d * Math.PI / 180, cs = Math.cos(a), sn = Math.sin(a); let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (const p of sample) { const x = p[0] * cs - p[1] * sn, y = p[0] * sn + p[1] * cs; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        const e = Math.abs(Math.log((x1 - x0) / (y1 - y0))) + (c.preferAngle !== undefined ? Math.abs(((d - c.preferAngle + 540) % 360) - 180) * 1e-5 : 0);
        if (e < best) { best = e; rot = d; }
      }
    }
    const ca = Math.cos(rot * Math.PI / 180), sa = Math.sin(rot * Math.PI / 180);
    // Ink bounds, sampling each piece at its ends and middle.
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity; const ext = [null, null, null, null];
    for (const g of mapped) for (const ct of g.contours) for (const cb of ct) {
      for (let j = 0; j < 4; j++) { const p = cb[j]; cb[j] = [p[0] * ca - p[1] * sa, p[0] * sa + p[1] * ca]; }
      const [a, b, cc, d] = cb, m = [(a[0] + 3 * b[0] + 3 * cc[0] + d[0]) / 8, (a[1] + 3 * b[1] + 3 * cc[1] + d[1]) / 8];
      for (const p of [d, m]) {
        if (p[0] < x0) { x0 = p[0]; ext[0] = g; } if (p[0] > x1) { x1 = p[0]; ext[1] = g; }
        if (p[1] < y0) { y0 = p[1]; ext[2] = g; } if (p[1] > y1) { y1 = p[1]; ext[3] = g; }
      }
    }
    // Bleed: the unit square is the frame; strands run off its edges and are cut there.
    if (c.bleed) { x0 = 0; y0 = 0; x1 = 1; y1 = 1; }
    // Margin: one word space at the size of the type touching the edges.
    const edgeScale = ext.reduce((t, g) => t + g.scale, 0) / 4;
    const bw = x1 - x0, bh = y1 - y0, f = S / (Math.max(bw, bh) + 2 * M.space * edgeScale);
    const m = c.bleed ? 0 : M.space * edgeScale * f; let sx = (S - 2 * m) / bw, sy = (S - 2 * m) / bh;
    // c.uniform: keep proportions and centre the short side instead of stretching it.
    let ox = m, oy = m;
    if (c.uniform) { const k = Math.min(sx, sy); ox += (S - 2 * m - bw * k) / 2; oy += (S - 2 * m - bh * k) / 2; sx = sy = k; }
    // c.maxSquash: stretch at most this much; past it, centre the short side.
    if (c.maxSquash !== undefined) {
      const q = 1 + c.maxSquash;
      if (sx > sy * q) { const k = sy * q; ox += (S - 2 * m - bw * k) / 2; sx = k; }
      else if (sy > sx * q) { const k = sx * q; oy += (S - 2 * m - bh * k) / 2; sy = k; }
    }
    const out = [];
    let minCap = Infinity, maxCap = 0;
    for (const g of mapped) {
      const cap = g.scale * M.cap * Math.sqrt(sx * sy); minCap = Math.min(minCap, cap); maxCap = Math.max(maxCap, cap);
      const flat = g.contours.map((ct) => { const a = new Float32Array(2 + ct.length * 6); a[0] = ox + (ct[0][0][0] - x0) * sx; a[1] = oy + (ct[0][0][1] - y0) * sy; ct.forEach((cb, i) => { for (let j = 1; j < 4; j++) { a[2 + i * 6 + (j - 1) * 2] = ox + (cb[j][0] - x0) * sx; a[3 + i * 6 + (j - 1) * 2] = oy + (cb[j][1] - y0) * sy; } }); return a; });
      out.push(flat);
    }
    // Bands in output px, for the clearance check: [x, y, thickness] along each strand.
    const k = Math.sqrt(sx * sy), bands = (R.bands || []).map((b) => ({ line: b.line, pts: b.band.map(([x0w, y0w, hh]) => { const [x, y] = warp ? warp(x0w, y0w) : [x0w, y0w], xr = x * ca - y * sa, yr = x * sa + y * ca; return [ox + (xr - x0) * sx, oy + (yr - y0) * sy, hh * k]; }) }));
    return { glyphs: out, units, flat, strands: (R.bands || []).map((b) => ({ H: b.H, Wt: b.Wt, L: b.L })), stretch: warp ? warp.stretch : 0, margin: m, mx: ox, my: oy, bleed: !!c.bleed, squash: sx / sy, rot, minCap, maxCap, count: out.length, words: R.words, lines: R.lines, note: R.note, bands };
  }

  function draw(ctx, glyphs) {
    for (const g of glyphs) for (const a of g) {
      ctx.moveTo(a[0], a[1]);
      for (let i = 2; i < a.length; i += 6) ctx.bezierCurveTo(a[i], a[i + 1], a[i + 2], a[i + 3], a[i + 4], a[i + 5]);
      ctx.closePath();
    }
  }

  G.Stack = { S, build, draw, PATHS, table, makeWarp };
})(G);

export const Stack = G.Stack;
