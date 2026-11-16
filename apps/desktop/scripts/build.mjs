/** Builds the renderer into dist/ (run the workspace build first: npm run build at the root). */
import { build } from "esbuild";
import { options, packagesBuilt, repo } from "./renderer.mjs";
import { apiRowsPlugin } from "./api-rows.mjs";

if (!packagesBuilt()) {
  console.error("The Area packages are not built. Run `npm run build` at the repository root first.");
  process.exit(1);
}
// The API tab's rows, generated from the manifest and the React props (scripts/api-rows.mjs).
const config = options({ production: true });
await build({ ...config, plugins: [...config.plugins, apiRowsPlugin(repo)] });
console.log("Area desktop renderer built → apps/desktop/dist");
