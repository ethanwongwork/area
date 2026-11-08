// One vocabulary for changes (components audit D6, 2026-11-07; Governance § 4, "Change words"): what happened to a file
// or a line since it was last kept. Tree view rows, Tabs and Edit summary (its counts and its Diff) speak these words and
// paint them in `--area-fg-change-<status>`. `unseen` is a separate state (a dot), never a colour of the status.

/** added, modified, deleted, untracked, renamed: git's letters A, M, D, U, R. */
export const CHANGE_STATUSES = ["added", "modified", "deleted", "untracked", "renamed"] as const;
export type ChangeStatus = (typeof CHANGE_STATUSES)[number];
/** A change status, or `removed`, the deprecated spelling of `deleted` (kept for one release, 2026-11-07). */
export type ChangeStatusInput = ChangeStatus | "removed";

/** Each status's letter, shown in a tree row's end, and the word a screen reader hears. */
export const CHANGE_MARK: Record<ChangeStatus, { letter: string; word: string }> = {
  added: { letter: "A", word: "Added" },
  modified: { letter: "M", word: "Modified" },
  deleted: { letter: "D", word: "Deleted" },
  untracked: { letter: "U", word: "Untracked" },
  renamed: { letter: "R", word: "Renamed" },
};

/** The shared word for a status given in an old spelling (`removed` → `deleted`). */
export function changeStatus(status: ChangeStatusInput): ChangeStatus;
export function changeStatus(status: ChangeStatusInput | undefined): ChangeStatus | undefined;
export function changeStatus(status: ChangeStatusInput | undefined): ChangeStatus | undefined {
  return status === "removed" ? "deleted" : status;
}
