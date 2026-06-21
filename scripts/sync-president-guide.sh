#!/usr/bin/env bash
# sync-president-guide.sh — 대통령 vault 사용설명서 동기화 (지시 #2026-06-20-F)
#
# 원본(단일 원본 — 헌법 제7조)은 거버넌스 레포에 있다:
#   ../governance/briefing/president-vault-guide.md
# 대시보드는 정적 사이트라 형제 레포(../governance)를 런타임에 못 읽는다
# (Vercel·로컬 http.server 루트 밖). 그래서 이 스크립트가 원본을 대시보드
# 루트로 "복사"해 fetch 가능하게 한다. sync-guide.sh(#D)와 같은 동기화 방식이다.
#
# ⚠️ president-vault-guide.md는 손으로 고치지 말 것 — 원본은 governance다.
#    내용이 바뀌면 이 스크립트를 다시 돌려 동기화한다(수동 중복 금지).
#
# 사용법 (대시보드 레포 루트에서):
#   bash scripts/sync-president-guide.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 거버넌스 레포 자동 탐색(절대경로 박지 않음 — 제7조).
# 상위로 올라가며 governance/briefing/president-vault-guide.md 를 찾는다.
SRC=""
dir="$ROOT"
for _ in 1 2 3 4 5; do
  cand="$dir/../governance/briefing/president-vault-guide.md"
  if [ -f "$cand" ]; then
    SRC="$(cd "$(dirname "$cand")" && pwd)/$(basename "$cand")"
    break
  fi
  dir="$dir/.."
done

if [ -z "$SRC" ]; then
  echo "❌ 원본을 못 찾음: governance/briefing/president-vault-guide.md" >&2
  echo "   거버넌스 레포가 이 도시의 형제 폴더인지 확인하세요(../governance)." >&2
  exit 1
fi

DST="$ROOT/president-vault-guide.md"
cp "$SRC" "$DST"
echo "✅ 동기화 완료: $SRC"
echo "          → $DST"
