# seo_opportunity_engine.py (Uses LLM to simulate keyword metrics instead of SEO API)

# --- Imports ---
from openai import OpenAI
import networkx as nx
from collections import defaultdict
from sklearn.cluster import DBSCAN
from sentence_transformers import SentenceTransformer
import json
import os
from dotenv import load_dotenv
import re

# --- Setup ---
load_dotenv()
model = SentenceTransformer('all-MiniLM-L6-v2')
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 1. Sector Extraction using LLM
def extract_sectors(user_query: str) -> list:
    print("\n[Step 1] Extracting sectors from user query...")
    prompt = f"""
You are a domain categorization assistant. Your task is to break down the following query into 4-6 distinct and specific product or topic sectors.

Query: "{user_query}"

Return the sectors as a raw JSON array of strings. Do not include any extra text or explanations. Example format:
["Sector A", "Sector B", "Sector C", "Sector D"]
"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    text = response.choices[0].message.content.strip()
    try:
        sectors = json.loads(text)
        print(f"Extracted Sectors: {sectors}")
        return sectors
    except Exception as e:
        print(f"Failed to parse sectors as JSON: {e}\nRaw response:\n{text}")
        return []

# 2. Simulated Keyword Metrics using LLM
def fetch_keywords_for_sector(sector: str) -> list:
    print(f"\n[Step 2] Generating keyword data for sector: {sector}")
    prompt = f"""
You are an SEO assistant. Generate 5 high-potential keywords for the sector "{sector}".
For each keyword, simulate the following metrics:
- volume: Estimated monthly search volume (1 to 10000)
- cpc: Cost per click (0 to 5)
- difficulty: Ranking difficulty (0 to 100)
- trend: Recent trend from -1 (downward) to 1 (strong upward)

Return only a **valid JSON array** of keyword objects. Each object must include "keyword", "volume", "cpc", "difficulty", and "trend".

Example:
[
  {{
    "keyword": "example keyword",
    "volume": 3500,
    "cpc": 1.75,
    "difficulty": 48,
    "trend": 0.4
  }},
  ...
]

Only return the raw JSON. Do NOT add markdown, explanations, or commentary.
"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    content = response.choices[0].message.content.strip()
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        match = re.search(r'\[.*\]', content, re.DOTALL)
        if not match:
            print(f"Failed to extract JSON array from response.\nRaw content:\n{content}")
            return []
        try:
            return json.loads(match.group())
        except Exception as e:
            print(f"Failed to parse extracted JSON array: {e}")
            return []

# 3. Build Keyword Graph
def build_graph(keywords: list):
    print("[Step 3] Building keyword graph...")
    G = nx.Graph()
    for kw in keywords:
        G.add_node(kw["keyword"], **kw)
    for i, k1 in enumerate(keywords):
        for j, k2 in enumerate(keywords):
            if i < j and any(w in k2["keyword"].lower() for w in k1["keyword"].lower().split()):
                G.add_edge(k1["keyword"], k2["keyword"], weight=1.0)
    print(f"Graph has {G.number_of_nodes()} nodes and {G.number_of_edges()} edges.")
    return G

# 4. Cluster Keywords using Embeddings
def cluster_keywords(graph):
    print("[Step 4] Clustering keywords using semantic embeddings...")
    keywords = list(graph.nodes)
    if len(keywords) < 2:
        print("Not enough keywords for clustering.")
        return {}
    embeddings = model.encode(keywords)
    clustering = DBSCAN(eps=1.0, min_samples=1).fit(embeddings)
    labels = clustering.labels_
    clusters = defaultdict(list)
    for keyword, label in zip(keywords, labels):
        clusters[label].append(keyword)
    print(f"Formed {len(clusters)} keyword clusters.")
    return dict(clusters)

# 5. Score Each Keyword by Strategic Signals
def score_keyword(node_data):
    norm_volume = min(node_data["volume"] / 10000, 1.0)
    norm_cpc = min(node_data["cpc"] / 5, 1.0)
    norm_difficulty = 1 - min(node_data["difficulty"] / 100, 1.0)
    norm_trend = (node_data["trend"] + 1) / 2
    score = (
        0.25 * norm_volume +
        0.25 * norm_cpc +
        0.20 * norm_difficulty +
        0.30 * norm_trend
    )
    return round(score, 3)

# 6. Assemble and Rank Opportunities
def assemble_opportunities(clusters, graph):
    print("[Step 5] Assembling and scoring opportunity clusters...")
    results = []
    for cluster_id, keywords in clusters.items():
        nodes = [graph.nodes[k] for k in keywords]
        avg_score = sum(score_keyword(n) for n in nodes) / len(nodes)
        results.append({
            "theme": keywords[0].split()[0].capitalize() + " Theme",
            "keywords": keywords,
            "avg_score": round(avg_score, 3)
        })
    return sorted(results, key=lambda x: x["avg_score"], reverse=True)

# 7. Main Pipeline
def run_pipeline(user_query):
    print("\n[Pipeline Start] User query received: " + user_query)
    sectors = extract_sectors(user_query)
    all_opportunities = []

    for sector in sectors:
        keywords = fetch_keywords_for_sector(sector)
        if not keywords:
            print(f"[Info] No keyword data available for sector: {sector}")
            continue
        graph = build_graph(keywords)
        clusters = cluster_keywords(graph)
        sector_opps = assemble_opportunities(clusters, graph)
        all_opportunities.extend(sector_opps)

    print("\n[Pipeline Complete] Returning ranked opportunities...")
    return sorted(all_opportunities, key=lambda x: x["avg_score"], reverse=True)

# Example Usage
if __name__ == "__main__":
    query = "coffee cups"
    results = run_pipeline(query)
    print(results)
    # for opp in results:
    #     print(f"\n=== Theme: {opp['theme']} | Score: {opp['avg_score']} ===")
    #     print(f"Keywords: {', '.join(opp['keywords'])}")
