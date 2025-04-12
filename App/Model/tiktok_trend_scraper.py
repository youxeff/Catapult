import requests
import re
from collections import Counter

SEARCH_KEYWORDS = [
    "tiktokmademebuyit", "amazonfinds", "temufinds", "viralproducts", "coolgadgets",
    "kitchengadgets", "caraccessories", "beautyhacks", "desksetup", "homefinds"
]

HEADERS = {
    "x-rapidapi-key": "02efd9968bmsh8f02382bb99c34ap1b3690jsn5bff8f6003fd",
    "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com"
}

BRANDS = [
    "dyson", "anker", "instax", "nintendo", "apple", "samsung", "sony", "logitech", "razer",
    "philips", "fitbit", "garmin", "canon", "nikon", "olaplex", "cerave", "foreo", "neutrogena",
    "cosrx", "bose", "jbl", "asus", "dell", "msi", "ninja", "kitchenaid", "lenovo", "xiaomi"
]

BAD_WORDS = set([
    "http", "https", "www", "link", "bio", "tap", "click", "shop", "temu",
    "find", "found", "available", "store", "purchase", "checkout", "wishlist",
    "unboxing", "haul", "video", "foryou", "fyp", "viral", "review", "buy", "get",
    "just", "like", "love", "cool", "stuff", "best", "product", "gadget", "gadgets"
])

def clean_caption(text):
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    return re.sub(r"\s+", " ", text).strip().lower()

def extract_real_products(captions):
    product_phrases = []
    for cap in captions:
        cap = clean_caption(cap)
        tokens = cap.split()
        for i in range(len(tokens) - 1):
            brand = tokens[i]
            model = tokens[i + 1]
            if brand in BRANDS and model not in BAD_WORDS and len(model) > 2:
                phrase = f"{brand} {model}"
                product_phrases.append(phrase)
    return [p[0] for p in Counter(product_phrases).most_common(15)]

def fetch_titles(keyword, pages=3):
    titles = set()
    for page in range(pages):
        cursor = page * 50
        url = f"https://tiktok-scraper7.p.rapidapi.com/feed/search?keywords={keyword}&region=us&count=50&cursor={cursor}&publish_time=0&sort_type=0"
        response = requests.get(url, headers=HEADERS)
        if response.status_code != 200:
            continue
        try:
            videos = response.json().get("data", {}).get("videos", [])
            for video in videos:
                title = video.get("title", "")
                if title:
                    titles.add(title.strip())
        except Exception:
            continue
    return list(titles)

def main():
    all_captions = []
    for keyword in SEARCH_KEYWORDS:
        print(f"🔍 Fetching TikTok posts for: {keyword}...")
        titles = fetch_titles(keyword)
        print(f"✅ Retrieved {len(titles)} captions from #{keyword}")
        all_captions.extend(titles)

    print(f"\n📦 Total collected captions: {len(all_captions)}")
    product_mentions = extract_real_products(all_captions)

    if product_mentions:
        print("\n🛍️ Actual trending product mentions:")
        for phrase in product_mentions:
            print(f"- {phrase}")
        print("\n🔢 Final Output:")
        print("SAMPLE_TREND_DATA = {")
        print(f'    "tiktok": {product_mentions}')
        print("}")
    else:
        print("❌ No specific product mentions found.")
        print("SAMPLE_TREND_DATA = {{ 'tiktok': [] }}")

main()
