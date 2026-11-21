// Chart: rows of data plotted as vertical bars (grouped or stacked), lines, areas or a donut, and ChartNumber, one figure
// with its change. Spec: docs/specs/chart.md (components audit N7, 2026-11-07).
//
// One component with `kind`, not BarChart / LineChart: every kind takes the same rows (`data`, `series`, `x`), the same
// legend, tooltip, keyboard and table, and a view of a collection switches kind over the same data (docs/specs/chart.md,
// Job and boundaries). The plot is SVG drawn at its box's measured size (a ResizeObserver), so text never scales. The
// marks follow the data views system (apps/desktop/src/data-views.tsx). Assistive tech reads a visually hidden Table of
// the same data; the plot is one tab stop whose arrow keys walk x and say each value through the shared announcer.
import { forwardRef, useId, useLayoutEffect, useMemo, useState } from "react";
import type { CSSProperties, FocusEvent, HTMLAttributes, KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from "react";
import { chartVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { announce } from "./announce.ts";
import { Badge, type BadgeProps } from "./Badge.tsx";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Skeleton } from "./Skeleton.tsx";
import { Table, TableCell, TableHeaderCell } from "./Table.tsx";
import { Tooltip } from "./Tooltip.tsx";
import { type LoadingDelay } from "./loading-delay.ts";

type ChartVariants = VariantProps<typeof MANIFESTS.chart>;
/** What the chart draws. The number is ChartNumber. */
export type ChartKind = Exclude<NonNullable<ChartVariants["kind"]>, "number">;
export type ChartView = "chart" | "table";
/** One row: the x value under `x`, each series' value under its `key`. A missing or non-numeric value is a gap. */
export type ChartDatum = Readonly<Record<string, string | number | null | undefined>>;

export interface ChartSeries {
  /** The row field this series reads. */
  key: string;
  /** Its name, in the legend, the tooltip and the table. */
  label: string;
  /** A colour of its own (any CSS colour). Unset, the series takes the series token of its place, 1 to 8 in order. */
  color?: string;
}

export interface ChartProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** bar (default; vertical, grouped when there are several series), line, area or donut. */
  kind?: ChartKind;
  /** The rows, in x order. */
  data: readonly ChartDatum[];
  /** What to plot, in order; a donut draws the first. */
  series: readonly ChartSeries[];
  /** The row field that holds each row's x: a category, a date as text, a donut's part. */
  x: string;
  /** Names the chart: the plot's accessible name and the table's. */
  label: string;
  /** The x column's heading in the table (default: `x`). */
  xLabel?: string;
  /** The plot's height: sm 128, md 192 (default), lg 256; a donut 128, 160, 192 across. */
  size?: ChartVariants["size"];
  /** Bars and areas stack their series instead of grouping or overlapping them. */
  stacked?: boolean;
  /** Writes a value: axis labels, the tooltip, the table, the donut's total (default: grouped digits). */
  formatValue?: (value: number) => string;
  /** Writes an x value under the axis, in the tooltip and the table (default: as it is). */
  formatX?: (value: string | number) => string;
  /** The series hidden from the plot (a donut: its parts, by x value); the legend toggles them. At least one stays. */
  hiddenKeys?: readonly string[];
  /** The series hidden at first, uncontrolled; none by default. */
  defaultHiddenKeys?: readonly string[];
  /** Called with the hidden series' keys when the legend hides or shows one. */
  onHiddenKeysChange?: (keys: string[], event: MouseEvent<HTMLButtonElement>) => void;
  /** The plot, or Area's Table of the same data in its place. */
  view?: ChartView;
  /** The view at first, uncontrolled; the chart by default. */
  defaultView?: ChartView;
  /** Called when the Show table toggle switches the view. */
  onViewChange?: (view: ChartView, event: MouseEvent<HTMLButtonElement>) => void;
  /** Adds a toggle at the legend's end that shows the data as a table. */
  tableToggle?: boolean;
  /** The table toggle's words. */
  tableLabel?: string;
  /** The donut table's share column. */
  shareLabel?: string;
  /** What the keys do, said after the plot's name. */
  keysHint?: string;
  /** The data is loading: a Skeleton holds the plot's place. */
  loading?: boolean;
  /** Skeleton's wait before it shows: `short` 300 ms, `long` 1000 ms, or milliseconds. */
  delay?: LoadingDelay;
  /** Said in the plot's place when there is nothing to plot. */
  emptyText?: string;
}

