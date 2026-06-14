 ## """ ANALISI E SCELTE PROGETTUALI """

## 1. Architettura Generale (API)
1. **Frontend (Client-side):** Un'applicazione ad architettura SPA (*Single Page Application*) sviluppata in Vanilla JavaScript reattivo (sfruttando la libreria `just-dom`). È interamente strutturata per gestire lo stato dell'interfaccia utente, la reattività dell'applicazione agli eventi del wizard (click, cambi fase, validazioni visive) e l'interazione asincrona tramite chiamate API Fetch.
2. **Backend (Server-side):** Un web server modulare sviluppato in Python con il micro-framework **Flask**, configurato per agire esclusivamente come API REST pura. Il suo scopo strutturale è ricevere richieste HTTP dal client, effettuarne il parsing e la validazione logica, interrogare in sicurezza il database relazionale ed erogare risposte strutturate in formato standard **JSON**.

### Perché questa scelta?
Questa separazione netta garantisce la massima modularità, manutenibilità e sicurezza del codice. Il frontend agisce in un ambiente "sandbox" lato client: non conosce le credenziali di accesso al database, non ha visibilità sulla struttura fisica delle tabelle e non esegue query dirette. Qualsiasi operazione di lettura o scrittura è mediata e filtrata dalla "dogana" software rappresentata dagli endpoint del backend Flask, azzerando i rischi di manipolazione fraudolenta o esposizione diretta dei dati sensibili all'utente finale.

---

## 2. Strategia di Modellazione del Database (PostgreSQL)
La persistenza dei dati è stata affidata a **PostgreSQL**, un sistema di gestione di database relazionali (RDBMS) enterprise-grade. La modellazione delle tabelle è stata guidata dalla necessità di far rispettare in modo nativo i vincoli commerciali del settore automotive e l'integrità referenziale dei dati transazionali.

### 2.1 La Gestione del Catalogo (Listino Commerciale)
Per mappare in modo pulito ed efficiente gli 8 marchi richiesti dalle specifiche di progetto (*FIAT, Alfa Romeo, Lancia, Abarth, Volkswagen, BMW, Audi, Mercedes-Benz*), si è preferito non legare in modo rigido, atomico e statico i singoli modelli ai motori o ai prezzi fissi. È stata invece introdotta la tabella ponte centrale **`abbinamenti_catalogo`**.
* **Scelta Progettuale:** Questa tabella funge da "Listino Ufficiale" aziendale. Evita l'accoppiamento errato o assurdo tra scocche e motorizzazioni incompatibili (ad esempio, l'installazione di un motore sportivo V6 Alfa Romeo su una citycar elettrica come la FIAT Topolino). Il frontend interroga dinamicamente questo listino relazionale ed espone all'utente esclusivamente le combinazioni *Modello + Motorizzazione/Allestimento* autorizzate esplicitamente a livello di database, calcolando correttamente il rispettivo prezzo base di listino.

