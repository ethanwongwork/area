// Table of contents: a page's sections as Nav's marker rows, with the section being read marked as the page
// scrolls (Wikipedia's contents). docs/specs/table-of-contents.md.
import { Fragment, forwardRef, useEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx, tableOfContentsVariants } from "../variants.ts";
import { Nav, NavGroup, NavItem } from "./Nav.tsx";
import { assignRef } from "./overlay.ts";

export interface TableOfContentsItem {
  /** The heading's id on the page. */
  id: string;
  label: ReactNode;
  children?: TableOfContentsItem[];
}

export interface TableOfContentsProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  items: TableOfContentsItem[];
  /** The visible title, "Contents" by default; `false` for none (the nav keeps an accessible name). */
  title?: ReactNode | false;
  /** A first row that goes back to the top: its label ("(Top)") and the id it links to. */
  top?: { label: ReactNode; id: string };
  /** Shows a section's subsections only while it is the one being read, as Wikipedia. */
  collapse?: boolean;
  /** Space a sticky header covers at the top of the scroller, in px: a heading counts as reached below it. */
  offset?: number;
  /** The id of the section being read (controlled). Otherwise it follows the scroll. */
  current?: string;
  onCurrentChange?: (id: string | undefined) => void;
}

const flatten = (items: TableOfContentsItem[]): TableOfContentsItem[] => items.flatMap(item => [item, ...flatten(item.children ?? [])]);
const scrollerOf = (node: Element) => {
  for (let parent = node.parentElement; parent; parent = parent.parentElement) {
    const style = getComputedStyle(parent);
    if (/(auto|scroll|overlay)/.test(style.overflowY) && parent.scrollHeight > parent.clientHeight) return parent;
  }
  return document.scrollingElement ?? document.documentElement;
};

export const TableOfContents = /* @__PURE__ */ forwardRef<HTMLElement, TableOfContentsProps>(function TableOfContents(
  { items, title = "Contents", top, collapse, offset = 0, current: currentProp, onCurrentChange, className, "aria-label": ariaLabel, ...rest },
  ref,
) {
  const [local, setLocal] = useState<string | undefined>(top?.id);
  const current = currentProp ?? local;
  const changed = useRef(onCurrentChange);
  changed.current = onCurrentChange;
  const all = useMemo(() => flatten(items), [items]);
  const key = all.map(item => item.id).join(" ");

  // The section being read: the last heading at or above the top of its scroller (below `offset`), or the last
  // one when the scroller is at its end. Measured on scroll, at most once a frame.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const headings = all.map(item => document.getElementById(item.id)).filter((node): node is HTMLElement => !!node);
      if (!headings.length) return;
      const scroller = scrollerOf(headings[0]!);
      const rootTop = scroller === document.scrollingElement || scroller === document.documentElement ? 0 : scroller.getBoundingClientRect().top;
      const line = rootTop + offset + 24;
      let next: string | undefined = top?.id;
      for (const heading of headings) { if (heading.getBoundingClientRect().top <= line) next = heading.id; else break; }
      if (scroller.scrollTop > 0 && Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight - 1) next = headings.at(-1)!.id;
      setLocal(previous => { if (previous !== next) changed.current?.(next); return next; });
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(measure); };
    document.addEventListener("scroll", request, true);
    window.addEventListener("resize", request);
    measure();
    return () => { document.removeEventListener("scroll", request, true); window.removeEventListener("resize", request); cancelAnimationFrame(frame); };
  }, [key, offset, top?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const contains = (item: TableOfContentsItem): boolean => item.id === current || (item.children ?? []).some(contains);
  const rows = (list: TableOfContentsItem[]): ReactNode => list.map(item => (
    <Fragment key={item.id}>
      <NavItem href={`#${item.id}`} aria-current={item.id === current ? "location" : undefined} onClick={() => { if (currentProp === undefined) setLocal(item.id); onCurrentChange?.(item.id); }}>
        {item.label}
      </NavItem>
      {item.children?.length && (!collapse || contains(item)) ? <NavGroup nested>{rows(item.children)}</NavGroup> : null}
    </Fragment>
  ));

  return (
    <Nav ref={node => assignRef(ref, node)} selection="marker" className={cx(tableOfContentsVariants(), className)}
      aria-label={ariaLabel ?? (typeof title === "string" ? title : "Contents")} {...rest}>
      {title !== false ? <div className={tableOfContentsVariants.element("title")} aria-hidden="true">{title}</div> : null}
      {top ? <NavItem href={`#${top.id}`} aria-current={current === top.id ? "location" : undefined} onClick={() => { if (currentProp === undefined) setLocal(top.id); onCurrentChange?.(top.id); }}>{top.label}</NavItem> : null}
      {rows(items)}
    </Nav>
  );
});

export { tableOfContentsVariants };
