import { useSystemDefault } from "./SystemDefaults.tsx";
import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { Children, forwardRef, isValidElement, useState } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, MouseEvent, ReactNode, Ref } from "react";
import { buttonVariants, cx, tooltipVariants } from "../variants.ts";
import { AnchoredTooltip } from "./Overlays.tsx";

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
  /** Unset: a pill only while the theme's `pills` list names `button`. `true` forces a pill, `false` the radius corner. */
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
  /** The new state and the press that made it (Governance § 4: the event is the second argument). */
  onSelectedChange?: (selected: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Pending: a spinner replaces any leading icon and clicks are ignored, but the button stays
   * focusable at full ink (`aria-disabled`, not native `disabled`), so focus isn't lost on submit.
   */
  loading?: boolean;
  /**
   * Can't act now, for a reason that will pass or that the person can change (components audit V2, 2026-11-07; Primer's
   * `inactive`): drawn as disabled, but it keeps focus, its place in the Tab order and the pointer, so it can say why in
   * `inactiveText`. A press does nothing (`aria-disabled`, not native `disabled`). Use `disabled` only for a control that
   * truly can't act here (WRITING.md, "Disabled or inactive").
   */
  inactive?: boolean;
  /**
   * Why an inactive button can't act ("Upgrade to export", "Saving…"): a Tooltip on hover and focus, and the button's
   * accessible description. It takes the place of a Tooltip that would name the button.
   */
  inactiveText?: ReactNode;
  /**
   * On a painted colour (a colour card, a swatch): the colour's own ink and no fill, its hover and press plates that ink
   * at 12% and 20%, as Badge's `onColor`. Overrides the variant's and tone's paint.
   */
  onColor?: boolean;
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
    inactive: inactiveProp,
    inactiveText,
    icon,
    trailingIcon,
    onColor,
    className,
    children,
    disabled,
    type = "button",
    onClick,
    ...rest
  },
  ref,
) {
  // The system's defaults (SystemDefaults) where the use gives none.
  variant = useSystemDefault("button", "variant", variant, buttonVariants.manifest.variants.variant);
  tone = useSystemDefault("button", "tone", tone, buttonVariants.manifest.variants.tone);
  size = useSystemDefault("button", "size", size, buttonVariants.manifest.variants.size);
  const [localSelected, setLocalSelected] = useState(defaultSelected);
  const selected = selectedProp ?? localSelected;
  // Only a toggle (one with a selected state) flips on press; a plain button never gains aria-pressed.
  const toggle = selected === undefined ? onClick : (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (selectedProp === undefined) setLocalSelected(!selected);
    onSelectedChange?.(!selected, event);
  };
  const leading = loading ? <span className="area-spinner area-spinner--md" aria-hidden="true" /> : icon;
  // Disabled wins: a native disabled button can't take focus, so it can't be inactive.
  const inactive = Boolean(inactiveProp) && !disabled;
  // Loading and inactive both keep focus and drop the press.
  const held = (loading || inactive) && !disabled;

  // A trailing keycap leaves the label, so the button's gap spaces it from the text as a container's gap does
  // everywhere (Kbd's rule, round 53: a keycap sits one ui-cluster from the words beside it; a typed space left 4).
  const parts = Children.toArray(children);
  const last = parts.at(-1);
  const isKbd = isValidElement(last) && ((last.type as { render?: { name?: string } }).render?.name === "Kbd" || (typeof last.props === "object" && last.props !== null && "keys" in last.props));
  const label = isKbd ? parts.slice(0, -1) : children;
  const shortcut = isKbd ? last : null;
  const button = (
    <button
      ref={ref}
      type={type}
      className={buttonVariants(
        { variant, tone, size, fullWidth, iconOnly, pill: pill === true, rounded: pill === false, align, onColor },
        className,
      )}
      disabled={disabled}
      // Loading keeps focus and its place in the Tab order (audit S18): it is announced as
      // unavailable and busy, and the click (including a form's implicit submit) is dropped.
      // An inactive button is the same: unavailable, with its reason as its description (the Tooltip below).
      aria-disabled={held ? true : undefined}
      aria-busy={loading || undefined}
      onClick={held ? event => event.preventDefault() : toggle}
      // A selected toggle needs `aria-pressed`; the class alone tells assistive tech nothing.
      aria-pressed={selected ?? undefined}
      {...(loading ? { "data-loading": "" } : {})}
      {...(inactive ? { "data-inactive": "" } : {})}
      {...(selected ? { "data-selected": "" } : {})}
      {...rest}
    >
      {leading ? (
        <span className="area-button__icon" aria-hidden="true">
          {leading}
        </span>
      ) : null}
      {children != null && !iconOnly ? <>
        <span className="area-button__label">{label}</span>
        {shortcut}
      </> : null}
      {/* Icon-only keeps its children as the accessible name, as SplitButton does (audit A-12). */}
      {children != null && iconOnly ? <span className="area-sr-only">{children}</span> : null}
      {trailingIcon ? (
        <span className="area-button__icon" aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  );
  if (!inactive || inactiveText == null || inactiveText === false) return button;
  // The reason shows on hover and focus and describes the button, as an Area Tooltip does.
  return <AnchoredTooltip trigger={button} surface={props => <div role="tooltip" className={tooltipVariants({})} {...(props as HTMLAttributes<HTMLDivElement> & { ref: Ref<HTMLDivElement> })}>{inactiveText}</div>} />;
});

export { buttonVariants, cx };
