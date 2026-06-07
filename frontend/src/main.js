import "./style.css";
import { createRoot } from "just-dom";
import { jd } from "./jd.config.js";
import {
  applyTheme,
  readStoredTheme,
  themeToggleButton,
} from "./components/theme-toggle";

applyTheme(readStoredTheme());

createRoot(
  "app",
  jd.div({ className: "min-h-screen bg-base-100 text-base-content font-sans" }, [
    jd.div({ className: "max-w-2xl mx-auto px-6 py-8" }, [
      jd.div({ className: "flex items-center justify-between gap-3 mb-3" }, [
        jd.h1({ className: "text-3xl font-bold" }, ["Vite + Just DOM"]),
        themeToggleButton(),
      ]),
      jd.p({ className: "text-base-content/70 leading-relaxed" }, [
        "Edit ",
        jd.code(
          {
            className:
              "bg-base-200 text-base-content rounded px-1.5 py-0.5 text-sm font-mono",
          },
          ["src/main.js"],
        ),
        " to get started. Add plugins in ",
        jd.code(
          {
            className:
              "bg-base-200 text-base-content rounded px-1.5 py-0.5 text-sm font-mono",
          },
          ["src/jd.config.js"],
        ),
        ".",
      ]),
      jd.button({ className: "btn btn-primary mt-4" }, ["Click me"]),
    ]),
  ]),
);
