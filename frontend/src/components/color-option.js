import { jd } from "../jd.config";

export function ColorOption({ colorClass, name, isSelected }) {
  return jd.div({ className: `flex flex-col items-center gap-2 cursor-pointer group ${isSelected ? "" : "opacity-60 hover:opacity-100 transition-opacity"}` }, [
    jd.div({ className: `w-12 h-12 rounded-full ${colorClass} ${isSelected ? "border-2 border-white p-0.5 shadow-lg" : "border border-neutral-800"}` }),
    jd.span({ className: `text-[10px] font-bold uppercase tracking-wide ${isSelected ? "text-white" : "text-neutral-400 group-hover:text-white"}` }, [name])
  ]);
}