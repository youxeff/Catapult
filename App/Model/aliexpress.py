import http.client
import json
import sys
import asyncio
import mysql.connector
from new_trend import run_pipeline  # Async SEO keyword generator

# AliExpress API setup
API_KEY = "d5d656d29fmsheeede719dac5fc8p1c5c5ajsn7da55608f234"
API_HOST = "aliexpress-true-api.p.rapidapi.com"

def get_products(search_term):
    encoded_search_term = search_term.replace(" ", "+")
    endpoint = (
        f"/api/v3/products?page_no=1&ship_to_country=US&keywords={encoded_search_term}"
        f"&target_currency=USD&target_language=EN&page_size=50&sort=SALE_PRICE_ASC"
    )

    conn = http.client.HTTPSConnection(API_HOST)
    headers = {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST
    }
    conn.request("GET", endpoint, headers=headers)
    res = conn.getresponse()
    data = res.read().decode("utf-8")

    try:
        products_json = json.loads(data)
    except Exception as e:
        print("❌ JSON Error:", e)
        print("Raw response:", data)
        return []

    print("📦 Raw API Response:")
    print(json.dumps(products_json, indent=2))

    items = products_json.get("products", [])
    if not items:
        print("⚠️ No products found.")
        return []

    # Optional: filter by title match
    filtered = []
    search_term_lower = search_term.lower()
    for item in items:
        if not isinstance(item, dict):
            continue
        title = item.get("title") or item.get("product_title", "")
        if search_term_lower in title.lower():
            filtered.append(item)
    return filtered or items  # fallback: return all if none matched

def insert_product(db, product):
    cursor = db.cursor()
    query = """
        INSERT INTO tiktok_products (
            product_name, product_description, product_category,
            list_velocity, supplier, product_price, rating,
            product_image_url, sold_today, sold_1_month_ago
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    full_title = product.get("title") or product.get("product_title", "No Title")
    title_words = full_title.strip().split()
    product_name = " ".join(title_words[:3]) if len(title_words) >= 3 else full_title
    product_description = full_title
    product_category = product.get("second_level_category_name", "Uncategorized")
    supplier = "AliExpress"
    list_velocity = 0

    # Clean and convert price
    price_raw = product.get("original_price", "0").replace("$", "").replace(",", "").strip()
    try:
        product_price = float(price_raw)
    except ValueError:
        product_price = 0.0

    try:
        rating = float(product.get("rating", 0))
    except ValueError:
        rating = 0.0

    product_image_url = product.get("product_main_image_url", "")
    sold_today = 20
    sold_1_month_ago = 200

    data_tuple = (
        product_name, product_description, product_category,
        list_velocity, supplier, product_price, rating,
        product_image_url, sold_today, sold_1_month_ago
    )

    print("🧾 Preparing to insert:")
    print(" - Product Name:", product_name)
    print(" - Price:", product_price)
    print(" - SQL Data:", data_tuple)

    try:
        cursor.execute(query, data_tuple)
        db.commit()
        print(f"✅ Inserted: {product_name}")
    except mysql.connector.Error as err:
        print(f"❌ MySQL Error inserting '{product_name}': {err}")
        db.rollback()
    finally:
        cursor.close()

if __name__ == "__main__":
    # MySQL connection
    db = mysql.connector.connect(
        host="productsdb.cvce864kqv1q.us-east-2.rds.amazonaws.com",
        user="admin",
        password="malaysiaboleh",
        database="productsdb"
    )

    # Get the query (default or CLI)
    if len(sys.argv) > 1:
        query = sys.argv[1]
    else:
        query = "coffee cups"

    print(f"🔧 Running SEO pipeline for: '{query}'")
    search_keyword = asyncio.run(run_pipeline(query))
    print(f"🎯 Using keyword: '{search_keyword}'")

    # Get matching products from AliExpress
    matching_products = get_products(search_keyword)

    if not matching_products:
        print("⚠️ No matching products found.")
    else:
        print(f"🔄 Found {len(matching_products)} products. Inserting into database...")
        for product in matching_products['product']:
            try:
                insert_product(db, product)
            except Exception as e:
                print(f"🔥 Unexpected error during insert: {e}")

        # Print one example
        top_product = matching_products['product'][0]
        print("\n🛍️ Example Product:")
        print("Title:", top_product.get("title") or top_product.get("product_title"))
        print("Price:", top_product.get("original_price"))
        print("Rating:", top_product.get("rating"))
        print("Image:", top_product.get("product_main_image_url"))

    db.close()

