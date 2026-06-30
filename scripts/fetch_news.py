#!/usr/bin/env python3
"""RSS → data/news.json 자동 생성. GitHub Actions 스케줄로 실행."""
import json, hashlib, sys, os, re, urllib.request
from datetime import datetime, timezone

try:
    import feedparser
except ImportError:
    print("feedparser 없음. pip install feedparser 실행 후 재시도.")
    sys.exit(1)

try:
    from deep_translator import GoogleTranslator
    HAS_TRANSLATOR = True
except ImportError:
    HAS_TRANSLATOR = False

FEEDS = [
    {"url": "https://huggingface.co/blog/feed.xml",                              "source": "Hugging Face"},
    {"url": "https://openai.com/blog/rss",                                        "source": "OpenAI"},
    {"url": "https://www.anthropic.com/rss.xml",                                  "source": "Anthropic"},
    {"url": "https://feeds.feedburner.com/tldrai",                                "source": "TLDR AI"},
    {"url": "https://www.technologyreview.com/feed/",                             "source": "MIT Tech Review"},
    {"url": "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",  "source": "The Verge AI"},
    {"url": "https://deepmind.google/blog/rss/",                                  "source": "Google DeepMind"},
    {"url": "https://ai.meta.com/blog/rss/",                                      "source": "Meta AI"},
    {"url": "https://bair.berkeley.edu/blog/feed.xml",                            "source": "BAIR"},
    {"url": "https://newsletter.theaiedge.io/feed",                               "source": "The AI Edge"},
]
MAX_PER_FEED = 5
MAX_TOTAL    = 50

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def fetch_og_image(url: str, timeout: int = 5) -> str:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            html = resp.read(32768).decode("utf-8", errors="ignore")
        m = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html)
        if not m:
            m = re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', html)
        return m.group(1) if m else ""
    except Exception:
        return ""


def translate_ko(text: str) -> str:
    if not text or not HAS_TRANSLATOR:
        return ""
    try:
        return GoogleTranslator(source='auto', target='ko').translate(text[:500])
    except Exception:
        return ""


def fetch():
    items = []
    for feed_cfg in FEEDS:
        try:
            d = feedparser.parse(feed_cfg["url"])
            entries = d.entries[:MAX_PER_FEED]
            for entry in entries:
                uid = hashlib.md5(entry.get("link", "").encode()).hexdigest()[:8]
                link = entry.get("link", "")
                title = entry.get("title", "")
                desc = entry.get("summary", "")[:200]
                thumb = fetch_og_image(link) if link else ""
                items.append({
                    "id":       uid,
                    "title":    title,
                    "title_ko": translate_ko(title),
                    "url":      link,
                    "source":   feed_cfg["source"],
                    "date":     entry.get("published", ""),
                    "desc":     desc,
                    "desc_ko":  translate_ko(desc),
                    "thumb":    thumb,
                    "tags":     [],
                    "type":     "news"
                })
            print(f"  ✅ {feed_cfg['source']}: {len(entries)}건")
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
