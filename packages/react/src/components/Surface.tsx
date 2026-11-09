// Surface: a plain layer to compose a screen from. Its corner is concentric with the Surface it sits in, its layer
// steps from its parent, and it draws one edge per boundary. Spec: docs/specs/surface.md.
import { useSystemDefault } from "./SystemDefaults.tsx";
import { forwardRef } from "react";
import type { HTMLAttributes } from "react";
import { surfaceVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type SurfaceVariants = VariantProps<typeof MANIFESTS.surface>;

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * surface (default): the raised plane, Card's fill and edge, with its resting shadow only when outermost.
   * soft: a recessed well, one fill step down, no line or shadow. plain: structure only, no paint.
   */
  variant?: SurfaceVariants["variant"];
  /** Card's corner and inset: sm, md (default) or lg. A Surface holding Surfaces sets them at its smaller media inset. */
  size?: SurfaceVariants["size"];
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface({ variant, size, className, ...rest }, ref) {
  // The system's defaults (SystemDefaults) where the use gives none.
  variant = useSystemDefault("surface", "variant", variant);
  size = useSystemDefault("surface", "size", size);
  return <div ref={ref} {...rest} className={surfaceVariants({ variant, size }, className)} />;
});
