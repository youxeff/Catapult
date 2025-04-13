from flask import Flask, jsonify
from flask_cors import CORS
from Database.config import get_db
from Database.models import TiktokProduct
from sqlalchemy import desc
import json

app = Flask(__name__)
# Add explicit CORS configuration
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.route("/")
def home():
    return "Flask is working!"

@app.route("/api/products")
def get_products():
    db = next(get_db())
    try:
        products = db.query(TiktokProduct).order_by(desc(TiktokProduct.rating)).all()
        return jsonify([{
            'id': p.id,
            'name': p.product_name,
            'price': float(p.sell_price) if p.sell_price else None,
            'supplier': p.supplier,
            'rating': float(p.rating) if p.rating else None,
            'lastUpdated': p.scraped_at.isoformat() if p.scraped_at else None,
            'imageUrl': p.image_url or "https://images.pexels.com/photos/4464482/pexels-photo-4464482.jpeg?auto=compress&cs=tinysrgb&w=1600"  # Use actual image_url with fallback
        } for p in products])
    except Exception as e:
        print(f"Error in get_products: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@app.route("/api/products/category/<category_id>")
def get_products_by_category(category_id):
    db = next(get_db())
    try:
        products = db.query(TiktokProduct).filter(
            TiktokProduct.supplier == category_id
        ).order_by(desc(TiktokProduct.rating)).all()
        return jsonify([{
            'id': p.id,
            'name': p.product_name,
            'price': float(p.sell_price) if p.sell_price else None,
            'supplier': p.supplier,
            'rating': float(p.rating) if p.rating else None,
            'lastUpdated': p.scraped_at.isoformat() if p.scraped_at else None,
            'imageUrl': p.image_url or "https://images.pexels.com/photos/4464482/pexels-photo-4464482.jpeg?auto=compress&cs=tinysrgb&w=1600"  # Use actual image_url with fallback
        } for p in products])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

if __name__ == "__main__":
    app.run(debug=True, port=5001)
