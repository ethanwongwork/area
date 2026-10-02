import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { forwardRef, useState } from "react";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { buttonVariants, cx } from "../variants.ts";

/**
 * The seven tones. `neutral` carries no meaning: its solid fill is the Action role, neutral
 * ink by default and the accent when a theme sets `action: "accent"`. The others are
 * semantic and keep their colour in every theme.
 */
export type ButtonTone = VariantProps<typeof MANIFESTS.button>["tone"];

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Fill treatment. */
  variant?: VariantProps<typeof MANIFESTS.button>["variant"];
  /** Which semantic scale the button draws from. */
  tone?: ButtonTone;
  size?: VariantProps<typeof MANIFESTS.button>["size"];
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
  /** Square button with no label. Requires `aria-label`. */
  iconOnly?: boolean;
  /** Fully round. */
  pill?: boolean;
  /**
   * Pulls the button back by its own padding so the *label* lines up with the text
   * above it rather than the button's box. Only correct on unfilled variants.
   */
  align?: "start" | "end";
  /** A toggle that is currently on. Persists, unlike hover. */
  selected?: boolean;
  /**
   * Makes the button an uncontrolled toggle that starts on or off, as Chip's `defaultSelected`
   * (audit A-17; the toggle used to be controlled only). Each press flips it.
   */
  defaultSelected?: boolean;
  /** Called with the next state when a toggle is pressed, controlled or not. */
  onSelectedChange?: (selected: boolean) => void;
  /**
   * Pending: a spinner replaces any leading icon and clicks are ignored, but the button stays
   * focusable at full ink (`aria-disabled`, not native `disabled`), so focus isn't lost on submit.
   */
  loading?: boolean;
  /** Rendered before the label. */
  icon?: ReactNode;
  /** Rendered after the label. */
  trailingIcon?: ReactNode;
  type?: "button" | "submit" | "reset";
}

/**
 * Triggers an action.
 *
 * Defaults to `type="button"`. The HTML default is `submit`, which silently submits the
 * nearest form -- a bug that only appears once a button is placed inside one.
 */
export const Button = /* @__PURE__ */ forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    tone,
    size,
    fullWidth,
    iconOnly,
    pill,
    align,
    selected: selectedProp,
    defaultSelected,
    onSelectedChange,
    loading,
    icon,
    trailingIcon,
    className,
    children,
    disabled,
    type = "button",
    onClick,
    ...rest
  },
  ref,
) {
  const [localSelected, setLocalSelected] = useState(defaultSelected);
  const selected = selectedProp ?? localSelected;
  // Only a toggle (one with a selected state) flips on press; a plain button never gains aria-pressed.
  const toggle = selected === undefined ? onClick : (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (selectedProp === undefined) setLocalSelected(!selected);
    onSelectedChange?.(!selected);
  };
  const leading = loading ? <span className="area-spinner area-spinner--md" aria-hidden="true" /> : icon;

  return (
    <button
      ref={ref}
      type={type}
      className={buttonVariants(
        { variant, tone, size, fullWidth, iconOnly, pill, align },
        className,
      )}
      disabled={disabled}
      // Loading keeps focus and its place in the Tab order (audit S18): it is announced as
      // unavailable and busy, and the click (including a form's implicit submit) is dropped.
      aria-disabled={loading && !disabled ? true : undefined}
      aria-busy={loading || undefined}
      onClick={loading ? event => event.preventDefault() : toggle}
      // A selected toggle needs `aria-pressed`; the class alone tells assistive tech nothing.
      aria-pressed={selected ?? undefined}
      {...(loading ? { "data-loading": "" } : {})}
      {...(selected ? { "data-selected": "" } : {})}
      {...rest}
    >
      {leading ? (
        <span className="area-button__icon" aria-hidden="true">
          {leading}
        </span>
      ) : null}
      {children != null && !iconOnly ? <span className="area-button__label">{children}</span> : null}
      {/* Icon-only keeps its children as the accessible name, as SplitButton does (audit A-12). */}
      {children != null && iconOnly ? <span className="area-sr-only">{children}</span> : null}
      {trailingIcon ? (
        <span className="area-button__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
});

export { buttonVariants, cx };
