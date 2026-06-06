from persistence.db_confing import init_db, get_session
from repository import marchio_repository
from model.marchio import Marchio

def main():
    # crea le tabelle nel database leggendo le classi che ereditano da base
    init_db()

    # ottiene la sessione usando la tua funzione
    session = get_session()

    try:
        # test di inserimento di un nuovo marchio
        print("Inserimento di un nuovo marchio nel database...")
        nuovo_marchio = Marchio(nome_marchio="fiat", paese_origine="italia")
        
        # usa il repository per salvare il dato
        marchio_repository.add(session, nuovo_marchio)
        print("Marchio salvato con successo.")

        # test di lettura dei dati
        print("Recupero della lista dei marchi...")
        tutti_i_marchi = marchio_repository.get_all(session)
        
        for m in tutti_i_marchi:
            # stampa i dati a terminale usando il metodo to_dict
            print(m.to_dict())

    except Exception as e:
        # gestisce eventuali errori e annulla le modifiche in caso di problemi
        print(f"Si e verificato un errore: {e}")
        session.rollback()

    finally:
        # chiude sempre la sessione alla fine delle operazioni
        session.close()
        print("Connessione al database chiusa.")

if __name__ == "__main__":
    main()