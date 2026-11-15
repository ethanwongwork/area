import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { forwardRef, useState } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { cx, chipVariants } from "../variants.ts";
import type { Div } from "./shared.ts";
/* --- Chip ----------------------------------------------------------------- */

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Interaction role: assist action, selectable filter, removable input, or suggestion. */
  kind?: VariantProps<typeof MANIFESTS.chip>["kind"];
  /** The height and type: `md` (default), `sm` or `lg`. */
  size?: VariantProps<typeof MANIFESTS.chip>["size"];
  /** Unset: a pill while the theme's `pills` list names this component (the default). `true` forces a pill, `false` the radius setting's corner. */
  pill?: boolean;
  /** A colour this chip stands for, shown as a dot before the label. */
  swatch?: string;
  /** A glyph before the label. */
  icon?: ReactNode;
  /** Controlled selected state. */
  selected?: boolean;
  /** Initial selected state for an uncontrolled chip. */
  defaultSelected?: boolean;
  /** Called after a user toggles an enabled chip. */
  onSelectedChange?: (selected: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  /** A person or entity visual, usually an Avatar. */
  avatar?: ReactNode;
  /** A small visual filter thumbnail. `imageAlt` is optional when the label names it. */
  image?: string;
  /**
   * The thumbnail's text alternative; leave it out when the label names it.
   * @default ""
   */
  imageAlt?: string;
  /** Adds an independently focusable dismiss action (a circle with the Area dismiss glyph). */
  onDismiss?: () => void;
  /** @deprecated Use `onDismiss`. */
  onRemove?: () => void;
  /** Makes the label an action when a removable input chip would otherwise only expose dismiss. */
  clickable?: boolean;
  /** Replaces the standard dismiss icon, for example with a trash can. */
  dismissIcon?: ReactNode;
  /** Accessible name for the dismiss action. */
  dismissLabel?: string;
  /** @deprecated Use `dismissIcon`. */
  removeIcon?: ReactNode;
  /** @deprecated Use `dismissLabel`. */
  removeLabel?: string;
  /** Marks an input chip whose value was not recognized. */
  invalid?: boolean;
  /** No label: the swatch is the whole chip, and the box goes square. */
  swatchOnly?: boolean;
}

