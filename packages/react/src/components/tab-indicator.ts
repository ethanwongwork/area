// Shared by Tabs and Code block's language tabs: the one indicator that slides to the chosen tab.
import { useLayoutEffect } from "react";
/*
 * One indicator slides to the chosen tab (docs/MOTION.md, "Tabs / Segmented indicator"; Segmented's plate since
 * 2026-10-24, Radix's and Primer's underline): the list measures the selected tab and draws the bar under it
 * (`data-indicator`, `--_ind-x` / `-y` / `-w` / `-h`, the tab's box in the list's own layout pixels), so a change
 * moves the bar rather than fading one out and another in. Until it has measured (and in static markup) each tab draws its
 * own bar, as before.
 */
export function useTabIndicator(list: { current: HTMLElement | null }, buttons: { current: Map<string, HTMLButtonElement> }, selected: string | undefined, key: unknown) {
  useLayoutEffect(() => {
    const host = list.current;
    if (!host) return;
    const place = () => {
      const tab = selected === undefined ? undefined : buttons.current.get(selected);
      if (!tab || tab.offsetParent !== host) { host.removeAttribute("data-indicator"); return; }
      // The tab's exact box (its width is fractional with the text), in the list's own pixels whatever scale or zoom
      // it is drawn at, from the list's scrolled origin.
      const outer = host.getBoundingClientRect(), inner = tab.getBoundingClientRect();
      const laidOut = host.offsetWidth;
      const factor = laidOut ? outer.width / laidOut : 1;
      host.style.setProperty("--_ind-x", `${(inner.left - outer.left) / factor - host.clientLeft + host.scrollLeft}px`);
      host.style.setProperty("--_ind-y", `${(inner.top - outer.top) / factor - host.clientTop + host.scrollTop}px`);
      host.style.setProperty("--_ind-w", `${inner.width / factor}px`);
      host.style.setProperty("--_ind-h", `${inner.height / factor}px`);
      host.setAttribute("data-indicator", "");
    };
    place();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(place) : null;
    observer?.observe(host);
    for (const tab of buttons.current.values()) observer?.observe(tab);
    return () => observer?.disconnect();
  }, [selected, key]);
}
