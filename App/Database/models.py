from sqlalchemy import Column, Integer, String, Float, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class TiktokProduct(Base):
    __tablename__ = 'tiktok_products'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Float)
    price_range = Column(String(255))
    image_url = Column(String(512))
    trend_score = Column(Float)
    category_id = Column(String(50))
    sellers = Column(Text)  # Stored as JSON string