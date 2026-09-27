import { cloneElement, forwardRef, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, HTMLAttributes, ReactElement } from "react";
import { popoverVariants, type VariantProps, MANIFESTS } from "../variants.ts";

export interface HoverCardProps extends HTMLAttributes<HTMLDivElement> {
  /** The link or control the card previews. It must work on its own: the card is extra. */
  trigger: ReactElement<Record<string, unknown>>;
  side?: VariantProps<typeof MANIFESTS.popover>["side"];
  /** ms the pointer rests on the trigger before the card opens (Radix 700; GitHub ≈ 750). */
  openDelay?: number;
  /** ms after the pointer leaves the trigger and card before it closes, time to cross the gap. */
  closeDelay?: number;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Previews what a link points to while the pointer rests on it or keyboard focus reaches
 * it. Escape closes it; touch never opens it (the link is followed instead).
 */
export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(function HoverCard(
  { trigger, side = "bottom", openDelay = 700, closeDelay = 300, onOpenChange, className, children, ...rest }, ref,
) {
  const id = useId();
  const cardId = `${id}-hover-card`;
  const surface = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  const show = (delay: number) => { clear(); timer.current = setTimeout(() => setOpen(true), delay); };
  const hide = (delay: number) => { clear(); timer.current = setTimeout(() => setOpen(false), delay); };
  useEffect(() => clear, []);
  useEffect(() => {
    const element = surface.current;
    if (!element || typeof element.showPopover !== "function") return;
    const shown = element.matches(":popover-open");
    if (open && !shown) element.showPopover();
    if (!open && shown) element.hidePopover();
    onOpenChange?.(open);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { clear(); setOpen(false); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const setRef = (element: HTMLDivElement | null) => {
    surface.current = element;
    if (typeof ref === "function") ref(element); else if (ref) ref.current = element;
  };
  const mouseOnly = (handler: () => void) => (event: { pointerType: string }) => { if (event.pointerType === "mouse" || event.pointerType === "pen") handler(); };
  const triggerProps = trigger.props as Record<string, ((...args: unknown[]) => void) | undefined>;
  return <span className="area-popover-anchor" style={{ "--_popover-anchor": `--area-hover-card-${id.replace(/[^a-zA-Z0-9_-]/g, "")}` } as CSSProperties}>
    {cloneElement(trigger, {
      onPointerEnter: (event: { pointerType: string }) => { triggerProps.onPointerEnter?.(event); mouseOnly(() => show(openDelay))(event); },
      onPointerLeave: (event: { pointerType: string }) => { triggerProps.onPointerLeave?.(event); mouseOnly(() => hide(closeDelay))(event); },
      onFocus: (event: FocusEvent & { target: Element }) => { triggerProps.onFocus?.(event); if (event.target.matches(":focus-visible")) show(openDelay); },
      onBlur: (event: unknown) => { triggerProps.onBlur?.(event); hide(0); },
    })}
    <div ref={setRef} id={cardId} popover="manual" {...rest}
      className={popoverVariants({ side }, ["area-hover-card", className].filter(Boolean).join(" "))}
      onPointerEnter={() => clear()} onPointerLeave={mouseOnly(() => hide(closeDelay))}>
      {children}
    </div>
  </span>;
});
