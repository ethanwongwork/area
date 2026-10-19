/**
 * A family's page beyond its Stage (owner, 2026-10-18: "showing all information about the component, any and all
 * data, code associated with it"; "tabs, but make sure one of the tabs is documentation"; "make sure the info is
 * organized into tables ... use tables when possible"). Astryx splits a component into Overview, Properties and
 * Accessibility; React Bits lists props, dependencies and related components as tables. Here:
 *
 *   Overview       the Stage, its code and the family's tiles (src/pages/components.tsx)
 *   Documentation  what it is for, what to use instead, do and don't, anatomy, states, keyboard, ARIA
 *   API            import, props with their source's descriptions, classes, parts, state attributes, CSS properties
 *   Code           the React source, the stylesheet, the manifest entry and every tile's demo
 *   Spec           the family's spec (docs/specs/<slug>.md), its lists of dated entries as tables
 *
 * Every row comes from a source of truth: the styles manifest, the React source and its JSDoc, the stylesheet, the
 * spec, and src/content/documentation.mjs (the spec restated where it is prose). Nothing is written here twice.
 */
import { Fragment, type ReactNode } from "react";
import { Badge, Code, CodeBlock, Kbd, Link, ScrollArea, SectionHeading, Table, TableCell, TableLink } from "@area/react";
import SOURCES from "virtual:component-sources";
// @ts-expect-error — the documentation content is authored in JavaScript.
import { DOCUMENTATION } from "./content/documentation.mjs";
// @ts-expect-error — the highlighter is authored in JavaScript.
import { highlight } from "./content/highlight.mjs";
import { APP_SCALE } from "./app-scale.ts";

export const FAMILY_TABS = [
  { id: "overview", label: "Overview" },
  { id: "documentation", label: "Documentation" },
  { id: "api", label: "API" },
  { id: "code", label: "Code" },
  { id: "spec", label: "Spec" },
] as const;
export type FamilyTab = (typeof FAMILY_TABS)[number]["id"];
export const FAMILY_TAB_IDS = FAMILY_TABS.map(tab => tab.id);

export interface FamilyManifest {
  block: string;
  description: string;
  variants: Record<string, readonly string[]>;
  booleans?: readonly string[];
  defaults: Record<string, string>;
  elements?: readonly string[];
  states?: readonly string[];
  stateAttributes?: Record<string, string>;
}

export interface FamilyInfo {
  slug: string;
  name: string;
  /** Exported names, comma-separated ("Button" or "Tabs, Tab"). */
  imports?: string;
  manifest?: FamilyManifest;
  api?: string[][];
  status: { label: string; tone: "success" | "caution" | "neutral" };
  /** Each tile's specimen name and its demo's code, in tile order. */
  demos: Array<{ label: string; code?: string }>;
}

interface Documentation {
  instead?: Array<[string, string[], string]>;
  practices?: Array<["Do" | "Don't", string]>;
  parts?: Record<string, string>;
  states?: Record<string, string>;
  keyboard?: Array<[string, string]>;
  aria?: Array<[string, string]>;
}

const REPO = "https://github.com/ethanwongwork/area/blob/main/";
const words = (name: string) => name[0]!.toUpperCase() + name.slice(1).replaceAll("-", " ");
const anchor = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* --- Sources ------------------------------------------------------------------ */

export const specText = (slug: string): string | undefined => SOURCES.specs[`${slug}.md`];

