import { createContext, use } from "react";

/**
 * The app's own scale: Area's default type and density (owner, 2026-10-25: Inspector changes don't change the app's UI;
 * from 2026-10-22 it followed the Inspector's choice, and before that it was fixed at type 13, Compact). On <html>
 * (src/studio.tsx), and on app chrome drawn inside the Canvas (section titles, tile heads, the Canvas header's controls),
 * so that chrome keeps the app's scale while the Canvas takes the Inspector's.
 */
export type AppScale = { "data-area-type": string; "data-area-density": string };

/** The Theme tab's own UI, which never changes as picks are made (PRODUCT_UI.md, Setup): the app's scale before 2026-10-22. */
export const SETUP_SCALE: AppScale = { "data-area-type": "13", "data-area-density": "28" };

export const AppScaleContext = createContext<AppScale>(SETUP_SCALE);

/** The committed type and density as attributes. `use`, so it may be read inside a condition or a map. */
export const appScale = (): AppScale => use(AppScaleContext);
