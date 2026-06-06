export const SETTINGS_WIDGETS_VISIBLE_PROPERTY = "yusuSettingsWidgetsVisible";

export function resolveSettingsWidgetsVisible(properties) {
  return properties?.[SETTINGS_WIDGETS_VISIBLE_PROPERTY] === true;
}

export function saveSettingsWidgetsVisible(properties, visible) {
  properties[SETTINGS_WIDGETS_VISIBLE_PROPERTY] = Boolean(visible);
}
