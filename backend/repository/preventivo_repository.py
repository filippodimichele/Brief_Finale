from model.preventivo import Preventivo
from sqlalchemy import select

def get_all(session):
    # recupera tutti i preventivi generati
    return session.execute(select(Preventivo)).scalars().all()

def get_by_id(session, id_preventivo):
    # cerca un preventivo specifico tramite id
    return session.get(Preventivo, id_preventivo)

def add(session, preventivo):
    # salva un nuovo preventivo
    session.add(preventivo)
    session.commit()

def delete(session, id_preventivo):
    # elimina un preventivo dal database
    preventivo = get_by_id(session, id_preventivo)
    if preventivo:
        session.delete(preventivo)
        session.commit()