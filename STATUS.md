# STATUS

**마지막 갱신**: 2026-06-29
**갱신자**: 시장 (Claude Cowork)

## What

내 거버넌스의 도시들을 시각적으로 보여주는 웹 대시보드.

## Now

v0.3 — 문명사 포털 Phase 2 완료 (지시 #2026-06-29-P2). 로컬 정상 동작 확인.
- 라이트테마 전면 교체 (steel-attache 토큰)
- 상단 4시대 타임라인 (도시 점 hover/click)
- SVG 추상 문명 지도 (9개 도시 마커, 시대 존)
- 우측 도시 정보 패널 (클릭 시 상세)
- 모바일 720px 카드 스트림
- data/eras.json + data/cities/9개 JSON
- data/cities/9개 MD (도시 본문) + scripts/build_cities.py
- cities/9개 HTML (상세 페이지, ← 문명 지도로 링크, Giscus 자리)
- 패널 "상세 페이지 →" 링크 활성화
- guide.html / president-guide.html 회귀 없음
push 승인 게이트 대기 중.

## Next

다음에 손댈 것 (3개 이내, 우선순위 순):
1. Vercel 배포 (push 승인 후)
2. 포털 Phase 3 — Giscus 게시판 per-city 스레드
3. 도시 JSON 데이터 정교화 (각 도시 실제 founded 날짜 검증)

