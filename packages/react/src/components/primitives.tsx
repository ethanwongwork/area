import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Select } from "./forms.tsx";
/**
 * The presentational components.
 *
 * Thin by design: each one places elements and forwards props, and contributes no styling
 * of its own. Every appearance decision lives in `@area/styles`, which is what lets a
 * consumer use the CSS without React and get an identical result.
 */
import { Children, cloneElement, forwardRef, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import {
  alertVariants,
  avatarVariants,
  cx,
  chipVariants,
  panelVariants,
  progressVariants,
  segmentedVariants,
  separatorVariants,
  sliderVariants,
  skeletonVariants,
  spinnerVariants,
  tableVariants,
  tabsVariants,
  toastVariants,
  tooltipVariants,
  createVariants,
  menuVariants,
  popoverVariants,
} from "../variants.ts";

type Div = HTMLAttributes<HTMLDivElement>;
/* --- Avatar --------------------------------------------------------------- */

export interface AvatarProps extends Omit<Div, "children"> {
  size?: VariantProps<typeof MANIFESTS.avatar>["size"];
  shape?: VariantProps<typeof MANIFESTS.avatar>["shape"];
  tone?: VariantProps<typeof MANIFESTS.avatar>["tone"];
  /** Draws the current-person or active-participant ring around the Avatar. */
  active?: boolean;
  src?: string;
  /** Describes the person or entity. Required when `src` is set. */
  alt?: string;
  /** Shown when there is no image. Usually one or two initials. */
  fallback?: ReactNode;
  /** A generic fallback visual, used instead of initials when no image is available. */
  icon?: ReactNode;
}

export const Avatar = /* @__PURE__ */ forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { size, shape, tone, active, src, alt, fallback, icon, className, role, "aria-label": ariaLabel, ...rest },
  ref,
) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => setImageFailed(false), [src]);
  useEffect(() => {
    const image = imageRef.current;
    // A cached failure can finish before hydration attaches `onError`. Check the native
    // image state once mounted so server-rendered avatars still reach their fallback.
    if (src && image?.complete && image.naturalWidth === 0) setImageFailed(true);
  }, [src]);

  const hasImage = Boolean(src) && !imageFailed;
  const wrapperLabel = hasImage ? ariaLabel : (ariaLabel ?? alt);
  const wrapperRole = role ?? (wrapperLabel ? "img" : undefined);

  return (
    <div
      ref={ref}
      className={avatarVariants({ size, shape, tone, active }, className)}
      role={wrapperRole}
      aria-label={wrapperLabel}
      {...rest}
    >
      {hasImage ? (
        <img
          ref={imageRef}
          className="area-avatar__image"
          src={src}
          alt={wrapperLabel ? "" : (alt ?? "")}
          onError={() => setImageFailed(true)}
        />
      ) : icon ? (
        <span className="area-avatar__icon" aria-hidden="true">{icon}</span>
      ) : (
        <span aria-hidden="true">{fallback}</span>
      )}
    </div>
  );
});

export interface AvatarGroupProps extends Div {
  /** Limits visible avatars; the remaining count is rendered as an Avatar. */
  max?: number;
  /** Size used by the generated overflow Avatar. */
  size?: AvatarProps["size"];
  overflowLabel?: (count: number) => string;
}

export const AvatarGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max, size = "md", overflowLabel = count => `${count} more avatars`, className, children, role = "group", ...rest },
  ref,
) {
  if (max !== undefined && (!Number.isFinite(max) || max < 0)) {
    throw new RangeError("AvatarGroup: max must be a nonnegative finite number.");
  }
  const items = Children.toArray(children);
  const visibleCount = max === undefined ? items.length : Math.min(items.length, Math.floor(max));
  const remaining = items.length - visibleCount;
  return (
    <div {...rest} ref={ref} role={role} className={cx("area-avatar-group", className)}>
      {items.slice(0, visibleCount).map((item, index) => <span className="area-avatar-group__item" key={index}>{item}</span>)}
      {remaining > 0 ? <Avatar className="area-avatar-group__overflow" size={size} fallback={`+${remaining}`} alt={overflowLabel(remaining)} /> : null}
    </div>
  );
});

/* --- Alert ---------------------------------------------------------------- */

export interface AlertProps extends Omit<Div, "title"> {
  tone?: VariantProps<typeof MANIFESTS.alert>["tone"];
  /** Omit for automatic layout: compact by default, multiline for multiple actions. */
  layout?: VariantProps<typeof MANIFESTS.alert>["layout"];
  icon?: ReactNode;
  /** Shadows the native `title` attribute deliberately: an Alert's title is content. */
  title?: ReactNode;
  /** An optional action associated with this message. */
  action?: ReactNode;
  /** An optional inline text link following the message. */
  link?: ReactNode;
  /** Adds a separate dismiss button. The parent owns whether the alert remains rendered. */
  onDismiss?: () => void;
  /** Replaces the standard dismiss icon. */
  dismissIcon?: ReactNode;
  /** Accessible name for the dismiss button. */
  dismissLabel?: string;
}

export const Alert = /* @__PURE__ */ forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone, layout, icon, title, action, link, onDismiss, dismissIcon, dismissLabel = "Dismiss alert", className, children, ...rest },
  ref,
) {
  const resolvedLayout = layout ?? "single-line";
  return (
    <div
      ref={ref}
      // `alert` interrupts a screen reader; `status` waits for a pause. Only danger earns
      // the interruption.
      role={tone === "danger" ? "alert" : "status"}
      className={alertVariants({ tone, layout: resolvedLayout }, className)}
      {...rest}
    >
      {icon ? (
        <span className="area-alert__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="area-alert__content">
        {title ? <div className="area-alert__title">{title}</div> : null}
        {children || link ? (
          <div className="area-alert__description">
            {children}
            {link ? <span className="area-alert__link">{link}</span> : null}
          </div>
        ) : null}
      </div>
      {action ? <div className="area-alert__actions">{action}</div> : null}
      {onDismiss ? (
        <button type="button" className="area-alert__dismiss" aria-label={dismissLabel} onClick={onDismiss}>
          {dismissIcon ?? <AlertDismissIcon />}
        </button>
      ) : null}
    </div>
  );
});

const AlertDismissIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" focusable="false" aria-hidden="true">
    <path d="m2.59 2.72.06-.07a.5.5 0 0 1 .63-.06l.07.06L8 7.29l4.65-4.64a.5.5 0 0 1 .7.7L8.71 8l4.64 4.65c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L8 8.71l-4.65 4.64a.5.5 0 0 1-.7-.7L7.29 8 2.65 3.35a.5.5 0 0 1-.06-.63l.06-.07z" />
  </svg>
);

/* --- Card ----------------------------------------------------------------- */

export interface CardProps extends Div {
  layout?: VariantProps<typeof MANIFESTS.card>["layout"];
}

const cardVariants = createVariants(MANIFESTS.card);
export const Card = /* @__PURE__ */ forwardRef<HTMLDivElement, CardProps>(function Card({ layout, className, ...rest }, ref) {
  return <div ref={ref} className={cardVariants({ layout }, className)} {...rest} />;
});

export const CardContent = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function CardContent({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__content", className)} {...rest} />;
});

export const CardTitle = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function CardTitle({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__title", className)} {...rest} />;
});

export const CardDescription = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function CardDescription(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("area-card__description", className)} {...rest} />;
});

export const CardMedia = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function CardMedia({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__media", className)} {...rest} />;
});

