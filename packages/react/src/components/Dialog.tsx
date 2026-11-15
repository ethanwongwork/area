import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { ScrollArea } from "./ScrollArea.tsx";
import { useOpenState } from "./overlay.ts";
import { cloneElement, forwardRef, useEffect, useId, useRef, useState } from "react";
import type { MouseEvent, ReactElement, ReactNode } from "react";
import { createVariants } from "../variants.ts";
import type { Div } from "./shared.ts";
/* --- Dialog --------------------------------------------------------------- */

const dialogVariants = /* @__PURE__ */ createVariants(MANIFESTS.dialog);

export interface DialogProps extends Omit<Div, "title" | "onClose"> {
  /**
   * The width, as Drawer's `size`: `sm` 384, `md` 480 (default), `lg` 720 for a table or two columns, `xl` 880 for a
   * settings dialog with its own sidebar. Never wider than the screen less 32.
   */
  size?: VariantProps<typeof MANIFESTS.dialog>["size"];
  /**
   * Takes the tallest height the screen allows (the screen less 64), whatever its content, so a dialog whose content
   * changes (tabs, a search, steps) doesn't jump. The body takes the room and scrolls.
   */
  fullHeight?: boolean;
  /** Shows the corner close control. On by default. */
  showCloseButton?: boolean;
  /** The heading, which names the dialog. */
  title?: ReactNode;
  /** A line under the title, read as the dialog's description. */
  description?: ReactNode;
  /** The actions row at the bottom, usually its buttons. */
  footer?: ReactNode;
  /**
   * Opens the dialog as a native modal (`showModal()`) when this element is clicked. The
   * platform supplies the focus trap, Escape, the backdrop and focus return; a click on the
   * backdrop also closes it.
   */
  trigger?: ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void }>;
  /**
   * Opens the native modal without a trigger, or controls one that has a trigger, such as a menu item that asks for
   * confirmation. Escape, the close control and the backdrop report `false` through `onOpenChange`.
   */
  open?: boolean;
  /** Whether the modal starts open, uncontrolled; closed by default. */
  defaultOpen?: boolean;
  /** Accessible name for the close control. */
  dismissLabel?: string;
  /** Called by the close control before closing an enclosing native dialog. */
  onDismiss?: () => void;
  /** Called when the modal opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Use `onDismiss`. */
  onClose?: () => void;
}

/**
 * Interrupts with content that requires a response.
 *
 * With `trigger`, it renders the trigger and a native modal `<dialog>`. Without it, it renders
 * the surface alone so it can be shown inline in documentation, or placed inside your own
 * `<dialog class="area-dialog__modal">` and opened with `showModal()`.
 */
export const Dialog = /* @__PURE__ */ forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  { title, description, footer, size, fullHeight, showCloseButton = true, onDismiss, dismissLabel = "Close dialog", onClose, trigger, open: openProp, defaultOpen, onOpenChange, className, children, ...rest },
  ref,
) {
  const id = useId();
  const modal = useRef<HTMLDialogElement | null>(null);
  // A rule under the header once the body has scrolled (`data-scrolled`, V1): the header then reads as fixed above
  // content passing under it. Set from the body's scroll position; React skips the render when it doesn't change.
  const [scrolled, setScrolled] = useState(false);
  const backdropPress = useRef(false);
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const isModal = trigger !== undefined || openProp !== undefined || defaultOpen !== undefined;
  useEffect(() => {
    const node = modal.current;
    if (!node || typeof node.showModal !== "function") return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);
  // The name belongs to the element with the dialog role: the surface inline, the native
  // <dialog> with a trigger. A consumer's aria-label names a dialog without a title.
  const { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, role, ...surfaceRest } = rest;
  // `role="alertdialog"` (a confirmation) lands on the element that carries the dialog role.
  const labelled = {
    role,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy ?? (title ? `${id}-title` : undefined),
    "aria-describedby": ariaDescribedBy ?? (description ? `${id}-description` : undefined),
  };
  const surface = (
    <div
      ref={ref}
      {...(isModal ? {} : { role: role ?? "dialog", "aria-modal": "true" as const, "aria-label": ariaLabel, "aria-labelledby": labelled["aria-labelledby"], "aria-describedby": labelled["aria-describedby"] })}
      className={dialogVariants({ size, fullHeight }, className)}
      {...(scrolled ? { "data-scrolled": "" } : {})}
      {...surfaceRest}
    >
      {title || description || showCloseButton ? (
        <div className="area-dialog__header">
          <div className="area-dialog__heading">
            {title ? <h2 className="area-dialog__title" id={`${id}-title`}>{title}</h2> : null}
            {description ? <p className="area-dialog__description" id={`${id}-description`}>{description}</p> : null}
          </div>
          {showCloseButton ? <Button variant="ghost" tone="neutral" size="md" iconOnly className="area-dialog__dismiss" aria-label={dismissLabel} icon={<Glyph name="dismiss" />} onClick={event => {
            (onDismiss ?? onClose)?.();
            event.currentTarget.closest("dialog")?.close();
          }} /> : null}
        </div>
      ) : null}
      {/* The body is a Scroll area (one scroller, plan B6.6): its bar matches every other, and it marks `data-scroll-more`
          while it can scroll further, which draws the rule over the footer. */}
      {children ? <ScrollArea className="area-dialog__body" viewportProps={{ tabIndex: undefined, onScroll: event => setScrolled(event.currentTarget.scrollTop > 0) }}>{children}</ScrollArea> : null}
      {footer ? <div className="area-dialog__footer">{footer}</div> : null}
    </div>
  );
  if (!isModal) return surface;
  const modalId = `${id}-modal`;
  return (
    <>
      {trigger ? cloneElement(trigger, {
        "aria-haspopup": "dialog",
        "aria-controls": modalId,
        onClick: (event: MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          if (event.defaultPrevented || modal.current?.open) return;
          setOpen(true);
        },
      } as Record<string, unknown>) : null}
      <dialog
        ref={modal}
        id={modalId}
        className="area-dialog__modal"
        {...labelled}
        onClose={() => { if (open) setOpen(false); }}
        // A click whose target is the <dialog> itself landed on the backdrop: the surface fills it.
        // A backdrop press closes only when it also began on the backdrop: a drag out of the
        // surface that ends on the scrim no longer closes the dialog (audit E-20).
        onPointerDown={event => { backdropPress.current = event.target === event.currentTarget; }}
        onClick={event => { if (event.target === event.currentTarget && backdropPress.current) event.currentTarget.close(); backdropPress.current = false; }}
      >
        {surface}
      </dialog>
    </>
  );
});

