# STATUS — governance-dashboard

## 💡 Why (존재 이유)
여러 도시가 지금 어디 있는지 3초 안에 파악하기 위해. 컨텍스트 스위칭 비용 없이 포트폴리오 전체를 조감하는 지휘센터.

## 🎯 Destination (완성 모습)
모든 도시의 Destination·Stage·최근 활동을 한 화면에서 보고, 각 도시 상세 페이지와 게시판으로 들어갈 수 있는 문명 포털. portfolio-northstar와 연동해 Stage 진행률까지 시각화.

## 🗺️ Stages (여정 단계)
> ✅ 완료 / ← 현재 / (대기)
- Stage 1: 기본 대시보드 (도시 목록·상태 표시) ✅
- Stage 2: 문명사 포털 v2 (타임라인·SVG 지도·도시 패널·상세 페이지) ✅
- Stage 3: Giscus 게시판 (도시별 스레드) ✅
- Stage 4: 실시간 Stage 진행률 표시 (Destination 도달)

---

**마지막 갱신**: 2026-06-30
**갱신자**: 시장 (Claude Code)

## What

내 거버넌스의 도시들을 시각적으로 보여주는 웹 대시보드.

## Now

v0.5 — 포털 v4 완료 (지시 #2026-06-30-V4). push 승인 대기 중.
- 네비게이션 링크 수정: communication-guide.html / vault.html / submit.html
- 쇼케이스 카드 → cities/[slug].html 클릭 연결 + 💬 게시판 배지
- 카드 고정높이 380px + 썸네일 180px + 설명 2줄 clamp + 태그 +N
- 언어 토글 EN↔KO (localStorage 유지, 뉴스 제목·요약 즉시 전환)
- 커뮤니티 탭(4번째): 전체 토론(Giscus) + 도시별 드롭다운
- 지도 탭 첫 진입 시 첫 번째 도시 자동 선택
- RSS 피드 6→10개 확대 (DeepMind·Meta AI·BAIR·AI Edge 추가)
- og:image 썸네일 파싱 (fetch_news.py)
- deep-translator 한국어 번역 파이프라인 (news.json title_ko/desc_ko)
- Giscus 테마 동기화 (다크/라이트 토글 시 iframe 메시지)

## Next

다음에 손댈 것 (3개 이내, 우선순위 순):
1. GitHub Actions fetch-news.yml 수동 트리거 → news.json 썸네일·번역 확인
2. 커스텀 도메인 연결 (Add Custom Domain)
3. Stage 4: 실시간 Stage 진행률 표시

