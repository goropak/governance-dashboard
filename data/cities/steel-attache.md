## 창설 배경

포스코 관점에서 세계 철강 시장을 추적·분석하는 전문 블로그가 필요했다. 추측 없이 1차 자료 기반으로 해외 제철소의 조업·설비·전략을 정기 브리핑하고, telegram-gate로 자동 발행하는 무인 파이프라인을 구축한다.

## 핵심 기능

- **주간 브리핑** — 최근 7일 철강 이슈 요약 초안 자동 생성 (검토 후 발행)
- **전략 분석** — 일본·중국·미국·유럽·인도·현대제철 6개 국가/회사 모듈
- **Q&A** — 제철소 운영 질의응답
- **GitHub Pages 정적 배포** — git push = 발행, 무인 워크플로

## 기술 스택

- HTML / CSS (정적 사이트)
- GitHub Pages
- telegram-gate (push 승인 자동화)

## 사용 방법

콘텐츠 발행 워크플로:

1. `drafts/` 폴더에 MD 초안 작성
2. 검토 4문 통과 (PUBLISH.md §3 참조)
3. `site/`에 HTML 변환 후 커밋
4. telegram-gate로 push 승인 → 자동 발행

## 연결

- GitHub: [goropak/steel-attache-site](https://github.com/goropak/steel-attache-site)
- 관련 도시: telegram-gate (발행 push 게이트)
