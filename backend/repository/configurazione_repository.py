from model.configurazione import Configurazione
from sqlalchemy import select

def get_all(session):
    # recupera tutte le configurazioni effettuate
    return session.execute(select(Configurazione)).scalars().all()

def get_by_id(session, id_configurazione):
    # cerca una configurazione specifica tramite id
    return session.get(Configurazione, id_configurazione)

def add(session, configurazione):
    # salva una nuova configurazione (il commit lo farà app.py)
    session.add(configurazione)

def delete(session, id_configurazione):
    # rimuove una configurazione (il commit lo farà app.py)
    configurazione = get_by_id(session, id_configurazione)
    if configurazione:
        session.delete(configurazione)