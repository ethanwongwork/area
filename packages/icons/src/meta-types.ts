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
  /** "mirror": tied to reading direction, so the components mirror in right-to-left text (rtl.css). */
  rtl?: "mirror";
  /** Sizes with a drawing of their own: [12] where the icon has a 12px cut, drawn when `size` is 12 (svg/12). Every
   *  other size scales the 16px drawing (docs/specs/icons.md, "12px cuts"). */
  cuts?: readonly 12[];
  /** Search words: the concept, synonyms and other libraries' words for it, never another icon's name. */
  keywords: readonly string[];
  /** The same icon's name in other libraries, as each publishes it (Fluent and Material in snake case). */
  names?: { lucide?: string; phosphor?: string; fluent?: string; material?: string };
}

/** A review batch: the drawings the owner reviewed together (sources/batches.json). */
export interface IconBatch {
  id: string;
  title: string;
}
