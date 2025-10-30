document.addEventListener('DOMContentLoaded', () => {
  const panels = document.querySelectorAll<HTMLDivElement>('.slide-panel');

  panels.forEach(panel => {
    const tab = panel.querySelector<HTMLDivElement>('.slide-panel__tab');
    const arrow = panel.querySelector<HTMLElement>('.slide-panel__tab .arrow');

    if (!tab) return;

    tab.addEventListener('click', () => {
      const isCollapsed = panel.getAttribute('data-collapsed') === 'true';
      const newVal = (!isCollapsed).toString();
      panel.setAttribute('data-collapsed', newVal);

      if (arrow) {
        arrow.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  });
});
