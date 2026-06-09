import "./style.css";
import { createRoot } from "just-dom";
import { jd } from "./jd.config.js";
import { defineRoutes } from "@just-dom/router";
import { DashBoardPage } from "./pages/dashboard-page.js";
import { LoginPage } from "./pages/login-page.js";

const routes = defineRoutes([
  {
    layout: DashBoardPage,
    children: [
      { path: '/homepage', element: DashBoardPage },
    ]
  },
  {
    path: '/login',
    element: LoginPage
  }
])

createRoot(
  "app",
  jd.router(routes)
);