from flask import Blueprint, request, jsonify
from functools import wraps
import jwt
from persistence.db_confing import Session 
from repository.utente_repository import get_by_id, get_by_email
from controller.auth_controller import AuthService, SECRET_KEY

# istanziamo il blueprint per l autenticazione
auth_bp = Blueprint('auth', __name__)

# decorator di sicurezza jwt riutilizzabile su qualsiasi rotta
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'success': False, 'errore': 'token mancante, accesso negato!'}), 401

        session = Session()
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = get_by_id(session, data['sub'])
            if not current_user:
                return jsonify({'success': False, 'errore': 'utente non registrato nel database!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'errore': 'sessione scaduta, effettua nuovamente il login!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'success': False, 'errore': 'token corrotto o non valido!'}), 401
        finally:
            session.close() # chiude sempre la sessione per liberare postgres

        return f(current_user, *args, **kwargs)
    return decorated


# rotta di login agganciata al blueprint
@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    dati = request.get_json()
    email = dati.get('email')
    password = dati.get('password')

    if not email or not password:
        return jsonify({'success': False, 'errore': 'compila tutti i campi richiesta!'}), 400

    session = Session()
    try:
        user = get_by_email(session, email)
        if user and AuthService.check_password(password, user.password):
            token = AuthService.generate_token(user_id=user.id, ruolo=user.ruolo)
            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'ruolo': user.ruolo
                }
            }), 200
    finally:
        session.close() # rilascia la connessione al termine del processo
        
    return jsonify({'success': False, 'errore': 'email o password non corrette!'}), 401