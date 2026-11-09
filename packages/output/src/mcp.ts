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
 */
import { createInterface } from "node:readline";
import { addedLines, validate, wholeFile } from "./check.ts";
import { getComponent, readProject, resolveToken, searchComponents, type Project } from "./project.ts";
import type { Destination } from "./write.ts";

const LEGACY = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];
const MODERN = ["2026-07-28"];
const VERSION_KEY = "io.modelcontextprotocol/protocolVersion";

interface Tool { name: string; title: string; description: string; inputSchema: object; run: (project: Project, args: Record<string, unknown>) => unknown }

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
];

export interface Message { jsonrpc: "2.0"; id?: string | number; method?: string; params?: Record<string, unknown> }

/** One message's answer (null for a notification). `project` is read per call, so a new write is seen at once. */
export function answer(message: Message, project: () => Project, serverVersion: string): object | null {
  const { id, method, params = {} } = message;
  if (id === undefined || id === null) return null;
  const meta = (params._meta ?? {}) as Record<string, unknown>;
  const modern = typeof meta[VERSION_KEY] === "string";
  const ok = (result: object) => ({ jsonrpc: "2.0", id, result: modern ? { resultType: "complete", ...result } : result });
  const fail = (code: number, msg: string, data?: object) => ({ jsonrpc: "2.0", id, error: { code, message: msg, ...(data ? { data } : {}) } });
  const info = { name: "area-system", version: serverVersion };
  const instructions = "Tools for building inside this project's design system. Search components before writing UI, use only the options a component lists, paint with its tokens, and check a change with system.validate_diff.";
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
      try {
        const result = tool.run(project(), (params.arguments ?? {}) as Record<string, unknown>);
        return ok({ content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result });
      } catch (error) {
        return ok({ content: [{ type: "text", text: String((error as Error).message) }], isError: true });
      }
    }
    default: return fail(-32601, `Method not found: ${method}`);
  }
}

export function serve(dest: Destination, serverVersion: string, input = process.stdin, output = process.stdout): void {
  const lines = createInterface({ input });
  lines.on("line", line => {
    if (!line.trim()) return;
    let message: Message;
    try { message = JSON.parse(line) as Message; }
    catch { output.write(`${JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } })}\n`); return; }
    const reply = answer(message, () => readProject(dest), serverVersion);
    if (reply) output.write(`${JSON.stringify(reply)}\n`);
  });
  lines.on("close", () => process.exit(0));
}
