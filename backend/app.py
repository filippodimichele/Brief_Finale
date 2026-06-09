
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
        return jsonify({"success": True, "utente": utente.to_dict()}), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 401
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()


# marchi

@app.route('/api/marchi', methods=['GET'])
def get_marchi():
    session = SessionLocal()
    try:
        lista = catalogo_service.get_tutti_marchi(session)
        return jsonify({"success": True, "dati": [m.to_dict() for m in lista]}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/marchi', methods=['POST'])
def crea_marchio():
    dati = request.json
    session = SessionLocal()
    try:
        nuovo = catalogo_service.crea_marchio(session, dati['nome_marchio'], dati['paese_origine'])
        session.commit()
        return jsonify({"success": True, "id_marchio": nuovo.id_marchio}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/marchi/<int:id_marchio>', methods=['PUT'])
def aggiorna_marchio(id_marchio):
    dati = request.json
    session = SessionLocal()
    try:
        catalogo_service.aggiorna_marchio(session, id_marchio, dati)
        session.commit()
        return jsonify({"success": True}), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/marchi/<int:id_marchio>', methods=['DELETE'])
def elimina_marchio(id_marchio):
    session = SessionLocal()
    try:
        catalogo_service.elimina_marchio(session, id_marchio)
        session.commit()
        return jsonify({"success": True}), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()


# modelli
@app.route('/api/modelli/<int:id_marchio>', methods=['GET'])
def get_modelli(id_marchio):
    session = SessionLocal()
    try:
        lista = catalogo_service.get_modelli_per_marchio(session, id_marchio)
        return jsonify({"success": True, "dati": [m.to_dict() for m in lista]}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/modelli', methods=['POST'])
def crea_modello():
    dati = request.json
    session = SessionLocal()
    try:
        nuovo = catalogo_service.crea_modello(session, dati['id_marchio'], dati['nome_modello'])
        session.commit()
        return jsonify({"success": True, "id_modello": nuovo.id_modello}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/modelli/<int:id_modello>', methods=['PUT'])
def aggiorna_modello(id_modello):
    dati = request.json
    session = SessionLocal()
    try:
        catalogo_service.aggiorna_modello(session, id_modello, dati)
        session.commit()
        return jsonify({"success": True}), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/modelli/<int:id_modello>', methods=['DELETE'])
def elimina_modello(id_modello):
    session = SessionLocal()
    try:
        catalogo_service.elimina_modello(session, id_modello)
        session.commit()
        return jsonify({"success": True}), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()


# catalogo

@app.route('/api/catalogo/<int:id_modello>', methods=['GET'])
def get_configurazioni_modello(id_modello):
    session = SessionLocal()
    try:
        abbinamenti = catalogo_service.get_catalogo_per_modello(session, id_modello)
        risultato = [
            {
                "id_abbinamento": a.id_abbinamento,
                "allestimento": a.allestimento.nome_allestimento,
                "motore": a.motorizzazione.nome_motore,
                "prezzo_base": float(a.prezzo_base)
            }
            for a in abbinamenti
        ]
        return jsonify({"success": True, "dati": risultato}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()


# optional

@app.route('/api/optional', methods=['GET'])
def get_optional():
    session = SessionLocal()
    try:
        lista = optional_service.get_tutti_optional(session)
        return jsonify({"success": True, "dati": [o.to_dict() for o in lista]}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/optional', methods=['POST'])
def crea_optional():
    dati = request.json
    session = SessionLocal()
    try:
        nuovo = optional_service.crea_optional(session, dati['nome_optional'], dati['prezzo'])
        session.commit()
        return jsonify({"success": True, "id_optional": nuovo.id_optional}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/optional/<int:id_optional>', methods=['PUT'])
def aggiorna_optional(id_optional):
    dati = request.json
    session = SessionLocal()
    try:
        optional_service.aggiorna_optional(session, id_optional, dati)
        session.commit()
        return jsonify({"success": True}), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/optional/<int:id_optional>', methods=['DELETE'])
def elimina_optional(id_optional):
    session = SessionLocal()
    try:
        optional_service.elimina_optional(session, id_optional)
        session.commit()
        return jsonify({"success": True}), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()


# utenti

@app.route('/api/utenti', methods=['GET'])
def get_utenti():
    session = SessionLocal()
    try:
        lista = utente_service.get_tutti_utenti(session)
        return jsonify({"success": True, "dati": [u.to_dict() for u in lista]}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()


#configurazioni

@app.route('/api/configurazioni', methods=['POST'])
def crea_configurazione():
    dati = request.json
    session = SessionLocal()
    try:
        nuova = configurazione_service.crea_configurazione(
            session,
            dati['id_utente'],
            dati['id_abbinamento'],
            dati.get('optional', [])
        )
        session.commit()
        return jsonify({"success": True, "id_configurazione": nuova.id_configurazione}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()


# preventivi

@app.route('/api/preventivi/<int:id_utente>', methods=['GET'])
def get_preventivi_utente(id_utente):
    session = SessionLocal()
    try:
        lista = preventivo_service.get_preventivi_utente(session, id_utente)
        return jsonify({"success": True, "dati": [p.to_dict() for p in lista]}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/preventivi', methods=['POST'])
def crea_preventivo():
    dati = request.json
    session = SessionLocal()
    try:
        nuovo = preventivo_service.genera_preventivo(
            session,
            dati['id_utente'],
            dati['id_abbinamento'],
            dati.get('optional', [])
        )
        session.commit()
        return jsonify({
            "success": True,
            "id_preventivo": nuovo.id_preventivo,
            "prezzo_totale": float(nuovo.prezzo_totale)
        }), 201
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/preventivi/<int:id_preventivo>', methods=['PUT'])
def modifica_preventivo(id_preventivo):
    dati = request.json
    session = SessionLocal()
    try:
        aggiornato = preventivo_service.modifica_preventivo(
            session,
            id_preventivo,
            dati.get('optional', [])
        )
        session.commit()
        return jsonify({"success": True, "prezzo_totale": float(aggiornato.prezzo_totale)}), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

@app.route('/api/preventivi/<int:id_preventivo>', methods=['DELETE'])
def elimina_preventivo(id_preventivo):
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

@app.route('/api/preventivi/<int:id_preventivo>/esporta', methods=['GET'])
def esporta_preventivo(id_preventivo):
    session = SessionLocal()
    try:
        testo = preventivo_service.esporta_preventivo(session, id_preventivo)
        return jsonify({"success": True, "documento_testo": testo}), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 404
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()


if __name__ == '__main__':
    app.run(debug=True, port=5000)