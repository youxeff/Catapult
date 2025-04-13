# STEP 1: INSTALL REQUIRED PACKAGE
# Run this in your terminal if not already installed:
# pip install sentence-transformers requests python-dotenv

import os
import requests
import asyncio
import math
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, util
from datetime import datetime
from new_trend import run_pipeline  


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

        age_in_months = calculate_age_in_months(p.get("createTime"))
        listed_num = p.get("listedNum")
        listing_velocity = round(listed_num / age_in_months if age_in_months > 0 else 0, 2)

        # Apply log scaling and square the listing velocity
        if listing_velocity > 0:
            log_scaled_velocity = math.log(listing_velocity, 10)
            squared_velocity = round(log_scaled_velocity ** 2, 2)
        else:
            log_scaled_velocity = 0
            squared_velocity = 0

        print("\n---------------------------")
        print("Name:", p.get("productNameEn"))
        print("Similarity:", p.get("similarity"))
        print("Price:", p.get("sellPrice"))
        print("Category:", p.get("categoryName"))
        print("Image:", p.get("productImage"))
        print("SKU:", p.get("productSku"))
        print("CreationTime:", p.get("createTime"))
        print("ListedNum:", listed_num)
        print("Age_months:", age_in_months)
        print("ListingVelocity:", listing_velocity)
        print("SquaredScaleVelocity:", squared_velocity)
        

# --- 4. Calculate Age in Months ---
def calculate_age_in_months(creation_time_ms):
    # Convert milliseconds to seconds
    creation_time_s = creation_time_ms / 1000

    # Convert Unix time to a datetime object
    creation_date = datetime.fromtimestamp(creation_time_s)

    # Get the current date
    current_date = datetime.now()

    # Calculate the total difference in days
    total_days = (current_date - creation_date).days

    # Approximate the number of months as days divided by the average days in a month (30.44)
    age_in_months = total_days / 30.44

    return round(age_in_months, 2)  # Round to 2 decimal places



# --- MAIN ---
if __name__ == "__main__":
    user_query = "coffee cups"
    keyword = asyncio.run(run_pipeline(user_query))['theme'] 
    print(f"🔍 Searching for: {keyword}")
    raw_products = search_products(keyword)
    print(f"Fetched {len(raw_products)} products. Filtering for semantic relevance...")

    matched_products = filter_semantically(raw_products, keyword)
    print_products(matched_products)
