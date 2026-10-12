/**
 * Builds the component review page (a claude.ai Artifact, owner 2026-10-07: "a component review
 * artifact just like the icon review artifact"): every gallery family, its specimens at 100%, the
 * spec's latest changes, references and open questions, and an approval strip.
 *
 *   npm run build:docs                      # the current gallery (apps/docs/dist)
 *   node apps/docs/scripts/component-review.mjs [--before <dist of an earlier build>] [--before-label <text>]
 *     [--unapproved] [--out <dir>]
 *
 * --before points at the dist of an earlier build (a worktree of the commit to compare against,
 * built with npm run build && npm run build:docs); its tiles and stylesheet become the Before view, and every
 * specimen is rendered in both builds to tell which variants look different (review-diff.mjs). Each family leads
 * with its spec's latest "Review note" section: what changed and why, in plain words.
 * The output folder holds the page, data.js, both stylesheets, the demo bundles that hydrate the
 * specimens, and the images they use. Publish the page with those files beside it.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { visualChanges } from "./review-diff.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = resolve(root, "../..");
const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
const dist = join(root, "dist");
const beforeDist = arg("--before");
const out = resolve(arg("--out") ?? join(root, ".cache/component-review"));

const { COMPLETE_COMPONENTS, REVIEW_COMPONENTS } = await import(join(root, "../desktop/src/content/component-status.mjs"));
const RENAMED = { disclosure: "accordion" };

/* Sections and tiles of a built gallery (index.html), by balanced tags. */
function block(html, start, tag) {
  const open = new RegExp(`<${tag}[\\s>]|</${tag}>`, "g");
  open.lastIndex = start + 1;
  let depth = 1, m;
  while ((m = open.exec(html))) { depth += m[0].startsWith("</") ? -1 : 1; if (!depth) return html.slice(start, m.index + m[0].length); }
  throw new Error(`Unbalanced <${tag}> at ${start}`);
}
function galleryOf(file) {
  const html = readFileSync(file, "utf8");
  const families = new Map();
  for (const m of html.matchAll(/<section class="gallery-section" id="component-([a-z0-9-]+)"/g)) {
    const section = block(html, m.index, "section");
    const slug = RENAMED[m[1]] ?? m[1];
    const name = section.match(/class="gallery-section__title"[^>]*>([^<]+)/)?.[1].trim() ?? slug;
    const tiles = [];
    for (const t of section.matchAll(/<article class="gallery-tile" id="gallery-([a-z0-9-]+)"/g)) {
      const tile = block(section, t.index, "article");
      const id = t[1].replace(/^disclosure-/, "accordion-");
      const label = tile.match(/class="gallery-tile__label"[^>]*>([^<]*)/)?.[1] ?? id;
      const stageAt = tile.indexOf('<div class="gallery-tile__stage">');
      const stage = block(tile, stageAt, "div");
      const inner = stage.slice(stage.indexOf(">") + 1, -"</div>".length).replaceAll('"/images/', '"images/');
      tiles.push({ id, label, html: inner });
    }
    families.set(slug, { slug, name, tiles });
  }
  return families;
}

/* A small Markdown renderer for spec excerpts: headings, paragraphs, lists, tables, code, links. */
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const inline = s => esc(s)
  .replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, "$1");
