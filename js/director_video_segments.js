function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function clampSegmentLengthToSource(seg) {
  const sourceFrames = num(seg.videoDurationFrames || seg.audioDurationFrames);
  const trimStart = Math.max(0, num(seg.trimStart));
  const maxLength = sourceFrames > 0 ? Math.max(1, sourceFrames - trimStart) : Infinity;
  return Math.max(1, Math.min(Math.round(num(seg.length, 1)), maxLength));
}
