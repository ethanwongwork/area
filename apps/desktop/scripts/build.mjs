/** Builds the renderer into dist/ (run the workspace build first: npm run build at the root). */
import { build } from "esbuild";
import { options, packagesBuilt } from "./renderer.mjs";

if (!packagesBuilt()) {
  console.error("The Area packages are not built. Run `npm run build` at the repository root first.");
  process.exit(1);
}
await build(options({ production: true }));
console.log("Area desktop renderer built → apps/desktop/dist");
