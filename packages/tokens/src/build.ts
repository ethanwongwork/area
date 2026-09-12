/**
 * Token build.
 *
 * Runs the axis integrity check first: if two axes ever collide on a custom property, the
 * build stops here rather than shipping a stylesheet whose behaviour depends on source
 * order.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertAxisIntegrity } from "./axes/registry.ts";
import { emitAxes, emitProperties, emitTokens } from "./emit/css.ts";
import { buildTokensJson } from "./emit/json.ts";
import { emitTypes } from "./emit/dts.ts";
import { emitFixture } from "./emit/fixture.ts";

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, "..", "dist");

function write(relativePath: string, contents: string): void {
  const target = join(dist, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents, "utf8");
  const kb = (Buffer.byteLength(contents, "utf8") / 1024).toFixed(1);
  console.log(`  ${relativePath.padEnd(28)} ${kb.padStart(7)} kB`);
}

console.log("\n  @area/tokens\n");

assertAxisIntegrity();
console.log("  axis integrity ok\n");

write("css/properties.css", emitProperties());
write("css/tokens.css", emitTokens());
write("css/axes.css", emitAxes());
write("tokens.json", `${JSON.stringify(buildTokensJson(), null, 2)}\n`);
write("tokens.d.ts", emitTypes());

// Written last: it inlines the CSS files above.
write("fixture/axes.html", emitFixture());

console.log("");
