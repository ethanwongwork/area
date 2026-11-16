// Table of contents: a page's sections as Nav's marker rows, with the section being read marked as the page
// scrolls (a docs "On this page" outline: VitePress, MDN, Primer). docs/specs/table-of-contents.md.
import { Fragment, forwardRef, useEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode, SyntheticEvent } from "react";
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
  /** The sections, each its id, label and nested `children`. */
  items: TableOfContentsItem[];
  /** The visible label, "On this page" by default; `false` for none (the nav keeps an accessible name). */
  title?: ReactNode | false;
  /** A first row that goes back to the top: its label ("Overview") and the id it links to. */
  top?: { label: ReactNode; id: string };
  /** How many levels to show: 2 (sections and their subsections, the default) or 1. */
  levels?: 1 | 2;
  /** Space a sticky header covers at the top of the scroller, in px: a heading counts as reached below it. */
  offset?: number;
  /** The id of the section being read (controlled). Otherwise it follows the scroll. */
  value?: string;
  /** The section marked before the first scroll measure (uncontrolled); `top`'s id by default. */
  defaultValue?: string;
  /** Called when the section being read changes, by scrolling or a click: the section, and the click that chose it
   * (absent when scrolling moved it). */
  onValueChange?: (id: string | undefined, event?: SyntheticEvent) => void;
  /** @deprecated Use `value`. */
  current?: string;
  /** @deprecated Use `onValueChange`. */
  onCurrentChange?: (id: string | undefined) => void;
}

const flatten = (items: TableOfContentsItem[], depth: number): TableOfContentsItem[] =>
  items.flatMap(item => [item, ...(depth > 1 ? flatten(item.children ?? [], depth - 1) : [])]);
const scrollerOf = (node: Element) => {
  for (let parent = node.parentElement; parent; parent = parent.parentElement) {
    const style = getComputedStyle(parent);
    if (/(auto|scroll|overlay)/.test(style.overflowY) && parent.scrollHeight > parent.clientHeight) return parent;
  }
  return document.scrollingElement ?? document.documentElement;
};

export const TableOfContents = /* @__PURE__ */ forwardRef<HTMLElement, TableOfContentsProps>(function TableOfContents(
  { items, title = "On this page", top, levels = 2, offset = 0, value, defaultValue, onValueChange, current: legacyCurrent, onCurrentChange,
    className, "aria-label": ariaLabel, ...rest },
  ref,
) {
  const currentProp = value ?? legacyCurrent;
  const onChange = onValueChange ?? onCurrentChange;
  const [local, setLocal] = useState<string | undefined>(defaultValue ?? top?.id);
  const current = currentProp ?? local;
  const changed = useRef(onChange);
  changed.current = onChange;
  // The last section reported, so a change is announced once, outside the state updater (StrictMode runs updaters twice).
  const reported = useRef(local);
  const all = useMemo(() => flatten(items, levels), [items, levels]);
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
      setLocal(next);
      if (reported.current !== next) { reported.current = next; changed.current?.(next); }
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(measure); };
    document.addEventListener("scroll", request, true);
    window.addEventListener("resize", request);
    measure();
    return () => { document.removeEventListener("scroll", request, true); window.removeEventListener("resize", request); cancelAnimationFrame(frame); };
  }, [key, offset, top?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = (list: TableOfContentsItem[], depth = 1): ReactNode => list.map(item => (
    <Fragment key={item.id}>
      <NavItem href={`#${item.id}`} aria-current={item.id === current ? "location" : undefined} onClick={event => { if (currentProp === undefined) setLocal(item.id); reported.current = item.id; onChange?.(item.id, event); }}>
        {item.label}
      </NavItem>
      {item.children?.length && depth < levels ? <NavGroup nested>{rows(item.children, depth + 1)}</NavGroup> : null}
    </Fragment>
  ));

  return (
    <Nav ref={node => assignRef(ref, node)} selection="marker" className={cx(tableOfContentsVariants(), className)}
      aria-label={ariaLabel ?? (typeof title === "string" ? title : "On this page")} {...rest}>
      {title !== false ? <div className={tableOfContentsVariants.element("title")} aria-hidden="true">{title}</div> : null}
      {top ? <NavItem href={`#${top.id}`} aria-current={current === top.id ? "location" : undefined} onClick={event => { if (currentProp === undefined) setLocal(top.id); reported.current = top.id; onChange?.(top.id, event); }}>{top.label}</NavItem> : null}
      {rows(items)}
    </Nav>
  );
});

export { tableOfContentsVariants };
