
<p align="center">
  <img src="/image/logo.png" alt="Fillantis Logo" width="300">
</p>

# Fillantis - Showroom & Configuratore Automobilistico

Applicazione full-stack per la gestione di uno showroom automobilistico multibrand e la configurazione guidata di veicoli con controllo in tempo reale delle incompatibilità degli optional e salvataggio dei preventivi personalizzati.

Il progetto unisce un'architettura backend robusta in **Python Flask (MVC)** con autenticazione JWT e database relazionale PostgreSQL, e un frontend **Single Page Application (SPA)** nativo ad alte prestazioni realizzato con la libreria **just-dom**.

---

## Struttura del progetto

```text
fillantis-project/
├── backend/                        # backend flask (mvc)
│   ├── app.py                      # entry point flask, inizializzazione cors e blueprint
│   ├── requirements.txt            # dipendenze python
│   ├── persistence/
│   │   └── db_config.py            # configurazione sqlalchemy (engine, sessioni)
│   ├── model/
│   │   ├── user.py                 # modello utente (tabella app_user)
│   │   ├── marchio.py              # modello brand automobilistici
│   │   ├── modello.py              # modello varianti di auto
│   │   └── preventivo.py           # modello preventivi salvati e relazioni optional
│   ├── repository/
│   │   ├── user_repository.py      # query e prima persistenza dati utenti
│   │   └── preventivi_repository.py # salvataggio e recupero preventivi relazionali
│   ├── service/
│   │   ├── auth_service.py         # logica di business per hash password e generazione jwt
│   │   └── catalogo_service.py     # logica di estrazione marchi, allestimenti e prezzi
│   ├── controller/
│   │   ├── auth_controller.py      # rotte di autenticazione e decorator token
│   │   └── preventivi_controller.py # gestione dei payload di configurazione inviati
│   └── docs/
│       ├── DDL/10_CREATE.sql       # script ddl di creazione schema database
│       └── DML/10_INSERT.sql       # script dml inserimento marchi, modelli e optional di serie
│
├── frontend/                       # frontend spa (just-dom)
│   ├── package.json                # dipendenze node.js e script vite
│   ├── vite.config.js              # configurazione bundler vite
│   ├── src/
│   │   ├── main.js                 # entry point, configurazione e montaggio del router spa
│   │   ├── jd.config.js            # istanziazione core e plugin di just-dom
│   │   ├── components/
│   │   │   ├── loader.js           # componente di caricamento asincrono globale
│   │   │   └── Steps.js            # indicatore grafico degli step del configuratore
│   │   ├── layouts/
│   │   │   └── configurator-layouts.js # pagina interattiva in 5 fasi del configuratore
│   │   └── pages/
│   │       ├── login-page.js       # gestione del form di autenticazione utente
│   │       ├── dashboard-page.js   # homepage e pannello di benvenuto
│   │       ├── modelli-page.js     # showroom del catalogo suddiviso per brand
│   │       └── preventivi-page.js  # storico e riepilogo dei preventivi salvati
│   └── public/
│       └── image/
│           └── logo.png            # logo aziendale dell applicazione

```

---

## Prerequisiti

