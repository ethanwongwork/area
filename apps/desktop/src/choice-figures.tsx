/**
 * A setting's choice as a figure: the picture a grid list draws over each option's label (Custom select
 * `layout="grid"`, owner 2026-10-23; docs/research/theme-visuals-2026-10-23). Drawn in Folder and File page's outline
 * look (folder.css; owner, 2026-10-21: "the simplified look" of Area's file figures): the control fill, a thin edge,
 * quiet ink for text, the page as ground, no shadow of its own. Where the glyph exaggerates, the figure is true: every
 * colour, line, corner and shadow is the token itself under the Canvas's settings and the option's own scope, at a size
 * where it can show (a sidebar's tone over a third of the frame, a card's shadow under a card).
 *
 * Each figure isolates the one region its setting moves (a corner, a strip, a card's edge or lift, a row's plate) and
 * bars stand for text (choice-illustrations round 12's semi-abstract text). Shown, not used: the option's label names
 * the choice, so the figure is hidden from assistive tech by the list (aria-hidden on its frame).
 */
import type { CSSProperties, ReactNode } from "react";
import { materialAttributes } from "./material.ts";
import { canvasAttributes, type CanvasAxes } from "./studio.tsx";
import { AXES } from "./tokens.ts";

type Axis = keyof CanvasAxes;
type Scope = Record<string, string | undefined>;

const Bar = ({ width, strong = false }: { width: number; strong?: boolean }) => <i className={strong ? "cf-bar cf-bar--strong" : "cf-bar"} style={{ inlineSize: `${width}%` }} />;
const Bars = ({ widths }: { widths: number[] }) => <>{widths.map((width, i) => <Bar key={i} width={width} />)}</>;
const Card = ({ className = "", style, children }: { className?: string; style?: CSSProperties; children?: ReactNode }) =>
  <div className={`cf-card ${className}`} style={style}>{children}</div>;

/** A window: a sidebar strip, a title, a card holding a field. Layers, ground, neutral and tint all read on it. */
const Window = () => (
  <div className="cf-window">
    <div className="cf-side"><Bars widths={[70, 54, 62]} /></div>
    <div className="cf-main"><Bar width={46} strong /><Card><Bars widths={[64, 44]} /><span className="cf-field cf-field--mini" /></Card></div>
  </div>
);
/** A floating menu over the page: rows, one highlighted, its lift the Floating shadow. */
const FloatingMenu = () => (
  <div className="cf-page cf-center"><div className="cf-menu cf-menu--float">{[60, 48, 54].map((width, i) => <div key={i} className={`cf-row ${i === 1 ? "cf-row--hover" : ""}`}><Bar width={width} /></div>)}</div></div>
);
const CURVES = Object.fromEntries((AXES.find(axis => axis.id === "easing")?.presets ?? []).map(preset => [preset.id, (preset.tokens["--area-ease-in-out"]?.match(/-?[\d.]+/g) ?? ["0", "0", "1", "1"]).map(Number)]));

