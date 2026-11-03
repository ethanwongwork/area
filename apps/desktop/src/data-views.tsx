/**
 * Data views (owner, 2026-11-02: "Yes, add data views"; then every module in the kit): the 21 modules of the data views
 * page (docs/research/data-views-2026-11-01, review artifact U8HnLTmy…, `verdicts` m1–m21; layout Cards, labels in
 * sentence case, colours the series), ported from the page's drawing into the app's kit so every page draws them one way:
 *
 *   StatTiles      m1   four figures, each with its change (Badge) and 30 days of columns
 *   AreaOverTime   m2   cumulative spend by kind, stacked, the rest of the period projected; the legend hides a kind
 *   Bars           m4   a ranked bar list: name, an 8 strip (so far, then projected), value; scale guides across
 *   Pace           m12  spent and projected in one 24 bar against a limit (Area's Slider moves it), the parts in rows
 *   Columns        m3   requests per day, today still counting, the average a guide
 *   HeatMatrix     m8   weekday × hour blocks, numbers in the cells, a stepped key under it
 *   Calendar       m6   a year of days, as many weeks as fit, a stepped key
 *   ShareRing      m9   parts of a whole as a ring beside its rows (name, leader, amount, share)
 *   DotGrid        m11  the same parts as 100 dots, 1 dot = 1%
 *   Tracker        m7   a day a bar, coloured by how its runs went, the data status trio
 *   WeeklyStrip    m10  a week of hours as columns, the three peaks named
 *   LanguageBar    m13  GitHub's language bar: an 8 strip of parts over its rows
 *   Diffstat       m14  files changed: path, added, removed, five blocks
 *   Waterfall      m15  a CI run's jobs on a time axis, one 24 bar a job
 *   Histogram      m16  requests by duration, p50, p95 and p99 as guides
 *   Funnel         m17  each step a data bar, its share of the step before beside it
 *   PunchCard      m18  weekday × hour, a dot's area its count
 *   Retention      m19  weekly cohorts on the heat ladder, this week lighter and unnumbered
 *   Lifecycle      m20  people gained above the line (stacked), lost below (Dormant, the neutral)
 *   StatusHistory  m21  five services' days in the status trio, uptime at the end
 *
 * The page's system, unchanged (README rounds 3–19): marks 2 apart; a mark's corner min(4, side / 4); no edges on fills
 * (stacked shapes parted by a 1.5 line in the card's colour); 1px strokes only: rule (divider), grid (decorative) and guide
 * (the muted ink at 45%, dashed 2 2); labels Geist Mono 11/14 muted, a number on a mark 11/14 500, numbers tabular; row
 * marks 24 tall, strips and keys 8; plots 192 tall; the axis gutter 40; row-based modules share a name column 120 and a
 * value column 64, 12 apart, on 28 rows; projected = the same colour lighter (40% into the card); heat and the calendar
 * on Area's blue ladder (below); series in their own colours (`-fill`), lines in the mark, the same in both themes;
 * status in the charts' trio (`--area-data-*`), never a series; Other and Dormant a neutral grey. Each module is Area's
 * Card in the feed's frame (FEED_FRAME): its title, a description with the figures, the unit in the header's action
 * corner. Plots redraw to their own width (a ResizeObserver), as the page's did. The data is seeded, so the kit's capture
 * is stable. The page's aligned Table (its section 4) is not a module; the kit's Table section shows Table.
 */
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Badge, Card, CardDescription, CardHeader, CardTitle, CardValue, Slider } from "@area/react";
import { ArrowDownIcon, ArrowUpIcon } from "@area/icons";
import { FEED_FRAME } from "./tile.tsx";

const GAP = 2, LBL = 4, AX = 40;
/** A mark's corner: 4, never past a quarter of its side (round 18). */
const corner = (w: number, h = Infinity) => Math.max(0, Math.min(4, w / 4, h / 4));
/** Heat walks Area's blue ladder (owner, 2026-11-02: "the blue doesnt look quite right", then "Area's blue ladder"; sky's
 *  deep steps read teal beside the accent): five steps with numbers in them, light 75, 150, 200, 250, 300 under the text
 *  ink; dark 900, 800, 650 under the text ink and 300, 200 under the page's (data views round 17: every number 5.1:1 or
 *  more). It walked series 1's (sky's) ramp until then. */
const HEAT = [[75, 900], [150, 800], [200, 650], [250, 300], [300, 200]].map(([light, dark]) => `light-dark(var(--area-blue-${light}), var(--area-blue-${dark}))`);
/** The calendar's four steps (no numbers) on the same ladder: light 150, 250, 350, 450; dark 850, 700, 550, 400 (round
 *  10); an empty day in the trough. */
const CAL_STEPS = [[150, 850], [250, 700], [350, 550], [450, 400]].map(([light, dark]) => `light-dark(var(--area-blue-${light}), var(--area-blue-${dark}))`);
const level = (share: number) => Math.max(0, Math.min(4, Math.floor(share * 5)));

