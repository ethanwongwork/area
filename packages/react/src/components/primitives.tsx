/**
 * The presentational components.
 *
 * Thin by design: each one places elements and forwards props, and contributes no styling
 * of its own. Every appearance decision lives in `@area/styles`, which is what lets a
 * consumer use the CSS without React and get an identical result.
 */
import { forwardRef } from "react";
import type {
  ButtonHTMLAttributes,
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
  chipVariants,
  panelVariants,
  segmentedVariants,
  separatorVariants,
  sliderVariants,
  skeletonVariants,
  spinnerVariants,
  switchVariants,
  tableVariants,
  textareaVariants,
} from "../variants.ts";

type Div = HTMLAttributes<HTMLDivElement>;
type Tone = "neutral" | "brand" | "danger" | "warning" | "success";
type Size = "sm" | "md" | "lg";

/*
 * Two controls carry a tier the others do not. Select and Switch have an `xs`, because a
 * dense inspector row needs one and a checkbox at that size stops being a reliable target.
 * The unions are separate rather than widened for everything, so a prop that has no CSS
 * behind it cannot be typed as valid.
 */
type SelectSize = "xs" | Size;
type SwitchSize = "xs" | Size;

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
  size?: SelectSize;
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

function choice<S extends string = Size>(kind: "checkbox" | "radio" | "switch") {
  const variants = kind === "checkbox" ? checkboxVariants : kind === "radio" ? radioVariants : switchVariants;
  const block = `area-${kind}`;

  return forwardRef<HTMLInputElement, Omit<ChoiceProps, "size"> & { size?: S }>(function Choice(
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
export const Switch = choice<SwitchSize>("switch");

/* --- Panel ---------------------------------------------------------------- */

/*
 * Composed rather than configured. A panel takes a title and an optional footer because
 * those are structural, and everything between them is children -- `Panel.Section` and
 * `Field inline` rows. A props API for the rows would have to grow a case for every
 * control the system has, which is the API the CSS deliberately does not have either.
 */
export interface PanelProps extends Omit<Div, "title"> {
  size?: "sm" | "md" | "lg";
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

export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { size, title, action, footer, flush, bareBar, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={panelVariants({ size, flush, "bare-bar": bareBar }, className)} {...rest}>
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

export const PanelSection = forwardRef<HTMLDivElement, PanelSectionProps>(function PanelSection(
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
export const PanelStack = forwardRef<HTMLDivElement, Div>(function PanelStack(
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
  size?: SliderSize;
  /** Rendered to the right of the track. Pass `false` for a track on its own. */
  readout?: ReactNode;
  disabled?: boolean;
}

type SliderSize = "xs" | "sm" | "md" | "lg";

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { size, readout, className, disabled, min = 0, max = 100, value, defaultValue, style, ...rest },
  ref,
) {
  const current = Number(value ?? defaultValue ?? min);
  const span = Number(max) - Number(min);
  const pct = span > 0 ? ((current - Number(min)) / span) * 100 : 0;

  return (
    <div
      className={sliderVariants({ size }, className)}
      style={{ ["--_pct" as string]: `${pct}%`, ...style }}
      {...(disabled ? { "data-disabled": "" } : {})}
    >
      <input
        ref={ref}
        type="range"
        className="area-slider__control"
        min={min}
        max={max}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        {...rest}
      />
      {readout === false || readout === undefined ? null : (
        <span className="area-slider__value">{readout}</span>
      )}
    </div>
  );
});

/* --- Chip ----------------------------------------------------------------- */

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  size?: "xs" | "sm" | "md";
  pill?: boolean;
  /** A colour this chip stands for, shown as a dot before the label. */
  swatch?: string;
  icon?: ReactNode;
  selected?: boolean;
  /** No label: the swatch is the whole chip, and the box goes square. */
  swatchOnly?: boolean;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { size, pill, swatch, icon, selected, swatchOnly, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      className={chipVariants({ size, pill, "swatch-only": swatchOnly }, className)}
      {...(selected ? { "data-selected": "" } : {})}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...rest}
    >
      {swatch ? (
        <span className="area-chip__swatch" style={{ background: swatch }} aria-hidden="true" />
      ) : null}
      {icon ? (
        <span className="area-chip__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {swatchOnly ? null : children}
    </button>
  );
});

export type ChipGroupProps = Div;

export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(function ChipGroup(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx("area-chip-group", className)} {...rest} />;
});

/* --- Field ---------------------------------------------------------------- */

export interface FieldProps extends Div {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  htmlFor?: string;
  /** Label left, control right, on columns shared with every other inline field. */
  inline?: boolean;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, description, error, required, htmlFor, inline, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("area-field", inline && "area-field--inline", className)}
      {...rest}
    >
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
  shortcut?: ReactNode;
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

/* --- Segmented control ---------------------------------------------------- */

export interface SegmentedProps extends Omit<Div, "onChange" | "onSelect"> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
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
export const Segmented = forwardRef<HTMLDivElement, SegmentedProps>(function Segmented(
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
          {option.label}
        </button>
      ))}
    </div>
  );
});

