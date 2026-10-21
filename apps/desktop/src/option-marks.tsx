/**
 * What each setting's option sets, drawn in its list row and, for the chosen one, in the trigger (owner, 2026-10-18:
 * "see more visibly what each change means"; docs/research/settings-pickers-2026-10-18: shadcn Create draws the chosen
 * value at the end of its setting row, tweakcn draws each preset's colours in its option).
 *
 * Colours are Area's Color swatch painted by the real token under the option's own scope, so a swatch is the colour the
 * Canvas will paint with that option (`data-area-accent="teal"` → `--area-accent-solid`), against the rest of the
 * Canvas's settings (an Action swatch takes the Canvas's accent; a ground, its neutral). Shapes and numbers are marks
 * in the option's icon slot, drawn from the same tokens under the option's scope where one exists (Surface's frame,
 * Elevation's shadow, Contrast's edge) and from the setting's own number where the value is a size (Density, Radius,
 * Motion). They sit in the slot (Menu's and Custom select's icon box), so they follow the app's scale, and keep to the
 * icons' keylines inside it, as a glyph does (owner, 2026-10-19: the swatch read very large beside the other marks):
 * squares 12, wide marks 14 × 10 at most.
 */
import type { CSSProperties, ReactNode } from "react";
import { ColorSwatch } from "@area/react";
import type { CanvasAxes } from "./studio.tsx";
import { AXES } from "./tokens.ts";

/** An Easing value's move curve (`--area-ease-in-out`, the registry's), as a path across the mark's box. */
function curve(value: string) {
  const preset = AXES.find(axis => axis.id === "easing")?.presets.find(entry => entry.id === value);
  const [x1, y1, x2, y2] = (preset?.tokens["--area-ease-in-out"]?.match(/-?[\d.]+/g) ?? ["0", "0", "1", "1"]).map(Number);
  // A 16 box with a 2 margin; y grows upward, and an overshoot rises past the top, as it does on the Canvas.
  const at = (x: number, y: number) => `${2 + x! * 12} ${14 - y! * 12}`;
  return <svg className="studio-mark studio-mark--curve" viewBox="0 0 16 16" aria-hidden="true"><path d={`M${at(0, 0)} C${at(x1!, y1!)} ${at(x2!, y2!)} ${at(1, 1)}`} /></svg>;
}

type Axis = keyof CanvasAxes;

/**
 * A swatch of one token, painted under `scope`. The swatch is sized by the slot (Color swatch takes the icon keyline
 * there, color.css). Its ring outlines it on the list's ground, so the ring is the Inspector's, read on the wrapper
 * before the scope: a Dark ground swatch scoped dark drew dark's white ring in a light Inspector.
 */
const swatch = (color: string, scope: Record<string, string | undefined>) => (
  <span className="studio-mark studio-mark--host" aria-hidden="true">
    <ColorSwatch size="sm" color={color} aria-hidden="true" className="studio-mark__swatch" {...scope} />
  </span>
);

/**
 * The mark for one option of one setting, or nothing where the label already is the value (Type's sizes) or the
 * option names a part (Pills' components).
 */
