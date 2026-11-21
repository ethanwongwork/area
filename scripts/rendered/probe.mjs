// Starts the rendered checks' browser once (cdp-lib.mjs: headless, guest, implicit sign-in off, a fresh profile), loads
// a page, prints the browser's version, launch time and command line, and closes it. CI runs it before the captures, so
// a browser that cannot start fails one short step with its cause (exit code, stderr) instead of a capture.
//   node scripts/rendered/probe.mjs
import { launch } from "./cdp-lib.mjs";

const t0 = Date.now();
let browser;
try {
  browser = await launch();
  const page = await browser.newPage({ width: 400, height: 300, scale: 1 });
  await page.goto("data:text/html,<p>probe</p>");
  const text = await page.eval("document.body.textContent");
  if (text !== "probe") throw new Error(`the probe page rendered ${JSON.stringify(text)}`);
  console.log(`rendered browser: ${browser.version}, a page loaded in ${Date.now() - t0} ms\n  command: ${browser.command}`);
} catch (error) {
  console.error(`probe: the browser cannot start or load a page.\n${error.message}`);
  process.exitCode = 1;
} finally {
  await browser?.close();
}