function draw(axis: Axis | "material", value: string): ReactNode {
  switch (axis) {
    // A corner close up, at 2x (owner, 2026-10-23, after Practical UI's "outer radius = inner radius + padding" and a
    // corner-radius panel's radius circles): a list's corner around its row's, 4 apart, so the outer is the inner plus
    // the inset (radius-list, radius-list-row). Each corner's circle shows its radius; the row's is outlined in the
    // selected stroke. At Sharp the circles are gone; at Pill the row's circle is its whole end.
    case "radius": return (
      <div className="cf-corner">
        <div className="cf-corner__outer">
          <span className="cf-corner__circle cf-corner__circle--outer" />
          <div className="cf-corner__inner"><span className="cf-corner__circle" /></div>
        </div>
      </div>
    );
    // Rows at the density's row height (scaled so three fit), the first highlighted.
    case "density": return <div className="cf-center"><div className="cf-list">{[56, 44, 50].map((width, i) => <div key={i} className={`cf-row cf-row--dense ${i === 0 ? "cf-row--active" : ""}`}><i className="cf-dot" /><Bar width={width} /></div>)}</div></div>;
    case "neutral":
    case "tint-light":
    case "tint-dark":
    case "ink-tint":
    case "layers-light":
    case "layers-dark": return <Window />;
    // The page around a card: Ground lightens or darkens the page, Card tone the card on it.
    case "ground-light":
    case "ground-dark":
    case "card-tone-light":
    case "card-tone-dark": return <div className="cf-page cf-center"><Card style={{ inlineSize: "62%" }}><Bars widths={[64, 44]} /><span className="cf-field cf-field--mini" /></Card></div>;
    // The edges Contrast strengthens: a field, a box and an outline button.
    case "contrast": return <div className="cf-center cf-stack"><span className="cf-field cf-field--edge" style={{ inlineSize: "70%", blockSize: "22%" }} /><div className="cf-pair"><span className="cf-box" /><span className="cf-outline-btn" style={{ inlineSize: "52%", blockSize: "100%" }} /></div></div>;
    case "surface": return <div className="cf-page cf-center"><Card className="cf-card--line" style={{ inlineSize: "64%", blockSize: "58%" }}><Bars widths={[60, 40]} /></Card></div>;
    case "stroke": return <div className="cf-page cf-center"><Card className="cf-card--line" style={{ inlineSize: "68%", blockSize: "64%" }}><Bar width={50} /><i className="cf-rule" /><span className="cf-field cf-field--edge" style={{ blockSize: "26%" }} /></Card></div>;
    // A field at rest beside the same field hovered.
    case "stroke-hover": return <div className="cf-center cf-pair cf-pair--split"><span className="cf-field cf-field--edge" /><span className="cf-field cf-field--edge cf-field--hover" /></div>;
    case "selected-stroke":
    case "selected-tint": return <div className="cf-page cf-center"><Card className="cf-card--selected" style={{ inlineSize: "62%", blockSize: "56%" }}><Bars widths={[60, 40]} /></Card></div>;
    case "focus-ring": return <div className="cf-page cf-center"><span className="cf-field cf-field--edge cf-field--focus" style={{ inlineSize: "68%", blockSize: "28%" }} /></div>;
    // Each lift on what it lifts: a card at rest, the same card hovered, a field and an outline button.
    case "shadow-rest": return <div className="cf-page cf-center"><Card className="cf-card--bare" style={{ inlineSize: "60%", blockSize: "56%", boxShadow: "var(--area-shadow-edge)" }}><Bars widths={[60, 40]} /></Card></div>;
    case "shadow-resting": return <div className="cf-page cf-center"><Card className="cf-card--bare" style={{ inlineSize: "60%", blockSize: "56%", boxShadow: "var(--area-shadow-resting)" }}><Bars widths={[60, 40]} /></Card></div>;
    case "shadow-hover": return <div className="cf-page cf-center"><Card className="cf-card--bare" style={{ inlineSize: "60%", blockSize: "56%", boxShadow: "var(--area-shadow-lift)" }}><Bars widths={[60, 40]} /></Card></div>;
    case "shadow-field": return <div className="cf-page cf-center cf-stack"><span className="cf-field cf-field--edge" style={{ inlineSize: "70%", blockSize: "24%", boxShadow: "var(--area-shadow-field)" }} /><span className="cf-outline-btn" style={{ inlineSize: "40%", blockSize: "22%", boxShadow: "var(--area-shadow-field)" }} /></div>;
    case "elevation":
    case "shadow-size":
    case "shadow-softness":
    case "shadow-light":
    case "shadow-color": return <FloatingMenu />;
    // A menu's rows at rest, hovered, selected and pressed; the setting's own row in firmer ink.
    case "fill-hover":
    case "fill-selected":
    case "fill-pressed": {
      const mine = { "fill-hover": "hover", "fill-selected": "active", "fill-pressed": "pressed" }[axis];
      return <div className="cf-page cf-center"><div className="cf-menu">{([["rest", 58], ["hover", 46], ["active", 52], ["pressed", 40]] as const).map(([state, width]) => <div key={state} className={`cf-row cf-row--${state} ${state === mine ? "cf-row--mine" : ""}`}><Bar width={width} /></div>)}</div></div>;
    }
    // A slider's travel as the share of the longest Motion, 300.
    case "motion": { const share = `${(Number(value) / 300) * 100}%`; return <div className="cf-center"><div className="cf-track"><i style={{ inlineSize: share }} /><b style={{ insetInlineStart: `calc(${share} - 7px)` }} /></div></div>; }
    case "easing": {
      const [x1, y1, x2, y2] = CURVES[value] ?? [0, 0, 1, 1];
      const at = (x: number, y: number) => `${10 + x * 80} ${62 - y * 50}`;
      return <svg className="cf-svg" viewBox="0 0 100 72" aria-hidden="true"><path d="M10 62H90M10 12H90" className="cf-guide" /><path d={`M${at(0, 0)} C${at(x1!, y1!)} ${at(x2!, y2!)} ${at(1, 1)}`} className="cf-curve" /><circle cx="90" cy="12" r="3.5" className="cf-end" /></svg>;
    }
    // Each part Pills can turn, drawn as a pill.
    case "pills": return <div className="cf-center">{({
      button: <span className="cf-btn cf-btn--pill" />, field: <span className="cf-field cf-field--edge cf-field--pill" />, segmented: <span className="cf-seg"><i className="cf-seg--on" /><i /><i /></span>,
      chip: <span className="cf-outline-btn cf-outline-btn--pill" />, badge: <span className="cf-badge" />, count: <span className="cf-badge cf-badge--round" />, switch: <span className="cf-switch"><b /></span>, avatar: <span className="cf-avatar" />,
    } as Record<string, ReactNode>)[value]}</div>;
    // The real Button under the look.
    case "material": return <div className="cf-page cf-center"><span className="area-button area-button--solid area-button--neutral area-button--sm cf-material"><span className="area-button__label">Button</span></span></div>;
    default: return null;
  }
}

