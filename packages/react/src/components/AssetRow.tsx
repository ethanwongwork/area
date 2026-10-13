// AssetRow: one exportable asset of a layer, as Figma Dev Mode's Assets list it: a preview, the asset's name, a
// detail line and an optional trailing action. Spec: docs/specs/asset-row.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { assetRowVariants } from "../variants.ts";

export interface AssetRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The asset's name ("icon/heart"). */
  name: ReactNode;
  /** A detail line: format and size ("SVG · 24 × 24"). */
  meta?: ReactNode;
  /** An image URL, or an element (an icon, a vector) drawn in the preview well. */
  preview?: string | ReactNode;
  /** The image preview's text alternative. Empty by default: the name says what it is. */
  previewAlt?: string;
  /** Trailing actions, such as a download button. */
  actions?: ReactNode;
}

export const AssetRow = /* @__PURE__ */ forwardRef<HTMLDivElement, AssetRowProps>(function AssetRow(
  { name, meta, preview, previewAlt = "", actions, className, ...rest }, ref,
) {
  return (
    <div ref={ref} className={assetRowVariants({}, className)} {...rest}>
      <span className="area-asset-row__preview" aria-hidden={typeof preview === "string" ? undefined : "true"}>
        {typeof preview === "string" ? <img src={preview} alt={previewAlt} /> : preview}
      </span>
      <span className="area-asset-row__text">
        <span className="area-asset-row__name">{name}</span>
        {meta !== undefined ? <span className="area-asset-row__meta">{meta}</span> : null}
      </span>
      {actions ? <span className="area-asset-row__actions">{actions}</span> : null}
    </div>
  );
});
