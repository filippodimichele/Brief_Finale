import psycopg2
from psycopg2.extras import RealDictCursor


#DATI DB

DB_HOST = "localhost"
DB_NAME = "configuratore_auto"
DB_USER = "postgres"
DB_PASS = "admin"



def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        
        return conn
    except Exception as e:
        print(f" errore di connessione al database: {e}")
        return None

def execute_query(query, params=None):
    """Funzione di utilità per eseguire le SELECT e avere i dati già in formato JSON/Dizionario"""
    conn = get_db_connection()
    if conn is None:
        return {"error": "Connessione al database fallita"}
    
    # realdictCursor serve per trasformare i risultati da tuple (valori singoli) a dizionari chiavi-valore
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute(query, params)
        risultati = cur.fetchall()
        return risultati
    except Exception as e:
        return {"error": str(e)}
    finally:
        cur.close()
        conn.close()

        