/** The spec's `## ` sections, by title, and what comes before the first one. */
function specSections(text: string) {
  const sections = new Map<string, string>();
  const parts = text.split(/^## /m);
  for (const part of parts.slice(1)) {
    const newline = part.indexOf("\n");
    sections.set(part.slice(0, newline).trim(), part.slice(newline + 1).trim());
  }
  return { preamble: parts[0] ?? "", sections };
}

/** The `**Key:** value` lines at the top of a spec (Status, Captures, Peers), continuation lines joined. */
function specFacts(preamble: string): Array<[string, string]> {
  const facts: Array<[string, string]> = [];
  for (const line of preamble.split("\n")) {
    const match = line.match(/^\*\*([^*]+?):\*\*\s*(.*)$/);
    if (match) facts.push([match[1]!, match[2]!]);
    else if (facts.length && line.trim() && !line.startsWith("#")) facts.at(-1)![1] += ` ${line.trim()}`;
  }
  return facts;
}

/** The stylesheet that draws the family: its own file, else the one that writes its block most. */
function stylesheetOf(slug: string, block?: string): string | undefined {
  if (SOURCES.css[`${slug}.css`] !== undefined) return `${slug}.css`;
  if (!block) return undefined;
  const pattern = new RegExp(`\\.${block}(?![\\w-])`, "g");
  let best: string | undefined;
  let most = 0;
  for (const [file, text] of Object.entries(SOURCES.css)) {
    const count = text.match(pattern)?.length ?? 0;
    if (count > most) { most = count; best = file; }
  }
  return best;
}

/**
 * The React source of an export: its own file, or its section of a shared file (primitives.tsx's `/* --- Name`
 * blocks), from the section marker before its declaration to the next.
 */
function reactSourceOf(name: string): { file: string; code: string } | undefined {
  if (SOURCES.react[`${name}.tsx`] !== undefined) return { file: `${name}.tsx`, code: SOURCES.react[`${name}.tsx`]! };
  const declaration = new RegExp(`^export (?:interface ${name}Props\\b|const ${name}\\b|function ${name}\\b)`, "m");
  for (const [file, text] of Object.entries(SOURCES.react)) {
    const at = text.search(declaration);
    if (at < 0) continue;
    const start = text.lastIndexOf("/* --- ", at);
    const end = text.indexOf("/* --- ", at);
    return { file, code: text.slice(start < 0 ? 0 : start, end < 0 ? undefined : end).trim() };
  }
  return undefined;
}

const exportsOf = (family: FamilyInfo) => (family.imports ?? "").split(",").map(name => name.trim()).filter(Boolean);

/* --- Markdown, as Area components --------------------------------------------- */

/** Inline markdown: `code`, **strong**, *emphasis* and [links](to), links resolved against the spec's folder. */
function Inline({ text, base = "docs/specs/" }: { text: string; base?: string }) {
  const out: ReactNode[] = [];
  const pattern = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(?<![\w*])\*([^*\s][^*]*)\*(?![\w*])/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index! > last) out.push(text.slice(last, match.index));
    if (match[1] !== undefined) out.push(<Code key={match.index}>{match[1]}</Code>);
    else if (match[2] !== undefined) out.push(<strong key={match.index}>{match[2]}</strong>);
    else if (match[3] !== undefined) {
      const href = /^[a-z]+:/.test(match[4]!) ? match[4]! : new URL(match[4]!, REPO + base).href;
      out.push(<Link key={match.index} href={href} target="_blank" rel="noreferrer">{match[3]}</Link>);
    } else out.push(<em key={match.index}>{match[5]}</em>);
    last = match.index! + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** A table row's cells: pipes inside backticks or escaped are the cell's own. */
function cells(line: string) {
  const out: string[] = [];
  let cell = "";
  let tick = false;
  const body = line.trim().replace(/^\||\|$/g, "");
  for (let index = 0; index < body.length; index++) {
    const char = body[index]!;
    if (char === "\\" && body[index + 1] === "|") { cell += "|"; index++; continue; }
    if (char === "`") tick = !tick;
    if (char === "|" && !tick) { out.push(cell.trim()); cell = ""; continue; }
    cell += char;
  }
  out.push(cell.trim());
  return out;
}

const DATED = /^(\d{4}-\d{2}-\d{2})(?:\s*[·:,(]\s*|\s+)?/;

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "code"; language: string; text: string }
  | { kind: "table"; rows: string[][] }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "paragraph"; text: string };

