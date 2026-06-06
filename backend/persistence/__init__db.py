# backend/init_db.py
from persistence.db_confing import engine, Base
from model import * 
def init_database():
    print("[LOG] - Creazione tabelle nel database...")
    Base.metadata.create_all(bind=engine)
    print("[LOG] - Database pronto.")

if __name__ == "__main__":
    init_database()