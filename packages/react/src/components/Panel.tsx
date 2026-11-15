import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { ScrollArea } from "./ScrollArea.tsx";
import { forwardRef, useId, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode, Ref } from "react";
import { cx, panelVariants } from "../variants.ts";
import type { Div } from "./shared.ts";
/* --- Panel ---------------------------------------------------------------- */

/*
 * Composed rather than configured. A panel takes a title and an optional footer because
 * those are structural, and everything between them is children -- `Panel.Section` and
 * horizontal Field rows. A props API for the rows would have to grow a case for every
 * control the system has, which is the API the CSS deliberately does not have either.
 */
/** Fixed 240px inspector by default; override --area-panel-inline-size to customize. */
export interface PanelProps extends Omit<Div, "title"> {
  /** The bar's row height and the panel's inset: `md` (default) or `sm`. */
  size?: VariantProps<typeof MANIFESTS.panel>["size"];
  /** The bar's heading. It replaces the native `title` attribute: a panel's title is content, not a tooltip. */
  title?: ReactNode;
  /** The title's heading level; Panel section headings default one below it. */
  titleLevel?: 2 | 3 | 4 | 5 | 6;
  /** Sits beside the title, at the end of the bar: a close, a reset, a toggle. */
  action?: ReactNode;
  /** Pinned below the body, outside its scroll. */
  footer?: ReactNode;
  /** Docked to an edge: no radius, no elevation, one seam instead of four. */
  flush?: boolean;
  /** The bar names the panel rather than heading it, so it carries no rule under it. */
  bareBar?: boolean;
  /** The bar is on a window's top line, one of an app's region headers: the small control 7 from its top and bottom. */
  windowBar?: boolean;
  /** The footer continues the body (a chat's composer), so it carries no rule above it. */
  bareFooter?: boolean;
  /** The body's scrolling element (Scroll area's viewport): for following a conversation to its end. */
  viewportRef?: Ref<HTMLDivElement>;
  /**
   * Every Panel row keeps a trailing action square, so controls line up down the panel even where a row has no
   * action. Otherwise rows fill the width.
   */
  actionColumn?: boolean;
  /**
   * Puts a resize separator on one edge: "start" for a panel docked at the end of the page (an
   * inspector on the right), "end" for one at the start (a sidebar). Drag it, or focus it and use
   * the arrow keys (Shift for larger steps), Home and End.
   */
  resizable?: "start" | "end";
  /** Controlled width in px. */
  width?: number;
  /** Initial width in px, and what a double-click on the edge puts back; without it the panel starts at its CSS width. */
  defaultWidth?: number;
  /** With `resizable`, called with the new width in px as the edge is dragged or stepped. */
  onWidthChange?: (width: number) => void;
  /** The narrowest the panel can be resized to, in px. */
  minWidth?: number;
  /** The widest the panel can be resized to, in px. */
  maxWidth?: number;
}

/* spec (docs/specs/resizable-panel.md): keyboard steps on the spacing grid. */
const RESIZE_STEP = 8, RESIZE_STEP_LARGE = 32;

