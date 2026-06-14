from persistence.db_confing import get_session
from model.ruolo import Ruolo
from model.marchio import Marchio
from model.modello import Modello
from model.optional import Optional
from model.allestimento import Allestimento
from model.motorizzazione import Motorizzazione
from model.utente import Utente
from model.catalogo import AbbinamentoCatalogo

def seed_ruoli_e_utenti(session):
    if session.query(Ruolo).count() == 0:
        ruoli = [Ruolo(nome_ruolo="Admin"), Ruolo(nome_ruolo="Cliente")]
        session.add_all(ruoli)
        session.commit()
    
    if session.query(Utente).count() == 0:
        utenti = [
            Utente(id_ruolo=1, nome="Filippo", cognome="Rossi", email="admin@example.com", password="admin123"), # ID 1
            Utente(id_ruolo=2, nome="Luca", cognome="Bianchi", email="utente@example.com", password="password"), # ID 2
            Utente(id_ruolo=2, nome="Marco", cognome="Verdi", email="utente2@example.com", password="password123") #ID 3
        ]
        session.add_all(utenti)
        session.commit()
        print("[LOG] - Ruoli e Utenti inseriti.")

def seed_marchi_e_modelli(session):
    if session.query(Marchio).count() == 0:
        marchi = [
            Marchio(nome_marchio="FIAT", paese_origine="Italia"),       # 1
            Marchio(nome_marchio="Alfa Romeo", paese_origine="Italia"), # 2
            Marchio(nome_marchio="Lancia", paese_origine="Italia"),     # 3
            Marchio(nome_marchio="Abarth", paese_origine="Italia"),     # 4
            Marchio(nome_marchio="Audi", paese_origine="Germania"),     # 5
            Marchio(nome_marchio="BMW", paese_origine="Germania"),      # 6
            Marchio(nome_marchio="Volkswagen", paese_origine="Germania"),# 7
            Marchio(nome_marchio="Mercedes", paese_origine="Germania")  # 8
        ]
        session.add_all(marchi)
        session.commit()

    if session.query(Modello).count() == 0:
        modelli = [
            # FIAT (1)
            Modello(nome_modello="Grande Panda", id_marchio=1), Modello(nome_modello="500", id_marchio=1), Modello(nome_modello="Topolino", id_marchio=1),
            # Alfa (2)
            Modello(nome_modello="Tonale", id_marchio=2), Modello(nome_modello="Giulia", id_marchio=2), Modello(nome_modello="Stelvio", id_marchio=2),
            # Lancia (3)
            Modello(nome_modello="Ypsilon", id_marchio=3),
            # Abarth (4)
            Modello(nome_modello="500e", id_marchio=4), Modello(nome_modello="600e", id_marchio=4),
            # Audi (5)
            Modello(nome_modello="A3", id_marchio=5), Modello(nome_modello="A5", id_marchio=5), Modello(nome_modello="Q5", id_marchio=5),
            # BMW (6)
            Modello(nome_modello="Serie 1", id_marchio=6), Modello(nome_modello="Serie 3", id_marchio=6), Modello(nome_modello="X1", id_marchio=6),
            # VW (7)
            Modello(nome_modello="Golf", id_marchio=7), Modello(nome_modello="Polo", id_marchio=7), Modello(nome_modello="Tiguan", id_marchio=7),
            # Mercedes (8)
            Modello(nome_modello="Classe A", id_marchio=8), Modello(nome_modello="Classe C", id_marchio=8), Modello(nome_modello="GLA", id_marchio=8)
        ]
        session.add_all(modelli)
        session.commit()
        print("[LOG] - Marchi e Modelli inseriti.")

