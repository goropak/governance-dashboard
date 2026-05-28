# governance-dashboard

내 거버넌스의 도시들을 시각적으로 보여주는 웹 대시보드.
`cities.md`를 파싱해 각 도시의 상태를 카드 UI로 시각화합니다.

---

## 로컬 실행

```bash
# 방법 1: 브라우저에서 직접 열기 (fetch 미작동 — 권장 안함)
open index.html

# 방법 2: 로컬 서버 (권장)
cd ~/projects/governance-dashboard
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

---

## 새 도시 추가 방법

1. `~/projects/governance/cities.md` 에 도시 추가 후 git push
2. `~/projects/governance-dashboard/cities.md` 를 최신 버전으로 교체
3. `script.js` 상단의 `cityMeta` 객체에 도시 메타데이터 추가:

```js
const cityMeta = {
  'city-name': {
    emoji: '🏙️',
    description: '한 줄 설명',
    usage: '사용법',
    details: '상세 설명'
  }
};
```

4. `git add . && git commit -m "Add [도시명]" && git push`

---

## Vercel 배포 (수동)

1. [vercel.com/new](https://vercel.com/new) 접속
2. "Import Git Repository" 선택
3. `goropak/governance-dashboard` 선택
4. 설정 그대로 → "Deploy" 클릭 (빌드 설정 불필요, 정적 사이트)
5. 배포 완료 후 URL을 `INFRA.md`에 기입

---

## 주의사항

- `cities.md`는 governance 레포에서 수동 복사 (v0.2에서 자동화 예정)
- `fetch('cities.md')`는 로컬 파일 직접 열기(file://)에서 동작 안 함 → 반드시 `python3 -m http.server` 사용
- 민감 정보는 절대 cities.md 또는 cityMeta에 포함하지 않음 (헌법 제0조)
