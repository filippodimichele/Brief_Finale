from model.ruolo import Ruolo
from sqlalchemy import select

def get_all(session):
    # recupera tutti i ruoli disponibili
    return session.execute(select(Ruolo)).scalars().all()

def get_by_id(session, id_ruolo):
    # cerca un ruolo specifico tramite id
    return session.get(Ruolo, id_ruolo)

def add(session, ruolo):
    # aggiunge un nuovo ruolo
    session.add(ruolo)
    session.commit()

def delete(session, id_ruolo):
    # elimina un ruolo dal database
    ruolo = get_by_id(session, id_ruolo)
    if ruolo:
        session.delete(ruolo)
        session.commit()