/* The data views system (apps/desktop/src/data-views.tsx; docs/specs/chart.md, Decisions). */
const GAP = 2, LABEL_GAP = 4, TICK_GAP = 8, GUTTER = 40, TOP = 8, TIP = 12;
// The drawing's heights are chart.css's plot heights (--_plot-sm / -md / -lg, the donut's 160): change them together.
const HEIGHT = { sm: 128, md: 192, lg: 256 } as const;
const RING = { sm: [128, 12], md: [160, 14], lg: [192, 16] } as const;
const DEFAULT_WIDTH = 480, DEFAULT_FONT = 11;
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const defaultFormat = (value: number) => number.format(value);
const fixed = (value: number) => +value.toFixed(2);

/** A mark's corner: 4, never past a quarter of its side (data views round 18). */
const corner = (w: number, h = Infinity) => Math.max(0, Math.min(4, w / 4, h / 4));
/** A bar up from its base, rounded at its value end. */
const barUp = (x: number, y: number, w: number, h: number, r = corner(w, h)) => r > 0
  ? `M${fixed(x)},${fixed(y + h)}V${fixed(y + r)}A${r},${r} 0 0 1 ${fixed(x + r)},${fixed(y)}H${fixed(x + w - r)}A${r},${r} 0 0 1 ${fixed(x + w)},${fixed(y + r)}V${fixed(y + h)}Z`
  : `M${fixed(x)},${fixed(y + h)}V${fixed(y)}H${fixed(x + w)}V${fixed(y + h)}Z`;
/** A bar down from its base (a negative value), rounded at its foot. */
const barDown = (x: number, y: number, w: number, h: number, r = corner(w, h)) => r > 0
  ? `M${fixed(x)},${fixed(y)}H${fixed(x + w)}V${fixed(y + h - r)}A${r},${r} 0 0 1 ${fixed(x + w - r)},${fixed(y + h)}H${fixed(x + r)}A${r},${r} 0 0 1 ${fixed(x)},${fixed(y + h - r)}Z`
  : `M${fixed(x)},${fixed(y)}H${fixed(x + w)}V${fixed(y + h)}H${fixed(x)}Z`;

const niceStep = (value: number) => {
  const p = 10 ** Math.floor(Math.log10(value)), n = value / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
};
/** Round ticks covering min to max (zero always inside), about `n` of them. */
export function chartTicks(min: number, max: number, n = 4): number[] {
  const lo = Math.min(0, min), hi = Math.max(0, max) === lo ? lo + 1 : Math.max(0, max);
  const step = niceStep((hi - lo) / Math.max(1, n));
  const ticks: number[] = [];
  for (let v = Math.floor(lo / step) * step; v <= Math.ceil(hi / step) * step + step * 1e-9; v += step) ticks.push(+v.toFixed(10));
  return ticks;
}
/** Which of n positions get a label, each `room` apart at least, the ends always. */
const tickIndices = (n: number, width: number, room: number) => {
  if (n <= 1) return n ? [0] : [];
  const k = Math.max(2, Math.min(n, Math.floor(width / room) + 1));
  if (k >= n) return Array.from({ length: n }, (_, i) => i);
  return Array.from({ length: k }, (_, j) => Math.round(j * (n - 1) / (k - 1)));
};
const anchorAt = (i: number, n: number) => (i === 0 ? "start" : i === n - 1 ? "end" : "middle");
const valueOf = (raw: unknown): number | null => {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  if (typeof raw === "string" && raw.trim() !== "" && Number.isFinite(Number(raw))) return Number(raw);
  return null;
};
/** A series' paint by its place, 1 to 8 in order (DESIGN_SYSTEM.md, data colours): fills and keys, and lines. */
const paintAt = (place: number, own?: string) => {
  const n = (place % 8) + 1;
  return { fill: own ?? `var(--area-series-${n}-fill)`, stroke: own ?? `var(--area-series-${n})` };
};

interface Box { width: number; height: number; font: number }

