import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonVariants, cx } from "../variants.ts";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Fill treatment. */
  variant?: "solid" | "soft" | "outline" | "ghost";
  /** Which semantic scale the button draws from. */
  tone?: "neutral" | "accent" | "danger";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
  /** Square button with no label. Requires `aria-label`. */
  iconOnly?: boolean;
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
      className={buttonVariants({ variant, tone, size, fullWidth, iconOnly }, className)}
      disabled={disabled || loading}
      // Communicates the pending state to assistive tech, which `disabled` alone does not.
      aria-busy={loading || undefined}
      {...(loading ? { "data-loading": "" } : {})}
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
