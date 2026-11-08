/**
 * The three-way merge: what Area wrote last time (base), what the project holds now (yours), what Area writes now (new).
 * Line by line: a stretch only one side changed takes that side; both changed it the same way, it takes that; both
 * changed it differently, it is a conflict, written between markers with both versions so a person or an agent can
 * choose. Dependency-free: Myers' diff for the line matches, then the classic diff3 walk over stretches stable in all
 * three.
 */

/** Matched lines of a and b, as index pairs in order (Myers' O((N+M)D) diff, the longest common subsequence). */
export function matches(a: readonly string[], b: readonly string[]): Array<[number, number]> {
  // Trim the common head and tail first: most regenerations change little.
  let head = 0;
  while (head < a.length && head < b.length && a[head] === b[head]) head++;
  let tail = 0;
  while (tail < a.length - head && tail < b.length - head && a[a.length - 1 - tail] === b[b.length - 1 - tail]) tail++;
  const A = a.slice(head, a.length - tail), B = b.slice(head, b.length - tail);
  const n = A.length, m = B.length, max = n + m;
  const v = new Map<number, number>([[1, 0]]);
  const trace: Array<Map<number, number>> = [];
  let found = n === 0 && m === 0;
  for (let d = 0; d <= max && !found; d++) {
    trace.push(new Map(v));
    for (let k = -d; k <= d; k += 2) {
      let x = k === -d || (k !== d && (v.get(k - 1) ?? -1) < (v.get(k + 1) ?? -1)) ? v.get(k + 1) ?? 0 : (v.get(k - 1) ?? 0) + 1;
      let y = x - k;
      while (x < n && y < m && A[x] === B[y]) { x++; y++; }
      v.set(k, x);
      if (x >= n && y >= m) { found = true; break; }
    }
  }
  // Walk back through the trace for the snakes.
  const pairs: Array<[number, number]> = [];
  let x = n, y = m;
  for (let d = trace.length - 1; d >= 0 && (x > 0 || y > 0); d--) {
    const vd = trace[d]!;
    const k = x - y;
    const prevK = k === -d || (k !== d && (vd.get(k - 1) ?? -1) < (vd.get(k + 1) ?? -1)) ? k + 1 : k - 1;
    const prevX = vd.get(prevK) ?? 0, prevY = prevX - prevK;
    while (x > prevX && y > prevY) { x--; y--; pairs.push([x, y]); }
    if (d > 0) { x = prevX; y = prevY; }
  }
  while (x > 0 && y > 0 && A[x - 1] === B[y - 1]) { x--; y--; pairs.push([x, y]); }
  pairs.reverse();
  const out: Array<[number, number]> = [];
  for (let i = 0; i < head; i++) out.push([i, i]);
  for (const [i, j] of pairs) out.push([i + head, j + head]);
  for (let t = 0; t < tail; t++) out.push([a.length - tail + t, b.length - tail + t]);
  return out;
}

export interface MergeResult {
  text: string;
  conflicts: number;
}

const lines = (text: string) => {
  const list = text.split("\n");
  return { list, final: list[list.length - 1] === "" ? list.pop() === "" : false };
};

export interface Labels { yours: string; theirs: string }

export function merge3(base: string, yours: string, theirs: string, labels: Labels = { yours: "yours", theirs: "Area" }): MergeResult {
  if (yours === theirs) return { text: yours, conflicts: 0 };
  if (base === yours) return { text: theirs, conflicts: 0 };
  if (base === theirs) return { text: yours, conflicts: 0 };
  const O = lines(base).list, A = lines(yours).list, B = lines(theirs).list;
  const endsA = yours.endsWith("\n"), endsB = theirs.endsWith("\n");
  const toA = new Map(matches(O, A)), toB = new Map(matches(O, B));
  const out: string[] = [];
  let conflicts = 0;
  let o = 0, a = 0, b = 0;
  const same = (x: readonly string[], y: readonly string[]) => x.length === y.length && x.every((line, i) => line === y[i]);
  const settle = (oEnd: number, aEnd: number, bEnd: number) => {
    const so = O.slice(o, oEnd), sa = A.slice(a, aEnd), sb = B.slice(b, bEnd);
    if (same(sa, sb)) out.push(...sa);
    else if (same(so, sa)) out.push(...sb);
    else if (same(so, sb)) out.push(...sa);
    else {
      conflicts++;
      out.push(`<<<<<<< ${labels.yours}`, ...sa, "=======", ...sb, `>>>>>>> ${labels.theirs}`);
    }
  };
  for (let i = 0; i < O.length; i++) {
    const ai = toA.get(i), bi = toB.get(i);
    if (ai === undefined || bi === undefined || ai < a || bi < b) continue;
    // A line stable in all three: settle what lies before it, then keep it.
    if (i > o || ai > a || bi > b) settle(i, ai, bi);
    out.push(O[i]!);
    o = i + 1; a = ai + 1; b = bi + 1;
  }
  if (o < O.length || a < A.length || b < B.length) settle(O.length, A.length, B.length);
  let text = out.join("\n");
  // The split's final empty line: a file ending in a newline keeps it (both sides agreeing, or the new one's).
  if ((endsA && endsB) || (!conflicts && (endsA || endsB))) text = text.replace(/\n?$/, "\n");
  return { text, conflicts };
}
