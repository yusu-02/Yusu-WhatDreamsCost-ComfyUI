import assert from "node:assert/strict";
import test from "node:test";

import {
  calculatePlaybackDurationFrames,
  calculateSegmentRange,
  calculateTimelineDurationFrames,
  shouldAutoSyncDuration,
  splitSegmentTailAfterShrink,
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

test("playback duration extends to media after the output range", () => {
  assert.equal(calculatePlaybackDurationFrames(360, 468), 468);
});

test("playback duration keeps output range when media is shorter", () => {
  assert.equal(calculatePlaybackDurationFrames(360, 240), 360);
});

test("selection range uses timeline segment length, not source media length", () => {
  const range = calculateSegmentRange([
    { id: "image", start: 24, length: 48 },
    { id: "audio", start: 96, length: 24, trimStart: 120, audioDurationFrames: 600 },
  ]);

  assert.deepEqual(range, { start: 24, end: 120, duration: 96 });
});

test("single segment can define an output range", () => {
  assert.deepEqual(calculateSegmentRange([{ id: "audio", start: 72, length: 36 }]), {
    start: 72,
    end: 108,
    duration: 36,
  });
});

test("manual output range disables automatic duration sync", () => {
  assert.equal(shouldAutoSyncDuration(false), true);
  assert.equal(shouldAutoSyncDuration(undefined), true);
  assert.equal(shouldAutoSyncDuration(true), false);
});

test("shrinking an audio segment can keep the removed tail on the timeline", () => {
  const audio = { id: "voice", start: 48, length: 96, trimStart: 24, audioDurationFrames: 240, audioFile: "voice.wav" };

  const tail = splitSegmentTailAfterShrink(audio, 36, "tail");

  assert.deepEqual(
    {
      leftLength: audio.length,
      tailId: tail.id,
      tailStart: tail.start,
      tailLength: tail.length,
      tailTrimStart: tail.trimStart,
      tailAudioFile: tail.audioFile,
    },
    {
      leftLength: 36,
      tailId: "tail",
      tailStart: 84,
      tailLength: 60,
      tailTrimStart: 60,
      tailAudioFile: "voice.wav",
    }
  );
});