export const CardAction = /* @__PURE__ */ forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function CardAction(
  { className, ...rest },
  ref,
) {
  return <a ref={ref} className={cx("area-card__action", className)} {...rest} />;
});

export const CardFooter = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function CardFooter({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__footer", className)} {...rest} />;
});

/* --- Separator ------------------------------------------------------------ */

export interface SeparatorProps extends Div {
  orientation?: VariantProps<typeof MANIFESTS.separator>["orientation"];
  /** Space reserved around the rule, independent of its one-pixel stroke. */
  spacing?: VariantProps<typeof MANIFESTS.separator>["spacing"];
  /** Aligns the rule endpoints to inset content. */
  inset?: boolean;
}

export const Separator = /* @__PURE__ */ forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", spacing, inset, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={separatorVariants({ orientation, spacing, inset }, className)}
      {...rest}
    />
  );
});

/* --- Skeleton, Spinner, Progress ------------------------------------------ */

export interface SkeletonProps extends Div {
  shape?: VariantProps<typeof MANIFESTS.skeleton>["shape"];
}

export const Skeleton = /* @__PURE__ */ forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} aria-hidden="true" className={skeletonVariants({ shape }, className)} {...rest} />
  );
});

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: VariantProps<typeof MANIFESTS.spinner>["size"];
  tone?: VariantProps<typeof MANIFESTS.spinner>["tone"];
  /** Announced to assistive tech. Omit when a nearby element already says it. */
  label?: string;
}

export const Spinner = /* @__PURE__ */ forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, tone, label, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      className={spinnerVariants({ size, tone }, className)}
      {...rest}
    />
  );
});

export interface ProgressProps extends Omit<Div, "children"> {
  /** 0 to `max`. Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  label?: string;
  size?: VariantProps<typeof MANIFESTS.progress>["size"];
  tone?: VariantProps<typeof MANIFESTS.progress>["tone"];
}

export const Progress = /* @__PURE__ */ forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, label, size, tone, className, ...rest },
  ref,
) {
  const indeterminate = value == null;
  const pct = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      aria-label={label}
      className={progressVariants({ size, tone }, className)}
      {...(indeterminate ? { "data-indeterminate": "" } : {})}
      {...rest}
    >
      <div className="area-progress__bar" style={indeterminate ? undefined : { inlineSize: `${pct}%` }} />
    </div>
  );
});

/* --- Panel ---------------------------------------------------------------- */

/*
 * Composed rather than configured. A panel takes a title and an optional footer because
 * those are structural, and everything between them is children -- `Panel.Section` and
 * horizontal Field rows. A props API for the rows would have to grow a case for every
 * control the system has, which is the API the CSS deliberately does not have either.
 */
/** Fixed 280px inspector by default; override --area-panel-inline-size to customize. */
export interface PanelProps extends Omit<Div, "title"> {
  size?: VariantProps<typeof MANIFESTS.panel>["size"];
  /** Shadows the DOM `title` attribute deliberately: a panel's title is content, not a tooltip. */
  title?: ReactNode;
  /** Sits beside the title, at the end of the bar: a close, a reset, a toggle. */
  action?: ReactNode;
  /** Pinned below the body, outside its scroll. */
  footer?: ReactNode;
  /** Docked to an edge: no radius, no elevation, one seam instead of four. */
  flush?: boolean;
  /** The bar names the panel rather than heading it, so it carries no rule under it. */
  bareBar?: boolean;
  /**
   * Puts a resize separator on one edge: "start" for a panel docked at the end of the page (an
   * inspector on the right), "end" for one at the start (a sidebar). Drag it, or focus it and use
   * the arrow keys (Shift for larger steps), Home and End.
   */
  resizable?: "start" | "end";
  /** Controlled width in px. */
  width?: number;
  /** Initial width in px; without it the panel starts at its CSS width. */
  defaultWidth?: number;
  onWidthChange?: (width: number) => void;
  /** Resize limits in px (Figma's design panel: 241 to 500). */
  minWidth?: number;
  maxWidth?: number;
}

/* spec (docs/specs/resizable-panel.md): keyboard steps on the spacing grid. */
const RESIZE_STEP = 8, RESIZE_STEP_LARGE = 32;

export const Panel = /* @__PURE__ */ forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { size, title, action, footer, flush, bareBar, resizable, width, defaultWidth, onWidthChange, minWidth = 240, maxWidth = 500,
    className, children, style, id, "aria-label": ariaLabel, ...rest },
  ref,
) {
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
      aria-labelledby={labelledByTitle ? titleId : undefined} className={panelVariants({ size, flush, bareBar }, className)}
      data-resizable={resizable ? "" : undefined} data-resizing={resizing ? "" : undefined}
      style={current != null && resizable ? { ...style, "--area-panel-inline-size": `${current}px` } as CSSProperties : style} {...rest}>
      {handle}
      {title || action ? (
        <header className="area-panel__bar">
          <span className="area-panel__title" id={labelledByTitle ? titleId : undefined}>{title}</span>
          {action}
        </header>
      ) : null}
      <div className="area-panel__body">{children}</div>
      {footer ? <footer className="area-panel__footer">{footer}</footer> : null}
    </div>
  );
});

