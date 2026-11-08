import type { VariantProps } from "../variants.ts";
import { InToolbar, ToolbarSize, toolbarItemProps } from "./toolbar-context.ts";
import { MANIFESTS } from "../variants.ts";
import { Button, type ButtonProps } from "./Button.tsx";
import { CopyButton } from "./CopyButton.tsx";
import { Glyph } from "./Glyph.tsx";
import { Select } from "./forms.tsx";
import { ScrollArea } from "./ScrollArea.tsx";
import { CHANGE_MARK, changeStatus, type ChangeStatusInput } from "./change-status.ts";
import { AnchoredMenu, AnchoredPopover, AnchoredTooltip, MENU_OFFSET, OVERLAY_PADDING, TYPEAHEAD_RESET } from "./Overlays.tsx";
import { assignRef, useAnchoredPosition, useNativePopover, useOpenState } from "./overlay.ts";
import type { OverlayAlign, OverlaySide } from "./overlay.ts";
/**
 * The presentational components.
 *
 * Thin by design: each one places elements and forwards props, and contributes no styling
 * of its own. Every appearance decision lives in `@area/styles`, which is what lets a
 * consumer use the CSS without React and get an identical result.
 */
import { Children, cloneElement, createContext, forwardRef, isValidElement, useContext, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import type {
  TdHTMLAttributes,
  ThHTMLAttributes,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  CSSProperties,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
  RefObject,
  SyntheticEvent,
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
/** The empty collection, one reference so effects keyed on it stay still. */
const NO_ITEMS: never[] = [];

type Div = HTMLAttributes<HTMLDivElement>;
/* --- Avatar --------------------------------------------------------------- */

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  size?: VariantProps<typeof MANIFESTS.avatar>["size"];
  /** Unset: a circle while the theme's `pills` list names `avatar` (the default), else a rounded square. Set it where context decides: people circle, teams and workspaces square. */
  shape?: VariantProps<typeof MANIFESTS.avatar>["shape"];
  tone?: VariantProps<typeof MANIFESTS.avatar>["tone"];
  /** Draws the current-person or active-participant ring around the Avatar. */
  active?: boolean;
  src?: string;
  /**
   * Describes the person or entity. Required when `src` is set: pass `alt=""` when a visible name beside the
   * Avatar already says who it is, or name the Avatar with `aria-label` / `aria-labelledby`, or hide it.
   */
  alt?: string;
  /** Shown when there is no image. Usually one or two initials. */
  fallback?: ReactNode;
  /** A generic fallback visual, used instead of initials when no image is available. */
  icon?: ReactNode;
}

export const Avatar = /* @__PURE__ */ forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { size, shape, tone, active, src, alt, fallback, icon, className, role, "aria-label": ariaLabel, ...rest },
  ref,
) {
  // As Badge does for its unnamed forms: an image with no description fails loudly in development rather than
  // silently reaching assistive tech as an unnamed picture.
  if (src && alt === undefined && !ariaLabel && !rest["aria-labelledby"] && !rest["aria-hidden"]) {
    throw new Error("Avatar: an image avatar needs alt (alt=\"\" beside a visible name), aria-label, aria-labelledby or aria-hidden.");
  }
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

  // A span, so an Avatar is phrasing content inside a Chip's button or a Badge (audit C-22).
  return (
    <span
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
    </span>
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
  /**
   * single-line (default), multiline (title over wrapping body, actions below), or banner: a
   * one-line announcement across a page or section, its link at the end.
   */
  layout?: VariantProps<typeof MANIFESTS.alert>["layout"];
  /** Square, without side edges, for a banner that meets its container's edges. */
  flush?: boolean;
  icon?: ReactNode;
  /** Shadows the native `title` attribute deliberately: an Alert's title is content. */
  title?: ReactNode;
  /** The message's actions (a button or two), in its `__actions` part, as Toast's and Empty state's `actions`. */
  actions?: ReactNode;
  /** @deprecated Use `actions` (2026-11-07). Kept for one release; `actions` wins. */
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
  { tone, layout, flush = false, icon, title, actions: actionsProp, action, link, onDismiss, dismissIcon, dismissLabel = "Dismiss alert", className, children, ...rest },
  ref,
) {
  const actions = actionsProp ?? action;
  const resolvedLayout = layout ?? "single-line";
  // A banner's link ends the row (OpenAI's announcement banners); elsewhere it follows the text.
  const endLink = resolvedLayout === "banner";
  return (
    <div
      ref={ref}
      // `alert` interrupts a screen reader; `status` waits for a pause. Only danger earns
      // the interruption.
      role={tone === "danger" ? "alert" : "status"}
      className={alertVariants({ tone, layout: resolvedLayout, flush }, className)}
      {...rest}
    >
      {icon ? (
        <span className="area-alert__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="area-alert__content">
        {title ? <div className="area-alert__title">{title}</div> : null}
        {children || (link && !endLink) ? (
          <div className="area-alert__description">
            {children}
            {link && !endLink ? <span className="area-alert__link">{link}</span> : null}
          </div>
        ) : null}
      </div>
      {link && endLink ? <span className="area-alert__link">{link}</span> : null}
      {actions ? <div className="area-alert__actions">{actions}</div> : null}
      {onDismiss ? (
        // The close recipe for rectangular surfaces (audit S9): a ghost small Button with the Area glyph.
        <span className="area-alert__dismiss">
          <Button size="sm" variant="ghost" tone="neutral" iconOnly icon={dismissIcon ?? <Glyph name="dismiss" />} aria-label={dismissLabel} onClick={onDismiss} />
        </span>
      ) : null}
    </div>
  );
});

/* --- Card ----------------------------------------------------------------- */

export interface CardProps extends Div {
  layout?: VariantProps<typeof MANIFESTS.card>["layout"];
  /** Shape: the corner and inset (type is the same three roles at every size). */
  size?: VariantProps<typeof MANIFESTS.card>["size"];
  /** The chosen card in a set: the selection stroke, 2 wide, inside its edge (product UI rule 3). Sets `data-selected`;
   * the semantics (aria-selected in a List box, aria-pressed on a toggle) belong to the element that owns the choice. */
  selected?: boolean;
}

const cardVariants = createVariants(MANIFESTS.card);
export const Card = /* @__PURE__ */ forwardRef<HTMLDivElement, CardProps>(function Card({ layout, size, selected, className, ...rest }, ref) {
  return <div ref={ref} className={cardVariants({ layout, size }, className)} data-selected={selected ? "" : undefined} {...rest} />;
});

/**
 * Groups blocks that belong together. Optional: every slot (CardHeader, CardTitle, CardDescription, CardList, CardFooter)
 * sits on the card's space and section gap whether it is in CardContent or straight in the Card.
 */
export const CardContent = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function CardContent({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__content", className)} {...rest} />;
});

export interface CardHeaderProps extends Div {
  /** A Badge or an icon Button, centred on the title's first line. */
  action?: ReactNode;
}

/** A title row: the title (and description) beside a trailing action. */
export const CardHeader = /* @__PURE__ */ forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader({ action, className, children, ...rest }, ref) {
  return (
    <div ref={ref} className={cx("area-card__header", className)} {...rest}>
      <div className="area-card__heading">{children}</div>
      {action ? <div className="area-card__header-action">{action}</div> : null}
    </div>
  );
});

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** The heading level, so a card title is in the page outline (audit F-22; was a div). */
  level?: 2 | 3 | 4 | 5 | 6;
}
export const CardTitle = /* @__PURE__ */ forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle({ level = 3, className, ...rest }, ref) {
  const H = `h${level}` as "h3";
  return <H ref={ref} className={cx("area-card__title", className)} {...rest} />;
});

export const CardDescription = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function CardDescription(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("area-card__description", className)} {...rest} />;
});

/** A figure a widget leads with, such as a temperature, price or count. */
export const CardValue = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function CardValue({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__value", className)} {...rest} />;
});

export interface CardMediaProps extends Div {
  /** A recessed surface that holds a composition rather than a picture. */
  well?: boolean;
  /** Flush with the card's edge on the sides it touches, instead of inset. */
  bleed?: boolean;
}

export const CardMedia = /* @__PURE__ */ forwardRef<HTMLDivElement, CardMediaProps>(function CardMedia({ well, bleed, className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__media", well && "area-card__media--well", bleed && "area-card__media--bleed", className)} {...rest} />;
});

export interface CardOverlayProps extends Div {
  /** The corner it pins to, inside CardMedia or on the card itself. */
  placement?: "top-start" | "top-end" | "bottom-start" | "bottom-end";
  /** Hidden until the card is hovered or holds focus; always shown on touch screens. */
  reveal?: boolean;
}

export const CardOverlay = /* @__PURE__ */ forwardRef<HTMLDivElement, CardOverlayProps>(function CardOverlay(
  { placement = "top-end", reveal, className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("area-card__overlay", `area-card__overlay--${placement}`, reveal && "area-card__overlay--reveal", className)} {...rest} />;
});

/**
 * Makes the whole card one link: put it inside CardTitle. Its hit area covers the card, and
 * Buttons elsewhere in the card stay separate targets above it.
 */
export const CardLink = /* @__PURE__ */ forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function CardLink(
  { className, ...rest },
  ref,
) {
  return <a ref={ref} className={cx("area-card__link", className)} {...rest} />;
});

/** A short list of points; lead each item with a 16px icon. */
export const CardList = /* @__PURE__ */ forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(function CardList({ className, ...rest }, ref) {
  return <ul ref={ref} className={cx("area-card__list", className)} {...rest} />;
});

export const CardAction = /* @__PURE__ */ forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function CardAction(
  { className, ...rest },
  ref,
) {
  return <a ref={ref} className={cx("area-card__action", className)} {...rest} />;
});

/** A row of items that scrolls sideways with scroll snap; each child is an `<li>`. Name it with `aria-label`. */
export const CardCarousel = /* @__PURE__ */ forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(function CardCarousel({ className, tabIndex = 0, ...rest }, ref) {
  return <ul ref={ref} tabIndex={tabIndex} className={cx("area-card__carousel", className)} {...rest} />;
});

export interface CardFooterProps extends Div {
  /** Push the first and last children to the two ends (a person and a value), as Stack's `spread`. */
  spread?: boolean;
}

/** A row at the bottom of the card, on the card's space; it drops to the bottom of a taller card. */
export const CardFooter = /* @__PURE__ */ forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter({ spread, className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__footer", spread && "area-card__footer--spread", className)} {...rest} />;
});

/* --- Separator ------------------------------------------------------------ */

export interface SeparatorProps extends Div {
  orientation?: VariantProps<typeof MANIFESTS.separator>["orientation"];
  /** Space reserved around the rule, independent of its one-pixel stroke. */
  spacing?: VariantProps<typeof MANIFESTS.separator>["spacing"];
  /** Aligns the rule endpoints to inset content. */
  inset?: boolean;
  /** A visual rule only: no separator role (the content around it is not split semantically). */
  decorative?: boolean;
}

export const Separator = /* @__PURE__ */ forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", spacing, inset, decorative, className, ...rest },
  ref,
) {
  // A purely visual rule is hidden from assistive tech, as Radix's `decorative` (audit G-28).
  return (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={separatorVariants({ orientation, spacing, inset }, className)}
      {...rest}
    />
  );
});

/* --- Skeleton, Spinner, Progress ------------------------------------------ */

/**
 * How long a loading mark waits before it shows, so a quick load shows nothing (WRITING.md, "Loading shows by how long
 * it takes"): `short` 300 ms, `long` (or `true`) 1000 ms, or any number of milliseconds (Primer's Spinner and Skeleton
 * `delay`; components audit V6, 2026-11-07). Omitted or `false`, it shows at once.
 */
