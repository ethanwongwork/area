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

/**
 * The type and density an element being drawn already inherits: <html>'s (the app's), the Canvas body's (the app's, or
 * Setup's on the Theme tab), a tile frame's that is a setting's own scope. Null where unknown, so the chrome states its
 * scale.
 */
export const InheritedScaleContext = createContext<AppScale | null>(null);

/** The committed type and density as attributes. `use`, so it may be read inside a condition or a map. */
export const appScale = (): AppScale => use(AppScaleContext);

const NO_SCALE: Partial<AppScale> = {};

/**
 * appScale() for the feed's repeated chrome (tile heads and captions, section titles, the Components overview's labels,
 * the Stage's head, Typography's row heads), whose nearest type scope is the Canvas body or a tile's frame with nothing
 * between that sets its own text: the attributes only where the scale around differs, nothing where it is the same.
 * Each element carrying them is a scope the token rules re-resolve on (about 2,000 custom properties): 360 restated
 * scopes cost the Color page over a second as it opened (2026-10-29). Chrome elsewhere keeps appScale(): a type scope
 * also resets its text to text-lg (base.css), which the Canvas header and a family's tabs rely on.
 */
export const feedScale = (): Partial<AppScale> => {
  const app = use(AppScaleContext);
  const around = use(InheritedScaleContext);
  return around && around["data-area-type"] === app["data-area-type"] && around["data-area-density"] === app["data-area-density"] ? NO_SCALE : app;
};

/**
 * feedScale() for chrome drawn inside an element that carries `attributes` (a tile's frame that is a setting's own scope
 * or a painted specimen): the element is drawn by the same component, so the scale around the chrome is the frame's.
 */
export const feedScaleWithin = (attributes: Readonly<Record<string, string | undefined>>): Partial<AppScale> => {
  const app = use(AppScaleContext);
  const inner = scaleWithin(use(InheritedScaleContext), attributes);
  return inner && inner["data-area-type"] === app["data-area-type"] && inner["data-area-density"] === app["data-area-density"] ? NO_SCALE : app;
};

/** The scale inside an element that carries `attributes` (a scope's data-area-* attributes), given the scale around it. */
export function scaleWithin(around: AppScale | null, attributes: Readonly<Record<string, string | undefined>>): AppScale | null {
  const type = attributes["data-area-type"], density = attributes["data-area-density"];
  if (type === undefined && density === undefined) return around;
  if (!around && (type === undefined || density === undefined)) return null;
  return { "data-area-type": type ?? around!["data-area-type"], "data-area-density": density ?? around!["data-area-density"] };
}