export interface PanelSectionProps extends Div {
  heading?: ReactNode;
  /** Icon buttons at the end of the heading row (Figma: auto layout, visibility, add). */
  actions?: ReactNode;
  /** The heading becomes a disclosure button that shows or hides the section's rows. */
  collapsible?: boolean;
  /** Controlled open state for a collapsible section. */
  open?: boolean;
  /** Initial open state for an uncontrolled collapsible section. Defaults to open. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Shown in the heading while collapsed (Figma: selection colors as chips and a count). */
  summary?: ReactNode;
  /** The heading's level in the page outline. Defaults to 3 (a panel titled by an h2 region). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export const PanelSection = /* @__PURE__ */ forwardRef<HTMLDivElement, PanelSectionProps>(function PanelSection(
  { heading, actions, collapsible, open: openProp, defaultOpen = true, onOpenChange, summary, headingLevel = 3, className, children, ...rest },
  ref,
) {
  const id = useId();
  const H = `h${headingLevel}` as "h3";
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  if (collapsible && heading) {
    const toggle = () => { const next = !open; if (openProp === undefined) setOpenState(next); onOpenChange?.(next); };
    return (
      <section ref={ref} className={cx("area-panel__section", className)} data-collapsed={open ? undefined : ""} {...rest}>
        <div className="area-panel__heading">
          <H className="area-panel__heading-text">
            <button type="button" className="area-panel__toggle" aria-expanded={open} aria-controls={`${id}-rows`} onClick={toggle}>
              <span className="area-panel__chevron" aria-hidden="true"><Glyph name="chevron-down" rotate={open ? undefined : 270} /></span>
              <span className="area-panel__toggle-text">{heading}</span>
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
    <section ref={ref} className={cx("area-panel__section", className)} {...rest}>
      {heading && actions ? (
        <div className="area-panel__heading">
          <H className="area-panel__heading-text">{heading}</H>
          <span className="area-panel__actions">{actions}</span>
        </div>
      ) : heading ? <H className="area-panel__heading">{heading}</H> : null}
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
 * every row in a panel lines up (Figma: 88 + 8 + 88 + 8 + 24 in its 240 panel).
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

/* --- Slider --------------------------------------------------------------- */

/*
 * The fill is a percentage the component computes from min/max/value and hands to the CSS
 * as `--_pct`. Controlled or not, it is derived from the same numbers the input already
 * carries, so the paint cannot disagree with the value -- and because it is a ratio rather
 * than a length it survives a density change without recomputing.
 */
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  tone?: VariantProps<typeof MANIFESTS.slider>["tone"];
  size?: VariantProps<typeof MANIFESTS.slider>["size"];
  /** Visible label for the range. */
  label?: ReactNode;
  /** Places the label and readout above opposite ends of the track. */
  labelPosition?: "inline" | "top";
  /** Changes the visual axis while retaining native range keyboard semantics. */
  orientation?: "horizontal" | "vertical";
  /** Draws a marker at each interior step of a discrete track. */
  stepMarks?: boolean;
  /**
   * Rendered after the track. `true` shows the normalized numeric value; a function can
   * format that live value. A React node remains supported for fully custom content.
   */
  readout?: boolean | ReactNode | ((value: number) => ReactNode);
  /** Called with the normalized native value for every input event. */
  onValueChange?: (value: number) => void;
  disabled?: boolean;
}

function finiteNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

/** Mirrors the native range defaults closely enough for correct server-rendered paint. */
function normalizeSliderValue(
  value: unknown,
  min: string | number,
  max: string | number,
  step: string | number | undefined,
) {
  const lower = finiteNumber(min, 0);
  const upper = Math.max(lower, finiteNumber(max, 100));
  const fallback = lower + (upper - lower) / 2;
  const requested = Math.min(upper, Math.max(lower, finiteNumber(value, fallback)));
  if (step === "any") return requested;

  const interval = finiteNumber(step, 1);
  if (interval <= 0) return requested;
  const stepped = lower + Math.round((requested - lower) / interval) * interval;
  // Floating-point multiplication can otherwise leak values such as 0.30000000000000004
  // into the readout and percentage custom property.
  const precision = Math.max(
    String(lower).split(".")[1]?.length ?? 0,
    String(interval).split(".")[1]?.length ?? 0,
  );
  return Math.min(upper, Math.max(lower, Number(stepped.toFixed(Math.min(precision, 12)))));
}

export const Slider = /* @__PURE__ */ forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    tone,
    size,
    label,
    labelPosition = "inline",
    orientation = "horizontal",
    stepMarks,
    readout,
    onValueChange,
    onInput,
    className,
    disabled,
    min = 0,
    max = 100,
    step,
    value,
    defaultValue,
    style,
    ...rest
  },
  ref,
) {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current!, []);
  const initialValue = normalizeSliderValue(defaultValue, min, max, step);
  const [localValue, setLocalValue] = useState(initialValue);
  const current = value === undefined
    ? localValue
    : normalizeSliderValue(value, min, max, step);
  const lower = finiteNumber(min, 0);
  const upper = Math.max(lower, finiteNumber(max, 100));
  const pct = upper > lower ? ((current - lower) / (upper - lower)) * 100 : 0;
  const interval = step === "any" ? 0 : finiteNumber(step, 1);
  const markCount = stepMarks && interval > 0
    ? Math.min(24, Math.max(0, Math.round((upper - lower) / interval) - 1))
    : 0;

  useEffect(() => {
    const form = input.current?.form;
    const reset = (event: Event) => queueMicrotask(() => {
      if (!event.defaultPrevented && value === undefined && input.current) {
        setLocalValue(input.current.valueAsNumber);
      }
    });
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [value, rest.form]);

  useEffect(() => {
    if (value === undefined && input.current && input.current.valueAsNumber !== localValue) {
      setLocalValue(input.current.valueAsNumber);
    }
  }, [defaultValue, localValue, max, min, step, value]);

  const renderedReadout = typeof readout === "function"
    ? readout(current)
    : readout === true
      ? current
      : readout;

  return (
    <label
      className={sliderVariants({
        tone,
        size,
        labelPosition: labelPosition === "top" ? "top" : undefined,
        orientation: orientation === "vertical" ? "vertical" : undefined,
      }, className)}
      style={{ ["--_pct" as string]: `${pct}%`, ...style }}
      {...(disabled ? { "data-disabled": "" } : {})}
    >
      {label ? <span className="area-slider__label">{label}</span> : null}
      {markCount > 0 ? <span className="area-slider__marks" aria-hidden="true">{Array.from({ length: markCount }, (_, index) => <i key={index} style={{ ["--_mark" as string]: `${((index + 1) / (markCount + 1)) * 100}%` }} />)}</span> : null}
      <input
        {...rest}
        ref={input}
        type="range"
        className="area-slider__control"
        min={min}
        max={max}
        step={step}
        value={value === undefined ? undefined : current}
        defaultValue={defaultValue}
        disabled={disabled}
        onInput={event => {
          onInput?.(event);
          const nextValue = event.currentTarget.valueAsNumber;
          if (value === undefined) setLocalValue(nextValue);
          onValueChange?.(nextValue);
        }}
      />
      {readout === false || readout === undefined ? null : (
        <span className="area-slider__value" aria-hidden="true">{renderedReadout}</span>
      )}
    </label>
  );
});

/* --- Chip ----------------------------------------------------------------- */

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Interaction role: assist action, selectable filter, removable input, or suggestion. */
  kind?: VariantProps<typeof MANIFESTS.chip>["kind"];
  size?: VariantProps<typeof MANIFESTS.chip>["size"];
  pill?: boolean;
  /** A colour this chip stands for, shown as a dot before the label. */
  swatch?: string;
  icon?: ReactNode;
  /** Controlled selected state. */
  selected?: boolean;
  /** Initial selected state for an uncontrolled chip. */
  defaultSelected?: boolean;
  /** Called after a user toggles an enabled chip. */
  onSelectedChange?: (selected: boolean) => void;
  /** A person or entity visual, usually an Avatar. */
  avatar?: ReactNode;
  /** A small visual filter thumbnail. `imageAlt` is optional when the label names it. */
  image?: string;
  imageAlt?: string;
  /** Adds an independently focusable remove action using a standard dismiss icon by default. */
  onRemove?: () => void;
  /** Makes the label an action when a removable input chip would otherwise only expose dismiss. */
  clickable?: boolean;
  /** Replaces the standard dismiss icon in the remove action, for example with a trash can. */
  removeIcon?: ReactNode;
  /** Accessible name for the remove action. */
  removeLabel?: string;
  /** Marks an input chip whose value was not recognized. */
  invalid?: boolean;
  /** No label: the swatch is the whole chip, and the box goes square. */
  swatchOnly?: boolean;
}