/* Seeded data (the page's own generator), so every capture draws the same. */
const rng = (seed: number) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const rnd = rng(7);
const MATRIX = [0, 1, 2, 3, 4, 5, 6].map(day => Array.from({ length: 12 }, (_, c) => Math.round((c >= 4 && c <= 9 ? 1 : 0.25) * (day >= 5 ? 0.3 : 1) * (40 + rnd() * 80))));
const CAL = Array.from({ length: 53 * 7 }, (_, i) => { const weekend = i % 7 === 0 || i % 7 === 6; return rnd() < (weekend ? 0.55 : 0.12) ? 0 : Math.round(rnd() * (weekend ? 10 : 30) * (0.5 + i / (53 * 7))); });
const TRACK = Array.from({ length: 90 }, () => { const p = rnd(); return p < 0.04 ? "danger" : p < 0.12 ? "warning" : "success"; });
/** Parts of a whole: spend by kind this period, each in its series' colour. */
const PARTS = [
  { name: "Agent", value: 24.62, color: "var(--area-series-1-fill)" },
  { name: "Chat", value: 9.08, color: "var(--area-series-2-fill)" },
  { name: "Tab", value: 2.21, color: "var(--area-series-3-fill)" },
  { name: "Background", value: 5.43, color: "var(--area-series-4-fill)" },
];
const TOTAL = PARTS.reduce((sum, part) => sum + part.value, 0);
const share = (value: number) => `${Math.round(value / TOTAL * 100)}%`;
const money = (value: number) => `$${value.toFixed(2)}`;
const TODAY = new Date(2026, 10, 1);
const shortDate = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** A plot's width, kept current as its card resizes. */
function useWidth(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setWidth(element.clientWidth);
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry!.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

/** A module: Area's Card in the feed's frame, its title, a description with the figures, the unit at the header's end. */
function DataCard({ title, meta, unit, children }: { title: string; meta: ReactNode; unit: string; children: ReactNode }) {
  return (
    <Card {...FEED_FRAME} className="studio-frame studio-data">
      <CardHeader action={<span className="studio-data__label">{unit}</span>}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{meta}</CardDescription>
      </CardHeader>
      <div className="studio-data__body">{children}</div>
    </Card>
  );
}

/** A heat key: one block per step in the plot's columns (from x0 to its end), 2 apart, each step's lower edge under it. */
function HeatKey({ x0, steps, edges, label }: { x0: number; steps: readonly (string | null)[]; edges: readonly string[]; label: string }) {
  const [ref, width] = useWidth();
  const k = steps.length, w = Math.max(160, width), bw = (w - x0 - GAP * (k - 1)) / k, room = (w - x0) / k;
  return (
    <div ref={ref} className="studio-data__plot">
      {width ? (
        <svg width={w} height={8 + 6 + LBL + 14} viewBox={`0 0 ${w} ${8 + 6 + LBL + 14}`} role="img" aria-label={label}>
          {steps.map((fill, i) => <rect key={i} className={fill ? undefined : "studio-data__empty"} style={fill ? { fill } : undefined} x={x0 + i * (bw + GAP)} y={0} width={bw} height={8} rx={2} />)}
          {edges.map((text, i) => {
            if (i > 0 && i < k && room < 48) return null;
            const x = i === 0 ? x0 : i === k ? w : x0 + i * (bw + GAP) - GAP / 2;
            const tick = i === 0 ? x0 + 0.5 : i === k ? w - 0.5 : x;
            return (
              <g key={i}>
                <line className="studio-data__guide" x1={tick} x2={tick} y1={10} y2={14} />
                <text className="studio-data__axis" x={x} y={14 + LBL} dominantBaseline="hanging" textAnchor={i === 0 ? "start" : i === k ? "end" : "middle"}>{text}</text>
              </g>
            );
          })}
        </svg>
      ) : null}
    </div>
  );
}

/** m8: requests by weekday and hour block, 24 tall cells 2 apart, the number in a cell 32 wide or more; 6 blocks under 560. */
export function HeatMatrix() {
  const [ref, width] = useWidth();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const w = Math.max(200, width), bins = w < 560 ? 6 : 12, per = 12 / bins, top = 14 + LBL, ch = 24;
  const values = MATRIX.map(row => Array.from({ length: bins }, (_, b) => row.slice(b * per, b * per + per).reduce((sum, v) => sum + v, 0)));
  const max = Math.max(...values.flat());
  const cw = (w - AX - GAP * (bins - 1)) / bins;
  return (
    <DataCard title="When requests happen" meta={`Requests by weekday, ${per * 2}-hour blocks, last 4 weeks`} unit="count">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={w} height={top + 7 * (ch + GAP) - GAP} viewBox={`0 0 ${w} ${top + 7 * (ch + GAP) - GAP}`} role="img" aria-label={`Requests by weekday and ${per * 2}-hour block, most ${max}`}>
            {Array.from({ length: bins }, (_, c) => <text key={c} className="studio-data__axis" x={AX + c * (cw + GAP) + 8} y={top - LBL}>{String(c * per * 2).padStart(2, "0")}:00</text>)}
            {values.map((row, d) => (
              <g key={d}>
                <text className="studio-data__axis" x={0} y={top + d * (ch + GAP) + ch / 2} dy="0.35em">{days[d]}</text>
                {row.map((v, c) => {
                  const x = AX + c * (cw + GAP), y = top + d * (ch + GAP), step = level(v / max);
                  return (
                    <g key={c}>
                      <rect x={x} y={y} width={cw} height={ch} rx={corner(cw, ch)} style={{ fill: HEAT[step] }}><title>{`${days[d]} ${String(c * per * 2).padStart(2, "0")}:00, ${v} requests`}</title></rect>
                      {cw >= 32 ? <text className={`studio-data__value${step >= 3 ? " studio-data__value--on" : ""}`} x={x + 8} y={y + ch / 2} dy="0.35em">{v}</text> : null}
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
        ) : null}
      </div>
      <HeatKey x0={AX} steps={HEAT} edges={HEAT.map((_, i) => String(Math.round(max * i / 5))).concat(String(max))} label={`Scale from 0 to ${max} requests`} />
    </DataCard>
  );
}

/** m6: a day a square, as many weeks as fit at a 12 step (52 at most), the step widening to fill the card. */
export function Calendar() {
  const [ref, width] = useWidth();
  const avail = Math.max(200, width), top = 14 + LBL;
  const weeks = Math.max(8, Math.min(52, Math.floor((avail - AX + GAP) / 12)));
  const step = (avail - AX + GAP) / weeks, size = step - GAP;
  const start = new Date(TODAY); start.setDate(TODAY.getDate() - (weeks * 7 - 1) - TODAY.getDay());
  const level4 = (n: number) => n === 0 ? -1 : n < 6 ? 0 : n < 14 ? 1 : n < 24 ? 2 : 3;
  const offset = 53 * 7 - weeks * 7;
  const cells: ReactNode[] = [], months: ReactNode[] = [];
  let total = 0, lastMonth = -1;
  for (let wk = 0; wk < weeks; wk++) for (let d = 0; d < 7; d++) {
    const date = new Date(start); date.setDate(start.getDate() + wk * 7 + d);
    if (date > TODAY) continue;
    if (d === 0 && date.getMonth() !== lastMonth && date.getDate() <= 7 && wk < weeks - 2) {
      lastMonth = date.getMonth();
      months.push(<text key={`m${wk}`} className="studio-data__axis" x={AX + wk * step} y={top - LBL}>{date.toLocaleDateString("en-US", { month: "short" })}</text>);
    }
    const n = CAL[offset + wk * 7 + d] ?? 0, l = level4(n);
    total += n;
    cells.push(<rect key={`${wk}-${d}`} className={l < 0 ? "studio-data__empty" : undefined} style={l < 0 ? undefined : { fill: CAL_STEPS[l] }}
      x={AX + wk * step} y={top + d * step} width={size} height={size} rx={corner(size / 2)}><title>{`${shortDate(date)}, ${n} requests`}</title></rect>);
  }
  return (
    <DataCard title="Activity" meta={`${total.toLocaleString("en-US")} requests in ${weeks} weeks`} unit="count">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={avail} height={top + 7 * step - GAP} viewBox={`0 0 ${avail} ${top + 7 * step - GAP}`} role="img" aria-label={`Requests per day over ${weeks} weeks`}>
            {months}
            {cells}
            {["Mon", "Wed", "Fri"].map((t, i) => <text key={t} className="studio-data__axis" x={0} y={top + (1 + i * 2) * step + size / 2} dy="0.35em">{t}</text>)}
          </svg>
        ) : null}
      </div>
      <HeatKey x0={AX} steps={[null, ...CAL_STEPS]} edges={["0", "1", "6", "14", "24", "More"]} label="Requests per day: none, 1 to 5, 6 to 13, 14 to 23, 24 or more" />
    </DataCard>
  );
}

const TRACK_WORDS = { success: "All succeeded", warning: "Some failed", danger: "Most failed" } as const;

/** m7: a day a bar 24 tall, as many days as fit at 6 wide (14 to 90), in the charts' status trio; the ends dated. */
export function Tracker() {
  const [ref, width] = useWidth();
  const w = Math.max(200, width), h = 24;
  const n = Math.max(14, Math.min(90, Math.floor((w + GAP) / (6 + GAP)))), bw = (w - GAP * (n - 1)) / n;
  const first = new Date(TODAY); first.setDate(TODAY.getDate() - (n - 1));
  const shown = TRACK.slice(90 - n);
  const failed = shown.filter(state => state !== "success").length;
  return (
    <DataCard title="Request success" meta={`99.2% succeeded over the last ${n} days; ${failed} days had failures`} unit="days">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={w} height={h + LBL + 14} viewBox={`0 0 ${w} ${h + LBL + 14}`} role="img" aria-label={`Request success per day over ${n} days`}>
            {shown.map((state, i) => {
              const date = new Date(first); date.setDate(first.getDate() + i);
              return <rect key={i} x={i * (bw + GAP)} y={0} width={bw} height={h} rx={corner(bw)} style={{ fill: `var(--area-data-${state})` }}><title>{`${shortDate(date)}, ${TRACK_WORDS[state]}`}</title></rect>;
            })}
            <text className="studio-data__axis" x={0} y={h + LBL} dominantBaseline="hanging">{shortDate(first)}</text>
            <text className="studio-data__axis" x={w} y={h + LBL} dominantBaseline="hanging" textAnchor="end">{shortDate(TODAY)}</text>
          </svg>
        ) : null}
      </div>
      <div className="studio-data__legend">
        {(["success", "warning", "danger"] as const).map(state => <span key={state} className="studio-data__keyed"><i className="studio-data__key" style={{ background: `var(--area-data-${state})` }} />{TRACK_WORDS[state]}</span>)}
      </div>
    </DataCard>
  );
}

/** A part's row: key, name, a dotted leader, the amount (when there is one), the share. */
type PartRow = { name: string; color: string; amount?: string; share: string };
/** The parts as rows: key, name, a dotted leader, the amount, the share. */
function PartRows({ rows }: { rows: readonly PartRow[] }) {
  return (
    <div className="studio-data__rows">
      {rows.map(row => (
        <div key={row.name} className="studio-data__row">
          <span className="studio-data__keyed studio-data__name"><i className="studio-data__key" style={{ background: row.color }} />{row.name}</span>
          <span className="studio-data__leader" aria-hidden="true" />
          <span className="studio-data__number">{row.amount}</span>
          <span className="studio-data__number studio-data__share">{row.share}</span>
        </div>
      ))}
    </div>
  );
}

/** m9: parts of a whole as a ring 160 across and 14 thick, 2 apart at the joins, the total in its middle, its rows beside. */
export function ShareRing() {
  const size = 160, r = size / 2, thick = 14, mid = r - thick / 2, gapAngle = GAP / mid, inner = r - thick;
  const point = (radius: number, angle: number) => `${(r + radius * Math.cos(angle)).toFixed(2)},${(r + radius * Math.sin(angle)).toFixed(2)}`;
  let angle = -Math.PI / 2;
  const arcs = PARTS.map(part => {
    const sweep = part.value / TOTAL * Math.PI * 2, a0 = angle + gapAngle / 2, a1 = angle + sweep - gapAngle / 2;
    angle += sweep;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return <path key={part.name} style={{ fill: part.color }} d={`M${point(r, a0)}A${r},${r} 0 ${large} 1 ${point(r, a1)}L${point(inner, a1)}A${inner},${inner} 0 ${large} 0 ${point(inner, a0)}Z`}><title>{`${part.name}, ${money(part.value)}, ${share(part.value)}`}</title></path>;
  });
  return (
    <DataCard title="Spend share" meta="By kind, this period" unit="USD">
      <div className="studio-data__split">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Spend share by kind">
          {arcs}
          <text className="studio-data__total" x={r} y={r} dy="0.35em" textAnchor="middle">{money(TOTAL)}</text>
        </svg>
        <PartRows rows={PARTS.map(part => ({ name: part.name, color: part.color, amount: money(part.value), share: share(part.value) }))} />
      </div>
    </DataCard>
  );
}

/** m11: the same parts as 100 dots, 5 rows of 20, as large as the card allows (24 at most), filled column by column. */
export function DotGrid() {
  const [ref, width] = useWidth();
  const w = Math.max(200, width), cols = 20, rows = 5;
  const d = Math.min(24, (w - (cols - 1) * GAP) / cols);
  const counts = PARTS.map(part => Math.round(part.value / TOTAL * 100));
  counts[0]! += 100 - counts.reduce((sum, v) => sum + v, 0);
  const dots = PARTS.flatMap((part, i) => Array.from({ length: counts[i]! }, () => part));
  return (
    <DataCard title="Spend share" meta="1 dot = 1% of spend" unit="%">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={w} height={rows * d + (rows - 1) * GAP} viewBox={`0 0 ${w} ${rows * d + (rows - 1) * GAP}`} role="img" aria-label="Spend share by kind, one dot per percent">
            {dots.map((part, i) => <circle key={i} cx={Math.floor(i / rows) * (d + GAP) + d / 2} cy={(i % rows) * (d + GAP) + d / 2} r={d / 2} style={{ fill: part.color }} />)}
          </svg>
        ) : null}
      </div>
      <div className="studio-data__legend">
        {PARTS.map(part => <span key={part.name} className="studio-data__keyed"><i className="studio-data__key" style={{ background: part.color }} />{part.name} {share(part.value)}</span>)}
      </div>
    </DataCard>
  );
}