function blocks(text: string): Block[] {
  const lines = text.split("\n");
  const out: Block[] = [];
  for (let index = 0; index < lines.length;) {
    const line = lines[index]!;
    if (!line.trim()) { index++; continue; }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) { out.push({ kind: "heading", level: heading[1]!.length, text: heading[2]! }); index++; continue; }
    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const body: string[] = [];
      for (index++; index < lines.length && !lines[index]!.startsWith("```"); index++) body.push(lines[index]!);
      out.push({ kind: "code", language, text: body.join("\n") });
      index++;
      continue;
    }
    if (line.trimStart().startsWith("|")) {
      const rows: string[][] = [];
      for (; index < lines.length && lines[index]!.trimStart().startsWith("|"); index++) {
        if (!/^\s*\|?\s*:?-{2,}/.test(lines[index]!)) rows.push(cells(lines[index]!));
      }
      out.push({ kind: "table", rows });
      continue;
    }
    const item = /^(\s*)([-*]|\d+\.)\s+/;
    if (item.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      for (; index < lines.length; index++) {
        const next = lines[index]!;
        // The first item at any indent; later ones at the list's own (a deeper one continues its item).
        if (item.test(next) && (!items.length || next.match(item)![1]!.length < 2)) items.push(next.replace(item, ""));
        else if (next.trim() && /^\s{2,}/.test(next) && items.length) items[items.length - 1] += ` ${next.trim()}`;
        else if (!next.trim() && item.test(lines[index + 1] ?? "")) continue;
        else break;
      }
      out.push({ kind: "list", ordered, items });
      continue;
    }
    const paragraph: string[] = [];
    for (; index < lines.length && lines[index]!.trim() && !/^(#{1,6}\s|```|\s*\||\s*([-*]|\d+\.)\s)/.test(lines[index]!); index++) paragraph.push(lines[index]!.trim());
    // Always move on: a line no rule above took is a paragraph of its own.
    if (!paragraph.length) paragraph.push(lines[index++]!.trim());
    out.push({ kind: "paragraph", text: paragraph.join(" ") });
  }
  return out;
}

/** A markdown document as Area components: tables as Tables, dated lists as Date / Entry tables, code as Code blocks. */
export function Markdown({ text, idPrefix }: { text: string; idPrefix: string }) {
  return (
    <div className="studio-doc">
      {blocks(text).map((block, index) => {
        switch (block.kind) {
          case "heading":
            return <SectionHeading key={index} className="studio-doc__heading" level={Math.min(Math.max(block.level, 2), 6) as 2}
              titleId={`${idPrefix}-${anchor(block.text)}`} title={<Inline text={block.text} />} />;
          case "code":
            return <CodeBlock key={index} code={block.text} language={block.language || undefined} lineNumbers={false} {...APP_SCALE} />;
          case "table": {
            const [head = [], ...body] = block.rows;
            return <DataTable key={index} label="Spec table" head={head.map(cell => <Inline text={cell} />)}
              rows={body.map(row => head.map((_, column) => <Inline text={row[column] ?? ""} />))} />;
          }
          case "list":
            // A list of mostly dated entries (decisions, the feedback log) reads as a Date / Entry table; an undated
            // entry's date is a dash.
            if (block.items.filter(entry => DATED.test(entry)).length * 2 >= block.items.length) {
              return <DataTable key={index} label="Dated entries" head={["Date", "Entry"]} fit={[0]}
                rows={block.items.map(entry => {
                  const date = entry.match(DATED)?.[0] ?? "";
                  return [date ? <span className="studio-tabular">{date.match(/\d{4}-\d{2}-\d{2}/)![0]}</span> : <span className="studio-muted">—</span>, <Inline text={entry.slice(date.length)} />];
                })} />;
            }
            return block.ordered
              ? <ol key={index} className="studio-doc__list">{block.items.map((entry, item) => <li key={item}><Inline text={entry} /></li>)}</ol>
              : <ul key={index} className="studio-doc__list">{block.items.map((entry, item) => <li key={item}><Inline text={entry} /></li>)}</ul>;
          default:
            return <p key={index} className="studio-doc__text"><Inline text={block.text} /></p>;
        }
      })}
    </div>
  );
}