export const Chip = /* @__PURE__ */ forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { kind = "filter", size, pill, swatch, icon, avatar, image, imageAlt, selected, defaultSelected = false, onSelectedChange, onClick, onRemove, clickable, removeIcon, removeLabel = "Remove chip", invalid, swatchOnly, className, children, disabled, ...rest },
  ref,
) {
  const [localSelected, setLocalSelected] = useState(defaultSelected);
  const currentSelected = selected ?? localSelected;
  const selectable = kind === "filter";
  const primaryInteractive = selectable || clickable || Boolean(onClick);
  const classes = chipVariants({ kind, size, pill, swatchOnly }, className);
  const state = {
    ...(selectable && currentSelected ? { "data-selected": "" } : {}),
    ...(disabled ? { "data-disabled": "" } : {}),
    ...(invalid ? { "data-invalid": "" } : {}),
  };
  const contents = (
    <>
      {swatch ? <span className="area-chip__swatch" style={{ background: swatch }} aria-hidden="true" /> : null}
      {avatar ? <span className="area-chip__avatar">{avatar}</span> : null}
      {image ? <span className="area-chip__image"><img src={image} alt={imageAlt ?? ""} /></span> : null}
      {icon ? <span className="area-chip__icon" aria-hidden="true">{icon}</span> : null}
      {swatchOnly ? null : <span className="area-chip__label">{children}</span>}
    </>
  );
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled || !selectable) return;
    const next = !currentSelected;
    if (selected === undefined) setLocalSelected(next);
    onSelectedChange?.(next);
  };

  if (onRemove) {
    return (
      <span className={classes} {...state}>
        {primaryInteractive ? (
          <button ref={ref} type="button" aria-pressed={selectable ? currentSelected : undefined} disabled={disabled} className="area-chip__action" onClick={handleClick} {...rest}>
            {contents}
          </button>
        ) : <span className="area-chip__action">{contents}</span>}
        <button ref={primaryInteractive ? undefined : ref} type="button" className="area-chip__remove" aria-label={removeLabel} disabled={disabled} onClick={event => { event.stopPropagation(); onRemove(); }}>
          {removeIcon ?? <ChipDismissIcon />}
        </button>
      </span>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selectable ? currentSelected : undefined}
      disabled={disabled}
      className={classes}
      {...state}
      onClick={handleClick}
      {...rest}
    >
      {contents}
    </button>
  );
});

export interface ChipLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  size?: VariantProps<typeof MANIFESTS.chip>["size"];
  pill?: boolean;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Underline is the text-link treatment; icon uses an outgoing-link visual and underlines only on hover/focus. */
  treatment?: "underline" | "icon";
  avatar?: ReactNode;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}

/** A navigational chip. Selection and removal remain the responsibility of `Chip`. */
export const ChipLink = /* @__PURE__ */ forwardRef<HTMLAnchorElement, ChipLinkProps>(function ChipLink(
  { size, pill, icon, trailingIcon, treatment = "underline", avatar, image, imageAlt, className, children, ...rest },
  ref,
) {
  return (
    <a ref={ref} className={chipVariants({ kind: "suggestion", size, pill, link: treatment === "underline", linkIcon: treatment === "icon" }, className)} {...rest}>
      {avatar ? <span className="area-chip__avatar">{avatar}</span> : null}
      {image ? <span className="area-chip__image"><img src={image} alt={imageAlt ?? ""} /></span> : null}
      {icon ? <span className="area-chip__icon" aria-hidden="true">{icon}</span> : null}
      <span className="area-chip__label">{children}</span>
      {treatment === "icon" && trailingIcon ? <span className="area-chip__trailing-icon" aria-hidden="true">{trailingIcon}</span> : null}
    </a>
  );
});

const ChipDismissIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" focusable="false" aria-hidden="true">
    <path d="m2.59 2.72.06-.07a.5.5 0 0 1 .63-.06l.07.06L8 7.29l4.65-4.64a.5.5 0 0 1 .7.7L8.71 8l4.64 4.65c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L8 8.71l-4.65 4.64a.5.5 0 0 1-.7-.7L7.29 8 2.65 3.35a.5.5 0 0 1-.06-.63l.06-.07z" />
  </svg>
);

export type ChipGroupProps = Div;

export const ChipGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, ChipGroupProps>(function ChipGroup(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("area-chip-group", className)} {...rest} />;
});

/* --- Table ---------------------------------------------------------------- */

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Highlights rows on hover. Use only when a row is clickable. */
  interactive?: boolean;
  size?: VariantProps<typeof MANIFESTS.table>["size"];
  striped?: boolean;
  columnDividers?: boolean;
}

export const Table = /* @__PURE__ */ forwardRef<HTMLTableElement, TableProps>(function Table(
  { interactive, size, striped, columnDividers, className, ...rest },
  ref,
) {
  return (
    <div className="area-table-wrapper">
      <table
        ref={ref}
        className={tableVariants({ interactive, size, striped, columnDividers }, className)}
        {...rest}
      />
    </div>
  );
});

/* --- Surfaces ------------------------------------------------------------- */

export interface TooltipProps extends Div {
  /** The side of the trigger that this visible tooltip occupies. */
  side?: VariantProps<typeof MANIFESTS.tooltip>["side"];
  /** Draws a subtly rounded pointer toward the trigger. Omitted by default. */
  arrow?: boolean;
}

export const Tooltip = /* @__PURE__ */ forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { side, arrow, className, ...rest },
  ref,
) {
  return <div ref={ref} role="tooltip" className={tooltipVariants({ side, arrow }, className)} {...rest} />;
});