export function optionMark(axis: Axis, value: string, canvas: CanvasAxes): ReactNode {
  const neutral = { "data-area-neutral": canvas.neutral };
  switch (axis) {
    case "neutral": return swatch("var(--area-neutral-500)", { "data-area-neutral": value });
    case "accent": return swatch("var(--area-accent-solid)", { "data-area-accent": value });
    case "action": return swatch("var(--area-action-solid)", { ...neutral, "data-area-accent": canvas.accent, "data-area-action": value });
    case "selection": return swatch("var(--area-selection-solid)", { ...neutral, "data-area-accent": canvas.accent, "data-area-selection": value });
    case "ground-light": return swatch("var(--area-bg-page)", { ...neutral, "data-area-theme": "light", "data-area-ground-light": value });
    case "ground-dark": return swatch("var(--area-bg-page)", { ...neutral, "data-area-theme": "dark", "data-area-ground-dark": value });
    // The page with a recessed strip (a sidebar, bg-subtle) and a raised card (bg-surface) in the option's layer
    // contrast: in light the strip steps (100 + 4: 1 → 0.976), in dark the card (8 + 4: 0.085 → 0.18); 0 is one tone.
    case "layers-light":
    case "layers-dark": {
      const theme = axis === "layers-light" ? "light" : "dark";
      return (
        <span className="studio-mark studio-mark--host" aria-hidden="true">
          <span className="studio-mark studio-mark--layers" data-area-theme={theme} {...neutral}
            {...{ [`data-area-ground-${theme}`]: canvas[`ground-${theme}` as const], [`data-area-${axis}`]: value }}>
            <span className="studio-mark__recessed" />
            <span className="studio-mark__raised" />
          </span>
        </span>
      );
    }
    // A field's edge: Contrast More strengthens it (edge-control → stroke-control). System writes nothing.
    case "contrast": return <span className="studio-mark studio-mark--edge" aria-hidden="true" data-area-contrast={value === "system" ? undefined : value} />;
    // The medium Button's height at type 14, to scale: the tallest, 36, is 10, the horizontal keyline's height, so
    // the mark keeps to Radius's 13 × 10 (was 36 → 14, a 32 drew a 13 × 12.4 near-square past the square keyline).
    case "density": {
      const height = (Number(value) / 36) * 10;
      return <svg className="studio-mark" viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y={8 - height / 2} width="13" height={height} rx="2.5" /></svg>;
    }
    // The medium Button's corner on a button-shaped mark 10 tall (the 32 Button at 10/32), Pill a stadium. 13 wide, as
    // Density's, so its ink (14.1 × 11.1) fills the icons' horizontal keyline (14 × 11) and no more (was 14.5: 15.6).
    case "radius": {
      const r = value === "pill" ? 5 : (Number(value) * 10) / 32;
      return <svg className="studio-mark" viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="3" width="13" height="10" rx={r} /></svg>;
    }
    // A card at the option's stroke width (0 flat) and at its rest shadow, each with the other at its default.
    case "surface": return <span className="studio-mark studio-mark--frame" aria-hidden="true" data-area-surface={value} />;
    // The same frame under the option's Stroke (axes/depth.ts).
    case "stroke": return <span className="studio-mark studio-mark--frame" aria-hidden="true" data-area-surface={canvas.surface} data-area-stroke={value} />;
    case "shadow-rest": return <span className="studio-mark studio-mark--frame" aria-hidden="true" data-area-surface="0" data-area-shadow-rest={value} />;
    // The interaction states (axes/states.ts, owner 2026-10-21), each drawn from its own token under the option's scope.
    // A field's edge under the pointer at the option's Hover stroke.
    case "stroke-hover": return <span className="studio-mark studio-mark--edge studio-mark--edge-hover" aria-hidden="true" data-area-stroke-hover={value} />;
    // A selected card: its edge at the option's Selected stroke, over the Canvas's Selected tint, and the other way round.
    case "selected-stroke": return <span className="studio-mark studio-mark--frame studio-mark--selected" aria-hidden="true" data-area-accent={canvas.accent} data-area-selected-stroke={value} data-area-selected-tint={canvas["selected-tint"]} />;
    case "selected-tint": return <span className="studio-mark studio-mark--frame studio-mark--selected" aria-hidden="true" data-area-accent={canvas.accent} data-area-selected-stroke={canvas["selected-stroke"]} data-area-selected-tint={value} />;
    // A field focused by the keyboard: the ring at the option's width and offset, its recolour and halo, at half scale
    // (a 2px ring 2px off a 12 mark would leave the slot).
    case "focus-ring": return <span className="studio-mark studio-mark--edge studio-mark--focus" aria-hidden="true" data-area-accent={canvas.accent} data-area-focus-ring={value} />;
    // A row's plate at the option's step, the others at the Canvas's, so each list reads its own step.
    case "fill-hover": return <span className="studio-mark studio-mark--plate" aria-hidden="true" data-area-fill-hover={value} data-area-fill-selected={canvas["fill-selected"]} data-area-fill-pressed={canvas["fill-pressed"]} style={{ "--_plate": "var(--area-bg-hover)" } as CSSProperties} />;
    case "fill-selected": return <span className="studio-mark studio-mark--plate" aria-hidden="true" data-area-fill-hover={canvas["fill-hover"]} data-area-fill-selected={value} data-area-fill-pressed={canvas["fill-pressed"]} style={{ "--_plate": "var(--area-bg-active)" } as CSSProperties} />;
    case "fill-pressed": return <span className="studio-mark studio-mark--plate" aria-hidden="true" data-area-fill-hover={canvas["fill-hover"]} data-area-fill-selected={canvas["fill-selected"]} data-area-fill-pressed={value} style={{ "--_plate": "var(--area-bg-pressed)" } as CSSProperties} />;
    // A plate lifted in proportion to the option (the Menu's shadow strength, 0 to 8): the real float shadow is too faint
    // to read on a 12 plate, so the mark's shadow grows with the number instead; 0 is flat.
    // Resting, Hover and Field shadow are each one number, so they draw the same plate (axes/depth.ts).
    case "elevation":
    case "shadow-resting":
    case "shadow-hover":
    case "shadow-field": return <span className="studio-mark studio-mark--lift" aria-hidden="true" style={{ "--_lift": value } as CSSProperties} />;
    // The Menu's open as a share of the longest, 300 ms; 0 (None) is an empty ring.
    case "motion": return <span className="studio-mark studio-mark--duration" aria-hidden="true" style={{ "--_share": `${(Number(value) / 300) * 100}%` } as CSSProperties} />;
    // The move curve each Easing draws.
    case "easing": return curve(value);
    default: return null;
  }
}
