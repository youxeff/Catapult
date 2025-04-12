from pytrends.request import TrendReq
import requests
import os
from dotenv import load_dotenv

load_dotenv()
EXPLODING_API_KEY = os.getenv("EXPLODING_TOPICS_API_KEY")


def get_trend_keywords(keyword: str, max_results=10):
    trend_data = {
        "google": [],
        "exploding": [],
        "tiktok": []  # Placeholder for future TikTok integration
    }

    # 1. Google Trends
    try:
        pytrends = TrendReq(hl='en-US', tz=360)
        pytrends.build_payload([keyword], timeframe="now 7-d")
        rising = pytrends.related_queries().get(keyword, {}).get("rising")
        if rising is not None:
            trend_data["google"] = rising["query"].tolist()[:max_results]
    except Exception as e:
        print(f"[Google Trends Error] {e}")

    # 2. Exploding Topics
    try:
        url = "https://api.explodingtopics.com/v1/trending"
        headers = {"Authorization": f"Bearer {EXPLODING_API_KEY}"}
        response = requests.get(url, headers=headers)
        topics = response.json().get("trends", [])

        count = 0
        for topic in topics:
            if count >= max_results:
                break
            if keyword.lower() in topic["topic"].lower() or keyword.lower() in topic.get("description", "").lower():
                trend_data["exploding"].append(topic["topic"])
                count += 1
    except Exception as e:
        print(f"[Exploding Topics Error] {e}")

    return trend_data
