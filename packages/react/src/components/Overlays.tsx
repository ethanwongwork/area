/**
 * Anchored Popover, Menu and Tooltip: the behaviour behind the surfaces in primitives.tsx.
 * Each takes a `trigger` element and renders it followed by its surface, so the surface
 * follows the trigger in the tab order while the Popover API lifts it into the top layer.
 */
import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";
import type { FocusEvent as ReactFocusEvent, HTMLAttributes, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, ReactElement, ReactNode, Ref, RefObject } from "react";
import { assignRef, clearToolbar, useAnchoredPosition, useHoverIntent, useNativePopover, useOpenState } from "./overlay.ts";
import type { OverlayAlign, OverlaySide } from "./overlay.ts";

/*
 * spec: docs/specs/overlay.md, "Decisions". Menus and tooltips sit 4px from their trigger
 * (Radix Themes, Fluent, Primer, shadcn); popovers 8px (Radix Themes, React Aria, Spectrum 2);
 * an arrow adds its protrusion so its tip keeps the same gap (Spectrum 2, Fluent). Surfaces
 * keep 8px from the viewport edge (Ariakit 8, Radix Themes 10, React Aria 12).
 */
export const MENU_OFFSET = 4;
export const POPOVER_OFFSET = 8;
export const TOOLTIP_OFFSET = 4;
/** Popover arrow tip: 17px past the surface edge (the arrow path in primitives.tsx). */
export const POPOVER_ARROW_REACH = 17;
/** Tooltip arrow: an 8px square, half outside the surface. */
export const TOOLTIP_ARROW_REACH = 4;
export const OVERLAY_PADDING = 8;
/* spec: 500ms to show, instant for 300ms after another closes (Ariakit 500/300; Radix skip 300). */
export const TOOLTIP_DELAY = 500;
export const TOOLTIP_SKIP_DELAY = 300;
export const TOOLTIP_CLOSE_DELAY = 0;
/* spec: typeahead forgets after 1s (Radix, React Aria). */
export const TYPEAHEAD_RESET = 1000;

type Div = HTMLAttributes<HTMLDivElement>;
type Trigger = ReactElement<Record<string, unknown> & { ref?: Ref<HTMLElement> }>;

export interface AnchoredProps {
  /** The element that opens the overlay: usually a Button. */
  trigger: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The side of the trigger the surface prefers; it flips when that side lacks room. */
  side?: OverlaySide;
  align?: OverlayAlign;
  /** Gap between the trigger and the surface, in pixels. */
  offset?: number;
  /** Position against this element instead of the trigger: a field whose input opens it. */
  anchor?: RefObject<HTMLElement | null>;
}

const compose = <E,>(theirs: unknown, ours: (event: E) => void) => (event: E) => {
  if (typeof theirs === "function") theirs(event);
  if (!(event as { defaultPrevented?: boolean }).defaultPrevented) ours(event);
};

function useTriggerRef(trigger: ReactNode) {
  const node = useRef<HTMLElement | null>(null);
  const theirs = isValidElement(trigger) ? (trigger as Trigger).props.ref : undefined;
  const ref = (value: HTMLElement | null) => { node.current = value; assignRef(theirs as never, value); };
  return [node, ref] as const;
}

/**
 * A button trigger points at its surface with `popovertarget`, so the browser toggles it,
 * treats the trigger as the invoker (a press on it is not an outside press) and anchors to
 * it. Any other element falls back to toggling on click.
 */
const toggleOnClick = (setOpen: (open: boolean) => void, open: boolean) => (event: ReactMouseEvent<HTMLElement>) => {
  const invoker = event.currentTarget as HTMLButtonElement;
  if (invoker.popoverTargetElement) return;
  setOpen(!open);
};

/* --- Popover -------------------------------------------------------------- */

export function AnchoredPopover({ trigger, open: openProp, defaultOpen, onOpenChange, side = "bottom", align = "center", offset, anchor, arrow, surface }: AnchoredProps & { arrow?: boolean; surface: (props: Div & { ref: Ref<HTMLDivElement> }) => ReactNode }) {
  const id = useId();
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const [triggerNode, triggerRef] = useTriggerRef(trigger);
  const surfaceNode = useRef<HTMLDivElement | null>(null);
  useNativePopover(surfaceNode, triggerNode, open, setOpen);
  useAnchoredPosition(anchor ?? triggerNode, surfaceNode, open, { side, align, offset: offset ?? POPOVER_OFFSET + (arrow ? POPOVER_ARROW_REACH : 0), padding: OVERLAY_PADDING });
  // A non-modal popover takes focus on open: its first control, or the surface itself.
  useEffect(() => {
    if (!open) return;
    const node = surfaceNode.current;
    if (!node || node.contains(document.activeElement)) return;
    const first = node.querySelector<HTMLElement>("[autofocus], button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])");
    (first ?? node).focus({ preventScroll: true });
  }, [open]);
  const t = trigger as Trigger;
  return <>
    {isValidElement(trigger) ? cloneElement(t, {
      ref: triggerRef,
      "aria-expanded": open,
      "aria-controls": id,
      "aria-haspopup": "dialog",
      popoverTarget: id,
      onClick: compose(t.props.onClick, toggleOnClick(setOpen, open)),
    }) : trigger}
    {/* A non-modal dialog, as the trigger's aria-haspopup announces. */}
    {surface({ id, ref: surfaceNode, role: "dialog", popover: "auto", tabIndex: -1 } as Div & { ref: Ref<HTMLDivElement> })}
  </>;
}

