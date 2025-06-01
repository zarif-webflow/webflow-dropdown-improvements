import { autoUpdate, computePosition, flip, shift, size } from "@floating-ui/dom";

import { afterWebflowReady } from "@/utils/after-webflow-ready";
import { getHtmlElement, getMultipleHtmlElements } from "@/utils/get-html-element";
import { setStyle } from "@/utils/set-style";

const initDropdownImprovements = () => {
  const DEFAULT_MARGIN = "0.5rem";

  const windowSpecifiedMargin =
    "globalDropdownMargin" in window && typeof window.globalDropdownMargin === "string"
      ? window.globalDropdownMargin
      : DEFAULT_MARGIN;

  const webflowDropdownElements = getMultipleHtmlElements({ selector: ".w-dropdown" });

  if (!webflowDropdownElements) return;

  for (const dropdownElement of webflowDropdownElements) {
    const dropdownToggle = getHtmlElement({
      selector: ".w-dropdown-toggle",
      parent: dropdownElement,
    });
    if (!dropdownToggle) {
      console.debug("Dropdown toggle not found for:", dropdownElement);
      continue;
    }

    const dropdownList = getHtmlElement({
      selector: ".w-dropdown-list",
      parent: dropdownElement,
    });
    if (!dropdownList) {
      console.debug("Dropdown list not found for:", dropdownElement);
      continue;
    }

    const dropdownMargin =
      dropdownElement.getAttribute("data-dropdown-margin") ||
      windowSpecifiedMargin ||
      DEFAULT_MARGIN;

    const setModalPosition = () => {
      computePosition(dropdownToggle, dropdownList, {
        placement: "bottom-start",
        middleware: [
          flip(),
          shift(),
          size({
            apply: ({ rects }) => {
              setStyle(dropdownList, { minWidth: `${rects.reference.width}px` });
            },
          }),
        ],
      }).then(({ y, placement }) => {
        setStyle(dropdownList, {
          top: `${y}px`,
          transform: placement.includes("bottom")
            ? `translateY(${dropdownMargin})`
            : `translateY(calc(-1 * ${dropdownMargin}))`,
        });
      });
    };

    autoUpdate(dropdownToggle, dropdownList, setModalPosition);
  }
};

afterWebflowReady(() => {
  initDropdownImprovements();
});
