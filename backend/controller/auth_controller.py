from flask import Blueprint, request, jsonify, g
from functools import wraps
import jwt
import sys
from persistence.db_confing import SessionLocal
from service.utente_service import AuthService, login as service_login

auth_bp = Blueprint('auth', __name__)

# chiave segreta definita localmente per sicurezza assoluta
SECRET_KEY = "fillantis_super_secret_key_942"

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]

        if not token:
            return jsonify({'success': False, 'errore': 'token mancante, accesso negato!'}), 401

        try:
            # pulizia drastica da eventuali virgolette inserite erroneamente dal frontend
            token = token.strip('"').strip("'")
            
            # decodifica del token jwt
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            
            # memorizziamo i dati nel contesto globale g
            g.current_user_id = int(data['sub'])
            g.current_user_role = str(data['ruolo'])
            
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'errore': 'sessione scaduta, effettua nuovamente il login!'}), 401
        except Exception as e:
            # questo stampa l'errore reale e la riga esatta nel terminale nero di flask
            print("--- ERRORE REALE DECODIFICA TOKEN ---", file=sys.stderr)
            import traceback
            traceback.print_exc()
            print("-------------------------------------", file=sys.stderr)
            
            return jsonify({'success': False, 'errore': f'token corrotto o non valido! dtl: {str(e)}'}), 401

        return f(*args, **kwargs)
    return decorated


@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    dati = request.get_json()
    if not dati or 'email' not in dati or 'password' not in dati:
        return jsonify({'success': False, 'errore': 'compila tutti i campi richiesta!'}), 400

    session = SessionLocal()
    try:
        utente = service_login(session, dati['email'], dati['password'])
        token = AuthService.generate_token(user_id=utente.id_utente, ruolo=str(utente.id_ruolo))
        
        dati_utente = {
            "id_utente": utente.id_utente,
            "nome": utente.nome,
            "cognome": utente.cognome,
            "email": utente.email,
            "id_ruolo": utente.id_ruolo
        }
        
        return jsonify({
            "success": True, 
            "token": token, 
            "utente": dati_utente
        }), 200
    except ValueError as e:
        return jsonify({"success": False, "errore": str(e)}), 401
    except Exception as e:
        return jsonify({"success": False, "errore": str(e)}), 500
    finally:
        session.close()