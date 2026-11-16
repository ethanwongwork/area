import { forwardRef, useEffect, useState } from "react";
import type { HTMLAttributes, Ref, RefObject } from "react";
import { scrollToLatestVariants } from "../variants.ts";
import { Button, type ButtonProps } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";

export interface ScrollToLatestProps extends HTMLAttributes<HTMLDivElement> {
  /** The conversation's scroll container. */
  scrollRef: RefObject<HTMLElement | null>;
  /** Show once the reader is this far (px) from the end. */
  threshold?: number;
  /** The button's accessible name. */
  label?: string;
  /** Where keyboard focus goes after scrolling (the composer); defaults to the conversation. */
  focusRef?: RefObject<HTMLElement | null>;
  /** Props and a ref for the Button; `ref` and the rest land on the wrapper. */
  buttonProps?: Omit<ButtonProps, "icon" | "iconOnly" | "variant" | "tone" | "pill"> & { ref?: Ref<HTMLButtonElement> };
}

/** Returns a long conversation to its newest message; shown only after scrolling away. */
export const ScrollToLatest = forwardRef<HTMLDivElement, ScrollToLatestProps>(function ScrollToLatest(
  { scrollRef, threshold = 200, label = "Scroll to latest", focusRef, buttonProps, className, ...rest }, ref,
) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const update = () => setVisible(element.scrollHeight - element.clientHeight - element.scrollTop > threshold);
    update();
    element.addEventListener("scroll", update, { passive: true });
    // Streamed text grows the content without scrolling or resizing the container, so watch the
    // content too (audit G-19): its children's sizes, and nodes and text arriving.
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(element);
    for (const child of element.children) observer?.observe(child);
    const mutations = typeof MutationObserver !== "undefined" ? new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) if (node instanceof Element) observer?.observe(node);
      update();
    }) : null;
    mutations?.observe(element, { childList: true, subtree: true, characterData: true });
    return () => { element.removeEventListener("scroll", update); observer?.disconnect(); mutations?.disconnect(); };
  }, [scrollRef, threshold]);
  const scroll = (button: HTMLButtonElement) => {
    const element = scrollRef.current;
    if (!element) return;
    // The system setting and Area's motion axis both turn the smooth scroll into a jump. The nearest
    // motion scope decides, as it does for the duration tokens.
    const reduce = (typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches)
      || element.closest("[data-area-motion]")?.getAttribute("data-area-motion") === "0";
    element.scrollTo({ top: element.scrollHeight, behavior: reduce ? "auto" : "smooth" });
    // The button hides once at the end, so keyboard focus moves on rather than falling to the
    // page (audit G-19): to `focusRef` (a composer, say) or the conversation itself.
    if (button.ownerDocument.activeElement === button) {
      const target = focusRef?.current ?? element;
      if (target === element && !element.hasAttribute("tabindex")) element.tabIndex = -1;
      target.focus({ preventScroll: true });
    }
  };
  return <div ref={ref} className={scrollToLatestVariants({}, className)} data-visible={visible ? "" : undefined} {...rest}>
    <Button {...buttonProps} variant="outline" tone="neutral" iconOnly pill aria-label={label} tabIndex={visible ? undefined : -1}
      aria-hidden={visible ? undefined : true} icon={<Glyph name="arrow-up" rotate={180} />} onClick={event => { buttonProps?.onClick?.(event); if (!event.defaultPrevented) scroll(event.currentTarget); }} />
  </div>;
});
