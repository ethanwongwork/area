/** A minimal static server for the built docs. No dependency, no configuration. */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dist = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const PORT = Number(process.env.PORT ?? 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let path = decodeURIComponent(url.pathname);
  if (path === "/") path = "/index.html";

  // Contain the path inside dist; never serve above it.
  const target = join(dist, normalize(path).replace(/^(\.\.[/\\])+/, ""));
  if (!target.startsWith(dist)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  try {
    const body = await readFile(target);
    res.writeHead(200, {
      "content-type": TYPES[extname(target)] ?? "application/octet-stream",
      // Never cache: the whole site is rebuilt in place, and a cached stylesheet makes a
      // rebuild look like it silently did nothing.
      "cache-control": "no-store, must-revalidate",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end("<h1>404</h1>");
  }
}).listen(PORT, () => {
  console.log(`\n  Area docs -> http://localhost:${PORT}\n`);
});
