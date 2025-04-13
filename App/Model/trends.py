import requests
import os
from dotenv import load_dotenv
from pytrends.request import TrendReq
import logging

# Setup
logging.basicConfig(level=logging.INFO)
load_dotenv()

CJ_API_KEY = os.getenv("CJ_APPKEY")  # CJ token

def get_google_suggestions(query, max_results=10):
    url = "https://suggestqueries.google.com/complete/search"
    params = {"client": "firefox", "q": query}
    try:
        res = requests.get(url, params=params)
        suggestions = res.json()[1][:max_results]
        return suggestions
    except Exception as e:
        logging.error(f"[Google Suggest Error] {e}")
        return []

def get_pytrend_score(keyword):
    try:
        pytrends = TrendReq(hl='en-US', tz=360)
        pytrends.build_payload([keyword], timeframe='now 7-d')
        data = pytrends.interest_over_time()
        if not data.empty:
            return data[keyword].mean()
    except Exception as e:
        logging.warning(f"[PyTrends Error] for '{keyword}': {e}")
    return 0

def get_top_product_from_cj(keyword):
    if not CJ_API_KEY:
        logging.warning("CJ API key missing")
        return None

    try:
        url = "https://developers.cjdropshipping.com/api/product/query"
        headers = {
            "CJ-Access-Token": CJ_API_KEY,
            "Content-Type": "application/json"
        }
        body = {
            "keyword": keyword,
            "pageNum": 1,
            "pageSize": 10
        }
        res = requests.post(url, headers=headers, json=body)
        res.raise_for_status()
        products = res.json().get("data", {}).get("list", [])
        if not products:
            return None
        top = max(products, key=lambda p: p.get("sellPrice", 0))
        return {
            "name": top.get("productName"),
            "price": top.get("sellPrice"),
            "url": top.get("productUrl")
        }
    except Exception as e:
        logging.error(f"[CJ Error] {e}")
        return None

def find_best_product(seed_query):
    suggestions = get_google_suggestions(seed_query, max_results=10)
    filtered = [kw for kw in suggestions if not any(x in kw.lower() for x in [
        "job", "salary", "manager", "owner", "remote", "certification", "near me", "companies", "market", "business"
    ])]
    logging.info(f"Filtered Suggestions: {filtered}")

    scores = []
    for kw in filtered:
        score = get_pytrend_score(kw)
        scores.append((kw, score))
        logging.info(f"Keyword: {kw}, Score: {score}")

    scores = sorted(scores, key=lambda x: x[1], reverse=True)

    for kw, score in scores:
        product = get_top_product_from_cj(kw)
        if product:
            return {
                "trendiest_keyword": kw,
                "product": product
            }

    # fallback
    best_kw = scores[0][0] if scores else seed_query
    return {
        "trendiest_keyword": best_kw,
        "product": {
            "name": best_kw.title(),
            "price": 9.99,
            "url": f"https://example.com/{best_kw.replace(' ', '-')}"
        }
    }

# Run test
if __name__ == "__main__":
    result = find_best_product("healthcare product")
    print("\n📦 Top Result:")
    print(result)
