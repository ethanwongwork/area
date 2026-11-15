// File image: the figure a file browser draws for an image or a photo, Folder's and File page's sibling (owner, round 56:
// "can you create an image version of these larger illustrations?"). A landscape frame in the family's square box: the
// picture covering it, or, with none, a landscape drawn in the frame (two hills and a sun). Spec: docs/specs/file-image.md.
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { fileImageVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type FileImageVariants = VariantProps<typeof MANIFESTS.fileImage>;

/* The drawn landscape in a 400 × 300 frame: two hills rising from the foot and a sun at the upper end. */
const HILLS = "M44 262L148 150Q156 141 164 150L236 230M206 196L262 142Q270 134 278 142L356 222";
const SUN = { cx: 288, cy: 92, r: 26 } as const;

export interface FileImageProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** sm 48, md 64, lg 96, as Folder and File page. Unset, it follows `--area-folder-size` (a File tile's figure). */
  size?: FileImageVariants["size"];
  /** @deprecated Ignored: the frame is always the outline one. */
  variant?: "outline" | "solid";
  /** The picture (a thumbnail URL): it covers the frame, cropped. Without one, a landscape is drawn. */
  src?: string;
  /** The figure's accessible name. Without one the figure is decorative (a tile's name says what it is). */
  "aria-label"?: string;
}

export const FileImage = /* @__PURE__ */ forwardRef<HTMLSpanElement, FileImageProps>(function FileImage(
  { size, variant: _variant, src, "aria-label": name, className, ...rest }, ref,
) {
  return (
    <span ref={ref} className={fileImageVariants({ size }, className)}
      role={name ? "img" : undefined} aria-label={name} aria-hidden={name ? undefined : "true"} {...rest}>
      <span className="area-file-image__figure">
        {src ? <img className="area-file-image__picture" src={src} alt="" loading="lazy" decoding="async" draggable={false} /> : (
          <svg viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path className="area-file-image__scene" d={HILLS} />
            <circle className="area-file-image__scene" {...SUN} />
          </svg>
        )}
      </span>
    </span>
  );
});

export { fileImageVariants };
