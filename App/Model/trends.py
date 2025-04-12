import requests

def get_google_suggestions(query, max_results=20):
    try:
        url = "https://suggestqueries.google.com/complete/search"
        params = {"client": "firefox", "q": query}
        response = requests.get(url, params=params)
        suggestions = response.json()[1]
        return {
            "google": suggestions[:max_results]
        }
    except Exception as e:
        print(f"[Google Suggest Error] {e}")
        return {"google": []}

# === Test Run ===
if __name__ == "__main__":
    test_query = "health care product"  # or "wellness supplements", etc.
    trend_data = get_google_suggestions(test_query)
    print("\n📊 Final Trend Output:")
    print(trend_data)