/* --- Tables ------------------------------------------------------------------- */

/**
 * One Area Table: a header row and body rows; `fit` columns shrink to their longest entry. A flush Table draws past its
 * box (navigation.css, its row plates), so a table wider than the Canvas (a spec's evidence table) scrolls in Area's
 * Scroll area rather than widening the page.
 */
function DataTable({ label, head, rows, fit = [] }: { label: string; head: ReactNode[]; rows: ReactNode[][]; fit?: number[] }) {
  return (
    <ScrollArea type="hover">
    <Table size="md" flush aria-label={label}>
      <thead><tr>{head.map((cell, index) => <th key={index} scope="col">{cell}</th>)}</tr></thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>{row.map((cell, column) => fit.includes(column) ? <TableCell key={column} fit>{cell}</TableCell> : <td key={column}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </Table>
    </ScrollArea>
  );
}

/** Term / value rows (the Inspector's facts, on the Canvas). */
function FactTable({ label, rows }: { label: string; rows: Array<[ReactNode, ReactNode] | null | false | undefined> }) {
  return (
    <Table size="md" flush aria-label={label}>
      <tbody>
        {rows.filter((row): row is [ReactNode, ReactNode] => Boolean(row)).map(([term, value], index) => (
          <tr key={index}><TableCell fit><span className="studio-muted">{term}</span></TableCell><td>{value}</td></tr>
        ))}
      </tbody>
    </Table>
  );
}

/** A titled section of a tab, at the app's own scale (documentation, not specimens). */
function Section({ id, title, count, children }: { id: string; title: string; count?: number; children: ReactNode }) {
  return (
    <section className="studio-section" aria-labelledby={id} {...APP_SCALE}>
      <SectionHeading className="studio-section-heading" titleId={id}
        title={count === undefined ? title : <>{title} <span className="studio-muted studio-tabular">{count}</span></>} />
      {children}
    </section>
  );
}

/* --- Documentation ------------------------------------------------------------ */

export function DocumentationTab({ family, onOpenFamily, familyName }: {
  family: FamilyInfo; onOpenFamily: (slug: string) => void; familyName: (slug: string) => string | undefined;
}) {
  const doc: Documentation = DOCUMENTATION[family.slug] ?? {};
  const spec = specText(family.slug);
  const { preamble, sections } = spec ? specSections(spec) : { preamble: "", sections: new Map<string, string>() };
  const facts = new Map(specFacts(preamble));
  const manifest = family.manifest;
  const job = sections.get("Job and boundaries");
  const behaviour = sections.get("Behavior and accessibility");
  const familyLink = (slug: string) => familyName(slug)
    ? <TableLink key={slug} href={`#components/${slug}`} onClick={event => { event.preventDefault(); onOpenFamily(slug); }}>{familyName(slug)}</TableLink>
    : <span key={slug}>{words(slug)}</span>;
  const states = manifest?.states ?? [];
  return (
    <div className="studio-sections">
      <Section id="doc-overview" title="Overview">
        <FactTable label="Overview" rows={[
          manifest ? ["Purpose", manifest.description] : null,
          job ? ["Job", <Inline text={job.split("\n\n")[0]!.replace(/\n/g, " ")} />] : null,
          exportsOf(family).length ? ["Import", <Code>{`import { ${exportsOf(family).join(", ")} } from "@area/react";`}</Code>] : null,
          ["Status", <Badge size="sm" variant="soft" tone={family.status.tone}>{family.status.label}</Badge>],
          facts.get("Peers") ? ["Related", <Inline text={facts.get("Peers")!} />] : null,
          spec ? ["Spec", <Link href={`${REPO}docs/specs/${family.slug}.md`} target="_blank" rel="noreferrer">{family.slug}.md</Link>] : null,
        ]} />
      </Section>
      {doc.instead?.length ? (
        <Section id="doc-instead" title="Use something else">
          <DataTable label="Use something else" head={["When", "Use", "Why"]} fit={[1]}
            rows={doc.instead.map(([when, slugs, why]) => [when, <span className="studio-doc__links studio-doc__links--row">{slugs.map(familyLink)}</span>, why])} />
        </Section>
      ) : null}
      {doc.practices?.length ? (
        <Section id="doc-practices" title="Best practices" count={doc.practices.length}>
          <DataTable label="Best practices" head={["", "Guidance"]} fit={[0]}
            rows={doc.practices.map(([kind, text]) => [<Badge size="sm" variant="soft" tone={kind === "Do" ? "success" : "danger"}>{kind}</Badge>, <Inline text={text} />])} />
        </Section>
      ) : null}
      {manifest ? (
        <Section id="doc-anatomy" title="Anatomy" count={1 + (manifest.elements?.length ?? 0)}>
          <DataTable label="Anatomy" head={["Part", "Class", "What it is"]} fit={[0, 1]}
            rows={[["root", manifest.block], ...(manifest.elements ?? []).map(part => [part, `${manifest.block}__${part}`])].map(([part, name]) => [
              part === "root" ? "Root" : words(part!), <Code>{`.${name}`}</Code>, doc.parts?.[part!] ?? <span className="studio-muted">—</span>,
            ])} />
        </Section>
      ) : null}
      {states.length ? (
        <Section id="doc-states" title="States" count={states.length}>
          <DataTable label="States" head={["State", "Attribute", "What changes"]} fit={[0, 1]}
            rows={states.map(state => [words(state), <Code>{manifest?.stateAttributes?.[state] ?? `data-${state}`}</Code>, doc.states?.[state] ?? <span className="studio-muted">—</span>])} />
        </Section>
      ) : null}
      {doc.keyboard?.length ? (
        <Section id="doc-keyboard" title="Keyboard">
          <DataTable label="Keyboard" head={["Keys", "What happens"]} fit={[0]}
            rows={doc.keyboard.map(([keys, action]) => [<span className="studio-doc__links studio-doc__links--row">{keys.split(" or ").map(key => <Kbd key={key} keys={[key]} size="sm" />)}</span>, action])} />
        </Section>
      ) : null}
      {doc.aria?.length || behaviour ? (
        <Section id="doc-accessibility" title="Accessibility">
          <div className="studio-doc">
            {doc.aria?.length ? (
              <DataTable label="ARIA" head={["Attribute", "When"]} fit={[0]}
                rows={doc.aria.map(([attribute, when]) => [<span className="studio-doc__links">{attribute.split(", ").map(name => <Code key={name}>{name}</Code>)}</span>, when])} />
            ) : null}
            {/* The spec's prose only where no ARIA table restates it. */}
            {behaviour && !doc.aria?.length ? <Markdown text={behaviour} idPrefix="doc-behaviour" /> : null}
          </div>
        </Section>
      ) : null}
    </div>
  );
}

/* --- API ---------------------------------------------------------------------- */

/** The CSS custom properties a stylesheet declares (its private `--_` hooks) and the tokens it reads. */
function cssProperties(text: string) {
  const declared = new Map<string, string>();
  for (const [, name, value] of text.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/(--_[\w-]+)\s*:\s*([^;]+);/g)) {
    if (!declared.has(name!)) declared.set(name!, value!.trim().replace(/\s+/g, " "));
  }
  const read = new Map<string, number>();
  for (const [, name] of text.matchAll(/var\((--area-[\w-]+)/g)) read.set(name!, (read.get(name!) ?? 0) + 1);
  return { declared: [...declared], read: [...read].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])) };
}

