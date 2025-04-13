import http.client
import json

# Static API key and host
API_KEY = "d5d656d29fmsheeede719dac5fc8p1c5c5ajsn7da55608f234"
API_HOST = "aliexpress-true-api.p.rapidapi.com"

def get_products(search_term):
    # Build endpoint using the given search term.
    # Adjust additional parameters as needed.
    endpoint = (
        f"/api/v3/products?page_no=1&ship_to_country=US&keywords={search_term}"
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
        print(" JSON Error:", e)
        print("Raw response:", data)
        return []
    
    # Debug: print the full JSON response structure:
    print("DEBUG - Full JSON response:")
    print(json.dumps(products_json, indent=2))
    
    # Adjust this key if needed based on the actual API response structure.
    items = products_json.get("products", [])
    if not items:
        print(" No products found from API response.")
        return []
    
    # Further filter items to include only listings that have the search term
    # in their title (or product_title) in a case-insensitive manner.
    filtered = []
    search_term_lower = search_term.lower()
    for item in items:
        # Try common keys for product name. Adjust as needed.
        title = item.get("title") or item.get("product_title", "")
        if search_term_lower in title.lower():
            filtered.append(item)
    return filtered

if __name__ == "__main__":
    test_keyword = "watch"  # Modify this search term as needed
    print(f"🔧 Testing search with keyword: '{test_keyword}'")
    matching_products = get_products(test_keyword)
    if not matching_products:
        print(" No result to display after filtering.")
    else:
        # For demonstration, print out the first matching product
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
