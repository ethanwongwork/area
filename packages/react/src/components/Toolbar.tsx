import { cloneElement, createContext, forwardRef, useContext, useRef } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactElement, ReactNode } from "react";
import { cx, toolbarVariants, type VariantProps, MANIFESTS } from "../variants.ts";

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
  return <ToolbarOrientation.Provider value={orientation}><div ref={ref} {...rest} role="toolbar" aria-orientation={orientation} tabIndex={0}
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
    onKeyDown={handleKeyDown} /></ToolbarOrientation.Provider>;
});

export interface ToolbarItemProps { children: ReactElement<{ tabIndex?: number; "data-area-toolbar-item"?: string }> }
/** Marks an existing Button, link, or other focusable control for toolbar navigation. */
export function ToolbarItem({ children }: ToolbarItemProps) {
  return cloneElement(children, { tabIndex: -1, "data-area-toolbar-item": "" });
}

export const ToolbarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ToolbarGroup(
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

export interface ToolbarOverflowProps extends HTMLAttributes<HTMLDetailsElement> {
  label?: string;
  icon?: ReactNode;
}
/** A native disclosure for commands that do not fit in the primary row. */
export const ToolbarOverflow = forwardRef<HTMLDetailsElement, ToolbarOverflowProps>(function ToolbarOverflow(
  { label = "More actions", icon, className, children, onKeyDown, onClick, onBlur, ...rest }, ref,
) {
  return <details ref={ref} className={cx("area-toolbar__overflow", className)}
    onKeyDown={event => {
      onKeyDown?.(event);
      if (event.key === "Escape" && event.currentTarget.open) {
        event.currentTarget.open = false;
        event.currentTarget.querySelector<HTMLElement>("summary")?.focus();
        event.stopPropagation();
      }
    }}
    onClick={event => {
      onClick?.(event);
      if ((event.target as HTMLElement).closest(".area-toolbar__overflow-content button, .area-toolbar__overflow-content a")) {
        event.currentTarget.open = false;
        event.currentTarget.querySelector<HTMLElement>("summary")?.focus();
      }
    }}
    onBlur={event => {
      onBlur?.(event);
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) event.currentTarget.open = false;
    }} {...rest}>
    <summary className="area-toolbar__overflow-trigger" aria-label={label} data-area-toolbar-item="" tabIndex={-1}>
      {icon ?? <span className="area-toolbar__overflow-dots" aria-hidden="true">···</span>}
    </summary>
    <div className="area-toolbar__overflow-content">{children}</div>
  </details>;
});
