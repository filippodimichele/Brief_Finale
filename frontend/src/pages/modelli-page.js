import { jd } from "../jd.config";

function showLoader(message = "caricamento in corso...") {
  if (document.getElementById("global-loader")) return;
  const loader = jd.div({
    id: "global-loader",
    className: "fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center gap-4"
  }, [
    jd.div({ className: "relative flex items-center justify-center" }, [
      jd.div({ className: "size-16 border-4 border-t-red-600 border-r-transparent border-b-neutral-800 border-l-transparent rounded-full animate-spin" }),
      jd.div({ className: "absolute size-10 border-4 border-b-white border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin [animation-duration:0.8s]" })
    ]),
    jd.span({ className: "text-xs font-bold uppercase tracking-widest text-neutral-300 animate-pulse" }, [message])
  ]);
  document.body.appendChild(loader);
}

function hideLoader() {
  const loader = document.getElementById("global-loader");
  if (loader) loader.remove();
}

// mappatura completa delle auto
const imageModelli = {
  "grande panda": "/image/grande_panda.png",
  "500": "/image/500.png",
  "topolino": "/image/topolino.png",
  "tonale": "/image/tonale.png",
  "giulia": "/image/giulia.png",
  "stelvio": "/image/stelvio.png",
  "ypsilon": "/image/ypsilon.png",
  "500e": "/image/500e.png",
  "600e": "/image/600e.png",
  "a3": "/image/a3.png",
  "a5": "/image/a5.png",
  "q5": "/image/q5.png",
  "serie 1": "/image/serie_1.png",
  "serie 3": "/image/serie_3.png",
  "x1": "/image/x1.png",
  "golf": "/image/golf.png",
  "polo": "/image/polo.png",
  "tiguan": "/image/tiguan.png",
  "classe a": "/image/classe_a.png",
  "classe c": "/image/classe_c.png",
  "gla": "/image/gla.png",
  "placeholder": "/image/logo.png"
};

