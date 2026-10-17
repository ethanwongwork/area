// Hatnote: "For other uses, see …" at the top of an article or section (Wikipedia). docs/specs/hatnote.md.
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { hatnoteVariants } from "../variants.ts";

export const Hatnote = /* @__PURE__ */ forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Hatnote(
  { className, ...rest },
  ref,
) {
  return <div ref={ref} role="note" className={hatnoteVariants(undefined, className)} {...rest} />;
});

export { hatnoteVariants };
