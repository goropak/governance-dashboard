#!/usr/bin/env python3
"""RSS → data/news.json 자동 생성. GitHub Actions 스케줄로 실행."""
import json, hashlib, sys, os
from datetime import datetime, timezone

try:
    import feedparser
except ImportError:
    print("feedparser 없음. pip install feedparser 실행 후 재시도.")
    sys.exit(1)

FEEDS = [
    {"url": "https://huggingface.co/blog/feed.xml",    "source": "Hugging Face"},
    {"url": "https://openai.com/blog/rss",              "source": "OpenAI"},
    {"url": "https://www.anthropic.com/rss.xml",        "source": "Anthropic"},
    {"url": "https://feeds.feedburner.com/tldrai",      "source": "TLDR AI"},
    {"url": "https://www.technologyreview.com/feed/",   "source": "MIT Tech Review"},
    {"url": "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml", "source": "The Verge AI"},
]
MAX_PER_FEED = 5
MAX_TOTAL = 30

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def fetch():
    items = []
    for feed_cfg in FEEDS:
        try:
            d = feedparser.parse(feed_cfg["url"])
            for entry in d.entries[:MAX_PER_FEED]:
                uid = hashlib.md5(entry.get("link", "").encode()).hexdigest()[:8]
                items.append({
                    "id":     uid,
                    "title":  entry.get("title", ""),
                    "url":    entry.get("link", ""),
                    "source": feed_cfg["source"],
                    "date":   entry.get("published", ""),
                    "desc":   entry.get("summary", "")[:200],
                    "thumb":  "",
                    "tags":   [],
                    "type":   "news"
                })
            print(f"  ✅ {feed_cfg['source']}: {len(d.entries[:MAX_PER_FEED])}건")
        except Exception as e:
            print(f"  ⚠️ {feed_cfg['source']} 실패: {e}")

    seen = set()
    deduped = []
    for item in sorted(items, key=lambda x: x["date"], reverse=True):
        if item["id"] not in seen:
            seen.add(item["id"])
            deduped.append(item)
    result = deduped[:MAX_TOTAL]

    out_path = os.path.join(BASE, "data", "news.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"updated": datetime.now(timezone.utc).isoformat(), "items": result}, f, ensure_ascii=False, indent=2)
    print(f"\n✅ {len(result)}개 뉴스 항목 저장 → data/news.json")

if __name__ == "__main__":
    fetch()
