import os
import requests
import asyncio
import math
import random
import mysql.connector
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

# --- MySQL connection ---
db = mysql.connector.connect(
    host="productsdb.cvce864kqv1q.us-east-2.rds.amazonaws.com",
    user="admin",
    password="malaysiaboleh",
    database="productsdb"
)
cursor = db.cursor()

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
        product_name = p.get("productNameEn")
        product_similarity = p.get("similarity")
        product_price = p.get("sellPrice") or 0.00
        product_category = p.get("categoryName")
        product_image = p.get("productImage")
        product_sku = p.get("productSku")
        product_create_time = p.get("createTime")

        age_in_months = calculate_age_in_months(product_create_time)
        listed_num = p.get("listedNum", 0)
        listing_velocity = round(listed_num / age_in_months if age_in_months > 0 else 0, 2)

        # Apply log scaling and square the listing velocity
        if listing_velocity > 0:
            log_scaled_velocity = math.log(listing_velocity, 10)
            squared_velocity = round(log_scaled_velocity ** 2, 2)
        else:
            log_scaled_velocity = 0
            squared_velocity = 0

        print("\n---------------------------")
        print("Name:", product_name)
        print("Similarity:", product_similarity)
        print("Price:", product_price)
        print("Category:", product_category)
        print("Image:", product_image)
        print("SKU:", product_sku)
        print("CreationTime:", product_create_time)
        print("ListedNum:", listed_num)
        print("Age_months:", age_in_months)
        print("ListingVelocity:", listing_velocity)
        print("SquaredScaleVelocity:", squared_velocity)

        product_data = {
            "productNameEn": product_name,
            "categoryName": product_category,
            "squared_velocity": squared_velocity,
            "sellPrice": product_price,
            "productImage": product_image
        }

        insert_product(product_data)

# --- 4. Insert product listing data into database ---
def insert_product(product):
    try:
        full_title = product.get("productNameEn", "No Title").strip()
        title_words = full_title.split()
        short_title = " ".join(title_words[:3]) if len(title_words) >= 3 else full_title

        query = """
        INSERT INTO tiktok_products (
            product_name,
            product_description,
            product_category,
            list_velocity,
            supplier,
            product_price,
            rating,
            product_image_url
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            short_title,                         # ✅ First 3 words
            full_title,                          # ✅ Full title
            product.get("categoryName"),
            product.get("squared_velocity"),
            "CJDropShipping",
            product.get("sellPrice") or 0.00,
            round(random.uniform(1, 5), 2),
            product.get("productImage")
        )
        cursor.execute(query, values)
        db.commit()
        print(f"✅ Inserted product: {short_title}")
    except Exception as e:
        print(f"❌ Error inserting product: {e}")


# --- 5. Calculate Age in Months ---
def calculate_age_in_months(creation_time_ms):
    try:
        creation_time_s = creation_time_ms / 1000
        creation_date = datetime.fromtimestamp(creation_time_s)
        current_date = datetime.now()
        total_days = (current_date - creation_date).days
        return round(total_days / 30.44, 2)
    except:
        return 0.0

# --- MAIN ---
if __name__ == "__main__":
    user_query = "coffee cups"
    keyword = asyncio.run(run_pipeline(user_query))  # ✅ run_pipeline returns a string
    print(f"🔍 Searching for: {keyword}")
    raw_products = search_products(keyword)
    print(f"Fetched {len(raw_products)} products. Filtering for semantic relevance...")

    matched_products = filter_semantically(raw_products, keyword)
    print_products(matched_products)