export const Panel = /* @__PURE__ */ forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { size, title, titleLevel = 2, action, footer, flush, bareBar, bareFooter, windowBar, viewportRef, actionColumn, resizable, width, defaultWidth, onWidthChange, minWidth = 240, maxWidth = 500,
    className, children, style, id, "aria-label": ariaLabel, ...rest },
  ref,
) {
  const TitleH = `h${titleLevel}` as "h2";
  const generatedId = useId();
  const panelId = id ?? `${generatedId}-panel`;
  const titleId = `${generatedId}-title`;
  // A named panel is a region: its title names it unless an aria-label is given.
  const labelledByTitle = !ariaLabel && title != null && title !== false;
  const root = useRef<HTMLDivElement | null>(null);
  const [ownWidth, setOwnWidth] = useState<number | null>(defaultWidth ?? null);
  const current = width ?? ownWidth;
  const drag = useRef<{ x: number; width: number; flip: boolean } | null>(null);
  const [resizing, setResizing] = useState(false);
  // Without a starting width the separator still needs a value: read the rendered one.
  useLayoutEffect(() => {
    if (resizable && current == null && root.current) setOwnWidth(Math.round(root.current.getBoundingClientRect().width));
  }, [resizable, current]);
  const clamp = (next: number) => Math.round(Math.min(maxWidth, Math.max(minWidth, next)));
  const commit = (next: number) => {
    const bounded = clamp(next);
    if (width === undefined) setOwnWidth(bounded);
    onWidthChange?.(bounded);
  };
  // The start edge is on the left in LTR; moving that edge left widens the panel.
  const grows = () => {
    const rtl = root.current ? getComputedStyle(root.current).direction === "rtl" : false;
    return (resizable === "start") !== rtl ? -1 : 1;
  };
  const limit = current == null ? undefined : current <= minWidth ? "min" : current >= maxWidth ? "max" : undefined;
  const name = typeof ariaLabel === "string" ? ariaLabel : typeof title === "string" ? title : "panel";
  const handle = resizable ? <div role="separator" tabIndex={0} className="area-panel__resize" data-edge={resizable} data-limit={limit}
    data-resizing={resizing ? "" : undefined}
    // A double-click puts the starting width back (Splitter's reset; components audit N6, 2026-11-07).
    onDoubleClick={defaultWidth == null ? undefined : () => commit(defaultWidth)}
    aria-orientation="vertical" aria-controls={panelId} aria-label={`Resize ${name}`}
    aria-valuenow={current ?? undefined} aria-valuemin={minWidth} aria-valuemax={maxWidth}
    aria-valuetext={current == null ? undefined : `${current} pixels${limit === "min" ? " (minimum)" : limit === "max" ? " (maximum)" : ""}`}
    onPointerDown={event => {
      if (event.button !== 0 || current == null) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current = { x: event.clientX, width: current, flip: grows() < 0 };
      setResizing(true);
    }}
    onPointerMove={event => {
      const state = drag.current;
      if (!state) return;
      const dx = event.clientX - state.x;
      commit(state.width + (state.flip ? -dx : dx));
    }}
    onPointerUp={() => { drag.current = null; setResizing(false); }}
    onPointerCancel={() => { const state = drag.current; drag.current = null; setResizing(false); if (state) commit(state.width); }}
    onKeyDown={event => {
      if (event.key === "Escape" && drag.current) {
        event.preventDefault(); const state = drag.current; drag.current = null; setResizing(false); commit(state.width); return;
      }
      if (current == null) return;
      const step = event.shiftKey ? RESIZE_STEP_LARGE : RESIZE_STEP;
      const direction = grows();
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const physical = event.key === "ArrowLeft" ? -1 : 1;
        commit(current + physical * step * direction);
      } else if (event.key === "Home") { event.preventDefault(); commit(minWidth); }
      else if (event.key === "End") { event.preventDefault(); commit(maxWidth); }
    }} /> : null;
  return (
    <div ref={node => { root.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }}
      id={resizable ? panelId : id} role={ariaLabel || labelledByTitle ? "region" : undefined} aria-label={ariaLabel}
      aria-labelledby={labelledByTitle ? titleId : undefined} className={panelVariants({ size, flush, bareBar, bareFooter, actionColumn, windowBar }, className)}
      data-resizable={resizable ? "" : undefined} data-resizing={resizing ? "" : undefined}
      style={current != null && resizable ? { ...style, "--area-panel-inline-size": `${current}px` } as CSSProperties : style} {...rest}>
      {handle}
      {title || action ? (
        <header className="area-panel__bar">
          {/* No empty heading when the bar holds only an action (an inspector's view tabs). */}
          {title != null && title !== false ? <TitleH className="area-panel__title" id={labelledByTitle ? titleId : undefined}>{title}</TitleH> : null}
          {action}
        </header>
      ) : null}
      <ScrollArea className="area-panel__body" viewportRef={viewportRef} viewportProps={{ tabIndex: undefined }}>{children}</ScrollArea>
      {footer ? <footer className="area-panel__footer">{footer}</footer> : null}
    </div>
  );
});

