/**
 * The Canvas's one container and one grid (owner, 2026-10-11: "the gallery and the container
 * being the main way to show designs"). Every specimen, a component, a swatch, a type role, an
 * icon or a setting, sits in the same Tile, which is Area's Asset card (docs/specs/asset-card.md;
 * owner, 2026-10-18: "rebuild the gallery tiles on Asset card so every tile's name and controls sit
 * under its frame, on every tab"; 2026-10-19, a trial: "move the text back into the containers. the name should be at
 * the top"): a square frame holds the name, a value and controls in its first row, then the visual.
 *
 * The visual is the frame itself, never a box inside one (owner, 2026-10-11): a colour tile's frame
 * is painted in its colour (`paint`), a setting's frame is that setting's own ground (`scope`), and a
 * stage only places its content: fit, centre or flow.
 *
 * Tiles come in three spans on one grid (src/studio.css, .studio-grid):
 *   unit  one base cell, 152 at the least: a swatch, an icon
 *   wide  2 units and the gap between them: a component, a setting's preset, a type specimen
 * Every frame is square (owner, 2026-10-19). A grid holds one span (TileGrid); `cards` lays square cards on columns
 * of a least width (360 for components, Language's 280).
 *
 * The frame keeps the docs gallery's class names (gallery-tile, __view, __stage), so the shared fit
 * (src/gallery/fit.ts) still finds component specimens.
 */
import type { CSSProperties, ReactNode } from "react";
import { AssetCard, AssetGridItem, SectionHeading } from "@area/react";
import { APP_SCALE } from "./app-scale.ts";

export type TileSpan = "unit" | "wide";
/**
 * How the stage places its content:
 *   fit     centred in a wide margin and scaled to fit (components; fit.ts sizes it)
 *   center  centred (an icon, a setting's sample, a type specimen)
 *   flow    the content's own height, from the start (a type sample, an icon sheet)
 *   none    no stage: the frame is the visual (a swatch)
 */
export type TileStage = "fit" | "center" | "flow" | "none";

export interface TileProps {
  /** The name, in the caption under the frame. */
  label: ReactNode;
  /** Under the name: a hex, a size, a count, a grade. */
  value?: ReactNode;
  span: TileSpan;
  stage: TileStage;
  selected?: boolean;
  /** Selecting the tile: a pointer down or focus inside selects it; with `inert` the tile is itself a button. */
  onSelect?: () => void;
  /**
   * Opening the tile's own view (Components: its family's Stage) on a double-click, as Finder and
   * Figma open what a click selects, or on a click with `openOnClick`. A double-click in a text
   * field stays the field's.
   */
  onOpen?: () => void;
  /**
   * The tile as an option of the Asset grid around it (docs/specs/list-box.md, asset-card.md): its value. The grid owns
   * the Tab stop, the arrows and the selection; `selected` and `onSelect` are then unused.
   */
  option?: string;
  /** The element's id, so a view can bring the tile back into sight. */
  id?: string;
  /** Names the tile when the label alone would not ("Button: Sizes / sm"). */
  "aria-label"?: string;
  /** What a pin menu pins (src/organize.tsx, PinMenu): the thing's key and its name. */
  "data-key"?: string;
  "data-name"?: string;
  /** The frame painted as its visual: a colour and the ink that reads on it. */
  paint?: { background: string; color: string };
  /** The frame as a setting's own scope (data-area-* attributes): it takes the setting and paints its subtle ground. */
  scope?: Record<string, string>;
  /** The stage alone as a setting's scope, the frame staying as it is (Language's ground and layers: the window inside
      is the page, so the frame does not change with it). */
  stageScope?: Record<string, string>;
  /** The stage is shown, not used: its content is inert. */
  inert?: boolean;
  /** No container at rest: the specimen on the Canvas's ground, the frame's edge shown on hover and selection
      (Asset card's `containerless`; owner, 2026-10-19, a trial on Components). */
  containerless?: boolean;
  /** A card (owner, 2026-10-14, after Compass's gallery): a square frame, the specimen in a wider margin. */
  card?: boolean;
  /** Controls in the caption, at the end of the name's line (a Copy code button). */
  actions?: ReactNode;
  /** A click on the tile, outside the controls in its specimen and caption, opens it (`onOpen`). */
  openOnClick?: boolean;
  children?: ReactNode;
}

