import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
// Fuentes servidas desde el propio sitio (sin peticiones a Google Fonts).
// Los títulos van siempre en cursiva: Lora necesita también su archivo itálico.
import "@fontsource-variable/lora";
import "@fontsource-variable/lora/wght-italic.css";
import "@fontsource-variable/inter";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
