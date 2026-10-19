/**
 * The block parser behind the Chat view's markdown (src/chat/markdown.tsx), pure so it can be tested on its own: text
 * arrives a few words at a time, so it is parsed at every length, and each pass must consume at least one line
 * (apps/desktop/tests/chat-markdown.test.ts).
 */
export type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: Array<{ text: string; children: string[] }> }
  | { kind: "quote"; text: string }
  | { kind: "code"; language: string; code: string }
  | { kind: "table"; head: string[]; rows: string[][] };

const LIST = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const cells = (line: string) => line.trim().replace(/^\||\|$/g, "").split("|").map(cell => cell.trim());

export function parse(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^\s*```(\S*)/);
    if (fence) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i]!)) code.push(lines[i++]!);
      i++; // the closing fence, if it has arrived
      blocks.push({ kind: "code", language: fence[1] || "text", code: code.join("\n") });
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) { blocks.push({ kind: "heading", level: heading[1]!.length, text: heading[2]! }); i++; continue; }
    if (/^\s*\|/.test(line) && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] ?? "")) {
      const head = cells(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && /^\s*\|/.test(lines[i]!)) rows.push(cells(lines[i++]!));
      blocks.push({ kind: "table", head, rows });
      continue;
    }
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i]!)) quote.push(lines[i++]!.replace(/^>\s?/, ""));
      blocks.push({ kind: "quote", text: quote.join(" ") });
      continue;
    }
    const item = line.match(LIST);
    if (item) {
      const ordered = /\d/.test(item[2]!);
      const items: Array<{ text: string; children: string[] }> = [];
      while (i < lines.length) {
        const match = lines[i]!.match(LIST);
        // The first line always starts the list, however deep it is indented, so the loop always moves on.
        if (match && (match[1]!.length < 2 || !items.length)) { items.push({ text: match[3]!, children: [] }); i++; }
        else if (match && items.length) { items.at(-1)!.children.push(match[3]!); i++; }
        else if (lines[i]!.trim() && /^\s{2,}/.test(lines[i]!) && items.length) { items.at(-1)!.text += ` ${lines[i]!.trim()}`; i++; }
        else break;
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }
    // A paragraph takes this line whatever it starts with (a table row whose separator has not streamed in yet), then the
    // lines after it until another block starts, so every pass consumes at least one line.
    const paragraph: string[] = [lines[i++]!.trim()];
    while (i < lines.length && lines[i]!.trim() && !LIST.test(lines[i]!) && !/^(#{1,6}\s|>|\s*```|\s*\|)/.test(lines[i]!)) paragraph.push(lines[i++]!.trim());
    blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  }
  return blocks;
}

