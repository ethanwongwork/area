import { forwardRef, useEffect, useState } from "react";
import type { HTMLAttributes, RefObject } from "react";
import { scrollToLatestVariants } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";

export interface ScrollToLatestProps extends HTMLAttributes<HTMLDivElement> {
  /** The conversation's scroll container. */
  scrollRef: RefObject<HTMLElement | null>;
  /** Show once the reader is this far (px) from the end. */
  threshold?: number;
  label?: string;
}

/** Returns a long conversation to its newest message; shown only after scrolling away. */
export const ScrollToLatest = forwardRef<HTMLDivElement, ScrollToLatestProps>(function ScrollToLatest(
  { scrollRef, threshold = 200, label = "Scroll to latest", className, ...rest }, ref,
) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const update = () => setVisible(element.scrollHeight - element.clientHeight - element.scrollTop > threshold);
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(element);
    return () => { element.removeEventListener("scroll", update); observer?.disconnect(); };
  }, [scrollRef, threshold]);
  const scroll = () => {
    const element = scrollRef.current;
    if (!element) return;
    // The system setting and Area's motion axis both turn the smooth scroll into a jump.
    const reduce = (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches)
      || element.closest('[data-area-motion="none"]') !== null;
    element.scrollTo({ top: element.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  };
  return <div ref={ref} className={scrollToLatestVariants({}, className)} data-visible={visible ? "" : undefined} {...rest}>
    <Button variant="outline" tone="neutral" iconOnly pill aria-label={label} tabIndex={visible ? undefined : -1}
      aria-hidden={visible ? undefined : true} icon={<Glyph name="arrow-up" rotate={180} />} onClick={scroll} />
  </div>;
});
