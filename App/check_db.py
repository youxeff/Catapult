from sqlalchemy import text; from Database.config import engine; with engine.connect() as conn: result = conn.execute(text("SHOW TABLES")); print([row[0] for row in result])
