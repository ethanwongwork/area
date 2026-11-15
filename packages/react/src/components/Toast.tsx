import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { forwardRef } from "react";
import type { ReactNode } from "react";
import { toastVariants } from "../variants.ts";
import type { Div } from "./shared.ts";
export interface ToastProps extends Omit<Div, "title"> {
  /** The status it reports, which sets its colour; neutral by default. */
  tone?: VariantProps<typeof MANIFESTS.toast>["tone"];
  /** An icon before the message; none by default. */
  icon?: ReactNode;
  /** A bold first line over the message. */
  title?: ReactNode;
  /** The toast's actions (an Undo, a View), as Alert's. */
  actions?: ReactNode;
  /** @deprecated Use `actions`, which wins. Kept for one release. */
  action?: ReactNode;
  /** Adds a dismiss button; the parent removes the toast. */
  onDismiss?: () => void;
  /** The dismiss button's accessible name; "Dismiss notification" by default. */
  dismissLabel?: string;
  /**
   * Announces itself: `status`, or `alert` for danger as Alert does. A Toaster turns this off and says the toast
   * through the shared announcer.
   */
  live?: boolean;
}

export const Toast = /* @__PURE__ */ forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { tone = "neutral", icon, title, actions: actionsProp, action, onDismiss, dismissLabel = "Dismiss notification", live = true, className, children, ...rest },
  ref,
) {
  const actions = actionsProp ?? action;
  return (
    <div ref={ref} className={toastVariants({ tone }, className)} {...rest}>
      {icon ? (
        <span className="area-toast__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="area-toast__content" role={live ? (tone === "danger" ? "alert" : "status") : undefined} aria-atomic={live || undefined}>{title ? <div className="area-toast__title">{title}</div> : null}<div className={title ? "area-toast__description" : undefined}>{children}</div></div>
      {actions ? <div className="area-toast__actions">{actions}</div> : null}
      {onDismiss ? <span className="area-toast__dismiss"><Button size="sm" variant="ghost" tone="neutral" iconOnly icon={<Glyph name="dismiss" />} aria-label={dismissLabel} onClick={onDismiss} /></span> : null}
    </div>
  );
});

