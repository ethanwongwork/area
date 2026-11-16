/**
 * `area`: a system written out as code (docs/research/system-output-2026-11-08).
 *
 *   area init [--from <system.json>] [--version <v>] [--name <name>] [--dir design-system]
 *        writes .area/system.json: from a system the app saved (its release, the latest by default), or a new system
 *        at Area's defaults
 *   area build [--dry-run] [--prefer yours|area]
 *        writes the system from .area/system.json, merging with the project's edits; --dry-run only says what it would do
 *   area check [--diff <file>|-] [files…]
 *        checks a change (a unified diff, or whole files) against the system; exits 1 on findings
 *   area mcp
 *        the system's MCP server on stdio (its tools: packages/output/src/mcp.ts)
 *
 * Every command works in the current folder. The library is the Area checkout this command belongs to, or AREA_LIBRARY.
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { addedLines, validate, wholeFile } from "./check.ts";
import { canonical, definitionFromSystem, readDefinition } from "./definition.ts";
import { generate } from "./generate.ts";
import { loadLibrary } from "./library.ts";
import { serve } from "./mcp.ts";
import { readProject } from "./project.ts";
import { apply, folder, plan, readProjectDefinition, summary, writeDefinition, type Prefer } from "./write.ts";

const [command, ...rest] = process.argv.slice(2);
const flag = (name: string) => { const i = rest.indexOf(`--${name}`); return i >= 0 ? rest[i + 1] : undefined; };
const has = (name: string) => rest.includes(`--${name}`);
const cwd = process.cwd();
const dest = folder(cwd);
const libraryRoot = () => process.env.AREA_LIBRARY ?? resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const VERSION = "0.0.0";

const WORDS: Record<string, string> = {
  added: "added", updated: "updated", unchanged: "unchanged", "kept-edits": "kept your edits", merged: "merged with your edits",
  conflict: "needs your choice", exists: "needs your choice (a file of yours is there)", removed: "removed", left: "left as you edited it (no longer written)", skipped: "left out (you removed it)",
};

async function main() {
  switch (command) {
    case "init": {
      const from = flag("from");
      const output = { dir: flag("dir") ?? "design-system" };
      const def = from
        ? (() => { const file = JSON.parse(readFileSync(resolve(from), "utf8")); return "releases" in file ? definitionFromSystem(file, flag("version"), { output: readDefinition({ system: { id: "x" }, themes: [{}], output }).output }) : readDefinition(file); })()
        : readDefinition({ system: { id: (flag("name") ?? "system").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "system", name: flag("name") ?? "System" }, themes: [{ id: "default", name: "Default" }], output });
      writeDefinition(dest, def);
      console.log(`Wrote .area/system.json: ${def.system.name} ${def.release.version}. Next: area build`);
      return;
    }
    case "build": {
      const def = readProjectDefinition(dest);
      const lib = await loadLibrary(libraryRoot());
      const generated = generate(def, lib);
      const p = plan(dest, def, lib, generated);
      const shown = p.steps.filter(step => step.action !== "unchanged");
      for (const step of shown) console.log(`  ${WORDS[step.action]!.padEnd(28)} ${step.path.replace("#area", " (Area's block)")}${step.conflicts ? ` (${step.conflicts})` : ""}`);
      for (const note of generated.notes) console.log(`  note: ${note}`);
      const counts = summary(p.steps);
      if (has("dry-run")) { console.log(`\n${def.system.name} ${def.release.version} from library ${lib.version}: nothing written (dry run). ${JSON.stringify(counts)}`); return; }
      const prefer = (flag("prefer") as Prefer | undefined) ?? "markers";
      apply(dest, p, prefer);
      const choices = (counts.conflict ?? 0) + (counts.exists ?? 0);
      console.log(`\nWrote ${def.system.name} ${def.release.version} from library ${lib.version}. ${JSON.stringify(counts)}`);
      if (choices && prefer === "markers") { console.log(`${choices} file(s) need your choice: each holds both versions between <<<<<<< and >>>>>>>.`); process.exitCode = 2; }
      return;
    }
    case "check": {
      const project = readProject(dest);
      const diffFile = flag("diff");
      const changes = diffFile ? addedLines(diffFile === "-" ? readFileSync(0, "utf8") : readFileSync(resolve(diffFile), "utf8")) : [];
      for (const path of rest.filter((arg, i) => !arg.startsWith("--") && rest[i - 1] !== "--diff")) changes.push(wholeFile(path, readFileSync(join(cwd, path), "utf8")));
      const findings = validate(changes, project);
      for (const f of findings) console.log(`${f.path}:${f.line}  ${f.rule}  ${f.message}`);
      console.log(findings.length ? `\n${findings.length} finding(s) against ${project.name} ${project.version}.` : `No findings against ${project.name} ${project.version}.`);
      if (findings.length) process.exitCode = 1;
      return;
    }
    case "mcp":
      serve(dest, VERSION, { library: libraryRoot() });
      return;
    case "definition":
      process.stdout.write(canonical(readProjectDefinition(dest)));
      return;
    default:
      console.error("Usage: area init [--from <system.json>] [--version <v>] [--name <name>] [--dir <folder>]\n       area build [--dry-run] [--prefer yours|area]\n       area check [--diff <file>|-] [files…]\n       area mcp");
      process.exitCode = command ? 1 : 0;
  }
}

main().catch(error => { console.error(String(error?.message ?? error)); process.exit(1); });
