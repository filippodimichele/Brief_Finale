from repository import preventivo_repository, configurazione_repository
from model.preventivo import Preventivo
from model.configurazione import Configurazione
from model.catalogo import AbbinamentoCatalogo
from model.modello import Modello
from sqlalchemy.orm import joinedload

def genera_preventivo(session, id_configurazione):
    # carica la configurazione precaricando le relazioni
    config = (
        session.query(Configurazione)
        .options(
            joinedload(Configurazione.abbinamento),
            joinedload(Configurazione.optional_scelti)
        )
        .filter(Configurazione.id_configurazione == id_configurazione)
        .first()
    )
    
    if not config:
        raise ValueError("errore: configurazione non trovata nel sistema.")

    prezzo_calcolato = float(config.abbinamento.prezzo_base) if (config.abbinamento and config.abbinamento.prezzo_base is not None) else 0.0
    
    for opzione in config.optional_scelti:
        valore_optional = opzione.prezzo if opzione.prezzo is not None else 0.0
        prezzo_calcolato += float(valore_optional)

    # crea il preventivo impostando lo stato iniziale
    nuovo_preventivo = Preventivo(
        id_utente=config.id_utente,
        id_abbinamento=config.id_abbinamento,
        prezzo_totale=prezzo_calcolato,
        stato="in attesa"
    )
    
    nuovo_preventivo.optional_scelti = [opt for opt in config.optional_scelti]
    preventivo_repository.add(session, nuovo_preventivo)
    return nuovo_preventivo

def get_preventivi_utente(session, id_utente):
    # scarica i preventivi dell'utente con le relative relazioni
    return (
        session.query(Preventivo)
        .filter(Preventivo.id_utente == id_utente)
        .options(
            joinedload(Preventivo.abbinamento)
            .joinedload(AbbinamentoCatalogo.modello)
            .joinedload(Modello.marchio),
            joinedload(Preventivo.optional_scelti)
        )
        .all()
    )

# NUOVA: recupera l'elenco globale di tutti i preventivi per il pannello amministratore
def get_tutti_preventivi(session):
    # esegue una query caricando ricorsivamente l'albero delle relazioni e l'anagrafica utente
    return (
        session.query(Preventivo)
        .options(
            joinedload(Preventivo.abbinamento)
            .joinedload(AbbinamentoCatalogo.modello)
            .joinedload(Modello.marchio),
            joinedload(Preventivo.optional_scelti),
            joinedload(Preventivo.utente) # precarica l'utente per recuperare p.utente.nome nella rotta admin
        )
        .order_by(Preventivo.data_creazione.desc())
        .all()
    )

def aggiorna_stato_preventivo(session, id_preventivo, nuovo_stato):
    # modifica lo stato di un preventivo esistente
    stati_validi = ["in attesa", "approvato", "rifiutato"]
    if nuovo_stato not in stati_validi:
        raise ValueError("stato non valido.")
        
    preventivo = session.get(Preventivo, id_preventivo)
    if not preventivo:
        raise ValueError("preventivo non trovato.")
        
    preventivo.stato = nuovo_stato
    return preventivo

def elimina_preventivo(session, id_preventivo):
    # recupera l'istanza del record tramite id
    preventivo = session.get(Preventivo, id_preventivo)
    if not preventivo:
        raise ValueError("preventivo non trovato nel sistema.")
    
    # rimuove l'oggetto dalla sessione (grazie al cascade configurato sul db elimina anche i figli in automatico)
    session.delete(preventivo)
    return True