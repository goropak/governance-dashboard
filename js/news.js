export async function loadNews(container) {
  try {
    const r = await fetch('data/news.json');
    const { items, updated } = await r.json();
    if (!items || items.length === 0) {
      container.innerHTML = '<p class="empty-msg">아직 뉴스가 없습니다. 곧 업데이트됩니다.</p>';
      return;
    }
    container.innerHTML = items.map(renderCard).join('');
  } catch {
    container.innerHTML = '<p class="empty-msg">뉴스를 불러오지 못했습니다.</p>';
  }
}

function renderCard(item) {
  const date = item.date ? new Date(item.date).toLocaleDateString('ko-KR') : '';
  return `
  <article class="card" data-type="news">
    <div class="card-thumb card-thumb--placeholder"></div>
    <div class="card-body">
      <div class="card-meta">
        <span class="card-badge badge--news">📰 뉴스</span>
        <span class="card-source">${item.source || ''}</span>
        <span class="card-date">${date}</span>
      </div>
      <h3 class="card-title"><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></h3>
      <p class="card-desc">${item.desc || ''}</p>
    </div>
  </article>`;
}
