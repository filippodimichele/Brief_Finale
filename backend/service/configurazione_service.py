
from repository import configurazione_repository, optional_repository
from model.configurazione import Configurazione


def crea_configurazione(session, id_utente, id_abbinamento, lista_optional_ids):
    nuova = Configurazione(
        id_utente=id_utente,
        id_abbinamento=id_abbinamento
    )

    # associa gli optional scelti
    for opt_id in lista_optional_ids:
        opt = optional_repository.get_by_id(session, opt_id)
        if opt:
            nuova.optional_scelti.append(opt)

    configurazione_repository.add(session, nuova)
    return nuova

def get_configurazione(session, id_configurazione):
    config = configurazione_repository.get_by_id(session, id_configurazione)
    if not config:
        raise ValueError("Configurazione non trovata")
    return config