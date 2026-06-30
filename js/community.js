export function initCommunity() {
  document.querySelectorAll('.sub-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.subtab;
      document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('is-active'));
      document.querySelectorAll('.sub-tab-panel').forEach(p => { p.hidden = true; });
      btn.classList.add('is-active');
      const panel = document.getElementById('subtab-' + target);
      if (panel) panel.hidden = false;
    });
  });
}
