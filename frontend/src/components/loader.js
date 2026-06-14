import { jd } from "../jd.config";

export function showLoader(message = "Caricamento in corso...") {
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

export function hideLoader() {
  const loader = document.getElementById("global-loader");
  if (loader) {
    loader.remove();
  }
}