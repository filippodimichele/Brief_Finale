import { jd } from "../jd.config";

export function DashBoardPage() {
  return jd.div({ className: "navbar bg-black shadow-sm h-20" }, [
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
            className: "menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow",
          },
          [
            jd.li({}, [jd.a({}, ["Homepage"])]),
            jd.li({}, [jd.a({}, ["Portfolio"])]),
            jd.li({}, [jd.a({}, ["About"])]),
          ]
        ),
      ]),
    ]),
    jd.div({ className: "navbar-center flex items-center justify-center" }, [
      jd.a({ className: "flex items-center justify-center h-full" }, [
        jd.img({ 
          src: "/logo.png", 
          alt: "Logo", 
          className: "h-14 w-auto object-contain" 
        })
      ]),
    ]),
    jd.div({ className: "navbar-end" }, [
      jd.button({ className: "btn btn-ghost btn-circle text-white" }, [
        jd.lucide("Search", { className: "size-5" }),
      ]),
      jd.button({ className: "btn btn-ghost btn-circle text-white" }, [
        jd.div({ className: "indicator" }, [
          jd.lucide("Bell", { className: "size-5" }),
          jd.span({ className: "badge badge-xs badge-primary indicator-item" }),
        ]),
      ]),
    ]),
  ]);
}