/* --- The rest of the page's modules (m1–m4, m10, m12–m21) ---------------------------------------------------------- */

/** The name and value columns every row-based module shares, 12 apart (round 9). */
const NAME_W = 120, VAL_W = 64, COL_GAP = 12;
/** Under 480 a plot's name column fits its longest name (13/18 text, about 7.2 a character) rather than 120, so a narrow card
 *  keeps room for its marks. */
const nameColumn = (width: number, names: readonly string[]) => width >= 480 ? NAME_W : Math.min(NAME_W, Math.ceil(Math.max(...names.map(name => name.length)) * 7.2));
const CARD_FILL = "var(--area-card-fill, var(--area-bg-surface))";
const series = (n: number) => `var(--area-series-${n}-fill)`;
const S1 = series(1);
/** Projected, or not in yet: the same colour lighter, 40% into the card (the page's `--pj`). */
const lighter = (color: string) => `color-mix(in oklab, ${color} 40%, ${CARD_FILL})`;
/** Other and Dormant: a neutral, not a series (data.css `--_other`). */
const OTHER = "var(--_other)";
const STATUS = { success: "var(--area-data-success)", warning: "var(--area-data-warning)", danger: "var(--area-data-danger)" } as const;

const compact = (value: number) => value >= 1e6 ? `${(value / 1e6).toFixed(1).replace(/\.0$/, "")}M` : value >= 1e3 ? `${(value / 1e3).toFixed(1).replace(/\.0$/, "")}K` : String(Math.round(value));
const count = (value: number) => value.toLocaleString("en-US");
const niceStep = (value: number) => { const p = 10 ** Math.floor(Math.log10(value)); const n = value / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };
/** Round ticks from 0 past the most, about `n` of them. */
const ticksFor = (max: number, n: number) => { const step = niceStep(max / n); const top = Math.ceil(max / step) * step; const ticks: number[] = []; for (let v = 0; v <= top + 1e-9; v += step) ticks.push(+v.toFixed(6)); return ticks; };
/** Which of n positions get a date under them: one per 96 of width, the ends always. */
const tickIdx = (n: number, w: number) => { const k = Math.max(2, Math.min(n, Math.floor(w / 96) + 1)); return Array.from({ length: k }, (_, j) => Math.round(j * (n - 1) / (k - 1))); };
const anchorAt = (i: number, n: number) => i === 0 ? "start" : i === n - 1 ? "end" : "middle";
/** A column: square at its baseline, rounded at its value end. */
const barUp = (x: number, y: number, w: number, h: number, r = corner(w, h)) => r > 0
  ? `M${x},${y + h}V${y + r}A${r},${r} 0 0 1 ${x + r},${y}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${y + r}V${y + h}Z`
  : `M${x},${y + h}V${y}H${x + w}V${y + h}Z`;
/** A column below the line: square at the line, rounded at its foot. */
const barDown = (x: number, y: number, w: number, h: number) => { const r = corner(w, h); return `M${x},${y}H${x + w}V${y + h - r}A${r},${r} 0 0 1 ${x + w - r},${y + h}H${x + r}A${r},${r} 0 0 1 ${x},${y + h - r}Z`; };
const hhmm = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

/* The usage data, the page's own sequence: rng(7) drawn in the page's order (spend, requests, then the heat, calendar and
   tracker draws, then the hours), so these modules show the page's numbers. The billing period runs Oct 3 to Nov 7;
   today is Nov 1, day 30. */
const DAYS = 30, PERIOD = 36;
const periodDay = (i: number) => new Date(2026, 9, 3 + i);
const weekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
const usage = rng(7);
const KINDS = [
  { name: "Agent", color: series(1), weight: 0.82 },
  { name: "Chat", color: series(2), weight: 0.3 },
  { name: "Tab", color: series(3), weight: 0.07 },
  { name: "Background", color: series(4), weight: 0.18 },
];
const SPEND = KINDS.map(kind => Array.from({ length: DAYS }, (_, i) => +(kind.weight * (weekend(periodDay(i)) ? 0.45 : 1) * (0.6 + usage() * 0.9) * (1 + i / 60)).toFixed(2)));
const CUM = SPEND.map(daily => { let sum = 0; return daily.map(v => +(sum += v).toFixed(2)); });
const RATE = CUM.map(cum => cum[DAYS - 1]! / DAYS);
const REQUESTS = Array.from({ length: DAYS }, (_, i) => Math.round((weekend(periodDay(i)) ? 70 : 190) * (0.7 + usage() * 0.6) * (1 + i / 50)));
REQUESTS[DAYS - 1] = Math.round(REQUESTS[DAYS - 1]! * 0.55); /* today, still counting */
for (let i = 0; i < 7 * 12; i++) usage(); /* the page's heat matrix */
for (let i = 0; i < 53 * 7; i++) if (usage() >= (i % 7 === 0 || i % 7 === 6 ? 0.55 : 0.12)) usage(); /* its calendar */
for (let i = 0; i < 90; i++) if (usage() < 0.12) usage(); /* its tracker */
const HOURS = Array.from({ length: 168 }, (_, i) => Math.round((i % 24 >= 9 && i % 24 <= 18 ? 1 : 0.2) * (Math.floor(i / 24) >= 5 ? 0.35 : 1) * (10 + usage() * 40)));
[34, 82, 108].forEach((i, k) => { HOURS[i] = [88, 102, 95][k]!; });
const SPENT = CUM.reduce((sum, cum) => sum + cum[DAYS - 1]!, 0);
const PROJECTED = SPENT / DAYS * PERIOD;
const KIND_ROWS = (amounts: boolean): PartRow[] => KINDS.map((kind, k) => ({ name: kind.name, color: kind.color, amount: amounts ? money(CUM[k]![DAYS - 1]!) : undefined, share: `${Math.round(CUM[k]![DAYS - 1]! / SPENT * 100)}%` }));

/** A legend: an 8 key and its words per item. */
function Legend({ items }: { items: ReadonlyArray<readonly [string, string]> }) {
  return (
    <div className="studio-data__legend">
      {items.map(([name, color]) => <span key={name} className="studio-data__keyed"><i className="studio-data__key" style={{ background: color }} />{name}</span>)}
    </div>
  );
}

