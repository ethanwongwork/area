// Settings › Coding apps (src/coding-apps.ts): the tools it lists are the server's own, and each app's line or file
// carries this Mac's path to the command.
import { test } from "node:test";
import assert from "node:assert/strict";
import { CODING_TOOLS, connectSnippets } from "../src/coding-apps.ts";
import { TOOLS } from "../../../packages/output/src/mcp.ts";

test("coding apps: every tool the server offers is listed, by its own name, with words of its own", () => {
  assert.deepEqual(CODING_TOOLS.map(tool => tool.name), TOOLS.map(tool => tool.name));
  for (const tool of CODING_TOOLS) assert.ok(tool.label && tool.description.endsWith("."), tool.name);
});

test("coding apps: each app's line or file starts the command where it is on this Mac", () => {
  const script = "/Users/david/Code/area/packages/output/bin/area.mjs";
  const snippets = connectSnippets(script);
  assert.deepEqual(snippets.map(snippet => snippet.app), ["Claude Code", "Cursor", "VS Code", "Codex"]);
  assert.equal(snippets[0]!.code, `claude mcp add area -- node ${script} mcp`);
  assert.deepEqual(JSON.parse(snippets[1]!.code), { mcpServers: { area: { command: "node", args: [script, "mcp"] } } });
  assert.deepEqual(JSON.parse(snippets[2]!.code), { servers: { area: { type: "stdio", command: "node", args: [script, "mcp"] } } });
  assert.equal(snippets[3]!.code, `[mcp_servers.area]\ncommand = "node"\nargs = ["${script}", "mcp"]\n`);
  // A path with a space is quoted for the shell and escaped in the files.
  const spaced = connectSnippets("/Users/david/My Code/area.mjs");
  assert.equal(spaced[0]!.code, `claude mcp add area -- node "/Users/david/My Code/area.mjs" mcp`);
  assert.deepEqual(JSON.parse(spaced[1]!.code).mcpServers.area.args, ["/Users/david/My Code/area.mjs", "mcp"]);
});
