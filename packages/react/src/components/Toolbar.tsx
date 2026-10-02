import { cloneElement, createContext, forwardRef, useContext, useRef } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactElement, ReactNode } from "react";
import { cx, toolbarVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { InToolbar, ToolbarSize, toolbarItemProps } from "./toolbar-context.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Menu, type MenuProps } from "./primitives.tsx";

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
  return <InToolbar.Provider value={true}><ToolbarSize.Provider value={size ?? undefined}><ToolbarOrientation.Provider value={orientation}><div ref={ref} {...rest} role="toolbar" aria-orientation={orientation} tabIndex={0}
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
    onKeyDown={handleKeyDown} /></ToolbarOrientation.Provider></ToolbarSize.Provider></InToolbar.Provider>;
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

export interface ToolbarOverflowProps extends Omit<MenuProps, "trigger"> {
  /** Names the trigger that opens the menu, as SplitButton's `menuLabel` (audit A-17). */
  menuLabel?: string;
  /** @deprecated Use `menuLabel`. */
  label?: string;
  /** Replaces the trigger's dots. */
  icon?: ReactNode;
}
/**
 * Commands that do not fit in the primary row: a ghost icon Button that opens a Menu of
 * MenuItems, SplitButton's model (audit S16, A-8). The trigger is one of the toolbar's roving
 * items; the menu opens in the top layer, placed by the shared overlay engine.
 */
export const ToolbarOverflow = forwardRef<HTMLDivElement, ToolbarOverflowProps>(function ToolbarOverflow(
  { menuLabel, label, icon, side, align, ...rest }, ref,
) {
  const orientation = useContext(ToolbarOrientation);
  // A horizontal bar opens below, ending at the trigger (it usually closes the row); a vertical
  // one opens beside it.
  return <Menu ref={ref} side={side ?? (orientation === "vertical" ? "right" : "bottom")} align={align ?? (orientation === "vertical" ? "start" : "end")} {...rest}
    trigger={<Button variant="ghost" iconOnly aria-label={menuLabel ?? label ?? "More actions"} icon={icon ?? <Glyph name="more" />} {...toolbarItemProps} />} />;
});
