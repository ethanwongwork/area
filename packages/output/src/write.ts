/**
 * Writing a system into a project: plan, then apply. Local folders only; a project in a repository is a folder too,
 * and the later GitHub path (a branch and a pull request) takes the same plan (`Destination` is the seam).
 *
 *   .area/system.json   the choices (written by `area init` or the app, read here)
 *   .area/area.lock     the library version, the definition's hash and a hash of every file Area wrote
 *   .area/base/…        a copy of every file as Area last wrote it: the merge's base, so a merge needs no network,
 *                       no history and no old library
 *
 * For each file, from what Area wrote last time (base), what the project holds (yours) and what Area writes now (new):
 *
 *   added        new file                          kept-edits   only you changed it: yours stays
 *   updated      only Area changed it               merged       both changed it, apart: both kept
 *   unchanged    nothing to do                      conflict     both changed the same lines: written with both
 *   removed      no longer written, unedited        left         no longer written, but you edited it: kept, untracked
 *   skipped      you removed it: it stays removed   exists       a file of yours where Area writes one: a conflict
 *
 * A conflict is written with markers unless the plan is applied preferring yours or Area's. When the base copy is gone
 * (a fresh clone that didn't keep .area/base), the lock's hash stands in: a file still matching it is unedited.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { canonical, readDefinition, type SystemDefinition } from "./definition.ts";
import type { Generated } from "./generate.ts";
import type { Library } from "./library.ts";
import { merge3 } from "./merge.ts";

export const LOCK_VERSION = 1;
export const AREA_DIR = ".area";
export const DEFINITION_FILE = `${AREA_DIR}/system.json`;
export const LOCK_FILE = `${AREA_DIR}/area.lock`;
const BASE_DIR = `${AREA_DIR}/base`;
const BLOCK_BEGIN = "<!-- area:begin (written by Area; edits here are merged) -->";
const BLOCK_END = "<!-- area:end -->";

export const hashOf = (text: string) => `sha256-${createHash("sha256").update(text).digest("hex")}`;

export interface Lock {
  lockVersion: number;
  system: { id: string; version: string; definition: string };
  library: { version: string; packages: Record<string, string> };
  files: Record<string, string>;
}

export type Action = "added" | "updated" | "unchanged" | "kept-edits" | "merged" | "conflict" | "exists" | "removed" | "left" | "skipped";
export interface Step {
  path: string;
  action: Action;
  /** What the project will hold (absent: the file is removed or left as it is). */
  text?: string;
  /** The conflict's other versions, for a choice. */
  yours?: string;
  area?: string;
  conflicts?: number;
}
export interface Plan {
  steps: Step[];
  lock: Lock;
  /** Base copies to keep (path → text). */
  base: Record<string, string>;
}

/** Where a system is written: a folder now; a repository's branch later. */
export interface Destination {
  read(path: string): string | null;
  write(path: string, text: string): void;
  remove(path: string): void;
}

export function folder(root: string): Destination {
  return {
    read: path => { const file = join(root, path); return existsSync(file) ? readFileSync(file, "utf8") : null; },
    write: (path, text) => { const file = join(root, path); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, text); },
    remove: path => rmSync(join(root, path), { force: true }),
  };
}

const isBlock = (path: string) => path.includes("#");
const fileOf = (path: string) => path.split("#")[0]!;
/** A file's base copy; a block's is its file's name and the block's (AGENTS.md#area → .area/base/AGENTS.md.area). */
const basePath = (path: string) => `${BASE_DIR}/${path.replace("#", ".")}`;

/** A block inside a file the project owns (AGENTS.md): what lies between Area's markers, or null when there are none. */
function readBlock(file: string | null): string | null {
  if (file === null) return null;
  const begin = file.indexOf(BLOCK_BEGIN), end = file.indexOf(BLOCK_END);
  if (begin < 0 || end < begin) return null;
  return file.slice(begin + BLOCK_BEGIN.length + 1, end);
}
function writeBlock(file: string | null, block: string | null): string | null {
  const wrapped = block === null ? "" : `${BLOCK_BEGIN}\n${block}${BLOCK_END}\n`;
  if (file === null) return block === null ? null : wrapped;
  const begin = file.indexOf(BLOCK_BEGIN), end = file.indexOf(BLOCK_END);
  if (begin < 0 || end < begin) return block === null ? file : `${file.replace(/\n*$/, "\n\n")}${wrapped}`;
  const after = file.slice(end + BLOCK_END.length).replace(/^\n/, "");
  const next = `${file.slice(0, begin)}${wrapped}${after}`;
  return block === null ? next.replace(/\n{3,}/g, "\n\n") : next;
}

export function readLock(dest: Destination): Lock | null {
  const text = dest.read(LOCK_FILE);
  if (!text) return null;
  const lock = JSON.parse(text) as Lock;
  return lock.lockVersion === LOCK_VERSION ? lock : null;
}

