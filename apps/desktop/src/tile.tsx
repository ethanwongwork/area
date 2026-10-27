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
 * Every frame is square (owner, 2026-10-19), a card's 5:4 (owner, 2026-10-22). A grid holds one span (TileGrid); `cards` lays square cards on columns
 * of a least width (360 for components, Theme's 280).
 *
 * The frame keeps the docs gallery's class names (gallery-tile, __view, __stage), so the shared fit
 * (src/gallery/fit.ts) still finds component specimens.
 */
import type { CSSProperties, ReactNode } from "react";
import { AssetCard, AssetGridItem, ListBoxItem, SectionHeading } from "@area/react";
import { appScale } from "./app-scale.ts";
import { specimenScope } from "./specimen-scope.tsx";
import { CANVAS_DEFAULTS } from "./studio.tsx";

/**
 * The look the Canvas's Asset cards hold whatever the Inspector previews (owner, 2026-10-24: "the style should be -1 card
 * color, 2 stroke strength, no rest shadow", for the gallery cards only), as they hold their corner: Card tone −1 in both
 * modes, Stroke 2, Rest shadow 0, set as the card's own setting scope. The specimen inside takes the defaults back and
 * the Inspector's settings over them (`specimenScope`, src/specimen-scope.tsx), so a component shows the settings being
 * previewed while its card stays the app's.
 */
export const CARD_SCOPE = { "data-area-card-tone-light": "-1", "data-area-card-tone-dark": "-1", "data-area-stroke": "2", "data-area-shadow-rest": "0" } as const;
/** CARD_SCOPE's settings at the defaults, which a card's specimen starts from (a function: studio.tsx imports this file). */
const cardRestored = () => ({ "data-area-card-tone-light": CANVAS_DEFAULTS["card-tone-light"], "data-area-card-tone-dark": CANVAS_DEFAULTS["card-tone-dark"], "data-area-stroke": CANVAS_DEFAULTS.stroke, "data-area-shadow-rest": CANVAS_DEFAULTS["shadow-rest"] });

export type TileSpan = "unit" | "wide";
/**
 * How the stage places its content:
 *   fit     centred in a wide margin and scaled to fit (components; fit.ts sizes it)
 *   center  centred (an icon, a setting's sample, a type specimen)
 *   flow    the content's own height, from the start (a type sample, an icon sheet)
 *   none    no stage: the frame is the visual (a swatch)
 */
export type TileStage = "fit" | "center" | "flow" | "none";

/** An Asset card tile's look: its container, where its name sits, its fill and whether it has an edge (Asset card's axes). */
export interface CardLook { container: "framed" | "basic" | "containerless"; caption: "above" | "below" | "overlay"; fill: "recessed" | "raised"; borderless: boolean }
/**
 * The gallery cards' look: one surface (owner, 2026-10-24: "i like the basic, name below treatment"), the name and its
 * controls shown on it under the pointer or with focus ("the text and copy button can be hidden on hover for everything"),
 * as Imagery's images.
 */
export const GALLERY_LOOK: CardLook = { container: "basic", caption: "overlay", fill: "recessed", borderless: false };

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
  /** The stage alone as a setting's scope, the frame staying as it is (the Theme tab's ground and layers: the window inside
      is the page, so the frame does not change with it). */
  stageScope?: Record<string, string>;
  /** The stage is shown, not used: its content is inert. */
  inert?: boolean;
  /** How an Asset card tile is drawn (the Components tab's Cards menu): Asset card's container, caption, fill, edge. */
  look?: CardLook;
  /** A card (owner, 2026-10-14, after Compass's gallery): a square frame, the specimen in a wider margin. */
  card?: boolean;
  /** An Asset card tile's frame shape, where its kind has its own (owner, 2026-10-24: "each specific thing can be designed
   *  with slightly different proportions"): a card is landscape unless this says otherwise. */
  aspect?: "square" | "landscape" | "hug";
  /** Controls in the caption, at the end of the name's line (a Copy code button). */
  actions?: ReactNode;
  /** A click on the tile, outside the controls in its specimen and caption, opens it (`onOpen`). */
  openOnClick?: boolean;
  /**
   * The container: `plain` (the default), a very light neutral box with a light gray line, the name in its first row;
   * `asset`, Area's Asset card, on the Components tab only (owner, 2026-10-21: "the asset card doesnt need to be used
   * everywhere, for now, just restrict it to be used only on the component page. everywhere else can just use standard
   * very light neutral containers with a light gray stroke").
   */
  container?: "plain" | "asset";
  children?: ReactNode;
}

