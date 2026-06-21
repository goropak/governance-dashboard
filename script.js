/* ── 도시 메타데이터 (도시 추가 시 여기에 추가) ── */
const cityMeta = {
  'boot-pack': {
    emoji: '📦',
    description: '거버넌스 부팅 자동화 도구',
    usage: 'macOS 터미널에서 `bootpack` 실행 → 클립보드에 핵심 파일 복사 → Claude.ai에 붙여넣기',
    details: 'Python 스크립트로 governance 레포의 핵심 5개 파일(기본) 또는 전체(--all)를 합쳐 클립보드로 전달합니다.'
  },
  'governance-dashboard': {
    emoji: '🏛️',
    description: '거버넌스 도시 현황 대시보드',
    usage: '브라우저에서 index.html 열기 (또는 Vercel URL 접속)',
    details: 'cities.md를 파싱해 각 도시의 상태를 카드로 시각화합니다. 새 도시가 생길 때마다 cities.md를 업데이트하면 자동으로 반영됩니다.'
  },
  'simsteel': {
    emoji: '🏭',
    description: '제철소 부지 레이아웃 시각화',
    usage: '로컬 dev 서버 또는 Vercel 배포 URL에서 접속 (v0.4 예정)',
    details: 'SimCity 스타일 5m 격자 기반 제철소 부지 배치 시각화 도구. 레이아웃 JSON import/export, 2.5D 뷰, 배경 트레이싱 기능 포함.'
  },
  'telegram-gate': {
    emoji: '🔐',
    description: '원격 push 승인 게이트',
    usage: 'cd ~/Desktop/project/telegram-gate && python3 gate.py',
    details: '외출 중 핸드폰 텔레그램으로 governance push를 승인하는 게이트. push-pending.md를 10초마다 폴링해 "대기" 상태 감지 시 텔레그램 알림 + 승인/거부 버튼 전송. ✅ 승인 즉시 자동 git push 실행.'
  },
  'demo-city': {
    emoji: '🧪',
    description: '자동 소통 루프 실연용 데모',
    usage: '실연용 데모 도시 — 실제 서비스 없음',
    details: '보좌관↔시장 메일박스 + telegram-gate 승인 루프 end-to-end 검증용 빈 골격 데모.'
  }
};

/* ── 기본 메타데이터 (cityMeta에 없는 도시에 사용) ── */
const defaultMeta = {
  emoji: '🏙️',
  description: '설명 없음',
  usage: '',
  details: ''
};

