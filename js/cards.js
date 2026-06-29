import Store from './sync.js';

const STATUS_LABEL = { active: '운영중', dev: '개발중', planned: '계획중', demo: '데모' };

document.addEventListener('data:ready', () => {
  const { eras, cities } = window.GovData;
  const container = document.getElementById('cards');
  if (!container) return;

  const eraMap = Object.fromEntries(eras.map(e => [e.id, e]));

  cities.forEach(city => {
    const era = eraMap[city.era];
    const eraColor = era ? era.color : '#999';
    const statusLabel = STATUS_LABEL[city.status] || city.status;

    const card = document.createElement('div');
    card.className = 'mobile-card';
    card.dataset.slug = city.slug;
    card.innerHTML = `
      <span class="card-era-badge" style="background:${eraColor}20;color:${eraColor}">${era ? era.name : city.era}</span>
      <strong class="card-name">${city.name}</strong>
      <span class="card-tagline">${city.tagline}</span>
      <span class="status-badge status-${city.status}">${statusLabel}</span>
    `;
    card.addEventListener('click', () => Store.setActive(city.slug));
    container.appendChild(card);
  });

  Store.subscribe((event, state) => {
    container.querySelectorAll('.mobile-card').forEach(card => {
      card.classList.toggle('is-active', card.dataset.slug === state.activeCity);
    });
  });
});
