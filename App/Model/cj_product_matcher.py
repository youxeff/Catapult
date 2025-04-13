import os
import requests
import asyncio
import math
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, util
from datetime import datetime
from Database.config import get_db
from Database.data import insert_product

# Load environment variables and setup
load_dotenv()
model = SentenceTransformer("all-MiniLM-L6-v2")
CJ_API_TOKEN = os.getenv("CJ_API_TOKEN")
BASE_URL = "https://developers.cjdropshipping.com/api2.0/v1"
HEADERS = {"CJ-Access-Token": CJ_API_TOKEN}

async def search_products(keyword, page=1, size=20):
    """Search CJ products with error handling"""
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
        print(f"CJ API error: {e}")
        return []

def filter_semantically(products, keyword, threshold=0.4):
    """Filter products based on semantic similarity"""
    if not products:
        return []
    
    try:
        # Get embeddings
        product_names = [p.get("productNameEn", "") for p in products]
        product_embeds = model.encode(product_names, convert_to_tensor=True)
        keyword_embed = model.encode([keyword], convert_to_tensor=True)

        # Calculate similarities
        similarities = util.pytorch_cos_sim(keyword_embed, product_embeds)[0]
        
        # Add similarity scores and filter
        filtered_products = []
        for idx, product in enumerate(products):
            similarity = float(similarities[idx])
            if similarity >= threshold:
                product["similarity"] = similarity
                filtered_products.append(product)

        return sorted(filtered_products, key=lambda x: x["similarity"], reverse=True)
    except Exception as e:
        print(f"Semantic filtering error: {e}")
        return products

def calculate_age_in_months(creation_time_ms):
    """Calculate product age in months"""
    try:
        creation_time_s = creation_time_ms / 1000
        creation_date = datetime.fromtimestamp(creation_time_s)
        current_date = datetime.now()
        total_days = (current_date - creation_date).days
        return round(total_days / 30.44, 2)
    except:
        return 0.0

async def get_cj_products_and_store(keyword):
    """Main function to search, filter, and store CJ products"""
    try:
        # Search products
        raw_products = await search_products(keyword)
        if not raw_products:
            return []

        # Filter semantically
        matched_products = filter_semantically(raw_products, keyword)
        if not matched_products:
            return []

        # Process and store products
        db = next(get_db())
        stored_products = []

        for p in matched_products:
            # Calculate velocity metrics
            age_in_months = calculate_age_in_months(p.get("createTime", 0))
            listed_num = p.get("listedNum", 0)
            listing_velocity = round(listed_num / age_in_months if age_in_months > 0 else 0, 2)
            
            # Apply log scaling
            if listing_velocity > 0:
                log_scaled_velocity = math.log(listing_velocity, 10)
                squared_velocity = round(log_scaled_velocity ** 2, 2)
            else:
                squared_velocity = 0

            # Add velocity to product data
            p["squared_velocity"] = squared_velocity

            # Store in database
            stored_product = insert_product(db, p, "CJDropshipping")
            if stored_product:
                stored_products.append(stored_product)

        return stored_products

    except Exception as e:
        print(f"Error in get_cj_products_and_store: {e}")
        return []

# --- MAIN ---
if __name__ == "__main__":
    user_query = "coffee cups"
    keyword = asyncio.run(run_pipeline(user_query))  # ✅ run_pipeline returns a string
    print(f"🔍 Searching for: {keyword}")
    raw_products = asyncio.run(search_products(keyword))
    print(f"Fetched {len(raw_products)} products. Filtering for semantic relevance...")

    matched_products = filter_semantically(raw_products, keyword)
    asyncio.run(get_cj_products_and_store(keyword))