import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { Stepper, StepperStep } from "../dist/modules/index.js";

const steps = (props = {}) => h(Stepper, { current: 1, "aria-label": "Setup", ...props },
  h(StepperStep, { title: "Details" }), h(StepperStep, { title: "Members", description: "Teams" }), h(StepperStep, { title: "Review" }));

test("an ordered list: done, current and upcoming steps; the current one is aria-current=step; status words follow each title", () => {
  const html = render(steps());
  assert.match(html, /^<ol class="area-stepper area-stepper--horizontal" aria-label="Setup">/);
  assert.match(html, /<li class="area-stepper-step area-stepper-step--complete"><span class="area-stepper-step__body"><span class="area-stepper-step__marker" aria-hidden="true"><svg [^>]*data-area-glyph="check"/);
  assert.match(html, /<li class="area-stepper-step area-stepper-step--current" aria-current="step">/);
  assert.match(html, /Members<span class="area-sr-only">, current step<\/span><\/span><span class="area-stepper-step__description">Teams<\/span>/);
  assert.match(html, /<li class="area-stepper-step area-stepper-step--upcoming">.*aria-hidden="true">3<\/span>/);
});

test("onStepSelect makes done steps buttons, not the current or later ones; nonLinear opens the later ones too", () => {
  const html = render(steps({ onStepSelect: () => {} }));
  assert.equal(html.match(/area-stepper-step__button/g)?.length, 1);
  assert.equal(render(steps({ onStepSelect: () => {}, nonLinear: true })).match(/area-stepper-step__button/g)?.length, 2);
});

test("a step with a problem, vertical layout, and custom status words", () => {
  const html = render(h(Stepper, { current: 2, orientation: "vertical", statusLabels: { invalid: "needs attention" } },
    h(StepperStep, { title: "Upload" }), h(StepperStep, { title: "Map", status: "invalid" }), h(StepperStep, { title: "Import" })));
  assert.match(html, /area-stepper--vertical/);
  assert.match(html, /area-stepper-step--invalid"><span class="area-stepper-step__body"><span class="area-stepper-step__marker" aria-hidden="true">!<\/span>/);
  assert.match(html, /, needs attention/);
});
