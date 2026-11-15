import { useSystemDefault } from "./SystemDefaults.tsx";
import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { forwardRef } from "react";
import type { ReactNode } from "react";
import { alertVariants } from "../variants.ts";
import type { Div } from "./shared.ts";
/* --- Alert ---------------------------------------------------------------- */

export interface AlertProps extends Omit<Div, "title"> {
  /** The status it reports, which sets its colour; neutral by default. */
  tone?: VariantProps<typeof MANIFESTS.alert>["tone"];
  /**
   * single-line (default), multiline (title over wrapping body, actions below), or banner: a
   * one-line announcement across a page or section, its link at the end.
   */
  layout?: VariantProps<typeof MANIFESTS.alert>["layout"];
  /** Square, without side edges, for a banner that meets its container's edges. */
  flush?: boolean;
  /** An icon before the message; none by default. */
  icon?: ReactNode;
  /**
   * A bold first line over the message. It replaces the native `title` attribute: an Alert's title is content, not a
   * tooltip.
   */
  title?: ReactNode;
  /** The message's actions (a button or two), in its `__actions` part, as Toast's and Empty state's `actions`. */
  actions?: ReactNode;
  /** @deprecated Use `actions`, which wins. Kept for one release. */
  action?: ReactNode;
  /** An optional inline text link following the message. */
  link?: ReactNode;
  /** Adds a separate dismiss button. The parent owns whether the alert remains rendered. */
  onDismiss?: () => void;
  /** Replaces the standard dismiss icon. */
  dismissIcon?: ReactNode;
  /** Accessible name for the dismiss button. */
  dismissLabel?: string;
}

export const Alert = /* @__PURE__ */ forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone, layout, flush = false, icon, title, actions: actionsProp, action, link, onDismiss, dismissIcon, dismissLabel = "Dismiss alert", className, children, ...rest },
  ref,
) {
  // The system's defaults (SystemDefaults) where the use gives none.
  tone = useSystemDefault("alert", "tone", tone, alertVariants.manifest.variants.tone);
  layout = useSystemDefault("alert", "layout", layout, alertVariants.manifest.variants.layout);
  const actions = actionsProp ?? action;
  const resolvedLayout = layout ?? "single-line";
  // A banner's link ends the row (OpenAI's announcement banners); elsewhere it follows the text.
  const endLink = resolvedLayout === "banner";
  return (
    <div
      ref={ref}
      // `alert` interrupts a screen reader; `status` waits for a pause. Only danger earns
      // the interruption.
      role={tone === "danger" ? "alert" : "status"}
      className={alertVariants({ tone, layout: resolvedLayout, flush }, className)}
      {...rest}
    >
      {icon ? (
        <span className="area-alert__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="area-alert__content">
        {title ? <div className="area-alert__title">{title}</div> : null}
        {children || (link && !endLink) ? (
          <div className="area-alert__description">
            {children}
            {link && !endLink ? <span className="area-alert__link">{link}</span> : null}
          </div>
        ) : null}
      </div>
      {link && endLink ? <span className="area-alert__link">{link}</span> : null}
      {actions ? <div className="area-alert__actions">{actions}</div> : null}
      {onDismiss ? (
        // The close recipe for rectangular surfaces (audit S9): a ghost small Button with the Area glyph.
        <span className="area-alert__dismiss">
          <Button size="sm" variant="ghost" tone="neutral" iconOnly icon={dismissIcon ?? <Glyph name="dismiss" />} aria-label={dismissLabel} onClick={onDismiss} />
        </span>
      ) : null}
    </div>
  );
});

