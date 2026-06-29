## 창설 배경

퀀트 전략을 체계적으로 연구·검증하고 자동매매로 연결하는 파이프라인이 필요했다. 백테스트 → 페이퍼 트레이딩 → 소액 실거래 순서를 구조적으로 강제해 무검증 실거래를 방지한다.

## 핵심 기능

- **Freqtrade 기반 전략 플러그인** — 전략을 파일 하나로 꽂고 빼는 구조
- **8종 전략** — MaCross, DonchianBreakout, RsiReversal (5m봉) / RsiTrend, EmaTrend, BollingerBounce, MacdTrend, RsiTrendHO (1h봉)
- **Hyperopt 자동 파라미터 탐색** — SharpeHyperOptLoss 기준 최적화
- **run_all.sh / run_long.sh** — 폰 승인 한 번으로 전략 세트 백테스트 일괄 실행
- **AI co-design 루프** — 결과 분석 → 전략 수정 → 재백테스트 반복

## 기술 스택

- Python 3
- Freqtrade (오픈소스 자동매매 프레임워크)
- 업비트 / 빗썸 / 바이낸스 API

## 사용 방법

백테스트부터 시작. 페이퍼 트레이딩 검증 통과 전 실거래 투입 금지(구조로 강제됨).

```bash
cd ~/Desktop/project/quanttrader/ft
freqtrade backtesting --strategy RsiTrend --timeframe 1h
```

## 연결

- GitHub: [goropak/quanttrader](https://github.com/goropak/quanttrader)
- 관련 도시: telegram-gate (전략 실행 알림)
