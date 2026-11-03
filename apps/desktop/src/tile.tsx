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
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AssetCard, AssetGridItem, Badge, Count, ListBoxItem, SectionHeading } from "@area/react";
import { AlertCircleFilledIcon, ArchiveIcon, CircleCheckDashedIcon, CircleDashedIcon, CircleProgressIcon, EllipseIcon, ErrorFilledIcon, StatusAvailableFilledIcon } from "@area/icons";
import { feedScale, feedScaleWithin } from "./app-scale.ts";
import { specimenScope } from "./specimen-scope.tsx";
import { useStudio, type CanvasAxes } from "./studio.tsx";
import { ScreenCover } from "./setup-screen.tsx";
import type { GalleryMode, GalleryRatio } from "./view-controls.tsx";

/**
 * The look the Canvas's Asset cards hold whatever the Inspector previews (owner, 2026-10-24: "the style should be -1 card
 * color, 2 stroke strength, no rest shadow", for the gallery cards only), as they hold their corner: Card tone −1 in both
 * modes, Stroke 2, Rest shadow 0, set as the card's own setting scope. Hover is the edge one step darker and no lift
 * (Hover lift 0, Hover edge 1; owner, 2026-11-01: "the shadow is too strong and the stroke color change is too strong"),
 * as a plain tile's (styles/canvas.css). The specimen inside takes the defaults back and
 * the Inspector's settings over them (`specimenScope`, src/specimen-scope.tsx), so a component shows the settings being
 * previewed while its card stays the app's.
 */
export const CARD_SCOPE = { "data-area-card-tone-light": "-25", "data-area-card-tone-dark": "-25", "data-area-stroke": "2", "data-area-shadow-rest": "0", "data-area-shadow-hover": "0", "data-area-stroke-hover": "1" } as const;
/** CARD_SCOPE's settings as the app is drawn (its look, src/app-look.ts), which a card's specimen starts from; the specimen's
 *  scope then writes only what the open theme moves from the app's look. */
const cardRestored = (chrome: CanvasAxes) => ({ "data-area-card-tone-light": chrome["card-tone-light"], "data-area-card-tone-dark": chrome["card-tone-dark"], "data-area-stroke": chrome.stroke, "data-area-shadow-rest": chrome["shadow-rest"], "data-area-shadow-hover": chrome["shadow-hover"], "data-area-stroke-hover": chrome["stroke-hover"] });

/** A table in the feed: it takes the feed's one frame inset, corner and fill (styles/app.css .studio-table, Table's public
 *  hooks) and the cards' stroke, so it is one family with them (2026-11-01). */
export const FEED_TABLE = { className: "studio-table", "data-area-stroke": CARD_SCOPE["data-area-stroke"] } as const;
/** A code block in the feed: the same (styles/app.css .studio-code, Code block's hooks). */
export const FEED_CODE = { className: "studio-code", "data-area-stroke": CARD_SCOPE["data-area-stroke"] } as const;
/** A block with no frame of its own (a chart, Meters, a number, a type tester) as Area's Card (2026-11-02), drawn through
 *  its public hooks as the feed's frame (styles/feed.css .studio-frame), in the cards' own scope (Stroke 2, no rest shadow). */
export const FEED_FRAME = { className: "studio-frame", ...CARD_SCOPE } as const;

