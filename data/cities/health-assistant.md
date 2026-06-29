## 창설 배경

혈압·체중·공복혈당·간수치 등 개인 건강 지표를 체계적으로 기록하고, AI가 안전하게 해석 코멘트를 제공하는 주치의 서비스가 필요했다. 검진 결과지를 매번 찾아볼 필요 없이 추세를 한눈에 파악한다.

## 핵심 기능

- **건강 지표 기록** — 혈압·체중·공복혈당·간수치 등 FHIR-lite Observation 패턴
- **AI 해석** — Claude Haiku가 결정론적 safety_level 레이어를 거쳐 한국어 코멘트 제공
- **Supabase 저장** — 개인 계정 RLS 격리, 안전한 데이터 보관
- **Vercel 배포** — 언제 어디서나 접속

## 기술 스택

- Next.js
- Supabase (Postgres + RLS)
- Claude Haiku API (건강 해석)
- Vercel

## 사용 방법

[health-assistant-puce.vercel.app](https://health-assistant-puce.vercel.app) 접속 후 로그인 → 지표 기록 → AI 해석 확인.

첫 사용 시 Supabase에서 `interpret_cache` 테이블 마이그레이션 필요 (`supabase/migrations/20260621000002_interpret_cache.sql`).

## 연결

- GitHub: [goropak/health-assistant](https://github.com/goropak/health-assistant)
- 사이트: [health-assistant-puce.vercel.app](https://health-assistant-puce.vercel.app)