const CONTROLS = "a, button, input, textarea, select, label, [contenteditable], [role=button], [role=switch], [role=checkbox], [role=radio], [role=tab], [role=slider], [role=combobox]";

export function Tile(props: TileProps) {
  return props.container === "asset" ? <AssetTile {...props} /> : <PlainTile {...props} />;
}

/**
 * The plain container: a box with the name in its first row and the visual under it (studio.css, "Plain tiles"). The
 * box sits in a wrapper that is the control (a List box option, a button, or an article), so a grid's keyboard and
 * selection stay the List box's and the box draws the states: the edge steps on hover, the selected edge, the ring.
 */
function PlainTile({ label, value, span, stage, selected, onSelect, onOpen, card, actions, openOnClick, option, id, "aria-label": ariaLabel, "data-key": dataKey, "data-name": dataName, paint, scope, stageScope, inert, children }: TileProps) {
  const specimen = { ...specimenScope(), ...stageScope };
  const view = stage === "none" ? null : stage === "fit"
    ? <div className="gallery-tile__view" {...specimen}><div className="gallery-tile__stage">{children}</div></div>
    : <div className="gallery-tile__view" inert={inert || undefined} {...specimen}>{children}</div>;
  const box = (
    <div className="gallery-tile gallery-tile--plain" data-span={span} data-stage={stage} data-layout={card ? "card" : undefined}
      data-painted={paint ? "" : undefined} data-scoped={scope ? "" : undefined}
      // The ground the box paints, so a specimen's control fills step from it (styles layers.css).
      data-area-ground={paint ? undefined : "raised"}
      style={paint ? ({ "--_paint": paint.background, "--_ink": paint.color } as CSSProperties) : undefined} {...(paint ? specimen : {})} {...scope}>
      {/* The name is the app's chrome, at the app's scale whatever the Canvas previews. */}
      <div className="gallery-tile__head" {...appScale()}>
        <span className="gallery-tile__label">{label}</span>
        {value != null ? <span className="gallery-tile__value">{value}</span> : null}
        {actions}
      </div>
      {view}
    </div>
  );
  const shared = { id, "aria-label": ariaLabel, "data-key": dataKey, "data-name": dataName, className: "gallery-plain" };
  if (option !== undefined) {
    return <ListBoxItem value={option} textValue={typeof label === "string" ? label : undefined} {...shared}>{box}</ListBoxItem>;
  }
  // A tile whose stage is inert has nothing inside to focus, so the tile itself is the control: a Tab stop that Enter
  // or Space selects, its state as aria-pressed (product UI rule 5).
  if (inert && onSelect) {
    return (
      <article {...shared} role="button" tabIndex={0} aria-pressed={selected ?? false} onClick={onSelect}
        onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(); } }}>
        {box}
      </article>
    );
  }
  // A tile that opens on a click is a button to the keyboard too (Testing's screens).
  if (onOpen && openOnClick) {
    return (
      <article {...shared} role="button" tabIndex={0} data-selected={selected ? "" : undefined}
        onClick={event => { if (!(event.target as Element).closest(CONTROLS)) onOpen(); }}
        onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(); } }}>
        {box}
      </article>
    );
  }
  return (
    <article {...shared} data-selected={selected ? "" : undefined} onPointerDown={onSelect} onFocusCapture={onSelect}
      onDoubleClick={onOpen ? event => { if (!(event.target as Element).closest("input, textarea, select, [contenteditable]")) onOpen(); } : undefined}>
      {box}
    </article>
  );
}

