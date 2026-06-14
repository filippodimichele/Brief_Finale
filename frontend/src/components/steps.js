import { jd } from "../jd.config";

export function Steps({ currentStep, onStepChange }) {
  const steps = ["Allestimento", "Motorizzazione", "Esterni", "Interni", "Pacchetti"];
  
  return jd.div({ className: "hidden md:flex items-center gap-8 h-full" }, [
    ...steps.map((step, index) => {
      const stepNumber = index + 1;
      const isSelected = stepNumber === currentStep;
      
      return jd.button({ 
        onClick: () => onStepChange(stepNumber),
        className: `h-full border-b-2 text-xs font-bold uppercase tracking-wider px-2 transition-colors ${
          isSelected ? "border-red-600 text-white" : "border-transparent text-neutral-500 hover:text-neutral-300"
        }` 
      }, [`${stepNumber}. ${step}`]);
    })
  ]);
}