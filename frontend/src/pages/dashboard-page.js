import { jd } from "../jd.config";

export function DashBoardPage() {
  return jd.div({ className: "min-h-screen bg-black text-white flex flex-col overflow-y-auto select-text" }, [
    
    jd.div({ className: "navbar bg-black shadow-sm h-35 shrink-0 px-4" }, [
      jd.div({ className: "navbar-start" }, [
        jd.div({ className: "dropdown" }, [
          jd.div(
            {
              tabIndex: 0,
              role: "button",
              className: "btn btn-ghost btn-circle text-white",
            },
            [jd.lucide("Menu", { className: "size-5" })]
          ),
          jd.ul(
            {
              tabIndex: -1,
              className: "menu menu-sm dropdown-content bg-neutral-900 rounded-box z-1 mt-3 w-52 p-2 shadow border border-neutral-800",
            },
            [
              jd.li({}, [jd.a({ className: "text-white" }, ["Homepage"])]),
              jd.li({}, [jd.a({ className: "text-white" }, ["Portfolio"])]),
              jd.li({}, [jd.a({ className: "text-white" }, ["About"])]),
            ]
          ),
        ]),
      ]),
      jd.div({ className: "navbar-center flex items-center justify-center" }, [
        jd.a({ className: "flex items-center justify-center h-full " }, [
          jd.img({ 
            src: "/logo.png", 
            alt: "Logo", 
            className: "h-50 w-auto object-contain" 
          })
        ]),
      ]),
      jd.div({ className: "navbar-end" }, [
        jd.button({ className: "btn btn-ghost btn-circle text-white" }, [
          jd.lucide("Search", { className: "size-5" }),
        ]),
        jd.button({ className: "btn btn-ghost btn-circle text-white" }, [
          jd.div({ className: "indicator" }, [
            jd.lucide("Info", { className: "size-5" }),
          ]),
        ]),
      ]),
    ]),


      //body 1
    jd.div(
      { 
        className: "relative w-full h-[calc(100vh-140px)] min-h-[600px] flex items-center bg-cover bg-right md:bg-center px-6 md:px-16 overflow-hidden",
        style: "background-image: url('/body.png');"
      }, 
      [
        jd.div({ className: "max-w-2xl flex flex-col gap-6 z-10 text-left" }, [
          
          jd.div({ className: "flex flex-col gap-2" }, [
            jd.h1({ className: "text-5xl md:text-7xl font-extrabold tracking-tight uppercase" }, ["LA TUA PROSSIMA AUTO E' UN NOSTRO IMPEGNO"]),
          ]),

          jd.div({ className: "w-12 h-1 bg-red-600 rounded-full" }),

          jd.div({ className: "flex flex-col gap-1 text-sm md:text-base text-neutral-300 font-medium max-w-lg" }, []),

          jd.div({ className: "flex flex-wrap gap-4 mt-4" }, [
            jd.button({ className: "px-8 py-3 bg-transparent border border-white text-white font-semibold uppercase tracking-wider text-sm hover:bg-white/10 transition-colors" }, ["Configura e ordina"])
          ])

        ]),

        jd.div({ className: "absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/40 to-transparent pt-10 pb-6 px-6 md:px-16" }, [
          jd.div({ className: "w-full border-t border-neutral-800 pt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left" }, [
            
            jd.div({ className: "flex flex-col md:flex-row items-center gap-3" }, [
              jd.lucide("ShieldCheck", { className: "size-6 text-white shrink-0" }),
              jd.div({ className: "flex flex-col text-xs font-semibold uppercase tracking-wider" }, [
                jd.span({}, ["Qualità"]),
                jd.span({ className: "text-neutral-400" }, ["Garantita"])
              ])
            ]),

            jd.div({ className: "flex flex-col md:flex-row items-center gap-3" }, [
              jd.lucide("Handshake", { className: "size-6 text-white shrink-0" }),
              jd.div({ className: "flex flex-col text-xs font-semibold uppercase tracking-wider" }, [
                jd.span({}, ["Affidabilità"]),
                jd.span({ className: "text-neutral-400" }, ["Totale"])
              ])
            ]),

            jd.div({ className: "flex flex-col md:flex-row items-center gap-3" }, [
              jd.lucide("Euro", { className: "size-6 text-white shrink-0" }),
              jd.div({ className: "flex flex-col text-xs font-semibold uppercase tracking-wider" }, [
                jd.span({}, ["Finanziamenti"]),
                jd.span({ className: "text-neutral-400" }, ["Su misura"])
              ])
            ]),

            jd.div({ className: "flex flex-col md:flex-row items-center gap-3" }, [
              jd.lucide("Headphones", { className: "size-6 text-white shrink-0" }),
              jd.div({ className: "flex flex-col text-xs font-semibold uppercase tracking-wider" }, [
                jd.span({}, ["Assistenza"]),
                jd.span({ className: "text-neutral-400" }, ["Dedicata"])
              ])
            ])

          ])
        ])
      ]
    ),


    // body 2
    jd.div(
      { 
        className: "relative w-full h-[calc(100vh-140px)] min-h-[600px] flex items-center justify-center bg-cover bg-center px-6 md:px-16 overflow-hidden",
        style: "background-image: url('/body-2.png');"
      }, 
      [
        jd.div({ className: "w-full max-w-5xl flex flex-col items-center justify-center gap-12 z-10 text-center" }, [
          
          jd.div({ className: "flex flex-col gap-2 max-w-3xl" ,
                  style: "background-image: url('/body-2.png');"

          }, [
            jd.p({ className: "text-neutral-400 text-sm font-semibold uppercase tracking-widest" }, ["Scegli la passione"]),
            jd.h2({ className: "text-3xl md:text-5xl font-extrabold tracking-tight uppercase" }, [
              "Acquista online la tua ",
              jd.span({ className: "text-white font-black" }, ["prossima auto"])
            ])
          ]),

          jd.div({ className: "w-full grid grid-cols-1 md:grid-cols-3 gap-12 pt-4" }, [
            
            jd.div({ className: "flex flex-col items-center gap-4 text-center max-w-sm mx-auto" }, [
              jd.lucide("CheckCircle2", { className: "size-10 text-white" }),
              jd.h3({ className: "text-lg font-bold uppercase tracking-wider" }, ["Comodo"]),
              jd.div({ className: "flex flex-col gap-1 text-sm text-neutral-400 font-medium leading-relaxed" }, [
                jd.p({}, ["Ordini online e termini l'acquisto in una"]),
                jd.p({}, ["delle 300 concessionarie Fillantis."]),
                jd.p({}, ["Dove vuoi e quando vuoi."])
              ])
            ]),

            jd.div({ className: "flex flex-col items-center gap-4 text-center max-w-sm mx-auto" }, [
              jd.lucide("Search", { className: "size-10 text-white" }),
              jd.h3({ className: "text-lg font-bold uppercase tracking-wider" }, ["Trasparente"]),
              jd.div({ className: "flex flex-col gap-1 text-sm text-neutral-400 font-medium leading-relaxed" }, [
                jd.p({}, ["Prezzi chiari dall'inizio alla fine."]),
                jd.p({}, ["E, se scegli l'acquisto con"]),
                jd.p({}, ["finanziamento, non paghi la caparra."])
              ])
            ]),

            jd.div({ className: "flex flex-col items-center gap-4 text-center max-w-sm mx-auto" }, [
              jd.lucide("RefreshCw", { className: "size-10 text-white" }),
              jd.h3({ className: "text-lg font-bold uppercase tracking-wider" }, ["Flessibile"]),
              jd.div({ className: "flex flex-col gap-1 text-sm text-neutral-400 font-medium leading-relaxed" }, [
                jd.p({}, ["Hai 14 giorni di prova con reso gratuito e"]),
                jd.p({}, ["nessuna penale in caso di disdetta."])
              ])
            ])

          ])

        ])
      ]
    ),

    // body 3
    jd.div({ className: "w-full bg-neutral-950 py-20 px-6 md:px-16 border-t border-neutral-900 flex flex-col items-center" ,
              style: "background-image: url('/body-2.png');"

    }, [
      jd.div({ className: "w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-start" }, [
        
        jd.div({ className: "flex flex-col gap-6 text-left" }, [
          jd.div({ className: "flex flex-col gap-2" }, [
            jd.p({ className: "text-red-500 text-xs font-bold uppercase tracking-widest" }, ["Chi Siamo"]),
            jd.h2({ className: "text-3xl md:text-4xl font-black uppercase tracking-tight" }, ["Mettiamo in moto il tuo futuro"])
          ]),
          jd.div({ className: "w-12 h-1 bg-red-600 rounded-full" }),
          jd.div({ className: "flex flex-col gap-4 text-base text-neutral-400 leading-relaxed font-medium" }, [
            jd.p({}, ["Fillantis è il punto di riferimento leader nella mobilità e nella distribuzione automobilistica. Uniamo l'esperienza di oltre 300 concessionarie partner per garantire un ecosistema sicuro, efficiente e completamente digitale."]),
            jd.p({}, ["Il nostro obiettivo è trasformare l'acquisto dell'auto in un'esperienza fluida ed entusiasmante, supportando il cliente in ogni singolo passo: dalla configurazione virtuale alla firma del contratto, fino alla consegna chiavi in mano."])
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
    ]),

    // sezione marchi 
    jd.div({ className: "w-full bg-black py-16 px-6 border-t border-neutral-900 flex flex-col items-center gap-10" }, [
      jd.div({ className: "text-center flex flex-col gap-1" }, [
        jd.p({ className: "text-red-500 text-xs font-bold uppercase tracking-widest" }, ["I nostri brand"]),
        jd.h2({ className: "text-2xl md:text-3xl font-bold uppercase tracking-tight" }, ["I marchi ufficiali disponibili"])
      ]),
      
      jd.div({ className: "w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8" }, [
        
        jd.div({ className: "flex flex-col items-center justify-center p-4 transition-all duration-300 group cursor-pointer" }, [
          jd.img({ src: "/fiat.png", alt: "FIAT", className: "h-16 w-16 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all" }),
          jd.span({ className: "text-xs font-bold tracking-wider text-neutral-400 mt-3 group-hover:text-white" }, ["FIAT"])
        ]),

        jd.div({ className: "flex flex-col items-center justify-center p-4 transition-all duration-300 group cursor-pointer" }, [
          jd.img({ src: "/lancia.png", alt: "LANCIA", className: "h-16 w-16 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all" }),
          jd.span({ className: "text-xs font-bold tracking-wider text-neutral-400 mt-3 group-hover:text-white" }, ["LANCIA"])
        ]),

        jd.div({ className: "flex flex-col items-center justify-center p-4 transition-all duration-300 group cursor-pointer" }, [
          jd.img({ src: "/abarth.png", alt: "ABARTH", className: "h-16 w-16 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all" }),
          jd.span({ className: "text-xs font-bold tracking-wider text-neutral-400 mt-3 group-hover:text-white" }, ["ABARTH"])
        ]),

        jd.div({ className: "flex flex-col items-center justify-center p-4 transition-all duration-300 group cursor-pointer" }, [
          jd.img({ src: "/alfaromeo.png", alt: "ALFA ROMEO", className: "h-16 w-16 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all" }),
          jd.span({ className: "text-xs font-bold tracking-wider text-neutral-400 mt-3 group-hover:text-white" }, ["ALFA ROMEO"])
        ]),

        jd.div({ className: "flex flex-col items-center justify-center p-4 transition-all duration-300 group cursor-pointer" }, [
          jd.img({ src: "/bmw.png", alt: "BMW", className: "h-16 w-16 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all" }),
          jd.span({ className: "text-xs font-bold tracking-wider text-neutral-400 mt-3 group-hover:text-white" }, ["BMW"])
        ]),

        jd.div({ className: "flex flex-col items-center justify-center p-4 transition-all duration-300 group cursor-pointer" }, [
          jd.img({ src: "/audi.png", alt: "AUDI", className: "h-16 w-16 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all" }),
          jd.span({ className: "text-xs font-bold tracking-wider text-neutral-400 mt-3 group-hover:text-white" }, ["AUDI"])
        ]),

        jd.div({ className: "flex flex-col items-center justify-center p-4 transition-all duration-300 group cursor-pointer" }, [
          jd.img({ src: "/mercedes.png", alt: "MERCEDES-BENZ", className: "h-16 w-16 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all" }),
          jd.span({ className: "text-xs font-bold tracking-wider text-neutral-400 mt-3 group-hover:text-white" }, ["MERCEDES"])
        ]),

        jd.div({ className: "flex flex-col items-center justify-center p-4 transition-all duration-300 group cursor-pointer" }, [
          jd.img({ src: "/volkswagen.png", alt: "VOLKSWAGEN", className: "h-16 w-16 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all" }),
          jd.span({ className: "text-xs font-bold tracking-wider text-neutral-400 mt-3 group-hover:text-white" }, ["VOLKSWAGEN"])
        ])

      ])
    ])

  ]);
}