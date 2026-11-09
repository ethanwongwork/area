/**
 * @area/output: a system written out as code its project owns, and the contract that keeps coding agents inside it
 * (docs/research/system-output-2026-11-08). One core, three callers: the `area` command, the MCP server and the app's
 * Write to folder.
 */
import { definitionFromSystem, readDefinition, type SystemDefinition } from "./definition.ts";
import { generate } from "./generate.ts";
import type { Library } from "./library.ts";
import { apply, folder, plan, readLock, summary, writeDefinition, DEFINITION_FILE, type Destination, type Plan, type Prefer, type Step } from "./write.ts";

export * from "./definition.ts";
export { generate, type Generated } from "./generate.ts";
export { loadLibrary, withChanges, type Library } from "./library.ts";
export { merge3 } from "./merge.ts";
export { apply, folder, plan, readLock, summary, hashOf, writeDefinition, type Destination, type Plan, type Prefer, type Step, type Action, type Lock } from "./write.ts";
export { validate, addedLines, wholeFile, type Finding } from "./check.ts";
export { readProject, searchComponents, getComponent, resolveToken } from "./project.ts";

/** The definition a project holds, or null. */
export function projectDefinition(dest: Destination): SystemDefinition | null {
  const text = dest.read(DEFINITION_FILE);
  return text ? readDefinition(JSON.parse(text)) : null;
}

export interface WriteRequest {
  /** The app's system file (systemFile in apps/desktop/src/systems.ts). */
  system: unknown;
  /** Which release; the latest when absent. */
  version?: string;
  /** Output options for a folder written for the first time (kept from the folder's own definition after that). */
  output?: Partial<SystemDefinition["output"]>;
}

/**
 * Writing a release into a folder, as the app does it: the definition from the release (keeping the folder's own output
 * options and, until the release carries them, its inventory), then the plan. `commit` applies it; without it, nothing
 * is written (the app shows the plan first).
 */
export function writeRelease(dest: Destination, lib: Library, request: WriteRequest, commit?: { prefer?: Prefer; choices?: Record<string, Prefer> }): { definition: SystemDefinition; plan: Plan; steps: Step[]; notes: string[]; summary: ReturnType<typeof summary>; written: boolean } {
  const existing = projectDefinition(dest);
  const output = existing?.output ?? readDefinition({ system: { id: "x" }, themes: [{}], output: request.output ?? {} }).output;
  const definition = definitionFromSystem(request.system, request.version, existing ? { output, inventory: existing.inventory, structure: existing.structure } : { output });
  const generated = generate(definition, lib);
  const p = plan(dest, definition, lib, generated);
  if (commit) { writeDefinition(dest, definition); apply(dest, p, commit.prefer, commit.choices); }
  return { definition, plan: p, steps: p.steps, notes: generated.notes, summary: summary(p.steps), written: !!commit };
}

export { folder as folderDestination, readLock as lockOf };
