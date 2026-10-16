import { cloneElement, forwardRef, useEffect, useId, useLayoutEffect, useRef } from "react";
import type { HTMLAttributes, ReactElement, Ref } from "react";
import { popoverVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { assignRef, useAnchoredPosition, useHoverIntent, useOpenState, type OverlayAlign } from "./overlay.ts";
import { OVERLAY_PADDING, POPOVER_OFFSET } from "./Overlays.tsx";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export interface HoverCardProps extends HTMLAttributes<HTMLDivElement> {
  /** The link or control the card previews. It must work on its own: the card is extra. */
  trigger: ReactElement<Record<string, unknown>>;
  side?: VariantProps<typeof MANIFESTS.popover>["side"];
  /** Where the card lines up along the link. Defaults to its start. */
  align?: OverlayAlign;
  /** Gap from the link, in pixels. Defaults to Popover's 8. */
  offset?: number;
  /** ms the pointer rests on the trigger before the card opens (Radix 700; GitHub ≈ 750). The
   * same name as Tooltip's (audit S17). */
  delay?: number;
  /** @deprecated Use `delay`. */
  openDelay?: number;
  /** ms after the pointer leaves the trigger and card before it closes, time to cross the gap. */
  closeDelay?: number;
  /**
   * Keyboard focus opens the card (at once, as Tooltip). Turn it off only where the card's content and actions are
   * also reached another way: an option in a sheet the arrows sweep across, whose details a panel beside it shows
   * (the app's Icons tab and its Inspector). The pointer still opens it. docs/specs/hover-card.md.
   */
  openOnFocus?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Previews what a link points to while the pointer rests on it or keyboard focus reaches
 * it (keyboard focus opens it at once, as Tooltip). Escape closes it; touch never opens it (the
 * link is followed instead).
 */
export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(function HoverCard(
  { trigger, side = "bottom", align = "start", offset = POPOVER_OFFSET, delay, openDelay, closeDelay = 300, openOnFocus = true, open: openProp, defaultOpen, onOpenChange, className, children, ...rest }, ref,
) {
  const id = useId();
  const cardId = `${id}-hover-card`;
  const surface = useRef<HTMLDivElement | null>(null);
  const anchor = useRef<HTMLElement | null>(null);
  const openDelayMs = delay ?? openDelay ?? 700;
  const [open, setOpenState] = useOpenState(openProp, defaultOpen, onOpenChange);
  // Report changes only: a blur or a leave while closed is not a close.
  const current = useRef(open);
  current.current = open;
  const setOpen = (next: boolean) => { if (next !== current.current) { current.current = next; setOpenState(next); } };
  // Tooltip's input rules (audit E-18): mouse and pen, keyboard focus at once, one Escape handler.
  const { show, hide, clear, hovers, focused } = useHoverIntent(open, setOpen, { delay: openDelayMs, closeDelay });
  // Shown before it is placed, in a layout effect, as Popover's useNativePopover: the engine then
  // measures the real card, so the enter starts at its final place and scales from the link
  // (motion 2026-10-07: it was shown after paint and measured hidden, at 0 × 0, then re-placed).
  useIsoLayoutEffect(() => {
    const element = surface.current;
    if (!element || typeof element.showPopover !== "function") return;
    const shown = element.matches(":popover-open");
    if (open && !shown) element.showPopover();
    if (!open && shown) element.hidePopover();
  }, [open]);
  // Popover's engine and gap (audit S16, E-5): flips and shifts, reports its side for the motion
  // origin. spec: the card starts at the link's start rather than centring on it (GitHub's card
  // starts 20 before its link), so a card for a link near the page edge stays on the page.
  useAnchoredPosition(anchor, surface, open, { side, align, offset, padding: OVERLAY_PADDING });
  const setRef = (element: HTMLDivElement | null) => {
    surface.current = element;
    if (typeof ref === "function") ref(element); else if (ref) ref.current = element;
  };
  const triggerProps = trigger.props as Record<string, ((...args: unknown[]) => void) | undefined>;
  const theirRef = (trigger.props as { ref?: Ref<HTMLElement> }).ref;
  return <>
    {cloneElement(trigger, {
      ref: (element: HTMLElement | null) => { anchor.current = element; assignRef(theirRef as never, element); },
      onPointerEnter: (event: { pointerType: string }) => { triggerProps.onPointerEnter?.(event); if (hovers(event)) show(); },
      onPointerLeave: (event: { pointerType: string }) => { triggerProps.onPointerLeave?.(event); if (hovers(event)) hide(); },
      onFocus: (event: { currentTarget: Element }) => { triggerProps.onFocus?.(event); if (openOnFocus) focused(event); },
      onBlur: (event: unknown) => { triggerProps.onBlur?.(event); hide(0); },
    })}
    <div ref={setRef} id={cardId} popover="manual" {...rest}
      className={popoverVariants({ side }, ["area-hover-card", className].filter(Boolean).join(" "))}
      onPointerEnter={() => clear()} onPointerLeave={event => { if (hovers(event)) hide(); }}>
      {children}
    </div>
  </>;
});
