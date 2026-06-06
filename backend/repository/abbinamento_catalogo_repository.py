from model.catalogo import AbbinamentoCatalogo
from sqlalchemy import select

def get_all(session):
    # recupera tutti gli abbinamenti del catalogo
    return session.execute(select(AbbinamentoCatalogo)).scalars().all()

def get_by_id(session, id_abbinamento):
    # cerca abbinamento specifico per id
    return session.get(AbbinamentoCatalogo, id_abbinamento)

def add(session, abbinamento):
    # aggiunge nuovo abbinamento
    session.add(abbinamento)
    session.commit()

def delete(session, id_abbinamento):
    # rimuove abbinamento dal catalogo
    abbinamento = get_by_id(session, id_abbinamento)
    if abbinamento:
        session.delete(abbinamento)
        session.commit()