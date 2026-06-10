# governance-dashboard

내 거버넌스의 도시들을 시각적으로 보여주는 웹 대시보드.

---

## A. 이 시스템이 무엇인가

대통령(본인)이 두 AI 직원을 두고 프로젝트를 관리하는 자율 거버넌스 시스템이다. **보좌관**(Claude.ai + Filesystem MCP)이 거버넌스 문서를 읽고 `outbox`에 지시를 기록하면, **시장**(Claude Code)이 이를 읽고 코드 작업·커밋을 수행하며 `push-pending.md`에 신호를 남기고, 대통령이 핸드폰 텔레그램 알림으로 push를 승인하는 3단계 자율 루프로 돌아간다. 이 대시보드는 등록된 도시(프로젝트) 전체 현황을 브라우저에서 카드 UI로 시각화한다.

---

## B. 사전 준비물

### 필요한 프로그램

| 프로그램 | 확인 명령 | 용도 |
|----------|-----------|------|
| Python 3 | `python3 --version` | telegram-gate, boot-pack |
| Node.js / npm | `node --version` | Claude Code CLI 설치 |
| Git | `git --version` | 레포 관리 |
| Claude Code CLI | `claude --version` | 시장(AI 에이전트) |
| Claude Desktop 앱 | 앱 실행 확인 | 보좌관(Filesystem MCP) |
| Telegram 앱 (핸드폰) | — | push 승인 |

**Node.js / npm 설치**:

먼저 설치 여부 확인:
```bash
node --version && npm --version
```

없으면 Homebrew로 설치 (권장, macOS 기준):
```bash
# Homebrew 없을 때 먼저 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node 설치
brew install node

# 확인
node --version && npm --version
```