export function ApiTab({ family }: { family: FamilyInfo }) {
  const manifest = family.manifest;
  const [primary] = exportsOf(family);
  const docs = primary ? SOURCES.propDocs[`${primary}Props`] ?? {} : {};
  const sheet = stylesheetOf(family.slug, manifest?.block);
  const css = sheet ? cssProperties(SOURCES.css[sheet]!) : undefined;
  const describe = (prop: string) => prop.split(/ \/ /).map(name => docs[name.trim()]).filter(Boolean).join(" ");
  return (
    <div className="studio-sections">
      <Section id="api-import" title="Import">
        <FactTable label="Import" rows={[
          ["Package", <Code>@area/react</Code>],
          exportsOf(family).length ? ["Exports", <span className="studio-doc__links">{exportsOf(family).map(name => <Code key={name}>{name}</Code>)}</span>] : null,
          manifest ? ["Class", <Code>{`.${manifest.block}`}</Code>] : null,
          sheet ? ["Stylesheet", <Code>{`packages/styles/src/components/${sheet}`}</Code>] : null,
        ]} />
      </Section>
      {family.api?.length ? (
        <Section id="api-props" title="Props" count={family.api.length}>
          <DataTable label="Props" head={["Prop", "Type", "Default", "Description"]} fit={[0, 2]}
            rows={family.api.map(([prop = "", type = "", fallback]) => [
              <span className="studio-doc__stack">{prop.split(/ \/ /).map(name => <Code key={name} className="studio-prop">{name}</Code>)}</span>,
              type,
              fallback && fallback !== "—" ? <Code>{fallback}</Code> : <span className="studio-muted">—</span>,
              describe(prop) ? <Inline text={describe(prop)} /> : <span className="studio-muted">—</span>,
            ])} />
        </Section>
      ) : null}
      {manifest && (Object.keys(manifest.variants).length || manifest.booleans?.length) ? (
        <Section id="api-classes" title="Variant classes">
          <DataTable label="Variant classes" head={["Axis", "Values", "Default", "Class"]} fit={[0, 2, 3]}
            rows={[
              ...Object.entries(manifest.variants).map(([axis, values]) => [
                axis, <span className="studio-doc__links">{values.map(value => <Code key={value}>{value}</Code>)}</span>,
                manifest.defaults[axis] ? <Code>{manifest.defaults[axis]}</Code> : <span className="studio-muted">—</span>,
                <Code>{`.${manifest.block}--{value}`}</Code>,
              ]),
              ...(manifest.booleans ?? []).map(flag => [flag, <span className="studio-muted">on / off</span>, <span className="studio-muted">off</span>, <Code>{`.${manifest.block}--${flag}`}</Code>]),
            ]} />
        </Section>
      ) : null}
      {manifest?.states?.length ? (
        <Section id="api-states" title="State attributes" count={manifest.states.length}>
          <DataTable label="State attributes" head={["State", "Attribute"]} fit={[0]}
            rows={manifest.states.map(state => [words(state), <Code>{manifest.stateAttributes?.[state] ?? `data-${state}`}</Code>])} />
        </Section>
      ) : null}
      {css?.declared.length ? (
        <Section id="api-private" title="Private properties" count={css.declared.length}>
          <DataTable label="Private properties" head={["Property", "First value"]} fit={[0]}
            rows={css.declared.map(([name, value]) => [<Code>{name}</Code>, <Code>{value}</Code>])} />
        </Section>
      ) : null}
      {css?.read.length ? (
        <Section id="api-tokens" title="Tokens read" count={css.read.length}>
          <DataTable label="Tokens read" head={["Token", "Uses"]} fit={[1]}
            rows={css.read.map(([name, count]) => [<Code>{name}</Code>, <span className="studio-tabular">{count}</span>])} />
        </Section>
      ) : null}
    </div>
  );
}

