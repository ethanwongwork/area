import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
/**
 * The presentational components.
 *
 * Thin by design: each one places elements and forwards props, and contributes no styling
 * of its own. Every appearance decision lives in `@area/styles`, which is what lets a
 * consumer use the CSS without React and get an identical result.
 */
import { Children, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";
import {
  alertVariants,
  avatarVariants,
  cx,
  chipVariants,
  panelVariants,
  segmentedVariants,
  separatorVariants,
  sliderVariants,
  skeletonVariants,
  spinnerVariants,
  tableVariants,
  toastVariants,
  createVariants,
  menuVariants,
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
}

export const Separator = /* @__PURE__ */ forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={separatorVariants({ orientation }, className)}
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
}

export const Progress = /* @__PURE__ */ forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, label, className, ...rest },
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
      className={cx("area-progress", className)}
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
}

export const Panel = /* @__PURE__ */ forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { size, title, action, footer, flush, bareBar, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={panelVariants({ size, flush, bareBar }, className)} {...rest}>
      {title || action ? (
        <header className="area-panel__bar">
          <span className="area-panel__title">{title}</span>
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
}

export const PanelSection = /* @__PURE__ */ forwardRef<HTMLDivElement, PanelSectionProps>(function PanelSection(
  { heading, className, children, ...rest },
  ref,
) {
  return (
    <section ref={ref} className={cx("area-panel__section", className)} {...rest}>
      {heading ? <h3 className="area-panel__heading">{heading}</h3> : null}
      {children}
    </section>
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
  variant?: VariantProps<typeof MANIFESTS.slider>["variant"];
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
    variant,
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
        variant,
        tone,
        size,
        composition: labelPosition === "top" ? "label-top" : undefined,
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
  variant?: VariantProps<typeof MANIFESTS.chip>["variant"];
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
  { variant = "filter", size, pill, swatch, icon, avatar, image, imageAlt, selected, defaultSelected = false, onSelectedChange, onClick, onRemove, clickable, removeIcon, removeLabel = "Remove chip", invalid, swatchOnly, className, children, disabled, ...rest },
  ref,
) {
  const [localSelected, setLocalSelected] = useState(defaultSelected);
  const currentSelected = selected ?? localSelected;
  const selectable = variant === "filter";
  const primaryInteractive = selectable || clickable || Boolean(onClick);
  const classes = chipVariants({ variant, size, pill, swatchOnly }, className);
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
    <a ref={ref} className={chipVariants({ variant: "suggestion", size, pill, link: treatment === "underline", linkIcon: treatment === "icon" }, className)} {...rest}>
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
}

export const Table = /* @__PURE__ */ forwardRef<HTMLTableElement, TableProps>(function Table(
  { interactive, className, ...rest },
  ref,
) {
  return (
    <div className="area-table-wrapper">
      <table
        ref={ref}
        className={tableVariants(interactive ? { variant: "interactive" } : {}, className)}
        {...rest}
      />
    </div>
  );
});

/* --- Surfaces ------------------------------------------------------------- */

export const Tooltip = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function Tooltip({ className, ...rest }, ref) {
  return <div ref={ref} role="tooltip" className={cx("area-tooltip", className)} {...rest} />;
});

export const Popover = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function Popover({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-popover", className)} {...rest} />;
});

export interface MenuProps extends Div {
  layout?: VariantProps<typeof MANIFESTS.menu>["layout"];
  selection?: VariantProps<typeof MANIFESTS.menu>["selection"];
}
export const Menu = /* @__PURE__ */ forwardRef<HTMLDivElement, MenuProps>(function Menu({ layout, selection, className, ...rest }, ref) {
  return <div ref={ref} role="menu" className={menuVariants({ layout, selection }, className)} {...rest} />;
});

export interface MenuItemProps extends HTMLAttributes<HTMLButtonElement> {
  tone?: (typeof MANIFESTS.menu.elementModifiers.item)[number];
  shortcut?: ReactNode;
  disabled?: boolean;
}

export const MenuItem = /* @__PURE__ */ forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  { tone, shortcut, disabled, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      className={cx("area-menu__item", tone === "danger" && "area-menu__item--danger", className)}
      disabled={disabled}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...rest}
    >
      {typeof children === "string" || typeof children === "number" ? <span className="area-menu__text">{children}</span> : children}
      {shortcut ? <span className="area-menu__shortcut">{shortcut}</span> : null}
    </button>
  );
});

