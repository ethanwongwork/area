// A read-only static server over the built desktop app (apps/desktop/dist), for the rendered captures and checks.
// It binds 127.0.0.1 only and serves files, nothing else: no writes, no directory listings.
//   node scripts/rendered/serve.mjs [root] [port]     (port 0 or none: a free one; prints the URL)
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".woff2": "font/woff2",
  ".woff": "font/woff", ".ttf": "font/ttf", ".otf": "font/otf", ".mp4": "video/mp4", ".webm": "video/webm", ".ico": "image/x-icon",
};

export const DIST = fileURLToPath(new URL("../../apps/desktop/dist/", import.meta.url));

/** Serves `root` on 127.0.0.1:`port` (0 = any free port). Resolves to { url, port, close }. */
export function serve(root = DIST, port = 0) {
  const base = resolve(root);
  const server = createServer(async (req, res) => {
    try {
      const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
      let file = normalize(join(base, path));
      if (file !== base && !file.startsWith(base + sep)) { res.writeHead(403).end(); return; }
      if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, "index.html");
      const body = await readFile(file);
      res.writeHead(200, { "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream", "cache-control": "no-store" });
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  return new Promise((ok, fail) => {
    server.once("error", fail);
    server.listen(port, "127.0.0.1", () => {
      const actual = server.address().port;
      ok({ url: `http://127.0.0.1:${actual}/`, port: actual, close: () => new Promise(done => { server.close(() => done()); server.closeAllConnections(); }) });
    });
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [root = DIST, port = "0"] = process.argv.slice(2);
  const { url } = await serve(root, Number(port));
  console.log(url);
}
