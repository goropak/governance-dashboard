#!/usr/bin/env python3
"""approvals/ 큐 → data/tasks.json 생성 (지시 #2026-07-02-A).

로컬 전용 — approvals/는 git에 안 올라가는 로컬 큐라 GitHub Actions 불가.
시장이 수동 실행 후 data/tasks.json을 커밋에 포함한다.

0조 부칙: '## 명령'/'## 승인 후 실행 명령' 섹션(절대경로·셸 커맨드)은
절대 파싱·출력하지 않는다. 출력 전 /Users/ 패턴 자체검사로 이중 방어.
"""
import json, os, re, sys
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APPROVALS = os.path.normpath(os.path.join(BASE, "..", "approvals"))
DONE = os.path.join(APPROVALS, "done")
OUT = os.path.join(BASE, "data", "tasks.json")

CITY_SLUGS = ["governance-dashboard", "simsteel", "quanttrader", "health-assistant",
              "telegram-gate", "boot-pack", "orchestrator", "steel-attache",
              "demo-city", "posco-weekly", "governance", "ai-news"]

DATE_RE = re.compile(r"(\d{4}-\d{2}-\d{2})")


def sanitize(text):
    """로컬 절대경로·홈경로 노출 차단 (0조 부칙)."""
    if "/Users/" in text or "~/" in text:
        return ""
    return text.strip()


def guess_city(text, fname):
    for slug in CITY_SLUGS:
        if slug in text or slug in fname:
            return slug
    # 파일명 축약 관용 표기
    aliases = {"qt-": "quanttrader", "tg-": "telegram-gate", "qa-": "steel-attache",
               "dashboard": "governance-dashboard", "gate-": "telegram-gate"}
    for key, slug in aliases.items():
        if key in fname:
            return slug
    return "미확인"


def parse_file(path, fname):
    with open(path, encoding="utf-8") as f:
        text = f.read()

    title = ""
    m = re.search(r"^# (.+)$", text, re.M)
    if m:
        title = sanitize(m.group(1)) or "(제목 비공개)"

    requester = "미확인"
    m = re.search(r"\*\*요청자\*\*:\s*(.+)", text)
    if m:
        requester = sanitize(m.group(1)) or "미확인"

    requested_at = ""
    m = re.search(r"\*\*요청일\*\*:\s*(.+)", text)
    if m:
        d = DATE_RE.search(m.group(1))
        if d:
            requested_at = d.group(1)
    if not requested_at:
        d = DATE_RE.match(fname)
        requested_at = d.group(1) if d else ""

    what = ""
    m = re.search(r"^## 무엇\s*\n+(.+?)(?:\n\n|\n#|\Z)", text, re.M | re.S)
    if m:
        first_para = m.group(1).strip().split("\n\n")[0]
        what = sanitize(" ".join(first_para.split()))[:200]

    return {
        "id": re.sub(r"\.(완료|실패|대체됨)?\.?md$", "", fname),
        "city": guess_city(text, fname),
        "requester": requester,
        "requested_at": requested_at,
        "title": title,
        "what": what,
    }


def build():
    pending, done = [], []

    if os.path.isdir(APPROVALS):
        for fname in sorted(os.listdir(APPROVALS)):
            if fname.endswith(".md"):
                pending.append(parse_file(os.path.join(APPROVALS, fname), fname))

    if os.path.isdir(DONE):
        for fname in sorted(os.listdir(DONE), reverse=True):
            if not fname.endswith(".md"):
                continue
            status = "완료" if ".완료." in fname else "실패" if ".실패." in fname else None
            if not status:
                continue
            item = parse_file(os.path.join(DONE, fname), fname)
            item["status"] = status
            del item["what"]  # done은 제목·도시·날짜·상태만
            done.append(item)
            if len(done) >= 10:
                break

    pending.sort(key=lambda x: x["requested_at"])  # 오래된 순

    data = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "pending": pending,
        "recent_done": done,
    }

    out = json.dumps(data, ensure_ascii=False, indent=2)
    if "/Users/" in out:
        print("❌ 0조 부칙 위반: 출력에 로컬 경로 포함 — 저장 중단")
        sys.exit(1)

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(out + "\n")
    print(f"✅ 대기 {len(pending)}건 · 최근 처리 {len(done)}건 → data/tasks.json")


if __name__ == "__main__":
    build()
