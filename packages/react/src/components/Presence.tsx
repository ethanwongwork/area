// Status mapping adapted from Fluent UI PresenceBadge; MIT Microsoft. See THIRD_PARTY_NOTICES.md.
// Glyphs are Area-drawn (docs/specs/icons.md): the ring is the shell's border and the mark a
// stroked path, both at --area-weight-icon, so every size shares one line weight.
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { presenceVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { statusMarks } from "./status-marks.ts";
export interface PresenceProps extends HTMLAttributes<HTMLSpanElement> {
  status?: VariantProps<typeof MANIFESTS.presence>["status"];
  size?: VariantProps<typeof MANIFESTS.presence>["size"];
  outOfOffice?: boolean;
}
type Mark = keyof typeof statusMarks | "solid";
/** Fluent's mapping: busy is a solid disc; out of office swaps away/offline for the return arrow. */
const normal: Record<NonNullable<PresenceProps["status"]>, Mark> = { available: "available", away: "away", busy: "solid", "do-not-disturb": "do-not-disturb", blocked: "blocked", offline: "offline", "out-of-office": "out-of-office", unknown: "unknown" };
const outside: Record<NonNullable<PresenceProps["status"]>, Mark> = { ...normal, away: "out-of-office", offline: "out-of-office", busy: "unknown" };
/** Standalone image semantics; attached presence is named by its owning element. */
export const Presence = forwardRef<HTMLSpanElement, PresenceProps>(function Presence(
  {status = "available", size = "md", outOfOffice = false, className, ...rest}, ref,
) {
  const label = status.replaceAll("-", " ") + (outOfOffice && status !== "out-of-office" ? ", out of office" : "");
  const mark = (outOfOffice ? outside : normal)[status];
  return <span ref={ref} role="img" aria-label={label} {...rest}
    className={presenceVariants({status, size}, className)} data-out-of-office={outOfOffice || undefined} data-solid={mark === "solid" || undefined}>
    {mark === "solid" ? null : <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {statusMarks[mark].map((el, i) => el.tag === "circle"
        ? <circle key={i} cx={el.cx} cy={el.cy} r={el.r} fill="currentColor" />
        : <path key={i} d={el.d} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />)}
    </svg>}
  </span>;
});
