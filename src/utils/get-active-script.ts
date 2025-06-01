import { getHtmlElement } from "./get-html-element";

/**
 * Retrieves the script element that loaded the current module.
 *
 * This function uses import.meta.url to identify the current module's URL,
 * then finds the corresponding script element in the DOM that has this URL
 * as its src attribute.
 *
 * @returns The HTMLScriptElement for the current module, or null if not found
 *
 * @example
 * // Get the script element that loaded this module
 * const scriptElement = getActiveScript();
 * console.log(scriptElement);
 * // Output: <script src="path/to/current/module.js"></script>
 */
export const getActiveScript = () => {
  const currentModuleUrl = import.meta.url;
  return getHtmlElement<HTMLScriptElement>({
    selector: `script[src="${currentModuleUrl}"]`,
  });
};
