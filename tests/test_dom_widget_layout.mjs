import assert from "node:assert/strict";
import test from "node:test";

import {
  bindDomWidgetWidthToNode,
  configureFixedControlInput,
  configureFullWidthDomWidget,
  getFullWidthDomWidgetSize,
  installDirectorStyles,
} from "../js/dom_widget_layout.js";

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

test("director DOM widget uses the node width when Nodes 2.0 omits the width argument", () => {
  const node = { size: [1000, 800] };

  assert.deepEqual(getFullWidthDomWidgetSize(node, 720), [1000, 720]);
});

test("director DOM widget preserves the supplied legacy layout width", () => {
  const node = { size: [1000, 800] };

  assert.deepEqual(getFullWidthDomWidgetSize(node, 720, 640), [640, 720]);
});

test("director DOM widget ignores the Nodes 2.0 side panel width", () => {
  const node = { size: [1000, 800] };
  const widget = {};

  bindDomWidgetWidthToNode(widget, node);
  widget.width = 320;

  assert.equal(widget.width, 1000);

  node.size[0] = 1200;
  assert.equal(widget.width, 1200);
});

test("director control inputs cannot be stretched by external flex styles", () => {
  const element = { style: {} };

  configureFixedControlInput(element, 64);

  assert.deepEqual(element.style, {
    width: "64px",
    minWidth: "64px",
    maxWidth: "64px",
    flex: "0 0 64px",
    boxSizing: "border-box",
  });
});

test("director styles use their own style element without replacing another plugin", () => {
  const elements = new Map([["prompt-relay-styles", { id: "prompt-relay-styles" }]]);
  const documentRef = {
    head: {
      appendChild(element) {
        elements.set(element.id, element);
      },
    },
    getElementById(id) {
      return elements.get(id);
    },
    createElement() {
      return {};
    },
  };

  assert.equal(installDirectorStyles(documentRef, "yusu-ltx-director-styles", ".test{}"), true);
  assert.equal(elements.get("prompt-relay-styles").id, "prompt-relay-styles");
  assert.equal(elements.get("yusu-ltx-director-styles").textContent, ".test{}");
  assert.equal(installDirectorStyles(documentRef, "yusu-ltx-director-styles", ".other{}"), false);
});