export type TileSpan = "unit" | "wide";
/**
 * A project's status, one badge in two states, colour-coded (owner, 2026-11-01: "color code the project status badge
 * indicators"), drawn as the status circles (owner, later the same day: "i dont like the tag icon for published, what
 * happened to the circles"; the 2026-10-30 status prototype's marks): published or live, the filled circle with its
 * check knocked out, success; a draft or not yet published, the empty ring, caution (the dashed circle until the live
 * sheet, 2026-11-01: "the dashed circle looks too faint"; 23 units of ink beside the check circle's 125, the ring's 47). Plain (owner, 2026-11-01: "i
 * kinda like the merge icons with the colors, no backplate"): the icon carries the colour and the words stay the
 * caption's muted text, with no plate behind them. `iconOnly` draws the mark alone, its words its accessible name and
 * tooltip (a Sidebar row's trailing mark, as Claude Code marks each session).
 *
 * Every status in the app is this badge (owner, 2026-11-02: "all badges are correct and consistent"; "apply new and more
 * colors to the status badges"; then "i prefer just the icon in the nav by itself with no backplate, but prefer backplates
 * on badges everywhere else"; "i prefer the orange colored badges over the yellow/gold"). On its tone's soft plate
 * everywhere; in the Sidebar the mark alone, no plate (`iconOnly`). The mark is the one icon a badge keeps: it is how the
 * Sidebar's bare mark is learnt. One meaning per hue (badge-catalogue.tsx): green done, blue active, purple review, orange
 * needs you, red stopped, grey not yet or put away.
 *
 *   published  done (Published, Live, Complete, Approved)   success     the filled check circle
 *   progress   active                                       info        the ring a quarter filled (CircleProgress)
 *   review     in review, waiting for a yes                 discovery   the dashed ring round a check (CircleCheckDashed)
 *   changes    changes requested                            warning     the alert circle, filled
 *   draft      a draft, unpublished changes                 warning     the ring (gold until 2026-11-02)
 *   none       to do (Unrefined, Not reviewed)              neutral     the dashed ring
 *   blocked    blocked or failed                            danger      the cross circle, filled
 *   archived   archived, deprecated                         neutral     the archive box
 *
 * Words are the state's shortest name ("Published", not "Published in Area v2"). `size` follows the row: md in a card's
 * name row (its 18 line), sm in a table cell or a facts row.
 */
export type ProjectStatus = "published" | "draft";
export type Status = ProjectStatus | "progress" | "review" | "changes" | "none" | "blocked" | "archived";
export const STATUS = {
  published: { tone: "success", icon: <StatusAvailableFilledIcon /> },
  progress: { tone: "info", icon: <CircleProgressIcon /> },
  review: { tone: "discovery", icon: <CircleCheckDashedIcon /> },
  changes: { tone: "warning", icon: <AlertCircleFilledIcon /> },
  draft: { tone: "warning", icon: <EllipseIcon /> },
  none: { tone: "neutral", icon: <CircleDashedIcon /> },
  blocked: { tone: "danger", icon: <ErrorFilledIcon /> },
  archived: { tone: "neutral", icon: <ArchiveIcon /> },
} as const;
/** On its plate; `iconOnly` (the Sidebar) the mark alone, plain, its words its name and tooltip. */
export function StatusBadge({ status, iconOnly, size, children }: { status: Status; iconOnly?: boolean; size?: "sm" | "md"; children: ReactNode }) {
  return iconOnly
    ? <Badge variant="plain" iconOnly size={size} tone={STATUS[status].tone} icon={STATUS[status].icon} aria-label={String(children)} title={String(children)} />
    : <Badge variant="soft" size={size} tone={STATUS[status].tone} icon={STATUS[status].icon} className="gallery-tile__badge">{children}</Badge>;
}
export type TileShape = "square" | "wide";
/**
 * How the stage places its content:
 *   fit     centred in a wide margin and scaled to fit (components; fit.ts sizes it)
 *   center  centred (an icon, a setting's sample, a type specimen)
 *   flow    the content's own height, from the start (a type sample, an icon sheet)
 *   none    no stage: the frame is the visual (a swatch)
 *   screen  a product screen (ScreenFigure) as the frame's whole visual: the view takes the screen's 16:9 and the screen
 *           fills it, edge to edge inside the tile's inset, as a file's thumbnail (2026-10-31: in a square fit stage it
 *           sat in a 24 / 32 margin and half the tile's height was empty, on Home, Themes, History and a project)
 */
export type TileStage = "fit" | "center" | "flow" | "none" | "screen";

/** An Asset card tile's look: its container, where its name sits, its fill and whether it has an edge (Asset card's axes). */
export interface CardLook { container: "framed" | "basic" | "containerless"; caption: "above" | "below" | "overlay" | "outside"; fill: "recessed" | "raised"; borderless: boolean }
/**
 * The gallery cards' look: one surface (owner, 2026-10-24: "i like the basic, name below treatment"), its name in the
 * frame's first row at the top-left, as every card, tile and table in the feed (owner, 2026-10-31: "top-left everywhere";
 * docs/research/feed-system-2026-10-31; it was shown on the card under the pointer from 2026-10-24).
 */
