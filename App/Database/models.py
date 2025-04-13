from sqlalchemy import Column, Integer, String, Float, Text, DateTime, DECIMAL, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import json

Base = declarative_base()

class TiktokProduct(Base):
    __tablename__ = 'tiktok_products'

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_name = Column(String(255), nullable=False)
    product_description = Column(Text, nullable=True)
    product_category = Column(String(100), nullable=True)
    list_velocity = Column(DECIMAL(10,2), nullable=True, default=0.00)
    supplier = Column(String(100), nullable=True)
    product_price = Column(DECIMAL(10,2), nullable=False)
    rating = Column(DECIMAL(10,2), nullable=True, default=0.00)
    product_image_url = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, nullable=True, server_default='CURRENT_TIMESTAMP')
    sold_today = Column(Integer, nullable=True, default=0)
    sold_1_month_ago = Column(Integer, nullable=True, default=0)

    def to_dict(self):
        """Convert the model instance to a dictionary"""
        return {
            'id': self.id,
            'name': self.product_name,
            'description': self.product_description,
            'category': self.product_category,
            'list_velocity': float(self.list_velocity) if self.list_velocity else 0,
            'supplier': self.supplier,
            'price': float(self.product_price) if self.product_price else None,
            'rating': float(self.rating) if self.rating else None,
            'imageUrl': self.product_image_url,
            'lastUpdated': self.created_at.isoformat() if self.created_at else None,
            'sold_today': self.sold_today or 0,
            'sold_1_month_ago': self.sold_1_month_ago or 0
        }