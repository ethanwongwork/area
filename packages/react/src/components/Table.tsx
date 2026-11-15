import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Children, forwardRef, isValidElement, useLayoutEffect, useRef, useState } from "react";
import type { TdHTMLAttributes, ThHTMLAttributes, AnchorHTMLAttributes, HTMLAttributes, MouseEvent, ReactNode } from "react";
import { cx, tableVariants } from "../variants.ts";
import { Skeleton } from "./Skeleton.tsx";
import type { LoadingDelay } from "./loading-delay.ts";
/* --- Table ---------------------------------------------------------------- */

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Highlights rows on hover. Use only when a row is clickable. */
  interactive?: boolean;
  /** The row height and type size; md by default. */
  size?: VariantProps<typeof MANIFESTS.table>["size"];
  /** `fixed`: the first column takes the label column (27%) whatever its content, so tables in one feed start their
   * values on one line; the other columns still size to their content. `auto` (default) sizes every column to its content. */
  layout?: VariantProps<typeof MANIFESTS.table>["layout"];
  /** Every other body row on a faint fill. */
  striped?: boolean;
  /** A rule between columns. */
  columnDividers?: boolean;
  /** No frame: the table sits on its surface, its rows ruled and its cell inset hanging outside the content edge. */
  flush?: boolean;
  /** Cells in a row line up on their first baseline (rows mixing text sizes). */
  baseline?: boolean;
  /** Props for the scrolling wrapper; `ref` and the rest land on the table. */
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  /**
   * The header row stays at the top while the rows scroll under it. It sticks inside the table's own scroller, so
   * give the wrapper a height (`wrapperProps={{ style: { maxBlockSize } }}`); the header keeps its ground and its
   * rule.
   */
  stickyHeader?: boolean;
  /**
   * The first column stays at the start while the table scrolls sideways. Its cells keep the table's ground and draw
   * a rule at their end only while columns are scrolled under them.
   */
  stickyFirstColumn?: boolean;
  /**
   * Rows are loading: the table is `aria-busy` and its bodies are replaced by `loadingRows` rows of Skeleton cells, one
   * per column of the header (V3). The header and caption stay.
   */
  loading?: boolean;
  /** How many skeleton rows stand in while `loading` (default 3). */
  loadingRows?: number;
  /** The skeleton rows' wait before they show (Skeleton's `delay`: `short` 300 ms, `long` 1000 ms, or milliseconds). */
  delay?: LoadingDelay;
}

/** The order a sortable column is in (`aria-sort`'s words); `none` is sortable but not sorted. */
export type TableSort = "ascending" | "descending" | "none";

/**
 * A row is clickable through one stretched link in it (`.area-table__link`, as CardLink), so
 * the whole row's hover plate keeps its promise (audit F-23 A).
 */
export const TableLink = /* @__PURE__ */ forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function TableLink({ className, ...rest }, ref) {
  return <a ref={ref} className={cx("area-table__link", className)} {...rest} />;
});

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Numbers: aligned to the end in tabular figures, so a column lines up on its digits. */
  numeric?: boolean;
  /** As narrow as its content, never wrapping: a cell of controls, a glyph or a short term beside a long value. */
  fit?: boolean;
}

/** A data cell with Table's two cell options (`area-table__cell--numeric`, `--fit`), so callers need not write the classes. */
export const TableCell = /* @__PURE__ */ forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell({ numeric, fit, className, ...rest }, ref) {
  return <td ref={ref} className={cx(numeric && "area-table__cell--numeric", fit && "area-table__cell--fit", className) || undefined} {...rest} />;
});

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Aligned to the end, as its column's numeric cells. */
  numeric?: boolean;
  /** As narrow as its content, as its column's fit cells. */
  fit?: boolean;
  /**
   * Makes the column sortable: the heading holds a sort button and, while sorted, `aria-sort`. `none` is sortable but
   * not sorted. Table sorts nothing itself: sort the rows in `onSortChange`.
   */
  sort?: TableSort;
  /** The order the sort button asks for (unsorted or descending → ascending, ascending → descending), and its click. */
  onSortChange?: (sort: Exclude<TableSort, "none">, event: MouseEvent<HTMLButtonElement>) => void;
}

