# STEP 1: INSTALL REQUIRED PACKAGE
# Run this in your terminal if not already installed:
# pip install sentence-transformers requests python-dotenv

import os
import requests
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, util

# --- Setup ---
load_dotenv()
model = SentenceTransformer("all-MiniLM-L6-v2")
CJ_API_TOKEN = os.getenv("CJ_API_TOKEN")
BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1"
HEADERS = {"CJ-Access-Token": CJ_API_TOKEN}

# --- 1. Search CJ with Keyword ---
def search_products(keyword, page=1, size=20):
    url = f"{BASE_URL}/product/list"
    params = {
        "productNameEn": keyword,
        "pageNum": page,
        "pageSize": size,
        "sort": "desc",
        "orderBy": "listedNum"
    }
    try:
        response = requests.get(url, headers=HEADERS, params=params)
        response.raise_for_status()
        return response.json().get("data", {}).get("list", [])
    except Exception as e:
        print("CJ API error:", e)
        return []

# --- 2. Semantic Filter ---
def filter_semantically(products, keyword, threshold=0.4):
    keyword_embedding = model.encode(keyword, convert_to_tensor=True)
    matched = []
    for p in products:
        text = f"{p.get('productNameEn', '')} {p.get('description', '')}"
        prod_embedding = model.encode(text, convert_to_tensor=True)
        score = util.cos_sim(keyword_embedding, prod_embedding).item()
        if score > threshold:
            p["similarity"] = round(score, 3)
            matched.append(p)
    return matched

# --- 3. Display Products ---
def print_products(products):
    if not products:
        print("No relevant products found.")
        return
    for p in products:
        print("\n---------------------------")
        print("Name:", p.get("productNameEn"))
        print("Similarity:", p.get("similarity"))
        print("Price:", p.get("sellPrice"))
        print("Category:", p.get("categoryName"))
        print("Image:", p.get("productImage"))
        print("SKU:", p.get("productSku"))

# --- MAIN ---
if __name__ == "__main__":
    keyword = "digital watch"
    print(f"🔍 Searching for: {keyword}")
    raw_products = search_products(keyword)
    print(f"Fetched {len(raw_products)} products. Filtering for semantic relevance...")

    matched_products = filter_semantically(raw_products, keyword)
    print_products(matched_products)