export const Chip = /* @__PURE__ */ forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { kind = "filter", size, pill, swatch, icon, avatar, image, imageAlt, selected, defaultSelected = false, onSelectedChange, onClick, onDismiss: onDismissProp, onRemove, clickable, dismissIcon, removeIcon, dismissLabel, removeLabel, invalid, swatchOnly, className, children, disabled, ...rest },
  ref,
) {
  const [localSelected, setLocalSelected] = useState(defaultSelected);
  const currentSelected = selected ?? localSelected;
  const selectable = kind === "filter";
  const primaryInteractive = selectable || clickable || Boolean(onClick);
  const classes = chipVariants({ kind, size, swatchOnly, pill: pill === true, rounded: pill === false }, className);
  const state = {
    ...(selectable && currentSelected ? { "data-selected": "" } : {}),
    ...(disabled ? { "data-disabled": "" } : {}),
    ...(invalid ? { "data-invalid": "" } : {}),
  };
  const contents = (
    <>
      {swatch ? <span className="area-chip__swatch" style={{ background: swatch }} aria-hidden="true" /> : null}
      {avatar ? <span className="area-chip__avatar" aria-hidden="true">{avatar}</span> : null}
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
    onSelectedChange?.(next, event);
  };

  const onDismiss = onDismissProp ?? onRemove;
  if (onDismiss) {
    // The removal names what it removes, so a row of chips doesn't read "Remove chip" over and
    // over (audit C-6). A consumer label wins; a non-text chip falls back to the generic name.
    const text = typeof children === "string" || typeof children === "number" ? String(children) : null;
    const name = dismissLabel ?? removeLabel ?? (text ? `Remove ${text}` : "Remove chip");
    // Removing unmounts the focused control: hand focus to the next chip, or the previous one,
    // instead of dropping it to the page (Material, Spectrum TagGroup).
    const dismiss = (from: HTMLElement) => {
      const chip = from.closest(".area-chip");
      const next = chip?.nextElementSibling?.querySelector<HTMLElement>("button:not(:disabled), a[href]") ?? (chip?.nextElementSibling?.matches("button:not(:disabled), a[href]") ? chip.nextElementSibling as HTMLElement : null);
      const prev = chip?.previousElementSibling?.querySelector<HTMLElement>("button:not(:disabled), a[href]") ?? (chip?.previousElementSibling?.matches("button:not(:disabled), a[href]") ? chip.previousElementSibling as HTMLElement : null);
      onDismiss();
      requestAnimationFrame(() => {
        const active = document.activeElement;
        if (active && active !== document.body && active.isConnected) return;
        (next ?? prev)?.focus();
      });
    };
    // Backspace or Delete on a focused chip removes it, as on Material and Spectrum chips.
    const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (disabled || (event.key !== "Backspace" && event.key !== "Delete")) return;
      event.preventDefault();
      dismiss(event.currentTarget);
    };
    // `ref` and native props land on the chip's primary control (the action, or the removal when
    // it is the only control); `className` and `style` on the chip itself (audit C-24).
    const { style, onKeyDown: theirKeyDown, ...control } = rest;
    const keys = (event: KeyboardEvent<HTMLButtonElement>) => { theirKeyDown?.(event); if (!event.defaultPrevented) onKeyDown(event); };
    return (
      <span className={classes} style={style} {...state}>
        {primaryInteractive ? (
          <button ref={ref} type="button" aria-pressed={selectable ? currentSelected : undefined} disabled={disabled} className="area-chip__action" onClick={handleClick} {...control} onKeyDown={keys}>
            {contents}
          </button>
        ) : <span className="area-chip__action">{contents}</span>}
        <button {...(primaryInteractive ? {} : control)} ref={primaryInteractive ? undefined : ref} type="button" className="area-chip__dismiss" aria-label={name} disabled={disabled}
          onKeyDown={primaryInteractive ? onKeyDown : keys}
          onClick={event => { event.stopPropagation(); dismiss(event.currentTarget); }}>
          {dismissIcon ?? removeIcon ?? <Glyph name="dismiss" />}
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
  /** The height and type, as Chip's: `md` (default), `sm` or `lg`. */
  size?: VariantProps<typeof MANIFESTS.chip>["size"];
  /**
   * Unset: a pill while the theme's `pills` list names `chip` (the default); `true` forces a pill, `false` the radius
   * setting's corner, as on Chip.
   */
  pill?: boolean;
  /** A glyph before the label. */
  icon?: ReactNode;
  /** With `treatment="icon"`, the outgoing-link glyph after the label. */
  trailingIcon?: ReactNode;
  /** Underline is the text-link treatment; icon uses an outgoing-link visual and underlines only on hover/focus. */
  treatment?: "underline" | "icon";
  /** A person or entity visual before the label, usually an Avatar. */
  avatar?: ReactNode;
  /** A small thumbnail before the label, as a URL. */
  image?: string;
  /**
   * The thumbnail's text alternative; leave it out when the label names it.
   * @default ""
   */
  imageAlt?: string;
  /** The link's label. */
  children?: ReactNode;
}

/** A navigational chip. Selection and removal remain the responsibility of `Chip`. */
export const ChipLink = /* @__PURE__ */ forwardRef<HTMLAnchorElement, ChipLinkProps>(function ChipLink(
  { size, pill, icon, trailingIcon, treatment = "underline", avatar, image, imageAlt, className, children, ...rest },
  ref,
) {
  return (
    <a ref={ref} className={chipVariants({ kind: "suggestion", size, link: treatment === "underline", linkIcon: treatment === "icon", pill: pill === true, rounded: pill === false }, className)} {...rest}>
      {avatar ? <span className="area-chip__avatar" aria-hidden="true">{avatar}</span> : null}
      {image ? <span className="area-chip__image"><img src={image} alt={imageAlt ?? ""} /></span> : null}
      {icon ? <span className="area-chip__icon" aria-hidden="true">{icon}</span> : null}
      <span className="area-chip__label">{children}</span>
      {treatment === "icon" && trailingIcon ? <span className="area-chip__trailing-icon" aria-hidden="true">{trailingIcon}</span> : null}
    </a>
  );
});

export interface ChipGroupProps extends Div {
  /** @deprecated Use `aria-label`, which names the group. */
  label?: string;
}

export const ChipGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, ChipGroupProps>(function ChipGroup(
  { label, className, ...rest },
  ref,
) {
  return <div ref={ref} role="group" aria-label={rest["aria-label"] ?? label} className={cx("area-chip-group", className)} {...rest} />;
});