export const GALLERY_LOOK: CardLook = { container: "basic", caption: "outside", fill: "recessed", borderless: false };

/** An Asset card's head in the feed: the app's card name (styles/canvas.css, .gallery-tile__caption: 11/14 at type 13). */
export const CARD_CAPTION = { className: "gallery-tile__caption" } as const;

/**
 * An image card's shape in a gallery of images, by the gallery's mode (view-controls.tsx GalleryMode; owner, 2026-11-01):
 * Grid gives every card one square footprint with the whole image inside at its own ratio (Are.na), Fixed ratio crops
 * every image to the chosen ratio, Waterfall and List leave it its own (the Asset grid hugs it in a waterfall).
 */
export function imageCard(mode: GalleryMode, ratio: GalleryRatio, width?: number, height?: number) {
  const mediaRatio = width && height ? width / height : undefined;
  const headProps = CARD_CAPTION;
  return mode === "fixed" ? { fit: "cover" as const, aspect: ratio, mediaRatio, headProps }
    : mode === "grid" ? { fit: "contain" as const, aspect: "square" as const, mediaRatio, headProps }
    : { fit: "natural" as const, mediaRatio, headProps };
}

/**
 * A collection's card, one card in two widths (owner, 2026-11-01: "the collection and group cards should be the same? one
 * is just a full width horizontal scroll version"; "for the collection cards with 4 in a grid, the AR should be square for
 * the images"): in a grid (References' Saved) the square card, its first four square, 2 × 2; across a column (Home) a row
 * of its images at their own ratios, `COLLECTION_ROW` tall, scrolling sideways. Its name and count top-left.
 */
export const COLLECTION_CARD = { container: "framed", caption: "outside", aspect: "square", mosaic: "grid", headProps: CARD_CAPTION } as const;
export const COLLECTION_STRIP = { container: "framed", caption: "outside", mosaic: "strip", headProps: CARD_CAPTION } as const;
/** A full-width collection's row height (Asset card's `--area-asset-card-strip-height`): References' Medium image. */
export const COLLECTION_ROW = 192; /* pick: imagery.tsx SIZES.medium */
/** A grid of collections: the feed's card grid (260 at the least). */
export const COLLECTION_MIN = 260; /* pick: the feed's card grid, PRODUCT_UI "The Canvas is a feed" */
export function collectionName(name: string, count: number) {
  return <>{name} <FeedCount count={count} /></>;
}

export interface TileProps {
  /** The name, in the caption under the frame. */
  label: ReactNode;
  /** Under the name: a hex, a size, a count, a grade. */
  value?: ReactNode;
  /** The value as a status (done, in review, draft or not started): its badge colour-coded with its mark (`STATUS`). */
  status?: Status;
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
  onOpen?: (how: OpenHow) => void;
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
  /** The design the tile opens in the design viewer: its frame grows into the viewer and takes it back (src/morph.ts). */
  "data-design"?: string;
  /** The frame painted as its visual: a colour and the ink that reads on it. */
  paint?: { background: string; color: string };
  /** A painted tile's name: on the colour, in its ink (the default), or under the card as every other card's. */
  paintLabel?: "inside" | "below";
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
   *  with slightly different proportions"): a card is square unless this says otherwise (landscape until 2026-11-01). */
  aspect?: "square" | "landscape" | "hug";
  /**
   * A plain tile's shape (owner, 2026-11-01: one card, "just variants of each other", then two shapes): square
   * (components, colours, images; the default) or wide, 16:9, for anything designed (a screen, a cover; a screen's
   * default), where a 1920 x 1080 window fits whole.
   */
  shape?: TileShape;
  /** Controls in the caption, at the end of the name's line (a Copy code button). */
  actions?: ReactNode;
  /** A click on the tile, outside the controls in its specimen and caption, opens it (`onOpen`). */
  openOnClick?: boolean;
  /** Kept for callers that name it: every tile is Area's Asset card now (2026-11-02). */
  container?: "plain" | "asset";
  children?: ReactNode;
}