export interface PopoverProps extends Div {
  side?: VariantProps<typeof MANIFESTS.popover>["side"];
  /** Draw a conventional diamond tip toward the anchored element. */
  arrow?: boolean;
  /**
   * The element that opens the popover, usually a Button. With a trigger, the surface opens
   * in a native popover anchored on `side` of it: Escape and clicks outside close it and focus
   * returns to the trigger. Without one, Popover is a static surface you position yourself.
   */
  trigger?: ReactElement<Record<string, unknown>>;
  /** Called when an anchored popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
}
const focusableIn = (root: HTMLElement) =>
  root.querySelector<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');

export const Popover = /* @__PURE__ */ forwardRef<HTMLDivElement, PopoverProps>(function Popover({ side, arrow, trigger, onOpenChange, className, children, ...rest }, ref) {
  const id = useId();
  const surface = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const popoverId = rest.id ?? `${id}-popover`;
  const onChange = useRef(onOpenChange);
  onChange.current = onOpenChange;
  useEffect(() => {
    const element = surface.current;
    if (!trigger || !element) return;
    const onToggle = (event: Event) => {
      const next = (event as ToggleEvent).newState === "open";
      setOpen(next);
      onChange.current?.(next);
      // A non-modal dialog takes focus when it opens (WAI dialog pattern) and returns it to the
      // trigger when it closes from inside (Escape, or an action that closes it).
      if (next) (focusableIn(element) ?? element).focus();
      else if (element.contains(document.activeElement) || document.activeElement === document.body)
        document.querySelector<HTMLElement>(`[aria-controls="${CSS.escape(element.id)}"]`)?.focus();
    };
    element.addEventListener("toggle", onToggle);
    return () => element.removeEventListener("toggle", onToggle);
  }, [trigger]);
  const setRef = (element: HTMLDivElement | null) => {
    surface.current = element;
    if (typeof ref === "function") ref(element); else if (ref) ref.current = element;
  };
  const body = <div {...(trigger ? { role: "dialog", tabIndex: -1 } : {})} {...rest} ref={setRef}
    {...(trigger ? { id: popoverId, popover: "auto" } : {})} className={popoverVariants({ side, arrow }, className)}>
    {children}
    {arrow ? <svg className="area-popover__arrow" viewBox="0 0 32 14" aria-hidden="true" focusable="false">
      <path d="M0 -1H32V0C24 0 23 3 20 9Q16 17 12 9C9 3 8 0 0 0Z" />
      <path className="area-popover__arrow-edge" d="M0 0C8 0 9 3 12 9Q16 17 20 9C23 3 24 0 32 0" />
    </svg> : null}
  </div>;
  if (!trigger) return body;
  return <span className="area-popover-anchor" style={{ "--_popover-anchor": `--area-popover-${id.replace(/[^a-zA-Z0-9_-]/g, "")}` } as CSSProperties}>
    {cloneElement(trigger, { popoverTarget: popoverId, "aria-haspopup": "dialog", "aria-expanded": open, "aria-controls": popoverId })}
    {body}
  </span>;
});
export const PopoverHeader = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverHeader({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__header", className)} {...rest} />; });
export const PopoverTitle = /* @__PURE__ */ forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function PopoverTitle({ className, ...rest }, ref) { return <h2 ref={ref} className={cx("area-popover__title", className)} {...rest} />; });
export const PopoverDescription = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverDescription({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__description", className)} {...rest} />; });
export const PopoverBody = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverBody({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__body", className)} {...rest} />; });
export const PopoverFooter = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverFooter({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__footer", className)} {...rest} />; });
export const PopoverMedia = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverMedia({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__media", className)} {...rest} />; });

export type MenuProps = Div;
const menuItemsOf = (menu: HTMLElement) =>
  [...menu.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([disabled]):not([aria-disabled="true"])')]
    .filter(item => item.closest('[role="menu"]') === menu);

/**
 * A list of actions. Up/Down move between items (wrapping), Home/End jump to the ends and a
 * printable key moves to the next item starting with it, as in the WAI menu pattern. Items
 * keep their own Tab stops; a popup that hosts the menu (SplitButton) closes it on Tab.
 */
export const Menu = /* @__PURE__ */ forwardRef<HTMLDivElement, MenuProps>(function Menu({ className, onKeyDown, ...rest }, ref) {
  const typeahead = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const menu = event.currentTarget;
    // A nested submenu handles its own keys.
    if (event.defaultPrevented || (event.target as HTMLElement).closest('[role="menu"]') !== menu) return;
    const items = menuItemsOf(menu);
    if (!items.length) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    let next: HTMLElement | undefined;
    switch (event.key) {
      case "ArrowDown": next = items[(index + 1) % items.length]; break;
      case "ArrowUp": next = items[(index - 1 + items.length) % items.length]; break;
      case "Home": next = items[0]; break;
      case "End": next = items.at(-1); break;
      default:
        if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey || event.key === " ") return;
        typeahead.current += event.key.toLocaleLowerCase();
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => { typeahead.current = ""; }, 500);
        next = [...items.slice(index + 1), ...items.slice(0, index + 1)]
          .find(item => (item.textContent ?? "").trim().toLocaleLowerCase().startsWith(typeahead.current));
    }
    if (!next) return;
    event.preventDefault();
    next.focus();
  };
  return <div ref={ref} role="menu" className={menuVariants({}, className)} onKeyDown={handleKeyDown} {...rest} />;
});

/** A non-interactive heading that names the following group of menu items. */
export const MenuLabel = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function MenuLabel({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-menu__label", className)} {...rest} />;
});

/** A visual and semantic boundary between related groups of menu actions. */
export const MenuSeparator = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function MenuSeparator({ className, ...rest }, ref) {
  return <div ref={ref} role="separator" className={cx("area-menu__separator", className)} {...rest} />;
});

/** A floating search field and its related menu, outside the menu's action-list semantics. */
export const MenuSearch = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function MenuSearch({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-menu__search-surface", className)} {...rest} />;
});

export interface MenuItemProps extends HTMLAttributes<HTMLButtonElement> {
  tone?: (typeof MANIFESTS.menu.elementModifiers.item)[number];
  shortcut?: ReactNode;
  disabled?: boolean;
  /**
   * Makes the row a checkable item (`role="menuitemcheckbox"`). The whole row is the control:
   * toggle `checked` in `onClick`. Hosts keep the menu open for checkable items.
   */
  checked?: boolean;
  /** How a checkable row shows its state: a trailing check (default) or a switch, as Notion's toggles. */
  indicator?: "check" | "switch";
  /** A muted note under the label (a model's summary, a setting's effect). */
  description?: ReactNode;
}

export const MenuItem = /* @__PURE__ */ forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  { tone, shortcut, disabled, checked, indicator = "check", description, className, children, ...rest },
  ref,
) {
  const checkable = checked !== undefined;
  return (
    <button
      ref={ref}
      type="button"
      role={checkable ? "menuitemcheckbox" : "menuitem"}
      aria-checked={checkable ? checked : undefined}
      className={cx("area-menu__item", tone === "danger" && "area-menu__item--danger", className)}
      disabled={disabled}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...rest}
    >
      {description ? <span className="area-menu__lines"><span className="area-menu__text">{children}</span><span className="area-menu__description">{description}</span></span>
        : typeof children === "string" || typeof children === "number" ? <span className="area-menu__text">{children}</span> : children}
      {shortcut ? <span className="area-menu__shortcut">{shortcut}</span> : null}
      {checkable && indicator === "switch" ? (
        <span className="area-switch area-switch--sm area-menu__toggle" aria-hidden="true">
          <span className="area-switch__track" data-checked={checked ? "" : undefined}><span className="area-switch__thumb" /></span>
        </span>
      ) : null}
      {checkable && indicator === "check" ? (
        <span className="area-menu__check" aria-hidden="true">
          <Glyph name="check" />
        </span>
      ) : null}
    </button>
  );
});

export interface ToastProps extends Omit<Div, "title"> {
  tone?: VariantProps<typeof MANIFESTS.toast>["tone"];
  icon?: ReactNode;
  title?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export const Toast = /* @__PURE__ */ forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { tone = "info", icon, title, action, onDismiss, dismissLabel = "Dismiss notification", className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={toastVariants({ tone }, className)} {...rest}>
      {icon ? (
        <span className="area-toast__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="area-toast__content" role="status" aria-atomic="true">{title ? <div className="area-toast__title">{title}</div> : null}<div className={title ? "area-toast__description" : undefined}>{children}</div></div>
      {action ? <div className="area-toast__action">{action}</div> : null}
      {onDismiss ? <span className="area-toast__dismiss"><Button size="sm" variant="ghost" tone="neutral" iconOnly icon={<Glyph name="dismiss" />} aria-label={dismissLabel} onClick={onDismiss} /></span> : null}
    </div>
  );
});

/* --- Tabs ----------------------------------------------------------------- */

export interface TabsProps extends Omit<Div, "defaultValue"> {
  /** Tab labels, in order. */
  tabs: Array<{ id: string; label: ReactNode; icon?: ReactNode; trailing?: ReactNode; disabled?: boolean; content?: ReactNode }>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  size?: VariantProps<typeof MANIFESTS.tabs>["size"];
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  track?: boolean;
}

export const Tabs = /* @__PURE__ */ forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { tabs, value: controlledValue, defaultValue, onValueChange, label = "Views", size = "md", orientation = "horizontal", activationMode = "automatic", track, className, children, ...rest },
  ref,
) {
  const id = useId();
  const [localValue, setLocalValue] = useState(defaultValue ?? tabs.find(tab => !tab.disabled)?.id);
  const candidate = controlledValue ?? localValue;
  const value = tabs.find(tab => tab.id === candidate && !tab.disabled)?.id ?? tabs.find(tab => !tab.disabled)?.id;
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const select = (next: string) => {
    if (controlledValue === undefined) setLocalValue(next);
    onValueChange?.(next);
  };
  return (
    <div ref={ref} className={tabsVariants({ size, track, orientation: orientation === "vertical" ? orientation : undefined }, className)} {...rest}>
      <div className="area-tabs__list" role="tablist" aria-label={label} aria-orientation={orientation}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${id}-tab-${tab.id}`}
            ref={node => { if (node) buttons.current.set(tab.id, node); else buttons.current.delete(tab.id); }}
            aria-selected={tab.id === value}
            aria-controls={`${id}-panel-${tab.id}`}
            onClick={() => select(tab.id)}
            onKeyDown={event => {
              const keys = orientation === "vertical" ? ["ArrowUp", "ArrowDown", "Home", "End"] : ["ArrowLeft", "ArrowRight", "Home", "End"];
              if (!keys.includes(event.key)) return;
              event.preventDefault();
              const enabled = tabs.filter(item => !item.disabled);
              const index = enabled.findIndex(item => item.id === tab.id);
              const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
              const step = (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) * (orientation === "horizontal" && rtl ? -1 : 1);
              const next = enabled[event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (index + step + enabled.length) % enabled.length];
              if (next) { if (activationMode === "automatic") select(next.id); buttons.current.get(next.id)?.focus(); }
            }}
            // Only the selected tab is in the tab order; arrow keys move between them.
            tabIndex={tab.id === value ? 0 : -1}
            disabled={tab.disabled}
            className="area-tabs__tab"
            {...(tab.id === value ? { "data-selected": "" } : {})}
            {...(tab.disabled ? { "data-disabled": "" } : {})}
          >
            {tab.icon ? <span className="area-tabs__icon" aria-hidden="true">{tab.icon}</span> : null}
            <span className="area-tabs__label">{tab.label}</span>
            {tab.trailing}
          </button>
        ))}
      </div>
      {tabs.map(tab => <div key={tab.id} className="area-tabs__panel" role="tabpanel" id={`${id}-panel-${tab.id}`} aria-labelledby={`${id}-tab-${tab.id}`} hidden={tab.id !== value} tabIndex={0}>
        {tab.content ?? (tab.id === value ? children : null)}
      </div>)}
    </div>
  );
});

/* --- Dialog --------------------------------------------------------------- */

export interface DialogProps extends Omit<Div, "title" | "onClose"> {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  /** Shows the corner close control. On by default. */
  showCloseButton?: boolean;
  /** Called by the close control before closing an enclosing native dialog. */
  onClose?: () => void;
  /**
   * Opens the dialog as a native modal (`showModal()`) when this element is clicked. The
   * platform supplies the focus trap, Escape, the backdrop and focus return; a click on the
   * backdrop also closes it.
   */
  trigger?: ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void }>;
  /** Called when the modal opened by `trigger` opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Interrupts with content that requires a response.
 *
 * With `trigger`, it renders the trigger and a native modal `<dialog>`. Without it, it renders
 * the surface alone so it can be shown inline in documentation, or placed inside your own
 * `<dialog class="area-dialog__modal">` and opened with `showModal()`.
 */
export const Dialog = /* @__PURE__ */ forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { title, description, footer, showCloseButton = true, onClose, trigger, onOpenChange, className, children, ...rest },
  ref,
) {
  const id = useId();
  const modal = useRef<HTMLDialogElement | null>(null);
  const onChange = useRef(onOpenChange);
  onChange.current = onOpenChange;
  const labelled = {
    "aria-labelledby": title ? `${id}-title` : undefined,
    "aria-describedby": description ? `${id}-description` : undefined,
  };
  const surface = (
    <div
      ref={ref}
      {...(trigger ? {} : { role: "dialog", "aria-modal": "true" as const, ...labelled })}
      className={cx("area-dialog", className)}
      {...rest}
    >
      {title || description || showCloseButton ? (
        <div className="area-dialog__header">
          <div className="area-dialog__heading">
            {title ? <h2 className="area-dialog__title" id={`${id}-title`}>{title}</h2> : null}
            {description ? <p className="area-dialog__description" id={`${id}-description`}>{description}</p> : null}
          </div>
          {showCloseButton ? <Button variant="ghost" tone="neutral" size="md" iconOnly className="area-dialog__close" aria-label="Close dialog" icon={<Glyph name="dismiss" />} onClick={event => {
            onClose?.();
            event.currentTarget.closest("dialog")?.close();
          }} /> : null}
        </div>
      ) : null}
      {children ? <div className="area-dialog__body">{children}</div> : null}
      {footer ? <div className="area-dialog__footer">{footer}</div> : null}
    </div>
  );
  if (!trigger) return surface;
  const modalId = `${id}-modal`;
  return (
    <>
      {cloneElement(trigger, {
        "aria-haspopup": "dialog",
        "aria-controls": modalId,
        onClick: (event: MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          if (event.defaultPrevented || modal.current?.open) return;
          modal.current?.showModal();
          onChange.current?.(true);
        },
      } as Record<string, unknown>)}
      <dialog
        ref={modal}
        id={modalId}
        className="area-dialog__modal"
        {...labelled}
        onClose={() => onChange.current?.(false)}
        // A click whose target is the <dialog> itself landed on the backdrop: the surface fills it.
        onClick={event => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
      >
        {surface}
      </dialog>
    </>
  );
});

/* --- Segmented control ---------------------------------------------------- */

export interface SegmentedProps extends Omit<Div, "onChange" | "onSelect" | "defaultValue"> {
  size?: VariantProps<typeof MANIFESTS.segmented>["size"];
  /** Stretch to the container, items sharing the width. For a panel row. */
  fullWidth?: boolean;
  /** Hide visible option labels while retaining their accessible names. */
  iconOnly?: boolean;
  options: Array<{ value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean }>;
  value?: string;
  defaultValue?: string;
  /** Accessible name for the group. */
  label?: string;
  onSelect?: (value: string) => void;
}

/**
 * Picks one value from a small set.
 *
 * Uses `role="radiogroup"` rather than a list of toggle buttons, because the choice is
 * exclusive — which is the distinction a screen reader needs and `aria-pressed` does not
 * convey.
 */
export const Segmented = /* @__PURE__ */ forwardRef<HTMLDivElement, SegmentedProps>(function Segmented(
  { size, fullWidth, iconOnly, options, value: controlledValue, defaultValue, label, onSelect, className, ...rest },
  ref,
) {
  const [localValue, setLocalValue] = useState(defaultValue ?? options.find(option => !option.disabled)?.value);
  const value = controlledValue ?? localValue;
  const entry = options.find(option => option.value === value && !option.disabled) ?? options.find(option => !option.disabled);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const select = (next: string) => {
    if (controlledValue === undefined) setLocalValue(next);
    onSelect?.(next);
  };
  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      className={segmentedVariants({ size, fullWidth, iconOnly }, className)}
      {...rest}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          disabled={option.disabled}
          className="area-segmented__item"
          ref={node => { if (node) buttons.current.set(option.value, node); else buttons.current.delete(option.value); }}
          tabIndex={option.value === entry?.value ? 0 : -1}
          onClick={() => select(option.value)}
          onKeyDown={event => {
            if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const enabled = options.filter(item => !item.disabled);
            const index = enabled.findIndex(item => item.value === option.value);
            const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
            const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : (event.key === "ArrowRight" ? 1 : -1) * (rtl ? -1 : 1);
            const next = enabled[event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (index + step + enabled.length) % enabled.length];
            if (next) { select(next.value); buttons.current.get(next.value)?.focus(); }
          }}
          {...(option.value === value ? { "data-selected": "" } : {})}
        >
          {option.icon ? (
            <span className="area-segmented__icon" aria-hidden="true">
              {option.icon}
            </span>
          ) : null}
          <span className={iconOnly ? "area-sr-only" : "area-segmented__label"}>{option.label}</span>
        </button>
      ))}
    </div>
  );
});

/* --- Code ----------------------------------------------------------------- */

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  /** A CSS colour the reference resolves to. Adds a decorative swatch. */
  swatch?: string;
  /** A quieter treatment for a derived reference. */
  subtle?: boolean;
  /** Uses the surrounding foreground on a coloured ground. */
  onColor?: boolean;
}

export const Code = /* @__PURE__ */ forwardRef<HTMLElement, CodeProps>(function Code(
  { children, swatch, subtle, onColor, className, ...rest }, ref,
) {
  return <code ref={ref} className={cx("area-code", swatch && "area-code--swatch", subtle && "area-code--subtle", onColor && "area-code--on-color", className)} {...rest}>
    {swatch ? <span className="area-code__swatch" style={{ background: swatch }} aria-hidden="true" /> : null}
    {swatch ? <span className="area-code__label">{children}</span> : children}
  </code>;
});

const codeBlockVariants = /* @__PURE__ */ createVariants(MANIFESTS.codeBlock);

/**
 * The copy glyphs are the two Fluent cuts the documentation's own toolbar uses, so the
 * React control and the generated HTML chrome draw the same mark.
 */
const CopyGlyph = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" focusable="false" aria-hidden="true">
    <path d="M5 6H4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1h1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h1zm7-4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2zM8 3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" />
  </svg>
);

const CopiedGlyph = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" focusable="false" aria-hidden="true">
    <path d="M13.86 3.66a.5.5 0 0 1-.02.7l-7.93 7.48a.6.6 0 0 1-.84-.02L2.4 9.1a.5.5 0 0 1 .72-.7l2.4 2.44 7.65-7.2a.5.5 0 0 1 .7.02" />
  </svg>
);

export type CodeLineMark = "added" | "removed";

/** `"3, 5-7"` or `[3, 5, 6, 7]` into the set of line numbers to emphasise. */
function parseLineNumbers(value: number[] | string | undefined): Set<number> | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return new Set(value.filter(line => Number.isInteger(line) && line > 0));

  const lines = new Set<number>();
  for (const part of value.split(",")) {
    const range = part.trim().match(/^(\d+)\s*-\s*(\d+)$/);
    if (!range) {
      const single = Number(part.trim());
      if (Number.isInteger(single) && single > 0) lines.add(single);
      continue;
    }
    const start = Number(range[1]);
    const end = Number(range[2]);
    // The range is authored by hand, but a runaway bound must not spin the renderer.
    for (let line = Math.min(start, end); line <= Math.max(start, end) && lines.size < 10000; line += 1) lines.add(line);
  }
  return lines;
}

export interface CodeBlockProps extends Omit<Div, "title"> {
  /** Plain code. One grid row is rendered per line. */
  code?: string;
  /**
   * Trusted, pre-highlighted HTML from a highlighter that emits one line of markup per line
   * of code. Use `code` for plain text.
   */
  html?: string;
  /** Filename, or whatever else names the snippet. Adds the header row. */
  title?: ReactNode;
  /** Language shown beside the title. */
  language?: string;
  /** More than one language turns the label into a picker. */
  languages?: string[];
  /** Renders the picker as tabs rather than a Select. */
  languageTabs?: boolean;
  /** Controlled active language. Omit for an uncontrolled picker. */
  value?: string;
  onLanguageChange?: (language: string) => void;
  /** Line numbers. On by default; turn them off for a short excerpt. */
  lineNumbers?: boolean;
  /** Lines to emphasise, as numbers or a range string such as `"3, 5-7"`. */
  highlightLines?: number[] | string;
  /** Added and removed lines, keyed by line number. */
  marks?: Record<number, CodeLineMark>;
  /** Makes each line number a link to its own line, so a reference can be shared. */
  linkLines?: boolean;
  /** Shows the show/hide control over an excerpt. */
  collapsible?: boolean;
  /** Starts collapsed. Only meaningful with `collapsible`. */
  defaultCollapsed?: boolean;
  /** Built-in copy control. On by default. */
  copyable?: boolean;
  copyLabel?: string;
  /** Extra actions beside the copy control. Adds the header row when there is no title. */
  actions?: ReactNode;
  /** Remove the surrounding border when embedded in another framed surface. */
  flush?: boolean;
  /** Wrap long code lines instead of scrolling horizontally. */
  wrap?: boolean;
}

export const CodeBlock = /* @__PURE__ */ forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  {
    flush,
    wrap,
    title,
    language,
    languages,
    languageTabs,
    value,
    onLanguageChange,
    lineNumbers = true,
    highlightLines,
    marks,
    linkLines,
    collapsible,
    defaultCollapsed,
    copyable = true,
    copyLabel = "Copy code",
    actions,
    html,
    code,
    className,
    ...rest
  },
  ref,
) {
  // A fragment has to be a plain token, so punctuation from useId is dropped rather than
  // escaped; uniqueness survives because nothing else about the id changes.
  const id = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const source = useRef<HTMLElement>(null);
  const tabButtons = useRef(new Map<string, HTMLButtonElement>());
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [localLanguage, setLocalLanguage] = useState(() => value ?? languages?.[0]);
  const [collapsed, setCollapsed] = useState(Boolean(defaultCollapsed));

  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  const activeLanguage = value ?? localLanguage ?? languages?.[0];
  const highlighted = parseLineNumbers(highlightLines);
  const lines = (html ?? code ?? "").split("\n");

  const selectLanguage = (next: string) => {
    if (value === undefined) setLocalLanguage(next);
    onLanguageChange?.(next);
  };

  /*
   * Pre-highlighted HTML has no plain-text twin, so the copy reads it back off the rendered
   * text cells -- which is also what keeps the gutter out of the clipboard.
   */
  const copy = () => {
    const read = () => {
      if (code !== undefined && html === undefined) return code;
      const node = source.current;
      if (!node) return code ?? "";
      const cells = node.querySelectorAll<HTMLElement>(".area-code-block__text");
      return cells.length ? Array.from(cells, cell => cell.textContent ?? "").join("\n") : node.textContent ?? "";
    };
    const settle = (state: "copied" | "failed") => {
      setCopyState(state);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopyState("idle"), 1600);
    };
    if (!navigator.clipboard?.writeText) { settle("failed"); return; }
    navigator.clipboard.writeText(read()).then(() => settle("copied"), () => settle("failed"));
  };

  const picker = languages?.length ? (
    languageTabs ? (
      <div className="area-code-block__languages" role="tablist" aria-label="Language">
        {languages.map((item, index) => {
          const selected = item === activeLanguage;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              /* Language names are the author's text, so the id is the index. */
              id={`${id}-tab-${index}`}
              className="area-code-block__tab"
              ref={node => { if (node) tabButtons.current.set(item, node); else tabButtons.current.delete(item); }}
              aria-selected={selected}
              aria-controls={`${id}-panel`}
              /* Only the selected tab is in the tab order; arrows move between them. */
              tabIndex={selected ? 0 : -1}
              onKeyDown={event => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
                const step = (event.key === "ArrowRight" ? 1 : -1) * (rtl ? -1 : 1);
                const next = languages[event.key === "Home" ? 0 : event.key === "End" ? languages.length - 1 : (index + step + languages.length) % languages.length]!;
                selectLanguage(next);
                tabButtons.current.get(next)?.focus();
              }}
              onClick={() => selectLanguage(item)}
            >
              {item}
            </button>
          );
        })}
      </div>
    ) : (
      <span className="area-code-block__languages">
        <Select
          className="area-code-block__select"
          size="sm"
          aria-label="Language"
          value={activeLanguage}
          onChange={event => selectLanguage(event.currentTarget.value)}
        >
          {languages.map(item => <option key={item} value={item}>{item}</option>)}
        </Select>
      </span>
    )
  ) : language ? <span className="area-code-block__language">{language}</span> : null;

  const tools = copyable || actions ? (
    <span className="area-code-block__actions">
      {actions}
      {copyable ? (
        <Button
          variant="ghost"
          tone="neutral"
          size="sm"
          iconOnly
          aria-label={copyState === "copied" ? "Copied" : copyLabel}
          icon={copyState === "copied" ? <CopiedGlyph /> : <CopyGlyph />}
          onClick={copy}
        />
      ) : null}
    </span>
  ) : null;

  const header = title || language || languages?.length ? (
    <div className="area-code-block__header">
      {title ? <span className="area-code-block__title">{title}</span> : null}
      {picker}
      {tools}
    </div>
  ) : tools;

  const panel = languageTabs && languages?.length
    ? { role: "tabpanel", id: `${id}-panel`, "aria-labelledby": `${id}-tab-${languages.indexOf(activeLanguage ?? "")}`, tabIndex: linkLines ? undefined : 0 }
    : {};

  return (
    <div ref={ref} className={codeBlockVariants({ flush, wrap, unnumbered: !lineNumbers }, className)} {...(collapsed ? { "data-collapsed": "" } : {})} {...rest}>
      {header}
      <div className="area-code-block__body" {...panel}>
        <pre className="area-code-block__pre">
          <code className="area-code-block__code" ref={source}>
          {lines.map((text, index) => {
            const number = index + 1;
            const mark = marks?.[number];
            // Hiding the numbers hides the gutter too, unless a diff marker needs its column.
            const gutter = lineNumbers || mark;
            return (
                <span
                  key={number}
                  id={linkLines ? `${id}-L${number}` : undefined}
                  className={cx(
                    "area-code-block__line",
                    mark && `area-code-block__line--${mark}`,
                    highlighted?.has(number) && "area-code-block__line--highlighted",
                  )}
                >
                {gutter ? (
                  <span className="area-code-block__gutter">
                    {mark ? <span className="area-code-block__marker">{mark === "added" ? "+" : "-"}</span> : null}
                    {linkLines
                      ? <a className="area-code-block__linenumber" href={`#${id}-L${number}`} aria-label={`Line ${number}`}>{number}</a>
                      : lineNumbers ? <span className="area-code-block__linenumber" aria-hidden="true">{number}</span> : null}
                  </span>
                ) : null}
                  {html
                    ? <span className="area-code-block__text" dangerouslySetInnerHTML={{ __html: text }} />
                    : <span className="area-code-block__text">{text}</span>}
                </span>
              );
            })}
          </code>
        </pre>
        {collapsible ? (
          <button
            type="button"
            className="area-code-block__toggle"
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(current => !current)}
          >
            {collapsed ? "Show code" : "Hide code"}
          </button>
        ) : null}
      </div>
      <span className="area-sr-only" aria-live="polite">
        {copyState === "copied" ? "Copied to clipboard" : copyState === "failed" ? "Copy failed" : ""}
      </span>
    </div>
  );
});

