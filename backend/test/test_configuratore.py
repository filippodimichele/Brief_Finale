import pytest
import json
from app import app
from persistence.db_confing import SessionLocal
from model.utente import Utente
from model.preventivo import Preventivo

@pytest.fixture
def client():
    # fixture per configurare il client di test di flask
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_login_successo(client):
    # test dell'autenticazione con credenziali corrette (utente luca caricato dal seed)
    dati_login = {
        "email": "utente@example.com",
        "password": "password"
    }
    risposta = client.post('/api/login', 
                           data=json.dumps(dati_login), 
                           content_type='application/json')
    
    assert risposta.status_code == 200
    corpo = json.loads(risposta.data)
    assert corpo["success"] is True
    assert corpo["utente"]["email"] == "utente@example.com"

def test_login_fallito(client):
    # test del login con password errata
    dati_errati = {
        "email": "utente@example.com",
        "password": "password_sbagliata"
    }
    risposta = client.post('/api/login', 
                           data=json.dumps(dati_errati), 
                           content_type='application/json')
    
    assert risposta.status_code == 401
    corpo = json.loads(risposta.data)
    assert corpo["success"] is False

def test_get_marchi_catalogo(client):
    # verifica che la rotta del catalogo restituisca i marchi correttamente
    risposta = client.get('/api/marchi')
    
    assert risposta.status_code == 200
    corpo = json.loads(risposta.data)
    assert corpo["success"] is True
    assert isinstance(corpo["dati"], list)
    if len(corpo["dati"]) > 0:
        assert "nome_marchio" in corpo["dati"][0]
        assert "modelli" in corpo["dati"][0]

def test_flusso_preventivo_e_cambio_stato(client):
    # test di integrazione: creazione preventivo, verifica lettura e aggiornamento stato dall'admin
    session = SessionLocal()
    
    # recupera gli id reali dal database per evitare disallineamenti
    utente_test = session.query(Utente).filter(Utente.email == "utente@example.com").first()
    assert utente_test is not None, "eseguire il seed prima di lanciare i test"
    
    # payload per creare una nuova configurazione e preventivo per l'abbinamento 1 con gli optional 1 e 2
    dati_preventivo = {
        "id_utente": utente_test.id_utente,
        "id_abbinamento": 1,
        "optional": [1, 2]
    }
    
    # 1. creazione del preventivo
    risposta_creazione = client.post('/api/preventivi', 
                                     data=json.dumps(dati_preventivo), 
                                     content_type='application/json')
    assert risposta_creazione.status_code == 201
    corpo_creazione = json.loads(risposta_creazione.data)
    assert corpo_creazione["success"] is True
    id_prev = corpo_creazione["id_preventivo"]
    
    # 2. verifica che il preventivo sia visibile nella lista dell'utente
    risposta_lista = client.get(f'/api/preventivi/utente/{utente_test.id_utente}')
    assert risposta_lista.status_code == 200
    corpo_lista = json.loads(risposta_lista.data)
    preventivi = corpo_lista["dati"]
    
    # trova il preventivo appena creato e verifica lo stato iniziale
    prev_creato = next((p for p in preventivi if p["id_preventivo"] == id_prev), None)
    assert prev_creato is not None
    assert prev_creato["stato"] == "in attesa"
    
    # 3. simulazione azione admin: approvazione del preventivo
    dati_stato = {"stato": "approvato"}
    risposta_stato = client.put(f'/api/preventivi/{id_prev}/stato', 
                                data=json.dumps(dati_stato), 
                                content_type='application/json')
    assert risposta_stato.status_code == 200
    
    # 4. controllo finale sul database per verificare la persistenza dello stato aggiornato
    session.expire_all()
    preventivo_db = session.get(Preventivo, id_prev)
    assert preventivo_db.stato == "approvato"
    
    # pulizia del database di test eliminando il record creato
    session.delete(preventivo_db)
    session.commit()
    session.close()