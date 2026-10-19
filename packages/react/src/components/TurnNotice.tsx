// TurnNotice: how a turn ended. Spec: docs/specs/turn-notice.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { turnNoticeVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

export interface TurnNoticeProps extends HTMLAttributes<HTMLDivElement> {
  /** stopped (you stopped it), error (it failed), compacted (earlier context was summarised). */
  kind?: VariantProps<typeof MANIFESTS.turnNotice>["kind"];
  /** A Button after the text: Retry. */
  action?: ReactNode;
  children: ReactNode;
}

/** One quiet line at the end of a turn; an error is announced as an alert, the others as a status. */
export const TurnNotice = forwardRef<HTMLDivElement, TurnNoticeProps>(function TurnNotice({ kind = "stopped", action, children, className, ...rest }, ref) {
  return (
    <div ref={ref} role={kind === "error" ? "alert" : "status"} className={turnNoticeVariants({ kind }, className)} {...rest}>
      <span className="area-turn-notice__icon" aria-hidden="true"><Glyph name={kind === "stopped" ? "stop" : "info"} size={16} /></span>
      <span className="area-turn-notice__text">{children}</span>
      {action ? <span className="area-turn-notice__action">{action}</span> : null}
    </div>
  );
});
