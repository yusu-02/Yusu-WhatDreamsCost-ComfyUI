export function calculateTimelineDurationFrames(baseFrames, ...segmentGroups) {
  let furthest = Math.ceil(Number(baseFrames) || 0);
  for (const group of segmentGroups) {
    if (!Array.isArray(group)) continue;
    for (const seg of group) {
      const start = Number.isFinite(Number(seg?.start)) ? Number(seg.start) : 0;
      const length = Number.isFinite(Number(seg?.length)) ? Number(seg.length) : 0;
      furthest = Math.max(furthest, Math.ceil(start + length));
    }
  }
  return Math.max(1, furthest);
}

export function calculatePlaybackDurationFrames(outputFrames, visualFrames) {
  return Math.max(1, Math.ceil(Number(outputFrames) || Number(visualFrames) || 1));
}

export function pushOverlappingSegmentsForward(segments, anchorId) {
  if (!Array.isArray(segments) || !anchorId) return 0;

  segments.sort((a, b) => (Number(a?.start) || 0) - (Number(b?.start) || 0));
  const anchorIndex = segments.findIndex((seg) => seg?.id === anchorId);
  if (anchorIndex === -1) return 0;

  let moved = 0;
  for (let i = anchorIndex + 1; i < segments.length; i++) {
    const prev = segments[i - 1];
    const current = segments[i];
    const minStart = (Number(prev?.start) || 0) + (Number(prev?.length) || 0);
    if ((Number(current?.start) || 0) < minStart) {
      current.start = minStart;
      moved++;
    }
  }
  return moved;
}
