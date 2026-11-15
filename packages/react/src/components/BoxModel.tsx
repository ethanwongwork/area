// BoxModel: a read-only diagram of a layer's margin, border, padding, corner radii and size, as Figma's
// Dev Mode inspector draws it. One image to assistive technology, named by a summary of its values.
// Spec: docs/specs/box-model.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { boxModelVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type BoxModelVariants = VariantProps<typeof MANIFESTS.boxModel>;
type Value = number | string;
/** One value for every side, CSS order (top, right, bottom, left), or named sides. */
export type BoxSides = Value | readonly [Value, Value, Value, Value] | { top?: Value; right?: Value; bottom?: Value; left?: Value };
/** One radius for every corner, or top-left, top-right, bottom-right, bottom-left. */
export type BoxCorners = Value | readonly [Value, Value, Value, Value];

export interface BoxModelProps extends HTMLAttributes<HTMLDivElement> {
  /** The margin ring's values: one for every side, four in CSS order, or named sides. */
  margin?: BoxSides;
  /** The border ring's widths: one for every side, four in CSS order, or named sides. */
  border?: BoxSides;
  /** The padding ring's values: one for every side, four in CSS order, or named sides. */
  padding?: BoxSides;
  /** Corner radii, shown in the border box's corners. */
  radius?: BoxCorners;
  /** The content box's width, shown in its center as width × height. */
  width?: Value;
  /** The content box's height, shown in its center as width × height. */
  height?: Value;
  /** A note at the bottom end of the margin zone, such as "border-box". */
  caption?: ReactNode;
  /** Labels for the margin, border and padding rings. */
  labels?: { margin?: string; border?: string; padding?: string };
  /** info (default): spacing values and the padding fill in a measuring blue. neutral: greyscale. */
  tone?: BoxModelVariants["tone"];
}

const SIDES = ["top", "right", "bottom", "left"] as const;
type Side = typeof SIDES[number];
const sides = (value: BoxSides | undefined): Record<Side, Value | undefined> => {
  if (value == null || typeof value === "number" || typeof value === "string") return { top: value, right: value, bottom: value, left: value };
  if (Array.isArray(value)) { const [top, right, bottom, left] = value as readonly Value[]; return { top, right, bottom, left }; }
  return value as Record<Side, Value | undefined>;
};
const show = (value: Value | undefined) => (value == null || value === "" ? "–" : String(value));
// "24" when every side agrees, otherwise "24 16 24 16" (CSS order), for the summary.
const summary = (values: Record<Side, Value | undefined>) => {
  const list = SIDES.map(side => show(values[side]));
  return list.every(item => item === list[0]) ? list[0] : list.join(" ");
};

export const BoxModel = forwardRef<HTMLDivElement, BoxModelProps>(function BoxModel(
  { margin, border, padding, radius, width, height, caption, labels, tone, className, ...rest },
  ref,
) {
  const m = sides(margin), b = sides(border), p = sides(padding);
  const corners = radius == null ? null
    : Array.isArray(radius) ? (radius as readonly Value[]) : [radius, radius, radius, radius] as Value[];
  const size = `${show(width)} × ${show(height)}`;
  const side = (values: Record<Side, Value | undefined>, name: Side) => (
    <div key={name} className={`area-box-model__side area-box-model__side--${name}`}><span className="area-box-model__value">{show(values[name])}</span></div>
  );
  const label = [
    margin !== undefined ? `Margin ${summary(m)}` : null,
    border !== undefined ? `border ${summary(b)}` : null,
    padding !== undefined ? `padding ${summary(p)}` : null,
    corners ? `radius ${corners.every(c => c === corners[0]) ? show(corners[0]) : corners.map(show).join(" ")}` : null,
    `size ${size}`,
  ].filter(Boolean).join(", ");
  return (
    <div ref={ref} role="img" aria-label={label} {...rest} className={boxModelVariants({ tone }, className)}>
      <span className="area-box-model__label">{labels?.margin ?? "Margin"}</span>
      {SIDES.map(name => side(m, name))}
      <div className="area-box-model__border">
        <span className="area-box-model__label">{labels?.border ?? "Border"}</span>
        {corners ? (["top-left", "top-right", "bottom-right", "bottom-left"] as const).map((name, index) => (
          <div key={name} className={`area-box-model__corner area-box-model__corner--${name}`}><span className="area-box-model__value">{show(corners[index])}</span></div>
        )) : null}
        {SIDES.map(name => side(b, name))}
        <div className="area-box-model__padding">
          <span className="area-box-model__label">{labels?.padding ?? "Padding"}</span>
          {SIDES.map(name => side(p, name))}
          <div className="area-box-model__content"><span className="area-box-model__value">{size}</span></div>
        </div>
      </div>
      {caption != null ? <span className="area-box-model__caption">{caption}</span> : null}
    </div>
  );
});

export { boxModelVariants };
