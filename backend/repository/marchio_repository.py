from model.marchio import Marchio
from sqlalchemy import select

def get_all(session):
    # recupera tutti i marchi disponibili
    return session.execute(select(Marchio)).scalars().all()

def get_by_id(session, id_marchio):
    # cerca un marchio per id
    return session.get(Marchio, id_marchio)

def add(session, marchio):
    # aggiunge un nuovo marchio
    session.add(marchio)
    session.commit()

def delete(session, id_marchio):
    # rimuove un marchio
    marchio = get_by_id(session, id_marchio)
    if marchio:
        session.delete(marchio)
        session.commit()