/**
 * How a setting's choices are drawn on their choice cards (Radio and Checkbox `layout="preview"`), kept apart from the
 * stage's large visual (owner, 2026-10-21: "i like the mini ui ... i want to separate the choices from the visual. so
 * the choices can be mostly mini ui, actual color swatches, or abstract/simple examples that display the choice. they
 * should be consistent, cohesive, simple visuals that convey the choice well"). Three kinds:
 *
 *   mini     a tiny window from real tokens (Untitled UI's theme cards, macOS Appearance): every colour, ground,
 *            layer, emphasis, contrast and density setting, where the choice is how a whole screen reads
 *   swatch   the colour itself, a row of Color swatch picker circles (the accent)
 *   mark     one simple example drawn from the option's tokens at true size, where the change is one property a
 *            thumbnail cannot show at its size: a corner, a line, a lift, a state's plate, a ring, "Aa" at the
 *            size, a shape as a pill, a dot moving at the speed (Radix's theme panel)
 *
 * Every drawing sits in the option's own scope, over the picks so far, and is shown, not used: inert and hidden from
 * assistive tech; the card's label names the choice.
 */
import type { ReactNode } from "react";
import { Abstract, Scaled } from "./abstract.tsx";
import { SHOWCASE, ScreenFigure } from "./setup-screen.tsx";
import { SettingSpecimen } from "./setting-preview.tsx";

export type ChoiceKind = "mini" | "swatch" | "mark";
const MINI = new Set(["theme", "neutral", "tint-light", "tint-dark", "ink-tint", "ground-light", "ground-dark", "layers-light", "layers-dark", "card-tone-light", "card-tone-dark", "action", "selection", "contrast", "density"]);
export const kindOf = (axis: string): ChoiceKind => axis === "accent" || axis === "tint-hue" || axis === "tint-hue-dark" ? "swatch" : MINI.has(axis) ? "mini" : "mark";
/** A preview frame's ratio by kind: a window is landscape; a mark sits in a shorter frame, a text-like mark shorter still. */
export const ratioOf = (axis: string) => kindOf(axis) === "mini" ? "4 / 3" : axis === "type" || axis === "motion" || axis === "easing" ? "2 / 1" : "3 / 2";

/** The shadow a setting draws: its own token, so the glyph's square lifts exactly as the setting's surfaces do. */
const SHADOW: Record<string, string> = {
  "shadow-rest": "var(--area-shadow-edge)", "shadow-resting": "var(--area-shadow-resting)", "shadow-field": "var(--area-shadow-field)",
  "shadow-hover": "var(--area-shadow-lift)", elevation: "var(--area-shadow-float)", "shadow-size": "var(--area-shadow-float)",
  "shadow-softness": "var(--area-shadow-float)", "shadow-light": "var(--area-shadow-float)", "shadow-color": "var(--area-shadow-float)",
};

