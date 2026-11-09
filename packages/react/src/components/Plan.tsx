// Plan: a plan's progress, what is done, now and next; folds to its head. Spec: docs/specs/plan.md.
import { forwardRef, useId, useState } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { planVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";
import { Progress, Spinner } from "./primitives.tsx";

export type PlanItemStatus = "complete" | "current" | "pending" | "cancelled" | /** @deprecated use "complete" */ "done";
/** The shared word for a deprecated alias (system gaps C1). */
const statusOf = (item: PlanItem) => item.status === "done" ? "complete" : item.status;

export interface PlanItem {
  id: string;
  label: ReactNode;
  /** The shared status words (Governance § 4, 2026-11-07): complete, current, pending; cancelled is Plan's own, dropped
   * from the plan (Cursor's todos), struck, with a cross. `done` is a deprecated alias of complete, kept for one release. */
  status: PlanItemStatus;
  /** How far a current item is, 0 to 1: its mark becomes a ring that fills (Linear's in-progress ring), and its
   * segment of a segmented bar fills that far. Without it a current item shows a Spinner. */
  progress?: number;
  /** A short trailing value: the item's own count ("2 of 3"), a date. */
  meta?: ReactNode;
  /** What the item acted on or decided, after its label on the same line: values, usually Badges ("Updating time range:
   * 7:00 AM – 8:30 AM"; a chapter's answers). */
  detail?: ReactNode;
  /** The item's own steps, as rows under its words (a chapter's questions; the agent timeline's findings). One level:
   * sub-items take no items of their own. */
  items?: PlanItem[];
}

export interface PlanProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  items: PlanItem[];
  /** "Plan" by default. */
  title?: ReactNode;
  /** The head's count. Default "N of M", the done items of all items; give it when the items are phases of a larger
   * count ("9 of 14" questions across 8 chapters). */
  count?: ReactNode;
  /** A bar under the head that stays when folded: `single`, one bar for the done share of all items; `segmented`, one
   * segment per item, each filled by its own share (GitHub's segmented ProgressBar, Cursor's segmented bar). */
  bar?: Exclude<VariantProps<typeof MANIFESTS.plan>["bar"], "none">;
  /** The items' marks joined by a line, a timeline (owner 2026-10-25, an agent run's progress): for plans whose items
   * carry detail or steps of their own. */
  rail?: boolean;
  /** surface (default): its own frame. plain: no frame, its words on the text edge around it, as a turn's steps (a chat). */
  variant?: VariantProps<typeof MANIFESTS.plan>["variant"];
  /** A 16 glyph before the title: what the plan is about, or its state. */
  icon?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SPOKEN = { complete: "Done", current: "In progress", pending: "Not started", cancelled: "Cancelled" } as const;
/** An item's share of the bar: done whole, current by its progress, the rest empty. */
const shareOf = (item: PlanItem) => statusOf(item) === "complete" ? 1 : item.status === "current" ? Math.min(1, Math.max(0, item.progress ?? 0)) : 0;

/** What is done, what it is doing, what is next, and a count; folds to its head. */
export const Plan = forwardRef<HTMLElement, PlanProps>(function Plan(
  { items, title = "Plan", count, bar, rail, variant, icon, open: openProp, defaultOpen = true, onOpenChange, className, ...rest }, ref,
) {
  const listId = useId();
  const titleId = useId();
  const [own, setOwn] = useState(defaultOpen);
  const open = openProp ?? own;
  const done = items.filter(item => statusOf(item) === "complete").length;
  const counted = count ?? `${done} of ${items.length}`;
  // The whole plan's share, for the bar's one announced value: segmented, the mean of the segments; single, done of all.
  const share = items.length ? (bar === "segmented" ? items.reduce((sum, item) => sum + shareOf(item), 0) : done) / items.length : 0;
  return (
    <section ref={ref} className={planVariants({ bar, rail, variant }, className)} data-open={open ? "" : undefined} aria-labelledby={titleId} {...rest}>
      <button type="button" className="area-plan__head" aria-expanded={open} aria-controls={listId}
        onClick={() => { const next = !open; if (openProp === undefined) setOwn(next); onOpenChange?.(next); }}>
        {icon ? <span className="area-plan__icon" aria-hidden="true">{icon}</span> : null}
        <span id={titleId} className="area-plan__title">{title}</span>
        <span className="area-plan__chevron" aria-hidden="true"><Glyph name="chevron-down" size={12} /></span>
        <span className="area-plan__count">{counted}</span>
      </button>
      {bar ? (
        // One bar to assistive tech, named by the title and valued by the whole plan; the segments are Progress's
        // drawing, hidden from it, so a plan of eight phases is not eight progress bars.
        <div className="area-plan__bar" role="progressbar" aria-labelledby={titleId} aria-valuemin={0} aria-valuemax={100}
          aria-valuenow={Math.round(share * 100)} aria-valuetext={typeof counted === "string" ? counted : undefined}>
          {bar === "segmented"
            ? items.map(item => <Progress key={item.id} size="sm" className="area-plan__segment" value={shareOf(item) * 100} aria-hidden="true" />)
            : <Progress size="sm" className="area-plan__segment" value={share * 100} aria-hidden="true" />}
        </div>
      ) : null}
      <ol id={listId} className="area-plan__items" hidden={!open} aria-labelledby={titleId}>
        {items.map(item => <PlanRow key={item.id} item={item} />)}
      </ol>
    </section>
  );
});

/** One item: its mark, its words and detail, its meta, and its own steps under its words. */
function PlanRow({ item, nested }: { item: PlanItem; nested?: boolean }) {
  const ring = item.status === "current" && item.progress != null;
  const steps = !nested && item.items?.length ? item.items : null;
  return (
    <li className={`area-plan__item area-plan__item--${statusOf(item)}`}>
      <span className={`area-plan__mark${ring ? " area-plan__mark--ring" : ""}`} aria-hidden="true"
        style={ring ? { "--_plan-item-progress": shareOf(item) } as CSSProperties : undefined}>
        {/* Done, cancelled and not started are drawn rings (plan.css); current is the ring filling, or a Spinner. */}
        {item.status === "current" && !ring ? <Spinner size="sm" /> : null}
      </span>
      <span className="area-plan__text">
        {item.label}
        {item.detail != null ? <span className="area-plan__detail">{item.detail}</span> : null}
        <span className="area-sr-only">{`, ${SPOKEN[statusOf(item)]}`}</span>
      </span>
      {item.meta != null ? <span className="area-plan__meta">{item.meta}</span> : null}
      {steps ? <ol className="area-plan__steps">{steps.map(step => <PlanRow key={step.id} item={step} nested />)}</ol> : null}
    </li>
  );
}