function markdown(md) {
  const lines = md.split("\n"), outLines = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith("```")) { const code = []; i++; while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]); i++; outLines.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`); continue; }
    const h = line.match(/^(#{2,6})\s+(.*)/);
    if (h) { outLines.push(`<h${Math.min(6, h[1].length + 1)}>${inline(h[2])}</h${Math.min(6, h[1].length + 1)}>`); i++; continue; }
    if (line.trim().startsWith("|")) {
      const rows = []; while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(lines[i++]);
      const cells = r => r.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map(c => c.trim());
      const body = rows.filter((r, n) => !(n === 1 && /^[\s|:-]+$/.test(r)));
      outLines.push(`<div class="tbl"><table><thead><tr>${cells(body[0]).map(c => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body.slice(1).map(r => `<tr>${cells(r).map(c => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      const ordered = /^\s*\d+\./.test(line), items = [];
      while (i < lines.length && lines[i].trim() && !/^#{2,6}\s/.test(lines[i])) {
        if (/^\s*([-*]|\d+\.)\s/.test(lines[i])) items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s/, ""));
        else items[items.length - 1] += " " + lines[i].trim();
        i++;
      }
      outLines.push(`<${ordered ? "ol" : "ul"}>${items.map(x => `<li>${inline(x)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`);
      continue;
    }
    const para = []; while (i < lines.length && lines[i].trim() && !/^(#{2,6}\s|\||```|\s*([-*]|\d+\.)\s)/.test(lines[i])) para.push(lines[i++].trim());
    outLines.push(`<p>${inline(para.join(" "))}</p>`);
  }
  return outLines.join("\n");
}

/* A spec's sections by heading, with their level, so a dated section keeps its subsections. */
function sections(md) {
  const found = [], re = /^(#{2,4})\s+(.+)$/gm;
  const heads = [...md.matchAll(re)].map(m => ({ level: m[1].length, title: m[2].trim(), at: m.index, body: m.index + m[0].length }));
  heads.forEach((h, n) => {
    const end = heads.slice(n + 1).find(x => x.level <= h.level)?.at ?? md.length;
    found.push({ ...h, end, text: md.slice(h.body, end).trim() });
  });
  return found;
}
// Spec sections and log lines dated in the open review rounds (from 2026-10-06).
const RECENT = /2026-10-(0[6-9]|[12][0-9]|3[01])/;
function notesOf(slug) {
  const file = join(repo, "docs/specs", `${slug}.md`);
  if (!existsSync(file)) return { changes: "", questions: "", refs: "", log: "", changed: false };
  const md = readFileSync(file, "utf8"), all = sections(md);
  // Dated sections, outermost only (a dated section keeps its own subsections).
  const dated = all.filter(s => RECENT.test(s.title) && !all.some(p => p !== s && RECENT.test(p.title) && p.at < s.at && s.at < p.end));
  const pick = re => all.find(s => re.test(s.title));
  const log = pick(/^Feedback log/i)?.text.split("\n").filter(l => RECENT.test(l)).join("\n") ?? "";
  const refs = [pick(/^Sources/i), pick(/^Measurements/i)].filter(Boolean);
  // The plain summary the page leads with: the spec's latest "Review note" section (component-build skill, step 5).
  const notes = all.filter(s => /^Review note/i.test(s.title));
  const note = notes[notes.length - 1];
  return {
    summary: note ? markdown(note.text) : "",
    summaryTitle: note?.title ?? "",
    changes: dated.map(s => `## ${s.title}\n\n${s.text}`).map(markdown).join("\n"),
    questions: [pick(/^Open questions/i)].filter(Boolean).map(s => markdown(s.text)).join(""),
    refs: refs.map(s => `<h3>${esc(s.title)}</h3>` + markdown(s.text)).join("\n"),
    log: log ? markdown(log) : "",
    changed: dated.length > 0 || Boolean(log),
  };
}

const now = galleryOf(join(dist, "index.html"));
const before = beforeDist ? galleryOf(join(beforeDist, "index.html")) : new Map();
const status = slug => COMPLETE_COMPONENTS.has(slug) ? "complete" : REVIEW_COMPONENTS.has(slug) ? "review" : "unrefined";
// --unapproved: only families the owner has not approved yet (owner, 2026-10-07: "only show me new
// components that haven't been approved yet").
const onlyOpen = process.argv.includes("--unapproved");
const families = [...now.values()].filter(f => !onlyOpen || status(f.slug) !== "complete").map(f => {
  const prior = before.get(f.slug);
  const priorTiles = new Map(prior?.tiles.map(t => [t.id, t.html]) ?? []);
  return {
    slug: f.slug, name: f.name, status: status(f.slug), ...notesOf(f.slug),
    tiles: f.tiles.map(t => ({ ...t, before: priorTiles.get(t.id) ?? null })),
  };
});

// What each specimen looks like now against before, by rendering both (review-diff.mjs). Without --before every
// specimen counts as new.
const changes = beforeDist ? visualChanges({ dist, beforeDist, tiles: families.flatMap(f => f.tiles.map(t => ({ key: `${f.slug}/${t.id}`, now: t.html, before: t.before }))) }) : {};
for (const f of families) for (const t of f.tiles) t.change = changes[`${f.slug}/${t.id}`] ?? { state: "new", modes: [] };

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
// --before-label names the Before build on the page, e.g. "main at 6f89678 (2026-10-08)".
const review = { before: arg("--before-label") ?? (beforeDist ? "the earlier build" : null) };
writeFileSync(join(out, "data.js"), `window.REVIEW = ${JSON.stringify(review)};\nwindow.FAMILIES = ${JSON.stringify(families).replaceAll("</script", "<\\/script")};\n`);
cpSync(join(dist, "area.css"), join(out, "area.css"));
if (beforeDist) cpSync(join(beforeDist, "area.css"), join(out, "area-before.css"));
const clients = readFileSync(join(dist, "index.html"), "utf8").match(/src="\.\/([a-z-]+-demos\.js)"/g).map(s => s.slice(7, -1));
for (const file of clients) cpSync(join(dist, file), join(out, file));
mkdirSync(join(out, "images"));
for (const file of readdirSync(join(dist, "images"))) cpSync(join(dist, "images", file), join(out, "images", file));
const page = readFileSync(join(root, "src/component-review.html"), "utf8").replace("<!--CLIENTS-->", clients.map(f => `<script type="module" src="${f}"></script>`).join("\n"));
writeFileSync(join(out, "component-review.html"), page);
const count = state => families.reduce((n, f) => n + f.tiles.filter(t => t.change.state === state).length, 0);
console.log(`component review: ${families.length} families, ${families.reduce((n, f) => n + f.tiles.length, 0)} specimens (${count("changed")} changed, ${count("new")} new, ${count("unchanged")} unchanged) -> ${out}`);
const missing = families.filter(f => !f.summary).map(f => f.slug);
if (missing.length) console.warn(`no "Review note" section in: ${missing.join(", ")} (docs/specs/<slug>.md)`);
