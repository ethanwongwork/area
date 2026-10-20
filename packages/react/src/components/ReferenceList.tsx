// Reference list: a text's sources, as ChatGPT lists them under an answer (publisher, linked title, what it covers),
// numbered with the numbers flush with the text above (Substack, Notion); a note can end with a link back. docs/specs/reference-list.md.
import { Fragment, forwardRef, useId } from "react";
import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from "react";
import { cx, referenceListVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { Link } from "./Link.tsx";

type ReferenceListVariants = VariantProps<typeof MANIFESTS.referenceList>;

export interface ReferenceListProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The heading over the list, as ChatGPT's "Sources". Without it, give the list an `aria-label`. */
  title?: ReactNode;
  /** `number` (default; footnotes, `Citation variant="footnote"`, point at the numbers) or `bullet` (ChatGPT's sources). */
  marker?: ReferenceListVariants["marker"];
  /** The first number, for a numbered list that continues. */
  start?: number;
  /** `ReferenceListItem`s. */
  children?: ReactNode;
}

export const ReferenceList = /* @__PURE__ */ forwardRef<HTMLElement, ReferenceListProps>(function ReferenceList(
  { title, marker, start, className, children, "aria-label": ariaLabel, ...rest },
  ref,
) {
  const id = useId();
  const List = (marker ?? "number") === "number" ? "ol" : "ul";
  return (
    <section ref={ref} className={referenceListVariants({ marker }, className)} aria-labelledby={title && !ariaLabel ? `${id}-title` : undefined} aria-label={ariaLabel} {...rest}>
      {title ? <div className={referenceListVariants.element("title")} id={`${id}-title`} role="heading" aria-level={3}>{title}</div> : null}
      <List className={referenceListVariants.element("list")} start={List === "ol" ? start : undefined}
        style={List === "ol" && start != null ? { ["--_start" as string]: start - 1 } : undefined}>{children}</List>
    </section>
  );
});

export interface ReferenceListItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, "title"> {
  /** The note's id, which its footnotes link to ("cite-note-13"). */
  id?: string;
  /** Who published it: "Epson". */
  source?: ReactNode;
  /** The work's title, linked to `href` as an external Link. */
  title?: ReactNode;
  href?: string;
  /** What it covers, after the title. */
  description?: ReactNode;
  /** Where the note is cited: the ids of its footnotes. Each becomes a link back; the second and later show their count. */
  backlinks?: string[];
  /** The accessible name of a link back, given its number (1 for the first). */
  backlinkLabel?: (index: number, total: number) => string;
  /** Marks the note as the one a footnote just led to, as `:target` does. */
  highlighted?: boolean;
  /** Free-form content in place of source, title and description. */
  children?: ReactNode;
}

// A spaced em dash between a source's parts sets off each as a parenthetical aside (ChatGPT's sources; owner, round 37).
const dash = <span className={referenceListVariants.element("dash")}> — </span>;

export const ReferenceListItem = /* @__PURE__ */ forwardRef<HTMLLIElement, ReferenceListItemProps>(function ReferenceListItem(
  { id, source, title, href, description, backlinks = [], backlinkLabel = (index, total) => total > 1 ? `Back to citation ${index}` : "Back to citation", highlighted, className, children, ...rest },
  ref,
) {
  const linked = title ? (href ? <Link href={href} external>{title}</Link> : title) : null;
  const parts = [source, linked, description].filter(part => part != null && part !== false && part !== "");
  return (
    <li ref={ref} id={id} className={cx(referenceListVariants.element("item"), className)} data-target={highlighted ? "" : undefined} {...rest}>
      <div className={referenceListVariants.element("text")}>
      {children ?? parts.map((part, index) => <Fragment key={index}>{index ? dash : null}{part}</Fragment>)}
      {backlinks.length ? (
        <span className={referenceListVariants.element("backlinks")}>
          {backlinks.map((target, index) => (
            <a key={target} className={referenceListVariants.element("backlink")} href={`#${target}`} aria-label={backlinkLabel(index + 1, backlinks.length)}>
              <Glyph name="return" size={12} />
              {index ? <span className={referenceListVariants.element("count")} aria-hidden="true">{index + 1}</span> : null}
            </a>
          ))}
        </span>
      ) : null}
      </div>
    </li>
  );
});

export { referenceListVariants };
