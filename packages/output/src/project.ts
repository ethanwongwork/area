/**
 * A project the system was written into, read back: what the MCP server and `area check` answer from. It needs only
 * the project's own files (the definition, the lock, components.json and the CSS), never the library.
 */
import { declaredTokens, type SystemIndex } from "./check.ts";
import { readDefinition } from "./definition.ts";
import type { ComponentEntry } from "./targets/agents.ts";
import { DEFINITION_FILE, readLock, type Destination } from "./write.ts";

export interface Project extends SystemIndex {
  name: string;
  version: string;
  /** Every CSS file the system wrote, path → text. */
  css: Record<string, string>;
  design: string | null;
  /** The system's themes: each one's id, name and settings (a component's picture is drawn under them). */
  themes: Array<{ id: string; name: string; settings: Readonly<Record<string, string>> }>;
}

export function readProject(dest: Destination): Project {
  const text = dest.read(DEFINITION_FILE);
  if (!text) throw new Error(`No ${DEFINITION_FILE} here: this folder has no system written into it.`);
  const def = readDefinition(JSON.parse(text));
  const dir = def.output.dir;
  const index = JSON.parse(dest.read(`${dir}/components.json`) ?? `{"components":[],"left":[]}`) as { components: ComponentEntry[]; left: string[] };
  const lock = readLock(dest);
  const css: Record<string, string> = {};
  for (const path of Object.keys(lock?.files ?? {}).filter(p => p.endsWith(".css"))) { const sheet = dest.read(path); if (sheet !== null) css[path] = sheet; }
  const literals = new Set<string>();
  const kept = dest.read(".area/rules/literals.json");
  if (kept) for (const entry of JSON.parse(kept) as Array<{ value?: string }>) if (typeof entry.value === "string") literals.add(entry.value.toLowerCase());
  return {
    name: def.system.name, version: def.release.version, dir,
    components: index.components, left: index.left ?? [],
    tokens: declaredTokens(...Object.values(css)), literals, css, design: dest.read("DESIGN.md"),
    themes: def.themes.map(theme => ({ id: theme.id, name: theme.name, settings: theme.settings })),
  };
}

/** Components whose name, slug, description or usage mentions every word of the query, best first. */
export function searchComponents(project: Project, query: string): ComponentEntry[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = project.components.map(c => {
    const name = `${c.name} ${c.slug}`.toLowerCase();
    const body = `${c.description} ${JSON.stringify(c.docs ?? {})}`.toLowerCase();
    let score = 0;
    for (const word of words) score += name.includes(word) ? 3 : body.includes(word) ? 1 : -100;
    return { c, score };
  });
  return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score || a.c.slug.localeCompare(b.c.slug)).map(s => s.c);
}

export function getComponent(project: Project, name: string): ComponentEntry | null {
  const key = name.toLowerCase().replace(/[\s_]+/g, "-");
  return project.components.find(c => c.slug === key || c.name.toLowerCase() === key.replace(/-/g, "") || c.block === key) ?? null;
}

export interface TokenAnswer {
  token?: string;
  /** Each declaration: the sheet, the rule it is in (its selector, with any @media around it) and its value. */
  declarations: Array<{ file: string; where: string; value: string }>;
  /** For a value: the tokens declared with exactly it. For a token: the tokens it reads. */
  related: string[];
}

/** A token's declarations (`--area-bg-page`, or `bg-page`), or the tokens declared with a value (`#ffffff`, `8px`). */
export function resolveToken(project: Project, query: string): TokenAnswer {
  const asToken = /^-{0,2}(area-)?[a-z0-9-]+$/.test(query.trim()) && !/^\d/.test(query.trim());
  const token = asToken ? `--area-${query.trim().replace(/^-{0,2}(area-)?/, "")}` : undefined;
  const declarations: TokenAnswer["declarations"] = [];
  const related = new Set<string>();
  const value = query.trim().toLowerCase();
  for (const [file, css] of Object.entries(project.css)) {
    let where = ":root";
    const context: string[] = [];
    for (const raw of css.split("\n")) {
      const line = raw.trim();
      if (line.endsWith("{")) { context.push(line.slice(0, -1).trim()); where = context.filter(c => !c.startsWith("@layer")).join(" ") || ":root"; continue; }
      if (line.startsWith("}")) { context.pop(); where = context.filter(c => !c.startsWith("@layer")).join(" ") || ":root"; continue; }
      const m = /^(--area-[a-z0-9-]+)\s*:\s*(.+?);?$/.exec(line);
      if (!m) continue;
      if (token && m[1] === token) {
        declarations.push({ file, where, value: m[2]! });
        for (const ref of m[2]!.matchAll(/var\((--area-[a-z0-9-]+)/g)) related.add(ref[1]!);
      } else if (!token && m[2]!.toLowerCase() === value) related.add(m[1]!);
    }
  }
  return { ...(token ? { token } : {}), declarations: declarations.slice(0, 40), related: [...related].sort().slice(0, 60) };
}
