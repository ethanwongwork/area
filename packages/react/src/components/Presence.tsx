// Adapted from Fluent UI PresenceBadge; MIT Microsoft. See THIRD_PARTY_NOTICES.md.
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { presenceVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { presencePaths } from "./presence-icons.ts";
export interface PresenceProps extends HTMLAttributes<HTMLSpanElement> {
  status?: VariantProps<typeof MANIFESTS.presence>["status"];
  size?: VariantProps<typeof MANIFESTS.presence>["size"];
  outOfOffice?: boolean;
}
const normal = { available: "available_regular", away: "away_regular", busy: "busy_filled", "do-not-disturb": "dnd_regular", blocked: "blocked_regular", offline: "offline_regular", "out-of-office": "oof_regular", unknown: "unknown_regular" } as const;
const outside = { ...normal, available: "available_regular", away: "oof_regular", offline: "oof_regular", busy: "unknown_regular", "do-not-disturb": "dnd_regular" } as const;
const pixels = { xs: 10, sm: 12, md: 16, lg: 20 } as const;
/** Standalone image semantics; attached presence is named by its owning element. */
export const Presence = forwardRef<HTMLSpanElement, PresenceProps>(function Presence(
  {status = "available", size = "md", outOfOffice = false, className, ...rest}, ref,
) {
  const label = status.replaceAll("-", " ") + (outOfOffice && status !== "out-of-office" ? ", out of office" : "");
  const cut = pixels[size];
  return <span ref={ref} role="img" aria-label={label} {...rest}
    className={presenceVariants({status, size}, className)} data-out-of-office={outOfOffice || undefined}>
    <svg viewBox={`0 0 ${cut} ${cut}`} width={cut} height={cut} fill="currentColor" aria-hidden="true" focusable="false">
      {presencePaths[(outOfOffice ? outside : normal)[status]][cut].map((d, i) => <path key={i} d={d} />)}
    </svg>
  </span>;
});
