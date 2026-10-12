/**
 * The Canvas's one container and one grid (owner, 2026-10-11: "the gallery and the container
 * being the main way to show designs"). Every specimen, a component, a swatch, a type role, an
 * icon or a setting, sits in the same Tile: the frame, a header (label at the start, an optional
 * value at the end) and a stage.
 *
 * The visual is the container itself, never a box inside one (owner, 2026-10-11): a colour tile is
 * painted in its colour (`paint`), a setting's tile is that setting's own ground (`scope`), and a
 * stage only places its content: fit, centre or flow.
 *
 * Tiles come in three spans on one grid (src/studio.css, .studio-grid):
 *   unit  one base cell, 136 at the least, 5:4: a swatch, an icon
 *   wide  2 x 2 units and the gap between them: a component, a setting's preset, a type specimen
 *   row   the full width, as tall as its content: an icon sheet, a type sample
 * A grid holds one span (TileGrid), so wide tiles always line up on pairs of units.
 *
 * The class names are the docs gallery's (gallery-tile, __view, __stage), so the shared fit
 * (apps/docs/src/gallery/fit.ts) still finds component specimens.
 */
import type { CSSProperties, ReactNode } from "react";

export type TileSpan = "unit" | "wide" | "row";
/**
 * How the stage places its content:
 *   fit     centred in a wide margin and scaled to fit (components; fit.ts sizes it)
 *   center  centred (an icon, a setting's sample, a type specimen)
 *   flow    the content's own height, from the start (a type sample, an icon sheet)
 *   none    no stage: the tile is the visual (a swatch)
 */
export type TileStage = "fit" | "center" | "flow" | "none";

export interface TileProps {
  label: ReactNode;
  /** At the end of the header: a hex, a size, a count. */
  value?: ReactNode;
  span: TileSpan;
  stage: TileStage;
  selected?: boolean;
  /**
   * Selecting the tile. With `pressable` the tile is a button (its content must not be
   * interactive: a swatch, an icon); otherwise a pointer down or focus inside selects it.
   */
  onSelect?: () => void;
  pressable?: boolean;
  /** Names the tile when the label alone would not ("Button: Sizes / sm"). */
  "aria-label"?: string;
  /** The tile painted as its visual: a colour and the ink that reads on it. */
  paint?: { background: string; color: string };
  /**
   * The tile as a setting's own scope (data-area-* attributes): the whole tile takes the setting
   * and paints that setting's subtle ground, Primer's tinted plate.
   */
  scope?: Record<string, string>;
  /** The stage alone as a scope (a type sample at one density), the tile staying the gallery's. */
  stageScope?: Record<string, string>;
  /** The stage is shown, not used: its content is inert. */
  inert?: boolean;
  children?: ReactNode;
}

export function Tile({ label, value, span, stage, selected, onSelect, pressable, "aria-label": ariaLabel, paint, scope, stageScope, inert, children }: TileProps) {
  // A pressable tile is a button, which holds phrasing content only: its parts are spans there.
  const Part = pressable ? "span" : "div";
  const head = (
    <Part className="gallery-tile__head" data-area-ui="compact">
      <span className="gallery-tile__label">{label}</span>
      {value != null ? <span className="gallery-tile__value">{value}</span> : null}
    </Part>
  );
  const view = stage === "none" ? null : stage === "fit"
    ? <Part className="gallery-tile__view"><Part className="gallery-tile__stage">{children}</Part></Part>
    : <Part className="gallery-tile__view" inert={inert || undefined} {...stageScope}>{children}</Part>;
  const shared = {
    className: "gallery-tile",
    "data-span": span,
    "data-stage": stage,
    "data-painted": paint ? "" : undefined,
    "data-scoped": scope ? "" : undefined,
    "aria-label": ariaLabel,
    style: paint ? ({ "--_paint": paint.background, "--_ink": paint.color } as CSSProperties) : undefined,
    ...scope,
  };
  if (pressable) {
    return <button type="button" {...shared} aria-pressed={selected ?? false} onClick={onSelect}>{head}{view}</button>;
  }
  return (
    <article {...shared} data-selected={selected ? "" : undefined} onPointerDown={onSelect} onFocusCapture={onSelect}>
      {head}{view}
    </article>
  );
}

/** A grid of one span: unit or wide tiles on the shared unit, or row tiles stacked. */
export function TileGrid({ span, children }: { span: TileSpan; children: ReactNode }) {
  return <div className={span === "row" ? "studio-stack" : `studio-grid studio-grid--${span}`}>{children}</div>;
}

/** A titled group on the Canvas: a family, a scale, a category, a setting. */
export function CanvasSection({ id, title, lede, children }: { id: string; title?: ReactNode; lede?: ReactNode; children: ReactNode }) {
  // Untitled when the Canvas bar already names it (one scale, one setting).
  return (
    <section className="studio-section" id={id} aria-labelledby={title ? `${id}-title` : undefined}>
      {title ? <h2 className="studio-canvas__section-title" id={`${id}-title`} data-area-ui="compact">{title}</h2> : null}
      {lede ? <p className="studio-canvas__lede" data-area-ui="compact">{lede}</p> : null}
      {children}
    </section>
  );
}

/**
 * A list view's frame: an Area Table at the tiles' corner. Radius 14 is the setting whose
 * container corner is the tiles' 24 (the surface ladder), so a list and a grid of the same things
 * share their shape.
 */
export function ListFrame({ children }: { children: ReactNode }) {
  return <div className="studio-list" data-area-radius="14">{children}</div>;
}
