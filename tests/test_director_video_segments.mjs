import assert from "node:assert/strict";
import test from "node:test";

import { clampSegmentLengthToSource } from "../js/director_video_segments.js";

test("video segment length is capped by source frames after trim", () => {
  assert.equal(clampSegmentLengthToSource({ length: 999, trimStart: 30, videoDurationFrames: 100 }), 70);
});

test("video segment length can shrink below UI minimum near the source end", () => {
  assert.equal(clampSegmentLengthToSource({ length: 6, trimStart: 9, videoDurationFrames: 10 }), 1);
});
