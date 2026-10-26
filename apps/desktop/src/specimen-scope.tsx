import { createContext, use, type HTMLAttributes } from "react";

/**
 * The specimens' scope (owner, 2026-10-26: "the new defaults should apply to everything in the ui, the actual components
 * themselves that sit inside the containers would be the only things that update with the controls"): the Inspector's
 * settings as data-area-* attributes, only those it moved from Area's defaults, for the element that holds a specimen
 * (a tile's view, the Stage's view, a type sample, an icon). The Canvas's body, its cards, titles and header stay at the
 * defaults the app is drawn in (PRODUCT_UI.md, rule 18). Empty on a tab that keeps its own previews (the Theme tab), and
 * when nothing has moved, so a specimen at the defaults is no scope at all. Provided by the Workspace (src/studio.tsx).
 */
export type SpecimenScope = Readonly<Record<string, string>>;

export const SpecimenScopeContext = createContext<SpecimenScope>({});

/** The attributes a specimen's holder takes. `use`, so it may be read inside a condition or a map. */
export const specimenScope = (): SpecimenScope => use(SpecimenScopeContext);

/** The attributes in `picked` that differ from `defaults`. The defaults leave nothing out that a pick writes, except
 * Contrast at System, which writes no attribute in either, so leaving it out inherits the OS's level as the body does. */
export function movedFrom(picked: Record<string, string | undefined>, defaults: Record<string, string | undefined>): Record<string, string> {
  const moved: Record<string, string> = {};
  for (const [name, value] of Object.entries(picked)) if (value !== undefined && value !== defaults[name]) moved[name] = value;
  return moved;
}

/** An element holding a specimen, for a page that draws its specimen inline (Typography's sample rows, Icons' table): the
 * hook must run inside the Workspace, so the page can't read the scope itself. Its own attributes win (a row's own Type). */
export function Specimen({ as: Tag = "div", ...props }: { as?: "div" | "span" } & HTMLAttributes<HTMLElement> & Record<`data-${string}`, string | undefined>) {
  return <Tag {...specimenScope()} {...props} />;
}
