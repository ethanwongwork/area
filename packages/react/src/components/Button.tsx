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
  /** An uncontrolled toggle's initial state (audit S17: as Chip). */
  defaultSelected?: boolean;
  /** Called when a toggle (`selected` or `defaultSelected` set) is pressed. */
  onSelectedChange?: (selected: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Pending: a spinner replaces any leading icon and clicks do nothing, but the button keeps
   * focus, its place in the Tab order and full opacity (`aria-disabled`, audit S18).
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
  const [localSelected, setLocalSelected] = useState(Boolean(defaultSelected));
  const toggle = selectedProp !== undefined || defaultSelected !== undefined;
  const selected = toggle ? selectedProp ?? localSelected : undefined;
  const press = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!toggle || event.defaultPrevented) return;
    const next = !selected;
    if (selectedProp === undefined) setLocalSelected(next);
    onSelectedChange?.(next, event);
  };
  // The spinner fills the tier's icon box (button.css), so it never overflows a small one.
  const leading = loading ? <span className="area-spinner" aria-hidden="true" /> : icon;

  return (
    <button
      ref={ref}
      type={type}
      className={buttonVariants(
        { variant, tone, size, fullWidth, iconOnly, pill, align },
        className,
      )}
      disabled={disabled}
      // Loading is not native disabled: that would drop focus to the body and take the button
      // out of the Tab order mid-submit (audit S18). It is announced as unavailable and busy,
      // and the click (including a form's implicit submit) is swallowed below.
      aria-disabled={loading && !disabled ? true : undefined}
      aria-busy={loading || undefined}
      // A selected toggle needs `aria-pressed`; the class alone tells assistive tech nothing.
      aria-pressed={selected ?? undefined}
      {...(loading ? { "data-loading": "" } : {})}
      {...(selected ? { "data-selected": "" } : {})}
      {...rest}
      onClick={loading ? event => event.preventDefault() : press}
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