/** How a tile was opened: with ⌘ (Ctrl), in a tab of its own, as Figma opens a file (owner's pick, 2026-10-31). */
export interface OpenHow { newTab: boolean }
const how = (event: { metaKey: boolean; ctrlKey: boolean }): OpenHow => ({ newTab: event.metaKey || event.ctrlKey });

const CONTROLS = "a, button, input, textarea, select, label, [contenteditable], [role=button], [role=switch], [role=checkbox], [role=radio], [role=tab], [role=slider], [role=combobox]";
/** A click opens the tile unless it was on a control inside it (the tile, a button to the keyboard, is not one of them). */
const onControl = (event: { target: EventTarget; currentTarget: EventTarget }) => {
  const control = (event.target as Element).closest(CONTROLS);
  return Boolean(control && control !== event.currentTarget);
};

/**
 * Every tile is Area's Asset card (owner, 2026-11-02: "Yes, rebuild tiles", after "the feed kit should leverage and use
 * real components"): the gallery look (GALLERY_LOOK: the frame alone, the name outside under it) unless a page gives its
 * own. A colour paints the frame and holds its name inside, in its ink, or under the card as every other card's
 * (`paintLabel`, Colors' Label option). The plain container it replaces was the app's own box (2026-10-21 to 2026-11-02).
 */
export function Tile(props: TileProps) {
  return <AssetTile {...props} look={props.look ?? GALLERY_LOOK} />;
}

