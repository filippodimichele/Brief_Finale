import { jd } from "../jd.config";

export function WheelOption({ size, title, description, price, isSelected }) {
  return jd.div({ 
    className: `w-full p-4 border-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
      isSelected ? "bg-neutral-900/50 border-red-600" : "bg-neutral-950 border-neutral-900 hover:border-neutral-800"
    }` 
  }, [
    jd.div({ className: "flex items-center gap-4" }, [
      jd.div({ 
        className: `w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold ${
          isSelected ? "bg-neutral-800 text-white" : "bg-neutral-900 text-neutral-500"
        }` 
      }, [`${size}"`]),
      jd.div({ className: "flex flex-col text-left" }, [
        jd.span({ className: `text-sm font-bold uppercase tracking-wide ${isSelected ? "text-white" : "text-neutral-300"}` }, [title]),
        jd.span({ className: "text-xs text-neutral-500 font-medium" }, [description])
      ])
    ]),
    jd.span({ className: `text-xs font-bold ${isSelected ? "text-red-500" : "text-neutral-300"}` }, [price])
  ]);
}