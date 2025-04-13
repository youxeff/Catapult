import os
import time
import requests
from dotenv import load_dotenv
from new_trend import run_pipeline
import asyncio

# Load environment variables
load_dotenv()

# API Token and Setup
CJ_API_TOKEN = os.getenv("CJ_API_TOKEN")
BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1"
HEADERS = {"CJ-Access-Token": CJ_API_TOKEN}

# Safe GET request with retry
def safe_get(url, params=None, retries=3):
    for attempt in range(retries):
        try:
            res = requests.get(url, headers=HEADERS, params=params)
            if res.status_code == 429:
                wait = 2 + attempt * 2
                print(f"Rate limited. Waiting {wait}s...")
                time.sleep(wait)
                continue
            res.raise_for_status()
            return res.json()
        except Exception as e:
            print(f"Request attempt {attempt + 1} failed: {e}")
            time.sleep(2)
    return None

# Search CJ Products
def search_products(keyword):
    print(f"\nSearching CJ for keyword: {keyword}")
    url = f"{BASE_URL}/product/list"
    params = {
        "productNameEn": keyword,
        "pageNum": 1,
        "sort": "desc",
        "orderBy": "listedNum"
    }
    response = safe_get(url, params)
    if response and response.get("result") and response.get("data", {}).get("list"):
        return response["data"]["list"]
    return []

# Display products
def print_products(products):
    if not products:
        print("No products found.")
        return
    for product in products:
        print("--------------------------")
        print("Name:", product.get("productNameEn"))
        print("Price:", product.get("sellPrice"))
        print("Image:", product.get("productImage"))
        print("Category:", product.get("categoryName"))

# Run search for keywords
def run_query(keywords, theme):
    print(f"\n[🔥 Searching CJ Dropshipping for Theme: '{theme}']\n")
    for kw in keywords:
        products = search_products(kw)
        print(products)
        # print_products(products)
        time.sleep(2)

# MAIN
if __name__ == "__main__":
    # Run keyword generation pipeline (async)
    top_opportunity = asyncio.run(run_pipeline('paper cups'))

    # Print selected theme info
    print(f"\n[✅ Top Opportunity Theme Selected]")
    print(f"Theme: {top_opportunity['theme']}")
    print(f"Score: {top_opportunity['avg_score']}")
    print(f"Keywords: {top_opportunity['keywords']}\n")

    # Use top keywords from highest scoring theme
    run_query(top_opportunity['keywords'], top_opportunity['theme'])