/* --- Code ----------------------------------------------------------------- */

export type CodeProps = HTMLAttributes<HTMLElement>;

export const Code = forwardRef<HTMLElement, CodeProps>(function Code({ className, ...rest }, ref) {
  return <code ref={ref} className={cx("area-code", className)} {...rest} />;
});

export interface CodeBlockProps extends Omit<Div, "title"> {
  /** Shown at the left of the toolbar, usually a filename or language. */
  title?: ReactNode;
  /** Buttons at the right of the toolbar. */
  actions?: ReactNode;
  /** Pre-highlighted HTML. Use `code` instead for plain text. */
  html?: string;
  code?: string;
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  { title, actions, html, code, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("area-code-block", className)} {...rest}>
      {title || actions ? (
        <div className="area-code-block__toolbar">
          {title ? <span className="area-code-block__title">{title}</span> : null}
          {actions ? <span className="area-code-block__actions">{actions}</span> : null}
        </div>
      ) : null}
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
  enter: "↵",
  backspace: "⌫",
  delete: "⌦",
  escape: "Esc",
  esc: "Esc",
  tab: "⇥",
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
  "↵": "Enter",
  "⌫": "Backspace",
  "⌦": "Delete",
  "⇥": "Tab",
  "↑": "Up arrow",
  "↓": "Down arrow",
  "←": "Left arrow",
  "→": "Right arrow",
};

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Key names, in order. `cmd`, `shift`, `alt`, `ctrl` and the arrows become glyphs. */
  keys: string[];
  /** Drops the fill and border. For keys rendered inside a menu item. */
  quiet?: boolean;
}

/**
 * Marks a keyboard shortcut.
 *
 * Renders one element per key rather than one element reading "⌘K", because a shortcut is
 * a sequence of physical keys and screen readers need each one named — the glyphs alone
 * are read as nothing useful.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { keys, quiet, className, ...rest },
  ref,
) {
  const rendered = keys.map((key) => KEY_GLYPHS[key.toLowerCase()] ?? key.toUpperCase());
  const spoken = rendered.map((glyph) => KEY_LABELS[glyph] ?? glyph).join(" plus ");

  return (
    <span ref={ref} className={cx("area-kbd-group", className)} aria-label={spoken} {...rest}>
      {rendered.map((glyph, i) => (
        <kbd key={i} className={cx("area-kbd", quiet && "area-kbd--quiet")} aria-hidden="true">
          {glyph}
        </kbd>
      ))}
    </span>
  );
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
 * Names a design token inline — in documentation, in a spec, in a comment thread.
 *
 * Distinct from `Code` because a token reference is a *name*, not a fragment of source, and
 * it can carry a swatch showing what the name currently resolves to. The two share a size,
 * ground and stroke deliberately: they are both text you could type, and a page that styles
 * them differently implies a distinction that is not there.
 *
 * One size, and no size prop. The badge has to sit inside 14px table chrome and inside 16px
 * running prose without having been set for either.
 */
export const Token = forwardRef<HTMLElement, TokenProps>(function Token(
  { children, swatch, subtle, onColor, className, ...rest },
  ref,
) {
  return (
    <span
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
      {children}
    </span>
  );
});
