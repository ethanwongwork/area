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
  /** `info` (default) explains; `help` guides. Only the mark changes. */
  icon?: "info" | "help";
  /** `md` (default) sits beside 14/20 text; `sm` beside 12/16 captions. Compact density steps both down. */
  size?: ToggletipVariants["size"];
  /** The button's name. Default "More information" (`info`) or "Help" (`help`); name the subject when there are several. */
  label?: string;
  /** The button's side the note opens on; it flips when there is no room. */
  side?: OverlaySide;
  /** Where the note lines up along the button. */
  align?: OverlayAlign;
  /** The gap from the button, in pixels. */
  offset?: number;
  /** Hover delay before the preview, in milliseconds (Tooltip's 500). */
  delay?: number;
  /** Whether the note is open, controlled. */
  open?: boolean;
  /** Whether the note starts open, uncontrolled. */
  defaultOpen?: boolean;
  /** Called when a press, Escape or a click outside opens or closes the note. */
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
