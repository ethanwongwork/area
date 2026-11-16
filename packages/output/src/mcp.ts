/**
 * The system's MCP server, over stdio: one JSON-RPC 2.0 message per line in and out, logs on stderr only, no
 * dependencies. It answers both handshakes in use: `initialize` (protocol 2025-11-25 and earlier, what most clients
 * send) and the stateless 2026-07-28 style (`server/discover`, every request carrying its protocol version in `_meta`).
 * Read-only: it answers from the project's files (project.ts) and never writes.
 *
 *   system.search_components   components matching words, with their options
 *   system.get_component       one component: options, parts, states, usage, React file
 *   system.resolve_token       a token's declarations, or the tokens declared with a value
 *   system.validate_diff       a unified diff (or files) checked against the system (check.ts)
 *   system.get_rules           DESIGN.md
 *   preview.screenshot         a component's picture, as Area draws it under the project's theme (picture.ts)
 */
import { createInterface } from "node:readline";
import { addedLines, validate, wholeFile } from "./check.ts";
import { getComponent, readProject, resolveToken, searchComponents, type Project } from "./project.ts";
import { picture } from "./picture.ts";
import type { Destination } from "./write.ts";

const LEGACY = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];
const MODERN = ["2026-07-28"];
const VERSION_KEY = "io.modelcontextprotocol/protocolVersion";

/** What a tool is given besides the project: the Area checkout the command runs from (a picture is drawn by its app). */
export interface ToolContext { library?: string }
interface Tool { name: string; title: string; description: string; inputSchema: object; run: (project: Project, args: Record<string, unknown>, context: ToolContext) => unknown }
/** A tool's answer that carries a picture: the PNG as base64, and the words about it. */
interface Pictured { image: string; about: Record<string, unknown> }
const isPictured = (value: unknown): value is Pictured => Boolean(value) && typeof (value as Pictured).image === "string" && typeof (value as Pictured).about === "object";

const text = (value: unknown) => typeof value === "string" ? value : "";

export const TOOLS: Tool[] = [
  {
    name: "system.search_components", title: "Search components",
    description: "Find the design system's components by words (what it is, what it does). Returns each match's name, description and options. Use before writing UI markup of your own.",
    inputSchema: { type: "object", properties: { query: { type: "string", description: "Words, e.g. \"choose one option\" or \"dialog\"." } }, required: ["query"], additionalProperties: false },
    run: (project, args) => ({ components: searchComponents(project, text(args.query)).slice(0, 12).map(c => ({ name: c.name, slug: c.slug, description: c.description, variants: c.variants, flags: c.flags, react: c.react })) }),
  },
  {
    name: "system.get_component", title: "Get a component",
    description: "One component of the design system in full: its options (only these exist in this system), defaults, parts, states, usage guidance, keyboard and ARIA, and its React file.",
    inputSchema: { type: "object", properties: { name: { type: "string", description: "Its name or slug: \"Button\", \"button\", \"segmented\"." } }, required: ["name"], additionalProperties: false },
    run: (project, args) => getComponent(project, text(args.name)) ?? { error: `No component "${text(args.name)}" in ${project.name}.`, left: project.left.includes(text(args.name).toLowerCase()) ? "Area's library has it, but this system leaves it out." : undefined },
  },
  {
    name: "system.resolve_token", title: "Resolve a token",
    description: "A custom property's declarations in the system (default, theme, modes), or, for a literal value such as #ffffff or 8px, the tokens declared with exactly that value.",
    inputSchema: { type: "object", properties: { query: { type: "string", description: "A token (--area-bg-page or bg-page) or a value (#ffffff, 8px)." } }, required: ["query"], additionalProperties: false },
    run: (project, args) => resolveToken(project, text(args.query)),
  },
  {
    name: "system.validate_diff", title: "Check a change",
    description: "Checks a change against the design system: components and options it doesn't hold, unknown tokens, literal colors and lengths. Pass a unified diff, or files as {path, text}. Returns findings with file, line and what to use instead.",
    inputSchema: { type: "object", properties: { diff: { type: "string" }, files: { type: "array", items: { type: "object", properties: { path: { type: "string" }, text: { type: "string" } }, required: ["path", "text"] } } }, additionalProperties: false },
    run: (project, args) => {
      const changes = [...addedLines(text(args.diff)), ...(Array.isArray(args.files) ? args.files.map(f => wholeFile(text((f as { path?: unknown }).path), text((f as { text?: unknown }).text))) : [])];
      const findings = validate(changes, project);
      return { ok: findings.length === 0, findings };
    },
  },
  {
    name: "system.get_rules", title: "Get the rules",
    description: "The design system's DESIGN.md: its overview, colors, type, layout, depth, shapes, components and do's and don'ts.",
    inputSchema: { type: "object", additionalProperties: false },
    run: project => ({ design: project.design ?? "This project has no DESIGN.md." }),
  },
  {
    name: "preview.screenshot", title: "Picture a component",
    description: "A picture (PNG) of one of the design system's components as it is drawn under the project's theme settings, in light or dark. Use it to see what a component looks like before using it, or to compare your UI with it. Shows the component's default specimen; takes a few seconds.",
    inputSchema: { type: "object", properties: {
      component: { type: "string", description: "Its name or slug: \"Button\", \"segmented\"." },
      mode: { type: "string", enum: ["light", "dark"], description: "Light by default." },
      theme: { type: "string", description: "One of the system's themes, by id; its first by default." },
    }, required: ["component"], additionalProperties: false },
    run: async (project, args, context) => {
      const entry = getComponent(project, text(args.component));
      if (!entry) throw new Error(`No component "${text(args.component)}" in ${project.name}.`);
      if (!context.library) throw new Error("A picture needs the Area checkout this command runs from.");
      const theme = project.themes.find(t => t.id === text(args.theme)) ?? project.themes[0];
      const mode = args.mode === "dark" ? "dark" : "light";
      const { png } = await picture(context.library, { slug: entry.slug, mode, settings: theme?.settings ?? {} });
      return { image: png.toString("base64"), about: { component: entry.name, theme: theme?.name ?? "Area's defaults", mode, note: "The default specimen under the theme's settings. A theme's exact colors, own accent and material are not drawn here." } } satisfies Pictured;
    },
  },
];