export type LoadingDelay = boolean | "short" | "long" | number;
/* spec: docs/research/components-audit-2026-11-07/primer.md, Spinner `delay` (src/Spinner/Spinner.tsx:27-28). */
export const LOADING_DELAY = { short: 300, long: 1000 } as const;
const loadingDelayMs = (delay: LoadingDelay | undefined) =>
  delay === undefined || delay === false ? 0 : delay === true ? LOADING_DELAY.long
    : typeof delay === "number" ? Math.max(0, delay) : LOADING_DELAY[delay];

/**
 * False until the delay has passed. The server and the client's first render both say false, so a delayed mark
 * hydrates as it was rendered (waiting) and the timer starts only in the browser.
 */
export function useLoadingDelay(delay: LoadingDelay | undefined): boolean {
  const ms = loadingDelayMs(delay);
  const [shown, setShown] = useState(ms === 0);
  useEffect(() => {
    if (ms === 0) { setShown(true); return; }
    setShown(false);
    const timer = setTimeout(() => setShown(true), ms);
    return () => clearTimeout(timer);
  }, [ms]);
  return shown;
}

export interface SkeletonProps extends Div {
  /** block (default): a box the host sizes; text: a line of type; circle: a 1:1 disc. */
  shape?: VariantProps<typeof MANIFESTS.skeleton>["shape"];
  /** Stand-in lines for a paragraph; implies the text shape. The last line is shorter. */
  lines?: number;
  /** false draws a still placeholder, without the shimmer. */
  animated?: boolean;
  /**
   * With children: while true the placeholder is painted on the child, which keeps its size and
   * corner, hidden and inert; when false the children render as they are.
   */
  loading?: boolean;
  /**
   * Waits before it shows, so a quick load shows nothing: `short` 300 ms, `long` (or `true`) 1000 ms, or milliseconds.
   * While it waits the placeholder keeps its box, invisible (`data-waiting`), so nothing moves when it appears.
   */
  delay?: LoadingDelay;
}

export const Skeleton = /* @__PURE__ */ forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape, lines, animated = true, loading = true, delay, className, children, ...rest },
  ref,
) {
  const still = !animated;
  const shown = useLoadingDelay(delay);
  const waiting = shown ? {} : { "data-waiting": "" };
  if (children !== undefined && children !== null && children !== false) {
    if (!loading) return <>{children}</>;
    return (
      <div ref={ref} aria-hidden="true" inert className={skeletonVariants({ shape, static: still, wrap: true }, className)} {...waiting} {...rest}>
        {children}
      </div>
    );
  }
  if (lines !== undefined && lines > 1) {
    return (
      <div ref={ref} aria-hidden="true" className={["area-skeleton__lines", className].filter(Boolean).join(" ")} {...waiting} {...rest}>
        {Array.from({ length: Math.floor(lines) }, (_, index) => (
          <div key={index} className={skeletonVariants({ shape: "text", static: still })} />
        ))}
      </div>
    );
  }
  return (
    <div ref={ref} aria-hidden="true" className={skeletonVariants({ shape: lines !== undefined ? "text" : shape, static: still }, className)} {...waiting} {...rest} />
  );
});

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, "role"> {
  size?: VariantProps<typeof MANIFESTS.spinner>["size"];
  /** Announced to assistive tech. Omit when a nearby element already says it. With a value, it names the ring. */
  label?: string;
  /**
   * How far along, 0 to `max`: the arc stops at the value instead of turning (Cursor's context and review rings).
   * Omit for an action with no known end.
   */
  value?: number;
  max?: number;
  /** Announced in place of the number ("48% of context used"). */
  valueText?: string;
  /**
   * With a value: progressbar (default) for a task on its way to done; meter for a level of a quantity, such as
   * context or storage used (ARIA 1.2 keeps the two apart).
   */
  role?: "progressbar" | "meter";
  /**
   * The turning spinner waits before it shows, so a quick action shows nothing: `short` 300 ms, `long` (or `true`)
   * 1000 ms, or milliseconds. While it waits it keeps its box, invisible (`data-waiting`), and its label is held back,
   * so its status says nothing until it shows. A ring with a `value` shows at once.
   */
  delay?: LoadingDelay;
}

/* The determinate ring is the spinning one stopped: r 7 on the 16 grid, a 2 line, round caps, the track the arc's
   ink at 25%. pathLength 100 makes the arc's length the value; a round cap reaches half the line past each end, so
   the dash is shortened by one line's share of the circumference (2 / 2π7 = 4.55 of 100) and the drawn arc matches
   the value (rc-progress for Ant Design). The 200 gap keeps 0 from drawing a full ring. */
const SPINNER_CAP = (2 / (2 * Math.PI * 7)) * 100;

export const Spinner = /* @__PURE__ */ forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, label, value, max = 100, valueText, role, delay, className, ...rest },
  ref,
) {
  const shown = useLoadingDelay(value === undefined ? delay : undefined);
  if (value !== undefined) {
    const clamped = Math.min(max, Math.max(0, value));
    const pct = max > 0 ? (clamped / max) * 100 : 0;
    const dash = pct >= 100 ? 100 : Math.max(0, pct - SPINNER_CAP);
    return (
      <span
        ref={ref}
        role={role ?? "progressbar"}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-valuetext={valueText}
        aria-label={label}
        className={spinnerVariants({ size }, className)}
        data-determinate=""
        {...rest}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <circle className="area-spinner__track" cx="8" cy="8" r="7" />
          <circle className="area-spinner__arc" cx="8" cy="8" r="7" pathLength={100} strokeDasharray={`${dash} 200`}
            {...(pct <= 0 ? { "data-empty": "" } : {})} />
        </svg>
      </span>
    );
  }
  return (
    <span
      ref={ref}
      role={label ? "status" : undefined}
      aria-hidden={label ? undefined : "true"}
      className={spinnerVariants({ size }, className)}
      {...(shown ? {} : { "data-waiting": "" })}
      {...rest}
    >
      {/* A live region announces its content, not its name: the label is content (audit E-21). While a delayed spinner
          waits, the region is there and empty, so the label arriving with the ring is what it says. */}
      {label && shown ? <span className="area-sr-only">{label}</span> : null}
    </span>
  );
});

