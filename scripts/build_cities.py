"""
실행: python3 scripts/build_cities.py
입력: data/cities/index.json + data/cities/<slug>.json + data/cities/<slug>.md
출력: cities/<slug>.html (9개)
"""
import json, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ERA_COLORS = {
    'cognitive':  '#7C5CBF',
    'agri':       '#2E7D32',
    'industrial': '#D62828',
    'info':       '#1565C0',
}
ERA_NAMES = {
    'cognitive':  '인지혁명기',
    'agri':       '농업혁명기',
    'industrial': '산업혁명기',
    'info':       '정보혁명기',
}
STATUS_LABELS = {
    'active': '운영중',
    'dev':    '개발중',
    'demo':   '데모',
    'planned':'계획중',
}

TEMPLATE = """<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{name} — 거버넌스 포털</title>
  <link rel="stylesheet" href="../style.css">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    .city-detail {{ max-width: 780px; margin: 32px auto; padding: 0 24px 64px; }}
    .city-meta {{ margin-bottom: 32px; }}
    .era-badge {{ display:inline-block; font-size:11px; font-weight:600; padding:2px 10px; border-radius:20px; color:#fff; margin-bottom:12px; }}
    .city-detail h1 {{ font-family: var(--font-head); font-size:28px; margin-bottom:6px; }}
    .tagline {{ color:var(--c-text-sub); font-size:15px; margin-bottom:12px; }}
    .meta-row {{ display:flex; align-items:center; gap:12px; font-size:13px; color:var(--c-text-sub); margin-bottom:10px; }}
    .stack-tags {{ display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; }}
    .city-links {{ display:flex; gap:14px; font-size:14px; margin-bottom:0; }}
    .city-body {{ line-height:1.8; }}
    .city-body h2 {{ font-family:var(--font-head); font-size:18px; margin:28px 0 10px; border-bottom:1px solid var(--c-border); padding-bottom:6px; }}
    .city-body p {{ margin-bottom:12px; }}
    .city-body pre {{ background:var(--c-surface); border:1px solid var(--c-border); border-radius:var(--radius); padding:14px 16px; overflow-x:auto; font-size:13px; margin-bottom:12px; }}
    .city-body code {{ font-size:13px; background:var(--c-surface); padding:1px 5px; border-radius:3px; }}
    .city-body pre code {{ background:none; padding:0; }}
    .city-body ul, .city-body ol {{ margin:0 0 12px 20px; }}
    .community {{ margin-top:48px; border-top:1px solid var(--c-border); padding-top:24px; }}
    .community h2 {{ font-family:var(--font-head); font-size:18px; margin-bottom:8px; }}
    .coming-soon {{ color:var(--c-text-sub); font-size:13px; }}
    .back-link {{ font-size:13px; color:var(--c-text-sub); }}
    .back-link:hover {{ color:var(--c-text); }}
  </style>
</head>
<body>
  <header class="site-header">
    <div class="header-inner">
      <a href="../index.html" class="back-link">← 문명 지도로</a>
      <span class="site-title">거버넌스 포털</span>
    </div>
  </header>
  <main class="city-detail">
    <div class="city-meta">
      <span class="era-badge" style="background:{era_color}">{era_name}</span>
      <h1>{name}</h1>
      <p class="tagline">{tagline}</p>
      <div class="meta-row">
        <span>창설 {founded}</span>
        <span class="status-badge status-{status}">{status_label}</span>
      </div>
      <div class="stack-tags">{stack_tags}</div>
      <div class="city-links">{links_html}</div>
    </div>
    <article class="city-body" id="body-content"></article>
    <section class="community" id="giscus-container">
      <h2>커뮤니티</h2>
      <p class="coming-soon">게시판 준비 중 (Phase 3)</p>
    </section>
  </main>
  <script>
    const md = {md_json};
    document.getElementById('body-content').innerHTML = marked.parse(md);
  </script>
</body>
</html>"""


def build():
    idx_path = os.path.join(BASE, 'data', 'cities', 'index.json')
    with open(idx_path) as f:
        slugs = json.load(f)

    out_dir = os.path.join(BASE, 'cities')
    os.makedirs(out_dir, exist_ok=True)

    for slug in slugs:
        json_path = os.path.join(BASE, 'data', 'cities', f'{slug}.json')
        md_path   = os.path.join(BASE, 'data', 'cities', f'{slug}.md')

        with open(json_path) as f:
            city = json.load(f)

        md_content = ''
        if os.path.exists(md_path):
            with open(md_path) as f:
                md_content = f.read()

        era_id   = city.get('era', '')
        links    = city.get('links', {})
        stack    = city.get('stack', [])

        stack_tags = ''.join(f'<span class="tag">{s}</span>' for s in stack)

        link_parts = []
        if links.get('github'):
            link_parts.append(f'<a href="{links["github"]}" target="_blank" rel="noopener">GitHub →</a>')
        if links.get('live'):
            link_parts.append(f'<a href="{links["live"]}" target="_blank" rel="noopener">라이브 →</a>')
        links_html = ''.join(link_parts)

        html = TEMPLATE.format(
            name        = city['name'],
            era_color   = ERA_COLORS.get(era_id, '#999'),
            era_name    = ERA_NAMES.get(era_id, era_id),
            tagline     = city.get('tagline', ''),
            founded     = city.get('founded', ''),
            status      = city.get('status', 'dev'),
            status_label= STATUS_LABELS.get(city.get('status', 'dev'), city.get('status', '')),
            stack_tags  = stack_tags,
            links_html  = links_html,
            md_json     = json.dumps(md_content),
        )

        out_path = os.path.join(out_dir, f'{slug}.html')
        with open(out_path, 'w') as f:
            f.write(html)
        print(f'  ✅ {slug}.html')

    print(f'\n총 {len(slugs)}개 생성 완료 → cities/')


if __name__ == '__main__':
    build()
