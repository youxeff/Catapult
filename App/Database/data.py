from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from . import models
from typing import List, Optional, Dict, Any
from sqlalchemy import desc
import logging

logger = logging.getLogger(__name__)

def get_all_products(db: Session, skip: int = 0, limit: int = 100) -> List[models.TiktokProduct]:
    return db.query(models.TiktokProduct).offset(skip).limit(limit).all()

def get_product_by_id(db: Session, product_id: int) -> Optional[models.TiktokProduct]:
    return db.query(models.TiktokProduct).filter(models.TiktokProduct.id == product_id).first()

def get_trending_products(db: Session, limit: int = 10) -> List[models.TiktokProduct]:
    return db.query(models.TiktokProduct).order_by(desc(models.TiktokProduct.rating)).limit(limit).all()

def search_products(db: Session, query: str, skip: int = 0, limit: int = 100) -> List[models.TiktokProduct]:
    search = f"%{query}%"
    return db.query(models.TiktokProduct).filter(
        models.TiktokProduct.product_name.ilike(search)
    ).offset(skip).limit(limit).all()

def insert_product(db: Session, data: Dict[str, Any], supplier: str) -> Optional[models.TiktokProduct]:
    """
    Unified product insertion function that handles products from all sources
    """
    try:
        # Extract and clean product name
        full_name = data.get("title") or data.get("productNameEn") or data.get("product_title", "No Title")
        name_words = full_name.strip().split()
        short_name = " ".join(name_words[:3]) if len(name_words) >= 3 else full_name

        # Handle different price formats
        price_raw = str(data.get("price") or data.get("sellPrice") or data.get("product_price") or "0")
        price_clean = price_raw.replace("$", "").replace(",", "").strip()
        try:
            price = float(price_clean)
        except ValueError:
            price = 0.0

        # Create product instance
        product = models.TiktokProduct(
            product_name=short_name,
            product_description=full_name,
            product_category=data.get("categoryName") or data.get("second_level_category_name", "Uncategorized"),
            list_velocity=float(data.get("squared_velocity") or data.get("list_velocity") or 0),
            supplier=supplier,
            product_price=price,
            rating=float(data.get("rating") or data.get("product_star_rating") or 0),
            product_image_url=(
                data.get("productImage") or 
                data.get("product_main_image_url") or 
                data.get("product_image_url")
            ),
            sold_today=int(data.get("sold_today") or 20),
            sold_1_month_ago=int(data.get("sold_1_month_ago") or 200)
        )

        db.add(product)
        db.commit()
        db.refresh(product)
        logger.info(f"Successfully inserted product: {short_name} from {supplier}")
        return product

    except SQLAlchemyError as e:
        logger.error(f"Database error inserting product from {supplier}: {str(e)}")
        db.rollback()
        return None
    except Exception as e:
        logger.error(f"Unexpected error inserting product from {supplier}: {str(e)}")
        db.rollback()
        return None