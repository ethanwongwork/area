import { cloneElement, forwardRef, useEffect, useId, useRef } from "react";
import type { HTMLAttributes, ReactElement } from "react";
import { popoverVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { OVERLAY_PADDING, POPOVER_OFFSET, useTriggerRef } from "./Overlays.tsx";
import { useAnchoredPosition, useOpenState } from "./overlay.ts";
import type { OverlayAlign } from "./overlay.ts";

export interface HoverCardProps extends HTMLAttributes<HTMLDivElement> {
  /** The link or control the card previews. It must work on its own: the card is extra. */
  trigger: ReactElement<Record<string, unknown>>;
  side?: VariantProps<typeof MANIFESTS.popover>["side"];
  /** Which edges line up: the card starts at the link's start by default. */
  align?: OverlayAlign;
  /** Gap between the link and the card, in pixels (Popover's 8 by default). */
  offset?: number;
  /** ms the pointer rests on the trigger before the card opens (Radix 700; GitHub ≈ 750). */
  delay?: number;
  /** @deprecated Use `delay` (audit S17: one delay vocabulary with Tooltip). */
  openDelay?: number;
  /** ms after the pointer leaves the trigger and card before it closes, time to cross the gap. */
  closeDelay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Previews what a link points to while the pointer rests on it or keyboard focus reaches
 * it. Escape closes it; touch never opens it (the link is followed instead). Placed by the
 * shared overlay engine as Popover is (audit S16): 8px from the link, starting at the link's
 * start edge (GitHub's card starts at its link), flipping and shifting to stay on screen.
 */
export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(function HoverCard(
  { trigger, side = "bottom", align = "start", offset = POPOVER_OFFSET, delay, openDelay, closeDelay = 300, open: openProp, defaultOpen, onOpenChange, className, children, ...rest }, ref,
) {
  const id = useId();
  const cardId = `${id}-hover-card`;
  const surface = useRef<HTMLDivElement | null>(null);
  const [triggerNode, triggerRef] = useTriggerRef(trigger);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpenState] = useOpenState(openProp, defaultOpen, onOpenChange);
  // Report changes only: a blur while closed is not a close.
  const current = useRef(open);
  current.current = open;
  const setOpen = (next: boolean) => { if (next !== current.current) { current.current = next; setOpenState(next); } };
  const openAfter = delay ?? openDelay ?? 700;
  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  const show = (wait: number) => { clear(); timer.current = setTimeout(() => setOpen(true), wait); };
  const hide = (wait: number) => { clear(); timer.current = setTimeout(() => setOpen(false), wait); };
  useEffect(() => clear, []);
  useAnchoredPosition(triggerNode, surface, open, { side, align, offset, padding: OVERLAY_PADDING });
  useEffect(() => {
    const element = surface.current;
    if (!element || typeof element.showPopover !== "function") return;
    const shown = element.matches(":popover-open");
    if (open && !shown) element.showPopover();
    if (!open && shown) element.hidePopover();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    // As Tooltip: Escape closes only the card, never the surface it sits in (audit E-4).
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      event.stopPropagation();
      clear();
      setOpen(false);
    };
    addEventListener("keydown", onKey, true);
    return () => removeEventListener("keydown", onKey, true);
  }, [open]);

  const setRef = (element: HTMLDivElement | null) => {
    surface.current = element;
    if (typeof ref === "function") ref(element); else if (ref) ref.current = element;
  };
  const mouseOnly = (handler: () => void) => (event: { pointerType: string }) => { if (event.pointerType === "mouse" || event.pointerType === "pen") handler(); };
  const triggerProps = trigger.props as Record<string, ((...args: unknown[]) => void) | undefined>;
  return <>
    {cloneElement(trigger, {
      ref: triggerRef,
      onPointerEnter: (event: { pointerType: string }) => { triggerProps.onPointerEnter?.(event); mouseOnly(() => show(openAfter))(event); },
      onPointerLeave: (event: { pointerType: string }) => { triggerProps.onPointerLeave?.(event); mouseOnly(() => hide(closeDelay))(event); },
      onFocus: (event: FocusEvent & { target: Element }) => { triggerProps.onFocus?.(event); if (event.target.matches(":focus-visible")) show(openAfter); },
      onBlur: (event: unknown) => { triggerProps.onBlur?.(event); hide(0); },
    })}
    <div ref={setRef} id={cardId} popover="manual" {...rest}
      className={popoverVariants({ side }, ["area-hover-card", className].filter(Boolean).join(" "))}
      onPointerEnter={() => clear()} onPointerLeave={mouseOnly(() => hide(closeDelay))}>
      {children}
    </div>
  </>;
});
