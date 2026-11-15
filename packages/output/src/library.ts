/**
 * The library as the generator reads it: every input a system's files are made from, loaded once into plain data, so
 * a test can hold two versions side by side (a library update) and generation itself touches no files.
 *
 *   tokens      Area's token sheets (@area/tokens dist: properties, defaults, axes) and its brand and colours engines
 *   styles      the base sheets and every component sheet, in index.css's order (@area/styles src)
 *   manifests   the options manifest of every component (@area/styles src/manifest.ts) and its interface's source
 *   react       every component source, variants.ts and index.ts (@area/react src)
 *   icons       icons.json, the sprite and the 16px SVGs (@area/icons dist)
 *   docs        each family's usage documentation (apps/desktop/src/content/documentation.mjs)
 *
 * The library's version is its packages' versions plus a hash of every input, so any change to what it holds is a
 * new version (a library update), even while the packages are all 0.0.0.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export interface Manifest {
  block: string;
  description: string;
  variants: Record<string, readonly string[]>;
  booleans?: readonly string[];
  states?: readonly string[];
  stateAttributes?: Record<string, string>;
  /** States another component draws for this one, by its manifest key (Box field's `disabled` is its Number fields'). */
  statesFrom?: Record<string, string>;
  elements?: readonly string[];
  elementModifiers?: Record<string, readonly string[]>;
  aliases?: Record<string, string>;
  defaults: Record<string, string>;
}

export interface DocEntry {
  instead?: Array<[string, string[], string]>;
  practices?: Array<[string, string]>;
  parts?: Record<string, string>;
  states?: Record<string, string>;
  keyboard?: Array<[string, string]>;
  aria?: Array<[string, string]>;
}

export interface BrandEngine {
  brandCss(brand: { primary: string; secondary?: string; tertiary?: string }, options?: { statusColours?: string; selector?: string }): string;
}
export interface ColoursEngine {
  colourCss(colours: { page?: { light?: string; dark?: string } }, options?: { selector?: string }): string;
}

export interface Library {
  version: string;
  packages: Record<string, string>;
  tokens: { properties: string; defaults: string; axes: string; defaultMaterial: string; semantics: string[] };
  engines: { brand: BrandEngine; colours: ColoursEngine };
  styles: { base: Array<[file: string, css: string]>; components: Array<[file: string, css: string]>; layerOrder: string };
  manifests: Record<string, Manifest>;
  /** Each manifest's export name where it isn't its key (MANIFESTS.switch is `switchControl`: `switch` is a keyword). */
  manifestNames: Record<string, string>;
  manifestInterface: string;
  react: { variants: string; index: string; components: Record<string, string> };
  icons: { meta: Array<{ name: string; keywords?: string[]; category?: string; [key: string]: unknown }>; sprite: string; svg: Record<string, string> };
  docs: Record<string, DocEntry>;
}

const read = (path: string) => readFileSync(path, "utf8");
const version = (dir: string) => (JSON.parse(read(join(dir, "package.json"))) as { version: string }).version;

/** Every input's hash, sorted by name: what makes the library's version. */
export function libraryHash(lib: Omit<Library, "version" | "engines">): string {
  const hash = createHash("sha256");
  const add = (name: string, text: string) => hash.update(`${name}\0${text}\0`);
  add("tokens", JSON.stringify(lib.tokens));
  for (const [file, css] of [...lib.styles.base, ...lib.styles.components]) add(file, css);
  add("layers", lib.styles.layerOrder);
  add("manifests", JSON.stringify([lib.manifests, lib.manifestNames]));
  add("react:variants", lib.react.variants);
  add("react:index", lib.react.index);
  for (const name of Object.keys(lib.react.components).sort()) add(name, lib.react.components[name]!);
  add("icons", JSON.stringify(lib.icons.meta));
  add("sprite", lib.icons.sprite);
  add("docs", JSON.stringify(lib.docs));
  add("packages", JSON.stringify(lib.packages));
  return hash.digest("hex").slice(0, 12);
}

