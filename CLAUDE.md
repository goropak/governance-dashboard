# CLAUDE.md — 시장 운영 규칙

이 문서는 이 도시의 시장 에이전트가 따라야 할 규칙이다 (도구 무관 — 제5조).

## 깨어나면 (시장 부팅 의식)

"깨어나" 한 마디면 다음을 순서대로 한다:

1. `git pull --rebase origin main` — 작업 전 동기화(법률 #1). 스테일 `.git/index.lock`이 있고 리베이스 진행이 아니면 제거 후 진행.
2. `STATUS.md` 읽기 — 이 도시 현황 파악.
3. `../governance/active/outbox-to-mayor.md`에서 **이 도시(governance-dashboard) 앞으로 온 지시**를 찾는다.
4. 그 지시를 처리한다. (이 도시 지시가 없으면 "대기 지시 없음"으로 보고하고 멈춘다 — 다른 도시 지시는 건드리지 않는다.)
5. 규칙·교훈이 필요하면 `../governance/`를 **읽기로만** 참조. 쓰기·커밋은 이 레포 안에서만.
6. 끝나면 `STATUS.md` 갱신 + 결과를 `../governance/active/inbox-from-mayor.md`에 한 줄 기록. push는 승인 게이트(`approvals/`) 경유 — 임의 push 금지.

보고는 "복원 완료 — 이 도시 대기 지시: […]" 로 시작한다.

## 시작 시 필수 행동

1. `STATUS.md`를 읽고 What/Now/Next 파악
2. `INFRA.md`를 읽고 인프라 좌표 파악
3. 작업 시작 전 본인에게 진행 계획 짧게 보고

## 작업 범위

- 기본: `STATUS.md`의 Next 항목
- 범위를 넘는 작업은 본인 승인 후 진행

## 보고 의무

- 작업 단위가 끝나면 `STATUS.md`를 갱신 (Now / Next)
- 중요한 결정은 `decisions/` 폴더에 짧게 기록

## 위험 작업 (반드시 본인 승인 필수)

- 배포 설정 변경 (Vercel 연결 등)
- 외부 서비스 연동 추가
- 데이터 삭제

## 헌법·법률 준수 (원본을 가리킨다 — 제7조)

조항 본문·전체 목록은 거버넌스 레포가 단일 원본이다. 도시에 베끼지 않는다.

- 헌법 전문: 거버넌스 레포 `governance/constitution.md`
- 법률 목록·본문: 거버넌스 레포 `governance/laws/` (개수·목록을 여기서 요약하지 않는다)
- 작업 의식(제5·6조 시행): `governance/laws/cowork-protocol.md`
- 기술 교훈: `governance/lessons-cities.md` 를 태그로 grep

거버넌스 레포는 이 도시의 형제 폴더다(상대 위치: `../governance`).
경로가 기기마다 다르면 상위로 올라가며 `governance/constitution.md` 를 자동 탐색한다.
절대경로를 박지 않는다.

## 도시 고유 규칙

- 정적 사이트만 (서버 사이드 코드 금지, 빌드 도구 금지)
- 민감 정보 화면에 표시 금지 (헌법 제0조)
- 새 도시 추가 시 script.js의 `cityMeta` 객체 업데이트 필수
- cities.md는 governance 레포에서 수동 복사 (v0.2에서 자동화 검토)