export function readProjectDefinition(dest: Destination): SystemDefinition {
  const text = dest.read(DEFINITION_FILE);
  if (!text) throw new Error(`No ${DEFINITION_FILE} here: run area init, or write the system from Area.`);
  return readDefinition(JSON.parse(text));
}

/** What writing `generated` into the project would do, file by file. Reads only. */
export function plan(dest: Destination, def: SystemDefinition, lib: Library, generated: Generated): Plan {
  const lock = readLock(dest);
  const previous = lock?.files ?? {};
  const paths = [...new Set([...Object.keys(previous), ...Object.keys(generated.files)])].sort();
  const labels = { yours: "yours", theirs: `${def.system.name} ${def.release.version}` };
  const current = (path: string) => isBlock(path) ? readBlock(dest.read(fileOf(path))) : dest.read(path);
  const steps: Step[] = [];
  for (const path of paths) {
    const theirs = generated.files[path] ?? null;
    const yours = current(path);
    const recorded = previous[path];
    let base = recorded ? dest.read(basePath(path)) : null;
    // No base copy: the lock's hash says whether yours is still what Area wrote.
    if (recorded && base === null && yours !== null && hashOf(yours) === recorded) base = yours;
    if (theirs === null) {
      if (yours === null) continue;
      if (base !== null && yours === base) steps.push({ path, action: "removed" });
      else steps.push({ path, action: "left" });
      continue;
    }
    if (yours === null) {
      steps.push(recorded ? { path, action: "skipped" } : { path, action: "added", text: theirs });
      continue;
    }
    if (yours === theirs) { steps.push({ path, action: "unchanged" }); continue; }
    if (!recorded) {
      steps.push({ path, action: "exists", text: conflictText(yours, theirs, labels), yours, area: theirs, conflicts: 1 });
      continue;
    }
    if (base === null) {
      // Recorded, but neither a base copy nor a matching hash: yours was edited and the base is unknown.
      steps.push({ path, action: "conflict", text: conflictText(yours, theirs, labels), yours, area: theirs, conflicts: 1 });
      continue;
    }
    if (yours === base) { steps.push({ path, action: "updated", text: theirs }); continue; }
    if (theirs === base) { steps.push({ path, action: "kept-edits" }); continue; }
    const merged = merge3(base, yours, theirs, labels);
    steps.push(merged.conflicts
      ? { path, action: "conflict", text: merged.text, yours, area: theirs, conflicts: merged.conflicts }
      : { path, action: "merged", text: merged.text });
  }
  const files = Object.fromEntries(Object.entries(generated.files).map(([path, text]) => [path, hashOf(text)]));
  return {
    steps,
    lock: { lockVersion: LOCK_VERSION, system: { id: def.system.id, version: def.release.version, definition: hashOf(canonical(def)) }, library: { version: lib.version, packages: lib.packages }, files },
    base: generated.files,
  };
}

const conflictText = (yours: string, theirs: string, labels: { yours: string; theirs: string }) =>
  `<<<<<<< ${labels.yours}\n${yours.replace(/\n?$/, "\n")}=======\n${theirs.replace(/\n?$/, "\n")}>>>>>>> ${labels.theirs}\n`;

export type Prefer = "markers" | "yours" | "area";

/** Applies a plan: files, base copies and the lock last. `choices` settles single conflicts, `prefer` the rest. */
export function apply(dest: Destination, plan: Plan, prefer: Prefer = "markers", choices: Record<string, Prefer> = {}): Step[] {
  const put = (path: string, text: string | null) => {
    if (isBlock(path)) {
      const next = writeBlock(dest.read(fileOf(path)), text);
      if (next === null || next.trim() === "") dest.remove(fileOf(path)); else dest.write(fileOf(path), next);
    } else if (text === null) dest.remove(path);
    else dest.write(path, text);
  };
  for (const step of plan.steps) {
    const choice = choices[step.path] ?? prefer;
    if (step.action === "conflict" || step.action === "exists") {
      if (choice === "yours") continue;
      put(step.path, choice === "area" ? step.area! : step.text!);
    } else if (step.action === "removed") put(step.path, null);
    else if (step.text !== undefined) put(step.path, step.text);
  }
  // Base copies: exactly the files Area wrote this time.
  const lock = readLock(dest);
  for (const path of Object.keys(lock?.files ?? {})) if (!(path in plan.base)) dest.remove(basePath(path));
  for (const [path, text] of Object.entries(plan.base)) dest.write(basePath(path), text);
  dest.write(LOCK_FILE, canonical(plan.lock));
  return plan.steps;
}

/** The definition, written where the project keeps it (`area init`, the app's Write to folder). */
export function writeDefinition(dest: Destination, def: SystemDefinition): void {
  dest.write(DEFINITION_FILE, canonical(def));
}

/** How many steps of each action. */
export function summary(steps: readonly Step[]): Partial<Record<Action, number>> {
  const out: Partial<Record<Action, number>> = {};
  for (const step of steps) out[step.action] = (out[step.action] ?? 0) + 1;
  return out;
}
