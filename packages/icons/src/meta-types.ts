/** One icon's record in @area/icons/meta and icons.json. */
export interface IconMeta {
  /** Kebab-case name: the module path (`@area/icons/icons/<name>`), the SVG file and the sprite symbol. */
  name: string;
  /** The outline component's export name. */
  component: string;
  /** The filled component's export name. */
  filledComponent: string;
  /** The icon browser's category slug. */
  category: string | null;
  /** The optical keyline the drawing fills (docs/specs/icons.md, "Keylines"). */
  keyline: "square" | "circle" | "horizontal" | "vertical";
  /** How the filled variant is made: solid bodies, or the outline at a heavier weight. */
  fill: "solid" | "weight";
  /** The owner's review status. Only approved icons are in the main entry; the rest are in `@area/icons/review`. */
  status: "approved" | "review" | "revising";
  /** The review batch the drawing belongs to. */
  batch: string | null;
  /** A turn or mirror of another icon's drawing. */
  derivedFrom?: string;
  turn?: string;
  /** A second name for another icon's drawing (kept identical to it). */
  aliasOf?: string;
}
