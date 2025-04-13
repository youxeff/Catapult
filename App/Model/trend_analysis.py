import os
import openai
import math
import time
import pandas as pd
from dotenv import load_dotenv
from openai import OpenAI
from scipy.stats import norm
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import json
import requests

# Instantiate the client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Load Sentence Transformer
model = SentenceTransformer('all-MiniLM-L6-v2')

# Sample simulated trend data
SAMPLE_TREND_DATA = {
    "google": [],
}
def get_google_suggestions(query, max_results=20):
    try:
        url = "https://suggestqueries.google.com/complete/search"
        params = {"client": "firefox", "q": query}
        response = requests.get(url, params=params)
        suggestions = response.json()[1]
        SAMPLE_TREND_DATA["google"] =suggestions[:max_results]
    except Exception as e:
        print(f"[Google Suggest Error] {e}")
        SAMPLE_TREND_DATA["google"] = []
    
# Keyword-source mapping
def extract_keywords_with_sources(trend_data):
    keyword_sources = {}
    for source, keywords in trend_data.items():
        for keyword in keywords:
            keyword_sources.setdefault(keyword.lower(), set()).add(source)
    return keyword_sources

# Wilson score
def wilson_score(pos, n, confidence=0.95):
    if n == 0: return 0
    z = norm.ppf(1 - (1 - confidence) / 2)
    phat = pos / n
    return (phat + z*z/(2*n) - z * math.sqrt((phat*(1 - phat) + z*z/(4*n)) / n)) / (1 + z*z/n)

# Semantic similarity
def semantic_similarity(query, keywords):
    query_vec = model.encode([query])
    keyword_vecs = model.encode(keywords)
    similarities = cosine_similarity(query_vec, keyword_vecs)[0]
    return dict(zip(keywords, similarities))

# Grouping with GPT
def group_keywords_with_llm(user_query, trend_data):
    prompt = f"""
    A user searched: '{user_query}'.
    Here are keywords from 3 trend sources:
    Google Trends: {trend_data['google']}


    Group the keywords into meaningful product-related clusters.
    Return output as JSON with groups and their keywords.
    """
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# Main analysis
def analyze_trends():
    user_query = "trending health products"
    get_google_suggestions(user_query, max_results=20)
    keyword_sources = extract_keywords_with_sources(SAMPLE_TREND_DATA)
    all_keywords = list(keyword_sources.keys())

    similarity_scores = semantic_similarity(user_query, all_keywords)

    ranked_keywords = []
    for keyword in all_keywords:
        sources = keyword_sources[keyword]
        pos = len(sources)
        n = 3
        score = 0.4 * wilson_score(pos, n) + \
                0.6 * similarity_scores[keyword]
        ranked_keywords.append({
            "keyword": keyword,
            "semantic_score": similarity_scores[keyword],
            "source_count": pos,
            "final_score": round(score, 4)
        })

    grouped_output = group_keywords_with_llm(user_query, SAMPLE_TREND_DATA)

    result = {
        "query": user_query,
        "ranked_keywords": sorted(ranked_keywords, key=lambda x: x['final_score'], reverse=True),
        "grouped_keywords": grouped_output
    }

    return result

# Entry point
if __name__ == "__main__":
    output = analyze_trends()
    print(output)