def seed_optional_ordinati(session):
    # ATTENZIONE: Questo array rispetta rigorosamente gli ID da 1 a 113 del frontend
    if session.query(Optional).count() == 0:
        opts = [
            # --- FIAT (ID 1 - 12) ---
            Optional(nome_optional="Arancio Sicilia (Pastello)", prezzo=0), Optional(nome_optional="Bianco Gelato", prezzo=550), Optional(nome_optional="Blu Italia Metallizzato", prezzo=700), Optional(nome_optional="Verde Alberese", prezzo=700),
            Optional(nome_optional="Cerchi in acciaio 16", prezzo=0), Optional(nome_optional="Cerchi in lega da 17", prezzo=650),
            Optional(nome_optional="Tessuto Seaqual Yarn Grigio", prezzo=0), Optional(nome_optional="Tessuto monogramma Fiat", prezzo=450),
            Optional(nome_optional="Plancia Polimerica Nera", prezzo=0), Optional(nome_optional="Fascia Plancia Bianco", prezzo=250),
            Optional(nome_optional="Pack Comfort & Tech", prezzo=1200), Optional(nome_optional="Pack Style", prezzo=800),
            # --- ALFA ROMEO (ID 13 - 26) ---
            Optional(nome_optional="Rosso Alfa", prezzo=0), Optional(nome_optional="Nero Vulcano", prezzo=1100), Optional(nome_optional="Blu Misano", prezzo=1200), Optional(nome_optional="Rosso Competizione", prezzo=2500),
            Optional(nome_optional="Cerchi 18 turbina", prezzo=0), Optional(nome_optional="Cerchi 19 Classico", prezzo=1300), Optional(nome_optional="Cerchi 20 Teledial", prezzo=2200),
            Optional(nome_optional="Tessuto Tex Alfa", prezzo=0), Optional(nome_optional="Pelle Naturale", prezzo=1600), Optional(nome_optional="Alcantara Sportiva", prezzo=2100),
            Optional(nome_optional="Plancia Alluminio", prezzo=0), Optional(nome_optional="Plancia Carbonio", prezzo=950),
            Optional(nome_optional="Pack Techno", prezzo=1800), Optional(nome_optional="Pack Premium Veloce", prezzo=2400),
            # --- LANCIA (ID 27 - 38) ---
            Optional(nome_optional="Grigio Granito", prezzo=0), Optional(nome_optional="Verde Giada", prezzo=850), Optional(nome_optional="Blu Lancia", prezzo=850), Optional(nome_optional="Bicolore Oro", prezzo=1650),
            Optional(nome_optional="Cerchi 16 Aero", prezzo=0), Optional(nome_optional="Cerchi 17 Y-Design", prezzo=800),
            Optional(nome_optional="Velluto Blu", prezzo=0), Optional(nome_optional="Panna Cassina", prezzo=1200),
            Optional(nome_optional="Finitura cannettata", prezzo=0), Optional(nome_optional="Tavolino Cassina", prezzo=500),
            Optional(nome_optional="Pack Tech Cassina", prezzo=1500), Optional(nome_optional="Pack Lounge", prezzo=1100),
            # --- ABARTH (ID 39 - 50) ---
            Optional(nome_optional="Verde Acido", prezzo=0), Optional(nome_optional="Veleno Blue", prezzo=750), Optional(nome_optional="Nero Antracite", prezzo=750), Optional(nome_optional="Grigio Track", prezzo=1500),
            Optional(nome_optional="Cerchi 17 Racing", prezzo=0), Optional(nome_optional="Cerchi 18 Diamond", prezzo=950),
            Optional(nome_optional="Tessuto Abarth", prezzo=0), Optional(nome_optional="Alcantara Scorpione", prezzo=1400),
            Optional(nome_optional="Plancia Nero Titanio", prezzo=0), Optional(nome_optional="Plancia Alcantara", prezzo=600),
            Optional(nome_optional="Pack Turismo", prezzo=2000), Optional(nome_optional="Pack Scorpion Track", prezzo=2500),
            # --- AUDI (ID 51 - 66) ---
            Optional(nome_optional="Bianco Ibis", prezzo=0), Optional(nome_optional="Grigio Chronos", prezzo=930), Optional(nome_optional="Blu Navarra", prezzo=930), Optional(nome_optional="Grigio Daytona", prezzo=1250),
            Optional(nome_optional="Cerchi 17 Audi", prezzo=0), Optional(nome_optional="Cerchi 18 Audi Sport", prezzo=1150), Optional(nome_optional="Cerchi 19 a Y", prezzo=2050),
            Optional(nome_optional="Tessuto Index Nero", prezzo=0), Optional(nome_optional="Pelle Milano", prezzo=1850), Optional(nome_optional="Pelle nappa trapuntata", prezzo=2600),
            Optional(nome_optional="Inserti grigio platino", prezzo=0), Optional(nome_optional="Inserti Alluminio", prezzo=400), Optional(nome_optional="Carbonio Atlas", prezzo=1100),
            Optional(nome_optional="Pacchetto Evolution", prezzo=1950), Optional(nome_optional="Pacchetto Assistenza", prezzo=1450), Optional(nome_optional="Audio Sonos 3D", prezzo=890),
            # --- BMW (ID 67 - 82) ---
            Optional(nome_optional="Alpine White", prezzo=0), Optional(nome_optional="M Portimao Blue", prezzo=1100), Optional(nome_optional="Black Sapphire", prezzo=1100), Optional(nome_optional="Dravit Grey", prezzo=2350),
            Optional(nome_optional="Cerchi 17 V-Spoke", prezzo=0), Optional(nome_optional="Cerchi 18 M Double", prezzo=1250), Optional(nome_optional="Cerchi 19 M aero", prezzo=2150),
            Optional(nome_optional="Tessuto Veganza", prezzo=0), Optional(nome_optional="Pelle Vernasca", prezzo=1950), Optional(nome_optional="Pelle Merino Bicolore", prezzo=3200),
            Optional(nome_optional="Modanature Quartz Silver", prezzo=0), Optional(nome_optional="Legno Eucalyptus", prezzo=650), Optional(nome_optional="Fibra di carbonio M", prezzo=1200),
            Optional(nome_optional="Pacchetto Innovation", prezzo=3300), Optional(nome_optional="Pacchetto Travel", prezzo=1650), Optional(nome_optional="Driving Assistant", prezzo=1900),
            # --- VOLKSWAGEN (ID 83 - 97) ---
            Optional(nome_optional="Grigio Urano", prezzo=0), Optional(nome_optional="Pure White", prezzo=420), Optional(nome_optional="Lapiz Blue", prezzo=1050), Optional(nome_optional="Nero Deep Perla", prezzo=790),
            Optional(nome_optional="Cerchi 16 Norfolk", prezzo=0), Optional(nome_optional="Cerchi 17 Ventura", prezzo=750), Optional(nome_optional="Cerchi 19 Adelaide", prezzo=1650),
            Optional(nome_optional="Tessuto Wave", prezzo=0), Optional(nome_optional="Microfleece ArtVelours", prezzo=680), Optional(nome_optional="Pelle Vienna ventilati", prezzo=2250),
            Optional(nome_optional="Inserti Nature Cross", prezzo=0), Optional(nome_optional="Inserti luminosi", prezzo=350),
            Optional(nome_optional="Tech Pack", prezzo=1600), Optional(nome_optional="Driving Assistance Plus", prezzo=1050), Optional(nome_optional="Tetto Panoramico", prezzo=1300),
            # --- MERCEDES (ID 98 - 113) ---
            Optional(nome_optional="Nero Notte", prezzo=0), Optional(nome_optional="Argento Polare", prezzo=980), Optional(nome_optional="Blu Cavansite", prezzo=980), Optional(nome_optional="Grigio Montagna", prezzo=2700),
            Optional(nome_optional="Cerchi 17 5 razze", prezzo=0), Optional(nome_optional="Cerchi 18 AMG", prezzo=1200), Optional(nome_optional="Cerchi 19 AMG neri", prezzo=1950),
            Optional(nome_optional="Pelle sintetica Nero", prezzo=0), Optional(nome_optional="Pelle sintetica Grigio", prezzo=700), Optional(nome_optional="Pelle Nappa Rosso/Nero", prezzo=2900),
            Optional(nome_optional="Inserti carbonio scuro", prezzo=0), Optional(nome_optional="Legno di tiglio nero", prezzo=550), Optional(nome_optional="Plancia pelle ARTICO", prezzo=800),
            Optional(nome_optional="Pacchetto AMG Plus", prezzo=2850), Optional(nome_optional="Pacchetto Assistenza Guida", prezzo=1700), Optional(nome_optional="Audio Surround Burmester", prezzo=1050)
        ]
        session.add_all(opts)
        session.commit()
        print(f"[LOG] - {len(opts)} Optional caricati esattamente nell'ordine richiesto dal Frontend.")

