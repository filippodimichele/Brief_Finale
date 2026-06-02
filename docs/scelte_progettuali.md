## ANALISI E SCELTE PROGETTUALI

## 1. Architettura Generale (API REST)
Il sistema è stato progettato seguendo l'architettura **Decoupled (Disaccoppiata)**, dividendo nettamente l'applicazione in due macro-componenti indipendenti:
1. **Frontend (Client-side):** Sviluppato in Vanilla JavaScript, strutturato per gestire l'interfaccia utente, la reattività del configuratore ad eventi (click, selezioni) e l'interazione asincrona con il server.
2. **Backend (Server-side):** Un web server Python (Flask) che agisce da API REST. Il suo unico scopo è ricevere richieste HTTP dal client, validare i dati, interrogare in sicurezza il database e restituire risposte in formato JSON.

### Perché questa scelta?
Questa separazione garantisce la modularità del codice. Il frontend non conosce la password del database e non esegue query dirette; il database è protetto dietro la "dogana" del backend Python, azzerando i rischi di manipolazione diretta dei dati da parte dell'utente finale.

## 2. Strategia di Modellazione del Database (PostgreSQL)


### 2.1 La Gestione del Catalogo (Listino Commerciale)
Per mappare gli 8 marchi richiesti (*FIAT, Alfa Romeo, Lancia, Abarth, Volkswagen, BMW, Audi, Mercedes-Benz*), si è preferito non legare in modo rigido e atomico i singoli modelli ai motori. È stata invece introdotta la tabella **`abbinamenti_catalogo`**. 
* **Scelta Progettuale:** Questa tabella funge da "Listino Ufficiale". Evita che l'utente possa configurare combinazioni assurde (es. un motore V6 di un'Alfa Romeo Giulia montato su una FIAT 500). Il sistema mostra nel Frontend solo le combinazioni *Allestimento + Motore* esplicitamente autorizzate in questa tabella.

### 2.2 Il Vincolo di Compatibilità degli Optional
Il requisito fondamentale della compatibilità tra accessori è stato risolto tramite la tabella ponte **`abbinamenti_optional`**.
* **Scelta Progettuale:** Ogni optional è legato all'ID della combinazione della vettura (`id_abbinamento`). In questo modo, quando l'utente seleziona un modello specifico, il backend estrae esclusivamente gli optional compatibili con quella configurazione di base, impedendo la selezione di componenti incompatibili.

### 2.3 Il "Congelamento" dei Prezzi Storici (Vincolo commerciale)
Nelle tabelle transazionali **`configurazioni`** e **`configurazioni_optional`**, sono stati inseriti i campi `prezzo_storico_base` e `prezzo_storico_optional`.
* **Scelta Progettuale Cruciale:** Quando un utente salva un preventivo, il sistema *non si limita a fare un collegamento (JOIN) al listino*, ma **copia il prezzo corrente** e lo memorizza in modo statico. Se l'amministratore dovesse modificare i prezzi del catalogo il mese successivo, i vecchi preventivi degli utenti rimarranno invariati e storicamente corretti.



## 3. Logica del Backend e Sicurezza (Psycopg2)
Al posto di un ORM (come SQLAlchemy), si è scelto di utilizzare il driver nativo **`psycopg2`** per interagire con PostgreSQL tramite query SQL pure (*Raw SQL*).

### 3.1 Prevenzione SQL Injection
Tutte le query inviate al database sono **parametrizzate** (utilizzando il marcatore `%s` di psycopg2). I dati inseriti dall'utente non vengono mai concatenati direttamente nella stringa SQL come testo libero.
```python
# Esempio di scrittura sicura nel Backend
query = "SELECT * FROM modelli WHERE id_marchio = %s;"
cur.execute(query, (id_marchio_selezionato,))