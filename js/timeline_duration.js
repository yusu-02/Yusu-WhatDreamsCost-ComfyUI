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
  const anchor = segments.find((seg) => seg?.id === anchorId);
  if (!anchor) return 0;

  const anchorStart = Number(anchor.start) || 0;
  let cursor = anchorStart + (Number(anchor.length) || 0);
  let moved = 0;
  for (const current of segments) {
    if (current?.id === anchorId) continue;
    const start = Number(current?.start) || 0;
    const length = Number(current?.length) || 0;
    if (start + length <= anchorStart) continue;
    if (start < cursor) {
      current.start = cursor;
      moved++;
    }
    cursor = (Number(current?.start) || 0) + length;
  }
  segments.sort((a, b) => (Number(a?.start) || 0) - (Number(b?.start) || 0));
  return moved;
}

export function pullSegmentsAfterShrink(segments, oldEnd, newEnd, anchorId) {
  const delta = Math.max(0, Math.round((Number(oldEnd) || 0) - (Number(newEnd) || 0)));
  if (!Array.isArray(segments) || delta <= 0) return 0;

  segments.sort((a, b) => (Number(a?.start) || 0) - (Number(b?.start) || 0));
  let moved = 0;
  let cursor = Number(newEnd) || 0;
  for (const seg of segments) {
    if (!seg || seg.id === anchorId) continue;
    const start = Number(seg.start) || 0;
    if (start < newEnd) continue;
    const nextStart = Math.max(cursor, start - delta);
    if (nextStart !== start) moved++;
    seg.start = nextStart;
    cursor = seg.start + (Number(seg.length) || 0);
  }
  segments.sort((a, b) => (Number(a?.start) || 0) - (Number(b?.start) || 0));
  return moved;
}
