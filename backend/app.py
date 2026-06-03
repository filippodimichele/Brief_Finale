from flask import Flask, jsonify
from flask_cors import CORS
from model import db, Marchio, Modello 

app = Flask(__name__)
CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin@localhost:5432/configuratore_auto'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)


@app.route('/', methods=['GET'])
def home():
    return jsonify({"messaggio": "SQLAlchemy attivo!"})

@app.route('/api/marchi', methods=['GET'])
def get_marchi():
    try:
        lista_marchi = Marchio.query.order_by(Marchio.nome_marchio).all()
        
        risultato = [marchio.to_dict() for marchio in lista_marchi]
        
        return jsonify({"success": True, "dati": risultato}), 200
        
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500

@app.route('/api/modelli/<int:id_marchio_scelto>', methods=['GET'])
def get_modelli_by_marchio(id_marchio_scelto):
    try:
        lista_modelli = Modello.query.filter_by(id_marchio=id_marchio_scelto).all()
        
        risultato = [modello.to_dict() for modello in lista_modelli]
        return jsonify({"success": True, "dati": risultato}), 200
        
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)