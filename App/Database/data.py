from sqlalchemy.orm import Session
from . import models
from typing import List, Optional
from sqlalchemy import desc

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