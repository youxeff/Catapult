from sqlalchemy import Column, Integer, String, Float, Text, DateTime, DECIMAL, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

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