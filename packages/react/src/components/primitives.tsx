/**
 * The presentational components.
 *
 * Thin by design: each one places elements and forwards props, and contributes no styling
 * of its own. Every appearance decision lives in `@area/styles`, which is what lets a
 * consumer use the CSS without React and get an identical result.
 */
import { forwardRef } from "react";
import type {
  HTMLAttributes,
  ImgHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import {
  alertVariants,
  avatarVariants,
  badgeVariants,
  checkboxVariants,
  cx,
  radioVariants,
  selectVariants,
  separatorVariants,
  skeletonVariants,
  spinnerVariants,
  switchVariants,
  tableVariants,
  textareaVariants,
} from "../variants.ts";

type Div = HTMLAttributes<HTMLDivElement>;
type Tone = "neutral" | "accent" | "danger" | "warning" | "success";
type Size = "sm" | "md" | "lg";

/* --- Badge ---------------------------------------------------------------- */

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  variant?: "solid" | "outline";
  /** Shows a leading status dot. */
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone, variant, dot, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={badgeVariants({ tone, variant }, className)} {...rest}>
      {dot ? <span className="area-badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
});

/* --- Avatar --------------------------------------------------------------- */

export interface AvatarProps extends Omit<Div, "children"> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "square";
  src?: string;
  /** Describes the person or entity. Required when `src` is set. */
  alt?: string;
  /** Shown when there is no image. Usually one or two initials. */
  fallback?: ReactNode;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { size, shape, src, alt, fallback, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={avatarVariants({ size, shape }, className)} {...rest}>
      {src ? (
        <img className="area-avatar__image" src={src} alt={alt ?? ""} />
      ) : (
        <span aria-hidden={alt ? undefined : "true"}>{fallback}</span>
      )}
    </div>
  );
});

/* --- Alert ---------------------------------------------------------------- */

export interface AlertProps extends Omit<Div, "title"> {
  tone?: "info" | "danger" | "warning" | "success";
  icon?: ReactNode;
  /** Shadows the native `title` attribute deliberately: an Alert's title is content. */
  title?: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone, icon, title, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      // `alert` interrupts a screen reader; `status` waits for a pause. Only danger earns
      // the interruption.
      role={tone === "danger" ? "alert" : "status"}
      className={alertVariants({ tone }, className)}
      {...rest}
    >
      {icon ? (
        <span className="area-alert__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="area-alert__content">
        {title ? <div className="area-alert__title">{title}</div> : null}
        {children ? <div className="area-alert__description">{children}</div> : null}
      </div>
    </div>
  );
});

/* --- Card ----------------------------------------------------------------- */

export const Card = forwardRef<HTMLDivElement, Div>(function Card({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card", className)} {...rest} />;
});

export const CardTitle = forwardRef<HTMLDivElement, Div>(function CardTitle({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__title", className)} {...rest} />;
});

export const CardDescription = forwardRef<HTMLDivElement, Div>(function CardDescription(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("area-card__description", className)} {...rest} />;
});

export const CardFooter = forwardRef<HTMLDivElement, Div>(function CardFooter({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card__footer", className)} {...rest} />;
});

/* --- Separator ------------------------------------------------------------ */

export interface SeparatorProps extends Div {
  orientation?: "horizontal" | "vertical";
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
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
  shape?: "text" | "circle";
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} aria-hidden="true" className={skeletonVariants({ shape }, className)} {...rest} />
  );
});

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: Size;
  /** Announced to assistive tech. Omit when a nearby element already says it. */
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, label, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      className={spinnerVariants({ size }, className)}
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

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
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

/* --- Select / Textarea ---------------------------------------------------- */

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: Size;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { size, className, ...rest },
  ref,
) {
  return <select ref={ref} className={selectVariants({ size }, className)} {...rest} />;
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: Size;
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size, invalid, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={textareaVariants({ size }, className)}
      aria-invalid={invalid || undefined}
      {...(invalid ? { "data-invalid": "" } : {})}
      {...rest}
    />
  );
});

/* --- Choice controls ------------------------------------------------------ */

interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: Size;
  label?: ReactNode;
  description?: ReactNode;
}

function choice(kind: "checkbox" | "radio" | "switch") {
  const variants = kind === "checkbox" ? checkboxVariants : kind === "radio" ? radioVariants : switchVariants;
  const block = `area-${kind}`;

  return forwardRef<HTMLInputElement, ChoiceProps>(function Choice(
    { size, label, description, className, disabled, ...rest },
    ref,
  ) {
    return (
      <label className={variants({ size }, className)} {...(disabled ? { "data-disabled": "" } : {})}>
        <input
          ref={ref}
          // A switch is a checkbox carrying role="switch", not a separate control, so it
          // keeps native keyboard behaviour and form participation either way.
          type={kind === "radio" ? "radio" : "checkbox"}
          role={kind === "switch" ? "switch" : undefined}
          className={`${block}__control`}
          disabled={disabled}
          {...rest}
        />
        {label || description ? (
          <span className="area-choice-label">
            {label ? <span className="area-choice-label__title">{label}</span> : null}
            {description ? <span className="area-choice-label__description">{description}</span> : null}
          </span>
        ) : null}
      </label>
    );
  });
}

export const Checkbox = choice("checkbox");
export const Radio = choice("radio");
export const Switch = choice("switch");

/* --- Field ---------------------------------------------------------------- */

export interface FieldProps extends Div {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  htmlFor?: string;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, description, error, required, htmlFor, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("area-field", className)} {...rest}>
      {label ? (
        <label className="area-field__label" htmlFor={htmlFor}>
          {label}
          {required ? (
            <span className="area-field__required" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {children}
      {description && !error ? <span className="area-field__description">{description}</span> : null}
      {error ? <span className="area-field__error">{error}</span> : null}
    </div>
  );
});

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label({ className, ...rest }, ref) {
  return <label ref={ref} className={cx("area-field__label", className)} {...rest} />;
});

/* --- Table ---------------------------------------------------------------- */

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Highlights rows on hover. Use only when a row is clickable. */
  interactive?: boolean;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
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

export const Tooltip = forwardRef<HTMLDivElement, Div>(function Tooltip({ className, ...rest }, ref) {
  return <div ref={ref} role="tooltip" className={cx("area-tooltip", className)} {...rest} />;
});

export const Popover = forwardRef<HTMLDivElement, Div>(function Popover({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-popover", className)} {...rest} />;
});

export const Menu = forwardRef<HTMLDivElement, Div>(function Menu({ className, ...rest }, ref) {
  return <div ref={ref} role="menu" className={cx("area-menu", className)} {...rest} />;
});

export interface MenuItemProps extends HTMLAttributes<HTMLButtonElement> {
  tone?: "danger";
  shortcut?: string;
  disabled?: boolean;
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
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
      {children}
      {shortcut ? <span className="area-menu__shortcut">{shortcut}</span> : null}
    </button>
  );
});

export interface ToastProps extends Div {
  tone?: "info" | "danger" | "warning" | "success";
  icon?: ReactNode;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { tone = "info", icon, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} role="status" className={cx("area-toast", `area-toast--${tone}`, className)} {...rest}>
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

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
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
            {tab.label}
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
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
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