* **Python 3.10+**
* **Node.js 18+** (per l'ambiente frontend con Vite)
* **PostgreSQL** attivo localmente (utente: `postgres`, password: `postgres`)

---

## Setup e Installazione

### 1. Configurazione del Database PostgreSQL

Accedere al pannello di amministrazione PostgreSQL (psql / pgAdmin) e creare il database dedicato:

```sql
CREATE DATABASE configuratore_auto;

```

Eseguire in ordine sequenziale gli script contenuti nella cartella `backend/docs/` per generare lo schema relazionale ed inserire i dati del catalogo ufficiale:

1. `backend/docs/DDL/model.py ` — genera le tabelle utenti, marchi, modelli, abbinamenti motori e opzioni.
2. `backend/docs/DML/seed_db.py` — popola il database con i listini ufficiali di gamma dei brand.

### 2. Installazione ed Avvio del Backend

Spostarsi nella directory dedicata al server Flask, creare l'ambiente virtuale ed installare i pacchetti richiesti:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # su windows usare: venv\Scripts\activate
pip install -r requirements.txt

```

Avviare il server di sviluppo:

```bash
python app.py

```

Il backend sarà in esecuzione all'indirizzo: **`http://localhost:5000`**.

### 3. Installazione ed Avvio del Frontend

Aprire un nuovo terminale, spostarsi nella cartella del frontend, installare i moduli node ed avviare l'ambiente di build con Vite:

```bash
cd frontend
npm install
npm run dev

```

L'interfaccia utente sarà accessibile direttamente dal browser su: **`http://localhost:5173`**.

---

## Credenziali di Default

Per testare le funzionalità e i diversi livelli di accesso protetti, sono preconfigurati i seguenti profili all'interno dello script DML:

| Email | Password | Ruolo / Permessi |
| --- | --- | --- |
| `admin@example.com` | `admin` | Amministratore (accesso completo a log ed elenco preventivi globali) |
| `user@example.com` | `password` | Cliente Standard (creazione preventivi e configurazione modelli) |
| `user2@example.com` | `password123` | Cliente Secondario  |


---

## API disponibili

### Rotte Pubbliche (Nessun token richiesto)

| Metodo | Endpoint | Descrizione |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Effettua l'autenticazione, rilascia il token JWT e i dati utente |
| `POST` | `/api/auth/register` | Registra una nuova anagrafica cliente (ruolo di default: `user`) |
| `GET` | `/api/marchi` | Restituisce l'albero completo del catalogo (marchi e modelli interni) |

### Rotte Protette (Richiesto Header Authorization con Token JWT)

| Metodo | Endpoint | Descrizione | Accesso |
| --- | --- | --- | --- |
| `GET` | `/api/preventivi` | Restituisce la lista cronologica dei preventivi salvati dall'utente corrente | `USER` / `ADMIN` |
| `POST` | `/api/preventivi` | Registra una nuova configurazione auto salvando gli optional selezionati | `USER` / `ADMIN` |
| `GET` | `/api/admin/preventivi/admin` | Estrae lo storico completo di tutti i preventivi generati nel sistema | Solo `ADMIN` |

### Formato Header di Autenticazione

Tutte le rotte contrassegnate come protette richiedono l'invio del bearer token all'interno degli header HTTP della richiesta:

```text
Authorization: Bearer <stringa_token_jwt_rilasciata_al_login>

```

---

## Flusso del Configuratore (5 Fasi)

La pagina del configuratore interattivo (`ConfiguratorPage`) è interamente gestita tramite un ciclo di rendering dinamico controllato dallo stato locale `currentStep`, suddiviso in 5 fasi logiche sequenziali:

1. **Fase 1 - Allestimento:** Selezione del Brand automobilistico (es. FIAT, Alfa Romeo, Audi, BMW) e scelta del rispettivo modello di partenza.
2. **Fase 2 - Motorizzazione:** Scelta della propulsione basata sui listini reali sincronizzati (es. Mild Hybrid, Plug-in, Elettrica pura, Diesel).
3. **Fase 3 - Esterni:** Personalizzazione visiva della tinta carrozzeria e accoppiamento del diametro dei cerchi in lega disponibili.
4. **Fase 4 - Interni:** Scelta dei rivestimenti della selleria (tessuto ecologico, alcantara sportiva, pelle nappa) e delle modanature plancia.
5. **Fase 5 - Pacchetti:** Selezione di pacchetti tecnologici, ADAS avanzati o upgrade multimediali supplementari con calcolo in tempo reale del prezzo stimato.

### Gestione Incompatibilità e Conflitti

L'applicazione include un motore interno di validazione basato sulla matrice delle esclusioni reciproche. Se l'utente seleziona un optional incompatibile con le scelte effettuate, il sistema blocca preventivamente l'inserimento:

```javascript
// esempio di logica di controllo conflitti integrata nel frontend spa
const regoleIncompatibilita = [
  { a: "fi-p1", b: "fi-p2" },   // il pack comfort esclude il pack style
  { a: "al-i3", b: "al-p2" }    // l interno alcantara esclude il pack premium veloce
];

```

---

## Esempio di Payload di Configurazione (Salvataggio Ordine)

Quando l'utente completa la fase 5 e clicca su **"Completa Ordine"**, il frontend effettua una mappatura automatica dei codici stringa locali verso gli ID interi incrementali gestiti dal database relazionale del server Flask, inviando una richiesta in formato JSON:

### Richiesta `POST /api/preventivi`

```json
{
  "id_utente": 1,
  "id_abbinamento": 4,
  "optional": [2, 6, 8, 11]
}

```

### Risposta del Server (Successo)

```json
{
  "success": true,
  "id_preventivo": 142,
  "messaggio": "configurazione reale registrata con successo e salvata nello storico!"
}

```

---

## Decorator di Sicurezza Disponibili (Backend Flask)

Il backend mette a disposizione due filtri custom strutturati sotto forma di decorator python per intercettare le chiamate e validare i contesti operativi prima di raggiungere i controller:

* `@token_required`: Estrae l'header di autorizzazione, decodifica la firma del token JWT tramite la chiave privata del server e verifica che la sessione non sia scaduta (validità predefinita: 1 ora). Inietta l'oggetto dell'utente autenticato direttamente nei parametri della rotta.
* `@role_required("admin")`: Intercetta il ruolo salvato all'interno del payload del token validato e blocca la chiamata restituendo un errore `HTTP 403 Forbidden` se l'utente non possiede i privilegi di amministrazione specificati.

```python
# esempio di utilizzo combinato sui controller del backend
@preventivi_bp.route("/api/admin/preventivi/globali", methods=["GET"])
@token_required
@role_required("admin")
def ottieni_preventivi_globali(current_user):
    # logica di estrazione dei dati protetti
    pass

```

---

## Note sui Concetti Chiave

1. **just-dom (SPA e Virtual DOM Alternativo):** L'applicazione frontend non utilizza framework commerciali (come React o Vue), ma si basa sulla manipolazione atomica dichiarativa tramite l'oggetto globale `JUST-DOM`. L'azzeramento del contenitore e la successiva iniezione dei nodi tramite `appendChild` garantiscono tempi di caricamento istantanei e fluidità nei cambi rotta del router senza alcun overhead di memoria.
2. **Bcrypt Password Hashing:** All'atto della registrazione, il sistema effettua il salting e l'hashing asincrono delle password utente prima della memorizzazione sul database, garantendo che le credenziali non vengano mai archiviate in chiaro all'interno delle tabelle PostgreSQL.
3. **State Sincronizzato:** I dati complessivi dei listini, dei prezzi base e dei costi dei singoli optional vengono estratti in un unico payload all'avvio o strutturati in mappe interne atomiche, permettendo al configuratore di aggiornare all'istante il prezzo totale stimato senza dover interrogare continuamente il backend ad ogni clic o cambio colore dell'utente.

```

```
