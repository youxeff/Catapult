import asyncio
from openai import AsyncOpenAI
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
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 1. Sector Extraction (Improved)
async def extract_sectors(user_query: str) -> list:
    print("\n[Step 1] Extracting sectors from user query...")
    prompt = f"""
You are an SEO assistant. Break the following user query into 4 to 6 tightly related product or content categories that are highly relevant to the original topic.

Focus on subtypes, variations, or related use-cases of the original query — not general topics or unrelated industries.

User Query: "{user_query}"

Return only a JSON array of short sector labels (2-5 words max), like:
["{user_query} for travel", "{user_query} accessories", "{user_query} types", "{user_query} trends"]

Strictly return valid raw JSON array format. No extra text.
"""
    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    text = response.choices[0].message.content.strip()
    try:
        sectors = json.loads(text)
        print(f"Extracted Sectors: {sectors}")
        return sectors
    except Exception as e:
        print(f"Failed to parse sectors: {e}\n{text}")
        return []

# 2. Keyword Generation (Async)
async def fetch_keywords_for_sector(sector: str) -> list:
    print(f"\n[Step 2] Generating keywords for sector: {sector}")
    prompt = f"""
You are an SEO assistant. Generate 5 high-potential keywords for the sector "{sector}".
For each, simulate:
- volume: 1–10000
- cpc: 0–5
- difficulty: 0–100
- trend: -1 to 1

Return a JSON array of keyword objects with: "keyword", "volume", "cpc", "difficulty", "trend".
"""
    try:
        response = await client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        content = response.choices[0].message.content.strip()
        return json.loads(re.search(r'\[.*\]', content, re.DOTALL).group())
    except Exception as e:
        print(f"Error parsing keywords for {sector}: {e}")
        return []

# 3. Graph Builder
def build_graph(keywords: list):
    print("[Step 3] Building keyword graph...")
    G = nx.Graph()
    keyword_tokens = {kw["keyword"]: set(kw["keyword"].lower().split()) for kw in keywords}
    for kw in keywords:
        G.add_node(kw["keyword"], **kw)
    keys = list(keyword_tokens.keys())
    for i, k1 in enumerate(keys):
        for j in range(i + 1, len(keys)):
            if keyword_tokens[k1] & keyword_tokens[keys[j]]:
                G.add_edge(k1, keys[j], weight=1.0)
    print(f"Graph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges.")
    return G

# 4. Clustering
def cluster_keywords(graph):
    print("[Step 4] Clustering keywords...")
    keywords = list(graph.nodes)
    if len(keywords) < 2:
        return {}
    embeddings = model.encode(keywords)
    clustering = DBSCAN(eps=1.0, min_samples=1).fit(embeddings)
    clusters = defaultdict(list)
    for keyword, label in zip(keywords, clustering.labels_):
        clusters[label].append(keyword)
    print(f"Created {len(clusters)} clusters.")
    return dict(clusters)

# 5. Scoring
def score_keyword(node_data):
    norm_volume = min(node_data["volume"] / 10000, 1.0)
    norm_cpc = min(node_data["cpc"] / 5, 1.0)
    norm_difficulty = 1 - min(node_data["difficulty"] / 100, 1.0)
    norm_trend = (node_data["trend"] + 1) / 2
    return round(
        0.25 * norm_volume + 0.25 * norm_cpc + 0.20 * norm_difficulty + 0.30 * norm_trend,
        3
    )

# 6. Assemble Opportunities (Using sector name as theme)
def assemble_opportunities(clusters, graph, sector):
    print(f"[Step 5] Assembling ranked opportunities for sector: {sector}")
    results = []
    for cluster_id, keywords in clusters.items():
        nodes = [graph.nodes[k] for k in keywords]
        avg_score = sum(score_keyword(n) for n in nodes) / len(nodes)
        results.append({
            "theme": sector,
            "keywords": keywords,
            "avg_score": round(avg_score, 3)
        })
    return sorted(results, key=lambda x: x["avg_score"], reverse=True)

# 7. Main Pipeline
async def run_pipeline(user_query: str) -> dict:
    """
    Main pipeline that processes a user query and returns optimized search keywords
    with market analysis.
    
    Args:
        user_query (str): The user's search query
        
    Returns:
        dict: Results containing:
            - theme: The main product category/sector
            - keywords: List of related keywords
            - best_keyword: The highest scoring keyword
            - metrics: Market metrics for the best keyword
    """
    print("\n[Pipeline Start] Processing: " + user_query)
    
    # Extract relevant sectors
    sectors = await extract_sectors(user_query)
    if not sectors:
        # Fallback: treat the query itself as a sector
        sectors = [user_query]
    
    # Generate keywords for each sector
    keyword_tasks = [fetch_keywords_for_sector(sector) for sector in sectors]
    keyword_lists = await asyncio.gather(*keyword_tasks)
    
    all_opportunities = []
    for sector, keywords in zip(sectors, keyword_lists):
        if not keywords:
            continue
            
        # Build and analyze keyword graph
        graph = build_graph(keywords)
        clusters = cluster_keywords(graph)
        sector_opportunities = assemble_opportunities(clusters, graph, sector)
        all_opportunities.extend(sector_opportunities)
    
    # Sort by score and get best opportunity
    if not all_opportunities:
        # Fallback response using the original query
        return {
            "theme": user_query,
            "keywords": [user_query],
            "best_keyword": user_query,
            "metrics": {
                "volume": 500,
                "cpc": 1.0,
                "difficulty": 50,
                "trend": 0.0
            }
        }
    
    best_opportunity = sorted(
        all_opportunities,
        key=lambda x: x["avg_score"],
        reverse=True
    )[0]
    
    print("\n[Pipeline Complete]")
    return best_opportunity

# Entry Point
if __name__ == "__main__":
    query = "smart home gadgets"
    results = asyncio.run(run_pipeline(query))
    print(json.dumps(results, indent=2))
