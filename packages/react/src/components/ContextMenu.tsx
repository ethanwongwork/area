import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from "react";
import { contextMenuVariants } from "../variants.ts";
import { Menu } from "./primitives.tsx";

export interface ContextMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  /**
   * The menu's rows: MenuItem, MenuLabel, MenuSeparator. With `itemSelector`, a function of the item that was
   * right-clicked (or focused, for Shift+F10), so one ContextMenu serves a whole list of rows.
   */
  menu: ReactNode | ((item: HTMLElement) => ReactNode);
  /**
   * Opens only on an element matching this selector inside the area (a row, a tile, `[data-key]`), and hands it to
   * `menu`. Elsewhere the browser's own menu shows. The item carries `data-context-target` while the menu is open.
   */
  itemSelector?: string;
  /** Names the menu for assistive tech ("Page actions"); the menu is a sub-part, as SplitButton's `menuLabel` (audit D-18). */
  menuLabel?: string;
  /** @deprecated Use `menuLabel`. */
  label?: string;
  /** The area that opens the menu when right-clicked. */
  children: ReactNode;
  /**
   * Opens or closes it from outside (controlled), as Menu's `open`; `defaultOpen` opens it on mount. Opened this way, with
   * no pointer to open at, it opens at the area's start as the keyboard opens it (with an `itemSelector`, at the first
   * item). A right-click or Shift+F10 still opens it and reports through `onOpenChange`.
   */
  open?: boolean;
  defaultOpen?: boolean;
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
  { menu, menuLabel, label: labelProp, itemSelector, children, open: openProp, defaultOpen, onOpenChange, disabled, className, onContextMenu, onKeyDown, ...rest }, ref,
) {
  const area = useRef<HTMLDivElement | null>(null);
  const [item, setItem] = useState<HTMLElement | null>(null);
  // The item the menu acts on, from where it opened: none without a selector, and no menu outside an item.
  const itemAt = (target: EventTarget | null) => {
    if (!itemSelector) return undefined;
    const found = (target as HTMLElement | null)?.closest?.<HTMLElement>(itemSelector) ?? null;
    return found && area.current?.contains(found) ? found : null;
  };
  const menuRef = useRef<HTMLDivElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [point, setPoint] = useState<{ x: number; y: number; keyboard: boolean; rtl?: boolean } | null>(null);
  // The rows stay mounted while the menu fades out, so the exit shows the menu, not an empty box.
  const [leaving, setLeaving] = useState(false);
  const opened = useRef(false);
  opened.current = point !== null;

  // Open at the point, then pull the menu back inside the viewport (flip across the pointer).
  useLayoutEffect(() => {
    const element = menuRef.current;
    if (!element || !point || typeof element.showPopover !== "function") return;
    if (!element.matches(":popover-open")) element.showPopover();
    // Layout size, not the bounding rect: the enter starts at scale 0.97, which the rect includes.
    // Under CSS zoom (a scaled preview) the pointer is in viewport pixels, the menu's lengths in its own.
    const zoom = (element as HTMLElement & { currentCSSZoom?: number }).currentCSSZoom || 1;
    const width = element.offsetWidth * zoom, height = element.offsetHeight * zoom;
    const margin = 8;
    // Whole pixels (motion 2026-10-07, crispness B10): a trackpad or page zoom gives fractional
    // pointer coordinates, which would put the menu's text and edges between pixels.
    const px = Math.round(point.x), py = Math.round(point.y);
    let x = px, y = py;
    // A keyboard-opened menu starts at the element's start edge, which is its right in RTL.
    if (point.rtl) x -= Math.round(width);
    if (x + width > innerWidth - margin) x = Math.max(margin, Math.round(x - width));
    if (y + height > innerHeight - margin) y = Math.max(margin, Math.round(y - height));
    element.style.setProperty("--_context-x", `${x / zoom}px`);
    element.style.setProperty("--_context-y", `${y / zoom}px`);
    // The menu grows from the pointer: its place inside the menu after any flip (docs/MOTION.md).
    element.style.setProperty("--_context-origin-x", `${Math.min(Math.max(px - x, 0), width) / zoom}px`);
    element.style.setProperty("--_context-origin-y", `${Math.min(Math.max(py - y, 0), height) / zoom}px`);
    // The pointer opens with nothing highlighted; the keyboard lands on the first row (WAI menu).
    (point.keyboard ? itemsOf(element)[0] : element)?.focus({ preventScroll: true });
  }, [point]);

  // After the exit (its transitions finished, or none under reduced motion) the rows unmount.
  useLayoutEffect(() => {
    const element = menuRef.current;
    if (!leaving || point) return;
    const done = () => { if (!opened.current) setLeaving(false); };
    if (!element || typeof element.getAnimations !== "function") { done(); return; }
    Promise.all(element.getAnimations().map(animation => animation.finished)).then(done, done);
  }, [leaving, point]);

  // The acted-on item says so while the menu is open (Finder and Notion keep the right-clicked row marked).
  useEffect(() => {
    if (!item || !point) return;
    item.setAttribute("data-context-target", "");
    return () => item.removeAttribute("data-context-target");
  }, [item, point]);

  // `open` / `defaultOpen` from outside: open at the area's start (or its first item) as the keyboard does, or close.
  const wanted = openProp ?? (defaultOpen ? true : undefined);
  useEffect(() => {
    if (wanted === undefined || disabled) return;
    if (wanted && !opened.current && area.current) {
      const first = itemSelector ? area.current.querySelector<HTMLElement>(itemSelector) : null;
      if (itemSelector && !first) return;
      if (first) setItem(first);
      returnFocus.current = document.activeElement as HTMLElement | null;
      const target = first ?? area.current;
      const rect = target.getBoundingClientRect();
      const rtl = getComputedStyle(target).direction === "rtl";
      setPoint({ x: rtl ? rect.right : rect.left, y: first ? rect.bottom : rect.top, keyboard: true, rtl });
    } else if (!wanted && opened.current) {
      menuRef.current?.hidePopover?.();
      setLeaving(true);
      setPoint(null);
    }
  }, [wanted]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = (restore: boolean) => {
    setLeaving(true);
    setPoint(null);
    onOpenChange?.(false);
    if (restore) returnFocus.current?.focus({ preventScroll: true });
  };
  const open = (event: MouseEvent<HTMLDivElement>) => {
    onContextMenu?.(event);
    if (disabled || event.defaultPrevented) return;
    const found = itemAt(event.target);
    if (found === null) return;
    if (found) setItem(found);
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
    const found = itemAt(event.target);
    if (found === null) return;
    if (found) setItem(found);
    event.preventDefault();
    returnFocus.current = document.activeElement as HTMLElement | null;
    setPoint(anchorAt(event.target as HTMLElement));
    onOpenChange?.(true);
  };

  return <div ref={node => { area.current = node; if (typeof ref === "function") ref(node); else if (ref) ref.current = node; }} className={contextMenuVariants({}, className)} onContextMenu={open} onKeyDown={openFromKeyboard} {...rest}>
    {children}
    <Menu ref={menuRef} popover="auto" aria-label={menuLabel ?? labelProp ?? "Context menu"} tabIndex={-1} className="area-context-menu__menu"
      // Its rows exist only while it is open, so a closed menu holds no empty row.
      emptyText={point || leaving ? undefined : null}
      onToggle={event => { if ((event.nativeEvent as ToggleEvent).newState === "closed" && point) close(false); }}
      onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); menuRef.current?.hidePopover(); close(true); } else if (event.key === "Tab") { event.preventDefault(); menuRef.current?.hidePopover(); close(true); } }}
      onClick={event => {
        const item = (event.target as HTMLElement).closest('[role^="menuitem"]');
        // As an anchored Menu: a checkbox row stays open, an action or a radio choice closes (audit D-11).
        // An inactive row (aria-disabled, components audit V2) does nothing and keeps the menu open.
        if (!item || item.hasAttribute("disabled") || item.getAttribute("aria-disabled") === "true" || item.getAttribute("role") === "menuitemcheckbox" || (item as HTMLElement).dataset.keepOpen !== undefined) return;
        menuRef.current?.hidePopover();
        close(true);
      }}>
      {point || leaving ? (typeof menu === "function" ? (item ? menu(item) : null) : menu) : null}
    </Menu>
  </div>;
});
