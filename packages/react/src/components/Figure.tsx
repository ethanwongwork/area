// Figure: media with its caption, unframed (Notion's image block; Carbon, Tailwind Typography). docs/specs/figure.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { figureVariants } from "../variants.ts";

export interface FigureProps extends HTMLAttributes<HTMLElement> {
  /** The caption, wrapped to the media's width. Optional. */
  caption?: ReactNode;
  /** The media: an img, an svg, an embed. Give an img its alt text. */
  children?: ReactNode;
}

export const Figure = /* @__PURE__ */ forwardRef<HTMLElement, FigureProps>(function Figure(
  { caption, className, children, ...rest },
  ref,
) {
  return (
    <figure ref={ref} className={figureVariants(undefined, className)} {...rest}>
      <div className={figureVariants.element("media")}>{children}</div>
      {caption ? <figcaption className={figureVariants.element("caption")}>{caption}</figcaption> : null}
    </figure>
  );
});

export { figureVariants };