/** Horizontal gridlines from x0 to x1, the baseline a rule, each tick's label in the gutter, 8 from the plot. */
function YGrid({ ticks, y, x0, x1, format }: { ticks: readonly number[]; y: (v: number) => number; x0: number; x1: number; format: (v: number) => string }) {
  return (
    <>
      {ticks.map(v => (
        <g key={v}>
          <line className={v ? "studio-data__grid" : "studio-data__base"} x1={x0} x2={x1} y1={y(v)} y2={y(v)} />
          <text className="studio-data__axis" x={x0 - 8} y={y(v)} dy="0.35em" textAnchor="end">{format(v)}</text>
        </g>
      ))}
    </>
  );
}

/** A data bar on one 28 row: name (120) · an 8 strip in the trough, its fill, then what is projected · value (64). Text
 *  never sits on the fill. `large`: a 24 bar on a 32 row (Pace). Guides go inside the strip as children. */
function DataBar({ name, value, ratio, projected = 0, color = S1, large, title, children }: { name: string; value: string; ratio: number; projected?: number; color?: string; large?: boolean; title?: string; children?: ReactNode }) {
  return (
    <div className={`studio-data__bar${large ? " studio-data__bar--lg" : ""}`} title={title} style={{ "--_c": color, "--_r": Math.max(0, ratio).toFixed(4), "--_p": Math.max(0, projected).toFixed(4) } as CSSProperties}>
      <span className="studio-data__bar-name">{name}</span>
      <span className="studio-data__track">
        <i className="studio-data__fill" />
        {projected > 0 ? <i className="studio-data__projected" /> : null}
        {children}
      </span>
      <span className="studio-data__number">{value}</span>
    </div>
  );
}

/* m1 ------------------------------------------------------------------------------------------------------------------ */

const STATS = [
  { label: "Requests", unit: "count", period: "Last 30 days", value: "5,842", change: "12.4%", up: true, tone: "success", note: "vs. 5,197", data: REQUESTS, format: compact },
  { label: "Tokens", unit: "count", period: "Last 30 days", value: "41.3M", change: "8.1%", up: true, tone: "success", note: "vs. 38.2M", data: REQUESTS.map((v, i) => v * (6200 + (i % 5) * 400)), format: compact },
  { label: "Spend", unit: "USD", period: "This period", value: money(SPENT), change: "15.9%", up: true, tone: "neutral", note: "vs. $37.64", data: Array.from({ length: DAYS }, (_, i) => SPEND.reduce((sum, daily) => sum + daily[i]!, 0)), format: money },
  { label: "Acceptance", unit: "%", period: "Last 30 days", value: "38.4%", change: "1.2 pt", up: false, tone: "danger", note: "vs. 39.6%", data: REQUESTS.map((v, i) => +(40.5 - i * 0.07 + (v % 7) / 4).toFixed(1)), format: (v: number) => `${v}%` },
] as const;

/** One stat tile: Card's figure, its change (a soft Badge, the arrow in its words' colour) and what it is against, then a
 *  column a day 32 tall, as Columns draws them; today in the lighter "so far" colour. A share stands in a trough to 100%. */
function StatTile({ stat }: { stat: (typeof STATS)[number] }) {
  const [ref, width] = useWidth();
  const w = Math.max(80, width), h = 32, n = stat.data.length, isShare = stat.unit === "%";
  const band = (w + GAP) / n, bw = band - GAP, max = isShare ? 100 : Math.max(...stat.data);
  return (
    <DataCard title={stat.label} meta={stat.period} unit={stat.unit}>
      <CardValue>{stat.value}</CardValue>
      <div className="studio-data__change">
        <Badge variant="soft" tone={stat.tone} icon={stat.up ? <ArrowUpIcon /> : <ArrowDownIcon />}>{stat.change}</Badge>
        <span className="studio-data__label">{stat.note}</span>
      </div>
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${stat.label} per day, last ${n} days`}>
            {stat.data.map((v, i) => {
              const bh = Math.max(2, v / max * h), today = i === n - 1, x = i * band, r = corner(bw);
              return (
                <g key={i}>
                  <title>{`${shortDate(periodDay(DAYS - n + i))}${today ? ", so far" : ""}: ${stat.format(v)}`}</title>
                  {isShare ? <path className="studio-data__empty" d={barUp(x, 0, bw, h, r)} /> : null}
                  <path style={{ fill: today ? lighter(S1) : S1 }} d={barUp(x, h - bh, bw, bh, r)} />
                </g>
              );
            })}
          </svg>
        ) : null}
      </div>
    </DataCard>
  );
}

/** m1: four stat tiles, a row of four (two, then one, as the feed narrows). */
export function StatTiles() {
  return <div className="studio-data-quad">{STATS.map(stat => <StatTile key={stat.label} stat={stat} />)}</div>;
}

/* m2 ------------------------------------------------------------------------------------------------------------------ */

/** m2: spend by kind, cumulative and stacked, 192 tall; the period's rest projected in the lighter colours, today a guide.
 *  A legend name hides its kind (one stays). */
export function AreaOverTime() {
  const [ref, width] = useWidth();
  const [hidden, setHidden] = useState<ReadonlySet<string>>(() => new Set());
  const W = Math.max(200, width), H = 192, top = 12, bottom = 18, N = PERIOD;
  const val = (k: number, i: number) => i < DAYS ? CUM[k]![i]! : CUM[k]![DAYS - 1]! + RATE[k]! * (i - DAYS + 1);
  const totals = Array.from({ length: N }, (_, i) => KINDS.reduce((sum, kind, k) => sum + (hidden.has(kind.name) ? 0 : val(k, i)), 0));
  const ticks = ticksFor(Math.max(...totals) * 1.05, 4), max = ticks[ticks.length - 1]!;
  const x = (i: number) => AX + i * (W - AX) / (N - 1), y = (v: number) => top + (1 - v / max) * (H - top - bottom);
  const lower: number[] = Array(N).fill(0);
  const fills: ReactNode[] = [], gaps: ReactNode[] = [];
  KINDS.forEach((kind, k) => {
    if (hidden.has(kind.name)) return;
    const upper = lower.map((v, i) => v + val(k, i));
    const edge = (a: number, b: number) => upper.slice(a, b + 1).map((v, j) => `${j ? "L" : "M"}${x(a + j).toFixed(1)},${y(v).toFixed(1)}`).join("");
    const foot = (a: number, b: number) => lower.slice(a, b + 1).map((v, j) => `L${x(a + j).toFixed(1)},${y(v).toFixed(1)}`).reverse().join("");
    fills.push(<path key={`${kind.name}-past`} style={{ fill: kind.color }} d={`${edge(0, DAYS - 1)}${foot(0, DAYS - 1)}Z`} />);
    fills.push(<path key={`${kind.name}-next`} style={{ fill: lighter(kind.color) }} d={`${edge(DAYS - 1, N - 1)}${foot(DAYS - 1, N - 1)}Z`} />);
    gaps.push(<path key={kind.name} className="studio-data__gapline" d={edge(0, N - 1)} />);
    upper.forEach((v, i) => { lower[i] = v; });
  });
  const tx = x(DAYS - 1), step = (W - AX) / (N - 1);
  const toggle = (name: string) => setHidden(current => {
    const next = new Set(current);
    if (next.has(name)) next.delete(name); else if (next.size < KINDS.length - 1) next.add(name);
    return next;
  });
  return (
    <DataCard title="Daily usage" meta="Spend across the billing period, cumulative, with the rest of the period projected" unit="USD">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Cumulative spend by kind, ${money(totals[DAYS - 1]!)} by Nov 1, projected ${money(totals[N - 1]!)} by Nov 7`}>
            <YGrid ticks={ticks} y={y} x0={AX} x1={W} format={v => `$${v}`} />
            {tickIdx(N, W - AX).map(i => <text key={i} className="studio-data__axis" x={x(i)} y={H - bottom + LBL} dominantBaseline="hanging" textAnchor={anchorAt(i, N)}>{shortDate(periodDay(i))}</text>)}
            {fills}
            {gaps}
            <line className="studio-data__ref" x1={tx} x2={tx} y1={top} y2={H - bottom} />
            <text className="studio-data__axis studio-data__halo" x={tx - 4} y={top + 2} dy="0.35em" textAnchor="end">Today {money(totals[DAYS - 1]!)}</text>
            {totals.map((total, i) => (
              <rect key={i} className="studio-data__hit" x={Math.max(AX, x(i) - step / 2)} y={top} width={step} height={H - top - bottom}>
                <title>{`${shortDate(periodDay(i))}${i === DAYS - 1 ? ", today" : i >= DAYS ? ", projected" : ""}: ${KINDS.filter(kind => !hidden.has(kind.name)).map(kind => `${kind.name} ${money(val(KINDS.indexOf(kind), i))}`).join(", ")}; total ${money(total)}`}</title>
              </rect>
            ))}
          </svg>
        ) : null}
      </div>
      <div className="studio-data__legend">
        {KINDS.map(kind => (
          <button key={kind.name} type="button" className="studio-data__keyed studio-data__toggle" aria-pressed={!hidden.has(kind.name)} onClick={() => toggle(kind.name)}>
            <i className="studio-data__key" style={{ background: kind.color }} />{kind.name}
          </button>
        ))}
        <span className="studio-data__keyed"><i className="studio-data__key" style={{ background: lighter(S1) }} />Projected</span>
      </div>
    </DataCard>
  );
}

