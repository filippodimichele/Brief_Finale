from model.modello import Modello
from sqlalchemy import select

def get_all(session):
    # recupera tutti i modelli
    return session.execute(select(Modello)).scalars().all()

def get_by_id(session, id_modello):
    # cerca un modello per id
    return session.get(Modello, id_modello)

def add(session, modello):
    # aggiunge un nuovo modello
    session.add(modello)
    session.commit()

def delete(session, id_modello):
    # rimuove un modello
    modello = get_by_id(session, id_modello)
    if modello:
        session.delete(modello)
        session.commit()