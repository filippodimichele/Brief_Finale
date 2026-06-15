import jwt
import datetime
import bcrypt
from repository import utente_repository

# chiave segreta per la firma e la codifica sicura dei token jwt
SECRET_KEY = "fillantis_super_secret_key_942"

class AuthService:
    
    @staticmethod
    def hash_password(password: str) -> str:
        # genera il salt e cifra la password in modo sicuro con bcrypt
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    @staticmethod
    def check_password(password: str, hashed_password: str) -> bool:
        try:
            if password == hashed_password:
                return True
            clean_hash = hashed_password
            if clean_hash.startswith("b'") and clean_hash.endswith("'"):
                clean_hash = clean_hash[2:-1]
            elif clean_hash.startswith('b"') and clean_hash.endswith('"'):
                clean_hash = clean_hash[2:-1]
            return bcrypt.checkpw(password.encode('utf-8'), clean_hash.encode('utf-8'))
        except Exception:
            return password == hashed_password

    @staticmethod
    def generate_token(user_id: int, ruolo: str) -> str:
        # uso di datetime consapevole del fuso orario per evitare token gia scaduti
        ora_attuale = datetime.datetime.now(datetime.timezone.utc)
        
        # forziamo i tipi corretti dentro il payload per evitare conflitti di decodifica
        # inseriamo sub come stringa per soddisfare i requisiti della libreria
        payload = {
            'exp': ora_attuale + datetime.timedelta(hours=2),
            'iat': ora_attuale,
            'sub': str(user_id),
            'ruolo': str(ruolo)
        }
        
        # generazione del token con algoritmo esplicito
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        
        # conversione in stringa standard se la libreria restituisce un tipo bytes
        if isinstance(token, bytes):
            return token.decode('utf-8')
        return token


# --- funzioni originarie per la gestione del database ---

def login(session, email, password):
    utente = utente_repository.get_by_email(session, email)
    if not utente or not AuthService.check_password(password, utente.password):
        raise ValueError("Credenziali errate")
    return utente

def get_tutti_utenti(session):
    return utente_repository.get_all(session)