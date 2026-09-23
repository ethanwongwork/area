import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Button, ButtonGroup } from "../dist/modules/index.js";

test("ButtonGroup keeps each command independently named and focusable", () => {
  const html = renderToString(h(ButtonGroup, { "aria-label": "Alignment", variant: "soft" },
    h(Button, { variant: "ghost", "aria-label": "Align top", iconOnly: true, icon: h("span", null, "T") }),
    h(Button, { variant: "ghost", "aria-label": "Align bottom", iconOnly: true, icon: h("span", null, "B") }),
  ));
  assert.match(html, /role="group"[^>]*aria-label="Alignment"/);
  assert.match(html, /area-button-group--soft/);
  assert.equal((html.match(/type="button"/g) ?? []).length, 2);
  assert.match(html, /aria-label="Align top"/);
  assert.match(html, /aria-label="Align bottom"/);
});
