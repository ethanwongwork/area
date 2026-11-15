import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { Button, type ButtonProps } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { AnchoredPopover } from "./Overlays.tsx";
import { assignRef } from "./overlay.ts";
import type { OverlayAlign } from "./overlay.ts";
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import type { HTMLAttributes, ReactNode, Ref, RefObject } from "react";
import { cx, popoverVariants } from "../variants.ts";
import type { Div } from "./shared.ts";
export interface PopoverProps extends Div {
  /**
   * The trigger's side the popover opens on: `bottom` (default), `top`, `right` or `left`; it flips when there is no
   * room.
   */
  side?: VariantProps<typeof MANIFESTS.popover>["side"];
  /** Draw a curved shoulder pointing at the anchored element. */
  arrow?: boolean;
  /**
   * The element that opens it. With a trigger, the popover anchors to it, flips when the
   * preferred side lacks room, takes focus on open, and closes on Escape or an outside press.
   */
  trigger?: ReactNode;
  /** Whether the popover is open, controlled. */
  open?: boolean;
  /** Whether the popover starts open, uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the trigger, Escape or an outside press opens or closes the popover. */
  onOpenChange?: (open: boolean) => void;
  /** Where the popover lines up along the trigger. */
  align?: OverlayAlign;
  /** The gap from the trigger, in pixels. */
  offset?: number;
  /** Position against this element instead of the trigger, such as the field around an input. */
  anchor?: RefObject<HTMLElement | null>;
}
/** A PopoverTitle names the Popover it sits in, unless the Popover is named some other way. */
const PopoverTitleContext = /* @__PURE__ */ createContext<{ id: string; register: (id: string | null) => void } | null>(null);

export const Popover = /* @__PURE__ */ forwardRef<HTMLDivElement, PopoverProps>(function Popover({ side, arrow, trigger, open, defaultOpen, onOpenChange, align, offset, anchor, className, children, ...rest }, ref) {
  const fallbackTitleId = `${useId()}-title`;
  const [titleId, setTitleId] = useState<string | null>(null);
  const titleContext = useMemo(() => ({ id: fallbackTitleId, register: setTitleId }), [fallbackTitleId]);
  const named = rest["aria-label"] || rest["aria-labelledby"] || !titleId ? {} : { "aria-labelledby": titleId };
  const surface = (extra: Div & { ref?: Ref<HTMLDivElement> }) => <div className={popoverVariants({ side, arrow }, className)} {...named} {...rest} {...extra} ref={node => { assignRef(ref, node); assignRef(extra.ref as never, node); }}>
    <PopoverTitleContext.Provider value={titleContext}>{children}</PopoverTitleContext.Provider>
    {arrow ? <svg className="area-popover__arrow" viewBox="0 0 32 14" aria-hidden="true" focusable="false">
      <path d="M0 -1H32V0C24 0 23 3 20 9Q16 17 12 9C9 3 8 0 0 0Z" />
      <path className="area-popover__arrow-edge" d="M0 0C8 0 9 3 12 9Q16 17 20 9C23 3 24 0 32 0" />
    </svg> : null}
  </div>;
  if (trigger === undefined) return surface({});
  return <AnchoredPopover trigger={trigger} open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} side={side} align={align} offset={offset} anchor={anchor} arrow={arrow} id={rest.id} surface={surface} />;
});
export const PopoverHeader = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverHeader({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__header", className)} {...rest} />; });
export interface PopoverTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * The heading level, as Card title's `level` and Panel's `titleLevel`; `false` renders a plain block, for a card
   * that opens from running text such as a Hover card, so every preview doesn't add a heading to the page outline.
   */
  level?: 2 | 3 | 4 | 5 | 6 | false;
}
export const PopoverTitle = /* @__PURE__ */ forwardRef<HTMLHeadingElement, PopoverTitleProps>(function PopoverTitle({ level = 2, className, id, ...rest }, ref) {
  const context = useContext(PopoverTitleContext);
  const titleId = id ?? context?.id;
  useLayoutEffect(() => {
    if (!context || !titleId) return;
    context.register(titleId);
    return () => context.register(null);
  }, [context, titleId]);
  const H = level === false ? "div" : `h${level}` as "h2";
  return <H ref={ref} id={titleId} className={cx("area-popover__title", className)} {...rest} />;
});
/**
 * The header's close button: Popover's ghost square with the dismiss glyph. It closes the
 * popover it sits in through the platform (`hidePopover`), so an anchored Popover closes without
 * the consumer controlling `open`, and focus returns to the trigger (audit E-8).
 */
export const PopoverClose = /* @__PURE__ */ forwardRef<HTMLButtonElement, Omit<ButtonProps, "children"> & { "aria-label"?: string }>(function PopoverClose(
  { "aria-label": ariaLabel = "Close", onClick, ...rest }, ref,
) {
  return <Button ref={ref} variant="ghost" tone="neutral" size="sm" iconOnly icon={<Glyph name="dismiss" />} aria-label={ariaLabel} {...rest}
    onClick={event => { onClick?.(event); if (!event.defaultPrevented) event.currentTarget.closest<HTMLElement>("[popover]")?.hidePopover?.(); }} />;
});
export const PopoverDescription = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverDescription({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__description", className)} {...rest} />; });
export const PopoverBody = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverBody({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__body", className)} {...rest} />; });
export const PopoverFooter = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverFooter({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__footer", className)} {...rest} />; });
export interface PopoverStepProps extends HTMLAttributes<HTMLSpanElement> {
  /** This step, from 1. */
  current: number;
  /** How many steps the tour has. */
  total: number;
}
/** A teaching tour's progress at the start of the footer, "1 of 3", muted: the step and the total, so it says what
 * it counts. */
export const PopoverStep = /* @__PURE__ */ forwardRef<HTMLSpanElement, PopoverStepProps>(function PopoverStep({ current, total, className, ...rest }, ref) {
  return <span ref={ref} className={cx("area-popover__step", className)} {...rest}>{current} of {total}</span>;
});
export const PopoverMedia = /* @__PURE__ */ forwardRef<HTMLDivElement, Div>(function PopoverMedia({ className, ...rest }, ref) { return <div ref={ref} className={cx("area-popover__media", className)} {...rest} />; });

