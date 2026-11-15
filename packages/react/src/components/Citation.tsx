// Citation: links a source from the text it supports. A pill (ChatGPT's answer citations) or a footnote number
// (Wikipedia's [13]). docs/specs/citation.md.
import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { citationVariants, type VariantProps, MANIFESTS } from "../variants.ts";

type CitationVariants = VariantProps<typeof MANIFESTS.citation>;

export interface CitationProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  /** `pill` (default): the source's name in a small pill. `footnote`: a raised number in brackets. */
  variant?: CitationVariants["variant"];
  /** The pill's source name ("Engadget"), cut at 15 characters; the footnote's number or mark ("13", "a"). */
  label: string;
  /** The page's title, added to the accessible name. */
  title?: string;
  /** The site's icon (pill only): a favicon URL or a 12px element. */
  icon?: string | ReactNode;
  /** More sources behind this one, shown as "+N" (pill only). */
  more?: number;
  /**
   * A footnote's ink, as Link's: `blue` by default, or the surrounding text's, muted, or a hue.
   * @default "blue"
   */
  ink?: CitationVariants["ink"];
}

/**
 * A link to a source, set in the text it supports. A pill opens the source in a new tab; a footnote goes to its
 * note on the page. Wrap either in a HoverCard to preview the source.
 */
export const Citation = /* @__PURE__ */ forwardRef<HTMLAnchorElement, CitationProps>(function Citation(
  { variant = "pill", label, title, icon, more = 0, ink, className, target, rel, "aria-label": ariaLabel, ...rest },
  ref,
) {
  if (variant === "footnote") {
    return (
      <a ref={ref} className={citationVariants({ variant, ink: ink ?? "blue" }, className)} target={target} rel={rel}
        aria-label={ariaLabel ?? `Note ${label}${title ? `: ${title}` : ""}`} {...rest}>
        <span className={citationVariants.element("bracket")} aria-hidden="true">[</span>{label}<span className={citationVariants.element("bracket")} aria-hidden="true">]</span>
      </a>
    );
  }
  const extra = more > 0 ? `, ${more} more source${more === 1 ? "" : "s"}` : "";
  return (
    <a ref={ref} className={citationVariants({ variant, ink }, className)} target={target ?? "_blank"} rel={rel ?? "noopener noreferrer"}
      aria-label={ariaLabel ?? `${label}${title ? `: ${title}` : ""}${extra}`} {...rest}>
      {icon ? <span className="area-citation__icon" aria-hidden="true">{typeof icon === "string" ? <img src={icon} alt="" /> : icon}</span> : null}
      <span className="area-citation__label">{label}</span>
      {more > 0 ? <span className="area-citation__count" aria-hidden="true">{`+${more}`}</span> : null}
    </a>
  );
});

export { citationVariants };
