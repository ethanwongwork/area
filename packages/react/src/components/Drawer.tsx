import { cloneElement, forwardRef, useEffect, useId, useRef } from "react";
import type { HTMLAttributes, MouseEvent, ReactElement, ReactNode } from "react";
import { drawerVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { focusInitial, lockPageScroll, useBackdropDismiss } from "./modal.ts";
import { useOpenState } from "./overlay.ts";
import { ScrollArea } from "./ScrollArea.tsx";

type Manifest = VariantProps<typeof MANIFESTS.drawer>;

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** The heading, which names the drawer. */
  title?: ReactNode;
  /** A line under the title, read as the drawer's description. */
  description?: ReactNode;
  /** The actions row at the bottom, usually its buttons. */
  footer?: ReactNode;
  /** The edge it slides from: the inline end (default), the inline start, or the bottom. */
  side?: Manifest["side"];
  /** The width from a side, or the height from the bottom: `sm` 384 (default) or `md` 480, as Dialog's. */
  size?: Manifest["size"];
  /** The footer's actions: `row` (default), in a row at the end; `stacked`, one under another at full width. */
  actions?: Manifest["actions"];
  /**
   * Modal (default): a scrim, focus trapped, the page inert. `false`: a side panel over the page, which stays usable;
   * Escape and the close control still close it.
   */
  modal?: boolean;
  /** Shows the corner close control. On by default. */
  showCloseButton?: boolean;
  /** Called by the close control before it closes the drawer, as Dialog's (one close API across the modal family). */
  onDismiss?: () => void;
  /** The close control's accessible name. */
  dismissLabel?: string;
  /** Opens it when clicked. */
  trigger?: ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void }>;
  /** Whether the drawer is open, controlled. */
  open?: boolean;
  /** Whether the drawer starts open, uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the drawer opens or closes: the trigger, Escape, the close control or the scrim. */
  onOpenChange?: (open: boolean) => void;
  /** Render the surface in place, inside a positioned frame (documentation specimens). */
  inline?: boolean;
}

/**
 * A panel that slides in from an edge over a scrim, or beside the page without one. A native
 * modal `<dialog>`: the platform traps focus, Escape closes, focus returns to the trigger; a press
 * on the scrim closes it. Header, body and footer are Dialog's.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  { title, description, footer, side, size, actions, modal: isModal = true, showCloseButton = true, onDismiss, dismissLabel = "Close", trigger, open: openProp, defaultOpen, onOpenChange,
    inline, className, children, ...rest }, ref,
) {
  const id = useId();
  const modal = useRef<HTMLDialogElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  useEffect(() => {
    const node = modal.current;
    if (!node || typeof node.showModal !== "function") return;
    if (isModal) {
      const release = open ? lockPageScroll() : undefined; // before showModal(), as Dialog's
      if (open && !node.open) { node.showModal(); focusInitial(node.firstElementChild as HTMLElement | null); }
      if (!open && node.open) node.close();
      return release;
    }
    // Non-modal: a manual popover, so it sits in the top layer over every stacking context without
    // making the page inert. The platform moves no focus for a popover, so the drawer does.
    if (typeof node.showPopover !== "function") return;
    const shown = node.matches(":popover-open");
    if (open && !shown) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      node.showPopover();
      focusInitial(node.firstElementChild as HTMLElement | null);
    }
    if (!open && shown) {
      node.hidePopover();
      if (node.contains(document.activeElement)) returnFocus.current?.focus();
    }
  }, [open, isModal]);
  const backdrop = useBackdropDismiss(() => setOpen(false));
  const { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, "aria-describedby": ariaDescribedBy, ...surfaceRest } = rest;
  const labelled = {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy ?? (title ? `${id}-title` : undefined),
    "aria-describedby": ariaDescribedBy ?? (description ? `${id}-description` : undefined),
  };
  const surface = <div ref={ref} {...(inline ? { role: "dialog", ...labelled } : {})} className={drawerVariants({ side, size, actions }, className)} {...surfaceRest}>
    {title || description || showCloseButton ? <div className="area-drawer__header">
      <div className="area-drawer__heading">
        {title ? <h2 className="area-drawer__title" id={`${id}-title`}>{title}</h2> : null}
        {description ? <p className="area-drawer__description" id={`${id}-description`}>{description}</p> : null}
      </div>
      {showCloseButton ? <Button variant="ghost" tone="neutral" size="md" iconOnly className="area-drawer__dismiss" aria-label={dismissLabel}
        icon={<Glyph name="dismiss" />} onClick={() => { onDismiss?.(); setOpen(false); }} /> : null}
    </div> : null}
    {children ? <ScrollArea className="area-drawer__body" viewportProps={{ tabIndex: undefined }}>{children}</ScrollArea> : null}
    {footer ? <div className="area-drawer__footer">{footer}</div> : null}
  </div>;
  if (inline) return surface;
  const modalId = `${id}-modal`;
  return <>
    {trigger ? cloneElement(trigger, {
      "aria-haspopup": "dialog",
      "aria-controls": modalId,
      onClick: (event: MouseEvent<HTMLElement>) => { trigger.props.onClick?.(event); if (!event.defaultPrevented) setOpen(true); },
    } as Record<string, unknown>) : null}
    <dialog ref={modal} id={modalId} className="area-drawer__modal" {...labelled} {...(isModal ? {} : { popover: "manual" })}
      onClose={() => { if (open) setOpen(false); }}
      // A non-modal dialog gets no platform Escape; give it the same close.
      onKeyDown={event => { if (!isModal && event.key === "Escape" && !event.defaultPrevented) { event.preventDefault(); setOpen(false); } }}
      // The surface covers only its edge: a press that starts and ends on the <dialog> itself is on the scrim.
      {...backdrop}>
      {surface}
    </dialog>
  </>;
});
