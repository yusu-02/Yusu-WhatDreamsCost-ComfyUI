import assert from "node:assert/strict";
import test from "node:test";

import {
  SETTINGS_WIDGETS_VISIBLE_PROPERTY,
  markWorkflowChanged,
  resolveSettingsWidgetsVisible,
  saveSettingsWidgetsVisible,
} from "../js/widget_visibility_state.js";

test("new nodes default to hidden settings widgets", () => {
  assert.equal(resolveSettingsWidgetsVisible({}), false);
});

test("saved visible state is restored", () => {
  assert.equal(
    resolveSettingsWidgetsVisible({ [SETTINGS_WIDGETS_VISIBLE_PROPERTY]: true }),
    true,
  );
});

test("saving visibility only changes the visibility property", () => {
  const properties = { existing: "keep" };

  saveSettingsWidgetsVisible(properties, true);

  assert.deepEqual(properties, {
    existing: "keep",
    [SETTINGS_WIDGETS_VISIBLE_PROPERTY]: true,
  });
});

test("marking visibility changed updates the graph and active workflow draft", () => {
  let graphChanges = 0;
  let extensionTrackerChecks = 0;
  let workflowTrackerChecks = 0;
  const node = {
    graph: {
      change() {
        graphChanges += 1;
      },
    },
  };
  const app = {
    extensionManager: {
      workflow: {
        activeWorkflow: {
          changeTracker: {
            checkState() {
              extensionTrackerChecks += 1;
            },
          },
        },
      },
    },
    workflowManager: {
      activeWorkflow: {
        changeTracker: {
          checkState() {
            workflowTrackerChecks += 1;
          },
        },
      },
    },
  };

  markWorkflowChanged(app, node);

  assert.equal(graphChanges, 1);
  assert.equal(extensionTrackerChecks, 1);
  assert.equal(workflowTrackerChecks, 1);
});
