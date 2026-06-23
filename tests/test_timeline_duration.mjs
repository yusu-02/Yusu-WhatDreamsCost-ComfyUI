import assert from "node:assert/strict";
import test from "node:test";

import { calculateTimelineDurationFrames, pushOverlappingSegmentsForward } from "../js/timeline_duration.js";

test("timeline duration follows the furthest media segment", () => {
  assert.equal(calculateTimelineDurationFrames(48, [
    { start: 24, length: 72 },
    { start: 200, length: 10 },
  ]), 210);
});

test("duration edits push later overlapping segments forward", () => {
  const segments = [
    { id: "a", start: 0, length: 120 },
    { id: "b", start: 48, length: 24 },
    { id: "c", start: 60, length: 24 },
  ];

  assert.equal(pushOverlappingSegmentsForward(segments, "a"), 2);
  assert.deepEqual(segments.map((seg) => [seg.id, seg.start]), [
    ["a", 0],
    ["b", 120],
    ["c", 144],
  ]);
});
