import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { AnchoredTooltip } from "./Overlays.tsx";
import { assignRef } from "./overlay.ts";
import type { OverlayAlign } from "./overlay.ts";
import { Children, forwardRef } from "react";
import type { ReactNode, Ref } from "react";
import { tooltipVariants } from "../variants.ts";
import type { Div } from "./shared.ts";
/* --- Surfaces ------------------------------------------------------------- */

export interface TooltipProps extends Div {
  /** The side of the trigger that this visible tooltip occupies. */
  side?: VariantProps<typeof MANIFESTS.tooltip>["side"];
  /** Draws a subtly rounded pointer toward the trigger. Omitted by default. */
  arrow?: boolean;
  /**
   * The control it names. With a trigger, the tooltip shows after a delay on hover and at
   * once on keyboard focus, hides on Escape, blur or pointer leave, and describes the trigger.
   */
  trigger?: ReactNode;
  /** Whether the tooltip shows, controlled. */
  open?: boolean;
  /** Whether the tooltip starts shown, uncontrolled. */
  defaultOpen?: boolean;
  /** Called when hover, focus, Escape or blur shows or hides the tooltip. */
  onOpenChange?: (open: boolean) => void;
  /** Where the tooltip lines up along the trigger. */
  align?: OverlayAlign;
  /** The gap from the trigger, in pixels. */
  offset?: number;
  /** Hover delay before showing, in milliseconds. */
  delay?: number;
  /** Delay before hiding after the pointer leaves, in milliseconds; the same name as Hover card's. */
  closeDelay?: number;
  /**
   * False when the tooltip repeats the trigger's accessible name (an icon-only button's label), so
   * it is not announced twice; the tooltip then only shows. Defaults to true: it describes the trigger.
   */
  describes?: boolean;
}

export const Tooltip = /* @__PURE__ */ forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { side, arrow, trigger, open, defaultOpen, onOpenChange, align, offset, delay, closeDelay, describes, className, children, ...rest },
  ref,
) {
  // Words are the trimmed text part, centred on their cap beside a Kbd (inset.css, "One centring model").
  const content = Children.map(children, child => typeof child === "string" || typeof child === "number"
    ? <span className={tooltipVariants.element("text")}>{child}</span> : child);
  const surface = (extra: Div & { ref?: Ref<HTMLDivElement> }) => (
    <div role="tooltip" className={tooltipVariants({ side, arrow }, className)} {...rest} {...extra} ref={node => { assignRef(ref, node); assignRef(extra.ref as never, node); }}>{content}</div>
  );
  if (trigger === undefined) return surface({});
  return <AnchoredTooltip trigger={trigger} open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} side={side} align={align} offset={offset} arrow={arrow} delay={delay} closeDelay={closeDelay} describes={describes} id={rest.id} surface={surface} />;
});

