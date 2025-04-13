# seo_opportunity_engine.py (Updated for openai>=1.0.0 with debug prints)

# --- Imports ---
from openai import OpenAI
import networkx as nx
from collections import defaultdict
from sklearn.cluster import DBSCAN
from sentence_transformers import SentenceTransformer
import os

# --- Embedding Model ---
model = SentenceTransformer('all-MiniLM-L6-v2')
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # Uses environment variable OPENAI_API_KEY or a .env file

# 1. Sector Extraction using LLM (OpenAI >= 1.0.0)
def extract_sectors(user_query: str) -> list:
    print("\n[Step 1] Extracting sectors from user query...")
    prompt = f"Break down the query '{user_query}' into 4-6 specific product or topic sectors."
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    text = response.choices[0].message.content
    sectors = [s.strip("- ") for s in text.split("\n") if s.strip()]
    print(f"Extracted Sectors: {sectors}")
    return sectors

# 2. Simulated SEO Keyword Fetcher (Temp Static Data)
def fetch_keywords_for_sector(sector: str) -> list:
    print(f"\n[Step 2] Fetching keyword data for sector: {sector}")
    temp_data = {
        "Diapers": [
            {"keyword": "eco-friendly diapers", "volume": 8800, "cpc": 2.1, "difficulty": 38, "trend": 0.4},
            {"keyword": "cloth diapers", "volume": 9900, "cpc": 0.9, "difficulty": 67, "trend": -0.1},
            {"keyword": "overnight diapers", "volume": 6200, "cpc": 1.85, "difficulty": 50, "trend": 0.25}
        ],
        "Pills": [
            {"keyword": "vegan pills", "volume": 5000, "cpc": 1.5, "difficulty": 45, "trend": 0.2},
            {"keyword": "pain relief pills", "volume": 8500, "cpc": 2.4, "difficulty": 62, "trend": 0.3},
            {"keyword": "herbal pills", "volume": 7600, "cpc": 1.1, "difficulty": 40, "trend": 0.5}
        ]
    }
    keywords = temp_data.get(sector, [])
    print(f"Retrieved {len(keywords)} keywords.")
    return keywords

# 3. Build Keyword Graph
def build_graph(keywords: list):
    print("[Step 3] Building keyword graph...")
    G = nx.Graph()
    for kw in keywords:
        G.add_node(kw["keyword"], **kw)
    for i, k1 in enumerate(keywords):
        for j, k2 in enumerate(keywords):
            if i < j and any(w in k2["keyword"] for w in k1["keyword"].split()):
                G.add_edge(k1["keyword"], k2["keyword"], weight=1.0)
    print(f"Graph has {G.number_of_nodes()} nodes and {G.number_of_edges()} edges.")
    return G

# 4. Cluster Keywords using Embeddings
def cluster_keywords(graph):
    print("[Step 4] Clustering keywords using semantic embeddings...")
    keywords = list(graph.nodes)
    embeddings = model.encode(keywords)
    clustering = DBSCAN(eps=0.5, min_samples=2).fit(embeddings)
    labels = clustering.labels_
    clusters = defaultdict(list)
    for keyword, label in zip(keywords, labels):
        if label != -1:
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

# 6. Multi-Persona Strategic Reasoning
def personas_reasoning(keywords: list):
    print("[Step 6] Performing persona-based strategic reasoning...")
    joined = ", ".join(keywords)
    prompt = f"""You are simulating a panel of startup advisors. Analyze the keyword cluster: {joined}

- Growth Hacker
- SEO Strategist
- DTC Ecommerce Expert

For each, write 1 sentence explaining the strategic value of this niche.
"""
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# 7. Assemble and Rank Opportunities
def assemble_opportunities(clusters, graph):
    print("[Step 5] Assembling and scoring opportunity clusters...")
    results = []
    for cluster_id, keywords in clusters.items():
        nodes = [graph.nodes[k] for k in keywords]
        avg_score = sum(score_keyword(n) for n in nodes) / len(nodes)
        persona_thoughts = personas_reasoning(keywords)
        results.append({
            "theme": keywords[0].split()[0].capitalize() + " Theme",
            "keywords": keywords,
            "avg_score": round(avg_score, 3),
            "persona_thoughts": persona_thoughts
        })
    return sorted(results, key=lambda x: x["avg_score"], reverse=True)

# 8. Main Pipeline
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
    query = "diapers and pills"
    results = run_pipeline(query)
    for opp in results:
        print(f"\n=== Theme: {opp['theme']} | Score: {opp['avg_score']} ===")
        print(f"Keywords: {', '.join(opp['keywords'])}")
        print(f"Insights:\n{opp['persona_thoughts']}")
