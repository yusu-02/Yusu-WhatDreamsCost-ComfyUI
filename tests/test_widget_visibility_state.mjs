import assert from "node:assert/strict";
import test from "node:test";

import {
  SETTINGS_WIDGETS_VISIBLE_PROPERTY,
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
