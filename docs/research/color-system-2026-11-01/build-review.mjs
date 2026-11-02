/**
 * Builds review.html (the published review page) from review.src.html, prototype.ts's data and the validator's results.
 *   node docs/research/color-system-2026-11-01/build-review.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
const here = (f) => new URL(f, import.meta.url).pathname;
const data = execFileSync("node", [here("prototype.ts"), "--json"], { encoding: "utf8" }).trim();
const val = /VALIDATION_JSON (.*)/.exec(execFileSync("node", [here("validate-series.mjs")], { encoding: "utf8" }))[1];
writeFileSync(here("prototype.json"), data + "\n");
const html = readFileSync(here("review.src.html"), "utf8").replace("/*DATA*/null", data).replace("/*VALIDATION*/null", val);
writeFileSync(here("review.html"), html);
console.log("review.html", html.length, "bytes");
