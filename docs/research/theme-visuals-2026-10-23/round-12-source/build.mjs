// Bundles scenes.jsx with the worktree's packages and writes scenes.json (static HTML per setting and visual).
import { build } from "esbuild";
import { writeFileSync } from "node:fs";
const [root, dir] = process.argv.slice(2);
await build({
  entryPoints: [`${dir}/scenes.jsx`], bundle: true, platform: "node", format: "esm", jsx: "automatic",
  outfile: `${dir}/scenes.bundle.mjs`, nodePaths: [`${root}/node_modules`], logLevel: "warning",
  alias: { "@area/react": `${root}/packages/react/dist/modules/index.js`, "@area/icons": `${root}/packages/icons/dist/modules/index.js` },
  define: { "process.env.NODE_ENV": '"production"' }, banner: { js: "import { createRequire as __cr } from \"module\"; const require = __cr(import.meta.url);" },
});
const { render } = await import(`${dir}/scenes.bundle.mjs?${Date.now()}`);
const out = render();
writeFileSync(`${dir}/scenes.json`, JSON.stringify(out));
console.log(Object.keys(out).length, "settings;", JSON.stringify(out).length, "bytes");
