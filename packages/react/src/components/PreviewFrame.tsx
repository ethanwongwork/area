// PreviewFrame: the well at the head of an inspector that shows the selected item: an icon large, an image contained
// whole, or a colour filling it. Spec: docs/specs/preview-frame.md.
import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import { previewFrameVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type PreviewFrameVariants = VariantProps<typeof MANIFESTS.previewFrame>;

export interface PreviewFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  /** square (default) for an icon or a component, landscape (4:3) for a layout, wide (2:1) for a colour. */
  aspect?: PreviewFrameVariants["aspect"];
  /** surface (default): the gallery tile's white frame. subtle: a grey well. checker: transparency, for an asset with alpha. */
  ground?: PreviewFrameVariants["ground"];
  /** Paints the frame with a CSS colour, over the checker so its alpha shows. */
  color?: string;
  /** Names the preview for assistive technology: role="img", whose content is presentational. */
  label?: string;
}

export const PreviewFrame = /* @__PURE__ */ forwardRef<HTMLDivElement, PreviewFrameProps>(function PreviewFrame(
  { aspect, ground, color, label, className, style, children, ...rest }, ref,
) {
  return (
    <div ref={ref} className={previewFrameVariants({ aspect, ground }, className)}
      role={label ? "img" : undefined} aria-label={label}
      style={color ? { ...style, "--_color": color } as CSSProperties : style} {...rest}>
      {color ? <span className="area-preview-frame__paint" /> : null}
      {children}
    </div>
  );
});
