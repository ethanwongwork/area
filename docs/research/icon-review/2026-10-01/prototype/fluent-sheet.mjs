import { readFileSync, writeFileSync, existsSync } from "node:fs"; import { execFileSync } from "node:child_process";
const [dir, out, ...names] = process.argv.slice(2);
const svg = id => existsSync(`${dir}/${id}.svg`) ? readFileSync(`${dir}/${id}.svg`, "utf8").replace("<svg ", '<svg fill="currentColor" ') : "";
const rows = names.map(n => { const [base, size] = [n.replace(/_\d+$/, ""), n.match(/_(\d+)$/)[1]];
  return `<div class="r"><span class="l">${base} ${size}</span><span class="s">${svg(n + "_regular")}${svg(n + "_filled")}</span><span class="b">${svg(n + "_regular")}${svg(n + "_filled")}</span></div>`; }).join("");
writeFileSync(out + ".html", `<!doctype html><style>body{font:14px system-ui;margin:16px;display:grid;grid-template-columns:1fr 1fr;gap:6px 24px}.r{display:flex;align-items:center;gap:16px;border-bottom:1px solid #eee;padding:6px 0}.l{width:150px}.s svg{width:16px;height:16px;margin-right:6px}.b svg{width:96px;height:96px;margin-right:10px}</style>${rows}`);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=1200,${40 + 60 * Math.ceil(names.length / 2) + 50 * Math.ceil(names.length / 2)}`, `--screenshot=${out}`, `file://${out}.html`], { stdio: "ignore" });
