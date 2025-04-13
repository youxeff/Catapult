import pandas as pd
import http.client
import urllib.parse
import json

# Load product names from Excel
df = pd.read_excel("trends.xlsx")
products = df.iloc[:, 0].dropna().tolist()

# RapidAPI settings
api_host = "real-time-amazon-data.p.rapidapi.com"
api_key = "d5d656d29fmsheeede719dac5fc8p1c5c5ajsn7da55608f234"

for product in products:
    print(f"\n🔍 Searching: {product}")
    query = urllib.parse.quote(product)

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

        products_found = json_data.get("data", {}).get("products", [])[:3]

        if not products_found:
            print("❌ No results found.")
        else:
            for idx, item in enumerate(products_found, 1):
                asin = item.get("asin", "N/A")
                link = f"https://www.amazon.com/dp/{asin}" if asin != "N/A" else "N/A"
                title = item.get("product_title") or item.get("title") or "No title found"

                # Build cleaned result
                result = {
                    "product_price": item.get("product_price", "N/A"),
                    "product_original_price": item.get("product_original_price", "N/A"),
                    "currency": item.get("currency", "N/A"),
                    "product_star_rating": item.get("product_star_rating", "N/A"),
                    "product_num_ratings": item.get("product_num_ratings", "N/A"),
                    "sales_volume": item.get("sales_volume", "N/A")
                }

                print(f"{idx}. {title}")
                print(link)
                print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"⚠️ Error fetching '{product}': {e}")
