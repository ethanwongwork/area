/**
 * The design viewer: one design alone on a bounded canvas (owner, 2026-10-31: "anything thats designed exists in its own
 * standalone visual playground like figma, but its only ever limited to 1 design, not an infinite canvas"; step 2 of the
 * IA and playground review, picked 2026-10-31). Grown from the screen viewer of the same day ("make the ui part centered
 * by itself with a gray background frame thats zoomable"), so every gallery opens what it holds the same way: a theme's
 * screen on Themes, a pattern, an icon, an Inspiration image, a project page's layer. Read only for now; the playground's
 * tools come next (the review's steps 4 to 7).
 *
 * The design sits centred on a ground of its own at its true size, fitted to the Canvas (`maxFit` lets a small one, an
 * icon, fit larger than 100%) or zoomed: the Zoom control, a pinch (Ctrl or ⌘ with the wheel), + and −, ⇧0 for 100% and
 * ⇧1 to fit, as Figma's keys; a pinch zooms about the pointer, the keys about the view's centre. Pan scrolls, or drags
 * with Space held or the middle button; the canvas ends at the design plus its margin, so it can't be lost. Every design
 * zooms to 3200% (an icon to 6400%) and shows a pixel grid from 800%, as Figma's (owner, 2026-11-04, the fidelity pass;
 * the grid was the icons' alone and the rest stopped at 400% until then). The design is centred on whole pixels.
 *
 * Its controls sit in the Canvas header (Figma's and Framer's preview bars): at its start, after Back, what is shown, as
 * ghost menus: the design's mode (Light, Dark, or both side by side, for a themed design) and the ground behind it (Grey,
 * White, Black, Checkerboard); at its end how: the place among its gallery's designs with ← and → (the keys too), then
 * the zoom, whose menu holds the view's own toggles. Escape or ⌘↑ goes back, shrinking the design into its card
 * (src/morph.ts); ⌘[ is the tab's Back. The choices are the viewer's, kept per person (view-controls.tsx
 * `useViewOption`); the design's own look is its theme's.
 */
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Button, ZoomControl } from "@area/react";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, MoonIcon, SunIcon, SunMoonIcon } from "@area/icons";
import { useViewOption, ViewFilter } from "./view-controls.tsx";
import { leaveFrom, morph, takeMorph } from "./morph.ts";
import { useStageKeys } from "./stage.tsx";

type Mode = "light" | "dark" | "both";
type Ground = "grey" | "white" | "black" | "checker";
const GROUNDS: ReadonlyArray<{ value: Ground; label: string }> = [
  { value: "grey", label: "Grey" }, { value: "white", label: "White" }, { value: "black", label: "Black" }, { value: "checker", label: "Checkerboard" },
];
/** The ground's margin round the design when fitted, and the gap between two (Light and Dark): the Canvas's section step. */
const MARGIN = 48; /* pick */
const GAP = 32; /* pick */
const MIN = 0.1;
/** The zooms the stepper moves between, Figma's set, up to its 6400%. */
const STOPS = [0.1, 0.25, 0.33, 0.5, 0.75, 1, 1.5, 2, 3, 4, 8, 16, 32, 64];
/** From this zoom a pixel grid shows over a design that asks for one (Figma's 800%). */
const PIXEL_GRID = 8;
/** What a key or a click must not take from a field or an open menu. */
const TYPING = "input, textarea, select, [contenteditable], [role=combobox], [role=listbox], [role=menu], [role=slider]";

export interface DesignViewerOptions {
  /** The design's key: a new one starts fitted, and it names the card the viewer grows from and returns to (`data-design`). */
  design: string;
  /** What the canvas is called, for assistive technology ("Analytics dashboard"). */
  label: string;
  /** The design's true width; its height, or left out, measured from what it draws at that width. */
  width: number;
  height?: number;
  /** The design, drawn at its true size (or at `scale`, with `selfScaled`) in a mode. */
  render: (mode: "light" | "dark", scale: number) => ReactNode;
  /** The design draws itself at the zoom (a theme's screen, which crossfades), so the viewer does not scale it. Needs `height`. */
  selfScaled?: boolean;
  /** A themed design offers Light, Dark or both; an image has one look. */
  themed?: boolean;
  /** The app's mode, the design's first mode. */
  appMode: "light" | "dark";
  /** The frame round the design: a desktop window's corner and lift, or none (a phone draws its own). */
  frame?: "window" | "bare";
  /** The largest zoom fitting may choose (1: never past true size; an icon's is larger) and the largest a person may (3200%). */
  maxFit?: number;
  max?: number;
  /** A pixel grid from 800% (on by default). */
  pixelGrid?: boolean;
  /** More rows for the zoom's menu (the view's own toggles). */
  menu?: ReactNode;
  /** Back to the gallery the design was opened from. */
  back?: { label: string; onBack: () => void };
  /** The design's place among its gallery's, and the step to the one before or after. */
  step?: { index: number; count: number; noun: string; onStep: (by: 1 | -1) => void };
  /** Whether the viewer is showing: its keys are the gallery's while it is not (a page calls the hook either way). */
  active?: boolean;
}

