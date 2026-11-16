// Abbreviation: a short form whose expansion shows in an Area Tooltip, on hover and on keyboard focus.
// docs/specs/abbreviation.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { abbreviationVariants, tooltipVariants } from "../variants.ts";
import { AnchoredTooltip } from "./Overlays.tsx";

export interface AbbreviationProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** What it stands for: "Bachelor of Science". Shown in the Tooltip and given to assistive tech as its description. */
  title: string;
  /** The short form as it reads in the text ("BSc"). */
  children?: ReactNode;
}

/* An abbreviation sits in running text, so its tooltip is a span: Tooltip's div would put a block inside the paragraph
   (invalid HTML, and a hydration error). Open, the popover is in the top layer and laid out as a block, so it looks
   the same as Tooltip's. */
type Surface = HTMLAttributes<HTMLSpanElement> & { ref: Ref<HTMLSpanElement> };

export const Abbreviation = /* @__PURE__ */ forwardRef<HTMLElement, AbbreviationProps>(function Abbreviation(
  { title, className, children, tabIndex = 0, ...rest },
  ref,
) {
  return (
    <AnchoredTooltip
      trigger={<abbr ref={ref} className={abbreviationVariants(undefined, className)} tabIndex={tabIndex} {...rest}>{children}</abbr>}
      surface={props => <span role="tooltip" className={tooltipVariants({})} {...(props as unknown as Surface)}>{title}</span>}
    />
  );
});

export { abbreviationVariants };
