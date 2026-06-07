#cartella test per db

from persistence.db_confing import get_session
from model.marchio import Marchio

session = get_session()
print("Tentativo di connessione al database...")
try:
    marchi = session.query(Marchio).all()
    print(f"Database connesso. Numero marchi trovati: {len(marchi)}")
except Exception as e:
    print(f"Errore durante la lettura: {e}")
finally:
    session.close()