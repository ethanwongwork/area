import { createContext } from "react";

/**
 * True inside a Toolbar. Composite controls placed in one (Segmented, SplitButton) hand their
 * focus to the toolbar: every part leaves the Tab order and joins the toolbar's arrow-key
 * roving (WAI-ARIA toolbar pattern), instead of adding a Tab stop of its own.
 */
export const InToolbar = createContext(false);

/** Props that make a control part one of the toolbar's roving items. */
export const toolbarItemProps = { tabIndex: -1, "data-area-toolbar-item": "" } as const;

/** The Toolbar's size tier. Composites in a toolbar (SplitButton, Segmented, Select) take it when
 * they have no `size` of their own, as direct Buttons do through toolbar.css (audit A-7). */
export const ToolbarSize = createContext<"sm" | "md" | "lg" | undefined>(undefined);