/* --- Code --------------------------------------------------------------------- */

export function CodeTab({ family }: { family: FamilyInfo }) {
  const [primary] = exportsOf(family);
  const react = primary ? reactSourceOf(primary) : undefined;
  const sheet = stylesheetOf(family.slug, family.manifest?.block);
  const demos = family.demos.filter(demo => demo.code).map(demo => `// ${demo.label}\n${demo.code}`).join("\n\n");
  const files = [
    react ? { id: "code-react", title: react.file, path: `packages/react/src/components/${react.file}`, what: react.code === SOURCES.react[react.file] ? "React component" : `React component (its section of ${react.file})`, code: react.code, language: "tsx", html: true } : null,
    sheet ? { id: "code-css", title: sheet, path: `packages/styles/src/components/${sheet}`, what: "Stylesheet", code: SOURCES.css[sheet]!, language: "css", html: false } : null,
    family.manifest ? { id: "code-manifest", title: "manifest.ts", path: "packages/styles/src/manifest.ts", what: "Manifest entry: block, axes, defaults, parts, states", code: JSON.stringify(family.manifest, null, 2), language: "json", html: false } : null,
    demos ? { id: "code-demos", title: "Demos", path: "apps/desktop/src/content/demos", what: `Every tile's demo (${family.demos.length})`, code: demos, language: "tsx", html: true } : null,
  ].filter((file): file is NonNullable<typeof file> => Boolean(file));
  return (
    <div className="studio-sections">
      <Section id="code-files" title="Files" count={files.length}>
        <DataTable label="Files" head={["File", "What", "Lines", "Path"]} fit={[0, 2]}
          rows={files.map(file => [
            <TableLink href={`#${file.id}`} onClick={event => { event.preventDefault(); document.getElementById(file.id)?.scrollIntoView({ block: "start" }); }}>{file.title}</TableLink>,
            file.what, <span className="studio-tabular">{file.code.split("\n").length}</span>, <Code>{file.path}</Code>,
          ])} />
      </Section>
      {files.map(file => (
        <Section key={file.id} id={file.id} title={file.title}>
          <CodeBlock title={file.path} language={file.language} {...(file.html ? { html: highlight(file.code) } : { code: file.code })}
            collapsible defaultCollapsed {...APP_SCALE} />
        </Section>
      ))}
    </div>
  );
}

