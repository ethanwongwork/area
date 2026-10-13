/**
 * Arrow keys across the Canvas's pressable things (icon cells, swatches, ramp steps, type tiles),
 * as Figma's asset panel and the macOS Finder's icon view move: Left / Right step through them in
 * reading order, Up / Down move to the nearest one in the row above or below, Home / End go to the
 * ends. Selection follows focus, so the Inspector shows what the keyboard is on.
 *
 * Every item stays a Tab stop (each is a button), so this only adds the arrows; nothing is roving.
 */
import type { KeyboardEvent } from "react";

const ITEMS = "button[aria-pressed]";

export function onGridKeys(event: KeyboardEvent<HTMLElement>) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  const current = (event.target as HTMLElement).closest<HTMLElement>(ITEMS);
  if (!current || !event.currentTarget.contains(current)) return;
  const items = [...event.currentTarget.querySelectorAll<HTMLElement>(ITEMS)].filter(item => item.offsetParent !== null);
  const index = items.indexOf(current);
  if (index < 0) return;
  const rtl = getComputedStyle(current).direction === "rtl";
  let next: HTMLElement | undefined;
  switch (event.key) {
    case "ArrowRight": next = items[index + (rtl ? -1 : 1)]; break;
    case "ArrowLeft": next = items[index + (rtl ? 1 : -1)]; break;
    case "Home": next = items[0]; break;
    case "End": next = items.at(-1); break;
    case "ArrowDown":
    case "ArrowUp": {
      // The nearest item by centre in the next row that starts below (or above) this one.
      const from = current.getBoundingClientRect();
      const down = event.key === "ArrowDown";
      const centre = from.left + from.width / 2;
      let best: { item: HTMLElement; row: number; dx: number } | undefined;
      for (const item of items) {
        const rect = item.getBoundingClientRect();
        if (down ? rect.top < from.bottom - 1 : rect.bottom > from.top + 1) continue;
        const row = down ? rect.top : -rect.bottom;
        const dx = Math.abs(rect.left + rect.width / 2 - centre);
        if (!best || row < best.row - 1 || (Math.abs(row - best.row) <= 1 && dx < best.dx)) best = { item, row, dx };
      }
      next = best?.item;
      break;
    }
    default: return;
  }
  event.preventDefault();
  if (!next || next === current) return;
  next.focus({ preventScroll: true });
  next.scrollIntoView({ block: "nearest", inline: "nearest" });
  next.click();
}
