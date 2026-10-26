/**
 * The Stage: one family's isolated view (owner, 2026-10-12; research in
 * docs/research/component-stage-2026-10-12.md). The gallery grid is the way through the whole
 * system; the Stage is one component at its real size, with its code in a Code block under it, the
 * family's own tiles below, and the Inspector holding what the Stage renders.
 *
 * The Stage is the Canvas's container (product UI rule 11): the tile's edge, corner and head, made
 * large. Its code is a separate Code block under it, not a row of the frame (owner, 2026-10-18). Its right edge
 * resizes it, so a component can be read at a narrow width (React Bits'
 * resizer: arrow keys step 10, Shift 50; Home is the narrowest, End or a double-click the full
 * width). The width shows in the head while it differs from the full width. How the Stage is viewed
 * (zoom, replay) is the Canvas bar's; what it renders is the Inspector's.
 */
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Button, CodeBlock, Field, Input, PanelSection, Segmented, Select, Switch } from "@area/react";
// @ts-expect-error — the highlighter is authored in JavaScript.
import { highlight } from "./content/highlight.mjs";
import type { Config, Playground, PlaygroundControl, PropValue } from "./content/playgrounds.tsx";
import { appScale } from "./app-scale.ts";
import { specimenScope } from "./specimen-scope.tsx";

/** The narrowest the Stage is dragged to: a phone's 320 less the Canvas's margins. */
const MIN_WIDTH = 288; /* pick */
/** Lines of code shown before the block collapses to an excerpt (CodeBlock's own excerpt is 8). */
const EXCERPT = 8;

export interface StageProps {
  /** The head's label: the tile on the Stage, or "Custom" when the Properties match none. */
  label: ReactNode;
  /** The code under the Stage: the configured instance's, or the demo's own source. */
  code?: string;
  /** "2": specimens at twice their size (the Canvas bar's zoom). */
  zoom: string;
  /** Counts the Canvas bar's Replay: each press mounts the specimen again, replaying its entrance. */
  replays: number;
  children: ReactNode;
}

