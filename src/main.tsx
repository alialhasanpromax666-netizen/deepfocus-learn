import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { useI18n } from "@/i18n";
import "./styles/global.css";
import "./styles/landing.css";

// apply the initial document direction from the stored language.
useI18n.getState().setLang(useI18n.getState().lang);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