/* m4 ------------------------------------------------------------------------------------------------------------------ */

const MODELS = [["Large", 2140], ["Default", 1688], ["Fast", 912], ["Reasoning", 604], ["Small", 318], ["Other", 180]] as const;

/** m4: models ranked, each a data bar, so far then projected; two scale guides cross every bar, their values above. */
export function Bars() {
  const f = PERIOD / DAYS, scale = niceStep(MODELS[0][1] * f / 3) * 3, marks = [scale / 3, scale * 2 / 3];
  return (
    <DataCard title="Top models" meta="So far and projected, this period" unit="requests">
      <div className="studio-data__bars">
        <div className="studio-data__columns studio-data__scale studio-data__label" aria-hidden="true">
          <span /><span>{marks.map(m => <span key={m} style={{ left: `${m / scale * 100}%` }}>{compact(m)}</span>)}</span><span />
        </div>
        <div className="studio-data__columns studio-data__guides" aria-hidden="true">
          <span /><span>{marks.map(m => <i key={m} style={{ left: `${m / scale * 100}%` }} />)}</span><span />
        </div>
        {MODELS.map(([name, v]) => <DataBar key={name} name={name} value={count(v)} ratio={v / scale} projected={v * (f - 1) / scale} title={`${name}: ${count(v)} so far, ${count(Math.round(v * f))} projected`} />)}
      </div>
      <Legend items={[["So far", S1], ["Projected", lighter(S1)]]} />
    </DataCard>
  );
}

/* m12 ----------------------------------------------------------------------------------------------------------------- */

/** m12: spent and projected in one 24 bar, the limit and today's pace as guides across it, the parts in rows, and the
 *  limit on Area's Slider (the bar follows it). */
export function Pace() {
  const [limit, setLimit] = useState(60);
  const [ref, width] = useWidth();
  const max = Math.max(limit, PROJECTED) * 1.1, pc = (v: number) => `${(v / max * 100).toFixed(2)}%`, pace = limit * DAYS / PERIOD;
  const over = PROJECTED - limit;
  return (
    <DataCard title="Spend pace" meta={`Projected ${money(PROJECTED)} by Nov 7, ${money(Math.abs(over))} ${over > 0 ? "over" : "under"} the limit`} unit="USD">
      <div ref={ref} className="studio-data__pace">
        <div className="studio-data__columns studio-data__label studio-data__marks">
          <span /><span><span style={{ left: pc(limit), transform: `translateX(${limit / max > 0.8 ? "-100%" : "-50%"})` }}>Limit {money(limit)}</span></span><span />
        </div>
        <DataBar large name="Spent" value={money(SPENT)} ratio={SPENT / max} projected={(PROJECTED - SPENT) / max}
          title={`Spent ${money(SPENT)}, projected ${money(PROJECTED)}, on pace today ${money(pace)}, limit ${money(limit)}`}>
          <i className="studio-data__vguide" style={{ left: pc(pace) }} />
          <i className="studio-data__vguide" style={{ left: pc(limit) }} />
        </DataBar>
        <div className="studio-data__columns studio-data__label">
          <span /><span className="studio-data__ends">{width - NAME_W - VAL_W - 2 * COL_GAP >= 160 ? <span>$0</span> : <span />}<span>Projected {money(PROJECTED)}</span></span><span />
        </div>
      </div>
      <PartRows rows={KIND_ROWS(true)} />
      <div className="studio-data__legend">
        <span className="studio-data__keyed"><i className="studio-data__key" style={{ background: S1 }} />Spent</span>
        <span className="studio-data__keyed"><i className="studio-data__key" style={{ background: lighter(S1) }} />Projected</span>
        <span className="studio-data__keyed"><svg width={8} height={8} viewBox="0 0 8 8" aria-hidden="true"><line className="studio-data__ref" x1={4.5} x2={4.5} y1={0} y2={8} /></svg>On pace today</span>
      </div>
      <Slider variant="bar" labelPosition="inside" label="Limit" min={20} max={120} step={5} value={limit} onValueChange={setLimit} readout={(v: number) => `$${v}`} />
    </DataCard>
  );
}

/* m3 ------------------------------------------------------------------------------------------------------------------ */

/** m3: a column a day, 192 tall, today in the lighter colour (still counting), the most labelled, the average a guide. */
export function Columns() {
  const [ref, width] = useWidth();
  const W = Math.max(200, width), H = 192, top = 18, bottom = 18;
  const ticks = ticksFor(Math.max(...REQUESTS), 4), max = ticks[ticks.length - 1]!;
  const band = (W - AX) / DAYS, bw = Math.max(1, band - GAP), y = (v: number) => top + (1 - v / max) * (H - top - bottom);
  const done = REQUESTS.slice(0, -1), avg = Math.round(done.reduce((sum, v) => sum + v, 0) / done.length), most = REQUESTS.indexOf(Math.max(...REQUESTS));
  return (
    <DataCard title="Requests per day" meta="Today still counting; the average marked" unit="count">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Requests per day, average ${avg}, most ${REQUESTS[most]} on ${shortDate(periodDay(most))}`}>
            <YGrid ticks={ticks} y={y} x0={AX} x1={W} format={String} />
            {REQUESTS.map((v, i) => {
              const bx = AX + i * band + GAP / 2, today = i === DAYS - 1;
              return (
                <g key={i}>
                  <title>{`${periodDay(i).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}${today ? ", so far" : ""}: ${v} requests, ${v >= avg ? "+" : "−"}${Math.abs(v - avg)} on the average`}</title>
                  <path style={{ fill: today ? lighter(S1) : S1 }} d={barUp(bx, y(v), bw, y(0) - y(v))} />
                  <rect className="studio-data__hit" x={AX + i * band} y={top} width={band} height={H - top - bottom} />
                  {i === most ? <text className="studio-data__value" x={bx + bw / 2} y={y(v) - LBL - 2} textAnchor="middle">{v}</text> : null}
                </g>
              );
            })}
            <line className="studio-data__ref" x1={AX} x2={W} y1={y(avg)} y2={y(avg)} />
            <text className="studio-data__axis studio-data__halo" x={AX + 4} y={y(avg) - 9} dy="0.35em">avg {avg}</text>
            {tickIdx(DAYS, W - AX).map(i => <text key={i} className="studio-data__axis" x={AX + i * band + band / 2} y={H - bottom + LBL} dominantBaseline="hanging" textAnchor={anchorAt(i, DAYS)}>{shortDate(periodDay(i))}</text>)}
          </svg>
        ) : null}
      </div>
      <Legend items={[["Requests", S1], ["Today, so far", lighter(S1)]]} />
    </DataCard>
  );
}

/* m10 ----------------------------------------------------------------------------------------------------------------- */

/** m10: a week of requests as columns, an hour each where 5 wide fits (else 2 or 4 hours), the three peaks named on guides
 *  above them, each day dated. */
export function WeeklyStrip() {
  const [ref, width] = useWidth();
  const W = Math.max(200, width), H = 192, top = 30, bottom = 18;
  const per = (W - AX) / 168 >= 5 ? 1 : (W - AX) / 84 >= 5 ? 2 : 4;
  const values = Array.from({ length: 168 / per }, (_, b) => HOURS.slice(b * per, b * per + per).reduce((sum, v) => sum + v, 0));
  const n = values.length, band = (W - AX) / n, bw = Math.max(1, band - GAP);
  const ticks = ticksFor(Math.max(...values), 3), max = ticks[ticks.length - 1]!, y = (v: number) => top + (1 - v / max) * (H - top - bottom);
  const when = (i: number) => { const hour = i * per; return new Date(2026, 9, 26 + Math.floor(hour / 24), hour % 24); };
  const peakText = (i: number) => `${when(i).toLocaleDateString("en-US", { weekday: "short" })} ${hhmm(when(i).getHours())} · ${values[i]}`;
  /* The three highest columns whose labels keep 12 apart (a label about 6.7 a character). */
  const room = (a: number, b: number) => (peakText(a).length + peakText(b).length) * 6.7 / 2 + 12;
  const peaks: number[] = [];
  for (const [, i] of values.map((v, i) => [v, i] as const).sort((a, b) => b[0] - a[0])) { if (peaks.every(p => Math.abs(p - i) * band > room(p, i))) peaks.push(i); if (peaks.length === 3) break; }
  const unit = per === 1 ? "hour" : `${per} hours`;
  return (
    <DataCard title="Requests over the week" meta={`Requests per ${unit}, Oct 26 to Nov 1`} unit="count">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Requests per ${unit} over 7 days, three peaks labelled`}>
            <YGrid ticks={ticks} y={y} x0={AX} x1={W} format={String} />
            {values.map((v, i) => {
              const x0 = AX + i * band + GAP / 2, date = when(i);
              return (
                <g key={i}>
                  <title>{`${date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}, ${hhmm(date.getHours())}${per > 1 ? `, ${per} h` : ""}: ${v} requests`}</title>
                  <path style={{ fill: S1 }} d={barUp(x0, y(v), bw, y(0) - y(v))} />
                  <rect className="studio-data__hit" x={AX + i * band} y={top} width={band} height={H - top - bottom} />
                </g>
              );
            })}
            {peaks.map(i => {
              const v = values[i]!, cx = AX + i * band + GAP / 2 + bw / 2, text = peakText(i), half = text.length * 6.7 / 2;
              const anchor = cx - half < 0 ? "start" : cx + half > W ? "end" : "middle";
              return (
                <g key={i}>
                  <line className="studio-data__ref" x1={cx} x2={cx} y1={y(v) - 2} y2={top - 12} />
                  <text className="studio-data__axis studio-data__halo" x={anchor === "start" ? Math.max(0, cx - 4) : anchor === "end" ? Math.min(W, cx + 4) : cx} y={9} dy="0.35em" textAnchor={anchor}>{text}</text>
                </g>
              );
            })}
            {Array.from({ length: 7 }, (_, d) => (W - AX) / 7 >= 48 || d % 2 === 0
              ? <text key={d} className="studio-data__axis" x={AX + d * (24 / per) * band + 4} y={H - bottom + LBL} dominantBaseline="hanging">{new Date(2026, 9, 26 + d).toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}</text>
              : null)}
          </svg>
        ) : null}
      </div>
    </DataCard>
  );
}

