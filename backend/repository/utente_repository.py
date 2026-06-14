from model.utente import Utente
from sqlalchemy import select

def get_all(session):
    # recupera tutti gli utenti
    return session.execute(select(Utente)).scalars().all()

def get_by_id(session, id_utente):
    # cerca un utente specifico tramite id
    return session.get(Utente, id_utente)

def add(session, utente):
    # registra un nuovo utente
    session.add(utente)
    session.commit()

def delete(session, id_utente):
    # elimina un utente dal sistema
    utente = get_by_id(session, id_utente)
    if utente:
        session.delete(utente)
        session.commit()

def get_by_email(session, email):
    # cerca un utente nel database tramite la sua email
    return session.execute(select(Utente).filter_by(email=email)).scalar_one_or_none()