## 창설 배경

개인 지식 서고 공개 포털 — 서점 스타일 홈 + 책 1권 단위 지식 카드(요약+SVG) + 위키 색인. 원문은 Drive에 보관하고, 포털은 요약과 색인만 담는다. governance가 "일하는 기억"이라면 고로문고는 그와 별개의 "아는 것의 서고" 층이다. 배운 지식·프로필·디자인 자산이 세션과 함께 증발하지 않고, 새 프로젝트 시작 시 즉시 재사용되는 외장 기억을 만든다.

## 핵심 기능

- **책 1권 단위 지식 카드** — 핵심/가치/활용법/시사점 고정 구조 요약 + SVG 인포그래픽
- **5개 서가** — 건강·취미 / 경제·경영 / 역사 / 제철 / AI·IT 주제별 진열
- **검색·색인** — Pagefind 전문 검색 + 가나다·태그 색인
- **관련 문서 추천** — 수동 지정 + 자동 점수식(서가·태그·시리즈·유형) 상위 5권
- **공개 범위 3단계** — public / private_stub(제목만 공개) / private

## 기술 스택

- HTML / CSS (정적 사이트, build.py 렌더)
- Python (scripts/build.py — stdlib 우선)
- Pagefind (post-build 검색 인덱싱)
- Vercel (Root=site, main push 자동 배포)

## 사용 방법

입고 워크플로 (수동 — 보좌관 편집실):

1. `content/books/bk-YYYY-NNNN/`에 book.json + summary.md 작성 (EDITORIAL.md 요약 8규격)
2. `python3 scripts/build.py` — content → site 렌더
3. 커밋 + push 승인 게이트 → Vercel 자동 배포

## 연결

- GitHub: [goropak/goro-stacks](https://github.com/goropak/goro-stacks)
- 라이브: [goro-stacks.vercel.app](https://goro-stacks.vercel.app)
- 관련 도시: steel-attache (STYLE-GUIDE 디자인 정본), telegram-gate (push 승인 게이트)
