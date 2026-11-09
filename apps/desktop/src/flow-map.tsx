/**
 * A flow page's map (the user flows study, owner 2026-11-08: "go with your recs, build the flow like these ui examples";
 * then "show the ui screens larger and not in giant containers … more proportional … more stylized"; then, after a
 * pipeline editor's graph: "more technical, more spacing around the labels, more consistency across all the visuals,
 * spacing, make sure the lines coming out of and from the labels and screens are consistent and leave enough space, with
 * proper turns and curves in the lines"). The flow is the one design on the stage (PRODUCT_UI rule 25): its steps are
 * laid out by rule, never placed by hand, so it never becomes a free canvas.
 *
 *   a step     a node card: its kind and role, its name and source (mono), the screen, then its ports: In on the
 *              start, each link an output on the end named for the element that acts, its target in mono under it
 *   columns    Start, the path left to right, End
 *   above      a branch, in the column after the step it leaves (1a, 1b …)
 *   below      a step's states (Error, Loading); the step has an output for each
 *   a line     port to port: out level for a stub, one turn of one radius into the channel between columns (each line
 *              its own lane), along it, one turn out, level again into the port; lines that would cross a card go
 *              round it through the gap between rows; dashed, the chosen step's lines solid and running
 *
 * Everything sits on an 8 grid. The map is drawn at 100% and scaled as a whole; it opens fitted to the stage's height,
 * and the dock's Fit shows every step. A click chooses a step, a double-click or Enter opens it on the stage (the
 * card's morph), and Back, Esc or ⌘↑ brings the map back with the step chosen.
 */
import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Badge, Button, Textarea, ZoomControl } from "@area/react";
import { PlayIcon, StopIcon } from "@area/icons";
import { checkFlow, FLOW_CHECK_TITLES, type Flow, type FlowCheck, type FlowStep } from "./flow.ts";
import { openDesign, useCardArrival } from "./morph.ts";
import { BACK, type Layer, type ProjectPage } from "./projects.ts";

/* --- Geometry at 100%, on the 8 grid ---------------------------------------------------------------------------------- */

const SCREEN_W = 320, SCREEN_H = 200; /* pick: a screen at a fifth of a 1600-wide window, 16:10 */
const INSET = 8;
const CARD_W = SCREEN_W + 2 * INSET; /* 336 */
const HEAD = 32; /* kind and role */
const TITLE = 48; /* the name, and its source in mono */
const ROW = 48; /* a port row: its label, and its target in mono */
const NOTE = 32;
const GAP_X = 160, GAP_Y = 80; /* the channels between columns and rows: room for lanes and their turns */
const MARGIN = 80;
const PILL_W = 112, PILL_H = 32; /* Start and End */
const STUB = 24; /* a line runs level this far out of a port before it turns */
const RADIUS = 12; /* every turn */
const LANE = 16; /* lines sharing a channel sit this far apart */
const ZOOM_MIN = 0.1, ZOOM_MAX = 2;
/** The dock's room at the stage's foot: its 40 and the 16 under it, and 8 of air. A fitted map stays above it. */
const DOCK_ROOM = 64;

const screenTop = HEAD + TITLE;
/** End, as a port's target. */
const END = "__end";
const portsTop = screenTop + SCREEN_H + INSET;

type Port = { id: string; label: string; detail: string; to: string; implicit: boolean; back: boolean; state: boolean };
interface Placed { step: FlowStep; col: number; row: number; x: number; y: number; h: number; inDetail: string; outs: Port[] }
interface Line { id: string; d: string; from: string; to: string; kind: "path" | "next" | "branch" | "state"; ends: Array<{ x: number; y: number }> }
interface Layout { nodes: Map<string, Placed>; lines: Line[]; start: { x: number; y: number }; end: { x: number; y: number } | null; width: number; height: number }

