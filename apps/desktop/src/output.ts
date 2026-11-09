/**
 * Write to folder, the page's half (electron/output.cjs; docs/research/system-output-2026-11-08): a system's version
 * written into a project's folder as code that project owns. What a write did is said in design words (PRODUCT_UI.md
 * rule 24): a file Area and the project both changed is "updated around your edits", never merged; two changes to one
 * line are "two changes side by side", never a conflict. Pure; tests/output.test.ts.
 */

export type OutputAction = OutputPlan["steps"][number]["action"];

/** How each kind of file reads, in a sentence's order. */
const WORDS: ReadonlyArray<[OutputAction[], (n: number) => string]> = [
  [["added"], n => `${n} new`],
  [["updated"], n => `${n} updated`],
  [["merged"], n => `${n} updated around your edits`],
  [["kept-edits"], n => `${n} ${n === 1 ? "keeps" : "keep"} your edits`],
  [["conflict", "exists"], n => `${n} with two changes side by side for you to choose`],
  [["removed"], n => `${n} removed`],
  [["left"], n => `${n} kept as you edited ${n === 1 ? "it" : "them"}, no longer part of the system`],
  [["skipped"], n => `${n} you removed ${n === 1 ? "stays" : "stay"} removed`],
];

/** "220 files: 218 new, 2 updated around your edits." Unchanged files go unsaid; nothing at all is said as such. */
export function describeWrite(summary: OutputPlan["summary"]): string {
  const parts = WORDS.flatMap(([actions, say]) => {
    const n = actions.reduce((sum, action) => sum + (summary[action] ?? 0), 0);
    return n ? [say(n)] : [];
  });
  const changed = WORDS.reduce((sum, [actions]) => sum + actions.reduce((s, a) => s + (summary[a] ?? 0), 0), 0);
  if (!changed) return "Nothing to write: the folder already has this version.";
  return `${changed} ${changed === 1 ? "file" : "files"}: ${parts.join(", ")}.`;
}

/** Whether a write leaves choices in the folder: files holding two changes side by side. */
export const choicesIn = (summary: OutputPlan["summary"]) => (summary.conflict ?? 0) + (summary.exists ?? 0);

/** The last folder each system was written to, in this browser's storage. */
const KEY = "area.outputFolders";
export function lastFolder(system: string): string | null {
  try { return (JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, string>)[system] ?? null; } catch { return null; }
}
export function rememberFolder(system: string, path: string): void {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, string>;
    localStorage.setItem(KEY, JSON.stringify({ ...all, [system]: path }));
  } catch {}
}

/** A folder's name, as the dialog says it. */
export const folderName = (path: string) => path.split(/[\\/]/).filter(Boolean).pop() ?? path;
