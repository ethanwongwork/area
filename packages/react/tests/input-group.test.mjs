import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Input, InputGroup, InputGroupText, NumberField, inputGroupVariants, MANIFESTS } from "../dist/modules/index.js";

test("InputGroup preserves distinct named inputs inside one shell", () => {
  const html = renderToString(h(InputGroup, { "aria-label": "Position", fullWidth: true },
    h(InputGroupText, { "aria-hidden": true }, "X"),
    h(NumberField, { "aria-label": "X position", defaultValue: 24 }),
    h(InputGroupText, { "aria-hidden": true }, "Y"),
    h(NumberField, { "aria-label": "Y position", defaultValue: 48 }),
  ));
  assert.match(html, /role="group"/);
  assert.match(html, /area-input-group--full-width/);
  assert.match(html, /aria-label="X position"/);
  assert.match(html, /aria-label="Y position"/);
  assert.equal((html.match(/role="spinbutton"/g) ?? []).length, 2);
  assert.deepEqual(MANIFESTS.inputGroup.variants.size, ["sm", "md", "lg"]);
  assert.throws(() => inputGroupVariants({ size: "xxl" }), RangeError);
});

test("InputGroup accepts a text control with a static affix", () => {
  const html = renderToString(h(InputGroup, { "aria-label": "Price" },
    h(InputGroupText, { "aria-hidden": true }, "$"),
    h(Input, { "aria-label": "Amount in dollars", defaultValue: "24.00" }),
  ));
  assert.match(html, /area-input-group__text/);
  assert.match(html, /aria-label="Amount in dollars"/);
  assert.match(html, /value="24.00"/);
});
