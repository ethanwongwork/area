import { cloneElement, forwardRef, useEffect, useId, useRef } from "react";
import type { HTMLAttributes, MouseEvent, ReactElement, ReactNode } from "react";
import { drawerVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { useOpenState } from "./overlay.ts";

type Manifest = VariantProps<typeof MANIFESTS.drawer>;

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  /** The edge it slides from: the inline end (default), the inline start, or the bottom. */
  side?: Manifest["side"];
  size?: Manifest["size"];
  /** Footer actions in a row at the end (default), or stacked full width (shadcn's Sheet). */
  actions?: Manifest["actions"];
  /**
   * Modal (default): a scrim, focus trapped, the page inert. `false`: a side panel over the page,
   * which stays usable (Notion's side peek); Escape and the close control still close it.
   */
  modal?: boolean;
  /** Shows the corner close control. On by default. */
  showCloseButton?: boolean;
  dismissLabel?: string;
  /** Opens it when clicked. */
  trigger?: ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void }>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Render the surface in place, inside a positioned frame (documentation specimens). */
  inline?: boolean;
}

/**
 * A panel that slides in from an edge over a scrim (shadcn's Sheet; Notion's side peek). A native
 * modal `<dialog>`: the platform traps focus, Escape closes, focus returns to the trigger; a press
 * on the scrim closes it. Header, body and footer are Dialog's.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  { title, description, footer, side, size, actions, modal: isModal = true, showCloseButton = true, dismissLabel = "Close", trigger, open: openProp, defaultOpen, onOpenChange,
    inline, className, children, ...rest }, ref,
) {
  const id = useId();
  const modal = useRef<HTMLDialogElement | null>(null);
  const backdropPress = useRef(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  useEffect(() => {
    const node = modal.current;
    if (!node || typeof node.showModal !== "function") return;
    if (isModal) {
      if (open && !node.open) node.showModal();
      if (!open && node.open) node.close();
      return;
    }
    // Non-modal: a manual popover, so it sits in the top layer over every stacking context without
    // making the page inert. The platform moves no focus for a popover, so the drawer does.
    if (typeof node.showPopover !== "function") return;
    const shown = node.matches(":popover-open");
    if (open && !shown) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      node.showPopover();
      node.querySelector<HTMLElement>("[autofocus], button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])")?.focus();
    }
    if (!open && shown) {
      node.hidePopover();
      if (node.contains(document.activeElement)) returnFocus.current?.focus();
    }
  }, [open, isModal]);
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
      {showCloseButton ? <Button variant="ghost" tone="neutral" size="md" iconOnly className="area-drawer__close" aria-label={dismissLabel}
        icon={<Glyph name="dismiss" />} onClick={() => setOpen(false)} /> : null}
    </div> : null}
    {children ? <div className="area-drawer__body">{children}</div> : null}
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
      onPointerDown={event => { backdropPress.current = event.target === event.currentTarget; }}
      onClick={event => { if (event.target === event.currentTarget && backdropPress.current) setOpen(false); backdropPress.current = false; }}>
      {surface}
    </dialog>
  </>;
});
