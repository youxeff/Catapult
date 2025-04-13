from flask import Flask, jsonify
from flask_cors import CORS
from Database.config import get_db
from Database.models import TiktokProduct
from sqlalchemy import desc
import json

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Flask is working!"

@app.route("/api/products")
def get_products():
    db = next(get_db())
    try:
        products = db.query(TiktokProduct).order_by(desc(TiktokProduct.trend_score)).all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'priceRange': p.price_range,
            'image': p.image_url,
            'trendScore': p.trend_score,
            'categoryId': p.category_id,
            'sellers': json.loads(p.sellers) if p.sellers else []
        } for p in products])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@app.route("/api/products/category/<category_id>")
def get_products_by_category(category_id):
    db = next(get_db())
    try:
        products = db.query(TiktokProduct).filter(
            TiktokProduct.category_id == category_id
        ).order_by(desc(TiktokProduct.trend_score)).all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'priceRange': p.price_range,
            'image': p.image_url,
            'trendScore': p.trend_score,
            'categoryId': p.category_id,
            'sellers': json.loads(p.sellers) if p.sellers else []
        } for p in products])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

if __name__ == "__main__":
    app.run(debug=True)