/* --- Kbd ------------------------------------------------------------------ */

/** Symbols for the modifier keys, so callers write names rather than glyphs. */
const KEY_GLYPHS: Record<string, string> = {
  cmd: "⌘",
  meta: "⌘",
  shift: "⇧",
  alt: "⌥",
  option: "⌥",
  ctrl: "⌃",
  control: "⌃",
  enter: "⏎",
  return: "⏎",
  backspace: "⌫",
  delete: "⌦",
  escape: "⎋",
  esc: "⎋",
  tab: "⇥",
  space: "␣",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

/** Spoken names, since a screen reader reads "⌘" as nothing useful. */
const KEY_LABELS: Record<string, string> = {
  "⌘": "Command",
  "⇧": "Shift",
  "⌥": "Option",
  "⌃": "Control",
  "⏎": "Enter",
  "⌫": "Backspace",
  "⌦": "Delete",
  "⎋": "Escape",
  "⇥": "Tab",
  "␣": "Space",
  "↑": "Up arrow",
  "↓": "Down arrow",
  "←": "Left arrow",
  "→": "Right arrow",
};

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Key names, in order. Modifiers, arrows and common special keys become native legends. */
  keys: string[];
  /** Normal (20px) suits standalone hints; small (16px) fits compact control chrome. */
  size?: VariantProps<typeof MANIFESTS.kbd>["size"];
  /** Surface treatment for standalone, compact chrome, coloured, or emphasized backgrounds. */
  appearance?: VariantProps<typeof MANIFESTS.kbd>["appearance"];
  /** @deprecated Use `appearance="quiet"`. */
  quiet?: boolean;
}

