from persistence.db_confing import engine, Base
from model.marchio import Marchio
from model.modello import Modello
from model.allestimento import Allestimento
from model.motorizzazione import Motorizzazione
from model.catalogo import AbbinamentoCatalogo
from model.optional import Optional
from model.configurazione import Configurazione
from model.preventivo import Preventivo
from model.ruolo import Ruolo
from model.utente import Utente

def init_database():
    print("[LOG] - Creazione tabelle nel database...")
    # crea le tabelle basandosi sulle classi ereditate da Base
    Base.metadata.create_all(bind=engine)
    print("[LOG] - Database pronto.")

if __name__ == "__main__":
    init_database()