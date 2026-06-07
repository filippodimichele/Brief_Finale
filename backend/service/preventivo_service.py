from datetime import datetime
from repository import configurazione_repository, preventivo_repository
from model.preventivo import Preventivo


def genera_preventivo(session, id_configurazione):
    # recupera la configurazione dal database
    config = configurazione_repository.get_by_id(session, id_configurazione)
    
    # validazione: verifica che la configurazione esista
    if not config:
        raise ValueError("Errore: configurazione non trovata nel sistema.")

    # calcolo del prezzo base a partire dall'abbinamento a catalogo
    prezzo_totale = config.abbinamento.prezzo_base

    # calcolo iterativo aggiungendo il costo di tutti gli optional scelti
    for opzione in config.optional_scelti:
        prezzo_totale += opzione.prezzo

    # creazione dell'entita preventivo con la data odierna
    nuovo_preventivo = Preventivo(
        id_configurazione=config.id_configurazione,
        prezzo_finale=prezzo_totale,
        data_emissione=datetime.now().date()
    )

    # salvataggio tramite repository
    preventivo_repository.add(session, nuovo_preventivo)
    
    return nuovo_preventivo