> 공식 출처: [brew.sh](https://brew.sh) · [nodejs.org](https://nodejs.org)

**Claude Code CLI 설치**:
```bash
npm install -g @anthropic-ai/claude-code --include=optional
claude --version
```
> ⚠️ `--ignore-scripts` 또는 `--omit=optional` 쓰지 말 것 — 네이티브 바이너리 누락 원인.

**Claude Desktop 설치 (보좌관)**:
1. claude.ai/download 에서 설치 → 로그인
2. `+` 메뉴 → 커넥터 → **"Filesystem"** 선택 (Desktop Commander 아님)
3. 허용 폴더: `~/Desktop/project/governance` **한 곳만** 지정

**Python3 설치 (macOS)**:

먼저 설치 여부 확인:
```bash
python3 --version
```

없으면 (Homebrew 도입 후 권장):
```bash
brew install python
```

또는 Xcode Command Line Tools만:
```bash
xcode-select --install
```

**Python 의존성 (telegram-gate)**:
```bash
cd ~/Desktop/project/telegram-gate
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
> `.env` 설정·`python gate.py` 실행은 venv 활성 상태에서.

### 텔레그램 봇 토큰·chat_id 발급

**BOT_TOKEN 발급**:
1. 핸드폰 텔레그램 앱 → `@BotFather` 검색 → 대화 시작
2. `/newbot` 입력 → 봇 이름, username(`xxx_bot` 형식) 순서대로 입력
3. BotFather가 토큰(`1234567890:ABCDEF...` 형식) 발급 → 복사해 .env에 저장

**CHAT_ID 발급**:
1. 위에서 만든 봇에게 핸드폰에서 임의 메시지 1개 전송
2. 브라우저 주소창에 입력:
   ```
   https://api.telegram.org/bot<토큰>/getUpdates
   ```
3. JSON 응답에서 `"chat":{"id":숫자}` → 그 숫자가 TELEGRAM_CHAT_ID

---

## C. 처음 구축하기

### 폴더 구조

```
~/Desktop/project/
├── .claude/
│   └── settings.json          ← Claude Code 권한 설정 (공통)
├── governance/                ← 헌법·법률·도시 명부 (이 레포의 원본)
├── governance-dashboard/      ← 이 레포 (도시 현황 대시보드)
├── boot-pack/                 ← 보좌관 컨텍스트 조립 스크립트
├── telegram-gate/             ← push 승인 게이트
└── simsteel/                  ← 제철소 부지 시각화 (예시 도시)
```

### 1단계: SSH 설정 (GitHub 인증)

```bash
ssh-keygen -t ed25519 -C "본인이메일"   # 이미 있으면 생략
cat ~/.ssh/id_ed25519.pub               # 출력 → GitHub Settings > SSH keys에 등록
ssh -T git@github.com                   # 성공 메시지 확인
```

### 2단계: 레포 clone

```bash
mkdir -p ~/Desktop/project && cd ~/Desktop/project
git clone git@github.com:goropak/governance.git
git clone git@github.com:goropak/boot-pack.git
git clone git@github.com:goropak/governance-dashboard.git
git clone git@github.com:goropak/telegram-gate.git
git clone git@github.com:goropak/simsteel.git
```

### 3단계: Claude Code 권한 설정

파일 편집을 자동 허용하되 git push는 수동 유지 (법률 #5):

```bash
mkdir -p ~/Desktop/project/.claude
cat > ~/Desktop/project/.claude/settings.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Edit",
      "Write",
      "Read"
    ]
  }
}
EOF
```

### 4단계: telegram-gate .env 설정

```bash
cd ~/Desktop/project/telegram-gate
cp .env.example .env
```

`.env` 파일을 텍스트 편집기로 열어 값 채우기:

```
TELEGRAM_BOT_TOKEN=여기에_봇_토큰_붙여넣기
TELEGRAM_CHAT_ID=여기에_chat_id_숫자_입력
GOVERNANCE_PATH=../governance/active/push-pending.md
```

> ⚠️ `.env` 파일은 절대 git에 커밋하지 말 것 (`.gitignore`에 등록됨, 헌법 제0조).

---

## D. 일상 운영

### 오케스트레이터(boot-pack) 실행 — 보좌관 세션 준비

```bash
cd ~/Desktop/project/boot-pack
python3 boot_pack.py          # 기본 부팅 (핵심 파일 9개)
python3 boot_pack.py --all    # 전체 부팅 (laws/ 포함, 권장)
```

출력된 텍스트를 Claude.ai 대화창에 붙여넣으면 보좌관 준비 완료.

### 시장(Claude Code) 실행

```bash
cd ~/Desktop/project
claude
```

### telegram-gate 켜기 (push 승인 대기)

```bash
cd ~/Desktop/project/telegram-gate
source .venv/bin/activate
python3 gate.py
```

`게이트 ON — push-pending.md 폴링 중` 출력 확인 후 대기.

**외출 중 장기 실행** (맥 잠자기 방지 + 백그라운드):
```bash
caffeinate -i python3 gate.py &
```

**끄기**:
```bash
Ctrl+C
```

### 텔레그램으로 push 승인하는 법

1. 시장이 커밋 완료 → `governance/active/push-pending.md`에 **`상태: 대기`** 기록
2. telegram-gate가 10초마다 폴링 → 감지 시 핸드폰 텔레그램 알림 도착 (커밋 요약 + ✅/❌ 버튼)
3. 내용 확인 후 **✅ 승인** 버튼 클릭 → 게이트가 `git push` 자동 실행
4. "✅ 승인 + push 완료" 메시지 수신 → 완료
5. ❌ 거부 시 push 취소 → 대통령이 직접 검토

**전제조건**: telegram-gate가 실행 중이어야 함.

---

## E. 문제 해결

### 대시보드 로컬 실행 시 빈 화면 / cities.md 로드 실패

`file://` 프로토콜에서 `fetch()` 불가. HTTP 서버 경유로만 동작:

