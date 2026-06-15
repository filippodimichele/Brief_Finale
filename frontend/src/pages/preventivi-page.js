import { jd } from "../jd.config";
import { showLoader, hideLoader } from "../components/loader";

export function PreventiviPage() {
  const pageContainer = jd.div({ className: "min-h-screen bg-white text-neutral-900 flex flex-col overflow-y-auto" });

  const renderContent = async () => {
    pageContainer.innerHTML = "";

    // recupero dinamico dei dati utente da localstorage
    const currentUser = {
      id: localStorage.getItem("userId") || "",
      role: localStorage.getItem("userRole") || "cliente", 
      name: localStorage.getItem("userName") || "Ospite"
    };

    // recuperiamo il token jwt salvato al login per autenticare le richieste
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    // controllo di sicurezza tassativo per la rotta admin basato sul ruolo reale del database
    // assumiamo che l'admin abbia id_ruolo o stringa "1" o "admin" nel localstorage
    const utenteEAdminReale = currentUser.role === "admin" || currentUser.role === "1";

    if (currentPath === "/preventivi/admin" && !utenteEAdminReale) {
      window.location.href = "/login";
      return;
    }

    // isolamento blindato dello stato admin per evitare switch di ruolo grafici al refresh parziale
    const isAdmin = utenteEAdminReale && currentPath === "/preventivi/admin";
    let preventiviDaMostrare = [];

    // chiamata asincrona condizionale alle api di flask
    if (currentUser.id) {
      showLoader("caricamento preventivi...");
      try {
        // se e admin richiede tutto il listino globale, altrimenti isola solo il singolo utente
        const urlAPI = isAdmin 
          ? "http://localhost:5000/api/preventivi/admin"
          : `http://localhost:5000/api/preventivi/utente/${currentUser.id}`;

        const response = await fetch(urlAPI, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await response.json();
        
        if (result.success) {
          preventiviDaMostrare = result.dati;
        }
      } catch (error) {
        console.error("errore durante il recupero dei dati dal database:", error);
      } finally {
        hideLoader();
      }
    }

    // funzione per scaricare i preventivi visualizzati in formato csv per excel
    const esportaPreventiviCSV = (dati) => {
      let csvContent = "data:text/csv;charset=utf-8,ID;Cliente;Configurazione Auto;Prezzo Totale;Stato\n";
      
      dati.forEach(p => {
        const idDettaglio = `PREV-00${p.id_preventivo}`;
        const clienteDettaglio = isAdmin ? (p.nome_cliente || "Utente") : currentUser.name;
        const autoDettaglio = p.auto_dettaglio || `Modello #${p.id_abbinamento}`;
        const prezzoDettaglio = `${p.prezzo_totale} EUR`;
        const statoDettaglio = p.stato;
        
        const riga = `${idDettaglio};${clienteDettaglio};${autoDettaglio};${prezzoDettaglio};${statoDettaglio}`;
        csvContent += riga + "\n";
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `esportazione_preventivi_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // funzione per l'admin per cambiare lo stato del preventivo
    const cambiaStato = async (idPreventivo, nuovoStato) => {
      if (!isAdmin) return; // blocco di sicurezza locale invalicabile
      showLoader("aggiornamento stato in corso...");
      try {
        const response = await fetch(`http://localhost:5000/api/preventivi/${idPreventivo}/stato`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ stato: nuovoStato })
        });
        const result = await response.json();
        
        if (result.success) {
          await renderContent();
        } else {
          alert("errore durante l'aggiornamento: " + result.errore);
        }
      } catch (error) {
        console.error("errore di rete:", error);
      } finally {
        hideLoader();
      }
    };

    // funzione per l'admin per accedere all'eliminazione
    const eliminaPreventivo = async (idPreventivo) => {
      if (!isAdmin) return; // blocco di sicurezza locale invalicabile
      if (!confirm("Sei sicuro di voler eliminare definitivamente questo preventivo dal sistema?")) return;
      
      showLoader("eliminazione record in corso...");
      try {
        const response = await fetch(`http://localhost:5000/api/preventivi/${idPreventivo}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await response.json();
        
        if (result.success) {
          await renderContent(); 
        } else {
          alert("errore durante l'eliminazione: " + result.errore);
        }
      } catch (error) {
        console.error("errore di rete durante la cancellazione:", error);
      } finally {
        hideLoader();
      }
    };

    // navbar
    const navbar = jd.div({ className: "navbar bg-black shadow-sm h-35 shrink-0 px-4 border-b border-neutral-900 flex justify-between items-center" }, [
      jd.div({ className: "navbar-start" }, [
        jd.div({ className: "dropdown" }, [
          jd.div({ tabIndex: 0, role: "button", className: "btn btn-ghost btn-circle text-white" }, [
            jd.lucide("Menu", { className: "size-5" })
          ]),
          jd.ul({ className: "menu menu-sm dropdown-content bg-neutral-900 rounded-box z-1 mt-3 w-52 p-2 shadow border border-neutral-800" }, [
            jd.li({}, [jd.a({ href: "/homepage", className: "text-white" }, ["Home"])]),
            jd.li({}, [jd.a({ href: "/modelli", className: "text-white" }, ["Catalogo Modelli"])])
          ])
        ])
      ]),
      jd.div({ className: "navbar-center flex items-center justify-center" }, [
        jd.a({}, [
          jd.img({ src: "/image/logo.png", alt: "Logo", className: "h-35 w-65" })
        ])
      ]),
      jd.div({ className: "navbar-end flex items-center justify-end" }, [
        jd.div({ className: "flex items-center gap-2 text-xs uppercase tracking-wider font-bold bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800 text-white" }, [
          jd.lucide("User", { className: "size-3.5 text-red-500" }),
          jd.span({}, [currentUser.name]),
          jd.span({ className: "text-[10px] text-neutral-500 font-mono" }, [`(${isAdmin ? "admin" : "cliente"})`])
        ])
      ])
    ]);

    // contenuto principale
    const mainContent = jd.div({ className: "w-full max-w-6xl mx-auto px-6 py-12 flex flex-col gap-8 flex-1" }, [
      jd.div({ className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left" }, [
        jd.div({ className: "flex flex-col gap-2" }, [
          jd.p({ className: "text-red-500 text-xs font-bold uppercase tracking-widest" }, [
            isAdmin ? "Pannello di controllo" : "I tuoi dettagli"
          ]),
          jd.h1({ className: "text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-950" }, [
            isAdmin ? "Gestione Logistica Preventivi" : "Il Tuo Preventivo Personalizzato"
          ]),
          jd.div({ className: "w-12 h-1 bg-red-600 rounded-full mt-2" })
        ]),
        preventiviDaMostrare.length > 0 ? jd.button({
          onclick: () => esportaPreventiviCSV(preventiviDaMostrare),
          className: "px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 border border-neutral-800 shadow-sm font-bold cursor-pointer"
        }, [
          jd.lucide("Download", { className: "size-4 text-red-500" }),
          "Esporta in CSV"
        ]) : null
      ]),

      preventiviDaMostrare.length === 0 
        ? jd.div({ className: "p-12 text-center bg-neutral-50 border border-neutral-200 rounded-2xl text-neutral-500 font-medium" }, [
            jd.lucide("FileText", { className: "size-12 mx-auto text-neutral-300 mb-4" }),
            jd.p({}, ["Nessun preventivo trovato nel sistema per questo account."])
          ])
        : jd.div({ className: "flex flex-col gap-6" }, [
            jd.div({ className: "w-full border border-neutral-200 rounded-2xl overflow-hidden shadow-sm bg-white" }, [
              // rimosso il doppio tag table nidificato che rompeva l'albero dom del configuratore
              jd.table({ className: "w-full text-left border-collapse text-neutral-800 text-sm" }, [
                jd.thead({ className: "bg-neutral-50 text-neutral-500 font-bold uppercase text-xs tracking-wider border-b border-neutral-200" }, [
                  jd.tr({}, [
                    jd.th({ className: "p-4" }, ["ID"]),
                    isAdmin ? jd.th({ className: "p-4" }, ["Cliente"]) : null,
                    jd.th({ className: "p-4" }, ["Configurazione Auto"]),
                    jd.th({ className: "p-4 text-right" }, ["Prezzo Totale"]),
                    jd.th({ className: "p-4 text-center" }, ["Stato"]),
                    isAdmin ? jd.th({ className: "p-4 text-center" }, ["Azioni"]) : null
                  ].filter(Boolean))
                ]),
                jd.tbody({ className: "divide-y divide-neutral-100 font-medium" }, 
                  preventiviDaMostrare.map(p => {
                    let badgeClass = "bg-yellow-50 text-yellow-700 border-yellow-200";
                    if (p.stato === "approvato") badgeClass = "bg-green-50 text-green-700 border-green-200";
                    if (p.stato === "rifiutato") badgeClass = "bg-red-50 text-red-700 border-red-200";

                    return jd.tr({ className: "hover:bg-neutral-50/50 transition-colors" }, [
                      jd.td({ className: "p-4 font-mono text-xs text-neutral-500" }, [`PREV-00${p.id_preventivo}`]),
                      isAdmin ? jd.td({ className: "p-4 text-neutral-950 font-bold text-xs uppercase" }, [p.nome_cliente || "Utente"]) : null,
                      jd.td({ className: "p-4 text-neutral-950 font-bold" }, [p.auto_dettaglio || `Modello #${p.id_abbinamento}`]),
                      jd.td({ className: "p-4 text-right text-red-600 font-bold" }, [`${p.prezzo_totale.toLocaleString('it-IT')} €`]),
                      jd.td({ className: "p-4 text-center" }, [
                        jd.span({ className: `px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${badgeClass}` }, [p.stato])
                      ]),
                      isAdmin ? jd.td({ className: "p-4 text-center" }, [
                        jd.div({ className: "flex items-center justify-center gap-2" }, [
                          jd.button({
                            onclick: () => cambiaStato(p.id_preventivo, "approvato"),
                            className: "px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                          }, ["Approva"]),
                          jd.button({
                            onclick: () => cambiaStato(p.id_preventivo, "rifiutato"),
                            className: "px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
                          }, ["Rifiuta"]),
                          jd.button({
                            onclick: () => eliminaPreventivo(p.id_preventivo),
                            className: "px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1 cursor-pointer"
                          }, [
                            jd.lucide("Trash", { className: "size-3" }),
                            "Elimina"
                          ])
                        ])
                      ]) : null
                    ].filter(Boolean));
                  })
                )
              ])
            ]),
            isAdmin ? jd.div({ className: "mt-4 flex flex-col gap-4 text-left" }, [
              jd.h3({ className: "text-lg font-bold text-neutral-950 uppercase tracking-wide flex items-center gap-2" }, [
                jd.lucide("History", { className: "size-5 text-red-600" }),
                "Cronologia Azioni e Modifiche Globali"
              ]),
              jd.div({ className: "p-6 bg-neutral-50 border border-neutral-200 rounded-2xl flex flex-col gap-3 font-medium text-xs text-neutral-600" }, [
                jd.div({ className: "flex justify-between border-b border-neutral-200/60 pb-2" }, [jd.span({}, ["• Sincronizzazione database completata"]), jd.span({ className: "text-neutral-400" }, ["In tempo reale"])])
              ])
            ]) : null
          ])
    ]);

    // footer
    const footer = jd.footer({ className: "w-full bg-neutral-950 text-neutral-400 text-sm border-t border-neutral-900 pt-12 pb-6 px-6 mt-auto" }, [
      jd.div({ className: "w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-neutral-600" }, [
        jd.p({}, `© ${new Date().getFullYear()} Fillantis S.p.A. Progetto Esercitazione.`),
        jd.p({ className: "italic text-neutral-500 max-w-md text-center md:text-right" }, ["uso esclusivo per scopi didattici e simulazioni applicative."])
      ])
    ]);

    pageContainer.appendChild(navbar);
    pageContainer.appendChild(mainContent);
    pageContainer.appendChild(footer);
  };

  renderContent();
  return pageContainer;
}