/**
 * The screen viewer (owner, 2026-10-31: "make the ui part centered by itself with a gray background frame thats zoomable.
 * put some controls on the top header (below the tab) that can help control viewing modes, bg color, dark mode ... this
 * can be a testing variation of how the THINGS that are designed in projects will be viewed"). A trial for how a project's
 * screens are looked at: one screen at true size (setup-screen.tsx), centred on a ground of its own, fitted to the Canvas
 * or zoomed (the zoom control, or a pinch: Ctrl or ⌘ with the wheel), scrolled when larger than the view.
 *
 * Its controls sit in the Canvas header (Figma's and Framer's preview bars): at its start, after the page's own, what is
 * shown, as ghost menus: the screen's mode (Light, Dark, or both) and the ground behind it (Grey, White, Black,
 * Checkerboard); at its end how, the zoom, whose menu also holds the view's toggles (the held states, the window's frame). The choices are the viewer's, kept per person
 * (view-controls.tsx `useViewOption`); the screen's own look is the theme's.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { MenuItem, MenuSeparator, ZoomControl } from "@area/react";
import { MoonIcon, SunIcon, SunMoonIcon } from "@area/icons";
import { SCREEN, SHOWCASE, ScreenFigure, type Hold } from "./setup-screen.tsx";
import { useViewOption, ViewFilter } from "./view-controls.tsx";

type Mode = "light" | "dark" | "both";
type Ground = "grey" | "white" | "black" | "checker";
const GROUNDS: ReadonlyArray<{ value: Ground; label: string }> = [
  { value: "grey", label: "Grey" }, { value: "white", label: "White" }, { value: "black", label: "Black" }, { value: "checker", label: "Checkerboard" },
];
/** The ground's margin round the screen when fitted, and the gap between two screens: the Canvas's section step. */
const MARGIN = 48; /* pick */
const GAP = 32; /* pick */
const MIN = 0.1, MAX = 4;
/** The zooms the stepper moves between, Figma's set below and above 100%. */
const STOPS = [0.1, 0.25, 0.33, 0.5, 0.75, 1, 1.5, 2, 3, 4];
const clamp = (zoom: number) => Math.min(MAX, Math.max(MIN, zoom));

export interface ScreenViewer {
  /** What is shown, for the Canvas header's start (inside the page's ViewLead). */
  lead: ReactNode;
  /** The zoom, for the Canvas header's end (inside the page's ViewControls). */
  controls: ReactNode;
  /** The ground with the screen on it, for the Canvas body. */
  stage: ReactNode;
}

/** The viewer's state, its header controls and its stage. `scope` is the theme's attributes, without its mode. */
export function useScreenViewer({ scope, appMode }: { scope: Record<string, string>; appMode: "light" | "dark" }): ScreenViewer {
  const [mode, setMode] = useViewOption<Mode>("viewer-mode", appMode, ["light", "dark", "both"]);
  const [ground, setGround] = useViewOption<Ground>("viewer-ground", "grey", ["grey", "white", "black", "checker"]);
  const [states, setStates] = useViewOption<"on" | "off">("viewer-states", "on", ["on", "off"]);
  const [frame, setFrame] = useViewOption<"window" | "bare">("viewer-frame", "window", ["window", "bare"]);
  // `null` fits the screen to the view; a number is a zoom the person chose.
  const [zoom, setZoom] = useState<number | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  // The view is attached whenever the stage mounts (the page may open on another view first).
  const [element, setElement] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!element) return;
    setSize({ w: element.clientWidth, h: element.clientHeight });
    const observer = new ResizeObserver(() => setSize({ w: element.clientWidth, h: element.clientHeight }));
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  // Two screens sit side by side or one above the other, whichever fits them larger.
  const modes: Array<"light" | "dark"> = mode === "both" ? ["light", "dark"] : [mode];
  const n = modes.length;
  const fitOf = (columns: number, rows: number) => Math.min(
    (size.w - 2 * MARGIN - GAP * (columns - 1)) / (SCREEN.w * columns),
    (size.h - 2 * MARGIN - GAP * (rows - 1)) / (SCREEN.h * rows),
  );
  const across = fitOf(n, 1), stacked = fitOf(1, n);
  const fitted = size.w ? clamp(Math.min(1, Math.max(across, stacked))) : 0.25;
  const scale = zoom ?? fitted;
  const direction = n === 1 || across >= stacked ? "row" : "column";

  // A pinch on a trackpad (the wheel with Ctrl), or ⌘ with the wheel, zooms about the view; the wheel alone scrolls.
  const shown = useRef(scale);
  shown.current = scale;
  useEffect(() => {
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      setZoom(clamp(shown.current * Math.exp(-event.deltaY * 0.01)));
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [element]);

  // A zoom keeps the point at the view's centre where it was (the centre as a share of the content, kept as it scrolls).
  const centre = useRef({ x: 0.5, y: 0.5 });
  useLayoutEffect(() => {
    if (!element) return;
    element.scrollLeft = centre.current.x * element.scrollWidth - element.clientWidth / 2;
    element.scrollTop = centre.current.y * element.scrollHeight - element.clientHeight / 2;
  }, [element, scale, n]);
  const track = () => {
    if (!element) return;
    centre.current = { x: (element.scrollLeft + element.clientWidth / 2) / element.scrollWidth, y: (element.scrollTop + element.clientHeight / 2) / element.scrollHeight };
  };

  const hold: readonly Hold[] = states === "on" ? SHOWCASE : [];
  const swatch = (value: Ground) => <span className="studio-viewer__swatch" data-ground={value} aria-hidden="true" />;
  const lead = (
    <>
      <ViewFilter label="Screen mode" align="start" value={mode} onChange={setMode}
        options={[{ value: "light", label: "Light", icon: <SunIcon /> }, { value: "dark", label: "Dark", icon: <MoonIcon /> }, { value: "both", label: "Light and dark", icon: <SunMoonIcon /> }]} />
      <ViewFilter label="Background" align="start" value={ground} onChange={setGround}
        options={GROUNDS.map(entry => ({ ...entry, icon: swatch(entry.value) }))} />
    </>
  );
  const controls = (
    <ZoomControl stepper size="sm" aria-label="Zoom" value={scale} min={MIN} max={MAX} presets={[0.25, 0.5, 1, 2]} stops={STOPS}
      valueLabel={zoom === null ? "Fit" : undefined} onValueChange={next => setZoom(clamp(next))} onZoomToFit={() => setZoom(null)}>
      <MenuSeparator />
      <MenuItem checked={states === "on"} onClick={() => setStates(states === "on" ? "off" : "on")}>Show held states</MenuItem>
      <MenuItem checked={frame === "window"} onClick={() => setFrame(frame === "window" ? "bare" : "window")}>Window frame</MenuItem>
    </ZoomControl>
  );

  const stage = (
    <section ref={setElement} className="studio-viewer" data-ground={ground} aria-label="Screen" onScroll={track}>
      <div className="studio-viewer__canvas" data-direction={direction} style={{ padding: MARGIN, gap: GAP }}>
        {modes.map(at => (
          <div key={at} className="studio-viewer__screen" data-frame={frame} style={{ inlineSize: SCREEN.w * scale, blockSize: SCREEN.h * scale, ["--_viewer-scale" as string]: scale }}>
            <ScreenFigure className="studio-viewer__figure" hold={hold} view={{ scale }} crossfade scope={{ ...scope, "data-area-theme": at }} />
          </div>
        ))}
      </div>
    </section>
  );
  return { lead, controls, stage };
}