type Point = { x: number; y: number };
/** A path through points, every turn rounded by one radius (less where a run is too short for it). */
function rounded(points: Point[]): string {
  const pts = points.filter((p, i) => i === 0 || p.x !== points[i - 1]!.x || p.y !== points[i - 1]!.y);
  let d = `M${pts[0]!.x} ${pts[0]!.y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1]!, b = pts[i]!, c = pts[i + 1]!;
    const r = Math.min(RADIUS, Math.hypot(b.x - a.x, b.y - a.y) / 2, Math.hypot(c.x - b.x, c.y - b.y) / 2);
    const ux = Math.sign(b.x - a.x), uy = Math.sign(b.y - a.y), vx = Math.sign(c.x - b.x), vy = Math.sign(c.y - b.y);
    d += `L${b.x - ux * r} ${b.y - uy * r}Q${b.x} ${b.y} ${b.x + vx * r} ${b.y + vy * r}`;
  }
  const last = pts[pts.length - 1]!;
  return `${d}L${last.x} ${last.y}`;
}
/** Lanes in a channel: the first line in its middle, then ±16, ±32 … */
function lanes() {
  const used = new Map<string, number>();
  return (key: string) => { const n = used.get(key) ?? 0; used.set(key, n + 1); return n === 0 ? 0 : (n % 2 ? 1 : -1) * Math.ceil(n / 2) * LANE; };
}

/** Where every step, port and line sits, at 100%. */
export function layoutFlow(flow: Flow, nameOf: (id: string) => string): Layout {
  const cells: Array<{ step: FlowStep; col: number; row: number }> = [];
  const colOf = new Map<string, number>();
  flow.steps.forEach((step, col) => { colOf.set(step.layer.id, col); cells.push({ step, col, row: 0 }); });
  const above = new Map<number, number>();
  for (const branch of flow.branches) {
    const col = Math.min(Math.max(0, flow.steps.length - 1), (branch.of ? colOf.get(branch.of) ?? 0 : 0) + 1);
    const row = -((above.get(col) ?? 0) + 1);
    above.set(col, -row);
    colOf.set(branch.layer.id, col);
    cells.push({ step: branch, col, row });
  }
  for (const [owner, states] of flow.states) {
    const col = colOf.get(owner) ?? 0;
    const ownerRow = cells.find(cell => cell.step.layer.id === owner)?.row ?? 0;
    states.forEach((state, index) => {
      const row = ownerRow >= 0 ? ownerRow + index + 1 : -((above.get(col) ?? 0) + 1);
      if (ownerRow < 0) above.set(col, -row);
      cells.push({ step: state, col, row });
    });
  }
  // Each step's outputs: the link to the next path step first (so the path runs level), then the others, then its states.
  const nextOnPath = (id: string) => { const at = flow.steps.findIndex(step => step.layer.id === id); return at >= 0 ? flow.steps[at + 1]?.layer.id : undefined; };
  const outsOf = (step: FlowStep): Port[] => {
    const edges = flow.edges.filter(edge => edge.from === step.layer.id);
    const next = nextOnPath(step.layer.id);
    edges.sort((a, b) => Number(b.to === next) - Number(a.to === next));
    const ports: Port[] = edges.map(edge => ({
      id: edge.id, to: edge.to, implicit: edge.implicit, back: edge.to === BACK, state: false,
      label: edge.to === BACK ? (edge.label || "Back") : edge.implicit ? "Next" : edge.label || "Element",
      detail: edge.to === BACK ? "← the step before" : `→ ${nameOf(edge.to)}`,
    }));
    // The last path step goes on to End.
    if (step === flow.steps[flow.steps.length - 1] && !edges.some(edge => edge.to !== BACK)) ports.unshift({ id: "end", to: END, implicit: true, back: false, state: false, label: "Finish", detail: "→ End" });
    for (const state of flow.states.get(step.layer.id) ?? []) ports.push({ id: `state:${state.layer.id}`, to: state.layer.id, implicit: false, back: false, state: true, label: state.layer.state ?? "State", detail: `→ ${nameOf(state.layer.id)}` });
    return ports;
  };
  const inOf = (step: FlowStep) => {
    if (step.role === "state") return `← ${nameOf(step.of!)}`;
    const from = flow.edges.filter(edge => edge.to === step.layer.id).map(edge => edge.from);
    if (step === flow.steps[0]) from.unshift("start");
    return from.length ? `← ${from.map(id => id === "start" ? "Start" : nameOf(id)).join(", ")}` : "← nothing yet";
  };
  const heightOf = (step: FlowStep, outs: number) => portsTop + Math.max(1, outs) * ROW + (step.layer.note ? NOTE : 0);
  const rows = [...new Set(cells.map(cell => cell.row))].sort((a, b) => a - b);
  const placedOuts = new Map(cells.map(cell => [cell.step.layer.id, outsOf(cell.step)]));
  const rowH = new Map(rows.map(row => [row, Math.max(...cells.filter(cell => cell.row === row).map(cell => heightOf(cell.step, placedOuts.get(cell.step.layer.id)!.length)))]));
  const rowTop = new Map<number, number>();
  let y = MARGIN;
  for (const row of rows) { rowTop.set(row, y); y += rowH.get(row)! + GAP_Y; }
  const height = y - GAP_Y + MARGIN;
  const x0 = MARGIN + PILL_W + GAP_X;
  const colX = (col: number) => x0 + col * (CARD_W + GAP_X);
  const nodes = new Map<string, Placed>();
  for (const cell of cells) {
    const outs = placedOuts.get(cell.step.layer.id)!;
    nodes.set(cell.step.layer.id, { ...cell, x: colX(cell.col), y: rowTop.get(cell.row)!, h: heightOf(cell.step, outs.length), inDetail: inOf(cell.step), outs });
  }
  const cols = Math.max(1, flow.steps.length);
  const inY = (node: Placed) => node.y + portsTop + ROW / 2;
  const outY = (node: Placed, index: number) => node.y + portsTop + index * ROW + ROW / 2;
  const pathIn = (rowTop.get(0) ?? MARGIN) + portsTop + ROW / 2;
  const start = { x: MARGIN, y: pathIn };
  const end = flow.steps.length ? { x: colX(cols - 1) + CARD_W + GAP_X, y: pathIn } : null;
  // A gutter under every row for lines that go back to an earlier column.
  const loopY = height - MARGIN / 2;
  const width = (end ? end.x + PILL_W : colX(cols - 1) + CARD_W) + MARGIN;

  const lines: Line[] = [];
  const lane = lanes();
  const channelX = (col: number) => colX(col) - GAP_X / 2; /* the channel before a column */
  const first = flow.steps[0] && nodes.get(flow.steps[0].layer.id);
  if (first) lines.push({ id: "start", from: "", to: first.step.layer.id, kind: "path", d: rounded([{ x: start.x + PILL_W, y: pathIn }, { x: first.x, y: inY(first) }]), ends: [{ x: start.x + PILL_W, y: pathIn }, { x: first.x, y: inY(first) }] });
  for (const node of nodes.values()) {
    node.outs.forEach((port, index) => {
      if (port.back) return;
      if (port.to === END) {
        if (!end) return;
        const p = { x: node.x + CARD_W, y: outY(node, index) }, q = { x: end.x, y: pathIn };
        const cx = end.x - GAP_X / 2 + lane(`c${cols}`);
        lines.push({ id: port.id, from: node.step.layer.id, to: "", kind: "next", d: rounded([p, { x: cx, y: p.y }, { x: cx, y: q.y }, q]), ends: [p, q] });
        return;
      }
      const target = nodes.get(port.to);
      if (!target) return;
      const p = { x: node.x + CARD_W, y: outY(node, index) }, q = { x: target.x, y: inY(target) };
      const kind: Line["kind"] = port.state ? "state" : node.step.role === "branch" || target.step.role === "branch" ? "branch" : port.implicit ? "next" : "path";
      let points: Point[];
      if (target.col > node.col) {
        const cx = channelX(target.col) + lane(`c${target.col}`);
        const blocked = target.row === node.row && target.col > node.col + 1;
        if (blocked) {
          // Over the cards between, through the gap above the row.
          const gy = node.y - GAP_Y / 2 + lane(`r${node.row}`) / 2;
          const sx = node.x + CARD_W + GAP_X / 2 + lane(`c${node.col + 1}`);
          points = [p, { x: sx, y: p.y }, { x: sx, y: gy }, { x: cx, y: gy }, { x: cx, y: q.y }, q];
        } else points = [p, { x: cx, y: p.y }, { x: cx, y: q.y }, q];
      } else {
        // The same column (a state) or an earlier one: out, down the channel after the step, back under, up into the port.
        const after = node.x + CARD_W + GAP_X / 2 + lane(`c${node.col + 1}`);
        const before = channelX(target.col) + lane(`c${target.col}`);
        const gy = target.col === node.col && target.row > node.row ? target.y - GAP_Y / 2 + lane(`r${target.row}`) / 2 : loopY + lane("loop") / 2;
        points = [p, { x: after, y: p.y }, { x: after, y: gy }, { x: before, y: gy }, { x: before, y: q.y }, q];
      }
      lines.push({ id: port.id, from: node.step.layer.id, to: port.to, kind, d: rounded(points), ends: [p, q] });
    });
  }
  return { nodes, lines, start, end, width, height };
}

/* --- The map --------------------------------------------------------------------------------------------------------- */

export interface FlowMapProps {
  page: ProjectPage;
  flow: Flow;
  /** The step chosen (the one last open, or clicked). */
  chosen: string | null;
  onChoose: (layer: string) => void;
  /** Opens a step on the stage. */
  onOpen: (layer: string) => void;
  onPlay: () => void;
  /** A layer's picture, as its card draws it. */
  picture: (layer: Layer) => ReactNode;
  /** A layer's source, in mono: its screen's file or its image's collection. */
  source: (layer: Layer) => string;
}

export function FlowMap({ page, flow, chosen, onChoose, onOpen, onPlay, picture, source }: FlowMapProps) {
  const host = useRef<HTMLDivElement>(null);
  // null: fitted to the stage's height (the default); "all": every step; a number: a zoom chosen.
  const [zoom, setZoom] = useState<number | "all" | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = host.current?.parentElement;
    if (!el) return;
    const read = () => setBox(was => was.w === el.clientWidth && was.h === el.clientHeight ? was : { w: el.clientWidth, h: el.clientHeight });
    read();
    const watch = new ResizeObserver(read);
    watch.observe(el);
    return () => watch.disconnect();
  }, []);
  const nameOf = (id: string) => { const step = flow.byId.get(id); if (!step) return "a removed layer"; return step.role === "state" ? `${flow.byId.get(step.of!)?.layer.name ?? ""} · ${step.layer.state}` : `${step.number} ${step.layer.name}`; };
  const layout = useMemo(() => layoutFlow(flow, nameOf), [flow]); // eslint-disable-line react-hooks/exhaustive-deps
  const fitHeight = box.h ? Math.min(1, (box.h - DOCK_ROOM) / layout.height) : 1;
  const fitAll = box.w ? Math.min(fitHeight, box.w / layout.width) : 1;
  const k = zoom === null ? fitHeight : zoom === "all" ? fitAll : zoom;
  // A zoom keeps the middle of the view where it was (in the map's own units), not the map's top left.
  const scroller = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const shown = useRef({ k, centre: null as { x: number; y: number } | null });
  const readCentre = () => {
    const s = scroller.current, f = frame.current;
    if (s && f) shown.current.centre = { x: (s.scrollLeft + s.clientWidth / 2 - f.offsetLeft) / shown.current.k, y: (s.scrollTop + s.clientHeight / 2 - f.offsetTop) / shown.current.k };
  };
  useLayoutEffect(() => {
    const s = scroller.current, f = frame.current, centre = shown.current.centre;
    shown.current.k = k;
    if (s && f && centre) { s.scrollLeft = centre.x * k + f.offsetLeft - s.clientWidth / 2; s.scrollTop = centre.y * k + f.offsetTop - s.clientHeight / 2; }
    readCentre();
  }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
  useCardArrival();
  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      setZoom(was => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, (typeof was === "number" ? was : k) * Math.exp(-event.deltaY / 200))));
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [k]);
  useLayoutEffect(() => {
    if (!chosen) return;
    host.current?.querySelector(`[data-step="${CSS.escape(chosen)}"]`)?.scrollIntoView({ block: "nearest", inline: "center" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const hot = (line: Line) => chosen !== null && (line.from === chosen || line.to === chosen);
  return (
    <div ref={host} className="studio-flow">
      {/* The map pans inside the stage at any zoom; the dock stays over it. */}
      <div ref={scroller} className="studio-flow__scroll" onScroll={readCentre}>
        <div ref={frame} className="studio-flow__frame" style={{ inlineSize: Math.ceil(layout.width * k), blockSize: Math.ceil(layout.height * k) }}>
          <div className="studio-flow__map" role="group" aria-label={`${page.name}, a flow of ${flow.steps.length} steps`}
            style={{ inlineSize: layout.width, blockSize: layout.height, transform: k !== 1 ? `scale(${k})` : undefined }}>
            <svg className="studio-flow__lines" width={layout.width} height={layout.height} aria-hidden="true">
              {layout.lines.map(line => (
                <g key={line.id} className="studio-flow__link" data-kind={line.kind} data-hot={hot(line) ? "" : undefined}>
                  <path className="studio-flow__line" d={line.d} />
                </g>
              ))}
            </svg>
            <div className="studio-flow__pill" data-end="start" style={{ insetInlineStart: layout.start.x, insetBlockStart: layout.start.y - PILL_H / 2, inlineSize: PILL_W }}>
              <span className="studio-flow__pill-mark"><PlayIcon /></span>Start<span className="studio-flow__port" data-side="out" data-on="" />
            </div>
            {layout.end ? (
              <div className="studio-flow__pill" data-end="end" style={{ insetInlineStart: layout.end.x, insetBlockStart: layout.end.y - PILL_H / 2, inlineSize: PILL_W }}>
                <span className="studio-flow__port" data-side="in" data-on="" /><span className="studio-flow__pill-mark"><StopIcon /></span>End
              </div>
            ) : null}
            {[...layout.nodes.values()].map(node => (
              <FlowNode key={node.step.layer.id} node={node} flow={flow} chosen={node.step.layer.id === chosen} picture={picture} source={source}
                linked={(id: string) => layout.lines.some(line => line.id === id)}
                onChoose={() => onChoose(node.step.layer.id)} onOpen={() => onOpen(node.step.layer.id)} />
            ))}
          </div>
        </div>
      </div>
      <div className="studio-flow__dock" role="toolbar" aria-label="Flow">
        <ZoomControl size="sm" value={Math.round(k * 100) / 100} min={ZOOM_MIN} max={ZOOM_MAX} onValueChange={next => setZoom(next)} onZoomToFit={() => setZoom("all")} />
        <span className="studio-flow__dock-rule" aria-hidden="true" />
        <Button size="sm" variant="ghost" tone="neutral" icon={<PlayIcon />} onClick={onPlay}>Play</Button>
      </div>
    </div>
  );
}

function FlowNode({ node, flow, chosen, picture, source, linked, onChoose, onOpen }: {
  node: Placed; flow: Flow; chosen: boolean; picture: (layer: Layer) => ReactNode; source: (layer: Layer) => string;
  linked: (id: string) => boolean; onChoose: () => void; onOpen: () => void;
}) {
  const { step } = node;
  const title = step.role === "state" ? `${flow.byId.get(step.of!)?.layer.name ?? ""} · ${step.layer.state ?? "State"}` : step.layer.name;
  const kind = step.role === "state" ? "State" : step.role === "branch" ? `Branch ${step.number}` : `Step ${step.number}`;
  const role = step.role === "state" ? step.layer.state ?? "State" : step.role === "branch" ? "Off the path" : "On the path";
  const open = () => { openDesign(`layer:${step.layer.id}`); onOpen(); };
  const keys = (event: KeyboardEvent) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } };
  const rows = Math.max(1, node.outs.length);
  return (
    <div className="studio-flow__node" data-step={step.layer.id} data-role={step.role} data-chosen={chosen ? "" : undefined}
      tabIndex={0} role="button" aria-pressed={chosen} aria-label={`${kind}, ${title}. Press Enter to open it.`}
      onClick={onChoose} onDoubleClick={open} onKeyDown={keys}
      style={{ insetInlineStart: node.x, insetBlockStart: node.y, inlineSize: CARD_W, blockSize: node.h }}>
      <div className="studio-flow__head" style={{ blockSize: HEAD }}>
        <span className="studio-flow__kind">{kind}</span>
        <span className="studio-flow__role"><span className="studio-flow__dot" aria-hidden="true" />{role}</span>
      </div>
      <div className="studio-flow__title" style={{ blockSize: TITLE }}>
        <span className="studio-flow__name">{title}</span>
        <span className="studio-flow__mono">{source(step.layer)}</span>
      </div>
      <div className="studio-flow__screen" data-design={`layer:${step.layer.id}`} aria-hidden="true" style={{ blockSize: SCREEN_H }}>{picture(step.layer)}</div>
      <div className="studio-flow__ports" style={{ blockSize: rows * ROW }}>
        {Array.from({ length: rows }, (_, index) => {
          const out = node.outs[index];
          return (
            <div key={index} className="studio-flow__port-row" style={{ blockSize: ROW }}>
              {index === 0 ? (
                <span className="studio-flow__io" data-side="in">
                  <span className="studio-flow__port" data-side="in" data-on="" />
                  <span className="studio-flow__io-label">In</span>
                  <span className="studio-flow__mono">{node.inDetail}</span>
                </span>
              ) : <span />}
              {out ? (
                <span className="studio-flow__io" data-side="out" data-implicit={out.implicit ? "" : undefined}>
                  <span className="studio-flow__io-label">{out.label}</span>
                  <span className="studio-flow__mono">{out.detail}</span>
                  <span className="studio-flow__port" data-side="out" data-on={linked(out.id) ? "" : undefined} />
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      {step.layer.note ? <p className="studio-flow__note" style={{ blockSize: NOTE }}>{step.layer.note}</p> : null}
    </div>
  );
}

/* --- The Inspector on the map: the flow's facts, description and checks -------------------------------------------------- */

export function FlowChecks({ checks, onOpen }: { checks: readonly FlowCheck[]; onOpen?: (layer: string) => void }) {
  if (!checks.length) return <p className="studio-muted">Every step is reached from the first, and every path goes on to the end.</p>;
  return (
    <ul className="studio-flow-checks">
      {checks.map(check => (
        <li key={`${check.kind}:${check.layer}`}>
          <Badge size="sm" variant="soft" tone="warning">{FLOW_CHECK_TITLES[check.kind]}</Badge>
          {onOpen ? <button type="button" className="studio-flow-checks__what" onClick={() => onOpen(check.layer)}>{check.what}</button> : <span>{check.what}</span>}
          <span className="studio-muted">{check.detail}</span>
        </li>
      ))}
    </ul>
  );
}

/** The page's description, written as a flow's (who takes it and what they finish with). */
export function FlowDescription({ page, onChange }: { page: ProjectPage; onChange: (note: string) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <Textarea id={`flow-note-${page.id}`} aria-label={`${page.name}'s description`} rows={3} placeholder="Who takes this flow, and what they finish with"
      value={draft ?? page.note ?? ""} onChange={event => setDraft(event.currentTarget.value)}
      onBlur={() => { if (draft !== null && draft !== (page.note ?? "")) onChange(draft); setDraft(null); }} />
  );
}

export const flowChecks = (flow: Flow) => checkFlow(flow);