export function Stage({ label, code, zoom, replays, children }: StageProps) {
  const frame = useRef<HTMLDivElement>(null);
  // null: the full width of the Canvas.
  const [width, setWidth] = useState<number | null>(null);
  const [room, setRoom] = useState(0);

  // The room the Stage can take: the Canvas's content width, followed as panels resize.
  useLayoutEffect(() => {
    const parent = frame.current?.parentElement;
    if (!parent) return;
    // Measured now as well: a ResizeObserver reports on the next rendered frame, and a hidden
    // window renders none.
    setRoom(parent.clientWidth);
    const observer = new ResizeObserver(() => setRoom(parent.clientWidth));
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  const clamp = (next: number) => Math.round(Math.min(Math.max(next, MIN_WIDTH), room || next));
  const shown = width === null ? room : Math.min(width, room);
  const narrowed = width !== null && width < room;

  const drag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const handle = event.currentTarget;
    const start = event.clientX;
    const from = frame.current?.getBoundingClientRect().width ?? shown;
    handle.setPointerCapture(event.pointerId);
    const move = (next: globalThis.PointerEvent) => setWidth(clamp(from + next.clientX - start));
    const end = () => { handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", end); handle.removeEventListener("pointercancel", end); };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  };
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 50 : 10;
    const next = event.key === "ArrowLeft" ? clamp(shown - step) : event.key === "ArrowRight" ? clamp(shown + step)
      : event.key === "Home" ? MIN_WIDTH : event.key === "End" ? room : null;
    if (next === null) return;
    event.preventDefault();
    setWidth(next >= room ? null : next);
  };

  const lines = code ? code.split("\n").length : 0;
  return (
    // The code is its own Code block under the frame, a tile's gap apart (owner, 2026-10-18: "the code is separated
    // from the bottom of the frame of the main component container"; it was the frame's last row, Primer's model).
    <div className="studio-stage-group">
    <div ref={frame} className="studio-stage" data-area-ground="raised" style={narrowed ? { inlineSize: `${width}px` } : undefined}>
      <div className="studio-stage__head gallery-tile__head" {...appScale()}>
        <span className="gallery-tile__label">{label}</span>
        {narrowed ? <span className="gallery-tile__value">{shown} px</span> : null}
      </div>
      <div className="studio-stage__view" data-zoom={zoom} {...specimenScope()}>
        <div key={replays} className="studio-stage__content">{children}</div>
      </div>
      <div className="studio-stage__handle" role="separator" aria-orientation="vertical" aria-label="Stage width"
        aria-valuemin={MIN_WIDTH} aria-valuemax={room} aria-valuenow={shown} aria-valuetext={`${shown} pixels`} tabIndex={0}
        onPointerDown={drag} onKeyDown={keys} onDoubleClick={() => setWidth(null)} />
    </div>
    {code ? (
      // Keyed by the code, so a long snippet starts as its excerpt each time the Stage changes.
      <CodeBlock key={code} lineNumbers={false} language="tsx"
        html={highlight(code)} collapsible={lines > EXCERPT} defaultCollapsed={lines > EXCERPT} {...appScale()} />
    ) : null}
    </div>
  );
}

/* --- Inspector: Properties --------------------------------------------------- */

/* Sizes keep their short names (sm, md, lg), as the tiles label them; other values are words. */
const optionLabel = (prop: string, value: string) => prop === "size" ? value : value[0]!.toUpperCase() + value.slice(1);

/**
 * What the Stage renders, one row per prop, from the component's manifest (src/content/playgrounds.tsx).
 * Two or three choices are a Segmented and longer lists a Select (gallery/controls.ts's rule);
 * flags are Switches; the label is a field. Reset appears once something differs from the
 * defaults (React Bits' Customize).
 */
export function Properties({ playground, config, changed, onChange, onReset }: {
  playground: Playground;
  config: Config;
  changed: boolean;
  onChange: (prop: string, value: PropValue) => void;
  onReset: () => void;
}) {
  return (
    <PanelSection heading="Properties"
      actions={changed ? <Button variant="ghost" tone="neutral" size="sm" onClick={onReset}>Reset</Button> : null}>
      {playground.controls.map(control => (
        <Field key={control.prop} label={control.label} orientation="horizontal">
          {renderControl(control, config[control.prop] ?? control.initial, value => onChange(control.prop, value))}
        </Field>
      ))}
    </PanelSection>
  );
}

function renderControl(control: PlaygroundControl, value: PropValue, change: (value: PropValue) => void) {
  if (control.kind === "boolean") {
    return <Switch size="sm" aria-label={control.label} checked={value === true} onCheckedChange={checked => change(checked)} />;
  }
  if (control.kind === "text") {
    return <Input size="sm" variant="soft" aria-label={control.label} value={String(value)} onChange={event => change(event.currentTarget.value)}
      {...(control.numeric ? { type: "number", inputMode: "numeric", min: 0 } : {})} />;
  }
  const options = control.options!;
  return options.length <= 3 ? (
    <Segmented size="sm" fullWidth aria-label={control.label} value={String(value)} onValueChange={next => change(next)}
      items={options.map(option => ({ value: option, label: optionLabel(control.prop, option) }))} />
  ) : (
    <Select size="sm" variant="soft" fullWidth aria-label={control.label} value={String(value)} onChange={event => change(event.currentTarget.value)}>
      {options.map(option => <option key={option} value={option}>{optionLabel(control.prop, option)}</option>)}
    </Select>
  );
}

/**
 * Leaving the Stage and opening it, from the keyboard: Escape or ⌘↑ goes back to the grid (Finder's
 * enclosing folder), unless Escape belongs to a field or an open overlay. Listened for in the capture
 * phase, so an overlay that closes on Escape is still open when this looks.
 */
export function useStageKeys({ onBack, enabled }: { onBack: () => void; enabled: boolean }) {
  const back = useRef(onBack);
  back.current = onBack;
  useEffect(() => {
    if (!enabled) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      const up = event.key === "ArrowUp" && (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey;
      const escape = event.key === "Escape" && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
      if (!up && !escape) return;
      const target = event.target as Element | null;
      if (escape && (event.defaultPrevented || target?.closest("input, textarea, select, [contenteditable], [role='combobox'], [role='menu'], [role='listbox']")
        || document.querySelector(":popover-open, dialog[open]"))) return;
      event.preventDefault();
      back.current();
    };
    addEventListener("keydown", onKey, true);
    return () => removeEventListener("keydown", onKey, true);
  }, [enabled]);
}
