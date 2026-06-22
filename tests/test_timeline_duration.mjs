import assert from "node:assert/strict";
import test from "node:test";

import { calculateTimelineDurationFrames } from "../js/timeline_duration.js";

test("timeline duration follows the furthest media segment", () => {
  assert.equal(calculateTimelineDurationFrames(48, [
    { start: 24, length: 72 },
    { start: 200, length: 10 },
  ]), 210);
});
