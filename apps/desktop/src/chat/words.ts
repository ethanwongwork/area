/**
 * The Chat's design words (the chat workflow study, docs/research/chat-workflow-2026-11-08, P2 and P5): a file as the
 * design knows it ("Button's styles"), a step in plain words ("Looking at Button's styles"), and a run of work as one
 * line ("Worked 18s, looked at 6 things, made 2 changes"). Plain data in, words out, so tests/chat-words.test.ts reads
 * them without the app.
 */
// @ts-expect-error: the gallery's page content is authored in JavaScript.
import { COMPONENT_PAGES } from "../content/pages.mjs";
import type { Part } from "./session.ts";

const FAMILIES = (COMPONENT_PAGES as ReadonlyArray<{ slug: string; name: string }>);
const words = (stem: string) => stem.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_.]+/g, " ").trim().toLowerCase();
const capital = (text: string) => text ? text[0]!.toUpperCase() + text.slice(1) : text;
/** A family's own name for a file stem ("edit-summary" → "Edit summary"), else the stem in words. */
const familyOf = (stem: string) => FAMILIES.find(family => family.slug === stem || words(family.name) === words(stem))?.name ?? capital(words(stem));

/** A file as the design knows it: "Button's styles", "the Settings screen", "the theme's tokens"; its name otherwise. */
export function plainName(path: string): string {
  const file = path.split("/").at(-1) ?? path;
  const stem = file.replace(/\.[a-z0-9]+$/i, "");
  if (/packages\/styles\/src\/components\//.test(path)) return `${familyOf(stem)}'s styles`;
  if (/packages\/react\/src\/components\//.test(path)) return `the ${familyOf(stem)} component`;
  if (/docs\/specs\//.test(path)) return `${familyOf(stem)}'s notes`;
  if (/content\/examples\//.test(path)) return `the ${capital(words(stem))} screen`;
  if (/content\/demos\//.test(path)) return `the ${words(stem)} examples`;
  if (/content\/documentation\//.test(path)) return `the ${words(stem)} documentation`;
  if (/packages\/tokens\//.test(path)) return "the theme's tokens";
  if (/packages\/icons\//.test(path)) return "the icons";
  if (/(^|\/)AGENTS\.md$/.test(path)) return "the working guide";
  if (/(^|\/)docs\/[^/]+\.md$/.test(path)) return `the ${words(stem)} guide`;
  if (/apps\/desktop\/src\//.test(path)) return `the app's ${words(stem)}`;
  return file;
}

const pathOf = (input: Readonly<Record<string, unknown>>) => typeof input.file_path === "string" ? input.file_path : typeof input.path === "string" ? input.path : undefined;

/** A step in plain words, live and past: "Looking at Button's styles", "Looked at Button's styles". */
export function plainStep(name: string, input: Readonly<Record<string, unknown>>): readonly [string, string] {
  const path = pathOf(input);
  const thing = path ? plainName(path) : undefined;
  switch (name) {
    case "Read": return thing ? [`Looking at ${thing}`, `Looked at ${thing}`] : ["Looking", "Looked"];
    case "Grep": case "Glob": return ["Searching the design system", "Searched the design system"];
    case "Edit": case "Write": case "MultiEdit": case "NotebookEdit": return thing ? [`Changing ${thing}`, `Changed ${thing}`] : ["Changing", "Changed"];
    case "Bash": return ["Running a check", "Ran a check"];
    case "WebSearch": return ["Searching the web", "Searched the web"];
    case "WebFetch": return ["Reading a page", "Read a page"];
    case "Agent": case "Task": return ["Asking a helper", "Asked a helper"];
    case "Skill": return ["Reading a guide", "Read a guide"];
    case "TodoWrite": return ["Planning", "Planned"];
    case "ToolSearch": return ["Getting ready", "Got ready"];
    default: return ["Working", "Worked"];
  }
}

type Tool = Extract<Part, { kind: "tool" }>;
const LOOK = new Set(["Read", "Grep", "Glob", "WebFetch", "WebSearch", "Skill", "Agent", "Task"]);
const CHANGE = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit"]);
const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;

/** A run of work as one line (P5): while it works, its current step in plain words; done, what it came to
 *  ("Looked at 6 things, made 2 changes"), with how long the turn worked when it is the turn's last run. */
export function workLine(parts: readonly Part[], running: boolean, seconds?: number): string {
  if (running) {
    const now = [...parts].reverse().find(part => part.kind === "thinking" ? part.seconds === undefined : part.kind === "tool" && part.status === "running");
    if (now?.kind === "tool") return plainStep(now.name, now.input)[0];
    if (now?.kind === "thinking") return "Thinking";
    return "Working";
  }
  const tools = parts.filter((part): part is Tool => part.kind === "tool");
  const looked = tools.filter(part => LOOK.has(part.name)).length;
  const changed = new Set(tools.filter(part => CHANGE.has(part.name) && part.status === "done").map(part => pathOf(part.input) ?? part.id)).size;
  const checks = tools.filter(part => part.name === "Bash").length;
  const said = [
    looked ? `looked at ${plural(looked, "thing")}` : "",
    changed ? `made ${plural(changed, "change")}` : "",
    checks ? `ran ${plural(checks, "check")}` : "",
  ].filter(Boolean);
  const done = said.length ? said.join(", ") : tools.length ? `took ${plural(tools.length, "step")}` : "thought it through";
  return capital(seconds ? `worked ${seconds}s, ${done}` : done);
}

