import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeDirectorWidgetValue,
  selectDirectorWidgetSchema,
} from "../js/director_widget_migration.js";

test("legacy 23-value workflows select their actual field order", () => {
  const localFirst = Array(23).fill(null);
  localFirst[7] = "prompt";
  assert.equal(selectDirectorWidgetSchema(localFirst)[7], "local_prompts");

  const togglesFirst = Array(23).fill(null);
  togglesFirst[7] = true;
  assert.equal(selectDirectorWidgetSchema(togglesFirst)[7], "use_custom_audio");
});

test("legacy 22-value workflows distinguish prompt-first and toggle-first layouts", () => {
  const noInpaint = Array(22).fill(null);
  noInpaint[7] = "prompt";
  assert.equal(selectDirectorWidgetSchema(noInpaint)[7], "local_prompts");

  const withInpaint = Array(22).fill(null);
  withInpaint[7] = true;
  assert.equal(selectDirectorWidgetSchema(withInpaint)[7], "use_custom_audio");
  assert.equal(selectDirectorWidgetSchema(withInpaint)[9], "inpaint_audio");
});

test("current workflows keep transition and IC size fields aligned", () => {
  const schema = selectDirectorWidgetSchema(Array(25).fill(null));
  assert.equal(schema[16], "transition_smoothness");
  assert.equal(schema[23], "use_ic_video_size");
});

test("invalid migrated values fall back instead of producing broken widgets", () => {
  assert.equal(normalizeDirectorWidgetValue("frame_rate", "NaN", 24), 24);
  assert.equal(normalizeDirectorWidgetValue("display_mode", "0,0,0", "seconds"), "seconds");
  assert.equal(normalizeDirectorWidgetValue("custom_height", null, 0), 0);
  assert.equal(normalizeDirectorWidgetValue("resize_method", 32, "maintain aspect ratio"), "maintain aspect ratio");
  assert.equal(normalizeDirectorWidgetValue("use_custom_motion", 1, false), true);
});
