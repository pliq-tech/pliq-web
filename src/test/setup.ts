import { afterEach } from "bun:test";
import { GlobalWindow } from "happy-dom";

const window = new GlobalWindow();

const globals = [
  "document",
  "HTMLElement",
  "HTMLDivElement",
  "HTMLButtonElement",
  "HTMLInputElement",
  "HTMLAnchorElement",
  "HTMLLabelElement",
  "HTMLUListElement",
  "HTMLOListElement",
  "HTMLLIElement",
  "HTMLTableElement",
  "HTMLFormElement",
  "HTMLImageElement",
  "HTMLSelectElement",
  "HTMLTextAreaElement",
  "HTMLHeadingElement",
  "Element",
  "Node",
  "Text",
  "DocumentFragment",
  "Event",
  "MouseEvent",
  "KeyboardEvent",
  "FocusEvent",
  "TouchEvent",
  "CustomEvent",
  "MutationObserver",
  "navigator",
  "location",
  "getComputedStyle",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "setTimeout",
  "clearTimeout",
  "setInterval",
  "clearInterval",
  "SVGElement",
  "HTMLPreElement",
  "MediaQueryList",
  "matchMedia",
  "localStorage",
] as const;

for (const key of globals) {
  if (key in window) {
    Object.defineProperty(globalThis, key, {
      value: (window as Record<string, unknown>)[key],
      writable: true,
      configurable: true,
    });
  }
}

if (!("window" in globalThis)) {
  Object.defineProperty(globalThis, "window", {
    value: window,
    writable: true,
    configurable: true,
  });
}

afterEach(() => {
  document.body.innerHTML = "";
});
