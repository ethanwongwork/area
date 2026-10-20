// Stepper: where a person is in a flow of steps, on Timeline's geometry: numbered markers, a check once done, joined
// by Timeline's line. Spec: docs/specs/stepper.md.
import { Children, cloneElement, forwardRef, isValidElement } from "react";
import type { HTMLAttributes, LiHTMLAttributes, ReactElement, ReactNode } from "react";
import { stepperVariants, stepperStepVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Glyph } from "./Glyph.tsx";

export type StepStatus = "complete" | "current" | "upcoming" | "invalid";

export interface StepperProps extends Omit<HTMLAttributes<HTMLOListElement>, "onSelect"> {
  /** The current step's index, from 0. Steps before it are complete, steps after it are still to come. */
  current: number;
  orientation?: VariantProps<typeof MANIFESTS.stepper>["orientation"];
  /**
   * Makes steps buttons that go to them: complete steps by default, so a person can go back but not skip ahead
   * (WAI, Atlassian, Spectrum, MUI's linear stepper); with `nonLinear`, every step but the current one.
   */
  onStepSelect?: (index: number) => void;
  nonLinear?: boolean;
  /** Words that follow each title for assistive tech, by status. */
  statusLabels?: Partial<Record<StepStatus, string>>;
}

export interface StepperStepProps extends Omit<LiHTMLAttributes<HTMLLIElement>, "title"> {
  title: ReactNode;
  /** A muted line under the title. */
  description?: ReactNode;
  /** Overrides the status the step's place gives it, for a step with a problem (`invalid`). */
  status?: StepStatus;
  disabled?: boolean;
}

const STATUS_LABELS: Record<StepStatus, string> = { complete: "completed", current: "current step", upcoming: "not started", invalid: "has a problem" };

type Injected = { index?: number; placed?: StepStatus; current?: boolean; select?: (() => void) | undefined; statusLabel?: string };

/**
 * An ordered list of steps (`ol`, named by `aria-label`), the current one `aria-current="step"` (ARIA 1.2's token
 * for step indicators; Atlassian, Spectrum, GOV.UK). Status has no ARIA state of its own, so each title is
 * followed by a hidden word ("completed", "current step", "not started"), as WAI's tutorial and Spectrum do;
 * the markers are hidden.
 */
export const Stepper = /* @__PURE__ */ forwardRef<HTMLOListElement, StepperProps>(function Stepper(
  { current, orientation, onStepSelect, nonLinear, statusLabels, className, children, ...rest },
  ref,
) {
  const labels = { ...STATUS_LABELS, ...statusLabels };
  const steps = Children.toArray(children).filter(isValidElement) as ReactElement<StepperStepProps & Injected>[];
  return (
    <ol ref={ref} className={stepperVariants({ orientation }, className)} {...rest}>
      {steps.map((step, index) => {
        const placed: StepStatus = index < current ? "complete" : index === current ? "current" : "upcoming";
        const status = step.props.status ?? placed;
        const reachable = onStepSelect && !step.props.disabled && index !== current && (nonLinear || index < current);
        return cloneElement(step, {
          key: step.key ?? index,
          index,
          placed: status,
          current: index === current,
          statusLabel: labels[status],
          select: reachable ? () => onStepSelect(index) : undefined,
        });
      })}
    </ol>
  );
});

export const StepperStep = /* @__PURE__ */ forwardRef<HTMLLIElement, StepperStepProps>(function StepperStep(props, ref) {
  const { title, description, status: _status, disabled, index = 0, placed = "upcoming", current = placed === "current", select, statusLabel, className, ...rest } = props as StepperStepProps & Injected;
  const marker = (
    <span className="area-stepper-step__marker" aria-hidden="true">
      {placed === "complete" ? <Glyph name="check" size={12} /> : placed === "invalid" ? "!" : index + 1}
    </span>
  );
  const text = (
    <span className="area-stepper-step__text">
      <span className="area-stepper-step__title">
        {title}
        {statusLabel ? <span className="area-sr-only">{`, ${statusLabel}`}</span> : null}
      </span>
      {description ? <span className="area-stepper-step__description">{description}</span> : null}
    </span>
  );
  return (
    <li
      ref={ref}
      className={stepperStepVariants({ status: placed }, className)}
      // The step the person is on keeps aria-current="step" even when its status is invalid.
      aria-current={current ? "step" : undefined}
      {...(disabled ? { "data-disabled": "" } : {})}
      {...rest}
    >
      {select ? (
        <button type="button" className="area-stepper-step__button" onClick={select}>{marker}{text}</button>
      ) : (
        <span className="area-stepper-step__body">{marker}{text}</span>
      )}
    </li>
  );
});
