from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

class Base(DeclarativeBase):
    pass

engine = create_engine("postgresql://postgres@localhost/configurazione_auto", echo=True)

SessionLocal = sessionmaker(bind=engine)

def get_session():
    # restituisce una nuova sessione di lavoro con il database
    return SessionLocal()

def init_db():
    print("[LOG] - Creazione Database   ")

    import model.catalogo
    import model.marchio
    import model.modello
    import model.optional
    import model.preventivo
    import model.ruolo
    import model.utente
    import model.allestimento
    import model.motorizzazione
    import model.configurazione 

    Base.metadata.create_all(bind=engine)