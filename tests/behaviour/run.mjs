// npm run test:behaviour [-- <suite> …]: runs tests/behaviour/suites/<suite>.test.mjs (all when none is named) under
// node:test, each suite in its own headless Edge. Needs built packages (npm run build).
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "suites");
const all = readdirSync(dir).filter(f => f.endsWith(".test.mjs")).map(f => f.replace(/\.test\.mjs$/, "")).sort();
const asked = process.argv.slice(2).filter(a => !a.startsWith("-"));
const unknown = asked.filter(a => !all.includes(a));
if (unknown.length) { console.error(`No suite ${unknown.join(", ")}. Suites: ${all.join(", ")}`); process.exit(2); }
const files = (asked.length ? asked : all).map(s => join(dir, `${s}.test.mjs`));
const flags = process.argv.slice(2).filter(a => a.startsWith("-"));
const r = spawnSync(process.execPath, ["--test", "--test-concurrency=3", ...flags, ...files], { stdio: "inherit" });
process.exit(r.status ?? 1);
