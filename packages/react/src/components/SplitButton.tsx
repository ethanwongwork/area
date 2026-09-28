import { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, KeyboardEvent, MouseEventHandler, ReactNode } from "react";
import { Button, type ButtonProps, type ButtonTone } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Menu } from "./primitives.tsx";
import { MANIFESTS, splitButtonVariants, type VariantProps } from "../variants.ts";

export interface SplitButtonProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick" | "children"> {
  /** Fill treatment, shared by both parts. Ghost is not offered: without a fill or edge the two parts do not read as one control. */
  variant?: VariantProps<typeof MANIFESTS.splitButton>["variant"];
  tone?: ButtonTone;
  size?: ButtonProps["size"];
  /** The default action's label. */
  children: ReactNode;
  /** Icon before the default action's label. */
  icon?: ReactNode;
  /** Runs the default action. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** MenuItems for the related actions. Choosing one closes the menu. */
  menu: ReactNode;
  /** Accessible name for the menu trigger. */
  menuLabel?: string;
  disabled?: boolean;
  /** Extra props for the default action's button. */
  actionProps?: Omit<ButtonProps, "children" | "onClick" | "variant" | "tone" | "size" | "disabled" | "icon">;
}

const items = (menu: HTMLElement | null) =>
  [...(menu?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? [])];

/**
 * A default action joined to a menu of related actions (Fluent SplitButton, Carbon
 * ComboButton, Atlassian SplitButton). Both parts are real buttons in the Tab order; the
 * trigger has its own name, reports `aria-expanded`, and opens a Menu in a native popover,
 * which supplies Escape, light dismissal and focus return. Arrow keys move through the menu.
 */
export const SplitButton = /* @__PURE__ */ forwardRef<HTMLDivElement, SplitButtonProps>(function SplitButton(
  { variant = "solid", tone, size, children, icon, onClick, menu, menuLabel = "More options", disabled, actionProps, className, style, ...rest },
  ref,
) {
  const id = useId();
  const menuId = `${id}-menu`;
  const popup = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  // ArrowUp opens on the last item. The popover's toggle event fires after the key handler,
  // so the handler records the wish and the toggle handler places focus once.
  const focusLast = useRef(false);

  useEffect(() => {
    const element = popup.current;
    if (!element) return;
    const onToggle = (event: Event) => {
      const next = (event as ToggleEvent).newState === "open";
      setOpen(next);
      if (next) items(element).at(focusLast.current ? -1 : 0)?.focus();
      focusLast.current = false;
    };
    element.addEventListener("toggle", onToggle);
    return () => element.removeEventListener("toggle", onToggle);
  }, []);

  const close = () => { if (popup.current?.matches(":popover-open")) popup.current.hidePopover(); };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !disabled) {
      event.preventDefault();
      focusLast.current = event.key === "ArrowUp";
      popup.current?.showPopover();
    }
  };

  // Arrow keys, Home/End and typeahead come from Menu; the popup only closes on Tab.
  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => { if (event.key === "Tab") close(); };

  return (
    <div
      {...rest}
      ref={ref}
      role="group"
      className={splitButtonVariants({ variant }, className)}
      style={{ ...style, "--_split-anchor": `--area-split-${id.replace(/[^a-zA-Z0-9_-]/g, "")}` } as CSSProperties}
    >
      <Button {...actionProps} className={["area-split-button__action", actionProps?.className].filter(Boolean).join(" ")}
        variant={variant} tone={tone} size={size} icon={icon} disabled={disabled} onClick={onClick}>
        {children}
      </Button>
      <Button className="area-split-button__trigger" variant={variant} tone={tone} size={size} iconOnly
        icon={<Glyph name="chevron-down" />} aria-label={menuLabel} aria-haspopup="menu" aria-expanded={open}
        aria-controls={menuId} disabled={disabled} popoverTarget={menuId} onKeyDown={onTriggerKeyDown} />
      <Menu ref={popup} id={menuId} popover="auto" aria-label={menuLabel}
        className="area-split-button__menu" onKeyDown={onMenuKeyDown}
        onClick={(event) => { if ((event.target as HTMLElement).closest('[role="menuitem"]')) close(); }}>
        {menu}
      </Menu>
    </div>
  );
});
