import { forwardRef, useContext, useEffect, useId, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, MouseEventHandler, ReactNode } from "react";
import { Button, type ButtonProps, type ButtonTone } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Menu } from "./primitives.tsx";
import { MANIFESTS, splitButtonVariants, type VariantProps } from "../variants.ts";
import { InToolbar, toolbarItemProps } from "./toolbar-context.ts";
import { MENU_OFFSET, OVERLAY_PADDING } from "./Overlays.tsx";
import { assignRef, useAnchoredPosition } from "./overlay.ts";

export interface SplitButtonProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick" | "children"> {
  /** Fill treatment, shared by both parts. `ghost` is Figma's tool with its menu: two plates
   * 1px apart with no drawn divider, each with its own hover; use it icon-only in a toolbar. */
  variant?: VariantProps<typeof MANIFESTS.splitButton>["variant"];
  /** Shows only the action's icon; `children` becomes the action's accessible name. */
  iconOnly?: boolean;
  /** The action is the current tool (a pressed toggle, Button's selected paint). */
  selected?: boolean;
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
  { variant = "solid", tone, size, children, icon, iconOnly, selected, onClick, menu, menuLabel = "More options", disabled, actionProps, className, style, ...rest },
  ref,
) {
  const id = useId();
  const inToolbar = useContext(InToolbar);
  const roving = inToolbar ? toolbarItemProps : {};
  const menuId = `${id}-menu`;
  const popup = useRef<HTMLDivElement | null>(null);
  const group = useRef<HTMLDivElement | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  // spec (docs/specs/split-button.md, "Menu placement"): placed like every anchored menu
  // (overlay.ts), 4 away, flipping to the other side without room.
  // - A text split hangs under the whole group, flush with its end edge (Notion's New menu:
  //   4 below, 0.3 from the end).
  // - An icon tool's menu starts at its chevron's start edge and clears the toolbar it sits in
  //   by 4 (Figma's toolbelt: menu left = chevron left, 4 from the bar, 12 from the tool).
  const clearToolbar = (node: HTMLElement) => {
    const own = node.getBoundingClientRect();
    const bar = node.closest(".area-toolbar")?.getBoundingClientRect();
    return bar ? { x: own.x, y: bar.y, width: own.width, height: bar.height } : own;
  };
  useAnchoredPosition(iconOnly ? trigger : group, popup, open, {
    side: "bottom", align: iconOnly ? "start" : "end", offset: MENU_OFFSET, padding: OVERLAY_PADDING,
    anchorRect: iconOnly ? clearToolbar : undefined,
  });
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
      ref={node => { group.current = node; assignRef(ref, node); }}
      role="group"
      className={splitButtonVariants({ variant, iconOnly }, className)}
      style={style}
    >
      <Button {...actionProps} {...roving} className={["area-split-button__action", actionProps?.className].filter(Boolean).join(" ")}
        variant={variant} tone={tone} size={size} icon={icon} iconOnly={iconOnly} selected={selected} disabled={disabled} onClick={onClick}
        aria-label={iconOnly && typeof children === "string" ? children : actionProps?.["aria-label"]}>
        {iconOnly ? null : children}
      </Button>
      <Button {...roving} ref={trigger} className="area-split-button__trigger" variant={variant} tone={tone} size={size} iconOnly
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
