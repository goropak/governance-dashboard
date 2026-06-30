export function loadProjects(container) {
  fetch('data/projects.json')
    .then(r => r.json())
    .then(({ items }) => {
      if (!items || items.length === 0) {
        container.innerHTML = '<p class="empty-msg">등록된 프로젝트가 없습니다.</p>';
        return;
      }
      container.innerHTML = items.map(renderCard).join('');
    })
    .catch(() => {
      container.innerHTML = '<p class="empty-msg">프로젝트를 불러오지 못했습니다.</p>';
    });
}

function renderCard(item) {
  const tags = (item.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  const stack = (item.stack || []).map(s => `<span class="tag tag--stack">${s}</span>`).join('');
  const date = item.date ? new Date(item.date).toLocaleDateString('ko-KR') : '';
  return `
  <article class="card" data-type="project">
    <div class="card-thumb card-thumb--placeholder"></div>
    <div class="card-body">
      <div class="card-meta">
        <span class="card-badge badge--project">🛠 프로젝트</span>
        <span class="card-date">${date}</span>
      </div>
      <h3 class="card-title"><a href="${item.url}">${item.title}</a></h3>
      <p class="card-desc">${item.desc}</p>
      <div class="card-tags">${tags}${stack}</div>
    </div>
  </article>`;
}
