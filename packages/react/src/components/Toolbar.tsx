import { cloneElement, createContext, forwardRef, useContext, useRef } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactElement, ReactNode } from "react";
import { cx, menuVariants, toolbarVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { AnchoredMenu } from "./Overlays.tsx";
import { assignRef } from "./overlay.ts";
import { InToolbar, clearToolbar, toolbarItemProps } from "./toolbar-context.ts";

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof MANIFESTS.toolbar>["variant"];
  size?: VariantProps<typeof MANIFESTS.toolbar>["size"];
  orientation?: VariantProps<typeof MANIFESTS.toolbar>["orientation"];
  fullWidth?: boolean;
}

const itemsIn = (root: HTMLElement) => Array.from(root.querySelectorAll<HTMLElement>("[data-area-toolbar-item]"))
  .filter(item => !item.matches(":disabled, [aria-disabled='true']") && item.getClientRects().length > 0);
const ToolbarOrientation = createContext<"horizontal" | "vertical">("horizontal");

/** One Tab stop. Arrow keys move across commands without activating them. */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { variant, size, orientation = "horizontal", fullWidth, className, onFocusCapture, onBlurCapture, onKeyDown, ...rest }, ref,
) {
  const lastFocused = useRef<HTMLElement | null>(null);
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const root = event.currentTarget;
    const target = event.target as HTMLElement;
    const item = target.closest<HTMLElement>("[data-area-toolbar-item]");
    if (!item || !root.contains(item)) return;
    const items = itemsIn(root);
    const index = items.indexOf(item);
    if (index < 0) return;
    const rtl = getComputedStyle(root).direction === "rtl";
    const forward = orientation === "vertical" ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
    const backward = orientation === "vertical" ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
    let next = -1;
    if (event.key === forward) next = (index + 1) % items.length;
    else if (event.key === backward) next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    if (next < 0) return;
    event.preventDefault();
    items[next]?.focus();
  }
  return <InToolbar.Provider value={true}><ToolbarOrientation.Provider value={orientation}><div ref={ref} {...rest} role="toolbar" aria-orientation={orientation} tabIndex={0}
    className={toolbarVariants({ variant, size, orientation, fullWidth }, className)}
    onFocusCapture={event => {
      onFocusCapture?.(event);
      if (event.defaultPrevented) return;
      const root = event.currentTarget;
      if (event.target === root) {
        const items = itemsIn(root);
        const destination = lastFocused.current && items.includes(lastFocused.current) ? lastFocused.current : items[0];
        if (destination) destination.focus();
      } else if ((event.target as HTMLElement).matches("[data-area-toolbar-item]")) {
        lastFocused.current = event.target as HTMLElement;
        root.tabIndex = -1;
      }
    }}
    onBlurCapture={event => {
      onBlurCapture?.(event);
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) event.currentTarget.tabIndex = 0;
    }}
    onKeyDown={handleKeyDown} /></ToolbarOrientation.Provider></InToolbar.Provider>;
});

export interface ToolbarItemProps { children: ReactElement<{ tabIndex?: number; "data-area-toolbar-item"?: string }> }
/** Marks an existing Button, link, or other focusable control for toolbar navigation. */
export function ToolbarItem({ children }: ToolbarItemProps) {
  return cloneElement(children, { tabIndex: -1, "data-area-toolbar-item": "" });
}

/** Groups related commands. One-of-several choices (Figma's mode switch, text alignment) are a
 * Segmented control placed in the toolbar, not a group variant. */
export type ToolbarGroupProps = HTMLAttributes<HTMLDivElement>;
export const ToolbarGroup = forwardRef<HTMLDivElement, ToolbarGroupProps>(function ToolbarGroup(
  { className, ...rest }, ref,
) {
  return <div ref={ref} role="group" className={cx("area-toolbar__group", className)} {...rest} />;
});

export const ToolbarSeparator = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function ToolbarSeparator(
  { className, ...rest }, ref,
) {
  const orientation = useContext(ToolbarOrientation);
  return <span ref={ref} role="separator" aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
    className={cx("area-toolbar__separator", className)} {...rest} />;
});

export interface ToolbarOverflowProps extends HTMLAttributes<HTMLDivElement> {
  /** Names the More button, and so the menu ("More actions"). */
  "aria-label"?: string;
  /** @deprecated Name it with `aria-label` (audit S17: `label` is visible text; names are `aria-label`). */
  label?: string;
  /** Replaces the three dots. */
  icon?: ReactNode;
  /** The commands that don't fit in the row: MenuItems. */
  children?: ReactNode;
}
/**
 * Commands that don't fit in the primary row: a ghost "More" icon Button, one of the toolbar's
 * roving items, opening a Menu (audit S16 / A-8, owner 2026-09-30). The menu is a native
 * popover placed by the shared overlay engine, clearing the bar by 4 at its end edge, with
 * Menu's keys: Enter, Space or ArrowDown open on the first item, ArrowUp on the last.
 */
export const ToolbarOverflow = forwardRef<HTMLDivElement, ToolbarOverflowProps>(function ToolbarOverflow(
  { label, "aria-label": ariaLabel = label ?? "More actions", icon, className, children, ...rest }, ref,
) {
  const orientation = useContext(ToolbarOrientation);
  return <AnchoredMenu
    trigger={<Button variant="ghost" iconOnly icon={icon ?? <Glyph name="more-horizontal" />} aria-label={ariaLabel} {...toolbarItemProps} />}
    side={orientation === "vertical" ? "right" : "bottom"} align="end" anchorRect={clearToolbar}
    surface={props => <div role="menu" {...rest} {...props} className={menuVariants({}, className)}
      ref={node => { assignRef(ref, node); assignRef(props.ref as never, node); }}>{children}</div>} />;
});
