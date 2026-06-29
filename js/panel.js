import Store from './sync.js';

const STATUS_LABEL = { active: '운영중', dev: '개발중', planned: '계획중', demo: '데모' };

function render(city, eras) {
  if (!city) {
    return '<p class="panel-hint">도시를 선택하면 상세 정보가 표시됩니다.</p>';
  }
  const era = eras.find(e => e.id === city.era);
  const eraColor = era ? era.color : '#999';
  const statusLabel = STATUS_LABEL[city.status] || city.status;

  const stackTags = (city.stack || []).map(s => `<span class="tag">${s}</span>`).join('');
  const githubLink = city.links?.github
    ? `<a href="${city.links.github}" target="_blank" rel="noopener">GitHub →</a>` : '';
  const liveLink = city.links?.live
    ? `<a href="${city.links.live}" target="_blank" rel="noopener">라이브 →</a>` : '';

  const historyRows = (city.history || []).map(h =>
    `<tr><td>${h.date}</td><td>${h.version}</td><td>${h.note}</td></tr>`
  ).join('');

  return `
    <div class="panel-era-badge" style="background:${eraColor}20;color:${eraColor}">
      ${era ? era.name : city.era}
    </div>
    <h2 class="panel-name">${city.name}</h2>
    <p class="panel-tagline">${city.tagline}</p>
    <p class="panel-meta">착공: ${city.founded} &nbsp;|&nbsp; <span class="status-badge status-${city.status}">${statusLabel}</span></p>
    <div class="panel-tags">${stackTags}</div>
    <div class="panel-links">${githubLink}${liveLink}</div>
    ${historyRows ? `
    <table class="panel-history">
      <thead><tr><th>날짜</th><th>버전</th><th>내용</th></tr></thead>
      <tbody>${historyRows}</tbody>
    </table>` : ''}
    <a class="detail-link" href="#" style="display:none">상세 페이지 →</a>
  `;
}

document.addEventListener('data:ready', () => {
  const { eras, cities } = window.GovData;
  const panel = document.getElementById('panel');
  if (!panel) return;

  panel.innerHTML = render(null, eras);

  Store.subscribe((event, state) => {
    if (event !== 'active' && event !== 'clear') return;
    const city = cities.find(c => c.slug === state.activeCity) || null;
    panel.innerHTML = render(city, eras);
  });
});
