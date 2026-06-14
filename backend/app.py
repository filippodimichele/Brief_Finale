# root api

from flask import Flask, jsonify, request
from flask_cors import CORS
from persistence.db_confing import SessionLocal
from service import (
    catalogo_service,
    optional_service,
    configurazione_service,
    preventivo_service,
    utente_service
)

app = Flask(__name__)
CORS(app)


# autenticazione utente

@app.route('/api/login', methods=['POST'])
def login():
    dati = request.json
    session = SessionLocal()
    try:
        utente = utente_service.login(session, dati['email'], dati['password'])
        
        # mappatura manuale dei dati utente
        dati_utente = {
            "id_utente": utente.id_utente,
            "nome": utente.nome,
            "cognome": utente.cognome,
            "email": utente.email,
            "id_ruolo": utente.id_ruolo
        }
        
        return jsonify({"success": True, "utente": dati_utente}), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 401
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()


# rotte preventivi

@app.route('/api/preventivi', methods=['POST'])
def crea_preventivo():
    dati = request.json
    session = SessionLocal()
    try:
        # la logica di creazione passa per la configurazione
        nuova_config = configurazione_service.crea_configurazione(
            session, 
            id_utente=dati['id_utente'], 
            id_abbinamento=dati['id_abbinamento'], 
            lista_optional_ids=dati.get('optional', [])
        )
        session.flush()
        
        nuovo_prev = preventivo_service.genera_preventivo(session, nuova_config.id_configurazione)
        session.commit()
        return jsonify({"success": True, "id_preventivo": nuovo_prev.id_preventivo}), 201
    except Exception as e:
        session.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# NUOVA: rotta esclusiva dell'admin per leggere l'intero storico globale di tutti i clienti
@app.route('/api/preventivi/admin', methods=['GET'])
def get_preventivi_admin_route():
    session = SessionLocal()
    try:
        # recupera l'intera lista globale dal service dedicato dell'admin
        lista = preventivo_service.get_tutti_preventivi(session)
        
        risultato = []
        for p in lista:
            auto_dettaglio = f"Abbinamento #{p.id_abbinamento}"
            if p.abbinamento and p.abbinamento.modello:
                mod = p.abbinamento.modello
                marchio = mod.marchio.nome_marchio if mod.marchio else ""
                auto_dettaglio = f"{marchio} {mod.nome_modello}".strip()

            risultato.append({
                "id": p.id_preventivo, 
                "id_preventivo": p.id_preventivo,
                "id_utente": p.id_utente,
                "nome_cliente": p.utente.nome if p.utente else "Utente", # mostra il nome all'admin
                "id_abbinamento": p.id_abbinamento,
                "auto_dettaglio": auto_dettaglio, 
                "prezzo_totale": float(p.prezzo_totale) if p.prezzo_totale else 0.0,
                "stato": p.stato,
                "data_creazione": p.data_creazione.strftime("%Y-%m-%d %H:%M:%S") if p.data_creazione else None,
                "optional_scelti": [
                    {
                        "id_optional": opt.id_optional,
                        "nome_optional": opt.nome_optional,
                        "prezzo": float(opt.prezzo) if opt.prezzo else 0.0
                    } for opt in p.optional_scelti
                ] if p.optional_scelti else []
            })
            
        return jsonify({"success": True, "dati": risultato}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# rotta per l'utente normale: isola e mostra solo ed esclusivamente i suoi preventivi personali
@app.route('/api/preventivi/utente/<int:id_utente>', methods=['GET'])
def get_preventivi_utente_route(id_utente):
    session = SessionLocal()
    try:
        lista = preventivo_service.get_preventivi_utente(session, id_utente)
        
        risultato = []
        for p in lista:
            auto_dettaglio = f"Abbinamento #{p.id_abbinamento}"
            if p.abbinamento and p.abbinamento.modello:
                mod = p.abbinamento.modello
                marchio = mod.marchio.nome_marchio if mod.marchio else ""
                auto_dettaglio = f"{marchio} {mod.nome_modello}".strip()

            risultato.append({
                "id": p.id_preventivo, 
                "id_preventivo": p.id_preventivo,
                "id_utente": p.id_utente,
                "id_abbinamento": p.id_abbinamento,
                "auto_dettaglio": auto_dettaglio, 
                "prezzo_totale": float(p.prezzo_totale) if p.prezzo_totale else 0.0,
                "stato": p.stato,
                "data_creazione": p.data_creazione.strftime("%Y-%m-%d %H:%M:%S") if p.data_creazione else None,
                "optional_scelti": [
                    {
                        "id_optional": opt.id_optional,
                        "nome_optional": opt.nome_optional,
                        "prezzo": float(opt.prezzo) if opt.prezzo else 0.0
                    } for opt in p.optional_scelti
                ] if p.optional_scelti else []
            })
            
        return jsonify({"success": True, "dati": risultato}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/preventivi/<int:id_preventivo>/stato', methods=['PUT'])
def aggiorna_stato_preventivo_route(id_preventivo):
    # rotta riservata all'admin per aggiornare lo stato (accettare o rifiutare)
    dati = request.json
    session = SessionLocal()
    try:
        if not dati or 'stato' not in dati:
            return jsonify({"success": False, "errore": "campo stato mancante."}), 400
            
        preventivo_service.aggiorna_stato_preventivo(session, id_preventivo, dati['stato'])
        session.commit()
        return jsonify({"success": True}), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/preventivi/<int:id_preventivo>', methods=['DELETE'])
def elimina_preventivo(id_preventivo):
    # rotta riservata all'admin per eliminare fisicamente un preventivo obsoleto
    session = SessionLocal()
    try:
        preventivo_service.elimina_preventivo(session, id_preventivo)
        session.commit()
        return jsonify({"success": True}), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()


# rotte catalogo marchi

@app.route('/api/marchi', methods=['GET'])
def get_catalogo_marchi():
    # rotta per fornire al frontend la lista dei marchi e i relativi modelli
    session = SessionLocal()
    try:
        marchi = catalogo_service.get_tutti_marchi(session)
        risultato = []
        for m in marchi:
            # estrae i modelli associati grazie alla relazione di sqlalchemy
            modelli_lista = [
                {"id_modello": mod.id_modello, "nome_modello": mod.nome_modello} 
                for mod in m.modelli
            ]
            risultato.append({
                "id_marchio": m.id_marchio,
                "nome_marchio": m.nome_marchio,
                "paese_origine": m.paese_origine,
                "modelli": modelli_lista
            })
        return jsonify({"success": True, "dati": risultato}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()


# avvio dell'applicazione flask

if __name__ == '__main__':
    app.run(debug=True)