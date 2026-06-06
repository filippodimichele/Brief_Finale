from model.allestimento import Allestimento
from sqlalchemy import select

def get_all(session):
    # recupera tutti gli allestimenti dal database
    return session.execute(select(Allestimento)).scalars().all()

def get_by_id(session, id_allestimento):
    # cerca un allestimento specifico tramite il suo id
    return session.get(Allestimento, id_allestimento)

def add(session, allestimento):
    # aggiunge un nuovo allestimento
    session.add(allestimento)
    session.commit()

def delete(session, id_allestimento):
    # elimina un allestimento dal database
    allestimento = get_by_id(session, id_allestimento)
    if allestimento:
        session.delete(allestimento)
        session.commit()