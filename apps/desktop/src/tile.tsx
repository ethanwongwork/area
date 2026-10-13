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
 * (src/gallery/fit.ts) still finds component specimens.
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
  /**
   * Opening the tile's own view (Components: its family's Stage) on a double-click, as Finder and
   * Figma open what a click selects. A double-click in a text field stays the field's.
   */
  onOpen?: () => void;
  pressable?: boolean;
  /** The element's id, so a view can bring the tile back into sight. */
  id?: string;
  /** Names the tile when the label alone would not ("Button: Sizes / sm"). */
  "aria-label"?: string;
  /** What a pin menu pins (src/organize.tsx, PinMenu): the thing's key and its name. */
  "data-key"?: string;
  "data-name"?: string;
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

export function Tile({ label, value, span, stage, selected, onSelect, onOpen, pressable, id, "aria-label": ariaLabel, "data-key": dataKey, "data-name": dataName, paint, scope, stageScope, inert, children }: TileProps) {
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
    id,
    className: "gallery-tile",
    "data-span": span,
    "data-stage": stage,
    "data-painted": paint ? "" : undefined,
    "data-scoped": scope ? "" : undefined,
    "aria-label": ariaLabel,
    "data-key": dataKey,
    "data-name": dataName,
    style: paint ? ({ "--_paint": paint.background, "--_ink": paint.color } as CSSProperties) : undefined,
    ...scope,
  };
  if (pressable) {
    return <button type="button" {...shared} aria-pressed={selected ?? false} onClick={onSelect}>{head}{view}</button>;
  }
  // A tile whose stage is inert has nothing inside to focus, so the tile itself is the control: a
  // Tab stop that Enter or Space selects, its state as aria-pressed (product UI rule 5). Its content
  // can be block-level drawings, which a <button> may not hold.
  if (inert && onSelect) {
    return (
      <article {...shared} role="button" tabIndex={0} aria-pressed={selected ?? false} onClick={onSelect}
        onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(); } }}>
        {head}{view}
      </article>
    );
  }
  return (
    <article {...shared} data-selected={selected ? "" : undefined} onPointerDown={onSelect} onFocusCapture={onSelect}
      onDoubleClick={onOpen ? event => { if (!(event.target as Element).closest("input, textarea, select, [contenteditable]")) onOpen(); } : undefined}>
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
