import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import { colorSwatchVariants, type VariantProps, MANIFESTS } from "../variants.ts";

export interface ColorSwatchProps extends HTMLAttributes<HTMLSpanElement> {
  /** The CSS color it shows; a transparent one shows the checkerboard through it. */
  color: string;
  /** The swatch's size: `md` (default), `sm` or `lg`. */
  size?: VariantProps<typeof MANIFESTS.colorSwatch>["size"];
}

/** A passive color preview. Transparency paints over a semantic checkerboard. */
export const ColorSwatch = forwardRef<HTMLSpanElement, ColorSwatchProps>(function ColorSwatch(
  { color, size, className, style, "aria-label": ariaLabel, ...rest }, ref,
) {
  return <span ref={ref} role="img" aria-label={ariaLabel ?? `Color ${color}`}
    className={colorSwatchVariants({ size }, className)}
    style={{ ...style, "--_swatch-color": color } as CSSProperties} {...rest} />;
});
