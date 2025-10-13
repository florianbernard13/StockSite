document.addEventListener('DOMContentLoaded', () => {
  const panel = document.querySelector<HTMLDivElement>('.slide-panel');
  const tab = panel?.querySelector<HTMLDivElement>('.slide-panel__tab');

  if (!panel || !tab) return;

  tab.addEventListener('click', () => {
    const isCollapsed = panel.getAttribute('data-collapsed') === 'true';

    panel.setAttribute('data-collapsed', (!isCollapsed).toString());
  });
});