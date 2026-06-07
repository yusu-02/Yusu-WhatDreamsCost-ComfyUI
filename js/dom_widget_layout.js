export function configureFullWidthDomWidget(element) {
  if (!element?.style) return;

  element.style.width = "100%";
  element.style.minWidth = "0";
  element.style.maxWidth = "100%";
  element.style.boxSizing = "border-box";
}

export function getFullWidthDomWidgetSize(node, height, legacyWidth) {
  const nodeWidth = Number(node?.size?.[0]);
  const fallbackWidth = Number(legacyWidth);
  const width = Number.isFinite(fallbackWidth) && fallbackWidth > 0
    ? fallbackWidth
    : (Number.isFinite(nodeWidth) && nodeWidth > 0 ? nodeWidth : 0);

  return [width, height];
}

export function bindDomWidgetWidthToNode(widget, node) {
  if (!widget || !node) return;

  const descriptor = Object.getOwnPropertyDescriptor(widget, "width");
  if (descriptor && !descriptor.configurable) return;

  Object.defineProperty(widget, "width", {
    configurable: true,
    enumerable: true,
    get() {
      const width = Number(node?.size?.[0]);
      return Number.isFinite(width) && width > 0 ? width : undefined;
    },
    set() {
      // Nodes 2.0's side panel writes its own narrow width here.
    },
  });
}

export function configureFixedControlInput(element, width) {
  if (!element?.style) return;

  const pixelWidth = `${width}px`;
  element.style.width = pixelWidth;
  element.style.minWidth = pixelWidth;
  element.style.maxWidth = pixelWidth;
  element.style.flex = `0 0 ${pixelWidth}`;
  element.style.boxSizing = "border-box";
}

export function installDirectorStyles(documentRef, styleId, cssText) {
  if (!documentRef?.head || documentRef.getElementById(styleId)) return false;

  const styleElement = documentRef.createElement("style");
  styleElement.id = styleId;
  styleElement.textContent = cssText;
  documentRef.head.appendChild(styleElement);
  return true;
}