### 2.2 Il Vincolo di Compatibilità e Incompatibilità degli Optional
La gestione delle regole tecniche e commerciali tra gli accessori è stata risolta attraverso una sofisticata architettura di controllo a **doppio livello** (Database + Frontend State Verification):
1. **Filtro di Inclusione (Database):** Tramite la tabella ponte **`abbinamenti_optional`**, ogni optional presente nel catalogo globale (`optional_catalogo`) viene mappato e associato solo all'ID dell'allestimento/motorizzazione specifica (`id_abbinamento`). Quando l'utente seleziona un'auto, il backend estrae esclusivamente gli accessori nativamente predisposti per quella specifica configurazione hardware di base.
2. **Esclusione Reciproca Dinamica (Frontend):** Per gestire i conflitti logici o fisici tra optional della stessa vettura (ad esempio, l'impossibilità di selezionare due colorazioni di vernice diverse o pacchetti accessori che si escludono a vicenda), il client gestisce uno stato reattivo supportato da una matrice lineare di controllo (`regoleIncompatibilita`). Prima di consentire l'attivazione di un accessorio nello stato locale, il sistema esegue una scansione algoritmica istantanea bloccando preventivamente le selezioni contrastanti.

### 2.3 Il "Congelamento" dei Prezzi Storici (Vincolo commerciale)
Nelle tabelle transazionali **`preventivi`** e **`preventivi_optional`**, sono stati inseriti i campi dedicati `prezzo_storico_base` e `prezzo_storico_optional`.
* **Scelta Progettuale Cruciale:** Quando un utente salva o conferma un preventivo, il sistema *non si limita a creare un collegamento (JOIN) ai prezzi del listino corrente*. Al contrario, **copia fisicamente il valore economico attuale** e lo memorizza in modo statico all'interno delle tabelle transazionali. Se l'amministratore dell'applicazione dovesse modificare al rialzo o al ribasso i prezzi del catalogo commerciale il mese successivo, i preventivi precedentemente salvati dagli utenti rimarranno del tutto inalterati, storicamente accurati e legalmente coerenti con l'offerta commerciale sottoscritta.

---

## 3. Logica del Backend e Sicurezza (Raw SQL con Psycopg2)
Al posto di utilizzare un ORM (*Object-Relational Mapping*) pesante e astratto come SQLAlchemy, si è scelto deliberatamente di utilizzare il driver nativo a basso livello **`psycopg2`** per interagire direttamente con PostgreSQL scrivendo query in SQL puro (*Raw SQL*).

### 3.1 Motivazioni della Scelta rispetto a un ORM
* **Controllo Totale e Performance:** L'uso di `psycopg2` elimina completamente lo strato di astrazione e l'overhead di calcolo introdotti dagli ORM nella traduzione automatica del codice. Ogni singola interrogazione (incluse le JOIN complesse usate per estrarre l'albero del catalogo) è ottimizzata, pulita e scritta su misura.
* **Valore Didattico ed Esplicito:** Questa scelta ha permesso di padroneggiare a fondo la sintassi SQL relazionale pura, la gestione manuale dei cursori e le transazioni del database, garantendo piena visibilità su ciò che viene eseguito sul database.

### 3.2 Prevenzione SQL Injection
Non delegare la sicurezza a un ORM richiede un controllo rigoroso dell'input. Per azzerare completamente la vulnerabilità da **SQL Injection**, tutte le query inviate al database sono state strutturate tramite la **parametrizzazione nativa** offerta da `psycopg2`.



## 4. Ottimizzazione dell'Interfaccia Utente ed Esperienza Visiva (UX/UI)

### 4.1 Inibizione Visiva degli Stati Incompatibili
Per azzerare l'errore umano e azzerare le interazioni non valide, l'interfaccia applica in tempo reale le classi stilistiche di **Tailwind CSS** basandosi sulle regole di incompatibilità calcolate dal client. Se un pacchetto o un optional entra in conflitto con lo stato corrente, la card dell'accessorio viene renderizzata istantaneamente con:

* **Opacità ridotta** (`opacity-35`)
* **Cursore di blocco strutturale** (`cursor-not-allowed`)
* **Icone grafiche di avviso** (`AlertTriangle`)

Questo sistema disabilita fisicamente l'interazione prima ancora che l'utente possa effettuare un click non valido sul componente.

---

### 4.2 Layer Adattivo per gli Asset Grafici (Zoom Dinamico Immagini)
A causa delle diverse proporzioni e degli ampi margini vuoti trasparenti nativamente presenti nelle immagini sorgente fornite dai vari brand automobilistici, un layout a dimensioni fisse standardizzato sminuiva la resa visiva dei veicoli. È stato introdotto un **layer logico condizionale** durante la generazione dinamica dei nodi DOM:

* **Marchi con inquadrature distanti (Audi, BMW, Mercedes):** Vengono intercettati dal codice e scalati programmaticamente al **155%** (`scale-[155%]`) riempiendo in modo armonioso il viewport scuro, applicando una transizione fluida all'hover del mouse al **165%** (`group-hover:scale-[165%]`).
* **Regola atomica mirata per l'Audi A3:** Viene applicato un extra-zoom calibrato al **175%** (`scale-[175%]`) e un effetto hover al **185%**, compensando perfettamente lo spazio vuoto nativo dell'immagine sorgente.
* **Isolamento geometrico:** Qualsiasi fenomeno di fuoriuscita (*clipping*) della carrozzeria o sovrapposizione estetica con la UI circostante è stato azzerato impostando tassativamente la proprietà **`overflow-hidden`** sul contenitore genitore del viewport.

---




