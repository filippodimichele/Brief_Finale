import { jd } from "../jd.config";

export function Layout(children) {
  return jd.div({ className: "min-h-screen bg-neutral-950 text-white select-none" }, [
    children
  ]);
}