/** Area's Asset card (Components). */
function AssetTile({ label, value, status, paintLabel = "inside", span, stage, shape, selected, onSelect, onOpen, card, aspect, look, actions, openOnClick, option, id, "aria-label": ariaLabel, "data-key": dataKey, "data-name": dataName, "data-design": design, paint, scope, stageScope, inert, children }: TileProps) {
  const { chrome } = useStudio();
  const specimen = { ...cardRestored(chrome.canvas), ...specimenScope(), ...stageScope };
  const view = stage === "none" ? null : stage === "fit"
    ? <div className="gallery-tile__view" {...specimen}><div className="gallery-tile__stage">{children}</div></div>
    : <div className="gallery-tile__view" inert={inert || undefined} {...specimen}>{stage === "screen" ? <ScreenCover.Provider value>{children}</ScreenCover.Provider> : children}</div>;
  // A value is a badge at the end of the name's line, a project's status colour-coded (owner, 2026-11-01), before the
  // caption's controls.
  const badge = value != null && value !== "" ? status ? <StatusBadge status={status}>{value}</StatusBadge> : <Badge variant="soft" tone="neutral" className="gallery-tile__badge">{value}</Badge> : null;
  const captionEnd = badge && actions ? <>{badge}{actions}</> : badge ?? actions;
  // A colour holds its name inside, in its ink, unless the page sets it under the card (Colors' Label option).
  const inside = Boolean(paint) && paintLabel === "inside";
  // The frame: the app's own class and modes on Asset card's frame. The ground it declares (the frame tone, a basic card's
  // own fill, or recessed when scoped) lets the specimen's control fills step from the frame, not the Canvas (layers.css).
  const frameProps = {
    className: "gallery-tile",
    "data-span": span,
    "data-stage": stage,
    "data-layout": card ? "card" : undefined,
    "data-design": design,
    "data-painted": paint ? "" : undefined,
    "data-scoped": scope ? "" : undefined,
    "data-area-ground": paint || look?.container === "containerless" ? undefined : scope ? "recessed" : look?.container === "basic" ? (look.fill === "raised" ? "raised" : "tile") : look?.fill === "raised" ? "frame-raised" : "frame",
    style: paint ? ({ "--_paint": paint.background, "--_ink": paint.color } as CSSProperties) : undefined,
    // A painted frame is the specimen itself (a colour card), so it takes the Inspector's settings.
    ...(paint ? specimen : {}),
    ...scope,
  } as Record<string, string | undefined> & { className: string; style?: CSSProperties };
  // A colour's name row inside its frame, at the app's scale (the frame is the specimen and takes the Inspector's).
  const body = inside ? <><div className="gallery-tile__head" {...feedScaleWithin({ ...specimen, ...scope })}><span className="gallery-tile__label">{label}</span>{captionEnd}</div>{view}</> : view;
  // The caption is the app's chrome, at the app's scale whatever the Canvas previews.
  // The frame may set type or density, and the caption may sit inside it (overlay) or under it: it is measured against
  // the frame, so a frame with a scale of its own always gets the caption's stated.
  const captionProps = { className: "gallery-tile__caption", ...feedScaleWithin(frameProps) };
  const shared = { ...CARD_SCOPE, id, "aria-label": ariaLabel ?? (inside && typeof label === "string" ? label : undefined), "data-key": dataKey, "data-name": dataName,
    name: inside ? undefined : label, actions: inside ? undefined : captionEnd, frameProps, captionProps,
    container: look?.container, caption: look?.caption, fill: look?.fill, borderless: look?.borderless,
    // Two shapes (owner, 2026-11-01): square (components, colours, images, a component's card) or wide, 16:9, for anything
    // designed, where a 1920 x 1080 window fits whole (a screen's default): Asset card's `screen` (its `wide` is 2:1).
    aspect: aspect ?? (card ? "square" as const : shape === "wide" || (stage === "screen" && shape !== "square") ? "screen" as const : "square" as const) };
  if (option !== undefined) {
    return <AssetGridItem value={option} className="gallery-asset" textValue={typeof label === "string" ? label : undefined} {...shared}>{body}</AssetGridItem>;
  }
  // A tile whose stage is inert has nothing inside to focus, so the tile itself is the control: a
  // Tab stop that Enter or Space selects, its state as aria-pressed (product UI rule 5).
  if (inert && onSelect) {
    return (
      <AssetCard {...shared} className="gallery-asset" interactive role="button" tabIndex={0} aria-pressed={selected ?? false} onClick={onSelect} onDoubleClick={onOpen ? event => onOpen(how(event)) : undefined}
        onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(); } }}>
        {body}
      </AssetCard>
    );
  }
  // A tile that opens on a click and has nothing of its own to focus is a button to the keyboard too (Testing's screens).
  if (onOpen && openOnClick && inert) {
    return (
      <AssetCard {...shared} className="gallery-asset" interactive role="button" tabIndex={0} selected={selected}
        onClick={event => { if (!onControl(event)) onOpen(how(event)); }}
        onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(how(event)); } }}>
        {body}
      </AssetCard>
    );
  }
  return (
    <AssetCard {...shared} className="gallery-asset" interactive selected={selected} onPointerDown={onSelect} onFocusCapture={onSelect}
      onClick={onOpen && openOnClick ? event => { if (!onControl(event)) onOpen(how(event)); } : undefined}
      onDoubleClick={onOpen && !openOnClick ? event => { if (!(event.target as Element).closest("input, textarea, select, [contenteditable]")) onOpen(how(event)); } : undefined}>
      {body}
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
 * A count after a label in the feed (owner, 2026-11-01: one count everywhere, "i like the updated counts in badges"):
 * Area's Count, soft and small, overhanging the label's line equally above and below (styles/canvas.css .studio-count),
 * so a title or a card name sits where it would without one. It was the muted number alone.
 */
export function FeedCount({ count }: { count: number }) {
  return <span className="studio-count"><Count variant="soft" size="sm" count={count} max={9999} /></span>;
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
      {title ? <SectionHeading className="studio-section-heading" titleId={`${id}-title`} lede={lede} {...feedScale()}
        title={count === undefined ? title : <>{title} <FeedCount count={count} /></>} /> : null}
      {children}
    </section>
  );
}

/**
 * Renders its content once it nears the view (600 above or below), with a placeholder of `estimate` until then, and keeps
 * it after (owner, 2026-10-30: "the nav is laggy"). A page of many heavy parts (Colors' hundreds of step cards, Patterns'
 * whole screens) drew all of them before its first paint, 2.5 seconds after a click; now it draws what is in view.
 */
export function WhenVisible({ estimate, children }: { estimate: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (seen || !element) return;
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { setSeen(true); observer.disconnect(); } }, { rootMargin: "600px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [seen]);
  return seen ? <>{children}</> : <div ref={ref} style={{ minBlockSize: estimate }} aria-hidden="true" />;
}