```bash
cd ~/Desktop/project/governance-dashboard
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

### telegram-gate가 알림을 보내지 않음

체크리스트:
- `.env` 파일이 `~/Desktop/project/telegram-gate/.env`에 존재하는가
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` 값이 올바른가 (변수명 오타 주의)
- `push-pending.md`의 상태 줄이 정확히 `상태: 대기`인가
  - ⚠️ `**상태**: 대기` (마크다운 볼드 형식)이면 파서가 인식 못 함

### 코드 수정 후 반영 안 됨

Python 스크립트는 핫리로드 없음. **Ctrl+C 종료 후 재시작** 필요.

### Claude Code가 매번 편집 권한을 물어봄

`~/Desktop/project/.claude/settings.json` 미생성 또는 내용 오류. C단계 3번 재실행.

### npm install 후 `claude` 명령 없음

`--include=optional` 누락 확인:
```bash
npm install -g @anthropic-ai/claude-code --include=optional
```

---

## 대시보드 앱 관련

### 로컬 실행

```bash
cd ~/Desktop/project/governance-dashboard
python3 -m http.server 8000
# 브라우저 → http://localhost:8000
```

### 새 도시 추가

1. `governance/cities.md`에 도시 추가 후 거버넌스 레포 커밋
2. `governance-dashboard/cities.md`를 최신 버전으로 교체
3. `script.js`의 `cityMeta` 객체에 도시 메타데이터 추가
4. 커밋 → `push-pending.md` 신호 → 게이트 승인 → push

### 주의사항

- `cities.md`는 governance 레포에서 수동 복사 (자동화 예정)
- 민감 정보 절대 포함 금지 (헌법 제0조)

## F. 다른 컴퓨터로 이전하기

새 Mac에서 시스템을 시작할 때:

1. **레포 클론** — 네 개 레포를 모두 받는다.
   - governance, governance-dashboard, telegram-gate, orchestrator
   - 코드는 전부 GitHub에 있으므로 clone만 하면 받아진다.

2. **설치** — 위 B(사전 준비물)·C(초기 구축) 섹션대로 설치한다.
   - Node.js, Python3, claude CLI
   - 라이브러리: requests, python-dotenv

3. **.env 재생성** — 텔레그램 봇 토큰·chat_id는 GitHub에 없다(.gitignore 처리됨).
   - telegram-gate/.env 를 새로 만들어 직접 입력한다.
   - 비밀값이므로 안전한 방법으로 옮긴다(GitHub에 올리지 말 것).

4. **절대경로 수정** — 코드 안의 /Users/clean/Desktop/project/... 경로를
   새 컴퓨터의 사용자명에 맞게 바꾼다. (가장 놓치기 쉬운 부분)

### F-2. 이전 시 주의사항 (실전 기록)

- **파이썬 3.10 이상 필수** — 코드에 `int | None` 같은 최신 타입 문법이 있어
  3.9 이하에서는 `TypeError`로 게이트가 안 켜진다.
  - 버전 확인: `python3 --version`
  - 낮으면 설치: `brew install python` (3.14 등 최신)

- **venv는 새 파이썬으로 다시 만든다** — 옛 venv는 옛 파이썬에 묶여 있다.


- **SSH 키 재등록** — 새 컴퓨터에서 git clone 전, ~/.ssh 키를
GitHub Settings → SSH keys에 등록해야 한다.
- 암호 자동화: `ssh-add --apple-use-keychain ~/.ssh/id_ed25519`

- **경로 수정** — orchestrator.py, test_wake.py의 `/Users/<옛사용자>` 를
새 사용자명으로 치환:
`sed -i '' 's|/Users/clean|/Users/<새사용자>|g' orchestrator/*.py`

### F-3. 레포는 총 5개 (보좌관 워크스페이스 포함)

clone할 레포 목록:
- governance (본체)
- governance-dashboard (대시보드)
- telegram-gate (게이트 + 범용 승인)
- orchestrator (무인 루프)
- assistant-workspace (보좌관 작업공간 — CLAUDE.md 정체성 문서 포함)

⚠️ assistant-workspace가 없으면 orchestrator 보좌관 단계에서 멈춘다.
