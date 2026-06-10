# 도시 명부

운영 중인 모든 프로젝트(=도시)의 인덱스.
각 도시의 상세는 해당 레포의 `STATUS.md`와 `INFRA.md` 참조.

## 형식 예시

### [도시 이름]
- **Repo**: github.com/.../...
- **Deploy**: ...
- **DB**: ...
- **Status**: 운영중 / 개발중 / 방치 / 폐쇄
- **Last check**: YYYY-MM-DD
- **Pre-City Education**: N/A / 완료 / 회고적 / 생략
- **Education Doc**: briefing/... 또는 N/A

---

## 운영 중인 도시

### boot-pack
- **Repo**: github.com/goropak/boot-pack
- **Deploy**: 없음 (로컬 스크립트)
- **DB**: 없음
- **Status**: 개발중
- **Last check**: 2026-05-26
- **Pre-City Education**: N/A
- **Education Doc**: N/A

### governance-dashboard
- **Repo**: github.com/goropak/governance-dashboard
- **Deploy**: Vercel (배포 완료)
- **DB**: 없음
- **Status**: 개발중
- **Last check**: 2026-05-28
- **Pre-City Education**: N/A
- **Education Doc**: N/A

### simsteel
- **Repo**: github.com/goropak/simsteel
- **Deploy**: TBD (Vercel, v0.4 예정)
- **DB**: Supabase (v0.4 예정)
- **목적**: 제철소 부지 레이아웃 시각화 (SimCity 스타일, 5m 격자)
- **Status**: v0.2.8 완료, v0.2.9 export 착수 예정
- **특이사항**: 외부 참조 자료 시스템 보유 (PDF 6개, Tier 분류, 총 45.5 MB)
- **Last check**: 2026-06-02
- **Pre-City Education**: 완료 (회고적, 2026-05-30)
- **Education Doc**: laws/pre-city-education-protocol.md
- **보안**: pre-commit hook 설치 (비밀값 평문 커밋 차단, 헌법 0조)

### telegram-gate
- **Repo**: github.com/goropak/telegram-gate
- **Deploy**: 없음 (로컬 폴링 봇)
- **DB**: 없음
- **목적**: 외출 중 핸드폰으로 거버넌스 push 원격 승인·완결. 텔레그램 Bot API + 인라인 키보드 + 폴링 기반 게이트 온오프.
- **모델**: "외출 중 push 완결" (승인 즉시 봇이 git push 실행)
- **Status**: v0.2 작동 검증 완료 (2026-06-07) — 자동 push는 v0.2.x로 분리
- **Last check**: 2026-06-07
- **Pre-City Education**: 완료 (2026-06-04)
- **Education Doc**: N/A (briefing 별도 없음, 함정은 lessons-cities.md #telegram)
- **보안**: pre-commit hook 설치 (Telegram 토큰 포함 비밀값 차단, 헌법 제0조 법률 #4)

### demo-city
- **Repo**: 미생성 (로컬 git 폴더만 존재 — GitHub 레포 미생성)
- **Deploy**: 없음
- **DB**: 없음
- **목적**: 자동 소통 루프 실연용 데모 도시 (보좌관↔시장 메일박스 + telegram-gate 승인 루프 검증)
- **Status**: 데모
- **Last check**: 2026-06-10
- **Pre-City Education**: 생략 (법률 #2 — 빈 골격 데모)
- **Education Doc**: N/A

## 폐쇄된 도시

(없음)
