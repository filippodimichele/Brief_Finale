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
  if (loader) {
    loader.remove();
  }
}

// recupero dati utente da localstorage con valori di default se assenti
const currentUser = {
  name: localStorage.getItem("userName") || "Ospite",
  role: localStorage.getItem("userRole") || "cliente",
};

let currentSlide = 0;

export function DashBoardPage() {
  const slides = [
    {
      id: 1,
      src: "/image/body.png",
      title: "LA TUA PROSSIMA AUTO E' UN NOSTRO IMPEGNO",
      subtitle: "scopri le migliori offerte su vetture nuove, usate e chilometri zero garantite dal nostro network."
    },
    {
      id: 2,
      src: "/image/slide-2.png",
      title: "STILE E PRESTAZIONI SENZA COMPROMESSI",
      subtitle: "esplora la nuova gamma sportiva con soluzioni di finanziamento su misura ed esclusive."
    },
  ];

  const pageContainer = jd.div({ className: "min-h-screen bg-black text-white flex flex-col overflow-y-auto select-text" });

  const trackContainer = jd.div({
    className: "w-full h-full flex transition-transform duration-1000 ease-in-out",
    style: `transform: translateX(-${currentSlide * 100}%);`
  }, 
    slides.map((slide) => {
      return jd.div({ 
        className: "w-full h-full shrink-0 relative flex items-center bg-cover bg-center px-6 md:px-16",
        style: `background-image: url('${slide.src}');`
      }, [
        jd.div({ className: "max-w-2xl flex flex-col gap-6 z-10 text-left" }, [
          jd.div({ className: "flex flex-col gap-2" }, [
            jd.h1({ className: "text-5xl md:text-7xl font-extrabold tracking-tight uppercase" }, [slide.title]),
          ]),
          jd.div({ className: "w-12 h-1 bg-red-600 rounded-full" }),
          jd.div({ className: "flex flex-col gap-1 text-sm md:text-base text-neutral-300 font-medium max-w-lg uppercase tracking-wider leading-relaxed" }, [
            jd.p({}, [slide.subtitle])
          ]),
          jd.div({ className: "flex flex-wrap gap-4 mt-4" }, [])
        ])
      ]);
    })
  );

  const dotsArray = slides.map((_, index) => {
    const isActive = currentSlide === index;
    return jd.button({
      className: `h-2 rounded-full transition-all duration-300 ${
        isActive ? "w-10 bg-red-600" : "w-2.5 bg-neutral-500/60 hover:bg-white"
      }`
    });
  });

  const dotsContainer = jd.div(
    { className: "absolute bottom-36 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5" },
    dotsArray
  );

  const updateCarouselDOM = () => {
    trackContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    dotsArray.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.className = "h-2 rounded-full transition-all duration-300 w-10 bg-red-600";
      } else {
        dot.className = "h-2 rounded-full transition-all duration-300 w-2.5 bg-neutral-500/60 hover:bg-white";
      }
    });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarouselDOM();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarouselDOM();
  };

  dotsArray.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      updateCarouselDOM();
    });
  });

  // barra di navigazione con menu hamburger funzionante
  const navbar = jd.div({ className: "navbar bg-black shadow-sm h-35 shrink-0 px-4" }, [
    jd.div({ className: "navbar-start" }, [
      jd.div({ className: "dropdown z-50" }, [
        jd.div({ tabIndex: 0, role: "button", className: "btn btn-ghost btn-circle text-white" }, [
          jd.lucide("Menu", { className: "size-6" })
        ]),
        jd.ul({ className: "dropdown-content menu p-2 shadow-lg bg-neutral-950 border border-neutral-800 rounded-box w-52 mt-2 text-white gap-1" }, [
          // link alla pagina modelli con loader
          jd.li({}, [
            jd.a({
              href: "/modelli",
              className: "flex items-center gap-3 hover:bg-neutral-900 p-2 rounded-lg cursor-pointer",
              onclick: (e) => {
                e.preventDefault();
                showLoader("caricamento modelli...");
                setTimeout(() => {
                  hideLoader();
                  window.location.href = "/modelli";
                }, 1000);
              }
            }, [
              jd.lucide("Car", { className: "size-5" }),
              jd.span({ className: "text-xs font-bold uppercase tracking-wider" }, ["Modelli"])
            ])
          ]),
          // link di ancoraggio alla sezione chi siamo
          jd.li({}, [
            jd.a({
              href: "#about-section",
              className: "flex items-center gap-3 hover:bg-neutral-900 p-2 rounded-lg cursor-pointer",
              onclick: (e) => { 
                e.preventDefault();
                const target = document.getElementById("about-section");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }
            }, [
              jd.lucide("Info", { className: "size-5" }),
              jd.span({ className: "text-xs font-bold uppercase tracking-wider" }, ["Chi Siamo"])
            ])
          ])
        ])
      ])
    ]),

    jd.div({ className: "navbar-center flex items-center justify-center" }, [
      jd.a({ className: "flex items-center justify-center h-full" }, [
        jd.img({ 
          src: "/image/logo.png", 
          alt: "Logo Fillantis", 
          className: "h-50 w-55 w-auto object-contain" 
        })
      ]),
    ]),
    jd.div({ className: "navbar-end flex items-center gap-2" }, [
      jd.div({ className: "dropdown dropdown-end z-50" }, [
        jd.div({ tabIndex: 0, role: "button", className: "btn btn-ghost btn-circle text-white hover:bg-neutral-900" }, [
          jd.lucide("User", { className: "size-5" })
        ]),
        jd.ul({ className: "dropdown-content menu p-3 shadow-2xl bg-neutral-950 border border-neutral-800 rounded-xl w-56 mt-2 text-white flex flex-col gap-2" }, [
          jd.div({ className: "px-2 py-1.5 border-b border-neutral-900 flex flex-col gap-1.5 text-left" }, [
            jd.p({ className: "text-xs font-bold tracking-wide text-neutral-200 truncate" }, [currentUser.name]),
            jd.div({ className: "flex" }, [
              jd.span({ 
                className: `text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                  currentUser.role === "admin" ? "bg-red-600/20 text-red-400 border border-red-600/30" : "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                }` 
              }, [currentUser.role === "admin" ? "Amministratore" : "Utente Autenticato"])
            ])
          ]),
          jd.li({}, [
            jd.a({ className: "flex items-center gap-2.5 hover:bg-neutral-900 p-2 rounded-lg text-xs font-semibold tracking-wider uppercase text-neutral-300" }, [])
          ]),
          jd.li({}, [
            jd.a({
              href: "/login",
              className: "flex items-center gap-2.5 hover:bg-red-950/40 text-red-500 hover:text-red-400 p-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors mt-1",
              onclick: async (e) => {
                e.preventDefault();
                showLoader("disconnessione in corso...");
                setTimeout(() => {
                  hideLoader();
                  localStorage.clear();
                  alert("logout effettuato con successo!");
                  window.location.href = "/login"; 
                }, 1200);
              }
            }, [
              jd.lucide("LogOut", { className: "size-4" }),
              "Logout"
            ])
          ])
        ])
      ])
    ]),
  ]);

  const heroCarousel = jd.div({ className: "relative w-full h-[calc(100vh-140px)] min-h-[600px] overflow-hidden bg-neutral-950 group" }, [
    trackContainer,
    jd.div({ className: "absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/40 to-transparent pt-10 pb-6 px-6 md:px-16 z-10 pointer-events-none" }, [
      jd.div({ className: "w-full border-t border-neutral-800 pt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left pointer-events-auto" }, [
        jd.div({ className: "flex flex-col md:flex-row items-center gap-3" }, [
          jd.lucide("ShieldCheck", { className: "size-6 text-white shrink-0" }),
          jd.div({ className: "flex flex-col text-xs font-semibold uppercase tracking-wider" }, [jd.span({}, ["Qualità"]), jd.span({ className: "text-neutral-400" }, ["Garantita"])])
        ]),
        jd.div({ className: "flex flex-col md:flex-row items-center gap-3" }, [
          jd.lucide("Handshake", { className: "size-6 text-white shrink-0" }),
          jd.div({ className: "flex flex-col text-xs font-semibold uppercase tracking-wider" }, [jd.span({}, ["Affidabilità"]), jd.span({ className: "text-neutral-400" }, ["Totale"])])
        ]),
        jd.div({ className: "flex flex-col md:flex-row items-center gap-3" }, [
          jd.lucide("Euro", { className: "size-6 text-white shrink-0" }),
          jd.div({ className: "flex flex-col text-xs font-semibold uppercase tracking-wider" }, [jd.span({}, ["Finanziamenti"]), jd.span({ className: "text-neutral-400" }, ["Su misura"])])
        ]),
        jd.div({ className: "flex flex-col md:flex-row items-center gap-3" }, [
          jd.lucide("Headphones", { className: "size-6 text-white shrink-0" }),
          jd.div({ className: "flex flex-col text-xs font-semibold uppercase tracking-wider" }, [jd.span({}, ["Assistenza"]), jd.span({ className: "text-neutral-400" }, ["Dedicata"])])
        ])
      ])
    ]),
    jd.button({
      onClick: prevSlide,
      className: "absolute left-6 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
    }, [jd.lucide("ChevronLeft", { className: "size-6" })]),
    jd.button({
      onClick: nextSlide,
      className: "absolute right-6 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
    }, [jd.lucide("ChevronRight", { className: "size-6" })]),
    dotsContainer
  ]);

  const onlinePurchaseSection = jd.div({ className: " w-full h-full py-30 flex items-center justify-center bg-cover bg-center px-5 md:px-16 overflow-hidden", style: "background-image: url('/image/body-2.png');" }, [
    jd.div({ className: "w-full max-w-5xl flex flex-col items-center justify-center gap-12 z-10 text-center " }, [
      jd.div({ className: "flex flex-col gap-2 max-w-3xl" }, [
        jd.p({ className: "text-neutral-400 text-sm font-semibold uppercase tracking-widest text-red-500" }, ["Scegli la passione"]),
        jd.h2({ className: "text-3xl md:text-5xl font-extrabold tracking-tight uppercase" }, ["Acquista online la tua ", jd.span({ className: "text-white font-black" }, ["prossima auto"])])
      ]),
      jd.div({ className: "w-full grid grid-cols-1 md:grid-cols-3 gap-12 pt-4" }, [
        jd.div({ className: "flex flex-col items-center gap-4 text-center max-w-sm mx-auto" }, [
          jd.lucide("CheckCircle2", { className: "size-10 text-white" }),
          jd.h3({ className: "text-lg font-bold uppercase tracking-wider" }, ["Comodo"]),
          jd.div({ className: "flex flex-col gap-1 text-sm text-neutral-400 font-medium leading-relaxed" }, [jd.p({}, ["Ordini online e termini l'acquisto in una"]), jd.p({}, ["delle 300 concessionarie Fillantis."]), jd.p({}, ["Dove vuoi e quando vuoi."])])
        ]),
        jd.div({ className: "flex flex-col items-center gap-4 text-center max-w-sm mx-auto" }, [
          jd.lucide("Search", { className: "size-10 text-white" }),
          jd.h3({ className: "text-lg font-bold uppercase tracking-wider" }, ["Trasparente"]),
          jd.div({ className: "flex flex-col gap-1 text-sm text-neutral-400 font-medium leading-relaxed" }, [jd.p({}, ["Prezzi chiari dall'inizio alla fine."]), jd.p({}, ["E, se scegli l'acquisto con"]), jd.p({}, ["finanziamento, non paghi la caparra."])])
        ]),
        jd.div({ className: "flex flex-col items-center gap-4 text-center max-w-sm mx-auto" }, [
          jd.lucide("RefreshCw", { className: "size-10 text-white" }),
          jd.h3({ className: "text-lg font-bold uppercase tracking-wider" }, ["Flessibile"]),
          jd.div({ className: "flex flex-col gap-1 text-sm text-neutral-400 font-medium leading-relaxed" }, [jd.p({}, ["Hai 14 giorni di prova con reso gratuito e"]), jd.p({}, ["nessuna penale in caso di disdetta."])])
        ])
      ]),
      jd.div({ className: "mt-4" }, [
        jd.a({ 
          href: "/configuratore",
          className: "px-10 py-4 bg-transparent border border-white text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all inline-block duration-300",
          onclick: (e) => {
            e.preventDefault();
            showLoader("inizializzazione configuratore modelli...");
            setTimeout(() => { hideLoader(); window.location.href = "/modelli"; }, 1500);
          }
        }, ["CONFIGURA LA TUA AUTO"])
      ])
    ])
  ]);

  const aboutSection = jd.div({ id: "about-section", className: "w-full bg-neutral-950 bg-cover bg-center py-20 px-6 md:px-16 border-t border-neutral-900 flex flex-col items-center scroll-mt-6", style: "background-image: url('/image/body-3.png');" }, [
    jd.div({ className: "w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start" }, [
      jd.div({ className: "flex flex-col gap-6 text-left" }, [
        jd.div({ className: "flex flex-col gap-2" }, [
          jd.p({ className: "text-red-500 text-xs font-bold uppercase tracking-widest" }, ["Chi Siamo"]),
          jd.h2({ className: "text-3xl md:text-4xl font-black uppercase tracking-tight" }, ["Mettiamo in moto il tuo futuro"])
        ]),
        jd.div({ className: "w-12 h-1 bg-red-600 rounded-full" }),
        jd.div({ className: "flex flex-col gap-4 text-base text-neutral-400 leading-relaxed font-medium" }, [
          jd.p({}, ["Fillantis è il punto di riferimento leader nella mobilità e nella dinstribuzione automobilistica. Uniamo l'experience di oltre 300 concessionarie partner per garantire un ecosistema sicuro, efficiente e completely digitale."]),
          jd.p({}, ["Il nostro obiettivo è trasformare l'acquisto dell'auto in un'experience fluida ed entusiasmante, supportando il cliente in ogni singolo passo: dalla configurazione virtuale alla firma del contratto, fino alla consegna chiavi in mano."])
        ])
      ]),
      jd.div({ className: "grid grid-cols-1 sm:grid-cols-2 gap-6 w-full" }, [
        jd.div({ className: "p-6 bg-black border border-neutral-900 rounded-xl flex flex-col gap-3" }, [
          jd.lucide("Car", { className: "size-8 text-white" }),
          jd.h4({ className: "text-base font-bold uppercase tracking-wider" }, ["Ampia Scelta"]),
          jd.p({ className: "text-xs text-neutral-400 leading-relaxed font-medium" }, ["Accesso immediato a una vasta gamma di vetture nuove, usate e Km0 dei migliori brand mondiali."])
        ]),
        jd.div({ className: "p-6 bg-black border border-neutral-900 rounded-xl flex flex-col gap-3" }, [
          jd.lucide("BadgePercent", { className: "size-8 text-white" }),
          jd.h4({ className: "text-base font-bold uppercase tracking-wider" }, ["Soluzioni Su Misura"]),
          jd.p({ className: "text-xs text-neutral-400 leading-relaxed font-medium" }, ["Piani finanziari personalizzati, leasing avanzati e formule promozionali esclusive per ogni budget."])
        ]),
        jd.div({ className: "p-6 bg-black border border-neutral-900 rounded-xl flex flex-col gap-3" }, [
          jd.lucide("MapPin", { className: "size-8 text-white" }),
          jd.h4({ className: "text-base font-bold uppercase tracking-wider" }, ["Presenza Locale"]),
          jd.p({ className: "text-xs text-neutral-400 leading-relaxed font-medium" }, ["Una rete capillare di showroom e centri assistenza pronti a seguirti anche dopo l'acquisto."])
        ]),
        jd.div({ className: "p-6 bg-black border border-neutral-900 rounded-xl flex flex-col gap-3" }, [
          jd.lucide("Wrench", { className: "size-8 text-white" }),
          jd.h4({ className: "text-base font-bold uppercase tracking-wider" }, ["Manutenzione Premium"]),
          jd.p({ className: "text-xs text-neutral-400 leading-relaxed font-medium" }, ["Officine specializzate e ricambi originali per mantenere inalterate nel tempo le prestazioni dell'auto."])
        ])
      ])
    ])
  ]);

  const fleetSection = jd.div({ className: "w-full bg-gradient-to-b from-neutral-950 to-black py-20 px-6 md:px-16 border-t border-neutral-900 flex flex-col items-center" }, [
    jd.div({ className: "w-full max-w-5xl flex flex-col gap-12" }, [
      jd.div({ className: "flex flex-col md:flex-row justify-between items-start md:items-end gap-4" }, [
        jd.div({ className: "flex flex-col gap-2 text-left" }, [
          jd.p({ className: "text-red-500 text-xs font-bold uppercase tracking-widest" }, ["Esplora la flotta"]),
          jd.h2({ className: "text-3xl md:text-4xl font-black uppercase tracking-tight" }, ["Trova l'auto perfetta per te"])
        ]),
      ]),
      jd.div({ className: "grid grid-cols-1 md:grid-cols-3 gap-8 w-full" }, [
        jd.div({ className: "bg-neutral-900/40 border border-neutral-900 rounded-xl overflow-hidden group hover:border-neutral-800 transition-all flex flex-col" }, [
          jd.div({ className: "w-full h-48 bg-neutral-900 flex items-center justify-center overflow-hidden relative" }, [
            jd.div({ className: "absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded" }, ["Nuovi Arrivi"]),
            jd.img({ src: "/image/suv.png", alt: "SUV Categoria", className: "w-4/5 h-auto object-contain group-hover:scale-105 transition-transform duration-300" })
          ]),
          jd.div({ className: "p-6 flex flex-col gap-4 text-left" }, [
            jd.h3({ className: "text-xl font-bold uppercase tracking-wide" }, ["I Nostri SUV"]),
            jd.p({ className: "text-xs text-neutral-400 font-medium leading-relaxed" }, ["Spazio, comfort e massima sicurezza per i tuoi viaggi in famiglia su ogni tipo di terrain."]),
          ])
        ]),
        jd.div({ className: "bg-neutral-900/40 border border-neutral-900 rounded-xl overflow-hidden group hover:border-neutral-800 transition-all flex flex-col" }, [
          jd.div({ className: "w-full h-48 bg-neutral-900 flex items-center justify-center overflow-hidden relative" }, [
            jd.div({ className: "absolute top-4 left-4 bg-green-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded" }, ["Green"]),
            jd.img({ src: "/image/hybrid.png", alt: "Elettriche Categoria", className: "w-4/5 h-auto object-contain group-hover:scale-105 transition-transform duration-300" })
          ]),
          jd.div({ className: "p-6 flex flex-col gap-4 text-left" }, [
            jd.h3({ className: "text-xl font-bold uppercase tracking-wide" }, ["Elettriche & Hybrid"]),
            jd.p({ className: "text-xs text-neutral-400 font-medium leading-relaxed" }, ["Inizia la transizione ecologica con motorizzazioni silenziose, efficienti e a zero emissioni."]),
          ])
        ]),
        jd.div({ className: "bg-neutral-900/40 border border-neutral-900 rounded-xl overflow-hidden group hover:border-neutral-800 transition-all flex flex-col" }, [
          jd.div({ className: "w-full h-48 bg-neutral-900 flex items-center justify-center overflow-hidden relative " }, [
            jd.div({ className: "absolute top-4 left-4 bg-zinc-700 text-white text-[10px] font-bold uppercase px-2 py-1 rounded" }, ["Performance"]),
            jd.img({ src: "/image/sport.png", alt: "Sportive Categoria", className: "w-4/5 h-auto object-contain group-hover:scale-105 transition-transform duration-300" })
          ]),
          jd.div({ className: "p-6 flex flex-col gap-4 text-left" }, [
            jd.h3({ className: "text-xl font-bold uppercase tracking-wide text-center" }, ["Sportive"]),
            jd.p({ className: "text-xs text-neutral-400 font-medium leading-relaxed" }, ["Prestazioni esaltanti, lines aerodinamiche e tutto il piacere di una guida dinamica e reattiva."]),
          ])
        ])
      ])
    ])
  ]);

  const brandsSection = jd.div({ className: "w-full bg-neutral-950 py-16 px-6 border-t border-neutral-900 flex flex-col items-center gap-10" }, [
    jd.div({ className: "text-center flex flex-col gap-1" }, [
      jd.p({ className: "text-red-500 text-xs font-bold uppercase tracking-widest" }, ["I nostri brand"]),
      jd.h2({ className: "text-2xl md:text-3xl font-bold uppercase tracking-tight text-white" }, ["I marchi ufficiali disponibili"])
    ]),
    jd.div({ className: "w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-800 border border-neutral-800 rounded-lg overflow-hidden shadow-lg" }, [
      ["/image/fiat.png", "FIAT"], ["/image/lancia.png", "LANCIA"], ["/image/abarth.png", "ABARTH"], ["/image/alfaromeo.png", "ALFA ROMEO"],
      ["/image/bmw.png", "BMW"], ["/image/audi.png", "AUDI"], ["/image/mercedes.png", "MERCEDES"], ["/image/volkswagen.png", "VOLKSWAGEN"]
    ].map(([src, name]) => jd.div({ className: "flex flex-col items-center justify-center p-6 bg-black transition-all duration-300 group cursor-pointer hover:bg-neutral-900/60" }, [
      jd.img({ src, alt: name, className: "h-16 w-16 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all" }),
      jd.span({ className: "text-xs font-bold tracking-wider text-neutral-400 mt-3 group-hover:text-white" }, [name])
    ])))
  ]);

  const footer = jd.footer({ className: "w-full bg-neutral-950 text-neutral-400 text-sm border-t border-neutral-900 pt-16 pb-8 px-6 md:px-16" }, [
    jd.div({ className: "w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-left" }, [
      jd.div({ className: "flex flex-col gap-4" }, [
        jd.img({ src: "/image/logo.png", alt: "Fillantis Logo", className: "h-16 w-auto object-contain self-start" }),
        jd.p({ className: "text-xs leading-relaxed font-medium text-neutral-500" }, ["La rete leader italiana nella dinstribuzione automobilistica digitale e sul territorio."])
      ]),
      jd.div({ className: "flex flex-col gap-3" }, [
        jd.h5({ className: "text-white font-bold uppercase tracking-wider text-xs border-l-2 border-red-600 pl-2" }, ["Link Rapidi"]),
        jd.ul({ className: "flex flex-col gap-2 text-xs font-medium" }, [
          jd.li({}, [
            jd.a({ 
              href: "/configuratore", className: "hover:text-white transition-colors",
              onclick: (e) => { e.preventDefault(); showLoader("inizializzazione configuratore..."); setTimeout(() => { hideLoader(); window.location.href = "/configuratore"; }, 1500); }
            }, ["Configura la tua auto"])
          ]),
        ])
      ]),
      jd.div({ className: "flex flex-col gap-3" }, [
        jd.h5({ className: "text-white font-bold uppercase tracking-wider text-xs border-l-2 border-red-600 pl-2" }, ["Orari Showroom"]),
        jd.ul({ className: "flex flex-col gap-2 text-xs font-medium text-neutral-400" }, [
          jd.li({ className: "flex justify-between" }, [jd.span({}, ["Lun - Ven:"]), jd.span({ className: "text-neutral-500" }, ["09:00 - 13:00 / 15:00 - 19:30"])]),
          jd.li({ className: "flex justify-between" }, [jd.span({}, ["Sabato:"]), jd.span({ className: "text-neutral-500" }, ["09:30 - 13:00 / 15:30 - 19:00"])]),
          jd.li({ className: "flex justify-between" }, [jd.span({}, ["Domenica:"]), jd.span({ className: "text-red-500" }, ["Chiuso"])])
        ])
      ]),
      jd.div({ className: "flex flex-col gap-3" }, [
        jd.h5({ className: "text-white font-bold uppercase tracking-wider text-xs border-l-2 border-red-600 pl-2" }, ["Contattaci"]),
        jd.ul({ className: "flex flex-col gap-2 text-xs font-medium" }, [
          jd.li({ className: "flex items-center gap-2" }, [jd.lucide("MapPin", { className: "size-4 text-neutral-500" }), jd.span({}, ["Via Monfalcone 19, 20132 Milano"])]),
          jd.li({ className: "flex items-center gap-2" }, [jd.lucide("Phone", { className: "size-4 text-neutral-500" }), jd.span({}, ["+39 02 1234567"])]),
          jd.li({ className: "flex items-center gap-2" }, [jd.lucide("Mail", { className: "size-4 text-neutral-500" }), jd.span({}, ["fillantis@example.com"])])
        ])
      ])
    ]),
    jd.div({ className: "w-full max-w-6xl mx-auto border-t border-neutral-900 pt-8 flex flex-col items-center gap-4 text-xs font-medium text-neutral-600" }, [
      jd.p({ className: "text-center text-neutral-500 italic max-w-2xl leading-relaxed" }, [
        "DISCLAMER: Questo sito web è un progetto a puro scopo didattico ed illustrativo. Non è in alcun modo a scopo di lucro. " +
        "Tutti i diritti, i loghi, i nomi e i marchi registrati citati (inclusi FIAT, LANCIA, ABARTH, ALFA ROMEO, BMW, AUDI, MERCEDES, VOLKSWAGEN) " +
        "rimangono di proprietà exclusività dei rispettivi marchi ufficiali e dei legittimi detentori dei diritti."
      ]),
      jd.div({ className: "w-full flex flex-col md:flex-row justify-between items-center gap-4 mt-2" }, [
        jd.p({}, [`© ${new Date().getFullYear()} Fillantis S.p.A. Progetto Esercitazione.`]),
        jd.div({ className: "flex gap-6" }, [
          jd.a({ className: "hover:text-neutral-400 transition-colors" }, ["Privacy Policy"]),
          jd.a({ className: "hover:text-neutral-400 transition-colors" }, ["Cookie Policy"]),
          jd.a({ className: "hover:text-neutral-400 transition-colors" }, ["Termini e Condizioni"])
        ])
      ])
    ])
  ]);

  pageContainer.appendChild(navbar);
  pageContainer.appendChild(heroCarousel);
  pageContainer.appendChild(onlinePurchaseSection);
  pageContainer.appendChild(aboutSection);
  pageContainer.appendChild(fleetSection);
  pageContainer.appendChild(brandsSection);
  pageContainer.appendChild(footer);

  if (window.carouselAutoPlay) clearInterval(window.carouselAutoPlay);
  
  window.carouselAutoPlay = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarouselDOM();
  }, 5000);

  return pageContainer;
}