/** The scope an option paints under, over the Canvas's: its own attribute, and the theme a per-mode setting belongs to. */
function scopeOf(axis: Axis | "material", value: string): Scope {
  if (axis === "material") return materialAttributes({ bundle: value, overrides: {} });
  if (axis === "contrast") return { "data-area-contrast": value === "system" ? undefined : value };
  if (axis === "pills") return {};
  const scope: Scope = { [`data-area-${axis}`]: value };
  const mode = axis.match(/-(light|dark)$/)?.[1];
  if (mode) scope["data-area-theme"] = mode;
  // The shadow's details show on the floating menu at Floating 8, as Browse draws them.
  if (["shadow-size", "shadow-softness", "shadow-light", "shadow-color"].includes(axis)) scope["data-area-elevation"] = "8";
  return scope;
}

/** Settings with a figure; the rest list their glyphs only. */
export const FIGURED = new Set<string>(["radius", "density", "neutral", "tint-light", "tint-dark", "ink-tint", "layers-light", "layers-dark", "ground-light", "ground-dark", "card-tone-light", "card-tone-dark",
  "contrast", "surface", "stroke", "stroke-hover", "selected-stroke", "selected-tint", "focus-ring", "shadow-rest", "shadow-resting", "shadow-hover", "shadow-field", "elevation", "shadow-size",
  "shadow-softness", "shadow-light", "shadow-color", "fill-hover", "fill-selected", "fill-pressed", "motion", "easing", "pills", "material"]);

/** One option's figure, painted under the Canvas's settings (and Material) with the option's own scope on top. */
export function choiceFigure(axis: Axis | "material", value: string, canvas: CanvasAxes, material: Parameters<typeof canvasAttributes>[1]): ReactNode {
  if (!FIGURED.has(axis)) return undefined;
  return <span className="cf" {...canvasAttributes(canvas, axis === "material" ? { bundle: "none", overrides: {} } : material)} {...scopeOf(axis, value)}>{draw(axis, value)}</span>;
}
