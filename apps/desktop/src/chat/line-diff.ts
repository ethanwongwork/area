/**
 * A file's change as a Diff's hunks (the Changes view; docs/research/desktop-app-analysis-2026-11-10, T3): the lines
 * that differ between two texts, each with its number in the old and the new file, `context` unchanged lines around
 * them, and the unchanged runs between folded ("12 unchanged lines"). Pure: the changes test imports it.
 *
 * The lines both texts start and end with are set aside first, then the middle is compared by its longest common
 * run of lines. A middle too large to compare (more than LIMIT pairs of lines) reads as all out, then all in.
 */
import type { DiffHunk, DiffLine } from "@area/react";

const LIMIT = 4_000_000;
const linesOf = (text: string | null | undefined) => text == null || text === "" ? [] : text.replace(/\n$/, "").split("\n");

type Op = { kind: "context" | "added" | "deleted"; text: string };

function middle(a: readonly string[], b: readonly string[]): Op[] {
  const n = a.length, m = b.length;
  if (!n || !m || n * m > LIMIT) return [...a.map(text => ({ kind: "deleted" as const, text })), ...b.map(text => ({ kind: "added" as const, text }))];
  // The longest common run's length from each pair of lines on, a row at a time from the end.
  const width = m + 1;
  const table = new Uint32Array((n + 1) * width);
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) {
    table[i * width + j] = a[i] === b[j] ? table[(i + 1) * width + j + 1]! + 1 : Math.max(table[(i + 1) * width + j]!, table[i * width + j + 1]!);
  }
  const ops: Op[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { ops.push({ kind: "context", text: a[i]! }); i++; j++; }
    else if (table[(i + 1) * width + j]! >= table[i * width + j + 1]!) ops.push({ kind: "deleted", text: a[i++]! });
    else ops.push({ kind: "added", text: b[j++]! });
  }
  while (i < n) ops.push({ kind: "deleted", text: a[i++]! });
  while (j < m) ops.push({ kind: "added", text: b[j++]! });
  return ops;
}

export interface LineDiff { hunks: DiffHunk[]; added: number; deleted: number }

/** `before` and `after` as hunks; a text that is null is a file that wasn't there (made, or deleted). */
export function lineDiff(before: string | null | undefined, after: string | null | undefined, context = 3): LineDiff {
  const a = linesOf(before), b = linesOf(after);
  let head = 0;
  while (head < a.length && head < b.length && a[head] === b[head]) head++;
  let tail = 0;
  while (tail < a.length - head && tail < b.length - head && a[a.length - 1 - tail] === b[b.length - 1 - tail]) tail++;
  const ops: Op[] = [
    ...a.slice(0, head).map(text => ({ kind: "context" as const, text })),
    ...middle(a.slice(head, a.length - tail), b.slice(head, b.length - tail)),
    ...a.slice(a.length - tail).map(text => ({ kind: "context" as const, text })),
  ];
  let oldAt = 0, newAt = 0, added = 0, deleted = 0;
  const lines: DiffLine[] = ops.map(op => {
    if (op.kind === "context") return { kind: "context", text: op.text, old: ++oldAt, new: ++newAt };
    if (op.kind === "deleted") { deleted++; return { kind: "deleted", text: op.text, old: ++oldAt }; }
    added++;
    return { kind: "added", text: op.text, new: ++newAt };
  });
  // Keep each changed line and `context` lines around it; what is left between is folded.
  const keep = new Uint8Array(lines.length);
  lines.forEach((line, index) => {
    if (line.kind === "context") return;
    for (let at = Math.max(0, index - context); at <= Math.min(lines.length - 1, index + context); at++) keep[at] = 1;
  });
  const hunks: DiffHunk[] = [];
  let folded = 0, open: DiffHunk | null = null;
  lines.forEach((line, index) => {
    if (!keep[index]) { folded++; open = null; return; }
    if (!open) { open = { ...(folded ? { folded } : {}), lines: [] }; hunks.push(open); folded = 0; }
    open.lines.push(line);
  });
  return { hunks, added, deleted };
}
