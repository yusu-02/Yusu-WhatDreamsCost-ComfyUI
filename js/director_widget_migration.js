const SCHEMA_19 = [
  "start_frame", "end_frame", "duration_frames",
  "timeline_data", "use_custom_audio", "use_custom_motion", "inpaint_audio", "local_prompts", "segment_lengths",
  "epsilon", "frame_rate", "display_mode", "guide_strength", "custom_width", "custom_height",
  "resize_method", "divisible_by", "img_compression", "timeline_ui",
];

const SCHEMA_21_NO_INPAINT = [
  "start_second", "end_second", "duration_seconds", "start_frame", "end_frame", "duration_frames",
  "timeline_data", "local_prompts", "segment_lengths", "epsilon", "guide_strength",
  "use_custom_audio", "use_custom_motion", "frame_rate", "display_mode", "custom_width", "custom_height",
  "resize_method", "divisible_by", "img_compression", "timeline_ui",
];

const SCHEMA_22_NO_INPAINT = [
  ...SCHEMA_21_NO_INPAINT.slice(0, -1),
  "override_audio", "timeline_ui",
];

const SCHEMA_22_WITH_INPAINT = [
  "start_second", "end_second", "duration_seconds", "start_frame", "end_frame", "duration_frames",
  "timeline_data", "use_custom_audio", "use_custom_motion", "inpaint_audio", "local_prompts", "segment_lengths",
  "epsilon", "frame_rate", "display_mode", "guide_strength", "custom_width", "custom_height",
  "resize_method", "divisible_by", "img_compression", "timeline_ui",
];

const SCHEMA_23_TOGGLES_FIRST = [
  ...SCHEMA_22_WITH_INPAINT.slice(0, -1),
  "override_audio", "timeline_ui",
];

const SCHEMA_23_LOCAL_FIRST = [
  "start_second", "end_second", "duration_seconds", "start_frame", "end_frame", "duration_frames",
  "timeline_data", "local_prompts", "segment_lengths", "epsilon", "guide_strength",
  "use_custom_audio", "use_custom_motion", "inpaint_audio", "frame_rate", "display_mode",
  "custom_width", "custom_height", "resize_method", "divisible_by", "img_compression",
  "override_audio", "timeline_ui",
];

const CURRENT_SCHEMA = [
  "start_second", "end_second", "duration_seconds", "start_frame", "end_frame", "duration_frames",
  "timeline_data", "use_custom_audio", "use_custom_motion", "inpaint_audio", "local_prompts", "segment_lengths",
  "epsilon", "frame_rate", "display_mode", "guide_strength", "transition_smoothness",
  "custom_width", "custom_height", "resize_method", "divisible_by", "img_compression",
  "override_audio", "use_ic_video_size", "timeline_ui",
];

export function selectDirectorWidgetSchema(values = []) {
  const len = values.length;
  if (len <= 19) return SCHEMA_19;
  if (len === 21) return SCHEMA_21_NO_INPAINT;
  if (len === 22) return typeof values[7] === "boolean" ? SCHEMA_22_WITH_INPAINT : SCHEMA_22_NO_INPAINT;
  if (len === 23) return typeof values[7] === "boolean" ? SCHEMA_23_TOGGLES_FIRST : SCHEMA_23_LOCAL_FIRST;
  return CURRENT_SCHEMA;
}

export function normalizeDirectorWidgetValue(name, value, fallback) {
  const numberRules = {
    start_second: [0, 1000],
    end_second: [0, 1000],
    duration_seconds: [0.1, 1000],
    start_frame: [0, 10000],
    end_frame: [1, 10000],
    duration_frames: [1, 10000],
    epsilon: [0.0001, 0.99],
    frame_rate: [1, 240],
    custom_width: [0, 8192],
    custom_height: [0, 8192],
    divisible_by: [1, 256],
    img_compression: [0, 100],
  };
  if (numberRules[name]) {
    const numeric = Number(value);
    const [min, max] = numberRules[name];
    return Number.isFinite(numeric) && numeric >= min && numeric <= max ? numeric : fallback;
  }
  if (["use_custom_audio", "use_custom_motion", "inpaint_audio", "override_audio", "use_ic_video_size"].includes(name)) {
    if (typeof value === "boolean") return value;
    if (value === 0 || value === 1) return Boolean(value);
    return fallback;
  }
  if (name === "display_mode") return ["frames", "seconds"].includes(value) ? value : fallback;
  if (name === "resize_method") {
    return ["maintain aspect ratio", "stretch to fit", "pad", "pad green", "crop"].includes(value) ? value : fallback;
  }
  if (["timeline_data", "local_prompts", "segment_lengths", "guide_strength", "transition_smoothness"].includes(name)) {
    return typeof value === "string" ? value : fallback;
  }
  return value ?? fallback;
}
