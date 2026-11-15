import { forwardRef, useContext, useEffect, useId, useRef } from "react";
import type { HTMLAttributes, KeyboardEvent, MouseEventHandler, ReactNode } from "react";
import { Button, type ButtonProps, type ButtonTone } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Menu } from "./Menu.tsx";
import { MANIFESTS, splitButtonVariants, type VariantProps } from "../variants.ts";
import { InToolbar, ToolbarSize, toolbarItemProps } from "./toolbar-context.ts";
import { MENU_OFFSET, OVERLAY_PADDING } from "./Overlays.tsx";
import { assignRef, clearToolbar, useAnchoredPosition, useOpenState } from "./overlay.ts";

export interface SplitButtonProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick" | "children"> {
  /**
   * Fill treatment, shared by both parts. `ghost` is a tool with its menu: two plates 1px apart with no drawn
   * divider, each with its own hover; use it icon-only in a toolbar.
   */
  variant?: VariantProps<typeof MANIFESTS.splitButton>["variant"];
  /** Shows only the action's icon; `children` becomes the action's accessible name. */
  iconOnly?: boolean;
  /** The action is the current tool (a pressed toggle, Button's selected paint). */
  selected?: boolean;
  /** The tone of both halves, as Button's; neutral by default. */
  tone?: ButtonTone;
  /** The size of both halves, as Button's; md by default. */
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
  /** Disables the action and the menu button together. */
  disabled?: boolean;
  /**
   * The default action is running, as Button's `loading`: the action shows Button's spinner and is busy, and the menu's
   * trigger is disabled until it ends, so a second action can't start beside it.
   */
  loading?: boolean;
  /** The menu is open (controlled); `defaultOpen` opens it at first; `onOpenChange` hears it open and close, as Menu's. */
  open?: boolean;
  /** Whether the menu starts open, uncontrolled; closed by default. */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Extra props for the default action's button. */
  actionProps?: Omit<ButtonProps, "children" | "onClick" | "variant" | "tone" | "size" | "disabled" | "icon" | "loading">;
}

const items = (menu: HTMLElement | null) =>
  [...(menu?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? [])];

/**
 * A default action joined to a menu of related actions. Both parts are real buttons in the Tab order; the
 * trigger has its own name, reports `aria-expanded`, and opens a Menu in a native popover,
 * which supplies Escape, light dismissal and focus return. Arrow keys move through the menu.
 */
export const SplitButton = /* @__PURE__ */ forwardRef<HTMLDivElement, SplitButtonProps>(function SplitButton(
  { variant = "solid", tone, size: sizeProp, children, icon, iconOnly, selected, onClick, menu, menuLabel = "More options", disabled, loading, open: openProp,
    defaultOpen, onOpenChange, actionProps, className, style, ...rest },
  ref,
) {
  const id = useId();
  const inToolbar = useContext(InToolbar);
  const toolbarSize = useContext(ToolbarSize);
  const size = sizeProp ?? toolbarSize;
  const roving = inToolbar ? toolbarItemProps : {};
  const menuId = `${id}-menu`;
  const popup = useRef<HTMLDivElement | null>(null);
  const group = useRef<HTMLDivElement | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  // The popover's own toggle reports through the latest setter; the listener is set up once.
  const openNow = useRef(open);
  openNow.current = open;
  const setOpenNow = useRef(setOpen);
  setOpenNow.current = setOpen;
  const triggerDisabled = disabled || loading;
  // spec (docs/specs/split-button.md, "Menu placement"): placed like every anchored menu
  // (overlay.ts), 4 away, flipping to the other side without room.
  // - A text split hangs under the whole group, flush with its end edge (Notion's New menu:
  //   4 below, 0.3 from the end).
  // - An icon tool's menu starts at its chevron's start edge and clears the toolbar it sits in
  //   by 4 (Figma's toolbelt: menu left = chevron left, 4 from the bar, 12 from the tool).
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
      if (next !== openNow.current) setOpenNow.current(next);
      if (next) items(element).at(focusLast.current ? -1 : 0)?.focus();
      focusLast.current = false;
    };
    element.addEventListener("toggle", onToggle);
    return () => element.removeEventListener("toggle", onToggle);
  }, []);

  // A controlled or default open shows the native popover; a close from outside hides it.
  useEffect(() => {
    const element = popup.current;
    if (!element || typeof element.showPopover !== "function") return;
    const shown = element.matches(":popover-open");
    if (open && !shown && !triggerDisabled) element.showPopover();
    if (!open && shown) element.hidePopover();
  }, [open, triggerDisabled]);

  const close = () => { if (popup.current?.matches(":popover-open")) popup.current.hidePopover(); };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !triggerDisabled) {
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
      className={splitButtonVariants({ variant, size, iconOnly }, className)}
      style={style}
    >
      <Button {...actionProps} {...roving} className={["area-split-button__action", actionProps?.className].filter(Boolean).join(" ")}
        variant={variant} tone={tone} size={size} icon={icon} iconOnly={iconOnly} selected={selected} disabled={disabled} loading={loading} onClick={onClick}
        aria-label={iconOnly && typeof children === "string" ? children : actionProps?.["aria-label"]}>
        {iconOnly ? null : children}
      </Button>
      {/* The icon-only trigger's chevron sits in a 12 box (split-button.css), so the glyph draws its
          12 line rather than a 16 line shrunk by 0.75 (docs/MOTION.md, Crispness 4). */}
      <Button {...roving} ref={trigger} className="area-split-button__trigger" variant={variant} tone={tone} size={size} iconOnly
        icon={<Glyph name="chevron-down" size={iconOnly ? 12 : 16} />} aria-label={menuLabel} aria-haspopup="menu" aria-expanded={open}
        aria-controls={menuId} disabled={triggerDisabled} popoverTarget={menuId} onKeyDown={onTriggerKeyDown} />
      <Menu ref={popup} id={menuId} popover="auto" aria-label={menuLabel}
        className="area-split-button__menu" onKeyDown={onMenuKeyDown}
        // An inactive row (aria-disabled, components audit V2) does nothing and keeps the menu open.
        onClick={(event) => { if ((event.target as HTMLElement).closest('[role="menuitem"]:not([aria-disabled="true"])')) close(); }}>
        {menu}
      </Menu>
    </div>
  );
});