export interface Message { jsonrpc: "2.0"; id?: string | number; method?: string; params?: Record<string, unknown> }

/** One message's answer (null for a notification). `project` is read per call, so a new write is seen at once. A tool
 *  that takes time (a picture) answers with a promise; every other answer is ready at once. */
export function answer(message: Message, project: () => Project, serverVersion: string, context: ToolContext = {}): object | Promise<object> | null {
  const { id, method, params = {} } = message;
  if (id === undefined || id === null) return null;
  const meta = (params._meta ?? {}) as Record<string, unknown>;
  const modern = typeof meta[VERSION_KEY] === "string";
  const ok = (result: object) => ({ jsonrpc: "2.0", id, result: modern ? { resultType: "complete", ...result } : result });
  const fail = (code: number, msg: string, data?: object) => ({ jsonrpc: "2.0", id, error: { code, message: msg, ...(data ? { data } : {}) } });
  const info = { name: "area-system", version: serverVersion };
  const instructions = "Tools for building inside this project's design system. Search components before writing UI, use only the options a component lists, paint with its tokens, look at a component with preview.screenshot when its look matters, and check a change with system.validate_diff.";
  if (modern && !MODERN.includes(String(meta[VERSION_KEY]))) return fail(-32022, "Unsupported protocol version", { supported: [...MODERN, ...LEGACY], requested: meta[VERSION_KEY] });
  switch (method) {
    case "initialize": {
      const asked = String(params.protocolVersion ?? "");
      return ok({ protocolVersion: LEGACY.includes(asked) ? asked : LEGACY[0], capabilities: { tools: { listChanged: false } }, serverInfo: info, instructions });
    }
    case "server/discover":
      return ok({ supportedVersions: MODERN, capabilities: { tools: {} }, _meta: { "io.modelcontextprotocol/serverInfo": info }, instructions });
    case "ping": return ok({});
    case "tools/list": return ok({ tools: TOOLS.map(({ run: _run, ...tool }) => tool) });
    case "tools/call": {
      const tool = TOOLS.find(t => t.name === params.name);
      if (!tool) return fail(-32602, `Unknown tool ${String(params.name)}`);
      const done = (result: unknown) => isPictured(result)
        ? ok({ content: [{ type: "image", data: result.image, mimeType: "image/png" }, { type: "text", text: JSON.stringify(result.about, null, 2) }], structuredContent: result.about })
        : ok({ content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result as object });
      const failed = (error: unknown) => ok({ content: [{ type: "text", text: String((error as Error).message) }], isError: true });
      try {
        const result = tool.run(project(), (params.arguments ?? {}) as Record<string, unknown>, context);
        return result instanceof Promise ? result.then(done, failed) : done(result);
      } catch (error) { return failed(error); }
    }
    default: return fail(-32601, `Method not found: ${method}`);
  }
}

export function serve(dest: Destination, serverVersion: string, context: ToolContext = {}, input = process.stdin, output = process.stdout): void {
  const lines = createInterface({ input });
  const pending: Array<Promise<void>> = [];
  lines.on("line", line => {
    if (!line.trim()) return;
    let message: Message;
    try { message = JSON.parse(line) as Message; }
    catch { output.write(`${JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } })}\n`); return; }
    const reply = answer(message, () => readProject(dest), serverVersion, context);
    if (reply) pending.push(Promise.resolve(reply).then(ready => { output.write(`${JSON.stringify(ready)}\n`); }));
  });
  // An answer still being made (a picture) is sent before the server leaves.
  lines.on("close", () => { void Promise.allSettled(pending).then(() => process.exit(0)); });
}
