// Minimal CDP client over Node's WebSocket, driving a clean headless Edge. The profile is a new empty directory with
// implicit sign-in, sync and extensions off: without them Edge signs a fresh profile into the Mac's Microsoft account.
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { join } from "node:path";

export async function launch({ port = 9555, dir }) {
  const profile = mkdtempSync(join(dir, "edge-"));
  const proc = spawn("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", [
    "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
    "--guest", "--disable-features=msImplicitSignin", "--disable-sync", "--disable-extensions",
    "--no-first-run", "--window-size=1600,1200", "--force-device-scale-factor=1", "about:blank",
  ], { stdio: "ignore" });
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await new Promise(r => setTimeout(r, 200));
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === "page"); } catch {}
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener("open", r, { once: true }));
  let id = 0; const pending = new Map(); const listeners = [];
  ws.addEventListener("message", e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); }
    else listeners.forEach(l => l(m));
  });
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 600));
    return r.result.value;
  };
  return { send, evaluate, on: l => listeners.push(l), close: () => { ws.close(); proc.kill(); } };
}
