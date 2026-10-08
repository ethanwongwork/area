// Headless Edge for the review sheets. A headless run can write its screenshot or DOM within seconds and
// then never exit (2026-10-07: orphaned headless runs, left by killed or timed-out scripts, held the
// profile, and every later run hung until its timeout and left another orphan). These helpers watch for
// the result and stop Edge as soon as it is complete, so a run never outlives its output. If sheets hang,
// list stray runs with `ps -ax | grep "Microsoft Edge.*--headless"` and stop them.
//   await edgeShot([...flags, "--window-size=W,H"], out.png, url)
//   const dom = await edgeDump([...flags], url)
import { spawn } from "node:child_process"; import { existsSync, statSync, rmSync } from "node:fs";
export const EDGE = "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge";
const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function edgeShot(flags, out, url, timeout = 120000) {
  rmSync(out, { force: true });
  const p = spawn(EDGE, ["--headless=new", ...flags, "--screenshot=" + out, url], { stdio: "ignore" });
  const t0 = Date.now(); let last = -1;
  try {
    while (Date.now() - t0 < timeout) {
      await sleep(250);
      if (existsSync(out)) { const s = statSync(out).size; if (s > 0 && s === last) return out; last = s; }
      if (p.exitCode !== null) { if (existsSync(out)) return out; break; }
    }
    throw new Error("Edge wrote no screenshot: " + out);
  } finally { p.kill("SIGKILL"); }
}

export async function edgeDump(flags, url, timeout = 600000) {
  const p = spawn(EDGE, ["--headless=new", ...flags, "--dump-dom", url], { stdio: ["ignore", "pipe", "ignore"] });
  let dom = ""; p.stdout.on("data", d => { dom += d; });
  const t0 = Date.now();
  try {
    while (Date.now() - t0 < timeout) {
      await sleep(250);
      if (/<\/html>\s*$/.test(dom) || p.exitCode !== null) return dom;
    }
    throw new Error("Edge dumped no DOM: " + url);
  } finally { p.kill("SIGKILL"); }
}
