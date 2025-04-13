import requests
import re

SEARCH_KEYWORDS = [
    "tiktokmademebuyit", "amazonfinds", "temufinds", "viralproducts", "coolgadgets",
    "kitchengadgets", "caraccessories", "beautyhacks", "desksetup", "homefinds",
    "homeessentials", "techfinds", "techreviews", "fitnessgadgets", "smartdevices",
    "organization", "cleaningtiktok", "tiktoktech", "applefinds", "minimalsetup",
    "musthavegadgets", "roomsetup", "ipadaccessories", "gamingsetup", "tiktokgadget",
    "lifehacks", "productreview", "amazontiktok", "tiktokshopfinds", "usefulthings",
    "gadgets2024", "giftideas"
]

HEADERS = {
    'x-rapidapi-key': "9914346513msh5cbbb2f68c89040p189115jsnd538eb26f6f1",
    'x-rapidapi-host': "tiktok-scraper7.p.rapidapi.com"
}

BRANDS = [
    "apple", "samsung", "sony", "anker", "jbl", "bose", "dyson", "nintendo", "logitech",
    "razer", "asus", "dell", "msi", "lenovo", "xiaomi", "ugreen", "ecovacs", "roborock",
    "shark", "elgato", "gopro", "ring", "wyze", "belkin", "beats", "tineco", "oralb",
    "braun", "revlon", "fenty", "tarte", "glossier", "smeg", "ninja", "kitchenaid",
    "theragun", "petlibro", "blueland", "fitbit", "garmin", "canon", "nikon",
    "olaplex", "cerave", "foreo", "cosrx", "loreal", "milani", "lululemon",
    "philips", "instax", "bitvae", "laifen", "switchbot", "joytutus", "airlandolists"
]

BAD_WORDS = set([
    "http", "https", "www", "link", "bio", "tap", "click", "shop", "temu",
    "find", "found", "available", "store", "purchase", "checkout", "wishlist",
    "unboxing", "haul", "video", "foryou", "fyp", "viral", "review", "buy", "get",
    "just", "like", "love", "cool", "stuff", "best", "product", "products",
    "gadget", "gadgets", "musthave", "thing", "things", "recommend", "amazon", "tiktok"
])

BAD_ENDINGS = {
    "i", "you", "we", "are", "is", "am", "was", "were", "be", "being", "been",
    "it", "its", "this", "that", "these", "those", "my", "mine", "me", "your",
    "just", "so", "very", "like", "get", "got", "had", "has", "have", "a", "an", "the"
}

def clean_caption(text):
    text = re.sub(r"http\S+|www\S+|[@#]\w+", "", text)
    text = re.sub(r"[^\w\s\-]", "", text)
    return re.sub(r"\s+", " ", text).strip().lower()

def extract_real_products(captions, min_results=5):
    product_phrases = []
    seen = set()
    used_brands = set()

    for caption in captions:
        caption = clean_caption(caption)
        tokens = caption.split()

        for i in range(len(tokens)):
            token = tokens[i]
            if token in BRANDS and token not in used_brands:
                for j in range(2, 5):
                    phrase_tokens = tokens[i:i + j]
                    if len(phrase_tokens) < 2:
                        continue
                    clean_tokens = [t for t in phrase_tokens if t not in BAD_WORDS]
                    if not clean_tokens or clean_tokens[-1] in BAD_ENDINGS:
                        continue
                    clean_phrase = " ".join(clean_tokens)
                    if clean_phrase not in seen:
                        seen.add(clean_phrase)
                        product_phrases.append(clean_phrase)
                        used_brands.add(token)
                        break
                break

    if len(product_phrases) < min_results:
        filler = list(seen - set(product_phrases))
        product_phrases += filler[:min_results - len(product_phrases)]

    return list(dict.fromkeys(product_phrases))[:max(len(product_phrases), min_results)]

def fetch_titles(keyword, pages=3):
    titles = set()
    for page in range(pages):
        cursor = page * 50
        url = f"https://tiktok-scraper7.p.rapidapi.com/feed/search?keywords={keyword}&region=us&count=50&cursor={cursor}&publish_time=0&sort_type=0"
        response = requests.get(url, headers=HEADERS)
        if response.status_code != 200:
            print(f"❌ Failed for #{keyword}, page {page}")
            continue
        try:
            videos = response.json().get("data", {}).get("videos", [])
            for video in videos:
                caption = video.get("title") or video.get("desc") or ""
                if caption:
                    titles.add(caption.strip())
        except Exception as e:
            print(f"⚠️ Error on page {page}: {e}")
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
