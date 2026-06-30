import { getLang } from './lang.js';

let _container = null;
let _items = [];

export async function loadNews(container) {
  _container = container;
  try {
    const r = await fetch('data/news.json');
    const { items } = await r.json();
    _items = items || [];
    if (_items.length === 0) {
      container.innerHTML = '<p class="empty-msg">아직 뉴스가 없습니다. 곧 업데이트됩니다.</p>';
      return;
    }
    render();
  } catch {
    container.innerHTML = '<p class="empty-msg">뉴스를 불러오지 못했습니다.</p>';
  }
}

export function rerenderNews() {
  if (_container && _items.length > 0) render();
}

function render() {
  _container.innerHTML = _items.map(renderCard).join('');
}

function renderCard(item) {
  const lang = getLang();
  const title = (lang === 'ko' && item.title_ko) ? item.title_ko : item.title;
  const desc  = (lang === 'ko' && item.desc_ko)  ? item.desc_ko  : (item.desc || '');
  const date  = item.date ? new Date(item.date).toLocaleDateString('ko-KR') : '';
  const thumb = item.thumb
    ? `<div class="card-thumb"><img src="${item.thumb}" alt="" loading="lazy" onerror="this.parentElement.className='card-thumb card-thumb--placeholder'"></div>`
    : `<div class="card-thumb card-thumb--placeholder"></div>`;
  return `
  <article class="card" data-type="news">
    ${thumb}
    <div class="card-body">
      <div class="card-meta">
        <span class="card-badge badge--news">📰 뉴스</span>
        <span class="card-source">${item.source || ''}</span>
        <span class="card-date">${date}</span>
      </div>
      <h3 class="card-title"><a href="${item.url}" target="_blank" rel="noopener">${title}</a></h3>
      <p class="card-desc">${desc}</p>
    </div>
  </article>`;
}
