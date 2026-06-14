import { jd } from "../jd.config";

export function DashBoardPage() {
  return jd.div({ className: "min-h-screen bg-black flex flex-col overflow-y-auto" }, [
    jd.div({ className: "navbar bg-black shadow-sm h-35 shrink-0" }, [
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
        jd.a({ className: "flex items-center justify-center h-full " }, [
          jd.img({ 
            src: "/logo.png", 
            alt: "Logo", 
            className: "h-35 w-auto object-contain" 
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
    jd.div({ className: "flex-1 w-full flex flex-col items-center" }, [
      jd.img({
        src: "/image.png",
        alt: "Body Content 1",
        className: "max-w-max h-100 object-contain rounded-box shadow-lg"
      }),
      jd.img({
        src: "/image-2.png",
        alt: "Body Content 2",
        className: "w-full h-auto object-cover"
      })
    ])
  ]);
}