// Pagination: moves between the pages of a long list. Previous and Next are ghost Buttons; the page
// numbers are options in a set with the current one plated. Spec: docs/specs/pagination.md.
import { forwardRef, useState } from "react";
import type { HTMLAttributes, MouseEvent, ReactNode } from "react";
import { buttonVariants, cx, paginationVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

type PaginationVariants = VariantProps<typeof MANIFESTS.pagination>;
export type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

/**
 * The visible items for a page: the first and last `boundaryCount` pages, `siblingCount` pages
 * each side of the current one, and an ellipsis for each skipped run. A run of one page shows the
 * page instead, so the count stays the same as the current page moves and the row never jumps.
 */
export function paginationRange(page: number, pageCount: number, siblingCount = 1, boundaryCount = 1): PaginationItem[] {
  const range = (from: number, to: number) => Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
  const count = Math.max(0, Math.floor(pageCount));
  const current = Math.min(Math.max(1, page), Math.max(1, count));
  // Boundaries, siblings, the current page and two ellipses: anything that fits shows whole.
  if (count <= boundaryCount * 2 + siblingCount * 2 + 3) return range(1, count);
  const start = range(1, boundaryCount);
  const end = range(count - boundaryCount + 1, count);
  // The sibling window, held clear of the boundaries plus the slot an ellipsis needs.
  const from = Math.max(Math.min(current - siblingCount, count - boundaryCount - siblingCount * 2 - 1), boundaryCount + 2);
  const to = Math.min(Math.max(current + siblingCount, boundaryCount + siblingCount * 2 + 2), count - boundaryCount - 1);
  return [
    ...start,
    from > boundaryCount + 2 ? "ellipsis-start" as const : boundaryCount + 1,
    ...range(from, to),
    to < count - boundaryCount - 1 ? "ellipsis-end" as const : count - boundaryCount,
    ...end,
  ];
}

export interface PaginationLabels {
  /** The navigation landmark's name. Default "Pagination". */
  nav?: string;
  previous?: string;
  next?: string;
  /** A page's accessible name. Default "Page 3". */
  page?: (page: number) => string;
  /** The compact layout's status. Default "Page 2 of 10", the numbers emphasised. */
  status?: (page: ReactNode, pageCount: ReactNode) => ReactNode;
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** How many pages there are. */
  pageCount: number;
  /** The current page, from 1. Controlled. */
  page?: number;
  /** The first page shown when uncontrolled. */
  defaultPage?: number;
  onPageChange?: (page: number, event: MouseEvent<HTMLElement>) => void;
  /** Pages each side of the current one in the `pages` layout. */
  siblingCount?: number;
  /** Pages kept at each end in the `pages` layout. */
  boundaryCount?: number;
  /** Renders every item as a link to this address, so pages open like any other link. */
  getHref?: (page: number) => string;
  /** `pages` lists page numbers; `compact` shows "Page 2 of 10" between the steps. */
  layout?: PaginationVariants["layout"];
  size?: PaginationVariants["size"];
  /** Show "Previous" and "Next" beside their chevrons. The compact layout always shows chevrons only. */
  stepLabels?: boolean;
  labels?: PaginationLabels;
}

const defaultStatus = (page: ReactNode, pageCount: ReactNode) => <>Page {page} of {pageCount}</>;

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { pageCount, page: pageProp, defaultPage = 1, onPageChange, siblingCount = 1, boundaryCount = 1, getHref, layout, size, stepLabels = true, labels, className, "aria-label": ariaLabel, ...rest },
  ref,
) {
  const [localPage, setLocalPage] = useState(defaultPage);
  const count = Math.max(1, Math.floor(pageCount));
  const current = Math.min(Math.max(1, pageProp ?? localPage), count);
  const compact = layout === "compact";
  const pageLabel = labels?.page ?? (n => `Page ${n}`);

  const go = (next: number, event: MouseEvent<HTMLElement>) => {
    if (next < 1 || next > count || next === current) return;
    if (pageProp === undefined) setLocalPage(next);
    onPageChange?.(next, event);
  };

  // A step at its end stays focusable and announced as unavailable (aria-disabled, as a loading
  // Button), so focus is not dropped when Next reaches the last page under the pointer.
  const step = (direction: "previous" | "next") => {
    const target = direction === "previous" ? current - 1 : current + 1;
    const disabled = target < 1 || target > count;
    const label = direction === "previous" ? labels?.previous ?? "Previous" : labels?.next ?? "Next";
    const iconOnly = compact || !stepLabels;
    const glyph = <span className="area-button__icon" aria-hidden="true"><Glyph name="chevron-down" rotate={direction === "previous" ? 90 : 270} /></span>;
    const content = <>
      {direction === "previous" ? glyph : null}
      {iconOnly ? <span className="area-sr-only">{label}</span> : <span className="area-button__label">{label}</span>}
      {direction === "next" ? glyph : null}
    </>;
    const props = {
      className: buttonVariants({ variant: "ghost", size, iconOnly }, paginationVariants.element("step")),
      "aria-disabled": disabled || undefined,
      ...(disabled ? { "data-disabled": "" } : {}),
      onClick: (event: MouseEvent<HTMLElement>) => { if (disabled) { event.preventDefault(); return; } go(target, event); },
    };
    return <li className={paginationVariants.element("item")}>
      {getHref
        ? <a {...props} href={disabled ? undefined : getHref(target)} rel={direction === "previous" ? "prev" : "next"}>{content}</a>
        : <button {...props} type="button">{content}</button>}
    </li>;
  };

  const pageItem = (n: number) => {
    const props = {
      className: paginationVariants.element("page"),
      "aria-label": pageLabel(n),
      "aria-current": n === current ? "page" as const : undefined,
      onClick: (event: MouseEvent<HTMLElement>) => go(n, event),
    };
    return <li key={n} className={paginationVariants.element("item")}>
      {getHref ? <a {...props} href={getHref(n)}>{n}</a> : <button {...props} type="button">{n}</button>}
    </li>;
  };

  return (
    <nav ref={ref} aria-label={ariaLabel ?? labels?.nav ?? "Pagination"} className={paginationVariants({ layout, size }, className)} {...rest}>
      <ul className={paginationVariants.element("list")}>
        {step("previous")}
        {compact
          ? <li className={paginationVariants.element("item")}>
              {/* Announced when it changes, since the steps keep focus while the page moves. */}
              <span className={paginationVariants.element("status")} aria-live="polite">
                {/* One text run: a flex item per word would drop the spaces between them. */}
                <span>{(labels?.status ?? defaultStatus)(<span className={paginationVariants.element("value")}>{current}</span>, <span className={paginationVariants.element("value")}>{count}</span>)}</span>
              </span>
            </li>
          : paginationRange(current, count, siblingCount, boundaryCount).map(item => typeof item === "number"
            ? pageItem(item)
            : <li key={item} className={paginationVariants.element("item")} aria-hidden="true">
                <span className={paginationVariants.element("ellipsis")}><Glyph name="more" /></span>
              </li>)}
        {step("next")}
      </ul>
    </nav>
  );
});