/**
 * Marks a keyboard shortcut.
 *
 * Renders one flat chord with one semantic element per key. The chord provides its own
 * spoken label because bare modifier glyphs are not announced usefully.
 */
export const Kbd = /* @__PURE__ */ forwardRef<HTMLElement, KbdProps>(function Kbd(
  { keys, size = "normal", appearance = "default", quiet, className, ...rest },
  ref,
) {
  const rendered = keys.map((key) => KEY_GLYPHS[key.toLowerCase()] ?? key.toUpperCase());
  const spoken = rendered.map((glyph) => KEY_LABELS[glyph] ?? glyph).join(" plus ");
  const resolvedAppearance = quiet ? "quiet" : appearance;

  return (
    <span
      ref={ref}
      className={cx("area-kbd", `area-kbd--${size}`, `area-kbd--${resolvedAppearance}`, className)}
      aria-label={spoken}
      {...rest}
    >
      {rendered.map((glyph, i) => (
        <kbd key={i} className="area-kbd__key" aria-hidden="true">
          {glyph}
        </kbd>
      ))}
    </span>
  );
});

export interface KbdGroupProps extends HTMLAttributes<HTMLSpanElement> {}

/** Groups separate chord hints that are pressed in sequence. */
export const KbdGroup = /* @__PURE__ */ forwardRef<HTMLSpanElement, KbdGroupProps>(function KbdGroup(
  { className, ...rest },
  ref,
) {
  return <span ref={ref} className={cx("area-kbd-group", className)} {...rest} />;
});

