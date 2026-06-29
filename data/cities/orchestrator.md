## 창설 배경

보좌관이 지시서를 작성하고 시장이 처리하는 루프를 사람 없이 자동으로 돌리고 싶었다. outbox 감시 → Claude 시장 호출 → 처리 → inbox 보고까지 무인으로 완결하는 메타 레이어를 만들었다.

## 핵심 기능

- **outbox 폴링** — `outbox-to-mayor.md`에서 미처리 지시를 자동 감지
- **Claude 시장 호출** — Claude API로 해당 도시 CLAUDE.md 컨텍스트 + 지시 전달
- **inbox 보고** — 처리 결과를 `inbox-from-mayor.md`에 자동 기록
- **telegram-gate 연동** — push 요청서 자동 생성 → 게이트 승인 대기

## 기술 스택

- Python 3
- Claude API (claude-sonnet-4-6)
- 파일 시스템 기반 메일박스

## 사용 방법

```bash
cd ~/Desktop/project/orchestrator
python3 orchestrator.py
# → outbox 감시 시작
# → 새 지시 감지 시 자동 처리
```

## 연결

- GitHub: [goropak/orchestrator](https://github.com/goropak/orchestrator)
- 관련 도시: telegram-gate (push 승인), boot-pack (컨텍스트 공급)
