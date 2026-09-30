import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
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
export const Button = /* @__PURE__ */ forwardRef<HTMLButtonElement, ButtonProps>(function Button(
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
  const leading = loading ? <span className="area-spinner area-spinner--md" aria-hidden="true" /> : icon;

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
