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
