export function configureFullWidthDomWidget(element) {
  if (!element?.style) return;

  element.style.width = "100%";
  element.style.minWidth = "0";
  element.style.maxWidth = "100%";
  element.style.boxSizing = "border-box";
}
