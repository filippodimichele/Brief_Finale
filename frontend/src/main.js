import "./style.css";
import { createRoot } from "just-dom";
import { jd } from "./jd.config.js";
import { defineRoutes } from "@just-dom/router";
import { DashBoardPage } from "./pages/dashboard-page.js";
import { LoginPage } from "./pages/login-page.js";
import { PreventiviPage } from "./pages/preventivi-page.js";
import { ModelliPage } from "./pages/modelli-page.js";
import { ConfiguratorPage } from "./pages/configurator-page.js";

const routes = defineRoutes([
  { 
    path: '/login', 
    element: LoginPage
  },
  { 
    path: '/configuratore', 
    element: ConfiguratorPage
  },
  { 
    path: '/modelli', 
    element: ModelliPage
  },
  { 
    path: '/preventivi', 
    element: PreventiviPage
  },
  { 
    path: '/preventivi/admin', 
    element: PreventiviPage
  },
  {
    path: '/homepage', 
    element: DashBoardPage 
  }
]);
  
createRoot(
  "app",
  jd.router(routes)
);