/** The glyph: one mark, the setting's property and nothing else, drawn in the option's tokens (studio.css, "Choice glyphs"). */
function Glyph({ axis }: { axis: string }): ReactNode {
  switch (axis) {
    case "accent": return <span className="cv-swatch cv-swatch--accent" />;
    case "action":
    // Accent strength and Solid paint the accent's solid (axes/accent.ts), as Action Accent does.
    case "accent-strength":
    case "solid-light":
    case "solid-dark": return <span className="cv-bar cv-bar--action" />;
    // Label tint: an accent button with its label; Status colours: danger, warning and success fills.
    case "label-tint": return <span className="cv-bar cv-bar--action cv-bar--label">Aa</span>;
    case "status-colours": return <span className="cv-steps cv-steps--status"><i /><i /><i /></span>;
    case "series-lightness": return <span className="cv-steps cv-steps--series"><i /><i /><i /></span>;
    case "selection": return <span className="cv-check" />;
    case "neutral": return <span className="cv-steps"><i className="cv-step--page" /><i className="cv-step--subtle" /><i className="cv-step--edge" /><i className="cv-step--muted" /></span>;
    case "theme":
    case "ground-light":
    case "ground-dark": return <span className="cv-ground"><i /></span>;
    case "layers-light":
    case "layers-dark": return <span className="cv-layers"><i><b /></i></span>;
    case "contrast": return <span className="cv-lines"><i className="cv-line--card" /><i className="cv-line--divider" /><i className="cv-line--control" /></span>;
    case "type": return <span className="cv-type">Aa</span>;
    case "density": return <span className="cv-rows"><i /><i /><i /></span>;
    case "radius": return <span className="cv-corner" />;
    case "pills": return <span className="cv-bar cv-bar--pill" />;
    case "surface": return <span className="cv-square cv-square--edge" />;
    case "stroke": return <span className="cv-lines"><i className="cv-line--card" /><i className="cv-line--divider" /><i className="cv-line--control" /></span>;
    case "stroke-hover": return <span className="cv-pair"><span className="cv-square cv-square--control" /><span className="cv-square cv-square--hover" /></span>;
    case "selected-stroke": return <span className="cv-square cv-square--selected" />;
    case "selected-tint": return <span className="cv-square cv-square--selected cv-square--tint" />;
    case "focus-ring": return <span className="cv-square cv-square--focus" />;
    case "fill-hover":
    case "fill-selected":
    case "danger-hover": return <span className="cv-plates"><i className="cv-plate--rest" /><i className="cv-plate--danger" /></span>;
    case "fill-pressed": return <span className="cv-plates"><i className="cv-plate--rest" /><i className="cv-plate--hover" /><i className="cv-plate--selected" /><i className="cv-plate--pressed" /></span>;
    case "motion":
    case "easing": return <span className="cv-track"><i /></span>;
    default: return SHADOW[axis] ? <span className="cv-square cv-square--lift" style={{ boxShadow: SHADOW[axis] }} /> : <span className="cv-square cv-square--edge" />;
  }
}

/** A tiny window from real tokens: a sidebar with a selected row, a header with an action, a card holding a field. */
export function MiniUI(): ReactNode {
  return (
    <div className="cv-mini" aria-hidden="true">
      <div className="cv-mini__side" data-area-ground="recessed">
        <i className="cv-mini__row cv-mini__row--current" /><i className="cv-mini__row" /><i className="cv-mini__row" />
      </div>
      <div className="cv-mini__main">
        <div className="cv-mini__head"><b /><span className="cv-mini__action" /></div>
        <div className="cv-mini__card" data-area-ground="raised">
          <b /><i />
          <span className="cv-mini__line"><span className="cv-mini__check" /><span className="cv-mini__field" /></span>
        </div>
        <div className="cv-mini__menu"><i /><i className="cv-mini__row--current" /><i /></div>
      </div>
    </div>
  );
}

/** The mark: one simple example of the property, at true size. */
function Mark({ axis, preset }: { axis: string; preset: string }): ReactNode {
  // A shape as a pill: the real component, fitted to the plate (Abstract's own drawing of it).
  return <span className="cv-mark" aria-hidden="true">{axis === "pills" ? <Abstract axis="pills" preset={preset} whole /> : <Glyph axis={axis} />}</span>;
}

/**
 * One choice's picture on its card, real UI only for now (owner, 2026-10-30: "stop using the abstract illustrations for now
 * and just use real ui and components"): a setting that changes how a whole screen reads draws the Workspace showcase
 * (setup-screen.tsx), and the rest the real component the setting changes, the Playground's first tile for it
 * (setting-preview.tsx), fitted to the card. The mini window and the glyphs stay below for when the figures return.
 */
export function ChoicePreview({ axis }: { axis: string; preset: string }): ReactNode {
  return kindOf(axis) === "mini"
    ? <ScreenFigure className="cv-screen" hold={SHOWCASE} scope={{}} />
    : <Scaled fill={0.84} max={1} group={`choice-${axis}`}><SettingSpecimen setting={axis} /></Scaled>;
}
/** The figures' picture, kept for when they return (setup-screen.tsx FIGURES). */
export function ChoiceFigure({ axis, preset }: { axis: string; preset: string }): ReactNode {
  return kindOf(axis) === "mini"
    ? <Scaled fill={0.84} max={1} group="choice-mini"><MiniUI /></Scaled>
    : <Mark axis={axis} preset={preset} />;
}
