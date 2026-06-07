import assert from "node:assert/strict";
import test from "node:test";

import {
  bindDomWidgetWidthToNode,
  configureFullWidthDomWidget,
  getFullWidthDomWidgetSize,
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

test("director DOM widget ignores the Nodes 2.0 side panel width", () => {
  const node = { size: [1000, 800] };
  const widget = {};

  bindDomWidgetWidthToNode(widget, node);
  widget.width = 320;

  assert.equal(widget.width, 1000);

  node.size[0] = 1200;
  assert.equal(widget.width, 1200);
});
