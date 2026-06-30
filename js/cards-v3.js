export function loadProjects(container) {
  fetch('data/projects.json')
    .then(r => r.json())
    .then(({ items }) => {
      if (!items || items.length === 0) {
        container.innerHTML = '<p class="empty-msg">등록된 프로젝트가 없습니다.</p>';
        return;
      }
      container.innerHTML = items.map(renderCard).join('');
      // 카드 전체 클릭 → 도시 페이지 이동
      container.querySelectorAll('.card[data-type="project"]').forEach(card => {
        card.addEventListener('click', e => {
          if (!e.target.closest('a')) {
            const url = card.dataset.url;
            if (url && url !== '#') location.href = url;
          }
        });
      });
    })
    .catch(() => {
      container.innerHTML = '<p class="empty-msg">프로젝트를 불러오지 못했습니다.</p>';
    });
}

function renderTags(tags = []) {
  const show = tags.slice(0, 4);
  const rest = tags.length - 4;
  const chips = show.map(t => `<span class="card-tag">${t}</span>`).join('');
  return `<div class="card-tags">${chips}${rest > 0 ? `<span class="card-tag">+${rest}</span>` : ''}</div>`;
}

function renderCard(item) {
  const date = item.date ? new Date(item.date).toLocaleDateString('ko-KR') : '';
  const url = item.url || '#';
  const allTags = [...(item.tags || []), ...(item.stack || [])];
  const thumb = item.thumb
    ? `<div class="card-thumb"><img src="${item.thumb}" alt="" loading="lazy" onerror="this.parentElement.className='card-thumb card-thumb--placeholder'"></div>`
    : `<div class="card-thumb card-thumb--placeholder"></div>`;
  return `
  <article class="card" data-type="project" data-url="${url}" style="cursor:pointer">
    ${thumb}
    <div class="card-body">
      <div class="card-meta">
        <span class="card-badge badge--project">🛠 프로젝트</span>
        <span class="card-date">${date}</span>
      </div>
      <h3 class="card-title"><a href="${url}">${item.title}</a></h3>
      <p class="card-desc">${item.desc}</p>
      <div class="card-footer">
        ${renderTags(allTags)}
        <a href="${url}#giscus-container" class="card-discuss-link">💬 게시판</a>
      </div>
    </div>
  </article>`;
}
