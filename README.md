# governance-dashboard

내 거버넌스의 도시들을 시각적으로 보여주는 웹 대시보드.
`cities.md`를 파싱해 각 도시의 상태를 카드 UI로 시각화합니다.

---

## 무인 자동화 시스템 사용설명서

> 오늘(2026-06-07)까지 구축한 보좌관↔시장 무인 소통 루프.

### 1. 전체 구조: 국가·보좌관·시장

```
[대통령 (본인)]
      │
      ├─ [보좌관] Claude.ai 대화창 (+ Filesystem MCP)
      │      │  거버넌스 문서 읽기/쓰기, 법률 자문, 교훈 정리
      │      │  active/outbox-to-mayor.md ──→ 지시 전달
      │      │  active/inbox-from-mayor.md ←── 결과 수신
      │
      └─ [시장] Claude Code (각 도시 레포)
             │  코드 작업, 커밋, STATUS 갱신
             │  active/push-pending.md ──→ 신호 기록
```

- **보좌관**: Claude.ai 대화창 + Filesystem MCP. 거버넌스 레포(`governance/`)만 읽고 씀. git 실행 권한 없음.
- **시장**: Claude Code (시장 에이전트). 실제 코드·커밋 실행. push는 게이트 승인 후.
- **메일박스**: `active/outbox-to-mayor.md`(보좌관→시장 지시), `active/inbox-from-mayor.md`(시장→보좌관 결과).

---

### 2. 소통 루프 흐름

```
보좌관이 outbox에 지시 기록
        ↓
시장(Claude Code)이 outbox 읽기 → 작업 실행
        ↓
시장이 커밋 완료 후 push-pending.md에 신호 기록
        ↓
telegram-gate 폴링 감지 → 핸드폰 텔레그램 알림
        ↓
대통령이 ✅ 버튼 클릭 → push-pending.md에 "상태: 승인됨" 기록
        ↓
(v0.2.x 예정) 게이트가 git push 자동 실행
        ↓
시장이 inbox에 결과 기록
```

---

### 3. telegram-gate 켜고 끄는 법

**켜기**:
```bash
cd ~/Desktop/project/telegram-gate
source venv/bin/activate   # 가상환경 (있는 경우)
python3 gate.py
```
출력: `게이트 ON — push-pending.md 폴링 중` 확인 후 백그라운드 실행 가능.

**끄기**:
```bash
Ctrl+C   # 게이트 종료
```
또는 터미널 창 닫기.

**장기 실행 (외출 중)**:
```bash
caffeinate -i python3 gate.py &   # 잠자기 방지 + 백그라운드
```

**필수 환경변수** (`.env` 파일, gitignore됨):
```
BOT_TOKEN=<Telegram Bot API 토큰>
CHAT_ID=<본인 텔레그램 chat ID>
```

---

### 4. STOP 안전장치 · 사이클 방지

**STOP 신호**:
- `push-pending.md`에 `상태: 거부됨`이 기록되면 게이트는 해당 사이클을 무시.
- 게이트 자체 종료(Ctrl+C)로 즉시 중단 가능.

**중복 방지**:
- 게이트는 처리한 메시지 해시를 메모리에 유지 → 같은 신호 이중 처리 없음.
- 텔레그램 버튼은 처리 후 editMessageReplyMarkup으로 제거 → 이중 클릭 방지.

**자동 push 이전 수동 확인 지점**:
- v0.2까지는 대통령이 ✅ 버튼을 누른 후에도 실제 push는 대통령 직접 실행.
- v0.2.x에서 자동 push 연결 예정(ssh-agent + caffeinate 활용).

**법률 #5 (push 잠금)**:
- 시장은 절대 git push를 직접 실행하지 않음.
- 모든 push는 telegram-gate 승인 후에만.

---

### 5. 오케스트레이터 (boot-pack)

무인 루프 진입 전 보좌관 컨텍스트를 조립하는 스크립트.

```bash
cd ~/Desktop/project/boot-pack
python3 boot_pack.py          # 기본 부팅 (거버넌스 핵심 9개 파일)
python3 boot_pack.py --all    # 전체 부팅 (laws/ 포함)
```

출력된 텍스트를 Claude.ai 대화창에 붙여넣으면 보좌관이 시스템 상태를 즉시 파악.

---

### 6. 대시보드 앱 로컬 실행

```bash
cd ~/Desktop/project/governance-dashboard
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

---

### 7. 새 도시 추가 방법

1. `governance/cities.md`에 도시 추가 후 커밋
2. `governance-dashboard/cities.md`를 최신 버전으로 교체
3. `script.js`의 `cityMeta` 객체에 도시 메타데이터 추가
4. 커밋 → push-pending.md 신호 → 게이트 승인 → push

---

### 주의사항

- `cities.md`는 governance 레포에서 수동 복사 (v0.2에서 자동화 예정)
- `fetch('cities.md')`는 `file://`에서 동작 안 함 → 반드시 `python3 -m http.server` 사용
- 민감 정보는 절대 포함하지 않음 (헌법 제0조)
