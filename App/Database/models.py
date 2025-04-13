from sqlalchemy import Column, Integer, String, Float, Text, DateTime, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class TiktokProduct(Base):
    __tablename__ = 'tiktok_products'

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_name = Column(String(255), nullable=False)
    sell_price = Column(DECIMAL(10,2), nullable=True)
    supplier = Column(String(100), nullable=True)
    rating = Column(DECIMAL(2,1), nullable=True)
    scraped_at = Column(DateTime, nullable=True, default=datetime.utcnow)