export interface TokenProps extends HTMLAttributes<HTMLElement> {
  /** The token's name, as it would be typed. */
  children: ReactNode;
  /**
   * A CSS colour the token resolves to. Renders a swatch ahead of the name.
   *
   * Pass the `var()` rather than a literal, so the swatch tracks the axes like everything
   * else does; a hex here would show what the token meant when the page was written.
   */
  swatch?: string;
  /** For a token naming something derived rather than primitive. */
  subtle?: boolean;
  /** On a coloured ground: takes the surrounding foreground instead of the page's. */
  onColor?: boolean;
}

/**
 * Names a design token inline — in documentation, a spec, or a comment thread.
 *
 * Token is `Code` with an optional colour swatch. Keeping the same element and base class
 * means any source-like reference reads as one 24px inline treatment; the Token name only
 * preserves the more specific swatch composition.
 */
export const Token = /* @__PURE__ */ forwardRef<HTMLElement, TokenProps>(function Token(
  { children, swatch, subtle, onColor, className, ...rest },
  ref,
) {
  return (
    <Code
      ref={ref}
      className={cx(
        "area-token",
        subtle && "area-token--subtle",
        onColor && "area-token--on-color",
        className,
      )}
      {...rest}
    >
      {swatch ? (
        <span className="area-token__swatch" style={{ background: swatch }} aria-hidden="true" />
      ) : null}
      {swatch ? <span className="area-token__label">{children}</span> : children}
    </Code>
  );
});
