/**
 * The Preview's model (owner, 2026-11-10; docs/research/desktop-app-analysis-2026-11-10, T2): the address a project's
 * app runs at on this Mac, the element the Choose tool read from it (electron/preview.cjs), the styles the Inspector
 * shows and lets a person try, and what Chat is told. Pure: the preview test imports it.
 */

const LOCAL = (host: string) => host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host.endsWith(".localhost");

/** An address as typed ("5173", "localhost:5173", "http://127.0.0.1:3000/shop") as a URL on this Mac, or null: the
 *  same rule as electron/preview.cjs `localUrl`, which is the one that decides what loads. */
export function localAddress(text: unknown): string | null {
  if (typeof text !== "string") return null;
  let value = text.trim();
  if (!value) return null;
  if (/^\d{2,5}$/.test(value)) value = `localhost:${value}`;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) value = `http://${value}`;
  let url: URL;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (!LOCAL(url.hostname) || url.username || url.password) return null;
  return url.href;
}

/** An address as a person reads it: "localhost:5173", with its path when it has one. */
export function addressLabel(address: string): string {
  try { const url = new URL(address); return `${url.host}${url.pathname === "/" ? "" : url.pathname}`; } catch { return address; }
}

/** An element the Choose tool read from the running app. */
export interface ChosenElement {
  tag: string;
  id?: string;
  classes: string[];
  role?: string;
  label?: string;
  text?: string;
  /** A short path to it: ids, classes, its place among its siblings. */
  selector: string;
  /** Its React component and source line, where a development build keeps them. */
  component?: string;
  source?: string;
  rect: { x: number; y: number; width: number; height: number };
  /** Its computed styles, by CSS name. */
  styles: Readonly<Record<string, string>>;
  /** The page it is on: the path and query. */
  page: string;
  /** Its picture, a PNG data URL. */
  picture?: string;
}

const KIND: Readonly<Record<string, string>> = { button: "Button", a: "Link", img: "Image", input: "Field", textarea: "Field", select: "Menu", label: "Label",
  h1: "Heading", h2: "Heading", h3: "Heading", h4: "Heading", h5: "Heading", h6: "Heading", p: "Text", span: "Text", li: "List item", ul: "List", ol: "List",
  nav: "Navigation", header: "Header", footer: "Footer", main: "Main", section: "Section", form: "Form", table: "Table", svg: "Icon", video: "Video", dialog: "Dialog" };
/** What the element is, in a word or two: its component's name, or what its tag is for. */
export const elementKind = (element: Pick<ChosenElement, "tag" | "component" | "role">) =>
  element.component ?? KIND[element.tag] ?? (element.role ? element.role[0]!.toUpperCase() + element.role.slice(1) : "Element");
/** Its name as a heading and a card's row: its kind, with its words when they are few ("Button, Checkout"). */
export function elementName(element: Pick<ChosenElement, "tag" | "component" | "role" | "text" | "label">): string {
  const words = element.label ?? element.text;
  return words && words.length <= 32 ? `${elementKind(element)}, ${words}` : elementKind(element);
}

/** The styles the Inspector lists for a chosen element, in its words, and which a person can try a new value for. */
export const STYLE_ROWS: ReadonlyArray<{ name: string; label: string }> = [
  { name: "background-color", label: "Fill" }, { name: "color", label: "Text color" },
  { name: "font-size", label: "Type size" }, { name: "font-weight", label: "Weight" }, { name: "line-height", label: "Line" },
  { name: "border-radius", label: "Corner" }, { name: "padding", label: "Padding" }, { name: "gap", label: "Gap" },
  { name: "border-width", label: "Stroke" }, { name: "border-color", label: "Stroke color" },
  { name: "box-shadow", label: "Shadow" }, { name: "opacity", label: "Opacity" },
];

