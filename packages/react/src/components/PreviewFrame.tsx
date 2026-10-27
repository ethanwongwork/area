// PreviewFrame (deprecated 2026-10-26): the well at the head of an inspector that shows the selected item. Folded into
// AssetCard: a containerless AssetCard with no name is the frame alone (aspect square, landscape or wide; fill checker for
// transparency; color to paint it). Kept so existing markup keeps working. Spec: docs/specs/preview-frame.md.
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

/** @deprecated Use `<AssetCard container="containerless">` with no `name`: the frame alone (owner, 2026-10-26). */
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
