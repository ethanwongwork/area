/**
 * The archived docs site's demo registry (apps/docs/scripts/render.mjs): the app's demos plus the docs-only
 * Iconography demos, which set Area's icons beside Fluent's. The app doesn't show them, so it doesn't bundle them
 * or the Fluent map they read (docs/specs/icons.md, "Fluent map retired from the app").
 */
import { DEMOS as APP_DEMOS, SOURCES as APP_SOURCES } from "./registry.tsx";
import * as icons from "./demos/icons.tsx";

const { ICON_REVIEW_DEMOS, ...iconDemos } = icons;
for (const name of [...Object.keys(iconDemos), ...Object.keys(ICON_REVIEW_DEMOS)])
  if (name in APP_DEMOS) throw new Error(`Demo ${name} is exported by both demos/icons.tsx and the app's registry`);
export const DEMOS = { ...APP_DEMOS, ...iconDemos, ...ICON_REVIEW_DEMOS } as Record<string, () => unknown>;
/** Each demo module's source file, relative to this registry (the docs build reads them for snippets). */
export const SOURCES = { ...APP_SOURCES, icons: "demos/icons.tsx" };
