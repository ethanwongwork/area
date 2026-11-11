/**
 * The Files tool's model (docs/research/desktop-app-analysis-2026-11-10, T6): a folder's file paths as a tree, a file's
 * and a terminal's lines. Pure: the files test imports it.
 */

export interface FileNode { id: string; label: string; children?: FileNode[] }

/** Paths ("src/app.tsx") as a tree: folders first, each by name; a folder's id is "dir:<path>", a file's its path. */
export function fileTree(paths: readonly string[]): FileNode[] {
  type Dir = { dirs: Map<string, Dir>; files: string[] };
  const root: Dir = { dirs: new Map(), files: [] };
  for (const path of paths) {
    const parts = path.split("/").filter(Boolean);
    let at = root;
    for (const part of parts.slice(0, -1)) { if (!at.dirs.has(part)) at.dirs.set(part, { dirs: new Map(), files: [] }); at = at.dirs.get(part)!; }
    if (parts.length) at.files.push(parts.join("/"));
  }
  const by = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base", numeric: true });
  const nodes = (dir: Dir, prefix: string): FileNode[] => [
    ...[...dir.dirs.keys()].sort(by).map(name => ({ id: `dir:${prefix}${name}`, label: name, children: nodes(dir.dirs.get(name)!, `${prefix}${name}/`) })),
    ...dir.files.sort((a, b) => by(a.split("/").at(-1)!, b.split("/").at(-1)!)).map(path => ({ id: path, label: path.split("/").at(-1)! })),
  ];
  return nodes(root, "");
}

/** The folders that hold a path, as tree ids, so it shows when opened. */
export const foldersOf = (path: string) => path.split("/").slice(0, -1).map((_, index, parts) => `dir:${parts.slice(0, index + 1).join("/")}`);

/** A terminal's run: what was typed and what came back, line by line, in order. */
export interface TermLine { stream: "in" | "out" | "err" | "note"; text: string }
/** Output added to a run's lines, split at line ends, the last line left open for what comes next. */
export function appendOutput(lines: readonly TermLine[], text: string, stream: "out" | "err", limit = 4000): TermLine[] {
  const next = [...lines];
  const parts = text.split("\n");
  parts.forEach((part, index) => {
    const last = next.at(-1);
    if (index === 0 && last && last.stream === stream && !last.text.endsWith("\n")) next[next.length - 1] = { stream, text: last.text + part + (parts.length > 1 ? "\n" : "") };
    else if (part || index < parts.length - 1) next.push({ stream, text: part + (index < parts.length - 1 ? "\n" : "") });
  });
  return next.length > limit ? next.slice(next.length - limit) : next;
}
