from flask import Flask, jsonify, request
from flask_cors import CORS
from model import db, Marchio, Modello, Allestimento, Motorizzazione, Optional, AbbinamentoCatalogo

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin@localhost:5432/configuratore_auto'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# --- ROTTE BASE ---
@app.route('/', methods=['GET'])
def home():
    return jsonify({"messaggio": "Backend Configuratore Auto attivo!"})

# --- ROTTE MARCHI E MODELLI (Già esistenti) ---
@app.route('/api/marchi', methods=['GET'])
def get_marchi():
    try:
        lista = Marchio.query.order_by(Marchio.nome_marchio).all()
        return jsonify({"success": True, "dati": [m.to_dict() for m in lista]}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500

@app.route('/api/modelli/<int:id_marchio>', methods=['GET'])
def get_modelli(id_marchio):
    lista = Modello.query.filter_by(id_marchio=id_marchio).all()
    return jsonify({"success": True, "dati": [m.to_dict() for m in lista]}), 200

# --- ROTTE CATALOGO (Il cuore del configuratore) ---
@app.route('/api/catalogo/<int:id_modello>', methods=['GET'])
def get_configurazioni_modello(id_modello):
    """Restituisce tutte le combinazioni possibili per un modello specifico"""
    try:
        abbinamenti = AbbinamentoCatalogo.query.filter_by(id_modello=id_modello).all()
        risultato = []
        for abb in abbinamenti:
            risultato.append({
                "id_abbinamento": abb.id_abbinamento,
                "allestimento": Allestimento.query.get(abb.id_allestimento).nome_allestimento,
                "motore": Motorizzazione.query.get(abb.id_motorizzazione).nome_motore,
                "prezzo_base": abb.prezzo_base
            })
        return jsonify({"success": True, "dati": risultato}), 200
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500

# --- ROTTE OPTIONAL ---
@app.route('/api/optional', methods=['GET'])
def get_optional():
    lista = Optional.query.all()
    return jsonify({"success": True, "dati": [o.to_dict() for o in lista]}), 200

# --- INIZIALIZZAZIONE ---
with app.app_context():
    db.create_all()
    print("Database inizializzato con successo!")

if __name__ == '__main__':
    app.run(debug=True, port=5000)