export interface ToastProps extends Div {
  tone?: VariantProps<typeof MANIFESTS.toast>["tone"];
  icon?: ReactNode;
}

export const Toast = /* @__PURE__ */ forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { tone = "info", icon, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} role="status" className={toastVariants({ tone }, className)} {...rest}>
      {icon ? (
        <span className="area-toast__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div>{children}</div>
    </div>
  );
});

/* --- Tabs ----------------------------------------------------------------- */

export interface TabsProps extends Div {
  /** Tab labels, in order. */
  tabs: Array<{ id: string; label: ReactNode; disabled?: boolean }>;
  /** Which tab is shown. Static here; wire it to state in an application. */
  value: string;
}

export const Tabs = /* @__PURE__ */ forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { tabs, value, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("area-tabs", className)} {...rest}>
      <div className="area-tabs__list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={tab.id === value}
            aria-controls={`panel-${tab.id}`}
            // Only the selected tab is in the tab order; arrow keys move between them.
            tabIndex={tab.id === value ? 0 : -1}
            disabled={tab.disabled}
            className="area-tabs__tab"
            {...(tab.id === value ? { "data-selected": "" } : {})}
            {...(tab.disabled ? { "data-disabled": "" } : {})}
          >
            <span className="area-tabs__label">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="area-tabs__panel" role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`}>
        {children}
      </div>
    </div>
  );
});

/* --- Dialog --------------------------------------------------------------- */

export interface DialogProps extends Omit<Div, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
}

/**
 * Interrupts with content that requires a response.
 *
 * Rendered as a plain element here so it can be shown inline in documentation. In an
 * application, render it inside a native `<dialog>` and open it with `showModal()`, which
 * supplies the focus trap, the backdrop, and Escape-to-close without any JavaScript of
 * your own.
 */
export const Dialog = /* @__PURE__ */ forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { title, description, footer, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : undefined}
      className={cx("area-dialog", className)}
      style={{ display: "flex", flexDirection: "column" }}
      {...rest}
    >
      {title || description ? (
        <div className="area-dialog__header">
          <div>
            <div className="area-dialog__title">{title}</div>
            {description ? <div className="area-dialog__description">{description}</div> : null}
          </div>
        </div>
      ) : null}
      {children ? <div className="area-dialog__body">{children}</div> : null}
      {footer ? <div className="area-dialog__footer">{footer}</div> : null}
    </div>
  );
});

/* --- Segmented control ---------------------------------------------------- */

export interface SegmentedProps extends Omit<Div, "onChange" | "onSelect"> {
  size?: VariantProps<typeof MANIFESTS.segmented>["size"];
  /** Stretch to the container, items sharing the width. For a panel row. */
  fullWidth?: boolean;
  options: Array<{ value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean }>;
  value: string;
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
  { size, fullWidth, options, value, label, onSelect, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      className={segmentedVariants({ size, fullWidth }, className)}
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
          onClick={onSelect ? () => onSelect(option.value) : undefined}
          {...(option.value === value ? { "data-selected": "" } : {})}
        >
          {option.icon ? (
            <span className="area-segmented__icon" aria-hidden="true">
              {option.icon}
            </span>
          ) : null}
          <span className="area-segmented__label">{option.label}</span>
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

export interface CodeBlockProps extends Omit<Div, "title"> {
  layout?: VariantProps<typeof MANIFESTS.codeBlock>["layout"];
  /** Actions placed at the top right of the code. */
  actions?: ReactNode;
  /** Pre-highlighted HTML. Use `code` instead for plain text. */
  html?: string;
  code?: string;
}

export const CodeBlock = /* @__PURE__ */ forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  { layout, actions, html, code, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={codeBlockVariants({ layout }, className)} {...rest}>
      {actions ? <span className="area-code-block__actions">{actions}</span> : null}
      <pre className="area-code-block__pre">
        {html ? <code dangerouslySetInnerHTML={{ __html: html }} /> : <code>{code}</code>}
      </pre>
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
  /** Normal matches body text; small is reserved for dense menu chrome. */
  size?: VariantProps<typeof MANIFESTS.kbd>["size"];
  /** Surface treatment for standalone, compact chrome, or coloured backgrounds. */
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
