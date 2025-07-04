import { autoUpdate, computePosition, flip, shift, size } from "@floating-ui/dom";
import {
  addWFCustomPageLoadFeature,
  afterWebflowReady,
  getActiveScript,
  getHtmlElement,
  getMultipleHtmlElements,
  setStyle,
} from "@taj-wf/utils";

const PROPERTIES = {
  globalDropdownMargin: "global-dropdown-margin",
  elementDropdownMargin: "data-dropdown-margin",
  ignoreImprovements: "data-ignore-dropdown-improvements",
} as const;

const getGlobalDropdownMargin = () => {
  const scriptElement = getActiveScript(import.meta.url);

  if (!scriptElement) return null;

  return scriptElement.getAttribute(PROPERTIES.globalDropdownMargin);
};

const dropdownImprovementsDestroyers: Array<() => void> = [];

const destroyDropdownImprovements = () => {
  for (const destroy of dropdownImprovementsDestroyers) {
    destroy();
  }
};

const initDropdownImprovements = () => {
  const DEFAULT_MARGIN = "0.5rem";

  const globalDropdownMargin = getGlobalDropdownMargin();

  if (!globalDropdownMargin) {
    console.debug(
      `No global dropdown margin found in the script tag with ${PROPERTIES.globalDropdownMargin}, using default:`,
      DEFAULT_MARGIN
    );
  }

  const webflowDropdownElements = getMultipleHtmlElements({ selector: ".w-dropdown" });

  if (!webflowDropdownElements) return;

  for (const dropdownElement of webflowDropdownElements) {
    if (dropdownElement.hasAttribute(PROPERTIES.ignoreImprovements)) continue;

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

    dropdownList.setAttribute("data-lenis-prevent", "true");
    dropdownList.style.overflowY = "auto";

    const dropdownMargin =
      dropdownElement.getAttribute(PROPERTIES.elementDropdownMargin) ||
      globalDropdownMargin ||
      DEFAULT_MARGIN;

    const initialStyles = {
      minWidth: dropdownList.style.minWidth || "",
      top: dropdownList.style.top || "",
      transform: dropdownList.style.transform || "",
    };

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

    const killAutoUpdateModalPosition = autoUpdate(dropdownToggle, dropdownList, setModalPosition);

    const destroy = () => {
      killAutoUpdateModalPosition();
      setStyle(dropdownList, initialStyles);
      dropdownList.style.removeProperty("overflow-y");
    };

    dropdownImprovementsDestroyers.push(destroy);
  }
};

afterWebflowReady(() => {
  initDropdownImprovements();

  addWFCustomPageLoadFeature({
    name: "IMPROVED_DROPDOWNS",
    async: false,
    init: initDropdownImprovements,
    destroy: destroyDropdownImprovements,
    reInit: () => {
      destroyDropdownImprovements();
      initDropdownImprovements();
    },
  });
});
