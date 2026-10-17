// Reference list: numbered notes, each led by links back to where it is cited (Wikipedia's references).
// docs/specs/reference-list.md.
import { forwardRef } from "react";
import type { LiHTMLAttributes, OlHTMLAttributes, ReactNode } from "react";
import { cx, referenceListVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type ReferenceListVariants = VariantProps<typeof MANIFESTS.referenceList>;

export interface ReferenceListProps extends OlHTMLAttributes<HTMLOListElement> {
  /** The links back, as Link's inks: `blue` by default (Wikipedia). */
  ink?: ReferenceListVariants["ink"];
  /** Sets a long list in columns 27em wide, as Wikipedia's reflist. */
  columns?: boolean;
}

/** The list. Each note is a `ReferenceListItem`; a footnote (`Citation variant="footnote"`) links to its `id`. */
export const ReferenceList = /* @__PURE__ */ forwardRef<HTMLOListElement, ReferenceListProps>(function ReferenceList(
  { ink, columns, className, children, ...rest },
  ref,
) {
  return <ol ref={ref} className={referenceListVariants({ ink, columns }, className)} {...rest}>{children}</ol>;
});

export interface ReferenceListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  /** The note's id, which its footnotes link to ("cite-note-13"). */
  id: string;
  /** Where the note is cited: the ids of its footnotes. One shows "↑"; several show "↑ a b c". */
  backlinks?: string[];
  /** The accessible name of a link back, given its letter (or none for a single one). */
  backlinkLabel?: (letter: string | undefined) => string;
  /** Marks the note as the one a footnote just led to, as `:target` does. */
  highlighted?: boolean;
  children?: ReactNode;
}

const letterOf = (index: number) => {
  let n = index, out = "";
  do { out = String.fromCharCode(97 + (n % 26)) + out; n = Math.floor(n / 26) - 1; } while (n >= 0);
  return out;
};

export const ReferenceListItem = /* @__PURE__ */ forwardRef<HTMLLIElement, ReferenceListItemProps>(function ReferenceListItem(
  { id, backlinks = [], backlinkLabel = letter => letter ? `Back to citation ${letter}` : "Back to citation", highlighted, className, children, ...rest },
  ref,
) {
  const link = (target: string, label: string, text: ReactNode) => (
    <a key={target} className={referenceListVariants.element("backlink")} href={`#${target}`} aria-label={label}>{text}</a>
  );
  return (
    <li ref={ref} id={id} className={cx(referenceListVariants.element("item"), className)} data-highlighted={highlighted ? "" : undefined} {...rest}>
      {backlinks.length ? (
        <span className={referenceListVariants.element("backlinks")}>
          {backlinks.length === 1
            ? link(backlinks[0]!, backlinkLabel(undefined), "↑")
            : <><span aria-hidden="true">↑</span>{backlinks.map((target, index) => link(target, backlinkLabel(letterOf(index)), letterOf(index)))}</>}
        </span>
      ) : null}
      <span className={referenceListVariants.element("text")}>{children}</span>
    </li>
  );
});

export { referenceListVariants };
