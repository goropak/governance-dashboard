# STATUS — governance-dashboard

## 💡 Why (존재 이유)
여러 도시가 지금 어디 있는지 3초 안에 파악하기 위해. 컨텍스트 스위칭 비용 없이 포트폴리오 전체를 조감하는 지휘센터.

## 🎯 Destination (완성 모습)
모든 도시의 Destination·Stage·최근 활동을 한 화면에서 보고, 각 도시 상세 페이지와 게시판으로 들어갈 수 있는 문명 포털. portfolio-northstar와 연동해 Stage 진행률까지 시각화.

## 🗺️ Stages (여정 단계)
> ✅ 완료 / ← 현재 / (대기)
- Stage 1: 기본 대시보드 (도시 목록·상태 표시) ✅
- Stage 2: 문명사 포털 v2 (타임라인·SVG 지도·도시 패널·상세 페이지) ✅
- Stage 3: Giscus 게시판 (도시별 스레드) ← 현재
- Stage 4: 실시간 Stage 진행률 표시 (Destination 도달)

---

**마지막 갱신**: 2026-06-29
**갱신자**: 시장 (Claude Cowork)

## What

내 거버넌스의 도시들을 시각적으로 보여주는 웹 대시보드.

## Now

v0.4 — 포털 v3 AI 커뮤니티 허브 완료 (지시 #2026-06-29-P3 + #2026-06-30-V3). 로컬 정상 동작 확인.
- 라이트테마 전면 교체 (steel-attache 토큰)
- 상단 4시대 타임라인 (도시 점 hover/click)
- SVG 추상 문명 지도 (9개 도시 마커, 시대 존)
- 우측 도시 정보 패널 (클릭 시 상세)
- 모바일 720px 카드 스트림
- 다크 테마 기본값 + 라이트 토글 (localStorage 유지)
- 탭 구조: 뉴스 / 쇼케이스 / 지도
- 뉴스 탭: data/news.json fetch·렌더 (GitHub Actions 6h cron 자동 업데이트)
- 쇼케이스 탭: 9개 도시 프로젝트 카드
- 지도 탭: 기존 SVG 문명지도·타임라인·패널 (회귀 없음)
- Giscus 위젯: cities/*.html 9개 도시별 독립 스레드
- submit.html: Formspree 프로젝트 제출 폼
push 승인 게이트 대기 중.

## Next

다음에 손댈 것 (3개 이내, 우선순위 순):
1. Vercel 배포 (push 승인 후)
2. GitHub Actions fetch-news.yml 수동 트리거 → news.json 첫 데이터 확인
3. 뉴스 썸네일 자동 추출 (v4 — og:image 파싱)

