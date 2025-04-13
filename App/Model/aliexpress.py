import http.client
import json
import sys
import asyncio
import mysql.connector
from new_trend import run_pipeline  # Import your async SEO pipeline

# Static API key and host for AliExpress API
API_KEY = "d5d656d29fmsheeede719dac5fc8p1c5c5ajsn7da55608f234"
API_HOST = "aliexpress-true-api.p.rapidapi.com"

def get_products(search_term):
    # Encode the search term by replacing spaces with plus signs.
    encoded_search_term = search_term.replace(" ", "+")
    # Build endpoint using the encoded search term.
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
        print("JSON Error:", e)
        print("Raw response:", data)
        return []
    
    # Debug: print the full JSON response structure.
    print("DEBUG - Full JSON response:")
    print(json.dumps(products_json, indent=2))
    
    # Extract products from the response.
    items = products_json.get("products", [])
    if not items:
        print("No products found from API response.")
        return []
    
    # Filter items to include only those whose title includes the search term.
    filtered = []
    search_term_lower = search_term.lower()
    for item in items:
        # Skip if the item is not a dict.
        if not isinstance(item, dict):
            print("Skipping invalid item:", item)
            continue
        title = item.get("title") or item.get("product_title", "")
        if search_term_lower in title.lower():
            filtered.append(item)
    return filtered

def insert_product(db, product):
    """
    Maps the product info from the API to the database columns and performs an INSERT.
    """
    cursor = db.cursor()
    query = """
        INSERT INTO tiktok_products 
            (product_name, product_description, product_category, product_price, rating, product_image_url, sold_today, sold_1_month_ago)
        VALUES 
            (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    product_name = product.get("title") or product.get("product_title", "N/A")
    product_description = product.get("description", "")
    product_category = product.get("category", "")
    try:
        product_price = float(product.get("sale_price", 0))
    except ValueError:
        product_price = 0.0
    try:
        rating = float(product.get("rating", 0))
    except ValueError:
        rating = 0.0
    product_image_url = product.get("product_image_url", "")
    sold_today = 0
    sold_1_month_ago = 0

    data_tuple = (product_name, product_description, product_category,
                  product_price, rating, product_image_url, sold_today, sold_1_month_ago)
    
    try:
        cursor.execute(query, data_tuple)
        db.commit()
        print(f"Inserted product: {product_name}")
    except mysql.connector.Error as err:
        print("Error inserting data: {}".format(err))
        db.rollback()
    finally:
        cursor.close()

if __name__ == "__main__":
    # Connect to the MySQL database.
    db = mysql.connector.connect(
        host="productsdb.cvce864kqv1q.us-east-2.rds.amazonaws.com",
        user="admin",
        password="malaysiaboleh",
        database="productsdb"
    )

    # Get the search query from command line or default.
    if len(sys.argv) > 1:
        query = sys.argv[1]
    else:
        query = "coffee cups"
    print(f"🔧 Running SEO pipeline for query: '{query}'")
    
    # Run the asynchronous SEO pipeline.
    results = asyncio.run(run_pipeline(query))
    if not results:
        print("No SEO opportunities generated for the query.")
        sys.exit(1)
    
    # Extract the top keyword from the SEO pipeline results.
    try:
        search_keyword = results["keywords"][0]
        print(f"Top keyword from pipeline: '{search_keyword}'")
    except (KeyError, IndexError) as e:
        print("Error extracting keyword from SEO results:", e)
        sys.exit(1)
    
    # Search for products on AliExpress using the keyword.
    print(f"🔧 Searching for products on AliExpress with keyword: '{search_keyword}'")
    matching_products = get_products(search_keyword)
    
    if not matching_products:
        print("No matching products found.")
    else:
        # Insert each valid product into the database.
        for product in matching_products:
            insert_product(db, product)
        
        # Optionally, show details of the first product.
        top_product = matching_products[0]
        title = top_product.get("title") or top_product.get("product_title", "N/A")
        orders = top_product.get("orders", "N/A")
        rating = top_product.get("rating", "N/A")
        reviews = top_product.get("reviews", "N/A")
        sale_price = top_product.get("sale_price", "N/A")
        url = top_product.get("product_url") or top_product.get("product_detail_url", "N/A")
        print("\nTop Matching Product:")
        print(f"Title: {title}")
        print(f"Orders: {orders}")
        print(f"Rating: {rating}")
        print(f"Reviews: {reviews}")
        print(f"Price: {sale_price}")
        print(f"URL: {url}")
    
    # Close the database connection.
    db.close()
