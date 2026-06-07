#inizializzazione manuale per db
from persistence.db_confing import engine, Base
from model.marchio import Marchio

def reset_database():
    print("Eliminazione tabelle esistenti...")
    Base.metadata.drop_all(bind=engine)
    print("Creazione nuove tabelle...")
    Base.metadata.create_all(bind=engine)
    print("Database inizializzato correttamente.")

if __name__ == "__main__":
    reset_database()