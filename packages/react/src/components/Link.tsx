// Link: goes somewhere, inline in running text or standalone. It keeps the type it sits in and adds
// an underline. Spec: docs/specs/link.md.
// `as="button"` is the same text for a place with no address (a step in a flow, the rest of a list, a row a
// reference names): a native button, so it is pressed with Space and Enter and never claims to be a URL.
import { useSystemDefault } from "./SystemDefaults.tsx";
import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref, RefAttributes } from "react";
import { linkVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

type LinkVariants = VariantProps<typeof MANIFESTS.link>;

export type LinkProps = {
  /** `inline` is always underlined, for links in running text; `standalone` is underlined on hover and focus. */
  variant?: LinkVariants["variant"];
  /**
   * `inherit` takes the surrounding text's ink; `muted` the muted ink; `action` the Action role (neutral until a
   * theme makes actions the accent); `blue` the link blue of product UI; `purple`, `pink`, `green`, `red`, `orange`,
   * `brown` the readable ink of that hue (a color, not a status). Gray is `muted`.
   */
  ink?: LinkVariants["ink"];
} & (
  | (AnchorHTMLAttributes<HTMLAnchorElement> & {
    /**
     * The element: `a`, a link with an address; `button`, a place with no address, a native button drawn as the link.
     * @default "a"
     */
    as?: "a";
    /**
     * Leaves the site: opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"` unless set),
     * shows the external mark and tells assistive tech it opens a new tab.
     */
    external?: boolean;
    /** The announcement for `external`. Default "(opens in a new tab)". */
    newTabLabel?: string;
  })
  // `external` needs an address, so it is the anchor's alone. A button form is always `type="button"`.
  | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & { as: "button" })
);
type ButtonForm = Extract<LinkProps, { as: "button" }>;
type AnchorForm = Exclude<LinkProps, { as: "button" }>;

export const Link = forwardRef<HTMLAnchorElement | HTMLButtonElement, LinkProps>(function Link(props, ref) {
  let { variant, ink } = props;
  // The system's defaults (SystemDefaults) where the use gives none.
  variant = useSystemDefault("link", "variant", variant, linkVariants.manifest.variants.variant);
  ink = useSystemDefault("link", "ink", ink, linkVariants.manifest.variants.ink);
  if (props.as === "button") {
    const { as: _, variant: __, ink: ___, className, ...rest } = props;
    return <button {...rest} type="button" ref={ref as Ref<HTMLButtonElement>} className={linkVariants({ variant, ink }, className)} />;
  }
  const { as: _, variant: __, ink: ___, external, newTabLabel = "(opens in a new tab)", className, children, target, rel, ...rest } = props;
  return (
    <a
      ref={ref as Ref<HTMLAnchorElement>}
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
}) as {
  (props: ButtonForm & RefAttributes<HTMLButtonElement>): ReactNode;
  (props: AnchorForm & RefAttributes<HTMLAnchorElement>): ReactNode;
};

export { linkVariants };
