import assert from "node:assert/strict";
import test from "node:test";

import { calculateTimelineDurationFrames } from "../js/timeline_duration.js";

test("audio extending past image segments increases timeline duration", () => {
  const duration = calculateTimelineDurationFrames(48, [
    { start: 24, length: 72 },
  ]);

  assert.equal(duration, 96);
});

test("short audio does not reduce image and text duration", () => {
  const duration = calculateTimelineDurationFrames(96, [
    { start: 0, length: 24 },
  ]);

  assert.equal(duration, 96);
});

test("audio-only timelines use the furthest audio end", () => {
  const duration = calculateTimelineDurationFrames(0, [
    { start: 12, length: 24 },
    { start: 48, length: 24 },
  ]);

  assert.equal(duration, 72);
});