/* --- Spec --------------------------------------------------------------------- */

export function SpecTab({ family }: { family: FamilyInfo }) {
  const spec = specText(family.slug);
  if (!spec) return <p className="studio-muted">No spec yet: docs/specs/{family.slug}.md does not exist.</p>;
  const { preamble, sections } = specSections(spec);
  const facts = specFacts(preamble);
  return (
    <div className="studio-sections">
      <Section id="spec-summary" title="Summary">
        <FactTable label="Spec summary" rows={[
          ["File", <Link href={`${REPO}docs/specs/${family.slug}.md`} target="_blank" rel="noreferrer">docs/specs/{family.slug}.md</Link>],
          ...facts.map(([key, value]) => [key, <Inline text={value} />] as [ReactNode, ReactNode]),
          ["Sections", <span className="studio-doc__links">{[...sections.keys()].map(title => (
            <Fragment key={title}><Link href={`#spec-${anchor(title)}`} onClick={event => { event.preventDefault(); document.getElementById(`spec-${anchor(title)}`)?.scrollIntoView({ block: "start" }); }}>{title}</Link></Fragment>
          ))}</span>],
        ]} />
      </Section>
      {[...sections].map(([title, body]) => (
        <Section key={title} id={`spec-${anchor(title)}`} title={title}>
          {body ? <Markdown text={body} idPrefix={`spec-${anchor(title)}`} /> : <span className="studio-muted">Empty</span>}
        </Section>
      ))}
    </div>
  );
}
