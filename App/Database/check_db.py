import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sqlalchemy import text
from Database.config import engine
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_database():
    try:
        with engine.connect() as conn:
            # Check tables
            result = conn.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result]
            logger.info(f"Tables in database: {tables}")
            
            # If tiktok_products exists, check its structure
            if 'tiktok_products' in tables:
                result = conn.execute(text("DESCRIBE tiktok_products"))
                logger.info("\nTable structure:")
                for row in result:
                    logger.info(row)
    except Exception as e:
        logger.error(f"Error connecting to database: {e}")

if __name__ == "__main__":
    check_database()