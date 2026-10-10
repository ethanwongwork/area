// Toggletip: a short note behind a small info or help button beside a label. It previews on hover
// and keyboard focus like a Tooltip, and a press pins it open. Spec: docs/specs/toggletip.md.
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, Ref } from "react";
import { toggletipVariants, tooltipVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { AnchoredToggletip } from "./Overlays.tsx";
import type { OverlayAlign, OverlaySide } from "./overlay.ts";

type ToggletipVariants = VariantProps<typeof MANIFESTS.toggletip>;

export interface ToggletipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "content"> {
  /** The note: a sentence or two of phrasing content, optionally with a Link (`ink="inherit"`). It also describes the button. */
  content: ReactNode;
  /** `info` (default) explains; `help` guides (Spectrum's distinction). Only the mark changes. */
  icon?: "info" | "help";
  /** `md` (default) sits beside 14/20 text; `sm` beside 12/16 captions. Compact density steps both down. */
  size?: ToggletipVariants["size"];
  /** The button's name. Default "More information" (`info`) or "Help" (`help`); name the subject when there are several. */
  label?: string;
  side?: OverlaySide;
  align?: OverlayAlign;
  offset?: number;
  /** Hover delay before the preview, in milliseconds (Tooltip's 500). */
  delay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Toggletip = forwardRef<HTMLButtonElement, ToggletipProps>(function Toggletip(
  { content, icon = "info", size, label, side = "top", align, offset, delay, open, defaultOpen, onOpenChange, className, type = "button", "aria-label": ariaLabel, ...rest },
  ref,
) {
  const glyph = size === "sm" ? 12 : 16;
  return (
    <AnchoredToggletip
      trigger={
        <button ref={ref} type={type} className={toggletipVariants({ size }, className)} aria-label={ariaLabel ?? label ?? (icon === "help" ? "Help" : "More information")} {...rest}>
          <Glyph name={icon} size={glyph} />
        </button>
      }
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      side={side}
      align={align}
      offset={offset}
      delay={delay}
      // A span, so the button and its note can sit inside a paragraph or a label (phrasing content).
      surface={({ ref: surfaceRef, ...props }) => <span ref={surfaceRef as Ref<HTMLSpanElement>} className={tooltipVariants({ side }, toggletipVariants.element("surface"))} {...(props as HTMLAttributes<HTMLSpanElement>)}>{content}</span>}
    />
  );
});