/* m13 ----------------------------------------------------------------------------------------------------------------- */

const LANGUAGES = [["TypeScript", 61.2, series(1)], ["CSS", 22.4, series(2)], ["JavaScript", 9.1, series(3)], ["HTML", 4.3, series(4)], ["Shell", 2.0, series(5)], ["Other", 1.0, OTHER]] as const;
const REPO_BYTES = 1.84e6;

/** m13: GitHub's language bar, an 8 strip of parts 2 apart, over its rows (size and share). */
export function LanguageBar() {
  return (
    <DataCard title="Languages" meta="Share of the repository by size, as GitHub's language bar" unit="%">
      <div className="studio-data__strip" role="img" aria-label={LANGUAGES.map(([name, v]) => `${name} ${v.toFixed(1)}%`).join(", ")}>
        {LANGUAGES.map(([name, v, color]) => <i key={name} title={`${name}, ${v.toFixed(1)}%`} style={{ flex: `${v} 1 0`, background: color }} />)}
      </div>
      <PartRows rows={LANGUAGES.map(([name, v, color]) => ({ name, color, amount: `${(REPO_BYTES * v / 100 / 1e3).toFixed(0)} KB`, share: `${v.toFixed(1)}%` }))} />
    </DataCard>
  );
}

/* m14 ----------------------------------------------------------------------------------------------------------------- */

const FILES = [
  ["packages/react/src/components/Chart.tsx", 214, 0], ["packages/react/src/index.ts", 6, 0], ["packages/styles/src/components/chart.css", 96, 0],
  ["packages/styles/src/components/navigation.css", 18, 6], ["apps/desktop/src/pages/data-lab.tsx", 64, 18], ["packages/tokens/src/axes/series.ts", 12, 46],
  ["docs/specs/table.md", 8, 58],
] as const;

/** m14: files changed, one 28 row each: the path (its end kept when it is cut), lines added and removed, five 8 blocks. */
export function Diffstat() {
  const added = FILES.reduce((sum, file) => sum + file[1], 0), removed = FILES.reduce((sum, file) => sum + file[2], 0);
  const blocks = (a: number, d: number) => {
    const t = a + d, scale = 5 * Math.min(1, t / 60), na = Math.round(a / Math.max(t, 1) * scale), nd = Math.round(d / Math.max(t, 1) * scale);
    return Array.from({ length: 5 }, (_, i) => i < na ? STATUS.success : i < na + nd ? STATUS.danger : "var(--area-bg-component)");
  };
  return (
    <DataCard title="Files changed" meta={`+${added} −${removed} across ${FILES.length} files`} unit="lines">
      <div className="studio-data__rows">
        {FILES.map(([path, a, d]) => (
          <div key={path} className="studio-data__diff" title={`${path}: ${a} added, ${d} removed`}>
            <span className="studio-data__path"><bdi>{path}</bdi></span>
            <span className="studio-data__number">+{a}</span>
            <span className="studio-data__number studio-data__muted">−{d}</span>
            <span className="studio-data__blocks" aria-hidden="true">{blocks(a, d).map((color, i) => <i key={i} style={{ background: color }} />)}</span>
          </div>
        ))}
      </div>
    </DataCard>
  );
}

/* m15 ----------------------------------------------------------------------------------------------------------------- */

const JOBS = [["Install", 0, 42, "passed"], ["Lint", 42, 38, "passed"], ["Typecheck", 42, 71, "passed"], ["Build", 42, 128, "passed"], ["Test · unit", 170, 96, "passed"], ["Test · e2e", 170, 212, "failed"], ["Deploy preview", 382, 54, "waiting"]] as const;
const JOB_FILL = { passed: S1, failed: STATUS.danger, waiting: lighter(S1) } as const;

/** m15: a CI run, a job a 24 bar on a time axis (a minute a guide), its name in the name column and its time in the value
 *  column. */
export function Waterfall() {
  const [ref, width] = useWidth();
  const W = Math.max(320, width), lab = nameColumn(W, JOBS.map(job => job[0])) + COL_GAP, top = 14 + LBL, rowH = 24 + GAP, bh = 24, end = 440;
  const plotW = W - lab - VAL_W - COL_GAP, x = (t: number) => lab + t / end * plotW, H = top + JOBS.length * rowH;
  const time = (t: number) => t >= 60 ? `${Math.floor(t / 60)}m ${String(t % 60).padStart(2, "0")}s` : `${t}s`;
  const every = Math.ceil(32 / (x(60) - x(0)));
  return (
    <DataCard title="Run #1,284" meta="7 jobs, 6m 22s so far; Test · e2e failed and Deploy preview is waiting" unit="time">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="CI run: seven jobs on a time axis; Test · e2e failed">
            {Array.from({ length: Math.floor(end / 60) + 1 }, (_, m) => (
              <g key={m}>
                <line className={m ? "studio-data__ref" : "studio-data__base"} x1={x(m * 60)} x2={x(m * 60)} y1={top} y2={H} />
                {m % every ? null : <text className="studio-data__axis" x={x(m * 60)} y={top - LBL} textAnchor={m ? "middle" : "start"}>{m}m</text>}
              </g>
            ))}
            {JOBS.map(([name, start, took, result], i) => {
              const yc = top + i * rowH + rowH / 2, w = took / end * plotW;
              return (
                <g key={name}>
                  <title>{`${name}: started ${time(start)}, ${result === "waiting" ? "waiting" : `took ${time(took)}, ${result}`}`}</title>
                  <text className="studio-data__text" x={0} y={yc} dy="0.35em">{name}</text>
                  <rect x={x(start)} y={yc - bh / 2} width={w} height={bh} rx={corner(w, bh)} style={{ fill: JOB_FILL[result] }} />
                  <text className={`studio-data__num${result === "waiting" ? " studio-data__num--muted" : ""}`} x={W} y={yc} dy="0.35em" textAnchor="end">{result === "waiting" ? "Waiting" : time(took)}</text>
                  <rect className="studio-data__hit" x={0} y={yc - rowH / 2} width={W} height={rowH} />
                </g>
              );
            })}
          </svg>
        ) : null}
      </div>
      <Legend items={[["Passed", JOB_FILL.passed], ["Failed", JOB_FILL.failed], ["Waiting", JOB_FILL.waiting]]} />
    </DataCard>
  );
}

