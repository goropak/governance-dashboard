## 창설 배경

제철소 부지 레이아웃 설계는 수십 개 설비의 위치·면적·동선을 동시에 고려해야 한다. 도면 소프트웨어 대신 SimCity 스타일의 인터랙티브 캔버스로 직접 배치·수정하며 시뮬레이션할 수 있는 도구를 만들었다.

## 핵심 기능

- **5m 격자 캔버스** — Phase별 영역과 단위 설비를 자유롭게 배치
- **인라인 이름 편집** — 시설 더블클릭으로 그 자리에서 이름 수정 (Finder UX)
- **이미지 레이어** — 배경 도면·위성 이미지 오버레이, 가로/세로 독립 리사이즈
- **Supabase 클라우드 저장** — 계정 로그인 시 1.5초 디바운스 자동저장 + 수동 저장
- **맵 전용 보기** — F 단축키로 팔레트·패널 숨기고 캔버스 풀스크린

## 기술 스택

- React + Vite
- Phaser 3 (캔버스 렌더링)
- Supabase (Postgres + Storage + Auth)
- Zustand (상태 관리)

## 사용 방법

```bash
cd ~/Desktop/project/simsteel
npm install
npm run dev
# → http://localhost:5173
```

Supabase 연동 시 `.env.local`에 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` 설정 필요. 미설정 시 로컬 전용 모드로 동작.

## 연결

- GitHub: [goropak/simsteel](https://github.com/goropak/simsteel)
- 관련 도시: telegram-gate (push 승인 게이트 연동)