export function ModelliPage() {
  const pageContainer = jd.div({ className: "min-h-screen bg-black text-white flex flex-col overflow-y-auto" });
  
  let marchiData = [];
  let idMarchioSelezionato = null;

  const caricaDatiEFlotta = async () => {
    showLoader("caricamento catalogo...");
    try {
      const response = await fetch("http://localhost:5000/api/marchi");
      const result = await response.json();
      
      if (result.success) {
        marchiData = result.dati;
        if (marchiData.length > 0) {
          idMarchioSelezionato = marchiData[0].id_marchio;
        }
      }
    } catch (error) {
      console.error("errore nel caricamento:", error);
    } finally {
      hideLoader();
      renderContent();
    }
  };

  const renderContent = () => {
    pageContainer.innerHTML = "";

    // navbar con il logo
    const navbar = jd.div({ className: "w-full bg-black h-24 border-b border-neutral-900 px-6 flex items-center justify-between shrink-0" }, [
      jd.a({ 
        className: "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer",
        onClick: (e) => {
          e.preventDefault();
          showLoader("ritorno alla home...");
          setTimeout(() => { window.location.href = "/homepage"; }, 800);
        }
      }, [
        jd.lucide("ArrowLeft", { className: "size-4" }),
        "Torna alla Home"
      ]),
      // contenitore del logo
      jd.div({ className: "w-55 h-50 w-auto object-contain flex items-center justify-center" }, [
        jd.img({ src: "/image/logo.png", alt: "Logo", className: "max-h-full max-w-full object-contain" })
      ]),
      jd.div({ className: "w-24" }) 
    ]);

    const headerSezione = jd.div({ className: "w-full max-w-7xl mx-auto pt-12 px-6 text-left flex flex-col gap-2 shrink-0" }, [
      jd.p({ className: "text-red-500 text-xs font-bold uppercase tracking-widest" }, ["Il nostro catalogo"]),
      jd.h1({ className: "text-3xl md:text-5xl font-black uppercase tracking-tight" }, ["Esplora i Modelli"])
    ]);

    const mainLayout = jd.div({ className: "w-full max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 flex-1 items-start" });

    const colonnaSinistra = jd.div({ className: "w-full lg:w-1/3 bg-neutral-950 border border-neutral-900 rounded-2xl p-4 sticky top-6" }, [
      jd.div({ className: "px-4 py-3 border-b border-neutral-900 flex flex-col text-left mb-2" }, [
        jd.h2({ className: "text-sm font-black uppercase tracking-wider text-neutral-400" }, ["Seleziona Marchio"])
      ]),
      jd.div({ className: "overflow-x-auto w-full" }, [
        jd.table({ className: "table w-full border-collapse" }, [
          jd.thead({ className: "hidden" }, [jd.tr({}, [jd.th({}, ["Marchio"])])]),
          jd.tbody({}, 
            marchiData.map((marchio) => {
              const isSelezionato = idMarchioSelezionato === marchio.id_marchio;
              return jd.tr({
                onClick: () => {
                  idMarchioSelezionato = marchio.id_marchio;
                  renderContent();
                },
                className: `group cursor-pointer border-b border-neutral-900/60 transition-colors ${
                  isSelezionato ? "bg-neutral-900 text-white" : "hover:bg-neutral-900/40 text-neutral-400 hover:text-white"
                }`
              }, [
                // cella marchio senza paese di origine
                jd.td({ className: "p-4 flex items-center text-left font-bold text-xs uppercase tracking-wider" }, [
                  jd.span({}, [marchio.nome_marchio])
                ])
              ]);
            })
          )
        ])
      ])
    ]);

    const marchioAttuale = marchiData.find(m => m.id_marchio === idMarchioSelezionato);
    const modelliDaMostrare = marchioAttuale && marchioAttuale.modelli ? marchioAttuale.modelli : [];

    const colonnaDestra = jd.div({ className: "w-full lg:w-2/3 flex-1" }, [
      modelliDaMostrare.length === 0 
        ? jd.div({ className: "w-full text-center py-20 bg-neutral-950 border border-neutral-900 rounded-2xl text-neutral-500 text-sm font-medium uppercase tracking-wider" }, ["Nessun modello disponibile per questo marchio."])
        : jd.div({ className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, 
            modelliDaMostrare.map((modello) => {
              const nomeChiave = modello.nome_modello.toLowerCase();
              const srcImmagine = imageModelli[nomeChiave] || imageModelli["placeholder"];

              // controllo dinamico per identificare se il marchio attuale richiede lo zoom controllato
              const nomeMarchioString = (marchioAttuale?.nome_marchio || "").toLowerCase();
              const richiedeGrossoZoom = ["audi", "bmw", "mercedes"].includes(nomeMarchioString);

              return jd.div({ className: "bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden group hover:border-neutral-800 transition-all duration-300 flex flex-col" }, [
                // foto modello con contenitore a ritaglio overflow
                jd.div({ className: "w-full h-48 bg-neutral-950 flex items-center justify-center overflow-hidden relative p-4" }, [
                  jd.img({ 
                    src: srcImmagine, 
                    alt: modello.nome_modello, 
                    // zoom moderato al 155% per evitare che l auto tocchi o superi i bordi del box
                    className: `max-w-full max-h-full object-contain select-none transition-transform duration-500 ${
                      richiedeGrossoZoom 
                        ? "scale-[155%] group-hover:scale-[165%]" 
                        : "scale-100 group-hover:scale-105"
                    }` 
                  })
                ]),
                // dettagli ed azioni
                jd.div({ className: "p-6 flex flex-col gap-4 text-left flex-1 justify-between bg-black border-t border-neutral-900/60" }, [
                  jd.div({ className: "flex flex-col gap-1" }, [
                    jd.p({ className: "text-[10px] font-bold text-neutral-500 uppercase tracking-widest" }, [marchioAttuale.nome_marchio]),
                    jd.h3({ className: "text-lg font-extrabold uppercase tracking-wide text-white" }, [modello.nome_modello])
                  ]),
                  jd.button({
                    onClick: (e) => {
                      e.preventDefault();
                      showLoader(`inizializzazione configuratore per ${modello.nome_modello.toLowerCase()}...`);
                      setTimeout(() => {
                        window.location.href = `/configuratore?modello=${modello.id_modello}`;
                      }, 1200);
                    },
                    className: "w-full py-3 bg-neutral-900 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  }, [
                    "Configura",
                    jd.lucide("ChevronRight", { className: "size-4" })
                  ])
                ])
              ]);
            })
          )
    ]);

    mainLayout.appendChild(colonnaSinistra);
    mainLayout.appendChild(colonnaDestra);
    pageContainer.appendChild(navbar);
    pageContainer.appendChild(headerSezione); 
    pageContainer.appendChild(mainLayout);
  };

  caricaDatiEFlotta();
  return pageContainer;
}