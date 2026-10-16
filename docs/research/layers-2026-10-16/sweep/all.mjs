// Runs run.mjs for every combination, six at a time, each in a fresh headless Edge.
import { spawn } from "node:child_process";
import { mkdirSync, openSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] ?? "out";
const combos = [];
for (const g of ["100", "95", "90"]) for (const l of ["0", "4", "8"]) combos.push(["light", g, l]);
for (const g of ["0", "8", "24"]) for (const l of ["0", "4", "8"]) combos.push(["dark", g, l]);
mkdirSync(join(here, "logs"), { recursive: true });
let port = 9400;
const run = ([t, g, l]) => new Promise(res => {
  const log = openSync(join(here, "logs", `${t}-${g}-${l}.log`), "w");
  const p = spawn(process.execPath, [join(here, "run.mjs"), join(here, out), t, g, l, String(++port)], { stdio: ["ignore", log, log] });
  p.on("exit", code => { console.log(`${t}-${g}-${l} exit ${code}`); res(); });
});
const queue = [...combos];
await Promise.all(Array.from({ length: 6 }, async () => { while (queue.length) await run(queue.shift()); }));
console.log("done");