/* --- Menu ----------------------------------------------------------------- */

const ITEM = "[role^='menuitem']";
// A menu's own rows: a nested MenuSub's rows belong to the submenu.
const enabledItems = (menu: HTMLElement) => [...menu.querySelectorAll<HTMLElement>(ITEM)].filter(item => item.closest("[role='menu']") === menu && !item.matches(":disabled, [aria-disabled='true'], [data-disabled]"));

export function AnchoredMenu({ trigger, open: openProp, defaultOpen, onOpenChange, side = "bottom", align = "start", offset = MENU_OFFSET, id: idProp, surface }: AnchoredProps & { /** The menu's id when the consumer sets one. */ id?: string; surface: (props: Div & { ref: Ref<HTMLDivElement> }) => ReactNode }) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const triggerId = `${id}-trigger`;
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const [triggerNode, triggerRef] = useTriggerRef(trigger);
  const surfaceNode = useRef<HTMLDivElement | null>(null);
  // Where focus lands when the menu opens: the surface (pointer), the first or the last item (keys).
  const entry = useRef<"surface" | "first" | "last">("surface");
  const typed = useRef({ text: "", at: 0 });
  useNativePopover(surfaceNode, triggerNode, open, setOpen);
  // A menu from a toolbar command clears the bar (ToolbarOverflow, as SplitButton's tool menus).
  useAnchoredPosition(triggerNode, surfaceNode, open, { side, align, offset, padding: OVERLAY_PADDING, anchorRect: clearToolbar });
  useEffect(() => {
    if (!open || !surfaceNode.current) return;
    const items = enabledItems(surfaceNode.current);
    const target = entry.current === "first" ? items[0] : entry.current === "last" ? items.at(-1) : surfaceNode.current;
    (target ?? surfaceNode.current).focus({ preventScroll: true });
  }, [open]);

  const move = (menu: HTMLElement, key: string) => {
    const items = enabledItems(menu);
    if (!items.length) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next = key === "Home" ? 0 : key === "End" ? items.length - 1
      : key === "ArrowDown" ? (index + 1) % items.length
      : (index <= 0 ? items.length - 1 : index - 1);
    items[next]?.focus();
  };
  const onMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const menu = event.currentTarget;
    // A nested submenu handles its own keys.
    if (event.defaultPrevented || (event.target as HTMLElement).closest("[role='menu']") !== menu) return;
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) { event.preventDefault(); move(menu, event.key); return; }
    if (event.key === "Tab") { setOpen(false); return; }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== " ") {
      const now = Date.now();
      typed.current = { text: (now - typed.current.at > TYPEAHEAD_RESET ? "" : typed.current.text) + event.key.toLowerCase(), at: now };
      const items = enabledItems(menu);
      const start = Math.max(0, items.indexOf(document.activeElement as HTMLElement));
      const ordered = [...items.slice(start + (typed.current.text.length === 1 ? 1 : 0)), ...items.slice(0, start + (typed.current.text.length === 1 ? 1 : 0))];
      ordered.find(item => item.textContent?.trim().toLowerCase().startsWith(typed.current.text))?.focus();
    }
  };
  const onMenuClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>(ITEM);
    // A checkbox row toggles and stays open; an action or a radio choice closes (audit D-11).
    if (!item || item.matches(":disabled, [aria-disabled='true'], [data-disabled], [role='menuitemcheckbox']") || item.dataset.keepOpen !== undefined) return;
    setOpen(false);
    triggerNode.current?.focus({ preventScroll: true });
  };
  // The pointer moves focus, so the keyboard continues from the item under it.
  const onMenuPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const item = (event.target as HTMLElement).closest<HTMLElement>(ITEM);
    if (item && document.activeElement !== item && !item.matches(":disabled, [data-disabled]")) item.focus({ preventScroll: true });
  };

  const t = trigger as Trigger;
  return <>
    {isValidElement(trigger) ? cloneElement(t, {
      ref: triggerRef,
      id: (t.props.id as string | undefined) ?? triggerId,
      "aria-haspopup": "menu",
      "aria-expanded": open,
      "aria-controls": id,
      onPointerDown: compose(t.props.onPointerDown, (event: ReactPointerEvent) => { if (event.pointerType === "mouse") entry.current = "surface"; }),
      popoverTarget: id,
      onClick: compose(t.props.onClick, toggleOnClick(setOpen, open)),
      onKeyDown: compose(t.props.onKeyDown, (event: ReactKeyboardEvent) => {
        if (["Enter", " ", "ArrowDown"].includes(event.key)) { entry.current = "first"; }
        if (event.key === "ArrowUp") { entry.current = "last"; }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); }
      }),
    }) : trigger}
    {surface({
      id,
      ref: surfaceNode,
      popover: "auto",
      tabIndex: -1,
      "aria-labelledby": (isValidElement(trigger) ? (t.props.id as string | undefined) : undefined) ?? triggerId,
      onKeyDown: onMenuKeyDown,
      onClick: onMenuClick,
      onPointerMove: onMenuPointerMove,
    } as Div & { ref: Ref<HTMLDivElement> })}
  </>;
}

