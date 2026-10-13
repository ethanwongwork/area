/** Stepper gallery specimens: one variant per tile. docs/specs/stepper.md. */
import { useState } from "react";
import { Button, Stepper, StepperStep } from "@area/react";

const wide = { inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };

export const GalleryStepper = () => (
  <Stepper current={1} aria-label="Workspace setup" style={wide}>
    <StepperStep title="Details" />
    <StepperStep title="Members" />
    <StepperStep title="Review" />
  </Stepper>
);
export const GalleryStepperStart = () => (
  <Stepper current={0} aria-label="Workspace setup" style={wide}>
    <StepperStep title="Details" />
    <StepperStep title="Members" />
    <StepperStep title="Review" />
  </Stepper>
);
export const GalleryStepperDone = () => (
  <Stepper current={3} aria-label="Workspace setup" style={wide}>
    <StepperStep title="Details" />
    <StepperStep title="Members" />
    <StepperStep title="Review" />
  </Stepper>
);
export const GalleryStepperDescription = () => (
  <Stepper current={1} aria-label="Workspace setup" style={{ ...wide, inlineSize: "calc(var(--area-space-96) * 6)" }}>
    <StepperStep title="Details" description="Name and icon" />
    <StepperStep title="Members" description="David Tee's teams" />
    <StepperStep title="Review" description="Check and create" />
  </Stepper>
);
export const GalleryStepperVertical = () => (
  <Stepper current={1} orientation="vertical" aria-label="Publish a library">
    <StepperStep title="Choose components" description="12 selected" />
    <StepperStep title="Write release notes" description="What changed for David Tee's teams" />
    <StepperStep title="Publish" />
  </Stepper>
);
export const GalleryStepperInvalid = () => (
  <Stepper current={2} aria-label="Import" style={wide}>
    <StepperStep title="Upload" />
    <StepperStep title="Map fields" status="invalid" />
    <StepperStep title="Import" />
  </Stepper>
);
/* Done steps are buttons back to them; steps ahead wait. */
export const GalleryStepperInteractive = () => {
  const [step, setStep] = useState(2);
  const titles = ["Details", "Members", "Billing", "Review"];
  return (
    <div style={{ display: "grid", gap: "var(--area-space-16)", ...wide, inlineSize: "calc(var(--area-space-96) * 5)" }}>
      <Stepper current={step} onStepSelect={setStep} aria-label="Workspace setup">
        {titles.map(title => <StepperStep key={title} title={title} />)}
      </Stepper>
      <div style={{ display: "flex", gap: "var(--area-space-8)", justifyContent: "flex-end" }}>
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
        <Button variant="solid" disabled={step === titles.length} onClick={() => setStep(step + 1)}>{step >= titles.length - 1 ? "Finish" : "Continue"}</Button>
      </div>
    </div>
  );
};
