/**
 * Area's tools for coding apps (docs/research/desktop-app-analysis-2026-11-10, T7): what Settings › Coding apps shows.
 * A coding app working in a folder a system is written into starts the `area` command's server there
 * (packages/output/src/mcp.ts) and asks it about the system: its components, tokens and rules, a component's picture,
 * and whether a change keeps to the system. Pure: the coding apps test holds the tool list to the server's own.
 */

/** Each tool the server offers, in the app's words. `name` is the server's own (packages/output/src/mcp.ts TOOLS). */
export const CODING_TOOLS: ReadonlyArray<{ name: string; label: string; description: string }> = [
  { name: "system.search_components", label: "Find a component", description: "The system's components that match a few words, each with its options." },
  { name: "system.get_component", label: "Read a component", description: "One component in full: its options, parts, states, how to use it, and its file." },
  { name: "system.resolve_token", label: "Look up a token", description: "What a token is set to in each theme and mode, or which tokens hold a value." },
  { name: "system.validate_diff", label: "Check a change", description: "Whether a change keeps to the system: its components and options, its tokens, no colors or lengths written by hand." },
  { name: "system.get_rules", label: "Read the rules", description: "The system's written rules: colors, type, layout, depth, shapes, and its do and don't." },
  { name: "preview.screenshot", label: "Picture a component", description: "A picture of a component as the system draws it, in light or dark." },
];

export interface ConnectSnippet {
  /** The coding app, by its own name: the line or file is that app's. */
  app: string;
  /** Where it goes: a Terminal in the project's folder, or a file. */
  where: string;
  language: "bash" | "json" | "toml";
  code: string;
}

const quoted = (path: string) => /^[A-Za-z0-9_./-]+$/.test(path) ? path : `"${path.replace(/(["\\$`])/g, "\\$1")}"`;

/**
 * The line or file that connects each coding app, with this Mac's path to the `area` command in it. Each app starts
 * the server in the project's folder, which is where the tools read the system from.
 */
export function connectSnippets(script: string): ConnectSnippet[] {
  const args = [script, "mcp"];
  const servers = (key: string, extra: Record<string, string> = {}) => `${JSON.stringify({ [key]: { area: { ...extra, command: "node", args } } }, null, 2)}\n`;
  return [
    { app: "Claude Code", where: "Run in Terminal, in the project's folder", language: "bash", code: `claude mcp add area -- node ${quoted(script)} mcp` },
    { app: "Cursor", where: "In the project's folder, as .cursor/mcp.json", language: "json", code: servers("mcpServers") },
    { app: "VS Code", where: "In the project's folder, as .vscode/mcp.json", language: "json", code: servers("servers", { type: "stdio" }) },
    { app: "Codex", where: "Added to ~/.codex/config.toml", language: "toml", code: `[mcp_servers.area]\ncommand = "node"\nargs = [${args.map(arg => JSON.stringify(arg)).join(", ")}]\n` },
  ];
}

/** The path shown where the app can't say its own (a browser preview). */
export const SCRIPT_PLACEHOLDER = "/path/to/area/packages/output/bin/area.mjs";
