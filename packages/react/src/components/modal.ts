/*
 * One modal rule for Dialog, Drawer, Confirm dialog and Command palette (plan C5.3, docs/specs/dialog.md "Modal").
 * The platform's showModal() supplies the focus trap, Escape, inertness and focus return; these helpers add what it
 * leaves to the page: where focus starts, a backdrop press that began on the backdrop, and a page that neither
 * scrolls nor shifts behind the modal.
 */
import { useRef } from "react";
import type { MouseEvent, PointerEvent } from "react";

const CONTROL = "button:not(:disabled), [href], input:not(:disabled):not([type='hidden']), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1']), [contenteditable='true']";
const visible = (node: HTMLElement) => node.getClientRects().length > 0 && !node.closest("[inert], [hidden]");
const first = (root: Element | null | undefined, selector = CONTROL) =>
  root ? Array.from(root.querySelectorAll<HTMLElement>(selector)).find(visible) : undefined;

/**
 * Moves focus to where a modal starts (ref-behaviour 2.17): an `[autofocus]` element; else the body's first control;
 * else the footer's least destructive action (its first button: Cancel comes first in Area's footers); else the
 * surface itself. Never the corner close control, which the platform would pick first in DOM order.
 */
export function focusInitial(surface: HTMLElement | null | undefined, parts: { body?: string; footer?: string; dismiss?: string } = {}): void {
  if (!surface) return;
  const { body = ".area-dialog__body, .area-drawer__body", footer = ".area-dialog__footer, .area-drawer__footer", dismiss = ".area-dialog__dismiss, .area-drawer__dismiss" } = parts;
  const target = first(surface, "[autofocus]")
    ?? first(surface.querySelector(body))
    ?? first(surface.querySelector(footer))
    ?? Array.from(surface.querySelectorAll<HTMLElement>(CONTROL)).find(node => visible(node) && !node.matches(dismiss));
  if (target) { target.focus(); return; }
  if (!surface.hasAttribute("tabindex")) surface.tabIndex = -1;
  surface.focus();
}

/**
 * A backdrop press closes only when it also began on the backdrop: a selection dragged out of a field, or a press
 * that starts inside the surface and ends on the scrim, never closes it (audit E-20, ref-behaviour 2.16). Spread the
 * handlers on the `<dialog>`; a click whose target is the dialog itself landed on the backdrop.
 */
export function useBackdropDismiss(close: () => void, enabled = true) {
  const began = useRef(false);
  return {
    onPointerDown: (event: PointerEvent<HTMLDialogElement>) => { began.current = event.target === event.currentTarget; },
    onClick: (event: MouseEvent<HTMLDialogElement>) => {
      if (enabled && began.current && event.target === event.currentTarget) close();
      began.current = false;
    },
  };
}

let locks = 0;
let saved: string | null = null;
/**
 * Keeps the page from shifting while a modal is open. The modal's CSS hides the page's overflow (`html:has(…:modal)`),
 * which removes a classic scrollbar; the body is padded by the bar's width, so the content behind stays where it was.
 * (`scrollbar-gutter: stable` on the root would be the CSS answer, but Chromium drops the root's gutter while a modal
 * dialog is open, verified 2026-11-15.) Overlay scrollbars (macOS) have no width and are left alone. Call it before
 * `showModal()`, while the bar still shows. Returns the release.
 */
export function lockPageScroll(): () => void {
  if (typeof document === "undefined") return () => {};
  const root = document.documentElement, body = document.body;
  if (locks++ === 0) {
    const bar = window.innerWidth - root.clientWidth;
    saved = body.style.paddingInlineEnd;
    if (bar > 0) body.style.paddingInlineEnd = `calc(${getComputedStyle(body).paddingInlineEnd} + ${bar}px)`;
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) { body.style.paddingInlineEnd = saved ?? ""; saved = null; }
  };
}

/** Whether a modal dialog other than `except` is open: a global shortcut that opens a modal waits for it to close. */
export function anotherModalOpen(except?: Element | null): boolean {
  if (typeof document === "undefined") return false;
  return Array.from(document.querySelectorAll("dialog[open]")).some(dialog => {
    if (dialog === except) return false;
    try { return dialog.matches(":modal"); } catch { return false; }
  });
}
