# STATUS

**마지막 갱신**: 2026-06-29
**갱신자**: 시장 (Claude Cowork)

## What

내 거버넌스의 도시들을 시각적으로 보여주는 웹 대시보드.

## Now

v0.2 — 문명사 포털 Phase 1 완료 (지시 #2026-06-29-P). 로컬 정상 동작 확인.
- 라이트테마 전면 교체 (steel-attache 토큰)
- 상단 4시대 타임라인 (도시 점 hover/click)
- SVG 추상 문명 지도 (9개 도시 마커, 시대 존)
- 우측 도시 정보 패널 (클릭 시 상세)
- 모바일 720px 카드 스트림
- data/eras.json + data/cities/9개 JSON
- guide.html / president-guide.html 회귀 없음
push 승인 게이트 대기 중.

## Next

다음에 손댈 것 (3개 이내, 우선순위 순):
1. Vercel 배포 (push 승인 후 — Phase 1 확인)
2. 포털 Phase 2 — 도시 상세 페이지 `data/cities/<slug>.html` + build 스크립트
3. 포털 Phase 3 — Giscus 게시판 per-city 스레드

