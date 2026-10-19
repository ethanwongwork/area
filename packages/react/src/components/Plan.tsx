// Plan: an agent's plan for the run. Spec: docs/specs/plan.md.
import { forwardRef, useId, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { planVariants } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { Spinner } from "./primitives.tsx";

export interface PlanItem {
  id: string;
  label: ReactNode;
  /** cancelled: dropped from the plan (Cursor's todos); struck, with a cross. */
  status: "done" | "current" | "pending" | "cancelled";
}

export interface PlanProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  items: PlanItem[];
  /** "Plan" by default. */
  title?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SPOKEN = { done: "Done", current: "In progress", pending: "Not started", cancelled: "Cancelled" } as const;

/** What is done, what it is doing, what is next, and a count; folds to its head. */
export const Plan = forwardRef<HTMLElement, PlanProps>(function Plan(
  { items, title = "Plan", open: openProp, defaultOpen = true, onOpenChange, className, ...rest }, ref,
) {
  const listId = useId();
  const titleId = useId();
  const [own, setOwn] = useState(defaultOpen);
  const open = openProp ?? own;
  const done = items.filter(item => item.status === "done").length;
  return (
    <section ref={ref} className={planVariants({}, className)} data-open={open ? "" : undefined} aria-labelledby={titleId} {...rest}>
      <button type="button" className="area-plan__head" aria-expanded={open} aria-controls={listId}
        onClick={() => { const next = !open; if (openProp === undefined) setOwn(next); onOpenChange?.(next); }}>
        <span id={titleId} className="area-plan__title">{title}</span>
        <span className="area-plan__count">{`${done} of ${items.length}`}</span>
        <span className="area-plan__chevron" aria-hidden="true"><Glyph name="chevron-down" size={12} /></span>
      </button>
      <ol id={listId} className="area-plan__items" hidden={!open} aria-labelledby={titleId}>
        {items.map(item => (
          <li key={item.id} className={`area-plan__item area-plan__item--${item.status}`}>
            <span className="area-plan__mark" aria-hidden="true">
              {item.status === "done" ? <Glyph name="check" size={16} /> : item.status === "cancelled" ? <Glyph name="dismiss" size={16} /> : item.status === "current" ? <Spinner size="sm" /> : null}
            </span>
            <span className="area-plan__text">{item.label}<span className="area-sr-only">{`, ${SPOKEN[item.status]}`}</span></span>
          </li>
        ))}
      </ol>
    </section>
  );
});