/** Rows of data as bars, lines, areas or a donut, with a legend that hides series, a tooltip and a table of the data. */
export const Chart = /* @__PURE__ */ forwardRef<HTMLDivElement, ChartProps>(function Chart(
  {
    kind = "bar", data, series, x, label, xLabel, size, stacked, formatValue = defaultFormat, formatX = String,
    hiddenKeys: hiddenProp, defaultHiddenKeys, onHiddenKeysChange, view: viewProp, defaultView = "chart", onViewChange,
    tableToggle, tableLabel = "Show table", shareLabel = "Share", keysHint = "Left and Right move between values",
    loading, delay, emptyText = "No values yet", className, ...rest
  },
  ref,
) {
  const id = useId();
  const tier = size ?? "md";
  const donut = kind === "donut";
  const [ownHidden, setOwnHidden] = useState<readonly string[]>(() => defaultHiddenKeys ?? []);
  const hidden = new Set(hiddenProp ?? ownHidden);
  const [ownView, setOwnView] = useState<ChartView>(defaultView);
  const view = viewProp ?? ownView;
  const [active, setActive] = useState<number | null>(null);
  const [tip, setTip] = useState<HTMLDivElement | null>(null);
  const [tipWidth, setTipWidth] = useState(0);
  const [plot, setPlot] = useState<HTMLDivElement | null>(null);
  const [box, setBox] = useState<Box>(() => ({ width: DEFAULT_WIDTH, height: donut ? RING[tier][0] : HEIGHT[tier], font: DEFAULT_FONT }));

  useLayoutEffect(() => {
    if (!plot) return;
    const measure = () => {
      const font = parseFloat(getComputedStyle(plot).fontSize) || DEFAULT_FONT;
      const next = { width: Math.round(plot.clientWidth) || DEFAULT_WIDTH, height: Math.round(plot.clientHeight) || HEIGHT[tier], font };
      setBox(current => (current.width === next.width && current.height === next.height && current.font === next.font ? current : next));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(plot);
    return () => observer.disconnect();
  }, [plot, tier]);

  // The tooltip's width, read after it draws, so the next draw keeps it inside the box.
  useLayoutEffect(() => {
    if (tip && tip.offsetWidth !== tipWidth) setTipWidth(tip.offsetWidth);
  });

  // A donut plots the first series' value of each row, its parts keyed by x; the other kinds plot every shown series.
  const first = series[0];
  const parts = useMemo(() => data.map((row, i) => ({ key: String(row[x] ?? i), row, place: i })), [data, x]);
  const legendItems = donut
    ? parts.map(part => ({ key: part.key, label: formatX(part.row[x] ?? part.key), paint: paintAt(part.place) }))
    : series.map((one, i) => ({ key: one.key, label: one.label, paint: paintAt(i, one.color) }));
  const shownSeries = donut ? [] : series.map((one, place) => ({ ...one, place, paint: paintAt(place, one.color) })).filter(one => !hidden.has(one.key));
  const shownParts = donut && first ? parts.filter(part => !hidden.has(part.key) && (valueOf(part.row[first.key]) ?? 0) > 0) : [];
  const empty = !data.length || !series.length;

  const toggle = (key: string, event: MouseEvent<HTMLButtonElement>) => {
    const next = new Set(hidden);
    if (next.has(key)) next.delete(key);
    else if (legendItems.filter(item => !next.has(item.key)).length > 1) next.add(key);
    else return; // the last one shown stays
    const keys = legendItems.map(item => item.key).filter(item => next.has(item));
    if (hiddenProp === undefined) setOwnHidden(keys);
    onHiddenKeysChange?.(keys, event);
    setActive(null);
  };
  const switchView = (event: MouseEvent<HTMLButtonElement>) => {
    const next: ChartView = view === "table" ? "chart" : "table";
    if (viewProp === undefined) setOwnView(next);
    onViewChange?.(next, event);
    setActive(null);
  };

  /* --- The drawing ----------------------------------------------------------------------------------------------- */
  const W = Math.max(GUTTER + 40, box.width), H = box.height, line = Math.ceil(box.font * 14 / 11);
  const values = shownSeries.flatMap(one => data.map(row => valueOf(row[one.key])).filter((v): v is number => v !== null));
  const totals = stacked ? data.map(row => {
    let up = 0, down = 0;
    for (const one of shownSeries) { const v = valueOf(row[one.key]) ?? 0; if (v > 0) up += v; else down += v; }
    return [down, up];
  }).flat() : values;
  const ticks = chartTicks(Math.min(0, ...totals), Math.max(0, ...totals), Math.max(2, Math.round(H / 48)));
  const lo = ticks[0]!, hi = ticks[ticks.length - 1]!;
  const tickWidth = Math.max(...ticks.map(t => formatValue(t).length)) * box.font * 0.6;
  const x0 = Math.max(GUTTER, Math.ceil(tickWidth + TICK_GAP)), x1 = W, top = TOP, bottom = H - LABEL_GAP - line;
  const y = (v: number) => top + (hi - v) / (hi - lo || 1) * (bottom - top);
  const n = data.length, band = (x1 - x0) / Math.max(1, n), step = n > 1 ? (x1 - x0) / (n - 1) : 0;
  const cx = (i: number) => kind === "bar" ? x0 + (i + 0.5) * band : n > 1 ? x0 + i * step : (x0 + x1) / 2;
  const xText = (i: number) => formatX(data[i]?.[x] ?? "");

  const cartesian = (): ReactNode => {
    const marks: ReactNode[] = [];
    const grid = ticks.map(t => (
      <g key={`t${t}`}>
        <line className={chartVariants.element(t === 0 ? "baseline" : "grid")} x1={x0} x2={x1} y1={fixed(Math.round(y(t)) + 0.5)} y2={fixed(Math.round(y(t)) + 0.5)} />
        <text className={chartVariants.element("tick")} x={x0 - TICK_GAP} y={fixed(y(t))} dy="0.35em" textAnchor="end">{formatValue(t)}</text>
      </g>
    ));
    const labelWidth = Math.max(0, ...data.map((_, i) => xText(i).length)) * box.font * 0.6;
    // Bars label every category that fits, else every second, third…; lines and areas one about every 96, the ends always.
    const stride = Math.max(1, Math.ceil((labelWidth + 16) / band));
    const shown = kind === "bar" ? Array.from({ length: Math.ceil(n / stride) }, (_, j) => j * stride) : tickIndices(n, x1 - x0, Math.max(96, labelWidth + 16));
    const labels = shown.map(i => {
      const wide = kind !== "bar" || labelWidth > band;
      const anchor = wide ? anchorAt(i, n) : "middle";
      const at = kind === "bar" && wide ? (anchor === "start" ? x0 + i * band : anchor === "end" ? x0 + (i + 1) * band : cx(i)) : cx(i);
      return <text key={`x${i}`} className={chartVariants.element("tick")} x={fixed(at)} y={bottom + LABEL_GAP} dominantBaseline="hanging" textAnchor={anchor}>{xText(i)}</text>;
    });
    const zero = y(Math.max(lo, Math.min(hi, 0)));

    if (kind === "bar") {
      if (active !== null) marks.push(<rect key="band" className={chartVariants.element("band")} data-active="" x={fixed(x0 + active * band)} y={top} width={fixed(band)} height={fixed(bottom - top)} />);
      const groupGap = Math.max(GAP, band * 0.2), group = band - groupGap, count = Math.max(1, shownSeries.length);
      const bw = stacked ? group : Math.max(1, (group - GAP * (count - 1)) / count);
      // Stacked: each row's parts from its base, 2 apart, only the outermost rounded at its value end.
      const ups = data.map(() => 0), downs = data.map(() => 0);
      const outer = data.map(row => {
        let up = -1, down = -1;
        shownSeries.forEach((one, s) => { const v = valueOf(row[one.key]) ?? 0; if (v > 0) up = s; else if (v < 0) down = s; });
        return [up, down];
      });
      shownSeries.forEach((one, s) => {
        const paths = data.map((row, i) => {
          const v = valueOf(row[one.key]);
          if (v === null || v === 0) return null;
          const gx = x0 + i * band + groupGap / 2;
          if (!stacked) {
            const bx = gx + s * (bw + GAP);
            return v > 0 ? barUp(bx, y(v), bw, zero - y(v)) : barDown(bx, zero, bw, y(v) - zero);
          }
          if (v > 0) {
            const from = ups[i]!, to = from + v; ups[i] = to;
            const y1 = y(from) - (from > 0 ? GAP : 0), h = y1 - y(to);
            return h > 0 ? barUp(gx, y(to), bw, h, outer[i]![0] === s ? corner(bw, h) : 0) : null;
          }
          const from = downs[i]!, to = from + v; downs[i] = to;
          const y1 = y(from) + (from < 0 ? GAP : 0), h = y(to) - y1;
          return h > 0 ? barDown(gx, y1, bw, h, outer[i]![1] === s ? corner(bw, h) : 0) : null;
        });
        marks.push(
          <g key={one.key} style={{ "--_chart-fill": one.paint.fill } as CSSProperties}>
            {paths.map((d, i) => d ? <path key={i} className={chartVariants.element("mark")} d={d} /> : null)}
          </g>,
        );
      });
      return <>{grid}{marks}{labels}</>;
    }

    // Lines and areas: a point per row; a gap where a value is missing.
    const lower = data.map(() => 0);
    const guide = active !== null ? <line key="guide" className={chartVariants.element("guide")} x1={fixed(Math.round(cx(active)) + 0.5)} x2={fixed(Math.round(cx(active)) + 0.5)} y1={top} y2={bottom} /> : null;
    const dots: ReactNode[] = [];
    const defs: ReactNode[] = [];
    shownSeries.forEach(one => {
      const raw = data.map(row => valueOf(row[one.key]));
      const stack = stacked && kind === "area";
      const upper: readonly (number | null)[] = stack ? raw.map((v, i) => lower[i]! + Math.max(0, v ?? 0)) : raw;
      const runs: number[][] = [];
      upper.forEach((v, i) => { if (v === null) return; const last = runs[runs.length - 1]; if (last && last[last.length - 1] === i - 1) last.push(i); else runs.push([i]); });
      const edge = (run: number[], of: readonly (number | null)[]) => run.map((i, j) => `${j ? "L" : "M"}${fixed(cx(i))},${fixed(y(of[i]!))}`).join("");
      const style = { "--_chart-fill": one.paint.fill, "--_chart-stroke": one.paint.stroke } as CSSProperties & Record<string, string>;
      const parts: ReactNode[] = [];
      if (kind === "area") {
        const foot = (run: number[]) => stack
          ? [...run].reverse().map(i => `L${fixed(cx(i))},${fixed(y(lower[i]!))}`).join("")
          : `L${fixed(cx(run[run.length - 1]!))},${fixed(zero)}L${fixed(cx(run[0]!))},${fixed(zero)}`;
        if (!stack) {
          const gradient = `area-chart${id.replace(/[^\w-]/g, "")}-wash-${one.place}`;
          style["--_chart-wash"] = `url(#${gradient})`;
          defs.push(
            <linearGradient key={gradient} id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: one.paint.fill, stopOpacity: 0.24 }} />
              <stop offset="1" style={{ stopColor: one.paint.fill, stopOpacity: 0 }} />
            </linearGradient>,
          );
        }
        runs.forEach((run, r) => parts.push(<path key={`w${r}`} className={chartVariants.element("wash")} d={`${edge(run, upper)}${foot(run)}Z`} />));
        if (stack) runs.forEach((run, r) => parts.push(<path key={`p${r}`} className={chartVariants.element("part")} d={edge(run, upper)} />));
      }
      if (!(stack)) runs.forEach((run, r) => parts.push(run.length > 1
        ? <path key={`l${r}`} className={chartVariants.element("line")} d={edge(run, upper)} />
        : <circle key={`l${r}`} className={chartVariants.element("mark")} style={{ fill: one.paint.stroke }} cx={fixed(cx(run[0]!))} cy={fixed(y(upper[run[0]!]!))} r={2} />));
      if (active !== null && upper[active] !== null && upper[active] !== undefined) {
        dots.push(<circle key={one.key} className={chartVariants.element("dot")} style={style} cx={fixed(cx(active))} cy={fixed(y(upper[active]!))} r={4} />);
      }
      marks.push(<g key={one.key} style={style}>{parts}</g>);
      if (stack) upper.forEach((v, i) => { lower[i] = v ?? lower[i]!; });
    });
    return <>{defs.length ? <defs>{defs}</defs> : null}{grid}{marks}{labels}{guide}{dots}</>;
  };

  // The donut: a ring across the plot's height, its parts 2 apart at the joins, the total in its middle.
  const [ringSize, thick] = RING[tier];
  const ring = Math.min(ringSize, H, W);
  const r = ring / 2, inner = r - thick, mid = r - thick / 2;
  const donutTotal = first ? shownParts.reduce((sum, part) => sum + (valueOf(part.row[first.key]) ?? 0), 0) : 0;
  const angles = (() => {
    let at = -Math.PI / 2;
    return shownParts.map(part => {
      const sweep = (valueOf(part.row[first!.key]) ?? 0) / (donutTotal || 1) * Math.PI * 2;
      const span = [at, at + sweep] as const; at += sweep;
      return span;
    });
  })();
  const point = (radius: number, angle: number) => `${fixed(r + radius * Math.cos(angle))},${fixed(r + radius * Math.sin(angle))}`;
  const drawDonut = (): ReactNode => {
    const gapAngle = shownParts.length > 1 ? GAP / mid : 0;
    const arcs = shownParts.map((part, i) => {
      const [start, end] = angles[i]!, paint = paintAt(part.place);
      const a0 = start + gapAngle / 2, a1 = end - gapAngle / 2;
      if (a1 <= a0) return null;
      const d = a1 - a0 >= Math.PI * 2 - 1e-6
        ? `M${point(r, -Math.PI / 2)}A${r},${r} 0 1 1 ${point(r, Math.PI / 2)}A${r},${r} 0 1 1 ${point(r, -Math.PI / 2)}M${point(inner, -Math.PI / 2)}A${inner},${inner} 0 1 0 ${point(inner, Math.PI / 2)}A${inner},${inner} 0 1 0 ${point(inner, -Math.PI / 2)}Z`
        : `M${point(r, a0)}A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${point(r, a1)}L${point(inner, a1)}A${inner},${inner} 0 ${a1 - a0 > Math.PI ? 1 : 0} 0 ${point(inner, a0)}Z`;
      return <path key={part.key} className={chartVariants.element("mark")} fillRule="evenodd" data-active={active === i ? "" : undefined} style={{ "--_chart-fill": paint.fill } as CSSProperties} d={d} />;
    });
    return <>
      {arcs}
      <text className={chartVariants.element("center")} x={r} y={fixed(r - line / 2)} dominantBaseline="central" textAnchor="middle">{formatValue(donutTotal)}</text>
      <text className={chartVariants.element("center-label")} x={r} y={fixed(r + line)} dominantBaseline="central" textAnchor="middle">{first?.label}</text>
    </>;
  };

  /* --- Pointer, keys, tooltip --------------------------------------------------------------------------------------- */
  const stops = donut ? shownParts.length : n;
  const describe = (i: number): string => {
    if (donut) {
      const part = shownParts[i]; if (!part || !first) return "";
      const v = valueOf(part.row[first.key]) ?? 0;
      return `${formatX(part.row[x] ?? part.key)}: ${formatValue(v)}, ${Math.round(v / (donutTotal || 1) * 100)}%`;
    }
    const row = data[i]; if (!row) return "";
    return `${xText(i)}: ${shownSeries.map(one => { const v = valueOf(row[one.key]); return `${one.label} ${v === null ? "–" : formatValue(v)}`; }).join(", ")}`;
  };
  const indexAt = (event: PointerEvent<HTMLDivElement>): number | null => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left, py = event.clientY - rect.top;
    if (donut) {
      const dx = px - (W - ring) / 2 - r, dy = py - r, dist = Math.hypot(dx, dy);
      if (dist < inner - 4 || dist > r + 4) return null;
      let angle = Math.atan2(dy, dx); if (angle < -Math.PI / 2) angle += Math.PI * 2;
      const found = angles.findIndex(([a0, a1]) => angle >= a0 && angle < a1);
      return found < 0 ? null : found;
    }
    if (!n || px < x0 - TICK_GAP || px > x1 || py < 0 || py > bottom) return null;
    const i = kind === "bar" ? Math.floor((px - x0) / band) : n > 1 ? Math.round((px - x0) / step) : 0;
    return Math.max(0, Math.min(n - 1, i));
  };
  const move = (next: number) => {
    const i = Math.max(0, Math.min(stops - 1, next));
    setActive(i);
    announce(describe(i));
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!stops) return;
    const at = active ?? -1;
    const keys: Record<string, number> = { ArrowRight: at + 1, ArrowDown: at + 1, ArrowLeft: at < 0 ? 0 : at - 1, ArrowUp: at < 0 ? 0 : at - 1, Home: 0, End: stops - 1 };
    if (event.key in keys) { event.preventDefault(); move(keys[event.key]!); return; }
    if (event.key === "Escape" && active !== null) { event.preventDefault(); setActive(null); }
  };

  const tooltip = (): ReactNode => {
    if (active === null || active >= stops) return null;
    let ax: number, ay: number, title: ReactNode, rows: ReactNode[];
    if (donut) {
      const part = shownParts[active]!, [a0, a1] = angles[active]!, angle = (a0 + a1) / 2;
      const v = valueOf(part.row[first!.key]) ?? 0;
      ax = (W - ring) / 2 + r + (r + TIP / 2) * Math.cos(angle); ay = Math.max(0, r + (r + TIP / 2) * Math.sin(angle) - 14);
      title = formatX(part.row[x] ?? part.key);
      rows = [<div key="v" className={chartVariants.element("tooltip-row")}>
        <span className={chartVariants.element("key")} style={{ "--_chart-fill": paintAt(part.place).fill } as CSSProperties} />
        <span>{first!.label}</span>
        <span>{`${formatValue(v)}, ${Math.round(v / (donutTotal || 1) * 100)}%`}</span>
      </div>];
    } else {
      const row = data[active]!;
      ax = cx(active); ay = top;
      title = xText(active);
      rows = shownSeries.map(one => {
        const v = valueOf(row[one.key]);
        return <div key={one.key} className={chartVariants.element("tooltip-row")}>
          <span className={chartVariants.element("key")} style={{ "--_chart-fill": one.paint.fill } as CSSProperties} />
          <span>{one.label}</span>
          <span>{v === null ? "–" : formatValue(v)}</span>
        </div>;
      });
    }
    // Beside the value, on the side with more room; a donut's outside its ring, away from the total.
    const end = donut ? ax < W / 2 : ax > W / 2;
    // Kept inside the plot's box once its width is known, so a card or a tile never cuts it.
    const want = end ? ax - TIP - tipWidth : ax + TIP;
    const place: CSSProperties = { left: fixed(tipWidth ? Math.max(0, Math.min(W - tipWidth, want)) : want), top: fixed(ay) };
    return <Tooltip ref={setTip} aria-hidden="true" className={chartVariants.element("tooltip")} style={place}>
      <div className={chartVariants.element("tooltip-title")}>{title}</div>
      {rows}
    </Tooltip>;
  };

  /* --- The table ---------------------------------------------------------------------------------------------------- */
  const table = (visible: boolean): ReactNode => {
    const head = xLabel ?? x;
    const body = donut && first
      ? <tbody>{parts.map(part => {
          const v = valueOf(part.row[first.key]);
          const sum = parts.reduce((s, p) => s + Math.max(0, valueOf(p.row[first.key]) ?? 0), 0);
          return <tr key={part.key}>
            <TableCell>{formatX(part.row[x] ?? part.key)}</TableCell>
            <TableCell numeric>{v === null ? "–" : formatValue(v)}</TableCell>
            <TableCell numeric>{v === null || !sum ? "–" : `${Math.round(v / sum * 100)}%`}</TableCell>
          </tr>;
        })}</tbody>
      : <tbody>{data.map((row, i) => <tr key={i}>
          <TableCell>{xText(i)}</TableCell>
          {series.map(one => { const v = valueOf(row[one.key]); return <TableCell key={one.key} numeric>{v === null ? "–" : formatValue(v)}</TableCell>; })}
        </tr>)}</tbody>;
    const columns = donut ? [first?.label ?? "", shareLabel] : series.map(one => one.label);
    return <div className={visible ? chartVariants.element("table") : "area-sr-only"}>
      <Table aria-label={label} size={visible ? "sm" : undefined}>
        <thead><tr>
          <TableHeaderCell>{head}</TableHeaderCell>
          {columns.map((column, i) => <TableHeaderCell key={`${column}-${i}`} numeric>{column}</TableHeaderCell>)}
        </tr></thead>
        {body}
      </Table>
    </div>;
  };

  /* --- The parts ----------------------------------------------------------------------------------------------------- */
  const hintId = `${id}-keys`;
  const legend = (legendItems.length > (donut ? 0 : 1) && view === "chart") || tableToggle ? (
    <div className={chartVariants.element("legend")}>
      {view === "chart" && legendItems.length > (donut ? 0 : 1) ? legendItems.map(item => (
        <button key={item.key} type="button" className={chartVariants.element("legend-item")} aria-pressed={!hidden.has(item.key)} onClick={event => toggle(item.key, event)}>
          <span className={chartVariants.element("key")} style={{ "--_chart-fill": item.paint.fill } as CSSProperties} aria-hidden="true" />
          <span className={chartVariants.element("legend-label")}>{item.label}</span>
        </button>
      )) : null}
      {tableToggle ? <Button type="button" variant="ghost" size="sm" className={chartVariants.element("view")} selected={view === "table"} onSelectedChange={(_, event) => switchView(event)}>{tableLabel}</Button> : null}
    </div>
  ) : null;

  let body: ReactNode;
  if (loading) {
    body = <div className={chartVariants.element("plot")}><Skeleton delay={delay} /></div>;
  } else if (empty) {
    body = <div className={chartVariants.element("empty")}>{emptyText}</div>;
  } else if (view === "table") {
    body = table(true);
  } else {
    body = <>
      <div
        ref={setPlot}
        className={chartVariants.element("plot")}
        tabIndex={0}
        role="group"
        aria-label={label}
        aria-describedby={hintId}
        onPointerMove={event => setActive(indexAt(event))}
        onPointerLeave={() => setActive(null)}
        onFocus={(event: FocusEvent<HTMLDivElement>) => { if (event.target === event.currentTarget && active === null && event.currentTarget.matches(":focus-visible")) move(0); }}
        onBlur={() => setActive(null)}
        onKeyDown={onKeyDown}
      >
        <svg className={chartVariants.element("svg")} width={donut ? ring : W} height={donut ? ring : H} viewBox={`0 0 ${donut ? ring : W} ${donut ? ring : H}`} aria-hidden="true" focusable="false">
          {donut ? drawDonut() : cartesian()}
        </svg>
        {tooltip()}
        <span id={hintId} className="area-sr-only">{keysHint}</span>
      </div>
      {table(false)}
    </>;
  }

  return (
    <div ref={ref} {...rest} className={chartVariants({ kind, size, stacked }, className)} aria-busy={loading ? "true" : rest["aria-busy"]}>
      {body}
      {loading || empty ? null : legend}
    </div>
  );
});

