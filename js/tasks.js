export async function loadTasks(pendingEl, doneEl) {
  try {
    const r = await fetch('data/tasks.json');
    const { pending, recent_done } = await r.json();
    renderPending(pendingEl, pending || []);
    renderDone(doneEl, recent_done || []);
  } catch {
    pendingEl.innerHTML = '<p class="empty-msg">업무 데이터를 불러오지 못했습니다.</p>';
    doneEl.innerHTML = '';
  }
}

function daysWaiting(dateStr) {
  if (!dateStr) return null;
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  return diff >= 0 ? diff : null;
}

function renderPending(el, items) {
  if (items.length === 0) {
    el.innerHTML = '<p class="empty-msg">🎉 승인 대기 항목이 없습니다.</p>';
    return;
  }
  el.innerHTML = items.map(item => {
    const days = daysWaiting(item.requested_at);
    const daysBadge = days !== null ? `<span class="card-badge badge--pending">${days === 0 ? '오늘' : days + '일째 대기'}</span>` : '';
    return `
    <article class="task-row">
      <div class="card-meta">
        ${daysBadge}
        <span class="tag">${item.city}</span>
        <span class="card-date">${item.requested_at || ''}</span>
        <span class="card-source">${item.requester}</span>
      </div>
      <h3 class="task-title">${item.title || '(제목 없음)'}</h3>
      ${item.what ? `<p class="card-desc">${item.what}</p>` : ''}
    </article>`;
  }).join('');
}

function renderDone(el, items) {
  if (items.length === 0) {
    el.innerHTML = '<p class="empty-msg">최근 처리 내역이 없습니다.</p>';
    return;
  }
  el.innerHTML = items.map(item => {
    const cls = item.status === '완료' ? 'badge--done' : 'badge--failed';
    const icon = item.status === '완료' ? '✅' : '❌';
    return `
    <article class="task-row task-row--done">
      <div class="card-meta">
        <span class="card-badge ${cls}">${icon} ${item.status}</span>
        <span class="tag">${item.city}</span>
        <span class="card-date">${item.requested_at || ''}</span>
      </div>
      <h3 class="task-title">${item.title || item.id}</h3>
    </article>`;
  }).join('');
}
