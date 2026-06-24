import assert from "node:assert/strict";
import test from "node:test";

import {
  calculatePlaybackDurationFrames,
  calculateTimelineDurationFrames,
  pullSegmentsAfterShrink,
  pushOverlappingSegmentsForward,
} from "../js/timeline_duration.js";

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

test("align edits push any segment overlapping the anchor range", () => {
  const segments = [
    { id: "old", start: 0, length: 60 },
    { id: "anchor", start: 24, length: 72 },
    { id: "next", start: 80, length: 20 },
  ];

  assert.equal(pushOverlappingSegmentsForward(segments, "anchor"), 2);
  assert.deepEqual(segments.map((seg) => [seg.id, seg.start]), [
    ["anchor", 24],
    ["old", 96],
    ["next", 156],
  ]);
});

test("shrinking a segment pulls later segments left", () => {
  const segments = [
    { id: "a", start: 0, length: 60 },
    { id: "b", start: 60, length: 24 },
    { id: "c", start: 84, length: 24 },
  ];

  assert.equal(pullSegmentsAfterShrink(segments, 60, 36, "a"), 2);
  assert.deepEqual(segments.map((seg) => [seg.id, seg.start]), [
    ["a", 0],
    ["b", 36],
    ["c", 60],
  ]);
});

test("shrinking pulls segments that were covered by the old range", () => {
  const segments = [
    { id: "a", start: 0, length: 120 },
    { id: "b", start: 80, length: 20 },
    { id: "c", start: 100, length: 20 },
  ];

  assert.equal(pullSegmentsAfterShrink(segments, 120, 60, "a"), 2);
  assert.deepEqual(segments.map((seg) => [seg.id, seg.start]), [
    ["a", 0],
    ["b", 60],
    ["c", 80],
  ]);
});

test("shrinking preserves existing gap after the old end", () => {
  const segments = [
    { id: "a", start: 0, length: 60 },
    { id: "b", start: 72, length: 24 },
  ];

  pullSegmentsAfterShrink(segments, 60, 36, "a");
  assert.equal(segments.find((seg) => seg.id === "b").start, 48);
});

test("playback duration ignores visual padding", () => {
  assert.equal(calculatePlaybackDurationFrames(360, 468), 360);
});
