const initDropdownImprovements = () => {
  const webflowDropdownElements = Array.from(document.querySelectorAll(".w-dropdown"));
  for (const dropdownElement of webflowDropdownElements) {
    const dropdownToggle = dropdownElement.querySelector(".w-dropdown-toggle");
    if (!dropdownToggle) {
      console.warn("Dropdown toggle not found for:", dropdownElement);
      continue;
    }
    const dropdownList = dropdownElement.querySelector(".w-dropdown-list");
    if (!dropdownList) {
      console.warn("Dropdown list not found for:", dropdownElement);
      continue;
    }
    console.log(dropdownList);
  }
};
window.Webflow || (window.Webflow = []);
window.Webflow.push(() => {
  initDropdownImprovements();
});
