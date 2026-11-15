import { forwardRef, useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactElement, ReactNode } from "react";
import { confirmDialogVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Dialog } from "./Dialog.tsx";

/** The two of Button's tones a confirmation takes. */
type ConfirmTone = Extract<VariantProps<typeof MANIFESTS.button>["tone"], "neutral" | "danger">;

export interface ConfirmDialogProps {
  /** Names the action as a question ("Delete chat?"). */
  title: ReactNode;
  /** What happens, and that it can't be undone. */
  description?: ReactNode;
  /** The action's label, a verb phrase ("Delete chat"). */
  confirmLabel: ReactNode;
  /** The cancel button's words; "Cancel" by default. */
  cancelLabel?: ReactNode;
  /** The action button's tone: `danger` for an action that destroys something, which turns the button red. */
  tone?: ConfirmTone;
  /** Runs the action. Return a promise to keep the dialog open, the action busy, until it settles. */
  onConfirm?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
  /** Called when the person cancels: the button, Escape or the backdrop. */
  onCancel?: () => void;
  /** Opens it when clicked (a menu item or button). */
  trigger?: ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void }>;
  /** Whether the dialog is open, controlled, as Dialog's. */
  open?: boolean;
  /** Whether the dialog starts open, uncontrolled; closed by default. */
  defaultOpen?: boolean;
  /** Called when the dialog opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Render the surface in place, not as a modal (documentation specimens). */
  inline?: boolean;
  /** More content between the description and the buttons (a checkbox, a name to type). */
  children?: ReactNode;
  /** Classes for the dialog's surface. */
  className?: string;
}

/**
 * A forced choice before an action that can't be undone ("Delete chat?"). An
 * `alertdialog` on Dialog's native modal: focus starts on Cancel, the least destructive choice;
 * Escape, Cancel and the backdrop close it without acting.
 */
export const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(function ConfirmDialog(
  { title, description, confirmLabel, cancelLabel = "Cancel", tone = "neutral", onConfirm, onCancel, trigger, open: openProp, defaultOpen = false,
    onOpenChange, inline, children, className }, ref,
) {
  const [own, setOwn] = useState(defaultOpen);
  const open = openProp ?? own;
  const [busy, setBusy] = useState(false);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOwn(next);
    onOpenChange?.(next);
  };
  // Dialog opens the native modal in its own effect, which runs first; then focus moves to Cancel.
  // A busy action resets as the dialog opens again, not as it closes: the exit fades out what was
  // on screen, the action still busy, instead of swapping its spinner back mid-fade (motion
  // 2026-10-07).
  useEffect(() => {
    if (!open) return;
    setBusy(false);
    if (!inline) cancelRef.current?.focus();
  }, [open, inline]);

  const confirm = async (event: MouseEvent<HTMLButtonElement>) => {
    const result = onConfirm?.(event);
    if (result && typeof (result as Promise<unknown>).then === "function") {
      setBusy(true);
      let done = false;
      // A failed action stays open and ready again; a finished one closes still busy.
      try { await result; done = true; setOpen(false); } finally { if (!done) setBusy(false); }
    } else setOpen(false);
  };
  return <Dialog ref={ref} role="alertdialog" className={confirmDialogVariants({}, className)} title={title} description={description}
    showCloseButton={false} {...(inline ? {} : { trigger, open, onOpenChange: (next: boolean) => { if (!next) onCancel?.(); setOpen(next); } })}
    footer={<>
      <Button ref={cancelRef} variant="soft" tone="neutral" disabled={busy} onClick={() => { onCancel?.(); setOpen(false); }}>{cancelLabel}</Button>
      <Button variant={tone === "danger" ? "soft" : "solid"} tone={tone} loading={busy} onClick={confirm}>{confirmLabel}</Button>
    </>}>
    {children}
  </Dialog>;
});
