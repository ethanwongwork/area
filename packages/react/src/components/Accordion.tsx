// Accordion and AccordionItem: a stack of collapsible items (one open at a time unless `multiple`),
// and one item, which also stands alone as a Notion-style toggle. Spec: docs/specs/accordion.md.
import { useSystemDefault } from "./SystemDefaults.tsx";
import { createContext, forwardRef, useContext, useEffect, useId, useRef, useState } from "react";
import type { HTMLAttributes, ReactNode, SyntheticEvent } from "react";
import { accordionVariants, accordionItemVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

type AccordionItemVariants = VariantProps<typeof MANIFESTS.accordionItem>;
type HeadingLevel = 2 | 3 | 4 | 5 | 6;

interface GroupContext {
  variant?: AccordionItemVariants["variant"];
  size?: AccordionItemVariants["size"];
  headingLevel?: HeadingLevel;
  isOpen: (value: string) => boolean;
  setOpen: (value: string, open: boolean, event?: SyntheticEvent) => void;
}
const AccordionContext = createContext<GroupContext | null>(null);

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onToggle"> {
  /** The title the reader clicks. It names the trigger button. */
  heading: ReactNode;
  /** Controlled open state. In a Accordion the group owns it instead. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** This item's key in a Accordion's `value`. Defaults to a generated id. */
  value?: string;
  /** Wraps the trigger in a heading of this level (a Accordion defaults to 3). */
  headingLevel?: HeadingLevel;
  disabled?: boolean;
  variant?: AccordionItemVariants["variant"];
  size?: AccordionItemVariants["size"];
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { heading, open: openProp, defaultOpen = false, onOpenChange, value: valueProp, headingLevel, disabled, variant, size, className, children, ...rest },
  ref,
) {
  // The system's defaults (SystemDefaults) where the use gives none.
  const systemVariant = useSystemDefault("accordionItem", "variant", undefined as typeof variant);
  const systemSize = useSystemDefault("accordionItem", "size", undefined as typeof size);
  const group = useContext(AccordionContext);
  const id = useId();
  const value = valueProp ?? id;
  const [openState, setOpenState] = useState(defaultOpen);
  const open = group ? group.isOpen(value) : openProp ?? openState;
  const setOpen = (next: boolean, event?: SyntheticEvent) => {
    if (group) group.setOpen(value, next, event);
    else if (openProp === undefined) setOpenState(next);
    onOpenChange?.(next);
  };
  const contentRef = useRef<HTMLDivElement>(null);
  // Closed content renders `hidden` on the server and becomes `until-found` once mounted, so the
  // browser's find-in-page can reveal it; a match opens the item.
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
    <button id={triggerId} type="button" className="area-accordion-item__trigger" aria-expanded={open} aria-controls={contentId}
      disabled={disabled} onClick={event => setOpen(!open, event)}>
      <span className="area-accordion-item__chevron" aria-hidden="true"><Glyph name="chevron-down" /></span>
      <span className="area-accordion-item__label">{heading}</span>
    </button>
  );
  return (
    <div ref={ref} {...rest} className={accordionItemVariants({ variant: variant ?? group?.variant ?? systemVariant, size: size ?? group?.size ?? systemSize }, className)}
      data-open={open ? "" : undefined} data-disabled={disabled ? "" : undefined}>
      {H ? <H className="area-accordion-item__heading">{trigger}</H> : trigger}
      {/* In a group each panel is a region named by its trigger (WAI accordion). */}
      <div ref={contentRef} id={contentId} className="area-accordion-item__content" hidden={!open}
        {...(group ? { role: "region", "aria-labelledby": triggerId } : {})}>
        {children}
      </div>
    </div>
  );
});

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Let any number stay open. By default opening one closes the others. */
  multiple?: boolean;
  /** Controlled open items, by each AccordionItem's `value`. */
  value?: string[];
  /** Initially open items when uncontrolled. */
  defaultValue?: string[];
  /** The open items after a change, and the press that made it (absent when a find-in-page reveal opens one). */
  onValueChange?: (value: string[], event?: SyntheticEvent) => void;
  /** Heading level for every item's trigger (WAI accordion). */
  headingLevel?: HeadingLevel;
  variant?: AccordionItemVariants["variant"];
  size?: AccordionItemVariants["size"];
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { multiple = false, value: valueProp, defaultValue = [], onValueChange, headingLevel = 3, variant, size, className, children, ...rest },
  ref,
) {
  const [valueState, setValueState] = useState(defaultValue);
  const value = valueProp ?? valueState;
  const context: GroupContext = {
    variant, size, headingLevel,
    isOpen: item => value.includes(item),
    setOpen: (item, open, event) => {
      const next = open ? (multiple ? [...value.filter(v => v !== item), item] : [item]) : value.filter(v => v !== item);
      if (valueProp === undefined) setValueState(next);
      onValueChange?.(next, event);
    },
  };
  return (
    <div ref={ref} {...rest} className={accordionVariants({}, className)}>
      <AccordionContext.Provider value={context}>{children}</AccordionContext.Provider>
    </div>
  );
});
