// Step, StepGroup and Reasoning: what an agent did, one line each. Spec: docs/specs/step.md.
import { forwardRef, useId, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { stepVariants } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

export type StepRunStatus = "running" | "done" | "failed";

interface DisclosureProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** The shared line: a button when there is something to open, plain text when there is not. */
function useDisclosure({ open: openProp, defaultOpen = false, onOpenChange }: DisclosureProps) {
  const [own, setOwn] = useState(defaultOpen);
  const open = openProp ?? own;
  const toggle = () => { const next = !open; if (openProp === undefined) setOwn(next); onOpenChange?.(next); };
  return { open, toggle };
}

interface LineProps extends DisclosureProps {
  verb: ReactNode;
  detail?: ReactNode;
  meta?: ReactNode;
  icon?: ReactNode;
  status: StepRunStatus;
  body?: ReactNode;
  modifiers: { group?: boolean; reasoning?: boolean };
  /** Spoken after the line when the status is not already in its words (a failed step reads "failed"). */
  spoken?: string;
}

const Line = forwardRef<HTMLDivElement, LineProps & Omit<HTMLAttributes<HTMLDivElement>, "children">>(function Line(
  { verb, detail, meta, icon, status, body, modifiers, open: openProp, defaultOpen, onOpenChange, spoken, className, ...rest }, ref,
) {
  const bodyId = useId();
  const { open, toggle } = useDisclosure({ open: openProp, defaultOpen, onOpenChange });
  const expandable = body != null && body !== false;
  const parts = (
    <>
      {icon ? <span className="area-step__icon" aria-hidden="true">{icon}</span> : null}
      <span className="area-step__verb">{verb}</span>
      {detail != null ? <span className="area-step__detail">{detail}</span> : null}
      {meta != null ? <span className="area-step__meta">{meta}</span> : null}
      {spoken ? <span className="area-sr-only">{spoken}</span> : null}
      {expandable ? <span className="area-step__chevron" aria-hidden="true"><Glyph name="chevron-down" size={12} /></span> : null}
    </>
  );
  return (
    <div ref={ref} className={stepVariants(modifiers, className)} data-open={expandable && open ? "" : undefined}
      data-running={status === "running" ? "" : undefined} data-failed={status === "failed" ? "" : undefined}
      aria-busy={status === "running" || undefined} {...rest}>
      {expandable
        ? <button type="button" className="area-step__row" aria-expanded={open} aria-controls={bodyId} onClick={toggle}>{parts}</button>
        : <div className="area-step__row">{parts}</div>}
      {expandable ? <div id={bodyId} className="area-step__body" hidden={!open}>{body}</div> : null}
    </div>
  );
});

export interface StepProps extends DisclosureProps, Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** What it did, as the line says it: "Read" when done, the live form while running ("Reading"). */
  verb: ReactNode;
  /** What it did it to: a file, a search, a command. Cut short on one line. */
  detail?: ReactNode;
  /** A duration or +N −N at the line's end. */
  meta?: ReactNode;
  /** A 16 glyph before the verb (Cursor's tool icon); none by default (Codex, Claude Code). */
  icon?: ReactNode;
  /** running: the verb shimmers; failed: the verb in the danger ink. */
  status?: StepRunStatus;
  /** What went in and came out. A step with children opens to show them. */
  children?: ReactNode;
}

/** One thing an agent did, on one line, opening to its input and output. */
export const Step = forwardRef<HTMLDivElement, StepProps>(function Step({ status = "done", children, ...rest }, ref) {
  return <Line ref={ref} status={status} body={children} modifiers={{}} spoken={status === "failed" ? "Failed" : undefined} {...rest} />;
});

export interface StepGroupProps extends DisclosureProps, Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The run as one line: "Explored", "Worked for". */
  verb: ReactNode;
  /** "6 files", "2m 5s". */
  detail?: ReactNode;
  /** At the line's end, muted: how long the run took ("6m 12s", Claude Code's turn summary), as a Step's own meta. */
  meta?: ReactNode;
  status?: StepRunStatus;
  /** The Steps it folds. */
  children: ReactNode;
}

/** A run of steps folded under one line ("Explored 6 files", "Worked for 2m 5s"). */
export const StepGroup = forwardRef<HTMLDivElement, StepGroupProps>(function StepGroup({ status = "done", children, ...rest }, ref) {
  return <Line ref={ref} status={status} body={<div className="area-step__items">{children}</div>} modifiers={{ group: true }} {...rest} />;
});

export interface ReasoningProps extends DisclosureProps, Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Still thinking: "Thinking" shimmers; the seconds show once it is done. */
  running?: boolean;
  /** How long it thought, for "Thought for 12s". */
  seconds?: number;
  /** The summary of the reasoning (the raw chain is never shown). */
  children?: ReactNode;
}

/** The agent's thinking as one closed line ("Thought for 12s"), opening to its summary. */
export const Reasoning = forwardRef<HTMLDivElement, ReasoningProps>(function Reasoning({ running, seconds, children, ...rest }, ref) {
  return <Line ref={ref} status={running ? "running" : "done"} verb={running ? "Thinking" : "Thought"}
    detail={!running && seconds !== undefined ? `for ${seconds}s` : undefined}
    body={running ? undefined : children} modifiers={{ reasoning: true }} {...rest} />;
});
