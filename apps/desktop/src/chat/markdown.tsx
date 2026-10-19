/**
 * Markdown for the Chat view's assistant turns (Phase 1, docs/research/inspector-chat-2026-10-18, "What to build" 7),
 * drawn with Area's parts: Code for inline code, the Inspector's code well (Code block `sm`) for fenced code, Table,
 * Link. Enough of CommonMark for an agent's replies: headings, paragraphs, bullet and numbered lists (one level of
 * nesting), block quotes, fenced code, pipe tables, **strong**, *emphasis*, `code` and [links](url). Text may still be
 * streaming, so an unclosed fence draws as code so far.
 *
 * App-level for now; it becomes an Area component once its look is reviewed (it is the backlog's "markdown for
 * Message").
 */
import { Fragment, type ReactNode } from "react";
import { Code, Link, Table } from "@area/react";
import { CodeWell } from "../inspector.tsx";
import { parse, type Block } from "./markdown-parse.ts";

/** Inline marks: `code`, **strong**, *emphasis*, [links](url). Code is taken first, so its contents stay literal. */
export function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const key = out.length;
    if (match[1] !== undefined) out.push(<Code key={key}>{match[1]}</Code>);
    else if (match[2] !== undefined) out.push(<strong key={key}>{inline(match[2])}</strong>);
    else if (match[3] !== undefined) out.push(<em key={key}>{inline(match[3])}</em>);
    else out.push(<Link key={key} href={match[5]} target="_blank" rel="noreferrer">{inline(match[4]!)}</Link>);
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** The blocks as Area parts. Each top-level block is a direct child, so Message's 16 between blocks applies. */
export function Markdown({ text }: { text: string }) {
  return <>{parse(text).map((block, index) => <Fragment key={index}>{render(block)}</Fragment>)}</>;
}

function render(block: Block): ReactNode {
  switch (block.kind) {
    case "heading": {
      const H = `h${Math.min(6, block.level + 2)}` as "h3";
      return <H className="studio-md__heading" data-level={Math.min(block.level, 3)}>{inline(block.text)}</H>;
    }
    case "paragraph": return <p>{inline(block.text)}</p>;
    case "quote": return <blockquote className="studio-md__quote">{inline(block.text)}</blockquote>;
    case "code": return <div className="studio-md__code"><CodeWell code={block.code} language={block.language} /></div>;
    case "table": return (
      <div className="studio-md__table">
        <Table size="sm" aria-label="Table">
          <thead><tr>{block.head.map((cell, index) => <th key={index} scope="col">{inline(cell)}</th>)}</tr></thead>
          <tbody>{block.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{inline(cell)}</td>)}</tr>)}</tbody>
        </Table>
      </div>
    );
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className="studio-md__list">
          {block.items.map((item, index) => (
            <li key={index}>
              {inline(item.text)}
              {item.children.length ? <ul className="studio-md__list">{item.children.map((child, c) => <li key={c}>{inline(child)}</li>)}</ul> : null}
            </li>
          ))}
        </List>
      );
    }
  }
}
