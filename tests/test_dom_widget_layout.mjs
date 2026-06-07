import assert from "node:assert/strict";
import test from "node:test";

import { configureFullWidthDomWidget } from "../js/dom_widget_layout.js";

test("director DOM widget fills the available node width", () => {
  const element = { style: {} };

  configureFullWidthDomWidget(element);

  assert.deepEqual(element.style, {
    width: "100%",
    minWidth: "0",
    maxWidth: "100%",
    boxSizing: "border-box",
  });
});
