import { jd } from "../jd.config";
import { Steps } from "../components/Steps";
import { hideLoader, showLoader } from "../components/loader";

let currentStep = 1;
let selectedBrand = "FIAT";
let selectedModel = "Grande Panda";
let selectedEngine = "";
let selectedColor = "";
let selectedWheel = "";
let selectedInterior = "";
let selectedDashboard = "";
// tracciamento dei pacchetti selezionati tramite array
let selectedPackages = [];

// mappatura delle regole di incompatibilita e di esclusione reciproca degli optional
const regoleIncompatibilita = [
  { a: "fi-p1", b: "fi-p2" },   // fiat: pack comfort esclude pack style
  { a: "al-i3", b: "al-p2" },   // alfa: interno alcantara esclude pack premium veloce
  { a: "au-p1", b: "au-p3" },   // audi: pack evolution esclude impianto sonos
  { a: "bm-p1", b: "bm-p3" },   // bmw: pack innovation esclude driving assistant pro
  { a: "me-p1", b: "me-p3" }    // mercedes: pack amg advanced esclude audio burmester
];

// corretto: rinominata la funzione in configuratorpage per allinearla all import del router
export function ConfiguratorPage() {
  const container = jd.div({ className: "h-screen bg-neutral-950 text-white flex flex-col overflow-hidden select-text" });

  const renderContent = () => {
    container.innerHTML = "";
    
    const modelsMap = {
      "FIAT": ["Grande Panda", "500", "Topolino"],
      "Alfa Romeo": ["Tonale", "Giulia", "Stelvio"],
      "Lancia": ["Ypsilon"],
      "Abarth": ["500e", "600e"],
      "Audi": ["A3", "A5", "Q5"],
      "BMW": ["Serie 1", "Serie 3", "X1"],
      "Volkswagen": ["Golf", "Polo", "Tiguan"],
      "Mercedes": ["Classe A", "Classe C", "GLA"]
    };

    const enginesMap = {
      "Grande Panda": [
        { id: "gp-b", name: "1.2 Turbo 100 CV - Manuale 6 marce - Trazione Anteriore", price: 18900 },
        { id: "gp-mhev", name: "1.2 Hybrid 100 CV - Automatico eDCT6 - Trazione Anteriore", price: 21400 },
        { id: "gp-bev", name: "Elettrica 113 CV - Automatico monomarce - Trazione Anteriore", price: 24900 }
      ],
      "500": [
        { id: "f500-mhev", name: "1.0 FireFly Hybrid 65 CV - Manuale 6 marce - Trazione Anteriore", price: 17700 },
        { id: "f500e-23", name: "Elettrica 95 CV (23.8 kWh) - Automatico monomarce - Trazione Anteriore", price: 28900 },
        { id: "f500e-42", name: "Elettrica 118 CV (42 kWh) - Automatico monomarce - Trazione Anteriore", price: 32500 }
      ],
      "Topolino": [
        { id: "topo-bev", name: "Elettrica 8 CV (5.4 kWh) - Automatico monomarce - Trazione Posteriore", price: 9890 }
      ],
      "Tonale": [
        { id: "ton-mhev-130", name: "1.5 Hybrid 130 CV - Automatico TCT7 - Trazione Anteriore", price: 39300 },
        { id: "ton-mhev-160", name: "1.5 Hybrid VGT 160 CV - Automatico TCT7 - Trazione Anteriore", price: 41500 },
        { id: "ton-ds", name: "1.6 JTDm Diesel 130 CV - Automatico TCT7 - Trazione Anteriore", price: 40800 },
        { id: "ton-phev", name: "1.3 Plug-in Hybrid Q4 280 CV - Automatico AT6 - Trazione Integrale Q4", price: 51700 }
      ],
      "Giulia": [
        { id: "giu-b-280", name: "2.0 Turbo Benzina 280 CV - Automatico AT8 - Trazione Integrale Q4", price: 49500 },
        { id: "giu-ds-160", name: "2.2 Turbo Diesel 160 CV - Automatico AT8 - Trazione Posteriore", price: 47200 },
        { id: "giu-ds-210", name: "2.2 Turbo Diesel 210 CV - Automatico AT8 - Trazione Integrale Q4", price: 51200 },
        { id: "giu-q", name: "2.9 V6 Biturbo Quadrifoglio 520 CV - Automatico AT8 - Trazione Posteriore", price: 95500 }
      ],
      "Stelvio": [
        { id: "stel-b-280", name: "2.0 Turbo Benzina 280 CV - Automatico AT8 - Trazione Integrale Q4", price: 60500 },
        { id: "stel-ds-160", name: "2.2 Turbo Diesel 160 CV - Automatico AT8 - Trazione Posteriore", price: 56500 },
        { id: "stel-ds-190", name: "2.2 Turbo Diesel 190 CV - Automatico AT8 - Trazione Integrale Q4", price: 58800 },
        { id: "stel-ds-210", name: "2.2 Turbo Diesel 210 CV - Automatico AT8 - Trazione Integrale Q4", price: 61000 },
        { id: "stel-q", name: "2.9 V6 Biturbo Quadrifoglio 520 CV - Automatico AT8 - Trazione Integrale Q4", price: 104500 }
      ],
      "Ypsilon": [
        { id: "yps-mhev", name: "1.2 Hybrid 100 CV - Automatico eDCT6 - Trazione Anteriore", price: 24500 },
        { id: "yps-bev", name: "Elettrica BEV 156 CV - Automatico monomarce - Trazione Anteriore", price: 34900 },
        { id: "yps-hf-240", name: "Elettrica HF 240 CV - Automatico monomarce - Trazione Anteriore", price: 41000 },
        { id: "yps-hf-280", name: "Elettrica HF 280 CV - Automatico monomarce - Trazione Anteriore", price: 43500 }
      ],
      "500e": [
        { id: "ab-500e", name: "Elettrica BEV 155 CV - Automatico monomarce - Trazione Anteriore", price: 37900 }
      ],
      "600e": [
        { id: "ab-600e-240", name: "Elettrica BEV 240 CV - Automatico monomarce - Trazione Anteriore", price: 41900 },
        { id: "ab-600e-280", name: "Elettrica BEV 280 CV - Automatico monomarce - Trazione Anteriore", price: 44900 }
      ],
      "A3": [
        { id: "a3-30tfsi", name: "30 TFSI Benzina 116 CV - Manuale 6 marce - Trazione Anteriore", price: 31200 },
        { id: "a3-35tfsi", name: "35 TFSI Benzina 150 CV - Manuale 6 marce - Trazione Anteriore", price: 33500 },
        { id: "a3-30mhev", name: "30 TFSI Mild Hybrid 116 CV - Automatico S tronic - Trazione Anteriore", price: 32900 },
        { id: "a3-35mhev", name: "35 TFSI Mild Hybrid 150 CV - Automatico S tronic - Trazione Anteriore", price: 35400 },
        { id: "a3-30tdi", name: "30 TDI Diesel 116 CV - Manuale 6 marce - Trazione Anteriore", price: 34100 },
        { id: "a3-35tdi", name: "35 TDI Diesel 150 CV - Automatico S tronic - Trazione Anteriore", price: 36800 },
        { id: "a3-40phev", name: "40 TFSI e Plug-in 204 CV - Automatico S tronic - Trazione Anteriore", price: 43500 },
        { id: "a3-45phev", name: "45 TFSI e Plug-in 272 CV - Automatico S tronic - Trazione Anteriore", price: 47200 },
        { id: "a3-s3", name: "S3 2.0 TFSI 333 CV - Automatico S tronic - Trazione Integrale quattro", price: 55000 },
        { id: "a3-rs3", name: "RS3 2.5 TFSI 400 CV - Automatico S tronic - Trazione Integrale quattro", price: 68000 }
      ],
      "A5": [
        { id: "a5-tfsi-150", name: "2.0 TFSI MHEV 150 CV - Automatico S tronic - Trazione Anteriore", price: 47500 },
        { id: "a5-tfsi-204", name: "2.0 TFSI MHEV 204 CV - Automatico S tronic - Trazione Anteriore", price: 52000 },
        { id: "a5-tdi-204", name: "2.0 TDI MHEV 204 CV - Automatico S tronic - Trazione Anteriore", price: 55500 },
        { id: "a5-s5", name: "S5 3.0 V6 TFSI 367 CV - Automatico S tronic - Trazione Integrale quattro", price: 81200 }
      ],
      "Q5": [
        { id: "q5-tfsi", name: "2.0 TFSI MHEV 204 CV - Automatico S tronic - Trazione Integrale quattro", price: 61500 },
        { id: "q5-tdi", name: "2.0 TDI MHEV 204 CV - Automatico S tronic - Trazione Integrale quattro", price: 63800 },
        { id: "q5-phev-299", name: "2.0 TFSI e Plug-in 299 CV - Automatico S tronic - Trazione Integrale quattro", price: 72000 },
        { id: "q5-phev-367", name: "2.0 TFSI e Plug-in 367 CV - Automatico S tronic - Trazione Integrale quattro", price: 79500 },
        { id: "q5-sq5", name: "SQ5 3.0 V6 TDI 341 CV - Automatico tiptronic - Trazione Integrale quattro", price: 92000 }
      ],
      "Serie 1": [
        { id: "bmw1-120", name: "120 Mild Hybrid 170 CV - Automatico Steptronic 7 marce - Trazione Anteriore", price: 34200 },
        { id: "bmw1-118d", name: "118d Diesel 150 CV - Manuale 6 marce - Trazione Anteriore", price: 37900 },
        { id: "bmw1-120d", name: "120d Mild Hybrid 163 CV - Automatico Steptronic 7 marce - Trazione Anteriore", price: 39500 },
        { id: "bmw1-m135", name: "M135 xDrive 300 CV - Automatico Steptronic 7 marce - Trazione Integrale xDrive", price: 56500 }
      ],
      "Serie 3": [
        { id: "bmw3-320i", name: "320i Mild Hybrid 184 CV - Automatico Steptronic 8 marce - Trazione Posteriore", price: 46200 },
        { id: "bmw3-330i", name: "330i Mild Hybrid 245 CV - Automatico Steptronic 8 marce - Trazione Posteriore", price: 52800 },
        { id: "bmw3-m340i", name: "M340i Mild Hybrid 374 CV - Automatico Steptronic 8 marce - Trazione Integrale xDrive", price: 74500 },
        { id: "bmw3-318d", name: "318d Mild Hybrid 150 CV - Automatico Steptronic 8 marce - Trazione Posteriore", price: 47500 },
        { id: "bmw3-320d", name: "320d Mild Hybrid 190 CV - Automatico Steptronic 8 marce - Trazione Posteriore", price: 51100 },
        { id: "bmw3-330d", name: "330d Mild Hybrid 286 CV - Automatico Steptronic 8 marce - Trazione Posteriore", price: 61200 },
        { id: "bmw3-m340d", name: "M340d Mild Hybrid 340 CV - Automatico Steptronic 8 marce - Trazione Integrale xDrive", price: 77400 },
        { id: "bmw3-320e", name: "320e Plug-in Hybrid 204 CV - Automatico Steptronic 8 marce - Trazione Posteriore", price: 54300 },
        { id: "bmw3-330e", name: "330e Plug-in Hybrid 292 CV - Automatico Steptronic 8 marce - Trazione Posteriore", price: 59800 },
        { id: "bmw3-m3", name: "M3 Turbo 480 CV - Manuale 6 marce - Trazione Posteriore", price: 102000 },
        { id: "bmw3-m3c", name: "M3 Competition 530 CV - Automatico M Steptronic 8 marce - Trazione Integrale xDrive", price: 111500 }
      ],
      "X1": [
        { id: "bmwx1-18i", name: "sDrive18i Benzina 136 CV - Automatico Steptronic 7 marce - Trazione Anteriore", price: 41800 },
        { id: "bmwx1-20i", name: "sDrive20i Mild Hybrid 170 CV - Automatico Steptronic 7 marce - Trazione Anteriore", price: 44300 },
        { id: "bmwx1-23i", name: "xDrive23i Mild Hybrid 218 CV - Automatico Steptronic 7 marce - Trazione Integrale xDrive", price: 50200 },
        { id: "bmwx1-18d", name: "sDrive18d Diesel 150 CV - Automatico Steptronic 7 marce - Trazione Anteriore", price: 43900 },
        { id: "bmwx1-20d", name: "xDrive20d Mild Hybrid 163 CV - Automatico Steptronic 7 marce - Trazione Integrale xDrive", price: 48500 },
        { id: "bmwx1-23d", name: "xDrive23d Mild Hybrid 211 CV - Automatico Steptronic 7 marce - Trazione Integrale xDrive", price: 53400 },
        { id: "bmwx1-25e", name: "xDrive25e Plug-in 245 CV - Automatico Steptronic 7 marce - Trazione Integrale xDrive", price: 52100 },
        { id: "bmwx1-30e", name: "xDrive30e Plug-in 326 CV - Automatico Steptronic 7 marce - Trazione Integrale xDrive", price: 56300 },
        { id: "bmwx1-m35i", name: "M35i Benzina 300 CV - Automatico Steptronic 7 marce - Trazione Integrale xDrive", price: 64900 }
      ],
      "Golf": [
        { id: "vwg-116", name: "1.5 TSI Benzina 116 CV - Manuale 6 marce - Trazione Anteriore", price: 29400 },
        { id: "vwg-150", name: "1.5 TSI Benzina 150 CV - Manuale 6 marce - Trazione Anteriore", price: 31800 },
        { id: "vwg-e116", name: "1.5 eTSI Mild Hybrid 116 CV - Automatico DSG 7 marce - Trazione Anteriore", price: 31900 },
        { id: "vwg-e150", name: "1.5 eTSI Mild Hybrid 150 CV - Automatico DSG 7 marce - Trazione Anteriore", price: 34200 },
        { id: "vwg-d116", name: "2.0 TDI Diesel 116 CV - Manuale 6 marce - Trazione Anteriore", price: 33200 },
        { id: "vwg-d150", name: "2.0 TDI Diesel 150 CV - Automatico DSG 7 marce - Trazione Anteriore", price: 36500 },
        { id: "vwg-phev-204", name: "1.5 TSI eHybrid Plug-in 204 CV - Automatico DSG 6 marce - Trazione Anteriore", price: 42800 },
        { id: "vwg-gte", name: "1.5 TSI GTE Plug-in 272 CV - Automatico DSG 6 marce - Trazione Anteriore", price: 48500 },
        { id: "vwg-gti", name: "2.0 TSI GTI 265 CV - Automatico DSG 7 marce - Trazione Anteriore", price: 44800 },
        { id: "vwg-r", name: "Golf R 2.0 TSI 333 CV - Automatico DSG 7 marce - Trazione Integrale 4Motion", price: 56000 }
      ],
      "Polo": [
        { id: "vwp-mpi", name: "1.0 MPI Benzina 80 CV - Manuale 5 marce - Trazione Anteriore", price: 21500 },
        { id: "vwp-tsi-95", name: "1.0 TSI Turbo 95 CV - Manuale 5 marce - Trazione Anteriore", price: 23100 },
        { id: "vwp-tsi-116", name: "1.0 TSI Turbo 116 CV - Automatico DSG 7 marce - Trazione Anteriore", price: 25400 },
        { id: "vwp-gti", name: "GTI 2.0 TSI 207 CV - Automatico DSG 7 marce - Trazione Anteriore", price: 33900 }
      ],
      "Tiguan": [
        { id: "vwt-e130", name: "1.5 eTSI Mild Hybrid 130 CV - Automatico DSG 7 marce - Trazione Anteriore", price: 40200 },
        { id: "vwt-e150", name: "1.5 eTSI Mild Hybrid 150 CV - Automatico DSG 7 marce - Trazione Anteriore", price: 42100 },
        { id: "vwt-d150", name: "2.0 TDI Diesel 150 CV - Automatico DSG 7 marce - Trazione Anteriore", price: 44900 },
        { id: "vwt-d193", name: "2.0 TDI Diesel 193 CV - Automatico DSG 7 marce - Trazione Integrale 4Motion", price: 49800 },
        { id: "vwt-phev-204", name: "1.5 TSI eHybrid Plug-in 204 CV - Automatico DSG 6 marce - Trazione Anteriore", price: 50500 },
        { id: "vwt-phev-272", name: "1.5 TSI eHybrid Plug-in 272 CV - Automatico DSG 6 marce - Trazione Anteriore", price: 54900 }
      ],
      "Classe A": [
        { id: "mer-a180", name: "A 180 Mild Hybrid 136 CV - Automatico 7G-DCT - Trazione Anteriore", price: 36200 },
        { id: "mer-a200", name: "A 200 Mild Hybrid 163 CV - Automatico 7G-DCT - Trazione Anteriore", price: 39500 },
        { id: "mer-a250", name: "A 250 Mild Hybrid 224 CV - Automatico 8G-DCT - Trazione Integrale 4MATIC", price: 47800 },
        { id: "mer-a180d", name: "A 180 d Diesel 116 CV - Automatico 8G-DCT - Trazione Anteriore", price: 37100 },
        { id: "mer-a200d", name: "A 200 d Diesel 150 CV - Automatico 8G-DCT - Trazione Anteriore", price: 40400 },
        { id: "mer-a220d", name: "A 220 d Diesel 190 CV - Automatico 8G-DCT - Trazione Integrale 4MATIC", price: 45200 },
        { id: "mer-a250e", name: "A 250 e Plug-in Hybrid 218 CV - Automatico 8G-DCT - Trazione Anteriore", price: 48100 },
        { id: "mer-a35", name: "AMG A 35 Mild Hybrid 306 CV - Automatico AMG SPEEDSHIFT 8G - Trazione Integrale 4MATIC", price: 55900 },
        { id: "mer-a45", name: "AMG A 45 S 421 CV - Automatico AMG SPEEDSHIFT 8G - Trazione Integrale 4MATIC+", price: 70200 }
      ],
      "Classe C": [
        { id: "mer-c180", name: "C 180 Mild Hybrid 170 CV - Automatico 9G-TRONIC - Trazione Posteriore", price: 52800 },
        { id: "mer-c200", name: "C 200 Mild Hybrid 204 CV - Automatico 9G-TRONIC - Trazione Posteriore", price: 56400 },
        { id: "mer-c300", name: "C 300 Mild Hybrid 258 CV - Automatico 9G-TRONIC - Trazione Posteriore", price: 63200 },
        { id: "mer-c200d", name: "C 200 d Mild Hybrid 163 CV - Automatico 9G-TRONIC - Trazione Posteriore", price: 54900 },
        { id: "mer-c220d", name: "C 220 d Mild Hybrid 197 CV - Automatico 9G-TRONIC - Trazione Posteriore", price: 57800 },
        { id: "mer-c300d", name: "C 300 d Mild Hybrid 265 CV - Automatico 9G-TRONIC - Trazione Posteriore", price: 65100 },
        { id: "mer-c300e", name: "C 300 e Plug-in 313 CV - Automatico 9G-TRONIC - Trazione Posteriore", price: 67500 },
        { id: "mer-c300de", name: "C 300 de Plug-in Diesel 313 CV - Automatico 9G-TRONIC - Trazione Posteriore", price: 69200 },
        { id: "mer-c43", name: "AMG C 43 Mild Hybrid 408 CV - Automatico AMG SPEEDSHIFT 9G - Trazione Integrale 4MATIC", price: 84500 },
        { id: "mer-c63", name: "AMG C 63 S E-Performance 680 CV - Automatico AMG SPEEDSHIFT 9G - Trazione Integrale 4MATIC+", price: 122000 }
      ],
      "GLA": [
        { id: "mer-gla180", name: "GLA 180 Mild Hybrid 136 CV - Automatico 7G-DCT - Trazione Anteriore", price: 43900 },
        { id: "mer-gla200", name: "GLA 200 Mild Hybrid 163 CV - Automatico 7G-DCT - Trazione Anteriore", price: 46500 },
        { id: "mer-gla250", name: "GLA 250 Mild Hybrid 224 CV - Automatico 8G-DCT - Trazione Integrale 4MATIC", price: 54200 },
        { id: "mer-gla180d", name: "GLA 180 d Diesel 116 CV - Automatico 8G-DCT - Trazione Anteriore", price: 44800 },
        { id: "mer-gla200d", name: "GLA 200 d Diesel 150 CV - Automatico 8G-DCT - Trazione Anteriore", price: 47500 },
        { id: "mer-gla220d", name: "GLA 220 d Diesel 190 CV - Automatico 8G-DCT - Trazione Integrale 4MATIC", price: 52100 },
        { id: "mer-gla250e", name: "GLA 250 e Plug-in Hybrid 218 CV - Automatico 8G-DCT - Trazione Anteriore", price: 54900 },
        { id: "mer-gla35", name: "AMG GLA 35 Mild Hybrid 306 CV - Automatico AMG SPEEDSHIFT 8G - Trazione Integrale 4MATIC", price: 62500 },
        { id: "mer-gla45", name: "AMG GLA 45 S 421 CV - Automatico AMG SPEEDSHIFT 8G - Trazione Integrale 4MATIC+", price: 81000 }
      ]
    };

    const brandColorsMap = {
      "FIAT": [
        { id: "fi-c1", name: "Arancio Sicilia (Pastello)", colorClass: "bg-orange-600", price: 0 },
        { id: "fi-c2", name: "Bianco Gelato", colorClass: "bg-neutral-100", price: 550 },
        { id: "fi-c3", name: "Blu Italia Metallizzato", colorClass: "bg-blue-700", price: 700 },
        { id: "fi-c4", name: "Verde Alberese", colorClass: "bg-emerald-800", price: 700 }
      ],
      "Alfa Romeo": [
        { id: "al-c1", name: "Rosso Alfa (Pastello)", colorClass: "bg-red-600", price: 0 },
        { id: "al-c2", name: "Nero Vulcano Metallizzato", colorClass: "bg-neutral-900", price: 1100 },
        { id: "al-c3", name: "Blu Misano", colorClass: "bg-blue-600", price: 1200 },
        { id: "al-c4", name: "Rosso Competizione Tri-strato", colorClass: "bg-red-800", price: 2500 }
      ],
      "Lancia": [
        { id: "la-c1", name: "Grigio Granito", colorClass: "bg-stone-500", price: 0 },
        { id: "la-c2", name: "Verde Giada Metallizzato", colorClass: "bg-teal-900", price: 850 },
        { id: "la-c3", name: "Blu Lancia", colorClass: "bg-sky-950", price: 850 },
        { id: "la-c4", name: "Bicolore Nero Lucido / Oro", colorClass: "bg-amber-600", price: 1650 }
      ],
      "Abarth": [
        { id: "ab-c1", name: "Verde Acido Scorpion", colorClass: "bg-lime-400", price: 0 },
        { id: "ab-c2", name: "Veleno Blue", colorClass: "bg-cyan-600", price: 750 },
        { id: "ab-c3", name: "Nero Antracite", colorClass: "bg-zinc-800", price: 750 },
        { id: "ab-c4", name: "Grigio Track Opaco", colorClass: "bg-zinc-500", price: 1500 }
      ],
      "Audi": [
        { id: "au-c1", name: "Bianco Ibis (Pastello)", colorClass: "bg-white", price: 0 },
        { id: "au-c2", name: "Grigio Chronos Metallizzato", colorClass: "bg-neutral-400", price: 930 },
        { id: "au-c3", name: "Blu Navarra Metallizzato", colorClass: "bg-blue-900", price: 930 },
        { id: "au-c4", name: "Grigio Daytona Effetto Perla", colorClass: "bg-stone-600", price: 1250 }
      ],
      "BMW": [
        { id: "bm-c1", name: "Alpine White (Pastello)", colorClass: "bg-slate-50", price: 0 },
        { id: "bm-c2", name: "M Portimao Blue Metallizzato", colorClass: "bg-blue-800", price: 1100 },
        { id: "bm-c3", name: "Black Sapphire Metallizzato", colorClass: "bg-neutral-950", price: 1100 },
        { id: "bm-c4", name: "Dravit Grey Metallic (Individual)", colorClass: "bg-gray-700", price: 2350 }
      ],
      "Volkswagen": [
        { id: "vw-c1", name: "Grigio Urano", colorClass: "bg-neutral-500", price: 0 },
        { id: "vw-c2", name: "Pure White", colorClass: "bg-zinc-100", price: 420 },
        { id: "vw-c3", name: "Lapiz Blue Metallizzato (GTI/R)", colorClass: "bg-blue-700", price: 1050 },
        { id: "vw-c4", name: "Nero Deep Perla", colorClass: "bg-stone-950", price: 790 }
      ],
      "Mercedes": [
        { id: "me-c1", name: "Nero Notte (Pastello)", colorClass: "bg-black", price: 0 },
        { id: "me-c2", name: "Argento Polare Metallizzato", colorClass: "bg-zinc-300", price: 980 },
        { id: "me-c3", name: "Blu Cavansite Metallizzato", colorClass: "bg-blue-950", price: 980 },
        { id: "me-c4", name: "Grigio Montagna Magno MANUFAKTUR", colorClass: "bg-zinc-600", price: 2700 }
      ]
    };

    const brandWheelsMap = {
      "FIAT": [
        { id: "fi-w1", size: 16, title: 'Cerchi in acciaio con copriruota da 16"', price: 0 },
        { id: "fi-w2", size: 17, title: 'Cerchi in lega da 17" Diamond Cut', price: 650 }
      ],
      "Alfa Romeo": [
        { id: "al-w1", size: 18, title: 'Cerchi in lega da 18" a turbina', price: 0 },
        { id: "al-w2", size: 19, title: 'Cerchi da 19" Design Classico a fori', price: 1300 },
        { id: "al-w3", size: 20, title: 'Cerchi da 20" Teledial bruniti', price: 2200 }
      ],
      "Lancia": [
        { id: "la-w1", size: 16, title: 'Cerchi in lega da 16" Aero design', price: 0 },
        { id: "la-w2", size: 17, title: 'Cerchi in lega da 17" Y-Design diamantati', price: 800 }
      ],
      "Abarth": [
        { id: "ab-w1", size: 17, title: 'Cerchi in lega da 17" Racing style', price: 0 },
        { id: "ab-w2", size: 18, title: 'Cerchi da 18" Diamond tagliati al laser', price: 950 }
      ],
      "Audi": [
        { id: "au-w1", size: 17, title: 'Cerchi in lega da 17" a 5 razze', price: 0 },
        { id: "au-w2", size: 18, title: 'Cerchi da 18" Audi Sport trapezoidali', price: 1150 },
        { id: "au-w3", size: 19, title: 'Cerchi da 19" Audi Sport a 5 razze a Y', price: 2050 }
      ],
      "BMW": [
        { id: "bm-w1", size: 17, title: 'Cerchi in lega da 17" V-Spoke', price: 0 },
        { id: "bm-w2", size: 18, title: 'Cerchi in lega da 18" M Double-Spoke', price: 1250 },
        { id: "bm-w3", size: 19, title: 'Cerchi in lega da 19" M aerodynamic bicolore', price: 2150 }
      ],
      "Volkswagen": [
        { id: "vw-w1", size: 16, title: 'Cerchi in lega da 16" Norfolk', price: 0 },
        { id: "vw-w2", size: 17, title: 'Cerchi in lega da 17" Ventura', price: 750 },
        { id: "vw-w3", size: 19, title: 'Cerchi in lega da 19" Adelaide (GTI/R)', price: 1650 }
      ],
      "Mercedes": [
        { id: "me-w1", size: 17, title: 'Cerchi in lega da 17" a 5 doppie razze', price: 0 },
        { id: "me-w2", size: 18, title: 'Cerchi da 18" AMG a 5 razze ottimizzati aero', price: 1200 },
        { id: "me-w3", size: 19, title: 'Cerchi in lega AMG da 19" multirazze neri', price: 1950 }
      ]
    };

    const brandInteriorsMap = {
      "FIAT": [
        { id: "fi-i1", name: "Tessuto Seaqual Yarn Grigio", colorClass: "bg-slate-700", price: 0 },
        { id: "fi-i2", name: "Tessuto monogramma Fiat Avorio", colorClass: "bg-stone-200", price: 450 }
      ],
      "Alfa Romeo": [
        { id: "al-i1", name: "Tessuto Tecnico Tex Alfa Nero", colorClass: "bg-neutral-800", price: 0 },
        { id: "al-i2", name: "Pelle Naturale Traforata Nera", colorClass: "bg-neutral-900", price: 1600 },
        { id: "al-i3", name: "Pelle Alcantara Sportiva con cuciture rosse", colorClass: "bg-stone-800", price: 2100 }
      ],
      "Lancia": [
        { id: "la-i1", name: "Velluto Blu Lancia a coste", colorClass: "bg-blue-950", price: 0 },
        { id: "la-i2", name: "Panna Cassina in filato riciclato", colorClass: "bg-orange-100", price: 1200 }
      ],
      "Abarth": [
        { id: "ab-i1", name: "Tessuto Tecnico Abarth Sport", colorClass: "bg-neutral-800", price: 0 },
        { id: "ab-i2", name: "Alcantara Racing Premium Scorpione", colorClass: "bg-zinc-800", price: 1400 }
      ],
      "Audi": [
        { id: "au-i1", name: "Tessuto Index Nero S Line", colorClass: "bg-neutral-700", price: 0 },
        { id: "au-i2", name: "Pelle Milano Grigio Roccia", colorClass: "bg-gray-400", price: 1850 },
        { id: "au-i3", name: "Pelle nappa fine con trapuntatura a nido d ape", colorClass: "bg-neutral-900", price: 2600 }
      ],
      "BMW": [
        { id: "bm-i1", name: "Tessuto Veganza Antracite", colorClass: "bg-zinc-700", price: 0 },
        { id: "bm-i2", name: "Pelle Vernasca Cognac", colorClass: "bg-amber-800", price: 1950 },
        { id: "bm-i3", name: "Pelle Merino Bicolore BMW Individual", colorClass: "bg-stone-600", price: 3200 }
      ],
      "Volkswagen": [
        { id: "vw-i1", name: "Tessuto Wave Nero Titanio", colorClass: "bg-neutral-800", price: 0 },
        { id: "vw-i2", name: "Tessuto Microfleece ArtVelours", colorClass: "bg-stone-700", price: 680 },
        { id: "vw-i3", name: "Pelle Vienna traforata con sedili ventilati", colorClass: "bg-zinc-900", price: 2250 }
      ],
      "Mercedes": [
        { id: "me-i1", name: "Pelle sintetica ARTICO / Tessuto Nero", colorClass: "bg-neutral-800", price: 0 },
        { id: "me-i2", name: "Pelle sintetica ARTICO Grigio Sage", colorClass: "bg-zinc-500", price: 700 },
        { id: "me-i3", name: "Pelle Nappa MANUFAKTUR bicolore Rosso / Nero", colorClass: "bg-red-950", price: 2900 }
      ]
    };

    const brandDashboardsMap = {
      "FIAT": [
        { id: "fi-d1", title: "Plancia Polimerica Nera Goffrata", price: 0 },
        { id: "fi-d2", title: "Fascia Plancia Bianco Opaco", price: 250 }
      ],
      "Alfa Romeo": [
        { id: "al-d1", title: "Inserti plancia in Alluminio fluido", price: 0 },
        { id: "al-d2", title: "Plancia in Carbonio opaco retroilluminata", price: 950 }
      ],
      "Lancia": [
        { id: "la-d1", title: "Finitura effect cannettato scuro", price: 0 },
        { id: "la-d2", title: "Tavolino Cassina in bio-resina azzurra", price: 500 }
      ],
      "Abarth": [
        { id: "ab-d1", title: "Fascia plancia Nero Titanio", price: 0 },
        { id: "ab-d2", title: "Plancia rivestita in Alcantara nera", price: 600 }
      ],
      "Audi": [
        { id: "au-d1", title: "Inserti vernice effetto seta grigio platino", price: 0 },
        { id: "au-d2", title: "Inserti in Alluminio Spectrum brunito", price: 400 },
        { id: "au-d3", title: "Modanature in Carbonio Atlas opaco", price: 1100 }
      ],
      "BMW": [
        { id: "bm-d1", title: "Modanature interne Quartz Silver opaco", price: 0 },
        { id: "bm-d2", title: "Modanature in Legno pregiato Eucalyptus", price: 650 },
        { id: "bm-d3", title: "Modanature interne M in fibra di carbonio", price: 1200 }
      ],
      "Volkswagen": [
        { id: "vw-d1", title: "Inserti decorativi Nature Cross Matt", price: 0 },
        { id: "vw-d2", title: "Inserti luminosi artieffect a 30 colori", price: 350 }
      ],
      "Mercedes": [
        { id: "me-d1", title: "Inserti look carbonio scuro", price: 0 },
        { id: "me-d2", title: "Inserti in Legno di tiglio nero a poro aperto", price: 550 },
        { id: "me-d3", title: "Plancia rivestita in pelle sintetica ARTICO", price: 800 }
      ]
    };

    const brandPackagesMap = {
      "FIAT": [
        { id: "fi-p1", title: "Pack Comfort & Tech", desc: "climatizzatore automatico sensori di parcheggio e infotainment da 10 pollici", price: 1200 },
        { id: "fi-p2", title: "Pack Style", desc: "vetri oscurati fari full led e dettagli esterni cromati", price: 800 }
      ],
      "Alfa Romeo": [
        { id: "al-p1", title: "Pack Techno", desc: "guida autonoma di livello 2 retrocamera 360 e blind spot monitoring", price: 1800 },
        { id: "al-p2", title: "Pack Premium Veloce", desc: "impianto audio harman kardon sedili anteriori elettrici ventilati con memoria", price: 2400 }
      ],
      "Lancia": [
        { id: "la-p1", title: "Pack Tech Cassina", desc: "display s.a.l.a. integrato carica wireless e cruise control adattivo", price: 1500 },
        { id: "la-p2", title: "Pack Lounge", desc: "illuminazione d atmosfera fari intelligenti e tetto panoramico", price: 1100 }
      ],
      "Abarth": [
        { id: "ab-p1", title: "Pack Turismo", desc: "generatore di sound abarth ammortizzatori koni fsd e cerchi dedicati", price: 2000 },
        { id: "ab-p2", title: "Pack Scorpion Track", desc: "telemetria integrata sedili sabelt racing e dettagli esterni opachi", price: 2500 }
      ],
      "Audi": [
        { id: "au-p1", title: "Pacchetto Evolution", desc: "proiettori led matrix audi virtual cockpit plus e pacchetto luci interne", price: 1950 },
        { id: "au-p2", title: "Pacchetto Assistenza Tour", desc: "adaptive cruise assist riconoscimento segnali e sistema anticollisione", price: 1450 },
        { id: "au-p3", title: "Sistema Audio Sonos Premium 3D", desc: "amplificatore a 15 canali 16 altoparlanti e potenza totale 680w", price: 890 }
      ],
      "BMW": [
        { id: "bm-p1", title: "Pacchetto Innovation", desc: "bmw live cockpit professional head up display e fari adaptive led", price: 3300 },
        { id: "bm-p2", title: "Pacchetto Travel", desc: "tetto panoramico scorrevole reti ferma bagagli e sedili posteriori regolabili", price: 1650 },
        { id: "bm-p3", title: "Driving Assistant Professional", desc: "assistente attivo cambio corsia sterzata assistita e stop and go", price: 1900 }
      ],
      "Volkswagen": [
        { id: "vw-p1", title: "Tech Pack", desc: "fari iq.light led matrix navigatore discover media e keyless advanced", price: 1600 },
        { id: "vw-p2", title: "Driving Assistance Pack Plus", desc: "travel assist lane assist e park assist con frenata d emergenza", price: 1050 },
        { id: "vw-p3", title: "Tetto Panoramico Apribile", desc: "tetto in vetro scorrevole a comando elettrico con tendina parasole", price: 1300 }
      ],
      "Mercedes": [
        { id: "me-p1", title: "Pacchetto AMG Advanced Plus", desc: "fari led high performance display centrale da 10 pollici e ricarica wireless", price: 2850 },
        { id: "me-p2", title: "Pacchetto Assistenza alla Guida", desc: "sistema di assistenza attivo alla regolazione della distanza distronic", price: 1700 },
        { id: "me-p3", title: "Impianto Audio Surround Burmester", desc: "12 altoparlanti ad alte prestazioni e potenza complessiva di 590w", price: 1050 }
      ]
    };

    const currentModels = modelsMap[selectedBrand] || [];
    const availableEngines = enginesMap[selectedModel] || [];

    if (!availableEngines.some(e => e.id === selectedEngine) && availableEngines.length > 0) {
      selectedEngine = availableEngines[0].id;
    }
    const currentEngineObj = availableEngines.find(e => e.id === selectedEngine) || availableEngines[0];
    const basePrice = currentEngineObj ? currentEngineObj.price : 0;

    const availableColors = brandColorsMap[selectedBrand] || brandColorsMap["FIAT"];
    const availableWheels = brandWheelsMap[selectedBrand] || brandWheelsMap["FIAT"];
    const availableInteriors = brandInteriorsMap[selectedBrand] || brandInteriorsMap["FIAT"];
    const availableDashboards = brandDashboardsMap[selectedBrand] || brandDashboardsMap["FIAT"];
    const availablePackages = brandPackagesMap[selectedBrand] || brandPackagesMap["FIAT"];

    if (!availableColors.some(c => c.id === selectedColor)) selectedColor = availableColors[0].id;
    if (!availableWheels.some(w => w.id === selectedWheel)) selectedWheel = availableWheels[0].id;
    if (!availableInteriors.some(i => i.id === selectedInterior)) selectedInterior = availableInteriors[0].id;
    if (!availableDashboards.some(d => d.id === selectedDashboard)) selectedDashboard = availableDashboards[0].id;

    const currentColorObj = availableColors.find(c => c.id === selectedColor);
    const currentWheelObj = availableWheels.find(w => w.id === selectedWheel);
    const currentInteriorObj = availableInteriors.find(i => i.id === selectedInterior);
    const currentDashboardObj = availableDashboards.find(d => d.id === selectedDashboard);

    let packagesPrice = 0;
    selectedPackages.forEach(pkgId => {
      const pkgObj = availablePackages.find(p => p.id === pkgId);
      if (pkgObj) packagesPrice += pkgObj.price;
    });

    const optionalPrice = 
      (currentColorObj ? currentColorObj.price : 0) + 
      (currentWheelObj ? currentWheelObj.price : 0) +
      (currentInteriorObj ? currentInteriorObj.price : 0) +
      (currentDashboardObj ? currentDashboardObj.price : 0) +
      packagesPrice;

    const totalPrice = basePrice + optionalPrice;

    const formattedListPrice = basePrice.toLocaleString("it-IT") + " €";
    const formattedOptionalPrice = optionalPrice.toLocaleString("it-IT") + " €";
    const formattedTotalPrice = totalPrice.toLocaleString("it-IT") + " €";

    const tutteLeSelezioniCorrenti = [
      selectedColor,
      selectedWheel,
      selectedInterior,
      selectedDashboard,
      ...selectedPackages
    ];

    const updateStep = (stepNumber) => {
      currentStep = stepNumber;
      renderContent();
    };

    const handleNext = () => {
      if (currentStep < 5) {
        currentStep++;
        renderContent();
      } else {
        alert("Configurazione completata! Caricamento del riepilogo...");
      }
    };

    const togglePackage = (pkgId) => {
      if (selectedPackages.includes(pkgId)) {
        selectedPackages = selectedPackages.filter(id => id !== pkgId);
      } else {
        const haConflitto = regoleIncompatibilita.find(r => 
          (r.a === pkgId && tutteLeSelezioniCorrenti.includes(r.b)) ||
          (r.b === pkgId && tutteLeSelezioniCorrenti.includes(r.a))
        );

        if (haConflitto) {
          alert("questo pacchetto non e compatibile con gli optional o i pacchetti scelti in precedenza!");
          return;
        }
        selectedPackages.push(pkgId);
      }
      renderContent();
    };

    const mainStructure = [
      jd.div({ className: "w-full h-16 border-b border-neutral-900 bg-black px-6 flex items-center justify-between shrink-0" }, [
        jd.div({ className: "flex items-center gap-4" }, [
          jd.a({ 
            href: "/homepage",
            className: "btn btn-ghost btn-circle text-neutral-400 hover:text-white flex items-center justify-center" 
          }, [
            jd.lucide("ArrowLeft", { className: "size-5" })
          ]),
          jd.div({ className: "flex flex-col text-left" }, [
            jd.span({ className: "text-[10px] uppercase font-bold tracking-widest text-neutral-500" }, ["Fillantis"]),
            jd.span({ className: "text-sm font-black uppercase tracking-wider" }, ["Configuratore"])
          ])
        ]),
        
        Steps({ currentStep: currentStep, onStepChange: updateStep }),

        jd.div({ className: "flex items-center gap-2" }, [
          jd.span({ className: "text-xs font-bold tracking-wider text-neutral-400" }, ["ID: #CFG942"])
        ])
      ]),

      jd.div({ className: "flex-1 w-full grid grid-cols-1 lg:grid-cols-3 overflow-hidden" }, [
        
        jd.div({ className: "lg:col-span-1 bg-black border-r border-neutral-900 overflow-y-auto p-6 flex flex-col gap-8" }, [
          
          currentStep === 1 ? jd.div({ className: "flex flex-col gap-6 text-left" }, [
            jd.div({ className: "flex flex-col gap-2" }, [
              jd.span({ className: "text-xs font-bold text-red-500 uppercase tracking-widest" }, ["Fase 1"]),
              jd.h3({ className: "text-xl font-black uppercase tracking-tight" }, ["Seleziona Brand e Modello"]),
              jd.p({ className: "text-xs text-neutral-400 leading-relaxed font-medium" }, ["Scegli la marca e il modello di partenza per la tua configurazione dal pannello principale."])
            ])
          ]) : null,

          currentStep === 2 ? jd.div({ className: "flex flex-col gap-4 text-left" }, [
            jd.span({ className: "text-xs font-bold text-red-500 uppercase tracking-widest" }, ["Fase 2"]),
            jd.h3({ className: "text-xl font-black uppercase tracking-tight" }, ["Scegli il motore"]),
            jd.p({ className: "text-xs text-neutral-400 leading-relaxed font-medium" }, ["Trova la propulsione ideale. Le architetture e i listini sono aggiornati alle ultime specifiche di gamma."])
          ]) : null,

          currentStep === 3 ? jd.div({ className: "flex flex-col gap-6" }, [
            jd.div({ className: "flex flex-col gap-2 text-left" }, [
              jd.span({ className: "text-xs font-bold text-red-500 uppercase tracking-widest" }, ["Fase 3"]),
              jd.h3({ className: "text-xl font-black uppercase tracking-tight" }, ["Personalizza gli Esterni"]),
              jd.p({ className: "text-xs text-neutral-400 leading-relaxed font-medium" }, [
                `Catalogo originale per ${selectedBrand}. Scegli la verniciatura ufficiale della casa e abbina il design dei cerchi in lega.`
              ])
            ])
          ]) : null,

          currentStep === 4 ? jd.div({ className: "flex flex-col gap-4 text-left" }, [
            jd.span({ className: "text-xs font-bold text-red-500 uppercase tracking-widest" }, ["Fase 4"]),
            jd.h3({ className: "text-xl font-black uppercase tracking-tight" }, ["Configura gli Interni"]),
            jd.p({ className: "text-xs text-neutral-400 leading-relaxed font-medium" }, [
              `Abitacolo personalizzato per ${selectedBrand}. Definisci la tipologia di selleria e i materiali delle modanature plancia.`
            ])
          ]) : null,

          currentStep === 5 ? jd.div({ className: "flex flex-col gap-4 text-left" }, [
            jd.span({ className: "text-xs font-bold text-red-500 uppercase tracking-widest" }, ["Fase 5"]),
            jd.h3({ className: "text-xl font-black uppercase tracking-tight" }, ["Aggiungi i Pacchetti"]),
            jd.p({ className: "text-xs text-neutral-400 leading-relaxed font-medium" }, [
              `Sistemi opzionali avanzati per ${selectedBrand}. Seleziona i pacchetti di assistenza e upgrade multimediali desiderati.`
            ])
          ]) : null,

          jd.div({ className: "w-full border-t border-neutral-900 pt-6 flex flex-col gap-4 text-left mt-auto" }, [
            jd.div({ className: "p-4 bg-neutral-900/20 border border-neutral-900 rounded-xl flex flex-col gap-2 text-xs font-medium text-neutral-400" }, [
              jd.div({ className: "flex justify-between" }, [jd.span({}, ["Prezzo di listino:"]), jd.span({ className: "text-white" }, [formattedListPrice])]),
              jd.div({ className: "flex justify-between" }, [jd.span({}, ["Optional selezionati:"]), jd.span({ className: "text-white" }, [formattedOptionalPrice])]),
              jd.div({ className: "w-full h-px bg-neutral-900 my-1" }),
              jd.div({ className: "flex justify-between items-end" }, [
                jd.span({ className: "font-bold uppercase tracking-wide text-white" }, ["Totale stimato:"]), 
                jd.span({ className: "text-xl font-black text-white" }, [formattedTotalPrice])
              ])
            ])
          ])

        ].filter(Boolean)),

        jd.div({ className: "lg:col-span-2 bg-neutral-900/20 relative flex flex-col items-center justify-center p-6" }, [
          currentStep === 1 ? 
            jd.div({ className: "w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-[-40px]" }, [
              jd.div({ className: "flex flex-col gap-4 text-left" }, [
                jd.span({ className: "text-xs font-bold text-neutral-400 uppercase tracking-wider" }, ["Marca"]),
                jd.div({ className: "grid grid-cols-2 gap-2" }, 
                  ["FIAT", "Alfa Romeo", "Lancia", "Abarth", "Audi", "BMW", "Volkswagen", "Mercedes"].map(brand => {
                    const isBrandSelected = selectedBrand === brand;
                    return jd.button({
                      onClick: () => {
                        selectedBrand = brand;
                        const models = modelsMap[brand] || [];
                        selectedModel = models.length > 0 ? models[0] : "";
                        const engines = enginesMap[selectedModel] || [];
                        selectedEngine = engines.length > 0 ? engines[0].id : "";
                        selectedPackages = [];
                        renderContent();
                      },
                      className: `py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
                        isBrandSelected ? "bg-white text-black border-white" : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                      }`
                    }, [brand]);
                  })
                )
              ]),
              jd.div({ className: "flex flex-col gap-4 text-left w-full" }, [
                jd.span({ className: "text-xs font-bold text-neutral-400 uppercase tracking-wider" }, ["Modello"]),
                jd.div({ className: "flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1" }, 
                  currentModels.map(model => {
                    const isModelSelected = selectedModel === model;
                    return jd.div({
                      onClick: () => {
                        selectedModel = model;
                        const engines = enginesMap[model] || [];
                        selectedEngine = engines.length > 0 ? engines[0].id : "";
                        selectedPackages = [];
                        renderContent();
                      },
                      className: `w-full p-4 rounded-xl flex items-center justify-between cursor-pointer transition-colors border ${
                        isModelSelected ? "bg-neutral-900 border-red-500" : "bg-neutral-950 border-neutral-900 hover:border-neutral-800"
                      }`
                    }, [
                      jd.span({ className: "text-sm font-bold uppercase tracking-wide text-white" }, [model]),
                      jd.span({ className: `text-xs font-bold ${isModelSelected ? "text-red-500" : "text-neutral-500"}` }, [
                        isModelSelected ? "Selezionato" : "Seleziona"
                      ])
                    ]);
                  })
                )
              ])
            ])
          : currentStep === 2 ?
            jd.div({ className: "w-full max-w-2xl flex flex-col gap-4 text-left mt-[-40px]" }, [
              jd.span({ className: "text-xs font-bold text-neutral-400 uppercase tracking-wider" }, [
                `Motorizzazioni disponibili per ${selectedBrand} ${selectedModel}`
              ]),
              jd.div({ className: "flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1" }, 
                availableEngines.map(engine => {
                  const isEngineSelected = selectedEngine === engine.id;
                  return jd.div({
                    onClick: () => {
                      selectedEngine = engine.id;
                      renderContent();
                    },
                    className: `w-full p-5 rounded-xl flex items-center justify-between cursor-pointer transition-colors border ${
                      isEngineSelected ? "bg-neutral-900 border-red-500" : "bg-neutral-950 border-neutral-900 hover:border-neutral-800"
                    }`
                  }, [
                    jd.div({ className: "flex flex-col gap-1 text-left max-w-[75%]" }, [
                      jd.span({ className: "text-sm font-bold text-white uppercase tracking-wide leading-tight" }, [engine.name]),
                      jd.span({ className: "text-xs text-neutral-400" }, ["omologazione euro 6e specifiche di gamma correnti"])
                    ]),
                    jd.div({ className: "flex flex-col items-end gap-1 shrink-0" }, [
                      jd.span({ className: "text-sm font-black text-white" }, [engine.price.toLocaleString("it-IT") + " €"]),
                      jd.span({ className: `text-[10px] uppercase font-bold tracking-wider ${isEngineSelected ? "text-red-500" : "text-neutral-500"}` }, [
                        isEngineSelected ? "Incluso" : "Seleziona"
                      ])
                    ])
                  ]);
                })
              )
            ])
          : currentStep === 3 ?
            jd.div({ className: "w-full max-w-3xl flex flex-col gap-8 text-left mt-[-40px]" }, [
              jd.div({ className: "flex flex-col gap-4" }, [
                jd.span({ className: "text-xs font-bold text-neutral-400 uppercase tracking-wider" }, [`1. Tinta Carrozzeria Ufficiale - Gamma ${selectedBrand}`]),
                jd.div({ className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3" }, 
                  availableColors.map(color => {
                    const isColorSelected = selectedColor === color.id;
                    return jd.div({
                      onClick: () => {
                        selectedColor = color.id;
                        renderContent();
                      },
                      className: `p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-colors border ${
                        isColorSelected ? "bg-neutral-900 border-red-500" : "bg-neutral-950 border-neutral-900 hover:border-neutral-800"
                      }`
                    }, [
                      jd.div({ className: `size-6 rounded-full shrink-0 border border-white/10 ${color.colorClass}` }),
                      jd.div({ className: "flex flex-col text-left overflow-hidden" }, [
                        jd.span({ className: "text-xs font-bold text-white uppercase tracking-wide truncate max-w-[120px]" }, [color.name]),
                        jd.span({ className: "text-[10px] text-neutral-400 font-bold" }, [color.price === 0 ? "Incluso" : `+ ${color.price} €`])
                      ])
                    ]);
                  })
                )
              ]),
              jd.div({ className: "flex flex-col gap-4 border-t border-neutral-900 pt-6" }, [
                jd.span({ className: "text-xs font-bold text-neutral-400 uppercase tracking-wider" }, ["2. Opzioni Cerchi e Pneumatici"]),
                jd.div({ className: "flex flex-col gap-2.5" }, 
                  availableWheels.map(wheel => {
                    const isWheelSelected = selectedWheel === wheel.id;
                    return jd.div({
                      onClick: () => {
                        selectedWheel = wheel.id;
                        renderContent();
                      },
                      className: `p-4 rounded-xl flex items-center justify-between cursor-pointer transition-colors border ${
                        isWheelSelected ? "bg-neutral-900 border-red-500" : "bg-neutral-950 border-neutral-900 hover:border-neutral-800"
                      }`
                    }, [
                      jd.div({ className: "flex items-center gap-4 text-left" }, [
                        jd.div({ className: "size-10 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center font-black text-xs text-neutral-400 shrink-0" }, [
                          `${wheel.size}"`
                        ]),
                        jd.div({ className: "flex flex-col" }, [
                          jd.span({ className: "text-xs font-bold text-white uppercase tracking-wide" }, [wheel.title]),
                          jd.span({ className: "text-[10px] text-neutral-500" }, [`assetto e parametri di rotolamento calibrati per ${selectedModel}`])
                        ])
                      ]),
                      jd.span({ className: "text-xs font-black text-white shrink-0 pl-4" }, [
                        wheel.price === 0 ? "Di serie" : `+ ${wheel.price.toLocaleString("it-IT")} €`
                      ])
                    ]);
                  })
                )
              ])
            ])
          : currentStep === 4 ?
            jd.div({ className: "w-full max-w-3xl flex flex-col gap-8 text-left mt-[-40px]" }, [
              jd.div({ className: "flex flex-col gap-4" }, [
                jd.span({ className: "text-xs font-bold text-neutral-400 uppercase tracking-wider" }, [`1. Rivestimento Sedili e Selleria - Gamma ${selectedBrand}`]),
                jd.div({ className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" }, 
                  availableInteriors.map(interior => {
                    const isInteriorSelected = selectedInterior === interior.id;
                    
                    const haConflittoInterno = regoleIncompatibilita.some(r => 
                      (r.a === interior.id && tutteLeSelezioniCorrenti.includes(r.b)) ||
                      (r.b === interior.id && tutteLeSelezioniCorrenti.includes(r.a))
                    );

                    return jd.div({
                      onClick: () => {
                        if (haConflittoInterno) {
                          alert("questo rivestimento interno non e compatibile con uno dei pacchetti scelti nella fase successiva!");
                          return;
                        }
                        selectedInterior = interior.id;
                        renderContent();
                      },
                      className: `p-3 rounded-xl flex items-center gap-3 transition-colors border ${
                        haConflittoInterno ? "opacity-30 border-neutral-900 cursor-not-allowed bg-neutral-950/40" : "cursor-pointer"
                      } ${
                        isInteriorSelected ? "bg-neutral-900 border-red-500" : "bg-neutral-950 border-neutral-900 hover:border-neutral-800"
                      }`
                    }, [
                      jd.div({ className: `size-6 rounded-md shrink-0 border border-white/10 ${interior.colorClass}` }),
                      jd.div({ className: "flex flex-col text-left overflow-hidden" }, [
                        jd.span({ className: "text-xs font-bold text-white uppercase tracking-wide truncate max-w-[160px]" }, [interior.name]),
                        jd.span({ className: "text-[10px] font-bold " + (haConflittoInterno ? "text-red-500" : "text-neutral-400") }, [
                          haConflittoInterno ? "incompatibile" : (interior.price === 0 ? "Di serie" : `+ ${interior.price} €`)
                        ])
                      ])
                    ]);
                  })
                )
              ]),
              jd.div({ className: "flex flex-col gap-4 border-t border-neutral-900 pt-6" }, [
                jd.span({ className: "text-xs font-bold text-neutral-400 uppercase tracking-wider" }, ["2. Architettura Plancia e Modanature Interne"]),
                jd.div({ className: "flex flex-col gap-2.5" }, 
                  availableDashboards.map(dash => {
                    const isDashSelected = selectedDashboard === dash.id;
                    return jd.div({
                      onClick: () => {
                        selectedDashboard = dash.id;
                        renderContent();
                      },
                      className: `p-4 rounded-xl flex items-center justify-between cursor-pointer transition-colors border ${
                        isDashSelected ? "bg-neutral-900 border-red-500" : "bg-neutral-950 border-neutral-900 hover:border-neutral-800"
                      }`
                    }, [
                      jd.div({ className: "flex items-center gap-4 text-left" }, [
                        jd.div({ className: "size-8 bg-neutral-900 border border-neutral-800 rounded flex items-center justify-center shrink-0" }, [
                          jd.lucide("Layers", { className: "size-4 text-neutral-500" })
                        ]),
                        jd.div({ className: "flex flex-col" }, [
                          jd.span({ className: "text-xs font-bold text-white uppercase tracking-wide" }, [dash.title]),
                          jd.span({ className: "text-[10px] text-neutral-500" }, [`finiture coordinate con l estetica di ${selectedModel}`])
                        ])
                      ]),
                      jd.span({ className: "text-xs font-black text-white shrink-0 pl-4" }, [
                        dash.price === 0 ? "Incluso" : `+ ${dash.price.toLocaleString("it-IT")} €`
                      ])
                    ]);
                  })
                )
              ])
            ])
          : currentStep === 5 ?
            jd.div({ className: "w-full max-w-3xl flex flex-col gap-4 text-left mt-[-40px]" }, [
              jd.span({ className: "text-xs font-bold text-neutral-400 uppercase tracking-wider" }, [
                `Sistemi opzionali e pacchetti di equipaggiamento - Gamma ${selectedBrand}`
              ]),
              jd.div({ className: "flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1" }, 
                availablePackages.map(pkg => {
                  const isPkgSelected = selectedPackages.includes(pkg.id);
                  
                  const haConflittoPacchetto = !isPkgSelected && regoleIncompatibilita.some(r => 
                    (r.a === pkg.id && tutteLeSelezioniCorrenti.includes(r.b)) ||
                    (r.b === pkg.id && tutteLeSelezioniCorrenti.includes(r.a))
                  );

                  return jd.div({
                    onClick: () => togglePackage(pkg.id),
                    className: `w-full p-5 rounded-xl flex items-center justify-between transition-colors border ${
                      haConflittoPacchetto ? "opacity-35 border-neutral-900 cursor-not-allowed bg-neutral-950/40" : "cursor-pointer"
                    } ${
                      isPkgSelected ? "bg-neutral-900 border-red-500" : "bg-neutral-950 border-neutral-900 hover:border-neutral-800"
                    }`
                  }, [
                    jd.div({ className: "flex items-center gap-4 text-left max-w-[75%]" }, [
                      jd.div({ className: `size-10 rounded-lg flex items-center justify-center shrink-0 border ${
                        haConflittoPacchetto ? "bg-neutral-900 border-neutral-900 text-neutral-700" :
                        isPkgSelected ? "bg-red-950/40 border-red-800 text-red-500" : "bg-neutral-900 border-neutral-800 text-neutral-500"
                      }` }, [
                        jd.lucide(haConflittoPacchetto ? "AlertTriangle" : (isPkgSelected ? "CheckSquare" : "Square"), { className: "size-5" })
                      ]),
                      jd.div({ className: "flex flex-col gap-0.5" }, [
                        jd.span({ className: "text-sm font-bold text-white uppercase tracking-wide leading-tight" }, [pkg.title]),
                        jd.span({ className: "text-xs text-neutral-400 leading-normal" }, [pkg.desc])
                      ])
                    ]),
                    jd.div({ className: "flex flex-col items-end gap-1 shrink-0 pl-4" }, [
                      jd.span({ className: "text-sm font-black text-white" }, [
                        haConflittoPacchetto ? "bloccato" : `+ ${pkg.price.toLocaleString("it-IT")} €`
                      ]),
                      jd.span({ className: `text-[10px] uppercase font-bold tracking-wider ${haConflittoPacchetto ? "text-red-500" : isPkgSelected ? "text-red-500" : "text-neutral-500"}` }, [
                        haConflittoPacchetto ? "incompatibile" : (isPkgSelected ? "Selezionato" : "Aggiungi")
                      ])
                    ])
                  ]);
                })
              )
            ])
          : 
            jd.div({ className: "w-full max-w-3xl aspect-[16/9] flex items-center justify-center relative mt-[-40px]" }, [
              jd.img({ 
                src: "/car-render.png", 
                alt: "Configurator View", 
                className: "w-full h-full object-contain select-none" 
              })
            ])
        ])

      ]),

     jd.div({ className: "w-full h-20 border-t border-neutral-900 bg-neutral-950 px-6 flex items-center justify-between shrink-0 z-10" }, [
        jd.div({ className: "flex flex-col text-left" }, []),
        
        jd.div({ className: "flex items-center gap-4" }, [
          jd.button({ 
            onClick: async () => {
              if (currentStep === 5) {
                showLoader("Salvataggio e generazione preventivo...");

                const loggedUserId = localStorage.getItem("userId") || "1";

                let mappingAbbinamentoId = 1;
                if (selectedModel === "Tonale") mappingAbbinamentoId = 1;
                else if (selectedModel === "500e" || selectedModel === "500") mappingAbbinamentoId = 2;
                else if (selectedModel === "Ypsilon") mappingAbbinamentoId = 3;
                else if (selectedModel === "Grande Panda") mappingAbbinamentoId = 4;
                else if (selectedModel === "Topolino") mappingAbbinamentoId = 5;
                else if (selectedModel === "Giulia") mappingAbbinamentoId = 6;
                else if (selectedModel === "Stelvio") mappingAbbinamentoId = 7;
                else if (selectedModel === "600e") mappingAbbinamentoId = 8;
                else if (selectedModel === "A3") mappingAbbinamentoId = 9;
                else if (selectedModel === "A5") mappingAbbinamentoId = 10;
                else if (selectedModel === "Q5") mappingAbbinamentoId = 11;
                else if (selectedModel === "Serie 1") mappingAbbinamentoId = 12;
                else if (selectedModel === "Serie 3") mappingAbbinamentoId = 13;
                else if (selectedModel === "X1") mappingAbbinamentoId = 14;
                else if (selectedModel === "Golf") mappingAbbinamentoId = 15;
                else if (selectedModel === "Polo") mappingAbbinamentoId = 16;
                else if (selectedModel === "Tiguan") mappingAbbinamentoId = 17;
                else if (selectedModel === "Classe A") mappingAbbinamentoId = 18;
                else if (selectedModel === "Classe C") mappingAbbinamentoId = 19;
                else if (selectedModel === "GLA") mappingAbbinamentoId = 20;

                const listaOptionalScelti = [];

                const mappaOptionalAIdDatabase = (frontEndId) => {
                  const dizionarioId = {
                    "fi-c1": 1, "fi-c2": 2, "fi-c3": 3, "fi-c4": 4,
                    "fi-w1": 5, "fi-w2": 6, "fi-i1": 7, "fi-i2": 8, "fi-d1": 9, "fi-d2": 10, "fi-p1": 11, "fi-p2": 12,
                    "al-c1": 13, "al-c2": 14, "al-c3": 15, "al-c4": 16,
                    "al-w1": 17, "al-w2": 18, "al-w3": 19, "al-i1": 20, "al-i2": 21, "al-i3": 22, "al-d1": 23, "al-d2": 24, "al-p1": 25, "al-p2": 26,
                    "la-c1": 27, "la-c2": 28, "la-c3": 29, "la-c4": 30,
                    "la-w1": 31, "la-w2": 32, "la-i1": 33, "la-i2": 34, "la-d1": 35, "la-d2": 36, "la-p1": 37, "la-p2": 38,
                    "ab-c1": 39, "ab-c2": 40, "ab-c3": 41, "ab-c4": 42,
                    "ab-w1": 43, "ab-w2": 44, "ab-i1": 45, "ab-i2": 46, "ab-d1": 47, "ab-d2": 48, "ab-p1": 49, "ab-p2": 50,
                    "au-c1": 51, "au-c2": 52, "au-c3": 53, "au-c4": 54,
                    "au-w1": 55, "au-w2": 56, "au-w3": 57, "au-i1": 58, "au-i2": 59, "au-i3": 60, "au-d1": 61, "au-d2": 62, "au-d3": 63, "au-p1": 64, "au-p2": 65, "au-p3": 66,
                    "bm-c1": 67, "bm-c2": 68, "bm-c3": 69, "bm-c4": 70,
                    "bm-w1": 71, "bm-w2": 72, "bm-w3": 73, "bm-i1": 74, "bm-i2": 75, "bm-i3": 76, "bm-d1": 77, "bm-d2": 78, "bm-d3": 79, "bm-p1": 80, "bm-p2": 81, "bm-p3": 82,
                    "vw-c1": 83, "vw-c2": 84, "vw-c3": 85, "vw-c4": 86,
                    "vw-w1": 87, "vw-w2": 88, "vw-w3": 89, "vw-i1": 90, "vw-i2": 91, "vw-i3": 92, "vw-d1": 93, "vw-d2": 94, "vw-p1": 95, "vw-p2": 96, "vw-p3": 97,
                    "me-c1": 98, "me-c2": 99, "me-c3": 100, "me-c4": 101,
                    "me-w1": 102, "me-w2": 103, "me-w3": 104, "me-i1": 105, "me-i2": 106, "me-i3": 107, "me-d1": 108, "me-d2": 109, "me-d3": 110, "me-p1": 111, "me-p2": 112, "me-p3": 113
                  };
                  return dizionarioId[frontEndId] || null;
                };

                if (currentColorObj && currentColorObj.price > 0) {
                  const idDb = mappaOptionalAIdDatabase(selectedColor);
                  if (idDb) listaOptionalScelti.push(idDb);
                }

                if (currentWheelObj && currentWheelObj.price > 0) {
                  const idDb = mappaOptionalAIdDatabase(selectedWheel);
                  if (idDb) listaOptionalScelti.push(idDb);
                }

                if (currentInteriorObj && currentInteriorObj.price > 0) {
                  const idDb = mappaOptionalAIdDatabase(selectedInterior);
                  if (idDb) listaOptionalScelti.push(idDb);
                }

                if (currentDashboardObj && currentDashboardObj.price > 0) {
                  const idDb = mappaOptionalAIdDatabase(selectedDashboard);
                  if (idDb) listaOptionalScelti.push(idDb);
                }

                selectedPackages.forEach(pkgId => {
                  const idDb = mappaOptionalAIdDatabase(pkgId);
                  if (idDb) {
                    listaOptionalScelti.push(idDb);
                  } else {
                    listaOptionalScelti.push(1);
                  }
                });

                const payload = {
                  id_utente: parseInt(loggedUserId),
                  id_abbinamento: mappingAbbinamentoId,
                  optional: listaOptionalScelti
                };

                try {
                  console.log("PAYLOAD REALE INVIATO A FLASK:", payload);
                  
                  const response = await fetch("http://localhost:5000/api/preventivi", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                  });

                  const result = await response.json();
                  hideLoader();

                  if (result.success) {
                    alert("Configurazione reale registrata con successo!");
                    window.location.href = "/preventivi";
                  } else {
                    alert("Errore del server: " + result.errore);
                  }
                } catch (error) {
                  hideLoader();
                  console.error("Errore di rete:", error);
                  alert("Impossibile connettersi al server Flask.");
                }
              } else {
                handleNext();
              }
            },
            className: "px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-lg shadow-red-600/20 cursor-pointer" 
          }, [
            currentStep === 5 ? "Completa Ordine" : "Prosegui"
          ])
        ])
      ])
    ];

    mainStructure.forEach(el => container.appendChild(el));
  };

  renderContent();
  return container;
}