/* --- Tooltip -------------------------------------------------------------- */

// React reports `window` as the related target when the pointer leaves its root.
const within = (node: Element | null, target: EventTarget | null) => target instanceof Node && !!node?.contains(target);

// When a tooltip closed recently, the next one opens without the delay, and without its fade
// (`data-instant`; motion pass 2026-10-07, docs/MOTION.md "Tooltip"). Only a tooltip that was
// shown starts the window: sweeping the pointer across a toolbar does not.
let lastClosed = 0;
const skipping = () => Date.now() - lastClosed < TOOLTIP_SKIP_DELAY;

export function AnchoredTooltip({ trigger, open: openProp, defaultOpen, onOpenChange, side = "top", align = "center", offset, arrow, delay = TOOLTIP_DELAY, closeDelay = TOOLTIP_CLOSE_DELAY, describes = true, surface }: AnchoredProps & { arrow?: boolean; delay?: number; closeDelay?: number; /** False when the tooltip's text is already the trigger's name, so it isn't announced twice. */ describes?: boolean; surface: (props: Div & { ref: Ref<HTMLDivElement> }) => ReactNode }) {
  const id = useId();
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const [triggerNode, triggerRef] = useTriggerRef(trigger);
  const surfaceNode = useRef<HTMLDivElement | null>(null);
  useNativePopover(surfaceNode, { current: null }, open, setOpen);
  useAnchoredPosition(triggerNode, surfaceNode, open, { side, align, offset: offset ?? TOOLTIP_OFFSET + (arrow ? TOOLTIP_ARROW_REACH : 0), padding: OVERLAY_PADDING });
  const shown = useRef(open);
  shown.current = open;
  const [instant, setInstant] = useState(false);
  const { show, hide, clear, hovers, focused } = useHoverIntent(open, setOpen, { delay, closeDelay, onClose: () => { if (shown.current) lastClosed = Date.now(); } });
  const t = trigger as Trigger;
  const describedBy = [t.props?.["aria-describedby"], describes ? id : undefined].filter(Boolean).join(" ") || undefined;
  return <>
    {isValidElement(trigger) ? cloneElement(t, {
      ref: triggerRef,
      "aria-describedby": describedBy,
      onPointerEnter: compose(t.props.onPointerEnter, (event: ReactPointerEvent) => { if (!hovers(event)) return; const skip = skipping(); setInstant(skip); show(skip ? 0 : delay); }),
      // Moving onto the tooltip (or the bridge over the gap) keeps it open.
      onPointerLeave: compose(t.props.onPointerLeave, (event: ReactPointerEvent) => { if (!within(surfaceNode.current, event.relatedTarget)) hide(); }),
      onPointerDown: compose(t.props.onPointerDown, () => hide(0)),
      onFocus: compose(t.props.onFocus, (event: ReactFocusEvent<HTMLElement>) => { setInstant(skipping()); focused(event); }),
      onBlur: compose(t.props.onBlur, () => hide(0)),
    }) : trigger}
    {surface({
      id,
      ref: surfaceNode,
      popover: "manual",
      "data-instant": instant ? "" : undefined,
      // Content on hover stays while the pointer is over it (WCAG 1.4.13).
      onPointerEnter: () => clear(),
      onPointerLeave: (event: ReactPointerEvent) => { if (!within(triggerNode.current, event.relatedTarget)) hide(); },
    } as Div & { ref: Ref<HTMLDivElement> })}
  </>;
}
