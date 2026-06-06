from model.motorizzazione import Motorizzazione
from sqlalchemy import select

def get_all(session):
    # recupera la lista completa delle motorizzazioni
    return session.execute(select(Motorizzazione)).scalars().all()

def get_by_id(session, id_motorizzazione):
    # cerca una motorizzazione specifica tramite id
    return session.get(Motorizzazione, id_motorizzazione)

def add(session, motorizzazione):
    # inserisce una nuova motorizzazione nel database
    session.add(motorizzazione)
    session.commit()

def delete(session, id_motorizzazione):
    # rimuove una motorizzazione dal database
    motorizzazione = get_by_id(session, id_motorizzazione)
    if motorizzazione:
        session.delete(motorizzazione)
        session.commit()