/* m16 ----------------------------------------------------------------------------------------------------------------- */

/** Response times in 40 ms bins, seeded (rng 31, the page's). */
const LATENCY = (() => { const r = rng(31); return Array.from({ length: 25 }, (_, i) => { const ms = (i + 0.5) * 40; return Math.round(900 * Math.exp(-Math.pow(Math.log(ms / 170), 2) / 0.5) + r() * 30); }); })();

/** m16: requests by duration, 192 tall, p50, p95 and p99 as guides named at their tops (a label that would touch the one
 *  before drops a line). */
export function Histogram() {
  const [ref, width] = useWidth();
  const W = Math.max(200, width), H = 192, top = 30, bottom = 18, bins = LATENCY.length, binMs = 40;
  const total = LATENCY.reduce((sum, v) => sum + v, 0);
  const quantile = (f: number) => { let acc = 0; for (let i = 0; i < bins; i++) { acc += LATENCY[i]!; if (acc >= f * total) return Math.round((i + (1 - (acc - f * total) / LATENCY[i]!)) * binMs); } return bins * binMs; };
  const ticks = ticksFor(Math.max(...LATENCY), 3), max = ticks[ticks.length - 1]!, band = (W - AX) / bins;
  const y = (v: number) => top + (1 - v / max) * (H - top - bottom), xm = (ms: number) => AX + ms / binMs * band;
  /* A label sits on its guide's top line; one that would touch a label there drops a line; one that would touch on both
     lines is left off (its guide stays, its value in the plot's name). */
  const placed: { span: [number, number]; y: number }[] = [];
  const guides = ([[0.5, "p50"], [0.95, "p95"], [0.99, "p99"]] as const).map(([f, name]) => {
    const v = quantile(f), xx = xm(v), text = `${name} ${v} ms`, w = text.length * 6.7 + 8, anchor = xx + w > W ? "end" : "start";
    const span: [number, number] = anchor === "end" ? [xx - w, xx] : [xx, xx + w];
    const ly = [8, 22].find(line => placed.every(other => other.y !== line || span[0] >= other.span[1] + 8 || span[1] <= other.span[0] - 8));
    if (ly !== undefined) placed.push({ span, y: ly });
    return (
      <g key={name}>
        <line className="studio-data__ref" x1={xx} x2={xx} y1={(ly ?? 22) + 8} y2={H - bottom} />
        {ly !== undefined ? <text className="studio-data__axis studio-data__halo" x={anchor === "end" ? xx - 4 : xx + 4} y={ly} dy="0.35em" textAnchor={anchor}>{text}</text> : null}
      </g>
    );
  });
  return (
    <DataCard title="Response time" meta="Requests by duration, last 24 hours, with percentiles" unit="ms">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Response time histogram; p50 ${quantile(0.5)} ms, p95 ${quantile(0.95)} ms, p99 ${quantile(0.99)} ms`}>
            <YGrid ticks={ticks} y={y} x0={AX} x1={W} format={compact} />
            {LATENCY.map((v, i) => (
              <g key={i}>
                <title>{`${i * binMs} to ${(i + 1) * binMs} ms: ${count(v)} requests`}</title>
                <path style={{ fill: S1 }} d={barUp(AX + i * band + GAP / 2, y(v), band - GAP, y(0) - y(v))} />
                <rect className="studio-data__hit" x={AX + i * band} y={top} width={band} height={H - top - bottom} />
              </g>
            ))}
            {guides}
            {[0, 250, 500, 750, 1000].map(ms => xm(ms) <= W + 0.5
              ? <text key={ms} className="studio-data__axis" x={xm(ms)} y={H - bottom + LBL} dominantBaseline="hanging" textAnchor={ms === 0 ? "start" : xm(ms) > W - 20 ? "end" : "middle"}>{ms ? (ms === 1000 ? "1 s" : ms) : "0 ms"}</text>
              : null)}
          </svg>
        ) : null}
      </div>
    </DataCard>
  );
}

/* m17 ----------------------------------------------------------------------------------------------------------------- */

const FUNNEL = [["Visited", 12480], ["Viewed pricing", 6904], ["Signed up", 3212], ["Verified email", 2604], ["Created a project", 1840], ["Invited a team", 1012], ["Subscribed", 412]] as const;

/** m17: each step a data bar against the first, its share of the step before at the end. */
export function Funnel() {
  const first = FUNNEL[0][1];
  return (
    <DataCard title="Sign-up funnel" meta="Last 30 days; each step as a share of the one before" unit="people">
      <div className="studio-data__bars">
        {FUNNEL.map(([name, v], i) => {
          const before = i ? FUNNEL[i - 1]![1] : 0;
          return (
            <div key={name} className="studio-data__step">
              <DataBar name={name} value={count(v)} ratio={v / first} title={`${name}: ${count(v)} people, ${i ? `${(v / before * 100).toFixed(1)}% of the step before, ` : ""}${(v / first * 100).toFixed(1)}% of all visitors`} />
              <span className="studio-data__number studio-data__muted">{i ? `${(v / before * 100).toFixed(0)}%` : ""}</span>
            </div>
          );
        })}
      </div>
    </DataCard>
  );
}

/* m18 ----------------------------------------------------------------------------------------------------------------- */

/** m18: GitHub's former punch card, weekday × hour, a dot's area its count, on gridlines through each day. */
export function PunchCard() {
  const [ref, width] = useWidth();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const W = Math.max(240, width), top = 14 + LBL, pitch = (W - AX) / 24, rowH = Math.min(28, Math.max(18, pitch)), H = top + 7 * rowH;
  const rMax = Math.min(pitch, rowH) / 2 - 1, max = Math.max(...HOURS);
  return (
    <DataCard title="Commits by hour" meta="Last 7 days; a dot's area is its count, as GitHub's former punch card" unit="count">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Commits by weekday and hour over the last 7 days">
            {Array.from({ length: 24 }, (_, h) => h % (pitch < 24 ? 3 : 2) ? null : <text key={h} className="studio-data__axis" x={AX + h * pitch + pitch / 2} y={top - LBL} textAnchor="middle">{String(h).padStart(2, "0")}</text>)}
            {days.map((day, d) => {
              const yc = top + d * rowH + rowH / 2;
              return (
                <g key={day}>
                  <text className="studio-data__axis" x={0} y={yc} dy="0.35em">{day}</text>
                  <line className="studio-data__grid" x1={AX} x2={W} y1={yc} y2={yc} />
                  {Array.from({ length: 24 }, (_, h) => {
                    const v = HOURS[d * 24 + h]!, r = v ? Math.max(1.5, Math.sqrt(v / max) * rMax) : 0;
                    return r ? <circle key={h} cx={AX + h * pitch + pitch / 2} cy={yc} r={r} style={{ fill: S1 }}><title>{`${day} ${hhmm(h)}: ${v} commits`}</title></circle> : null;
                  })}
                </g>
              );
            })}
          </svg>
        ) : null}
      </div>
    </DataCard>
  );
}

/* m19 ----------------------------------------------------------------------------------------------------------------- */

/** Six weekly cohorts, seeded (rng 37, the page's): size, then the share still active each week since. */
const COHORTS = (() => {
  const r = rng(37);
  return Array.from({ length: 6 }, (_, i) => ({ date: new Date(2026, 8, 6 + i * 7), size: Math.round(380 + r() * 220), kept: Array.from({ length: 6 - i }, (_, w) => w === 0 ? 100 : Math.round(100 * (0.42 + 0.1 * r()) * Math.pow(0.86, w - 1))) }));
})();

/** m19: retention cohorts as heat cells on the blue ladder, numbers in them; this week isn't over, so it takes the lighter
 *  series colour and no number (PostHog leaves it unfilled). The key spans the cells' columns. */
export function Retention() {
  const [ref, width] = useWidth();
  const weeks = COHORTS.length, lab = 56, sizeW = 48, x0 = lab + sizeW + COL_GAP, top = 14 + LBL, ch = 24;
  const W = Math.max(240, width), cw = (W - x0 - GAP * (weeks - 1)) / weeks, H = top + weeks * (ch + GAP) - GAP;
  return (
    <DataCard title="Retention" meta="Weekly cohorts: the share still active each week after joining" unit="%">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Weekly retention cohorts">
            <text className="studio-data__axis" x={0} y={top - LBL}>Cohort</text>
            <text className="studio-data__axis" x={lab + sizeW} y={top - LBL} textAnchor="end">People</text>
            {Array.from({ length: weeks }, (_, w) => <text key={w} className="studio-data__axis" x={x0 + w * (cw + GAP) + 8} y={top - LBL}>W{w}</text>)}
            {COHORTS.map((cohort, i) => {
              const y0 = top + i * (ch + GAP);
              return (
                <g key={i}>
                  <text className="studio-data__axis" x={0} y={y0 + ch / 2} dy="0.35em">{shortDate(cohort.date)}</text>
                  <text className="studio-data__axis studio-data__axis--ink" x={lab + sizeW} y={y0 + ch / 2} dy="0.35em" textAnchor="end">{cohort.size}</text>
                  {cohort.kept.map((v, w) => {
                    const x = x0 + w * (cw + GAP), now = w === cohort.kept.length - 1 && w > 0, step = level(v / 100);
                    return now ? (
                      <rect key={w} x={x} y={y0} width={cw} height={ch} rx={corner(cw, ch)} style={{ fill: lighter(S1) }}><title>{`Joined the week of ${shortDate(cohort.date)}, week ${w}: in progress`}</title></rect>
                    ) : (
                      <g key={w}>
                        <rect x={x} y={y0} width={cw} height={ch} rx={corner(cw, ch)} style={{ fill: HEAT[step] }}><title>{`Joined the week of ${shortDate(cohort.date)}, week ${w}: ${v}%, ${Math.round(cohort.size * v / 100)} people`}</title></rect>
                        {cw >= 32 ? <text className={`studio-data__value${step >= 3 ? " studio-data__value--on" : ""}`} x={x + 8} y={y0 + ch / 2} dy="0.35em">{v}%</text> : null}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        ) : null}
      </div>
      <HeatKey x0={x0} steps={HEAT} edges={["0%", "20%", "40%", "60%", "80%", "100%"]} label="Scale from 0% to 100% retained" />
    </DataCard>
  );
}

/* m20 ----------------------------------------------------------------------------------------------------------------- */

const LIFE_KINDS = [["New", series(1)], ["Returning", series(3)], ["Resurrecting", series(2)]] as const;
/** Twelve weeks of people gained and lost, seeded (rng 43, the page's). */
const LIFE = (() => { const r = rng(43); return Array.from({ length: 12 }, (_, i) => ({ New: Math.round(120 + r() * 80 + i * 6), Returning: Math.round(260 + r() * 60 + i * 9), Resurrecting: Math.round(30 + r() * 30), Dormant: -Math.round(140 + r() * 70) })); })();
const lifeWeek = (i: number) => new Date(2026, 7, 9 + i * 7);

/** m20: people per week, gained stacked above the line (2 apart, the top one rounded), lost below in the neutral. */
export function Lifecycle() {
  const [ref, width] = useWidth();
  const W = Math.max(200, width), H = 192, top = 8, bottom = 18, N = LIFE.length;
  const maxUp = Math.max(...LIFE.map(w => w.New + w.Returning + w.Resurrecting)), maxDown = Math.max(...LIFE.map(w => -w.Dormant));
  const ticks = ticksFor(maxUp, 3), up = ticks[ticks.length - 1]!, tick = ticks[1] || 1, down = Math.ceil(maxDown / tick) * tick;
  const y = (v: number) => top + (up - v) / (up + down) * (H - top - bottom);
  const band = (W - AX) / N, bw = Math.max(2, band - GAP);
  return (
    <DataCard title="Lifecycle" meta="People per week, gained above the line, lost below" unit="people">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`People gained and lost per week over ${N} weeks`}>
            <YGrid ticks={[...ticks, -down]} y={y} x0={AX} x1={W} format={v => v < 0 ? `−${compact(-v)}` : compact(v)} />
            {LIFE.map((week, i) => {
              const x0 = AX + i * band + GAP / 2;
              let acc = 0;
              return (
                <g key={i}>
                  <title>{`Week of ${shortDate(lifeWeek(i))}: ${LIFE_KINDS.map(([name]) => `${name} +${week[name]}`).join(", ")}, Dormant −${-week.Dormant}`}</title>
                  {LIFE_KINDS.map(([name, color], k) => {
                    const v = week[name], yt = y(acc + v), hh = Math.max(0, y(acc) - yt - (acc ? GAP : 0));
                    acc += v;
                    return k === LIFE_KINDS.length - 1
                      ? <path key={name} style={{ fill: color }} d={barUp(x0, yt, bw, hh)} />
                      : <rect key={name} style={{ fill: color }} x={x0} y={yt} width={bw} height={hh} />;
                  })}
                  <path style={{ fill: OTHER }} d={barDown(x0, y(0) + GAP, bw, y(week.Dormant) - y(0) - GAP)} />
                  <rect className="studio-data__hit" x={AX + i * band} y={top} width={band} height={H - top - bottom} />
                </g>
              );
            })}
            {tickIdx(N, W - AX).map(i => <text key={i} className="studio-data__axis" x={AX + i * band + band / 2} y={H - bottom + LBL} dominantBaseline="hanging" textAnchor={anchorAt(i, N)}>{shortDate(lifeWeek(i))}</text>)}
          </svg>
        ) : null}
      </div>
      <Legend items={[...LIFE_KINDS, ["Dormant", OTHER]]} />
    </DataCard>
  );
}

/* m21 ----------------------------------------------------------------------------------------------------------------- */

const SERVICES = ["API", "Web app", "Workers", "Database", "Queue"];
const SERVICE_WORDS = { success: "Operational", warning: "Degraded", danger: "Outage" } as const;

/** m21: Statuspage's history, a service a row: its name, a day a 24 bar in the status trio (as many days as fit at 6 wide,
 *  14 to 90), its uptime at the end. */
export function StatusHistory() {
  const [ref, width] = useWidth();
  const W = Math.max(240, width), lab = nameColumn(W, SERVICES) + COL_GAP, upW = VAL_W + COL_GAP, rowH = 24, bh = 24;
  const N = Math.max(14, Math.min(90, Math.floor((W - lab - upW + GAP) / (6 + GAP)))), bw = (W - lab - upW - GAP * (N - 1)) / N;
  const H = SERVICES.length * (rowH + GAP) - GAP + LBL + 14, yb = SERVICES.length * (rowH + GAP) - GAP;
  const first = new Date(2026, 10, 1 - (N - 1)), r = rng(41);
  let incidents = 0;
  const rows = SERVICES.map((name, j) => {
    const yc = j * (rowH + GAP) + rowH / 2;
    let down = 0;
    const days = Array.from({ length: N }, (_, i) => {
      const p = r(), state = p < 0.015 ? "danger" : p < 0.05 ? "warning" : "success";
      if (state !== "success") incidents++;
      down += state === "danger" ? 0.6 : state === "warning" ? 0.05 : 0;
      const date = new Date(first); date.setDate(first.getDate() + i);
      return <rect key={i} x={lab + i * (bw + GAP)} y={yc - bh / 2} width={bw} height={bh} rx={corner(bw)} style={{ fill: STATUS[state] }}><title>{`${name}, ${shortDate(date)}: ${SERVICE_WORDS[state]}`}</title></rect>;
    });
    return (
      <g key={name}>
        <text className="studio-data__text" x={0} y={yc} dy="0.35em">{name}</text>
        {days}
        <text className="studio-data__num" x={W} y={yc} dy="0.35em" textAnchor="end">{(100 - down / N * 100).toFixed(2)}%</text>
      </g>
    );
  });
  return (
    <DataCard title="Services" meta={`Daily status, last ${N} days; ${incidents} days with incidents across ${SERVICES.length} services`} unit="days">
      <div ref={ref} className="studio-data__plot">
        {width ? (
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Five services' daily status over ${N} days`}>
            {rows}
            <text className="studio-data__axis" x={lab} y={yb + LBL} dominantBaseline="hanging">{N} days ago</text>
            {W - lab - upW >= (`${N} days ago`.length + 5) * 6.7 + 16 ? <text className="studio-data__axis" x={W - upW} y={yb + LBL} dominantBaseline="hanging" textAnchor="end">Today</text> : null}
            <text className="studio-data__axis" x={W} y={yb + LBL} dominantBaseline="hanging" textAnchor="end">Uptime</text>
          </svg>
        ) : null}
      </div>
      <Legend items={(["success", "warning", "danger"] as const).map(state => [SERVICE_WORDS[state], STATUS[state]] as const)} />
    </DataCard>
  );
}