export interface ProgressProps extends Omit<Div, "children"> {
  /** 0 to `max`. Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  label?: string;
  size?: VariantProps<typeof MANIFESTS.progress>["size"];
}

export const Progress = /* @__PURE__ */ forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, label, size, className, ...rest },
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
      // The announced value is the one drawn, clamped to the range (audit E-21).
      aria-valuenow={indeterminate ? undefined : Math.min(max, Math.max(0, value))}
      aria-label={label}
      className={progressVariants({ size }, className)}
      {...(indeterminate ? { "data-indeterminate": "" } : {})}
      {...rest}
    >
      {/* The value moves a full-width bar by a rounded translate (display.css), so the fill animates on the
          compositor and its end rests on a whole pixel (motion pass 2026-10-07; was inline-size). */}
      <div className="area-progress__bar" style={indeterminate ? undefined : ({ "--_progress-value": pct } as CSSProperties)} />
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
/** Fixed 240px inspector by default; override --area-panel-inline-size to customize. */
export interface PanelProps extends Omit<Div, "title"> {
  size?: VariantProps<typeof MANIFESTS.panel>["size"];
  /** Shadows the DOM `title` attribute deliberately: a panel's title is content, not a tooltip. */
  title?: ReactNode;
  /** The title's heading level; PanelSection headings default one below it (audit F-22; was a span). */
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
  /** Every PanelRow keeps a trailing action square, so controls line up down the panel even
   * where a row has no action (Figma's properties panel). Otherwise rows fill the width. */
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
  onWidthChange?: (width: number) => void;
  /** Resize limits in px (Figma's design panel: 241 to 500). */
  minWidth?: number;
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
 * The native range input carries the behaviour; the rail, fill and thumb are drawn beside it (slider.css). The drawing
 * reads one ratio the component computes from min/max/value (`--_slider-ratio`, with `--_pct` beside it). Controlled or
 * not, it is derived from the same numbers the input already carries, so the paint cannot disagree with the value -- and
 * because it is a ratio rather than a length it survives a density change without recomputing. The CSS eases it, except
 * while the pointer drags (`data-dragging`), when the drawing follows the pointer exactly.
 */
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: VariantProps<typeof MANIFESTS.slider>["size"];
  /**
   * The track's treatment, by thickness. `rail` (default): a thin rail and a round knob. `track`: a pill as tall as the
   * knob, the fill running under it (Figma's adjustment slider). `bar`: the track is the control's full height and
   * corner, its fill ending in a grip; with `labelPosition="inside"` it carries its label and value inside it.
   * `field` is the bar with its label inside.
   * @deprecated `variant="field"`: use `labelPosition="inside"` (owner 2026-10-26: the variants consolidated).
   */
  variant?: "rail" | "track" | "bar" | "field";
  /** Visible label for the range. */
  label?: ReactNode;
  /**
   * Where the label and readout sit. `inline` (default): either side of the track. `top`: above opposite ends of it.
   * `inside`: inside a bar, the label at its start and the value at its end, the fill a neutral plate behind them with a
   * white pill in its end, dragged from any point; it shows the value unless `readout` is false. Inside makes the slider a
   * bar, horizontal, without end labels.
   */
  labelPosition?: "inline" | "top" | "inside";
  /** Changes the visual axis while retaining native range keyboard semantics. */
  orientation?: "horizontal" | "vertical";
  /** Draws a marker at each interior step of a discrete track. */
  stepMarks?: boolean;
  /** Names the track's two ends under it, such as "Low" and "High"; decorative, the value is announced. Horizontal only. */
  startLabel?: ReactNode;
  endLabel?: ReactNode;
  /**
   * How far a media source has loaded, in the slider's own units (between `min` and `max`): painted as a second,
   * lighter stretch after the fill. Decorative; it is not announced.
   */
  buffered?: number;
  /**
   * The value the fill grows from, for a range with a neutral middle (a temperature from Cool through Neutral to Warm):
   * the fill runs between it and the value, either side of it, so at the origin the track is empty. Defaults to `min`.
   * The buffered stretch is not drawn with an origin.
   */
  origin?: number;
  /**
   * A CSS image painted along the bar, for a range whose values are colours: a temperature from cool to warm, a colour's
   * shades, a hue (owner 2026-10-27: "make the slider background itself be colored like a gradient"). The fill shows the
   * colours at full strength up to the value and the rest of the trough shows them faintly; on a bar the thumb is a
   * white pill, as on every bar (owner 2026-10-31). `linear-gradient(to right in oklab, …)`, start to end, edge
   * to edge; it is drawn as given in either reading direction. Horizontal only.
   */
  gradient?: string;
  /**
   * Rendered after the track. `true` shows the normalized numeric value; a function can
   * format that live value. A React node remains supported for fully custom content.
   */
  readout?: boolean | ReactNode | ((value: number) => ReactNode);
  /** Called with the normalized native value and the input event, for every input event. */
  onValueChange?: (value: number, event: FormEvent<HTMLInputElement>) => void;
  /**
   * Called once a change is final: when the pointer lets go (with the value it landed on, if it changed), and on every
   * keyboard step. A host whose change is costly (a setting that restyles the app) applies it here, or when
   * `onValueChange` pauses, and keeps the slider responsive while it drags (Radix's and Base UI's `onValueCommitted`).
   */
  onValueCommit?: (value: number) => void;
  /**
   * A stepped range glides (owner, 2026-10-24: "the sliders are not very smooth in between their options"): while the
   * pointer drags, the track follows it continuously and the value lands on whole steps (`onValueChange` fires when the
   * step changes); on release the fill settles onto the step. On by default for a range of 60 steps or fewer; `false`
   * keeps the native stepping. Keyboard steps are always whole.
   */
  glide?: boolean;
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
    size,
    variant: variantProp = "rail",
    label,
    labelPosition: labelPositionProp = "inline",
    orientation = "horizontal",
    stepMarks,
    startLabel,
    endLabel,
    buffered,
    origin,
    gradient,
    readout,
    onValueChange,
    onValueCommit,
    glide,
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
  // `field` was the bar with its label inside (owner 2026-10-26: "consolidate"); it stays one release as an alias.
  const inside = labelPositionProp === "inside" || variantProp === "field";
  const variant = inside ? "bar" : variantProp as Exclude<SliderProps["variant"], "field">;
  const labelPosition = inside ? "inside" : labelPositionProp;
  const initialValue = normalizeSliderValue(defaultValue, min, max, step);
  const [localValue, setLocalValue] = useState(initialValue);
  const current = value === undefined
    ? localValue
    : normalizeSliderValue(value, min, max, step);
  const lower = finiteNumber(min, 0);
  const upper = Math.max(lower, finiteNumber(max, 100));
  const bufferedRatio = buffered === undefined || upper <= lower
    ? undefined
    : Math.min(1, Math.max(0, (finiteNumber(buffered, lower) - lower) / (upper - lower)));
  // An origin inside the range, as a ratio: the CSS puts the fill between it and the value, either way, so it eases too.
  const originRatio = origin === undefined || upper <= lower ? undefined : Math.min(1, Math.max(0, (finiteNumber(origin, lower) - lower) / (upper - lower)));
  const interval = step === "any" ? 0 : finiteNumber(step, 1);
  // The glide: the pointer's exact place on the track while it drags (null otherwise).
  const glides = (glide ?? true) && interval > 0 && (upper - lower) / interval <= 60;
  const [dragged, setDragged] = useState<number | null>(null);
  const emitted = useRef<number | null>(null);
  // A pointer press (`data-pressed`: the knob lifts) becomes a drag once the pointer moves (`data-dragging`: the drawing
  // stops easing and follows it). A click on the track is a press without a drag, so the thumb eases to the click. On
  // release the value it landed on is committed, if it changed.
  const [pressed, setPressed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const pressedAt = useRef({ x: 0, y: 0 });
  // Read by the input handler, which the native control fires right after pointerdown, before React re-renders.
  const pressing = useRef(false);
  const atPress = useRef(0);
  const latest = useRef(0);
  const commit = useRef(onValueCommit);
  commit.current = onValueCommit;
  useEffect(() => {
    if (!pressed) return;
    const move = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - pressedAt.current.x, event.clientY - pressedAt.current.y) > 2) setDragging(true);
    };
    const end = () => {
      pressing.current = false;
      setPressed(false); setDragging(false); setDragged(null); emitted.current = null;
      if (latest.current !== atPress.current) commit.current?.(latest.current);
    };
    addEventListener("pointermove", move);
    addEventListener("pointerup", end);
    addEventListener("pointercancel", end);
    return () => { removeEventListener("pointermove", move); removeEventListener("pointerup", end); removeEventListener("pointercancel", end); };
  }, [pressed]);
  const shown = dragged ?? current;
  latest.current = current;
  const painted = upper > lower ? ((shown - lower) / (upper - lower)) * 100 : 0;
  // One mark per value, the two ends included (a bar draws them all as dots; a rail's ticks leave the ends to the rail).
  const markSteps = stepMarks && interval > 0 ? Math.round((upper - lower) / interval) : 0;
  const markCount = markSteps >= 2 && markSteps <= 25 ? markSteps + 1 : 0;

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

  // A slider with its label inside carries its value inside the bar too, so it shows one unless told not to.
  const shownReadout = readout === undefined && inside ? true : readout;
  const vertical = orientation === "vertical" && !inside;
  const renderedReadout = typeof shownReadout === "function"
    ? shownReadout(current)
    : shownReadout === true
      ? current
      : shownReadout;

  return (
    <label
      className={sliderVariants({
        size,
        variant: variant === "rail" ? undefined : variant,
        labelPosition: labelPosition === "inline" ? undefined : labelPosition,
        orientation: vertical ? "vertical" : undefined,
      }, className)}
      // `--_slider-ratio` places the thumb and ends the fill (at the thumb's centre, which sits inset by half the thumb).
      // While a glide drags, the drawing follows the pointer, not the step.
      style={{
        ["--_pct" as string]: `${painted}%`,
        ["--_slider-ratio" as string]: painted / 100,
        ...(bufferedRatio === undefined ? {} : { ["--_buffered" as string]: bufferedRatio }),
        ...(originRatio === undefined ? {} : { ["--_origin" as string]: originRatio }),
        ...(gradient ? { ["--_gradient" as string]: gradient } : {}),
        ...style,
      }}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...(originRatio === undefined ? {} : { "data-origin": "" })}
      {...(gradient ? { "data-gradient": "" } : {})}
      {...(glides ? { "data-glide": "" } : {})}
      {...(pressed ? { "data-pressed": "" } : {})}
      {...(dragging ? { "data-dragging": "" } : {})}
    >
      {label ? <span className="area-slider__label">{label}</span> : null}
      <span className="area-slider__track">
      <input
        {...rest}
        // The visible readout ("60%", "1.25×") is what a screen reader should say too (audit C-10).
        aria-valuetext={rest["aria-valuetext"] ?? (typeof renderedReadout === "string" ? renderedReadout : undefined)}
        ref={input}
        type="range"
        className="area-slider__control"
        min={min}
        max={max}
        step={dragged !== null ? "any" : step}
        value={value === undefined && dragged === null ? undefined : shown}
        defaultValue={defaultValue}
        disabled={disabled}
        // Shift+arrow moves ten steps, as Carbon and MUI (audit C-31). The native control takes the
        // value and fires its own input event, so the change runs through onInput like any other.
        onKeyDown={event => {
          rest.onKeyDown?.(event);
          if (event.defaultPrevented || !event.shiftKey || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
          const control = event.currentTarget;
          const rtl = getComputedStyle(control).direction === "rtl";
          const up = event.key === "ArrowUp" || event.key === (rtl ? "ArrowLeft" : "ArrowRight");
          const unit = interval > 0 ? interval : (upper - lower) / 100;
          const next = Math.min(upper, Math.max(lower, control.valueAsNumber + (up ? 1 : -1) * unit * 10));
          event.preventDefault();
          Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(control, String(next));
          control.dispatchEvent(new Event("input", { bubbles: true }));
        }}
        onPointerDown={event => {
          rest.onPointerDown?.(event);
          if (disabled || event.button !== 0) return;
          atPress.current = current;
          pressing.current = true;
          pressedAt.current = { x: event.clientX, y: event.clientY };
          setPressed(true);
          // A glide follows the pointer from the press: the native control drags continuously ("any") meanwhile.
          if (glides) { emitted.current = current; setDragged(current); }
        }}
        onInput={event => {
          onInput?.(event);
          const raw = event.currentTarget.valueAsNumber;
          if (glides && dragged !== null) {
            setDragged(raw);
            const nextValue = normalizeSliderValue(raw, min, max, step);
            if (nextValue === emitted.current) return;
            emitted.current = nextValue;
            latest.current = nextValue;
            if (value === undefined) setLocalValue(nextValue);
            onValueChange?.(nextValue, event);
            return;
          }
          latest.current = raw;
          if (value === undefined) setLocalValue(raw);
          onValueChange?.(raw, event);
          // A key step (or any change without a press) is final at once; a press commits when it lets go.
          if (!pressing.current) onValueCommit?.(raw);
        }}
      />
      <span className="area-slider__rail" aria-hidden="true">
        {bufferedRatio === undefined || originRatio !== undefined ? null : <span className="area-slider__buffer" />}
        <span className="area-slider__fill" />
      </span>
      {markCount > 0 ? <span className="area-slider__marks" aria-hidden="true">{Array.from({ length: markCount }, (_, index) => <i key={index} style={{ ["--_mark" as string]: `${(index / (markCount - 1)) * 100}%` }} />)}</span> : null}
      <span className="area-slider__thumb" aria-hidden="true" />
      </span>
      {shownReadout === false || shownReadout === undefined ? null : (
        <span className="area-slider__value" aria-hidden="true">{renderedReadout}</span>
      )}
      {!inside && (startLabel != null || endLabel != null) ? (
        <span className="area-slider__ends" aria-hidden="true">
          <span className="area-slider__end">{startLabel}</span>
          <span className="area-slider__end">{endLabel}</span>
        </span>
      ) : null}
    </label>
  );
});

/* --- Chip ----------------------------------------------------------------- */

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Interaction role: assist action, selectable filter, removable input, or suggestion. */
  kind?: VariantProps<typeof MANIFESTS.chip>["kind"];
  size?: VariantProps<typeof MANIFESTS.chip>["size"];
  /** Unset: a pill while the theme's `pills` list names this component (the default). `true` forces a pill, `false` the radius setting's corner. */
  pill?: boolean;
  /** A colour this chip stands for, shown as a dot before the label. */
  swatch?: string;
  icon?: ReactNode;
  /** Controlled selected state. */
  selected?: boolean;
  /** Initial selected state for an uncontrolled chip. */
  defaultSelected?: boolean;
  /** Called after a user toggles an enabled chip. */
  onSelectedChange?: (selected: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  /** A person or entity visual, usually an Avatar. */
  avatar?: ReactNode;
  /** A small visual filter thumbnail. `imageAlt` is optional when the label names it. */
  image?: string;
  imageAlt?: string;
  /** Adds an independently focusable dismiss action (a circle with the Area dismiss glyph). */
  onDismiss?: () => void;
  /** @deprecated Use `onDismiss` (audit S9: one dismiss API). */
  onRemove?: () => void;
  /** Makes the label an action when a removable input chip would otherwise only expose dismiss. */
  clickable?: boolean;
  /** Replaces the standard dismiss icon, for example with a trash can. */
  dismissIcon?: ReactNode;
  /** Accessible name for the dismiss action. */
  dismissLabel?: string;
  /** @deprecated Use `dismissIcon`. */
  removeIcon?: ReactNode;
  /** @deprecated Use `dismissLabel`. */
  removeLabel?: string;
  /** Marks an input chip whose value was not recognized. */
  invalid?: boolean;
  /** No label: the swatch is the whole chip, and the box goes square. */
  swatchOnly?: boolean;
}

