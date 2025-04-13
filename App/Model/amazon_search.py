import http.client
import urllib.parse
import json
import asyncio
import mysql.connector
from datetime import datetime
import re
from new_trend import run_pipeline

# --- MySQL connection ---
db = mysql.connector.connect(
    host="productsdb.cvce864kqv1q.us-east-2.rds.amazonaws.com",
    user="admin",
    password="malaysiaboleh",
    database="productsdb"
)
cursor = db.cursor()

# --- RapidAPI settings ---
api_host = "real-time-amazon-data.p.rapidapi.com"
api_key = "d5d656d29fmsheeede719dac5fc8p1c5c5ajsn7da55608f234"

# --- Run TikTok trend pipeline ---
user_query = "coffee cups"
print(f"📥 Running trend analysis for: {user_query}")
product_category = asyncio.run(run_pipeline(user_query))
print(f"📈 Detected product category: {product_category}")

# --- Search Amazon ---
query = urllib.parse.quote(product_category)
conn = http.client.HTTPSConnection(api_host)
headers = {
    'x-rapidapi-key': api_key,
    'x-rapidapi-host': api_host
}
endpoint = f"/search?query={query}&country=US"

try:
    conn.request("GET", endpoint, headers=headers)
    res = conn.getresponse()
    data = res.read().decode("utf-8")
    json_data = json.loads(data)

    products = json_data.get("data", {}).get("products", [])[:10]

    # --- Track unique product keys ---
    seen_products = set()

    for idx, item in enumerate(products, 1):
        full_title = item.get("product_title") or item.get("title") or "No title"
        title_words = full_title.strip().split()
        product_name = " ".join(title_words[:3]) if len(title_words) >= 3 else full_title

        raw_price = item.get("product_price", "0").replace("$", "").replace(",", "").strip()
        try:
            product_price = float(re.search(r"[\d.]+", raw_price).group())
        except:
            product_price = 0.00

        rating = float(item.get("product_star_rating", 0.0))
        sales_volume_text = item.get("sales_volume", "")
        scraped_at = datetime.now()
        supplier = "Amazon"
        product_image_url = item.get("product_photo", "")

        # --- Parse monthly sales ---
        if "K" in sales_volume_text:
            match = re.search(r"([\d.]+)K", sales_volume_text)
            sold_1_month_ago = int(float(match.group(1)) * 1000) if match else 0
        elif "M" in sales_volume_text:
            match = re.search(r"([\d.]+)M", sales_volume_text)
            sold_1_month_ago = int(float(match.group(1)) * 1000000) if match else 0
        else:
            sold_1_month_ago = int(re.search(r"\d+", sales_volume_text).group()) if re.search(r"\d+", sales_volume_text) else 0

        sold_today = max(1, sold_1_month_ago // 30)

        # --- Filter duplicates using product_name + category ---
        product_key = f"{product_name.lower()}|{product_category.lower()}"
        if product_key in seen_products:
            print(f"⏩ Skipping duplicate: {product_name}")
            continue
        seen_products.add(product_key)

        # --- Insert into MySQL ---
        insert_query = """
        INSERT INTO tiktok_products (
            product_name, product_description, product_category,
            list_velocity, supplier, product_price, rating,
            product_image_url, created_at, sold_today, sold_1_month_ago
        ) VALUES (%s, %s, %s, 0, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            product_name, full_title, product_category,
            supplier, product_price, rating, product_image_url,
            scraped_at, sold_today, sold_1_month_ago
        )
        cursor.execute(insert_query, values)
        db.commit()

        print(f"\n✅ Inserted: {product_name}")
        print(f"📄 Description: {full_title}")
        print(f"💵 Price: {product_price}, ⭐ Rating: {rating}, 🖼️ Image: {product_image_url}")

    print("\n✅ All unique products inserted successfully.")
except Exception as e:
    print(f"⚠️ Error while fetching or inserting: {e}")

# --- Close DB ---
cursor.close()
db.close()
