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
  const width = Number.isFinite(nodeWidth) && nodeWidth > 0
    ? nodeWidth
    : (Number.isFinite(fallbackWidth) && fallbackWidth > 0 ? fallbackWidth : 0);

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