export const Chip = /* @__PURE__ */ forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { kind = "filter", size, pill, swatch, icon, avatar, image, imageAlt, selected, defaultSelected = false, onSelectedChange, onClick, onDismiss: onDismissProp, onRemove, clickable, dismissIcon, removeIcon, dismissLabel, removeLabel, invalid, swatchOnly, className, children, disabled, ...rest },
  ref,
) {
  const [localSelected, setLocalSelected] = useState(defaultSelected);
  const currentSelected = selected ?? localSelected;
  const selectable = kind === "filter";
  const primaryInteractive = selectable || clickable || Boolean(onClick);
  const classes = chipVariants({ kind, size, swatchOnly, pill: pill === true, rounded: pill === false }, className);
  const state = {
    ...(selectable && currentSelected ? { "data-selected": "" } : {}),
    ...(disabled ? { "data-disabled": "" } : {}),
    ...(invalid ? { "data-invalid": "" } : {}),
  };
  const contents = (
    <>
      {swatch ? <span className="area-chip__swatch" style={{ background: swatch }} aria-hidden="true" /> : null}
      {avatar ? <span className="area-chip__avatar" aria-hidden="true">{avatar}</span> : null}
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
    onSelectedChange?.(next, event);
  };

  const onDismiss = onDismissProp ?? onRemove;
  if (onDismiss) {
    // The removal names what it removes, so a row of chips doesn't read "Remove chip" over and
    // over (audit C-6). A consumer label wins; a non-text chip falls back to the generic name.
    const text = typeof children === "string" || typeof children === "number" ? String(children) : null;
    const name = dismissLabel ?? removeLabel ?? (text ? `Remove ${text}` : "Remove chip");
    // Removing unmounts the focused control: hand focus to the next chip, or the previous one,
    // instead of dropping it to the page (Material, Spectrum TagGroup).
    const dismiss = (from: HTMLElement) => {
      const chip = from.closest(".area-chip");
      const next = chip?.nextElementSibling?.querySelector<HTMLElement>("button:not(:disabled), a[href]") ?? (chip?.nextElementSibling?.matches("button:not(:disabled), a[href]") ? chip.nextElementSibling as HTMLElement : null);
      const prev = chip?.previousElementSibling?.querySelector<HTMLElement>("button:not(:disabled), a[href]") ?? (chip?.previousElementSibling?.matches("button:not(:disabled), a[href]") ? chip.previousElementSibling as HTMLElement : null);
      onDismiss();
      requestAnimationFrame(() => {
        const active = document.activeElement;
        if (active && active !== document.body && active.isConnected) return;
        (next ?? prev)?.focus();
      });
    };
    // Backspace or Delete on a focused chip removes it, as on Material and Spectrum chips.
    const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (disabled || (event.key !== "Backspace" && event.key !== "Delete")) return;
      event.preventDefault();
      dismiss(event.currentTarget);
    };
    // `ref` and native props land on the chip's primary control (the action, or the removal when
    // it is the only control); `className` and `style` on the chip itself (audit C-24).
    const { style, onKeyDown: theirKeyDown, ...control } = rest;
    const keys = (event: KeyboardEvent<HTMLButtonElement>) => { theirKeyDown?.(event); if (!event.defaultPrevented) onKeyDown(event); };
    return (
      <span className={classes} style={style} {...state}>
        {primaryInteractive ? (
          <button ref={ref} type="button" aria-pressed={selectable ? currentSelected : undefined} disabled={disabled} className="area-chip__action" onClick={handleClick} {...control} onKeyDown={keys}>
            {contents}
          </button>
        ) : <span className="area-chip__action">{contents}</span>}
        <button {...(primaryInteractive ? {} : control)} ref={primaryInteractive ? undefined : ref} type="button" className="area-chip__dismiss" aria-label={name} disabled={disabled}
          onKeyDown={primaryInteractive ? onKeyDown : keys}
          onClick={event => { event.stopPropagation(); dismiss(event.currentTarget); }}>
          {dismissIcon ?? removeIcon ?? <Glyph name="dismiss" />}
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
  /** Unset: a pill while the theme's `pills` list names `chip` (the default); `true` forces a pill, `false` the radius setting's corner, as on Chip (owner, 2026-10-19). */
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
    <a ref={ref} className={chipVariants({ kind: "suggestion", size, link: treatment === "underline", linkIcon: treatment === "icon", pill: pill === true, rounded: pill === false }, className)} {...rest}>
      {avatar ? <span className="area-chip__avatar" aria-hidden="true">{avatar}</span> : null}
      {image ? <span className="area-chip__image"><img src={image} alt={imageAlt ?? ""} /></span> : null}
      {icon ? <span className="area-chip__icon" aria-hidden="true">{icon}</span> : null}
      <span className="area-chip__label">{children}</span>
      {treatment === "icon" && trailingIcon ? <span className="area-chip__trailing-icon" aria-hidden="true">{trailingIcon}</span> : null}
    </a>
  );
});

export interface ChipGroupProps extends Div {
  /** @deprecated Use `aria-label`, which names the group (audit C-23, D-18). */
  label?: string;
}

export const ChipGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, ChipGroupProps>(function ChipGroup(
  { label, className, ...rest },
  ref,
) {
  return <div ref={ref} role="group" aria-label={rest["aria-label"] ?? label} className={cx("area-chip-group", className)} {...rest} />;
});

/* --- Table ---------------------------------------------------------------- */

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Highlights rows on hover. Use only when a row is clickable. */
  interactive?: boolean;
  size?: VariantProps<typeof MANIFESTS.table>["size"];
  /** `fixed`: the first column takes the label column (27%) whatever its content, so tables in one feed start their
   * values on one line; the other columns still size to their content. `auto` (default) sizes every column to its content. */
  layout?: VariantProps<typeof MANIFESTS.table>["layout"];
  striped?: boolean;
  columnDividers?: boolean;
  /** No frame: the table sits on its surface, its rows ruled and its cell inset hanging outside the content edge. */
  flush?: boolean;
  /** Cells in a row line up on their first baseline (rows mixing text sizes). */
  baseline?: boolean;
  /** Props for the scrolling wrapper (audit F-23); `ref` and the rest land on the table. */
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  /**
   * The header row stays at the top while the rows scroll under it (components audit V3). It sticks inside the table's
   * own scroller, so give the wrapper a height (`wrapperProps={{ style: { maxBlockSize } }}`); the header keeps its
   * ground and its rule.
   */
  stickyHeader?: boolean;
  /**
   * The first column stays at the start while the table scrolls sideways (V3). Its cells keep the table's ground and
   * draw a rule at their end only while columns are scrolled under them.
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
  numeric?: boolean;
  fit?: boolean;
  /**
   * Makes the column sortable (components audit V3): the heading holds a sort button and, while sorted, `aria-sort`.
   * `none` is sortable but not sorted. Table sorts nothing itself: sort the rows in `onSortChange`.
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
  defaultExpanded?: boolean;
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

/* --- Surfaces ------------------------------------------------------------- */

export interface TooltipProps extends Div {
  /** The side of the trigger that this visible tooltip occupies. */
  side?: VariantProps<typeof MANIFESTS.tooltip>["side"];
  /** Draws a subtly rounded pointer toward the trigger. Omitted by default. */
  arrow?: boolean;
  /**
   * The control it names. With a trigger, the tooltip shows after a delay on hover and at
   * once on keyboard focus, hides on Escape, blur or pointer leave, and describes the trigger.
   */
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: OverlayAlign;
  offset?: number;
  /** Hover delay before showing, in milliseconds. */
  delay?: number;
  /** Delay before hiding after the pointer leaves, in milliseconds (Hover card's name; audit S17). */
  closeDelay?: number;
  /**
   * False when the tooltip repeats the trigger's accessible name (an icon-only button's label), so
   * it is not announced twice; the tooltip then only shows. Defaults to true: it describes the trigger.
   */
  describes?: boolean;
}

export const Tooltip = /* @__PURE__ */ forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { side, arrow, trigger, open, defaultOpen, onOpenChange, align, offset, delay, closeDelay, describes, className, ...rest },
  ref,
) {
  const surface = (extra: Div & { ref?: Ref<HTMLDivElement> }) => (
    <div role="tooltip" className={tooltipVariants({ side, arrow }, className)} {...rest} {...extra} ref={node => { assignRef(ref, node); assignRef(extra.ref as never, node); }} />
  );
  if (trigger === undefined) return surface({});
  return <AnchoredTooltip trigger={trigger} open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} side={side} align={align} offset={offset} arrow={arrow} delay={delay} closeDelay={closeDelay} describes={describes} id={rest.id} surface={surface} />;
});

export interface PopoverProps extends Div {
  side?: VariantProps<typeof MANIFESTS.popover>["side"];
  /** Draw a curved shoulder pointing at the anchored element. */
  arrow?: boolean;
  /**
   * The element that opens it. With a trigger, the popover anchors to it, flips when the
   * preferred side lacks room, takes focus on open, and closes on Escape or an outside press.
   */
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: OverlayAlign;
  offset?: number;
  /** Position against this element instead of the trigger, such as the field around an input. */
  anchor?: RefObject<HTMLElement | null>;
}
/** A PopoverTitle names the Popover it sits in, unless the Popover is named some other way. */
const PopoverTitleContext = /* @__PURE__ */ createContext<{ id: string; register: (id: string | null) => void } | null>(null);

