import { setStyle } from '@/utils/util';
import { autoUpdate, computePosition, flip, shift, size } from '@floating-ui/dom';

const initDropdownImprovements = () => {
  const DEFAULT_MARGIN = '0.5rem';

  const windowSpecifiedMargin =
    'globalDropdownMargin' in window && typeof window.globalDropdownMargin === 'string'
      ? window.globalDropdownMargin
      : DEFAULT_MARGIN;

  const webflowDropdownElements = Array.from(document.querySelectorAll<HTMLElement>('.w-dropdown'));

  for (const dropdownElement of webflowDropdownElements) {
    const dropdownToggle = dropdownElement.querySelector<HTMLElement>('.w-dropdown-toggle');

    if (!dropdownToggle) {
      console.warn('Dropdown toggle not found for:', dropdownElement);
      continue;
    }

    const dropdownList = dropdownElement.querySelector<HTMLElement>('.w-dropdown-list');
    if (!dropdownList) {
      console.warn('Dropdown list not found for:', dropdownElement);
      continue;
    }

    const dropdownMargin =
      dropdownElement.getAttribute('data-dropdown-margin') ||
      windowSpecifiedMargin ||
      DEFAULT_MARGIN;

    const setModalPosition = () => {
      computePosition(dropdownToggle, dropdownList, {
        placement: 'bottom-start',
        middleware: [
          flip(),
          shift(),
          size({
            apply: ({ rects }) => {
              setStyle(dropdownList, { 'min-width': `${rects.reference.width}px` });
            },
          }),
        ],
      }).then(({ y, placement }) => {
        setStyle(dropdownList, {
          top: `${y}px`,
          transform: placement.includes('bottom')
            ? `translateY(${dropdownMargin})`
            : `translateY(calc(-1 * ${dropdownMargin}))`,
        });
      });
    };

    autoUpdate(dropdownToggle, dropdownList, setModalPosition);
  }
};

// @ts-expect-error
window.Webflow ||= [];
// @ts-expect-error
window.Webflow.push(() => {
  initDropdownImprovements();
});
