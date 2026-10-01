import { createContext } from "react";

/**
 * True inside a Toolbar. Composite controls placed in one (Segmented, SplitButton) hand their
 * focus to the toolbar: every part leaves the Tab order and joins the toolbar's arrow-key
 * roving (WAI-ARIA toolbar pattern), instead of adding a Tab stop of its own.
 */
export const InToolbar = createContext(false);

/** Props that make a control part one of the toolbar's roving items. */
export const toolbarItemProps = { tabIndex: -1, "data-area-toolbar-item": "" } as const;

/**
 * The anchor for a menu opened from inside a toolbar: the control on its own axis, the bar
 * across it, so the menu clears the whole bar by its gap (Figma's toolbelt: 4 from the bar).
 * Outside a toolbar it is the control's own box.
 */
export const clearToolbar = (node: HTMLElement) => {
  const own = node.getBoundingClientRect();
  const bar = node.closest(".area-toolbar");
  if (!bar) return own;
  const box = bar.getBoundingClientRect();
  return bar.getAttribute("aria-orientation") === "vertical"
    ? { x: box.x, y: own.y, width: box.width, height: own.height }
    : { x: own.x, y: box.y, width: own.width, height: box.height };
};
