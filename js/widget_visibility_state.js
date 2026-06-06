export const SETTINGS_WIDGETS_VISIBLE_PROPERTY = "yusuSettingsWidgetsVisible";

export function resolveSettingsWidgetsVisible(properties) {
  return properties?.[SETTINGS_WIDGETS_VISIBLE_PROPERTY] === true;
}

export function saveSettingsWidgetsVisible(properties, visible) {
  properties[SETTINGS_WIDGETS_VISIBLE_PROPERTY] = Boolean(visible);
}

export function markWorkflowChanged(app, node) {
  try {
    node?.graph?.change?.();
  } catch {
    // Keep the visibility toggle usable on older ComfyUI versions.
  }

  try {
    app?.extensionManager?.workflow?.activeWorkflow?.changeTracker?.checkState?.();
  } catch {
    // The workflow extension manager is not available in every frontend version.
  }

  try {
    app?.workflowManager?.activeWorkflow?.changeTracker?.checkState?.();
  } catch {
    // Older/newer frontend builds expose the tracker through different managers.
  }
}
