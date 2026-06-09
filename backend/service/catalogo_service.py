
from repository import marchio_repository, modello_repository, abbinamento_catalogo_repository
from model.marchio import Marchio
from model.modello import Modello


# marchi

def get_tutti_marchi(session):
    return marchio_repository.get_all(session)

def crea_marchio(session, nome, paese):
    nuovo = Marchio(nome_marchio=nome, paese_origine=paese)
    marchio_repository.add(session, nuovo)
    return nuovo

def aggiorna_marchio(session, id_marchio, dati):
    marchio = marchio_repository.get_by_id(session, id_marchio)
    if not marchio:
        raise ValueError("Marchio non trovato")
    if 'nome_marchio' in dati:
        marchio.nome_marchio = dati['nome_marchio']
    if 'paese_origine' in dati:
        marchio.paese_origine = dati['paese_origine']
    return marchio

def elimina_marchio(session, id_marchio):
    marchio = marchio_repository.get_by_id(session, id_marchio)
    if not marchio:
        raise ValueError("Marchio non trovato")
    marchio_repository.delete(session, marchio)


# modelli

def get_modelli_per_marchio(session, id_marchio):
    return modello_repository.get_by_marchio(session, id_marchio)

def crea_modello(session, id_marchio, nome):
    nuovo = Modello(id_marchio=id_marchio, nome_modello=nome)
    modello_repository.add(session, nuovo)
    return nuovo

def aggiorna_modello(session, id_modello, dati):
    modello = modello_repository.get_by_id(session, id_modello)
    if not modello:
        raise ValueError("Modello non trovato")
    if 'nome_modello' in dati:
        modello.nome_modello = dati['nome_modello']
    if 'id_marchio' in dati:
        modello.id_marchio = dati['id_marchio']
    return modello

def elimina_modello(session, id_modello):
    modello = modello_repository.get_by_id(session, id_modello)
    if not modello:
        raise ValueError("Modello non trovato")
    modello_repository.delete(session, modello)


# abbinamenti catalogo

def get_catalogo_per_modello(session, id_modello):
    return abbinamento_catalogo_repository.get_by_modello(session, id_modello)