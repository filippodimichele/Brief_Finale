import { jd } from "../jd.config.js";

const THEME_KEY = "jd-theme";

export function readStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "dark" || v === "light") return v;
  } catch {}
  return "light";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

export function themeToggleButton() {
  return jd.button(
    {
      type: "button",
      className: "btn btn-ghost btn-circle",
      ariaLabel: "Toggle theme",
      onclick: () => {
        const next =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";
        applyTheme(next);
      },
    },
    [
      jd.span({ className: "hidden dark:inline" }, [
        jd.svg(
          {
            viewBox: "0 0 24 24",
            width: "20",
            height: "20",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            ariaHidden: "true",
          },
          [
            jd.svgPath({
              d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9",
            }),
          ],
        ),
      ]),
      jd.span({ className: "inline dark:hidden" }, [
        jd.svg(
          {
            viewBox: "0 0 24 24",
            width: "20",
            height: "20",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            ariaHidden: "true",
          },
          [
            jd.svgCircle({ cx: "12", cy: "12", r: "4" }),
            jd.svgPath({
              d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M19.07 4.93l-1.41 1.41M6.34 17.66l-1.41 1.41",
            }),
          ],
        ),
      ]),
    ],
  );
}
