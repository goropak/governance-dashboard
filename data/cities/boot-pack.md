## 창설 배경

거버넌스 시스템을 새 기기나 새 세션에서 즉시 복원하려면 핵심 문서를 한꺼번에 불러오는 도구가 필요했다. 매번 파일을 찾아 복사하는 수작업을 없애기 위해 착공했다.

## 핵심 기능

- governance 레포의 핵심 파일 8개를 합쳐 macOS 클립보드로 복사
- 실행 시 자동 `git pull`로 최신 상태 동기화
- 부팅 전 동기화 경고(ahead / behind / 미커밋) 블록 출력
- lessons-cities.md 포함 — 교훈이 곧 부팅 컨텍스트

## 기술 스택

- Python 3 (표준 라이브러리만)
- macOS `pbcopy` 클립보드 파이프
- pre-commit hook (비밀값 차단)

## 사용 방법

```bash
cd ~/Desktop/project/boot-pack
python3 boot.py
# → 클립보드에 거버넌스 컨텍스트 복사됨
# → 새 Claude 세션에 붙여넣기
```

## 연결

- GitHub: [goropak/boot-pack](https://github.com/goropak/boot-pack)
- 관련 도시: governance-dashboard (포털에서 현황 확인)
