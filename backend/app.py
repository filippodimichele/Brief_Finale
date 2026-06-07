from flask import Flask, jsonify, request
from flask_cors import CORS
from model import Marchio, Modello, AbbinamentoCatalogo, Allestimento, Motorizzazione, Optional, Utente, Preventivo, Configurazione
from persistence.db_confing import SessionLocal

# configurazione iniziale dell'applicazione e abilitazione cors
app = Flask(__name__)
CORS(app)

# gestione dell'accesso utente tramite verifica delle credenziali
@app.route('/api/login', methods=['POST'])
def login():
    dati = request.json
    session = SessionLocal()
    try:
        utente = session.query(Utente).filter_by(email=dati['email'], password=dati['password']).first()
        if utente:
            return jsonify({"success": True, "utente": utente.to_dict()}), 200
        return jsonify({"success": False, "errore": "Credenziali errate"}), 401
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# lettura di tutti i marchi salvati nel database
@app.route('/api/marchi', methods=['GET'])
def get_marchi():
    session = SessionLocal()
    try:
        lista = session.query(Marchio).order_by(Marchio.nome_marchio).all()
        return jsonify({"success": True, "dati": [m.to_dict() for m in lista]}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# inserimento di un nuovo marchio
@app.route('/api/marchi', methods=['POST'])
def crea_marchio():
    dati = request.json
    session = SessionLocal()
    try:
        nuovo = Marchio(nome_marchio=dati['nome_marchio'], paese_origine=dati['paese_origine'])
        session.add(nuovo)
        session.commit()
        return jsonify({"success": True, "id_marchio": nuovo.id_marchio}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# modifica dei dati di un marchio esistente
@app.route('/api/marchi/<int:id_marchio>', methods=['PUT'])
def aggiorna_marchio(id_marchio):
    dati = request.json
    session = SessionLocal()
    try:
        marchio = session.query(Marchio).get(id_marchio)
        if not marchio:
            return jsonify({"success": False, "errore": "Marchio non trovato"}), 404
        marchio.nome_marchio = dati.get('nome_marchio', marchio.nome_marchio)
        marchio.paese_origine = dati.get('paese_origine', marchio.paese_origine)
        session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# rimozione di un marchio dal sistema
@app.route('/api/marchi/<int:id_marchio>', methods=['DELETE'])
def elimina_marchio(id_marchio):
    session = SessionLocal()
    try:
        marchio = session.query(Marchio).get(id_marchio)
        if not marchio:
            return jsonify({"success": False, "errore": "Marchio non trovato"}), 404
        session.delete(marchio)
        session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# recupero dei modelli filtrati per un marchio specifico
@app.route('/api/modelli/<int:id_marchio>', methods=['GET'])
def get_modelli(id_marchio):
    session = SessionLocal()
    try:
        lista = session.query(Modello).filter_by(id_marchio=id_marchio).all()
        return jsonify({"success": True, "dati": [m.to_dict() for m in lista]}), 200
    finally:
        session.close()

# aggiunta di un nuovo modello associato a un marchio
@app.route('/api/modelli', methods=['POST'])
def crea_modello():
    dati = request.json
    session = SessionLocal()
    try:
        nuovo = Modello(id_marchio=dati['id_marchio'], nome_modello=dati['nome_modello'])
        session.add(nuovo)
        session.commit()
        return jsonify({"success": True, "id_modello": nuovo.id_modello}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# aggiornamento dei dati di un modello
@app.route('/api/modelli/<int:id_modello>', methods=['PUT'])
def aggiorna_modello(id_modello):
    dati = request.json
    session = SessionLocal()
    try:
        modello = session.query(Modello).get(id_modello)
        if not modello:
            return jsonify({"success": False, "errore": "Modello non trovato"}), 404
        modello.nome_modello = dati.get('nome_modello', modello.nome_modello)
        modello.id_marchio = dati.get('id_marchio', modello.id_marchio)
        session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# cancellazione di un modello
@app.route('/api/modelli/<int:id_modello>', methods=['DELETE'])
def elimina_modello(id_modello):
    session = SessionLocal()
    try:
        modello = session.query(Modello).get(id_modello)
        if not modello:
            return jsonify({"success": False, "errore": "Modello non trovato"}), 404
        session.delete(modello)
        session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# lettura degli abbinamenti tra allestimento e motore per un modello
@app.route('/api/catalogo/<int:id_modello>', methods=['GET'])
def get_configurazioni_modello(id_modello):
    session = SessionLocal()
    try:
        abbinamenti = session.query(AbbinamentoCatalogo).filter_by(id_modello=id_modello).all()
        risultato = []
        for abb in abbinamenti:
            allestimento = session.query(Allestimento).get(abb.id_allestimento)
            motore = session.query(Motorizzazione).get(abb.id_motorizzazione)
            risultato.append({
                "id_abbinamento": abb.id_abbinamento,
                "allestimento": allestimento.nome_allestimento,
                "motore": motore.nome_motore,
                "prezzo_base": float(abb.prezzo_base)
            })
        return jsonify({"success": True, "dati": risultato}), 200
    finally:
        session.close()

# lettura di tutti gli optional a catalogo
@app.route('/api/optional', methods=['GET'])
def get_optional():
    session = SessionLocal()
    try:
        lista = session.query(Optional).all()
        return jsonify({"success": True, "dati": [o.to_dict() for o in lista]}), 200
    finally:
        session.close()

# creazione di un nuovo accessorio optional
@app.route('/api/optional', methods=['POST'])
def crea_optional():
    dati = request.json
    session = SessionLocal()
    try:
        nuovo = Optional(nome_optional=dati['nome_optional'], prezzo=dati['prezzo'])
        session.add(nuovo)
        session.commit()
        return jsonify({"success": True, "id_optional": nuovo.id_optional}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# modifica di prezzo o nome di un optional
@app.route('/api/optional/<int:id_optional>', methods=['PUT'])
def aggiorna_optional(id_optional):
    dati = request.json
    session = SessionLocal()
    try:
        opt = session.query(Optional).get(id_optional)
        if not opt:
            return jsonify({"success": False, "errore": "Optional non trovato"}), 404
        opt.nome_optional = dati.get('nome_optional', opt.nome_optional)
        opt.prezzo = dati.get('prezzo', opt.prezzo)
        session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# eliminazione di un optional
@app.route('/api/optional/<int:id_optional>', methods=['DELETE'])
def elimina_optional(id_optional):
    session = SessionLocal()
    try:
        opt = session.query(Optional).get(id_optional)
        if not opt:
            return jsonify({"success": False, "errore": "Optional non trovato"}), 404
        session.delete(opt)
        session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# recupero della lista degli utenti registrati
@app.route('/api/utenti', methods=['GET'])
def get_utenti():
    session = SessionLocal()
    try:
        lista = session.query(Utente).all()
        return jsonify({"success": True, "dati": [u.to_dict() for u in lista]}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# lettura dello storico preventivi di un singolo utente
@app.route('/api/preventivi/<int:id_utente>', methods=['GET'])
def get_preventivi_utente(id_utente):
    session = SessionLocal()
    try:
        lista = session.query(Preventivo).filter_by(id_utente=id_utente).all()
        return jsonify({"success": True, "dati": [p.to_dict() for p in lista]}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# salvataggio di una configurazione auto completa di optional
@app.route('/api/configurazioni', methods=['POST'])
def crea_configurazione():
    dati = request.json
    session = SessionLocal()
    try:
        nuova_config = Configurazione(
            id_utente=dati['id_utente'],
            id_abbinamento=dati['id_abbinamento']
        )
        # associazione degli eventuali optional scelti dal cliente
        if 'optional' in dati and isinstance(dati['optional'], list):
            for opt_id in dati['optional']:
                opt = session.query(Optional).get(opt_id)
                if opt:
                    nuova_config.optional_scelti.append(opt)
        session.add(nuova_config)
        session.commit()
        return jsonify({"success": True, "id_configurazione": nuova_config.id_configurazione}), 201
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# generazione e calcolo matematico di un nuovo preventivo
@app.route('/api/preventivi', methods=['POST'])
def crea_preventivo():
    dati = request.json
    session = SessionLocal()
    try:
        abbinamento = session.query(AbbinamentoCatalogo).get(dati['id_abbinamento'])
        if not abbinamento:
            return jsonify({"success": False, "errore": "Abbinamento non trovato"}), 404
        
        prezzo_totale = float(abbinamento.prezzo_base)
        nuovo_preventivo = Preventivo(
            id_utente=dati['id_utente'],
            id_abbinamento=dati['id_abbinamento'],
            prezzo_totale=prezzo_totale
        )
        
        # somma dinamica dei prezzi degli optional selezionati
        if 'optional' in dati and isinstance(dati['optional'], list):
            for opt_id in dati['optional']:
                opt = session.query(Optional).get(opt_id)
                if opt:
                    nuovo_preventivo.optional_scelti.append(opt)
                    nuovo_preventivo.prezzo_totale += float(opt.prezzo)
                    
        session.add(nuovo_preventivo)
        session.commit()
        return jsonify({
            "success": True, 
            "id_preventivo": nuovo_preventivo.id_preventivo, 
            "prezzo_totale": float(nuovo_preventivo.prezzo_totale)
        }), 201
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# ricalcolo del preventivo in caso di modifica degli accessori
@app.route('/api/preventivi/<int:id_preventivo>', methods=['PUT'])
def modifica_preventivo(id_preventivo):
    dati = request.json
    session = SessionLocal()
    try:
        preventivo = session.query(Preventivo).get(id_preventivo)
        if not preventivo:
            return jsonify({"success": False, "errore": "Preventivo non trovato"}), 404
            
        abbinamento = session.query(AbbinamentoCatalogo).get(preventivo.id_abbinamento)
        prezzo_totale = float(abbinamento.prezzo_base)
        
        # svuota le selezioni precedenti e inserisce quelle nuove
        preventivo.optional_scelti.clear()
        if 'optional' in dati and isinstance(dati['optional'], list):
            for opt_id in dati['optional']:
                opt = session.query(Optional).get(opt_id)
                if opt:
                    preventivo.optional_scelti.append(opt)
                    prezzo_totale += float(opt.prezzo)
                    
        preventivo.prezzo_totale = prezzo_totale
        session.commit()
        return jsonify({"success": True, "prezzo_totale": prezzo_totale}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# annullamento e cancellazione di un preventivo dal database
@app.route('/api/preventivi/<int:id_preventivo>', methods=['DELETE'])
def elimina_preventivo(id_preventivo):
    session = SessionLocal()
    try:
        preventivo = session.query(Preventivo).get(id_preventivo)
        if not preventivo:
            return jsonify({"success": False, "errore": "Preventivo non trovato"}), 404
        session.delete(preventivo)
        session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()

# generazione dei dati per l'esportazione del preventivo in pdf o testo
@app.route('/api/preventivi/<int:id_preventivo>/esporta', methods=['GET'])
def esporta_preventivo(id_preventivo):
    session = SessionLocal()
    try:
        preventivo = session.query(Preventivo).get(id_preventivo)
        if not preventivo:
            return jsonify({"success": False, "errore": "Preventivo non trovato"}), 404
        testo_esportazione = f"dettaglio preventivo #{preventivo.id_preventivo}\ntotale: {float(preventivo.prezzo_totale)} eur"
        return jsonify({"success": True, "documento_testo": testo_esportazione}), 200
    finally:
        session.close()

# avvio del server in locale
if __name__ == '__main__':
    app.run(debug=True, port=5000)