export interface PanelSectionProps extends Div {
  /** The section's heading; with `collapsible`, the button that folds it. */
  heading?: ReactNode;
  /** Icon buttons at the end of the heading row (add, visibility, a layout toggle). */
  actions?: ReactNode;
  /** The heading becomes a disclosure button that shows or hides the section's rows. */
  collapsible?: boolean;
  /** Controlled open state for a collapsible section. */
  open?: boolean;
  /** Initial open state for an uncontrolled collapsible section. Defaults to open. */
  defaultOpen?: boolean;
  /** Called when the heading shows or hides the section's rows. */
  onOpenChange?: (open: boolean) => void;
  /** Shown in the heading while collapsed, such as the selection's colors as chips and a count. */
  summary?: ReactNode;
  /** How many things the section holds, muted beside its heading ("3", "12 lines"). */
  count?: ReactNode;
  /**
   * The heading's actions show while the section is hovered or holds focus (always on touch); an action that is on
   * (`aria-pressed="true"`) or has its menu open stays.
   */
  revealActions?: boolean;
  /** The heading's level in the page outline. Defaults to 3 (a panel titled by an h2 region). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export const PanelSection = /* @__PURE__ */ forwardRef<HTMLDivElement, PanelSectionProps>(function PanelSection(
  { heading, actions, collapsible, open: openProp, defaultOpen = true, onOpenChange, summary, count, revealActions, headingLevel = 3, className, children, ...rest },
  ref,
) {
  const id = useId();
  const H = `h${headingLevel}` as "h3";
  // The count is part of the heading's text, a space after it (panel.css draws the space, which a flex heading would
  // drop), as a Canvas section's (product UI rule 9).
  const tally = count != null && count !== false ? <span className="area-panel__count">{count}</span> : null;
  const sectionClass = cx("area-panel__section", Boolean(revealActions && actions) && "area-panel__section--reveal", className);
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  if (collapsible && heading) {
    const toggle = () => { const next = !open; if (openProp === undefined) setOpenState(next); onOpenChange?.(next); };
    return (
      <section ref={ref} className={sectionClass} data-collapsed={open ? undefined : ""} {...rest}>
        <div className="area-panel__heading">
          <H className="area-panel__heading-text">
            <button type="button" className="area-panel__toggle" aria-expanded={open} aria-controls={`${id}-rows`} onClick={toggle}>
              <span className="area-panel__chevron" aria-hidden="true"><Glyph name="chevron-down" size={12} /></span>
              <span className="area-panel__toggle-text">{heading}{tally}</span>
              {!open && summary ? <span className="area-panel__summary">{summary}</span> : null}
            </button>
          </H>
          {actions ? <span className="area-panel__actions">{actions}</span> : null}
        </div>
        <div id={`${id}-rows`} className="area-panel__rows" hidden={!open}>{children}</div>
      </section>
    );
  }
  return (
    <section ref={ref} className={sectionClass} {...rest}>
      {heading && actions ? (
        <div className="area-panel__heading">
          <H className="area-panel__heading-text">{heading}{tally}</H>
          <span className="area-panel__actions">{actions}</span>
        </div>
      ) : heading ? <H className="area-panel__heading">{heading}{tally}</H> : null}
      {children}
    </section>
  );
});

export interface PanelRowProps extends Omit<Div, "children"> {
  /** Caption above the controls; pass two to caption each column (Opacity, Corner radius). */
  label?: ReactNode | [ReactNode, ReactNode];
  /** One icon button in the row's trailing square column, shared by every row. */
  action?: ReactNode;
  /** One control spans both columns; two share them equally. */
  children?: ReactNode;
}

/**
 * An inspector row: two equal control columns and a trailing square for an icon button, so
 * every row in a panel lines up (88 + 8 + 88 + 8 + 24 in a 240 panel).
 */
export const PanelRow = /* @__PURE__ */ forwardRef<HTMLDivElement, PanelRowProps>(function PanelRow(
  { label, action, className, children, ...rest },
  ref,
) {
  const id = useId();
  const labels = Array.isArray(label) ? label : label != null && label !== false ? [label] : [];
  return (
    <div ref={ref} role="group" aria-labelledby={labels.length ? labels.map((_, index) => `${id}-label-${index}`).join(" ") : undefined}
      className={cx("area-panel__row", className)} {...rest}>
      {labels.map((text, index) => <span key={index} id={`${id}-label-${index}`} className="area-panel__row-label">{text}</span>)}
      <div className="area-panel__row-controls">{children}</div>
      {action ? <div className="area-panel__row-action">{action}</div> : null}
    </div>
  );
});

/** A row whose control needs the whole width, with its label above rather than beside. */
export const PanelStack = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PanelStack(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("area-panel__stack", className)} {...rest} />;
});