/** A column heading (`scope="col"` by default), taking its column's `numeric` and `fit` so the heading aligns with its cells. */
export const TableHeaderCell = /* @__PURE__ */ forwardRef<HTMLTableCellElement, TableHeaderCellProps>(function TableHeaderCell({ numeric, fit, sort, onSortChange, scope = "col", className, children, ...rest }, ref) {
  const classes = cx(numeric && "area-table__cell--numeric", fit && "area-table__cell--fit", className) || undefined;
  if (sort === undefined) return <th ref={ref} scope={scope} className={classes} {...rest}>{children}</th>;
  // aria-sort only on the sorted column (APG sortable table); the button's name is the heading, its state the th's.
  return <th ref={ref} scope={scope} className={classes} aria-sort={sort === "none" ? undefined : sort} {...rest}>
    <Button type="button" size="sm" variant="ghost" align={numeric ? "end" : "start"} className="area-table__sort" data-sort={sort}
      trailingIcon={<Glyph name="arrow-up" rotate={sort === "descending" ? 180 : undefined} />}
      onClick={event => onSortChange?.(sort === "ascending" ? "descending" : "ascending", event)}>{children}</Button>
  </th>;
});

export interface TableGroupProps extends HTMLAttributes<HTMLTableSectionElement> {
  /** The group's name, in its heading row. */
  heading: ReactNode;
  /** How many rows the group holds, after its name (a count, not a total). */
  count?: number;
  /** The group's total or aggregate at the heading row's end ("Total 37.5%"). */
  summary?: ReactNode;
  /** The columns the heading row spans: the table's column count. */
  colSpan: number;
  /** The rows show (controlled); `defaultExpanded` (true) sets it at first; `onExpandedChange` hears the toggle. */
  expanded?: boolean;
  /** Whether the rows show at first, uncontrolled; shown by default. */
  defaultExpanded?: boolean;
  /** Called when the group's heading folds or opens its rows. */
  onExpandedChange?: (expanded: boolean, event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Rows under one heading row that folds them (components audit V3): a `tbody` whose first row is a `rowgroup` heading
 * holding a toggle button (`aria-expanded`) with the group's name and count, and its summary at the row's end.
 */
export const TableGroup = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableGroupProps>(function TableGroup(
  { heading, count, summary, colSpan, expanded: expandedProp, defaultExpanded = true, onExpandedChange, className, children, ...rest },
  ref,
) {
  const [own, setOwn] = useState(defaultExpanded);
  const expanded = expandedProp ?? own;
  return <tbody ref={ref} className={cx("area-table__group", className)} data-collapsed={expanded ? undefined : ""} {...rest}>
    <tr className="area-table__group-heading">
      <th scope="rowgroup" colSpan={colSpan}>
        <span className="area-table__group-row">
          <button type="button" className="area-table__group-toggle" aria-expanded={expanded}
            onClick={event => { if (expandedProp === undefined) setOwn(!expanded); onExpandedChange?.(!expanded, event); }}>
            <span className="area-table__group-chevron" aria-hidden="true"><Glyph name="chevron-down" rotate={expanded ? undefined : 270} /></span>
            <span className="area-table__group-name">{heading}</span>
            {count !== undefined ? <span className="area-table__group-count">{count}</span> : null}
          </button>
          {summary !== undefined && summary !== null ? <span className="area-table__group-summary">{summary}</span> : null}
        </span>
      </th>
    </tr>
    {children}
  </tbody>;
});

export interface TableSkeletonProps extends HTMLAttributes<HTMLTableSectionElement> {
  /** How many rows stand in (default 3). */
  rows?: number;
  /** How many cells each row holds, or the columns themselves (`numeric` ones end-aligned). */
  columns: number | ReadonlyArray<{ numeric?: boolean }>;
  /** Skeleton's wait before it shows. */
  delay?: LoadingDelay;
}

/** Rows of Skeleton cells that hold a table's place while its rows load (Table's `loading` draws one). */
export const TableSkeleton = /* @__PURE__ */ forwardRef<HTMLTableSectionElement, TableSkeletonProps>(function TableSkeleton(
  { rows = 3, columns, delay, className, ...rest },
  ref,
) {
  const cells: ReadonlyArray<{ numeric?: boolean }> = typeof columns === "number" ? Array.from({ length: Math.max(1, columns) }, () => ({})) : columns;
  return <tbody ref={ref} aria-hidden="true" className={cx("area-table__skeleton", className)} {...rest}>
    {Array.from({ length: Math.max(1, Math.floor(rows)) }, (_, row) => <tr key={row}>
      {cells.map((cell, column) => <td key={column} className={cell.numeric ? "area-table__cell--numeric" : undefined}>
        {/* The first column's line is a name's width, the rest a value's (the gallery's loading tile). */}
        <Skeleton shape="text" delay={delay} className="area-table__skeleton-line" data-column={column === 0 ? "first" : undefined} />
      </td>)}
    </tr>)}
  </tbody>;
});

/** The columns a table's header row declares, read from its `thead`'s first row (a cell's `colSpan` counts). */
function headerColumns(children: ReactNode): Array<{ numeric?: boolean }> | undefined {
  for (const child of Children.toArray(children)) {
    if (!isValidElement(child) || child.type !== "thead") continue;
    const row = Children.toArray((child.props as { children?: ReactNode }).children).find(isValidElement);
    if (!row) return undefined;
    const columns: Array<{ numeric?: boolean }> = [];
    for (const cell of Children.toArray((row.props as { children?: ReactNode }).children)) {
      if (!isValidElement(cell)) continue;
      const props = cell.props as { colSpan?: number; numeric?: boolean; className?: string };
      const numeric = props.numeric || /(?:^|\s)area-table__cell--numeric(?:\s|$)/.test(props.className ?? "");
      for (let i = 0; i < Math.max(1, props.colSpan ?? 1); i++) columns.push({ numeric });
    }
    return columns.length ? columns : undefined;
  }
  return undefined;
}

export const Table = /* @__PURE__ */ forwardRef<HTMLTableElement, TableProps>(function Table(
  { interactive, size, layout, striped, columnDividers, flush, baseline, stickyHeader, stickyFirstColumn, loading, loadingRows = 3, delay, wrapperProps, className, children, ...rest },
  ref,
) {
  // A wide table scrolls; a keyboard can only scroll what it can focus, so the wrapper becomes a
  // focusable region named after the table while it overflows (axe scrollable-region-focusable).
  const wrapper = useRef<HTMLDivElement | null>(null);
  const [overflows, setOverflows] = useState(false);
  useLayoutEffect(() => {
    const node = wrapper.current;
    if (!node) return;
    // Either way: a wide table scrolls sideways, a sticky header's table in a height scrolls down.
    const measure = () => setOverflows(node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    if (node.firstElementChild) observer.observe(node.firstElementChild);
    return () => observer.disconnect();
  }, []);
  const name = rest["aria-label"];
  const labelledBy = rest["aria-labelledby"];
  return (
    <div {...wrapperProps} ref={wrapper} className={cx("area-table-wrapper", wrapperProps?.className)}
      {...(overflows ? { tabIndex: 0, role: "region", "aria-label": name, "aria-labelledby": name ? undefined : labelledBy } : {})}>
      <table
        ref={ref}
        className={tableVariants({ interactive, size, layout, striped, columnDividers, flush, baseline, stickyHeader, stickyFirstColumn }, className)}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading ? <>
          {Children.toArray(children).filter(child => !isValidElement(child) || (child.type !== "tbody" && child.type !== TableGroup))}
          <TableSkeleton rows={loadingRows} columns={headerColumns(children) ?? 1} delay={delay} />
        </> : children}
      </table>
    </div>
  );
});

