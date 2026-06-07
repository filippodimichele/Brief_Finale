from persistence.db_confing import get_session
from model.ruolo import Ruolo
from model.marchio import Marchio
from model.modello import Modello
from model.optional import Optional
from model.allestimento import Allestimento
from model.motorizzazione import Motorizzazione
from model.utente import Utente
from model.catalogo import AbbinamentoCatalogo
from model.configurazione import Configurazione
from model.preventivo import Preventivo

def seed_ruoli_e_marchi(session):
    if session.query(Ruolo).count() == 0:
        ruoli = [Ruolo(nome_ruolo="Admin"), Ruolo(nome_ruolo="Cliente")]
        session.add_all(ruoli)
        print("[LOG] - Ruoli inseriti.")
    
    if session.query(Marchio).count() == 0:
        marchi = [
            Marchio(nome_marchio="FIAT", paese_origine="Italia"),
            Marchio(nome_marchio="Alfa Romeo", paese_origine="Italia"),
            Marchio(nome_marchio="Lancia", paese_origine="Italia"),
            Marchio(nome_marchio="Abarth", paese_origine="Italia"),
            Marchio(nome_marchio="Audi", paese_origine="Germania"),
            Marchio(nome_marchio="BMW", paese_origine="Germania"),
            Marchio(nome_marchio="Volkswagen", paese_origine="Germania"),
            Marchio(nome_marchio="Mercedes", paese_origine="Germania")
        ]
        session.add_all(marchi)
        print("[LOG] - Marchi inseriti.")
    session.commit()

def seed_allestimenti(session):
    if session.query(Allestimento).count() == 0:
        allestimenti = [
            Allestimento(nome_allestimento="Base"),
            Allestimento(nome_allestimento="Business"),
            Allestimento(nome_allestimento="Sport"),
            Allestimento(nome_allestimento="Executive"),
            Allestimento(nome_allestimento="Veloce"),
            Allestimento(nome_allestimento="AMG Line")
        ]
        session.add_all(allestimenti)
        session.commit()
        print("[LOG] - Allestimenti inseriti.")

def seed_motorizzazioni(session):
    if session.query(Motorizzazione).count() == 0:
        motori = [
            Motorizzazione(nome_motore="1.0 FireFly", alimentazione="Ibrida", potenza_cv=70),
            Motorizzazione(nome_motore="2.2 Turbo Diesel", alimentazione="Diesel", potenza_cv=210),
            Motorizzazione(nome_motore="2.0 TDI", alimentazione="Diesel", potenza_cv=150),
            Motorizzazione(nome_motore="1.5 TSI", alimentazione="Benzina", potenza_cv=150),
            Motorizzazione(nome_motore="2.0 Plug-in Hybrid", alimentazione="Ibrida Plug-in", potenza_cv=300)
        ]
        session.add_all(motori)
        session.commit()
        print("[LOG] - Motorizzazioni inserite.")

def seed_optional(session):
    if session.query(Optional).count() == 0:
        lista_optional = [
            Optional(nome_optional="Cerchi in lega 18 pollici", prezzo=800.00),
            Optional(nome_optional="Vernice metallizzata", prezzo=750.00),
            Optional(nome_optional="Sensori di parcheggio posteriori", prezzo=300.00)
        ]
        session.add_all(lista_optional)
        session.commit()
        print("[LOG] - Optional inseriti.")

def seed_modelli(session):
    if session.query(Modello).count() == 0:
        auto_da_inserire = {
            "FIAT": ["Panda", "500", "Tipo"],
            "Alfa Romeo": ["Giulia", "Stelvio", "Tonale"],
            "Lancia": ["Ypsilon"],
            "Abarth": ["595", "695"],
            "Audi": ["A3", "A4", "Q5"],
            "BMW": ["Serie 1", "Serie 3", "X1"],
            "Volkswagen": ["Golf", "Polo", "Tiguan"],
            "Mercedes": ["Classe A", "Classe C", "GLA"]
        }
        nuovi_modelli = []
        for nome_marchio, lista_modelli in auto_da_inserire.items():
            marchio_db = session.query(Marchio).filter_by(nome_marchio=nome_marchio).first()
            if marchio_db:
                for nome_modello in lista_modelli:
                    nuovi_modelli.append(Modello(id_marchio=marchio_db.id_marchio, nome_modello=nome_modello))
        session.add_all(nuovi_modelli)
        session.commit()
        print("[LOG] - Modelli inseriti.")

def seed_utenti(session):
    if session.query(Utente).count() == 0:
        ruolo_admin = session.query(Ruolo).filter_by(nome_ruolo="Admin").first()
        ruolo_cliente = session.query(Ruolo).filter_by(nome_ruolo="Cliente").first()
        
        utenti = []
        if ruolo_admin:
            utenti.append(Utente(
                id_ruolo=ruolo_admin.id_ruolo,
                nome="Mario",
                cognome="Rossi",
                email="admin@autosalone.it",
                password="password_sicura_123"
            ))
        if ruolo_cliente:
            utenti.append(Utente(
                id_ruolo=ruolo_cliente.id_ruolo,
                nome="Luigi",
                cognome="Verdi",
                email="cliente@email.it",
                password="password_cliente_123"
            ))
        session.add_all(utenti)
        session.commit()
        print("[LOG] - Utenti di test inseriti.")

