// Mention: an inline reference to a person, a file, a page or a date, in text, in a sent message and (as its words) in
// the Composer's draft. Spec: docs/specs/mention.md (components audit N3, 2026-11-07).
//
// The Composer is a native textarea, so a draft can't hold a component: a pick from the Composer menu's @ list writes the
// mention's words ("@David Tee") into the draft and the app keeps what was picked; `withMentions` turns those words back
// into Mentions when the message is shown.
import { Fragment, createElement, forwardRef } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, MouseEvent, ReactNode } from "react";
import { mentionVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

type MentionVariants = VariantProps<typeof MANIFESTS.mention>;
export type MentionKind = NonNullable<MentionVariants["kind"]>;

/* The kind's mark (docs/specs/mention.md, Decisions): a person, a file's page, a link to a page, a calendar. */
const KIND_GLYPH = { person: "person", file: "document", page: "link", date: "calendar" } as const;

export interface MentionProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** What it refers to: a person (default), a file, a page or a date. Sets the default mark. */
  kind?: MentionKind;
  /** plain (the mark and the words), underline (always underlined, as a link in prose) or soft (a pill on the
   *  translucent mark plate; the default). */
  variant?: MentionVariants["variant"];
  /** The words: the person's name, the file's or the page's name, the date as it reads ("Tomorrow"). */
  children: ReactNode;
  /** Replaces the kind's mark: a file's type icon, a page's own icon, a person's picture (`<img>`, drawn round). `null`
   *  for none. */
  icon?: ReactNode;
  /** A date that has come or passed: the danger ink, and `dueLabel` after the words for assistive tech. */
  due?: boolean;
  /** Said after a due date's words ("Due"). */
  dueLabel?: string;
  /** A date's machine-readable value (`<time dateTime>`), for `kind="date"`. */
  dateTime?: string;
  /** Makes it a link to where the reference lives. */
  href?: string;
  /** Link attributes for an `href` mention. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  /** The link's `rel`, for an `href` mention. */
  rel?: string;
  /** Makes it a button (a person's card, a date's picker) when there is no `href`. */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** For a button mention. */
  disabled?: boolean;
}

/** An inline reference to a person, a file, a page or a date: a span, a link with `href`, a button with `onClick`. */
export const Mention = /* @__PURE__ */ forwardRef<HTMLElement, MentionProps>(function Mention(
  { kind = "person", variant, children, icon, due, dueLabel = "Due", dateTime, href, target, rel, onClick, disabled, className, ...rest }, ref,
) {
  const mark = icon === undefined ? <Glyph name={KIND_GLYPH[kind]} size={12} /> : icon;
  const words = kind === "date" && dateTime ? <time dateTime={dateTime}>{children}</time> : children;
  const content = <>
    {mark != null && mark !== false ? <span className={mentionVariants.element("icon")} aria-hidden="true">{mark}</span> : null}
    <span className={mentionVariants.element("label")}>{words}</span>
    {due ? <span className="area-sr-only">{`, ${dueLabel}`}</span> : null}
  </>;
  const common = { ...rest, ref, className: mentionVariants({ variant, kind }, className), "data-due": due ? "" : undefined };
  if (href !== undefined) {
    return createElement("a", { ...(common as AnchorHTMLAttributes<HTMLAnchorElement>), href, target, rel: rel ?? (target === "_blank" ? "noopener noreferrer" : undefined), onClick }, content);
  }
  if (onClick) {
    return createElement("button", { ...(common as ButtonHTMLAttributes<HTMLButtonElement>), type: "button", onClick, disabled }, content);
  }
  return createElement("span", common, content);
});

/** A mention as `withMentions` finds it in text: its words without the @, and the Mention's props. */
export interface MentionToken extends Omit<MentionProps, "children"> {
  label: string;
}

/**
 * Text with its mentions drawn: every "@label" of a picked mention becomes a Mention (the longest label first, so
 * "@Design team lead" wins over "@Design team"); the rest stays text. For a sent message whose draft held the words.
 */
export function withMentions(text: string, mentions: readonly MentionToken[], props?: Omit<MentionProps, "children" | "kind">): ReactNode[] {
  const tokens = [...mentions].filter(mention => mention.label).sort((a, b) => b.label.length - a.label.length);
  if (!tokens.length) return [text];
  const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`@(${tokens.map(token => escape(token.label)).join("|")})`, "g");
  const parts: ReactNode[] = [];
  let at = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > at) parts.push(text.slice(at, index));
    const { label, ...token } = tokens.find(candidate => candidate.label === match[1])!;
    parts.push(<Mention key={`${index}-${label}`} {...props} {...token}>{label}</Mention>);
    at = index + match[0].length;
  }
  if (at < text.length) parts.push(text.slice(at));
  return parts.map((part, i) => typeof part === "string" ? <Fragment key={`text-${i}`}>{part}</Fragment> : part);
}

export { mentionVariants };
