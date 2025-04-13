# cj_product_match_test.py

import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

# --- Use Static Access Token (Already Authenticated) ---
CJ_API_TOKEN = (
    "API@CJ4226207@CJ:eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyNDMwMCIsInR5cGUiOiJBQ0NFU1NfVE9LRU4iLCJzdWIiOiJicUxvYnFRMGxtTm55UXB4UFdMWnlyay9LQkp0UXh2S2w3MlJIZ2xIRzBLVWRVaUQ1Kzd2V1BwQ3UvUEZId3BlcGlLL1BDTklzN1N4aHNrbkpNOHpyS1cvTjM0UUNTWlVLNXIveTIzQmgvb2RaOHlnZlpBVWtwWG54Y25nQW01VldhRGZmdjhySlc1d25sS1RWVm10SGNIS0p4cDhtams2bWhWSGplN1VEVnVaZEFhMllqR1VjbjdZR3hoTC9kcTQ3Z1VuTXhHdExhZTIycUhKYWJlcGxWZjVBVlhBRVR1MVlXOElpUERGUWZHMm5TR29wWXBCNzJzdHNNajFKclJrNGxyT3F4ZUIrOXpqeHExS3hRYkZRRFpCS0Fyay8reVUxTGxRV0pGSWFjQ1VPcDIvbWVCOUcxcGFKa2ZZSmc3bmNvOVpYbkZySDVHam8rUFd3QmRzVGc9PSIsImlhdCI6MTc0NDUwNDkzNX0.MvPMjUMi8mnqdPvt22TQbT6q0AFVefqPkfKz3X61kPA"
)

HEADERS = {
    "CJ-Access-Token": CJ_API_TOKEN
}

BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1"

# Hardcoded trend analysis result
TREND_ANALYSIS_RESULT = {
    "query": "trending health products",
    "ranked_keywords": [
        {"keyword": "wellness shots", "semantic_score": 0.46300825, "source_count": 1, "final_score": 0.3024},
        {"keyword": "gut health", "semantic_score": 0.4287039, "source_count": 1, "final_score": 0.2818},
        {"keyword": "green powders", "semantic_score": 0.26470482, "source_count": 1, "final_score": 0.1834},
        {"keyword": "sleep gummies", "semantic_score": 0.18723834, "source_count": 1, "final_score": 0.1369},
        {"keyword": "electrolyte drink", "semantic_score": 0.15029985, "source_count": 1, "final_score": 0.1148},
        {"keyword": "coregreens", "semantic_score": 0.14053535, "source_count": 1, "final_score": 0.1089},
        {"keyword": "ashwagandha", "semantic_score": 0.10004703, "source_count": 1, "final_score": 0.0846},
        {"keyword": "magnesium glycinate", "semantic_score": 0.09322418, "source_count": 1, "final_score": 0.0805},
        {"keyword": "adaptogen stack", "semantic_score": 0.06825511, "source_count": 1, "final_score": 0.0655}
    ]
}

# --- Safe request with retry and rate-limit handling ---
def safe_request_with_retry(url, params, max_retries=3):
    for attempt in range(max_retries):
        try:
            res = requests.get(url, headers=HEADERS, params=params)
            if res.status_code == 429:
                wait = 5 + attempt * 2
                print(f"Rate limited. Waiting {wait}s...")
                time.sleep(wait)
                continue
            res.raise_for_status()
            return res
        except Exception as e:
            print(f"Failed on attempt {attempt + 1}: {e}")
            time.sleep(2)
    return None

# --- 1. Search CJ Products by Keyword ---
def search_products(keyword):
    url = f"{BASE_URL}/product/list"
    params = {
        "productNameEn": keyword,
        "pageNum": 1,
        "pageSize": 5,
        "sort": "desc",
        "orderBy": "listedNum"
    }
    res = safe_request_with_retry(url, params)
    try:
        if res:
            result = res.json()
            if not result.get("data") or not result["data"].get("list"):
                print(f"No results found for: {keyword}")
                return []
            return result["data"]["list"]
    except Exception as e:
        print(f"Unexpected error for {keyword}: {e}")
    return []

# --- 2. Get Product Details ---
def get_product_details(pid):
    url = f"{BASE_URL}/product/query"
    params = {"pid": pid}
    res = safe_request_with_retry(url, params)
    if res:
        return res.json().get("data", {})
    return {}

# --- 3. Get Product Variants ---
def get_variants(pid):
    url = f"{BASE_URL}/product/variant/query"
    params = {"pid": pid}
    res = safe_request_with_retry(url, params)
    if res:
        return res.json().get("data", [])
    return []

# --- 4. Get Inventory (by SKU) ---
def get_inventory_by_sku(sku):
    url = f"{BASE_URL}/product/stock/queryBySku"
    params = {"sku": sku}
    res = safe_request_with_retry(url, params)
    if res:
        return res.json().get("data", [])
    return []

# --- 5. Get Product Reviews ---
def get_reviews(pid):
    url = f"{BASE_URL}/product/productComments"
    params = {"pid": pid, "pageNum": 1, "pageSize": 5}
    res = safe_request_with_retry(url, params)
    if res:
        return res.json().get("data", {}).get("list", [])
    return []

# --- TEST ALL FUNCTIONS FOR A FEW KEYWORDS ---
def run_full_test():
    for entry in TREND_ANALYSIS_RESULT["ranked_keywords"][:3]:  # Limit to top 3 for now
        keyword = entry["keyword"]
        print(f"\n==== Searching CJ for: {keyword} ====")
        products = search_products(keyword)
        time.sleep(2)  # Delay between keyword searches to avoid 429

        for product in products:
            pid = product.get("pid")
            sku = product.get("productSku")
            print(f"Product: {product.get('productNameEn')} | Price: {product.get('sellPrice')} | SKU: {sku}")

            details = get_product_details(pid)
            variants = get_variants(pid)
            stock = get_inventory_by_sku(sku)
            reviews = get_reviews(pid)

            print(f"Variants: {len(variants)} | Reviews: {len(reviews)} | Stock Entries: {len(stock)}")

if __name__ == "__main__":
    run_full_test()
