import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { contextMenuVariants } from "../variants.ts";
import { Menu } from "./primitives.tsx";

export interface ContextMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  /** The menu's rows: MenuItem, MenuLabel, MenuSeparator. */
  menu: ReactNode;
  /** Names the menu ("Page actions"). */
  "aria-label"?: string;
  /** @deprecated Name it with `aria-label` (audit S17: `label` is visible text; names are `aria-label`). */
  label?: string;
  /** The area that opens the menu when right-clicked. */
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

/** Below the focused element, from its start edge (left, or right in right-to-left text). */
const anchorAt = (target: HTMLElement) => {
  const rect = target.getBoundingClientRect();
  const rtl = getComputedStyle(target).direction === "rtl";
  return { x: rtl ? rect.right : rect.left, y: rect.bottom, keyboard: true, rtl };
};

const itemsOf = (menu: HTMLElement) => [...menu.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')]
  .filter(item => !item.hasAttribute("disabled") && item.closest('[role="menu"]') === menu);

/**
 * Opens a Menu where the pointer right-clicks (or at the focused element for Shift+F10 and
 * the Menu key). Choosing a row, Escape or a click elsewhere closes it and focus returns.
 */
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu(
  { menu, label, "aria-label": ariaLabel, children, onOpenChange, disabled, className, onContextMenu, onKeyDown, ...rest }, ref,
) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [point, setPoint] = useState<{ x: number; y: number; keyboard: boolean; rtl?: boolean } | null>(null);

  // Open at the point, then pull the menu back inside the viewport (flip across the pointer).
  useLayoutEffect(() => {
    const element = menuRef.current;
    if (!element || !point || typeof element.showPopover !== "function") return;
    if (!element.matches(":popover-open")) element.showPopover();
    const rect = element.getBoundingClientRect();
    const margin = 8;
    let { x, y } = point;
    // A keyboard-opened menu starts at the element's start edge, which is its right in RTL.
    if (point.rtl) x -= rect.width;
    if (x + rect.width > innerWidth - margin) x = Math.max(margin, x - rect.width);
    if (y + rect.height > innerHeight - margin) y = Math.max(margin, y - rect.height);
    element.style.setProperty("--_context-x", `${x}px`);
    element.style.setProperty("--_context-y", `${y}px`);
    // The pointer opens with nothing highlighted; the keyboard lands on the first row (WAI menu).
    (point.keyboard ? itemsOf(element)[0] : element)?.focus({ preventScroll: true });
  }, [point]);

  const close = (restore: boolean) => {
    setPoint(null);
    onOpenChange?.(false);
    if (restore) returnFocus.current?.focus({ preventScroll: true });
  };
  const open = (event: MouseEvent<HTMLDivElement>) => {
    onContextMenu?.(event);
    if (disabled || event.defaultPrevented) return;
    event.preventDefault();
    returnFocus.current = document.activeElement as HTMLElement | null;
    // A keyboard-opened context menu reports no pointer: anchor it to the focused element.
    const keyboard = event.clientX === 0 && event.clientY === 0 || event.nativeEvent.button === -1;
    const target = event.target as HTMLElement;
    setPoint(keyboard ? anchorAt(target) : { x: event.clientX, y: event.clientY, keyboard });
    onOpenChange?.(true);
  };

  // Shift+F10 and the Menu key open it from the keyboard on every platform (some browsers only
  // turn them into a contextmenu event on Windows).
  const openFromKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (disabled || event.defaultPrevented || point) return;
    if (!((event.key === "F10" && event.shiftKey) || event.key === "ContextMenu")) return;
    if ((event.target as HTMLElement).closest(".area-context-menu__menu")) return;
    event.preventDefault();
    returnFocus.current = document.activeElement as HTMLElement | null;
    setPoint(anchorAt(event.target as HTMLElement));
    onOpenChange?.(true);
  };

  return <div ref={ref} className={contextMenuVariants({}, className)} onContextMenu={open} onKeyDown={openFromKeyboard} {...rest}>
    {children}
    <Menu ref={menuRef} popover="auto" aria-label={ariaLabel ?? label} tabIndex={-1} className="area-context-menu__menu"
      onToggle={event => { if ((event.nativeEvent as ToggleEvent).newState === "closed" && point) close(false); }}
      onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); menuRef.current?.hidePopover(); close(true); } else if (event.key === "Tab") { event.preventDefault(); menuRef.current?.hidePopover(); close(true); } }}
      onClick={event => {
        const item = (event.target as HTMLElement).closest('[role^="menuitem"]');
        if (!item || item.hasAttribute("disabled") || item.getAttribute("role") !== "menuitem") return;
        menuRef.current?.hidePopover();
        close(true);
      }}>
      {point ? menu : null}
    </Menu>
  </div>;
});