export interface DesignViewer {
  /** Back, and what is shown, for the Canvas header's start (inside the page's ViewLead). */
  lead: ReactNode;
  /** The place among the gallery's designs, and the zoom, for the Canvas header's end (inside the page's ViewControls). */
  controls: ReactNode;
  /** The ground with the design on it, for the Canvas body. */
  stage: ReactNode;
}

export function useDesignViewer(options: DesignViewerOptions): DesignViewer {
  const { design, label, width, height, render, selfScaled = false, themed = true, appMode, frame = "window", maxFit = 1, max = 32, pixelGrid = true, menu, back, step, active = true } = options;
  const [mode, setMode] = useViewOption<Mode>("viewer-mode", appMode, ["light", "dark", "both"]);
  const [ground, setGround] = useViewOption<Ground>("viewer-ground", "grey", ["grey", "white", "black", "checker"]);
  // A zoom the person chose, for the design it was chosen on; otherwise the design is fitted to the view.
  const [chosen, setChosen] = useState<{ design: string; zoom: number } | null>(null);
  const zoom = chosen?.design === design ? chosen.zoom : null;
  const clamp = (next: number) => Math.min(max, Math.max(MIN, next));
  // The keys and the Zoom control zoom about the view's centre; Fit centres the design again.
  const setZoom = (next: number | null) => {
    anchor.current = next === null || !element ? null : pointAt(element.clientWidth / 2, element.clientHeight / 2);
    setChosen(next === null ? null : { design, zoom: clamp(next) });
  };
  const [size, setSize] = useState({ w: 0, h: 0 });
  // The view is attached whenever the stage mounts (the page may open on another view first).
  const [element, setElement] = useState<HTMLElement | null>(null);
  const first = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!element) return;
    setSize({ w: element.clientWidth, h: element.clientHeight });
    const observer = new ResizeObserver(() => setSize({ w: element.clientWidth, h: element.clientHeight }));
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  // A design without a height is as tall as it draws at its width (read unscaled: a transform leaves its layout box alone).
  const [measured, setMeasured] = useState<{ design: string; h: number } | null>(null);
  const [content, setContent] = useState<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (!content || height !== undefined) return;
    const read = () => setMeasured({ design, h: content.offsetHeight });
    read();
    const observer = new ResizeObserver(read);
    observer.observe(content);
    return () => observer.disconnect();
  }, [content, design, height]);
  const natural = height ?? (measured?.design === design && measured.h ? measured.h : Math.round(width * 0.625));

  // Two modes sit side by side or one above the other, whichever fits them larger.
  const modes: Array<"light" | "dark"> = !themed ? [appMode] : mode === "both" ? ["light", "dark"] : [mode];
  const n = modes.length;
  const fitOf = (columns: number, rows: number) => Math.min(
    (size.w - 2 * MARGIN - GAP * (columns - 1)) / (width * columns),
    (size.h - 2 * MARGIN - GAP * (rows - 1)) / (natural * rows),
  );
  const across = fitOf(n, 1), stacked = fitOf(1, n);
  const fitted = size.w ? clamp(Math.min(maxFit, Math.max(across, stacked))) : 0.25;
  const scale = zoom ?? fitted;
  const direction = n === 1 || across >= stacked ? "row" : "column";
  const stops = STOPS.filter(stop => stop <= max);
  const zoomBy = (by: 1 | -1) => setZoom(by > 0 ? stops.find(stop => stop > scale + 1e-3) ?? max : [...stops].reverse().find(stop => stop < scale - 1e-3) ?? MIN);

  // A zoom keeps one point of the design where it is in the view (`anchor`: the point in the design's own pixels, from the
  // first screen's top start, and where it sits in the view): the view's centre for the keys and the Zoom control, and the
  // pointer for a pinch (owner, 2026-11-04, the fidelity pass: "figma's vector fidelity and zooming"; Figma zooms about
  // the pointer). It was the view's centre for both, kept as a share of the scrolled content, until then.
  const shown = useRef(scale);
  shown.current = scale;
  const current = useRef(design);
  current.current = design;
  const anchor = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  /** The design's point under a point of the view (`px`, `py` from its top start), at the zoom drawn now. */
  const pointAt = (px: number, py: number) => {
    const screen = first.current;
    if (!element || !screen) return null;
    const view = element.getBoundingClientRect(), at = screen.getBoundingClientRect();
    return { x: (view.left + px - at.left) / shown.current, y: (view.top + py - at.top) / shown.current, px, py };
  };
  useEffect(() => { anchor.current = null; }, [design]);
  useEffect(() => {
    if (!element) return;
    // A pinch on a trackpad (the wheel with Ctrl), or ⌘ with the wheel, zooms about the pointer; the wheel alone scrolls.
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const view = element.getBoundingClientRect();
      anchor.current = pointAt(event.clientX - view.left, event.clientY - view.top);
      setChosen({ design: current.current, zoom: clamp(shown.current * Math.exp(-event.deltaY * 0.01)) });
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [element, max]);
  useLayoutEffect(() => {
    const screen = first.current;
    if (!element || !screen) return;
    // Until the view scrolls or zooms, the design's centre stays at the view's.
    const to = anchor.current ?? { x: width / 2, y: natural / 2, px: element.clientWidth / 2, py: element.clientHeight / 2 };
    const view = element.getBoundingClientRect(), at = screen.getBoundingClientRect();
    element.scrollLeft = Math.round(at.left - view.left + element.scrollLeft + to.x * scale - to.px);
    element.scrollTop = Math.round(at.top - view.top + element.scrollTop + to.y * scale - to.py);
  }, [element, scale, n, natural, size.w, size.h]);
  // Scrolling, and the keys' zooms after it, keep the design's point at the view's centre.
  const track = () => {
    if (element) anchor.current = pointAt(element.clientWidth / 2, element.clientHeight / 2);
  };

  // Opened from a card: once the view has its size, the design grows from where the card was.
  useLayoutEffect(() => {
    if (!size.w) return;
    const move = takeMorph("viewer", design);
    if (move) morph(first.current, move.from, "slow");
  }, [design, size.w > 0]);

  const goBack = back ? () => { leaveFrom(first.current, design); back.onBack(); } : undefined;
  useStageKeys({ onBack: () => goBack?.(), enabled: active && Boolean(goBack) });

  // Figma's view keys: + and − step the zoom, ⇧0 is 100%, ⇧1 fits; ← and → step through the gallery. Space held pans.
  const spaceHeld = useRef(false);
  const [panning, setPanning] = useState<"ready" | "dragging" | null>(null);
  const latest = useRef({ zoomBy, setZoom, step });
  latest.current = { zoomBy, setZoom, step };
  useEffect(() => {
    if (!active) return;
    const down = (event: KeyboardEvent) => {
      const target = event.target as Element | null;
      if (event.defaultPrevented || target?.closest?.(TYPING) || document.querySelector(":popover-open, dialog[open]")) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const { zoomBy: by, setZoom: to, step: move } = latest.current;
      if (event.code === "Space") { event.preventDefault(); if (!spaceHeld.current) { spaceHeld.current = true; setPanning(now => now ?? "ready"); } return; }
      if (event.shiftKey && event.code === "Digit0") { event.preventDefault(); to(1); }
      else if (event.shiftKey && event.code === "Digit1") { event.preventDefault(); to(null); }
      else if (event.key === "+" || event.key === "=") { event.preventDefault(); by(1); }
      else if (event.key === "-" || event.key === "_") { event.preventDefault(); by(-1); }
      else if (move && !event.shiftKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")) { event.preventDefault(); move.onStep(event.key === "ArrowRight" ? 1 : -1); }
    };
    const up = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      spaceHeld.current = false;
      setPanning(now => now === "dragging" ? now : null);
    };
    addEventListener("keydown", down);
    addEventListener("keyup", up);
    return () => { removeEventListener("keydown", down); removeEventListener("keyup", up); spaceHeld.current = false; setPanning(null); };
  }, [active]);
  const pan = (event: ReactPointerEvent<HTMLElement>) => {
    if (!element || !(event.button === 1 || (event.button === 0 && spaceHeld.current))) return;
    event.preventDefault();
    const start = { x: event.clientX, y: event.clientY, left: element.scrollLeft, top: element.scrollTop };
    const surface = event.currentTarget;
    surface.setPointerCapture(event.pointerId);
    setPanning("dragging");
    const move = (next: PointerEvent) => {
      element.scrollLeft = start.left - (next.clientX - start.x);
      element.scrollTop = start.top - (next.clientY - start.y);
    };
    const end = () => {
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerup", end);
      surface.removeEventListener("pointercancel", end);
      setPanning(spaceHeld.current ? "ready" : null);
    };
    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerup", end);
    surface.addEventListener("pointercancel", end);
  };

  const swatch = (value: Ground) => <span className="studio-viewer__swatch" data-ground={value} aria-hidden="true" />;
  const lead = (
    <>
      {back ? <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<ArrowLeftIcon />} aria-label={back.label} onClick={goBack} /> : null}
      {themed ? <ViewFilter label="Mode" align="start" value={mode} onChange={setMode}
        options={[{ value: "light", label: "Light", icon: <SunIcon /> }, { value: "dark", label: "Dark", icon: <MoonIcon /> }, { value: "both", label: "Light and dark", icon: <SunMoonIcon /> }]} /> : null}
      <ViewFilter label="Background" align="start" value={ground} onChange={setGround}
        options={GROUNDS.map(entry => ({ ...entry, icon: swatch(entry.value) }))} />
    </>
  );
  const controls = (
    <>
      {step && step.count > 1 ? <>
        <span className="studio-viewer__place">{step.index + 1} of {step.count}</span>
        <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<ChevronLeftIcon />} aria-label={`Previous ${step.noun}`} onClick={() => step.onStep(-1)} />
        <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<ChevronRightIcon />} aria-label={`Next ${step.noun}`} onClick={() => step.onStep(1)} />
      </> : null}
      <ZoomControl stepper size="sm" aria-label="Zoom" value={scale} min={MIN} max={max} presets={[0.5, 1, 2].filter(stop => stop <= max)} stops={stops}
        shortcuts={{ zoomIn: "+", zoomOut: "−", zoomToFit: "⇧1", presets: { 1: "⇧0" } }}
        valueLabel={zoom === null ? "Fit" : undefined} onValueChange={next => setZoom(next)} onZoomToFit={() => setZoom(null)}>
        {menu}
      </ZoomControl>
    </>
  );

  const box = { inlineSize: Math.round(width * scale), blockSize: Math.round(natural * scale) };
  // Centred on whole pixels: where the room left round the designs is odd, a pixel more at the end, so the design's top
  // start lands on a pixel (a half pixel blurs every edge and word on a 1x display).
  const columns = direction === "row" ? n : 1, rows = direction === "row" ? 1 : n;
  const odd = (room: number, used: number) => (Math.round(room - used) % 2 + 2) % 2;
  const endPad = odd(size.w, box.inlineSize * columns + GAP * (columns - 1)), bottomPad = odd(size.h, box.blockSize * rows + GAP * (rows - 1));
  const stage = (
    <section ref={setElement} className="studio-viewer" data-ground={ground} data-panning={panning ?? undefined} aria-label={label}
      onScroll={track} onPointerDown={pan}>
      <div className="studio-viewer__canvas" data-direction={direction}
        style={{ paddingBlock: `${MARGIN}px ${MARGIN + bottomPad}px`, paddingInline: `${MARGIN}px ${MARGIN + endPad}px`, gap: GAP }}>
        {modes.map((at, index) => (
          <div key={at} ref={index === 0 ? first : undefined} className="studio-viewer__screen" data-frame={frame}
            style={{ ...box, ["--_viewer-scale" as string]: scale }}>
            {selfScaled ? render(at, scale) : (
              <div ref={index === 0 ? setContent : undefined} className="studio-viewer__content"
                style={{ inlineSize: width, blockSize: height, transform: `scale(${scale})` }}>
                {render(at, 1)}
              </div>
            )}
            {pixelGrid && scale >= PIXEL_GRID ? <div className="studio-viewer__pixels" style={{ ["--_px" as string]: `${scale}px` }} aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
    </section>
  );
  return { lead, controls, stage };
}
