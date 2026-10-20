// TurnNotice: how a turn ended. Spec: docs/specs/turn-notice.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { turnNoticeVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

export type TurnNoticeStatus = NonNullable<VariantProps<typeof MANIFESTS.turnNotice>["status"]>;

export interface TurnNoticeProps extends HTMLAttributes<HTMLDivElement> {
  /** How the turn ended: stopped (you stopped it), error (it failed), compacted (earlier context was summarised). */
  status?: TurnNoticeStatus;
  /** @deprecated Use `status` (an outcome is a status, Governance § 4). Kept for one release; `status` wins. */
  kind?: TurnNoticeStatus;
  /** A Button after the text: Retry. */
  action?: ReactNode;
  children: ReactNode;
}

/** One quiet line at the end of a turn; an error is announced as an alert, the others as a status. */
export const TurnNotice = forwardRef<HTMLDivElement, TurnNoticeProps>(function TurnNotice({ status: statusProp, kind, action, children, className, ...rest }, ref) {
  const status = statusProp ?? kind ?? "stopped";
  return (
    <div ref={ref} role={status === "error" ? "alert" : "status"} className={turnNoticeVariants({ status }, className)} {...rest}>
      <span className="area-turn-notice__icon" aria-hidden="true"><Glyph name={status === "stopped" ? "stop" : "info"} size={16} /></span>
      <span className="area-turn-notice__text">{children}</span>
      {action ? <span className="area-turn-notice__action">{action}</span> : null}
    </div>
  );
});
