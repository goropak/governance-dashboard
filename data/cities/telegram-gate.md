## 창설 배경

외출 중에도 거버넌스 push를 안전하게 승인하고 싶었다. 노트북을 열지 않고 핸드폰 텔레그램 하나로 커밋 승인 → 자동 push까지 완결하는 게이트를 만들었다.

## 핵심 기능

- **push 알림 + 인라인 버튼** — 시장이 `approvals/` 요청서를 작성하면 텔레그램으로 알림 + ✅/❌ 버튼 전송
- **승인 즉시 자동 push** — ✅ 클릭 시 게이트가 `git pull --rebase && git push` 실행
- **거짓완료 방지** — 명령별 returncode 집계, 하나라도 실패 시 `.실패.md` 생성 + ⚠️ 경고 전송
- **미push 커밋 자동 감지** — `origin/main..HEAD` 폴링으로 요청서 없이도 대기 중인 커밋 알림
- **보안** — `from_user.id` 검증으로 본인만 승인 가능

## 기술 스택

- Python 3
- Telegram Bot API (polling 방식)
- `subprocess` — git 명령 실행

## 사용 방법

```bash
cd ~/Desktop/project/telegram-gate
python3 approval_gate.py
# → 백그라운드 데몬으로 상시 실행
# → approvals/ 폴더 감시 → 새 요청서 감지 → 텔레그램 알림
```

`.env`에 `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` 설정 필요.

## 연결

- GitHub: [goropak/telegram-gate](https://github.com/goropak/telegram-gate)
- 관련 도시: orchestrator (무인 자동화의 실행 엔진)
