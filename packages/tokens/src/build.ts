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
// Exact colours (`@area/tokens/colours`, 2026-10-27): the pages' solver and the accent through the brand engine.
await bundle("colours-entry.ts", { outfile: join(dist, "colours.js"), platform: "neutral" });
write("colours.d.ts", `/** @area/tokens/colours: exact page and accent colours at runtime (docs: THEMING.md, Exact colours). */
import type { BrandOptions } from "./brand.js";
export interface Oklch { l: number; c: number; h: number }
/** oklch(L C h) (L a number or a percentage), a hex, or numbers. */
export type ColourInput = string | Oklch;
export interface PageColours { light?: ColourInput; dark?: ColourInput }
export interface Colours { page?: PageColours; accent?: ColourInput }
export interface PageSolve { lightness: number; hue: number; strength: number; room: { white: number; black: number }; painted: Oklch }
/** "--area-*" name to value: an inline style on an element with data-area-colours, or React Theme's "colours" prop. */
export function colourDeclarations(colours: Colours, options?: BrandOptions): Record<string, string>;
/** The same as one rule in the axes layer, on [data-area-colours] unless "selector" says otherwise. */
export function colourCss(colours: Colours, options?: BrandOptions & { selector?: string }): string;
/** What each page pick solved to and the colour it paints. */
export function pageInfo(page: PageColours): { light?: PageSolve; dark?: PageSolve };
/** The pages' declarations alone. */
export function pageDeclarations(page: PageColours): Record<string, string>;
/** The pick a page preset (a ground step and a tint hue and position) paints, or null where no pick reproduces it. */
export function presetPick(theme: "light" | "dark", groundStep: number, tint: { hue: number; position: number } | null): Oklch | null;
/** Each mode's page lightness range, and its default page. */
export const PAGE_RANGE: Readonly<Record<"light" | "dark", readonly [number, number]>>;
export const DEFAULT_PAGE: Readonly<Record<"light" | "dark", Oklch>>;
export function solvePage(theme: "light" | "dark", pick: Oklch): PageSolve;
/** The most chroma a page of lightness l and hue h can show. */
export function reachableChroma(theme: "light" | "dark", l: number, h: number): number;
/** The chroma a tint (hue, strength as OKLCH chroma) paints on a page of lightness l. */
export function paintedChroma(theme: "light" | "dark", l: number, tint: { hue: number; chroma: number }): number;
export function parseColour(input: ColourInput): Oklch;
export function isColour(value: string): boolean;
export function formatOklch(colour: Oklch): string;
export function oklchHex(colour: Oklch): string;
`);
const size = async (entry: string, stdin?: string) => {
  const out = await (stdin
    ? build({ stdin: { contents: stdin, resolveDir: here, loader: "ts" }, bundle: true, format: "esm", write: false, minify: true, platform: "neutral", logLevel: "silent", plugins: [embedDerived as never] })
    : bundle(entry, { write: false, minify: true, platform: "neutral" })) as unknown as { outputFiles: Array<{ contents: Uint8Array }> };
  const bytes = out.outputFiles[0]!.contents;
  return `minified ${(bytes.length / 1024).toFixed(1)} kB, gzipped ${(gzipSync(bytes).length / 1024).toFixed(1)} kB`;
};
console.log(`  brand.js ${await size("brand-entry.ts")}; ${Object.keys(derived).length} derivations restated`);
console.log(`  colours.js ${await size("colours-entry.ts")}; its page part alone ${await size("", `export { pageDeclarations } from "./color/colours.ts";`)}`);

console.log("");
