// Builds a desktop renderer in production mode to another file, leaving apps/desktop/dist alone:
// node build-renderer.mjs <apps/desktop dir> <outfile>   (DEV=1 for a development build, names kept for profiling)
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { createRequire } from "node:module";

const [desktop, outfile] = process.argv.slice(2);
const { options } = await import(pathToFileURL(join(desktop, "scripts/renderer.mjs")).href);
const { build } = createRequire(join(desktop, "package.json"))("esbuild");
const opts = options({ production: process.env.DEV !== "1" });
await build({ ...opts, outfile, plugins: opts.plugins.filter(plugin => plugin.name !== "static") });
console.log("built", outfile);
