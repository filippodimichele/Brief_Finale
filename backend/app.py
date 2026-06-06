from flask import Flask, jsonify
from flask_cors import CORS
from model import Marchio, Modello, AbbinamentoCatalogo, Allestimento, Motorizzazione, Optional
from persistence.db_confing import SessionLocal

app = Flask(__name__)
CORS(app)

# --- rotte api ---

@app.route('/api/marchi', methods=['GET'])
def get_marchi():
    # apre una nuova sessione per interrogare il db
    session = SessionLocal()
    try:
        lista = session.query(Marchio).order_by(Marchio.nome_marchio).all()
        return jsonify({"success": True, "dati": [m.to_dict() for m in lista]}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        # chiude la sessione per liberare la connessione
        session.close()

@app.route('/api/modelli/<int:id_marchio>', methods=['GET'])
def get_modelli(id_marchio):
    session = SessionLocal()
    try:
        lista = session.query(Modello).filter_by(id_marchio=id_marchio).all()
        return jsonify({"success": True, "dati": [m.to_dict() for m in lista]}), 200
    finally:
        session.close()

@app.route('/api/catalogo/<int:id_modello>', methods=['GET'])
def get_configurazioni_modello(id_modello):
    session = SessionLocal()
    try:
        # recupera gli abbinamenti filtrando per il modello scelto
        abbinamenti = session.query(AbbinamentoCatalogo).filter_by(id_modello=id_modello).all()
        risultato = []
        for abb in abbinamenti:
            # carica le relazioni per i dettagli di allestimento e motore
            allestimento = session.query(Allestimento).get(abb.id_allestimento)
            motore = session.query(Motorizzazione).get(abb.id_motorizzazione)
            risultato.append({
                "id_abbinamento": abb.id_abbinamento,
                "allestimento": allestimento.nome_allestimento,
                "motore": motore.nome_motore,
                "prezzo_base": abb.prezzo_base
            })
        return jsonify({"success": True, "dati": risultato}), 200
    finally:
        session.close()

@app.route('/api/optional', methods=['GET'])
def get_optional():
    session = SessionLocal()
    try:
        lista = session.query(Optional).all()
        return jsonify({"success": True, "dati": [o.to_dict() for o in lista]}), 200
    finally:
        session.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)