const CONTROLS = "a, button, input, textarea, select, label, [contenteditable], [role=button], [role=switch], [role=checkbox], [role=radio], [role=tab], [role=slider], [role=combobox]";

export function Tile({ label, value, span, stage, selected, onSelect, onOpen, card, containerless, actions, openOnClick, option, id, "aria-label": ariaLabel, "data-key": dataKey, "data-name": dataName, paint, scope, stageScope, inert, children }: TileProps) {
  const view = stage === "none" ? null : stage === "fit"
    ? <div className="gallery-tile__view" {...stageScope}><div className="gallery-tile__stage">{children}</div></div>
    : <div className="gallery-tile__view" inert={inert || undefined} {...stageScope}>{children}</div>;
  // The frame: the app's own class and modes on Asset card's frame. The ground it paints (bg-surface, or bg-subtle when
  // scoped) lets the specimen's control fills step from the frame, not the Canvas (styles layers.css).
  const frameProps = {
    className: "gallery-tile",
    "data-span": span,
    "data-stage": stage,
    "data-layout": card ? "card" : undefined,
    "data-painted": paint ? "" : undefined,
    "data-scoped": scope ? "" : undefined,
    "data-area-ground": paint || containerless ? undefined : scope ? "recessed" : "raised",
    style: paint ? ({ "--_paint": paint.background, "--_ink": paint.color } as CSSProperties) : undefined,
    ...scope,
  } as Record<string, string | undefined> & { className: string; style?: CSSProperties };
  // The caption is the app's chrome, at the app's scale whatever the Canvas previews.
  const captionProps = { className: "gallery-tile__caption", ...APP_SCALE };
  const shared = { id, "aria-label": ariaLabel, "data-key": dataKey, "data-name": dataName, name: label, meta: value, actions, frameProps, captionProps,
    container: containerless ? "containerless" as const : undefined };
  if (option !== undefined) {
    return <AssetGridItem value={option} className="gallery-asset" textValue={typeof label === "string" ? label : undefined} {...shared}>{view}</AssetGridItem>;
  }
  // A tile whose stage is inert has nothing inside to focus, so the tile itself is the control: a
  // Tab stop that Enter or Space selects, its state as aria-pressed (product UI rule 5).
  if (inert && onSelect) {
    return (
      <AssetCard {...shared} className="gallery-asset" interactive role="button" tabIndex={0} aria-pressed={selected ?? false} onClick={onSelect}
        onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(); } }}>
        {view}
      </AssetCard>
    );
  }
  return (
    <AssetCard {...shared} className="gallery-asset" interactive selected={selected} onPointerDown={onSelect} onFocusCapture={onSelect}
      onClick={onOpen && openOnClick ? event => { if (!(event.target as Element).closest(CONTROLS)) onOpen(); } : undefined}
      onDoubleClick={onOpen && !openOnClick ? event => { if (!(event.target as Element).closest("input, textarea, select, [contenteditable]")) onOpen(); } : undefined}>
      {view}
    </AssetCard>
  );
}

/**
 * A grid of one span: unit or wide tiles on the shared unit. `cards`: square tiles on their own columns, at least
 * `min` wide (360 by default), growing and shrinking with the zoom.
 */
export function TileGrid({ span, cards, min, children }: { span: TileSpan; cards?: boolean; min?: number; children: ReactNode }) {
  return (
    <div className={`studio-grid studio-grid--${span}${cards ? " studio-grid--cards" : ""}`}
      style={min ? ({ "--_card-min": `${min}px` } as CSSProperties) : undefined}>{children}</div>
  );
}

/** A titled group on the Canvas: a family, a scale, a category, a setting. */
/** `role="group"` when the section is a ListBox's group of options (a region may not sit inside a listbox). */
export function CanvasSection({ id, title, lede, role, children }: { id: string; title?: ReactNode; lede?: ReactNode; role?: "group"; children: ReactNode }) {
  // Untitled when the Sidebar's selected row already names it (one scale, one setting).
  return (
    <section className="studio-section" id={id} role={role} aria-labelledby={title ? `${id}-title` : undefined}>
      {/* Area's SectionHeading (app-shell.css): the strong title trimmed to its cap, the muted lede 8 under it. */}
      {title ? <SectionHeading className="studio-section-heading" titleId={`${id}-title`} title={title} lede={lede} {...APP_SCALE} /> : null}
      {children}
    </section>
  );
}