/* ── cities.md 파싱 ── */
function parseCities(markdown) {
  const cities = [];
  // "## 운영 중인 도시" 섹션만 추출
  const sectionMatch = markdown.match(/## 운영 중인 도시([\s\S]*?)(?=\n## |$)/);
  if (!sectionMatch) return cities;

  const section = sectionMatch[1];
  // ### 도시명 블록 분리
  const blocks = section.split(/(?=### )/g).filter(b => b.trim().startsWith('###'));

  for (const block of blocks) {
    const nameMatch = block.match(/^### (.+)/m);
    if (!nameMatch) continue;

    const name = nameMatch[1].trim();
    const get = (key) => {
      const m = block.match(new RegExp(`\\*\\*${key}\\*\\*:\\s*(.+)`));
      return m ? m[1].trim() : '—';
    };

    cities.push({
      name,
      repo:      get('Repo'),
      deploy:    get('Deploy'),
      db:        get('DB'),
      status:    get('Status'),
      lastCheck: get('Last check'),
    });
  }
  return cities;
}

/* ── 카드 렌더링 ── */
function renderCards(cities) {
  const grid = document.getElementById('cities-grid');
  if (cities.length === 0) {
    grid.innerHTML = '<p class="loading">등록된 도시가 없습니다.</p>';
    return;
  }

  grid.innerHTML = '';
  for (const city of cities) {
    const meta = cityMeta[city.name] || defaultMeta;
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.status = city.status;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${city.name} 상세 보기`);

    card.innerHTML = `
      <div class="card-emoji">${meta.emoji}</div>
      <div class="card-name">${city.name}</div>
      <div class="card-desc">${meta.description}</div>
      <span class="badge badge-${city.status}">${city.status}</span>
    `;

    card.addEventListener('click', () => openModal(city, meta));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openModal(city, meta);
    });

    grid.appendChild(card);
  }
}

/* ── 모달 열기 ── */
function openModal(city, meta) {
  document.getElementById('modal-emoji').textContent = meta.emoji;
  document.getElementById('modal-title').textContent = city.name;

  const badge = document.getElementById('modal-badge');
  badge.textContent = city.status;
  badge.className = `badge badge-${city.status}`;

  document.getElementById('modal-description').textContent =
    meta.details || meta.description;

  const usageSection = document.getElementById('modal-usage-section');
  if (meta.usage) {
    document.getElementById('modal-usage').textContent = meta.usage;
    usageSection.style.display = '';
  } else {
    usageSection.style.display = 'none';
  }

  // 링크 목록
  const linksList = document.getElementById('modal-links');
  linksList.innerHTML = '';

  const links = [
    { label: 'Repo', value: city.repo },
    { label: 'Deploy', value: city.deploy },
    { label: 'Last check', value: city.lastCheck },
  ];

  if (city.repo && city.repo !== '—' && city.repo.startsWith('github.com')) {
    const base = `https://${city.repo}`;
    links.push(
      { label: 'STATUS.md', value: `${base}/blob/main/STATUS.md` },
      { label: 'README.md', value: `${base}/blob/main/README.md` },
    );
  }

  for (const { label, value } of links) {
    const li = document.createElement('li');
    if (value && value !== '—' && (value.startsWith('github.com') || value.startsWith('http'))) {
      const href = value.startsWith('http') ? value : `https://${value}`;
      li.innerHTML = `<span class="link-label">${label}</span><a href="${href}" target="_blank" rel="noopener">${value}</a>`;
    } else {
      li.innerHTML = `<span class="link-label">${label}</span>${value}`;
    }
    linksList.appendChild(li);
  }

  const modal = document.getElementById('modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/* ── 모달 닫기 ── */
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-backdrop').addEventListener('click', closeModal);

/* ── 외출 모드 가이드 모달 ── */
function openGuide() {
  const m = document.getElementById('guide-modal');
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeGuide() {
  const m = document.getElementById('guide-modal');
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.getElementById('guide-btn').addEventListener('click', openGuide);
document.getElementById('guide-close').addEventListener('click', closeGuide);
document.getElementById('guide-backdrop').addEventListener('click', closeGuide);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeModal(); closeGuide(); closeComm(); }
});

/* ── 경량 마크다운 렌더러 ──
   외부 의존성 없는 자기완결 파서(정적 사이트·빌드도구 금지 규칙 준수).
   지원: 헤더, 코드펜스, 표, 인용, 순서/비순서 목록, 수평선, 인라인(굵게/기울임/코드/링크).
   communication-guide.md가 쓰는 문법 범위에 맞춰 작성. */
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInline(text) {
  // 인라인 코드를 먼저 보호(플레이스홀더)한 뒤 나머지 인라인 변환.
  const codes = [];
  let s = escapeHtml(text).replace(/`([^`]+)`/g, (_, c) => {
    codes.push(c);
    return `\x01${codes.length - 1}\x01`;
  });
  s = s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s.replace(/\x01(\d+)\x01/g, (_, i) => `<code>${codes[+i]}</code>`);
}

function renderMarkdown(md) {
  const src = md.replace(/\r\n/g, '\n');

  // 1) 코드펜스를 먼저 빼내 플레이스홀더로 보호(내부 │┌| 등이 표·인라인으로 안 샘).
  const blocks = [];
  const noFence = src.replace(/```[^\n]*\n([\s\S]*?)```/g, (_, code) => {
    blocks.push(`<pre><code>${escapeHtml(code.replace(/\n$/, ''))}</code></pre>`);
    return `\x00${blocks.length - 1}\x00`;
  });

  const lines = noFence.split('\n');
  const out = [];
  let i = 0;
  let para = [];
  const flushPara = () => {
    if (para.length) { out.push(`<p>${para.map(renderInline).join('<br>')}</p>`); para = []; }
  };

  while (i < lines.length) {
    const line = lines[i];

    // 보호된 코드블록 (목록 안 들여쓰기된 펜스도 허용)
    const fence = line.match(/^\s*\x00(\d+)\x00\s*$/);
    if (fence) { flushPara(); out.push(blocks[+fence[1]]); i++; continue; }

    // 빈 줄
    if (/^\s*$/.test(line)) { flushPara(); i++; continue; }

    // 수평선
    if (/^(-{3,}|\*{3,})\s*$/.test(line)) { flushPara(); out.push('<hr>'); i++; continue; }

    // 헤더
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { flushPara(); out.push(`<h${h[1].length}>${renderInline(h[2])}</h${h[1].length}>`); i++; continue; }

    // 표 (헤더줄 + |---| 구분줄)
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes('-')) {
      flushPara();
      const splitRow = (r) => r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());
      const headers = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|') && !/^\s*$/.test(lines[i])) {
        rows.push(splitRow(lines[i])); i++;
      }
      let t = '<table><thead><tr>' + headers.map(c => `<th>${renderInline(c)}</th>`).join('') + '</tr></thead><tbody>';
      for (const r of rows) t += '<tr>' + r.map(c => `<td>${renderInline(c)}</td>`).join('') + '</tr>';
      t += '</tbody></table>';
      out.push(t);
      continue;
    }

    // 인용 (연속 > 줄)
    if (/^>\s?/.test(line)) {
      flushPara();
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(`<blockquote>${buf.map(renderInline).join('<br>')}</blockquote>`);
      continue;
    }

    // 순서 목록
    if (/^\s*\d+\.\s+/.test(line)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, '')); i++; }
      out.push('<ol>' + items.map(it => `<li>${renderInline(it)}</li>`).join('') + '</ol>');
      continue;
    }

    // 비순서 목록
    if (/^\s*[-*]\s+/.test(line)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, '')); i++; }
      out.push('<ul>' + items.map(it => `<li>${renderInline(it)}</li>`).join('') + '</ul>');
      continue;
    }

    // 일반 문단
    para.push(line);
    i++;
  }
  flushPara();
  return out.join('\n');
}

/* ── 소통 가이드 모달 ── */
let commLoaded = false;
async function openComm() {
  const m = document.getElementById('comm-modal');
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (!commLoaded) {
    const target = document.getElementById('comm-content');
    try {
      const res = await fetch('communication-guide.md');
      if (!res.ok) throw new Error(`communication-guide.md 로드 실패 (${res.status})`);
      target.innerHTML = renderMarkdown(await res.text());
      commLoaded = true;
    } catch (err) {
      target.innerHTML =
        `<p class="loading">⚠️ ${err.message}<br>로컬에서는 <code>python3 -m http.server 8000</code>으로 실행해주세요.</p>`;
    }
  }
}
function closeComm() {
  const m = document.getElementById('comm-modal');
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.getElementById('comm-btn').addEventListener('click', openComm);
document.getElementById('comm-close').addEventListener('click', closeComm);
document.getElementById('comm-backdrop').addEventListener('click', closeComm);

/* ── 초기화 ── */
async function init() {
  // 푸터 날짜
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById('last-updated').textContent = `Last updated: ${today}`;

  try {
    const res = await fetch('cities.md');
    if (!res.ok) throw new Error(`cities.md 로드 실패 (${res.status})`);
    const text = await res.text();
    const cities = parseCities(text);
    renderCards(cities);
  } catch (err) {
    document.getElementById('cities-grid').innerHTML =
      `<p class="loading">⚠️ ${err.message}<br>로컬에서는 <code>python3 -m http.server 8000</code>으로 실행해주세요.</p>`;
  }
}

init();