def seed_abbinamenti(session):
    if session.query(AbbinamentoCatalogo).count() == 0:
        cerchi = session.query(Optional).filter_by(nome_optional="Cerchi in lega 18 pollici").first()
        vernice = session.query(Optional).filter_by(nome_optional="Vernice metallizzata").first()
        sensori = session.query(Optional).filter_by(nome_optional="Sensori di parcheggio posteriori").first()
        
        configurazioni = [
            {"modello": "Panda", "allestimento": "Base", "motore": "1.0 FireFly", "prezzo": 15500.00, "opts": [sensori]},
            {"modello": "Giulia", "allestimento": "Veloce", "motore": "2.2 Turbo Diesel", "prezzo": 49500.00, "opts": [cerchi, vernice]},
            {"modello": "Golf", "allestimento": "Sport", "motore": "1.5 TSI", "prezzo": 31200.00, "opts": [cerchi, vernice, sensori]}
        ]
        
        for item in configurazioni:
            m_db = session.query(Modello).filter_by(nome_modello=item["modello"]).first()
            a_db = session.query(Allestimento).filter_by(nome_allestimento=item["allestimento"]).first()
            mot_db = session.query(Motorizzazione).filter_by(nome_motore=item["motore"]).first()
            
            if m_db and a_db and mot_db:
                abbinamento = AbbinamentoCatalogo(
                    id_modello=m_db.id_modello,
                    id_allestimento=a_db.id_allestimento,
                    id_motorizzazione=mot_db.id_motorizzazione,
                    prezzo_base=item["prezzo"]
                )
                
                for o in item["opts"]:
                    if o:
                        abbinamento.optional_disponibili.append(o)
                        
                session.add(abbinamento)
        session.commit()
        print("[LOG] - Abbinamenti catalogo inseriti.")

def seed_transazioni(session):
    if session.query(Configurazione).count() == 0 and session.query(Preventivo).count() == 0:
        cliente = session.query(Utente).filter_by(email="cliente@email.it").first()
        panda = session.query(Modello).filter_by(nome_modello="Panda").first()
        giulia = session.query(Modello).filter_by(nome_modello="Giulia").first()
        
        if not cliente or not panda or not giulia:
            return
            
        abb_panda = session.query(AbbinamentoCatalogo).filter_by(id_modello=panda.id_modello).first()
        abb_giulia = session.query(AbbinamentoCatalogo).filter_by(id_modello=giulia.id_modello).first()
        
        sensori = session.query(Optional).filter_by(nome_optional="Sensori di parcheggio posteriori").first()
        cerchi = session.query(Optional).filter_by(nome_optional="Cerchi in lega 18 pollici").first()
        
        if abb_panda:
            conf_panda = Configurazione(id_utente=cliente.id_utente, id_abbinamento=abb_panda.id_abbinamento)
            if sensori:
                conf_panda.optional_scelti.append(sensori)
            session.add(conf_panda)
            
            prezzo_tot_panda = float(abb_panda.prezzo_base)
            if sensori:
                prezzo_tot_panda += float(sensori.prezzo)
                
            prev_panda = Preventivo(
                id_utente=cliente.id_utente,
                id_abbinamento=abb_panda.id_abbinamento,
                prezzo_totale=prezzo_tot_panda
            )
            if sensori:
                prev_panda.optional_scelti.append(sensori)
            session.add(prev_panda)
            
        if abb_giulia:
            conf_giulia = Configurazione(id_utente=cliente.id_utente, id_abbinamento=abb_giulia.id_abbinamento)
            if cerchi:
                conf_giulia.optional_scelti.append(cerchi)
            session.add(conf_giulia)
            
            prezzo_tot_giulia = float(abb_giulia.prezzo_base)
            if cerchi:
                prezzo_tot_giulia += float(cerchi.prezzo)
                
            prev_giulia = Preventivo(
                id_utente=cliente.id_utente,
                id_abbinamento=abb_giulia.id_abbinamento,
                prezzo_totale=prezzo_tot_giulia
            )
            if cerchi:
                prev_giulia.optional_scelti.append(cerchi)
            session.add(prev_giulia)
            
        session.commit()
        print("[LOG] - Configurazioni e preventivi inseriti.")

def esegui_seed_completo():
    print("Inizio popolamento del database...")
    session = get_session()
    
    try:
        seed_ruoli_e_marchi(session)
        seed_allestimenti(session)
        seed_motorizzazioni(session)
        seed_optional(session)
        
        seed_modelli(session)
        seed_utenti(session)
        
        seed_abbinamenti(session)
        seed_transazioni(session)
        
        print("Popolamento completato con successo!")
    except Exception as e:
        print(f"Errore durante il seed: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    esegui_seed_completo()