export const Popover = /* @__PURE__ */ forwardRef<HTMLDivElement, PopoverProps>(function Popover({ side, arrow, trigger, open, defaultOpen, onOpenChange, align, offset, anchor, className, children, ...rest }, ref) {
  const fallbackTitleId = `${useId()}-title`;
  const [titleId, setTitleId] = useState<string | null>(null);
  const titleContext = useMemo(() => ({ id: fallbackTitleId, register: setTitleId }), [fallbackTitleId]);
  const named = rest["aria-label"] || rest["aria-labelledby"] || !titleId ? {} : { "aria-labelledby": titleId };
  const surface = (extra: Div & { ref?: Ref<HTMLDivElement> }) => <div className={popoverVariants({ side, arrow }, className)} {...named} {...rest} {...extra} ref={node => { assignRef(ref, node); assignRef(extra.ref as never, node); }}>
    <PopoverTitleContext.Provider value={titleContext}>{children}</PopoverTitleContext.Provider>
    {arrow ? <svg className="area-popover__arrow" viewBox="0 0 32 14" aria-hidden="true" focusable="false">
      <path d="M0 -1H32V0C24 0 23 3 20 9Q16 17 12 9C9 3 8 0 0 0Z" />
      <path className="area-popover__arrow-edge" d="M0 0C8 0 9 3 12 9Q16 17 20 9C23 3 24 0 32 0" />
    </svg> : null}
  </div>;
  if (trigger === undefined) return surface({});
  return <AnchoredPopover trigger={trigger} open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} side={side} align={align} offset={offset} anchor={anchor} arrow={arrow} id={rest.id} surface={surface} />;
});
export const PopoverHeader = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverHeader({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__header", className)} {...rest} />; });
export interface PopoverTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * The heading level (default 2), as CardTitle's `level` and Panel's `titleLevel`; `false`
   * renders a plain block, for a card that opens from running text such as a Hover card, so
   * every preview doesn't add a heading to the page outline (audit E-8).
   */
  level?: 2 | 3 | 4 | 5 | 6 | false;
}
export const PopoverTitle = /* @__PURE__ */ forwardRef<HTMLHeadingElement, PopoverTitleProps>(function PopoverTitle({ level = 2, className, id, ...rest }, ref) {
  const context = useContext(PopoverTitleContext);
  const titleId = id ?? context?.id;
  useLayoutEffect(() => {
    if (!context || !titleId) return;
    context.register(titleId);
    return () => context.register(null);
  }, [context, titleId]);
  const H = level === false ? "div" : `h${level}` as "h2";
  return <H ref={ref} id={titleId} className={cx("area-popover__title", className)} {...rest} />;
});
/**
 * The header's close button: Popover's ghost square with the dismiss glyph. It closes the
 * popover it sits in through the platform (`hidePopover`), so an anchored Popover closes without
 * the consumer controlling `open`, and focus returns to the trigger (audit E-8).
 */
export const PopoverClose = /* @__PURE__ */ forwardRef<HTMLButtonElement, Omit<ButtonProps, "children"> & { "aria-label"?: string }>(function PopoverClose(
  { "aria-label": ariaLabel = "Close", onClick, ...rest }, ref,
) {
  return <Button ref={ref} variant="ghost" tone="neutral" size="sm" iconOnly icon={<Glyph name="dismiss" />} aria-label={ariaLabel} {...rest}
    onClick={event => { onClick?.(event); if (!event.defaultPrevented) event.currentTarget.closest<HTMLElement>("[popover]")?.hidePopover?.(); }} />;
});
export const PopoverDescription = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverDescription({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__description", className)} {...rest} />; });
export const PopoverBody = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverBody({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__body", className)} {...rest} />; });
export const PopoverFooter = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverFooter({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__footer", className)} {...rest} />; });
export interface PopoverStepProps extends HTMLAttributes<HTMLSpanElement> {
  /** This step, from 1. */
  current: number;
  /** How many steps the tour has. */
  total: number;
}
/** A teaching tour's progress at the start of the footer, "1 of 3", muted (owner, round 68: a bare "1" didn't say what
 * it counted; Atlassian's spotlight and Notion's tours write the step and the total). */
export const PopoverStep = /* @__PURE__ */ forwardRef<HTMLSpanElement, PopoverStepProps>(function PopoverStep({ current, total, className, ...rest }, ref) {
  return <span ref={ref} className={cx("area-popover__step", className)} {...rest}>{current} of {total}</span>;
});
export const PopoverMedia = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverMedia({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__media", className)} {...rest} />; });

export interface MenuProps extends Div {
  /**
   * The button that opens it. With a trigger, the menu anchors to it and follows the ARIA
   * menu button pattern: Enter, Space or ArrowDown open it on the first item and ArrowUp on
   * the last; arrows, Home, End and typing move between items; choosing an item, Escape or
   * Tab closes it. Without one, the menu is a surface its host places (SplitButton,
   * ContextMenu, ModelPicker) and handles the item keys itself.
   */
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: OverlaySide;
  align?: OverlayAlign;
  offset?: number;
  /**
   * With a trigger: an Area Tooltip that names it (below it, after the hover delay), for an
   * icon-only trigger. A Tooltip cannot wrap a menu's trigger from outside, since both take the
   * trigger over (product UI rule 4, docs/PRODUCT_UI.md).
   */
  tooltip?: ReactNode;
  /**
   * Fixed above the rows, with a rule under it, and not scrolled with them (components audit V5, 2026-11-07): a heading
   * (a string is set as a MenuLabel) or a line about the list. Its own rows, if any, are reached by the arrows.
   */
  header?: ReactNode;
  /** Fixed below the rows, with a rule over it: an action row for the whole list (a MenuItem such as "Manage teams") or a hint. */
  footer?: ReactNode;
  /**
   * The rows are on their way: a loading row (a Spinner and `loadingText`) takes their place after a short wait (300 ms,
   * Spinner's `delay="short"`), and the menu is `aria-busy`.
   */
  loading?: boolean;
  /** The loading row's words. Defaults to "Loading". */
  loadingText?: ReactNode;
  /**
   * The row shown when the menu has no rows. Name what's missing ("No teams yet"). Defaults to "No items"; `null` shows
   * nothing, for a host that fills the menu only while it is open (Context menu).
   */
  emptyText?: ReactNode;
}

/** The loading row: it keeps its place while it waits, then shows the Spinner and the words together. */
function MenuLoadingRow({ children }: { children: ReactNode }) {
  const shown = useLoadingDelay("short");
  return (
    <div className="area-menu__loading" {...(shown ? {} : { "data-waiting": "" })}>
      <span className="area-menu__icon" aria-hidden="true"><Spinner size="sm" /></span>
      <span className="area-menu__text">{children}</span>
    </div>
  );
}

/* What the menu lists: its rows, or the loading or empty row in their place; and the header and footer around them. */
function menuBody(children: ReactNode, loading: boolean | undefined, loadingText: ReactNode, emptyText: ReactNode) {
  if (loading) return <MenuLoadingRow>{loadingText}</MenuLoadingRow>;
  if (Children.toArray(children).length === 0 && emptyText != null && emptyText !== false) return <div className="area-menu__empty"><span className="area-menu__text">{emptyText}</span></div>;
  return children;
}
const menuRegion = (part: "header" | "footer", content: ReactNode) => content == null || content === false ? null
  : <div className={`area-menu__${part}`}>{typeof content === "string" ? <MenuLabel>{content}</MenuLabel> : content}</div>;

const menuItemsOf = (menu: HTMLElement) =>
  [...menu.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([disabled]):not([aria-disabled="true"]:not([data-inactive]))')]
    .filter(item => item.closest('[role="menu"]') === menu);

export const Menu = /* @__PURE__ */ forwardRef<HTMLDivElement, MenuProps>(function Menu({ trigger, open, defaultOpen, onOpenChange, side, align, offset, tooltip, header, footer, loading, loadingText = "Loading", emptyText = "No items", className, onKeyDown, children: rows, ...rest }, ref) {
  const typeahead = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const body = menuBody(rows, loading, loadingText, emptyText);
  const top = menuRegion("header", header), bottom = menuRegion("footer", footer);
  const framed = top !== null || bottom !== null;
  const busy = loading ? { "aria-busy": true as const } : {};
  if (trigger !== undefined) {
    // The consumer's handlers run first and can cancel the menu's own; a consumer's name wins
    // over the trigger's (audit D-12: they used to be overwritten).
    const surface = (extra: Div & { ref?: Ref<HTMLDivElement> }) => {
      const chain = <E extends { defaultPrevented: boolean }>(theirs: ((event: E) => void) | undefined, ours: ((event: E) => void) | undefined) =>
        theirs && ours ? (event: E) => { theirs(event); if (!event.defaultPrevented) ours(event); } : theirs ?? ours;
      const own = {
        "aria-labelledby": rest["aria-labelledby"] ?? (rest["aria-label"] ? undefined : extra["aria-labelledby"]),
        onKeyDown: chain(onKeyDown, extra.onKeyDown), onClick: chain(rest.onClick, extra.onClick), onPointerMove: chain(rest.onPointerMove, extra.onPointerMove),
        ref: (node: HTMLDivElement | null) => { assignRef(ref, node); assignRef(extra.ref as never, node); },
      };
      // An anchored menu can outgrow the room beside its trigger, so it scrolls as a Scroll area
      // (docs/specs/scroll-area.md, "Adoption"); focus stays on its items, so the scroller is no Tab stop.
      // With a header or footer, only the rows scroll: the frame holds the three, the Scroll area the rows (V5).
      if (framed) return <div role="menu" className={menuVariants({}, className)} {...busy} {...rest} {...extra} {...own}>
        {top}<ScrollArea className="area-menu__list" viewportProps={{ tabIndex: undefined }}>{body}</ScrollArea>{bottom}
      </div>;
      return <ScrollArea role="menu" className={menuVariants({}, className)} {...busy} {...rest} {...extra} viewportProps={{ tabIndex: undefined }} {...own}>{body}</ScrollArea>;
    };
    // The tooltip takes the trigger after the menu has, so both sets of handlers and refs compose.
    const wrapTrigger = tooltip == null ? undefined : (menuTrigger: ReactNode) => <Tooltip side="bottom" trigger={menuTrigger}>{tooltip}</Tooltip>;
    return <AnchoredMenu trigger={trigger} open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} side={side} align={align} offset={offset} id={rest.id} surface={surface} wrapTrigger={wrapTrigger} />;
  }
  /* A hosted menu: Up/Down move between items (wrapping), Home/End jump to the ends and a
     printable key moves to the next item starting with it, as in the WAI menu pattern. */
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
        // One typeahead window for every list (audit D-11): 1s, as Radix and React Aria.
        timer.current = setTimeout(() => { typeahead.current = ""; }, TYPEAHEAD_RESET);
        next = [...items.slice(index + 1), ...items.slice(0, index + 1)]
          .find(item => (item.textContent ?? "").trim().toLocaleLowerCase().startsWith(typeahead.current));
    }
    if (!next) return;
    event.preventDefault();
    next.focus();
  };
  return <div ref={ref} role="menu" className={menuVariants({}, className)} onKeyDown={handleKeyDown} {...busy} {...rest}>
    {framed ? <>{top}<div className="area-menu__list">{body}</div>{bottom}</> : body}
  </div>;
});

/** A non-interactive heading that names the following group of menu items. */
export const MenuLabel = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function MenuLabel({ className, children, ...rest }, ref) {
  // The text has its own element so the label can take the rows' text inset (inset.css).
  return <div ref={ref} className={cx("area-menu__label", className)} {...rest}><span className="area-menu__label-text">{children}</span></div>;
});

/** A visual and semantic boundary between related groups of menu actions. */
export const MenuSeparator = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function MenuSeparator({ className, ...rest }, ref) {
  return <div ref={ref} role="separator" className={cx("area-menu__separator", className)} {...rest} />;
});

export interface MenuSubProps extends Omit<Div, "children"> {
  /** The row's label. */
  label: ReactNode;
  /** A leading icon in the row's icon box. */
  icon?: ReactNode;
  disabled?: boolean;
  /** The submenu's rows. */
  children: ReactNode;
}

/**
 * A row that opens a nested menu beside it (audit D-10 A, owner 2026-09-30): `aria-haspopup`,
 * Right (Left in right-to-left), Enter or Space opens it on its first row, Left or Escape closes
 * it back to the row, and the pointer opens it on hover. It is a nested `popover="auto"`, so
 * Escape and an outside press close the innermost menu first, and closing the parent closes it.
 * The trailing chevron points along the reading direction.
 */
export const MenuSub = /* @__PURE__ */ forwardRef<HTMLDivElement, MenuSubProps>(function MenuSub(
  { label, icon, disabled, className, children, ...rest }, ref,
) {
  const id = useId();
  const row = useRef<HTMLButtonElement | null>(null);
  const surfaceNode = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useOpenState(undefined, false, undefined);
  const entry = useRef(false);
  useNativePopover(surfaceNode, row, open, setOpen);
  // Beside the parent menu, 4 from its edge as every menu from its trigger, with the first row
  // level with this one (the submenu's own 4px padding is taken out).
  useAnchoredPosition(row, surfaceNode, open, {
    side: "right", align: "start", offset: MENU_OFFSET, padding: OVERLAY_PADDING,
    anchorRect: node => {
      const own = node.getBoundingClientRect();
      const menu = node.closest("[role='menu']")?.getBoundingClientRect() ?? own;
      const inset = surfaceNode.current ? parseFloat(getComputedStyle(surfaceNode.current).paddingTop) + parseFloat(getComputedStyle(surfaceNode.current).borderTopWidth) : 0;
      return { x: menu.x, y: own.y - inset, width: menu.width, height: own.height };
    },
  });
  useEffect(() => {
    if (!open || !entry.current) return;
    entry.current = false;
    surfaceNode.current?.querySelector<HTMLElement>("[role^='menuitem']:not(:disabled, [aria-disabled='true'])")?.focus({ preventScroll: true });
  }, [open]);
  // Moving to another row of the parent menu closes the submenu (hover intent without a delay).
  useEffect(() => {
    if (!open) return;
    const parent = row.current?.closest("[role='menu']");
    if (!parent) return;
    const onFocusIn = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target !== row.current && target.closest("[role='menu']") === parent) setOpen(false);
    };
    parent.addEventListener("focusin", onFocusIn);
    return () => parent.removeEventListener("focusin", onFocusIn);
  }, [open]);
  const rtl = () => row.current ? getComputedStyle(row.current).direction === "rtl" : false;
  const openKey = () => (rtl() ? "ArrowLeft" : "ArrowRight");
  const closeKey = () => (rtl() ? "ArrowRight" : "ArrowLeft");
  return <>
    <button ref={row} type="button" role="menuitem" className="area-menu__item area-menu__item--sub" aria-haspopup="menu" aria-expanded={open}
      aria-controls={id} disabled={disabled} data-keep-open="" {...(disabled ? { "data-disabled": "" } : {})}
      onClick={() => { entry.current = true; setOpen(true); }}
      onPointerEnter={event => { if (event.pointerType === "mouse" && !disabled) setOpen(true); }}
      onKeyDown={event => {
        if (disabled) return;
        if (event.key === openKey() || event.key === "Enter" || event.key === " ") {
          event.preventDefault(); event.stopPropagation(); entry.current = true; setOpen(true);
          if (open) surfaceNode.current?.querySelector<HTMLElement>("[role^='menuitem']:not(:disabled)")?.focus({ preventScroll: true });
        }
      }}>
      {icon ? <span className="area-menu__icon" aria-hidden="true">{icon}</span> : null}
      <span className="area-menu__text">{label}</span>
      <span className="area-menu__sub-chevron" aria-hidden="true"><Glyph name="chevron-down" /></span>
    </button>
    <Menu ref={node => { surfaceNode.current = node; assignRef(ref, node); }} id={id} popover="auto" tabIndex={-1} aria-label={typeof label === "string" ? label : undefined}
      className={className} {...rest}
      onKeyDown={event => {
        if (event.key !== "Escape" && event.key !== closeKey()) return;
        if ((event.target as HTMLElement).closest("[role='menu']") !== event.currentTarget) return;
        event.preventDefault(); event.stopPropagation();
        setOpen(false);
        row.current?.focus({ preventScroll: true });
      }}>
      {children}
    </Menu>
  </>;
});

/** A floating search field and its related menu, outside the menu's action-list semantics. */
/**
 * @deprecated A searchable list is a Combobox (a field that filters a list) or a Command palette
 * (a filtered command list); both own active-descendant keys this surface never had (audit D-22).
 * Kept so existing markup renders.
 */
export const MenuSearch = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function MenuSearch({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-menu__search-surface", className)} {...rest} />;
});

export interface MenuItemProps extends HTMLAttributes<HTMLButtonElement> {
  tone?: (typeof MANIFESTS.menu.elementModifiers.item)[number];
  shortcut?: ReactNode;
  disabled?: boolean;
  /**
   * Makes the row a checkable item (`role="menuitemcheckbox"`). The whole row is the control:
   * toggle `checked` in `onClick`. Hosts keep the menu open for checkbox rows and close it for
   * a radio choice, as for an action (audit D-11).
   */
  checked?: boolean;
  /** With `checked`, makes the row one choice of several (`role="menuitemradio"`), as a mode or model menu. */
  radio?: boolean;
  /** How a checkable row shows its state: a trailing check (default) or a switch, as Notion's toggles. */
  indicator?: "check" | "switch";
  /** A muted note under the label (a model's summary, a setting's effect). */
  description?: ReactNode;
  /** A leading icon in the row's icon box, as NavItem, Tabs and CommandItem take (audit S17, D-18). */
  icon?: ReactNode;
  /**
   * Pushed to the row's end, before the shortcut: a count, a badge, a status (components audit 2026-11-07, O7), as Nav
   * item's, Tabs items' and Tree view nodes' `trailing`. Muted, in the row's type.
   */
  trailing?: ReactNode;
  /**
   * Choosing the row leaves the menu open (`data-keep-open`), for a menu of view options whose
   * effect shows behind it (sort, group, show); a menu of commands closes (docs/PRODUCT_UI.md).
   * Checkbox rows always stay open.
   */
  keepOpen?: boolean;
  /**
   * Can't act now, for a reason that will pass or that the person can change (components audit V2, 2026-11-07): drawn
   * as disabled, but the arrows, typeahead and the pointer still reach it, so it can say why in `inactiveText`.
   * Choosing it does nothing and leaves the menu open (`aria-disabled`). `disabled` is for a row that truly can't act.
   */
  inactive?: boolean;
  /** Why an inactive row can't act ("Upgrade to export"), in its note under the label, in place of `description`, and as its accessible description. */
  inactiveText?: ReactNode;
}

/** A string shortcut's keys: each leading modifier glyph on its own, then the rest as written ("⌘⇧P" → ⌘, ⇧, P). */
const MODIFIER_GLYPHS = "⌘⇧⌥⌃";
function shortcutKeys(text: string) {
  const keys: string[] = [];
  let rest = text;
  while (rest.length > 1 && MODIFIER_GLYPHS.includes(rest[0]!)) { keys.push(rest[0]!); rest = rest.slice(1); }
  return rest ? [...keys, rest] : keys;
}

export const MenuItem = /* @__PURE__ */ forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  { tone, shortcut, disabled, checked, radio, indicator = "check", description: descriptionProp, icon, trailing, keepOpen, inactive: inactiveProp, inactiveText, className, children, onClick, ...rest },
  ref,
) {
  const checkable = checked !== undefined;
  const reasonId = useId();
  // Disabled wins: a native disabled row can't take focus, so it can't be inactive.
  const inactive = Boolean(inactiveProp) && !disabled;
  const reason = inactive && inactiveText != null && inactiveText !== false;
  // The reason is the row's note and its description, said once: hidden from the row's name, read through describedby.
  const description = reason ? <span id={reasonId} aria-hidden="true">{inactiveText}</span> : descriptionProp;
  return (
    <button
      ref={ref}
      type="button"
      role={checkable ? (radio ? "menuitemradio" : "menuitemcheckbox") : "menuitem"}
      aria-checked={checkable ? checked : undefined}
      className={cx("area-menu__item", tone === "danger" && "area-menu__item--danger", className)}
      disabled={disabled}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...(keepOpen || inactive ? { "data-keep-open": "" } : {})}
      {...(inactive ? { "data-inactive": "", "aria-disabled": true } : {})}
      onClick={inactive ? event => event.preventDefault() : onClick}
      {...(reason ? { ...rest, "aria-describedby": [rest["aria-describedby"], reasonId].filter(Boolean).join(" ") } : rest)}
    >
      {icon ? <span className="area-menu__icon" aria-hidden="true">{icon}</span> : null}
      {description ? <span className="area-menu__lines"><span className="area-menu__text">{children}</span><span className="area-menu__description">{description}</span></span>
        : icon || typeof children === "string" || typeof children === "number" ? <span className="area-menu__text">{children}</span> : children}
      {/* Every key is a keycap (owner, 2026-10-22): a string shortcut is set in the small keycaps, its leading modifier
          glyphs each their own key and the rest verbatim ("⌘L" → ⌘ · L), as a Kbd passed in draws it (visual pass
          2026-10-26: "⌘L" set as one cap beside Kbd's "⌘ K" read as two spacings in one menu). The row hides a Kbd's
          spoken chord anyway; the item carries aria-keyshortcuts. */}
      {trailing != null && trailing !== false ? <span className="area-menu__trailing">{trailing}</span> : null}
      {shortcut ? <span className="area-menu__shortcut">{typeof shortcut === "string"
        ? <span className="area-kbd area-kbd--sm area-kbd--default">{shortcutKeys(shortcut).map((key, i) => <kbd key={i} className="area-kbd__key">{key}</kbd>)}</span> : shortcut}</span> : null}
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
  /** The toast's actions (an Undo, a View), in its `__actions` part, as Alert's (components audit 2026-11-07, O7). */
  actions?: ReactNode;
  /** @deprecated Use `actions` (2026-11-07). Kept for one release; `actions` wins. */
  action?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Announces itself: `status`, or `alert` for danger as Alert does (audit E-11). A Toaster turns
   * this off and says the toast through the shared announcer (`announce`, components audit D1). */
  live?: boolean;
}

export const Toast = /* @__PURE__ */ forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { tone = "neutral", icon, title, actions: actionsProp, action, onDismiss, dismissLabel = "Dismiss notification", live = true, className, children, ...rest },
  ref,
) {
  const actions = actionsProp ?? action;
  return (
    <div ref={ref} className={toastVariants({ tone }, className)} {...rest}>
      {icon ? (
        <span className="area-toast__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="area-toast__content" role={live ? (tone === "danger" ? "alert" : "status") : undefined} aria-atomic={live || undefined}>{title ? <div className="area-toast__title">{title}</div> : null}<div className={title ? "area-toast__description" : undefined}>{children}</div></div>
      {actions ? <div className="area-toast__actions">{actions}</div> : null}
      {onDismiss ? <span className="area-toast__dismiss"><Button size="sm" variant="ghost" tone="neutral" iconOnly icon={<Glyph name="dismiss" />} aria-label={dismissLabel} onClick={onDismiss} /></span> : null}
    </div>
  );
});

/* --- Tabs ----------------------------------------------------------------- */

/*
 * One indicator slides to the chosen tab (docs/MOTION.md, "Tabs / Segmented indicator"; Segmented's plate since
 * 2026-10-24, Radix's and Primer's underline): the list measures the selected tab and draws the bar under it
 * (`data-indicator`, `--_ind-x` / `-y` / `-w` / `-h`, the tab's box in the list's own layout pixels), so a change
 * moves the bar rather than fading one out and another in. Until it has measured (and in static markup) each tab draws its
 * own bar, as before.
 */
function useTabIndicator(list: { current: HTMLElement | null }, buttons: { current: Map<string, HTMLButtonElement> }, selected: string | undefined, key: unknown) {
  useLayoutEffect(() => {
    const host = list.current;
    if (!host) return;
    const place = () => {
      const tab = selected === undefined ? undefined : buttons.current.get(selected);
      if (!tab || tab.offsetParent !== host) { host.removeAttribute("data-indicator"); return; }
      // The tab's exact box (its width is fractional with the text), in the list's own pixels whatever scale or zoom
      // it is drawn at, from the list's scrolled origin.
      const outer = host.getBoundingClientRect(), inner = tab.getBoundingClientRect();
      const laidOut = host.offsetWidth;
      const factor = laidOut ? outer.width / laidOut : 1;
      host.style.setProperty("--_ind-x", `${(inner.left - outer.left) / factor - host.clientLeft + host.scrollLeft}px`);
      host.style.setProperty("--_ind-y", `${(inner.top - outer.top) / factor - host.clientTop + host.scrollTop}px`);
      host.style.setProperty("--_ind-w", `${inner.width / factor}px`);
      host.style.setProperty("--_ind-h", `${inner.height / factor}px`);
      host.setAttribute("data-indicator", "");
    };
    place();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    observer?.observe(host);
    for (const tab of buttons.current.values()) observer?.observe(tab);
    return () => observer?.disconnect();
  }, [selected, key]);
}

/**
 * One tab. It is keyed by `value`, as Segmented's, Toggle group's and Custom select's items are (components audit
 * 2026-11-07, O7); `id` is the deprecated key, still read for one release.
 */
export type TabsItem = { label: ReactNode; icon?: ReactNode; trailing?: ReactNode; disabled?: boolean; content?: ReactNode;
  /** How what the tab holds changed: its label takes the change's ink and the word is read out (components audit D6). */
  status?: ChangeStatusInput;
  /** Changed since it was last looked at: a dot after the label, apart from the status. */
  unseen?: boolean }
  & ({ value: string; /** @deprecated Use `value`. */ id?: string } | { /** @deprecated Use `value`. */ id: string; value?: undefined });

export interface TabsProps extends Omit<Div, "defaultValue"> {
  /** The tabs, in order. Collections are `items` everywhere (audit H-14). */
  items?: TabsItem[];
  /** @deprecated Use `items`. */
  tabs?: TabsItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;
  /** Names the tab list (default "Views"). */
  "aria-label"?: string;
  /** @deprecated Use `aria-label`. Accessible names follow one rule (audit D-18, A-17): `aria-label` names the component's own element, `<part>Label` names a sub-part, and `label` is visible text. */
  label?: string;
  size?: VariantProps<typeof MANIFESTS.tabs>["size"];
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  track?: boolean;
}

export const Tabs = /* @__PURE__ */ forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, tabs: legacyTabs, value: controlledValue, defaultValue, onValueChange, "aria-label": ariaLabel, label, size = "md", orientation = "horizontal", activationMode = "automatic", track, className, children, ...rest },
  ref,
) {
  // Each tab's key: its value, else its deprecated id.
  const source = items ?? legacyTabs ?? NO_ITEMS;
  const tabs = useMemo(() => source.map(tab => ({ ...tab, id: (tab.value ?? tab.id)! })), [source]);
  const id = useId();
  const [localValue, setLocalValue] = useState(defaultValue ?? tabs.find(tab => !tab.disabled)?.id);
  const candidate = controlledValue ?? localValue;
  const value = tabs.find(tab => tab.id === candidate && !tab.disabled)?.id ?? tabs.find(tab => !tab.disabled)?.id;
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const list = useRef<HTMLDivElement>(null);
  useTabIndicator(list, buttons, value, tabs);
  const select = (next: string, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => {
    if (controlledValue === undefined) setLocalValue(next);
    onValueChange?.(next, event);
  };
  return (
    <div ref={ref} className={tabsVariants({ size, track, orientation: orientation === "vertical" ? orientation : undefined }, className)} {...rest}>
      <div ref={list} className="area-tabs__list" role="tablist" aria-label={ariaLabel ?? label ?? "Views"} aria-orientation={orientation}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${id}-tab-${tab.id}`}
            ref={node => { if (node) buttons.current.set(tab.id, node); else buttons.current.delete(tab.id); }}
            aria-selected={tab.id === value}
            aria-controls={`${id}-panel-${tab.id}`}
            onClick={event => select(tab.id, event)}
            onKeyDown={event => {
              const keys = orientation === "vertical" ? ["ArrowUp", "ArrowDown", "Home", "End"] : ["ArrowLeft", "ArrowRight", "Home", "End"];
              if (!keys.includes(event.key)) return;
              event.preventDefault();
              const enabled = tabs.filter(item => !item.disabled);
              const index = enabled.findIndex(item => item.id === tab.id);
              const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
              const step = (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) * (orientation === "horizontal" && rtl ? -1 : 1);
              const next = enabled[event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (index + step + enabled.length) % enabled.length];
              if (next) { if (activationMode === "automatic") select(next.id, event); buttons.current.get(next.id)?.focus(); }
            }}
            // Only the selected tab is in the tab order; arrow keys move between them.
            tabIndex={tab.id === value ? 0 : -1}
            disabled={tab.disabled}
            className="area-tabs__tab"
            {...(tab.id === value ? { "data-selected": "" } : {})}
            {...(tab.disabled ? { "data-disabled": "" } : {})}
            data-status={changeStatus(tab.status)}
          >
            {tab.icon ? <span className="area-tabs__icon" aria-hidden="true">{tab.icon}</span> : null}
            {/* The hidden strong copy reserves the selected width, so selecting a tab never moves the row. */}
            <span className="area-tabs__label">{tab.label}<span className="area-tabs__reserve" aria-hidden="true">{tab.label}</span></span>
            {tab.status ? <span className="area-sr-only">{` ${CHANGE_MARK[changeStatus(tab.status)].word}`}</span> : null}
            {tab.unseen ? <span className="area-tabs__unseen"><span className="area-sr-only"> Unseen</span></span> : null}
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

const dialogVariants = /* @__PURE__ */ createVariants(MANIFESTS.dialog);

export interface DialogProps extends Omit<Div, "title" | "onClose"> {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  /**
   * The width (components audit V1, 2026-11-07), as Drawer's `size`: sm 384 (Drawer's sm), md 480 (default, Drawer's md),
   * lg 720 for a table or two columns, xl 880 for a settings dialog with its own sidebar. Never wider than the screen
   * less 32.
   */
  size?: VariantProps<typeof MANIFESTS.dialog>["size"];
  /**
   * Takes the tallest height the screen allows (the screen less 64), whatever its content, so a dialog whose content
   * changes (tabs, a search, steps) doesn't jump. The body takes the room and scrolls.
   */
  fullHeight?: boolean;
  /** Shows the corner close control. On by default. */
  showCloseButton?: boolean;
  /** Called by the close control before closing an enclosing native dialog. */
  onDismiss?: () => void;
  /** Accessible name for the close control. */
  dismissLabel?: string;
  /** @deprecated Use `onDismiss` (audit S9: one dismiss API). */
  onClose?: () => void;
  /**
   * Opens the dialog as a native modal (`showModal()`) when this element is clicked. The
   * platform supplies the focus trap, Escape, the backdrop and focus return; a click on the
   * backdrop also closes it.
   */
  trigger?: ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void }>;
  /**
   * Opens the native modal without a trigger, or controls one that has a trigger: a menu item
   * that asks for confirmation (audit S17, E-6). Escape, the close control and the backdrop
   * report `false` through `onOpenChange`.
   */
  open?: boolean;
  defaultOpen?: boolean;
  /** Called when the modal opens or closes. */
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
  { title, description, footer, size, fullHeight, showCloseButton = true, onDismiss, dismissLabel = "Close dialog", onClose, trigger, open: openProp, defaultOpen, onOpenChange, className, children, ...rest },
  ref,
) {
  const id = useId();
  const modal = useRef<HTMLDialogElement | null>(null);
  // A rule under the header once the body has scrolled (`data-scrolled`, V1): the header then reads as fixed above
  // content passing under it. Set from the body's scroll position; React skips the render when it doesn't change.
  const [scrolled, setScrolled] = useState(false);
  const backdropPress = useRef(false);
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const isModal = trigger !== undefined || openProp !== undefined || defaultOpen !== undefined;
  useEffect(() => {
    const node = modal.current;
    if (!node || typeof node.showModal !== "function") return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);
  // The name belongs to the element with the dialog role: the surface inline, the native
  // <dialog> with a trigger. A consumer's aria-label names a dialog without a title.
  const { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, role, ...surfaceRest } = rest;
  // `role="alertdialog"` (a confirmation) lands on the element that carries the dialog role.
  const labelled = {
    role,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy ?? (title ? `${id}-title` : undefined),
    "aria-describedby": ariaDescribedBy ?? (description ? `${id}-description` : undefined),
  };
  const surface = (
    <div
      ref={ref}
      {...(isModal ? {} : { role: role ?? "dialog", "aria-modal": "true" as const, "aria-label": ariaLabel, "aria-labelledby": labelled["aria-labelledby"], "aria-describedby": labelled["aria-describedby"] })}
      className={dialogVariants({ size, fullHeight }, className)}
      {...(scrolled ? { "data-scrolled": "" } : {})}
      {...surfaceRest}
    >
      {title || description || showCloseButton ? (
        <div className="area-dialog__header">
          <div className="area-dialog__heading">
            {title ? <h2 className="area-dialog__title" id={`${id}-title`}>{title}</h2> : null}
            {description ? <p className="area-dialog__description" id={`${id}-description`}>{description}</p> : null}
          </div>
          {showCloseButton ? <Button variant="ghost" tone="neutral" size="md" iconOnly className="area-dialog__dismiss" aria-label={dismissLabel} icon={<Glyph name="dismiss" />} onClick={event => {
            (onDismiss ?? onClose)?.();
            event.currentTarget.closest("dialog")?.close();
          }} /> : null}
        </div>
      ) : null}
      {children ? <div className="area-dialog__body" onScroll={event => setScrolled(event.currentTarget.scrollTop > 0)}>{children}</div> : null}
      {footer ? <div className="area-dialog__footer">{footer}</div> : null}
    </div>
  );
  if (!isModal) return surface;
  const modalId = `${id}-modal`;
  return (
    <>
      {trigger ? cloneElement(trigger, {
        "aria-haspopup": "dialog",
        "aria-controls": modalId,
        onClick: (event: MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          if (event.defaultPrevented || modal.current?.open) return;
          setOpen(true);
        },
      } as Record<string, unknown>) : null}
      <dialog
        ref={modal}
        id={modalId}
        className="area-dialog__modal"
        {...labelled}
        onClose={() => { if (open) setOpen(false); }}
        // A click whose target is the <dialog> itself landed on the backdrop: the surface fills it.
        // A backdrop press closes only when it also began on the backdrop: a drag out of the
        // surface that ends on the scrim no longer closes the dialog (audit E-20).
        onPointerDown={event => { backdropPress.current = event.target === event.currentTarget; }}
        onClick={event => { if (event.target === event.currentTarget && backdropPress.current) event.currentTarget.close(); backdropPress.current = false; }}
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
  /** The choices. Collections are `items` everywhere (audit H-14). */
  items?: Array<{ value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean }>;
  /** @deprecated Use `items`. */
  options?: Array<{ value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean }>;
  value?: string;
  defaultValue?: string;
  /** @deprecated Use `aria-label`, which names the radio group. Accessible names follow one rule (audit D-18, A-17): `aria-label` names the component's own element, `<part>Label` names a sub-part, and `label` is visible text. */
  label?: string;
  /** Called with the chosen value and the click or key event that chose it (audit S17). */
  onValueChange?: (value: string, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;
  /** @deprecated Use `onValueChange`. */
  onSelect?: (value: string) => void;
  /** Submits the value with a form, as AlignmentPicker and ColorSwatchPicker do. */
  name?: string;
  form?: string;
  /** Disables every option. */
  disabled?: boolean;
}

/**
 * Picks one value from a small set.
 *
 * Uses `role="radiogroup"` rather than a list of toggle buttons, because the choice is
 * exclusive — which is the distinction a screen reader needs and `aria-pressed` does not
 * convey.
 */
export const Segmented = /* @__PURE__ */ forwardRef<HTMLDivElement, SegmentedProps>(function Segmented(
  { size: sizeProp, fullWidth, iconOnly, items, options: legacyOptions, value: controlledValue, defaultValue, label, onValueChange, onSelect, name, form, disabled, className, ...rest },
  ref,
) {
  const options = items ?? legacyOptions ?? NO_ITEMS;
  const toolbarSize = useContext(ToolbarSize);
  const size = sizeProp ?? toolbarSize;
  const [localValue, setLocalValue] = useState(defaultValue ?? options.find(option => !option.disabled)?.value);
  const initial = useRef(localValue);
  const hidden = useRef<HTMLInputElement | null>(null);
  // A form reset returns an uncontrolled control to its first value, as the pickers do (audit C-9).
  useEffect(() => {
    const owner = hidden.current?.form;
    if (!owner || controlledValue !== undefined) return;
    const reset = (event: Event) => queueMicrotask(() => { if (!event.defaultPrevented) setLocalValue(initial.current); });
    owner.addEventListener("reset", reset);
    return () => owner.removeEventListener("reset", reset);
  }, [controlledValue]);
  const value = controlledValue ?? localValue;
  const entry = options.find(option => option.value === value && !option.disabled) ?? options.find(option => !option.disabled);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  // In a toolbar every option is a roving item: the toolbar's arrows move focus across the
  // options and the other commands, Space or Enter chooses (WAI-ARIA toolbar with a radio group).
  const inToolbar = useContext(InToolbar);
  const select = (next: string, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => {
    if (controlledValue === undefined) setLocalValue(next);
    onValueChange?.(next, event);
    onSelect?.(next);
  };
  // One plate slides to the chosen option (docs/MOTION.md, "Tabs / Segmented indicator"; owner, 2026-10-24: subtle
  // motion): the track measures the selected option and paints the plate behind it (`data-plate`), so it moves rather
  // than jumping. Until it has measured (and in static markup) each option paints its own plate, as before.
  const track = useRef<HTMLDivElement | null>(null);
  const selectedValue = entry && entry.value === value ? entry.value : undefined;
  useLayoutEffect(() => {
    const host = track.current;
    if (!host) return;
    const place = () => {
      const button = selectedValue === undefined ? undefined : buttons.current.get(selectedValue);
      if (!button) { host.removeAttribute("data-plate"); return; }
      const outer = host.getBoundingClientRect(), inner = button.getBoundingClientRect();
      // Offsets in the track's own pixels, whatever scale or zoom it is drawn at.
      const laidOut = parseFloat(getComputedStyle(host).width);
      const factor = laidOut ? outer.width / laidOut : 1;
      host.style.setProperty("--_plate-x", `${(inner.left - outer.left) / factor - host.clientLeft}px`);
      host.style.setProperty("--_plate-w", `${inner.width / factor}px`);
      host.setAttribute("data-plate", "");
    };
    place();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    observer?.observe(host);
    for (const button of buttons.current.values()) observer?.observe(button);
    return () => observer?.disconnect();
  }, [selectedValue, options]);
  return (
    <div
      ref={node => { track.current = node; assignRef(ref, node); }}
      role="radiogroup"
      aria-label={rest["aria-label"] ?? label}
      aria-disabled={disabled || undefined}
      className={segmentedVariants({ size, fullWidth, iconOnly }, className)}
      {...rest}
    >
      {options.map((option) => {
        const button = (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          disabled={disabled || option.disabled}
          className="area-segmented__item"
          ref={node => { if (node) buttons.current.set(option.value, node); else buttons.current.delete(option.value); }}
          {...(inToolbar ? toolbarItemProps : { tabIndex: option.value === entry?.value ? 0 : -1 })}
          onClick={event => select(option.value, event)}
          onKeyDown={event => {
            if (inToolbar) return;
            if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const enabled = options.filter(item => !item.disabled);
            const index = enabled.findIndex(item => item.value === option.value);
            const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
            const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : (event.key === "ArrowRight" ? 1 : -1) * (rtl ? -1 : 1);
            const next = enabled[event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (index + step + enabled.length) % enabled.length];
            if (next) { select(next.value, event); buttons.current.get(next.value)?.focus(); }
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
        );
        // An icon-only option names itself in an Area Tooltip, its label (product UI rule 4,
        // docs/PRODUCT_UI.md); the label is already its name, so the tooltip only shows.
        return iconOnly ? <Tooltip key={option.value} side="bottom" describes={false} trigger={button}>{option.label}</Tooltip> : button;
      })}
      {name ? <input ref={hidden} type="hidden" name={name} form={form} disabled={disabled} value={value ?? ""} /> : null}
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

/** A line's change, in the shared change words (components audit D6); `removed` is the deprecated spelling of `deleted`. */
export type CodeLineMark = "added" | "deleted" | "removed";

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
  /** Called with the chosen language and the click, key or change that chose it (audit S17: one change name). */
  onValueChange?: (language: string, event: SyntheticEvent) => void;
  /** @deprecated Use `onValueChange`. */
  onLanguageChange?: (language: string) => void;
  /** Line numbers. On by default; turn them off for a short excerpt. */
  lineNumbers?: boolean;
  /** Lines to emphasise, as numbers or a range string such as `"3, 5-7"`. */
  highlightLines?: number[] | string;
  /** Added and deleted lines, keyed by line number. */
  marks?: Record<number, CodeLineMark>;
  /** Makes each line number a link to its own line, so a reference can be shared. */
  linkLines?: boolean;
  /** Shows the show/hide control over an excerpt. */
  collapsible?: boolean;
  /** Starts collapsed. Only meaningful with `collapsible`. */
  defaultCollapsed?: boolean;
  /** How many lines a collapsed block shows. Default 8. */
  collapsedLines?: number;
  /**
   * A prompt shown before the first line, muted and left out of the copy, for a command (`"$"`). Continued lines hang
   * under the command's first character.
   */
  prompt?: string;
  /** `soft` is a fill with no edge, the soft fields' look, for code in a panel whose fields are soft. */
  variant?: "outline" | "soft";
  /** The floating copy and actions show only while the block is hovered or holds focus (always on touch). */
  revealActions?: boolean;
  /** Built-in copy control. On by default. */
  copyable?: boolean;
  copyLabel?: string;
  /** Names the language switcher (tabs or Select); localise with the rest (audit H-27). */
  languageLabel?: string;
  /** Extra actions beside the copy control. Adds the header row when there is no title. */
  actions?: ReactNode;
  /** Remove the surrounding border when embedded in another framed surface. */
  flush?: boolean;
  /** Wrap long code lines instead of scrolling horizontally. */
  wrap?: boolean;
  /** `sm` is the inspector's code well: 12px code on 18px lines with 8px insets. */
  size?: "sm" | "md";
}

export const CodeBlock = /* @__PURE__ */ forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  {
    flush,
    wrap,
    size = "md",
    title,
    language,
    languages,
    languageTabs,
    value,
    onValueChange,
    onLanguageChange,
    lineNumbers = true,
    highlightLines,
    marks,
    linkLines,
    collapsible,
    defaultCollapsed,
    collapsedLines,
    prompt,
    variant,
    revealActions,
    copyable = true,
    copyLabel = "Copy code",
    languageLabel = "Language",
    actions,
    html,
    code,
    className,
    style,
    ...rest
  },
  ref,
) {
  if (collapsedLines !== undefined && (!Number.isFinite(collapsedLines) || collapsedLines < 1)) throw new RangeError("CodeBlock: collapsedLines must be a finite number of at least 1.");
  // A fragment has to be a plain token, so punctuation from useId is dropped rather than
  // escaped; uniqueness survives because nothing else about the id changes.
  const id = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const source = useRef<HTMLElement>(null);
  const tabButtons = useRef(new Map<string, HTMLButtonElement>());
  const tabList = useRef<HTMLDivElement>(null);
  const [localLanguage, setLocalLanguage] = useState(() => value ?? languages?.[0]);
  const [collapsed, setCollapsed] = useState(Boolean(defaultCollapsed));

  const activeLanguage = value ?? localLanguage ?? languages?.[0];
  useTabIndicator(tabList, tabButtons, languageTabs ? activeLanguage : undefined, languages);
  const highlighted = parseLineNumbers(highlightLines);
  const lines = (html ?? code ?? "").split("\n");

  const selectLanguage = (next: string, event: SyntheticEvent) => {
    if (value === undefined) setLocalLanguage(next);
    onValueChange?.(next, event);
    onLanguageChange?.(next);
  };

  /*
   * Pre-highlighted HTML has no plain-text twin, so the copy reads it back off the rendered
   * text cells -- which is also what keeps the gutter out of the clipboard.
   */
  const read = () => {
    if (code !== undefined && html === undefined) return code;
    const node = source.current;
    if (!node) return code ?? "";
    const cells = node.querySelectorAll<HTMLElement>(".area-code-block__text");
    return cells.length ? Array.from(cells, cell => cell.textContent ?? "").join("\n") : node.textContent ?? "";
  };

  const picker = languages?.length ? (
    languageTabs ? (
      // The language switcher is Tabs sm (audit G-6 A, owner 2026-09-30): one tab language, its
      // indicator, hover, inset focus and forced-colours rule; the code body is the tab panel.
      <div className="area-tabs area-tabs--sm area-code-block__languages">
        <div ref={tabList} className="area-tabs__list" role="tablist" aria-label={languageLabel}>
        {languages.map((item, index) => {
          const selected = item === activeLanguage;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              /* Language names are the author's text, so the id is the index. */
              id={`${id}-tab-${index}`}
              className="area-tabs__tab"
              {...(selected ? { "data-selected": "" } : {})}
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
                selectLanguage(next, event);
                tabButtons.current.get(next)?.focus();
              }}
              onClick={event => selectLanguage(item, event)}
            >
              <span className="area-tabs__label">{item}<span className="area-tabs__reserve" aria-hidden="true">{item}</span></span>
            </button>
          );
        })}
        </div>
      </div>
    ) : (
      <span className="area-code-block__languages">
        <Select
          className="area-code-block__select"
          size="sm"
          aria-label={languageLabel}
          value={activeLanguage}
          onChange={event => selectLanguage(event.currentTarget.value, event)}
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
        // CopyButton (docs/specs/copy-button.md): one fixed name, the result said once through its live region
        // (audit G-21), the check shown by the glyph and `data-copy-state` as the paint hook.
        <CopyButton value={read} label={copyLabel} />
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
    ? { role: "tabpanel", id: `${id}-panel`, "aria-labelledby": `${id}-tab-${languages.indexOf(activeLanguage ?? "")}`, tabIndex: 0 }
    : {};

  return (
    <div ref={ref} className={codeBlockVariants({ size, variant, flush, wrap, unnumbered: !lineNumbers, revealActions }, className)} {...(collapsed ? { "data-collapsed": "" } : {})}
      style={collapsedLines === undefined ? style : { ...style, ["--area-code-block-lines" as string]: Math.floor(collapsedLines) }} {...rest}>
      {header}
      <div className="area-code-block__body" {...panel}>
        {/* Without the tab panel, the scrolling block itself takes focus so a keyboard can scroll it (audit G-21). */}
        <pre className="area-code-block__pre" id={`${id}-code`} {...(panel.role ? {} : { tabIndex: 0, "aria-label": typeof title === "string" ? title : "Code" })}>
          <code className="area-code-block__code" ref={source}>
          {lines.map((text, index) => {
            const number = index + 1;
            const given = marks?.[number];
            const mark = given === "removed" ? "deleted" : given;
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
                      // Out of the tab order, so a long block isn't a tab stop per line (audit G-21).
                      ? <a className="area-code-block__linenumber" href={`#${id}-L${number}`} aria-label={`Line ${number}`} tabIndex={-1}>{number}</a>
                      : lineNumbers ? <span className="area-code-block__linenumber" aria-hidden="true">{number}</span> : null}
                  </span>
                ) : null}
                  {/* Outside the text cell, so the copy (which reads the text cells) leaves it out. */}
                  {prompt ? <span className="area-code-block__prompt" aria-hidden="true">{prompt}</span> : null}
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
            // The visible label carries the state; aria-expanded on top of it said it twice (audit G-21).
            aria-controls={`${id}-code`}
            onClick={() => setCollapsed(current => !current)}
          >
            {collapsed ? "Show code" : "Hide code"}
          </button>
        ) : null}
      </div>
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
  // Written out, as ChatGPT and Notion do (audit S12b).
  escape: "Esc",
  esc: "Esc",
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
  Esc: "Escape",
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
  /** md (20px) suits standalone hints; sm (16px) fits compact control chrome. `"small"` and
   * `"normal"` are deprecated aliases (audit S17). */
  size?: VariantProps<typeof MANIFESTS.kbd>["size"] | "small" | "normal";
  /** `"default"`, the keycap everywhere, or `"on-color"` on a coloured background. `"quiet"` is deprecated and renders
   * the keycap (owner 2026-10-22: every key has its backplate); `"on-emphasis"` is a deprecated alias of `"on-color"`
   * (audit A-15). A Tooltip, a Button and a destructive menu row adapt the keycap on their own. */
  variant?: VariantProps<typeof MANIFESTS.kbd>["variant"] | "on-emphasis";
  /** @deprecated Use `variant` (audit S17). */
  appearance?: VariantProps<typeof MANIFESTS.kbd>["variant"] | "on-emphasis";
}

