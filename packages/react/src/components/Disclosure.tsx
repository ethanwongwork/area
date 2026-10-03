// Disclosure and DisclosureGroup: a title that shows or hides its content, and a stack of them
// (an accordion). Spec: docs/specs/disclosure.md.
import { createContext, forwardRef, useContext, useEffect, useId, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { disclosureGroupVariants, disclosureVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

type DisclosureVariants = VariantProps<typeof MANIFESTS.disclosure>;
type HeadingLevel = 2 | 3 | 4 | 5 | 6;

interface GroupContext {
  variant?: DisclosureVariants["variant"];
  size?: DisclosureVariants["size"];
  headingLevel?: HeadingLevel;
  isOpen: (value: string) => boolean;
  setOpen: (value: string, open: boolean) => void;
}
const DisclosureGroupContext = createContext<GroupContext | null>(null);

export interface DisclosureProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onToggle"> {
  /** The title the reader clicks. It names the trigger button. */
  heading: ReactNode;
  /** Controlled open state. In a DisclosureGroup the group owns it instead. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** This item's key in a DisclosureGroup's `value`. Defaults to a generated id. */
  value?: string;
  /** Wraps the trigger in a heading of this level (a DisclosureGroup defaults to 3). */
  headingLevel?: HeadingLevel;
  disabled?: boolean;
  variant?: DisclosureVariants["variant"];
  size?: DisclosureVariants["size"];
}

export const Disclosure = forwardRef<HTMLDivElement, DisclosureProps>(function Disclosure(
  { heading, open: openProp, defaultOpen = false, onOpenChange, value: valueProp, headingLevel, disabled, variant, size, className, children, ...rest },
  ref,
) {
  const group = useContext(DisclosureGroupContext);
  const id = useId();
  const value = valueProp ?? id;
  const [openState, setOpenState] = useState(defaultOpen);
  const open = group ? group.isOpen(value) : openProp ?? openState;
  const setOpen = (next: boolean) => {
    if (group) group.setOpen(value, next);
    else if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  };
  const contentRef = useRef<HTMLDivElement>(null);
  // Closed content renders `hidden` on the server and becomes `until-found` once mounted, so the
  // browser's find-in-page can reveal it; a match opens the disclosure.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    if (open) { content.removeAttribute("hidden"); return; }
    content.setAttribute("hidden", "until-found");
    const reveal = () => setOpen(true);
    content.addEventListener("beforematch", reveal);
    return () => content.removeEventListener("beforematch", reveal);
  });
  const level = headingLevel ?? group?.headingLevel;
  const H = level ? (`h${level}` as "h3") : null;
  const triggerId = `${id}-trigger`;
  const contentId = `${id}-content`;
  const trigger = (
    <button id={triggerId} type="button" className="area-disclosure__trigger" aria-expanded={open} aria-controls={contentId}
      disabled={disabled} onClick={() => setOpen(!open)}>
      <span className="area-disclosure__chevron" aria-hidden="true"><Glyph name="chevron-down" /></span>
      <span className="area-disclosure__label">{heading}</span>
    </button>
  );
  return (
    <div ref={ref} {...rest} className={disclosureVariants({ variant: variant ?? group?.variant, size: size ?? group?.size }, className)}
      data-open={open ? "" : undefined} data-disabled={disabled ? "" : undefined}>
      {H ? <H className="area-disclosure__heading">{trigger}</H> : trigger}
      {/* In a group each panel is a region named by its trigger (WAI accordion). */}
      <div ref={contentRef} id={contentId} className="area-disclosure__content" hidden={!open}
        {...(group ? { role: "region", "aria-labelledby": triggerId } : {})}>
        {children}
      </div>
    </div>
  );
});

export interface DisclosureGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Let any number stay open. By default opening one closes the others. */
  multiple?: boolean;
  /** Controlled open items, by each Disclosure's `value`. */
  value?: string[];
  /** Initially open items when uncontrolled. */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Heading level for every item's trigger (WAI accordion). */
  headingLevel?: HeadingLevel;
  variant?: DisclosureVariants["variant"];
  size?: DisclosureVariants["size"];
}

export const DisclosureGroup = forwardRef<HTMLDivElement, DisclosureGroupProps>(function DisclosureGroup(
  { multiple = false, value: valueProp, defaultValue = [], onValueChange, headingLevel = 3, variant, size, className, children, ...rest },
  ref,
) {
  const [valueState, setValueState] = useState(defaultValue);
  const value = valueProp ?? valueState;
  const context: GroupContext = {
    variant, size, headingLevel,
    isOpen: item => value.includes(item),
    setOpen: (item, open) => {
      const next = open ? (multiple ? [...value.filter(v => v !== item), item] : [item]) : value.filter(v => v !== item);
      if (valueProp === undefined) setValueState(next);
      onValueChange?.(next);
    },
  };
  return (
    <div ref={ref} {...rest} className={disclosureGroupVariants({}, className)}>
      <DisclosureGroupContext.Provider value={context}>{children}</DisclosureGroupContext.Provider>
    </div>
  );
});