const hex = (value: number) => Math.round(value).toString(16).padStart(2, "0");
/** A computed value as a person reads it: an opaque rgb() as hex, the rest as it is. */
export function shownValue(value: string | undefined): string {
  const text = (value ?? "").trim();
  const rgb = /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)(?:[\s,/]+(\d*\.?\d+%?))?\s*\)$/.exec(text);
  if (!rgb) return text;
  const alpha = rgb[4] === undefined ? 1 : rgb[4].endsWith("%") ? Number.parseFloat(rgb[4]) / 100 : Number(rgb[4]);
  if (alpha === 0) return "None";
  return alpha < 1 ? text : `#${hex(Number(rgb[1]))}${hex(Number(rgb[2]))}${hex(Number(rgb[3]))}`.toUpperCase();
}

/** A value a person tried on the chosen element: it shows in the running page only, until Chat makes it in the code. */
export interface Tweak { name: string; label: string; from: string; to: string }
/** The tweaks with one more: a style tried twice keeps its first "from"; back at its first value, it is no tweak. */
export function withTweak(tweaks: readonly Tweak[], next: Tweak): Tweak[] {
  const first = tweaks.find(entry => entry.name === next.name);
  const rest = tweaks.filter(entry => entry.name !== next.name);
  const from = first?.from ?? next.from;
  return from === next.to ? rest : [...rest, { ...next, from }];
}

/** What rides to Chat as the card's rows: each tweak in the Inspector's words, then the note. */
export function previewRows(element: ChosenElement, tweaks: readonly Tweak[], note: string): Array<{ thing: string; change: string }> {
  const name = elementName(element);
  return [
    ...tweaks.map(tweak => ({ thing: name, change: `${tweak.label} ${shownValue(tweak.from)} → ${shownValue(tweak.to)}` })),
    ...(note.trim() ? [{ thing: name, change: note.trim() }] : []),
  ];
}

/** What the agent reads: where the element is, what it is, how it looks now, and what the person wants of it. */
export function previewMessage(address: string, element: ChosenElement, tweaks: readonly Tweak[], note: string): string {
  const tried = new Set(tweaks.map(tweak => tweak.name));
  const facts = [
    `tag <${element.tag}>`, element.component ? `component ${element.component}` : "", element.source ? `source ${element.source}` : "",
    element.id ? `id "${element.id}"` : "", element.classes.length ? `classes "${element.classes.join(" ")}"` : "",
    element.label ? `label "${element.label}"` : "", element.text ? `text "${element.text.slice(0, 120)}"` : "",
  ].filter(Boolean).join(", ");
  return [
    `The person chose an element in the project's running app (${addressLabel(address)}${element.page && element.page !== "/" ? `, page ${element.page}` : ""}): ${facts}.`,
    `Find it by: ${element.selector}. Its box is ${Math.round(element.rect.width)} by ${Math.round(element.rect.height)}. A picture of it is attached.`,
    `As it is drawn now: ${STYLE_ROWS.filter(row => !tried.has(row.name)).map(row => `${row.label.toLowerCase()} ${shownValue(element.styles[row.name])}`).join("; ")}.`,
    tweaks.length ? `They tried these values on it in the running page and want them made in the code (use the project's tokens where one matches, never a literal that a token covers):\n${tweaks.map(tweak => `- ${tweak.label} (${tweak.name}): ${shownValue(tweak.from)} → ${shownValue(tweak.to)}`).join("\n")}` : "",
    note.trim() ? `Their note: ${note.trim()}` : "",
    "Find where this element is written, make the change there, and say what you changed.",
  ].filter(Boolean).join("\n");
}

/** A PNG data URL as a file, for the composer's pictures (a fetch of a data: URL is not allowed by the page's policy). */
export function pictureFile(dataUrl: string, name: string): File | null {
  const match = /^data:(image\/[a-z+.-]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) return null;
  const bytes = Uint8Array.from(atob(match[2]!), char => char.charCodeAt(0));
  return new File([bytes], name, { type: match[1]! });
}
