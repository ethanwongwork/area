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
import { emitConfig, emitConfigTypes } from "./emit/config.ts";
import { emitFixture } from "./emit/fixture.ts";
import { brandDerivedFormulas } from "./emit/brand-derived.ts";
import { build } from "esbuild";
import { gzipSync } from "node:zlib";

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
write("config.js", emitConfig());
write("config.d.ts", emitConfigTypes());

// Written last: it inlines the CSS files above.
write("fixture/axes.html", emitFixture());

// The brand runtime (`@area/tokens/brand`) and the `area-tokens` command (2026-10-26): bundled, with the derivations a
// brand restates embedded as data, so neither loads the axes. Its size is reported, minified and gzipped, as a budget.
const derived = brandDerivedFormulas();
const embedDerived = {
  name: "brand-derived",
  setup(b: { onResolve: Function; onLoad: Function }) {
    b.onResolve({ filter: /^area:brand-derived$/ }, (args: { path: string }) => ({ path: args.path, namespace: "area" }));
    b.onLoad({ filter: /.*/, namespace: "area" }, () => ({ contents: JSON.stringify(derived), loader: "json" }));
  },
};
const bundle = (entry: string, extra: object = {}) => build({ entryPoints: [join(here, entry)], bundle: true, format: "esm", target: "es2022", logLevel: "silent", mainFields: ["module", "main"], plugins: [embedDerived as never], ...extra });
await bundle("brand-entry.ts", { outfile: join(dist, "brand.js"), platform: "neutral" });
await bundle("cli.ts", { outfile: join(dist, "cli.js"), platform: "node", banner: { js: "#!/usr/bin/env node" } });
write("brand.d.ts", `/** @area/tokens/brand: a brand's tokens at runtime (docs: THEMING.md, Brand). */
export interface Brand { primary: string; secondary?: string; tertiary?: string }
export interface BrandOptions { statusColours?: "harmonised" | "fixed" | "match" }
export interface BrandSlotInfo { hex: string; anchor: number; hue: number; character: number; shade: number; button: string; label: string }
export type BrandInfo = null | Record<"primary" | "secondary" | "tertiary", BrandSlotInfo | null>;
/** "--area-*" name to value: an inline style, or React Theme's "brand" prop. Cached per brand. */
export function brandDeclarations(brand: Brand, options?: BrandOptions): Record<string, string>;
/** The same as one rule in the axes layer, on [data-area-brand] unless "selector" says otherwise. */
export function brandCss(brand: Brand, options?: BrandOptions & { selector?: string }): string;
/** What each slot resolved to, per mode. */
export function brandInfo(brand: Brand): { light: BrandInfo; dark: BrandInfo };
export function isBrandColour(value: string): boolean;
`);
const minified = await bundle("brand-entry.ts", { write: false, minify: true, platform: "neutral" }) as unknown as { outputFiles: Array<{ contents: Uint8Array }> };
const bytes = minified.outputFiles[0]!.contents;
console.log(`  brand.js minified ${(bytes.length / 1024).toFixed(1)} kB, gzipped ${(gzipSync(bytes).length / 1024).toFixed(1)} kB; ${Object.keys(derived).length} derivations restated`);

console.log("");
