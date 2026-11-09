/** Stepper gallery specimens: one variant per tile. docs/specs/stepper.md. */
import { useState } from "react";
import { Button, Nav, NavItem, Stepper, StepperStep } from "@area/react";

const wide = { inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };

export const GalleryStepper = () => (
  <Stepper current={1} aria-label="Label" style={wide}>
    <StepperStep title="Step one" />
    <StepperStep title="Step two" />
    <StepperStep title="Step three" />
  </Stepper>
);
export const GalleryStepperStart = () => (
  <Stepper current={0} aria-label="Label" style={wide}>
    <StepperStep title="Step one" />
    <StepperStep title="Step two" />
    <StepperStep title="Step three" />
  </Stepper>
);
export const GalleryStepperDone = () => (
  <Stepper current={3} aria-label="Label" style={wide}>
    <StepperStep title="Step one" />
    <StepperStep title="Step two" />
    <StepperStep title="Step three" />
  </Stepper>
);
export const GalleryStepperDescription = () => (
  <Stepper current={1} aria-label="Label" style={{ ...wide, inlineSize: "calc(var(--area-space-96) * 6)" }}>
    <StepperStep title="Step one" description="Description" />
    <StepperStep title="Step two" description="Description" />
    <StepperStep title="Step three" description="Description" />
  </Stepper>
);
export const GalleryStepperVertical = () => (
  <Stepper current={1} orientation="vertical" aria-label="Label">
    <StepperStep title="Step one" description="Description" />
    <StepperStep title="Step two" description="Description" />
    <StepperStep title="Step three" />
  </Stepper>
);
/* The open step holds what it is made of: its sub-steps, under its title, the line running on beside them. */
export const GalleryStepperContent = () => (
  <Stepper current={1} orientation="vertical" aria-label="Label" style={{ inlineSize: "calc(var(--area-space-96) * 3)" }}>
    <StepperStep title="Step one" />
    <StepperStep title="Step two">
      <Nav aria-label="Step two">
        <NavItem href="#one" current>Item one</NavItem>
        <NavItem href="#two">Item two</NavItem>
        <NavItem href="#three">Item three</NavItem>
      </Nav>
    </StepperStep>
    <StepperStep title="Step three" />
  </Stepper>
);
export const GalleryStepperInvalid = () => (
  <Stepper current={2} aria-label="Label" style={wide}>
    <StepperStep title="Step one" />
    <StepperStep title="Step two" status="error" />
    <StepperStep title="Step three" />
  </Stepper>
);
/* Done steps are buttons back to them; steps ahead wait. */
export const GalleryStepperInteractive = () => {
  const [step, setStep] = useState(2);
  const titles = ["Step one", "Step two", "Step three", "Step four"];
  return (
    <div style={{ display: "grid", gap: "var(--area-space-16)", ...wide, inlineSize: "calc(var(--area-space-96) * 5)" }}>
      <Stepper current={step} onStepSelect={setStep} aria-label="Label">
        {titles.map(title => <StepperStep key={title} title={title} />)}
      </Stepper>
      <div style={{ display: "flex", gap: "var(--area-space-8)", justifyContent: "flex-end" }}>
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Secondary</Button>
        <Button variant="solid" disabled={step === titles.length} onClick={() => setStep(step + 1)}>Action</Button>
      </div>
    </div>
  );
};
