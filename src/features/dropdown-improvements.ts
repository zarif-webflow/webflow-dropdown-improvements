const initDropdownImprovements = () => {
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

    console.log(dropdownList);
  }
};

// @ts-expect-error
window.Webflow ||= [];
// @ts-expect-error
window.Webflow.push(() => {
  initDropdownImprovements();
});
