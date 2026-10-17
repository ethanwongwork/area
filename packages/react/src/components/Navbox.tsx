// Navbox: related pages grouped under one title, collapsible, at the foot of an article (Wikipedia's navbox).
// docs/specs/navbox.md.
import { forwardRef, useId, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx, navboxVariants } from "../variants.ts";
import { Button } from "./Button.tsx";

export interface NavboxProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The topic the links share. */
  title: ReactNode;
  /** Open (controlled). */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** The toggle's labels, "Hide" and "Show" by default. */
  hideLabel?: string;
  showLabel?: string;
  /** `NavboxGroup`s. */
  children?: ReactNode;
}

export const Navbox = /* @__PURE__ */ forwardRef<HTMLElement, NavboxProps>(function Navbox(
  { title, expanded: expandedProp, defaultExpanded = true, onExpandedChange, hideLabel = "Hide", showLabel = "Show", className, children, ...rest },
  ref,
) {
  const id = useId();
  const [local, setLocal] = useState(defaultExpanded);
  const expanded = expandedProp ?? local;
  const toggle = () => { if (expandedProp === undefined) setLocal(!expanded); onExpandedChange?.(!expanded); };
  return (
    <nav ref={ref} className={navboxVariants(undefined, className)} aria-labelledby={`${id}-title`} {...rest}>
      <div className={navboxVariants.element("header")}>
        <div className={navboxVariants.element("title")} id={`${id}-title`}>{title}</div>
        <Button className={navboxVariants.element("toggle")} variant="ghost" size="sm" aria-expanded={expanded} aria-controls={`${id}-body`} onClick={toggle}>
          {expanded ? hideLabel : showLabel}
        </Button>
      </div>
      <div className={navboxVariants.element("body")} id={`${id}-body`} hidden={!expanded}>{children}</div>
    </nav>
  );
});

export interface NavboxGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** The group's name, at the start of its row. Omit it and the links take the whole row. */
  label?: ReactNode;
  /** The links, usually an `InlineList`. */
  children?: ReactNode;
}

export const NavboxGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, NavboxGroupProps>(function NavboxGroup(
  { label, className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx(navboxVariants.element("group"), className)} {...rest}>
      {label ? <div className={navboxVariants.element("label")}>{label}</div> : null}
      <div className={navboxVariants.element("list")}>{children}</div>
    </div>
  );
});

export { navboxVariants };
