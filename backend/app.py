from flask import Flask, jsonify
from flask_cors import CORS
from db import execute_query

app = Flask(__name__)
CORS(app) # Permette al frontend (Vite) di comunicare con questo backend senza blocchi di sicurezza

# --- ROTTE API ---

# Rotta di test (Home)
@app.route('/', methods=['GET'])
def home():
    return jsonify({"messaggio": "Backend del Configuratore Auto attivo e funzionante!"})


@app.route('/api/marchi', methods=['GET'])
def get_marchi():
    query = "SELECT * FROM marchi ORDER BY nome_marchio ASC;"
    risultato = execute_query(query)
    
    # Se c'è un errore nella query (es. tabella non trovata o password errata)
    if isinstance(risultato, dict) and "error" in risultato:
        return jsonify({"success": False, "errore": risultato["error"]}), 500
        
    return jsonify({
        "success": True, 
        "dati": raggruppamento_marchi(risultato) if 'raggruppamento_marchi' in globals() else risultato
    }), 200

if __name__ == '__main__':
    # Il server si accende sulla porta 5000 in modalità di debug (si riavvia da solo se modifichi il codice)
    app.run(debug=True, port=5000)