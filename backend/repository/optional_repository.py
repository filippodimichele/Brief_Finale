from model.optional import Optional
from sqlalchemy import select

def get_all(session):
    # recupera tutti gli optional disponibili nel sistema
    return session.execute(select(Optional)).scalars().all()

def get_by_id(session, id_optional):
    # cerca un optional specifico tramite id
    return session.get(Optional, id_optional)

def add(session, optional):
    # aggiunge un nuovo optional al database
    session.add(optional)
    session.commit()

def delete(session, id_optional):
    # rimuove un optional dal catalogo
    optional = get_by_id(session, id_optional)
    if optional:
        session.delete(optional)
        session.commit()