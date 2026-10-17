// Link: goes somewhere, inline in running text or standalone. It keeps the type it sits in and adds
// an underline. Spec: docs/specs/link.md.
import { forwardRef } from "react";
import type { AnchorHTMLAttributes } from "react";
import { linkVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

type LinkVariants = VariantProps<typeof MANIFESTS.link>;

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** `inline` is always underlined, for links in running text; `standalone` is underlined on hover and focus. */
  variant?: LinkVariants["variant"];
  /** `inherit` takes the surrounding text's ink; `muted` the muted ink; `action` the Action role (neutral until a theme makes actions the accent); `blue` the link blue of product UI (ChatGPT, Figma, Wikipedia); `purple`, `pink`, `green`, `red`, `orange`, `brown` the readable ink of that hue (a colour, not a status). Gray is `muted`. */
  ink?: LinkVariants["ink"];
  /**
   * Leaves the site: opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"` unless set),
   * shows the external mark and tells assistive tech it opens a new tab.
   */
  external?: boolean;
  /** The announcement for `external`. Default "(opens in a new tab)". */
  newTabLabel?: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant, ink, external, newTabLabel = "(opens in a new tab)", className, children, target, rel, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      className={linkVariants({ variant, ink }, className)}
      target={target ?? (external ? "_blank" : undefined)}
      rel={rel ?? (external ? "noopener noreferrer" : undefined)}
      {...rest}
    >
      {children}
      {external ? <>
        <span className="area-sr-only">{` ${newTabLabel}`}</span>
        <span className={linkVariants.element("icon")} aria-hidden="true"><Glyph name="open" size={12} /></span>
      </> : null}
    </a>
  );
});

export { linkVariants };
