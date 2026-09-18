import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
/**
 * The presentational components.
 *
 * Thin by design: each one places elements and forwards props, and contributes no styling
 * of its own. Every appearance decision lives in `@area/styles`, which is what lets a
 * consumer use the CSS without React and get an identical result.
 */
import { forwardRef } from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import {
  alertVariants,
  avatarVariants,
  badgeVariants,
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
/* --- Badge ---------------------------------------------------------------- */

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: VariantProps<typeof MANIFESTS.badge>["tone"];
  variant?: VariantProps<typeof MANIFESTS.badge>["variant"];
  /** Shows a leading status dot. */
  dot?: boolean;
}

export const Badge = /* @__PURE__ */ forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone, variant, dot, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={badgeVariants({ tone, variant }, className)} {...rest}>
      {dot ? <span className="area-badge__dot" aria-hidden="true" /> : null}
      <span className="area-badge__label">{children}</span>
    </span>
  );
});

/* --- Avatar --------------------------------------------------------------- */

export interface AvatarProps extends Omit<Div, "children"> {
  size?: VariantProps<typeof MANIFESTS.avatar>["size"];
  shape?: VariantProps<typeof MANIFESTS.avatar>["shape"];
  src?: string;
  /** Describes the person or entity. Required when `src` is set. */
  alt?: string;
  /** Shown when there is no image. Usually one or two initials. */
  fallback?: ReactNode;
}

export const Avatar = /* @__PURE__ */ forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
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
  tone?: VariantProps<typeof MANIFESTS.alert>["tone"];
  icon?: ReactNode;
  /** Shadows the native `title` attribute deliberately: an Alert's title is content. */
  title?: ReactNode;
}

export const Alert = /* @__PURE__ */ forwardRef<HTMLDivElement, AlertProps>(function Alert(
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

export const Card = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function Card({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-card", className)} {...rest} />;
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
  /** Announced to assistive tech. Omit when a nearby element already says it. */
  label?: string;
}

export const Spinner = /* @__PURE__ */ forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
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
  size?: VariantProps<typeof MANIFESTS.slider>["size"];
  /** Rendered to the right of the track. Pass `false` for a track on its own. */
  readout?: ReactNode;
  disabled?: boolean;
}


export const Slider = /* @__PURE__ */ forwardRef<HTMLInputElement, SliderProps>(function Slider(
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
  size?: VariantProps<typeof MANIFESTS.chip>["size"];
  pill?: boolean;
  /** A colour this chip stands for, shown as a dot before the label. */
  swatch?: string;
  icon?: ReactNode;
  selected?: boolean;
  /** No label: the swatch is the whole chip, and the box goes square. */
  swatchOnly?: boolean;
}

export const Chip = /* @__PURE__ */ forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { size, pill, swatch, icon, selected, swatchOnly, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      className={chipVariants({ size, pill, swatchOnly }, className)}
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
      {swatchOnly ? null : <span className="area-chip__label">{children}</span>}
    </button>
  );
});

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
  /** Uses the subtler keycap treatment for keys rendered inside menu chrome. */
  quiet?: boolean;
}

/**
 * Marks a keyboard shortcut.
 *
 * Renders one flat chord with one semantic element per key. The chord provides its own
 * spoken label because bare modifier glyphs are not announced usefully.
 */
export const Kbd = /* @__PURE__ */ forwardRef<HTMLElement, KbdProps>(function Kbd(
  { keys, size = "normal", quiet, className, ...rest },
  ref,
) {
  const rendered = keys.map((key) => KEY_GLYPHS[key.toLowerCase()] ?? key.toUpperCase());
  const spoken = rendered.map((glyph) => KEY_LABELS[glyph] ?? glyph).join(" plus ");

  return (
    <span
      ref={ref}
      className={cx("area-kbd-group", "area-kbd", `area-kbd--${size}`, quiet && "area-kbd--quiet", className)}
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