export interface ChartNumberProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** What the figure is ("Active users"). */
  label: ReactNode;
  /** The figure, written as it reads ("24,318", "$48.2k"). */
  value: ReactNode;
  /** The change against the last period, as it reads ("12.4%"), in a soft Badge. */
  change?: ReactNode;
  /** Which way it went: draws the arrow and says "Up" or "Down" before the change. */
  direction?: "up" | "down";
  /** The change's meaning: success when up is good, danger when it is trouble; neutral (default) when it is neither. */
  tone?: BadgeProps["tone"];
  /** What it is against ("vs. 21,640"), after the change. */
  note?: ReactNode;
  /** Said before the change for its direction (default "Up" or "Down"). */
  directionLabel?: string;
}

/** One figure with its label and its change: a chart's number. */
export const ChartNumber = /* @__PURE__ */ forwardRef<HTMLDivElement, ChartNumberProps>(function ChartNumber(
  { label, value, change, direction, tone = "neutral", note, directionLabel, className, ...rest }, ref,
) {
  const said = directionLabel ?? (direction === "up" ? "Up" : direction === "down" ? "Down" : undefined);
  return (
    <div ref={ref} {...rest} className={chartVariants({ kind: "number" }, className)}>
      <div className={chartVariants.element("label")}>{label}</div>
      <div className={chartVariants.element("figure")}>{value}</div>
      {change != null || note != null ? (
        <div className={chartVariants.element("change")}>
          {change != null ? (
            <Badge variant="soft" tone={tone} icon={direction ? <Glyph name="arrow-up" size={12} rotate={direction === "down" ? 180 : undefined} /> : undefined}>
              {said ? <span className="area-sr-only">{`${said} `}</span> : null}{change}
            </Badge>
          ) : null}
          {note != null ? <span className={chartVariants.element("note")}>{note}</span> : null}
        </div>
      ) : null}
    </div>
  );
});

export { chartVariants };
