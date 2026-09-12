import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonVariants, cx } from "../variants.ts";

/**
 * The nine tones. `primary` and `secondary` are neutral rather than brand -- a near-black
 * button is the strongest call to action a neutral palette can make, and it stays the
 * strongest whatever the accent axis is set to.
 */
export type ButtonTone =
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "caution"
  | "danger"
  | "discovery";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Fill treatment. */
  variant?: "solid" | "soft" | "outline" | "ghost";
  /** Which semantic scale the button draws from. */
  tone?: ButtonTone;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
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
  /** Disables the button and shows a spinner in place of any leading icon. */
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
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    tone,
    size,
    fullWidth,
    iconOnly,
    pill,
    align,
    selected,
    loading,
    icon,
    trailingIcon,
    className,
    children,
    disabled,
    type = "button",
    ...rest
  },
  ref,
) {
  const leading = loading ? <span className="area-spinner area-spinner--sm" /> : icon;

  return (
    <button
      ref={ref}
      type={type}
      className={buttonVariants(
        { variant, tone, size, fullWidth, iconOnly, pill, align: align && `align-${align}` },
        className,
      )}
      disabled={disabled || loading}
      // Communicates the pending state to assistive tech, which `disabled` alone does not.
      aria-busy={loading || undefined}
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
      {trailingIcon ? (
        <span className="area-button__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
});

export { buttonVariants, cx };
