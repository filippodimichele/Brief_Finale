
from repository import optional_repository
from model.optional import Optional


def get_tutti_optional(session):
    return optional_repository.get_all(session)

def crea_optional(session, nome, prezzo):
    nuovo = Optional(nome_optional=nome, prezzo=prezzo)
    optional_repository.add(session, nuovo)
    return nuovo

def aggiorna_optional(session, id_optional, dati):
    opt = optional_repository.get_by_id(session, id_optional)
    if not opt:
        raise ValueError("Optional non trovato")
    if 'nome_optional' in dati:
        opt.nome_optional = dati['nome_optional']
    if 'prezzo' in dati:
        opt.prezzo = dati['prezzo']
    return opt

def elimina_optional(session, id_optional):
    opt = optional_repository.get_by_id(session, id_optional)
    if not opt:
        raise ValueError("Optional non trovato")
    optional_repository.delete(session, opt)