def seed_abbinamenti(session):
    # Creiamo un allestimento base e un motore base per soddisfare i vincoli del DB
    if session.query(Allestimento).count() == 0:
        session.add(Allestimento(nome_allestimento="Standard"))
        session.commit()
    
    if session.query(Motorizzazione).count() == 0:
        session.add(Motorizzazione(nome_motore="Motore Gamma", alimentazione="Multi", potenza_cv=100))
        session.commit()

    if session.query(AbbinamentoCatalogo).count() == 0:
        # Recuperiamo gli ID delle tabelle ponte appena create
        al = session.query(Allestimento).first()
        mo = session.query(Motorizzazione).first()

        abbinamenti_frontend = [
            {"id_modello": 4, "prezzo": 39300.00},  # 1: Tonale (ID modello Alfa 1 -> 4 nel db)
            {"id_modello": 2, "prezzo": 17700.00},  # 2: 500/500e (ID modello Fiat 2)
            {"id_modello": 7, "prezzo": 24500.00},  # 3: Ypsilon (ID modello Lancia 1 -> 7)
            {"id_modello": 1, "prezzo": 18900.00},  # 4: Grande Panda (ID modello Fiat 1)
            {"id_modello": 3, "prezzo": 9890.00},   # 5: Topolino (ID modello Fiat 3)
            {"id_modello": 5, "prezzo": 47200.00},  # 6: Giulia
            {"id_modello": 6, "prezzo": 56500.00},  # 7: Stelvio
            {"id_modello": 9, "prezzo": 41900.00},  # 8: 600e
            {"id_modello": 10, "prezzo": 31200.00}, # 9: A3
            {"id_modello": 11, "prezzo": 47500.00}, # 10: A5
            {"id_modello": 12, "prezzo": 61500.00}, # 11: Q5
            {"id_modello": 13, "prezzo": 34200.00}, # 12: Serie 1
            {"id_modello": 14, "prezzo": 46200.00}, # 13: Serie 3
            {"id_modello": 15, "prezzo": 41800.00}, # 14: X1
            {"id_modello": 16, "prezzo": 29400.00}, # 15: Golf
            {"id_modello": 17, "prezzo": 21500.00}, # 16: Polo
            {"id_modello": 18, "prezzo": 40200.00}, # 17: Tiguan
            {"id_modello": 19, "prezzo": 36200.00}, # 18: Classe A
            {"id_modello": 20, "prezzo": 52800.00}, # 19: Classe C
            {"id_modello": 21, "prezzo": 43900.00}  # 20: GLA
        ]

        for item in abbinamenti_frontend:
            nuovo = AbbinamentoCatalogo(
                id_modello=item["id_modello"],
                id_allestimento=al.id_allestimento,
                id_motorizzazione=mo.id_motorizzazione,
                prezzo_base=item["prezzo"]
            )
            session.add(nuovo)
        
        session.commit()
        print("[LOG] -  Abbinamenti Catalogo ")

def esegui_seed_completo():
    print("Inizio popolamento del database...")
    session = get_session()
    
    try:
        seed_ruoli_e_utenti(session)
        seed_marchi_e_modelli(session)
        seed_optional_ordinati(session)
        seed_abbinamenti(session)
        
        print("Popolazione completata con successo! ")
    except Exception as e:
        session.rollback()
        import traceback
        traceback.print_exc()
        print(f"[ERRORE durante il seed]: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    esegui_seed_completo()