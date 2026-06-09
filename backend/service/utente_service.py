# service/utente_service.py

from repository import utente_repository


def login(session, email, password):
    utente = utente_repository.get_by_email(session, email)
    if not utente or utente.password != password:
        raise ValueError("Credenziali errate")
    return utente

def get_tutti_utenti(session):
    return utente_repository.get_all(session)