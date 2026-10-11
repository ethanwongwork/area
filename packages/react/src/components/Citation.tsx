// Citation: a source pill inside generated text (ChatGPT's answer citations). docs/specs/citation.md.
import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cx } from "../variants.ts";

export interface CitationProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  /** The source's short name, shown in the pill ("Engadget"). Cut at 15 characters. */
  label: string;
  /** The page's title, added to the accessible name. */
  title?: string;
  /** The site's icon: a favicon URL or a 12px element. */
  icon?: string | ReactNode;
  /** More sources behind this one, shown as "+N". */
  more?: number;
}

/**
 * A link to a source, set in the text it supports. It opens the source in a new tab; wrap it in a
 * HoverCard to preview the page.
 */
export const Citation = /* @__PURE__ */ forwardRef<HTMLAnchorElement, CitationProps>(function Citation(
  { label, title, icon, more = 0, className, target = "_blank", rel = "noopener noreferrer", "aria-label": ariaLabel, ...rest },
  ref,
) {
  const extra = more > 0 ? `, ${more} more source${more === 1 ? "" : "s"}` : "";
  return (
    <a ref={ref} className={cx("area-citation", className)} target={target} rel={rel}
      aria-label={ariaLabel ?? `${label}${title ? `: ${title}` : ""}${extra}`} {...rest}>
      {icon ? <span className="area-citation__icon" aria-hidden="true">{typeof icon === "string" ? <img src={icon} alt="" /> : icon}</span> : null}
      <span className="area-citation__label">{label}</span>
      {more > 0 ? <span className="area-citation__count" aria-hidden="true">{`+${more}`}</span> : null}
    </a>
  );
});
