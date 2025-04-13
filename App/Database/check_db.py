from sqlalchemy import text
from config import engine

def check_database():
    try:
        with engine.connect() as conn:
            # Check tables
            result = conn.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result]
            print("Tables in database:", tables)
            
            # If tiktok_products exists, check its structure
            if 'tiktok_products' in tables:
                result = conn.execute(text("DESCRIBE tiktok_products"))
                print("\nTable structure:")
                for row in result:
                    print(row)
    except Exception as e:
        print(f"Error connecting to database: {e}")

if __name__ == "__main__":
    check_database()