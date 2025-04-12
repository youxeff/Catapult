import requests
import os
from dotenv import load_dotenv

# Load SERPAPI key
load_dotenv()
SERPAPI_KEY = os.getenv("SERPAPI_KEY")  # Or hardcode it

def get_related_google_trends(query, api_key=SERPAPI_KEY, max_results=10):
    try:
        url = "https://serpapi.com/search.json"
        params = {
            "engine": "google_trends",
            "q": query,
            "api_key": api_key
        }

        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        # Safely extract related queries
        related = data.get("related_queries", [])
        keywords = [item.get("query") for item in related if "query" in item]

        return keywords[:max_results]

    except Exception as e:
        print(f"[SerpAPI Error] {e}")
        return []

def get_trend_keywords_from_serpapi(user_query, max_results=10):
    return {
        "google": get_related_google_trends(user_query, max_results=max_results),
        "exploding": [],
        "tiktok": []
    }

# === Test Run ===
if __name__ == "__main__":
    test_query = "health care product"
    trend_data = get_trend_keywords_from_serpapi(test_query)
    print("\n📊 Final Trend Output:")
    print(trend_data)