/** The library from a checkout of Area (`root` holds packages/ and apps/). The token and icon packages must be built. */
export async function loadLibrary(root: string): Promise<Library> {
  const pkg = (name: string) => join(root, "packages", name);
  const tokensDist = join(pkg("tokens"), "dist");
  if (!existsSync(join(tokensDist, "css", "axes.css"))) throw new Error(`Build @area/tokens first (npm run build -w @area/tokens): ${tokensDist} has no css/axes.css.`);
  const iconsDist = join(pkg("icons"), "dist");
  if (!existsSync(join(iconsDist, "icons.json"))) throw new Error(`Build @area/icons first (npm run build -w @area/icons): ${iconsDist} has no icons.json.`);

  const stylesSrc = join(pkg("styles"), "src");
  const index = read(join(stylesSrc, "index.css"));
  const imports = [...index.matchAll(/^@import\s+["']\.\/([^"']+)["'];/gm)].map(m => m[1]!);
  const base = imports.filter(file => !file.startsWith("components/")).map(file => [file, read(join(stylesSrc, file))] as [string, string]);
  const components = imports.filter(file => file.startsWith("components/")).map(file => [file.slice("components/".length), read(join(stylesSrc, file))] as [string, string]);
  const layerOrder = /^@layer [^;]+;/m.exec(index)?.[0] ?? "";

  const manifestSource = read(join(stylesSrc, "manifest.ts"));
  const manifestInterface = /export interface ComponentManifest \{[\s\S]*?\n\}/.exec(manifestSource)?.[0] ?? "";
  const manifestModule = await import(pathToFileURL(join(stylesSrc, "manifest.ts")).href) as Record<string, unknown> & { MANIFESTS: Record<string, Manifest> };
  const { MANIFESTS } = manifestModule;
  const manifestNames: Record<string, string> = {};
  for (const [key, manifest] of Object.entries(MANIFESTS)) {
    const name = Object.keys(manifestModule).find(exported => exported !== "MANIFESTS" && manifestModule[exported] === manifest);
    if (name && name !== key) manifestNames[key] = name;
  }

  const reactSrc = join(pkg("react"), "src");
  const reactComponents: Record<string, string> = {};
  for (const file of readdirSync(join(reactSrc, "components")).sort()) if (/\.tsx?$/.test(file)) reactComponents[file] = read(join(reactSrc, "components", file));

  const meta = JSON.parse(read(join(iconsDist, "icons.json"))) as Library["icons"]["meta"];
  const svg: Record<string, string> = {};
  for (const file of readdirSync(join(iconsDist, "svg", "16")).sort()) svg[file] = read(join(iconsDist, "svg", "16", file));

  const docsModule = join(root, "apps", "desktop", "src", "content", "documentation.mjs");
  const docs = existsSync(docsModule) ? (await import(pathToFileURL(docsModule).href) as { DOCUMENTATION: Record<string, DocEntry> }).DOCUMENTATION : {};

  const engines = {
    brand: await import(pathToFileURL(join(tokensDist, "brand.js")).href) as BrandEngine,
    colours: await import(pathToFileURL(join(tokensDist, "colours.js")).href) as ColoursEngine,
  };
  const material = /export const DEFAULT_MATERIAL = "([^"]+)"/.exec(read(join(pkg("tokens"), "src", "axes", "material.ts")))?.[1] ?? "none";

  const lib: Omit<Library, "version"> = {
    packages: Object.fromEntries(["tokens", "styles", "react", "icons"].map(name => [`@area/${name}`, version(pkg(name))])),
    tokens: { properties: read(join(tokensDist, "css", "properties.css")), defaults: read(join(tokensDist, "css", "tokens.css")), axes: read(join(tokensDist, "css", "axes.css")), defaultMaterial: material, semantics: Object.keys((JSON.parse(read(join(tokensDist, "tokens.json"))) as { semantics: Record<string, unknown> }).semantics).sort() },
    engines,
    styles: { base, components, layerOrder },
    manifests: JSON.parse(JSON.stringify(MANIFESTS)) as Record<string, Manifest>,
    manifestNames,
    manifestInterface,
    react: { variants: read(join(reactSrc, "variants.ts")), index: read(join(reactSrc, "index.ts")), components: reactComponents },
    icons: { meta, sprite: read(join(iconsDist, "sprite.svg")), svg },
    docs: JSON.parse(JSON.stringify(docs)) as Record<string, DocEntry>,
  };
  return { ...lib, version: `${lib.packages["@area/styles"]}+${libraryHash(lib)}` };
}

/** A copy of a library with some inputs changed (a library update), its version worked out again. */
export function withChanges(lib: Library, change: (draft: Library) => void): Library {
  const { engines, ...rest } = lib;
  const draft = { ...(structuredClone(rest) as Omit<Library, "engines">), engines } as Library;
  change(draft);
  const { version: _v, engines: _e, ...inputs } = draft;
  return { ...draft, version: `${draft.packages["@area/styles"]}+${libraryHash(inputs)}` };
}
