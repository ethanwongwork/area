// Abbreviation: a short form whose expansion shows in an Area Tooltip, on hover and on keyboard focus.
// docs/specs/abbreviation.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { abbreviationVariants } from "../variants.ts";
import { Tooltip } from "./primitives.tsx";

export interface AbbreviationProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** What it stands for: "Bachelor of Science". Shown in the Tooltip and given to assistive tech as its description. */
  title: string;
  children?: ReactNode;
}

export const Abbreviation = /* @__PURE__ */ forwardRef<HTMLElement, AbbreviationProps>(function Abbreviation(
  { title, className, children, tabIndex = 0, ...rest },
  ref,
) {
  return (
    <Tooltip trigger={<abbr ref={ref} className={abbreviationVariants(undefined, className)} tabIndex={tabIndex} {...rest}>{children}</abbr>}>
      {title}
    </Tooltip>
  );
});

export { abbreviationVariants };
