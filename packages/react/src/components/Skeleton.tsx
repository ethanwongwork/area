import type { VariantProps } from "../variants.ts";
import { MANIFESTS } from "../variants.ts";
import { forwardRef } from "react";
import { skeletonVariants } from "../variants.ts";
import { type LoadingDelay, useLoadingDelay } from "./loading-delay.ts";
import type { Div } from "./shared.ts";
export interface SkeletonProps extends Div {
  /** block (default): a box the host sizes; text: a line of type; circle: a 1:1 disc. */
  shape?: VariantProps<typeof MANIFESTS.skeleton>["shape"];
  /** Stand-in lines for a paragraph; implies the text shape. The last line is shorter. */
  lines?: number;
  /** false draws a still placeholder, without the shimmer. */
  animated?: boolean;
  /**
   * With children: while true the placeholder is painted on the child, which keeps its size and
   * corner, hidden and inert; when false the children render as they are.
   */
  loading?: boolean;
  /**
   * Waits before it shows, so a quick load shows nothing: `short` 300 ms, `long` (or `true`) 1000 ms, or milliseconds.
   * While it waits the placeholder keeps its box, invisible (`data-waiting`), so nothing moves when it appears.
   */
  delay?: LoadingDelay;
}

export const Skeleton = /* @__PURE__ */ forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape, lines, animated = true, loading = true, delay, className, children, ...rest },
  ref,
) {
  const still = !animated;
  const shown = useLoadingDelay(delay);
  const waiting = shown ? {} : { "data-waiting": "" };
  if (children !== undefined && children !== null && children !== false) {
    if (!loading) return <>{children}</>;
    return (
      <div ref={ref} aria-hidden="true" inert className={skeletonVariants({ shape, static: still, wrap: true }, className)} {...waiting} {...rest}>
        {children}
      </div>
    );
  }
  if (lines !== undefined && lines > 1) {
    return (
      <div ref={ref} aria-hidden="true" className={["area-skeleton__lines", className].filter(Boolean).join(" ")} {...waiting} {...rest}>
        {Array.from({ length: Math.floor(lines) }, (_, index) => (
          <div key={index} className={skeletonVariants({ shape: "text", static: still })} />
        ))}
      </div>
    );
  }
  return (
    <div ref={ref} aria-hidden="true" className={skeletonVariants({ shape: lines !== undefined ? "text" : shape, static: still }, className)} {...waiting} {...rest} />
  );
});