/** Area's Asset card (Components). */
function AssetTile({ label, value, span, stage, selected, onSelect, onOpen, card, aspect, look, actions, openOnClick, option, id, "aria-label": ariaLabel, "data-key": dataKey, "data-name": dataName, paint, scope, stageScope, inert, children }: TileProps) {
  const specimen = { ...cardRestored(), ...specimenScope(), ...stageScope };
  const view = stage === "none" ? null : stage === "fit"
    ? <div className="gallery-tile__view" {...specimen}><div className="gallery-tile__stage">{children}</div></div>
    : <div className="gallery-tile__view" inert={inert || undefined} {...specimen}>{children}</div>;
  // The frame: the app's own class and modes on Asset card's frame. The ground it declares (the frame tone, a basic card's
  // own fill, or recessed when scoped) lets the specimen's control fills step from the frame, not the Canvas (layers.css).
  const frameProps = {
    className: "gallery-tile",
    "data-span": span,
    "data-stage": stage,
    "data-layout": card ? "card" : undefined,
    "data-painted": paint ? "" : undefined,
    "data-scoped": scope ? "" : undefined,
    "data-area-ground": paint || look?.container === "containerless" ? undefined : scope ? "recessed" : look?.container === "basic" ? (look.fill === "raised" ? "raised" : "tile") : look?.fill === "raised" ? "frame-raised" : "frame",
    style: paint ? ({ "--_paint": paint.background, "--_ink": paint.color } as CSSProperties) : undefined,
    // A painted frame is the specimen itself (a colour card), so it takes the Inspector's settings.
    ...(paint ? specimen : {}),
    ...scope,
  } as Record<string, string | undefined> & { className: string; style?: CSSProperties };
  // The caption is the app's chrome, at the app's scale whatever the Canvas previews.
  const captionProps = { className: "gallery-tile__caption", ...appScale() };
  const shared = { ...CARD_SCOPE, id, "aria-label": ariaLabel, "data-key": dataKey, "data-name": dataName, name: label, meta: value, actions, frameProps, captionProps,
    container: look?.container, caption: look?.caption, fill: look?.fill, borderless: look?.borderless,
    // A card's frame is 5:4, the gallery four across (owner, 2026-10-22; Asset card's landscape aspect).
    aspect: aspect ?? (card ? "landscape" as const : undefined) };
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
 * `min` wide (260 by default, at most four across), growing and shrinking with the zoom. `waterfall`: cards that hug
 * their specimens, each dropped into the shortest column (src/gallery/fit.ts places them).
 */
export function TileGrid({ span, cards, waterfall, min, className, children }: { span: TileSpan; cards?: boolean; waterfall?: boolean; min?: number; className?: string; children: ReactNode }) {
  return (
    <div className={`studio-grid studio-grid--${span}${cards ? " studio-grid--cards" : ""}${waterfall ? " studio-grid--waterfall" : ""}${className ? ` ${className}` : ""}`}
      style={min ? ({ "--_card-min": `${min}px` } as CSSProperties) : undefined}>{children}</div>
  );
}

/**
 * A titled group on the Canvas: a family, a scale, a category, a setting. Every section of the feed reads one way
 * (owner, 2026-10-22: "make the copy, titles, and subtitles to be more consistent and intentional"): its title, then
 * `count`, muted, when its block is a collection (cards, rows, swatches, icons); and `lede`, one sentence saying what it
 * holds, where the page explains (a family's tabs, Theme, Typography). `role="group"` when the section is a ListBox's
 * group of options (a region may not sit inside a listbox).
 */
export function CanvasSection({ id, title, count, lede, role, children }: { id: string; title?: ReactNode; count?: number; lede?: ReactNode; role?: "group"; children: ReactNode }) {
  // Untitled when the Sidebar's selected row already names it (one scale, one setting).
  return (
    <section className="studio-section" id={id} role={role} aria-labelledby={title ? `${id}-title` : undefined}>
      {/* Area's SectionHeading (app-shell.css): the strong title trimmed to its cap, the muted lede 8 under it. */}
      {title ? <SectionHeading className="studio-section-heading" titleId={`${id}-title`} lede={lede} {...appScale()}
        title={count === undefined ? title : <>{title} <span className="studio-muted studio-tabular">{count}</span></>} /> : null}
      {children}
    </section>
  );
}
