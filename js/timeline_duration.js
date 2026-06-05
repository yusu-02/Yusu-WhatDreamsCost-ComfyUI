export function calculateTimelineDurationFrames(imageTextFrames, audioSegments = []) {
  let furthestAudioEnd = 0;

  for (const seg of audioSegments) {
    const start = Number.isFinite(Number(seg?.start)) ? Number(seg.start) : 0;
    const length = Number.isFinite(Number(seg?.length)) ? Number(seg.length) : 0;
    furthestAudioEnd = Math.max(furthestAudioEnd, start + length);
  }

  return Math.max(1, Math.ceil(Number(imageTextFrames) || 0), Math.ceil(furthestAudioEnd));
}