/**
 * Marks a keyboard shortcut.
 *
 * Renders one flat chord with one semantic element per key. The chord provides its own
 * spoken label because bare modifier glyphs are not announced usefully.
 */
export const Kbd = /* @__PURE__ */ forwardRef<HTMLElement, KbdProps>(function Kbd(
  { keys, size = "md", variant, appearance, className, ...rest },
  ref,
) {
  const tier = size === "small" ? "sm" : size === "normal" ? "md" : size;
  const rendered = keys.map((key) => KEY_GLYPHS[key.toLowerCase()] ?? key.toUpperCase());
  const spoken = rendered.map((glyph) => KEY_LABELS[glyph] ?? glyph).join(" plus ");
  const chosen = variant ?? appearance ?? "default";
  const resolvedAppearance = chosen === "on-emphasis" ? "on-color" : chosen === "quiet" ? "default" : chosen;

  return (
    <span
      ref={ref}
      className={cx("area-kbd", `area-kbd--${tier}`, `area-kbd--${resolvedAppearance}`, className)}
      {...rest}
    >
      {/* A span has no role, so an aria-label on it is not reliably announced; the spoken chord
          is visually hidden text instead, and the glyphs are hidden from assistive technology. */}
      <span className="area-sr-only">{spoken}</span>
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

/** @deprecated Use `CodeProps` with `swatch` (audit H-25). */
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
 *
 * @deprecated Use `<Code swatch>`, which renders the same element and swatch (audit H-25 A,
 * owner 2026-09-30). Token stays exported so existing markup renders.
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
