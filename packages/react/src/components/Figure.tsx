// Figure: media with its caption (Wikipedia's thumbnail; Notion's image block). docs/specs/figure.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { figureVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type FigureVariants = VariantProps<typeof MANIFESTS.figure>;

export interface FigureProps extends HTMLAttributes<HTMLElement> {
  /** `plain`: the media alone with a muted caption under it. `framed`: Wikipedia's thumbnail frame. */
  frame?: FigureVariants["frame"];
  /** Beside the text: floated to the `end` or `start` of the line, as Wikipedia's thumbnails. */
  align?: FigureVariants["align"];
  /** The caption, wrapped to the media's width. */
  caption?: ReactNode;
  /** The media: an img, a video, an svg. Give an img its alt text. */
  children?: ReactNode;
}

export const Figure = /* @__PURE__ */ forwardRef<HTMLElement, FigureProps>(function Figure(
  { frame, align, caption, className, children, ...rest },
  ref,
) {
  return (
    <figure ref={ref} className={figureVariants({ frame, align }, className)} {...rest}>
      <div className={figureVariants.element("media")}>{children}</div>
      {caption ? <figcaption className={figureVariants.element("caption")}>{caption}</figcaption> : null}
    </figure>
  );
});

export { figureVariants };
