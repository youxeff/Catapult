import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Database.config import engine
from Database.models import Base

def init_database():
    try:
        # Create all tables
        Base.metadata.create_all(engine)
        print("Database tables created successfully!")
    except Exception as e:
        print(f"Error creating database tables: {e}")

if __name__ == "__main__":
    init_database()